package qa.features.deskautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** SLA behaviour on real tickets, QA AO departments. Each test uses its own subject tag and removes what it made. */
public class SlaRuntimeTest {
    private AoApi api;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = AoApi.admin();
        api.delete("/modules/" + TICKETS + "/records/2fc4260e-92cc-493f-927b-7faeb6ed7bf9"); // setup probe ticket
        // Leftovers from setup or an interrupted run would match these tickets first.
        for (String d : List.of(DEPT_A, DEPT_B))
            for (Map<String, Object> p : ok(api.get("/desk/sla/policies?department_id=" + d), "policies").jsonPath().<Map<String, Object>>getList("data"))
                if (String.valueOf(p.get("name")).startsWith("QA AO ")) ok(api.delete("/desk/sla/policies/" + p.get("id")), "remove leftover");
    }

    @AfterMethod(alwaysRun = true)
    public void clean() {
        if (api != null) {
            List<String> left = api.cleanup();
            if (!left.isEmpty()) System.out.println("[CLEANUP] left: " + left);
        }
    }

    private static List<Map<String, Object>> tag(String t) {
        return List.of(Map.of("field_key", "subject", "operator", "contains", "value", t));
    }

    private String policyFor(String tag, Map<String, Object> trig, Map<String, Object> resp, Map<String, Object> res, Map<String, Object> esc, String dept) {
        return api.createPolicy(policy("QA AO " + tag, dept, trig, List.of(target("t " + tag, tag(tag), resp, res, esc))));
    }

    private static String obligation(JsonPath s, String kind, String field) {
        return s.getString("data.obligations.find{it.kind=='" + kind + "'}." + field);
    }

    private static Map<String, Object> level(String timing, Integer minutes, Map<String, Object> actions) {
        Map<String, Object> l = new LinkedHashMap<>();
        l.put("timing", timing);
        l.put("offset", minutes == null ? null : t(minutes, "minutes"));
        l.put("recipients", List.of(Map.of("kind", "ticket_owner")));
        l.put("template_ref", null);
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("assign_owner", null);
        a.put("assign_team", null);
        a.put("set_priority", null);
        if (actions != null) a.putAll(actions);
        l.put("actions", a);
        return l;
    }

    private String applied(String tk) {
        return api.sla(tk, 30).getString("data.state");
    }

    @Test(groups = "regression", description = "Create-only policy: applies on create, not on a later trigger only policy")
    @CaseId("SL-04a")
    public void triggerCreate() {
        String tag = "SL04a" + uid();
        policyFor(tag, triggers("create"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        assertEquals(applied(api.ticket("QA AO " + tag, DEPT_A, "high")), "applied");
    }

    @Test(groups = "regression", description = "Update-only policy: nothing on create; applies after an update")
    @CaseId("SL-04b")
    public void triggerUpdate() {
        String tag = "SL04b" + uid();
        String name = "QA AO " + tag;
        policyFor(tag, triggers("update"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket(name, DEPT_A, "high");
        JsonPath before = api.sla(tk, 10);
        assertNotEquals(before.getString("data.policy.name"), name, "applied on create");
        ok(api.setField(tk, "description", "qa"), "update");
        JsonPath after = api.sla(tk, 30);
        assertEquals(after.getString("data.policy.name"), name, "after update: " + after.getString("data"));
    }

    @Test(groups = "regression", description = "Field Update: another field does nothing; the watched field applies the policy")
    @CaseId("SL-04c")
    public void triggerFieldUpdate() {
        String tag = "SL04c" + uid();
        String name = "QA AO " + tag;
        Map<String, Object> tr = triggers();
        tr.put("field_update", Map.of("keys", List.of("priority"), "match", "any"));
        policyFor(tag, tr, t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket(name, DEPT_A, "low");
        ok(api.setField(tk, "description", "qa"), "other field");
        assertNotEquals(api.sla(tk, 10).getString("data.policy.name"), name, "fired on another field");
        ok(api.setField(tk, "priority", "high"), "priority");
        assertEquals(api.sla(tk, 30).getString("data.policy.name"), name, "after priority change");
    }

    @Test(groups = "regression", description = "Levels: 2 response and 4 resolution accepted; a 3rd and a 5th refused")
    @CaseId("SL-19a")
    public void levelLimits() {
        Map<String, Object> over = new LinkedHashMap<>();
        over.put("response", List.of(level("before", 5, null), level("at", null, null), level("after", 5, null)));
        over.put("resolution", List.of());
        Response r = api.post("/desk/sla/policies", policy("QA AO lv " + uid(), DEPT_A, triggers("create"), List.of(target("t", tag("zz" + uid()), t(30, "minutes"), t(2, "hours"), over))));
        if (r.statusCode() / 100 == 2) track("policy", r.jsonPath().getString("data.id"), "lv");
        assertEquals(r.statusCode() / 100, 4, "3 response levels");
        Map<String, Object> over2 = new LinkedHashMap<>();
        over2.put("response", List.of());
        over2.put("resolution", List.of(level("before", 5, null), level("at", null, null), level("after", 5, null), level("after", 10, null), level("after", 15, null)));
        Response r2 = api.post("/desk/sla/policies", policy("QA AO lv " + uid(), DEPT_A, triggers("create"), List.of(target("t", tag("zz" + uid()), t(30, "minutes"), t(2, "hours"), over2))));
        if (r2.statusCode() / 100 == 2) track("policy", r2.jsonPath().getString("data.id"), "lv");
        assertEquals(r2.statusCode() / 100, 4, "5 resolution levels");
    }

    @Test(groups = "regression", description = "All levels fire on real timers; action reassigns and sets priority; closed ticket stays quiet")
    @CaseId("SL-19")
    public void levelsFire() {
        String tag = "SL19" + uid();
        Map<String, Object> esc = new LinkedHashMap<>();
        esc.put("response", List.of(level("before", 1, null), level("at", null, null)));
        esc.put("resolution", List.of(level("before", 2, null), level("at", null, Map.of("assign_owner", A1, "set_priority", "urgent")), level("after", 1, null), level("after", 2, null)));
        policyFor(tag, triggers("create"), t(2, "minutes"), t(3, "minutes"), esc, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        String closed = api.ticket("QA AO " + tag + " closed", DEPT_A, "high");
        assertEquals(applied(tk), "applied");
        assertEquals(applied(closed), "applied");
        ok(api.post("/desk/tickets/" + closed + "/close", Map.of()), "close");
        long end = System.currentTimeMillis() + 7 * 60_000;
        JsonPath s = null;
        AoApi reader = api;
        do {
            sleep(15000);
            // The admin loses sight of a ticket assigned to an agent, so read as the new owner from then on.
            if (reader.get("/desk/tickets/" + tk + "/sla").statusCode() == 404) reader = AoApi.as("Test User 1");
            s = reader.sla(tk, 1);
            if ("4".equals(obligation(s, "resolution", "escalation_level_reached"))) break;
        } while (System.currentTimeMillis() < end);
        System.out.println("[RECORD] SL-19 obligations " + s.getString("data.obligations") + " violated=" + s.getString("data.violated"));
        assertEquals(obligation(s, "first_response", "escalation_level_reached"), "2", "response levels reached");
        assertEquals(obligation(s, "resolution", "escalation_level_reached"), "4", "resolution levels reached");
        assertTrue(s.getBoolean("data.violated"), "violated");
        JsonPath rec = ok(reader.get("/modules/" + TICKETS + "/records/" + tk), "ticket").jsonPath();
        String data = rec.getString("data.data");
        assertTrue(data.contains(A1), "SL-23: owner became A1");
        assertTrue(data.toLowerCase().contains("urgent"), "SL-23: priority urgent");
        JsonPath c = api.sla(closed, 1);
        System.out.println("[RECORD] SL-24 closed ticket " + c.getString("data.obligations"));
        assertEquals(obligation(c, "resolution", "escalation_level_reached"), "0", "SL-24: closed ticket escalated");
    }

    @Test(groups = "regression", description = "On Hold pauses; resume moves due by the held time; closing from hold records")
    @CaseId("SL-26")
    public void hold() {
        String tag = "SL26" + uid();
        policyFor(tag, triggers("create"), null, t(1, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        JsonPath s = api.sla(tk, 30);
        assertEquals(s.getString("data.state"), "applied");
        OffsetDateTime due = OffsetDateTime.parse(obligation(s, "resolution", "due_at"));
        ok(api.setField(tk, "status", "On Hold"), "hold");
        sleep(8000);
        JsonPath h = api.sla(tk, 1);
        System.out.println("[RECORD] SL-26 on hold " + h.getString("data.obligations"));
        assertNotNull(obligation(h, "resolution", "paused_at"), "paused_at");
        sleep(45000);
        ok(api.setField(tk, "status", "Open"), "resume");
        sleep(8000);
        JsonPath r = api.sla(tk, 1);
        OffsetDateTime due2 = OffsetDateTime.parse(obligation(r, "resolution", "due_at"));
        long moved = Duration.between(due, due2).toSeconds();
        System.out.println("[RECORD] SL-26 due moved by " + moved + " s");
        assertTrue(moved >= 40 && moved <= 90, "due moved by the held time, got " + moved + " s");
        assertEquals(obligation(r, "resolution", "state"), "running");
    }

    @Test(groups = "regression", description = "Close from On Hold ends the obligation; record its state")
    @CaseId("SL-28")
    public void closeFromHold() {
        String tag = "SL28" + uid();
        policyFor(tag, triggers("create"), null, t(1, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(applied(tk), "applied");
        ok(api.setField(tk, "status", "On Hold"), "hold");
        sleep(5000);
        ok(api.post("/desk/tickets/" + tk + "/close", Map.of()), "close");
        sleep(5000);
        JsonPath s = api.sla(tk, 1);
        System.out.println("[RECORD] SL-28 " + s.getString("data.obligations"));
        assertNotEquals(obligation(s, "resolution", "state"), "running");
    }

    @Test(groups = {"regression", "NDC-2825"}, description = "NDC-2825: Create + Update SLA restarts when Priority is changed a minute later (response and resolution due move to the update time)")
    @CaseId("SL-30b")
    public void resetOnPriorityUpdate() {
        String tag = "SL30b" + uid();
        policyFor(tag, triggers("create", "update"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        JsonPath a = api.sla(tk, 30);
        assertEquals(a.getString("data.state"), "applied");
        sleep(60000);
        OffsetDateTime updatedAt = OffsetDateTime.now();
        ok(api.setField(tk, "priority", "medium"), "priority");
        sleep(25000);
        JsonPath b = api.sla(tk, 1);
        System.out.println("[RECORD] NDC-2825 execution " + a.getString("data.execution.number") + " -> " + b.getString("data.execution.number")
                + " trigger " + b.getString("data.execution.trigger")
                + " response " + obligation(a, "first_response", "due_at") + " -> " + obligation(b, "first_response", "due_at")
                + " resolution " + obligation(a, "resolution", "due_at") + " -> " + obligation(b, "resolution", "due_at") + " ticket " + tk);
        assertTrue(b.getInt("data.execution.number") > a.getInt("data.execution.number"), "new execution after the update");
        OffsetDateTime resp = OffsetDateTime.parse(obligation(b, "first_response", "due_at")), res = OffsetDateTime.parse(obligation(b, "resolution", "due_at"));
        assertTrue(Math.abs(Duration.between(updatedAt.plusMinutes(30), resp).getSeconds()) < 120, "response due counted from the update: " + resp);
        assertTrue(Math.abs(Duration.between(updatedAt.plusHours(2), res).getSeconds()) < 120, "resolution due counted from the update: " + res);
    }

    @Test(groups = {"regression", "NDC-2825"}, description = "A selected trigger resets the SLA: new execution, times restart")
    @CaseId("SL-30")
    public void resetOnTrigger() {
        String tag = "SL30" + uid();
        policyFor(tag, triggers("create", "update"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        JsonPath a = api.sla(tk, 30);
        assertEquals(a.getString("data.state"), "applied");
        sleep(5000);
        ok(api.setField(tk, "description", "qa"), "update");
        sleep(25000);
        JsonPath b = api.sla(tk, 1);
        System.out.println("[RECORD] SL-30 execution " + a.getString("data.execution.number") + " -> " + b.getString("data.execution.number") + " trigger " + b.getString("data.execution.trigger") + " due " + obligation(a, "resolution", "due_at") + " -> " + obligation(b, "resolution", "due_at"));
        assertTrue(b.getInt("data.execution.number") > a.getInt("data.execution.number"), "new execution");
        assertTrue(OffsetDateTime.parse(obligation(b, "resolution", "due_at")).isAfter(OffsetDateTime.parse(obligation(a, "resolution", "due_at"))), "due moved");
    }

    @Test(groups = "regression", description = "Reapply from the ticket")
    @CaseId("SL-66")
    public void reapplyFromTicket() {
        String tag = "SL66" + uid();
        policyFor(tag, triggers("create"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        JsonPath a = api.sla(tk, 30);
        assertTrue(a.getBoolean("data.can_reapply"));
        sleep(3000);
        ok(api.post("/desk/tickets/" + tk + "/sla/reapply", Map.of()), "reapply");
        sleep(6000);
        JsonPath b = api.sla(tk, 1);
        assertTrue(b.getInt("data.execution.number") > a.getInt("data.execution.number"), "new execution after reapply");
    }

    @Test(groups = "regression", description = "Editing a policy leaves running tickets on the targets they started with")
    @CaseId("SL-32")
    public void editKeepsRunning() {
        String tag = "SL32" + uid();
        String pid = policyFor(tag, triggers("create"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        JsonPath a = api.sla(tk, 30);
        Map<String, Object> p = new LinkedHashMap<>(ok(api.get("/desk/sla/policies/" + pid), "policy").jsonPath().getMap("data"));
        List<Map<String, Object>> ts = (List<Map<String, Object>>) p.get("targets");
        ts.get(0).put("resolution", t(9, "hours"));
        ok(api.put("/desk/sla/policies/" + pid, p), "edit");
        sleep(6000);
        assertEquals(obligation(api.sla(tk, 1), "resolution", "due_at"), obligation(a, "resolution", "due_at"), "running ticket kept its due time");
    }

    @Test(groups = "regression", description = "Move department: old SLA stops, new department's policy applies")
    @CaseId("SL-41")
    public void moveDepartment() {
        String tag = "SL41" + uid();
        policyFor(tag, triggers("create"), t(30, "minutes"), t(2, "hours"), null, DEPT_A);
        String nameB = api.createPolicy(policy("QA AO B " + tag, DEPT_B, triggers("create", "update"), List.of(target("b", tag(tag), t(45, "minutes"), t(5, "hours"), null))));
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(applied(tk), "applied");
        Map<String, Object> mv = new LinkedHashMap<>();
        mv.put("department_id", DEPT_B);
        mv.put("owner_id", null);
        mv.put("team_id", null);
        ok(api.post("/desk/tickets/" + tk + "/move", mv), "move");
        sleep(10000);
        JsonPath s = api.sla(tk, 1);
        System.out.println("[RECORD] SL-41 after move policy=" + s.getString("data.policy.name") + " state=" + s.getString("data.state") + " " + s.getString("data.obligations"));
        assertEquals(s.getString("data.policy.name"), "QA AO B " + tag, "new department's policy, id " + nameB);
    }

    @Test(groups = "regression", description = "Closed means resolved: resolution met on close")
    @CaseId("SL-45")
    public void closedResolves() {
        String tag = "SL45" + uid();
        policyFor(tag, triggers("create"), null, t(1, "hours"), null, DEPT_A);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(applied(tk), "applied");
        ok(api.post("/desk/tickets/" + tk + "/close", Map.of()), "close");
        sleep(6000);
        assertNotNull(obligation(api.sla(tk, 1), "resolution", "met_at"), "met_at set on close");
    }

    @Test(groups = "regression", description = "Earlier bug B-1: record API returned 500 when kind is not the first key")
    @CaseId("WF-B1")
    public void kindOrder() {
        String tag = "B1" + uid();
        String tk = api.ticket("QA AO " + tag, DEPT_B, "low");
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("value", "x");
        value.put("kind", "string");
        Response r = api.patch("/modules/" + TICKETS + "/records/" + tk, Map.of("data", List.of(Map.of("field", "description", "value", value))));
        assertNotEquals(r.statusCode(), 500, "body: " + r.asString());
    }
}
