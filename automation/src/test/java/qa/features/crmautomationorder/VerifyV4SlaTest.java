package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/** Re-verification (19 Oct 2026): blueprint state SLA escalation, watched for 25 minutes. Session V4. */
public class VerifyV4SlaTest extends VerifyBase {
    @Override protected String session() { return "V4"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    @CaseId("E-09")
    @Test(groups = {"crm-verify"}, description = "State SLA 1 minute with a Set Field escalation: watched up to 25 minutes")
    @SuppressWarnings("unchecked")
    public void e09Sla() {
        String c = "E-09";
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), null);
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
        s0.put("slaMinutes", 1);
        s0.put("slaEscalation", List.of(CrmProcs.setField("description", "QA E-09 SLA escalated")));
        ((List<Map<String, Object>>) def.get("states")).set(0, s0);
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        get(c, adminB(), "/modules/" + LEADS + "/blueprints/" + bp);
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, userN(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        get(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/blueprint-state");
        long t0 = System.currentTimeMillis();
        boolean fired = CrmApi.waitFor(1500, () -> "QA E-09 SLA escalated".equals(val(LEADS, id, "description")));
        Response st = get(c, adminB(), "/modules/" + LEADS + "/records/" + id + "/blueprint-state");
        fact(c, "lead " + id + " escalation fired=" + fired + " after ~" + (System.currentTimeMillis() - t0) / 1000 + "s; description=" + val(LEADS, id, "description"));
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }
}
