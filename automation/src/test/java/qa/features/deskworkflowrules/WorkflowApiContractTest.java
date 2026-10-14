package qa.features.deskworkflowrules;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.config.Config;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertTrue;
import static qa.features.deskworkflowrules.Rules.oneOf;
import static qa.features.deskworkflowrules.Rules.s;

/**
 * Spec §2.1 API contract for the important endpoints: rules CRUD, activate/deactivate, reorder, evaluate / execute,
 * saved actions, executions, auth. Invalid bodies must be refused with a 4xx (never 500, never stored).
 * All rules here are created INACTIVE unless the case needs them active, so nothing fires on other tickets.
 * Run: mvnw test -Dtest=WorkflowApiContractTest
 */
public class WorkflowApiContractTest extends BaseTest {
    private DeskWorkflowRulesApi api;
    private final List<String> ticketsToDelete = new ArrayList<>();

    @BeforeMethod(alwaysRun = true)
    public void prepare() {
        new WorkflowRulesListPage().openForApi();
        api = new DeskWorkflowRulesApi().requireAuth();
    }

    @AfterMethod(alwaysRun = true)
    public void cleanUp() {
        if (api == null) return;
        try {
            api.deleteRulesNamed(DeskWorkflowRulesFeature.QA + "API");
            api.deleteActionsNamed(DeskWorkflowRulesFeature.QA + "API");
            for (String t : ticketsToDelete) api.deleteTicket(t);
            ticketsToDelete.clear();
            api.restorePaused();
        } catch (RuntimeException e) {
            System.err.println("[cleanup] " + e.getMessage());
        }
    }

    private static Rules r(String label) {
        return Rules.named("API " + label).inactive();
    }

    /** An invalid body must be refused with a 4xx and must not create anything. */
    private void assertRefused(Response resp, String what) {
        int sc = resp.statusCode();
        assertTrue(sc >= 400 && sc < 500, what + ": expected a 4xx validation error, got " + sc + " " + body(resp));
    }

    private static String body(Response r) {
        String s = r.asString();
        return s.length() > 600 ? s.substring(0, 600) + "…" : s;
    }

    private Map<String, Object> data(Response r) {
        return DeskWorkflowRulesApi.ok(r, "read").jsonPath().getMap("data");
    }

    // ---------------- auth ----------------

    @Test(groups = {"regression", "api"}, description = "No / bad bearer token → 401, no data")
    @CaseId("WFR-A11")
    public void noTokenIs401() {
        String base = Config.get("api.baseUrl", Config.baseUrl() + "/api/v1");
        for (String auth : new String[]{null, "Bearer x.y.z", "Bearer "}) {
            var req = RestAssured.given().baseUri(base).contentType(ContentType.JSON).header("x-app-key", "desk").relaxedHTTPSValidation();
            if (auth != null) req.header("Authorization", auth);
            for (String p : new String[]{"/workflow/rules", "/workflow/actions", "/workflow/executions"}) {
                Response resp = req.get(p);
                assertEquals(resp.statusCode(), 401, "GET " + p + " with auth=" + auth + ": " + body(resp));
                assertFalse(resp.asString().contains("\"moduleId\""), "data leaked without a valid token on " + p);
            }
        }
    }

    @Test(groups = {"regression", "api"}, description = "Desk app key returns only Desk rules")
    @CaseId("WFR-A9")
    public void onlyDeskRules() {
        for (Map<String, Object> rule : api.ruleList())
            assertEquals(rule.get("appKey"), "desk", "rule '" + rule.get("name") + "' from another app returned with x-app-key: desk");
    }

    // ---------------- rules CRUD ----------------

    @Test(groups = {"regression", "api"}, description = "POST a rule, GET returns what was sent")
    @CaseId("WFR-G1")
    public void createAndReadBack() {
        Map<String, Object> sent = r("G1 round trip").onFieldChanged("priority").where(oneOf("priority", "high", "urgent"))
                .description("QA WF desc").fieldUpdate("description", "QA WF ${subject}").build();
        String id = api.createRuleOk(sent);
        Map<String, Object> got = data(api.rule(id));
        assertEquals(got.get("name"), sent.get("name"));
        assertEquals(got.get("description"), "QA WF desc");
        assertEquals(((Map<?, ?>) got.get("trigger")).get("kind"), "SpecificFieldChanged");
        assertEquals(((Map<?, ?>) got.get("trigger")).get("fieldName"), "priority");
        assertEquals(got.get("isActive"), false);
        assertEquals(((List<?>) got.get("actions")).size(), 1);
        assertNotNull(got.get("version"), "GET should expose version for conflict detection");
    }

