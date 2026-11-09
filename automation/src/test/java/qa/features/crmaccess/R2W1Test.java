package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;
import qa.features.crmrecords.CrmRecordsApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Round 2 Wave 1 (27 Oct 2026 build): checks the round-1 suites don't cover, without touching test user 1 (lane B) or
 * any tenant-wide setting. The acting admin is owner() — pass -Dcrm.adminAs=<CRM Admin email> while the owner is
 * unavailable. Users under test: test user 2 (V) and the Supervisor. Every change is undone in @AfterClass.
 */
public class R2W1Test {
    private static final String P_MANAGER_BUILTIN = "11111111-1111-1111-1111-111111111102";
    private static final String OU_HR = "5533f730-cd59-4432-970b-86090192787d";
    private static final String PFX = "QA R2W1 ";
    private final List<Runnable> undo = new ArrayList<>();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        for (int i = undo.size() - 1; i >= 0; i--) {
            try {
                undo.get(i).run();
            } catch (RuntimeException e) {
                fact("cleanup", "step failed: " + e.getMessage());
            }
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> profileByName(String name) {
        for (Map<String, Object> p : CrmUser.ok(owner().get("/iam/profiles"), "profiles").jsonPath().<Map<String, Object>>getList("data"))
            if (name.equalsIgnoreCase(String.valueOf(p.get("name")))) return p;
        return null;
    }

    private static String idOf(Map<String, Object> p) {
        return String.valueOf(p.get("profileId") != null ? p.get("profileId") : p.get("id"));
    }

    @CaseId({"R2-PR06", "R2-AIP"})
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-2543"}, description = "Built-in profiles (User, AI Agent) can't be renamed or deleted")
    public void builtInProfilesLocked() {
        Map<String, Object> user = profileByName("User");
        Map<String, Object> ai = profileByName("AI Agent");
        fact("R2-AIP", "built-in 'AI Agent' profile listed=" + (ai != null) + (ai == null ? "" : " " + ai));
        Response ren = owner().patch("/iam/profiles/" + idOf(user), m("name", PFX + "renamed User"));
        Response del = owner().delete("/iam/profiles/" + idOf(user));
        Response renAi = ai == null ? null : owner().patch("/iam/profiles/" + idOf(ai), m("name", PFX + "renamed AI"));
        String nameNow = String.valueOf(profileByName("User") == null ? "MISSING" : "User");
        if (ren.statusCode() / 100 == 2) undo.add(() -> owner().patch("/iam/profiles/" + idOf(user), m("name", "User")));
        if (renAi != null && renAi.statusCode() / 100 == 2) undo.add(() -> owner().patch("/iam/profiles/" + idOf(ai), m("name", "AI Agent")));
        fact("R2-PR06", "rename User -> " + err(ren) + "; delete User -> " + err(del) + "; rename AI Agent -> " + (renAi == null ? "n/a" : err(renAi)) + "; 'User' still listed=" + nameNow);
        Assert.assertEquals(ren.statusCode() / 100, 4, "the built-in User profile could be renamed");
        Assert.assertEquals(del.statusCode() / 100, 4, "the built-in User profile could be deleted");
        if (renAi != null) Assert.assertEquals(renAi.statusCode() / 100, 4, "the built-in AI Agent profile could be renamed");
    }

    @CaseId("R2-PR04")
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-2546"}, description = "Editing a profile's rank above its parent's is refused with a clear error, not ignored")
    public void rankAboveParentRefused() {
        String id = createProfile(PFX + "Rank " + System.currentTimeMillis() % 100000, P_USER);
        undo.add(() -> deleteProfile(id));
        Response r = owner().patch("/iam/profiles/" + id, m("rank", 600));
        Object rank = profileByIdField(id, "rank");
        fact("R2-PR04", "PATCH rank 600 (parent Manager 500) -> " + err(r) + "; rank now " + rank);
        Assert.assertEquals(r.statusCode() / 100, 4, "a rank above the parent was answered " + r.statusCode() + " (silently ignored if rank unchanged)");
    }

    private static Object profileByIdField(String id, String field) {
        for (Map<String, Object> p : CrmUser.ok(owner().get("/iam/profiles"), "profiles").jsonPath().<Map<String, Object>>getList("data"))
            if (id.equals(idOf(p))) return p.get(field);
        return null;
    }

    @CaseId("R2-PE07")
    @Test(groups = {"crmaccess", "r2w1", "api"}, description = "The permission catalogue has the new keys ai:agent:manage, ai:summary:view, metadata.modules.manage")
    public void newPermissionKeys() {
        String cat = CrmUser.ok(owner().get("/iam/permissions"), "permission catalogue").asString();
        Map<String, Boolean> has = new LinkedHashMap<>();
        for (String k : List.of("ai:agent:manage", "ai:summary:view", "metadata.modules.manage")) has.put(k, cat.contains(k));
        fact("R2-PE07", "catalogue " + cat.length() + " chars; new keys " + has);
        Assert.assertTrue(has.values().stream().allMatch(b -> b), "new permission keys missing from the catalogue: " + has);
    }

    private static String ouId(Response r) {
        for (String k : List.of("data.id", "data.orgUnitId", "data.org_unit_id", "data.unitId", "data.unit_id", "id"))
            if (r.jsonPath().getString(k) != null) return r.jsonPath().getString(k);
        throw new IllegalStateException("no org unit id in " + r.asString());
    }

    /** Deletes every org unit whose name starts with the lane prefix, children first (left by an aborted run). */
    @SuppressWarnings("unchecked")
    @Test(groups = {"crmaccess", "r2w1", "cleanup"}, description = "Remove leftover QA R2W1 org units")
    public void sweepQaOrgUnits() {
        for (int round = 0; round < 3; round++) {
            Object data = CrmUser.ok(owner().get("/iam/org-units"), "org units").jsonPath().get("data");
            List<Map<String, Object>> all = data instanceof List ? (List<Map<String, Object>>) data : List.of();
            for (Map<String, Object> u : all)
                if (String.valueOf(u.get("name")).startsWith(PFX)) {
                    String id = String.valueOf(u.get("id") != null ? u.get("id") : u.get("orgUnitId"));
                    fact("cleanup", "delete org unit " + u.get("name") + " -> " + owner().delete("/iam/org-units/" + id).statusCode());
                }
        }
        Object data = CrmUser.ok(owner().get("/iam/org-units"), "org units").jsonPath().get("data");
        long left = data instanceof List ? ((List<Map<String, Object>>) data).stream().filter(u -> String.valueOf(u.get("name")).startsWith(PFX)).count() : -1;
        fact("cleanup", "QA R2W1 org units left: " + left);
        Assert.assertEquals(left, 0L, "QA R2W1 org units are left");
    }

    @CaseId("R2-OU")
    @Test(groups = {"crmaccess", "r2w1", "api"}, description = "Org units: create a QA root and child, rename, move, delete with children refused, delete")
    public void orgUnitLifecycle() {
        String t = String.valueOf(System.currentTimeMillis() % 100000);
        Response root = CrmUser.ok(owner().post("/iam/org-units", m("parent_id", OU_HR, "name", PFX + "OU root " + t, "app_key", "crm")), "create root");
        fact("R2-OU create", root.asString().substring(0, Math.min(300, root.asString().length())));
        String rootId = ouId(root);
        undo.add(() -> fact("cleanup", "delete root OU -> " + owner().delete("/iam/org-units/" + rootId).statusCode()));
        Response child = CrmUser.ok(owner().post("/iam/org-units", m("parent_id", rootId, "name", PFX + "OU child " + t, "app_key", "crm")), "create child");
        String childId = ouId(child);
        undo.add(() -> fact("cleanup", "delete child OU -> " + owner().delete("/iam/org-units/" + childId).statusCode()));
        int ren = owner().patch("/iam/org-units/" + childId, m("name", PFX + "OU child renamed " + t)).statusCode();
        Response delRoot = owner().delete("/iam/org-units/" + rootId);
        Response cycle = owner().patch("/iam/org-units/" + rootId, m("new_parent_id", childId));
        int delChild = owner().delete("/iam/org-units/" + childId).statusCode();
        fact("R2-OU", "rename child " + ren + "; delete root with child -> " + err(delRoot) + "; move root under its child -> " + err(cycle) + "; delete child " + delChild);
        Assert.assertEquals(ren / 100, 2, "rename");
        Assert.assertEquals(delRoot.statusCode(), 409, "a unit with children was deleted");
        Assert.assertEquals(cycle.statusCode() / 100, 4, "a unit could be moved under its own child");
        Assert.assertEquals(delChild / 100, 2, "delete child");
    }

    @CaseId({"R2-FP", "R2-IM"})
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-1337", "NDC-1593", "NDC-1599"},
            description = "Test user 2 on a QA profile with Company hidden and Email read-only: create/edit/import refuse those fields, read hides Company")
    public void fieldPermissionsEnforced() {
        Map<String, Object> v0 = CrmHierarchyApi.user(V_ID);
        String pid = createProfile(PFX + "FP " + System.currentTimeMillis() % 100000, P_USER);
        undo.add(() -> deleteProfile(pid));
        String rowC = setFieldPermission(F_COMPANY, pid, "hidden");
        String rowE = setFieldPermission("47d783ad-f9be-4e36-8c5e-e148db8801e7", pid, "read_only");
        undo.add(() -> { deleteFieldPermission(rowC); deleteFieldPermission(rowE); });
        CrmHierarchyApi.setProfile(V_ID, pid, OU_HR);
        undo.add(() -> {
            CrmHierarchyApi.setProfile(V_ID, P_MANAGER_BUILTIN, OU_HR);   // test user 2 was on "Manager" @HR at the snapshot (27 Oct)
            fact("cleanup", "test user 2 back on " + CrmHierarchyApi.user(V_ID).get("profileNames") + " (was " + v0.get("profileNames") + ")");
        });
        CrmUser v = CrmUser.as(USER_V);
        Response withCompany = postLead(v, PFX + "FP company", Map.of(K_COMPANY, "QA R2W1 hidden"));
        if (withCompany.statusCode() / 100 == 2) deleteLead(withCompany.jsonPath().getString("data.id"));
        Response plain = CrmUser.ok(postLead(v, PFX + "FP plain", Map.of()), "plain lead as test user 2");
        String leadId = plain.jsonPath().getString("data.id");
        undo.add(() -> deleteLead(leadId));
        CrmUser.ok(patchLead(owner(), leadId, Map.of(K_COMPANY, "QA R2W1 set by admin")), "admin sets company");
        Response editEmail = patchLead(v, leadId, Map.of(K_EMAIL, "qa.r2w1@example.com"));
        Object companyAsV = readValue(v.get("/modules/" + LEADS + "/records/" + leadId), K_COMPANY);
        List<Map<String, Object>> rows = new ArrayList<>();
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("first_name", PFX + "FP import");
        row.put("phone", "01077" + System.currentTimeMillis() % 1000000);
        row.put("single_line_3_9", "QA R2W1");
        row.put("company", "QA R2W1 should not land");
        rows.add(row);
        CrmRecordsApi.Import imp = CrmRecordsApi.importLeads(v, rows, false);
        for (String id : CrmRecordsApi.leadIdsByPrefix(owner(), PFX + "FP import")) undo.add(() -> deleteLead(id));
        fact("R2-FP", "create with hidden Company -> " + err(withCompany) + "; edit read-only Email -> " + err(editEmail) + "; Company read as test user 2 = " + companyAsV);
        fact("R2-IM", "import with Company as test user 2: " + imp.log());
        Assert.assertEquals(withCompany.statusCode() / 100, 4, "a hidden field was accepted on create");
        Assert.assertEquals(editEmail.statusCode() / 100, 4, "a read-only field was accepted on edit");
        Assert.assertNull(companyAsV, "a hidden field value was returned to test user 2");
        Assert.assertTrue(imp.created() == 0 || imp.status == null, "the import created a record with a hidden field value: " + imp.log());
    }

