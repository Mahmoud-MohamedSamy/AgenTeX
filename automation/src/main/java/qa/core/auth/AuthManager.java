package qa.core.auth;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import qa.core.base.Waits;
import qa.core.config.Config;
import qa.features.login.LoginPage;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Log in once, reuse the session everywhere. Many apps rate-limit logins or revoke the previous token
 * on every new login, so a fresh login per test is both slow and harmful.
 *
 * The session (cookies + localStorage + sessionStorage) is saved to .auth/{host}_{account}.json (gitignored)
 * and reused across runs while younger than auth.maxAgeMinutes and still accepted by the app.
 */
public final class AuthManager {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static boolean verified;
    private static String failure;
    private static int logins;

    private AuthManager() {
    }

    public static synchronized void signIn(WebDriver driver) {
        // One login attempt per run: after a failure (wrong password, 429) every later test would retry
        // and could lock the shared account or sign teammates out, so they fail fast with the first error.
        if (failure != null) throw new IllegalStateException("Not signed in - login already failed in this run: " + failure);
        Credentials creds = Credentials.load();
        Path file = sessionFile(creds);
        if (verified && Files.exists(file) && restore(driver, file)) return; // already proven valid in this run
        if (Files.exists(file) && fresh(file) && restore(driver, file) && signedIn(driver)) {
            verified = true;
            return;
        }
        try {
            login(driver, creds, file);
        } catch (RuntimeException e) {
            failure = e.getMessage();
            throw e;
        }
    }

    private static void login(WebDriver driver, Credentials creds, Path file) {
        logins++;
        driver.manage().deleteAllCookies();
        driver.get(Config.baseUrl() + Config.get("auth.loginPath", "/login"));
        Waits.pageReady(driver);
        new LoginPage().login(creds.email, creds.password());
        Pattern login = loginPattern();
        if (!Waits.until(() -> !login.matcher(driver.getCurrentUrl()).find(), Config.getInt("auth.timeout.seconds", 60))) {
            String body = driver.findElement(org.openqa.selenium.By.tagName("body")).getText();
            throw new IllegalStateException("Login did not leave the login page (" + driver.getCurrentUrl() + "). Page says: "
                    + body.substring(0, Math.min(300, body.length())).replace('\n', ' ')
                    + " — if this is a rate limit (HTTP 429), wait a few minutes; the saved session avoids repeat logins.");
        }
        Waits.sleep(Config.getInt("auth.settleMs", 3000));
        save(driver, file);
        verified = true;
    }

    /** Real logins (form submissions) in this run; 0 or 1 when the saved session works. */
    public static synchronized int loginsThisRun() {
        return logins;
    }

    /** Saved session of the configured account on the configured host (may not exist yet). */
    public static Path savedSession() {
        return sessionFile(Credentials.load());
    }

    /** Forget the saved session (e.g. the app revoked it). The next signIn logs in again. */
    public static synchronized void invalidate() {
        verified = false;
        failure = null;
        try {
            Credentials creds = Credentials.load();
            Files.deleteIfExists(sessionFile(creds));
        } catch (Exception ignored) {
        }
    }

    /** .auth/<host>_<account>.json - a session belongs to one host and one account. */
    private static Path sessionFile(Credentials creds) {
        String host = java.net.URI.create(Config.baseUrl()).getHost();
        return Config.projectDir().resolve(".auth").resolve((host + "_" + creds.account).replaceAll("[^A-Za-z0-9._-]", "_") + ".json");
    }

    public static boolean onLoginPage(WebDriver driver) {
        return loginPattern().matcher(driver.getCurrentUrl()).find();
    }

    private static Pattern loginPattern() {
        return Pattern.compile(Config.get("auth.loginUrlPattern", "/login|/sign-?in|/auth"));
    }

