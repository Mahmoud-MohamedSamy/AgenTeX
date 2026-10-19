package qa.features.crmdeskintegration.pages;

import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmdeskintegration.CrmDeskFeature;

/** A CRM record page with the Desk Tickets card (statistics, status filters). Read-only. */
public class CrmRecordPage extends BasePage {

    public CrmRecordPage() {
        super(CrmDeskFeature.NAME);
    }

    public CrmRecordPage openContact(String crmContactId) {
        CrmSession.ensure(driver);
        open(CrmDeskFeature.CRM + "/modules/" + CrmDeskFeature.CRM_CONTACTS + "/records/" + crmContactId);
        Waits.bodyContains(driver, "Overview", 60);
        if (isShown("deskTicketsCard", 45)) scrollTo(el("deskTicketsCard"));
        Waits.sleep(2000);
        return this;
    }

    public boolean cardShown() {
        return isShown("deskTicketsCard", 5);
    }

    /** Text of the filter group of the card (All · Open · On hold · Closed …). */
    public String filters() {
        WebElement g = el("filterGroup");
        scrollTo(g);
        return g.getText();
    }

    public CrmRecordPage filter(String name) {
        click("ticketFilter", name);
        Waits.sleep(1500);
        return this;
    }

    public String text() {
        return bodyText();
    }
}
