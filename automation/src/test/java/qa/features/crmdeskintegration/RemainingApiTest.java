package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.file.Files;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Remaining spec rows, API side (user: "run the remaining 45 rows", 21 Oct 2026): contracts D3, D5–D12, delete
 * preferences E8 / E9, sync race G14, failure path G17, audit F8, ticket contract L22, journey E2E-3.
 * One setting at a time, restored at once and from the baseline at the end; QA CD records deleted at the end.
 */
public class RemainingApiTest extends WriteBase {
    static final String DESK_CONTRACTS = "0924eb24-e42a-4eab-8efd-e3428f19e882";
    static Map<String, Object> baseline;
    static String acc, accDesk, con, conDesk;

    @BeforeClass(alwaysRun = true)
    public void start() throws Exception {
        Files.deleteIfExists(FACTS);
        baseline = config();
        fact("BASE", "run " + RUN + " rv " + rowVersion(baseline));
        acc = create("crm", CRM_ACCOUNTS, CRM_ACCOUNT_LAYOUT, f("account_name", name("D acc")));
        accDesk = waitPartner("account", "crm", acc, 150);
        track("desk", DESK_ACCOUNTS, accDesk);
        con = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "D con " + RUN, "email", email("dcon"), "account_id", acc));
        conDesk = waitPartner("contact", "crm", con, 150);
        track("desk", DESK_CONTACTS, conDesk);
        fact("BASE", "account " + acc + " -> " + accDesk + "; contact " + con + " -> " + conDesk);
    }

    String deal(String label, String stage) {
        return create("crm", CRM_DEALS, CRM_DEAL_LAYOUT, f("deal_name", name(label), "pipeline", CRM_DEAL_PIPELINE, "stage", stage, "contact_id", con, "account_id", acc,
                "amount", 1200, "closing_date", LocalDate.now().toString()));
    }

    Map<String, Object> contractOf(String dealId) {
        for (Map<String, Object> l : links("contract")) if (dealId.equals(String.valueOf(l.get("crm_record_id")))) return l;
        List<Map<String, Object>> na = ok(desk().get(INT + "/contracts/needs-attention"), "na").jsonPath().getList("data");
        if (na != null) for (Map<String, Object> l : na) if (dealId.equals(String.valueOf(l.get("crm_record_id")))) return l;
        return null;
    }

    Map<String, Object> waitContract(String dealId, int s) {
        Map<String, Object>[] out = new Map[]{null};
        waitFor(s, () -> (out[0] = contractOf(dealId)) != null);
        if (out[0] != null && out[0].get("desk_record_id") != null) track("desk", DESK_CONTRACTS, String.valueOf(out[0].get("desk_record_id")));
        return out[0];
    }

    String cStatus(Map<String, Object> l) {
        return l == null || l.get("desk_record_id") == null ? null : val("desk", DESK_CONTRACTS, String.valueOf(l.get("desk_record_id")), "status");
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> contracts(Map<String, Object> c) {
        return (Map<String, Object>) c.get("contracts");
    }

    void restore(String why) {
        Map<String, Object> b = new LinkedHashMap<>(baseline);
        b.remove("status");
        b.put("row_version", config().get("row_version"));
        fact("RESTORE", why + " -> " + code(desk().putOnce(INT + "/config", b)));
    }

    // ---------------- D3 draft off ----------------
    @CaseId("D3")
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-remaining"}, description = "Draft switched off: an incomplete won deal makes no draft contract")
    public void d3DraftOff() {
        putConfigOk("D3", x -> contracts(x).put("create_draft_when_incomplete", false));
        try {
            String d = deal("D3", "closed_won");
            Map<String, Object> l = waitContract(d, 60);
            fact("D3", "draft off, won deal without end date -> " + (l == null ? "no contract link" : l.get("sync_status") + " desk=" + l.get("desk_record_id") + " status=" + cStatus(l) + " missing=" + l.get("missing_fields")));
            Assert.assertTrue(l == null || l.get("desk_record_id") == null, "a contract was created although drafts are off");
        } finally {
            restore("D3");
        }
    }

    // ---------------- D5 lost keep / terminate, D4 reopen terminate ----------------
    @CaseId({"D5", "D4"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-remaining"}, description = "Won deal marked lost / reopened under keep and terminate")
    public void d5LostAndReopen() {
        List<String> fails = new ArrayList<>();
        String a = deal("D5 keep", "closed_won");
        Map<String, Object> la = waitContract(a, 90);
        ok(update("crm", CRM_DEALS, a, f("stage", "closed_lost", "reason_for_loss", "no_budget")), "lost");
        AppUser.sleep(30_000);
        fact("D5", "lost with keep -> contract status " + cStatus(contractOf(a)) + " (before " + cStatus(la) + ")");
        putConfigOk("D5 terminate", x -> {
            contracts(x).put("on_deal_lost", "terminate");
            contracts(x).put("on_deal_reopen", "terminate");
        });
        try {
            String b = deal("D5 term", "closed_won");
            waitContract(b, 90);
            ok(update("crm", CRM_DEALS, b, f("stage", "closed_lost", "reason_for_loss", "no_budget")), "lost b");
            boolean t1 = waitFor(60, () -> "terminated".equalsIgnoreCase(String.valueOf(cStatus(contractOf(b)))));
            fact("D5", "lost with terminate -> contract status " + cStatus(contractOf(b)));
            if (!t1) fails.add("D5 lost+terminate: status " + cStatus(contractOf(b)));
            String r = deal("D4 term", "closed_won");
            waitContract(r, 90);
            ok(update("crm", CRM_DEALS, r, f("stage", "negotiation")), "reopen");
            boolean t2 = waitFor(60, () -> "terminated".equalsIgnoreCase(String.valueOf(cStatus(contractOf(r)))));
            fact("D4", "reopened with terminate -> contract status " + cStatus(contractOf(r)));
            if (!t2) fails.add("D4 reopen+terminate: status " + cStatus(contractOf(r)));
        } finally {
            restore("D5");
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- D6 lock, D7 defaults, D8 cancel / recreate ----------------
    @CaseId({"D6", "D7", "D8"})
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-remaining"}, description = "Lock CRM-owned fields; default owner / support level; cancel and recreate")
    public void d6d7d8() {
        List<String> fails = new ArrayList<>();
        putConfigOk("D7 defaults", x -> {
            contracts(x).put("default_owner_user_id", AGENT_ID);
            contracts(x).put("default_support_level", "premium");
        });
        Response chk = desk().get(INT + "/config");
        fact("D7", "defaults stored: " + contracts(chk.jsonPath().getMap("data")).get("default_owner_user_id") + " / " + contracts(chk.jsonPath().getMap("data")).get("default_support_level"));
        try {
            String d = deal("D6", "closed_won");
            Map<String, Object> l = waitContract(d, 90);
            if (l == null || l.get("desk_record_id") == null) inconclusive("D6", "no contract created");
            String cid = String.valueOf(l.get("desk_record_id"));
            Map<String, String> c = rec("desk", DESK_CONTRACTS, cid);
            fact("D7", "contract owner=" + c.get("owner") + " support_level=" + c.get("support_level") + " (deal owner = owner account)");
            Response e1 = update("desk", DESK_CONTRACTS, cid, f("contract_name", "QA CD edited in Desk"));
            fact("D6", "lock on: edit CRM-owned contract_name in Desk -> " + code(e1) + " '" + msg(e1) + "' now=" + val("desk", DESK_CONTRACTS, cid, "contract_name"));
            if (e1.statusCode() / 100 == 2 && "QA CD edited in Desk".equals(val("desk", DESK_CONTRACTS, cid, "contract_name"))) fails.add("D6 locked field editable");
            putConfigOk("D6 lock off", x -> contracts(x).put("lock_crm_owned_fields", false));
            Response e2 = update("desk", DESK_CONTRACTS, cid, f("contract_name", "QA CD edited unlocked"));
            fact("D6", "lock off: edit -> " + code(e2) + " now=" + val("desk", DESK_CONTRACTS, cid, "contract_name"));
            if (e2.statusCode() / 100 != 2) fails.add("D6 unlocked field not editable");
            Response cancel = desk().post(INT + "/contracts/" + l.get("id") + "/cancel", Map.of());
            fact("D8", "cancel link -> " + code(cancel) + " " + trim(cancel.asString(), 200) + "; link now " + desc(contractOf(d)));
            Response re = desk().post(INT + "/contracts/" + l.get("id") + "/recreate", Map.of());
            AppUser.sleep(15_000);
            Map<String, Object> l2 = contractOf(d);
            fact("D8", "recreate -> " + code(re) + " " + trim(re.asString(), 200) + "; link now " + desc(l2));
            if (l2 != null && l2.get("desk_record_id") != null) track("desk", DESK_CONTRACTS, String.valueOf(l2.get("desk_record_id")));
            if (cancel.statusCode() / 100 != 2 || re.statusCode() / 100 != 2) fails.add("D8 cancel " + cancel.statusCode() + " / recreate " + re.statusCode());
        } finally {
            restore("D6/D7");
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- D9 sync all contracts, D10 contracts off ----------------
    @CaseId({"D9", "D10"})
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-remaining"}, description = "Sync all contracts; contracts switched off")
    public void d9d10() {
        Response s1 = desk().post(INT + "/imports/contracts", Map.of());
        Response s2 = desk().post(INT + "/imports/contracts", Map.of());
        fact("D9", "sync all contracts -> " + code(s1) + " " + trim(s1.asString(), 150) + "; again -> " + code(s2) + " '" + msg(s2) + "'");
        AppUser.sleep(20_000);
        putConfigOk("D10 off", x -> contracts(x).put("enabled", false));
        Map<String, Object> l;
        try {
            String d = deal("D10", "closed_won");
            AppUser.sleep(45_000);
            l = contractOf(d);
            fact("D10", "contracts off, deal won -> " + desc(l));
        } finally {
            restore("D10");
        }
        Assert.assertEquals(s1.statusCode() / 100, 2, "sync all contracts refused");
        Assert.assertTrue(l == null || l.get("desk_record_id") == null, "contract created while contracts are off");
    }

    // ---------------- D11 allow any deal link, L22 ticket contract, D12 reasons ----------------
    @CaseId({"D11", "L20", "L22", "D12"})
    @Test(priority = 5, groups = {"crmdesk", "crmdesk-remaining"}, description = "Linking a ticket to another customer's deal; ticket contract; needs-attention reasons")
    public void d11l22() {
        String other = create("crm", CRM_DEALS, CRM_DEAL_LAYOUT, f("deal_name", name("D11 other"), "pipeline", CRM_DEAL_PIPELINE, "stage", "qualification"));
        String won = deal("L22 won", "closed_won");
        waitContract(won, 90);
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD D11 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", conDesk, "email", email("dcon"), "channel", "web"));
        Response off = desk().put(INT + "/tickets/" + t + "/deal", Map.of("deal_id", other));
        fact("D11", "allow_any_deal_link=false: link another customer's deal -> " + code(off) + " '" + msg(off) + "'");
        putConfigOk("D11 on", x -> contracts(x).put("allow_any_deal_link", true));
        Response on;
        try {
            on = desk().put(INT + "/tickets/" + t + "/deal", Map.of("deal_id", other));
            fact("D11", "allow_any_deal_link=true: same link -> " + code(on));
            desk().delete(INT + "/tickets/" + t + "/deal");
        } finally {
            restore("D11");
        }
        Response tc = desk().get(INT + "/tickets/" + t + "/contract");
        fact("L22", "ticket contract -> " + code(tc) + " " + trim(tc.asString(), 300));
        List<Map<String, Object>> na = ok(desk().get(INT + "/contracts/needs-attention"), "na").jsonPath().getList("data");
        List<String> reasons = new ArrayList<>();
        for (Map<String, Object> x : na) reasons.add(String.valueOf(x.get("missing_fields")));
        fact("D12", "needs-attention reasons (API): " + reasons);
        Assert.assertNotEquals(off.statusCode() / 100, 2, "another customer's deal linked while 'allow any deal' is off");
        Assert.assertEquals(on.statusCode() / 100, 2, "linking refused while 'allow any deal' is on");
    }

    // ---------------- E8 not retroactive, E9 restore ----------------
    @CaseId({"E8", "E9"})
    @Test(priority = 6, groups = {"crmdesk", "crmdesk-remaining"}, description = "A delete queued under 'keep' stays keep after switching to 'delete'; restore a cross-deleted record")
    public void e8e9() {
        List<String> fails = new ArrayList<>();
        String c8 = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E8 " + RUN, "email", email("e8")));
        String d8 = waitPartner("contact", "crm", c8, 150);
        track("desk", DESK_CONTACTS, d8);
        ok(desk().post(INT + "/pause", Map.of("reason", "QA CD E8")), "pause");
        try {
            ok(deleteRecord("crm", CRM_CONTACTS, c8), "delete E8 while paused (keep)");
            putConfigOk("E8 delete", x -> x.put("on_crm_delete", "delete"));
        } finally {
            fact("E8", "resume -> " + code(desk().post(INT + "/resume", Map.of())));
        }
        AppUser.sleep(45_000);
        boolean kept = !gone("desk", DESK_CONTACTS, d8);
        fact("E8", "delete queued under keep, preference changed to delete before it ran -> Desk contact kept=" + kept);
        if (!kept) fails.add("E8 earlier delete re-applied with the new preference");
        try {
            String c9 = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E9 " + RUN, "email", email("e9")));
            String d9 = waitPartner("contact", "crm", c9, 150);
            track("desk", DESK_CONTACTS, d9);
            ok(deleteRecord("crm", CRM_CONTACTS, c9), "delete E9");
            boolean del = waitFor(90, () -> gone("desk", DESK_CONTACTS, d9));
            Response raw = desk().get("/modules/" + DESK_CONTACTS + "/records/" + d9);
            fact("E9", "Desk contact after the cross-delete: GET -> " + raw.statusCode() + " is_deleted=" + (raw.statusCode() == 200 ? raw.jsonPath().get("data.is_deleted") : "n/a"));
            String item = null;
            for (int i = 0; i < 10 && item == null; i++) {
                Response it = desk().get("/audit/recycle-bin/items?limit=200&app_key=desk");
                List<Map<String, Object>> items = it.jsonPath().getList("data.items") != null ? it.jsonPath().getList("data.items") : it.jsonPath().getList("data");
                if (items != null) for (Map<String, Object> m : items) if (String.valueOf(m).contains(d9)) item = String.valueOf(m.get("id"));
                if (item == null) AppUser.sleep(3000);
            }
            Response rs = item == null ? null : desk().post("/audit/recycle-bin/restore", Map.of("ids", List.of(item)));
            boolean back = item != null && waitFor(60, () -> !gone("desk", DESK_CONTACTS, d9));
            fact("E9", "cross-deleted Desk contact deleted=" + del + "; recycle-bin item=" + item + " restore -> " + (rs == null ? "n/a" : code(rs)) + "; back=" + back + "; link=" + desc(linkOf("contact", "desk", d9)));
            if (!back) fails.add("E9 restore from the Desk recycle bin failed");
        } finally {
            restore("E8/E9");
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- G14 race, G17 failure path ----------------
    @CaseId({"G14", "G17"})
    @Test(priority = 7, groups = {"crmdesk", "crmdesk-remaining"}, description = "Same field edited on both sides within a second; value invalid on the other side")
    public void g14g17() {
        List<String> fails = new ArrayList<>();
        ok(update("crm", CRM_CONTACTS, con, f("title", "G14 crm")), "crm edit");
        ok(update("desk", DESK_CONTACTS, conDesk, f("title", "G14 desk")), "desk edit");
        AppUser.sleep(40_000);
        String a1 = val("crm", CRM_CONTACTS, con, "title"), b1 = val("desk", DESK_CONTACTS, conDesk, "title");
        AppUser.sleep(30_000);
        String a2 = val("crm", CRM_CONTACTS, con, "title"), b2 = val("desk", DESK_CONTACTS, conDesk, "title");
        fact("G14", "after 40 s: CRM=" + a1 + " Desk=" + b1 + "; after 70 s: CRM=" + a2 + " Desk=" + b2);
        if (!String.valueOf(a2).equals(String.valueOf(b2))) fails.add("G14 sides differ after the race: CRM " + a2 + " / Desk " + b2);
        if (!String.valueOf(a1).equals(String.valueOf(a2)) || !String.valueOf(b1).equals(String.valueOf(b2))) fails.add("G14 values still changing (ping-pong)");
        Response bad = update("desk", DESK_CONTACTS, conDesk, f("phone", "abc-not-a-phone"));
        fact("G17", "Desk phone 'abc-not-a-phone' -> " + code(bad) + " '" + msg(bad) + "'");
        if (bad.statusCode() / 100 == 2) {
            waitFor(90, () -> failureOf(conDesk) != null);
            Map<String, Object> fl = failureOf(conDesk);
            fact("G17", "failure for the record: " + (fl == null ? "none" : fl.get("error_code") + " '" + fl.get("last_error") + "'") + "; CRM phone=" + val("crm", CRM_CONTACTS, con, "phone"));
            if (fl == null) fails.add("G17 no failure entry for a value CRM rejects");
            else if (!String.valueOf(fl.get("last_error")).toLowerCase().contains("phone")) fails.add("G17 failure does not name the field: " + fl.get("last_error"));
            if (fl != null) desk().post(INT + "/failures/" + fl.get("queue_id") + "/discard", Map.of());
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ---------------- F8 audit ----------------
    @CaseId("F8")
    @Test(priority = 8, groups = {"crmdesk", "crmdesk-remaining"}, description = "Settings changes appear in the tenant Audit Log")
    public void f8Audit() {
        Response a = desk().get("/audit/events?limit=100");
        String s = a.asString();
        boolean any = s.toLowerCase().contains("integration");
        fact("F8", "audit events -> " + code(a) + "; entries mentioning the integration=" + any + " " + trim(s.replaceAll("\\s+", " "), 400));
        Assert.assertEquals(a.statusCode() / 100, 2);
        Assert.assertTrue(any, "no audit entry for the integration settings changes made today");
    }

    // ---------------- E2E-3 mention + reply ----------------
    @CaseId("E2E-3")
    @Test(priority = 9, groups = {"crmdesk", "crmdesk-remaining"}, description = "Agent mentions a CRM user on the ticket; a reply is sent and logged on the ticket")
    public void e2e3() {
        String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD E2E3 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", conDesk, "email", email("dcon"), "channel", "email"));
        Response cm = desk().post("/desk/tickets/" + t + "/comments", Map.of("body_html", "<p>QA CD <span class=\"rt-mention\" data-mention-id=\"45ffbc5b-7859-4c21-be9e-7b5f30747ca2\" data-mention-kind=\"crm_user\">@test user 1</span> please check</p>"));
        Response rp = desk().post("/desk/tickets/" + t + "/replies", Map.of("subject", "Re: QA CD E2E3 " + RUN, "body_html", "<p>QA CD reply " + RUN + "</p>", "to", List.of(email("dcon"))));
        AppUser.sleep(5000);
        Response tk = desk().get("/desk/tickets/" + t);
        fact("E2E-3", "comment with mention -> " + code(cm) + "; reply -> " + code(rp) + " '" + msg(rp) + "' " + trim(rp.asString(), 200) + "; ticket counts " + tk.jsonPath().get("data.counts"));
        Assert.assertEquals(cm.statusCode() / 100, 2, "comment refused");
        Assert.assertEquals(rp.statusCode() / 100, 2, "reply refused: " + rp.asString());
    }

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
        order.sort((x, y) -> Integer.compare(WriteRunTest.rank(x[1]), WriteRunTest.rank(y[1])));
        for (String[] c : order) {
            try {
                fact("CLEAN", "delete " + c[0] + " " + c[1].substring(0, 8) + " " + c[2] + " -> " + deleteRecord(c[0], c[1], c[2]).statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + c[2] + " error " + e.getMessage());
            }
        }
    }

    List<Map<String, Object>> failures() {
        List<Map<String, Object>> l = ok(desk().get(INT + "/failures?page_size=100"), "failures").jsonPath().getList("data");
        return l == null ? List.of() : l;
    }

    Map<String, Object> failureOf(String id) {
        for (Map<String, Object> x : failures()) if (id.equals(String.valueOf(x.get("record_id")))) return x;
        return null;
    }

    static String desc(Map<String, Object> l) {
        return WriteRunTest.desc(l);
    }

    static String trim(String s, int n) {
        return WriteRunTest.trim(s, n);
    }
}
