package qa.features.login;

import org.openqa.selenium.Keys;
import qa.core.base.BasePage;
import qa.core.config.Config;

/** Works for one-step and two-step (email → Next → password) login forms. Used by AuthManager. */
public class LoginPage extends BasePage {
    public static final String FEATURE = "login";

    public LoginPage() {
        super(FEATURE);
    }

    public LoginPage open() {
        open(Config.get("auth.loginPath", "/login"));
        return this;
    }

    /** Heading, email, password and submit are all visible (no credentials typed). */
    public boolean formShown(int seconds) {
        return isShown("email", seconds) && isShown("password", 2) && isShown("submit", 2) && isShown("heading", 2);
    }

    public String headingText() {
        return text("heading");
    }

    public boolean forgotPasswordOffered() {
        return isShown("forgotPassword", 3);
    }

    /** Type of the password input after clicking the eye toggle: "text" means the password is revealed. */
    public String passwordTypeAfterToggle() {
        click("showPassword");
        return el("password").getAttribute("type");
    }

    public void login(String email, String password) {
        type("email", email);
        if (!isShown("password", 2)) {
            if (isShown("next", 1)) click("next");
            else el("email").sendKeys(Keys.ENTER);
        }
        step("Type password", () -> {
            el("password").sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
            el("password").sendKeys(password); // not via type(): keeps the secret out of the report step name
        });
        if (isShown("submit", 1)) click("submit");
        else el("password").sendKeys(Keys.ENTER);
    }
}