    private static boolean fresh(Path f) {
        try {
            Duration age = Duration.between(Files.getLastModifiedTime(f).toInstant(), Instant.now());
            return age.toMinutes() < Config.getInt("auth.maxAgeMinutes", 240);
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean signedIn(WebDriver driver) {
        driver.get(Config.baseUrl() + Config.get("auth.checkPath", "/"));
        Waits.pageReady(driver);
        // A single-page app may redirect to the login page only after its scripts load: watch for a while.
        int seconds = Config.getInt("auth.checkSeconds", 15);
        if (Waits.until(() -> onLoginPage(driver), seconds)) return false;
        // Short-lived access tokens are refreshed by the app on load; a revoked session leaves no token.
        return hasToken(driver) || Waits.until(() -> hasToken(driver), seconds);
    }

    private static boolean hasToken(WebDriver driver) {
        String script = Config.get("api.tokenScript", "");
        if (script.isEmpty()) return true; // nothing to check against
        try {
            String t = fromBrowser(driver, script);
            return t != null && !t.isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Save the session again at the end of a signed-in test. Apps that rotate refresh tokens (each refresh
     * issues a new one and invalidates the old) would otherwise leave a stale token in .auth/, and restoring
     * it in the next test can make the server revoke the whole session.
     */
    public static synchronized void persist(WebDriver driver) {
        if (!verified || failure != null) return;
        try {
            if (onLoginPage(driver) || !hasToken(driver)) return; // signed out meanwhile: keep the last good copy
            save(driver, sessionFile(Credentials.load()));
        } catch (Exception e) {
            System.err.println("[auth] could not persist session: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private static void save(WebDriver driver, Path file) {
        try {
            Map<String, Object> s = new LinkedHashMap<>();
            List<Map<String, Object>> cookies = new ArrayList<>();
            for (Cookie c : driver.manage().getCookies()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("name", c.getName());
                m.put("value", c.getValue());
                m.put("domain", c.getDomain());
                m.put("path", c.getPath());
                m.put("secure", c.isSecure());
                m.put("httpOnly", c.isHttpOnly());
                if (c.getExpiry() != null) m.put("expiry", c.getExpiry().getTime());
                cookies.add(m);
            }
            s.put("cookies", cookies);
            JavascriptExecutor js = (JavascriptExecutor) driver;
            s.put("localStorage", js.executeScript("return Object.assign({}, window.localStorage);"));
            s.put("sessionStorage", js.executeScript("return Object.assign({}, window.sessionStorage);"));
            Files.createDirectories(file.getParent());
            Files.writeString(file, JSON.writeValueAsString(s));
        } catch (Exception e) {
            System.err.println("[auth] could not save session: " + e.getMessage());
        }
    }

    private static boolean restore(WebDriver driver, Path file) {
        try {
            Map<String, Object> s = JSON.readValue(file.toFile(), new TypeReference<>() {
            });
            // Storage is per origin: land on a cheap page of the app first, then inject.
            driver.get(Config.baseUrl() + Config.get("auth.loginPath", "/login"));
            Waits.pageReady(driver);
            for (Map<String, Object> c : (List<Map<String, Object>>) s.getOrDefault("cookies", List.of())) {
                Cookie.Builder b = new Cookie.Builder((String) c.get("name"), (String) c.get("value"))
                        .path((String) c.getOrDefault("path", "/"))
                        .isSecure(Boolean.TRUE.equals(c.get("secure")))
                        .isHttpOnly(Boolean.TRUE.equals(c.get("httpOnly")));
                if (c.get("expiry") != null) b.expiresOn(new Date(((Number) c.get("expiry")).longValue()));
                // Keep a parent-domain cookie (.example.com) on its domain, so it is still sent to sibling hosts
                String domain = (String) c.get("domain");
                String host = java.net.URI.create(Config.baseUrl()).getHost();
                if (domain != null && domain.startsWith(".") && host.endsWith(domain)) b.domain(domain);
                try {
                    driver.manage().addCookie(b.build());
                } catch (Exception ignored) {
                    // cookie for another domain — skip
                }
            }
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("const s = arguments[0] || {}; for (const k in s) localStorage.setItem(k, s[k]);", s.get("localStorage"));
            js.executeScript("const s = arguments[0] || {}; for (const k in s) sessionStorage.setItem(k, s[k]);", s.get("sessionStorage"));
            return true;
        } catch (Exception e) {
            System.err.println("[auth] could not restore session: " + e.getMessage());
            return false;
        }
    }

    /** Value from the app's storage (e.g. a bearer token) for API calls; see ApiClient. */
    public static String fromBrowser(WebDriver driver, String script) {
        Object o = ((JavascriptExecutor) driver).executeScript(script);
        return o == null ? null : o.toString();
    }
}
