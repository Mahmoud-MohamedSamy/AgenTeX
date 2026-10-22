package qa.features.crmhierarchy;

import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.features.crmhierarchy.pages.HierarchyPreferencePage;
import qa.features.crmhierarchy.pages.PersonalHierarchyPage;
import qa.features.crmhierarchy.pages.UsersPage;

import java.util.List;
import java.util.Map;

import static qa.features.crmhierarchy.CrmHierarchyApi.*;
import static qa.features.crmhierarchy.CrmHierarchyFeature.*;
import static qa.features.crmhierarchy.pages.HierarchyPreferencePage.REPORTING;
import static qa.features.crmhierarchy.pages.HierarchyPreferencePage.ROLE;

/**
 * Screen rows of groups A, B, C, D, F, G as the owner (browser account ndc-staging-owner). Switching rows change the
 * tenant-wide mode and set it back in finally; @AfterClass diffs against the snapshot.
 * Run: -Dtest=HierarchyUiTest -Dbase.url=https://staging-crm.taviportal.com with the CRM credentials flags.
 */
public class HierarchyUiTest extends BaseTest {
    private Snapshot baseline;

    @BeforeClass(alwaysRun = true)
    public void start() {
        baseline = snapshot();
        if (!"role".equals(baseline.mode())) setMode("role");
    }

    @AfterClass(alwaysRun = true)
    public void end() {
        if (baseline == null) return;
        restore(baseline);
        List<String> d = diff(baseline, snapshot());
        fact("revert-ui", d.isEmpty() ? "restored: no difference from the baseline" : "DIFFERENCES: " + d);
        Assert.assertTrue(d.isEmpty(), "not restored: " + d);
    }

    @CaseId({"A1", "A2", "B1", "B2", "B4"})
    @Test(groups = {"crmhierarchy", "ui", "smoke", "regression"}, priority = 1, description = "The tab shows both modes, the saved mode, the texts and the live preview")
    @ZohoRef(value = "zoho/zoho-hier-pref.png", note = "Zoho CRM: Hierarchy Preference with Role / Reporting Hierarchy")
    public void tabRenders() {
        HierarchyPreferencePage p = new HierarchyPreferencePage().open();
        String t = p.text();
        String[] texts = {"Hierarchy Preference", "Choose how visibility flows across your organisation.", "Hierarchy mode",
                "Role-based", "Visibility follows the profile rank hierarchy.", "Reporting-based", "Visibility follows the reporting-manager chain.",
                "Switching changes how visibility flows. Existing manager and role assignments still apply."};
        StringBuilder missing = new StringBuilder();
        for (String s : texts) if (!t.contains(s)) missing.append("'").append(s).append("' ");
        boolean roleOn = p.isSelected(ROLE), repOn = p.isSelected(REPORTING);
        boolean preview = t.contains("A Manager sees every User in the tenant") || t.contains("Live preview");
        boolean rawKeys = t.contains("companySettings.hierarchy.");
        fact("A1/B1/B2/B4", "texts missing: " + (missing.length() == 0 ? "none" : missing) + "; Role checked=" + roleOn + ", Reporting checked=" + repOn
                + "; preview text on page=" + preview + "; raw keys=" + rawKeys + "; saved mode line=" + t.contains("Your saved mode"));
        Assert.assertEquals(missing.length(), 0, "missing texts: " + missing);
        Assert.assertTrue(roleOn && !repOn, "the saved mode (role) is not the checked card");
        Assert.assertFalse(rawKeys, "raw translation keys on the page");
    }

    @CaseId({"B5", "D2"})
    @Test(groups = {"crmhierarchy", "ui", "regression", "HP-BUG-04"}, priority = 2, description = "Change history shows who changed the mode")
    public void historyShowsWho() {
        HierarchyPreferencePage p = new HierarchyPreferencePage().open();
        String t = p.text();
        List<Map<String, Object>> h = history();
        String by = h.isEmpty() ? null : String.valueOf(h.get(0).get("changed_by"));
        String name = by == null ? null : users().stream().filter(u -> by.equals(u.get("userId"))).map(u -> String.valueOf(u.get("displayName"))).findFirst().orElse(by);
        boolean section = t.contains("Change history") || t.contains("History");
        boolean who = name != null && t.contains(name);
        fact("B5/D2", "history section=" + section + "; newest change by '" + name + "' shown on page=" + who);
        Assert.assertTrue(section, "no change history on the tab");
        Assert.assertTrue(who, "change history does not show who changed the mode (" + name + "); the API has changed_by");
    }

