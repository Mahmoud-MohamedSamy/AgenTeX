package qa.features.deskworkflowrules.pages;

import qa.core.base.BasePage;
import qa.features.deskworkflowrules.DeskWorkflowRulesFeature;

/**
 * Setup › Automation › Workflow Rules list.
 * Element keys live in src/test/resources/features/deskworkflowrules/locators.json under "WorkflowRulesListPage".
 */
public class WorkflowRulesListPage extends BasePage {

    public WorkflowRulesListPage() {
        super(DeskWorkflowRulesFeature.NAME);
    }

    public WorkflowRulesListPage open() {
        open(DeskWorkflowRulesFeature.LIST_PATH);
        el("newRuleButton"); // the host has slow periods: wait for the header, not a fixed sleep
        return this;
    }

    public boolean headingShown() {
        return isShown("heading", 30);
    }

    public boolean newRuleEnabled() {
        return el("newRuleButton").isEnabled();
    }

    public boolean ruleListed(String name) {
        return isShown("ruleRow", 10, name);
    }

    /** Opens the new-ticket form through "Create in another module" › Ticket. */
    public TicketFormPage createTicket() {
        click("createInAnotherModule");
        click("createMenuItem", "Ticket");
        return new TicketFormPage().waitLoaded();
    }
}
