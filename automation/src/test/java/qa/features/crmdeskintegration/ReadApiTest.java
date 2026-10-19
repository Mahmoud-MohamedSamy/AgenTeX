package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static org.testng.Assert.fail;
import static qa.features.crmdeskintegration.CrmDeskFeature.AGENT;
import static qa.features.crmdeskintegration.CrmDeskFeature.CRM_CONTACT;
import static qa.features.crmdeskintegration.CrmDeskFeature.DESK_CONTACT;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.CrmDeskFeature.OWNER;

/**
 * Run 1 — read-only API rows of the spec (no browser, nothing is changed: GETs, plus POST /tickets/classify which only
 * computes Handshake buckets). Groups: crmdesk, crmdesk-read; gap rows also "gap-check" (pass = still missing).
 */
public class ReadApiTest {
    private static final Pattern UUID_RE = Pattern.compile("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");

    private IntegrationApi owner() {
        return IntegrationApi.desk(OWNER);
    }

    private IntegrationApi agent() {
        return IntegrationApi.desk(AGENT);
    }

    private static void note(String s) {
        System.out.println("[crmdesk] " + s);
        io.qameta.allure.Allure.step(s);
    }

    // ---------------- A — access ----------------

    @CaseId("A3")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-a"}, description = "Agent without desk:integration:view cannot read the integration settings, runs, history, failures or links")
    public void agentCannotReadIntegrationAdminData() {
        IntegrationApi a = agent();
        List<String> leaks = new ArrayList<>();
        for (String p : List.of("/config", "/runs", "/history?days=7", "/failures", "/links", "/contracts/needs-attention")) {
            Response r = a.get(INT + p);
            note("agent GET " + p + " -> " + r.statusCode());
            if (r.statusCode() != 403) leaks.add(p + " -> " + r.statusCode());
        }
        int s = a.get(INT + "/status").statusCode();
        note("agent GET /status -> " + s + " (status is shared with agents so the pane can tell whether the integration is on)");
        assertTrue(leaks.isEmpty(), "Agent could read: " + leaks);
    }

    @CaseId("A10")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-a"}, description = "No token / a garbage token: 401 and no data, in both apps")
    public void noOrBadTokenIs401() {
        for (String[] app : new String[][]{{CrmDeskFeature.DESK, "desk"}, {CrmDeskFeature.CRM, "crm"}}) {
            Response none = AppUser.anonymous(app[0], app[1]).get(INT + "/config");
            Response bad = AppUser.anonymous(app[0], app[1]).header("Authorization", "Bearer x.y.z").get(INT + "/config");
            note(app[1] + ": no token -> " + none.statusCode() + ", garbage token -> " + bad.statusCode());
            assertEquals(none.statusCode(), 401, app[1] + " without token");
            assertEquals(bad.statusCode(), 401, app[1] + " with garbage token");
            assertFalse(none.asString().contains("\"contacts\""), "config leaked without token");
        }
    }

    @CaseId("A7")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-a"}, description = "CRM and Desk read the same settings object (same row_version)")
    public void bothAppsShareOneSettingsObject() {
        JsonPath d = owner().config();
        JsonPath c = IntegrationApi.crm(OWNER).config();
        note("row_version desk=" + d.getString("data.row_version") + " crm=" + c.getString("data.row_version"));
        assertEquals(c.getString("data.row_version"), d.getString("data.row_version"));
        assertEquals(c.getString("data.contacts.direction"), d.getString("data.contacts.direction"));
    }

    // ---------------- B — overview ----------------

