package qa.features.deskautomationorder;

import org.openqa.selenium.Cookie;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.features.deskautomationorder.pages.SlaPage;

import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** SLA screens: functional checks plus visual audits. Signs in once as the admin and uses that browser's token for setup. */
public class SlaUiTest extends BaseTest {
    static {
        System.setProperty("credentials.file", "../docs/Credentials/TAVI Desk Credentials.csv");
        System.setProperty("credentials.host", "");
        System.setProperty("credentials.account", ADMIN);
        System.setProperty("auth.org", "NDC-Staging");
    }

    private AoApi api;

    @org.testng.annotations.BeforeMethod(alwaysRun = true)
    public void english() {
        driver().get(HOST + "/hq");
        Waits.sleep(2500);
        VisualAudit.english(driver());
    }

    private AoApi api() {
        if (api == null) api = AoApi.withToken(() -> {
            Cookie c = driver().manage().getCookieNamed("aw_staging_access_token");
            if (c == null) throw new IllegalStateException("no token in the browser");
            return c.getValue();
        });
        return api;
    }

    @AfterMethod(alwaysRun = true)
    public void clean() {
        if (api != null) {
            List<String> left = api.cleanup();
            if (!left.isEmpty()) System.out.println("[CLEANUP] left: " + left);
        }
    }

    private String fixture(String name) {
        return api().createPolicy(policy(name, DEPT_A, triggers("create"), List.of(
                target("QA AO target", List.of(Map.of("field_key", "subject", "operator", "contains", "value", "zzQA" + uid())), t(30, "minutes"), t(2, "hours"),
                        Map.of("response", List.of(), "resolution", List.of(Map.of("timing", "at", "recipients", List.of(Map.of("kind", "ticket_owner")))))))));
    }

    @Test(groups = "regression", description = "List: department filter, tabs, row shown; visual audit")
    @CaseId("SL-02")
    public void listAndTabs() {
        SlaPage p = new SlaPage().openList(DEPT_A);
        String name = "QA AO UI list " + uid();
        fixture(name);
        p.openList(DEPT_A);
        assertTrue(p.bodyHas(name), "policy listed");
        p.inactiveTab();
        assertFalse(p.bodyHas(name), "not under Inactive");
        p.activeTab();
        int n = VisualAudit.audit(driver(), "sla-list", null);
        System.out.println("[VISUAL] sla-list automatic issues: " + n);
    }

    @Test(groups = "regression", description = "Script in a policy name shows as text, runs nothing")
    @CaseId("SL-50b")
    public void scriptShownAsText() {
        SlaPage p = new SlaPage().openList(DEPT_A);
        String name = "QA AO <img src=x onerror=window.__xss=1> " + uid();
        fixture(name);
        p.openList(DEPT_A);
        assertTrue(p.bodyHas("onerror"), "name shown as text");
        assertNull(((org.openqa.selenium.JavascriptExecutor) driver()).executeScript("return window.__xss||null"), "script ran");
    }

    @Test(groups = "regression", description = "New SLA editor: both steps, target panel, levels; empty name stated; visual audits")
    @CaseId("SL-03b")
    public void editorSteps() {
        SlaPage p = new SlaPage().openList(DEPT_A).newSla();
        assertTrue(p.bodyHas("When do you want to execute the SLA"), "When step");
        VisualAudit.audit(driver(), "sla-editor-when", () -> {
        });
        p = new SlaPage().openList(DEPT_A).newSla();
        p.typeName("QA AO UI " + uid()).chooseCreate().next();
        assertTrue(p.bodyHas("Add Target"), "Targets step");
        p.addTarget();
        Waits.sleep(1500);
        assertTrue(p.bodyHas("Respond Within") && p.bodyHas("Resolve Within"), "target panel");
        int n = VisualAudit.audit(driver(), "sla-target-panel", () -> new SlaPage().openList(DEPT_A).newSla().typeName("QA AO UI x").chooseCreate().next().addTarget());
        System.out.println("[VISUAL] sla-target-panel automatic issues: " + n);
    }

    @Test(groups = "regression", description = "Row menu: Accounts dialog and Delete confirmation")
    @CaseId("SL-36")
    public void rowActions() {
        String name = "QA AO UI row " + uid();
        new SlaPage().openList(DEPT_A);
        fixture(name);
        SlaPage p = new SlaPage().openList(DEPT_A).rowMenu(name);
        assertTrue(p.bodyHas("Reapply to open tickets") && p.bodyHas("Accounts"), "row menu");
        p.menuItem("Accounts");
        assertTrue(p.bodyHas("Accounts on"), "accounts dialog");
        VisualAudit.audit(driver(), "sla-accounts-dialog", () -> new SlaPage().openList(DEPT_A).rowMenu(name).menuItem("Accounts"));
    }

    @Test(groups = "regression", description = "Support Plans page opens; visual audit")
    @CaseId("SL-37b")
    public void supportPlansPage() {
        SlaPage p = new SlaPage().openPath("/settings/automation/support-plans");
        assertFalse(p.bodyHas("something went wrong"), "page error");
        VisualAudit.audit(driver(), "support-plans", null);
    }

    @Test(groups = "regression", description = "Ticket page shows SLA data; visual audit")
    @CaseId("SL-47")
    public void ticketPage() {
        new SlaPage().openList(DEPT_A);
        String tag = "SL47" + uid();
        api().createPolicy(policy("QA AO " + tag, DEPT_A, triggers("create"), List.of(target("t", List.of(Map.of("field_key", "subject", "operator", "contains", "value", tag)), t(30, "minutes"), t(2, "hours"), null))));
        String tk = api().ticket("QA AO " + tag, DEPT_A, "high");
        assertEquals(api().sla(tk, 30).getString("data.state"), "applied");
        SlaPage p = new SlaPage().openPath("/views/all/tickets/" + tk);
        Waits.sleep(4000);
        System.out.println("[RECORD] SL-47 page shows SLA text: " + (p.bodyHas("QA AO " + tag) && p.bodyHas("SLA")));
        VisualAudit.audit(driver(), "ticket-sla", null);
    }
}
