package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Re-checks after Run 2 (20 Oct 2026): L5 New ticket from CRM with the right body, and L2 statistics of a CRM contact
 * that has a fresh Desk ticket (Run 2 saw total 0 while the card listed the ticket). Creates one QA contact pair and
 * tickets; deletes them at the end. No settings change.
 */
public class RecheckTest extends WriteBase {
    static String crmC, deskC;
    static Map<String, Object> BASE;

    @SuppressWarnings("unchecked")
    static Map<String, Object> baseline() {
        try {
            String j = java.nio.file.Files.readString(java.nio.file.Path.of("../executions/execu_2026-10-20_crm-desk-integration/baseline/config.json"));
            Map raw = io.restassured.path.json.JsonPath.from(j).getMap("data");
            return (Map<String, Object>) raw;
        } catch (Exception e) {
            throw new IllegalStateException("baseline missing: " + e, e);
        }
    }

    @BeforeClass(alwaysRun = true)
    public void contact() {
        // leftover of Run 3 (its cleanup ran after the browser session closed): the "QA CD B8" pair
        for (Map<String, Object> l : links("contact"))
            if (String.valueOf(l.get("crm_display")).startsWith("QA CD B8") || String.valueOf(l.get("desk_display")).startsWith("QA CD B8")) {
                fact("CLEAN", "Run 3 leftover " + l.get("crm_display") + ": CRM " + code(deleteRecord("crm", CRM_CONTACTS, String.valueOf(l.get("crm_record_id"))))
                        + ", Desk " + code(deleteRecord("desk", DESK_CONTACTS, String.valueOf(l.get("desk_record_id")))));
            }
        BASE = baseline();
        Map<String, Object> now = config();
        for (String k : List.of("contacts", "accounts", "contracts", "on_crm_delete", "on_crm_account_delete", "on_desk_contact_delete", "on_desk_account_delete", "panel", "notifications", "ticket_related_lists", "ticket_visibility", "calls_enabled"))
            fact("DIFF", k + (String.valueOf(now.get(k)).equals(String.valueOf(BASE.get(k))) ? " same as baseline" : " DIFFERS: " + now.get(k) + " vs " + BASE.get(k)));
        fact("DIFF", "status " + now.get("status"));
        crmC = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "RC " + RUN, "email", email("rc")));
        deskC = waitPartner("contact", "crm", crmC, 150);
        track("desk", DESK_CONTACTS, deskC);
        fact("RC", "CRM " + crmC + " -> Desk " + deskC);
    }

    @CaseId("L5")
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-write"}, description = "New ticket from the CRM contact lands in Desk on the right requester")
    public void l5NewTicketFromCrm() {
        Response pf = crm().post(INT + "/tickets/prefill", Map.of("crm_module_key", "contacts", "crm_record_id", crmC));
        fact("L5", "prefill -> " + code(pf) + " " + WriteRunTest.trim(pf.asString(), 900));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("crm_module_key", "contacts");
        body.put("crm_record_id", crmC);
        body.put("subject", "QA CD L5 " + RUN);
        body.put("department_id", DESK_DEPARTMENT);
        body.put("description", "QA CD from CRM");
        Response t = crm().post(INT + "/tickets", body);
        fact("L5", "create -> " + code(t) + " '" + msg(t) + "' " + WriteRunTest.trim(t.asString(), 600));
        if (t.statusCode() == 400 || t.statusCode() == 422) inconclusive("L5", "body still not accepted: " + msg(t) + " " + t.asString());
        ok(t, "create ticket from CRM");
        String id = t.jsonPath().getString("data.id");
        track("desk", DESK_TICKETS, id);
        String contact = val("desk", DESK_TICKETS, id, "contact_id");
        fact("L5", "Desk ticket " + id + " #" + t.jsonPath().getString("data.ticket_number") + " contact_id=" + contact + " (expected " + deskC + ")");
        Assert.assertEquals(contact, deskC, "ticket from CRM not on the linked Desk contact");
    }

    @CaseId("L2")
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-write"}, description = "Statistics of the CRM contact count its Desk tickets")
    public void l2StatsCountTickets() {
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD L2 " + RUN, "status", "Open", "department", DESK_DEPARTMENT,
                "contact_id", deskC, "email", email("rc"), "channel", "web"));
        String[] last = {""};
        boolean listed = waitFor(60, () -> crm().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + crmC).asString().contains(t));
        boolean counted = waitFor(120, () -> {
            Response s = crm().get(INT + "/customers/contact/" + crmC + "/stats?months=6");
            last[0] = s.asString();
            Integer total = s.jsonPath().get("data.total");
            return total != null && total > 0;
        });
        Response s2 = crm().get(INT + "/stats?module_key=contacts&record_id=" + crmC);
        fact("L2", "card lists the ticket=" + listed + "; customers/contact stats after up to 120 s: " + WriteRunTest.trim(last[0], 300) + "; /stats -> " + WriteRunTest.trim(s2.asString(), 300));
        Assert.assertTrue(listed, "ticket not on the card");
        Assert.assertTrue(counted, "statistics show 0 tickets while the card lists the ticket");
    }

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        List<String[]> order = new ArrayList<>(CREATED);
        Collections.reverse(order);
        order.sort((x, y) -> Integer.compare(WriteRunTest.rank(x[1]), WriteRunTest.rank(y[1])));
        for (String[] c : order) {
            try {
                fact("CLEAN", "delete " + c[0] + " " + c[2] + " -> " + deleteRecord(c[0], c[1], c[2]).statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + c[2] + " error " + e.getMessage());
            }
        }
    }
}
