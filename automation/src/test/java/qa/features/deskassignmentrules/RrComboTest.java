package qa.features.deskassignmentrules;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Group G — Round-robin method x preference combinations (added 22 Nov 2026). The other classes test the preferences
 * with Sequential pools; here Load based and Skill based rules meet offline agents, agent / department thresholds and
 * backlog runs. All in Dept A (A3 is a member there, not in Dept B); A1 + A2 are online, A3 can never sign in, so it is always offline.
 * Dept A skill preferences are saved before and restored after the class.
 */
public class RrComboTest extends ArTestBase {
    private final String u = " " + ArApi.uid();
    private final String mx = PREFIX + "SXa" + u, my = PREFIX + "SXb" + u;
    private String skX, skY, nX;
    private Map<String, Object> skillPrefsA;
    private List<String[]> shared = List.of();

    @BeforeClass(alwaysRun = true, dependsOnMethods = "fixtureUp")
    public void skills() {
        ArApi.cleanupCreated();
        skillPrefsA = o.skillPrefs(DA);
        String type = o.skillType(DA, PREFIX + "GType" + u);
        nX = PREFIX + "skX" + u;
        skX = o.skill(DA, nX, type, true, contains(mx)); // held by A1 + A3 (A3 always offline)
        skY = o.skill(DA, PREFIX + "skY" + u, type, true, contains(my)); // held by A1 + A2
        o.skillAgents(skX, A1, A3);
        o.skillAgents(skY, A1, A2);
        o.setSkillPrefs(DA, m("auto_add", true, "placement", "settings_order"));
        shared = ArApi.detach();
    }

    @AfterClass(alwaysRun = true)
    public void restoreSkills() {
        try {
            if (skillPrefsA != null) o.setSkillPrefs(DA, skillPrefsA);
        } finally {
            ArApi.cleanup(shared);
        }
    }

    private void bothOnline() {
        Map<String, String> p = o.presence(A1, A2);
        if (!p.get(A1).startsWith("on") || !p.get(A2).startsWith("on")) inconclusive("A1/A2 not online: " + p);
    }

    private Map<String, Integer> loads(String... users) {
        Map<String, Integer> w = new LinkedHashMap<>();
        for (String x : users) w.put(x, o.workload(x, DA));
        return w;
    }

    private String skillRule(String mk) {
        return o.rule(rrBody(mk, DA, l("create"), l(rrTarget(contains(mk), "skill", agentsPool(A1, A2, A3)))));
    }

    // ---------- Load based ----------

    @Test(groups = {"regression", "api", "combo"}, description = "Load based + offline agents OFF: the offline agent is skipped even when least loaded")
    @CaseId("G-01")
    public void loadOfflineOff() {
        bothOnline();
        o.setPrefs(DA, m("assign_to_offline_agents", false));
        Map<String, Integer> w = loads(A1, A2, A3);
        String mk = mk("G01");
        o.rr(mk, DA, startsWith(mk), "load", A1, A2, A3);
        String got = o.waitOwner(o.ticket(mk + " 1", DA), 25);
        assertNotNull(got, "not assigned (loads " + w + ")");
        assertNotEquals(got, A3, "offline A3 got the ticket with offline agents OFF");
        assertEquals((int) w.get(got), Math.min(w.get(A1), w.get(A2)), "not the least loaded online agent: loads " + w + " -> " + n(got));
    }

    @Test(groups = {"regression", "api", "combo"}, description = "Load based + offline agents ON: the least loaded agent gets it even when offline")
    @CaseId("G-02")
    public void loadOfflineOn() {
        o.setPrefs(DA, m("assign_to_offline_agents", true));
        fill(DA, A1, o.workload(A3, DA) + 1, "G02");
        fill(DA, A2, o.workload(A3, DA) + 1, "G02");
        Map<String, Integer> w = loads(A1, A2, A3);
        if (w.get(A3) >= Math.min(w.get(A1), w.get(A2))) inconclusive("A3 is not the least loaded: " + w);
        String mk = mk("G02");
        o.rr(mk, DA, startsWith(mk), "load", A1, A2, A3);
        String got = o.waitOwner(o.ticket(mk + " 1", DA), 25);
        assertEquals(got, A3, "least loaded offline A3 should get it with offline agents ON: loads " + w + " -> " + n(got));
    }

