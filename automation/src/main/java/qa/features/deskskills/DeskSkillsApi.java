package qa.features.deskskills;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
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
 * Desk Skills API on NDC-Staging (tenant ...0004). One sign-in per account per JVM; passwords come from
 * docs/Credentials/TAVI Desk Credentials.csv by its "name" column and are never logged. A 429 stops the run.
 * Every object created is written to the run ledger and removed by {@link #cleanup()} (newest first).
 *
 * Shapes learned 12 Nov 2026 (see feature-map.md):
 * skills live per department (?department_id=), ticket skills are the multi-select record field "skills" holding skill NAMES.
 */
public final class DeskSkillsApi {
    public static final String HOST = "https://staging-desk.taviportal.com";
    public static final String TENANT = "a7a7a7a7-0000-0000-0000-000000000004";
    public static final String TICKETS = "88e8ea44-1658-4df3-9930-d0902b91073d";
    /** Agents on NDC-Staging: A1 = Test User 1, A2 = Mahmoud Samy. */
    public static final String A1 = "876ce871-2b02-4854-89a7-68050391c62b";
    public static final String A2 = "d23fb4e0-248d-41f6-af60-d28885a7007e";
    public static final String A3 = "5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4";
    /** Owner account: reads every ticket (an admin loses read access once a ticket is assigned away). */
    public static final String OWNER = "ndc-staging-owner";
    /** Desk Agent profile without desk:assignment:manage. */
    public static final String AGENT = "Customer Experience Specialists 2";
    /** An existing department with active skills, used to prove cross-department checks (QA AS6 Dept A, skill "QA AS6 sk1"). */
    public static final String OTHER_DEPT_SKILL = "QA AS6 sk1";
    /** QA department that receives the deleted tickets of a removed test department (QA AO Dept B). */
    public static final String HOLDING_DEPT = "4853562a-0b4d-45cb-ba34-9f2118fcd32c";

    private static final Path LEDGER = Config.projectDir()
            .resolve("../executions/execu_2026-11-12_desk-skills-parity/ledger-automation.md").normalize();
    private static final Map<String, DeskSkillsApi> USERS = new HashMap<>();
    private static final Deque<String[]> CREATED = new ArrayDeque<>();
    private static volatile boolean limited;

    private final String label;
    private String access;
    private String refresh;
    private long at;

    private DeskSkillsApi(String label) {
        this.label = label;
    }

    public static synchronized DeskSkillsApi as(String label) {
        if (limited) throw new SkipException("INCONCLUSIVE: HTTP 429 earlier in this run");
        return USERS.computeIfAbsent(label, l -> {
            DeskSkillsApi a = new DeskSkillsApi(l);
            a.login();
            return a;
        });
    }

    public static DeskSkillsApi owner() {
        return as(OWNER);
    }

    private static RequestSpecification base() {
        return RestAssured.given().baseUri(HOST + "/api/v1").contentType(ContentType.JSON).relaxedHTTPSValidation()
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
        Response r = base().body(Map.of("email", c[0], "password", c[1], "device_label", "qa-automation-skills", "remember_me", true))
                .post("/iam/auth/login");
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
            Response r = c.get();
            if (r.statusCode() == 401 && i == 0) {
                at = 0;
                continue;
            }
            if (r.statusCode() == 429) {
                limited = true;
                throw new SkipException("INCONCLUSIVE: HTTP 429, stop");
            }
            if (r.statusCode() < 502 || r.statusCode() > 504) return r;
            sleep(3000L * (i + 1));
        }
        throw new SkipException("INCONCLUSIVE: staging kept answering 401/502-504");
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

    public static String uid() {
        return UUID.randomUUID().toString().substring(0, 5);
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
            synchronized (DeskSkillsApi.class) {
                c = CREATED.poll();
            }
            if (c == null) return left;
            if ("department".equals(c[0])) {
                // a department keeps its agents and (recycle-bin) tickets: empty it, then move what is left to the QA holding department
                Response g = get("/desk/departments/" + c[1]);
                if (g.statusCode() == 200)
                    patch("/desk/departments/" + c[1], Map.of("name", g.jsonPath().getString("data.name"), "agent_user_ids", List.of()));
                int s = delete("/desk/departments/" + c[1] + "?transfer_to_department_id=" + HOLDING_DEPT).statusCode();
                if (s / 100 != 2 && s != 404) left.add("department " + c[1] + " -> " + s);
                continue;
            }
            String path = switch (c[0]) {
                case "ticket" -> "/modules/" + TICKETS + "/records/" + c[1];
                case "skill" -> "/desk/skills/" + c[1];
                case "skillType" -> "/desk/skill-types/" + c[1];
                case "rule" -> "/desk/assignment-rules/" + c[1];
                case "department" -> "/desk/departments/" + c[1];
                default -> "/" + c[0] + "/" + c[1];
            };
            int s = delete(path).statusCode();
            if (s / 100 != 2 && s != 404) left.add(c[0] + " " + c[1] + " -> " + s);
        }
    }

    // ---------------- domain helpers ----------------

    /** New QA department with the given agents. */
    public String department(String name, String... agents) {
        String id = ok(post("/desk/departments", Map.of("name", name)), "create department").jsonPath().getString("data.id");
        track("department", id, name);
        ok(patch("/desk/departments/" + id, Map.of("name", name, "agent_user_ids", List.of(agents))), "add agents");
        return id;
    }

    public String skillType(String dept, String name) {
        String id = ok(post("/desk/skill-types", Map.of("department_id", dept, "name", name)), "create skill type").jsonPath().getString("data.id");
        track("skillType", id, name);
        return id;
    }

    public static Map<String, Object> subjectContains(String text) {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("conditions", List.of(Map.of("field_key", "subject", "operator", "contains", "value", text)));
        c.put("pattern", null);
        return c;
    }

    /** POST a skill; returns the raw response and tracks it when created. */
    public Response createSkill(String dept, String name, String type, boolean active, Map<String, Object> criteria) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("name", name);
        b.put("type_id", type);
        b.put("is_active", active);
        b.put("description", null);
        b.put("criteria", criteria);
        Response r = post("/desk/skills?department_id=" + dept, b);
        if (r.statusCode() == 201) track("skill", r.jsonPath().getString("data.id"), name);
        return r;
    }

    public String skill(String dept, String name, String type, boolean active, Map<String, Object> criteria) {
        return ok(createSkill(dept, name, type, active, criteria), "create skill " + name).jsonPath().getString("data.id");
    }

    public List<Map<String, Object>> skills(String dept) {
        return ok(get("/desk/skills?department_id=" + dept), "list skills").jsonPath().getList("data.skills");
    }

    public Map<String, Object> skillById(String dept, String id) {
        return skills(dept).stream().filter(s -> id.equals(s.get("id"))).findFirst()
                .orElseThrow(() -> new IllegalStateException("skill " + id + " not listed"));
    }

    private static Map<String, Object> str(String f, String v) {
        return Map.of("field", f, "value", Map.of("kind", "string", "value", v));
    }

    private static Map<String, Object> skillsValue(List<String> names) {
        List<Map<String, Object>> items = new ArrayList<>();
        for (String n : names) items.add(Map.of("kind", "string", "value", n));
        return Map.of("field", "skills", "value", Map.of("kind", "array", "items", items));
    }

    /** Ticket in dept; owner left empty so assignment rules can route it; skills null = leave the field out. */
    public String ticket(String dept, String subject, List<String> skills) {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(str("subject", subject));
        data.add(str("department", dept));
        data.add(str("status", "Open"));
        data.add(Map.of("field", "owner", "value", Map.of("kind", "null")));
        if (skills != null) data.add(skillsValue(skills));
        String id = ok(post("/modules/" + TICKETS + "/records", Map.of("data", data)), "create ticket").jsonPath().getString("data.id");
        track("ticket", id, subject);
        return id;
    }

    public Response setTicketSkills(String ticket, List<String> names) {
        return patch("/modules/" + TICKETS + "/records/" + ticket, Map.of("data", List.of(skillsValue(names))));
    }

    @SuppressWarnings("unchecked")
    private Object fieldValue(String ticket, String field) {
        List<Map<String, Object>> data = ok(get("/modules/" + TICKETS + "/records/" + ticket), "read ticket").jsonPath().getList("data.data");
        for (Map<String, Object> f : data)
            if (field.equals(f.get("field"))) return f.get("value");
        return null;
    }

    @SuppressWarnings("unchecked")
    public List<String> ticketSkills(String ticket) {
        Object v = fieldValue(ticket, "skills");
        List<String> out = new ArrayList<>();
        if (v instanceof Map<?, ?> m && m.get("items") instanceof List<?> items)
            for (Object i : items) out.add(String.valueOf(((Map<String, Object>) i).get("value")));
        return out;
    }

    public String ticketOwner(String ticket) {
        Object v = fieldValue(ticket, "owner");
        return v instanceof Map<?, ?> m ? (String) m.get("value") : null;
    }

    /** Skill-based round robin rule in dept: create + update, subject contains marker, pool = agents. */
    public String skillRule(String dept, String name, String marker, String... agents) {
        Map<String, Object> pool = new LinkedHashMap<>();
        pool.put("kind", "agents");
        pool.put("user_ids", List.of(agents));
        pool.put("team_id", null);
        pool.put("excluded_user_ids", List.of());
        Map<String, Object> target = new LinkedHashMap<>();
        target.put("criteria", subjectContains(marker));
        target.put("method", "skill");
        target.put("pool", pool);
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("type", "round_robin");
        b.put("department_id", dept);
        b.put("name", name);
        b.put("description", null);
        b.put("is_active", true);
        b.put("execute_on", List.of("create", "update"));
        b.put("targets", List.of(target));
        String id = ok(post("/desk/assignment-rules", b), "create skill rule").jsonPath().getString("data.id");
        track("rule", id, name);
        return id;
    }

    /** Lets round robin pick offline agents in this QA department (keeps the test independent of presence). */
    public void allowOfflineAgents(String dept) {
        Map<String, Object> p = new LinkedHashMap<>(ok(get("/desk/departments/" + dept + "/round-robin-preferences"), "rr prefs")
                .jsonPath().getMap("data"));
        p.put("assign_to_offline_agents", true);
        ok(put("/desk/departments/" + dept + "/round-robin-preferences", p), "save rr prefs");
    }

    public void preferences(String dept, boolean autoAdd, String placement) {
        ok(put("/desk/skill-preferences?department_id=" + dept, Map.of("auto_add", autoAdd, "placement", placement)), "skill preferences");
    }
}
