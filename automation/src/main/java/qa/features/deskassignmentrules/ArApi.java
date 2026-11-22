package qa.features.deskassignmentrules;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.testng.SkipException;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Desk assignment API on NDC-Staging. One API sign-in per account per JVM (owner, A1, A2 and, for A-15, the agent
 * without the assignment permission); passwords come from docs/Credentials/TAVI Desk Credentials.csv by its "name"
 * column and are never logged. A 429 stops the run (every later call is skipped as inconclusive).
 * Every object created is written to the run ledger and removed by {@link #cleanupCreated()} (rules first).
 *
 * Shapes and traps learned 19 Nov 2026 (see features/deskassignmentrules/feature-map.md).
 */
public final class ArApi {
    public static final String HOST = "https://staging-desk.taviportal.com";
    public static final String TENANT = "a7a7a7a7-0000-0000-0000-000000000004";

    public static final Path RUN_DIR = Config.projectDir()
            .resolve("../executions/execu_" + LocalDate.now() + "_assignment-rules-regression").normalize();
    private static final Path LEDGER = RUN_DIR.resolve("ledger.md");
    private static final Map<String, ArApi> USERS = new HashMap<>();
    private static final Deque<String[]> CREATED = new ArrayDeque<>();
    private static volatile boolean limited;

    private final String label;
    private String access;
    private String refresh;
    private long at;

    private ArApi(String label) {
        this.label = label;
    }

    public static synchronized ArApi as(String label) {
        if (limited) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run");
        ArApi a = USERS.get(label);
        if (a == null) {
            a = new ArApi(label);
            a.login();
            USERS.put(label, a);
        }
        return a;
    }

    public static ArApi owner() {
        return as(OWNER_LABEL);
    }

    public static ArApi a1() {
        return as(A1_LABEL);
    }

    public static ArApi a2() {
        return as(A2_LABEL);
    }

    public String label() {
        return label;
    }

    // ---------------- transport ----------------

    /** Connect 30 s / read 90 s: without them a stalled TLS handshake on staging hangs the run for ever. */
    private static final io.restassured.config.RestAssuredConfig TIMEOUTS = io.restassured.config.RestAssuredConfig.config()
            .httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                    .setParam("http.connection.timeout", 30_000)
                    .setParam("http.socket.timeout", 90_000)
                    .setParam("http.connection-manager.timeout", 30_000L));

    private static RequestSpecification base() {
        return RestAssured.given().config(TIMEOUTS).baseUri(HOST + "/api/v1").contentType(ContentType.JSON).relaxedHTTPSValidation()
                .header("x-tenant-id", TENANT).header("x-app-key", "desk");
    }

    private static String[] credentials(String label) {
        try {
            Path f = Config.projectDir().resolve("../docs/Credentials/TAVI Desk Credentials.csv").normalize();
            List<String> lines = Files.readAllLines(f);
            for (String l : lines.subList(1, lines.size())) {
                String[] p = l.split(",", 3);
                if (p.length == 3 && p[0].trim().equals(label)) return new String[]{p[1].trim(), p[2].trim()};
            }
        } catch (Exception e) {
            throw new IllegalStateException("Cannot read the credentials file");
        }
        throw new IllegalStateException("No account labelled " + label);
    }

    private void login() {
        String[] c = credentials(label);
        Response r = base().body(Map.of("email", c[0], "password", c[1], "device_label", "qa-automation-assignment", "remember_me", true))
                .post("/iam/auth/login");
        if (r.statusCode() == 429) {
            limited = true;
            throw new SkipException("INCONCLUSIVE: sign-in rate-limited (429), stop");
        }
        if (r.statusCode() != 200) throw new IllegalStateException("Sign-in failed for " + label + ": HTTP " + r.statusCode());
        access = r.jsonPath().getString("data.access_token");
        refresh = r.jsonPath().getString("data.refresh_token");
        at = System.currentTimeMillis();
    }

    private synchronized String token() {
        if (System.currentTimeMillis() - at > 4 * 60_000) {
            Response r = base().body(Map.of("refresh_token", refresh)).post("/iam/auth/refresh");
            if (r.statusCode() == 200 && Boolean.TRUE.equals(r.jsonPath().get("success"))) {
                access = r.jsonPath().getString("data.access_token");
                String n = r.jsonPath().getString("data.refresh_token");
                if (n != null) refresh = n;
                at = System.currentTimeMillis();
            } else {
                login();
            }
        }
        return access;
    }

    private Response call(Supplier<Response> c) {
        if (limited) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run");
        for (int i = 0; i < 4; i++) {
            Response r;
            try {
                r = c.get();
            } catch (Exception e) { // connection reset / read timeout (thrown unchecked by RestAssured's Groovy layer)
                if (e instanceof SkipException se) throw se;
                sleep(5000L * (i + 1));
                continue;
            }
            if (r.statusCode() == 401 && i == 0) {
                synchronized (this) {
                    at = 0;
                }
                continue;
            }
            if (r.statusCode() == 429) {
                limited = true;
                throw new SkipException("INCONCLUSIVE: HTTP 429, stop");
            }
            if (r.statusCode() < 502 || r.statusCode() > 504) return r;
            sleep(3000L * (i + 1));
        }
        throw new SkipException("INCONCLUSIVE: staging kept failing (401/502-504/connection)");
    }

    private RequestSpecification req() {
        return base().header("Authorization", "Bearer " + token());
    }

    public Response get(String p) { return call(() -> req().get(p)); }
    public Response post(String p, Object b) { return call(() -> req().body(b).post(p)); }
    public Response put(String p, Object b) { return call(() -> req().body(b).put(p)); }
    public Response patch(String p, Object b) { return call(() -> req().body(b).patch(p)); }
    public Response delete(String p) { return call(() -> req().delete(p)); }

    /** 2xx or throw: a failed read must never look like "not there". */
    public static Response ok(Response r, String what) {
        if (r.statusCode() / 100 != 2) throw new IllegalStateException(what + " returned " + r.statusCode() + ": " + cut(r.asString(), 300));
        return r;
    }

    /** "400 CODE: message" of a refused call (for comments). */
    public static String err(Response r) {
        try {
            JsonPath j = safe(r);
            String code = j == null ? null : j.getString("error.code");
            String msg = j == null ? null : j.getString("error.message");
            return r.statusCode() + (code != null ? " " + code : "") + (msg != null ? ": " + cut(msg, 160) : "");
        } catch (Exception e) {
            return r.statusCode() + " " + cut(r.asString(), 120);
        }
    }

    private static JsonPath safe(Response r) {
        try {
            return r.jsonPath();
        } catch (Exception e) {
            return null;
        }
    }

    public static String cut(String s, int n) {
        return s == null ? "null" : s.length() <= n ? s : s.substring(0, n) + "…";
    }

    public static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static String uid() {
        return UUID.randomUUID().toString().substring(0, 5);
    }

    /** LinkedHashMap that, unlike Map.of, allows null values: m("k", v, "k2", v2...). */
    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> o = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) o.put((String) kv[i], kv[i + 1]);
        return o;
    }

    @SafeVarargs
    public static <T> List<T> l(T... v) {
        return new ArrayList<>(Arrays.asList(v));
    }

    // ---------------- ledger + cleanup ----------------

    public static synchronized void ledger(String line) {
        try {
            Files.createDirectories(RUN_DIR);
            Files.writeString(LEDGER, "- " + Instant.now().toString().substring(0, 19) + " " + line + "\n",
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }

    public static synchronized void track(String kind, String id, String name) {
        if (id == null) return;
        CREATED.push(new String[]{kind, id, name});
        ledger(kind + " \"" + cut(name, 60) + "\" " + id);
    }

    private static final List<String> ORDER = List.of("rule", "workflow", "ticket", "skill", "skillType", "sla", "contact", "account", "holiday");

    /** Takes the tracked objects out of the per-test list (shared class fixtures); delete them later with {@link #cleanup(List)}. */
    public static synchronized List<String[]> detach() {
        List<String[]> all = new ArrayList<>(CREATED);
        CREATED.clear();
        return all;
    }

    /** Removes everything tracked since the last cleanup (rules first so nothing re-assigns while tickets are deleted). */
    public static List<String> cleanupCreated() {
        return cleanup(detach());
    }

    /** Signs every API session of this run out (keeps the accounts under their session limit). */
    public static synchronized void signOutAll() {
        for (ArApi a : USERS.values()) {
            try {
                a.post("/iam/auth/logout", m("refresh_token", a.refresh));
            } catch (RuntimeException ignored) {
            }
        }
        USERS.clear();
    }

    public static List<String> cleanup(List<String[]> all) {
        if (all.isEmpty()) return List.of();
        ArApi o = owner();
        List<String> left = new ArrayList<>();
        for (String kind : ORDER)
            for (String[] c : all) {
                if (!kind.equals(c[0])) continue;
                int s;
                if ("rule".equals(kind)) {
                    Map<String, Object> g = o.findRule(c[1]);
                    if (g == null) continue;
                    s = o.delete("/desk/assignment-rules/" + c[1] + "?version=" + g.get("version")).statusCode();
                } else {
                    String path = switch (kind) {
                        case "workflow" -> "/workflow/rules/" + c[1];
                        case "ticket" -> "/modules/" + TICKETS + "/records/" + c[1];
                        case "skill" -> "/desk/skills/" + c[1] + "?department_id=" + DA;
                        case "skillType" -> "/desk/skill-types/" + c[1] + "?department_id=" + DA;
                        case "sla" -> "/desk/sla/policies/" + c[1];
                        case "contact" -> "/modules/" + CONTACTS + "/records/" + c[1];
                        case "account" -> "/modules/" + ACCOUNTS + "/records/" + c[1];
                        default -> "/desk/holiday-lists/" + c[1];
                    };
                    s = o.delete(path).statusCode();
                }
                if (s / 100 != 2 && s != 404) left.add(kind + " " + c[1] + " -> " + s);
            }
        for (String[] c : all) if (!ORDER.contains(c[0])) left.add("unknown kind " + c[0]);
        ledger("cleanup: " + (all.size() - left.size()) + "/" + all.size() + " removed" + (left.isEmpty() ? "" : " LEFT " + left));
        return left;
    }

    /** Deletes Recycle Bin items labelled "QA AR ..." / "#NNNN QA AR ..." (Desk, CRM and workflow). Returns how many. */
    public int purgeRecycleBin() {
        List<String> ids = new ArrayList<>();
        String cur = null;
        for (int page = 0; page < 200; page++) {
            Response r = ok(get("/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200" + (cur != null ? "&cursor=" + cur : "")), "recycle bin");
            List<Map<String, Object>> items = r.jsonPath().getList("data");
            if (items != null)
                for (Map<String, Object> x : items) {
                    String lab = String.valueOf(x.get("record_label"));
                    if (lab.startsWith(PREFIX) || lab.matches("^#\\d+ " + PREFIX + ".*")) ids.add((String) x.get("id"));
                }
            cur = r.jsonPath().getString("meta.next_cursor");
            if (cur == null) break;
        }
        for (int i = 0; i < ids.size(); i += 25)
            post("/audit/recycle-bin/delete", m("ids", ids.subList(i, Math.min(ids.size(), i + 25))));
        return ids.size();
    }

    // ---------------- records + tickets ----------------

    /** {kind,value} encoding of the records API. */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> enc(Object v) {
        if (v == null) return m("kind", "null");
        if (v instanceof Map<?, ?> mm && mm.containsKey("kind")) return (Map<String, Object>) mm;
        if (v instanceof Number) return m("kind", "number", "value", v);
        if (v instanceof Boolean) return m("kind", "boolean", "value", v);
        if (v instanceof List<?> li) {
            List<Object> items = new ArrayList<>();
            for (Object x : li) items.add(enc(x));
            return m("kind", "array", "items", items);
        }
        return m("kind", "string", "value", String.valueOf(v));
    }

    public static Map<String, Object> body(Map<String, Object> vals) {
        List<Map<String, Object>> data = new ArrayList<>();
        vals.forEach((k, v) -> data.add(m("field", k, "value", enc(v))));
        return m("data", data);
    }

    /** POST a record into a module; tracked under kind. */
    public String record(String module, String kind, String name, Map<String, Object> vals) {
        Response r = ok(post("/modules/" + module + "/records", body(vals)), "create " + kind);
        String id = r.jsonPath().getString("data.id");
        if (id == null) id = r.jsonPath().getString("data.record.id");
        track(kind, id, name);
        return id;
    }

    /** Ticket in dept, status Open, priority Medium; extra fields override (owner, priority, due_date, contact_id...). */
    public String ticket(String subject, String dept, Map<String, Object> extra) {
        Map<String, Object> v = m("subject", subject, "department", dept, "status", "Open", "priority", "Medium", "email", "qa.ar@example.com");
        if (extra != null) v.putAll(extra);
        return record(TICKETS, "ticket", subject, v);
    }

    public String ticket(String subject, String dept) {
        return ticket(subject, dept, null);
    }

    public Response patchTicket(String id, Map<String, Object> vals) {
        return patch("/modules/" + TICKETS + "/records/" + id, body(vals));
    }

    /** Flattened record fields: owner -> id string, arrays -> list of values. */
    @SuppressWarnings("unchecked")
    public Map<String, Object> fields(String id) {
        List<Map<String, Object>> data = ok(get("/modules/" + TICKETS + "/records/" + id), "read ticket " + id).jsonPath().getList("data.data");
        Map<String, Object> o = new LinkedHashMap<>();
        if (data == null) throw new IllegalStateException("ticket " + id + " came back without data");
        for (Map<String, Object> f : data) {
            Object v = f.get("value");
            Object out = null;
            if (v instanceof Map<?, ?> mv) {
                if ("array".equals(mv.get("kind"))) {
                    List<Object> li = new ArrayList<>();
                    for (Object i : (List<Object>) mv.get("items")) li.add(i instanceof Map<?, ?> im ? im.get("value") : i);
                    out = li;
                } else if (!"null".equals(mv.get("kind"))) {
                    out = mv.get("value");
                    if (out instanceof Map<?, ?> om) out = om.get("id") != null ? om.get("id") : om.get("value");
                }
            }
            o.put((String) f.get("field"), out);
        }
        return o;
    }

    public String owner(String ticket) {
        Object o = fields(ticket).get("owner");
        return o == null ? null : String.valueOf(o);
    }

    @SuppressWarnings("unchecked")
    public List<String> ticketSkills(String ticket) {
        Object v = fields(ticket).get("skills");
        return v instanceof List<?> li ? (List<String>) li : List.of();
    }

    public Map<String, Object> deskTicket(String id) {
        return ok(get("/desk/tickets/" + id), "desk ticket").jsonPath().getMap("data");
    }

    public boolean inBacklog(String id) {
        return Boolean.TRUE.equals(deskTicket(id).get("in_backlog"));
    }

    /** Ticket activity entries (newest first as the API returns them). */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> activity(String id) {
        JsonPath j = ok(get("/desk/tickets/" + id + "/activity"), "activity").jsonPath();
        Object d = j.get("data");
        if (d instanceof List<?> li) return (List<Map<String, Object>>) li;
        if (d instanceof Map<?, ?> mm) for (String k : List.of("items", "events", "activity"))
            if (mm.get(k) instanceof List<?> li) return (List<Map<String, Object>>) li;
        return List.of();
    }

    /** "ticket.auto_assigned {...summary}" lines, oldest first. */
    public List<String> autoAssigned(String id) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> e : activity(id))
            if (String.valueOf(e.get("action")).contains("auto_assigned"))
                out.add(0, e.get("action") + " " + toJson(e.get("summary")));
        return out;
    }

    public static String toJson(Object o) {
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(o);
        } catch (Exception e) {
            return String.valueOf(o);
        }
    }

    /** Polls the owner until set or the time is up; null = still unassigned. */
    public String waitOwner(String ticket, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (true) {
            String o = owner(ticket);
            if (o != null || System.currentTimeMillis() > end) return o;
            sleep(3000);
        }
    }

    public Response move(String ticket, String dept) {
        return post("/desk/tickets/" + ticket + "/move", m("department_id", dept));
    }

    public Response assign(String ticket, String ownerId, String teamId) {
        return post("/desk/tickets/" + ticket + "/assign", m("owner_id", ownerId, "team_id", teamId));
    }

    public Response close(String ticket) {
        return patchTicket(ticket, m("status", "Closed"));
    }

    public int workload(String user, String dept) {
        List<Map<String, Object>> d = ok(get("/desk/agents/" + user + "/workload"), "workload").jsonPath().getList("data.departments");
        if (d != null) for (Map<String, Object> x : d)
            if (dept.equals(x.get("department_id"))) return ((Number) x.getOrDefault("open_tickets", 0)).intValue();
        return 0;
    }

    // ---------------- rules ----------------

    public static Map<String, Object> cond(String field, String op, Object value) {
        return m("field_key", field, "operator", op, "value", value);
    }

    @SafeVarargs
    public static Map<String, Object> crit(String pattern, Map<String, Object>... conds) {
        return m("conditions", l(conds), "pattern", pattern);
    }

    public static Map<String, Object> contains(String v) {
        return crit(null, cond("subject", "contains", v));
    }

    public static Map<String, Object> startsWith(String v) {
        return crit("1", cond("subject", "starts_with", v));
    }

    public static Map<String, Object> allTickets() {
        return crit(null);
    }

    public static Map<String, Object> agent(String u) {
        return m("kind", "agent", "user_id", u, "team_id", null);
    }

    public static Map<String, Object> team(String t) {
        return m("kind", "team", "user_id", null, "team_id", t);
    }

    public static Map<String, Object> unassigned() {
        return m("kind", "unassigned", "user_id", null, "team_id", null);
    }

    public static Map<String, Object> directTarget(Map<String, Object> criteria, String comingTo, String moveTo, Map<String, Object> assign) {
        return m("criteria", criteria, "coming_to_department_id", comingTo, "move_to_department_id", moveTo, "assign", assign);
    }

    public static Map<String, Object> agentsPool(String... users) {
        return m("kind", "agents", "user_ids", l(users), "team_id", null, "excluded_user_ids", l());
    }

    public static Map<String, Object> teamPool(String t, String... excluded) {
        return m("kind", "team", "user_ids", l(), "team_id", t, "excluded_user_ids", l(excluded));
    }

    public static Map<String, Object> rrTarget(Map<String, Object> criteria, String method, Map<String, Object> pool) {
        return m("criteria", criteria, "method", method, "pool", pool);
    }

    public static Map<String, Object> directBody(String name, List<String> executeOn, List<Map<String, Object>> targets) {
        return m("type", "direct", "name", name, "description", "QA AR - safe to delete", "is_active", true, "execute_on", executeOn, "targets", targets);
    }

    public static Map<String, Object> rrBody(String name, String dept, List<String> executeOn, List<Map<String, Object>> targets) {
        return m("type", "round_robin", "department_id", dept, "name", name, "description", "QA AR - safe to delete", "is_active", true,
                "execute_on", executeOn, "targets", targets);
    }

    /** POST a rule; tracked when created. Returns the raw response (validation tests read the refusal). */
    public Response createRule(Map<String, Object> b) {
        Response r = post("/desk/assignment-rules", b);
        if (r.statusCode() / 100 == 2) {
            String id = r.jsonPath().getString("data.id");
            if (id == null) id = r.jsonPath().getString("data.rule.id");
            track("rule", id, String.valueOf(b.get("name")));
        }
        return r;
    }

    public String rule(Map<String, Object> b) {
        Response r = ok(createRule(b), "create rule " + b.get("name"));
        String id = r.jsonPath().getString("data.id");
        return id != null ? id : r.jsonPath().getString("data.rule.id");
    }

    /** Direct rule on create with one target. */
    public String direct(String name, Map<String, Object> target) {
        return rule(directBody(name, l("create"), l(target)));
    }

    /** Round robin rule on create, one target, pool of agents. */
    public String rr(String name, String dept, Map<String, Object> criteria, String method, String... agents) {
        return rule(rrBody(name, dept, l("create"), l(rrTarget(criteria, method, agentsPool(agents)))));
    }

    public List<Map<String, Object>> rules(String type, String dept) {
        Response r = ok(get("/desk/assignment-rules?type=" + type + (dept != null ? "&department_id=" + dept : "")), "list rules");
        List<Map<String, Object>> li = r.jsonPath().getList("data.rules");
        return li == null ? List.of() : li;
    }

    public Map<String, Object> findRule(String id) {
        for (Map<String, Object> x : rules("direct", null)) if (id.equals(x.get("id"))) return x;
        for (String d : List.of(DA, DB)) for (Map<String, Object> x : rules("round_robin", d)) if (id.equals(x.get("id"))) return x;
        return null;
    }

    public Map<String, Object> ruleOk(String id) {
        Map<String, Object> g = findRule(id);
        if (g == null) throw new IllegalStateException("rule " + id + " not listed");
        return g;
    }

    public Response putRule(String id, Map<String, Object> changes) {
        Map<String, Object> g = new LinkedHashMap<>(ruleOk(id));
        g.putAll(changes);
        return put("/desk/assignment-rules/" + id, g);
    }

    public Response setActive(String id, boolean on) {
        return put("/desk/assignment-rules/" + id + "/active", m("is_active", on, "version", ruleOk(id).get("version")));
    }

    public Response deleteRule(String id) {
        return delete("/desk/assignment-rules/" + id + "?version=" + ruleOk(id).get("version"));
    }

    /** Saves a new order: ids in the order wanted (others keep their place after them). */
    public Response order(String type, String dept, List<String> ids) {
        List<Map<String, Object>> cur = rules(type, dept);
        List<Map<String, Object>> out = new ArrayList<>();
        for (String id : ids) for (Map<String, Object> x : cur) if (id.equals(x.get("id"))) out.add(m("id", id, "version", x.get("version")));
        for (Map<String, Object> x : cur) if (!ids.contains(x.get("id"))) out.add(m("id", x.get("id"), "version", x.get("version")));
        return put("/desk/assignment-rules/order", m("type", type, "department_id", dept, "rules", out));
    }

    /** Swaps two rules in the current order. */
    public Response swap(String type, String dept, String a, String b) {
        List<Map<String, Object>> cur = rules(type, dept);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> x : cur) out.add(m("id", x.get("id"), "version", x.get("version")));
        int ia = -1, ib = -1;
        for (int i = 0; i < out.size(); i++) {
            if (a.equals(out.get(i).get("id"))) ia = i;
            if (b.equals(out.get(i).get("id"))) ib = i;
        }
        Map<String, Object> t = out.get(ia);
        out.set(ia, out.get(ib));
        out.set(ib, t);
        return put("/desk/assignment-rules/order", m("type", type, "department_id", dept, "rules", out));
    }

    public List<Map<String, Object>> criteriaFields() {
        return ok(get("/desk/assignment-rules/criteria-fields"), "criteria fields").jsonPath().getList("data.fields");
    }

    // ---------------- switches, preferences, team assignment, departments ----------------

    public Map<String, Object> switches() {
        return new LinkedHashMap<>(ok(get("/desk/assignment/notification-settings"), "switches").jsonPath().getMap("data"));
    }

    public void setSwitches(Map<String, Object> changes) {
        Map<String, Object> s = switches();
        s.putAll(changes);
        ok(put("/desk/assignment/notification-settings", s), "save switches");
    }

    public Map<String, Object> prefs(String dept) {
        return new LinkedHashMap<>(ok(get("/desk/departments/" + dept + "/round-robin-preferences"), "rr prefs").jsonPath().getMap("data"));
    }

    public Response putPrefs(String dept, Map<String, Object> full) {
        return put("/desk/departments/" + dept + "/round-robin-preferences", full);
    }

    /** Clean round-robin profile: offline agents ON (presence-independent), no thresholds, no backlog runs, immediate. */
    public static Map<String, Object> cleanPrefs() {
        return m("assign_to_offline_agents", true, "department_threshold_enabled", false, "department_threshold", 40,
                "agent_threshold_enabled", false, "agent_thresholds", l(), "assign_backlogs", false, "backlog_limit", 10,
                "backlog_order", "created_time", "assign_on_closure", false, "incoming_mode", "immediate");
    }

    /** Sets the department's preferences to the clean profile plus the given changes (independent of earlier tests). */
    public void setPrefs(String dept, Map<String, Object> changes) {
        Map<String, Object> p = prefs(dept);
        p.putAll(cleanPrefs());
        if (changes != null) p.putAll(changes);
        ok(putPrefs(dept, p), "save rr prefs " + changes);
    }

    /** Changes only the given keys, keeping the department's current preferences. */
    public void changePrefs(String dept, Map<String, Object> changes) {
        Map<String, Object> p = prefs(dept);
        p.putAll(changes);
        ok(putPrefs(dept, p), "change rr prefs " + changes);
    }

    public static Map<String, Object> threshold(String user, int t) {
        return m("user_id", user, "threshold", t);
    }

    public Map<String, Object> teamAssignment(String dept) {
        return new LinkedHashMap<>(ok(get("/desk/departments/" + dept + "/team-assignment"), "team assignment").jsonPath().getMap("data"));
    }

    public void setTeamAssignment(String dept, boolean on) {
        Map<String, Object> t = teamAssignment(dept);
        t.put("enabled", on);
        ok(put("/desk/departments/" + dept + "/team-assignment", t), "save team assignment");
    }

    public Map<String, Object> department(String dept) {
        return new LinkedHashMap<>(ok(get("/desk/departments/" + dept), "department").jsonPath().getMap("data"));
    }

    @SuppressWarnings("unchecked")
    public List<String> members(String dept) {
        return new ArrayList<>((List<String>) department(dept).get("agent_user_ids"));
    }

    /** Department membership: PATCH with the full body (PUT gives 405). */
    public void setMembers(String dept, List<String> users) {
        Map<String, Object> d = department(dept);
        d.put("agent_user_ids", users);
        ok(patch("/desk/departments/" + dept, d), "save department members");
    }

    public void addMember(String dept, String user) {
        List<String> u = members(dept);
        if (!u.contains(user)) {
            u.add(user);
            setMembers(dept, u);
        }
    }

    public void removeMember(String dept, String user) {
        List<String> u = members(dept);
        if (u.remove(user)) setMembers(dept, u);
    }

    // ---------------- presence + notifications (called as the agent) ----------------

    public Response setChannels(boolean email, boolean chat, boolean phone) {
        return put("/desk/agents/me/presence", m("channels", m("email", email, "chat", chat, "phone", phone)));
    }

    public Response heartbeat() {
        return post("/desk/agents/me/presence/heartbeat", m("active", true));
    }

    /** user id -> "on"/"off" plus "+mail" when the email channel is on. */
    public Map<String, String> presence(String... users) {
        List<Map<String, Object>> a = ok(post("/desk/agents/presence/query", m("user_ids", l(users))), "presence").jsonPath().getList("data.agents");
        Map<String, String> o = new LinkedHashMap<>();
        for (Map<String, Object> x : a) {
            Map<?, ?> p = (Map<?, ?>) x.get("presence");
            Map<?, ?> ch = p == null ? null : (Map<?, ?>) p.get("channels");
            o.put((String) x.get("user_id"), (p != null && Boolean.TRUE.equals(p.get("online")) ? "on" : "off")
                    + (ch != null && Boolean.TRUE.equals(ch.get("email")) ? "+mail" : ""));
        }
        return o;
    }

    /** Notifications of the signed-in user whose JSON mentions the needle (a ticket id). */
    @SuppressWarnings("unchecked")
    public List<String> notificationsAbout(String needle) {
        Response r = ok(get("/notifications?limit=100"), "notifications");
        Object d = r.jsonPath().get("data");
        List<Map<String, Object>> li = null;
        if (d instanceof List<?> dl) li = (List<Map<String, Object>>) dl;
        else if (d instanceof Map<?, ?> dm) for (String k : List.of("items", "notifications", "data", "results"))
            if (dm.get(k) instanceof List<?> dl) li = (List<Map<String, Object>>) dl;
        List<String> out = new ArrayList<>();
        if (li != null) for (Map<String, Object> n : li) {
            String js = toJson(n);
            if (js.contains(needle)) out.add(n.getOrDefault("type", n.getOrDefault("kind", "")) + " | " + cut(String.valueOf(n.getOrDefault("title", "")), 70));
        }
        return out;
    }

    // ---------------- skills ----------------

    public String skillType(String dept, String name) {
        Response r = ok(post("/desk/skill-types", m("name", name, "department_id", dept)), "create skill type");
        String id = r.jsonPath().getString("data.id");
        if (id == null) id = r.jsonPath().getString("data.type.id");
        track("skillType", id, name);
        return id;
    }

    public Response createSkill(String dept, String name, String type, boolean active, Map<String, Object> criteria) {
        Response r = post("/desk/skills?department_id=" + dept, m("name", name, "type_id", type, "description", "QA", "is_active", active, "criteria", criteria));
        if (r.statusCode() / 100 == 2) {
            String id = r.jsonPath().getString("data.id");
            if (id == null) id = r.jsonPath().getString("data.skill.id");
            track("skill", id, name);
        }
        return r;
    }

    public String skill(String dept, String name, String type, boolean active, Map<String, Object> criteria) {
        Response r = ok(createSkill(dept, name, type, active, criteria), "create skill " + name);
        String id = r.jsonPath().getString("data.id");
        return id != null ? id : r.jsonPath().getString("data.skill.id");
    }

    public List<Map<String, Object>> skills(String dept) {
        List<Map<String, Object>> s = ok(get("/desk/skills?department_id=" + dept), "list skills").jsonPath().getList("data.skills");
        return s == null ? List.of() : s;
    }

    public void skillAgents(String skill, String... users) {
        ok(put("/desk/skills/" + skill + "/agents", m("user_ids", l(users))), "skill agents");
    }

    public Map<String, Object> skillPrefs(String dept) {
        return new LinkedHashMap<>(ok(get("/desk/skill-preferences?department_id=" + dept), "skill prefs").jsonPath().getMap("data"));
    }

    public void setSkillPrefs(String dept, Map<String, Object> p) {
        ok(put("/desk/skill-preferences?department_id=" + dept, p), "save skill prefs");
    }

    public Response skillOrder(String dept, List<String> ids) {
        return put("/desk/skills/order?department_id=" + dept, m("skill_ids", ids));
    }

    // ---------------- workflows, SLA, holiday lists ----------------

    public static Map<String, Object> subjectStarts(String v) {
        return m("kind", "StringMatch", "field", "subject", "operator", "StartsWith", "stringValue", v, "caseInsensitive", false);
    }

    /** Workflow owner action: ownerTargetKind 'SpecificUser'. */
    public static List<Map<String, Object>> setOwner(String user) {
        return l(m("type", "OwnerAssignment", "order", 0, "delaySeconds", 0, "ownerTargetKind", "SpecificUser", "ownerValue", user));
    }

    public String workflow(String name, Map<String, Object> criteria, List<Map<String, Object>> actions) {
        Response r = ok(post("/workflow/rules", m("moduleId", TICKETS, "layoutId", "", "name", name, "description", "QA AR - safe to delete",
                "mode", "Recurring", "isActive", true, "trigger", m("kind", "RecordCreated"), "criteria", criteria, "actions", actions)), "create workflow");
        String id = r.jsonPath().getString("data.id");
        track("workflow", id, name);
        return id;
    }

    /** SLA policy in dept for subjects starting with marker; responseMinutes and escalation level 1 at breach when escalate. */
    public String slaPolicy(String dept, String name, String marker, int responseMinutes, boolean escalate) {
        List<Object> esc = escalate ? l(m("level", 1, "timing", "at", "offset", null, "recipients", l(m("kind", "agent", "id", A1)), "template_ref", null,
                "actions", m("assign_owner", null, "assign_team", null, "set_priority", null))) : l();
        Map<String, Object> target = m("name", "t", "criteria", startsWith(marker), "response", m("value", responseMinutes, "unit", "minutes"),
                "resolution", m("value", 600, "unit", "minutes"), "calendar_mode", "calendar", "business_hours_id", null, "first_response_only", true,
                "escalate_on_business_hours", false, "escalations", m("response", esc, "resolution", l()));
        Response r = ok(post("/desk/sla/policies", m("department_id", dept, "name", name, "description", "QA AR", "is_active", true,
                "triggers", m("create", true, "update", false, "field_update", null, "customer_reply", false, "agent_response", false, "private_thread", null, "comment", null),
                "execute_only_with_account", false, "resolution_from_created", true, "targets", l(target))), "create SLA policy");
        String id = r.jsonPath().getString("data.id");
        track("sla", id, name);
        return id;
    }

    public boolean holidayListExists(String id) {
        Response r = get("/desk/holiday-lists");
        return r.statusCode() == 200 && r.asString().contains(id);
    }
}
