package qa.features.deskworkflowrules.pages;

import org.openqa.selenium.Keys;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskworkflowrules.DeskWorkflowRulesFeature;

/**
 * New-ticket form, reached from the rules list ("Create in another module" › Ticket).
 * Used here only to fire workflow rules; a tickets feature would own the full form.
 */
public class TicketFormPage extends BasePage {

    public TicketFormPage() {
        super(DeskWorkflowRulesFeature.NAME);
    }

    public TicketFormPage waitLoaded() {
        el("contactEmail");
        return this;
    }

    /** Fills the minimum ticket and saves. Status/Priority are the 2nd "Select" pick list each time it is set. */
    public String create(String email, String subject, String description, String status, String priority) {
        type("contactEmail", email);
        type("subject", subject);
        press(Keys.ESCAPE);
        type("description", description);
        press(Keys.ESCAPE);
        if (status != null) {
            click("selectButton", 2);
            click("option", status);
        }
        if (priority != null) {
            click("selectButton", 2);
            click("option", priority);
            press(Keys.ESCAPE);
        }
        String before = driver.getCurrentUrl();
        click("saveButton");
        Waits.until(() -> !driver.getCurrentUrl().equals(before), 20);
        return driver.getCurrentUrl();
    }
}
