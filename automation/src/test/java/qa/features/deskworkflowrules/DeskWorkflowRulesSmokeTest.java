package qa.features.deskworkflowrules;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.core.data.TestData;
import qa.features.deskworkflowrules.pages.RuleEditorPage;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import static org.testng.Assert.assertTrue;

/** Desk Workflow Rules — does the feature open and offer what TAVI already ships. */
public class DeskWorkflowRulesSmokeTest extends BaseTest {
    private final TestData data = TestData.of(DeskWorkflowRulesFeature.NAME);

    @Test(groups = {"smoke", "regression"}, description = "Rules list opens with its title and an enabled New Rule button")
    @CaseId("WFR-001")
    @ZohoRef(value = "zoho/rules-list.png", note = "Zoho: Workflow Rules list with department picker and Active/Inactive tabs")
    public void rulesListOpens() {
        WorkflowRulesListPage list = new WorkflowRulesListPage().open();
        assertTrue(list.headingShown(), "Workflow Rules title");
        assertTrue(list.newRuleEnabled(), "New Rule enabled");
    }

    @Test(groups = {"smoke", "regression"}, description = "The WHEN panel offers the record-action triggers TAVI ships")
    @CaseId("WFR-002")
    public void editorOffersRecordTriggers() {
        String panel = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openWhen().triggerPanelText();
        for (String t : data.list("recordTriggers")) {
            assertTrue(panel.contains(t), "trigger '" + t + "' offered; panel: " + panel);
        }
    }
}
