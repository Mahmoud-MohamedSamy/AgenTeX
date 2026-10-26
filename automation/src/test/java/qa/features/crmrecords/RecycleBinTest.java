package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.config.Config;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group RB — recycle bin: filters (NDC-1597 / 1600 / 1601), restore with a taken unique value (NDC-1603),
 * items of deleted modules (NDC-1797). Empty Bin (NDC-1602) is not automated: it empties the whole tenant's bin.
 */
public class RecycleBinTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @SuppressWarnings("unchecked")
    private static Set<String> facetModules(String query) {
        Map<String, Object> d = CrmUser.ok(owner().get("/audit/recycle-bin/facets" + query), "facets").jsonPath().getMap("data");
        Set<String> keys = new LinkedHashSet<>();
        Object mods = d.get("modules");
        if (mods instanceof List<?> l) for (Object o : l) if (o instanceof Map<?, ?> mm) keys.add(String.valueOf(mm.get("module_key")));
        return keys;
    }

    @CaseId("RB-02")
    @Test(groups = {"crmrecords", "wave2", "api", "regression", "NDC-1597", "NDC-1600", "NDC-1601"},
            description = "The module filter lists system modules too, Deleted by lists users, and choosing Leads keeps the other options")
    @SuppressWarnings("unchecked")
    public void filters() {
        Map<String, Object> d = CrmUser.ok(owner().get("/audit/recycle-bin/facets"), "facets").jsonPath().getMap("data");
        Set<String> all = facetModules("");
        Set<String> withLeads = facetModules("?module_key=leads");
        int users = 0;
        for (Map.Entry<String, Object> e : d.entrySet())
            if (!"modules".equals(e.getKey()) && e.getKey().matches("(?i).*(delet|user|actor).*") && e.getValue() instanceof List<?> l) users = Math.max(users, l.size());
        fact("RB-02 keys", "facet keys " + d.keySet());
        boolean system = all.stream().anyMatch(k -> k.matches("(?i).*(profile|org_unit|workflow|web_form|view).*"));
        fact("RB-02", all.size() + " modules (system ones=" + system + "), " + users + " users in Deleted by; with Leads chosen " + withLeads.size() + " modules");
        Assert.assertTrue(all.contains("leads"), "Leads is not in the module filter");
        Assert.assertTrue(system, "no system module (profile, org unit, workflow rule, web form, view) in the filter (NDC-1597)");
        Assert.assertTrue(users >= 2, "Deleted by lists " + users + " users (NDC-1600)");
        Assert.assertTrue(withLeads.size() >= all.size() - 1, "choosing Leads removed the other modules from the filter (NDC-1601): " + withLeads.size() + " of " + all.size());
    }

    @CaseId("RB-04")
    @Test(groups = {"crmrecords", "wave2", "api", "regression", "NDC-1603"}, description = "Restoring a record whose unique name is now used by another record is refused with a clear message")
    public void restoreWithTakenUniqueValue() {
        CrmModule acc = mod("accounts");
        String name = QA + "UNQ " + tag();
        String first = create(owner(), cleanup, acc, name, Map.of("account_name", name));
        CrmUser.ok(owner().delete("/modules/" + ACCOUNTS + "/records/" + first), "delete first");
        Response second = post(owner(), acc, Map.of("name", name, "account_name", name));
        if (second.statusCode() / 100 == 2) cleanup.record(acc, second.jsonPath().getString("data.id"));
        else throw new SkipException("INCONCLUSIVE: the second account with the freed name was refused: " + err(second));
        Map<String, Object> item = binItemOf(owner(), first);
        if (item == null) throw new SkipException("INCONCLUSIVE: the deleted account is not in the bin");
        Response r = restore(owner(), String.valueOf(item.get("id")));
        int firstNow = get(owner(), acc, first).statusCode();
        fact("RB-04", "restore while the name is taken -> " + err(r) + " " + r.asString().replaceAll("\\s+", " ").substring(0, Math.min(250, r.asString().length())) + "; first record read -> " + firstNow);
        Assert.assertEquals(firstNow, 404, "the record was restored although its unique name is taken");
        Assert.assertTrue(r.asString().toLowerCase().contains("conflict") || r.asString().toLowerCase().contains("already in use"),
                "the refusal does not say the name is taken: " + r.asString());
    }

    /**
     * NDC-1797: items whose module was deleted can't be deleted or restored, even by the Owner. Deleting one is
     * permanent, so it only runs with -Dw2.purgeOrphan=true (the ticket asks for exactly that to work).
     */
    @CaseId("RB-05")
    @Test(groups = {"crmrecords", "wave2", "api", "NDC-1797"}, description = "An item of a deleted module can be deleted forever by the Owner")
    public void orphanItemCanBeDeleted() {
        Set<String> live = new LinkedHashSet<>();
        for (Map<String, Object> mo : CrmUser.ok(owner().get("/modules"), "modules").jsonPath().<Map<String, Object>>getList("data")) {
            live.add(String.valueOf(mo.get("key")));
            live.add(String.valueOf(mo.get("apiName")));
            for (String k : List.of("api_name", "moduleKey", "module_key", "name", "pluralApiName", "plural_api_name")) live.add(String.valueOf(mo.get(k)));
        }
        List<Map<String, Object>> orphans = new ArrayList<>();
        for (Map<String, Object> i : binItems(owner())) {
            String app = String.valueOf(i.get("app_key"));
            String type = String.valueOf(i.get("entity_type"));
            if ("crm".equals(app) && !String.valueOf(i.get("module_key")).startsWith("module_") && !live.contains(String.valueOf(i.get("module_key")))) orphans.add(i);
        }
        fact("RB-05", orphans.size() + " CRM bin items of modules that no longer exist: "
                + orphans.stream().map(o -> String.valueOf(o.get("module_key"))).distinct().toList());
        if (orphans.isEmpty()) throw new SkipException("INCONCLUSIVE: no bin item of a deleted module found (check the item shape)");
        if (!Boolean.parseBoolean(Config.get("w2.purgeOrphan", "false")))
            throw new SkipException("NOT RUN: deleting an orphan item is permanent; rerun with -Dw2.purgeOrphan=true after approval");
        Response r = purge(owner(), List.of(String.valueOf(orphans.get(0).get("id"))));
        fact("RB-05", "delete forever of " + orphans.get(0).get("module_key") + " item -> " + err(r) + " " + r.asString().substring(0, Math.min(300, r.asString().length())));
        Assert.assertEquals(r.statusCode() / 100, 2, "the Owner can't delete the item of a deleted module");
        Assert.assertFalse(r.asString().contains("forbidden"), "the item was refused as forbidden");
    }
}
