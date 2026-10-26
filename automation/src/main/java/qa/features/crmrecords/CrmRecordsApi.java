package qa.features.crmrecords;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * API helpers for the Wave 2 tests, ported from the manual run's snippets (executions/…wave2/scripts). Reads go through
 * {@link CrmUser#ok}, so a 401 or 5xx can never pass as "refused" or "not logged". Every record a test creates is
 * registered with {@link Cleanup} and removed afterwards: deleted, then purged from the recycle bin by record id, so
 * the bin is left as it was. Only QA W2 objects are touched.
 */
public final class CrmRecordsApi {
    private CrmRecordsApi() {
    }

    public static CrmUser owner() {
        return CrmUser.as(OWNER);
    }

    public static CrmUser user1() {
        return CrmUser.as(USER_N);
    }

    public static void fact(String caseId, String text) {
        CrmHierarchyApi.fact(caseId, text);
    }

    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    /** "422 VALIDATION 'message'" for facts and assertion messages. */
    public static String err(Response r) {
        String code = null, msg = null;
        try {
            code = r.jsonPath().getString("error.code");
            msg = r.jsonPath().getString("error.message");
        } catch (RuntimeException notJson) {
            String b = r.asString();
            if (b != null && !b.isBlank()) msg = b.length() > 160 ? b.substring(0, 160) : b;
        }
        return r.statusCode() + (code != null ? " " + code : "") + (msg != null ? " '" + msg + "'" : "");
    }

    /** A short unique tag for names in this run. */
    public static String tag() {
        return String.valueOf(System.currentTimeMillis() % 1_000_000);
    }

    // ---------------- records ----------------

    /** Required fields of each module, as found in the manual run (RC-01: 201 in all 15). */
    public static Map<String, Object> required(String key, String name) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("name", name);
        Instant now = Instant.now().truncatedTo(java.time.temporal.ChronoUnit.SECONDS);   // the server refuses fractions of a second
        String later = now.plusSeconds(86_400).toString(), end = now.plusSeconds(90_000).toString();
        switch (key) {
            case "leads" -> {
                b.put("first_name", name);
                b.put("phone", "010" + String.format("%08d", Math.floorMod(name.hashCode(), 100_000_000)));
                b.put("single_line_3_9", "QA W2");
            }
            case "deals" -> {
                b.put("deal_name", name);
                b.put("pipeline", "Standard (Standard)");   // the only value the API accepts today (NDC-2382)
                b.put("stage", "qualification");
            }
            case "accounts" -> b.put("account_name", name);
            case "tasks" -> {
                b.put("subject", name);
                b.put("status", "Not Started");
            }
            case "calls" -> {
                b.put("call_type", "outbound");
                b.put("call_start_time", later);
                b.put("call_duration", "5");
            }
            case "meetings" -> {
                b.put("title", name);
                b.put("meeting_venue", "online");
                b.put("from_time", later);
                b.put("to_time", end);
            }
            case "subscriptions" -> {
                b.put("subscription_name", name);
                b.put("owner", OWNER_ID);
            }
            case "cases" -> {
                b.put("status", "New");
                b.put("case_origin", "Web");
                b.put("subject", name);
            }
            case "po", "so" -> b.put("subject", name);
            default -> {
            }
        }
        return b;
    }

    public static Response post(CrmUser as, CrmModule mod, Map<String, Object> fields) {
        return as.post("/modules/" + mod.id() + "/records", m("layout_id", mod.layout(), "data", CrmApi.data(fields)));
    }

    /** Creates a record with the module's required fields (+ extra) and registers it; returns its id. */
    public static String create(CrmUser as, Cleanup c, CrmModule mod, String name, Map<String, Object> extra) {
        Map<String, Object> f = required(mod.key(), name);
        if (extra != null) f.putAll(extra);
        String id = CrmUser.ok(post(as, mod, f), "create " + mod.key()).jsonPath().getString("data.id");
        c.record(mod, id);
        return id;
    }

    public static Response get(CrmUser as, CrmModule mod, String id) {
        return as.get("/modules/" + mod.id() + "/records/" + id);
    }

    public static Response patch(CrmUser as, CrmModule mod, String id, Map<String, Object> fields) {
        return as.patch("/modules/" + mod.id() + "/records/" + id, m("data", CrmApi.data(fields)));
    }

    /** Value of a field in a record GET ({"data":{"data":[{field, value:{kind, value}}]}}); null when absent. */
    @SuppressWarnings("unchecked")
    public static Object value(Response record, String field) {
        List<Map<String, Object>> rows = record.jsonPath().getList("data.data");
        if (rows == null) return null;
        for (Map<String, Object> r : rows)
            if (field.equals(r.get("field"))) {
                Object v = r.get("value");
                return v instanceof Map<?, ?> vm && vm.containsKey("kind") ? ((Map<String, Object>) vm).get("value") : v;
            }
        return null;
    }

    /** The value object of a field as stored (e.g. tags: {kind, items:[…]}), without unwrapping; null when absent. */
    public static Object rawValue(Response record, String field) {
        List<Map<String, Object>> rows = record.jsonPath().getList("data.data");
        if (rows != null) for (Map<String, Object> r : rows) if (field.equals(r.get("field"))) return r.get("value");
        return null;
    }

    public static String str(Response record, String field) {
        Object v = value(record, field);
        return v == null ? null : String.valueOf(v);
    }

    // ---------------- recycle bin ----------------

    /** Every bin item (pages of 200). */
    public static List<Map<String, Object>> binItems(CrmUser as) {
        return binScan(as, null);
    }

    /** Pages through the bin (newest first); stops early at the first item {@code stop} accepts. */
    private static List<Map<String, Object>> binScan(CrmUser as, java.util.function.Predicate<Map<String, Object>> stop) {
        List<Map<String, Object>> out = new ArrayList<>();
        String cursor = null;
        Set<String> seen = new LinkedHashSet<>();
        for (int p = 0; p < 40; p++) {
            // the cursor goes in as a query parameter: pasted into the path it is either double-encoded (400) or its '+' turns into a space
            String c = cursor;
            Response r = CrmUser.ok(c == null ? as.get("/audit/recycle-bin/items?limit=200")
                    : as.req().queryParam("limit", 200).queryParam("cursor", c).get("/audit/recycle-bin/items"), "bin items");
            List<Map<String, Object>> d = r.jsonPath().get("data") instanceof List ? r.jsonPath().getList("data") : r.jsonPath().getList("data.items");
            if (d != null) {
                for (Map<String, Object> i : d) if (seen.add(String.valueOf(i.get("id")))) out.add(i);
                if (stop != null && d.stream().anyMatch(stop)) return out;
            }
            cursor = r.jsonPath().getString("meta.next_cursor");
            if (cursor == null || cursor.isBlank() || d == null || d.isEmpty()) break;
        }
        return out;
    }

    /** The bin item of one record, or null (the item may take a few seconds to appear). */
    public static Map<String, Object> binItemOf(CrmUser as, String recordId) {
        for (int attempt = 0; attempt < 4; attempt++) {
            for (Map<String, Object> i : binScan(as, x -> recordId.equals(x.get("record_id")))) if (recordId.equals(i.get("record_id"))) return i;
            qa.core.base.Waits.sleep(5000);
        }
        return null;
    }

    public static Response restore(CrmUser as, String binItemId) {
        return as.post("/audit/recycle-bin/restore", m("ids", List.of(binItemId)));
    }

    public static Response purge(CrmUser as, List<String> binItemIds) {
        return as.post("/audit/recycle-bin/delete", m("ids", binItemIds));
    }

    // ---------------- timeline ----------------

    /** Timeline entries of a record; the path takes the module KEY (leads), not the id. */
    public static List<Map<String, Object>> timeline(CrmUser as, String moduleKey, String recordId) {
        List<Map<String, Object>> d = CrmUser.ok(as.get("/timeline/records/" + moduleKey + "/" + recordId + "/feed"), "timeline").jsonPath().getList("data.data");
        return d == null ? List.of() : d;
    }

    public static List<String> entryTypes(List<Map<String, Object>> entries) {
        List<String> t = new ArrayList<>();
        for (Map<String, Object> e : entries) t.add(e.get("entry_type") + (e.get("field_key") != null ? ":" + e.get("field_key") : ""));
        return t;
    }

    // ---------------- import ----------------

    /** Import result: the session status JSON and each step's response. */
    public static final class Import {
        public String sessionId;
        public Response mapping, validate, execute;
        public JsonPath status;

        public String state() {
            return status == null ? null : status.getString("data.status");
        }

        public int created() {
            return status == null ? -1 : status.getInt("data.created_count");
        }

        public String log() {
            return "session=" + sessionId + " mapping=" + (mapping == null ? null : err(mapping)) + " validate=" + (validate == null ? null : err(validate))
                    + " execute=" + (execute == null ? null : err(execute)) + " final=" + state() + " created=" + created()
                    + " errors=" + (status == null ? null : status.getString("data.error_count"));
        }
    }

    /**
     * Uploads a CSV of Leads (header = field key), maps every header to itself and runs it. Stops at the first refused
     * step and returns what it has, so a test can check a refusal. Options as the screen sends them.
     */
    public static Import importLeads(CrmUser as, List<Map<String, Object>> rows, boolean triggerAutomation) {
        List<String> headers = new ArrayList<>(rows.get(0).keySet());
        StringBuilder csv = new StringBuilder(String.join(",", headers)).append('\n');
        for (Map<String, Object> r : rows) {
            List<String> cells = new ArrayList<>();
            for (String h : headers) cells.add(String.valueOf(r.get(h)).replace(",", " "));
            csv.append(String.join(",", cells)).append('\n');
        }
        Import imp = new Import();
        Response up = CrmUser.ok(as.req().contentType("multipart/form-data")
                .multiPart("file", "qa-w2-import.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + LEADS + "/import"), "import upload");
        imp.sessionId = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + LEADS + "/import/" + imp.sessionId;
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", triggerAutomation);
        opts.put("assignment_rule_id", null);
        opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : headers) mapping.add(m("header", h, "field", h));
        imp.mapping = as.put(base + "/mapping", m("mode", "add", "match_field_key", null, "layout_id", LEADS_LAYOUT, "mapping", mapping, "options", opts));
        if (imp.mapping.statusCode() / 100 != 2) return imp;
        imp.validate = as.post(base + "/validate", null);
        if (imp.validate.statusCode() / 100 != 2) return imp;
        imp.execute = as.post(base + "/execute", null);
        if (imp.execute.statusCode() / 100 != 2) return imp;
        CrmApi.waitFor(150, () -> {
            String st = as.get(base).jsonPath().getString("data.status");
            return st != null && (st.startsWith("completed") || st.equals("partially_completed") || st.equals("failed") || st.equals("undone"));
        });
        imp.status = CrmUser.ok(as.get(base), "import status").jsonPath();
        return imp;
    }

    // ---------------- leads by name ----------------

    /** Ids of the newest Leads (Standard layout, last 3 pages) whose Full Name starts with {@code prefix}. */
    @SuppressWarnings("unchecked")
    public static List<String> leadIdsByPrefix(CrmUser as, String prefix) {
        List<String> ids = new ArrayList<>();
        for (int p = 1; p <= 3; p++) {
            Response r = CrmUser.ok(as.get("/modules/" + LEADS + "/records?page=" + p + "&per_page=100&layout_id=" + LEADS_LAYOUT + "&sort_by=created_at&sort_dir=desc"), "leads list");
            List<Map<String, Object>> rows = r.jsonPath().getList("data");
            if (rows == null || rows.isEmpty()) break;
            for (Map<String, Object> x : rows)
                for (Object f : (List<Object>) x.get("data"))
                    if (f instanceof Map<?, ?> fm && "first_name".equals(fm.get("field")) && fm.get("value") instanceof Map<?, ?> v
                            && String.valueOf(v.get("value")).startsWith(prefix)) ids.add(String.valueOf(x.get("id")));
        }
        return ids;
    }

    // ---------------- cleanup ----------------

    /**
     * Everything one test class created, removed in reverse order: views, tags, rules, field permissions, profiles,
     * then records (deleted, then purged from the bin together with any other bin items of those records).
     */
    public static final class Cleanup {
        private final Map<String, Set<String>> records = new LinkedHashMap<>();
        private final List<Runnable> other = new ArrayList<>();

        public synchronized void record(CrmModule mod, String id) {
            if (id != null) records.computeIfAbsent(mod.key(), k -> new LinkedHashSet<>()).add(id);
        }

        public void then(Runnable r) {
            other.add(0, r);
        }

        public void run() {
            CrmUser o = owner();
            for (Runnable r : other) {
                try {
                    r.run();
                } catch (RuntimeException e) {
                    fact("cleanup", "step failed: " + e.getMessage());
                }
            }
            Set<String> all = new LinkedHashSet<>();
            records.forEach((key, ids) -> {
                for (String id : ids) {
                    int s = o.delete("/modules/" + mod(key).id() + "/records/" + id).statusCode();
                    if (s != 204 && s != 404) fact("cleanup", "delete " + key + " " + id + " -> " + s);
                    all.add(id);
                }
            });
            if (all.isEmpty()) return;
            List<String> items = new ArrayList<>();
            for (Map<String, Object> i : binItems(o)) if (all.contains(String.valueOf(i.get("record_id")))) items.add(String.valueOf(i.get("id")));
            for (int i = 0; i < items.size(); i += 50)   // the screen deletes 50 at a time
                fact("cleanup", "purged " + Math.min(50, items.size() - i) + " QA bin items -> " + purge(o, items.subList(i, Math.min(items.size(), i + 50))).statusCode());
        }
    }
}
