package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/** Re-verification (19 Oct 2026): workflow rules, conversion, mass update through review, permissions, list sort. Session V2. */
public class VerifyV2WorkflowTest extends VerifyBase {
    @Override protected String session() { return "V2"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private String wf(String c, CrmProcs.Wf w) {
        Map<String, Object> body = w.build();
        Response r = post(c, adminB(), "/workflow/rules", body);
        CrmUser.ok(r, "create rule");
        String id = r.jsonPath().getString("data.id");
        rules.add(id);
        on(c, "workflow " + id, api.setWorkflowActive(id, true));
        return id;
    }

    private final List<String> rules = new ArrayList<>();

    @org.testng.annotations.AfterMethod(alwaysRun = true)
    public void dropRules() {
        for (String id : rules) {
            adminB().post("/workflow/rules/" + id + "/deactivate", null);
            out("[V cleanup] delete rule " + id + " -> " + adminB().delete("/workflow/rules/" + id).statusCode());
        }
        rules.clear();
    }

    private String lead(String c, String sfx, Map<String, Object> extraF) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, sfx)));
        if (extraF != null) f.putAll(extraF);
        return createLogged(c, userN(), LEADS, f);
    }

    private String runs(String id) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : api.executions(id))
            sb.append("{rule=").append(e.get("ruleId")).append(" trig=").append(e.get("triggerKind")).append(" matched=").append(e.get("criteriaMatched"))
                    .append(" outcome=").append(e.get("outcome")).append(" at=").append(e.get("evaluatedAt")).append("} ");
        return sb.toString();
    }

    // ------------------------------------------------------------ C-11

    @CaseId("C-11")
    @Test(groups = {"crm-verify"}, description = "Create-or-Edit rule with a 2-minute scheduled Field Update: the lead edited out of the criteria must not get it")
    public void c11ScheduledCancelledOnCreateOrEdit() {
        String c = "C-11";
        String r = wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreateOrEdit().where(CrmProcs.eq("lead_source", "web"))
                .fieldUpdate("description", "WF " + c).delayed(120));
        String stop = lead(c, "stops matching", Map.of("lead_source", "web"));
        String ctl = lead(c, "control", Map.of("lead_source", "web"));
        CrmApi.waitFor(20, () -> !api.executions(stop).isEmpty());
        Response e = patch(c, userN(), "/modules/" + LEADS + "/records/" + stop, Map.of("data", CrmApi.data(Map.of("lead_source", "chat"))));
        fact(c, "edit out of criteria -> " + e.statusCode());
        boolean ctlRan = CrmApi.waitFor(330, () -> ("WF " + c).equals(val(LEADS, ctl, "description")));
        CrmUser.sleep(20000);
        fact(c, "control " + ctl + " scheduled FU ran=" + ctlRan + " | edited lead " + stop + " lead_source=" + val(LEADS, stop, "lead_source")
                + " description=" + val(LEADS, stop, "description") + " runs=" + runs(stop));
        get(c, adminB(), "/workflow/executions?recordId=" + stop + "&take=50");
    }

    // ------------------------------------------------------------ C-12

    @CaseId("C-12")
    @Test(groups = {"crm-verify"}, description = "Rule A (on create) field update makes On Edit rule B match: does B run?")
    public void c12FieldUpdateChaining() {
        String c = "C-12";
        String a = wf(c, CrmProcs.workflow(LEADS, c + " A").guardCase(c).onCreate().fieldUpdate("lead_source", "referral"));
        String b = wf(c, CrmProcs.workflow(LEADS, c + " B on edit").guardCase(c).onEdit().where(CrmProcs.eq("lead_source", "referral"))
                .fieldUpdate("description", "WF " + c + " B"));
        String id = lead(c, "lead", Map.of("lead_source", "chat"));
        CrmApi.waitFor(60, () -> "referral".equals(val(LEADS, id, "lead_source")));
        boolean bRan = CrmApi.waitFor(60, () -> ("WF " + c + " B").equals(val(LEADS, id, "description")));
        fact(c, "lead " + id + " lead_source=" + val(LEADS, id, "lead_source") + " A fired=" + api.firedCount(id, a) + " B(on edit) fired=" + api.firedCount(id, b)
                + " B marker=" + bRan + " runs=" + runs(id));
        // control: a user edit to referral does fire B
        String ctl = lead(c, "ctl", Map.of("lead_source", "chat"));
        CrmApi.waitFor(60, () -> "referral".equals(val(LEADS, ctl, "lead_source")));
        patch(c, userN(), "/modules/" + LEADS + "/records/" + ctl, Map.of("data", CrmApi.data(Map.of("lead_status_comment", "QA user edit"))));
        boolean ctlB = CrmApi.waitFor(60, () -> ("WF " + c + " B").equals(val(LEADS, ctl, "description")));
        fact(c, "control lead " + ctl + " (A sets referral on create, then a user edit of another field) B ran=" + ctlB + " runs=" + runs(ctl));
    }

    // ------------------------------------------------------------ C-09

    @CaseId("C-09")
    @Test(groups = {"crm-verify"}, description = "Criteria false: is there any execution row for the rule?")
    public void c09NoMatchRow() {
        String c = "C-09";
        String r = wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().where(CrmProcs.eq("lead_source", "referral")).fieldUpdate("description", "WF " + c));
        String ctl = wf(c, CrmProcs.workflow(LEADS, c + " ctl").guardCase(c).onCreate().fieldUpdate("lead_status_comment", "WF " + c + " ctl"));
        String id = lead(c, "lead", Map.of("lead_source", "chat"));
        CrmApi.waitFor(60, () -> api.firedCount(id, ctl) > 0);
        CrmUser.sleep(8000);
        fact(c, "lead " + id + " control fired=" + api.firedCount(id, ctl) + " rule rows=" + api.executions(id).stream().filter(e -> r.equals(e.get("ruleId"))).count()
                + " all runs=" + runs(id));
    }

    // ------------------------------------------------------------ C-14

    @CaseId("C-14")
    @Test(groups = {"crm-verify"}, description = "Condition limit: 24 and 25 leaf conditions under one AND; two FieldUpdate actions")
    public void c14Limits() {
        String c = "C-14";
        for (int n : new int[]{24, 25}) {
            List<Map<String, Object>> ops = new ArrayList<>(List.of(CrmProcs.guard(LEADS, nm(c, ""))));
            for (int i = 0; ops.size() < n; i++) ops.add(Rules.contains("description", "x" + i));
            Map<String, Object> body = CrmProcs.workflow(LEADS, c + " " + n + " conditions").onCreate().fieldUpdate("description", "WF " + c).build();
            body.put("criteria", kinded("kind", "Logical", "operator", "And", "operands", ops));
            Response r = logged(c, adminB(), "POST", "/workflow/rules", "(" + n + " leaf conditions under one And)", adminB().post("/workflow/rules", body));
            fact(c, n + " leaf conditions -> " + r.statusCode() + " " + cut(r.asString(), 300));
            if (r.statusCode() / 100 == 2) adminB().delete("/workflow/rules/" + r.jsonPath().getString("data.id"));
        }
        Map<String, Object> two = CrmProcs.workflow(LEADS, c + " two FU").guardCase(c).onCreate().fieldUpdate("description", "one").build();
        @SuppressWarnings("unchecked") List<Map<String, Object>> acts = (List<Map<String, Object>>) two.get("actions");
        Map<String, Object> second = new LinkedHashMap<>(acts.get(0));
        second.put("order", 1);
        second.put("fieldUpdates", Map.of("lead_status_comment", Rules.s("two")));
        acts.add(second);
        Response r = post(c, adminB(), "/workflow/rules", two);
        fact(c, "two separate FieldUpdate actions -> " + r.statusCode() + " " + cut(r.asString(), 300));
        if (r.statusCode() / 100 == 2) adminB().delete("/workflow/rules/" + r.jsonPath().getString("data.id"));
        Response one = post(c, adminB(), "/workflow/rules", CrmProcs.workflow(LEADS, c + " one FU two fields").guardCase(c).onCreate()
                .fieldUpdate("description", "one").fieldUpdate("lead_status_comment", "two").build());
        fact(c, "one FieldUpdate action with two fields -> " + one.statusCode());
        if (one.statusCode() / 100 == 2) adminB().delete("/workflow/rules/" + one.jsonPath().getString("data.id"));
    }

    // ------------------------------------------------------------ H-05

    @CaseId("H-05")
    @Test(groups = {"crm-verify"}, description = "Scheduled Field Update (2 min) on a lead converted before it is due")
    public void h05ScheduledAfterConvert() {
        String c = "H-05";
        String r = wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).delayed(120));
        String conv = lead(c, "converted", null);
        String ctl = lead(c, "control", null);
        CrmApi.waitFor(30, () -> !api.executions(conv).isEmpty());
        Response cv = convert(c, userN(), conv);
        if (cv.statusCode() == 403) cv = convert(c, adminA(), conv);
        fact(c, "convert -> " + cv.statusCode());
        boolean ctlRan = CrmApi.waitFor(330, () -> ("WF " + c).equals(val(LEADS, ctl, "description")));
        CrmUser.sleep(20000);
        Response rec = get(c, adminA(), "/modules/" + LEADS + "/records/" + conv);
        fact(c, "control " + ctl + " ran=" + ctlRan + " | converted lead " + conv + " readable=" + rec.statusCode() + " description=" + val(LEADS, conv, "description")
                + " runs=" + runs(conv));
    }

    // ------------------------------------------------------------ G-07

    @CaseId("G-07")
    @Test(groups = {"crm-verify"}, description = "On Edit workflow after a review hold caused by an edit (mass update vs single edit); control without review")
    public void g07EditHeldByReview() {
        String c = "G-07";
        Map<String, Object> fu = CrmProcs.eq("lead_status", "Follow Up");
        String rr = nm(c, "r");
        String r1 = lead(c, "r one", Map.of("email", "qa.aeo.v2.g07.one@qa.test"));
        String r2 = lead(c, "r two", Map.of("email", "qa.aeo.v2.g07.two@qa.test"));
        String x = lead(c, "x control", Map.of("email", "qa.aeo.v2.g07.x@qa.test"));
        // processes after the records exist (no review on their create)
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", CrmProcs.guard(LEADS, rr), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String w = wf(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onEdit().where(fu).fieldUpdate("description", "WF " + c));
        Map<String, Object> mu = new LinkedHashMap<>();
        mu.put("record_ids", List.of(r1));
        mu.put("data", CrmApi.data(Map.of("lead_status", "Follow Up")));
        Response m = post(c, userN(), "/modules/" + LEADS + "/records/mass-update", mu);
        if (m.statusCode() == 403) m = post(c, adminB(), "/modules/" + LEADS + "/records/mass-update", mu);
        Response e2 = patch(c, userN(), "/modules/" + LEADS + "/records/" + r2, Map.of("data", CrmApi.data(Map.of("lead_status", "Follow Up"))));
        Response e3 = patch(c, userN(), "/modules/" + LEADS + "/records/" + x, Map.of("data", CrmApi.data(Map.of("lead_status", "Follow Up"))));
        for (String[] p : new String[][]{{"mass update", r1}, {"single edit", r2}}) {
            String id = p[1];
            CrmApi.waitFor(30, () -> api.reviewStatus(LEADS, id) != null);
            String st = api.reviewStatus(LEADS, id);
            fact(c, p[0] + " lead " + id + " review after edit=" + st + " lead_status=" + val(LEADS, id, "lead_status") + " description=" + val(LEADS, id, "description"));
            if (CrmApi.reviewPending(st)) {
                post(c, adminA(), "/workflow/reviews/" + api.reviewRequestId(LEADS, id) + "/fields/email/approve", Map.of());
                CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(LEADS, id)));
            }
        }
        CrmApi.waitFor(60, () -> ("WF " + c).equals(val(LEADS, r1, "description")) && ("WF " + c).equals(val(LEADS, r2, "description")));
        fact(c, "after review approval: mass-update lead " + r1 + " review=" + api.reviewStatus(LEADS, r1) + " description=" + val(LEADS, r1, "description")
                + " wfFired=" + api.firedCount(r1, w) + " | single-edit lead " + r2 + " review=" + api.reviewStatus(LEADS, r2) + " description=" + val(LEADS, r2, "description")
                + " wfFired=" + api.firedCount(r2, w));
        fact(c, "control (no review) lead " + x + " edit=" + e3.statusCode() + " review=" + api.reviewStatus(LEADS, x) + " description=" + val(LEADS, x, "description")
                + " wfFired=" + api.firedCount(x, w));
    }

    // ------------------------------------------------------------ C-10 / I-10 permission

    @CaseId({"C-10", "I-10"})
    @Test(groups = {"crm-verify"}, description = "User-profile owner edits its own lead: plain, after an admin tag, after review approval")
    public void permOwnLead() {
        String c = "C-10";
        String id = lead(c, "own", null);
        fact(c, "lead " + id + " owner=" + who(owner(LEADS, id)));
        Response a = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("lead_source", "web"))));
        Response b = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit 1"))));
        String tag = CrmUser.ok(post(c, adminB(), "/modules/" + LEADS + "/tags", Map.of("name", nm(c, "tag"), "color", "#2563eb")), "tag").jsonPath().getString("data.id");
        tags.add(tag);
        Response t = post(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/tags", Map.of("tag_ids", List.of(tag), "mode", "add"));
        Response d = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit 2"))));
        Response g = get(c, userN(), "/modules/" + LEADS + "/records/" + id);
        fact(c, "userN edits own lead: lead_source " + a.statusCode() + ", description " + b.statusCode() + "; adminB tags it " + t.statusCode()
                + "; userN edit after tag " + d.statusCode() + "; userN read " + g.statusCode() + "; owner now " + who(owner(LEADS, id)));
        Response rm = post(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/tags", Map.of("tag_ids", List.of(tag), "mode", "remove"));
        Response d2 = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit 3"))));
        fact(c, "tag removed " + rm.statusCode() + "; userN edit again " + d2.statusCode());
        // a tag added by userN itself
        Response tn = post(c, userN(), "/modules/" + LEADS + "/records/" + id + "/tags", Map.of("tag_ids", List.of(tag), "mode", "add"));
        Response d3 = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit 4"))));
        fact(c, "userN tags it itself " + tn.statusCode() + "; userN edit " + d3.statusCode());
    }

    @CaseId("I-10")
    @Test(groups = {"crm-verify"}, description = "User-profile owner edits its own lead after review approval")
    public void permAfterReview() {
        String c = "I-10";
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String id = lead(c, "lead", Map.of("email", "qa.aeo.v2.i10@qa.test"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        post(c, adminA(), "/workflow/reviews/" + api.reviewRequestId(LEADS, id) + "/fields/email/approve", Map.of());
        CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(LEADS, id)));
        Response e = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit after review"))));
        Response g = get(c, userN(), "/modules/" + LEADS + "/records/" + id);
        fact(c, "lead " + id + " review=" + api.reviewStatus(LEADS, id) + " owner=" + who(owner(LEADS, id)) + " created_by=" + who(val(LEADS, id, "created_by"))
                + " userN read=" + g.statusCode() + " userN edit=" + e.statusCode());
    }

    // ------------------------------------------------------------ required phone

    @CaseId("REQ-PHONE")
    @Test(groups = {"crm-verify"}, description = "Create a lead without the required Phone: userN (can write Phone) vs userV (Phone read-only)")
    public void requiredPhone() {
        String c = "REQ-PHONE";
        for (CrmUser u : List.of(userN(), userV())) {
            Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, u == userN() ? "n" : "v")));
            f.remove("phone");
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("layout_id", layout(LEADS));
            body.put("data", CrmApi.data(f));
            Response r = post(c, u, "/modules/" + LEADS + "/records", body);
            if (r.statusCode() / 100 == 2) api.track(LEADS, r.jsonPath().getString("data.id"));
            fact(c, u.email + " create without phone -> " + r.statusCode() + " " + cut(r.asString(), 200));
        }
        get(c, adminB(), "/modules/" + LEADS + "/fields");
    }

    // ------------------------------------------------------------ list sort

    @CaseId("LIST-SORT")
    @Test(groups = {"crm-verify"}, description = "Records list: sort_order vs sort_dir (read only)")
    public void listSort() {
        String c = "LIST-SORT";
        for (String q : List.of("", "&sort_by=created_at&sort_order=desc", "&sort_by=created_at&sort_order=asc", "&sort_by=created_at&sort_dir=desc", "&sort_by=created_at&sort_dir=asc")) {
            Response r = adminB().get("/modules/" + LEADS + "/records?page=1&per_page=3" + q);
            fact(c, "GET /modules/leads/records?page=1&per_page=3" + q + " -> " + r.statusCode() + " created_at " + r.jsonPath().getList("data.created_at")
                    + " meta " + r.jsonPath().getMap("meta"));
        }
    }
}
