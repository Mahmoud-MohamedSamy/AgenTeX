package qa.features.deskassignmentrules;

import org.openqa.selenium.JavascriptExecutor;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.pages.AssignmentRulesPage;
import qa.features.deskassignmentrules.pages.NewTicketPage;
import qa.features.deskassignmentrules.pages.RrPreferencesDialog;
import qa.features.deskassignmentrules.pages.RuleFormDialog;
import qa.features.deskassignmentrules.pages.SkillsSetupPage;

import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * UI rows of groups A, C, D, E, F, G, H, I and NDC-2813, in the browser as ndc-staging-owner. Dialogs are cancelled;
 * the only UI save (A-12) creates an INACTIVE QA rule that is deleted afterwards. Fixtures are made through the API.
 * Run: mvnw test -Dtest=AssignmentRulesUiTest "-Dcredentials.file=../docs/Credentials/TAVI Desk Credentials.csv"
 */
@qa.core.annotations.NoAuth // signs in itself to the NDC-Staging organization (see NdcUiSession)
public class AssignmentRulesUiTest extends BaseTest {
    private ArApi o;

    @BeforeClass(alwaysRun = true)
    public void fixtureUp() {
        o = ArFixture.up();
    }

    @org.testng.annotations.BeforeMethod(alwaysRun = true)
    public void ndcSession() {
        NdcUiSession.signIn(driver());
    }

    @AfterMethod(alwaysRun = true)
    public void cleanApi() {
        if (qa.core.driver.DriverManager.has()) NdcUiSession.capture(driver());
        try {
            ArApi.cleanupCreated();
        } catch (RuntimeException e) {
            ArApi.ledger("ui cleanup error: " + e.getMessage());
        }
    }

    @AfterSuite(alwaysRun = true)
    public void fixtureDown() {
        ArFixture.down();
    }

    private static String mk(String c) {
        return PREFIX + c + " " + uid();
    }

    // ---------------- A ----------------

    @Test(groups = {"smoke", "regression", "ui"}, description = "Tabs Rules / Team Assignment / Notifications; Direct and Round Robin each with New Rule and a master switch")
    @CaseId("A-01")
    public void pageLayout() {
        AssignmentRulesPage p = new AssignmentRulesPage().open();
        assertEquals(p.settingsTabs(), List.of("Rules", "Team Assignment", "Notifications"));
        assertEquals(p.ruleTypeTabs(), List.of("Direct Assignment", "Round Robin"));
        assertTrue(p.directHasNewRuleAndSwitch(), "Direct list has no New Rule / master switch");
        p.roundRobin(null);
        assertTrue(p.rrHasNewRuleSwitchAndPicker(), "Round Robin list has no New Rule / switch / department picker");
    }

