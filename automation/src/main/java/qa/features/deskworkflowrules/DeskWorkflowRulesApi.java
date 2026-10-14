package qa.features.deskworkflowrules;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import qa.core.api.ApiClient;
import qa.core.base.Waits;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;

/**
 * Workflow API (/api/v1, x-app-key: desk): build QA rules and tickets, read what rules did, clean up.
 * Every write is limited to records whose name / subject starts with the QA prefix; teammates' rules are only
 * ever paused (deactivated) and restored, never edited or deleted.
 * Needs api.headers + api.tokenScript in config.properties (see feature-map "API").
 */
public class DeskWorkflowRulesApi extends ApiClient {
    public static final String TICKETS = DeskWorkflowRulesFeature.TICKETS_MODULE_ID;
    private static final Path PAUSED = Config.projectDir().resolve("target/paused-teammate-rules.txt");

    /**
     * The access token lives 5 minutes and its cookie disappears when it expires (the app only refreshes while a
     * page is active). If the cookie is gone, reload the signed-in page so the app refreshes it, then read it again.
     * ApiClient's 401 retry calls resetToken() + token(), so long tests and cleanups survive token expiry.
     */
    @Override
    public String token() {
        String t = super.token();
        if ((t == null || t.isEmpty()) && qa.core.driver.DriverManager.has()) {
            try {
                qa.core.driver.DriverManager.get().navigate().refresh();
                Waits.sleep(8000);
            } catch (RuntimeException ignored) {
                // page reload is best effort
            }
            resetToken();
            t = super.token();
        }
        return t;
    }

    /**
     * Call before creating anything. If the API can't be reached with the browser's token, the test
     * could neither read its result (false pass) nor clean up (QA rules left active), so it is skipped.
     */
    public DeskWorkflowRulesApi requireAuth() {
        requireAuth("/workflow/rules?take=1");
        return this;
    }

    // ---------------- rules ----------------

    public Response rules() {
        return get("/workflow/rules?take=200");
    }

    public List<Map<String, Object>> ruleList() {
        return ok(rules(), "GET /workflow/rules").jsonPath().getList("data");
    }

    /** Ids of rules whose name starts with the prefix (e.g. "QA "). */
    public List<String> ruleIdsNamed(String prefix) {
        return ruleList().stream().filter(r -> String.valueOf(r.get("name")).startsWith(prefix))
                .map(r -> String.valueOf(r.get("id"))).toList();
    }

    public Response createRule(Map<String, Object> body) {
        return post("/workflow/rules", body);
    }

    /** Creates a rule and returns its id; fails the test on any non-2xx (with the server's message). */
    public String createRuleOk(Map<String, Object> body) {
        return ok(createRule(body), "POST /workflow/rules " + body.get("name")).jsonPath().getString("data.id");
    }

    public Response rule(String id) {
        return get("/workflow/rules/" + id);
    }

    public Response patchRule(String id, Map<String, Object> body) {
        return patch("/workflow/rules/" + id, body);
    }

    public Response deleteRule(String id) {
        return delete("/workflow/rules/" + id);
    }

    public Response activate(String ruleId) {
        return post("/workflow/rules/" + ruleId + "/activate", null);
    }

    public Response deactivate(String ruleId) {
        return post("/workflow/rules/" + ruleId + "/deactivate", null);
    }

    public Response reorder(String moduleId, List<String> ids) {
        return put("/workflow/rules/reorder", Map.of("moduleId", moduleId, "orderedRuleIds", ids));
    }

    public Response evaluate(Map<String, Object> body) {
        return post("/workflow/rules/evaluate", body);
    }

    public Response execute(String ruleId, Map<String, Object> body) {
        return post("/workflow/rules/" + ruleId + "/execute", body);
    }

    /** Deletes every rule whose name starts with the prefix (QA data only). */
    public void deleteRulesNamed(String prefix) {
        if (!prefix.startsWith("QA")) throw new IllegalArgumentException("only QA rules may be deleted: " + prefix);
        for (String id : ruleIdsNamed(prefix)) deleteRule(id);
    }

    // ------- teammates' rules: pause for a clean run, always restore -------

