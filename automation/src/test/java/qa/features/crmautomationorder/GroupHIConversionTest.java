package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;
import static qa.features.crmautomationorder.CrmUser.ok;

/**
 * Spec groups H (lead conversion and cross-module, H-01…H-07) and I (after the fact, I-01…I-10), session SH.
 * Process admin adminB; submitter / lead owner userN; reviewer adminA; approver supervisor (named level user).
 * Conversion: POST /modules/{leads}/records/{id}/convert {} → data.targets[] {moduleId, moduleKey, outcome, recordId, reason}
 * (seen by session SD, 18 Oct 2026: accounts skipped "gating field 'company' is not set", contacts + subscriptions created,
 * no deal). Every created target is registered for cleanup with api.track(moduleId, recordId).
 * Records that may be pending approval are status-reset as Owner before the base cleanup deletes them.
 */
public class GroupHIConversionTest extends OrderTestBase {
    @Override protected String session() { return "SH"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    /** Seconds to wait for an asynchronous result that must happen. */
    private static final int WAIT = 90;
    /** Seconds to watch for something that must NOT happen. */
    private static final int HOLD = 30;
    private static final String PENDING = "pending_approval";

    /** Records that may hold an approval instance (module, id): status-reset before cleanup. */
    private final List<String[]> made = new ArrayList<>();
    private Map<String, String> moduleIds;

    // ---------------------------------------------------------------- cleanup

    /** Runs before OrderTestBase's @AfterMethod (TestNG runs the subclass @After first). */
    @AfterMethod(alwaysRun = true)
    public void releaseLocks() {
        for (String[] m : made) {
            try {
                String s = api.approvalState(m[0], m[1]);
                if (s != null && !"none".equals(s) && !"not_submitted".equals(s))
                    owner().post("/workflow/approvals/records/" + m[0] + "/" + m[1] + "/status-reset", Map.of("reason", "QA AEO SH cleanup"));
            } catch (Exception e) {
                System.out.println("[SH release] " + m[1] + " " + e.getMessage());
            }
        }
        made.clear();
    }

    // ---------------------------------------------------------------- helpers

    private static void note(String c, Object what) {
        String s = what instanceof Response r ? r.statusCode() + " " + r.asString() : String.valueOf(what);
        System.out.println("[SH " + c + "] " + (s.length() > 1500 ? s.substring(0, 1500) + "…" : s));
    }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 400 ? s.substring(0, 400) + "…" : s);
    }

    private static boolean blocked(Response r) {
        return r.statusCode() / 100 == 4;
    }

    private static void on(Response r, String what) {
        Assert.assertEquals(r.statusCode() / 100, 2, what + " switched on: " + cut(r));
    }

    private Map<String, Object> leadFields(String c, String suffix) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(c, suffix));
        f.put("email", ("qa.aeo.sh." + c + "." + suffix).toLowerCase().replace(' ', '.').replace("-", "") + "@qa.test");
        f.put("lead_source", "chat");
        return f;
    }

    /** Lead created by userN (owner / submitter), registered for cleanup and for the approval reset. */
    private String lead(String c, String suffix) {
        String id = api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, suffix));
        made.add(new String[]{LEADS, id});
        return id;
    }

    private String desc(String module, String id) {
        return api.field(adminB(), module, id, "description");
    }

    private String ownerOf(String module, String id) {
        return api.field(adminB(), module, id, "owner");
    }

    private boolean pending(String module, String id) {
        return PENDING.equals(api.approvalState(module, id));
    }

    // ---- processes (all guarded to "QA AEO SH <case>") ----

    private String reviewLeads(String c, String guardSuffix) {
        String id = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", CrmProcs.guard(LEADS, nm(c, guardSuffix)),
                List.of("manual"), Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(api.setReviewActive(id, true, null), "RP " + c);
        return id;
    }

    private String approvalLeads(String c, String guardSuffix, boolean onCreate, boolean onEdit) {
        String id = api.approvalProcess(CrmProcs.approvalProcess(LEADS, c + " appr", onCreate, onEdit, CrmProcs.guard(LEADS, nm(c, guardSuffix)),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id())));
        on(api.setApprovalActive(id, true), "approval " + c);
        return id;
    }

    /** Leads blueprint on Lead Source chat → web (leads are created with lead_source = chat). */
    private String blueprintLeads(String c) {
        String id = api.blueprint(LEADS, CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP",
                CrmProcs.guard(LEADS, nm(c, "")), List.of("chat", "web"), null));
        on(api.setBlueprintActive(LEADS, id, true), "BP " + c);
        return id;
    }

    private String workflow(CrmProcs.Wf wf, String c) {
        String id = api.workflowRule(wf.build());
        on(api.setWorkflowActive(id, true), "WF " + c);
        return id;
    }

    /**
     * All five QA processes on Deals, guarded to this session's prefix (the converted deal's name is not ours to choose,
     * so the case guard would never match; session SH runs alone). AR adminA (Import/WebForm/Api), RP next_step on every
     * channel (reviewer adminA), WF On Create description = "WF <case>", AP On Create (supervisor), BP Stage.
     */
    private Map<String, String> dealsProcesses(String c) {
        Map<String, String> p = new LinkedHashMap<>();
        Map<String, Object> g = CrmProcs.guard(DEALS);
        p.put("ar", api.assignmentRule(CrmProcs.assignmentRule(DEALS, c + " AR", List.of("Import", "WebForm", "Api"), g,
                List.of(adminA().id()), "LeaveUnassigned", null)));
        on(api.setAssignmentRuleActive(p.get("ar"), true), "AR " + c);
        p.put("rp", api.reviewProcess(CrmProcs.reviewProcess(DEALS, layout(DEALS), c + " RP", g,
                List.of("manual", "excel_import", "workflow", "web_form", "api", "portal", "mobile_ingress"),
                Map.of("next_step", "single_line"), List.of(adminA().id()), List.of(adminA().id()))));
        on(api.setReviewActive(p.get("rp"), true, null), "RP " + c);
        p.put("wf", workflow(CrmProcs.workflow(DEALS, c + " WF").onCreate().fieldUpdate("description", "WF " + c), c));
        p.put("ap", api.approvalProcess(CrmProcs.approvalProcess(DEALS, c + " appr", true, false, g,
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id()))));
        on(api.setApprovalActive(p.get("ap"), true), "AP " + c);
        p.put("bp", api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), CrmApi.pipelineOf(layout(DEALS)), "stage", c + " BP",
                g, List.of("qualification", "proposal"), null)));
        on(api.setBlueprintActive(DEALS, p.get("bp"), true), "BP " + c);
        return p;
    }

    // ---- conversion ----

    /** apiName/key → module id, read once from GET /modules (fallback when a target has no moduleId). */
    private String moduleIdByKey(String key) {
        if (moduleIds == null) {
            moduleIds = new LinkedHashMap<>();
            List<Map<String, Object>> ms = ok(adminB().get("/modules"), "modules").jsonPath().getList("data");
            if (ms != null) for (Map<String, Object> m : ms) {
                for (String k : List.of("apiName", "api_name", "key", "moduleKey"))
                    if (m.get(k) != null) moduleIds.put(String.valueOf(m.get(k)).toLowerCase(), String.valueOf(m.get("id")));
            }
        }
        return key == null ? null : moduleIds.get(key.toLowerCase());
    }

    /** Converts as {@code as}; any target the server created is registered for cleanup. */
    private Response convert(CrmUser as, String leadId) {
        Response r = as.post("/modules/" + LEADS + "/records/" + leadId + "/convert", Map.of());
        if (r.statusCode() / 100 == 2) track(r);
        return r;
    }

    /** Converts as the lead owner (userN); if the User profile may not convert (403), as adminA. */
    private Response convertAsOwner(String c, String leadId) {
        Response r = convert(userN(), leadId);
        if (r.statusCode() == 403) {
            note(c, "userN convert -> 403, retried as adminA: " + cut(r));
            r = convert(adminA(), leadId);
        }
        note(c, "convert " + leadId);
        note(c, r);
        return r;
    }

    /** Created targets anywhere in the response (single convert: data.targets; mass convert: any nesting), with the lead id they belong to. */
    private List<Map<String, Object>> track(Response r) {
        List<Map<String, Object>> out = new ArrayList<>();
        try {
            collect(r.jsonPath().get("data"), null, out);
        } catch (Exception e) {
            note("track", "could not read targets: " + e.getMessage());
        }
        for (Map<String, Object> t : out) {
            String mid = String.valueOf(t.get("moduleId"));
            String rid = String.valueOf(t.get("recordId"));
            api.track(mid, rid);
            made.add(new String[]{mid, rid});
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private void collect(Object node, String leadId, List<Map<String, Object>> out) {
        if (node instanceof List<?> l) {
            for (Object o : l) collect(o, leadId, out);
        } else if (node instanceof Map<?, ?> raw) {
            Map<String, Object> m = (Map<String, Object>) raw;
            String lid = m.get("leadId") != null ? String.valueOf(m.get("leadId")) : leadId;
            Object rid = m.get("recordId");
            if (rid != null && (m.containsKey("moduleId") || m.containsKey("moduleKey")) && !"skipped".equals(m.get("outcome"))) {
                Map<String, Object> t = new LinkedHashMap<>(m);
                if (t.get("moduleId") == null) t.put("moduleId", moduleIdByKey(String.valueOf(t.get("moduleKey"))));
                t.put("leadId", lid);
                if (t.get("moduleId") != null) out.add(t);
                return;
            }
            for (Object v : m.values()) collect(v, lid, out);
        }
    }

    private static String summary(List<Map<String, Object>> targets) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> t : targets)
            sb.append(t.get("moduleKey")).append('=').append(t.get("recordId")).append(" (").append(t.get("outcome")).append(") ");
        return sb.length() == 0 ? "nothing" : sb.toString().trim();
    }

    private static String dealOf(List<Map<String, Object>> targets) {
        for (Map<String, Object> t : targets)
            if ("deals".equals(t.get("moduleKey")) || DEALS.equals(t.get("moduleId"))) return String.valueOf(t.get("recordId"));
        return null;
    }

    /**
     * Writes down which Deal processes ran on a converted deal and soft-asserts the Zoho points: AR does not run,
     * owner = convert dialog default (the lead owner). INCONCLUSIVE when the deal's name cannot match the guards.
     */
    private void observeDeal(String c, String dealId, Map<String, String> procs, SoftAssert s) {
        String name = api.field(adminA(), DEALS, dealId, "deal_name");
        if (name == null) name = api.field(adminA(), DEALS, dealId, "name");
        made.add(new String[]{DEALS, dealId});
        if (name == null || !name.startsWith(CrmOrderFeature.prefix()))
            inconclusive("converted deal " + dealId + " is named '" + name + "', which no QA process guard can match - Deal processes not observable");
        CrmApi.waitFor(WAIT, () -> api.reviewStatus(DEALS, dealId) != null || api.firedCount(dealId, procs.get("wf")) > 0
                || api.approvalState(DEALS, dealId) != null || api.governed(DEALS, dealId));
        CrmUser.sleep(10_000);
        boolean arRan = api.executions(dealId).stream().anyMatch(e -> procs.get("ar").equals(e.get("assignmentRuleId")));
        String review = api.reviewStatus(DEALS, dealId);
        long wf = api.firedCount(dealId, procs.get("wf"));
        String ap = api.approvalState(DEALS, dealId);
        boolean bp = api.governed(DEALS, dealId);
        String owner = ownerOf(DEALS, dealId);
        note(c, "DEAL " + dealId + " '" + name + "' processes: AR=" + arRan + " RP=" + review + " WF fired=" + wf + " AP=" + ap + " BP governed=" + bp
                + " owner=" + owner + " (lead owner userN=" + userN().id() + ")");
        traceOf(c, DEALS, dealId);
        s.assertFalse(arRan, "assignment rule must not run on a converted deal (Zoho)");
        s.assertEquals(owner, userN().id(), "deal owner = convert default (lead owner)");
    }

    // ---- misc ----

    /** First record (any module) with a field value exactly equal to {@code value}; pages through the newest records. */
    private String findByValue(String module, String value) {
        // the list is oldest first and ignores sort / page_size: scan the newest pages (CrmApi.newestRows)
        String[] found = {null};
        CrmApi.waitFor(WAIT, () -> {
            for (Map<String, Object> r : CrmApi.newestRows(adminB(), module, 3))
                if (r.get("data") instanceof List<?> l) for (Object o : l)
                    if (o instanceof Map<?, ?> f && f.get("value") instanceof Map<?, ?> v && value.equals(String.valueOf(v.get("value")))) {
                        found[0] = String.valueOf(r.get("id"));
                        return true;
                    }
            return false;
        });
        return found[0];
    }

    private static Instant at(Object iso) {
        try {
            return iso == null ? null : Instant.parse(String.valueOf(iso));
        } catch (Exception e) {
            return null;
        }
    }

    private Instant firstWfRun(String recordId, String ruleId) {
        Instant first = null;
        for (Map<String, Object> e : api.executions(recordId))
            if (ruleId.equals(e.get("ruleId")) && "Fired".equals(e.get("outcome"))) {
                Instant t = at(e.get("evaluatedAt"));
                if (t != null && (first == null || t.isBefore(first))) first = t;
            }
        return first;
    }

    private Instant firstApprovalEvent(String module, String id) {
        List<Map<String, Object>> h = api.approval(adminB(), module, id).getList("data.history");
        Instant first = null;
        if (h != null) for (Map<String, Object> e : h) {
            Instant t = at(e.get("occurredAt"));
            if (t != null && (first == null || t.isBefore(first))) first = t;
        }
        return first;
    }

    private Instant blueprintEntered(String module, String id) {
        List<Map<String, Object>> st = api.blueprintState(adminB(), module, id).getList("data.states");
        return st == null || st.isEmpty() ? null : at(st.get(0).get("enteredAt"));
    }

    private Object rowVersion(String module, String id) {
        JsonPath j = api.record(adminB(), module, id);
        for (String k : List.of("data.row_version", "data.rowVersion", "data.version"))
            if (j.get(k) != null) return j.get(k);
        return null;
    }

    /** PATCH that carries the version the user read (body row_version + If-Match), as a second browser tab would. */
    private Response patchAt(CrmUser as, String module, String id, Object rv, Map<String, Object> fields) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("data", CrmApi.data(fields));
        b.put("row_version", rv);
        return as.req().header("If-Match", String.valueOf(rv)).body(b).patch("/modules/" + module + "/records/" + id);
    }

    // ================================================================ H  lead conversion and cross-module

    @CaseId("H-01")
    @Test(groups = {"crm-order", "group-h"}, description = "Convert a released lead (no holds) to a Deal while Deals has all five QA processes: write down which run (Zoho: AR does not run, owner = convert dialog)")
    public void h01ConvertReleasedLeadDealProcesses() {
        String c = "H-01";
        Map<String, String> procs = dealsProcesses(c);
        String lead = lead(c, "lead");
        Response r = convertAsOwner(c, lead);
        Assert.assertEquals(r.statusCode() / 100, 2, "convert a released lead: " + cut(r));
        List<Map<String, Object>> t = track(r);
        traceOf(c, LEADS, lead);
        String deal = dealOf(t);
        if (deal == null) inconclusive("conversion created no Deal; it created: " + summary(t) + " | response " + cut(r));
        SoftAssert s = new SoftAssert();
        observeDeal(c, deal, procs, s);
        s.assertAll();
    }

    @CaseId("H-02")
    @Test(groups = {"crm-order", "group-h"}, description = "Convert a lead pending review: blocked")
    public void h02ConvertPendingReviewBlocked() {
        String c = "H-02";
        reviewLeads(c, "");
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, lead))), "lead held for review; status " + api.reviewStatus(LEADS, lead));
        SoftAssert s = new SoftAssert();
        for (CrmUser u : List.of(userN(), adminA())) {
            Response r = convert(u, lead);
            note(c, "convert as " + u + " -> " + cut(r));
            s.assertTrue(blocked(r), "convert of a lead pending review blocked for " + u + ": " + cut(r));
            if (r.statusCode() / 100 == 2) break;
        }
        traceOf(c, LEADS, lead);
        s.assertAll();
    }

    @CaseId("H-03")
    @Test(groups = {"crm-order", "group-h"}, description = "Convert a lead pending approval: blocked (Zoho: Convert disabled)")
    public void h03ConvertPendingApprovalBlocked() {
        String c = "H-03";
        approvalLeads(c, "", true, false);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pending(LEADS, lead)), "lead pending approval; state " + api.approvalState(LEADS, lead));
        SoftAssert s = new SoftAssert();
        for (CrmUser u : List.of(userN(), adminB())) {
            Response r = convert(u, lead);
            note(c, "convert as " + u + " -> " + cut(r));
            s.assertTrue(blocked(r), "convert of a lead pending approval blocked for " + u + ": " + cut(r));
            if (r.statusCode() / 100 == 2) break;
        }
        traceOf(c, LEADS, lead);
        s.assertAll();
    }

    @CaseId("H-04")
    @Test(groups = {"crm-order", "group-h"}, description = "Convert a lead in a blueprint: allowed only by a Convert transition (TAVI offers none: missing-list item 9) - so blocked; written down")
    public void h04ConvertLeadInBlueprint() {
        String c = "H-04";
        blueprintLeads(c);
        String lead = lead(c, "lead");
        if (!CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead))) inconclusive("lead never entered the blueprint");
        Response r = convert(userN(), lead);
        note(c, "convert as userN (no Convert transition exists) -> " + cut(r));
        Response a = null;
        if (r.statusCode() / 100 != 2) {
            a = convert(adminA(), lead);
            note(c, "convert as adminA -> " + cut(a));
        }
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(r), "lead in a blueprint not convertible outside a Convert transition (userN): " + cut(r));
        if (a != null) s.assertTrue(blocked(a), "same for adminA: " + cut(a));
        s.assertAll();
    }

    @CaseId("H-05")
    @Test(groups = {"crm-order", "group-h"}, description = "Converted lead's pending scheduled workflow actions are dropped (Zoho)")
    public void h05ScheduledActionsDroppedOnConvert() {
        String c = "H-05";
        String wf;
        try {
            wf = workflow(CrmProcs.workflow(LEADS, c + " WF scheduled").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).delayed(120), c);
        } catch (IllegalStateException e) {
            inconclusive("scheduled Field Update rule not accepted: " + e.getMessage());
            return;
        }
        String conv = lead(c, "converted");
        String ctl = lead(c, "control");
        CrmApi.waitFor(30, () -> !api.executions(conv).isEmpty());
        Response r = convertAsOwner(c, conv);
        Assert.assertEquals(r.statusCode() / 100, 2, "convert: " + cut(r));
        boolean ctlRan = CrmApi.waitFor(320, () -> ("WF " + c).equals(desc(LEADS, ctl)));
        CrmUser.sleep(15_000);
        String convDesc;
        try {
            convDesc = desc(LEADS, conv);
        } catch (Exception e) {
            convDesc = "UNREADABLE (" + e.getMessage() + ")";
        }
        note(c, "control ran=" + ctlRan + " converted lead description=" + convDesc + " runs=" + api.executions(conv));
        traceOf(c, LEADS, ctl);
        if (!ctlRan) inconclusive("control lead's scheduled action never ran (" + ctl + ")");
        if (convDesc != null && convDesc.startsWith("UNREADABLE")) inconclusive("converted lead can no longer be read, so the dropped action cannot be observed: " + convDesc);
        Assert.assertNotEquals(convDesc, "WF " + c, "scheduled action still ran on the converted lead " + conv);
    }

    @CaseId("H-06")
    @Test(groups = {"crm-order", "group-h"}, description = "Leads WF creates a Task; Tasks has its own WF + AP: the task runs its own chain")
    public void h06WorkflowTaskRunsOwnChain() {
        String c = "H-06";
        String title = nm(c, "task");
        String taskWf = workflow(CrmProcs.workflow(TASKS, c + " task WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c + " task"), c);
        String ap = api.approvalProcess(CrmProcs.approvalProcess(TASKS, c + " task appr", true, false, CrmProcs.guard(TASKS, nm(c, "")),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id())));
        on(api.setApprovalActive(ap, true), "Tasks AP " + c);
        String leadWf = workflow(CrmProcs.workflow(LEADS, c + " lead WF").guardCase(c).onCreate().task(title), c);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.firedCount(lead, leadWf) > 0), "control: Leads workflow fired: " + api.executions(lead));
        String task = findByValue(TASKS, title);
        traceOf(c, LEADS, lead);
        if (task == null) inconclusive("Leads workflow fired but no Tasks record named '" + title + "' was found (the Task action may create an activity outside the Tasks module)");
        api.track(TASKS, task);
        made.add(new String[]{TASKS, task});
        boolean wfRan = CrmApi.waitFor(WAIT, () -> api.firedCount(task, taskWf) > 0);
        boolean apStarted = CrmApi.waitFor(WAIT, () -> pending(TASKS, task));
        note(c, "task " + task + " own WF fired=" + wfRan + " approval=" + api.approvalState(TASKS, task) + " description=" + desc(TASKS, task));
        traceOf(c, TASKS, task);
        SoftAssert s = new SoftAssert();
        s.assertTrue(wfRan, "Tasks workflow ran on the workflow-created task");
        s.assertTrue(apStarted, "Tasks approval started on the workflow-created task");
        s.assertAll();
    }

    @CaseId("H-07")
    @Test(groups = {"crm-order", "group-h"}, description = "Mass convert: same as H-01 for each lead")
    public void h07MassConvert() {
        String c = "H-07";
        Map<String, String> procs = dealsProcesses(c);
        List<String> leads = List.of(lead(c, "one"), lead(c, "two"));
        Response r = null;
        StringBuilder tried = new StringBuilder();
        for (String path : List.of("/records/mass-convert", "/records/bulk-convert", "/records/convert", "/mass-convert")) {
            Response x = userN().post("/modules/" + LEADS + path, Map.of("record_ids", leads));
            if (x.statusCode() == 403) x = adminA().post("/modules/" + LEADS + path, Map.of("record_ids", leads));
            tried.append(path).append(" -> ").append(x.statusCode()).append("; ");
            if (x.statusCode() / 100 == 2) {
                r = x;
                break;
            }
        }
        note(c, "mass convert endpoints: " + tried);
        if (r == null) inconclusive("no mass-convert endpoint answered 2xx (" + tried + ") - mass convert not reachable through the API");
        note(c, r);
        List<Map<String, Object>> t = track(r);
        for (String l : leads) traceOf(c, LEADS, l);
        List<String> notConverted = new ArrayList<>();
        for (String l : leads) if (t.stream().noneMatch(x -> l.equals(x.get("leadId")))) notConverted.add(l);
        Assert.assertTrue(notConverted.isEmpty(), "every lead converted (created targets per lead); missing " + notConverted + " | " + summary(t));
        List<String> deals = new ArrayList<>();
        for (Map<String, Object> x : t) if ("deals".equals(x.get("moduleKey")) || DEALS.equals(x.get("moduleId"))) deals.add(String.valueOf(x.get("recordId")));
        if (deals.isEmpty()) inconclusive("mass conversion created no Deal; it created: " + summary(t));
        SoftAssert s = new SoftAssert();
        for (String d : deals) observeDeal(c, d, procs, s);
        s.assertAll();
    }

    // ================================================================ I  after the fact

    @CaseId("I-01")
    @Test(groups = {"crm-order", "group-i"}, description = "Edit while review is pending: blocked; no workflow, no approval")
    public void i01EditWhileReviewPending() {
        String c = "I-01";
        reviewLeads(c, "held");
        String wf = workflow(CrmProcs.workflow(LEADS, c + " WF on edit").guardCase(c).onEdit().fieldUpdate("lead_status_comment", "WF " + c), c);
        approvalLeads(c, "held", false, true);
        // control: the same on-edit workflow fires for a lead outside the review
        String ctl = lead(c, "ctl");
        Response ce = api.update(userN(), LEADS, ctl, Map.of("description", "QA control " + c));
        if (ce.statusCode() / 100 != 2 || !CrmApi.waitFor(WAIT, () -> api.firedCount(ctl, wf) > 0))
            inconclusive("control: on-edit workflow never fired on an unheld lead (edit " + cut(ce) + ")");
        String held = lead(c, "held");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, held))), "held for review");
        Response e = api.update(userN(), LEADS, held, Map.of("description", "QA edit " + c));
        note(c, "edit held -> " + cut(e));
        boolean wfRan = CrmApi.waitFor(HOLD, () -> api.firedCount(held, wf) > 0);
        String ap = api.approvalState(LEADS, held);
        traceOf(c, LEADS, ctl);
        traceOf(c, LEADS, held);
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(e), "edit of a record pending review blocked: " + cut(e));
        s.assertFalse(wfRan, "no workflow on the held record");
        s.assertTrue(ap == null || "none".equals(ap) || "not_submitted".equals(ap), "no approval on the held record (state " + ap + ")");
        s.assertAll();
    }

    @CaseId("I-02")
    @Test(groups = {"crm-order", "group-i"}, description = "Edit while approval is pending (no fields editable): blocked; no blueprint until approved")
    public void i02EditWhileApprovalPending() {
        String c = "I-02";
        approvalLeads(c, "", true, false);
        blueprintLeads(c);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pending(LEADS, lead)), "pending approval; state " + api.approvalState(LEADS, lead));
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA edit " + c));
        note(c, "edit pending -> " + cut(e));
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.governed(LEADS, lead));
        SoftAssert s = new SoftAssert();
        s.assertTrue(blocked(e), "edit while approval pending blocked: " + cut(e));
        s.assertFalse(leaked, "no blueprint while approval pending");
        Response a = api.approve(supervisor(), LEADS, lead);
        note(c, "approve -> " + cut(a));
        boolean control = a.statusCode() / 100 == 2 && CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead));
        traceOf(c, LEADS, lead);
        if (!control && !leaked) {
            s.assertAll();
            inconclusive("control: lead never entered the blueprint after approval, so 'no blueprint while pending' is not observable");
        }
        s.assertAll();
    }

    @CaseId("I-03")
    @Test(groups = {"crm-order", "group-i", "serial"}, description = "Deactivate the review process while a record waits, Release unreviewed: record continues WF → AP → BP in order")
    public void i03ReleaseUnreviewedContinuesChain() {
        String c = "I-03";
        String rp = reviewLeads(c, "");
        String wf = workflow(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("lead_status_comment", "WF " + c), c);
        approvalLeads(c, "", true, false);
        blueprintLeads(c);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, lead))), "held for review");
        Assert.assertEquals(api.firedCount(lead, wf), 0L, "no workflow while held");
        Response off = api.setReviewActive(rp, false, "move_to_system");
        note(c, "deactivate move_to_system -> " + cut(off));
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate with Release: " + cut(off));
        boolean wfRan = CrmApi.waitFor(WAIT, () -> api.firedCount(lead, wf) > 0);
        boolean apPending = CrmApi.waitFor(WAIT, () -> pending(LEADS, lead));
        boolean governed = false;
        if (apPending) {
            Response a = api.approve(supervisor(), LEADS, lead);
            note(c, "approve -> " + cut(a));
            governed = a.statusCode() / 100 == 2 && CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead));
        }
        Instant tWf = firstWfRun(lead, wf), tAp = firstApprovalEvent(LEADS, lead), tBp = blueprintEntered(LEADS, lead);
        note(c, "after release: review=" + api.reviewStatus(LEADS, lead) + " WF=" + wfRan + "@" + tWf + " AP=" + apPending + "@" + tAp + " BP=" + governed + "@" + tBp);
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(wfRan, "workflow ran after release");
        s.assertTrue(apPending, "approval started after release");
        s.assertTrue(governed, "blueprint after approval");
        if (tWf != null && tAp != null) s.assertFalse(tAp.isBefore(tWf), "WF before AP");
        if (tAp != null && tBp != null) s.assertFalse(tBp.isBefore(tAp), "AP before BP");
        s.assertAll();
    }

    @CaseId("I-04")
    @Test(groups = {"crm-order", "group-i", "serial"}, description = "Deactivate the approval process while pending: record stays pending (Zoho); blueprint still waits")
    public void i04DeactivateApprovalWhilePending() {
        String c = "I-04";
        String ap = approvalLeads(c, "", true, false);
        blueprintLeads(c);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pending(LEADS, lead)), "pending approval");
        Response off = api.setApprovalActive(ap, false);
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate approval: " + cut(off));
        boolean leaked = CrmApi.waitFor(HOLD, () -> api.governed(LEADS, lead));
        String st = api.approvalState(LEADS, lead);
        note(c, "after deactivation: state=" + st + " approval_status=" + api.approvalStatus(LEADS, lead) + " governed=" + leaked);
        SoftAssert s = new SoftAssert();
        s.assertEquals(st, PENDING, "stays pending after deactivation");
        s.assertFalse(leaked, "blueprint still waits");
        // control: approving releases it into the blueprint
        Response a = api.approve(supervisor(), LEADS, lead);
        note(c, "approve after deactivation -> " + cut(a));
        boolean control = a.statusCode() / 100 == 2 && CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead));
        traceOf(c, LEADS, lead);
        note(c, "control governed after approval = " + control);
        if (!control && !leaked && PENDING.equals(st)) {
            s.assertAll();
            inconclusive("control: lead never entered the blueprint after approval, so 'blueprint still waits' is not observable");
        }
        s.assertAll();
    }

    @CaseId("I-05")
    @Test(groups = {"crm-order", "group-i", "serial"}, description = "Deactivate the blueprint while a record is in it: write down the state-field lock after (expected: released, field editable)")
    public void i05DeactivateBlueprintWithRecord() {
        String c = "I-05";
        String bp = blueprintLeads(c);
        String lead = lead(c, "lead");
        if (!CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead))) inconclusive("lead never entered the blueprint");
        Response locked = api.update(userN(), LEADS, lead, Map.of("lead_source", "referral"));
        note(c, "edit state field while active -> " + cut(locked));
        if (!blocked(locked)) inconclusive("control: the state field was editable even while the blueprint was active: " + cut(locked));
        Response off = api.setBlueprintActive(LEADS, bp, false);
        note(c, "deactivate blueprint -> " + cut(off));
        Assert.assertEquals(off.statusCode() / 100, 2, "deactivate blueprint: " + cut(off));
        CrmUser.sleep(5000);
        boolean governedAfter = api.governed(LEADS, lead);
        Response after = api.update(userN(), LEADS, lead, Map.of("lead_source", "referral"));
        String src = api.field(adminB(), LEADS, lead, "lead_source");
        note(c, "LOCK AFTER DEACTIVATION: governed=" + governedAfter + " edit lead_source -> " + cut(after) + " value=" + src);
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertFalse(governedAfter, "record released from a deactivated blueprint");
        s.assertEquals(after.statusCode() / 100, 2, "state field editable after deactivation: " + cut(after));
        s.assertAll();
    }

    @CaseId("I-06")
    @Test(groups = {"crm-order", "group-i"}, description = "Delete the QA workflow rule between review approval and the WF step: no crash; chain continues to approval")
    public void i06DeleteWorkflowBetweenReviewAndWf() {
        String c = "I-06";
        reviewLeads(c, "");
        String wf = workflow(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().fieldUpdate("lead_status_comment", "WF " + c), c);
        approvalLeads(c, "", true, false);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, lead))), "held for review");
        adminB().post("/workflow/rules/" + wf + "/deactivate", null);
        Response del = adminB().delete("/workflow/rules/" + wf);
        note(c, "delete workflow rule -> " + cut(del));
        Assert.assertEquals(del.statusCode() / 100, 2, "workflow rule deleted: " + cut(del));
        Response rv = api.reviewField(adminA(), api.reviewRequestId(LEADS, lead), "email", true);
        note(c, "review approve -> " + cut(rv));
        Assert.assertEquals(rv.statusCode() / 100, 2, "review approve accepted (no crash): " + cut(rv));
        boolean reviewed = CrmApi.waitFor(WAIT, () -> "approved".equals(api.reviewStatus(LEADS, lead)));
        boolean apPending = CrmApi.waitFor(WAIT, () -> pending(LEADS, lead));
        note(c, "review=" + api.reviewStatus(LEADS, lead) + " approval=" + api.approvalState(LEADS, lead) + " executions=" + api.executions(lead));
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(reviewed, "review approved");
        s.assertTrue(apPending, "chain continues to approval after the workflow rule was deleted");
        s.assertEquals(api.firedCount(lead, wf), 0L, "deleted rule did not run");
        s.assertAll();
    }

    @CaseId("I-07")
    @Test(groups = {"crm-order", "group-i"}, description = "Two users save the same held record (two tabs, same row version): the second save gets a conflict, not a silent overwrite")
    public void i07ConcurrentSaveConflict() {
        String c = "I-07";
        blueprintLeads(c);
        String lead = lead(c, "lead");
        if (!CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead))) inconclusive("lead never entered the blueprint (the hold for this case)");
        Object rv = rowVersion(LEADS, lead);
        if (rv == null) inconclusive("the record API exposes no row_version / rowVersion / version, so a stale save cannot be sent");
        Response first = patchAt(userN(), LEADS, lead, rv, Map.of("description", "QA tab 1 " + c));
        note(c, "first save (userN, version " + rv + ") -> " + cut(first));
        if (first.statusCode() / 100 != 2) inconclusive("first save with the read version refused: " + cut(first));
        Response second = patchAt(adminA(), LEADS, lead, rv, Map.of("description", "QA tab 2 " + c));
        note(c, "second save (adminA, same version " + rv + ") -> " + cut(second));
        String now = desc(LEADS, lead);
        note(c, "description after both saves = " + now + " version now " + rowVersion(LEADS, lead));
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertTrue(second.statusCode() == 409 || (blocked(second) && second.asString().toLowerCase().contains("conflict")),
                "second save with a stale version gets a conflict: " + cut(second));
        s.assertEquals(now, "QA tab 1 " + c, "first save not silently overwritten");
        s.assertAll();
    }

    @CaseId("I-08")
    @Test(groups = {"crm-order", "group-i"}, description = "Approval status reset (Owner) on an approved record in a blueprint: write down re-entry vs blueprint (F-20: no re-entry)")
    public void i08StatusResetOnApprovedRecordInBlueprint() {
        String c = "I-08";
        approvalLeads(c, "", true, true);
        blueprintLeads(c);
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pending(LEADS, lead)), "pending approval");
        Assert.assertEquals(api.approve(supervisor(), LEADS, lead).statusCode() / 100, 2, "approve");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.approvalState(LEADS, lead))), "approved");
        if (!CrmApi.waitFor(WAIT, () -> api.governed(LEADS, lead))) inconclusive("approved lead never entered the blueprint");
        String inst = api.approval(adminB(), LEADS, lead).getString("data.instanceId");
        Response reset = owner().post("/workflow/approvals/records/" + LEADS + "/" + lead + "/status-reset", Map.of("reason", "QA AEO SH " + c));
        note(c, "owner status-reset -> " + cut(reset));
        Assert.assertEquals(reset.statusCode() / 100, 2, "Owner status reset accepted: " + cut(reset));
        boolean reentered = CrmApi.waitFor(HOLD, () -> pending(LEADS, lead));
        JsonPath v = api.approval(adminB(), LEADS, lead);
        boolean governed = api.governed(LEADS, lead);
        note(c, "AFTER RESET: state=" + v.getString("data.state") + " instance " + inst + " -> " + v.getString("data.instanceId")
                + " approval_status=" + api.approvalStatus(LEADS, lead) + " re-entered=" + reentered + " governed=" + governed);
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertFalse(reentered, "reset record in a blueprint does not re-enter approval (as F-20)");
        s.assertTrue(governed, "record stays in the blueprint after the reset");
        s.assertAll();
    }

    @CaseId("I-09")
    @Test(groups = {"crm-order", "group-i"}, description = "Delete a record pending review, then restore it from the Recycle Bin: write down which holds come back")
    public void i09DeleteHeldRecordThenRestore() {
        String c = "I-09";
        reviewLeads(c, "");
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, lead))), "held for review");
        CrmUser by = null;
        StringBuilder tries = new StringBuilder();
        for (CrmUser u : List.of(userN(), adminA(), owner())) {
            Response d = u.delete("/modules/" + LEADS + "/records/" + lead);
            tries.append(u).append(" -> ").append(cut(d)).append("; ");
            if (d.statusCode() / 100 == 2) {
                by = u;
                break;
            }
        }
        note(c, "delete held record: " + tries);
        if (by == null) {
            traceOf(c, LEADS, lead);
            inconclusive("a record pending review cannot be deleted by userN, adminA or Owner (" + tries + "), so restore cannot be exercised");
        }
        Response restore = by.post("/modules/" + LEADS + "/records/" + lead + "/restore", Map.of());
        note(c, "restore as " + by + " -> " + cut(restore));
        Assert.assertEquals(restore.statusCode() / 100, 2, "restore from the Recycle Bin: " + cut(restore));
        Response get = adminB().get("/modules/" + LEADS + "/records/" + lead);
        String review = api.reviewStatus(LEADS, lead);
        Response edit = api.update(userN(), LEADS, lead, Map.of("description", "QA after restore " + c));
        note(c, "HOLDS AFTER RESTORE: GET " + get.statusCode() + " review=" + review + " approval=" + api.approvalState(LEADS, lead)
                + " edit by userN -> " + cut(edit));
        traceOf(c, LEADS, lead);
        SoftAssert s = new SoftAssert();
        s.assertEquals(get.statusCode() / 100, 2, "restored record readable");
        s.assertNotNull(review, "review history kept after restore (status " + review + ")");
        s.assertAll();
    }

    @CaseId("I-10")
    @Test(groups = {"crm-order", "group-i"}, description = "Workflow Owner Assignment on edit re-assigns a reviewed record: owner changes; no review re-entry")
    public void i10OwnerAssignmentOnEditNoReviewReentry() {
        String c = "I-10";
        reviewLeads(c, "");
        String lead = lead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, lead))), "held for review");
        Assert.assertEquals(api.reviewField(adminA(), api.reviewRequestId(LEADS, lead), "email", true).statusCode() / 100, 2, "review approve");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.reviewStatus(LEADS, lead))), "review approved");
        List<?> before = api.reviewHistory(adminB(), LEADS, lead).getList("data.cycles");
        int cyclesBefore = before == null ? 0 : before.size();
        String wf = workflow(CrmProcs.workflow(LEADS, c + " WF owner").guardCase(c).onEdit().owner("SpecificUser", adminA().id()), c);
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA edit " + c));
        if (e.statusCode() == 403) { // run 2: userN's edit of its own reviewed lead -> 403 PERMISSION_DENIED (noted); the case is about the On Edit owner assignment
            System.out.println("[SH I-10] userN edit -> " + cut(e) + "; edit done by adminB instead");
            e = api.update(adminB(), LEADS, lead, Map.of("description", "QA edit " + c));
        }
        Assert.assertEquals(e.statusCode() / 100, 2, "edit reviewed lead: " + cut(e));
        boolean fired = CrmApi.waitFor(WAIT, () -> api.firedCount(lead, wf) > 0);
        boolean changed = CrmApi.waitFor(WAIT, () -> adminA().id().equals(ownerOf(LEADS, lead)));
        CrmUser.sleep(5000);
        List<?> after = api.reviewHistory(adminB(), LEADS, lead).getList("data.cycles");
        int cyclesAfter = after == null ? 0 : after.size();
        String review = api.reviewStatus(LEADS, lead);
        note(c, "WF fired=" + fired + " owner=" + ownerOf(LEADS, lead) + " review=" + review + " cycles " + cyclesBefore + " -> " + cyclesAfter);
        traceOf(c, LEADS, lead);
        if (!fired) inconclusive("Owner Assignment workflow never fired on edit: " + api.executions(lead));
        SoftAssert s = new SoftAssert();
        s.assertTrue(changed, "owner changed to adminA by the workflow");
        s.assertEquals(cyclesAfter, cyclesBefore, "no new review cycle");
        s.assertEquals(review, "approved", "review status unchanged");
        s.assertAll();
    }
}
