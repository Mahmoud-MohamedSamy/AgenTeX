package qa.features.deskautomationorder;

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
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

/**
 * Desk API on NDC-Staging for the automation-order run. One sign-in per account per JVM (a second sign-in ends the first).
 * Passwords come from docs/Credentials/TAVI Desk Credentials.csv by its "name" column and are never logged.
 * A 429 stops the run. Every object created is written to the run ledger and removed by {@link #cleanup()}.
 */
public final class AoApi {
    public static final String HOST = "https://staging-desk.taviportal.com";
    public static final String TENANT = "a7a7a7a7-0000-0000-0000-000000000004";
    public static final String TICKETS = "88e8ea44-1658-4df3-9930-d0902b91073d";
    public static final String DEPT_A = "93949fbd-f9df-4e2e-ae45-00b8dc38385b";
    public static final String DEPT_B = "4853562a-0b4d-45cb-ba34-9f2118fcd32c";
    public static final String OWNER_ID = "97be04b6-0a08-4883-aa51-e1650b11cab7";
    public static final String A1 = "876ce871-2b02-4854-89a7-68050391c62b";
    public static final String A2 = "d23fb4e0-248d-41f6-af60-d28885a7007e";
    public static final String A3 = "5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4";
    public static final String ADMIN = "mahmoud.mahamed1515";
    public static final String AGENT = "Customer Experience Specialists 2";
    private static final Path LEDGER = Config.projectDir().resolve("../executions/execu_2026-11-08_desk-automation-order/ledger.md").normalize();

    private static final Map<String, AoApi> USERS = new HashMap<>();
    private static volatile boolean limited;
    private static final Deque<String[]> CREATED = new ArrayDeque<>();

    private final String label;
    private String access;
    private String refresh;
    private long at;
    private Supplier<String> external;

    private AoApi(String label) {
        this.label = label;
    }

    public static synchronized AoApi as(String label) {
        if (limited) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run");
        return USERS.computeIfAbsent(label, l -> {
            AoApi a = new AoApi(l);
            a.login();
            return a;
        });
    }

    public static AoApi admin() {
        return as(ADMIN);
    }

    /** A client that reads its token from elsewhere, such as the signed-in browser, so no second sign-in happens. */
    public static AoApi withToken(Supplier<String> token) {
        AoApi a = new AoApi("browser");
        a.external = token;
        return a;
    }

    private static RequestSpecification base() {
        return RestAssured.given().baseUri(HOST + "/api/v1").contentType(ContentType.JSON).relaxedHTTPSValidation()
                .header("x-tenant-id", TENANT).header("x-app-key", "desk")
                .config(RestAssured.config().httpClient(io.restassured.config.HttpClientConfig.httpClientConfig()
                        .setParam("http.connection.timeout", 30000).setParam("http.socket.timeout", 90000)));
    }

