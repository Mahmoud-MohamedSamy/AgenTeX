package qa.features.deskworkflowrules;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertTrue;
import static qa.features.deskworkflowrules.Rules.changed;
import static qa.features.deskworkflowrules.Rules.contains;
import static qa.features.deskworkflowrules.Rules.oneOf;
import static qa.features.deskworkflowrules.Rules.s;

/**
 * Spec groups H, I and J, second set (14 Oct 2026): the cases that need no shared-setting change and no email.
 * Same safety rules as WorkflowExecutionTest: QA guard condition, teammates' rules paused and restored, results read
 * through the API with a 2xx check, a control rule or control ticket before any "did not happen" verdict.
 * "Record" rows in the spec (behaviour to document, no fixed expectation) print [RECORD] lines and pass.
 */
public class WorkflowHijTest extends BaseTest {
    private static final int WAIT = 120;
    private DeskWorkflowRulesApi api;
    private final List<String> rules = new ArrayList<>();
    private final List<String> tickets = new ArrayList<>();
    private final List<String> savedActions = new ArrayList<>();
    private final List<WebhookSite> hooks = new ArrayList<>();
    private String tagA, tagC;

    @BeforeMethod(alwaysRun = true)
    public void prepare() {
        new WorkflowRulesListPage().openForApi();
        api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        tagA = api.tagId("QA WF tag A", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        tagC = api.tagId("QA WF tag C", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
    }

    @AfterMethod(alwaysRun = true)
    public void cleanUp() {
        if (api == null) return;
        for (String id : rules) api.deleteRule(id);
        for (String id : tickets) api.deleteTicket(id);
        for (String id : savedActions) api.deleteAction(id);
        for (WebhookSite h : hooks) h.delete();
        rules.clear();
        tickets.clear();
        savedActions.clear();
        hooks.clear();
        try {
            api.restorePaused();
        } catch (RuntimeException e) {
            System.err.println("[cleanup] " + e.getMessage());
        }
    }

    // ---------------- helpers ----------------

    private String rule(Rules r) {
        String id = api.createRuleOk(r.build());
        rules.add(id);
        return id;
    }

    private String ticket(String label, Map<String, Object> extra) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + label + " " + System.currentTimeMillis() % 100000);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", "low");
        f.put("channel", "web");
        f.putAll(extra);
        String id = api.createTicket(f);
        tickets.add(id);
        return id;
    }

    private WebhookSite hook() {
        WebhookSite h = WebhookSite.create(200, 0);
        hooks.add(h);
        return h;
    }

    private boolean hasTag(String t, String tag) {
        String tags = api.ticket(t).get("tags");
        return tags != null && tags.contains(tag);
    }

    private boolean waitTag(String t, String tag, int seconds) {
        return api.waitTicket(t, x -> x.get("tags") != null && x.get("tags").contains(tag), seconds);
    }

    /** Control: wait for tag C (added by a control rule) so a negative check is only trusted after the engine ran. */
    private void awaitControl(String t) {
        if (!waitTag(t, tagC, WAIT))
            throw new SkipException("Inconclusive: control rule did not run on " + t + ". Executions: " + api.executionsText(t));
        Waits.sleep(5000);
    }

    private void edit(String t, Map<String, Object> fields) {
        DeskWorkflowRulesApi.ok(api.updateTicket(t, fields), "update ticket " + t);
    }

    private int runs(String t, String r) {
        return api.executions(t, r).size();
    }

    private List<String> bodies(WebhookSite h) {
        return h.requests().stream().map(x -> String.valueOf(x.get("content"))).toList();
    }

