package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.CrmRecordPage;
import qa.features.crmdeskintegration.pages.DeskRecordPage;
import qa.features.crmdeskintegration.pages.IntegrationSettingsPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * Run 3 — connection lifecycle through the Desk settings screen (approved by the user 20 Oct 2026: "Full: include
 * Disconnect"). Pause → Resume, then Pause → Disconnect → Connect. The integration is left Connected and not paused;
 * {@link #leaveConnected()} enforces it even after a failure. Spec rows B1, B3, B6, B7, B8, B9, B10, B11, B14, K10, L17, J1a.
 */
public class ConnectionRunTest extends BaseTest {
    static final String RUN = WriteBase.RUN;
    static String connectedAtBefore;
    static int contactLinksBefore, accountLinksBefore;
    static String disconnectedCrmContact;
    static String connectAt;

    private static IntegrationApi api() {
        return IntegrationApi.browser();
    }

    private static AppUser.App ownerApi() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    private static List<String> missing(String text, String... expected) {
        List<String> out = new ArrayList<>();
        for (String e : expected) if (!text.contains(e)) out.add(e);
        return out;
    }

    // ---------------- B3 / K10 / B6 ----------------

    @CaseId({"B3", "K10", "B6"})
    @ZohoRef(value = "zoho/19-desk-handshake-mode.png", note = "Zoho Desk Handshake Mode")
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-write", "crmdesk-ui"}, description = "Pause from the screen: dialog texts, status, Handshake Mode while paused; Resume")
    public void pauseAndResumeOnScreen() {
        JsonPath c = api().config();
        connectedAtBefore = c.getString("data.status.connected_at");
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
        String reason = "QA CD UI pause " + RUN;
        String out = p.connectionAction("Pause sync", reason);
        fact("B3", "pause dialog + page: " + clip(out, 600));
        List<String> miss = missing(out, "Pause syncing?", "Events keep queuing while paused and drain when you resume.");
        boolean paused = p.waitFor("Paused: " + reason, 30);
        String layout;
        try {
            layout = new DeskRecordPage().openTicketList().layoutOptions();
        } catch (RuntimeException e) {
            layout = "error " + e.getMessage();
        }
        fact("K10", "layout picker while paused: " + clip(layout, 300));
        boolean handshakeOffered = layout.contains("Handshake");
        IntegrationSettingsPage q = new IntegrationSettingsPage().openDesk();
        String res = q.connectionAction("Resume sync", null);
        boolean resumed = q.waitFor("Connected", 30);
        fact("B6", "resume on screen -> connected shown=" + resumed + "; status paused=" + api().config().getBoolean("data.status.paused"));
        assertTrue(miss.isEmpty(), "pause dialog lacks " + miss);
        assertTrue(paused, "status 'Paused: " + reason + "' not shown");
        assertTrue(resumed, "Resume did not bring the status back to Connected");
        assertFalse(handshakeOffered, "K10: Handshake Mode still offered while sync is paused (NDC-1669 §8)");
    }

    // ---------------- B7 / B8 / K10 / L17 ----------------

    @CaseId({"B7", "B8", "K10", "L17", "I7"})
    @ZohoRef(value = "zoho/01-desk-crm-authentication.png", note = "Zoho Desk CRM integration (connection)")
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-write", "crmdesk-ui"}, description = "Pause then Disconnect: dialog, status, links kept, pane / Handshake / CRM card states, nothing syncs")
    public void disconnectOnScreen() {
        contactLinksBefore = api().links().stream().filter(l -> "contact".equals(l.get("kind"))).toList().size();
        accountLinksBefore = api().links().stream().filter(l -> "account".equals(l.get("kind"))).toList().size();
        Response pz = ownerApi().post(INT + "/pause", Map.of("reason", "QA CD B7 " + RUN));
        fact("B7", "pause before disconnect -> " + pz.statusCode());
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
        String out = p.connectionAction("Disconnect", null);
        fact("B8", "disconnect dialog + page: " + clip(out, 600));
        List<String> miss = missing(out, "Disconnect the integration?", "Syncing stops. Existing links between CRM and Desk records are kept and can be resumed by reconnecting.");
        boolean notConnected = p.waitFor("Not connected", 30);
        JsonPath st = api().status();
        JsonPath cfg = api().config();
        fact("B7", "after disconnect: enabled=" + st.get("data.enabled") + " paused=" + cfg.get("data.status.paused") + " queue " + cfg.get("data.status.queue"));
        int cl = api().links().stream().filter(l -> "contact".equals(l.get("kind"))).toList().size();
        fact("B8", "contact links " + contactLinksBefore + " -> " + cl + "; account links " + accountLinksBefore);

        // nothing syncs while disconnected
        AppUser.App crm = AppUser.as(CrmDeskFeature.OWNER).crm();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", WriteBase.CRM_CONTACT_LAYOUT);
        body.put("data", WriteBase.data(WriteBase.f("first_name", "QA CD", "last_name", "B8 " + RUN, "email", WriteBase.email("b8"))));
        disconnectedCrmContact = AppUser.ok(crm.post("/modules/" + WriteBase.CRM_CONTACTS + "/records", body), "create B8").jsonPath().getString("data.id");
        AppUser.sleep(40_000);
        boolean linked = api().links().stream().anyMatch(l -> disconnectedCrmContact.equals(String.valueOf(l.get("crm_record_id"))));
        fact("B8", "CRM contact created while disconnected linked after 40 s=" + linked);

        // what agents and CRM users see
        String layout;
        try {
            layout = new DeskRecordPage().openTicketList().layoutOptions();
        } catch (RuntimeException e) {
            layout = "error " + e.getMessage();
        }
        fact("K10", "layout picker while disconnected: " + clip(layout, 300));
        DeskRecordPage t = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
        boolean pane = t.showPane();
        fact("I7", "ticket #298 while disconnected: pane shown=" + pane + " text=" + clip(t.text(), 300));
        Response ctx = ownerApi().get(INT + "/context/contact/" + CrmDeskFeature.DESK_CONTACT + "/info");
        fact("B8", "context info while disconnected -> " + ctx.statusCode() + " " + clip(ctx.asString(), 200));
        String card;
        try {
            card = new CrmRecordPage().openContact(CrmDeskFeature.CRM_CONTACT).text();
        } catch (RuntimeException e) {
            card = "error " + e.getMessage();
        }
        fact("L17", "CRM contact card while disconnected: " + clip(card.replaceAll("\\s+", " "), 500));

        assertTrue(miss.isEmpty(), "disconnect dialog lacks " + miss);
        assertTrue(notConnected, "status 'Not connected' not shown");
        assertEquals(st.getBoolean("data.enabled"), false, "API still enabled");
        assertEquals(cl, contactLinksBefore, "links changed on disconnect");
        assertFalse(linked, "a record synced while disconnected");
        assertFalse(layout.contains("Handshake"), "K10: Handshake Mode offered while disconnected");
    }

    // ---------------- B9 / B10 / B11 / B14 / J1a ----------------

    @CaseId({"B9", "B10", "B11", "B14", "J1a"})
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-write", "crmdesk-ui"}, description = "Connect from the screen: dialog, initial imports with progress, notice, no duplicates, default access")
    public void connectOnScreen() {
        connectAt = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
        String out = p.connectionAction("Connect", null);
        fact("B9", "connect dialog + page: " + clip(out, 600));
        List<String> miss = missing(out, "Connect CRM and Desk?", "Connecting seeds the default field mappings and starts the initial customer import, followed by the contract import.");
        boolean connected = p.waitFor("Connected", 60);

        // B10: watch the runs and the Sync History tab
        List<String> seen = new ArrayList<>();
        String hist = "";
        long end = System.currentTimeMillis() + 300_000;
        boolean done = false;
        while (System.currentTimeMillis() < end) {
            List<Map<String, Object>> runs = api().list(INT + "/runs?page_size=3");
            StringBuilder s = new StringBuilder();
            boolean anyOpen = false;
            for (Map<String, Object> r : runs) {
                if (String.valueOf(r.get("started_at")).compareTo(connectAt) < 0) continue;
                s.append(r.get("kind")).append(':').append(r.get("status")).append(r.get("progress")).append(' ');
                if (r.get("finished_at") == null) anyOpen = true;
            }
            seen.add(s.toString().trim());
            if (seen.size() == 2) {
                try {
                    hist = new IntegrationSettingsPage().openDesk().tab("Sync History").text();
                } catch (RuntimeException e) {
                    hist = "error " + e.getMessage();
                }
            }
            if (!s.isEmpty() && !anyOpen && s.toString().contains("initial_contracts")) {
                done = true;
                break;
            }
            AppUser.sleep(5000);
        }
        fact("B10", "runs after connect: " + seen.stream().distinct().toList());
        fact("B10", "Sync History during import shows progress=" + hist.contains("Syncing all customers") + " " + clip(hist.replaceAll("\\s+", " "), 300));

        // B11 notice
        List<Object> bell = new ArrayList<>();
        Response n = AppUser.as(CrmDeskFeature.OWNER).crm().get("/notifications?page=1&per_page=30");
        List<Map<String, Object>> l = n.jsonPath().getList("data.data");
        if (l != null) for (Map<String, Object> x : l) if (String.valueOf(x.get("created_at")).compareTo(connectAt) > 0) bell.add(x.get("event_type") + " '" + x.get("title") + "'");
        fact("B11", "owner bell entries since connect: " + bell);

        // B14 and the record created while disconnected
        int cl = api().links().stream().filter(x -> "contact".equals(x.get("kind"))).toList().size();
        int al = api().links().stream().filter(x -> "account".equals(x.get("kind"))).toList().size();
        boolean b8Linked = api().links().stream().anyMatch(x -> disconnectedCrmContact != null && disconnectedCrmContact.equals(String.valueOf(x.get("crm_record_id"))));
        fact("B14", "contact links " + contactLinksBefore + " -> " + cl + "; account links " + accountLinksBefore + " -> " + al + "; contact created while disconnected linked by the import=" + b8Linked);

        // J1a default access right after connect
        JsonPath c = api().config();
        List<Object> access = c.getList("data.panel.profile_access");
        fact("J1a", "profile_access right after connect: " + access + " (empty = every profile Full Access)");
        fact("B9", "connected_at " + connectedAtBefore + " -> " + c.getString("data.status.connected_at") + "; paused=" + c.get("data.status.paused"));

        assertTrue(miss.isEmpty(), "connect dialog lacks " + miss);
        assertTrue(connected, "status 'Connected' not shown after Connect");
        assertTrue(done, "initial customer + contract imports did not finish within 5 min");
        assertTrue(cl >= contactLinksBefore, "links lost on reconnect");
        assertTrue(bell.stream().anyMatch(x -> String.valueOf(x).toLowerCase().matches(".*(sync|import).*")), "B11: no notice to the admin that the initial sync finished");
    }

    @CaseId("J1a")
    @ZohoRef(value = "zoho/07-desk-permissions.png", note = "Zoho Desk CRM permissions: only Administrator by default")
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-write", "crmdesk-ui"}, dependsOnMethods = "connectOnScreen", alwaysRun = true, description = "After a fresh Connect only the Administrator profile has CRM access (Zoho)")
    public void defaultAccessAfterConnect() {
        List<Object> access = api().config().getList("data.panel.profile_access");
        new IntegrationSettingsPage().openDesk().tab("Permissions").text();
        assertFalse(access == null || access.isEmpty(), "Z9: after Connect every Desk profile has Full Access to CRM data (Zoho: only Administrator)");
    }

    @AfterClass(alwaysRun = true)
    public void leaveConnected() {
        try {
            AppUser.App o = ownerApi();
            JsonPath s = AppUser.ok(o.get(INT + "/config"), "config").jsonPath();
            if (!s.getBoolean("data.status.enabled")) fact("CLEAN", "connect -> " + o.post(INT + "/connect", Map.of()).statusCode());
            s = AppUser.ok(o.get(INT + "/config"), "config").jsonPath();
            if (s.getBoolean("data.status.paused")) fact("CLEAN", "resume -> " + o.post(INT + "/resume", Map.of()).statusCode());
            if (disconnectedCrmContact != null) {
                AppUser.App crm = AppUser.as(CrmDeskFeature.OWNER).crm();
                Object d = null;
                for (Map<String, Object> x : new IntegrationApi(o).links()) if (disconnectedCrmContact.equals(String.valueOf(x.get("crm_record_id")))) d = x.get("desk_record_id");
                fact("CLEAN", "delete B8 CRM contact -> " + crm.delete("/modules/" + WriteBase.CRM_CONTACTS + "/records/" + disconnectedCrmContact).statusCode());
                if (d != null) fact("CLEAN", "delete B8 Desk contact -> " + o.delete("/modules/" + WriteBase.DESK_CONTACTS + "/records/" + d).statusCode());
            }
            JsonPath f = AppUser.ok(o.get(INT + "/config"), "config").jsonPath();
            fact("CLEAN", "final: enabled=" + f.get("data.status.enabled") + " paused=" + f.get("data.status.paused") + " connected_at=" + f.get("data.status.connected_at"));
        } catch (Exception e) {
            fact("CLEAN", "leaveConnected error: " + e.getMessage());
        }
    }

    static String clip(String s, int n) {
        if (s == null) return "null";
        s = s.replace('\n', ' ');
        return s.length() > n ? s.substring(0, n) + "…" : s;
    }
}