    /**
     * Deactivates every ACTIVE rule on the module whose name does not start with "QA " and remembers the ids
     * (in memory and in target/paused-teammate-rules.txt) so {@link #restorePaused()} can switch them back on,
     * even from a later run if this one died. Approved by the user (12 Oct 2026) for clean side-effect counts.
     */
    public List<String> pauseOtherRules(String moduleId) {
        List<String> paused = new ArrayList<>(readPaused());
        for (Map<String, Object> r : ruleList()) {
            String name = String.valueOf(r.get("name"));
            if (name.startsWith("QA ") || !moduleId.equals(r.get("moduleId")) || !Boolean.TRUE.equals(r.get("isActive"))) continue;
            String id = String.valueOf(r.get("id"));
            ok(deactivate(id), "pause teammate rule " + name);
            if (!paused.contains(id)) paused.add(id);
            writePaused(paused); // after each one, so an aborted run still knows what to restore
        }
        writePaused(paused);
        return paused;
    }

    /** Reactivates every rule this or an earlier run paused, then forgets them. */
    public void restorePaused() {
        List<String> ids = readPaused();
        List<String> failed = new ArrayList<>();
        for (String id : ids) {
            Response r = activate(id);
            boolean alreadyActive = r.statusCode() == 409 && r.asString().contains("already active");
            if (r.statusCode() / 100 != 2 && !alreadyActive) {
                failed.add(id);
                System.err.println("[restore] activate " + id + " -> " + r.statusCode() + " " + r.asString());
            }
        }
        writePaused(failed);
        if (!failed.isEmpty()) throw new IllegalStateException("could not reactivate teammate rules " + failed + " - do it by hand");
    }

