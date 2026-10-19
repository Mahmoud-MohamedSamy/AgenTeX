package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import org.testng.SkipException;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.annotations.ZohoRef;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.CrmRecordPage;
import qa.features.crmdeskintegration.pages.DeskRecordPage;
import qa.features.crmdeskintegration.pages.IntegrationSettingsPage;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.crmdeskintegration.CrmDeskFeature.CRM_CONTACT;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.CrmDeskFeature.OWNER;
import static qa.features.crmdeskintegration.CrmDeskFeature.TICKET_298;

/**
 * Run 1 — read-only screen rows (owner session from .auth/, Desk host; CRM pages reuse it). Nothing is saved:
 * editors are closed, dialogs cancelled, pickers closed with Escape. Groups: crmdesk, crmdesk-read, crmdesk-ui.
 */
public class ReadUiTest extends BaseTest {

    private static IntegrationApi api() {
        return IntegrationApi.browser();
    }

    private static void note(String s) {
        System.out.println("[crmdesk-ui] " + s);
        io.qameta.allure.Allure.step(s);
    }

    private static List<String> missing(String text, String... expected) {
        List<String> out = new ArrayList<>();
        for (String e : expected) if (!text.contains(e)) out.add(e);
        return out;
    }

    // ---------------- A1 ----------------

    @CaseId("A1")
    @ZohoRef(value = "zoho/04-desk-configuration-details.png", note = "Zoho Desk integration page")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-a"}, description = "Desk settings page: title, subtitle, 5 tabs (no Notifications)")
    public void deskSettingsPageRenders() {
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
        List<String> tabs = p.tabNames();
        note("Desk tabs " + tabs);
        assertTrue(p.text().contains("Keep Desk customers, contracts and CRM records in sync."), "Desk subtitle");
        assertEquals(tabs, List.of("Overview", "Configuration Details", "Permissions", "Sync History", "Failure Log"));
    }

    @CaseId({"A1", "M1"})
    @ZohoRef(value = "zoho/10-crm-desk-settings.png", note = "Zoho CRM → Zoho Desk settings")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-a", "group-m"}, description = "CRM settings page: subtitle, 6 tabs incl. Notifications with the 7 signals and the contact-owner option")
    public void crmSettingsPageRenders() {
        IntegrationSettingsPage p = new IntegrationSettingsPage().openCrm();
        List<String> tabs = p.tabNames();
        note("CRM tabs " + tabs);
        assertTrue(p.text().contains("Keep CRM customers, deals and Desk tickets in sync."), "CRM subtitle");
        assertEquals(tabs, List.of("Overview", "Configuration Details", "Permissions", "Notifications", "Sync History", "Failure Log"));
        String t = p.tab("Notifications").text();
        List<String> miss = missing(t, "Someone mentions a CRM user in a ticket", "A ticket is created", "A comment is added", "A reply is sent or received",
                "A ticket becomes overdue", "A ticket is escalated", "A customer rates a ticket", "Notify the CRM contact owner");
        assertTrue(miss.isEmpty(), "Notifications tab lacks " + miss);
    }

    // ---------------- B1 / B2 ----------------

    @CaseId({"B1", "B2"})
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-b"}, description = "Overview shows status, connection dates and the queue numbers of /status, with the matching pill")
    public void overviewMatchesStatus() {
        JsonPath c = api().config();
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk();
        String t = p.text();
        List<String> miss = missing(t, "Connected", "Connected since", "Last customer import", "Last contract import", "Sync queue", "Queued", "Processing", "Failed", "Parked");
        int parked = c.getInt("data.status.queue.parked"), failed = c.getInt("data.status.queue.failed");
        String pill = parked > 0 ? "Needs attention: " + parked : failed > 0 ? "Retrying: " + failed : "All caught up";
        note("queue " + c.getMap("data.status.queue") + " → expected pill '" + pill + "'");
        if (!t.contains(pill)) miss.add("pill '" + pill + "'");
        assertTrue(miss.isEmpty(), "Overview lacks " + miss);
    }

    // ---------------- C1 / C2 ----------------

