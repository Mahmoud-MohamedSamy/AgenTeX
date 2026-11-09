package qa.features.crmaccess;

import org.testng.Assert;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.features.crmaccess.pages.AccessScreensPage;

import java.util.LinkedHashMap;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.fact;

/**
 * Round 2 Wave 1: a user without the admin permissions (run with -Dcredentials.account=<that user>, e.g. the
 * Supervisor) opens each access-and-security admin page by its address. Expected: the app's normal "no access" page
 * or a redirect, never a raw server message such as "Missing required permission '…'". Read-only.
 */
public class R2W1RestrictedScreensUiTest extends BaseTest {

    @CaseId({"R2-PE06", "R2-LH07"})
    @Test(groups = {"crmaccess", "r2w1", "ui", "NDC-2657"}, description = "Admin pages opened by URL show a normal no-access page, not raw permission text")
    public void adminPagesByUrl() {
        String who = qa.core.config.Config.get("credentials.account", "");
        String perms = qa.features.crmautomationorder.CrmUser.as(who).get("/iam/me/permissions").asString();
        Map<String, Boolean> held = new LinkedHashMap<>();
        for (String k : new String[]{"iam.profile.manage", "iam.user.view", "iam.security.loginhistory.view_all", "iam.security.loginhistory.view_self", "iam.tenant.admin", "audit.view_all"}) held.put(k, perms.contains(k));
        fact("R2-PE06 perms", who + " holds " + held);
        Map<String, String> seen = new LinkedHashMap<>();
        boolean raw = false;
        for (String path : new String[]{"/settings/security/permissions", "/settings/security/profiles", "/settings/security/policies",
                "/settings/security/login-history", "/settings/security/org-units", "/settings/security/audit-log", "/settings/general/users"}) {
            AccessScreensPage p = new AccessScreensPage().open(path, "Settings", 40);
            for (int w = 0; w < 40 && p.text().contains("Loading"); w++) Waits.sleep(500);   // the profile list loads late: reading at 4 s missed the message (27 Oct)
            Waits.sleep(3000);
            String t = p.text();
            boolean rawText = t.contains("Missing required permission");
            raw |= rawText;
            String state = rawText ? "RAW permission text" : t.matches("(?s).*(don't have access|do not have access|Access denied|not allowed|No access).*") ? "no-access page"
                    : p.url().contains(path) ? "page opened (" + t.replaceAll("\\s+", " ").substring(0, Math.min(80, t.length())) + ")" : "redirected to " + p.url();
            seen.put(path, state);
        }
        AccessScreensPage home = new AccessScreensPage().open("/settings", "Settings", 40);
        Waits.sleep(3000);
        String menu = home.text();
        Map<String, Boolean> links = new LinkedHashMap<>();
        for (String l : new String[]{"Login History", "Profiles", "Permissions", "Security Policies", "Org Units", "Audit Log", "Users"}) links.put(l, menu.contains(l));
        fact("R2-PE06", "by URL: " + seen);
        fact("R2-LH07", "Setup menu links shown: " + links);
        Assert.assertFalse(raw, "an admin page shows raw permission text: " + seen);
    }

    @CaseId("R2-HP-B5")
    @Test(groups = {"crmaccess", "r2w1", "ui", "NDC-2415"}, description = "Hierarchy Preference change history shows who made each change (read-only)")
    public void hierarchyHistoryShowsWho() {
        String who = qa.core.config.Config.get("credentials.account", "");
        String api = qa.features.crmautomationorder.CrmUser.as(who).get(qa.features.crmhierarchy.CrmHierarchyFeature.HISTORY).asString();
        AccessScreensPage p = new AccessScreensPage().open(qa.features.crmhierarchy.CrmHierarchyFeature.PAGE, "Hierarchy", 40);
        Waits.sleep(4000);
        String t = p.text();
        boolean namesAdminB = t.contains("mahmoud.mahamed1515") || t.contains("Mahmoud");
        fact("R2-HP-B5", "history API names changed_by=" + api.contains("changed_by") + "; screen history text: " + t.replaceAll("\s+", " ").replaceAll(".*(?i)(history|changes)", "$1").substring(0, 0) + (t.length() > 0 ? t.replaceAll("\s+", " ").substring(Math.max(0, t.replaceAll("\s+", " ").toLowerCase().indexOf("history")), Math.min(t.replaceAll("\s+", " ").length(), Math.max(0, t.replaceAll("\s+", " ").toLowerCase().indexOf("history")) + 400)) : "") + "; names a user=" + namesAdminB);
        Assert.assertTrue(namesAdminB, "the change history on the screen does not say who made the change");
    }
}
