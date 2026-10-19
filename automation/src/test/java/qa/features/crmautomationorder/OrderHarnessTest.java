package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS_QA_LAYOUT;

/** S0: proves the harness against staging before the real groups run (group "crm-harness"). */
public class OrderHarnessTest extends OrderTestBase {
    @Override protected String session() { return "S0"; }
    @Override protected CrmUser processAdmin() { return adminA(); }

    @CaseId("S0-01")
    @Test(groups = {"crm-harness"}, description = "All 6 accounts sign in through the API and are in the NDC-Staging tenant")
    public void accountsSignIn() {
        for (CrmUser u : List.of(owner(), adminA(), adminB(), supervisor(), userN(), userV()))
            Assert.assertNotNull(u.id(), "user id for " + u);
    }

    @CaseId("S0-02")
    @Test(groups = {"crm-harness"}, description = "Each process can be created inactive, switched on and off, and removed")
    public void processLifecycle() {
        String ar = api.assignmentRule(CrmProcs.assignmentRule(LEADS, "S0-02 AR", List.of("Import", "WebForm"), CrmProcs.guard(LEADS), List.of(userN().id()), "LeaveUnassigned", null));
        Assert.assertEquals(api.setAssignmentRuleActive(ar, true).statusCode() / 100, 2, "AR on");
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), "S0-02 RP", CrmProcs.guard(LEADS), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        Assert.assertEquals(api.setReviewActive(rp, true, null).statusCode() / 100, 2, "RP on");
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, "S0-02 WF").onCreate().fieldUpdate("description", "WF S0-02").build());
        Assert.assertEquals(api.setWorkflowActive(wf, true).statusCode() / 100, 2, "WF on");
        String ap = api.approvalProcess(CrmProcs.approvalProcess(LEADS, "S0-02 AP", true, false, CrmProcs.guard(LEADS), List.of(CrmProcs.levelUsers(adminA().id())), List.of(adminA().id())));
        Assert.assertEquals(api.setApprovalActive(ap, true).statusCode() / 100, 2, "AP on");
        String bp = api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), CrmApi.pipelineOf(layout(DEALS)), "stage", "S0-02 BP",
                CrmProcs.guard(DEALS), List.of("qualification", "proposal"), List.of(CrmProcs.setField("description", "BP S0-02"))));
        Response on = api.setBlueprintActive(DEALS, bp, true);
        Assert.assertEquals(on.statusCode() / 100, 2, "BP on: " + on.asString());
        // switched off again by cleanup
    }

    @CaseId("S0-03")
    @Test(groups = {"crm-harness"}, description = "Review hold on the QA layout, reject/resubmit/approve, and the blueprint transition body")
    public void runtimeShapes() {
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), "S0-03 RP", CrmProcs.guard(LEADS), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        api.setReviewActive(rp, true, null);
        Map<String, Object> f = CrmApi.minimal(LEADS, nm("S0-03", "lead"));
        f.put("email", "qa.aeo.s0@qa.test");
        String lead = api.createRecord(userN(), LEADS, layout(LEADS), f);
        Assert.assertEquals(api.reviewStatus(LEADS, lead), "pending_for_review");
        String req = api.reviewRequestId(LEADS, lead);
        Assert.assertEquals(api.reviewField(adminA(), req, "email", false).statusCode(), 200, "reject email");
        Assert.assertEquals(api.reviewStatus(LEADS, lead), "rejected");
        Assert.assertEquals(api.reviewResubmit(userN(), req).statusCode() / 100, 2, "resubmit");
        String req2 = api.reviewRequestId(LEADS, lead);
        Assert.assertEquals(api.reviewField(adminA(), req2, "email", true).statusCode(), 200, "approve email");
        Assert.assertEquals(api.reviewStatus(LEADS, lead), "approved");
        traceOf("S0-03", LEADS, lead);

        String bp = api.blueprint(DEALS, CrmProcs.blueprint("deals", layout(DEALS), CrmApi.pipelineOf(layout(DEALS)), "stage", "S0-03 BP",
                CrmProcs.guard(DEALS), List.of("qualification", "proposal"), List.of(CrmProcs.setField("description", "BP S0-03"))));
        api.setBlueprintActive(DEALS, bp, true);
        String deal = api.createRecord(userN(), DEALS, nm("S0-03", "deal"));
        Assert.assertTrue(api.governed(DEALS, deal), "deal governed by the QA blueprint");
        String t = api.blueprintState(userN(), DEALS, deal).getString("data.transitions[0].transitionId");
        Response tr = null;
        for (Map<String, Object> body : List.<Map<String, Object>>of(Map.of(), Map.of("values", Map.of()), Map.of("fieldValues", List.of()), Map.of("data", List.of()))) {
            tr = api.transition(userN(), DEALS, deal, t, body);
            System.out.println("[S0-03] transition body " + body.keySet() + " -> " + tr.statusCode() + " " + tr.asString());
            if (tr.statusCode() / 100 == 2) break;
        }
        Assert.assertEquals(tr.statusCode() / 100, 2, "a transition body was accepted");
        Assert.assertEquals(api.field(userN(), DEALS, deal, "stage"), "proposal");
        traceOf("S0-03", DEALS, deal);
    }

    /** Read-only probe of the record-list query parameters (paging / sorting), group crm-probe. */
    @CaseId("S0-98")
    @Test(groups = {"crm-probe"}, description = "Which list query parameters page and sort the records list")
    public void listParamsProbe() {
        String base = "/modules/" + LEADS + "/records";
        for (String q : List.of("?page=1", "?page=2", "?page=109", "?page_number=2", "?pageNumber=2", "?offset=100", "?skip=100", "?start=100",
                "?page=2&per_page=50", "?page=2&pageSize=50", "?page=2&limit=50", "?limit=50&offset=100", "?take=50&skip=100",
                "?sort_by=created_at&sort_order=desc", "?sortBy=created_at&sortOrder=desc", "?sort=-created_at", "?sort=created_at:desc",
                "?order_by=created_at&order=desc", "?sort_field=created_at&sort_direction=desc", "?sort_by=created_at&sort_dir=desc",
                "?orderBy=created_at&orderDirection=desc", "?sort=created_at&direction=desc")) {
            Response r = adminA().get(base + q);
            List<Object> ca = r.statusCode() == 200 ? r.jsonPath().getList("data.created_at") : null;
            System.out.println("[probe-list] " + q + " -> " + r.statusCode() + " rows " + (ca == null ? null : ca.size()) + " first " + (ca == null || ca.isEmpty() ? null : ca.get(0))
                    + " last " + (ca == null || ca.isEmpty() ? null : ca.get(ca.size() - 1)) + " meta " + (r.statusCode() == 200 ? r.jsonPath().getMap("meta") : r.asString()));
        }
        for (String p : List.of("/modules/" + LEADS + "/records/search", "/modules/" + LEADS + "/records/query", "/modules/" + LEADS + "/records/list")) {
            Response r = adminA().post(p, Map.of("page", 1, "page_size", 5, "sort_by", "created_at", "sort_order", "desc"));
            System.out.println("[probe-list] POST " + p + " -> " + r.statusCode() + " " + (r.asString().length() > 300 ? r.asString().substring(0, 300) : r.asString()));
        }
    }

    // ================================================================ teardown (group crm-teardown, run on its own)

    /** QA layouts known to be left by earlier runs (LAYOUT_HAS_RECORDS on delete); every "QA AEO Layout …" is swept too. */
    private static final List<String> KNOWN_LEFTOVER_LAYOUTS = List.of(
            "d68c42be-abb7-4ac7-979f-73ca8a589cf3", "1d6bc1eb-91cb-42bc-a6c4-e4f8269730eb", "2a580cf0-e56c-4f3a-8d37-b2598fdbe6a4",
            "115721ef-a499-4e44-b17d-b8ed1bf14353", "f02ddb84-7159-492a-9650-e5a99b2d5dd1", "72d997c1-9292-45ca-b3ff-9f8883733ca2",
            "82a48386-16e7-4668-84ea-67a0a66747a5", "ba4fc8d3-8625-4856-a149-ffe637eaa412");
    private static final List<String> KNOWN_LEFTOVER_RECORDS = List.of("0a1c6f53-163a-4e32-8baf-57a813cac915");

    private static String cut(Response r) {
        String s = r.asString();
        return r.statusCode() + " " + (s.length() > 400 ? s.substring(0, 400) + "…" : s);
    }

    private static boolean qa(Object name) {
        return name != null && String.valueOf(name).startsWith(CrmOrderFeature.QA);
    }

    private static List<Map<String, Object>> rows(CrmUser as, String path) {
        Response r = as.get(path);
        if (r.statusCode() / 100 != 2) {
            System.out.println("[teardown] GET " + path + " -> " + cut(r));
            return List.of();
        }
        Object d = r.jsonPath().get("data");
        List<Map<String, Object>> l = d instanceof List<?> ? r.jsonPath().getList("data") : r.jsonPath().getList("data.items");
        return l == null ? List.of() : l;
    }

    /**
     * Removes what aborted / failed runs left behind, QA items only: "QA AEO" records whose created_with_layout_id is a
     * QA layout (approval locks reset as Owner first, held reviews rejected by deactivating the QA review process with
     * reject_all), every "QA AEO …" process, then the QA layouts. Re-runnable; prints what it did and what is left.
     */
    @CaseId("S0-99")
    @Test(groups = {"crm-teardown"}, description = "Delete QA AEO leftovers: records on QA layouts, QA AEO processes, QA layouts")
    public void purgeLeftovers() {
        CrmUser own = owner();
        CrmUser adm = adminA();
        List<String> mods = List.of(LEADS, DEALS, CrmOrderFeature.TASKS);

        // 1. QA layouts (id → module); not this run's own S0 layouts and not the fixed LEADS_QA_LAYOUT
        Map<String, String> layoutModule = new LinkedHashMap<>();
        for (String m : mods)
            for (Map<String, Object> l : rows(adm, "/modules/" + m + "/layouts")) {
                String id = String.valueOf(l.get("id"));
                if (id.equals(LEADS_QA_LAYOUT) || layouts.containsValue(id)) continue;
                if (String.valueOf(l.get("name")).startsWith(CrmOrderFeature.QA + "Layout") || KNOWN_LEFTOVER_LAYOUTS.contains(id)) layoutModule.put(id, m);
            }
        System.out.println("[teardown] QA layouts found: " + layoutModule);

        // 2. probes for the list lookup (read only)
        Response pd = adm.get("/modules/" + LEADS + "/records?page=1&page_size=3&sort_by=created_at&sort_order=desc");
        Response pa = adm.get("/modules/" + LEADS + "/records?page=1&page_size=3&sort_by=created_at&sort_order=asc");
        System.out.println("[probe] list desc meta " + pd.jsonPath().getMap("meta") + " created_at " + pd.jsonPath().getList("data.created_at"));
        System.out.println("[probe] list asc  meta " + pa.jsonPath().getMap("meta") + " created_at " + pa.jsonPath().getList("data.created_at"));
        List<Map<String, Object>> one = pd.jsonPath().getList("data");
        if (one != null && !one.isEmpty()) System.out.println("[probe] list row keys " + one.get(0).keySet());
        String sid = "350fd42f-d559-43a3-93f5-1fb9bfac2f01";
        Response ex = adm.get("/workflow/executions?correlationId=" + sid + "&take=20");
        List<Map<String, Object>> exr = ex.jsonPath().getList("data");
        System.out.println("[probe] executions?correlationId -> " + ex.statusCode() + " rows " + (exr == null ? null : exr.size())
                + " matching " + (exr == null ? 0 : exr.stream().filter(e -> sid.equals(e.get("correlationId"))).count()));

        // 3. QA review processes: collect their held records on QA layouts
        Map<String, String> targets = new LinkedHashMap<>(); // record id → module
        List<Map<String, Object>> rps = rows(adm, "/workflow/review-processes?page_size=200&take=200");
        for (Map<String, Object> rp : rps) {
            if (!qa(rp.get("name"))) continue;
            String pid = String.valueOf(rp.get("id"));
            for (Map<String, Object> q : rows(adm, "/workflow/reviews/queue?processId=" + pid + "&take=100"))
                if (pid.equals(q.get("processId")) && qa(q.get("recordLabel")) && layoutModule.containsKey(String.valueOf(q.get("layoutId"))))
                    targets.put(String.valueOf(q.get("recordId")), String.valueOf(q.get("moduleId")));
        }
        System.out.println("[teardown] held review records on QA layouts: " + targets.keySet());
        java.util.Set<String> qaApprovalIds = new java.util.HashSet<>();
        for (Map<String, Object> ap : rows(adm, "/workflow/approval-processes")) if (qa(ap.get("name"))) qaApprovalIds.add(String.valueOf(ap.get("id")));
        // records pending approval (the list may not show them): the approvals queue, checked against the QA layouts
        for (CrmUser who : List.of(own, adm)) {
            List<Map<String, Object>> aq = rows(who, "/workflow/approvals/queue?take=200");
            if (!aq.isEmpty()) System.out.println("[probe] approvals queue row keys " + aq.get(0).keySet());
            for (Map<String, Object> q : aq) {
                Object rid = q.get("recordId");
                if (rid != null && q.get("moduleId") != null && qaApprovalIds.contains(String.valueOf(q.get("processId")))) {
                    // pending under a QA AEO approval process: release it (the record itself is deleted only if it is on a QA layout)
                    System.out.println("[teardown] status-reset (QA approval process) " + rid + " -> " + own.post("/workflow/approvals/records/" + q.get("moduleId") + "/" + rid
                            + "/status-reset", Map.of("reason", "QA AEO teardown")).statusCode());
                }
                Object mid = q.get("moduleId");
                if (rid == null || mid == null) continue;
                Response rec = own.get("/modules/" + mid + "/records/" + rid);
                if (rec.statusCode() == 200 && layoutModule.containsKey(String.valueOf(rec.jsonPath().getString("data.created_with_layout_id")))
                        && String.valueOf(rec.jsonPath().getList("data.data")).contains(CrmOrderFeature.QA))
                    targets.put(String.valueOf(rid), String.valueOf(mid));
            }
        }
        System.out.println("[teardown] + pending-approval records on QA layouts: " + targets.keySet());
        // held / rejected review records are not returned by the list: candidate ids from this machine's run logs
        // (target/*.log), each read back and kept only if it is a QA AEO record on a QA layout
        java.util.Set<String> seen = new java.util.LinkedHashSet<>();
        try (java.util.stream.Stream<java.nio.file.Path> files = java.nio.file.Files.list(java.nio.file.Path.of("target"))) {
            java.util.regex.Pattern uuid = java.util.regex.Pattern.compile("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");
            long since = System.currentTimeMillis() - Long.getLong("teardown.logHours", 3L) * 3_600_000L; // recent logs only (each id costs a read)
            for (java.nio.file.Path f : files.filter(f -> f.toString().endsWith(".log") && f.toFile().lastModified() > since).toList()) {
                java.util.regex.Matcher mm = uuid.matcher(java.nio.file.Files.readString(f, java.nio.charset.StandardCharsets.ISO_8859_1));
                while (mm.find()) seen.add(mm.group());
            }
        } catch (java.io.IOException e) {
            System.out.println("[teardown] log scan " + e);
        }
        // plus the review requests users see (submitter / reviewers / owner queue), which name their record ids
        for (CrmUser who : List.of(userN(), userV(), adm, adminB(), own))
            for (String path : List.of("/workflow/reviews/me?take=100", "/workflow/reviews/queue?take=100"))
                try {
                    for (Map<String, Object> q : rows(who, path)) if (q.get("recordId") != null) seen.add(String.valueOf(q.get("recordId")));
                } catch (Exception e) {
                    System.out.println("[teardown] " + path + " " + e);
                }
        seen.removeAll(layoutModule.keySet());
        java.util.Set<String> layoutMods = new java.util.LinkedHashSet<>(layoutModule.values());
        int probed = 0;
        for (String id : seen) {
            if (targets.containsKey(id)) continue;
            for (String m : layoutMods) {
                Response rec = own.get("/modules/" + m + "/records/" + id);
                probed++;
                if (rec.statusCode() != 200) continue;
                if (layoutModule.containsKey(String.valueOf(rec.jsonPath().getString("data.created_with_layout_id")))
                        && String.valueOf(rec.jsonPath().getList("data.data")).contains("value=" + CrmOrderFeature.QA))
                    targets.put(id, m);
                break;
            }
        }
        System.out.println("[teardown] + records from run logs (" + seen.size() + " ids, " + probed + " reads): " + targets.keySet());

        // 4. QA AEO records on QA layouts from the list (newest first)
        // the list ignores sort/page_size and is oldest first: the newest 15 pages per module (default order is newest first)
        for (String m : mods)
            for (Map<String, Object> r : CrmApi.newestRows(own, m, 15)) {
                String id = String.valueOf(r.get("id"));
                if (qa(CrmApi.nameOf(r, m)) && (layoutModule.containsKey(String.valueOf(r.get("created_with_layout_id"))) || KNOWN_LEFTOVER_RECORDS.contains(id)))
                    targets.put(id, m);
            }
        for (String id : KNOWN_LEFTOVER_RECORDS) {
            Response r = own.get("/modules/" + DEALS + "/records/" + id);
            System.out.println("[teardown] known leftover " + id + " -> " + r.statusCode());
            if (r.statusCode() == 200 && String.valueOf(r.jsonPath().getList("data.data")).contains(CrmOrderFeature.QA)) targets.putIfAbsent(id, DEALS);
        }
        System.out.println("[teardown] target records: " + targets);
        if (!targets.isEmpty()) {
            String probeId = targets.keySet().iterator().next();
            System.out.println("[probe] first target " + probeId + " listed to owner (newest 3 pages): " + CrmApi.listed(own, targets.get(probeId), probeId, 3));
        }

        // 5. approval locks: Owner status reset; then QA review processes off with reject_all
        for (Map.Entry<String, String> t : targets.entrySet()) {
            Response a = own.get("/workflow/approvals/records/" + t.getValue() + "/" + t.getKey());
            String st = a.statusCode() == 200 ? a.jsonPath().getString("data.state") : null;
            if (st != null && !"none".equals(st) && !"not_submitted".equals(st))
                System.out.println("[teardown] status-reset " + t.getKey() + " (" + st + ") -> "
                        + cut(own.post("/workflow/approvals/records/" + t.getValue() + "/" + t.getKey() + "/status-reset", Map.of("reason", "QA AEO teardown"))));
        }
        for (Map<String, Object> rp : rps) {
            if (!qa(rp.get("name"))) continue;
            String pid = String.valueOf(rp.get("id"));
            Response off = adm.patch("/workflow/review-processes/" + pid + "/active", Map.of("isActive", false, "pendingAction", "reject_all"));
            if (off.statusCode() / 100 != 2) off = adm.patch("/workflow/review-processes/" + pid + "/active", Map.of("isActive", false));
            System.out.println("[teardown] review process '" + rp.get("name") + "' off -> " + off.statusCode());
        }

        // 6. delete the records
        int deleted = 0;
        List<String> left = new ArrayList<>();
        for (Map.Entry<String, String> t : targets.entrySet()) {
            Response d = own.delete("/modules/" + t.getValue() + "/records/" + t.getKey());
            System.out.println("[teardown] delete record " + t.getKey() + " -> " + cut(d));
            if (d.statusCode() / 100 == 2 || d.statusCode() == 404) deleted++; else left.add(t.getKey());
        }

        // 7. QA AEO processes of every kind: deactivate and delete
        for (Map<String, Object> rp : rps)
            if (qa(rp.get("name"))) System.out.println("[teardown] delete review process '" + rp.get("name") + "' -> " + cut(adm.delete("/workflow/review-processes/" + rp.get("id"))));
        for (Map<String, Object> ap : rows(adm, "/workflow/approval-processes?page_size=200&take=200"))
            if (qa(ap.get("name"))) {
                adm.patch("/workflow/approval-processes/" + ap.get("id") + "/active", Map.of("isActive", false));
                System.out.println("[teardown] delete approval process '" + ap.get("name") + "' -> " + cut(adm.delete("/workflow/approval-processes/" + ap.get("id"))));
            }
        for (Map<String, Object> wf : rows(adm, "/workflow/rules?page_size=200&take=200"))
            if (qa(wf.get("name"))) {
                adm.post("/workflow/rules/" + wf.get("id") + "/deactivate", null);
                System.out.println("[teardown] delete workflow rule '" + wf.get("name") + "' -> " + cut(adm.delete("/workflow/rules/" + wf.get("id"))));
            }
        for (Map<String, Object> ar : rows(adm, "/workflow/assignment-rules?page_size=200&take=200"))
            if (qa(ar.get("name"))) {
                try {
                    api.setAssignmentRuleActive(String.valueOf(ar.get("id")), false);
                } catch (Exception e) {
                    System.out.println("[teardown] AR off " + e);
                }
                System.out.println("[teardown] delete assignment rule '" + ar.get("name") + "' -> " + cut(adm.delete("/workflow/assignment-rules/" + ar.get("id"))));
            }
        for (String m : mods)
            for (Map<String, Object> bp : rows(adm, "/modules/" + m + "/blueprints")) {
                Object nm = bp.get("name") != null ? bp.get("name") : bp.get("definition") instanceof Map<?, ?> d ? d.get("name") : null;
                if (!qa(nm)) continue;
                Response d = adm.delete("/modules/" + m + "/blueprints/" + bp.get("id"));
                if (d.statusCode() / 100 != 2 && d.statusCode() != 404) {
                    try {
                        api.setBlueprintActive(m, String.valueOf(bp.get("id")), false);
                    } catch (Exception e) {
                        System.out.println("[teardown] BP off " + e);
                    }
                    d = adm.delete("/modules/" + m + "/blueprints/" + bp.get("id"));
                }
                System.out.println("[teardown] delete blueprint '" + nm + "' -> " + cut(d));
            }

        // 8. retry records still locked, then the layouts
        for (String id : new ArrayList<>(left)) {
            Response d = own.delete("/modules/" + targets.get(id) + "/records/" + id);
            System.out.println("[teardown] retry delete record " + id + " -> " + cut(d));
            if (d.statusCode() / 100 == 2 || d.statusCode() == 404) {
                deleted++;
                left.remove(id);
            }
        }
        List<String> layoutsLeft = new ArrayList<>();
        for (Map.Entry<String, String> l : layoutModule.entrySet()) {
            Response d = CrmApi.deleteLayout(adm, l.getValue(), l.getKey());
            System.out.println("[teardown] delete layout " + l.getKey() + " -> " + cut(d));
            if (d.statusCode() / 100 != 2 && d.statusCode() != 404) layoutsLeft.add(l.getKey());
        }
        System.out.println("[teardown] SUMMARY records deleted " + deleted + "/" + targets.size() + ", records left " + left
                + ", layouts deleted " + (layoutModule.size() - layoutsLeft.size()) + "/" + layoutModule.size() + ", layouts left " + layoutsLeft);
        Assert.assertTrue(layoutsLeft.isEmpty() && left.isEmpty(), "leftovers remain: records " + left + ", layouts " + layoutsLeft);
    }
}
