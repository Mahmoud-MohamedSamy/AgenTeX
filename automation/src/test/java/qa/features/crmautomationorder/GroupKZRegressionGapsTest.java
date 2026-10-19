package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmProcs.and;
import static qa.features.crmautomationorder.CrmProcs.eq;
import static qa.features.crmautomationorder.CrmProcs.guard;
import static qa.features.crmautomationorder.CrmUser.ok;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Session SK: spec group K (regression of earlier order/process bugs, K-01…K-13) and group Z (the 9 gaps of the
 * missing list, NDC-2294). API level, no browser. processAdmin = adminA; submitter userN; approvers supervisor/adminB.
 * <p>
 * <b>Group K — what is already covered elsewhere (not duplicated here)</b>
 * <pre>
 * K id  | Bug(s)                    | Covered by
 * ------+---------------------------+-------------------------------------------------------------------------------
 * K-01  | NDC-1211                  | GroupFHandoffTest.f12NoBlueprintWhileReviewPending (F-12, Deals, manual entry)
 * K-02  | NDC-1697                  | GroupFHandoffTest.f07… (F-07), .f11… (F-11); GroupBReviewTest.editRejectedWithoutResubmitStaysRejected (B-08)
 * K-03  | NDC-909                   | GroupFHandoffTest.f17NoBlueprintWhileApprovalPending (F-17)
 * K-04  | NDC-1848 / NDC-1849       | GroupBReviewTest.rejectOneFieldRejectsRecordAndSubmitterSeesReason (B-05); GroupDApprovalTest.d03… (D-03)
 * K-05  | NDC-1492                  | GroupBReviewTest B-05 (field-level rejection ends the review)
 * K-05  | NDC-2066                  | THIS CLASS k05TimelineNamesReviewerInOneRejectionNote
 * K-06  | NDC-1228                  | GroupBReviewTest.reorderProcesses (B-22)
 * K-07  | NDC-1541                  | THIS CLASS k07ReEvaluateOptionNotOffered
 * K-08  | NDC-1445                  | THIS CLASS k08EveryDatatypeReviewableOrExplained
 * K-08  | NDC-1443                  | NOT EXPRESSIBLE via API (how the reviewer UI renders a File Upload value)
 * K-09  | NDC-1645                  | THIS CLASS k09ApprovalStatusFieldLockedInLayout (read-only metadata check)
 * K-09  | NDC-1646                  | GroupDApprovalTest.d18… (D-18: normal user blocked, Owner status-reset) + THIS CLASS k09OwnerCanEditApprovalStatus
 * K-09  | NDC-1652                  | THIS CLASS k09ApprovalStatusRefusedInApprovalCriteria
 * K-10  | NDC-1672                  | NOT EXPRESSIBLE via API (Save button state on a fully locked form; UI only)
 * K-11  | NDC-1872                  | GroupDApprovalTest.d12Delegate (D-12: delegate can act) + THIS CLASS k11DelegationTimelineNamesAndComment
 * K-12  | NDC-1326 / 1328 / 1436    | GroupEBlueprintTest e14… (E-14), e16… (E-16), e17… (E-17)
 * K-13  | US-A1 (NDC-1234 epic)     | THIS CLASS k13A1NewRecordSeededNotSubmitted
 * K-13  | US-A2, US-A3              | GroupDApprovalTest D-18 (+ k09OwnerCanEditApprovalStatus)
 * K-13  | US-A4                     | GroupDApprovalTest D-02 (approved), D-03 (rejected)
 * K-13  | US-B1                     | THIS CLASS k13B1GuardInjectedIntoEntryCriteria
 * K-13  | US-B2                     | GroupDApprovalTest D-09
 * K-13  | US-B3                     | THIS CLASS k13B3ReentryOnlyAfterAuthorizedReset (D-18 covers who may reset)
 * K-13  | US-C1, US-C2, US-C3       | GroupDApprovalTest D-07, D-08 (stage locks), D-10 (upon-approval lock, owner override, reset field)
 * K-13  | US-D1                     | GroupDApprovalTest D-03, D-04
 * K-13  | US-D2                     | THIS CLASS k13D2ApprovalEventsOnTimeline
 * K-13  | US-D3                     | GroupDApprovalTest D-06 (viewerDecisionBlockedReason), D-07
 * </pre>
 * <b>Group Z</b> tests assert the Zoho behaviour (the gap closed), so they are expected to FAIL today. Contract checks use
 * a control first: a bogus value must be refused (4xx); when the server accepts anything the case is INCONCLUSIVE, since
 * an accepted candidate would prove nothing.
 */
