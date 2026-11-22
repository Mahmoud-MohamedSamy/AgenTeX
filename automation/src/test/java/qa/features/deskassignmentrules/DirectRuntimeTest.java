package qa.features.deskassignmentrules;

import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/** Group D — what direct rules do at runtime (create / update, order, switches, removed agents, workflows). */
public class DirectRuntimeTest extends ArTestBase {

    @Test(groups = {"smoke", "regression", "api"}, description = "A direct rule assigns a matching unassigned ticket on create, with a history entry naming the rule")
    @CaseId("D-01")
    public void assignsOnCreate() {
        String mk = mk("D01");
        String rule = o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        String t = o.ticket(mk + " a", DA);
        assertEquals(n(o.waitOwner(t, 20)), "A1");
        // the history entry may be written after the owner; poll up to 30 s, then list every entry for the report
        List<String> h = o.autoAssigned(t);
        for (int i = 0; i < 10 && h.stream().noneMatch(x -> x.contains(rule)); i++) {
            wait(3);
            h = o.autoAssigned(t);
        }
        if (h.stream().noneMatch(x -> x.contains(rule))) {
            List<String> all = new java.util.ArrayList<>();
            for (Map<String, Object> e : o.activity(t)) all.add(e.get("action") + " " + cut(toJson(e.get("summary")), 160) + " by " + cut(toJson(e.get("actor")), 80));
            ArApi.ledger("D-01 history of the direct-assigned ticket: " + all);
            fail("no auto_assigned history entry with the rule id after 30 s; history: " + all);
        }
    }

    @Test(groups = {"regression", "api"}, description = "A ticket that does not match stays unassigned")
    @CaseId("D-02")
    public void nonMatchingUntouched() {
        String mk = mk("D02");
        o.direct(mk, directTarget(contains(mk + " GO"), DA, null, agent(A1)));
        String t = o.ticket(mk + " nomatch", DA);
        wait(10);
        assertNull(o.owner(t));
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "A matching ticket created with an owner keeps that owner")
    @CaseId("D-03")
    public void existingOwnerKept() {
        String mk = mk("D03");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        String t = o.ticket(mk + " preset", DA, m("owner", A2));
        wait(10);
        assertEquals(n(o.owner(t)), "A2");
    }

