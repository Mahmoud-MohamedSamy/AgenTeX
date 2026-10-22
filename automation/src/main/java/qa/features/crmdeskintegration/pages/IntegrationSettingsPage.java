package qa.features.crmdeskintegration.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmdeskintegration.CrmDeskFeature;

import java.util.ArrayList;
import java.util.List;

/**
 * CRM ⇄ Desk Integration settings: CRM /settings/integrations/desk and Desk /settings/integrations/crm.
 * Read-only use: tabs, texts, Edit → Close, dialogs → Cancel. Never Save / Apply / Connect / Pause here.
 */
public class IntegrationSettingsPage extends BasePage {

    public IntegrationSettingsPage() {
        super(CrmDeskFeature.NAME);
    }

    public IntegrationSettingsPage openDesk() {
        open(CrmDeskFeature.DESK + CrmDeskFeature.DESK_SETTINGS);
        return ready();
    }

    public IntegrationSettingsPage openCrm() {
        CrmSession.ensure(driver);
        open(CrmDeskFeature.CRM + CrmDeskFeature.CRM_SETTINGS);
        return ready();
    }

    private IntegrationSettingsPage ready() {
        if (!isShown("heading", 60)) {
            driver.navigate().refresh();
            el("heading");
        }
        Waits.bodyContains(driver, "Overview", 30);
        return this;
    }

    public IntegrationSettingsPage tab(String name) {
        click("tab", name);
        Waits.sleep(1500);
        return this;
    }

    public List<String> tabNames() {
        List<String> out = new ArrayList<>();
        for (WebElement e : all("tabs")) if (!e.getText().isBlank()) out.add(e.getText().trim());
        return out;
    }

    /** Page text once the sections stopped showing "Loading…" (the tabs load their data after the switch). */
    public String text() {
        Waits.until(() -> !bodyText().contains("Loading…") && !bodyText().contains("Loading..."), 45);
        return bodyText();
    }

    public boolean waitFor(String text, int seconds) {
        return Waits.until(() -> text().contains(text), seconds);
    }

    /** Opens Edit / Configure of one Sync Settings row and returns the editor text; closes it again without saving. */
    public String peekRow(String deskModule, String button) {
        click("rowAction", deskModule, button);
        Waits.sleep(2000);
        String t = text();
        if (isShown("rowAction", 3, deskModule, "Close")) click("rowAction", deskModule, "Close");
        return t;
    }

    /**
     * Options offered by the select that follows a label (native select or a custom listbox). Opens the list,
     * reads it and closes it with Escape — the value is never changed.
     */
    public List<String> optionsAfterLabel(String label) {
        WebElement ctl = driver.findElement(By.xpath("//*[normalize-space(text())='" + label + "']/following::*[self::select or @role='combobox' or self::button][1]"));
        scrollTo(ctl);
        List<String> out = new ArrayList<>();
        if ("select".equals(ctl.getTagName())) {
            for (WebElement o : ctl.findElements(By.tagName("option"))) out.add(o.getText().trim());
            return out;
        }
        ctl.click();
        Waits.sleep(800);
        for (WebElement o : driver.findElements(By.cssSelector("[role='option']"))) if (o.isDisplayed()) out.add(o.getText().trim());
        new org.openqa.selenium.interactions.Actions(driver).sendKeys(Keys.ESCAPE).perform();
        return out;
    }

    /** Opens the first access-level link on Permissions, returns the dialog text, then Cancel. */
    public String peekAccessDialog() {
        click("fullAccessLink");
        String t = isShown("dialog", 10) ? el("dialog").getText() : bodyText();
        if (isShown("dialogCancel", 3)) click("dialogCancel");
        else press(Keys.ESCAPE);
        return t;
    }

    // ---------------- connection actions (write runs only, user-approved) ----------------

    public boolean hasButton(String label) {
        return isShown("pageButton", 5, label);
    }

    /**
     * Clicks a connection button (Pause sync, Resume sync, Disconnect, Connect), types the optional reason, reads the
     * dialog and confirms with the dialog's own button. Returns "dialog text || page text after" for the verdict.
     */
    public String connectionAction(String label, String reason) {
        click("pageButton", label);
        String dialog = isShown("dialog", 10) ? el("dialog").getText() : "(no dialog)";
        if (reason != null && isShown("dialogInput", 3)) type("dialogInput", reason);
        if (isShown("dialogButton", 3, label)) click("dialogButton", label);
        else {
            List<WebElement> bs = driver.findElements(By.xpath("//*[@role='dialog']//button[not(normalize-space(.)='Cancel')][last()]"));
            if (!bs.isEmpty()) bs.get(bs.size() - 1).click();
        }
        Waits.sleep(2500);
        return dialog + " || " + bodyText();
    }

    public void scrollAll() {
        ((JavascriptExecutor) driver).executeScript("window.scrollTo(0, document.body.scrollHeight)");
        Waits.sleep(500);
    }
}
