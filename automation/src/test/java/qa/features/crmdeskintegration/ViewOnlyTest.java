package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.DeskRecordPage;
import qa.features.crmdeskintegration.pages.IntegrationSettingsPage;

import java.nio.file.Path;
import java.util.Map;

import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * A5 view-only admin (user OK 21 Oct 2026: "go ahead with 2d"). The QA agent fedelav803 gets a per-user override
 * desk:integration:view = allow (no tenant profile changes), is checked in the browser and through the API, and the
 * override is cleared in finally. Run with the agent's browser account:
 * -Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com
 */
public class ViewOnlyTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/remaining");
    static final String KEY = "desk:integration:view";

    static AppUser.App owner() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    @CaseId("A5")
    @Test(groups = {"crmdesk", "crmdesk-remaining"}, description = "View permission only: settings readable, every control disabled, writes refused")
    public void viewOnly() {
        AppUser.App agent = AppUser.as(CrmDeskFeature.AGENT).desk();
        fact("A5", "before: agent GET config -> " + agent.get(INT + "/config").statusCode());
        Response set = owner().post("/iam/users/" + WriteBase.AGENT_ID + "/overrides?app_key=desk", Map.of("permission_key", KEY, "effect", "GRANT", "reason", "QA CD A5 view-only check"));
        fact("A5", "override " + KEY + "=GRANT for the QA agent -> " + set.statusCode() + " " + WriteRunTest.trim(set.asString(), 200));
        try {
            AppUser.ok(set, "set override");
            AppUser.sleep(3000);
            String rv = String.valueOf(AppUser.ok(owner().get(INT + "/config"), "config").jsonPath().getString("data.row_version"));
            Map<String, Object> body = AppUser.ok(owner().get(INT + "/config"), "config").jsonPath().getMap("data");
            body.remove("status");
            Response get = agent.get(INT + "/config");
            Response put = agent.putOnce(INT + "/config", body);
            Response pause = agent.post(INT + "/pause", Map.of("reason", "QA CD A5"));
            fact("A5", "agent with view only: GET config -> " + get.statusCode() + "; PUT config -> " + put.statusCode() + "; pause -> " + pause.statusCode());
            if (pause.statusCode() / 100 == 2) fact("A5", "pause took effect -> owner resumes " + owner().post(INT + "/resume", Map.of()).statusCode());

            IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
            String t = p.text();
            boolean hint = t.contains("You can view these settings but not change them.");
            boolean denied = t.contains("Integration settings are restricted");
            int enabled = 0;
            StringBuilder en = new StringBuilder();
            for (String label : new String[]{"Pause sync", "Disconnect", "Connect", "Save"})
                for (WebElement b : driver().findElements(By.xpath("//button[normalize-space(.)='" + label + "']")))
                    if (b.isDisplayed() && b.isEnabled() && b.getAttribute("aria-disabled") == null) {
                        enabled++;
                        en.append(label).append(' ');
                    }
            new DeskRecordPage().shot(OUT.resolve("A5-view-only.png"));
            p.tab("Configuration Details");
            int editEnabled = 0;
            for (WebElement b : driver().findElements(By.xpath("//button[normalize-space(.)='Edit' or normalize-space(.)='Configure']")))
                if (b.isDisplayed() && b.isEnabled() && b.getAttribute("aria-disabled") == null) editEnabled++;
            new DeskRecordPage().shot(OUT.resolve("A5-view-only-config.png"));
            String rv2 = String.valueOf(AppUser.ok(owner().get(INT + "/config"), "config").jsonPath().getString("data.row_version"));
            fact("A5", "screen: read-only hint=" + hint + " restricted page=" + denied + "; enabled action buttons: " + (enabled == 0 ? "none" : en.toString().trim()) + "; enabled Edit/Configure=" + editEnabled + "; settings unchanged=" + rv.equals(rv2));
            Assert.assertEquals(get.statusCode(), 200, "view permission does not allow reading");
            Assert.assertTrue(put.statusCode() == 403 && pause.statusCode() == 403, "view-only user could write (PUT " + put.statusCode() + ", pause " + pause.statusCode() + ")");
            Assert.assertTrue(hint, "no 'You can view these settings but not change them.' hint");
            Assert.assertEquals(enabled, 0, "action buttons enabled for a view-only user: " + en);
        } finally {
            Response clr = owner().delete("/iam/users/" + WriteBase.AGENT_ID + "/overrides/" + KEY.replace(":", "%3A") + "?app_key=desk&reason=QA%20CD%20A5%20done");
            AppUser.sleep(3000);
            fact("A5", "clear override -> " + clr.statusCode() + "; agent GET config now -> " + agent.get(INT + "/config").statusCode()
                    + "; overrides left: " + WriteRunTest.trim(owner().get("/iam/users/" + WriteBase.AGENT_ID + "/overrides?app_key=desk").asString(), 200));
        }
    }
}