    @CaseId("R2-HM")
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-2416"}, description = "Test user 2 can't change their own reporting manager without the personal reporting-hierarchy permission")
    public void ownManagerNeedsPermission() {
        CrmUser v = CrmUser.as(USER_V);
        boolean hasPerm = v.get("/iam/me/permissions").asString().contains("iam.personal.reporting_hierarchy");
        Object before = CrmHierarchyApi.user(V_ID).get("reportingManagerId");
        Response r = v.put("/iam/me/profile", m("reporting_manager_id", null));
        Object after = CrmHierarchyApi.user(V_ID).get("reportingManagerId");
        if (!String.valueOf(before).equals(String.valueOf(after)))
            undo.add(() -> CrmHierarchyApi.setManager(owner(), V_ID, before == null ? null : String.valueOf(before)));
        fact("R2-HM", "test user 2 has iam.personal.reporting_hierarchy=" + hasPerm + "; PUT /iam/me/profile reporting_manager_id=null -> " + err(r) + "; manager " + before + " -> " + after);
        if (hasPerm) throw new SkipException("INCONCLUSIVE: test user 2's profile has the permission, so the change is allowed");
        Assert.assertEquals(String.valueOf(after), String.valueOf(before), "test user 2 changed their own manager without the permission");
    }

    @CaseId("R2-DA")
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-2414"}, description = "The Desk Administrator profile does not give the Supervisor view-all on CRM records")
    public void deskAdminNoCrmViewAll() {
        CrmUser sup = CrmUser.as(CrmAccessFeature.SUPERVISOR);
        String perms = CrmUser.ok(sup.get("/iam/me/permissions"), "supervisor permissions").asString();
        boolean viewAll = perms.contains("metadata.records.view_all");
        String leadId = CrmUser.ok(postLead(owner(), PFX + "DA probe", Map.of()), "admin lead").jsonPath().getString("data.id");
        undo.add(() -> deleteLead(leadId));
        int read = sup.get("/modules/" + LEADS + "/records/" + leadId).statusCode();
        fact("R2-DA", "Supervisor (+ Desk Administrator) has metadata.records.view_all=" + viewAll + "; reads a lead owned by the acting admin -> " + read);
        String supProfile = CrmUser.ok(owner().get("/iam/profiles/11111111-1111-1111-1111-111111111104/permissions"), "Supervisor profile").asString();
        fact("R2-DA where", "Supervisor profile grants metadata.records.view_all=" + supProfile.contains("metadata.records.view_all"));
        Assert.assertTrue(read == 403 || read == 404, "the Supervisor (Desk Administrator) can read a CRM record outside its hierarchy: " + read);
    }

