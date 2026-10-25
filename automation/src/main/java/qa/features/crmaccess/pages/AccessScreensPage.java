package qa.features.crmaccess.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmaccess.CrmAccessFeature;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.pages.CrmSetupPage;

import java.util.ArrayList;
import java.util.List;

/**
 * Any Settings › access-and-security screen (Users, Profiles, Permissions, Org Units, Security Policies, Login History,
 * Audit Log, personal pages, Referral Code) and the Leads create / detail form. Wave 1 uses it to check what each
 * screen offers; it never saves anything on the admin screens.
 */
public class AccessScreensPage extends BasePage {

    public AccessScreensPage() {
        super(CrmAccessFeature.NAME);
    }

    /** Opens a CRM path and waits until the page text contains {@code expect} (or the timeout passes). */
    public AccessScreensPage open(String path, String expect, int seconds) {
        CrmSetupPage.ensureCrm(driver);
        open(CrmOrderFeature.BASE + path);
        waitForText(expect, seconds);
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

    public String text() {
        return bodyText();
    }

    public String url() {
        return driver.getCurrentUrl();
    }

    /** Clicks the first visible button / tab / menu item whose text is exactly {@code label}. */
    public AccessScreensPage clickText(String label) {
        click("byText", label);
        Waits.sleep(800);
        return this;
    }

    public boolean has(String label, int seconds) {
        return isShown("byText", seconds, label);
    }

    /** Types into the first visible search box (placeholder contains "Search"). */
    public AccessScreensPage search(String text) {
        type("searchBox", text);
        Waits.sleep(1500);
        return this;
    }

    public int tableRows() {
        Waits.sleep(800);
        return driver.findElements(By.cssSelector("tbody tr")).size();
    }

    /** Visible option texts of an open listbox / menu / popover. */
    public List<String> openOptions() {
        List<String> out = new ArrayList<>();
        for (WebElement e : driver.findElements(By.cssSelector("[role=option], [role=menuitemcheckbox], [role=menuitem], [role=listbox] li")))
            if (e.isDisplayed() && !e.getText().isBlank()) out.add(e.getText().trim());
        return out;
    }

    /** The form control that belongs to the visible label {@code label}: null when the label is not on the form. */
    public WebElement controlFor(String label) {
        List<WebElement> labels = driver.findElements(By.xpath("//label[normalize-space(.)='" + label + "' or normalize-space(.)='" + label + " *']"));
        for (WebElement l : labels) {
            if (!l.isDisplayed()) continue;
            String forId = l.getAttribute("for");
            if (forId != null && !forId.isBlank()) {
                List<WebElement> c = driver.findElements(By.id(forId));
                if (!c.isEmpty()) return c.get(0);
            }
            List<WebElement> near = l.findElements(By.xpath("./following::*[self::input or self::textarea or self::select or @contenteditable='true'][1]"));
            if (!near.isEmpty()) return near.get(0);
        }
        return null;
    }

    public boolean labelShown(String label) {
        return driver.findElements(By.xpath("//*[self::label or self::dt or self::span or self::div][normalize-space(.)='" + label + "' or normalize-space(.)='" + label + " *']"))
                .stream().anyMatch(WebElement::isDisplayed);
    }

    public static boolean editable(WebElement c) {
        if (c == null) return false;
        String ro = c.getAttribute("readonly"), dis = c.getAttribute("disabled"), ce = c.getAttribute("contenteditable"), aria = c.getAttribute("aria-readonly");
        if ("true".equals(aria) || "false".equals(ce)) return false;
        return ro == null && dis == null && c.isEnabled();
    }

    /** Clears the app's browser storage (to rule out stale cached settings) and reloads. */
    public void clearStorageAndReload() {
        Object tenant = ((JavascriptExecutor) driver).executeScript("return localStorage.getItem('aw_auth_tenant_id');");
        ((JavascriptExecutor) driver).executeScript("Object.keys(localStorage).filter(k => !/auth/i.test(k)).forEach(k => localStorage.removeItem(k)); sessionStorage.clear();");
        if (tenant != null) ((JavascriptExecutor) driver).executeScript("localStorage.setItem('aw_auth_tenant_id', arguments[0]);", tenant.toString());
        driver.navigate().refresh();
        Waits.pageReady(driver);
    }
}
