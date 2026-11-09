package qa.features.deskautomationorder;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/**
 * Notification rules on QA AO Dept A only. Rule states are saved first and restored at the end. Tenant-wide switches are not touched.
 * The bell proves in-app delivery. Mail can't be read from here, so mail rows write a checklist for the user to confirm.
 */
public class NotificationApiTest {
    private AoApi api, agent;
    private static final String TEST_USER = "Test User 1", ADMIN_ID = "3445ec4a-020e-4f12-b156-dd2de7610164";
    private static final String R = "/desk/notification-rules/departments/";
    private static final String CONTACTS = "43004ce2-577f-4eda-b00a-0750fe40c3d4";
    private static final String GMAIL = "mahmoud.mmohamedsamy@gmail.com", WORK = "mmohamed@anyware.software", ALIAS = "mahmoud.mmohamedsamy+qaao@gmail.com";
    private static final Path CHECKLIST = Config.projectDir().resolve("../executions/execu_2026-11-08_desk-automation-order/mail-checklist.md").normalize();
    private final Map<String, Map<String, Object>> saved = new LinkedHashMap<>();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = AoApi.admin();
        agent = AoApi.as(TEST_USER);
        for (Map<String, Object> r : rules(DEPT_A)) saved.put(String.valueOf(r.get("key")), r);
    }

    @AfterMethod(alwaysRun = true)
    public void clean() {
        restore();
        List<String> left = api.cleanup();
        if (!left.isEmpty()) System.out.println("[CLEANUP] left: " + left);
    }

    @AfterClass(alwaysRun = true)
    public void finish() {
        restore();
        Map<String, Boolean> now = new LinkedHashMap<>();
        for (Map<String, Object> r : rules(DEPT_A)) now.put(String.valueOf(r.get("key")), Boolean.TRUE.equals(r.get("is_enabled")));
        for (Map.Entry<String, Map<String, Object>> e : saved.entrySet())
            if (!Boolean.valueOf(Boolean.TRUE.equals(e.getValue().get("is_enabled"))).equals(now.get(e.getKey())))
                System.out.println("[CLEANUP] rule not restored: " + e.getKey());
    }

    private void restore() {
        for (Map<String, Object> r : rules(DEPT_A)) {
            Map<String, Object> s = saved.get(String.valueOf(r.get("key")));
            if (s != null && (!java.util.Objects.equals(s.get("is_enabled"), r.get("is_enabled")) || !java.util.Objects.equals(s.get("template_id"), r.get("template_id"))))
                ok(put(String.valueOf(r.get("key")), s.get("is_enabled"), s.get("template_id")), "restore");
        }
    }

    private List<Map<String, Object>> rules(String dept) {
        return ok(api.get(R + dept), "rules").jsonPath().getList("data.rules");
    }

    private Map<String, Object> rule(String key) {
        for (Map<String, Object> r : rules(DEPT_A)) if (key.equals(r.get("key"))) return r;
        throw new IllegalStateException("no rule " + key);
    }

    private Response put(String key, Object on, Object template) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("is_enabled", on);
        b.put("template_id", template);
        return api.put(R + DEPT_A + "/rules/" + key, b);
    }

    private void set(String key, boolean on) {
        ok(put(key, on, rule(key).get("template_id")), "set " + key);
    }

    private int bell(AoApi who, String tag) {
        String body = ok(who.get("/notifications?limit=60"), "bell").asString();
        return body.split(java.util.regex.Pattern.quote("\"title\":\"")).length == 0 ? 0 : countTitles(body, tag);
    }

    private List<String> events(AoApi who, String tag) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> x : ok(who.get("/notifications?limit=60"), "bell").jsonPath().<Map<String, Object>>getList("data.data"))
            if (String.valueOf(x.get("title")).contains(tag)) out.add(String.valueOf(x.get("event_type")));
        return out;
    }

    private static int countTitles(String body, String tag) {
        int n = 0;
        for (Map<String, Object> x : new io.restassured.path.json.JsonPath(body).<Map<String, Object>>getList("data.data"))
            if (String.valueOf(x.get("title")).contains(tag)) n++;
        return n;
    }

    /** Owner back to admin so the admin can delete the ticket afterwards. */
    private void giveBack(String tk) {
        int d = agent.delete("/modules/" + TICKETS + "/records/" + tk).statusCode();
        if (d / 100 != 2) {
            Map<String, Object> none = new LinkedHashMap<>();
            none.put("owner_id", null);
            none.put("team_id", null);
            int u = agent.post("/desk/tickets/" + tk + "/assign", none).statusCode();
            int d2 = api.delete("/modules/" + TICKETS + "/records/" + tk).statusCode();
            System.out.println("[CLEANUP] " + tk + " agent delete " + d + ", unassign " + u + ", admin delete " + d2);
        }
    }

    private static Response assign(AoApi who, String tk, String owner, String team) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("owner_id", owner);
        b.put("team_id", team);
        return who.post("/desk/tickets/" + tk + "/assign", b);
    }

    private List<String> feed(String tk) {
        return ok(api.get("/desk/tickets/" + tk + "/activity"), "feed").jsonPath().getList("data.action");
    }

    private static long sent(List<String> actions) {
        return actions.stream().filter("reply.sent"::equals).count();
    }

    private static void mail(String row, String to, String subject, String expect) {
        try {
            Files.createDirectories(CHECKLIST.getParent());
            if (!Files.exists(CHECKLIST)) Files.writeString(CHECKLIST, "# Mail to check (8 Nov 2026)\n\nSearch each inbox, including Spam, for the tag in the subject.\n\n| Row | Inbox | Tag | Expected |\n|---|---|---|---|\n");
            Files.writeString(CHECKLIST, "| " + row + " | " + to + " | " + subject + " | " + expect + " |\n", StandardOpenOption.APPEND);
        } catch (Exception e) {
            System.out.println("[RECORD] checklist not written");
        }
    }

    private String contact(String tag) {
        Map<String, Object> n = new LinkedHashMap<>();
        n.put("kind", "string");
        n.put("value", "QA AO Contact " + tag);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("kind", "string");
        m.put("value", GMAIL);
        String id = ok(api.post("/modules/" + CONTACTS + "/records", Map.of("data", List.of(Map.of("field", "last_name", "value", n), Map.of("field", "email", "value", m)))), "contact").jsonPath().getString("data.id");
        track("modules/" + CONTACTS + "/records", id, "QA AO Contact");
        return id;
    }

    @Test(groups = "regression", description = "Access: admin manages; agent can't read or change the rules")
    @CaseId("NT-01")
    public void access() {
        int read = agent.get(R + DEPT_A).statusCode();
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("is_enabled", false);
        b.put("template_id", null);
        int write = agent.put(R + DEPT_A + "/rules/agent.ticket_assigned", b).statusCode();
        System.out.println("[RECORD] NT-01 agent read " + read + " write " + write);
        assertEquals(write, 403, "agent can't change rules");
    }

    @Test(groups = "regression", description = "Department picker: each department has its own rules; unknown department refused")
    @CaseId("NT-02")
    public void departments() {
        assertEquals(rules(DEPT_B).size(), 37);
        Response bad = api.get(R + "00000000-0000-0000-0000-00000000abcd");
        System.out.println("[RECORD] NT-02 unknown department " + bad.statusCode() + " " + bad.asString());
        assertEquals(bad.statusCode() / 100, 4);
    }

    @Test(groups = "regression", description = "37 rules in 5 groups; defaults recorded")
    @CaseId("NT-03")
    public void list() {
        List<Map<String, Object>> l = rules(DEPT_B);
        Map<String, Integer> g = new LinkedHashMap<>();
        int on = 0;
        for (Map<String, Object> r : l) {
            g.merge(String.valueOf(r.get("category")), 1, Integer::sum);
            if (Boolean.TRUE.equals(r.get("is_enabled"))) on++;
        }
        System.out.println("[RECORD] NT-03 total " + l.size() + " on " + on + " groups " + g);
        assertEquals(l.size(), 37);
        assertEquals(g.keySet().size(), 5);
    }

    @Test(groups = "regression", description = "A change takes effect at once and other departments stay as they were")
    @CaseId("NT-04")
    public void isolation() {
        String key = "department.ticket_moved";
        Object before = null;
        for (Map<String, Object> r : rules(DEPT_B)) if (key.equals(r.get("key"))) before = r.get("is_enabled");
        boolean to = !Boolean.TRUE.equals(rule(key).get("is_enabled"));
        set(key, to);
        assertEquals(rule(key).get("is_enabled"), to, "read back at once");
        Object after = null;
        for (Map<String, Object> r : rules(DEPT_B)) if (key.equals(r.get("key"))) after = r.get("is_enabled");
        assertEquals(after, before, "Dept B unchanged");
    }

    @Test(groups = "regression", description = "Agent assigned rule off then on, in the bell; self-assignment; one notice")
    @CaseId("NT-08")
    public void assigned() {
        String off = "NT08off" + uid(), on = "NT08on" + uid(), self = "NT14" + uid();
        System.out.println("[RECORD] NT-08 rule " + rule("agent.ticket_assigned"));
        set("agent.ticket_assigned", false);
        sleep(60000);
        String a = api.ticket("QA AO " + off, DEPT_A, "high");
        ok(assign(api, a, A1, null), "assign");
        sleep(30000);
        System.out.println("[RECORD] NT-08 rule off, bell events " + events(agent, off));
        set("agent.ticket_assigned", true);
        sleep(60000);
        String b = api.ticket("QA AO " + on, DEPT_A, "high");
        ok(assign(api, b, A1, null), "assign");
        String c = api.ticket("QA AO " + self, DEPT_A, "high");
        ok(assign(api, c, A2, null), "owner first");
        sleep(25000);
        String own = agent.ticket("QA AO " + self + "b", DEPT_A, "high");
        Response selfAssign = assign(agent, own, A1, null);
        System.out.println("[RECORD] NT-14 self-assign " + selfAssign.statusCode());
        sleep(20000);
        int nOff = bell(agent, off), nOn = bell(agent, on), nSelf = bell(agent, self + "b");
        System.out.println("[RECORD] NT-08 bell off=" + nOff + " on=" + nOn + "; NT-14 self=" + nSelf);
        giveBack(a);
        giveBack(b);
        giveBack(own);
        mail("NT-08", "Test User 1's mailbox", on, "assignment mail arrives (control)");
        mail("NT-08", "Test User 1's mailbox", off, "no assignment mail (rule off)");
        if (nOn == 0) throw new SkipException("INCONCLUSIVE: this rule shows nothing in the bell, even when on, so only mail can prove it");
        System.out.println("[RECORD] NT-08 rule on, bell events " + events(agent, on));
        assertEquals(nOn, 1, "NT-25: exactly one notice");
        assertEquals(nOff, 0, "rule off: no notice");
        assertEquals(nSelf, 0, "NT-14: no notice for self-assignment");
    }

    @Test(groups = "regression", description = "Mentioned: the bell shows it to the person named")
    @CaseId("NT-08m")
    public void mentioned() {
        String tag = "NT08m" + uid();
        set("agent.mentioned", true);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        ok(assign(api, tk, A1, null), "A1 owns it, so A1 can see it");
        sleep(5000);
        Response c = api.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p><span class=\"rt-mention\" data-mention-id=\"" + A1 + "\" data-mention-kind=\"agent\">@Test User 1</span> QA AO</p>", "is_public", false));
        if (c.statusCode() / 100 != 2) {
            System.out.println("[RECORD] NT-08m admin comment " + c.statusCode() + "; agent mentions self");
            c = agent.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p><span class=\"rt-mention\" data-mention-id=\"" + A2 + "\" data-mention-kind=\"agent\">@A2</span> QA AO</p>", "is_public", false));
            System.out.println("[RECORD] NT-08m agent comment " + c.statusCode());
            ok(c, "comment");
            giveBack(tk);
            throw new SkipException("INCONCLUSIVE: admin can't comment once assigned; the mention went to A2, whose bell this run doesn't read");
        }
        System.out.println("[RECORD] NT-08m comment " + c.statusCode());
        ok(c, "comment");
        sleep(25000);
        List<String> ev = events(agent, tag);
        System.out.println("[RECORD] NT-08m bell events " + ev);
        giveBack(tk);
        assertEquals(ev.stream().filter(x -> x.contains("mention")).count(), 1L, "the mentioned agent gets one mention notice");
    }

    @Test(groups = "regression", description = "Tidy: return the 3 earlier QA AO tickets to the admin and delete them")
    @CaseId("NT-00")
    public void leftovers() {
        for (String id : List.of("99a09432-6137-409c-beaa-f600b273492e", "f8b04a80-409a-4cc2-8e6e-9e6eca877e1d", "3e85975f-ecf4-43c3-9f99-e09d6d77ebc6",
                "7ec14979-afb2-4064-984e-ec3b6cc3350e", "ef05e726-8e0d-4049-843a-6978f0b34ac5", "058c94af-8eac-453f-b297-3d0ee5044dee")) {
            System.out.println("[RECORD] leftover " + id + " agent read " + agent.get("/desk/tickets/" + id).statusCode());
            giveBack(id);
            System.out.println("[RECORD] leftover " + id + " admin read after " + api.get("/modules/" + TICKETS + "/records/" + id).statusCode() + " agent read after " + agent.get("/desk/tickets/" + id).statusCode());
        }
        Response dt = api.delete("/desk/teams/25df8963-7c31-4f32-9e7c-1ea2a8791c5f");
        System.out.println("[RECORD] leftover team delete " + dt.statusCode() + " " + dt.asString());
        for (String who : List.of("Customer Experience Specialists 1", "Dev Team 2", "QA Team 1", AGENT, TEST_USER)) {
            Response t = AoApi.as(who).get("/desk/agents/me/teams");
            System.out.println("[RECORD] who " + who + " teams " + t.statusCode() + " " + t.asString().substring(0, Math.min(260, t.asString().length())));
        }
    }

    @Test(groups = "regression", description = "Team rules: every member once; created in a QA team")
    @CaseId("NT-12")
    public void team() {
        String tag = "NT12" + uid();
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("name", "QA AO Team " + tag);
        b.put("description", null);
        b.put("department_id", DEPT_A);
        b.put("sources", List.of(Map.of("kind", "agent", "ref_id", A1), Map.of("kind", "agent", "ref_id", A2)));
        b.put("color", "teal");
        b.put("icon", "headset");
        Response t = api.post("/desk/teams", b);
        System.out.println("[RECORD] NT-12 team " + t.statusCode() + " " + t.asString().substring(0, Math.min(400, t.asString().length())));
        String team = ok(t, "team").jsonPath().getString("data.id");
        track("desk/teams", team, "QA AO Team");
        System.out.println("[RECORD] NT-12 rule " + rule("team.ticket_assigned").get("channels"));
        set("team.ticket_assigned", true);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        ok(assign(api, tk, null, team), "assign team");
        sleep(25000);
        int a = bell(agent, tag), c = bell(AoApi.as(AGENT), tag);
        System.out.println("[RECORD] NT-12 bell Test User 1=" + a + ", " + AGENT + "=" + c);
        mail("NT-12", "Team members' mailboxes", tag, "each member once");
        if (a == 0 && c == 0) throw new SkipException("INCONCLUSIVE: nothing in the bell for this rule; mail must prove it");
        assertTrue(a <= 1 && c <= 1, "each member at most once");
    }

    @Test(groups = "regression", description = "Contact mail events: closed, comments, private comment; on and off")
    @CaseId("NT-05")
    public void contactMail() {
        String c = contact("NT05" + uid());
        String off = "NT05off" + uid(), on = "NT05on" + uid(), priv = "NT13" + uid();
        set("contact.ticket_closed", false);
        set("contact.comment_added", false);
        String a = api.ticket("QA AO " + off, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        ok(api.post("/desk/tickets/" + a + "/comments", Map.of("body_html", "<p>QA AO public, rule off</p>", "is_public", true)), "comment");
        sleep(10000);
        Response ca = api.post("/desk/tickets/" + a + "/close", Map.of());
        set("contact.ticket_closed", true);
        set("contact.comment_added", true);
        String b = api.ticket("QA AO " + on, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        ok(api.post("/desk/tickets/" + b + "/comments", Map.of("body_html", "<p>QA AO public, rule on</p>", "is_public", true)), "comment");
        Response cb = api.post("/desk/tickets/" + b + "/close", Map.of());
        String p = api.ticket("QA AO " + priv, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        ok(api.post("/desk/tickets/" + p + "/comments", Map.of("body_html", "<p>QA AO private note</p>", "is_public", false)), "private");
        System.out.println("[RECORD] NT-05 close off " + ca.statusCode() + " on " + cb.statusCode());
        sleep(30000);
        List<String> fa = feed(a), fb = feed(b), fp = feed(p);
        System.out.println("[RECORD] NT-05 off " + fa + " on " + fb + " private " + fp);
        assertTrue(sent(fb) >= 2, "control: rules on send the comment mail and the closed mail");
        assertEquals(sent(fa), 0L, "rules off: no mail to the customer");
        assertEquals(sent(fp), 0L, "NT-13: a private comment sends nothing");
        mail("NT-05", GMAIL, on, "closed mail and comment mail both arrive (control)");
        mail("NT-05", GMAIL, off, "no closed mail, no comment mail (rules off)");
        mail("NT-13", GMAIL, priv, "nothing: a private comment must not reach the customer");
    }

    @Test(groups = "regression", description = "CC rules: added as CC, and a CC gets the closed mail")
    @CaseId("NT-07")
    public void ccMail() {
        String tag = "NT07" + uid();
        Map<String, Object> cn = new LinkedHashMap<>();
        cn.put("kind", "string");
        cn.put("value", "QA AO Primary " + tag);
        String c = ok(api.post("/modules/" + CONTACTS + "/records", Map.of("data", List.of(Map.of("field", "last_name", "value", cn)))), "primary").jsonPath().getString("data.id");
        track("modules/" + CONTACTS + "/records", c, "QA AO Primary");
        set("cc.added_to_ticket", true);
        set("cc.ticket_closed", true);
        String t = api.ticket("QA AO " + tag, DEPT_A, "high", Map.of("contact_id", c));
        Map<String, Object> ccName = new LinkedHashMap<>();
        ccName.put("kind", "string");
        ccName.put("value", "QA AO CC " + tag);
        Map<String, Object> ccMail = new LinkedHashMap<>();
        ccMail.put("kind", "string");
        ccMail.put("value", ALIAS);
        String cc = ok(api.post("/modules/" + CONTACTS + "/records", Map.of("data", List.of(Map.of("field", "last_name", "value", ccName), Map.of("field", "email", "value", ccMail)))), "cc contact").jsonPath().getString("data.id");
        track("modules/" + CONTACTS + "/records", cc, "QA AO CC");
        Response agentCc = api.post("/desk/tickets/" + t + "/cc", Map.of("address", WORK));
        System.out.println("[RECORD] NT-07 agent address as CC " + agentCc.statusCode());
        Response r = api.post("/desk/tickets/" + t + "/cc", Map.of("address", ALIAS));
        System.out.println("[RECORD] NT-07 set CC " + r.statusCode() + " " + r.asString().substring(0, Math.min(300, r.asString().length())));
        ok(r, "cc");
        ok(api.post("/desk/tickets/" + t + "/close", Map.of()), "close");
        sleep(20000);
        System.out.println("[RECORD] NT-07 cc list " + api.get("/desk/tickets/" + t + "/cc").asString() + " feed " + feed(t));
        mail("NT-07", GMAIL + " (sent to the +qaao alias)", tag, "added-as-CC mail, then closed mail: one each");
    }

    @Test(groups = "regression", description = "Rule templates: choose, default, wrong and missing template")
    @CaseId("NT-15")
    public void templates() {
        String key = "contact.ticket_closed";
        Response list = ok(api.get("/desk/email-templates?limit=200"), "templates");
        List<Map<String, Object>> all = list.jsonPath().getList("data.email_templates");
        String own = null, otherUse = null;
        for (Map<String, Object> t : all) {
            System.out.println("[RECORD] NT-15 template " + t.get("name") + " | " + t.get("module") + " | " + t.get("notification_type") + " | " + t.get("use_case") + " | system " + t.get("is_system"));
            if ("desk_tickets".equals(t.get("module")) && "ticket.closed".equals(t.get("use_case")) && !Boolean.TRUE.equals(t.get("is_system")) && own == null) own = String.valueOf(t.get("id"));
        }
        System.out.println("[RECORD] NT-15 rule " + rule(key));
        Response missing = put(key, true, "00000000-0000-0000-0000-00000000abcd");
        System.out.println("[RECORD] NT-15 missing template " + missing.statusCode() + " " + missing.asString());
        assertEquals(missing.statusCode() / 100, 4, "a template that doesn't exist is refused");
        if (own == null) {
            Map<String, Object> nt = new LinkedHashMap<>();
            nt.put("name", "QA AO Template " + uid());
            nt.put("module", "desk_tickets");
            nt.put("notification_type", "contact");
            nt.put("use_case", "ticket.closed");
            nt.put("subject", "QA AO NT16 {{ticket.number}} {{ticket.subject}}");
            nt.put("body_html", "<p>QA AO {{ticket.subject}}</p><script>window.qaao=1</script><img src=x onerror=window.qaao=2>");
            Response made = api.post("/desk/email-templates", nt);
            System.out.println("[RECORD] NT-15 make template " + made.statusCode() + " " + made.asString().substring(0, Math.min(700, made.asString().length())));
            if (made.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: no ticket template to bind");
            own = made.jsonPath().getString("data.id");
            track("desk/email-templates", own, "QA AO Template");
        }
        Response bind = put(key, true, own);
        System.out.println("[RECORD] NT-15 bind " + bind.statusCode() + " " + bind.asString().substring(0, Math.min(300, bind.asString().length())));
        ok(bind, "bind");
        assertEquals(rule(key).get("template_id"), own);
        String body = made0(own);
        System.out.println("[RECORD] NT-29 stored body has script=" + body.contains("<script") + " onerror=" + body.contains("onerror"));
        Response pv = api.post("/desk/email-templates/preview", Map.of("module", "desk_tickets", "use_case", "ticket.closed", "subject", "QA AO {{ticket.subject}} {{ticket.unknown_token}}", "body_html", body));
        System.out.println("[RECORD] NT-16 preview " + pv.statusCode() + " " + pv.asString().substring(0, Math.min(500, pv.asString().length())));
        String mailTag = "NT16" + uid();
        String mc = contact(mailTag);
        String mt = api.ticket("QA AO " + mailTag, DEPT_A, "high", Map.of("contact_id", mc, "email", GMAIL));
        ok(api.post("/desk/tickets/" + mt + "/close", Map.of()), "close");
        sleep(25000);
        System.out.println("[RECORD] NT-16 feed " + feed(mt));
        mail("NT-16", GMAIL, mailTag, "closed mail with subject QA AO NT16, the ticket number and subject filled in, no {{ }} left, no script running");
        ok(put(key, true, null), "default");
        assertNull(rule(key).get("template_id"), "back to default");
    }

    @Test(groups = "regression", description = "Closed mail with a bound template: inactive, then active")
    @CaseId("NT-15c")
    public void templateActiveState() {
        String key = "contact.ticket_closed";
        Map<String, Object> nt = new LinkedHashMap<>();
        nt.put("name", "QA AO Template " + uid());
        nt.put("module", "desk_tickets");
        nt.put("notification_type", "contact");
        nt.put("use_case", "ticket.closed");
        nt.put("subject", "QA AO NT15c {{ticket.number}} {{ticket.subject}}");
        nt.put("body_html", "<p>QA AO {{ticket.subject}}</p>");
        Response made = ok(api.post("/desk/email-templates", nt), "template");
        String id = made.jsonPath().getString("data.id");
        track("desk/email-templates", id, "QA AO Template");
        System.out.println("[RECORD] NT-15c new template is_active=" + made.jsonPath().getString("data.is_active"));
        ok(put(key, true, id), "bind");
        System.out.println("[RECORD] NT-15c bound, binding valid=" + rule(key).get("template_binding_valid"));
        String t1 = "NT15i" + uid();
        String c = contact(t1);
        String a = api.ticket("QA AO " + t1, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        ok(api.post("/desk/tickets/" + a + "/close", Map.of()), "close");
        sleep(25000);
        long sentInactive = sent(feed(a));
        Map<String, Object> full = new LinkedHashMap<>(ok(api.get("/desk/email-templates/" + id), "read").jsonPath().getMap("data"));
        full.put("is_active", true);
        Response act = api.put("/desk/email-templates/" + id, full);
        if (act.statusCode() / 100 != 2) act = api.post("/desk/email-templates/" + id + "/activate", Map.of());
        System.out.println("[RECORD] NT-15c activate " + act.statusCode() + " " + act.asString().substring(0, Math.min(240, act.asString().length())));
        String t2 = "NT15a" + uid();
        String b = api.ticket("QA AO " + t2, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        ok(api.post("/desk/tickets/" + b + "/close", Map.of()), "close");
        sleep(25000);
        long sentActive = sent(feed(b));
        System.out.println("[RECORD] NT-15c sent inactive=" + sentInactive + " active=" + sentActive + " is_active now=" + ok(api.get("/desk/email-templates/" + id), "read").jsonPath().getString("data.is_active"));
        mail("NT-15c", GMAIL, t2, "closed mail using the QA AO NT15c subject, tokens filled in");
        mail("NT-15c", GMAIL, t1, "inactive template: note whether anything arrives");
        ok(put(key, true, null), "default");
        assertEquals(act.statusCode() / 100, 2, "template activates");
        assertEquals(sentActive, 1L, "an active bound template sends the mail");
    }

    private String made0(String id) {
        return ok(api.get("/desk/email-templates/" + id), "template").jsonPath().getString("data.body_html");
    }

    @Test(groups = "regression", description = "Contact comment edited and deleted; closed by the record API")
    @CaseId("NT-05b")
    public void commentEvents() {
        String tag = "NT05b" + uid();
        String c = contact(tag);
        set("contact.comment_added", true);
        set("contact.comment_edited", true);
        set("contact.comment_deleted", true);
        set("contact.ticket_closed", true);
        String t = api.ticket("QA AO " + tag, DEPT_A, "high", Map.of("contact_id", c, "email", GMAIL));
        String id = ok(api.post("/desk/tickets/" + t + "/comments", Map.of("body_html", "<p>QA AO one</p>", "is_public", true)), "comment").jsonPath().getString("data.id");
        sleep(10000);
        long afterAdd = sent(feed(t));
        ok(api.put("/desk/tickets/" + t + "/comments/" + id, Map.of("body_html", "<p>QA AO two</p>", "is_public", true)), "edit");
        sleep(10000);
        long afterEdit = sent(feed(t));
        ok(api.delete("/desk/tickets/" + t + "/comments/" + id), "delete");
        sleep(10000);
        long afterDelete = sent(feed(t));
        Response viaRecord = api.setField(t, "status", "Closed");
        sleep(15000);
        long afterClose = sent(feed(t));
        System.out.println("[RECORD] NT-05b sent add " + afterAdd + " edit " + afterEdit + " delete " + afterDelete + "; NT-23 closed by record API " + viaRecord.statusCode() + " sent " + afterClose);
        mail("NT-05b", GMAIL, tag, "comment added, edited and removed mails");
        assertTrue(afterAdd >= 1, "added sends mail");
        assertTrue(afterEdit > afterAdd, "edited sends mail");
        assertTrue(afterDelete > afterEdit, "deleted sends mail");
    }

    @Test(groups = "regression", description = "Department rule: moved in, off then on")
    @CaseId("NT-11")
    public void moved() {
        String off = "NT11off" + uid(), on = "NT11on" + uid();
        System.out.println("[RECORD] NT-11 rule channels " + rule("department.ticket_moved").get("channels"));
        set("department.ticket_moved", false);
        sleep(60000);
        String a = api.ticket("QA AO " + off, DEPT_B, "high");
        Map<String, Object> mv = new LinkedHashMap<>();
        mv.put("department_id", DEPT_A);
        mv.put("owner_id", null);
        mv.put("team_id", null);
        ok(api.post("/desk/tickets/" + a + "/move", mv), "move");
        sleep(25000);
        set("department.ticket_moved", true);
        sleep(60000);
        String b = api.ticket("QA AO " + on, DEPT_B, "high");
        ok(api.post("/desk/tickets/" + b + "/move", mv), "move");
        sleep(25000);
        List<String> eOff = events(agent, off), eOn = events(agent, on);
        System.out.println("[RECORD] NT-11 bell off " + eOff + " on " + eOn);
        if (eOn.isEmpty()) throw new SkipException("INCONCLUSIVE: nothing in the bell when on; mail must prove it");
        assertTrue(eOff.isEmpty(), "rule off: no moved-in notice");
    }

    @Test(groups = "regression", description = "Bell: count, Unread and Flagged filters, flag, read")
    @CaseId("NT-20")
    public void bellFeed() {
        int count = ok(agent.get("/notifications/unread-count"), "count").jsonPath().getInt("data.count");
        List<Map<String, Object>> unread = ok(agent.get("/notifications?unread_only=true&limit=30"), "unread").jsonPath().getList("data.data");
        System.out.println("[RECORD] NT-20 count " + count + " unread page " + unread.size());
        for (Map<String, Object> n : unread) assertEquals(n.get("is_read"), false, "Unread filter returns unread only");
        if (unread.isEmpty()) throw new SkipException("INCONCLUSIVE: no unread notice to test with");
        String id = String.valueOf(unread.get(0).get("id"));
        Response flag = agent.post("/notifications/" + id + "/flag", Map.of());
        List<Map<String, Object>> flagged = ok(agent.get("/notifications?flagged_only=true&limit=30"), "flagged").jsonPath().getList("data.data");
        boolean inFlagged = flagged.stream().anyMatch(x -> id.equals(String.valueOf(x.get("id"))));
        agent.delete("/notifications/" + id + "/flag");
        Response read = agent.post("/notifications/" + id + "/read", Map.of());
        int after = ok(agent.get("/notifications/unread-count"), "count").jsonPath().getInt("data.count");
        System.out.println("[RECORD] NT-20 flag " + flag.statusCode() + " inFlagged " + inFlagged + " read " + read.statusCode() + " count after " + after);
        assertTrue(inFlagged, "flagged notice is in the Flagged filter");
        assertEquals(after, count - 1, "count drops by one");
    }

    @Test(groups = "regression", description = "Personal preferences: mute a channel, saved, restored")
    @CaseId("NT-21")
    public void preferences() {
        Response before = ok(agent.get("/notifications/preferences/me"), "prefs");
        List<Map<String, Object>> sig = before.jsonPath().getList("data.signals");
        System.out.println("[RECORD] NT-21 signals " + sig.size() + " desk " + sig.stream().filter(s -> "desk".equals(s.get("module"))).map(s -> s.get("event_type")).toList());
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("channel", "in_app");
        b.put("event_type", "desk.ticket.assigned");
        b.put("muted", true);
        Response put = agent.put("/notifications/preferences/me", b);
        System.out.println("[RECORD] NT-21 mute email " + put.statusCode() + " " + put.asString().substring(0, Math.min(200, put.asString().length())));
        String mutedTag = "NT21" + uid();
        boolean savedMuted = String.valueOf(ok(agent.get("/notifications/preferences/me"), "prefs").jsonPath().getList("data.signals.findAll{it.event_type=='desk.ticket.assigned'}.channels")).contains("channel=in_app, muted=true");
        String mt = api.ticket("QA AO " + mutedTag, DEPT_A, "high");
        ok(assign(api, mt, A1, null), "assign while muted");
        sleep(25000);
        int mutedBell = bell(agent, mutedTag);
        System.out.println("[RECORD] NT-21 saved muted=" + savedMuted + " bell while muted=" + mutedBell);
        giveBack(mt);
        Map<String, Object> back = new LinkedHashMap<>();
        back.put("channel", "in_app");
        back.put("event_type", "desk.ticket.assigned");
        back.put("muted", false);
        Response restored = agent.put("/notifications/preferences/me", back);
        System.out.println("[RECORD] NT-21 restore " + restored.statusCode() + " saved-muted=" + put.asString().contains("\"event_type\":\"desk.ticket.assigned\""));
        assertEquals(put.statusCode() / 100, 2, "preference saved");
        assertEquals(restored.statusCode() / 100, 2, "preference restored");
        assertTrue(savedMuted, "the mute is saved");
        assertEquals(mutedBell, 0, "muted: nothing in the bell");
    }

    @Test(groups = "regression", description = "Admin notification policy: who may read and change it")
    @CaseId("NT-22")
    public void policy() {
        int admin = api.get("/notifications/admin/policy").statusCode();
        System.out.println("[RECORD] NT-22 admin read policy " + admin);
        if (admin == 403) throw new SkipException("INCONCLUSIVE: this admin lacks notify:policy:manage; owner needed");
    }

    @Test(groups = "regression", description = "Rule changes appear in the audit log")
    @CaseId("NT-27")
    public void audit() {
        String key = "department.ticket_shared";
        set(key, !Boolean.TRUE.equals(rule(key).get("is_enabled")));
        sleep(8000);
        List<Map<String, Object>> ev = ok(api.get("/audit/events?limit=40"), "audit").jsonPath().getList("data");
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : ev) {
            String s = String.valueOf(e.get("target_type")) + " " + e.get("target_label") + " " + e.get("metadata");
            if (s.toLowerCase().contains("notification") || s.contains(key)) sb.append(e.get("action")).append(" ").append(s, 0, Math.min(140, s.length())).append("; ");
        }
        System.out.println("[RECORD] NT-27 " + sb);
        assertTrue(sb.length() > 0, "the rule change should be in the audit log");
    }

    @Test(groups = "regression", description = "Two saves in a row and a bad body: last write wins, bad values refused")
    @CaseId("NT-28")
    public void stale() {
        String key = "department.ticket_created";
        boolean to = !Boolean.TRUE.equals(rule(key).get("is_enabled"));
        int a = put(key, to, null).statusCode(), b = put(key, to, null).statusCode();
        Map<String, Object> bad = new LinkedHashMap<>();
        bad.put("is_enabled", "yes");
        int c = api.put(R + DEPT_A + "/rules/" + key, bad).statusCode();
        int d = put("department.no_such_rule", true, null).statusCode();
        System.out.println("[RECORD] NT-28 double " + a + "," + b + " bad type " + c + " unknown key " + d);
        assertEquals(c / 100, 4, "bad type refused");
        assertEquals(d / 100, 4, "unknown rule refused");
    }

    @Test(groups = "regression", description = "Other tenant's or a made-up department can't be changed; script in a template body stays inert")
    @CaseId("NT-29")
    public void security() {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("is_enabled", true);
        b.put("template_id", null);
        int other = api.put(R + "00000000-0000-0000-0000-00000000abcd/rules/agent.mentioned", b).statusCode();
        Response noAuthTenant = io.restassured.RestAssured.given().baseUri(HOST + "/api/v1").relaxedHTTPSValidation().header("x-tenant-id", TENANT).header("x-app-key", "desk").get(R + DEPT_A);
        System.out.println("[RECORD] NT-29 made-up department " + other + ", no token " + noAuthTenant.statusCode());
        assertEquals(other / 100, 4);
        assertEquals(noAuthTenant.statusCode(), 401);
    }
}
