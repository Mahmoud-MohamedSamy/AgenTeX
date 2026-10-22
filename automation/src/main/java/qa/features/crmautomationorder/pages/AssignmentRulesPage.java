package qa.features.crmautomationorder.pages;

import qa.core.base.Waits;

/** Settings → Automation → Assignment Rules: dialog (module, name) → editor page (channels, rule entries, fallback) → Save. */
public class AssignmentRulesPage extends CrmSetupPage<AssignmentRulesPage> {

    @Override protected String path() { return "/settings/automation/assignment-rules"; }
    @Override protected String title() { return "Assignment Rules"; }

    /**
     * Creates a rule on Leads whose only channel is Web Form (API and Import unticked so teammates' API/import leads
     * are never routed by it) with one entry: names starting with {@code namePrefix} → {@code userOption}.
     */
    public AssignmentRulesPage create(String name, String namePrefix, String userOption) {
        button("Create Assignment Rule");
        dialogButton("Select a module");
        option("Leads");
        fill("Rule Name", name);
        dialogButton("Next");
        Waits.urlContains(driver, "/assignment-rules/new", 30);
        el("heading", name);
        setChecked("API", false);
        setChecked("Import", false);
        setChecked("Web Form", true);
        button("Create Rule Entry");
        click("radio", "Records matching certain conditions");
        Waits.sleep(800);
        condition("Name", "starts with", namePrefix);
        button("Select Users");
        option(userOption);
        escape();
        button("Save Rule Entry");
        button("Save");
        reportIfStuck("/new");
        Waits.until(() -> !driver.getCurrentUrl().contains("/new"), 30);
        return this;
    }

    private void setChecked(String label, boolean on) {
        if (el("checkbox", label).isSelected() != on) click("checkbox", label);
    }

    /** After Edit: the editor shows the rule name in its name box. */
    public String openedName() {
        return value("textbox", "Rule Name");
    }

    public AssignmentRulesPage cancelEdit() {
        button("Cancel");
        leaveDraft();
        return this;
    }
}
