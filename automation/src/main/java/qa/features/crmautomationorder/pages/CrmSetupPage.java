package qa.features.crmautomationorder.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import qa.core.auth.AuthManager;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.CrmOrderFeature;

import java.util.List;

/**
 * Shared behaviour of the five CRM process setup screens (explored 21 Oct 2026, staging-crm):
 * a list page with a create button, rows with "Actions for &lt;name&gt;" → Edit / Delete, custom listboxes
 * ([role=listbox] [role=option]) and native selects whose options load late, and one condition builder
 * ("— select field —" / "Operator" / value box). Every page has the same generic keys in locators.json.
 */
public abstract class CrmSetupPage<P extends CrmSetupPage<P>> extends BasePage {

    protected CrmSetupPage() {
        super(CrmOrderFeature.NAME);
    }

    @SuppressWarnings("unchecked")
    protected P self() {
        return (P) this;
    }

    /** List page path, e.g. /settings/automation/assignment-rules. */
    protected abstract String path();

    /** The list page's heading text. */
    protected abstract String title();

    /**
     * The Desk session works on the CRM host: the token cookies live on .taviportal.com; only the per-origin
     * localStorage key aw_auth_tenant_id has to be copied once (same as crmdeskintegration). No second login.
     */
    public static void ensureCrm(org.openqa.selenium.WebDriver d) {
        if (d.getCurrentUrl().startsWith(CrmOrderFeature.BASE)) return;
        Object tenant = ((JavascriptExecutor) d).executeScript("return localStorage.getItem('aw_auth_tenant_id');");
        // the Settings page is much lighter than the home dashboard (which timed out on staging, 21 Oct 2026)
        try {
            d.get(CrmOrderFeature.BASE + "/settings");
        } catch (org.openqa.selenium.TimeoutException e) {
            d.get(CrmOrderFeature.BASE + "/settings");
        }
        Waits.pageReady(d);
        ((JavascriptExecutor) d).executeScript("localStorage.setItem('aw_auth_tenant_id', arguments[0]);",
                tenant != null ? tenant.toString() : CrmOrderFeature.TENANT);
        Waits.sleep(1000);
        if (AuthManager.onLoginPage(d)) {
            d.get(CrmOrderFeature.BASE + "/settings");
            Waits.pageReady(d);
        }
        if (Waits.until(() -> AuthManager.onLoginPage(d), 8))
            throw new IllegalStateException("The Desk session is not accepted on the CRM host (landed on " + d.getCurrentUrl() + ")");
    }

    public P open() {
        ensureCrm(driver);
        leaveDraft();
        open(CrmOrderFeature.BASE + path());
        leaveDraft();
        if (!isShown("heading", 60, title())) {
            driver.navigate().refresh();
            el("heading", title());
        }
        return self();
    }

    /** An unsaved editor asks "leave this page?" (beforeunload); accept it. */
    protected void leaveDraft() {
        try {
            driver.switchTo().alert().accept();
        } catch (NoAlertPresentException ignored) {
        }
    }

    // ---------- generic controls ----------

    protected void button(String name) {
        click("button", name);
        Waits.sleep(800);
    }

    protected void dialogButton(String name) {
        click("dialogButton", name);
        Waits.sleep(1000);
    }

    /** Opens a custom dropdown that may still be disabled (its options load after an earlier choice): waits, retries. */
    protected void openDropdown(String key, String name) {
        for (int i = 0; i < 6; i++) {
            Waits.until(() -> el(key, name).isEnabled() && !"true".equals(el(key, name).getAttribute("aria-disabled")), 20);
            click(key, name);
            if (Waits.until(() -> {
                for (WebElement o : driver.findElements(By.cssSelector("[role='option']"))) if (o.isDisplayed()) return true;
                return false;
            }, 4)) return;
            press(Keys.ESCAPE); // close an empty list before trying again
            Waits.sleep(2500);
        }
        throw new IllegalStateException("dropdown '" + name + "' never showed any option (still loading?)");
    }

    protected void fill(String label, String text) {
        type("textbox", text, label);
    }

    /** Custom listbox: the option whose text equals or starts with {@code name} (user options also carry the email). */
    protected void option(String name) {
        if (!isShown("option", 4, name)) { // long lists are searchable: type into the popup search box
            // only the search box of an OPEN dropdown (never the Settings sidebar search): within 3 levels of a visible listbox
            List<WebElement> boxes = new java.util.ArrayList<>();
            for (WebElement b : driver.findElements(By.xpath("//*[@role='listbox']/ancestor::*[position()<=3]//input[@placeholder='Search' or @aria-label='Search' or @placeholder='Search…']")))
                if (b.isDisplayed()) boxes.add(b);
            for (int i = boxes.size() - 1; i >= 0; i--)
                if (boxes.get(i).isDisplayed()) {
                    boxes.get(i).sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
                    boxes.get(i).sendKeys(name);
                    Waits.sleep(1200);
                    break;
                }
        }
        if (!isShown("option", 6, name)) {
            StringBuilder seen = new StringBuilder();
            for (WebElement o : driver.findElements(By.cssSelector("[role='option']"))) if (o.isDisplayed()) seen.append(" | ").append(o.getText().trim());
            System.out.println("[crm-ui] option '" + name + "' not offered; visible options:" + seen);
        }
        click("option", name);
        Waits.sleep(600);
    }

    /** Native select whose options arrive after the previous choice: waits for the option, then picks it. */
    protected void selectWhenLoaded(String label, String optionText) {
        Waits.until(() -> {
            for (WebElement o : el("select", label).findElements(By.tagName("option")))
                if (o.getText().trim().equals(optionText)) return true;
            return false;
        }, 30);
        selectNative("select", optionText, label);
        Waits.sleep(1500);
    }

