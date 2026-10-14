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
        return token;
    }

    /** Call again after the app refreshed its token (401). */
    public void resetToken() {
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