    @CaseId("B1")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-b"}, description = "Status: connected, not paused, connected_at and last imports set, queue counts not negative, same as config.status")
    public void statusIsConsistent() {
        JsonPath s = owner().status();
        JsonPath c = owner().config();
        note("status enabled=" + s.getBoolean("data.enabled") + " paused=" + s.getBoolean("data.paused") + " queue=" + c.getMap("data.status.queue")
                + " health=" + c.getMap("data.status.health"));
        assertTrue(s.getBoolean("data.enabled"), "enabled");
        assertEquals(c.getBoolean("data.status.enabled"), s.getBoolean("data.enabled"));
        assertEquals(c.getBoolean("data.status.paused"), s.getBoolean("data.paused"));
        assertTrue(c.getString("data.status.connected_at") != null, "connected_at");
        for (String k : List.of("queued", "processing", "failed", "parked"))
            assertTrue(c.getInt("data.status.queue." + k) >= 0, k);
    }

    // ---------------- C — mappings against the schemas ----------------

    @CaseId("C3")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-c"}, description = "Every mapped field exists on both sides; no lookup or read-only Desk target; directions valid for the module direction")
    public void mappingsMatchSchemas() {
        IntegrationApi o = owner();
        JsonPath c = o.config();
        List<String> problems = new ArrayList<>();
        for (String[] m : new String[][]{{"contacts", "desk_contacts"}, {"accounts", "desk_accounts"}}) {
            Map<String, Map<String, Object>> crm = o.schema("crm", m[0]);
            Map<String, Map<String, Object>> desk = o.schema("desk", m[1]);
            String dir = c.getString("data." + m[0] + ".direction");
            List<Map<String, Object>> maps = c.getList("data." + m[0] + ".mappings");
            note(m[0] + ": direction " + dir + ", " + maps.size() + " mappings; CRM fields " + crm.size() + ", Desk fields " + desk.size()
                    + " (custom on CRM: " + crm.keySet().stream().filter(k -> k.matches(".*_\\d+(_\\d+)?$")).count() + ")");
            Set<String> seenDesk = new HashSet<>();
            for (Map<String, Object> x : maps) {
                String cf = String.valueOf(x.get("crm_field")), df = String.valueOf(x.get("desk_field")), d = String.valueOf(x.get("direction"));
                if (!crm.containsKey(cf)) problems.add(m[0] + ": CRM field '" + cf + "' not in schema");
                if (!desk.containsKey(df)) problems.add(m[0] + ": Desk field '" + df + "' not in schema");
                else if (Boolean.TRUE.equals(desk.get(df).get("read_only"))) problems.add(m[0] + ": Desk field '" + df + "' is read-only");
                if (!seenDesk.add(df)) problems.add(m[0] + ": Desk field '" + df + "' mapped twice");
                if ("crm_to_desk".equals(dir) && !"crm_to_desk".equals(d)) problems.add(m[0] + ": field " + df + " is " + d + " while the module is one-way");
                if (!Set.of("two_way", "crm_to_desk", "desk_to_crm").contains(d)) problems.add(m[0] + ": unknown direction " + d);
            }
        }
        assertTrue(problems.isEmpty(), String.join("; ", problems));
    }

    @CaseId("C4")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-c"}, description = "Mapped pairs hold the same kind of data (no text→number, pick list→text …)")
    public void mappedPairsHaveCompatibleTypes() {
        IntegrationApi o = owner();
        JsonPath c = o.config();
        List<String> problems = new ArrayList<>();
        for (String[] m : new String[][]{{"contacts", "desk_contacts"}, {"accounts", "desk_accounts"}}) {
            Map<String, Map<String, Object>> crm = o.schema("crm", m[0]);
            Map<String, Map<String, Object>> desk = o.schema("desk", m[1]);
            for (Map<String, Object> x : c.<Map<String, Object>>getList("data." + m[0] + ".mappings")) {
                Map<String, Object> cf = crm.get(String.valueOf(x.get("crm_field"))), df = desk.get(String.valueOf(x.get("desk_field")));
                if (cf == null || df == null) continue;
                String a = String.valueOf(cf.get("datatype")), b = String.valueOf(df.get("datatype"));
                note(m[0] + ": " + x.get("crm_field") + " (" + a + ") ⇄ " + x.get("desk_field") + " (" + b + ")");
                if (!a.equals(b) && !(Set.of("user", "owner", "lookup").contains(a) && Set.of("user", "owner", "lookup").contains(b)))
                    problems.add(m[0] + ": " + x.get("crm_field") + " " + a + " vs " + x.get("desk_field") + " " + b);
            }
        }
        assertTrue(problems.isEmpty(), "Type mismatches in the saved mappings: " + problems);
    }