    @CaseId({"C1", "C2"})
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-c"}, description = "Configuration Details: sync table matches the config; Contacts Edit shows the mapped count (closed without saving)")
    public void syncTableMatchesConfig() {
        JsonPath c = api().config();
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk().tab("Configuration Details");
        String t = p.text();
        String dirC = "two_way".equals(c.getString("data.contacts.direction")) ? "Two-way" : "CRM → Desk";
        String calls = c.getBoolean("data.calls_enabled") ? "On" : "Off";
        note("expect Contacts " + dirC + ", Calls " + calls);
        List<String> miss = missing(t, "Sync Settings", "Contacts", "Accounts", "Contracts", "Deals", "Calls", dirC);
        assertTrue(miss.isEmpty(), "Sync table lacks " + miss);
        String editor = p.peekRow("Contacts", "Edit");
        int mapped = c.getList("data.contacts.mappings").size();
        note("editor shows: " + editor.replaceAll("(?s).*?(\\d+ of \\d+ fields mapped).*", "$1"));
        assertTrue(editor.matches("(?s).*\\b" + mapped + " of \\d+ fields mapped.*"), "mapped count " + mapped + " not shown");
    }

    // ---------------- E1 / Z4 ----------------

    @CaseId({"E1", "Z4"})
    @ZohoRef(value = "zoho/05-desk-delete-pref-crm-contact-options.png", note = "Zoho: Always delete · Delete if there are no associates · Never delete")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-e", "Z4"}, description = "Delete preferences: CRM-side options match Zoho (Always delete · Delete if no associates · Never delete); Desk side Always / Never")
    public void deletePreferencesMatchZoho() {
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk().tab("Configuration Details");
        List<String> crmContact = p.optionsAfterLabel("On deleting a CRM contact");
        List<String> deskContact = p.optionsAfterLabel("On deleting a Desk contact");
        note("CRM contact options " + crmContact + "; Desk contact options " + deskContact);
        assertEquals(deskContact.size(), 2, "Desk-side options (always / never delete in CRM)");
        assertTrue(crmContact.stream().anyMatch(o -> o.toLowerCase().contains("no associates") || o.toLowerCase().contains("no linked")),
                "No 'delete only if there are no associates' option on the CRM side: " + crmContact);
    }

    // ---------------- E10 ----------------

    @CaseId("E10")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-e"}, description = "CRM Related Lists show every offered module; unsupported ones say 'No ticket link'")
    public void relatedListsRender() {
        List<Map<String, Object>> mods = api().list(INT + "/related-list-modules");
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk().tab("Configuration Details");
        p.scrollAll();
        String t = p.text();
        List<String> miss = missing(t, "CRM Related Lists");
        for (Map<String, Object> m : mods) if (!t.contains(String.valueOf(m.get("label")))) miss.add(String.valueOf(m.get("label")));
        if (mods.stream().anyMatch(m -> Boolean.FALSE.equals(m.get("supported"))) && !t.contains("No ticket link")) miss.add("No ticket link");
        assertTrue(miss.isEmpty(), "Related Lists lack " + miss);
    }

    // ---------------- H1 / H9 ----------------

    @CaseId("H1")
    @ZohoRef(value = "zoho/07-desk-sync-history.png", note = "Zoho Sync History")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-h"}, description = "Sync History tab: 7-day title, directions, Sync all buttons (not clicked)")
    public void syncHistoryRenders() {
        String t = new IntegrationSettingsPage().openDesk().tab("Sync History").text();
        List<String> miss = missing(t, "Sync History for last 7 days", "Sync all customers", "Sync all contracts");
        if (!t.contains("CRM to Desk") && !t.contains("Desk to CRM") && !t.contains("No sync activity to display")) miss.add("direction rows");
        assertTrue(miss.isEmpty(), "Sync History lacks " + miss);
    }