    private static List<String> readPaused() {
        try {
            return Files.exists(PAUSED) ? new ArrayList<>(Files.readAllLines(PAUSED).stream().filter(s -> !s.isBlank()).toList()) : new ArrayList<>();
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    private static void writePaused(List<String> ids) {
        try {
            Files.createDirectories(PAUSED.getParent());
            Files.write(PAUSED, ids);
        } catch (Exception e) {
            throw new IllegalStateException("cannot write " + PAUSED, e);
        }
    }

    // ---------------- saved actions ----------------

    public Response actions() {
        return get("/workflow/actions");
    }

    public Response createAction(Map<String, Object> body) {
        return post("/workflow/actions", body);
    }

    public Response patchAction(String id, Map<String, Object> body) {
        return patch("/workflow/actions/" + id, body);
    }

    public Response deleteAction(String id) {
        return delete("/workflow/actions/" + id);
    }

    public Response actionUsage(String id) {
        return get("/workflow/actions/" + id + "/usage");
    }

    public void deleteActionsNamed(String prefix) {
        if (!prefix.startsWith("QA")) throw new IllegalArgumentException("only QA actions may be deleted: " + prefix);
        List<Map<String, Object>> list = ok(actions(), "GET /workflow/actions").jsonPath().getList("data");
        for (Map<String, Object> a : list) if (String.valueOf(a.get("name")).startsWith(prefix)) deleteAction(String.valueOf(a.get("id")));
    }

    // ---------------- tickets (records) ----------------

    /** Creates a ticket on the Tickets module. fields = {apiName: value}; strings, numbers, booleans or lists. */
    public String createTicket(Map<String, Object> fields) {
        Object subject = fields.get("subject");
        if (subject == null || !String.valueOf(subject).startsWith("QA ")) throw new IllegalArgumentException("QA tickets only: " + subject);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("data", recordData(fields));
        body.put("layout_id", DeskWorkflowRulesFeature.STANDARD_LAYOUT_ID);
        return ok(post("/modules/" + TICKETS + "/records", body), "create ticket " + subject).jsonPath().getString("data.id");
    }

    public Response updateTicket(String id, Map<String, Object> fields) {
        return patch("/modules/" + TICKETS + "/records/" + id, Map.of("data", recordData(fields)));
    }

    public Response deleteTicket(String id) {
        return delete("/modules/" + TICKETS + "/records/" + id);
    }

    /** Record write shape: [{field, value:{kind, value | items}}]. */
    public static List<Map<String, Object>> recordData(Map<String, Object> fields) {
        List<Map<String, Object>> out = new ArrayList<>();
        fields.forEach((k, v) -> out.add(Map.of("field", k, "value", fv(v))));
        return out;
    }

    private static Map<String, Object> fv(Object v) {
        if (v == null) return Rules.kinded("kind", "null");
        if (v instanceof Number) return Rules.kinded("kind", "number", "value", v);
        if (v instanceof Boolean) return Rules.kinded("kind", "boolean", "value", v);
        if (v instanceof List<?> l) return Rules.kinded("kind", "array", "items", l.stream().map(DeskWorkflowRulesApi::fv).toList());
        return Rules.kinded("kind", "string", "value", String.valueOf(v));
    }

    /** Field values of a record, flattened {field: value}; lists as "[a, b]". Fails on any non-200. */
    public Map<String, String> record(String moduleId, String recordId) {
        Response r = ok(get("/modules/" + moduleId + "/records/" + recordId), "GET record " + recordId);
        JsonPath j = r.jsonPath();
        List<Map<String, Object>> fields = j.getList("data.data");
        if (fields == null || fields.isEmpty())
            throw new IllegalStateException("GET record " + recordId + " had no data.data fields: " + r.asString());
        Map<String, String> out = new LinkedHashMap<>();
        for (Map<String, Object> f : fields) out.put(String.valueOf(f.get("field")), flat(f.get("value")));
        return out;
    }

    public Map<String, String> ticket(String id) {
        return record(TICKETS, id);
    }

    @SuppressWarnings("unchecked")
    private static String flat(Object v) {
        if (!(v instanceof Map<?, ?> m)) return v == null ? null : String.valueOf(v);
        if (m.containsKey("items")) return String.valueOf(((List<Object>) m.get("items")).stream().map(DeskWorkflowRulesApi::flat).toList());
        Object x = m.get("value");
        return x == null ? null : String.valueOf(x);
    }

    // ---------------- executions ----------------

    public Response executionsForRecord(String recordId) {
        return get("/workflow/executions?recordId=" + recordId + "&take=100");
    }

    public List<Map<String, Object>> executions(String recordId) {
        return ok(executionsForRecord(recordId), "GET /workflow/executions").jsonPath().getList("data");
    }

    /** Executions of one rule on one record. */
    public List<Map<String, Object>> executions(String recordId, String ruleId) {
        return executions(recordId).stream().filter(e -> ruleId.equals(e.get("ruleId"))).toList();
    }

    /** Raw Execution History body for a record (for failure messages). */
    public String executionsText(String recordId) {
        Response r = executionsForRecord(recordId);
        String s = r.statusCode() + " " + r.asString();
        return s.length() > 1500 ? s.substring(0, 1500) + "…" : s;
    }

    /** Polls the ticket until the condition holds (true) or the time is up (false). Gentle: the API is shared. */
    public boolean waitTicket(String id, Predicate<Map<String, String>> cond, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            if (cond.test(ticket(id))) return true;
            Waits.sleep(3000);
        }
        return cond.test(ticket(id));
    }

    // ---------------- lookups ----------------

    public List<Map<String, Object>> tags() {
        return ok(get("/desk/tags"), "GET /desk/tags").jsonPath().getList("data.tags");
    }

    /** Id of a tag with this name in the department, creating it if missing (QA tags only). */
    public String tagId(String name, String departmentId) {
        for (Map<String, Object> t : tags())
            if (name.equals(t.get("name")) && departmentId.equals(t.get("department_id"))) return String.valueOf(t.get("id"));
        if (!name.startsWith("QA ")) throw new IllegalArgumentException("only QA tags are created: " + name);
        return ok(post("/desk/tags", Map.of("department_id", departmentId, "name", name)), "create tag " + name)
                .jsonPath().getString("data.id");
    }

    /**
     * Puts tags on a ticket the way the ticket view does (POST /desk/tickets/{id}/tags {tag_ids}).
     * A "tags" value in the record create body is not saved, so starting tags must be added here.
     */
    public void addTicketTags(String ticketId, String... tagIds) {
        ok(post("/desk/tickets/" + ticketId + "/tags", Map.of("tag_ids", List.of(tagIds))), "add tags to ticket " + ticketId);
    }

    public Response deleteTag(String id) {
        return delete("/desk/tags/" + id);
    }
}
