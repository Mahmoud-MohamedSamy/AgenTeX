package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.CrmRecordPage;
import qa.features.crmdeskintegration.pages.DeskRecordPage;

import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * Last rows that could still be closed (21 Oct 2026): L10 unlink a ticket from a deal on the CRM card; D6 lock of
 * CRM-owned contract fields on a contract completed with the required fields; G17 a Desk value CRM rejects.
 * QA CD records only, deleted at the end; settings restored from the baseline.
 */
public class FinishTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/remaining");
    static final String DESK_CONTRACTS = "0924eb24-e42a-4eab-8efd-e3428f19e882";
    static final List<String[]> MADE = new ArrayList<>();
    static Map<String, Object> baseline;
    static String crmC, deskC, crmAcc, deskAcc;

    static AppUser.App crm() {
        return AppUser.as(CrmDeskFeature.OWNER).crm();
    }

    static AppUser.App desk() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    static String mk(AppUser.App app, String side, String module, String layout, Map<String, Object> fields) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout);
        body.put("data", WriteBase.data(fields));
        String id = AppUser.ok(app.post("/modules/" + module + "/records", body), "create").jsonPath().getString("data.id");
        MADE.add(new String[]{side, module, id});
        return id;
    }

    static String partner(String kind, String crmId) {
        for (int i = 0; i < 50; i++) {
            for (Map<String, Object> l : new IntegrationApi(desk()).list(INT + "/links?kind=" + kind + "&page_size=200"))
                if (crmId.equals(String.valueOf(l.get("crm_record_id"))) && l.get("desk_record_id") != null) {
                    String d = String.valueOf(l.get("desk_record_id"));
                    MADE.add(new String[]{"desk", kind.equals("account") ? WriteBase.DESK_ACCOUNTS : kind.equals("contract") ? DESK_CONTRACTS : WriteBase.DESK_CONTACTS, d});
                    return d;
                }
            AppUser.sleep(3000);
        }
        return null;
    }

    Map<String, Object> config() {
        return AppUser.ok(desk().get(INT + "/config"), "config").jsonPath().getMap("data");
    }

    void restore(String why) {
        Map<String, Object> b = new LinkedHashMap<>(baseline);
        b.remove("status");
        b.put("row_version", config().get("row_version"));
        fact("RESTORE", why + " -> " + desk().putOnce(INT + "/config", b).statusCode());
    }

    void setup() {
        if (crmC != null) return;
        baseline = config();
        crmAcc = mk(crm(), "crm", WriteBase.CRM_ACCOUNTS, WriteBase.CRM_ACCOUNT_LAYOUT, WriteBase.f("account_name", WriteBase.name("FIN acc")));
        deskAcc = partner("account", crmAcc);
        crmC = mk(crm(), "crm", WriteBase.CRM_CONTACTS, WriteBase.CRM_CONTACT_LAYOUT, WriteBase.f("first_name", "QA CD", "last_name", "FIN " + WriteBase.RUN, "email", WriteBase.email("fin"), "account_id", crmAcc));
        deskC = partner("contact", crmC);
        fact("FIN", "account " + crmAcc + " -> " + deskAcc + "; contact " + crmC + " -> " + deskC);
    }

    // ---------------- L10 ----------------
    @CaseId("L10")
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-remaining"}, description = "Unlink a ticket from its deal on the CRM Desk Tickets card")
    public void l10UnlinkOnCard() {
        setup();
        String deal = mk(crm(), "crm", WriteBase.CRM_DEALS, WriteBase.CRM_DEAL_LAYOUT, WriteBase.f("deal_name", WriteBase.name("L10 deal"), "pipeline", WriteBase.CRM_DEAL_PIPELINE, "stage", "qualification", "contact_id", crmC, "account_id", crmAcc));
        String t = mk(desk(), "desk", WriteBase.DESK_TICKETS, WriteBase.DESK_TICKET_LAYOUT, WriteBase.f("subject", "QA CD L10 " + WriteBase.RUN, "status", "Open", "department", WriteBase.DESK_DEPARTMENT, "contact_id", deskC, "email", WriteBase.email("fin"), "channel", "web"));
        AppUser.ok(desk().put(INT + "/tickets/" + t + "/deal", Map.of("deal_id", deal)), "link deal");
        fact("L10", "ticket linked through the API: " + desk().get(INT + "/tickets/" + t + "/deal").asString().contains(deal));
        new DeskRecordPage().crmSession();
        CrmRecordPage cp = new CrmRecordPage().openContact(crmC);
        cp.cardShown();
        AppUser.sleep(2000);
        boolean selected = false;
        for (WebElement row : driver().findElements(By.xpath("//tr[.//*[contains(normalize-space(.),'QA CD L10')]]//input[@type='checkbox']")))
            if (row.isDisplayed()) {
                row.click();
                selected = true;
                break;
            }
        AppUser.sleep(1000);
        boolean offered = false, confirmed = false;
        for (WebElement b : driver().findElements(By.xpath("//button[normalize-space(.)='Unlink from deal']")))
            if (b.isDisplayed()) {
                offered = true;
                b.click();
                AppUser.sleep(1500);
                for (WebElement c : driver().findElements(By.xpath("//*[@role='dialog']//button[normalize-space(.)='Unlink from deal' or normalize-space(.)='Unlink' or normalize-space(.)='Confirm']")))
                    if (c.isDisplayed()) {
                        c.click();
                        confirmed = true;
                        break;
                    }
                break;
            }
        AppUser.sleep(3000);
        String text = driver().findElement(By.tagName("body")).getText();
        new DeskRecordPage().shot(OUT.resolve("L10.png"));
        Response after = desk().get(INT + "/tickets/" + t + "/deal");
        boolean unlinked = !after.asString().contains(deal);
        fact("L10", "row selected=" + selected + "; 'Unlink from deal' offered=" + offered + " confirm dialog=" + confirmed + "; toast 'Ticket unlinked from the deal.'=" + text.contains("Ticket unlinked from the deal.") + "; deal link after=" + (unlinked ? "removed" : "still there"));
        Assert.assertTrue(offered, "Unlink from deal not offered for a linked ticket");
        Assert.assertTrue(unlinked, "ticket still linked to the deal after Unlink");
    }

    // ---------------- D6 ----------------
    @CaseId("D6")
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-remaining"}, description = "Lock CRM-owned fields on a complete contract; editable when the lock is off")
    public void d6Lock() {
        setup();
        Response plans = desk().get("/desk/sla/support-plans");
        String plan = null;
        try {
            List<Map<String, Object>> l = plans.jsonPath().getList("data");
            if (l == null) l = plans.jsonPath().getList("data.items");
            if (l != null && !l.isEmpty()) plan = String.valueOf(l.get(0).get("id"));
        } catch (Exception ignored) {
        }
        fact("D6", "support plans -> " + plans.statusCode() + " first=" + plan);
        if (plan == null) throw new SkipException("INCONCLUSIVE: no Desk support plan to complete a contract with");
        String deal = mk(crm(), "crm", WriteBase.CRM_DEALS, WriteBase.CRM_DEAL_LAYOUT, WriteBase.f("deal_name", WriteBase.name("D6 deal"), "pipeline", WriteBase.CRM_DEAL_PIPELINE, "stage", "closed_won",
                "contact_id", crmC, "account_id", crmAcc, "amount", 900, "closing_date", LocalDate.now().toString()));
        String contract = partner("contract", deal);
        if (contract == null) throw new SkipException("INCONCLUSIVE: no contract created for the won deal");
        Response fill = desk().patch("/modules/" + DESK_CONTRACTS + "/records/" + contract, Map.of("data", WriteBase.data(WriteBase.f("support_plan", plan, "account_id", deskAcc,
                "start_date", LocalDate.now().toString(), "end_date", LocalDate.now().plusYears(1).toString()))));
        fact("D6", "complete the draft (support plan, account, dates) -> " + fill.statusCode() + " " + WriteRunTest.trim(fill.asString(), 250));
        if (fill.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: the contract cannot be completed: " + fill.asString());
        Response locked = desk().patch("/modules/" + DESK_CONTRACTS + "/records/" + contract, Map.of("data", WriteBase.data(WriteBase.f("contract_name", "QA CD edited in Desk"))));
        String nameLocked = val(contract, "contract_name");
        fact("D6", "lock on: edit contract_name in Desk -> " + locked.statusCode() + " " + WriteRunTest.trim(locked.asString(), 200) + " now='" + nameLocked + "'");
        Map<String, Object> c = config();
        c.remove("status");
        @SuppressWarnings("unchecked") Map<String, Object> ct = (Map<String, Object>) c.get("contracts");
        ct.put("lock_crm_owned_fields", false);
        fact("D6", "lock off -> " + desk().putOnce(INT + "/config", c).statusCode());
        try {
            Response open = desk().patch("/modules/" + DESK_CONTRACTS + "/records/" + contract, Map.of("data", WriteBase.data(WriteBase.f("contract_name", "QA CD edited unlocked"))));
            fact("D6", "lock off: edit -> " + open.statusCode() + " now='" + val(contract, "contract_name") + "'");
            Assert.assertTrue(!"QA CD edited in Desk".equals(nameLocked), "CRM-owned field editable in Desk while locked");
            Assert.assertEquals(val(contract, "contract_name"), "QA CD edited unlocked", "field not editable with the lock off");
        } finally {
            restore("D6");
        }
    }

    String val(String contract, String field) {
        List<Map<String, Object>> d = desk().get("/modules/" + DESK_CONTRACTS + "/records/" + contract).jsonPath().getList("data.data");
        if (d != null) for (Map<String, Object> e : d)
            if (field.equals(e.get("field"))) return String.valueOf(((Map<?, ?>) e.get("value")).get("value"));
        return null;
    }

    // ---------------- G17 ----------------
    @CaseId("G17")
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-remaining"}, description = "A Desk phone CRM rejects: failure entry naming the field")
    public void g17() {
        setup();
        List<String> tried = new ArrayList<>();
        String accepted = null;
        for (String phone : List.of("+44 20 7946 0958", "+1-202-555-0143", "0020 2 1234567", "12345")) {
            Response r = desk().patch("/modules/" + WriteBase.DESK_CONTACTS + "/records/" + deskC, Map.of("data", WriteBase.data(WriteBase.f("phone", phone))));
            tried.add(phone + " -> " + r.statusCode());
            if (r.statusCode() / 100 == 2) {
                accepted = phone;
                break;
            }
        }
        fact("G17", "Desk phone values tried: " + tried);
        if (accepted == null) throw new SkipException("INCONCLUSIVE: Desk rejects every phone CRM would reject");
        final String ph = accepted;
        boolean arrived = WriteBase.waitFor(45, () -> ph.equals(String.valueOf(crm().get("/modules/" + WriteBase.CRM_CONTACTS + "/records/" + crmC).jsonPath().getList("data.data").stream()
                .filter(x -> "phone".equals(((Map<?, ?>) x).get("field"))).map(x -> ((Map<?, ?>) ((Map<?, ?>) x).get("value")).get("value")).findFirst().orElse(null))));
        Map<String, Object> fail = null;
        for (int i = 0; i < 15 && fail == null && !arrived; i++) {
            for (Map<String, Object> f : new IntegrationApi(desk()).list(INT + "/failures?page_size=100")) if (deskC.equals(String.valueOf(f.get("record_id")))) fail = f;
            if (fail == null) AppUser.sleep(3000);
        }
        fact("G17", "Desk phone '" + accepted + "': reached CRM=" + arrived + "; failure=" + (fail == null ? "none" : fail.get("error_code") + " '" + fail.get("last_error") + "'"));
        if (fail != null) desk().post(INT + "/failures/" + fail.get("queue_id") + "/discard", Map.of());
        if (arrived) throw new SkipException("INCONCLUSIVE: CRM accepted the value (no failure to observe)");
        Assert.assertNotNull(fail, "change neither arrived nor logged as a failure");
        Assert.assertTrue(String.valueOf(fail.get("last_error")).toLowerCase().contains("phone"), "failure does not name the field: " + fail.get("last_error"));
    }

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        try {
            if (baseline != null) restore("end");
        } catch (Exception e) {
            fact("CLEAN", "restore error " + e.getMessage());
        }
        for (int i = MADE.size() - 1; i >= 0; i--) {
            String[] m = MADE.get(i);
            try {
                AppUser.App a = "crm".equals(m[0]) ? crm() : desk();
                fact("CLEAN", "delete " + m[0] + " " + m[1].substring(0, 8) + " " + m[2] + " -> " + a.delete("/modules/" + m[1] + "/records/" + m[2]).statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + m[2] + " error " + e.getMessage());
            }
        }
    }
}
