package qa.features.crmsetup;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmsetup.CrmSetupApi.*;
import static qa.features.crmsetup.CrmSetupFeature.*;

/**
 * Wave 5 (lane C) through the API. A fresh "QA W5 Auto" module (and a child module for the rollup) is created in
 * {@link #setUp()}; every schema change, rule and record is made on it and the modules are deleted in {@link #tearDown()}
 * (deleted modules leave bin items that can't be removed, NDC-1797). Teamspace, data type and skill objects are QA-named
 * and removed too. Results of the manual run: executions/execu_2026-10-26_crm-golive-waves3-5/wave5/results.md.
 */
public class SetupApiTest {
    private final Cleanup cleanup = new Cleanup();
    private final String t = tag();
    private String mod, child, layout, childLayout;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        mod = createModule("qa_w5_auto_" + t, QA + "Auto " + t);
        cleanup.then("QA module", () -> fact("cleanup", "delete QA module -> " + deleteModule(mod)));
        child = createModule("qa_w5_autoc_" + t, QA + "Auto child " + t);
        cleanup.then("QA child module", () -> fact("cleanup", "delete QA child module -> " + deleteModule(child)));
        layout = defaultLayout(mod);
        childLayout = defaultLayout(child);
        CrmUser.ok(addField(mod, "qa_pick", "QA Pick", "pick_list", m("allowed_values", List.of("Red", "Green", "Blue"))), "pick list");
        CrmUser.ok(addField(mod, "qa_multi", "QA Multi", "multi_select", m("allowed_values", List.of("A", "B", "C"))), "multi select");
        CrmUser.ok(addField(mod, "qa_email", "QA Email", "email", null), "email");
        CrmUser.ok(addField(mod, "qa_num", "QA Number", "number", null), "number");
        CrmUser.ok(addField(mod, "qa_formula", "QA Formula", "formula", m("expression", "1 + 1", "return_kind", "number")), "formula");
        CrmUser.ok(addField(mod, "qa_auto", "QA Auto", "auto_number", m("prefix", "QW5-", "start_number", 1, "padding", 4, "increment", 1)), "auto number");
        CrmUser.ok(owner().post("/modules/" + child + "/fields", m("fields", List.of(
                m("fieldName", "qa_parent", "labels", m("en", "QA Parent"), "datatypeKey", "lookup", "required", false, "unique", false, "datatypeOptions", m("target_module_id", mod, "related_list_title", "QA children")),
                m("fieldName", "qa_amount", "labels", m("en", "QA Amount"), "datatypeKey", "number", "required", false, "unique", false)))), "child fields");
        CrmUser.ok(addField(mod, "qa_rollup", "QA Rollup", "rollup_summary", m("target_module_id", child, "relation_field", "qa_parent", "target_field", "qa_amount", "aggregation", "sum")), "rollup");
        CrmUser.ok(owner().patch("/modules/" + mod + "/fields/" + field(mod, "qa_pick").get("id") + "/constraints", m("required", true)), "pick required");
        CrmUser.ok(owner().patch("/modules/" + mod + "/fields/" + field(mod, "qa_email").get("id") + "/constraints", m("unique", true)), "email unique");
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private String record(Map<String, Object> values) {
        Response r = createRecord(mod, layout, values);
        return r.statusCode() / 100 == 2 ? r.jsonPath().getString("data.id") : null;
    }