    @Test(groups = {"regression", "api", "combo"}, description = "Load based + agent threshold: the least loaded agent at its threshold is skipped")
    @CaseId("G-03")
    public void loadAgentThreshold() {
        bothOnline();
        fill(DA, A1, 1, "G03");
        fill(DA, A2, 1, "G03");
        Map<String, Integer> w = loads(A1, A2);
        String least = w.get(A1) <= w.get(A2) ? A1 : A2, other = least.equals(A1) ? A2 : A1;
        o.setPrefs(DA, m("assign_to_offline_agents", false, "agent_threshold_enabled", true,
                "agent_thresholds", l(threshold(least, w.get(least)), threshold(other, w.get(other) + 1))));
        String mk = mk("G03");
        o.rr(mk, DA, startsWith(mk), "load", A1, A2);
        String got = o.waitOwner(o.ticket(mk + " 1", DA), 25);
        assertEquals(got, other, "least loaded " + n(least) + " is full; " + n(other) + " should get it: loads " + w + " -> " + n(got));
    }

    @Test(groups = {"regression", "api", "combo", "slow"}, description = "Load based + department threshold: all full -> backlog; a raised threshold lets the backlog run assign the least loaded")
    @CaseId({"G-04a", "G-04b"})
    public void loadDeptThresholdBacklog() {
        bothOnline();
        fill(DA, A1, 1, "G04");
        fill(DA, A2, 1, "G04");
        Map<String, Integer> w = loads(A1, A2);
        int t = Math.max(w.get(A1), w.get(A2));
        fill(DA, A1, t, "G04");
        fill(DA, A2, t, "G04");
        o.setPrefs(DA, m("assign_to_offline_agents", false, "department_threshold_enabled", true, "department_threshold", t));
        String mk = mk("G04");
        o.rr(mk, DA, startsWith(mk), "load", A1, A2);
        String x = o.ticket(mk + " X", DA);
        wait(10);
        assertNull(o.owner(x), "G-04a assigned beyond the department threshold");
        assertTrue(o.inBacklog(x), "G-04a not a backlog ticket");
        o.changePrefs(DA, m("department_threshold", t + 1, "assign_backlogs", true, "backlog_limit", 1));
        String got = watch(x, 150);
        assertNotNull(got, "G-04b backlog ticket not assigned after the threshold was raised");
    }

    // ---------- Sequential ----------

