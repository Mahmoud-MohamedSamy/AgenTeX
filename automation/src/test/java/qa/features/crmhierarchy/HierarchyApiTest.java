package qa.features.crmhierarchy;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.CrmUser;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmhierarchy.CrmHierarchyApi.*;
import static qa.features.crmhierarchy.CrmHierarchyFeature.*;

/**
 * API rows of groups A, C, D, E, F, G, L and Z (no browser). Writes only what each row needs (a rejected bad value, a
 * manager set and cleared) and restores from the snapshot in @AfterClass. Serial with VisibilityTest / HierarchyUiTest.
 * Z rows: pass = the capability is still missing (gap-check), the fact line says what was found.
 */
public class HierarchyApiTest {
    private Snapshot baseline;

    @BeforeClass(alwaysRun = true)
    public void start() {
        baseline = snapshot();
    }

    @AfterClass(alwaysRun = true)
    public void end() {
        if (baseline == null) return;
        restore(baseline);
        List<String> d = diff(baseline, snapshot());
        fact("revert-api", d.isEmpty() ? "restored: no difference from the baseline" : "DIFFERENCES: " + d);
        Assert.assertTrue(d.isEmpty(), "not restored: " + d);
    }

    private static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    private static String err(Response r) {
        String code = null, msg = null;
        try {
            code = r.jsonPath().getString("error.code");
            msg = r.jsonPath().getString("error.message");
        } catch (RuntimeException notJson) {
            String b = r.asString();
            if (!b.isBlank()) msg = b.length() > 120 ? b.substring(0, 120) : b;
        }
        return r.statusCode() + (code != null ? " " + code : "") + (msg != null ? " '" + msg + "'" : "");
    }

    // ---------------- A — access ----------------