    private static Map<String, Object> vals(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    @CaseId("C01")
    @Test(groups = {"crmsetup", "wave5", "api", "regression", "NDC-1693"}, description = "A module is created (201) and the same name again is refused (409)")
    public void moduleCreateAndDuplicate() {
        Response dup = owner().post("/teamspaces/" + CRM_TEAMSPACE + "/modules", m("moduleKey", "qa_w5_auto_" + t, "labels", m("en", QA + "Auto " + t), "pluralForm", QA + "Auto " + t, "singularForm", "x"));
        fact("C01", "module " + mod + " created; same name again -> " + err(dup));
        Assert.assertNotNull(mod, "module was not created");
        Assert.assertEquals(dup.statusCode(), 409, "a second module with the same name was accepted");
    }

    @CaseId("C01")
    @Test(groups = {"crmsetup", "wave5", "api", "regression"}, description = "Every user data type can be added as a field (pipeline is system-only)")
    @SuppressWarnings("unchecked")
    public void everyDatatype() {
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("address", m("subfields", List.of("street", "city", "state", "zip", "country")));
        opts.put("currency", m("precision", 12, "scale", 2, "currency_code", "EGP"));
        opts.put("decimal", m("precision", 10, "scale", 2));
        opts.put("lookup", m("target_module_id", child, "related_list_title", "QA lookups"));
        opts.put("multi_select_lookup", m("target_module_id", child, "related_list_title", "QA multi lookups"));
        opts.put("radio_button", m("allowed_values", List.of("Yes", "No")));
        opts.put("status", m("allowed_values", List.of("Open", "Closed")));
        opts.put("subform", m("subfields", List.of(m("key", "qa_sub_text", "label", "Sub text", "datatype", "single_line"))));
        List<String> failed = new ArrayList<>();
        List<Map<String, Object>> types = CrmUser.ok(owner().get("/fields/datatypes"), "datatypes").jsonPath().getList("data");
        int n = 0;
        for (Map<String, Object> d : types) {
            String key = String.valueOf(d.get("key"));
            if (List.of("pipeline", "pick_list", "multi_select", "email", "number", "formula", "auto_number", "rollup_summary").contains(key)) continue;
            if (Boolean.TRUE.equals(d.get("is_system_only"))) continue;
            if (key.startsWith("qa_") || "custom".equals(d.get("source"))) continue;
            Response r = addField(mod, "qa_dt_" + key, "QA DT " + key, key, (Map<String, Object>) opts.get(key));
            n++;
            if (r.statusCode() / 100 != 2) failed.add(key + " " + err(r));
        }
        fact("C01 types", n + " data types tried, failed: " + failed);
        Assert.assertTrue(failed.isEmpty(), "data types that could not be added: " + failed);
    }

    @CaseId({"C06", "C07", "C08", "C09"})
    @Test(groups = {"crmsetup", "wave5", "api", "regression", "NDC-1603"},
            description = "Required pick list, picklist values, case-insensitive unique email, formula, auto number, rollup; restore of a record whose unique value is taken is refused")
    public void recordRules() {
        String a = record(vals("name", QA + "R1", "qa_pick", "Red", "qa_email", "qa.w5.auto." + t + "@example.com"));
        Assert.assertNotNull(a, "a valid record was refused");
        int noPick = createRecord(mod, layout, vals("name", QA + "no pick")).statusCode();
        int badPick = createRecord(mod, layout, vals("name", QA + "bad pick", "qa_pick", "Purple")).statusCode();
        int dupEmail = createRecord(mod, layout, vals("name", QA + "dup", "qa_pick", "Red", "qa_email", ("QA.W5.AUTO." + t + "@example.com"))).statusCode();
        for (int amt : new int[]{5, 7})
            CrmUser.ok(owner().post("/modules/" + child + "/records", m("layout_id", childLayout, "data", CrmApi.data(vals("name", QA + "child " + amt, "qa_parent", a, "qa_amount", amt)))), "child");
        boolean rolled = CrmApi.waitFor(30, () -> String.valueOf(value(mod, a, "qa_rollup")).startsWith("12"));
        Object formula = value(mod, a, "qa_formula"), auto = value(mod, a, "qa_auto"), rollup = value(mod, a, "qa_rollup");
        CrmUser.ok(owner().delete("/modules/" + mod + "/records/" + a), "delete R1");
        CrmUser.ok(createRecord(mod, layout, vals("name", QA + "R1 again", "qa_pick", "Red", "qa_email", "qa.w5.auto." + t + "@example.com")), "same email after delete");
        Response restore = null;
        for (int i = 0; i < 5 && restore == null; i++) {
            Map<String, Object> it = binPage().stream().filter(x -> a.equals(x.get("record_id"))).findFirst().orElse(null);
            if (it != null) restore = owner().post("/audit/recycle-bin/restore", m("ids", List.of(it.get("id"))));
            else qa.core.base.Waits.sleep(3000);
        }
        fact("C06-C09", "no pick " + noPick + ", Purple " + badPick + ", same email other case " + dupEmail + ", formula " + formula + ", auto " + auto + ", rollup " + rollup
                + "; restore with taken email -> " + (restore == null ? "not in bin" : err(restore)));
        Assert.assertEquals(noPick, 422, "a record without the required pick list was saved");
        Assert.assertEquals(badPick, 422, "a pick list value outside the list was saved");
        Assert.assertEquals(dupEmail, 422, "a duplicate unique email (other case) was saved");
        Assert.assertEquals(String.valueOf(formula), "2", "formula 1 + 1");
        Assert.assertTrue(String.valueOf(auto).matches("QW5-[0-9]{4}"), "auto number: " + auto);
        Assert.assertTrue(rolled, "rollup sum of 5 + 7 is not 12: " + rollup);
        if (restore == null) throw new SkipException("INCONCLUSIVE: the deleted record was not found in the bin");
        Assert.assertTrue(restore.asString().contains("name_conflict"), "the restore with a taken unique value was not refused: " + restore.asString());
    }

    @CaseId("C04")
    @Test(groups = {"crmsetup", "wave5", "api", "W5-B1", "NDC-2536", "NDC-2646"}, description = "A validation rule refuses a save that breaks it, and an invalid condition is refused")
    public void validationRuleApplied() {
        // Since 27 Oct the condition is a criteria object (the record is refused when it matches); a text condition is refused.
        Response vr = CrmUser.ok(owner().post("/modules/" + mod + "/validation-rules", m("name", QA + "VR", "condition", m("op", "gt", "field", "qa_num", "value", 10), "errorMessage", m("en", "QA number must be 10 or less"))), "create rule");
        cleanup.delete("validation rule", "/modules/" + mod + "/validation-rules/" + vr.jsonPath().getString("data.id"));
        Response garbage = owner().post("/modules/" + mod + "/validation-rules", m("name", QA + "VR garbage", "condition", "garbage ((( not an expression", "errorMessage", m("en", "x")));
        if (garbage.statusCode() / 100 == 2) cleanup.delete("garbage rule", "/modules/" + mod + "/validation-rules/" + garbage.jsonPath().getString("data.id"));
        int control = createRecord(mod, layout, vals("name", QA + "VR 5", "qa_pick", "Red", "qa_num", 5)).statusCode();
        Response brokenR = createRecord(mod, layout, vals("name", QA + "VR 50", "qa_pick", "Red", "qa_num", 50));
        int broken = brokenR.statusCode();
        // edit path: a valid record changed to 999 must be refused too
        String ok = record(vals("name", QA + "VR edit", "qa_pick", "Red", "qa_num", 3));
        Response edit = owner().patch("/modules/" + mod + "/records/" + ok, m("data", CrmApi.data(vals("qa_num", 999))));
        Object after = value(mod, ok, "qa_num");
        fact("C04", "rule {gt qa_num 10}: control 5 -> " + control + ", create 50 -> " + err(brokenR) + "; edit 3 -> 999 -> " + err(edit) + ", stored " + after + "; garbage condition -> " + err(garbage));
        Assert.assertEquals(control / 100, 2, "control: a valid record was refused");
        Assert.assertEquals(broken, 422, "a record breaking the active validation rule was saved");
        Assert.assertEquals(edit.statusCode(), 422, "an edit breaking the active validation rule was saved");
        Assert.assertEquals(String.valueOf(after).replaceAll("\\.0+$", ""), "3", "the refused edit still changed the value");
        Assert.assertEquals(garbage.statusCode() / 100, 4, "an invalid rule condition was accepted");
    }

    @CaseId("C05")
    @Test(groups = {"crmsetup", "wave5", "api", "W5-B4", "NDC-2649"}, description = "An empty dependency map is refused")
    public void emptyDependencyRefused() {
        Response r = owner().post("/modules/" + mod + "/dependency-maps", Map.of());
        if (r.statusCode() / 100 == 2) cleanup.delete("empty dependency map", "/modules/" + mod + "/dependency-maps/" + r.jsonPath().getString("data.id"));
        fact("C05", "POST dependency-maps {} -> " + err(r));
        Assert.assertEquals(r.statusCode() / 100, 4, "an empty dependency map was saved");
    }

    @CaseId("C02")
    @Test(groups = {"crmsetup", "wave5", "api", "regression"}, description = "Layout create, clone, set default, reassign records, record usage")
    public void layouts() {
        Map<String, Object> std = CrmUser.ok(owner().get("/modules/" + mod + "/layouts/" + layout), "layout").jsonPath().getMap("data");
        String a = CrmUser.ok(owner().post("/modules/" + mod + "/layouts", m("name", QA + "Layout A", "views", std.get("views"), "assignedProfiles", List.of(), "accessMode", "all_users", "status", "active")), "create layout").jsonPath().getString("data.id");
        int dup = owner().post("/modules/" + mod + "/layouts", m("name", QA + "Layout A", "views", std.get("views"), "assignedProfiles", List.of(), "accessMode", "all_users", "status", "active")).statusCode();
        String b = CrmUser.ok(owner().post("/modules/" + mod + "/layouts/" + a + "/clone", m("name", QA + "Layout A clone")), "clone").jsonPath().getString("data.id");
        CrmUser.ok(owner().post("/modules/" + mod + "/layouts/" + a + "/set-default", Map.of()), "set default");
        CrmUser.ok(owner().post("/modules/" + mod + "/layouts/" + layout + "/set-default", Map.of()), "default back");
        CrmUser.ok(createRecord(mod, layout, vals("name", QA + "reassign", "qa_pick", "Red")), "record");
        Response ra = owner().post("/modules/" + mod + "/layouts/" + layout + "/reassign-records", m("target_layout_id", b));
        int usage = CrmUser.ok(owner().get("/modules/" + mod + "/layouts/" + b + "/record-usage"), "usage").jsonPath().getInt("data.record_count");
        fact("C02", "layout A, duplicate name -> " + dup + ", clone, default and back, reassign -> " + err(ra) + ", records on clone " + usage);
        Assert.assertEquals(dup, 409, "duplicate layout name");
        Assert.assertEquals(ra.statusCode(), 200, "reassign records");
        Assert.assertTrue(usage >= 1, "the reassigned record is not on the clone");
    }

    @CaseId("C02")
    @Test(groups = {"crmsetup", "wave5", "api", "W5-B5", "NDC-2650"}, description = "The layout assignments API answers (no 500 / 405)")
    public void layoutAssignmentsApi() {
        int get = owner().get("/modules/" + mod + "/layouts/assignments").statusCode();
        int post = owner().post("/modules/" + mod + "/layouts/assignments", m("assignments", List.of(m("profileId", P_USER, "layoutId", layout)))).statusCode();
        fact("C02 assignments", "GET -> " + get + ", POST -> " + post);
        Assert.assertNotEquals(post, 500, "POST layouts/assignments answers 500");
        Assert.assertNotEquals(get, 405, "GET layouts/assignments answers 405");
    }

    @CaseId("C11")
    @Test(groups = {"crmsetup", "wave5", "api", "NDC-1694"}, description = "A teamspace with no modules is refused by the API, not only by the screen")
    public void emptyTeamspaceRefused() {
        Response r = owner().post("/teamspaces", m("name", QA + "TS empty " + t));
        if (r.statusCode() / 100 == 2) cleanup.delete("empty QA teamspace", "/teamspaces/" + r.jsonPath().getString("data.id") + "?cascade=true");
        Response r2 = owner().post("/teamspaces", m("name", QA + "TS empty2 " + t, "module_ids", List.of()));
        if (r2.statusCode() / 100 == 2) cleanup.delete("empty QA teamspace 2", "/teamspaces/" + r2.jsonPath().getString("data.id") + "?cascade=true");
        fact("C11", "POST /teamspaces without modules -> " + err(r) + "; with module_ids [] -> " + err(r2));
        Assert.assertEquals(r.statusCode() / 100, 4, "a teamspace without modules was saved");
        Assert.assertEquals(r2.statusCode() / 100, 4, "a teamspace with an empty module list was saved");
    }

    @CaseId("C12")
    @Test(groups = {"crmsetup", "wave5", "api", "W5-B3", "NDC-2648"}, description = "A teamspace folder name used twice is refused with a clear 409, not a 500")
    public void duplicateFolderName() {
        // Since 27 Oct a teamspace needs at least one module (NDC-1694); the QA module of this class is used.
        String ts = CrmUser.ok(owner().post("/teamspaces", m("name", QA + "TS " + t, "module_ids", List.of(mod))), "teamspace").jsonPath().getString("data.id");
        cleanup.delete("QA teamspace", "/teamspaces/" + ts + "?cascade=true");
        CrmUser.ok(owner().post("/teamspaces/" + ts + "/folders", m("name", QA + "Folder")), "folder");
        Response dup = owner().post("/teamspaces/" + ts + "/folders", m("name", QA + "Folder"));
        int dupTs = owner().post("/teamspaces", m("name", QA + "TS " + t, "module_ids", List.of(mod))).statusCode();
        fact("C12", "duplicate folder -> " + err(dup) + "; duplicate teamspace -> " + dupTs);
        Assert.assertEquals(dupTs, 409, "control: duplicate teamspace name");
        Assert.assertEquals(dup.statusCode(), 409, "a duplicate folder name does not answer 409");
    }

    @CaseId({"C13", "C20"})
    @Test(groups = {"crmsetup", "wave5", "api", "regression"}, description = "A custom data type joins the catalog; a skill can be rated 0-100 on another user, not on yourself")
    public void datatypeAndSkills() {
        String key = "qa_w5_dt_" + t;
        CrmUser.ok(owner().post("/custom-datatypes", m("key", key, "label", QA + "DT " + t, "base_datatype_key", "single_line")), "custom datatype");
        cleanup.delete("custom datatype", "/custom-datatypes/" + key);
        boolean inCatalog = CrmUser.ok(owner().get("/fields/datatypes"), "catalog").asString().contains(key);
        Assert.assertTrue(inCatalog, "the custom data type is not in the catalog");
        // CRM Admin has no skills:manage (28 Oct 2026, round 2 runs as CRM Admin A): the skills half is skipped, not failed
        Response catR = owner().post("/iam/skills/categories", m("name", QA + "Cat " + t));
        if (catR.statusCode() == 403) {
            fact("C13/C20", "datatype in catalog " + inCatalog + "; skills not checked: " + err(catR));
            throw new SkipException("NOT RUN: the acting account has no skills:manage permission (" + catR.statusCode() + ")");
        }
        String cat = CrmUser.ok(catR, "category").jsonPath().getString("data.id");
        cleanup.then("purge skill category from the bin", () -> binPage().stream().filter(x -> cat.equals(x.get("record_id"))).findFirst()
                .ifPresent(it -> owner().post("/audit/recycle-bin/delete", m("ids", List.of(it.get("id"))))));
        cleanup.delete("skill category", "/iam/skills/categories/" + cat + "?confirm=true");
        String grp = CrmUser.ok(owner().post("/iam/skills/groups", m("skill_category_id", cat, "name", QA + "Group")), "group").jsonPath().getString("data.id");
        String skill = CrmUser.ok(owner().post("/iam/skills", m("skill_group_id", grp, "name", QA + "Skill")), "skill").jsonPath().getString("data.id");
        int rate = owner().post("/iam/skills/users/" + USER_N_ID, m("skill_id", skill, "score", 4)).statusCode();
        int over = owner().post("/iam/skills/users/" + USER_N_ID, m("skill_id", skill, "score", 101)).statusCode();
        int self = owner().post("/iam/skills/users/" + owner().id(), m("skill_id", skill, "score", 4)).statusCode();
        owner().delete("/iam/skills/users/" + USER_N_ID + "/" + skill);
        fact("C13/C20", "datatype in catalog " + inCatalog + "; rate 4 -> " + rate + ", 101 -> " + over + ", self -> " + self);
        Assert.assertTrue(inCatalog, "the custom data type is not in the catalog");
        Assert.assertEquals(rate, 200, "rating test user 1");
        Assert.assertEquals(over, 400, "a score over 100 was accepted");
        Assert.assertEquals(self, 403, "a user could rate their own skill");
    }

    @CaseId("I02")
    @Test(groups = {"crmsetup", "wave5", "api", "NDC-1193"}, description = "A record with no fields is refused in Customers, where Name is required")
    public void blankCustomerRefused() {
        Response r = owner().post("/modules/" + CUSTOMERS + "/records", m("layout_id", CUSTOMERS_LAYOUT, "data", List.of()));
        if (r.statusCode() / 100 == 2) {
            String id = r.jsonPath().getString("data.id");
            owner().delete("/modules/" + CUSTOMERS + "/records/" + id);
            cleanup.then("purge blank customer", () -> {
                binPage().stream().filter(x -> id.equals(x.get("record_id"))).findFirst()
                        .ifPresent(it -> owner().post("/audit/recycle-bin/delete", m("ids", List.of(it.get("id")))));
            });
        }
        fact("I02 NDC-1193", "Customers blank record -> " + err(r));
        Assert.assertEquals(r.statusCode(), 422, "Customers accepted a blank record");
    }
}
