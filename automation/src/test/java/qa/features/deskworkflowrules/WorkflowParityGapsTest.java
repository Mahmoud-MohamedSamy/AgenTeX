package qa.features.deskworkflowrules;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.core.data.TestData;
import qa.features.deskworkflowrules.pages.RuleEditorPage;

import java.util.List;

import static org.testng.Assert.assertTrue;

/**
 * NDC-2203 "Workflow missings" — Zoho Desk parity (missing list items 1–7, 14–22).
 * These assert Zoho's behaviour, so they FAIL while the gap is open and pass once it is built.
 */
public class WorkflowParityGapsTest extends BaseTest {
    private final TestData data = TestData.of(DeskWorkflowRulesFeature.NAME);

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Zoho-only triggers (Customer Reply, Agent Response, Private Thread, Happiness Rating, Comment) are offered")
    @CaseId("WFR-Z01")
    @ZohoRef(value = "zoho/execute-on.png", note = "Zoho Execute On: Create, Edit, Delete, Field Update, Customer Reply, Agent Response, Private Thread, Happiness Rating, Comment…")
    public void zohoTriggersOffered() {
        String panel = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openWhen().triggerPanelText();
        SoftAssert soft = new SoftAssert();
        for (String t : data.list("zohoOnlyTriggers")) soft.assertTrue(panel.contains(t), "trigger '" + t + "' missing");
        soft.assertAll();
    }

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Field Changed can watch several fields (Zoho: Field Update on several fields, Any/All)")
    @CaseId("WFR-Z06")
    @ZohoRef(value = "zoho/field-update-any-all.png", note = "Zoho: Field Update trigger takes several fields with Any / All")
    public void watchFieldTakesSeveralFields() {
        RuleEditorPage editor = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openWhen().chooseTrigger("Field Changed");
        assertTrue(editor.watchFieldAllowsSeveral(), "Watch field is single-select");
    }

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Zoho-only ticket actions (Add Comment, Send Email Reply, Add Followers, Mark as Spam, Share Ticket, Change Layout) are offered")
    @CaseId("WFR-Z14")
    @ZohoRef(value = "zoho/actions-menu.png", note = "Zoho actions menu for ticket workflows")
    public void zohoActionsOffered() {
        List<String> offered = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openActionPicker().actionTypesOffered();
        SoftAssert soft = new SoftAssert();
        for (String a : data.list("zohoOnlyActions")) soft.assertTrue(offered.contains(a), "action '" + a + "' missing; offered " + offered);
        soft.assertAll();
    }
}
