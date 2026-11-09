package qa.features.deskblueprint.pages;

import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskblueprint.DeskBlueprintFeature;

import java.util.List;

/**
 * Blueprint designer (/settings/automation/blueprints/{id}).
 * Element keys live in src/test/resources/features/deskblueprint/locators.json under "DesignerPage".
 */
public class DesignerPage extends BasePage {

    public DesignerPage() {
        super(DeskBlueprintFeature.NAME);
    }

    public DesignerPage openBlueprint(String id) {
        open(DeskBlueprintFeature.LIST_PATH + "/" + id);
        if (!isShown("saveAndPublish", 60)) { // staging: the first designer load sometimes hangs; one reload fixes it
            driver.navigate().refresh();
            isShown("saveAndPublish", 90);
        }
        Waits.sleep(2500);
        return this;
    }

    /** Selects a state on the canvas so its panel opens on the right. */
    public DesignerPage openState(String name) {
        // React Flow selects a node on a real pointer down/up; a JS click (BasePage fallback) does not open the panel.
        WebElement node = el("stateNode", name);
        new org.openqa.selenium.interactions.Actions(driver).moveToElement(node, -20, 0).click().perform();
        Waits.sleep(1500);
        if (bodyText().contains("Select a state or a transition")) { // still on Blueprint details: try the node's label itself
            new org.openqa.selenium.interactions.Actions(driver).moveToElement(node).click().perform();
            Waits.sleep(1500);
        }
        if (bodyText().contains("Select a state or a transition")) { // the label text element, with a slow press/release
            WebElement label = node.findElement(org.openqa.selenium.By.xpath(".//*[normalize-space(text())='" + name + "']"));
            new org.openqa.selenium.interactions.Actions(driver).moveToElement(label).clickAndHold()
                    .pause(java.time.Duration.ofMillis(150)).release().perform();
            Waits.sleep(1500);
        }
        if (bodyText().contains("Select a state or a transition")) { // keyboard: React Flow nodes are focusable; Enter selects
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].focus()", node);
            new org.openqa.selenium.interactions.Actions(driver).sendKeys(org.openqa.selenium.Keys.ENTER).perform();
            Waits.sleep(1500);
        }
        return this;
    }

    /** Value of "Time limit in hours" ("" when the field shows the "No limit" placeholder). */
    public String timeLimit() {
        return value("timeLimitInput");
    }

    /** True if the "When it runs out" select is on the panel. */
    public boolean showsWhenItRunsOut() {
        return isShown("whenItRunsOut", 3);
    }

    /** The example sentence under Clock, or "" if not shown. */
    public String clockExample() {
        return isShown("clockExample", 5) ? text("clockExample") : "";
    }

    public DesignerPage saveState() {
        click("saveState");
        Waits.sleep(1500);
        return this;
    }

    public DesignerPage saveAndPublish() {
        click("saveAndPublish");
        Waits.sleep(2000);
        if (isShown("confirmPublish", 3)) click("confirmPublish");
        Waits.sleep(4000);
        return this;
    }

    public List<WebElement> nodes(String name) {
        return all("stateNode", name);
    }

    // ---------- screen checks (Phase 2 UI rows, ported from the Playwright probes) ----------

    /** New blueprint page (empty canvas). */
    public DesignerPage openNew() {
        open(DeskBlueprintFeature.LIST_PATH + "/new");
        isShown("addState", 60);
        Waits.sleep(2000);
        return this;
    }

    /** Opens a blueprint without waiting for the canvas (phone width shows a message instead). */
    public DesignerPage openBlueprintRaw(String id) {
        open(DeskBlueprintFeature.LIST_PATH + "/" + id);
        for (int i = 0; i < 60 && !bodyText().matches("(?s).*(larger screen|Save and Publish|Escalated).*"); i++) Waits.sleep(1000);
        Waits.sleep(1500);
        return this;
    }

    public String pageText() {
        return bodyText();
    }

    /** Clicks a transition's label on the canvas so its panel opens. */
    public DesignerPage openTransition(String label) {
        WebElement e = el("transitionLabel", label);
        new org.openqa.selenium.interactions.Actions(driver).moveToElement(e).click().perform();
        Waits.sleep(1500);
        return this;
    }

    public DesignerPage escape() {
        press(org.openqa.selenium.Keys.ESCAPE);
        Waits.sleep(600);
        return this;
    }

    /** Types into "Warn before, in hours" of the open state panel (nothing is saved). */
    public DesignerPage warnBefore(String hours) {
        WebElement in = el("warnBeforeInput");
        in.sendKeys(org.openqa.selenium.Keys.chord(org.openqa.selenium.Keys.CONTROL, "a"), hours);
        Waits.sleep(800);
        return this;
    }

    public DesignerPage cancelPanel() {
        List<WebElement> b = all("cancelPanel");
        if (!b.isEmpty()) b.get(b.size() - 1).click();
        Waits.sleep(800);
        return this;
    }

    public int edgeCount() {
        return driver.findElements(org.openqa.selenium.By.cssSelector(".react-flow__edge")).size();
    }

    public int nodeCount() {
        return driver.findElements(org.openqa.selenium.By.cssSelector(".react-flow__node")).size();
    }

    public DesignerPage tidy() {
        click("tidy");
        Waits.sleep(1200);
        return this;
    }

    public DesignerPage undo() {
        click("undo");
        Waits.sleep(800);
        return this;
    }

    public DesignerPage redo() {
        click("redo");
        Waits.sleep(800);
        return this;
    }

    /** Leaves with the header back arrow; returns the page text shown right after (the unsaved-changes dialog if any). */
    public String leaveWithBack() {
        click("backLink");
        Waits.sleep(2000);
        return bodyText();
    }

    /** Closes the unsaved-changes dialog with "Leave without saving" (accepting the browser leave prompt too). */
    public void leaveWithoutSaving() {
        if (isShown("leaveWithoutSaving", 3)) click("leaveWithoutSaving");
        Waits.sleep(1000);
        try { driver.switchTo().alert().accept(); } catch (org.openqa.selenium.NoAlertPresentException ignored) { }
    }

    /** Visible buttons with no text, aria-label or title (icon buttons a screen reader cannot name). */
    public long unnamedIconButtons() {
        Object n = ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "return [...document.querySelectorAll('button')].filter(b => !b.innerText.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title') && b.offsetParent).length;");
        return ((Number) n).longValue();
    }

    /** [scrollWidth, innerWidth] of the page — sideways scroll when the first is bigger. */
    public long[] widths() {
        List<?> w = (List<?>) ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "return [document.documentElement.scrollWidth, window.innerWidth];");
        return new long[]{((Number) w.get(0)).longValue(), ((Number) w.get(1)).longValue()};
    }

    /** [dir, lang] of the html element. */
    public String[] htmlDirLang() {
        List<?> w = (List<?>) ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "return [document.documentElement.dir, document.documentElement.lang];");
        return new String[]{String.valueOf(w.get(0)), String.valueOf(w.get(1))};
    }

    /** Sets the app language in localStorage (en / ar); takes effect on the next page load. */
    public DesignerPage language(String lang) {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("localStorage.setItem('anyware_language', arguments[0]);", lang);
        return this;
    }

    /** Number of &lt;img src="x"&gt; elements (an injected payload would create one). */
    public int injectedImages() {
        return driver.findElements(org.openqa.selenium.By.cssSelector("img[src='x']")).size();
    }
}
