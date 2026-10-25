package qa.features.crmaccess;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.auth.Credentials;
import qa.core.config.Config;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 full-feature API cases for users, profiles, permissions, org units, policies validation, visibility levels and
 * personal settings (plan v2: US-06/07/15/16, PR-03/05/06, PE-05, OU-02..04, AU-03/07, LH-06, SP-02, PS-01/05).
 * Everything created is prefixed "QA W1 " and removed in @AfterClass; users and mode are diffed against the snapshot.
 */
public class AdminApiTest {
    private static final String OU_HR = qa.features.crmhierarchy.CrmHierarchyFeature.OU_HR;
    private CrmHierarchyApi.Snapshot baseline;
    private final List<String> profiles = new ArrayList<>();
    private final List<String> orgUnits = new ArrayList<>();      // deleted in reverse order
    private final List<String> overrides = new ArrayList<>();      // on test user 2
    private final List<String> invitations = new ArrayList<>();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        baseline = CrmHierarchyApi.snapshot();
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        overrides.forEach(k -> clearOverride(V_ID, k));
        for (String inv : invitations) fact("cleanup", "cancel invitation " + inv + " -> " + owner().post("/iam/users/invitations/" + inv + "/cancel", Map.of()).statusCode());
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        owner().patch("/iam/users/" + N_ID, m("org_unit_id", OU_SALES));
        for (int i = orgUnits.size() - 1; i >= 0; i--) fact("cleanup", "delete org unit " + orgUnits.get(i) + " -> " + owner().delete("/iam/org-units/" + orgUnits.get(i)).statusCode());
        profiles.forEach(CrmAccessApi::deleteProfile);
        List<String> d = CrmHierarchyApi.diff(baseline, CrmHierarchyApi.snapshot());
        String ous = CrmUser.ok(owner().get("/iam/org-units"), "GET org units").asString();
        boolean ouLeft = orgUnits.stream().anyMatch(ous::contains);
        fact("admin-revert", (d.isEmpty() ? "users and mode as before" : "DIFFERENCES: " + d) + "; QA org units left=" + ouLeft);
        Assert.assertTrue(d.isEmpty() && !ouLeft, "not restored: " + d + ", org units left=" + ouLeft);
    }

    private static String id(Response r) {
        JsonPath j = r.jsonPath();
        for (String k : List.of("data.id", "data.profileId", "data.orgUnitId", "data.org_unit_id", "data.invitationId", "data.invitation_id"))
            if (j.getString(k) != null) return j.getString(k);
        return null;
    }

    // ---------------- users ----------------

    @CaseId("US-06")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Invite validation: bad email, no profile, invitation lifetime out of range are refused")
    public void inviteValidation() {
        String t = String.valueOf(System.currentTimeMillis() % 100000);
        Map<String, Response> cases = new LinkedHashMap<>();
        cases.put("bad email", owner().post("/iam/users/invite", m("email", "qa-w1-not-an-email", "profile_id", P_USER)));
        cases.put("no profile", owner().post("/iam/users/invite", m("email", "qa.w1.noprofile." + t + "@example.com")));
        cases.put("lifetime 0", owner().post("/iam/users/invite", m("email", "qa.w1.life0." + t + "@example.com", "profile_id", P_USER, "lifetime_days", 0)));
        cases.put("lifetime 10000", owner().post("/iam/users/invite", m("email", "qa.w1.life10000." + t + "@example.com", "profile_id", P_USER, "lifetime_days", 10000)));
        StringBuilder f = new StringBuilder();
        List<String> accepted = new ArrayList<>();
        cases.forEach((k, r) -> {
            f.append(k).append(" -> ").append(err(r)).append("; ");
            if (r.statusCode() / 100 == 2) {
                accepted.add(k);
                String inv = id(r);
                if (inv != null) invitations.add(inv);
            }
        });
        fact("US-06", f.toString());
        Assert.assertTrue(accepted.isEmpty(), "invalid invitations accepted: " + accepted);
    }

    @CaseId("US-07")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Change a user's profile and org unit, and back")
    public void changeProfileAndOrgUnit() {
        // the profile scope is not the user's org unit: the org unit is changed with PATCH /iam/users/{id} {org_unit_id}
        CrmHierarchyApi.setProfile(N_ID, qa.features.crmhierarchy.CrmHierarchyFeature.P_SUPERVISOR, OU_SALES);
        CrmUser.ok(owner().patch("/iam/users/" + N_ID, m("org_unit_id", OU_HR)), "move to HR");
        Map<String, Object> u = CrmHierarchyApi.user(N_ID);
        String prof = String.valueOf(u.get("profileNames")), ou = String.valueOf(u.get("orgUnitId"));
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        CrmUser.ok(owner().patch("/iam/users/" + N_ID, m("org_unit_id", OU_SALES)), "move back to Sales");
        Map<String, Object> back = CrmHierarchyApi.user(N_ID);
        fact("US-07", "after change: profile " + prof + ", org unit HR=" + OU_HR.equals(ou) + "; after revert: " + back.get("profileNames") + ", Sales=" + OU_SALES.equals(back.get("orgUnitId")));
        Assert.assertEquals(prof, "Supervisor");
        Assert.assertEquals(ou, OU_HR);
        Assert.assertEquals(String.valueOf(back.get("profileNames")), "User");
    }

    @CaseId("US-15")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A CRM Admin cannot GRANT a permission they do not hold themselves")
    public void cannotGrantWhatYouDoNotHold() {
        CrmUser admin = CrmUser.as(ADMIN_A);
        String mine = CrmUser.ok(admin.get("/iam/me/permissions"), "admin permissions").asString();
        List<Map<String, Object>> catalog = CrmUser.ok(owner().get("/iam/permissions"), "permission catalog").jsonPath().getList("data");
        String key = catalog.stream().map(p -> String.valueOf(p.get("permissionKey")))
                .filter(k -> !mine.contains("\"" + k + "\"") && !k.startsWith("crm.page")).findFirst().orElse(null);
        if (key == null) throw new SkipException("INCONCLUSIVE: the CRM Admin holds every permission in the catalog");
        Response r = admin.post("/iam/users/" + V_ID + "/overrides", m("permission_key", key, "effect", "GRANT", "reason", QA + "US-15"));
        boolean stuck = overrides(V_ID).contains(key);
        if (stuck) overrides.add(key);
        fact("US-15", "CRM Admin GRANT '" + key + "' (not held) to test user 2 -> " + err(r) + "; override stored=" + stuck);
        Assert.assertFalse(stuck, "a CRM Admin granted a permission they do not hold: " + key);
    }

    @CaseId("US-16")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A User-profile user reaches admin data only where they hold the permission")
    public void accessMatchesPermissions() {
        CrmUser n = CrmUser.as(USER_N);
        String perms = CrmUser.ok(n.get("/iam/me/permissions"), "N permissions").asString();
        Map<String, String> probes = new LinkedHashMap<>();
        probes.put("iam.user.view", "/iam/users?app_key=crm");
        probes.put("iam.profile.manage", "/iam/profiles/" + P_USER + "/permissions");
        probes.put("workflow:rule:view", "/workflow/rules");
        probes.put("workflow:approval:view", "/workflow/approval-processes");
        probes.put("crm:web_form:view", "/web-forms");
        probes.put("mail:connection:manage", "/mail/connections");
        List<String> leaks = new ArrayList<>();
        StringBuilder f = new StringBuilder();
        probes.forEach((perm, path) -> {
            int s = n.get(path).statusCode();
            boolean holds = perms.contains("\"" + perm + "\"");
            f.append(perm).append(holds ? " (held) " : " (not held) ").append(s).append("; ");
            if (!holds && s == 200) leaks.add(perm + " " + path);
        });
        fact("US-16", "test user 1 (User profile): " + f);
        Assert.assertTrue(leaks.isEmpty(), "reachable without the permission: " + leaks);
    }

    // ---------------- profiles ----------------

    @CaseId("PR-03")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A CRM Admin cannot create a profile ranked above their own")
    public void rankAboveOwnRefused() {
        CrmUser admin = CrmUser.as(ADMIN_A);
        Response r = admin.post("/iam/profiles", m("name", QA + "Rank 1000 " + System.currentTimeMillis() % 100000, "parent_profile_id", null, "rank", 1000,
                "is_tenant_wide", false, "app_key", "crm"));
        String pid = r.statusCode() / 100 == 2 ? id(r) : null;
        if (pid != null) profiles.add(pid);
        fact("PR-03", "CRM Admin creates rank 1000 -> " + err(r));
        Assert.assertNull(pid, "a CRM Admin created a profile ranked above their own");
    }

    @CaseId("PR-05")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A profile that still has users cannot be deleted silently")
    public void deleteProfileWithUsers() {
        String pid = createProfile(QA + "InUse " + System.currentTimeMillis() % 100000, P_USER);
        profiles.add(pid);
        CrmHierarchyApi.setProfile(N_ID, pid, OU_SALES);
        Response d = owner().delete("/iam/profiles/" + pid);
        String nowProfile = String.valueOf(CrmHierarchyApi.user(N_ID).get("profileNames"));
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        fact("PR-05", "delete profile with test user 1 on it -> " + err(d) + "; test user 1 profile afterwards '" + nowProfile + "'");
        if (d.statusCode() / 100 == 2) profiles.remove(pid);
        Assert.assertTrue(d.statusCode() / 100 != 2, "a profile with users was deleted (user left with '" + nowProfile + "')");
    }

    @CaseId("PR-06")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A system profile cannot be renamed (renamed back at once if it can)")
    public void systemProfileProtected() {
        Response r = owner().patch("/iam/profiles/" + P_USER, m("name", QA + "User renamed"));
        boolean renamed = CrmUser.ok(owner().get("/iam/profiles"), "GET profiles").asString().contains(QA + "User renamed");
        if (renamed) fact("PR-06", "REVERT rename -> " + owner().patch("/iam/profiles/" + P_USER, m("name", "User")).statusCode());
        fact("PR-06", "owner renames system profile User -> " + err(r) + "; renamed=" + renamed);
        Assert.assertFalse(renamed, "the system profile 'User' could be renamed");
    }

    // ---------------- permissions really apply ----------------

    @CaseId("PE-05")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Denying a permission blocks the action it guards (one probe per area)")
    public void permissionsReallyApply() {
        Map<String, String> probes = new LinkedHashMap<>();
        probes.put("iam.user.view", "/iam/users?app_key=crm");
        probes.put("workflow:rule:view", "/workflow/rules");
        probes.put("workflow:action:view", "/workflow/actions");
        probes.put("workflow:approval:view", "/workflow/approval-processes");
        probes.put("workflow:review:view", "/workflow/review-processes");
        probes.put("crm:web_form:view", "/web-forms");
        probes.put("crm:record_portal:view", "/record-portals");
        probes.put("mail:connection:manage", "/mail/connections");
        probes.put("telephony:integration:view", "/telephony/integrations");
        probes.put("messaging:view", "/messaging/settings");
        probes.put("billing:view", "/billing/me/summary");
        probes.put("iam.security.audit.view_all", "/audit/events?app_key=crm&limit=5");
        CrmUser v = CrmUser.as(USER_V);
        Map<String, String> usable = new LinkedHashMap<>();
        StringBuilder ctl = new StringBuilder();
        probes.forEach((k, p) -> {
            int s = v.get(p).statusCode();
            ctl.append(k).append(' ').append(s).append("; ");
            if (s == 200) usable.put(k, p);
        });
        fact("PE-05", "control as test user 2 before any deny: " + ctl);
        if (usable.isEmpty()) throw new SkipException("INCONCLUSIVE: test user 2 reaches none of the probe endpoints");
        for (String k : usable.keySet()) {
            Response r = setOverride(V_ID, k, "deny");
            if (r.statusCode() / 100 == 2) overrides.add(k);
        }
        Session fresh = Session.signIn(USER_V);
        List<String> stillOpen = new ArrayList<>();
        StringBuilder f = new StringBuilder();
        usable.forEach((k, p) -> {
            Response r = fresh.get(p);
            int s = r.statusCode();
            f.append(k).append(' ').append(s).append("; ");
            if (s != 200) return;
            if (k.endsWith("audit.view_all")) {
                // "view own" still answers 200: the deny is applied when no other user's events come back
                List<Map<String, Object>> evs = r.jsonPath().getList("data");
                long others = evs == null ? 0 : evs.stream().filter(e -> e != null && !V_ID.equals(e.get("actor_id"))).count();
                f.append("(others' events ").append(others).append(") ");
                if (others > 0) stillOpen.add(k);
            } else stillOpen.add(k);
        });
        fact("PE-05", "after DENY overrides (fresh sign-in): " + f);
        Assert.assertTrue(stillOpen.isEmpty(), "denied but still allowed: " + stillOpen);
    }

    // ---------------- org units ----------------

    @CaseId("OU-02/03/04")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Org units: create, rename, move, no move under a descendant, no delete with children or users")
    public void orgUnitLifecycle() {
        String t = String.valueOf(System.currentTimeMillis() % 100000);
        Response ca = owner().post("/iam/org-units", m("parent_id", OU_SALES, "name", QA + "OU A " + t, "app_key", "crm"));
        String a = id(CrmUser.ok(ca, "create OU A"));
        orgUnits.add(a);
        String b = id(CrmUser.ok(owner().post("/iam/org-units", m("parent_id", a, "name", QA + "OU B " + t, "app_key", "crm")), "create OU B"));
        orgUnits.add(b);
        Response ren = owner().patch("/iam/org-units/" + a, m("name", QA + "OU A renamed " + t));
        boolean renamed = CrmUser.ok(owner().get("/iam/org-units"), "GET OUs").asString().contains(QA + "OU A renamed " + t);
        Response loop = owner().patch("/iam/org-units/" + a, m("new_parent_id", b));
        Response delParent = owner().delete("/iam/org-units/" + a);
        Response move = owner().patch("/iam/org-units/" + b, m("new_parent_id", OU_SALES));
        owner().patch("/iam/users/" + N_ID, m("org_unit_id", b));
        boolean nInB = b.equals(CrmHierarchyApi.user(N_ID).get("orgUnitId"));
        Response delWithUser = owner().delete("/iam/org-units/" + b);
        owner().patch("/iam/users/" + N_ID, m("org_unit_id", OU_SALES));
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        Map<String, Object> ev = waitForEvent(List.of("iam", "crm", "metadata-engine"), 90, e -> a.equals(e.get("target_id")));
        fact("OU", "create A/B ok; rename -> " + ren.statusCode() + " shown=" + renamed + "; move A under its child B -> " + err(loop)
                + "; delete A with child -> " + err(delParent) + "; move B to Sales -> " + move.statusCode() + "; test user 1 in B=" + nInB
                + "; delete B with a user -> " + err(delWithUser) + "; audit event for A=" + (ev != null));
        if (delParent.statusCode() / 100 == 2) orgUnits.remove(a);
        if (delWithUser.statusCode() / 100 == 2) orgUnits.remove(b);
        Assert.assertTrue(renamed, "rename not shown");
        Assert.assertTrue(loop.statusCode() / 100 != 2, "a unit was moved under its own child");
        Assert.assertTrue(delParent.statusCode() / 100 != 2, "a unit with a child unit was deleted");
        Assert.assertTrue(delWithUser.statusCode() / 100 != 2, "a unit with a user in it was deleted");
        Assert.assertNotNull(ev, "org unit creation is not in the audit log (AU-03)");
    }

    // ---------------- visibility levels ----------------

    @CaseId("AU-07/LH-06")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A 'view own' user sees only their own audit events and login sessions")
    public void ownLevelSeesOnlyOwnRows() {
        CrmUser n = CrmUser.as(USER_N);
        String perms = CrmUser.ok(n.get("/iam/me/permissions"), "N permissions").asString();
        Response au = n.get("/audit/events?app_key=crm&limit=100");
        Response lh = n.get("/audit/login-history?limit=100");
        List<Map<String, Object>> evs = au.statusCode() == 200 ? au.jsonPath().getList("data") : List.of();
        List<Map<String, Object>> ses = lh.statusCode() == 200 ? lh.jsonPath().getList("data") : List.of();
        long foreignEv = evs == null ? 0 : evs.stream().filter(e -> e != null && !N_ID.equals(e.get("actor_id"))).count();
        long foreignSes = ses == null ? 0 : ses.stream().filter(s -> s != null && !N_ID.equals(s.get("user_id"))).count();
        fact("AU-07/LH-06", "test user 1 holds audit view_all=" + perms.contains("audit.view_all") + ", view_self=" + perms.contains("audit.view_self")
                + "; audit -> " + au.statusCode() + " (" + (evs == null ? 0 : evs.size()) + " rows, others' " + foreignEv + "); login history view_all="
                + perms.contains("loginhistory.view_all") + " -> " + lh.statusCode() + " (" + (ses == null ? 0 : ses.size()) + " rows, others' " + foreignSes + ")");
        if (!perms.contains("audit.view_all")) Assert.assertEquals(foreignEv, 0, "a view-own user sees other users' audit events");
        if (!perms.contains("loginhistory.view_all") && !perms.contains("loginhistory.view_team"))
            Assert.assertEquals(foreignSes, 0, "a view-own user sees other users' sessions");
    }

    // ---------------- security policy validation (refused saves only) ----------------

    @CaseId("SP-02")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Out-of-range session limits are refused and nothing is saved")
    public void sessionPolicyValidation() {
        Map<String, Object[]> bad = new LinkedHashMap<>();
        bad.put("iam.security.session.idle_timeout_minutes", new Object[]{0, 1441});
        bad.put("iam.security.session.absolute_timeout_minutes", new Object[]{0, 43201});
        bad.put("iam.security.session.max_concurrent", new Object[]{0, 1001});
        List<String> accepted = new ArrayList<>();
        StringBuilder f = new StringBuilder();
        for (Map.Entry<String, Object[]> e : bad.entrySet()) {
            String path = "/settings/resolved?app_key=iam&key=" + e.getKey() + "&scope_type=Org";
            JsonPath before = CrmUser.ok(owner().get(path), "GET " + e.getKey()).jsonPath();
            String v0 = before.getString("data.value_json");
            int ver = before.getInt("data.version");
            for (Object val : e.getValue()) {
                Response r = owner().put("/settings/values", m("app_key", "iam", "key", e.getKey(), "scope_type", "Org", "scope_id", null,
                        "value_json", String.valueOf(val), "expected_version", ver));
                JsonPath after = CrmUser.ok(owner().get(path), "GET " + e.getKey()).jsonPath();
                f.append(e.getKey().replace("iam.security.session.", "")).append('=').append(val).append(" -> ").append(r.statusCode()).append("; ");
                if (r.statusCode() / 100 == 2 || !v0.equals(after.getString("data.value_json"))) {
                    accepted.add(e.getKey() + "=" + val);
                    // put the original value back at once
                    owner().put("/settings/values", m("app_key", "iam", "key", e.getKey(), "scope_type", "Org", "scope_id", null,
                            "value_json", v0, "expected_version", after.getInt("data.version")));
                    ver = CrmUser.ok(owner().get(path), "GET").jsonPath().getInt("data.version");
                }
            }
        }
        fact("SP-02", f.toString());
        Assert.assertTrue(accepted.isEmpty(), "out-of-range session limits were saved (and put back): " + accepted);
    }

    // ---------------- personal settings ----------------

    @CaseId("PS-01")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A user edits their own account information (and it is put back)")
    public void editOwnAccountInfo() {
        CrmUser n = CrmUser.as(USER_N);
        JsonPath before = CrmUser.ok(n.get("/iam/me/profile"), "GET my profile").jsonPath();
        String root = before.get("data") != null ? "data." : "";
        Object alias0 = before.get(root + "alias"), web0 = before.get(root + "website");
        Response r = n.put("/iam/me/profile", m("alias", "QA W1 alias", "website", "https://qa-w1.example.com"));
        JsonPath after = CrmUser.ok(n.get("/iam/me/profile"), "GET my profile").jsonPath();
        Object alias1 = after.get(root + "alias"), web1 = after.get(root + "website");
        Response back = n.put("/iam/me/profile", m("alias", alias0, "website", web0));
        fact("PS-01", "PUT alias+website -> " + err(r) + "; stored alias='" + alias1 + "', website='" + web1 + "'; restore -> " + back.statusCode());
        Assert.assertEquals(String.valueOf(alias1), "QA W1 alias");
        Assert.assertEquals(String.valueOf(web1), "https://qa-w1.example.com");
    }

    @CaseId("PS-05")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Changing the password to the same password is refused (nothing changes)")
    public void passwordSameAsCurrentRefused() {
        CrmUser n = CrmUser.as(USER_N);
        Credentials c = Credentials.find(Config.get("crm.credentials.file", "../docs/Credentials/Microsoft Edge Passwords.csv"),
                Config.get("crm.credentials.host", "staging-crm.taviportal.com"), USER_N);
        Response r = n.post("/iam/me/password", m("current_password", c.password(), "new_password", c.password(), "confirm_password", c.password()));
        fact("PS-05", "same password as current -> " + err(r));
        Assert.assertTrue(r.statusCode() / 100 != 2, "the password could be 'changed' to the same password");
    }
}
