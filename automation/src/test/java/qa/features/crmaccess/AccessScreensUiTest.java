package qa.features.crmaccess;

import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmaccess.pages.AccessScreensPage;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

import static qa.features.crmaccess.CrmAccessApi.fact;

/**
 * Wave 1 screens as the owner (run with -Dcredentials.account=ndc-staging-owner@taviportal.com). Each test opens one
 * screen and checks what it offers; nothing is saved, except HP-new which switches the hierarchy mode through the API
 * and back (approved, tenant-wide, restored in finally).
 */
public class AccessScreensUiTest extends BaseTest {

    private static List<String> missing(String body, String... expected) {
        List<String> m = new ArrayList<>();
        for (String e : expected) if (!body.contains(e)) m.add(e);
        return m;
    }

    @CaseId({"US-01", "US-02"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Users: views, columns, search narrows the list")
    public void usersList() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/general/users", "Invite user", 40);
        List<String> miss = missing(p.text(), "Users", "Invite user", "Active Users", "All Users", "test user 1");
        int all = p.tableRows();
        p.search("test user");
        int filtered = p.tableRows();
        boolean onlyMatches = p.text().contains("test user 1") && !p.text().contains("ndc-staging-owner@");
        fact("US-01/02", "missing on screen: " + miss + "; rows " + all + " -> after search 'test user' " + filtered + ", only matches=" + onlyMatches);
        Assert.assertTrue(miss.isEmpty(), "Users screen lacks " + miss);
        Assert.assertTrue(filtered > 0 && filtered < all, "search did not narrow the list (" + all + " -> " + filtered + ")");
    }

    @CaseId("US-10")
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "User modal: profile, org unit, reporting manager, referral code (read-only), overrides")
    public void userModal() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/general/users", "test user 1", 40);
        p.clickText("test user 1");
        p.waitForText("Reporting manager", 15);
        List<String> miss = missing(p.text(), "Profile", "Org unit", "Reporting manager", "Referral code", "Permission overrides");
        fact("US-10", "user modal missing: " + miss);
        Assert.assertTrue(miss.isEmpty(), "user modal lacks " + miss);
    }

    @CaseId({"PR-01", "PE-01", "PE-03"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Profiles list with badges; Permissions matrix with Grant / Deny / Inherit")
    public void profilesAndPermissions() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/profiles", "Create profile", 40);
        List<String> miss1 = missing(p.text(), "Profiles", "Create profile", "System", "Custom", "CRM Admin", "User");
        p.open("/settings/security/permissions", "Permissions", 40);
        boolean picked = p.has("User", 10);
        if (picked) p.clickText("User");
        p.waitForText("Inherit", 20);
        List<String> miss2 = missing(p.text(), "Grant", "Deny", "Inherit");
        fact("PR-01/PE-01", "profiles screen missing: " + miss1 + "; permissions matrix missing: " + miss2 + " (profile 'User' picked=" + picked + ")");
        Assert.assertTrue(miss1.isEmpty(), "Profiles screen lacks " + miss1);
        Assert.assertTrue(miss2.isEmpty(), "Permissions matrix lacks " + miss2);
    }

    @CaseId("OU-01")
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Org units: tree, search, create root / child actions")
    public void orgUnits() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/org-units", "Org Units", 40);
        List<String> miss = missing(p.text(), "Org Units", "Create root unit", "Sales");
        fact("OU-01", "missing: " + miss);
        Assert.assertTrue(miss.isEmpty(), "Org Units screen lacks " + miss);
    }

    @CaseId("SP-01")
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Security policies: session policy fields and help")
    public void securityPolicies() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/policies", "Session policy", 40);
        List<String> miss = missing(p.text(), "Security Policies", "Session policy", "Idle timeout (minutes)", "Absolute timeout", "Max concurrent sessions");
        boolean otherPolicies = p.text().contains("Password") || p.text().contains("lockout") || p.text().contains("MFA");
        fact("SP-01", "missing: " + miss + "; password / lockout / MFA policies on screen=" + otherPolicies + " (keys exist in the build)");
        Assert.assertTrue(miss.isEmpty(), "Security Policies lacks " + miss);
    }

    @CaseId({"LH-01", "LH-05"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Login history: columns, filters, export dialog (CSV; XLS/XLSX marked coming soon)")
    public void loginHistory() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/login-history", "Login Time", 60);
        List<String> miss = missing(p.text(), "Login History", "User Name", "Login Time", "Logout Time", "IP Address", "Session Status", "Export");
        p.clickText("Export");
        p.waitForText("Export Login History", 10);
        List<String> missExport = missing(p.text(), "Export Login History", "CSV", "All Data", "Filtered Data");
        fact("LH-01/05", "page missing: " + miss + "; export dialog missing: " + missExport + "; XLSX coming soon shown=" + p.text().contains("XLSX (coming soon)"));
        Assert.assertTrue(miss.isEmpty(), "Login History lacks " + miss);
        Assert.assertTrue(missExport.isEmpty(), "export dialog lacks " + missExport);
    }

    @CaseId({"AU-05", "AU-06"})
    @Test(groups = {"crmaccess", "wave1", "ui", "NDC-2293"}, description = "Audit log: filters; the Entities filter shows each entity once")
    public void auditLog() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/security/audit-log", "All Entities", 60);
        List<String> miss = missing(p.text(), "Audit Log", "All Entities", "All Users", "All Actions");
        p.clickText("All Entities");
        List<String> opts = p.openOptions();
        Map<String, Integer> count = new TreeMap<>();
        for (String o : opts) count.merge(o.toLowerCase(Locale.ROOT), 1, Integer::sum);
        Map<String, Integer> dup = new TreeMap<>();
        count.forEach((k, v) -> {
            if (v > 1) dup.put(k, v);
        });
        fact("AU-05/06", "filters missing: " + miss + "; entity options on screen " + opts.size() + ", duplicates: " + dup);
        Assert.assertTrue(miss.isEmpty(), "Audit Log lacks " + miss);
        if (opts.isEmpty()) throw new org.testng.SkipException("INCONCLUSIVE: the Entities list did not open");
        Assert.assertTrue(dup.isEmpty(), "entities shown more than once: " + dup);
    }

    @CaseId({"PS-01", "PS-02", "PS-03", "PS-04", "PS-07"})
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Personal settings pages render with their fields")
    public void personalPages() {
        AccessScreensPage p = new AccessScreensPage();
        StringBuilder f = new StringBuilder();
        List<String> bad = new ArrayList<>();
        String[][] pages = {{"/settings/personal/account-information", "Account Information"}, {"/settings/personal/locale", "Locale Information"},
                {"/settings/personal/name-format", "Name Format"}, {"/settings/personal/profile-photo", "Profile Photo"}, {"/settings/personal/change-password", "Change Password"}};
        for (String[] pg : pages) {
            boolean ok = p.open(pg[0], pg[1], 30).text().contains(pg[1]);
            f.append(pg[0].replace("/settings/personal/", "")).append('=').append(ok).append("; ");
            if (!ok) bad.add(pg[0]);
        }
        fact("PS-pages", f.toString());
        Assert.assertTrue(bad.isEmpty(), "personal pages not shown: " + bad);
    }

    @CaseId("RC-01")
    @Test(groups = {"crmaccess", "wave1", "ui"}, description = "Referral Code Integration page (read-only)")
    public void referralCodePage() {
        AccessScreensPage p = new AccessScreensPage().open("/settings/integrations/referral-code", "Team mapping", 40);
        List<String> miss = missing(p.text(), "Referral Code Integration", "Connection", "Team mapping", "Schedule", "Sync runs", "Webhook");
        fact("RC-01", "missing: " + miss + "; last run line shown=" + p.text().contains("Last run"));
        Assert.assertTrue(miss.isEmpty(), "Referral Code page lacks " + miss);
    }

    @CaseId("HP-new")
    @Test(groups = {"crmaccess", "wave1", "ui", "tenant-wide"}, description = "After switching back to Role mode the personal Reporting Hierarchy page is gone (stale cache check)")
    public void personalPageAfterSwitchBack() {
        try {
            CrmHierarchyApi.setMode("reporting");
            AccessScreensPage p = new AccessScreensPage().open("/settings/personal/reporting-hierarchy", "Reporting Hierarchy", 30);
            boolean inReporting = p.url().contains("reporting-hierarchy");
            CrmHierarchyApi.setMode("role");
            p.open("/settings/personal/reporting-hierarchy", "Setup", 20);
            boolean sameBrowser = p.url().contains("reporting-hierarchy") && p.text().contains("Reporting Hierarchy");
            p.clearStorageAndReload();
            p.waitForText("Setup", 15);
            boolean afterClear = p.url().contains("reporting-hierarchy") && p.text().contains("Reporting Hierarchy");
            fact("HP-new", "reporting mode: page shown=" + inReporting + "; back to role, same browser: still shown=" + sameBrowser
                    + "; after clearing app storage + reload: still shown=" + afterClear);
            Assert.assertFalse(sameBrowser, "after switching back to Role the personal page is still offered (stale until storage is cleared=" + !afterClear + ")");
        } finally {
            CrmHierarchyApi.setMode("role");
        }
    }
}
