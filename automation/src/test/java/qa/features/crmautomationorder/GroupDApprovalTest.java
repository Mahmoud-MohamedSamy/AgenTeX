package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;

/**
 * Spec group D — Approval Process alone (S1.4), session SD.
 * Submitter = userV (profile "test"); Level 1 approver = submitter's manager (supervisor); second level / delegate = adminB;
 * process admin (creates processes, takeover) = adminA. Each case has its own process guarded on "QA AEO SD D-xx".
 * userV's profile has Phone read-only, so its leads are created without Phone (the server accepts that).
 */
public class GroupDApprovalTest extends OrderTestBase {
    @Override protected String session() { return "SD"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private static final String PENDING = "pending_approval";
    private final List<String[]> made = new ArrayList<>();

    // ---------------- helpers ----------------

    private static void log(String tag, String what, Object v) {
        String s = v instanceof Response r ? r.statusCode() + " " + r.asString() : String.valueOf(v);
        System.out.println("[" + tag + "] " + what + " -> " + (s.length() > 1500 ? s.substring(0, 1500) + "…" : s));
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> rule(Map<String, Object> body) {
        return ((List<Map<String, Object>>) body.get("rules")).get(0);
    }

    private static Map<String, Object> access(String mode, List<String> fields, List<String> reset) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("mode", mode);
        m.put("fields", fields);
        m.put("resetFields", reset);
        return m;
    }

    /** Creates + activates an approval process for this case (guard: name starts with "QA AEO SD <tag>"). */
    private String process(String module, String tag, boolean onCreate, boolean onEdit, List<Map<String, Object>> levels, Consumer<Map<String, Object>> tweakRule) {
        Map<String, Object> body = CrmProcs.approvalProcess(module, tag + " approval", onCreate, onEdit, CrmProcs.guard(module, nm(tag, "")), levels, List.of(adminA().id()));
        if (tweakRule != null) tweakRule.accept(rule(body));
        String id = api.approvalProcess(body);
        Response on = api.setApprovalActive(id, true);
        Assert.assertEquals(on.statusCode() / 100, 2, "activate approval process: " + on.asString());
        return id;
    }

    private String process(String tag, List<Map<String, Object>> levels, Consumer<Map<String, Object>> tweakRule) {
        return process(LEADS, tag, true, true, levels, tweakRule);
    }

    private Map<String, Object> fields(String module, String name) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(module, name));
        if (LEADS.equals(module)) f.remove("phone"); // read-only for userV's profile
        return f;
    }

    /** Record created by userV (the submitter), registered for cleanup. */
    private String vRecord(String module, String name) {
        String id = api.createRecord(userV(), module, layout(module), fields(module, name));
        made.add(new String[]{module, id});
        return id;
    }

    private String lead(String tag) {
        return vRecord(LEADS, nm(tag, "lead"));
    }

    /**
     * Lead created by userN with all required fields (Phone included). userV's leads have no Phone (read-only for its
     * profile), so every later edit of them fails "Phone is required" (seen 18 Oct 2026): Leads cases that edit the
     * record use userN as submitter and level 1 = supervisor as a named user.
     */
    private String nLead(String name) {
        String id = api.createRecord(userN(), LEADS, layout(LEADS), CrmApi.minimal(LEADS, name));
        made.add(new String[]{LEADS, id});
        return id;
    }

    private Map<String, Object> supLevel() {
        return CrmProcs.levelUsers(supervisor().id());
    }

    /** No approval was ever started: state null, "none" (seen after deactivation) or not_submitted. */
    private static boolean notSubmitted(String state) {
        return state == null || "none".equals(state) || "not_submitted".equals(state);
    }

    private JsonPath ap(CrmUser as, String module, String id) {
        return api.approval(as, module, id);
    }

    private String state(String module, String id) {
        return api.approvalState(module, id);
    }

    private boolean waitState(String module, String id, String expected) {
        return CrmApi.waitFor(45, () -> expected.equals(state(module, id)));
    }

    private String inst(String module, String id) {
        return ap(adminA(), module, id).getString("data.instanceId");
    }

    private Response post(CrmUser as, String path, Object body) {
        return as.post(path, body);
    }

    private static boolean blocked(Response r) {
        return r.statusCode() / 100 == 4;
    }

    /** Release approval locks so the base cleanup can delete the records (runs before OrderTestBase's @AfterMethod). */
    @AfterMethod(alwaysRun = true)
    public void releaseLocks() {
        for (String[] m : made) {
            try {
                String s = state(m[0], m[1]);
                if (s != null) owner().post("/workflow/approvals/records/" + m[0] + "/" + m[1] + "/status-reset", Map.of("reason", "QA AEO SD cleanup"));
            } catch (Exception e) {
                System.out.println("[release] " + m[1] + " " + e.getMessage());
            }
        }
        made.clear();
    }

    // ---------------- cases ----------------

    @CaseId("D-01")
    @Test(groups = {"crm-order", "group-d"}, description = "userV creates a matching lead: pending approval, locked for userV, supervisor (his manager) sees it in My Approvals")
    public void d01MatchingLeadGoesToSubmitterManager() {
        process("D-01", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-01");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending_approval");
        traceOf("D-01", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(api.approvalStatus(LEADS, lead), PENDING, "approval_status field (chip)");
        s.assertEquals(ap(adminA(), LEADS, lead).getList("data.currentApprovers"), List.of(supervisor().id()), "submitter's manager = supervisor");
        Response edit = api.update(userV(), LEADS, lead, Map.of("description", "QA edit while pending"));
        log("D-01", "userV edit", edit);
        s.assertTrue(blocked(edit), "record locked for userV: " + edit.statusCode());
        List<Map<String, Object>> mine = CrmUser.ok(supervisor().get("/workflow/approvals/me"), "my approvals").jsonPath().getList("data");
        s.assertTrue(mine.stream().anyMatch(m -> lead.equals(m.get("recordId")) && Boolean.TRUE.equals(m.get("awaitingMe"))), "in supervisor's My Approvals");
        s.assertTrue(ap(supervisor(), LEADS, lead).getBoolean("data.canApprove"), "supervisor canApprove");
        s.assertAll();
    }

    @CaseId("D-02")
    @Test(groups = {"crm-order", "group-d"}, description = "Approver approves: Approved and the final action (field update) runs")
    public void d02ApproveRunsFinalActions() {
        process("D-02", List.of(CrmProcs.levelSubmitterManager()), r -> r.put("finalActions", new ArrayList<>(List.of(CrmProcs.fieldUpdateAction("description", "QA final D-02")))));
        String lead = lead("D-02");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending first");
        Response a = api.approve(supervisor(), LEADS, lead);
        log("D-02", "approve", a);
        Assert.assertEquals(a.statusCode() / 100, 2, "approve accepted");
        Assert.assertTrue(waitState(LEADS, lead, "approved"), "approved");
        boolean marker = CrmApi.waitFor(60, () -> "QA final D-02".equals(api.field(adminA(), LEADS, lead, "description")));
        traceOf("D-02", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(api.approvalStatus(LEADS, lead), "approved", "approval_status");
        s.assertTrue(marker, "final action field update ran (description=" + api.field(adminA(), LEADS, lead, "description") + ")");
        s.assertAll();
    }

    @CaseId("D-03")
    @Test(groups = {"crm-order", "group-d", "NDC-1849"}, description = "Approver rejects with a comment: Rejected; submitter sees who rejected, the comment and Resubmit")
    public void d03RejectWithCommentOffersResubmit() {
        process("D-03", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-03");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending first");
        Response r = post(supervisor(), "/workflow/approvals/" + inst(LEADS, lead) + "/reject", Map.of("comment", "QA reject comment D-03"));
        log("D-03", "reject", r);
        Assert.assertEquals(r.statusCode() / 100, 2, "reject accepted");
        Assert.assertTrue(waitState(LEADS, lead, "rejected"), "rejected");
        JsonPath v = ap(userV(), LEADS, lead);
        log("D-03", "submitter view", v.prettify());
        traceOf("D-03", LEADS, lead);
        List<Map<String, Object>> h = v.getList("data.history");
        Map<String, Object> rej = h.stream().filter(e -> String.valueOf(e.get("eventKind")).contains("reject")).reduce((a, b) -> b).orElse(null);
        SoftAssert s = new SoftAssert();
        s.assertEquals(api.approvalStatus(LEADS, lead), "rejected", "approval_status");
        s.assertTrue(v.getBoolean("data.canResubmit"), "submitter canResubmit");
        s.assertNotNull(rej, "rejection event in history");
        if (rej != null) {
            s.assertEquals(rej.get("actorUserId"), supervisor().id(), "rejected by supervisor");
            s.assertEquals(rej.get("comment"), "QA reject comment D-03", "rejection comment");
        }
        s.assertAll();
    }

    @CaseId("D-04")
    @Test(groups = {"crm-order", "group-d"}, description = "Submitter edits the rejected record and resubmits: pending again under the same process")
    public void d04ResubmitAfterEdit() {
        process("D-04", List.of(supLevel()), r -> r.put("rejectedFieldAccess", access("all", List.of(), List.of())));
        String lead = nLead(nm("D-04", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending first");
        String first = inst(LEADS, lead);
        Assert.assertEquals(api.reject(supervisor(), LEADS, lead).statusCode() / 100, 2, "reject");
        Assert.assertTrue(waitState(LEADS, lead, "rejected"), "rejected");
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA fixed D-04"));
        log("D-04", "edit rejected", e);
        Assert.assertEquals(e.statusCode() / 100, 2, "edit allowed in rejected state (rejectedFieldAccess=all)");
        Response rs = api.resubmitApproval(userN(), LEADS, lead);
        log("D-04", "resubmit", rs);
        Assert.assertEquals(rs.statusCode() / 100, 2, "resubmit accepted");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending again");
        JsonPath v = ap(adminA(), LEADS, lead);
        traceOf("D-04", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(v.getString("data.processName"), CrmProcs.name("D-04 approval"), "same process");
        s.assertNotEquals(v.getString("data.instanceId"), first, "new instance");
        s.assertEquals(v.getList("data.currentApprovers"), List.of(supervisor().id()), "level 1 approver again");
        s.assertEquals(api.field(adminA(), LEADS, lead, "description"), "QA fixed D-04", "edit kept");
        s.assertAll();
    }

    @CaseId("D-05")
    @Test(groups = {"crm-order", "group-d"}, description = "Resubmit when no process matches any more: record released")
    public void d05ResubmitWithNoMatchReleases() {
        process("D-05", List.of(supLevel()), r -> r.put("rejectedFieldAccess", access("all", List.of(), List.of())));
        String lead = nLead(nm("D-05", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending first (control)");
        Assert.assertEquals(api.reject(supervisor(), LEADS, lead).statusCode() / 100, 2, "reject");
        Assert.assertTrue(waitState(LEADS, lead, "rejected"), "rejected");
        Response e = api.update(userN(), LEADS, lead, Map.of("first_name", nm("X05", "lead")));
        Assert.assertEquals(e.statusCode() / 100, 2, "rename out of the criteria: " + e.asString());
        Response rs = api.resubmitApproval(userN(), LEADS, lead);
        log("D-05", "resubmit", rs);
        CrmApi.waitFor(20, () -> !"rejected".equals(state(LEADS, lead)));
        String st = state(LEADS, lead);
        String status = api.approvalStatus(LEADS, lead);
        log("D-05", "after", "state=" + st + " approval_status=" + status);
        traceOf("D-05", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(rs.statusCode() / 100, 2, "resubmit answered");
        s.assertTrue(rs.asString().contains("released") || rs.asString().toLowerCase().contains("no_match") || rs.asString().contains("resubmitReleased"), "released outcome in response");
        s.assertNotEquals(st, PENDING, "not pending");
        s.assertNotEquals(st, "rejected", "no longer rejected");
        s.assertTrue(notSubmitted(status), "approval_status released (" + status + ")");
        s.assertAll();
    }

    @CaseId("D-06")
    @Test(groups = {"crm-order", "group-d"}, description = "Submitter who is also a level approver can't approve their own record")
    public void d06SubmitterCannotApproveOwnRecord() {
        process("D-06", List.of(CrmProcs.levelUsers(userV().id(), supervisor().id())), null);
        String lead = lead("D-06");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        JsonPath v = ap(userV(), LEADS, lead);
        log("D-06", "submitter view", v.prettify());
        Response a = post(userV(), "/workflow/approvals/" + v.getString("data.instanceId") + "/approve", Map.of("comment", "self"));
        log("D-06", "self approve", a);
        traceOf("D-06", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(a), "self approve blocked: " + a.statusCode());
        s.assertEquals(state(LEADS, lead), PENDING, "still pending");
        s.assertFalse(v.getBoolean("data.canApprove"), "canApprove false");
        s.assertEquals(v.getString("data.viewerDecisionBlockedReason"), "self_submitted", "UI: You can't approve a record you submitted");
        s.assertAll();
    }

    @CaseId("D-07")
    @Test(groups = {"crm-order", "group-d"}, description = "Record modification = No fields: submitter can't edit a pending record")
    public void d07NoFieldsEditableWhilePending() {
        process("D-07", List.of(supLevel()), null);
        String control = nLead(nm("X07", "control"));
        Response c = api.update(userN(), LEADS, control, Map.of("description", "QA control D-07"));
        Assert.assertEquals(c.statusCode() / 100, 2, "control: the submitter can edit a lead outside the process");
        String lead = nLead(nm("D-07", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA edit D-07"));
        Response e2 = api.update(userN(), LEADS, lead, Map.of("single_line_3_9", "QA AEO 2"));
        log("D-07", "edit", e);
        traceOf("D-07", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(e) && e.asString().contains("APPROVAL_LOCKED"), "description blocked");
        s.assertTrue(blocked(e2), "single_line_3_9 blocked");
        s.assertNull(api.field(adminA(), LEADS, lead, "description"), "unchanged");
        s.assertAll();
    }

    @CaseId("D-08")
    @Test(groups = {"crm-order", "group-d"}, description = "Record modification = Specific fields while pending: only those fields editable")
    public void d08SpecificFieldsEditableWhilePending() {
        Map<String, Object> lvl = supLevel();
        lvl.put("waitingFieldAccess", access("specific", List.of("description"), List.of()));
        process("D-08", List.of(lvl), null);
        String lead = nLead(nm("D-08", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        Response ok = api.update(userN(), LEADS, lead, Map.of("description", "QA allowed D-08"));
        Response no = api.update(userN(), LEADS, lead, Map.of("single_line_3_9", "QA AEO 8"));
        log("D-08", "allowed", ok);
        log("D-08", "other", no);
        traceOf("D-08", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(ok.statusCode() / 100, 2, "description editable");
        s.assertEquals(api.field(adminA(), LEADS, lead, "description"), "QA allowed D-08", "description saved");
        s.assertTrue(blocked(no), "other field blocked");
        s.assertEquals(api.field(adminA(), LEADS, lead, "single_line_3_9"), "QA AEO", "other field unchanged");
        s.assertEquals(state(LEADS, lead), PENDING, "still pending");
        s.assertAll();
    }

    @CaseId("D-09")
    @Test(groups = {"crm-order", "group-d"}, description = "Approved record edited again (Create & Edit): does not re-enter approval")
    public void d09ApprovedRecordEditDoesNotReenter() {
        process("D-09", List.of(supLevel()), r -> r.put("approvedFieldAccess", access("all", List.of(), List.of())));
        String lead = nLead(nm("D-09", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending (control: the process fires)");
        String first = inst(LEADS, lead);
        Assert.assertEquals(api.approve(supervisor(), LEADS, lead).statusCode() / 100, 2, "approve");
        Assert.assertTrue(waitState(LEADS, lead, "approved"), "approved");
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA after approval D-09"));
        log("D-09", "edit approved", e);
        Assert.assertEquals(e.statusCode() / 100, 2, "edit allowed (approvedFieldAccess=all)");
        CrmUser.sleep(5000);
        traceOf("D-09", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(state(LEADS, lead), "approved", "still approved");
        s.assertEquals(inst(LEADS, lead), first, "no new instance");
        s.assertEquals(api.approvalStatus(LEADS, lead), "approved", "approval_status");
        s.assertAll();
    }

    @CaseId("D-10")
    @Test(groups = {"crm-order", "group-d"}, description = "'Reset approval status if changed' field edited by a permitted user sends the record back for approval")
    public void d10ResetFieldSendsBackForApproval() {
        process("D-10", List.of(supLevel()), r -> r.put("approvedFieldAccess", access("specific", List.of("email"), List.of("description"))));
        String lead = nLead(nm("D-10", "lead"));
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        String first = inst(LEADS, lead);
        Assert.assertEquals(api.approve(supervisor(), LEADS, lead).statusCode() / 100, 2, "approve");
        Assert.assertTrue(waitState(LEADS, lead, "approved"), "approved");
        Response byV = api.update(userN(), LEADS, lead, Map.of("description", "QA by submitter D-10"));
        log("D-10", "submitter edits locked reset field", byV);
        Response byO = api.update(owner(), LEADS, lead, Map.of("description", "QA by owner D-10"));
        log("D-10", "owner edits reset field", byO);
        CrmApi.waitFor(30, () -> !"approved".equals(state(LEADS, lead)));
        JsonPath v = ap(adminA(), LEADS, lead);
        log("D-10", "after", "state=" + v.getString("data.state") + " inst=" + v.getString("data.instanceId") + " status=" + api.approvalStatus(LEADS, lead));
        traceOf("D-10", LEADS, lead);
        if (byO.statusCode() / 100 != 2) inconclusive("owner (override profile) could not edit the locked reset field either: " + byO.statusCode() + " " + byO.asString());
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(byV), "submitter (User profile) can't edit the locked field");
        s.assertEquals(v.getString("data.state"), PENDING, "back to pending approval");
        s.assertNotEquals(v.getString("data.instanceId"), first, "new approval instance");
        s.assertAll();
    }

    @CaseId("D-11")
    @Test(groups = {"crm-order", "group-d"}, description = "Two levels: supervisor then adminB; Level 1 of 2 then Level 2 of 2")
    public void d11TwoLevels() {
        process("D-11", List.of(CrmProcs.levelUsers(supervisor().id()), CrmProcs.levelUsers(adminB().id())), null);
        String lead = lead("D-11");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        JsonPath l1 = ap(adminA(), LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(l1.getInt("data.totalLevels"), 2, "2 levels");
        s.assertEquals(l1.getInt("data.currentStage"), 0, "level 1");
        s.assertEquals(l1.getList("data.currentApprovers"), List.of(supervisor().id()), "level 1 approver");
        s.assertFalse(ap(adminB(), LEADS, lead).getBoolean("data.canApprove"), "level 2 approver can't act yet");
        Assert.assertEquals(api.approve(supervisor(), LEADS, lead).statusCode() / 100, 2, "level 1 approve");
        CrmApi.waitFor(30, () -> ap(adminA(), LEADS, lead).getInt("data.currentStage") == 1);
        JsonPath l2 = ap(adminA(), LEADS, lead);
        s.assertEquals(l2.getString("data.state"), PENDING, "still pending after level 1");
        s.assertEquals(l2.getInt("data.currentStage"), 1, "level 2");
        s.assertEquals(l2.getList("data.currentApprovers"), List.of(adminB().id()), "level 2 approver");
        Assert.assertEquals(api.approve(adminB(), LEADS, lead).statusCode() / 100, 2, "level 2 approve");
        s.assertTrue(waitState(LEADS, lead, "approved"), "approved after level 2");
        traceOf("D-11", LEADS, lead);
        s.assertAll();
    }

    @CaseId("D-12")
    @Test(groups = {"crm-order", "group-d", "NDC-1872"}, description = "Approver delegates to adminB: adminB can act and sees who delegated (names, not ids)")
    public void d12Delegate() {
        process("D-12", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-12");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        String i = inst(LEADS, lead);
        Response cand = supervisor().get("/workflow/approvals/" + i + "/delegate-candidates");
        log("D-12", "candidates", cand);
        Response d = post(supervisor(), "/workflow/approvals/" + i + "/delegate", Map.of("toUserId", adminB().id(), "comment", "QA delegate D-12"));
        log("D-12", "delegate", d);
        Assert.assertEquals(d.statusCode() / 100, 2, "delegate accepted");
        JsonPath b = ap(adminB(), LEADS, lead);
        log("D-12", "delegate view", b.prettify());
        SoftAssert s = new SoftAssert();
        s.assertTrue(cand.asString().contains(adminB().id()), "adminB is a delegate candidate");
        s.assertTrue(b.getBoolean("data.canApprove"), "delegate canApprove");
        s.assertTrue(b.getList("data.currentApprovers").contains(adminB().id()), "delegate is current approver");
        String raw = b.prettify();
        boolean delegInfo = raw.toLowerCase().contains("delegat");
        s.assertTrue(delegInfo, "delegation info (Delegated to you by …) available to the delegate");
        Assert.assertEquals(api.approve(adminB(), LEADS, lead).statusCode() / 100, 2, "delegate approves");
        s.assertTrue(waitState(LEADS, lead, "approved"), "approved by delegate");
        traceOf("D-12", LEADS, lead);
        s.assertAll();
    }

    @CaseId("D-13")
    @Test(groups = {"crm-order", "group-d"}, description = "Process admin (adminA) takes over: decision recorded as admin override")
    public void d13AdminTakeover() {
        process("D-13", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-13");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        JsonPath a = ap(adminA(), LEADS, lead);
        Assert.assertTrue(a.getBoolean("data.canTakeover"), "process admin canTakeover");
        Response t = post(adminA(), "/workflow/approvals/" + a.getString("data.instanceId") + "/takeover/approve", Map.of("comment", "QA takeover D-13"));
        log("D-13", "takeover", t);
        Assert.assertEquals(t.statusCode() / 100, 2, "takeover approve accepted");
        Assert.assertTrue(waitState(LEADS, lead, "approved"), "approved");
        List<Map<String, Object>> h = ap(adminA(), LEADS, lead).getList("data.history");
        log("D-13", "history", h);
        Map<String, Object> last = h.get(h.size() - 1);
        traceOf("D-13", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(last.get("actorUserId"), adminA().id(), "actor = process admin");
        s.assertEquals(last.get("isProcessAdmin"), Boolean.TRUE, "recorded as admin override");
        s.assertAll();
    }

    @CaseId("D-14")
    @Test(groups = {"crm-order", "group-d"}, description = "Execute On = Create only: a record edited into the criteria is not submitted")
    public void d14CreateOnlyIgnoresEdit() {
        process(LEADS, "D-14", true, false, List.of(supLevel()), null);
        String control = nLead(nm("D-14", "lead"));
        Assert.assertTrue(waitState(LEADS, control, PENDING), "control: matching create is submitted");
        String rec = nLead(nm("X14", "lead"));
        Response e = api.update(userN(), LEADS, rec, Map.of("first_name", nm("D-14", "edited")));
        Assert.assertEquals(e.statusCode() / 100, 2, "edit into criteria");
        CrmUser.sleep(8000);
        traceOf("D-14", LEADS, rec);
        String st = state(LEADS, rec);
        Assert.assertTrue(notSubmitted(st), "not submitted on edit (state " + st + ")");
    }

    @CaseId("D-15")
    @Test(groups = {"crm-order", "group-d"}, description = "Execute On = Edit only: a matching record is not submitted on create")
    public void d15EditOnlyIgnoresCreate() {
        process(LEADS, "D-15", false, true, List.of(supLevel()), null);
        String rec = nLead(nm("D-15", "lead"));
        CrmUser.sleep(8000);
        String afterCreate = state(LEADS, rec);
        Response e = api.update(userN(), LEADS, rec, Map.of("description", "QA edit D-15"));
        Assert.assertEquals(e.statusCode() / 100, 2, "edit");
        boolean controlOk = waitState(LEADS, rec, PENDING);
        traceOf("D-15", LEADS, rec);
        if (!controlOk && notSubmitted(afterCreate)) inconclusive("control (submitted on edit) never happened");
        Assert.assertTrue(notSubmitted(afterCreate), "not submitted on create (state " + afterCreate + ")");
    }

    @CaseId("D-16")
    @Test(groups = {"crm-order", "group-d", "serial"}, description = "Deactivate the process with pending records: pending stays approvable; new matches not submitted")
    public void d16DeactivateWithPending() {
        String p = process("D-16", List.of(CrmProcs.levelSubmitterManager()), null);
        String pending = lead("D-16");
        Assert.assertTrue(waitState(LEADS, pending, PENDING), "control: submitted while active");
        Response off = api.setApprovalActive(p, false);
        log("D-16", "deactivate", off);
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate");
        String after = vRecord(LEADS, nm("D-16", "after"));
        CrmUser.sleep(8000);
        SoftAssert s = new SoftAssert();
        s.assertEquals(state(LEADS, pending), PENDING, "pending stays");
        s.assertTrue(ap(supervisor(), LEADS, pending).getBoolean("data.canApprove"), "still approvable");
        Response a = api.approve(supervisor(), LEADS, pending);
        log("D-16", "approve after deactivate", a);
        s.assertEquals(a.statusCode() / 100, 2, "approve accepted");
        s.assertTrue(waitState(LEADS, pending, "approved"), "approved");
        String st = state(LEADS, after);
        s.assertTrue(notSubmitted(st), "new match not submitted (state " + st + ")");
        traceOf("D-16", LEADS, pending);
        traceOf("D-16", LEADS, after);
        s.assertAll();
    }

    @CaseId("D-17")
    @Test(groups = {"crm-order", "group-d", "serial"}, description = "Delete the process with pending records: records in the process are unaffected (lock state written down)")
    public void d17DeleteWithPending() {
        String p = process("D-17", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-17");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        api.setApprovalActive(p, false);
        Response del = adminA().delete("/workflow/approval-processes/" + p);
        log("D-17", "delete process", del);
        Assert.assertEquals(del.statusCode() / 100, 2, "process with pending records can be deleted, records unaffected (Zoho); TAVI: " + del.asString());
        CrmUser.sleep(5000);
        JsonPath v = ap(supervisor(), LEADS, lead);
        log("D-17", "after delete (approver view)", v.prettify());
        Response e = api.update(userV(), LEADS, lead, Map.of("description", "QA edit D-17"));
        log("D-17", "userV edit after delete", e);
        String status = api.approvalStatus(LEADS, lead);
        log("D-17", "LOCK STATE", "state=" + v.getString("data.state") + " approval_status=" + status + " editByV=" + e.statusCode() + " canApprove=" + v.get("data.canApprove"));
        traceOf("D-17", LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(v.getString("data.state"), PENDING, "record still pending (unaffected)");
        s.assertEquals(status, PENDING, "approval_status unchanged");
        s.assertTrue(blocked(e), "still locked for the submitter");
        s.assertAll();
    }

    @CaseId("D-18")
    @Test(groups = {"crm-order", "group-d"}, description = "Approval Status not editable by a normal user; reset by a profile with 'Can Edit Record Approval Status' (Owner)")
    public void d18ApprovalStatusEditPermission() {
        process("D-18", List.of(CrmProcs.levelSubmitterManager()), r -> r.put("approvedFieldAccess", access("all", List.of(), List.of())));
        String lead = lead("D-18");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        Assert.assertEquals(api.approve(supervisor(), LEADS, lead).statusCode() / 100, 2, "approve");
        Assert.assertTrue(waitState(LEADS, lead, "approved"), "approved");
        SoftAssert s = new SoftAssert();
        // normal user (profile "test"): field edit and status reset both refused
        Response vEdit = api.update(userV(), LEADS, lead, Map.of("approval_status", "not_submitted"));
        log("D-18", "userV PATCH approval_status", vEdit);
        s.assertTrue(blocked(vEdit), "userV can't edit Approval Status: " + vEdit.statusCode());
        s.assertFalse(ap(userV(), LEADS, lead).getBoolean("data.canResetStatus"), "userV canResetStatus false");
        Response vReset = post(userV(), "/workflow/approvals/records/" + LEADS + "/" + lead + "/status-reset", Map.of("reason", "QA D-18 by V"));
        log("D-18", "userV status-reset", vReset);
        s.assertTrue(blocked(vReset), "userV status-reset refused");
        s.assertEquals(api.approvalStatus(LEADS, lead), "approved", "unchanged by userV");
        // Owner profile
        s.assertTrue(ap(owner(), LEADS, lead).getBoolean("data.canResetStatus"), "Owner canResetStatus");
        Response oReset = post(owner(), "/workflow/approvals/records/" + LEADS + "/" + lead + "/status-reset", Map.of("reason", "QA D-18 by Owner"));
        log("D-18", "owner status-reset", oReset);
        s.assertEquals(oReset.statusCode() / 100, 2, "Owner reset accepted");
        String after = api.approvalStatus(LEADS, lead);
        log("D-18", "after owner reset", after);
        s.assertTrue(after == null || "not_submitted".equals(after), "reset to not submitted (" + after + ")");
        traceOf("D-18", LEADS, lead);
        s.assertAll();
    }

    @CaseId("D-19")
    @Test(groups = {"crm-order", "group-d"}, description = "Deals: a matching deal goes to the submitter's manager, locked for the submitter")
    public void d19Deals() {
        sameAsD01(DEALS, "D-19");
    }

    @CaseId("D-20")
    @Test(groups = {"crm-order", "group-d"}, description = "Tasks: a matching task goes to the submitter's manager, locked for the submitter")
    public void d20Tasks() {
        sameAsD01(TASKS, "D-20");
    }

    private void sameAsD01(String module, String tag) {
        process(module, tag, true, true, List.of(CrmProcs.levelSubmitterManager()), null);
        String rec = vRecord(module, nm(tag, CrmApi.moduleKey(module)));
        Assert.assertTrue(waitState(module, rec, PENDING), "pending_approval");
        traceOf(tag, module, rec);
        SoftAssert s = new SoftAssert();
        JsonPath v = ap(adminA(), module, rec);
        s.assertEquals(v.getString("data.processName"), CrmProcs.name(tag + " approval"), "our process");
        s.assertEquals(api.approvalStatus(module, rec), PENDING, "approval_status");
        s.assertEquals(v.getList("data.currentApprovers"), List.of(supervisor().id()), "submitter's manager");
        Response edit = api.update(userV(), module, rec, Map.of("description", "QA edit while pending"));
        log(tag, "userV edit", edit);
        s.assertTrue(blocked(edit), "locked for submitter: " + edit.statusCode());
        List<Map<String, Object>> mine = CrmUser.ok(supervisor().get("/workflow/approvals/me"), "my approvals").jsonPath().getList("data");
        s.assertTrue(mine.stream().anyMatch(m -> rec.equals(m.get("recordId"))), "in supervisor's My Approvals");
        Response a = api.approve(supervisor(), module, rec);
        s.assertEquals(a.statusCode() / 100, 2, "approve");
        s.assertTrue(waitState(module, rec, "approved"), "approved");
        s.assertAll();
    }

    @CaseId("D-21")
    @Test(groups = {"crm-order", "group-d"}, description = "Convert / Delete a pending lead is blocked (userV and admin)")
    public void d21ConvertDeletePendingBlocked() {
        process("D-21", List.of(CrmProcs.levelSubmitterManager()), null);
        String lead = lead("D-21");
        Assert.assertTrue(waitState(LEADS, lead, PENDING), "pending");
        SoftAssert s = new SoftAssert();
        for (CrmUser u : List.of(userV(), adminA())) {
            Response c = post(u, "/modules/" + LEADS + "/records/" + lead + "/convert", Map.of());
            log("D-21", "convert as " + u, c);
            if (c.statusCode() / 100 == 2) removeConverted(c);
            s.assertTrue(blocked(c), "convert blocked for " + u + ": " + c.statusCode());
        }
        for (CrmUser u : List.of(userV(), adminA())) {
            Response d = u.delete("/modules/" + LEADS + "/records/" + lead);
            log("D-21", "delete as " + u, d);
            s.assertTrue(blocked(d), "delete blocked for " + u + ": " + d.statusCode());
            if (d.statusCode() / 100 == 2) break;
        }
        s.assertAll();
    }

    @SuppressWarnings("unchecked")
    private void removeConverted(Response c) {
        try {
            List<Map<String, Object>> t = c.jsonPath().getList("data.targets");
            if (t == null) return;
            for (Map<String, Object> x : t) {
                Object rid = x.get("recordId") != null ? x.get("recordId") : x.get("id");
                if (rid != null && x.get("moduleId") != null && !"skipped".equals(x.get("outcome")))
                    log("D-21", "delete converted " + x.get("moduleId") + "/" + rid, adminA().delete("/modules/" + x.get("moduleId") + "/records/" + rid));
            }
        } catch (Exception e) {
            System.out.println("[D-21] cleanup of converted records: " + e.getMessage());
        }
    }
}