    @CaseId("A4")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "A User without the manage permission cannot change the mode")
    public void userCannotWriteMode() {
        int v0 = version();
        Response r = putMode(CrmUser.as(USER_N), "reporting", v0);
        fact("A4", "nameb56175 PUT reporting -> " + err(r) + "; mode now " + mode() + " v" + version());
        if (!"role".equals(mode())) setMode("role");
        Assert.assertEquals(r.statusCode(), 403, "a User could write the hierarchy preference");
    }

    @CaseId("A5")
    @Test(groups = {"crmhierarchy", "api"}, description = "A User can read the mode (record only)")
    public void userReadsMode() {
        Response r = CrmUser.as(USER_N).get(RESOLVED);
        fact("A5", "nameb56175 GET preference -> " + r.statusCode());
        Assert.assertTrue(r.statusCode() == 200 || r.statusCode() == 403, "unexpected " + r.statusCode());
    }

    @CaseId("A8")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "A User cannot assign another user's reporting manager")
    public void userCannotAssignManager() {
        Object before = user(V_ID).get("reportingManagerId");
        Response r = setManager(CrmUser.as(USER_N), V_ID, N_ID);
        Object after = user(V_ID).get("reportingManagerId");
        fact("A8", "nameb56175 PATCH valafo's manager -> " + err(r) + "; changed=" + !String.valueOf(before).equals(String.valueOf(after)));
        Assert.assertEquals(r.statusCode(), 403);
        Assert.assertEquals(after, before);
    }

    @CaseId("A7")
    @Test(groups = {"crmhierarchy", "api"}, description = "Who holds the self-service permission iam.personal.reporting_hierarchy (record)")
    public void personalPermissionHolders() {
        boolean n = hasPermission(CrmUser.as(USER_N), "iam.personal.reporting_hierarchy");
        boolean o = hasPermission(owner(), "iam.personal.reporting_hierarchy");
        fact("A7", "iam.personal.reporting_hierarchy: owner=" + o + ", User profile (nameb56175)=" + n + "; no CRM profile grants it (profiles read 21 Oct 2026)");
    }

    // ---------------- C / D — the setting contract ----------------

    @CaseId("C8")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Invalid mode values are rejected and nothing changes")
    public void invalidValuesRejected() {
        int v0 = version();
        StringBuilder out = new StringBuilder();
        boolean allRejected = true;
        for (Object bad : new Object[]{"\"manager\"", "\"\"", "\"ROLE\"", "123", "[\"role\"]", "null", "{\"mode\":\"role\"}"}) {
            Response r = owner().put("/settings/values", body(bad, version()));
            out.append(bad).append(" -> ").append(r.statusCode()).append("; ");
            if (r.statusCode() / 100 == 2) allRejected = false;
        }
        String now = mode();
        fact("C8", out + "mode after: " + now + " v" + version() + " (was v" + v0 + ")");
        if (!"role".equals(now)) {
            CrmUser.ok(putMode(owner(), "role", version()), "repair mode");
        }
        Assert.assertTrue(allRejected, "an invalid hierarchy value was accepted: " + out);
        Assert.assertEquals(now, "role");
    }

    @CaseId({"C9", "D5"})
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Writes without or with a stale expected_version are refused")
    public void versionGuard() {
        int v0 = version();
        Response stale = putMode(owner(), "role", v0 - 1);
        Response none = putMode(owner(), "role", null);
        fact("C9/D5", "stale version -> " + err(stale) + "; no version -> " + err(none) + "; version now v" + version() + " (was v" + v0 + ")");
        Assert.assertTrue(stale.statusCode() == 409 || stale.statusCode() == 412 || stale.statusCode() == 400, "stale write accepted: " + stale.statusCode());
        Assert.assertTrue(none.statusCode() / 100 == 4, "write without expected_version accepted (last write wins): " + none.statusCode());
    }

    @CaseId({"D1", "D2"})
    @Test(groups = {"crmhierarchy", "api"}, description = "History rows carry old/new value, time and who")
    public void historyRows() {
        List<Map<String, Object>> h = history();
        Assert.assertFalse(h.isEmpty(), "no history");
        Map<String, Object> top = h.get(0);
        fact("D1/D2", h.size() + " rows; newest " + top.get("old_value") + " -> " + top.get("new_value") + " at " + top.get("changed_at") + " by " + top.get("changed_by"));
        Assert.assertNotNull(top.get("changed_by"), "history has no changed_by");
        Assert.assertNotNull(top.get("changed_at"));
    }

    // ---------------- E — profile rank ----------------

    @CaseId({"E1", "E7"})
    @Test(groups = {"crmhierarchy", "api"}, description = "Profile ranks follow the parent rule; which profiles grant records.view_all")
    public void profileRanks() {
        List<Map<String, Object>> ps = CrmUser.ok(owner().get("/iam/profiles"), "profiles").jsonPath().getList("data");
        Map<String, Map<String, Object>> byId = new LinkedHashMap<>();
        for (Map<String, Object> p : ps) byId.put(String.valueOf(p.get("profileId")), p);
        StringBuilder bad = new StringBuilder();
        for (Map<String, Object> p : ps) {
            Object parent = p.get("parentProfileId");
            if (parent == null || !byId.containsKey(String.valueOf(parent))) continue;
            int r = ((Number) p.get("rank")).intValue(), pr = ((Number) byId.get(String.valueOf(parent)).get("rank")).intValue();
            if (r >= pr) bad.append(p.get("name")).append(" ").append(r).append(" >= parent ").append(pr).append("; ");
        }
        StringBuilder viewAll = new StringBuilder();
        for (Map<String, Object> p : ps) {
            Response r = owner().get("/iam/profiles/" + p.get("profileId") + "/permissions");
            if (r.statusCode() == 200 && r.asString().contains("\"metadata.records.view_all\""))
                viewAll.append(p.get("name")).append(" (").append(p.get("appKey")).append("); ");
        }
        fact("E1/E7", "rank conflicts: " + (bad.length() == 0 ? "none" : bad) + " | profiles granting metadata.records.view_all (bypasses the hierarchy): " + viewAll);
        Assert.assertEquals(bad.length(), 0, "rank conflicts: " + bad);
    }

    @CaseId("E7d")
    @Test(groups = {"crmhierarchy", "api", "HP-BUG-03"}, description = "A Desk profile must not grant view-all on CRM records")
    public void deskProfileGrantsCrmViewAll() {
        List<Map<String, Object>> ps = CrmUser.ok(owner().get("/iam/profiles"), "profiles").jsonPath().getList("data");
        Map<String, Object> deskAdmin = ps.stream().filter(p -> "Desk Administrator".equals(p.get("name"))).findFirst().orElse(null);
        if (deskAdmin == null) throw new org.testng.SkipException("no Desk Administrator profile");
        boolean grants = CrmUser.ok(owner().get("/iam/profiles/" + deskAdmin.get("profileId") + "/permissions"), "perms").asString().contains("\"metadata.records.view_all\"");
        CrmUser sup = CrmUser.as(CrmOrderFeature.SUPERVISOR);
        boolean supHas = hasPermission(sup, "metadata.records.view_all");
        fact("E7d", "Desk Administrator (app desk) grants metadata.records.view_all=" + grants + "; the CRM Supervisor who also holds it has view_all=" + supHas);
        Assert.assertFalse(supHas, "a Desk profile gives a CRM Supervisor view-all on CRM records, so the CRM hierarchy does not apply to them");
    }

    // ---------------- F — admin reporting manager ----------------

    @CaseId({"F3", "F4"})
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Set and clear a manager; the manager's subordinates list follows")
    public void setAndClearManager() {
        Object was = user(N_ID).get("reportingManagerId");
        try {
            CrmUser.ok(setManager(owner(), N_ID, V_ID), "set");
            List<Object> subs = CrmUser.ok(CrmUser.as(USER_V).get("/iam/me/subordinates"), "subs").jsonPath().getList("data.user_id");
            CrmUser.ok(setManager(owner(), N_ID, null), "clear");
            Object cleared = user(N_ID).get("reportingManagerId");
            fact("F3/F4", "N -> V: listed in V's subordinates=" + (subs != null && subs.contains(N_ID)) + "; cleared -> " + cleared);
            Assert.assertTrue(subs != null && subs.contains(N_ID));
            Assert.assertNull(cleared);
        } finally {
            setManager(owner(), N_ID, was == null ? null : String.valueOf(was));
        }
    }

    @CaseId({"F5", "F6"})
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Loops in the chain are rejected (2 and 3 users)")
    public void loopsRejected() {
        Object nWas = user(N_ID).get("reportingManagerId"), vWas = user(V_ID).get("reportingManagerId");
        String sup = CrmUser.as(CrmOrderFeature.SUPERVISOR).id();
        Object sWas = user(sup).get("reportingManagerId");
        try {
            CrmUser.ok(setManager(owner(), N_ID, V_ID), "N -> V");
            CrmUser.ok(setManager(owner(), V_ID, null), "V -> none");
            Response two = setManager(owner(), V_ID, N_ID);
            CrmUser.ok(setManager(owner(), V_ID, sup), "V -> S");
            Response three = setManager(owner(), sup, N_ID);
            fact("F5/F6", "loop of 2 (V -> N while N -> V) -> " + err(two) + "; loop of 3 (S -> N while N -> V -> S) -> " + err(three));
            Assert.assertTrue(two.statusCode() / 100 == 4, "2-user loop saved");
            Assert.assertTrue(three.statusCode() / 100 == 4, "3-user loop saved");
        } finally {
            setManager(owner(), sup, sWas == null ? null : String.valueOf(sWas));
            setManager(owner(), V_ID, vWas == null ? null : String.valueOf(vWas));
            setManager(owner(), N_ID, nWas == null ? null : String.valueOf(nWas));
        }
    }

    @CaseId({"F7", "F8"})
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Self and bad ids are rejected as manager")
    public void badManagerIds() {
        Object was = user(N_ID).get("reportingManagerId");
        StringBuilder out = new StringBuilder();
        boolean ok = true;
        try {
            for (Object[] c : new Object[][]{{"self", N_ID}, {"malformed", "not-a-uuid"}, {"unknown", "00000000-0000-0000-0000-000000000001"},
                    {"script", "<script>alert(1)</script>"}, {"number", 123}}) {
                Map<String, Object> b = new LinkedHashMap<>();
                b.put("reporting_manager_id", c[1]);
                Response r = owner().patch("/iam/users/" + N_ID + "/reporting-manager", b);
                out.append(c[0]).append(" -> ").append(err(r)).append("; ");
                if (r.statusCode() / 100 == 2) ok = false;
            }
        } finally {
            setManager(owner(), N_ID, was == null ? null : String.valueOf(was));
        }
        fact("F7/F8", out.toString());
        Assert.assertTrue(ok, "a bad manager id was accepted: " + out);
    }

    @CaseId({"F9", "Z7"})
    @Test(groups = {"crmhierarchy", "api", "gap-check"}, description = "Gap Z7: a lower-ranked user can be set as manager of a higher-ranked one")
    public void lowerRankAsManager() {
        String sup = CrmUser.as(CrmOrderFeature.SUPERVISOR).id();
        Object was = user(sup).get("reportingManagerId");
        Response r;
        try {
            r = setManager(owner(), sup, N_ID);   // Supervisor (300) reports to a User (100)
        } finally {
            setManager(owner(), sup, was == null ? null : String.valueOf(was));
        }
        fact("F9/Z7", "Supervisor -> manager = User (rank 100): " + err(r) + (r.statusCode() / 100 == 2 ? " (allowed: gap still open)" : " (refused: gap closed)"));
        Assert.assertEquals(r.statusCode() / 100, 2, "now refused: Z7 may be built, check and close the item");
    }

    // ---------------- G — self service ----------------

    @CaseId("G9")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "A User without the self-service permission cannot set their own manager by API")
    public void userCannotSetOwnManager() {
        CrmUser n = CrmUser.as(USER_N);
        Object was = user(N_ID).get("reportingManagerId");
        Response r = n.put("/iam/me/profile", m("reporting_manager_id", V_ID));
        Object after = user(N_ID).get("reportingManagerId");
        if (!String.valueOf(was).equals(String.valueOf(after))) setManager(owner(), N_ID, was == null ? null : String.valueOf(was));
        fact("G9", "nameb56175 (no iam.personal.reporting_hierarchy) PUT /iam/me/profile reporting_manager_id -> " + err(r) + "; manager changed=" + !String.valueOf(was).equals(String.valueOf(after)));
        Assert.assertEquals(String.valueOf(after), String.valueOf(was), "a User without the permission changed their own manager");
    }

    @CaseId({"G6", "G7"})
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Self-service: own id and bad ids are rejected")
    public void selfServiceBadValues() {
        CrmUser o = owner();
        String me = o.id();
        Object was = user(me).get("reportingManagerId");
        StringBuilder out = new StringBuilder();
        boolean ok = true;
        try {
            for (Object[] c : new Object[][]{{"self", me}, {"malformed", "abc"}, {"unknown", "00000000-0000-0000-0000-000000000002"}, {"spaces", "  " + V_ID + "  "}}) {
                Response r = o.put("/iam/me/profile", m("reporting_manager_id", c[1]));
                Object now = user(me).get("reportingManagerId");
                out.append(c[0]).append(" -> ").append(r.statusCode()).append(" stored=").append(now).append("; ");
                if (!"spaces".equals(c[0]) && now != null && !String.valueOf(now).equals(String.valueOf(was))) ok = false;
                setManager(o, me, was == null ? null : String.valueOf(was));
            }
        } finally {
            setManager(o, me, was == null ? null : String.valueOf(was));
        }
        fact("G6/G7", "owner self-service: " + out);
        Assert.assertTrue(ok, "a bad self-service manager value was stored: " + out);
    }

    // ---------------- L — security ----------------

    @CaseId("L1")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "No token: 401 on every hierarchy endpoint")
    public void noToken() {
        StringBuilder out = new StringBuilder();
        boolean ok = true;
        for (String p : new String[]{RESOLVED, HISTORY, "/iam/me/subordinates", "/iam/users?limit=1", "/iam/profiles"}) {
            int s = RestAssured.given().baseUri(CrmOrderFeature.API).contentType(ContentType.JSON).relaxedHTTPSValidation()
                    .header("x-tenant-id", CrmOrderFeature.TENANT).header("x-app-key", "crm").get(p).statusCode();
            out.append(p.replaceAll("\\?.*", "")).append(" ").append(s).append("; ");
            if (s != 401) ok = false;
        }
        int w = RestAssured.given().baseUri(CrmOrderFeature.API).contentType(ContentType.JSON).relaxedHTTPSValidation()
                .header("x-tenant-id", CrmOrderFeature.TENANT).header("x-app-key", "crm").body(body("\"reporting\"", version())).put("/settings/values").statusCode();
        out.append("PUT /settings/values ").append(w);
        fact("L1", out.toString());
        Assert.assertTrue(ok && w == 401, out.toString());
    }

    @CaseId("L2")
    @Test(groups = {"crmhierarchy", "api", "regression"}, description = "Type confusion in the setting body is rejected")
    public void typeConfusion() {
        Response a = owner().put("/settings/values", body("\"role\"", "abc"));
        Response c = owner().put("/settings/values", body("reporting", version()));   // not JSON
        String now = mode();
        fact("L2", "expected_version 'abc' -> " + err(a) + "; value_json not JSON (reporting) -> " + err(c) + "; mode " + now);
        if (!"role".equals(now)) setMode("role");
        Assert.assertTrue(a.statusCode() / 100 == 4 && c.statusCode() / 100 == 4);
    }

    // ---------------- Z — gaps (pass = still missing) ----------------

    @CaseId({"Z17", "Z18", "Z19"})
    @Test(groups = {"crmhierarchy", "api", "gap-check"}, description = "Gaps: roles API, sharing rules, any user's subordinates")
    public void apiGaps() {
        StringBuilder out = new StringBuilder();
        boolean allMissing = true;
        for (String p : new String[]{"/iam/roles", "/iam/hierarchy", "/iam/sharing-rules", "/settings/data-sharing", "/iam/users/" + N_ID + "/subordinates"}) {
            int s = owner().get(p).statusCode();
            out.append(p).append(" ").append(s).append("; ");
            if (s == 200) allMissing = false;
        }
        fact("Z17-19", out.toString());
        Assert.assertTrue(allMissing, "one of these now answers 200 - check and close the item: " + out);
    }

    @CaseId("Z16")
    @Test(groups = {"crmhierarchy", "api", "gap-check"}, description = "Gap: CRM modules only offer public / hierarchy")
    public void visibilityOptions() {
        List<Map<String, Object>> mods = CrmUser.ok(owner().get("/modules"), "modules").jsonPath().getList("data");
        Map<Object, Long> counts = new LinkedHashMap<>();
        for (Map<String, Object> m : mods) counts.merge(m.get("recordVisibility"), 1L, Long::sum);
        fact("Z16", "recordVisibility values in use: " + counts);
        Assert.assertTrue(counts.keySet().stream().allMatch(k -> "public".equals(k) || "hierarchy".equals(k) || k == null));
    }
}
