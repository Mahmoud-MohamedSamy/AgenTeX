package qa.features.deskassignmentrules;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Group A (page and rule form, API side) and the API rows of group C (direct form).
 * Fixture rules are created INACTIVE unless the case needs them to act. Run: mvnw test -Dtest=RuleFormApiTest
 */
public class RuleFormApiTest extends ArTestBase {
    private final String startedAt = Instant.now().minusSeconds(120).toString();

    private static Map<String, Object> inactiveDirect(String name, List<Map<String, Object>> targets) {
        Map<String, Object> b = directBody(name, l("create"), targets);
        b.put("is_active", false);
        return b;
    }

    private static Map<String, Object> tgt(String marker) {
        return directTarget(contains(marker), DA, null, agent(A1));
    }

    @Test(groups = {"regression", "api"}, description = "Save with an empty name is refused (API: name required)")
    @CaseId("A-03")
    public void nameRequired() {
        Response r = o.createRule(inactiveDirect("", l(tgt(mk("A03")))));
        assertEquals(r.statusCode() / 100, 4, "empty name accepted: " + err(r));
    }

    @Test(groups = {"regression", "api"}, description = "Name stops at 120 and description at 1000 characters")
    @CaseId("A-04")
    public void nameAndDescriptionLimits() {
        String base = mk("A04");
        Response n121 = o.createRule(inactiveDirect(PREFIX + "n".repeat(121 - PREFIX.length()), l(tgt(base))));
        Map<String, Object> ok = inactiveDirect(PREFIX + "n".repeat(120 - PREFIX.length()), l(tgt(base)));
        ok.put("description", "d".repeat(1000));
        Response n120 = o.createRule(ok);
        Map<String, Object> d = inactiveDirect(base + " desc", l(tgt(base)));
        d.put("description", "d".repeat(1001));
        Response d1001 = o.createRule(d);
        SoftAssert s = new SoftAssert();
        s.assertEquals(n121.statusCode() / 100, 4, "name 121 -> " + err(n121));
        s.assertEquals(n120.statusCode() / 100, 2, "name 120 + description 1000 -> " + err(n120));
        s.assertEquals(d1001.statusCode() / 100, 4, "description 1001 -> " + err(d1001));
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "Execute on with neither create nor update is refused")
    @CaseId("A-05")
    public void executeOnRequired() {
        Map<String, Object> b = inactiveDirect(mk("A05"), l(tgt(mk("A05"))));
        b.put("execute_on", l());
        Response r = o.createRule(b);
        assertEquals(r.statusCode() / 100, 4, "empty execute_on accepted: " + err(r));
    }

    @Test(groups = {"regression", "api"}, description = "5 targets are saved, a 6th is refused")
    @CaseId("A-06")
    public void maxFiveTargets() {
        String mk = mk("A06");
        List<Map<String, Object>> five = new ArrayList<>(), six = new ArrayList<>();
        for (int i = 0; i < 6; i++) {
            if (i < 5) five.add(tgt(mk + " " + i));
            six.add(tgt(mk + " " + i));
        }
        Response r5 = o.createRule(inactiveDirect(mk + " five", five));
        Response r6 = o.createRule(inactiveDirect(mk + " six", six));
        assertEquals(r5.statusCode() / 100, 2, "5 targets -> " + err(r5));
        assertEquals(r6.statusCode() / 100, 4, "6 targets accepted -> " + err(r6));
    }

    @Test(groups = {"regression", "api"}, description = "A rule with no target is refused")
    @CaseId("A-07")
    public void atLeastOneTarget() {
        Response r = o.createRule(inactiveDirect(mk("A07"), l()));
        assertEquals(r.statusCode() / 100, 4, "no target accepted: " + err(r));
    }

