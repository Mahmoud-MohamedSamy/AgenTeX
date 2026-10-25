package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 group B — field permissions (NDC-1337), API level. A QA profile cloned from User gets Company = hidden and
 * Comment = read only on Leads; test user 1 is moved to it, writes and reads leads, and is moved back. The Email field
 * stays read/write and is the control: when the control value is not stored either, the result is inconclusive.
 */
public class FieldPermissionTest {
    private CrmHierarchyApi.Snapshot baseline;
    private String profileId;
    private final List<String> rows = new ArrayList<>();
    private final List<String> leads = new ArrayList<>();
    private CrmUser n;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        baseline = CrmHierarchyApi.snapshot();
        profileId = createProfile(QA + "FieldPerm " + System.currentTimeMillis() % 100000, P_USER);
        rows.add(setFieldPermission(F_COMPANY, profileId, "hidden"));
        rows.add(setFieldPermission(F_COMMENT, profileId, "read_only"));
        CrmHierarchyApi.setProfile(N_ID, profileId, OU_SALES);
        fact("B-setup", "profile " + profileId + " rows " + fieldPermissionsOf(profileId) + "; test user 1 moved to it");
        n = CrmUser.as(USER_N);   // first sign-in of N in this JVM happens after the move
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        leads.forEach(CrmAccessApi::deleteLead);
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        rows.forEach(CrmAccessApi::deleteFieldPermission);
        deleteProfile(profileId);
        List<String> d = CrmHierarchyApi.diff(baseline, CrmHierarchyApi.snapshot());
        boolean gone = profileId == null || !profileExists(profileId);
        fact("B-revert", (d.isEmpty() ? "users and mode as before" : "DIFFERENCES: " + d) + "; QA profile deleted=" + gone);
        Assert.assertTrue(d.isEmpty() && gone, "not restored: " + d + ", profile deleted=" + gone);
    }

    @CaseId("B-0")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "The effective field permissions of test user 1 show the two restrictions (record)")
    public void effectiveShowsRestrictions() {
        Response r = CrmUser.ok(n.get("/modules/" + LEADS + "/field-permissions/effective"), "effective field permissions");
        String body = r.asString();
        // the effective list names fields by key (company), not by field id
        boolean company = body.contains(F_COMPANY) || body.contains("\"" + K_COMPANY + "\"");
        boolean comment = body.contains(F_COMMENT) || body.contains("\"" + K_COMMENT + "\"");
        fact("B-0", "effective for test user 1: mentions hidden=" + body.contains("hidden") + ", read_only=" + body.contains("read_only")
                + ", company=" + company + ", comment=" + comment + "; body " + body.length() + " chars");
        Assert.assertTrue(company && comment, "the effective permissions do not list the two restricted fields");
    }

    @CaseId("B-3a")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1337"}, description = "A hidden field cannot be written through the API")
    public void hiddenFieldNotWritable() {
        String email = "qa.w1.b3a." + System.currentTimeMillis() + "@example.com";
        Response r = postLead(n, QA + "B3a hidden", Map.of(K_COMPANY, "QA W1 should not be stored", K_EMAIL, email));
        if (r.statusCode() / 100 != 2) {
            fact("B-3a", "create with the hidden field refused: " + err(r));
            Assert.assertTrue(r.asString().contains(K_COMPANY) || r.statusCode() == 403 || r.statusCode() == 422, "refused for another reason: " + err(r));
            return;
        }
        String id = r.jsonPath().getString("data.id");
        leads.add(id);
        Object control = valueAsOwner(id, K_EMAIL), company = valueAsOwner(id, K_COMPANY);
        fact("B-3a", "create accepted (" + r.statusCode() + "); stored email(control)=" + (control != null) + ", stored company=" + company);
        if (!email.equals(String.valueOf(control))) throw new SkipException("INCONCLUSIVE: the control field (Email) was not stored either");
        Assert.assertTrue(company == null || String.valueOf(company).isBlank(), "test user 1 wrote the hidden field Company: '" + company + "'");
    }

    @CaseId("B-3b")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1337"}, description = "A read-only field cannot be changed through the API")
    public void readOnlyFieldNotWritable() {
        Response c = postLead(owner(), QA + "B3b read only", Map.of("owner", N_ID));
        String id = CrmUser.ok(c, "create lead as owner").jsonPath().getString("data.id");
        leads.add(id);
        String email = "qa.w1.b3b." + System.currentTimeMillis() + "@example.com";
        Response r = patchLead(n, id, Map.of(K_COMMENT, "QA W1 should not be stored", K_EMAIL, email));
        if (r.statusCode() / 100 != 2) {
            fact("B-3b", "update with the read-only field refused: " + err(r));
            Assert.assertTrue(r.asString().contains(K_COMMENT) || r.statusCode() == 403 || r.statusCode() == 422, "refused for another reason: " + err(r));
            return;
        }
        Object control = valueAsOwner(id, K_EMAIL), comment = valueAsOwner(id, K_COMMENT);
        fact("B-3b", "update accepted (" + r.statusCode() + "); stored email(control)=" + email.equals(String.valueOf(control)) + ", stored comment=" + comment);
        if (!email.equals(String.valueOf(control))) throw new SkipException("INCONCLUSIVE: the control field (Email) was not updated either");
        Assert.assertTrue(comment == null || String.valueOf(comment).isBlank(), "test user 1 changed the read-only field Comment: '" + comment + "'");
    }

    @CaseId("B-3c")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-1337"}, description = "A hidden field's value is not returned to the restricted user")
    public void hiddenFieldNotReturned() {
        String secret = "QA W1 hidden value " + System.currentTimeMillis();
        Response c = postLead(owner(), QA + "B3c read", Map.of("owner", N_ID, K_COMPANY, secret));
        String id = CrmUser.ok(c, "create lead as owner").jsonPath().getString("data.id");
        leads.add(id);
        Response r = n.get("/modules/" + LEADS + "/records/" + id);
        if (r.statusCode() != 200) throw new SkipException("INCONCLUSIVE: test user 1 cannot open their own lead (" + err(r) + ")");
        boolean leaked = r.asString().contains(secret);
        fact("B-3c", "owner stored Company; test user 1 GET -> 200, value in response=" + leaked);
        Assert.assertFalse(leaked, "the hidden field's value is returned to test user 1");
    }
}
