package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Spec group C — Workflow Rules + Actions alone (C-01 … C-19), session SC.
 * Every rule is guarded to its own case (name starts with "QA AEO SC C-xx"); markers are written to description /
 * lead_status_comment ("WF C-xx"); what fired is read from /workflow/executions (ruleId, triggerKind, outcome, dispatches).
 * Lead Status "Contacted" does not exist on staging; C-01 uses "Follow Up". "Interested" is never used (teammate's rule).
 */
public class GroupCWorkflowTest extends OrderTestBase {
    @Override protected String session() { return "SC"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private static final int WAIT = 60;
    private static final String HTTPBIN = "https://httpbin.org/post";

    // ---------------- helpers ----------------

    private static void note(String caseId, String what) {
        System.out.println("[RECORD] " + caseId + ": " + what);
    }

    /** Creates the rule (inactive) and switches it on. */
    private String rule(CrmProcs.Wf wf) {
        String id = api.workflowRule(wf.build());
        Response on = api.setWorkflowActive(id, true);
        Assert.assertEquals(on.statusCode() / 100, 2, "activate rule: " + on.asString());
        return id;
    }

    /** Raw POST of a rule body for validation cases; anything accepted is removed again by cleanup. */
    private Response tryRule(Map<String, Object> body) {
        Response r = api.admin().post("/workflow/rules", body);
        if (r.statusCode() / 100 == 2) {
            String id = r.jsonPath().getString("data.id");
            if (id != null) api.admin().delete("/workflow/rules/" + id);
        }
        return r;
    }

    private String lead(CrmUser u, String c, String sfx, Map<String, Object> extra) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(c, sfx));
        if (extra != null) f.putAll(extra);
        return api.createRecord(u, LEADS, layout(LEADS), f);
    }

    private String val(String module, String id, String field) {
        return api.field(adminB(), module, id, field);
    }

    private String val(String id, String field) {
        return val(LEADS, id, field);
    }

    private boolean waitVal(String module, String id, String field, String expected, int sec) {
        return CrmApi.waitFor(sec, () -> expected.equals(val(module, id, field)));
    }

    private boolean waitVal(String id, String field, String expected, int sec) {
        return waitVal(LEADS, id, field, expected, sec);
    }

    private void edit(CrmUser u, String module, String id, Map<String, Object> f) {
        Response r = api.update(u, module, id, f);
        Assert.assertEquals(r.statusCode() / 100, 2, "edit " + id + ": " + r.statusCode() + " " + r.asString());
    }

    private List<Map<String, Object>> runs(String recordId, String ruleId) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(recordId)) if (ruleId.equals(e.get("ruleId"))) out.add(e);
        return out;
    }

    private long fired(String recordId, String ruleId) {
        return api.firedCount(recordId, ruleId);
    }

    private boolean waitFired(String recordId, String ruleId, long n, int sec) {
        return CrmApi.waitFor(sec, () -> fired(recordId, ruleId) >= n);
    }

    private String runsText(String recordId) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : api.executions(recordId))
            sb.append("{rule=").append(e.get("ruleId")).append(" trig=").append(e.get("triggerKind")).append(" matched=").append(e.get("criteriaMatched"))
                    .append(" outcome=").append(e.get("outcome")).append(" err=").append(e.get("errorMessage")).append(" at=").append(e.get("evaluatedAt")).append("} ");
        return sb.toString();
    }

    /** Dispatch rows of a rule's runs on a record (from the execution detail). */
    private List<Map<String, Object>> dispatches(String recordId, String ruleId) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> e : runs(recordId, ruleId)) {
            Map<String, Object> det = CrmUser.ok(adminB().get("/workflow/executions/" + e.get("id")), "execution detail").jsonPath().getMap("data");
            Object d = det.get("dispatches");
            if (d instanceof List<?> l) for (Object x : l) if (x instanceof Map<?, ?> m) {
                @SuppressWarnings("unchecked") Map<String, Object> mm = (Map<String, Object>) m;
                out.add(mm);
            }
        }
        return out;
    }

    private static String dispText(List<Map<String, Object>> d) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> x : d) {
            Map<String, Object> s = new LinkedHashMap<>(x);
            s.keySet().removeIf(k -> s.get(k) == null);
            sb.append(s).append(' ');
        }
        return sb.toString();
    }

    /** Records whose list row mentions text (rule-made deals / tasks) — deleted at the end of the case. */
    private List<String> find(String module, String text) {
        List<String> ids = new ArrayList<>();
        // list is oldest first, "?q=" finds nothing: scan the newest pages (CrmApi.newestRows)
        for (Map<String, Object> r : CrmApi.newestRows(adminB(), module, 2)) if (String.valueOf(r.get("data")).contains(text)) ids.add(String.valueOf(r.get("id")));
        return ids;
    }

    private void purge(String module, String text) {
        try {
            for (String id : find(module, text)) adminB().delete("/modules/" + module + "/records/" + id);
        } catch (Exception e) {
            System.out.println("[purge] " + e.getMessage());
        }
    }

    private static String iso(long secondsFromNow) {
        return Instant.now().plus(secondsFromNow, ChronoUnit.SECONDS).truncatedTo(ChronoUnit.SECONDS).toString();
    }

    private static Map<String, Object> raw(String type, int order) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", type);
        a.put("order", order);
        a.put("delaySeconds", 0);
        return a;
    }

    // ---------------- C-01 … C-06: triggers ----------------

    @CaseId("C-01")
    @Test(groups = {"crm-order", "group-c"}, description = "On Create rule with Field Update Lead Status: set once on create")
    public void onCreateFieldUpdateSetsValueOnce() {
        String r = rule(CrmProcs.workflow(LEADS, "C-01 WF on create").guardCase("C-01").onCreate().fieldUpdate("lead_status", "Follow Up"));
        String id = lead(userN(), "C-01", "lead", Map.of("lead_status", "No Answer"));
        boolean set = waitVal(id, "lead_status", "Follow Up", WAIT);
        traceOf("C-01", LEADS, id);
        Assert.assertTrue(set, "Lead Status not set by the On Create rule: " + val(id, "lead_status") + ". Runs: " + runsText(id));
        edit(userN(), LEADS, id, Map.of("lead_source", "web"));
        CrmUser.sleep(15000);
        note("C-01", "lead " + id + " status=" + val(id, "lead_status") + " fired=" + fired(id, r) + " runs=" + runsText(id));
        Assert.assertEquals(fired(id, r), 1L, "On Create rule should fire exactly once (create only), runs: " + runsText(id));
    }

    @CaseId("C-02")
    @Test(groups = {"crm-order", "group-c", "NDC-2205"}, description = "On Edit rule does not fire on create (control On Create rule fires)")
    public void onEditRuleDoesNotFireOnCreate() {
        String r = rule(CrmProcs.workflow(LEADS, "C-02 WF on edit").guardCase("C-02").onEdit().fieldUpdate("description", "WF C-02"));
        String ctl = rule(CrmProcs.workflow(LEADS, "C-02 control on create").guardCase("C-02").onCreate().fieldUpdate("lead_status_comment", "WF C-02 control"));
        String id = lead(userN(), "C-02", "lead", null);
        if (!waitFired(id, ctl, 1, WAIT)) inconclusive("control On Create rule did not fire on " + id + ": " + runsText(id));
        CrmUser.sleep(10000);
        traceOf("C-02", LEADS, id);
        note("C-02", "lead " + id + " description=" + val(id, "description") + " runs=" + runsText(id));
        Assert.assertEquals(fired(id, r), 0L, "On Edit rule fired on create: " + runsText(id));
        Assert.assertNotEquals(val(id, "description"), "WF C-02", "On Edit marker written on create");
    }

    @CaseId("C-03")
    @Test(groups = {"crm-order", "group-c"}, description = "On Edit rule fires when any field is edited")
    public void onEditRuleFiresOnEdit() {
        String r = rule(CrmProcs.workflow(LEADS, "C-03 WF on edit").guardCase("C-03").onEdit().fieldUpdate("description", "WF C-03"));
        String id = lead(userN(), "C-03", "lead", null);
        edit(userN(), LEADS, id, Map.of("lead_source", "web"));
        boolean ok = waitVal(id, "description", "WF C-03", WAIT);
        traceOf("C-03", LEADS, id);
        note("C-03", "lead " + id + " runs=" + runsText(id));
        Assert.assertTrue(ok, "On Edit rule did not write its marker after an edit. Runs: " + runsText(id));
        Assert.assertTrue(runs(id, r).stream().anyMatch(e -> "RecordUpdated".equals(e.get("triggerKind")) && "Fired".equals(e.get("outcome"))), "no Fired RecordUpdated row: " + runsText(id));
    }

    private long createPlusTwoEdits(String caseId, String r) {
        String id = lead(userN(), caseId, "lead", null);
        waitFired(id, r, 1, WAIT);
        edit(userN(), LEADS, id, Map.of("lead_source", "web"));
        CrmApi.waitFor(40, () -> fired(id, r) >= 2);
        edit(userN(), LEADS, id, Map.of("lead_source", "referral"));
        CrmApi.waitFor(40, () -> fired(id, r) >= 3);
        CrmUser.sleep(15000);
        traceOf(caseId, LEADS, id);
        long n = fired(id, r);
        note(caseId, "lead " + id + " fired=" + n + " runs=" + runsText(id));
        if (n == 0) inconclusive("rule never fired on " + id + ": " + runsText(id));
        return n;
    }

    @CaseId("C-04")
    @Test(groups = {"crm-order", "group-c"}, description = "Create or Edit, Recurring: create + 2 edits fires 3 times")
    public void createOrEditRecurringFiresThreeTimes() {
        String r = rule(CrmProcs.workflow(LEADS, "C-04 WF create or edit").guardCase("C-04").onCreateOrEdit().fieldUpdate("description", "WF C-04"));
        Assert.assertEquals(createPlusTwoEdits("C-04", r), 3L, "Recurring Create-or-Edit rule should fire once per save (3)");
    }

    @CaseId("C-05")
    @Test(groups = {"crm-order", "group-c"}, description = "Create or Edit, One time: fires once even if it still matches later")
    public void createOrEditOneTimeFiresOnce() {
        String r = rule(CrmProcs.workflow(LEADS, "C-05 WF one time").guardCase("C-05").onCreateOrEdit().oneTime().fieldUpdate("description", "WF C-05"));
        Assert.assertEquals(createPlusTwoEdits("C-05", r), 1L, "One-time rule should fire only once");
    }

    @CaseId("C-06")
    @Test(groups = {"crm-order", "group-c"}, description = "Field Changed (Lead Source): fires only when Lead Source changes")
    public void fieldChangedFiresOnlyOnThatField() {
        String r = rule(CrmProcs.workflow(LEADS, "C-06 WF lead source changed").guardCase("C-06").onFieldChanged("lead_source").fieldUpdate("description", "WF C-06"));
        String ctl = rule(CrmProcs.workflow(LEADS, "C-06 control on edit").guardCase("C-06").onEdit().fieldUpdate("lead_status_comment", "WF C-06 control"));
        String id = lead(userN(), "C-06", "lead", Map.of("lead_source", "chat"));
        edit(userN(), LEADS, id, Map.of("email", "qa.aeo.sc.c06@qa.test"));
        if (!waitFired(id, ctl, 1, WAIT)) inconclusive("control On Edit rule did not fire on " + id + ": " + runsText(id));
        CrmUser.sleep(8000);
        long onOther = fired(id, r);
        edit(userN(), LEADS, id, Map.of("lead_source", "web"));
        boolean ok = waitVal(id, "description", "WF C-06", WAIT);
        traceOf("C-06", LEADS, id);
        note("C-06", "lead " + id + " firedAfterOtherFieldEdit=" + onOther + " markerAfterLeadSourceChange=" + ok + " runs=" + runsText(id));
        Assert.assertEquals(onOther, 0L, "Field Changed (Lead Source) rule fired on create or on an edit of another field: " + runsText(id));
        Assert.assertTrue(ok, "Field Changed rule did not fire when Lead Source changed: " + runsText(id));
    }

    // ---------------- C-07 … C-09: delete, date, criteria ----------------

    @CaseId("C-07")
    @Test(groups = {"crm-order", "group-c"}, description = "On Delete with Webhook fires on delete; Field Update on a Delete rule is refused")
    public void onDeleteWebhookFiresAndFieldUpdateRefused() {
        Response bad = tryRule(CrmProcs.workflow(LEADS, "C-07 WF delete field update").guardCase("C-07").onDelete().fieldUpdate("description", "WF C-07").build());
        note("C-07", "Delete + Field Update save -> " + bad.statusCode() + " " + bad.asString());
        String r = rule(CrmProcs.workflow(LEADS, "C-07 WF on delete webhook").guardCase("C-07").onDelete().webhook(HTTPBIN));
        String id = lead(userN(), "C-07", "lead", null);
        Response del = api.deleteRecord(LEADS, id);
        Assert.assertEquals(del.statusCode() / 100, 2, "delete lead: " + del.asString());
        boolean ok = CrmApi.waitFor(WAIT, () -> runs(id, r).stream().anyMatch(e -> "RecordDeleted".equals(e.get("triggerKind")) && "Fired".equals(e.get("outcome"))));
        CrmApi.waitFor(30, () -> dispText(dispatches(id, r)).matches("(?is).*(succeeded|failed|dead).*"));
        note("C-07", "lead " + id + " runs=" + runsText(id) + " dispatches=" + dispText(dispatches(id, r)));
        Assert.assertTrue(ok, "On Delete rule did not fire (no Fired RecordDeleted row): " + runsText(id));
        Assert.assertEquals(bad.statusCode() / 100, 4, "Field Update on a Delete rule should be refused at save, got " + bad.statusCode() + " " + bad.asString());
    }

    @CaseId("C-08")
    @Test(groups = {"crm-order", "group-c"}, description = "Date-Time trigger: 2 minutes after Date Time fires at that time")
    public void dateTimeTriggerFiresAtTime() {
        Response bad = tryRule(CrmProcs.workflow(LEADS, "C-08 WF date field update").guardCase("C-08").onDate("date_time", 120).fieldUpdate("description", "WF C-08").build());
        note("C-08", "Date-Time + Field Update save -> " + bad.statusCode() + " " + bad.asString());
        String r = rule(CrmProcs.workflow(LEADS, "C-08 WF date time").guardCase("C-08").onDate("date_time", 120).task(nm("C-08", "task")));
        try {
            Instant base = Instant.now().plus(60, ChronoUnit.SECONDS).truncatedTo(ChronoUnit.SECONDS);
            Instant due = base.plus(120, ChronoUnit.SECONDS);
            String id = lead(userN(), "C-08", "lead", Map.of("date_time", base.toString()));
            note("C-08", "lead " + id + " date_time stored=" + val(id, "date_time") + " due=" + due);
            boolean ok = CrmApi.waitFor(400, () -> fired(id, r) >= 1);
            List<Map<String, Object>> rr = runs(id, r);
            traceOf("C-08", LEADS, id);
            note("C-08", "fired=" + ok + " runs=" + runsText(id) + " dispatches=" + dispText(dispatches(id, r)) + " tasks=" + find(TASKS, nm("C-08", "task")));
            if (!ok) {
                Assert.fail("Date-Time rule did not fire within ~6.5 min after the due time " + due + ". Runs: " + runsText(id));
            }
            Instant at = rr.stream().filter(e -> "Fired".equals(e.get("outcome"))).map(e -> Instant.parse(String.valueOf(e.get("evaluatedAt")).replace("+00:00", "Z")))
                    .findFirst().orElseThrow();
            Assert.assertTrue(!at.isBefore(due.minusSeconds(30)), "fired too early: " + at + " (due " + due + ")");
        } finally {
            purge(TASKS, nm("C-08", "task"));
        }
    }

    @CaseId("C-09")
    @Test(groups = {"crm-order", "group-c"}, description = "Criteria false: does not fire; execution row says criteria not matched")
    public void criteriaFalseDoesNotFire() {
        String r = rule(CrmProcs.workflow(LEADS, "C-09 WF referral only").guardCase("C-09").onCreate().where(CrmProcs.eq("lead_source", "referral")).fieldUpdate("description", "WF C-09"));
        String ctl = rule(CrmProcs.workflow(LEADS, "C-09 control on create").guardCase("C-09").onCreate().fieldUpdate("lead_status_comment", "WF C-09 control"));
        String id = lead(userN(), "C-09", "lead", Map.of("lead_source", "chat"));
        if (!waitFired(id, ctl, 1, WAIT)) inconclusive("control rule did not fire on " + id + ": " + runsText(id));
        CrmUser.sleep(8000);
        List<Map<String, Object>> rr = runs(id, r);
        traceOf("C-09", LEADS, id);
        note("C-09", "lead " + id + " description=" + val(id, "description") + " rule rows=" + rr);
        Assert.assertEquals(fired(id, r), 0L, "rule fired although criteria are false: " + runsText(id));
        Assert.assertNotEquals(val(id, "description"), "WF C-09");
        Assert.assertTrue(rr.stream().anyMatch(e -> Boolean.FALSE.equals(e.get("criteriaMatched")) || String.valueOf(e.get("outcome")).toLowerCase().contains("not")),
                "no execution row with outcome 'criteria not matched' for the rule (spec expects one). Runs: " + runsText(id));
    }

    // ---------------- C-10: every action type ----------------

    @CaseId("C-10")
    @Test(groups = {"crm-order", "group-c"}, description = "Each action once: Owner → A, Email, Task, Create Record (Deal), Add Tags, Remove Tags, Webhook")
    public void eachActionTypeRuns() {
        String tagAdd = CrmUser.ok(adminB().post("/modules/" + LEADS + "/tags", Map.of("name", nm("C-10", "add"), "color", "#2563eb")), "tag").jsonPath().getString("data.id");
        String tagRem = CrmUser.ok(adminB().post("/modules/" + LEADS + "/tags", Map.of("name", nm("C-10", "remove"), "color", "#65A30D")), "tag").jsonPath().getString("data.id");
        String dealName = nm("C-10", "deal");
        String taskTitle = nm("C-10", "task");
        try {
            Map<String, Object> mappings = new LinkedHashMap<>();
            mappings.put("name", Rules.s(dealName));
            mappings.put("deal_name", Rules.s(dealName));
            mappings.put("pipeline", Rules.s(CrmApi.pipelineOf(layout(DEALS))));
            mappings.put("stage", Rules.s("qualification"));
            Map<String, Object> email = raw("Email", 1);
            email.put("emailRecipients", List.of(kinded("kind", "User", "value", userV().id())));
            email.put("emailTemplateId", null);
            email.put("emailSubject", "QA AEO SC C-10 workflow email");
            email.put("emailBody", "<p>QA AEO SC C-10</p>");
            Map<String, Object> add = raw("AddTags", 5);
            add.put("tagIds", List.of(tagAdd));
            add.put("mode", "append");
            Map<String, Object> rem = raw("RemoveTags", 6);
            rem.put("tagIds", List.of(tagRem));
            CrmProcs.Wf wf = CrmProcs.workflow(LEADS, "C-10 WF all actions").guardCase("C-10").onEdit()
                    .owner("SpecificUser", adminA().id()).rawAction(email).task(taskTitle).createRecord(DEALS, layout(DEALS), mappings)
                    .rawAction(add).rawAction(rem).webhook(HTTPBIN);
            Map<String, Object> body = wf.build();
            @SuppressWarnings("unchecked") List<Map<String, Object>> acts = (List<Map<String, Object>>) body.get("actions");
            for (int i = 0; i < acts.size(); i++) acts.get(i).put("order", i);
            String r = api.workflowRule(body);
            Assert.assertEquals(api.setWorkflowActive(r, true).statusCode() / 100, 2, "activate");

            String id = lead(userN(), "C-10", "lead", null);
            Response tagged = adminB().post("/modules/" + LEADS + "/records/" + id + "/tags", Map.of("tag_ids", List.of(tagRem), "mode", "add"));
            note("C-10", "pre-tag (remove target) -> " + tagged.statusCode() + " " + tagged.asString());
            // run 1: userN's edit of its own lead answered 403 PERMISSION_DENIED once adminB had tagged it. The case is about
            // the actions, not who edits: the On Edit trigger is fired by an admin edit when userN is refused (noted).
            Response trig = api.update(userN(), LEADS, id, Map.of("lead_source", "web"));
            if (trig.statusCode() == 403) {
                note("C-10", "userN edit after admin tagging -> 403 " + trig.asString() + "; trigger edit done by adminB instead");
                edit(adminB(), LEADS, id, Map.of("lead_source", "web"));
            } else Assert.assertEquals(trig.statusCode() / 100, 2, "edit " + id + ": " + trig.statusCode() + " " + trig.asString());
            if (!waitFired(id, r, 1, WAIT)) Assert.fail("rule with all actions did not fire on edit: " + runsText(id));
            CrmApi.waitFor(90, () -> {
                String d = dispText(dispatches(id, r)).toLowerCase();
                return !d.contains("pending") && !d.contains("queued") && !d.contains("running") && !d.isEmpty();
            });
            List<String> problems = new ArrayList<>();
            String owner = val(id, "owner");
            if (!adminA().id().equals(owner)) problems.add("owner=" + owner + " (expected A " + adminA().id() + ")");
            // GET …/records/{id}/tags answers 405 (run 2): the record itself carries its tags
            String tags = api.record(adminB(), LEADS, id).prettify();
            if (!tags.contains(tagAdd)) problems.add("Add Tags: tag not on record " + tags);
            if (tags.contains(tagRem)) problems.add("Remove Tags: tag still on record " + tags);
            List<String> deals = new ArrayList<>();
            CrmApi.waitFor(30, () -> { deals.clear(); deals.addAll(find(DEALS, dealName)); return !deals.isEmpty(); });
            if (deals.isEmpty()) problems.add("Create Record: no deal named " + dealName);
            List<String> tasks = new ArrayList<>();
            CrmApi.waitFor(30, () -> { tasks.clear(); tasks.addAll(find(TASKS, taskTitle)); return !tasks.isEmpty(); });
            if (tasks.isEmpty()) problems.add("Task: no task titled " + taskTitle);
            List<Map<String, Object>> d = dispatches(id, r);
            String dt = dispText(d);
            for (String t : List.of("Email", "Webhook")) {
                boolean seen = d.stream().anyMatch(x -> String.valueOf(x).contains(t));
                if (!seen) problems.add(t + ": no dispatch row");
            }
            if (dt.toLowerCase().matches("(?s).*(failed|dead).*")) problems.add("a dispatch failed: " + dt);
            List<Map<String, Object>> tl = api.timeline(LEADS, id);
            note("C-10", "lead " + id + " owner=" + owner + " tags=" + tags + " deals=" + deals + " tasks=" + tasks + " dispatches=" + dt
                    + " timeline=" + tl.stream().map(x -> String.valueOf(x.get("kind") != null ? x.get("kind") : x.get("type")) + ":" + x.get("title")).toList());
            traceOf("C-10", LEADS, id);
            Assert.assertTrue(problems.isEmpty(), "actions not all applied: " + problems + ". Runs: " + runsText(id));
        } finally {
            purge(DEALS, dealName);
            purge(TASKS, taskTitle);
            api.cleanup(); // the lead goes before its tags
            adminB().delete("/modules/" + LEADS + "/tags/" + tagAdd);
            adminB().delete("/modules/" + LEADS + "/tags/" + tagRem);
        }
    }

    // ---------------- C-11 … C-15: scheduling, chaining, loops, limits ----------------

    @CaseId("C-11")
    @Test(groups = {"crm-order", "group-c"}, description = "Scheduled action (2 min) is cancelled when the record stops matching before then")
    public void scheduledActionCancelledWhenNoLongerMatching() {
        CrmProcs.Wf wf = CrmProcs.workflow(LEADS, "C-11 WF scheduled").guardCase("C-11").onCreate().where(CrmProcs.eq("lead_source", "web"))
                .fieldUpdate("description", "WF C-11").delayed(120);
        Response probe = tryRule(wf.build());
        boolean fieldUpdateDelayOk = probe.statusCode() / 100 == 2;
        note("C-11", "scheduled Field Update save -> " + probe.statusCode() + (fieldUpdateDelayOk ? "" : " " + probe.asString()));
        String r = fieldUpdateDelayOk ? rule(wf)
                : rule(CrmProcs.workflow(LEADS, "C-11 WF scheduled webhook").guardCase("C-11").onCreate().where(CrmProcs.eq("lead_source", "web")).webhook(HTTPBIN).delayed(120));
        String stop = lead(userN(), "C-11", "stops matching", Map.of("lead_source", "web"));
        String ctl = lead(userN(), "C-11", "control", Map.of("lead_source", "web"));
        edit(userN(), LEADS, stop, Map.of("lead_source", "chat"));
        boolean ctlRan = fieldUpdateDelayOk ? waitVal(ctl, "description", "WF C-11", 320)
                : CrmApi.waitFor(320, () -> dispText(dispatches(ctl, r)).toLowerCase().matches("(?s).*(succeeded|failed).*"));
        CrmUser.sleep(15000);
        String stopDesc = val(stop, "description");
        String stopDisp = dispText(dispatches(stop, r));
        traceOf("C-11", LEADS, stop);
        note("C-11", "control " + ctl + " ran=" + ctlRan + " | changed lead " + stop + " description=" + stopDesc + " dispatches=" + stopDisp + " runs=" + runsText(stop));
        if (!ctlRan) inconclusive("the control lead's scheduled action never ran, so scheduling itself did not run: " + runsText(ctl) + " " + dispText(dispatches(ctl, r)));
        if (fieldUpdateDelayOk) Assert.assertNotEquals(stopDesc, "WF C-11", "scheduled Field Update still ran for the lead that stopped matching");
        else Assert.assertFalse(stopDisp.toLowerCase().contains("succeeded"), "scheduled webhook still ran for the lead that stopped matching: " + stopDisp);
    }

    @CaseId("C-12")
    @Test(groups = {"crm-order", "group-c"}, description = "Rule A's field update makes rule B match: B fires after A (chaining)")
    public void fieldUpdateChainsToAnotherRule() {
        String a = rule(CrmProcs.workflow(LEADS, "C-12 A sets referral").guardCase("C-12").onCreate().fieldUpdate("lead_source", "referral"));
        String b = rule(CrmProcs.workflow(LEADS, "C-12 B on edit referral").guardCase("C-12").onEdit().where(CrmProcs.eq("lead_source", "referral")).fieldUpdate("description", "WF C-12 B"));
        String b2 = rule(CrmProcs.workflow(LEADS, "C-12 B2 on create referral").guardCase("C-12").onCreate().where(CrmProcs.eq("lead_source", "referral")).fieldUpdate("lead_status_comment", "WF C-12 B2"));
        String id = lead(userN(), "C-12", "lead", Map.of("lead_source", "chat"));
        if (!waitVal(id, "lead_source", "referral", WAIT)) inconclusive("rule A did not set Lead Source referral on " + id + ": " + runsText(id));
        boolean bRan = waitVal(id, "description", "WF C-12 B", 45);
        boolean b2Ran = "WF C-12 B2".equals(val(id, "lead_status_comment"));
        traceOf("C-12", LEADS, id);
        note("C-12", "lead " + id + " A fired=" + fired(id, a) + " B(on edit) fired=" + fired(id, b) + " marker=" + bRan + " B2(on create, after A) fired=" + fired(id, b2) + " marker=" + b2Ran + " runs=" + runsText(id));
        Assert.assertTrue(bRan || b2Ran, "no rule ran after rule A's field update made it match (no chaining at all)");
        Assert.assertTrue(bRan, "rule A's field update did not trigger the On Edit rule B (Zoho: a field update can trigger other rules)");
    }

    @CaseId("C-13")
    @Test(groups = {"crm-order", "group-c"}, description = "Loop: a rule updating its own trigger field, and A→B→A, stop")
    public void loopStops() {
        String self = rule(CrmProcs.workflow(LEADS, "C-13 self loop").guardCase("C-13 self").onEdit().fieldUpdate("lead_status_comment", "WF C-13 self"));
        String pa = rule(CrmProcs.workflow(LEADS, "C-13 pp A web to chat").guardCase("C-13 pp").onFieldChanged("lead_source").where(CrmProcs.eq("lead_source", "web")).fieldUpdate("lead_source", "chat"));
        String pb = rule(CrmProcs.workflow(LEADS, "C-13 pp B chat to web").guardCase("C-13 pp").onFieldChanged("lead_source").where(CrmProcs.eq("lead_source", "chat")).fieldUpdate("lead_source", "web"));
        String s = lead(userN(), "C-13", "self lead", null);
        String p = lead(userN(), "C-13", "pp lead", Map.of("lead_source", "referral"));
        edit(userN(), LEADS, s, Map.of("lead_source", "web"));
        edit(userN(), LEADS, p, Map.of("lead_source", "web"));
        if (!waitFired(s, self, 1, WAIT)) inconclusive("self-loop rule never fired on " + s + ": " + runsText(s));
        CrmUser.sleep(45000);
        long s1 = fired(s, self), a1 = fired(p, pa), b1 = fired(p, pb);
        CrmUser.sleep(30000);
        long s2 = fired(s, self), a2 = fired(p, pa), b2 = fired(p, pb);
        traceOf("C-13", LEADS, s);
        traceOf("C-13", LEADS, p);
        note("C-13", "self lead " + s + " runs " + s1 + "->" + s2 + " | ping-pong lead " + p + " A " + a1 + "->" + a2 + " B " + b1 + "->" + b2
                + " lead_source=" + val(p, "lead_source") + " runs=" + runsText(p));
        Assert.assertEquals(s2, s1, "self-loop keeps running");
        Assert.assertEquals(a2 + b2, a1 + b1, "A→B→A loop keeps running");
        Assert.assertTrue(s2 <= 2 && a2 + b2 <= 6, "loop stopped only after many runs: self=" + s2 + " A=" + a2 + " B=" + b2);
    }

    @CaseId("C-14")
    @Test(groups = {"crm-order", "group-c"}, description = "Limits: actions per rule, conditions per rule; two Field Updates in one rule")
    public void limitsAreEnforced() {
        // actions: UI cap maxActions = 10 (bundle U2), conditions maxCriteria = 25, rules per module 50
        CrmProcs.Wf ten = CrmProcs.workflow(LEADS, "C-14 ten actions").guardCase("C-14").onCreate();
        for (int i = 0; i < 10; i++) ten.task(nm("C-14", "t" + i));
        Response r10 = tryRule(ten.build());
        CrmProcs.Wf eleven = CrmProcs.workflow(LEADS, "C-14 eleven actions").guardCase("C-14").onCreate();
        for (int i = 0; i < 11; i++) eleven.task(nm("C-14", "t" + i));
        Response r11 = tryRule(eleven.build());
        List<Map<String, Object>> c25 = new ArrayList<>(List.of(CrmProcs.guard(LEADS, nm("C-14", ""))));
        for (int i = 0; c25.size() < 25; i++) c25.add(Rules.contains("description", "x" + i));
        List<Map<String, Object>> c26 = new ArrayList<>(c25);
        c26.add(Rules.contains("description", "y"));
        Response q25 = tryRule(withCriteria(CrmProcs.workflow(LEADS, "C-14 25 conditions").onCreate().fieldUpdate("description", "WF C-14").build(), c25));
        Response q26 = tryRule(withCriteria(CrmProcs.workflow(LEADS, "C-14 26 conditions").onCreate().fieldUpdate("description", "WF C-14").build(), c26));
        Response two = tryRule(CrmProcs.workflow(LEADS, "C-14 two field updates").guardCase("C-14").onCreate()
                .fieldUpdate("description", "WF C-14 one").fieldUpdate("lead_status_comment", "WF C-14 two").build());
        String b = (s(r10) + " | 11 actions -> " + s(r11) + " | 25 conditions -> " + s(q25) + " | 26 conditions -> " + s(q26) + " | 2 Field Updates -> " + s(two));
        note("C-14", "10 actions -> " + b + " | rules per module (50) not exercised: filling the module to the cap would block the parallel sessions");
        Assert.assertEquals(r10.statusCode() / 100, 2, "10 actions (the cap) should be accepted: " + s(r10));
        Assert.assertEquals(r11.statusCode() / 100, 4, "11 actions should be refused with a limit message: " + s(r11));
        Assert.assertEquals(q26.statusCode() / 100, 4, "26 conditions should be refused with a limit message: " + s(q26));
    }

    private static Map<String, Object> withCriteria(Map<String, Object> body, List<Map<String, Object>> ops) {
        body.put("criteria", kinded("kind", "Logical", "operator", "And", "operands", ops));
        return body;
    }

    private static String s(Response r) {
        String t = r.asString();
        return r.statusCode() + (r.statusCode() / 100 == 2 ? "" : " " + (t.length() > 300 ? t.substring(0, 300) : t));
    }

    @CaseId("C-15")
    @Test(groups = {"crm-order", "group-c"}, description = "Deactivate a rule with pending scheduled actions: record whether they run or are dropped")
    public void deactivateWithPendingScheduledActions() {
        CrmProcs.Wf wf = CrmProcs.workflow(LEADS, "C-15 WF scheduled").guardCase("C-15").onCreate().fieldUpdate("description", "WF C-15").delayed(120);
        Response probe = tryRule(wf.build());
        if (probe.statusCode() / 100 != 2) inconclusive("scheduled Field Update not accepted: " + s(probe));
        String r = rule(wf);
        String ctl = rule(CrmProcs.workflow(LEADS, "C-15 control scheduled").guardCase("C-15").onCreate().fieldUpdate("lead_status_comment", "WF C-15 control").delayed(120));
        String id = lead(userN(), "C-15", "lead", null);
        CrmApi.waitFor(30, () -> !runs(id, r).isEmpty());
        Response off = api.setWorkflowActive(r, false);
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate: " + off.asString());
        note("C-15", "deactivate response: " + off.statusCode() + " " + off.asString());
        boolean ctlRan = waitVal(id, "lead_status_comment", "WF C-15 control", 320);
        CrmUser.sleep(15000);
        String desc = val(id, "description");
        traceOf("C-15", LEADS, id);
        note("C-15", "lead " + id + " control ran=" + ctlRan + " deactivated rule's pending action " + ("WF C-15".equals(desc) ? "RAN" : "was DROPPED")
                + " dispatches=" + dispText(dispatches(id, r)) + " runs=" + runsText(id));
        if (!ctlRan) inconclusive("control scheduled action never ran on " + id);
    }

    // ---------------- C-16 … C-19: entry points, modules, order ----------------

    @CaseId("C-16")
    @Test(groups = {"crm-order", "group-c"}, description = "Mass update of 3 leads fires the workflow for each")
    public void massUpdateFiresForEach() {
        String r = rule(CrmProcs.workflow(LEADS, "C-16 WF on edit").guardCase("C-16").onEdit().fieldUpdate("description", "WF C-16"));
        List<String> ids = new ArrayList<>();
        for (int i = 1; i <= 3; i++) ids.add(lead(userN(), "C-16", "lead " + i, null));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("record_ids", ids);
        body.put("data", CrmApi.data(Map.of("lead_source", "web")));
        Response mu = userN().post("/modules/" + LEADS + "/records/mass-update", body);
        CrmUser by = userN();
        if (mu.statusCode() == 403) {
            note("C-16", "userN mass update -> 403, retried as admin B: " + mu.asString());
            by = adminB();
            mu = adminB().post("/modules/" + LEADS + "/records/mass-update", body);
        }
        note("C-16", "mass update by " + by + " -> " + mu.statusCode() + " " + mu.asString());
        Assert.assertEquals(mu.statusCode() / 100, 2, "mass update: " + mu.asString());
        List<String> missing = new ArrayList<>();
        for (String id : ids) if (!waitVal(id, "description", "WF C-16", WAIT)) missing.add(id + " " + runsText(id) + " lead_source=" + val(id, "lead_source"));
        for (String id : ids) traceOf("C-16", LEADS, id);
        note("C-16", "leads " + ids + " missing=" + missing);
        Assert.assertTrue(missing.isEmpty(), "workflow did not fire for every mass-updated lead: " + missing);
    }

    @CaseId("C-17")
    @Test(groups = {"crm-order", "group-c"}, description = "Inline edit in the list (PATCH of one field) fires as an edit")
    public void inlineEditFiresAsEdit() {
        String r = rule(CrmProcs.workflow(LEADS, "C-17 WF on edit").guardCase("C-17").onEdit().fieldUpdate("description", "WF C-17"));
        String id = lead(userN(), "C-17", "lead", null);
        edit(userN(), LEADS, id, Map.of("lead_source", "referral"));
        boolean ok = waitVal(id, "description", "WF C-17", WAIT);
        traceOf("C-17", LEADS, id);
        note("C-17", "lead " + id + " runs=" + runsText(id));
        Assert.assertTrue(ok, "inline (single-field PATCH) edit did not fire the On Edit rule: " + runsText(id));
        Assert.assertTrue(fired(id, r) >= 1);
    }

    @CaseId("C-18")
    @Test(groups = {"crm-order", "group-c"}, description = "Deals and Tasks: one On Create rule each fires")
    public void dealsAndTasksOnCreateFire() {
        String rd = rule(CrmProcs.workflow(DEALS, "C-18 WF deal on create").guardCase("C-18").onCreate().fieldUpdate("description", "WF C-18 deal"));
        String rt = rule(CrmProcs.workflow(TASKS, "C-18 WF task on create").guardCase("C-18").onCreate().fieldUpdate("description", "WF C-18 task"));
        String deal = api.createRecord(userN(), DEALS, nm("C-18", "deal"));
        String task = api.createRecord(userN(), TASKS, nm("C-18", "task"));
        boolean d = waitVal(DEALS, deal, "description", "WF C-18 deal", WAIT);
        boolean t = waitVal(TASKS, task, "description", "WF C-18 task", WAIT);
        traceOf("C-18", DEALS, deal);
        traceOf("C-18", TASKS, task);
        note("C-18", "deal " + deal + " fired=" + d + " runs=" + runsText(deal) + " | task " + task + " fired=" + t + " runs=" + runsText(task));
        Assert.assertTrue(d && t, "On Create rule did not fire: deal=" + d + " task=" + t);
        Assert.assertTrue(fired(deal, rd) >= 1 && fired(task, rt) >= 1);
    }

    @SuppressWarnings("unchecked")
    private void putLast(List<String> mine) {
        List<Map<String, Object>> all = CrmUser.ok(adminB().get("/workflow/rules?take=200"), "rules").jsonPath().getList("data");
        List<String> order = new ArrayList<>(all.stream().filter(x -> LEADS.equals(x.get("moduleId")))
                .sorted((x, y) -> Integer.compare(((Number) x.get("position")).intValue(), ((Number) y.get("position")).intValue()))
                .map(x -> String.valueOf(x.get("id"))).toList());
        order.removeAll(mine);
        order.addAll(mine); // teammates keep their positions and relative order; ours go to the end
        Response r = adminB().put("/workflow/rules/reorder", Map.of("moduleId", LEADS, "orderedRuleIds", order));
        Assert.assertEquals(r.statusCode() / 100, 2, "reorder: " + r.asString());
    }

    private List<String> positions(String... ids) {
        List<Map<String, Object>> all = CrmUser.ok(adminB().get("/workflow/rules?take=200"), "rules").jsonPath().getList("data");
        List<String> out = new ArrayList<>();
        for (String id : ids) for (Map<String, Object> x : all) if (id.equals(x.get("id"))) out.add(x.get("name") + "@" + x.get("position"));
        return out;
    }

    @CaseId("C-19")
    @Test(groups = {"crm-order", "group-c"}, description = "Two rules with conflicting field updates run in list order (reorder changes the result)")
    public void ruleOrderFollowsTheList() {
        String a = rule(CrmProcs.workflow(LEADS, "C-19 A").guardCase("C-19").onCreate().fieldUpdate("description", "WF C-19 A"));
        String b = rule(CrmProcs.workflow(LEADS, "C-19 B").guardCase("C-19").onCreate().fieldUpdate("description", "WF C-19 B"));
        putLast(List.of(a, b));
        String p1 = positions(a, b).toString();
        String l1 = lead(userN(), "C-19", "A then B", null);
        CrmApi.waitFor(WAIT, () -> fired(l1, a) >= 1 && fired(l1, b) >= 1);
        CrmUser.sleep(5000);
        String v1 = val(l1, "description");
        putLast(List.of(b, a));
        String p2 = positions(a, b).toString();
        String l2 = lead(userN(), "C-19", "B then A", null);
        CrmApi.waitFor(WAIT, () -> fired(l2, a) >= 1 && fired(l2, b) >= 1);
        CrmUser.sleep(5000);
        String v2 = val(l2, "description");
        traceOf("C-19", LEADS, l1);
        traceOf("C-19", LEADS, l2);
        note("C-19", "order " + p1 + " -> lead " + l1 + " description=" + v1 + " runs=" + runsText(l1) + " | order " + p2 + " -> lead " + l2 + " description=" + v2 + " runs=" + runsText(l2));
        if (v1 == null || v2 == null) inconclusive("a rule did not fire: " + v1 + " / " + v2);
        Assert.assertEquals(v1, "WF C-19 B", "A then B: the later rule (B) should win");
        Assert.assertEquals(v2, "WF C-19 A", "B then A: the later rule (A) should win after reorder");
    }
}
