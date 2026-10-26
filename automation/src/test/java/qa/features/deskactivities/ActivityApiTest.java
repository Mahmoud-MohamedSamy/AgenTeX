package qa.features.deskactivities;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmdeskintegration.AppUser;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.deskactivities.DeskActivitiesApi.*;
import static qa.features.deskactivities.DeskActivitiesFeature.*;

/**
 * Activity life cycle through the records API (spec docs/desk-activity-lifecycle/spec-desk-activity-lifecycle.md),
 * as the QA agent (Customer Support). Bug tests (groups "bug" + local id A-Bn) assert the CORRECT behaviour and fail
 * while the bug is open. Every record is "QA ACT …" and deleted in tearDown.
 * Run: mvnw test -Dtest=ActivityApiTest   (no browser)
 */
public class ActivityApiTest {
    private final Cleanup cleanup = new Cleanup();
    private AppUser.App ag;

    @BeforeClass(alwaysRun = true)
    public void session() {
        ag = agent();
        Response r = ag.get("/modules/" + TASKS + "/records?page=1&per_page=1");
        if (r.statusCode() != 200) throw new SkipException("INCONCLUSIVE: agent API unusable (" + r.statusCode() + ") - nothing created");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private String task(String subject, Object... more) {
        Object[] kv = new Object[more.length + 2];
        kv[0] = "subject";
        kv[1] = QA + subject;
        System.arraycopy(more, 0, kv, 2, more.length);
        return createOk(ag, cleanup, TASKS, kv);
    }

    @CaseId("ACT-A7")
    @Test(groups = {"deskactivities", "api", "regression", "smoke"}, description = "No bearer token -> 401 on activity records")
    public void noTokenIs401() {
        int s = AppUser.anonymous(DESK, "desk").get("/modules/" + TASKS + "/records?page=1&per_page=1").statusCode();
        Assert.assertEquals(s, 401, "anonymous read of tasks");
    }

    @CaseId("ACT-C11")
    @Test(groups = {"deskactivities", "api", "regression"}, description = "Values outside each picklist are refused (task status/priority/category, call status, event status)")
    public void picklistsAreValidated() {
        Map<String, Response> r = new LinkedHashMap<>();
        r.put("task status Done", create(ag, TASKS, "subject", QA + "C11", "status", "Done"));
        r.put("task priority urgent", create(ag, TASKS, "subject", QA + "C11", "priority", "urgent"));
        r.put("task category nonsense", create(ag, TASKS, "subject", QA + "C11", "category", "nonsense"));
        r.put("call status ringing", create(ag, CALLS, "subject", QA + "C11", "call_start_time", iso(3600), "call_status", "ringing"));
        r.put("event status Not Started", create(ag, EVENTS, "title", QA + "C11", "from_time", iso(86400), "to_time", iso(90000), "status", "Not Started"));
        StringBuilder saved = new StringBuilder();
        r.forEach((k, v) -> {
            fact("ACT-C11", k + " -> " + err(v));
            if (v.statusCode() == 201) {
                cleanup.add(k.startsWith("call") ? CALLS : k.startsWith("event") ? EVENTS : TASKS, v.jsonPath().getString("data.id"));
                saved.append(k).append("; ");
            }
        });
        Assert.assertEquals(saved.toString(), "", "values outside the list were saved");
    }

    @CaseId({"ACT-C7", "ACT-C10", "ACT-C12"})
    @Test(groups = {"deskactivities", "api", "regression"}, description = "Required start time, end after start, and invalid dates are refused")
    public void requiredAndDates() {
        Response noStart = create(ag, CALLS, "subject", QA + "C7");
        Response endFirst = create(ag, EVENTS, "title", QA + "C10", "from_time", iso(90000), "to_time", iso(86400));
        Response badDate = create(ag, TASKS, "subject", QA + "C12", "due_date", "2026-13-45T10:00:00Z");
        Response text = create(ag, TASKS, "subject", QA + "C12", "due_date", "abc");
        fact("ACT-C7/C10/C12", "no start " + err(noStart) + "; end before start " + err(endFirst) + "; month 13 " + err(badDate) + "; 'abc' " + err(text));
        for (Response x : List.of(noStart, endFirst, badDate, text))
            if (x.statusCode() == 201) cleanup.add(x == noStart ? CALLS : x == endFirst ? EVENTS : TASKS, x.jsonPath().getString("data.id"));
        Assert.assertEquals(List.of(noStart.statusCode(), endFirst.statusCode(), badDate.statusCode(), text.statusCode()), List.of(422, 422, 422, 422));
    }

    @CaseId("ACT-C4")
    @Test(groups = {"deskactivities", "api", "regression"}, description = "Subject: empty / spaces refused, 255 chars accepted, 256 refused, Arabic and markup kept as text")
    public void subjectLimits() {
        Response empty = create(ag, TASKS, "subject", "");
        Response spaces = create(ag, TASKS, "subject", "   ");
        String s255 = (QA + "x".repeat(300)).substring(0, 255), s256 = (QA + "x".repeat(300)).substring(0, 256);
        Response ok = create(ag, TASKS, "subject", s255);
        Response over = create(ag, TASKS, "subject", s256);
        String arabic = QA + "مهمة <img src=x onerror=alert(1)>";
        String aid = createOk(ag, cleanup, TASKS, "subject", arabic);
        for (Response x : List.of(empty, spaces, ok, over)) if (x.statusCode() == 201) cleanup.add(TASKS, x.jsonPath().getString("data.id"));
        fact("ACT-C4", "empty " + err(empty) + "; spaces " + err(spaces) + "; 255 -> " + ok.statusCode() + "; 256 " + err(over) + " (Zoho: 50 in the UI, 300 in the API)");
        Assert.assertEquals(List.of(empty.statusCode(), spaces.statusCode(), ok.statusCode(), over.statusCode()), List.of(422, 422, 201, 422));
        Assert.assertEquals(str(fields(ag, TASKS, aid), "subject"), arabic, "Arabic + markup stored as typed");
    }

    @CaseId("ACT-C1")
    @Test(groups = {"deskactivities", "api", "bug", "A-B2"}, description = "BUG A-B2: a task created without a status gets the default 'Not Started' (today it has none and never shows in Open / Overdue views)")
    public void newTaskGetsDefaultStatus() {
        String id = task("C1 default " + tag(), "due_date", iso(-86400));
        Map<String, Object> f = fields(ag, TASKS, id);
        fact("ACT-C1", "status of a new task without status = " + f.get("status") + " (Zoho Mark-as-complete / Reopen use 'Not Started')");
        Assert.assertEquals(str(f, "status"), "Not Started", "default status of a new task");
    }

    @CaseId({"ACT-D1", "ACT-D8"})
    @Test(groups = {"deskactivities", "api", "bug", "A-B5"}, description = "BUG A-B5: setting status Completed by API fills Completed Time on the server (UI sets it itself)")
    public void completedTimeSetByServer() {
        String id = task("D8 " + tag(), "status", "Not Started");
        for (String st : List.of("In Progress", "Waiting on Someone", "Deferred"))
            Assert.assertEquals(patch(ag, TASKS, id, "status", st).statusCode(), 200, "status " + st);
        AppUser.ok(patch(ag, TASKS, id, "status", "Completed"), "complete");
        Map<String, Object> f = fields(ag, TASKS, id);
        fact("ACT-D8", "after PATCH status Completed: completed_time = " + f.get("completed_time"));
        Assert.assertNotNull(f.get("completed_time"), "completed_time after completing through the API");
    }

    @CaseId("ACT-M2")
    @Test(groups = {"deskactivities", "api", "bug", "A-B5"}, description = "BUG A-B5: completed_time is read-only for clients (today a PATCH can set any date)")
    public void completedTimeIsReadOnly() {
        String id = task("M2 " + tag(), "status", "Not Started");
        Response p = patch(ag, TASKS, id, "completed_time", "2001-01-01T00:00:00Z");
        String ct = str(fields(ag, TASKS, id), "completed_time");
        fact("ACT-M2", "PATCH completed_time=2001-01-01 -> " + err(p) + "; stored " + ct);
        Assert.assertFalse(ct != null && ct.startsWith("2001"), "client set Completed Time to 2001");
    }

    @CaseId("ACT-C8")
    @Test(groups = {"deskactivities", "api", "bug", "A-B6"}, description = "BUG A-B6: call duration accepts only a real duration (today 'abc', '-1', '99:99' are saved)")
    public void callDurationValidated() {
        StringBuilder saved = new StringBuilder();
        for (String v : List.of("abc", "-1", "99:99")) {
            Response r = create(ag, CALLS, "subject", QA + "C8 " + v, "call_start_time", iso(-3600), "call_status", "completed", "call_duration", v);
            fact("ACT-C8", "call_duration '" + v + "' -> " + err(r));
            if (r.statusCode() == 201) {
                cleanup.add(CALLS, r.jsonPath().getString("data.id"));
                saved.append(v).append(' ');
            }
        }
        Assert.assertEquals(saved.toString().trim(), "", "invalid durations saved");
    }

    @CaseId("ACT-E8")
    @Test(groups = {"deskactivities", "api", "bug", "A-B4"}, description = "BUG A-B4: a completed call cannot be edited through the API either (the page says it is read-only)")
    public void completedCallReadOnlyInApi() {
        String id = createOk(ag, cleanup, CALLS, "subject", QA + "E8 " + tag(), "call_start_time", iso(-3600), "call_status", "completed", "call_type", "outbound");
        Response p = patch(ag, CALLS, id, "subject", QA + "E8 edited");
        String subj = str(fields(ag, CALLS, id), "subject");
        fact("ACT-E8", "PATCH subject on a completed call -> " + err(p) + "; subject now '" + subj + "'");
        Assert.assertFalse(subj.endsWith("E8 edited"), "completed call was edited through the API");
    }

    @CaseId({"ACT-G1", "ACT-G3", "ACT-G5", "ACT-G6", "ACT-G9"})
    @Test(groups = {"deskactivities", "api", "regression"}, description = "Reminders: options, 'before' reminder, at most 5, invalid values refused, SMS refused")
    public void reminderRules() {
        String opts = AppUser.ok(ag.get("/desk/activities/reminders/options"), "options").asString();
        Assert.assertTrue(opts.contains("\"max_per_activity\":5") && opts.contains("\"sms\":false"), opts);
        String id = task("G " + tag(), "status", "Not Started", "due_date", iso(86400));
        String path = "/desk/activities/" + id + "/reminders";
        int n = 0;
        for (int i = 0; i < 5; i++) if (ag.post(path, Map.of("timing", "before", "offset_value", 5 + i, "offset_unit", "minutes", "channels", List.of("popup"))).statusCode() == 201) n++;
        Response sixth = ag.post(path, Map.of("timing", "before", "offset_value", 30, "offset_unit", "minutes", "channels", List.of("popup")));
        Map<String, Response> bad = new LinkedHashMap<>();
        bad.put("offset 0", ag.post(path, Map.of("timing", "before", "offset_value", 0, "offset_unit", "minutes", "channels", List.of("popup"))));
        bad.put("unit weeks", ag.post(path, Map.of("timing", "before", "offset_value", 1, "offset_unit", "weeks", "channels", List.of("popup"))));
        bad.put("custom past", ag.post(path, Map.of("timing", "custom", "custom_at", iso(-3600), "channels", List.of("popup"))));
        bad.put("no channel", ag.post(path, Map.of("timing", "at", "channels", List.of())));
        bad.put("sms", ag.post(path, Map.of("timing", "at", "channels", List.of("sms"))));
        fact("ACT-G5", "5 reminders created=" + n + "; 6th " + err(sixth));
        bad.forEach((k, v) -> fact("ACT-G6", k + " -> " + err(v)));
        Assert.assertEquals(n, 5);
        Assert.assertEquals(sixth.statusCode(), 422, "6th reminder");
        bad.forEach((k, v) -> Assert.assertTrue(v.statusCode() >= 400, k + " was accepted"));
    }

    @CaseId("ACT-L1")
    @Test(groups = {"deskactivities", "api", "regression"}, description = "Delete a task by API -> 204/200, then 404")
    public void deleteTask() {
        String id = createOk(ag, new Cleanup(), TASKS, "subject", QA + "L1 " + tag());
        int d = ag.delete("/modules/" + TASKS + "/records/" + id).statusCode();
        int g = ag.get("/modules/" + TASKS + "/records/" + id).statusCode();
        fact("ACT-L1", "DELETE " + d + "; GET after " + g);
        Assert.assertTrue(d / 100 == 2 && g == 404, "delete " + d + " / get " + g);
    }

    @CaseId("ACT-A3")
    @Test(groups = {"deskactivities", "api", "possible-bug", "A-B8"}, description = "POSSIBLE BUG A-B8: an admin outside Customer Support cannot read an activity linked to a Customer Support ticket (the ticket itself is 404 for them)")
    public void activityOfHiddenTicketIsHidden() {
        String tk = qaTicket(ag, cleanup, QA + "ticket A3 " + tag());
        String id = task("A3 " + tag(), "ticket_id", tk);
        AppUser.App ad = otherDeptAdmin();
        int ticket = ad.get("/desk/tickets/" + tk).statusCode();
        int act = ad.get("/modules/" + TASKS + "/records/" + id).statusCode();
        fact("ACT-A3", "admin of HR/Marketing/Sales: ticket " + ticket + ", its task " + act);
        if (ticket != 404) throw new SkipException("INCONCLUSIVE: the admin can see the ticket too (" + ticket + ")");
        Assert.assertNotEquals(act, 200, "task of a ticket the user cannot see is readable");
    }

    @CaseId("ACT-H7")
    @Test(groups = {"deskactivities", "api", "gap"}, description = "GAP: the ticket API counts its activities (Zoho taskCount)")
    public void ticketCountsActivities() {
        String tk = qaTicket(ag, cleanup, QA + "ticket H7 " + tag());
        task("H7 " + tag(), "ticket_id", tk);
        String counts = String.valueOf(AppUser.ok(ag.get("/desk/tickets/" + tk), "ticket").jsonPath().getMap("data.counts"));
        fact("ACT-H7", "ticket counts " + counts);
        Assert.assertTrue(counts.matches(".*(task|activit).*"), "no activity count on the ticket: " + counts);
    }
}
