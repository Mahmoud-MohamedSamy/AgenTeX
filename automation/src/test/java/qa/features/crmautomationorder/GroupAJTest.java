package qa.features.crmautomationorder;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;

/**
 * Session SA — spec group A (Assignment Rules alone, A-01…A-17) and group J (Tasks specifics, J-01…J-04).
 * <p>
 * Channels (verified 18 Oct 2026): assignment rules run only for Import / WebForm / Api.
 * Import: POST /modules/{m}/import (multipart CSV) → PUT …/{session}/mapping (options.assignment_rule_id) → POST …/validate →
 * POST …/execute → poll GET …/{session}. WebForm: POST /web-forms (advanced_form, owner.mode=assignment_rule) →
 * public POST /web-forms/public/{embed_key}/session → POST …/submissions (header X-Web-Form-Session).
 * A real "Api" channel was not found: records created through POST /modules/{m}/records get source "manual".
 * Imported / submitted records are found by name on the newest pages of the module list and deleted by this class.
 */
public class GroupAJTest extends OrderTestBase {
    @Override protected String session() { return "SA"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    /** Run-unique token so a record left by an aborted run is never mistaken for this run's record (lower case: no "AP"). */
    private static final String RUN = Long.toString(System.currentTimeMillis() % 1_000_000L, 36);

    /** Records this case created through import / web form (module, id): removed before the base class removes the rules. */
    private final List<String[]> extra = new ArrayList<>();

    private CrmUser importer() { return adminB(); }

    @AfterMethod(alwaysRun = true)
    public void dropExtraRecords() {
        for (String[] r : extra) {
            try {
                System.out.println("[cleanup] delete " + CrmApi.moduleKey(r[0]) + " " + r[1] + " -> " + adminB().delete("/modules/" + r[0] + "/records/" + r[1]).statusCode());
            } catch (Exception e) {
                System.out.println("[cleanup] " + e.getMessage());
            }
        }
        extra.clear();
    }

    /** Safety net: anything named "QA AEO SA " still on the newest pages (aborted cases) is deleted. Only this session's prefix. */
    @AfterClass(alwaysRun = true)
    public void purgeSessionLeftovers() {
        for (String m : List.of(LEADS, DEALS, TASKS)) {
            try {
                for (Map<String, Object> row : CrmApi.newestRows(adminB(), m, 2))
                    if (String.valueOf(row.get("data")).contains("value=" + CrmOrderFeature.QA + session() + " "))
                        System.out.println("[purge] " + CrmApi.moduleKey(m) + " " + row.get("id") + " -> " + adminB().delete("/modules/" + m + "/records/" + row.get("id")).statusCode());
            } catch (Exception e) {
                System.out.println("[purge] " + e.getMessage());
            }
        }
    }

    // =====================================================================================================
    // helpers
    // =====================================================================================================

    private String rn(String caseTag, String suffix) {
        return nm(caseTag, suffix + " " + RUN);
    }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 600 ? s.substring(0, 600) + "…" : s);
    }

    /** Leads row for import (required fields), plus extra fields. */
    private static Map<String, Object> leadRow(String name, Map<String, Object> more) {
        Map<String, Object> f = CrmApi.minimal(LEADS, name);
        if (more != null) f.putAll(more);
        return f;
    }

    private static String csvCell(Object v) {
        String s = v == null ? "" : String.valueOf(v);
        return s.contains(",") || s.contains("\"") ? "\"" + s.replace("\"", "\"\"") + "\"" : s;
    }

    /** Result of one import: final status (data of GET …/import/{session}) and the responses seen on the way. */
    static final class Imp {
        String sessionId;
        JsonPath status;
        Response mapping;
        Response validate;
        Response execute;

        String state() {
            return status == null ? null : status.getString("data.status");
        }

        String log() {
            return "session=" + sessionId + " mapping=" + (mapping == null ? null : cut(mapping)) + " validate=" + (validate == null ? null : cut(validate))
                    + " execute=" + (execute == null ? null : cut(execute)) + " final=" + (status == null ? null : status.getString("data.status")
                    + " created=" + status.getString("data.created_count") + " updated=" + status.getString("data.updated_count")
                    + " errors=" + status.getString("data.error_count") + " " + status.getString("data.errors"));
        }
    }

    /**
     * Imports rows (field key → value; the CSV header is the field key and maps to itself) as {@link #importer()}.
     * mode add|update|upsert; ruleId → options.assignment_rule_id (null = no rule). trigger_automation stays off.
     */
    private Imp importRows(String module, String layoutId, String mode, String matchKey, List<Map<String, Object>> rows, String ruleId) {
        CrmUser a = importer();
        List<String> headers = new ArrayList<>(rows.get(0).keySet());
        StringBuilder csv = new StringBuilder(String.join(",", headers)).append('\n');
        for (Map<String, Object> r : rows) {
            List<String> cells = new ArrayList<>();
            for (String h : headers) cells.add(csvCell(r.get(h)));
            csv.append(String.join(",", cells)).append('\n');
        }
        Imp imp = new Imp();
        Response up = CrmUser.ok(a.req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sa.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + module + "/import"), "import upload");
        imp.sessionId = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + module + "/import/" + imp.sessionId;

        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", false);
        opts.put("assignment_rule_id", ruleId);
        opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mode", mode);
        body.put("match_field_key", matchKey);
        body.put("layout_id", layoutId);
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : headers) mapping.add(Map.of("header", h, "field", h));
        body.put("mapping", mapping);
        body.put("options", opts);
        imp.mapping = a.put(base + "/mapping", body);
        if (imp.mapping.statusCode() / 100 != 2) return imp;
        imp.validate = a.post(base + "/validate", null);
        if (imp.validate.statusCode() / 100 != 2) return imp;
        imp.execute = a.post(base + "/execute", null);
        if (imp.execute.statusCode() / 100 != 2) return imp;
        CrmApi.waitFor(150, () -> {
            String st = a.get(base).jsonPath().getString("data.status");
            return st != null && (st.equals("completed") || st.equals("partially_completed") || st.equals("failed"));
        });
        imp.status = a.get(base).jsonPath();
        System.out.println("[import " + CrmApi.moduleKey(module) + "] " + imp.log());
        return imp;
    }

    /** Imports and asserts the import completed with every row created; returns the created record ids in row order. */
    private List<String> importAndFind(String module, String layoutId, List<Map<String, Object>> rows, String ruleId) {
        Imp imp = importRows(module, layoutId, "add", null, rows, ruleId);
        if (imp.status == null) inconclusive("import did not run: " + imp.log());
        Assert.assertEquals(imp.status.getInt("data.created_count"), rows.size(), "rows created by the import: " + imp.log());
        List<String> ids = new ArrayList<>();
        for (Map<String, Object> r : rows) {
            String name = String.valueOf(r.get(CrmProcs.nameField(module)));
            String id = findByName(module, name);
            if (id == null) inconclusive("imported record '" + name + "' not found on the newest list pages: " + imp.log());
            extra.add(new String[]{module, id});
            ids.add(id);
        }
        return ids;
    }

    /** Record id by exact name value on the newest list pages (polls: the list may lag the import). */
    private String findByName(String module, String name) {
        // the list is oldest first and ignores sort/search: CrmApi scans the last pages
        return CrmApi.findByName(importer(), module, name, 45);
    }

    private String owner(String module, String id) {
        return api.field(importer(), module, id, "owner");
    }

    /** Assignment-rule rows of the execution log for a record ("ruleId=… outcome=…"). */
    private List<String> arRows(String recordId) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(recordId))
            if (e.get("assignmentRuleId") != null) out.add("assignmentRuleId=" + e.get("assignmentRuleId") + " outcome=" + e.get("outcome") + " trigger=" + e.get("triggerKind"));
        return out;
    }

    private String who(String userId) {
        if (userId == null) return "null";
        for (CrmUser u : List.of(userN(), userV(), supervisor(), adminB()))
            if (userId.equals(u.id())) return u.email.substring(0, u.email.indexOf('@'));
        return userId;
    }

    /** Assignment rule (inactive) with several entries; each entry = condition → members (round robin). */
    private Map<String, Object> rule(String module, String label, List<String> channels, String fallbackKind, String fallbackUser,
                                     List<Map<String, Object>> entries) {
        Map<String, Object> b = CrmProcs.assignmentRule(module, label, channels, null, List.of("x"), fallbackKind, fallbackUser);
        b.put("entries", new ArrayList<>(entries));
        return b;
    }

    private String activeRule(Map<String, Object> body) {
        String id = api.assignmentRule(body);
        Response on = api.setAssignmentRuleActive(id, true);
        Assert.assertEquals(on.statusCode() / 100, 2, "assignment rule on: " + cut(on));
        return id;
    }

    private Map<String, Object> caseGuard(String module, String caseTag) {
        return CrmProcs.guard(module, nm(caseTag, ""));
    }

    // =====================================================================================================
    // A — Assignment Rules alone
    // =====================================================================================================

    @CaseId("A-01")
    @Test(groups = {"crm-order", "group-a"}, description = "Rule (Import + Api) applies to a lead created through the API channel")
    public void ruleAppliesToLeadCreatedThroughApi() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-01 AR", List.of("Import", "Api"), caseGuard(LEADS, "A-01"),
                List.of(userV().id()), "LeaveUnassigned", null));
        // the only API route found: POST /modules/{m}/records with a user token; also try to declare the channel in the body
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout(LEADS));
        body.put("data", CrmApi.data(CrmApi.minimal(LEADS, rn("A-01", "api"))));
        body.put("source", "api");
        Response r = userN().post("/modules/" + LEADS + "/records", body);
        Assert.assertEquals(r.statusCode() / 100, 2, "create through the records API: " + cut(r));
        String id = r.jsonPath().getString("data.id");
        extra.add(new String[]{LEADS, id});
        String source = api.record(importer(), LEADS, id).getString("data.source");
        String own = owner(LEADS, id);
        traceOf("A-01", LEADS, id);
        System.out.println("[A-01] lead " + id + " source=" + source + " owner=" + who(own) + " arRows=" + arRows(id));
        if (!"api".equalsIgnoreCase(source))
            inconclusive("no API channel reachable: records API create is source=" + source + " (body 'source:api' ignored); owner=" + who(own)
                    + ", rule " + ar + " not applied, arRows=" + arRows(id) + " (lead " + id + ")");
        Assert.assertEquals(own, userV().id(), "owner by the rule on an API-channel create");
    }

    @CaseId("A-02")
    @Test(groups = {"crm-order", "group-a"}, description = "Import of 1 lead choosing the rule assigns the rule's user")
    public void importChoosingRuleAssignsOwner() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-02 AR", List.of("Import", "Api"), caseGuard(LEADS, "A-02"),
                List.of(userV().id()), "LeaveUnassigned", null));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-02", "imp"), null)), ar).get(0);
        String own = owner(LEADS, id);
        List<String> rows = arRows(id);
        traceOf("A-02", LEADS, id);
        System.out.println("[A-02] lead " + id + " owner=" + who(own) + " arRows=" + rows + " source=" + api.record(importer(), LEADS, id).getString("data.source"));
        Assert.assertEquals(own, userV().id(), "owner set by the assignment rule (importer is adminB)");
        Assert.assertTrue(rows.stream().anyMatch(s -> s.contains(ar)), "execution log has an assignment row for rule " + ar + ": " + api.executions(id));
    }

    @CaseId("A-02")
    @Test(groups = {"crm-order", "group-a"}, description = "Extra: web-form submission (form owner = assignment rule) assigns the rule's user (WebForm channel)")
    public void webFormSubmissionAssignsOwnerByRule() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-02W AR", List.of("WebForm"), caseGuard(LEADS, "A-02W"),
                List.of(userV().id()), "LeaveUnassigned", null));
        String formId = null;
        try {
            Map<String, Object> owner = new LinkedHashMap<>();
            owner.put("mode", "assignment_rule");
            owner.put("user_id", null);
            owner.put("assignment_rule_id", ar);
            owner.put("notify_owner", false);
            owner.put("notify_email", false);
            owner.put("notify_user_ids", List.of());
            Map<String, Object> def = new LinkedHashMap<>();
            def.put("version", 2);
            def.put("language", "en");
            def.put("success_message", "ok");
            def.put("fields", List.of(Map.of("key", "first_name"), Map.of("key", "phone")));
            def.put("attachments", Map.of("enabled", false, "screenshot_enabled", false));
            def.put("captcha_enabled", false);
            def.put("launcher", null);
            def.put("allowed_origins", List.of());
            def.put("redirect_url", null);
            def.put("owner", owner);
            def.put("share_link_enabled", true);
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("kind", "advanced_form");
            body.put("name", nm("A-02W", "form"));
            body.put("department_id", null);
            body.put("layout_id", layout(LEADS));
            body.put("module_id", LEADS);
            body.put("definition", def);
            body.put("app_key", "crm");
            Response c = adminB().post("/web-forms", body);
            if (c.statusCode() / 100 != 2) inconclusive("QA web form could not be created: " + cut(c));
            formId = c.jsonPath().getString("data.id");
            String pub = CrmOrderFeature.API + "/web-forms/public/" + c.jsonPath().getString("data.embed_key");
            Response s = RestAssured.given().relaxedHTTPSValidation().accept(ContentType.JSON).post(pub + "/session");
            String tok = s.jsonPath().getString("data.session_token");
            if (tok == null) inconclusive("public web-form session not issued: " + s.statusCode());
            String name = rn("A-02W", "web");
            Map<String, Object> sub = new LinkedHashMap<>();
            sub.put("submission_id", UUID.randomUUID().toString());
            sub.put("values", Map.of("first_name", name, "phone", CrmApi.minimal(LEADS, name).get("phone")));
            sub.put("file_ids", List.of());
            sub.put("captcha_token", null);
            sub.put("page_origin", null);
            sub.put("honeypot", "");
            Response r = RestAssured.given().relaxedHTTPSValidation().accept(ContentType.JSON).contentType(ContentType.JSON)
                    .header("X-Web-Form-Session", tok).body(sub).post(pub + "/submissions");
            System.out.println("[A-02W] submit " + cut(r));
            if (r.statusCode() / 100 != 2) inconclusive("public submission refused: " + cut(r));
            String id = findByName(LEADS, name);
            if (id == null) inconclusive("web-form lead not found after submit: " + cut(r));
            extra.add(new String[]{LEADS, id});
            String own = owner(LEADS, id);
            String source = api.record(importer(), LEADS, id).getString("data.source");
            traceOf("A-02W", LEADS, id);
            System.out.println("[A-02W] lead " + id + " source=" + source + " owner=" + who(own) + " arRows=" + arRows(id));
            Assert.assertEquals(own, userV().id(), "owner by the rule on a web-form submission (source=" + source + ")");
        } finally {
            if (formId != null) System.out.println("[A-02W] delete form -> " + adminB().delete("/web-forms/" + formId).statusCode());
        }
    }

    @CaseId("A-03")
    @Test(groups = {"crm-order", "group-a"}, description = "Manual create (records API = source manual): rule does not run, owner = creator; control import is assigned")
    public void manualCreateDoesNotRunRule() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-03 AR", List.of("Import", "Api", "WebForm"), caseGuard(LEADS, "A-03"),
                List.of(userV().id()), "LeaveUnassigned", null));
        // control: the same active rule assigns an imported lead
        String ctl = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-03", "control"), null)), ar).get(0);
        Assert.assertEquals(owner(LEADS, ctl), userV().id(), "control: imported lead assigned by the rule");
        String id = api.createRecord(userN(), LEADS, rn("A-03", "manual"));
        String own = owner(LEADS, id);
        traceOf("A-03", LEADS, id);
        System.out.println("[A-03] control " + ctl + " owner=userV; manual lead " + id + " source=" + api.record(importer(), LEADS, id).getString("data.source")
                + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertEquals(own, userN().id(), "manual create keeps the creator as owner");
        Assert.assertTrue(arRows(id).isEmpty(), "no assignment execution on a manual create");
    }

    @CaseId("A-04")
    @Test(groups = {"crm-order", "group-a"}, description = "Channel restriction: a rule without the Import channel is not applied to an import naming it (API-channel create not reachable)")
    public void ruleWithoutImportChannelNotAppliedToImport() {
        String apiOnly = activeRule(CrmProcs.assignmentRule(LEADS, "A-04 AR api", List.of("Api"), caseGuard(LEADS, "A-04"),
                List.of(userV().id()), "LeaveUnassigned", null));
        Imp imp = importRows(LEADS, layout(LEADS), "add", null, List.of(leadRow(rn("A-04", "imp"), null)), apiOnly);
        System.out.println("[A-04] " + imp.log());
        if (imp.status == null) {
            // refused up front is also "rule does not run"
            Assert.assertTrue(imp.mapping.statusCode() / 100 == 4 || (imp.validate != null && imp.validate.statusCode() / 100 == 4)
                    || (imp.execute != null && imp.execute.statusCode() / 100 == 4), "import with an Api-only rule refused with a 4xx: " + imp.log());
            return;
        }
        String id = findByName(LEADS, rn("A-04", "imp"));
        Assert.assertNotNull(id, "imported lead found");
        extra.add(new String[]{LEADS, id});
        String own = owner(LEADS, id);
        traceOf("A-04", LEADS, id);
        System.out.println("[A-04] lead " + id + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertNotEquals(own, userV().id(), "an Api-only rule must not assign an imported record");
    }

    @CaseId("A-05")
    @Test(groups = {"crm-order", "group-a"}, description = "Two entries: Lead Source = web matches entry 1 → first match wins")
    public void firstMatchingEntryWins() {
        String ar = activeRule(rule(LEADS, "A-05 AR", List.of("Import", "Api"), "LeaveUnassigned", null, List.of(
                CrmProcs.arEntry(CrmProcs.and(caseGuard(LEADS, "A-05"), CrmProcs.eq("lead_source", "web")), List.of(userV().id())),
                CrmProcs.arEntry(caseGuard(LEADS, "A-05"), List.of(userN().id())))));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-05", "web"), Map.of("lead_source", "web"))), ar).get(0);
        String own = owner(LEADS, id);
        traceOf("A-05", LEADS, id);
        System.out.println("[A-05] lead " + id + " lead_source=" + api.field(importer(), LEADS, id, "lead_source") + " owner=" + who(own));
        Assert.assertEquals(own, userV().id(), "entry 1 (Lead Source = web) → userV");
    }

    @CaseId("A-06")
    @Test(groups = {"crm-order", "group-a"}, description = "Two entries: Lead Source = referral falls through to entry 2 (All)")
    public void nonMatchingFallsToSecondEntry() {
        String ar = activeRule(rule(LEADS, "A-06 AR", List.of("Import", "Api"), "LeaveUnassigned", null, List.of(
                CrmProcs.arEntry(CrmProcs.and(caseGuard(LEADS, "A-06"), CrmProcs.eq("lead_source", "web")), List.of(userV().id())),
                CrmProcs.arEntry(caseGuard(LEADS, "A-06"), List.of(userN().id())))));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-06", "ref"), Map.of("lead_source", "referral"))), ar).get(0);
        String own = owner(LEADS, id);
        traceOf("A-06", LEADS, id);
        System.out.println("[A-06] lead " + id + " lead_source=" + api.field(importer(), LEADS, id, "lead_source") + " owner=" + who(own));
        Assert.assertEquals(own, userN().id(), "entry 2 → userN");
    }

    @CaseId("A-07")
    @Test(groups = {"crm-order", "group-a"}, description = "No entry matches; fallback = Default user → supervisor")
    public void fallbackDefaultUser() {
        String ar = activeRule(rule(LEADS, "A-07 AR", List.of("Import", "Api"), "DefaultUser", supervisor().id(), List.of(
                CrmProcs.arEntry(CrmProcs.and(caseGuard(LEADS, "A-07"), CrmProcs.eq("lead_source", "chat")), List.of(userV().id())))));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-07", "other"), Map.of("lead_source", "other"))), ar).get(0);
        String own = owner(LEADS, id);
        traceOf("A-07", LEADS, id);
        System.out.println("[A-07] lead " + id + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertEquals(own, supervisor().id(), "fallback default user");
    }

    @CaseId("A-08")
    @Test(groups = {"crm-order", "group-a"}, description = "No entry matches; fallback = Leave unassigned → owner is the importer (not ownerless)")
    public void fallbackLeaveUnassigned() {
        String ar = activeRule(rule(LEADS, "A-08 AR", List.of("Import", "Api"), "LeaveUnassigned", null, List.of(
                CrmProcs.arEntry(CrmProcs.and(caseGuard(LEADS, "A-08"), CrmProcs.eq("lead_source", "chat")), List.of(userV().id())))));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-08", "other"), Map.of("lead_source", "other"))), ar).get(0);
        String own = owner(LEADS, id);
        traceOf("A-08", LEADS, id);
        System.out.println("[A-08] lead " + id + " owner=" + who(own) + " (raw " + own + ") arRows=" + arRows(id));
        Assert.assertNotNull(own, "record is not ownerless");
        Assert.assertEquals(own, importer().id(), "leave unassigned → owner = the importer");
    }

    @CaseId("A-09")
    @Test(groups = {"crm-order", "group-a"}, description = "Category with userN and userV (round robin): 4 imported leads alternate")
    public void roundRobinAlternates() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-09 AR", List.of("Import", "Api"), caseGuard(LEADS, "A-09"),
                List.of(userN().id(), userV().id()), "LeaveUnassigned", null));
        List<Map<String, Object>> rows = new ArrayList<>();
        for (int i = 1; i <= 4; i++) rows.add(leadRow(rn("A-09", "r" + i), null));
        List<String> ids = importAndFind(LEADS, layout(LEADS), rows, ar);
        List<String> owners = new ArrayList<>();
        for (String id : ids) owners.add(owner(LEADS, id));
        List<String> names = new ArrayList<>();
        for (String o : owners) names.add(who(o));
        for (String id : ids) traceOf("A-09", LEADS, id);
        System.out.println("[A-09] leads " + ids + " owners in row order " + names);
        Assert.assertEquals(owners.stream().filter(userN().id()::equals).count(), 2, "userN gets 2 of 4: " + names);
        Assert.assertEquals(owners.stream().filter(userV().id()::equals).count(), 2, "userV gets 2 of 4: " + names);
        for (int i = 0; i + 1 < owners.size(); i++) Assert.assertNotEquals(owners.get(i), owners.get(i + 1), "alternates (row order): " + names);
    }

    @CaseId("A-10")
    @Test(groups = {"crm-order", "group-a"}, description = "Availability Online status: signed-out user skipped")
    public void onlineStatusSkipsSignedOutUser() {
        throw new SkipException("NOT RUN: needs a target user who is reliably signed out; userN/userV are signed in by parallel sessions and signing users out touches shared accounts");
    }

    @CaseId("A-11")
    @Test(groups = {"crm-order", "group-a"}, description = "Follow-up task on the entry: task created for the new owner, linked to the lead")
    public void followUpTaskForNewOwner() {
        Map<String, Object> entry = CrmProcs.arEntry(caseGuard(LEADS, "A-11"), List.of(userV().id()));
        String title = rn("A-11", "follow up");
        Map<String, Object> fu = new LinkedHashMap<>();
        fu.put("titleTemplate", title);
        fu.put("descriptionTemplate", null);
        fu.put("dueOffsetDays", 1);
        fu.put("dueAt", null);
        entry.put("followUpTask", fu);
        String ar = activeRule(rule(LEADS, "A-11 AR", List.of("Import", "Api"), "LeaveUnassigned", null, List.of(entry)));
        Map<String, Object> saved = CrmUser.ok(adminB().get("/workflow/assignment-rules/" + ar), "GET rule").jsonPath().getMap("data.entries[0].followUpTask");
        System.out.println("[A-11] saved followUpTask=" + saved);
        if (saved == null) inconclusive("followUpTask not stored by the rule API (shape titleTemplate/dueOffsetDays)");
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-11", "imp"), null)), ar).get(0);
        Assert.assertEquals(owner(LEADS, id), userV().id(), "lead assigned to userV");
        String task = findByName(TASKS, title);
        if (task == null) {
            // the subject may be stored differently: look for any task that names the lead
            String[] hit = new String[1];
            CrmApi.waitFor(30, () -> {
                List<Map<String, Object>> rows = CrmApi.newestRows(importer(), TASKS, 2);
                for (Map<String, Object> row : rows) if (String.valueOf(row.get("data")).contains(id) || String.valueOf(row.get("data")).contains("A-11")) { hit[0] = String.valueOf(row.get("id")); return true; }
                return false;
            });
            task = hit[0];
        }
        traceOf("A-11", LEADS, id);
        Assert.assertNotNull(task, "follow-up task created (title '" + title + "') for lead " + id + "; timeline=" + api.timeline(LEADS, id));
        extra.add(0, new String[]{TASKS, task});
        String taskData = String.valueOf(api.record(importer(), TASKS, task).getList("data.data"));
        System.out.println("[A-11] lead " + id + " task " + task + " data=" + taskData);
        Assert.assertEquals(api.field(importer(), TASKS, task, "owner"), userV().id(), "task owner = new lead owner");
        Assert.assertTrue(taskData.contains(id), "task linked to the lead " + id);
    }

    @CaseId("A-12")
    @Test(groups = {"crm-order", "group-a"}, description = "Inactive rule named on an import: not applied (clear error or ignored)")
    public void inactiveRuleNotApplied() {
        String ar = api.assignmentRule(CrmProcs.assignmentRule(LEADS, "A-12 AR", List.of("Import", "Api"), caseGuard(LEADS, "A-12"),
                List.of(userV().id()), "LeaveUnassigned", null));
        Imp imp = importRows(LEADS, layout(LEADS), "add", null, List.of(leadRow(rn("A-12", "imp"), null)), ar);
        System.out.println("[A-12] " + imp.log());
        if (imp.status == null) {
            Assert.assertTrue(imp.mapping.statusCode() / 100 == 4 || (imp.validate != null && imp.validate.statusCode() / 100 == 4)
                    || (imp.execute != null && imp.execute.statusCode() / 100 == 4), "refused with a clear 4xx: " + imp.log());
            return;
        }
        String id = findByName(LEADS, rn("A-12", "imp"));
        if (id != null) extra.add(new String[]{LEADS, id});
        if (id == null) {
            Assert.assertTrue(imp.status.getInt("data.error_count") > 0, "row rejected with an error: " + imp.log());
            return;
        }
        String own = owner(LEADS, id);
        traceOf("A-12", LEADS, id);
        System.out.println("[A-12] lead " + id + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertNotEquals(own, userV().id(), "an inactive rule must not assign");
    }

    @CaseId("A-13")
    @Test(groups = {"crm-order", "group-a"}, description = "Import in update mode with the rule does not change owners")
    public void updateImportDoesNotReassign() {
        String ar = activeRule(CrmProcs.assignmentRule(LEADS, "A-13 AR", List.of("Import", "Api"), caseGuard(LEADS, "A-13"),
                List.of(userV().id()), "LeaveUnassigned", null));
        String name = rn("A-13", "existing");
        String id = api.createRecord(userN(), LEADS, name);
        Assert.assertEquals(owner(LEADS, id), userN().id(), "precondition: owner = creator userN");
        // the match field must be unique: ask the import which fields it offers for update
        Response up = CrmUser.ok(importer().req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sa.csv", "first_name\nx\n".getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + LEADS + "/import"), "upload");
        List<Map<String, Object>> fields = importer().get("/modules/" + LEADS + "/import/" + up.jsonPath().getString("data.session_id")
                + "/fields?mode=update&layout_id=" + layout(LEADS)).jsonPath().getList("data");
        String match = null;
        for (Map<String, Object> f : fields) if (Boolean.TRUE.equals(f.get("unique"))) { match = String.valueOf(f.get("field_name")); break; }
        List<String> offered = new java.util.ArrayList<>();
        for (Map<String, Object> f : fields) offered.add(f.get("field_name") + (Boolean.TRUE.equals(f.get("unique")) ? "*" : "") + (f.containsKey("match") ? "(match=" + f.get("match") + ")" : ""));
        System.out.println("[A-13] update-mode fields (* = unique): " + offered + " | first keys " + (fields.isEmpty() ? "-" : fields.get(0).keySet()));
        // Zoho matches an update import on the record id too; use it when the import offers it
        if (match == null) for (Map<String, Object> f : fields) if (List.of("id", "record_id", "crm_id").contains(String.valueOf(f.get("field_name")))) match = String.valueOf(f.get("field_name"));
        System.out.println("[A-13] unique fields for update match: " + match);
        if (match == null) inconclusive("Leads has no unique field, so an update-mode import cannot match an existing lead");
        String mv = List.of("id", "record_id", "crm_id").contains(match) ? id : api.field(importer(), LEADS, id, match);
        if (mv == null) inconclusive("existing lead has no value in the unique field " + match);
        Map<String, Object> row = new LinkedHashMap<>();
        row.put(match, mv);
        row.put("description", "QA AEO A-13 updated");
        Imp imp = importRows(LEADS, layout(LEADS), "update", match, List.of(row), ar);
        System.out.println("[A-13] " + imp.log());
        String own = owner(LEADS, id);
        traceOf("A-13", LEADS, id);
        Assert.assertEquals(own, userN().id(), "update import must not change the owner (was userN): now " + who(own));
    }

    @CaseId("A-14")
    @Test(groups = {"crm-order", "group-a"}, description = "Deals: rule on Deals applied to an imported deal")
    public void dealsRuleApplied() {
        String ar = activeRule(CrmProcs.assignmentRule(DEALS, "A-14 AR", List.of("Import", "Api"), caseGuard(DEALS, "A-14"),
                List.of(userV().id()), "LeaveUnassigned", null));
        Map<String, Object> row = CrmApi.minimal(DEALS, rn("A-14", "deal"));
        String id = importAndFind(DEALS, layout(DEALS), List.of(row), ar).get(0);
        String own = owner(DEALS, id);
        traceOf("A-14", DEALS, id);
        System.out.println("[A-14] deal " + id + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertEquals(own, userV().id(), "deal owner set by the rule");
    }

    @CaseId("A-15")
    @Test(groups = {"crm-order", "group-a"}, description = "Tasks: rule on Tasks applied to an imported task")
    public void tasksRuleApplied() {
        String ar = activeRule(CrmProcs.assignmentRule(TASKS, "A-15 AR", List.of("Import", "Api"), caseGuard(TASKS, "A-15"),
                List.of(userV().id()), "LeaveUnassigned", null));
        Map<String, Object> row = CrmApi.minimal(TASKS, rn("A-15", "task"));
        String id = importAndFind(TASKS, layout(TASKS), List.of(row), ar).get(0);
        String own = owner(TASKS, id);
        traceOf("A-15", TASKS, id);
        System.out.println("[A-15] task " + id + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertEquals(own, userV().id(), "task owner set by the rule");
    }

    @CaseId("A-16")
    @Test(groups = {"crm-order", "group-a"}, description = "Editing an assigned lead so it matches another entry does not reassign")
    public void editDoesNotReassign() {
        String ar = activeRule(rule(LEADS, "A-16 AR", List.of("Import", "Api"), "LeaveUnassigned", null, List.of(
                CrmProcs.arEntry(CrmProcs.and(caseGuard(LEADS, "A-16"), CrmProcs.eq("lead_source", "web")), List.of(userV().id())),
                CrmProcs.arEntry(caseGuard(LEADS, "A-16"), List.of(userN().id())))));
        String id = importAndFind(LEADS, layout(LEADS), List.of(leadRow(rn("A-16", "web"), Map.of("lead_source", "web"))), ar).get(0);
        Assert.assertEquals(owner(LEADS, id), userV().id(), "control: assigned to userV by entry 1 on create");
        Response u = api.update(importer(), LEADS, id, Map.of("lead_source", "referral"));
        Assert.assertEquals(u.statusCode() / 100, 2, "edit lead_source: " + cut(u));
        CrmApi.waitFor(20, () -> false);
        String own = owner(LEADS, id);
        traceOf("A-16", LEADS, id);
        System.out.println("[A-16] lead " + id + " after edit lead_source=" + api.field(importer(), LEADS, id, "lead_source") + " owner=" + who(own) + " arRows=" + arRows(id));
        Assert.assertEquals(own, userV().id(), "owner unchanged after an edit (rules run on create only)");
    }

    @CaseId("A-17")
    @Test(groups = {"crm-order", "group-a"}, description = "Deactivated target user in the Category is skipped → fallback")
    public void deactivatedUserSkipped() {
        throw new SkipException("NOT RUN – needs user OK: deactivating a user changes a shared account");
    }

    // =====================================================================================================
    // J — Tasks module specifics
    // =====================================================================================================

    @CaseId("J-01")
    @Test(groups = {"crm-order", "group-j"}, description = "Each of the five processes can be created and switched on for Tasks")
    public void allFiveProcessesOnTasks() {
        Map<String, String> res = new LinkedHashMap<>();
        String ar = api.assignmentRule(CrmProcs.assignmentRule(TASKS, "J-01 AR", List.of("Import", "Api"), caseGuard(TASKS, "J-01"), List.of(userV().id()), "LeaveUnassigned", null));
        res.put("assignment", ar + " on=" + api.setAssignmentRuleActive(ar, true).statusCode());
        String rp = api.reviewProcess(CrmProcs.reviewProcess(TASKS, layout(TASKS), "J-01 RP", caseGuard(TASKS, "J-01"), List.of("manual"),
                Map.of("description", "multi_line"), List.of(supervisor().id()), List.of(supervisor().id())));
        res.put("review", rp + " on=" + api.setReviewActive(rp, true, null).statusCode());
        String wf = api.workflowRule(CrmProcs.workflow(TASKS, "J-01 WF").guardCase("J-01").onCreate().fieldUpdate("description", "WF J-01").build());
        res.put("workflow", wf + " on=" + api.setWorkflowActive(wf, true).statusCode());
        String ap = api.approvalProcess(CrmProcs.approvalProcess(TASKS, "J-01 AQ", true, false, caseGuard(TASKS, "J-01"),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id())));
        res.put("approval", ap + " on=" + api.setApprovalActive(ap, true).statusCode());
        String bp = api.blueprint(TASKS, CrmProcs.blueprint("tasks", layout(TASKS), null, "status", "J-01 BP", caseGuard(TASKS, "J-01"),
                List.of("Not Started", "In Progress"), List.of()));
        Response bon = api.setBlueprintActive(TASKS, bp, true);
        res.put("blueprint", bp + " on=" + bon.statusCode() + (bon.statusCode() / 100 == 2 ? "" : " " + cut(bon)));
        System.out.println("[J-01] " + res);
        for (Map.Entry<String, String> e : res.entrySet()) Assert.assertTrue(e.getValue().contains(" on=2"), e.getKey() + ": " + e.getValue());
    }

    @CaseId("J-02")
    @Test(groups = {"crm-order", "group-j"}, description = "Review on Tasks (TAVI extra): task held for review, approved by the reviewer")
    public void reviewOnTasks() {
        String rp = api.reviewProcess(CrmProcs.reviewProcess(TASKS, layout(TASKS), "J-02 RP", caseGuard(TASKS, "J-02"), List.of("manual"),
                Map.of("description", "multi_line"), List.of(supervisor().id()), List.of(supervisor().id())));
        Assert.assertEquals(api.setReviewActive(rp, true, null).statusCode() / 100, 2, "review on");
        Map<String, Object> f = CrmApi.minimal(TASKS, rn("J-02", "task"));
        f.put("description", "QA AEO J-02 to review");
        String id = api.createRecord(userN(), TASKS, layout(TASKS), f);
        Assert.assertTrue(CrmApi.waitFor(30, () -> "pending_for_review".equals(api.reviewStatus(TASKS, id))), "task held: " + api.reviewStatus(TASKS, id));
        String req = api.reviewRequestId(TASKS, id);
        Response ok = api.reviewField(supervisor(), req, "description", true);
        Assert.assertEquals(ok.statusCode() / 100, 2, "reviewer approves description: " + cut(ok));
        Assert.assertTrue(CrmApi.waitFor(30, () -> "approved".equals(api.reviewStatus(TASKS, id))), "approved: " + api.reviewStatus(TASKS, id));
        traceOf("J-02", TASKS, id);
        System.out.println("[J-02] task " + id + " review " + req + " approved (TAVI extra, not a Zoho behaviour)");
    }

    @CaseId("J-03")
    @Test(groups = {"crm-order", "group-j"}, description = "Task created by an approval level's Assign Task runs the Tasks chain (QA Tasks workflow fires on it)")
    public void approvalAssignTaskRunsTasksChain() {
        String title = rn("J-03", "assigned task");
        Map<String, Object> level = CrmProcs.levelUsers(supervisor().id());
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("type", "Task");
        task.put("order", 0);
        task.put("delaySeconds", 0);
        task.put("taskTitle", title);
        task.put("taskDueOffsetDays", 1);
        task.put("taskStatus", "Not Started");
        task.put("taskPriority", "normal");
        task.put("taskNotifyAssignee", false);
        level.put("assignTask", task);
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, "J-03 AQ", true, false, caseGuard(LEADS, "J-03"), List.of(level), List.of(adminB().id())));
        Assert.assertEquals(api.setApprovalActive(ap, true).statusCode() / 100, 2, "approval on");
        String wf = api.workflowRule(CrmProcs.workflow(TASKS, "J-03 WF").guardCase("J-03").onCreate().fieldUpdate("description", "WF J-03 tasks chain").build());
        Assert.assertEquals(api.setWorkflowActive(wf, true).statusCode() / 100, 2, "tasks workflow on");
        String lead = api.createRecord(userN(), LEADS, rn("J-03", "lead"));
        Assert.assertTrue(CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, lead))), "lead submitted for approval: " + api.approvalState(LEADS, lead));
        String t = findByName(TASKS, title);
        traceOf("J-03", LEADS, lead);
        if (t == null) inconclusive("approval level task '" + title + "' not found in Tasks (lead " + lead + " pending approval); timeline=" + api.timeline(LEADS, lead));
        extra.add(new String[]{TASKS, t});
        boolean fired = CrmApi.waitFor(60, () -> api.firedCount(t, wf) > 0);
        String desc = api.field(importer(), TASKS, t, "description");
        traceOf("J-03", TASKS, t);
        System.out.println("[J-03] lead " + lead + " task " + t + " owner=" + who(api.field(importer(), TASKS, t, "owner")) + " wfFired=" + fired + " description=" + desc);
        Assert.assertTrue(fired, "QA Tasks workflow fired on the approval-created task " + t + " (executions " + api.executions(t) + ")");
    }

    @CaseId("J-04")
    @Test(groups = {"crm-order", "group-j"}, description = "Workqueue task completion triggers the teammate rule, not QA rules")
    public void workqueueCompletionNotAffected() {
        throw new SkipException("NOT RUN: needs Tasks status = Completed, which fires the teammate rule ActionsOnTaskCompletionFromWorkqueue");
    }
}
