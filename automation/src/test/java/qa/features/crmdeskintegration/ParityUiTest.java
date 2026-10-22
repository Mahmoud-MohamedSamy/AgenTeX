package qa.features.crmdeskintegration;

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
 * Zoho-parity screen checks (21 Oct 2026). Each step records text facts and a screenshot in target/evidence/parity/
 * for a manual verdict. Only one QA contact pair is created (deleted at the end); no settings, connection or
 * work-mode changes.
 */
public class ParityUiTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/parity");
    static final List<String[]> MADE = new ArrayList<>();
    static final String RUN = WriteBase.RUN;

    static AppUser.App crm() {
        return AppUser.as(CrmDeskFeature.OWNER).crm();
    }

    static AppUser.App desk() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    static String clip(String s, int n) {
        s = s == null ? "null" : s.replaceAll("\\s+", " ");
        return s.length() > n ? s.substring(0, n) + "…" : s;
    }

    String body() {
        return driver().findElement(org.openqa.selenium.By.tagName("body")).getText();
    }

    // ---- Zoho 83 / 139: "+ New" on a CRM contact without email ----
    @CaseId({"L7", "Z-83"})
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-parity"}, description = "Desk Tickets card on a CRM contact without email")
    public void newTicketWithoutEmail() {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("layout_id", WriteBase.CRM_CONTACT_LAYOUT);
        b.put("data", WriteBase.data(WriteBase.f("first_name", "QA CD", "last_name", "NoMail " + RUN, "phone", "010" + String.format("%08d", System.currentTimeMillis() % 100_000_000))));
        String c = AppUser.ok(crm().post("/modules/" + WriteBase.CRM_CONTACTS + "/records", b), "create").jsonPath().getString("data.id");
        MADE.add(new String[]{"crm", WriteBase.CRM_CONTACTS, c});
        String d = null;
        for (int i = 0; i < 40 && d == null; i++) {
            for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/links?kind=contact&page_size=200"))
                if (c.equals(String.valueOf(l.get("crm_record_id")))) d = String.valueOf(l.get("desk_record_id"));
            if (d == null) AppUser.sleep(3000);
        }
        if (d != null) MADE.add(new String[]{"desk", WriteBase.DESK_CONTACTS, d});
        new DeskRecordPage().crmSession();
        DeskRecordPage p = new DeskRecordPage();
        p.visit(CRM + "/modules/" + WriteBase.CRM_CONTACTS + "/records/" + c);
        qa.core.base.Waits.until(() -> body().contains("Desk Tickets") || body().contains("Not in Desk"), 45);
        ((org.openqa.selenium.JavascriptExecutor) driver()).executeScript("var e=[...document.querySelectorAll('*')].find(x=>x.childElementCount===0&&/^Desk Tickets$/.test(x.textContent.trim()));if(e)e.scrollIntoView({block:'start'});");
        AppUser.sleep(2500);
        qa.features.crmdeskintegration.pages.CrmRecordPage cp = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(c);
        boolean card = cp.cardShown();
        p.shot(OUT.resolve("crm-contact-no-email.png"));
        String noMail = "card shown=" + card + "; New ticket " + p.buttonState("New ticket") + "; text: " + clip(cp.text().replaceAll("(?s).*Desk Tickets", "Desk Tickets"), 300);
        qa.features.crmdeskintegration.pages.CrmRecordPage cc = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(CrmDeskFeature.CRM_CONTACT);
        boolean card2 = cc.cardShown();
        p.shot(OUT.resolve("crm-contact-with-email.png"));
        fact("Z-83", "CRM contact WITHOUT email (Desk " + d + "): " + noMail + " || control WITH email: card shown=" + card2 + "; New ticket " + p.buttonState("New ticket"));
    }

    // ---- Zoho 55: CRM info on the Desk contact and account pages ----
    @CaseId({"I14", "I13", "Z-55"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-parity"}, description = "CRM pane on the Desk contact and account records")
    public void paneOnCustomerRecords() {
        DeskRecordPage p = new DeskRecordPage().openContact(CrmDeskFeature.DESK_CONTACT);
        boolean pane = p.showPane();
        p.shot(OUT.resolve("desk-contact-pane.png"));
        fact("I14", "Desk contact record: CRM pane=" + pane);
        String acc = null;
        for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/links?kind=account&page_size=50"))
            if ("synced".equals(l.get("sync_status"))) {
                acc = String.valueOf(l.get("desk_record_id"));
                break;
            }
        if (acc != null) {
            p.visit(DESK + "/modules/" + WriteBase.DESK_ACCOUNTS + "/customers/" + acc);
            AppUser.sleep(2000);
            List<org.openqa.selenium.WebElement> rail = new ArrayList<>();
            for (org.openqa.selenium.WebElement e : driver().findElements(org.openqa.selenium.By.xpath("//button")))
                try { if (e.isDisplayed() && e.getRect().getX() > 315 && e.getRect().getX() < 370 && e.getRect().getY() < 300) rail.add(e); } catch (RuntimeException ignored) {}
            fact("I13", "account page rail buttons: " + rail.size());
            int i = 0;
            for (org.openqa.selenium.WebElement e : rail) {
                try {
                    if (!e.isDisplayed()) continue;
                    e.click();
                    AppUser.sleep(2000);
                    i++;
                    p.shot(OUT.resolve("desk-account-rail-" + i + ".png"));
                    fact("I13", "rail " + i + " aria=" + e.getAttribute("aria-label") + " -> CRM Account Info shown=" + body().contains("CRM Account Info"));
                    if (body().contains("CRM Account Info")) break;
                } catch (RuntimeException ignored) {
                }
                if (i >= 4) break;
            }
        }
    }

    // ---- Zoho 56 / 57: Mapped / Unmapped views ----
    @CaseId({"I17", "Z-56", "Z-57"})
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-parity"}, description = "Mapped / Unmapped with CRM views for contacts and accounts")
    public void mappedViews() {
        DeskRecordPage p = new DeskRecordPage();
        for (String[] m : new String[][]{{"contacts", WriteBase.DESK_CONTACTS, "All Contacts"}, {"accounts", WriteBase.DESK_ACCOUNTS, "All Accounts"}}) {
            if (m[0].equals("contacts")) new DeskRecordPage().openContact(CrmDeskFeature.DESK_CONTACT);
            else p.visit(DESK + "/modules/" + WriteBase.DESK_ACCOUNTS + "/customers/f9be2128-021d-4c30-a948-8e7f3dc4033b");
            AppUser.sleep(2000);
            boolean opened = p.clickText(m[2]);
            AppUser.sleep(1500);
            p.clickText("ALL VIEWS");
            AppUser.sleep(1500);
            String menu = body();
            p.shot(OUT.resolve("desk-" + m[0] + "-views-menu.png"));
            fact("Z-56", m[0] + " view menu opened=" + opened + "; 'Mapped' view listed=" + menu.contains("Mapped") + "; 'Unmapped' listed=" + menu.contains("Unmapped"));
            new org.openqa.selenium.interactions.Actions(driver()).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
        }
    }

    // ---- Zoho 84 / 92 / 118: Desk inside CRM, CRM-side disconnect ----
    @CaseId({"L16", "Z-84", "Z-92", "Z-118"})
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-parity"}, description = "Desk entry and ticket workspace inside CRM; CRM settings offer Pause / Disconnect")
    public void deskInsideCrm() {
        new DeskRecordPage().crmSession();
        DeskRecordPage p = new DeskRecordPage();
        String home = p.visit(CRM + "/");
        p.shot(OUT.resolve("crm-home-nav.png"));
        p.visit(CRM + "/desk/tickets/" + CrmDeskFeature.TICKET_298);
        p.clickText("#298");
        AppUser.sleep(4000);
        String ws = body();
        p.shot(OUT.resolve("crm-desk-workspace.png"));
        fact("Z-92", "CRM home mentions Desk=" + home.contains("Desk") + "; CRM /desk/tickets/{#298}: url=" + driver().getCurrentUrl() + " reply=" + ws.contains("Reply") + " comment=" + ws.contains("Comment") + " forward=" + ws.contains("Forward"));
        IntegrationSettingsPage s = new IntegrationSettingsPage().openCrm();
        fact("Z-118", "CRM settings page buttons: Pause sync=" + s.hasButton("Pause sync") + " Disconnect=" + s.hasButton("Disconnect"));
        p.shot(OUT.resolve("crm-settings-buttons.png"));
    }

    // ---- Zoho 91 / 7: acting from the CRM bell ----
    @CaseId({"M3", "Z-91"})
    @Test(priority = 5, groups = {"crmdesk", "crmdesk-parity"}, description = "Desk events in the CRM bell: what can be done from the notification")
    public void bellActions() {
        new DeskRecordPage().crmSession();
        DeskRecordPage p = new DeskRecordPage();
        p.visit(CRM + "/");
        boolean opened = false;
        for (org.openqa.selenium.WebElement e : driver().findElements(org.openqa.selenium.By.xpath("//button[contains(translate(@aria-label,'N','n'),'notification')]")))
            if (e.isDisplayed()) {
                e.click();
                opened = true;
                break;
            }
        qa.core.base.Waits.sleep(2500);
        p.shot(OUT.resolve("crm-bell.png"));
        String t = body();
        fact("Z-91", "bell opened=" + opened + "; reply/comment action in the bell=" + (t.contains("Reply") || t.contains("Comment")));
    }

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        for (int i = MADE.size() - 1; i >= 0; i--) {
            String[] m = MADE.get(i);
            try {
                AppUser.App a = "crm".equals(m[0]) ? crm() : desk();
                fact("CLEAN", "delete " + m[0] + " " + m[2] + " -> " + a.delete("/modules/" + m[1] + "/records/" + m[2]).statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + m[2] + " error " + e.getMessage());
            }
        }
    }
}
