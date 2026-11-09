package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.Waits;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Round 2 Wave 2 (27 Oct 2026, build index-De3hTVb3.js): the record functions round 1 did not cover — merge (R21),
 * mass update of every field type (R22), mass transfer of owner (R24), record locking (R26), Cases and Sales / Purchase
 * Orders in full (R07, R08), clone (R13) and the advanced filter operators (R33). Shapes found by API probes on the same
 * day (executions/execu_2026-10-27_crm-golive-round2/wave2/after/probe*.json). All data "QA W2 R2 …", removed afterwards.
 */
public class Round2RecordsTest {
    private static final String ADMIN_A = "mmohamed@anyware.software";
    private static final String ADMIN_A_ID = "7e5e7c27-46e4-4bf6-b021-7bd219d34472";
    private final Cleanup cleanup = new Cleanup();
    private final List<String> lockRules = new ArrayList<>();
    private final List<String[]> views = new ArrayList<>();
    private final String t = tag();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.then(() -> lockRules.forEach(id -> fact("cleanup", "delete lock rule -> " + owner().delete("/modules/" + LEADS + "/record-locks/" + id).statusCode())));
        cleanup.then(() -> views.forEach(v -> owner().delete("/modules/" + v[0] + "/views/" + v[1])));
        cleanup.run();
    }

    private static Map<String, Object> n(Object v) {
        return m("kind", "number", "value", v);
    }

    /** Record body with values already in API shape (kind/value maps) or plain strings. */
    private static List<Map<String, Object>> data(Map<String, Object> f) {
        List<Map<String, Object>> d = new ArrayList<>();
        f.forEach((k, v) -> d.add(m("field", k, "value", v instanceof Map ? v : m("kind", "string", "value", String.valueOf(v)))));
        return d;
    }

    private String createRaw(CrmModule mod, Map<String, Object> f) {
        Response r = owner().post("/modules/" + mod.id() + "/records", m("layout_id", mod.layout(), "data", data(f)));
        CrmUser.ok(r, "create " + mod.key());
        String id = r.jsonPath().getString("data.id");
        cleanup.record(mod, id);
        return id;
    }

    private Response massUpdate(CrmModule mod, List<String> ids, Map<String, Object> f) {
        return owner().post("/modules/" + mod.id() + "/records/mass-update", m("record_ids", ids, "data", data(f)));
    }

    @CaseId("R21")
    @Test(groups = {"crmrecords", "round2", "api"}, description = "Merge: the duplicate is removed, the master stays with its values")
    public void mergeRecords() {
        CrmModule leads = mod("leads");
        String a = create(owner(), cleanup, leads, QA + "R2 MG A " + t, Map.of("company", "Alpha"));
        String b = create(owner(), cleanup, leads, QA + "R2 MG B " + t, Map.of("company", "Beta"));
        Response noDup = owner().post("/modules/" + LEADS + "/records/" + a + "/merge", Map.of());
        Response r = owner().post("/modules/" + LEADS + "/records/" + a + "/merge", m("duplicate_ids", List.of(b)));
        int dup = get(owner(), leads, b).statusCode();
        String company = str(CrmUser.ok(get(owner(), leads, a), "master"), "company");
        List<String> tl = entryTypes(timeline(owner(), "leads", a));
        fact("R21", "merge without duplicates -> " + err(noDup) + "; merge -> " + err(r) + "; duplicate read -> " + dup + "; master company " + company + "; master timeline " + tl);
        Assert.assertEquals(noDup.statusCode(), 400, "a merge without duplicates is not refused");
        Assert.assertEquals(r.statusCode(), 200, "merge");
        Assert.assertEquals(dup, 404, "the duplicate still exists after the merge");
        Assert.assertEquals(company, "Alpha", "the master lost its own value");
    }

    @CaseId("R26")
    @Test(groups = {"crmrecords", "round2", "api", "R2W2-C1"}, description = "Record lock: a record matching an active lock rule can't be edited")
    public void recordLockEnforced() {
        Response bad = owner().post("/modules/" + LEADS + "/record-locks", m("name", QA + "R2 lock bad " + t, "condition", "zz not a condition !!"));
        if (bad.statusCode() / 100 == 2) lockRules.add(bad.jsonPath().getString("data.id"));
        Response rule = owner().post("/modules/" + LEADS + "/record-locks", m("name", QA + "R2 lock " + t, "condition", "first_name starts_with " + QA + "R2 LK"));
        if (rule.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: lock rule not created: " + err(rule));
        lockRules.add(rule.jsonPath().getString("data.id"));
        String id = create(owner(), cleanup, mod("leads"), QA + "R2 LK " + t, null);
        Waits.sleep(2000);
        Response edit = CrmUser.as(ADMIN_A).patch("/modules/" + LEADS + "/records/" + id, m("data", CrmApi.data(new LinkedHashMap<>(Map.of("company", "QA locked edit")))));
        String now = str(get(owner(), mod("leads"), id), "company");
        fact("R26", "rule with nonsense condition -> " + err(bad) + "; rule -> " + err(rule) + "; CRM Admin A edits a matching lead -> " + err(edit) + "; company now " + now);
        Assert.assertNotEquals(now, "QA locked edit", "a record matching an active lock rule was edited");
        Assert.assertEquals(bad.statusCode() / 100, 4, "a lock rule with a nonsense condition was accepted");
    }

    @CaseId({"R22", "R24"})
    @Test(groups = {"crmrecords", "round2", "api"}, description = "Mass update stores every field type; mass transfer moves the owner")
    public void massUpdateAndTransfer() {
        CrmModule leads = mod("leads");
        List<String> ids = List.of(create(owner(), cleanup, leads, QA + "R2 MU 1 " + t, null), create(owner(), cleanup, leads, QA + "R2 MU 2 " + t, null));
        Map<String, Object> want = new LinkedHashMap<>();
        want.put("company", "QA R2 Co");
        want.put("email", "qa.r2.mu@example.com");
        want.put("lead_source", "web");
        want.put("lead_status", "Busy");
        want.put("lead_status_comment", "line 1\nline 2");
        StringBuilder facts = new StringBuilder();
        List<String> wrong = new ArrayList<>();
        for (Map.Entry<String, Object> e : want.entrySet()) {
            Response r = massUpdate(leads, ids, Map.of(e.getKey(), e.getValue()));
            String stored = str(get(owner(), leads, ids.get(1)), e.getKey());
            facts.append(e.getKey()).append(' ').append(r.statusCode()).append('=').append(stored).append("; ");
            if (r.statusCode() != 200 || !String.valueOf(e.getValue()).equals(stored)) wrong.add(e.getKey());
        }
        Response tr = massUpdate(leads, ids, Map.of("owner", ADMIN_A_ID));
        String owner1 = str(get(owner(), leads, ids.get(0)), "owner");
        int seen = CrmUser.as(ADMIN_A).get("/modules/" + LEADS + "/records/" + ids.get(0)).statusCode();
        fact("R22/R24", facts + "transfer -> " + tr.statusCode() + ", owner " + owner1 + ", CRM Admin A reads it -> " + seen);
        Assert.assertTrue(wrong.isEmpty(), "mass update did not store: " + wrong);
        Assert.assertEquals(owner1, ADMIN_A_ID, "mass transfer did not move the owner");
        Assert.assertEquals(seen, 200, "the new owner can't open the transferred record");
    }

    @CaseId({"R07", "R08"})
    @Test(groups = {"crmrecords", "round2", "api"}, description = "Cases, Purchase Orders and Sales Orders store every field type and can be edited, mass updated, deleted and restored")
    @SuppressWarnings("unchecked")
    public void casesAndOrders() {
        String today = LocalDate.now().toString();
        Map<String, Object> cf = new LinkedHashMap<>();
        cf.put("name", QA + "R2 Case " + t);
        cf.put("subject", QA + "R2 Case " + t);
        cf.put("status", "New");
        cf.put("case_origin", "Web");
        cf.put("priority", "High");
        cf.put("email", "qa.r2.case@example.com");
        cf.put("description", "QA عربي");
        cf.put("no_of_comments", n(3));
        cf.put("multi_select", m("kind", "array", "items", List.of(m("kind", "string", "value", "Option 1"), m("kind", "string", "value", "قنا"))));
        String c = createRaw(mod("cases"), cf);
        Response cg = CrmUser.ok(get(owner(), mod("cases"), c), "case");
        Object multi = rawValue(cg, "multi_select");
        Map<String, Object> pf = new LinkedHashMap<>();
        pf.put("name", QA + "R2 PO " + t);
        pf.put("subject", QA + "R2 PO " + t);
        pf.put("po_date", today);
        pf.put("carrier", "DHL");
        pf.put("tax", n(12.5));
        String p = createRaw(mod("po"), pf);
        Response pmu = massUpdate(mod("po"), List.of(p), Map.of("status", "Approved", "tax", n(20)));
        Response pg = CrmUser.ok(get(owner(), mod("po"), p), "po");
        Map<String, Object> sf = new LinkedHashMap<>();
        sf.put("name", QA + "R2 SO " + t);
        sf.put("subject", QA + "R2 SO " + t);
        sf.put("branch", "Mansoura");
        sf.put("mobile", n(1012345678));
        sf.put("date_of_birth", "1990-05-01");
        sf.put("amount", n(1500));
        String s = createRaw(mod("so"), sf);
        Response sg = CrmUser.ok(get(owner(), mod("so"), s), "so");
        int del = owner().delete("/modules/" + mod("so").id() + "/records/" + s).statusCode();
        Map<String, Object> item = binItemOf(owner(), s);
        int rest = item == null ? -1 : restore(owner(), String.valueOf(item.get("id"))).statusCode();
        String facts = "case priority=" + str(cg, "priority") + " email=" + str(cg, "email") + " desc=" + str(cg, "description") + " comments=" + str(cg, "no_of_comments")
                + " multi=" + multi + " number=" + str(cg, "case_number") + "; PO date=" + str(pg, "po_date") + " carrier=" + str(pg, "carrier") + " status=" + str(pg, "status")
                + " tax=" + str(pg, "tax") + " (mass update " + pmu.statusCode() + "); SO branch=" + str(sg, "branch") + " mobile=" + str(sg, "mobile") + " dob=" + str(sg, "date_of_birth")
                + " amount=" + str(sg, "amount") + "; SO delete " + del + ", restore " + rest;
        fact("R07/R08", facts);
        Assert.assertEquals(str(cg, "priority"), "High");
        Assert.assertEquals(str(cg, "description"), "QA عربي");
        Assert.assertTrue(String.valueOf(multi).contains("قنا"), "case multi-select not stored");
        Assert.assertEquals(str(pg, "po_date"), today);
        Assert.assertEquals(str(pg, "status"), "Approved");
        Assert.assertEquals(Double.parseDouble(str(pg, "tax")), 20.0);
        Assert.assertEquals(str(sg, "date_of_birth"), "1990-05-01");
        Assert.assertEquals(del, 204);
        Assert.assertEquals(rest, 200, "the deleted Sales Order could not be restored");
    }

    @CaseId("R13")
    @Test(groups = {"crmrecords", "round2", "api", "gap"}, description = "Clone a record (Zoho has Clone)")
    public void cloneRecord() {
        String id = create(owner(), cleanup, mod("leads"), QA + "R2 CL " + t, null);
        int s1 = owner().post("/modules/" + LEADS + "/records/" + id + "/clone", Map.of()).statusCode();
        fact("R13", "POST …/clone -> " + s1);
        Assert.assertEquals(s1 / 100, 2, "no clone function (gap vs Zoho)");
    }

    // ---------------- R33 advanced filters ----------------

    private String viewIds(CrmModule mod, String nameField, String prefix, Map<String, Object> cond) {
        Response v = owner().post("/modules/" + mod.id() + "/views", m("name", QA + "R2 FV " + t + " " + views.size(), "kind", "list", "layout_id", mod.layout(), "visibility", "private",
                "settings", m("columns", List.of(nameField), "sort", null, "criteria", m("pattern", "1 and 2", "conditions", List.of(m("field", nameField, "operator", "starts_with", "value", prefix), cond)), "related_criteria", List.of())));
        if (v.statusCode() / 100 != 2) return "VIEW " + v.statusCode();
        views.add(new String[]{mod.id(), v.jsonPath().getString("data.id")});
        return CrmUser.ok(owner().get("/modules/" + mod.id() + "/records?page=1&per_page=50&layout_id=" + mod.layout() + "&view_id=" + views.get(views.size() - 1)[1]), "view records").jsonPath().getList("data.id").toString();
    }

    @CaseId("R33")
    @Test(groups = {"crmrecords", "round2", "api"}, description = "Advanced filters: every supported operator returns exactly the matching records")
    public void advancedFilters() {
        String p = QA + "R2 FL " + t;
        Map<String, String> ld = new LinkedHashMap<>();
        ld.put("A", create(owner(), cleanup, mod("leads"), p + " A", Map.of("company", "Alpha Co", "lead_source", "web")));
        ld.put("B", create(owner(), cleanup, mod("leads"), p + " B", Map.of("company", "Beta Co", "lead_source", "chat")));
        ld.put("C", create(owner(), cleanup, mod("leads"), p + " C", Map.of("lead_source", "referral")));
        Map<String, String> po = new LinkedHashMap<>();
        String[][] pos = {{"A", "5", LocalDate.now().minusDays(10).toString()}, {"B", "12", LocalDate.now().toString()}, {"C", "20", LocalDate.now().plusDays(10).toString()}};
        for (String[] x : pos) {
            Map<String, Object> f = new LinkedHashMap<>();
            f.put("name", p + " " + x[0]);
            f.put("subject", p + " " + x[0]);
            f.put("tax", n(Integer.parseInt(x[1])));
            f.put("due_date", x[2]);
            po.put(x[0], createRaw(mod("po"), f));
        }
        Waits.sleep(3000);
        Object[][] cases = {
                {"leads", "company", "equals", "Alpha Co", "A"}, {"leads", "company", "not_equal_to", "Alpha Co", "BC"}, {"leads", "company", "contains", "Co", "AB"},
                {"leads", "company", "does_not_contain", "Alpha", "BC"}, {"leads", "company", "starts_with", "Beta", "B"}, {"leads", "company", "ends_with", "Co", "AB"},
                {"leads", "company", "is_empty", null, "C"}, {"leads", "company", "is_not_empty", null, "AB"},
                {"leads", "lead_source", "equals", "web", "A"}, {"leads", "lead_source", "contains_any_of", List.of("web", "chat"), "AB"}, {"leads", "lead_source", "contains_none_of", List.of("web", "chat"), "C"},
                {"po", "tax", "equals", 12, "B"}, {"po", "tax", "not_equal_to", 12, "AC"}, {"po", "tax", "greater_than", 12, "C"}, {"po", "tax", "less_than", 12, "A"},
                {"po", "due_date", "is_before", LocalDate.now().toString(), "A"}, {"po", "due_date", "is_after", LocalDate.now().toString(), "C"},
                {"po", "due_date", "is_between", List.of(LocalDate.now().minusDays(1).toString(), LocalDate.now().plusDays(1).toString()), "B"},
                {"po", "due_date", "today", null, "B"}, {"po", "due_date", "last_n_days", 15, "AB"}, {"po", "due_date", "next_n_days", 15, "BC"}};
        List<String> wrong = new ArrayList<>();
        StringBuilder facts = new StringBuilder();
        for (Object[] c : cases) {
            boolean lead = "leads".equals(c[0]);
            Map<String, String> map = lead ? ld : po;
            Map<String, Object> cond = new LinkedHashMap<>();
            cond.put("field", c[1]);
            cond.put("operator", c[2]);
            cond.put("value", c[3]);
            String ids = viewIds(mod((String) c[0]), lead ? "first_name" : "name", p, cond);
            StringBuilder got = new StringBuilder();
            for (Map.Entry<String, String> e : map.entrySet()) if (ids.contains(e.getValue())) got.append(e.getKey());
            String line = c[1] + " " + c[2] + " -> [" + got + "] expected [" + c[4] + "]";
            facts.append(line).append("; ");
            if (!got.toString().equals(c[4])) wrong.add(line + (ids.startsWith("VIEW") ? " " + ids : ""));
        }
        fact("R33", facts.toString());
        Assert.assertTrue(wrong.isEmpty(), "filters returned the wrong records: " + wrong);
    }

    @CaseId("R33")
    @Test(groups = {"crmrecords", "round2", "api", "gap"}, description = "Number filters offer ≥, ≤ and between (Zoho has them)")
    public void numberRangeOperators() {
        List<String> refused = new ArrayList<>();
        for (String op : List.of("greater_than_or_equal", "less_than_or_equal", "between")) {
            Response v = owner().post("/modules/" + mod("po").id() + "/views", m("name", QA + "R2 OP " + t + " " + op, "kind", "list", "layout_id", mod("po").layout(), "visibility", "private",
                    "settings", m("columns", List.of("name"), "sort", null, "criteria", m("pattern", "1 and 2", "conditions", List.of(m("field", "name", "operator", "starts_with", "value", QA),
                            m("field", "tax", "operator", op, "value", op.equals("between") ? List.of(1, 5) : 5))), "related_criteria", List.of())));
            if (v.statusCode() / 100 == 2) views.add(new String[]{mod("po").id(), v.jsonPath().getString("data.id")});
            else refused.add(op + " " + v.statusCode());
        }
        fact("R33 gap", "number range operators refused: " + refused);
        Assert.assertTrue(refused.isEmpty(), "number filters lack: " + refused);
    }
}
