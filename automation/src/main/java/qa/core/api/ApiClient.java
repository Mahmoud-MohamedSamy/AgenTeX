package qa.core.api;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.testng.SkipException;
import qa.core.auth.AuthManager;
import qa.core.config.Config;
import qa.core.driver.DriverManager;

/**
 * REST calls with the signed-in browser's identity — for test-data setup/cleanup and for asserting
 * what the UI saved. The bearer token is read from the browser with api.tokenScript (JavaScript
 * returning the token), and extra headers come from api.headers ("k: v; k2: v2").
 */
public class ApiClient {
    private final String base;
    private String token;

    public ApiClient() {
        this.base = Config.get("api.baseUrl", Config.baseUrl() + "/api/v1");
    }

    public RequestSpecification req() {
        RequestSpecification r = RestAssured.given().baseUri(base).contentType(ContentType.JSON)
                // tokens and cookies are masked in the Allure request/response attachments
                .config(RestAssured.config().logConfig(io.restassured.config.LogConfig.logConfig()
                        .blacklistHeaders(java.util.List.of("Authorization", "Cookie", "Set-Cookie")))
                        // a stalled response must fail the call, not hang the run (seen on staging 12 Oct 2026)
                        .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                                .setParam("http.connection.timeout", 30000).setParam("http.socket.timeout", 90000)))
                .filter(new AllureRestAssured()).relaxedHTTPSValidation();
        String h = Config.get("api.headers", "");
        for (String pair : h.split(";")) {
            int i = pair.indexOf(':');
            if (i > 0) r.header(pair.substring(0, i).trim(), pair.substring(i + 1).trim());
        }
        String t = token();
        if (t != null && !t.isEmpty()) r.header("Authorization", "Bearer " + t);
        return r;
    }

    public String token() {
        if (token == null) {
            String script = Config.get("api.tokenScript", "");
            if (!script.isEmpty() && DriverManager.has()) token = AuthManager.fromBrowser(DriverManager.get(), script);
        }
        if ((token == null || token.isEmpty()) && !Config.get("api.loginPath", "").isEmpty()) token = apiToken();
        return token;
    }

    // --- API sign-in fallback (11 Nov 2026: Desk no longer keeps the access token in a readable cookie) ---
    // One sign-in per JVM with credentials.file/account, then refresh-token renewals; values are never logged.
    private static String apiAccess, apiRefresh;
    private static long apiAt;
    private static boolean apiStale;

    private static synchronized String apiToken() {
        boolean old = System.currentTimeMillis() - apiAt > 4 * 60_000L;
        if (apiAccess != null && !apiStale && !old) return apiAccess;
        if (apiRefresh != null) {
            Response r = authCall(Config.get("api.refreshPath", "/iam/auth/refresh"), java.util.Map.of("refresh_token", apiRefresh));
            if (r.statusCode() == 200 && r.jsonPath().getString("data.access_token") != null) return keep(r);
        }
        qa.core.auth.Credentials c = qa.core.auth.Credentials.load();
        Response r = authCall(Config.get("api.loginPath"), java.util.Map.of("email", c.email, "password", c.password(),
                "device_label", "qa-automation", "remember_me", true));
        if (r.statusCode() == 429) throw new SkipException("API sign-in rate limited (429) - stop and tell the user");
        if (r.statusCode() != 200 || r.jsonPath().getString("data.access_token") == null)
            throw new SkipException("API sign-in failed: HTTP " + r.statusCode());
        return keep(r);
    }

    private static String keep(Response r) {
        apiAccess = r.jsonPath().getString("data.access_token");
        String rt = r.jsonPath().getString("data.refresh_token");
        if (rt != null) apiRefresh = rt;
        apiAt = System.currentTimeMillis();
        apiStale = false;
        return apiAccess;
    }

    private static Response authCall(String path, Object body) {
        RequestSpecification r = RestAssured.given().baseUri(Config.get("api.baseUrl", Config.baseUrl() + "/api/v1"))
                .contentType(ContentType.JSON).relaxedHTTPSValidation();
        String h = Config.get("api.headers", "") + ";" + Config.get("api.loginHeaders", "");
        for (String pair : h.split(";")) {
            int i = pair.indexOf(':');
            if (i > 0) r.header(pair.substring(0, i).trim(), pair.substring(i + 1).trim());
        }
        return r.body(body).post(path); // no Allure filter here: the body holds the password and tokens
    }

    /** Call again after the app refreshed its token (401). */
    public void resetToken() {
        apiStale = true;
        token = null;
    }

    public Response get(String path) {
        return retry401(() -> req().get(path));
    }

    public Response post(String path, Object body) {
        return retry401(() -> body == null ? req().post(path) : req().body(body).post(path));
    }

    public Response patch(String path, Object body) {
        return retry401(() -> req().body(body).patch(path));
    }

    public Response put(String path, Object body) {
        return retry401(() -> req().body(body).put(path));
    }

    public Response delete(String path) {
        return retry401(() -> req().delete(path));
    }

    /**
     * Call at the start of a test that reads its verdict or cleans up through the API, before it changes
     * any data. Without a working token a result read returns 401/empty and a bug test can pass falsely,
     * and cleanup fails silently - so the test is SKIPPED (inconclusive), never passed.
     */
    public void requireAuth(String probePath) {
        if (!Config.get("api.tokenScript", "").isEmpty() && (token() == null || token().isEmpty()))
            throw new SkipException("API token not found in the browser (api.tokenScript) - fix config before this test can run safely");
        int s = get(probePath).statusCode();
        if (s / 100 != 2)
            throw new SkipException("API pre-check GET " + probePath + " returned " + s + " - check api.tokenScript / api.headers");
    }

    /** Returns the response if 2xx, else throws: a failed read must never look like "value not set". */
    public static Response ok(Response r, String what) {
        if (r.statusCode() / 100 != 2)
            throw new IllegalStateException(what + " returned " + r.statusCode() + ": " + r.asString());
        return r;
    }

    private Response retry401(java.util.function.Supplier<Response> call) {
        Response r = call.get();
        if (r.statusCode() == 401) {
            resetToken();
            r = call.get();
        }
        return r;
    }
}
