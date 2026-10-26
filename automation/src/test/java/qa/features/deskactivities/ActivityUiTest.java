package qa.features.deskactivities;

import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.AppUser;
import qa.features.deskactivities.pages.ActivityDetailPage;

import java.time.LocalDateTime;
import java.util.Map;

import static qa.features.deskactivities.DeskActivitiesApi.*;
import static qa.features.deskactivities.DeskActivitiesFeature.*;

/**
 * Activity detail page as the QA agent. Data is seeded and read back through the API; the page does the action.
 * Run with the agent's browser account:
 * mvnw test -Dtest=ActivityUiTest -Dbase.url=https://staging-desk.taviportal.com -Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com
 */
public class ActivityUiTest extends BaseTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private AppUser.App ag() {
        return agent();
    }

    @CaseId({"ACT-D2", "ACT-D4"})
    @Test(groups = {"deskactivities", "ui", "regression", "smoke"}, description = "Mark as Complete sets Completed + Completed Time; Reopen Task sets Not Started")
    public void completeAndReopenTask() {
        String id = createOk(ag(), cleanup, TASKS, "subject", QA + "UI D2 " + tag(), "status", "Not Started", "due_date", iso(86400));
        ActivityDetailPage p = new ActivityDetailPage().open(TASKS, id).press("Mark as Complete");
        Map<String, Object> f = fields(ag(), TASKS, id);
        fact("ACT-D2", "after Mark as Complete: status=" + f.get("status") + " completed_time=" + f.get("completed_time"));
        Assert.assertEquals(str(f, "status"), "Completed");
        Assert.assertNotNull(f.get("completed_time"), "Completed Time");
        p.press("Reopen Task");
        Assert.assertEquals(str(fields(ag(), TASKS, id), "status"), "Not Started", "status after Reopen (Zoho: Not Started)");
    }

    @CaseId("ACT-E6")
    @Test(groups = {"deskactivities", "ui", "bug", "A-B1"}, description = "BUG A-B1: Reschedule with 'log a missed call' moves the call and logs the missed attempt (today: 'One or more fields in the payload are read-only.')")
    public void rescheduleWithMissedLog() {
        String id = createOk(ag(), cleanup, CALLS, "subject", QA + "UI E6 " + tag(), "call_start_time", iso(3600), "call_status", "scheduled", "call_type", "outbound");
        String before = str(fields(ag(), CALLS, id), "call_start_time");
        String toast = new ActivityDetailPage().open(CALLS, id).rescheduleCall(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0), true);
        String after = str(fields(ag(), CALLS, id), "call_start_time");
        fact("ACT-E6", "toast '" + toast + "'; start before " + before + " after " + after);
        Assert.assertFalse(toast.contains("read-only"), "reschedule refused: " + toast);
        Assert.assertNotEquals(after, before, "call start time did not move");
    }

    @CaseId("ACT-E6c")
    @Test(groups = {"deskactivities", "ui", "regression"}, description = "Reschedule without the missed-call log moves the call")
    public void rescheduleWithoutLog() {
        String id = createOk(ag(), cleanup, CALLS, "subject", QA + "UI E6c " + tag(), "call_start_time", iso(3600), "call_status", "scheduled", "call_type", "outbound");
        String before = str(fields(ag(), CALLS, id), "call_start_time");
        String toast = new ActivityDetailPage().open(CALLS, id).rescheduleCall(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0), false);
        String after = str(fields(ag(), CALLS, id), "call_start_time");
        fact("ACT-E6c", "toast '" + toast + "'; start " + before + " -> " + after);
        Assert.assertNotEquals(after, before);
    }

    @CaseId("ACT-D10")
    @Test(groups = {"deskactivities", "ui", "bug", "A-B3"}, description = "BUG A-B3: the detail page shows the priority label 'Highest', not the raw key 'highest'")
    public void priorityLabel() {
        String id = createOk(ag(), cleanup, TASKS, "subject", QA + "UI D10 " + tag(), "status", "Not Started", "priority", "highest");
        String shown = new ActivityDetailPage().open(TASKS, id).priorityShown();
        fact("ACT-D10", "priority shown: '" + shown + "'");
        Assert.assertEquals(shown, "Highest");
    }
}
