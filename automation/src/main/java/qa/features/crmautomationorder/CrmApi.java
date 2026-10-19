package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import static qa.features.crmautomationorder.CrmUser.ok;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * CRM automation API for the execution-order tests: records, the five processes, their run-time actions, and an
 * order trace per record. Everything created here is registered and removed by {@link #cleanup()} (processes are
 * deactivated before deletion; held review records are rejected so the process can be deleted).
 * Shapes verified on staging-crm 18 Oct 2026 (S0 probes); see features/crmautomationorder/feature-map.md.
 */
public class CrmApi {
    private final CrmUser admin;
    private final Deque<Runnable> undo = new ArrayDeque<>();

    /** admin = the account that creates and removes the QA processes (CRM Admin or Owner). */
    public CrmApi(CrmUser admin) {
        this.admin = admin;
    }

    public CrmUser admin() {
        return admin;
    }

    // ---------------- records ----------------

    public static String moduleKey(String module) {
        return CrmOrderFeature.DEALS.equals(module) ? "deals" : CrmOrderFeature.TASKS.equals(module) ? "tasks" : "leads";
    }

    /** Record value in the record API shape; "kind" first (the server answers 500 otherwise). */
    public static Map<String, Object> fv(Object v) {
        if (v == null) return kinded("kind", "null");
        if (v instanceof Number) return kinded("kind", "number", "value", v);
        if (v instanceof Boolean) return kinded("kind", "boolean", "value", v);
        return kinded("kind", "string", "value", String.valueOf(v));
    }

    public static List<Map<String, Object>> data(Map<String, Object> fields) {
        List<Map<String, Object>> d = new ArrayList<>();
        fields.forEach((k, v) -> d.add(kinded("field", k, "value", fv(v))));
        return d;
    }

    /** Required fields filled for each module (Leads: Full Name, Phone, Single Line Permission; Deals: Name + Deal name + pipeline; Tasks: Name + Subject). */
    public static Map<String, Object> minimal(String module, String name) {
        Map<String, Object> f = new LinkedHashMap<>();
        if (CrmOrderFeature.DEALS.equals(module)) {
            f.put("name", name);
            f.put("deal_name", name);
            f.put("pipeline", pipelineOf(defaultLayout(module)));
            f.put("stage", "qualification");
        } else if (CrmOrderFeature.TASKS.equals(module)) {
            f.put("name", name);
            f.put("subject", name);
            f.put("status", "Not Started");
        } else {
            f.put("first_name", name);
            f.put("phone", "010" + String.format("%08d", Math.floorMod(name.hashCode(), 100_000_000)));
            f.put("single_line_3_9", "QA AEO");
        }
        return f;
    }

    /** Per-session QA layouts (module → layout id), set by the test class; records and review processes go there. */
    private static final ThreadLocal<Map<String, String>> SESSION_LAYOUTS = ThreadLocal.withInitial(LinkedHashMap::new);

    public static void useLayout(String module, String layoutId) {
        SESSION_LAYOUTS.get().put(module, layoutId);
    }

    public static String defaultLayout(String module) {
        String s = SESSION_LAYOUTS.get().get(module);
        if (s != null) return s;
        return CrmOrderFeature.DEALS.equals(module) ? CrmOrderFeature.DEALS_STANDARD
                : CrmOrderFeature.TASKS.equals(module) ? CrmOrderFeature.TASKS_STANDARD : CrmOrderFeature.LEADS_QA_LAYOUT;
    }

