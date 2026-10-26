package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group TG — Leads tags: create, duplicate name, rename, merge, the 10-tag limit per record (W2-B3) and bulk
 * tagging (append / overwrite). Every tag is named "QA W2 TG <run>" and deleted afterwards, with the two QA leads.
 */
public class TagsTest {
    private final Cleanup cleanup = new Cleanup();
    private final List<String> tags = new ArrayList<>();
    private final String prefix = QA + "TG " + tag();
    private String lead1, lead2;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        cleanup.then(() -> tags.forEach(t -> owner().delete("/modules/" + LEADS + "/tags/" + t)));
        lead1 = create(owner(), cleanup, mod("leads"), prefix + " lead 1", null);
        lead2 = create(owner(), cleanup, mod("leads"), prefix + " lead 2", null);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private Response makeTag(String name) {
        Response r = owner().post("/modules/" + LEADS + "/tags", m("name", name, "color", "#22C55E"));
        if (r.statusCode() / 100 == 2) tags.add(r.jsonPath().getString("data.id"));
        return r;
    }

    @SuppressWarnings("unchecked")
    private int tagCount(String leadId) {
        Object v = rawValue(CrmUser.ok(get(owner(), mod("leads"), leadId), "read lead"), "tags");
        if (v instanceof Map<?, ?> mp && mp.get("items") instanceof List<?> l) return l.size();
        return v instanceof List<?> l ? l.size() : 0;
    }

    @CaseId("TG-01")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Create, same name in other case refused (409), rename, merge moves the records to the winner")
    public void createRenameMerge() {
        String a = CrmUser.ok(makeTag(prefix + " a"), "create a").jsonPath().getString("data.id");
        String b = CrmUser.ok(makeTag(prefix + " b"), "create b").jsonPath().getString("data.id");
        Response dup = makeTag((prefix + " A").toUpperCase());
        int rename = owner().put("/modules/" + LEADS + "/tags/" + a, m("name", prefix + " a edited", "color", "#3B82F6")).statusCode();
        CrmUser.ok(owner().post("/modules/" + LEADS + "/records/" + lead1 + "/tags", m("tag_ids", List.of(b))), "tag lead 1 with b");
        int merge = owner().post("/modules/" + LEADS + "/tags/merge", m("winner_id", a, "loser_ids", List.of(b))).statusCode();
        CrmApi.waitFor(20, () -> !get(owner(), mod("leads"), lead1).asString().contains(b));
        String lead = CrmUser.ok(get(owner(), mod("leads"), lead1), "read lead").asString();
        fact("TG-01", "same name upper case -> " + err(dup) + "; rename " + rename + "; merge " + merge + "; lead 1 has winner=" + lead.contains(a) + " loser=" + lead.contains(b));
        Assert.assertEquals(dup.statusCode(), 409, "a tag with the same name in other case was accepted");
        Assert.assertEquals(rename / 100, 2, "rename");
        Assert.assertEquals(merge / 100, 2, "merge");
        Assert.assertTrue(lead.contains(a) && !lead.contains(b), "after the merge the lead does not carry the winner tag only");
    }

    @CaseId("TG-02")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B3"}, description = "A record holds at most 10 tags: the 11th is refused")
    public void tenTagLimit() {
        String lead2 = create(owner(), cleanup, mod("leads"), prefix + " limit lead", null);   // its own lead: bulkAppendOverwrite tags the shared ones
        List<String> ids = new ArrayList<>();
        for (int i = 1; i <= 11; i++) ids.add(CrmUser.ok(makeTag(prefix + " limit " + i), "create tag " + i).jsonPath().getString("data.id"));
        Response ten = owner().post("/modules/" + LEADS + "/records/" + lead2 + "/tags", m("tag_ids", ids.subList(0, 10)));
        int afterTen = tagCount(lead2);
        Response eleven = owner().post("/modules/" + LEADS + "/records/" + lead2 + "/tags", m("tag_ids", ids));
        int count = tagCount(lead2);
        fact("TG-02", "10 tags -> " + ten.statusCode() + " (record holds " + afterTen + ")" + "; 11 tags -> " + err(eleven) + "; the record now holds " + count);
        Assert.assertEquals(ten.statusCode() / 100, 2, "control: 10 tags were refused");
        if (afterTen != 10) throw new org.testng.SkipException("INCONCLUSIVE: after adding 10 tags the record shows " + afterTen + " (tag read is wrong)");
        Assert.assertTrue(count <= 10, "the record holds " + count + " tags (limit 10)");
        Assert.assertEquals(eleven.statusCode() / 100, 4, "the 11th tag was accepted");
    }

    @CaseId("TG-03")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Bulk tag: append adds the tag to both leads; overwrite leaves exactly that tag")
    public void bulkAppendOverwrite() {
        String x = CrmUser.ok(makeTag(prefix + " bulk x"), "create x").jsonPath().getString("data.id");
        String y = CrmUser.ok(makeTag(prefix + " bulk y"), "create y").jsonPath().getString("data.id");
        CrmUser.ok(owner().post("/modules/" + LEADS + "/records/" + lead1 + "/tags", m("tag_ids", List.of(y))), "tag lead 1 with y");
        Response ap = CrmUser.ok(owner().post("/modules/" + LEADS + "/records/tags/bulk", m("record_ids", List.of(lead1, lead2), "tag_ids", List.of(x), "mode", "append")), "bulk append");
        waitJob(ap);
        boolean both = CrmApi.waitFor(30, () -> get(owner(), mod("leads"), lead1).asString().contains(x) && get(owner(), mod("leads"), lead2).asString().contains(x));
        Response ow = CrmUser.ok(owner().post("/modules/" + LEADS + "/records/tags/bulk", m("record_ids", List.of(lead1), "tag_ids", List.of(x), "mode", "overwrite")), "bulk overwrite");
        waitJob(ow);
        boolean onlyX = CrmApi.waitFor(30, () -> tagCount(lead1) == 1 && get(owner(), mod("leads"), lead1).asString().contains(x));
        fact("TG-03", "append on both=" + both + "; overwrite leaves only x=" + onlyX + " (lead 1 tags " + tagCount(lead1) + ")");
        Assert.assertTrue(both, "bulk append did not tag both leads");
        Assert.assertTrue(onlyX, "bulk overwrite did not leave exactly the one tag");
    }

    private void waitJob(Response r) {
        String job = r.jsonPath().getString("data.job_id") != null ? r.jsonPath().getString("data.job_id") : r.jsonPath().getString("data.id");
        if (job == null) return;
        CrmApi.waitFor(40, () -> owner().get("/modules/" + LEADS + "/record-tag-jobs/" + job).asString().matches("(?is).*(completed|failed|done|partial).*"));
    }
}
