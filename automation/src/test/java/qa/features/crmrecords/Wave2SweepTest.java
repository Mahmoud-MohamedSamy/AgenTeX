package qa.features.crmrecords;

import org.testng.Assert;
import org.testng.annotations.Test;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Leftover sweep after an aborted run: deletes live Leads named "QA W2 …" and purges every bin item whose label starts
 * with "QA W2 " (this wave's prefix only; other sessions use other prefixes). Run on its own: -Dtest=Wave2SweepTest.
 */
public class Wave2SweepTest {

    @Test(groups = {"crmrecords-sweep"}, description = "No live QA W2 lead and no QA W2 item in the recycle bin")
    public void sweep() {
        CrmUser o = owner();
        List<String> live = leadIdsByPrefix(o, QA);
        for (String id : live) o.delete("/modules/" + LEADS + "/records/" + id);
        List<String> items = new ArrayList<>();
        for (Map<String, Object> i : binItems(o)) if (String.valueOf(i.get("record_label")).startsWith(QA)) items.add(String.valueOf(i.get("id")));
        for (int i = 0; i < items.size(); i += 50) purge(o, items.subList(i, Math.min(items.size(), i + 50)));
        long left = binItems(o).stream().filter(i -> String.valueOf(i.get("record_label")).startsWith(QA)).count();
        fact("sweep", "deleted " + live.size() + " live QA W2 leads, purged " + items.size() + " QA W2 bin items, left " + left);
        Assert.assertEquals(left, 0L, "QA W2 items are still in the bin");
    }
}
