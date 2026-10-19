package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/** Re-verification (19 Oct 2026): assignment rules, import, record-owner reviewer/approver, timeline. Session V1. */
public class VerifyV1AssignImportTest extends VerifyBase {
    @Override protected String session() { return "V1"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private String rule(String c, List<String> channels, Map<String, Object> cond, CrmUser to, String fallback) {
        String id = api.assignmentRule(CrmProcs.assignmentRule(LEADS, c + " AR", channels, cond, List.of(to.id()), fallback, null));
        on(c, "assignment rule " + id + " channels " + channels, api.setAssignmentRuleActive(id, true));
        return id;
    }

    private String ruleIn(String module, String c, List<String> channels, CrmUser to) {
        String id = api.assignmentRule(CrmProcs.assignmentRule(module, c + " AR", channels, caseGuard(module, c), List.of(to.id()), "LeaveUnassigned", null));
        on(c, "assignment rule " + id, api.setAssignmentRuleActive(id, true));
        return id;
    }

    private void waitOwner(String module, String id, CrmUser u) {
        CrmApi.waitFor(60, () -> u.id().equals(owner(module, id)));
    }

    // ------------------------------------------------------------ 1 F-03

    @CaseId("F-03")
    @Test(groups = {"crm-verify"}, description = "Approval approver 'record owner' on an imported, rule-assigned lead")
    public void f03RecordOwnerApprover() {
        String c = "F-03";
        String ar = rule(c, List.of("Import"), caseGuard(LEADS, c), adminB(), "LeaveUnassigned");
        // process admin = supervisor (not the importer), so a fallback to the process admin is distinguishable
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, c + " appr", true, false, caseGuard(LEADS, c),
                List.of(CrmProcs.level(kinded("kind", "record_owner", "values", List.of()), false)), List.of(supervisor().id())));
        on(c, "approval " + ap, api.setApprovalActive(ap, true));
        Map<String, Object> row = new LinkedHashMap<>();
        leadFields(c, "imp").forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), LEADS, row, ar, true);
        approvalHeld.add(new String[]{LEADS, id});
        waitOwner(LEADS, id, adminB());
        CrmApi.waitFor(60, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        JsonPath vb = CrmUser.ok(get(c, adminB(), "/workflow/approvals/records/" + LEADS + "/" + id), "approval").jsonPath();
        fact(c, "imported lead " + id + " owner=" + who(owner(LEADS, id)) + " currentApprovers=" + whoList(vb.getList("data.currentApprovers"))
                + " adminB.canApprove=" + vb.get("data.canApprove") + " submittedBy=" + who(vb.getString("data.history[0].actorUserId")));

        // control 1: manual create by userN (owner = creator = userN)
        String ctl = createLogged(c, userN(), LEADS, leadFields(c, "ctl userN"));
        approvalHeld.add(new String[]{LEADS, ctl});
        CrmApi.waitFor(60, () -> "pending_approval".equals(api.approvalState(LEADS, ctl)));
        JsonPath vc = CrmUser.ok(get(c, adminA(), "/workflow/approvals/records/" + LEADS + "/" + ctl), "approval").jsonPath();
        fact(c, "control manual lead " + ctl + " creator=userN owner=" + who(owner(LEADS, ctl)) + " currentApprovers=" + whoList(vc.getList("data.currentApprovers")));

        // control 2: adminA creates a lead whose Owner field is set to adminB at create time (owner != creator, no assignment rule)
        Map<String, Object> f = leadFields(c, "ctl owner set");
        f.put("owner", adminB().id());
        Response r = api.createRaw(adminA(), LEADS, layout(LEADS), f);
        logged(c, adminA(), "POST", "/modules/" + LEADS + "/records", Map.of("data", "…owner=" + adminB().id()), r);
        if (r.statusCode() / 100 == 2) {
            String c2 = r.jsonPath().getString("data.id");
            api.track(LEADS, c2);
            approvalHeld.add(new String[]{LEADS, c2});
            CrmApi.waitFor(60, () -> "pending_approval".equals(api.approvalState(LEADS, c2)));
            JsonPath v2 = CrmUser.ok(get(c, adminA(), "/workflow/approvals/records/" + LEADS + "/" + c2), "approval").jsonPath();
            fact(c, "control lead " + c2 + " creator=adminA owner=" + who(owner(LEADS, c2)) + " currentApprovers=" + whoList(v2.getList("data.currentApprovers")));
        }
    }

    private String whoList(List<Object> ids) {
        if (ids == null) return "null";
        StringBuilder sb = new StringBuilder("[");
        for (Object o : ids) sb.append(who(String.valueOf(o))).append(' ');
        return sb.append(']').toString();
    }

    // ------------------------------------------------------------ 2 F-01

    @CaseId("F-01")
    @Test(groups = {"crm-verify"}, description = "Review reviewer kind 'record_owner' on an imported, rule-assigned lead (and a manual control)")
    public void f01RecordOwnerReviewer() {
        String c = "F-01";
        String ar = rule(c, List.of("Import"), caseGuard(LEADS, c), adminB(), "LeaveUnassigned");
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("excel_import", "manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(supervisor().id()));
        @SuppressWarnings("unchecked") List<Map<String, Object>> rules = (List<Map<String, Object>>) body.get("rules");
        Map<String, Object> r1 = new LinkedHashMap<>(rules.get(0));
        r1.put("reviewers", List.of(kinded("kind", "record_owner", "values", List.of())));
        rules.set(0, r1);
        out("[V " + c + "] review process body " + json(body));
        String rp = api.reviewProcess(body);
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        Map<String, Object> row = new LinkedHashMap<>();
        leadFields(c, "imp").forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), LEADS, row, ar, true);
        waitOwner(LEADS, id, adminB());
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        String req = api.reviewRequestId(LEADS, id);
        JsonPath rq = CrmUser.ok(get(c, adminA(), "/workflow/reviews/" + req), "review request").jsonPath();
        fact(c, "imported lead " + id + " owner=" + who(owner(LEADS, id)) + " review=" + api.reviewStatus(LEADS, id)
                + " reviewerUserIds=" + whoList(rq.getList("data.reviewerUserIds")) + " entryChannel=" + rq.getString("data.entryChannel"));
        Response myQ = get(c, adminB(), "/workflow/reviews/me?take=100");
        fact(c, "imported lead in adminB's review queue: " + (myQ.statusCode() / 100 == 2 && myQ.asString().contains(id)));
        Response act = post(c, adminB(), "/workflow/reviews/" + req + "/fields/email/approve", Map.of());
        fact(c, "assigned owner adminB approves the field -> " + act.statusCode());

        // control: manual create by adminA with Owner set to adminB
        Map<String, Object> f = leadFields(c, "ctl owner set");
        f.put("owner", adminB().id());
        Response r = api.createRaw(adminA(), LEADS, layout(LEADS), f);
        logged(c, adminA(), "POST", "/modules/" + LEADS + "/records", Map.of("data", "…owner=" + adminB().id()), r);
        if (r.statusCode() / 100 == 2) {
            String c2 = r.jsonPath().getString("data.id");
            api.track(LEADS, c2);
            CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, c2)));
            String req2 = api.reviewRequestId(LEADS, c2);
            if (req2 != null) {
                JsonPath rq2 = CrmUser.ok(get(c, adminA(), "/workflow/reviews/" + req2), "review request").jsonPath();
                fact(c, "control manual lead " + c2 + " owner=" + who(owner(LEADS, c2)) + " reviewerUserIds=" + whoList(rq2.getList("data.reviewerUserIds")));
            } else fact(c, "control manual lead " + c2 + " not held (review " + api.reviewStatus(LEADS, c2) + ")");
        }
    }

    // ------------------------------------------------------------ 3 A-04

    @CaseId("A-04")
    @Test(groups = {"crm-verify"}, description = "Rule restricted to the Api channel, named on an import (control: same rule with Import channel)")
    public void a04ChannelRestriction() {
        String c = "A-04";
        String apiOnly = rule(c + "a", List.of("Api"), caseGuard(LEADS, c + "a"), userV(), "LeaveUnassigned");
        String imp = rule(c + "c", List.of("Import"), caseGuard(LEADS, c + "c"), userV(), "LeaveUnassigned");
        fact(c, "rule api-only " + json(CrmUser.ok(get(c, adminA(), "/workflow/assignment-rules/" + apiOnly), "rule").jsonPath().getList("data.allowedChannels")));
        Map<String, Object> row = new LinkedHashMap<>();
        leadFields(c + "a", "imp").forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), LEADS, row, apiOnly, false);
        Map<String, Object> row2 = new LinkedHashMap<>();
        leadFields(c + "c", "imp").forEach((k, v) -> row2.put(k, String.valueOf(v)));
        String ctl = importOne(c, adminA(), LEADS, row2, imp, false);
        CrmUser.sleep(10000);
        fact(c, "Api-only rule on import: lead " + id + " owner=" + who(owner(LEADS, id)) + " executions=" + api.executions(id));
        fact(c, "control Import rule: lead " + ctl + " owner=" + who(owner(LEADS, ctl)));
    }

    // ------------------------------------------------------------ 4 A-08

    @CaseId("A-08")
    @Test(groups = {"crm-verify"}, description = "No entry matches, fallback Leave unassigned: owner of the imported lead")
    public void a08LeaveUnassigned() {
        String c = "A-08";
        String ar = rule(c, List.of("Import"), CrmProcs.and(caseGuard(LEADS, c), CrmProcs.eq("lead_source", "web")), userV(), "LeaveUnassigned");
        Map<String, Object> row = new LinkedHashMap<>();
        leadFields(c, "other").forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), LEADS, row, ar, false);
        CrmUser.sleep(10000);
        fact(c, "lead " + id + " lead_source=" + val(LEADS, id, "lead_source") + " owner=" + who(owner(LEADS, id)) + " executions=" + api.executions(id));
    }

    // ------------------------------------------------------------ 5 G-04

    @CaseId("G-04")
    @Test(groups = {"crm-verify"}, description = "Import with trigger_automation false: workflow (on create) and approval (on create) must not run; control true")
    public void g04TriggerOff() {
        String c = "G-04";
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).build());
        on(c, "workflow " + wf, api.setWorkflowActive(wf, true));
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, c + " appr", true, false, caseGuard(LEADS, c),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id())));
        on(c, "approval " + ap, api.setApprovalActive(ap, true));
        Map<String, Object> off = new LinkedHashMap<>();
        leadFields(c, "off").forEach((k, v) -> off.put(k, String.valueOf(v)));
        Map<String, Object> onRow = new LinkedHashMap<>();
        leadFields(c, "on").forEach((k, v) -> onRow.put(k, String.valueOf(v)));
        String idOff = importOneAnyway(c, off, false);
        String idOn = importOneAnyway(c, onRow, true);
        approvalHeld.add(new String[]{LEADS, idOff});
        approvalHeld.add(new String[]{LEADS, idOn});
        CrmApi.waitFor(60, () -> ("WF " + c).equals(val(LEADS, idOn, "description")));
        CrmUser.sleep(20000);
        fact(c, "trigger OFF lead " + idOff + " description=" + val(LEADS, idOff, "description") + " wfFired=" + api.firedCount(idOff, wf)
                + " approval=" + api.approvalState(LEADS, idOff));
        fact(c, "trigger ON  lead " + idOn + " description=" + val(LEADS, idOn, "description") + " wfFired=" + api.firedCount(idOn, wf)
                + " approval=" + api.approvalState(LEADS, idOn));
    }

    /** Import without an assignment rule; the record is found via the list (no executions when nothing fires). */
    private String importOneAnyway(String c, Map<String, Object> row, boolean trigger) {
        String name = String.valueOf(row.get("first_name"));
        JsonPath st = importRows(c, adminA(), LEADS, List.of(row), null, trigger, false);
        String id = api.importedRecordId(st.getString("data.session_id"), LEADS, name, 90);
        fact(c, "imported '" + name + "' trigger=" + trigger + " -> " + id + " status " + st.getString("data.status"));
        if (id == null) throw new IllegalStateException("imported record not found " + name);
        api.track(LEADS, id);
        return id;
    }

    @CaseId("G-04")
    @Test(groups = {"crm-verify"}, description = "Import with trigger_automation false into a review process: after review approval, does the workflow run?")
    public void g04TriggerOffThroughReview() {
        String c = "G-04r";
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("excel_import"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).build());
        on(c, "workflow " + wf, api.setWorkflowActive(wf, true));
        Map<String, Object> off = new LinkedHashMap<>();
        leadFields(c, "off").forEach((k, v) -> off.put(k, String.valueOf(v)));
        JsonPath st = importRows(c, adminA(), LEADS, List.of(off), null, false, false);
        String id = api.findRecord(LEADS, String.valueOf(off.get("first_name")), 90);
        fact(c, "imported (trigger off) -> " + id + " status " + st.getString("data.status"));
        if (id == null) throw new IllegalStateException("not found");
        api.track(LEADS, id);
        CrmApi.waitFor(60, () -> api.reviewStatus(LEADS, id) != null);
        String rs = api.reviewStatus(LEADS, id);
        fact(c, "review status after trigger-off import: " + rs + " description before approval=" + val(LEADS, id, "description"));
        if (CrmApi.reviewPending(rs)) {
            CrmUser.ok(post(c, adminA(), "/workflow/reviews/" + api.reviewRequestId(LEADS, id) + "/fields/email/approve", Map.of()), "approve");
            CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(LEADS, id)));
            CrmApi.waitFor(45, () -> ("WF " + c).equals(val(LEADS, id, "description")));
        }
        fact(c, "after review approval: review=" + api.reviewStatus(LEADS, id) + " description=" + val(LEADS, id, "description") + " wfFired=" + api.firedCount(id, wf)
                + " executions=" + api.executions(id));
    }

    // ------------------------------------------------------------ 6 G-13

    @CaseId("G-13")
    @Test(groups = {"crm-verify"}, description = "Deals import with an assignment rule (no other process): owner")
    public void g13DealsImportOwner() {
        String c = "G-13";
        String ar = ruleIn(DEALS, c, List.of("Import"), userN());
        Map<String, Object> row = new LinkedHashMap<>();
        CrmApi.minimal(DEALS, nm(c, "imp")).forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), DEALS, row, ar, true);
        CrmApi.waitFor(60, () -> userN().id().equals(owner(DEALS, id)));
        fact(c, "deal " + id + " owner=" + who(owner(DEALS, id)) + " executions=" + api.executions(id));
        get(c, adminA(), "/modules/" + DEALS + "/records/" + id);
        // control: deals import without a rule
        Map<String, Object> row2 = new LinkedHashMap<>();
        CrmApi.minimal(DEALS, nm(c, "norule")).forEach((k, v) -> row2.put(k, String.valueOf(v)));
        JsonPath st = importRows(c, adminA(), DEALS, List.of(row2), null, true, false);
        String id2 = api.findRecord(DEALS, nm(c, "norule"), 90);
        if (id2 != null) {
            api.track(DEALS, id2);
            fact(c, "control deal (no rule) " + id2 + " owner=" + who(owner(DEALS, id2)) + " status " + st.getString("data.status"));
        } else fact(c, "control deal not found");
    }

    // ------------------------------------------------------------ 7 G-16

    @CaseId("G-16")
    @Test(groups = {"crm-verify"}, description = "Timeline of an imported lead that ran assignment, workflow and blueprint: raw entries")
    public void g16Timeline() {
        String c = "G-16";
        String ar = rule(c, List.of("Import"), caseGuard(LEADS, c), userN(), "LeaveUnassigned");
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).build());
        on(c, "workflow " + wf, api.setWorkflowActive(wf, true));
        String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), null));
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> row = new LinkedHashMap<>();
        leadFields(c, "imp").forEach((k, v) -> row.put(k, String.valueOf(v)));
        String id = importOne(c, adminA(), LEADS, row, ar, true);
        CrmApi.waitFor(60, () -> userN().id().equals(owner(LEADS, id)) && ("WF " + c).equals(val(LEADS, id, "description")) && api.governed(LEADS, id));
        fact(c, "lead " + id + " owner=" + who(owner(LEADS, id)) + " description=" + val(LEADS, id, "description") + " governed=" + api.governed(LEADS, id));
        CrmUser.sleep(5000);
        Response tl = get(c, adminA(), "/timeline/records/leads/" + id + "/feed");
        List<Map<String, Object>> rows = tl.jsonPath().getList("data.data");
        if (rows != null) for (Map<String, Object> r : rows) fact(c, "timeline row " + cut(json(r), 900));
    }
}
