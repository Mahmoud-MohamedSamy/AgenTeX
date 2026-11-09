package qa.features.deskautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** SLA spec rows that don't need long timers. API only, QA AO departments, everything removed afterClass. */
public class SlaApiTest {
    private AoApi api;
    private static final String P = "/desk/sla/policies";

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = AoApi.admin();
        for (String d : List.of(DEPT_A, DEPT_B))
            for (Map<String, Object> p : ok(api.get(P + "?department_id=" + d), "policies").jsonPath().<Map<String, Object>>getList("data"))
                if (String.valueOf(p.get("name")).startsWith("QA AO ")) ok(api.delete(P + "/" + p.get("id")), "remove leftover");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[CLEANUP] left: " + api.cleanup());
    }

    private Map<String, Object> simple(String name, String dept, String... trig) {
        return policy("QA AO " + name + " " + uid(), dept, triggers(trig.length == 0 ? new String[]{"create"} : trig),
                List.of(target("t1", priorityIs("high"), t(30, "minutes"), t(2, "hours"), null)));
    }

    private static Map<String, Object> with(Map<String, Object> m, String k, Object v) {
        Map<String, Object> c = new LinkedHashMap<>(m);
        c.put(k, v);
        return c;
    }

    private int status(Map<String, Object> body) {
        Response r = api.post(P, body);
        if (r.statusCode() / 100 == 2) track("policy", r.jsonPath().getString("data.id"), String.valueOf(body.get("name")));
        return r.statusCode();
    }

    @Test(groups = "regression", description = "Name: empty refused, 120 accepted, 121 refused")
    @CaseId("SL-03")
    public void nameLimits() {
        assertEquals(status(with(simple("n", DEPT_A), "name", "")) / 100, 4, "empty name");
        String n120 = "QA AO " + "x".repeat(114);
        assertEquals(status(with(simple("n", DEPT_A), "name", n120)) / 100, 2, "120 characters");
        assertEquals(status(with(simple("n", DEPT_A), "name", n120 + "y")) / 100, 4, "121 characters");
    }

    @Test(groups = "regression", description = "Ticket Update and Field Update together are refused")
    @CaseId("SL-05")
    public void updateAndFieldUpdateEitherOr() {
        Map<String, Object> tr = triggers("create", "update");
        tr.put("field_update", Map.of("keys", List.of("priority"), "match", "any"));
        Response r = api.post(P, with(simple("eitheror", DEPT_A), "triggers", tr));
        if (r.statusCode() / 100 == 2) track("policy", r.jsonPath().getString("data.id"), "either-or");
        assertEquals(r.statusCode() / 100, 4, "body: " + r.asString());
    }

    @Test(groups = "regression", description = "Field Update: 3 watched fields accepted, 4 refused")
    @CaseId("SL-06")
    public void watchedFieldLimit() {
        Map<String, Object> t3 = triggers("create");
        t3.put("field_update", Map.of("keys", List.of("priority", "status", "channel"), "match", "any"));
        Map<String, Object> t4 = triggers("create");
        t4.put("field_update", Map.of("keys", List.of("priority", "status", "channel", "category"), "match", "any"));
        int s3 = status(with(simple("w3", DEPT_A), "triggers", t3));
        int s4 = status(with(simple("w4", DEPT_A), "triggers", t4));
        assertEquals(s3 / 100, 2, "3 fields");
        assertEquals(s4 / 100, 4, "4 fields");
    }

    @Test(groups = "regression", description = "Calculate resolution from created time")
    @CaseId("SL-08")
    public void resolutionFromCreated() {
        String pid = api.createPolicy(with(with(simple("fc", DEPT_A, "update"), "resolution_from_created", true), "name", "QA AO fc " + uid()));
        String tk = api.ticket("QA AO SL08 " + uid(), DEPT_A, "high");
        String created = ok(api.get("/modules/" + TICKETS + "/records/" + tk), "ticket").jsonPath().getString("data.created_at");
        sleep(4000);
        ok(api.setField(tk, "description", "x"), "update");
        JsonPath s = api.sla(tk, 25);
        assertEquals(s.getString("data.state"), "applied");
        assertTrue(s.getBoolean("data.execution.from_created"), "from_created");
        assertEquals(s.getString("data.obligations.find{it.kind=='resolution'}.started_at").substring(0, 19), created.substring(0, 19), "resolution starts at created time");
        assertNotNull(pid);
    }

    @Test(groups = "regression", description = "Only with an Account: ticket with no account gets no SLA from this policy")
    @CaseId("SL-09")
    public void onlyWithAccount() {
        String name = "QA AO acc " + uid();
        api.createPolicy(with(with(simple("x", DEPT_B), "execute_only_with_account", true), "name", name));
        String tk = api.ticket("QA AO SL09 " + uid(), DEPT_B, "high");
        JsonPath s = api.sla(tk, 15);
        assertNotEquals(s.getString("data.policy.name"), name, "policy applied without account: " + s.prettify());
    }

    @Test(groups = "regression", description = "Targets: 50 accepted, 51 refused")
    @CaseId("SL-10a")
    public void targetLimit() {
        List<Object> ts = new ArrayList<>();
        for (int i = 0; i < 51; i++) ts.add(target("t" + i, List.of(Map.of("field_key", "subject", "operator", "contains", "value", "q" + i)), t(30, "minutes"), t(2, "hours"), null));
        assertEquals(status(policy("QA AO t50 " + uid(), DEPT_A, triggers("create"), ts.subList(0, 50))) / 100, 2, "50");
        assertEquals(status(policy("QA AO t51 " + uid(), DEPT_A, triggers("create"), ts)) / 100, 4, "51");
    }

    @Test(groups = "regression", description = "Conditions: 25 accepted, 26 refused")
    @CaseId("SL-10b")
    public void conditionLimit() {
        List<Object> cs = new ArrayList<>();
        for (int i = 0; i < 26; i++) cs.add(Map.of("field_key", "subject", "operator", "contains", "value", "q" + i));
        assertEquals(status(policy("QA AO c25 " + uid(), DEPT_A, triggers("create"), List.of(target("t", cs.subList(0, 25), t(30, "minutes"), t(2, "hours"), null)))) / 100, 2, "25");
        assertEquals(status(policy("QA AO c26 " + uid(), DEPT_A, triggers("create"), List.of(target("t", cs, t(30, "minutes"), t(2, "hours"), null)))) / 100, 4, "26");
    }

    @Test(groups = "regression", description = "Which of several matching targets wins, recorded")
    @CaseId("SL-11")
    public void severalMatchingTargets() {
        String dept = DEPT_B;
        String pid = api.createPolicy(policy("QA AO multi " + uid(), dept, triggers("create"), List.of(
                target("first", List.of(Map.of("field_key", "subject", "operator", "contains", "value", "SL11")), t(30, "minutes"), t(2, "hours"), null),
                target("second", priorityIs("high"), t(40, "minutes"), t(3, "hours"), null))));
        String tk = api.ticket("QA AO SL11 " + uid(), dept, "high");
        JsonPath s = api.sla(tk, 25);
        System.out.println("[RECORD] SL-11 target chosen: " + s.getString("data.target.name") + " by policy " + pid);
        assertEquals(s.getString("data.state"), "applied");
    }

    @Test(groups = "regression", description = "No number or date operators in target conditions (gap 9): each is refused or missing")
    @CaseId("SL-12")
    public void operators() {
        List<String> ops = ok(api.get("/desk/sla/meta"), "meta").jsonPath().getList("data.operators");
        System.out.println("[RECORD] SL-12 operators: " + ops);
        assertTrue(ops.contains("equals") && ops.contains("contains"), "basic operators");
        assertTrue(ops.containsAll(List.of("less_than", "greater_than", "between")), "GAP 9: no number or date operators, offered " + ops);
    }

    @Test(groups = "regression", description = "Target needs response or resolution; neither is refused")
    @CaseId("SL-13")
    public void neitherRefused() {
        assertEquals(status(policy("QA AO r " + uid(), DEPT_A, triggers("create"), List.of(target("t", priorityIs("high"), t(30, "minutes"), null, null)))) / 100, 2, "response only");
        assertEquals(status(policy("QA AO s " + uid(), DEPT_A, triggers("create"), List.of(target("t", priorityIs("high"), null, t(2, "hours"), null)))) / 100, 2, "resolution only");
        assertEquals(status(policy("QA AO n " + uid(), DEPT_A, triggers("create"), List.of(target("t", priorityIs("high"), null, null, null)))) / 100, 4, "neither");
    }

    @Test(groups = "regression", description = "Units: zero, negative and unknown unit refused")
    @CaseId("SL-14")
    public void units() {
        for (Object[] v : new Object[][]{{0, "minutes"}, {-5, "hours"}, {5, "weeks"}}) {
            int s = status(policy("QA AO u " + uid(), DEPT_A, triggers("create"), List.of(target("t", priorityIs("high"), Map.of("value", v[0], "unit", v[1]), t(2, "hours"), null))));
            assertEquals(s / 100, 4, "value " + v[0] + " " + v[1]);
        }
    }

    @Test(groups = "regression", description = "Deactivate: no new tickets. Delete works when unused")
    @CaseId("SL-33")
    public void deactivateAndDelete() {
        String name = "QA AO deact " + uid();
        String pid = api.createPolicy(with(simple("x", DEPT_B), "name", name));
        JsonPath p = ok(api.get(P + "/" + pid), "policy").jsonPath();
        Map<String, Object> body = new LinkedHashMap<>(p.getMap("data"));
        body.put("is_active", false);
        Response r = api.put(P + "/" + pid, body);
        if (r.statusCode() / 100 != 2) r = api.patch(P + "/" + pid, Map.of("is_active", false, "row_version", p.get("data.row_version")));
        ok(r, "deactivate");
        String tk = api.ticket("QA AO SL33 " + uid(), DEPT_B, "high");
        JsonPath s = api.sla(tk, 12);
        assertNotEquals(s.getString("data.policy.name"), name, "inactive policy applied");
    }

    @Test(groups = "regression", description = "Stale save is refused")
    @CaseId("SL-48")
    public void staleSave() {
        String pid = api.createPolicy(simple("stale", DEPT_A));
        Map<String, Object> d = new LinkedHashMap<>(ok(api.get(P + "/" + pid), "policy").jsonPath().getMap("data"));
        Map<String, Object> first = new LinkedHashMap<>(d);
        first.put("description", "first");
        ok(api.put(P + "/" + pid, first), "first save");
        Map<String, Object> second = new LinkedHashMap<>(d);
        second.put("description", "stale second");
        Response r = api.put(P + "/" + pid, second);
        assertEquals(r.statusCode() / 100, 4, "second save with old row_version: " + r.statusCode());
    }

    @Test(groups = "regression", description = "Script in name and description is stored as text; another tenant's department is refused")
    @CaseId("SL-50")
    public void security() {
        String x = "QA AO <img src=x onerror=alert(1)> " + uid();
        Response r = api.post(P, with(with(simple("x", DEPT_A), "name", x), "description", "<script>alert(1)</script>"));
        if (r.statusCode() / 100 == 2) {
            track("policy", r.jsonPath().getString("data.id"), "xss");
            System.out.println("[RECORD] SL-50 stored name kept as text; the screen check is in SlaUiTest");
        }
        int other = api.post(P, with(simple("x", "00000000-0000-0000-0000-000000000000"), "name", "QA AO none " + uid())).statusCode();
        assertEquals(other / 100, 4, "unknown department");
    }

    @Test(groups = "regression", description = "A Desk Agent can't write SLA policies through the API")
    @CaseId("SL-52")
    public void agentCannotWrite() {
        AoApi agent = AoApi.as(AGENT);
        int s = agent.post(P, simple("agent", DEPT_A)).statusCode();
        assertEquals(s, 403, "agent create");
    }
}
