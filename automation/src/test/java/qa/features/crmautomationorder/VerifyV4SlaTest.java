package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/** Re-verification (19 Oct 2026): blueprint state SLA escalation, watched for 25 minutes. Session V4. */
public class VerifyV4SlaTest extends VerifyBase {
    @Override protected String session() { return "V4"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    @CaseId("E-09")
    @Test(groups = {"crm-verify"}, description = "State SLA 1 minute with a Set Field escalation: watched up to 25 minutes")
    @SuppressWarnings("unchecked")
    public void e09Sla() {
        String c = "E-09";
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), null);
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
        s0.put("slaMinutes", 1);
        s0.put("slaEscalation", List.of(CrmProcs.setField("description", "QA E-09 SLA escalated")));
        ((List<Map<String, Object>>) def.get("states")).set(0, s0);
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        get(c, adminB(), "/modules/" + LEADS + "/blueprints/" + bp);
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        get(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/blueprint-state");
        long t0 = System.currentTimeMillis();
        boolean fired = CrmApi.waitFor(1500, () -> "QA E-09 SLA escalated".equals(val(LEADS, id, "description")));
        Response st = get(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/blueprint-state");
        fact(c, "lead " + id + " escalation fired=" + fired + " after ~" + (System.currentTimeMillis() - t0) / 1000 + "s; description=" + val(LEADS, id, "description"));
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }

    @CaseId("E-09")
    @Test(groups = {"crm-verify"}, description = "Retest 20 Oct: state SLA 1 minute with Field Update + Create Task + Webhook escalation; SLA state logged every minute for 15 minutes")
    @SuppressWarnings("unchecked")
    public void e09SlaRetest() {
        String c = "E-09r";
        String subject = nm(c, "SLA task");
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), null);
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", kinded("name", subject, "subject", subject, "status", "Not Started", "priority", "normal"));
        task.put("assigneeMode", "owner");
        task.put("assigneeUserId", null);
        s0.put("slaMinutes", 1);
        s0.put("slaEscalation", List.of(CrmProcs.setField("description", "QA E-09r SLA escalated"), task,
                kinded("kind", "webhook", "url", "https://httpbin.org/post", "verb", "POST")));
        ((List<Map<String, Object>>) def.get("states")).set(0, s0);
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        get(c, adminB(), "/modules/" + LEADS + "/blueprints/" + bp);
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        long t0 = System.currentTimeMillis();
        boolean fieldDone = false;
        List<String> tasks = new java.util.ArrayList<>();
        for (int min = 0; min <= 15; min++) {
            Response st = CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id + "/blueprint-state"), "state");
            fieldDone = "QA E-09r SLA escalated".equals(val(LEADS, id, "description"));
            tasks.clear();
            for (Map<String, Object> row : CrmApi.newestRows(api.admin(), CrmOrderFeature.TASKS, 2)) if (String.valueOf(row).contains(subject)) tasks.add(String.valueOf(row.get("id")));
            fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s state=" + st.jsonPath().getList("data.states.activeStates")
                    + " slaDueAt=" + st.jsonPath().getList("data.states.slaDueAt") + " fieldUpdate=" + fieldDone + " tasks=" + tasks);
            if (fieldDone && !tasks.isEmpty()) break;
            if (min < 15) CrmUser.sleep(60000);
        }
        for (String t : tasks) extra.add(new String[]{CrmOrderFeature.TASKS, t});
        fact(c, "RESULT lead " + id + " fieldUpdate=" + fieldDone + " task=" + !tasks.isEmpty() + " after ~" + (System.currentTimeMillis() - t0) / 1000 + "s");
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }

    private static final String MEETINGS = "f13e02be-03d3-46c3-a74e-22c7770823ca";
    private static final String CALLS = "e72e608a-a5d3-45cf-888a-dfadc6e8b456";
    private static final String ACCOUNTS = "b2398920-2914-4836-be53-81bd960effea";

    /**
     * 21 Oct: every SLA escalation action the designer offers (Field Update, Email, Notification, Task, Meeting, Call,
     * Create Record, Webhook), 1-minute SLA, run twice in opposite orders so "the first action is skipped" is ruled out.
     */
    @CaseId("E-09")
    @Test(groups = {"crm-verify"}, description = "SLA escalation sweep: all 8 action types, two orders, observed for 5 minutes after the SLA")
    @SuppressWarnings("unchecked")
    public void e09SlaAllActions() {
        if (!Boolean.getBoolean("slasweep")) throw new org.testng.SkipException("one-off: run with -Dslasweep=true");
        for (boolean reversed : new boolean[]{false, true}) {
            String c = reversed ? "E-09b" : "E-09a";
            String tag = nm(c, "SLA");
            Map<String, Object> mail = new LinkedHashMap<>();
            mail.put("kind", "sendEmail");
            mail.put("to", List.of());
            mail.put("userIds", List.of(adminB().id()));
            mail.put("subject", tag + " email");
            mail.put("bodyHtml", "<p>" + tag + " email</p>");
            Map<String, Object> task = new LinkedHashMap<>();
            task.put("kind", "createTask");
            task.put("targetModuleKey", "tasks");
            task.put("fields", kinded("name", tag + " task", "subject", tag + " task", "status", "Not Started", "priority", "normal"));
            task.put("assigneeMode", "owner");
            task.put("assigneeUserId", null);
            Map<String, Object> meeting = kinded("kind", "createRecord", "targetModuleKey", "meetings", "fields", kinded("name", tag + " meeting",
                    "title", tag + " meeting", "meeting_venue", "online", "from_time", "2026-10-30T10:00:00Z", "to_time", "2026-10-30T11:00:00Z"));
            Map<String, Object> call = kinded("kind", "createRecord", "targetModuleKey", "calls", "fields", kinded("name", tag + " call",
                    "call_type", "outbound", "call_start_time", "2026-10-30T10:00:00Z", "call_duration", "10"));
            Map<String, Object> account = kinded("kind", "createRecord", "targetModuleKey", "accounts", "fields", kinded("name", tag + " account",
                    "account_name", tag + " account"));
            List<Map<String, Object>> actions = new java.util.ArrayList<>(List.of(
                    task,
                    CrmProcs.setField("description", tag + " field update"),
                    mail,
                    kinded("kind", "sendNotification", "title", tag + " notification", "body", tag, "notifyOwner", true, "recipientMode", "owner"),
                    meeting, call, account,
                    kinded("kind", "webhook", "url", "https://httpbin.org/post", "verb", "POST")));
            if (reversed) java.util.Collections.reverse(actions);
            List<String> order = new java.util.ArrayList<>();
            for (Map<String, Object> a : actions) order.add(a.get("kind") + (a.get("targetModuleKey") != null ? ":" + a.get("targetModuleKey") : ""));
            Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                    List.of("chat", "web", "referral"), null);
            Map<String, Object> def = (Map<String, Object>) body.get("definition");
            Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
            s0.put("slaMinutes", 1);
            s0.put("slaEscalation", actions);
            ((List<Map<String, Object>>) def.get("states")).set(0, s0);
            String bp = api.blueprint(LEADS, body);
            on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
            fact(c, "action order " + order);
            Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
            f.put("lead_source", "chat");
            String id = createLogged(c, userN(), LEADS, f);
            CrmApi.waitFor(45, () -> api.governed(LEADS, id));
            Response st0 = CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id + "/blueprint-state"), "state");
            fact(c, "lead " + id + " slaDueAt=" + st0.jsonPath().getList("data.states.slaDueAt"));
            Map<String, String> seen = new LinkedHashMap<>();
            long t0 = System.currentTimeMillis();
            for (int i = 0; i <= 12; i++) {
                if ((tag + " field update").equals(val(LEADS, id, "description"))) seen.putIfAbsent("setField", "+" + (System.currentTimeMillis() - t0) / 1000 + "s");
                for (Object[] m : new Object[][]{{"createTask", CrmOrderFeature.TASKS, tag + " task"}, {"meeting", MEETINGS, tag + " meeting"},
                        {"call", CALLS, tag + " call"}, {"account", ACCOUNTS, tag + " account"}}) {
                    if (seen.containsKey((String) m[0])) continue;
                    for (Map<String, Object> row : CrmApi.newestRows(api.admin(), (String) m[1], 2))
                        if (String.valueOf(row).contains((String) m[2])) {
                            seen.put((String) m[0], "+" + (System.currentTimeMillis() - t0) / 1000 + "s id=" + row.get("id"));
                            extra.add(new String[]{(String) m[1], String.valueOf(row.get("id"))});
                        }
                }
                if (!seen.containsKey("sendEmail") && adminB().get("/mail/records/leads/" + id + "/emails").asString().contains(tag))
                    seen.put("sendEmail", "+" + (System.currentTimeMillis() - t0) / 1000 + "s");
                if (!seen.containsKey("sendNotification") && userN().get("/notifications?take=30").asString().contains(tag + " notification"))
                    seen.put("sendNotification", "+" + (System.currentTimeMillis() - t0) / 1000 + "s");
                Response st = CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id + "/blueprint-state"), "state");
                fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s slaDueAt=" + st.jsonPath().getList("data.states.slaDueAt") + " seen=" + seen.keySet());
                if (seen.size() >= 7) break;
                if (i < 12) CrmUser.sleep(30000);
            }
            fact(c, "RESULT order=" + order + " lead=" + id + " seen=" + seen
                    + " description=" + val(LEADS, id, "description") + " modified=" + CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id), "lead").jsonPath().getString("data.last_modified_at"));
            get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
            get(c, adminB(), "/mail/records/leads/" + id + "/emails");
            on(c, "switch off " + bp, api.setBlueprintActive(LEADS, bp, false));
        }
    }

    /** 21 Oct: read-only discovery for the SLA action sweep - module ids and required fields of meetings / calls / notifications shape. */
    @Test(groups = {"crm-b15-recording"}, description = "Discover meetings/calls modules, required fields, and the notifications endpoint")
    @SuppressWarnings("unchecked")
    public void discoverSlaActionTargets() {
        if (!Boolean.getBoolean("b15disc")) throw new org.testng.SkipException("one-off: run with -Db15disc=true");
        String c = "B15disc";
        for (Object o : CrmUser.ok(adminB().get("/modules"), "modules").jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            String key = String.valueOf(m.get("key") != null ? m.get("key") : m.get("moduleKey"));
            fact(c, "module " + m.get("id") + " key=" + key + " type=" + m.get("moduleType") + " " + m.get("type"));
            if (!List.of("meetings", "calls").contains(key)) continue;
            for (Object fo : CrmUser.ok(adminB().get("/modules/" + m.get("id") + "/fields"), "fields").jsonPath().getList("data")) {
                Map<String, Object> f = (Map<String, Object>) fo;
                if (Boolean.TRUE.equals(f.get("isRequired")) || Boolean.TRUE.equals(f.get("required")) || Boolean.TRUE.equals(f.get("is_required")) || Boolean.TRUE.equals(f.get("isSystem")))
                    fact(c, "  " + key + " field " + cut(json(f), 700));
            }
        }
        get(c, userN(), "/notifications?take=3");
        get(c, userN(), "/notifications/unread-count");
    }

    /** 21 Oct: read-only check of the leads from the B-15 recordings (-Db15read=lead1,lead2). */
    @Test(groups = {"crm-b15-recording"}, description = "Read lead_status / description / Timeline of the B-15 recording leads")
    public void readB15RecordingLeads() {
        String ids = System.getProperty("b15read", "");
        if (ids.isEmpty()) throw new org.testng.SkipException("one-off: run with -Db15read=<lead ids>");
        for (String id : ids.split(",")) {
            fact("B15read", "lead " + id + " lead_status=" + val(LEADS, id, "lead_status") + " description=" + val(LEADS, id, "description")
                    + " modified=" + CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id), "lead").jsonPath().getString("data.last_modified_at"));
            get("B15read", adminB(), "/timeline/records/leads/" + id + "/feed");
        }
    }

    /** 20 Oct: leaves an ACTIVE blueprint for a manual Jam recording of B-15 (no cleanup; delete it after recording). */
    @Test(groups = {"crm-b15-recording"}, description = "Create the B-15 recording blueprint on the Standard Leads layout")
    @SuppressWarnings("unchecked")
    public void createB15RecordingBlueprint() {
        if (!Boolean.getBoolean("b15rec")) throw new org.testng.SkipException("one-off: run with -Db15rec=true");
        String c = "B15rec";
        String standard = "bf971461-2edc-45f2-b6e4-6e180aa64288";
        fact(c, "layouts " + cut(get(c, adminB(), "/modules/" + LEADS + "/layouts/accessible").asString(), 600));
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data")) {
            Map<String, Object> b = (Map<String, Object>) o;
            Map<String, Object> d = (Map<String, Object>) b.get("definition");
            fact(c, "existing blueprint " + b.get("id") + " active=" + b.get("isActive") + " name=" + (d == null ? null : d.get("name"))
                    + " layout=" + (d == null ? null : d.get("layoutId")) + " field=" + (d == null ? null : d.get("targetField")));
        }
        Map<String, Object> body = CrmProcs.blueprint("leads", standard, null, "lead_source", "QA B15 SLA recording",
                CrmProcs.guard(LEADS, "B15"), List.of("chat", "web", "referral"), null);
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        def.put("name", "QA B15 SLA recording");
        Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", kinded("name", "SLA B15 task", "subject", "SLA B15 task", "status", "Not Started", "priority", "normal"));
        task.put("assigneeMode", "owner");
        task.put("assigneeUserId", null);
        s0.put("slaMinutes", 1);
        s0.put("slaEscalation", List.of(CrmProcs.setField("description", "SLA B15"), task));
        ((List<Map<String, Object>>) def.get("states")).set(0, s0);
        Response r = post(c, adminB(), "/modules/" + LEADS + "/blueprints", body);
        String bp = CrmUser.ok(r, "create blueprint").jsonPath().getString("data.id");
        on(c, "activate " + bp, api.setBlueprintActive(LEADS, bp, true));
        fact(c, "RECORDING BLUEPRINT " + bp + " active on Standard layout; delete after recording");
    }
    /** 21 Oct: adds an SLA Email action (to -Db15mail=<address>) to the B-15 recording blueprint, keeping its other actions. */
    @Test(groups = {"crm-b15-recording"}, description = "Add an SLA Email escalation to the B-15 recording blueprint")
    @SuppressWarnings("unchecked")
    public void addB15EmailAction() {
        String to = System.getProperty("b15mail", "");
        if (to.isEmpty()) throw new org.testng.SkipException("one-off: run with -Db15mail=<address>");
        String c = "B15mail";
        String bp = null;
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data")) {
            Map<String, Object> b = (Map<String, Object>) o;
            Map<String, Object> d = (Map<String, Object>) b.get("definition");
            if (d != null && "QA B15 SLA recording".equals(d.get("name"))) bp = String.valueOf(b.get("id"));
        }
        if (bp == null) throw new IllegalStateException("QA B15 SLA recording blueprint not found");
        Map<String, Object> cur = CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints/" + bp), "GET blueprint").jsonPath().getMap("data");
        Map<String, Object> def = (Map<String, Object>) cur.get("definition");
        Map<String, Object> mail = new LinkedHashMap<>();
        mail.put("kind", "sendEmail");
        mail.put("to", List.of(to));
        mail.put("userIds", List.of());
        mail.put("subject", "QA B15 SLA email");
        mail.put("bodyHtml", "<p>QA B15 SLA email: the blueprint state SLA expired.</p>");
        int added = 0;
        for (Object o : (List<Object>) def.get("states")) {
            Map<String, Object> st = (Map<String, Object>) o;
            if (st.get("slaMinutes") == null) continue;
            List<Object> esc = new java.util.ArrayList<>(st.get("slaEscalation") == null ? List.of() : (List<Object>) st.get("slaEscalation"));
            esc.removeIf(a -> "sendEmail".equals(((Map<String, Object>) a).get("kind")));
            esc.add(mail);
            st.put("slaEscalation", esc);
            fact(c, "state " + st.get("key") + " slaMinutes=" + st.get("slaMinutes") + " actions=" + esc.size());
            added++;
        }
        if (added == 0) throw new IllegalStateException("no state with an SLA");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("isActive", cur.get("isActive"));
        body.put("definition", def);
        Response pr = adminB().put("/modules/" + LEADS + "/blueprints/" + bp, body);
        fact(c, "PUT blueprint " + bp + " -> " + pr.statusCode() + " " + cut(pr.asString(), 300));
        CrmUser.ok(pr, "update blueprint");
        get(c, adminB(), "/modules/" + LEADS + "/blueprints/" + bp);
    }
    /** 21 Oct: creates one B15 lead on the Standard layout (kept, like the recording leads) and watches the recording blueprint SLA. */
    @Test(groups = {"crm-b15-recording"}, description = "Create a B15 lead for the SLA email check and watch the SLA run")
    public void b15EmailLead() {
        String name = System.getProperty("b15lead", "");
        if (name.isEmpty()) throw new org.testng.SkipException("one-off: run with -Db15lead=<first name starting B15>");
        String c = "B15lead";
        java.util.Set<String> before = new java.util.HashSet<>();
        for (Map<String, Object> row : CrmApi.newestRows(api.admin(), CrmOrderFeature.TASKS, 20)) before.add(String.valueOf(row.get("id")));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, name));
        f.put("lead_source", "chat");
        String id = CrmUser.ok(api.createRaw(adminB(), LEADS, "bf971461-2edc-45f2-b6e4-6e180aa64288", f), "create lead").jsonPath().getString("data.id");
        long t0 = System.currentTimeMillis();
        fact(c, "lead " + id + " created at " + java.time.Instant.now());
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        String task = null;
        for (int i = 0; i <= 10 && task == null; i++) {
            Response st = CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + id + "/blueprint-state"), "state");
            for (Map<String, Object> row : CrmApi.newestRows(api.admin(), CrmOrderFeature.TASKS, 5))
                if (!before.contains(String.valueOf(row.get("id"))) && String.valueOf(row).contains("SLA B15 task")) task = String.valueOf(row.get("id"));
            fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s slaDueAt=" + st.jsonPath().getList("data.states.slaDueAt") + " task=" + task);
            if (task == null && i < 10) CrmUser.sleep(30000);
        }
        fact(c, "RESULT lead " + id + " task=" + task + " lead_status=" + val(LEADS, id, "lead_status") + " at " + java.time.Instant.now());
        get(c, adminB(), "/mail/records/leads/" + id + "/emails");
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }
    /** 21 Oct: deletes the B-15 recording blueprint, its named leads and their "SLA B15 task" tasks (approved by the user). */
    @Test(groups = {"crm-b15-recording"}, description = "Clean up the B-15 recording blueprint, leads and tasks")
    @SuppressWarnings("unchecked")
    public void cleanupB15Recording() {
        if (!Boolean.getBoolean("b15clean")) throw new org.testng.SkipException("one-off: run with -Db15clean=true");
        String c = "B15clean";
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data")) {
            Map<String, Object> b = (Map<String, Object>) o;
            Map<String, Object> d = (Map<String, Object>) b.get("definition");
            if (d == null || !"QA B15 SLA recording".equals(d.get("name"))) continue;
            api.setBlueprintActive(LEADS, String.valueOf(b.get("id")), false);
            fact(c, "delete blueprint " + b.get("id") + " -> " + adminB().delete("/modules/" + LEADS + "/blueprints/" + b.get("id")).statusCode());
        }
        List<String> names = List.of("B15 - 02", "B15 - 03", "B15 - email check");
        for (Map<String, Object> row : CrmApi.newestRows(api.admin(), LEADS, 5)) {
            String fn = null;
            for (Object o : (List<Object>) row.get("data")) {
                Map<String, Object> cell = (Map<String, Object>) o;
                if ("first_name".equals(cell.get("field")) && cell.get("value") instanceof Map) fn = String.valueOf(((Map<String, Object>) cell.get("value")).get("value"));
            }
            if (fn == null || !names.contains(fn)) continue;
            fact(c, "delete lead " + row.get("id") + " first_name=" + fn + " -> " + api.admin().delete("/modules/" + LEADS + "/records/" + row.get("id")).statusCode());
        }
        for (Map<String, Object> row : CrmApi.newestRows(api.admin(), CrmOrderFeature.TASKS, 5)) {
            if (!String.valueOf(row).contains("SLA B15 task")) continue;
            fact(c, "delete task " + row.get("id") + " -> " + api.admin().delete("/modules/" + CrmOrderFeature.TASKS + "/records/" + row.get("id")).statusCode());
        }
    }
}
