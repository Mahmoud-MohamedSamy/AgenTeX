package qa.features.deskassignmentrules;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Group F — Round Robin Preferences: offline agents, thresholds, backlog runs, closure, incoming mode, team assignment.
 * Backlog cases run in Dept B with pool A1 + A2. "Full" = agent thresholds equal to the agent's current open tickets.
 * The backlog job runs about once a minute, so these tests wait up to ~2 minutes each.
 */
public class RrPreferencesTest extends ArTestBase {

    private String pool(String mk, String dept) {
        return o.rr(mk, dept, startsWith(mk), "sequential", A1, A2);
    }

    /** Both agents get >= min open tickets in dept and thresholds that leave freeA1 / freeA2 slots. */
    private void full(String dept, int min, int freeA1, int freeA2, Map<String, Object> more, String tag) {
        fill(dept, A1, min, tag);
        fill(dept, A2, min, tag);
        Map<String, Object> p = m("agent_threshold_enabled", true, "agent_thresholds", thresholds(dept, freeA1, freeA2));
        if (more != null) p.putAll(more);
        o.setPrefs(dept, p);
    }

    /** An open ticket of dept owned by the user and created by this run (one to close / move). */
    private String ownedTicket(String dept, String user, String tag) {
        String t = o.ticket(PREFIX + tag + " own " + n(user) + " " + uid(), dept, m("owner", user));
        wait(2);
        return t;
    }

    private static String iso(int days) {
        return LocalDate.now().plusDays(days).toString();
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Offline agents off: offline A3 skipped; on: A3 gets its turn")
    @CaseId({"F-01a", "F-01b"})
    public void offlineAgentsOffOn() {
        Map<String, String> p = o.presence(A1, A2, A3);
        if (!p.get(A1).startsWith("on") || !p.get(A2).startsWith("on")) inconclusive("A1/A2 not online: " + p);
        String mk = mk("F01");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2, A3);
        o.setPrefs(DA, m("assign_to_offline_agents", false));
        List<String> off = new ArrayList<>();
        for (int i = 1; i <= 4; i++) off.add(n(o.waitOwner(o.ticket(mk + " off " + i, DA), 20)));
        assertTrue(off.stream().allMatch(x -> x.equals("A1") || x.equals("A2")), "F-01a offline agents off: " + off);
        o.setPrefs(DA, m("assign_to_offline_agents", true));
        List<String> on = new ArrayList<>();
        for (int i = 1; i <= 3; i++) on.add(n(o.waitOwner(o.ticket(mk + " on " + i, DA), 20)));
        assertTrue(on.contains("A3"), "F-01b offline agents on, A3 never got its turn: " + on);
    }

