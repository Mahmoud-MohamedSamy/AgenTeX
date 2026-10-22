package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.SkipException;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BooleanSupplier;
import java.util.function.Consumer;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Write-run helpers (Run 2/3, approved by the user 20 Oct 2026): owner API session on both apps, QA record create /
 * read / delete with cleanup, settings read-modify-write with row_version, link lookup, polling and a facts log
 * (target/crmdesk-write-facts.txt) that the report is built from. Every record name starts with "QA CD ".
 */
public abstract class WriteBase {
    // modules and layouts (verified 20 Oct 2026)
    static final String CRM_CONTACTS = CrmDeskFeature.CRM_CONTACTS;
    static final String CRM_ACCOUNTS = "b2398920-2914-4836-be53-81bd960effea";
    static final String CRM_DEALS = "f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430";
    static final String DESK_CONTACTS = CrmDeskFeature.DESK_CONTACTS;
    static final String DESK_ACCOUNTS = "784400e1-4a2a-42c2-b4f3-7ca56e79828a";
    static final String DESK_TICKETS = CrmDeskFeature.DESK_TICKETS;
    static final String CRM_CONTACT_LAYOUT = "92269f8a-040c-4b00-8d33-cc323391dc3b";
    static final String CRM_ACCOUNT_LAYOUT = "d817ff75-2107-4114-9141-71f5efbc04cf";
    static final String CRM_DEAL_LAYOUT = "fcba0068-d67f-44f5-8412-cdef9c09e16e";
    static final String CRM_DEAL_PIPELINE = "5170500c-b335-479c-96d1-ed138965c345";
    static final String DESK_CONTACT_LAYOUT = "bcac166e-d4e6-4d1c-b319-f07d4dbc0d4d";
    static final String DESK_ACCOUNT_LAYOUT = "3e687db9-87b0-4d55-8e3d-3c8b5936a3a1";
    static final String DESK_TICKET_LAYOUT = "1b55c25d-eb27-4046-afd1-b292398b435b";
    static final String DESK_DEPARTMENT = "7e1ac409-58b0-41ab-97e1-0e7d5c8c5158";
    static final String OWNER_ID = "97be04b6-0a08-4883-aa51-e1650b11cab7";
    static final String AGENT_ID = "9d182dfa-05f3-4af7-9685-8615a2fbe537";
    static final String DESK_AGENT_PROFILE = "44444444-4444-4444-4444-444444444402";
    static final List<String> DESK_PROFILES = List.of("44444444-4444-4444-4444-444444444401", DESK_AGENT_PROFILE,
            "44444444-4444-4444-4444-444444444403", "44444444-4444-4444-4444-444444444404", "44444444-4444-4444-4444-444444444405");

    static final Path FACTS = Path.of("target/crmdesk-write-facts.txt");
    /** Short tag that makes this run's names and emails unique. */
    static final String RUN = "r" + Long.toString(System.currentTimeMillis() % 1_000_000, 36);

    /** Records this run created: {app, module, id} — deleted in reverse order at the end. */
    static final List<String[]> CREATED = new ArrayList<>();

    AppUser owner() {
        return AppUser.as(CrmDeskFeature.OWNER);
    }

    AppUser.App crm() {
        return owner().crm();
    }

    AppUser.App desk() {
        return owner().desk();
    }

    // ---------------- facts ----------------

