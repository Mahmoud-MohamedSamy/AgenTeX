package qa.features.crmhierarchy;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static qa.features.crmhierarchy.CrmHierarchyFeature.*;

/**
 * API side of the Hierarchy Preference tests: the setting, reporting managers, profile assignment, QA leads, and the
 * baseline snapshot / restore / diff (spec §1.3). Every read goes through {@link CrmUser#ok} so a 401 or 5xx can never
 * look like "not visible". Writes are serial: the setting is tenant-wide.
 */
public final class CrmHierarchyApi {
    public static final Path FACTS = Path.of("target/crmhierarchy-facts.txt");

    private CrmHierarchyApi() {
    }

    public static CrmUser owner() {
        return CrmUser.as(OWNER);
    }

    /** One result line for the report ("[C3] ..."), printed and appended to target/crmhierarchy-facts.txt. */
    public static synchronized void fact(String caseId, String text) {
        String line = "[" + caseId + "] " + text;
        System.out.println(line);
        try {
            Files.createDirectories(FACTS.getParent());
            Files.writeString(FACTS, line + System.lineSeparator(), StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }

    // ---------------- the setting ----------------

    public static JsonPath resolved(CrmUser as) {
        return CrmUser.ok(as.get(RESOLVED), "GET preference").jsonPath();
    }

    /** "role" or "reporting". */
    public static String mode() {
        String vj = resolved(owner()).getString("data.value_json");
        return vj == null ? null : vj.replace("\"", "");
    }

    public static int version() {
        return resolved(owner()).getInt("data.version");
    }

    public static Map<String, Object> body(Object valueJson, Object expectedVersion) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("app_key", "general");
        b.put("key", KEY);
        b.put("scope_type", "Org");
        b.put("scope_id", null);
        b.put("value_json", valueJson);
        if (expectedVersion != null) b.put("expected_version", expectedVersion);
        return b;
    }

    public static Response putMode(CrmUser as, String mode, Object expectedVersion) {
        return as.put("/settings/values", body("\"" + mode + "\"", expectedVersion));
    }

    /** Sets the mode as the owner with the current version (no-op when already set). */
    public static void setMode(String mode) {
        if (mode.equals(mode())) return;
        CrmUser.ok(putMode(owner(), mode, version()), "PUT preference " + mode);
        if (!mode.equals(mode())) throw new IllegalStateException("preference did not change to " + mode);
    }

    public static List<Map<String, Object>> history() {
        List<Map<String, Object>> l = CrmUser.ok(owner().get(HISTORY), "GET history").jsonPath().getList("data.items");
        return l == null ? List.of() : l;
    }

    // ---------------- users, managers, profiles ----------------

    public static List<Map<String, Object>> users() {
        JsonPath j = CrmUser.ok(owner().get("/iam/users?limit=100"), "GET users").jsonPath();
        // data is a plain array (GPath "data.items" on an array gives a list of nulls)
        Object d = j.get("data");
        List<Map<String, Object>> l = d instanceof List<?> ? j.getList("data") : j.getList("data.items");
        if (l == null || l.isEmpty() || l.get(0) == null) throw new IllegalStateException("GET /iam/users: no users in " + j.prettify().substring(0, 200));
        return l;
    }

    public static Map<String, Object> user(String id) {
        return users().stream().filter(u -> id.equals(u.get("userId"))).findFirst()
                .orElseThrow(() -> new IllegalStateException("user " + id + " not listed"));
    }

    public static Response setManager(CrmUser as, String userId, String managerId) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("reporting_manager_id", managerId);
        return as.patch("/iam/users/" + userId + "/reporting-manager", b);
    }