    // ---------------- E — related lists ----------------

    @CaseId("E10")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-e"}, description = "CRM Related Lists offer every non-activity CRM module")
    public void relatedListsFollowCrmModules() {
        List<Map<String, Object>> crmModules = IntegrationApi.crm(OWNER).list("/modules");
        Set<String> expected = crmModules.stream().filter(m -> "module".equals(m.get("moduleType"))).map(m -> String.valueOf(m.get("moduleKey"))).collect(Collectors.toCollection(java.util.TreeSet::new));
        Set<String> offered = owner().list(INT + "/related-list-modules").stream().map(m -> String.valueOf(m.get("module_key"))).collect(Collectors.toCollection(java.util.TreeSet::new));
        note("CRM modules " + expected + "; offered " + offered + ". Zoho also offers Products, Vendors, Cases — TAVI CRM has no such modules");
        assertEquals(offered, expected);
    }

    // ---------------- H — history and failures ----------------

    @CaseId("H1")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-h"}, description = "Sync History covers the last 7 days with known directions and modules and non-negative counts")
    public void historyShape() {
        List<Map<String, Object>> h = owner().list(INT + "/history?days=7&tz=Africa/Cairo");
        LocalDate today = LocalDate.now(ZoneId.of("Africa/Cairo"));
        List<String> problems = new ArrayList<>();
        for (Map<String, Object> r : h) {
            LocalDate d = LocalDate.parse(String.valueOf(r.get("date")));
            if (d.isBefore(today.minusDays(7)) || d.isAfter(today)) problems.add("date " + d);
            if (!Set.of("crm_to_desk", "desk_to_crm").contains(r.get("direction"))) problems.add("direction " + r.get("direction"));
            if (!Set.of("contacts", "accounts", "contracts", "calls", "tickets").contains(r.get("module"))) problems.add("module " + r.get("module"));
            if (((Number) r.get("added")).intValue() < 0 || ((Number) r.get("updated")).intValue() < 0) problems.add("negative count " + r);
        }
        note(h.size() + " history rows; e.g. " + (h.isEmpty() ? "-" : h.get(0)));
        assertTrue(problems.isEmpty(), String.join("; ", problems));
    }

    @CaseId("H3")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-h"}, description = "NDC-1669 §10: Sync History shows failed counts as well as added / updated")
    public void historyHasFailedCounts() {
        List<Map<String, Object>> h = owner().list(INT + "/history?days=7&tz=Africa/Cairo");
        if (h.isEmpty()) throw new SkipException("INCONCLUSIVE: no history rows in the last 7 days");
        note("history row keys: " + h.get(0).keySet() + "; failure log has " + owner().list(INT + "/failures").size() + " entries");
        assertTrue(h.get(0).containsKey("failed"), "History rows have no 'failed' count (only " + h.get(0).keySet() + ") although the Failure Log has entries");
    }

    @CaseId("H10")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-h"}, description = "NDC-1669 §10: failure reasons are human-readable (name the record, no raw ids)")
    public void failureReasonsAreReadable() {
        List<Map<String, Object>> f = owner().list(INT + "/failures");
        if (f.isEmpty()) throw new SkipException("INCONCLUSIVE: the Failure Log is empty");
        List<String> raw = new ArrayList<>();
        for (Map<String, Object> x : f) {
            String e = String.valueOf(x.get("last_error"));
            note("failure " + x.get("module_key") + " / " + x.get("error_code") + ": " + UUID_RE.matcher(e).replaceAll("<id>"));
            if (UUID_RE.matcher(e).find()) raw.add(x.get("error_code") + ": " + UUID_RE.matcher(e).replaceAll("<id>"));
        }
        assertTrue(raw.isEmpty(), raw.size() + " of " + f.size() + " reasons show raw record ids instead of names, e.g. " + raw.get(0));
    }

