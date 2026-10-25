package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 leftovers (plan v2): PR-04 parent / rank edit, FP-06 hidden field in list results, FP-08 the same field rules on
 * Transactions, LH-04 clear all sessions of one user. A QA profile (Company hidden on Leads, Next Step hidden and
 * Description read only on Transactions) holds test user 1 during the class; everything is removed in @AfterClass.
 */
public class LeftoversApiTest {
    private static final String DEALS = CrmOrderFeature.DEALS;
    private static final String D_NEXT_STEP = "32ace75a-13b4-43d3-a66b-f60477ab2597";
    private static final String D_DESCRIPTION = "315cbb1c-acea-4cdd-a673-309c45193ff4";
    private CrmHierarchyApi.Snapshot baseline;
    private String profileId;
    private final List<String> leadRows = new ArrayList<>(), dealRows = new ArrayList<>(), leads = new ArrayList<>(), deals = new ArrayList<>(), profiles = new ArrayList<>();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        baseline = CrmHierarchyApi.snapshot();
        profileId = createProfile(QA + "Leftovers " + System.currentTimeMillis() % 100000, P_USER);
        profiles.add(profileId);
        leadRows.add(setFieldPermission(F_COMPANY, profileId, "hidden"));
        dealRows.add(CrmUser.ok(owner().post("/modules/" + DEALS + "/field-permissions", m("fieldId", D_NEXT_STEP, "profileId", profileId, "permission", "hidden")), "deal FP").jsonPath().getString("data.id"));
        dealRows.add(CrmUser.ok(owner().post("/modules/" + DEALS + "/field-permissions", m("fieldId", D_DESCRIPTION, "profileId", profileId, "permission", "read_only")), "deal FP").jsonPath().getString("data.id"));
        CrmHierarchyApi.setProfile(N_ID, profileId, OU_SALES);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        leads.forEach(CrmAccessApi::deleteLead);
        for (String d : deals) fact("cleanup", "delete deal " + d + " -> " + owner().delete("/modules/" + DEALS + "/records/" + d).statusCode());
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        leadRows.forEach(CrmAccessApi::deleteFieldPermission);
        for (String r : dealRows) if (r != null) fact("cleanup", "delete deal FP " + r + " -> " + owner().delete("/modules/" + DEALS + "/field-permissions/" + r).statusCode());
        profiles.forEach(CrmAccessApi::deleteProfile);
        List<String> d = CrmHierarchyApi.diff(baseline, CrmHierarchyApi.snapshot());
        fact("LO-revert", d.isEmpty() ? "users and mode as before" : "DIFFERENCES: " + d);
        Assert.assertTrue(d.isEmpty(), "not restored: " + d);
    }

    @CaseId("PR-04")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Edit a profile's rank and parent; a rank at or above the parent's is refused")
    public void editRankAndParent() {
        String pid = createProfile(QA + "Rank edit " + System.currentTimeMillis() % 100000, P_USER);
        profiles.add(pid);
        Response r1 = owner().patch("/iam/profiles/" + pid, m("rank", 200));
        Response r2 = owner().patch("/iam/profiles/" + pid, m("apply_parent", true, "parent_profile_id", qa.features.crmhierarchy.CrmHierarchyFeature.P_SUPERVISOR, "rank", 100));
        Response bad = owner().patch("/iam/profiles/" + pid, m("rank", 600));   // parent Supervisor is rank 300
        List<Map<String, Object>> afterBad = CrmUser.ok(owner().get("/iam/profiles"), "GET").jsonPath().getList("data");
        String rankAfterBad = afterBad.stream().filter(x -> pid.equals(x.get("profileId"))).findFirst().map(x -> String.valueOf(x.get("rank"))).orElse("?");
        List<Map<String, Object>> all = CrmUser.ok(owner().get("/iam/profiles"), "GET profiles").jsonPath().getList("data");
        Map<String, Object> me = all.stream().filter(p -> pid.equals(p.get("profileId"))).findFirst().orElse(Map.of());
        fact("PR-04", "rank 200 -> " + err(r1) + "; parent Supervisor + rank 100 -> " + err(r2) + "; rank 600 under a rank-300 parent -> " + err(bad)
                + " (rank stored afterwards " + rankAfterBad + "); now rank " + me.get("rank") + ", parent " + me.get("parentProfileId"));
        Assert.assertTrue(r1.statusCode() / 100 == 2 && r2.statusCode() / 100 == 2, "valid rank / parent edits refused");
        Assert.assertEquals(String.valueOf(me.get("parentProfileId")), qa.features.crmhierarchy.CrmHierarchyFeature.P_SUPERVISOR, "parent not saved");
        Assert.assertFalse(bad.statusCode() / 100 == 2 && "600".equals(rankAfterBad), "a rank above the parent's rank was stored");
        Assert.assertTrue(bad.statusCode() / 100 != 2, "a rank above the parent's rank was answered " + bad.statusCode() + " (not stored, but no error either)");
    }

    @CaseId("FP-06")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1337"}, description = "The list of records does not carry a hidden field's value to the restricted user")
    public void listHidesHiddenField() {
        String secret = "QA W1 list secret " + System.currentTimeMillis();
        String id = CrmUser.ok(postLead(owner(), QA + "FP06 list", Map.of("owner", N_ID, K_COMPANY, secret)), "lead").jsonPath().getString("data.id");
        leads.add(id);
        Response list = CrmUser.as(USER_N).get("/modules/" + LEADS + "/records?limit=100");
        if (list.statusCode() != 200) throw new SkipException("INCONCLUSIVE: list as test user 1 -> " + list.statusCode());
        boolean ownLead = list.asString().contains(id), leaked = list.asString().contains(secret);
        fact("FP-06", "test user 1 list: own lead present=" + ownLead + ", hidden Company value present=" + leaked);
        if (!ownLead) throw new SkipException("INCONCLUSIVE: the lead is not in test user 1's first page");
        Assert.assertFalse(leaked, "the hidden field's value is in the list response");
    }

    /** Pipeline + stage of an existing deal on the Standard layout, so a new QA deal is valid whatever the pipelines are today. */
    private static void validPipeline(Map<String, Object> f) {
        List<Map<String, Object>> rows = CrmUser.ok(owner().get("/modules/" + DEALS + "/records?limit=20"), "GET deals").jsonPath().getList("data");
        for (Map<String, Object> r : rows) {
            Object pl = CrmAccessApi.readValue(owner().get("/modules/" + DEALS + "/records/" + r.get("id")), "pipeline");
            Object st = CrmAccessApi.readValue(owner().get("/modules/" + DEALS + "/records/" + r.get("id")), "stage");
            if (pl != null && st != null) {
                f.put("pipeline", pl);
                f.put("stage", st);
                return;
            }
        }
        throw new SkipException("INCONCLUSIVE: no existing deal with a pipeline and stage to copy");
    }

    @CaseId("FP-08")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1337"}, description = "Transactions: hidden field not writable or returned, read-only field not writable")
    public void transactionsFieldPermissions() {
        CrmUser n = CrmUser.as(USER_N);
        Map<String, Object> f = CrmApi.minimal(DEALS, QA + "FP08 deal");
        validPipeline(f);
        f.put("next_step", "QA W1 hidden next step");
        Response w = n.post("/modules/" + DEALS + "/records", m("layout_id", CrmOrderFeature.DEALS_STANDARD, "data", CrmApi.data(f)));
        Map<String, Object> f2 = CrmApi.minimal(DEALS, QA + "FP08 deal ro");
        validPipeline(f2);
        f2.put("description", "QA W1 read only");
        Response w2 = n.post("/modules/" + DEALS + "/records", m("layout_id", CrmOrderFeature.DEALS_STANDARD, "data", CrmApi.data(f2)));
        Map<String, Object> f3 = CrmApi.minimal(DEALS, QA + "FP08 deal owner");
        validPipeline(f3);
        f3.put("next_step", "QA W1 secret next step");
        f3.put("owner", N_ID);
        Response c = CrmUser.ok(owner().post("/modules/" + DEALS + "/records", m("layout_id", CrmOrderFeature.DEALS_STANDARD, "data", CrmApi.data(f3))), "deal as owner");
        String id = c.jsonPath().getString("data.id");
        deals.add(id);
        for (Response r : List.of(w, w2)) if (r.statusCode() / 100 == 2) deals.add(r.jsonPath().getString("data.id"));
        Response read = n.get("/modules/" + DEALS + "/records/" + id);
        boolean leaked = read.asString().contains("QA W1 secret next step");
        fact("FP-08", "Transactions as test user 1: write hidden Next Step -> " + err(w) + "; write read-only Description -> " + err(w2)
                + "; read owner's deal -> " + read.statusCode() + ", hidden value returned=" + leaked);
        Assert.assertTrue(w.statusCode() / 100 != 2, "the hidden field could be written on Transactions");
        Assert.assertTrue(w2.statusCode() / 100 != 2, "the read-only field could be written on Transactions");
        if (read.statusCode() == 200) Assert.assertFalse(leaked, "the hidden Transactions field is returned");
    }

    @CaseId("LH-04")
    @Test(groups = {"crmaccess", "wave1", "api"}, priority = 10, description = "Clear all sessions of one user: every token of that user stops, other users keep working")
    public void clearAllSessionsOfOneUser() {
        Session s = Session.signIn(USER_N);
        if (s.status != 200) throw new SkipException("INCONCLUSIVE: test user 1 cannot sign in (" + s.status + ")");
        Session control = Session.signIn(USER_V);
        int before = s.get("/iam/me").statusCode();
        Response clear = owner().post("/audit/login-history/clear-all", m("user_ids", List.of(N_ID)));
        int after = s.get("/iam/me").statusCode(), other = control.get("/iam/me").statusCode();
        long stillActive = activeSessions(5).stream().filter(x -> N_ID.equals(x.get("user_id")) && x.get("expires_at") != null
                && java.time.OffsetDateTime.parse(String.valueOf(x.get("expires_at"))).isAfter(java.time.OffsetDateTime.now())).count();
        fact("LH-04", "clear all for test user 1 -> " + err(clear) + "; its token before " + before + ", after " + after
                + "; test user 2 (control) " + other + "; test user 1 sessions still Active and unexpired: " + stillActive);
        CrmUser.ok(clear, "clear all");
        Assert.assertEquals(other, 200, "another user's session was ended too");
        Assert.assertEquals(after, 401, "test user 1's token still works after Clear All Sessions");
        Assert.assertEquals(stillActive, 0, "test user 1 still has Active sessions after Clear All");
    }
}
