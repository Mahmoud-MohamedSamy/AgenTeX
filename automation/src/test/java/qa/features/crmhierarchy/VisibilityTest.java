package qa.features.crmhierarchy;

import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;

import static qa.features.crmhierarchy.CrmHierarchyApi.*;
import static qa.features.crmhierarchy.CrmHierarchyFeature.*;

/**
 * Groups I and J (+ C11): what users really see in Leads (record visibility = Hierarchy) under each mode. API only, no
 * browser. Serial: changes the tenant-wide mode, valafo4080's profile (test → User / Supervisor / Manager, all without
 * records.view_all) and nameb56175's manager; everything is restored and diffed in @AfterClass.
 * Every check has a control (the viewer opens its own lead); a missing control = INCONCLUSIVE, never a pass.
 */
public class VisibilityTest {
    private Snapshot baseline;
    private CrmUser v, n;
    private String leadV, leadN, leadNself;
    private final List<String> created = new ArrayList<>();

    @BeforeClass(alwaysRun = true)
    public void seed() {
        baseline = snapshot();
        fact("baseline", "mode " + baseline.mode() + ", users " + baseline.users().size());
        v = CrmUser.as(USER_V);
        n = CrmUser.as(USER_N);
        String t = Long.toString(System.currentTimeMillis() % 100000);
        leadV = createLead(owner(), QA + "V-own " + t, V_ID);
        leadN = createLead(owner(), QA + "N-own " + t, N_ID);
        leadNself = createLead(n, QA + "N-self " + t, null);
        created.addAll(List.of(leadV, leadN, leadNself));
    }

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        try {
            for (String id : created) deleteLead(id);
        } finally {
            if (baseline == null) return;
            restore(baseline);
            List<String> d = diff(baseline, snapshot());
            fact("revert", d.isEmpty() ? "restored: no difference from the baseline" : "DIFFERENCES: " + d);
            Assert.assertTrue(d.isEmpty(), "not restored: " + d);
        }
    }

    /** Puts the tenant in one state: mode, V's profile @org unit, N's manager (null = baseline manager). */
    private void state(String mode, String vProfile, String vUnit, boolean nReportsToV) {
        setMode(mode);
        setProfile(V_ID, vProfile, vUnit);
        String nMgr = nReportsToV ? V_ID : (String) nullable(baseline.users().get(N_ID).get(0));
        CrmUser.ok(setManager(owner(), N_ID, nMgr), "set N manager");
        if (hasPermission(v, "metadata.records.view_all"))
            throw new SkipException("INCONCLUSIVE: valafo4080 still has records.view_all with this profile");
    }

    private static Object nullable(Object o) {
        return o == null || "null".equals(o) ? null : o;
    }

    /** Control: the viewer must see its own lead, else the session/data is wrong. */
    private void control(CrmUser who, String ownLead) {
        if (!sees(who, ownLead)) throw new SkipException("INCONCLUSIVE: " + who.email + " cannot open its own lead");
    }

    @CaseId({"I1", "I5"})
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 1,
            description = "Role mode: a User sees its own leads and not a superior's")
    public void roleOwnAndNotUp() {
        state("role", P_SUPERVISOR, OU_SALES, false);
        control(n, leadN);
        Assert.assertTrue(sees(n, leadNself), "N cannot open the lead it created itself");
        boolean up = sees(n, leadV);
        fact("I1/I5", "role: N sees own=true, self-created=true, superior V's lead=" + up);
        Assert.assertFalse(up, "a User (rank 100) sees a Supervisor's (rank 300) lead");
    }

    @CaseId("I2")
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 2,
            description = "Role mode: peers of the same rank do not see each other's leads")
    public void rolePeers() {
        state("role", P_USER, OU_HR, false);
        control(v, leadV);
        boolean vn = sees(v, leadN), nv = sees(n, leadV);
        fact("I2", "role, V=User@HR and N=User@Sales: V sees N=" + vn + ", N sees V=" + nv);
        Assert.assertFalse(vn || nv, "peers see each other's leads");
    }

    @CaseId("I3")
    @Test(groups = {"crmhierarchy", "visibility", "regression", "HP-BUG-01"}, priority = 3,
            description = "Role mode: a Supervisor sees the leads of a lower-ranked User in the same department")
    public void roleSuperiorSameDepartment() {
        state("role", P_SUPERVISOR, OU_SALES, false);
        control(v, leadV);
        boolean a = sees(v, leadN), b = sees(v, leadNself);
        fact("I3", "role, V=Supervisor(300)@Sales, N=User(100)@Sales: V sees N's leads: owner-set=" + a + ", N-created=" + b);
        Assert.assertTrue(a && b, "a Supervisor does not see a lower-ranked User's leads in the same department "
                + "(hint: 'Users see their own records and those of lower-ranked users in their department')");
    }

    @CaseId("I3b")
    @Test(groups = {"crmhierarchy", "visibility", "regression", "HP-BUG-01"}, priority = 4,
            description = "Role mode: a Manager (parent profile of User) sees the User's leads in the same department")
    public void roleManagerProfileSameDepartment() {
        state("role", P_MANAGER, OU_SALES, false);
        control(v, leadV);
        boolean a = sees(v, leadN), b = sees(v, leadNself);
        fact("I3b", "role, V=Manager(500)@Sales: V sees N's leads: owner-set=" + a + ", N-created=" + b);
        Assert.assertTrue(a && b, "a Manager does not see a User's leads in the same department");
    }

    @CaseId("I4")
    @Test(groups = {"crmhierarchy", "visibility", "regression", "HP-BUG-01"}, priority = 5,
            description = "Role mode: a Supervisor in another department sees the User's leads (preview: 'every User in the tenant')")
    public void roleSuperiorOtherDepartment() {
        state("role", P_SUPERVISOR, OU_HR, false);
        control(v, leadV);
        boolean a = sees(v, leadN);
        fact("I4", "role, V=Supervisor@HR, N=User@Sales: V sees N's lead=" + a + " (preview text says yes, record-visibility hint says no, Zoho: yes for the branch)");
        Assert.assertTrue(a, "the preview promises 'A Manager sees every User in the tenant, regardless of who they report to'");
    }

    @CaseId("I6")
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 6,
            description = "Role mode: the reporting chain gives no visibility")
    public void roleIgnoresChain() {
        state("role", P_USER, OU_HR, true);
        control(v, leadV);
        boolean a = sees(v, leadN);
        fact("I6", "role, N reports to V (both User): V sees N=" + a);
        Assert.assertFalse(a, "in Role mode the reporting chain gave visibility");
    }

    @CaseId({"J1", "J3"})
    @Test(groups = {"crmhierarchy", "visibility", "regression", "HP-BUG-02"}, priority = 7,
            description = "Reporting mode: a manager sees the leads of a direct report")
    public void reportingManagerSeesReport() {
        state("reporting", P_USER, OU_HR, true);
        control(v, leadV);
        List<Object> subs = CrmUser.ok(v.get("/iam/me/subordinates"), "subordinates").jsonPath().getList("data.user_id");
        boolean listed = subs != null && subs.contains(N_ID);
        if (!listed) throw new SkipException("INCONCLUSIVE: N is not in V's direct reports");
        boolean a = sees(v, leadN), b = sees(v, leadNself);
        fact("J1/J3", "reporting, N reports to V (listed in /iam/me/subordinates=" + listed + "), both rank 100: V sees N's leads: owner-set=" + a + ", N-created=" + b);
        Assert.assertTrue(a && b, "a reporting manager does not see the direct report's leads ('Sara sees Omar (her report)')");
    }

    @CaseId("J1s")
    @Test(groups = {"crmhierarchy", "visibility", "regression", "HP-BUG-02"}, priority = 8,
            description = "Reporting mode: a Supervisor manager in the same department sees the report's leads")
    public void reportingSupervisorManager() {
        state("reporting", P_SUPERVISOR, OU_SALES, true);
        control(v, leadV);
        boolean a = sees(v, leadN), b = sees(v, leadNself);
        fact("J1s", "reporting, N reports to V, V=Supervisor@Sales (same department, higher rank): V sees N's leads: owner-set=" + a + ", N-created=" + b);
        Assert.assertTrue(a && b, "a manager with a higher rank in the same department does not see the report's leads");
    }

    @CaseId("J2")
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 9,
            description = "Reporting mode: a report does not see the manager's leads")
    public void reportingReportNotUp() {
        state("reporting", P_USER, OU_HR, true);
        control(n, leadN);
        boolean a = sees(n, leadV);
        fact("J2", "reporting, N reports to V: N sees V's lead=" + a);
        Assert.assertFalse(a, "a report sees the manager's lead");
    }

    @CaseId("J5")
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 10,
            description = "Reporting mode: a higher rank outside the chain does not see the leads")
    public void reportingNotInChain() {
        state("reporting", P_SUPERVISOR, OU_SALES, false);
        control(v, leadV);
        boolean a = sees(v, leadN);
        fact("J5", "reporting, N reports to someone else, V=Supervisor@Sales: V sees N=" + a);
        Assert.assertFalse(a, "rank gave visibility in Reporting mode");
    }

    @CaseId({"J8", "C11"})
    @Test(groups = {"crmhierarchy", "visibility", "regression"}, priority = 11,
            description = "Switching back to Role keeps the managers; the chain stops giving visibility")
    public void switchBackKeepsManagers() {
        state("reporting", P_USER, OU_HR, true);
        setMode("role");
        Object mgr = user(N_ID).get("reportingManagerId");
        control(v, leadV);
        boolean a = sees(v, leadN);
        fact("J8/C11", "after reporting -> role: N's manager still V=" + V_ID.equals(mgr) + "; V sees N=" + a);
        Assert.assertEquals(mgr, V_ID, "switching the mode cleared the reporting manager");
        Assert.assertFalse(a, "after switching back to Role the chain still gives visibility");
    }

    @CaseId("J4")
    @Test(groups = {"crmhierarchy", "visibility"}, priority = 12, description = "Reporting mode: indirect reports (two levels)")
    public void reportingIndirect() {
        throw new SkipException("INCONCLUSIVE: needs a third signed-in user without records.view_all (the Supervisor account has it through Desk Administrator)");
    }
}
