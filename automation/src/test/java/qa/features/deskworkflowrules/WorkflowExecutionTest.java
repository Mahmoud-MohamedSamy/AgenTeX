package qa.features.deskworkflowrules;

import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.core.base.Waits;
import qa.features.deskworkflowrules.pages.WorkflowRulesListPage;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.deskworkflowrules.Rules.oneOf;

/**
 * Spec groups H and I: what rules really do to tickets. Rules and tickets are created through the API
 * (the UI is covered elsewhere); results are read from the ticket record and Execution History.
 * Every QA rule has the guard "subject starts with QA WF ", and the teammates' Ticket rules are paused for
 * each test and restored after it (user approved, 12 Oct 2026).
 * Negative checks always wait for a CONTROL rule on the same ticket first; no control = SKIP (inconclusive).
 * Run: mvnw test -Dtest=WorkflowExecutionTest
 */
public class WorkflowExecutionTest extends BaseTest {
    private static final int WAIT = 60;
    private DeskWorkflowRulesApi api;
    private final List<String> rules = new ArrayList<>();
    private final List<String> tickets = new ArrayList<>();
    private String tagA, tagB, tagC;

    @BeforeMethod(alwaysRun = true)
    public void prepare() {
        new WorkflowRulesListPage().openForApi(); // signed-in page on the app origin, so the token can be read
        api = new DeskWorkflowRulesApi().requireAuth();
        api.pauseOtherRules(DeskWorkflowRulesApi.TICKETS);
        String dept = DeskWorkflowRulesFeature.QA_DEPARTMENT_ID;
        tagA = api.tagId("QA WF tag A", dept);
        tagB = api.tagId("QA WF tag B", dept);
        tagC = api.tagId("QA WF tag C", dept);
    }

    @AfterMethod(alwaysRun = true)
    public void cleanUp() {
        if (api == null) return;
        List<String> problems = new ArrayList<>();
        for (String id : rules) if (api.deleteRule(id).statusCode() / 100 != 2) problems.add("rule " + id);
        for (String id : tickets) if (api.deleteTicket(id).statusCode() / 100 != 2) problems.add("ticket " + id);
        rules.clear();
        tickets.clear();
        try {
            api.restorePaused();
        } catch (RuntimeException e) {
            problems.add(e.getMessage());
        }
        if (!problems.isEmpty()) System.err.println("[cleanup] not removed: " + problems);
    }

    // ---------------- helpers ----------------

    private String rule(Rules r) {
        String id = api.createRuleOk(r.build());
        rules.add(id);
        return id;
    }

    private String ticket(String label, String priority) {
        return ticket(label, priority, Map.of());
    }

