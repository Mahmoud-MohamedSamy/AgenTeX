package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.features.crmautomationorder.pages.ApprovalProcessesPage;
import qa.features.crmautomationorder.pages.AssignmentRulesPage;
import qa.features.crmautomationorder.pages.BlueprintsPage;
import qa.features.crmautomationorder.pages.LeadRecordPage;
import qa.features.crmautomationorder.pages.ReviewProcessesPage;
import qa.features.crmautomationorder.pages.WorkflowRulesPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;

/**
 * Selenium UI layer (21 Oct 2026): the five process setup screens can create → list → reopen → delete a process
 * (UI-01…UI-05), the record page shows the execution order as a user sees it (UI-06), and Save is disabled when no
 * field is editable (K-10, NDC-1672). Browser = Owner (Desk session reused on the CRM host). Setup the screens cannot
 * reach and the safety-net cleanup go through the API as CRM Admin B. Everything is named "QA AEO UI …" and is
 * restricted to names starting with that prefix; the safety net deletes leftovers by exact name.
 * Groups: crm-ui, smoke.
 */
public class UiSmokeTest extends BaseTest {

    private static final String TAG = "UI";
    private static final String OWNER_OPTION = "ndc-staging-owner";
    private static final String ADMIN_B_OPTION = "mahmoud.mahamed1515";

    private CrmApi api;
    private String layoutId;
    private String layoutName;
    /** Names created through the screens in the current test, deleted by the safety net if the test did not. */
    private final List<String[]> uiMade = new ArrayList<>();

    private static CrmUser adminA() { return CrmUser.as(CrmOrderFeature.ADMIN_A); }
    private static CrmUser adminB() { return CrmUser.as(CrmOrderFeature.ADMIN_B); }

    private static String prefix() {
        return CrmOrderFeature.prefix();
    }

    private static String nm(String c, String what) {
        return prefix() + c + " " + what;
    }

    private static void note(String s) {
        System.out.println("[crm-ui] " + s.replace('\n', ' '));
        io.qameta.allure.Allure.step(s);
    }

    @BeforeClass(alwaysRun = true)
    public void layout() {
        CrmOrderFeature.session(TAG);
        // Own Leads layout, open to all users so the Owner's pickers list it (only one review process per layout).
        Map<String, Object> std = CrmUser.ok(adminB().get("/modules/" + LEADS + "/layouts/" + CrmOrderFeature.LEADS_STANDARD), "Standard layout").jsonPath().getMap("data");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name", "QA AEO Layout UI");
        body.put("views", std.get("views"));
        body.put("assignedProfiles", List.of());
        body.put("accessMode", "all_users");
        body.put("status", "active");
        Response r = adminB().post("/modules/" + LEADS + "/layouts", body);
        if (r.statusCode() == 409) {
            body.put("name", "QA AEO Layout UI " + (System.currentTimeMillis() % 100_000));
            r = adminB().post("/modules/" + LEADS + "/layouts", body);
        }
        Map<String, Object> made = CrmUser.ok(r, "create UI layout").jsonPath().getMap("data");
        layoutId = String.valueOf(made.get("id"));
        layoutName = String.valueOf(made.get("name"));
        note("layout " + layoutName + " " + layoutId);
    }

    @AfterClass(alwaysRun = true)
    public void dropLayout() {
        if (layoutId != null) note("delete layout " + layoutId + " -> " + CrmApi.deleteLayout(adminB(), LEADS, layoutId).statusCode());
    }

    @BeforeMethod(alwaysRun = true)
    public void fresh() {
        CrmOrderFeature.session(TAG);
        api = new CrmApi(adminB());
        uiMade.clear();
    }

    @AfterMethod(alwaysRun = true)
    public void cleanup() {
        for (String[] m : uiMade) safetyNet(m[0], m[1]);
        if (api != null) api.cleanup();
    }

    // ---------------- UI-01 … UI-05: create → list → reopen → delete ----------------

    @CaseId("UI-01")
    @ZohoRef(value = "zoho/01-assignment-rules.png", note = "Zoho CRM Setup → Assignment Rules (org943261092, 21 Oct 2026)")
    @Test(groups = {"crm-ui", "smoke"}, description = "Assignment rule: create on screen (Web Form only, names QA AEO UI…) → listed → reopened → deleted")
    public void ui01AssignmentRule() {
        String name = nm("UI-01", "AR");
        uiMade.add(new String[]{"assignment", name});
        AssignmentRulesPage p = new AssignmentRulesPage().open().create(name, prefix(), ADMIN_B_OPTION);
        p.open();
        assertTrue(p.listed(name, 30), "the saved rule is listed");
        p.setActive(name, false);
        assertEquals(p.edit(name).openedName(), name, "reopened rule keeps its name");
        p.cancelEdit().open();
        note("delete dialog: " + p.delete(name));
        assertFalse(p.open().listed(name, 5), "the rule is gone after Delete");
    }

    @CaseId("UI-02")
    @ZohoRef(value = "zoho/02-review-process.png", note = "Zoho CRM Setup → Review Processes (org943261092, 21 Oct 2026)")
    @Test(groups = {"crm-ui", "smoke"}, description = "Review process: create on screen on the QA layout → listed → reopened → deleted")
    public void ui02ReviewProcess() {
        String name = nm("UI-02", "RP");
        uiMade.add(new String[]{"review", name});
        ReviewProcessesPage p = new ReviewProcessesPage().open().create(name, layoutName, "Email", OWNER_OPTION);
        p.open();
        assertTrue(p.listed(name, 30), "the saved process is listed");
        p.setActive(name, false);
        assertTrue(p.edit(name).pageText().contains(name), "reopened process shows its name");
        p.cancelEdit().open();
        note("delete dialog: " + p.delete(name));
        assertFalse(p.open().listed(name, 5), "the process is gone after Delete");
    }

