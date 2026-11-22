package qa.features.deskassignmentrules;

import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Group H (skills, API side) + skill-based round robin (E-14a/b/c, H-12) + NDC-2821 / 2931 / 2932 regressions.
 * Class fixture in Dept A: skill type "QA AR Type", sk1 (subject contains M1, agent A1), sk2 (M2, agent A2),
 * sk3 inactive (M3, agent A3); skill preferences auto-add on, settings order.
 */
public class SkillsTest extends ArTestBase {
    private final String u = uid();
    private final String m1 = PREFIX + "SKa" + u, m2 = PREFIX + "SKb" + u, m3 = PREFIX + "SKc" + u;
    private String type, sk1, sk2, sk3;
    private final String n1 = PREFIX + "sk1 " + u, n2 = PREFIX + "sk2 " + u, n3 = PREFIX + "sk3 " + u;
    private List<String[]> shared = List.of();

    @BeforeClass(alwaysRun = true, dependsOnMethods = "fixtureUp")
    public void skills() {
        ArApi.cleanupCreated();
        type = o.skillType(DA, PREFIX + "Type " + u);
        sk1 = o.skill(DA, n1, type, true, contains(m1));
        sk2 = o.skill(DA, n2, type, true, contains(m2));
        sk3 = o.skill(DA, n3, type, false, contains(m3));
        o.skillAgents(sk1, A1);
        o.skillAgents(sk2, A2);
        o.skillAgents(sk3, A3);
        o.setSkillPrefs(DA, m("auto_add", true, "placement", "settings_order"));
        shared = ArApi.detach();
    }

    @AfterClass(alwaysRun = true)
    public void removeSkills() {
        ArApi.cleanup(shared);
    }

    private String skillRule(String mk) {
        return o.rule(rrBody(mk, DA, l("create", "update"), l(rrTarget(contains(mk), "skill", agentsPool(A1, A2, A3)))));
    }

    @Test(groups = {"regression", "api", "NDC-2821"}, description = "Skills and skill types are per department: Dept B shows none of Dept A's")
    @CaseId({"H-01", "R-2821"})
    public void perDepartment() {
        List<Map<String, Object>> b = o.skills(DB);
        assertTrue(b.stream().noneMatch(s -> String.valueOf(s.get("name")).contains(u)), "Dept B lists a Dept A skill");
        String typesB = ok(o.get("/desk/skill-types?department_id=" + DB), "types B").asString();
        String typesA = ok(o.get("/desk/skill-types?department_id=" + DA), "types A").asString();
        assertTrue(typesA.contains(type), "Dept A does not list its type");
        assertFalse(typesB.contains(type), "Dept B lists Dept A's skill type");
    }

    @Test(groups = {"regression", "api"}, description = "Skill validation: blank name, no type, duplicate name and 101 characters are refused")
    @CaseId("H-02")
    public void skillValidation() {
        SoftAssert s = new SoftAssert();
        Response blank = o.createSkill(DA, "", type, false, contains("x"));
        Response noType = o.createSkill(DA, PREFIX + "notype " + u, null, false, contains("x"));
        Response dup = o.createSkill(DA, n1, type, false, contains("x"));
        Response longName = o.createSkill(DA, PREFIX + "y".repeat(101 - PREFIX.length()), type, false, contains("x"));
        s.assertEquals(blank.statusCode() / 100, 4, "blank name " + err(blank));
        s.assertEquals(noType.statusCode() / 100, 4, "no type " + err(noType));
        s.assertEquals(dup.statusCode() / 100, 4, "duplicate " + err(dup));
        s.assertEquals(longName.statusCode() / 100, 4, "101 characters " + err(longName));
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "An inactive skill whose criteria match is never added")
    @CaseId("H-03")
    public void inactiveSkillNotAdded() {
        String t = o.ticket(m3 + " inactive", DA);
        wait(6);
        assertFalse(o.ticketSkills(t).contains(n3), "inactive skill added: " + o.ticketSkills(t));
    }

