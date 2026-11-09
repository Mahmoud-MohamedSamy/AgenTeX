package qa.features.deskblueprint;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskblueprint.DeskBlueprintApi.err;
import static qa.features.deskblueprint.DeskBlueprintApi.ok;
import static qa.features.deskblueprint.DeskBlueprintFeature.*;

/**
 * Spec groups A (API access), B/C (server-side checks), H (draft, publish, versions), I (membership) and N2 (bad bodies).
 * Serial; every blueprint is "QA BP …" in QA WF Dept R, deleted afterClass.
 */
public class BlueprintAdminTest {
    private DeskBlueprintApi api;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskBlueprintApi.get();
    }

    /** Each test cleans up its own blueprints and tickets, so active QA blueprints never catch another test's tickets. */
    @org.testng.annotations.AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintAdminTest cleanup]\n" + api.cleanup());
    }

    private static Bp simple(String name) {
        return Bp.named(name).state("Open").state("Escalated").terminal("Closed")
                .transition("go", "Open", "Escalated").transition("end", "Escalated", "Closed");
    }

    /** POST that tracks the id if the server created it anyway (negative rows). */
    private Response createAny(Map<String, Object> def) {
        Response r = api.post("/modules/" + TICKETS + "/blueprints", Map.of("definition", def, "isActive", false));
        if (r.statusCode() / 100 == 2) api.createdBlueprints.add(r.jsonPath().getString("data.id"));
        return r;
    }

    private static boolean is4xx(Response r) {
        return r.statusCode() >= 400 && r.statusCode() < 500;
    }

    // ---------------- A: access ----------------

    @Test(groups = {"regression"}, description = "No token: list, one blueprint and a run are refused with 401")
    @CaseId({"BP-A10", "BP-A3"})
    public void noTokenRefused() {
        assertEquals(DeskBlueprintApi.anonymous().get("/modules/" + TICKETS + "/blueprints").statusCode(), 401);
        assertEquals(DeskBlueprintApi.anonymous().body(Map.of()).post("/desk/tickets/00000000-0000-0000-0000-000000000000/blueprint-transitions/x").statusCode(), 401);
    }

    @Test(groups = {"regression"}, description = "Owner token sent with another tenant id never returns another tenant's blueprints")
    @CaseId("BP-A9")
    public void otherTenantHeader() {
        java.util.Set<String> own = new java.util.HashSet<>();
        for (Map<String, Object> b : api.listData()) own.add(String.valueOf(b.get("id")));
        Response r = api.req().header("x-tenant-id", "a7a7a7a7-0000-0000-0000-000000000001").get("/modules/" + TICKETS + "/blueprints?includeInactive=true");
        if (r.statusCode() != 200) return; // refused: fine
        List<String> ids = r.jsonPath().getList("data.id");
        for (String id : ids == null ? List.<String>of() : ids)
            assertTrue(own.contains(id), "header tenant switch returned a blueprint that is not in the token's own tenant: " + id);
    }

    // ---------------- C / N2: server-side checks ----------------

    @Test(groups = {"regression"}, description = "Server refuses a blueprint with no name")
    @CaseId("BP-C2")
    public void nameRequired() {
        Map<String, Object> def = simple("tmp").build();
        def.put("name", "");
        Response r = createAny(def);
        assertTrue(is4xx(r), "empty name accepted: " + r.statusCode());
    }

    @Test(groups = {"regression"}, description = "Server refuses the same state twice")
    @CaseId("BP-C13")
    public void duplicateStateRefused() {
        Map<String, Object> def = Bp.named("C13 dup").state("Open").state("Open").terminal("Closed").transition("go", "Open", "Closed").build();
        Response r = createAny(def);
        assertTrue(is4xx(r), "duplicate state accepted: " + r.statusCode());
    }

    @Test(groups = {"regression"}, description = "Server refuses a transition to a state that is not on the canvas")
    @CaseId("BP-C15")
    public void unknownTargetRefused() {
        Map<String, Object> def = Bp.named("C15 target").state("Open").terminal("Closed").transition("go", "Open", "Nowhere").build();
        Response r = createAny(def);
        assertTrue(is4xx(r), "transition to an unknown state accepted: " + r.statusCode());
    }

    @Test(groups = {"regression"}, description = "Server refuses a state with more than 16 connections")
    @CaseId("BP-C16")
    public void connectionLimit() {
        Bp b = Bp.named("C16 limit").state("Open").state("Escalated").terminal("Closed");
        for (int i = 0; i < 17; i++) b.transition("t" + i, "Open", "Escalated");
        b.transition("end", "Escalated", "Closed");
        Response r = createAny(b.build());
        assertTrue(is4xx(r), "17 connections on one state accepted: " + r.statusCode());
    }

    @Test(groups = {"regression", "NDC-2758"}, description = "Server refuses entry criteria in an unknown shape instead of saving a catch-all blueprint")
    @CaseId({"BP-N2", "BP-C6", "NDC-2758"})
    public void badCriteriaShapeRefused() {
        Map<String, Object> def = simple("N2 criteria").build();
        def.put("entryCriteria", Map.of("kind", "StringMatch", "field", "subject", "operator", "StartsWith", "stringValue", "QA BP N2-ONLY "));
        Response r = createAny(def);
        if (is4xx(r)) return; // correct
        // Saved: does it really behave as "all tickets"? Activate and send a ticket that does NOT match the criteria.
        String id = r.jsonPath().getString("data.id");
        Map<String, Object> d = new HashMap<>(def);
        ok(api.update(id, d, true), "activate");
        String t = api.ticketOk("QA BP N2 other subject");
        Map<String, Object> s = api.waitState(t, 15000);
        ok(api.update(id, d, false), "deactivate");
        fail("Unknown criteria shape was saved (" + r.statusCode() + ") and the blueprint caught a non-matching ticket: "
                + (s == null ? "no blueprint" : s.get("blueprintName")));
    }

    // ---------------- H: draft / publish / versions ----------------

    @Test(groups = {"regression"}, description = "Save Draft keeps the published version live; Publish makes the draft live as a new version; restore works")
    @CaseId({"BP-H1", "BP-H2", "BP-H4"})
    public void draftPublishVersions() {
        // GET returns the draft for editing while one exists, so "what is live" is read from what a ticket is offered.
        Map<String, Object> def = simple("H1 v1").build();
        String id = api.createOk(def, true);
        Map<String, Object> d2 = Bp.named("H1 v2").state("Open").state("Escalated").terminal("Closed")
                .transition("go2", "Open", "Escalated").transition("end", "Escalated", "Closed").build();
        Response dr = api.saveDraft(id, d2);
        assertEquals(dr.statusCode() / 100, 2, err(dr));
        assertEquals(ok(api.blueprint(id), "get").jsonPath().getBoolean("data.hasDraft"), Boolean.TRUE, "hasDraft not set after Save Draft");
        String t1 = api.ticketOk("QA BP H1 during draft");
        assertNotNull(api.waitState(t1, 20000), "ticket did not enter");
        assertEquals(api.transitionNames(t1), List.of("QA go"), "a saved draft is already live for tickets");
        Response pub = api.publish(id);
        assertEquals(pub.statusCode() / 100, 2, err(pub));
        String t2 = api.ticketOk("QA BP H1 after publish");
        assertNotNull(api.waitState(t2, 20000), "ticket did not enter after publish");
        assertEquals(api.transitionNames(t2), List.of("QA go2"), "publish did not make the draft live");
        List<Map<String, Object>> vs = ok(api.versions(id), "versions").jsonPath().getList("data");
        assertTrue(vs.stream().anyMatch(v -> Boolean.TRUE.equals(v.get("isPublished"))), "no published version listed: " + vs);
        int firstVersion = vs.stream().filter(v -> Boolean.TRUE.equals(v.get("isPublished"))).mapToInt(v -> ((Number) v.get("version")).intValue()).min().orElseThrow();
        // second version, then restore the first one (restore takes the version NUMBER, as the designer sends it)
        Map<String, Object> d3 = Bp.named("H1 v3").state("Open").state("Escalated").terminal("Closed")
                .transition("go3", "Open", "Escalated").transition("end", "Escalated", "Closed").build();
        ok(api.saveDraft(id, d3), "draft v3");
        ok(api.publish(id), "publish v3");
        Response rs = api.restore(id, String.valueOf(firstVersion));
        assertEquals(rs.statusCode() / 100, 2, err(rs));
        if (Boolean.TRUE.equals(ok(api.blueprint(id), "get").jsonPath().getBoolean("data.hasDraft"))) ok(api.publish(id), "publish restored draft");
        String t3 = api.ticketOk("QA BP H4 after restore");
        assertNotNull(api.waitState(t3, 20000), "ticket did not enter after restore");
        assertEquals(api.transitionNames(t3), List.of("QA go2"), "restoring version " + firstVersion + " did not bring its transitions back");
    }

    @Test(groups = {"regression"}, description = "A PUT with only a name does not wipe the states and transitions")
    @CaseId("BP-H7")
    public void partialBodyNoWipe() {
        String id = api.createOk(simple("H7 partial").build(), false);
        Response r = api.put("/modules/" + TICKETS + "/blueprints/" + id, Map.of("definition", Map.of("name", QA + "H7 renamed"), "isActive", false));
        if (is4xx(r)) return; // refused: fine
        Map<String, Object> d = api.definition(id);
        assertFalse(((List<?>) d.getOrDefault("states", List.of())).isEmpty(), "partial PUT wiped the states");
        assertFalse(((List<?>) d.getOrDefault("transitions", List.of())).isEmpty(), "partial PUT wiped the transitions");
    }

    // ---------------- B / C: changes with tickets inside ----------------

    @Test(groups = {"regression"}, description = "Delete is refused while tickets are inside; removing an occupied state is refused")
    @CaseId({"BP-B9", "BP-C19", "BP-B8"})
    public void guardedWhileOccupied() {
        Map<String, Object> def = simple("B9 occupied").build();
        String id = api.createOk(def, true);
        String t = api.ticketOk("QA BP B9 inside");
        assertNotNull(api.waitState(t, 20000), "ticket did not enter");
        Response del = api.remove(id);
        assertTrue(is4xx(del), "blueprint with a ticket inside was deleted: " + del.statusCode());
        assertTrue(del.asString().contains("BLUEPRINT_IN_PROGRESS") || del.asString().toLowerCase().contains("progress"), err(del));
        Map<String, Object> noOpen = Bp.named("B9 occupied").state("Escalated").terminal("Closed").transition("end", "Escalated", "Closed").build();
        Response up = api.update(id, noOpen, true);
        assertTrue(is4xx(up), "removing the occupied state Open was accepted: " + up.statusCode());
        ok(api.revokeTicket(t), "revoke");
        Response del2 = api.remove(id);
        assertEquals(del2.statusCode() / 100, 2, "delete after revoke: " + err(del2));
    }

    // ---------------- I: membership ----------------

    @Test(groups = {"regression"}, description = "Inactive: new tickets don't enter; a ticket already inside can still move")
    @CaseId("BP-I7")
    public void inactiveStopsEntry() {
        Map<String, Object> def = simple("I7 inactive").build();
        String id = api.createOk(def, true);
        String inside = api.ticketOk("QA BP I7 inside");
        assertNotNull(api.waitState(inside, 20000), "control ticket did not enter while active");
        ok(api.update(id, def, false), "deactivate");
        String after = api.ticketOk("QA BP I7 after");
        DeskBlueprintApi.sleep(6000);
        Map<String, Object> s = api.stateOf(after);
        assertTrue(s == null || !id.equals(s.get("blueprintDefinitionId")), "ticket entered an inactive blueprint");
        Response r = api.run(inside, "go", "Open", null);
        assertEquals(r.statusCode(), 200, "ticket inside a deactivated blueprint could not move: " + err(r));
    }

    @Test(groups = {"regression"}, description = "Two matching blueprints: the first in the order wins; after reordering the other one wins")
    @CaseId({"BP-I5", "BP-B7"})
    public void orderDecides() {
        String a = api.createOk(simple("I5 A").build(), true);
        String b = api.createOk(simple("I5 B").build(), true);
        List<String> others = new ArrayList<>();
        for (Map<String, Object> x : api.listData())
            if (QA_DEPT.equals(String.valueOf(x.get("department_id"))) && Boolean.TRUE.equals(x.get("isActive")) && !a.equals(x.get("id")) && !b.equals(x.get("id"))) others.add(String.valueOf(x.get("id")));
        if (!others.isEmpty()) throw new SkipException("INCONCLUSIVE: other blueprints in the QA department: " + others);
        ok(api.sort(QA_DEPT, List.of(a, b)), "sort A,B");
        String t1 = api.ticketOk("QA BP I5 first");
        Map<String, Object> s1 = api.waitState(t1, 20000);
        assertNotNull(s1, "no entry");
        assertEquals(s1.get("blueprintDefinitionId"), a, "first in order should win");
        ok(api.sort(QA_DEPT, List.of(b, a)), "sort B,A");
        String t2 = api.ticketOk("QA BP I5 second");
        Map<String, Object> s2 = api.waitState(t2, 20000);
        assertNotNull(s2, "no entry");
        assertEquals(s2.get("blueprintDefinitionId"), b, "after reorder the other blueprint should win");
    }

    @Test(groups = {"regression"}, description = "Include existing tickets at a chosen state; history names the admin")
    @CaseId("BP-I8")
    public void includeAtState() {
        Map<String, Object> def = simple("I8 include").build();
        String id = api.createOk(def, false);
        String t = api.ticketOk("QA BP I8 existing");
        DeskBlueprintApi.sleep(4000);
        assertNull(api.stateOf(t), "ticket entered an inactive blueprint on create");
        ok(api.update(id, def, true), "activate");
        Response inc = api.include(id, "Escalated", List.of(t));
        assertEquals(inc.statusCode() / 100, 2, err(inc));
        Map<String, Object> s = api.waitState(t, 15000);
        assertNotNull(s, "include did not put the ticket in the blueprint: " + inc.asString());
        assertEquals(s.get("blueprintDefinitionId"), id);
        assertEquals(s.get("activeStates"), List.of("Escalated"), "entered at the wrong state");
        assertEquals(api.fields(t).get("status"), "Escalated", "status not set to the entry state");
    }

    @Test(groups = {"regression"}, description = "Revoke all tickets of a blueprint; bulk revoke from the ticket list")
    @CaseId({"BP-I11", "BP-I12"})
    public void revokeAllAndBulk() {
        Map<String, Object> def = simple("I11 revoke").build();
        String id = api.createOk(def, true);
        String t1 = api.ticketOk("QA BP I11 one"), t2 = api.ticketOk("QA BP I11 two"), t3 = api.ticketOk("QA BP I12 bulk");
        for (String t : List.of(t1, t2, t3)) assertNotNull(api.waitState(t, 20000), "ticket did not enter: " + t);
        Response bulk = api.bulkRevoke(List.of(t3));
        assertEquals(bulk.statusCode() / 100, 2, err(bulk));
        assertNull(api.stateOf(t3), "bulk revoke left the ticket inside");
        Response all = api.revokeAll(id);
        assertEquals(all.statusCode() / 100, 2, err(all));
        DeskBlueprintApi.sleep(3000);
        assertNull(api.stateOf(t1), "revoke all left ticket 1 inside");
        assertNull(api.stateOf(t2), "revoke all left ticket 2 inside");
        assertEquals(api.fields(t1).get("status"), "Open", "revoke changed the status");
    }

    @Test(groups = {"regression"}, description = "A matching ticket in another department does not enter the QA department's blueprint")
    @CaseId("BP-I6")
    public void otherDepartment() {
        String id = api.createOk(simple("I6 dept").build(), true);
        String control = api.ticketOk("QA BP I6 control");
        assertNotNull(api.waitState(control, 20000), "control ticket did not enter");
        String other = api.ticketOk("QA BP I6 other dept", Map.of("department", "258a87d2-5b80-458c-8aa2-bfa7657f7eee")); // Tech
        DeskBlueprintApi.sleep(6000);
        Map<String, Object> s = api.stateOf(other);
        assertTrue(s == null || !id.equals(s.get("blueprintDefinitionId")), "ticket of another department entered the QA blueprint");
    }
}
