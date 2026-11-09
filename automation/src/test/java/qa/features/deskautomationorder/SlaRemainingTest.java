package qa.features.deskautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** SLA rows still open after the first pass: scopes, business hours, recipients, contracts, history, audit. QA AO data only. */
public class SlaRemainingTest {
    private AoApi api;
    private static final String P = "/desk/sla/policies", BH = "/iam/tenant/business-hours/profiles";
    private static final String CONTACTS = "43004ce2-577f-4eda-b00a-0750fe40c3d4", ACCOUNTS = "784400e1-4a2a-42c2-b4f3-7ca56e79828a", CONTRACTS = "0924eb24-e42a-4eab-8efd-e3428f19e882";
    private static final String GMAIL = "mahmoud.mmohamedsamy@gmail.com";

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = AoApi.admin();
    }

    @AfterMethod(alwaysRun = true)
    public void clean() {
        List<String> left = api.cleanup();
        if (!left.isEmpty()) System.out.println("[CLEANUP] left: " + left);
    }

    private static String cut(String s) {
        return s.length() > 700 ? s.substring(0, 700) : s;
    }

    private static List<Map<String, Object>> tag(String t) {
        return List.of(Map.of("field_key", "subject", "operator", "contains", "value", t));
    }

    private static Map<String, Object> level(String timing, Integer minutes, List<Map<String, Object>> recipients) {
        Map<String, Object> l = new LinkedHashMap<>();
        l.put("timing", timing);
        l.put("offset", minutes == null ? null : t(minutes, "minutes"));
        l.put("recipients", recipients);
        l.put("template_ref", null);
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("assign_owner", null);
        a.put("assign_team", null);
        a.put("set_priority", null);
        l.put("actions", a);
        return l;
    }

    private static Map<String, Object> esc(List<Map<String, Object>> response) {
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("response", response);
        e.put("resolution", List.of());
        return e;
    }

    /** Sunday to Thursday 09:00-17:00 Cairo, a QA set. */
    private String hours(String name) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("name", "QA AO BH " + name);
        b.put("preset", "custom");
        b.put("days_active", List.of("sun", "mon", "tue", "wed", "thu"));
        b.put("timing_mode", "same");
        b.put("hours", Map.of("open", "09:00", "close", "17:00"));
        b.put("hours_per_day", null);
        b.put("week_starts_on", "sun");
        b.put("time_zone", "Africa/Cairo");
        Response r = api.post(BH, b);
        System.out.println("[RECORD] create hours " + r.statusCode() + " " + cut(r.asString()));
        String id = ok(r, "create hours").jsonPath().getString("data.id");
        track("bh", id, "QA AO BH " + name);
        return id;
    }

    private Map<String, Object> businessTarget(String tag, String hoursId, int respMinutes, Map<String, Object> e) {
        Map<String, Object> tg = target("t", tag(tag), t(respMinutes, "minutes"), t(5, "hours"), e);
        tg.put("calendar_mode", "business");
        tg.put("business_hours_id", hoursId);
        return tg;
    }

    private static ZonedDateTime nextOpen(ZonedDateTime now) {
        ZonedDateTime c = now;
        for (int i = 0; i < 8; i++) {
            DayOfWeek d = c.getDayOfWeek();
            boolean open = d != DayOfWeek.FRIDAY && d != DayOfWeek.SATURDAY;
            if (open && c.toLocalTime().isBefore(LocalTime.of(17, 0)))
                return c.toLocalTime().isBefore(LocalTime.of(9, 0)) ? c.with(LocalTime.of(9, 0)) : c;
            c = c.plusDays(1).with(LocalTime.of(0, 0));
        }
        throw new IllegalStateException("no open day");
    }

    @Test(groups = "regression", description = "Comment trigger scope: only the chosen scope starts the SLA")
    @CaseId("SL-07")
    public void commentScope() {
        String a = "SL07a" + uid();
        Map<String, Object> tr = triggers();
        tr.put("comment", "public");
        api.createPolicy(policy("QA AO " + a, DEPT_A, tr, List.of(target("t", tag(a), t(30, "minutes"), t(5, "hours"), null))));
        String tk = api.ticket("QA AO " + a, DEPT_A, "high");
        ok(api.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p>QA AO private</p>", "is_public", false)), "private comment");
        String afterPrivate = api.sla(tk, 20).getString("data.state");
        ok(api.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p>QA AO public</p>", "is_public", true)), "public comment");
        String afterPublic = api.sla(tk, 40).getString("data.state");
        System.out.println("[RECORD] SL-07 public scope: after private=" + afterPrivate + " after public=" + afterPublic);
        assertEquals(afterPublic, "applied", "control: a public comment starts it");
        assertNotEquals(afterPrivate, "applied", "a private comment must not start a public-only policy");
    }

    @Test(groups = "regression", description = "Business hours: due time counts open hours only")
    @CaseId("SL-15")
    public void businessDue() {
        String tag = "SL15" + uid();
        String h = hours(tag);
        api.createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(businessTarget(tag, h, 60, null))));
        ZonedDateTime now = ZonedDateTime.now(ZoneId.of("Africa/Cairo"));
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(api.sla(tk, 30).getString("data.state"), "applied");
        sleep(15000);
        JsonPath s = api.sla(tk, 1);
        String due = s.getString("data.obligations.find{it.kind=='first_response'}.due_at");
        ZonedDateTime open = nextOpen(now);
        System.out.println("[RECORD] SL-15 now " + now + " due " + due + "");
        Instant actual = java.time.OffsetDateTime.parse(due).toInstant();
        long gapMin = Math.abs(java.time.Duration.between(open.plusHours(1).toInstant(), actual).toMinutes());
        assertTrue(gapMin <= 2, "due should be one open hour after " + open + " but was " + due);
    }

    @Test(groups = "regression", description = "Business mode with no hours set: stated behaviour")
    @CaseId("SL-17")
    public void noHours() {
        String tag = "SL17" + uid();
        Response r = api.post(P, policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(businessTarget(tag, null, 60, null))));
        System.out.println("[RECORD] SL-17 business mode, no set: " + r.statusCode() + " " + cut(r.asString()));
        if (r.statusCode() / 100 == 2) {
            track("policy", r.jsonPath().getString("data.id"), "QA AO " + tag);
            String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
            System.out.println("[RECORD] SL-17 ticket " + cut(ok(api.get("/desk/tickets/" + tk + "/sla"), "sla").asString()));
        }
    }

    @Test(groups = "regression", description = "Business hours in use by a target can't be deleted (NDC-2216)")
    @CaseId("SL-53")
    public void deleteHoursInUse() {
        String tag = "SL53" + uid();
        String h = hours(tag);
        api.createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(businessTarget(tag, h, 60, null))));
        Response d = api.delete(BH + "/" + h);
        System.out.println("[RECORD] SL-53 delete in use: " + d.statusCode() + " " + cut(d.asString()));
        assertEquals(d.statusCode() / 100, 4, "delete must be refused while a target uses it");
    }

    @Test(groups = "regression", description = "Before-due longer than the target; levels out of order")
    @CaseId("SL-54")
    public void levelOrder() {
        String a = "SL54a" + uid(), b = "SL54b" + uid();
        List<Map<String, Object>> owner = List.of(Map.of("kind", "ticket_owner"));
        Response longer = api.post(P, policy("QA AO " + a, DEPT_A, triggers("create"), List.of(target("t", tag(a), t(30, "minutes"), t(5, "hours"), esc(List.of(level("before", 120, owner)))))));
        Response order = api.post(P, policy("QA AO " + b, DEPT_A, triggers("create"), List.of(target("t", tag(b), t(30, "minutes"), t(5, "hours"), esc(List.of(level("after", 30, owner), level("before", 5, owner)))))));
        for (Response r : List.of(longer, order)) if (r.statusCode() / 100 == 2) track("policy", r.jsonPath().getString("data.id"), "QA AO SL54");
        System.out.println("[RECORD] SL-54 before longer than target: " + longer.statusCode() + " " + cut(longer.asString()));
        System.out.println("[RECORD] SL-54 out of order: " + order.statusCode() + " " + cut(order.asString()));
    }

    @Test(groups = "regression", description = "Contact recipient isn't allowed before due")
    @CaseId("SL-56")
    public void contactBefore() {
        String a = "SL56" + uid();
        Response r = api.post(P, policy("QA AO " + a, DEPT_A, triggers("create"), List.of(target("t", tag(a), t(30, "minutes"), t(5, "hours"), esc(List.of(level("before", 5, List.of(Map.of("kind", "customer_contact")))))))));
        if (r.statusCode() / 100 == 2) track("policy", r.jsonPath().getString("data.id"), "QA AO " + a);
        System.out.println("[RECORD] SL-56 " + r.statusCode() + " " + cut(r.asString()));
        assertEquals(r.statusCode() / 100, 4, "contact before due refused");
    }

    @Test(groups = "regression", description = "Audit log records policy create and delete")
    @CaseId("SL-49")
    public void audit() {
        String name = "SL49" + uid();
        String id = api.createPolicy(policy("QA AO " + name, DEPT_A, triggers("create"), List.of(target("t", tag(name), t(30, "minutes"), t(5, "hours"), null))));
        ok(api.delete(P + "/" + id), "delete policy");
        sleep(8000);
        Response r = ok(api.get("/audit/events?limit=100"), "audit");
        List<Map<String, Object>> ev = r.jsonPath().getList("data");
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : ev)
            if (String.valueOf(e.get("target_label")).contains(name) || String.valueOf(e.get("target_id")).equals(id))
                sb.append(e.get("action")).append(" ").append(e.get("target_type")).append(" ").append(e.get("target_label")).append("; ");
        System.out.println("[RECORD] SL-49 " + sb);
        assertTrue(sb.toString().contains("created"), "create in the audit log");
        assertTrue(sb.toString().contains("deleted"), "delete in the audit log");
    }

    private String contact(String tag) {
        Map<String, Object> n = new LinkedHashMap<>();
        n.put("kind", "string");
        n.put("value", "QA AO Contact " + tag);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("kind", "string");
        m.put("value", GMAIL);
        Response r = api.post("/modules/" + CONTACTS + "/records", Map.of("data", List.of(Map.of("field", "last_name", "value", n), Map.of("field", "email", "value", m))));
        System.out.println("[RECORD] contact " + r.statusCode() + " " + cut(r.asString()));
        String id = ok(r, "contact").jsonPath().getString("data.id");
        track("modules/" + CONTACTS + "/records", id, "QA AO Contact");
        return id;
    }

    @Test(groups = "regression", description = "Recipient kinds at due: in-app notice reaches named agent; contact mail is for the user to confirm; history records it")
    @CaseId("SL-21")
    public void recipients() {
        String tag = "SL21" + uid();
        String c = contact(tag);
        List<Map<String, Object>> who = List.of(Map.of("kind", "agent", "id", A1), Map.of("kind", "ticket_owner"), Map.of("kind", "department_agents"), Map.of("kind", "owner_manager"), Map.of("kind", "customer_contact"));
        api.createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(target("t", tag(tag), t(1, "minutes"), t(5, "hours"), esc(List.of(level("at", null, who)))))));
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        assertEquals(api.sla(tk, 30).getString("data.state"), "applied");
        sleep(120000);
        JsonPath s = api.sla(tk, 1);
        assertEquals(s.getString("data.obligations.find{it.kind=='first_response'}.escalation_level_reached"), "1", "the level fired");
        for (String who2 : List.of(ADMIN, "Test User 1", AGENT)) {
            Response n = AoApi.as(who2).get("/notifications?limit=30");
            System.out.println("[RECORD] SL-21 in-app " + who2 + " " + n.statusCode() + " has=" + n.asString().contains(tag));
        }
        System.out.println("[RECORD] SL-63 history " + cut(api.get("/desk/tickets/" + tk + "/history").asString()));
        String act = api.get("/desk/tickets/" + tk + "/activity").asString(); int i0 = act.indexOf("sla.escalation_fired"); System.out.println("[RECORD] SL-63 activity " + act.substring(i0, Math.min(act.length(), i0 + 1500))); System.out.println("[RECORD] SL-63 actions " + new JsonPath(act).getList("data.action"));
        System.out.println("[RECORD] SL-43 counts " + cut(api.get("/desk/queues/counts").asString()));
        System.out.println("[MAIL] " + GMAIL + " subject should contain the policy level, ticket subject QA AO " + tag);
    }

    @Test(groups = "regression", description = "Contract: plan, dates, coverage reasons; remove plan; delete order (NDC-2215)")
    @CaseId("SL-39")
    public void contracts() {
        String tag = "SL39" + uid();
        Map<String, Object> an = new LinkedHashMap<>();
        an.put("kind", "string");
        an.put("value", "QA AO Account " + tag);
        String acc = ok(api.post("/modules/" + ACCOUNTS + "/records", Map.of("data", List.of(Map.of("field", "account_name", "value", an)))), "account").jsonPath().getString("data.id");
        track("modules/" + ACCOUNTS + "/records", acc, "QA AO Account");
        String pol = api.createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(target("t", tag(tag), t(30, "minutes"), t(5, "hours"), null))));
        Map<String, Object> pb = new LinkedHashMap<>();
        pb.put("department_id", DEPT_A);
        pb.put("name", "QA AO Plan " + tag);
        pb.put("description", null);
        pb.put("type", "unlimited");
        pb.put("policy_id", pol);
        String plan = ok(api.post("/desk/sla/support-plans", pb), "plan").jsonPath().getString("data.id");
        track("plan", plan, "QA AO Plan");
        List<Map<String, Object>> data = new java.util.ArrayList<>();
        for (String[] kv : List.of(new String[]{"contract_name", "QA AO Contract " + tag}, new String[]{"department", DEPT_A}, new String[]{"account_id", acc}, new String[]{"support_plan", plan},
                new String[]{"start_date", java.time.LocalDate.now().toString()}, new String[]{"end_date", java.time.LocalDate.now().plusMonths(3).toString()})) {
            Map<String, Object> v = new LinkedHashMap<>();
            v.put("kind", "string");
            v.put("value", kv[1]);
            data.add(Map.of("field", kv[0], "value", v));
        }
        Response cr = api.post("/modules/" + CONTRACTS + "/records", Map.of("data", data));
        System.out.println("[RECORD] SL-39 contract " + cr.statusCode() + " " + cut(cr.asString()));
        String contract = ok(cr, "contract").jsonPath().getString("data.id");
        track("modules/" + CONTRACTS + "/records", contract, "QA AO Contract");
        System.out.println("[RECORD] SL-39 contract coverage " + cut(api.get("/desk/sla/contracts/" + contract + "/coverage").asString()));
        System.out.println("[RECORD] SL-39 account coverage " + cut(api.get("/desk/sla/coverage/accounts/" + acc).asString()));
        Response setPlan = api.put("/desk/sla/contracts/" + contract + "/plan", Map.of("plan_id", plan));
        System.out.println("[RECORD] SL-39 attach plan " + setPlan.statusCode() + " " + cut(setPlan.asString()));
        System.out.println("[RECORD] SL-39 coverage with plan " + cut(api.get("/desk/sla/contracts/" + contract + "/coverage").asString()));
        String tkAcc = api.ticket("QA AO " + tag, DEPT_A, "high", Map.of("account_id", acc));
        System.out.println("[RECORD] SL-39 ticket source " + api.sla(tkAcc, 30).getString("data.coverage.source"));
        System.out.println("[RECORD] SL-61 plan usage " + cut(api.get("/desk/sla/support-plans/" + plan + "/usage").asString()));
        int inUse = api.delete("/desk/sla/support-plans/" + plan).statusCode();
        System.out.println("[RECORD] SL-59 delete plan while attached " + inUse);
        assertEquals(inUse / 100, 4, "SL-59: a plan on a contract can't be deleted");
        Map<String, Object> noPlan = new LinkedHashMap<>();
        noPlan.put("plan_id", null);
        System.out.println("[RECORD] SL-59 remove plan " + api.put("/desk/sla/contracts/" + contract + "/plan", noPlan).statusCode());
        ok(api.delete("/modules/" + TICKETS + "/records/" + tkAcc), "delete ticket");
        int delContract = api.delete("/modules/" + CONTRACTS + "/records/" + contract).statusCode();
        int delPlan = api.delete("/desk/sla/support-plans/" + plan).statusCode();
        int delPol = api.delete(P + "/" + pol).statusCode();
        System.out.println("[RECORD] SL-59 delete contract " + delContract + ", plan " + delPlan + ", policy " + delPol);
        assertEquals(delPlan / 100, 2, "SL-59: plan deletes once the contract is gone");
        assertEquals(delPol / 100, 2, "SL-59: policy deletes once unused");
    }
}
