package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group RC / RB — every one of the 15 modules: create, read, edit (owner kept), delete, find in the bin,
 * restore (NDC-1484, NDC-1832); a blank record is refused (NDC-1193); a normal user may delete only their own lead.
 * One record per module, owner account, all purged from the bin afterwards.
 */
public class RecordLifecycleTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @DataProvider(name = "modules")
    public Object[][] modules() {
        return MODULES.values().stream().map(m -> new Object[]{m.key()}).toArray(Object[][]::new);
    }

    @CaseId({"RC-01", "RC-06", "RC-09", "RB-03"})
    @Test(dataProvider = "modules", groups = {"crmrecords", "wave2", "api", "regression", "NDC-1484", "NDC-1832"},
            description = "Create -> read -> rename keeps the owner -> delete (404) -> in the bin -> restore (200)")
    public void lifecycle(String key) {
        CrmModule mod = mod(key);
        CrmUser o = owner();
        String name = QA + "RC " + key + " " + tag();
        String id = create(o, cleanup, mod, name, null);
        String ownerField = "calls".equals(key) ? "call_owner" : "owner";
        String owner0 = str(CrmUser.ok(get(o, mod, id), "read"), ownerField);

        CrmUser.ok(patch(o, mod, id, Map.of("name", name + " edited")), "rename");
        Response g = CrmUser.ok(get(o, mod, id), "read after edit");
        String owner1 = str(g, ownerField);

        int del = o.delete("/modules/" + mod.id() + "/records/" + id).statusCode();
        int after = get(o, mod, id).statusCode();
        Map<String, Object> item = binItemOf(o, id);
        int restored = item == null ? -1 : restore(o, String.valueOf(item.get("id"))).statusCode();
        int back = get(o, mod, id).statusCode();
        fact("RC " + key, "create 201, name now '" + str(g, "name") + "', owner " + owner0 + " -> " + owner1 + "; delete " + del
                + ", read " + after + ", in bin " + (item != null) + ", restore " + restored + ", read " + back);

        Assert.assertEquals(str(g, "name"), name + " edited", "the rename was not stored");
        Assert.assertEquals(owner1, owner0, "editing the record changed its owner (NDC-1832)");
        Assert.assertEquals(del, 204, "delete");
        Assert.assertEquals(after, 404, "a deleted record can still be read");
        Assert.assertNotNull(item, "the deleted record is not in the recycle bin");
        Assert.assertEquals(restored, 200, "restore from the bin");
        Assert.assertEquals(back, 200, "the restored record cannot be read");
    }

    @CaseId("RC-03")
    @Test(dataProvider = "modules", groups = {"crmrecords", "wave2", "api", "regression", "NDC-1193"},
            description = "A record with no fields at all is refused (422), in every module")
    public void blankRecordRefused(String key) {
        CrmModule mod = mod(key);
        Response r = owner().post("/modules/" + mod.id() + "/records", m("layout_id", mod.layout(), "data", java.util.List.of()));
        if (r.statusCode() / 100 == 2) cleanup.record(mod, r.jsonPath().getString("data.id"));
        fact("RC-03 " + key, "POST {data: []} -> " + err(r));
        Assert.assertEquals(r.statusCode(), 422, mod.label() + " accepted a blank record");
    }

    @CaseId("RC-14")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Test user 1 (User profile) creates and deletes their own lead but not the owner's (403)")
    public void normalUserDeletesOnlyOwnLead() {
        CrmModule leads = mod("leads");
        String own = create(user1(), cleanup, leads, QA + "RC14 own " + tag(), null);
        String other = create(owner(), cleanup, leads, QA + "RC14 owner " + tag(), null);
        int delOwn = user1().delete("/modules/" + LEADS + "/records/" + own).statusCode();
        Response delOther = user1().delete("/modules/" + LEADS + "/records/" + other);
        fact("RC-14", "user 1 deletes own lead -> " + delOwn + ", owner's lead -> " + err(delOther));
        Assert.assertEquals(delOwn, 204, "test user 1 could not delete their own lead");
        Assert.assertEquals(delOther.statusCode(), 403, "test user 1 deleted the owner's lead");
    }
}
