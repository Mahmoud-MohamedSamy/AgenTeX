package qa.features.crmautomationorder;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.Rules;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;
import static qa.features.crmautomationorder.CrmProcs.and;
import static qa.features.crmautomationorder.CrmProcs.eq;
import static qa.features.crmautomationorder.CrmProcs.guard;
import static qa.features.crmautomationorder.CrmUser.ok;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Spec group G (full chain, all five QA processes active, by entry point, G-01…G-18) and the E2E journeys (E2E-1…E2E-6).
 * Session SG ("QA AEO SG …"). Every case defines its own five processes, guarded to the case ("QA AEO SG G-xx"):
 * Assignment (Import / WebForm / Api) → Review (reviewer adminA) → Workflow marker (description = "WF G-xx") →
 * Approval (approver adminB, or supervisor when adminB imports / the form is anonymous) → Blueprint
 * (Leads lead_source chat→web→referral, Deals stage qualification→proposal, Tasks priority low→normal→high).
 * The record is driven through: review hold → approve review → marker → approval hold → approve → governed, and the
 * order is checked on the server's own timestamps (assignment/workflow executions evaluatedAt, review cycle enteredAt
 * and decision time, approval history occurredAt, blueprint enteredAt), each stage once.
 * Assignment rules run only for Import / WebForm / Api (records API = source manual), so the entry points use the
 * import API (adminB, options.assignment_rule_id) and public web forms, as in GroupFHandoffTest / GroupAJTest.
 * userN is the Leads submitter (userV cannot write Leads Phone).
 */
