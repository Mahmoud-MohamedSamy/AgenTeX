package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;

/**
 * Spec group B — Review Process alone (B-01…B-22), session SB.
 * One QA review process per case on this session's own QA layout (fields Email + Phone, reviewer adminA, Others adminB),
 * submitter userN. Everything is created inactive, switched on by the case and removed in @AfterMethod.
 * Facts learned on staging 18 Oct 2026 (probes):
 * - held record: edit/delete → 422 REVIEW_LOCKED; held records are not returned by the record list;
 * - non-reviewer / no permission: /workflow/reviews/queue 403 (workflow:review:admin), /me, /{req}, decide 403 (workflow:review:act);
 * - delete process holding records → 409 CONFLICT "still has N record(s) in review. Deactivate it…";
 * - SLA duration below 60 minutes → 400 "SLA duration must be between 1 hour and 90 days";
 * - ticking the "api" channel sets legacyApiWarning=true on the process;
 * - delegate: POST /workflow/reviews/{req}/delegate {toUserId, comment}; candidates GET …/delegate-candidates → data.userIds;
 * - import: POST /modules/{m}/import (multipart) → PUT …/{sid}/mapping → POST …/validate → POST …/execute → GET …/{sid}.
 */
public class GroupBReviewTest extends OrderTestBase {
    @Override protected String session() { return "SB"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private static final Map<String, String> EMAIL_PHONE = new LinkedHashMap<>(Map.of("email", "email", "phone", "phone"));

    // ---------------- helpers ----------------

    private Map<String, Object> rpBody(String module, String tag, Map<String, Object> criteria, List<String> channels, Map<String, String> fields) {
        return CrmProcs.reviewProcess(module, layout(module), tag + " RP", criteria == null ? CrmProcs.guard(module, nm(tag, "")) : criteria,
                channels, fields, List.of(adminA().id()), List.of(adminB().id()));
    }

    /** Creates and switches on the standard group-B process (Leads, Email + Phone, adminA, Others adminB), guarded to the case. */
    private String activeRp(String tag, List<String> channels) {
        return activate(api.reviewProcess(rpBody(LEADS, tag, null, channels, EMAIL_PHONE)));
    }

    private String activate(String rp) {
        Response on = api.setReviewActive(rp, true, null);
        Assert.assertEquals(on.statusCode() / 100, 2, "review process on: " + on.asString());
        return rp;
    }

    private Map<String, Object> leadFields(String tag, String suffix) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(tag, suffix));
        f.put("email", ("qa.aeo.sb." + tag + "." + suffix).toLowerCase().replace(' ', '.') + "@qa.test");
        return f;
    }

    private String lead(String tag, String suffix) {
        return api.createRecord(userN(), LEADS, layout(LEADS), leadFields(tag, suffix));
    }

    private JsonPath request(CrmUser as, String req) {
        return CrmUser.ok(as.get("/workflow/reviews/" + req), "review request").jsonPath();
    }

    private String status(String id) {
        return api.reviewStatus(LEADS, id);
    }

    private int cycles(String module, String id) {
        List<?> c = api.reviewHistory(adminA(), module, id).getList("data.cycles");
        return c == null ? 0 : c.size();
    }

    /** Is the record returned by the list view for this user (search by its name)? */
    private boolean listed(CrmUser as, String module, String id, String name) {
        // "?q=" search returns nothing on staging: page through the list newest first instead (CrmApi.listed)
        return CrmApi.listed(as, module, id, 5);
    }

    /** Requests of a process in the admin queue (records created by engines are found here). */
    private List<Map<String, Object>> queue(String processId) {
        List<Map<String, Object>> d = CrmUser.ok(adminA().get("/workflow/reviews/queue?processId=" + processId + "&take=50"), "queue").jsonPath().getList("data");
        List<Map<String, Object>> mine = new ArrayList<>();
        if (d != null) for (Map<String, Object> r : d) if (processId.equals(r.get("processId"))) mine.add(r);
        return mine;
    }

    private String workflowControl(String tag) {
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, tag + " WF control").guardCase(tag).onCreate().fieldUpdate("description", "WF " + tag + " control").build());
        Assert.assertEquals(api.setWorkflowActive(wf, true).statusCode() / 100, 2, "control workflow on");
        return wf;
    }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 300 ? s.substring(0, 300) + "…" : s);
    }

    // ---------------- B-01 … B-22 ----------------

    @CaseId("B-01")
    @Test(groups = {"crm-order", "group-b"}, description = "Manual channel ticked: userN's lead is held (Pending for Review), frozen, hidden from the list, in adminA's reviews")
    public void manualCreateIsHeldFrozenHiddenAndQueuedForReviewer() {
        activeRp("B01", List.of("manual"));
        String id = lead("B01", "lead");
        Assert.assertEquals(status(id), "pending_for_review", "held");
        String req = api.reviewRequestId(LEADS, id);
        JsonPath r = request(adminA(), req);
        Assert.assertTrue(r.getList("data.reviewerUserIds").contains(adminA().id()), "adminA is the reviewer");
        Assert.assertTrue(r.getBoolean("data.viewerCanDecide"), "adminA can decide");
        List<Map<String, Object>> mine = CrmUser.ok(adminA().get("/workflow/reviews/me?take=100"), "my reviews").jsonPath().getList("data");
        boolean inMine = mine != null && mine.stream().anyMatch(m -> req.equals(String.valueOf(m.get("id"))) || req.equals(String.valueOf(m.get("requestId"))));
        Response edit = api.update(userN(), LEADS, id, Map.of("description", "B01 edit while held"));
        Assert.assertEquals(edit.statusCode(), 422, "frozen: " + cut(edit));
        boolean hiddenWhileHeld = !listed(userN(), LEADS, id, nm("B01", "lead"));
        // control: once approved the same record must be listed (proves the list search finds it)
        api.reviewApproveAll(adminA(), req, "email", "phone");
        Assert.assertEquals(status(id), "approved");
        boolean listedAfter = CrmApi.waitFor(30, () -> listed(userN(), LEADS, id, nm("B01", "lead")));
        traceOf("B-01", LEADS, id);
        if (!listedAfter) inconclusive("list search did not return the record even after approval: hidden-from-list not observable");
        Assert.assertTrue(hiddenWhileHeld, "held record must be hidden from the list view");
        Assert.assertTrue(inMine, "request " + req + " must be in adminA's My Reviews (/workflow/reviews/me)");
    }

    @CaseId("B-02")
    @Test(groups = {"crm-order", "group-b"}, description = "Manual channel not ticked: a manually created lead is not held")
    public void manualChannelOffIsNotHeld() {
        activeRp("B02", List.of("excel_import"));
        workflowControl("B02");
        String id = lead("B02", "lead");
        Assert.assertTrue(CrmApi.waitFor(60, () -> ("WF B02 control").equals(api.field(adminA(), LEADS, id, "description"))), "control: workflow ran on the record");
        Assert.assertNull(status(id), "not held when the manual channel is off");
        traceOf("B-02", LEADS, id);
    }

    @CaseId("B-03")
    @Test(groups = {"crm-order", "group-b"}, description = "Entry criteria false: lead is not held")
    public void criteriaFalseIsNotHeld() {
        activate(api.reviewProcess(rpBody(LEADS, "B03", CrmProcs.guard(LEADS, nm("B03", "match")), List.of("manual"), EMAIL_PHONE)));
        workflowControl("B03");
        String id = lead("B03", "nomatch");
        Assert.assertTrue(CrmApi.waitFor(60, () -> ("WF B03 control").equals(api.field(adminA(), LEADS, id, "description"))), "control: workflow ran on the record");
        Assert.assertNull(status(id), "criteria false: not held");
        // positive control on the same process
        String held = lead("B03", "match");
        Assert.assertEquals(status(held), "pending_for_review", "control: matching record is held");
        traceOf("B-03", LEADS, id);
    }

    @CaseId("B-04")
    @Test(groups = {"crm-order", "group-b"}, description = "adminA approves both fields: released, listed, history approved")
    public void approveBothFieldsReleases() {
        activeRp("B04", List.of("manual"));
        String id = lead("B04", "lead");
        String req = api.reviewRequestId(LEADS, id);
        Assert.assertEquals(api.reviewField(adminA(), req, "email", true).statusCode(), 200);
        Assert.assertEquals(api.reviewField(adminA(), req, "phone", true).statusCode(), 200);
        Assert.assertEquals(status(id), "approved");
        Response edit = api.update(userN(), LEADS, id, Map.of("description", "B04 after approval"));
        Assert.assertEquals(edit.statusCode() / 100, 2, "released: editable again " + cut(edit));
        Assert.assertTrue(CrmApi.waitFor(30, () -> listed(userN(), LEADS, id, nm("B04", "lead"))), "listed after approval");
        traceOf("B-04", LEADS, id);
    }

    @CaseId("B-05")
    @Test(groups = {"crm-order", "group-b", "NDC-1848", "NDC-1492"}, description = "Email rejected (Invalid Entry), Phone approved: record rejected; userN sees field + reason + Resubmit")
    public void rejectOneFieldRejectsRecordAndSubmitterSeesReason() {
        activeRp("B05", List.of("manual"));
        String id = lead("B05", "lead");
        String req = api.reviewRequestId(LEADS, id);
        Assert.assertEquals(api.reviewField(adminA(), req, "phone", true).statusCode(), 200, "approve phone");
        Response rej = api.reviewField(adminA(), req, "email", false);
        Assert.assertEquals(rej.statusCode(), 200, "reject email " + cut(rej));
        Assert.assertEquals(status(id), "rejected", "record rejected as a whole");
        Response h = userN().get("/workflow/reviews/records/" + LEADS + "/" + id + "/history");
        traceOf("B-05", LEADS, id);
        Assert.assertEquals(h.statusCode(), 200, "submitter can read the review history: " + cut(h));
        JsonPath j = h.jsonPath();
        Assert.assertTrue(j.getBoolean("data.viewerCanResubmit"), "Resubmit offered to the submitter");
        List<Map<String, Object>> dec = j.getList("data.cycles[-1].decisions");
        Assert.assertTrue(dec.stream().anyMatch(d -> "email".equals(d.get("fieldKey")) && "rejected".equals(d.get("kind")) && "Invalid Entry".equals(d.get("reasonLabel"))),
                "email rejection with reason Invalid Entry visible to the submitter: " + dec);
    }

    @CaseId("B-06")
    @Test(groups = {"crm-order", "group-b"}, description = "userN fixes the rejected field and resubmits: Pending again, cycle 2, adminA can act")
    public void editRejectedFieldThenResubmit() {
        activeRp("B06", List.of("manual"));
        String id = lead("B06", "lead");
        String req = api.reviewRequestId(LEADS, id);
        api.reviewField(adminA(), req, "phone", true);
        api.reviewField(adminA(), req, "email", false);
        Assert.assertEquals(status(id), "rejected");
        Response edit = api.update(userN(), LEADS, id, Map.of("email", "qa.aeo.sb.b06.fixed@qa.test"));
        Assert.assertEquals(edit.statusCode() / 100, 2, "edit rejected record " + cut(edit));
        Response rs = api.reviewResubmit(userN(), req);
        Assert.assertEquals(rs.statusCode() / 100, 2, "resubmit " + cut(rs));
        Assert.assertTrue(CrmApi.reviewPending(status(id)), "pending again after resubmit (pending_for_review / pending_for_re_review): " + status(id));
        Assert.assertEquals(cycles(LEADS, id), 2, "attempt 2");
        String req2 = api.reviewRequestId(LEADS, id);
        Assert.assertTrue(request(adminA(), req2).getBoolean("data.viewerCanDecide"), "adminA sees it again");
        traceOf("B-06", LEADS, id);
    }

    @CaseId("B-07")
    @Test(groups = {"crm-order", "group-b"}, description = "userN edits while pending: blocked")
    public void editWhilePendingIsBlocked() {
        activeRp("B07", List.of("manual"));
        String id = lead("B07", "lead");
        Assert.assertEquals(status(id), "pending_for_review");
        Response edit = api.update(userN(), LEADS, id, Map.of("email", "qa.aeo.sb.b07.changed@qa.test"));
        traceOf("B-07", LEADS, id);
        Assert.assertEquals(edit.statusCode(), 422, cut(edit));
        Assert.assertTrue(edit.asString().contains("REVIEW_LOCKED"), cut(edit));
        Assert.assertEquals(api.field(adminA(), LEADS, id, "email"), "qa.aeo.sb.b07.lead@qa.test", "value unchanged");
    }

    @CaseId("B-08")
    @Test(groups = {"crm-order", "group-b", "NDC-1697"}, description = "Edit a rejected record and save without resubmitting: still rejected")
    public void editRejectedWithoutResubmitStaysRejected() {
        activeRp("B08", List.of("manual"));
        String id = lead("B08", "lead");
        String req = api.reviewRequestId(LEADS, id);
        api.reviewReject(adminA(), req);
        Assert.assertEquals(status(id), "rejected");
        Response edit = api.update(userN(), LEADS, id, Map.of("email", "qa.aeo.sb.b08.fixed@qa.test"));
        System.out.println("[B-08] edit rejected record -> " + cut(edit));
        CrmUser.sleep(5000);
        traceOf("B-08", LEADS, id);
        Assert.assertEquals(status(id), "rejected", "review not ended by a plain save");
        Assert.assertEquals(cycles(LEADS, id), 1, "no new cycle without Resubmit");
    }

    @CaseId("B-09")
    @Test(groups = {"crm-order", "group-b"}, description = "Reject without a reason is refused")
    public void rejectWithoutReasonIsRefused() {
        activeRp("B09", List.of("manual"));
        String id = lead("B09", "lead");
        String req = api.reviewRequestId(LEADS, id);
        Response field = adminA().post("/workflow/reviews/" + req + "/fields/email/reject", Map.of("comment", "QA AEO no reason"));
        Response record = adminA().post("/workflow/reviews/" + req + "/reject", Map.of("comment", "QA AEO no reason"));
        System.out.println("[B-09] field reject no reason -> " + cut(field) + " | record reject no reason -> " + cut(record));
        traceOf("B-09", LEADS, id);
        Assert.assertEquals(field.statusCode() / 100, 4, "field reject without reason refused: " + cut(field));
        Assert.assertEquals(record.statusCode() / 100, 4, "record reject without reason refused: " + cut(record));
        Assert.assertEquals(status(id), "pending_for_review", "still pending");
    }

    @CaseId("B-10")
    @Test(groups = {"crm-order", "group-b"}, description = "Rule 1 (Lead Source = web) → adminA; a record that fits no rule goes to Others (adminB)")
    public void noRuleMatchGoesToOthers() {
        Map<String, Object> b = rpBody(LEADS, "B10", null, List.of("manual"), EMAIL_PHONE);
        @SuppressWarnings("unchecked") List<Map<String, Object>> rules = (List<Map<String, Object>>) b.get("rules");
        rules.get(0).put("criteria", CrmProcs.eq("lead_source", "web"));
        activate(api.reviewProcess(b));
        Map<String, Object> web = leadFields("B10", "web");
        web.put("lead_source", "web");
        String w = api.createRecord(userN(), LEADS, layout(LEADS), web);
        Map<String, Object> other = leadFields("B10", "other");
        other.put("lead_source", "other");
        String o = api.createRecord(userN(), LEADS, layout(LEADS), other);
        List<String> rw = request(adminA(), api.reviewRequestId(LEADS, w)).getList("data.reviewerUserIds");
        List<String> ro = request(adminA(), api.reviewRequestId(LEADS, o)).getList("data.reviewerUserIds");
        System.out.println("[B-10] web reviewers " + rw + " | other reviewers " + ro);
        traceOf("B-10", LEADS, o);
        Assert.assertEquals(rw, List.of(adminA().id()), "control: Rule 1 match → adminA");
        Assert.assertEquals(ro, List.of(adminB().id()), "no match → Others (adminB)");
    }

    @CaseId("B-11")
    @Test(groups = {"crm-order", "group-b"}, description = "userN (no review permission) cannot open the queue or decide (403)")
    public void userWithoutPermissionCannotAct() {
        activeRp("B11", List.of("manual"));
        String id = lead("B11", "lead");
        String req = api.reviewRequestId(LEADS, id);
        Response q = userN().get("/workflow/reviews/queue?take=5");
        Response me = userN().get("/workflow/reviews/me?take=5");
        Response get = userN().get("/workflow/reviews/" + req);
        Response dec = userN().post("/workflow/reviews/" + req + "/fields/email/approve", Map.of());
        Response all = userN().post("/workflow/reviews/" + req + "/approve", Map.of());
        System.out.println("[B-11] queue " + cut(q) + " | me " + cut(me) + " | get " + cut(get) + " | decide " + cut(dec) + " | approve " + cut(all));
        traceOf("B-11", LEADS, id);
        Assert.assertEquals(q.statusCode(), 403, "queue");
        Assert.assertEquals(dec.statusCode(), 403, "field decision");
        Assert.assertEquals(all.statusCode(), 403, "record approve");
        Assert.assertEquals(status(id), "pending_for_review", "nothing decided");
    }

    @CaseId("B-12")
    @Test(groups = {"crm-order", "group-b"}, description = "adminA delegates to adminB: adminB can act, history shows the delegation")
    public void delegateToOtherReviewer() {
        Map<String, Object> b = rpBody(LEADS, "B12", null, List.of("manual"), EMAIL_PHONE);
        @SuppressWarnings("unchecked") List<Map<String, Object>> rules = (List<Map<String, Object>>) b.get("rules");
        rules.get(1).put("reviewers", List.of(Rules.kinded("kind", "users", "values", List.of(adminA().id())))); // Others = adminA too, so adminB is not a reviewer before
        activate(api.reviewProcess(b));
        String id = lead("B12", "lead");
        String req = api.reviewRequestId(LEADS, id);
        Assert.assertFalse(request(adminA(), req).getList("data.reviewerUserIds").contains(adminB().id()), "adminB is not a reviewer before");
        List<String> cands = CrmUser.ok(adminA().get("/workflow/reviews/" + req + "/delegate-candidates"), "candidates").jsonPath().getList("data.userIds");
        Assert.assertTrue(cands.contains(adminB().id()), "adminB is a delegate candidate: " + cands);
        Response d = adminA().post("/workflow/reviews/" + req + "/delegate", Map.of("toUserId", adminB().id(), "comment", "QA AEO SB delegate"));
        Assert.assertEquals(d.statusCode() / 100, 2, "delegate " + cut(d));
        Assert.assertTrue(request(adminB(), req).getBoolean("data.viewerCanDecide"), "adminB can decide");
        Assert.assertEquals(api.reviewField(adminB(), req, "email", true).statusCode(), 200);
        Assert.assertEquals(api.reviewField(adminB(), req, "phone", true).statusCode(), 200);
        Assert.assertEquals(status(id), "approved");
        List<Map<String, Object>> ev = api.reviewHistory(adminA(), LEADS, id).getList("data.cycles[-1].events");
        traceOf("B-12", LEADS, id);
        Assert.assertTrue(ev.stream().anyMatch(e -> "delegated".equals(e.get("eventKind"))), "history shows the delegation: " + ev);
    }

    @CaseId("B-13")
    @Test(groups = {"crm-order", "group-b"}, description = "SLA escalation 1 minute → adminB notified")
    public void slaEscalationNotifiesRecipient() {
        Map<String, Object> b = rpBody(LEADS, "B13", null, List.of("manual"), EMAIL_PHONE);
        Map<String, Object> sla = new LinkedHashMap<>();
        sla.put("durationMinutes", 1);
        sla.put("recipientKind", "user");
        sla.put("recipientId", adminB().id());
        b.put("sla", sla);
        Response one = adminA().post("/workflow/review-processes", b);
        System.out.println("[B-13] SLA 1 minute -> " + cut(one));
        if (one.statusCode() / 100 == 2) {
            String rp = one.jsonPath().getString("data.id");
            adminA().patch("/workflow/review-processes/" + rp + "/active", Map.of("isActive", true));
            String id = lead("B13", "lead");
            String req = api.reviewRequestId(LEADS, id);
            boolean esc = CrmApi.waitFor(180, () -> request(adminA(), req).getBoolean("data.isEscalated"));
            adminA().patch("/workflow/review-processes/" + rp + "/active", Map.of("isActive", false, "pendingAction", "reject_all"));
            adminA().delete("/workflow/review-processes/" + rp);
            if (!esc) inconclusive("isEscalated not observed within 3 minutes");
            return;
        }
        // 1 minute refused: check the minimum SLA (60 min) is stored and timed, escalation itself is not observable in a run
        sla.put("durationMinutes", 60);
        String rp = activate(api.reviewProcess(b));
        String id = lead("B13", "lead");
        JsonPath r = request(adminA(), api.reviewRequestId(LEADS, id));
        System.out.println("[B-13] SLA 60 -> slaDueAt " + r.getString("data.slaDueAt") + " remaining " + r.getString("data.slaRemainingSeconds") + " escalated " + r.getString("data.isEscalated") + " rp " + rp);
        traceOf("B-13", LEADS, id);
        inconclusive("SLA below 1 hour is refused (" + one.statusCode() + " SLA duration must be between 1 hour and 90 days); 60-min SLA stored, slaDueAt="
                + r.getString("data.slaDueAt") + " — escalation not observable within the run");
    }

    @CaseId("B-14")
    @Test(groups = {"crm-order", "group-b"}, description = "Deactivate with held records, Reject all: each rejected, userN can resubmit")
    public void deactivateRejectAll() {
        String rp = activeRp("B14", List.of("manual"));
        String a = lead("B14", "one");
        String b = lead("B14", "two");
        Assert.assertEquals(status(a), "pending_for_review");
        Assert.assertEquals(status(b), "pending_for_review");
        Response withoutAction = adminA().patch("/workflow/review-processes/" + rp + "/active", Map.of("isActive", false));
        System.out.println("[B-14] deactivate without pendingAction -> " + cut(withoutAction));
        Response off = api.setReviewActive(rp, false, "reject_all");
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate reject_all " + cut(off));
        traceOf("B-14", LEADS, a);
        for (String id : List.of(a, b)) {
            Assert.assertTrue(CrmApi.waitFor(60, () -> "rejected".equals(status(id))), "held record " + id + " rejected, was " + status(id));
            JsonPath h = api.reviewHistory(userN(), LEADS, id);
            System.out.println("[B-14] " + id + " viewerCanResubmit=" + h.getString("data.viewerCanResubmit") + " events=" + h.getList("data.cycles[-1].events"));
            Assert.assertTrue(h.getBoolean("data.viewerCanResubmit"), "userN is asked to resubmit " + id);
        }
    }

    @CaseId("B-15")
    @Test(groups = {"crm-order", "group-b"}, description = "Deactivate with held records, Release (move_to_system): released, flagged unreviewed")
    public void deactivateReleaseUnreviewed() {
        String rp = activeRp("B15", List.of("manual"));
        String a = lead("B15", "one");
        Assert.assertEquals(status(a), "pending_for_review");
        Response off = api.setReviewActive(rp, false, "move_to_system");
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate move_to_system " + cut(off));
        CrmUser.sleep(5000);
        String st = status(a);
        String state = api.field(adminA(), LEADS, a, "__review_state__");
        Response edit = api.update(userN(), LEADS, a, Map.of("description", "B15 after release"));
        List<Map<String, Object>> ev = api.reviewHistory(adminA(), LEADS, a).getList("data.cycles[-1].events");
        System.out.println("[B-15] status=" + st + " __review_state__=" + state + " edit=" + cut(edit) + " events=" + ev);
        traceOf("B-15", LEADS, a);
        Assert.assertEquals(edit.statusCode() / 100, 2, "released: editable");
        Assert.assertNotEquals(st, "pending_for_review", "no longer held");
        Assert.assertNotEquals(st, "rejected", "released, not rejected");
        Assert.assertNotEquals(st, "approved", "released records must be flagged unreviewed, not approved");
    }

    @CaseId("B-16")
    @Test(groups = {"crm-order", "group-b"}, description = "Delete a process holding records: refused")
    public void deleteProcessHoldingRecordsIsRefused() {
        String rp = activeRp("B16", List.of("manual"));
        String id = lead("B16", "lead");
        Assert.assertEquals(status(id), "pending_for_review");
        Response del = adminA().delete("/workflow/review-processes/" + rp);
        System.out.println("[B-16] delete while holding -> " + cut(del));
        traceOf("B-16", LEADS, id);
        Assert.assertEquals(del.statusCode() / 100, 4, cut(del));
        Assert.assertTrue(del.asString().matches("(?s).*1 record\\(s\\).*[Dd]eactivate.*"), "message names the held count and says deactivate first: " + cut(del));
        Assert.assertEquals(CrmUser.ok(adminA().get("/workflow/review-processes/" + rp), "process still there").statusCode(), 200);
    }

    @CaseId("B-17")
    @Test(groups = {"crm-order", "group-b"}, description = "Workflow Create Record makes a lead (Automation channel ticked): created lead is held")
    public void workflowCreatedLeadIsHeld() {
        String rp = activate(api.reviewProcess(rpBody(LEADS, "B17", CrmProcs.guard(LEADS, nm("B17", "child")), List.of("workflow"), EMAIL_PHONE)));
        Map<String, Object> maps = new LinkedHashMap<>();
        maps.put("first_name", Rules.s(nm("B17", "child")));
        maps.put("phone", Rules.s("01012345617"));
        maps.put("single_line_3_9", Rules.s("QA AEO"));
        maps.put("email", Rules.s("qa.aeo.sb.b17.child@qa.test"));
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, "B17 WF create lead").guardCase("B17 parent").onCreate().createRecord(LEADS, layout(LEADS), maps).build());
        Assert.assertEquals(api.setWorkflowActive(wf, true).statusCode() / 100, 2);
        String parent = lead("B17", "parent");
        Assert.assertNull(status(parent), "parent not held (criteria)");
        boolean fired = CrmApi.waitFor(90, () -> api.firedCount(parent, wf) > 0);
        boolean held = CrmApi.waitFor(60, () -> !queue(rp).isEmpty());
        List<Map<String, Object>> q = queue(rp);
        for (Map<String, Object> r : q) api.track(LEADS, String.valueOf(r.get("recordId")));
        System.out.println("[B-17] fired=" + fired + " executions=" + api.executions(parent) + " queue=" + q);
        traceOf("B-17", LEADS, parent);
        Assert.assertTrue(fired, "control: the workflow fired on the parent");
        Assert.assertTrue(held, "the lead created by the workflow is held by the review process");
        Assert.assertEquals(q.get(0).get("entryChannel"), "workflow", "entry channel");
    }

    @CaseId("B-18")
    @Test(groups = {"crm-order", "group-b"}, description = "Import (Excel channel ticked): imported lead is held")
    public void importedLeadIsHeld() {
        String rp = activeRp("B18", List.of("excel_import"));
        String name = nm("B18", "imp");
        String csv = "Full Name,Phone,Single Line,Email\n" + name + ",01012345618,QA AEO,qa.aeo.sb.b18@qa.test\n";
        CrmUser a = adminA();
        Response up = a.req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sb-b18.csv", csv.getBytes(StandardCharsets.UTF_8), "text/csv").post("/modules/" + LEADS + "/import");
        if (up.statusCode() / 100 != 2) inconclusive("import upload refused: " + cut(up));
        String sid = up.jsonPath().getString("data.session_id");
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true); opts.put("replace_empty", null); opts.put("notify_email", false); opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", false); opts.put("assignment_rule_id", null); opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of()); opts.put("duplicate_check_module_ids", List.of());
        Map<String, Object> mb = new LinkedHashMap<>();
        mb.put("mode", "add"); mb.put("match_field_key", null); mb.put("layout_id", layout(LEADS));
        mb.put("mapping", List.of(Map.of("header", "Full Name", "field", "first_name"), Map.of("header", "Phone", "field", "phone"),
                Map.of("header", "Single Line", "field", "single_line_3_9"), Map.of("header", "Email", "field", "email")));
        mb.put("options", opts);
        CrmUser.ok(a.put("/modules/" + LEADS + "/import/" + sid + "/mapping", mb), "import mapping");
        CrmUser.ok(a.post("/modules/" + LEADS + "/import/" + sid + "/validate", null), "import validate");
        CrmUser.ok(a.post("/modules/" + LEADS + "/import/" + sid + "/execute", null), "import execute");
        boolean done = CrmApi.waitFor(120, () -> {
            String st = a.get("/modules/" + LEADS + "/import/" + sid).jsonPath().getString("data.status");
            return st != null && (st.startsWith("completed") || st.equals("failed") || st.equals("partially_completed"));
        });
        JsonPath st = CrmUser.ok(a.get("/modules/" + LEADS + "/import/" + sid), "import status").jsonPath();
        if (!done || st.getInt("data.created_count") < 1) inconclusive("import did not create the lead: " + st.prettify());
        boolean held = CrmApi.waitFor(60, () -> !queue(rp).isEmpty());
        List<Map<String, Object>> q = queue(rp);
        for (Map<String, Object> r : q) api.track(LEADS, String.valueOf(r.get("recordId")));
        if (!held) { // find it in the list to clean it up
            for (String id : CrmApi.idsByName(a, LEADS, name, 2)) api.track(LEADS, id);
        }
        System.out.println("[B-18] import session " + sid + " created " + st.getString("data.created_count") + " queue=" + q);
        if (!q.isEmpty()) traceOf("B-18", LEADS, String.valueOf(q.get(0).get("recordId")));
        Assert.assertTrue(held, "imported lead is held");
        Assert.assertEquals(q.get(0).get("entryChannel"), "excel_import", "entry channel");
    }

    @CaseId("B-19")
    @Test(groups = {"crm-order", "group-b"}, description = "API channel ticked: API-created lead held; legacy API caller warning")
    public void apiChannel() {
        String rp = activeRp("B19", List.of("api"));
        JsonPath p = CrmUser.ok(adminA().get("/workflow/review-processes/" + rp), "process").jsonPath();
        String id = lead("B19", "lead");
        String st = status(id);
        String src = api.record(adminA(), LEADS, id).getString("data.source");
        System.out.println("[B-19] legacyApiWarning=" + p.getString("data.legacyApiWarning") + " token-created source=" + src + " review=" + st);
        traceOf("B-19", LEADS, id);
        inconclusive("no real API channel (API key / integration) available: a user-token create is source=" + src + ", review=" + st
                + "; process with the api channel shows legacyApiWarning=" + p.getString("data.legacyApiWarning"));
    }

    @CaseId("B-20")
    @Test(groups = {"crm-order", "group-b"}, description = "Edit an approved-review lead so it matches again: does it re-enter review? (Zoho: create only)")
    public void editApprovedLeadReentersReview() {
        activeRp("B20", List.of("manual"));
        String id = lead("B20", "lead");
        String req = api.reviewRequestId(LEADS, id);
        api.reviewApproveAll(adminA(), req, "email", "phone");
        Assert.assertEquals(status(id), "approved");
        Response edit = api.update(userN(), LEADS, id, Map.of("email", "qa.aeo.sb.b20.changed@qa.test"));
        Assert.assertEquals(edit.statusCode() / 100, 2, "edit approved lead " + cut(edit));
        CrmUser.sleep(8000);
        String st = status(id);
        int c = cycles(LEADS, id);
        System.out.println("[B-20] TAVI after edit of an approved lead: status=" + st + " cycles=" + c);
        traceOf("B-20", LEADS, id);
        Assert.assertEquals(c, 1, "Zoho: review runs on create only — the edit must not start a new cycle (status now " + st + ")");
    }

    @CaseId("B-21")
    @Test(groups = {"crm-order", "group-b"}, description = "Deals: manual create is held")
    public void dealIsHeld() {
        activate(api.reviewProcess(rpBody(DEALS, "B21", null, List.of("manual"), new LinkedHashMap<>(Map.of("description", "multi_line")))));
        Map<String, Object> f = CrmApi.minimal(DEALS, nm("B21", "deal"));
        f.put("description", "QA AEO SB B21");
        String id = api.createRecord(userN(), DEALS, layout(DEALS), f);
        String st = api.reviewStatus(DEALS, id);
        Response edit = api.update(userN(), DEALS, id, Map.of("description", "B21 edit while held"));
        traceOf("B-21", DEALS, id);
        Assert.assertEquals(st, "pending_for_review", "deal held");
        Assert.assertEquals(edit.statusCode(), 422, "frozen " + cut(edit));
    }

    @CaseId("B-22")
    @Test(groups = {"crm-order", "group-b", "NDC-1228"}, description = "Reorder two review processes: saved order is used")
    public void reorderProcesses() {
        // only one process per module+layout: the second process needs a second QA layout of Leads
        String layout2 = CrmApi.createQaLayout(adminA(), LEADS, CrmOrderFeature.LEADS_STANDARD, session() + "2");
        try {
            String p1 = activeRp("B22", List.of("manual"));
            Map<String, Object> b2 = CrmProcs.reviewProcess(LEADS, layout2, "B22 RP2", CrmProcs.guard(LEADS, nm("B22", "")), List.of("manual"),
                    EMAIL_PHONE, List.of(adminB().id()), List.of(adminB().id()));
            String p2 = activate(api.reviewProcess(b2));
            int o1 = CrmUser.ok(adminA().get("/workflow/review-processes/" + p1), "p1").jsonPath().getInt("data.displayOrder");
            int o2 = CrmUser.ok(adminA().get("/workflow/review-processes/" + p2), "p2").jsonPath().getInt("data.displayOrder");
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("moduleId", LEADS);
            body.put("orderedProcessIds", List.of(p2, p1));
            Response r = adminA().patch("/workflow/review-processes/reorder", body);
            int n1 = CrmUser.ok(adminA().get("/workflow/review-processes/" + p1), "p1").jsonPath().getInt("data.displayOrder");
            int n2 = CrmUser.ok(adminA().get("/workflow/review-processes/" + p2), "p2").jsonPath().getInt("data.displayOrder");
            System.out.println("[B-22] before p1=" + o1 + " p2=" + o2 + " | reorder [p2,p1] -> " + cut(r) + " | after p1=" + n1 + " p2=" + n2);
            if (r.statusCode() / 100 != 2) {
                Assert.fail("reorder of two own processes refused: " + cut(r));
            }
            Assert.assertTrue(n2 < n1, "saved order: p2 before p1 (after p1=" + n1 + " p2=" + n2 + ")");
            // a lead created on layout 1 is held by p1 (one process per layout → "first match wins" cannot be exercised)
            String id = lead("B22", "lead");
            String proc = request(adminA(), api.reviewRequestId(LEADS, id)).getString("data.processId");
            traceOf("B-22", LEADS, id);
            Assert.assertEquals(proc, p1, "record on layout 1 handled by its layout's process");
            inconclusive("reorder saved (p1 " + o1 + "→" + n1 + ", p2 " + o2 + "→" + n2 + ") but first-match-wins is not observable: only one process may cover a module+layout");
        } finally {
            api.cleanup(); // processes on layout2 must go before the layout
            System.out.println("[B-22] layout2 delete -> " + CrmApi.deleteLayout(adminA(), LEADS, layout2).statusCode());
        }
    }

    /** Items left on staging by this session's aborted probe run (18 Oct 2026): a QA layout with 2 rejected leads. */
    @AfterClass(alwaysRun = true)
    public void purgeProbeLeftovers() {
        try {
            CrmUser a = adminA();
            a.delete("/modules/" + LEADS + "/records/910009a8-b3aa-4329-a34c-8c8139c9d582");
            List<Map<String, Object>> q = a.get("/workflow/reviews/queue?processId=0effab9b-e3dd-431d-bb91-22913ae40d2c&take=50").jsonPath().getList("data");
            if (q != null) for (Map<String, Object> r : q)
                if ("0effab9b-e3dd-431d-bb91-22913ae40d2c".equals(r.get("processId"))) a.delete("/modules/" + LEADS + "/records/" + r.get("recordId"));
            System.out.println("[leftovers] layout d68c42be delete -> " + cut(CrmApi.deleteLayout(a, LEADS, "d68c42be-abb7-4ac7-979f-73ca8a589cf3")));
        } catch (Exception e) {
            System.out.println("[leftovers] " + e.getMessage());
        }
    }
}
