package qa.features.crmdeskintegration;

import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.DeskRecordPage;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.CrmDeskFeature.CRM;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * The two parity checks that change shared state, run on the user's explicit "run both" (21 Oct 2026):
 * (1) a short Disconnect to see the CRM side and whether deal–ticket links survive (Zoho items 119, 143), reconnected in
 * finally; (2) the owner's ticket work mode switched to Handshake Mode and back to Classic View in finally (Zoho item 59).
 */
public class ParitySharedTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/parity");
    static final List<String[]> MADE = new ArrayList<>();
    static final String RUN = WriteBase.RUN;

    static AppUser.App crm() {
        return AppUser.as(CrmDeskFeature.OWNER).crm();
    }

    static AppUser.App desk() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    static String mk(AppUser.App app, String module, String layout, Map<String, Object> fields, String side) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout);
        body.put("data", WriteBase.data(fields));
        String id = AppUser.ok(app.post("/modules/" + module + "/records", body), "create").jsonPath().getString("data.id");
        MADE.add(new String[]{side, module, id});
        return id;
    }

    static String clip(String s, int n) {
        s = s == null ? "null" : s.replaceAll("\\s+", " ");
        return s.length() > n ? s.substring(0, n) + "…" : s;
    }

    Map<String, Object> status() {
        return AppUser.ok(desk().get(INT + "/config"), "config").jsonPath().getMap("data.status");
    }

    // ---- Zoho 119 / 143 ----
    @CaseId({"L17", "B8", "Z-119", "Z-143"})
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-parity"}, description = "While disconnected: CRM card and workspace; after reconnect: deal-ticket links")
    public void disconnectEffects() {
        String c = mk(crm(), WriteBase.CRM_CONTACTS, WriteBase.CRM_CONTACT_LAYOUT, WriteBase.f("first_name", "QA CD", "last_name", "Disc " + RUN, "email", WriteBase.email("disc")), "crm");
        String d = null;
        for (int i = 0; i < 40 && d == null; i++) {
            for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/links?kind=contact&page_size=200"))
                if (c.equals(String.valueOf(l.get("crm_record_id")))) d = String.valueOf(l.get("desk_record_id"));
            if (d == null) AppUser.sleep(3000);
        }
        if (d == null) throw new org.testng.SkipException("INCONCLUSIVE: QA contact did not reach Desk");
        MADE.add(new String[]{"desk", WriteBase.DESK_CONTACTS, d});
        String dl = mk(crm(), WriteBase.CRM_DEALS, WriteBase.CRM_DEAL_LAYOUT, WriteBase.f("deal_name", WriteBase.name("Disc deal"), "pipeline", WriteBase.CRM_DEAL_PIPELINE, "stage", "qualification", "contact_id", c), "crm");
        String t = mk(desk(), WriteBase.DESK_TICKETS, WriteBase.DESK_TICKET_LAYOUT, WriteBase.f("subject", "QA CD Disc " + RUN, "status", "Open", "department", WriteBase.DESK_DEPARTMENT, "contact_id", d, "email", WriteBase.email("disc"), "channel", "web"), "desk");
        AppUser.ok(desk().put(INT + "/tickets/" + t + "/deal", Map.of("deal_id", dl)), "link deal");
        fact("Z-143", "before disconnect: ticket deal -> " + clip(desk().get(INT + "/tickets/" + t + "/deal").asString(), 160));
        DeskRecordPage p = new DeskRecordPage().crmSession();
        p.visit(CRM + "/modules/" + WriteBase.CRM_CONTACTS + "/records/" + c);
        qa.features.crmdeskintegration.pages.CrmRecordPage cp = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(c);
        fact("Z-119", "connected: CRM contact Desk Tickets card shown=" + cp.cardShown());
        p.shot(OUT.resolve("crm-contact-connected.png"));
        try {
            fact("Z-119", "disconnect -> " + desk().post(INT + "/disconnect", Map.of()).statusCode());
            AppUser.sleep(3000);
            cp = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(c);
            boolean card = cp.cardShown();
            String cardText = cp.text();
            p.shot(OUT.resolve("crm-contact-disconnected.png"));
            String ws = p.visit(CRM + "/desk/tickets/" + t);
            p.shot(OUT.resolve("crm-workspace-disconnected.png"));
            String home = p.visit(CRM + "/");
            p.shot(OUT.resolve("crm-home-disconnected.png"));
            fact("Z-119", "disconnected: CRM contact card shown=" + card + " | card area: " + clip(cardText.replaceAll("(?s).*?(Desk Tickets|Desk is not available)", "$1"), 250));
            fact("Z-119", "disconnected: CRM Desk workspace: " + clip(ws.replaceAll("(?s).*?(All Tickets|Desk is not available)", "$1"), 200) + " | CRM menu still lists Desk=" + home.contains("Desk"));
            fact("Z-143", "while disconnected: ticket deal -> " + clip(desk().get(INT + "/tickets/" + t + "/deal").asString(), 160));
        } finally {
            fact("Z-119", "connect -> " + desk().post(INT + "/connect", Map.of()).statusCode());
            AppUser.sleep(8000);
            if (Boolean.TRUE.equals(status().get("paused"))) fact("Z-119", "resume -> " + desk().post(INT + "/resume", Map.of()).statusCode());
            fact("Z-119", "status after reconnect: enabled=" + status().get("enabled") + " paused=" + status().get("paused") + " connected_at=" + status().get("connected_at"));
        }
        fact("Z-143", "after reconnect: ticket deal -> " + clip(desk().get(INT + "/tickets/" + t + "/deal").asString(), 160) + " (Zoho deletes deal-ticket links on deactivation)");
    }

    // ---- Zoho 59 ----
    @CaseId({"K2", "Z-59"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-parity"}, description = "Handshake Mode board columns; the owner's view goes back to Classic View")
    public void handshakeBoard() {
        DeskRecordPage p = new DeskRecordPage().openTicketList();
        try {
            p.layoutOptionsShot(OUT.resolve("desk-picker-before.png"));
            p.clickText("Classic View");
            AppUser.sleep(1000);
            boolean picked = p.clickText("Handshake Mode");
            AppUser.sleep(5000);
            p.shot(OUT.resolve("desk-handshake-board.png"));
            String t = driver().findElement(org.openqa.selenium.By.tagName("body")).getText();
            List<Map<String, Object>> rows = new IntegrationApi(desk()).deskTickets().stream().map(x -> (Map<String, Object>) new LinkedHashMap<String, Object>(x)).toList();
            List<String> ids = new ArrayList<>();
            for (Map<String, Object> r : rows) if (!"Closed".equals(r.get("status"))) ids.add(String.valueOf(r.get("id")));
            Map<String, Integer> buckets = new LinkedHashMap<>();
            if (!ids.isEmpty()) for (Map<String, Object> b : AppUser.ok(desk().post(INT + "/tickets/classify", Map.of("ticket_ids", ids)), "classify").jsonPath().<Map<String, Object>>getList("data"))
                buckets.merge(String.valueOf(b.get("bucket")), 1, Integer::sum);
            fact("Z-59", "Handshake picked=" + picked + "; open-ticket buckets " + buckets + "; board shows Customers=" + t.contains("Customers") + " Potentials=" + t.contains("Potentials")
                    + " Contacts/Leads=" + (t.contains("Contacts") && t.contains("Leads")) + " New=" + t.matches("(?s).*\\bNew\\b.*"));
        } finally {
            DeskRecordPage q = new DeskRecordPage().openTicketList();
            q.clickText("Handshake Mode");
            AppUser.sleep(1000);
            boolean back = q.clickText("Classic View");
            AppUser.sleep(3000);
            String after = q.layoutOptionsShot(OUT.resolve("desk-picker-after.png"));
            fact("Z-59", "owner's view back to Classic View clicked=" + back + " | picker now: " + clip(after.replaceAll("(?s).*?(Classic View)", "$1"), 160));
        }
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
        try {
            Map<String, Object> s = status();
            if (!Boolean.TRUE.equals(s.get("enabled"))) fact("CLEAN", "connect -> " + desk().post(INT + "/connect", Map.of()).statusCode());
            if (Boolean.TRUE.equals(status().get("paused"))) fact("CLEAN", "resume -> " + desk().post(INT + "/resume", Map.of()).statusCode());
            fact("CLEAN", "final status enabled=" + status().get("enabled") + " paused=" + status().get("paused"));
        } catch (Exception e) {
            fact("CLEAN", "status error " + e.getMessage());
        }
    }
}
