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

    /**
     * For API-driven tests: lands on a signed-in app page so the token cookie can be read, but tolerates the
     * staging host's slow / blank periods (waits up to ~90 s, reloads once) instead of failing the test.
     */
    public WorkflowRulesListPage openForApi() {
        open(DeskWorkflowRulesFeature.LIST_PATH);
        if (!isShown("newRuleButton", 45)) {
            driver.navigate().refresh();
            isShown("newRuleButton", 45);
        }
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

    /** Visible text of the page body (list, headers, empty states). */
    public String pageText() {
        return bodyText();
    }

    public WorkflowRulesListPage search(String text) {
        type("searchInput", text);
        qa.core.base.Waits.sleep(1500);
        return this;
    }

    /** Opens the ⋯ menu of a rule and returns the menu item labels. */
    public java.util.List<String> rowMenuItems(String ruleName) {
        click("rowMenuButton", ruleName);
        qa.core.base.Waits.sleep(800);
        return driver.findElements(org.openqa.selenium.By.cssSelector("[role='menuitem']")).stream()
                .map(e -> e.getText().trim()).filter(s -> !s.isEmpty()).toList();
    }

    /** Rendered height (px) of a rule's Name cell - NDC-2173: long names must not stack vertically. */
    public int nameCellHeight(String ruleName) {
        return el("nameCell", ruleName).getSize().getHeight();
    }

    /** Opens New Rule › Module and returns the modules offered (the wizard is then closed with Escape). */
    public java.util.List<String> wizardModules() {
        click("newRuleButton");
        click("wizardModuleSelect");
        qa.core.base.Waits.sleep(800);
        java.util.List<String> out = all("openOptions").stream().map(e -> e.getText().trim()).filter(s -> !s.isEmpty()).toList();
        press(org.openqa.selenium.Keys.ESCAPE);
        press(org.openqa.selenium.Keys.ESCAPE);
        return out;
    }

    /** Opens the new-ticket form through "Create in another module" › Ticket. */
    public TicketFormPage createTicket() {
        click("createInAnotherModule");
        click("createMenuItem", "Ticket");
        return new TicketFormPage().waitLoaded();
    }
}
