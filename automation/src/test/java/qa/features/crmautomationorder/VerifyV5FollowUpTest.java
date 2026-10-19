package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;

/** Follow-up re-verification (19 Oct 2026) after the first V run: delayed actions, blueprint sort, F-20 governance, profile. Session V5. */
public class VerifyV5FollowUpTest extends VerifyBase {
    @Override protected String session() { return "V5"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private static final String HOOK = "https://httpbin.org/post";
    private final List<String> rules = new ArrayList<>();

    @org.testng.annotations.AfterMethod(alwaysRun = true)
    public void dropRules() {
        for (String id : rules) {
            adminB().post("/workflow/rules/" + id + "/deactivate", null);
            out("[V cleanup] delete rule " + id + " -> " + adminB().delete("/workflow/rules/" + id).statusCode());
        }
        rules.clear();
    }

    private String wf(String c, CrmProcs.Wf w) {
        Response r = post(c, adminB(), "/workflow/rules", w.build());
        CrmUser.ok(r, "create rule");
        String id = r.jsonPath().getString("data.id");
        rules.add(id);
        on(c, "workflow " + id, api.setWorkflowActive(id, true));
        return id;
    }

    private String lead(String c, String sfx, Map<String, Object> more) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, sfx)));
        if (more != null) f.putAll(more);
        return createLogged(c, userN(), LEADS, f);
    }

    private String dispatches(String recordId) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : api.executions(recordId)) {
            Response d = adminB().get("/workflow/executions/" + e.get("id"));
            Object ds = d.jsonPath().get("data.dispatches");
            sb.append("{exec ").append(e.get("triggerKind")).append(' ').append(e.get("outcome")).append(" dispatches=").append(json(ds)).append("} ");
        }
        return sb.toString();
    }

    private static boolean done(String d) {
        return d.contains("\"status\":\"Succeeded\"") || d.contains("\"status\":\"Failed\"");
    }

    @CaseId({"C-11", "H-05", "C-15"})
    @Test(groups = {"crm-verify"}, description = "Is the delay of a scheduled Field Update honoured? (5-minute delay, read at +3 s / +20 s / +60 s)")
    public void c11FieldUpdateDelay() {
        String c = "C-11d";
        String r = wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).delayed(300));
        String id = lead(c, "lead", null);
        long t0 = System.currentTimeMillis();
        for (int s : new int[]{3, 20, 60}) {
            CrmUser.sleep(Math.max(0, t0 + s * 1000L - System.currentTimeMillis()));
            fact(c, "+" + s + "s description=" + val(LEADS, id, "description"));
        }
        fact(c, "rule stored delaySeconds=" + adminB().get("/workflow/rules/" + r).jsonPath().getString("data.actions[0].delaySeconds") + " executions " + dispatches(id));
    }

    @CaseId("C-11")
    @Test(groups = {"crm-verify"}, description = "Create-or-Edit rule with a 2-minute scheduled Webhook: the lead edited out of the criteria must not get it")
    public void c11WebhookCancelled() {
        String c = "C-11w";
        wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreateOrEdit().where(CrmProcs.eq("lead_source", "web")).webhook(HOOK).delayed(120));
        String stop = lead(c, "stops matching", Map.of("lead_source", "web"));
        String ctl = lead(c, "control", Map.of("lead_source", "web"));
        CrmUser.sleep(5000);
        fact(c, "+5s stop " + dispatches(stop));
        patch(c, userN(), "/modules/" + LEADS + "/records/" + stop, Map.of("data", CrmApi.data(Map.of("lead_source", "chat"))));
        CrmApi.waitFor(330, () -> done(dispatches(ctl)));
        CrmUser.sleep(20000);
        fact(c, "control " + ctl + " " + dispatches(ctl));
        fact(c, "edited out of criteria " + stop + " " + dispatches(stop));
    }

    @CaseId("H-05")
    @Test(groups = {"crm-verify"}, description = "Lead converted while a 2-minute scheduled Webhook is pending")
    public void h05WebhookAfterConvert() {
        String c = "H-05w";
        wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().webhook(HOOK).delayed(120));
        String conv = lead(c, "converted", null);
        String ctl = lead(c, "control", null);
        CrmUser.sleep(5000);
        Response cv = convert(c, userN(), conv);
        if (cv.statusCode() == 403) cv = convert(c, adminA(), conv);
        fact(c, "convert -> " + cv.statusCode() + "; converted lead right after: " + dispatches(conv));
        CrmApi.waitFor(330, () -> done(dispatches(ctl)));
        CrmUser.sleep(20000);
        fact(c, "control " + ctl + " " + dispatches(ctl));
        fact(c, "converted " + conv + " " + dispatches(conv));
    }

    @CaseId("E-18")
    @Test(groups = {"crm-verify"}, description = "Two blueprints; PATCH /blueprints/sort {items:[{id, sort_order}]} once; which governs the next record")
    public void e18SortOnce() {
        String c = "E-18";
        List<String> src = List.of("chat", "web", "referral");
        String a = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP one", caseGuard(LEADS, c), src, null));
        String b = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP two", caseGuard(LEADS, c), src, null));
        on(c, "bp one", api.setBlueprintActive(LEADS, a, true));
        on(c, "bp two", api.setBlueprintActive(LEADS, b, true));
        String l1 = lead(c, "lead1", Map.of("lead_source", "chat"));
        CrmApi.waitFor(45, () -> api.governed(LEADS, l1));
        fact(c, "before sort: " + order(a, b) + " lead1 governed by " + api.blueprintState(adminA(), LEADS, l1).getList("data.states.blueprintName"));
        Map<String, Object> body = Map.of("items", List.of(Map.of("id", b, "sort_order", 0), Map.of("id", a, "sort_order", 1)));
        Response s = patch(c, adminB(), "/modules/" + LEADS + "/blueprints/sort", body);
        fact(c, "sort two first -> " + s.statusCode() + "; " + order(a, b));
        String l2 = lead(c, "lead2", Map.of("lead_source", "chat"));
        CrmApi.waitFor(45, () -> api.governed(LEADS, l2));
        fact(c, "after sort: lead2 governed by " + api.blueprintState(adminA(), LEADS, l2).getList("data.states.blueprintName"));
    }

    private String order(String a, String b) {
        List<Map<String, Object>> list = CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data");
        StringBuilder sb = new StringBuilder("list: ");
        int i = 0;
        for (Map<String, Object> x : list) {
            if (a.equals(x.get("id"))) sb.append("one@").append(i).append("(sortOrder ").append(x.get("sortOrder")).append(") ");
            if (b.equals(x.get("id"))) sb.append("two@").append(i).append("(sortOrder ").append(x.get("sortOrder")).append(") ");
            i++;
        }
        return sb.toString();
    }

    @CaseId("F-20")
    @Test(groups = {"crm-verify"}, description = "Deal in a Stage blueprint: governed before/after an edit of Next Step, with and without an On Edit approval")
    public void f20Governance() {
        String c = "F-20";
        String pipe = CrmApi.pipelineOf(layout(DEALS));
        String bp = api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), pipe, "stage", c + " BP", CrmProcs.guard(DEALS, nm(c, "bp")),
                List.of("qualification", "proposal"), null));
        on(c, "blueprint " + bp, api.setBlueprintActive(DEALS, bp, true));
        String d1 = createLogged(c, userN(), DEALS, CrmApi.minimal(DEALS, nm(c, "bp plain")));
        CrmApi.waitFor(45, () -> api.governed(DEALS, d1));
        fact(c, "plain deal " + d1 + " governed after create=" + api.governed(DEALS, d1));
        patch(c, userN(), "/modules/" + DEALS + "/records/" + d1, Map.of("data", CrmApi.data(Map.of("next_step", "edit"))));
        CrmUser.sleep(8000);
        fact(c, "plain deal governed after editing next_step=" + api.governed(DEALS, d1));
        String ap = api.approvalProcess(CrmProcs.approvalProcess(DEALS, c + " appr", false, true, CrmProcs.and(caseGuard(DEALS, c), CrmProcs.eq("next_step", "edit")),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminA().id())));
        on(c, "approval " + ap, api.setApprovalActive(ap, true));
        String d2 = createLogged(c, userN(), DEALS, CrmApi.minimal(DEALS, nm(c, "bp appr")));
        approvalHeld.add(new String[]{DEALS, d2});
        CrmApi.waitFor(45, () -> api.governed(DEALS, d2));
        get(c, adminA(), "/modules/" + DEALS + "/records/" + d2 + "/blueprint-state");
        fact(c, "deal " + d2 + " governed after create=" + api.governed(DEALS, d2) + " approval=" + api.approvalState(DEALS, d2));
        patch(c, userN(), "/modules/" + DEALS + "/records/" + d2, Map.of("data", CrmApi.data(Map.of("next_step", "edit"))));
        CrmApi.waitFor(30, () -> api.approvalState(DEALS, d2) != null);
        get(c, adminA(), "/modules/" + DEALS + "/records/" + d2 + "/blueprint-state");
        fact(c, "deal " + d2 + " after edit: approval=" + api.approvalState(DEALS, d2) + " governed=" + api.governed(DEALS, d2));
    }

    @CaseId("G-13")
    @Test(groups = {"crm-verify"}, description = "Deals import with an assignment rule AND a review process (Excel import channel): owner while held and after review approval")
    public void g13DealsImportWithReview() {
        String c = "G-13r";
        String ar = api.assignmentRule(CrmProcs.assignmentRule(DEALS, c + " AR", List.of("Import"), caseGuard(DEALS, c), List.of(userN().id()), "LeaveUnassigned", null));
        on(c, "assignment " + ar, api.setAssignmentRuleActive(ar, true));
        String rp = api.reviewProcess(CrmProcs.reviewProcess(DEALS, layout(DEALS), c + " RP", caseGuard(DEALS, c), List.of("excel_import"),
                Map.of("next_step", "single_line"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        Map<String, Object> row = new LinkedHashMap<>();
        CrmApi.minimal(DEALS, nm(c, "imp")).forEach((k, v) -> row.put(k, String.valueOf(v)));
        row.put("next_step", "QA review");
        String id = importOne(c, adminA(), DEALS, row, ar, true);
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(DEALS, id)));
        fact(c, "deal " + id + " review=" + api.reviewStatus(DEALS, id) + " owner while held=" + who(owner(DEALS, id)) + " executions=" + api.executions(id));
        get(c, adminA(), "/modules/" + DEALS + "/records/" + id);
        post(c, adminA(), "/workflow/reviews/" + api.reviewRequestId(DEALS, id) + "/fields/next_step/approve", Map.of());
        CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(DEALS, id)));
        CrmUser.sleep(5000);
        fact(c, "after review approval: review=" + api.reviewStatus(DEALS, id) + " owner=" + who(owner(DEALS, id)));
    }

    @CaseId("I-10")
    @Test(groups = {"crm-verify"}, description = "User-profile owner edits its own lead after review approval: at +2 s, +15 s, +60 s")
    public void i10EditAfterReviewApproval() {
        String c = "I-10";
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String id = lead(c, "lead", Map.of("email", "qa.aeo.v5.i10@qa.test"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        post(c, adminA(), "/workflow/reviews/" + api.reviewRequestId(LEADS, id) + "/fields/email/approve", Map.of());
        CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(LEADS, id)));
        long t0 = System.currentTimeMillis();
        for (int s : new int[]{2, 15, 60}) {
            CrmUser.sleep(Math.max(0, t0 + s * 1000L - System.currentTimeMillis()));
            Response e = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("lead_status_comment", "QA edit +" + s))));
            fact(c, "+" + s + "s after review approval: userN edit -> " + e.statusCode() + " " + cut(e.asString(), 160) + " | review=" + api.reviewStatus(LEADS, id));
            if (e.statusCode() / 100 == 2) break;
        }
    }

    @CaseId("CLEANUP")
    @Test(groups = {"crm-verify"}, priority = 100, description = "Leftover of the first V run: H-02 lead converted while held for review (REVIEW_LOCKED), its QA layout and review process")
    public void zzCleanupFirstRun() {
        String c = "CLEANUP";
        String lead = "da6f6b7c-7e1e-498a-a738-8afbbc5a4e49";
        String lay = "484f8fc4-c1a7-4d64-a214-b505d4ce630e";
        Response h = get(c, adminA(), "/workflow/reviews/records/" + LEADS + "/" + lead + "/history");
        for (Map<String, Object> rp : CrmUser.ok(adminA().get("/workflow/review-processes?take=200"), "rps").jsonPath().<Map<String, Object>>getList("data"))
            if (String.valueOf(rp.get("name")).startsWith("QA AEO V")) {
                fact(c, "QA review process still present: " + rp.get("name") + " " + rp.get("id") + " active=" + rp.get("isActive"));
                patch(c, adminA(), "/workflow/review-processes/" + rp.get("id") + "/active", Map.of("isActive", false, "pendingAction", "reject_all"));
            }
        List<Map<String, Object>> cycles = h.jsonPath().getList("data.cycles");
        if (cycles != null && !cycles.isEmpty()) {
            String req = String.valueOf(cycles.get(cycles.size() - 1).get("requestId"));
            post(c, adminA(), "/workflow/reviews/" + req + "/reject", Map.of("reasonId", api.firstRejectionReasonId(), "comment", "QA AEO V cleanup"));
        }
        Response d = del(c, adminA(), "/modules/" + LEADS + "/records/" + lead);
        if (d.statusCode() / 100 != 2) d = del(c, owner(), "/modules/" + LEADS + "/records/" + lead);
        for (Map<String, Object> rp : CrmUser.ok(adminA().get("/workflow/review-processes?take=200"), "rps").jsonPath().<Map<String, Object>>getList("data"))
            if (String.valueOf(rp.get("name")).startsWith("QA AEO V")) del(c, adminA(), "/workflow/review-processes/" + rp.get("id"));
        Response l = del(c, adminA(), "/modules/" + LEADS + "/layouts/" + lay);
        fact(c, "leftover lead delete -> " + d.statusCode() + "; layout delete -> " + l.statusCode());
    }

    @CaseId("D-06")
    @Test(groups = {"crm-verify"}, description = "Profile 'test' (valafo4080): approval-related permissions (read only)")
    public void d06Profile() {
        String c = "D-06p";
        String pid = "64d4aae0-9abd-486b-bc03-d04e22d87160";
        for (String p : List.of("/iam/profiles/" + pid, "/iam/profiles/" + pid + "/permissions", "/iam/me/permissions")) {
            Response r = (p.startsWith("/iam/me") ? userV() : adminA()).get(p);
            String t = r.asString();
            StringBuilder hits = new StringBuilder();
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"[^\"]*approval[^\"]*\"[^,}\\]]{0,40}").matcher(t);
            while (m.find() && hits.length() < 1500) hits.append(m.group()).append(" | ");
            fact(c, "GET " + p + " -> " + r.statusCode() + " approval-related: " + hits);
        }
    }
}
