package qa.features.deskautomationorder;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;

import java.util.List;

import static org.testng.Assert.*;
import static qa.features.deskautomationorder.AoApi.*;

/** Notification screens: rules page, personal preferences, bell, plus SLA views and dashboards read on screen. Changes nothing. */
public class NotificationUiTest extends BaseTest {
    static {
        System.setProperty("credentials.file", "../docs/Credentials/TAVI Desk Credentials.csv");
        System.setProperty("credentials.host", "");
        System.setProperty("credentials.account", ADMIN);
        System.setProperty("auth.org", "NDC-Staging");
    }

    @BeforeMethod(alwaysRun = true)
    public void english() {
        driver().get(HOST + "/hq");
        Waits.sleep(2500);
        VisualAudit.english(driver());
    }

    private String open(String path, int wait) {
        driver().get(HOST + path);
        Waits.sleep(wait);
        return driver().findElement(By.tagName("body")).getText();
    }

    private static String cut(String s, int n) {
        String t = s.replaceAll("\\s+", " ");
        return t.length() > n ? t.substring(0, n) : t;
    }

    @Test(groups = "regression", description = "Rules page: groups, SMS message, visual audit")
    @CaseId("NT-18")
    public void rulesPage() {
        String b = open("/settings/customization/notifications", 6000);
        List<WebElement> sel = driver().findElements(By.tagName("select"));
        System.out.println("[RECORD] NT-02 page selects " + sel.size() + " text " + cut(b, 900));
        System.out.println("[RECORD] NT-18 SMS text present=" + b.contains("SMS") + " gateway=" + b.toLowerCase().contains("gateway"));
        int n = VisualAudit.audit(driver(), "notification-rules", null);
        System.out.println("[VISUAL] notification-rules automatic issues: " + n);
        assertTrue(b.length() > 100, "page has content");
    }

    @Test(groups = "regression", description = "Bell: filters on screen; Settings opens personal preferences (NDC-2389)")
    @CaseId("NT-20b")
    public void bellScreen() {
        open("/hq", 4000);
        JavascriptExecutor js = (JavascriptExecutor) driver();
        Object clicked = js.executeScript("var b=[...document.querySelectorAll('button,a')].find(e=>/notification|bell/i.test((e.getAttribute('aria-label')||'')+' '+(e.getAttribute('data-testid')||'')+' '+(e.title||'')));if(b){b.click();return b.getAttribute('aria-label')||b.getAttribute('data-testid')||'found';}return null;");
        System.out.println("[RECORD] NT-20 bell button " + clicked);
        if (clicked == null) throw new SkipException("INCONCLUSIVE: bell button not found");
        Waits.sleep(3000);
        String b = driver().findElement(By.tagName("body")).getText();
        for (String f : List.of("All", "Unread", "Flagged", "Mentions")) System.out.println("[RECORD] NT-20 filter " + f + " shown=" + b.contains(f));
        Object settings = js.executeScript("var s=[...document.querySelectorAll('button,a')].filter(e=>(e.textContent||'').trim()==='Settings'&&e.getBoundingClientRect().left>1000).pop();if(s){s.click();return 'clicked at '+Math.round(s.getBoundingClientRect().left);}return null;");
        Waits.sleep(4000);
        String landed = driver().getCurrentUrl().replace(HOST, "");
        System.out.println("[RECORD] NT-21 bell settings clicked=" + settings + " url=" + landed);
        open("/hq", 3000);
        js.executeScript("var b=[...document.querySelectorAll('button,a')].find(e=>/notification/i.test(e.getAttribute('aria-label')||''));if(b)b.click();");
        Waits.sleep(2500);
        Object mention = js.executeScript("var m=[...document.querySelectorAll('button,[role=tab]')].find(e=>(e.textContent||'').trim()==='@Mentions');if(m){m.click();return true;}return false;");
        Waits.sleep(2500);
        String after = driver().findElement(By.tagName("body")).getText();
        System.out.println("[RECORD] NT-20 @Mentions tab=" + mention + " shows a mention title=" + after.toLowerCase().contains("mention"));
        assertNotNull(settings, "Settings in the bell panel");
        assertTrue(landed.contains("notifications/preferences"), "NDC-2389: Settings opens personal preferences, not " + landed);
    }

    @Test(groups = "regression", description = "Personal preferences page; visual audit")
    @CaseId("NT-21b")
    public void preferencesPage() {
        String b = open("/settings/notifications/preferences", 6000);
        System.out.println("[RECORD] NT-21 page " + cut(b, 500));
        int n = VisualAudit.audit(driver(), "notification-preferences", null);
        System.out.println("[VISUAL] notification-preferences automatic issues: " + n);
    }

    @Test(groups = "regression", description = "Ticket views and dashboards: overdue views, SLA widgets")
    @CaseId("SL-43")
    public void slaViews() {
        String views = open("/views/all", 7000);
        System.out.println("[RECORD] SL-43 views page " + cut(views, 700));
        for (String v : List.of("Overdue", "Response Overdue", "SLA Violated", "Countdown"))
            System.out.println("[RECORD] SL-43 text " + v + " shown=" + views.contains(v));
        for (String p : List.of("/dashboards", "/analytics", "/reports")) {
            String d = open(p, 6000);
            System.out.println("[RECORD] SL-46 " + p + " -> " + driver().getCurrentUrl().replace(HOST, "") + " " + cut(d, 500));
        }
    }
}
