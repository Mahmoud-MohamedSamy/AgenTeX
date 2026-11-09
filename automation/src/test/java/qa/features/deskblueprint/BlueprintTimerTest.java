package qa.features.deskblueprint;

import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskblueprint.Bp.setField;
import static qa.features.deskblueprint.DeskBlueprintApi.err;
import static qa.features.deskblueprint.DeskBlueprintApi.ok;

/**
 * Spec group K (state time limits, the SLA tie-in): calendar clock, 2-minute limit with a 1-minute warning,
 * actions at the warning and when it runs out, automatic move after 3 minutes; leaving the state or revoking stops the timers.
 * Exclusive and slow (about 5 minutes).
 */
public class BlueprintTimerTest {
    private DeskBlueprintApi api;

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintTimerTest cleanup]\n" + api.cleanup());
    }

    private static Instant at(Object due) {
        if (!(due instanceof Map<?, ?> m) || m.get("at") == null) return null;
        return OffsetDateTime.parse(String.valueOf(m.get("at"))).toInstant();
    }

    @Test(groups = {"regression", "slow"}, description = "Warning actions, limit actions and the automatic move run once on time; moving out or revoking stops them")
    @CaseId({"BP-K1", "BP-K2", "BP-K6", "BP-K7", "BP-K10", "BP-K11", "BP-G2", "BP-G5", "BP-G8"})
    public void timersRunOnTime() {
        api = DeskBlueprintApi.get();
        Map<String, Object> open = new java.util.LinkedHashMap<>();
        open.put("slaClock", "calendar");
        open.put("slaMinutes", 2);
        open.put("slaPreExpiryMinutes", 1);
        open.put("slaPreExpiryEscalation", List.of(setField("description", "QA warned")));
        open.put("slaEscalation", List.of(setField("priority", "high")));
        open.put("autoTransitionId", "auto");
        open.put("autoTransitionAfterMinutes", 3);
        Map<String, Object> def = Bp.named("K timers").state("Open", open).state("Escalated").terminal("Closed")
                .transition("auto", "Open", "Escalated").transition("manual", "Open", "Closed").build();
        api.createOk(def, true);

        String stay = api.ticketOk("QA BP K stays");
        String moved = api.ticketOk("QA BP K moved");
        String revoked = api.ticketOk("QA BP K revoked");
        Instant start = Instant.now();
        Map<String, Object> s = api.waitState(stay, 20000);
        assertNotNull(s, "ticket did not enter");
        Instant entered = OffsetDateTime.parse(String.valueOf(s.get("enteredAt"))).toInstant();
        Instant warn = at(s.get("warning_due_at")), due = at(s.get("escalation_due_at"));
        assertNotNull(warn, "no warning time: " + s);
        assertNotNull(due, "no due time: " + s);
        assertTrue(Math.abs(Duration.between(entered.plusSeconds(60), warn).getSeconds()) <= 5, "warning not 1 min after entry: " + warn + " vs " + entered);
        assertTrue(Math.abs(Duration.between(entered.plusSeconds(120), due).getSeconds()) <= 5, "due not 2 min after entry: " + due + " vs " + entered);

        assertNotNull(api.waitState(moved, 20000), "ticket 2 did not enter");
        assertNotNull(api.waitState(revoked, 20000), "ticket 3 did not enter");
        Response m = api.run(moved, "manual", "Open", null);
        assertEquals(m.statusCode(), 200, err(m));
        ok(api.revokeTicket(revoked), "revoke");

        // wait past the automatic move (3 min) plus 2 minutes of slack for the scheduler
        Instant deadline = start.plusSeconds(5 * 60 + 30);
        boolean autoMoved = false;
        while (Instant.now().isBefore(deadline)) {
            if ("Escalated".equals(api.fields(stay).get("status"))) {
                autoMoved = true;
                break;
            }
            DeskBlueprintApi.sleep(10000);
        }
        Map<String, Object> f = api.fields(stay);
        List<Map<String, Object>> h = api.history(stay);
        StringBuilder hs = new StringBuilder();
        for (Map<String, Object> e : h) hs.append(e.get("action")).append('/').append(e.get("field_key")).append('/').append(e.get("source")).append(' ');

        // control first: the timers ran on the ticket that stayed
        assertEquals(f.get("description"), "QA warned", "warning action did not run. History: " + hs);
        assertEquals(String.valueOf(f.get("priority")).toLowerCase(), "high", "time-limit action did not run. History: " + hs);
        assertTrue(autoMoved, "automatic move after 3 min did not happen within 5.5 min. Status " + f.get("status") + ". History: " + hs);

        // negatives: nothing fired on the ticket that left early, nor on the revoked one
        for (String id : List.of(moved, revoked)) {
            Map<String, Object> o = api.fields(id);
            assertNotEquals(o.get("description"), "QA warned", "warning action ran on a ticket that " + (id.equals(moved) ? "left the state" : "was revoked"));
            assertNotEquals(String.valueOf(o.get("priority")).toLowerCase(), "high", "limit action ran on a ticket that " + (id.equals(moved) ? "left the state" : "was revoked"));
        }
        assertEquals(api.fields(revoked).get("status"), "Open", "revoked ticket was moved by the timer");
    }
}