    private static String[] credentials(String label) {
        try {
            Path f = Config.projectDir().resolve("../docs/Credentials/TAVI Desk Credentials.csv").normalize();
            for (String l : Files.readAllLines(f).subList(1, Files.readAllLines(f).size())) {
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
        Response r = base().body(Map.of("email", c[0], "password", c[1], "device_label", "qa-automation", "remember_me", true)).post("/iam/auth/login");
        if (r.statusCode() == 429) {
            limited = true;
            throw new SkipException("INCONCLUSIVE: sign-in rate-limited (429), stop");
        }
        if (r.statusCode() != 200) throw new IllegalStateException("Sign-in failed for " + label + ": " + r.statusCode());
        access = r.jsonPath().getString("data.access_token");
        refresh = r.jsonPath().getString("data.refresh_token");
        at = System.currentTimeMillis();
    }

    private synchronized String token() {
        if (external != null) return external.get();
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
        RuntimeException last = null;
        for (int i = 0; i < 4; i++) {
            try {
                Response r = c.get();
                if (r.statusCode() == 401 && external == null) {
                    at = 0;
                    r = c.get();
                }
                if (r.statusCode() == 429) {
                    limited = true;
                    throw new SkipException("INCONCLUSIVE: HTTP 429, stop");
                }
                if (r.statusCode() < 502 || r.statusCode() > 504) return r;
            } catch (SkipException e) {
                throw e;
            } catch (RuntimeException e) {
                last = e;
            }
            sleep(3000L * (i + 1));
        }
        if (last != null) throw new SkipException("INCONCLUSIVE: network kept failing: " + last.getMessage());
        throw new SkipException("INCONCLUSIVE: staging kept answering 502-504");
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

    // ---------------- ledger + cleanup ----------------

    public static synchronized void track(String kind, String id, String name) {
        CREATED.push(new String[]{kind, id});
        try {
            Files.createDirectories(LEDGER.getParent());
            Files.writeString(LEDGER, "- " + Instant.now().toString().substring(0, 16) + " " + kind + " " + name + " " + id + "\n",
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
        }
    }

    /** Removes everything this JVM created, newest first. Returns what could not be removed. */
    public List<String> cleanup() {
        List<String> left = new ArrayList<>();
        while (true) {
            String[] c;
            synchronized (AoApi.class) {
                c = CREATED.poll();
            }
            if (c == null) return left;
            String path = switch (c[0]) {
                case "ticket" -> "/modules/" + TICKETS + "/records/" + c[1];
                case "policy" -> "/desk/sla/policies/" + c[1];
                case "plan" -> "/desk/sla/support-plans/" + c[1];
                case "bh" -> "/iam/tenant/business-hours/profiles/" + c[1];
                default -> "/" + c[0] + "/" + c[1];
            };
            int s = delete(path).statusCode();
            if (s / 100 != 2 && s != 404) left.add(c[0] + " " + c[1] + " -> " + s);
        }
    }

    // ---------------- builders ----------------

    public static Map<String, Object> triggers(String... on) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("create", false);
        t.put("update", false);
        t.put("field_update", null);
        t.put("customer_reply", false);
        t.put("agent_response", false);
        t.put("private_thread", null);
        t.put("comment", null);
        for (String k : on) t.put(k, true);
        return t;
    }

    /** One target for high priority by default; response/resolution as {value, unit} or null. */
    public static Map<String, Object> target(String name, Object conditions, Map<String, Object> response, Map<String, Object> resolution, Map<String, Object> escalations) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("name", name);
        Map<String, Object> criteria = new LinkedHashMap<>();
        criteria.put("conditions", conditions);
        criteria.put("pattern", null);
        t.put("criteria", criteria);
        t.put("response", response);
        t.put("resolution", resolution);
        t.put("calendar_mode", "calendar");
        t.put("business_hours_id", null);
        t.put("first_response_only", true);
        t.put("escalate_on_business_hours", false);
        t.put("escalations", escalations == null ? Map.of("response", List.of(), "resolution", List.of()) : escalations);
        return t;
    }

    public static Map<String, Object> t(int value, String unit) {
        return Map.of("value", value, "unit", unit);
    }

    public static List<Map<String, Object>> priorityIs(String p) {
        return List.of(Map.of("field_key", "priority", "operator", "equals", "value", List.of(p)));
    }

    public static Map<String, Object> policy(String name, String dept, Map<String, Object> triggers, List<?> targets) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("department_id", dept);
        b.put("name", name);
        b.put("description", null);
        b.put("is_active", true);
        b.put("triggers", triggers);
        b.put("execute_only_with_account", false);
        b.put("resolution_from_created", false);
        b.put("targets", targets);
        return b;
    }

    public String createPolicy(Map<String, Object> body) {
        Response r = ok(post("/desk/sla/policies", body), "create policy");
        String id = r.jsonPath().getString("data.id");
        track("policy", id, String.valueOf(body.get("name")));
        return id;
    }

    public String ticket(String subject, String dept, String priority) {
        return ticket(subject, dept, priority, Map.of());
    }

    public String ticket(String subject, String dept, String priority, Map<String, String> extra) {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(field("subject", subject));
        data.add(field("department", dept));
        data.add(field("status", "Open"));
        if (priority != null) data.add(field("priority", priority));
        extra.forEach((k, v) -> data.add(field(k, v)));
        Response r = ok(post("/modules/" + TICKETS + "/records", Map.of("data", data)), "create ticket");
        String id = r.jsonPath().getString("data.id");
        track("ticket", id, subject);
        return id;
    }

    public Response setField(String ticket, String f, String v) {
        return patch("/modules/" + TICKETS + "/records/" + ticket, Map.of("data", List.of(field(f, v))));
    }

    private static Map<String, Object> field(String f, String v) {
        Map<String, Object> value = new LinkedHashMap<>();
        value.put("kind", "string");
        value.put("value", v);
        return Map.of("field", f, "value", value);
    }

    public static String uid() {
        return UUID.randomUUID().toString().substring(0, 6);
    }

    /** Ticket's SLA, waiting until it settles, or null state if none arrives in time. */
    public JsonPath sla(String ticket, int waitSeconds) {
        long end = System.currentTimeMillis() + waitSeconds * 1000L;
        JsonPath j;
        do {
            j = ok(get("/desk/tickets/" + ticket + "/sla"), "ticket SLA").jsonPath();
            if ("applied".equals(j.getString("data.state"))) return j;
            sleep(2500);
        } while (System.currentTimeMillis() < end);
        return j;
    }
}
