package qa.features.crmautomationorder.pages;

import qa.core.base.Waits;

/** Settings → Process Management → Approval Processes: one page (module, name, execute on) → rule (criteria, approver, admins) → Save. */
public class ApprovalProcessesPage extends CrmSetupPage<ApprovalProcessesPage> {

    @Override protected String path() { return "/settings/process-management/approval-processes"; }
    @Override protected String title() { return "Approval Processes"; }

    /** On Create process on Leads for names starting with {@code namePrefix}; level 1 approver and process admin = {@code userOption}. */
    public ApprovalProcessesPage create(String name, String namePrefix, String userOption) {
        button("Add Approval Process");
        Waits.urlContains(driver, "/approval-processes/new", 30);
        click("exactButton", "Module");
        option("Leads");
        fill("Name", name);
        button("Add Rule to this process");
        Waits.until(() -> !bodyText().contains("Loading fields…"), 90); // staging answers the field list slowly
        condition("Name", "starts with", namePrefix);
        expand("Who should approve");
        click("exactButton", "Select");
        chooseUser(userOption);
        expand("Process Admin Settings");
        button("Add Users");
        chooseUser(userOption);
        button("Save");
        reportIfStuck("/new");
        Waits.until(() -> !driver.getCurrentUrl().contains("/new"), 30);
        return this;
    }

    /** The editor shows the name in a text box on a new process and as the page heading once a rule is open. */
    /** Read-only: a new process on Leads → Add Rule → the criteria field list; leaves without saving. */
    public java.util.List<String> criteriaFields() {
        button("Add Approval Process");
        Waits.urlContains(driver, "/approval-processes/new", 30);
        click("exactButton", "Module");
        option("Leads");
        fill("Name", "QA AEO UI K-09 probe (not saved)");
        button("Add Rule to this process");
        Waits.until(() -> !bodyText().contains("Loading fields…"), 90);
        if (!isShown("emptyFieldPicker", 3)) button("Add condition");
        all("emptyFieldPicker").get(0).click();
        Waits.sleep(1500);
        java.util.List<String> out = new java.util.ArrayList<>();
        for (org.openqa.selenium.WebElement o : driver.findElements(org.openqa.selenium.By.cssSelector("[role='option']")))
            if (o.isDisplayed()) out.add(o.getText().trim().replace('\n', ' '));
        escape();
        button("Cancel");
        leaveDraft();
        return out;
    }

    public String openedName() {
        Waits.until(() -> !bodyText().contains("Loading"), 30);
        return isShown("textbox", 5, "Name") ? value("textbox", "Name") : text("heading1");
    }

    public ApprovalProcessesPage cancelEdit() {
        button("Cancel");
        leaveDraft();
        return this;
    }
}
