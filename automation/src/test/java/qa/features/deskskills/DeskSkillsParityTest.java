package qa.features.deskskills;

import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskskills.DeskSkillsApi.*;

/**
 * Desk Skills parity vs Zoho Desk (run 12 Nov 2026, executions/execu_2026-11-12_desk-skills-parity/RESULTS.md).
 * API level, NDC-Staging. Each run builds its own "QA SKA <id>" department with agents A1 and A2 and removes
 * everything afterwards. Expected values are what Zoho Desk did live on 12 Nov; tests in group "parity-bug" fail
 * while TAVI differs from Zoho. Groups: smoke, regression, parity-bug (+ the Plane id once filed).
 */
public class DeskSkillsParityTest {
    private DeskSkillsApi api;
    private String dept;
    private String type;
    private final String run = uid();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskSkillsApi.owner();
        dept = api.department("QA SKA " + run, A1, A2);
        type = api.skillType(dept, "QA SKA T " + run);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[CLEANUP] left: " + api.cleanup());
    }

    private String name(String s) {
        return "QA SKA " + s + " " + run;
    }

    // ---------------- SK-B skill form validation ----------------

    @Test(groups = {"smoke", "regression"}, description = "Skill type is required (Zoho: skillTypeId missing)")
    @CaseId("SK-B01")
    public void typeRequired() {
        Response r = api.createSkill(dept, name("NoType"), null, true, subjectContains("x"));
        assertEquals(r.statusCode(), 400, r.asString());
        assertTrue(r.asString().contains("type_id"), "names the type field");
    }

    @Test(groups = "regression", description = "Duplicate skill name refused in any letter case (Zoho: same)")
    @CaseId("SK-B02")
    public void duplicateName() {
        api.skill(dept, name("Dup"), type, true, subjectContains("x"));
        assertEquals(api.createSkill(dept, name("Dup"), type, true, subjectContains("x")).statusCode(), 409);
        assertEquals(api.createSkill(dept, name("Dup").toLowerCase(), type, true, subjectContains("x")).statusCode(), 409);
    }

    @Test(groups = "regression", description = "Blank / spaces-only name refused")
    @CaseId("SK-B04")
    public void blankName() {
        assertEquals(api.createSkill(dept, "", type, true, subjectContains("x")).statusCode(), 400);
        assertEquals(api.createSkill(dept, "   ", type, true, subjectContains("x")).statusCode(), 400);
    }

    @Test(groups = "regression", description = "Name limit: TAVI 100 (Zoho 50 — TAVI extra), 101 refused")
    @CaseId("SK-B03")
    public void nameLength() {
        String base = "QA SKA " + run + " ";
        assertEquals(api.createSkill(dept, base + "L".repeat(100 - base.length()), type, false, null).statusCode(), 201, "100 chars");
        assertEquals(api.createSkill(dept, base + "M".repeat(101 - base.length()), type, false, null).statusCode(), 400, "101 chars");
    }

    // ---------------- SK-C skill types ----------------

    @Test(groups = "regression", description = "Skill types: duplicate refused, rename ok, delete refused while skills use it")
    @CaseId("SK-C01")
    public void skillTypes() {
        assertEquals(api.post("/desk/skill-types", Map.of("department_id", dept, "name", ("QA SKA T " + run).toUpperCase())).statusCode(), 409);
        String t = api.skillType(dept, "QA SKA T2 " + run);
        assertEquals(api.put("/desk/skill-types/" + t, Map.of("name", "QA SKA T2r " + run)).statusCode(), 200, "rename");
        api.skill(dept, name("UsesT2"), t, false, null);
        Response del = api.delete("/desk/skill-types/" + t);
        assertEquals(del.statusCode(), 409, del.asString());
    }

    // ---------------- SK-D limits / status ----------------

    @Test(groups = "regression", description = "30 active skills per department; inactive allowed beyond; activating the 31st refused")
    @CaseId("SK-D02")
    public void activeLimit() {
        long active = api.skills(dept).stream().filter(s -> Boolean.TRUE.equals(s.get("is_active"))).count();
        for (long i = active; i < 30; i++) api.skill(dept, name("Lim" + i), type, true, subjectContains("QASKALIM" + i));
        Response over = api.createSkill(dept, name("Lim31"), type, true, subjectContains("x"));
        assertEquals(over.statusCode(), 400, "31st active");
        assertTrue(over.asString().contains("SKILL_ACTIVE_LIMIT"));
        String inactive = api.skill(dept, name("LimInactive"), type, false, null);
        Map<String, Object> s = new java.util.LinkedHashMap<>(api.skillById(dept, inactive));
        s.put("is_active", true);
        assertEquals(api.put("/desk/skills/" + inactive, s).statusCode(), 400, "activate 31st");
        // leave room for other tests
        for (Map<String, Object> k : api.skills(dept))
            if (String.valueOf(k.get("name")).startsWith("QA SKA Lim") && Boolean.TRUE.equals(k.get("is_active"))) {
                Map<String, Object> off = new java.util.LinkedHashMap<>(k);
                off.put("is_active", false);
                api.put("/desk/skills/" + k.get("id"), off);
            }
    }

    // ---------------- SK-A order ----------------

    @Test(groups = "regression", description = "Reorder the whole list; a partial list is refused as stale")
    @CaseId("SK-A01")
    public void reorder() {
        String a = api.skill(dept, name("OrdA"), type, false, null);
        String b = api.skill(dept, name("OrdB"), type, false, null);
        List<String> ids = new ArrayList<>();
        for (Map<String, Object> s : api.skills(dept)) ids.add((String) s.get("id"));
        ids.remove(b);
        ids.add(0, b);
        assertEquals(api.put("/desk/skills/order?department_id=" + dept, Map.of("skill_ids", ids)).statusCode(), 200);
        assertEquals(api.skills(dept).get(0).get("id"), b, "first after reorder");
        assertEquals(api.put("/desk/skills/order?department_id=" + dept, Map.of("skill_ids", List.of(a))).statusCode(), 409, "partial list");
    }

    // ---------------- SK-F agents ----------------

    @Test(groups = "regression", description = "Agents on skill <-> agent's skills stay in step; agent outside the department refused")
    @CaseId("SK-F01")
    public void agentMapping() {
        String s = api.skill(dept, name("Map"), type, false, null);
        ok(api.put("/desk/skills/" + s + "/agents", Map.of("user_ids", List.of(A1))), "skill agents");
        assertEquals(api.skillById(dept, s).get("agent_ids"), List.of(A1));
        ok(api.put("/desk/agents/" + A2 + "/skills?department_id=" + dept, Map.of("skills", List.of(name("Map")))), "agent skills");
        assertTrue(((List<?>) api.skillById(dept, s).get("agent_ids")).containsAll(List.of(A2)), "A2 added from agent side");
        Response out = api.put("/desk/skills/" + s + "/agents", Map.of("user_ids", List.of(A1, A3)));
        assertEquals(out.statusCode(), 400, "A3 is not in the department");
    }

    // ---------------- SK-G ticket skills ----------------

    @Test(groups = {"smoke", "regression"}, description = "Auto-add on create follows list order (placement bottom); inactive never added")
    @CaseId("SK-G01")
    public void autoAddOrder() {
        api.preferences(dept, true, "bottom");
        api.skill(dept, name("G1a"), type, true, subjectContains("QASKAG1A"));
        api.skill(dept, name("G1b"), type, true, subjectContains("QASKAG1B"));
        api.skill(dept, name("G1off"), type, false, subjectContains("QASKAG1OFF"));
        String t = api.ticket(dept, "QA SKA G1 QASKAG1A QASKAG1B QASKAG1OFF " + run, null);
        sleep(7000);
        assertEquals(api.ticketSkills(t), List.of(name("G1a"), name("G1b")));
        api.preferences(dept, false, "bottom");
    }

    @Test(groups = {"regression", "parity-bug", "NDC-2933"}, description = "Inactive skill set by hand must not stay on the ticket (Zoho drops it)")
    @CaseId("SK-G02")
    public void manualInactiveDropped() {
        api.skill(dept, name("G2off"), type, false, null);
        String t = api.ticket(dept, "QA SKA G2 " + run, null);
        Response r = api.setTicketSkills(t, List.of(name("G2off")));
        sleep(3000);
        assertTrue(r.statusCode() / 100 == 4 || !api.ticketSkills(t).contains(name("G2off")),
                "inactive skill saved on ticket: " + api.ticketSkills(t));
    }

    @Test(groups = {"regression", "parity-bug", "NDC-2933"}, description = "Skill of another department must not stay on the ticket (Zoho drops it)")
    @CaseId("SK-G03")
    public void manualOtherDepartmentDropped() {
        String t = api.ticket(dept, "QA SKA G3 " + run, null);
        Response r = api.setTicketSkills(t, List.of(OTHER_DEPT_SKILL));
        sleep(3000);
        assertTrue(r.statusCode() / 100 == 4 || !api.ticketSkills(t).contains(OTHER_DEPT_SKILL),
                "other department's skill saved on ticket: " + api.ticketSkills(t));
    }

    @Test(groups = "regression", description = "At most 10 skills on a ticket (Zoho: 0-10)")
    @CaseId("SK-G05")
    public void tenPerTicket() {
        List<String> names = new ArrayList<>();
        for (int i = 0; i < 11; i++) {
            api.skill(dept, name("G5_" + i), type, i < 11, subjectContains("QASKAG5NONE" + i));
            names.add(name("G5_" + i));
        }
        String t = api.ticket(dept, "QA SKA G5 " + run, null);
        assertEquals(api.setTicketSkills(t, names.subList(0, 10)).statusCode(), 200, "10");
        assertEquals(api.setTicketSkills(t, names).statusCode(), 422, "11");
        for (String n : names) {
            Map<String, Object> s = api.skills(dept).stream().filter(k -> n.equals(k.get("name"))).findFirst().orElseThrow();
            Map<String, Object> off = new java.util.LinkedHashMap<>(s);
            off.put("is_active", false);
            api.put("/desk/skills/" + s.get("id"), off);
        }
    }

    @Test(groups = "regression", description = "Recalculate one ticket: adds matching, removes stale (Zoho: same)")
    @CaseId("SK-G09")
    public void recalculateOne() {
        api.skill(dept, name("G9match"), type, true, subjectContains("QASKAG9M"));
        api.skill(dept, name("G9stale"), type, true, subjectContains("QASKAG9NOMATCH"));
        String t = api.ticket(dept, "QA SKA G9 QASKAG9M " + run, null);
        ok(api.setTicketSkills(t, List.of(name("G9stale"))), "set stale");
        ok(api.post("/desk/tickets/" + t + "/skills/recalculate", Map.of()), "recalculate");
        sleep(4000);
        assertEquals(api.ticketSkills(t), List.of(name("G9match")));
    }

    // ---------------- SK-H skill-based assignment ----------------

    @Test(groups = {"regression", "parity-bug", "NDC-2931"}, description = "Skill RR: agent holding one of the ticket's skills gets it (Zoho #181 assigned)")
    @CaseId("SK-H02")
    public void anySkillAssigns() {
        api.allowOfflineAgents(dept);
        String have = api.skill(dept, name("H2have"), type, true, subjectContains("QASKAH2NONE"));
        api.skill(dept, name("H2lack"), type, true, subjectContains("QASKAH2NONE2"));
        ok(api.put("/desk/skills/" + have + "/agents", Map.of("user_ids", List.of(A1))), "A1 has H2have");
        api.skillRule(dept, name("RR H2"), "QASKAH2RR" + run, A1);
        String control = api.ticket(dept, "QA SKA H2 control QASKAH2RR" + run, List.of(name("H2have")));
        String t = api.ticket(dept, "QA SKA H2 QASKAH2RR" + run, List.of(name("H2lack"), name("H2have")));
        sleep(12000);
        if (!A1.equals(api.ticketOwner(control))) throw new org.testng.SkipException("INCONCLUSIVE: control ticket was not assigned");
        assertEquals(api.ticketOwner(t), A1, "agent with one of the two skills");
    }

    @Test(groups = {"regression", "parity-bug", "NDC-2932"}, description = "Skill RR leaves a ticket with no skills unassigned (Zoho #182)")
    @CaseId("SK-H03")
    public void noSkillsNotAssigned() {
        api.allowOfflineAgents(dept);
        String s = api.skill(dept, name("H3"), type, true, subjectContains("QASKAH3NONE"));
        ok(api.put("/desk/skills/" + s + "/agents", Map.of("user_ids", List.of(A1))), "A1 has H3");
        api.skillRule(dept, name("RR H3"), "QASKAH3RR" + run, A1);
        String control = api.ticket(dept, "QA SKA H3 control QASKAH3RR" + run, List.of(name("H3")));
        String t = api.ticket(dept, "QA SKA H3 QASKAH3RR" + run, List.of());
        sleep(12000);
        if (!A1.equals(api.ticketOwner(control))) throw new org.testng.SkipException("INCONCLUSIVE: control ticket was not assigned");
        assertNull(api.ticketOwner(t), "ticket without skills got an owner");
    }

    // ---------------- SK-K permissions ----------------

    @Test(groups = "regression", description = "Desk Agent without desk:assignment:manage cannot read or change skills")
    @CaseId("SK-K01")
    public void agentForbidden() {
        DeskSkillsApi agent = DeskSkillsApi.as(AGENT);
        assertEquals(agent.get("/desk/skills?department_id=" + dept).statusCode(), 403);
        assertEquals(agent.put("/desk/skill-preferences?department_id=" + dept, Map.of("auto_add", true, "placement", "bottom")).statusCode(), 403);
        assertEquals(agent.post("/desk/skills/recalculations", Map.of()).statusCode(), 403);
    }
}