    static synchronized void fact(String caseId, String text) {
        String line = "[" + caseId + "] " + text;
        System.out.println(line);
        try {
            Files.writeString(FACTS, line + System.lineSeparator(), StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }

    static String name(String row) {
        return CrmDeskFeature.QA + row + " " + RUN;
    }

    static String email(String row) {
        return "qa.cd." + row.toLowerCase().replaceAll("[^a-z0-9]", "") + "." + RUN + "@example.com";
    }

    // ---------------- records ----------------

    static Map<String, Object> fv(Object v) {
        Map<String, Object> m = new LinkedHashMap<>();
        if (v == null) {
            m.put("kind", "null");
        } else if (v instanceof Number) {
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

    static List<Map<String, Object>> data(Map<String, Object> fields) {
        List<Map<String, Object>> d = new ArrayList<>();
        fields.forEach((k, v) -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("field", k);
            m.put("value", fv(v));
            d.add(m);
        });
        return d;
    }

    static Map<String, Object> f(Object... kv) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    AppUser.App app(String side) {
        return "crm".equals(side) ? crm() : desk();
    }

    Response createRaw(String side, String module, String layout, Map<String, Object> fields) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout);
        body.put("data", data(fields));
        return app(side).post("/modules/" + module + "/records", body);
    }

    String create(String side, String module, String layout, Map<String, Object> fields) {
        String id = ok(createRaw(side, module, layout, fields), "create " + side + " " + module).jsonPath().getString("data.id");
        synchronized (CREATED) {
            CREATED.add(new String[]{side, module, id});
        }
        return id;
    }

    /** Registers a record the sync created in the other app, so the cleanup deletes it too. */
    static void track(String side, String module, String id) {
        if (id == null) return;
        synchronized (CREATED) {
            for (String[] c : CREATED) if (c[2].equals(id)) return;
            CREATED.add(new String[]{side, module, id});
        }
    }

    Response update(String side, String module, String id, Map<String, Object> fields) {
        return app(side).patch("/modules/" + module + "/records/" + id, Map.of("data", data(fields)));
    }

    Response deleteRecord(String side, String module, String id) {
        return app(side).delete("/modules/" + module + "/records/" + id);
    }

    /** Field values of a record ({field: value}), "_deleted" = true when deleted, or null when the record is gone (404). */
    Map<String, String> rec(String side, String module, String id) {
        Response r = app(side).get("/modules/" + module + "/records/" + id);
        if (r.statusCode() == 404) return null;
        JsonPath j = ok(r, "GET " + side + " record").jsonPath();
        Map<String, String> m = new LinkedHashMap<>();
        m.put("_deleted", String.valueOf(j.getBoolean("data.is_deleted")));
        List<Map<String, Object>> d = j.getList("data.data");
        if (d != null) for (Map<String, Object> e : d) {
            Object v = e.get("value") instanceof Map<?, ?> mv ? (mv.get("value") != null ? mv.get("value") : mv.get("items")) : null;
            m.put(String.valueOf(e.get("field")), v == null ? null : String.valueOf(v));
        }
        return m;
    }

    String val(String side, String module, String id, String field) {
        Map<String, String> m = rec(side, module, id);
        return m == null ? null : m.get(field);
    }

    boolean gone(String side, String module, String id) {
        Map<String, String> m = rec(side, module, id);
        return m == null || "true".equals(m.get("_deleted"));
    }

    // ---------------- links ----------------

    List<Map<String, Object>> links(String kind) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (int p = 1; p <= 20; p++) {
            List<Map<String, Object>> l = ok(desk().get(INT + "/links?kind=" + kind + "&page_size=200&page=" + p), "links").jsonPath().getList("data");
            if (l == null) break;
            out.addAll(l);
            if (l.size() < 200) break;
        }
        return out;
    }

    Map<String, Object> linkOf(String kind, String side, String id) {
        String key = "crm".equals(side) ? "crm_record_id" : "desk_record_id";
        for (Map<String, Object> l : links(kind)) if (id.equals(String.valueOf(l.get(key)))) return l;
        return null;
    }

    /** Waits for the link of this record and returns the id on the other side (null if none within the time). */
    String waitPartner(String kind, String side, String id, int seconds) {
        String[] out = {null};
        waitFor(seconds, () -> {
            Map<String, Object> l = linkOf(kind, side, id);
            if (l == null) return false;
            Object o = l.get("crm".equals(side) ? "desk_record_id" : "crm_record_id");
            if (o == null) return false;
            out[0] = String.valueOf(o);
            return true;
        });
        return out[0];
    }

    // ---------------- settings ----------------

    Map<String, Object> config() {
        return ok(desk().get(INT + "/config"), "config").jsonPath().getMap("data");
    }

    Map<String, Object> status() {
        return ok(desk().get(INT + "/status"), "status").jsonPath().getMap("data");
    }

    @SuppressWarnings("unchecked")
    Map<String, Object> configStatus() {
        return (Map<String, Object>) config().get("status");
    }

    /** Read-modify-write of the settings object (fresh row_version); returns the PUT response. */
    Response putConfig(Consumer<Map<String, Object>> edit) {
        Map<String, Object> c = config();
        c.remove("status");
        edit.accept(c);
        return desk().putOnce(INT + "/config", c);
    }

    void putConfigOk(String why, Consumer<Map<String, Object>> edit) {
        Response r = putConfig(edit);
        if (r.statusCode() / 100 != 2) throw new IllegalStateException("settings change '" + why + "' refused: " + r.statusCode() + " " + r.asString());
    }

    static String rowVersion(Map<String, Object> c) {
        return String.valueOf(c.get("row_version"));
    }

    // ---------------- waiting ----------------

    static boolean waitFor(int seconds, BooleanSupplier ok) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (true) {
            try {
                if (ok.getAsBoolean()) return true;
            } catch (SkipException e) {
                throw e;
            } catch (RuntimeException ignored) {
            }
            if (System.currentTimeMillis() > end) return false;
            AppUser.sleep(3000);
        }
    }

    /** Queue counts from /status of the settings object. */
    @SuppressWarnings("unchecked")
    String queue() {
        Object q = configStatus().get("queue");
        return String.valueOf(q);
    }

    static void inconclusive(String caseId, String why) {
        fact(caseId, "INCONCLUSIVE: " + why);
        throw new SkipException("INCONCLUSIVE: " + why);
    }

    static String code(Response r) {
        String c = null;
        try {
            c = r.jsonPath().getString("error.code");
        } catch (Exception ignored) {
        }
        return r.statusCode() + (c == null ? "" : " " + c);
    }

    static String msg(Response r) {
        try {
            String m = r.jsonPath().getString("error.message");
            return m == null ? "" : m;
        } catch (Exception e) {
            return "";
        }
    }
}
