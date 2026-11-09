package qa.features.deskblueprint;

import io.qameta.allure.restassured.AllureRestAssured;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.testng.SkipException;
import qa.core.auth.Credentials;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

import static qa.features.deskblueprint.DeskBlueprintFeature.*;

/**
 * Desk Blueprint API as the org-Anyware owner, signed in once per JVM through POST /iam/auth/login (x-tenant-id).
 * Writes are limited to "QA BP " records; everything created is tracked and removed by {@link #cleanup()}.
 * A 429 stops every further call (shared owner account must not be locked). Tokens are never logged.
 */
public final class DeskBlueprintApi {
    private static DeskBlueprintApi instance;
    private static volatile String rateLimited;

    private String access;
    private String refresh;
    private long at;

    /** Ids created by this run, removed by cleanup() (tickets first, then blueprints). */
    public final Set<String> createdTickets = Collections.newSetFromMap(new ConcurrentHashMap<>());
    public final Set<String> createdBlueprints = Collections.newSetFromMap(new ConcurrentHashMap<>());

    private DeskBlueprintApi() {
    }

    public static synchronized DeskBlueprintApi get() {
        if (rateLimited != null) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run - stopped");
        if (instance == null) {
            DeskBlueprintApi a = new DeskBlueprintApi();
            a.login();
            instance = a;
        }
        return instance;
    }

    public static boolean started() {
        return instance != null;
    }

    // ---------------- session ----------------

