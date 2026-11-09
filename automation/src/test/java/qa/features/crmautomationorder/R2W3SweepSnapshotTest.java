package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.Test;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Round 2 Wave 3 (27 Oct 2026) owner-free sweep + final snapshot, ported from the round 1 lane scripts (sweep.js,
 * reject-pending.js) so it runs in ONE JVM with one sign-in per account (CRM Admin A; approvers Supervisor / CRM Admin B
 * only to reject records still pending under a QA process). Removes only objects named "QA AEO " / "QA R2W3 " / "QA W3 "
 * that are NOT in the baseline snapshot, the records on those QA layouts, and today's QA bin items; then writes
 * after/snapshot.json and after/diff.txt next to -Dw3.dir. Run: -Dtest=R2W3SweepSnapshotTest -Dw3.dir=<wave3 folder>.
 */
public class R2W3SweepSnapshotTest {
    private static final List<String> MODS = List.of(CrmOrderFeature.LEADS, CrmOrderFeature.DEALS, CrmOrderFeature.TASKS);
    private static final List<String> SNAP = List.of("/workflow/rules?take=500", "/workflow/assignment-rules", "/workflow/review-processes",
            "/workflow/approval-processes", "/workflow/custom-actions", "/workflow/review-rejection-reasons");
    /** Every line is also printed at once, so a sweep cut short still leaves its trail in the Maven log. */
    private final List<String> log = new ArrayList<>() {
        @Override
        public boolean add(String line) {
            System.out.println("[sweep] " + line);
            return super.add(line);
        }
    };