    @Test(groups = {"regression", "api"}, description = "Preference values outside the allowed range are refused, edge values accepted")
    @CaseId("F-02")
    public void valueValidation() {
        Map<String, Object> base = o.prefs(DA);
        java.util.function.Function<Map<String, Object>, Response> put = ch -> {
            Map<String, Object> b = new LinkedHashMap<>(base);
            b.putAll(ch);
            return o.putPrefs(DA, b);
        };
        SoftAssert s = new SoftAssert();
        for (Object v : new Object[]{0, 201, 1.5, null})
            s.assertEquals(put.apply(m("department_threshold_enabled", true, "department_threshold", v)).statusCode() / 100, 4, "department threshold " + v);
        for (int v : new int[]{1, 200})
            s.assertEquals(put.apply(m("department_threshold_enabled", true, "department_threshold", v)).statusCode() / 100, 2, "department threshold " + v);
        for (int v : new int[]{0, 51}) s.assertEquals(put.apply(m("backlog_limit", v)).statusCode() / 100, 4, "backlog limit " + v);
        for (int v : new int[]{1, 50}) s.assertEquals(put.apply(m("backlog_limit", v)).statusCode() / 100, 2, "backlog limit " + v);
        s.assertEquals(put.apply(m("backlog_order", "priority")).statusCode() / 100, 4, "unknown order");
        s.assertEquals(put.apply(m("backlog_order", "due_date")).statusCode() / 100, 2, "order due_date");
        s.assertEquals(put.apply(m("incoming_mode", "later")).statusCode() / 100, 4, "unknown incoming mode");
        s.assertEquals(put.apply(m("incoming_mode", "backlog_first")).statusCode() / 100, 2, "incoming backlog_first");
        s.assertAll();
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Department threshold reached: a matching ticket becomes an unassigned backlog ticket")
    @CaseId("F-03")
    public void departmentThreshold() {
        fill(DB, A1, 1, "F03");
        fill(DB, A2, 1, "F03");
        o.setPrefs(DB, m("department_threshold_enabled", true, "department_threshold", 1));
        String mk = mk("F03");
        pool(mk, DB);
        String t = o.ticket(mk + " dept full", DB);
        wait(12);
        assertNull(o.owner(t), "assigned over the department threshold");
        assertTrue(o.inBacklog(t), "not in backlog");
    }

    @Test(groups = {"regression", "api"}, description = "Agent threshold rows: no agent, 0, 201, duplicate agent, agent outside the department are refused")
    @CaseId("F-04")
    public void agentRowsValidation() {
        Map<String, Object> base = o.prefs(DA);
        java.util.function.Function<List<Object>, Integer> put = rows -> {
            Map<String, Object> b = new LinkedHashMap<>(base);
            b.put("agent_threshold_enabled", true);
            b.put("agent_thresholds", rows);
            return o.putPrefs(DA, b).statusCode();
        };
        SoftAssert s = new SoftAssert();
        s.assertEquals(put.apply(l(m("user_id", null, "threshold", 5))) / 100, 4, "row without agent");
        s.assertEquals(put.apply(l(threshold(A1, 0))) / 100, 4, "threshold 0");
        s.assertEquals(put.apply(l(threshold(A1, 201))) / 100, 4, "threshold 201");
        s.assertEquals(put.apply(l(threshold(A1, 5), threshold(A1, 6))) / 100, 4, "same agent twice");
        s.assertEquals(put.apply(l(threshold(OUTSIDER, 5))) / 100, 4, "agent outside the department");
        s.assertEquals(put.apply(l(threshold(A1, 200))) / 100, 2, "threshold 200");
        s.assertAll();
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Agent threshold overrides the department threshold: only A1 (with room) gets the ticket")
    @CaseId({"F-05", "F-06"})
    public void agentOverridesDepartment() {
        fill(DB, A1, 1, "F05");
        fill(DB, A2, 1, "F05");
        int a1 = o.workload(A1, DB);
        o.setPrefs(DB, m("department_threshold_enabled", true, "department_threshold", 1,
                "agent_threshold_enabled", true, "agent_thresholds", l(threshold(A1, a1 + 1))));
        String mk = mk("F05");
        pool(mk, DB);
        String t = o.ticket(mk + " agent override", DB);
        assertEquals(n(o.waitOwner(t, 20)), "A1", "F-05");
        // F-06: agent level off keeps the rows; the department threshold applies again
        o.changePrefs(DB, m("agent_threshold_enabled", false));
        List<?> rows = (List<?>) o.prefs(DB).get("agent_thresholds");
        assertEquals(rows.size(), 1, "F-06 rows not kept: " + rows);
        String t2 = o.ticket(mk + " agent off", DB);
        wait(12);
        assertNull(o.owner(t2), "F-06 department threshold not applied again");
        assertTrue(o.inBacklog(t2), "F-06 not in backlog");
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Assign backlogs, limit 1, created-time order: oldest first, stops at the threshold")
    @CaseId("F-07a")
    public void backlogCreatedTimeOrder() {
        full(DB, 1, 0, 0, null, "F07a");
        String mk = mk("F07a");
        pool(mk, DB);
        String l1 = o.ticket(mk + " L1", DB);
        wait(2);
        String l2 = o.ticket(mk + " L2", DB);
        wait(2);
        String l3 = o.ticket(mk + " L3", DB);
        wait(8);
        assertTrue(o.inBacklog(l1) && o.inBacklog(l2) && o.inBacklog(l3), "precondition: three backlog tickets");
        o.changePrefs(DB, m("agent_thresholds", l(threshold(A1, o.workload(A1, DB) + 2), threshold(A2, Math.max(1, o.workload(A2, DB)))),
                "assign_backlogs", true, "backlog_limit", 1, "backlog_order", "created_time"));
        String w1 = watch(l1, 200);
        String w2 = watch(l2, 120);
        wait(70);
        String w3 = o.owner(l3);
        assertNotNull(w1, "oldest backlog ticket L1 not assigned");
        assertTrue(w1.startsWith("A1"), "L1 -> " + w1);
        assertNotNull(w2, "L2 not assigned (A1 had 2 free slots)");
        assertNull(w3, "L3 assigned beyond the threshold -> " + n(w3));
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Assign backlogs in due-date order: the soonest due goes first; a close frees the next slot")
    @CaseId({"F-07b", "F-07c"})
    public void backlogDueDateAndClose() {
        full(DB, 1, 0, 0, m("backlog_order", "due_date"), "F07b");
        String mk = mk("F07b");
        pool(mk, DB);
        String x1 = o.ticket(mk + " X1 due+3", DB, m("due_date", iso(3)));
        String x2 = o.ticket(mk + " X2 due+1", DB, m("due_date", iso(1)));
        String x3 = o.ticket(mk + " X3 due+2", DB, m("due_date", iso(2)));
        wait(8);
        assertTrue(o.inBacklog(x1) && o.inBacklog(x2) && o.inBacklog(x3), "precondition: three backlog tickets");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 1), "assign_backlogs", true));
        String w2 = watch(x2, 120);
        assertNotNull(w2, "F-07b soonest due X2 not assigned");
        assertNull(o.owner(x1), "F-07b X1 assigned");
        assertNull(o.owner(x3), "F-07b X3 assigned");
        // F-07c: closing one of A1's tickets frees a slot -> next due X3 goes to A1
        String a1t = ownedTicket(DB, A1, "F07c");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 0)));
        ok(o.close(a1t), "close A1 ticket");
        String w3 = watch(x3, 120);
        assertNotNull(w3, "F-07c next due X3 not assigned after a close");
        assertTrue(w3.startsWith("A1"), "F-07c X3 -> " + w3);
        assertNull(o.owner(x1), "F-07c X1 assigned too");
    }

    @Test(groups = {"regression", "api", "slow", "NDC-2811"}, description = "Backlog: nothing goes to an offline agent with a free slot; once online it gets the ticket")
    @CaseId({"F-07d", "R-2811"})
    public void backlogAgentComesOnline() {
        full(DB, 1, 0, 0, m("assign_to_offline_agents", false), "F07d");
        String mk = mk("F07d");
        pool(mk, DB);
        String x = o.ticket(mk + " X", DB);
        wait(8);
        assertTrue(o.inBacklog(x), "precondition: backlog ticket");
        AgentPresence.a2(AgentPresence.Mode.EMAIL_OFF);
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 1), "assign_backlogs", true));
        String whileOff = watch(x, 75);
        assertNull(whileOff, "assigned while A2's email channel was off (NDC-2811)");
        AgentPresence.a2(AgentPresence.Mode.ON);
        String on = watch(x, 120);
        assertNotNull(on, "not assigned after A2 came online");
        assertTrue(on.startsWith("A2"), "-> " + on);
    }

    /**
     * Jam 602e782c (22 Nov): department threshold, offline agents OFF, backlog ON. A1 is full, A2 is fully offline (no
     * heartbeat), so tickets wait in the backlog. When A2 comes online it should get them. Differs from F-07d: A2 is
     * fully offline (not only email off) and the cap is the department threshold, not agent thresholds.
     */
    @Test(groups = {"regression", "api", "slow", "JAM-602e782c"}, description = "Backlog + department threshold: a fully offline agent who comes online gets the waiting backlog tickets")
    @CaseId("F-07f")
    public void backlogDeptThresholdAgentComesOnline() {
        String mk = mk("F07f");
        // OFF = channels off + no heartbeat; the app keeps "online" until its heartbeat timeout (~3 min), so wait for real offline
        AgentPresence.a2(AgentPresence.Mode.OFF);
        Map<String, String> p = o.presence(A1, A2);
        long off0 = System.currentTimeMillis();
        while (p.get(A2).startsWith("on") && System.currentTimeMillis() - off0 < 300_000) {
            wait(15);
            p = o.presence(A1, A2);
        }
        ArApi.ledger("F-07f A2 offline after " + (System.currentTimeMillis() - off0) / 1000 + " s: " + p);
        if (!p.get(A1).startsWith("on") || p.get(A2).startsWith("on")) inconclusive("presence is not A1 on / A2 off after 5 min: " + p);
        int w1 = o.workload(A1, DB), w2 = o.workload(A2, DB);
        int t = Math.max(w1, w2) + 1;
        o.setPrefs(DB, m("assign_to_offline_agents", false, "department_threshold_enabled", true, "department_threshold", t,
                "assign_backlogs", true, "backlog_limit", 4, "backlog_order", "created_time"));
        pool(mk, DB);
        List<String> fills = new ArrayList<>();
        for (int i = w1; i < t; i++) {
            String f = o.ticket(mk + " A1 fill " + i, DB);
            String w = watch(f, 30);
            if (w == null || !w.startsWith("A1")) inconclusive("fill ticket did not go to A1 (A2 offline): " + w);
            fills.add(f);
        }
        String x1 = o.ticket(mk + " X1", DB);
        String x2 = o.ticket(mk + " X2", DB);
        wait(15);
        String pre = "X1 owner " + n(o.owner(x1)) + " backlog " + o.inBacklog(x1) + ", X2 owner " + n(o.owner(x2)) + " backlog " + o.inBacklog(x2)
                + ", A1 load " + o.workload(A1, DB) + ", threshold " + t + ", presence " + o.presence(A1, A2) + ", X1 activity " + o.autoAssigned(x1);
        ArApi.ledger("F-07f precondition: " + pre);
        assertTrue(o.inBacklog(x1) && o.inBacklog(x2), "precondition: X1 and X2 in the backlog (A1 full, A2 offline): " + pre);
        String whileOff = watch(x1, 75);
        assertNull(whileOff, "control: X1 assigned while A2 was offline and A1 full -> " + whileOff);
        long on0 = System.currentTimeMillis();
        AgentPresence.a2(AgentPresence.Mode.ON);
        Map<String, String> p2 = o.presence(A1, A2);
        ArApi.ledger("F-07f A2 brought online: " + p2 + "; threshold " + t + ", loads A1 " + o.workload(A1, DB) + " A2 " + o.workload(A2, DB));
        if (!p2.get(A2).startsWith("on")) inconclusive("A2 did not come online: " + p2);
        String on = watch(x1, 180);
        if (on == null) {
            // diagnostic: does a ticket event (closing one of A1's tickets) start the backlog run?
            ok(o.close(fills.get(0)), "close an A1 ticket");
            String after = watch(x1, 90);
            String after2 = o.owner(x2);
            ArApi.ledger("F-07f FAIL: X1 not assigned 180 s after A2 came online; after closing an A1 ticket X1 -> " + after + ", X2 -> " + n(after2));
            fail("JAM-602e782c: backlog ticket X1 not assigned within 180 s after A2 came online with free slots (department threshold " + t
                    + "). After an A1 ticket was closed: X1 -> " + after + ", X2 -> " + n(after2));
        }
        ArApi.ledger("F-07f X1 -> " + on + " after A2 came online (" + (System.currentTimeMillis() - on0) / 1000 + " s)");
        assertTrue(on.startsWith("A2"), "X1 should go to A2 (A1 full) -> " + on);
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Backlog: moving a full agent's ticket to another department frees a slot")
    @CaseId("F-07e")
    public void backlogFreedByMove() {
        full(DB, 1, 0, 0, null, "F07e");
        String a1t = ownedTicket(DB, A1, "F07e");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("F07e");
        pool(mk, DB);
        String y = o.ticket(mk + " Y1", DB);
        wait(8);
        assertTrue(o.inBacklog(y), "precondition: backlog ticket");
        o.changePrefs(DB, m("assign_backlogs", true));
        ok(o.move(a1t, DA), "move A1 ticket to Dept A");
        String w = watch(y, 120);
        assertNotNull(w, "backlog ticket not assigned after the move");
        assertTrue(w.startsWith("A1"), "-> " + w);
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Closure on: an online full agent who closes their own ticket gets the backlog ticket at once")
    @CaseId("F-08a")
    public void closureOwnTicket() {
        full(DB, 1, 0, 0, m("assign_on_closure", true), "F08a");
        String a1t = ownedTicket(DB, A1, "F08a");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("F08a");
        pool(mk, DB);
        String z = o.ticket(mk + " Z1", DB);
        wait(8);
        assertTrue(o.inBacklog(z), "precondition: backlog ticket");
        ok(ArApi.a1().close(a1t), "A1 closes own ticket");
        String w = watch(z, 60);
        assertNotNull(w, "backlog ticket not assigned on closure");
        assertTrue(w.startsWith("A1"), "-> " + w);
    }

    @Test(groups = {"regression", "api"}, description = "Closure on: the administrator closes an online agent's ticket -> backlog ticket to that agent")
    @CaseId("F-08b")
    public void closureByAdmin() {
        full(DB, 1, 0, 0, m("assign_on_closure", true), "F08b");
        String a2t = ownedTicket(DB, A2, "F08b");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("F08b");
        pool(mk, DB);
        String z = o.ticket(mk + " Z2", DB);
        wait(8);
        ok(o.close(a2t), "admin closes A2 ticket");
        String w = watch(z, 60);
        assertNotNull(w, "backlog ticket not assigned on closure");
        assertTrue(w.startsWith("A2"), "-> " + w);
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Closure works every time: 5 repetitions of A1 closing its own ticket")
    @CaseId("F-08c")
    public void closureFiveTimes() {
        fill(DB, A1, 1, "F08c");
        fill(DB, A2, 1, "F08c");
        List<String> mine = new ArrayList<>();
        for (int i = 0; i < 5; i++) mine.add(ownedTicket(DB, A1, "F08c"));
        String mk = mk("F08c");
        pool(mk, DB);
        List<String> reps = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            o.setPrefs(DB, m("agent_threshold_enabled", true, "agent_thresholds", thresholds(DB, 0, 0), "assign_on_closure", true));
            String z = o.ticket(mk + " ZR" + (i + 1), DB);
            wait(7);
            ok(ArApi.a1().close(mine.get(i)), "A1 closes " + i);
            String w = watch(z, 60);
            reps.add(w == null ? "NOT ASSIGNED" : w);
        }
        assertTrue(reps.stream().allMatch(x -> x.startsWith("A1")), "repetitions: " + reps);
    }

    @Test(groups = {"regression", "api", "NDC-3137"}, description = "Closure with an offline agent and 'assign to offline agents' on: the admin closes its ticket -> backlog ticket to that agent")
    @CaseId({"F-08d", "R-3137"})
    public void closureOfflineAgent() {
        full(DB, 1, 0, 0, m("assign_on_closure", true, "assign_to_offline_agents", true), "F08d");
        String a2t = ownedTicket(DB, A2, "F08d");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("F08d");
        pool(mk, DB);
        String z = o.ticket(mk + " Z3", DB);
        wait(8);
        assertTrue(o.inBacklog(z), "precondition: backlog ticket");
        AgentPresence.a2(AgentPresence.Mode.OFF);
        ok(o.close(a2t), "admin closes A2 ticket");
        String w = watch(z, 75);
        assertNotNull(w, "NDC-3137: backlog ticket not assigned to the offline agent after the closure");
        assertTrue(w.startsWith("A2"), "-> " + w);
    }

    @Test(groups = {"regression", "api"}, description = "Closing a ticket with no owner assigns nothing")
    @CaseId("F-08e")
    public void closureUnownedTicket() {
        full(DB, 1, 0, 0, m("assign_on_closure", true), "F08e");
        String mk = mk("F08e");
        pool(mk, DB);
        String z = o.ticket(mk + " Z", DB);
        String unowned = o.ticket(PREFIX + "F08e unowned " + uid(), DB);
        wait(8);
        ok(o.close(unowned), "close unowned ticket");
        wait(30);
        assertNull(o.owner(z), "backlog ticket assigned after closing an unowned ticket");
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Both backlog options off: a backlog ticket stays unassigned even when slots free up")
    @CaseId("F-09")
    public void bothBacklogOptionsOff() {
        full(DB, 1, 0, 0, null, "F09");
        String mk = mk("F09");
        pool(mk, DB);
        String z = o.ticket(mk + " Z", DB);
        wait(8);
        assertTrue(o.inBacklog(z), "precondition: backlog ticket");
        o.changePrefs(DB, m("agent_thresholds", thresholds(DB, 10, 10), "assign_backlogs", false, "assign_on_closure", false));
        wait(80);
        assertNull(o.owner(z), "backlog ticket assigned with both options off");
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Push new tickets into the backlog first: the ticket waits, then Assign backlogs assigns it")
    @CaseId("F-10a")
    public void backlogFirstThenAssignBacklogs() {
        o.setPrefs(DB, m("incoming_mode", "backlog_first"));
        String mk = mk("F10a");
        pool(mk, DB);
        String t = o.ticket(mk + " N1", DB);
        wait(15);
        assertNull(o.owner(t), "assigned at once although incoming = backlog first");
        assertTrue(o.inBacklog(t), "not in backlog");
        o.changePrefs(DB, m("assign_backlogs", true));
        assertNotNull(watch(t, 120), "not assigned by the backlog run");
    }

    @Test(groups = {"regression", "api"}, description = "Backlog first + only closure on: the ticket waits until an agent closes a ticket")
    @CaseId("F-10b")
    public void backlogFirstThenClosure() {
        String a1t = ownedTicket(DB, A1, "F10b");
        o.setPrefs(DB, m("incoming_mode", "backlog_first", "assign_on_closure", true));
        String mk = mk("F10b");
        pool(mk, DB);
        String t = o.ticket(mk + " N2", DB);
        wait(15);
        assertNull(o.owner(t), "assigned at once");
        ok(ArApi.a1().close(a1t), "A1 closes a ticket");
        String w = watch(t, 60);
        assertNotNull(w, "not assigned after the closure");
        assertTrue(w.startsWith("A1"), "-> " + w);
    }

    @Test(groups = {"regression", "api"}, description = "in_backlog is cleared when a backlog ticket is assigned by hand or moved to another department")
    @CaseId("F-11")
    public void inBacklogCleared() {
        full(DB, 1, 0, 0, null, "F11");
        String mk = mk("F11");
        pool(mk, DB);
        String y2 = o.ticket(mk + " Y2 manual", DB), y3 = o.ticket(mk + " Y3 move", DB);
        wait(8);
        assertTrue(o.inBacklog(y2) && o.inBacklog(y3), "precondition: backlog tickets");
        ok(o.assign(y2, A2, null), "manual assign");
        ok(o.move(y3, DA), "move");
        wait(6);
        assertFalse(o.inBacklog(y2), "in_backlog still set after manual assign");
        assertFalse(o.inBacklog(y3), "in_backlog still set after move");
    }

    @Test(groups = {"regression", "api", "NDC-2812"}, description = "Team Assignment off: team rule target, RR team pool and manual team assignment are refused")
    @CaseId({"F-12", "C-08", "R-2812"})
    public void teamAssignmentOff() {
        String mk = mk("F12");
        String t = o.ticket(mk + " manual", DA);
        o.setTeamAssignment(DA, false);
        try {
            Response direct = o.createRule(directBody(mk + " team", l("create"), l(directTarget(contains(mk), DA, null, team(TEAM_A)))));
            Response rr = o.createRule(rrBody(mk + " rr team", DA, l("create"), l(rrTarget(startsWith(mk), "sequential", teamPool(TEAM_A)))));
            Response man = o.assign(t, null, TEAM_A);
            SoftAssert s = new SoftAssert();
            s.assertEquals(direct.statusCode() / 100, 4, "direct team target: " + err(direct));
            s.assertEquals(rr.statusCode() / 100, 4, "RR team pool: " + err(rr));
            s.assertEquals(man.statusCode() / 100, 4, "manual assign to team: " + err(man));
            s.assertAll();
        } finally {
            o.setTeamAssignment(DA, true);
        }
    }

    @Test(groups = {"regression", "api", "NDC-2824"}, description = "Agent threshold counts only this department's open tickets")
    @CaseId({"F-14", "R-2824"})
    public void thresholdThisDepartmentOnly() {
        fill(DB, A1, 2, "F14"); // open tickets in another department must not count
        fill(DA, A1, 1, "F14");
        fill(DA, A2, 1, "F14");
        o.setPrefs(DA, m("agent_threshold_enabled", true, "agent_thresholds", thresholds(DA, 1, 1)));
        String mk = mk("F14");
        o.rr(mk, DA, startsWith(mk), "sequential", A1, A2);
        String t = o.ticket(mk + " count", DA);
        assertNotNull(o.waitOwner(t, 20), "went to backlog: the threshold counted other departments (NDC-2824)");
    }

    @Test(groups = {"regression", "api", "NDC-2824"}, description = "On Hold tickets do not count toward the threshold (Zoho counts open only)")
    @CaseId({"F-15", "R-2824"})
    public void onHoldNotCounted() {
        fill(DB, A1, 1, "F15");
        String held = ownedTicket(DB, A2, "F15");
        o.setPrefs(DB, m("agent_threshold_enabled", true, "agent_thresholds", thresholds(DB, 0, 0)));
        String mk = mk("F15");
        pool(mk, DB);
        String before = o.ticket(mk + " before hold", DB);
        wait(10);
        assertNull(o.owner(before), "precondition: both agents full");
        ok(o.patchTicket(held, m("status", "On Hold")), "put A2 ticket On Hold");
        wait(5);
        String after = o.ticket(mk + " after hold", DB);
        assertEquals(n(o.waitOwner(after, 25)), "A2", "On Hold ticket still counted");
    }

    @Test(groups = {"regression", "api"}, description = "An unassigned ticket that matches no round-robin rule is not a backlog ticket")
    @CaseId("F-16")
    public void unassignedIsNotBacklog() {
        String t = o.ticket(PREFIX + "NOMATCH " + uid(), DB);
        wait(10);
        assertNull(o.owner(t));
        assertFalse(o.inBacklog(t), "unmatched ticket flagged as backlog");
    }
}