    @CaseId({"H9", "H10"})
    @ZohoRef(value = "zoho/07-desk-failure-log.png", note = "Zoho Failure Log")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-h"}, description = "Failure Log: count line, Retry / Discard per row, Retry all; reasons name the record (no raw ids)")
    public void failureLogRenders() {
        int n = api().list(INT + "/failures").size();
        String t = new IntegrationSettingsPage().openDesk().tab("Failure Log").text();
        if (n == 0) {
            assertTrue(t.contains("No logs to display"), "empty state");
            return;
        }
        List<String> miss = missing(t, n + " records could not sync", "Retry all", "Retry", "Discard");
        assertTrue(miss.isEmpty(), "Failure Log lacks " + miss);
        assertFalse(t.matches("(?s).*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.*"), "Failure reasons show raw record ids on screen");
    }

    // ---------------- J1 / Z9 ----------------

    @CaseId({"J1", "Z9"})
    @ZohoRef(value = "zoho/07-desk-permissions.png", note = "Zoho: only Support Administrator ticked by default; levels No / Restricted / Full Access")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-j", "Z9"}, description = "Permissions: every profile with Accounts / Contacts; levels named No / Restricted / Full Access as in Zoho (dialog cancelled)")
    public void permissionsMatchZoho() {
        IntegrationSettingsPage p = new IntegrationSettingsPage().openDesk().tab("Permissions");
        String t = p.text();
        List<String> miss = missing(t, "Set profile level permissions for agents to access CRM data", "Accounts", "Contacts");
        assertTrue(miss.isEmpty(), "Permissions lacks " + miss);
        String dialog = p.peekAccessDialog();
        note("access dialog: " + dialog.replace('\n', ' ').substring(0, Math.min(300, dialog.length())));
        // While every profile is at Full Access the middle level's name shows nowhere on screen: read it from the app's own strings
        JsonPath strings = io.restassured.RestAssured.given().relaxedHTTPSValidation().get(CrmDeskFeature.DESK + "/locales/en/crm-desk-integration.json").jsonPath();
        String levels = strings.getString("settings.permissions.noAccess") + " / " + strings.getString("settings.permissions.customAccess") + " / "
                + strings.getString("settings.permissions.fullAccess");
        note("access levels in the app's strings: " + levels);
        assertEquals(strings.getString("settings.permissions.customAccess"), "Restricted Access",
                "Middle access level is not named as in Zoho (No Access / Restricted Access / Full Access); TAVI: " + levels);
    }

    // ---------------- I1 / I7 / I16 ----------------

    @CaseId({"I1", "I2"})
    @ZohoRef(value = "zoho/14-desk-ticket-crm-info.png", note = "Zoho ticket → CRM Contact Info")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-i"}, description = "Ticket #298: CRM Contact Info pane with Info / Potentials / Notes / Activities and the CRM values")
    public void paneOnLinkedTicket() {
        JsonPath info = api().read(INT + "/context/contact/" + CrmDeskFeature.DESK_CONTACT + "/info");
        DeskRecordPage d = new DeskRecordPage().openTicket(TICKET_298);
        assertTrue(d.showPane(), "CRM Contact Info pane not shown");
        String t = d.text();
        List<String> miss = missing(t, "CRM Contact Info", "Info", "Potentials", "Notes", "Activities", info.getString("data.email"));
        for (String label : info.<String>getList("data.fields.label")) if (!t.contains(label)) miss.add(label);
        assertTrue(miss.isEmpty(), "Pane lacks " + miss);
    }

    @CaseId("I7")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-i"}, description = "Ticket from a requester not in CRM: explicit 'Not linked to a CRM record' state with the search")
    public void paneOnUnlinkedTicket() {
        IntegrationApi o = api();
        Set<String> linked = o.links().stream().map(l -> String.valueOf(l.get("desk_record_id"))).collect(Collectors.toSet());
        String ticket = o.deskTickets().stream().filter(t -> t.get("contact_id") != null && !linked.contains(t.get("contact_id"))).map(t -> t.get("id")).findFirst()
                .orElseThrow(() -> new SkipException("INCONCLUSIVE: no ticket from an unlinked requester"));
        DeskRecordPage d = new DeskRecordPage().openTicket(ticket);
        d.showPane();
        String t = d.text();
        assertTrue(t.contains("Not linked to a CRM record"), "No 'Not linked to a CRM record' state on an unlinked ticket");
        assertTrue(t.contains("Link to CRM record") || t.contains("Search CRM"), "No way to link from the pane");
    }