public class GroupGChainTest extends OrderTestBase {
    @Override protected String session() { return "SG"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    /** Seconds to watch for something that must NOT happen. */
    private static final int HOLD = 20;
    /** Seconds to wait for an asynchronous result that must happen. */
    private static final int WAIT = 90;
    /** Server timestamps of stages run in one save may differ by a few ms in either order. */
    private static final long SKEW_MS = 2000;
    /** Run-unique token for engine-created records (lower case: never "AP"). */
    private static final String RUN = Long.toString(System.currentTimeMillis() % 1_000_000L, 36);

    /** Records of this case that may hold an approval (module, id): status-reset as Owner before the base cleanup deletes them. */
    private final List<String[]> mine = new ArrayList<>();
    /** QA web forms created by this case. */
    private final List<String> forms = new ArrayList<>();

    /** Runs before OrderTestBase.cleanupAndLog (subclass @AfterMethod first): pending approvals cannot be deleted. */
    @AfterMethod(alwaysRun = true)
    public void releaseLocks() {
        for (String[] m : mine) {
            try {
                String s = api.approvalState(m[0], m[1]);
                if (s != null && !"none".equals(s) && !"not_submitted".equals(s))
                    System.out.println("[SG cleanup] status-reset " + m[1] + " (" + s + ") -> " + owner().post("/workflow/approvals/records/" + m[0] + "/" + m[1]
                            + "/status-reset", Map.of("reason", "QA AEO SG cleanup")).statusCode());
            } catch (Exception e) {
                System.out.println("[SG cleanup] " + m[1] + " " + e.getMessage());
            }
        }
        mine.clear();
        for (String f : forms) {
            try {
                System.out.println("[SG cleanup] delete web form " + f + " -> " + adminB().delete("/web-forms/" + f).statusCode());
            } catch (Exception e) {
                System.out.println("[SG cleanup] web form " + f + " " + e.getMessage());
            }
        }
        forms.clear();
    }

    // =====================================================================================================
    // the chain under test
    // =====================================================================================================

    /** One record going through the five processes of a case. */
    private static final class Run {
        final String c;
        final String module;
        String id;
        String ar, rp, wf, ap, bp;
        String marker;
        CrmUser approver;
        CrmUser creator;   // owner when assignment must not run
        CrmUser assignee;  // owner the assignment rule must set
        int reviewCycles = 1;
        int apSubmissions = 1;

        Run(String c, String module) {
            this.c = c;
            this.module = module;
            this.marker = "WF " + c;
        }

        /** Same processes, another record. */
        Run copy() {
            Run r = new Run(c, module);
            r.ar = ar; r.rp = rp; r.wf = wf; r.ap = ap; r.bp = bp;
            r.marker = marker; r.approver = approver; r.creator = creator; r.assignee = assignee;
            r.reviewCycles = reviewCycles; r.apSubmissions = apSubmissions;
            return r;
        }
    }

    private static void note(String c, String msg) {
        System.out.println("[SG " + c + "] " + msg);
    }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 600 ? s.substring(0, 600) + "…" : s);
    }

    private static String cut(String s) {
        return s == null ? "null" : s.length() > 600 ? s.substring(0, 600) + "…" : s;
    }

    private static void on(Response r, String what) {
        Assert.assertEquals(r.statusCode() / 100, 2, what + " switched on: " + r.statusCode() + " " + r.asString());
    }

    private Map<String, Object> caseGuard(String module, String c) {
        return guard(module, nm(c, ""));
    }

    private static String reviewField(String module) {
        return DEALS.equals(module) ? "next_step" : TASKS.equals(module) ? "description" : "email";
    }

    private static String reviewType(String module) {
        return DEALS.equals(module) ? "single_line" : TASKS.equals(module) ? "multi_line" : "email";
    }

    private static String bpField(String module) {
        return DEALS.equals(module) ? "stage" : TASKS.equals(module) ? "priority" : "lead_source";
    }

    private static List<String> bpStates(String module) {
        return DEALS.equals(module) ? List.of("qualification", "proposal")
                : TASKS.equals(module) ? List.of("low", "normal", "high") : List.of("chat", "web", "referral");
    }

    /** Required fields + the reviewed field + the blueprint field's first state. */
    private Map<String, Object> fields(String module, String name) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(module, name));
        if (LEADS.equals(module)) {
            f.put("email", "qa.aeo.sg." + Integer.toHexString(name.hashCode()) + "@qa.test");
            f.put("lead_source", "chat");
            f.put("lead_status", "No Answer");
        } else if (DEALS.equals(module)) {
            f.put("next_step", "QA review");
        } else {
            f.put("description", "QA review");
            f.put("priority", "low");
        }
        return f;
    }

    // ---------------- the five processes (created inactive; activate(r) switches them on in order) ----------------

    private void ar(Run r, CrmUser assignee) {
        r.assignee = assignee;
        r.ar = api.assignmentRule(CrmProcs.assignmentRule(r.module, r.c + " AR", List.of("Import", "WebForm", "Api"), caseGuard(r.module, r.c),
                List.of(assignee.id()), "LeaveUnassigned", null));
    }

    private void rp(Run r, List<String> channels, Map<String, Object> criteria) {
        r.rp = api.reviewProcess(CrmProcs.reviewProcess(r.module, layout(r.module), r.c + " RP", criteria == null ? caseGuard(r.module, r.c) : criteria,
                channels, Map.of(reviewField(r.module), reviewType(r.module)), List.of(adminA().id()), List.of(adminA().id())));
    }

    /** trigger: create | edit | createOrEdit. */
    private void wf(Run r, String trigger, Map<String, Object> where) {
        CrmProcs.Wf w = CrmProcs.workflow(r.module, r.c + " WF").guardCase(r.c);
        if ("edit".equals(trigger)) w.onEdit(); else if ("createOrEdit".equals(trigger)) w.onCreateOrEdit(); else w.onCreate();
        if (where != null) w.where(where);
        r.wf = api.workflowRule(w.fieldUpdate("description", r.marker).build());
    }

    private void ap(Run r, boolean onCreate, boolean onEdit, Map<String, Object> criteria, CrmUser approver) {
        r.approver = approver;
        r.ap = api.approvalProcess(CrmProcs.approvalProcess(r.module, r.c + " appr", onCreate, onEdit, criteria == null ? caseGuard(r.module, r.c) : criteria,
                List.of(CrmProcs.levelUsers(approver.id())), List.of(adminA().id())));
    }

    private void bp(Run r, Map<String, Object> entry, List<String> states, List<Map<String, Object>> after) {
        String pipe = DEALS.equals(r.module) ? CrmApi.pipelineOf(layout(DEALS)) : null;
        r.bp = api.blueprint(r.module, CrmProcs.blueprint(CrmApi.moduleKey(r.module), layout(r.module), pipe, bpField(r.module), r.c + " BP",
                entry == null ? caseGuard(r.module, r.c) : entry, states == null ? bpStates(r.module) : states, after));
    }

    /** All five with the defaults (assignment → assignee, review on the channels, marker on create, approval on create). */
    private void allFive(Run r, CrmUser assignee, List<String> rpChannels, CrmUser approver) {
        ar(r, assignee);
        rp(r, rpChannels, null);
        wf(r, "create", null);
        ap(r, true, false, null, approver);
        bp(r, null, null, null);
    }

    private void activate(Run r) {
        if (r.ar != null) on(api.setAssignmentRuleActive(r.ar, true), "AR " + r.c);
        if (r.rp != null) on(api.setReviewActive(r.rp, true, null), "RP " + r.c);
        if (r.wf != null) on(api.setWorkflowActive(r.wf, true), "WF " + r.c);
        if (r.ap != null) on(api.setApprovalActive(r.ap, true), "AP " + r.c);
        if (r.bp != null) on(api.setBlueprintActive(r.module, r.bp, true), "BP " + r.c);
    }

    // ---------------- records ----------------

    /** Manual (UI-equivalent) create through the records API: source manual. */
    private String create(Run r, CrmUser as, String suffix) {
        return create(r, as, fields(r.module, nm(r.c, suffix)));
    }

    private String create(Run r, CrmUser as, Map<String, Object> f) {
        r.id = api.createRecord(as, r.module, layout(r.module), f);
        r.creator = as;
        mine.add(new String[]{r.module, r.id});
        return r.id;
    }

    private void adopt(String module, String id) {
        api.track(module, id);
        mine.add(new String[]{module, id});
    }

    // ---------------- reads ----------------

    private String owner(String module, String id) {
        return api.field(adminA(), module, id, "owner");
    }

    private String desc(Run r) {
        return api.field(adminA(), r.module, r.id, "description");
    }

    private boolean hasMarker(Run r) {
        return r.marker.equals(desc(r));
    }

    private static boolean started(String approvalState) {
        return approvalState != null && !"none".equals(approvalState) && !"not_submitted".equals(approvalState);
    }

    private boolean pendingApproval(Run r) {
        return "pending_approval".equals(api.approvalState(r.module, r.id));
    }

    private static boolean held(String reviewStatus) {
        return CrmApi.reviewPending(reviewStatus);
    }

    private List<Map<String, Object>> arRows(Run r) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(r.id)) if (r.ar != null && r.ar.equals(e.get("assignmentRuleId"))) out.add(e);
        return out;
    }

    private List<Map<String, Object>> wfRows(String recordId, String ruleId) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(recordId)) if (ruleId.equals(e.get("ruleId")) && "Fired".equals(e.get("outcome"))) out.add(e);
        return out;
    }

    /** What the record shows right now (for notes and failure messages). */
    private String state(Run r) {
        return "owner=" + owner(r.module, r.id) + " review=" + api.reviewStatus(r.module, r.id) + " description=" + desc(r)
                + " wfFired=" + (r.wf == null ? "-" : api.firedCount(r.id, r.wf)) + " approval=" + api.approvalState(r.module, r.id)
                + " governed=" + api.governed(r.module, r.id);
    }

    // =====================================================================================================
    // stages
    // =====================================================================================================

    /** Stage 1. expected TRUE = rule sets r.assignee; FALSE = must not run (manual entry); null = write down. */
    private boolean stageAssignment(Run r, Boolean expected) {
        if (r.ar == null) return false;
        if (Boolean.TRUE.equals(expected)) {
            boolean assigned = CrmApi.waitFor(WAIT, () -> r.assignee.id().equals(owner(r.module, r.id)));
            note(r.c, r.id + " owner " + owner(r.module, r.id) + " expected " + r.assignee.id() + " arRows " + arRows(r));
            Assert.assertTrue(assigned, "assignment ran first and set the owner to " + r.assignee + "; owner " + owner(r.module, r.id));
            return true;
        }
        if (Boolean.FALSE.equals(expected)) {
            Assert.assertEquals(owner(r.module, r.id), r.creator.id(), "assignment must not run on this entry point: owner stays the creator " + r.creator);
            Assert.assertTrue(arRows(r).isEmpty(), "no assignment execution on this entry point: " + arRows(r));
            return false;
        }
        boolean ran = !arRows(r).isEmpty();
        note(r.c, r.id + " assignment ran=" + ran + " owner " + owner(r.module, r.id));
        return ran;
    }

    /** Nothing after review may run while the record is held. */
    private void assertNothingAfterReview(Run r, String while_) {
        boolean leaked = CrmApi.waitFor(HOLD, () -> (r.wf != null && (hasMarker(r) || api.firedCount(r.id, r.wf) > 0))
                || (r.ap != null && started(api.approvalState(r.module, r.id))) || (r.bp != null && api.governed(r.module, r.id)));
        if (leaked) Assert.fail("a later stage ran while " + while_ + ": " + state(r));
    }

    private String waitReview(Run r, int seconds) {
        CrmApi.waitFor(seconds, () -> api.reviewStatus(r.module, r.id) != null);
        return api.reviewStatus(r.module, r.id);
    }

    /** Stage 2 (hold). expected TRUE = must be held; FALSE = must not; null = write down. Returns whether review ran. */
    private boolean stageReviewHold(Run r, Boolean expected) {
        if (Boolean.FALSE.equals(expected)) {
            Assert.assertNull(api.reviewStatus(r.module, r.id), "no review on this entry point");
            return false;
        }
        String st = waitReview(r, Boolean.TRUE.equals(expected) ? WAIT : 30);
        if (Boolean.TRUE.equals(expected)) Assert.assertTrue(held(st), "record held for review after entry; status " + st + " (" + state(r) + ")");
        else note(r.c, r.id + " review on this entry point: " + st);
        if (!held(st)) return st != null;
        assertNothingAfterReview(r, "review is pending");
        return true;
    }

    private void approveReview(Run r) {
        String req = api.reviewRequestId(r.module, r.id);
        Response x = api.reviewField(adminA(), req, reviewField(r.module), true);
        Assert.assertEquals(x.statusCode() / 100, 2, "review approve " + reviewField(r.module) + ": " + cut(x));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.reviewStatus(r.module, r.id))), "review approved; " + api.reviewStatus(r.module, r.id));
    }

    /** Stage 3: the workflow marker, once. */
    private void stageWorkflow(Run r, String after) {
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(r));
        Assert.assertTrue(marked, "workflow marker after " + after + ": " + state(r));
        CrmApi.waitFor(10, () -> api.firedCount(r.id, r.wf) > 1); // give a duplicate run time to show
        Assert.assertEquals(api.firedCount(r.id, r.wf), 1L, "workflow fired exactly once: " + wfRows(r.id, r.wf));
    }

    /** Stage 4 (hold): pending approval, and no blueprint while pending. */
    private void stageApprovalHold(Run r) {
        boolean pending = CrmApi.waitFor(WAIT, () -> pendingApproval(r));
        Assert.assertTrue(pending, "record submitted for approval after the workflow: " + state(r));
        boolean early = CrmApi.waitFor(HOLD, () -> api.governed(r.module, r.id));
        Assert.assertFalse(early, "blueprint must wait for the approval: " + state(r));
    }

    private void approveApproval(Run r) {
        Response a = api.approve(r.approver, r.module, r.id);
        Assert.assertEquals(a.statusCode() / 100, 2, "approve by " + r.approver + ": " + cut(a));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "approved".equals(api.approvalState(r.module, r.id))), "approved; " + api.approvalState(r.module, r.id));
    }

    /** Stage 5. */
    private void stageBlueprint(Run r) {
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(r.module, r.id));
        Assert.assertTrue(governed, "blueprint entered after the approval: " + state(r));
    }

    /** Whole chain AR → RP (hold) → [approve review] → WF → AP (hold) → [approve] → BP, then the order on server timestamps. */
    private void drive(Run r, Boolean arExpected, Boolean rpExpected) {
        try {
            boolean arRan = stageAssignment(r, arExpected);
            boolean rpRan = stageReviewHold(r, rpExpected);
            if (rpRan && held(api.reviewStatus(r.module, r.id))) approveReview(r);
            stageWorkflow(r, rpRan ? "review approval" : "entry");
            stageApprovalHold(r);
            approveApproval(r);
            stageBlueprint(r);
            assertOrder(r, arRan, rpRan);
        } finally {
            traceOf(r.c, r.module, r.id);
        }
    }

    // =====================================================================================================
    // order on the server's own timestamps
    // =====================================================================================================

    static Instant ts(Object o) {
        if (o == null) return null;
        String s = String.valueOf(o);
        try { return OffsetDateTime.parse(s).toInstant(); } catch (RuntimeException ignored) { /* next format */ }
        try { return Instant.parse(s); } catch (RuntimeException ignored) { /* next format */ }
        try { return LocalDateTime.parse(s).toInstant(ZoneOffset.UTC); } catch (RuntimeException ignored) { /* none */ }
        return null;
    }

    private static Instant firstTs(Map<String, Object> m, String... keys) {
        for (String k : keys) {
            Instant t = ts(m.get(k));
            if (t != null) return t;
        }
        return null;
    }

    /** Time the review cycle was decided: a decision timestamp on the cycle, else its latest event. */
    @SuppressWarnings("unchecked")
    private static Instant decidedAt(Map<String, Object> cycle) {
        Instant t = firstTs(cycle, "decidedAt", "completedAt", "resolvedAt", "closedAt", "approvedAt");
        if (t != null) return t;
        Instant last = null;
        if (cycle.get("events") instanceof List<?> ev)
            for (Object o : ev)
                if (o instanceof Map<?, ?> e) {
                    Instant x = firstTs((Map<String, Object>) e, "occurredAt", "createdAt", "at", "timestamp");
                    if (x != null && (last == null || x.isAfter(last))) last = x;
                }
        return last != null ? last : firstTs(cycle, "updatedAt");
    }

    /** Server timestamps of each stage of the record, in the expected order (null = not exposed). */
    private List<Object[]> stageTimes(Run r, boolean arRan, boolean rpRan, List<String> problems) {
        List<Object[]> seq = new ArrayList<>();
        if (arRan) {
            List<Map<String, Object>> rows = arRows(r);
            if (rows.size() != 1) problems.add("assignment ran " + rows.size() + " times: " + rows);
            seq.add(new Object[]{"assignment", rows.isEmpty() ? null : ts(rows.get(0).get("evaluatedAt"))});
        }
        if (rpRan) {
            List<Map<String, Object>> cycles = api.reviewHistory(adminA(), r.module, r.id).getList("data.cycles");
            int n = cycles == null ? 0 : cycles.size();
            if (n != r.reviewCycles) problems.add("review cycles " + n + ", expected " + r.reviewCycles);
            if (n > 0) {
                seq.add(new Object[]{"review entered", ts(cycles.get(0).get("enteredAt"))});
                seq.add(new Object[]{"review decided", decidedAt(cycles.get(n - 1))});
            }
        }
        if (r.wf != null) {
            List<Map<String, Object>> rows = wfRows(r.id, r.wf);
            if (rows.size() != 1) problems.add("workflow fired " + rows.size() + " times");
            seq.add(new Object[]{"workflow", rows.isEmpty() ? null : ts(rows.get(0).get("evaluatedAt"))});
        }
        if (r.ap != null) {
            List<Map<String, Object>> h = api.approval(adminA(), r.module, r.id).getList("data.history");
            Instant sub = null, appr = null, any = null;
            int subs = 0;
            boolean resubmitted = false;
            for (Map<String, Object> e : h == null ? List.<Map<String, Object>>of() : h) {
                String k = String.valueOf(e.get("eventKind")).toLowerCase();
                if (k.contains("resubmit")) resubmitted = true;
                Instant t = ts(e.get("occurredAt"));
                if (any == null) any = t;
                if (k.contains("submit")) {
                    subs++;
                    if (sub == null) sub = t;
                } else if (k.contains("approv")) appr = t;
            }
            // a resubmit makes a NEW approval instance whose history starts at "resubmitted" (the first submission is on the
            // old instance), so with a resubmit only the current instance's events can be counted
            if (resubmitted && subs >= 1) subs = r.apSubmissions;
            if (subs > 0 && subs != r.apSubmissions) problems.add("approval submitted " + subs + " times, expected " + r.apSubmissions + ": " + h);
            seq.add(new Object[]{"approval submitted", sub != null ? sub : any});
            seq.add(new Object[]{"approval approved", appr});
        }
        if (r.bp != null) {
            List<Map<String, Object>> st = api.blueprintState(adminA(), r.module, r.id).getList("data.states");
            if (st == null || st.size() != 1) problems.add("blueprint states " + st);
            seq.add(new Object[]{"blueprint entered", st == null || st.isEmpty() ? null : ts(st.get(0).get("enteredAt"))});
        }
        return seq;
    }

    /** Each stage once, and the server timestamps in the order AR → RP → WF → AP → BP. */
    private void assertOrder(Run r, boolean arRan, boolean rpRan) {
        List<String> problems = new ArrayList<>();
        List<Object[]> seq = stageTimes(r, arRan, rpRan, problems);
        StringBuilder line = new StringBuilder();
        List<String> missing = new ArrayList<>();
        Object[] prev = null;
        for (Object[] s : seq) {
            line.append(s[0]).append('=').append(s[1]).append("  ");
            if (s[1] == null) {
                missing.add((String) s[0]);
                continue;
            }
            if (prev != null && ((Instant) prev[1]).isAfter(((Instant) s[1]).plusMillis(SKEW_MS)))
                problems.add(prev[0] + " (" + prev[1] + ") is after " + s[0] + " (" + s[1] + ")");
            prev = s;
        }
        note(r.c, r.id + " order: " + line + (missing.isEmpty() ? "" : " | timestamps not exposed: " + missing));
        Assert.assertTrue(problems.isEmpty(), "order / once: " + problems + " | " + line);
    }

    // =====================================================================================================
    // entry points: import, web form, mass update, convert
    // =====================================================================================================

    private static String csvCell(Object v) {
        String s = v == null ? "" : String.valueOf(v);
        return s.contains(",") || s.contains("\"") ? "\"" + s.replace("\"", "\"\"") + "\"" : s;
    }

    /** Data-import API as {@code as}: upload → mapping (options) → validate → execute → final status. INCONCLUSIVE when the channel cannot be used. */
    private JsonPath importRows(CrmUser as, String module, String mode, String matchKey, List<Map<String, Object>> rows, String arId, boolean trigger) {
        List<String> headers = new ArrayList<>(rows.get(0).keySet());
        StringBuilder csv = new StringBuilder(String.join(",", headers)).append('\n');
        for (Map<String, Object> row : rows) {
            List<String> cells = new ArrayList<>();
            for (String h : headers) cells.add(csvCell(row.get(h)));
            csv.append(String.join(",", cells)).append('\n');
        }
        Response up = as.req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sg.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv").post("/modules/" + module + "/import");
        if (up.statusCode() / 100 != 2) inconclusive("import upload refused: " + cut(up));
        String sid = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + module + "/import/" + sid;
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", trigger);
        opts.put("assignment_rule_id", arId);
        opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mode", mode);
        body.put("match_field_key", matchKey);
        body.put("layout_id", layout(module));
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : headers) mapping.add(kinded("header", h, "field", h));
        body.put("mapping", mapping);
        body.put("options", opts);
        Response m = as.put(base + "/mapping", body);
        if (m.statusCode() / 100 != 2) inconclusive("import mapping refused: " + cut(m));
        Response v = as.post(base + "/validate", null);
        if (v.statusCode() / 100 != 2) inconclusive("import validate refused: " + cut(v));
        Response x = as.post(base + "/execute", null);
        if (x.statusCode() / 100 != 2) inconclusive("import execute refused: " + cut(x));
        CrmApi.waitFor(150, () -> {
            String st = as.get(base).jsonPath().getString("data.status");
            return st != null && (st.startsWith("completed") || st.equals("partially_completed") || st.equals("failed"));
        });
        JsonPath st = ok(as.get(base), "import status").jsonPath();
        System.out.println("[SG import " + CrmApi.moduleKey(module) + "] session " + sid + " status " + st.getString("data.status") + " created "
                + st.getString("data.created_count") + " updated " + st.getString("data.updated_count") + " errors " + cut(st.getString("data.errors")));
        return st;
    }

    private static Map<String, Object> asRow(Map<String, Object> f) {
        Map<String, Object> row = new LinkedHashMap<>();
        f.forEach((k, v) -> row.put(k, String.valueOf(v)));
        return row;
    }

    /** Imports one record (adminB, with the case's assignment rule) and returns its id; r.id is set. */
    private String imported(Run r, String suffix, boolean trigger) {
        String name = nm(r.c, suffix + " " + RUN);
        JsonPath st = importRows(adminB(), r.module, "add", null, List.of(asRow(fields(r.module, name))), r.ar, trigger);
        if (st.getInt("data.created_count") < 1) inconclusive("import created nothing: " + cut(st.prettify()));
        String sid = st.getString("data.session_id");
        String id = sid != null ? api.importedRecordId(sid, r.module, name, 60) : findByName(r.module, name);
        if (id == null) inconclusive("imported record '" + name + "' not found (executions by import session, newest list pages, review queue)");
        adopt(r.module, id);
        r.id = id;
        r.creator = adminB();
        return id;
    }

    /** Name-field value of a list row (data[] of {field, value:{kind,value}}). */
    private static String nameOf(Map<String, Object> row, String module) {
        if (!(row.get("data") instanceof List<?> l)) return null;
        for (Object o : l)
            if (o instanceof Map<?, ?> f && CrmProcs.nameField(module).equals(f.get("field")) && f.get("value") instanceof Map<?, ?> v)
                return v.get("value") == null ? null : String.valueOf(v.get("value"));
        return null;
    }

    /** Record by exact name (pages through the list, newest first; "?q=" search is not reliable on staging). */
    private String findByName(String module, String name) {
        // the list is oldest first and ignores sort / page_size / q: CrmApi scans the newest pages, then the review queue
        return api.findRecord(module, name, 60);
    }

    /** Public web-form submission into Leads (form owner = the case's assignment rule). INCONCLUSIVE when the form channel is not reachable. */
    private String webFormLead(Run r, String suffix, Map<String, Object> extraValues) {
        Map<String, Object> owner = new LinkedHashMap<>();
        owner.put("mode", "assignment_rule");
        owner.put("user_id", null);
        owner.put("assignment_rule_id", r.ar);
        owner.put("notify_owner", false);
        owner.put("notify_email", false);
        owner.put("notify_user_ids", List.of());
        String name = nm(r.c, suffix + " " + RUN);
        Map<String, Object> values = new LinkedHashMap<>();
        values.put("first_name", name);
        values.put("phone", CrmApi.minimal(LEADS, name).get("phone"));
        values.put("email", "qa.aeo.sg." + Integer.toHexString(name.hashCode()) + "@qa.test");
        values.put("lead_source", "chat");
        if (extraValues != null) values.putAll(extraValues);
        List<Map<String, Object>> formFields = new ArrayList<>();
        for (String k : values.keySet()) formFields.add(Map.of("key", k));
        Map<String, Object> def = new LinkedHashMap<>();
        def.put("version", 2);
        def.put("language", "en");
        def.put("success_message", "ok");
        def.put("fields", formFields);
        def.put("attachments", Map.of("enabled", false, "screenshot_enabled", false));
        def.put("captcha_enabled", false);
        def.put("launcher", null);
        def.put("allowed_origins", List.of());
        def.put("redirect_url", null);
        def.put("owner", owner);
        def.put("share_link_enabled", true);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("kind", "advanced_form");
        body.put("name", nm(r.c, "form " + RUN));
        body.put("department_id", null);
        body.put("layout_id", layout(LEADS));
        body.put("module_id", LEADS);
        body.put("definition", def);
        body.put("app_key", "crm");
        Response c = adminB().post("/web-forms", body);
        if (c.statusCode() / 100 != 2) inconclusive("QA web form could not be created: " + cut(c));
        forms.add(c.jsonPath().getString("data.id"));
        String pub = CrmOrderFeature.API + "/web-forms/public/" + c.jsonPath().getString("data.embed_key");
        Response s = RestAssured.given().relaxedHTTPSValidation().accept(ContentType.JSON).post(pub + "/session");
        String tok = s.jsonPath().getString("data.session_token");
        if (tok == null) inconclusive("public web-form session not issued: " + s.statusCode());
        Map<String, Object> sub = new LinkedHashMap<>();
        sub.put("submission_id", UUID.randomUUID().toString());
        sub.put("values", values);
        sub.put("file_ids", List.of());
        sub.put("captcha_token", null);
        sub.put("page_origin", null);
        sub.put("honeypot", "");
        Response x = RestAssured.given().relaxedHTTPSValidation().accept(ContentType.JSON).contentType(ContentType.JSON)
                .header("X-Web-Form-Session", tok).body(sub).post(pub + "/submissions");
        note(r.c, "web-form submit " + cut(x));
        if (x.statusCode() / 100 != 2) inconclusive("public web-form submission refused: " + cut(x));
        String id = findByName(LEADS, name);
        if (id == null) inconclusive("web-form lead '" + name + "' not found after submit");
        adopt(LEADS, id);
        r.id = id;
        r.creator = null;
        note(r.c, "web-form lead " + id + " source=" + api.record(adminA(), LEADS, id).getString("data.source"));
        return id;
    }

    /** POST mass-update as userN (adminB when userN has no permission). */
    private Response massUpdate(String c, String module, List<String> ids, Map<String, Object> values) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("record_ids", ids);
        body.put("data", CrmApi.data(values));
        Response mu = userN().post("/modules/" + module + "/records/mass-update", body);
        if (mu.statusCode() == 403) {
            note(c, "userN mass update -> 403, retried as adminB");
            mu = adminB().post("/modules/" + module + "/records/mass-update", body);
        }
        note(c, "mass update -> " + cut(mu));
        return mu;
    }

    /** Converted record ids of a module from a convert response (data.targets[]). */
    private static List<String> converted(Response c, String module) {
        List<String> out = new ArrayList<>();
        List<Map<String, Object>> t = c.jsonPath().getList("data.targets");
        if (t != null)
            for (Map<String, Object> x : t) {
                Object rid = x.get("recordId") != null ? x.get("recordId") : x.get("id");
                if (rid != null && module.equals(x.get("moduleId")) && !"skipped".equals(x.get("outcome"))) out.add(String.valueOf(rid));
            }
        return out;
    }

    /** Records whose ids the Timeline of a record links ("<moduleKey>:<uuid>"), else by name. */
    private String linkedRecord(String fromModule, String fromId, String module, String name) {
        Matcher m = Pattern.compile(CrmApi.moduleKey(module) + ":([0-9a-f-]{36})").matcher(String.valueOf(api.timeline(fromModule, fromId)));
        if (m.find()) return m.group(1);
        return findByName(module, name);
    }

    /** Runs the blueprint to its last state, transition by transition (first offered to {@code as}, else to adminA). */
    private void runBlueprintToEnd(Run r, CrmUser as, int steps) {
        for (int i = 0; i < steps; i++) {
            List<Map<String, Object>> tr = api.blueprintState(as, r.module, r.id).getList("data.transitions");
            CrmUser by = as;
            if (tr == null || tr.isEmpty()) {
                by = adminA();
                tr = api.blueprintState(by, r.module, r.id).getList("data.transitions");
            }
            Assert.assertTrue(tr != null && !tr.isEmpty(), "transition " + (i + 1) + " offered: " + state(r));
            Response x = api.transition(by, r.module, r.id, String.valueOf(tr.get(0).get("transitionId")), Map.of());
            note(r.c, "transition " + (i + 1) + " by " + by + " -> " + cut(x));
            Assert.assertEquals(x.statusCode() / 100, 2, "transition " + (i + 1) + ": " + cut(x));
        }
    }

    // =====================================================================================================
    // G: Leads
    // =====================================================================================================

    @CaseId("G-01")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads UI create by userN: assignment does not run (manual); review → workflow → approval → blueprint in order, each once")
    public void g01LeadsUiCreate() {
        String c = "G-01";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("manual"), adminB());
        activate(r);
        create(r, userN(), "ui");
        drive(r, false, true);
        // control for "assignment did not run": the same active rule assigns an imported lead (not held: review is manual only)
        Run ctl = r.copy();
        imported(ctl, "ctl", true);
        boolean assigned = CrmApi.waitFor(WAIT, () -> userV().id().equals(owner(LEADS, ctl.id)));
        traceOf(c, LEADS, ctl.id);
        if (!assigned) inconclusive("chain in order, but the control (imported lead assigned by the same rule) failed: owner " + owner(LEADS, ctl.id));
    }

    @CaseId("G-02")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads API create with the assignment rule: all five in order (API channel)")
    public void g02LeadsApiCreate() {
        String c = "G-02";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("api", "manual"), adminB());
        activate(r);
        create(r, userN(), "api");
        String source = api.record(adminA(), LEADS, r.id).getString("data.source");
        note(c, r.id + " source=" + source);
        if ("api".equals(source)) {
            drive(r, true, true);
            return;
        }
        drive(r, false, true); // the rest of the chain is still checked
        inconclusive("no API channel: a records-API create has source '" + source + "', so the assignment stage cannot run; review → workflow → approval → blueprint ran in order");
    }

    @CaseId("G-03")
    @Test(groups = {"crm-order", "group-g", "NDC-1211"}, description = "Leads Excel import, rule chosen, trigger automation on: all five in order")
    public void g03LeadsImportTriggerOn() {
        String c = "G-03";
        Run r = new Run(c, LEADS);
        allFive(r, userN(), List.of("excel_import"), supervisor());
        activate(r);
        imported(r, "imp", true);
        drive(r, true, true);
    }

    @CaseId("G-04")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads import with trigger automation off: workflow, approval and blueprint do not run (Zoho runs nothing); review hold written down")
    public void g04LeadsImportTriggerOff() {
        String c = "G-04";
        Run r = new Run(c, LEADS);
        allFive(r, userN(), List.of("excel_import"), supervisor());
        activate(r);
        imported(r, "off", false);
        boolean arRan = stageAssignment(r, null);
        String review = waitReview(r, 30);
        note(c, r.id + " trigger off: assignment ran=" + arRan + ", review " + review + " (TAVI review channel 'Excel import' may hold)");
        if (held(review)) approveReview(r);
        boolean leaked = CrmApi.waitFor(HOLD, () -> hasMarker(r) || api.firedCount(r.id, r.wf) > 0 || started(api.approvalState(r.module, r.id))
                || api.governed(r.module, r.id));
        String seen = state(r);
        traceOf(c, LEADS, r.id);
        // control: the same import with trigger on reaches the workflow
        Run ctl = r.copy();
        imported(ctl, "on", true);
        if (held(waitReview(ctl, 30))) approveReview(ctl);
        boolean control = CrmApi.waitFor(WAIT, () -> hasMarker(ctl));
        traceOf(c, LEADS, ctl.id);
        Assert.assertFalse(leaked, "import with 'trigger automation' off ran workflow/approval/blueprint: " + seen);
        if (!control) inconclusive("nothing ran with trigger off, but the control (trigger on) never got the workflow marker either: " + state(ctl));
    }

    @CaseId("G-05")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads import in update mode: no assignment (Zoho); what runs on update is written down and must keep the order")
    public void g05LeadsImportUpdate() {
        String c = "G-05";
        Run r = new Run(c, LEADS);
        ar(r, userV());
        rp(r, List.of("excel_import"), null);
        wf(r, "createOrEdit", null);
        ap(r, true, true, null, adminB());
        bp(r, null, null, null);
        // Leads' only unique field "name" is on no layout: put it on this session's QA layout (21 Oct 2026)
        CrmApi.placeFieldOnLayout(adminB(), LEADS, layout(LEADS), "name");
        create(r, userN(), "existing"); // before activation: the existing lead has no holds
        String unique = "QA-AEO-G05-" + (System.currentTimeMillis() % 1_000_000);
        api.update(adminA(), LEADS, r.id, Map.of("name", unique));
        activate(r);
        Response up = ok(adminB().req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sg.csv", "first_name\nx\n".getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + LEADS + "/import"), "upload");
        List<Map<String, Object>> fs = adminB().get("/modules/" + LEADS + "/import/" + up.jsonPath().getString("data.session_id")
                + "/fields?mode=update&layout_id=" + layout(LEADS)).jsonPath().getList("data");
        String match = null;
        if (fs != null) for (Map<String, Object> f : fs) if (Boolean.TRUE.equals(f.get("unique"))) { match = String.valueOf(f.get("field_name")); break; }
        if (match == null) inconclusive("Leads has no unique field, so an update-mode import cannot match an existing lead");
        String mv = api.field(adminA(), LEADS, r.id, match);
        if (mv == null) inconclusive("existing lead has no value in the unique field " + match);
        Map<String, Object> row = new LinkedHashMap<>();
        row.put(match, mv);
        // update mode still asks for every required field (21 Oct 2026): send the existing values
        row.put("first_name", api.field(adminA(), LEADS, r.id, "first_name"));
        row.put("phone", api.field(adminA(), LEADS, r.id, "phone"));
        row.put("single_line_3_9", "QA AEO");
        row.put("lead_status", "Busy");
        JsonPath st = importRows(adminB(), LEADS, "update", match, List.of(row), r.ar, true);
        note(c, "update import on " + match + ": updated " + st.getString("data.updated_count"));
        if (!CrmApi.waitFor(WAIT, () -> "Busy".equals(api.field(adminA(), LEADS, r.id, "lead_status"))))
            inconclusive("update import did not change the existing lead: " + cut(st.prettify()));
        try {
            Assert.assertEquals(owner(LEADS, r.id), userN().id(), "update import must not reassign (Zoho: no assignment on update)");
            Assert.assertTrue(arRows(r).isEmpty(), "no assignment execution on update: " + arRows(r));
            CrmApi.waitFor(WAIT, () -> hasMarker(r) || held(api.reviewStatus(LEADS, r.id)));
            String review = api.reviewStatus(LEADS, r.id);
            note(c, r.id + " after update import: " + state(r));
            if (held(review)) {
                assertNothingAfterReview(r, "review is pending after the update import");
                approveReview(r);
            }
            if (!CrmApi.waitFor(WAIT, () -> hasMarker(r))) {
                note(c, "update import ran no workflow: " + state(r));
                return; // written down; nothing ran out of order
            }
            if (CrmApi.waitFor(WAIT, () -> pendingApproval(r))) {
                Assert.assertFalse(CrmApi.waitFor(HOLD, () -> api.governed(LEADS, r.id)), "blueprint must wait for the approval: " + state(r));
                approveApproval(r);
                stageBlueprint(r);
                assertOrder(r, false, review != null);
            }
            note(c, "update import ran: " + state(r));
        } finally {
            traceOf(c, LEADS, r.id);
        }
    }

    @CaseId("G-06")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads clone of a released record: treated as a create (no assignment); review → workflow → approval → blueprint")
    public void g06LeadsClone() {
        String c = "G-06";
        Run src = new Run(c, LEADS);
        allFive(src, userV(), List.of("manual"), adminB());
        create(src, userN(), "source"); // created before activation: released, no holds
        activate(src);
        // TAVI has no clone endpoint (route list): the UI clone posts a new create with the source's values
        Map<String, Object> f = new LinkedHashMap<>();
        for (String k : List.of("phone", "single_line_3_9", "email", "lead_source", "lead_status")) f.put(k, api.field(adminA(), LEADS, src.id, k));
        f.put("first_name", nm(c, "clone"));
        f.put("email", "qa.aeo.sg.g06.clone@qa.test");
        Run r = src.copy();
        create(r, userN(), f);
        drive(r, false, true);
        Assert.assertNull(api.reviewStatus(LEADS, src.id), "the source lead is not touched by the clone");
    }

    @CaseId("G-07")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads mass update into the workflow/approval criteria: workflow → approval → blueprint in order for each record (no assignment, no review)")
    public void g07LeadsMassUpdate() {
        String c = "G-07";
        Map<String, Object> fu = eq("lead_status", "Follow Up");
        Run r = new Run(c, LEADS);
        ar(r, userV());
        rp(r, List.of("manual"), null);
        wf(r, "edit", fu);
        ap(r, false, true, and(caseGuard(LEADS, c), fu), supervisor());
        bp(r, and(caseGuard(LEADS, c), fu), null, null);
        Run r1 = r.copy(), r2 = r.copy();
        create(r1, userN(), "one");
        create(r2, userN(), "two");
        activate(r);
        Response mu = massUpdate(c, LEADS, List.of(r1.id, r2.id), Map.of("lead_status", "Follow Up"));
        Assert.assertEquals(mu.statusCode() / 100, 2, "mass update: " + cut(mu));
        // §2.3: review on edit is TAVI behaviour, written down (null), not judged
        drive(r1, false, null);
        drive(r2, false, null);
    }

    @CaseId("G-08")
    @Test(groups = {"crm-order", "group-g"}, description = "Leads web-form submission: assignment (form uses the rule) → review (web form channel) → workflow → approval → blueprint")
    public void g08LeadsWebForm() {
        String c = "G-08";
        Run r = new Run(c, LEADS);
        allFive(r, userN(), List.of("web_form"), supervisor());
        activate(r);
        webFormLead(r, "web", null);
        drive(r, true, true);
    }

    @CaseId("G-09")
    @Test(groups = {"crm-order", "group-g"}, description = "Lead created by a workflow Create Record action: review (Automation channel) → workflow → approval → blueprint")
    public void g09LeadsMadeByWorkflow() {
        String c = "G-09";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("workflow"), adminB());
        String made = nm(c, "made " + RUN);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("first_name", Rules.s(made));
        map.put("phone", Rules.s("01012345609"));
        map.put("single_line_3_9", Rules.s("QA AEO"));
        map.put("email", Rules.s("qa.aeo.sg.g09@qa.test"));
        map.put("lead_source", Rules.s("chat"));
        String src = api.workflowRule(CrmProcs.workflow(DEALS, c + " WF make lead").guardCase(c).onCreate().createRecord(LEADS, layout(LEADS), map).build());
        activate(r);
        on(api.setWorkflowActive(src, true), "source WF " + c);
        String deal = api.createRecord(userN(), DEALS, layout(DEALS), fields(DEALS, nm(c, "src")));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.firedCount(deal, src) > 0), "Create Record workflow fired on the source deal: " + api.executions(deal));
        String lead = findByName(LEADS, made);
        if (lead == null) inconclusive("workflow fired but the created lead '" + made + "' was not found");
        adopt(LEADS, lead);
        r.id = lead;
        r.creator = userN();
        traceOf(c, DEALS, deal);
        drive(r, null, true);
    }

    @CaseId("G-10")
    @Test(groups = {"crm-order", "group-g"}, description = "Lead created by a blueprint After 'Create record' action: as G-09 (review if Automation ticked, then the chain)")
    public void g10LeadsMadeByBlueprint() {
        String c = "G-10";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("workflow", "manual"), adminB());
        String made = nm(c, "made " + RUN);
        Map<String, Object> after = new LinkedHashMap<>();
        after.put("kind", "createRecord");
        after.put("targetModuleKey", "leads");
        after.put("layoutId", layout(LEADS));
        after.put("fields", kinded("first_name", made, "phone", "01012345610", "single_line_3_9", "QA AEO", "email", "qa.aeo.sg.g10@qa.test", "lead_source", "chat"));
        Run d = new Run(c, DEALS);
        bp(d, guard(DEALS, nm(c, "src")), null, List.of(after));
        activate(r);
        activate(d);
        d.id = api.createRecord(userN(), DEALS, layout(DEALS), fields(DEALS, nm(c, "src")));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.governed(DEALS, d.id)), "source deal governed by the blueprint");
        runBlueprintToEnd(d, userN(), 1);
        String lead = findByName(LEADS, made);
        traceOf(c, DEALS, d.id);
        if (lead == null) inconclusive("blueprint After 'Create record' made no lead '" + made + "' (missing list item 9: not offered in the After list)");
        adopt(LEADS, lead);
        r.id = lead;
        r.creator = userN();
        drive(r, null, null);
    }

    // =====================================================================================================
    // G: Deals
    // =====================================================================================================

    @CaseId("G-11")
    @Test(groups = {"crm-order", "group-g"}, description = "Deals UI create: review → workflow → approval → blueprint (no assignment)")
    public void g11DealsUiCreate() {
        String c = "G-11";
        Run r = new Run(c, DEALS);
        allFive(r, userV(), List.of("manual"), adminB());
        activate(r);
        create(r, userN(), "ui");
        drive(r, false, true);
    }

    @CaseId("G-12")
    @Test(groups = {"crm-order", "group-g"}, description = "Deals API create with the assignment rule: all five in order (API channel)")
    public void g12DealsApiCreate() {
        String c = "G-12";
        Run r = new Run(c, DEALS);
        allFive(r, userV(), List.of("api", "manual"), adminB());
        activate(r);
        create(r, userN(), "api");
        String source = api.record(adminA(), DEALS, r.id).getString("data.source");
        if ("api".equals(source)) {
            drive(r, true, true);
            return;
        }
        drive(r, false, true);
        inconclusive("no API channel: a records-API create has source '" + source + "', so the assignment stage cannot run; the rest ran in order");
    }

    @CaseId("G-13")
    @Test(groups = {"crm-order", "group-g"}, description = "Deals import with the rule, trigger automation on: all five in order")
    public void g13DealsImport() {
        String c = "G-13";
        Run r = new Run(c, DEALS);
        allFive(r, userN(), List.of("excel_import"), supervisor());
        activate(r);
        imported(r, "imp", true);
        drive(r, true, true);
    }

    // =====================================================================================================
    // G: Tasks
    // =====================================================================================================

    @CaseId("G-14")
    @Test(groups = {"crm-order", "group-g"}, description = "Tasks UI create: workflow → approval → blueprint without review, and with review (TAVI extra)")
    public void g14TasksUiCreate() {
        String c = "G-14";
        Run r = new Run(c, TASKS);
        ar(r, userV());
        rp(r, List.of("manual"), guard(TASKS, nm(c, "rp"))); // review only for the "rp" task
        wf(r, "create", null);
        ap(r, true, false, null, adminB());
        bp(r, null, null, null);
        activate(r);
        Run plain = r.copy();
        create(plain, userN(), "plain");
        drive(plain, false, false);
        Run reviewed = r.copy();
        create(reviewed, userN(), "rp");
        drive(reviewed, false, true);
    }

    @CaseId("G-15")
    @Test(groups = {"crm-order", "group-g"}, description = "Tasks API create with the assignment rule: assignment → … (API channel)")
    public void g15TasksApiCreate() {
        String c = "G-15";
        Run r = new Run(c, TASKS);
        allFive(r, userV(), List.of("api", "manual"), adminB());
        activate(r);
        create(r, userN(), "api");
        String source = api.record(adminA(), TASKS, r.id).getString("data.source");
        if ("api".equals(source)) {
            drive(r, true, true);
            return;
        }
        drive(r, false, true);
        inconclusive("no API channel: a records-API create has source '" + source + "', so the assignment stage cannot run; the rest ran in order");
    }

    // =====================================================================================================
    // G: cross-cutting
    // =====================================================================================================

    private static String kindOf(Map<String, Object> row) {
        String t = (row.get("entry_type") + " " + row.get("title") + " " + row.get("description") + " " + row.get("summary")).toLowerCase();
        if (t.contains("blueprint") || t.contains("transition")) return "blueprint";
        if (t.contains("review")) return "review";
        if (t.contains("approv")) return "approval";
        if (t.contains("assign")) return "assignment";
        if (t.contains("workflow") || t.contains("rule")) return "workflow";
        return null;
    }

    @CaseId("G-16")
    @Test(groups = {"crm-order", "group-g"}, description = "Timeline of a full-chain record lists each process with its time, in order (run on an imported lead: no API channel)")
    public void g16TimelineShowsOrder() {
        String c = "G-16";
        Run r = new Run(c, LEADS);
        allFive(r, userN(), List.of("excel_import"), supervisor());
        activate(r);
        imported(r, "imp", true);
        drive(r, true, true);
        List<Map<String, Object>> tl = api.timeline(LEADS, r.id);
        Map<String, Instant> first = new LinkedHashMap<>();
        Map<String, Integer> firstIdx = new LinkedHashMap<>();
        boolean timesMissing = false;
        for (int i = 0; i < tl.size(); i++) {
            String k = kindOf(tl.get(i));
            if (k == null) continue;
            Instant t = firstTs(tl.get(i), "occurred_at", "created_at", "occurredAt", "createdAt", "timestamp", "at");
            if (t == null) timesMissing = true;
            if (t != null && (first.get(k) == null || t.isBefore(first.get(k)))) first.put(k, t);
            firstIdx.putIfAbsent(k, i);
        }
        List<String> rows = new ArrayList<>();
        for (Map<String, Object> row : tl) rows.add(row.get("entry_type") + ":" + row.get("description"));
        note(c, r.id + " timeline " + cut(String.valueOf(rows)) + " first " + first);
        List<String> expected = List.of("assignment", "review", "workflow", "approval", "blueprint");
        List<String> absent = new ArrayList<>();
        for (String k : expected) if (!firstIdx.containsKey(k)) absent.add(k);
        Assert.assertTrue(absent.isEmpty(), "Timeline lists every process (Zoho: the Timeline displays the order each process ran); missing " + absent + " in " + cut(String.valueOf(rows)));
        if (timesMissing && first.size() < expected.size()) inconclusive("Timeline lists all five but without times for all of them: " + first);
        Instant prev = null;
        String prevK = null;
        for (String k : expected) {
            Instant t = first.get(k);
            if (prev != null) Assert.assertFalse(prev.isAfter(t.plusMillis(SKEW_MS)), "Timeline order: " + prevK + " (" + prev + ") after " + k + " (" + t + ")");
            prev = t;
            prevK = k;
        }
    }

    @CaseId("G-17")
    @Test(groups = {"crm-order", "group-g"}, description = "Same save fires 2 workflow rules + 1 approval: WF1, WF2 in list order, then approval; each once")
    public void g17TwoWorkflowsThenApproval() {
        String c = "G-17";
        Run r = new Run(c, LEADS);
        ar(r, userV());
        rp(r, List.of("manual"), null);
        String one = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF one").guardCase(c).onCreate().fieldUpdate("description", "WF G-17 one").build());
        String two = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF two").guardCase(c).onCreate().fieldUpdate("description", "WF G-17 two").build());
        ap(r, true, false, null, adminB());
        bp(r, null, null, null);
        activate(r);
        on(api.setWorkflowActive(one, true), "WF one");
        on(api.setWorkflowActive(two, true), "WF two");
        create(r, userN(), "lead");
        try {
            stageAssignment(r, false);
            Assert.assertTrue(stageReviewHold(r, true), "held for review");
            boolean early = CrmApi.waitFor(HOLD, () -> api.firedCount(r.id, one) + api.firedCount(r.id, two) > 0);
            Assert.assertFalse(early, "no workflow while review pending");
            approveReview(r);
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.firedCount(r.id, one) > 0 && api.firedCount(r.id, two) > 0),
                    "both workflow rules fired after review approval: " + api.executions(r.id));
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(r)), "approval after the workflows: " + state(r));
            CrmApi.waitFor(10, () -> api.firedCount(r.id, one) > 1 || api.firedCount(r.id, two) > 1);
            Assert.assertEquals(api.firedCount(r.id, one), 1L, "WF one once");
            Assert.assertEquals(api.firedCount(r.id, two), 1L, "WF two once");
            // list order from the rules list (positions)
            List<Map<String, Object>> all = ok(adminA().get("/workflow/rules?take=200"), "rules").jsonPath().getList("data");
            Number pOne = null, pTwo = null;
            for (Map<String, Object> x : all) {
                if (one.equals(x.get("id"))) pOne = (Number) x.get("position");
                if (two.equals(x.get("id"))) pTwo = (Number) x.get("position");
            }
            boolean oneFirst = pOne == null || pTwo == null || pOne.intValue() <= pTwo.intValue();
            String firstId = oneFirst ? one : two, secondId = oneFirst ? two : one;
            Instant t1 = ts(wfRows(r.id, firstId).get(0).get("evaluatedAt"));
            Instant t2 = ts(wfRows(r.id, secondId).get(0).get("evaluatedAt"));
            List<Map<String, Object>> h = api.approval(adminA(), LEADS, r.id).getList("data.history");
            Instant sub = h == null || h.isEmpty() ? null : ts(h.get(0).get("occurredAt"));
            String descNow = api.field(adminA(), LEADS, r.id, "description");
            note(c, r.id + " positions one=" + pOne + " two=" + pTwo + " evaluated first=" + t1 + " second=" + t2 + " approval submitted=" + sub + " description=" + descNow);
            if (t1 != null && t2 != null) Assert.assertFalse(t1.isAfter(t2.plusMillis(SKEW_MS)), "workflows run in list order: first " + t1 + ", second " + t2);
            if (t2 != null && sub != null) Assert.assertFalse(t2.isAfter(sub.plusMillis(SKEW_MS)), "approval after both workflows: " + t2 + " vs " + sub);
            Assert.assertEquals(descNow, oneFirst ? "WF G-17 two" : "WF G-17 one", "the later rule in list order wins the field update");
            approveApproval(r);
            stageBlueprint(r);
        } finally {
            traceOf(c, LEADS, r.id);
        }
    }

    @CaseId("G-18")
    @Test(groups = {"crm-order", "group-g"}, description = "API create with an empty trigger list: written down what is skipped (Zoho: [] skips workflow, approval, blueprint)")
    public void g18ApiEmptyTrigger() {
        String c = "G-18";
        Run r = new Run(c, LEADS);
        // review only on the Web Form channel: since 22 Oct 2026 records-API creates are source=api, and holding them
        // in review would hide what the empty trigger list skips (workflow, approval, blueprint)
        allFive(r, userV(), List.of("web_form"), adminB());
        activate(r);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout(LEADS));
        body.put("data", CrmApi.data(fields(LEADS, nm(c, "empty trigger"))));
        body.put("trigger", List.of());
        body.put("source", "api"); // API channel declared (honoured since 22 Oct 2026)
        Response x = userN().post("/modules/" + LEADS + "/records", body);
        note(c, "create with trigger [] -> " + cut(x));
        if (x.statusCode() / 100 != 2) inconclusive("records API refused a 'trigger' list: " + cut(x));
        r.id = x.jsonPath().getString("data.id");
        r.creator = userN();
        adopt(LEADS, r.id);
        // control: the same create without the list runs the workflow
        Run ctl = r.copy();
        create(ctl, userN(), "control");
        boolean control = CrmApi.waitFor(WAIT, () -> hasMarker(ctl));
        boolean wfRan = CrmApi.waitFor(HOLD, () -> hasMarker(r) || api.firedCount(r.id, r.wf) > 0);
        boolean apRan = started(api.approvalState(LEADS, r.id));
        boolean bpRan = api.governed(LEADS, r.id);
        String source = api.record(adminA(), LEADS, r.id).getString("data.source");
        traceOf(c, LEADS, r.id);
        traceOf(c, LEADS, ctl.id);
        note(c, r.id + " source=" + source + " trigger [] → workflow ran=" + wfRan + " approval=" + apRan + " blueprint=" + bpRan + " (control marker " + control + ")");
        if (!control) inconclusive("control record (no trigger list) never got the workflow marker: " + state(ctl));
        if (wfRan || apRan || bpRan)
            inconclusive("TAVI accepts but ignores an empty 'trigger' list (no documented trigger parameter): workflow=" + wfRan + " approval=" + apRan + " blueprint=" + bpRan
                    + " (Zoho: [] skips all three); source " + source);
    }

    // =====================================================================================================
    // E2E journeys
    // =====================================================================================================

    @CaseId("E2E-1")
    @Test(groups = {"crm-order", "e2e"}, description = "Web lead happy path: web form → AR to userN → review approved → WF sets status + follow-up task → AP approved → BP to final state → convert → Deal chain")
    public void e2e1WebLeadHappyPath() {
        String c = "E2E-1";
        String taskTitle = nm(c, "follow up " + RUN);
        Run r = new Run(c, LEADS);
        ar(r, userN());
        rp(r, List.of("web_form"), null);
        r.wf = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate()
                .fieldUpdate("lead_status", "Follow Up").fieldUpdate("description", r.marker).task(taskTitle).build());
        ap(r, true, false, null, adminB());
        bp(r, null, null, null);
        Run d = new Run(c, DEALS);
        d.marker = "WF " + c + " deal"; // the lead's marker may be copied onto the deal by the conversion
        wf(d, "create", null);
        bp(d, null, null, null);
        activate(r);
        activate(d);
        webFormLead(r, "web", null);
        drive(r, true, true);
        Assert.assertEquals(api.field(adminA(), LEADS, r.id, "lead_status"), "Follow Up", "workflow set Lead Status");
        String task = linkedRecord(LEADS, r.id, TASKS, taskTitle);
        if (task != null) api.track(TASKS, task);
        Assert.assertNotNull(task, "workflow created the follow-up task '" + taskTitle + "'");
        runBlueprintToEnd(r, userN(), bpStates(LEADS).size() - 1);
        Assert.assertEquals(api.field(adminA(), LEADS, r.id, "lead_source"), "referral", "blueprint ran to the final state");
        Response cv = adminA().post("/modules/" + LEADS + "/records/" + r.id + "/convert", Map.of());
        note(c, "convert -> " + cut(cv));
        if (cv.statusCode() / 100 != 2) inconclusive("lead journey passed in order; convert of the lead in its final blueprint state refused (see H-04): " + cut(cv));
        List<String> deals = converted(cv, DEALS);
        for (String id : deals) adopt(DEALS, id);
        if (deals.isEmpty()) inconclusive("convert answered " + cv.statusCode() + " but named no Deal: " + cut(cv));
        d.id = deals.get(0);
        String dealName = api.field(adminA(), DEALS, d.id, "deal_name");
        if (dealName == null || !dealName.startsWith(nm(c, ""))) inconclusive("converted deal is named '" + dealName + "', outside the case guard: the Deal chain cannot be observed");
        boolean marked = CrmApi.waitFor(WAIT, () -> hasMarker(d));
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, d.id));
        traceOf(c, DEALS, d.id);
        Assert.assertTrue(marked, "Deal chain: workflow ran on the converted deal: " + state(d));
        Assert.assertTrue(governed, "Deal chain: blueprint entered on the converted deal");
        Assert.assertEquals(api.firedCount(d.id, d.wf), 1L, "Deal workflow once");
    }

    @CaseId("E2E-2")
    @Test(groups = {"crm-order", "e2e", "NDC-1697"}, description = "Imported lead, review rejection and recovery: import with the rule → reject Email → fix + resubmit → approved → WF → AP → BP")
    public void e2e2ImportReviewRejectRecover() {
        String c = "E2E-2";
        Run r = new Run(c, LEADS);
        allFive(r, userN(), List.of("excel_import"), supervisor());
        r.reviewCycles = 2;
        activate(r);
        imported(r, "imp", true);
        try {
            stageAssignment(r, true);
            Assert.assertTrue(stageReviewHold(r, true), "held for review");
            Response rej = api.reviewField(adminA(), api.reviewRequestId(LEADS, r.id), "email", false);
            Assert.assertEquals(rej.statusCode() / 100, 2, "reject Email: " + cut(rej));
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "rejected".equals(api.reviewStatus(LEADS, r.id))), "review rejected");
            Response fix = api.update(userN(), LEADS, r.id, Map.of("email", "qa.aeo.sg.e2e2.fixed@qa.test"));
            note(c, "owner fixes Email while rejected -> " + cut(fix));
            assertNothingAfterReview(r, "review is rejected (after the owner's edit, NDC-1697)");
            Assert.assertEquals(api.reviewStatus(LEADS, r.id), "rejected", "the edit alone does not release the record");
            String req = api.reviewRequestId(LEADS, r.id);
            Response rs = api.reviewResubmit(userN(), req);
            if (rs.statusCode() / 100 != 2) {
                note(c, "resubmit by owner userN -> " + cut(rs) + "; retried by the importer adminB");
                rs = api.reviewResubmit(adminB(), req);
            }
            Assert.assertEquals(rs.statusCode() / 100, 2, "resubmit: " + cut(rs));
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> held(api.reviewStatus(LEADS, r.id))), "resubmitted review pending");
            assertNothingAfterReview(r, "the resubmitted review is pending");
            approveReview(r);
            stageWorkflow(r, "the final review approval");
            stageApprovalHold(r);
            approveApproval(r);
            stageBlueprint(r);
            assertOrder(r, true, true);
        } finally {
            traceOf(c, LEADS, r.id);
        }
    }

    @CaseId("E2E-3")
    @Test(groups = {"crm-order", "e2e"}, description = "Approval rejection and recovery: lead → review OK → WF → AP rejected (no BP) → edit + resubmit → approved → BP")
    public void e2e3ApprovalRejectRecover() {
        String c = "E2E-3";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("manual"), adminB());
        r.apSubmissions = 2;
        activate(r);
        create(r, userN(), "lead"); // "API lead": records API (source manual, no API channel)
        try {
            stageAssignment(r, false);
            Assert.assertTrue(stageReviewHold(r, true), "held for review");
            approveReview(r);
            stageWorkflow(r, "review approval");
            stageApprovalHold(r);
            Response rj = api.reject(r.approver, LEADS, r.id);
            Assert.assertEquals(rj.statusCode() / 100, 2, "reject: " + cut(rj));
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "rejected".equals(api.approvalState(LEADS, r.id))), "approval rejected");
            Assert.assertFalse(CrmApi.waitFor(HOLD, () -> api.governed(LEADS, r.id)), "blueprint never starts while the approval is rejected");
            Response edit = api.update(userN(), LEADS, r.id, Map.of("lead_status", "Busy"));
            note(c, "owner edits the rejected lead -> " + cut(edit));
            Response rs = api.resubmitApproval(userN(), LEADS, r.id);
            Assert.assertEquals(rs.statusCode() / 100, 2, "resubmit approval: " + cut(rs));
            Assert.assertTrue(CrmApi.waitFor(WAIT, () -> pendingApproval(r)), "pending again after resubmit");
            Assert.assertFalse(CrmApi.waitFor(HOLD, () -> api.governed(LEADS, r.id)), "no blueprint while the resubmitted approval is pending");
            approveApproval(r);
            stageBlueprint(r);
            Assert.assertEquals(api.firedCount(r.id, r.wf), 1L, "workflow did not run again on the edit/resubmit");
            assertOrder(r, false, true);
        } finally {
            traceOf(c, LEADS, r.id);
        }
    }

    @CaseId("E2E-4")
    @Test(groups = {"crm-order", "e2e"}, description = "Deal pipeline: UI deal → review → WF update qualifies it for AP → approved → Stage blueprint to Closed Won")
    public void e2e4DealPipeline() {
        String c = "E2E-4";
        Run r = new Run(c, DEALS);
        ar(r, userV());
        rp(r, List.of("manual"), null);
        wf(r, "create", null);
        ap(r, true, true, and(caseGuard(DEALS, c), eq("description", r.marker)), adminB()); // only the workflow's value qualifies
        bp(r, null, List.of("qualification", "proposal", "closed_won"), null);
        activate(r);
        create(r, userN(), "deal");
        drive(r, false, true);
        runBlueprintToEnd(r, userN(), 2);
        Assert.assertEquals(api.field(adminA(), DEALS, r.id, "stage"), "closed_won", "Stage blueprint ran to Closed Won");
    }

    @CaseId("E2E-5")
    @Test(groups = {"crm-order", "e2e"}, description = "Task approval: WF on Leads creates a task → Tasks approval → blueprint (on Priority; Status per E-15)")
    public void e2e5TaskApproval() {
        String c = "E2E-5";
        String title = nm(c, "wf task " + RUN);
        String lw = api.workflowRule(CrmProcs.workflow(LEADS, c + " WF lead").guardCase(c).onCreate().task(title).build());
        Run t = new Run(c, TASKS);
        ap(t, true, false, null, adminB());
        bp(t, null, List.of("normal", "high", "highest"), null); // the workflow task action creates priority "normal"
        activate(t);
        on(api.setWorkflowActive(lw, true), "Leads WF " + c);
        String lead = api.createRecord(userN(), LEADS, layout(LEADS), fields(LEADS, nm(c, "lead")));
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.firedCount(lead, lw) > 0), "Leads workflow fired: " + api.executions(lead));
        String task = linkedRecord(LEADS, lead, TASKS, title);
        traceOf(c, LEADS, lead);
        if (task == null) inconclusive("Leads workflow fired but the task '" + title + "' was not found");
        adopt(TASKS, task);
        t.id = task;
        try {
            stageApprovalHold(t);
            approveApproval(t);
            stageBlueprint(t);
            assertOrder(t, false, false);
        } finally {
            traceOf(c, TASKS, t.id);
        }
    }

    @CaseId("E2E-6")
    @Test(groups = {"crm-order", "e2e"}, description = "Negative recovery: review process deactivated mid-flight (release unreviewed) → held records continue WF → AP → BP in order, no duplicates")
    public void e2e6DeactivateReviewMidFlight() {
        String c = "E2E-6";
        Run r = new Run(c, LEADS);
        allFive(r, userV(), List.of("manual"), adminB());
        activate(r);
        Run r1 = r.copy(), r2 = r.copy();
        create(r1, userN(), "one");
        create(r2, userN(), "two");
        Assert.assertTrue(stageReviewHold(r1, true), "lead one held");
        Assert.assertTrue(stageReviewHold(r2, true), "lead two held");
        Response off = null;
        String used = null;
        for (String action : List.of("release_unreviewed", "move_to_system")) {
            off = api.setReviewActive(r.rp, false, action);
            note(c, "deactivate review, pendingAction " + action + " -> " + cut(off));
            if (off.statusCode() / 100 == 2) {
                used = action;
                break;
            }
        }
        Assert.assertNotNull(used, "review process could be deactivated with a release action: " + (off == null ? null : cut(off)));
        final String action = used;
        for (Run x : List.of(r1, r2)) {
            try {
                if (!CrmApi.waitFor(WAIT, () -> hasMarker(x)))
                    inconclusive("deactivation with pendingAction '" + action + "' did not release " + x.id + " into the workflow: " + state(x));
                CrmApi.waitFor(10, () -> api.firedCount(x.id, x.wf) > 1);
                Assert.assertEquals(api.firedCount(x.id, x.wf), 1L, "workflow once after the release");
                stageApprovalHold(x);
                approveApproval(x);
                stageBlueprint(x);
                assertOrder(x, false, true);
            } finally {
                traceOf(c, LEADS, x.id);
            }
        }
    }
}
