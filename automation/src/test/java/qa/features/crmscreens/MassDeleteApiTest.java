package qa.features.crmscreens;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmscreens.CrmScreensFeature.*;

/**
 * R23 mass delete, API side (28 Oct 2026). Body shapes of the new build (taken from the Mass Delete screen):
 * selection {record_ids:[…]} and criteria {criteria:[{field, operator, value}]} on POST /modules/{m}/records/mass-delete;
 * list "Delete Selected" uses DELETE /modules/{m}/records/bulk?ids=a,b. More than 500 → 422 TOO_MANY_RECORDS (ids mode);
 * criteria mode over 500 runs as a background job (NDC-1224) — not run here (needs 500+ leads on shared staging).
 * Only "QA R2SC MD …" leads; whatever is deleted is purged from the bin afterwards.
 */
public class MassDeleteApiTest {
    private final List<String> leads = new ArrayList<>();
    private final String p = QA + "MD " + tag();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        removeLeads(api(), leads);
    }

    private boolean gone(String id) {
        return api().get("/modules/" + LEADS + "/records/" + id).statusCode() == 404;
    }

    @CaseId("MD-11")
    @Test(groups = {"crmscreens", "r23", "api", "NDC-1216"}, description = "Delete Selected (bulk ids) removes exactly the chosen leads; they go to the recycle bin")
    public void deleteSelected() {
        String a = createLead(api(), p + " 1", leads), b = createLead(api(), p + " 2", leads), keep = createLead(api(), p + " 3", leads);
        int s = api().delete("/modules/" + LEADS + "/records/bulk?ids=" + a + "," + b).statusCode();
        boolean inBin = qa.features.crmrecords.CrmRecordsApi.binItemOf(api(), a) != null;
        fact("MD-11", "bulk delete -> " + s + "; a gone " + gone(a) + ", b gone " + gone(b) + ", other kept " + !gone(keep) + "; in bin " + inBin);
        Assert.assertEquals(s, 204);
        Assert.assertTrue(gone(a) && gone(b), "selected leads not deleted");
        Assert.assertFalse(gone(keep), "a lead that was not selected was deleted");
        Assert.assertTrue(inBin, "deleted lead not in the recycle bin");
    }

    @CaseId("MD-12")
    @Test(groups = {"crmscreens", "r23", "api", "NDC-1216"}, description = "Mass Delete by ids returns matched / deleted counts")
    public void massDeleteByIds() {
        String a = createLead(api(), p + " 4", leads), b = createLead(api(), p + " 5", leads);
        Response r = CrmUser.ok(api().post("/modules/" + LEADS + "/records/mass-delete", m("record_ids", List.of(a, b))), "mass delete ids");
        fact("MD-12", body(r, 250));
        Assert.assertEquals(r.jsonPath().getInt("data.deleted"), 2);
        Assert.assertEquals(r.jsonPath().getInt("data.failed"), 0);
        Assert.assertTrue(gone(a) && gone(b));
    }

    @CaseId("MD-13")
    @Test(groups = {"crmscreens", "r23", "api", "NDC-1216"}, dependsOnMethods = {"deleteSelected", "massDeleteByIds"},
            description = "Mass Delete by criteria (Full Name starts with the run prefix) deletes only the matching leads")
    public void massDeleteByCriteria() {
        String a = createLead(api(), p + " 6", leads), b = createLead(api(), p + " 7", leads);
        Response r = CrmUser.ok(api().post("/modules/" + LEADS + "/records/mass-delete",
                m("criteria", List.of(m("field", "name", "operator", "starts_with", "value", p)))), "mass delete criteria");
        fact("MD-13", body(r, 250));
        // the run prefix also matches the lead kept by MD-11 ("… 3"): 3 matches expected
        Assert.assertEquals(r.jsonPath().getInt("data.matched"), 3, "criteria matched a different number of leads");
        Assert.assertTrue(gone(a) && gone(b));
    }

    @CaseId("MD-14")
    @Test(groups = {"crmscreens", "r23", "api"}, description = "Guards: 501 ids → 422 TOO_MANY_RECORDS; empty body → 400; unknown id → reported as failed")
    public void guards() {
        List<String> ids = new ArrayList<>();
        for (int i = 0; i < 501; i++) ids.add("00000000-0000-4000-8000-" + String.format("%012d", i));
        Response cap = api().post("/modules/" + LEADS + "/records/mass-delete", m("record_ids", ids));
        Response empty = api().post("/modules/" + LEADS + "/records/mass-delete", m("record_ids", List.of()));
        Response unknown = api().post("/modules/" + LEADS + "/records/mass-delete", m("record_ids", List.of("00000000-0000-4000-8000-000000000123")));
        fact("MD-14", "501 -> " + body(cap, 160) + "; empty -> " + body(empty, 120) + "; unknown -> " + body(unknown, 220));
        Assert.assertEquals(cap.statusCode(), 422);
        Assert.assertEquals(cap.jsonPath().getString("error.code"), "TOO_MANY_RECORDS");
        Assert.assertEquals(empty.statusCode(), 400);
        Assert.assertEquals(unknown.jsonPath().getInt("data.failed"), 1);
    }

    @CaseId("MD-15")
    @Test(groups = {"crmscreens", "r23", "api"}, description = "No mass delete job is left running for Leads")
    public void noActiveJob() {
        Response r = api().get("/modules/" + LEADS + "/mass-delete-jobs/active");
        fact("MD-15", body(r, 200));
        Assert.assertTrue(r.statusCode() == 204 || r.statusCode() == 404 || r.asString().isBlank() || !r.asString().contains("running"), "a mass delete job is still active");
    }

    @SuppressWarnings("unused")
    private static String name(Map<String, Object> rec) {
        return String.valueOf(rec.get("id"));
    }
}
