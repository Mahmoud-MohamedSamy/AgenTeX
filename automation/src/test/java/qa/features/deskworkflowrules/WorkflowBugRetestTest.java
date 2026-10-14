package qa.features.deskworkflowrules;

import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.core.data.TestData;
import qa.features.deskworkflowrules.pages.RuleEditorPage;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertNotEquals;
import static org.testng.Assert.assertTrue;

/**
 * Bug retests. Each test asserts the CORRECT behaviour, so it fails while the bug is open.
 * Rerun one bug: mvnw test -Dtags=NDC-2205
 */
public class WorkflowBugRetestTest extends BaseTest {
    private final TestData data = TestData.of(DeskWorkflowRulesFeature.NAME);
    private final List<String> createdRules = new ArrayList<>();

    @Test(groups = {"regression", "NDC-2204"}, description = "Owner Assignment › Roles lists Desk roles, not CRM profiles")
    @CaseId("WFR-031")
    public void ownerAssignmentRolesAreDeskRoles() {
        List<String> roles = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID)
                .addAction("Owner Assignment").ownerAssignmentRoles();
        for (String crm : data.list("crmOnlyProfiles")) assertFalse(roles.contains(crm), "CRM profile '" + crm + "' offered; roles: " + roles);
        for (String desk : data.list("deskRoles")) assertTrue(roles.contains(desk), "Desk role '" + desk + "' missing; roles: " + roles);
    }

    // Not in regression since 14 Oct 2026: uses the old UI ticket form (unstable); WFR-H3 covers the same check through the API.
    @Test(groups = {"NDC-2205"}, description = "An On Edit rule does not fire when a ticket is created")
    @CaseId("WFR-012")
    public void onEditRuleDoesNotFireOnCreate() {
        assertRuleDoesNotFireOnCreate("2205 On Edit", "Edit", null, "onEditMarker");
    }

    // Not in regression since 14 Oct 2026: shares the old UI ticket form with WFR-012; WFR-H4 covers it through the API.
    @Test(groups = {"NDC-2205"}, description = "A Field Changed (Watch field = Subject) rule does not fire when a ticket is created")
    @CaseId("WFR-013")
    public void fieldChangedRuleDoesNotFireOnCreate() {
        assertRuleDoesNotFireOnCreate("2205 Field Changed", "Field Changed", data.text("fieldChangedMarker.watchField"), "fieldChangedMarker");
    }

    /**
     * NDC-2205 check, shared by the On Edit and Field Changed cases.
     * 1. API pre-check (no token = no result read and no cleanup, so skip before creating anything).
     * 2. Control rule "On Create" (Description = unique marker): proves the engine ran for this ticket.
     * 3. Rule under test (trigger + optional watch field) sets a marker field.
     * 4. Create a matching ticket through the UI, wait for the control, then the marker must NOT be set.
     */
    private void assertRuleDoesNotFireOnCreate(String label, String trigger, String watchField, String markerKey) {
        new WorkflowRulesListPage().open(); // signed-in page on the app origin, so the token can be read
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();

        String controlField = data.text("controlMarker.field");
        String controlValue = data.text("controlMarker.valuePrefix") + System.currentTimeMillis() % 1_000_000;
        createFieldUpdateRule(label + " control On Create", "Create", null, controlField, controlValue);

        String field = data.text(markerKey + ".field"), marker = data.text(markerKey + ".value");
        String rule = createFieldUpdateRule(label, trigger, watchField, field, marker);

        String url = new WorkflowRulesListPage().open().createTicket()
                .create(data.text("ticket.email"), data.uniqueName("retest NDC-2205"), "original description",
                        data.text("ticket.status"), data.text("ticket.priority"));
        String ticketId = lastUuid(url);
        assertTrue(ticketId != null, "ticket created, url " + url);

        // Rules run asynchronously: poll (gently - the API is shared) until the control rule has run.
        Map<String, String> rec = null;
        long end = System.currentTimeMillis() + 45_000;
        while (System.currentTimeMillis() < end) {
            rec = api.record(DeskWorkflowRulesFeature.TICKETS_MODULE_ID, ticketId);
            if (controlValue.equals(rec.get(controlField.toLowerCase()))) break;
            Waits.sleep(3000);
        }
        if (rec == null || !controlValue.equals(rec.get(controlField.toLowerCase())))
            throw new SkipException("Inconclusive: the On Create control rule did not run within 45 s on ticket " + ticketId
                    + " (" + controlField + "=" + (rec == null ? null : rec.get(controlField.toLowerCase())) + ")");
        Waits.sleep(5000); // give the rule under test the same chance to run after the control

        rec = api.record(DeskWorkflowRulesFeature.TICKETS_MODULE_ID, ticketId);
        String executions = api.executionsText(ticketId);
        assertNotEquals(rec.get(field.toLowerCase()), marker,
                "NDC-2205: '" + rule + "' (" + trigger + (watchField == null ? "" : ", watch " + watchField) + ") ran on create - "
                        + field + " was set to " + marker + " on ticket " + ticketId + ". Execution History: "
                        + executions.substring(0, Math.min(executions.length(), 1500)));
    }

    /** Builds and saves an active rule on Tickets: trigger, Priority is one of high/urgent, Field Update field=value. */
    private String createFieldUpdateRule(String label, String trigger, String watchField, String field, String value) {
        String rule = data.uniqueName(label);
        RuleEditorPage editor = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID)
                .setLayout(data.text("layout")).setName(rule)
                .openWhen().chooseTrigger(trigger);
        if (watchField != null) editor.watchField(watchField);
        editor.done()
                .addPickListCondition("Priority", "is one of", "high", "urgent")
                .addAction("Field Update").fieldUpdate(field, value);
        String toast = editor.saveAndActivate();
        createdRules.add(rule);
        assertFalse(toast.toLowerCase().contains("error"), "rule '" + rule + "' saved; toast: " + toast);
        return rule;
    }

    @Test(groups = {"regression", "NDC-2206"}, description = "A Date-Time rule (Recurring, Priority = urgent, Field Update) can be saved")
    @CaseId("WFR-020")
    public void dateTimeRuleCanBeSaved() {
        new WorkflowRulesListPage().open();
        new DeskWorkflowRulesApi().requireAuth(); // cleanup needs the API; skip rather than leave an active rule behind
        String rule = data.uniqueName("2206 Date-Time");
        RuleEditorPage editor = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID)
                .setLayout(data.text("layout")).setName(rule)
                .openWhen().chooseDateTimeTrigger().dateField("Due Date").done()
                .addPickListCondition("Priority", "is one of", "urgent")
                .addAction("Task").taskTitle("QA WF date-time task"); // Date-Time rules offer only async actions
        String toast = editor.saveAndActivate();
        createdRules.add(rule);
        assertFalse(toast.toLowerCase().contains("unexpected error"), "save failed with: " + toast);
        // since 14 Oct 2026 a successful save returns to the rules list instead of the rule's page, so check the rule exists
        boolean onRulePage = Pattern.compile("/workflow-rules/[0-9a-f-]{36}").matcher(editor.currentUrl()).find();
        assertTrue(onRulePage || !new DeskWorkflowRulesApi().ruleIdsNamed(rule).isEmpty(),
                "Date-Time rule was not saved; url " + editor.currentUrl() + ", toast " + toast);
    }

    /** Leave nothing active behind: deactivate the QA rules this class created (teammates' rules are never touched). */
    @AfterMethod(alwaysRun = true)
    public void deactivateCreatedRules() {
        if (createdRules.isEmpty()) return;
        try {
            DeskWorkflowRulesApi api = new DeskWorkflowRulesApi();
            for (String name : createdRules) {
                List<String> ids = api.ruleIdsNamed(name);
                if (ids.isEmpty()) System.err.println("[cleanup] rule not found by name (check it in the UI): " + name);
                for (String id : ids) assertEquals(api.deactivate(id).statusCode() / 100, 2, "deactivate " + name);
            }
        } catch (Throwable t) {
            System.err.println("[cleanup] could not deactivate " + createdRules + ": " + t.getMessage());
        } finally {
            createdRules.clear();
        }
    }

    private static String lastUuid(String s) {
        Matcher m = Pattern.compile("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}").matcher(s);
        String last = null;
        while (m.find()) last = m.group();
        return last;
    }
}