    // ---------------- I — pane data ----------------

    @CaseId("I2")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-i"}, description = "CRM pane Info returns exactly panel.info_fields.contacts, with the CRM values")
    public void paneInfoFieldsFollowConfig() {
        IntegrationApi o = owner();
        List<String> configured = o.config().getList("data.panel.info_fields.contacts");
        JsonPath info = o.read(INT + "/context/contact/" + DESK_CONTACT + "/info");
        List<String> shown = info.getList("data.fields.key");
        note("configured " + configured + "; shown " + shown);
        assertEquals(shown, configured);
        assertEquals(info.getString("data.record_id"), CRM_CONTACT, "linked CRM record");
    }

    @CaseId("I7")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-i"}, description = "A Desk contact that is not linked gets an explicit 'not linked' answer from the pane API, not an error or empty data")
    public void unlinkedContactAnswer() {
        IntegrationApi o = owner();
        Set<String> linked = o.links().stream().map(l -> String.valueOf(l.get("desk_record_id"))).collect(Collectors.toSet());
        String unlinked = o.deskTickets().stream().map(t -> t.get("contact_id")).filter(id -> id != null && !linked.contains(id)).findFirst()
                .orElseThrow(() -> new SkipException("INCONCLUSIVE: every ticket requester is linked"));
        Response r = o.get(INT + "/context/contact/" + unlinked + "/info");
        String body = UUID_RE.matcher(r.asString()).replaceAll("<id>");
        note("unlinked contact info -> " + r.statusCode() + " " + body.substring(0, Math.min(300, body.length())));
        assertTrue(r.statusCode() == 200 || r.statusCode() == 404, "unexpected status " + r.statusCode());
        assertFalse(r.asString().contains("\"code\":\"INTERNAL"), "server error for an unlinked contact");
    }

    @CaseId("I17")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-i"}, description = "Links: every link has a sync status and both record ids; account links exist when accounts sync two-way")
    public void linksAreComplete() {
        IntegrationApi o = owner();
        List<Map<String, Object>> l = o.links();
        Map<String, Long> kinds = l.stream().collect(Collectors.groupingBy(x -> String.valueOf(x.get("kind")), LinkedHashMap::new, Collectors.counting()));
        Map<String, Long> statuses = l.stream().collect(Collectors.groupingBy(x -> String.valueOf(x.get("sync_status")), LinkedHashMap::new, Collectors.counting()));
        note("links by kind " + kinds + ", by status " + statuses);
        for (Map<String, Object> x : l) {
            assertTrue(x.get("crm_record_id") != null && x.get("desk_record_id") != null, "link without ids: " + x.get("id"));
            assertTrue(x.get("sync_status") != null, "link without status: " + x.get("id"));
        }
        if ("two_way".equals(o.config().getString("data.accounts.direction")) && !kinds.containsKey("account"))
            fail("Accounts sync two-way, but there is not a single account link (contacts: " + kinds.get("contact") + ")");
    }

    // ---------------- K — Handshake buckets ----------------