    /**
     * Only one review process may cover a module + layout (inactive ones count), so every parallel session gets its own
     * restricted copy of the module's Standard layout ("QA AEO Layout <tag>", access mode "selected": nobody picks it in
     * the UI). Not registered in this instance's undo list: the test class deletes it in @AfterClass via {@link #deleteLayout}.
     */
    public static String createQaLayout(CrmUser admin, String module, String standardLayoutId, String tag) {
        Map<String, Object> std = ok(admin.get("/modules/" + module + "/layouts/" + standardLayoutId), "GET Standard layout").jsonPath().getMap("data");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("name", "QA AEO Layout " + tag);
        body.put("views", std.get("views"));
        body.put("assignedProfiles", List.of());
        body.put("accessMode", "all_users");
        body.put("status", "active");
        Response first = admin.post("/modules/" + module + "/layouts", body);
        if (first.statusCode() == 409) { // a layout of an aborted run that could not be deleted: use a unique name
            body.put("name", "QA AEO Layout " + tag + " " + (System.currentTimeMillis() % 1_000_000));
            first = admin.post("/modules/" + module + "/layouts", body);
        }
        Map<String, Object> made = ok(first, "create QA layout").jsonPath().getMap("data");
        String id = String.valueOf(made.get("id"));
        Map<String, Object> put = new LinkedHashMap<>();
        put.put("name", made.get("name"));
        put.put("views", made.get("views"));
        put.put("assignedProfiles", List.of());
        put.put("accessMode", "selected");
        put.put("status", made.get("status"));
        put.put("rowVersion", made.get("rowVersion"));
        ok(admin.put("/modules/" + module + "/layouts/" + id, put), "restrict QA layout");
        return id;
    }

    /** Deals pipelines are per layout (a new layout gets its own "Standard" pipeline): layout id → default pipeline id. */
    private static final Map<String, String> PIPELINES = new java.util.concurrent.ConcurrentHashMap<>(
            Map.of(CrmOrderFeature.DEALS_STANDARD, CrmOrderFeature.DEALS_PIPELINE));

    public static String pipelineOf(String dealsLayoutId) {
        return PIPELINES.computeIfAbsent(dealsLayoutId, l -> {
            List<Map<String, Object>> ps = ok(CrmUser.as(CrmOrderFeature.ADMIN_A).get("/modules/" + CrmOrderFeature.DEALS + "/pipelines?layout_id=" + l), "pipelines").jsonPath().getList("data");
            for (Map<String, Object> p : ps) if (Boolean.TRUE.equals(p.get("isDefault"))) return String.valueOf(p.get("id"));
            return ps.isEmpty() ? null : String.valueOf(ps.get(0).get("id"));
        });
    }

    public static Response deleteLayout(CrmUser admin, String module, String layoutId) {
        return admin.delete("/modules/" + module + "/layouts/" + layoutId);
    }