    @Test(groups = {"regression", "api"}, description = "PATCH with only a name changes the name and keeps actions / trigger")
    @CaseId("WFR-G7")
    public void partialPatchKeepsTheRest() {
        String id = api.createRuleOk(r("G7 partial").onEdit().fieldUpdate("description", "QA WF keep").build());
        Response p = api.patchRule(id, Map.of("name", "QA WF API G7 renamed"));
        Map<String, Object> got = data(api.rule(id));
        if (p.statusCode() / 100 == 2) {
            assertEquals(got.get("name"), "QA WF API G7 renamed");
            assertEquals(((List<?>) got.get("actions")).size(), 1, "PATCH {name} wiped the actions: " + got.get("actions"));
            assertEquals(((Map<?, ?>) got.get("trigger")).get("kind"), "RecordUpdated", "PATCH {name} changed the trigger");
        } else {
            assertRefused(p, "PATCH {name} only");
            assertEquals(((List<?>) got.get("actions")).size(), 1, "refused PATCH still changed the rule");
        }
    }

    @Test(groups = {"regression", "api"}, description = "Activate / deactivate change isActive")
    @CaseId("WFR-B8")
    public void activateDeactivate() {
        String id = api.createRuleOk(r("B8 toggle").onEdit().fieldUpdate("description", "x").build());
        DeskWorkflowRulesApi.ok(api.activate(id), "activate");
        assertEquals(data(api.rule(id)).get("isActive"), true);
        DeskWorkflowRulesApi.ok(api.deactivate(id), "deactivate");
        assertEquals(data(api.rule(id)).get("isActive"), false);
    }

    @Test(groups = {"regression", "api"}, description = "DELETE removes the rule from GET and the list")
    @CaseId("WFR-B9")
    public void deleteRule() {
        String id = api.createRuleOk(r("B9 delete").onEdit().fieldUpdate("description", "x").build());
        DeskWorkflowRulesApi.ok(api.deleteRule(id), "delete");
        assertEquals(api.rule(id).statusCode(), 404, "deleted rule still readable");
        assertFalse(api.ruleList().stream().anyMatch(x -> id.equals(x.get("id"))), "deleted rule still listed");
    }

    @Test(groups = {"regression", "api"}, description = "Reorder sets the positions in the order sent")
    @CaseId("WFR-B13")
    public void reorder() {
        String a = api.createRuleOk(r("B13 a").onEdit().fieldUpdate("description", "a").build());
        String b = api.createRuleOk(r("B13 b").onEdit().fieldUpdate("description", "b").build());
        List<String> all = new ArrayList<>(api.ruleList().stream().filter(x -> DeskWorkflowRulesApi.TICKETS.equals(x.get("moduleId")))
                .sorted((x, y) -> Integer.compare(((Number) x.get("position")).intValue(), ((Number) y.get("position")).intValue()))
                .map(x -> String.valueOf(x.get("id"))).toList());
        all.remove(a);
        all.remove(b);
        List<String> order = new ArrayList<>(List.of(b, a));
        order.addAll(all);
        DeskWorkflowRulesApi.ok(api.reorder(DeskWorkflowRulesApi.TICKETS, order), "reorder");
        int pa = ((Number) data(api.rule(a)).get("position")).intValue(), pb = ((Number) data(api.rule(b)).get("position")).intValue();
        assertTrue(pb < pa, "b should come before a after reorder; positions b=" + pb + " a=" + pa);
    }

    // ---------------- validation (G8, D, E, F) ----------------

