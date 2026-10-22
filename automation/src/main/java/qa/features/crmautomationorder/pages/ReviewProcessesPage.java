package qa.features.crmautomationorder.pages;

import qa.core.base.Waits;

/** Settings → Process Management → Review Process: dialog (name, module, layout) → editor page → Done. */
public class ReviewProcessesPage extends CrmSetupPage<ReviewProcessesPage> {

    @Override protected String path() { return "/settings/process-management/review-processes"; }
    @Override protected String title() { return "Review Processes"; }

    /** Creates a review process on Leads + {@code layout}; the Manual channel stays off, so only outside channels are held. */
    public ReviewProcessesPage create(String name, String layout, String fieldLabel, String reviewerOption) {
        button("Create New Process");
        fill("Process Name", name);
        openDropdown("dialogButton", "Choose Module");
        option("Leads");
        Waits.sleep(1500);
        openDropdown("dialogButton", "Choose Layout");
        option(layout);
        dialogButton("Next");
        Waits.urlContains(driver, "/review-processes/", 30);
        Waits.sleep(2500);
        if (fieldLabel != null) { // Field Set: the button shows the current choice ("Clear all fields") and opens a listbox of fields
            openDropdown("button", "Clear all fields");
            option(fieldLabel);
            escape();
        }
        button("Choose Reviewers");
        pickUser(reviewerOption);
        button("Done");
        reportIfStuck("/new");
        Waits.until(() -> !driver.getCurrentUrl().contains("/new"), 30);
        return this;
    }

    public String openedName() {
        return text("heading1");
    }

    public ReviewProcessesPage cancelEdit() {
        button("Cancel");
        leaveDraft();
        return this;
    }
}
