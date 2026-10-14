package qa.features.deskworkflowrules;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.base.BaseTest;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Maintenance and probes (group "diag", not in regression). */
public class WorkflowDiagTest extends BaseTest {

    /** Switches back on every teammate rule a run paused (target/paused-teammate-rules.txt). Run after an aborted run. */
    @Test(groups = {"diag", "restore"})
    public void restorePausedRules() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        api.restorePaused();
        // QA leftovers of aborted runs: rules, saved actions, tickets (subject "QA WF ...")
        api.deleteRulesNamed(DeskWorkflowRulesFeature.QA);
        api.deleteRulesNamed("QA 2205 "); // WorkflowBugRetestTest control/test rules
        api.deleteRulesNamed("QA 2206 ");
        api.deleteActionsNamed(DeskWorkflowRulesFeature.QA);
        int purged = 0;
        List<Map<String, Object>> rows = DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records?take=200"), "tickets")
                .jsonPath().getList("data");
        for (Map<String, Object> t : rows) {
            if (Boolean.TRUE.equals(t.get("is_deleted"))) continue;
            for (Object o : (List<?>) t.get("data")) {
                Map<?, ?> f = (Map<?, ?>) o;
                Object v = f.get("value") instanceof Map<?, ?> m ? m.get("value") : null;
                if ("subject".equals(f.get("field")) && String.valueOf(v).startsWith(DeskWorkflowRulesFeature.QA)) {
                    api.deleteTicket(String.valueOf(t.get("id")));
                    purged++;
                }
            }
        }
        System.out.println("[restore] QA tickets purged: " + purged);
        // tasks made by QA rules (Task action titles start with "QA WF "); Tasks module id seen in workflow.task_assigned
        String tasksModule = "d120a6c2-2596-4254-968b-a1bcd3a000bf";
        int tasksPurged = 0;
        Response tr = api.get("/modules/" + tasksModule + "/records?take=200");
        List<Map<String, Object>> taskRows = tr.statusCode() == 200 ? tr.jsonPath().getList("data") : List.of();
        if (!taskRows.isEmpty()) System.out.println("[restore] task row shape: " + String.valueOf(taskRows.get(0)).replaceAll("[0-9a-f]{8}-[0-9a-f-]{27}", "<id>").substring(0, Math.min(500, String.valueOf(taskRows.get(0)).length())));
        System.out.println("[restore] tasks with QA WF anywhere: " + taskRows.stream().filter(x -> String.valueOf(x).contains("QA WF")).count());
        String probeTask = System.getProperty("taskId");
        if (probeTask != null) { Response pt = api.get("/modules/" + tasksModule + "/records/" + probeTask); System.out.println("[restore] task " + probeTask + " -> " + pt.statusCode() + " " + pt.asString().replaceAll("[0-9a-f]{8}-[0-9a-f-]{27}", "<id>").substring(0, Math.min(600, pt.asString().length()))); }
        for (Map<String, Object> t : taskRows) {
            if (Boolean.TRUE.equals(t.get("is_deleted")) || !(t.get("data") instanceof List<?> fields)) continue;
            for (Object o : fields) {
                Map<?, ?> f = (Map<?, ?>) o;
                Object v = f.get("value") instanceof Map<?, ?> m ? m.get("value") : null;
                if (v != null && String.valueOf(v).startsWith(DeskWorkflowRulesFeature.QA)) {
                    api.delete("/modules/" + tasksModule + "/records/" + t.get("id"));
                    tasksPurged++;
                    break;
                }
            }
        }
        System.out.println("[restore] QA tasks purged: " + tasksPurged + " (tasks read: " + tr.statusCode() + ", " + taskRows.size() + ")");
        for (Map<String, Object> r : api.ruleList())
            System.out.println("[restore] " + r.get("isActive") + "  " + r.get("name"));
    }

    /** Ticket create by API in each department (no QA rules): which ones answer 500? */
    @Test(groups = {"diag"})
    public void createPerDepartment() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        List<Map<String, Object>> depts = DeskWorkflowRulesApi.ok(api.get("/desk/departments"), "departments").jsonPath().getList("data");
        for (Map<String, Object> d : depts) {
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("subject", "QA WF diag dept " + d.get("name"));
            f.put("department", d.get("id"));
            f.put("email", "qa.workflow@qa.test");
            f.put("status", "Open");
            f.put("priority", "low");
            Response r = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records", Map.of("data", DeskWorkflowRulesApi.recordData(f)));
            String s = r.asString();
            System.out.println("[dept] " + d.get("name") + " " + d.get("id") + " agents=" + d.get("agent_user_ids") + " -> " + r.statusCode()
                    + " " + s.substring(0, Math.min(160, s.length())));
            if (r.statusCode() / 100 == 2) api.deleteTicket(r.jsonPath().getString("data.id"));
        }
        Response ta = api.get("/desk/departments/" + DeskWorkflowRulesFeature.DEFAULT_DEPARTMENT_ID + "/team-assignment");
        System.out.println("[dept] Customer Support team-assignment " + ta.statusCode() + " " + ta.asString());
        Response ar = api.get("/desk/assignment-rules?department_id=" + DeskWorkflowRulesFeature.DEFAULT_DEPARTMENT_ID);
        System.out.println("[dept] Customer Support assignment rules " + ar.statusCode() + " " + ar.asString().substring(0, Math.min(600, ar.asString().length())));
    }

    /** Newest tickets (number, created, deleted) - read only. */
    @Test(groups = {"diag"})
    public void newestTickets() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        Response r = DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records?take=200"), "tickets");
        List<Map<String, Object>> rows = r.jsonPath().getList("data");
        rows.sort((a, b) -> String.valueOf(b.get("created_at")).compareTo(String.valueOf(a.get("created_at"))));
        System.out.println("[newest] total " + rows.size() + " meta " + r.jsonPath().getMap("meta"));
        for (Map<String, Object> t : rows.subList(0, Math.min(8, rows.size()))) {
            String num = null, subj = null;
            for (Object o : (List<?>) t.get("data")) {
                Map<?, ?> f = (Map<?, ?>) o;
                Object v = f.get("value") instanceof Map<?, ?> m ? m.get("value") : null;
                if ("ticket_number".equals(f.get("field"))) num = String.valueOf(v);
                if ("subject".equals(f.get("field"))) subj = String.valueOf(v);
            }
            System.out.println("[newest] #" + num + " " + t.get("created_at") + " by " + t.get("created_by_name") + " deleted=" + t.get("is_deleted")
                    + " subj=" + (subj == null ? "" : subj.substring(0, Math.min(40, subj.length()))));
        }
    }

    /** Does the New Ticket form (UI) still create tickets? Creates one QA ticket and deletes it. */
    @Test(groups = {"diag"})
    public void uiTicketCreate() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        try {
            String url = new WorkflowRulesListPage().open().createTicket()
                    .create("qa.workflow@qa.test", "QA WF diag UI ticket", "QA WF diag", "Open", "low");
            System.out.println("[ui-ticket] url after save: " + url);
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("([0-9a-f]{8}-[0-9a-f-]{27})").matcher(url);
            String id = null;
            while (m.find()) id = m.group(1);
            System.out.println("[ui-ticket] id " + id);
            if (id != null) {
                System.out.println("[ui-ticket] fields " + api.ticket(id));
                api.deleteTicket(id);
            }
        } finally {
            api.restorePaused();
        }
    }

    private static String l0(DeskWorkflowRulesApi api, String m) {
        List<Map<String, Object>> ls = api.get("/modules/" + m + "/layouts").jsonPath().getList("data");
        return ls == null ? "?" : ls.stream().map(x -> x.get("name") + "=" + x.get("id")).toList().toString();
    }

    // ---------- QA layout + QA fields (approved by the user 14 Oct 2026: changes only on a separate QA layout) ----------

    static final String QA_LAYOUT = "QA WF Layout";
    static final String QA_DATE = "qa_wf_date";
    static final String QA_ADDRESS = "qa_wf_address";

    private static Map<String, Object> layoutNamed(DeskWorkflowRulesApi api, String name) {
        for (Map<String, Object> l : DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/layouts"), "layouts")
                .jsonPath().<Map<String, Object>>getList("data"))
            if (name.equals(l.get("name"))) return l;
        return null;
    }

    private static Map<String, Object> fieldNamed(DeskWorkflowRulesApi api, String apiName) {
        for (Map<String, Object> f : DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/fields"), "fields")
                .jsonPath().<Map<String, Object>>getList("data"))
            if (apiName.equals(f.get("apiName"))) return f;
        return null;
    }

    /** Field ids per view of a layout, e.g. {CREATE=[..], DETAIL=[..]} - to compare Standard with its baseline. */
    @SuppressWarnings("unchecked")
    private static Map<String, List<String>> fieldIds(Map<String, Object> layout) {
        Map<String, List<String>> out = new java.util.TreeMap<>();
        Map<String, Object> views = (Map<String, Object>) layout.get("views");
        for (String k : views.keySet()) {
            List<String> ids = new ArrayList<>();
            Map<String, Object> lay = (Map<String, Object>) ((Map<String, Object>) views.get(k)).get("layout");
            for (Object s : (List<Object>) lay.get("sections"))
                for (Object c : (List<Object>) ((Map<String, Object>) s).get("columns"))
                    for (Object f : (List<Object>) ((Map<String, Object>) c).get("fields")) ids.add(String.valueOf(((Map<String, Object>) f).get("id")));
            out.put(k, ids);
        }
        return out;
    }

    private static Map<String, Object> baselineStandard() throws Exception {
        java.nio.file.Path p = qa.core.config.Config.projectDir().resolve("target/standard-layout-baseline.json");
        io.restassured.path.json.JsonPath j = new io.restassured.path.json.JsonPath(java.nio.file.Files.readString(p));
        for (Map<String, Object> l : j.<Map<String, Object>>getList("data")) if ("Standard".equals(l.get("name"))) return l;
        throw new IllegalStateException("no Standard layout in the baseline file");
    }

    @Test(groups = {"diag", "qa-layout"})
    @SuppressWarnings("unchecked")
    public void qaLayoutSetup() throws Exception {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String m = DeskWorkflowRulesApi.TICKETS;
        Map<String, Object> base = baselineStandard();
        // 1. the two QA fields
        List<Map<String, Object>> newFields = new ArrayList<>();
        for (String[] f : new String[][]{{QA_DATE, "QA WF Date", "date"}, {QA_ADDRESS, "QA WF Address", "address"}}) {
            if (fieldNamed(api, f[0]) != null) continue;
            Map<String, Object> nf = new LinkedHashMap<>();
            nf.put("fieldName", f[0]);
            nf.put("labels", Map.of("en", f[1]));
            nf.put("datatypeKey", f[2]);
            nf.put("datatypeOptions", Map.of());
            nf.put("required", false);
            nf.put("unique", false);
            nf.put("uniquePeerModuleIds", List.of());
            newFields.add(nf);
        }
        if (!newFields.isEmpty()) {
            Response c = api.post("/modules/" + m + "/fields", Map.of("fields", newFields));
            System.out.println("[setup] create fields -> " + c.statusCode() + " " + c.asString().substring(0, Math.min(300, c.asString().length())));
            DeskWorkflowRulesApi.ok(c, "create QA fields");
        }
        Map<String, Object> date = fieldNamed(api, QA_DATE), addr = fieldNamed(api, QA_ADDRESS);
        System.out.println("[setup] date field " + date.get("id") + " type=" + date.get("datatypeKey"));
        System.out.println("[setup] address field " + addr.get("id") + " type=" + addr.get("datatypeKey") + " subFields=" + addr.get("subFields"));
        // 2. Standard must still match the baseline
        Map<String, Object> std = layoutNamed(api, "Standard");
        boolean same = fieldIds(std).equals(fieldIds(base));
        System.out.println("[setup] Standard unchanged after creating the fields: " + same);
        if (!same) throw new IllegalStateException("Standard layout changed when the QA fields were created - stop and tell the user. Now: "
                + fieldIds(std) + " baseline: " + fieldIds(base));
        // 3. QA layout = copy of Standard's views + the two fields in the first column, no profiles
        if (layoutNamed(api, QA_LAYOUT) == null) {
            Map<String, Object> views = new LinkedHashMap<>();
            for (String v : List.of("CREATE", "QUICK_CREATE", "DETAIL")) {
                Map<String, Object> lay = (Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) base.get("views")).get(v)).get("layout");
                Map<String, Object> copy = new io.restassured.path.json.JsonPath(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(lay)).getMap("$");
                if (!"QUICK_CREATE".equals(v)) {
                    Map<String, Object> col = (Map<String, Object>) ((List<Object>) ((Map<String, Object>) ((List<Object>) copy.get("sections")).get(0)).get("columns")).get(0);
                    List<Object> fl = new ArrayList<>((List<Object>) col.get("fields"));
                    for (Map<String, Object> f : List.of(date, addr)) {
                        Map<String, Object> e = new LinkedHashMap<>();
                        for (String k : List.of("id", "apiName", "fieldName", "labels", "datatypeKey", "config")) e.put(k, f.get(k));
                        e.put("fieldOrder", fl.size());
                        fl.add(e);
                    }
                    col.put("fields", fl);
                }
                views.put(v, Map.of("layout", copy));
            }
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("name", QA_LAYOUT);
            body.put("views", views);
            body.put("assignedProfiles", List.of()); // nobody is switched to this layout
            body.put("status", "active");
            Response r = api.post("/modules/" + m + "/layouts", body);
            System.out.println("[setup] create layout -> " + r.statusCode() + " " + r.asString().substring(0, Math.min(300, r.asString().length())));
            DeskWorkflowRulesApi.ok(r, "create QA layout");
        }
        Map<String, Object> qa = layoutNamed(api, QA_LAYOUT);
        System.out.println("[setup] QA layout " + qa.get("id") + " profiles=" + qa.get("assignedProfiles") + " default=" + qa.get("isDefault") + " fields=" + fieldIds(qa));
        System.out.println("[setup] Standard unchanged at the end: " + fieldIds(layoutNamed(api, "Standard")).equals(fieldIds(base))
                + " | Standard default=" + layoutNamed(api, "Standard").get("isDefault"));
    }

    @Test(groups = {"diag", "qa-layout"})
    public void qaLayoutTeardown() throws Exception {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String m = DeskWorkflowRulesApi.TICKETS;
        Map<String, Object> qa = layoutNamed(api, QA_LAYOUT);
        if (qa != null) {
            Response d = api.delete("/modules/" + m + "/layouts/" + qa.get("id"));
            System.out.println("[teardown] delete layout -> " + d.statusCode() + " " + d.asString().substring(0, Math.min(300, d.asString().length())));
        }
        for (String f : List.of(QA_DATE, QA_ADDRESS)) {
            Map<String, Object> x = fieldNamed(api, f);
            if (x == null) continue;
            Response d = api.delete("/modules/" + m + "/fields/" + x.get("id"));
            System.out.println("[teardown] delete field " + f + " -> " + d.statusCode() + " " + d.asString().substring(0, Math.min(300, d.asString().length())));
        }
        System.out.println("[teardown] QA layout gone: " + (layoutNamed(api, QA_LAYOUT) == null) + " | fields gone: "
                + (fieldNamed(api, QA_DATE) == null && fieldNamed(api, QA_ADDRESS) == null)
                + " | Standard same as baseline: " + fieldIds(layoutNamed(api, "Standard")).equals(fieldIds(baselineStandard())));
    }

    /** Read-only: saves the Standard ticket layout (baseline) to target/standard-layout-baseline.json and prints its structure. */
    @Test(groups = {"diag"})
    public void standardLayoutBaseline() throws Exception {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        Response r = DeskWorkflowRulesApi.ok(api.get("/modules/" + DeskWorkflowRulesApi.TICKETS + "/layouts"), "layouts");
        java.nio.file.Path out = qa.core.config.Config.projectDir().resolve("target/standard-layout-baseline.json");
        if (!java.nio.file.Files.exists(out)) java.nio.file.Files.writeString(out, r.asString());
        System.out.println("[layout] saved " + out + " (" + r.asString().length() + " chars)");
        Map<String, Object> std = r.jsonPath().<Map<String, Object>>getList("data").get(0);
        System.out.println("[layout] keys " + std.keySet() + " status=" + std.get("status") + " assignedProfiles=" + std.get("assignedProfiles"));
        Map<?, ?> views = (Map<?, ?>) std.get("views");
        for (Object k : views.keySet()) {
            Map<?, ?> v = (Map<?, ?>) views.get(k);
            String s = String.valueOf(v.get("layout"));
            System.out.println("[view " + k + "] keys " + v.keySet() + " | " + s.substring(0, Math.min(700, s.length())));
        }
    }

    /** Read-only facts for phase 2: macros and what they do, users per role (ids only), notifications readable. */
    @Test(groups = {"diag"})
    public void phase2Facts() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        Response m = api.get("/desk/macros?include_inactive=true");
        System.out.println("[macros] " + m.statusCode());
        List<Map<String, Object>> macros = m.jsonPath().getList("data");
        if (macros == null) macros = m.jsonPath().getList("data.items");
        if (macros != null) for (Map<String, Object> x : macros) {
            String a = String.valueOf(x.get("actions"));
            System.out.println("[macro] " + x.get("id") + " | " + x.get("name") + " | active=" + x.get("is_active") + " | dept=" + x.get("department_id")
                    + " | actions=" + a.substring(0, Math.min(400, a.length())));
        }
        else System.out.println("[macros raw] " + m.asString().substring(0, Math.min(800, m.asString().length())));
        Response u = api.get("/iam/users/directory");
        System.out.println("[users] " + u.statusCode());
        List<Map<String, Object>> users = u.jsonPath().getList("data");
        if (users == null) users = u.jsonPath().getList("data.items");
        if (users != null) {
            if (!users.isEmpty()) System.out.println("[user keys] " + users.get(0).keySet());
            for (Map<String, Object> x : users)
                System.out.println("[user] " + x.get("id") + " | role=" + (x.get("role_name") != null ? x.get("role_name") : x.get("role"))
                        + " | active=" + (x.get("is_active") != null ? x.get("is_active") : x.get("status")));
            int shown = 0;
            for (Map<String, Object> x : users) {
                Response d = api.get("/iam/users/" + x.get("userId"));
                Map<String, Object> dm = d.jsonPath().getMap("data");
                if (shown++ == 0) System.out.println("[user detail] " + d.statusCode() + " " + d.asString().replaceAll("\s+", " ").replaceAll("\"email\":\"[^\"]*\"", "\"email\":\"<hidden>\"").substring(0, Math.min(900, d.asString().length())));
                if (dm != null) System.out.println("[user role] " + x.get("userId") + " | role=" + (dm.get("role") != null ? dm.get("role") : dm.get("roleName")) + " | roleId=" + dm.get("roleId") + " | profile=" + (dm.get("profileName") != null ? dm.get("profileName") : dm.get("profiles")) + " | status=" + x.get("status"));
            }
        } else System.out.println("[users raw] " + u.asString().substring(0, Math.min(600, u.asString().length())));
        for (String path : List.of("/iam/org-units", "/iam/users?page=1&page_size=50")) {
            Response o = api.get(path);
            String b = o.asString().replaceAll("\s+", " ").replaceAll("\"email\":\"[^\"]*\"", "\"email\":\"<hidden>\"");
            System.out.println("[probe " + path + "] " + o.statusCode() + " " + b.substring(0, Math.min(1500, b.length())));
        }
        Response n = api.get("/notifications?page=1&page_size=5");
        System.out.println("[notifications] " + n.statusCode() + " " + n.asString().replaceAll("\\s+", " ").substring(0, Math.min(500, n.asString().length())));
    }

    /** Calls module required fields; deletes the subject-less Call left by WFR-I25 on 14 Oct 2026 (id passed with -DcallId). */
    @Test(groups = {"diag"})
    public void callsRequiredAndCleanup() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String m = DeskWorkflowRulesFeature.CALLS_MODULE_ID;
        List<Map<String, Object>> fields = api.get("/modules/" + m + "/fields").jsonPath().getList("data");
        for (Map<String, Object> x : fields)
            if (Boolean.TRUE.equals(x.get("required")) || "subject".equals(x.get("apiName")))
                System.out.println("[calls field] " + x.get("apiName") + " required=" + x.get("required") + " type=" + x.get("datatypeKey"));
        String id = System.getProperty("callId");
        if (id != null && !id.isBlank()) {
            Response r = api.get("/modules/" + m + "/records/" + id);
            String body = r.asString();
            System.out.println("[call] GET " + r.statusCode() + " " + body.substring(0, Math.min(400, body.length())));
            // only the Call our QA rule made: created on the Calls layout with no subject, by the QA run
            if (r.statusCode() == 200 && body.contains("\"call_start_time\"") && !body.contains("\"subject\"")) {
                Response d = api.delete("/modules/" + m + "/records/" + id);
                System.out.println("[call] DELETE " + d.statusCode());
            }
        }
    }

    /** Read-only: ticket fields (api name, type, options), layouts, saved actions - facts for the H / I / J tests. */
    @Test(groups = {"diag"})
    public void ticketFacts() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String m = DeskWorkflowRulesApi.TICKETS;
        Response f = api.get("/modules/" + m + "/fields");
        System.out.println("[fields] " + f.statusCode());
        List<Map<String, Object>> fields = f.jsonPath().getList("data");
        if (fields == null) fields = f.jsonPath().getList("data.fields");
        if (fields != null && !fields.isEmpty()) System.out.println("[field0] " + String.valueOf(fields.get(0)).substring(0, Math.min(900, String.valueOf(fields.get(0)).length())));
        if (fields != null) for (Map<String, Object> x : fields) { String o = String.valueOf(x.get("datatypeOptions")); System.out.println("[f] " + x.get("apiName") + " | " + x.get("datatypeKey") + " | sys=" + x.get("isSystem") + " | " + o.substring(0, Math.min(300, o.length()))); }
        System.out.println("[layout names] " + l0(api, m));
        if (fields != null) for (Map<String, Object> x : fields) {
            Object opts = x.get("options") != null ? x.get("options") : x.get("picklist_values") != null ? x.get("picklist_values") : x.get("pick_list_values");
            String o = opts == null ? "" : String.valueOf(opts);
            System.out.println("[field] " + x.get("api_name") + " | " + (x.get("data_type") != null ? x.get("data_type") : x.get("type"))
                    + " | " + x.get("label") + " | ro=" + x.get("read_only") + (o.isEmpty() ? "" : " | " + o.substring(0, Math.min(260, o.length()))));
        }
        else System.out.println("[fields raw] " + f.asString().substring(0, Math.min(1500, f.asString().length())));
        Response l = api.get("/modules/" + m + "/layouts");
        System.out.println("[layouts] " + l.statusCode() + " " + l.asString().replaceAll("\\s+", " ").substring(0, Math.min(600, l.asString().length())));
        Response a = api.actions();
        System.out.println("[actions] " + a.statusCode() + " " + a.asString().replaceAll("\\s+", " ").substring(0, Math.min(500, a.asString().length())));
    }

    /**
     * Read-only probe (14 Oct 2026): M1 menu link, M2 blank Execution History, and what Owner Assignment's
     * Roles / Profiles tabs list compared with the Desk Roles and Profiles pages. Saves nothing.
     */
    @Test(groups = {"diag"})
    public void readOnlyProbe() {
        org.openqa.selenium.WebDriver d = qa.core.driver.DriverManager.get();
        org.openqa.selenium.JavascriptExecutor js = (org.openqa.selenium.JavascriptExecutor) d;
        String base = qa.core.config.Config.baseUrl();
        new WorkflowRulesListPage().openForApi();
        qa.core.base.Waits.sleep(5000);
        // M1: any link to Execution History anywhere in the page (menu sections may be collapsed or scrolled)
        System.out.println("[M1] links: " + js.executeScript(
                "return [...document.querySelectorAll('a')].filter(a=>/workflow-executions/.test(a.getAttribute('href')||'')||/execution history/i.test(a.textContent)).map(a=>a.textContent.trim()+' -> '+a.getAttribute('href')).join(' | ')"));
        System.out.println("[M1] automation menu: " + js.executeScript(
                "return [...document.querySelectorAll('a')].map(a=>a.getAttribute('href')||'').filter(h=>/settings\\/(automation|workflow)/.test(h)).join(' | ')"));
        String menu = String.valueOf(js.executeScript("return document.body.innerText"));
        int at = menu.indexOf("AUTOMATION");
        System.out.println("[M1] menu from AUTOMATION: " + (at < 0 ? "(no AUTOMATION section in text)" : menu.substring(at, Math.min(menu.length(), at + 600)).replace(System.lineSeparator(), " ").replace("\n", " ")));
        System.out.println("[M1] text has Execution History: " + menu.contains("Execution History"));
        // M2: Execution History by URL, long wait, console errors
        d.get(base + "/settings/workflow-executions");
        for (int i = 0; i < 12; i++) {
            qa.core.base.Waits.sleep(5000);
            String t = String.valueOf(js.executeScript("return document.body.innerText"));
            if (t.contains("Execution History")) { System.out.println("[M2] rendered after ~" + (i + 1) * 5 + " s: " + t.replace('\n', ' ').substring(0, Math.min(400, t.length()))); break; }
            if (i == 11) System.out.println("[M2] still blank after 60 s; body length " + t.length() + " html " + js.executeScript("return document.documentElement.outerHTML.length"));
        }
        try {
            for (org.openqa.selenium.logging.LogEntry e : d.manage().logs().get("browser"))
                if (e.getLevel().intValue() >= java.util.logging.Level.WARNING.intValue()) System.out.println("[M2 console] " + e.getMessage().substring(0, Math.min(300, e.getMessage().length())));
        } catch (RuntimeException e) {
            System.out.println("[M2 console] not available: " + e.getMessage().substring(0, Math.min(120, e.getMessage().length())));
        }
        // Roles / Profiles pages
        for (String p : List.of("/settings/roles", "/settings/profiles")) {
            d.get(base + p);
            qa.core.base.Waits.sleep(8000);
            String t = String.valueOf(js.executeScript("return (document.querySelector('main')||document.body).innerText"));
            System.out.println("[page " + p + "] " + t.replace('\n', ' ').substring(0, Math.min(700, t.length())));
        }
        // Owner Assignment tabs in a new (unsaved) rule
        new qa.features.deskworkflowrules.pages.RuleEditorPage().openNew(DeskWorkflowRulesFeature.TICKETS_MODULE_ID).addAction("Owner Assignment");
        for (String tab : List.of("Roles", "Profiles")) {
            js.executeScript("const t=[...document.querySelectorAll('button,[role=tab]')].filter(b=>b.textContent.trim()===arguments[0]).pop(); if(t) t.click();", tab);
            qa.core.base.Waits.sleep(1500);
            js.executeScript("const s=[...document.querySelectorAll('[role=combobox],button')].filter(b=>/^Select/.test(b.textContent.trim())).pop(); if(s) s.click();");
            qa.core.base.Waits.sleep(1500);
            System.out.println("[owner " + tab + "] " + js.executeScript("return [...document.querySelectorAll('[role=option]')].map(o=>o.textContent.trim()).join(' | ')"));
            new org.openqa.selenium.interactions.Actions(d).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
            qa.core.base.Waits.sleep(800);
        }
    }

    /** Ticket create in Tech: which part of the test setup (layout, channel, paused teammates, a QA rule) gives 500? */
    @Test(groups = {"diag"})
    public void createVariantsProbe() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        String tag = api.tagId("QA WF tag A", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        probe(api, "plain");
        probe(api, "layout");
        probe(api, "layout+channel");
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        try {
            probe(api, "paused layout+channel");
            String r1 = api.createRuleOk(Rules.named("diag fieldupdate").onCreate().fieldUpdate("phone", "123").build());
            probe(api, "paused + QA FieldUpdate rule");
            api.deleteRule(r1);
            String r2 = api.createRuleOk(Rules.named("diag addtags").onCreate().addTags("append", tag).build());
            probe(api, "paused + QA AddTags rule");
            api.deleteRule(r2);
            String r3 = api.createRuleOk(Rules.named("diag webhook").onCreate().webhook("POST", "https://example.com/qa", "{}", Map.of(), 10).build());
            probe(api, "paused + QA Webhook rule");
            api.deleteRule(r3);
        } finally {
            api.restorePaused();
        }
        probe(api, "restored layout+channel");
    }

    /** Same steps as WorkflowActionResultsTest.webhookPut, changing one thing at a time. */
    @Test(groups = {"diag"})
    public void createLikeTestProbe() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        try {
            tryTicket(api, "no rule, test subject", "QA WF I12 " + System.currentTimeMillis() % 100000, true);
            String r = api.createRuleOk(Rules.named("I12 webhook put").onCreate().webhook("PUT", "https://example.com/qa", "{\"id\":\"${recordId}\"}", null, 10).build());
            tryTicket(api, "PUT rule, test subject", "QA WF I12 " + System.currentTimeMillis() % 100000, true);
            tryTicket(api, "PUT rule, diag subject", "QA WF diag put", true);
            tryTicket(api, "PUT rule, no channel", "QA WF I12 " + System.currentTimeMillis() % 100000, false);
            System.out.println("[like] rule body " + api.rule(r).asString());
            api.deleteRule(r);
            tryTicket(api, "rule deleted, test subject", "QA WF I12 " + System.currentTimeMillis() % 100000, true);
        } finally {
            api.restorePaused();
        }
    }

    private static void tryTicket(DeskWorkflowRulesApi api, String label, String subject, boolean channel) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", subject);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", "low");
        if (channel) f.put("channel", "web");
        try {
            String id = api.createTicket(f);
            System.out.println("[like] " + label + " -> created");
            api.deleteTicket(id);
        } catch (RuntimeException e) {
            System.out.println("[like] " + label + " -> " + e.getMessage().substring(0, Math.min(200, e.getMessage().length())));
        }
    }

    private static void probe(DeskWorkflowRulesApi api, String variant) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", "QA WF diag " + variant);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID);
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "Open");
        f.put("priority", "low");
        if (variant.contains("channel")) f.put("channel", "web");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("data", DeskWorkflowRulesApi.recordData(f));
        if (variant.contains("layout") || variant.contains("rule")) body.put("layout_id", DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID);
        Response r = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records", body);
        String s = r.asString();
        System.out.println("[variant] " + variant + " -> " + r.statusCode() + " " + s.substring(0, Math.min(200, s.length())));
        if (r.statusCode() / 100 == 2) api.deleteTicket(r.jsonPath().getString("data.id"));
    }

    /** Which active QA rule makes ticket creation answer 500? One rule at a time, one ticket each. */
    @Test(groups = {"diag"})
    public void ruleCrashProbe() {
        new WorkflowRulesListPage().openForApi();
        DeskWorkflowRulesApi api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        try {
            String tag = api.tagId("QA WF tag A", DeskWorkflowRulesFeature.DEFAULT_DEPARTMENT_ID);
            Map<String, Map<String, Object>> variants = new LinkedHashMap<>();
            variants.put("none (no QA rule)", null);
            variants.put("guard + AddTags", Rules.named("diag guard addtags").onCreate().addTags("append", tag).build());
            variants.put("guard + FieldUpdate", Rules.named("diag guard fieldupdate").onCreate().fieldUpdate("phone", "123").build());
            variants.put("priority membership + AddTags (no guard)", Rules.named("diag membership addtags").unguarded().onCreate()
                    .where(Rules.and(Rules.oneOf("priority", "low"), Rules.oneOf("email", "qa.workflow@qa.test"))).addTags("append", tag).build());
            variants.put("guard contains + AddTags", Rules.named("diag contains addtags").unguarded().onCreate()
                    .where(Rules.contains("subject", "QA WF diag")).addTags("append", tag).build());
            variants.put("guard + AddTags, Edit trigger", Rules.named("diag guard addtags edit").onEdit().addTags("append", tag).build());
            for (var v : variants.entrySet()) {
                String ruleId = v.getValue() == null ? null : api.createRuleOk(v.getValue());
                Map<String, Object> f = new LinkedHashMap<>();
                f.put("subject", "QA WF diag " + v.getKey());
                f.put("department", DeskWorkflowRulesFeature.DEFAULT_DEPARTMENT_ID);
                f.put("email", "qa.workflow@qa.test");
                f.put("status", "Open");
                f.put("priority", "low");
                f.put("channel", "web");
                Response r = api.post("/modules/" + DeskWorkflowRulesApi.TICKETS + "/records",
                        Map.of("data", DeskWorkflowRulesApi.recordData(f), "layout_id", DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID));
                String s = r.asString();
                System.out.println("[probe] " + v.getKey() + " -> " + r.statusCode() + " " + s.substring(0, Math.min(250, s.length())));
                if (r.statusCode() / 100 == 2) api.deleteTicket(r.jsonPath().getString("data.id"));
                if (ruleId != null) api.deleteRule(ruleId);
            }
        } finally {
            api.restorePaused();
        }
    }
}