    @Test(groups = {"regression", "api"}, description = "Invalid rule bodies are refused with 4xx (never 500) and not stored")
    @CaseId("WFR-G8")
    public void invalidBodiesRefused() {
        Map<String, Map<String, Object>> cases = new LinkedHashMap<>();
        cases.put("no actions", r("G8 no actions").onCreate().build());
        Map<String, Object> m = r("G8 actions object").onCreate().fieldUpdate("description", "x").build();
        m.put("actions", Map.of());
        cases.put("actions is an object", m);
        cases.put("unknown trigger kind", r("G8 bogus trigger").trigger("Bogus").fieldUpdate("description", "x").build());
        cases.put("score trigger (Phase 5)", r("G8 score").trigger("ScoreThreshold").fieldUpdate("description", "x").build());
        cases.put("unknown action type", r("G8 unknown action").onCreate().rawAction(Map.of("type", "Explode", "order", 0)).build());
        cases.put("CustomFunction (Phase 4)", r("G8 custom fn").onCreate().rawAction(Map.of("type", "CustomFunction", "order", 0,
                "functionName", "x", "delaySeconds", 0)).build());
        Map<String, Object> noModule = r("G8 no module").onCreate().fieldUpdate("description", "x").build();
        noModule.remove("moduleId");
        cases.put("no moduleId", noModule);
        Map<String, Object> noName = r("G8 no name").onCreate().fieldUpdate("description", "x").build();
        noName.put("name", "   ");
        cases.put("blank name", noName);
        cases.put("Field Changed without field", r("G8 fc no field").trigger("SpecificFieldChanged").fieldUpdate("description", "x").build());
        cases.put("Remove Tags on Delete trigger", r("G8 remove tags on delete").onDelete().removeTags("00000000-0000-0000-0000-000000000000").build());
        cases.put("Email without recipients", r("G8 email no rcpt").onCreate().email(List.of(), "introduction", null, null).build());
        cases.put("Owner without target", r("G8 owner none").onCreate().owner("SpecificUser", "").build());
        List<String> problems = new ArrayList<>();
        for (var e : cases.entrySet()) {
            Response resp = api.createRule(e.getValue());
            int sc = resp.statusCode();
            if (!(sc >= 400 && sc < 500)) problems.add(e.getKey() + " → " + sc + " " + body(resp).substring(0, Math.min(200, body(resp).length())));
        }
        assertTrue(problems.isEmpty(), "invalid bodies not refused with a 4xx:\n" + String.join("\n", problems));
    }

    @Test(groups = {"regression", "api"}, description = "More than 10 actions is refused")
    @CaseId("WFR-F4")
    public void elevenActionsRefused() {
        Rules x = r("F4 eleven actions").onCreate();
        for (int i = 0; i < 11; i++) x.rawAction(Map.of("type", "Task", "order", i, "delaySeconds", 0, "taskTitle", "QA WF t" + i));
        assertRefused(api.createRule(x.build()), "11 actions");
    }

    @Test(groups = {"regression", "api"}, description = "More than 25 conditions is refused")
    @CaseId("WFR-E11")
    public void twentySixConditionsRefused() {
        List<Map<String, Object>> ops = new ArrayList<>();
        for (int i = 0; i < 26; i++) ops.add(Rules.contains("subject", "c" + i));
        Map<String, Object> body = r("E11 26 conditions").unguarded().onCreate().fieldUpdate("description", "x").build();
        body.put("criteria", Rules.kinded("kind", "Logical", "operator", "And", "operands", ops));
        assertRefused(api.createRule(body), "26 conditions");
    }

    @Test(groups = {"regression", "api"}, description = "Field Update on read-only / system fields is refused")
    @CaseId("WFR-F7")
    public void fieldUpdateReadOnlyRefused() {
        List<String> problems = new ArrayList<>();
        for (String f : new String[]{"ticket_number", "created_time", "created_by", "approval_status"}) {
            Response resp = api.createRule(r("F7 " + f).onCreate().fieldUpdate(f, "1").build());
            if (resp.statusCode() / 100 == 2) problems.add(f + " accepted");
        }
        assertTrue(problems.isEmpty(), "Field Update on read-only fields accepted (cf. CRM bug NDC-1437): " + problems);
    }