    @Test(groups = {"regression", "api"}, description = "Direct assignment ignores availability: an offline agent gets the ticket, no backlog")
    @CaseId("D-04")
    public void ignoresAvailability() {
        String mk = mk("D04");
        o.setPrefs(DA, m("assign_to_offline_agents", false));
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A3)));
        String t = o.ticket(mk + " offline", DA);
        assertEquals(n(o.waitOwner(t, 20)), "A3");
        assertFalse(o.inBacklog(t), "direct ticket flagged as backlog");
    }

    @Test(groups = {"regression", "api"}, description = "A team target puts the ticket in the team queue with no owner")
    @CaseId({"D-05", "F-13"})
    public void teamTarget() {
        String mk = mk("D05");
        o.direct(mk, directTarget(contains(mk), DA, null, team(TEAM_A)));
        String t = o.ticket(mk + " team", DA);
        String js = null;
        for (int i = 0; i < 8 && (js == null || !js.contains(TEAM_A)); i++) {
            wait(3);
            js = toJson(o.fields(t)) + toJson(o.deskTicket(t));
        }
        assertTrue(js.contains(TEAM_A), "ticket not in QA AS6 Team A: " + cut(js, 300));
        wait(15); // F-13: no RR team rule -> stays in the team queue
        assertNull(o.owner(t), "team ticket got an owner without a team round-robin rule");
    }

    @Test(groups = {"regression", "api"}, description = "Any Department -> move to Dept B + agent A1: ticket ends in Dept B owned by A1")
    @CaseId("D-06")
    public void moveAndAssign() {
        String mk = mk("D06");
        o.direct(mk, directTarget(contains(mk), null, DB, agent(A1)));
        String t = o.ticket(mk + " move", DA);
        assertEquals(n(o.waitOwner(t, 20)), "A1");
        assertEquals(o.fields(t).get("department"), DB, "not moved to Dept B");
    }

    @Test(groups = {"regression", "api"}, description = "Coming to Dept B -> move to Dept A unassigned; a Dept A round-robin rule then assigns it")
    @CaseId("D-07")
    public void moveUnassignedThenRoundRobin() {
        String mk = mk("D07");
        o.rr(mk + " rr", DA, contains(mk), "sequential", A1, A2);
        o.direct(mk, directTarget(contains(mk), DB, DA, unassigned()));
        String t = o.ticket(mk + " move-unassigned", DB);
        String w = o.waitOwner(t, 30);
        assertEquals(o.fields(t).get("department"), DA, "not moved to Dept A");
        assertNotNull(w, "moved ticket not assigned by the Dept A round-robin rule");
    }

    @Test(groups = {"regression", "api"}, description = "First matching rule is Mark as Unassigned, second -> A2: the ticket stays unassigned")
    @CaseId("D-08")
    public void firstRuleWinsUnassigned() {
        String mk = mk("D08");
        o.direct(mk + " a", directTarget(contains(mk), DA, null, unassigned()));
        o.direct(mk + " b", directTarget(contains(mk), DA, null, agent(A2)));
        String t = o.ticket(mk + " x", DA);
        wait(12);
        assertNull(o.owner(t), "second rule acted");
    }

    @Test(groups = {"regression", "api"}, description = "Rule on update: unowned ticket edited to match is assigned, owned ticket keeps its owner; no loop on later edits")
    @CaseId({"D-09", "D-10"})
    public void ruleOnUpdateNoLoop() {
        String mk = mk("D09");
        o.rule(directBody(mk, l("update"), l(directTarget(contains(mk + " GO"), DA, null, agent(A1)))));
        String t = o.ticket(mk + " unowned", DA);
        String owned = o.ticket(mk + " owned", DA, m("owner", A2));
        wait(5);
        assertNull(o.owner(t), "update rule acted on create");
        o.patchTicket(t, m("subject", mk + " GO unowned"));
        o.patchTicket(owned, m("subject", mk + " GO owned"));
        assertEquals(n(o.waitOwner(t, 20)), "A1", "unowned ticket edited to match");
        wait(6);
        assertEquals(n(o.owner(owned)), "A2", "owned ticket re-assigned");
        int before = o.autoAssigned(t).size();
        o.patchTicket(t, m("priority", "Low"));
        wait(8);
        assertEquals(before, 1, "assignment entries after the matching edit");
        assertEquals(o.autoAssigned(t).size(), 1, "D-10: a further edit assigned again (loop)");
    }

    @Test(groups = {"regression", "api"}, description = "Two matching rules: the higher one acts; after swapping the order the other acts")
    @CaseId({"D-11", "A-08"})
    public void ruleOrder() {
        String mk = mk("D11");
        String a = o.direct(mk + " a A1", directTarget(contains(mk), DA, null, agent(A1)));
        String b = o.direct(mk + " b A2", directTarget(contains(mk), DA, null, agent(A2)));
        String t1 = o.ticket(mk + " first", DA);
        assertEquals(n(o.waitOwner(t1, 20)), "A1", "before reorder");
        ok(o.swap("direct", null, a, b), "swap order");
        String t2 = o.ticket(mk + " after", DA);
        assertEquals(n(o.waitOwner(t2, 20)), "A2", "after reorder");
    }

    @Test(groups = {"regression", "api"}, description = "Inactive rules never act; with the Direct master switch off no direct rule acts (rules kept)")
    @CaseId({"D-12", "A-10"})
    public void inactiveAndMasterSwitch() {
        String mk = mk("D12");
        String a = o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        ok(o.setActive(a, false), "deactivate");
        String t1 = o.ticket(mk + " inactive", DA);
        wait(10);
        assertNull(o.owner(t1), "inactive rule acted");
        ok(o.setActive(a, true), "activate");
        o.setSwitches(m("direct_rules_enabled", false));
        try {
            String t2 = o.ticket(mk + " master off", DA);
            wait(10);
            assertNull(o.owner(t2), "rule acted with the Direct switch off");
            assertNotNull(o.findRule(a), "rule removed by the switch");
        } finally {
            o.setSwitches(m("direct_rules_enabled", true));
        }
    }

    @Test(groups = {"regression", "api"}, description = "Agent removed from the department is never assigned by a rule that names them")
    @CaseId("D-13")
    public void removedAgentNotAssigned() {
        String mk = mk("D13");
        o.direct(mk, directTarget(contains(mk), DB, null, agent(A2)));
        o.removeMember(DB, A2);
        try {
            String t = o.ticket(mk + " x", DB);
            wait(10);
            assertNotEquals(n(o.owner(t)), "A2");
        } finally {
            o.addMember(DB, A2);
        }
    }

    @Test(groups = {"regression", "api"}, description = "Ticket sources: a ticket created through the API (as the New Ticket form does) triggers the direct rule")
    @CaseId("D-14")
    public void ticketSourceApi() {
        // Web form, import (Trigger automation on/off) and email were verified on 18 Nov (execu_2026-11-18_direct-assign-sources);
        // they need a published form, an import file and working mail, so this automation covers the API / form path only.
        String mk = mk("D14");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A2)));
        String t = o.ticket(mk + " api", DA);
        assertEquals(n(o.waitOwner(t, 20)), "A2");
    }

    @Test(groups = {"regression", "api"}, description = "Direct -> A1, then a workflow 'owner is A1 -> set A2' in the same event: final owner A2")
    @CaseId("D-15")
    public void workflowSeesDirectOwner() {
        String mk = mk("EO2");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        o.workflow(mk + " WF", m("kind", "Logical", "operator", "And", "operands", l(subjectStarts(mk),
                m("kind", "Comparison", "field", "owner", "operator", "Equal", "value", m("kind", "string", "stringValue", A1)))), setOwner(A2));
        String t = o.ticket(mk + " x", DA);
        wait(12);
        assertEquals(n(o.waitOwner(t, 10)), "A2", "the workflow did not see the owner set by the direct rule");
    }

    @Test(groups = {"regression", "api"}, description = "Direct -> A1, workflow sets A2: final owner A2, history shows both")
    @CaseId("D-16")
    public void workflowOverridesDirect() {
        String mk = mk("EO5");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        o.workflow(mk + " WF", subjectStarts(mk), setOwner(A2));
        String t = o.ticket(mk + " x", DA);
        wait(12);
        assertEquals(n(o.waitOwner(t, 10)), "A2");
        String h = toJson(o.activity(t));
        assertTrue(h.contains(A1) && h.contains(A2), "history does not show A1 then A2: " + cut(h, 300));
    }

    @Test(groups = {"regression", "api"}, description = "A ticket owned by a workflow on create is not touched by a matching round-robin rule")
    @CaseId("D-17")
    public void workflowOwnerBlocksRoundRobin() {
        String mk = mk("EO3");
        o.rr(mk + " rr", DA, contains(mk), "sequential", A2, A3);
        o.workflow(mk + " WF", subjectStarts(mk), setOwner(A1));
        String t = o.ticket(mk + " x", DA);
        wait(14);
        assertEquals(n(o.owner(t)), "A1");
        List<String> h = o.autoAssigned(t);
        assertTrue(h.stream().noneMatch(x -> x.contains("round_robin")), "round robin acted: " + h);
    }
}
