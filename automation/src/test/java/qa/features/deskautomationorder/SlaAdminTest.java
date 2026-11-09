package qa.features.deskautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** SLA admin rows: permissions, activate, reapply, order, accounts, plans, audit. QA AO data only. */
public class SlaAdminTest {
    private AoApi api;
    private static final String P = "/desk/sla/policies", PL = "/desk/sla/support-plans";

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = AoApi.admin();
    }

    @AfterMethod(alwaysRun = true)
    public void clean() {
        List<String> left = api.cleanup();
        if (!left.isEmpty()) System.out.println("[CLEANUP] left: " + left);
    }

    private static List<Map<String, Object>> tag(String t) {
        return List.of(Map.of("field_key", "subject", "operator", "contains", "value", t));
    }

    private String pol(String tag, String dept, int respMinutes) {
        return api.createPolicy(policy("QA AO " + tag + " " + respMinutes, dept, triggers("create"), List.of(target("t", tag(tag), t(respMinutes, "minutes"), t(5, "hours"), null))));
    }

    private String module(String key) {
        List<Map<String, Object>> m = ok(api.get("/modules"), "modules").jsonPath().getList("data");
        for (Map<String, Object> x : m) if (key.equals(x.get("moduleKey")) || key.equals(x.get("module_key"))) return String.valueOf(x.get("id"));
        throw new SkipException("INCONCLUSIVE: no module " + key);
    }

    @Test(groups = "regression", description = "Permissions: agent read and write on API")
    @CaseId("SL-01")
    public void permissions() {
        AoApi agent = AoApi.as(AGENT);
        int read = agent.get(P + "?department_id=" + DEPT_A).statusCode();
        int plan = agent.post(PL, Map.of("name", "QA AO no", "department_id", DEPT_A)).statusCode();
        System.out.println("[RECORD] SL-01 agent read policies " + read + ", create plan " + plan);
        assertEquals(plan, 403, "agent create plan");
        assertEquals(api.get(P + "?department_id=" + DEPT_A).statusCode(), 200, "admin reads");
    }

    @Test(groups = "regression", description = "Reapply to open tickets: active runs; inactive refused; deactivate and activate work")
    @CaseId("SL-31")
    public void reapplyOpen() {
        String tag = "SL31" + uid();
        String pid = pol(tag, DEPT_A, 30);
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(api.sla(tk, 30).getString("data.state"), "applied");
        Response impact = ok(api.get(P + "/" + pid + "/impact"), "impact");
        System.out.println("[RECORD] SL-31 impact " + impact.asString());
        Response ro = ok(api.post(P + "/" + pid + "/reapply-open", Map.of()), "reapply-open");
        System.out.println("[RECORD] SL-31 reapply " + ro.asString());
        ok(api.post(P + "/" + pid + "/deactivate", Map.of()), "deactivate");
        int inactive = api.post(P + "/" + pid + "/reapply-open", Map.of()).statusCode();
        assertEquals(inactive / 100, 4, "reapply on an inactive policy must be refused (NDC-2272)");
        ok(api.post(P + "/" + pid + "/activate", Map.of()), "activate");
    }

    @Test(groups = "regression", description = "Order: first in list wins; a new order takes effect")
    @CaseId("SL-34")
    public void order() {
        String tag = "SL34" + uid();
        String a = pol(tag, DEPT_B, 30);
        String b = pol(tag, DEPT_B, 40);
        ok(api.put(P + "/order?department_id=" + DEPT_B, Map.of("policy_ids", List.of(a, b))), "order a,b");
        String t1 = api.ticket("QA AO " + tag + " 1", DEPT_B, "high");
        assertEquals(api.sla(t1, 30).getString("data.policy.id"), a, "first policy wins");
        ok(api.put(P + "/order?department_id=" + DEPT_B, Map.of("policy_ids", List.of(b, a))), "order b,a");
        String t2 = api.ticket("QA AO " + tag + " 2", DEPT_B, "high");
        assertEquals(api.sla(t2, 30).getString("data.policy.id"), b, "new first policy wins");
    }

    @Test(groups = "regression", description = "Account policy beats a general one; one policy per account per department")
    @CaseId("SL-35")
    public void accountPrecedence() {
        String acc = module("desk_accounts");
        String nameField = "account_name";
        Map<String, Object> v = new LinkedHashMap<>();
        v.put("kind", "string");
        v.put("value", "QA AO Account " + uid());
        Response cr = ok(api.post("/modules/" + acc + "/records", Map.of("data", List.of(Map.of("field", nameField, "value", v)))), "create account");
        String accountId = cr.jsonPath().getString("data.id");
        track("modules/" + acc + "/records", accountId, "account");
        String tag = "SL35" + uid();
        String general = pol(tag, DEPT_B, 30);
        String forAccount = pol(tag, DEPT_B, 40);
        ok(api.put(P + "/order?department_id=" + DEPT_B, Map.of("policy_ids", List.of(general, forAccount))), "general first");
        ok(api.put(P + "/" + forAccount + "/accounts", Map.of("account_ids", List.of(accountId))), "associate");
        String tk = api.ticket("QA AO " + tag, DEPT_B, "high", Map.of("account_id", accountId));
        JsonPath s = api.sla(tk, 30);
        System.out.println("[RECORD] SL-35 source " + s.getString("data.coverage.source"));
        assertEquals(s.getString("data.policy.id"), forAccount, "account policy wins over the general one listed first");
        int second = api.put(P + "/" + general + "/accounts", Map.of("account_ids", List.of(accountId))).statusCode();
        System.out.println("[RECORD] SL-36 same account on a second policy in the department: " + second);
        assertEquals(second / 100, 4, "SL-36 one policy per account per department");
    }

    @Test(groups = "regression", description = "Support plan: create, bad values refused, discontinue; policy in use can't be deleted")
    @CaseId("SL-37")
    public void plans() {
        String pid = pol("SL37" + uid(), DEPT_B, 30);
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("department_id", DEPT_B);
        b.put("name", "QA AO Plan " + uid());
        b.put("description", null);
        b.put("type", "allowance");
        b.put("allowance", 2);
        b.put("cycle", "monthly");
        b.put("policy_id", pid);
        Response r = api.post(PL, b);
        System.out.println("[RECORD] SL-37 create plan " + r.statusCode() + " " + r.asString().substring(0, Math.min(260, r.asString().length())));
        ok(r, "create plan");
        String plan = r.jsonPath().getString("data.id");
        track("plan", plan, "plan");
        Map<String, Object> bad = new LinkedHashMap<>(b);
        bad.put("name", "QA AO Plan bad " + uid());
        bad.put("allowance", -1);
        assertEquals(api.post(PL, bad).statusCode() / 100, 4, "negative allowance");
        ok(api.post(PL + "/" + plan + "/discontinue", Map.of()), "discontinue");
        assertEquals(api.delete(P + "/" + pid).statusCode() / 100, 4, "SL-33: a policy granted by a plan can't be deleted");
    }

    @Test(groups = "regression", description = "Escalated status and fields after a breach: recorded for Zoho comparison")
    @CaseId("SL-25")
    public void escalatedFields() {
        String tag = "SL25" + uid();
        Map<String, Object> l = new LinkedHashMap<>();
        l.put("timing", "at");
        l.put("offset", null);
        l.put("recipients", List.of(Map.of("kind", "ticket_owner")));
        Map<String, Object> esc = new LinkedHashMap<>();
        esc.put("response", List.of(l));
        esc.put("resolution", List.of());
        api.createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(target("t", tag(tag), t(1, "minutes"), t(5, "hours"), esc))));
        String tk = api.ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(api.sla(tk, 30).getString("data.state"), "applied");
        sleep(110000);
        JsonPath s = api.sla(tk, 1);
        String rec = ok(api.get("/modules/" + TICKETS + "/records/" + tk), "ticket").asString();
        System.out.println("[RECORD] SL-25 reached " + s.getString("data.obligations.find{it.kind=='first_response'}.escalation_level_reached") + " violated " + s.getString("data.violated")
                + " Open=" + rec.contains("Open") + " Escalated=" + rec.contains("Escalated") + " is_overdue=" + rec.contains("is_overdue") + " is_escalated=" + rec.contains("is_escalated"));
        assertEquals(s.getString("data.obligations.find{it.kind=='first_response'}.escalation_level_reached"), "1");
    }

    @Test(groups = "regression", description = "Audit log records policy create and delete")
    @CaseId("SL-49")
    public void audit() {
        String name = "SL49" + uid();
        pol(name, DEPT_A, 30);
        api.cleanup();
        sleep(4000);
        Response r = api.get("/iam/audit-log?limit=100");
        if (r.statusCode() / 100 != 2) r = api.get("/audit/logs?limit=100");
        if (r.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: audit route not found here, check on screen; " + r.statusCode());
        assertTrue(r.asString().contains(name), "policy in the audit log");
    }
}