    @Test(groups = {"regression", "api"}, description = "Activate then deactivate keeps every target unchanged")
    @CaseId("A-09")
    public void activateKeepsTargets() {
        String mk = mk("A09");
        List<Map<String, Object>> t = new ArrayList<>();
        for (int i = 0; i < 3; i++) t.add(tgt(mk + " " + i));
        String id = o.rule(inactiveDirect(mk, t));
        Object before = toJson(((List<?>) o.ruleOk(id).get("targets")).stream().map(x -> ((Map<?, ?>) x).get("criteria")).toList());
        ok(o.setActive(id, true), "activate");
        ok(o.setActive(id, false), "deactivate");
        Map<String, Object> g = o.ruleOk(id);
        Object after = toJson(((List<?>) g.get("targets")).stream().map(x -> ((Map<?, ?>) x).get("criteria")).toList());
        assertEquals(after, before, "targets changed by activate/deactivate");
        assertEquals(g.get("is_active"), false);
    }

    @Test(groups = {"regression", "api"}, description = "Deleting a rule that assigned a ticket: rule gone, ticket keeps its owner")
    @CaseId("A-11")
    public void deleteKeepsOwner() {
        String mk = mk("A11");
        String id = o.direct(mk, directTarget(contains(mk), DB, null, agent(A2)));
        String t = o.ticket(mk + " x", DB);
        assertEquals(o.waitOwner(t, 20), A2, "the rule did not assign the ticket (precondition)");
        ok(o.deleteRule(id), "delete rule");
        wait(2);
        assertNull(o.findRule(id), "rule still listed after delete");
        assertEquals(o.owner(t), A2, "ticket lost its owner when the rule was deleted");
    }

    @Test(groups = {"regression", "api"}, description = "Saving with an old version is refused with 409 and the newer save is kept")
    @CaseId("A-13")
    public void staleVersionConflict() {
        String mk = mk("A13");
        String id = o.rule(inactiveDirect(mk, l(tgt(mk))));
        Map<String, Object> g = new HashMap<>(o.ruleOk(id));
        Map<String, Object> first = new HashMap<>(g);
        first.put("description", "v-first");
        Map<String, Object> stale = new HashMap<>(g);
        stale.put("description", "v-stale");
        Response a = o.put("/desk/assignment-rules/" + id, first);
        Response b = o.put("/desk/assignment-rules/" + id, stale);
        assertEquals(a.statusCode(), 200, "first save " + err(a));
        assertEquals(b.statusCode(), 409, "save with the old version " + err(b));
        assertEquals(o.ruleOk(id).get("description"), "v-first");
    }

    @Test(groups = {"regression", "api"}, description = "Audit log has entries for rule create and RR preference changes (who and when)")
    @CaseId("A-14")
    public void auditLog() {
        String mk = mk("A14");
        o.rule(inactiveDirect(mk, l(tgt(mk))));
        o.changePrefs(DA, m("backlog_limit", 11));
        wait(3);
        Map<String, Integer> types = new HashMap<>();
        String actor = null;
        String cur = null;
        for (int page = 0; page < 30; page++) {
            Response r = ok(o.get("/audit/events?limit=200" + (cur != null ? "&cursor=" + cur : "")), "audit events");
            List<Map<String, Object>> ev = r.jsonPath().getList("data");
            if (ev == null || ev.isEmpty()) break;
            for (Map<String, Object> e : ev) {
                String at = String.valueOf(e.get("occurred_at"));
                String tt = String.valueOf(e.get("target_type"));
                if (at.compareTo(startedAt) < 0 || !tt.matches(".*(assignment|round_robin|skill).*")) continue;
                String k = tt.replace("audit.entity.", "") + ":" + String.valueOf(e.get("action")).replace("audit.action.", "");
                types.merge(k, 1, Integer::sum);
                if (tt.contains("round_robin")) actor = String.valueOf(e.get("actor_label"));
            }
            cur = r.jsonPath().getString("meta.next_cursor");
            if (cur == null || String.valueOf(ev.get(ev.size() - 1).get("occurred_at")).compareTo(startedAt) < 0) break;
        }
        assertTrue(types.keySet().stream().anyMatch(k -> k.matches(".*assignment_rule:created")), "no assignment_rule:created entry: " + types);
        assertTrue(types.keySet().stream().anyMatch(k -> k.matches(".*round_robin_preferences:updated")), "no round_robin_preferences:updated entry: " + types);
        assertNotNull(actor, "audit entry has no actor");
    }