    @CaseId("R2-VIS")
    @Test(groups = {"crmaccess", "r2w1", "api"}, description = "Record visibility per module (U07): readable; an invalid value is refused and nothing changes")
    public void recordVisibilityValidation() {
        String before = String.valueOf(CrmUser.ok(owner().get("/modules/" + LEADS), "module").jsonPath().getMap("data").get("recordVisibility"));
        Response bad = owner().put("/modules/" + LEADS + "/record-visibility", m("mode", "everyone-please"));
        if (bad.statusCode() / 100 == 2) owner().put("/modules/" + LEADS + "/record-visibility", m("mode", before));   // tenant-wide: put it back at once
        String after = String.valueOf(CrmUser.ok(owner().get("/modules/" + LEADS), "module").jsonPath().getMap("data").get("recordVisibility"));
        fact("R2-VIS", "Leads visibility " + before.replaceAll("\\s+", " ").substring(0, Math.min(200, before.length())) + "; PUT invalid -> " + err(bad) + "; unchanged=" + before.equals(after));
        Assert.assertEquals(bad.statusCode() / 100, 4, "an invalid record-visibility value was accepted");
        Assert.assertEquals(after, before, "record visibility changed after an invalid request");
    }

    @CaseId("R2-BH")
    @Test(groups = {"crmaccess", "r2w1", "api", "NDC-2655"}, description = "Observe only: the stored business hours (no save)")
    public void businessHoursObserved() {
        Response r = owner().get("/settings/resolved?app_key=general&key=general.company.business_hours&scope_type=Org");
        fact("R2-BH", "business hours setting -> " + r.statusCode() + " " + r.asString().replaceAll("\\s+", " ").substring(0, Math.min(400, r.asString().length())));
    }

    @CaseId("R2-US01")
    @Test(groups = {"crmaccess", "r2w1", "api"}, description = "Users visible to the owner vs to CRM Admin B (does a CRM Admin see only its org-unit branch?)")
    public void usersVisibleOwnerVsAdmin() {
        List<Map<String, Object>> byOwner = CrmUser.ok(owner().get("/iam/users?limit=200"), "owner users").jsonPath().getList("data");
        List<Map<String, Object>> byAdmin = CrmUser.ok(CrmUser.as(qa.features.crmautomationorder.CrmOrderFeature.ADMIN_B).get("/iam/users?limit=200"), "admin B users").jsonPath().getList("data");
        List<String> onlyOwner = new ArrayList<>();
        for (Map<String, Object> u : byOwner) if (byAdmin.stream().noneMatch(a -> String.valueOf(a.get("userId")).equals(String.valueOf(u.get("userId"))))) onlyOwner.add(String.valueOf(u.get("displayName")));
        fact("R2-US01", "owner sees " + byOwner.size() + " users, CRM Admin B sees " + byAdmin.size() + "; only the owner sees " + onlyOwner);
    }
}
