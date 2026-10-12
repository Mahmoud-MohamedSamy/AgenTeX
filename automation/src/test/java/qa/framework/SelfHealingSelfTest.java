package qa.framework;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.NoAuth;
import qa.core.base.BaseTest;
import qa.core.config.Config;
import qa.core.healing.SelfHealingLocator;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertThrows;
import static org.testng.Assert.assertTrue;

/** Proves the self-healing locator offline, on a local page. Run: mvnw test -Dsuite=selftest */
@NoAuth
public class SelfHealingSelfTest extends BaseTest {
    private static final String F = "selftest";
    private static final String P = "SelfTestPage";
    private final Path res = Config.projectDir().resolve("src/test/resources");
    private final Path locators = res.resolve("features/selftest/locators.json");

    @BeforeClass(alwaysRun = true)
    public void resetLocators() throws Exception {
        Files.createDirectories(locators.getParent());
        Files.copy(res.resolve("selftest/locators.pristine.json"), locators, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
    }

    private WebDriver openFixture() {
        WebDriver d = driver();
        d.get(res.resolve("selftest/page.html").toUri().toString());
        return d;
    }

    private JsonNode saved() throws Exception {
        return new ObjectMapper().readTree(locators.toFile()).get(P);
    }

    @Test(priority = 1, groups = "selftest")
    public void primaryCandidateIsUsedWithoutHealing() throws Exception {
        WebDriver d = openFixture();
        SelfHealingLocator.findWithin(d, F, P, "ruleName", 5).sendKeys("x");
        assertEquals(saved().get("ruleName").get("candidates").get(0).get("by").asText(), "ariaLabel");
    }

    @Test(priority = 2, groups = "selftest")
    public void brokenPrimaryIsHealedAndPromoted() throws Exception {
        WebDriver d = openFixture();
        assertEquals(SelfHealingLocator.findWithin(d, F, P, "saveButton", 10).getText(), "Save");
        JsonNode first = saved().get("saveButton").get("candidates").get(0);
        assertEquals(first.get("by").asText(), "role", "working fallback should be promoted to the top");
        assertTrue(saved().get("saveButton").get("lastHeal").asText().contains("promoted"));
    }

    @Test(priority = 3, groups = "selftest")
    public void changedElementIsFoundByFingerprint() throws Exception {
        WebDriver d = openFixture();
        SelfHealingLocator.findWithin(d, F, P, "submitButton", 5); // learns the fingerprint
        ((JavascriptExecutor) d).executeScript("const b=document.getElementById('submit'); b.id='submit-order'; b.className='btn primary large';");
        assertEquals(SelfHealingLocator.findWithin(d, F, P, "submitButton", 3).getText(), "Submit order");
        JsonNode first = saved().get("submitButton").get("candidates").get(0);
        assertEquals(first.get("value").asText(), "submit-order", "fingerprint heal should add the new id as top candidate");
    }

    @Test(priority = 4, groups = "selftest")
    public void missingElementIsReportedBroken() throws Exception {
        WebDriver d = openFixture();
        assertThrows(NoSuchElementException.class, () -> SelfHealingLocator.findWithin(d, F, P, "ghost", 2));
        String report = Files.readString(Config.projectDir().resolve("target/healing/healing-report.json"));
        assertTrue(report.contains("\"BROKEN\"") && report.contains("SelfTestPage.ghost"));
    }
}