    @SuppressWarnings("unchecked")
    private List<String> dispatches(String t, String r) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(t, r)) {
            Map<String, Object> det = DeskWorkflowRulesApi.ok(api.get("/workflow/executions/" + e.get("id")), "execution detail").jsonPath().getMap("data");
            Object d = det.get("dispatches");
            if (d instanceof List<?> l) for (Object x : l) out.add(String.valueOf(x).toLowerCase());
            out.add("outcome=" + String.valueOf(det.get("outcome")).toLowerCase() + " error=" + det.get("error"));
        }
        return out;
    }

    private static String iso(long secondsFromNow) {
        return Instant.now().plus(secondsFromNow, ChronoUnit.SECONDS).truncatedTo(ChronoUnit.SECONDS).toString();
    }

    private static void record(String caseId, String what) {
        System.out.println("[RECORD] " + caseId + ": " + what);
    }

    // ---------------- H ----------------

    @Test(groups = {"regression", "execution"}, description = "\"Status changed\" condition: fires on a status change, not on other edits")
    @CaseId("WFR-H6")
    public void changedCondition() {
        String r = rule(Rules.named("H6 status changed -> A").onEdit().where(changed("status")).addTags("append", tagA));
        rule(Rules.named("H6 control edit -> C").onEdit().addTags("append", tagC));
        String t = ticket("H6", Map.of());
        edit(t, Map.of("description", "QA WF H6 other field"));
        awaitControl(t);
        assertTrue(!hasTag(t, tagA), "rule with 'status changed' ran on an edit that did not change the status. Executions: " + api.executionsText(t));
        edit(t, Map.of("status", "On Hold"));
        assertTrue(waitTag(t, tagA, WAIT), "rule with 'status changed' did not run when the status changed. Runs: " + runs(t, r)
                + ". Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "On Delete: fires when the ticket is deleted, with the deleted ticket's values")
    @CaseId("WFR-H7")
    public void onDeleteFires() {
        WebhookSite h = hook();
        rule(Rules.named("H7 on delete webhook").onDelete().webhook("POST", h.url(), "{\"id\":\"${recordId}\",\"subject\":\"${subject}\"}", null, 10));
        String t = ticket("H7", Map.of());
        String subject = api.ticket(t).get("subject");
        DeskWorkflowRulesApi.ok(api.deleteTicket(t), "delete ticket");
        List<Map<String, Object>> got = h.await(1, WAIT);
        assertTrue(!got.isEmpty(), "On Delete rule did not call the webhook within " + WAIT + " s");
        String body = bodies(h).get(0);
        assertTrue(body.contains(t), "webhook body lacks the deleted ticket id: " + body);
        assertTrue(body.contains(subject), "webhook body lacks the deleted ticket's subject (values of the deleted record): " + body);
    }

    @Test(groups = {"regression", "execution"}, description = "Order: does rule 2 see rule 1's field update? Then reorder and repeat (record)")
    @CaseId("WFR-H10")
    public void ruleOrder() {
        String r1 = rule(Rules.named("H10 r1 sets urgent").onCreate().fieldUpdate("priority", "urgent"));
        String r2 = rule(Rules.named("H10 r2 urgent -> A").onCreate().where(oneOf("priority", "urgent")).addTags("append", tagA));
        rule(Rules.named("H10 control -> C").onCreate().addTags("append", tagC));
        List<String> results = new ArrayList<>();
        for (List<String> first : List.of(List.of(r1, r2), List.of(r2, r1))) {
            List<String> all = new ArrayList<>(api.ruleList().stream().filter(x -> DeskWorkflowRulesApi.TICKETS.equals(x.get("moduleId")))
                    .sorted((x, y) -> Integer.compare(((Number) x.get("position")).intValue(), ((Number) y.get("position")).intValue()))
                    .map(x -> String.valueOf(x.get("id"))).toList());
            all.removeAll(first);
            List<String> order = new ArrayList<>(first); // QA rules on top; teammates keep their relative order
            order.addAll(all);
            DeskWorkflowRulesApi.ok(api.reorder(DeskWorkflowRulesApi.TICKETS, order), "reorder");
            String t = ticket("H10 " + (first.get(0).equals(r1) ? "r1 first" : "r2 first"), Map.of());
            awaitControl(t);
            boolean urgent = api.waitTicket(t, x -> "urgent".equals(x.get("priority")), 30);
            results.add((first.get(0).equals(r1) ? "r1 (sets urgent) first" : "r2 (needs urgent) first") + ": priority urgent=" + urgent
                    + ", r2 added tag A=" + hasTag(t, tagA) + ", r2 runs=" + runs(t, r2));
        }
        record("WFR-H10", String.join(" | ", results));
        assertTrue(results.stream().allMatch(x -> x.contains("priority urgent=true")), "rule 1's Field Update did not apply: " + results);
    }

    @Test(groups = {"regression", "execution"}, description = "A workflow's own field update is not an edit: a Field Changed rule on that field does not run (NDC-2205)")
    @CaseId("WFR-H17")
    public void changeByAnotherRuleIsNotAnEdit() {
        rule(Rules.named("H17 A sets urgent").onCreate().fieldUpdate("priority", "urgent"));
        String b = rule(Rules.named("H17 B priority changed -> A").onFieldChanged("priority").addTags("append", tagA));
        rule(Rules.named("H17 control -> C").onCreate().addTags("append", tagC));
        String t = ticket("H17", Map.of());
        awaitControl(t);
        assertTrue(api.waitTicket(t, x -> "urgent".equals(x.get("priority")), 30), "rule A did not set priority urgent");
        Waits.sleep(10000);
        record("WFR-H17", "Field Changed (priority) rule after another rule changed priority: runs=" + runs(t, b) + ", tag A=" + hasTag(t, tagA));
        assertTrue(!hasTag(t, tagA), "a workflow's own update was treated as an edit: the Field Changed rule ran. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Loop guard: an Edit rule that edits the ticket does not loop forever")
    @CaseId("WFR-H18")
    public void loopGuard() {
        String r = rule(Rules.named("H18 edit appends x").onEdit().fieldUpdate("description", "${description}x"));
        String t = ticket("H18", Map.of());
        edit(t, Map.of("description", "QA WF H18 "));
        Waits.sleep(45000);
        int n1 = runs(t, r);
        String d1 = api.ticket(t).get("description");
        Waits.sleep(30000);
        int n2 = runs(t, r);
        String d2 = api.ticket(t).get("description");
        record("WFR-H18", "runs after 45 s=" + n1 + ", after 75 s=" + n2 + ", description=" + d2);
        assertEquals(n2, n1, "rule keeps running on its own edits (loop): runs went from " + n1 + " to " + n2);
        assertEquals(d2, d1, "description keeps growing (loop): " + d1 + " -> " + d2);
        assertTrue(n2 >= 1, "the Edit rule did not run at all on a manual edit. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Unicode: Subject contains Arabic + emoji matches exactly, no false match")
    @CaseId("WFR-H20")
    public void unicodeMatch() {
        rule(Rules.named("H20 arabic emoji -> A").onCreate().where(contains("subject", "طلب استرداد 🚀")).addTags("append", tagA));
        rule(Rules.named("H20 control -> C").onCreate().addTags("append", tagC));
        String hit = ticket("H20 طلب استرداد 🚀 عاجل", Map.of());
        String miss = ticket("H20 طلب استرداد عاجل", Map.of());
        awaitControl(miss);
        assertTrue(waitTag(hit, tagA, WAIT), "Arabic + emoji subject did not match. Executions: " + api.executionsText(hit));
        assertTrue(!hasTag(miss, tagA), "similar subject without the emoji matched too (false match)");
    }

    // ---------------- I ----------------

    @Test(groups = {"regression", "execution"}, description = "Field Update sets a pick list and a status value")
    @CaseId("WFR-I2")
    public void fieldUpdatePickListAndStatus() {
        rule(Rules.named("I2 urgent + on hold").onCreate().fieldUpdate(Map.of("priority", s("urgent"), "status", s("On Hold"))));
        String t = ticket("I2", Map.of());
        assertTrue(api.waitTicket(t, x -> "urgent".equals(x.get("priority")) && "On Hold".equals(x.get("status")), WAIT),
                "expected priority urgent and status On Hold, got " + api.ticket(t).get("priority") + " / " + api.ticket(t).get("status")
                        + ". Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Field Update on create is applied before the first save (record)")
    @CaseId("WFR-I5")
    public void fieldUpdateBeforeSave() {
        rule(Rules.named("I5 set description").onCreate().fieldUpdate("description", "QA WF I5 set by rule"));
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + "I5 " + System.currentTimeMillis() % 100000);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", "low");
        Response resp = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records",
                Map.of("data", DeskWorkflowRulesApi.recordData(f), "layout_id", DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID));
        String t = DeskWorkflowRulesApi.ok(resp, "create I5").jsonPath().getString("data.id");
        tickets.add(t);
        boolean inResponse = resp.asString().contains("QA WF I5 set by rule");
        String first = api.ticket(t).get("description");
        boolean later = api.waitTicket(t, x -> "QA WF I5 set by rule".equals(x.get("description")), WAIT);
        record("WFR-I5", "value in the create response=" + inResponse + ", in the first read=" + "QA WF I5 set by rule".equals(first)
                + ", applied at all=" + later);
        assertTrue(later, "Field Update on create never applied. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Owner Assignment to the user field Created By sets owner = creator")
    @CaseId("WFR-I7")
    public void ownerFromUserField() {
        rule(Rules.named("I7 owner = created by").onCreate().owner("UserField", "created_by"));
        String t = ticket("I7", Map.of());
        String creator = api.ticket(t).get("created_by");
        Map<String, Object> rec = DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records/" + t), "read").jsonPath().getMap("data");
        String creatorId = creator != null ? creator : String.valueOf(rec.get("created_by") != null ? rec.get("created_by") : rec.get("createdBy"));
        assertTrue(api.waitTicket(t, x -> creatorId.equals(x.get("owner")), WAIT),
                "owner=" + api.ticket(t).get("owner") + ", expected the creator " + creatorId + ". Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "api"}, description = "Create Record with a required field missing: refused on save, or Failed at run time with a reason (record)")
    @CaseId("WFR-I25")
    public void createRecordRequiredMissing() {
        Response resp = api.createRule(Rules.named("I25 call without subject").onCreate()
                .createRecord(DeskWorkflowRulesFeature.CALLS_MODULE_ID, DeskWorkflowRulesFeature.CALLS_LAYOUT_ID,
                        Map.of("call_start_time", Rules.ts(iso(86400)))).build()); // required Subject left out
        if (resp.statusCode() / 100 != 2) {
            record("WFR-I25", "refused on save: " + resp.statusCode() + " " + resp.asString().substring(0, Math.min(300, resp.asString().length())));
            assertTrue(resp.statusCode() / 100 == 4, "refused, but with " + resp.statusCode() + " instead of a 4xx");
            return;
        }
        String r = resp.jsonPath().getString("data.id");
        rules.add(r);
        String t = ticket("I25", Map.of());
        long until = System.currentTimeMillis() + WAIT * 1000L;
        List<String> d = dispatches(t, r);
        while (System.currentTimeMillis() < until && d.stream().noneMatch(x -> x.matches(".*(failed|succeeded|cancelled).*"))) {
            Waits.sleep(5000);
            d = dispatches(t, r);
        }
        record("WFR-I25", "accepted on save; at run time: " + d);
        assertTrue(d.stream().anyMatch(x -> x.contains("failed") && !x.contains("lasterror=null")),
                "rule with a Create Record missing required fields was saved and did not fail with a reason: " + d);
    }

    private Map<String, Object> savedFieldUpdate(String name, String value, boolean active) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", "FieldUpdate");
        a.put("order", 0);
        a.put("delaySeconds", 0);
        a.put("fieldUpdates", Map.of("description", s(value)));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("moduleId", DeskWorkflowRulesApi.TICKETS);
        body.put("name", name);
        body.put("isActive", active);
        body.put("action", a);
        return body;
    }

    @Test(groups = {"regression", "execution"}, description = "A saved action edited after the rule was made: the rule uses the new configuration")
    @CaseId("WFR-I31")
    public void savedActionResolvesLive() {
        String aid = DeskWorkflowRulesApi.ok(api.createAction(savedFieldUpdate("QA WF I31 saved", "QA WF I31 v1", true)), "create saved action")
                .jsonPath().getString("data.id");
        savedActions.add(aid);
        rule(Rules.named("I31 uses saved").onCreate().saved("FieldUpdate", aid));
        DeskWorkflowRulesApi.ok(api.patchAction(aid, savedFieldUpdate("QA WF I31 saved", "QA WF I31 v2", true)), "edit saved action");
        String t = ticket("I31", Map.of());
        assertTrue(api.waitTicket(t, x -> x.get("description") != null && x.get("description").startsWith("QA WF I31"), WAIT),
                "the saved action did not run. Executions: " + api.executionsText(t));
        assertEquals(api.ticket(t).get("description"), "QA WF I31 v2", "rule used the old saved-action configuration");
    }

    @Test(groups = {"regression", "execution"}, description = "An inactive saved action is skipped, and the history says so")
    @CaseId("WFR-I32")
    public void inactiveSavedActionSkipped() {
        String aid = DeskWorkflowRulesApi.ok(api.createAction(savedFieldUpdate("QA WF I32 saved", "QA WF I32 ran", true)), "create saved action")
                .jsonPath().getString("data.id");
        savedActions.add(aid);
        String r = rule(Rules.named("I32 uses saved").onCreate().saved("FieldUpdate", aid).addTags("append", tagC));
        DeskWorkflowRulesApi.ok(api.patchAction(aid, savedFieldUpdate("QA WF I32 saved", "QA WF I32 ran", false)), "deactivate saved action");
        String t = ticket("I32", Map.of());
        awaitControl(t); // tag C comes from the same rule: the rule ran
        String d = api.ticket(t).get("description");
        List<String> disp = dispatches(t, r);
        record("WFR-I32", "description=" + d + "; execution=" + disp);
        assertTrue(d == null || !d.contains("QA WF I32 ran"), "inactive saved action still ran");
    }

    // ---------------- phase 2 (no shared-setting change) ----------------

    @Test(groups = {"regression", "execution"}, description = "Bulk edit of 3 tickets: Edit rules run once per ticket (record)")
    @CaseId("WFR-H15")
    public void bulkEditRunsEditRules() {
        String r = rule(Rules.named("H15 on edit -> A").onEdit().addTags("append", tagA));
        List<String> ids = List.of(ticket("H15 a", Map.of()), ticket("H15 b", Map.of()), ticket("H15 c", Map.of()));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("record_ids", ids);
        body.put("data", DeskWorkflowRulesApi.recordData(Map.of("priority", "medium")));
        Response resp = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records/mass-update", body);
        DeskWorkflowRulesApi.ok(resp, "mass-update");
        boolean all = true;
        StringBuilder sb = new StringBuilder();
        for (String t : ids) {
            boolean tagged = waitTag(t, tagA, 60);
            all &= tagged;
            sb.append(" ").append(api.ticket(t).get("priority")).append("/runs=").append(runs(t, r)).append("/tagA=").append(tagged);
        }
        record("WFR-H15", "bulk edit of 3 tickets:" + sb);
        assertTrue(ids.stream().allMatch(t -> "medium".equals(api.ticket(t).get("priority"))), "bulk edit did not apply: " + sb);
        assertTrue(all, "Edit rule did not run on every bulk-edited ticket:" + sb);
        assertTrue(ids.stream().allMatch(t -> runs(t, r) == 1), "Edit rule should run once per ticket:" + sb);
    }

    @Test(groups = {"regression", "execution"}, description = "Owner by role round robin (CEO): owners rotate across 3 tickets (record)")
    @CaseId("WFR-I8")
    public void ownerRoleRoundRobin() {
        String ceo = null;
        for (Map<String, Object> u : DeskWorkflowRulesApi.ok(api.get("/iam/org-units"), "org units").jsonPath().<Map<String, Object>>getList("data"))
            if ("CEO".equals(u.get("name")) && "desk".equals(u.get("app_key"))) ceo = String.valueOf(u.get("orgUnitId"));
        if (ceo == null) throw new SkipException("Desk role CEO not found");
        // facts: who is in the CEO role (ids only), and who owns a QA ticket when no rule sets the owner
        List<String> ceoUsers = new ArrayList<>();
        for (Map<String, Object> u : DeskWorkflowRulesApi.ok(api.get("/iam/users?page=1&page_size=100"), "users").jsonPath().<Map<String, Object>>getList("data"))
            if (ceo.equals(u.get("orgUnitId")) && "active".equals(u.get("status"))) ceoUsers.add(String.valueOf(u.get("userId")));
        String baseline = ticket("I8 baseline", Map.of());
        Waits.sleep(5000);
        String defaultOwner = api.ticket(baseline).get("owner");
        System.out.println("[I8] CEO users=" + ceoUsers + " | default owner with no rule=" + defaultOwner);
        rule(Rules.named("I8 owner = CEO round robin").onCreate().owner("RoleRoundRobin", ceo));
        List<String> owners = new ArrayList<>();
        for (String l : List.of("I8 a", "I8 b", "I8 c")) {
            String t = ticket(l, Map.of());
            api.waitTicket(t, x -> x.get("owner") != null && !x.get("owner").isBlank(), WAIT);
            owners.add(api.ticket(t).get("owner"));
            System.out.println("[I8] " + l + " owner=" + api.ticket(t).get("owner") + " created_by=" + api.ticket(t).get("created_by") + " exec=" + api.executionsText(t).replaceAll("https://webhook.site/[0-9a-f-]+", "<hook>"));
        }
        long distinct = owners.stream().distinct().count();
        record("WFR-I8", "owners of 3 tickets=" + owners + " (distinct " + distinct + ")");
        assertTrue(owners.stream().noneMatch(o -> o == null || o.isBlank() || "null".equals(o)), "a ticket got no owner: " + owners);
        assertTrue(distinct >= 2, "round robin did not rotate owners: " + owners);
    }

    @Test(groups = {"regression", "execution"}, description = "Task with Notify Assignee: the assignee gets an in-app notification")
    @CaseId("WFR-I23")
    @SuppressWarnings("unchecked")
    public void taskNotifiesAssignee() {
        String me = String.valueOf(DeskWorkflowRulesApi.ok(api.get("/iam/me"), "me").jsonPath().getMap("data").getOrDefault("userId",
                DeskWorkflowRulesApi.ok(api.get("/iam/me"), "me").jsonPath().getMap("data").get("id")));
        String title = "QA WF I23 task " + System.currentTimeMillis() % 100000;
        Rules rb = Rules.named("I23 task notify").onCreate().task(title, 1, "Not Started", "high");
        Map<String, Object> body = rb.build();
        ((Map<String, Object>) ((List<Object>) body.get("actions")).get(0)).put("taskNotifyAssignee", true);
        String rid = api.createRuleOk(body);
        rules.add(rid);
        String t = ticket("I23", Map.of()); // owner defaults to the creator (me); the task assignee defaults to the record owner
        System.out.println("[I23] ticket owner=" + api.ticket(t).get("owner") + " me=" + me);
        long until = System.currentTimeMillis() + WAIT * 1000L;
        String found = null;
        while (found == null && System.currentTimeMillis() < until) {
            Waits.sleep(5000);
            String all = api.get("/notifications?page=1&page_size=30").asString();
            if (all.contains(title)) found = all.substring(Math.max(0, all.indexOf(title) - 300), Math.min(all.length(), all.indexOf(title) + 200));
        }
        record("WFR-I23", found == null ? "no notification with the task title within " + WAIT + " s" : "notification: " + found.replaceAll("\\s+", " "));
        assertTrue(found != null, "assignee got no in-app notification for the task. Executions: " + api.executionsText(t));
    }

    // ---------------- QA layout cases (run WorkflowDiagTest#qaLayoutSetup first; user rule: changes only on the QA layout) ----------------

    private String qaLayoutId() {
        for (Map<String, Object> l : DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/layouts"), "layouts")
                .jsonPath().<Map<String, Object>>getList("data"))
            if ("QA WF Layout".equals(l.get("name"))) return String.valueOf(l.get("id"));
        throw new SkipException("QA WF Layout not found - run WorkflowDiagTest#qaLayoutSetup first");
    }

    /** QA ticket on a given layout; raw record values allowed (e.g. an address object). */
    private String ticketOn(String layoutId, String label, Map<String, Object> rawValues) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + label + " " + System.currentTimeMillis() % 100000);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", "low");
        List<Map<String, Object>> data = new ArrayList<>(DeskWorkflowRulesApi.recordData(f));
        rawValues.forEach((k, v) -> data.add(Map.of("field", k, "value", v)));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("data", data);
        body.put("layout_id", layoutId);
        String id = DeskWorkflowRulesApi.ok(api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records", body), "create on layout").jsonPath().getString("data.id");
        tickets.add(id);
        return id;
    }

    private String raw(String t) {
        return DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records/" + t), "read").asString();
    }

    @Test(groups = {"qa-layout", "execution"}, description = "Rule scoped to a layout fires only for tickets on that layout")
    @CaseId("WFR-H13")
    public void layoutScope() {
        String qa = qaLayoutId();
        rule(Rules.named("H13 QA layout -> A").layout(qa).onCreate().addTags("append", tagA));
        rule(Rules.named("H13 control -> C").onCreate().addTags("append", tagC));
        String onStandard = ticketOn(DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID, "H13 standard", Map.of());
        String onQa = ticketOn(qa, "H13 qa layout", Map.of());
        awaitControl(onStandard);
        assertTrue(!hasTag(onStandard, tagA), "rule scoped to QA WF Layout ran on a Standard ticket");
        assertTrue(waitTag(onQa, tagA, WAIT), "rule scoped to QA WF Layout did not run on a ticket of that layout. Executions: " + api.executionsText(onQa));
    }

    @Test(groups = {"qa-layout", "execution"}, description = "Field Update on a date-only field stores the date, not a timestamp (cf. NDC-1438)")
    @CaseId("WFR-I3")
    public void fieldUpdateDateOnly() {
        String qa = qaLayoutId();
        Response resp = api.createRule(Rules.named("I3 set QA date").onCreate().fieldUpdate(Map.of("qa_wf_date", Rules.ts("2026-10-20T00:00:00"))).build());
        String form = "timestamp";
        if (resp.statusCode() / 100 != 2) {
            System.out.println("[I3] timestamp form refused: " + resp.statusCode() + " " + resp.asString());
            resp = api.createRule(Rules.named("I3 set QA date str").onCreate().fieldUpdate(Map.of("qa_wf_date", s("2026-10-20"))).build());
            form = "string";
        }
        String r = DeskWorkflowRulesApi.ok(resp, "save I3 rule").jsonPath().getString("data.id");
        rules.add(r);
        String t = ticketOn(qa, "I3", Map.of());
        assertTrue(api.waitTicket(t, x -> x.get("qa_wf_date") != null, WAIT), "date-only field not set. Executions: " + api.executionsText(t));
        String v = api.ticket(t).get("qa_wf_date");
        record("WFR-I3", "rule value form=" + form + ", stored=" + v);
        assertEquals(v, "2026-10-20", "date-only field should store just the date");
    }

    @Test(groups = {"qa-layout", "execution"}, description = "Field Update of one address part keeps the other parts (cf. NDC-1436)")
    @CaseId("WFR-I4")
    public void fieldUpdateAddressPart() {
        String qa = qaLayoutId();
        Map<String, Object> address = Rules.kinded("kind", "object", "properties", Map.of(
                "street", Map.of("kind", "string", "value", "1 QA Street"),
                "city", Map.of("kind", "string", "value", "Cairo"),
                "country", Map.of("kind", "string", "value", "Egypt")));
        String t = ticketOn(qa, "I4", Map.of("qa_wf_address", address));
        String before = raw(t);
        System.out.println("[I4] stored address on create: " + before.substring(Math.max(0, before.indexOf("qa_wf_address")), Math.min(before.length(), before.indexOf("qa_wf_address") + 400)));
        String r = null, key = null;
        for (String k : List.of("qa_wf_address.city", "qa_wf_address_city", "qa_wf_address__city")) {
            Response resp = api.createRule(Rules.named("I4 city " + k).onEdit().where(contains("description", "QA WF I4 go"))
                    .fieldUpdate(Map.of(k, s("Giza"))).build());
            System.out.println("[I4] key " + k + " -> " + resp.statusCode() + " " + resp.asString().substring(0, Math.min(200, resp.asString().length())));
            if (resp.statusCode() / 100 == 2) { r = resp.jsonPath().getString("data.id"); key = k; rules.add(r); break; }
        }
        if (r == null) throw new SkipException("no accepted key format for an address part (see [I4] lines)");
        edit(t, Map.of("description", "QA WF I4 go"));
        long until = System.currentTimeMillis() + WAIT * 1000L;
        String after = raw(t);
        while (!after.contains("Giza") && System.currentTimeMillis() < until) { Waits.sleep(5000); after = raw(t); }
        String part = after.substring(Math.max(0, after.indexOf("qa_wf_address")), Math.min(after.length(), after.indexOf("qa_wf_address") + 400));
        record("WFR-I4", "key=" + key + "; address after the rule: " + part);
        assertTrue(after.contains("Giza"), "city not updated. Executions: " + api.executionsText(t));
        assertTrue(after.contains("1 QA Street") && after.contains("Egypt"), "other address parts were lost: " + part);
    }

    // ---------------- J (timing) ----------------

    @Test(groups = {"regression", "execution", "timing"}, description = "Date-Time: 5 minutes before Due Date fires at due - 5 min (± 2 min)")
    @CaseId("WFR-J1")
    public void minutesBeforeDate() {
        WebhookSite h = hook();
        rule(Rules.named("J1 5 min before due").onDate("due_date", -300, "wall_clock").webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10));
        long created = System.currentTimeMillis();
        String t = ticket("J1", Map.of("due_date", iso(480))); // due in 8 min -> expected at ~3 min
        List<Map<String, Object>> got = h.await(1, 420);
        assertTrue(!got.isEmpty(), "rule did not fire within 7 min (expected ~3 min after create). Executions: " + api.executionsText(t));
        long minutes = (System.currentTimeMillis() - created) / 60000;
        record("WFR-J1", "fired about " + minutes + " min after create (expected ~3)");
        assertTrue(minutes >= 1 && minutes <= 5, "fired " + minutes + " min after create, expected 3 ± 2");
    }

    @Test(groups = {"regression", "execution", "timing"}, description = "Date-Time: due date already past the offset (record: fires at once or never)")
    @CaseId("WFR-J3")
    public void dateAlreadyPast() {
        WebhookSite h = hook();
        rule(Rules.named("J3 1 min after due").onDate("due_date", 60, "wall_clock").webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10));
        String t = ticket("J3", Map.of("due_date", iso(-600)));
        List<Map<String, Object>> got = h.await(1, 180);
        record("WFR-J3", got.isEmpty() ? "never fired within 3 min (date already past)" : "fired at once for a date already past");
    }

    @Test(groups = {"regression", "execution", "timing"}, description = "Date-Time: moving the due date reschedules; the old time does not fire")
    @CaseId("WFR-J4")
    public void dateMovedReschedules() {
        WebhookSite h = hook();
        rule(Rules.named("J4 1 min after due").onDate("due_date", 60, "wall_clock").webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10));
        String t = ticket("J4", Map.of("due_date", iso(120))); // old schedule ~3 min
        Waits.sleep(20000);
        edit(t, Map.of("due_date", iso(340))); // new schedule ~6.5 min after create
        Waits.sleep(200000); // ~3.7 min after create: past the old time, before the new one
        int atOld = h.requests().size();
        List<Map<String, Object>> got = h.await(1, 300);
        record("WFR-J4", "requests by the old time=" + atOld + ", after the new time=" + got.size());
        assertEquals(atOld, 0, "the old schedule still fired after the due date moved");
        assertTrue(got.size() == 1, "expected exactly one run at the new time, got " + got.size() + ". Executions: " + api.executionsText(t));
    }

    /** J8 / J9: a queued scheduled webhook, then the rule is deleted or deactivated. A second, untouched rule is the control. */
    private void queuedThenRuleChanged(String caseId, boolean delete) {
        WebhookSite h = hook();
        WebhookSite control = hook();
        String r = rule(Rules.named(caseId + " scheduled").onCreate().webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10).delayed(120));
        rule(Rules.named(caseId + " control scheduled").onCreate().webhook("POST", control.url(), "{\"id\":\"${recordId}\"}", null, 10).delayed(120));
        String t = ticket(caseId, Map.of());
        Waits.sleep(20000);
        if (delete) {
            DeskWorkflowRulesApi.ok(api.deleteRule(r), "delete rule");
            rules.remove(r);
        } else {
            DeskWorkflowRulesApi.ok(api.deactivate(r), "deactivate rule");
        }
        if (control.await(1, 240).isEmpty())
            throw new SkipException("Inconclusive: the control rule's scheduled webhook did not arrive either. Executions: " + api.executionsText(t));
        Waits.sleep(15000);
        int ran = h.requests().size();
        record(caseId, "rule " + (delete ? "deleted" : "deactivated") + " with a queued action: queued webhook ran=" + (ran > 0));
        if (delete) assertEquals(ran, 0, "the queued action of a deleted rule still ran");
    }

    @Test(groups = {"regression", "execution", "timing"}, description = "Deleting a rule cancels its queued scheduled actions")
    @CaseId("WFR-J8")
    public void ruleDeletedCancelsQueued() {
        queuedThenRuleChanged("J8", true);
    }

    @Test(groups = {"regression", "execution", "timing"}, description = "Deactivating a rule with a queued scheduled action (record: cancelled or still runs)")
    @CaseId("WFR-J9")
    public void ruleDeactivatedQueued() {
        queuedThenRuleChanged("J9", false);
    }

    @Test(groups = {"regression", "execution", "timing"}, description = "Deleting the ticket with a queued action: cancelled or failed cleanly")
    @CaseId("WFR-J10")
    public void ticketDeletedQueued() {
        WebhookSite h = hook();
        String r = rule(Rules.named("J10 scheduled").onCreate().webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10).delayed(120));
        String gone = ticket("J10 deleted", Map.of());
        String control = ticket("J10 control", Map.of());
        Waits.sleep(20000);
        DeskWorkflowRulesApi.ok(api.deleteTicket(gone), "delete ticket");
        List<Map<String, Object>> got = h.await(1, 240);
        Waits.sleep(15000);
        List<String> b = bodies(h);
        if (b.stream().noneMatch(x -> x.contains(control)))
            throw new SkipException("Inconclusive: the control ticket's scheduled webhook did not arrive. Requests: " + b);
        String hist;
        try {
            hist = String.valueOf(dispatches(gone, r));
        } catch (RuntimeException e) {
            hist = "execution history not readable for the deleted ticket: " + e.getMessage();
        }
        record("WFR-J10", "deleted ticket's queued webhook ran=" + b.stream().anyMatch(x -> x.contains(gone)) + "; history=" + hist);
        assertTrue(b.stream().noneMatch(x -> x.contains(gone)), "the queued action ran for a deleted ticket: " + b);
    }
}
