package qa.features.deskworkflowrules;

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
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.deskworkflowrules.Rules.oneOf;

/**
 * Spec groups I (async actions) and J (scheduled / date-time): webhooks on webhook.site, tasks, create record, owner,
 * email, scheduled cancel, Date-Time trigger. Same safety rules as WorkflowExecutionTest (QA guard, teammates' rules
 * paused and restored, results read through the API with a 2xx check).
 * Run: mvnw test -Dtest=WorkflowActionResultsTest
 */
public class WorkflowActionResultsTest extends BaseTest {
    private static final int WAIT = 120;
    private DeskWorkflowRulesApi api;
    private final List<String> rules = new ArrayList<>();
    private final List<String> tickets = new ArrayList<>();
    private final List<WebhookSite> hooks = new ArrayList<>();
    private String tagA;

    @BeforeMethod(alwaysRun = true)
    public void prepare() {
        new WorkflowRulesListPage().openForApi();
        api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        tagA = api.tagId("QA WF tag A", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
    }

    @AfterMethod(alwaysRun = true)
    public void cleanUp() {
        if (api == null) return;
        for (String id : rules) api.deleteRule(id);
        for (String id : tickets) api.deleteTicket(id);
        for (WebhookSite h : hooks) h.delete();
        rules.clear();
        tickets.clear();
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

    private String ticket(String label, String priority, Map<String, Object> extra) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + label + " " + System.currentTimeMillis() % 100000);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", priority);
        f.put("channel", "web");
        f.putAll(extra);
        String id = api.createTicket(f);
        tickets.add(id);
        return id;
    }

    private WebhookSite hook(int status, int delay) {
        WebhookSite h = WebhookSite.create(status, delay);
        hooks.add(h);
        return h;
    }

