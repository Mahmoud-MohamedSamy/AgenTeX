package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 group C — audit log (NDC-2381, NDC-1343, NDC-2293/NDC-1344). Every change here is made by the owner on QA
 * objects and removed in @AfterClass. Events are matched by target id, so other sessions' activity cannot satisfy a check.
 */
public class AuditLogTest {
    private static final List<String> ALL_APPS = List.of("crm", "metadata-engine", "iam", "workflow");
    private final List<String> leads = new ArrayList<>();
    private String profileId;

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        leads.forEach(CrmAccessApi::deleteLead);
        deleteProfile(profileId);
    }

    private static boolean is(Map<String, Object> e, String targetId, String action) {
        return targetId.equals(e.get("target_id")) && String.valueOf(e.get("action")).endsWith(action);
    }

    @CaseId("C-1")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-2381"}, description = "Create, update and delete of a record each appear in the audit log within 3 minutes, with who and what")
    public void recordLifecycleIsLogged() {
        String id = CrmUser.ok(postLead(owner(), QA + "C1 audit probe", Map.of()), "create lead").jsonPath().getString("data.id");
        leads.add(id);
        CrmUser.ok(patchLead(owner(), id, Map.of(K_EMAIL, "qa.w1.c1@example.com")), "update lead");
        CrmUser.ok(owner().delete("/modules/" + LEADS + "/records/" + id), "delete lead");
        leads.remove(id);
        long t0 = System.currentTimeMillis();
        Map<String, Object> created = waitForEvent(List.of("crm"), 180, e -> is(e, id, "created"));
        Map<String, Object> updated = waitForEvent(List.of("crm"), 30, e -> is(e, id, "updated"));
        Map<String, Object> deleted = waitForEvent(List.of("crm"), 30, e -> is(e, id, "deleted"));
        fact("C-1", "after " + (System.currentTimeMillis() - t0) / 1000 + " s: created=" + (created != null) + ", updated=" + (updated != null)
                + " (changes " + (updated == null ? "-" : updated.get("changes") != null) + "), deleted=" + (deleted != null)
                + "; actor=" + (created == null ? "-" : created.get("actor_label")));
        Assert.assertNotNull(created, "no 'created' audit event for the QA lead within 3 minutes");
        Assert.assertNotNull(updated, "no 'updated' audit event");
        Assert.assertNotNull(deleted, "no 'deleted' audit event");
        Assert.assertEquals(String.valueOf(created.get("actor_id")), OWNER_ID, "the event does not name the owner as actor");
        Assert.assertNotNull(updated.get("changes"), "the update event does not say what changed");
    }

    @CaseId("C-2")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1343"}, description = "Setup changes are logged: profile, field permission, user permission override")
    public void setupChangesAreLogged() {
        Map<String, Boolean> seen = new LinkedHashMap<>();
        profileId = createProfile(QA + "Audit " + System.currentTimeMillis() % 100000, P_USER);
        String row = setFieldPermission(F_COMPANY, profileId, "read_only");
        Response o = setOverride(V_ID, LH_VIEW_TEAM, "deny");
        try {
            seen.put("profile created", waitForEvent(ALL_APPS, 120, e -> profileId.equals(e.get("target_id"))) != null);
            seen.put("field permission", waitForEvent(ALL_APPS, 30, e -> Objects.equals(row, e.get("target_id"))
                    || String.valueOf(e.get("target_type")).contains("field_permission") && String.valueOf(e.get("changes")).contains(profileId)) != null);
            seen.put("user override", o.statusCode() / 100 == 2 && waitForEvent(ALL_APPS, 30, e -> V_ID.equals(e.get("target_id"))
                    || String.valueOf(e.get("changes")).contains(LH_VIEW_TEAM) || String.valueOf(e.get("metadata")).contains(LH_VIEW_TEAM)) != null);
        } finally {
            deleteFieldPermission(row);
            if (o.statusCode() / 100 == 2) clearOverride(V_ID, LH_VIEW_TEAM);
        }
        fact("C-2", "logged: " + seen + (o.statusCode() / 100 == 2 ? "" : "; override refused " + err(o)));
        Assert.assertFalse(seen.containsValue(false), "setup changes missing from the audit log: " + seen);
    }

    @CaseId("C-2b")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1343"}, description = "Every sign-out event names the user (read-only)")
    public void logoutNamesUser() {
        List<Map<String, Object>> outs = auditEvents("iam", 200).stream().filter(e -> String.valueOf(e.get("action")).contains("logout")).toList();
        long anonymous = outs.stream().filter(e -> e.get("actor_id") == null && e.get("actor_label") == null).count();
        fact("C-2b", outs.size() + " logout events in the newest 200 iam events; without a user: " + anonymous);
        if (outs.isEmpty()) throw new org.testng.SkipException("INCONCLUSIVE: no logout event in the newest 200 iam events");
        Assert.assertEquals(anonymous, 0, "sign-out events without the user who signed out");
    }

    @CaseId("C-3")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-2293"}, description = "The Entities filter lists each entity once (read-only)")
    @SuppressWarnings("unchecked")
    public void entityFilterHasNoDuplicates() {
        Response r = CrmUser.ok(owner().get("/audit/events/facets"), "GET audit facets");
        Object data = r.jsonPath().get("data");
        List<String> labels = new ArrayList<>();
        collectEntities(data, labels, false);
        Map<String, Integer> byName = new TreeMap<>();
        for (String l : labels) byName.merge(l.trim().toLowerCase(Locale.ROOT), 1, Integer::sum);
        Map<String, Integer> dup = new TreeMap<>();
        byName.forEach((k, v) -> {
            if (v > 1) dup.put(k, v);
        });
        fact("C-3", labels.size() + " entity options; duplicates (case-insensitive): " + dup);
        if (labels.isEmpty()) throw new org.testng.SkipException("INCONCLUSIVE: facets did not list entities: " + r.asString().substring(0, Math.min(200, r.asString().length())));
        Assert.assertTrue(dup.isEmpty(), "entities listed more than once: " + dup);
    }

    /** Collects entity labels from the facets response (entities / target_types arrays of strings or {label|value}). */
    @SuppressWarnings("unchecked")
    private static void collectEntities(Object node, List<String> out, boolean inEntities) {
        if (node instanceof Map<?, ?> m) {
            for (Map.Entry<?, ?> e : m.entrySet()) {
                String k = String.valueOf(e.getKey()).toLowerCase(Locale.ROOT);
                boolean ent = inEntities || k.contains("entit") || k.contains("target_type");
                if (ent && e.getValue() instanceof List<?> l) {
                    for (Object x : l) {
                        if (x instanceof Map<?, ?> xm) {
                            Object lab = xm.get("label") != null ? xm.get("label") : xm.get("display") != null ? xm.get("display") : xm.get("value");
                            if (lab != null) out.add(String.valueOf(lab));
                        } else if (x != null) out.add(String.valueOf(x));
                    }
                } else collectEntities(e.getValue(), out, ent);
            }
        }
    }
}
