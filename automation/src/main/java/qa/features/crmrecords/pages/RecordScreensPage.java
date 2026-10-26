package qa.features.crmrecords.pages;

import org.openqa.selenium.By;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.pages.CrmSetupPage;
import qa.features.crmrecords.CrmRecordsFeature;

/**
 * The record screens of Wave 2: a module list (with ?view=), a record page (activity "+" buttons, Timeline tab) and
 * Settings › Pipelines. It only opens pages and popups and reads what they show; it never saves anything.
 */
public class RecordScreensPage extends BasePage {

    public RecordScreensPage() {
        super(CrmRecordsFeature.NAME);
    }

    /** Opens a CRM path (e.g. /modules/{id}) without waiting for any text. */
    public RecordScreensPage go(String path) {
        CrmSetupPage.ensureCrm(driver);
        super.open(CrmOrderFeature.BASE + path);
        return this;
    }

    public RecordScreensPage openRecord(String moduleId, String recordId) {
        // a record made by the API seconds earlier can show "Record not found" at first (seen 26 Oct 2026): reload a few times
        for (int i = 0; i < 4; i++) {
            go("/modules/" + moduleId + "/records/" + recordId);
            if (waitForText("Timeline", 40) && !bodyText().contains("Record not found")) break;
            Waits.sleep(5000);
        }
        return this;
    }

    public boolean waitForText(String text, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            if (bodyText().contains(text)) return true;
            Waits.sleep(500);
        }
        return false;
    }

    /** Seconds until the page text contains {@code text}, or -1 after {@code seconds}. */
    public double secondsUntilText(String text, int seconds) {
        long t0 = System.currentTimeMillis();
        return waitForText(text, seconds) ? (System.currentTimeMillis() - t0) / 1000.0 : -1;
    }

    /** Seconds until the list shows its first data row, or -1 after {@code seconds}. */
    public double secondsUntilFirstRow(int seconds) {
        long t0 = System.currentTimeMillis();
        return isShown("listRow", seconds) ? (System.currentTimeMillis() - t0) / 1000.0 : -1;
    }

    public String text() {
        return bodyText();
    }

    public String url() {
        return driver.getCurrentUrl();
    }

    public RecordScreensPage clickText(String label) {
        click("byText", label);
        Waits.sleep(800);
        return this;
    }

    /** Clicks the "+ Task" / "+ Call" / "+ Meeting" button of the record's activities. */
    public RecordScreensPage addActivity(String kind) {
        click("activityButton", kind);
        Waits.sleep(800);
        return this;
    }

    /** Closes an open dialog with Escape (nothing is saved). */
    public RecordScreensPage closeDialog() {
        driver.findElement(By.tagName("body")).sendKeys(org.openqa.selenium.Keys.ESCAPE);
        Waits.sleep(500);
        return this;
    }

    /** Text of the open dialog, or "" when none is open. */
    public String dialogText() {
        return driver.findElements(By.cssSelector("[role=dialog]")).stream().filter(e -> e.isDisplayed()).map(e -> e.getText()).findFirst().orElse("");
    }
}
