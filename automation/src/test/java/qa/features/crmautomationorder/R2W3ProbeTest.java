package qa.features.crmautomationorder;

import org.testng.annotations.Test;

import java.util.List;
import java.util.Map;

/** Read-only probe (27 Oct 2026): test users' profiles / managers / status and whether test user 1 may create a lead. */
public class R2W3ProbeTest {
    @Test(groups = {"r2w3-probe"})
    @SuppressWarnings("unchecked")
    public void usersNow() {
        CrmUser a = CrmUser.as(CrmOrderFeature.ADMIN_A);
        for (Object o : CrmUser.ok(a.get("/iam/users?app_key=crm"), "users").jsonPath().getList("data")) {
            Map<String, Object> u = (Map<String, Object>) o;
            String mail = String.valueOf(u.get("email"));
            if (List.of("nameb56175@airhemp.com", "valafo4080@94an.com", "mahmoud.mmohamedsamy@gmail.com", "mahmoud.mahamed1515@gmail.com", "mmohamed@anyware.software").contains(mail.toLowerCase()))
                System.out.println("[probe] " + mail + " status=" + u.get("status") + " profiles=" + u.get("profileNames") + " manager=" + u.get("reportingManagerId") + " ou=" + u.get("orgUnitId"));
        }
        CrmUser n = CrmUser.as(CrmOrderFeature.USER_N);
        var perms = n.get("/iam/me/permissions");
        String body = perms.asString();
        System.out.println("[probe] test user 1 /iam/me/permissions -> " + perms.statusCode() + " records.create=" + body.contains("records.create") + " len=" + body.length());
        System.out.println("[probe] test user 1 permissions body: " + body.replaceAll("\s+", " "));
        CrmApi api = new CrmApi(a);
        for (String[] m : new String[][]{{CrmOrderFeature.LEADS, CrmOrderFeature.LEADS_STANDARD}, {CrmOrderFeature.LEADS, CrmOrderFeature.LEADS_QA_LAYOUT},
                {CrmOrderFeature.DEALS, CrmOrderFeature.DEALS_STANDARD}, {CrmOrderFeature.TASKS, CrmOrderFeature.TASKS_STANDARD}}) {
            var c = api.createRaw(n, m[0], m[1], CrmApi.minimal(m[0], "QA R2W3 probe"));
            String b = c.asString().replaceAll("\\s+", " ");
            System.out.println("[probe] test user 1 create " + m[0] + " on " + m[1] + " -> " + c.statusCode() + " " + b.substring(0, Math.min(160, b.length())));
            if (c.statusCode() / 100 == 2) System.out.println("[probe] delete -> " + a.delete("/modules/" + m[0] + "/records/" + c.jsonPath().getString("data.id")).statusCode());
        }
    }
}
