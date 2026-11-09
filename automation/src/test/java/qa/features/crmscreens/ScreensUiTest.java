package qa.features.crmscreens;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmscreens.CrmScreensFeature.*;

/**
 * Screens of the lane as a test user (28 Oct 2026; run with -Dcredentials.account=<test user> -Dauth.memoryOnly=true so no
 * session is written to disk): G06 shortcuts, G05 Arabic / RTL (header language switch, switched back at the end of each test),
 * G09 page load to first content (3 runs, target 2 s), S01 work queue table controls, R16 attachments panel.
 * Nothing is saved on these screens except one PDF attached to the class's own QA lead.
 */
public class ScreensUiTest extends BaseTest {
    private final List<String> leads = new ArrayList<>();
    private String lead;

    /** The UI user's own QA lead, made through the app's API in the signed-in browser (run 1: a lead made by CRM Admin B
     *  is not visible to test user 2 - 403 / "Record not found"). */
    private String uiLead() {
        if (lead != null) return lead;
        String name = QA + "UI " + tag();
        Object id = ((JavascriptExecutor) d()).executeAsyncScript(
                "const done = arguments[arguments.length - 1]; const tok = decodeURIComponent((document.cookie.match(/aw_staging_access_token=([^;]+)/) || [, ''])[1]);"
                + "const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });"
                + "fetch('/api/v1/modules/" + LEADS + "/records', { method: 'POST', headers: { 'content-type': 'application/json', 'x-tenant-id': localStorage.getItem('aw_auth_tenant_id') || '" + qa.features.crmautomationorder.CrmOrderFeature.TENANT + "', 'x-app-key': 'crm', Authorization: 'Bearer ' + tok },"
                + " body: JSON.stringify({ layout_id: '" + LEADS_LAYOUT + "', data: [s('name', arguments[0]), s('first_name', arguments[0]), s('phone', '01055500011'), s('single_line_3_9', 'QA R2SC')] }) })"
                + ".then(r => r.json()).then(j => done(j.data && j.data.id)).catch(e => done(null));", name);
        lead = id == null ? null : id.toString();
        if (lead != null) leads.add(lead);
        return lead;
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        // the UI user's lead: deleted and purged by CRM Admin B (bin purge works across owners)
        removeLeads(api(), leads);
    }

    private WebDriver d() {
        return driver();
    }

    private Object js(String script, Object... args) {
        return ((JavascriptExecutor) d()).executeScript(script, args);
    }

    private String text(String css) {
        Object o = js("const e = document.querySelector(arguments[0]); return e ? e.innerText : '';", css);
        return o == null ? "" : o.toString();
    }

    private void go(String path) {
        d().get(BASE + path);
        Waits.pageReady(d());
    }

