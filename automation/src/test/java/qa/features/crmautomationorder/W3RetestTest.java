package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static qa.features.crmautomationorder.CrmOrderFeature.*;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Go-live Wave 3 (26 Oct 2026): tickets the order suite does not cover — NDC-2510 (Task action with an unknown status),
 * NDC-2511 (date-field rule run not in the audit log), NDC-2421 regression (Field Update on parallel saves), NDC-2420
 * regression (workflow runs after a blueprint transition with required fields), and the NDC-2294 / missing-feature
 * checks. Session "W3" (names "QA AEO W3 …"), process admin CRM Admin A, records by the Supervisor (test user 2 has Phone read-only since 26 Oct 2026); no owner account.
 * A gap test asserts the Zoho behaviour, so it fails while the gap is open.
 */
public class W3RetestTest extends OrderTestBase {
    @Override protected String session() { return "W3"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 400 ? s.substring(0, 400) + "…" : s);
    }

    private static void note(String line) {
        System.out.println("[W3] " + line);
    }

    private String lead(String caseTag, String suffix, Map<String, Object> more) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(caseTag, suffix));
        if (more != null) f.putAll(more);
        return api.createRecord(supervisor(), LEADS, layout(LEADS), f);   // test user 2 has Phone read-only since 26 Oct 2026
    }

    // ------------------------------------------------------------------ NDC-2510

    @CaseId("W3-2510")
    @Test(groups = {"crm-order", "wave3", "NDC-2510"}, description = "A Create Task action with a status the Tasks module doesn't have is refused on save (or the run is not logged as Fired)")
    public void r2510TaskActionInvalidStatus() {
        String title = nm("2510", "follow-up");
        Map<String, Object> body = CrmProcs.workflow(LEADS, "2510 WF invalid task status").guardCase("2510").onCreate().task(title).build();
        @SuppressWarnings("unchecked") Map<String, Object> task = ((List<Map<String, Object>>) body.get("actions")).get(0);
        task.put("taskStatus", "Task Closed");
        Response save = processAdmin().post("/workflow/rules", body);
        note("2510 save with taskStatus 'Task Closed' -> " + cut(save));
        if (save.statusCode() / 100 != 2) {
            Assert.assertTrue(save.asString().contains("Task Closed") || save.asString().toLowerCase().contains("status"),
                    "refused, but the message doesn't name the invalid status: " + cut(save));
            return;
        }
        String ruleId = save.jsonPath().getString("data.id");
        api.trackRule(ruleId);
        Assert.assertEquals(api.setWorkflowActive(ruleId, true).statusCode() / 100, 2, "activate");
        String lead = lead("2510", "lead", null);
        CrmApi.waitFor(60, () -> !api.executions(lead).isEmpty());
        List<Map<String, Object>> ex = api.executions(lead);
        List<String> tasks = CrmApi.idsByName(processAdmin(), TASKS, title, 2);
        tasks.forEach(t -> api.track(TASKS, t));
        note("2510 rule saved; executions " + ex + "; tasks named '" + title + "': " + tasks.size());
        Assert.fail("a Create Task action with the unknown status 'Task Closed' was saved (" + save.statusCode() + "); run logged as "
                + ex.stream().map(e -> e.get("outcome")).toList() + ", tasks created " + tasks.size());
    }

    // ------------------------------------------------------------------ NDC-2511

    @CaseId("W3-2511")
    @Test(groups = {"crm-order", "wave3", "NDC-2511"}, description = "A rule run on a date field (Tasks Due Date) leaves an Audit Log entry naming the rule")
    public void r2511DateRuleRunIsAudited() {
        String reminder = nm("2511", "reminder");
        String ruleId = api.workflowRule(CrmProcs.workflow(TASKS, "2511 WF due date").guardCase("2511").onDate("due_date", 0).task(reminder).build());
        Assert.assertEquals(api.setWorkflowActive(ruleId, true).statusCode() / 100, 2, "activate");
        Instant due = Instant.now().plus(150, ChronoUnit.SECONDS).truncatedTo(ChronoUnit.SECONDS);
        Map<String, Object> f = CrmApi.minimal(TASKS, nm("2511", "task"));
        f.put("due_date", due.toString());
        String task = api.createRecord(supervisor(), TASKS, layout(TASKS), f);
        Instant t0 = Instant.now();
        boolean ran = CrmApi.waitFor(480, () -> !CrmApi.idsByName(processAdmin(), TASKS, reminder, 2).isEmpty());
        CrmApi.idsByName(processAdmin(), TASKS, reminder, 2).forEach(t -> api.track(TASKS, t));
        if (!ran) inconclusive("control: the date rule did not create its reminder task within 8 min (due " + due + ")");
        List<String> hits = new ArrayList<>();
        for (String app : List.of("workflow", "crm")) {
            Response a = processAdmin().get("/audit/events?app_key=" + app + "&limit=200");
            if (a.statusCode() / 100 != 2) inconclusive("audit log not readable by CRM Admin A: " + cut(a));
            List<Map<String, Object>> rows = a.jsonPath().getList("data");
            for (Map<String, Object> e : rows) {
                String s = String.valueOf(e);
                // only entries after the run time count (the rule's own create / activate entries come before it)
                if (s.contains(ruleId) && String.valueOf(e.get("occurred_at")).compareTo(due.toString().replace("Z", "")) >= 0)
                    hits.add(app + ":" + e.get("action") + "@" + e.get("occurred_at"));
            }
        }
        note("2511 rule " + ruleId + " ran (reminder made) for task " + task + " due " + due + "; audit entries naming the rule since " + t0 + ": " + hits);
        Assert.assertFalse(hits.isEmpty(),
                "the date rule ran but no Audit Log entry names its run (only: " + hits + ")");
    }

    // ------------------------------------------------------------------ NDC-2421 regression

    @CaseId("W3-2421")
    @Test(groups = {"crm-order", "wave3", "NDC-2421"}, description = "Field Update reaches every one of 12 leads created at the same moment")
    public void r2421ParallelFieldUpdate() throws Exception {
        String ruleId = api.workflowRule(CrmProcs.workflow(LEADS, "2421 WF parallel").guardCase("2421").onCreate().fieldUpdate("description", "QA W3 2421 ran").build());
        Assert.assertEquals(api.setWorkflowActive(ruleId, true).statusCode() / 100, 2, "activate");
        ExecutorService pool = Executors.newFixedThreadPool(6);
        List<String> ids = new ArrayList<>();
        try {
            List<Future<String>> f = new ArrayList<>();
            for (int i = 1; i <= 12; i++) {
                int n = i;
                CrmOrderFeature.session("W3");
                f.add(pool.submit(() -> {
                    CrmOrderFeature.session("W3");
                    CrmApi.useLayout(LEADS, layout(LEADS));
                    return lead("2421", "p" + n, null);
                }));
            }
            for (Future<String> x : f) ids.add(x.get());
        } finally {
            pool.shutdown();
        }
        CrmApi.waitFor(90, () -> ids.stream().allMatch(id -> "QA W3 2421 ran".equals(api.field(processAdmin(), LEADS, id, "description"))));
        long done = ids.stream().filter(id -> "QA W3 2421 ran".equals(api.field(processAdmin(), LEADS, id, "description"))).count();
        note("2421 parallel creates: " + done + " of " + ids.size() + " got the Field Update");
        Assert.assertEquals(done, (long) ids.size(), "Field Update lost on parallel saves");
    }

    // ------------------------------------------------------------------ NDC-2420 regression

    @CaseId("W3-2420")
    @Test(groups = {"crm-order", "wave3", "NDC-2420"}, description = "A workflow rule on Lead Source runs after a blueprint transition that has a required During field")
    public void r2420WorkflowAfterRequiredTransition() {
        Map<String, Object> during = kinded("requiredFields", List.of(kinded("name", "email", "datatype", kinded("key", "email"), "required", true)));
        Map<String, Object> t0 = new LinkedHashMap<>();
        t0.put("id", "t0");
        t0.put("name", "QA chat to web");
        t0.put("fromStateId", "chat");
        t0.put("toStateId", "web");
        t0.put("color", "#2563eb");
        t0.put("before", Map.of());
        t0.put("during", during);
        t0.put("after", Map.of("actions", List.of()));
        Map<String, Object> def = new LinkedHashMap<>();
        def.put("name", CrmProcs.name("2420 BP"));
        def.put("description", "");
        def.put("moduleKey", "leads");
        def.put("layoutId", layout(LEADS));
        def.put("targetField", "lead_source");
        def.put("continuous", false);
        def.put("entryCriteria", kinded("op", "startsWith", "field", "first_name", "value", CrmOrderFeature.prefix() + "2420"));
        def.put("states", List.of(kinded("id", "chat", "name", "chat", "position", kinded("x", 80, "y", 80), "isTerminal", false),
                kinded("id", "web", "name", "web", "position", kinded("x", 340, "y", 80), "isTerminal", true)));
        def.put("transitions", List.of(t0));
        String bp = api.blueprint(LEADS, kinded("isActive", false, "definition", def));
        Assert.assertEquals(api.setBlueprintActive(LEADS, bp, true).statusCode() / 100, 2, "blueprint on");
        String rule = api.workflowRule(CrmProcs.workflow(LEADS, "2420 WF after transition").guardCase("2420").onFieldChanged("lead_source")
                .fieldUpdate("description", "QA W3 2420 wf ran").build());
        Assert.assertEquals(api.setWorkflowActive(rule, true).statusCode() / 100, 2, "rule on");
        String lead = lead("2420", "lead", Map.of("lead_source", "chat"));
        if (!CrmApi.waitFor(30, () -> api.governed(LEADS, lead))) inconclusive("the lead never entered the blueprint");
        List<Map<String, Object>> offered = api.blueprintState(supervisor(), LEADS, lead).getList("data.transitions");
        String tid = offered == null ? null : offered.stream().map(t -> String.valueOf(t.get("transitionId"))).filter(t -> t.contains("t0")).findFirst().orElse(null);
        if (tid == null) inconclusive("transition t0 not offered: " + offered);
        Response tr = api.transition(supervisor(), LEADS, lead, tid, Map.of("email", "qa.aeo.w3.2420@qa.test"));
        boolean moved = "web".equals(api.field(processAdmin(), LEADS, lead, "lead_source"));
        boolean wf = CrmApi.waitFor(60, () -> "QA W3 2420 wf ran".equals(api.field(processAdmin(), LEADS, lead, "description")));
        note("2420 transition with required email -> " + tr.statusCode() + ", moved=" + moved + ", workflow on lead_source ran=" + wf + "; executions " + api.executions(lead));
        Assert.assertEquals(tr.statusCode() / 100, 2, "transition with the required field filled was refused: " + cut(tr));
        Assert.assertTrue(moved, "lead did not move to web");
        Assert.assertTrue(wf, "the workflow rule on Lead Source did not run after the required-field transition (NDC-2420)");
    }

    // ------------------------------------------------------------------ NDC-2294 gap 13: API "trigger": []

    @CaseId("W3-2294-13")
    @Test(groups = {"crm-order", "wave3", "NDC-2294"}, description = "Creating a record through the API with \"trigger\": [] runs no workflow (Zoho)")
    public void g13ApiTriggerEmptyRunsNoWorkflow() {
        String rule = api.workflowRule(CrmProcs.workflow(LEADS, "2294 WF trigger").guardCase("G13").onCreate().fieldUpdate("description", "QA W3 G13 ran").build());
        Assert.assertEquals(api.setWorkflowActive(rule, true).statusCode() / 100, 2, "activate");
        String control = lead("G13", "control", null);
        if (!CrmApi.waitFor(60, () -> "QA W3 G13 ran".equals(api.field(processAdmin(), LEADS, control, "description"))))
            inconclusive("control lead did not get the rule within 60 s");
        Map<String, Object> f = CrmApi.minimal(LEADS, nm("G13", "no trigger"));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout(LEADS));
        body.put("data", CrmApi.data(f));
        body.put("trigger", List.of());
        Response r = supervisor().post("/modules/" + LEADS + "/records", body);
        Assert.assertEquals(r.statusCode() / 100, 2, "create with trigger [] refused: " + cut(r));
        String id = r.jsonPath().getString("data.id");
        api.track(LEADS, id);
        CrmUser.ok(supervisor().get("/modules/" + LEADS + "/records/" + id), "read");
        qa.core.base.Waits.sleep(45_000);
        String d = api.field(processAdmin(), LEADS, id, "description");
        note("G13 control got the rule; lead with trigger [] description=" + d + " executions " + api.executions(id));
        Assert.assertNotEquals(d, "QA W3 G13 ran", "the workflow ran although the record was created with \"trigger\": [] (NDC-2294 item 13)");
    }

    // ------------------------------------------------------------------ NDC-2294 API probes + missing features

    @CaseId("W3-GAPS")
    @Test(groups = {"crm-order", "wave3", "NDC-2294", "NDC-2030", "NDC-1486"}, description = "Gap probes: workflow triggers/actions, blueprint after-actions, missing modules (schedules, scoring, cadences, macros, connected flow)")
    public void gapProbes() {
        List<String> open = new ArrayList<>();
        // triggers Zoho has: record score, notes
        for (String kind : List.of("RecordScoreChanged", "NoteAdded")) {
            Map<String, Object> b = CrmProcs.workflow(LEADS, "GAP trigger " + kind).guardCase("GAP").trigger(kind, null).fieldUpdate("description", "x").build();
            Response r = processAdmin().post("/workflow/rules", b);
            if (r.statusCode() / 100 == 2) api.trackRule(r.jsonPath().getString("data.id"));
            note("GAP trigger " + kind + " -> " + cut(r));
            if (r.statusCode() / 100 != 2) open.add("trigger " + kind);
        }
        // actions Zoho has: meeting, call, function, connected record
        for (String type : List.of("Meeting", "Call", "CustomFunction", "CreateConnectedRecord")) {
            Map<String, Object> b = CrmProcs.workflow(LEADS, "GAP action " + type).guardCase("GAP").onCreate().rawAction(kinded("type", type, "order", 0, "delaySeconds", 0)).build();
            Response r = processAdmin().post("/workflow/rules", b);
            if (r.statusCode() / 100 == 2) api.trackRule(r.jsonPath().getString("data.id"));
            note("GAP action " + type + " -> " + cut(r));
            if (r.statusCode() / 100 != 2) open.add("action " + type);
        }
        // missing features: routes answer 404
        for (String p : List.of("/workflow/schedules", "/workflow/scoring-rules", "/scoring-rules", "/workflow/cadences", "/workflow/macros", "/workflow/connected-flows")) {
            int s = processAdmin().get(p).statusCode();
            note("GAP route " + p + " -> " + s);
            if (s == 404) open.add("route " + p);
        }
        note("GAP still open: " + open);
        Assert.assertTrue(open.isEmpty(), "gaps still open: " + open);
    }
}
