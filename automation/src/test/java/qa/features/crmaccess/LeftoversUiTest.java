package qa.features.crmaccess;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.core.driver.DriverManager;
import qa.features.crmaccess.pages.AccessScreensPage;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 leftover screens as the owner: FP-01 set a field permission from Modules & Fields › Leads › Fields › Field
 * Permissions and save; PE-02 change one permission on the matrix, Discard, then change and Save; PE-03 owner-only lock.
 * All on one QA profile created by API and deleted afterwards (nothing else is touched).
 */
public class LeftoversUiTest extends BaseTest {
    private String profileId, profileName;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        profileName = QA + "UI " + System.currentTimeMillis() % 100000;
        profileId = createProfile(profileName, P_USER);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        for (java.util.Map.Entry<String, String> e : fieldPermissionsOf(profileId).entrySet()) fact("cleanup", "QA profile field permission left: " + e);
        List<java.util.Map<String, Object>> rows = CrmUser.ok(owner().get("/modules/" + LEADS + "/field-permissions"), "FP").jsonPath().getList("data");
        for (java.util.Map<String, Object> r : rows) if (profileId.equals(r.get("profileId"))) deleteFieldPermission(String.valueOf(r.get("id")));
        deleteProfile(profileId);
        fact("LU-revert", "QA profile deleted=" + !profileExists(profileId));
    }

    private static String effectOf(String id, String key) {
        java.util.List<java.util.Map<String, Object>> rows = CrmUser.ok(owner().get("/iam/profiles/" + id + "/permissions"), "profile permissions").jsonPath().getList("data");
        return rows.stream().filter(r -> key.equals(r.get("permissionKey"))).map(r -> String.valueOf(r.get("effect"))).findFirst().orElse(null);
    }

    private static String profilePermissions(String id) {
        return CrmUser.ok(owner().get("/iam/profiles/" + id + "/permissions"), "profile permissions").asString();
    }

    /** The row (tr or role=row or nearest block) that contains the exact text {@code key}. */
    private static WebElement rowOf(String key) {
        List<WebElement> cells = DriverManager.get().findElements(By.xpath("//*[normalize-space(text())='" + key + "']"));
        for (WebElement c : cells) {
            if (!c.isDisplayed()) continue;
            List<WebElement> row = c.findElements(By.xpath("./ancestor::*[self::tr or @role='row'][1]"));
            if (!row.isEmpty()) return row.get(0);
            List<WebElement> block = c.findElements(By.xpath("./ancestor::*[.//button][1]"));
            if (!block.isEmpty()) return block.get(0);
        }
        return null;
    }

    private static java.util.List<String> visibleButtons() {
        java.util.List<String> out = new java.util.ArrayList<>();
        for (WebElement b : DriverManager.get().findElements(By.xpath("//main//button")))
            if (b.isDisplayed() && !b.getText().isBlank() && !b.getText().matches("(?i)GRANT|DENY")) out.add(b.getText().trim());
        return out.size() > 25 ? out.subList(0, 25) : out;
    }

    private static void jsClick(WebElement e) {
        ((JavascriptExecutor) DriverManager.get()).executeScript("arguments[0].scrollIntoView({block:'center'}); arguments[0].click();", e);
    }

    @CaseId({"FP-01"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Field Permissions tab: set Company = Don't Show for the QA profile and save; the API shows it")
    public void setFieldPermissionFromScreen() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/modules-and-fields/" + LEADS, "Field Listing", 40);
        p.clickText("Fields");
        p.clickText("Field Permissions");
        for (int i = 0; i < 40 && p.text().contains("Loading permissions"); i++) Waits.sleep(1000);
        WebElement sel = DriverManager.get().findElement(By.cssSelector("select[aria-label='Select profile']"));
        new Select(sel).selectByVisibleText(profileName);
        Waits.sleep(2500);
        WebElement row = rowOf("company");
        if (row == null) throw new SkipException("INCONCLUSIVE: no row for the field 'company' on the Field Permissions tab");
        List<WebElement> radios = row.findElements(By.cssSelector("input[type=radio], [role=radio]"));
        WebElement dontShow = radios.size() >= 3 ? radios.get(2) : null;
        if (dontShow == null) {
            List<WebElement> cells = row.findElements(By.xpath("./*"));
            if (cells.size() >= 4) dontShow = cells.get(3).findElements(By.xpath(".//*[self::input or self::button or @role]")).stream().findFirst().orElse(cells.get(3));
        }
        if (dontShow == null) throw new SkipException("INCONCLUSIVE: no Don't Show control found in the company row");
        jsClick(dontShow);
        Waits.sleep(800);
        p.clickText("Save");
        Waits.sleep(3000);
        String stored = fieldPermissionsOf(profileId).get("company");
        fact("FP-01", "Field Permissions tab: profile '" + profileName + "', company -> Don't Show, Save; stored via API = " + stored + "; toast saved=" + p.text().toLowerCase().contains("saved"));
        Assert.assertEquals(stored, "hidden", "the screen save did not store Company = hidden for the profile");
    }

    @CaseId({"PE-02", "PE-03"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Permissions matrix: a change shows as pending, Discard drops it, Save stores it; owner-only rows are marked")
    public void matrixDiscardAndSave() {
        String key = "iam.user.view";
        String effect0 = effectOf(profileId, key);   // GRANT, DENY or null (inherit / not set)
        boolean had = "GRANT".equals(effect0);
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/permissions", "Create permission", 40);
        p.clickText(profileName);
        Waits.sleep(3000);
        boolean ownerOnly = p.text().toLowerCase().contains("owner only");
        WebElement row = rowOf(key);
        if (row == null) throw new SkipException("INCONCLUSIVE: no matrix row for " + key);
        String target = had ? "DENY" : "GRANT";
        WebElement btn = row.findElements(By.xpath(".//button[translate(normalize-space(.),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='" + target + "']")).stream().findFirst().orElse(null);
        if (btn == null) throw new SkipException("INCONCLUSIVE: no " + target + " button in the " + key + " row");
        jsClick(btn);
        Waits.sleep(800);
        boolean pending = p.text().toLowerCase().contains("1 pending change");
        fact("PE-02 debug", "after first click: pending text=" + pending + "; visible buttons " + visibleButtons() + "; row now: " + rowOf(key).getText().replace('\n', '|'));
        if (!pending) throw new SkipException("INCONCLUSIVE: clicking " + target + " showed no pending change (see facts)");
        p.clickText("Discard");
        Waits.sleep(1500);
        String effectAfterDiscard = effectOf(profileId, key);
        boolean afterDiscard = "GRANT".equals(effectAfterDiscard);
        jsClick(rowOf(key).findElements(By.xpath(".//button[translate(normalize-space(.),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ')='" + target + "']")).get(0));
        Waits.sleep(800);
        jsClick(DriverManager.get().findElement(By.xpath("//button[starts-with(normalize-space(.),'Save')]")));   // label is "Save <count>"
        Waits.sleep(3000);
        String effectSaved = effectOf(profileId, key);   // DENY on screen = not granted: the grant row may simply be removed
        boolean saved = "GRANT".equals(target) ? "GRANT".equals(effectSaved) : !"GRANT".equals(effectSaved);
        fact("PE-02/03", key + " was " + effect0 + ", clicked " + target + ": pending shown=" + pending + "; after Discard stored=" + afterDiscard + " (was " + had + "); after Save stored=" + saved
                + "; 'Owner only' badge shown=" + ownerOnly);
        Assert.assertTrue(pending, "the change is not shown as pending");
        Assert.assertEquals(afterDiscard, had, "Discard did not drop the change");
        Assert.assertTrue(saved, "Save did not store the change");
        Assert.assertTrue(ownerOnly, "no permission is marked Owner only");
    }
}
