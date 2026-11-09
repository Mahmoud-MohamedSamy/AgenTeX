package qa.features.deskblueprint;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.testng.Assert.*;
import static qa.features.deskblueprint.DeskBlueprintApi.err;
import static qa.features.deskblueprint.DeskBlueprintApi.ok;
import static qa.features.deskblueprint.DeskBlueprintFeature.*;

/**
 * Phase 2, owner only (1 Nov 2026): server checks of the designer rules (C, G), transition visibility (D9/D10), the transition
 * form (E7, E11, E13), after-actions (F3, F4, F6, F8, F10), workflow / department / SLA interplay (F9, L1, L3, L7, K14, K15, K17)
 * and security / size rows (N2, N4, N9). Everything is "QA BP …" in QA WF Dept R; each test cleans up after itself.
 * Rows that record behaviour (no fixed expectation in the spec) print a "[record]" line and pass.
 */
public class BlueprintPhase2ApiTest {
    private DeskBlueprintApi api;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskBlueprintApi.get();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintPhase2ApiTest cleanup]\n" + api.cleanup());
    }

    private Response createAny(Map<String, Object> def, boolean active) {
        Response r = api.post("/modules/" + TICKETS + "/blueprints", Map.of("definition", def, "isActive", active));
        if (r.statusCode() / 100 == 2) api.createdBlueprints.add(r.jsonPath().getString("data.id"));
        return r;
    }

    private static boolean is4xx(Response r) {
        return r.statusCode() >= 400 && r.statusCode() < 500;
    }

    private static Map<String, Object> m(Object... kv) {
        Map<String, Object> x = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) x.put((String) kv[i], kv[i + 1]);
        return x;
    }

    /** Open -> Closed with the given extra on Open; criteria subject contains "QA BP <tag> ". */
    private static Map<String, Object> oneStep(String tag, Map<String, Object> openExtra) {
        return Bp.named(tag + " bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + tag + " "))
                .state("Open", openExtra).terminal("Closed").transition("end", "Open", "Closed").build();
    }

    // ---------------- C: designer rules on the server ----------------

    @Test(groups = {"regression"}, description = "Name data classes are stored as typed (XSS text, Arabic/emoji, trailing spaces, 300+ characters)")
    @CaseId({"BP-C3"})
    public void nameDataClasses() {
        String[] names = {QA + "C3 <img src=x onerror=alert(1)>", QA + "C3 مخطط اختبار 🚀", QA + "C3 spaced   ", QA + "C3 " + "x".repeat(300)};
        StringBuilder rec = new StringBuilder();
        for (String n : names) {
            Map<String, Object> d = oneStep("C3", Map.of());
            d.put("name", n);
            Response r = createAny(d, false);
            assertNotEquals(r.statusCode() / 100, 5, "500 on name " + n.length() + " chars");
            String stored = r.statusCode() / 100 == 2 ? r.jsonPath().getString("data.definition.name") : null;
            rec.append(n.length()).append(" chars -> ").append(r.statusCode()).append(stored == null ? "" : stored.equals(n) ? " stored as typed" : " stored as '" + stored + "'").append("; ");
            if (stored != null && n.length() < 100) assertEquals(stored, n, "name changed on save");
        }
        System.out.println("[record] C3 " + rec);
    }

    @Test(groups = {"regression"}, description = "Duplicate blueprint name in the same department: record allowed or refused")
    @CaseId({"BP-C4"})
    public void duplicateName() {
        Map<String, Object> d = oneStep("C4", Map.of());
        Response a = createAny(d, false), b = createAny(oneStep("C4", Map.of()), false);
        assertEquals(a.statusCode() / 100, 2);
        System.out.println("[record] C4 second blueprint with the same name -> " + b.statusCode() + (is4xx(b) ? " " + err(b) : " (allowed)"));
    }

    @Test(groups = {"regression"}, description = "A state no transition leads to is refused with a clear message")
    @CaseId({"BP-C14"})
    public void unreachableStateRefused() {
        Map<String, Object> d = Bp.named("C14 bp").state("Open").state("Escalated").terminal("Closed")
                .transition("end", "Open", "Closed").transition("esc", "Escalated", "Closed").build();
        Response r = createAny(d, false);
        assertTrue(is4xx(r), "unreachable state accepted: " + r.statusCode());
        assertTrue(r.asString().contains("unreachable"), "no clear message: " + err(r));
    }

    // ---------------- G: state editor rules on the server ----------------

    @Test(groups = {"regression", "BP-P2-1", "NDC-2761"}, description = "Server refuses a warning that is not before the time limit, and a warning without a limit")
    @CaseId({"BP-G3"})
    public void warningMustComeBeforeLimit() {
        Response eq = createAny(oneStep("G3", m("slaMinutes", 120, "slaPreExpiryMinutes", 120)), false);
        Response bigger = createAny(oneStep("G3", m("slaMinutes", 60, "slaPreExpiryMinutes", 120)), false);
        Response noLimit = createAny(oneStep("G3", m("slaPreExpiryMinutes", 60)), false);
        String got = "warn = limit -> " + eq.statusCode() + ", warn > limit -> " + bigger.statusCode() + ", warn without limit -> " + noLimit.statusCode();
        System.out.println("[G3] " + got);
        assertTrue(is4xx(eq) && is4xx(bigger) && is4xx(noLimit),
                "The designer says 'The warning must come before the time limit.', but the API saves these: " + got);
    }

    @Test(groups = {"regression", "BP-P2-2", "NDC-2762"}, description = "Time limit values: negative refused, fractions and text refused")
    @CaseId({"BP-G4"})
    public void limitValues() {
        StringBuilder rec = new StringBuilder();
        Map<Object, Integer> codes = new LinkedHashMap<>();
        for (Object v : new Object[]{0, -1, 3, 599940, 1.5, "abc"}) {
            Response r = createAny(oneStep("G4", m("slaMinutes", v)), false);
            codes.put(v, r.statusCode());
            rec.append(v).append(" -> ").append(r.statusCode()).append("; ");
            assertNotEquals(r.statusCode() / 100, 5, "500 for slaMinutes " + v);
        }
        System.out.println("[record] G4 slaMinutes " + rec);
        assertTrue(codes.get(1.5) >= 400 && codes.get("abc") >= 400, "fraction/text accepted: " + rec);
        assertTrue(codes.get(-1) >= 400, "A negative time limit (-1 minute) is saved: " + rec);
    }

    @Test(groups = {"regression", "BP-P2-3", "NDC-2763"}, description = "Automatic move: under 1 minute refused, transition with required items refused, transition from another state refused")
    @CaseId({"BP-G5"})
    public void autoMoveRules() {
        Response zero = createAny(oneStep("G5", m("autoTransitionId", "end", "autoTransitionAfterMinutes", 0)), false);
        Map<String, Object> mand = Bp.named("G5 bp").state("Open", m("autoTransitionId", "end", "autoTransitionAfterMinutes", 5)).terminal("Closed")
                .transition("end", "Open", "Closed", Map.of(), Map.of("checklist", List.of(Bp.checkItem("c1", true))), List.of()).build();
        Response mandR = createAny(mand, false);
        Map<String, Object> other = Bp.named("G5 bp").state("Open", m("autoTransitionId", "esc2", "autoTransitionAfterMinutes", 5)).state("Escalated").terminal("Closed")
                .transition("go", "Open", "Escalated").transition("esc2", "Escalated", "Closed").build();
        Response otherR = createAny(other, false);
        System.out.println("[G5] zero -> " + zero.statusCode() + ", mandatory items -> " + mandR.statusCode() + ", transition from another state -> " + otherR.statusCode());
        assertTrue(is4xx(zero), "0-minute automatic move accepted");
        assertTrue(is4xx(mandR), "automatic move to a transition with mandatory items accepted");
        assertTrue(is4xx(otherR), "The automatic move of state Open points at a transition that starts from Escalated, and the API saves it ("
                + otherR.statusCode() + "). Customer triggers with the same mistake are refused (G9).");
    }

    @Test(groups = {"regression"}, description = "Customer reply / rating triggers: valid saved; from another state or on an exit state refused")
    @CaseId({"BP-G9"})
    public void customerTriggerRules() {
        Map<String, Object> wrong = Bp.named("G9 bp").state("Open", m("onReplyTransitionId", "esc2")).state("Escalated").terminal("Closed")
                .transition("go", "Open", "Escalated").transition("esc2", "Escalated", "Closed").build();
        Map<String, Object> exit = Bp.named("G9 bp").state("Open").state("Closed", m("isTerminal", true, "onReplyTransitionId", "end"))
                .transition("end", "Open", "Closed").build();
        Map<String, Object> good = Bp.named("G9 bp").state("Open", m("onReplyTransitionId", "go", "onRatingTransitionId", "go")).state("Escalated").terminal("Closed")
                .transition("go", "Open", "Escalated").transition("end", "Escalated", "Closed").build();
        assertTrue(is4xx(createAny(wrong, false)), "reply trigger from another state accepted");
        assertTrue(is4xx(createAny(exit, false)), "reply trigger on an exit state accepted");
        Response ok = createAny(good, false);
        assertEquals(ok.statusCode(), 201, err(ok));
        assertEquals(ok.jsonPath().getString("data.definition.states[0].onReplyTransitionId"), "go");
        assertEquals(ok.jsonPath().getString("data.definition.states[0].onRatingTransitionId"), "go");
    }

    // ---------------- D9 / D10: transition criteria ----------------

    @Test(groups = {"regression"}, description = "Transition criteria: button only on matching tickets; running it by API on a non-matching ticket is refused")
    @CaseId({"BP-D9", "BP-D10"})
    public void transitionCriteria() {
        Map<String, Object> d = Bp.named("D9 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "D9 "))
                .state("Open").state("Escalated").terminal("Closed")
                .transition("hi", "Open", "Escalated", Map.of("visibilityCriteria", Bp.criteria("eq", "priority", "high")), Map.of(), List.of())
                .transition("any", "Open", "Closed").build();
        api.createOk(d, true);
        String low = api.ticketOk(QA + "D9 low", Map.of("priority", "low"));
        String high = api.ticketOk(QA + "D9 high", Map.of("priority", "high"));
        assertNotNull(api.waitState(low, 20000));
        assertNotNull(api.waitState(high, 20000));
        assertFalse(api.transitionNames(low).contains("QA hi"), "hidden transition offered on a low ticket");
        assertTrue(api.transitionNames(high).contains("QA hi"), "transition missing on the matching ticket");
        Response r = api.run(low, "hi", "Open", null);
        assertTrue(is4xx(r), "hidden transition ran by API: " + r.statusCode());
        assertEquals(api.stateOf(low).get("activeStates").toString(), "[Open]");
    }

    // ---------------- E: transition form ----------------

    @Test(groups = {"regression"}, description = "Required fields of several types: missing and invalid refused with field messages; valid values saved")
    @CaseId({"BP-E7"})
    public void requiredFieldTypes() {
        List<Map<String, Object>> req = List.of(Bp.requiredField("priority", "pick_list"), Bp.requiredField("due_date", "date_time"),
                Bp.requiredField("skills", "multi_select"), Bp.requiredField("description", "multi_line"));
        Map<String, Object> d = Bp.named("E7 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "E7 "))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed", Map.of(), Map.of("requiredFields", req), List.of()).build();
        api.createOk(d, true);
        Map<String, Object> notFillable = Bp.named("E7 bp2").state("Open").terminal("Closed")
                .transition("end", "Open", "Closed", Map.of(), Map.of("requiredFields", List.of(Bp.requiredField("is_spam", "checkbox"))), List.of()).build();
        assertTrue(is4xx(createAny(notFillable, false)), "a field that cannot be filled in a transition (is_spam) was accepted");
        String t1 = api.ticketOk(QA + "E7 bad"), t2 = api.ticketOk(QA + "E7 good");
        assertNotNull(api.waitState(t1, 20000));
        assertNotNull(api.waitState(t2, 20000));
        Response missing = api.run(t1, "end", "Open", Map.of("fields", Map.of("priority", "high")));
        assertTrue(is4xx(missing) && missing.asString().contains("due_date"), "missing fields: " + err(missing));
        Response bad = api.run(t1, "end", "Open", Map.of("fields", Map.of("priority", "nonsense", "due_date", "not-a-date", "skills", "x", "description", "QA")));
        assertTrue(is4xx(bad), "invalid values accepted");
        System.out.println("[record] E7 invalid values -> " + err(bad));
        assertEquals(api.stateOf(t1).get("activeStates").toString(), "[Open]");
        Response good = api.run(t2, "end", "Open", Map.of("fields", Map.of("priority", "high", "due_date", "2026-12-01T10:00:00Z", "skills", List.of(), "description", "QA BP E7 desc")));
        assertEquals(good.statusCode(), 200, err(good));
        Map<String, Object> f = api.fields(t2);
        assertEquals(f.get("priority"), "high");
        assertEquals(f.get("description"), "QA BP E7 desc");
        System.out.println("[record] E7 required multi-select accepted an empty list: skills=[] -> " + good.statusCode());
    }

    @Test(groups = {"regression"}, description = "Optional checklist and comment: the run works without them")
    @CaseId({"BP-E11"})
    public void optionalItems() {
        Map<String, Object> d = Bp.named("E11 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "E11 "))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed", Map.of(),
                        Map.of("deskItems", List.of(Bp.deskItem("comment", false)), "checklist", List.of(Bp.checkItem("o1", false))), List.of()).build();
        api.createOk(d, true);
        String t = api.ticketOk(QA + "E11 t");
        assertNotNull(api.waitState(t, 20000));
        Response r = api.run(t, "end", "Open", null);
        assertEquals(r.statusCode(), 200, err(r));
    }

    @Test(groups = {"regression"}, description = "Script text in the comment and resolution of a run is stored as text (rendering checked in the UI run)")
    @CaseId({"BP-E13"})
    public void formDataClasses() {
        Map<String, Object> d = Bp.named("E13 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "E13 "))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed", Map.of(),
                        Map.of("deskItems", List.of(Bp.deskItem("comment", true), Bp.deskItem("resolution", true))), List.of()).build();
        api.createOk(d, true);
        String t = api.ticketOk(QA + "E13 t");
        assertNotNull(api.waitState(t, 20000));
        String pay = "<script>alert(1)</script> QA BP E13 مرحبا 🚀";
        Response r = api.run(t, "end", "Open", Map.of("comment", Map.of("content", pay, "is_public", false), "resolution", Map.of("content", pay, "notify_contact", false)));
        assertEquals(r.statusCode(), 200, err(r));
        String comments = ok(api.get("/desk/tickets/" + t + "/comments"), "comments").asString();
        assertTrue(comments.contains("QA BP E13"), "comment not saved");
        System.out.println("[record] E13 comment body_html stored raw: " + comments.contains("<script>") + "; resolution: " + api.fields(t).get("resolution"));
    }

    // ---------------- F: after-actions ----------------

    @Test(groups = {"regression"}, description = "After-actions run in order (last field update wins), task created and linked with {{subject}} replaced, notification and email logged")
    @CaseId({"BP-F8", "BP-F4", "BP-F10", "BP-F3", "BP-F6"})
    public void afterActions() {
        String mark = QA + "F " + System.currentTimeMillis();
        List<Map<String, Object>> after = List.of(Bp.setField("description", "F8-one"), Bp.setField("description", "F8-two"), Bp.setField("description", "F8-three"),
                m("kind", "sendNotification", "title", mark + " notif {{subject}}", "body", "QA body {{subject}}", "notifyOwner", true),
                m("kind", "createTask", "targetModuleKey", "desk_tasks", "fields", m("subject", mark + " task {{subject}}", "status", "In Progress", "priority", "normal", "due_date", "2026-11-05T10:00", "category", "email")),
                m("kind", "deskEmail", "templateId", "3218ebe9-2d1d-4692-8729-fd52bbf12592", "owner", true, "contact", false, "teamIds", List.of(), "userIds", List.of(), "roleTreeIds", List.of()));
        Map<String, Object> d = Bp.named("F bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "F "))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed", Map.of(), Map.of(), after).build();
        api.createOk(d, true);
        String t = api.ticketOk(QA + "F ticket");
        assertNotNull(api.waitState(t, 20000));
        assertEquals(api.run(t, "end", "Open", null).statusCode(), 200);
        DeskBlueprintApi.sleep(8000);
        assertEquals(api.fields(t).get("description"), "F8-three", "after-actions did not run in order");
        List<Map<String, Object>> tasks = api.tasksWith(mark);
        assertEquals(tasks.size(), 1, "createTask did not create exactly one task");
        String task = String.valueOf(tasks.get(0).get("data"));
        assertTrue(task.contains(TICKETS + ":" + t), "task not linked to the ticket: " + task);
        assertTrue(task.contains(mark + " task " + QA + "F ticket"), "{{subject}} not replaced: " + task);
        String hist = api.history(t).toString();
        System.out.println("[record] F3/F6 history actions: " + hist.replaceAll(".*?action=([a-z._]+).*?(?=action=|$)", "$1 "));
        throw new SkipException("F8, F4, F10 pass. F3 (notification to the owner) and F6 (email to the owner) are INCONCLUSIVE: the owner account is both "
                + "the actor and the ticket owner, so a self-notification may be suppressed and the email lands in a mailbox we cannot read - needs a second agent.");
    }

    // ---------------- F9 / L: workflow, department ----------------

    @Test(groups = {"regression"}, description = "A workflow rule On Edit runs after a transition (with and without required fields) [reg NDC-2420]")
    @CaseId({"BP-F9"})
    public void workflowAfterTransition() {
        api.workflowRuleOk(QA + "F9 rule", "RecordUpdated", QA + "F9 ", Map.of("description", "F9-workflow-ran"));
        Map<String, Object> d = Bp.named("F9 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "F9 "))
                .state("Open").state("Escalated").terminal("Closed").transition("plain", "Open", "Escalated")
                .transition("req", "Escalated", "Closed", Map.of(), Map.of("requiredFields", List.of(Bp.requiredField("priority", "pick_list"))), List.of()).build();
        api.createOk(d, true);
        String a = api.ticketOk(QA + "F9 plain"), b = api.ticketOk(QA + "F9 required");
        assertNotNull(api.waitState(a, 20000));
        assertNotNull(api.waitState(b, 20000));
        assertEquals(api.run(a, "plain", "Open", null).statusCode(), 200);
        assertEquals(api.run(b, "plain", "Open", null).statusCode(), 200);
        DeskBlueprintApi.sleep(8000);
        assertEquals(api.fields(a).get("description"), "F9-workflow-ran", "On Edit rule did not run after a transition without required fields");
        api.patchTicket(b, "description", "reset"); // the rule fires on this edit too; reset again only through the transition below
        DeskBlueprintApi.sleep(5000);
        Response r = api.run(b, "req", "Escalated", Map.of("fields", Map.of("priority", "high")));
        assertEquals(r.statusCode(), 200, err(r));
        DeskBlueprintApi.sleep(8000);
        String execs = ok(api.get("/workflow/executions?recordId=" + b), "executions").asString();
        int fired = execs.split("\"outcome\":\"Fired\"", -1).length - 1;
        System.out.println("[F9] executions Fired on the required-field ticket: " + fired);
        assertTrue(fired >= 3, "On Edit rule did not fire after the transition with a required field (Fired=" + fired + ", expected create-time none + plain + manual edit + required)");
    }

    @Test(groups = {"regression"}, description = "A workflow On Create that sets the field the entry criteria use runs before the blueprint picks the ticket")
    @CaseId({"BP-L1"})
    public void workflowOnCreateBeforeEntry() {
        api.workflowRuleOk(QA + "L1 rule", "RecordCreated", QA + "L1 ", Map.of("priority", "high"));
        Map<String, Object> d = Bp.named("L1 bp").set("entryCriteria", Bp.criteria("eq", "priority", "high"))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed").build();
        api.createOk(d, true);
        String t = api.ticketOk(QA + "L1 t", Map.of("priority", "low"));
        DeskBlueprintApi.sleep(8000);
        assertEquals(api.fields(t).get("priority"), "high", "workflow did not set priority");
        assertNotNull(api.waitState(t, 15000), "ticket did not enter: the blueprint was evaluated before the workflow (Zoho runs workflow first)");
    }

    @Test(groups = {"regression", "BP-P2-4", "NDC-2764"}, description = "A workflow Field Update of Status cannot move a ticket that a blueprint controls [reg NDC-2730]")
    @CaseId({"BP-L3"})
    public void workflowCannotSetStatus() {
        api.workflowRuleOk(QA + "L3 rule", "RecordUpdated", QA + "L3 ", Map.of("status", "Closed", "description", "L3-rule-ran"));
        Map<String, Object> d = Bp.named("L3 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "L3 "))
                .state("Open").state("Escalated").terminal("Closed").transition("go", "Open", "Escalated").transition("end", "Escalated", "Closed").build();
        api.createOk(d, true);
        String t = api.ticketOk(QA + "L3 t");
        assertNotNull(api.waitState(t, 20000));
        assertTrue(is4xx(api.patchTicket(t, "status", "Closed")), "control: API PATCH of status should be refused (TICKET_IN_BLUEPRINT)");
        assertEquals(api.run(t, "go", "Open", null).statusCode(), 200);
        DeskBlueprintApi.sleep(10000);
        Map<String, Object> f = api.fields(t);
        Map<String, Object> s = api.stateOf(t);
        assertEquals(f.get("description"), "L3-rule-ran", "control: the rule did not run, so the row is inconclusive");
        assertTrue("Escalated".equals(f.get("status")) && s != null,
                "A workflow rule changed Status to " + f.get("status") + " on a ticket in a blueprint (state Escalated) and the ticket "
                        + (s == null ? "left the blueprint" : "stayed in " + s.get("activeStates")) + ". A direct status change by API is refused for the same ticket.");
    }

    @Test(groups = {"regression"}, description = "Moving a ticket in a blueprint to another department: record (Zoho refuses)")
    @CaseId({"BP-L7"})
    public void departmentMove() {
        api.createOk(Bp.named("L7 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "L7 "))
                .state("Open").terminal("Closed").transition("end", "Open", "Closed").build(), true);
        String t = api.ticketOk(QA + "L7 t", Map.of("priority", "low"));
        assertNotNull(api.waitState(t, 20000));
        assertTrue(is4xx(api.patchTicket(t, "department", OTHER_DEPT)), "control: department edit by record PATCH is refused (OWNERSHIP_MANAGED_BY_DESK)");
        Response r = api.moveTicket(t, OTHER_DEPT);
        DeskBlueprintApi.sleep(4000);
        Map<String, Object> s = api.stateOf(t);
        Map<String, Object> f = api.fields(t);
        System.out.println("[record] L7 move -> " + r.statusCode() + ", department=" + (OTHER_DEPT.equals(f.get("department")) ? "DAR Review" : f.get("department"))
                + ", in blueprint=" + (s != null) + ", status=" + f.get("status") + " (Zoho refuses the move while a blueprint runs)");
        assertTrue(r.statusCode() / 100 == 2 ? s == null : s != null, "inconsistent: moved but still in a blueprint of another department");
    }

    // ---------------- K14-K17: department SLA with a blueprint ----------------

    @Test(groups = {"regression"}, description = "Department SLA pauses in a blueprint state on an On Hold status, resumes after; reapply keeps the blueprint state; state timer recorded")
    @CaseId({"BP-K14", "BP-K15", "BP-K17"})
    public void departmentSlaInOnHold() {
        api.slaPolicyOk(QA + "K14 SLA", QA + "K14", 2, 8);
        Map<String, Object> hold = m("slaClock", "calendar", "slaMinutes", 60);
        api.createOk(Bp.named("K14 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "K14 "))
                .state("Open").state("On Hold", hold).terminal("Closed").transition("hold", "Open", "On Hold").transition("back", "On Hold", "Open")
                .transition("end", "Open", "Closed").build(), true);
        String t = api.ticketOk(QA + "K14 t");
        assertNotNull(api.waitState(t, 20000));
        DeskBlueprintApi.sleep(3000);
        assertEquals(api.run(t, "hold", "Open", null).statusCode(), 200);
        DeskBlueprintApi.sleep(5000);
        Response sla = ok(api.sla(t), "sla");
        assertEquals(sla.jsonPath().getString("data.state"), "applied", "QA SLA policy not applied - inconclusive");
        List<String> obligationStates = sla.jsonPath().getList("data.obligations.state");
        System.out.println("[K14] obligations in On Hold: " + sla.jsonPath().getList("data.obligations.kind") + " " + obligationStates);
        assertTrue(obligationStates.stream().allMatch(x -> x.equals("paused")), "department SLA not paused in On Hold: " + obligationStates);
        Map<String, Object> st = api.stateOf(t);
        System.out.println("[record] K15 state timer in On Hold keeps running: due " + st.get("escalation_due_at") + ", entered " + st.get("enteredAt"));
        ok(api.post("/desk/tickets/" + t + "/sla/reapply", Map.of()), "reapply");
        DeskBlueprintApi.sleep(3000);
        Map<String, Object> st2 = api.stateOf(t);
        assertEquals(st2.get("activeStates").toString(), "[On Hold]", "reapply moved the blueprint state");
        assertEquals(st2.get("enteredAt"), st.get("enteredAt"), "reapply restarted the blueprint state");
        assertEquals(api.run(t, "back", "On Hold", null).statusCode(), 200);
        DeskBlueprintApi.sleep(5000);
        List<String> after = ok(api.sla(t), "sla").jsonPath().getList("data.obligations.state");
        assertTrue(after.contains("running"), "department SLA did not resume after leaving On Hold: " + after);
    }

    // ---------------- N: security and size ----------------

    @Test(groups = {"regression"}, description = "Type confusion and unknown kinds in the definition answer 4xx with a message, never 500")
    @CaseId({"BP-N2"})
    public void typeConfusion() {
        List<String> fivehundreds = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Map<String, Object> d = oneStep("N2", Map.of());
            List<Map<String, Object>> trs = (List<Map<String, Object>>) d.get("transitions");
            List<Map<String, Object>> sts = (List<Map<String, Object>>) d.get("states");
            switch (i) {
                case 0 -> d.put("states", Map.of("Open", Map.of()));
                case 1 -> trs.get(0).put("fromStateId", 12345);
                case 2 -> trs.get(0).put("after", Map.of("actions", List.of(Map.of("kind", "noSuchAction"))));
                case 3 -> trs.get(0).put("during", Map.of("deskItems", List.of(Map.of("kind", "teleport", "mandatory", true))));
                case 4 -> sts.get(0).put("slaMinutes", Map.of("a", 1));
                case 5 -> { List<Map<String, Object>> many = new ArrayList<>(); for (int k = 0; k < 400; k++) many.add(Map.of("id", "S" + k, "name", "S" + k)); d.put("states", many); }
                default -> d.put("departmentId", "00000000-0000-0000-0000-000000000000");
            }
            Response r = createAny(d, false);
            if (r.statusCode() / 100 == 5) fivehundreds.add("case " + i + " -> " + r.statusCode());
            assertTrue(is4xx(r), "case " + i + " accepted: " + r.statusCode());
        }
        assertTrue(fivehundreds.isEmpty(), fivehundreds.toString());
    }

    @Test(groups = {"regression"}, description = "Random blueprint / ticket ids give 404; an unknown transition gives 4xx")
    @CaseId({"BP-N4"})
    public void enumeration() {
        assertEquals(api.blueprint(UUID.randomUUID().toString()).statusCode(), 404);
        assertEquals(api.state(UUID.randomUUID().toString()).statusCode(), 404);
        assertEquals(api.run(UUID.randomUUID().toString(), "end", "Open", null).statusCode(), 404);
        api.createOk(oneStep("N4", Map.of()), true);
        String t = api.ticketOk(QA + "N4 t");
        assertNotNull(api.waitState(t, 20000));
        assertTrue(is4xx(api.run(t, "no-such-transition", "Open", null)));
    }

    @Test(groups = {"regression", "perf"}, description = "Include and revoke 25 tickets: counts right, each call under 10 s (records the times)")
    @CaseId({"BP-N9"})
    public void manyTickets() {
        String id = api.createOk(Bp.named("N9 bp").set("entryCriteria", Bp.criteria("contains", "subject", QA + "N9-NEVER "))
                .state("Open").state("Escalated").terminal("Closed").transition("go", "Open", "Escalated").transition("end", "Escalated", "Closed").build(), true);
        List<String> ids = new ArrayList<>();
        for (int i = 0; i < 25; i++) ids.add(api.ticketOk(QA + "N9 t" + i));
        long t0 = System.currentTimeMillis();
        Response inc = ok(api.include(id, "Escalated", ids), "include");
        long incMs = System.currentTimeMillis() - t0;
        int count = ((Number) api.listData().stream().filter(b -> id.equals(b.get("id"))).findFirst().orElseThrow().get("in_progress_count")).intValue();
        long t1 = System.currentTimeMillis();
        Response rev = ok(api.revokeAll(id), "revoke");
        long revMs = System.currentTimeMillis() - t1;
        System.out.println("[record] N9 include 25 -> included " + inc.jsonPath().getInt("data.included") + " in " + incMs + " ms, in progress " + count
                + "; revoke -> " + rev.jsonPath().getInt("data.revoked") + " in " + revMs + " ms");
        assertEquals(inc.jsonPath().getInt("data.included"), 25);
        assertEquals(count, 25);
        assertEquals(rev.jsonPath().getInt("data.revoked"), 25);
        assertTrue(incMs < 10000 && revMs < 10000, "slow: include " + incMs + " ms, revoke " + revMs + " ms");
    }
}