    @CaseId({"C1", "C7"})
    @Test(groups = {"crmhierarchy", "ui", "smoke", "regression"}, priority = 3, description = "Cancel keeps the mode; clicking the active card does nothing")
    public void cancelKeepsMode() {
        int v0 = version();
        HierarchyPreferencePage p = new HierarchyPreferencePage().open();
        p.pick(ROLE);
        boolean dialogOnActive = p.dialogShown(3);
        if (dialogOnActive) p.cancel();
        p.pick(REPORTING);
        Assert.assertTrue(p.dialogShown(10), "no confirm dialog when picking Reporting-based");
        String dt = p.dialogText();
        p.cancel();
        boolean stillRole = p.isSelected(ROLE);
        fact("C1/C7", "dialog text ok=" + dt.contains("Switch hierarchy mode?") + "; after Cancel Role checked=" + stillRole + ", mode " + mode()
                + ", version unchanged=" + (version() == v0) + "; dialog on the active card=" + dialogOnActive);
        Assert.assertTrue(stillRole);
        Assert.assertEquals(mode(), "role");
        Assert.assertEquals(version(), v0, "Cancel changed the version");
        Assert.assertFalse(dialogOnActive, "the active card opened the switch dialog");
    }

    @CaseId({"C3", "C4", "C5", "G2", "C6", "G1", "D1"})
    @Test(groups = {"crmhierarchy", "ui", "smoke", "regression"}, priority = 4, description = "Switch to Reporting and back through the UI; the personal page follows the mode")
    public void switchBothWays() {
        int v0 = version();
        int h0 = history().size();
        try {
            HierarchyPreferencePage p = new HierarchyPreferencePage().open();
            String afterSwitch = p.switchTo(REPORTING);
            boolean toast = afterSwitch.contains("Hierarchy preference updated");
            String apiMode = mode();
            p = new HierarchyPreferencePage().open();
            boolean persisted = p.isSelected(REPORTING);
            PersonalHierarchyPage me = new PersonalHierarchyPage();
            boolean personalInReporting = me.open();
            String placeholder = personalInReporting ? me.managerPlaceholder() : null;
            fact("C3/C4/C5/G2", "toast=" + toast + "; API mode " + apiMode + " v" + version() + " (was v" + v0 + "); after reload Reporting checked=" + persisted
                    + "; personal page shown=" + personalInReporting + " placeholder='" + placeholder + "'");
            Assert.assertTrue(toast, "no 'Hierarchy preference updated' toast");
            Assert.assertEquals(apiMode, "reporting");
            Assert.assertTrue(persisted, "Reporting not checked after reload");
            Assert.assertTrue(personalInReporting, "Personal Reporting Hierarchy page not available in Reporting mode");

            p = new HierarchyPreferencePage().open();
            String back = p.switchTo(ROLE);
            boolean toast2 = back.contains("Hierarchy preference updated");
            boolean personalInRole = new PersonalHierarchyPage().open();
            int h1 = history().size();
            fact("C6/G1/D1", "back to role: toast=" + toast2 + ", API mode " + mode() + "; personal page shown in Role mode=" + personalInRole
                    + "; history rows " + h0 + " -> " + h1 + " (limit 10)");
            Assert.assertEquals(mode(), "role");
            Assert.assertFalse(personalInRole, "the personal page is still available in Role mode");
        } finally {
            setMode("role");
        }
    }

    @CaseId({"F1", "F2", "Z7"})
    @Test(groups = {"crmhierarchy", "ui", "regression"}, priority = 5, description = "Users modal: Reporting manager select lists every user except self")
    public void managerSelectOptions() {
        UsersPage u = new UsersPage().open();
        int rows = u.rowCount();
        u.openUser(N_DISPLAY);
        List<String> opts = u.managerOptions();
        String selected = u.selectedManager();
        int apiUsers = users().size();
        boolean self = opts.stream().anyMatch(o -> o.contains(USER_N));
        fact("F1/F2/Z7", "list rows=" + rows + ", API users=" + apiUsers + "; select options=" + opts.size() + " (first '" + opts.get(0) + "'), selected '" + selected
                + "', self listed=" + self + "; options are not limited to higher roles (Z7)");
        Assert.assertEquals(opts.get(0), "No manager (clear)");
        Assert.assertFalse(self, "the user is offered as their own manager");
        // GET /iam/users also returns Desk-only users; the list and the select show CRM users only (9 = 8 others + "No manager")
        Assert.assertEquals(opts.size(), rows, "options should be every other CRM user in the list + 'No manager'");
    }
}
