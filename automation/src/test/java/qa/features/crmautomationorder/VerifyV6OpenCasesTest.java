package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;

/**
 * 21 Oct 2026: cases left inconclusive on 18-19 Oct that need nothing from the team (session V6):
 * E-04 (blueprint After email, checked in a real inbox), F-02 (assignment → workflow Owner criterion) and B-13 (review
 * SLA escalation, 60-minute minimum, watched 70 minutes).
 */
public class VerifyV6OpenCasesTest extends VerifyBase {
    @Override protected String session() { return "V6"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    /** The inbox the user reads (their choice, 21 Oct 2026). */
    private static final String INBOX = System.getProperty("inbox", "mmohamed@anyware.software");

    // ------------------------------------------------------------ E-04

    @CaseId("E-04")
    @Test(groups = {"crm-verify6"}, description = "Blueprint After-transition email reaches a real inbox (plus field update and task as controls)")
    @SuppressWarnings("unchecked")
    public void e04AfterEmailToInbox() {
        String c = "E-04";
        String stamp = java.time.LocalTime.now().withNano(0).toString();
        String subject = "QA AEO V6 E-04 after-transition email " + stamp;
        Map<String, Object> mail = new LinkedHashMap<>();
        mail.put("kind", "sendEmail");
        mail.put("to", List.of(INBOX));
        mail.put("userIds", List.of());
        mail.put("subject", subject);
        mail.put("bodyHtml", "<p>" + subject + ": the lead moved from chat to web.</p>");
        String taskName = nm(c, "after task");
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", Rules.kinded("name", taskName, "subject", taskName, "status", "Not Started", "priority", "normal"));
        task.put("assigneeMode", "owner");
        task.put("assigneeUserId", null);
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), List.of(CrmProcs.setField("description", "QA E-04 after"), task, mail));
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, adminB(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        JsonPath st = api.blueprintState(adminB(), LEADS, id);
        String tid = null;
        for (Map<String, Object> t : (List<Map<String, Object>>) (List<?>) st.getList("data.transitions"))
            if (String.valueOf(t.get("transitionName")).contains("chat to web")) tid = String.valueOf(t.get("transitionId"));
        fact(c, "lead " + id + " governed; transitions " + cut(String.valueOf(st.getList("data.transitions")), 300));
        if (tid == null) throw new IllegalStateException("transition 'chat to web' not offered");
        Response r = api.transition(adminB(), LEADS, id, tid, Map.of());
        fact(c, "transition at " + java.time.ZonedDateTime.now(java.time.ZoneId.of("Africa/Cairo")).toLocalTime().withNano(0) + " Cairo -> " + r.statusCode() + " " + cut(r.asString(), 200));
        boolean fu = CrmApi.waitFor(60, () -> "QA E-04 after".equals(val(LEADS, id, "description")));
        String taskId = null;
        for (int i = 0; i < 12 && taskId == null; i++) {
            for (Map<String, Object> row : CrmApi.newestRows(api.admin(), CrmOrderFeature.TASKS, 1))
                if (String.valueOf(row).contains(taskName)) taskId = String.valueOf(row.get("id"));
            if (taskId == null) CrmUser.sleep(5000);
        }
        if (taskId != null) extra.add(new String[]{CrmOrderFeature.TASKS, taskId});
        fact(c, "RESULT lead " + id + " state=" + val(LEADS, id, "lead_source") + " fieldUpdate=" + fu + " task=" + taskId
                + " email subject '" + subject + "' sent to " + INBOX + " (check the inbox)");
    }

    // ------------------------------------------------------------ F-02