    /** People picker dialog (Choose Reviewers, approvers, admins): search, tick the user, Save. */
    protected void pickUser(String name) {
        if (isShown("dialogSearch", 5)) {
            type("dialogSearch", name);
            Waits.sleep(1500);
        }
        WebElement box = el("pickerCheckbox", name);
        if (!box.isSelected()) click("pickerCheckbox", name);
        Waits.sleep(500);
        dialogButton("Save");
    }

    /** After a save: if the editor is still open, prints its alerts / validation lines (diagnostics for the run log). */
    protected void reportIfStuck(String urlPart) {
        Waits.sleep(2500);
        if (!driver.getCurrentUrl().contains(urlPart) && !isShown("dialog", 1)) return;
        StringBuilder msg = new StringBuilder();
        for (WebElement a : driver.findElements(By.xpath("//*[@role='alert' or @role='status' or contains(@class,'error') or contains(@class,'invalid')]")))
            if (a.isDisplayed() && !a.getText().isBlank()) msg.append(" | ").append(a.getText().trim().replace('\n', ' '));
        System.out.println("[crm-ui] still on " + driver.getCurrentUrl() + " after save; messages:" + msg);
    }

    /** Opens an accordion section (header button with aria-expanded) if it is closed. */
    protected void expand(String section) {
        if (!"true".equals(el("section", section).getAttribute("aria-expanded"))) {
            click("section", section);
            Waits.sleep(1200);
        }
    }

    /** A user chooser that is either a people-picker dialog (search + checkboxes + Save) or a plain listbox. */
    protected void chooseUser(String name) {
        Waits.sleep(1000);
        if (isShown("dialogSearch", 3) || isShown("pickerCheckbox", 1, name)) pickUser(name);
        else {
            option(name);
            escape();
        }
    }

    protected boolean shown(String text, int seconds) {
        return Waits.bodyContains(driver, text, seconds);
    }

    /**
     * Condition builder: fills the last (or a new) condition row with field / operator / value.
     * The radio "… matching certain conditions" already adds one empty row.
     */
    protected void condition(String field, String operator, String value) {
        List<WebElement> empty = all("emptyFieldPicker");
        if (empty.isEmpty()) {
            button("Add condition");
            empty = all("emptyFieldPicker");
        }
        WebElement picker = empty.get(0);
        scrollTo(picker);
        picker.click();
        Waits.sleep(800);
        option(field);
        List<WebElement> ops = all("operator");
        ops.get(ops.size() - 1).click();
        Waits.sleep(600);
        option(operator);
        List<WebElement> values = all("conditionValue");
        WebElement v = values.get(values.size() - 1);
        v.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
        v.sendKeys(value);
        Waits.sleep(500);
    }

    /** Condition on a user field (e.g. Lead Owner): field, operator, then the value is a user picker (listbox). */
    protected void userCondition(String field, String operator, String userOption) {
        List<WebElement> empty = all("emptyFieldPicker");
        if (empty.isEmpty()) {
            button("Add condition");
            empty = all("emptyFieldPicker");
        }
        empty.get(0).click();
        Waits.sleep(800);
        option(field);
        List<WebElement> ops = all("operator");
        ops.get(ops.size() - 1).click();
        Waits.sleep(600);
        option(operator);
        List<WebElement> vals = driver.findElements(By.xpath("(//button[@aria-label='Operator'])[last()]/following::*[self::button or self::input][1]"));
        vals.get(0).click();
        Waits.sleep(1000);
        option(userOption);
        escape();
    }

    protected void escape() {
        press(Keys.ESCAPE);
        Waits.sleep(400);
    }

    // ---------- list rows ----------

    public boolean listed(String name, int seconds) {
        return isShown("row", seconds, name);
    }

    /** Row → Actions → Edit. */
    public P edit(String name) {
        click("rowActions", name);
        click("menuItem", "Edit");
        Waits.sleep(2500);
        return self();
    }

    /** Row → Actions → Delete → confirm in the dialog. Returns the dialog text. */
    public String delete(String name) {
        click("rowActions", name);
        click("menuItem", "Delete");
        Waits.sleep(1000);
        String text = isShown("dialog", 5) ? el("dialog").getText() : "";
        for (String b : new String[]{"Delete", "Delete process", "Delete rule", "Delete blueprint", "Yes, delete", "Confirm", "Yes"})
            if (isShown("dialogButton", 1, b)) {
                dialogButton(b);
                break;
            }
        Waits.sleep(2000);
        return text;
    }

    /** Status switch of a row: true when on. */
    public Boolean active(String name) {
        if (!isShown("toggle", 5, name)) return null;
        WebElement t = el("toggle", name);
        String v = t.getAttribute("aria-checked");
        return v != null ? Boolean.valueOf(v) : t.isSelected();
    }

    public P setActive(String name, boolean on) {
        Boolean cur = active(name);
        if (cur != null && cur != on) {
            click("toggle", name);
            Waits.sleep(1500);
            for (String b : new String[]{"Deactivate", "Activate", "Confirm", "Yes"})
                if (isShown("dialogButton", 1, b)) {
                    dialogButton(b);
                    break;
                }
        }
        return self();
    }

    /** Value of a text box by its label (after Edit, to prove the saved value came back). */
    public String textValue(String label) {
        return value("textbox", label);
    }

    public String pageText() {
        return bodyText();
    }

    protected void selectNativeByLabel(String label, String option) {
        new Select(el("select", label)).selectByVisibleText(option);
    }
}
