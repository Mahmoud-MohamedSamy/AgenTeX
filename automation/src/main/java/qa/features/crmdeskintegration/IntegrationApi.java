package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/** Read helpers over /desk/integrations/crm and the Desk records API (one user, one app). Reads only. */
public final class IntegrationApi {
    /** GET / POST transport: an API-signed-in {@link AppUser.App}, or the browser session ({@link #browser()}). */
    public interface Http {
        Response get(String path);

        Response post(String path, Object body);
    }

    private final Http app;

    public IntegrationApi(Http app) {
        this.app = app;
    }

    public static IntegrationApi desk(String email) {
        return new IntegrationApi(AppUser.as(email).desk());
    }

    public static IntegrationApi crm(String email) {
        return new IntegrationApi(AppUser.as(email).crm());
    }

    /**
     * The signed-in browser's own token (Desk host, x-app-key desk): no API sign-in, so screen tests never add to the
     * login rate limit (a 429 hit the owner on 19 Oct 2026). Call after the page object opened a Desk page.
     */
    public static IntegrationApi browser() {
        qa.core.api.ApiClient c = new qa.core.api.ApiClient();
        return new IntegrationApi(new Http() {
            public Response get(String path) {
                return c.get(path);
            }

            public Response post(String path, Object body) {
                return c.post(path, body);
            }
        });
    }

    public Http app() {
        return app;
    }

    public Response get(String path) {
        return app.get(path);
    }

    public JsonPath read(String path) {
        return ok(app.get(path), "GET " + path).jsonPath();
    }

    public JsonPath status() {
        return read(INT + "/status");
    }

    public JsonPath config() {
        return read(INT + "/config");
    }

    public List<Map<String, Object>> list(String path) {
        List<Map<String, Object>> l = read(path).getList("data");
        return l == null ? List.of() : l;
    }

    /** Every link (the list is paged, 25 by default — seen 19 Oct 2026: page_size up to 200 works). */
    public List<Map<String, Object>> links() {
        List<Map<String, Object>> out = new ArrayList<>();
        for (int page = 1; page <= 20; page++) {
            List<Map<String, Object>> l = list(INT + "/links?page_size=200&page=" + page);
            out.addAll(l);
            if (l.size() < 200) break;
        }
        return out;
    }

    /** Field keys of one module schema: side "crm" (contacts, accounts) or "desk" (desk_contacts, desk_accounts). */
    public Map<String, Map<String, Object>> schema(String side, String module) {
        Map<String, Map<String, Object>> out = new LinkedHashMap<>();
        List<Map<String, Object>> f = read(INT + "/schema/" + side + "/" + module).getList("data.fields");
        for (Map<String, Object> m : f) out.put(String.valueOf(m.get("key")), m);
        return out;
    }

    /** Handshake buckets for these Desk ticket ids: ticket id → bucket. */
    public Map<String, String> classify(List<String> ticketIds) {
        Map<String, String> out = new LinkedHashMap<>();
        List<Map<String, Object>> rows = ok(app.post(INT + "/tickets/classify", Map.of("ticket_ids", ticketIds)), "classify").jsonPath().getList("data");
        for (Map<String, Object> r : rows) out.put(String.valueOf(r.get("ticket_id")), String.valueOf(r.get("bucket")));
        return out;
    }

    /** Every non-deleted Desk ticket as {id, ticket_number, contact_id, status, subject} (records API, newest first). */
    public List<Map<String, String>> deskTickets() {
        List<Map<String, String>> out = new ArrayList<>();
        for (int page = 1; page <= 10; page++) {
            List<Map<String, Object>> rows = list("/modules/" + CrmDeskFeature.DESK_TICKETS + "/records?page=" + page + "&per_page=100");
            for (Map<String, Object> t : rows) {
                if (Boolean.TRUE.equals(t.get("is_deleted"))) continue;
                Map<String, String> m = new LinkedHashMap<>();
                m.put("id", String.valueOf(t.get("id")));
                for (Object o : (List<?>) t.get("data")) {
                    Map<?, ?> f = (Map<?, ?>) o;
                    Object v = f.get("value") instanceof Map<?, ?> mv ? mv.get("value") : null;
                    if (v != null) m.put(String.valueOf(f.get("field")), String.valueOf(v));
                }
                out.add(m);
            }
            if (rows.size() < 100) break;
        }
        return out;
    }
}