    /**
     * F-02: the 18 Oct control never matched "Owner = adminB" on a lead owned by adminB. Three criteria shapes run side
     * by side on their own control leads (created by adminB, so owned by adminB); the one that fires is then used for
     * the real check: an imported lead assigned to adminB by an assignment rule, workflow "Owner = adminB" on create.
     */
    @CaseId("F-02")
    @Test(groups = {"crm-verify6"}, description = "Assignment → workflow: a workflow with criteria Owner = assigned user fires on the assigned lead")
    public void f02OwnerCriterion() {
        String c = "F-02";
        String b = adminB().id();
        Map<String, Map<String, Object>> shapes = new LinkedHashMap<>();
        shapes.put("noOwner", Rules.startsWith("lead_source", "chat")); // control: same rule without an owner check must fire
        shapes.put("cmpOwner", Rules.equalsTo("owner", Rules.s(b)));
        shapes.put("inOwner", Rules.oneOf("owner", b));
        // uuid / user value kinds are refused (400); the screen itself saves {kind:string, stringValue:<user id>} (UI F-02 run, 21 Oct)
        // "owner_id" is refused (400 Unknown field), so only the two shapes on "owner"
        Map<String, String> ctl = new LinkedHashMap<>();
        List<String> ok = new ArrayList<>();
        for (Map.Entry<String, Map<String, Object>> e : shapes.entrySet()) {
            String tag = c + e.getKey();
            try {
                String wf = api.workflowRule(CrmProcs.workflow(LEADS, tag + " WF").guardCase(tag).onCreate().where(e.getValue())
                        .fieldUpdate("description", "QA " + tag).build());
                on(c, "WF " + e.getKey() + " " + wf, api.setWorkflowActive(wf, true));
                ok.add(e.getKey());
            } catch (IllegalStateException ex) {
                fact(c, "shape " + e.getKey() + " refused: " + cut(ex.getMessage(), 200));
            }
        }
        for (String k : ok) ctl.put(k, createLogged(c, adminB(), LEADS, leadFields(c + k, "ctl")));
        fact(c, "control owner (adminB expected) " + who(owner(LEADS, ctl.values().iterator().next())) + " raw " + cut(String.valueOf(
                CrmUser.ok(adminB().get("/modules/" + LEADS + "/records/" + ctl.values().iterator().next()), "lead").jsonPath().<Object>get("data.owner")), 200));
        String working = null;
        CrmApi.waitFor(60, () -> {
            for (Map.Entry<String, String> e : ctl.entrySet()) if (("QA " + c + e.getKey()).equals(val(LEADS, e.getValue(), "description"))) return true;
            return false;
        });
        for (Map.Entry<String, String> e : ctl.entrySet()) {
            boolean fired = ("QA " + c + e.getKey()).equals(val(LEADS, e.getValue(), "description"));
            fact(c, "control " + e.getKey() + " fired=" + fired);
            if (fired && working == null && !"noOwner".equals(e.getKey())) working = e.getKey();
        }
        if (working == null) {
            fact(c, "RESULT no criteria shape matched a lead owned by adminB - Owner criterion does not work through the API (or another field key)");
            return;
        }
        // real check: import as adminA, the assignment rule makes adminB the owner, the workflow must see it
        String ar = api.assignmentRule(CrmProcs.assignmentRule(LEADS, c + " AR", List.of("Import"), caseGuard(LEADS, c + working),
                List.of(b), "LeaveUnassigned", null));
        on(c, "AR " + ar, api.setAssignmentRuleActive(ar, true));
        String tag = c + working;
        Map<String, Object> row = new LinkedHashMap<>(leadFields(tag, "imp"));
        String id = importOne(c, adminA(), LEADS, row, ar, true);
        boolean assigned = CrmApi.waitFor(60, () -> b.equals(owner(LEADS, id)));
        boolean fired = CrmApi.waitFor(60, () -> ("QA " + tag).equals(val(LEADS, id, "description")));
        fact(c, "RESULT shape " + working + ": imported lead " + id + " owner=" + who(owner(LEADS, id)) + " assigned=" + assigned
                + " workflow(Owner = adminB) fired=" + fired + " executions " + cut(String.valueOf(api.executions(id)), 300));
    }