    @CaseId("UI-03")
    @ZohoRef(value = "zoho/03-workflow-rules.png", note = "Zoho CRM Setup → Workflow Rules (org943261092, 21 Oct 2026)")
    @Test(groups = {"crm-ui", "smoke"}, description = "Workflow rule: create on screen (On Create, names QA AEO UI…, Field Update) → active in list → deactivate → reopened → deleted")
    public void ui03WorkflowRule() {
        String name = nm("UI-03", "WF");
        uiMade.add(new String[]{"workflow", name});
        WorkflowRulesPage p = new WorkflowRulesPage().open().create(name, prefix(), "QA AEO UI-03 marker");
        p.open();
        assertTrue(p.listed(name, 30), "the saved rule is listed");
        String row = p.rowText(name);
        note("row after save: " + row);
        p.activate(name, false).open();
        String after = p.rowText(name);
        note("row after Deactivate: " + after);
        assertTrue(row.contains("Active") && !row.contains("Inactive"), "Save & Activate leaves the rule Active: " + row);
        assertTrue(after.contains("Inactive"), "Deactivate from the list: " + after);
        assertEquals(p.edit(name).openedName(), name, "reopened rule keeps its name");
        p.cancelEdit().open();
        note("delete dialog: " + p.delete(name));
        assertFalse(p.open().listed(name, 5), "the rule is gone after Delete");
    }

    @CaseId("UI-04")
    @ZohoRef(value = "zoho/04-approval-processes.png", note = "Zoho CRM Setup → Approval Processes (org943261092, 21 Oct 2026)")
    @Test(groups = {"crm-ui", "smoke"}, description = "Approval process: create on screen (names QA AEO UI…, approver + admin) → listed → reopened → deleted")
    public void ui04ApprovalProcess() {
        String name = nm("UI-04", "appr");
        uiMade.add(new String[]{"approval", name});
        ApprovalProcessesPage p = new ApprovalProcessesPage().open().create(name, prefix(), ADMIN_B_OPTION);
        p.open();
        assertTrue(p.listed(name, 30), "the saved process is listed");
        p.setActive(name, false);
        assertEquals(p.edit(name).openedName(), name, "reopened process keeps its name");
        p.cancelEdit().open();
        note("delete dialog: " + p.delete(name));
        assertFalse(p.open().listed(name, 5), "the process is gone after Delete");
    }

    @CaseId("UI-05")
    @ZohoRef(value = "zoho/05-blueprint.png", note = "Zoho CRM Setup → Blueprint (org943261092, 21 Oct 2026)")
    @Test(groups = {"crm-ui", "smoke"}, description = "Blueprint: designer with two states and a named transition → Save as draft → listed → reopened → deleted")
    public void ui05Blueprint() {
        String name = nm("UI-05", "BP");
        uiMade.add(new String[]{"blueprint", name});
        BlueprintsPage p = new BlueprintsPage().open().create(name, layoutName, "Lead Source", "chat", "web", "QA UI go");
        assertTrue(p.hasEdge("chat", "web"), "the two states are joined on the canvas");
        assertFalse(p.issuesShown(), "no open issues once the transition is named");
        p.saveDraft().open();
        assertTrue(p.listed(name, 30), "the draft is listed");
        assertEquals(p.openByName(name).openedName(), name, "reopened blueprint keeps its name");
        p.cancelEdit().open();
        note("delete dialog: " + p.delete(name));
        assertFalse(p.open().listed(name, 5), "the blueprint is gone after Delete");
    }

    // ---------------- UI-06: execution order on the record page ----------------