    private String ticket(String label, String priority, Map<String, Object> extra) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("subject", DeskWorkflowRulesFeature.QA + label + " " + System.currentTimeMillis() % 100000);
        f.put("department", DeskWorkflowRulesFeature.QA_DEPARTMENT_ID); // required; without it the API answers 500
        f.put("email", "qa.workflow@qa.test");
        f.put("status", "open");
        f.put("priority", priority);
        f.put("channel", "web");
        f.putAll(extra);
        String id = api.createTicket(f);
        tickets.add(id);
        return id;
    }

    private boolean hasTag(String ticketId, String tagId) {
        String tags = api.ticket(ticketId).get("tags");
        return tags != null && tags.contains(tagId);
    }

    private boolean waitTag(String ticketId, String tagId) {
        return api.waitTicket(ticketId, t -> t.get("tags") != null && t.get("tags").contains(tagId), WAIT);
    }

    /** Control rule (On Create or Edit, adds tag C) so a negative check is only trusted after the engine ran. */
    private void controlRule() {
        rule(Rules.named("control create-or-edit tag C").onCreateOrEdit().addTags("append", tagC));
    }

    private void awaitControl(String ticketId) {
        if (!waitTag(ticketId, tagC))
            throw new SkipException("Inconclusive: control rule did not run within " + WAIT + " s on ticket " + ticketId
                    + ". Executions: " + api.executionsText(ticketId));
        Waits.sleep(5000); // same chance for the rule under test
    }

    private void edit(String ticketId, Map<String, Object> fields) {
        DeskWorkflowRulesApi.ok(api.updateTicket(ticketId, fields), "update ticket " + ticketId);
    }

    private int runs(String ticketId, String ruleId) {
        return api.executions(ticketId, ruleId).size();
    }

    // ---------------- H: triggers and conditions ----------------

    @Test(groups = {"regression", "execution"}, description = "On Create rule fires once when a QA ticket is created")
    @CaseId("WFR-H1")
    public void onCreateFires() {
        String r = rule(Rules.named("H1 on create tag A").onCreate().addTags("append", tagA));
        String t = ticket("H1", "low");
        assertTrue(waitTag(t, tagA), "tag A not added within " + WAIT + " s. Executions: " + api.executionsText(t));
        assertEquals(runs(t, r), 1, "On Create rule should run once. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "On Create rule does not run again when the ticket is edited")
    @CaseId("WFR-H2")
    public void onCreateNotOnEdit() {
        String r = rule(Rules.named("H2 on create tag A").onCreate().addTags("append", tagA));
        controlRule();
        String t = ticket("H2", "low");
        assertTrue(waitTag(t, tagA), "On Create rule did not run");
        edit(t, Map.of("description", "QA WF edited"));
        api.waitTicket(t, x -> runs(t, r) > 1, 20);
        assertEquals(runs(t, r), 1, "On Create rule ran again after an edit. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution", "NDC-2205"}, description = "On Edit rule: not on create, once on an edit")
    @CaseId("WFR-H3")
    public void onEditOnlyOnEdit() {
        String r = rule(Rules.named("H3 on edit tag A").onEdit().addTags("append", tagA));
        controlRule();
        String t = ticket("H3", "low");
        awaitControl(t);
        assertFalse(hasTag(t, tagA), "NDC-2205: On Edit rule ran when the ticket was created. Executions: " + api.executionsText(t));
        edit(t, Map.of("description", "QA WF edited"));
        assertTrue(waitTag(t, tagA), "On Edit rule did not run after an edit. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution", "NDC-2205"}, description = "Field Changed (priority): not on create, not on another field, yes on priority")
    @CaseId("WFR-H4")
    public void fieldChangedOnlyOnThatField() {
        rule(Rules.named("H4 priority changed tag A").onFieldChanged("priority").addTags("append", tagA));
        controlRule();
        String t = ticket("H4", "low");
        awaitControl(t);
        assertFalse(hasTag(t, tagA), "NDC-2205: Field Changed rule ran on create. Executions: " + api.executionsText(t));
        edit(t, Map.of("description", "QA WF other field"));
        Waits.sleep(10000);
        assertFalse(hasTag(t, tagA), "Field Changed (priority) rule ran when only description changed");
        edit(t, Map.of("priority", "high"));
        assertTrue(waitTag(t, tagA), "Field Changed rule did not run when priority changed. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Create or Edit rule runs on create and on each edit (Recurring)")
    @CaseId("WFR-H5")
    public void createOrEditRecurring() {
        String r = rule(Rules.named("H5 create or edit tag A").onCreateOrEdit().addTags("append", tagA));
        String t = ticket("H5", "low");
        assertTrue(waitTag(t, tagA), "did not run on create");
        edit(t, Map.of("description", "QA WF edit 1"));
        assertTrue(api.waitTicket(t, x -> runs(t, r) >= 2, WAIT), "did not run on the edit. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "Condition match / miss: Priority is one of high")
    @CaseId("WFR-H8")
    public void conditionMatchAndMiss() {
        rule(Rules.named("H8 priority high tag A").onCreate().where(oneOf("priority", "high")).addTags("append", tagA));
        controlRule();
        String hit = ticket("H8 high", "high");
        String miss = ticket("H8 low", "low");
        assertTrue(waitTag(hit, tagA), "rule did not run for priority high");
        awaitControl(miss);
        assertFalse(hasTag(miss, tagA), "rule ran for priority low");
    }

    @Test(groups = {"regression", "execution"}, description = "Two matching rules both run")
    @CaseId("WFR-H9")
    public void twoMatchingRulesBothRun() {
        rule(Rules.named("H9 rule 1 tag A").onCreate().addTags("append", tagA));
        rule(Rules.named("H9 rule 2 tag B").onCreate().addTags("append", tagB));
        String t = ticket("H9", "low");
        assertTrue(api.waitTicket(t, x -> x.get("tags") != null && x.get("tags").contains(tagA) && x.get("tags").contains(tagB), WAIT),
                "both rules should add their tag; tags=" + api.ticket(t).get("tags") + ". Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "An inactive rule is skipped")
    @CaseId("WFR-H11")
    public void inactiveRuleSkipped() {
        rule(Rules.named("H11 inactive tag A").onCreate().inactive().addTags("append", tagA));
        controlRule();
        String t = ticket("H11", "low");
        awaitControl(t);
        assertFalse(hasTag(t, tagA), "inactive rule ran");
    }

    @Test(groups = {"regression", "execution"}, description = "One-time rule fires at most once per record")
    @CaseId("WFR-H12")
    public void oneTimeRule() {
        String r = rule(Rules.named("H12 one time tag A").onCreateOrEdit().oneTime().addTags("append", tagA));
        String t = ticket("H12", "low");
        assertTrue(waitTag(t, tagA), "one-time rule did not run on create");
        edit(t, Map.of("description", "QA WF edit 1"));
        edit(t, Map.of("description", "QA WF edit 2"));
        Waits.sleep(15000);
        long fired = api.executions(t, r).stream().filter(e -> "Fired".equals(e.get("outcome"))).count();
        assertEquals(fired, 1L, "One-time rule fired " + fired + " times. Executions: " + api.executionsText(t));
    }

    @Test(groups = {"regression", "execution"}, description = "One rule, one ticket: exactly one Execution History row")
    @CaseId("WFR-H19")
    public void oneExecutionRowPerRun() {
        String r = rule(Rules.named("H19 single run tag A").onCreate().addTags("append", tagA));
        String t = ticket("H19", "low");
        assertTrue(waitTag(t, tagA), "rule did not run");
        Waits.sleep(10000);
        assertEquals(runs(t, r), 1, "possible bug: the same run is logged more than once. Executions: " + api.executionsText(t));
    }

    // ---------------- I: action results ----------------

    @Test(groups = {"regression", "execution"}, description = "Field Update with a merge field writes the rendered text")
    @CaseId("WFR-I1")
    public void fieldUpdateMergeField() {
        rule(Rules.named("I1 description merge").onCreate().fieldUpdate("description", "QA WF set for ${subject}"));
        String t = ticket("I1", "low");
        String subject = api.ticket(t).get("subject");
        assertTrue(api.waitTicket(t, x -> ("QA WF set for " + subject).equals(x.get("description")), WAIT),
                "description=" + api.ticket(t).get("description") + ", expected 'QA WF set for " + subject + "'");
    }

    /** "[id1, id2]" → "[tag B, tag A]" so a failure says which tags stayed. */
    private String tagNames(String ids) {
        if (ids == null) return "no tags";
        return ids.replace(tagA, "tag A").replace(tagB, "tag B").replace(tagC, "tag C");
    }

    /** Ticket with starting tags put on through the ticket tag endpoint (the create body does not save tags). */
    private String taggedTicket(String label, String... tagIds) {
        String t = ticket(label, "low");
        api.addTicketTags(t, tagIds);
        if (!api.waitTicket(t, x -> x.get("tags") != null && java.util.Arrays.stream(tagIds).allMatch(x.get("tags")::contains), 30))
            throw new SkipException("Inconclusive: starting tags not on ticket " + t + ": " + tagNames(api.ticket(t).get("tags")));
        return t;
    }

    @Test(groups = {"regression", "execution"}, description = "Add Tags: 'Add to existing tags' keeps the ticket's tags; 'Replace existing tags' leaves only the selected ones")
    @CaseId("WFR-I26")
    public void addTagsAppendAndReplace() {
        rule(Rules.named("I26 add to existing A").onEdit().where(Rules.contains("description", "QA WF append")).addTags("append", tagA));
        rule(Rules.named("I26 replace with C").onEdit().where(Rules.contains("description", "QA WF replace")).addTags("overwrite", tagC));
        String t1 = taggedTicket("I26 append", tagB);
        String t2 = taggedTicket("I26 replace", tagA, tagB);
        edit(t1, Map.of("description", "QA WF append"));
        edit(t2, Map.of("description", "QA WF replace"));
        assertTrue(api.waitTicket(t1, x -> x.get("tags") != null && x.get("tags").contains(tagA) && x.get("tags").contains(tagB), WAIT),
                "Add to existing tags: expected tag B + tag A, got " + tagNames(api.ticket(t1).get("tags")) + ". Executions: " + api.executionsText(t1));
        assertTrue(api.waitTicket(t2, x -> x.get("tags") != null && x.get("tags").contains(tagC) && !x.get("tags").contains(tagA)
                && !x.get("tags").contains(tagB), WAIT), "Replace existing tags: expected only tag C, got " + tagNames(api.ticket(t2).get("tags"))
                + ". Executions: " + api.executionsText(t2));
    }

    @Test(groups = {"regression", "execution"}, description = "Remove Tags takes only the selected tag off")
    @CaseId("WFR-I27")
    public void removeTags() {
        rule(Rules.named("I27 remove A on edit").onEdit().where(Rules.contains("description", "QA WF remove")).removeTags(tagA));
        String t = taggedTicket("I27", tagA, tagB);
        edit(t, Map.of("description", "QA WF remove"));
        assertTrue(api.waitTicket(t, x -> x.get("tags") != null && !x.get("tags").contains(tagA) && x.get("tags").contains(tagB), WAIT),
                "expected only tag B left, got " + tagNames(api.ticket(t).get("tags")) + ". Executions: " + api.executionsText(t));
    }
}