    /** Replaces the user's CRM profile (the profile needs an org scope: scope_id = org unit). */
    public static void setProfile(String userId, String profileId, String orgUnitId) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("profile_id", profileId);
        b.put("scope_id", orgUnitId);
        b.put("replace", true);
        CrmUser.ok(owner().post("/iam/users/" + userId + "/profiles", b), "assign profile");
    }

    public static boolean hasPermission(CrmUser as, String key) {
        return CrmUser.ok(as.get("/iam/me/permissions"), "my permissions").asString().contains("\"" + key + "\"");
    }

    // ---------------- QA leads ----------------

    /** Creates a QA lead as {@code as}; ownerId null = leave the Lead Owner field out (the server then uses the creator). */
    public static String createLead(CrmUser as, String name, String ownerId) {
        Map<String, Object> f = CrmApi.minimal(LEADS, name);
        f.put("single_line_3_9", "QA HP");
        if (ownerId != null) f.put("owner", ownerId);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", LEADS_LAYOUT);
        body.put("data", CrmApi.data(f));
        return CrmUser.ok(as.post("/modules/" + LEADS + "/records", body), "create lead " + name).jsonPath().getString("data.id");
    }

    /** HTTP status of opening one lead as {@code as} (200 visible, 403/404 hidden). Other codes throw. */
    public static int open(CrmUser as, String leadId) {
        Response r = as.get("/modules/" + LEADS + "/records/" + leadId);
        int s = r.statusCode();
        if (s != 200 && s != 403 && s != 404) throw new IllegalStateException("GET lead returned " + s + ": " + r.asString());
        return s;
    }

    public static boolean sees(CrmUser as, String leadId) {
        return open(as, leadId) == 200;
    }

    public static void deleteLead(String id) {
        Response r = owner().delete("/modules/" + LEADS + "/records/" + id);
        if (r.statusCode() / 100 != 2 && r.statusCode() != 404) fact("cleanup", "delete lead " + id + " -> " + r.statusCode());
    }

    // ---------------- baseline ----------------

    /** What the run may change: the mode, every user's manager / profile / org unit, and each module's record visibility. */
    public record Snapshot(String mode, Map<String, List<Object>> users, Map<String, Object> visibility) {
    }

    public static Snapshot snapshot() {
        Map<String, List<Object>> u = new LinkedHashMap<>();
        for (Map<String, Object> x : users())
            u.put(String.valueOf(x.get("userId")), List.of(String.valueOf(x.get("reportingManagerId")), String.valueOf(x.get("profileNames")), String.valueOf(x.get("orgUnitId"))));
        Map<String, Object> vis = new LinkedHashMap<>();
        List<Map<String, Object>> mods = CrmUser.ok(owner().get("/modules"), "GET modules").jsonPath().getList("data");
        for (Map<String, Object> m : mods) vis.put(String.valueOf(m.get("id")), m.get("recordVisibility"));
        return new Snapshot(mode(), u, vis);
    }

    private static final Map<String, String> PROFILE_IDS = Map.of("test", P_TEST, "User", P_USER, "Supervisor", P_SUPERVISOR, "Manager", P_MANAGER);

    /** Puts the mode, managers and the test users' profiles back to the snapshot. */
    public static void restore(Snapshot b) {
        setMode(b.mode());
        for (Map<String, Object> now : users()) {
            String id = String.valueOf(now.get("userId"));
            List<Object> was = b.users().get(id);
            if (was == null) continue;
            String mgr = "null".equals(was.get(0)) ? null : String.valueOf(was.get(0));
            if (!Objects.equals(String.valueOf(now.get("reportingManagerId")), String.valueOf(mgr)))
                fact("restore", "manager of " + now.get("displayName") + " -> " + setManager(owner(), id, mgr).statusCode());
            if (!was.get(1).equals(String.valueOf(now.get("profileNames"))) || !was.get(2).equals(String.valueOf(now.get("orgUnitId")))) {
                String pid = PROFILE_IDS.get(String.valueOf(was.get(1)));
                if (pid == null) fact("restore", "MANUAL FIX NEEDED: profile of " + now.get("displayName") + " was " + was.get(1));
                else {
                    setProfile(id, pid, String.valueOf(was.get(2)));
                    fact("restore", "profile of " + now.get("displayName") + " -> " + was.get(1));
                }
            }
        }
    }

    /** Differences between two snapshots (empty = restored). */
    public static List<String> diff(Snapshot a, Snapshot b) {
        List<String> d = new ArrayList<>();
        if (!Objects.equals(a.mode(), b.mode())) d.add("mode " + a.mode() + " -> " + b.mode());
        a.users().forEach((id, v) -> {
            if (!Objects.equals(v, b.users().get(id))) d.add("user " + id + " " + v + " -> " + b.users().get(id));
        });
        a.visibility().forEach((id, v) -> {
            if (!Objects.equals(v, b.visibility().get(id))) d.add("module " + id + " " + v + " -> " + b.visibility().get(id));
        });
        return d;
    }
}
