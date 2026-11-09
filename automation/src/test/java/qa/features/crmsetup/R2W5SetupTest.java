package qa.features.crmsetup;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.CrmUser;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmsetup.CrmSetupApi.*;
import static qa.features.crmsetup.CrmSetupFeature.*;

/**
 * Round 2 Wave 5 (28 Oct 2026, build index-De3hTVb3.js) checks added after the hand run: dependency map enforced on
 * save (NDC-2649), layout access mode stored (NDC-2650), disabled module blocked (NDC-1864), rollup value in a report
 * (NDC-2647), SUM in formulas and pick-list validation rules (NDC-2536), webhook address checks (NDC-2537), schedule
 * end-before-start refused, and the ingest API applying validation rules and dependencies (candidate R2W5-C1).
 * Everything runs on a module this class creates ("QA … R2W5 …") and is deleted in {@link #tearDown()}.
 * Run as CRM Admin A: -Dcrm.apiUser=mmohamed@anyware.software. Results: executions/execu_2026-10-27_crm-golive-round2/wave5/results.md.
 */
public class R2W5SetupTest {
    private final Cleanup cleanup = new Cleanup();
    private final String t = tag();
    private String mod, child, layout, childLayout;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        mod = createModule("qa_r2w5_auto_" + t, QA + "R2W5 Auto " + t);
        cleanup.then("QA module", () -> fact("cleanup", "delete QA module -> " + deleteModule(mod)));
        child = createModule("qa_r2w5_autoc_" + t, QA + "R2W5 Auto child " + t);
        cleanup.then("QA child module", () -> fact("cleanup", "delete QA child module -> " + deleteModule(child)));
        layout = defaultLayout(mod);
        childLayout = defaultLayout(child);
        CrmUser.ok(addField(mod, "qa_pick", "QA Pick", "pick_list", m("allowed_values", List.of("Red", "Green", "Blue"))), "pick list");
        CrmUser.ok(addField(mod, "qa_sub", "QA Sub", "pick_list", m("allowed_values", List.of("A", "B", "C"))), "child pick list");
        CrmUser.ok(addField(mod, "qa_num", "QA Number", "number", null), "number");
        CrmUser.ok(owner().post("/modules/" + child + "/fields", m("fields", List.of(
                m("fieldName", "qa_parent", "labels", m("en", "QA Parent"), "datatypeKey", "lookup", "required", false, "unique", false, "datatypeOptions", m("target_module_id", mod, "related_list_title", "QA children")),
                m("fieldName", "qa_amount", "labels", m("en", "QA Amount"), "datatypeKey", "number", "required", false, "unique", false)))), "child fields");
        CrmUser.ok(addField(mod, "qa_rollup", "QA Rollup", "rollup_summary", m("target_module_id", child, "relation_field", "qa_parent", "target_field", "qa_amount", "aggregation", "sum")), "rollup");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private static Map<String, Object> vals(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    private String fieldId(String api) {
        return String.valueOf(field(mod, api).get("id"));
    }

    @CaseId("C05")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-2649"}, description = "A dependency map is checked when a record is created or edited")
    public void dependencyEnforcedOnSave() {
        Response map = owner().post("/modules/" + mod + "/dependency-maps",
                m("controllingFieldId", fieldId("qa_pick"), "dependentFieldId", fieldId("qa_sub"), "valueMap", m("Red", List.of("A", "B"))));
        if (map.statusCode() / 100 == 2) cleanup.delete("dependency map", "/modules/" + mod + "/dependency-maps/" + map.jsonPath().getString("data.id"));
        else if (!map.asString().contains("only one parent")) CrmUser.ok(map, "dependency map");   // same map made by ingestAppliesRules
        Response redC = createRecord(mod, layout, vals("name", QA + "dep RedC", "qa_pick", "Red", "qa_sub", "C"));
        Response redA = createRecord(mod, layout, vals("name", QA + "dep RedA", "qa_pick", "Red", "qa_sub", "A"));
        Response greenC = createRecord(mod, layout, vals("name", QA + "dep GreenC", "qa_pick", "Green", "qa_sub", "C"));
        String id = redA.statusCode() == 201 ? redA.jsonPath().getString("data.id") : null;
        Response edit = id == null ? null : owner().patch("/modules/" + mod + "/records/" + id, m("data", CrmApi.data(vals("qa_sub", "C"))));
        fact("C05 NDC-2649", "Red+C -> " + err(redC) + "; Red+A -> " + redA.statusCode() + "; Green+C -> " + greenC.statusCode() + "; edit Red+A to C -> " + (edit == null ? "n/a" : err(edit)));
        Assert.assertEquals(redC.statusCode(), 422, "a child value not allowed for the parent was saved");
        Assert.assertEquals(redA.statusCode(), 201, "control: an allowed child value was refused");
        Assert.assertEquals(greenC.statusCode(), 201, "control: an unmapped parent value restricted the child");
        Assert.assertNotNull(edit, "control record missing");
        Assert.assertEquals(edit.statusCode(), 422, "an edit to a not-allowed child value was saved");
    }

    @CaseId("C02")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-2650"}, description = "Layout access saved through the API is stored")
    public void layoutAccessModeStored() {
        String b = CrmUser.ok(owner().post("/modules/" + mod + "/layouts/" + layout + "/clone", m("name", QA + "R2W5 Layout B")), "clone").jsonPath().getString("data.id");
        Response put = owner().put("/modules/" + mod + "/layouts/" + b, m("accessMode", "selected", "assignedProfiles", List.of(P_USER)));
        Map<String, Object> back = CrmUser.ok(owner().get("/modules/" + mod + "/layouts/" + b), "layout").jsonPath().getMap("data");
        int get = owner().get("/modules/" + mod + "/layouts/assignments").statusCode();
        fact("C02 NDC-2650", "PUT accessMode selected -> " + put.statusCode() + ", read back " + back.get("accessMode") + " " + back.get("assignedProfiles") + "; GET assignments -> " + get);
        Assert.assertEquals(put.statusCode(), 200, "PUT layout");
        Assert.assertEquals(back.get("accessMode"), "selected", "the access mode was not stored");
        Assert.assertEquals(get, 200, "GET layouts/assignments");
    }

    @CaseId("C01")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-1864"}, description = "A disabled module refuses record reads and creates (403 MODULE_DISABLED)")
    public void disabledModuleBlocked() {
        String d = createModule("qa_r2w5_dis_" + t, QA + "R2W5 Disabled " + t);
        cleanup.then("disabled QA module", () -> {
            owner().put("/modules/" + d, m("status", "active"));
            fact("cleanup", "delete disabled QA module -> " + deleteModule(d));
        });
        CrmUser.ok(owner().put("/modules/" + d, m("status", "disabled")), "disable module");
        Response create = createRecord(d, defaultLayoutOrNull(d), vals("name", QA + "in disabled"));
        Response list = owner().get("/modules/" + d + "/records?page=1&per_page=5");
        fact("C01 NDC-1864", "create in disabled module -> " + err(create) + "; list -> " + list.statusCode());
        Assert.assertEquals(create.statusCode(), 403, "a record was created in a disabled module");
        Assert.assertEquals(list.statusCode(), 403, "records of a disabled module were listed");
    }

    private String defaultLayoutOrNull(String m) {
        try {
            return defaultLayout(m);
        } catch (RuntimeException e) {
            return null;
        }
    }

    @CaseId("S02")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-2647"}, description = "A report shows the rollup summary value the record holds")
    @SuppressWarnings("unchecked")
    public void rollupInReport() {
        String p = CrmUser.ok(createRecord(mod, layout, vals("name", QA + "rollup parent")), "parent").jsonPath().getString("data.id");
        for (int amt : new int[]{5, 7})
            CrmUser.ok(owner().post("/modules/" + child + "/records", m("layout_id", childLayout, "data", CrmApi.data(vals("name", QA + "child " + amt, "qa_parent", p, "qa_amount", amt)))), "child");
        Assert.assertTrue(CrmApi.waitFor(30, () -> String.valueOf(value(mod, p, "qa_rollup")).startsWith("12")), "control: the record's rollup is not 12");
        String ds = datasetId();
        if (ds == null) throw new SkipException("INCONCLUSIVE: no reporting dataset for the QA module yet");
        Map<String, Object> spec = m("ir_version", 14, "base_dataset_id", ds, "dimensions", List.of(m("dataset_id", ds, "field_key", "name", "grain", null), m("dataset_id", ds, "field_key", "qa_rollup", "grain", null)),
                "measures", List.of(), "filters", List.of(), "sort", List.of(), "limit", 100);
        String rep = CrmUser.ok(owner().post("/reporting/reports", m("name", QA + "R2W5 rollup " + t, "folder_id", null, "query_spec", spec, "viz_spec", m("report_type", "tabular", "config", Map.of()))), "report").jsonPath().getString("data.data.id");
        cleanup.delete("report", "/reporting/reports/" + rep + "?expected_revision=1");   // delete needs the revision (28 Oct 2026)
        List<List<Object>> rows = CrmUser.ok(owner().post("/reporting/reports/" + rep + "/query", Map.of()), "run").jsonPath().getList("data.data.rows");
        Object got = rows.stream().filter(r -> String.valueOf(r.get(0)).equals(QA + "rollup parent")).map(r -> r.get(1)).findFirst().orElse("no row");
        fact("S02 NDC-2647", "report rollup for the parent = " + got + " (record 12)");
        Assert.assertTrue(String.valueOf(got).startsWith("12"), "the report shows rollup " + got + ", the record holds 12");
    }

    /** The reporting dataset of this class's QA module (the API answers a double envelope data.data). */
    private String datasetId() {
        List<Map<String, Object>> dsl = CrmUser.ok(owner().get("/reporting/semantic-layer/datasets"), "datasets").jsonPath().getList("data.data");
        for (Map<String, Object> d : dsl)
            if (("qa_r2w5_auto_" + t).equals(d.get("module_key"))) return String.valueOf(d.get("id"));
        return null;
    }

    @CaseId("C07")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-2536"}, description = "Formulas accept SUM, and a validation rule on a pick list is applied")
    public void sumFormulaAndPickRule() {
        Response f = addField(mod, "qa_sumf", "QA SumF", "formula", m("expression", "sum(qa_num, 5)", "return_kind", "number"));
        Response vr = CrmUser.ok(owner().post("/modules/" + mod + "/validation-rules", m("name", QA + "VR pick", "condition", m("op", "eq", "field", "qa_pick", "value", "Blue"), "errorMessage", m("en", "Blue is not allowed"))), "rule");
        cleanup.delete("pick rule", "/modules/" + mod + "/validation-rules/" + vr.jsonPath().getString("data.id"));
        Response blue = createRecord(mod, layout, vals("name", QA + "blue", "qa_pick", "Blue"));
        Response ok = createRecord(mod, layout, vals("name", QA + "sum", "qa_pick", "Green", "qa_num", 4));
        Object sum = ok.statusCode() == 201 ? value(mod, ok.jsonPath().getString("data.id"), "qa_sumf") : null;
        fact("C07 NDC-2536", "sum() formula -> " + f.statusCode() + ", value for 4 = " + sum + "; Blue with rule -> " + err(blue));
        Assert.assertEquals(f.statusCode() / 100, 2, "a formula with sum() was refused: " + err(f));
        Assert.assertEquals(String.valueOf(sum).replaceAll("\\.0+$", ""), "9", "sum(4, 5)");
        Assert.assertEquals(blue.statusCode(), 422, "a pick-list validation rule was not applied");
    }

    @CaseId("I03")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "NDC-2537"}, description = "Workflow and review webhooks refuse internal addresses when saved")
    public void webhookInternalAddressRefused() {
        Map<String, Object> trig = m("kind", "RecordCreated", "fieldName", null, "fieldNames", null, "fieldMatch", null, "dateFieldName", null, "offsetSeconds", null, "offsetMode", null);
        StringBuilder facts = new StringBuilder();
        int refused = 0;
        List<String> urls = List.of("http://169.254.169.254/latest/meta-data/", "http://10.0.0.5/", "http://localhost/");
        for (String u : urls) {
            Response r = owner().post("/workflow/rules", m("moduleId", mod, "appKey", "crm", "layoutId", null, "departmentIds", List.of(), "name", QA + "WH " + t, "description", null, "mode", "Recurring", "isActive", false,
                    "trigger", trig, "criteria", null, "actions", List.of(m("type", "Webhook", "order", 0, "delaySeconds", 0, "method", "Post", "url", u, "bodyTemplate", "{}", "headers", Map.of(), "timeoutSeconds", 10))));
            if (r.statusCode() / 100 == 2) cleanup.delete("webhook rule", "/workflow/rules/" + r.jsonPath().getString("data.id"));
            else if (r.statusCode() == 400) refused++;
            facts.append(u).append(" -> ").append(r.statusCode()).append("; ");
        }
        fact("I03 NDC-2537", facts.toString());
        Assert.assertEquals(refused, urls.size(), "an internal webhook address was saved: " + facts);
    }

    @CaseId("S02")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api"}, description = "A report schedule whose end is before its start is refused")
    public void scheduleEndBeforeStartRefused() {
        String ds = datasetId();
        if (ds == null) throw new SkipException("INCONCLUSIVE: no reporting dataset for the QA module yet");
        Map<String, Object> spec = m("ir_version", 14, "base_dataset_id", ds, "dimensions", List.of(m("dataset_id", ds, "field_key", "name", "grain", null)), "measures", List.of(), "filters", List.of(), "sort", List.of(), "limit", 10);
        Response rep = owner().post("/reporting/reports", m("name", QA + "R2W5 sched " + t, "folder_id", null, "query_spec", spec, "viz_spec", m("report_type", "tabular", "config", Map.of())));
        String repId = rep.statusCode() / 100 == 2 ? rep.jsonPath().getString("data.data.id") : null;
        if (repId == null) throw new SkipException("INCONCLUSIVE: could not create a report for the schedule: " + err(rep));
        cleanup.delete("schedule report", "/reporting/reports/" + repId + "?expected_revision=1");
        Response s = owner().post("/reporting/schedules", m("name", QA + "bad end", "report_id", repId, "export_format", "csv", "time_zone", "Egypt", "start_date", "2027-01-05", "start_time", "08:00:00",
                "repeat_type", "daily", "end_at", "2027-01-01T08:00:00Z", "send_via", "email", "email_template_id", "introduction", "additional_recipients", List.of(CrmOrderFeature.ADMIN_A)));
        if (s.statusCode() / 100 == 2) cleanup.delete("schedule", "/reporting/schedules/" + s.jsonPath().getString("data.data.id"));
        fact("S02 schedule", "end before start -> " + err(s));
        Assert.assertEquals(s.statusCode() / 100, 4, "a schedule ending before it starts was saved");
    }

    @CaseId("I02")
    @Test(groups = {"crmsetup", "wave5", "r2w5", "api", "R2W5-C1"}, description = "The ingest API applies validation rules and field dependencies like a normal create")
    public void ingestAppliesRules() {
        Response vr = CrmUser.ok(owner().post("/modules/" + mod + "/validation-rules", m("name", QA + "VR ingest", "condition", m("op", "gt", "field", "qa_num", "value", 10), "errorMessage", m("en", "number must be 10 or less"))), "rule");
        cleanup.delete("ingest rule", "/modules/" + mod + "/validation-rules/" + vr.jsonPath().getString("data.id"));
        // a field can have only one parent: reuse the map of dependencyEnforcedOnSave when it is already there
        Response map = owner().post("/modules/" + mod + "/dependency-maps",
                m("controllingFieldId", fieldId("qa_pick"), "dependentFieldId", fieldId("qa_sub"), "valueMap", m("Red", List.of("A", "B"))));
        if (map.statusCode() / 100 == 2) cleanup.delete("ingest dependency map", "/modules/" + mod + "/dependency-maps/" + map.jsonPath().getString("data.id"));
        else if (!map.asString().contains("only one parent")) CrmUser.ok(map, "dependency map");
        Response c = CrmUser.ok(owner().post("/iam/integrations/clients", m("name", QA + "R2W5 client " + t, "allowed_modules", List.of("qa_r2w5_auto_" + t))), "client");
        String cid = c.jsonPath().getString("data.client_id");
        cleanup.then("API client", () -> fact("cleanup", "delete API client -> " + owner().delete("/iam/integrations/clients/" + java.net.URLEncoder.encode(cid, java.nio.charset.StandardCharsets.UTF_8)).statusCode()));
        String secret = c.jsonPath().getString("data.client_secret");   // kept in memory only, never logged
        Response tok = RestAssured.given().baseUri(CrmOrderFeature.API).relaxedHTTPSValidation().header("x-tenant-id", CrmOrderFeature.TENANT)
                .formParam("grant_type", "client_credentials").formParam("client_id", cid).formParam("client_secret", secret).post("/iam/integrations/token");
        String at = tok.jsonPath().getString("access_token") != null ? tok.jsonPath().getString("access_token") : tok.jsonPath().getString("data.access_token");
        if (at == null) throw new SkipException("INCONCLUSIVE: no ingest token (" + tok.statusCode() + ")");
        java.util.function.Function<Map<String, Object>, Response> ingest = body -> RestAssured.given().baseUri(CrmOrderFeature.API).relaxedHTTPSValidation()
                .header("x-tenant-id", CrmOrderFeature.TENANT).header("Authorization", "Bearer " + at).header("Idempotency-Key", "qa-r2w5-" + System.nanoTime())
                .contentType("application/json").body(body).post("/ingress/modules/qa_r2w5_auto_" + t + "/records");
        Response rule = ingest.apply(vals("name", QA + "ingest 50", "qa_num", 50));
        Response dep = ingest.apply(vals("name", QA + "ingest RedC", "qa_pick", "Red", "qa_sub", "C"));
        fact("I02 R2W5-C1", "ingest qa_num 50 with rule <=10 -> " + err(rule) + "; ingest Red+C with map Red->A,B -> " + err(dep));
        Assert.assertEquals(rule.statusCode() / 100, 4, "the ingest API saved a record that breaks an active validation rule");
        Assert.assertEquals(dep.statusCode() / 100, 4, "the ingest API saved a child value its parent does not allow");
    }
}
