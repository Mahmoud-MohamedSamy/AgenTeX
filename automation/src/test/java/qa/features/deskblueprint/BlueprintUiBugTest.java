package qa.features.deskblueprint;

import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.deskblueprint.pages.DesignerPage;
import qa.features.deskblueprint.pages.TicketPage;

import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskblueprint.DeskBlueprintApi.ok;

/**
 * Re-checks of the filed UI bugs on QA copies (never on the Demo blueprints):
 * NDC-2755 (auto-close hidden in the state panel / lost on save), NDC-2756 (fixed Mon-Fri 9-5 example), NDC-2757 (Close ticket in a blueprint).
 * Signs in to org "Anyware" as the Anyware owner (credentials from the gitignored .auth file).
 * Each bug test asserts the CORRECT behaviour, so it fails while the bug is open.
 */
public class BlueprintUiBugTest extends BaseTest {
    static {
        System.setProperty("credentials.file", DeskBlueprintFeature.CREDENTIALS);
        System.setProperty("credentials.host", "staging-desk.taviportal.com");
        System.setProperty("credentials.account", DeskBlueprintFeature.OWNER);
        System.setProperty("auth.org", "Anyware");
    }

    private DeskBlueprintApi api;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        api = DeskBlueprintApi.get();
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (api != null) System.out.println("[BlueprintUiBugTest cleanup]\n" + api.cleanup());
    }

    @Test(groups = {"regression", "NDC-2755"}, description = "A state with an automatic move but no time limit: the panel shows it and Save state + Publish keep it")
    @CaseId({"BP-G11", "NDC-2755"})
    public void autoCloseVisibleAndKept() {
        Map<String, Object> hold = new java.util.LinkedHashMap<>();
        hold.put("slaClock", "business");
        hold.put("autoTransitionId", "autoclose");
        hold.put("autoTransitionAfterMinutes", 4320);
        Map<String, Object> def = Bp.named("NDC-2755 copy").state("Open").state("On Hold", hold).terminal("Closed")
                .transition("hold", "Open", "On Hold").transition("autoclose", "On Hold", "Closed").build();
        String id = api.createOk(def, false);
        assertEquals(api.definition(id).get("states").toString().contains("autoclose"), true, "setup: auto-move not saved");

        DesignerPage d = new DesignerPage().openBlueprint(id).openState("On Hold");
        String limit = d.timeLimit();
        boolean shown = d.showsWhenItRunsOut();
        d.saveState().saveAndPublish();

        Map<?, ?> onHold = ((List<?>) api.definition(id).get("states")).stream().map(s -> (Map<?, ?>) s)
                .filter(s -> "On Hold".equals(s.get("id"))).findFirst().orElseThrow();
        Object kept = onHold.get("autoTransitionId");
        boolean published = !Boolean.TRUE.equals(ok(api.blueprint(id), "get").jsonPath().getBoolean("data.hasDraft"))
                && ok(api.versions(id), "versions").jsonPath().getList("data").size() > 0;
        System.out.println("[NDC-2755] after Save state + Save and Publish: published=" + published + ", autoTransitionId=" + kept
                + ", autoTransitionAfterMinutes=" + onHold.get("autoTransitionAfterMinutes"));
        StringBuilder problems = new StringBuilder();
        if (!published) problems.append("(Save and Publish did not publish - data-loss part not proven.) ");
        if (!"autoclose".equals(kept)) problems.append("Save state + Save and Publish REMOVED the automatic close (autoTransitionId now ").append(kept).append("). ");
        if (!shown) problems.append("Panel does not show the automatic move ('Moves on by itself') for the 3-day auto-close (time limit field: '").append(limit).append("'). ");
        assertTrue(problems.length() == 0, problems.toString());
    }

    @Test(groups = {"regression", "NDC-2756"}, description = "The time-limit example follows the tenant's business hours, not a fixed Monday-Friday 9-5 week")
    @CaseId({"BP-G7", "NDC-2756"})
    public void exampleUsesTenantHours() {
        String preset = ok(api.get("/desk/business-hours"), "business hours").jsonPath().getString("data.preset");
        Map<String, Object> esc = new java.util.LinkedHashMap<>();
        esc.put("slaClock", "business");
        esc.put("slaMinutes", 480);
        esc.put("slaPreExpiryMinutes", 60);
        String id = api.createOk(Bp.named("NDC-2756 copy").state("Open", esc).terminal("Closed").transition("end", "Open", "Closed").build(), false);
        String example = new DesignerPage().openBlueprint(id).openState("Open").clockExample();
        assertFalse(example.isEmpty(), "no example sentence under Clock");
        if ("24_7".equals(preset))
            assertFalse(example.contains("Monday to Friday, 9 to 5"), "tenant hours are 24x7 but the example says: " + example);
    }

    @Test(groups = {"regression", "NDC-2757"}, description = "'Close ticket' is not offered on a ticket inside a blueprint (and cannot close it outside the blueprint)")
    @CaseId({"BP-J6", "NDC-2757"})
    public void noCloseButtonInBlueprint() {
        api.createOk(Bp.named("NDC-2757 copy").state("Open").state("Escalated").terminal("Closed")
                .transition("go", "Open", "Escalated").transition("end", "Escalated", "Closed").build(), true);
        String t = api.ticketOk("QA BP NDC-2757 ticket");
        assertNotNull(api.waitState(t, 20000), "ticket did not enter the QA blueprint");
        TicketPage p = new TicketPage().openTicket(t);
        assertTrue(p.showsSteps(), "Steps card not shown - not looking at a ticket in a blueprint");
        if (!p.closeTicketActive()) return; // correct behaviour
        String after = p.clickCloseTicket();
        Map<String, Object> f = api.fields(t);
        Map<String, Object> s = api.stateOf(t);
        String msg = "none found";
        for (String line : after.split("\\R"))
            if (line.toLowerCase().contains("blueprint") && (line.contains("transition") || line.contains("follows") || line.contains("Couldn"))) {
                msg = "'" + line.trim() + "'";
                break;
            }
        fail("'Close ticket' is shown and active on a ticket inside a blueprint (it opens 'Close this ticket?'). After confirming: status="
                + f.get("status") + ", still in blueprint=" + (s != null) + ", message on page: " + msg);
    }
}
