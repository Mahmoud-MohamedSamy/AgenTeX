package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 group F — teamspace access (NDC-1172, NDC-1699, NDC-1701). The owner creates one QA teamspace with access
 * "Selected": owner = admin, test user 1 = access (member). Non-members and the member's rights are checked, and the
 * teamspace is deleted in @AfterClass. Control: the member CAN open it, so a refusal elsewhere means something.
 */
public class TeamspaceAccessTest {
    private String id;
    private String name;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        long t = System.currentTimeMillis() % 100000;
        name = QA + "Teamspace " + t;
        Response c = CrmUser.ok(owner().post("/teamspaces", m("name", name, "slug", "qa_w1_teamspace_" + t, "description", "QA W1 access test, deleted after the run")), "create teamspace");
        id = c.jsonPath().getString("data.id");
        Response acl = owner().put("/teamspaces/" + id + "/acl", m("rows", List.of(
                m("principal_kind", "user", "principal_id", OWNER_ID, "permission_key", null, "access_level", "admin"),
                m("principal_kind", "user", "principal_id", N_ID, "permission_key", null, "access_level", "access"))));
        Response mode = owner().patch("/teamspaces/" + id + "/access-mode", m("access_mode", "selected"));
        fact("F-setup", "teamspace " + id + " created; ACL -> " + acl.statusCode() + ", access mode selected -> " + mode.statusCode()
                + "; ACL now " + owner().get("/teamspaces/" + id + "/acl").asString().replaceAll("\\s+", " "));
        CrmUser.ok(acl, "put ACL");
        CrmUser.ok(mode, "set access mode");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (id == null) return;
        Response d = owner().delete("/teamspaces/" + id + "?cascade=true");
        boolean gone = !CrmUser.ok(owner().get("/teamspaces"), "GET teamspaces").asString().contains(id);
        fact("F-revert", "delete teamspace -> " + d.statusCode() + ", gone=" + gone);
        Assert.assertTrue(gone, "the QA teamspace was not deleted");
    }

    private static boolean canOpen(CrmUser u, String id) {
        int s = u.get("/teamspaces/" + id).statusCode();
        if (s != 200 && s != 403 && s != 404) throw new IllegalStateException("GET teamspace returned " + s);
        return s == 200;
    }

    private static boolean lists(CrmUser u, String id) {
        return CrmUser.ok(u.get("/teamspaces"), "GET teamspaces").asString().contains(id);
    }

    private void control() {
        CrmUser n = CrmUser.as(USER_N);
        if (!canOpen(n, id)) throw new SkipException("INCONCLUSIVE: the member (test user 1) cannot open the teamspace either");
    }

    @CaseId("F-1a")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1172"}, description = "A CRM Admin who is not on the access list cannot open the teamspace")
    public void crmAdminNotOnListIsRefused() {
        control();
        CrmUser a = CrmUser.as(ADMIN_A);
        boolean opens = canOpen(a, id), listed = lists(a, id);
        fact("F-1a", "CRM Admin (not on the list): opens=" + opens + ", listed=" + listed);
        Assert.assertFalse(opens || listed, "a CRM Admin who is not on the access list can see the teamspace");
    }

    @CaseId("F-1b")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1699"}, description = "A Supervisor/Manager-profile user who is not on the access list cannot open the teamspace")
    public void otherProfileNotOnListIsRefused() {
        control();
        CrmUser s = CrmUser.as(SUPERVISOR);
        boolean opens = canOpen(s, id), listed = lists(s, id);
        fact("F-1b", "Supervisor (not on the list): opens=" + opens + ", listed=" + listed);
        Assert.assertFalse(opens || listed, "a user who is not on the access list can see the teamspace");
    }

    @CaseId("F-1c")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1701"}, description = "A member without admin rights cannot change the teamspace")
    public void memberCannotAdminister() {
        control();
        CrmUser n = CrmUser.as(USER_N);
        Response r = n.put("/teamspaces/" + id, m("name", name + " renamed by member"));
        Response acl = n.put("/teamspaces/" + id + "/acl", m("rows", List.of(m("principal_kind", "user", "principal_id", N_ID, "permission_key", null, "access_level", "admin"))));
        String now = CrmUser.ok(owner().get("/teamspaces/" + id), "GET teamspace").asString();
        boolean renamed = now.contains("renamed by member");
        fact("F-1c", "member rename -> " + err(r) + " (name changed=" + renamed + "); member makes self admin -> " + err(acl));
        Assert.assertTrue(r.statusCode() == 403 || r.statusCode() == 404, "a plain member could rename the teamspace (" + r.statusCode() + ")");
        Assert.assertFalse(renamed, "the teamspace name was changed by a plain member");
        Assert.assertTrue(acl.statusCode() == 403 || acl.statusCode() == 404, "a plain member could change the access list (" + acl.statusCode() + ")");
    }
}
