package qa.features.crmhierarchy.pages;

import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.pages.CrmSetupPage;
import qa.features.crmhierarchy.CrmHierarchyFeature;

/**
 * Personal Settings → Reporting Hierarchy (/settings/personal/reporting-hierarchy). Exists only in Reporting mode; in
 * Role mode the route redirects to /settings. Read-only use (never Save here).
 */
public class PersonalHierarchyPage extends BasePage {

    public PersonalHierarchyPage() {
        super(CrmHierarchyFeature.NAME);
    }

    /** Opens the route; true when the page stayed (Reporting mode), false when it redirected away. */
    public boolean open() {
        CrmSetupPage.ensureCrm(driver);
        open(CrmHierarchyFeature.BASE + CrmHierarchyFeature.PERSONAL);
        Waits.sleep(2500);
        return driver.getCurrentUrl().contains(CrmHierarchyFeature.PERSONAL) && isShown("heading", 20);
    }

    public String currentUrl() {
        return driver.getCurrentUrl();
    }

    public String managerPlaceholder() {
        return el("managerInput").getAttribute("placeholder");
    }

    public String text() {
        return bodyText();
    }
}
