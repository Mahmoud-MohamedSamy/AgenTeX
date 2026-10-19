package qa.features.crmdeskintegration.pages;

import org.openqa.selenium.Keys;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmdeskintegration.CrmDeskFeature;

/** Desk ticket, Desk contact and the ticket list: the CRM pane, badges and the Layout (work mode) picker. Read-only. */
public class DeskRecordPage extends BasePage {

    public DeskRecordPage() {
        super(CrmDeskFeature.NAME);
    }

    public DeskRecordPage openTicket(String ticketId) {
        open(CrmDeskFeature.DESK + "/views/all/tickets/" + ticketId);
        Waits.bodyContains(driver, "#", 60);
        Waits.sleep(3000);
        return this;
    }

    public DeskRecordPage openContact(String contactId) {
        open(CrmDeskFeature.DESK + "/modules/" + CrmDeskFeature.DESK_CONTACTS + "/customers/" + contactId);
        Waits.bodyContains(driver, "Overview", 60);
        Waits.sleep(3000);
        return this;
    }

    public DeskRecordPage openTicketList() {
        open(CrmDeskFeature.DESK + "/views/all/tickets");
        Waits.bodyContains(driver, "#", 60);
        return this;
    }

    /** Shows the CRM pane (opens it from the right rail when it is collapsed). */
    public boolean showPane() {
        if (isShown("paneTitle", 10)) return true;
        if (isShown("crmRail", 5)) click("crmRail");
        return isShown("paneTitle", 15);
    }

    public DeskRecordPage paneTab(String name) {
        click("paneTab", name);
        Waits.sleep(1500);
        return this;
    }

    /** Page text once the CRM pane stopped showing "Loading…". */
    public String text() {
        Waits.until(() -> !bodyText().contains("Loading…") && !bodyText().contains("Loading..."), 45);
        return bodyText();
    }

    /** Opens the Layout picker, returns its text, closes it with Escape (the mode is not changed). */
    public String layoutOptions() {
        click("layoutPicker");
        Waits.sleep(1000);
        String t = bodyText();
        press(Keys.ESCAPE);
        return t;
    }
}
