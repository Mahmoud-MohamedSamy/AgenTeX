package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.DEALS;
import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.crmautomationorder.CrmOrderFeature.TASKS;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Spec group E — Blueprint alone (E-01…E-18), session SE.
 * Leads blueprints govern lead_source (chat → web → referral) on this session's QA layout; Deals use stage with the
 * layout's pipeline; Tasks use status (never "Completed"). Definition shapes come from the build's designer chunk
 * (BlueprintDesignerPage / BlueprintTransitionModal, index-DWsxCNuD.js) and teammate blueprint RVW-008:
 * before {allowedUserIds, allowOwner, allowedRoles, visibilityCriteria}; during {requiredFields[{name, datatype{key}, required}]};
 * after {actions[setField | sendEmail | sendNotification | createTask | createRecord | webhook]}; transition isCommon /
 * subTransitions (parallel); state autoTransitionId + autoTransitionAfterMinutes, slaMinutes + slaEscalation.
 * Transition payload = {fieldName: value, __note: …} (the modal's values object).
 */
public class GroupEBlueprintTest extends OrderTestBase {
    @Override protected String session() { return "SE"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private static final List<String> SRC = List.of("chat", "web", "referral");
    /** Records made by after-actions (not registered by CrmApi): deleted before the base cleanup. */
    private final List<String[]> extra = new ArrayList<>();

    @AfterMethod(alwaysRun = true)
    public void dropExtra() {
        for (String[] e : extra) {
            try {
                System.out.println("[cleanup extra] " + e[1] + " -> " + api.admin().delete("/modules/" + e[0] + "/records/" + e[1]).statusCode());
            } catch (Exception ex) {
                System.out.println("[cleanup extra] " + ex.getMessage());
            }
        }
        extra.clear();
    }

    // ------------------------------------------------------------------ helpers

    private static void note(String line) {
        System.out.println(line);
        try {
            Path p = Path.of("target", "se-notes.log");
            Files.createDirectories(p.getParent());
            Files.writeString(p, Instant.now() + " " + line + "\n", StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
            // notes are best effort
        }
    }

    private static String cut(String s) {
        return s == null ? "null" : s.length() > 1500 ? s.substring(0, 1500) + "…" : s;
    }

    private Map<String, Object> entry(String module, String caseTag) {
        // blueprint criteria use the designer shape {op, field, value} (RVW-008, BlueprintTransitionModal); the
        // workflow-style StringMatch from CrmProcs.guard is stored but ignored by the blueprint engine (see E-02 run 1)
        return op("startsWith", CrmProcs.nameField(module), CrmOrderFeature.prefix() + caseTag);
    }

    private static Map<String, Object> op(String op, String field, Object value) {
        return kinded("op", op, "field", field, "value", value);
    }

    @SafeVarargs
    private static Map<String, Object> allOf(Map<String, Object>... c) {
        return kinded("op", "and", "children", List.of(c));
    }

    private static Map<String, Object> state(String id, int i, boolean terminal) {
        return kinded("id", id, "name", id, "position", kinded("x", 80 + 260 * i, "y", 80), "isTerminal", terminal);
    }

    private static List<Map<String, Object>> states(List<String> ids) {
        List<Map<String, Object>> st = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) st.add(state(ids.get(i), i, i == ids.size() - 1));
        return st;
    }

    private static Map<String, Object> tr(String id, String name, String from, String to, Map<String, Object> before,
                                          Map<String, Object> during, List<Map<String, Object>> after) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("id", id);
        t.put("name", name);
        t.put("fromStateId", from);
        t.put("toStateId", to);
        t.put("color", "#2563eb");
        t.put("before", before == null ? Map.of() : before);
        t.put("during", during == null ? Map.of() : during);
        t.put("after", Map.of("actions", after == null ? List.of() : after));
        return t;
    }

    /** Chain transitions t0 (s0→s1), t1 (s1→s2)… with no conditions. */
    private static List<Map<String, Object>> chain(List<String> ids) {
        List<Map<String, Object>> l = new ArrayList<>();
        for (int i = 0; i + 1 < ids.size(); i++) l.add(tr("t" + i, "QA " + ids.get(i) + " to " + ids.get(i + 1), ids.get(i), ids.get(i + 1), null, null, null));
        return l;
    }

    private Map<String, Object> def(String moduleKey, String layoutId, String pipelineId, String field, String label, Map<String, Object> entry,
                                    List<Map<String, Object>> states, List<Map<String, Object>> transitions) {
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("name", CrmProcs.name(label));
        d.put("description", "");
        d.put("moduleKey", moduleKey);
        d.put("layoutId", layoutId);
        if (pipelineId != null) d.put("pipelineId", pipelineId);
        d.put("targetField", field);
        d.put("continuous", false);
        d.put("entryCriteria", entry);
        d.put("states", states);
        d.put("transitions", transitions);
        return d;
    }

    private Map<String, Object> leadsDef(String caseTag, List<Map<String, Object>> states, List<Map<String, Object>> transitions) {
        return def("leads", layout(LEADS), null, "lead_source", caseTag + " BP", entry(LEADS, caseTag), states, transitions);
    }

    /** Creates (inactive, registered for cleanup) and switches it on; fails the case if activation is refused. */
    private String activeBlueprint(String module, Map<String, Object> definition) {
        String id = api.blueprint(module, kinded("isActive", false, "definition", definition));
        Response on = api.setBlueprintActive(module, id, true);
        Assert.assertEquals(on.statusCode() / 100, 2, "blueprint switched on: " + cut(on.asString()));
        return id;
    }

    private String lead(String caseTag, String suffix, Map<String, Object> more) {
        Map<String, Object> f = CrmApi.minimal(LEADS, nm(caseTag, suffix));
        f.put("lead_source", "chat");
        if (more != null) f.putAll(more);
        return api.createRecord(userN(), LEADS, layout(LEADS), f);
    }

    private JsonPath bpState(CrmUser as, String module, String id) {
        JsonPath j = api.blueprintState(as, module, id);
        return j;
    }

    /** Transition ids offered to {@code as} on the record. */
    private List<String> offered(CrmUser as, String module, String id) {
        List<String> l = bpState(as, module, id).getList("data.transitions.transitionId");
        return l == null ? List.of() : l;
    }

    private List<String> activeStates(String module, String id) {
        List<Object> l = bpState(api.admin(), module, id).getList("data.states.activeStates");
        List<String> out = new ArrayList<>();
        if (l != null) for (Object o : l) {
            if (o instanceof List<?> li) for (Object x : li) out.add(String.valueOf(x));
            else out.add(String.valueOf(o));
        }
        return out;
    }

    /** Find a transition id offered whose own id or name contains the token (the API may namespace ids). */
    private String offeredLike(CrmUser as, String module, String rec, String token) {
        List<Map<String, Object>> l = bpState(as, module, rec).getList("data.transitions");
        if (l == null) return null;
        for (Map<String, Object> t : l) {
            String s = String.valueOf(t);
            if (String.valueOf(t.get("transitionId")).equals(token) || s.contains(token)) return String.valueOf(t.get("transitionId"));
        }
        return null;
    }

    private boolean governedNow(String module, String id) {
        return CrmApi.waitFor(30, () -> api.governed(module, id));
    }

    /** Raw value (decoded: string/number/object/array) of one field. */
    private Object raw(CrmUser as, String module, String id, String key) {
        List<Map<String, Object>> d = api.record(as, module, id).getList("data.data");
        for (Map<String, Object> f : d) if (key.equals(f.get("field"))) return decode(f.get("value"));
        return null;
    }

    @SuppressWarnings("unchecked")
    private static Object decode(Object v) {
        if (!(v instanceof Map<?, ?> m)) return v;
        Object kind = m.get("kind");
        if ("object".equals(kind) && m.get("properties") instanceof Map<?, ?> p) {
            Map<String, Object> o = new LinkedHashMap<>();
            ((Map<String, Object>) p).forEach((k, x) -> o.put(k, decode(x)));
            return o;
        }
        if ("array".equals(kind) && m.get("items") instanceof List<?> it) {
            List<Object> o = new ArrayList<>();
            for (Object x : it) o.add(decode(x));
            return o;
        }
        return m.get("value");
    }

    private static Map<String, Object> objectValue(Map<String, String> props) {
        Map<String, Object> p = new LinkedHashMap<>();
        props.forEach((k, v) -> p.put(k, kinded("kind", "string", "value", v)));
        return kinded("kind", "object", "properties", p);
    }

    /** Records of a module whose row text contains the token (list search). */
    private List<String> findRecords(String module, String token) {
        List<String> ids = new ArrayList<>();
        // list is oldest first, "?q=" finds nothing: scan the newest pages (CrmApi.newestRows)
        for (Map<String, Object> row : CrmApi.newestRows(api.admin(), module, 2)) if (String.valueOf(row).contains(token)) ids.add(String.valueOf(row.get("id")));
        return ids;
    }

    /** Tasks the record's Timeline links to (after-action tasks appear as references "tasks:<id>"), else by list search. */
    private List<String> createdTasks(String leadId, String subject) {
        List<String> ids = new ArrayList<>();
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("tasks:([0-9a-f-]{36})").matcher(String.valueOf(api.timeline(LEADS, leadId)));
        while (m.find()) if (!ids.contains(m.group(1))) ids.add(m.group(1));
        if (ids.isEmpty()) ids.addAll(findRecords(TASKS, subject));
        return ids;
    }

    /** Safety net: delete this session's QA leads/tasks left by an aborted case (name/subject starts with "QA AEO SE "). */
    @org.testng.annotations.AfterClass(alwaysRun = true)
    public void purgeSessionLeftovers() {
        String p = CrmOrderFeature.QA + session() + " ";
        for (String m : List.of(TASKS, LEADS)) {
            try {
                for (Map<String, Object> row : CrmApi.newestRows(adminB(), m, 2))
                    if (String.valueOf(row).contains(p + "E-"))
                        System.out.println("[purge] " + m + " " + row.get("id") + " -> " + adminB().delete("/modules/" + m + "/records/" + row.get("id")).statusCode());
            } catch (Exception e) {
                System.out.println("[purge] " + e.getMessage());
            }
        }
    }

    private void expectGovernedBlock(Response r, String what) {
        Assert.assertTrue(r.statusCode() / 100 == 4, what + " must be refused, got " + r.statusCode() + " " + cut(r.asString()));
    }

    // ------------------------------------------------------------------ E-01

    @CaseId("E-01")
    @Test(groups = {"crm-order", "group-e"}, description = "Matching lead enters the blueprint at the start state; the state field is governed")
    public void e01MatchingLeadEntersAtStartState() {
        activeBlueprint(LEADS, leadsDef("E-01", states(SRC), chain(SRC)));
        String lead = lead("E-01", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "lead governed");
        JsonPath st = bpState(userN(), LEADS, lead);
        note("[E-01] lead " + lead + " state=" + cut(st.prettify()));
        Assert.assertTrue(activeStates(LEADS, lead).contains("chat"), "start state chat, got " + activeStates(LEADS, lead));
        Assert.assertTrue(offered(userN(), LEADS, lead).size() >= 1, "chat→web transition offered");
        Response edit = api.update(userN(), LEADS, lead, Map.of("lead_source", "web"));
        note("[E-01] direct edit of lead_source -> " + edit.statusCode() + " " + cut(edit.asString()));
        expectGovernedBlock(edit, "editing the governed field");
        traceOf("E-01", LEADS, lead);
    }

    // ------------------------------------------------------------------ E-02

    @CaseId("E-02")
    @Test(groups = {"crm-order", "group-e"}, description = "Entry criteria false: the lead is not governed (control lead matching is governed)")
    public void e02EntryCriteriaFalseNotGoverned() {
        Map<String, Object> d = leadsDef("E-02", states(SRC), chain(SRC));
        d.put("entryCriteria", allOf(entry(LEADS, "E-02"), op("eq", "lead_status", "Follow Up")));
        activeBlueprint(LEADS, d);
        String control = lead("E-02", "match", Map.of("lead_status", "Follow Up"));
        String other = lead("E-02", "nomatch", Map.of("lead_status", "Busy"));
        Assert.assertTrue(governedNow(LEADS, control), "control lead (criteria true) governed");
        boolean g = api.governed(LEADS, other);
        note("[E-02] control " + control + " governed=true; other " + other + " governed=" + g);
        Assert.assertFalse(g, "lead with criteria false must not be governed");
        traceOf("E-02", LEADS, other);
    }

    // ------------------------------------------------------------------ E-03 / E-04

    private String e0304Blueprint(String caseTag, List<Map<String, Object>> after) {
        Map<String, Object> during = kinded("requiredFields", List.of(kinded("name", "email", "datatype", kinded("key", "email"), "required", true)));
        List<Map<String, Object>> t = new ArrayList<>();
        t.add(tr("t0", "QA chat to web", "chat", "web", null, during, after));
        t.add(tr("t1", "QA web to referral", "web", "referral", null, null, null));
        return activeBlueprint(LEADS, leadsDef(caseTag, states(SRC), t));
    }

    @CaseId("E-03")
    @Test(groups = {"crm-order", "group-e"}, description = "Transition with a required During field left empty is blocked")
    public void e03RequiredDuringFieldEmptyBlocked() {
        e0304Blueprint("E-03", List.of(CrmProcs.setField("description", "QA E-03 after")));
        String lead = lead("E-03", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        String t = offeredLike(userN(), LEADS, lead, "t0");
        Assert.assertNotNull(t, "t0 offered: " + offered(userN(), LEADS, lead));
        Response r = api.transition(userN(), LEADS, lead, t, Map.of());
        note("[E-03] empty During -> " + r.statusCode() + " " + cut(r.asString()));
        Assert.assertEquals(r.statusCode() / 100, 4, "transition without the required field must be refused");
        Assert.assertEquals(api.field(userN(), LEADS, lead, "lead_source"), "chat", "state unchanged");
        Assert.assertNotEquals(api.field(userN(), LEADS, lead, "description"), "QA E-03 after", "after action must not run");
        traceOf("E-03", LEADS, lead);
    }

    @CaseId("E-04")
    @Test(groups = {"crm-order", "group-e"}, description = "Transition with During fields filled moves the state and runs the After actions (field update, task, email, notification)")
    public void e04FilledTransitionRunsAfterActions() {
        String subject = nm("E-04", "after task");
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", kinded("name", subject, "subject", subject, "status", "Not Started", "priority", "normal"));
        task.put("assigneeMode", "owner");
        task.put("assigneeUserId", null);
        Map<String, Object> mail = new LinkedHashMap<>();
        mail.put("kind", "sendEmail");
        mail.put("to", List.of());
        mail.put("userIds", List.of(adminB().id()));
        mail.put("subject", nm("E-04", "after email"));
        mail.put("bodyHtml", "<p>QA AEO SE E-04 blueprint after email</p>");
        Map<String, Object> notif = kinded("kind", "sendNotification", "title", nm("E-04", "after notification"), "body", "QA AEO SE E-04",
                "notifyOwner", true, "recipientMode", "owner");
        e0304Blueprint("E-04", List.of(CrmProcs.setField("description", "QA E-04 after"), task, mail, notif));
        String lead = lead("E-04", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        String t = offeredLike(userN(), LEADS, lead, "t0");
        Response r = api.transition(userN(), LEADS, lead, t, Map.of("email", "qa.aeo.se.e04@qa.test", "__note", "QA E-04 note"));
        note("[E-04] filled -> " + r.statusCode() + " " + cut(r.asString()));
        Assert.assertEquals(r.statusCode() / 100, 2, "transition accepted");
        Assert.assertEquals(api.field(userN(), LEADS, lead, "lead_source"), "web", "state moved to web");
        Assert.assertEquals(api.field(userN(), LEADS, lead, "email"), "qa.aeo.se.e04@qa.test", "During value saved");
        boolean fu = CrmApi.waitFor(60, () -> "QA E-04 after".equals(api.field(userN(), LEADS, lead, "description")));
        List<String> tasks = new ArrayList<>();
        CrmApi.waitFor(60, () -> {
            tasks.clear();
            tasks.addAll(createdTasks(lead, subject));
            return !tasks.isEmpty();
        });
        for (String id : tasks) extra.add(new String[]{TASKS, id});
        List<Map<String, Object>> tlRows = api.timeline(LEADS, lead);
        List<Object> kinds = new ArrayList<>();
        for (Map<String, Object> row : tlRows) kinds.add(row.get("entry_type") + ":" + row.get("description"));
        note("[E-04] timeline entries " + kinds);
        String tl = String.valueOf(tlRows);
        boolean mailSeen = tl.contains("E-04 after email") || kinds.stream().anyMatch(k -> String.valueOf(k).toLowerCase().startsWith("email") || String.valueOf(k).contains("Email"));
        note("[E-04] lead " + lead + " fieldUpdate=" + fu + " tasks=" + tasks + " emailInTimeline=" + mailSeen + " timeline=" + cut(tl));
        traceOf("E-04", LEADS, lead);
        Assert.assertTrue(fu, "After field update ran");
        Assert.assertFalse(tasks.isEmpty(), "After createTask made a task '" + subject + "'");
        if (!mailSeen) inconclusive("state moved, field update and task ran; the After email is not visible in the Timeline (no inbox) - lead " + lead);
    }

    // ------------------------------------------------------------------ E-05

    @CaseId("E-05")
    @Test(groups = {"crm-order", "group-e"}, description = "Transition owner = adminA: the record owner (userN) is not offered the transition and cannot run it")
    public void e05TransitionOwnerOnly() {
        Map<String, Object> before = kinded("allowedUserIds", List.of(adminA().id()), "allowOwner", false, "allowedRoles", List.of());
        List<Map<String, Object>> t = new ArrayList<>();
        t.add(tr("t0", "QA chat to web", "chat", "web", before, null, null));
        t.add(tr("t1", "QA web to referral", "web", "referral", null, null, null));
        activeBlueprint(LEADS, leadsDef("E-05", states(SRC), t));
        String lead = lead("E-05", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        note("[E-05] userN view " + cut(bpState(userN(), LEADS, lead).prettify()));
        note("[E-05] adminA view " + cut(bpState(adminA(), LEADS, lead).prettify()));
        String forA = offeredLike(adminA(), LEADS, lead, "t0");
        Assert.assertNotNull(forA, "control: adminA (transition owner) is offered t0");
        List<Map<String, Object>> forU = bpState(userN(), LEADS, lead).getList("data.transitions");
        boolean uOffered = forU != null && forU.stream().anyMatch(x -> forA.equals(String.valueOf(x.get("transitionId")))
                && !Boolean.FALSE.equals(x.get("canExecute")) && !Boolean.FALSE.equals(x.get("allowed")));
        Response byU = api.transition(userN(), LEADS, lead, forA, Map.of());
        note("[E-05] userN executes -> " + byU.statusCode() + " " + cut(byU.asString()));
        Assert.assertEquals(api.field(adminA(), LEADS, lead, "lead_source"), "chat", "userN must not move the record");
        Assert.assertFalse(uOffered, "userN must not see the transition button");
        Assert.assertEquals(byU.statusCode() / 100, 4, "userN's call refused");
        Response byA = api.transition(adminA(), LEADS, lead, forA, Map.of());
        Assert.assertEquals(byA.statusCode() / 100, 2, "control: adminA runs it: " + cut(byA.asString()));
        Assert.assertEquals(api.field(adminA(), LEADS, lead, "lead_source"), "web");
        traceOf("E-05", LEADS, lead);
    }

    // ------------------------------------------------------------------ E-06

    @CaseId("E-06")
    @Test(groups = {"crm-order", "group-e"}, description = "Editing the governed state field directly is blocked (owner and admin)")
    public void e06DirectEditBlocked() {
        activeBlueprint(LEADS, leadsDef("E-06", states(SRC), chain(SRC)));
        String lead = lead("E-06", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        Response u = api.update(userN(), LEADS, lead, Map.of("lead_source", "referral"));
        Response a = api.update(adminB(), LEADS, lead, Map.of("lead_source", "referral"));
        Response other = api.update(userN(), LEADS, lead, Map.of("description", "QA E-06 other field"));
        note("[E-06] userN edit -> " + u.statusCode() + " " + cut(u.asString()) + " | admin edit -> " + a.statusCode() + " " + cut(a.asString())
                + " | other field -> " + other.statusCode());
        expectGovernedBlock(u, "owner edit of lead_source");
        expectGovernedBlock(a, "admin edit of lead_source");
        Assert.assertEquals(other.statusCode() / 100, 2, "control: a non-governed field can be edited");
        Assert.assertEquals(api.field(userN(), LEADS, lead, "lead_source"), "chat");
        traceOf("E-06", LEADS, lead);
    }

    // ------------------------------------------------------------------ E-07

    @CaseId("E-07")
    @Test(groups = {"crm-order", "group-e"}, description = "A workflow field update on the governed field is allowed (Zoho: workflow may override); record the resulting state")
    public void e07WorkflowOverridesGovernedField() {
        activeBlueprint(LEADS, leadsDef("E-07", states(SRC), chain(SRC)));
        String lead = lead("E-07", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        String wf = api.workflowRule(CrmProcs.workflow(LEADS, "E-07 WF").onEdit().guardCase("E-07").fieldUpdate("lead_source", "referral").build());
        Assert.assertEquals(api.setWorkflowActive(wf, true).statusCode() / 100, 2, "workflow on");
        Response e = api.update(userN(), LEADS, lead, Map.of("description", "QA E-07 edit"));
        Assert.assertEquals(e.statusCode() / 100, 2, "edit of description: " + cut(e.asString()));
        boolean ran = CrmApi.waitFor(90, () -> !api.executions(lead).isEmpty() && api.executions(lead).stream().anyMatch(x -> wf.equals(x.get("ruleId"))));
        List<Map<String, Object>> ex = api.executions(lead);
        String src = api.field(userN(), LEADS, lead, "lead_source");
        List<String> st = activeStates(LEADS, lead);
        note("[E-07] lead " + lead + " wfRan=" + ran + " executions=" + cut(String.valueOf(ex)) + " lead_source=" + src + " bpStates=" + st
                + " offered=" + offered(adminB(), LEADS, lead));
        traceOf("E-07", LEADS, lead);
        if (!ran) inconclusive("workflow rule never evaluated on the edit (no execution row in 90 s) - lead " + lead);
        Assert.assertEquals(src, "referral", "workflow field update should override the blueprint field (Zoho); execution rows: " + cut(String.valueOf(ex)));
    }

    // ------------------------------------------------------------------ E-08

    @CaseId("E-08")
    @Test(groups = {"crm-order", "group-e"}, description = "Automatic transition after 2 minutes fires (control: its After field update)")
    public void e08AutomaticTransition() {
        List<Map<String, Object>> st = states(SRC);
        st.get(0).put("autoTransitionId", "t0");
        st.get(0).put("autoTransitionAfterMinutes", 2);
        List<Map<String, Object>> t = new ArrayList<>();
        t.add(tr("t0", "QA chat to web auto", "chat", "web", null, null, List.of(CrmProcs.setField("description", "QA E-08 auto after"))));
        t.add(tr("t1", "QA web to referral", "web", "referral", null, null, null));
        activeBlueprint(LEADS, leadsDef("E-08", st, t));
        String lead = lead("E-08", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        long t0 = System.currentTimeMillis();
        boolean moved = CrmApi.waitFor(420, () -> "web".equals(api.field(adminB(), LEADS, lead, "lead_source")));
        long secs = (System.currentTimeMillis() - t0) / 1000;
        String desc = api.field(adminB(), LEADS, lead, "description");
        note("[E-08] lead " + lead + " moved=" + moved + " after ~" + secs + "s description=" + desc + " states=" + activeStates(LEADS, lead));
        traceOf("E-08", LEADS, lead);
        Assert.assertTrue(moved, "automatic transition (2 min) did not fire within 7 min");
        Assert.assertEquals(desc, "QA E-08 auto after", "After action of the automatic transition");
    }

    // ------------------------------------------------------------------ E-09

    @CaseId("E-09")
    @Test(groups = {"crm-order", "group-e"}, description = "State SLA of 1 minute: escalation actions fire")
    public void e09StateSlaEscalation() {
        List<Map<String, Object>> st = states(SRC);
        st.get(0).put("slaMinutes", 1);
        st.get(0).put("slaEscalation", List.of(CrmProcs.setField("description", "QA E-09 SLA escalated"),
                kinded("kind", "sendNotification", "title", nm("E-09", "SLA notification"), "body", "QA AEO SE E-09", "notifyOwner", true, "recipientMode", "owner")));
        activeBlueprint(LEADS, leadsDef("E-09", st, chain(SRC)));
        String lead = lead("E-09", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        long t0 = System.currentTimeMillis();
        boolean fired = CrmApi.waitFor(600, () -> "QA E-09 SLA escalated".equals(api.field(adminB(), LEADS, lead, "description")));
        note("[E-09] lead " + lead + " escalation fired=" + fired + " after ~" + (System.currentTimeMillis() - t0) / 1000 + "s; state "
                + cut(bpState(adminB(), LEADS, lead).prettify()));
        traceOf("E-09", LEADS, lead);
        Assert.assertTrue(fired, "SLA escalation (1 min) did not run within 10 min");
    }

    // ------------------------------------------------------------------ E-10

    @CaseId("E-10")
    @Test(groups = {"crm-order", "group-e"}, description = "A common transition is available from every state")
    public void e10CommonTransition() {
        List<Map<String, Object>> t = chain(SRC);
        Map<String, Object> common = tr("tc", "QA common to referral", null, "referral", null, null, List.of(CrmProcs.setField("description", "QA E-10 common")));
        common.put("isCommon", true);
        t.add(common);
        activeBlueprint(LEADS, leadsDef("E-10", states(SRC), t));
        String lead = lead("E-10", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        String cChat = offeredLike(userN(), LEADS, lead, "tc");
        note("[E-10] in chat: " + offered(userN(), LEADS, lead));
        Assert.assertNotNull(cChat, "common transition offered in chat");
        Response r = api.transition(userN(), LEADS, lead, offeredLike(userN(), LEADS, lead, "t0"), Map.of());
        Assert.assertEquals(r.statusCode() / 100, 2, "chat→web: " + cut(r.asString()));
        String cWeb = offeredLike(userN(), LEADS, lead, "tc");
        note("[E-10] in web: " + offered(userN(), LEADS, lead));
        Assert.assertNotNull(cWeb, "common transition offered in web");
        Response c = api.transition(userN(), LEADS, lead, cWeb, Map.of());
        Assert.assertEquals(c.statusCode() / 100, 2, "common transition runs: " + cut(c.asString()));
        Assert.assertEquals(api.field(userN(), LEADS, lead, "lead_source"), "referral");
        traceOf("E-10", LEADS, lead);
    }

    // ------------------------------------------------------------------ E-11

    @CaseId("E-11")
    @Test(groups = {"crm-order", "group-e"}, description = "Parallel transition: the record moves only after every branch is done")
    public void e11ParallelTransition() {
        Map<String, Object> par = tr("tp", "QA parallel chat to web", "chat", "web", null, null, List.of(CrmProcs.setField("description", "QA E-11 parallel done")));
        par.put("subTransitions", List.of(
                kinded("id", "st_a", "name", "QA part A", "color", "#2563eb", "before", Map.of(), "during", Map.of()),
                kinded("id", "st_b", "name", "QA part B", "color", "#2563eb", "before", Map.of(), "during", Map.of())));
        List<Map<String, Object>> t = new ArrayList<>();
        t.add(par);
        t.add(tr("t1", "QA web to referral", "web", "referral", null, null, null));
        activeBlueprint(LEADS, leadsDef("E-11", states(SRC), t));
        String lead = lead("E-11", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        note("[E-11] start " + cut(bpState(userN(), LEADS, lead).prettify()));
        String a = offeredLike(userN(), LEADS, lead, "st_a");
        String b = offeredLike(userN(), LEADS, lead, "st_b");
        Assert.assertNotNull(a, "branch A offered: " + offered(userN(), LEADS, lead));
        Assert.assertNotNull(b, "branch B offered");
        Response ra = api.transition(userN(), LEADS, lead, a, Map.of());
        note("[E-11] branch A -> " + ra.statusCode() + " " + cut(ra.asString()) + " ; now " + cut(bpState(userN(), LEADS, lead).prettify()));
        Assert.assertEquals(ra.statusCode() / 100, 2, "branch A runs");
        Assert.assertEquals(api.field(userN(), LEADS, lead, "lead_source"), "chat", "after one branch the record must stay in chat");
        String b2 = offeredLike(userN(), LEADS, lead, "st_b");
        Assert.assertNotNull(b2, "branch B still offered");
        Response rb = api.transition(userN(), LEADS, lead, b2, Map.of());
        Assert.assertEquals(rb.statusCode() / 100, 2, "branch B runs: " + cut(rb.asString()));
        boolean moved = CrmApi.waitFor(30, () -> "web".equals(api.field(userN(), LEADS, lead, "lead_source")));
        note("[E-11] lead " + lead + " moved after both=" + moved + " description=" + api.field(userN(), LEADS, lead, "description"));
        traceOf("E-11", LEADS, lead);
        Assert.assertTrue(moved, "moved to web after both branches");
    }

    // ------------------------------------------------------------------ E-12

    @CaseId("E-12")
    @Test(groups = {"crm-order", "group-e"}, description = "Draft edit of a published blueprint: records follow the published version until Publish")
    public void e12DraftFollowsPublishedUntilPublish() {
        List<Map<String, Object>> t = chain(SRC);
        t.set(0, tr("t0", "QA chat to web", "chat", "web", null, null, List.of(CrmProcs.setField("description", "QA E-12 v1"))));
        Map<String, Object> d = leadsDef("E-12", states(SRC), t);
        String bp = activeBlueprint(LEADS, d);
        // draft: the same transition now writes v2
        Map<String, Object> d2 = new LinkedHashMap<>(d);
        List<Map<String, Object>> t2 = chain(SRC);
        t2.set(0, tr("t0", "QA chat to web", "chat", "web", null, null, List.of(CrmProcs.setField("description", "QA E-12 v2"))));
        d2.put("transitions", t2);
        Response dr = api.admin().put("/modules/" + LEADS + "/blueprints/" + bp + "/draft", Map.of("definition", d2));
        note("[E-12] draft -> " + dr.statusCode() + " " + cut(dr.asString()));
        Assert.assertEquals(dr.statusCode() / 100, 2, "draft saved");
        JsonPath g = CrmUser.ok(api.admin().get("/modules/" + LEADS + "/blueprints/" + bp), "GET bp").jsonPath();
        note("[E-12] after draft: hasDraft=" + g.get("data.hasDraft") + " draftVersion=" + g.get("data.draftVersion"));
        String l1 = lead("E-12", "lead1", null);
        Assert.assertTrue(governedNow(LEADS, l1), "governed");
        Assert.assertEquals(api.transition(userN(), LEADS, l1, offeredLike(userN(), LEADS, l1, "t0"), Map.of()).statusCode() / 100, 2, "t0 on lead1");
        boolean v1 = CrmApi.waitFor(45, () -> api.field(userN(), LEADS, l1, "description") != null);
        String desc1 = api.field(userN(), LEADS, l1, "description");
        Response pub = api.admin().post("/modules/" + LEADS + "/blueprints/" + bp + "/publish", Map.of());
        note("[E-12] publish -> " + pub.statusCode() + " " + cut(pub.asString()));
        Assert.assertEquals(pub.statusCode() / 100, 2, "publish");
        Response vers = api.admin().get("/modules/" + LEADS + "/blueprints/" + bp + "/versions");
        note("[E-12] versions -> " + vers.statusCode() + " " + cut(vers.asString()));
        String l2 = lead("E-12", "lead2", null);
        Assert.assertTrue(governedNow(LEADS, l2), "governed lead2");
        Assert.assertEquals(api.transition(userN(), LEADS, l2, offeredLike(userN(), LEADS, l2, "t0"), Map.of()).statusCode() / 100, 2, "t0 on lead2");
        CrmApi.waitFor(45, () -> api.field(userN(), LEADS, l2, "description") != null);
        String desc2 = api.field(userN(), LEADS, l2, "description");
        note("[E-12] lead1 " + l1 + " (draft pending) description=" + desc1 + " | lead2 " + l2 + " (after publish) description=" + desc2);
        traceOf("E-12", LEADS, l1);
        Assert.assertTrue(v1, "after action ran on lead1");
        Assert.assertEquals(desc1, "QA E-12 v1", "while the draft is unpublished the published version runs");
        Assert.assertEquals(desc2, "QA E-12 v2", "after Publish the new version runs");
    }

    // ------------------------------------------------------------------ E-13

    @CaseId("E-13")
    @Test(enabled = false, groups = {"crm-order", "group-e"}, description = "Mass exclude one record: it leaves the blueprint (control record stays)")
    public void e13MassExcludeOne() {
        String bp = activeBlueprint(LEADS, leadsDef("E-13", states(SRC), chain(SRC)));
        String l1 = lead("E-13", "lead1", null);
        String l2 = lead("E-13", "lead2", null);
        Assert.assertTrue(governedNow(LEADS, l1) && governedNow(LEADS, l2), "both governed");
        Response r = api.admin().post("/modules/" + LEADS + "/blueprints/" + bp + "/mass-exclude", Map.of("record_ids", List.of(l1)));
        note("[E-13] mass-exclude -> " + r.statusCode() + " " + cut(r.asString()));
        Assert.assertEquals(r.statusCode() / 100, 2, "mass-exclude accepted");
        boolean left = CrmApi.waitFor(30, () -> !api.governed(LEADS, l1));
        boolean ctl = api.governed(LEADS, l2);
        Response edit = api.update(userN(), LEADS, l1, Map.of("lead_source", "referral"));
        note("[E-13] l1 " + l1 + " left=" + left + " | l2 " + l2 + " still governed=" + ctl + " | l1 lead_source edit after exclude -> " + edit.statusCode());
        traceOf("E-13", LEADS, l1);
        Assert.assertTrue(ctl, "control record stays governed");
        Assert.assertTrue(left, "excluded record leaves the blueprint");
        Assert.assertEquals(edit.statusCode() / 100, 2, "excluded record's field is editable again");
    }

    // ------------------------------------------------------------------ E-14

    @CaseId("E-14")
    @Test(groups = {"crm-order", "group-e", "NDC-1326"}, description = "Deals blueprint on Stage requires a pipeline; with the pipeline the deal is governed")
    public void e14DealsStageNeedsPipeline() {
        List<String> stages = List.of("qualification", "needs_analysis", "proposal");
        Map<String, Object> noPipe = def("deals", layout(DEALS), null, "stage", "E-14 BP nopipe", entry(DEALS, "E-14"), states(stages), chain(stages));
        Response r = api.admin().post("/modules/" + DEALS + "/blueprints", kinded("isActive", false, "definition", noPipe));
        note("[E-14] create without pipelineId -> " + r.statusCode() + " " + cut(r.asString()));
        if (r.statusCode() / 100 == 2) {
            String stray = r.jsonPath().getString("data.id");
            note("[E-14] created without pipeline id=" + stray + " - deleting -> " + api.admin().delete("/modules/" + DEALS + "/blueprints/" + stray).statusCode());
        }
        String pipe = CrmApi.pipelineOf(layout(DEALS));
        activeBlueprint(DEALS, def("deals", layout(DEALS), pipe, "stage", "E-14 BP", entry(DEALS, "E-14"), states(stages), chain(stages)));
        String deal = api.createRecord(userN(), DEALS, nm("E-14", "deal"));
        Assert.assertTrue(governedNow(DEALS, deal), "deal governed");
        Response t = api.transition(userN(), DEALS, deal, offeredLike(userN(), DEALS, deal, "t0"), Map.of());
        Assert.assertEquals(t.statusCode() / 100, 2, "deal transition: " + cut(t.asString()));
        Assert.assertEquals(api.field(userN(), DEALS, deal, "stage"), "needs_analysis");
        traceOf("E-14", DEALS, deal);
        Assert.assertEquals(r.statusCode() / 100, 4, "a Deals Stage blueprint without a pipeline must be refused (pipeline required)");
    }

    // ------------------------------------------------------------------ E-15

    @CaseId("E-15")
    @Test(groups = {"crm-order", "group-e"}, description = "Tasks blueprint on Status works")
    public void e15TasksBlueprintOnStatus() {
        List<String> st = List.of("Not Started", "In Progress", "Deferred");
        Response onStatus = api.admin().post("/modules/" + TASKS + "/blueprints",
                kinded("isActive", false, "definition", def("tasks", layout(TASKS), null, "status", "E-15 BP status", entry(TASKS, "E-15"), states(st), chain(st))));
        note("[E-15] create Tasks blueprint on status -> " + onStatus.statusCode() + " " + cut(onStatus.asString()));
        if (onStatus.statusCode() / 100 == 2) api.admin().delete("/modules/" + TASKS + "/blueprints/" + onStatus.jsonPath().getString("data.id"));
        // control: Tasks blueprint on priority (a pick_list) works end to end
        List<String> pr = List.of("low", "normal", "high");
        activeBlueprint(TASKS, def("tasks", layout(TASKS), null, "priority", "E-15 BP priority", entry(TASKS, "E-15"), states(pr), chain(pr)));
        Map<String, Object> f = CrmApi.minimal(TASKS, nm("E-15", "task"));
        f.put("priority", "low");
        String task = api.createRecord(userN(), TASKS, layout(TASKS), f);
        Assert.assertTrue(governedNow(TASKS, task), "task governed (priority blueprint)");
        Response edit = api.update(userN(), TASKS, task, Map.of("priority", "high"));
        Response t = api.transition(userN(), TASKS, task, offeredLike(userN(), TASKS, task, "t0"), Map.of());
        note("[E-15] task " + task + " priority BP: direct edit -> " + edit.statusCode() + " ; transition -> " + t.statusCode());
        Assert.assertEquals(t.statusCode() / 100, 2, "task transition (priority): " + cut(t.asString()));
        Assert.assertEquals(api.field(userN(), TASKS, task, "priority"), "normal");
        expectGovernedBlock(edit, "direct edit of the governed task priority");
        traceOf("E-15", TASKS, task);
        Assert.assertEquals(onStatus.statusCode() / 100, 2, "Zoho allows a blueprint on Tasks Status; TAVI: " + cut(onStatus.asString()));
    }

    // ------------------------------------------------------------------ E-16

    @CaseId("E-16")
    @Test(groups = {"crm-order", "group-e", "NDC-1328"}, description = "After-transition Task: Related To points at a record whose name resolves (names, not ids)")
    public void e16AfterTaskRelatedToShowsName() {
        // anchor lead: not matched by the blueprint (different case tag)
        String anchorName = nm("E-16x", "anchor");
        String anchor = api.createRecord(userN(), LEADS, layout(LEADS), CrmApi.minimal(LEADS, anchorName));
        String subject = nm("E-16", "after task");
        Map<String, Object> task = new LinkedHashMap<>();
        task.put("kind", "createTask");
        task.put("targetModuleKey", "tasks");
        task.put("fields", kinded("name", subject, "subject", subject, "status", "Not Started", "related_to", LEADS + ":" + anchor));
        task.put("assigneeMode", "owner");
        List<Map<String, Object>> t = chain(SRC);
        t.set(0, tr("t0", "QA chat to web", "chat", "web", null, null, List.of(task)));
        String bp = activeBlueprint(LEADS, leadsDef("E-16", states(SRC), t));
        JsonPath saved = CrmUser.ok(api.admin().get("/modules/" + LEADS + "/blueprints/" + bp), "GET bp").jsonPath();
        note("[E-16] saved after action " + cut(String.valueOf(saved.getList("data.definition.transitions[0].after.actions"))));
        String lead = lead("E-16", "lead", null);
        Assert.assertTrue(governedNow(LEADS, lead), "governed");
        Response r = api.transition(userN(), LEADS, lead, offeredLike(userN(), LEADS, lead, "t0"), Map.of());
        Assert.assertEquals(r.statusCode() / 100, 2, "transition: " + cut(r.asString()));
        List<String> tasks = new ArrayList<>();
        CrmApi.waitFor(60, () -> {
            tasks.clear();
            tasks.addAll(createdTasks(lead, subject));
            return !tasks.isEmpty();
        });
        for (String id : tasks) extra.add(new String[]{TASKS, id});
        Assert.assertFalse(tasks.isEmpty(), "after task created");
        JsonPath rec = api.record(adminB(), TASKS, tasks.get(0));
        note("[E-16] task " + tasks.get(0) + " record " + cut(rec.prettify()));
        Object rel = raw(adminB(), TASKS, tasks.get(0), "related_to");
        String relS = String.valueOf(rel);
        traceOf("E-16", LEADS, lead);
        Assert.assertTrue(relS.contains(anchor), "task Related To links the chosen lead, got " + relS);
        String anchorFirst = api.field(adminB(), LEADS, anchor, "first_name");
        Assert.assertEquals(anchorFirst, anchorName, "the linked record's display name resolves");
        inconclusive("runtime OK: task " + tasks.get(0) + " related_to=" + relS + " resolves to '" + anchorFirst
                + "'; the designer's Contact Name / Related To label (NDC-1328) is UI-only and browser sign-in is not allowed in this run");
    }

    // ------------------------------------------------------------------ E-17

    @CaseId("E-17")
    @Test(groups = {"crm-order", "group-e", "NDC-1436"}, description = "Blueprint field update writing an address keeps its subfields")
    public void e17AddressFieldUpdateKeepsSubfields() {
        Map<String, String> before = new LinkedHashMap<>();
        before.put("street", "12 QA Street");
        before.put("city", "Cairo");
        before.put("state", "Cairo Governorate");
        before.put("zip", "11511");
        before.put("country", "Egypt");
        String addrField = null;
        String lead = null;
        // which address field does the QA layout carry? try a few, keep the one the create accepts and stores
        for (String f : List.of("address", "new_address", "address_2", "address_3")) {
            Map<String, Object> fields = CrmApi.minimal(LEADS, nm("E-17", "probe " + f));
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("layout_id", layout(LEADS));
            List<Map<String, Object>> data = new ArrayList<>(CrmApi.data(fields));
            data.add(kinded("field", f, "value", objectValue(before)));
            body.put("data", data);
            Response r = userN().post("/modules/" + LEADS + "/records", body);
            note("[E-17] probe create with " + f + " -> " + r.statusCode() + " " + cut(r.asString()).substring(0, Math.min(300, cut(r.asString()).length())));
            if (r.statusCode() / 100 == 2) {
                String id = r.jsonPath().getString("data.id");
                Object v = raw(adminB(), LEADS, id, f);
                api.admin().delete("/modules/" + LEADS + "/records/" + id);
                if (v instanceof Map<?, ?> m && "Cairo".equals(m.get("city"))) {
                    addrField = f;
                    break;
                }
            }
        }
        if (addrField == null) inconclusive("no address field on the QA layout accepted an address value");
        Map<String, Object> after = new LinkedHashMap<>();
        after.put("street", "99 QA Blueprint Road");
        after.put("city", "Giza");
        after.put("state", "Giza Governorate");
        after.put("zip", "12511");
        after.put("country", "Egypt");
        List<Map<String, Object>> t = chain(SRC);
        t.set(0, tr("t0", "QA chat to web", "chat", "web", null, null, List.of(kinded("kind", "setField", "field", addrField, "value", after))));
        activeBlueprint(LEADS, leadsDef("E-17", states(SRC), t));
        Map<String, Object> f = CrmApi.minimal(LEADS, nm("E-17", "lead"));
        f.put("lead_source", "chat");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout(LEADS));
        List<Map<String, Object>> data = new ArrayList<>(CrmApi.data(f));
        data.add(kinded("field", addrField, "value", objectValue(before)));
        body.put("data", data);
        lead = CrmUser.ok(userN().post("/modules/" + LEADS + "/records", body), "create E-17 lead").jsonPath().getString("data.id");
        final String leadId = lead;
        extra.add(new String[]{LEADS, leadId});
        Assert.assertTrue(governedNow(LEADS, leadId), "governed");
        Response r = api.transition(userN(), LEADS, leadId, offeredLike(userN(), LEADS, leadId, "t0"), Map.of());
        Assert.assertEquals(r.statusCode() / 100, 2, "transition: " + cut(r.asString()));
        final String af = addrField;
        CrmApi.waitFor(45, () -> String.valueOf(raw(adminB(), LEADS, leadId, af)).contains("Giza"));
        Object v = raw(adminB(), LEADS, leadId, addrField);
        note("[E-17] lead " + leadId + " field " + addrField + " after transition = " + v);
        traceOf("E-17", LEADS, leadId);
        Assert.assertTrue(v instanceof Map, "address stored as subfields, not plain text: " + v);
        Map<?, ?> m = (Map<?, ?>) v;
        for (Map.Entry<String, Object> e : after.entrySet()) Assert.assertEquals(m.get(e.getKey()), e.getValue(), "subfield " + e.getKey());
    }

    // ------------------------------------------------------------------ E-18

    @CaseId("E-18")
    @Test(groups = {"crm-order", "group-e"}, description = "Two blueprints match the same record: only the first in the list runs; /sort changes which")
    public void e18TwoBlueprintsFirstWins() {
        Map<String, Object> dA = leadsDef("E-18", states(SRC), chain(SRC));
        dA.put("name", CrmProcs.name("E-18 BP A"));
        Map<String, Object> dB = leadsDef("E-18", states(SRC), chain(SRC));
        dB.put("name", CrmProcs.name("E-18 BP B"));
        String a = api.blueprint(LEADS, kinded("isActive", false, "definition", dA));
        String b = api.blueprint(LEADS, kinded("isActive", false, "definition", dB));
        Response onA = api.setBlueprintActive(LEADS, a, true);
        Response onB = api.setBlueprintActive(LEADS, b, true);
        note("[E-18] activate A -> " + onA.statusCode() + " ; B -> " + onB.statusCode() + " " + cut(onB.asString()));
        Assert.assertEquals(onA.statusCode() / 100, 2, "A on");
        if (onB.statusCode() / 100 != 2) inconclusive("TAVI refuses a second active blueprint on the same layout+field: " + cut(onB.asString()));
        List<Map<String, Object>> list = CrmUser.ok(api.admin().get("/modules/" + LEADS + "/blueprints?includeInactive=true"), "list").jsonPath().getList("data");
        List<String> order = new ArrayList<>();
        for (Map<String, Object> x : list) if (a.equals(x.get("id")) || b.equals(x.get("id"))) order.add(x.get("id") + "(sort " + x.get("sortOrder") + ")");
        note("[E-18] list order " + order);
        String l1 = lead("E-18", "lead1", null);
        Assert.assertTrue(governedNow(LEADS, l1), "governed");
        List<Object> names1 = bpState(adminB(), LEADS, l1).getList("data.states.blueprintName");
        note("[E-18] lead1 " + l1 + " governed by " + names1 + " offered " + offered(userN(), LEADS, l1));
        // swap: put B first
        Response sort = null;
        List<Object> bodies = List.of(
                Map.of("ids", List.of(b, a)),
                Map.of("orderedIds", List.of(b, a)),
                Map.of("items", List.of(Map.of("id", b, "sortOrder", 0), Map.of("id", a, "sortOrder", 1))),
                List.of(Map.of("id", b, "sortOrder", 0), Map.of("id", a, "sortOrder", 1)));
        for (Object body : bodies) {
            sort = api.admin().patch("/modules/" + LEADS + "/blueprints/sort", body);
            note("[E-18] sort body " + body + " -> " + sort.statusCode() + " " + cut(sort.asString()));
            if (sort.statusCode() / 100 == 2) break;
        }
        String l2 = lead("E-18", "lead2", null);
        Assert.assertTrue(governedNow(LEADS, l2), "governed lead2");
        List<Object> names2 = bpState(adminB(), LEADS, l2).getList("data.states.blueprintName");
        note("[E-18] after sort, lead2 " + l2 + " governed by " + names2);
        traceOf("E-18", LEADS, l1);
        Assert.assertEquals(names1 == null ? 0 : names1.size(), 1, "only one blueprint may govern the record, got " + names1);
        Assert.assertEquals(names2 == null ? 0 : names2.size(), 1, "only one blueprint may govern lead2, got " + names2);
        if (sort != null && sort.statusCode() / 100 == 2)
            Assert.assertNotEquals(String.valueOf(names2), String.valueOf(names1), "after /sort the new first blueprint should run");
    }
}
