package qa.features.deskassignmentrules;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.List;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/** Group G (runtime) — who is notified when rules assign tickets. Read as the agents themselves (A1, A2). */
public class NotificationsTest extends ArTestBase {
    private static final int SETTLE = 20;

    @Test(groups = {"regression", "api"}, description = "A rule assigns A1: A1 gets one notification, A2 none")
    @CaseId("G-01")
    public void agentNotified() {
        String mk = mk("G01");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        String t = o.ticket(mk + " notify", DA);
        assertEquals(n(o.waitOwner(t, 20)), "A1", "precondition: rule assigned A1");
        wait(SETTLE);
        List<String> a1 = ArApi.a1().notificationsAbout(t), a2 = ArApi.a2().notificationsAbout(t);
        assertEquals(a1.size(), 1, "A1 notifications " + a1);
        assertEquals(a2.size(), 0, "A2 notifications " + a2);
    }

    @Test(groups = {"regression", "api"}, description = "An agent who picks up a ticket is not notified")
    @CaseId("G-02")
    public void selfPickUp() {
        String t = o.ticket(mk("G02") + " pickup", DA);
        wait(3);
        ok(ArApi.a1().post("/desk/tickets/" + t + "/pick-up", m()), "A1 picks up");
        wait(SETTLE);
        assertEquals(n(o.owner(t)), "A1", "pick-up did not set the owner");
        assertEquals(ArApi.a1().notificationsAbout(t).size(), 0, "A1 notified about its own pick-up");
    }

    @Test(groups = {"regression", "api"}, description = "A rule assigns a team: its members are notified once, others not")
    @CaseId("G-03")
    public void teamNotified() {
        String mk = mk("G03");
        o.direct(mk, directTarget(contains(mk), DA, null, team(TEAM_A)));
        String t = o.ticket(mk + " team", DA);
        wait(SETTLE + 5);
        List<String> a2 = ArApi.a2().notificationsAbout(t), a1 = ArApi.a1().notificationsAbout(t);
        assertEquals(a2.size(), 1, "team member A2 " + a2);
        assertEquals(a1.size(), 0, "A1 (not in the team) " + a1);
    }

    @Test(groups = {"regression", "api"}, description = "Editing a ticket without changing the owner sends no assignment notification")
    @CaseId("G-06")
    public void noOwnerChangeNoNotification() {
        String t = o.ticket(mk("G06") + " plain", DA, m("owner", A1));
        wait(SETTLE);
        int afterCreate = ArApi.a1().notificationsAbout(t).size();
        o.patchTicket(t, m("priority", "Low"));
        wait(SETTLE);
        int afterEdit = ArApi.a1().notificationsAbout(t).size();
        assertTrue(afterCreate <= 1, "created-with-owner notifications " + afterCreate);
        assertEquals(afterEdit, afterCreate, "the edit sent a notification");
    }

    @Test(groups = {"regression", "api"}, description = "Direct -> A1 and workflow -> A2 in the same event: only the final owner A2 is notified")
    @CaseId("G-07")
    public void onlyFinalOwnerNotified() {
        String mk = mk("G07");
        o.direct(mk, directTarget(contains(mk), DA, null, agent(A1)));
        o.workflow(mk + " WF", subjectStarts(mk), setOwner(A2));
        String t = o.ticket(mk + " x", DA);
        wait(12);
        assertEquals(n(o.waitOwner(t, 10)), "A2", "precondition: workflow set A2");
        wait(SETTLE);
        List<String> a1 = ArApi.a1().notificationsAbout(t), a2 = ArApi.a2().notificationsAbout(t);
        assertEquals(a1.size(), 0, "A1 (intermediate owner) notified " + a1);
        assertEquals(a2.size(), 1, "A2 (final owner) " + a2);
    }
}
