package qa.features.crmautomationorder.pages;

import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.CrmOrderFeature;

/** A Leads record page: header status (review / approval / blueprint), transition buttons, the form's Save button. */
public class LeadRecordPage extends BasePage {

    public LeadRecordPage() {
        super(CrmOrderFeature.NAME);
    }

    public LeadRecordPage open(String recordId, String name) {
        CrmSetupPage.ensureCrm(driver);
        open(CrmOrderFeature.BASE + "/modules/" + CrmOrderFeature.LEADS + "/records/" + recordId);
        if (!Waits.bodyContains(driver, name, 60)) {
            driver.navigate().refresh();
            Waits.bodyContains(driver, name, 60);
        }
        Waits.sleep(3000);
        return this;
    }

    /** Any module's record page (e.g. a Task made by a blueprint action). */
    public LeadRecordPage openRecord(String moduleId, String recordId, String expectText) {
        CrmSetupPage.ensureCrm(driver);
        open(CrmOrderFeature.BASE + "/modules/" + moduleId + "/records/" + recordId);
        if (!Waits.bodyContains(driver, expectText, 60)) {
            driver.navigate().refresh();
            Waits.bodyContains(driver, expectText, 60);
        }
        Waits.until(() -> !bodyText().contains("Loading layout") && !bodyText().contains("Loading activity"), 90); // the form loads after the header
        Waits.sleep(2000);
        return this;
    }

    /** Opens a URL under the CRM host and waits for a text (settings pages, read-only). */
    public LeadRecordPage openPath(String path, String expectText) {
        CrmSetupPage.ensureCrm(driver);
        open(CrmOrderFeature.BASE + path);
        Waits.bodyContains(driver, expectText, 90);
        Waits.sleep(3000);
        return this;
    }

    public LeadRecordPage clickText(String text) {
        click("textItem", text);
        Waits.sleep(2500);
        return this;
    }

    public LeadRecordPage typeInto(String placeholder, String text) {
        type("placeholderBox", text, placeholder);
        Waits.sleep(8000);
        return this;
    }

    /** Types into the input whose aria-label, label or placeholder is {@code label} (e.g. the designer's "Webhook URL"). */
    public LeadRecordPage typeLabeled(String label, String text) {
        type("labeledBox", text, label);
        Waits.sleep(1000);
        return this;
    }

    public LeadRecordPage clickButton(String name) {
        click("button", name);
        Waits.sleep(2500);
        return this;
    }

    public String text() {
        return bodyText();
    }

    public boolean hasButton(String name) {
        return isShown("button", 3, name);
    }

    /** null = no Save button on the page; otherwise whether it is enabled. */
    public Boolean saveEnabled() {
        if (isShown("button", 3, "Edit") && !isShown("button", 1, "Save")) {
            click("button", "Edit");
            Waits.sleep(1500);
        }
        if (!isShown("button", 5, "Save")) return null;
        WebElement b = el("button", "Save");
        return b.isEnabled() && !"true".equals(b.getAttribute("aria-disabled"));
    }

    /** Inputs of the form that can be typed into. */
    public int editableInputs() {
        int n = 0;
        for (WebElement e : all("formInput")) if (e.isDisplayed() && e.isEnabled() && e.getAttribute("readonly") == null) n++;
        return n;
    }
}
