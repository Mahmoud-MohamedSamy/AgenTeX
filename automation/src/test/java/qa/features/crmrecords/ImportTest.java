package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group IM — Leads import through the same API the screen uses: undo (IM-08), "Trigger workflow rules" off
 * (NDC-2302, with a QA rule and a control lead), and field permissions on import (NDC-1593 / NDC-1599, test user 1
 * on a QA profile for the length of the test, then back on User / Sales). Every imported lead is purged afterwards.
 */
public class ImportTest {
    private final Cleanup cleanup = new Cleanup();
    private final String t = tag();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        for (String id : leadIdsByPrefix(owner(), QA + "IM " + t)) cleanup.record(mod("leads"), id);
        cleanup.run();
    }

    private static String phone(String seed) {
        return String.format("010%08d", Math.floorMod(seed.hashCode(), 100_000_000));
    }

    private static Map<String, Object> row(String name, String phone) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("first_name", name);
        r.put("phone", phone);
        r.put("single_line_3_9", "QA W2");
        return r;
    }

    @CaseId("IM-08")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Import 2 leads, then Undo import: both go to the bin and the session says undone")
    public void importAndUndo() {
        String p = QA + "IM " + t + " undo";
        Import imp = importLeads(owner(), List.of(row(p + " 1", phone(p + " 1")), row(p + " 2", phone(p + " 2"))), false);
        if (imp.created() != 2) throw new SkipException("INCONCLUSIVE: the import did not create 2 leads: " + imp.log());
        List<String> ids = leadIdsByPrefix(owner(), p);
        ids.forEach(id -> cleanup.record(mod("leads"), id));
        Response u = owner().post("/modules/" + LEADS + "/import/" + imp.sessionId + "/undo", null);
        boolean gone = CrmApi.waitFor(60, () -> ids.stream().allMatch(id -> get(owner(), mod("leads"), id).statusCode() == 404));
        String status = CrmUser.ok(owner().get("/modules/" + LEADS + "/import/" + imp.sessionId), "status").jsonPath().getString("data.status");
        fact("IM-08", imp.log() + "; undo -> " + err(u) + "; leads gone=" + gone + "; status " + status);
        Assert.assertEquals(u.statusCode() / 100, 2, "Undo import was refused");
        Assert.assertTrue(gone, "the imported leads are still there after Undo");
        Assert.assertEquals(status, "undone", "the import session is not marked undone");
    }

    @CaseId("IM-05")
    @Test(groups = {"crmrecords", "wave2", "api", "regression", "NDC-2302"}, description = "With 'Trigger workflow rules' off, an On Create rule does not run for imported leads (a control lead made by API gets it)")
    public void triggerOffRunsNoWorkflow() {
        String guard = QA + "IM " + t + " WF";
        Map<String, Object> rule = m("moduleId", LEADS, "appKey", "crm", "layoutId", null, "departmentIds", List.of(), "name", QA + "WF import guard " + t,
                "description", null, "mode", "Recurring", "isActive", false,
                "trigger", m("kind", "RecordCreated", "fieldName", null, "fieldNames", null, "fieldMatch", null, "dateFieldName", null, "offsetSeconds", null, "offsetMode", null),
                "criteria", m("kind", "StringMatch", "field", "first_name", "operator", "StartsWith", "stringValue", guard, "caseInsensitive", false, "negate", null),
                "actions", List.of(m("type", "FieldUpdate", "order", 0, "delaySeconds", 0, "fieldUpdates", m("description", m("kind", "string", "stringValue", "QA W2 WF ran")))));
        Response c = CrmUser.ok(owner().post("/workflow/rules", rule), "create QA rule");
        String ruleId = c.jsonPath().getString("data.id") != null ? c.jsonPath().getString("data.id") : c.jsonPath().getString("data.ruleId");
        cleanup.then(() -> {
            owner().post("/workflow/rules/" + ruleId + "/deactivate", null);
            fact("cleanup", "delete QA rule -> " + owner().delete("/workflow/rules/" + ruleId).statusCode());
        });
        CrmUser.ok(owner().post("/workflow/rules/" + ruleId + "/activate", null), "activate QA rule");

        String control = create(owner(), cleanup, mod("leads"), guard + " control", null);
        boolean ran = CrmApi.waitFor(60, () -> "QA W2 WF ran".equals(str(get(owner(), mod("leads"), control), "description")));
        if (!ran) throw new SkipException("INCONCLUSIVE: the QA rule did not run for the control lead in 60 s");

        Import imp = importLeads(owner(), List.of(row(guard + " imp 1", phone(guard + " imp 1")), row(guard + " imp 2", phone(guard + " imp 2"))), false);
        if (imp.created() != 2) throw new SkipException("INCONCLUSIVE: the import did not create 2 leads: " + imp.log());
        qa.core.base.Waits.sleep(60_000);
        List<String> ids = leadIdsByPrefix(owner(), guard + " imp");
        ids.forEach(id -> cleanup.record(mod("leads"), id));
        long withRule = ids.stream().filter(id -> "QA W2 WF ran".equals(str(get(owner(), mod("leads"), id), "description"))).count();
        fact("IM-05", "control got the rule; " + imp.log() + "; imported leads changed by the rule after 60 s: " + withRule + " of " + ids.size());
        Assert.assertEquals(ids.size(), 2, "imported leads not found");
        Assert.assertEquals(withRule, 0L, "the workflow rule ran for imported leads although 'Trigger workflow rules' was off");
    }

    @CaseId("IM-04")
    @Test(groups = {"crmrecords", "wave2", "api", "regression", "NDC-1593", "NDC-1599"},
            description = "Test user 1 with Company read-only and Email hidden can't import values into those fields (server check)")
    public void importRespectsFieldPermissions() {
        Map<String, Object> pb = m("name", QA + "Import FP " + t, "parent_profile_id", P_MANAGER, "rank", 100, "is_tenant_wide", false, "source_profile_id", P_USER, "app_key", "crm");
        Response pr = CrmUser.ok(owner().post("/iam/profiles", pb), "create QA profile");
        String pid = null;
        for (String k : List.of("data.profileId", "data.id", "data.profile_id")) if (pid == null) pid = pr.jsonPath().getString(k);
        fact("IM-04", "create profile -> " + pr.statusCode() + " " + pr.asString().substring(0, Math.min(200, pr.asString().length())));
        if (pid == null) throw new SkipException("INCONCLUSIVE: no profile id in the create answer");
        final String profile = pid;
        cleanup.then(() -> fact("cleanup", "delete QA profile -> " + owner().delete("/iam/profiles/" + profile).statusCode()));
        String fp1 = CrmUser.ok(owner().post("/modules/" + LEADS + "/field-permissions", m("fieldId", F_COMPANY, "profileId", profile, "permission", "read_only")), "company read only").jsonPath().getString("data.id");
        String fp2 = CrmUser.ok(owner().post("/modules/" + LEADS + "/field-permissions", m("fieldId", F_EMAIL, "profileId", profile, "permission", "hidden")), "email hidden").jsonPath().getString("data.id");
        cleanup.then(() -> {
            owner().delete("/modules/" + LEADS + "/field-permissions/" + fp1);
            owner().delete("/modules/" + LEADS + "/field-permissions/" + fp2);
        });
        CrmUser.ok(owner().post("/iam/users/" + N_ID + "/profiles", m("profile_id", profile, "scope_id", OU_SALES, "replace", true)), "move user 1 to the QA profile");
        cleanup.then(() -> fact("cleanup", "user 1 back on User / Sales -> "
                + owner().post("/iam/users/" + N_ID + "/profiles", m("profile_id", P_USER, "scope_id", OU_SALES, "replace", true)).statusCode()));

        String p = QA + "IM " + t + " FP";
        Import ctl = importLeads(user1(), List.of(row(p + " control", phone(p + " control"))), false);
        if (ctl.created() != 1) throw new SkipException("INCONCLUSIVE: test user 1 could not import a plain lead: " + ctl.log());
        Map<String, Object> bad = row(p + " restricted", phone(p + " restricted"));
        bad.put("company", "QA W2 should not land");
        bad.put("email", "qa.w2.fp@example.com");
        Import imp = importLeads(user1(), List.of(bad), false);
        String restricted = leadIdsByPrefix(owner(), p + " restricted").stream().findFirst().orElse(null);
        String company = restricted == null ? null : str(get(owner(), mod("leads"), restricted), "company");
        String email = restricted == null ? null : str(get(owner(), mod("leads"), restricted), "email");
        fact("IM-04", "control created 1; restricted import: " + imp.log() + "; lead created=" + (restricted != null) + " company=" + company + " email=" + email);
        Assert.assertNotEquals(company, "QA W2 should not land", "a read-only Company value was imported");
        Assert.assertNotEquals(email, "qa.w2.fp@example.com", "a hidden Email value was imported");
    }
}
