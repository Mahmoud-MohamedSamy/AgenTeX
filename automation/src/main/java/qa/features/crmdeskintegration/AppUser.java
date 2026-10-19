package qa.features.crmdeskintegration;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.testng.SkipException;
import qa.core.auth.Credentials;
import qa.core.config.Config;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * One TAVI user signed in through the API (POST /iam/auth/login on the CRM host, x-tenant-id), talking to either app:
 * {@link #crm()} sends x-app-key crm to the CRM host, {@link #desk()} sends x-app-key desk to the Desk host. Same token.
 * One sign-in per account per JVM; a 429 stops every further call (shared accounts must not be locked).
 * Tokens and passwords are never logged (Authorization is masked in Allure).
 */
public final class AppUser {
    private static final Map<String, AppUser> SIGNED_IN = new ConcurrentHashMap<>();
    private static final List<String> FILES = List.of(
            Config.get("crm.credentials.file", "../docs/Credentials/Microsoft Edge Passwords.csv"),
            Config.get("crmdesk.extraCredentials", ".auth/extra-credentials.csv"));
    private static final String HOST = "staging-crm.taviportal.com";
    private static volatile String rateLimited;

    public final String email;
    private String access;
    private String refresh;
    private long at;

    private AppUser(String email) {
        this.email = email;
    }

    public static AppUser as(String email) {
        if (rateLimited != null) throw new SkipException("INCONCLUSIVE: sign-in rate-limited earlier in this run (" + rateLimited + ") - not retried");
        return SIGNED_IN.computeIfAbsent(email, e -> {
            AppUser u = new AppUser(e);
            u.login();
            return u;
        });
    }

    /** Calls to the CRM app (x-app-key crm). */
    public App crm() {
        return new App(CrmDeskFeature.CRM, "crm");
    }

    /** Calls to the Desk app (x-app-key desk). */
    public App desk() {
        return new App(CrmDeskFeature.DESK, "desk");
    }

    private static Credentials creds(String email) {
        RuntimeException last = null;
        for (String f : FILES) {
            try {
                return Credentials.find(f, HOST, email);
            } catch (RuntimeException e) {
                last = e;
            }
        }
        throw last;
    }

    private synchronized void login() {
        Credentials c = creds(email);
        Response r = base(CrmDeskFeature.CRM).header("x-tenant-id", CrmDeskFeature.TENANT)
                .body(Map.of("email", c.email, "password", c.password(), "device_label", "qa-automation", "remember_me", true))
                .post("/iam/auth/login");
        if (r.statusCode() == 429) {
            rateLimited = email;
            throw new SkipException("INCONCLUSIVE: sign-in rate-limited (429) for " + email + " - stop, do not retry");
        }
        if (r.statusCode() != 200) throw new IllegalStateException("Sign-in failed for " + email + ": " + r.statusCode());
        access = r.jsonPath().getString("data.access_token");
        refresh = r.jsonPath().getString("data.refresh_token");
        at = System.currentTimeMillis();
    }

    private synchronized String token() {
        if (System.currentTimeMillis() - at > 4 * 60_000) {
            Response r = base(CrmDeskFeature.CRM).header("x-tenant-id", CrmDeskFeature.TENANT).body(Map.of("refresh_token", refresh)).post("/iam/auth/refresh");
            if (r.statusCode() == 200 && r.jsonPath().getBoolean("success")) {
                access = r.jsonPath().getString("data.access_token");
                String nr = r.jsonPath().getString("data.refresh_token");
                if (nr != null) refresh = nr;
                at = System.currentTimeMillis();
            } else login();
        }
        return access;
    }

    static RequestSpecification base(String host) {
        return RestAssured.given().baseUri(host + "/api/v1").contentType(ContentType.JSON).relaxedHTTPSValidation()
                .config(RestAssured.config().logConfig(io.restassured.config.LogConfig.logConfig()
                                .blacklistHeaders(List.of("Authorization", "Cookie", "Set-Cookie")))
                        .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                                .setParam("http.connection.timeout", 30000).setParam("http.socket.timeout", 90000)));
    }

    /** Request to one app without any token (for the 401 rows). */
    public static RequestSpecification anonymous(String host, String appKey) {
        return base(host).filter(new AllureRestAssured()).header("x-tenant-id", CrmDeskFeature.TENANT).header("x-app-key", appKey);
    }

    /** Returns the response if 2xx, else throws: a failed read must never look like "not there". */
    public static Response ok(Response r, String what) {
        if (r.statusCode() / 100 != 2) throw new IllegalStateException(what + " returned " + r.statusCode() + ": " + r.asString());
        return r;
    }

    /** One app (host + x-app-key) as this user. Staging drops connections now and then: retried up to 3 times. */
    public final class App implements IntegrationApi.Http {
        private final String host;
        private final String key;

        App(String host, String key) {
            this.host = host;
            this.key = key;
        }

        public RequestSpecification req() {
            return base(host).filter(new AllureRestAssured()).header("x-tenant-id", CrmDeskFeature.TENANT).header("x-app-key", key)
                    .header("Authorization", "Bearer " + token());
        }

        private Response call(java.util.function.Supplier<Response> c) {
            if (rateLimited != null) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run (" + rateLimited + ") - stopped");
            Exception last = null;
            for (int i = 0; i < 4; i++) {
                try {
                    Response r = c.get();
                    if (r.statusCode() == 401) {
                        at = 0;
                        r = c.get();
                    }
                    if (r.statusCode() == 429) {
                        rateLimited = email + " (API call)";
                        throw new SkipException("INCONCLUSIVE: HTTP 429 rate limit - stop, do not retry");
                    }
                    if (r.statusCode() != 502 && r.statusCode() != 503 && r.statusCode() != 504) return r;
                } catch (SkipException e) {
                    throw e;
                } catch (Exception e) {
                    last = e;
                }
                sleep(4000L * (i + 1));
            }
            if (last != null) throw last instanceof RuntimeException re ? re : new IllegalStateException(last.getClass().getSimpleName() + ": " + last.getMessage(), last);
            return c.get();
        }

        public Response get(String path) {
            return call(() -> req().get(path));
        }

        public Response post(String path, Object body) {
            return call(() -> body == null ? req().post(path) : req().body(body).post(path));
        }

        public Response put(String path, Object body) {
            return call(() -> req().body(body).put(path));
        }

        public Response delete(String path) {
            return call(() -> req().delete(path));
        }
    }

    static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public String toString() {
        return email;
    }
}