public class GroupKZRegressionGapsTest extends OrderTestBase {
    @Override protected String session() { return "SK"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    private static final int WAIT = 90;
    private static final String PENDING = "pending_approval";

    /** Approval-held records: their lock is reset (Owner) before the base cleanup deletes them. */
    private final List<String[]> held = new ArrayList<>();
    /** Records made by an engine (import): deleted here. */
    private final List<String[]> extra = new ArrayList<>();
    /** Processes created with a raw POST (path of the resource) - deleted here. */
    private final List<String> rawCreated = new ArrayList<>();

    @AfterMethod(alwaysRun = true)
    public void releaseAndDrop() {
        for (String[] m : held) {
            try {
                owner().post("/workflow/approvals/records/" + m[0] + "/" + m[1] + "/status-reset", Map.of("reason", "QA AEO SK cleanup"));
            } catch (Exception e) {
                System.out.println("[SK release] " + m[1] + " " + e.getMessage());
            }
        }
        held.clear();
        for (String[] r : extra) {
            try {
                System.out.println("[SK] delete extra " + r[1] + " -> " + adminA().delete("/modules/" + r[0] + "/records/" + r[1]).statusCode());
            } catch (Exception e) {
                System.out.println("[SK] delete extra " + e.getMessage());
            }
        }
        extra.clear();
        for (String p : rawCreated) {
            try {
                if (p.startsWith("/workflow/rules/")) adminA().post(p + "/deactivate", null);
                if (p.startsWith("/workflow/approval-processes/")) adminA().patch(p + "/active", Map.of("isActive", false));
                System.out.println("[SK] delete " + p + " -> " + adminA().delete(p).statusCode());
            } catch (Exception e) {
                System.out.println("[SK] delete " + p + " " + e.getMessage());
            }
        }
        rawCreated.clear();
    }

    // =====================================================================================================
    // helpers
    // =====================================================================================================

    private static void note(String c, Object msg) {
        String s = msg instanceof Response r ? r.statusCode() + " " + r.asString() : String.valueOf(msg);
        System.out.println("[SK " + c + "] " + (s.length() > 1500 ? s.substring(0, 1500) + "…" : s));
    }

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 500 ? s.substring(0, 500) + "…" : s);
    }

    private static boolean is2xx(Response r) {
        return r.statusCode() / 100 == 2;
    }

    private static boolean is4xx(Response r) {
        return r.statusCode() / 100 == 4;
    }

    private static void on(Response r, String what) {
        Assert.assertEquals(r.statusCode() / 100, 2, what + " switched on: " + cut(r));
    }

    private Map<String, Object> caseGuard(String module, String c) {
        return guard(module, nm(c, ""));
    }

    /** Raw POST of a process body; on 2xx the created resource is registered for deletion. */
    private Response tryCreate(String collectionPath, Map<String, Object> body) {
        Response r = adminA().post(collectionPath, body);
        if (is2xx(r)) {
            String id = r.jsonPath().getString("data.id");
            if (id != null) rawCreated.add(collectionPath + "/" + id);
        }
        return r;
    }

    /** Creates the resource, reads it back and deletes it at once (contract probes). Returns the stored JSON, or null when refused. */
    private JsonPath createReadBack(String collectionPath, Map<String, Object> body, List<String> log) {
        Response r = tryCreate(collectionPath, body);
        log.add(cut(r));
        if (!is2xx(r)) return null;
        String path = collectionPath + "/" + r.jsonPath().getString("data.id");
        JsonPath back = ok(adminA().get(path), "read back " + path).jsonPath();
        return back;
    }

    /** First candidate the server accepts (2xx), with its stored JSON; null when every candidate is refused. */
    private Map.Entry<String, JsonPath> firstAccepted(String collectionPath, List<String> candidates, Function<String, Map<String, Object>> body, List<String> log) {
        for (String cand : candidates) {
            JsonPath back = createReadBack(collectionPath, body.apply(cand), log);
            log.add("  ^ candidate " + cand);
            if (back != null) return Map.entry(cand, back);
        }
        return null;
    }

    /** Display name of a user from its own profile (null when the profile has no name field). */
    private static String displayName(CrmUser u) {
        try {
            JsonPath j = u.get("/iam/me/profile").jsonPath();
            for (String k : List.of("display_name", "full_name", "name", "displayName", "fullName")) {
                String v = j.getString(k);
                if (v == null) v = j.getString("data." + k);
                if (v != null && !v.isBlank()) return v;
            }
            String f = j.getString("first_name") != null ? j.getString("first_name") : j.getString("data.first_name");
            String l = j.getString("last_name") != null ? j.getString("last_name") : j.getString("data.last_name");
            if (f != null && !f.isBlank()) return (f + " " + (l == null ? "" : l)).trim();
        } catch (Exception e) {
            System.out.println("[SK] profile " + e.getMessage());
        }
        return null;
    }

    private List<String> timelineRows(String module, String id, String... allLower) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> row : api.timeline(module, id)) {
            String t = String.valueOf(row);
            String low = t.toLowerCase();
            boolean all = true;
            for (String w : allLower) all &= low.contains(w);
            if (all) out.add(t);
        }
        return out;
    }

    private Map<String, Object> leadFields(String c, String suffix) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(c, suffix));
        f.put("email", ("qa.aeo.sk." + c + "." + suffix).toLowerCase().replace(' ', '.').replace("-", "") + "@qa.test");
        return f;
    }

    /** Lead by userN (submitter) on this session's QA layout. */
    private String nLead(String c, String suffix) {
        return api.createRecord(userN(), LEADS, layout(LEADS), leadFields(c, suffix));
    }

    // ---------- approval ----------

    private String approval(String module, String c, boolean onCreate, boolean onEdit, Map<String, Object> level, Map<String, Object> criteria) {
        String id = api.approvalProcess(CrmProcs.approvalProcess(module, c + " appr", onCreate, onEdit, criteria == null ? caseGuard(module, c) : criteria,
                List.of(level == null ? CrmProcs.levelUsers(supervisor().id()) : level), List.of(adminA().id())));
        on(api.setApprovalActive(id, true), "approval " + c);
        return id;
    }

    private boolean waitState(String module, String id, String state) {
        return CrmApi.waitFor(WAIT, () -> state.equals(api.approvalState(module, id)));
    }

    private String inst(String module, String id) {
        return api.approval(adminA(), module, id).getString("data.instanceId");
    }

    // ---------- review ----------

    private String reviewLeads(String c, Map<String, String> fields) {
        String id = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                fields, List.of(adminA().id()), List.of(adminA().id())));
        on(api.setReviewActive(id, true, null), "RP " + c);
        return id;
    }

    // ---------- import (data-import API, as in GroupFHandoffTest) ----------

    static final class Imp {
        Response mapping;
        String status;
        String id;
    }

    /** Imports one row as adminA with the given options (trigger_automation / manual_approval); finds the record by name. */
    private Imp importRow(String module, String c, Map<String, Object> fields, boolean triggerAutomation, boolean manualApproval, int findSeconds) {
        CrmUser a = adminA();
        Imp imp = new Imp();
        StringBuilder csv = new StringBuilder(String.join(",", fields.keySet())).append('\n');
        List<String> vals = new ArrayList<>();
        for (Object v : fields.values()) vals.add("\"" + String.valueOf(v).replace("\"", "\"\"") + "\"");
        csv.append(String.join(",", vals)).append('\n');
        Response up = a.req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-sk.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv").post("/modules/" + module + "/import");
        if (!is2xx(up)) inconclusive("import upload refused: " + cut(up));
        String sid = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + module + "/import/" + sid;
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", triggerAutomation);
        opts.put("assignment_rule_id", null);
        opts.put("manual_approval", manualApproval);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : fields.keySet()) mapping.add(kinded("header", h, "field", h));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mode", "add");
        body.put("match_field_key", null);
        body.put("layout_id", layout(module));
        body.put("mapping", mapping);
        body.put("options", opts);
        imp.mapping = a.put(base + "/mapping", body);
        note(c, "import mapping " + cut(imp.mapping));
        if (!is2xx(imp.mapping)) return imp;
        ok(a.post(base + "/validate", null), "import validate");
        ok(a.post(base + "/execute", null), "import execute");
        String[] st = {null};
        CrmApi.waitFor(150, () -> {
            Response s = a.get(base);
            st[0] = s.asString();
            String v = s.jsonPath().getString("data.status");
            return v != null && (v.startsWith("completed") || v.equals("partially_completed") || v.equals("failed")
                    || v.toLowerCase().contains("approv") || v.toLowerCase().contains("await"));
        });
        imp.status = st[0];
        note(c, "import status " + (st[0] == null ? null : st[0].substring(0, Math.min(800, st[0].length()))));
        imp.id = findByName(module, String.valueOf(fields.get(CrmProcs.nameField(module))), findSeconds);
        if (imp.id != null) extra.add(new String[]{module, imp.id});
        return imp;
    }

    private static String nameOf(Map<String, Object> row, String module) {
        if (!(row.get("data") instanceof List<?> l)) return null;
        for (Object o : l)
            if (o instanceof Map<?, ?> f && CrmProcs.nameField(module).equals(f.get("field")) && f.get("value") instanceof Map<?, ?> v)
                return v.get("value") == null ? null : String.valueOf(v.get("value"));
        return null;
    }

    private String findByName(String module, String name, int seconds) {
        // the list is oldest first and ignores sort / page_size / q: CrmApi scans the newest pages, then the review queue
        return api.findRecord(module, name, seconds);
    }

    /** Finds every map in a JSON tree that has some value equal to {@code value}. */
    @SuppressWarnings("unchecked")
    private static void findMaps(Object node, String value, List<Map<String, Object>> out) {
        if (node instanceof Map<?, ?> m) {
            if (m.containsValue(value)) out.add((Map<String, Object>) m);
            for (Object v : m.values()) findMaps(v, value, out);
        } else if (node instanceof List<?> l) {
            for (Object v : l) findMaps(v, value, out);
        }
    }

    // =====================================================================================================
    // K — regression (only what no other class covers; see the table above)
    // =====================================================================================================

    @CaseId("K-05")
    @Test(groups = {"crm-order", "group-k", "NDC-2066"}, description = "Review rejection of two fields: ONE Timeline note naming the reviewer and listing both fields")
    public void k05TimelineNamesReviewerInOneRejectionNote() {
        String c = "K-05";
        reviewLeads(c, new LinkedHashMap<>(Map.of("email", "email", "phone", "phone")));
        String id = nLead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> api.reviewStatus(LEADS, id) != null), "lead held for review");
        String req = api.reviewRequestId(LEADS, id);
        Response r1 = api.reviewField(adminA(), req, "phone", false);
        Response r2 = api.reviewField(adminA(), req, "email", false);
        note(c, "reject phone " + cut(r1) + " | reject email " + cut(r2));
        Assert.assertTrue(is2xx(r1), "reject phone accepted");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "rejected".equals(api.reviewStatus(LEADS, id))), "review rejected");
        CrmApi.waitFor(30, () -> !timelineRows(LEADS, id, "review", "reject").isEmpty());
        List<String> notes = timelineRows(LEADS, id, "review", "reject");
        String reviewer = displayName(adminA());
        note(c, "lead " + id + " reviewer name=" + reviewer + " rejection notes=" + notes);
        traceOf(c, LEADS, id);
        if (notes.isEmpty()) inconclusive("no review rejection note on the Timeline of " + id + " - cannot judge NDC-2066");
        SoftAssert s = new SoftAssert();
        s.assertEquals(notes.size(), 1, "one rejection note, not one per field: " + notes);
        String all = String.join(" ", notes);
        if (is2xx(r2)) {
            s.assertTrue(all.toLowerCase().contains("phone") && all.toLowerCase().contains("email"), "the note lists both rejected fields");
        }
        s.assertFalse(all.contains(adminA().id()), "reviewer shown by name, not by user id");
        if (reviewer != null) s.assertTrue(all.contains(reviewer), "the note names the reviewer '" + reviewer + "' (not System)");
        else s.assertFalse(all.matches("(?s).*\\bby System\\b.*"), "the note is not signed by System");
        s.assertAll();
    }

    @CaseId("K-07")
    @Test(groups = {"crm-order", "group-k", "NDC-1541"}, description = "Deactivating a review process holding records: no 'Re-evaluate against other processes' option")
    public void k07ReEvaluateOptionNotOffered() {
        String c = "K-07";
        String rp = reviewLeads(c, Map.of("email", "email"));
        String id = nLead(c, "lead");
        Assert.assertTrue(CrmApi.waitFor(WAIT, () -> "pending_for_review".equals(api.reviewStatus(LEADS, id)) || "in_review".equals(api.reviewStatus(LEADS, id))),
                "control: lead held (" + api.reviewStatus(LEADS, id) + ")");
        // control: a bogus pendingAction must be refused; its error may list the allowed values
        Response bogus = adminA().patch("/workflow/review-processes/" + rp + "/active", Map.of("isActive", false, "pendingAction", "qa_bogus_action"));
        note(c, "bogus pendingAction " + cut(bogus));
        if (is2xx(bogus)) {
            traceOf(c, LEADS, id);
            Assert.fail("a bogus pendingAction was accepted (no validation): " + cut(bogus));
        }
        String accepted = null;
        Response acc = null;
        for (String cand : List.of("re_evaluate", "reevaluate", "re_evaluate_other_processes", "reevaluate_other_processes", "rematch")) {
            Response r = adminA().patch("/workflow/review-processes/" + rp + "/active", Map.of("isActive", false, "pendingAction", cand));
            note(c, "pendingAction " + cand + " -> " + cut(r));
            if (is2xx(r)) {
                accepted = cand;
                acc = r;
                break;
            }
        }
        if (accepted != null) {
            CrmApi.waitFor(30, () -> !CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
            String after = api.reviewStatus(LEADS, id);
            traceOf(c, LEADS, id);
            Assert.fail("'Re-evaluate against other processes' (" + accepted + ") is still accepted: " + cut(acc)
                    + "; with one process per module+layout it can only release the lead unreviewed (review status now " + after + ")");
        }
        String err = bogus.asString().toLowerCase();
        traceOf(c, LEADS, id);
        boolean listsAllowed = err.contains("reject_all") || err.contains("move_to_system");
        if (!listsAllowed) inconclusive("no re-evaluate name accepted, but the server does not list its allowed values, so the option's API name may just be unknown: " + cut(bogus));
        Assert.assertFalse(err.contains("evaluat"), "allowed pendingAction values still include a re-evaluate option: " + cut(bogus));
    }

    @CaseId("K-08")
    @Test(groups = {"crm-order", "group-k", "NDC-1445"}, description = "Each of the 12 datatypes is reviewable, or excluded with a stated reason")
    public void k08EveryDatatypeReviewableOrExplained() {
        JsonPath j = ok(adminA().get("/workflow/review-processes/reviewable-field-types"), "reviewable field types").jsonPath();
        List<String> keys = j.getList("data.datatypeKeys");
        List<Map<String, Object>> excluded = j.getList("data.excluded");
        note("K-08", "reviewable=" + keys + " excluded=" + excluded);
        List<String> missing = new ArrayList<>();
        for (String t : List.of("rich_text", "address", "auto_number", "status", "radio_button", "lookup", "multi_select_lookup", "image_upload",
                "formula", "user", "subform", "rollup_summary")) {
            boolean reviewable = keys != null && keys.contains(t);
            boolean explained = excluded != null && excluded.stream().anyMatch(e -> t.equals(e.get("datatypeKey"))
                    && e.get("reason") != null && !String.valueOf(e.get("reason")).isBlank());
            if (!reviewable && !explained) missing.add(t);
        }
        Assert.assertTrue(missing.isEmpty(), "datatypes neither reviewable nor excluded with a reason: " + missing);
    }

    @CaseId("K-09")
    @Test(groups = {"crm-order", "group-k", "NDC-1645"}, description = "Approval Status field is a locked system field in the layout (read-only check, nothing changed)")
    public void k09ApprovalStatusFieldLockedInLayout() {
        Object layoutJson = ok(adminA().get("/modules/" + LEADS + "/layouts/" + layout(LEADS)), "QA layout").jsonPath().get("data");
        List<Map<String, Object>> hits = new ArrayList<>();
        findMaps(layoutJson, "approval_status", hits);
        note("K-09", "approval_status entries in the layout: " + hits);
        if (hits.isEmpty()) inconclusive("approval_status not found in the layout JSON - cannot tell whether it is hidden from the builder or named differently (UI check)");
        boolean locked = false;
        for (Map<String, Object> h : hits)
            for (Map.Entry<String, Object> e : h.entrySet()) {
                String k = e.getKey().toLowerCase();
                if ((k.contains("system") || k.contains("readonly") || k.contains("read_only") || k.contains("locked")) && Boolean.TRUE.equals(e.getValue())) locked = true;
                if ((k.equals("editable") || k.equals("iseditable") || k.equals("canedit") || k.equals("propertieseditable")) && Boolean.FALSE.equals(e.getValue())) locked = true;
            }
        Assert.assertTrue(locked, "approval_status is in the layout but carries no system/read-only/locked flag: " + hits);
    }

    @CaseId("K-09")
    @Test(groups = {"crm-order", "group-k", "NDC-1646", "NDC-1234"}, description = "Tenant Owner can change a record's Approval Status by hand (US-A3)")
    public void k09OwnerCanEditApprovalStatus() {
        String c = "K-09b";
        String id = nLead(c, "lead");
        String before = api.approvalStatus(LEADS, id);
        Response r = api.update(owner(), LEADS, id, Map.of("approval_status", "rejected"));
        String after = api.approvalStatus(LEADS, id);
        note(c, "lead " + id + " before=" + before + " owner PATCH " + cut(r) + " after=" + after);
        traceOf(c, LEADS, id);
        SoftAssert s = new SoftAssert();
        s.assertTrue(is2xx(r), "Owner edit of Approval Status accepted: " + cut(r));
        s.assertEquals(after, "rejected", "Approval Status changed by the Owner");
        s.assertAll();
    }

    @CaseId("K-09")
    @Test(groups = {"crm-order", "group-k", "NDC-1652"}, description = "Approval process criteria on Approval Status are refused (the system guard already fixes it)")
    public void k09ApprovalStatusRefusedInApprovalCriteria() {
        String c = "K-09c";
        Map<String, Object> body = CrmProcs.approvalProcess(LEADS, c + " appr", true, true, and(caseGuard(LEADS, c), eq("approval_status", "approved")),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminA().id()));
        Response r = tryCreate("/workflow/approval-processes", body);
        note(c, "create with approval_status criterion " + cut(r));
        Assert.assertTrue(is4xx(r), "an approval rule on Approval Status (never satisfiable) should be refused, got " + cut(r));
    }

    @CaseId("K-11")
    @Test(groups = {"crm-order", "group-k", "NDC-1872"}, description = "Approval delegation: Timeline names both users (no ids) and the comment is kept")
    public void k11DelegationTimelineNamesAndComment() {
        String c = "K-11";
        approval(LEADS, c, true, false, null, null);
        String id = nLead(c, "lead");
        held.add(new String[]{LEADS, id});
        Assert.assertTrue(waitState(LEADS, id, PENDING), "pending approval");
        String comment = "QA AEO SK K-11 delegation comment";
        Response d = supervisor().post("/workflow/approvals/" + inst(LEADS, id) + "/delegate", Map.of("toUserId", adminB().id(), "comment", comment));
        note(c, "delegate " + cut(d));
        Assert.assertTrue(is2xx(d), "delegate accepted: " + cut(d));
        CrmApi.waitFor(30, () -> !timelineRows(LEADS, id, "delegat").isEmpty());
        List<String> rows = timelineRows(LEADS, id, "delegat");
        String delegateView = api.approval(adminB(), LEADS, id).prettify();
        String from = displayName(supervisor()), to = displayName(adminB());
        note(c, "lead " + id + " from=" + from + " to=" + to + " timeline=" + rows + " delegateView=" + delegateView);
        traceOf(c, LEADS, id);
        SoftAssert s = new SoftAssert();
        s.assertFalse(rows.isEmpty(), "a delegation entry on the Timeline");
        String all = String.join(" ", rows);
        s.assertFalse(all.contains(supervisor().id()), "delegator shown by name, not id");
        s.assertFalse(all.contains(adminB().id()), "delegate shown by name, not id");
        if (from != null) s.assertTrue(all.contains(from), "Timeline names the delegator '" + from + "'");
        if (to != null) s.assertTrue(all.contains(to), "Timeline names the delegate '" + to + "'");
        s.assertTrue(all.contains(comment) || delegateView.contains(comment), "the delegation comment is shown (Timeline or the delegate's approval view)");
        s.assertAll();
    }

    @CaseId("K-13")
    @Test(groups = {"crm-order", "group-k", "NDC-1234"}, description = "US-A1: a new record is seeded with Approval Status = not_submitted")
    public void k13A1NewRecordSeededNotSubmitted() {
        String id = nLead("K-13a", "lead");
        String st = api.approvalStatus(LEADS, id);
        note("K-13a", "lead " + id + " approval_status=" + st);
        Assert.assertEquals(st, "not_submitted", "Approval Status seeded on create");
    }

    @CaseId("K-13")
    @Test(groups = {"crm-order", "group-k", "NDC-1234"}, description = "US-B1: the Approval Status guard is injected into a new approval process's entry criteria")
    public void k13B1GuardInjectedIntoEntryCriteria() {
        String id = api.approvalProcess(CrmProcs.approvalProcess(LEADS, "K-13b appr", true, true, caseGuard(LEADS, "K-13b"),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminA().id())));
        JsonPath j = ok(adminA().get("/workflow/approval-processes/" + id), "GET approval process").jsonPath();
        note("K-13b", "entryGuard=" + j.getMap("data.entryGuard"));
        SoftAssert s = new SoftAssert();
        s.assertEquals(j.getString("data.entryGuard.field"), "approval_status", "guard field");
        s.assertEquals(j.getString("data.entryGuard.value"), "not_submitted", "guard value");
        s.assertAll();
    }

    @CaseId("K-13")
    @Test(groups = {"crm-order", "group-k", "NDC-1234"}, description = "US-B3: after an authorized status reset, an edit sends the approved record back into approval")
    public void k13B3ReentryOnlyAfterAuthorizedReset() {
        String c = "K-13c";
        approval(LEADS, c, true, true, null, null);
        String id = nLead(c, "lead");
        held.add(new String[]{LEADS, id});
        Assert.assertTrue(waitState(LEADS, id, PENDING), "pending");
        String first = inst(LEADS, id);
        Assert.assertTrue(is2xx(api.approve(supervisor(), LEADS, id)), "approve");
        Assert.assertTrue(waitState(LEADS, id, "approved"), "approved");
        Response reset = owner().post("/workflow/approvals/records/" + LEADS + "/" + id + "/status-reset", Map.of("reason", "QA AEO SK K-13c reset"));
        note(c, "owner reset " + cut(reset));
        Assert.assertTrue(is2xx(reset), "Owner reset accepted");
        Response e = api.update(userN(), LEADS, id, Map.of("description", "QA K-13c after reset"));
        note(c, "edit after reset " + cut(e));
        boolean back = waitState(LEADS, id, PENDING);
        traceOf(c, LEADS, id);
        SoftAssert s = new SoftAssert();
        s.assertTrue(is2xx(e), "edit after reset accepted");
        s.assertTrue(back, "record re-entered approval after the reset (state " + api.approvalState(LEADS, id) + ")");
        s.assertNotEquals(inst(LEADS, id), first, "a new approval instance");
        s.assertAll();
    }

    @CaseId("K-13")
    @Test(groups = {"crm-order", "group-k", "NDC-1234"}, description = "US-D2: submission and approval are both written to the record Timeline")
    public void k13D2ApprovalEventsOnTimeline() {
        String c = "K-13d";
        approval(LEADS, c, true, false, null, null);
        String id = nLead(c, "lead");
        held.add(new String[]{LEADS, id});
        Assert.assertTrue(waitState(LEADS, id, PENDING), "pending");
        Assert.assertTrue(is2xx(api.approve(supervisor(), LEADS, id)), "approve");
        Assert.assertTrue(waitState(LEADS, id, "approved"), "approved");
        CrmApi.waitFor(30, () -> timelineRows(LEADS, id, "approv").size() >= 2);
        List<String> rows = timelineRows(LEADS, id, "approv");
        note(c, "lead " + id + " approval timeline rows=" + rows);
        traceOf(c, LEADS, id);
        String all = String.join(" ", rows).toLowerCase();
        SoftAssert s = new SoftAssert();
        s.assertTrue(all.contains("submit") || all.contains("pending"), "submission on the Timeline");
        s.assertTrue(all.contains("approved"), "approval on the Timeline");
        s.assertAll();
    }

    // =====================================================================================================
    // Z — gaps (NDC-2294). Expected = Zoho; expected to FAIL today.
    // =====================================================================================================

    @CaseId("Z1")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Import with Trigger automation also starts approval, then blueprint (Deals)")
    public void z1ImportStartsApprovalAndBlueprint() {
        String c = "Z1";
        String wf = api.workflowRule(CrmProcs.workflow(DEALS, c + " WF").guardCase(c).onCreate().fieldUpdate("description", "WF " + c).build());
        on(api.setWorkflowActive(wf, true), "WF " + c);
        approval(DEALS, c, true, false, CrmProcs.levelUsers(adminB().id()), null);
        String bp = api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), CrmApi.pipelineOf(layout(DEALS)), "stage", c + " BP",
                caseGuard(DEALS, c), List.of("qualification", "proposal"), null));
        on(api.setBlueprintActive(DEALS, bp, true), "BP " + c);
        Imp imp = importRow(DEALS, c, CrmApi.minimal(DEALS, nm(c, "deal")), true, false, WAIT);
        if (!is2xx(imp.mapping)) inconclusive("import mapping refused: " + cut(imp.mapping));
        if (imp.id == null) inconclusive("imported deal not found: " + imp.status);
        String id = imp.id;
        held.add(new String[]{DEALS, id});
        boolean wfRan = CrmApi.waitFor(WAIT, () -> ("WF " + c).equals(api.field(adminA(), DEALS, id, "description")));
        if (!wfRan) {
            traceOf(c, DEALS, id);
            inconclusive("control: trigger_automation did not even run the workflow on the imported deal " + id);
        }
        boolean pending = waitState(DEALS, id, PENDING);
        note(c, "deal " + id + " approval=" + api.approvalState(DEALS, id) + " governed=" + api.governed(DEALS, id));
        if (!pending) {
            traceOf(c, DEALS, id);
            Assert.fail("import with trigger_automation ran the workflow but did not start the approval process (state " + api.approvalState(DEALS, id)
                    + ", governed " + api.governed(DEALS, id) + ")");
        }
        Assert.assertTrue(is2xx(api.approve(adminB(), DEALS, id)), "approve");
        boolean governed = CrmApi.waitFor(WAIT, () -> api.governed(DEALS, id));
        traceOf(c, DEALS, id);
        Assert.assertTrue(governed, "imported deal governed by the blueprint after approval");
    }

    @CaseId("Z2")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Import option manual_approval: imported lead waits for approval instead of going live")
    public void z2ImportManualApprovalHonoured() {
        String c = "Z2";
        Imp imp = importRow(LEADS, c, leadFields(c, "lead"), false, true, 45);
        Assert.assertTrue(is2xx(imp.mapping), "manual_approval option accepted by the import: " + cut(imp.mapping));
        String st = imp.status == null ? "" : new JsonPath(imp.status).getString("data.status");
        boolean heldStatus = st != null && st.toLowerCase().matches(".*(approv|await|pending).*");
        note(c, "import status=" + st + " record=" + imp.id);
        if (imp.id != null) traceOf(c, LEADS, imp.id);
        if (heldStatus) return;
        if (imp.id == null) inconclusive("import status '" + st + "' and the lead is not in the list - cannot tell whether it is held for approval");
        Assert.fail("lead imported with manual_approval=true went live at once (record " + imp.id + ", import status " + st + "); Zoho holds it in Approve Leads");
    }

    @CaseId("Z3")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Workflow trigger kinds Record Score and Record Notes are accepted")
    public void z3ScoreAndNotesTriggers() {
        String c = "Z3";
        List<String> log = new ArrayList<>();
        Function<String, Map<String, Object>> body = k -> CrmProcs.workflow(LEADS, c + " " + k).guardCase(c).trigger(k, null).fieldUpdate("description", "WF " + c).build();
        if (createReadBack("/workflow/rules", body.apply("QaBogusTrigger"), log) != null)
            inconclusive("a bogus trigger kind was accepted (no validation): " + log);
        Map.Entry<String, JsonPath> score = firstAccepted("/workflow/rules", List.of("ScoreThreshold", "RecordScore", "ScoreChanged", "ScoreUpdated"), body, log);
        Map.Entry<String, JsonPath> notes = firstAccepted("/workflow/rules", List.of("RecordNotes", "NoteAdded", "NotesAdded", "NoteCreated"), body, log);
        note(c, String.join("\n", log));
        SoftAssert s = new SoftAssert();
        s.assertNotNull(score, "a Record Score trigger kind is accepted");
        if (score != null) s.assertEquals(score.getValue().getString("data.trigger.kind"), score.getKey(), "score trigger stored");
        s.assertNotNull(notes, "a Record Notes trigger kind is accepted");
        if (notes != null) s.assertEquals(notes.getValue().getString("data.trigger.kind"), notes.getKey(), "notes trigger stored");
        s.assertAll();
    }

    @CaseId("Z4")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Workflow action types Meeting, Call, Function and Create Connected Record are accepted")
    public void z4MeetingCallFunctionConnectedRecordActions() {
        String c = "Z4";
        List<String> log = new ArrayList<>();
        Function<Map<String, Object>, Function<String, Map<String, Object>>> withExtra = extraFields -> type -> {
            Map<String, Object> a = new LinkedHashMap<>();
            a.put("type", type);
            a.put("order", 0);
            a.put("delaySeconds", 0);
            a.putAll(extraFields);
            return CrmProcs.workflow(LEADS, c + " " + type).guardCase(c).onCreate().rawAction(a).build();
        };
        if (createReadBack("/workflow/rules", withExtra.apply(Map.of()).apply("QaBogusAction"), log) != null)
            inconclusive("a bogus action type was accepted (no validation): " + log);
        Map<String, Object> meeting = new LinkedHashMap<>();
        meeting.put("title", "QA AEO SK Z4 meeting");
        meeting.put("meetingTitle", "QA AEO SK Z4 meeting");
        meeting.put("durationMinutes", 30);
        meeting.put("startOffsetDays", 1);
        Map<String, Object> call = new LinkedHashMap<>();
        call.put("title", "QA AEO SK Z4 call");
        call.put("callSubject", "QA AEO SK Z4 call");
        call.put("startOffsetDays", 1);
        Map<String, Object> fn = new LinkedHashMap<>();
        fn.put("functionName", "qa_aeo_sk_z4");
        fn.put("functionParams", Map.of());
        Map<String, Object> connected = new LinkedHashMap<>();
        connected.put("targetModuleId", DEALS);
        connected.put("targetLayoutId", layout(DEALS));
        connected.put("fieldMappings", Map.of("deal_name", qa.features.deskworkflowrules.Rules.s(nm(c, "connected"))));
        Map<String, Map.Entry<String, JsonPath>> got = new LinkedHashMap<>();
        got.put("Meeting", firstAccepted("/workflow/rules", List.of("Meeting", "AddMeeting", "CreateMeeting"), withExtra.apply(meeting), log));
        got.put("Call", firstAccepted("/workflow/rules", List.of("Call", "ScheduleCall", "LogCall"), withExtra.apply(call), log));
        got.put("Function", firstAccepted("/workflow/rules", List.of("CustomFunction", "Function", "CallFunction"), withExtra.apply(fn), log));
        got.put("CreateConnectedRecord", firstAccepted("/workflow/rules", List.of("CreateConnectedRecord", "ConnectedRecord"), withExtra.apply(connected), log));
        note(c, String.join("\n", log));
        SoftAssert s = new SoftAssert();
        got.forEach((what, e) -> {
            s.assertNotNull(e, what + " action accepted");
            if (e != null) s.assertEquals(e.getValue().getString("data.actions[0].type"), e.getKey(), what + " action stored with its type");
        });
        s.assertAll();
    }

    @CaseId("Z5")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Workflow Assign Owner by an assignment rule (+ online only, email, transfer related)")
    public void z5OwnerAssignmentByAssignmentRule() {
        String c = "Z5";
        String ar = api.assignmentRule(CrmProcs.assignmentRule(LEADS, c + " AR", List.of("Import", "WebForm", "Api"), caseGuard(LEADS, c),
                List.of(userV().id()), "LeaveUnassigned", null));
        on(api.setAssignmentRuleActive(ar, true), "AR " + c);
        List<String> log = new ArrayList<>();
        Function<String, Map<String, Object>> body = kind -> CrmProcs.workflow(LEADS, c + " WF " + kind).guardCase(c).onCreate()
                .rawAction(ownerAction(kind, ar, false)).build();
        if (createReadBack("/workflow/rules", body.apply("QaBogusKind"), log) != null)
            inconclusive("a bogus ownerTargetKind was accepted (no validation): " + log);
        // keep the accepted rule (not read-back-and-forget): it is activated below
        String wf = null;
        String kind = null;
        for (String k : List.of("AssignmentRule", "AssignmentRules", "Rule")) {
            Response r = tryCreate("/workflow/rules", body.apply(k));
            log.add(k + " -> " + cut(r));
            if (is2xx(r)) {
                wf = r.jsonPath().getString("data.id");
                kind = k;
                break;
            }
        }
        note(c, String.join("\n", log));
        Assert.assertNotNull(wf, "Owner Assignment with an assignment rule is accepted");
        Map<String, Object> act = ok(adminA().get("/workflow/rules/" + wf), "read back").jsonPath().getMap("data.actions[0]");
        on(adminA().post("/workflow/rules/" + wf + "/activate", null), "WF " + c);
        String id = nLead(c, "lead");
        boolean assigned = CrmApi.waitFor(WAIT, () -> userV().id().equals(api.field(adminA(), LEADS, id, "owner")));
        note(c, "kind " + kind + " stored action " + act + " lead " + id + " owner " + api.field(adminA(), LEADS, id, "owner"));
        traceOf(c, LEADS, id);
        // Zoho's extra options, on a separate inactive rule (unknown keys must not hide the main result)
        List<String> log2 = new ArrayList<>();
        JsonPath extras = createReadBack("/workflow/rules", CrmProcs.workflow(LEADS, c + " WF options").guardCase(c + "x").onCreate()
                .rawAction(ownerAction(kind, ar, true)).build(), log2);
        Map<String, Object> ex = extras == null ? Map.of() : extras.getMap("data.actions[0]");
        note(c, "options probe " + log2 + " stored " + ex);
        SoftAssert s = new SoftAssert();
        s.assertEquals(String.valueOf(act.get("ownerTargetKind")), kind, "target kind stored");
        s.assertTrue(assigned, "the workflow ran the assignment rule: owner is the rule's user (userV)");
        s.assertTrue(Boolean.TRUE.equals(ex.get("ownerOnlyOnlineUsers")), "'only online users' option stored");
        s.assertTrue(Boolean.TRUE.equals(ex.get("ownerNotifyByEmail")), "'email the new owner' option stored");
        s.assertNotNull(ex.get("ownerTransferRelated"), "'transfer related records' option stored");
        s.assertAll();
    }

    private static Map<String, Object> ownerAction(String kind, String value, boolean zohoOptions) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", "OwnerAssignment");
        a.put("order", 0);
        a.put("delaySeconds", 0);
        a.put("ownerTargetKind", kind);
        a.put("ownerValue", value);
        if (zohoOptions) {
            a.put("ownerOnlyOnlineUsers", true);
            a.put("ownerNotifyByEmail", true);
            a.put("ownerTransferRelated", List.of("tasks"));
        }
        return a;
    }

    @CaseId("Z6")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Review process: functions on submission / review / rejection / resubmission are settable")
    public void z6ReviewFunctionHooks() {
        String c = "Z6";
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        body.put("webhookUrl", "https://example.invalid/qa-aeo-sk-z6");
        List<Map<String, Object>> fns = new ArrayList<>();
        for (String ev : List.of("onSubmission", "onReview", "onRejection", "onResubmission"))
            fns.add(kinded("event", ev, "functionName", "qa_aeo_sk_z6"));
        body.put("functions", fns);
        Response r = tryCreate("/workflow/review-processes", body);
        note(c, "create with functions " + cut(r));
        if (!is2xx(r)) {
            body.remove("functions");
            Response r2 = tryCreate("/workflow/review-processes", body);
            note(c, "create with webhookUrl only " + cut(r2));
            String hook = is2xx(r2) ? ok(adminA().get("/workflow/review-processes/" + r2.jsonPath().getString("data.id")), "read back").jsonPath().getString("data.webhookUrl") : null;
            // the same body without "functions" is accepted (r2), so the 400 is caused only by the extra hook field: the
            // create DTO has no member for per-event functions (strict JSON), i.e. the gap, not a malformed request
            Assert.assertTrue(is2xx(r2), "control: the same review process body without 'functions' must be accepted: " + cut(r2));
            Assert.fail("per-event review functions (onSubmission/onReview/onRejection/onResubmission) not supported: the valid body + 'functions' is refused "
                    + cut(r) + "; without it the process is created and only a single webhookUrl is stored (" + hook + ")");
        }
        JsonPath back = ok(adminA().get("/workflow/review-processes/" + r.jsonPath().getString("data.id")), "read back").jsonPath();
        List<?> stored = back.getList("data.functions");
        note(c, "stored functions=" + stored + " webhookUrl=" + back.getString("data.webhookUrl"));
        Assert.assertTrue(stored != null && stored.size() == 4, "the four per-event function hooks are stored (only a webhookUrl " + back.getString("data.webhookUrl") + " otherwise)");
    }

    @CaseId("Z7")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Approval level: 'Everyone' (parallel) must approve, not just anyone")
    public void z7ApproverAnyoneEveryone() {
        String c = "Z7";
        Map<String, Object> approver = kinded("kind", "users", "values", List.of(supervisor().id(), adminB().id()),
                "approvalMode", "everyone", "mode", "everyone", "sequence", "parallel");
        Map<String, Object> level = CrmProcs.level(approver, false);
        level.put("approvalMode", "everyone");
        level.put("everyoneOrder", "parallel");
        Map<String, Object> body = CrmProcs.approvalProcess(LEADS, c + " appr", true, false, caseGuard(LEADS, c), List.of(level), List.of(adminA().id()));
        Response r = tryCreate("/workflow/approval-processes", body);
        note(c, "create " + cut(r));
        Assert.assertTrue(is2xx(r), "approval level with Everyone accepted: " + cut(r));
        String pid = r.jsonPath().getString("data.id");
        Map<String, Object> storedLevel = ok(adminA().get("/workflow/approval-processes/" + pid), "read back").jsonPath().getMap("data.rules[0].levels[0]");
        note(c, "stored level " + storedLevel);
        Assert.assertTrue(String.valueOf(storedLevel).contains("everyone"), "Everyone option stored on the level: " + storedLevel);
        // functional: with Everyone, one of two approvers is not enough
        on(adminA().patch("/workflow/approval-processes/" + pid + "/active", Map.of("isActive", true)), "approval " + c);
        String id = nLead(c, "lead");
        held.add(new String[]{LEADS, id});
        Assert.assertTrue(waitState(LEADS, id, PENDING), "pending");
        Assert.assertTrue(is2xx(api.approve(supervisor(), LEADS, id)), "first approver approves");
        CrmUser.sleep(5000);
        String afterFirst = api.approvalState(LEADS, id);
        traceOf(c, LEADS, id);
        Assert.assertEquals(afterFirst, PENDING, "still pending after one of two approvers (Everyone)");
    }

    @CaseId("Z8")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Approval final action Call Function actually runs")
    public void z8ApprovalCallFunctionRuns() {
        String c = "Z8";
        String pid = null;
        List<String> log = new ArrayList<>();
        for (String type : List.of("CallFunction", "CustomFunction", "Function")) {
            Map<String, Object> fn = new LinkedHashMap<>();
            fn.put("type", type);
            fn.put("order", 1);
            fn.put("delaySeconds", 0);
            fn.put("functionName", "qa_aeo_sk_z8");
            fn.put("functionParams", Map.of());
            Map<String, Object> body = CrmProcs.approvalProcess(LEADS, c + " appr " + type, true, false, caseGuard(LEADS, c),
                    List.of(CrmProcs.levelUsers(adminB().id())), List.of(adminA().id()));
            @SuppressWarnings("unchecked") Map<String, Object> rule = ((List<Map<String, Object>>) body.get("rules")).get(0);
            rule.put("finalActions", new ArrayList<>(List.of(CrmProcs.fieldUpdateAction("description", "QA Z8 final"), fn)));
            Response r = tryCreate("/workflow/approval-processes", body);
            log.add(type + " -> " + cut(r));
            if (is2xx(r)) {
                pid = r.jsonPath().getString("data.id");
                break;
            }
        }
        note(c, String.join("\n", log));
        Assert.assertNotNull(pid, "approval final action Call Function accepted");
        on(adminA().patch("/workflow/approval-processes/" + pid + "/active", Map.of("isActive", true)), "approval " + c);
        String id = nLead(c, "lead");
        held.add(new String[]{LEADS, id});
        Assert.assertTrue(waitState(LEADS, id, PENDING), "pending");
        Assert.assertTrue(is2xx(api.approve(adminB(), LEADS, id)), "approve");
        Assert.assertTrue(waitState(LEADS, id, "approved"), "approved");
        boolean control = CrmApi.waitFor(60, () -> "QA Z8 final".equals(api.field(adminA(), LEADS, id, "description")));
        String runs = adminA().get("/workflow/custom-actions/runs?recordId=" + id).asString();
        String evidence = (api.approval(adminA(), LEADS, id).prettify() + " " + api.timeline(LEADS, id) + " " + runs + " " + api.executions(id)).toLowerCase();
        note(c, "lead " + id + " control=" + control + " evidence(function)=" + evidence.contains("function") + " runs=" + (runs.length() > 600 ? runs.substring(0, 600) : runs));
        traceOf(c, LEADS, id);
        if (!control) inconclusive("control: the final field update did not run either - cannot judge the function");
        if (evidence.matches("(?s).*(no-op|noop|not executed|skipped).*"))
            Assert.fail("Call Function recorded as a no-op / skipped (Zoho runs the function)");
        boolean ran = evidence.contains("qa_aeo_sk_z8") || (evidence.contains("function") && evidence.matches("(?s).*(executed|succeeded|success|completed).*"));
        if (!ran) inconclusive("no trace of the function anywhere (approval history, Timeline, custom-action runs, executions); the build says it runs as a no-op");
    }

    @CaseId("Z9")
    @Test(groups = {"crm-order", "group-z", "NDC-2294"}, description = "Blueprint after-transition actions Convert, Function (custom action), Tags, Create record are accepted")
    public void z9BlueprintAfterActions() {
        String c = "Z9";
        List<String> log = new ArrayList<>();
        String path = "/modules/" + LEADS + "/blueprints";
        Function<Map<String, Object>, Map<String, Object>> body = action -> CrmProcs.blueprint("leads", layout(LEADS), null, "lead_status",
                c + " " + action.get("kind"), caseGuard(LEADS, c), List.of("No Answer", "Busy"), List.of(action));
        if (createReadBack(path, body.apply(kinded("kind", "qa_bogus_kind")), log) != null)
            inconclusive("a bogus after-action kind was accepted (no validation): " + log);
        Map<String, List<Map<String, Object>>> cands = new LinkedHashMap<>();
        cands.put("Convert", List.of(kinded("kind", "convert", "createDeal", true), kinded("kind", "convertLead", "createDeal", true)));
        cands.put("Function", List.of(kinded("kind", "function", "functionName", "qa_aeo_sk_z9"), kinded("kind", "customAction", "customActionId", "qa_aeo_sk_z9"),
                kinded("kind", "callFunction", "functionName", "qa_aeo_sk_z9")));
        cands.put("Tags", List.of(kinded("kind", "addTags", "tagIds", List.of()), kinded("kind", "tags", "tagIds", List.of())));
        cands.put("CreateRecord", List.of(kinded("kind", "createRecord", "moduleId", DEALS, "fields", Map.of("deal_name", nm(c, "bp deal")))));
        SoftAssert s = new SoftAssert();
        cands.forEach((what, list) -> {
            String acceptedKind = null;
            for (Map<String, Object> a : list) {
                JsonPath back = createReadBack(path, body.apply(a), log);
                log.add("  ^ " + what + " " + a.get("kind"));
                if (back != null && String.valueOf(back.getList("data.definition.transitions[0].after.actions")).contains(String.valueOf(a.get("kind")))) {
                    acceptedKind = String.valueOf(a.get("kind"));
                    break;
                }
            }
            s.assertNotNull(acceptedKind, what + " after-action accepted and stored");
        });
        note(c, String.join("\n", log));
        s.assertAll();
    }
}
