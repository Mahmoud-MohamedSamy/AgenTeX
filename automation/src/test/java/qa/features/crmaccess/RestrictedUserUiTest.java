package qa.features.crmaccess;

import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmaccess.pages.AccessScreensPage;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 screens as test user 1 (run with -Dcredentials.account=nameb56175@airhemp.com). Setup by API as the owner:
 * a QA profile with Company = hidden and Comment = read only on Leads, test user 1 moved to it, one lead owned by test
 * user 1 with both values, and DENY overrides on the three "view login history" permissions. All removed afterwards.
 */
public class RestrictedUserUiTest extends BaseTest {
    private static final List<String> LH = List.of(LH_VIEW_SELF, LH_VIEW_TEAM, LH_VIEW_ALL);
    private CrmHierarchyApi.Snapshot baseline;
    private String profileId, leadId;
    private final List<String> rows = new ArrayList<>();
    private final List<String> overridesSet = new ArrayList<>();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        baseline = CrmHierarchyApi.snapshot();
        profileId = createProfile(QA + "FieldPerm UI " + System.currentTimeMillis() % 100000, P_USER);
        rows.add(setFieldPermission(F_COMPANY, profileId, "hidden"));
        rows.add(setFieldPermission(F_COMMENT, profileId, "read_only"));
        CrmHierarchyApi.setProfile(N_ID, profileId, OU_SALES);
        leadId = CrmUser.ok(postLead(owner(), QA + "FP UI lead", Map.of("owner", N_ID, K_COMPANY, "QA W1 secret company", K_COMMENT, "QA W1 comment")),
                "create lead").jsonPath().getString("data.id");
        for (String k : LH) if (setOverride(N_ID, k, "deny").statusCode() / 100 == 2) overridesSet.add(k);
        fact("RU-setup", "profile " + profileId + ", lead " + leadId + ", login-history denies " + overridesSet);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        overridesSet.forEach(k -> clearOverride(N_ID, k));
        deleteLead(leadId);
        CrmHierarchyApi.setProfile(N_ID, P_USER, OU_SALES);
        rows.forEach(CrmAccessApi::deleteFieldPermission);
        deleteProfile(profileId);
        List<String> d = CrmHierarchyApi.diff(baseline, CrmHierarchyApi.snapshot());
        boolean ovLeft = LH.stream().anyMatch(overrides(N_ID)::contains);
        fact("RU-revert", (d.isEmpty() ? "users as before" : "DIFFERENCES: " + d) + "; overrides left=" + ovLeft);
        Assert.assertTrue(d.isEmpty() && !ovLeft, "not restored: " + d + ", overrides left=" + ovLeft);
    }

    @CaseId("FP-04")
    @Test(groups = {"crmaccess", "wave1", "ui", "NDC-1337"}, description = "Create form: the hidden field is absent, the read-only field cannot be typed into")
    public void createFormHonoursFieldPermissions() {
        AccessScreensPage p = new AccessScreensPage().open("/modules/" + LEADS + "/records/new", "Last Name", 40);
        p.clearStorageAndReload();
        p.waitForText("Last Name", 30);
        boolean companyShown = p.labelShown("Company");
        WebElement comment = p.controlFor("Comment");
        boolean commentShown = comment != null, commentEditable = AccessScreensPage.editable(comment);
        fact("FP-04", "create form as test user 1: Company shown=" + companyShown + "; Comment shown=" + commentShown + ", editable=" + commentEditable);
        Assert.assertFalse(companyShown, "the hidden field Company is on the create form");
        Assert.assertFalse(commentEditable, "the read-only field Comment can be typed into");
    }

    @CaseId("FP-05")
    @Test(groups = {"crmaccess", "wave1", "ui", "NDC-1337"}, description = "Record page: the hidden field and its value are not shown")
    public void detailPageHonoursFieldPermissions() {
        AccessScreensPage p = new AccessScreensPage().open("/modules/" + LEADS + "/records/" + leadId, "QA W1", 40);
        boolean valueShown = p.text().contains("QA W1 secret company");
        boolean commentShown = p.text().contains("QA W1 comment");
        fact("FP-05", "record page as test user 1: hidden Company value shown=" + valueShown + "; read-only Comment value shown=" + commentShown);
        Assert.assertFalse(valueShown, "the hidden Company value is shown on the record page");
    }

    @CaseId({"LH-07", "US-16", "PR-08", "SP-05"})
    @Test(groups = {"crmaccess", "wave1", "ui", "NDC-613"}, description = "Setup shows only what the user may open; admin pages refuse a direct URL")
    public void setupMenuAndDirectUrls() {
        String perms = CrmUser.ok(CrmUser.as(USER_N).get("/iam/me/permissions"), "N permissions").asString();
        AccessScreensPage p = new AccessScreensPage().open("/settings", "Setup", 40);
        p.clearStorageAndReload();
        p.waitForText("Setup", 20);
        String menu = p.text();
        boolean lhLink = menu.contains("Login History");
        List<String> shownWithoutPermission = new ArrayList<>();
        if (!perms.contains("iam.profile.manage") && menu.contains("Profiles")) shownWithoutPermission.add("Profiles");
        if (!perms.contains("iam.security.view") && menu.contains("Security Policies")) shownWithoutPermission.add("Security Policies");
        if (!perms.contains("iam.user.view") && menu.contains("Users")) shownWithoutPermission.add("Users");
        List<String> opened = new ArrayList<>();
        String[][] direct = {{"/settings/security/profiles", "Create profile", "iam.profile.manage"}, {"/settings/security/policies", "Session policy", "iam.security.view"},
                {"/settings/security/login-history", "Login Time", "loginhistory"}};
        for (String[] d : direct) {
            p.open(d[0], d[1], 15);
            if (p.text().contains(d[1]) && !perms.contains(d[2])) opened.add(d[0]);
        }
        fact("LH-07/US-16/PR-08/SP-05", "test user 1 (login history denied): Login History link=" + lhLink + "; links shown without permission " + shownWithoutPermission
                + "; admin pages opened by URL without permission " + opened);
        Assert.assertFalse(lhLink, "the Login History link is offered to a user denied every view permission");
        Assert.assertTrue(shownWithoutPermission.isEmpty(), "Setup offers " + shownWithoutPermission + " without the permission");
        Assert.assertTrue(opened.isEmpty(), "pages opened by direct URL without the permission: " + opened);
    }
}
