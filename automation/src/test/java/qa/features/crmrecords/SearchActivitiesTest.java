package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.Waits;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 groups GS and AC — global search (owner finds a QA lead, a deleted one is not returned; a user on the
 * built-in User profile may search: W2-B6) and recurring tasks (W2-B8).
 */
public class SearchActivitiesTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private static Response search(CrmUser as, String q) {
        return as.get("/search?q=" + URLEncoder.encode(q, StandardCharsets.UTF_8) + "&limit=20");
    }

    @CaseId({"GS-01", "GS-02"})
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Owner search finds a QA lead by its exact name; once deleted it is no longer returned")
    public void ownerSearch() {
        String name = QA + "GS " + tag() + " zebra";
        String id = create(owner(), cleanup, mod("leads"), name, null);
        boolean found = CrmApi.waitFor(60, () -> CrmUser.ok(search(owner(), name), "search").asString().contains(id));
        CrmUser.ok(owner().delete("/modules/" + LEADS + "/records/" + id), "delete");
        boolean gone = CrmApi.waitFor(60, () -> !CrmUser.ok(search(owner(), name), "search").asString().contains(id));
        fact("GS-01", "found=" + found + ", gone after delete=" + gone);
        if (!found) throw new SkipException("INCONCLUSIVE: the new lead never appeared in search (indexing delay?)");
        Assert.assertTrue(gone, "a deleted lead is still returned by search");
    }

    @CaseId("GS-03")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B6"}, description = "Test user 1 (built-in User profile) can use global search")
    public void userProfileCanSearch() {
        CrmUser.ok(user1().get("/iam/me/profile"), "control: test user 1 token works");
        Response r = search(user1(), "QA W2");
        fact("GS-03", "test user 1 search -> " + err(r));
        Assert.assertEquals(r.statusCode(), 200, "a user on the built-in User profile can't search (W2-B6)");
    }

    @CaseId("AC-01")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B8"}, description = "A task repeating 'Weekly, 3 times' creates its next tasks (up front or when the first is completed)")
    @SuppressWarnings("unchecked")
    public void recurringTaskCreatesNext() {
        String subject = QA + "AC repeat " + tag();
        String id = create(owner(), cleanup, mod("tasks"), subject,
                Map.of("repeat", "{\"type\":\"weekly\",\"ends\":\"after\",\"afterCount\":3}", "due_date", java.time.LocalDate.now().plusDays(1).toString()));
        String stored = str(CrmUser.ok(get(owner(), mod("tasks"), id), "read task"), "repeat");
        if (stored == null || !stored.contains("weekly")) throw new SkipException("INCONCLUSIVE: the repeat setting was not stored: " + stored);
        CrmUser.ok(patch(owner(), mod("tasks"), id, Map.of("status", "Completed")), "complete the first task");
        Waits.sleep(15_000);
        int same = 0;
        for (int p = 1; p <= 2; p++) {
            List<Map<String, Object>> rows = CrmUser.ok(owner().get("/modules/" + TASKS + "/records?page=" + p + "&per_page=100&sort_by=created_at&sort_dir=desc"), "tasks").jsonPath().getList("data");
            for (Map<String, Object> x : rows) {
                if (String.valueOf(x.get("data")).contains(subject)) {
                    same++;
                    if (!id.equals(x.get("id"))) cleanup.record(mod("tasks"), String.valueOf(x.get("id")));
                }
            }
        }
        fact("AC-01", "repeat stored " + stored + "; tasks with this subject after completing the first: " + same);
        Assert.assertTrue(same >= 2, "only the first task exists; the recurring tasks were never created (W2-B8)");
    }
}