    @Test(groups = {"regression", "api", "security"}, description = "Desk agent without the assignment permission: rules, preferences, switches and skills refused (403)")
    @CaseId("A-15")
    public void noPermission() {
        ArApi ag;
        try {
            ag = ArApi.as(NO_PERMISSION_LABEL);
        } catch (IllegalStateException e) {
            throw new SkipException("BLOCKED: the no-permission agent cannot sign in: " + e.getMessage());
        }
        SoftAssert s = new SoftAssert();
        s.assertEquals(ag.get("/desk/assignment-rules?type=direct").statusCode(), 403, "GET rules");
        Response p = ag.post("/desk/assignment-rules", inactiveDirect(mk("A15 should fail"), l(tgt(mk("A15")))));
        if (p.statusCode() / 100 == 2) track("rule", p.jsonPath().getString("data.id"), "A15 leaked");
        s.assertEquals(p.statusCode(), 403, "POST rule");
        s.assertEquals(ag.get("/desk/departments/" + DA + "/round-robin-preferences").statusCode(), 403, "GET RR preferences");
        s.assertEquals(ag.put("/desk/departments/" + DA + "/round-robin-preferences", m("assign_backlogs", false)).statusCode(), 403, "PUT RR preferences");
        s.assertEquals(ag.put("/desk/assignment/notification-settings", m("direct_rules_enabled", false)).statusCode(), 403, "PUT switches");
        Response sk = ag.post("/desk/skills?department_id=" + DA, m("name", mk("A15 skill"), "type_id", null, "criteria", allTickets()));
        if (sk.statusCode() / 100 == 2) track("skill", sk.jsonPath().getString("data.id"), "A15 leaked skill");
        s.assertEquals(sk.statusCode(), 403, "POST skill");
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "Move to Dept B with an agent who is not in Dept B is refused")
    @CaseId("C-04")
    public void agentNotInDestination() {
        Response r = o.createRule(inactiveDirect(mk("C04"), l(directTarget(contains(mk("C04")), DA, DB, agent(A3)))));
        assertEquals(r.statusCode() / 100, 4, "accepted: " + err(r));
    }

    @Test(groups = {"regression", "api"}, description = "Coming to Any Department without a move can only be Unassigned")
    @CaseId("C-05")
    public void anyDepartmentWithoutMove() {
        Response r = o.createRule(inactiveDirect(mk("C05"), l(directTarget(contains(mk("C05")), null, null, agent(A1)))));
        assertEquals(r.statusCode() / 100, 4, "agent accepted for Any Department without a move: " + err(r));
    }

    @Test(groups = {"regression", "api"}, description = "A target with both an agent and a team is refused, or only one of them is kept")
    @CaseId("C-07")
    public void agentAndTeamTogether() {
        String mk = mk("C07");
        Response r = o.createRule(inactiveDirect(mk, l(directTarget(contains(mk), DA, null, m("kind", "agent", "user_id", A1, "team_id", TEAM_A)))));
        if (r.statusCode() / 100 == 4) return; // refused: fine
        assertEquals(r.statusCode() / 100, 2, err(r));
        Map<?, ?> asg = (Map<?, ?>) ((Map<?, ?>) ((List<?>) o.ruleOk(r.jsonPath().getString("data.id")).get("targets")).get(0)).get("assign");
        assertTrue(asg.get("user_id") == null || asg.get("team_id") == null, "both agent and team stored: " + asg);
    }
}
