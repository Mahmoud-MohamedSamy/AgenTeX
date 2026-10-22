package qa.features.crmdeskintegration;

import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.config.Config;
import qa.features.crmdeskintegration.pages.DeskRecordPage;

import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.CrmDeskFeature.CRM;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * Screen rows seen by other roles (21 Oct 2026). Run once per role with the matching browser account:
 * -Drole=agent  (credentials.file=.auth/extra-credentials.csv, account fedelav803)  → A9, J4, J5
 * -Drole=crmonly (Edge CSV, account nameb56175, base.url=staging-crm)              → A8
 * The owner API sets and restores the Desk Agent profile access; QA records are deleted at the end.
 */
public class RoleUiTest extends BaseTest {
    static final Path OUT = Path.of("target/evidence/remaining");

    static AppUser.App ownerDesk() {
        return AppUser.as(CrmDeskFeature.OWNER).desk();
    }

    String body() {
        return driver().findElement(By.tagName("body")).getText();
    }

    void access(Object rows, String why) {
        Map<String, Object> c = AppUser.ok(ownerDesk().get(INT + "/config"), "config").jsonPath().getMap("data");
        c.remove("status");
        @SuppressWarnings("unchecked") Map<String, Object> panel = (Map<String, Object>) c.get("panel");
        panel.put("profile_access", rows);
        fact("ROLE", why + " -> " + ownerDesk().putOnce(INT + "/config", c).statusCode());
    }

    static Map<String, Object> m(Object... kv) {
        return WriteBase.f(kv);
    }

    @CaseId({"A9", "J4", "J5"})
    @Test(groups = {"crmdesk", "crmdesk-remaining"}, description = "As the Desk agent: the CRM pane follows the agent's own profile access")
    public void agentPane() {
        if (!"agent".equals(Config.get("role", ""))) throw new SkipException("run with -Drole=agent");
        Map<String, Object> custom = m("enabled", true, "info", true, "potentials", false, "notes", true, "activities", List.of("meetings", "tasks"));
        Map<String, Object> none = m("enabled", false, "info", false, "potentials", false, "notes", false, "activities", List.of());
        try {
            access(WriteRunTest.access(custom, none), "Desk Agent: contacts custom without Potentials");
            DeskRecordPage p = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
            boolean pane = p.showPane();
            String t = body();
            boolean potTab = t.contains("Potentials");
            String potState = "tab not shown";
            if (potTab) {
                try {
                    p.paneTab("Potentials");
                    potState = body().contains("Your profile cannot open this tab.") ? "'Your profile cannot open this tab.'" : "opened: " + body().contains("No deals for this customer.");
                } catch (RuntimeException e) {
                    potState = "tab not clickable";
                }
            }
            p.shot(OUT.resolve("A9-agent-custom.png"));
            fact("A9", "agent, Custom without Potentials: pane shown=" + pane + "; Potentials -> " + potState + "; Info tab=" + t.contains("Info"));
            access(WriteRunTest.access(none, none), "Desk Agent: no access");
            DeskRecordPage q = new DeskRecordPage().openTicket(CrmDeskFeature.TICKET_298);
            boolean pane2 = q.showPane();
            String t2 = body();
            q.shot(OUT.resolve("A9-agent-none.png"));
            fact("J4", "agent, No access: pane shown=" + pane2 + " 'CRM Contact Info' text=" + t2.contains("CRM Contact Info"));
            Assert.assertFalse(pane2 && t2.contains("Mahmoud MohamedSamy") && t2.contains("CRM Contact Info"), "CRM data shown to an agent with No access");
            Assert.assertFalse(potState.startsWith("opened"), "Potentials opened although the profile has no Potentials access");
        } finally {
            Map<String, Object> c = AppUser.ok(ownerDesk().get(INT + "/config"), "config").jsonPath().getMap("data");
            access(List.of(), "restore profile_access (baseline: empty)");
        }
    }

    @CaseId("A8")
    @Test(groups = {"crmdesk", "crmdesk-remaining"}, description = "As a CRM user without Desk: Desk Tickets card, New ticket and the Desk menu")
    public void crmOnlyUser() {
        if (!"crmonly".equals(Config.get("role", ""))) throw new SkipException("run with -Drole=crmonly");
        AppUser.App crm = AppUser.as(CrmDeskFeature.OWNER).crm();
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("layout_id", WriteBase.CRM_CONTACT_LAYOUT);
        b.put("data", WriteBase.data(WriteBase.f("first_name", "QA CD", "last_name", "A8 " + WriteBase.RUN, "email", WriteBase.email("a8"), "owner", ParityApiTest.CRM_ONLY_ID)));
        String c = AppUser.ok(crm.post("/modules/" + WriteBase.CRM_CONTACTS + "/records", b), "create").jsonPath().getString("data.id");
        String d = null;
        try {
            for (int i = 0; i < 40 && d == null; i++) {
                for (Map<String, Object> l : new IntegrationApi(ownerDesk()).list(INT + "/links?kind=contact&page_size=200"))
                    if (c.equals(String.valueOf(l.get("crm_record_id")))) d = String.valueOf(l.get("desk_record_id"));
                if (d == null) AppUser.sleep(3000);
            }
            AppUser.ok(ownerDesk().post("/modules/" + WriteBase.DESK_TICKETS + "/records", Map.of("layout_id", WriteBase.DESK_TICKET_LAYOUT, "data",
                    WriteBase.data(WriteBase.f("subject", "QA CD A8 " + WriteBase.RUN, "status", "Open", "department", WriteBase.DESK_DEPARTMENT, "contact_id", d, "email", WriteBase.email("a8"), "channel", "web")))), "ticket");
            qa.features.crmdeskintegration.pages.CrmRecordPage cp = new qa.features.crmdeskintegration.pages.CrmRecordPage().openContact(c);
            boolean card = cp.cardShown();
            String t = body();
            new DeskRecordPage().shot(OUT.resolve("A8-crm-only-card.png"));
            boolean newTicket = t.contains("New ticket");
            String afterNew = "";
            if (newTicket) {
                for (org.openqa.selenium.WebElement e : driver().findElements(By.xpath("//button[normalize-space(.)='New ticket']")))
                    if (e.isDisplayed()) {
                        e.click();
                        AppUser.sleep(4000);
                        afterNew = body().contains("You don't have permission to create Desk tickets.") ? "'You don't have permission to create Desk tickets.'" : body().contains("Preparing the ticket form") ? "form preparing" : "other";
                        new DeskRecordPage().shot(OUT.resolve("A8-crm-only-new-ticket.png"));
                        break;
                    }
            }
            fact("A8", "CRM-only user: card shown=" + card + " ticket listed=" + t.contains("QA CD A8") + "; New ticket button=" + newTicket + " -> " + afterNew + "; Desk in CRM menu=" + t.contains("Desk"));
            String ws = new DeskRecordPage().visit(CRM + "/desk/tickets");
            new DeskRecordPage().shot(OUT.resolve("A8-crm-only-desk.png"));
            fact("A8", "CRM-only user opens CRM /desk/tickets: 'Desk is not available'=" + ws.contains("Desk is not available"));
        } finally {
            if (d != null) fact("CLEAN", "delete Desk contact -> " + ownerDesk().delete("/modules/" + WriteBase.DESK_CONTACTS + "/records/" + d).statusCode());
            fact("CLEAN", "delete CRM contact -> " + crm.delete("/modules/" + WriteBase.CRM_CONTACTS + "/records/" + c).statusCode());
        }
    }
}
