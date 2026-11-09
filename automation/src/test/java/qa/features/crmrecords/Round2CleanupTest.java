package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Round 2 (27 Oct 2026): removes what the stopped probe run left on staging — one active record-lock rule on Leads and
 * the "QA R2W2" records — and purges them from the recycle bin. Runs first in suite crm-wave2-r2.
 */
public class Round2CleanupTest {
    private static final String LOCK = "907638b4-97f7-4fc8-9527-809d232605b4";
    private static final Map<String, List<String>> LEFT = Map.of(
            "leads", List.of("10ba77fe-deae-45ba-b617-118e07b6ea05", "cfec1089-e881-4345-a914-ba3e70a310bf", "5baca452-b409-4f2f-be70-d72c6e3439ec",
                    "741711e3-9cdb-461f-9430-87d90f5e4785", "0232b38e-26ec-45b9-b519-9777db955d87", "7e3c1678-eb06-461e-9ccb-edc04025d0df",
                    "b2db15b9-d7c4-4949-ac69-234424833126", "4467f1bf-20d7-4157-9b41-bc73c3b8e2ba", "e8cbf0da-ad12-4972-9230-b2c10eeb4171"),
            "cases", List.of("ffbb38a1-0e5d-47e2-bae8-748c5e53d46b", "9ffc8c13-3545-4cb9-9536-65c9c1e4bd90"),
            "po", List.of("6f334437-df98-4fae-8e85-4176d0abdb1f", "6ef594da-d6cc-49fd-8e8e-3fc3290665e1", "d429160b-3cbc-4b20-8bfc-6237a5ffd92f",
                    "281134d5-6aba-42da-a46d-ea22b1d19836", "8b2b895c-9add-4e57-b844-b7459dec5449"),
            "so", List.of("064b9efd-6ace-4c72-9265-16bf085105ee"),
            "deals", List.of("05ba5872-8a6d-4bae-86eb-fef15b1d03cb"));

    @Test(groups = {"crmrecords", "round2"}, description = "Delete the leftover QA R2W2 lock rule and records, purge them from the bin")
    public void cleanLeftovers() {
        CrmUser o = owner();
        fact("R2 cleanup", "delete lock rule -> " + o.delete("/modules/" + LEADS + "/record-locks/" + LOCK).statusCode());
        List<String> all = new ArrayList<>();
        LEFT.forEach((k, ids) -> {
            for (String id : ids) {
                Response r = o.delete("/modules/" + mod(k).id() + "/records/" + id);
                fact("R2 cleanup", "delete " + k + " " + id + " -> " + r.statusCode());
                all.add(id);
            }
        });
        List<String> items = new ArrayList<>();
        for (Map<String, Object> i : binItems(o)) if (Set.copyOf(all).contains(String.valueOf(i.get("record_id")))) items.add(String.valueOf(i.get("id")));
        for (int i = 0; i < items.size(); i += 50) fact("R2 cleanup", "purged " + Math.min(50, items.size() - i) + " -> " + purge(o, items.subList(i, Math.min(items.size(), i + 50))).statusCode());
        List<Map<String, Object>> locks = CrmUser.ok(o.get("/modules/" + LEADS + "/record-locks"), "locks").jsonPath().getList("data");
        fact("R2 cleanup", "record-lock rules left on Leads: " + locks.size());
    }
}