    @CaseId({"K2", "K7", "K8"})
    @Test(groups = {"crmdesk", "crmdesk-read", "group-k"}, description = "Handshake buckets match the requester: linked CRM contact without deals → Contacts/Leads; not in CRM → New")
    public void handshakeBucketsMatchRequesters() {
        IntegrationApi o = owner();
        List<Map<String, String>> tickets = o.deskTickets();
        Map<String, String> buckets = o.classify(tickets.stream().map(t -> t.get("id")).toList());
        Set<String> linked = o.links().stream().filter(l -> "contact".equals(l.get("kind"))).map(l -> String.valueOf(l.get("desk_record_id"))).collect(Collectors.toSet());
        Map<String, Long> count = buckets.values().stream().collect(Collectors.groupingBy(b -> b, LinkedHashMap::new, Collectors.counting()));
        note(tickets.size() + " tickets classified: " + count);
        assertEquals(buckets.size(), tickets.size(), "every ticket gets a bucket");
        Map<String, Boolean> hasDeals = new HashMap<>();
        List<String> wrong = new ArrayList<>();
        for (Map<String, String> t : tickets) {
            String b = buckets.get(t.get("id")), c = t.get("contact_id");
            assertTrue(Set.of("won_customer", "open_prospect", "crm_contact_or_lead", "not_in_crm").contains(b), "unknown bucket " + b);
            if (c == null) continue;
            if (linked.contains(c)) {
                boolean deals = hasDeals.computeIfAbsent(c, id -> !o.list(INT + "/context/contact/" + id + "/potentials").isEmpty());
                if (!deals && !"crm_contact_or_lead".equals(b)) wrong.add("#" + t.get("ticket_number") + " linked, no deals → " + b);
            } else if ("won_customer".equals(b) || "open_prospect".equals(b)) {
                wrong.add("#" + t.get("ticket_number") + " requester not linked → " + b);
            }
        }
        if (!hasDeals.containsValue(true)) note("No linked requester has a CRM deal: K3 / K5 / K6 (Customers, Potentials) need deal data — Inconclusive in a read-only run");
        assertTrue(wrong.isEmpty(), String.join("; ", wrong));
    }

    // ---------------- L — CRM side card ----------------

    @CaseId({"L1", "L2"})
    @Test(groups = {"crmdesk", "crmdesk-read", "group-l"}, description = "Desk Tickets card on a CRM contact lists the Desk contact's tickets, and the statistics match the list")
    public void crmCardMatchesDeskTickets() {
        IntegrationApi crm = IntegrationApi.crm(OWNER);
        List<Map<String, Object>> card = crm.list(INT + "/tickets/for-record?module_key=contacts&record_id=" + CRM_CONTACT);
        Set<String> cardIds = card.stream().map(t -> String.valueOf(t.get("id"))).collect(Collectors.toCollection(java.util.TreeSet::new));
        Set<String> deskIds = owner().deskTickets().stream().filter(t -> DESK_CONTACT.equals(t.get("contact_id"))).map(t -> t.get("id")).collect(Collectors.toCollection(java.util.TreeSet::new));
        note("card " + card.size() + " tickets, Desk has " + deskIds.size() + " for the contact");
        assertEquals(cardIds, deskIds, "card vs Desk tickets of the contact");
        JsonPath s = crm.read(INT + "/stats?module_key=contacts&record_id=" + CRM_CONTACT);
        long open = card.stream().filter(t -> "Open".equals(t.get("status"))).count();
        long closed = card.stream().filter(t -> "Closed".equals(t.get("status"))).count();
        note("stats " + s.getMap("data"));
        assertEquals(s.getInt("data.total"), card.size(), "total");
        assertEquals(s.getInt("data.open"), (int) open, "open");
        assertEquals(s.getInt("data.closed"), (int) closed, "closed");
    }

    // ---------------- M — mentions ----------------

    @CaseId("M5")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-m"}, description = "Mentionable users: Desk agents and CRM users, each with a known kind")
    public void mentionableUsers() {
        List<Map<String, Object>> u = owner().list(INT + "/mentionable-users");
        Map<String, Long> kinds = u.stream().collect(Collectors.groupingBy(x -> String.valueOf(x.get("kind")), LinkedHashMap::new, Collectors.counting()));
        note(u.size() + " mentionable users by kind " + kinds);
        assertFalse(u.isEmpty());
        for (Map<String, Object> x : u) assertTrue(Set.of("agent", "crm_user").contains(String.valueOf(x.get("kind"))), "kind " + x.get("kind"));
        if (!kinds.containsKey("crm_user")) note("No crm_user entries: every CRM user is also a Desk agent here — CRM-only mentions not checkable");
    }

