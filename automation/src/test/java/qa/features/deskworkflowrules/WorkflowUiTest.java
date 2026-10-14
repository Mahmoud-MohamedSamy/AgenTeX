package qa.features.deskworkflowrules;

import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.features.deskworkflowrules.pages.ActionsLibraryPage;
import qa.features.deskworkflowrules.pages.ExecutionHistoryPage;
import qa.features.deskworkflowrules.pages.RuleEditorPage;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;
import qa.core.base.BaseTest;

import java.util.ArrayList;
import java.util.List;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

/**
 * Spec groups B, C, D, E, F, G, K, M — UI / UX rows: what the pages show and refuse, with nothing saved by the UI.
 * Rules needed as fixtures are created INACTIVE through the API and deleted after each test.
 * Run: mvnw test -Dtest=WorkflowUiTest
 */
public class WorkflowUiTest extends BaseTest {
    private static final List<String> INSTANT = List.of("Field Update", "Owner Assignment", "Webhook", "Email", "Task",
            "Create Record", "Add Tags", "Remove Tags", "Send happiness email");
    private static final List<String> SCHEDULED = List.of("Webhook", "Email", "Task", "Create Record", "Send happiness email");
    private final List<String> fixtures = new ArrayList<>();

    @AfterMethod(alwaysRun = true)
    public void cleanUp() {
        if (fixtures.isEmpty()) return;
        try {
            DeskWorkflowRulesApi api = new DeskWorkflowRulesApi();
            for (String id : fixtures) api.deleteRule(id);
        } catch (RuntimeException e) {
            System.err.println("[cleanup] " + e.getMessage());
        }
        fixtures.clear();
    }

    /** Inactive QA rule created through the API (fixture for list / editor checks). */
    private String fixture(Rules r) {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String id = api.createRuleOk(r.inactive().build());
        fixtures.add(id);
        return id;
    }

    private static List<String> missing(List<String> expected, List<String> got) {
        return expected.stream().filter(x -> got.stream().noneMatch(g -> g.equalsIgnoreCase(x))).toList();
    }

    // ---------------- B: list ----------------

    @Test(groups = {"regression", "ui"}, description = "List shows title, subtitle and the 7 columns")
    @CaseId("WFR-B1")
    public void listColumns() {
        String t = new WorkflowRulesListPage().open().pageText();
        for (String s : List.of("Workflow Rules", "Automate field updates, owner assignment, webhooks, emails, tasks, and record creation",
                "Name", "Module", "Trigger", "Mode", "Actions", "Status", "Updated"))
            assertTrue(t.contains(s), "list page lacks '" + s + "'");
    }

    @Test(groups = {"regression", "ui"}, description = "Search filters by name (case-insensitive) and shows the filtered empty state")
    @CaseId("WFR-B3")
    public void searchFilters() {
        fixture(Rules.named("UI B3 search target").onEdit().fieldUpdate("description", "x"));
        WorkflowRulesListPage list = new WorkflowRulesListPage().open().search("ui b3 SEARCH");
        assertTrue(list.ruleListed("QA WF UI B3 search target"), "search (other case) did not find the rule");
        String t = new WorkflowRulesListPage().open().search("zz-no-such-rule-zz").pageText();
        assertTrue(t.contains("No matching rules"), "filtered empty state not shown: " + t.substring(0, Math.min(400, t.length())));
    }

    @Test(groups = {"regression", "ui", "NDC-2173"}, description = "A long rule name does not break into a tall vertical stack")
    @CaseId("WFR-B6")
    public void longNameCellStaysShort() {
        String name = "QA WF UI B6 " + "Averyveryverylongrulenamewithoutanyspaces".repeat(3);
        fixture(Rules.named(name).onEdit().fieldUpdate("description", "x"));
        int h = new WorkflowRulesListPage().open().search("UI B6").nameCellHeight(name);
        assertTrue(h <= 90, "NDC-2173: Name cell is " + h + " px tall for a " + name.length() + "-char name (expected one or two lines with an ellipsis)");
    }

    @Test(groups = {"regression", "ui"}, description = "Row menu: Edit, Activate, Test rule, Delete")
    @CaseId("WFR-B7")
    public void rowMenu() {
        fixture(Rules.named("UI B7 row menu").onEdit().fieldUpdate("description", "x"));
        List<String> items = new WorkflowRulesListPage().open().search("UI B7").rowMenuItems("QA WF UI B7 row menu");
        List<String> miss = missing(List.of("Edit", "Activate", "Test rule", "Delete"), items);
        assertTrue(miss.isEmpty(), "row menu lacks " + miss + "; has " + items);
    }

    // ---------------- C: wizard ----------------

    @Test(groups = {"regression", "ui"}, description = "New Rule › Module offers the 8 modules")
    @CaseId("WFR-C2")
    public void wizardModules() {
        List<String> mods = new WorkflowRulesListPage().open().wizardModules();
        List<String> miss = missing(List.of("Tickets", "Contacts", "Accounts", "Products", "Calls", "Events", "Tasks", "Contracts"), mods);
        assertTrue(miss.isEmpty(), "modules missing " + miss + "; offered " + mods);
    }

    // ---------------- D / F / G: editor validation ----------------

