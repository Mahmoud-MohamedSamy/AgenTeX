package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group MD — mass delete of 120 QA leads (volume group: creates 120 records, run only on purpose with
 * -Dtags=volume). Uses the "selected ids" mode of the mass-delete call; the criteria mode is checked on the screen
 * only, because a criteria the server ignored would delete every lead of the tenant.
 */
public class MassActionTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @CaseId("MD-02")
    @Test(groups = {"crmrecords", "wave2", "api", "volume", "NDC-1216"}, description = "Mass delete of 120 selected leads deletes exactly those 120, all found in the bin")
    public void massDelete120() throws Exception {
        String p = QA + "MD " + tag();
        List<String> ids = new ArrayList<>();
        ExecutorService pool = Executors.newFixedThreadPool(8);
        try {
            List<Future<String>> f = new ArrayList<>();
            for (int i = 1; i <= 120; i++) {
                String n = p + " " + String.format("%03d", i);
                f.add(pool.submit(() -> create(owner(), cleanup, mod("leads"), n, null)));
            }
            for (Future<String> x : f) ids.add(x.get());
        } finally {
            pool.shutdown();
        }
        long t0 = System.currentTimeMillis();
        Response r = CrmUser.ok(owner().post("/modules/" + LEADS + "/records/mass-delete", m("mode", "ids", "recordIds", ids)), "mass delete");
        String job = r.jsonPath().getString("data.job_id") != null ? r.jsonPath().getString("data.job_id") : r.jsonPath().getString("data.id");
        if (job != null) CrmApi.waitFor(300, () -> owner().get("/modules/" + LEADS + "/mass-delete-jobs/" + job).asString().matches("(?is).*(completed|failed|done).*"));
        boolean allGone = CrmApi.waitFor(120, () -> ids.stream().allMatch(id -> get(owner(), mod("leads"), id).statusCode() == 404));
        long inBin = binItems(owner()).stream().filter(i -> ids.contains(String.valueOf(i.get("record_id")))).count();
        fact("MD-02", "mass delete -> " + r.statusCode() + " " + r.asString().substring(0, Math.min(250, r.asString().length())) + "; all 120 gone=" + allGone
                + " after " + (System.currentTimeMillis() - t0) / 1000 + " s; in bin " + inBin);
        Assert.assertTrue(allGone, "not every selected lead was deleted");
        Assert.assertEquals(inBin, 120L, "the deleted leads are not all in the recycle bin");
    }
}