    @Test(groups = {"regression", "api", "combo"}, description = "Sequential + department and agent thresholds together: a full agent loses its turn, the next agent gets it, then backlog")
    @CaseId("G-05")
    public void sequentialDeptThreshold() {
        bothOnline();
        fill(DA, A1, 1, "G05");
        fill(DA, A2, 1, "G05");
        Map<String, Integer> w = loads(A1, A2);
        // department threshold high (not the cap); agent thresholds give A1 0 and A2 1 free slots
        o.setPrefs(DA, m("department_threshold_enabled", true, "department_threshold", Math.max(w.get(A1), w.get(A2)) + 5,
                "agent_threshold_enabled", true, "agent_thresholds", thresholds(DA, 0, 1)));
        String mk = mk("G05");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2);
        String a = o.waitOwner(o.ticket(mk + " 1", DA), 25);
        String b = o.waitOwner(o.ticket(mk + " 2", DA), 25);
        assertEquals(a, A2, "A1 is full, first ticket should go to A2 (loads " + w + ")");
        assertNull(b, "second ticket assigned although both agents are full -> " + n(b));
    }

    // ---------- Skill based ----------

    @Test(groups = {"regression", "api", "combo"}, description = "Skill based + offline agents OFF: offline skill holder A3 is skipped, online holder A1 gets it")
    @CaseId("G-06")
    public void skillOfflineOff() {
        bothOnline();
        o.setPrefs(DA, m("assign_to_offline_agents", false));
        String mk = mk("G06");
        skillRule(mk);
        String owners = "";
        for (int i = 1; i <= 3; i++) {
            String t = o.ticket(mk + " " + mx + " " + i, DA);
            String w = o.waitOwner(t, 25);
            owners += n(w) + " ";
            if (i == 1) assertTrue(o.ticketSkills(t).contains(nX), "precondition: skill X added, skills " + o.ticketSkills(t));
            assertEquals(w, A1, "skill X holders are A1 (online) and A3 (offline): ticket " + i + " -> " + n(w));
        }
    }

    @Test(groups = {"regression", "api", "combo"}, description = "Skill based + offline agents ON: offline skill holder A3 also gets its turn")
    @CaseId("G-07")
    public void skillOfflineOn() {
        o.setPrefs(DA, m("assign_to_offline_agents", true));
        String mk = mk("G07");
        skillRule(mk);
        List<String> got = new java.util.ArrayList<>();
        for (int i = 1; i <= 4; i++) got.add(n(o.waitOwner(o.ticket(mk + " " + mx + " " + i, DA), 25)));
        assertTrue(got.stream().allMatch(x -> x.equals("A1") || x.equals("A3")), "only skill X holders A1/A3 may get it: " + got);
        assertTrue(got.contains("A3"), "offline A3 never got a turn with offline agents ON: " + got);
    }

    @Test(groups = {"regression", "api", "combo"}, description = "Skill based + agent threshold: the full skill holder is skipped, the other holder gets it; a non-holder never")
    @CaseId("G-08")
    public void skillAgentThreshold() {
        bothOnline();
        fill(DA, A1, 1, "G08");
        o.setPrefs(DA, m("assign_to_offline_agents", false, "agent_threshold_enabled", true, "agent_thresholds", thresholds(DA, 0, 1)));
        String mk = mk("G08");
        skillRule(mk);
        String y = o.ticket(mk + " " + my, DA);
        String w = o.waitOwner(y, 25);
        assertEquals(w, A2, "skill Y holders A1 (full) and A2 (1 free): -> " + n(w));
        String x = o.ticket(mk + " " + mx, DA);
        wait(15);
        assertNull(o.owner(x), "skill X ticket assigned although A1 is full and A3 offline -> " + n(o.owner(x)));
    }

    @Test(groups = {"regression", "api", "combo", "slow"}, description = "Skill based + all holders full + backlog: the ticket waits; a free slot gives it to a holder, not to a non-holder")
    @CaseId({"G-09a", "G-09b"})
    public void skillBacklog() {
        bothOnline();
        fill(DA, A1, 1, "G09");
        o.setPrefs(DA, m("assign_to_offline_agents", false, "agent_threshold_enabled", true, "agent_thresholds", thresholds(DA, 0, 1)));
        String mk = mk("G09");
        skillRule(mk);
        String x = o.ticket(mk + " " + mx, DA);
        wait(15);
        assertNull(o.owner(x), "G-09a assigned although its only online holder A1 is full -> " + n(o.owner(x)));
        assertTrue(o.inBacklog(x), "G-09a skill ticket with a full holder is not a backlog ticket");
        o.changePrefs(DA, m("agent_thresholds", thresholds(DA, 1, 1), "assign_backlogs", true, "backlog_limit", 1));
        String got = watch(x, 150);
        assertNotNull(got, "G-09b backlog skill ticket not assigned after A1 got a free slot");
        assertTrue(got.startsWith("A1"), "G-09b went to a non-holder (A2 has a free slot but not skill X) -> " + got);
    }
}