    private boolean waitJs(String predicate, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            if (Boolean.TRUE.equals(js("try { return !!(" + predicate + "); } catch (e) { return false; }"))) return true;
            Waits.sleep(100);
        }
        return false;
    }

    private void keys(CharSequence... k) {
        new Actions(d()).sendKeys(k).perform();
        Waits.sleep(800);
    }

    private void chord(Keys mod, String key) {
        new Actions(d()).keyDown(mod).sendKeys(key).keyUp(mod).perform();
        Waits.sleep(800);
    }

    private String dialogs() {
        Object o = js("return [...document.querySelectorAll('[role=dialog]')].map(e => e.innerText).join(' | ');");
        return o == null ? "" : o.toString().replaceAll("\\s+", " ");
    }

    private void home() {
        go("/");
        waitJs("/My Tasks|مهامي/.test(document.body.innerText)", 60);
        Waits.sleep(1500);
        d().findElement(By.tagName("body")).click();
    }

    private void setLanguage(String code) {
        WebElement b = d().findElement(By.xpath("//header//button[normalize-space(.)='EN' or normalize-space(.)='AR' or contains(.,'EN') or contains(.,'AR')]"));
        b.click();
        Waits.sleep(800);
        d().findElement(By.xpath("//*[normalize-space(text())='" + ("ar".equals(code) ? "العربية" : "English") + "']")).click();
        waitJs("document.documentElement.lang === '" + code + "'", 15);
        Waits.sleep(1500);
    }

    // ---------------- G06 shortcuts ----------------

    @CaseId("SC-01")
    @Test(groups = {"crmscreens", "g06", "ui"}, description = "'?' shows the shortcut help (Ctrl K, Ctrl \\, ?); Esc closes it; ignored while typing in a field")
    public void helpShortcut() {
        home();
        keys("?");
        String help = dialogs();
        keys(Keys.ESCAPE);
        boolean closed = dialogs().isEmpty();
        d().findElement(By.cssSelector("header input, input[placeholder*='Search']")).click();
        keys("?");
        boolean whileTyping = !dialogs().isEmpty();
        keys(Keys.ESCAPE);
        fact("SC-01", "help: " + help + "; Esc closes " + closed + "; opens while typing " + whileTyping);
        Assert.assertTrue(help.contains("Ctrl") && help.contains("K") && help.contains("?"), "shortcut help not shown");
        Assert.assertTrue(closed);
        Assert.assertFalse(whileTyping, "'?' typed in a field opened the help");
    }

    @CaseId("SC-02")
    @Test(groups = {"crmscreens", "g06", "ui"}, description = "Ctrl+K opens the command menu (go to / create / modules / records); Enter on 'Reports' navigates; Ctrl+K again closes")
    public void commandMenu() {
        home();
        chord(Keys.CONTROL, "k");
        String menu = dialogs();
        chord(Keys.CONTROL, "k");
        boolean toggledClosed = dialogs().isEmpty();
        chord(Keys.CONTROL, "k");
        keys("Reports");
        Waits.sleep(1200);
        keys(Keys.ENTER);
        Waits.sleep(2500);
        String url = d().getCurrentUrl();
        fact("SC-02", "menu groups: " + menu.substring(0, Math.min(200, menu.length())) + "; Ctrl+K toggles closed " + toggledClosed + "; Enter -> " + url.replace(BASE, ""));
        Assert.assertTrue(menu.contains("GO TO") || menu.contains("Go to"), "command menu did not open");
        Assert.assertTrue(toggledClosed);
        Assert.assertTrue(url.endsWith("/reports"), "Enter on 'Reports' did not open Reports");
    }

    @CaseId("SC-03")
    @Test(groups = {"crmscreens", "g06", "ui"}, description = "Ctrl+\\ collapses and expands the sidebar")
    public void sidebarShortcut() {
        home();
        String w = "Math.round((document.querySelector('aside') || document.body).getBoundingClientRect().width)";
        long w0 = ((Number) js("return " + w)).longValue();
        chord(Keys.CONTROL, "\\");
        long w1 = ((Number) js("return " + w)).longValue();
        chord(Keys.CONTROL, "\\");
        long w2 = ((Number) js("return " + w)).longValue();
        fact("SC-03", "sidebar width " + w0 + " -> " + w1 + " -> " + w2);
        Assert.assertTrue(w1 < w0 && w2 == w0, "Ctrl+\\ did not toggle the sidebar");
    }

    @CaseId("SC-04")
    @Test(groups = {"crmscreens", "g06", "ui", "gap"}, description = "'/' on Home: what gets focus (Zoho, 28 Oct: nothing on the Leads list, an input on Home) - fact only")
    public void slashFocusesSearch() {
        home();
        keys("/");
        String active = String.valueOf(js("const a = document.activeElement; return a ? a.tagName + ' ' + (a.placeholder || a.getAttribute('aria-label') || '') : '';"));
        fact("SC-04", "after '/': active element " + active);
        // no assertion: Zoho has no documented global shortcut list to compare with (checked live 28 Oct 2026)
    }

    // ---------------- G05 Arabic ----------------

    @CaseId("AR-01")
    @Test(groups = {"crmscreens", "g05", "ui", "NDC-2130", "NDC-2131"}, description = "Arabic: page is RTL, sidebar on the right, list count and sort label translated")
    public void arabicMirroring() {
        home();
        setLanguage("ar");
        try {
            boolean rtl = "rtl".equals(js("return document.documentElement.dir"));
            boolean navRight = Boolean.TRUE.equals(js("const a = document.querySelector('aside'); return a && a.getBoundingClientRect().left > innerWidth / 2;"));
            go("/modules/" + DEALS);
            waitJs("/[\u0660-\u0669]+\s*سجل/.test(document.body.innerText)", 90);
            String main = text("main");
            boolean countAr = main.matches("(?s).*[\\u0660-\\u0669]+ سجل.*");
            fact("AR-01", "rtl " + rtl + "; sidebar right " + navRight + "; Arabic record count " + countAr);
            Assert.assertTrue(rtl && navRight, "page not mirrored");
            Assert.assertTrue(countAr, "record count not in Arabic (NDC-2130)");
        } finally {
            setLanguage("en");
        }
    }

    @CaseId("AR-02")
    @Test(groups = {"crmscreens", "g05", "ui", "R2SC-B3"}, description = "Arabic: no English UI words on Home (My Meetings columns) and Work Queue (activity list)")
    public void arabicUntranslated() {
        home();
        setLanguage("ar");
        List<String> found = new ArrayList<>();
        try {
            home();
            Object cols = js("return [...document.querySelectorAll('main th, main [role=columnheader]')].map(e => e.innerText.trim()).filter(t => /^(From|To|Subject|Status)$/.test(t));");
            if (cols instanceof List<?> l && !l.isEmpty()) found.add("Home columns " + l);
            go("/workqueue");
            waitJs("/أنشطتي المفتوحة/.test(document.body.innerText)", 60);
            Waits.sleep(2000);
            Object wq = js("return [...document.querySelectorAll('main button, main span')].map(e => e.innerText.trim()).filter(t => /^(Tasks|Calls|Meetings)$/.test(t));");
            if (wq instanceof List<?> l && !l.isEmpty()) found.add("Work Queue " + l);
            fact("AR-02", "English UI words in Arabic: " + found);
        } finally {
            setLanguage("en");
        }
        Assert.assertTrue(found.isEmpty(), "English words left in the Arabic UI: " + found);
    }

    @CaseId("AR-03")
    @Test(groups = {"crmscreens", "g05", "ui", "R2SC-B3"}, description = "Arabic: one digit style per screen (calendar day numbers vs month / year; page-size picker vs page number)")
    public void arabicDigitsConsistent() {
        home();
        setLanguage("ar");
        String mixed;
        try {
            go("/calendar");
            waitJs("/[\\u0660-\\u0669]{4}/.test(document.body.innerText)", 60);
            Waits.sleep(2000);
            mixed = String.valueOf(js("const t = (document.querySelector('main') || document.body).innerText; const lat = (t.match(/(^|\\s)\\d{1,2}(\\s|$)/g) || []).length; const ar = (t.match(/[\\u0660-\\u0669]+/g) || []).length; return lat + ' Latin / ' + ar + ' Arabic-Indic';"));
            fact("AR-03", "calendar month view: " + mixed);
        } finally {
            setLanguage("en");
        }
        Assert.assertTrue(mixed.startsWith("0 Latin") || mixed.contains("/ 0 Arabic"), "the calendar mixes Latin and Arabic-Indic digits: " + mixed);
    }

    // ---------------- G09 page load ----------------

    @CaseId("PF-UI")
    @Test(groups = {"crmscreens", "g09", "ui", "perf", "NDC-2136"}, description = "Page load to first content, 3 runs per screen; target 2 s (median); Leads list target 1.5 s (NDC-2136)")
    public void screenTimings() {
        Map<String, String[]> screens = new java.util.LinkedHashMap<>();
        screens.put("Home", new String[]{"/", "/My Tasks/.test(document.body.innerText) && /Rows per page|No open tasks/.test(document.body.innerText)"});
        screens.put("Leads list", new String[]{"/modules/" + LEADS, "document.querySelectorAll('tbody tr td').length > 3"});
        screens.put("Record page", new String[]{"/modules/" + LEADS + "/records/" + uiLead(), "document.body.innerText.includes('" + QA + "UI') && /Timeline/.test(document.body.innerText)"});
        screens.put("Create form", new String[]{"/modules/" + LEADS + "/records/new", "document.querySelectorAll('main input').length > 3"});
        screens.put("Setup", new String[]{"/settings", "/Modules and Fields/.test(document.body.innerText)"});
        screens.put("Dashboards", new String[]{"/dashboards", "/No dashboards|Widgets/.test((document.querySelector('main')||document.body).innerText)"});
        screens.put("Work Queue", new String[]{"/workqueue", "/My Open Activities/.test(document.body.innerText) && /Rows per page/.test(document.body.innerText)"});
        List<String> slow = new ArrayList<>();
        StringBuilder t = new StringBuilder();
        for (Map.Entry<String, String[]> s : screens.entrySet()) {
            List<Long> runs = new ArrayList<>();
            for (int i = 0; i < 3; i++) {
                long t0 = System.currentTimeMillis();
                d().get(BASE + s.getValue()[0]);
                boolean ok = waitJs(s.getValue()[1], 60);
                runs.add(ok ? System.currentTimeMillis() - t0 : 60_000L);
                Waits.sleep(1000);
            }
            long target = s.getKey().equals("Leads list") ? 1500 : 2000;
            t.append(s.getKey()).append(" ").append(runs).append(" median ").append(median(runs)).append(" worst ").append(worst(runs)).append("; ");
            if (median(runs) > target) slow.add(s.getKey() + " " + median(runs) + " ms");
        }
        fact("PF-UI", t.toString());
        Assert.assertTrue(slow.isEmpty(), "screens over target (median of 3): " + slow);
    }

    // ---------------- S01 work queue ----------------

    @CaseId("WQ-UI")
    @Test(groups = {"crmscreens", "s01", "ui", "NDC-1819"}, description = "Work queue: date filter options, table settings, Manage Columns search; column menu has Pin / Hide like Zoho")
    public void workQueueControls() {
        go("/workqueue");
        waitJs("document.querySelectorAll(\"main button[aria-label^='Column options']\").length > 0", 90);
        Waits.sleep(2000);
        d().findElement(By.cssSelector("main button[aria-label='Which open activities to count and list']")).click();
        Waits.sleep(800);
        String dates = String.valueOf(js("return [...document.querySelectorAll('[role=option],[role=menuitem]')].map(e => e.innerText.trim()).join('|');"));
        keys(Keys.ESCAPE);
        d().findElement(By.cssSelector("main button[aria-label^='Column options']")).click();
        Waits.sleep(800);
        String colMenu = String.valueOf(js("return [...document.querySelectorAll('[role=menu],[role=menuitem]')].map(e => e.innerText.trim()).join('|');"));
        keys(Keys.ESCAPE);
        d().findElement(By.cssSelector("main button[aria-label='Table settings']")).click();
        Waits.sleep(800);
        String settings = String.valueOf(js("return [...document.querySelectorAll('[role=menu],[role=dialog]')].map(e => e.innerText).join(' ');")).replaceAll("\\s+", " ");
        keys(Keys.ESCAPE);
        fact("WQ-UI", "dates: " + dates + " || column menu: " + colMenu + " || table settings: " + settings.substring(0, Math.min(200, settings.length())));
        for (String o : List.of("Today & Overdue", "Tomorrow", "Overdue", "This week", "Next week", "This month", "Next month", "On a specific date"))
            Assert.assertTrue(dates.contains(o), "date option missing: " + o);
        Assert.assertTrue(settings.contains("Manage Columns") && settings.contains("Reset Column Size") && settings.contains("Wrap Text"), "table settings incomplete");
        Assert.assertTrue(colMenu.contains("Pin") && colMenu.contains("Hide"), "column menu has no Pin Column / Hide Column (Zoho has them; NDC-1819): " + colMenu);
    }

    // ---------------- R16 attachments panel ----------------

    @CaseId("AT-UI")
    @Test(groups = {"crmscreens", "r16", "ui"}, description = "Files tab: a PDF uploads ('Attachment uploaded') and is listed; an .exe is refused with the allowed-types message")
    public void attachmentsPanel() throws Exception {
        go("/modules/" + LEADS + "/records/" + uiLead());
        waitJs("document.body.innerText.includes('" + QA + "UI') && /Files/.test(document.body.innerText)", 90);
        d().findElement(By.xpath("//main//*[(self::button or @role='tab') and normalize-space(.)='Files']")).click();
        Waits.sleep(3000);
        List<WebElement> inputs = d().findElements(By.cssSelector("main input[type=file]"));
        WebElement input = inputs.stream().filter(e -> e.getAttribute("accept") == null || !e.getAttribute("accept").startsWith("image/png")).findFirst().orElseThrow();
        java.nio.file.Path dir = java.nio.file.Files.createTempDirectory("qa-r2sc");
        java.nio.file.Path pdf = java.nio.file.Files.writeString(dir.resolve("qa-r2sc-ui.pdf"), "%PDF-1.4 QA R2SC ui");
        java.nio.file.Path exe = java.nio.file.Files.writeString(dir.resolve("qa-r2sc-ui.exe"), "MZ");
        input.sendKeys(pdf.toString());
        boolean listed = waitJs("document.querySelector('main').innerText.includes('qa-r2sc-ui.pdf')", 120);
        input.sendKeys(exe.toString());
        boolean refused = waitJs("/isn't an allowed file type/.test(document.body.innerText)", 20);
        fact("AT-UI", "pdf listed " + listed + "; exe refusal message " + refused);
        Assert.assertTrue(listed, "uploaded PDF not listed");
        Assert.assertTrue(refused, "no refusal message for .exe");
    }
}
