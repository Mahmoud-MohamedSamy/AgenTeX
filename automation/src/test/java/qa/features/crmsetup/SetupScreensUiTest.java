package qa.features.crmsetup;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.core.driver.DriverManager;
import qa.features.crmsetup.pages.SetupScreensPage;

import java.util.ArrayList;
import java.util.List;

import static qa.features.crmsetup.CrmSetupApi.*;
import static qa.features.crmsetup.CrmSetupFeature.*;

/**
 * Wave 5 screens as the owner, on a module the class creates ("QA W5 UI …", deleted afterwards): Field Listing layout
 * filter (NDC-1598), the module tabs that are still "In Development" (gap list), and the Data Types table (NDC-1232).
 */
public class SetupScreensUiTest extends BaseTest {
    private final Cleanup cleanup = new Cleanup();
    private String mod;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        String t = tag();
        mod = createModule("qa_w5_ui_" + t, QA + "UI " + t);
        cleanup.then("QA module", () -> fact("cleanup", "delete QA module -> " + deleteModule(mod)));
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @CaseId("C01")
    @Test(groups = {"crmsetup", "wave5", "ui", "NDC-1598"}, description = "Field Listing has a layout filter with All Layouts, each layout and 'Not on any layout'")
    public void fieldListingLayoutFilter() {
        SetupScreensPage p = new SetupScreensPage().go("/settings/modules-and-fields/" + mod + "?tab=fields");
        p.waitForText("Field Listing", 30);
        p.clickText("Fields");
        p.waitForText("Search Fields", 20);
        List<WebElement> selects = DriverManager.get().findElements(By.tagName("select"));
        List<String> options = new ArrayList<>();
        for (WebElement s : selects) for (WebElement o : new Select(s).getOptions()) options.add(o.getText().trim());
        fact("C01 NDC-1598", "layout filter options " + options);
        Assert.assertTrue(options.contains("All Layouts") && options.contains("Not on any layout"), "no layout filter on the Field Listing: " + options);
    }

    @CaseId({"C03", "C04", "C05", "C10"})
    @Test(groups = {"crmsetup", "wave5", "ui", "gap"}, description = "Layout Rules, Validation Rules, Record Locking, Map Dependency, Links and Buttons tabs are working screens (not 'In Development')")
    public void moduleTabsBuilt() {
        SetupScreensPage p = new SetupScreensPage().go("/settings/modules-and-fields/" + mod);
        p.waitForText("Layouts", 30);
        List<String> notBuilt = new ArrayList<>();
        for (String tab : List.of("Layout Rules", "Validation Rules", "Record Locking Configuration", "Map Dependency Fields", "Links", "Buttons")) {
            p.clickText(tab);
            Waits.sleep(2500);
            String main = (String) ((JavascriptExecutor) DriverManager.get()).executeScript("const m = document.querySelector('main'); return m ? m.innerText : document.body.innerText;");
            if (main.contains("In Development")) notBuilt.add(tab);
        }
        fact("C03-C10", "tabs still 'In Development': " + notBuilt);
        Assert.assertTrue(notBuilt.isEmpty(), "module tabs still 'In Development': " + notBuilt);
    }

    @CaseId("C13")
    @Test(groups = {"crmsetup", "wave5", "ui", "NDC-1232"}, description = "Data Types: the header row stays visible when the list is scrolled")
    public void dataTypesStickyHeader() {
        SetupScreensPage p = new SetupScreensPage().go("/settings/data-types");
        p.waitForText("Add data type", 30);
        Waits.sleep(2000);
        JavascriptExecutor js = (JavascriptExecutor) DriverManager.get();
        String position = (String) js.executeScript("const h = document.querySelector('thead th'); return h ? getComputedStyle(h).position : 'none';");
        js.executeScript("const rows = document.querySelectorAll('tbody tr'); if (rows.length) rows[rows.length - 1].scrollIntoView();");
        Waits.sleep(1000);
        Object top = js.executeScript("const h = document.querySelector('thead th'); if (!h) return -1; const r = h.getBoundingClientRect(); return r.bottom > 0 && r.top < window.innerHeight ? Math.round(r.top) : -1;");
        fact("C13 NDC-1232", "header position " + position + ", header top after scrolling " + top);
        Assert.assertEquals(position, "sticky", "the Data Types header is not sticky");
        Assert.assertNotEquals(String.valueOf(top), "-1", "the header scrolled out of view");
    }
}