    @Test(groups = {"regression", "ui"}, description = "Saving an empty rule lists what to fix, including 'Add at least one action.'")
    @CaseId({"WFR-G3", "WFR-F5"})
    public void emptyRuleValidation() {
        String t = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).clickSave();
        assertTrue(t.contains("Fix these before saving"), "no validation list on Save: " + t.substring(0, Math.min(600, t.length())));
        assertTrue(t.contains("Add at least one action."), "missing 'Add at least one action.'");
    }

    @Test(groups = {"regression", "ui"}, description = "Field Changed without a watch field cannot be saved")
    @CaseId("WFR-D2")
    public void fieldChangedNeedsField() {
        String t = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID)
                .openWhen().chooseTrigger("Field Changed").done().clickSave();
        // Since 14 Oct 2026 the editor pre-selects a watch field (e.g. "Subject"), so an empty watch field cannot happen;
        // either way the rule must never be saved without one.
        boolean preselected = java.util.regex.Pattern.compile("executed when \"[^\"]+\" changes").matcher(t).find();
        assertTrue(t.contains("Pick the field to watch.") || preselected,
                "Field Changed rule had neither a watch field nor the 'Pick the field to watch.' message: " + t);
    }

    // ---------------- E: conditions ----------------

    @Test(groups = {"regression", "ui"}, description = "Condition field list offers the ticket fields incl. Department and Tags")
    @CaseId("WFR-E2")
    public void conditionFieldList() {
        List<String> f = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).conditionFieldsOffered();
        System.out.println("[E2] condition fields (" + f.size() + "): " + f);
        List<String> miss = missing(List.of("Subject", "Status", "Priority", "Department", "Ticket Owner", "Tags"), f);
        assertTrue(miss.isEmpty(), "condition fields missing " + miss + "; offered " + f);
    }

    // ---------------- F: action pickers ----------------

    @Test(groups = {"regression", "ui"}, description = "Instant action picker offers the 9 action types")
    @CaseId("WFR-F1")
    public void instantPicker() {
        List<String> got = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openActionPicker().actionTypesOffered();
        List<String> miss = missing(INSTANT, got);
        assertTrue(miss.isEmpty(), "instant picker lacks " + miss + "; offers " + got);
    }

    @Test(groups = {"regression", "ui"}, description = "Scheduled picker offers only Webhook, Email, Task, Create Record, Send happiness email")
    @CaseId("WFR-F2")
    public void scheduledPicker() {
        List<String> got = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openScheduledPicker().actionTypesOffered();
        List<String> miss = missing(SCHEDULED, got);
        assertTrue(miss.isEmpty(), "scheduled picker lacks " + miss + "; offers " + got);
        for (String no : List.of("Field Update", "Owner Assignment", "Add Tags", "Remove Tags"))
            assertFalse(got.stream().anyMatch(g -> g.equalsIgnoreCase(no)), "scheduled picker offers '" + no + "': " + got);
    }

    @Test(groups = {"regression", "ui"}, description = "Action types the rule already uses are not offered again (each type once per rule)")
    @CaseId("WFR-F3")
    public void usedTypesNotOfferedAgain() {
        String id = fixture(Rules.named("UI F3 used types").onEdit().fieldUpdate("description", "x")
                .addTags("append", "00000000-0000-0000-0000-000000000000").task("QA WF t", 1, "Not Started", "normal"));
        List<String> got = new RuleEditorPage().openRule(id).openActionPicker().actionTypesOffered();
        List<String> offeredAgain = List.of("Field Update", "Add Tags", "Task").stream()
                .filter(x -> got.stream().anyMatch(g -> g.equalsIgnoreCase(x))).toList();
        assertTrue(offeredAgain.isEmpty(), "possible bug: picker still offers types the rule already has: " + offeredAgain + " (offers " + got + ")");
    }

    // ---------------- K: saved actions library ----------------

    @Test(groups = {"regression", "ui"}, description = "Actions library: type tabs, filters and columns")
    @CaseId("WFR-K1")
    public void actionsLibrary() {
        String t = new ActionsLibraryPage().open().pageText();
        for (String s : List.of("Reusable actions your Workflow Rules can share", "All", "Email", "Task", "Field Update", "Webhook", "Owner",
                "Create Record", "Add Tags", "Remove Tags", "All modules", "All statuses"))
            assertTrue(t.contains(s), "Actions page lacks '" + s + "'");
    }

    @Test(groups = {"regression", "ui"}, description = "New saved action offers every action type a rule can use (incl. Send happiness email)")
    @CaseId("WFR-K2")
    public void newSavedActionTypes() {
        String t = new ActionsLibraryPage().open().newActionDialogText();
        List<String> miss = INSTANT.stream().filter(x -> !t.contains(x)).toList();
        assertTrue(miss.isEmpty(), "possible bug: New Action cannot create " + miss + " although rules can use them inline. Dialog: " + t);
    }

    // ---------------- M: execution history ----------------

    @Test(groups = {"regression", "ui"}, description = "Execution History can be reached from the Setup menu or the rules list")
    @CaseId("WFR-M1")
    public void executionHistoryReachable() {
        String t = new WorkflowRulesListPage().open().pageText();
        assertTrue(t.contains("Execution History") || t.contains("Execution history"),
                "possible bug: no link to Execution History in the Setup menu or on the rules list (only /settings/workflow-executions by URL)");
    }

    @Test(groups = {"regression", "ui"}, description = "Execution History page: title, filters and columns")
    @CaseId("WFR-M2")
    public void executionHistoryColumns() {
        new ExecutionHistoryPage().open();
        String t = "";
        for (int i = 0; i < 15 && !t.contains("Execution History"); i++) { // renders a few seconds after load (blank before)
            qa.core.base.Waits.sleep(2000);
            t = driver().findElement(org.openqa.selenium.By.tagName("body")).getText();
        }
        for (String s : List.of("Execution History", "Every workflow and assignment-rule evaluation", "When", "Rule", "Module", "Record",
                "Trigger", "Outcome", "Actions run"))
            assertTrue(t.contains(s), "Execution History lacks '" + s + "'");
    }
}