    @Test(groups = {"regression", "api"}, description = "Two identical actions are refused (UI: 'Two actions are identical')")
    @CaseId("WFR-F19")
    public void duplicateActionsRefused() {
        Map<String, Object> body = r("F19 duplicate").onCreate().fieldUpdate("description", "same").fieldUpdate("description", "same").build();
        assertRefused(api.createRule(body), "two identical Field Update actions");
    }

    @Test(groups = {"regression", "api"}, description = "API-only criteria kinds (ChangedFrom/To, NotContains, Between): accepted rules must read back")
    @CaseId("WFR-E16")
    public void apiOnlyCriteriaKinds() {
        List<String> notes = new ArrayList<>();
        Map<String, Map<String, Object>> kinds = Map.of(
                "ChangedTo", Rules.kinded("kind", "ChangedTo", "field", "priority", "value", s("urgent")),
                "ChangedFrom", Rules.kinded("kind", "ChangedFrom", "field", "priority", "value", s("low")),
                "NotContains", Rules.kinded("kind", "NotContains", "field", "subject", "stringValue", "x", "caseInsensitive", false));
        for (var k : kinds.entrySet()) {
            Map<String, Object> body = r("E16 " + k.getKey()).onEdit().where(k.getValue()).fieldUpdate("description", "x").build();
            Response resp = api.createRule(body);
            if (resp.statusCode() / 100 == 2) {
                Response back = api.rule(resp.jsonPath().getString("data.id"));
                assertEquals(back.statusCode(), 200, k.getKey() + " rule stored but cannot be read back: " + body(back));
                notes.add(k.getKey() + " accepted");
            } else {
                assertTrue(resp.statusCode() / 100 == 4, k.getKey() + " → " + resp.statusCode() + " (expected 2xx or 4xx) " + body(resp));
                notes.add(k.getKey() + " refused " + resp.statusCode());
            }
        }
        System.out.println("[E16] " + notes);
    }

    @Test(groups = {"regression", "api", "NDC-2206"}, description = "A Date-Time rule (5 minutes before Due Date) can be saved")
    @CaseId("WFR-D7")
    public void dateTimeRuleSaves() {
        Response resp = api.createRule(r("D7 date-time").onDate("due_date", -300, "wall_clock")
                .task("QA WF due soon ${subject}", 1, "Not Started", "high").build()); // date rules take async actions only
        assertTrue(resp.statusCode() / 100 == 2, "NDC-2206: saving a Date-Time rule failed: " + resp.statusCode() + " " + body(resp));
        Map<?, ?> t = (Map<?, ?>) data(api.rule(resp.jsonPath().getString("data.id"))).get("trigger");
        assertEquals(((Number) t.get("offsetSeconds")).longValue(), -300L);
        assertEquals(t.get("dateFieldName"), "due_date");
    }