    @Test(groups = {"regression", "ui"}, description = "New rule defaults: Active on, Ticket Create ticked, 0 / 120 and 0 / 1000 counters")
    @CaseId("A-02")
    public void newRuleDefaults() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule();
        SoftAssert s = new SoftAssert();
        s.assertTrue(d.activeOn(), "Active off by default");
        s.assertTrue(d.createChecked(), "Ticket Create not ticked");
        s.assertFalse(d.updateChecked(), "Ticket Update ticked");
        s.assertTrue(d.text().contains("0 / 120"), "name counter");
        s.assertTrue(d.text().contains("0 / 1000"), "description counter");
        d.cancel();
        s.assertAll();
    }

    @Test(groups = {"regression", "ui"}, description = "Save with no name and no target shows both messages")
    @CaseId({"A-03", "A-07"})
    public void requiredMessages() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().save();
        List<String> a = d.alerts();
        d.cancel();
        assertTrue(a.contains("Enter a name for the Assignment Rule."), "A-03 messages " + a);
        assertTrue(a.contains("Add at least one target."), "A-07 messages " + a);
    }

    @Test(groups = {"regression", "ui"}, description = "The name box stops at 120 characters")
    @CaseId("A-04")
    public void nameStopsAt120() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().name("n".repeat(125));
        String v = d.nameValue();
        d.cancel();
        assertTrue(v.length() <= 120, "name box holds " + v.length() + " characters");
    }

    @Test(groups = {"regression", "ui"}, description = "Every rule row has a labelled drag handle 'Drag <rule> to reorder'")
    @CaseId({"A-08", "I-02"})
    public void dragHandlesLabelled() {
        AssignmentRulesPage p = new AssignmentRulesPage().open();
        List<String> h = p.dragHandles();
        assertFalse(h.isEmpty(), "no drag handles");
        assertTrue(h.stream().allMatch(x -> x.startsWith("Drag ") && x.endsWith(" to reorder")), "handles " + h);
    }

    @Test(groups = {"regression", "ui"}, description = "Saving a rule in the UI shows 'Rule saved.' and the rule is listed")
    @CaseId("A-12")
    public void saveMessage() {
        String name = mk("A12 ui");
        AssignmentRulesPage p = new AssignmentRulesPage().open();
        RuleFormDialog d = p.newDirectRule().name(name).toggleActive().addTarget().comingTo(DA_NAME).agent(A1_NAME);
        d.save();
        String toast = p.toastText(8);
        Map<String, Object> made = o.rules("direct", null).stream().filter(r -> name.equals(r.get("name"))).findFirst().orElse(null);
        if (made != null) track("rule", (String) made.get("id"), name);
        assertNotNull(made, "rule not saved (toast '" + toast + "')");
        assertEquals(made.get("is_active"), false, "UI save made an active rule");
        assertTrue(toast.contains("Rule saved."), "toast: '" + toast + "'");
    }

    // ---------------- C ----------------

    @Test(groups = {"regression", "ui"}, description = "Ticket coming to: Any Department + departments; Move Ticket to: departments")
    @CaseId("C-01")
    public void departmentPickLists() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().addTarget();
        List<String> coming = d.comingToOptions(), move = d.moveToOptions();
        d.cancel();
        assertEquals(coming.get(0), "Any Department", "first 'coming to' option");
        assertTrue(coming.containsAll(List.of(DA_NAME, DB_NAME)), "coming to " + coming);
        assertTrue(move.containsAll(List.of(DA_NAME, DB_NAME)), "move to " + move);
    }

    @Test(groups = {"regression", "ui"}, description = "Coming to Dept A: agents and teams of Dept A, Mark as Unassigned; Move to Dept B switches the agent list")
    @CaseId({"C-02", "C-03"})
    public void assignListFollowsDepartment() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().addTarget().comingTo(DA_NAME);
        List<String> agentsA = d.agentOptions();
        d.assignKind("Teams");
        List<String> teamsA = d.teamOptions();
        d.assignKind("Agents").moveTo(DB_NAME);
        List<String> agentsB = d.agentOptions();
        d.cancel();
        SoftAssert s = new SoftAssert();
        s.assertTrue(agentsA.containsAll(List.of(A1_NAME, A2_NAME, A3_NAME)), "C-02 Dept A agents " + agentsA);
        s.assertTrue(teamsA.contains(TEAM_A_NAME), "C-02 Dept A teams " + teamsA);
        s.assertTrue(agentsB.containsAll(List.of(A1_NAME, A2_NAME)), "C-03 Dept B agents " + agentsB);
        s.assertFalse(agentsB.contains(A3_NAME), "C-03 Dev Team 2 (not in Dept B) offered " + agentsB);
        s.assertAll();
    }

    @Test(groups = {"regression", "ui"}, description = "Pick an agent, then Mark as Unassigned: the picker goes back to Unassigned")
    @CaseId("C-06")
    public void markAsUnassigned() {
        RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().addTarget().comingTo(DA_NAME).agent(A1_NAME);
        String picked = d.agentButtonText();
        d.markUnassigned();
        String after = d.agentButtonText();
        d.cancel();
        assertTrue(picked.contains(A1_NAME), "agent not picked: " + picked);
        assertTrue(after.contains("Unassigned"), "after Mark as Unassigned: " + after);
    }

    @Test(groups = {"regression", "ui", "NDC-2812"}, description = "Team Assignment off for Dept A: the target form offers no Teams")
    @CaseId("C-08")
    public void teamAssignmentOffHidesTeams() {
        o.setTeamAssignment(DA, false);
        try {
            RuleFormDialog d = new AssignmentRulesPage().open().newDirectRule().addTarget().comingTo(DA_NAME);
            boolean teams = d.assignKindOffered("Teams");
            d.cancel();
            assertFalse(teams, "Teams still offered with Team Assignment off");
        } finally {
            o.setTeamAssignment(DA, true);
        }
    }

    // ---------------- D ----------------

    @Test(groups = {"regression", "ui"}, description = "A rule whose agent left the department reads 'Assign to <agent> (no longer in <department>)'")
    @CaseId("D-13b")
    public void removedAgentShown() {
        String name = mk("D13b");
        Map<String, Object> b = directBody(name, l("create"), l(directTarget(contains(name), DB, null, agent(A2))));
        b.put("is_active", false);
        o.rule(b);
        o.removeMember(DB, A2);
        try {
            String list = new AssignmentRulesPage().open().directListText();
            assertTrue(list.contains(A2_NAME + " (no longer in " + DB_NAME + ")"), "list text near the rule does not say 'no longer in'");
        } finally {
            o.addMember(DB, A2);
        }
    }

    // ---------------- E ----------------

    @Test(groups = {"regression", "ui"}, description = "Round Robin list has a department picker; the new rule belongs to that department")
    @CaseId("E-01")
    public void rrDepartmentPicker() {
        RuleFormDialog d = new AssignmentRulesPage().open().roundRobin(DA_NAME).newRoundRobinRule();
        String t = d.text();
        d.cancel();
        assertTrue(t.contains("Department: " + DA_NAME), "dialog does not name the department");
    }

    @Test(groups = {"regression", "ui"}, description = "Saving a round-robin target without a type or pool shows both messages")
    @CaseId({"E-02", "E-04"})
    public void rrRequiredMessages() {
        RuleFormDialog d = new AssignmentRulesPage().open().roundRobin(DA_NAME).newRoundRobinRule().addTarget().save();
        List<String> a = d.alerts();
        d.cancel();
        assertTrue(a.contains("Choose a round robin type."), "E-02 messages " + a);
        assertTrue(a.contains("Pick at least one agent, or a team."), "E-04 messages " + a);
    }

    @Test(groups = {"regression", "ui", "parity"}, description = "Round robin type help texts match Zoho word for word")
    @CaseId("E-03")
    public void methodHelpTexts() {
        RuleFormDialog d = new AssignmentRulesPage().open().roundRobin(DA_NAME).newRoundRobinRule().addTarget();
        String t = d.methodGroupText().replaceAll("\\s+", " ");
        d.cancel();
        SoftAssert s = new SoftAssert();
        s.assertTrue(t.contains("Load Based Assignment Assign Tickets to agents based on their load until everyone receives the set threshold."), t);
        s.assertTrue(t.contains("Sequential Assignment Assign Tickets equally among agents, in a sequential manner, in round-robin fashion."), t);
        s.assertTrue(t.contains("Skill Based Assignment Assign Tickets to agents according to their designated skills."), t);
        s.assertAll();
    }

    @Test(groups = {"regression", "ui"}, description = "Round robin form notes; no backlog or capacity field on the rule")
    @CaseId({"E-06", "E-07"})
    public void rrFormNotesNoBacklog() {
        RuleFormDialog d = new AssignmentRulesPage().open().roundRobin(DA_NAME).newRoundRobinRule().addTarget();
        String t = d.text();
        int numbers = d.numberInputs();
        d.cancel();
        SoftAssert s = new SoftAssert();
        s.assertTrue(t.contains("The rule will not re-assign tickets that were assigned via other automations."), "E-06 note 1");
        s.assertTrue(t.contains("The rule will not assign more tickets than the number specified under threshold."), "E-06 note 2");
        s.assertFalse(t.toLowerCase().contains("backlog"), "E-07 backlog option on the rule form");
        s.assertEquals(numbers, 0, "E-07 number (capacity) inputs on the rule form");
        s.assertAll();
    }

    // ---------------- F ----------------

    @Test(groups = {"regression", "ui"}, description = "Preferences: threshold 0 shows 'Enter a whole number from 1 to 200.'; an agent row with no agent shows 'Pick an agent.'")
    @CaseId({"F-02", "F-04"})
    public void preferencesMessages() {
        RrPreferencesDialog d = new AssignmentRulesPage().open().roundRobin(DA_NAME).preferences();
        d.departmentThresholdOn().departmentThreshold("0").agentLevelOn().save();
        List<String> a = d.alerts();
        d.cancel();
        assertTrue(a.contains("Enter a whole number from 1 to 200."), "F-02 messages " + a);
        assertTrue(a.contains("Pick an agent."), "F-04 messages " + a);
        Map<String, Object> p = o.prefs(DA);
        assertEquals(p.get("agent_threshold_enabled"), false, "Cancel saved the preferences");
    }

    // ---------------- G ----------------

    @Test(groups = {"regression", "ui"}, description = "Notifications tab: org switches, per-department rules with email / mobile / template, unassigned-ticket alert")
    @CaseId({"G-04", "G-05"})
    public void notificationsTab() {
        AssignmentRulesPage p = new AssignmentRulesPage().open().tab("Notifications");
        String t = p.mainText();
        List<String> sw = p.switchNames();
        SoftAssert s = new SoftAssert();
        s.assertTrue(t.contains("Notification rules by department"), "G-04 no per-department rules");
        s.assertTrue(sw.contains("Email: Assigning a ticket (Agent Notifications)") && sw.contains("Mobile: Assigning a ticket (Agent Notifications)"), "G-04 email / mobile switches " + sw);
        s.assertTrue(t.contains("Default — the built-in email"), "G-04 template picker");
        s.assertTrue(sw.contains("Notify the agent when a ticket is assigned to them"), "G-04 org switch " + sw);
        s.assertTrue(t.contains("Notifies all agents when a ticket is created that has not been automatically assigned"), "G-05 unassigned-ticket alert");
        s.assertAll();
    }

    // ---------------- H ----------------

    @Test(groups = {"regression", "ui"}, description = "Skills page: department picker, search, no-match, status filter; Agent Skills search")
    @CaseId("H-05")
    public void skillsSearchAndFilters() {
        SkillsSetupPage p = new SkillsSetupPage().open().department(DA_NAME);
        List<String> all = p.skillRows();
        p.search("QA AS6 sk");
        List<String> hit = p.skillRows();
        p.search("zzqq" + uid());
        List<String> none = p.skillRows();
        p.search("");
        List<String> st = p.statusOptions();
        new org.openqa.selenium.interactions.Actions(driver()).sendKeys(org.openqa.selenium.Keys.ESCAPE).perform();
        p.tab("Agent Skills").searchAgents("DEV");
        String agents = p.mainText();
        SoftAssert s = new SoftAssert();
        s.assertFalse(all.isEmpty(), "Dept A shows no skills");
        s.assertTrue(!hit.isEmpty() && hit.stream().allMatch(x -> x.toLowerCase().contains("qa as6 sk")), "search 'QA AS6 sk' -> " + hit);
        s.assertTrue(none.isEmpty(), "no-match search -> " + none);
        s.assertTrue(st.size() >= 2, "status filter options " + st);
        s.assertTrue(agents.contains(A3_NAME) && !agents.contains(A1_NAME), "Agent Skills search 'DEV'");
        s.assertAll();
    }

    @Test(groups = {"regression", "ui", "security"}, description = "Skill and rule names with markup are shown as text: no live <img onerror>, no alert")
    @CaseId({"H-14", "I-05"})
    public void markupShownAsText() {
        String xs = PREFIX + "<img src=x onerror=alert(1)> " + uid();
        o.skill(DA, xs, o.skillType(DA, PREFIX + "XSS type " + uid()), false, contains(PREFIX + "XSS never"));
        String rule = PREFIX + "<b>bold</b> " + uid();
        Map<String, Object> b = directBody(rule, l("create"), l(directTarget(contains(PREFIX + "XSS never"), DA, null, agent(A1))));
        b.put("is_active", false);
        o.rule(b);
        SkillsSetupPage sp = new SkillsSetupPage().open().department(DA_NAME);
        boolean skillText = sp.mainText().contains("<img src=x onerror=alert(1)>");
        long imgs = sp.liveImgOnerror();
        String list = new AssignmentRulesPage().open().directListText();
        boolean alert;
        try {
            driver().switchTo().alert().dismiss();
            alert = true;
        } catch (org.openqa.selenium.NoAlertPresentException e) {
            alert = false;
        }
        SoftAssert s = new SoftAssert();
        s.assertTrue(skillText, "H-14 skill name not shown as text");
        s.assertEquals(imgs, 0L, "H-14 live img[onerror] elements");
        s.assertTrue(list.contains("<b>bold</b>"), "I-05 rule name markup not shown as text");
        s.assertFalse(alert, "alert fired");
        s.assertAll();
    }

    // ---------------- I ----------------

    /** Runs last in the class: a language left on Arabic would break every English locator after it. */
    @Test(priority = 100, groups = {"regression", "ui", "i18n"}, description = "Arabic: the page turns right-to-left and is translated")
    @CaseId("I-01")
    public void arabic() {
        AssignmentRulesPage p = new AssignmentRulesPage().open();
        try {
            p.language("العربية|Arabic", "rtl");
            Waits.sleep(2000);
            String dir = p.htmlDir();
            String main = p.mainText();
            assertEquals(dir, "rtl", "direction");
            assertFalse(main.contains("Direct Assignment") || main.contains("New Rule"), "English page text left on the Arabic page");
        } finally {
            p.language("English|الإنجليزية", "ltr");
            p.forceEnglish();
        }
        assertEquals(p.htmlDir(), "ltr", "language not restored");
    }

    @Test(groups = {"regression", "ui", "a11y"}, description = "Every switch on the Rules tab has an accessible name")
    @CaseId("I-02")
    public void switchesNamed() {
        List<String> sw = new AssignmentRulesPage().open().switchNames();
        assertFalse(sw.isEmpty(), "no switches");
        assertFalse(sw.contains("(no name)"), "unnamed switches: " + sw);
        assertTrue(sw.contains("Direct Assignment Rules"), sw.toString());
    }

    // ---------------- R ----------------

    @Test(groups = {"regression", "ui", "NDC-2813"}, description = "New Ticket form shows Ticket Owner 'Unassigned' (so round robin can act)")
    @CaseId("R-2813")
    public void newTicketOwnerUnassigned() {
        String t = new NewTicketPage().open().ownerText();
        assertTrue(t.contains("Unassigned"), "Ticket Owner field: " + cut(t, 120));
        Waits.sleep(200);
    }
}
