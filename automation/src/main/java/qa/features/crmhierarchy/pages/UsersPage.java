package qa.features.crmhierarchy.pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.crmautomationorder.pages.CrmSetupPage;
import qa.features.crmhierarchy.CrmHierarchyFeature;

import java.util.ArrayList;
import java.util.List;

/** Settings → Users (/settings/general/users) and the user modal's "Reporting manager" select. Read-only use. */
public class UsersPage extends BasePage {

    public UsersPage() {
        super(CrmHierarchyFeature.NAME);
    }

    public UsersPage open() {
        CrmSetupPage.ensureCrm(driver);
        open(CrmHierarchyFeature.BASE + CrmHierarchyFeature.USERS);
        el("heading");
        return this;
    }

    /** Number of user rows in the list. */
    public int rowCount() {
        Waits.sleep(1500);
        return driver.findElements(org.openqa.selenium.By.cssSelector("tbody tr")).size();
    }

    public UsersPage openUser(String displayName) {
        click("userRow", displayName);
        el("managerSelect");
        return this;
    }

    /** Option texts of the Reporting manager select (first = "No manager (clear)"). */
    public List<String> managerOptions() {
        List<String> out = new ArrayList<>();
        for (WebElement o : new Select(el("managerSelect")).getOptions()) out.add(o.getText().trim());
        return out;
    }

    public String selectedManager() {
        return new Select(el("managerSelect")).getFirstSelectedOption().getText().trim();
    }
}
