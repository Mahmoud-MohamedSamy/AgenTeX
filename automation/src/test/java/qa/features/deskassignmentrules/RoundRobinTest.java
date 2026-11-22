package qa.features.deskassignmentrules;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/** Group E — round-robin rules: validation, sequential / team / load order, offline skip, history, switches, update path. */
public class RoundRobinTest extends ArTestBase {

    private Response tryRr(String dept, Map<String, Object> target) {
        Map<String, Object> b = rrBody(mk("Ev"), dept, l("create"), l(target));
        b.put("is_active", false);
        return o.createRule(b);
    }

    /** Creates n tickets one after the other and returns the owners (short names). */
    private List<String> owners(String prefix, int count, String dept) {
        List<String> out = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            String t = o.ticket(prefix + " " + i, dept);
            out.add(n(o.waitOwner(t, 20)));
            wait(2);
        }
        return out;
    }

    @Test(groups = {"regression", "api"}, description = "A target without a method, or with an unknown method, is refused")
    @CaseId("E-02")
    public void methodRequired() {
        Response none = tryRr(DA, m("criteria", startsWith(mk("E02")), "pool", agentsPool(A1)));
        Response bad = tryRr(DA, rrTarget(startsWith(mk("E02")), "random", agentsPool(A1)));
        assertEquals(none.statusCode() / 100, 4, "no method: " + err(none));
        assertEquals(bad.statusCode() / 100, 4, "unknown method: " + err(bad));
    }

    @Test(groups = {"regression", "api"}, description = "Empty pool, an agent outside the department, or no department are refused")
    @CaseId("E-04")
    public void poolRequired() {
        Response empty = tryRr(DA, rrTarget(startsWith(mk("E04")), "sequential", agentsPool()));
        Response outsider = tryRr(DA, rrTarget(startsWith(mk("E04")), "sequential", agentsPool(OUTSIDER)));
        Response noDept = tryRr(null, rrTarget(startsWith(mk("E04")), "sequential", agentsPool(A1)));
        SoftAssert s = new SoftAssert();
        s.assertEquals(empty.statusCode() / 100, 4, "empty pool: " + err(empty));
        s.assertEquals(outsider.statusCode() / 100, 4, "agent not in department: " + err(outsider));
        s.assertEquals(noDept.statusCode() / 100, 4, "no department: " + err(noDept));
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "Team pool with one member excluded: the excluded agent never gets tickets")
    @CaseId("E-05")
    public void teamPoolExcluded() {
        String mk = mk("E05");
        o.rule(rrBody(mk, DA, l("create"), l(rrTarget(startsWith(mk), "sequential", teamPool(TEAM_A, A3)))));
        assertEquals(owners(mk, 3, DA), l("A2", "A2", "A2"));
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Round robin assigns an unowned matching ticket on create")
    @CaseId("E-08")
    public void assignsOnCreate() {
        String mk = mk("E08");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2);
        String t = o.ticket(mk + " x", DA);
        assertNotNull(o.waitOwner(t, 20), "not assigned");
    }

    @Test(groups = {"regression", "api"}, description = "Sequential pool A1, A2, A3: 6 tickets go A1, A2, A3, A1, A2, A3")
    @CaseId("E-09")
    public void sequentialOrder() {
        String mk = mk("E09");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2, A3);
        List<String> s = owners(mk, 6, DA);
        assertEquals(new java.util.HashSet<>(s.subList(0, 3)).size(), 3, "first three not one each: " + s);
        assertEquals(s.subList(3, 6), s.subList(0, 3), "second cycle differs: " + s);
    }

    @Test(groups = {"regression", "api"}, description = "Team pool (A2, A3): members take turns")
    @CaseId("E-10")
    public void teamPoolSequential() {
        String mk = mk("E10");
        o.rule(rrBody(mk, DA, l("create"), l(rrTarget(startsWith(mk), "sequential", teamPool(TEAM_A)))));
        List<String> s = owners(mk, 4, DA);
        assertTrue(s.stream().allMatch(x -> x.equals("A2") || x.equals("A3")), "non-member got a ticket: " + s);
        assertNotEquals(s.get(0), s.get(1), "members did not alternate: " + s);
        assertEquals(s.get(2), s.get(0), "no turn-taking: " + s);
    }

    @Test(groups = {"regression", "api"}, description = "Removing an agent from the pool mid-sequence restarts at the first agent")
    @CaseId("E-11")
    public void poolChangeRestarts() {
        String mk = mk("E11");
        String id = o.rr(mk, DA, startsWith(mk), "sequential", A1, A2, A3);
        List<String> first = owners(mk + " a", 2, DA);
        Map<String, Object> g = o.ruleOk(id);
        List<Map<String, Object>> t = new ArrayList<>();
        for (Object x : (List<?>) g.get("targets")) {
            @SuppressWarnings("unchecked") Map<String, Object> tt = new LinkedHashMap<>((Map<String, Object>) x);
            tt.put("pool", agentsPool(A1, A3));
            t.add(tt);
        }
        ok(o.putRule(id, m("targets", t)), "change pool");
        List<String> after = owners(mk + " b", 1, DA);
        assertEquals(after.get(0), "A1", "after removing A2 (first two went " + first + ") the next ticket should restart at A1");
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Offline agents off: offline A3 is skipped and the history lists it in skipped_user_ids; history has rule, strategy, owner")
    @CaseId({"E-12", "E-19"})
    public void offlineSkippedAndHistory() {
        o.setPrefs(DA, m("assign_to_offline_agents", false));
        Map<String, String> p = o.presence(A1, A2, A3);
        if (!p.get(A1).startsWith("on") || !p.get(A2).startsWith("on")) inconclusive("A1/A2 not online: " + p);
        String mk = mk("E12");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2, A3);
        List<String> ids = new ArrayList<>();
        List<String> got = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            String t = o.ticket(mk + " " + i, DA);
            ids.add(t);
            got.add(n(o.waitOwner(t, 20)));
        }
        assertFalse(got.contains("A3"), "offline A3 got a ticket: " + got);
        assertFalse(got.contains("none"), "a ticket was left unassigned: " + got);
        boolean skipped = false;
        for (String t : ids) for (String h : o.autoAssigned(t)) if (h.contains("skipped_user_ids") && h.contains(A3)) skipped = true;
        assertTrue(skipped, "no history entry lists A3 as skipped");
        String h0 = o.autoAssigned(ids.get(0)).stream().findFirst().orElse("");
        assertTrue(h0.contains("rule_name") && h0.contains("strategy") && h0.contains("owner_id"), "E-19 history entry: " + h0);
    }

    @Test(groups = {"regression", "api"}, description = "Load based: the least loaded agent of the department gets the ticket")
    @CaseId("E-13")
    public void loadBased() {
        Map<String, Integer> w = new LinkedHashMap<>();
        for (String u : List.of(A1, A2, A3)) w.put(u, o.workload(u, DA));
        int min = w.values().stream().min(Integer::compare).orElse(0);
        String mk = mk("E13");
        o.rr(mk, DA, startsWith(mk), "load", A1, A2, A3);
        String t = o.ticket(mk + " 1", DA);
        String got = o.waitOwner(t, 20);
        assertNotNull(got, "not assigned");
        assertEquals((int) w.get(got), min, "loads " + w + " -> got " + n(got));
    }

    @Test(groups = {"regression", "api"}, description = "Two round-robin rules match: the first in the list assigns, the second does nothing")
    @CaseId("E-15")
    public void firstRrRuleWins() {
        String mk = mk("E15");
        o.rr(mk + " first A1", DA, startsWith(mk), "sequential", A1);
        o.rr(mk + " second A2", DA, startsWith(mk), "sequential", A2);
        List<String> s = owners(mk, 2, DA);
        assertEquals(s, l("A1", "A1"));
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Everyone at threshold: a matching ticket becomes an unassigned backlog ticket")
    @CaseId("E-16")
    public void everyoneFullBacklog() {
        // Dept B: in Dept A the agents hold ~70 old tickets and the workload API count did not match what the threshold
        // counts (21 Nov run: A1 workload 74 = threshold, still assigned) - see feature-map Traps.
        fill(DB, A1, 1, "E16");
        fill(DB, A2, 1, "E16");
        o.setPrefs(DB, m("agent_threshold_enabled", true, "agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("E16");
        o.rr(mk, DB, startsWith(mk), "sequential", A1, A2);
        String t = o.ticket(mk + " x", DB);
        wait(12);
        assertNull(o.owner(t), "assigned over threshold (workload A1 " + o.workload(A1, DB) + ", A2 " + o.workload(A2, DB)
                + ", prefs " + o.prefs(DB).get("agent_thresholds") + "): " + o.autoAssigned(t));
        assertTrue(o.inBacklog(t), "not flagged as backlog");
    }

    @Test(groups = {"regression", "api"}, description = "Round Robin master switch off: no round robin, no backlog; rules kept")
    @CaseId({"E-17", "A-10"})
    public void rrMasterSwitchOff() {
        String mk = mk("E17");
        String id = o.rr(mk, DA, startsWith(mk), "sequential", A1, A2);
        o.setSwitches(m("round_robin_rules_enabled", false));
        try {
            String t = o.ticket(mk + " x", DA);
            wait(20);
            assertNull(o.owner(t), "assigned with the switch off");
            assertFalse(o.inBacklog(t), "flagged as backlog with the switch off");
            assertNotNull(o.findRule(id), "rule removed by the switch");
        } finally {
            o.setSwitches(m("round_robin_rules_enabled", true));
        }
    }

    @Test(groups = {"regression", "api"}, description = "30-day customer-reply limit for backlog tickets")
    @CaseId("E-18")
    public void thirtyDayLimit() {
        throw new SkipException("NOT AUTOMATED: needs a backlog ticket whose last customer reply is older than 30 days (aged data). Retested as NDC-2838 on 16 Nov.");
    }

    @Test(groups = {"regression", "api"}, description = "Round-robin rule on update: a ticket edited to match is assigned")
    @CaseId("E-20")
    public void rrOnUpdate() {
        String mk = mk("E20");
        o.rule(rrBody(mk, DA, l("update"), l(rrTarget(contains(mk + " GO"), "sequential", agentsPool(A2)))));
        String t = o.ticket(mk + " start", DA);
        wait(8);
        assertNull(o.owner(t), "update rule acted on create");
        o.patchTicket(t, m("subject", mk + " GO now"));
        assertEquals(n(o.waitOwner(t, 30)), "A2");
    }

    @Test(groups = {"regression", "api"}, description = "An unassigned ticket moved into a department is assigned by that department's round-robin rule (trigger 'moved')")
    @CaseId("E-21")
    public void movedIntoDepartment() {
        String mk = mk("E21");
        o.rule(rrBody(mk, DA, l("create", "update"), l(rrTarget(contains(mk), "sequential", agentsPool(A1, A2)))));
        String t = o.ticket(mk + " in B", DB);
        wait(6);
        assertNull(o.owner(t), "assigned in Dept B (no Dept B rule)");
        ok(o.move(t, DA), "move to Dept A");
        String w = o.waitOwner(t, 30);
        ledger("E-21 moved ticket history: " + o.autoAssigned(t));
        assertNotNull(w, "moved ticket not assigned by the Dept A rule");
    }
}
