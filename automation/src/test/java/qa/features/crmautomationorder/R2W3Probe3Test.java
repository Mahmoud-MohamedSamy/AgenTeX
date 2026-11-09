package qa.features.crmautomationorder;

import org.testng.annotations.Test;

import java.util.List;
import java.util.Map;

/** Probe (28 Oct 2026): which record keeps 'QA AEO SG G-10 appr' pending - is it a lead made by the G-10 blueprint After action? Read-only. */
public class R2W3Probe3Test {
    @Test(groups = {"r2w3-probe"})
    @SuppressWarnings("unchecked")
    public void g10Leftover() {
        CrmUser a = CrmUser.as(CrmOrderFeature.ADMIN_A);
        for (int p = 1; p <= 40; p++) {
            List<Map<String, Object>> rows = CrmApi.listPage(a, CrmOrderFeature.LEADS, p);
            for (Map<String, Object> r : rows) {
                String s = String.valueOf(r);
                if (!s.contains("G-10")) continue;
                String id = String.valueOf(r.get("id"));
                var st = a.get("/workflow/approvals/records/" + CrmOrderFeature.LEADS + "/" + id);
                System.out.println("[p3] lead " + id + " created " + r.get("created_at") + " source " + r.get("source") + " layout " + r.get("layout_id")
                        + " nameHit " + s.substring(Math.max(0, s.indexOf("G-10") - 12), Math.min(s.length(), s.indexOf("G-10") + 40))
                        + " approval -> " + st.statusCode() + " " + st.asString().substring(0, Math.min(300, st.asString().length())));
            }
            if (rows.size() < 100) break;
        }
        var rec = a.get("/modules/" + CrmOrderFeature.LEADS + "/records/58c8afb3-038e-4da8-8823-b8a2569869b7");
        System.out.println("[p3] record 58c8afb3 -> " + rec.statusCode() + " " + rec.asString().substring(0, Math.min(2500, rec.asString().length())));
        for (Object o : CrmUser.ok(a.get("/workflow/approval-processes"), "aps").jsonPath().getList("data"))
            if (String.valueOf(((Map<?, ?>) o).get("name")).contains("G-10")) System.out.println("[p3] process " + o);
    }
}
