package qa.features.crmautomationorder;

import org.testng.annotations.Test;

import java.util.LinkedHashMap;
import java.util.Map;

/** Probe (27 Oct 2026, run 2 triage): may test user 2 create a lead with / without phone, and may the Supervisor read a lead CRM Admin B owns. Probe records are deleted. */
public class R2W3Probe2Test {
    @Test(groups = {"r2w3-probe"})
    public void phoneAndVisibility() {
        CrmUser a = CrmUser.as(CrmOrderFeature.ADMIN_A);
        CrmApi api = new CrmApi(a);
        CrmUser v = CrmUser.as(CrmOrderFeature.USER_V);
        String L = CrmOrderFeature.LEADS, S = CrmOrderFeature.LEADS_STANDARD;
        Map<String, Object> with = new LinkedHashMap<>(CrmApi.minimal(L, "QA R2W3 probe v phone"));
        Map<String, Object> without = new LinkedHashMap<>(with);
        without.remove("phone");
        for (Map<String, Object> f : java.util.List.of(with, without)) {
            var c = api.createRaw(v, L, S, f);
            String b = c.asString().replaceAll("\s+", " ");
            System.out.println("[p2] test user 2 create lead phone=" + f.containsKey("phone") + " -> " + c.statusCode() + " " + b.substring(0, Math.min(260, b.length())));
            if (c.statusCode() / 100 == 2) {
                String id = c.jsonPath().getString("data.id");
                System.out.println("[p2] read back phone=" + a.get("/modules/" + L + "/records/" + id).jsonPath().getString("data.data.phone") + "; delete -> " + a.delete("/modules/" + L + "/records/" + id).statusCode());
            }
        }
        CrmUser b = CrmUser.as(CrmOrderFeature.ADMIN_B);
        var c = api.createRaw(b, L, S, CrmApi.minimal(L, "QA R2W3 probe b lead"));
        System.out.println("[p2] admin B create -> " + c.statusCode());
        if (c.statusCode() / 100 == 2) {
            String id = c.jsonPath().getString("data.id");
            CrmUser s = CrmUser.as(CrmOrderFeature.SUPERVISOR);
            System.out.println("[p2] Supervisor GET admin B lead -> " + s.get("/modules/" + L + "/records/" + id).statusCode());
            System.out.println("[p2] Supervisor GET approval state of it -> " + s.get("/workflow/approvals/records/" + L + "/" + id).statusCode());
            System.out.println("[p2] admin A GET approval state of it -> " + a.get("/workflow/approvals/records/" + L + "/" + id).statusCode());
            System.out.println("[p2] delete -> " + a.delete("/modules/" + L + "/records/" + id).statusCode());
        }
    }
}