    // ---------------- O — security ----------------

    @CaseId("O3")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-o"}, description = "Random ids: 404 without details for context, stats and links")
    public void randomIdsAre404() {
        IntegrationApi o = owner();
        String id = UUID.randomUUID().toString();
        List<String> wrong = new ArrayList<>();
        for (String p : List.of("/context/contact/" + id + "/info", "/customers/contact/" + id + "/stats", "/tickets/" + id + "/deal")) {
            Response r = o.get(INT + p);
            String body = r.asString().replace(id, "<random>");
            note("GET " + p.replace(id, "<random>") + " -> " + r.statusCode() + " " + body.substring(0, Math.min(200, body.length())));
            assertFalse(r.asString().toLowerCase().contains("exception") || r.asString().contains("stack"), "error details leaked");
            if (r.statusCode() != 404 && r.statusCode() != 400) wrong.add(p.replace(id, "<random>") + " -> " + r.statusCode());
        }
        assertTrue(wrong.isEmpty(), "A record that does not exist is answered as if it existed: " + wrong);
    }

    @CaseId("O4")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-o"}, description = "Status and settings carry no tokens or secrets")
    public void noSecretsInSettings() {
        String all = (owner().get(INT + "/status").asString() + owner().get(INT + "/config").asString()).toLowerCase();
        for (String k : List.of("access_token", "refresh_token", "client_secret", "password", "\"secret\"", "api_key"))
            assertFalse(all.contains(k), "settings contain " + k);
    }

    // ---------------- J — permissions default (Zoho: only the administrator profile) ----------------

    @CaseId("J1a")
    @Test(groups = {"crmdesk", "crmdesk-read", "group-j", "Z9"}, description = "Default CRM data access matches Zoho: only the Administrator profile; others no access until ticked")
    public void defaultAccessIsAdminOnly() {
        List<Object> pa = owner().config().getList("data.panel.profile_access");
        note("panel.profile_access = " + pa + " (empty = every profile Full Access)");
        assertFalse(pa == null || pa.isEmpty(), "No profile restrictions are stored: every Desk profile (agents, light agents …) has Full Access to CRM data. Zoho starts with only the Administrator profile");
    }

    // ---------------- Z — gap checks (pass = still missing, fail = now built: run the full check) ----------------

    @CaseId({"Z1", "Z2", "Z7"})
    @Test(groups = {"crmdesk", "crmdesk-read", "gap-check"}, description = "Gap routes still absent: products, list-views, invite / light-agents")
    public void gapRoutesStillMissing() {
        IntegrationApi o = owner();
        List<String> built = new ArrayList<>();
        for (String p : List.of("/products", "/list-views", "/invite", "/light-agents")) {
            int s = o.get(INT + p).statusCode();
            note("GET " + p + " -> " + s);
            if (s != 404) built.add(p + " -> " + s);
        }
        JsonPath c = o.config();
        if (c.get("data.products") != null) built.add("config.products present");
        assertTrue(built.isEmpty(), "NOW BUILT — run the full Z checks: " + built);
    }

    @CaseId({"Z3", "Z5"})
    @Test(groups = {"crmdesk", "crmdesk-read", "gap-check"}, description = "No matching-key setting in the contacts config; pane fields still a fixed list")
    public void configGapsStillMissing() {
        JsonPath c = owner().config();
        Map<String, Object> contacts = c.getMap("data.contacts");
        note("contacts config keys " + contacts.keySet() + "; info_fields.contacts " + c.getList("data.panel.info_fields.contacts"));
        assertEquals(contacts.keySet(), Set.of("direction", "mappings"), "NOW BUILT? contacts config has new keys");
        assertEquals(c.getList("data.panel.info_fields.contacts").size(), 8, "pane field list changed");
    }
}
