package qa.features.crmautomationorder;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import qa.core.auth.Credentials;
import qa.core.config.Config;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * One CRM user signed in through the API (POST /iam/auth/login with x-tenant-id), no browser needed.
 * Several users act in one test (submitter, reviewer, approver). Since 18 Oct 2026 a new sign-in no longer ends the
 * account's other sessions, so parallel runs may share accounts. Tokens live 5 minutes: refreshed before 4.
 * Tokens and passwords are never logged (Authorization is masked in Allure).
 */
public final class CrmUser {
    private static final Map<String, CrmUser> SIGNED_IN = new ConcurrentHashMap<>();
    private static final String CREDENTIALS = Config.get("crm.credentials.file", "../docs/Credentials/Microsoft Edge Passwords.csv");
    private static final String HOST = Config.get("crm.credentials.host", "staging-crm.taviportal.com");

    public final String email;
    private String userId;
    private String access;
    private String refresh;
    private long at;

    private CrmUser(String email) {
        this.email = email;
    }

    /** The signed-in user for this email (signs in once per JVM). */
    /** Set on the first 429: no further sign-in is attempted in this JVM (one rate limit must not become dozens of attempts). */
    private static volatile String rateLimited;

    public static CrmUser as(String email) {
        if (rateLimited != null) throw new org.testng.SkipException("INCONCLUSIVE: sign-in rate-limited earlier in this run (" + rateLimited + ") - not retried");
        return SIGNED_IN.computeIfAbsent(email, e -> {
            CrmUser u = new CrmUser(e);
            u.login();
            return u;
        });
    }


    public synchronized String id() {
        if (userId == null) {
            // /iam/me/profile answers without the usual {data: …} envelope
            io.restassured.path.json.JsonPath j = ok(get("/iam/me/profile"), "me").jsonPath();
            userId = j.getString("user_id") != null ? j.getString("user_id") : j.getString("data.user_id");
        }
        return userId;
    }

    private synchronized void login() {
        Credentials c = Credentials.find(CREDENTIALS, HOST, email);
        Response r = base().header("x-tenant-id", CrmOrderFeature.TENANT)
                .body(Map.of("email", c.email, "password", c.password(), "device_label", "qa-automation", "remember_me", true))
                .post("/iam/auth/login");
        if (r.statusCode() == 429) {
            rateLimited = email;
            throw new org.testng.SkipException("INCONCLUSIVE: sign-in rate-limited (429) for " + email + " - stop, do not retry");
        }
        if (r.statusCode() != 200) throw new IllegalStateException("Sign-in failed for " + email + ": " + r.statusCode());
        access = r.jsonPath().getString("data.access_token");
        refresh = r.jsonPath().getString("data.refresh_token");
        at = System.currentTimeMillis();
    }

    private synchronized String token() {
        if (System.currentTimeMillis() - at > 4 * 60_000) {
            Response r = base().header("x-tenant-id", CrmOrderFeature.TENANT).body(Map.of("refresh_token", refresh)).post("/iam/auth/refresh");
            if (r.statusCode() == 200 && r.jsonPath().getBoolean("success")) {
                access = r.jsonPath().getString("data.access_token");
                String nr = r.jsonPath().getString("data.refresh_token");
                if (nr != null) refresh = nr;
                at = System.currentTimeMillis();
                    } else login();
        }
        return access;
    }

    private static RequestSpecification base() {
        return RestAssured.given().baseUri(CrmOrderFeature.API).contentType(ContentType.JSON).relaxedHTTPSValidation()
                .config(RestAssured.config().logConfig(io.restassured.config.LogConfig.logConfig()
                                .blacklistHeaders(java.util.List.of("Authorization", "Cookie", "Set-Cookie")))
                        .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                                .setParam("http.connection.timeout", 30000).setParam("http.socket.timeout", 90000)));
    }

    public RequestSpecification req() {
        return base().filter(new AllureRestAssured()).header("x-tenant-id", CrmOrderFeature.TENANT).header("x-app-key", "crm")
                .header("Authorization", "Bearer " + token());
    }

    // staging drops connections now and then (seen 18 Oct 2026): retry the call up to 3 times on a network error or 5xx gateway
    // REST Assured throws SocketException / NoHttpResponseException / SocketTimeoutException as *checked* exceptions
    // without declaring them, so "catch (RuntimeException)" never saw them and no retry happened (run 1, 18 Oct 2026):
    // catch Exception and wrap the last one.
    private Response call(java.util.function.Supplier<Response> c) {
        if (rateLimited != null) throw new org.testng.SkipException("INCONCLUSIVE: HTTP 429 earlier in this run (" + rateLimited + ") - stopped");
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
                    System.out.println("[RATE-LIMIT] HTTP 429 for " + email + " - stopping all further calls in this JVM");
                    throw new org.testng.SkipException("INCONCLUSIVE: HTTP 429 rate limit - stop, do not retry");
                }
                if (r.statusCode() != 502 && r.statusCode() != 503 && r.statusCode() != 504) return r;
            } catch (org.testng.SkipException e) {
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

    public Response patch(String path, Object body) {
        return call(() -> req().body(body).patch(path));
    }

    public Response put(String path, Object body) {
        return call(() -> req().body(body).put(path));
    }

    public Response delete(String path) {
        return call(() -> req().delete(path));
    }

    /** Returns the response if 2xx, else throws: a failed read must never look like "not held" or "not fired". */
    public static Response ok(Response r, String what) {
        if (r.statusCode() / 100 != 2) throw new IllegalStateException(what + " returned " + r.statusCode() + ": " + r.asString());
        return r;
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
