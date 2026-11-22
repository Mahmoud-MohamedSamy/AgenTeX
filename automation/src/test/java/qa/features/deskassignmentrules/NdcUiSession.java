package qa.features.deskassignmentrules;

import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import qa.core.auth.Credentials;
import qa.core.base.Waits;
import qa.core.config.Config;
import qa.features.login.LoginPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Browser session of ndc-staging-owner in the NDC-Staging organization ("Wonder Travel", tenant …0004) for the UI tests.
 * The framework's AuthManager prefers qa.email from the environment (another account / organization on this machine),
 * so this feature signs in itself: ONE form login per run, then the cookies + localStorage are kept in memory and
 * re-captured after every test (the refresh token rotates). Nothing is written to disk; no secret is printed.
 */
final class NdcUiSession {
    static final String TENANT = "a7a7a7a7-0000-0000-0000-000000000004";
    private static List<Cookie> cookies;
    private static Map<String, String> storage;
    private static String failure;

    private NdcUiSession() {
    }

    static synchronized void signIn(WebDriver d) {
        if (failure != null) throw new IllegalStateException("UI sign-in already failed in this run: " + failure);
        if (cookies != null) {
            restore(d);
            return;
        }
        try {
            Credentials c = Credentials.find("../docs/Credentials/TAVI Desk Credentials.csv", "", DeskAssignmentRulesFeature.OWNER_LABEL);
            d.get(Config.baseUrl() + "/login");
            Waits.pageReady(d);
            new LoginPage().login(c.email, c.password());
            for (int i = 0; i < 40; i++) {
                Waits.sleep(500);
                String body = d.findElement(By.tagName("body")).getText();
                if (!body.contains("Choose an organization")) continue;
                List<org.openqa.selenium.WebElement> o = d.findElements(By.xpath("//*[normalize-space(text())='Wonder Travel']"));
                if (!o.isEmpty()) o.get(0).click();
                break;
            }
            if (!Waits.until(() -> !d.getCurrentUrl().contains("/login"), 90)) throw new IllegalStateException("still on the login page");
            Waits.sleep(4000);
            String t = tenant(d);
            if (!TENANT.equals(t)) throw new IllegalStateException("signed in to organization " + t + ", not NDC-Staging");
            capture(d);
        } catch (RuntimeException e) {
            failure = e.getMessage();
            throw e;
        }
    }

    private static String tenant(WebDriver d) {
        return String.valueOf(((JavascriptExecutor) d).executeScript("return localStorage.getItem('aw_auth_tenant_id');"));
    }

    @SuppressWarnings("unchecked")
    static synchronized void capture(WebDriver d) {
        try {
            if (!d.getCurrentUrl().startsWith(Config.baseUrl())) return;
            List<Cookie> c = new ArrayList<>(d.manage().getCookies());
            if (c.stream().noneMatch(x -> x.getName().endsWith("_access_token"))) return;
            cookies = c;
            storage = new LinkedHashMap<>((Map<String, String>) ((JavascriptExecutor) d).executeScript(
                    "const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);o[k]=localStorage.getItem(k);}return o;"));
            storage.put("anyware_language", "en");
            storage.put("anyware_language_explicit", "en");
        } catch (RuntimeException ignored) {
        }
    }

    private static void restore(WebDriver d) {
        // an app page (not /favicon.ico): Edge 158 refuses localStorage on the image document ("Access is denied")
        d.get(Config.baseUrl() + "/login");
        Waits.pageReady(d);
        for (Cookie c : cookies) {
            try {
                d.manage().addCookie(c);
            } catch (RuntimeException ignored) {
            }
        }
        ((JavascriptExecutor) d).executeScript("const s=arguments[0];for(const k in s)localStorage.setItem(k,s[k]);", storage);
    }
}
