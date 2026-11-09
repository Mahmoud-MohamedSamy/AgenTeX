package qa.features.crmautomationorder;

import org.testng.annotations.Test;

import java.util.Map;

/** Read-only probe (27 Oct 2026): access mode and assigned profiles of the QA and Standard Leads layouts, and the profile list. */
public class R2W3LayoutProbeTest {
    @Test(groups = {"r2w3-probe"})
    @SuppressWarnings("unchecked")
    public void layoutAccess() {
        CrmUser a = CrmUser.as(CrmOrderFeature.ADMIN_A);
        for (String id : new String[]{CrmOrderFeature.LEADS_QA_LAYOUT, CrmOrderFeature.LEADS_STANDARD}) {
            Map<String, Object> l = CrmUser.ok(a.get("/modules/" + CrmOrderFeature.LEADS + "/layouts/" + id), "layout").jsonPath().getMap("data");
            System.out.println("[lprobe] " + l.get("name") + " accessMode=" + l.get("accessMode") + " assignedProfiles=" + l.get("assignedProfiles") + " status=" + l.get("status"));
        }
        var p = a.get("/iam/profiles?app_key=crm");
        System.out.println("[lprobe] profiles -> " + p.statusCode());
        if (p.statusCode() == 200) for (Object o : p.jsonPath().getList("data")) {
            Map<String, Object> m = (Map<String, Object>) o;
            System.out.println("[lprobe] profile " + m.get("id") + " " + m.get("name"));
        }
    }
}