    @CaseId("UI-06")
    @Test(groups = {"crm-ui"}, description = "Record page follows Review → Approval → Blueprint: no approval or transition while in review, no transition while pending approval, transition after approval")
    public void ui06OrderOnRecordPage() {
        String c = "UI-06";
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layoutId, c + " RP", CrmProcs.guard(LEADS, prefix() + c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, c + " appr", true, false, CrmProcs.guard(LEADS, prefix() + c),
                List.of(CrmProcs.levelUsers(adminB().id())), List.of(adminA().id())));
        String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layoutId, null, "lead_source", c + " BP", CrmProcs.guard(LEADS, prefix() + c),
                List.of("chat", "web", "referral"), null));
        api.setReviewActive(rp, true, null);
        api.setApprovalActive(ap, true);
        api.setBlueprintActive(LEADS, bp, true);
        String lead = nm(c, "lead");
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, lead));
        f.put("email", "qa.aeo.ui06@qa.test");
        f.put("lead_source", "chat");
        f.put("lead_status", "No Answer");
        String id = api.createRecord(adminB(), LEADS, layoutId, f);
        assertTrue(CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id))), "control: the lead is held for review");
        String transition = "QA chat to web";
        List<String> problems = new ArrayList<>();

        LeadRecordPage page = new LeadRecordPage().open(id, lead);
        String t1 = page.text();
        note("1 in review: " + t1.replace('\n', ' '));
        if (page.hasButton(transition)) problems.add("in review: blueprint transition offered");
        if (t1.contains("Pending approval")) problems.add("in review: approval already pending");

        api.reviewApproveAll(adminA(), api.reviewRequestId(LEADS, id), "email");
        assertTrue(CrmApi.waitFor(60, () -> "pending_approval".equals(api.approvalState(LEADS, id))), "control: approval starts after the review");
        page.open(id, lead);
        String t2 = page.text();
        note("2 pending approval: " + t2.replace('\n', ' '));
        if (!t2.contains("Pending approval") && !t2.toLowerCase().contains("approval")) problems.add("pending approval: no approval status shown");
        if (page.hasButton(transition)) problems.add("pending approval: blueprint transition offered");

        CrmUser.ok(api.approve(adminB(), LEADS, id), "approve");
        assertTrue(CrmApi.waitFor(60, () -> api.governed(LEADS, id)), "control: the blueprint takes the lead after approval");
        page.open(id, lead);
        String t3 = page.text();
        note("3 approved, in blueprint: " + t3.replace('\n', ' '));
        if (!page.hasButton(transition)) problems.add("approved: blueprint transition '" + transition + "' not offered");
        assertTrue(problems.isEmpty(), "record page order: " + problems);
    }

    // ---------------- K-10 (NDC-1672) ----------------

    @CaseId("K-10")
    @Test(groups = {"crm-ui", "NDC-1672"}, description = "A lead pending approval, opened by a user who is not the approver: no field editable and Save disabled")
    public void k10SaveDisabledWhenNothingEditable() {
        String c = "K-10";
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, c + " appr", true, false, CrmProcs.guard(LEADS, prefix() + c),
                List.of(CrmProcs.levelUsers(adminB().id())), List.of(adminA().id())));
        api.setApprovalActive(ap, true);
        String lead = nm(c, "lead");
        String id = api.createRecord(adminB(), LEADS, layoutId, CrmApi.minimal(LEADS, lead));
        assertTrue(CrmApi.waitFor(60, () -> "pending_approval".equals(api.approvalState(LEADS, id))), "control: the lead is pending approval");
        LeadRecordPage page = new LeadRecordPage().open(id, lead);
        Boolean save = page.saveEnabled();
        note("K-10 release: reject approval -> " + api.reject(adminB(), LEADS, id).statusCode()); // a pending lead blocks its own and the process's deletion
        int editable = page.editableInputs();
        note("K-10 save=" + save + " editableInputs=" + editable + " | " + page.text().replace('\n', ' '));
        if (editable > 0) throw new SkipException("inconclusive: the Owner can still edit " + editable + " field(s) of a pending lead, so this is not the NDC-1672 situation");
        assertTrue(save == null || !save, "Save must be disabled when no field is editable (NDC-1672)");
    }

    // ---------------- F-02 (owner criterion built on screen) ----------------

    @CaseId("F-02")
    @Test(groups = {"crm-ui-f02"}, description = "Workflow built on screen with Lead Owner is <user>: fires on a lead the assignment rule assigned to that user; prints the saved criteria")
    @SuppressWarnings("unchecked")
    public void f02OwnerCriterionFromScreen() {
        String c = "F-02";
        String name = nm(c, "WF");
        uiMade.add(new String[]{"workflow", name});
        String marker = "QA AEO UI F-02 marker";
        WorkflowRulesPage p = new WorkflowRulesPage().open().create(name, prefix() + c, ADMIN_B_OPTION, marker);
        p.open();
        assertTrue(p.listed(name, 30), "rule saved");
        String ruleId = null;
        Object data = adminB().get("/workflow/rules").jsonPath().get("data");
        List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) adminB().get("/workflow/rules").jsonPath().getList("data.items");
        for (Object o : rows) if (name.equals(((Map<String, Object>) o).get("name"))) ruleId = String.valueOf(((Map<String, Object>) o).get("id"));
        Response rule = adminB().get("/workflow/rules/" + ruleId);
        note("F-02 saved rule criteria: " + rule.jsonPath().<Object>get("data.criteria"));
        // control: a lead created by adminB (owner adminB) on screen-made rule
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "ctl")));
        String ctl = api.createRecord(adminB(), LEADS, layoutId, f);
        // other owner: created by adminA → must NOT fire
        String other = api.createRecord(adminA(), LEADS, layoutId, new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "other"))));
        boolean ctlFired = CrmApi.waitFor(60, () -> adminB().get("/modules/" + LEADS + "/records/" + ctl).asString().contains(marker)); // the Comment field key is not needed: look for the marker anywhere in the record
        boolean otherFired = adminB().get("/modules/" + LEADS + "/records/" + other).asString().contains(marker);
        note("F-02 owner(ctl)=" + api.field(adminB(), LEADS, ctl, "owner") + " fired=" + ctlFired + "; owner(other)=" + api.field(adminB(), LEADS, other, "owner") + " fired=" + otherFired);
        p.activate(name, false).open();
        note("delete dialog: " + p.delete(name));
        assertTrue(ctlFired, "workflow with Lead Owner is adminB fired on a lead owned by adminB");
        assertFalse(otherFired, "and not on a lead owned by someone else");
    }

    // ---------------- E-16 (NDC-1328) ----------------

    @CaseId("E-16")
    @Test(groups = {"crm-ui", "NDC-1328"}, description = "Blueprint After-transition Task with Related To: the task page and the designer show the record name, not its id")
    @SuppressWarnings("unchecked")
    public void e16RelatedToShowsName() {
        String c = "E-16";
        String anchorName = nm(c + "x", "anchor");
        String anchor = api.createRecord(adminB(), LEADS, layoutId, CrmApi.minimal(LEADS, anchorName));
        String subject = nm(c, "after task");
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", qa.features.deskworkflowrules.Rules.kinded("name", subject, "subject", subject, "status", "Not Started", "related_to", LEADS + ":" + anchor));
        task.put("assigneeMode", "owner");
        task.put("assigneeUserId", null);
        String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layoutId, null, "lead_source", c + " BP", CrmProcs.guard(LEADS, prefix() + c + " "),
                List.of("chat", "web", "referral"), List.of(task)));
        api.setBlueprintActive(LEADS, bp, true);
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String lead = api.createRecord(adminB(), LEADS, layoutId, f);
        assertTrue(CrmApi.waitFor(45, () -> api.governed(LEADS, lead)), "control: lead governed");
        String tid = null;
        for (Map<String, Object> t : (List<Map<String, Object>>) (List<?>) api.blueprintState(adminB(), LEADS, lead).getList("data.transitions"))
            if (String.valueOf(t.get("transitionName")).contains("chat to web")) tid = String.valueOf(t.get("transitionId"));
        CrmUser.ok(api.transition(adminB(), LEADS, lead, tid, Map.of()), "transition");
        String taskId = null;
        for (int i = 0; i < 12 && taskId == null; i++) {
            for (Map<String, Object> row : CrmApi.newestRows(adminB(), CrmOrderFeature.TASKS, 1))
                if (String.valueOf(row).contains(subject)) taskId = String.valueOf(row.get("id"));
            if (taskId == null) CrmUser.sleep(5000);
        }
        assertTrue(taskId != null, "control: the After task was created");
        api.track(CrmOrderFeature.TASKS, taskId);
        LeadRecordPage page = new LeadRecordPage().openRecord(CrmOrderFeature.TASKS, taskId, subject);
        String taskPage = page.text();
        note("E-16 task page: " + taskPage);
        page.openPath("/settings/blueprints/" + LEADS + "/" + bp, "QA chat to web");
        page.clickText("QA chat to web").clickText("After");
        String designer = page.text();
        note("E-16 designer After tab: " + designer);
        List<String> problems = new ArrayList<>();
        if (!taskPage.contains(anchorName)) problems.add("task page does not show the related lead's name '" + anchorName + "'");
        if (taskPage.contains(anchor)) problems.add("task page shows the lead id " + anchor);
        if (designer.contains(anchor)) problems.add("designer After action shows the lead id " + anchor);
        assertTrue(problems.isEmpty(), "Related To shows names (NDC-1328): " + problems);
    }

    // ---------------- WH-22 (NDC-2540): blueprint webhook added on the designer screen ----------------

    @CaseId("WH-22")
    @Test(groups = {"crm-ui", "NDC-2540"}, description = "Blueprint After webhook added on the designer screen: what is saved, and does it send on the transition?")
    @SuppressWarnings("unchecked")
    public void wh22BlueprintWebhookFromScreen() {
        String c = "WH-22";
        qa.features.deskworkflowrules.WebhookSite h = qa.features.deskworkflowrules.WebhookSite.create(200, 0);
        try {
            String bp = api.blueprint(LEADS, CrmProcs.blueprint("leads", layoutId, null, "lead_source", c + " BP", CrmProcs.guard(LEADS, prefix() + c + " "),
                    List.of("chat", "web", "referral"), null));
            LeadRecordPage page = new LeadRecordPage().openPath("/settings/blueprints/" + LEADS + "/" + bp, "QA chat to web");
            page.clickText("QA chat to web").clickText("After");
            note("WH-22 After tab before: " + page.text());
            page.clickText("Webhook");
            note("WH-22 after clicking Webhook: " + page.text());
            page.typeLabeled("Webhook URL", h.url());
            page.clickButton("Publish");
            note("WH-22 after Publish: " + page.text());
            Map<String, Object> saved = CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints/" + bp), "GET blueprint").jsonPath().getMap("data");
            Object after = null;
            for (Map<String, Object> t : (List<Map<String, Object>>) ((Map<String, Object>) saved.get("definition")).get("transitions"))
                if (String.valueOf(t.get("name")).contains("chat to web")) after = t.get("after");
            note("WH-22 saved from screen: isActive=" + saved.get("isActive") + " hasDraft=" + saved.get("hasDraft") + " after=" + after);
            assertTrue(String.valueOf(after).contains(h.uuid), "the screen saved the webhook URL on the After actions: " + after);
            api.setBlueprintActive(LEADS, bp, true);
            Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
            f.put("lead_source", "chat");
            String lead = api.createRecord(adminB(), LEADS, layoutId, f);
            assertTrue(CrmApi.waitFor(45, () -> api.governed(LEADS, lead)), "control: lead governed");
            String tid = null;
            for (Map<String, Object> t : (List<Map<String, Object>>) (List<?>) api.blueprintState(adminB(), LEADS, lead).getList("data.transitions"))
                if (String.valueOf(t.get("transitionName")).contains("chat to web")) tid = String.valueOf(t.get("transitionId"));
            CrmUser.ok(api.transition(adminB(), LEADS, lead, tid, Map.of()), "transition");
            int n = h.await(1, 90).size();
            note("WH-22 RESULT lead " + lead + " state=" + api.field(adminB(), LEADS, lead, "lead_source") + " webhook requests=" + n);
            assertTrue(n > 0, "the webhook saved from the designer screen is sent after the transition (NDC-2540)");
        } finally {
            h.delete();
        }
    }

    // ---------------- K-09 (NDC-1645 / NDC-1652) ----------------

    @CaseId("K-09")
    @Test(groups = {"crm-ui", "NDC-1645", "NDC-1652"}, description = "Approval Status: system field in Fields, not addable on the Standard layout, not offered in approval criteria (read-only)")
    public void k09ApprovalStatusOnScreen() {
        LeadRecordPage page = new LeadRecordPage().openPath("/settings/modules-and-fields/" + LEADS, "Layouts");
        page.clickText("Fields").typeInto("Search Fields or Data Types", "Approval");
        String fields = page.text();
        int at = fields.indexOf("Approval Status");
        note("K-09 Fields tab: " + (at < 0 ? "Approval Status not listed" : fields.substring(Math.max(0, at - 50), Math.min(fields.length(), at + 200))));
        page.openPath("/settings/modules-and-fields/" + LEADS + "/layouts/" + CrmOrderFeature.LEADS_STANDARD, "Unused Fields");
        page.clickText("Unused Fields");
        boolean inStandard = page.text().contains("Approval Status");
        ApprovalProcessesPage ap = new ApprovalProcessesPage().open();
        List<String> offered = ap.criteriaFields();
        boolean inCriteria = offered.stream().anyMatch(o -> o.startsWith("Approval Status"));
        note("K-09 Standard builder lists Approval Status=" + inStandard + "; approval criteria offer Approval Status=" + inCriteria + " (of " + offered.size() + " fields)");
        List<String> problems = new ArrayList<>();
        if (at < 0) problems.add("Fields tab does not list Approval Status");
        if (inCriteria) problems.add("approval criteria offer Approval Status (NDC-1652)");
        assertTrue(problems.isEmpty(), "K-09: " + problems);
    }

    // ---------------- A-10 ----------------

    /**
     * A-10: assignment rule entry with "Online status" availability. Members in order [test user 2 (no session, offline),
     * Owner (signed in: this browser keeps the session open)]; fallback Default user = Supervisor. An import with the
     * rule must skip the offline member. Control: the same entry without the availability check picks the first member.
     */
    @CaseId("A-10")
    @Test(groups = {"crm-ui"}, description = "Assignment availability Online status: the signed-out member is skipped")
    public void a10OnlineStatusSkipsOfflineMember() {
        String c = "A-10";
        new LeadRecordPage().openPath("/workqueue", "Work Queue"); // the Owner is online in this browser
        CrmUser owner = CrmUser.as(CrmOrderFeature.OWNER), sup = CrmUser.as(CrmOrderFeature.SUPERVISOR);
        // -Da10first=<user id>: a member looked up by id only (never signed in by the test, so no session of its own).
        // Default test user 2 - but the test signs it in through the API to get its id, which opens a session (22 Oct).
        String firstId = System.getProperty("a10first", "");
        if (firstId.isEmpty()) firstId = CrmUser.as(CrmOrderFeature.USER_V).id();
        String firstLabel = System.getProperty("a10firstLabel", "test user 2");
        Map<String, String> got = new LinkedHashMap<>();
        for (boolean online : new boolean[]{false, true}) {
            String tag = c + (online ? "on" : "off");
            Map<String, Object> body = CrmProcs.assignmentRule(LEADS, tag + " AR", List.of("Import"), CrmProcs.guard(LEADS, prefix() + tag + " "),
                    List.of(firstId, owner.id()), "DefaultUser", sup.id());
            Map<String, Object> entry = ((List<Map<String, Object>>) (List<?>) body.get("entries")).get(0);
            entry.put("availability", qa.features.deskworkflowrules.Rules.kinded("requireOnline", online, "requireOnShift", false));
            String ar = api.assignmentRule(body);
            api.setAssignmentRuleActive(ar, true);
            String name = nm(tag, "imp");
            String csv = "first_name,phone,single_line_3_9\n\"" + name + "\",\"01012345678\",\"QA AEO\"\n";
            Response up = adminA().req().contentType("multipart/form-data").multiPart("file", "qa-aeo-a10.csv", csv.getBytes(java.nio.charset.StandardCharsets.UTF_8), "text/csv")
                    .post("/modules/" + LEADS + "/import");
            String base = "/modules/" + LEADS + "/import/" + CrmUser.ok(up, "upload").jsonPath().getString("data.session_id");
            Map<String, Object> opts = new LinkedHashMap<>();
            opts.put("skip_empty", true);
            opts.put("replace_empty", null);
            opts.put("notify_email", false);
            opts.put("assign_to_user_id", null);
            opts.put("trigger_automation", true);
            opts.put("assignment_rule_id", ar);
            opts.put("manual_approval", false);
            opts.put("default_tag_ids", List.of());
            opts.put("duplicate_check_module_ids", List.of());
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("mode", "add");
            m.put("match_field_key", null);
            m.put("layout_id", layoutId);
            m.put("mapping", List.of(qa.features.deskworkflowrules.Rules.kinded("header", "first_name", "field", "first_name"),
                    qa.features.deskworkflowrules.Rules.kinded("header", "phone", "field", "phone"),
                    qa.features.deskworkflowrules.Rules.kinded("header", "single_line_3_9", "field", "single_line_3_9")));
            m.put("options", opts);
            CrmUser.ok(adminA().put(base + "/mapping", m), "mapping");
            CrmUser.ok(adminA().post(base + "/validate", null), "validate");
            CrmUser.ok(adminA().post(base + "/execute", null), "execute");
            String id = api.findRecord(LEADS, name, 120);
            if (id != null) api.track(LEADS, id);
            String own = id == null ? null : api.field(adminB(), LEADS, id, "owner");
            String who = own == null ? "none" : own.equals(firstId) ? firstLabel + " (first member)" : own.equals(owner.id()) ? "Owner (online)" : own.equals(sup.id()) ? "Supervisor (fallback)" : own;
            got.put(online ? "requireOnline" : "control", who);
            note("A-10 " + (online ? "requireOnline=true" : "control requireOnline=false") + ": lead " + id + " owner " + who);
        }
        assertEquals(got.get("control"), firstLabel + " (first member)", "control: without availability the first member gets the lead");
        assertTrue(!(firstLabel + " (first member)").equals(got.get("requireOnline")), "Online status: the member with no session must be skipped, got " + got.get("requireOnline"));
    }

    // ---------------- A-17 ----------------

    /** Users list → row of {@code user} → its menu → {@code item}; confirms a dialog if one opens. Returns the menu items seen. */
    private String userRowAction(String user, String item) {
        LeadRecordPage page = new LeadRecordPage();
        page.openPath("/settings", "Setup Home");
        page.clickText("Users");
        qa.core.base.Waits.sleep(6000);
        java.util.List<org.openqa.selenium.WebElement> acts = driver().findElements(org.openqa.selenium.By.xpath("//tr[.//*[normalize-space(.)='" + user + "']]//button"));
        acts.get(acts.size() - 1).click();
        qa.core.base.Waits.sleep(1500);
        StringBuilder items = new StringBuilder();
        org.openqa.selenium.WebElement hit = null;
        for (org.openqa.selenium.WebElement e : driver().findElements(org.openqa.selenium.By.cssSelector("[role='menuitem']")))
            if (e.isDisplayed()) {
                items.append(" | ").append(e.getText().trim());
                if (e.getText().trim().matches(item)) hit = e;
            }
        if (hit == null) {
            new org.openqa.selenium.interactions.Actions(driver()).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
            return "NO MATCH for " + item + ":" + items;
        }
        String chosen = hit.getText().trim();
        hit.click();
        qa.core.base.Waits.sleep(1500);
        java.util.List<org.openqa.selenium.WebElement> dlg = driver().findElements(org.openqa.selenium.By.xpath("//*[@role='dialog' or @role='alertdialog']"));
        String dialog = dlg.isEmpty() ? "" : dlg.get(0).getText().replace('\n', ' ');
        if (!dlg.isEmpty()) {
            java.util.List<org.openqa.selenium.WebElement> bs = dlg.get(0).findElements(org.openqa.selenium.By.tagName("button"));
            for (int i = bs.size() - 1; i >= 0; i--)
                if (!bs.get(i).getText().trim().matches("(?i)cancel|close|") && bs.get(i).isEnabled()) {
                    bs.get(i).click();
                    break;
                }
        }
        qa.core.base.Waits.sleep(3000);
        return "clicked '" + chosen + "' (menu" + items + ") dialog: " + dialog;
    }

    private String userStatus(String userId) {
        for (Object o : CrmUser.ok(adminB().get("/iam/users?app_key=crm"), "users").jsonPath().getList("data"))
            if (userId.equals(((Map<?, ?>) o).get("userId"))) return String.valueOf(((Map<?, ?>) o).get("status"));
        return "not listed";
    }

    /**
     * A-17 (user OK 21 Oct): a suspended member of the rule's Category is skipped and the fallback (Default user =
     * Supervisor) gets the lead (Zoho: inactive users are skipped). test user 2 is suspended on screen and ALWAYS
     * reactivated in finally.
     */
    @CaseId("A-17")
    @Test(groups = {"crm-ui"}, description = "Assignment: a suspended member is skipped and the fallback user gets the lead")
    @SuppressWarnings("unchecked")
    public void a17SuspendedMemberSkipped() {
        String c = "A-17";
        CrmUser v = CrmUser.as(CrmOrderFeature.USER_V), sup = CrmUser.as(CrmOrderFeature.SUPERVISOR);
        String vid = v.id(), supId = sup.id();
        Map<String, Object> body = CrmProcs.assignmentRule(LEADS, c + " AR", List.of("Import"), CrmProcs.guard(LEADS, prefix() + c + " "),
                List.of(vid), "DefaultUser", supId);
        String ar = api.assignmentRule(body);
        api.setAssignmentRuleActive(ar, true);
        String who = null;
        try {
            note("A-17 status before: " + userStatus(vid));
            note("A-17 suspend: " + userRowAction("test user 2", "(?i)suspend.*"));
            note("A-17 status after suspend: " + userStatus(vid));
            String name = nm(c, "imp");
            String csv = "first_name,phone,single_line_3_9\n\"" + name + "\",\"01012345679\",\"QA AEO\"\n";
            Response up = adminA().req().contentType("multipart/form-data").multiPart("file", "qa-aeo-a17.csv", csv.getBytes(java.nio.charset.StandardCharsets.UTF_8), "text/csv")
                    .post("/modules/" + LEADS + "/import");
            String base = "/modules/" + LEADS + "/import/" + CrmUser.ok(up, "upload").jsonPath().getString("data.session_id");
            Map<String, Object> opts = new LinkedHashMap<>();
            opts.put("skip_empty", true);
            opts.put("replace_empty", null);
            opts.put("notify_email", false);
            opts.put("assign_to_user_id", null);
            opts.put("trigger_automation", true);
            opts.put("assignment_rule_id", ar);
            opts.put("manual_approval", false);
            opts.put("default_tag_ids", List.of());
            opts.put("duplicate_check_module_ids", List.of());
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("mode", "add");
            m.put("match_field_key", null);
            m.put("layout_id", layoutId);
            m.put("mapping", List.of(qa.features.deskworkflowrules.Rules.kinded("header", "first_name", "field", "first_name"),
                    qa.features.deskworkflowrules.Rules.kinded("header", "phone", "field", "phone"),
                    qa.features.deskworkflowrules.Rules.kinded("header", "single_line_3_9", "field", "single_line_3_9")));
            m.put("options", opts);
            CrmUser.ok(adminA().put(base + "/mapping", m), "mapping");
            CrmUser.ok(adminA().post(base + "/validate", null), "validate");
            CrmUser.ok(adminA().post(base + "/execute", null), "execute");
            String id = api.findRecord(LEADS, name, 120);
            if (id != null) api.track(LEADS, id);
            String own = id == null ? null : api.field(adminB(), LEADS, id, "owner");
            who = own == null ? "none" : own.equals(vid) ? "test user 2 (suspended)" : own.equals(supId) ? "Supervisor (fallback)" : own;
            note("A-17 lead " + id + " owner " + who);
        } finally {
            String r = userRowAction("test user 2", "(?i)(re-?activate|activate|unsuspend|restore|resume).*");
            note("A-17 reactivate: " + r);
            String st = userStatus(vid);
            note("A-17 status after reactivate: " + st);
            if (!"active".equals(st)) note("A-17 WARNING: test user 2 is NOT active again (" + st + ") - reactivate it by hand: Settings → Users → test user 2");
        }
        assertEquals(who, "Supervisor (fallback)", "a suspended member must be skipped, the fallback user gets the lead");
    }

    /** Read-only: the Users row menu (for deactivate) and the API client create form; closes everything with Escape / Cancel. */
    @Test(groups = {"crm-ui-probe"}, description = "Read-only: Users row actions and the API Integration create form")
    public void probeUsersAndApiClient() {
        LeadRecordPage page = new LeadRecordPage();
        page.openPath("/settings", "Setup Home");
        page.clickText("Users");
        qa.core.base.Waits.sleep(6000);
        note("users page: " + page.text().replaceAll("\\s+", " ").replaceAll(".*?(Users[^|]{0,1000}).*", "$1"));
        java.util.List<org.openqa.selenium.WebElement> acts = driver().findElements(org.openqa.selenium.By.xpath("//tr[.//*[contains(normalize-space(.),'test user 2')]]//button"));
        note("test user 2 row buttons: " + acts.size());
        if (!acts.isEmpty()) {
            acts.get(acts.size() - 1).click();
            qa.core.base.Waits.sleep(1500);
            StringBuilder items = new StringBuilder();
            for (org.openqa.selenium.WebElement e : driver().findElements(org.openqa.selenium.By.cssSelector("[role='menuitem'],[role='option']"))) if (e.isDisplayed()) items.append(" | ").append(e.getText().trim());
            note("test user 2 row menu:" + items);
            new org.openqa.selenium.interactions.Actions(driver()).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
        }
        page.openPath("/settings", "Setup Home");
        page.clickText("API Integration");
        qa.core.base.Waits.sleep(6000);
        for (org.openqa.selenium.WebElement l : driver().findElements(org.openqa.selenium.By.xpath("//a[contains(normalize-space(.),'API docs')]"))) note("api docs href: " + l.getAttribute("href"));
        page.clickText("Create integration");
        qa.core.base.Waits.sleep(2500);
        java.util.List<org.openqa.selenium.WebElement> dlg = driver().findElements(org.openqa.selenium.By.xpath("//*[@role='dialog']"));
        note("create integration form: " + (dlg.isEmpty() ? page.text().replaceAll("\\s+", " ") : dlg.get(0).getText().replace("\n", " | ")));
        new org.openqa.selenium.interactions.Actions(driver()).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
        note("api integration page: " + page.text().replaceAll("\\s+", " ").replaceAll(".*?(API Integration.{0,900}).*", "$1"));
    }

    /** Read-only evidence (22 Oct): Login History screenshots, unfiltered and with an "active" status filter if the page has one. */
    @Test(groups = {"crm-ui-probe"}, description = "Read-only: Login History screenshots for the active-sessions ticket")
    public void evidenceLoginHistory() throws Exception {
        String dir = System.getProperty("shotDir", "target/evidence/login-history");
        java.nio.file.Files.createDirectories(java.nio.file.Paths.get(dir));
        LeadRecordPage page = new LeadRecordPage();
        page.openPath("/settings", "Setup Home");
        page.clickText("Login History");
        qa.core.base.Waits.sleep(8000);
        driver().manage().window().setSize(new org.openqa.selenium.Dimension(1600, 1000));
        java.nio.file.Files.write(java.nio.file.Paths.get(dir, "login-history-all.png"), ((org.openqa.selenium.TakesScreenshot) driver()).getScreenshotAs(org.openqa.selenium.OutputType.BYTES));
        StringBuilder ctl = new StringBuilder();
        for (org.openqa.selenium.WebElement e : driver().findElements(org.openqa.selenium.By.xpath("//main//button|//main//select|//main//*[@role='combobox' or @role='tab']")))
            if (e.isDisplayed()) ctl.append(" | ").append(e.getTagName()).append(":").append(e.getText().trim().replace("\n", " ")).append(e.getAttribute("aria-label") == null ? "" : "[" + e.getAttribute("aria-label") + "]");
        note("login history controls:" + ctl);
        note("login history text: " + page.text().replaceAll("\s+", " ").replaceAll(".*?(Login History.{0,1500}).*", "$1"));
        // try an "Active" status filter: a select option, a tab, or a filter button
        boolean filtered = false;
        for (org.openqa.selenium.WebElement sel : driver().findElements(org.openqa.selenium.By.xpath("//main//select")))
            for (org.openqa.selenium.WebElement o : sel.findElements(org.openqa.selenium.By.tagName("option")))
                if (!filtered && o.getText().trim().matches("(?i)active.*")) { new org.openqa.selenium.support.ui.Select(sel).selectByVisibleText(o.getText().trim()); filtered = true; }
        if (!filtered) for (org.openqa.selenium.WebElement b : driver().findElements(org.openqa.selenium.By.xpath("//main//*[self::button or @role='tab'][normalize-space(.)='Active' or starts-with(normalize-space(.),'Active ')]")))
            if (!filtered && b.isDisplayed()) { b.click(); filtered = true; }
        if (!filtered) {
            driver().findElement(org.openqa.selenium.By.xpath("//main//button[normalize-space(.)='Any status']")).click();
            qa.core.base.Waits.sleep(1500);
            StringBuilder opts = new StringBuilder();
            for (org.openqa.selenium.WebElement o : driver().findElements(org.openqa.selenium.By.xpath("//*[@role='option' or @role='menuitem' or @role='menuitemradio' or @role='menuitemcheckbox']")))
                if (o.isDisplayed()) {
                    opts.append(" | ").append(o.getText().trim());
                    if (o.getText().trim().matches("(?i)active.*")) { o.click(); filtered = true; break; }
                }
            note("status options:" + opts);
        }
        qa.core.base.Waits.sleep(6000);
        note("active filter applied=" + filtered + "; text: " + page.text().replaceAll("\s+", " ").replaceAll(".*?(Login History.{0,1200}).*", "$1"));
        java.nio.file.Files.write(java.nio.file.Paths.get(dir, "login-history-active.png"), ((org.openqa.selenium.TakesScreenshot) driver()).getScreenshotAs(org.openqa.selenium.OutputType.BYTES));
    }

    // ---------------- read-only discovery ----------------

    /** Read-only: opens settings / work-queue screens and prints the API calls each page made (browser performance log). */
    @Test(groups = {"crm-ui-probe"}, description = "Read-only: API calls behind API Integration, Lead Conversion Mapping, Users, Work Queue")
    public void probeScreensApi() {
        LeadRecordPage page = new LeadRecordPage();
        for (String p : System.getProperty("screens", "API Integration|Users|Modules and Fields>Leads>Lead Conversion Mapping").split("[|]")) {
            page.openPath("/settings", "Setup Home");
            for (String step : p.split(">")) page.clickText(step);
            qa.core.base.Waits.sleep(12000);
            Object calls = ((org.openqa.selenium.JavascriptExecutor) driver()).executeScript(
                    "return [...new Set(performance.getEntriesByType('resource').map(e => e.name).filter(n => n.includes('/api/v1/') && !/notifications|unread|reminders|teamspace/.test(n)).map(n => n.split('/api/v1')[1]))].join(' | ');");
            note("screen " + p + " (url " + driver().getCurrentUrl().replace(CrmOrderFeature.BASE, "") + ") API: " + calls);
            note("screen " + p + " text: " + page.text().replaceAll("\\s+", " ").substring(0, Math.min(500, page.text().length())));
            ((org.openqa.selenium.JavascriptExecutor) driver()).executeScript("performance.clearResourceTimings();");
        }
    }

    // ---------------- leftovers ----------------

    /** One-off: lists (-Duisweep=list) or removes (-Duisweep=delete) every "QA AEO UI" process and lead left by earlier runs. */
    @Test(groups = {"crm-ui-sweep"}, description = "List or delete QA AEO UI leftovers (processes and leads)")
    @SuppressWarnings("unchecked")
    public void zzSweepLeftovers() {
        String mode = System.getProperty("uisweep", "");
        if (mode.isEmpty()) throw new SkipException("one-off: run with -Duisweep=list|delete");
        String root = CrmOrderFeature.QA + TAG + " ";
        for (Map<String, Object> row : CrmApi.newestRows(adminB(), LEADS, 3)) {
            String n = CrmApi.nameOf(row, LEADS);
            if (n == null || !n.startsWith(root)) continue;
            String id = String.valueOf(row.get("id"));
            note("lead " + id + " '" + n + "' approval=" + api.approvalState(LEADS, id) + " review=" + api.reviewStatus(LEADS, id));
            if (!"delete".equals(mode)) continue;
            if ("pending_approval".equals(api.approvalState(LEADS, id))) note("  reject approval -> " + api.reject(adminB(), LEADS, id).statusCode());
            if (CrmApi.reviewPending(api.reviewStatus(LEADS, id))) note("  reject review -> " + api.reviewReject(adminA(), api.reviewRequestId(LEADS, id)).statusCode());
            note("  delete -> " + adminB().delete("/modules/" + LEADS + "/records/" + id).statusCode());
        }
        sweepKinds(mode, root);
        sweepLayouts(mode);
    }

    @SuppressWarnings("unchecked")
    private void sweepKinds(String mode, String root) {
        for (String kind : List.of("assignment", "review", "workflow", "approval", "blueprint")) {
            String list = switch (kind) {
                case "assignment" -> "/workflow/assignment-rules";
                case "review" -> "/workflow/review-processes";
                case "workflow" -> "/workflow/rules";
                case "approval" -> "/workflow/approval-processes";
                default -> "/modules/" + LEADS + "/blueprints?includeInactive=true";
            };
            Response r = adminB().get(list);
            Object data = r.jsonPath().get("data");
            List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) r.jsonPath().getList("data.items");
            if (rows == null) continue;
            for (Object o : rows) {
                Map<String, Object> m = (Map<String, Object>) o;
                Object n = m.get("name");
                if (n == null && m.get("definition") instanceof Map) n = ((Map<String, Object>) m.get("definition")).get("name");
                if (n == null || !String.valueOf(n).startsWith(root)) continue;
                note(kind + " '" + n + "' " + m.get("id"));
                if ("delete".equals(mode)) safetyNet(kind, String.valueOf(n));
            }
        }
    }

    /** Leads layouts named "QA AEO Layout UI…" other than this run's own (left when a run is cut off). */
    @SuppressWarnings("unchecked")
    private void sweepLayouts(String mode) {
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/layouts"), "layouts").jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            String n = String.valueOf(m.get("name")), id = String.valueOf(m.get("id"));
            if (!n.startsWith("QA AEO Layout UI") || id.equals(layoutId)) continue;
            note("layout '" + n + "' " + id + ("delete".equals(mode) ? " delete -> " + CrmApi.deleteLayout(adminB(), LEADS, id).statusCode() : ""));
        }
    }

    // ---------------- safety net ----------------

    /** Deletes a process made on screen by its exact name if the test did not get to delete it. */
    @SuppressWarnings("unchecked")
    private void safetyNet(String kind, String name) {
        CrmUser a = adminB();
        String list = switch (kind) {
            case "assignment" -> "/workflow/assignment-rules";
            case "review" -> "/workflow/review-processes";
            case "workflow" -> "/workflow/rules";
            case "approval" -> "/workflow/approval-processes";
            default -> "/modules/" + LEADS + "/blueprints?includeInactive=true";
        };
        Response r = a.get(list);
        if (r.statusCode() / 100 != 2) {
            note("safety net: list " + list + " -> " + r.statusCode());
            return;
        }
        Object data = r.jsonPath().get("data");
        List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) r.jsonPath().getList("data.items");
        if (rows == null) return;
        for (Object o : rows) {
            Map<String, Object> m = (Map<String, Object>) o;
            Object n = m.get("name");
            if (n == null && m.get("definition") instanceof Map) n = ((Map<String, Object>) m.get("definition")).get("name");
            if (!name.equals(String.valueOf(n))) continue;
            String id = String.valueOf(m.get("id"));
            Response d;
            switch (kind) {
                case "assignment" -> { api.setAssignmentRuleActive(id, false); d = a.delete("/workflow/assignment-rules/" + id); }
                case "review" -> { api.setReviewActive(id, false, "reject_all"); d = a.delete("/workflow/review-processes/" + id); }
                case "workflow" -> { api.setWorkflowActive(id, false); d = a.delete("/workflow/rules/" + id); }
                case "approval" -> { api.setApprovalActive(id, false); d = a.delete("/workflow/approval-processes/" + id); }
                default -> { api.setBlueprintActive(LEADS, id, false); d = a.delete("/modules/" + LEADS + "/blueprints/" + id); }
            }
            note("safety net: deleted " + kind + " '" + name + "' " + id + " -> " + d.statusCode());
        }
    }
}