    private static RequestSpecification base() {
        return RestAssured.given().baseUri(HOST + "/api/v1").contentType(ContentType.JSON).relaxedHTTPSValidation()
                .header("x-tenant-id", TENANT).header("x-app-key", "desk")
                .config(RestAssured.config().logConfig(io.restassured.config.LogConfig.logConfig()
                                .blacklistHeaders(List.of("Authorization", "Cookie", "Set-Cookie")))
                        .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                                .setParam("http.connection.timeout", 30000).setParam("http.socket.timeout", 90000)));
    }

    private synchronized void login() {
        Credentials c = Credentials.find(CREDENTIALS, HOST.replaceFirst("https?://", ""), OWNER);
        Response r = base().body(Map.of("email", c.email, "password", c.password(), "device_label", "qa-automation", "remember_me", true))
                .post("/iam/auth/login");
        if (r.statusCode() == 429) {
            rateLimited = "login";
            throw new SkipException("INCONCLUSIVE: sign-in rate-limited (429) - stop, do not retry");
        }
        if (r.statusCode() != 200) throw new IllegalStateException("Sign-in failed for " + OWNER + ": " + r.statusCode());
        access = r.jsonPath().getString("data.access_token");
        refresh = r.jsonPath().getString("data.refresh_token");
        at = System.currentTimeMillis();
    }

    private synchronized String token() {
        if (System.currentTimeMillis() - at > 4 * 60_000) {
            Response r = base().body(Map.of("refresh_token", refresh)).post("/iam/auth/refresh");
            if (r.statusCode() == 200 && r.jsonPath().getBoolean("success")) {
                access = r.jsonPath().getString("data.access_token");
                String nr = r.jsonPath().getString("data.refresh_token");
                if (nr != null) refresh = nr;
                at = System.currentTimeMillis();
            } else login();
        }
        return access;
    }

    /** Request with the owner's token. */
    public RequestSpecification req() {
        return base().filter(new AllureRestAssured()).header("Authorization", "Bearer " + token());
    }

    /** Request with no token (401 rows). */
    public static RequestSpecification anonymous() {
        return base().filter(new AllureRestAssured());
    }

    private Response call(Supplier<Response> c) {
        if (rateLimited != null) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run - stopped");
        RuntimeException last = null;
        for (int i = 0; i < 4; i++) {
            try {
                Response r = c.get();
                if (r.statusCode() == 401) {
                    at = 0;
                    r = c.get();
                }
                if (r.statusCode() == 429) {
                    rateLimited = "api";
                    throw new SkipException("INCONCLUSIVE: HTTP 429 rate limit - stop, do not retry");
                }
                if (r.statusCode() != 502 && r.statusCode() != 503 && r.statusCode() != 504) return r;
            } catch (SkipException e) {
                throw e;
            } catch (RuntimeException e) {
                last = e;
            }
            sleep(3000L * (i + 1));
        }
        if (last != null) throw last;
        throw new IllegalStateException("staging kept answering 502/503/504");
    }

    public Response get(String p) { return call(() -> req().get(p)); }
    public Response post(String p, Object b) { return call(() -> req().body(b).post(p)); }
    public Response put(String p, Object b) { return call(() -> req().body(b).put(p)); }
    public Response patch(String p, Object b) { return call(() -> req().body(b).patch(p)); }
    public Response delete(String p) { return call(() -> req().delete(p)); }

    /** Returns the response if 2xx, else throws: a failed read must never look like "not there". */
    public static Response ok(Response r, String what) {
        if (r.statusCode() / 100 != 2) throw new IllegalStateException(what + " returned " + r.statusCode() + ": " + r.asString());
        return r;
    }

    public static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    // ---------------- blueprints ----------------

    private static String bp() { return "/modules/" + TICKETS + "/blueprints"; }

    public Response list() { return get(bp() + "?includeInactive=true"); }

    public List<Map<String, Object>> listData() { return ok(list(), "GET blueprints").jsonPath().getList("data"); }

    public Response blueprint(String id) { return get(bp() + "/" + id); }

    public Map<String, Object> definition(String id) { return ok(blueprint(id), "GET blueprint").jsonPath().getMap("data.definition"); }

    public Response create(Map<String, Object> def, boolean active) {
        String name = String.valueOf(def.get("name"));
        if (!name.startsWith(QA)) throw new IllegalArgumentException("QA blueprints only: " + name);
        Response r = post(bp(), Map.of("definition", def, "isActive", active));
        if (r.statusCode() / 100 == 2) createdBlueprints.add(r.jsonPath().getString("data.id"));
        return r;
    }

    public String createOk(Map<String, Object> def, boolean active) {
        return ok(create(def, active), "create blueprint " + def.get("name")).jsonPath().getString("data.id");
    }

    public Response update(String id, Map<String, Object> def, boolean active) {
        return put(bp() + "/" + id, Map.of("definition", def, "isActive", active));
    }

    public Response saveDraft(String id, Map<String, Object> def) { return put(bp() + "/" + id + "/draft", Map.of("definition", def)); }

    public Response publish(String id) { return post(bp() + "/" + id + "/publish", Map.of()); }

    public Response versions(String id) { return get(bp() + "/" + id + "/versions"); }

    public Response restore(String id, String versionId) { return post(bp() + "/" + id + "/versions/" + versionId + "/restore", Map.of()); }

    public Response remove(String id) {
        Response r = delete(bp() + "/" + id);
        if (r.statusCode() / 100 == 2) createdBlueprints.remove(id);
        return r;
    }

    /** Reorders blueprints of one department; first id gets the lowest sort_order (as the list page sends it). */
    public Response sort(String departmentId, List<String> ids) {
        List<Map<String, Object>> items = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) items.add(Map.of("id", ids.get(i), "sort_order", (i + 1) * 1024));
        return patch(bp() + "/sort", Map.of("department_id", departmentId, "items", items));
    }

    public Response include(String id, String stateId, List<String> ticketIds) {
        return post("/desk/blueprints/" + id + "/include", Map.of("state_id", stateId, "ticket_ids", ticketIds));
    }

    public Response revokeAll(String id) {
        Map<String, Object> b = new HashMap<>();
        b.put("ticket_ids", null);
        b.put("after", null);
        return post("/desk/blueprints/" + id + "/revoke", b);
    }

    // ---------------- tickets ----------------

    public static Map<String, Object> v(Object x) {
        Map<String, Object> m = new LinkedHashMap<>(); // "kind" must be the first key (B-1 in the workflow run)
        if (x instanceof Number) {
            m.put("kind", "number");
            m.put("value", x);
        } else {
            m.put("kind", "string");
            m.put("value", String.valueOf(x));
        }
        return m;
    }

    /** Creates a QA ticket in the QA department (Status Open unless given). */
    public Response createTicket(String subject, Map<String, Object> fields) {
        if (!subject.startsWith(QA)) throw new IllegalArgumentException("QA tickets only: " + subject);
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", subject);
        f.put("department", QA_DEPT);
        f.put("status", "Open");
        if (fields != null) f.putAll(fields);
        List<Map<String, Object>> data = new ArrayList<>();
        f.forEach((k, val) -> data.add(Map.of("field", k, "value", v(val))));
        Response r = post("/modules/" + TICKETS + "/records", Map.of("data", data));
        if (r.statusCode() / 100 == 2) createdTickets.add(r.jsonPath().getString("data.id"));
        return r;
    }

    public String ticketOk(String subject) { return ticketOk(subject, null); }

    public String ticketOk(String subject, Map<String, Object> fields) {
        return ok(createTicket(subject, fields), "create ticket " + subject).jsonPath().getString("data.id");
    }

    /** Same as createTicket but without the QA guard: only for the entry-criteria negative row (subject still marks it as QA). */
    public String ticketNoPrefixOk(String subject) {
        if (!subject.contains("QA")) throw new IllegalArgumentException("must still be recognisable as QA: " + subject);
        List<Map<String, Object>> data = List.of(Map.of("field", "subject", "value", v(subject)),
                Map.of("field", "department", "value", v(QA_DEPT)), Map.of("field", "status", "value", v("Open")));
        Response r = ok(post("/modules/" + TICKETS + "/records", Map.of("data", data)), "create ticket " + subject);
        String id = r.jsonPath().getString("data.id");
        createdTickets.add(id);
        return id;
    }

    public Response patchTicket(String id, String field, Object value) {
        return patch("/modules/" + TICKETS + "/records/" + id, Map.of("data", List.of(Map.of("field", field, "value", v(value)))));
    }

    /** Field values of a ticket record (field -> raw value). */
    public Map<String, Object> fields(String id) {
        List<Map<String, Object>> d = ok(get("/modules/" + TICKETS + "/records/" + id), "GET ticket").jsonPath().getList("data.data");
        Map<String, Object> m = new HashMap<>();
        for (Map<String, Object> x : d) {
            Object val = x.get("value");
            m.put(String.valueOf(x.get("field")), val instanceof Map<?, ?> vm ? vm.get("value") : val);
        }
        return m;
    }

    public Response deleteTicket(String id) {
        Response r = delete("/modules/" + TICKETS + "/records/" + id);
        if (r.statusCode() / 100 == 2) createdTickets.remove(id);
        return r;
    }

    public Response state(String ticketId) { return get("/modules/" + TICKETS + "/records/" + ticketId + "/blueprint-state"); }

    /** First blueprint state entry of the ticket, or null if it is in no blueprint. */
    public Map<String, Object> stateOf(String ticketId) {
        List<Map<String, Object>> s = ok(state(ticketId), "GET blueprint-state").jsonPath().getList("data.states");
        return s == null || s.isEmpty() ? null : s.get(0);
    }

    /** Waits up to maxMs for the ticket to show a blueprint state (entry is near-instant but staging lags). */
    public Map<String, Object> waitState(String ticketId, long maxMs) {
        long end = System.currentTimeMillis() + maxMs;
        Map<String, Object> s;
        do {
            s = stateOf(ticketId);
            if (s != null) return s;
            sleep(1500);
        } while (System.currentTimeMillis() < end);
        return null;
    }

    public Response transitions(String ticketId) { return get("/modules/" + TICKETS + "/records/" + ticketId + "/blueprint-transitions"); }

    /** Runs a transition; body keys as the app sends them. run_id and expected_state_id are added if missing. */
    public Response run(String ticketId, String transitionId, String expectedState, Map<String, Object> items) {
        Map<String, Object> b = runBody(expectedState, items);
        return post("/desk/tickets/" + ticketId + "/blueprint-transitions/" + transitionId, b);
    }

    public static Map<String, Object> runBody(String expectedState, Map<String, Object> items) {
        Map<String, Object> b = new HashMap<>();
        b.put("run_id", UUID.randomUUID().toString());
        b.put("expected_state_id", expectedState);
        b.put("fields", Map.of());
        b.put("checklist", Map.of());
        b.put("reply", null);
        b.put("comment", null);
        b.put("attachment_ids", List.of());
        b.put("resolution", null);
        if (items != null) b.putAll(items);
        return b;
    }

    public Response runRaw(String ticketId, String transitionId, Map<String, Object> body) {
        return post("/desk/tickets/" + ticketId + "/blueprint-transitions/" + transitionId, body);
    }

    public Response revokeTicket(String ticketId) { return post("/desk/tickets/" + ticketId + "/blueprint/revoke", Map.of()); }

    public Response bulkRevoke(List<String> ids) { return post("/desk/tickets/bulk/blueprint-revoke", Map.of("ticket_ids", ids)); }

    public List<Map<String, Object>> history(String ticketId) {
        return ok(get("/desk/tickets/" + ticketId + "/history"), "GET history").jsonPath().getList("data");
    }

    public Response sla(String ticketId) { return get("/desk/tickets/" + ticketId + "/sla"); }

    /** "CODE message" from an error body; safe on empty or non-JSON bodies (e.g. 204). */
    public static String err(Response r) {
        String body = r.asString();
        if (body == null || body.isBlank() || !body.trim().startsWith("{")) return r.statusCode() + " " + (body == null ? "" : body);
        try {
            JsonPath j = new JsonPath(body);
            String code = j.getString("error.code");
            return code == null ? r.statusCode() + " " + body : r.statusCode() + " " + code + " " + j.getString("error.message");
        } catch (RuntimeException e) {
            return r.statusCode() + " " + body;
        }
    }

    /** Names of the transitions the ticket can run now (what the live blueprint version offers). */
    public List<String> transitionNames(String ticketId) {
        List<String> n = ok(transitions(ticketId), "GET blueprint-transitions").jsonPath().getList("data.transitionName");
        return n == null ? List.of() : n;
    }

    // ---------------- other Desk records used by Phase 2 (all tracked for cleanup) ----------------

    public final Set<String> createdRules = Collections.newSetFromMap(new ConcurrentHashMap<>());
    public final Set<String> createdSla = Collections.newSetFromMap(new ConcurrentHashMap<>());
    public final Set<String> createdTasks = Collections.newSetFromMap(new ConcurrentHashMap<>());

    /** Workflow rule on Desk tickets: trigger RecordCreated / RecordUpdated, guarded by subject starts with {@code subjectPrefix} (must start "QA BP "). */
    public String workflowRuleOk(String name, String trigger, String subjectPrefix, Map<String, String> fieldUpdates) {
        if (!subjectPrefix.startsWith(QA) || !name.startsWith(QA)) throw new IllegalArgumentException("QA rules only");
        Map<String, Object> crit = new LinkedHashMap<>();
        crit.put("kind", "StringMatch");
        crit.put("field", "subject");
        crit.put("operator", "StartsWith");
        crit.put("stringValue", subjectPrefix);
        crit.put("caseInsensitive", false);
        Map<String, Object> upd = new LinkedHashMap<>();
        fieldUpdates.forEach((k, val) -> {
            Map<String, Object> w = new LinkedHashMap<>();
            w.put("kind", "string");
            w.put("stringValue", val);
            upd.put(k, w);
        });
        Map<String, Object> act = new LinkedHashMap<>();
        act.put("type", "FieldUpdate");
        act.put("order", 0);
        act.put("delaySeconds", 0);
        act.put("fieldUpdates", upd);
        Map<String, Object> trig = new LinkedHashMap<>();
        trig.put("kind", trigger);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("moduleId", TICKETS);
        body.put("layoutId", "");
        body.put("name", name);
        body.put("description", "QA automation - safe to delete");
        body.put("mode", "Recurring");
        body.put("isActive", true);
        body.put("trigger", trig);
        body.put("criteria", crit);
        body.put("actions", List.of(act));
        String id = ok(post("/workflow/rules", body), "create workflow rule " + name).jsonPath().getString("data.id");
        createdRules.add(id);
        return id;
    }

    /** Department SLA policy for QA WF Dept R only, matching subjects that contain {@code subjectPart}. */
    public String slaPolicyOk(String name, String subjectPart, int responseHours, int resolutionHours) {
        return slaPolicy(name, subjectPart, responseHours, resolutionHours, "hours");
    }

    /** Same as slaPolicyOk with targets in minutes (the API accepts unit "minutes"). */
    public String slaPolicyOkMinutes(String name, String subjectPart, int responseMinutes, int resolutionMinutes) {
        return slaPolicy(name, subjectPart, responseMinutes, resolutionMinutes, "minutes");
    }

    private String slaPolicy(String name, String subjectPart, int responseHours, int resolutionHours, String unit) {
        if (!name.startsWith(QA)) throw new IllegalArgumentException("QA policies only");
        Map<String, Object> triggers = new HashMap<>();
        triggers.put("create", true);
        triggers.put("update", false);
        triggers.put("customer_reply", false);
        triggers.put("agent_response", false);
        Map<String, Object> target = new LinkedHashMap<>();
        target.put("name", "QA target");
        target.put("sort_order", 0);
        target.put("criteria", Map.of("conditions", List.of(Map.of("field_key", "subject", "operator", "contains", "value", subjectPart))));
        target.put("response", Map.of("value", responseHours, "unit", unit));
        target.put("resolution", Map.of("value", resolutionHours, "unit", unit));
        target.put("calendar_mode", "calendar");
        target.put("first_response_only", true);
        target.put("escalate_on_business_hours", false);
        target.put("escalations", Map.of("response", List.of(), "resolution", List.of()));
        Map<String, Object> p = new LinkedHashMap<>();
        p.put("department_id", QA_DEPT);
        p.put("name", name);
        p.put("description", "QA automation - safe to delete");
        p.put("is_active", true);
        p.put("triggers", triggers);
        p.put("execute_only_with_account", false);
        p.put("resolution_from_created", true);
        p.put("targets", List.of(target));
        p.put("accounts", List.of());
        p.put("support_plans", List.of());
        String id = ok(post("/desk/sla/policies", p), "create SLA policy").jsonPath().getString("data.id");
        createdSla.add(id);
        return id;
    }

    /** Desk tasks whose subject contains {@code marker} (newest 50); ids are tracked for cleanup. */
    public List<Map<String, Object>> tasksWith(String marker) {
        Object data = ok(get("/modules/" + TASKS + "/records?take=50&sort=-created_at"), "GET tasks").jsonPath().get("data");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> all = data instanceof List<?> l ? (List<Map<String, Object>>) l
                : (List<Map<String, Object>>) ((Map<String, Object>) data).get("items");
        List<Map<String, Object>> mine = new ArrayList<>();
        for (Map<String, Object> t : all)
            if (t != null && String.valueOf(t.get("data")).contains(marker)) {
                mine.add(t);
                createdTasks.add(String.valueOf(t.get("id")));
            }
        return mine;
    }

    /** Moves a ticket to another department (the Desk "Move" action). */
    public Response moveTicket(String ticketId, String departmentId) {
        Map<String, Object> b = new HashMap<>();
        b.put("department_id", departmentId);
        b.put("owner_id", null);
        b.put("team_id", null);
        return post("/desk/tickets/" + ticketId + "/move", b);
    }

    // ---------------- cleanup ----------------

    /** Revokes and deletes every QA ticket and QA blueprint this run created. Returns a short log. */
    public synchronized String cleanup() {
        StringBuilder log = new StringBuilder();
        for (String id : new ArrayList<>(createdTasks)) {
            try { log.append("task ").append(id).append(' ').append(delete("/modules/" + TASKS + "/records/" + id).statusCode()).append('\n'); createdTasks.remove(id); }
            catch (RuntimeException e) { log.append("task ").append(id).append(" ERR ").append(e.getMessage()).append('\n'); }
        }
        for (String id : new ArrayList<>(createdRules)) {
            try { log.append("rule ").append(id).append(' ').append(delete("/workflow/rules/" + id).statusCode()).append('\n'); createdRules.remove(id); }
            catch (RuntimeException e) { log.append("rule ").append(id).append(" ERR ").append(e.getMessage()).append('\n'); }
        }
        for (String id : new ArrayList<>(createdSla)) {
            try { log.append("sla ").append(id).append(' ').append(delete("/desk/sla/policies/" + id).statusCode()).append('\n'); createdSla.remove(id); }
            catch (RuntimeException e) { log.append("sla ").append(id).append(" ERR ").append(e.getMessage()).append('\n'); }
        }
        for (String t : new ArrayList<>(createdTickets)) {
            try {
                revokeTicket(t);
                log.append("ticket ").append(t).append(' ').append(deleteTicket(t).statusCode()).append('\n');
            } catch (RuntimeException e) {
                log.append("ticket ").append(t).append(" ERR ").append(e.getMessage()).append('\n');
            }
        }
        for (String b : new ArrayList<>(createdBlueprints)) {
            try {
                revokeAll(b);
                log.append("blueprint ").append(b).append(' ').append(remove(b).statusCode()).append('\n');
            } catch (RuntimeException e) {
                log.append("blueprint ").append(b).append(" ERR ").append(e.getMessage()).append('\n');
            }
        }
        return log.toString();
    }
}