    @CaseId("I16")
    @ZohoRef(value = "zoho/12-desk-ticket-list.png", note = "Zoho lists show labels, not raw values")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-i"}, description = "Desk contact list shows sync labels ('Synced', 'Needs attention'), not raw values")
    public void contactListShowsLabels() {
        String t = new DeskRecordPage().openContact(CrmDeskFeature.DESK_CONTACT).text();
        List<String> raw = new ArrayList<>();
        for (String line : t.split("\n")) if (line.trim().equals("needs_attention") || line.trim().equals("synced")) raw.add(line.trim());
        note("raw status values on the list: " + raw.stream().collect(Collectors.groupingBy(s -> s, Collectors.counting())));
        assertTrue(raw.isEmpty(), "The contact list shows raw sync values " + raw.stream().distinct().toList() + " instead of 'Synced' / 'Needs attention'");
    }

    // ---------------- K1 ----------------

    @CaseId("K1")
    @ZohoRef(value = "zoho/19-desk-handshake-mode.png", note = "Zoho Handshake Mode")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-k"}, description = "Ticket list Layout picker offers Handshake Mode while connected (not selected: it is a per-user preference)")
    public void handshakeModeOffered() {
        String t = new DeskRecordPage().openTicketList().layoutOptions();
        assertTrue(t.contains("Handshake Mode"), "Handshake Mode not offered in the Layout picker");
    }

    // ---------------- L1 – L3 / Z6 ----------------

    @CaseId({"L1", "L2", "L3"})
    @ZohoRef(value = "zoho/16-crm-contact-desk-related-list.png", note = "Zoho CRM contact → Zoho Desk related list")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "group-l"}, description = "CRM contact: Desk Tickets card with columns, statistics and the status filters")
    public void crmContactCard() {
        List<Map<String, Object>> rows = IntegrationApi.browser().list(INT + "/tickets/for-record?module_key=contacts&record_id=" + CRM_CONTACT);
        CrmRecordPage c = new CrmRecordPage().openContact(CRM_CONTACT);
        assertTrue(c.cardShown(), "Desk Tickets card not shown on the CRM contact");
        String t = c.text();
        List<String> miss = missing(t.toUpperCase(), "SUBJECT", "STATUS", "PRIORITY", "DEPARTMENT", "OWNER", "DUE DATE", "CREATED");
        for (Map<String, Object> r : rows) if (!t.contains(String.valueOf(r.get("subject")))) miss.add("ticket " + r.get("subject"));
        assertTrue(miss.isEmpty(), "Card lacks " + miss);
        String f = c.filters();
        note("filters: " + f.replace('\n', ' '));
        for (String x : List.of("All", "Open", "On hold", "Closed")) assertTrue(f.contains(x), "filter " + x);
    }

    @CaseId("Z6")
    @ZohoRef(value = "zoho/17-crm-desk-ticket-filters.png", note = "Zoho: All · Open · On Hold · Escalated · Closed · Overdue · High Priority")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "gap-check", "Z6"}, description = "Gap check Z6: Escalated / Overdue / High Priority filters (pass = still missing)")
    public void crmCardFiltersGap() {
        String f = new CrmRecordPage().openContact(CRM_CONTACT).filters();
        note("filters: " + f.replace('\n', ' '));
        assertFalse(f.contains("Escalated") || f.contains("High Priority"), "NOW BUILT — run the Z6 check fully: " + f);
    }

    @CaseId("Z7")
    @ZohoRef(value = "zoho/11-crm-desk-user-permission.png", note = "Zoho: Mutual Users + Invite Users")
    @Test(groups = {"crmdesk", "crmdesk-read", "crmdesk-ui", "gap-check", "Z7"}, description = "Gap check Z7: Mutual Users / Invite users on the CRM Permissions tab (pass = still missing)")
    public void mutualUsersGap() {
        String t = new IntegrationSettingsPage().openCrm().tab("Permissions").text();
        assertTrue(t.contains("Ticket Visibility"), "Ticket Visibility missing");
        assertFalse(t.contains("Mutual Users") || t.contains("Invite"), "NOW BUILT — run the Z7 check fully");
    }
}
