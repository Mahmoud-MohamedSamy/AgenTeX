package qa.features.crmaccess;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import qa.core.auth.Credentials;
import qa.core.config.Config;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * API helpers for the Wave 1 tests. Reads go through {@link CrmUser#ok}, so a 401 or 5xx can never pass as
 * "not allowed" or "not logged". {@link Session} is a fresh sign-in that is NOT cached, for checks that need a token
 * issued after a permission change, a suspended account, or a session that the test revokes.
 */
public final class CrmAccessApi {
    private static final String CREDENTIALS = Config.get("crm.credentials.file", "../docs/Credentials/Microsoft Edge Passwords.csv");
    private static final String HOST = Config.get("crm.credentials.host", "staging-crm.taviportal.com");

    private CrmAccessApi() {
    }

    public static CrmUser owner() {
        return CrmUser.as(OWNER);
    }

    public static void fact(String caseId, String text) {
        CrmHierarchyApi.fact(caseId, text);
    }

    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    /** "403 FORBIDDEN 'message'" for facts and assertion messages. */
    public static String err(Response r) {
        String code = null, msg = null;
        try {
            code = r.jsonPath().getString("error.code");
            msg = r.jsonPath().getString("error.message");
        } catch (RuntimeException notJson) {
            String b = r.asString();
            if (b != null && !b.isBlank()) msg = b.length() > 120 ? b.substring(0, 120) : b;
        }
        return r.statusCode() + (code != null ? " " + code : "") + (msg != null ? " '" + msg + "'" : "");
    }

    // ---------------- fresh, uncached sign-in ----------------

    /** One sign-in made by the test itself (never cached), so its token can be checked after a change or revoked. */
    public static final class Session {
        public final String email;
        public final int status;
        public final String token;
        public final long at = System.currentTimeMillis();

        private Session(String email, int status, String token) {
            this.email = email;
            this.status = status;
            this.token = token;
        }

        public static Session signIn(String email) {
            Credentials c = Credentials.find(CREDENTIALS, HOST, email);
            Response r = base().header("x-tenant-id", CrmOrderFeature.TENANT)
                    .body(Map.of("email", c.email, "password", c.password(), "device_label", "qa-w1-session", "remember_me", false))
                    .post("/iam/auth/login");
            if (r.statusCode() == 429) throw new org.testng.SkipException("INCONCLUSIVE: sign-in rate-limited (429) for " + email + " - stop, do not retry");
            String t = r.statusCode() == 200 ? r.jsonPath().getString("data.access_token") : null;
            return new Session(email, r.statusCode(), t);
        }

        public Response get(String path) {
            return base().header("x-tenant-id", CrmOrderFeature.TENANT).header("x-app-key", "crm")
                    .header("Authorization", "Bearer " + token).get(path);
        }

        public Response put(String path, Object body) {
            return base().header("x-tenant-id", CrmOrderFeature.TENANT).header("x-app-key", "crm")
                    .header("Authorization", "Bearer " + token).body(body).put(path);
        }
    }

    private static RequestSpecification base() {
        return RestAssured.given().baseUri(CrmOrderFeature.API).contentType(ContentType.JSON).relaxedHTTPSValidation()
                .config(RestAssured.config().logConfig(io.restassured.config.LogConfig.logConfig()
                        .blacklistHeaders(List.of("Authorization", "Cookie", "Set-Cookie"))));
    }

    // ---------------- profiles and field permissions ----------------

    /** Creates a CRM profile cloned from {@code sourceId}; returns its id. */
    public static String createProfile(String name, String sourceId) {
        Map<String, Object> b = m("name", name, "parent_profile_id", P_MANAGER, "rank", 100, "is_tenant_wide", false,
                "source_profile_id", sourceId, "app_key", "crm");
        JsonPath j = CrmUser.ok(owner().post("/iam/profiles", b), "create profile " + name).jsonPath();
        String id = j.getString("data.profileId") != null ? j.getString("data.profileId") : j.getString("data.id");
        if (id == null) id = j.getString("data.profile_id");
        if (id == null) throw new IllegalStateException("no profile id in " + j.prettify());
        return id;
    }

    public static void deleteProfile(String id) {
        if (id == null) return;
        Response r = owner().delete("/iam/profiles/" + id);
        fact("cleanup", "delete profile " + id + " -> " + r.statusCode());
    }

    public static boolean profileExists(String id) {
        return CrmUser.ok(owner().get("/iam/profiles"), "GET profiles").asString().contains(id);
    }

    /** Upserts one field permission (hidden | read_only | read_write); returns the row id. */
    public static String setFieldPermission(String fieldId, String profileId, String permission) {
        Response r = CrmUser.ok(owner().post("/modules/" + LEADS + "/field-permissions",
                m("fieldId", fieldId, "profileId", profileId, "permission", permission)), "field permission " + permission);
        return r.jsonPath().getString("data.id");
    }

    public static void deleteFieldPermission(String rowId) {
        if (rowId == null) return;
        fact("cleanup", "delete field permission " + rowId + " -> " + owner().delete("/modules/" + LEADS + "/field-permissions/" + rowId).statusCode());
    }

    /** All field-permission rows of one profile on Leads (fieldName -> permission). */
    public static Map<String, String> fieldPermissionsOf(String profileId) {
        List<Map<String, Object>> rows = CrmUser.ok(owner().get("/modules/" + LEADS + "/field-permissions"), "GET field permissions").jsonPath().getList("data");
        Map<String, String> r = new LinkedHashMap<>();
        for (Map<String, Object> x : rows) if (profileId.equals(x.get("profileId"))) r.put(String.valueOf(x.get("fieldName")), String.valueOf(x.get("permission")));
        return r;
    }

    // ---------------- leads ----------------

    /** POST a Leads record with extra fields; returns the raw response (the caller decides what 4xx means). */
    public static Response postLead(CrmUser as, String name, Map<String, Object> extra) {
        Map<String, Object> f = qa.features.crmautomationorder.CrmApi.minimal(LEADS, name);
        f.put("single_line_3_9", "QA W1");
        f.putAll(extra);
        return as.post("/modules/" + LEADS + "/records", m("layout_id", LEADS_LAYOUT, "data", qa.features.crmautomationorder.CrmApi.data(f)));
    }

    public static Response patchLead(CrmUser as, String id, Map<String, Object> fields) {
        return as.patch("/modules/" + LEADS + "/records/" + id, m("data", qa.features.crmautomationorder.CrmApi.data(fields)));
    }

    /** Field value as the owner sees it (owner has every field). */
    public static Object valueAsOwner(String leadId, String key) {
        return readValue(CrmUser.ok(owner().get("/modules/" + LEADS + "/records/" + leadId), "GET lead as owner"), key);
    }

    /** Value of {@code key} in a record response, whatever the shape (data.data[] fields list or a flat map). */
    @SuppressWarnings("unchecked")
    public static Object readValue(Response r, String key) {
        Object data = r.jsonPath().get("data");
        Object found = find(data, key);
        return found;
    }

    @SuppressWarnings("unchecked")
    private static Object find(Object node, String key) {
        if (node instanceof Map<?, ?> mp) {
            Map<String, Object> m = (Map<String, Object>) mp;
            if (key.equals(m.get("key")) || key.equals(m.get("field_key")) || key.equals(m.get("apiName")) || key.equals(m.get("api_name")))
                return m.containsKey("value") ? m.get("value") : m.get("values");
            if (m.containsKey(key) && !(m.get(key) instanceof Map)) return m.get(key);
            for (Object v : m.values()) {
                Object f = find(v, key);
                if (f != null) return f;
            }
        } else if (node instanceof List<?> l) {
            for (Object v : l) {
                Object f = find(v, key);
                if (f != null) return f;
            }
        }
        return null;
    }

    public static boolean responseMentions(Response r, String text) {
        return r.asString().contains(text);
    }

    public static void deleteLead(String id) {
        if (id == null) return;
        Response r = owner().delete("/modules/" + LEADS + "/records/" + id);
        if (r.statusCode() / 100 != 2 && r.statusCode() != 404) fact("cleanup", "delete lead " + id + " -> " + r.statusCode());
    }

    // ---------------- audit ----------------

    /** Audit events of one app (newest first, up to {@code limit}). */
    public static List<Map<String, Object>> auditEvents(String appKey, int limit) {
        return CrmUser.ok(owner().get("/audit/events?app_key=" + appKey + "&limit=" + limit), "GET audit " + appKey).jsonPath().getList("data");
    }

    /** Polls the audit feed of {@code appKeys} for up to {@code seconds} until an event matches; null = none arrived. */
    public static Map<String, Object> waitForEvent(List<String> appKeys, int seconds, Predicate<Map<String, Object>> match) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (true) {
            for (String app : appKeys)
                for (Map<String, Object> e : auditEvents(app, 100)) if (match.test(e)) return e;
            if (System.currentTimeMillis() > end) return null;
            try {
                Thread.sleep(10_000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                return null;
            }
        }
    }

    // ---------------- login history ----------------

    /** Active login-history rows (owner view), following next_cursor up to {@code pages} pages of 100. */
    public static List<Map<String, Object>> activeSessions(int pages) {
        List<Map<String, Object>> all = new ArrayList<>();
        String cursor = null;
        for (int i = 0; i < pages; i++) {
            JsonPath j = CrmUser.ok(owner().get("/audit/login-history?status=active&limit=100" + (cursor != null ? "&cursor=" + cursor : "")), "GET login history").jsonPath();
            List<Map<String, Object>> items = j.getList("data");   // data is a plain array; the cursor is in meta
            if (items == null) break;
            items.stream().filter(java.util.Objects::nonNull).forEach(all::add);   // the feed can contain null rows (the UI filters them too)
            cursor = j.getString("meta.next_cursor");
            if (cursor == null || items.isEmpty()) break;
        }
        return all;
    }

    // ---------------- user overrides ----------------

    public static Response setOverride(String userId, String key, String effect) {
        return owner().post("/iam/users/" + userId + "/overrides", m("permission_key", key, "effect", effect, "reason", QA + "test"));
    }

    public static void clearOverride(String userId, String key) {
        fact("cleanup", "clear override " + key + " -> " + owner().delete("/iam/users/" + userId + "/overrides/" + key + "?reason=QA%20W1%20cleanup").statusCode());
    }

    public static String overrides(String userId) {
        return CrmUser.ok(owner().get("/iam/users/" + userId + "/overrides"), "GET overrides").asString();
    }

    // ---------------- users ----------------

    public static Response setStatus(String userId, String status) {
        return owner().patch("/iam/users/" + userId, m("status", status));
    }

    public static String statusOf(String userId) {
        return String.valueOf(CrmHierarchyApi.user(userId).get("status"));
    }
}
