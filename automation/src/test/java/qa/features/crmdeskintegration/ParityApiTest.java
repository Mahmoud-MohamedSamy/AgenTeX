package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Zoho-parity checks (21 Oct 2026, user: "check everything so every item is either missing or implemented"): the Zoho
 * inventory items that were not yet verified. Writes QA CD records and changes one setting at a time, restored at once
 * and from the baseline at the end. CRM-only user: nameb56175 (CRM "User" profile, no Desk profile).
 */
public class ParityApiTest extends WriteBase {
    static final String CRM_ONLY = "nameb56175@airhemp.com";
    static final String CRM_ONLY_ID = "45ffbc5b-7859-4c21-be9e-7b5f30747ca2";
    static final String LEADS = "841043e1-c078-41f9-8d6e-dfd61bee45c3";
    static final String LEADS_LAYOUTS[] = {"f56991e7-692b-4c22-8a54-c5adb8a988fe", "bf971461-2edc-45f2-b6e4-6e180aa64288"};
    static Map<String, Object> baseline;
    static String ownedCrm, ownedDesk, ownedTicket;

    AppUser.App crmOnly() {
        return AppUser.as(CRM_ONLY).crm();
    }

    AppUser.App crmOnlyDesk() {
        return AppUser.as(CRM_ONLY).desk();
    }

