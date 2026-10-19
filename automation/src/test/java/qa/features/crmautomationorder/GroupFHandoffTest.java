package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmProcs.and;
import static qa.features.crmautomationorder.CrmProcs.eq;
import static qa.features.crmautomationorder.CrmProcs.guard;
import static qa.features.crmautomationorder.CrmUser.ok;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Spec group F: handoffs between two processes at a time (Assignment, Review, Workflow, Approval, Blueprint).
 * Session SF. Each case switches on exactly the two QA processes it names, guarded to the case ("QA AEO SF F-xx").
 * The workflow "marker" is a field update description = "WF F-xx".
 * Assignment cases (F-01..F-04, F-22) use the data-import API (POST /modules/{m}/import → mapping → validate → execute)
 * with options.assignment_rule_id, because API/UI-created records are "manual" and do not run assignment rules.
 */
public class GroupFHandoffTest extends OrderTestBase {
    @Override protected String session() { return "SF"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    /** Seconds to watch for something that must NOT happen. */
    private static final int HOLD = 30;
    /** Seconds to wait for an asynchronous result that must happen. */
    private static final int WAIT = 90;

    private final List<String[]> extraRecords = new ArrayList<>();

    @AfterMethod(alwaysRun = true)
    public void dropExtraRecords() {
        for (String[] r : extraRecords) {
            try {
                System.out.println("[SF] delete extra " + r[1] + " -> " + api.deleteRecord(r[0], r[1]).statusCode());
            } catch (Exception e) {
                System.out.println("[SF] delete extra failed " + e.getMessage());
            }
        }
        extraRecords.clear();
    }

    // ---------------------------------------------------------------- helpers

    private static void on(Response r, String what) {
        Assert.assertEquals(r.statusCode() / 100, 2, what + " switched on: " + r.statusCode() + " " + r.asString());
    }

    private static void note(String c, String msg) {
        System.out.println("[SF " + c + "] " + msg);
    }

    private String marker(String c) {
        return "WF " + c;
    }

    private String desc(String module, String id) {
        return api.field(adminA(), module, id, "description");
    }

    private boolean hasMarker(String module, String id, String c) {
        return marker(c).equals(desc(module, id));
    }

    private Map<String, Object> leadFields(String c, String suffix) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(c, suffix));
        f.put("email", "qa.aeo.sf." + c.toLowerCase().replace("-", "") + "." + suffix.replace(" ", "") + "@qa.test");
        return f;
    }

    private Map<String, Object> dealFields(String c, String suffix) {
        return CrmApi.minimal(DEALS, nm(c, suffix));
    }

    private Map<String, Object> caseGuard(String module, String c) {
        return guard(module, nm(c, ""));
    }

    /** Review process on this session's Leads QA layout reviewing Email, reviewer adminA. */
    private String reviewLeads(String c, List<String> channels, List<Map<String, Object>> reviewers) {
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), channels,
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        if (reviewers != null) setRule1Reviewers(body, reviewers);
        String id = api.reviewProcess(body);
        on(api.setReviewActive(id, true, null), "RP " + c);
        return id;
    }

    /** Review process on this session's Deals QA layout reviewing Next Step, reviewer adminA. */
    private String reviewDeals(String c) {
        String id = api.reviewProcess(CrmProcs.reviewProcess(DEALS, layout(DEALS), c + " RP", caseGuard(DEALS, c), List.of("manual"),
                Map.of("next_step", "single_line"), List.of(adminA().id()), List.of(adminA().id())));
        on(api.setReviewActive(id, true, null), "RP " + c);
        return id;
    }

    @SuppressWarnings("unchecked")
    private static void setRule1Reviewers(Map<String, Object> body, List<Map<String, Object>> reviewers) {
        List<Map<String, Object>> rules = (List<Map<String, Object>>) body.get("rules");
        Map<String, Object> r1 = new LinkedHashMap<>(rules.get(0));
        r1.put("reviewers", reviewers);
        rules.set(0, r1);
    }

    /** Marker workflow (description = "WF <case>") narrowed to the case. */
    private String markerWf(String module, String c, String trigger) {
        CrmProcs.Wf w = CrmProcs.workflow(module, c + " WF").guardCase(c);
        if ("edit".equals(trigger)) w.onCreateOrEdit(); else w.onCreate();
        String id = api.workflowRule(w.fieldUpdate("description", marker(c)).build());
        on(api.setWorkflowActive(id, true), "WF " + c);
        return id;
    }

    private String approval(String module, String c, boolean onCreate, boolean onEdit, Map<String, Object> criteria, Map<String, Object> level) {
        String id = api.approvalProcess(CrmProcs.approvalProcess(module, c + " appr", onCreate, onEdit, criteria,
                List.of(level == null ? CrmProcs.levelUsers(adminB().id()) : level), List.of(adminA().id())));
        on(api.setApprovalActive(id, true), "approval " + c);
        return id;
    }

    private String blueprint(String c, Map<String, Object> entry, Map<String, Object> firstBefore) {
        Map<String, Object> body = CrmProcs.blueprint("deals", layout(DEALS), CrmApi.pipelineOf(layout(DEALS)), "stage", c + " BP",
                entry, List.of("qualification", "proposal"), null);
        if (firstBefore != null) setFirstBefore(body, firstBefore);
        String id = api.blueprint(DEALS, body);
        on(api.setBlueprintActive(DEALS, id, true), "BP " + c);
        return id;
    }

    @SuppressWarnings("unchecked")
    private static void setFirstBefore(Map<String, Object> body, Map<String, Object> before) {
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        List<Map<String, Object>> tr = (List<Map<String, Object>>) def.get("transitions");
        Map<String, Object> t0 = new LinkedHashMap<>(tr.get(0));
        t0.put("before", before);
        tr.set(0, t0);
    }

    private String waitReview(String module, String id) {
        CrmApi.waitFor(WAIT, () -> api.reviewStatus(module, id) != null);
        return api.reviewStatus(module, id);
    }

    private void approveReview(String module, String id, String field) {
        String req = api.reviewRequestId(module, id);
        Response r = api.reviewField(adminA(), req, field, true);
        Assert.assertEquals(r.statusCode() / 100, 2, "review approve " + field + ": " + r.asString());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.reviewStatus(module, id))), "review approved");
    }

    private void rejectReview(String module, String id, String field) {
        String req = api.reviewRequestId(module, id);
        Response r = api.reviewField(adminA(), req, field, false);
        Assert.assertEquals(r.statusCode() / 100, 2, "review reject " + field + ": " + r.asString());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "rejected".equals(api.reviewStatus(module, id))), "review rejected");
    }

    private void resubmitReview(String module, String id) {
        String req = api.reviewRequestId(module, id);
        Response r = api.reviewResubmit(userN(), req);
        Assert.assertEquals(r.statusCode() / 100, 2, "resubmit: " + r.asString());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> {
            String s = api.reviewStatus(module, id);
            return CrmApi.reviewPending(s);
        }), "resubmitted review pending (status " + api.reviewStatus(module, id) + ")");
    }

    private boolean pendingApproval(String module, String id) {
        return "pending_approval".equals(api.approvalState(module, id));
    }

    private String owner(String module, String id) {
        return api.field(adminA(), module, id, "owner");
    }

    // ---------------------------------------------------------------- import channel (assignment rules)

    /**
     * Imports one row through the data-import API (as {@code as}), with the given assignment rule, and returns the new
     * record id (registered for deletion). Headers are field api names.
     */
    private String importRow(CrmUser as, String module, Map<String, String> row, String assignmentRuleId, String nameValue) {
        try {
            StringBuilder csv = new StringBuilder(String.join(",", row.keySet())).append("\n");
            List<String> vals = new ArrayList<>();
            for (String v : row.values()) vals.add("\"" + v.replace("\"", "\"\"") + "\"");
            csv.append(String.join(",", vals)).append("\n");
            File f = File.createTempFile("qa-aeo-sf-", ".csv");
            Files.writeString(f.toPath(), csv.toString(), StandardCharsets.UTF_8);
            f.deleteOnExit();
            Response up = as.req().contentType("multipart/form-data").multiPart("file", f, "text/csv").post("/modules/" + module + "/import");
            ok(up, "import upload");
            String sid = up.jsonPath().getString("data.session_id");
            System.out.println("[SF import] upload " + up.statusCode() + " session " + sid + " suggested " + up.jsonPath().getString("data.suggested_mapping"));
            List<Map<String, Object>> mapping = new ArrayList<>();
            for (String h : row.keySet()) mapping.add(kinded("header", h, "field", h));
            Map<String, Object> options = new LinkedHashMap<>();
            options.put("skip_empty", true);
            options.put("replace_empty", null);
            options.put("notify_email", false);
            options.put("assign_to_user_id", null);
            options.put("trigger_automation", true);
            options.put("assignment_rule_id", assignmentRuleId);
            options.put("manual_approval", false);
            options.put("default_tag_ids", List.of());
            options.put("duplicate_check_module_ids", List.of());
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("mode", "add");
            body.put("match_field_key", null);
            body.put("layout_id", layout(module));
            body.put("mapping", mapping);
            body.put("options", options);
            Response m = as.put("/modules/" + module + "/import/" + sid + "/mapping", body);
            System.out.println("[SF import] mapping " + m.statusCode() + " " + trim(m.asString()));
            ok(m, "import mapping");
            Response v = as.post("/modules/" + module + "/import/" + sid + "/validate", null);
            System.out.println("[SF import] validate " + v.statusCode() + " " + trim(v.asString()));
            ok(v, "import validate");
            Response x = as.post("/modules/" + module + "/import/" + sid + "/execute", null);
            System.out.println("[SF import] execute " + x.statusCode() + " " + trim(x.asString()));
            ok(x, "import execute");
            String[] status = {null};
            CrmApi.waitFor(WAIT, () -> {
                Response s = as.get("/modules/" + module + "/import/" + sid);
                status[0] = s.asString();
                String st = s.jsonPath().getString("data.status");
                return "completed".equals(st) || "partially_completed".equals(st) || "failed".equals(st);
            });
            System.out.println("[SF import] status " + trim(status[0]));
            String id = api.importedRecordId(sid, module, nameValue, WAIT); // executions carry correlationId = import session
            if (id != null) extraRecords.add(new String[]{module, id});
            return id;
        } catch (java.io.IOException e) {
            throw new IllegalStateException(e);
        }
    }

    private static String trim(String s) {
        return s == null ? null : s.length() > 600 ? s.substring(0, 600) + "…" : s;
    }


    /** Name-field value of a list row (data[] of {field, value:{kind,value}}). */
    private static String nameOf(Map<String, Object> row, String module) {
        Object d = row.get("data");
        if (!(d instanceof List<?> l)) return null;
        for (Object o : l)
            if (o instanceof Map<?, ?> f && CrmProcs.nameField(module).equals(f.get("field")) && f.get("value") instanceof Map<?, ?> v)
                return v.get("value") == null ? null : String.valueOf(v.get("value"));
        return null;
    }

    /**
     * Finds a record by exact name. "?q=" search returned nothing on 18 Oct 2026 (also for existing records), so this
     * pages through the list (newest first when the server honours the sort) and matches the name field exactly.
     */
    private String findByName(String module, String name) {
        // the list is oldest first and ignores sort / page_size / q: CrmApi scans the newest pages, then the review queue
        return api.findRecord(module, name, WAIT);
    }

    private Map<String, String> leadRow(String c, String suffix) {
        Map<String, String> row = new LinkedHashMap<>();
        leadFields(c, suffix).forEach((k, v) -> row.put(k, String.valueOf(v)));
        return row;
    }

    private Map<String, String> dealRow(String c, String suffix) {
        Map<String, String> row = new LinkedHashMap<>();
        dealFields(c, suffix).forEach((k, v) -> row.put(k, String.valueOf(v)));
        return row;
    }

    private String assignmentRule(String module, String c, String userId) {
        String id = api.assignmentRule(CrmProcs.assignmentRule(module, c + " AR", List.of("Import", "WebForm", "Api"), caseGuard(module, c),
                List.of(userId), "LeaveUnassigned", null));
        on(api.setAssignmentRuleActive(id, true), "AR " + c);
        return id;
    }

    /** Imports one lead/deal as adminA with the case's assignment rule; INCONCLUSIVE when the channel cannot be used. */
    private String importAssigned(String module, String c, String suffix, String arId) {
        String id = null;
        try {
            id = importRow(adminA(), module, LEADS.equals(module) ? leadRow(c, suffix) : dealRow(c, suffix), arId, nm(c, suffix));
        } catch (IllegalStateException e) {
            inconclusive("import channel failed: " + e.getMessage());
        }
        if (id == null) inconclusive("import reported success but the imported record '" + nm(c, suffix) + "' could not be found in the list");
        return id;
    }

    /** Owner must be the user the assignment rule picked (otherwise the handoff cannot be judged). */
    private void assertAssigned(String c, String module, String id, CrmUser expected) {
        boolean assigned = CrmApi.waitFor(WAIT, () -> expected.id().equals(owner(module, id)));
        note(c, "owner after import " + owner(module, id) + " expected " + expected.id() + " executions " + api.executions(id));
        if (!assigned) inconclusive("assignment rule did not set the owner on import (owner " + owner(module, id) + ") - cannot judge the handoff");
    }

    // ================================================================ F-01 … F-04  Assignment → next stage

    @CaseId("F-01")
    @Test(groups = {"crm-order", "group-f"}, description = "AR → RP: owner is set before review, so a 'record owner' reviewer is the assigned owner")
    public void f01AssignmentBeforeReviewRecordOwnerReviewer() {
        String c = "F-01";
        String ar = assignmentRule(LEADS, c, adminB().id());
        reviewLeads(c, List.of("excel_import", "manual"), List.of(kinded("kind", "record_owner", "values", List.of())));
        String id = importAssigned(LEADS, c, "imp", ar);
        assertAssigned(c, LEADS, id, adminB());
        Assert.assertNotNull(waitReview(LEADS, id), "imported lead entered review");
        JsonPath req = ok(adminA().get("/workflow/reviews/" + api.reviewRequestId(LEADS, id)), "review request").jsonPath();
        note(c, "review request " + trim(req.prettify()));
        traceOf(c, LEADS, id);
        List<Object> reviewers = req.getList("data.reviewerUserIds");
        Assert.assertNotNull(reviewers, "review request lists its reviewers");
        Assert.assertTrue(reviewers.contains(adminB().id()), "record-owner reviewer = assigned owner (adminB) " + adminB().id() + "; reviewers " + reviewers);
        Assert.assertFalse(reviewers.contains(adminA().id()), "importer (adminA) must not be the record-owner reviewer; reviewers " + reviewers);
    }

    @CaseId("F-02")
    @Test(groups = {"crm-order", "group-f"}, description = "AR → WF: workflow with criteria Owner = assigned user sees the assigned owner and fires")
    public void f02AssignmentBeforeWorkflowOwnerCriteria() {
        String c = "F-02";
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate()
                .where(Rules.equalsTo("owner", Rules.s(adminB().id()))).fieldUpdate("description", marker(c)).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        // control first: a lead created (manually) by adminB is owned by adminB → the owner criterion must match
        String ctl = api.createRecord(adminB(), LEADS, layout(LEADS), leadFields(c, "ctl"));
        if (!CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, ctl, c)))
            inconclusive("control: Owner = adminB criterion never matched a lead owned by adminB (owner " + owner(LEADS, ctl) + ")");
        String ar = assignmentRule(LEADS, c, adminB().id());
        String id = importAssigned(LEADS, c, "imp", ar);
        assertAssigned(c, LEADS, id, adminB());
        boolean fired = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        traceOf(c, LEADS, id);
        Assert.assertTrue(fired, "workflow (Owner = assigned user) fired on the imported lead; description " + desc(LEADS, id) + ", fired " + api.firedCount(id, wf));
    }

    @CaseId("F-03")
    @Test(groups = {"crm-order", "group-f"}, description = "AR → AP: approver 'record owner' is the assigned owner, not the importer")
    public void f03AssignmentBeforeApprovalRecordOwnerApprover() {
        String c = "F-03";
        String ar = assignmentRule(LEADS, c, adminB().id());
        approval(LEADS, c, true, false, caseGuard(LEADS, c), CrmProcs.level(kinded("kind", "record_owner", "values", List.of()), false));
        String id = importAssigned(LEADS, c, "imp", ar);
        assertAssigned(c, LEADS, id, adminB());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id)), "imported lead submitted for approval; state " + api.approvalState(LEADS, id));
        JsonPath asB = api.approval(adminB(), LEADS, id);
        note(c, "approval as adminB " + trim(asB.prettify()));
        traceOf(c, LEADS, id);
        String approvers = String.valueOf((Object) asB.get("data.currentApprovers")); // (Object): String.valueOf(char[]) was picked
        Assert.assertTrue(approvers.contains(adminB().id()) || Boolean.TRUE.equals(asB.get("data.canApprove")),
                "assigned owner adminB is the approver; currentApprovers " + approvers + " canApprove " + asB.get("data.canApprove"));
        Assert.assertFalse(approvers.contains(adminA().id()), "importer adminA must not be the record-owner approver; currentApprovers " + approvers);
    }

    @CaseId("F-04")
    @Test(groups = {"crm-order", "group-f"}, description = "AR → BP: transition open to the record owner can be run by the assigned owner")
    public void f04AssignmentBeforeBlueprintOwnerTransition() {
        String c = "F-04";
        String ar = assignmentRule(DEALS, c, userN().id());
        blueprint(c, caseGuard(DEALS, c), kinded("allowedUserIds", List.of(), "allowOwner", true));
        String id = importAssigned(DEALS, c, "imp", ar);
        assertAssigned(c, DEALS, id, userN());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id)), "imported deal governed by the blueprint");
        List<Map<String, Object>> trOwner = api.blueprintState(userN(), DEALS, id).getList("data.transitions");
        List<Map<String, Object>> trOther = api.blueprintState(userV(), DEALS, id).getList("data.transitions");
        note(c, "transitions for owner userN " + trOwner + " / for userV " + trOther);
        Assert.assertTrue(trOwner != null && !trOwner.isEmpty(), "assigned owner userN sees the owner-only transition");
        Response r = api.transition(userN(), DEALS, id, String.valueOf(trOwner.get(0).get("transitionId")), Map.of());
        traceOf(c, DEALS, id);
        Assert.assertEquals(r.statusCode() / 100, 2, "assigned owner runs the transition: " + r.statusCode() + " " + trim(r.asString()));
        Assert.assertEquals(api.field(adminA(), DEALS, id, "stage"), "proposal", "stage moved by the owner's transition");
    }

    // ================================================================ F-05 … F-08  Review → Workflow

    @CaseId("F-05")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → WF: no workflow marker while review is pending")
    public void f05NoWorkflowWhileReviewPending() {
        String c = "F-05";
        reviewLeads(c, List.of("manual"), null);
        String wf = markerWf(LEADS, c, "create");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        boolean leaked = CrmApi.waitFor(HOLD, () -> hasMarker(LEADS, id, c) || api.firedCount(id, wf) > 0);
        String status = api.reviewStatus(LEADS, id);
        if (leaked) {
            traceOf(c, LEADS, id);
            Assert.fail("workflow ran while review pending (status " + status + "): description " + desc(LEADS, id) + ", fired " + api.firedCount(id, wf));
        }
        // control: once review is approved, the same workflow must fire (proves the hold, not a dead rule)
        approveReview(LEADS, id, "email");
        boolean control = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        traceOf(c, LEADS, id);
        if (!control) inconclusive("no marker while pending, but the control (marker after review approval) never appeared either - see F-06");
    }

    @CaseId("F-06")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → WF: marker appears once, after review approval")
    public void f06WorkflowOnceAfterReviewApproval() {
        String c = "F-06";
        reviewLeads(c, List.of("manual"), null);
        String wf = markerWf(LEADS, c, "create");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        Assert.assertFalse(hasMarker(LEADS, id, c), "no marker before review approval");
        approveReview(LEADS, id, "email");
        boolean fired = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        CrmApi.waitFor(20, () -> api.firedCount(id, wf) > 1); // give a duplicate run time to show
        long n = api.firedCount(id, wf);
        traceOf(c, LEADS, id);
        Assert.assertTrue(fired, "marker after review approval; description " + desc(LEADS, id) + ", fired " + n);
        Assert.assertEquals(n, 1L, "workflow fired exactly once");
    }

    @CaseId("F-07")
    @Test(groups = {"crm-order", "group-f", "NDC-1697"}, description = "RP → WF: review rejected, owner edits without resubmitting → no workflow")
    public void f07RejectedEditDoesNotReleaseToWorkflow() {
        String c = "F-07";
        reviewLeads(c, List.of("manual"), null);
        String wf = markerWf(LEADS, c, "edit"); // create-or-edit: an edit would fire it if the hold leaks
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        rejectReview(LEADS, id, "email");
        Response edit = api.update(userN(), LEADS, id, Map.of("lead_source", "web"));
        note(c, "edit of rejected lead by userN -> " + edit.statusCode() + " " + trim(edit.asString()));
        boolean leaked = CrmApi.waitFor(HOLD, () -> hasMarker(LEADS, id, c) || api.firedCount(id, wf) > 0);
        String status = api.reviewStatus(LEADS, id);
        if (leaked || !"rejected".equals(status)) {
            traceOf(c, LEADS, id);
            Assert.fail("editing the rejected lead released it: review " + status + ", description " + desc(LEADS, id) + ", fired " + api.firedCount(id, wf)
                    + " (edit " + edit.statusCode() + ")");
        }
        // control: resubmit + approve → the same rule must fire
        resubmitReview(LEADS, id);
        approveReview(LEADS, id, "email");
        boolean control = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        traceOf(c, LEADS, id);
        if (!control) inconclusive("no marker after the edit, but the control (marker after resubmit + approval) never appeared either");
    }

    @CaseId("F-08")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → WF: rejected → resubmitted → approved: marker once, after the final approval")
    public void f08WorkflowOnceAfterResubmitApproval() {
        String c = "F-08";
        reviewLeads(c, List.of("manual"), null);
        String wf = markerWf(LEADS, c, "create");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        rejectReview(LEADS, id, "email");
        resubmitReview(LEADS, id);
        boolean early = CrmApi.waitFor(HOLD, () -> hasMarker(LEADS, id, c) || api.firedCount(id, wf) > 0);
        Assert.assertFalse(early, "no marker while rejected/resubmitted and pending; fired " + api.firedCount(id, wf));
        approveReview(LEADS, id, "email");
        boolean fired = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        CrmApi.waitFor(20, () -> api.firedCount(id, wf) > 1);
        long n = api.firedCount(id, wf);
        traceOf(c, LEADS, id);
        Assert.assertTrue(fired, "marker after the final approval; description " + desc(LEADS, id));
        Assert.assertEquals(n, 1L, "workflow fired exactly once");
    }

    // ================================================================ F-09 … F-11  Review → Approval

    @CaseId("F-09")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → AP: not pending approval while review is pending")
    public void f09NoApprovalWhileReviewPending() {
        String c = "F-09";
        reviewLeads(c, List.of("manual"), null);
        approval(LEADS, c, true, false, caseGuard(LEADS, c), null);
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.approvalState(LEADS, id) != null);
        if (leaked) {
            traceOf(c, LEADS, id);
            Assert.fail("approval started while review pending: approval state " + api.approvalState(LEADS, id) + ", review " + api.reviewStatus(LEADS, id));
        }
        approveReview(LEADS, id, "email");
        boolean control = CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id));
        traceOf(c, LEADS, id);
        if (!control) inconclusive("no approval while pending, but the control (pending approval after review approval) never came - see F-10");
    }

    @CaseId("F-10")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → AP: after review approval the record goes to Pending approval")
    public void f10ApprovalAfterReviewApproval() {
        String c = "F-10";
        reviewLeads(c, List.of("manual"), null);
        approval(LEADS, c, true, false, caseGuard(LEADS, c), null);
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, "lead"));
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        Assert.assertNull(api.approvalState(LEADS, id), "not in approval before review approval");
        approveReview(LEADS, id, "email");
        boolean pending = CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id));
        traceOf(c, LEADS, id);
        Assert.assertTrue(pending, "pending approval after review approval; state " + api.approvalState(LEADS, id) + ", approval_status " + api.approvalStatus(LEADS, id));
    }

    @CaseId("F-11")
    @Test(groups = {"crm-order", "group-f", "NDC-1697"}, description = "RP → AP: review rejected, owner edits to match the approval → still not in approval")
    public void f11RejectedEditDoesNotReleaseToApproval() {
        String c = "F-11";
        reviewLeads(c, List.of("manual"), null);
        approval(LEADS, c, true, true, and(caseGuard(LEADS, c), eq("lead_source", "referral")), null);
        Map<String, Object> f = leadFields(c, "lead");
        f.put("lead_source", "chat");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), f);
        Assert.assertEquals(waitReview(LEADS, id), "pending_for_review", "lead held for review");
        rejectReview(LEADS, id, "email");
        Response edit = api.update(userN(), LEADS, id, Map.of("lead_source", "referral"));
        note(c, "edit of rejected lead to match the approval -> " + edit.statusCode() + " " + trim(edit.asString()));
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.approvalState(LEADS, id) != null);
        String review = api.reviewStatus(LEADS, id);
        if (leaked || !"rejected".equals(review)) {
            traceOf(c, LEADS, id);
            Assert.fail("editing the rejected lead released it: review " + review + ", approval " + api.approvalState(LEADS, id) + " (edit " + edit.statusCode() + ")");
        }
        if (edit.statusCode() / 100 != 2) {
            traceOf(c, LEADS, id);
            note(c, "edit refused: the record is locked while rejected - nothing could reach approval");
            return;
        }
        resubmitReview(LEADS, id);
        approveReview(LEADS, id, "email");
        boolean control = CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id));
        traceOf(c, LEADS, id);
        if (!control) inconclusive("not in approval after the edit, but the control (approval after resubmit + review approval, lead_source referral) never came");
    }

    // ================================================================ F-12, F-13, F-23  Review → Blueprint

    private String dealWithNextStep(String c, String suffix) {
        Map<String, Object> f = dealFields(c, suffix);
        f.put("next_step", "QA review");
        return api.createRecord(userN(), DEALS, layout(DEALS), f);
    }

    @CaseId("F-12")
    @Test(groups = {"crm-order", "group-f", "NDC-1211"}, description = "RP → BP: not governed by the blueprint while in review")
    public void f12NoBlueprintWhileReviewPending() {
        String c = "F-12";
        reviewDeals(c);
        blueprint(c, caseGuard(DEALS, c), null);
        String id = dealWithNextStep(c, "deal");
        Assert.assertEquals(waitReview(DEALS, id), "pending_for_review", "deal held for review");
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.governed(DEALS, id));
        if (leaked) {
            traceOf(c, DEALS, id);
            Assert.fail("blueprint took the deal while review pending (review " + api.reviewStatus(DEALS, id) + ")");
        }
        approveReview(DEALS, id, "next_step");
        boolean control = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        if (!control) inconclusive("not governed while pending, but the control (governed after review approval) never came - see F-13");
    }

    @CaseId("F-13")
    @Test(groups = {"crm-order", "group-f"}, description = "RP → BP: governed after review approval")
    public void f13BlueprintAfterReviewApproval() {
        String c = "F-13";
        reviewDeals(c);
        blueprint(c, caseGuard(DEALS, c), null);
        String id = dealWithNextStep(c, "deal");
        Assert.assertEquals(waitReview(DEALS, id), "pending_for_review", "deal held for review");
        Assert.assertFalse(api.governed(DEALS, id), "not governed before review approval");
        approveReview(DEALS, id, "next_step");
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        Assert.assertTrue(governed, "deal governed after review approval");
    }

    @CaseId("F-23")
    @Test(groups = {"crm-order", "group-f"}, description = "Skip: RP + BP only (no WF, no AP) → blueprint right after review approval, no stall")
    public void f23ReviewThenBlueprintNoStall() {
        String c = "F-23";
        reviewDeals(c);
        blueprint(c, caseGuard(DEALS, c), null);
        String id = dealWithNextStep(c, "deal");
        Assert.assertEquals(waitReview(DEALS, id), "pending_for_review", "deal held for review");
        approveReview(DEALS, id, "next_step");
        long t0 = System.currentTimeMillis();
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        long secs = (System.currentTimeMillis() - t0) / 1000;
        note(c, "governed " + governed + " " + secs + " s after review approval");
        traceOf(c, DEALS, id);
        Assert.assertTrue(governed, "blueprint entered after review approval (no stall in the skipped WF/AP stages)");
        Assert.assertNull(api.approvalState(DEALS, id), "no approval stage ran");
    }

    // ================================================================ F-14 … F-16, F-24  Workflow → next stage

    @CaseId("F-14")
    @Test(groups = {"crm-order", "group-f"}, description = "WF → AP: workflow field update makes the record match the approval in the same save")
    public void f14WorkflowUpdateFeedsApproval() {
        String c = "F-14";
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate()
                .fieldUpdate("lead_source", "referral").fieldUpdate("description", marker(c)).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        approval(LEADS, c, true, false, and(caseGuard(LEADS, c), eq("lead_source", "referral")), null);
        Map<String, Object> f = leadFields(c, "lead");
        f.put("lead_source", "chat");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), f);
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        boolean pending = CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id));
        traceOf(c, LEADS, id);
        Assert.assertTrue(marked, "workflow ran (marker); lead_source " + api.field(adminA(), LEADS, id, "lead_source"));
        Assert.assertEquals(api.field(adminA(), LEADS, id, "lead_source"), "referral", "workflow set Lead Source");
        Assert.assertTrue(pending, "approval saw the workflow's value and started; state " + api.approvalState(LEADS, id));
    }

    @CaseId("F-15")
    @Test(groups = {"crm-order", "group-f"}, description = "WF → AP: workflow field update makes the record stop matching the approval → not submitted")
    public void f15WorkflowUpdateStopsApproval() {
        String c = "F-15";
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c + " wf").onCreate()
                .fieldUpdate("lead_source", "chat").fieldUpdate("description", marker(c)).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        approval(LEADS, c, true, false, and(caseGuard(LEADS, c), eq("lead_source", "referral")), null);
        // control first: same approval, workflow not matching → must go to approval
        Map<String, Object> cf = leadFields(c, "ctl");
        cf.put("lead_source", "referral");
        String ctl = api.createRecord(userN(), LEADS, layout(LEADS), cf);
        if (!CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, ctl)))
            inconclusive("control lead (Lead Source referral, no workflow) never went to approval: " + api.approvalState(LEADS, ctl));
        Map<String, Object> f = leadFields(c, "wf lead");
        f.put("lead_source", "referral");
        String id = api.createRecord(userN(), LEADS, layout(LEADS), f);
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(LEADS, id, c));
        boolean submitted = CrmApi.waitFor(HOLD, () -> api.approvalState(LEADS, id) != null);
        traceOf(c, LEADS, ctl);
        traceOf(c, LEADS, id);
        Assert.assertTrue(marked, "workflow ran (marker)");
        Assert.assertEquals(api.field(adminA(), LEADS, id, "lead_source"), "chat", "workflow changed Lead Source");
        Assert.assertFalse(submitted, "approval must see the workflow's value (chat) and not start; state " + api.approvalState(LEADS, id));
    }

    @CaseId("F-16")
    @Test(groups = {"crm-order", "group-f"}, description = "WF → BP: workflow sets the field the blueprint entry needs → governed")
    public void f16WorkflowUpdateFeedsBlueprint() {
        String c = "F-16";
        String wf = api.workflowRule(CrmProcs.workflow(DEALS, c + " WF").guardCase(c).onCreate()
                .fieldUpdate("next_step", "go").fieldUpdate("description", marker(c)).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        blueprint(c, and(caseGuard(DEALS, c), eq("next_step", "go")), null);
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "deal"));
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(DEALS, id, c));
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        Assert.assertTrue(marked, "workflow ran (marker); next_step " + api.field(adminA(), DEALS, id, "next_step"));
        Assert.assertTrue(governed, "blueprint entered after the workflow set Next Step = go");
    }

    @CaseId("F-24")
    @Test(groups = {"crm-order", "group-f"}, description = "Skip: WF + BP only → blueprint right after workflow, no stall")
    public void f24WorkflowThenBlueprintNoStall() {
        String c = "F-24";
        String wf = markerWf(DEALS, c, "create");
        blueprint(c, caseGuard(DEALS, c), null);
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "deal"));
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(DEALS, id, c));
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        Assert.assertTrue(marked, "workflow ran (marker), fired " + api.firedCount(id, wf));
        Assert.assertTrue(governed, "blueprint entered after the workflow");
        Assert.assertEquals(api.firedCount(id, wf), 1L, "workflow fired once");
    }

    // ================================================================ F-17 … F-20  Approval ↔ Blueprint

    @CaseId("F-17")
    @Test(groups = {"crm-order", "group-f", "NDC-909"}, description = "AP → BP: not governed while pending approval")
    public void f17NoBlueprintWhileApprovalPending() {
        String c = "F-17";
        approval(DEALS, c, true, false, caseGuard(DEALS, c), null);
        blueprint(c, caseGuard(DEALS, c), null);
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "deal"));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(DEALS, id)), "deal pending approval; state " + api.approvalState(DEALS, id));
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.governed(DEALS, id));
        if (leaked) {
            traceOf(c, DEALS, id);
            Assert.fail("blueprint took the deal while approval pending (" + api.approvalState(DEALS, id) + ")");
        }
        Response ap = api.approve(adminB(), DEALS, id);
        note(c, "approve -> " + ap.statusCode());
        boolean control = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        if (!control) inconclusive("not governed while pending, but the control (governed after approval) never came - see F-18");
    }

    @CaseId("F-18")
    @Test(groups = {"crm-order", "group-f"}, description = "AP → BP: governed after approval")
    public void f18BlueprintAfterApproval() {
        String c = "F-18";
        approval(DEALS, c, true, false, caseGuard(DEALS, c), null);
        blueprint(c, caseGuard(DEALS, c), null);
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "deal"));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(DEALS, id)), "deal pending approval; state " + api.approvalState(DEALS, id));
        Response ap = api.approve(adminB(), DEALS, id);
        Assert.assertEquals(ap.statusCode() / 100, 2, "approve: " + ap.asString());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.approvalState(DEALS, id))), "approved");
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        Assert.assertTrue(governed, "deal governed after approval");
    }

    @CaseId("F-19")
    @Test(groups = {"crm-order", "group-f"}, description = "AP → BP: rejected approval never enters the blueprint")
    public void f19RejectedApprovalNeverGoverned() {
        String c = "F-19";
        approval(DEALS, c, true, false, guard(DEALS, nm(c, "hold")), null);
        blueprint(c, caseGuard(DEALS, c), null);
        // control first: a deal outside the approval is governed straight away
        String ctl = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "ctl"));
        if (!CrmApi.waitFor(WAIT, () -> api.governed(DEALS, ctl))) inconclusive("control deal (no approval) never entered the blueprint");
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "hold"));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(DEALS, id)), "deal pending approval; state " + api.approvalState(DEALS, id));
        Response rj = api.reject(adminB(), DEALS, id);
        Assert.assertEquals(rj.statusCode() / 100, 2, "reject: " + rj.asString());
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "rejected".equals(api.approvalState(DEALS, id))), "approval rejected");
        boolean governed = CrmApi.waitFor(HOLD, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, ctl);
        traceOf(c, DEALS, id);
        Assert.assertFalse(governed, "rejected deal must not enter the blueprint");
    }

    @CaseId("F-20")
    @Test(groups = {"crm-order", "group-f"}, description = "BP → AP (edge): deal already in a blueprint, edited to match an on-edit approval → approval does not start (Zoho, community)")
    public void f20BlueprintRecordEditedToMatchApproval() {
        String c = "F-20";
        blueprint(c, guard(DEALS, nm(c, "bp")), null);
        approval(DEALS, c, false, true, and(caseGuard(DEALS, c), eq("next_step", "edit")), null);
        // control first: a deal outside the blueprint, same edit → approval starts
        String ctl = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "ctl"));
        Response ce = api.update(userN(), DEALS, ctl, Map.of("next_step", "edit"));
        if (ce.statusCode() / 100 != 2 || !CrmApi.waitFor(WAIT, () -> pendingApproval(DEALS, ctl)))
            inconclusive("control: on-edit approval never started on a deal outside the blueprint (edit " + ce.statusCode() + ", state " + api.approvalState(DEALS, ctl) + ")");
        String id = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "bp deal"));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id)), "deal governed by the blueprint");
        Response e = api.update(userN(), DEALS, id, Map.of("next_step", "edit"));
        Assert.assertEquals(e.statusCode() / 100, 2, "edit non-blueprint field: " + e.asString());
        boolean started = CrmApi.waitFor(HOLD, () -> api.approvalState(DEALS, id) != null);
        note(c, "approval on blueprint deal after edit: " + api.approvalState(DEALS, id) + ", still governed " + api.governed(DEALS, id));
        traceOf(c, DEALS, ctl);
        traceOf(c, DEALS, id);
        Assert.assertFalse(started, "approval should not start on a record owned by a blueprint (Zoho); state " + api.approvalState(DEALS, id));
    }

    // ================================================================ F-21  Workflow Create Record → Review

    @CaseId("F-21")
    @Test(groups = {"crm-order", "group-f"}, description = "WF → RP: lead made by a workflow Create Record action is held by a review with the workflow channel")
    public void f21WorkflowCreatedRecordHeldForReview() {
        String c = "F-21";
        String made = nm(c, "made");
        reviewLeads(c, List.of("workflow"), null);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("first_name", Rules.s(made));
        map.put("phone", Rules.s("01012345621"));
        map.put("single_line_3_9", Rules.s("QA AEO"));
        map.put("email", Rules.s("qa.aeo.sf.f21@qa.test"));
        String wf = api.workflowRule(CrmProcs.workflow(DEALS, c + " WF").guardCase(c).onCreate().createRecord(LEADS, layout(LEADS), map).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        String src = api.createRecord(userN(), DEALS, layout(DEALS), dealFields(c, "src"));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.firedCount(src, wf) > 0), "workflow fired on the source deal: " + api.executions(src));
        String lead = findByName(LEADS, made);
        if (lead == null) inconclusive("workflow fired but the created lead '" + made + "' was not found");
        extraRecords.add(new String[]{LEADS, lead});
        String status = waitReview(LEADS, lead);
        traceOf(c, DEALS, src);
        traceOf(c, LEADS, lead);
        Assert.assertEquals(status, "pending_for_review", "workflow-created lead held for review (channel workflow)");
    }

    // ================================================================ F-22  Assignment → Approval (skip review/workflow)

    @CaseId("F-22")
    @Test(groups = {"crm-order", "group-f"}, description = "Skip: AR + AP only → approval right after assignment, no stall")
    public void f22AssignmentThenApprovalNoStall() {
        String c = "F-22";
        String ar = assignmentRule(LEADS, c, userN().id());
        approval(LEADS, c, true, false, caseGuard(LEADS, c), null);
        String id = importAssigned(LEADS, c, "imp", ar);
        assertAssigned(c, LEADS, id, userN());
        boolean pending = CrmApi.waitFor(WAIT, () -> pendingApproval(LEADS, id));
        traceOf(c, LEADS, id);
        Assert.assertTrue(pending, "imported + assigned lead went to approval; state " + api.approvalState(LEADS, id));
    }

    // ================================================================ maintenance (run alone, not part of crm-order)

    /**
     * Removes this session's leftovers from an aborted run: records named "QA AEO SF …" in this session's own QA layouts
     * only (created_with_layout_id), so nothing of a teammate is touched.
     */
    @Test(groups = {"sf-cleanup"}, description = "Delete QA AEO SF records left in this session's QA layouts")
    public void sfLeftovers() {
        for (String m : List.of(LEADS, DEALS, CrmOrderFeature.TASKS)) {
            String lay = layout(m);
            for (int page = 1; page <= 15; page++) {
                List<Map<String, Object>> rows = ok(adminA().get("/modules/" + m + "/records?page_size=200&page=" + page), "list").jsonPath().getList("data");
                if (rows == null || rows.isEmpty()) break;
                for (Map<String, Object> r : rows) {
                    String n = nameOf(r, m);
                    if (n != null && n.startsWith(CrmOrderFeature.prefix()) && lay.equals(String.valueOf(r.get("created_with_layout_id"))))
                        note("cleanup", "delete " + r.get("id") + " '" + n + "' -> " + api.deleteRecord(m, String.valueOf(r.get("id"))).statusCode());
                }
                if (rows.size() < 200) break;
            }
        }
    }
}
