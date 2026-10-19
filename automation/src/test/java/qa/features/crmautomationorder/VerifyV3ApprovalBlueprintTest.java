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
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;
import static qa.features.deskworkflowrules.Rules.kinded;

/** Re-verification (19 Oct 2026): approval, blueprint, conversion while held. Session V3. */
public class VerifyV3ApprovalBlueprintTest extends VerifyBase {
    @Override protected String session() { return "V3"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private static final List<String> SRC = List.of("chat", "web", "referral");

    private String approval(String module, String c, boolean onCreate, boolean onEdit, Map<String, Object> crit, List<Map<String, Object>> levels,
                            Map<String, Object> rejectedAccess) {
        Map<String, Object> body = CrmProcs.approvalProcess(module, c + " appr", onCreate, onEdit, crit, levels, List.of(adminA().id()));
        if (rejectedAccess != null) {
            @SuppressWarnings("unchecked") Map<String, Object> rule = ((List<Map<String, Object>>) body.get("rules")).get(0);
            rule.put("rejectedFieldAccess", rejectedAccess);
        }
        String id = api.approvalProcess(body);
        on(c, "approval " + id, api.setApprovalActive(id, true));
        return id;
    }

    private JsonPath view(String c, CrmUser u, String module, String id) {
        return CrmUser.ok(get(c, u, "/workflow/approvals/records/" + module + "/" + id), "approval view").jsonPath();
    }

    private String summary(JsonPath v) {
        return "state=" + v.getString("data.state") + " isCurrentApprover=" + v.get("data.isCurrentApprover") + " isProcessAdmin=" + v.get("data.isProcessAdmin")
                + " canApprove=" + v.get("data.canApprove") + " blockedReason=" + v.get("data.viewerDecisionBlockedReason") + " canResubmit=" + v.get("data.canResubmit");
    }

    private Map<String, Object> leadNoPhone(String c, String sfx) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, sfx)));
        f.remove("phone"); // read-only for userV's profile
        return f;
    }

    // ------------------------------------------------------------ D-06 + isProcessAdmin

    @CaseId("D-06")
    @Test(groups = {"crm-verify"}, description = "Submitter who is also a level approver approves its own record; isProcessAdmin per viewer")
    public void d06SelfApproval() {
        String c = "D-06";
        approval(LEADS, c, true, false, caseGuard(LEADS, c), List.of(CrmProcs.levelUsers(userV().id(), supervisor().id())), null);
        String id = createLogged(c, userV(), LEADS, leadNoPhone(c, "v"));
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        for (CrmUser u : List.of(userV(), supervisor(), adminB(), adminA()))
            fact(c, "view as " + u.email + ": " + summary(view(c, u, LEADS, id)) + " (process admins = [mmohamed]; approvers = [valafo4080, mahmoud.mmohamedsamy])");
        JsonPath v = view(c, userV(), LEADS, id);
        Response a = post(c, userV(), "/workflow/approvals/" + v.getString("data.instanceId") + "/approve", Map.of("comment", "QA AEO V3 self"));
        CrmUser.sleep(3000);
        fact(c, "submitter userV approves own record -> " + a.statusCode() + "; state now " + api.approvalState(LEADS, id) + " approval_status=" + api.approvalStatus(LEADS, id));

        // control with the User-profile submitter: level [userN, supervisor], userN submits
        String c2 = "D-06n";
        approval(LEADS, c2, true, false, caseGuard(LEADS, c2), List.of(CrmProcs.levelUsers(userN().id(), supervisor().id())), null);
        String id2 = createLogged(c2, userN(), LEADS, CrmApi.minimal(LEADS, nm(c2, "n")));
        approvalHeld.add(new String[]{LEADS, id2});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id2)));
        JsonPath vn = view(c2, userN(), LEADS, id2);
        fact(c2, "view as userN (submitter + approver): " + summary(vn));
        Response a2 = post(c2, userN(), "/workflow/approvals/" + vn.getString("data.instanceId") + "/approve", Map.of("comment", "QA AEO V3 self"));
        CrmUser.sleep(3000);
        fact(c2, "submitter userN approves own record -> " + a2.statusCode() + "; state now " + api.approvalState(LEADS, id2));
        get(c, userV(), "/iam/me/profile");
    }

    // ------------------------------------------------------------ D-05

    @CaseId("D-05")
    @Test(groups = {"crm-verify"}, description = "Rejected record renamed out of the criteria and resubmitted: released? editable?")
    public void d05ResubmitNoMatch() {
        String c = "D-05";
        approval(LEADS, c, true, true, caseGuard(LEADS, c), List.of(CrmProcs.levelUsers(supervisor().id())), kinded("mode", "all", "fields", List.of(), "resetFields", List.of()));
        String id = createLogged(c, userN(), LEADS, CrmApi.minimal(LEADS, nm(c, "lead")));
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        JsonPath v = view(c, supervisor(), LEADS, id);
        CrmUser.ok(post(c, supervisor(), "/workflow/approvals/" + v.getString("data.instanceId") + "/reject", Map.of("comment", "QA AEO reject")), "reject");
        CrmApi.waitFor(30, () -> "rejected".equals(api.approvalState(LEADS, id)));
        Response e = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("first_name", nm("X05", "lead")))));
        JsonPath vr = view(c, userN(), LEADS, id);
        Response rs = post(c, userN(), "/workflow/approvals/" + vr.getString("data.instanceId") + "/resubmit", Map.of());
        CrmUser.sleep(5000);
        JsonPath after = view(c, userN(), LEADS, id);
        Response e2 = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit after release"))));
        Response del = del(c, adminA(), "/modules/" + LEADS + "/records/" + id);
        fact(c, "rename " + e.statusCode() + "; resubmit " + rs.statusCode() + " outcome=" + rs.jsonPath().getString("data.outcome") + "; after: " + summary(after)
                + " approval_status field=" + api.approvalStatus(LEADS, id) + "; userN edit after release -> " + e2.statusCode() + "; admin delete -> " + del.statusCode());
    }

    // ------------------------------------------------------------ D-17

    @CaseId("D-17")
    @Test(groups = {"crm-verify"}, description = "Delete an approval process that still has a pending record")
    public void d17DeleteWithPending() {
        String c = "D-17";
        String p = approval(LEADS, c, true, false, caseGuard(LEADS, c), List.of(CrmProcs.levelUsers(supervisor().id())), null);
        String id = createLogged(c, userN(), LEADS, CrmApi.minimal(LEADS, nm(c, "lead")));
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        patch(c, adminA(), "/workflow/approval-processes/" + p + "/active", Map.of("isActive", false));
        Response d = del(c, adminA(), "/workflow/approval-processes/" + p);
        fact(c, "delete process with 1 pending record -> " + d.statusCode() + " " + cut(d.asString(), 400) + "; record state " + api.approvalState(LEADS, id));
    }

    // ------------------------------------------------------------ K-09

    @CaseId("K-09")
    @Test(groups = {"crm-verify"}, description = "Owner PATCHes approval_status by hand (control: Owner status-reset action, D-18)")
    public void k09OwnerEdit() {
        String c = "K-09";
        String id = createLogged(c, userN(), LEADS, CrmApi.minimal(LEADS, nm(c, "lead")));
        Response r = patch(c, owner(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("approval_status", "rejected"))));
        fact(c, "Owner PATCH approval_status=rejected -> " + r.statusCode() + " " + cut(r.asString(), 300) + "; approval_status now " + api.approvalStatus(LEADS, id));
    }

    // ------------------------------------------------------------ D-21 / H-03 / H-02 / H-04 convert

    @CaseId({"D-21", "H-03"})
    @Test(groups = {"crm-verify"}, description = "Convert a lead pending approval")
    public void h03ConvertPendingApproval() {
        String c = "H-03";
        approval(LEADS, c, true, false, caseGuard(LEADS, c), List.of(CrmProcs.levelUsers(supervisor().id())), null);
        String id = createLogged(c, userN(), LEADS, CrmApi.minimal(LEADS, nm(c, "lead")));
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        fact(c, "lead " + id + " approval=" + api.approvalState(LEADS, id));
        Response a = convert(c, userN(), id);
        Response b = a.statusCode() / 100 == 2 ? a : convert(c, adminA(), id);
        Response d = del(c, adminA(), "/modules/" + LEADS + "/records/" + id);
        fact(c, "convert pending-approval lead: userN -> " + a.statusCode() + (a == b ? "" : ", adminA -> " + b.statusCode()) + "; delete (control, blocked) -> " + d.statusCode()
                + "; approval after convert=" + api.approvalState(LEADS, id));
    }

    @CaseId("H-02")
    @Test(groups = {"crm-verify"}, description = "Convert a lead held for review")
    public void h02ConvertPendingReview() {
        String c = "H-02";
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminB().id()), List.of(adminB().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("email", "qa.aeo.v3.h02@qa.test");
        String id = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        Response edit = patch(c, userN(), "/modules/" + LEADS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("description", "QA edit while held"))));
        Response a = convert(c, userN(), id);
        Response b = a.statusCode() / 100 == 2 ? a : convert(c, adminA(), id);
        fact(c, "lead " + id + " review=" + api.reviewStatus(LEADS, id) + "; edit while held (control) -> " + edit.statusCode() + "; convert userN -> " + a.statusCode()
                + (a == b ? "" : ", adminA -> " + b.statusCode()) + "; review after convert=" + api.reviewStatus(LEADS, id));
    }

    @CaseId("H-04")
    @Test(groups = {"crm-verify"}, description = "Convert a lead governed by a blueprint (no Convert transition)")
    public void h04ConvertInBlueprint() {
        String c = "H-04";
        String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c), SRC, null));
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        Response a = convert(c, userN(), id);
        Response b = a.statusCode() / 100 == 2 ? a : convert(c, adminA(), id);
        fact(c, "lead " + id + " governed=" + api.governed(LEADS, id) + "; convert userN -> " + a.statusCode() + (a == b ? "" : ", adminA -> " + b.statusCode()));
    }

    // ------------------------------------------------------------ F-20

    @CaseId("F-20")
    @Test(groups = {"crm-verify"}, description = "Deal in a blueprint edited to match an On Edit approval: does approval start? (control outside the blueprint)")
    public void f20ApprovalOnBlueprintRecord() {
        String c = "F-20";
        String pipe = CrmApi.pipelineOf(layout(DEALS));
        String bp = api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), pipe, "stage", c + " BP", CrmProcs.guard(DEALS, nm(c, "bp")),
                List.of("qualification", "proposal"), null));
        on(c, "blueprint " + bp, api.setBlueprintActive(DEALS, bp, true));
        approval(DEALS, c, false, true, CrmProcs.and(caseGuard(DEALS, c), CrmProcs.eq("next_step", "edit")), List.of(CrmProcs.levelUsers(supervisor().id())), null);
        String ctl = createLogged(c, userN(), DEALS, CrmApi.minimal(DEALS, nm(c, "ctl")));
        String id = createLogged(c, userN(), DEALS, CrmApi.minimal(DEALS, nm(c, "bp deal")));
        approvalHeld.add(new String[]{DEALS, ctl});
        approvalHeld.add(new String[]{DEALS, id});
        CrmApi.waitFor(45, () -> api.governed(DEALS, id));
        patch(c, userN(), "/modules/" + DEALS + "/records/" + ctl, Map.of("data", CrmApi.data(Map.of("next_step", "edit"))));
        patch(c, userN(), "/modules/" + DEALS + "/records/" + id, Map.of("data", CrmApi.data(Map.of("next_step", "edit"))));
        CrmApi.waitFor(45, () -> api.approvalState(DEALS, ctl) != null && api.approvalState(DEALS, id) != null);
        fact(c, "control deal " + ctl + " governed=" + api.governed(DEALS, ctl) + " approval=" + api.approvalState(DEALS, ctl)
                + " | blueprint deal " + id + " governed=" + api.governed(DEALS, id) + " approval=" + api.approvalState(DEALS, id));
        get(c, adminA(), "/modules/" + DEALS + "/records/" + id + "/blueprint-state");
    }

    // ------------------------------------------------------------ E-13

    @CaseId("E-13")
    @Test(groups = {"crm-verify"}, description = "Mass-exclude one record from a blueprint, then edit its (formerly governed) field")
    public void e13MassExclude() {
        String c = "E-13";
        String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c), SRC, null));
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> f1 = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead1")));
        f1.put("lead_source", "chat");
        Map<String, Object> f2 = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead2")));
        f2.put("lead_source", "chat");
        String l1 = createLogged(c, userN(), LEADS, f1);
        String l2 = createLogged(c, userN(), LEADS, f2);
        CrmApi.waitFor(45, () -> api.governed(LEADS, l1) && api.governed(LEADS, l2));
        Response before = patch(c, userN(), "/modules/" + LEADS + "/records/" + l2, Map.of("data", CrmApi.data(Map.of("lead_source", "referral"))));
        Response x = post(c, adminA(), "/modules/" + LEADS + "/blueprints/" + bp + "/mass-exclude", Map.of("record_ids", List.of(l1)));
        CrmApi.waitFor(30, () -> !api.governed(LEADS, l1));
        get(c, adminA(), "/modules/" + LEADS + "/records/" + l1 + "/blueprint-state");
        Response e1 = patch(c, userN(), "/modules/" + LEADS + "/records/" + l1, Map.of("data", CrmApi.data(Map.of("lead_source", "referral"))));
        Response e2 = patch(c, adminA(), "/modules/" + LEADS + "/records/" + l1, Map.of("data", CrmApi.data(Map.of("lead_source", "referral"))));
        Response e3 = patch(c, userN(), "/modules/" + LEADS + "/records/" + l1, Map.of("data", CrmApi.data(Map.of("description", "QA other field"))));
        fact(c, "governed control l2 edit of lead_source -> " + before.statusCode() + "; mass-exclude l1 -> " + x.statusCode() + "; l1 governed=" + api.governed(LEADS, l1)
                + "; l1 lead_source edit userN -> " + e1.statusCode() + ", adminA -> " + e2.statusCode() + "; l1 description edit -> " + e3.statusCode()
                + "; l1 lead_source now " + val(LEADS, l1, "lead_source"));
    }

    // ------------------------------------------------------------ E-18

    @CaseId("E-18")
    @Test(groups = {"crm-verify"}, description = "Two blueprints on the same layout/field: which governs; does PATCH /blueprints/sort change it")
    public void e18Sort() {
        String c = "E-18";
        Map<String, Object> ba = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP one", caseGuard(LEADS, c), SRC, null);
        Map<String, Object> bb = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP two", caseGuard(LEADS, c), SRC, null);
        String a = api.blueprint(LEADS, ba);
        String b = api.blueprint(LEADS, bb);
        on(c, "bp one", api.setBlueprintActive(LEADS, a, true));
        on(c, "bp two", api.setBlueprintActive(LEADS, b, true));
        fact(c, "list before sort " + order(a, b));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead1")));
        f.put("lead_source", "chat");
        String l1 = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, l1));
        fact(c, "lead1 governed by " + api.blueprintState(adminA(), LEADS, l1).getList("data.states.blueprintName"));
        for (Object body : List.of(
                Map.of("items", List.of(Map.of("id", b, "sort_order", 0), Map.of("id", a, "sort_order", 1))),
                Map.of("items", List.of(Map.of("id", b, "sortOrder", 0), Map.of("id", a, "sortOrder", 1))),
                Map.of("ids", List.of(b, a)))) {
            Response s = patch(c, adminA(), "/modules/" + LEADS + "/blueprints/sort", body);
            fact(c, "sort " + json(body) + " -> " + s.statusCode() + "; list now " + order(a, b));
        }
        Map<String, Object> f2 = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead2")));
        f2.put("lead_source", "chat");
        String l2 = createLogged(c, userN(), LEADS, f2);
        CrmApi.waitFor(45, () -> api.governed(LEADS, l2));
        fact(c, "lead2 (after sort) governed by " + api.blueprintState(adminA(), LEADS, l2).getList("data.states.blueprintName"));
    }

    private String order(String a, String b) {
        List<Map<String, Object>> list = CrmUser.ok(adminA().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data");
        StringBuilder sb = new StringBuilder();
        int i = 0;
        for (Map<String, Object> x : list) {
            if (a.equals(x.get("id"))) sb.append("one@").append(i).append("(sortOrder ").append(x.get("sortOrder")).append(") ");
            if (b.equals(x.get("id"))) sb.append("two@").append(i).append("(sortOrder ").append(x.get("sortOrder")).append(") ");
            i++;
        }
        return sb.toString();
    }

    // ------------------------------------------------------------ E-15

    @CaseId({"E-15", "J-01", "E2E-5"})
    @Test(groups = {"crm-verify"}, description = "Tasks Status field datatype; blueprint on Status refused; on Priority accepted")
    public void e15TasksStatusType() {
        String c = "E-15";
        List<Map<String, Object>> fs = CrmUser.ok(adminA().get("/modules/" + TASKS + "/fields"), "fields").jsonPath().getList("data");
        for (Map<String, Object> f : fs)
            if ("status".equals(f.get("apiName")) || "priority".equals(f.get("apiName")))
                fact(c, "Tasks field " + f.get("apiName") + " datatypeKey=" + f.get("datatypeKey") + " options=" + json(f.get("datatypeOptions")));
        List<Map<String, Object>> lf = CrmUser.ok(adminA().get("/modules/" + LEADS + "/fields"), "fields").jsonPath().getList("data");
        for (Map<String, Object> f : lf)
            if ("lead_status".equals(f.get("apiName"))) fact(c, "Leads field lead_status datatypeKey=" + f.get("datatypeKey"));
        Map<String, Object> b = CrmProcs.blueprint("tasks", layout(TASKS), null, "status", c + " BP status", caseGuard(TASKS, c), List.of("Not Started", "In Progress"), null);
        Response r = post(c, adminA(), "/modules/" + TASKS + "/blueprints", b);
        if (r.statusCode() / 100 == 2) adminA().delete("/modules/" + TASKS + "/blueprints/" + r.jsonPath().getString("data.id"));
        fact(c, "blueprint on Tasks status -> " + r.statusCode() + " " + cut(r.asString(), 300));
    }
}
