package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 group E — users and profiles. E-1 suspends test user 2 and always reactivates it; E-2 creates, changes and
 * deletes a QA profile; E-3 sets and clears one user override and reads its history.
 */
public class UsersProfilesTest {
    private String profileId;
    private boolean overrideSet;

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (!"active".equalsIgnoreCase(statusOf(V_ID))) fact("E-revert", "reactivate test user 2 -> " + setStatus(V_ID, "Active").statusCode());
        if (overrideSet) clearOverride(V_ID, LH_VIEW_TEAM);
        deleteProfile(profileId);
        String st = statusOf(V_ID);
        fact("E-revert", "test user 2 status " + st + "; QA profile left=" + (profileId != null && profileExists(profileId)));
        Assert.assertTrue("active".equalsIgnoreCase(st), "test user 2 not reactivated: " + st);
    }

    @CaseId("E-1")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A suspended user cannot sign in; after reactivation they can")
    public void suspendAndReactivate() {
        Session control = Session.signIn(USER_V);
        if (control.status != 200) throw new SkipException("INCONCLUSIVE: test user 2 cannot sign in before the test (" + control.status + ")");
        Response s = setStatus(V_ID, "Suspended");
        CrmUser.ok(s, "suspend test user 2");
        String listed = statusOf(V_ID);
        Session blocked = Session.signIn(USER_V);
        int oldToken = control.get("/iam/me").statusCode();
        CrmUser.ok(setStatus(V_ID, "Active"), "reactivate test user 2");
        Session back = Session.signIn(USER_V);
        fact("E-1", "suspend -> " + s.statusCode() + ", listed as " + listed + "; sign-in while suspended -> " + blocked.status
                + "; earlier token while suspended -> " + oldToken + "; reactivate, sign-in -> " + back.status);
        Assert.assertTrue(listed.equalsIgnoreCase("suspended"), "the user list does not show the user as suspended: " + listed);
        Assert.assertNotEquals(blocked.status, 200, "a suspended user could sign in");
        Assert.assertEquals(oldToken, 401, "the suspended user's existing session kept working");
        Assert.assertEquals(back.status, 200, "the reactivated user cannot sign in");
    }

    @CaseId("E-2")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Profile lifecycle: clone, add a permission, rename, delete")
    public void profileLifecycle() {
        profileId = createProfile(QA + "Profile " + System.currentTimeMillis() % 100000, P_USER);
        List<Map<String, Object>> src = CrmUser.ok(owner().get("/iam/profiles/" + P_USER + "/permissions"), "GET User permissions").jsonPath().getList("data");
        String cloned = CrmUser.ok(owner().get("/iam/profiles/" + profileId + "/permissions"), "GET QA permissions").asString();
        long copied = src == null ? 0 : src.stream().filter(p -> cloned.contains(String.valueOf(p.get("permission_key") != null ? p.get("permission_key") : p.get("permissionKey")))).count();
        Response add = owner().post("/iam/profiles/" + profileId + "/permissions", m("permission_key", LH_VIEW_TEAM, "effect", "allow"));
        boolean listed = CrmUser.ok(owner().get("/iam/profiles/" + profileId + "/permissions"), "GET QA permissions").asString().contains(LH_VIEW_TEAM);
        String newName = QA + "Profile renamed " + System.currentTimeMillis() % 100000;
        Response ren = owner().patch("/iam/profiles/" + profileId, m("name", newName));
        boolean renamed = CrmUser.ok(owner().get("/iam/profiles"), "GET profiles").asString().contains(newName);
        Response del = owner().delete("/iam/profiles/" + profileId);
        boolean gone = !profileExists(profileId);
        if (gone) profileId = null;
        fact("E-2", "clone copied " + copied + "/" + (src == null ? 0 : src.size()) + " permissions of User; add permission -> " + add.statusCode() + " listed=" + listed
                + "; rename -> " + ren.statusCode() + " shown=" + renamed + "; delete -> " + del.statusCode() + " gone=" + gone);
        Assert.assertTrue(src == null || copied == src.size(), "the clone did not copy every permission of User");
        Assert.assertTrue(listed, "the added permission is not listed on the profile");
        Assert.assertTrue(renamed, "the rename is not shown");
        Assert.assertTrue(gone, "the deleted profile is still listed");
    }

    @CaseId("E-3")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "A per-user override is applied, listed in its history with who changed it, and can be removed")
    public void overrideAndHistory() {
        Response set = setOverride(V_ID, LH_VIEW_TEAM, "deny");
        CrmUser.ok(set, "set override");
        overrideSet = true;
        boolean listed = overrides(V_ID).contains(LH_VIEW_TEAM);
        clearOverride(V_ID, LH_VIEW_TEAM);
        overrideSet = false;
        boolean removed = !overrides(V_ID).contains(LH_VIEW_TEAM);
        String hist = CrmUser.ok(owner().get("/iam/users/" + V_ID + "/overrides/history?take=20"), "override history").asString();
        boolean inHistory = hist.contains(LH_VIEW_TEAM), who = hist.contains(OWNER_ID) || hist.contains("ndc-staging-owner");
        fact("E-3", "override set -> " + set.statusCode() + " listed=" + listed + "; removed=" + removed + "; in history=" + inHistory + ", history names the owner=" + who);
        Assert.assertTrue(listed && removed, "override not listed or not removed");
        Assert.assertTrue(inHistory, "the override change is not in its history");
        Assert.assertTrue(who, "the override history does not say who made the change");
    }
}
