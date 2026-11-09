package qa.features.crmsetup;

import io.restassured.response.Response;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmsetup.CrmSetupFeature.*;

/**
 * API helpers for the Wave 5 tests. Shapes found in the 26 Oct 2026 run (executions/…waves3-5/wave5/scripts). Reads go
 * through {@link CrmUser#ok}, so a 401 or 5xx never passes as "refused". {@link Cleanup} removes what a class created.
 */
public final class CrmSetupApi {
    private CrmSetupApi() {
    }

    /** The acting admin: the owner by default; -Dcrm.apiUser=<email> (or -Dcrm.adminAs) runs everything as another admin (round 2: CRM Admin A). */
    public static CrmUser owner() {
        return CrmUser.as(qa.core.config.Config.get("crm.apiUser", System.getProperty("crm.adminAs", OWNER)));
    }

    public static void fact(String caseId, String text) {
        CrmHierarchyApi.fact(caseId, text);
    }

    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    public static String tag() {
        return String.valueOf(System.currentTimeMillis() % 1_000_000);
    }

    public static String err(Response r) {
        String b = r.asString();
        return r.statusCode() + " " + (b == null ? "" : b.length() > 200 ? b.substring(0, 200) : b);
    }

    /** Creates a module in the CRM Teamspace the way the screen does; returns its id. */
    public static String createModule(String key, String label) {
        Response r = CrmUser.ok(owner().post("/teamspaces/" + CRM_TEAMSPACE + "/modules",
                m("moduleKey", key, "labels", m("en", label), "pluralForm", label, "singularForm", label + " record", "description", "QA W5 automation, deleted afterwards")), "create module");
        return r.jsonPath().getString("data.id");
    }

    /** The module's first (default) layout id. */
    @SuppressWarnings("unchecked")
    public static String defaultLayout(String moduleId) {
        Object d = CrmUser.ok(owner().get("/modules/" + moduleId + "/layouts"), "layouts").jsonPath().get("data");
        List<Map<String, Object>> ls = d instanceof List ? (List<Map<String, Object>>) d : (List<Map<String, Object>>) ((Map<String, Object>) d).get("layouts");
        return String.valueOf(ls.get(0).get("id"));
    }

    /** Adds one field; returns the raw response. */
    public static Response addField(String moduleId, String fieldName, String label, String datatype, Map<String, Object> options) {
        Map<String, Object> f = m("fieldName", fieldName, "labels", m("en", label), "datatypeKey", datatype, "required", false, "unique", false);
        if (options != null) f.put("datatypeOptions", options);
        return owner().post("/modules/" + moduleId + "/fields", m("fields", List.of(f)));
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> field(String moduleId, String apiName) {
        Object d = CrmUser.ok(owner().get("/modules/" + moduleId + "/fields"), "fields").jsonPath().get("data");
        List<Map<String, Object>> fl = d instanceof List ? (List<Map<String, Object>>) d : (List<Map<String, Object>>) ((Map<String, Object>) d).get("fields");
        return fl.stream().filter(x -> apiName.equals(x.get("apiName"))).findFirst().orElseThrow(() -> new IllegalStateException("no field " + apiName));
    }

    public static Response createRecord(String moduleId, String layoutId, Map<String, Object> values) {
        return owner().post("/modules/" + moduleId + "/records", m("layout_id", layoutId, "data", CrmApi.data(values)));
    }

    /** Value of a field in a record GET; null when absent. */
    @SuppressWarnings("unchecked")
    public static Object value(String moduleId, String recordId, String field) {
        List<Map<String, Object>> rows = CrmUser.ok(owner().get("/modules/" + moduleId + "/records/" + recordId), "read record").jsonPath().getList("data.data");
        for (Map<String, Object> r : rows)
            if (field.equals(r.get("field"))) {
                Object v = r.get("value");
                return v instanceof Map<?, ?> vm && vm.containsKey("kind") ? ((Map<String, Object>) vm).get("value") : v;
            }
        return null;
    }

    /** First page (200, newest first) of the recycle bin; the API answers either a list or {items: [...]}. */
    @SuppressWarnings("unchecked")
    public static List<Map<String, Object>> binPage() {
        Object d = CrmUser.ok(owner().get("/audit/recycle-bin/items?limit=200"), "bin").jsonPath().get("data");
        return d instanceof List ? (List<Map<String, Object>>) d : (List<Map<String, Object>>) ((Map<String, Object>) d).get("items");
    }

    /**
     * Removes a QA module completely: deletes its records, purges them from the recycle bin (items of a deleted module
     * can never be removed, NDC-1797), then deletes the module with ?cascade=true (cascade alone refuses a module that
     * still has records). Returns the final delete status.
     */
    @SuppressWarnings("unchecked")
    public static int deleteModule(String moduleId) {
        String key = CrmUser.ok(owner().get("/modules/" + moduleId), "module").jsonPath().getString("data.moduleKey");
        List<String> ids = new ArrayList<>();
        for (int p = 0; p < 20; p++) {
            Response r = owner().get("/modules/" + moduleId + "/records?page=1&per_page=100");
            List<Map<String, Object>> rows = r.statusCode() == 200 ? r.jsonPath().getList("data") : null;
            if (rows == null || rows.isEmpty()) break;
            for (Map<String, Object> x : rows) {
                String id = String.valueOf(x.get("id"));
                owner().delete("/modules/" + moduleId + "/records/" + id);
                ids.add(id);
            }
        }
        // purge EVERY bin item of this module (also records a test deleted on purpose), not only the ones deleted here:
        // once the module is gone they can't be removed until they expire (seen 26 Oct 2026: 24 stuck items)
        qa.core.base.Waits.sleep(3000);
        List<String> items = new ArrayList<>();
        for (Map<String, Object> it : binPage())
            if (ids.contains(String.valueOf(it.get("record_id"))) || key != null && key.equals(it.get("module_key"))) items.add(String.valueOf(it.get("id")));
        {
            for (int i = 0; i < items.size(); i += 50)
                owner().post("/audit/recycle-bin/delete", m("ids", items.subList(i, Math.min(items.size(), i + 50))));
            if (!items.isEmpty() || !ids.isEmpty()) fact("cleanup", "module " + moduleId + ": " + ids.size() + " records deleted, " + items.size() + " bin items purged");
        }
        return owner().delete("/modules/" + moduleId + "?cascade=true").statusCode();
    }

    /** Things to remove after a class, in reverse order of registration. */
    public static final class Cleanup {
        private final List<Runnable> steps = new ArrayList<>();

        public void then(String what, Runnable r) {
            steps.add(0, () -> {
                try {
                    r.run();
                } catch (RuntimeException e) {
                    fact("cleanup", what + " failed: " + e.getMessage());
                }
            });
        }

        public void delete(String what, String path) {
            then(what, () -> fact("cleanup", "delete " + what + " -> " + owner().delete(path).statusCode()));
        }

        public void run() {
            steps.forEach(Runnable::run);
        }
    }
}