    /** Read-only: owner-related criteria in existing rules, and how a lead carries its owner. */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only probe: owner criteria shapes in saved rules")
    @SuppressWarnings("unchecked")
    public void probeOwnerCriteria() {
        String c = "F-02p";
        for (String p : List.of("/workflow/rules", "/workflow/approval-processes", "/workflow/assignment-rules")) {
            String all = adminB().get(p).asString();
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\{[^{}]*\"field\":\"[a-z_]*owner[a-z_]*\"[^{}]*\\}").matcher(all);
            int n = 0;
            while (m.find() && n++ < 6) fact(c, p + " " + cut(m.group(), 300));
            if (n == 0) fact(c, p + " no owner criteria");
        }
        String id = createLogged(c, adminB(), LEADS, leadFields(c, "probe"));
        String raw = adminB().get("/modules/" + LEADS + "/records/" + id).asString();
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("[^,{]*owner[^,}]*").matcher(raw);
        int n = 0;
        while (m.find() && n++ < 8) fact(c, "record " + cut(m.group(), 200));
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/fields"), "fields").jsonPath().getList("data")) {
            Map<String, Object> fm = (Map<String, Object>) o;
            String k = String.valueOf(fm.get("apiName") != null ? fm.get("apiName") : fm.get("key"));
            if (String.valueOf(fm).toLowerCase().contains("owner")) fact(c, "field " + cut(String.valueOf(fm), 300));
        }
    }

    /**
     * B-13 after the watch was stopped (low memory, 21 Oct): one read of the review request and the recipient's
     * notifications after the SLA was due, then cleanup of the B-13 process, its held lead and stray V6 layouts.
     * -Db13check=<lead id>
     */
    @CaseId("B-13")
    @Test(groups = {"crm-verify6-check"}, description = "B-13 check after the SLA due time, then cleanup")
    @SuppressWarnings("unchecked")
    public void b13CheckAndCleanup() {
        String id = System.getProperty("b13check", "");
        if (id.isEmpty()) throw new org.testng.SkipException("one-off: run with -Db13check=<lead id>");
        String c = "B-13";
        fact(c, "lead GET -> " + adminB().get("/modules/" + LEADS + "/records/" + id).statusCode() + "; history " + cut(adminA().get("/workflow/reviews/records/" + LEADS + "/" + id + "/history").asString(), 500));
        String req = System.getProperty("b13req", api.reviewRequestId(LEADS, id));
        Response rr = adminA().get("/workflow/reviews/" + req);
        fact(c, "request " + req + " GET -> " + rr.statusCode() + " " + cut(rr.asString(), 300));
        if (rr.statusCode() != 200) {
            fact(c, "RESULT the review request is gone (" + rr.statusCode() + ") - nothing to read; cleaning up");
            rr = null;
        }
        JsonPath r = rr == null ? new JsonPath("{\"data\":{}}") : rr.jsonPath();
        fact(c, "request " + req + " status=" + r.getString("data.status") + " slaDueAt=" + r.getString("data.slaDueAt")
                + " remaining=" + r.getString("data.slaRemainingSeconds") + " isEscalated=" + r.getString("data.isEscalated")
                + " escalatedAt=" + r.getString("data.escalatedAt"));
        fact(c, "request keys " + cut(String.valueOf(r.getMap("data").keySet()), 600));
        String n = adminB().get("/notifications?take=50").asString();
        String lead = nm(c, "lead");
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("\\{[^{}]*(" + java.util.regex.Pattern.quote(req) + "|" + java.util.regex.Pattern.quote(id)
                + "|SLA|escalat|overdue)[^{}]*\\}", java.util.regex.Pattern.CASE_INSENSITIVE).matcher(n);
        int k = 0;
        while (m.find() && k++ < 5) fact(c, "adminB notification " + cut(m.group(), 400));
        fact(c, "RESULT isEscalated=" + r.getString("data.isEscalated") + " notificationsMatching=" + k);
        // cleanup: reject the held review, then remove the B-13 process and the lead
        if (rr != null) fact(c, "reject review -> " + api.reviewReject(adminA(), req).statusCode());
        Object data = adminB().get("/workflow/review-processes").jsonPath().get("data");
        List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) adminB().get("/workflow/review-processes").jsonPath().getList("data.items");
        for (Object o : rows) {
            Map<String, Object> p = (Map<String, Object>) o;
            if (!String.valueOf(p.get("name")).startsWith(CrmOrderFeature.QA + "V6 B-13")) continue;
            String pid = String.valueOf(p.get("id"));
            fact(c, "deactivate " + p.get("name") + " -> " + api.setReviewActive(pid, false, "reject_all").statusCode()
                    + ", delete -> " + adminB().delete("/workflow/review-processes/" + pid).statusCode());
        }
        fact(c, "delete lead " + id + " -> " + adminB().delete("/modules/" + LEADS + "/records/" + id).statusCode());
        for (String mod : List.of(LEADS, CrmOrderFeature.DEALS, CrmOrderFeature.TASKS))
            for (Object o : CrmUser.ok(adminB().get("/modules/" + mod + "/layouts"), "layouts").jsonPath().getList("data")) {
                Map<String, Object> l = (Map<String, Object>) o;
                String ln = String.valueOf(l.get("name")), lid = String.valueOf(l.get("id"));
                if (!ln.startsWith("QA AEO Layout V6") || layouts.containsValue(lid)) continue;
                fact(c, "delete stray layout '" + ln + "' " + lid + " -> " + CrmApi.deleteLayout(adminB(), mod, lid).statusCode());
            }
    }

    /** Read-only: the Standard Leads layout structure (to place a field on a QA layout copy). */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only probe: layout views structure")
    public void probeLayoutViews() {
        Object v = CrmUser.ok(adminB().get("/modules/" + LEADS + "/layouts/" + CrmOrderFeature.LEADS_STANDARD), "layout").jsonPath().<Object>get("data.views");
        fact("A-13p", "views " + cut(json(v), 2500));
    }

    // ------------------------------------------------------------ A-13

    /**
     * A-13: an update-mode import (match on a unique field) with an assignment rule chosen must not change the owner
     * (Zoho does not offer assignment rules for update imports). Leads' only unique field is "name", which is on no
     * layout, so it is placed on this session's own QA layout first (the copy is deleted with the session).
     */
    @CaseId("A-13")
    @Test(groups = {"crm-verify6"}, description = "Update-mode import with an assignment rule keeps the existing owner")
    @SuppressWarnings("unchecked")
    public void a13UpdateImportKeepsOwner() {
        String c = "A-13";
        String lay = layout(LEADS);
        Map<String, Object> nameField = null;
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/fields"), "fields").jsonPath().getList("data"))
            if ("name".equals(((Map<String, Object>) o).get("apiName"))) nameField = (Map<String, Object>) o;
        Map<String, Object> fo = new LinkedHashMap<>();
        for (String k : List.of("id", "apiName", "fieldName", "labels", "datatypeKey", "config", "datatypeOptions")) fo.put(k, nameField.get(k));
        fo.put("fieldOrder", 99);
        Map<String, Object> cur = CrmUser.ok(adminB().get("/modules/" + LEADS + "/layouts/" + lay), "QA layout").jsonPath().getMap("data");
        Map<String, Object> views = (Map<String, Object>) cur.get("views");
        for (Object v : views.values()) {
            Map<String, Object> sec = ((List<Map<String, Object>>) ((Map<String, Object>) ((Map<String, Object>) v).get("layout")).get("sections")).get(0);
            ((List<Object>) ((List<Map<String, Object>>) sec.get("columns")).get(0).get("fields")).add(fo);
        }
        Map<String, Object> put = new LinkedHashMap<>();
        put.put("name", cur.get("name"));
        put.put("views", views);
        put.put("assignedProfiles", List.of());
        put.put("accessMode", cur.get("accessMode"));
        put.put("status", cur.get("status"));
        put.put("rowVersion", cur.get("rowVersion"));
        Response pr = adminB().put("/modules/" + LEADS + "/layouts/" + lay, put);
        fact(c, "place unique field 'name' on QA layout " + lay + " -> " + pr.statusCode() + " " + cut(pr.asString(), 200));
        CrmUser.ok(pr, "layout update");
        String unique = "QA-AEO-A13-" + (System.currentTimeMillis() % 1_000_000);
        Map<String, Object> f0 = new LinkedHashMap<>(leadFields(c, "existing"));
        f0.put("name", unique);
        String id = createLogged(c, userN(), LEADS, f0);
        fact(c, "lead " + id + " owner=" + who(owner(LEADS, id)) + " name=" + val(LEADS, id, "name"));
        String ar = api.assignmentRule(CrmProcs.assignmentRule(LEADS, c + " AR", List.of("Import"), caseGuard(LEADS, c), List.of(userV().id()), "LeaveUnassigned", null));
        on(c, "AR " + ar, api.setAssignmentRuleActive(ar, true));
        // update import: match on name, change company, rule chosen
        // update mode still asks for every required field (Phone refused when missing, 21 Oct): send the existing values
        String csv = "name,first_name,phone,single_line_3_9,company\n\"" + unique + "\",\"" + val(LEADS, id, "first_name") + "\",\"" + val(LEADS, id, "phone")
                + "\",\"QA AEO\",\"QA AEO A-13 updated\"\n";
        Response up = adminA().req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-a13.csv", csv.getBytes(java.nio.charset.StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + LEADS + "/import");
        String sid = CrmUser.ok(up, "upload").jsonPath().getString("data.session_id");
        String base = "/modules/" + LEADS + "/import/" + sid;
        List<Map<String, Object>> offered = adminA().get(base + "/fields?mode=update&layout_id=" + lay).jsonPath().getList("data");
        List<String> uniq = new ArrayList<>();
        for (Map<String, Object> o : offered) if (Boolean.TRUE.equals(o.get("unique"))) uniq.add(String.valueOf(o.get("field_name")));
        fact(c, "update-mode unique match fields now " + uniq);
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", true);
        opts.put("assignment_rule_id", ar);
        opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mode", "update");
        body.put("match_field_key", "name");
        body.put("layout_id", lay);
        body.put("mapping", List.of(Rules.kinded("header", "name", "field", "name"), Rules.kinded("header", "first_name", "field", "first_name"),
                Rules.kinded("header", "phone", "field", "phone"), Rules.kinded("header", "single_line_3_9", "field", "single_line_3_9"),
                Rules.kinded("header", "company", "field", "company")));
        body.put("options", opts);
        Response mp = adminA().put(base + "/mapping", body);
        fact(c, "mapping (update, match name, rule " + ar + ") -> " + mp.statusCode() + " " + cut(mp.asString(), 300));
        if (mp.statusCode() / 100 == 2) {
            fact(c, "validate -> " + cut(adminA().post(base + "/validate", null).asString(), 300));
            fact(c, "execute -> " + adminA().post(base + "/execute", null).statusCode());
            CrmApi.waitFor(150, () -> {
                String st = adminA().get(base).jsonPath().getString("data.status");
                return st != null && (st.startsWith("completed") || st.equals("partially_completed") || st.equals("failed"));
            });
            fact(c, "import status " + cut(adminA().get(base).asString(), 400));
        }
        fact(c, "RESULT lead " + id + " company=" + val(LEADS, id, "company") + " owner=" + who(owner(LEADS, id)) + " (was userN; rule target userV)");
    }

    /** Read-only GETs: presence, user status/actions, API keys / integrations, conversion mapping. */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only probe: endpoints for A-10, A-17, API channel, conversion")
    public void probeRemaining() {
        String c = "probe2";
        String v = userV().id();
        for (String p : List.of("/iam/users/directory?include=suspended", "/iam/users/" + v, "/iam/users/presence", "/presence/users", "/presence",
                "/iam/api-keys", "/iam/apikeys", "/api-keys", "/integrations/api-keys", "/iam/integrations", "/integrations", "/settings/api-integration",
                "/modules/" + LEADS + "/conversion-mapping", "/modules/" + LEADS + "/conversion/mapping", "/lead-conversion/mapping", "/conversion-mappings",
                "/workflow/executions?recordId=fa16208a-2c06-4033-9360-839ed3b9c055", "/workflow/executions?recordId=c68cf3d7-28f8-4745-bba7-091a92ea4b35",
                "/iam/users/presence/" + v, "/iam/presence/" + v, "/iam/users/" + v + "/presence", "/iam/me/presence", "/iam/me/status", "/iam/me/availability")) {
            Response r = adminB().get(p);
            String body = r.asString().replaceAll("\"(client_secret|secret|clientSecret|token)\":\"[^\"]*\"", "\"$1\":\"<hidden>\"").replaceAll("\"email\":\"[^\"]*\"", "\"email\":\"…\"");
            fact(c, "GET " + p + " -> " + r.statusCode() + " " + cut(body, p.contains("directory") ? 6000 : p.contains("conversion") || p.contains("clients") ? 2500 : 1500));
        }
    }

    // ------------------------------------------------------------ J-04

    /**
     * J-04: completing a task (status Completed, as the Work Queue does) runs only the rules that match it. A QA rule on
     * Tasks (On Edit, status Completed, own name prefix) must fire on the QA task; the teammate rule
     * "ActionsOnTaskCompletionFromWorkqueue" is recorded (active or not, and whether it fired for the QA task).
     */
    @CaseId("J-04")
    @Test(groups = {"crm-verify6"}, description = "Task completed: the QA Tasks rule fires on its own task; the teammate rule is not affected")
    @SuppressWarnings("unchecked")
    public void j04TaskCompletion() {
        String c = "J-04";
        String tasks = CrmOrderFeature.TASKS;
        String mate = null;
        Object data = adminB().get("/workflow/rules").jsonPath().get("data");
        List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) adminB().get("/workflow/rules").jsonPath().getList("data.items");
        for (Object o : rows) {
            Map<String, Object> m = (Map<String, Object>) o;
            if ("ActionsOnTaskCompletionFromWorkqueue".equals(m.get("name"))) {
                mate = String.valueOf(m.get("id"));
                fact(c, "teammate rule " + mate + " isActive=" + m.get("isActive") + " status=" + m.get("status"));
            }
        }
        String wf = api.workflowRule(CrmProcs.workflow(tasks, c + " WF").guardCase(c).onEdit()
                .where(Rules.oneOf("status", "Completed")).fieldUpdate("description", "QA J-04 completed").build());
        on(c, "WF " + wf, api.setWorkflowActive(wf, true));
        String id = createLogged(c, userN(), tasks, CrmApi.minimal(tasks, nm(c, "task")));
        Response u = patch(c, userN(), "/modules/" + tasks + "/records/" + id, Map.of("data", CrmApi.data(Map.of("status", "Completed"))));
        fact(c, "complete task " + id + " -> " + u.statusCode());
        boolean fired = CrmApi.waitFor(60, () -> "QA J-04 completed".equals(val(tasks, id, "description")));
        long mateFired = mate == null ? -1 : api.firedCount(id, mate);
        fact(c, "RESULT task " + id + " status=" + val(tasks, id, "status") + " QA rule fired=" + fired + " teammate rule fired on the QA task=" + mateFired
                + " executions " + cut(String.valueOf(api.executions(id)), 400));
    }

    /**
     * A-10 follow-up (user hint 22 Oct): Login History "active sessions". Read-only: the row shape, then active sessions
     * per user, their oldest sign-in and last activity, so "online" can be compared with reality.
     */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only: active sessions per user from Login History")
    @SuppressWarnings("unchecked")
    public void probeActiveSessions() {
        String c = "A-10s";
        for (String q : List.of("?limit=5", "?limit=5&active=true", "?limit=5&status=active", "?limit=5&activeOnly=true", "?limit=5&filter=active")) {
            Response r = adminB().get("/audit/login-history" + q);
            fact(c, "GET /audit/login-history" + q + " -> " + r.statusCode() + " " + cut(r.asString().replaceAll("\"(ip|ipAddress|ip_address|userAgent|user_agent|email)\":\"[^\"]*\"", "\"$1\":\"…\""), 900));
        }
        Map<String, String> names = new LinkedHashMap<>();
        for (Object o : CrmUser.ok(adminB().get("/iam/users/directory?include=suspended"), "dir").jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            names.put(String.valueOf(m.get("userId")), m.get("displayName") + " (" + m.get("status") + ")");
        }
        // page through everything the endpoint returns and count rows that look active
        List<Map<String, Object>> all = new ArrayList<>();
        String cursor = null;
        for (int page = 0; page < 40; page++) {
            Response r = adminB().get("/audit/login-history?limit=200" + (cursor == null ? "" : "&cursor=" + cursor));
            if (r.statusCode() != 200) break;
            JsonPath jp = r.jsonPath();
            Object d = jp.get("data");
            List<Map<String, Object>> rows = d instanceof List ? (List<Map<String, Object>>) d : jp.getList("data.items");
            if (rows == null || rows.isEmpty()) break;
            all.addAll(rows);
            String next = jp.getString("meta.next_cursor") != null ? jp.getString("meta.next_cursor") : jp.getString("data.nextCursor");
            if (next == null || next.equals(cursor)) break;
            cursor = next;
        }
        fact(c, "rows read " + all.size() + "; keys " + (all.isEmpty() ? "-" : all.get(0).keySet()));
        Map<String, int[]> perUser = new java.util.TreeMap<>();
        Map<String, String> oldest = new LinkedHashMap<>();
        int active = 0;
        for (Map<String, Object> row : all) {
            String st = String.valueOf(row.getOrDefault("status", row.getOrDefault("sessionStatus", row.get("session_status")))).toLowerCase();
            Object ended = row.containsKey("endedAt") ? row.get("endedAt") : row.containsKey("ended_at") ? row.get("ended_at") : row.get("logoutAt");
            boolean isActive = st.contains("active") || (Boolean.TRUE.equals(row.get("isActive"))) || (Boolean.TRUE.equals(row.get("active")));
            if (!isActive) continue;
            active++;
            String uid = String.valueOf(row.getOrDefault("userId", row.get("user_id")));
            String who = names.getOrDefault(uid, uid);
            perUser.computeIfAbsent(who, k -> new int[1])[0]++;
            Object at = row.getOrDefault("occurredAt", row.getOrDefault("createdAt", row.getOrDefault("signedInAt", row.get("occurred_at"))));
            String prev = oldest.get(who);
            if (at != null && (prev == null || String.valueOf(at).compareTo(prev) < 0)) oldest.put(who, String.valueOf(at));
        }
        // status=active only, with login_at / expires_at against now (22 Oct)
        String now = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).toString();
        int pastExpiry = 0, total = 0;
        String oldestLogin = null, newestLogin = null;
        Map<String, Integer> byDay = new java.util.TreeMap<>();
        for (Map<String, Object> row : all) {
            if (!"active".equals(String.valueOf(row.get("status")))) continue;
            total++;
            String li = String.valueOf(row.get("login_at")), ex = String.valueOf(row.get("expires_at"));
            if (oldestLogin == null || li.compareTo(oldestLogin) < 0) oldestLogin = li;
            if (newestLogin == null || li.compareTo(newestLogin) > 0) newestLogin = li;
            if (!"null".equals(ex) && java.time.OffsetDateTime.parse(ex).isBefore(java.time.OffsetDateTime.now())) pastExpiry++;
            byDay.merge(li.substring(0, 10), 1, Integer::sum);
        }
        fact(c, "STATUS=active rows " + total + " (now " + now + "): oldest login " + oldestLogin + ", newest " + newestLogin + ", already past expires_at " + pastExpiry + "; by login day " + byDay);
        fact(c, "RESULT active-looking sessions " + active + " across " + perUser.size() + " users");
        perUser.forEach((who, n) -> fact(c, "  " + who + ": " + n[0] + " active, oldest sign-in " + oldest.get(who)));
    }

    /** Read-only check (22 Oct): can a suspended user still sign in through the API? Status from the directory, then one sign-in and /iam/me. */
    @Test(groups = {"crm-verify6-probe"}, description = "Suspended user: directory status, then one API sign-in and /iam/me")
    @SuppressWarnings("unchecked")
    public void probeSuspendedSignIn() {
        String c = "SUSP";
        String uid = "45ffbc5b-7859-4c21-be9e-7b5f30747ca2";
        for (Object o : CrmUser.ok(adminB().get("/iam/users/directory?include=suspended"), "dir").jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            if (uid.equals(m.get("userId"))) fact(c, "directory: " + m.get("displayName") + " status=" + m.get("status") + " at " + java.time.Instant.now());
        }
        CrmUser n = CrmUser.as(CrmOrderFeature.USER_N); // POST /iam/auth/login with the password (fresh JVM, no reused token)
        Response me = n.get("/iam/me/profile");
        fact(c, "sign-in as test user 1 -> OK; GET /iam/me/profile -> " + me.statusCode() + " user_id=" + me.jsonPath().getString("user_id"));
        Response list = n.get("/modules/" + LEADS + "/records?page=1&per_page=1");
        fact(c, "GET leads as test user 1 -> " + list.statusCode());
    }

    /** Read-only (22 Oct, Jam 1d9d8e4e): Phone / Email as stored on the field and inside the Standard layout views. */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only: Phone and Email field settings vs the Standard layout copy")
    @SuppressWarnings("unchecked")
    public void probePhoneEmailSettings() {
        String c = "MF";
        for (Object o : CrmUser.ok(adminB().get("/modules/" + LEADS + "/fields"), "fields").jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            if (List.of("phone", "email").contains(m.get("apiName")))
                fact(c, "FIELD " + m.get("apiName") + " required=" + m.get("required") + " unique=" + m.get("unique") + " config=" + m.get("config")
                        + " datatypeOptions=" + m.get("datatypeOptions") + " rowVersion=" + m.get("rowVersion") + " lastModifiedAt=" + m.get("lastModifiedAt"));
        }
        Map<String, Object> lay = CrmUser.ok(adminB().get("/modules/" + LEADS + "/layouts/" + CrmOrderFeature.LEADS_STANDARD), "layout").jsonPath().getMap("data");
        Map<String, Object> views = (Map<String, Object>) lay.get("views");
        for (Map.Entry<String, Object> v : views.entrySet())
            for (Object sec : (List<Object>) ((Map<String, Object>) ((Map<String, Object>) v.getValue()).get("layout")).get("sections"))
                for (Object col : (List<Object>) ((Map<String, Object>) sec).get("columns"))
                    for (Object fo : (List<Object>) ((Map<String, Object>) col).get("fields")) {
                        Map<String, Object> fm = (Map<String, Object>) fo;
                        if (List.of("phone", "email").contains(fm.get("apiName")))
                            fact(c, "LAYOUT " + v.getKey() + " " + fm.get("apiName") + " config=" + fm.get("config") + " datatypeOptions=" + fm.get("datatypeOptions"));
                    }
        fact(c, "layout updatedAt=" + lay.get("updatedAt") + " rowVersion=" + lay.get("rowVersion"));
    }

    /** Read-only (22 Oct): the stored shape of existing workflow rules - one criteria per rule, or condition blocks with their own actions? */
    @Test(groups = {"crm-verify6-probe"}, description = "Read-only: workflow rule shape (conditions and actions)")
    @SuppressWarnings("unchecked")
    public void probeWorkflowShape() {
        String c = "WFshape";
        Object data = adminB().get("/workflow/rules").jsonPath().get("data");
        List<Object> rows = data instanceof List ? (List<Object>) data : (List<Object>) adminB().get("/workflow/rules").jsonPath().getList("data.items");
        int n = 0;
        for (Object o : rows) {
            Map<String, Object> m = (Map<String, Object>) o;
            Response r = adminB().get("/workflow/rules/" + m.get("id"));
            Map<String, Object> d = r.jsonPath().getMap("data");
            fact(c, m.get("name") + " keys=" + d.keySet());
            for (String k : d.keySet()) {
                Object v = d.get(k);
                if (v instanceof List && !((List<?>) v).isEmpty() && ((List<?>) v).get(0) instanceof Map)
                    fact(c, "  list " + k + " size=" + ((List<?>) v).size() + " itemKeys=" + ((Map<?, ?>) ((List<?>) v).get(0)).keySet());
            }
            if (++n >= 4) break;
        }
    }

    // ------------------------------------------------------------ B-13

    @CaseId("B-13")
    @Test(groups = {"crm-verify6-long"}, description = "Review SLA 60 minutes (the minimum): the request escalates and the recipient is notified (watched 70 minutes)")
    public void b13ReviewSla60() {
        String c = "B-13";
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        Map<String, Object> sla = new LinkedHashMap<>();
        sla.put("durationMinutes", 60);
        sla.put("recipientKind", "user");
        sla.put("recipientId", adminB().id());
        body.put("sla", sla);
        String rp = api.reviewProcess(body);
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String id = createLogged(c, userN(), LEADS, leadFields(c, "lead"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        String req = api.reviewRequestId(LEADS, id);
        JsonPath r0 = CrmUser.ok(adminA().get("/workflow/reviews/" + req), "request").jsonPath();
        fact(c, "lead " + id + " request " + req + " slaDueAt=" + r0.getString("data.slaDueAt") + " escalated=" + r0.getString("data.isEscalated"));
        String lead = nm(c, "lead");
        long t0 = System.currentTimeMillis();
        boolean esc = false, notified = false;
        for (int m = 0; m <= 70 && !(esc && notified); m += 5) {
            JsonPath r = CrmUser.ok(adminA().get("/workflow/reviews/" + req), "request").jsonPath();
            esc = Boolean.parseBoolean(String.valueOf(r.getString("data.isEscalated")));
            String n = adminB().get("/notifications?take=30").asString();
            notified = n.contains(lead) || n.contains(req);
            fact(c, "+" + (System.currentTimeMillis() - t0) / 60000 + "min escalated=" + esc + " remaining=" + r.getString("data.slaRemainingSeconds") + " adminB notified=" + notified);
            if (!(esc && notified) && m < 70) CrmUser.sleep(300_000);
        }
        if (notified) fact(c, "notification " + cut(adminB().get("/notifications?take=30").asString(), 600));
        fact(c, "RESULT escalated=" + esc + " recipient notified=" + notified + " after ~" + (System.currentTimeMillis() - t0) / 60000 + " min");
        api.reviewReject(adminA(), req);
    }
}
