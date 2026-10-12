package qa.features.login;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.NoAuth;
import qa.core.auth.AuthManager;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.core.config.Config;

import java.nio.file.Files;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;

/**
 * Login and session handling. The signed-in tests do NOT log in themselves: BaseTest signs in through
 * AuthManager, which logs in at most once per run and otherwise reuses .auth/<host>_<account>.json.
 * No wrong-password test on purpose: failed logins count toward the shared account's rate limit (429).
 */
public class LoginTest extends BaseTest {

    @NoAuth
    @Test(groups = {"smoke", "regression", "login"}, description = "Login page shows the Sign in form (email, password, Sign in, Forgot password)")
    @CaseId("LGN-001")
    public void loginPageShowsSignInForm() {
        LoginPage page = new LoginPage().open();
        assertTrue(page.formShown(60), "login form (heading, email, password, Sign in) not shown");
        assertTrue(page.headingText().contains("Sign in"), "heading: " + page.headingText());
        assertTrue(page.forgotPasswordOffered(), "'Forgot password?' missing");
    }

    @NoAuth
    @Test(groups = {"regression", "login"}, description = "The eye toggle reveals the password field")
    @CaseId("LGN-002")
    public void showPasswordRevealsField() {
        LoginPage page = new LoginPage().open();
        assertTrue(page.formShown(60), "login form not shown");
        assertEquals(page.passwordTypeAfterToggle(), "text", "password input type after clicking 'Show password'");
    }

    @Test(groups = {"smoke", "regression", "login"}, description = "A signed-in session lands in the app, is saved, and gives the API a token")
    @CaseId("LGN-003")
    public void signedInSessionLandsInApp() {
        driver().get(Config.baseUrl() + Config.get("auth.checkPath", "/"));
        Waits.pageReady(driver());
        assertFalse(Waits.until(() -> AuthManager.onLoginPage(driver()), 15), "bounced to the login page: " + driver().getCurrentUrl());
        assertFalse(new LoginPage().formShown(1), "login form still shown at " + driver().getCurrentUrl());
        assertTrue(Files.exists(AuthManager.savedSession()), "session not saved to " + AuthManager.savedSession());
        String script = Config.get("api.tokenScript", "");
        if (!script.isEmpty()) {
            String token = AuthManager.fromBrowser(driver(), script);
            assertTrue(token != null && token.split("\\.").length == 3, "api.tokenScript found no JWT in the signed-in browser");
        }
    }

    @Test(groups = {"regression", "login"}, dependsOnMethods = "signedInSessionLandsInApp",
            description = "The next test reuses the saved session: no second login in the same run")
    @CaseId("LGN-004")
    public void sessionIsReusedWithoutNewLogin() {
        driver().get(Config.baseUrl() + Config.get("auth.checkPath", "/"));
        Waits.pageReady(driver());
        assertFalse(Waits.until(() -> AuthManager.onLoginPage(driver()), 15), "saved session rejected: " + driver().getCurrentUrl());
        assertTrue(AuthManager.loginsThisRun() <= 1, "logins this run: " + AuthManager.loginsThisRun());
    }
}