    @Test(groups = {"regression", "api"}, description = "Agents set on a skill show the same in Agent Skills")
    @CaseId("H-04")
    @SuppressWarnings("unchecked")
    public void skillAgentsBothWays() {
        List<Map<String, Object>> ag = ok(o.get("/desk/agent-skills?department_id=" + DA), "agent skills").jsonPath().getList("data.agents");
        Map<String, Object> a1 = ag.stream().filter(a -> A1.equals(a.get("user_id"))).findFirst().orElse(null);
        assertNotNull(a1, "A1 missing from Agent Skills");
        assertTrue(toJson(a1.get("skills")).contains(sk1) || toJson(a1.get("skills")).contains(n1), "A1's skills in Agent Skills: " + toJson(a1.get("skills")));
    }

    @Test(groups = {"regression", "api"}, description = "A ticket matching two skills lists them in the skill-list order; after reordering it follows the new order")
    @CaseId("H-06")
    public void orderFollowsList() {
        List<String> order = new ArrayList<>(o.skills(DA).stream().map(s -> (String) s.get("id")).toList());
        String t1 = o.ticket(m2 + " and " + m1, DA);
        wait(6);
        List<String> s1 = o.ticketSkills(t1);
        int i1 = order.indexOf(sk1), i2 = order.indexOf(sk2);
        List<String> swapped = new ArrayList<>(order);
        swapped.set(i1, sk2);
        swapped.set(i2, sk1);
        try {
            ok(o.skillOrder(DA, swapped), "reorder");
            String t2 = o.ticket(m2 + " and " + m1 + " after", DA);
            wait(6);
            List<String> s2 = o.ticketSkills(t2);
            assertEquals(s1, i1 < i2 ? l(n1, n2) : l(n2, n1), "before reorder");
            assertEquals(s2, i1 < i2 ? l(n2, n1) : l(n1, n2), "after reorder");
        } finally {
            o.skillOrder(DA, order);
        }
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Skills are added by their criteria on create and on update")
    @CaseId("H-07")
    public void autoAddCreateAndUpdate() {
        String t = o.ticket(m1 + " auto", DA);
        wait(6);
        assertEquals(o.ticketSkills(t), l(n1), "on create");
        String p = o.ticket(PREFIX + "plain " + u, DA);
        wait(3);
        o.patchTicket(p, m("subject", PREFIX + "plain now " + m2));
        wait(6);
        assertEquals(o.ticketSkills(p), l(n2), "on update");
    }

    @Test(groups = {"regression", "api"}, description = "Recalculate removes a skill whose criteria no longer match")
    @CaseId("H-08")
    public void recalculate() {
        String t = o.ticket(m1 + " recalc", DA);
        wait(6);
        assertEquals(o.ticketSkills(t), l(n1), "precondition");
        o.patchTicket(t, m("subject", PREFIX + "renamed no skill " + u));
        wait(3);
        ok(o.post("/desk/tickets/" + t + "/skills/recalculate", m()), "recalculate");
        wait(3);
        assertEquals(o.ticketSkills(t), l(), "stale skill kept");
    }

    @Test(groups = {"regression", "api"}, description = "Ticket ⋯ › Assign by Skills assigns an unowned ticket to an agent holding its skill")
    @CaseId("H-09")
    public void assignBySkills() {
        String t = o.ticket(m2 + " assign by skills", DA);
        wait(6);
        assertEquals(o.ticketSkills(t), l(n2), "precondition: ticket has sk2");
        Response r = o.post("/desk/tickets/" + t + "/skills/assign", m()); // the app's assignBySkills()
        assertEquals(r.statusCode() / 100, 2, "assign by skills " + err(r));
        assertEquals(n(o.waitOwner(t, 15)), "A2", "not assigned to the sk2 holder");
    }

    @Test(groups = {"regression", "api"}, description = "Skill usage lists the round-robin rules that use the skill method")
    @CaseId("H-10")
    public void skillUsage() {
        String mk = mk("H10");
        String rule = skillRule(mk);
        String usage = ok(o.get("/desk/skills/" + sk1 + "/usage"), "usage").asString();
        assertTrue(usage.contains(rule) || usage.contains(mk), "usage does not list the skill rule: " + cut(usage, 300));
    }

    @Test(groups = {"regression", "api"}, description = "Limits: 11 skills on a ticket and a 31st active skill in a department are refused")
    @CaseId("H-11")
    public void limits() {
        for (int i = o.skills(DA).size(); i < 11; i++) o.createSkill(DA, PREFIX + "pad " + u + " " + i, type, true, contains(PREFIX + "PAD never " + u));
        List<String> names = o.skills(DA).stream().map(s -> (String) s.get("name")).limit(11).toList();
        String t = o.ticket(PREFIX + "limit " + u, DA);
        Response r = o.patchTicket(t, m("skills", names));
        assertEquals(names.size(), 11, "fewer than 11 skills exist in Dept A to try the ticket limit");
        assertEquals(r.statusCode() / 100, 4, "11 skills accepted: " + err(r));
        long active = o.skills(DA).stream().filter(s -> Boolean.TRUE.equals(s.get("is_active"))).count();
        Response last = null;
        for (long i = active; i < 31; i++) {
            last = o.createSkill(DA, PREFIX + "cap " + u + " " + i, type, true, contains(PREFIX + "CAP " + u + i));
            if (last.statusCode() / 100 != 2) break;
        }
        assertNotNull(last, "already 31+ active skills");
        assertEquals(last.statusCode() / 100, 4, "31st active skill accepted: " + err(last));
    }

    @Test(groups = {"regression", "api"}, description = "Skill type create, rename and delete")
    @CaseId("H-13")
    public void skillTypeLifecycle() {
        String id = o.skillType(DA, PREFIX + "Type2 " + u);
        Response ren = o.put("/desk/skill-types/" + id + "?department_id=" + DA, m("name", PREFIX + "Type2 renamed " + u));
        Response del = o.delete("/desk/skill-types/" + id + "?department_id=" + DA);
        assertEquals(ren.statusCode() / 100, 2, "rename " + err(ren));
        assertEquals(del.statusCode() / 100, 2, "delete " + err(del));
    }

    @Test(groups = {"smoke", "regression", "api"}, description = "Skill added by criteria and skill-based round robin in the same event: the agent holding the skill gets it")
    @CaseId({"H-12", "E-14a"})
    public void skillThenSkillRoundRobin() {
        String mk = mk("H12");
        skillRule(mk);
        String t2 = o.ticket(mk + " " + m2, DA), t1 = o.ticket(mk + " " + m1, DA);
        assertEquals(n(o.waitOwner(t2, 20)), "A2", "sk2 ticket");
        assertEquals(n(o.waitOwner(t1, 20)), "A1", "sk1 ticket");
    }

    @Test(groups = {"regression", "api", "NDC-2932"}, description = "Skill based: a ticket with no skills stays unassigned and is not backlog")
    @CaseId({"E-14b", "R-2932"})
    public void noSkillsUnassigned() {
        String mk = mk("E14b");
        skillRule(mk);
        String t = o.ticket(mk + " none", DA);
        wait(12);
        assertEquals(o.ticketSkills(t), l(), "precondition: no skills");
        assertNull(o.owner(t), "ticket without skills was assigned");
        assertFalse(o.inBacklog(t), "ticket without skills flagged as backlog");
    }

    @Test(groups = {"regression", "api", "NDC-2931"}, description = "Skill based: a ticket with two skills that nobody holds together goes to an agent with any of them")
    @CaseId({"E-14c", "R-2931"})
    public void anySkill() {
        String mk = mk("E14c");
        skillRule(mk);
        String t = o.ticket(mk + " " + m1 + " " + m2, DA);
        String w = o.waitOwner(t, 20);
        assertTrue(A1.equals(w) || A2.equals(w), "owner " + n(w) + " (skills " + o.ticketSkills(t) + ")");
    }
}
