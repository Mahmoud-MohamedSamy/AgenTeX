package qa.features.crmautomationorder.pages;

import qa.core.base.Waits;

/**
 * Settings → Automation → Workflow Rules: dialog (module, name → trigger) → editor → "Save & Activate" (the editor
 * has no plain Save: a new rule is always saved active; the list's Actions menu offers Activate / Deactivate).
 */
public class WorkflowRulesPage extends CrmSetupPage<WorkflowRulesPage> {

    @Override protected String path() { return "/settings/automation/workflow-rules"; }
    @Override protected String title() { return "Workflow Rules"; }

    /** On Create rule on Leads, only for names starting with {@code namePrefix}, one instant action: Field Update Comment. */
    public WorkflowRulesPage create(String name, String namePrefix, String description) {
        return create(name, namePrefix, null, description);
    }

    /** Same, with a second condition "Lead Owner is <ownerOption>" when ownerOption is not null. */
    public WorkflowRulesPage create(String name, String namePrefix, String ownerOption, String description) {
        button("New Rule");
        dialogButton("Select a module");
        option("Leads");
        fill("Rule Name", name);
        dialogButton("Next");
        click("triggerButton", "Create");
        Waits.sleep(500);
        click("dialogLastButton", "Create");
        Waits.urlContains(driver, "/workflow-rules/new", 30);
        isShown("conditionCard", 60); // the editor renders slowly on staging
        click("conditionCard");
        Waits.sleep(1000);
        click("radio", "Leads matching certain conditions");
        Waits.sleep(800);
        condition("Name", "starts with", namePrefix);
        if (ownerOption != null) {
            button("Add condition");
            userCondition("Lead Owner", "is", ownerOption);
        }
        button("Done");
        button("Add action");
        click("actionTile", "Field Update");
        Waits.sleep(1500);
        fieldUpdate("Comment", description);
        button("Save & Activate");
        reportIfStuck("/new");
        Waits.until(() -> !driver.getCurrentUrl().contains("/new"), 30);
        return this;
    }

    /** Inline Field Update card: Add field → pick the field → type the value. */
    private void fieldUpdate(String field, String value) {
        // the row appears only once the module fields have loaded: click again until it is there
        for (int i = 0; i < 4 && !isShown("fieldUpdateButton", 1) && !isShown("fieldUpdateSelect", 1); i++) {
            button("Add field");
            Waits.sleep(2000);
        }
        if (isShown("fieldUpdateSelect", 3)) {
            org.openqa.selenium.support.ui.Select sel = new org.openqa.selenium.support.ui.Select(el("fieldUpdateSelect"));
            StringBuilder offered = new StringBuilder();
            for (org.openqa.selenium.WebElement o : sel.getOptions()) offered.append(" | ").append(o.getText().trim());
            System.out.println("[crm-ui] field update fields:" + offered);
            sel.selectByVisibleText(field);
        } else {
            click("fieldUpdateButton");
            Waits.sleep(800);
            option(field);
        }
        Waits.sleep(800);
        type("fieldUpdateValue", value);
        Waits.sleep(500);
    }

    /** List → Actions → Activate / Deactivate. */
    public WorkflowRulesPage activate(String name, boolean on) {
        click("rowActions", name);
        if (isShown("menuItem", 3, on ? "Activate" : "Deactivate")) click("menuItem", on ? "Activate" : "Deactivate");
        else escape();
        Waits.sleep(2000);
        return this;
    }

    /** The row's text (name, module, trigger, mode, actions, status, updated). */
    public String rowText(String name) {
        return text("row", name);
    }

    public String openedName() {
        return text("ruleName");
    }

    public WorkflowRulesPage cancelEdit() {
        button("Cancel");
        leaveDraft();
        return this;
    }
}