    /** Raw create (for negative cases). */
    public Response createRaw(CrmUser as, String module, String layoutId, Map<String, Object> fields) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layoutId);
        body.put("data", data(fields));
        return as.post("/modules/" + module + "/records", body);
    }

    /** Creates a record as {@code as} (registered for cleanup) and returns its id. */
    public String createRecord(CrmUser as, String module, String layoutId, Map<String, Object> fields) {
        String id = ok(createRaw(as, module, layoutId, fields), "create record in " + moduleKey(module)).jsonPath().getString("data.id");
        track(module, id);
        return id;
    }

    /** Records that were deleted too early (held by a review process: 422 REVIEW_LOCKED) are retried after the processes are gone. */
    private final List<Runnable> late = new ArrayList<>();

    /** Registers a record created by an engine (import, workflow Create Record) for cleanup. */
    public void track(String module, String id) {
        undo.push(() -> {
            Response d = admin.delete("/modules/" + module + "/records/" + id);
            if (d.statusCode() / 100 != 2 && d.statusCode() != 404) late.add(() -> deleteLate(module, id));
        });
    }

    /**
     * Retry after the processes are gone. A record still locked by an approval (422 APPROVAL_LOCKED; it keeps the QA
     * layout from being deleted, seen 18 Oct 2026) gets an Owner status reset first.
     */
    private void deleteLate(String module, String id) {
        Response d = admin.delete("/modules/" + module + "/records/" + id);
        if (d.statusCode() / 100 == 2 || d.statusCode() == 404) return;
        if (d.asString().contains("APPROVAL")) {
            CrmUser owner = CrmUser.as(CrmOrderFeature.OWNER);
            Response reset = owner.post("/workflow/approvals/records/" + module + "/" + id + "/status-reset", Map.of("reason", "QA AEO cleanup"));
            d = owner.delete("/modules/" + module + "/records/" + id);
            System.out.println("[cleanup late] " + id + " status-reset " + reset.statusCode() + ", delete " + d.statusCode());
        } else System.out.println("[cleanup late] " + id + " delete " + d.statusCode() + " " + d.asString());
    }

    public String createRecord(CrmUser as, String module, String name) {
        return createRecord(as, module, defaultLayout(module), minimal(module, name));
    }

    // ---------------- finding records in the list ----------------
    //
    // Probed 18 Oct 2026 (OrderHarnessTest.listParamsProbe): plain GET /modules/{m}/records?page=N lists NEWEST first,
    // 100 rows per page (per_page changes the size). page_size is ignored, and sort_by=created_at&sort_order=desc
    // returns OLDEST first (sort_order ignored) - that is why the earlier lookups never found new records. "?q=" finds
    // nothing. So: page 1, 2, 3 … without sort parameters.

    /** One page of the record list (100 rows, newest first). */
    public static JsonPath listPageJson(CrmUser as, String module, int page) {
        return ok(as.get("/modules/" + module + "/records?page=" + page), "list " + moduleKey(module)).jsonPath();
    }

    public static List<Map<String, Object>> listPage(CrmUser as, String module, int page) {
        List<Map<String, Object>> rows = listPageJson(as, module, page).getList("data");
        return rows == null ? List.of() : rows;
    }

    /** Number of list pages for this user (meta.total_pages, else from meta.total_count). */
    public static int totalPages(CrmUser as, String module) {
        JsonPath j = listPageJson(as, module, 1);
        Integer tp = j.get("meta.total_pages");
        if (tp != null && tp > 0) return tp;
        Number tc = j.get("meta.total_count");
        int size = j.getList("data") == null ? 100 : Math.max(1, j.getList("data").size());
        return tc == null ? 1 : Math.max(1, (int) Math.ceil(tc.doubleValue() / Math.max(size, 100)));
    }

    /** The newest rows: the first {@code pages} pages of the default (newest first) list. */
    public static List<Map<String, Object>> newestRows(CrmUser as, String module, int pages) {
        List<Map<String, Object>> out = new ArrayList<>();
        for (int p = 1; p <= pages; p++) {
            List<Map<String, Object>> rows = listPage(as, module, p);
            out.addAll(rows);
            if (rows.size() < 100) break;
        }
        return out;
    }

    /** Name-field value of a list row (data[] of {field, value:{kind,value}}). */
    public static String nameOf(Map<String, Object> row, String module) {
        Object d = row.get("data");
        if (!(d instanceof List<?> l)) return null;
        for (Object o : l)
            if (o instanceof Map<?, ?> f && CrmProcs.nameField(module).equals(f.get("field")) && f.get("value") instanceof Map<?, ?> v)
                return v.get("value") == null ? null : String.valueOf(v.get("value"));
        return null;
    }

    /** Ids of the newest records visible to {@code as} whose name is exactly {@code name} (last {@code pages} pages). */
    public static List<String> idsByName(CrmUser as, String module, String name, int pages) {
        List<String> ids = new ArrayList<>();
        for (Map<String, Object> r : newestRows(as, module, pages)) if (name.equals(nameOf(r, module))) ids.add(String.valueOf(r.get("id")));
        return ids;
    }

    /** Waits up to {@code seconds} for a record named {@code name} to be visible to {@code as}; its id or null. */
    public static String findByName(CrmUser as, String module, String name, int seconds) {
        String[] found = {null};
        waitFor(seconds, () -> {
            List<String> ids = idsByName(as, module, name, 3);
            if (!ids.isEmpty()) found[0] = ids.get(0);
            return !ids.isEmpty();
        });
        return found[0];
    }

    /** Is the record with this id among the newest rows of the list for {@code as}? */
    public static boolean listed(CrmUser as, String module, String id, int pages) {
        for (Map<String, Object> r : newestRows(as, module, pages)) if (id.equals(String.valueOf(r.get("id")))) return true;
        return false;
    }

    /**
     * Record created by an import session: the workflow/assignment execution rows carry correlationId = import session id
     * (seen 18 Oct 2026). Falls back to the newest rows of the list by exact name. Null when not found within seconds.
     */
    public String importedRecordId(String importSessionId, String module, String name, int seconds) {
        String[] found = {null};
        waitFor(seconds, () -> {
            List<Map<String, Object>> ex = ok(admin.get("/workflow/executions?correlationId=" + importSessionId + "&take=200"), "executions").jsonPath().getList("data");
            if (ex != null) for (Map<String, Object> e : ex)
                if (importSessionId.equals(e.get("correlationId")) && module.equals(e.get("moduleId")) && e.get("recordId") != null) {
                    found[0] = String.valueOf(e.get("recordId"));
                    return true;
                }
            found[0] = findNow(module, name);
            return found[0] != null;
        });
        return found[0];
    }

    /**
     * A record by exact name, wherever it is visible to the process admin: the newest list pages, else the review queue
     * (records held for review are not returned by the list). Polls up to seconds; null when not found.
     */
    public String findRecord(String module, String name, int seconds) {
        String[] found = {null};
        waitFor(seconds, () -> {
            found[0] = findNow(module, name);
            return found[0] != null;
        });
        return found[0];
    }

    private String findNow(String module, String name) {
        List<String> ids = idsByName(admin, module, name, 3);
        if (!ids.isEmpty()) return ids.get(0);
        Response q = admin.get("/workflow/reviews/queue?take=100");
        if (q.statusCode() / 100 == 2) {
            List<Map<String, Object>> rows = q.jsonPath().getList("data");
            if (rows != null) for (Map<String, Object> r : rows)
                if (name.equals(r.get("recordLabel")) && module.equals(r.get("moduleId"))) return String.valueOf(r.get("recordId"));
        }
        return null;
    }

    /** Record held by a review process, found through the admin review queue by its label (held records are not listed). */
    public String heldRecordId(String processId, String label, int seconds) {
        String[] found = {null};
        waitFor(seconds, () -> {
            List<Map<String, Object>> q = ok(admin.get("/workflow/reviews/queue?processId=" + processId + "&take=100"), "review queue").jsonPath().getList("data");
            if (q != null) for (Map<String, Object> r : q)
                if (processId.equals(r.get("processId")) && label.equals(r.get("recordLabel"))) {
                    found[0] = String.valueOf(r.get("recordId"));
                    return true;
                }
            return false;
        });
        return found[0];
    }

    public Response update(CrmUser as, String module, String id, Map<String, Object> fields) {
        return as.patch("/modules/" + module + "/records/" + id, Map.of("data", data(fields)));
    }

    public JsonPath record(CrmUser as, String module, String id) {
        return ok(as.get("/modules/" + module + "/records/" + id), "GET record " + id).jsonPath();
    }

    /** One field's value (null when the field is not on the record). */
    public String field(CrmUser as, String module, String id, String key) {
        List<Map<String, Object>> d = record(as, module, id).getList("data.data");
        for (Map<String, Object> f : d)
            if (key.equals(f.get("field")) && f.get("value") instanceof Map<?, ?> v) return v.get("value") == null ? null : String.valueOf(v.get("value"));
        return null;
    }

    public String approvalStatus(String module, String id) {
        return field(admin, module, id, "approval_status");
    }

    public Response deleteRecord(String module, String id) {
        return admin.delete("/modules/" + module + "/records/" + id);
    }

    // ---------------- processes (created inactive, then switched on by the case) ----------------

    private String create(String path, Map<String, Object> body, String what) {
        String id = ok(admin.post(path, body), "create " + what).jsonPath().getString("data.id");
        return id;
    }

    public String assignmentRule(Map<String, Object> body) {
        String id = create("/workflow/assignment-rules", body, "assignment rule");
        undo.push(() -> {
            setAssignmentRuleActive(id, false);
            admin.delete("/workflow/assignment-rules/" + id);
        });
        return id;
    }

    public Response setAssignmentRuleActive(String id, boolean on) {
        Map<String, Object> cur = new LinkedHashMap<>(ok(admin.get("/workflow/assignment-rules/" + id), "GET assignment rule").jsonPath().getMap("data"));
        cur.put("isActive", on);
        return admin.patch("/workflow/assignment-rules/" + id, cur);
    }

    public String reviewProcess(Map<String, Object> body) {
        String id = create("/workflow/review-processes", body, "review process");
        undo.push(() -> {
            setReviewActive(id, false, "reject_all");
            admin.delete("/workflow/review-processes/" + id);
        });
        return id;
    }

    /** pendingAction (only when it holds records): reject_all | move_to_system. */
    public Response setReviewActive(String id, boolean on, String pendingAction) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("isActive", on);
        if (!on && pendingAction != null) b.put("pendingAction", pendingAction);
        Response r = admin.patch("/workflow/review-processes/" + id + "/active", b);
        if (!on && r.statusCode() == 400 && pendingAction == null) return admin.patch("/workflow/review-processes/" + id + "/active", Map.of("isActive", false, "pendingAction", "reject_all"));
        return r;
    }

    public String workflowRule(Map<String, Object> body) {
        String id = create("/workflow/rules", body, "workflow rule");
        undo.push(() -> {
            admin.post("/workflow/rules/" + id + "/deactivate", null);
            admin.delete("/workflow/rules/" + id);
        });
        return id;
    }

    public Response setWorkflowActive(String id, boolean on) {
        return admin.post("/workflow/rules/" + id + (on ? "/activate" : "/deactivate"), null);
    }

    public String approvalProcess(Map<String, Object> body) {
        String id = create("/workflow/approval-processes", body, "approval process");
        undo.push(() -> {
            setApprovalActive(id, false);
            admin.delete("/workflow/approval-processes/" + id);
        });
        return id;
    }

    public Response setApprovalActive(String id, boolean on) {
        return admin.patch("/workflow/approval-processes/" + id + "/active", Map.of("isActive", on));
    }

    public String blueprint(String module, Map<String, Object> body) {
        String id = create("/modules/" + module + "/blueprints", body, "blueprint");
        undo.push(() -> admin.delete("/modules/" + module + "/blueprints/" + id));
        return id;
    }

    public Response setBlueprintActive(String module, String id, boolean on) {
        Map<String, Object> cur = new LinkedHashMap<>(ok(admin.get("/modules/" + module + "/blueprints/" + id), "GET blueprint").jsonPath().getMap("data"));
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("isActive", on);
        b.put("definition", cur.get("definition"));
        return admin.put("/modules/" + module + "/blueprints/" + id, b);
    }

    // ---------------- review at run time ----------------

    /** Review history of a record: data.cycles[] (requestId, status, decisions, events), data.viewerCanResubmit. */
    public JsonPath reviewHistory(CrmUser as, String module, String recordId) {
        return ok(as.get("/workflow/reviews/records/" + module + "/" + recordId + "/history"), "review history").jsonPath();
    }

    /** Status of the latest review cycle, or null when the record never entered review. */
    public String reviewStatus(String module, String recordId) {
        List<Map<String, Object>> c = reviewHistory(admin, module, recordId).getList("data.cycles");
        return c == null || c.isEmpty() ? null : String.valueOf(c.get(c.size() - 1).get("status"));
    }

    /**
     * True for a review that is waiting for a reviewer: pending_for_review, pending_for_re_review (after a resubmit,
     * seen 18 Oct 2026) or in_review.
     */
    public static boolean reviewPending(String status) {
        return "pending_for_review".equals(status) || "pending_for_re_review".equals(status) || "in_review".equals(status);
    }

    public String reviewRequestId(String module, String recordId) {
        List<Map<String, Object>> c = reviewHistory(admin, module, recordId).getList("data.cycles");
        return c == null || c.isEmpty() ? null : String.valueOf(c.get(c.size() - 1).get("requestId"));
    }

    public String firstRejectionReasonId() {
        return ok(admin.get("/workflow/review-rejection-reasons"), "rejection reasons").jsonPath().getString("data[0].id");
    }

    public Response reviewField(CrmUser reviewer, String requestId, String fieldKey, boolean approve) {
        return reviewer.post("/workflow/reviews/" + requestId + "/fields/" + fieldKey + (approve ? "/approve" : "/reject"),
                approve ? Map.of() : Map.of("reasonId", firstRejectionReasonId(), "comment", "QA AEO rejection"));
    }

    public Response reviewApproveAll(CrmUser reviewer, String requestId, String... fieldKeys) {
        Response r = null;
        for (String f : fieldKeys) r = reviewField(reviewer, requestId, f, true);
        return r;
    }

    public Response reviewReject(CrmUser reviewer, String requestId) {
        return reviewer.post("/workflow/reviews/" + requestId + "/reject", Map.of("reasonId", firstRejectionReasonId(), "comment", "QA AEO record rejection"));
    }

    public Response reviewResubmit(CrmUser submitter, String requestId) {
        return submitter.post("/workflow/reviews/" + requestId + "/resubmit", Map.of());
    }

    // ---------------- approval at run time ----------------

    /** instanceId, state (pending_approval|approved|rejected), currentApprovers, history, canResubmit… ; null data when never submitted. */
    public JsonPath approval(CrmUser as, String module, String recordId) {
        return ok(as.get("/workflow/approvals/records/" + module + "/" + recordId), "approval state").jsonPath();
    }

    /**
     * Approval state (pending_approval | approved | rejected …), or null when the record has no approval: the API answers
     * the string "none" (and "not_submitted") in that case (seen 18 Oct 2026), both normalised to null here.
     */
    public String approvalState(String module, String recordId) {
        String s = approval(admin, module, recordId).getString("data.state");
        return s == null || "none".equals(s) || "not_submitted".equals(s) ? null : s;
    }

    public Response approve(CrmUser approver, String module, String recordId) {
        return approver.post("/workflow/approvals/" + approval(approver, module, recordId).getString("data.instanceId") + "/approve", Map.of("comment", "QA AEO approve"));
    }

    public Response reject(CrmUser approver, String module, String recordId) {
        return approver.post("/workflow/approvals/" + approval(approver, module, recordId).getString("data.instanceId") + "/reject", Map.of("comment", "QA AEO reject"));
    }

    public Response resubmitApproval(CrmUser submitter, String module, String recordId) {
        return submitter.post("/workflow/approvals/" + approval(submitter, module, recordId).getString("data.instanceId") + "/resubmit", Map.of());
    }

    // ---------------- blueprint at run time ----------------

    /** data.states[] (blueprintName, activeStates, enteredAt…) and data.transitions[] available to the caller. Empty when not governed. */
    public JsonPath blueprintState(CrmUser as, String module, String recordId) {
        return ok(as.get("/modules/" + module + "/records/" + recordId + "/blueprint-state"), "blueprint state").jsonPath();
    }

    public boolean governed(String module, String recordId) {
        List<?> s = blueprintState(admin, module, recordId).getList("data.states");
        return s != null && !s.isEmpty();
    }

    public Response transition(CrmUser as, String module, String recordId, String transitionId, Map<String, Object> body) {
        return as.post("/modules/" + module + "/records/" + recordId + "/blueprint-transitions/" + transitionId, body == null ? Map.of() : body);
    }

    // ---------------- what ran, and when ----------------

    /** Workflow + assignment executions for a record (ruleId, assignmentRuleId, triggerKind, outcome, evaluatedAt). */
    public List<Map<String, Object>> executions(String recordId) {
        List<Map<String, Object>> all = ok(admin.get("/workflow/executions?recordId=" + recordId + "&take=200"), "executions").jsonPath().getList("data");
        List<Map<String, Object>> mine = new ArrayList<>();
        if (all != null) for (Map<String, Object> e : all) if (recordId.equals(e.get("recordId"))) mine.add(e);
        return mine;
    }

    public long firedCount(String recordId, String ruleId) {
        return executions(recordId).stream().filter(e -> ruleId.equals(e.get("ruleId")) && "Fired".equals(e.get("outcome"))).count();
    }

    public List<Map<String, Object>> timeline(String module, String recordId) {
        List<Map<String, Object>> d = ok(admin.get("/timeline/records/" + moduleKey(module) + "/" + recordId + "/feed"), "timeline").jsonPath().getList("data.data");
        return d == null ? List.of() : d;
    }

    /** Readable trace for the report: one line per thing that ran (time, process, detail). */
    public String trace(String module, String recordId) {
        StringBuilder sb = new StringBuilder();
        for (Map<String, Object> e : executions(recordId))
            sb.append(e.get("evaluatedAt")).append("  ").append(e.get("assignmentRuleId") != null ? "assignment" : "workflow").append(' ').append(e.get("outcome")).append('\n');
        List<Map<String, Object>> cycles = reviewHistory(admin, module, recordId).getList("data.cycles");
        for (Map<String, Object> c : nullSafe(cycles))
            sb.append(c.get("enteredAt")).append("  review cycle ").append(c.get("cycleNumber")).append(' ').append(c.get("status")).append('\n');
        List<Map<String, Object>> history = approval(admin, module, recordId).getList("data.history");
        for (Map<String, Object> h : nullSafe(history))
            sb.append(h.get("occurredAt")).append("  approval ").append(h.get("eventKind")).append('\n');
        List<Map<String, Object>> states = blueprintState(admin, module, recordId).getList("data.states");
        for (Map<String, Object> s : nullSafe(states))
            sb.append(s.get("enteredAt")).append("  blueprint ").append(s.get("blueprintName")).append(' ').append(s.get("activeStates")).append('\n');
        return sb.toString();
    }

    private static <T> List<T> nullSafe(List<T> l) {
        return l == null ? List.of() : l;
    }

    // ---------------- waiting ----------------

    /** Polls until the supplier returns true (asynchronous engines), up to seconds; returns the last result. */
    public static boolean waitFor(int seconds, Supplier<Boolean> cond) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (true) {
            try {
                if (Boolean.TRUE.equals(cond.get())) return true;
            } catch (Exception ignored) {
                // a transient read error (incl. a sneaky-thrown SocketException) is not a verdict
            }
            if (System.currentTimeMillis() > end) return false;
            CrmUser.sleep(3000);
        }
    }

    // ---------------- cleanup ----------------

    /** Undo everything this instance created, newest first. Errors are printed, not thrown (cleanup must finish). */
    public void cleanup() {
        while (!undo.isEmpty()) {
            try {
                undo.pop().run();
            } catch (Exception e) {
                System.out.println("[cleanup] " + e);
            }
        }
        for (Runnable r : late) {
            try {
                r.run();
            } catch (Exception e) {
                System.out.println("[cleanup late] " + e);
            }
        }
        late.clear();
    }
}