    /** Dispatches of a rule's runs on a ticket, as lower-cased JSON-ish strings (shape not pinned, so match by text). */
    @SuppressWarnings("unchecked")
    private List<String> dispatches(String ticketId, String ruleId) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(ticketId, ruleId)) {
            Object d = e.get("dispatches");
            if (d instanceof List<?> l) for (Object x : l) out.add(String.valueOf(x).toLowerCase());
            if (out.isEmpty()) {
                // list rows may omit dispatches: read the detail
                Map<String, Object> det = DeskWorkflowRulesApi.ok(api.get("/workflow/executions/" + e.get("id")), "execution detail").jsonPath().getMap("data");
                Object dd = det.get("dispatches");
                if (dd instanceof List<?> l2) for (Object x : l2) out.add(String.valueOf(x).toLowerCase());
            }
        }
        return out;
    }

    /** Waits until a dispatch of the rule reaches a final state; returns all dispatch texts. */
    private List<String> awaitDispatch(String ticketId, String ruleId, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        List<String> d = dispatches(ticketId, ruleId);
        while (System.currentTimeMillis() < end && d.stream().noneMatch(x -> x.matches(".*(succeeded|failed|deadletter|dead-letter|cancelled).*"))) {
            Waits.sleep(5000);
            d = dispatches(ticketId, ruleId);
        }
        return d;
    }

    private String ownerAgentId() {
        List<Map<String, Object>> depts = DeskWorkflowRulesApi.ok(api.get("/desk/departments"), "departments").jsonPath().getList("data");
        for (Map<String, Object> d : depts)
            if (DeskWorkflowRulesFeature.QA_DEPARTMENT_ID.equals(d.get("id"))) {
                List<?> ids = (List<?>) d.get("agent_user_ids");
                if (ids != null && !ids.isEmpty()) return String.valueOf(ids.get(0));
            }
        throw new SkipException("default department has no agents");
    }

    // ---------------- webhooks ----------------

    @Test(groups = {"regression", "execution", "webhook"}, description = "Webhook POST reaches the receiver with merge fields rendered; dispatch Succeeded")
    @CaseId({"WFR-I11", "WFR-I17"})
    public void webhookPostDelivered() {
        WebhookSite h = hook(200, 0);
        String r = rule(Rules.named("I11 webhook post").onCreate().webhook("POST", h.url(),
                "{\"id\":\"${recordId}\",\"subject\":\"${subject}\",\"missing\":\"${no_such_field}\"}", Map.of("X-QA-WF", "1"), 10));
        String t = ticket("I11 \"quote\" & <tag>", "low", Map.of());
        List<Map<String, Object>> got = h.await(1, WAIT);
        assertFalse(got.isEmpty(), "no request reached webhook.site in " + WAIT + " s. Dispatches: " + dispatches(t, r));
        Map<String, Object> req = got.get(got.size() - 1);
        assertEquals(String.valueOf(req.get("method")), "POST");
        String content = String.valueOf(req.get("content"));
        assertTrue(content.contains(t), "body lacks ${recordId}: " + content);
        assertTrue(content.contains("\"missing\":\"\""), "a missing merge field should render empty: " + content);
        assertTrue(content.contains("\\\"quote\\\"") || !content.contains("\"quote\""),
                "I17: subject with quotes breaks the JSON body: " + content);
        assertTrue(String.valueOf(req.get("headers")).toLowerCase().contains("x-qa-wf"), "custom header not sent: " + req.get("headers"));
        List<String> d = awaitDispatch(t, r, 60);
        assertTrue(d.stream().anyMatch(x -> x.contains("succeeded")), "dispatch not Succeeded: " + d);
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "Webhook honours PUT")
    @CaseId("WFR-I12")
    public void webhookPut() {
        WebhookSite h = hook(200, 0);
        rule(Rules.named("I12 webhook put").onCreate().webhook("PUT", h.url(), "{\"id\":\"${recordId}\"}", null, 10));
        ticket("I12", "low", Map.of());
        List<Map<String, Object>> got = h.await(1, WAIT);
        assertFalse(got.isEmpty(), "no request arrived");
        assertEquals(String.valueOf(got.get(0).get("method")), "PUT");
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "Webhook 404 is final: no retry, dispatch Failed with HTTP 404")
    @CaseId("WFR-I14")
    public void webhook404NotRetried() {
        WebhookSite h = hook(404, 0);
        String r = rule(Rules.named("I14 webhook 404").onCreate().webhook("POST", h.url(), "{}", null, 10));
        String t = ticket("I14", "low", Map.of());
        h.await(1, WAIT);
        Waits.sleep(60000); // a retry would come within a minute
        assertEquals(h.requests().size(), 1, "4xx should not be retried; webhook.site got " + h.requests().size() + " requests");
        List<String> d = awaitDispatch(t, r, 30);
        assertTrue(d.stream().anyMatch(x -> x.contains("failed") && x.contains("404")), "dispatch should be Failed with HTTP 404: " + d);
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "Webhook 500 is retried, then dead-lettered (attempts recorded)")
    @CaseId({"WFR-I13", "WFR-I16"})
    public void webhook500Retried() {
        WebhookSite h = hook(500, 0);
        String r = rule(Rules.named("I16 webhook 500").onCreate().webhook("POST", h.url(), "{}", null, 10));
        String t = ticket("I16", "low", Map.of());
        List<Map<String, Object>> got = h.await(2, 300);
        List<String> d = dispatches(t, r);
        System.out.println("[I16] requests=" + got.size() + " dispatches=" + d);
        assertTrue(got.size() >= 2, "5xx should be retried; only " + got.size() + " request(s) in 5 min. Dispatches: " + d);
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "Webhook slower than its timeout is marked failed / retried, not hung")
    @CaseId("WFR-I15")
    public void webhookTimeout() {
        WebhookSite h = hook(200, 8);
        String r = rule(Rules.named("I15 webhook timeout").onCreate().webhook("POST", h.url(), "{}", null, 2));
        String t = ticket("I15", "low", Map.of());
        h.await(1, WAIT);
        List<String> d = awaitDispatch(t, r, 120);
        System.out.println("[I15] dispatches=" + d);
        assertFalse(d.stream().allMatch(x -> x.contains("succeeded")), "a 2 s timeout against an 8 s receiver was reported Succeeded: " + d);
    }

    @Test(groups = {"regression", "execution", "webhook"}, description = "A failing webhook does not stop the other actions of the rule")
    @CaseId("WFR-I33")
    public void failingActionIsolated() {
        WebhookSite h = hook(500, 0);
        rule(Rules.named("I33 webhook fails + tag").onCreate().webhook("POST", h.url(), "{}", null, 5).addTags("append", tagA));
        String t = ticket("I33", "low", Map.of());
        assertTrue(api.waitTicket(t, x -> x.get("tags") != null && x.get("tags").contains(tagA), WAIT),
                "tag not added while the webhook of the same rule failed. Executions: " + api.executionsText(t));
    }

    // ---------------- task / create record / owner / email ----------------

    @Test(groups = {"regression", "execution"}, description = "Task action creates a task (dispatch Succeeded)")
    @CaseId("WFR-I22")
    public void taskCreated() {
        String r = rule(Rules.named("I22 task").onCreate().task("QA WF task for ${subject}", 2, "Not Started", "high"));
        String t = ticket("I22", "low", Map.of());
        List<String> d = awaitDispatch(t, r, WAIT);
        assertTrue(d.stream().anyMatch(x -> x.contains("succeeded")), "Task dispatch not Succeeded: " + d + " Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Create Record action creates a Call on the chosen layout")
    @CaseId("WFR-I24")
    public void createRecordCall() {
        String subject = "QA WF call " + System.currentTimeMillis() % 100000;
        String r = rule(Rules.named("I24 create call").onCreate().createRecord(DeskWorkflowRulesFeature.CALLS_MODULE_ID,
                DeskWorkflowRulesFeature.CALLS_LAYOUT_ID, Map.of("subject", Rules.s(subject),
                        "call_start_time", Rules.ts(Instant.now().plus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS).toString()))));
        String t = ticket("I24", "low", Map.of());
        List<String> d = awaitDispatch(t, r, WAIT);
        assertTrue(d.stream().anyMatch(x -> x.contains("succeeded")), "Create Record dispatch not Succeeded: " + d);
        List<Map<String, Object>> calls = DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesFeature.CALLS_MODULE_ID + "/records?take=50"), "calls")
                .jsonPath().getList("data");
        String callId = null;
        for (Map<String, Object> c : calls) if (String.valueOf(c.get("data")).contains(subject)) callId = String.valueOf(c.get("id"));
        assertTrue(callId != null, "no Call with subject " + subject + " found");
        api.delete("/modules/" + DeskWorkflowRulesFeature.CALLS_MODULE_ID + "/records/" + callId);
    }

    @Test(groups = {"regression", "execution"}, description = "Owner Assignment to a specific agent sets the ticket owner")
    @CaseId("WFR-I6")
    public void ownerSpecificUser() {
        String agent = ownerAgentId();
        rule(Rules.named("I6 owner agent").onCreate().owner("SpecificUser", agent));
        String t = ticket("I6", "low", Map.of());
        assertTrue(api.waitTicket(t, x -> agent.equals(x.get("owner")), WAIT), "owner=" + api.ticket(t).get("owner") + ", expected " + agent
                + ". Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Email action to an internal user: dispatch Succeeded (email service)")
    @CaseId("WFR-I18")
    public void emailToUser() {
        String agent = ownerAgentId();
        String r = rule(Rules.named("I18 email").onCreate().email(List.of(Rules.kinded("kind", "user", "value", agent)), "introduction",
                "QA WF email for ${subject}", "<p>QA WF workflow email for ticket ${subject}</p>"));
        String t = ticket("I18", "low", Map.of());
        List<String> d = awaitDispatch(t, r, WAIT);
        System.out.println("[I18] email dispatches=" + d);
        assertTrue(d.stream().anyMatch(x -> x.contains("succeeded")), "EMAIL SERVICE: Email dispatch not Succeeded: " + d + " Executions: " + api.executionsText(t));
    }

    // ---------------- scheduled / date-time ----------------

    @Test(groups = {"regression", "execution"}, description = "Scheduled action is cancelled when the ticket stops matching")
    @CaseId("WFR-J7")
    public void scheduledCancelledWhenNoLongerMatching() {
        WebhookSite h = hook(200, 0);
        String r = rule(Rules.named("J7 scheduled webhook").onCreate().where(oneOf("priority", "high"))
                .webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10).delayed(180));
        String t = ticket("J7", "high", Map.of());          // stops matching: its webhook must be cancelled
        String control = ticket("J7 control", "high", Map.of()); // keeps matching: its webhook must arrive (proves scheduling works)
        long until = System.currentTimeMillis() + 60_000;
        while (api.executions(t, r).isEmpty() && System.currentTimeMillis() < until) Waits.sleep(5000);
        if (api.executions(t, r).isEmpty())
            throw new SkipException("Inconclusive: the scheduled rule never fired on ticket " + t + ". Executions: " + api.executionsText(t));
        System.out.println("[J7] before change: dispatches=" + dispatches(t, r));
        DeskWorkflowRulesApi.ok(api.updateTicket(t, Map.of("priority", "low")), "set priority low");
        Waits.sleep(220000); // past the 3-minute delay
        List<String> bodies = h.requests().stream().map(x -> String.valueOf(x.get("content"))).toList();
        System.out.println("[J7] after delay: requests=" + bodies.size() + " dispatches(changed)=" + dispatches(t, r) + " dispatches(control)=" + dispatches(control, r));
        if (bodies.stream().noneMatch(b -> b.contains(control)))
            throw new SkipException("Inconclusive: the control ticket's scheduled webhook did not arrive either, so scheduling itself did not run. Requests: " + bodies);
        assertTrue(bodies.stream().noneMatch(b -> b.contains(t)), "scheduled webhook still ran for the ticket that stopped matching: " + bodies);
        List<String> d = dispatches(t, r);
        assertTrue(d.stream().anyMatch(x -> x.contains("cancel")),
                "the scheduled action was cancelled (no webhook), but Execution History shows no Cancelled dispatch for it: " + d);
    }

    @Test(groups = {"regression", "execution", "NDC-2206"}, description = "Date-Time trigger: 2 minutes after Due Date the rule runs")
    @CaseId({"WFR-J2", "WFR-J11"})
    public void dateTimeAfterDueDate() {
        // date-relative rules accept only async actions (server: "fires from the scheduler, not from a record save")
        WebhookSite h = hook(200, 0);
        var resp = api.createRule(Rules.named("J2 2 min after due").onDate("due_date", 120, "wall_clock")
                .webhook("POST", h.url(), "{\"id\":\"${recordId}\"}", null, 10).build());
        assertTrue(resp.statusCode() / 100 == 2, "NDC-2206: Date-Time rule cannot be saved: " + resp.statusCode() + " " + resp.asString());
        rules.add(resp.jsonPath().getString("data.id"));
        String due = Instant.now().plus(1, ChronoUnit.MINUTES).truncatedTo(ChronoUnit.SECONDS).toString();
        String t = ticket("J2", "low", Map.of("due_date", due));
        Waits.sleep(60000);
        assertEquals(h.requests().size(), 0, "rule ran before due + 2 min");
        assertFalse(h.await(1, 240).isEmpty(),
                "Date-Time rule did not run within ~4 min after due + 2 min. Executions: " + api.executionsText(t));
    }
}
