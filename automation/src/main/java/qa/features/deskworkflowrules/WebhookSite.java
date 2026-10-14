package qa.features.deskworkflowrules;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import qa.core.base.Waits;

import java.util.List;
import java.util.Map;

/**
 * Throw-away webhook receiver on webhook.site (approved by the user, 12 Oct 2026). Each token is a fresh URL that
 * answers with a fixed status (and optional delay) and records every request it gets.
 */
public final class WebhookSite {
    private static final String BASE = "https://webhook.site";
    public final String uuid;

    private WebhookSite(String uuid) {
        this.uuid = uuid;
    }

    /** New receiver answering {@code status}; {@code delaySeconds} (0–10) makes it slow, for timeout tests. */
    public static WebhookSite create(int status, int delaySeconds) {
        Response r = RestAssured.given().contentType(ContentType.JSON).accept(ContentType.JSON)
                .body(Map.of("default_status", status, "default_content", "QA WF", "default_content_type", "text/plain",
                        "timeout", delaySeconds, "cors", false))
                .post(BASE + "/token");
        if (r.statusCode() / 100 != 2) throw new IllegalStateException("webhook.site token: " + r.statusCode() + " " + r.asString());
        return new WebhookSite(r.jsonPath().getString("uuid"));
    }

    public String url() {
        return BASE + "/" + uuid;
    }

    /** Requests received so far, newest first: each has method, content, headers, created_at. */
    public List<Map<String, Object>> requests() {
        Response r = RestAssured.given().accept(ContentType.JSON).get(BASE + "/token/" + uuid + "/requests?sorting=newest&per_page=50");
        if (r.statusCode() / 100 != 2) throw new IllegalStateException("webhook.site requests: " + r.statusCode() + " " + r.asString());
        return r.jsonPath().getList("data");
    }

    /** Waits until at least n requests arrived; returns them (may be fewer if time ran out). */
    public List<Map<String, Object>> await(int n, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        List<Map<String, Object>> got = requests();
        while (got.size() < n && System.currentTimeMillis() < end) {
            Waits.sleep(4000);
            got = requests();
        }
        return got;
    }

    public void delete() {
        try {
            RestAssured.given().delete(BASE + "/token/" + uuid);
        } catch (RuntimeException ignored) {
            // best effort
        }
    }
}
