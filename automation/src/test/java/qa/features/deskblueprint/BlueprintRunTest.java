package qa.features.deskblueprint;

import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.testng.Assert.*;
import static qa.features.deskblueprint.Bp.*;
import static qa.features.deskblueprint.DeskBlueprintApi.err;
import static qa.features.deskblueprint.DeskBlueprintApi.ok;

/**
 * Spec groups I (entry), J (running transitions), E (during items), F (after actions) and M (history) through the API,
 * on one QA blueprint in "QA WF Dept R". Serial: one blueprint, tickets created per test, everything deleted afterClass.
 */
public class BlueprintRunTest {
    private DeskBlueprintApi api;
    private String bpId;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskBlueprintApi.get();
        Map<String, Object> def = Bp.named("Run main")
                .state("Open").state("Escalated").state("On Hold").terminal("Closed")
                .transition("plain", "Open", "Escalated")
                .transition("items", "Escalated", "On Hold", Map.of(),
                        Map.of("checklist", List.of(checkItem("c1", true), checkItem("c2", false)),
                                "deskItems", List.of(deskItem("comment", true)),
                                "requiredFields", List.of(requiredField("priority", "pick_list"))),
                        List.of())
                .transition("resolve", "On Hold", "Closed", Map.of(),
                        Map.of("deskItems", List.of(deskItem("resolution", true))),
                        List.of(setField("description", "QA after action ran")))
                .transition("cancel", "Open", "Closed").common()
                .build();
        bpId = api.createOk(def, true);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintRunTest cleanup]\n" + api.cleanup());
    }

    private String ticketInBlueprint(String subject) {
        String id = api.ticketOk(subject);
        Map<String, Object> s = api.waitState(id, 20000);
        assertNotNull(s, "ticket " + subject + " did not enter any blueprint within 20 s");
        assertEquals(s.get("blueprintDefinitionId"), bpId, "entered another blueprint: " + s.get("blueprintName"));
        return id;
    }

    @SuppressWarnings("unchecked")
    private static List<String> active(Map<String, Object> s) {
        return (List<String>) s.get("activeStates");
    }

    @Test(groups = {"regression"}, description = "A new ticket matching the criteria enters at the start state; history says so")
    @CaseId({"BP-I1", "BP-M1"})
    public void entersOnCreate() {
        String id = ticketInBlueprint("QA BP I1 enters");
        assertEquals(active(api.stateOf(id)), List.of("Open"));
        assertTrue(api.history(id).stream().anyMatch(h -> "ticket.blueprint_entered".equals(h.get("action"))), "no ticket.blueprint_entered in history");
    }

    @Test(groups = {"regression"}, description = "A ticket that does not match the criteria does not enter the QA blueprint")
    @CaseId("BP-I2")
    public void criteriaNotMet() {
        String control = ticketInBlueprint("QA BP I2 control"); // proves entry works right now
        assertNotNull(control);
        String id = api.ticketNoPrefixOk("Probe QA I2 no prefix");
        DeskBlueprintApi.sleep(6000);
        Map<String, Object> s = api.stateOf(id);
        assertTrue(s == null || !bpId.equals(s.get("blueprintDefinitionId")), "non-matching ticket entered the QA blueprint");
    }

    @Test(groups = {"regression"}, description = "Run a transition with nothing to fill in: status moves, history records the run")
    @CaseId({"BP-J2", "BP-M1"})
    public void runPlainTransition() {
        String id = ticketInBlueprint("QA BP J2 plain");
        Response r = api.run(id, "plain", "Open", null);
        assertEquals(r.statusCode(), 200, err(r));
        assertEquals(r.jsonPath().getString("data.to_state"), "Escalated");
        assertEquals(api.fields(id).get("status"), "Escalated");
        assertEquals(active(api.stateOf(id)), List.of("Escalated"));
        List<Map<String, Object>> h = api.history(id);
        assertTrue(h.stream().anyMatch(x -> "ticket.blueprint_transition".equals(x.get("action"))), "no ticket.blueprint_transition in history");
        assertTrue(h.stream().anyMatch(x -> "ticket.status_changed".equals(x.get("action")) && "blueprint".equals(x.get("source"))),
                "status change not marked source=blueprint");
    }

    @Test(groups = {"regression"}, description = "Required checklist, comment and field are enforced; nothing moves when they are missing")
    @CaseId({"BP-J3", "BP-E3", "BP-E6", "BP-E8"})
    public void requiredItemsEnforced() {
        String id = ticketInBlueprint("QA BP J3 items");
        ok(api.run(id, "plain", "Open", null), "plain");
        Response bad = api.run(id, "items", "Escalated", null);
        assertEquals(bad.statusCode(), 422, "missing required items should be refused: " + bad.asString());
        String body = bad.asString();
        assertTrue(body.contains("c1"), "no error for the mandatory checklist item: " + body);
        assertFalse(body.contains("\"__checklist.c2\""), "optional checklist item reported as required: " + body);
        assertTrue(body.toLowerCase().contains("comment"), "no error for the mandatory comment: " + body);
        assertTrue(body.contains("priority"), "no error for the required field: " + body);
        assertEquals(api.fields(id).get("status"), "Escalated", "ticket moved although the run was refused");

        Response good = api.run(id, "items", "Escalated", Map.of(
                "checklist", Map.of("c1", true),
                "comment", Map.of("content", "QA comment from transition", "is_public", false),
                "fields", Map.of("priority", "high")));
        assertEquals(good.statusCode(), 200, err(good));
        assertNotNull(good.jsonPath().getString("data.comment_id"), "comment not saved");
        Map<String, Object> f = api.fields(id);
        assertEquals(f.get("status"), "On Hold");
        assertEquals(String.valueOf(f.get("priority")).toLowerCase(), "high", "required field value not saved");
    }

    @Test(groups = {"regression"}, description = "A run that names an old state is refused and nothing changes")
    @CaseId("BP-J7")
    public void staleRunRefused() {
        String id = ticketInBlueprint("QA BP J7 stale");
        ok(api.run(id, "plain", "Open", null), "plain");
        Response again = api.run(id, "plain", "Open", null);
        assertTrue(again.statusCode() >= 400 && again.statusCode() < 500, "second run from a state the ticket left was accepted: " + again.statusCode());
        assertEquals(api.fields(id).get("status"), "Escalated");
    }

    @Test(groups = {"regression"}, description = "Sending the same run twice (same run_id) moves the ticket and runs after-actions only once")
    @CaseId({"BP-J8", "BP-H5"})
    public void sameRunIdOnce() {
        String id = ticketInBlueprint("QA BP J8 twice");
        ok(api.run(id, "plain", "Open", null), "plain");
        ok(api.run(id, "items", "Escalated", Map.of("checklist", Map.of("c1", true),
                "comment", Map.of("content", "QA", "is_public", false), "fields", Map.of("priority", "high"))), "items");
        Map<String, Object> body = DeskBlueprintApi.runBody("On Hold", Map.of("resolution", Map.of("content", "QA resolved", "notify_contact", false)));
        Response r1 = api.runRaw(id, "resolve", body);
        Response r2 = api.runRaw(id, "resolve", body);
        assertEquals(r1.statusCode(), 200, err(r1));
        assertTrue(r2.statusCode() == 200 || r2.statusCode() == 409, "replay of the same run_id: " + r2.statusCode() + " " + r2.asString());
        long transitions = api.history(id).stream().filter(h -> "ticket.blueprint_transition".equals(h.get("action"))).count();
        assertEquals(transitions, 3, "expected exactly 3 transition entries (plain, items, resolve)");
    }

    @Test(groups = {"regression"}, description = "Resolution required, then the ticket reaches the final state; the after-action field update runs")
    @CaseId({"BP-E5", "BP-F1", "BP-I13"})
    public void resolveCompletesBlueprint() {
        String id = ticketInBlueprint("QA BP E5 resolve");
        ok(api.run(id, "plain", "Open", null), "plain");
        ok(api.run(id, "items", "Escalated", Map.of("checklist", Map.of("c1", true),
                "comment", Map.of("content", "QA", "is_public", false), "fields", Map.of("priority", "high"))), "items");
        Response noRes = api.run(id, "resolve", "On Hold", null);
        assertEquals(noRes.statusCode(), 422, "resolution is mandatory: " + noRes.asString());
        Response r = api.run(id, "resolve", "On Hold", Map.of("resolution", Map.of("content", "QA resolved", "notify_contact", false)));
        assertEquals(r.statusCode(), 200, err(r));
        assertEquals(r.jsonPath().getBoolean("data.resolution_set"), Boolean.TRUE, "resolution not set");
        Map<String, Object> f = api.fields(id);
        assertEquals(f.get("status"), "Closed");
        String desc = waitField(id, "description", "QA after action ran", 30000);
        assertEquals(desc, "QA after action ran", "after-action field update did not run");
        Map<String, Object> s = api.stateOf(id);
        assertTrue(s == null || Boolean.TRUE.equals(s.get("isTerminal")), "blueprint not completed at the final state: " + s);
    }

    private String waitField(String id, String field, String want, long maxMs) {
        long end = System.currentTimeMillis() + maxMs;
        String got;
        do {
            got = String.valueOf(api.fields(id).get(field));
            if (want.equals(got)) return got;
            DeskBlueprintApi.sleep(2000);
        } while (System.currentTimeMillis() < end);
        return got;
    }

    @Test(groups = {"regression"}, description = "A common transition can be run from the start state")
    @CaseId({"BP-J13", "BP-C17"})
    public void commonTransition() {
        String id = ticketInBlueprint("QA BP J13 common");
        Response r = api.run(id, "cancel", "Open", null);
        assertEquals(r.statusCode(), 200, err(r));
        assertEquals(api.fields(id).get("status"), "Closed");
    }

    @Test(groups = {"regression"}, description = "Status cannot be changed outside the blueprint (API); after revoke it can")
    @CaseId({"BP-J4", "BP-L4", "BP-I10"})
    public void statusLockedUntilRevoked() {
        String id = ticketInBlueprint("QA BP J4 locked");
        Response p = api.patchTicket(id, "status", "Closed");
        assertTrue(p.statusCode() >= 400 && p.statusCode() < 500, "status changed outside the blueprint: " + p.statusCode());
        assertEquals(api.fields(id).get("status"), "Open");
        Response rv = api.revokeTicket(id);
        assertEquals(rv.statusCode(), 200, err(rv));
        assertNull(api.stateOf(id), "still in a blueprint after revoke");
        assertEquals(api.fields(id).get("status"), "Open", "revoke changed the status");
        boolean revokedLogged = false; // the history line is written a moment after the revoke call returns
        for (long end = System.currentTimeMillis() + 10000; !revokedLogged && System.currentTimeMillis() < end; ) {
            revokedLogged = api.history(id).stream().anyMatch(h -> "ticket.blueprint_revoked".equals(h.get("action")));
            if (!revokedLogged) try { Thread.sleep(1000); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        }
        assertTrue(revokedLogged, "no ticket.blueprint_revoked in history within 10 s");
        Response p2 = api.patchTicket(id, "status", "Escalated");
        assertEquals(p2.statusCode() / 100, 2, "status still locked after revoke: " + p2.asString());
    }

    @Test(groups = {"regression"}, description = "An unknown transition id and a transition from another state are refused")
    @CaseId("BP-J9b")
    public void wrongTransitionRefused() {
        String id = ticketInBlueprint("QA BP J wrong");
        Response unknown = api.run(id, "does-not-exist", "Open", null);
        assertTrue(unknown.statusCode() >= 400 && unknown.statusCode() < 500, "unknown transition: " + unknown.statusCode());
        Response notFromHere = api.run(id, "resolve", "Open", Map.of("resolution", Map.of("content", "QA", "notify_contact", false)));
        assertTrue(notFromHere.statusCode() >= 400 && notFromHere.statusCode() < 500, "transition from another state accepted: " + notFromHere.statusCode());
        assertEquals(api.fields(id).get("status"), "Open");
    }

    @Test(groups = {"regression"}, description = "A run without run_id is refused with a clear message")
    @CaseId("BP-N2a")
    public void runIdRequired() {
        String id = ticketInBlueprint("QA BP N2 runid");
        Map<String, Object> b = new java.util.HashMap<>(DeskBlueprintApi.runBody("Open", null));
        b.remove("run_id");
        Response r = api.runRaw(id, "plain", b);
        assertEquals(r.statusCode(), 400, r.asString());
        assertTrue(r.asString().contains("run_id"), r.asString());
        Response bad = api.runRaw(id, "plain", Map.of("run_id", UUID.randomUUID().toString(), "expected_state_id", 123, "checklist", "x"));
        assertTrue(bad.statusCode() >= 400 && bad.statusCode() < 500, "type-confused body gave " + bad.statusCode() + " " + bad.asString());
    }
}