    @Test(groups = {"regression", "api"}, description = "Creating a ticket without a department is a 4xx validation error, not a 500")
    @CaseId("WFR-API-T1")
    public void ticketWithoutDepartmentIsNot500() {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + "API T1 no department");
        f.put("status", "Open");
        f.put("priority", "low");
        f.put("email", "qa.workflow@qa.test");
        Response resp = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records", Map.of("data", DeskWorkflowRulesApi.recordData(f)));
        if (resp.statusCode() / 100 == 2) ticketsToDelete.add(resp.jsonPath().getString("data.id"));
        assertTrue(resp.statusCode() / 100 != 5, "server error instead of a validation message: " + resp.statusCode() + " " + body(resp));
    }

    @Test(groups = {"regression", "api"}, description = "JSON key order does not matter: a value with \"kind\" after \"value\" is accepted, not a 500")
    @CaseId("WFR-API-T3")
    public void kindNotFirstIsNot500() {
        String json = "{\"data\":["
                + "{\"field\":\"subject\",\"value\":{\"value\":\"" + DeskWorkflowRulesFeature.QA + "API T3 kind last\",\"kind\":\"string\"}},"
                + "{\"field\":\"department\",\"value\":{\"kind\":\"string\",\"value\":\"" + DeskWorkflowRulesFeature.QA_DEPARTMENT_ID + "\"}},"
                + "{\"field\":\"email\",\"value\":{\"kind\":\"string\",\"value\":\"qa.workflow@qa.test\"}},"
                + "{\"field\":\"status\",\"value\":{\"kind\":\"string\",\"value\":\"Open\"}},"
                + "{\"field\":\"priority\",\"value\":{\"kind\":\"string\",\"value\":\"low\"}}],"
                + "\"layout_id\":\"" + DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID + "\"}";
        Response resp = api.req().body(json).post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records");
        if (resp.statusCode() / 100 == 2) ticketsToDelete.add(resp.jsonPath().getString("data.id"));
        assertTrue(resp.statusCode() / 100 == 2, "same ticket with \"kind\" as the 2nd key of the subject value: " + resp.statusCode() + " " + body(resp));
    }

    @Test(groups = {"regression", "api"}, description = "Creating a ticket with a Description is accepted (not a 500)")
    @CaseId("WFR-API-T2")
    public void ticketWithDescriptionIsNot500() {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + "API T2 with description");
        f.put("department", DeskWorkflowRulesFeature.DEFAULT_DEPARTMENT_ID);
        f.put("status", "Open");
        f.put("priority", "low");
        f.put("email", "qa.workflow@qa.test");
        f.put("description", "QA WF plain description");
        Response resp = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records", Map.of("data", DeskWorkflowRulesApi.recordData(f)));
        if (resp.statusCode() / 100 == 2) ticketsToDelete.add(resp.jsonPath().getString("data.id"));
        assertTrue(resp.statusCode() / 100 == 2, "ticket with a plain-text description refused: " + resp.statusCode() + " " + body(resp));
    }

    // ---------------- evaluate / execute ----------------

    @Test(groups = {"regression", "api"}, description = "Evaluate a draft: answers matched / not matched and stores nothing")
    @CaseId("WFR-L4")
    public void evaluateDraftStoresNothing() {
        int before = api.ruleList().size();
        Map<String, Object> draft = r("L4 draft").onCreate().where(oneOf("priority", "high")).fieldUpdate("description", "x").build();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("rule", draft);
        body.put("triggerKind", "RecordCreated");
        body.put("fieldValues", Map.of("subject", s("QA WF eval"), "priority", s("high")));
        Response resp = api.evaluate(body);
        System.out.println("[L4] " + resp.statusCode() + " " + body(resp));
        assertTrue(resp.statusCode() / 100 == 2 || resp.statusCode() / 100 == 4, "evaluate crashed: " + resp.statusCode() + " " + body(resp));
        assertEquals(api.ruleList().size(), before, "evaluate stored a rule");
    }

    @Test(groups = {"regression", "api"}, description = "Execute (test) a rule against an unknown record: clear 4xx, nothing leaked")
    @CaseId("WFR-L5")
    public void executeUnknownRecord() {
        String id = api.createRuleOk(r("L5 exec").onCreate().fieldUpdate("description", "x").build());
        Response resp = api.execute(id, Map.of("sampleRecordId", "00000000-0000-0000-0000-000000000000", "triggerKind", "RecordCreated"));
        System.out.println("[L5] " + resp.statusCode() + " " + body(resp));
        assertTrue(resp.statusCode() / 100 != 5, "execute with an unknown record crashed: " + resp.statusCode() + " " + body(resp));
    }

    // ---------------- executions ----------------

    @Test(groups = {"regression", "api"}, description = "Executions filter by ruleId returns only that rule's runs")
    @CaseId("WFR-M3")
    public void executionsFilterByRule() {
        List<Map<String, Object>> all = DeskWorkflowRulesApi.ok(api.get("/workflow/executions?take=50"), "executions").jsonPath().getList("data");
        if (all.isEmpty()) throw new org.testng.SkipException("no executions on the tenant yet");
        String ruleId = String.valueOf(all.stream().filter(e -> e.get("ruleId") != null).findFirst().orElseThrow().get("ruleId"));
        List<Map<String, Object>> f = DeskWorkflowRulesApi.ok(api.get("/workflow/executions?ruleId=" + ruleId + "&take=50"), "filtered").jsonPath().getList("data");
        assertFalse(f.isEmpty(), "filter returned nothing for a rule that has runs");
        for (Map<String, Object> e : f) assertEquals(e.get("ruleId"), ruleId, "filter returned another rule's run");
        Response one = api.get("/workflow/executions/" + f.get(0).get("id"));
        assertEquals(one.statusCode(), 200, "execution detail: " + body(one));
        Response missing = api.get("/workflow/executions/00000000-0000-0000-0000-000000000000");
        assertEquals(missing.statusCode(), 404, "unknown execution id: " + body(missing));
    }

    // ---------------- saved actions ----------------

    /** Saved-action body as the Actions page sends it: {moduleId, name, description, isActive, action:{type, order, ...}}. */
    private static Map<String, Object> savedTask(String name, String moduleId, String title) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", "Task");
        a.put("order", 0);
        a.put("delaySeconds", 0);
        a.put("taskTitle", title);
        a.put("taskDueOffsetDays", 1);
        a.put("taskNotifyAssignee", false);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("moduleId", moduleId);
        body.put("name", name);
        body.put("isActive", true);
        body.put("action", a);
        return body;
    }

    @Test(groups = {"regression", "api"}, description = "Saved action: create, use in a rule, usage lists the rule, delete-in-use handled")
    @CaseId({"WFR-K3", "WFR-K6", "WFR-K7"})
    public void savedActionLifecycle() {
        Response c = api.createAction(savedTask("QA WF API K3 task", DeskWorkflowRulesApi.TICKETS, "QA WF saved task"));
        assertTrue(c.statusCode() / 100 == 2, "create saved action: " + c.statusCode() + " " + body(c));
        String aid = c.jsonPath().getString("data.id");
        String rid = api.createRuleOk(r("K6 uses saved").onCreate().saved("Task", aid).build());
        Response u = DeskWorkflowRulesApi.ok(api.actionUsage(aid), "usage");
        assertTrue(u.asString().contains(rid), "usage does not list the rule " + rid + ": " + body(u));
        Response d = api.deleteAction(aid);
        if (d.statusCode() / 100 == 2) {
            // deleted while in use: the rule must still read back (editor shows "no longer exists")
            assertEquals(api.rule(rid).statusCode(), 200, "rule broken after its saved action was deleted");
            System.out.println("[K7] saved action in use was DELETED (" + d.statusCode() + ")");
        } else {
            assertRefused(d, "delete in-use saved action");
            System.out.println("[K7] delete in use refused: " + body(d));
        }
    }

    @Test(groups = {"regression", "api"}, description = "A saved action of another module cannot be used in a Tickets rule")
    @CaseId("WFR-K9")
    public void savedActionOtherModuleRefused() {
        Response c = api.createAction(savedTask("QA WF API K9 calls task", DeskWorkflowRulesFeature.CALLS_MODULE_ID, "QA WF k9"));
        if (c.statusCode() / 100 != 2) throw new org.testng.SkipException("could not create a Calls saved action: " + c.statusCode() + " " + body(c));
        String aid = c.jsonPath().getString("data.id");
        assertRefused(api.createRule(r("K9 other module").onCreate().saved("Task", aid).build()), "Tickets rule using a Calls saved action");
    }

    @Test(groups = {"regression", "api"}, description = "A saved action's type cannot be changed")
    @CaseId("WFR-K5")
    public void savedActionTypeFixed() {
        Response c = api.createAction(savedTask("QA WF API K5 task", DeskWorkflowRulesApi.TICKETS, "QA WF k5"));
        if (c.statusCode() / 100 != 2) throw new org.testng.SkipException("could not create a saved action: " + c.statusCode() + " " + body(c));
        String aid = c.jsonPath().getString("data.id");
        Response p = api.patchAction(aid, Map.of("action", Map.of("type", "Webhook", "order", 0, "url", "https://example.com", "method", "POST")));
        JsonPath back = DeskWorkflowRulesApi.ok(api.get("/workflow/actions/" + aid), "get action").jsonPath();
        assertEquals(back.getString("data.action.type") != null ? back.getString("data.action.type") : back.getString("data.type"), "Task", "type changed by PATCH (" + p.statusCode() + ")");
    }
}
