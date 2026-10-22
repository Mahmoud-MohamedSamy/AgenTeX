package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.DeskRecordPage;
import qa.features.crmdeskintegration.pages.IntegrationSettingsPage;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.CrmDeskFeature.CRM;
import static qa.features.crmdeskintegration.CrmDeskFeature.DESK;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * Remaining screen rows (user: "run the remaining 45 rows", 21 Oct 2026). Settings edits are made on screen and either
 * closed without saving or restored from the baseline at once; the owner's language goes back to English.
 * Screenshots: target/evidence/remaining/.
 */
public class RemainingUiTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/remaining");
    static Map<String, Object> baseline;

    static AppUser.App desk() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    Map<String, Object> config() {
        return AppUser.ok(desk().get(INT + "/config"), "config").jsonPath().getMap("data");
    }

    void restore(String why) {
        if (baseline == null) return;
        Map<String, Object> b = new LinkedHashMap<>(baseline);
        b.remove("status");
        b.put("row_version", config().get("row_version"));
        fact("RESTORE", why + " -> " + desk().putOnce(INT + "/config", b).statusCode());
    }

    String body() {
        return driver().findElement(By.tagName("body")).getText();
    }

    DeskRecordPage page() {
        return new DeskRecordPage();
    }

    void shot(String name) {
        page().shot(OUT.resolve(name + ".png"));
    }

    static String clip(String s, int n) {
        s = s == null ? "null" : s.replaceAll("\\s+", " ");
        return s.length() > n ? s.substring(0, n) + "…" : s;
    }

    /** Clicks the first visible element whose text equals {@code text}; restricted to buttons/links/labels/options. */
    boolean click(String text) {
        for (WebElement e : driver().findElements(By.xpath("//*[self::button or self::a or self::label or @role='tab' or @role='option' or @role='menuitem' or @role='checkbox' or @role='radio'][normalize-space(.)='" + text + "']")))
            try {
                if (e.isDisplayed()) {
                    new Actions(driver()).moveToElement(e).perform();
                    e.click();
                    AppUser.sleep(1200);
                    return true;
                }
            } catch (RuntimeException ignored) {
            }
        return false;
    }

    /** Sets a select-like control found by aria-label (native select or combobox) to the option with this visible text. */
    boolean choose(String ariaLabel, String option) {
        List<WebElement> els = driver().findElements(By.xpath("//*[@aria-label='" + ariaLabel + "']"));
        for (WebElement e : els) {
            try {
                if (!e.isDisplayed()) continue;
                ((JavascriptExecutor) driver()).executeScript("arguments[0].scrollIntoView({block:'center'})", e);
                if ("select".equals(e.getTagName())) {
                    new org.openqa.selenium.support.ui.Select(e).selectByVisibleText(option);
                    AppUser.sleep(800);
                    return true;
                }
                e.click();
                AppUser.sleep(800);
                for (WebElement o : driver().findElements(By.xpath("//*[@role='option'][normalize-space(.)='" + option + "' or starts-with(normalize-space(.),'" + option + "')]")))
                    if (o.isDisplayed()) {
                        o.click();
                        AppUser.sleep(800);
                        return true;
                    }
                new Actions(driver()).sendKeys(Keys.ESCAPE).perform();
            } catch (RuntimeException ignored) {
            }
        }
        return false;
    }

    List<String> ariaLabels(String startsWith) {
        List<String> out = new ArrayList<>();
        for (WebElement e : driver().findElements(By.xpath("//*[starts-with(@aria-label,'" + startsWith + "')]"))) out.add(e.getAttribute("aria-label"));
        return out;
    }

    // ---------------- C5–C13, C18 mapping editor messages ----------------
    @CaseId({"C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13", "C18", "O7"})
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-remaining"}, description = "Mapping editor validation messages on screen; closed without saving")
    public void mappingEditorMessages() {
        baseline = config();
        String rv = String.valueOf(baseline.get("row_version"));
        IntegrationSettingsPage s = new IntegrationSettingsPage().openDesk().tab("Configuration Details");
        page().clickText("Edit");
        AppUser.sleep(2500);
        shot("C-editor-open");
        List<String> crmSel = ariaLabels("CRM field for"), dirSel = ariaLabels("Sync direction for");
        fact("O7", "mapping editor aria-labels: " + crmSel.size() + " 'CRM field for …' (e.g. " + (crmSel.isEmpty() ? "-" : crmSel.get(0)) + "), " + dirSel.size() + " 'Sync direction for …'");
        Map<String, String> res = new LinkedHashMap<>();
        // C6 duplicate CRM target: Mobile -> phone (Phone row already writes phone, two-way)
        res.put("C6 two rows write one CRM field", choose("CRM field for Mobile", "Phone") ? (body().contains("Two Desk fields write back into this CRM field.") ? "message shown" : "no message") : "control not found");
        shot("C6");
        // C7 type mismatch: Title (text) -> a number field
        res.put("C7 type mismatch", choose("CRM field for Title", "Number of Chats") ? (body().contains("The two fields hold different kinds of data.") ? "message shown" : "option offered, no message") : "number field not offered (blocked by the picker)");
        shot("C7");
        // C4 lookup offered?
        res.put("C4 lookup field", choose("CRM field for Secondary email", "Account") ? (body().contains("Lookup fields sync through the record links") ? "message shown" : "lookup selectable, no message") : "lookup not offered");
        shot("C4");
        // C13 banner on Save with errors (nothing is sent while invalid)
        String before = String.valueOf(config().get("row_version"));
        boolean saved = click("Save");
        AppUser.sleep(2500);
        String after = String.valueOf(config().get("row_version"));
        res.put("C13 save with invalid rows", (body().contains("Some mappings are invalid — fix the highlighted rows.") ? "banner shown" : "no banner") + ", Save clicked=" + saved + ", row_version " + (before.equals(after) ? "unchanged" : "CHANGED " + before + "→" + after));
        shot("C13");
        if (!before.equals(after)) restore("C13 saved invalid mapping");
        // C11 one-way flags two-way rows
        boolean oneWay = click("CRM → Desk");
        res.put("C11 one-way", oneWay ? (body().contains("Only CRM → Desk is allowed while this pair syncs one way.") ? "rows flagged" : "no message") : "radio not found");
        shot("C11");
        // C18 unsaved changes when leaving
        click("Permissions");
        AppUser.sleep(1500);
        res.put("C18 leave with unsaved changes", body().contains("You have unsaved integration changes.") ? "warning shown" : "no warning");
        shot("C18");
        res.forEach((k, v) -> fact("C", k + ": " + v));
        driver().navigate().refresh();
        AppUser.sleep(3000);
        String end = String.valueOf(config().get("row_version"));
        fact("C", "row_version at start " + rv + ", at end " + end + (rv.equals(end) ? " (nothing saved)" : " — restoring"));
        if (!rv.equals(end)) restore("C editor");
    }

    // ---------------- F2 double submit, F3/F4 stale save ----------------
    @CaseId({"F2", "F3", "F4"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-remaining"}, description = "Double Save; a stale screen saving after another admin's save gets the conflict message")
    public void saveConflict() {
        baseline = config();
        try {
            IntegrationSettingsPage s = new IntegrationSettingsPage().openDesk().tab("Configuration Details");
            boolean toggled = click("Leads");
            String rv0 = String.valueOf(config().get("row_version"));
            WebElement save = null;
            for (WebElement e : driver().findElements(By.xpath("//button[normalize-space(.)='Save']"))) if (e.isDisplayed()) save = e;
            if (save != null) {
                save.click();
                try {
                    save.click();
                } catch (RuntimeException ignored) {
                }
            }
            AppUser.sleep(3000);
            String t = body();
            shot("F2");
            fact("F2", "toggle Leads=" + toggled + "; Save clicked twice: saved message=" + t.contains("Integration settings saved.") + " conflict shown=" + t.contains("Another administrator saved") + "; row_version " + rv0 + "→" + config().get("row_version"));
            // F3: change on screen, another admin saves through the API, then save on screen
            click("Leads");
            Map<String, Object> other = config();
            other.remove("status");
            @SuppressWarnings("unchecked") Map<String, Object> n = (Map<String, Object>) other.get("notifications");
            n.put("rating", !Boolean.TRUE.equals(n.get("rating")));
            fact("F3", "other admin saves through the API -> " + desk().putOnce(INT + "/config", other).statusCode());
            save = null;
            for (WebElement e : driver().findElements(By.xpath("//button[normalize-space(.)='Save']"))) if (e.isDisplayed()) save = e;
            if (save != null) save.click();
            AppUser.sleep(3000);
            String t3 = body();
            shot("F3");
            boolean conflict = t3.contains("Another administrator saved these settings while you were editing.");
            fact("F3", "stale screen Save -> conflict message=" + conflict + " Reload offered=" + t3.contains("Reload"));
            Assert.assertTrue(conflict, "no conflict message for a stale save");
        } finally {
            restore("F2/F3");
        }
    }

    // ---------------- E11 / E12 related lists ----------------
    @CaseId({"E11", "E12"})
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-remaining"}, description = "Untick Deals: the card leaves deal pages; untick all: warning")
    public void relatedLists() {
        baseline = config();
        try {
            new IntegrationSettingsPage().openDesk().tab("Configuration Details");
            click("Contacts");
            click("Accounts");
            click("Deals");
            AppUser.sleep(1000);
            String none = body();
            shot("E12");
            fact("E12", "all unticked: message=" + none.contains("No CRM record page will show a Tickets related list."));
            driver().navigate().refresh();
            AppUser.sleep(3000);
            Map<String, Object> c = config();
            c.remove("status");
            c.put("ticket_related_lists", List.of("contacts", "accounts"));
            fact("E11", "Deals removed from related lists -> " + desk().putOnce(INT + "/config", c).statusCode());
            String dealId = null;
            for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/contracts/needs-attention")) {
                dealId = String.valueOf(l.get("crm_record_id"));
                break;
            }
            page().crmSession();
            String deal = page().visit(CRM + "/modules/" + WriteBase.CRM_DEALS + "/records/" + dealId);
            qa.core.base.Waits.until(() -> body().length() > 300 && !body().contains("Loading…"), 30);
            ((JavascriptExecutor) driver()).executeScript("window.scrollTo(0, document.body.scrollHeight)");
            AppUser.sleep(3000);
            boolean card = body().contains("Desk Tickets");
            shot("E11");
            fact("E11", "deal page with Deals unticked: Desk Tickets card shown=" + card);
            Assert.assertFalse(card, "Desk Tickets card still on the deal page after unticking Deals");
        } finally {
            restore("E11");
        }
    }

    // ---------------- I4–I6, I12, I18 pane ----------------
    @CaseId({"I4", "I5", "I6", "I12", "I18"})
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-remaining"}, description = "Pane tabs Notes / Activities, empty states, Open in CRM, load failure")
    public void paneTabs() {
        DeskRecordPage p = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
        p.showPane();
        for (String tab : List.of("Potentials", "Notes", "Activities")) {
            p.paneTab(tab);
            AppUser.sleep(2000);
            String t = p.text();
            String panel = t.contains("No deals for this customer.") ? "empty: 'No deals for this customer.'"
                    : t.contains("No open activities.") ? "empty: 'No open activities.'"
                    : t.contains("Your profile cannot open this tab.") ? "forbidden"
                    : clip(t.replaceAll("(?s).*?CRM Contact Info", "CRM Contact Info"), 220);
            fact("I4-I6", tab + " tab: " + panel + " | url=" + driver().getCurrentUrl().replaceAll(".*/(tickets/[^/?]+).*", "$1"));
            shot("I-" + tab);
        }
        p.paneTab("Info");
        String crmUrl = null;
        String before = driver().getWindowHandle();
        for (WebElement e : driver().findElements(By.xpath("//*[@aria-label='Open in CRM' or @title='Open in CRM' or normalize-space(.)='Open in CRM']")))
            try {
                if (!e.isDisplayed()) continue;
                String href = e.getAttribute("href");
                if (href != null) {
                    crmUrl = href + " (target=" + e.getAttribute("target") + ")";
                    break;
                }
                java.util.Set<String> h0 = driver().getWindowHandles();
                e.click();
                AppUser.sleep(3000);
                for (String h : driver().getWindowHandles())
                    if (!h0.contains(h)) {
                        driver().switchTo().window(h);
                        crmUrl = driver().getCurrentUrl() + " (new tab)";
                        driver().close();
                    }
                driver().switchTo().window(before);
                if (crmUrl == null) crmUrl = driver().getCurrentUrl() + " (same tab)";
                break;
            } catch (RuntimeException ex) {
                fact("I12", "click error " + ex.getMessage());
            }
        fact("I12", "Open in CRM -> " + crmUrl + " (expected CRM contact " + CrmDeskFeature.CRM_CONTACT + ")");
        try {
            org.openqa.selenium.chromium.ChromiumDriver cd = (org.openqa.selenium.chromium.ChromiumDriver) qa.core.driver.DriverManager.get();
            cd.executeCdpCommand("Network.enable", Map.of());
            cd.executeCdpCommand("Network.setBlockedURLs", Map.of("urls", List.of("*integrations/crm/context*")));
            DeskRecordPage q = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
            q.showPane();
            AppUser.sleep(4000);
            String t = body();
            shot("I18");
            fact("I18", "context calls blocked: 'Could not load this section.'=" + t.contains("Could not load this section.") + " Retry=" + t.contains("Retry"));
            cd.executeCdpCommand("Network.setBlockedURLs", Map.of("urls", List.of()));
        } catch (Exception e) {
            fact("I18", "could not block requests: " + e.getMessage());
        }
        Assert.assertTrue(crmUrl != null && crmUrl.contains(CrmDeskFeature.CRM_CONTACT), "Open in CRM does not open the linked CRM contact: " + crmUrl);
    }

    // ---------------- L6, L9/L20, L13, L14, L18, L21 CRM card ----------------
    @CaseId({"L6", "L9", "L10", "L20", "L13", "L14", "L18", "L21"})
    @Test(priority = 5, groups = {"crmdesk", "crmdesk-remaining"}, description = "CRM Desk Tickets card dialogs (all cancelled)")
    public void crmCard() {
        page().crmSession();
        qa.features.crmdeskintegration.pages.CrmRecordPage cp = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(CrmDeskFeature.CRM_CONTACT);
        fact("L", "card shown=" + cp.cardShown());
        boolean hid = click("Hide statistics");
        fact("L18", "Hide statistics clicked=" + hid);
        driver().navigate().refresh();
        AppUser.sleep(5000);
        cp.cardShown();
        fact("L18", "after reload: 'Show statistics' offered (hidden state remembered)=" + body().contains("Show statistics"));
        shot("L18");
        click("Show statistics");
        List<WebElement> boxes = new ArrayList<>();
        for (WebElement e : driver().findElements(By.xpath("//*[contains(normalize-space(.),'Desk Tickets')]/ancestor::*[.//input[@type='checkbox']][1]//input[@type='checkbox']")))
            if (e.isDisplayed()) boxes.add(e);
        int clicked = 0;
        for (WebElement b : boxes) {
            if (clicked == 2) break;
            try {
                b.click();
                clicked++;
                AppUser.sleep(400);
            } catch (RuntimeException ignored) {
            }
        }
        fact("L21", "card checkboxes " + boxes.size() + ", clicked " + clicked + "; '2 selected' shown=" + body().contains("2 selected"));
        shot("L21");
        if (click("Delete")) {
            String t = body();
            fact("L13", "delete confirm: title=" + t.matches("(?s).*Delete \\d+ ticket\\(s\\)\\?.*") + " recycle-bin note=" + t.contains("Deleted tickets move to the Desk recycle bin."));
            shot("L13");
            click("Cancel");
        } else fact("L13", "Delete not offered with the selection");
        if (click("Link to deal")) {
            String t = body();
            fact("L9/L20", "deal picker: 'Deals of this customer first'=" + t.contains("Deals of this customer first") + " empty=" + t.contains("No deals found."));
            shot("L9");
            new Actions(driver()).sendKeys(Keys.ESCAPE).perform();
            click("Cancel");
        } else fact("L9/L20", "Link to deal not offered");
        fact("L10", "'Unlink from deal' offered for the selection=" + body().contains("Unlink from deal"));
        click("Clear selection");
        fact("L21", "after Clear selection: '2 selected' still shown=" + body().contains("2 selected"));
        if (click("New ticket")) {
            AppUser.sleep(5000);
            shot("L6-form");
            boolean submit = click("Create ticket") || click("Create") || click("Submit");
            AppUser.sleep(2000);
            String t = body();
            fact("L6", "submit empty form clicked=" + submit + " 'A subject is required.'=" + t.contains("A subject is required.") + " 'Please fix'=" + t.contains("Please fix the"));
            shot("L6");
            new Actions(driver()).sendKeys(Keys.ESCAPE).perform();
            click("Cancel");
        } else fact("L6", "New ticket not offered");
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("layout_id", WriteBase.CRM_CONTACT_LAYOUT);
        b.put("data", WriteBase.data(WriteBase.f("first_name", "QA CD", "last_name", "L14 " + WriteBase.RUN, "email", WriteBase.email("l14"))));
        AppUser.App crm = AppUser.as(CrmDeskFeature.OWNER).crm();
        String c = AppUser.ok(crm.post("/modules/" + WriteBase.CRM_CONTACTS + "/records", b), "create").jsonPath().getString("data.id");
        AppUser.sleep(15_000);
        qa.features.crmdeskintegration.pages.CrmRecordPage e = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(c);
        e.cardShown();
        fact("L14", "contact with no tickets: 'No tickets for this record.'=" + body().contains("No tickets for this record."));
        shot("L14");
        for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/links?kind=contact&page_size=200"))
            if (c.equals(String.valueOf(l.get("crm_record_id")))) fact("CLEAN", "delete L14 Desk contact -> " + desk().delete("/modules/" + WriteBase.DESK_CONTACTS + "/records/" + l.get("desk_record_id")).statusCode());
        fact("CLEAN", "delete L14 CRM contact -> " + crm.delete("/modules/" + WriteBase.CRM_CONTACTS + "/records/" + c).statusCode());
    }

    // ---------------- O5 Arabic / RTL ----------------
    @CaseId("O5")
    @Test(priority = 6, groups = {"crmdesk", "crmdesk-remaining"}, description = "Arabic UI: settings translated and right-to-left (language set back to English)")
    public void arabic() {
        IntegrationSettingsPage s = new IntegrationSettingsPage().openDesk();
        try {
            boolean opened = click("EN");
            boolean ar = false;
            for (WebElement e : driver().findElements(By.xpath("//*[contains(normalize-space(.),'العربية') and (self::button or self::a or @role='menuitem' or @role='option' or @role='menuitemradio')]")))
                try { if (e.isDisplayed()) { e.click(); ar = true; break; } } catch (RuntimeException ignored) {}
            AppUser.sleep(4000);
            String dir = String.valueOf(((JavascriptExecutor) driver()).executeScript("return document.documentElement.dir || getComputedStyle(document.body).direction"));
            String t = body();
            shot("O5-settings-ar");
            boolean englishLeft = t.contains("Configuration Details") || t.contains("Sync History") || t.contains("Failure Log");
            fact("O5", "language menu opened=" + opened + " Arabic picked=" + ar + "; dir=" + dir + "; English tab names still shown=" + englishLeft + " | " + clip(t, 250));
            new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298).showPane();
            shot("O5-pane-ar");
            fact("O5", "pane in Arabic: " + clip(body().replaceAll("(?s).*?(CRM)", "$1"), 200));
        } finally {
            new IntegrationSettingsPage().openDesk();
            boolean en = false;
            for (WebElement e : driver().findElements(By.xpath("//header//button[contains(normalize-space(.),'AR') or contains(normalize-space(.),'ع')] | //button[normalize-space(.)='AR']")))
                try { if (e.isDisplayed()) { e.click(); AppUser.sleep(1000); break; } } catch (RuntimeException ignored) {}
            for (WebElement e : driver().findElements(By.xpath("//*[contains(normalize-space(.),'English') and (self::button or self::a or @role='menuitem' or @role='option' or @role='menuitemradio')]")))
                try { if (e.isDisplayed()) { e.click(); en = true; break; } } catch (RuntimeException ignored) {}
            AppUser.sleep(3000);
            fact("O5", "back to English=" + en + " dir now=" + ((JavascriptExecutor) driver()).executeScript("return document.documentElement.dir || getComputedStyle(document.body).direction"));
            shot("O5-after");
        }
    }

    // ---------------- O6 keyboard, O8 narrow screens, O10 pane speed ----------------
    @CaseId({"O6", "O8", "O10"})
    @Test(priority = 7, groups = {"crmdesk", "crmdesk-remaining"}, description = "Keyboard on the settings page; narrow screens; pane speed over 10 tickets")
    public void keyboardNarrowSpeed() {
        IntegrationSettingsPage s = new IntegrationSettingsPage().openDesk();
        String tablist = null;
        for (WebElement e : driver().findElements(By.xpath("//*[@role='tablist']"))) tablist = e.getAttribute("aria-label");
        new Actions(driver()).sendKeys(Keys.TAB, Keys.TAB, Keys.TAB).perform();
        String focused = String.valueOf(((JavascriptExecutor) driver()).executeScript("var a=document.activeElement;return a.tagName+' '+(a.getAttribute('aria-label')||a.textContent.trim().slice(0,30))"));
        s.tab("Permissions");
        boolean dialog = false, closed = false;
        try {
            for (WebElement e : driver().findElements(By.xpath("//*[starts-with(@aria-label,'Configure ')] | //button[normalize-space(.)='Full Access']"))) if (e.isDisplayed()) {
                e.click();
                AppUser.sleep(1500);
                dialog = !driver().findElements(By.xpath("//*[@role='dialog']")).isEmpty();
                new Actions(driver()).sendKeys(Keys.ESCAPE).perform();
                AppUser.sleep(1000);
                closed = driver().findElements(By.xpath("//*[@role='dialog']")).stream().noneMatch(WebElement::isDisplayed);
                break;
            }
        } catch (RuntimeException ignored) {
        }
        fact("O6", "tablist aria-label='" + tablist + "'; focus after 3×Tab: " + focused + "; access dialog opened=" + dialog + " closed by Escape=" + closed);
        Dimension orig = driver().manage().window().getSize();
        try {
            for (int[] wh : new int[][]{{1280, 800}, {1024, 768}, {768, 1024}}) {
                driver().manage().window().setSize(new Dimension(wh[0], wh[1]));
                new IntegrationSettingsPage().openDesk().tab("Configuration Details");
                AppUser.sleep(1500);
                Object over = ((JavascriptExecutor) driver()).executeScript("return document.documentElement.scrollWidth > window.innerWidth");
                boolean saveVisible = false;
                shot("O8-" + wh[0]);
                new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298).showPane();
                shot("O8-pane-" + wh[0]);
                fact("O8", wh[0] + "x" + wh[1] + ": settings page horizontal overflow=" + over);
            }
        } finally {
            driver().manage().window().setSize(orig);
        }
        List<Long> times = new ArrayList<>();
        List<String> ids = new ArrayList<>();
        for (Map<String, String> t : new IntegrationApi(desk()).deskTickets()) {
            if (ids.size() == 10) break;
            ids.add(t.get("id"));
        }
        for (String id : ids) {
            long t0 = System.currentTimeMillis();
            DeskRecordPage p = new DeskRecordPage().openTicket(id);
            p.showPane();
            boolean shown = qa.core.base.Waits.until(() -> body().contains("CRM Contact Info") || body().contains("Not linked to a CRM record") || body().contains("CRM Account Info"), 20);
            times.add(shown ? System.currentTimeMillis() - t0 : -1);
        }
        fact("O10", "ticket page + CRM pane load times (ms, incl. page load; -1 = no pane): " + times);
    }

    @CaseId("I12")
    @Test(priority = 8, groups = {"crmdesk", "crmdesk-remaining"}, description = "Open in CRM from the pane opens the linked CRM record")
    public void openInCrm() {
        DeskRecordPage p = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
        p.showPane();
        AppUser.sleep(2000);
        Object dump = ((JavascriptExecutor) driver()).executeScript("var o=[];document.querySelectorAll('a,button').forEach(function(e){var r=e.getBoundingClientRect();if(r.x>360&&r.x<660&&r.y<200&&r.width>0)o.push(e.tagName+'|'+(e.getAttribute('aria-label')||'')+'|'+(e.getAttribute('title')||'')+'|'+(e.getAttribute('href')||'')+'|'+e.textContent.trim().slice(0,20))});return o.join(' ; ')");
        fact("I12", "pane header controls: " + dump);
        String url = null;
        String main = driver().getWindowHandle();
        java.util.Set<String> h0 = driver().getWindowHandles();
        for (WebElement e : driver().findElements(By.xpath("//a[contains(@href,'staging-crm')] | //*[contains(@aria-label,'CRM') and (self::a or self::button)]")))
            try {
                if (!e.isDisplayed()) continue;
                if (e.getAttribute("href") != null) { url = e.getAttribute("href"); break; }
                e.click();
                AppUser.sleep(3000);
                for (String h : driver().getWindowHandles()) if (!h0.contains(h)) { driver().switchTo().window(h); url = driver().getCurrentUrl() + " (new tab)"; driver().close(); }
                driver().switchTo().window(main);
                if (url != null) break;
            } catch (RuntimeException ignored) {
            }
        fact("I12", "Open in CRM -> " + url);
        if (url != null) {
            page().crmSession();
            String t = page().visit(url.replace(" (new tab)", ""));
            AppUser.sleep(3000);
            shot("I12-target");
            fact("I12", "visiting the link: record page shows the contact name=" + body().contains("Mahmoud MohamedSamy") + " url=" + driver().getCurrentUrl() + " | " + clip(body(), 160));
        }
        Assert.assertTrue(url != null && url.contains(CrmDeskFeature.CRM_CONTACT), "Open in CRM does not reach the linked CRM contact: " + url);
    }

    @CaseId({"J2", "O6"})
    @Test(priority = 9, groups = {"crmdesk", "crmdesk-remaining"}, description = "Configure Access Permissions dialog content; Escape closes it (nothing applied)")
    public void accessDialog() {
        IntegrationSettingsPage s = new IntegrationSettingsPage().openDesk().tab("Permissions");
        String text = s.peekAccessDialog();
        fact("J2", "dialog: title=" + text.contains("Configure Access Permissions") + " Information=" + (text.contains("Information")) + " Potentials=" + text.contains("Potentials") + " Notes=" + text.contains("Notes")
                + " Activities=" + text.contains("Activities") + " Calls/Meetings/Tasks=" + (text.contains("Calls") && text.contains("Meetings") && text.contains("Tasks")) + " Apply=" + text.contains("Apply") + " | " + clip(text, 200));
        String rv = String.valueOf(config().get("row_version"));
        for (WebElement e : driver().findElements(By.xpath("(//*[self::button or self::a][normalize-space(.)='Full Access'])[1]")))
            if (e.isDisplayed()) { e.click(); break; }
        AppUser.sleep(1500);
        boolean open = driver().findElements(By.xpath("//*[@role='dialog']")).stream().anyMatch(WebElement::isDisplayed);
        new Actions(driver()).sendKeys(Keys.ESCAPE).perform();
        AppUser.sleep(1000);
        boolean closed = driver().findElements(By.xpath("//*[@role='dialog']")).stream().noneMatch(WebElement::isDisplayed);
        shot("O6-escape");
        fact("O6", "access dialog opened=" + open + " closed by Escape=" + closed + "; settings unchanged=" + rv.equals(String.valueOf(config().get("row_version"))));
        Assert.assertTrue(text.contains("Configure Access Permissions"), "access dialog not shown");
    }

    @AfterClass(alwaysRun = true)
    public void end() {
        try {
            restore("end of screen batch");
            fact("CLEAN", "status " + config().get("status"));
        } catch (Exception e) {
            fact("CLEAN", "restore error " + e.getMessage());
        }
    }
}
