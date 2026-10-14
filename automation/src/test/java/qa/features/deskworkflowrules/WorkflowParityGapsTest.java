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

    @Test(groups = {"regression", "parity"}, description = "Rules belong to a department: the list has a department picker (Z8)")
    @CaseId("WFR-Z08")
    @ZohoRef(value = "zoho/rules-list.png", note = "Zoho: department picker next to the Workflow Rules title")
    public void departmentPicker() {
        String t = new qa.features.deskworkflowrules.pages.WorkflowRulesListPage().open().pageText();
        assertTrue(t.contains("All departments") || t.contains("Department"), "no department picker on the rules list");
    }

    @Test(groups = {"regression", "parity"}, description = "Active / Inactive tabs or filter on the rules list (Z9)")
    @CaseId("WFR-Z09")
    @ZohoRef(value = "zoho/rules-list.png", note = "Zoho: ACTIVE / INACTIVE tabs")
    public void activeInactiveTabs() {
        String t = new qa.features.deskworkflowrules.pages.WorkflowRulesListPage().open().pageText();
        assertTrue(t.contains("Active") && t.contains("Inactive"), "no Active / Inactive tabs or status filter on the rules list");
    }

    @Test(groups = {"regression", "parity"}, description = "Conditions offer contact / account fields, Execution Time and the missing ticket fields (Z10–Z12)")
    @CaseId({"WFR-Z10", "WFR-Z11", "WFR-Z12"})
    @ZohoRef(value = "zoho/criteria-groups.png", note = "Zoho criteria: TICKETS / CONTACTS / ACCOUNTS groups, Execution Time")
    public void conditionFieldsLikeZoho() {
        List<String> f = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).conditionFieldsOffered();
        SoftAssert soft = new SoftAssert();
        soft.assertTrue(f.stream().anyMatch(x -> x.startsWith("Contact ") || x.contains("Contact Type") || x.contains("Contact Owner")),
                "Z10: no contact fields (only the Contact lookup); offered " + f);
        soft.assertTrue(f.stream().anyMatch(x -> x.contains("Account Owner") || x.startsWith("Account ")), "Z10: no account fields; offered " + f);
        soft.assertTrue(f.stream().anyMatch(x -> x.contains("Execution Time") || x.contains("Business hours")), "Z11: no business-hours condition; offered " + f);
        for (String z : List.of("Happiness Rating", "Team", "Created Time", "Closed Time", "SLA Violated", "Ticket Number"))
            soft.assertTrue(f.contains(z), "Z12: ticket field '" + z + "' not offered in conditions");
        soft.assertAll();
    }

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Email action can notify the contact / outside addresses (Z16)")
    @CaseId("WFR-Z16")
    public void emailToContactAndOutsideAddresses() {
        String t = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).addAction("Email").pageText();
        assertTrue(!t.contains("Free-text addresses aren't allowed"), "Email recipients are internal only: \"Free-text addresses aren't allowed.\"");
    }

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Owner Assignment can assign to a team (Z17)")
    @CaseId("WFR-Z17")
    @ZohoRef(value = "zoho/actions-menu.png", note = "Zoho: Assign Ticket action (Agent / Team / Agent in a Team)")
    public void ownerToTeam() {
        String t = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).addAction("Owner Assignment").pageText();
        int i = t.indexOf("ASSIGN OWNER TO");
        String seg = i < 0 ? t : t.substring(i, Math.min(t.length(), i + 120));
        assertTrue(seg.contains("Team"), "Owner Assignment offers no team option: " + seg.replace('\n', ' '));
    }

    @Test(groups = {"regression", "parity", "NDC-2203"}, description = "Custom Functions, chat notifications, instant messaging, skills and AI actions are offered (Z23–Z27)")
    @CaseId({"WFR-Z23", "WFR-Z24", "WFR-Z25", "WFR-Z26", "WFR-Z27"})
    @ZohoRef(value = "zoho/actions-menu.png", note = "Zoho actions menu (Custom Functions, Send Cliq Notification, IM, Skills)")
    public void moreZohoActionsOffered() {
        List<String> offered = new RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).openActionPicker().actionTypesOffered();
        SoftAssert soft = new SoftAssert();
        for (String a : List.of("Custom Function", "Send Cliq Notification", "Reply via Instant Messaging", "Notify via Instant Messaging",
                "Add Skills", "Remove Skills", "Recalculate Skills", "Reassign ticket based on Skills"))
            soft.assertTrue(offered.stream().anyMatch(o -> o.toLowerCase().startsWith(a.toLowerCase())), "action '" + a + "' missing; offered " + offered);
        soft.assertAll();
    }
}
