package qa.features.crmaccess;

import org.testng.annotations.Test;
import qa.features.crmrecords.CrmRecordsApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.fact;
import static qa.features.crmrecords.CrmRecordsApi.owner;

/** Round 2 Wave 1 clean-up: purge the recycle-bin items of this wave's QA records ("QA R2W1 ", "QA W1 "). */
public class R2W1BinSweepTest {
    @Test(groups = {"crmaccess", "r2w1", "cleanup"})
    public void purgeQaBinItems() {
        List<String> ids = new ArrayList<>();
        for (Map<String, Object> i : CrmRecordsApi.binItems(owner())) {
            String label = String.valueOf(i.get("record_label"));
            if (label.startsWith("QA R2W1 ") || label.startsWith("QA W1 ")) ids.add(String.valueOf(i.get("id")));
        }
        for (int k = 0; k < ids.size(); k += 50)
            fact("cleanup", "purged " + Math.min(50, ids.size() - k) + " -> " + CrmRecordsApi.purge(owner(), ids.subList(k, Math.min(ids.size(), k + 50))).statusCode());
        long left = CrmRecordsApi.binItems(owner()).stream().filter(i -> String.valueOf(i.get("record_label")).matches("QA (R2W1|W1) .*")).count();
        fact("cleanup", "QA R2W1 / QA W1 bin items found " + ids.size() + ", left " + left);
    }
}
