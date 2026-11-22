package qa.features.deskassignmentrules.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.DeskAssignmentRulesFeature;

import java.util.List;

/**
 * Setup › Automation › Assignment Rules: tabs Rules / Team Assignment / Notifications; Rules has Direct Assignment and
 * Round Robin lists, each with New Rule and a master switch. Keys in features/deskassignmentrules/locators.json.
 */
public class AssignmentRulesPage extends BasePage {

    public AssignmentRulesPage() {
        super(DeskAssignmentRulesFeature.NAME);
    }

    /** Opens the page; the staging host has slow periods, so it waits for the Direct list and reloads once. */
    public AssignmentRulesPage open() {
        open(DeskAssignmentRulesFeature.PAGE_PATH);
        Waits.sleep(3000);
        forceEnglish();
        if (!isShown("directRegion", 60)) {
            driver.navigate().refresh();
            el("directRegion");
        }
        Waits.sleep(1500);
        return this;
    }

    public List<String> settingsTabs() {
        return all("settingsTabs").stream().map(e -> e.getText().trim()).toList();
    }

    public List<String> ruleTypeTabs() {
        return all("ruleTypeTabs").stream().map(e -> e.getText().trim()).toList();
    }

    public boolean directHasNewRuleAndSwitch() {
        return isShown("directNewRule", 10) && isShown("directSwitch", 5);
    }

    public AssignmentRulesPage roundRobin(String department) {
        click("roundRobinTab");
        el("rrRegion");
        if (department != null && !text("rrDepartment").contains(department)) {
            click("rrDepartment");
            click("option", department);
            Waits.sleep(2500);
        }
        return this;
    }

    public boolean rrHasNewRuleSwitchAndPicker() {
        return isShown("rrNewRule", 10) && isShown("rrSwitch", 5) && isShown("rrDepartment", 5);
    }

    public RuleFormDialog newDirectRule() {
        click("directNewRule");
        return new RuleFormDialog().waitOpen();
    }

    public RuleFormDialog newRoundRobinRule() {
        click("rrNewRule");
        return new RuleFormDialog().waitOpen();
    }

    public RrPreferencesDialog preferences() {
        click("rrMoreActions");
        click("menuItem", "Preferences");
        return new RrPreferencesDialog().waitLoaded();
    }

    public AssignmentRulesPage tab(String name) {
        click("settingsTab", name);
        Waits.sleep(2500);
        return this;
    }

    /** Visible text of the Direct Assignment region (rule rows and their target summaries). */
    public String directListText() {
        return text("directRegion");
    }

    public boolean directRuleListed(String name, int seconds) {
        return isShown("ruleRow", seconds, name);
    }

    /** Accessible names of every visible switch in the main area ("(no name)" when a switch has none). */
    @SuppressWarnings("unchecked")
    public List<String> switchNames() {
        return (List<String>) ((JavascriptExecutor) driver).executeScript(
                "return [...document.querySelectorAll('main [role=switch]')].filter(e=>e.offsetParent!==null).map(e=>{" +
                        "const l=e.getAttribute('aria-label');const lb=e.getAttribute('aria-labelledby');" +
                        "const t=lb&&lb.split(' ').map(i=>document.getElementById(i)).filter(Boolean).map(x=>x.innerText).join(' ');" +
                        "const lab=e.id&&document.querySelector('label[for=\"'+e.id+'\"]');" +
                        "return (l||t||(lab&&lab.innerText)||'(no name)').trim();});");
    }

    /** Labels of the drag handles of the Direct list ("Drag <rule> to reorder"). */
    public List<String> dragHandles() {
        return all("directDragHandles").stream().map(e -> {
            String a = e.getAttribute("aria-label");
            return a != null ? a : e.getText();
        }).toList();
    }

    public int directRuleRows() {
        return driver.findElements(By.xpath("//*[@role='region' and @aria-label='Direct Assignment']//ul/li[.//*[@role='switch']] | "
                + "//section[.//h2[normalize-space(.)='Direct Assignment']]//li[.//*[@role='switch']]")).size();
    }

    public String mainText() {
        return driver.findElement(By.tagName("main")).getText();
    }

    /** The visible toast / status text right after an action (empty when none). */
    public String toastText(int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            for (WebElement e : driver.findElements(By.cssSelector("[role=status], [data-sonner-toast], [role=alert], li[data-type]"))) {
                String t = e.getText().trim();
                if (!t.isEmpty()) return t;
            }
            Waits.sleep(300);
        }
        return "";
    }

    public String htmlDir() {
        Object d = ((JavascriptExecutor) driver).executeScript("return document.documentElement.dir || getComputedStyle(document.body).direction;");
        return String.valueOf(d);
    }

    /** Header language button (EN / AR) → picks the language whose label matches. */
    public void language(String pattern, String wantDir) {
        click("languageButton");
        Waits.sleep(1000);
        for (WebElement e : driver.findElements(By.cssSelector("[role=menuitem], [role=option], [role=menuitemradio], [role=menu] button, [role=listbox] button")))
            if (e.isDisplayed() && e.getText().trim().matches("(?is).*(" + pattern + ").*")) {
                e.click();
                break;
            }
        Waits.until(() -> wantDir.equals(htmlDir()), 20);
    }

    /** Puts the UI back to English even if the menu did not (the choice is kept in localStorage). */
    public void forceEnglish() {
        if ("ltr".equals(htmlDir())) return;
        ((JavascriptExecutor) driver).executeScript("localStorage.setItem('anyware_language','en');localStorage.setItem('anyware_language_explicit','en');");
        driver.navigate().refresh();
        Waits.until(() -> "ltr".equals(htmlDir()), 30);
    }
}
