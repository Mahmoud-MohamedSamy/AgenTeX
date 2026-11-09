package qa.features.deskblueprint;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.NoAlertPresentException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.deskblueprint.pages.DesignerPage;
import qa.features.deskblueprint.pages.TicketPage;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;

/**
 * Phase 2 screen checks ported from the Playwright probes (executions/execu_2026-11-01_desk-blueprint/scripts/ui-p2.js, ui-p3.js, ui-chrome.js).
 * Owner account, org "Anyware", QA copies in QA WF Dept R only; deleted in @AfterClass. Run with -Dbrowser=chrome for N11.
 * Nothing is saved in a designer (panels are cancelled, leaving uses "Leave without saving").
 */
public class BlueprintScreenTest extends BaseTest {
    static {
        System.setProperty("credentials.file", DeskBlueprintFeature.CREDENTIALS);
        System.setProperty("credentials.host", "staging-desk.taviportal.com");
        System.setProperty("credentials.account", DeskBlueprintFeature.OWNER);
        System.setProperty("auth.org", "Anyware");
    }

    private static final String X = "<img src=x onerror=alert(1)>";
    private DeskBlueprintApi api;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskBlueprintApi.get();
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintScreenTest cleanup]\n" + api.cleanup());
    }

    /** Open → Escalated (2 h limit, warn 1 h) → On Hold → Closed; "QA go" has items in a set order, "QA noitems" has none. */
    private String uiBlueprint(String name, boolean active) {
        Map<String, Object> esc = new LinkedHashMap<>();
        esc.put("slaMinutes", 120);
        esc.put("slaPreExpiryMinutes", 60);
        Map<String, Object> during = new LinkedHashMap<>();
        during.put("messages", List.of(Map.of("id", "m1", "text", "QA message " + X)));
        during.put("checklist", List.of(Map.of("id", "c1", "label", "QA must check", "mandatory", true)));
        during.put("deskItems", List.of(Bp.deskItem("comment", true)));
        during.put("requiredFields", List.of(Bp.requiredField("priority", "pick_list")));
        during.put("itemOrder", List.of("message:m1", "checklist", "desk:comment", "field:priority"));
        Map<String, Object> def = Bp.named(name + " " + X).state("Open").state("Escalated", esc).state("On Hold").terminal("Closed")
                .transition("go", "Open", "Escalated", Map.of(), during, List.of(Bp.setField("description", "QA after")))
                .transition("noitems", "Escalated", "On Hold").transition("end", "On Hold", "Closed").build();
        def.put("entryCriteria", Bp.criteria("contains", "subject", DeskBlueprintFeature.QA + name + " "));
        return api.createOk(def, active);
    }

    @Test(groups = {"regression", "ui"}, description = "New blueprint page: empty-canvas hint and the Field fixed to Ticket status")
    @CaseId({"BP-C1", "BP-C7"})
    public void newBlueprintPage() {
        String t = new DesignerPage().openNew().pageText();
        assertTrue(t.contains("Drag a status from the list onto the canvas"), "empty-canvas hint missing");
        assertTrue(t.contains("Ticket status"), "Field 'Ticket status' missing");
    }

    @Test(groups = {"regression", "ui"}, description = "State panel texts and the warning-before-limit message (nothing saved)")
    @CaseId({"BP-G1", "BP-G2", "BP-G3", "BP-G10", "BP-C16"})
    public void statePanels() {
        String id = uiBlueprint("SC panels", false);
        DesignerPage d = new DesignerPage().openBlueprint(id).openState("Open");
        String t = d.pageText();
        assertEquals(d.timeLimit(), "", "Open has no limit, the field should show the 'No limit' placeholder");
        assertTrue(t.matches("(?s).*\\d+ of 16 connections.*"), "connection counter missing");
        assertTrue(t.contains("Nothing set, so a customer reply reopens the ticket as it does today"), "reopen hint missing");
        d.escape().openState("Escalated");
        assertTrue(d.pageText().contains("A ticket that enters on"), "clock example missing");
        d.warnBefore("2");
        assertTrue(d.pageText().contains("The warning must come before the time limit."), "warning = limit not flagged");
        d.warnBefore("3");
        assertTrue(d.pageText().contains("The warning must come before the time limit."), "warning > limit not flagged");
        d.cancelPanel();
    }

    @Test(groups = {"regression", "ui"}, description = "Transition with no items says it runs in one click")
    @CaseId({"BP-E1"})
    public void transitionWithoutItems() {
        String id = uiBlueprint("SC tr", false);
        String t = new DesignerPage().openBlueprint(id).openTransition("QA noitems").pageText();
        assertTrue(t.contains("Nothing to fill in, so the agent runs it in one click."), "one-click hint missing");
    }

    @Test(groups = {"regression", "ui"}, description = "Tidy / undo / redo keep every transition; leaving with changes asks first")
    @CaseId({"BP-C21", "BP-C23"})
    public void undoTidyAndLeave() {
        String id = uiBlueprint("SC leave", false);
        DesignerPage d = new DesignerPage().openBlueprint(id);
        int before = d.edgeCount();
        d.tidy();
        assertEquals(d.edgeCount(), before, "tidy changed the number of transitions");
        d.undo().redo();
        assertEquals(d.edgeCount(), before, "undo/redo changed the number of transitions");
        String t = d.leaveWithBack();
        boolean asked = t.matches("(?is).*(unsaved changes|keep editing|leave without saving).*");
        d.leaveWithoutSaving();
        assertTrue(asked, "leaving with unsaved changes did not ask");
    }

    @Test(groups = {"regression", "ui"}, description = "Phone width: larger-screen message and no sideways scroll")
    @CaseId({"BP-C22"})
    public void phoneWidth() {
        String id = uiBlueprint("SC phone", false);
        Dimension old = driver().manage().window().getSize();
        try {
            driver().manage().window().setSize(new Dimension(390, 844));
            DesignerPage d = new DesignerPage().openBlueprintRaw(id);
            assertTrue(d.pageText().contains("Draw states and connectors on a larger screen"), "larger-screen message missing");
            long[] w = d.widths();
            assertTrue(w[0] <= w[1] + 1, "sideways scroll: scrollWidth " + w[0] + " > " + w[1]);
        } finally {
            driver().manage().window().setSize(old);
        }
    }

    @Test(groups = {"regression", "ui"}, description = "Ticket form: items in the configured order, message read-only, Run disabled until required items are filled")
    @CaseId({"BP-E9", "BP-E10"})
    public void ticketFormOrder() {
        uiBlueprint("SC form", true);
        String t = api.ticketOk("QA BP SC form ticket");
        assertNotNull(api.waitState(t, 20000), "ticket did not enter");
        TicketPage p = new TicketPage().openTicket(t).startTransition("QA go");
        String txt = p.pageText();
        int m = txt.indexOf("QA message"), c = txt.indexOf("QA must check"), pr = txt.lastIndexOf("Priority");
        assertTrue(m >= 0 && c > m && pr > c, "items not in the configured order (message " + m + ", checklist " + c + ", priority " + pr + ")");
        assertFalse(p.runEnabled(), "Run is enabled before the required items are filled");
    }

    @Test(groups = {"regression", "ui", "security"}, description = "Script text in names and messages is shown as text; nothing runs")
    @CaseId({"BP-E13", "BP-N1"})
    public void scriptTextShownAsText() {
        String id = uiBlueprint("SC xss", false);
        DesignerPage d = new DesignerPage().openBlueprint(id);
        assertTrue(d.pageText().contains(X), "payload not shown as text in the designer");
        assertEquals(d.injectedImages(), 0, "an <img src=x> element was injected");
        boolean alert;
        try { driver().switchTo().alert(); alert = true; } catch (NoAlertPresentException e) { alert = false; }
        assertFalse(alert, "a script dialog opened");
    }

    @Test(groups = {"regression", "ui", "i18n"}, description = "Arabic: designer right to left, html dir=rtl")
    @CaseId({"BP-N5", "BP-N6"})
    public void arabicRightToLeft() {
        String id = uiBlueprint("SC ar", false);
        DesignerPage d = new DesignerPage().openBlueprint(id);
        try {
            d.language("ar");
            d.openBlueprintRaw(id);
            String[] dl = d.htmlDirLang();
            assertEquals(dl[0], "rtl", "html dir in Arabic");
            assertTrue(dl[1].startsWith("ar"), "html lang in Arabic: " + dl[1]);
        } finally {
            d.language("en");
        }
    }

    @Test(groups = {"regression", "ui", "a11y"}, description = "Every visible icon button in the designer has an accessible name")
    @CaseId({"BP-N7"})
    public void iconButtonsNamed() {
        String id = uiBlueprint("SC a11y", false);
        long n = new DesignerPage().openBlueprint(id).unnamedIconButtons();
        assertEquals(n, 0L, "icon buttons without a name");
    }

    @Test(groups = {"regression", "ui", "slow"}, description = "Department SLA and state limit both overdue: shown separately with their own due times")
    @CaseId({"BP-K16"})
    public void bothOverdue() {
        String pol = api.slaPolicyOkMinutes("QA BP SC K16 SLA", "QA BP SC K16", 1, 2);
        assertNotNull(pol, "setup: SLA policy");
        Map<String, Object> open = new LinkedHashMap<>();
        open.put("slaClock", "calendar");
        open.put("slaMinutes", 1);
        Map<String, Object> def = Bp.named("SC K16").state("Open", open).terminal("Closed").transition("end", "Open", "Closed").build();
        def.put("entryCriteria", Bp.criteria("contains", "subject", "QA BP SC K16"));
        api.createOk(def, true);
        String t = api.ticketOk("QA BP SC K16 ticket");
        assertNotNull(api.waitState(t, 20000), "ticket did not enter");
        DeskBlueprintApi.sleep(200_000);
        TicketPage tp = new TicketPage().openTicket(t);
        String txt = tp.pageText();
        for (int i = 0; i < 30 && txt.split("Violated", -1).length - 1 < 3; i++) { DeskBlueprintApi.sleep(2000); txt = tp.pageText(); } // SLA card loads after the page
        assertTrue(txt.contains("SLA Violated"), "no SLA Violated pill");
        assertTrue(txt.matches("(?s).*Overdue by \\d+ minutes?.*"), "Steps card does not show the state as overdue");
        assertTrue(txt.toUpperCase().contains("FIRST RESPONSE") && txt.toUpperCase().contains("RESOLUTION"), "SLA card does not list both targets");
        assertTrue(txt.split("Violated", -1).length - 1 >= 3, "SLA card does not show both targets as Violated (pill + 2 targets)");
    }
}