    private static boolean qa(Object n) {
        return String.valueOf(n).matches("^QA (AEO|R2W3|W3) .*");
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> list(CrmUser u, String p) {
        Response r = u.get(p);
        if (r.statusCode() / 100 != 2) return List.of();
        Object d = r.jsonPath().get("data");
        if (d instanceof List) return (List<Map<String, Object>>) d;
        if (d instanceof Map<?, ?> m) {
            Object x = m.get("items") != null ? m.get("items") : m.get("layouts");
            if (x instanceof List) return (List<Map<String, Object>>) x;
        }
        return List.of();
    }

    private static Set<String> known(JsonPath base, String key) {
        Set<String> ids = new LinkedHashSet<>();
        List<Object> d = base.getList("'" + key + "'.data.id");
        if (d != null) for (Object o : d) ids.add(String.valueOf(o));
        return ids;
    }

    private static String bpPath(String m) {
        return "/modules/" + m + "/blueprints?includeInactive=true";
    }

    @Test(groups = {"r2w3-sweep"}, description = "Sweep QA AEO / QA R2W3 leftovers not in the baseline, then write the final snapshot and diff")
    @SuppressWarnings("unchecked")
    public void sweepAndSnapshot() throws Exception {
        Path dir = Path.of(System.getProperty("w3.dir"));
        JsonPath base = JsonPath.from(new File(dir.resolve("baseline/snapshot.json").toString()));
        CrmUser a = CrmUser.as(CrmOrderFeature.ADMIN_A);

        // -1. test user 2 must be Active again (A-17 suspends it; its finally block already reactivates — this is the separate check)
        for (Object o : CrmUser.ok(a.get("/iam/users?app_key=crm"), "users").jsonPath().getList("data")) {
            Map<?, ?> u = (Map<?, ?>) o;
            if (!CrmOrderFeature.USER_V.equalsIgnoreCase(String.valueOf(u.get("email")))) continue;
            String st = String.valueOf(u.get("status"));
            if (!"active".equalsIgnoreCase(st)) {
                int r = a.patch("/iam/users/" + u.get("userId"), qa.features.deskworkflowrules.Rules.kinded("status", "Active")).statusCode();
                System.out.println("[sweep] test user 2 was " + st + " -> reactivate " + r);
            } else System.out.println("[sweep] test user 2 status active");
        }

        // 0. reject records still pending under QA approval processes (as an approver who may decide)
        Set<String> procs = new LinkedHashSet<>();
        Set<String> kp = known(base, "/workflow/approval-processes");
        for (Map<String, Object> x : list(a, "/workflow/approval-processes")) if (qa(x.get("name")) && !kp.contains(String.valueOf(x.get("id")))) procs.add(String.valueOf(x.get("id")));
        Map<String, String> qaRecent = new LinkedHashMap<>();   // QA-named records of this run (27–28 Oct): deleted after the rejects
        // candidates: records on QA layouts (any module) + every lane account's approval queue (A's queue alone missed them on 27 Oct)
        Map<String, String> cand = new LinkedHashMap<>();
        List<String> approvers = List.of(CrmOrderFeature.ADMIN_A, CrmOrderFeature.ADMIN_B, CrmOrderFeature.SUPERVISOR, CrmOrderFeature.USER_N, CrmOrderFeature.USER_V);
        for (String who : approvers)
            for (Map<String, Object> q : list(CrmUser.as(who), "/workflow/approvals/queue?take=200")) if (procs.contains(String.valueOf(q.get("processId")))) cand.put(String.valueOf(q.get("recordId")), String.valueOf(q.get("moduleId")));
        for (String m : MODS) {
            Set<String> kl0 = known(base, "/modules/" + m + "/layouts");
            for (Map<String, Object> l : list(a, "/modules/" + m + "/layouts"))
                if (qa(l.get("name")) && !kl0.contains(String.valueOf(l.get("id"))))
                    for (Map<String, Object> r : list(a, "/modules/" + m + "/records?page=1&per_page=100&layout_id=" + l.get("id"))) cand.put(String.valueOf(r.get("id")), m);
            // QA-named records made by engines (blueprint After "Create record") need not sit on a QA layout (G-10 lead, 28 Oct)
            for (int p = 1; p <= 10; p++) {
                List<Map<String, Object>> rows = CrmApi.listPage(a, m, p);
                for (Map<String, Object> r : rows)
                    if (qa(CrmApi.nameOf(r, m))) {
                        cand.putIfAbsent(String.valueOf(r.get("id")), m);
                        if (String.valueOf(r.get("created_at")).startsWith(LocalDate.now().toString()) || String.valueOf(r.get("created_at")).startsWith(LocalDate.now().minusDays(1).toString()))
                            qaRecent.put(String.valueOf(r.get("id")), m);
                    }
                if (rows.size() < 100) break;
            }
        }
        for (Map.Entry<String, String> e : cand.entrySet()) {
            Response st = a.get("/workflow/approvals/records/" + e.getValue() + "/" + e.getKey());
            Map<String, Object> d = st.statusCode() / 100 == 2 ? st.jsonPath().getMap("data") : Map.of();
            if (!"pending_approval".equals(d.get("state"))) continue;
            String inst = String.valueOf(d.get("instanceId"));
            List<String> tried = new ArrayList<>();
            boolean done = false;
            for (String who : List.of(CrmOrderFeature.ADMIN_A, CrmOrderFeature.ADMIN_B)) {     // process admin takeover
                int sc = CrmUser.as(who).post("/workflow/approvals/" + inst + "/takeover/reject", Map.of("comment", "QA R2W3 cleanup")).statusCode();
                tried.add(who.split("@")[0] + " takeover " + sc);
                if (done = sc / 100 == 2) break;
            }
            if (!done) for (String who : approvers) {                                            // a level approver
                int sc = CrmUser.as(who).post("/workflow/approvals/" + inst + "/reject", Map.of("comment", "QA R2W3 cleanup")).statusCode();
                tried.add(who.split("@")[0] + " reject " + sc);
                if (done = sc / 100 == 2) break;
            }
            log.add("pending " + e.getKey() + ": " + String.join(", ", tried) + (done ? "" : " -> STILL PENDING"));
        }
        for (Map.Entry<String, String> e : qaRecent.entrySet()) {
            int sc = a.delete("/modules/" + e.getValue() + "/records/" + e.getKey()).statusCode();
            if (sc != 204) log.add("QA record " + e.getKey() + " delete -> " + sc);
        }
        log.add("QA-named records of 27–28 Oct deleted off QA layouts: " + qaRecent.size());
        // 1. workflow rules
        Set<String> kr = known(base, "/workflow/rules?take=500");
        for (Map<String, Object> x : list(a, "/workflow/rules?take=500"))
            if (qa(x.get("name")) && !kr.contains(String.valueOf(x.get("id")))) {
                a.post("/workflow/rules/" + x.get("id") + "/deactivate", null);
                log.add("rule " + x.get("name") + " -> " + a.delete("/workflow/rules/" + x.get("id")).statusCode());
            }
        // 2. assignment rules
        Set<String> ka = known(base, "/workflow/assignment-rules");
        for (Map<String, Object> x : list(a, "/workflow/assignment-rules"))
            if (qa(x.get("name")) && !ka.contains(String.valueOf(x.get("id")))) {
                if (Boolean.TRUE.equals(x.get("isActive"))) {
                    Map<String, Object> off = new LinkedHashMap<>(x);
                    off.put("isActive", false);
                    a.patch("/workflow/assignment-rules/" + x.get("id"), off);
                }
                log.add("assignment " + x.get("name") + " -> " + a.delete("/workflow/assignment-rules/" + x.get("id")).statusCode());
            }
        // 3. review processes (held records rejected)
        Set<String> kv = known(base, "/workflow/review-processes");
        for (Map<String, Object> x : list(a, "/workflow/review-processes"))
            if (qa(x.get("name")) && !kv.contains(String.valueOf(x.get("id")))) {
                int off = a.patch("/workflow/review-processes/" + x.get("id") + "/active", Map.of("isActive", false, "pendingAction", "reject_all")).statusCode();
                log.add("review " + x.get("name") + " off " + off + " delete " + a.delete("/workflow/review-processes/" + x.get("id")).statusCode());
            }
        // 4. approval processes
        for (Map<String, Object> x : list(a, "/workflow/approval-processes"))
            if (procs.contains(String.valueOf(x.get("id")))) {
                int off = a.patch("/workflow/approval-processes/" + x.get("id") + "/active", Map.of("isActive", false)).statusCode();
                Response d = a.delete("/workflow/approval-processes/" + x.get("id"));
                log.add("approval " + x.get("name") + " off " + off + " delete " + d.statusCode() + (d.statusCode() / 100 == 2 ? "" : " " + d.asString().substring(0, Math.min(160, d.asString().length()))));
            }
        // 5. blueprints, records on QA layouts, QA layouts
        Set<String> recIds = new LinkedHashSet<>();
        for (String m : MODS) {
            Set<String> kb = known(base, bpPath(m));
            for (Map<String, Object> x : list(a, bpPath(m))) {
                Object def = x.get("definition");
                Object nm = def instanceof Map<?, ?> dm ? dm.get("name") : x.get("name");
                if (qa(nm) && !kb.contains(String.valueOf(x.get("id")))) {
                    if (Boolean.TRUE.equals(x.get("isActive"))) a.patch("/modules/" + m + "/blueprints/" + x.get("id"), Map.of("isActive", false));
                    log.add("blueprint " + nm + " -> " + a.delete("/modules/" + m + "/blueprints/" + x.get("id")).statusCode());
                }
            }
            Set<String> kl = known(base, "/modules/" + m + "/layouts");
            for (Map<String, Object> l : list(a, "/modules/" + m + "/layouts"))
                if (qa(l.get("name")) && !kl.contains(String.valueOf(l.get("id")))) {
                    for (int p = 1; p <= 5; p++) {
                        List<Map<String, Object>> rows = list(a, "/modules/" + m + "/records?page=" + p + "&per_page=100&layout_id=" + l.get("id"));
                        for (Map<String, Object> r : rows) {
                            int s = a.delete("/modules/" + m + "/records/" + r.get("id")).statusCode();
                            recIds.add(String.valueOf(r.get("id")));
                            if (s != 204) log.add("  record " + r.get("id") + " -> " + s);
                        }
                        if (rows.size() < 100) break;
                    }
                    log.add("layout " + l.get("name") + " -> " + a.delete("/modules/" + m + "/layouts/" + l.get("id")).statusCode());
                }
        }
        // 6. purge today's QA bin items
        String today = LocalDate.now().toString();
        List<String> items = new ArrayList<>();
        String cursor = null;
        try {
        for (int i = 0; i < (Boolean.parseBoolean(System.getProperty("w3.binPurge", "true")) ? 30 : 0); i++) {   // -Dw3.binPurge=false: interim sweeps skip the slow bin
            Response r = cursor == null ? a.get("/audit/recycle-bin/items?limit=100")
                    : a.req().queryParam("limit", 100).queryParam("cursor", cursor).get("/audit/recycle-bin/items");
            if (r.statusCode() / 100 != 2) break;
            Object d = r.jsonPath().get("data");
            List<Map<String, Object>> rows = d instanceof List ? (List<Map<String, Object>>) d : r.jsonPath().getList("data.items");
            if (rows == null || rows.isEmpty()) break;
            for (Map<String, Object> x : rows)
                if ((qa(x.get("record_label")) || recIds.contains(String.valueOf(x.get("record_id")))) && (String.valueOf(x.get("deleted_at")).startsWith(today) || String.valueOf(x.get("deleted_at")).startsWith(LocalDate.now().minusDays(1).toString())))   // the run spans 27–28 Oct
                    items.add(String.valueOf(x.get("id")));
            cursor = r.jsonPath().getString("meta.next_cursor");
            if (cursor == null || cursor.isBlank()) break;
        }
        } catch (RuntimeException slow) { // the bin listing timed out on 27 Oct (read timeout after ~17 min): purge what was found, carry on
            log.add("bin listing stopped: " + slow);
        }
        for (int i = 0; i < items.size(); i += 50)
            log.add("bin purge " + Math.min(50, items.size() - i) + " -> " + a.post("/audit/recycle-bin/delete", Map.of("ids", items.subList(i, Math.min(items.size(), i + 50)))).statusCode());
        log.add("records deleted on QA layouts: " + recIds.size() + "; bin items purged: " + items.size());

        // 7. final snapshot + diff (counts and QA leftovers per endpoint)
        Map<String, Object> after = new LinkedHashMap<>();
        List<String> diff = new ArrayList<>();
        List<String> keys = new ArrayList<>(SNAP);
        for (String m : MODS) {
            keys.add(bpPath(m));
            keys.add("/modules/" + m + "/layouts");
        }
        for (String k : keys) {
            List<Map<String, Object>> rows = list(a, k);
            Set<String> ids = new LinkedHashSet<>();
            List<String> qaLeft = new ArrayList<>();
            for (Map<String, Object> x : rows) {
                ids.add(String.valueOf(x.get("id")));
                Object def = x.get("definition");
                Object nm = def instanceof Map<?, ?> dm ? dm.get("name") : x.get("name");
                if (qa(nm)) qaLeft.add(String.valueOf(nm));
            }
            Set<String> before = known(base, k);
            Set<String> added = new LinkedHashSet<>(ids);
            added.removeAll(before);
            Set<String> removed = new LinkedHashSet<>(before);
            removed.removeAll(ids);
            after.put(k, Map.of("count", rows.size(), "ids", new ArrayList<>(ids)));
            diff.add(k + ": before " + before.size() + ", after " + rows.size() + ", added " + added + ", removed " + removed + ", QA names left " + qaLeft);
        }
        Files.writeString(dir.resolve("after/snapshot.json"), new com.fasterxml.jackson.databind.ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(after), StandardCharsets.UTF_8);
        Files.writeString(dir.resolve("after/diff.txt"), String.join(System.lineSeparator(), diff) + System.lineSeparator(), StandardCharsets.UTF_8);
        Files.writeString(dir.resolve("after/sweep-log.txt"), String.join(System.lineSeparator(), log) + System.lineSeparator(), StandardCharsets.UTF_8);
        log.forEach(l -> System.out.println("[sweep] " + l));
        diff.forEach(l -> System.out.println("[diff] " + l));
    }
}
