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

    /** Makes the Desk session usable on the CRM origin (same token cookies). */
    public DeskRecordPage crmSession() {
        CrmSession.ensure(driver);
        return this;
    }

    /** Opens any URL of either app (parity checks), waits for the page and returns its text. */
    public String visit(String url) {
        open(url);
        Waits.sleep(4000);
        Waits.until(() -> !bodyText().contains("Loading…"), 30);
        return bodyText();
    }

    /** Clicks the first visible element whose own text is exactly {@code label} (or starts with it); false if none. */
    public boolean clickText(String label) {
        for (org.openqa.selenium.WebElement e : driver.findElements(org.openqa.selenium.By.xpath(
                "//*[self::button or self::a or @role='button' or @role='menuitem' or @role='option' or self::span or self::div][normalize-space(.)='" + label + "' or starts-with(normalize-space(.),'" + label + "')]"))) {
            try {
                if (e.isDisplayed() && e.getText().length() < label.length() + 40) {
                    e.click();
                    Waits.sleep(1500);
                    return true;
                }
            } catch (RuntimeException ignored) {
            }
        }
        return false;
    }

    /** Whether a visible button with this exact text exists and is enabled ("absent", "enabled" or "disabled"). */
    public String buttonState(String label) {
        for (org.openqa.selenium.WebElement e : driver.findElements(org.openqa.selenium.By.xpath("//button[normalize-space(.)='" + label + "']")))
            if (e.isDisplayed()) return e.isEnabled() && e.getAttribute("aria-disabled") == null ? "enabled" : "disabled";
        return "absent";
    }

    public void shot(java.nio.file.Path png) {
        try {
            java.nio.file.Files.createDirectories(png.getParent());
            java.nio.file.Files.write(png, ((org.openqa.selenium.TakesScreenshot) driver).getScreenshotAs(org.openqa.selenium.OutputType.BYTES));
        } catch (java.io.IOException e) {
            throw new java.io.UncheckedIOException(e);
        }
    }

    /** Opens the Layout picker, saves a screenshot of it to {@code png}, returns its text and closes it with Escape. */
    public String layoutOptionsShot(java.nio.file.Path png) {
        click("layoutPicker");
        Waits.sleep(1200);
        String t = bodyText();
        try {
            java.nio.file.Files.createDirectories(png.getParent());
            java.nio.file.Files.write(png, ((org.openqa.selenium.TakesScreenshot) driver).getScreenshotAs(org.openqa.selenium.OutputType.BYTES));
        } catch (java.io.IOException e) {
            throw new java.io.UncheckedIOException(e);
        }
        press(Keys.ESCAPE);
        return t;
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