    @BeforeClass(alwaysRun = true)
    public void start() throws Exception {
        Files.deleteIfExists(FACTS);
        baseline = config();
        fact("BASE", "run " + RUN + " row_version " + rowVersion(baseline) + " status " + baseline.get("status"));
        // a QA contact owned by the CRM-only user (for M2 / J12 / L8)
        ownedCrm = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "Owned " + RUN, "email", email("owned"), "owner", CRM_ONLY_ID));
        ownedDesk = waitPartner("contact", "crm", ownedCrm, 150);
        track("desk", DESK_CONTACTS, ownedDesk);
        fact("BASE", "QA contact owned by the CRM-only user: CRM " + ownedCrm + " -> Desk " + ownedDesk + " owner=" + val("crm", CRM_CONTACTS, ownedCrm, "owner"));
    }

    // ---------------- CRM-only user: settings, card, new ticket, actions (Zoho items 9, 87, 139; spec A2/A6/L8) ----------------

    @CaseId({"A2", "A6", "L8", "Z-9", "Z-87"})
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-parity"}, description = "CRM user without Desk: no settings; view tickets only; cannot create, reply or change tickets")
    public void crmOnlyUserLimits() {
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD L8 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", ownedDesk, "email", email("owned"), "channel", "web"));
        ownedTicket = t;
        Map<String, Response> r = new LinkedHashMap<>();
        r.put("GET config (crm)", crmOnly().get(INT + "/config"));
        r.put("GET status (crm)", crmOnly().get(INT + "/status"));
        r.put("GET tickets/for-record (crm)", crmOnly().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + ownedCrm));
        r.put("POST tickets/prefill (crm)", crmOnly().post(INT + "/tickets/prefill", Map.of("crm_module_key", "contacts", "crm_record_id", ownedCrm)));
        r.put("POST tickets (crm)", crmOnly().post(INT + "/tickets", Map.of("crm_module_key", "contacts", "crm_record_id", ownedCrm, "subject", "QA CD L8 by CRM-only " + RUN, "department_id", DESK_DEPARTMENT)));
        r.put("POST /desk/tickets/{id}/close (desk)", crmOnlyDesk().post("/desk/tickets/" + t + "/close", Map.of()));
        r.put("PATCH ticket priority (desk)", crmOnlyDesk().patch("/modules/" + DESK_TICKETS + "/records/" + t, Map.of("data", data(f("priority", "High")))));
        r.put("POST comment (desk)", crmOnlyDesk().post("/desk/tickets/" + t + "/comments", Map.of("body_html", "<p>QA CD comment by CRM-only user</p>")));
        r.forEach((k, v) -> fact("Z-87", "CRM-only user " + k + " -> " + code(v) + " " + trim(v.asString(), 160)));
        for (Response v : r.values()) if (v.statusCode() / 100 == 2) {
            try {
                String id = v.jsonPath().getString("data.id");
                if (id != null && v.asString().contains("ticket_number")) track("desk", DESK_TICKETS, id);
            } catch (Exception ignored) {
            }
        }
        List<String> fails = new ArrayList<>();
        if (r.get("GET config (crm)").statusCode() / 100 == 2) fails.add("CRM-only user can read the integration settings");
        if (r.get("POST tickets (crm)").statusCode() / 100 == 2) fails.add("CRM-only user created a Desk ticket (Zoho: creating needs a mutual user)");
        if (r.get("POST /desk/tickets/{id}/close (desk)").statusCode() / 100 == 2) fails.add("CRM-only user closed a ticket");
        if (r.get("PATCH ticket priority (desk)").statusCode() / 100 == 2) fails.add("CRM-only user changed a ticket field");
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- Ticket visibility (Zoho 79, spec J12/L19) ----------------

    @CaseId({"J12", "L19", "Z-79"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-parity"}, dependsOnMethods = "crmOnlyUserLimits", description = "'Departments the user is part of' hides tickets from a CRM user in no Desk department")
    public void ticketVisibility() {
        Response before = crmOnly().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + ownedCrm);
        putConfigOk("J12 user_departments", x -> x.put("ticket_visibility", "user_departments"));
        try {
            AppUser.sleep(3000);
            Response after = crmOnly().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + ownedCrm);
            Response ownerSees = crm().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + ownedCrm);
            fact("J12", "integrated_user: CRM-only sees ticket=" + before.asString().contains(ownedTicket) + " | user_departments: CRM-only " + code(after) + " sees ticket=" + after.asString().contains(ownedTicket)
                    + "; owner sees=" + ownerSees.asString().contains(ownedTicket));
            Assert.assertFalse(after.asString().contains(ownedTicket), "user in no Desk department still sees the ticket with 'departments of the user'");
        } finally {
            putConfigOk("restore visibility", x -> x.put("ticket_visibility", baseline.get("ticket_visibility")));
        }
    }

    // ---------------- Contact owner notified, mention reaches CRM (Zoho 61, 62, 91; spec M2, M6, M7) ----------------

    @CaseId({"M2", "M6", "M7", "Z-62", "Z-91"})
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-parity"}, dependsOnMethods = "crmOnlyUserLimits", description = "Ticket created for a contact owned by a CRM user notifies that owner; @mention of a CRM user reaches the CRM bell")
    public void ownerAndMentionNotified() {
        List<String> fails = new ArrayList<>();
        putConfigOk("M2 notify owner", x -> {
            Map<String, Object> n = WriteRunTest.notif(x);
            n.put("ticket_created", true);
            n.put("comment", true);
            n.put("mention", true);
            n.put("notify_crm_contact_owner", List.of("ticket_created"));
        });
        try {
            String since = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();
            String subject = "QA CD M2 " + RUN;
            String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", subject, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", ownedDesk, "email", email("owned"), "channel", "web"));
            String num = val("desk", DESK_TICKETS, t, "ticket_number");
            boolean owner = waitFor(90, () -> bell(since).stream().anyMatch(b -> b.contains(subject) || (num != null && b.contains(num))));
            fact("M2", "ticket #" + num + " for a contact owned by the CRM-only user -> owner's CRM bell entry=" + owner + " " + bell(since));
            if (!owner) fails.add("M2 contact owner not notified on ticket creation");

            String since2 = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();
            Response cm = desk().post("/desk/tickets/" + t + "/comments", Map.of("body_html",
                    "<p>QA CD mention <span class=\"rt-mention\" data-mention-id=\"" + CRM_ONLY_ID + "\" data-mention-kind=\"crm_user\">@test user 1</span></p>"));
            fact("M6", "comment with @crm_user mention -> " + code(cm) + " " + trim(cm.asString(), 200));
            boolean mention = waitFor(90, () -> !bell(since2).isEmpty());
            fact("M6", "CRM bell of the mentioned CRM user after the comment: " + bell(since2));
            if (!mention) fails.add("M6 @mention of a CRM user did not reach the CRM bell");
            Response mu = desk().get(INT + "/mentionable-users");
            boolean ownerToken = mu.asString().toLowerCase().contains("contact owner");
            fact("M7", "mentionable users offer an '@CRM Contact Owner' entry=" + ownerToken);
            if (!ownerToken) fails.add("M7 no @CRM Contact Owner mention");
        } finally {
            putConfigOk("restore notifications", x -> x.put("notifications", baseline.get("notifications")));
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- CRM card actions as the owner (spec L11–L13; Zoho 85, 86) ----------------

    @CaseId({"L11", "L12", "L13", "Z-85", "Z-86"})
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-parity"}, dependsOnMethods = "crmOnlyUserLimits", description = "The calls behind the CRM card's Update field / Close / Delete work")
    public void cardActions() {
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD L12 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", ownedDesk, "email", email("owned"), "channel", "web"));
        Response up = desk().patch("/modules/" + DESK_TICKETS + "/records/" + t, Map.of("data", data(f("priority", "High"))));
        String pr = val("desk", DESK_TICKETS, t, "priority");
        Response cl = desk().post("/desk/tickets/" + t + "/close", Map.of());
        String st = val("desk", DESK_TICKETS, t, "status");
        Response dl = desk().delete("/modules/" + DESK_TICKETS + "/records/" + t);
        boolean del = gone("desk", DESK_TICKETS, t);
        fact("L12", "update priority -> " + code(up) + " now " + pr + "; close -> " + code(cl) + " status " + st + "; delete -> " + code(dl) + " gone=" + del);
        Assert.assertTrue("high".equalsIgnoreCase(pr), "priority not updated: " + pr);
        Assert.assertTrue("Closed".equalsIgnoreCase(st), "not closed: " + st);
        Assert.assertTrue(del, "not deleted");
    }

    // ---------------- Lead handling (Zoho 49, 70) ----------------

    @CaseId({"K7", "Z-49", "Z-70"})
    @Test(priority = 5, groups = {"crmdesk", "crmdesk-parity"}, description = "A Desk contact whose email belongs to a CRM Lead is not created as a CRM contact (Zoho); ticket from a lead is Contacts/Leads")
    public void leadHandling() {
        String e = email("lead");
        String lead = null;
        for (String layout : LEADS_LAYOUTS) {
            Response r = createRaw("crm", LEADS, layout, f("first_name", "QA CD", "last_name", "Lead " + RUN, "email", e, "phone", "010" + String.format("%08d", System.currentTimeMillis() % 100_000_000), "single_line_3_9", "QA CD"));
            fact("Z-49", "create CRM lead on layout " + layout.substring(0, 8) + " -> " + code(r) + " " + msg(r) + " " + trim(r.asString(), 600));
            if (r.statusCode() / 100 == 2) {
                lead = r.jsonPath().getString("data.id");
                track("crm", LEADS, lead);
                break;
            }
        }
        if (lead == null) inconclusive("Z-49", "could not create a CRM lead");
        String d = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "Lead desk " + RUN, "email", e));
        AppUser.sleep(45_000);
        Map<String, Object> l = linkOf("contact", "desk", d);
        fact("Z-49", "Desk contact with a CRM lead's email: link=" + WriteRunTest.desc(l) + "; failure=" + failureText(d));
        if (l != null) track("crm", CRM_CONTACTS, String.valueOf(l.get("crm_record_id")));
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD lead ticket " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", d, "email", e, "channel", "web"));
        String bucket = classify(t);
        fact("K7", "ticket from the lead's email -> " + bucket);
        Assert.assertNull(l, "a CRM contact was created/linked for a person who is a CRM Lead (Zoho does not create it)");
    }

    // ---------------- One-way sync (Zoho 22, 24; spec G6) ----------------

    @CaseId({"G6", "Z-22", "Z-24"})
    @Test(priority = 6, groups = {"crmdesk", "crmdesk-parity"}, description = "CRM -> Desk only: Desk creates and edits stay in Desk; switching back is not retroactive")
    public void oneWay() {
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G6 " + RUN, "email", email("g6"), "title", "G6 start"));
        String d = waitPartner("contact", "crm", c, 150);
        track("desk", DESK_CONTACTS, d);
        Response put = putConfig(x -> {
            WriteRunTest.section(x, "contacts").put("direction", "crm_to_desk");
            for (Object m : WriteRunTest.mappings(x, "contacts")) ((Map<String, Object>) m).put("direction", "crm_to_desk");
        });
        fact("G6", "contacts one-way -> " + code(put) + " " + msg(put));
        if (put.statusCode() / 100 != 2) inconclusive("G6", "one-way setting refused: " + put.asString());
        String newDesk;
        boolean edited;
        try {
            newDesk = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G6 desk " + RUN, "email", email("g6d")));
            ok(update("desk", DESK_CONTACTS, d, f("title", "G6 desk edit")), "desk edit");
            AppUser.sleep(45_000);
            edited = "G6 desk edit".equals(val("crm", CRM_CONTACTS, c, "title"));
            Map<String, Object> nl = linkOf("contact", "desk", newDesk);
            fact("G6", "one-way: new Desk contact reached CRM=" + (nl != null) + "; Desk edit reached CRM=" + edited);
            if (nl != null) track("crm", CRM_CONTACTS, String.valueOf(nl.get("crm_record_id")));
            Assert.assertNull(nl, "Desk contact created in CRM while one-way");
            Assert.assertFalse(edited, "Desk edit written to CRM while one-way");
        } finally {
            restore("G6");
        }
        AppUser.sleep(30_000);
        fact("Z-24", "after switching back to two-way: CRM title=" + val("crm", CRM_CONTACTS, c, "title") + " (the one-way Desk edit is not pushed retroactively)");
    }

    // ---------------- Accounts match on name (Zoho 30; spec G10) ----------------

    @CaseId({"G10", "Z-30"})
    @Test(priority = 7, groups = {"crmdesk", "crmdesk-parity"}, description = "A CRM and a Desk account with the same name are linked, not duplicated")
    public void accountNameMatch() {
        String n = name("G10 acc");
        ok(desk().post(INT + "/pause", Map.of("reason", "QA CD G10")), "pause");
        String ca, da;
        try {
            ca = create("crm", CRM_ACCOUNTS, CRM_ACCOUNT_LAYOUT, f("account_name", n));
            da = create("desk", DESK_ACCOUNTS, DESK_ACCOUNT_LAYOUT, f("account_name", n));
        } finally {
            fact("G10", "resume -> " + code(desk().post(INT + "/resume", Map.of())));
        }
        waitFor(120, () -> linkOf("account", "crm", ca) != null);
        Map<String, Object> l = linkOf("account", "crm", ca), ld = linkOf("account", "desk", da);
        fact("G10", "CRM " + WriteRunTest.desc(l) + " | Desk " + WriteRunTest.desc(ld));
        if (l != null) track("desk", DESK_ACCOUNTS, String.valueOf(l.get("desk_record_id")));
        if (ld != null) track("crm", CRM_ACCOUNTS, String.valueOf(ld.get("crm_record_id")));
        Assert.assertNotNull(l, "CRM account not linked");
        Assert.assertEquals(String.valueOf(l.get("desk_record_id")), da, "same-name accounts not matched (duplicate created)");
    }

    // ---------------- Mandatory field, type mismatch, mapping not retroactive (Zoho 33, 34, 35; spec G18, C7) ----------------

    @CaseId({"G18", "Z-34"})
    @Test(priority = 8, groups = {"crmdesk", "crmdesk-parity"}, description = "CRM contact without the Desk-mandatory Last name: synced or a readable 'mandatory field missing' failure")
    public void mandatoryField() {
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD G18 " + RUN, "email", email("g18")));
        String d = waitPartner("contact", "crm", c, 90);
        track("desk", DESK_CONTACTS, d);
        String fail = failureText(c);
        fact("G18", "CRM contact without last_name -> Desk " + d + " last_name=" + (d == null ? null : val("desk", DESK_CONTACTS, d, "last_name")) + "; failure=" + fail);
        Assert.assertTrue(d != null || (fail != null && fail.toLowerCase().contains("mandatory")), "neither synced nor a 'mandatory field missing' failure");
    }

    @CaseId({"C7", "Z-33"})
    @Test(priority = 9, groups = {"crmdesk", "crmdesk-parity"}, description = "Mapping fields of different kinds is blocked at configuration")
    public void typeMismatchBlocked() {
        Map<String, Map<String, Object>> crmF = schema("crm", "contacts"), deskF = schema("desk", "desk_contacts");
        String pair = null;
        outer:
        for (Map.Entry<String, Map<String, Object>> a : crmF.entrySet())
            for (Map.Entry<String, Map<String, Object>> b : deskF.entrySet()) {
                Object ta = a.getValue().get("datatype"), tb = b.getValue().get("datatype");
                if ("number".equals(String.valueOf(ta)) && "single_line".equals(String.valueOf(tb))) {
                    pair = a.getKey() + ">" + b.getKey();
                    break outer;
                }
            }
        if (pair == null) pair = "email>phone";
        String[] p = pair.split(">");
        Response r = putConfig(x -> WriteRunTest.mappings(x, "contacts").add(WriteRunTest.map("crm_field", p[0], "desk_field", p[1], "direction", "crm_to_desk")));
        fact("C7", "map " + pair + " (" + crmF.getOrDefault(p[0], Map.of()).get("datatype") + " -> " + deskF.getOrDefault(p[1], Map.of()).get("datatype") + ") -> " + code(r) + " " + trim(r.asString(), 300));
        if (r.statusCode() / 100 == 2) restore("C7");
        Assert.assertNotEquals(r.statusCode() / 100, 2, "mapping of incompatible types accepted");
    }

    @CaseId({"G13", "Z-35"})
    @Test(priority = 10, groups = {"crmdesk", "crmdesk-parity"}, description = "A new mapping is not retroactive; the next edit carries the value")
    public void mappingNotRetroactive() {
        Map<String, Map<String, Object>> crmF = schema("crm", "contacts"), deskF = schema("desk", "desk_contacts");
        java.util.Set<String> mapped = new java.util.HashSet<>();
        for (Object m : WriteRunTest.mappings(config(), "contacts")) mapped.add(String.valueOf(((Map<?, ?>) m).get("desk_field")));
        String key = null;
        for (String k : crmF.keySet()) {
            Map<String, Object> df = deskF.get(k);
            if (df == null || mapped.contains(k)) continue;
            if (!"single_line".equals(String.valueOf(crmF.get(k).get("datatype"))) || !"single_line".equals(String.valueOf(df.get("datatype")))) continue;
            if (Boolean.TRUE.equals(df.get("read_only")) || Boolean.TRUE.equals(df.get("readonly"))) continue;
            key = k;
            break;
        }
        if (key == null) inconclusive("Z-35", "no unmapped single-line field exists on both sides");
        final String k = key;
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G13 " + RUN, "email", email("g13"), k, "before mapping"));
        String d = waitPartner("contact", "crm", c, 150);
        track("desk", DESK_CONTACTS, d);
        Response put = putConfig(x -> WriteRunTest.mappings(x, "contacts").add(WriteRunTest.map("crm_field", k, "desk_field", k, "direction", "crm_to_desk")));
        fact("G13", "map " + k + " (custom=" + crmF.get(k).get("is_custom") + ") -> " + code(put));
        try {
            AppUser.sleep(30_000);
            String retro = val("desk", DESK_CONTACTS, d, k);
            ok(update("crm", CRM_CONTACTS, c, f(k, "after mapping")), "edit after mapping");
            boolean arrived = waitFor(90, () -> "after mapping".equals(val("desk", DESK_CONTACTS, d, k)));
            fact("Z-35", "existing record after the new mapping: Desk " + k + "=" + retro + " (Zoho: not retroactive); after an edit arrived=" + arrived);
            Assert.assertTrue(arrived, "mapped field did not sync after an edit");
        } finally {
            restore("G13");
        }
    }

    // ---------------- Retry a fixed failure (Zoho 47; spec H11, E2E-5) ----------------

    @CaseId({"H11", "E2E-5", "Z-47"})
    @Test(priority = 11, groups = {"crmdesk", "crmdesk-parity"}, description = "Fix the record, Retry: the failure clears and the record syncs")
    public void retryFixedFailure() {
        String e = email("h11");
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "H11 crm " + RUN, "email", e));
        String d1 = waitPartner("contact", "crm", c, 150);
        track("desk", DESK_CONTACTS, d1);
        String d2 = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "H11 dup " + RUN, "email", e));
        waitFor(90, () -> failureOf(d2) != null);
        Map<String, Object> fl = failureOf(d2);
        if (fl == null) inconclusive("H11", "no failure for the duplicate (link=" + WriteRunTest.desc(linkOf("contact", "desk", d2)) + ")");
        String q = String.valueOf(fl.get("queue_id"));
        ok(update("desk", DESK_CONTACTS, d2, f("email", email("h11b"))), "fix the email");
        Response rt = desk().post(INT + "/failures/" + q + "/retry", Map.of());
        boolean cleared = waitFor(90, () -> failureOf(d2) == null);
        Map<String, Object> l = linkOf("contact", "desk", d2);
        fact("H11", "failure " + q + " fixed + retry -> " + code(rt) + "; cleared=" + cleared + "; record link=" + WriteRunTest.desc(l));
        if (l != null) track("crm", CRM_CONTACTS, String.valueOf(l.get("crm_record_id")));
        Map<String, Object> left = failureOf(d2);
        if (left != null) fact("H11", "discard leftover -> " + code(desk().post(INT + "/failures/" + left.get("queue_id") + "/discard", Map.of())));
        Assert.assertEquals(rt.statusCode() / 100, 2, "retry refused");
        Assert.assertTrue(cleared, "failure still listed after a fixed retry");
    }

    // ---------------- Handshake by phone (Zoho 59, 137; spec K4) ----------------

    @CaseId({"K4", "Z-59"})
    @Test(priority = 12, groups = {"crmdesk", "crmdesk-parity"}, description = "Ticket whose requester matches a CRM contact only by phone is classified as Contacts/Leads, not New")
    public void handshakeByPhone() {
        String phone = "0105" + (System.currentTimeMillis() % 10_000_000);
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "K4 " + RUN, "phone", phone));
        track("desk", DESK_CONTACTS, waitPartner("contact", "crm", c, 150));
        String t0 = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD K4a " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "phone", phone, "channel", "phone"));
        fact("K4", "ticket with only the phone, no requester -> " + classify(t0));
        String b;
        ok(desk().post(INT + "/pause", Map.of("reason", "QA CD K4")), "pause");
        try {
            String dc = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "K4 desk " + RUN, "phone", phone));
            String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD K4 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", dc, "phone", phone, "channel", "phone"));
            b = classify(t);
            fact("K4", "ticket of an unlinked Desk contact whose phone matches a CRM contact (sync paused) -> " + b);
        } finally {
            fact("K4", "resume -> " + code(desk().post(INT + "/resume", Map.of())));
        }
        Assert.assertNotEquals(b, "not_in_crm", "phone match not used for Handshake (Zoho classifies by email or phone)");
    }

    // ---------------- cleanup ----------------

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        try {
            if (Boolean.TRUE.equals(configStatus().get("paused"))) fact("CLEAN", "resume -> " + code(desk().post(INT + "/resume", Map.of())));
            restore("end");
        } catch (Exception e) {
            fact("CLEAN", "restore error " + e.getMessage());
        }
        List<String[]> order = new ArrayList<>(CREATED);
        Collections.reverse(order);
        order.sort((x, y) -> Integer.compare(rank2(x[1]), rank2(y[1])));
        for (String[] c : order) {
            try {
                fact("CLEAN", "delete " + c[0] + " " + c[1].substring(0, 8) + " " + c[2] + " -> " + deleteRecord(c[0], c[1], c[2]).statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + c[2] + " error " + e.getMessage());
            }
        }
    }

    static int rank2(String m) {
        return LEADS.equals(m) ? 2 : WriteRunTest.rank(m);
    }

    void restore(String why) {
        Map<String, Object> body = new LinkedHashMap<>(baseline);
        body.remove("status");
        body.put("row_version", config().get("row_version"));
        fact("RESTORE", why + " -> " + code(desk().putOnce(INT + "/config", body)));
    }

    List<String> bell(String since) {
        List<String> out = new ArrayList<>();
        List<Map<String, Object>> l = crmOnly().get("/notifications?page=1&per_page=30").jsonPath().getList("data.data");
        if (l != null) for (Map<String, Object> n : l)
            if (String.valueOf(n.get("created_at")).compareTo(since) > 0) out.add(n.get("event_type") + " '" + n.get("title") + "' " + n.get("body"));
        return out;
    }

    String classify(String ticketId) {
        List<Map<String, Object>> r = ok(desk().post(INT + "/tickets/classify", Map.of("ticket_ids", List.of(ticketId))), "classify").jsonPath().getList("data");
        return r == null || r.isEmpty() ? null : String.valueOf(r.get(0).get("bucket"));
    }

    List<Map<String, Object>> failures() {
        List<Map<String, Object>> l = ok(desk().get(INT + "/failures?page_size=100"), "failures").jsonPath().getList("data");
        return l == null ? List.of() : l;
    }

    Map<String, Object> failureOf(String recordId) {
        for (Map<String, Object> x : failures()) if (recordId.equals(String.valueOf(x.get("record_id")))) return x;
        return null;
    }

    String failureText(String recordId) {
        Map<String, Object> x = failureOf(recordId);
        return x == null ? null : x.get("error_code") + " '" + x.get("last_error") + "'";
    }

    Map<String, Map<String, Object>> schema(String side, String module) {
        Map<String, Map<String, Object>> out = new LinkedHashMap<>();
        List<Map<String, Object>> fs = ok(desk().get(INT + "/schema/" + side + "/" + module), "schema").jsonPath().getList("data.fields");
        for (Map<String, Object> m : fs) out.put(String.valueOf(m.get("key")), m);
        return out;
    }

    static String trim(String s, int n) {
        return WriteRunTest.trim(s, n);
    }
}
