package qa.features.crmhierarchy.pages;

import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.pages.CrmSetupPage;
import qa.features.crmhierarchy.CrmHierarchyFeature;

/**
 * Company Settings → Hierarchy Preference (/settings/company/hierarchy-preference). Two mode cards (role=radio,
 * aria-checked) in a radiogroup; picking the other card opens "Switch hierarchy mode?" with Switch mode / Cancel.
 */
public class HierarchyPreferencePage extends BasePage {

    public static final String ROLE = "Role-based";
    public static final String REPORTING = "Reporting-based";

    public HierarchyPreferencePage() {
        super(CrmHierarchyFeature.NAME);
    }

    public HierarchyPreferencePage open() {
        CrmSetupPage.ensureCrm(driver);
        open(CrmHierarchyFeature.BASE + CrmHierarchyFeature.PAGE);
        if (!isShown("card", 45, ROLE)) {
            driver.navigate().refresh();
            el("card", ROLE);
        }
        Waits.until(() -> !bodyText().contains("Loading hierarchy preference…"), 30);
        return this;
    }

    public boolean isSelected(String card) {
        return "true".equals(el("card", card).getAttribute("aria-checked"));
    }

    /** Clicks a card (opens the confirm dialog when it is not the saved mode). */
    public HierarchyPreferencePage pick(String card) {
        click("card", card);
        Waits.sleep(800);
        return this;
    }

    public boolean dialogShown(int seconds) {
        return isShown("dialog", seconds);
    }

    public String dialogText() {
        return el("dialog").getText();
    }

    public HierarchyPreferencePage confirm() {
        click("dialogButton", "Switch mode");
        Waits.bodyContains(driver, "Hierarchy preference updated", 20);
        return this;
    }

    public HierarchyPreferencePage cancel() {
        click("dialogButton", "Cancel");
        Waits.until(() -> !isShown("dialog", 1), 10);
        return this;
    }

    /** Switches to the card and confirms; returns the page text right after (holds the toast). */
    public String switchTo(String card) {
        pick(card);
        if (!dialogShown(10)) throw new IllegalStateException("no confirm dialog after picking " + card);
        confirm();
        return bodyText();
    }

    public String text() {
        return bodyText();
    }

    public void shot(java.nio.file.Path p) {
        try {
            java.nio.file.Files.createDirectories(p.getParent());
            java.nio.file.Files.write(p, ((org.openqa.selenium.TakesScreenshot) driver).getScreenshotAs(org.openqa.selenium.OutputType.BYTES));
        } catch (java.io.IOException e) {
            throw new IllegalStateException(e);
        }
    }
}
