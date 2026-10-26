package qa.features.deskactivities;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import qa.features.crmdeskintegration.AppUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.deskactivities.DeskActivitiesFeature.*;

/**
 * Desk records API for activities and tickets (ported from executions/execu_2026-10-26_desk-activities-replies/scripts).
 * Activities are plain records: POST/GET/PATCH/DELETE /modules/{moduleId}/records. A value object must have
 * {@code kind} as its FIRST key (server bug B-1 of 12 Oct: other orders give 500), so bodies are built with LinkedHashMap.
 * Reads go through {@link AppUser#ok}: a 401 or 5xx can never look like "not set". Everything created is registered in a
 * {@link Cleanup} and deleted afterwards (only QA records the test made).
 */
public final class DeskActivitiesApi {
    private DeskActivitiesApi() {
    }

    public static AppUser.App agent() {
        return AppUser.as(AGENT).desk();
    }

    public static AppUser.App otherDeptAdmin() {
        return AppUser.as(OTHER_DEPT_ADMIN).desk();
    }

    /** One result line for the report ("[ACT-C8] ..."), also in target/crmhierarchy-facts.txt. */
    public static void fact(String caseId, String text) {
        CrmHierarchyApi.fact(caseId, text);
    }

    public static String iso(long secondsFromNow) {
        return Instant.now().plusSeconds(secondsFromNow).truncatedTo(ChronoUnit.SECONDS).toString();
    }

    public static String tag() {
        return String.valueOf(System.currentTimeMillis() % 1_000_000);
    }

    /** "422 RECORD_VALIDATION_FAILED 'Invalid value for: Status.'" */
    public static String err(Response r) {
        String code = null, msg = null;
        try {
            code = r.jsonPath().getString("error.code");
            msg = r.jsonPath().getString("error.message");
        } catch (RuntimeException notJson) {
            msg = r.asString();
        }
        return r.statusCode() + (code != null ? " " + code : "") + (msg != null ? " '" + msg + "'" : "");
    }

    // ---------------- record bodies ----------------

    public static Map<String, Object> kinded(Object v) {
        Map<String, Object> m = new LinkedHashMap<>();
        if (v instanceof Number) {
            m.put("kind", "number");
            m.put("value", v);
        } else if (v instanceof Boolean) {
            m.put("kind", "boolean");
            m.put("value", v);
        } else {
            m.put("kind", "string");
            m.put("value", String.valueOf(v));
        }
        return m;
    }

    /** {data:[{field, value:{kind, value}}]} from field/value pairs in order. */
    public static Map<String, Object> body(Object... kv) {
        List<Map<String, Object>> data = new ArrayList<>();
        for (int i = 0; i < kv.length; i += 2) {
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("field", String.valueOf(kv[i]));
            f.put("value", kinded(kv[i + 1]));
            data.add(f);
        }
        return Map.of("data", data);
    }

    public static Response create(AppUser.App u, String moduleId, Object... kv) {
        return u.post("/modules/" + moduleId + "/records", body(kv));
    }

    /** Creates and registers for cleanup; fails the test with the server message when refused. */
    public static String createOk(AppUser.App u, Cleanup c, String moduleId, Object... kv) {
        Response r = create(u, moduleId, kv);
        if (r.statusCode() != 201) throw new IllegalStateException("create in " + moduleId + " refused: " + err(r));
        String id = r.jsonPath().getString("data.id");
        c.add(moduleId, id);
        return id;
    }

    public static Response patch(AppUser.App u, String moduleId, String id, Object... kv) {
        return u.patch("/modules/" + moduleId + "/records/" + id, body(kv));
    }

    /** Field map of one record (value objects flattened to their plain value). */
    public static Map<String, Object> fields(AppUser.App u, String moduleId, String id) {
        JsonPath j = AppUser.ok(u.get("/modules/" + moduleId + "/records/" + id), "read record").jsonPath();
        Map<String, Object> out = new LinkedHashMap<>();
        List<Map<String, Object>> data = j.getList("data.data");
        if (data == null) throw new IllegalStateException("record read had no data: " + j.prettify());
        for (Map<String, Object> f : data) {
            Object v = f.get("value");
            if (v instanceof Map<?, ?> mv) v = mv.containsKey("value") ? mv.get("value") : ("null".equals(mv.get("kind")) ? null : mv);
            out.put(String.valueOf(f.get("field")), v);
        }
        return out;
    }

    public static String str(Map<String, Object> f, String field) {
        Object v = f.get(field);
        return v == null ? null : String.valueOf(v);
    }

    /** QA ticket in Customer Support for {@link DeskActivitiesFeature#QA_EMAIL}. */
    public static String qaTicket(AppUser.App u, Cleanup c, String subject) {
        return createOk(u, c, TICKETS, "subject", subject, "status", "Open", "department", CUSTOMER_SUPPORT, "email", QA_EMAIL, "channel", "email");
    }

    /** Records created by a test class; deleted in reverse order. Tickets and activities go to the Recycle Bin. */
    public static final class Cleanup {
        private final List<String[]> items = new ArrayList<>();

        public synchronized void add(String moduleId, String id) {
            if (id != null) items.add(new String[]{moduleId, id});
        }

        public synchronized void run() {
            AppUser.App u;
            try {
                u = agent();
            } catch (RuntimeException e) {
                fact("cleanup", "skipped, no session: " + e.getMessage());
                return;
            }
            int ok = 0, bad = 0, closed = 0;
            for (int i = items.size() - 1; i >= 0; i--) {
                String[] it = items.get(i);
                int s = u.delete("/modules/" + it[0] + "/records/" + it[1]).statusCode();
                if (s / 100 == 2 || s == 404) ok++;
                else if (s == 403 && TICKETS.equals(it[0])) closed += u.post("/desk/tickets/" + it[1] + "/close", Map.of()).statusCode() / 100 == 2 ? 1 : 0;   // Desk Agent may not delete tickets: close them instead
                else bad++;
            }
            fact("cleanup", "deleted " + ok + " QA records" + (closed > 0 ? ", closed " + closed + " QA tickets (delete is 403 for the agent)" : "") + (bad > 0 ? ", " + bad + " refused" : ""));
            items.clear();
        }
    }
}
