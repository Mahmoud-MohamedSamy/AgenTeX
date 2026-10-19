package qa.features.crmautomationorder;

import qa.features.deskworkflowrules.Rules;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Request bodies for the five CRM automation processes, in the shapes verified on staging-crm (18 Oct 2026, S0 probes).
 * Every process built here is guarded: it only matches records whose name field starts with this session's prefix
 * (CrmOrderFeature.prefix()), so parallel sessions and teammates' records are never touched.
 * Criteria/value helpers are shared with the Desk workflow engine (Rules.kinded keeps "kind" first: the server needs it).
 */
public final class CrmProcs {
    private CrmProcs() {
    }

    // ---------- names, guards, criteria ----------

    /** Name field per module: Leads "first_name" (Full Name), Deals "deal_name", Tasks "subject". */
    public static String nameField(String module) {
        if (CrmOrderFeature.DEALS.equals(module)) return "deal_name";
        if (CrmOrderFeature.TASKS.equals(module)) return "subject";
        return "first_name";
    }

    public static String name(String label) {
        String p = CrmOrderFeature.prefix();
        return label.startsWith(p) ? label : p + label;
    }

    /** name field starts with this session's prefix (optionally a narrower case prefix, e.g. prefix()+"F05"). */
    public static Map<String, Object> guard(String module) {
        return guard(module, CrmOrderFeature.prefix());
    }

    public static Map<String, Object> guard(String module, String startsWith) {
        Map<String, Object> m = new LinkedHashMap<>(Rules.startsWith(nameField(module), startsWith));
        m.put("negate", null);
        return m;
    }

    public static Map<String, Object> eq(String field, String value) {
        return Rules.equalsTo(field, Rules.s(value));
    }

    @SafeVarargs
    public static Map<String, Object> and(Map<String, Object>... ops) {
        return Rules.and(ops);
    }

    private static Map<String, Object> access(String mode) {
        return kinded("mode", mode, "fields", List.of(), "resetFields", List.of());
    }

    // ---------- 1 assignment rules ----------

    /** One entry: condition → round robin over the users (Category); fallback LeaveUnassigned | DefaultUser(userId). */
    public static Map<String, Object> assignmentRule(String module, String label, List<String> channels, Map<String, Object> condition,
                                                     List<String> userIds, String fallbackKind, String fallbackUserId) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("moduleId", module);
        b.put("layoutId", null);
        b.put("name", name(label));
        b.put("description", null);
        b.put("priority", 10);
        b.put("allowedChannels", channels);
        b.put("fallback", kinded("kind", fallbackKind, "userId", fallbackUserId, "poolCriteria", null));
        b.put("entries", new ArrayList<>(List.of(arEntry(condition, userIds))));
        b.put("isActive", false);
        return b;
    }

    public static Map<String, Object> arEntry(Map<String, Object> condition, List<String> userIds) {
        List<Map<String, Object>> members = new ArrayList<>();
        for (int i = 0; i < userIds.size(); i++) members.add(kinded("userId", userIds.get(i), "order", i, "kind", "User"));
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("condition", condition);
        e.put("target", kinded("kind", "Category", "members", members, "poolCriteria", null));
        e.put("availability", kinded("requireOnline", false, "requireOnShift", false));
        e.put("followUpTask", null);
        return e;
    }

    // ---------- 2 review process ----------

    /** fields: apiName → datatypeKey (e.g. email→email, description→multi_line). channels: manual, excel_import, workflow, web_form, api, portal, mobile_ingress. */
    public static Map<String, Object> reviewProcess(String module, String layoutId, String label, Map<String, Object> criteria,
                                                    List<String> channels, Map<String, String> fields, List<String> reviewerIds, List<String> othersIds) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("moduleId", module);
        b.put("layoutId", layoutId);
        b.put("name", name(label));
        b.put("description", null);
        b.put("criteria", criteria);
        b.put("channels", channels);
        b.put("isActive", false);
        List<Map<String, Object>> fl = new ArrayList<>();
        fields.forEach((k, t) -> fl.add(kinded("fieldApiName", k, "datatypeKey", t, "subformFieldPath", null, "label", k)));
        b.put("fields", fl);
        b.put("rules", new ArrayList<>(List.of(
                kinded("name", "Rule 1", "criteria", null, "reviewers", List.of(kinded("kind", "users", "values", reviewerIds)), "strategy", "broadcast", "isFallback", false),
                kinded("name", "Others", "criteria", null, "reviewers", List.of(kinded("kind", "users", "values", othersIds)), "strategy", "broadcast", "isFallback", true))));
        b.put("notifications", kinded("onSubmission", false, "onReviewCompletion", false, "onRejection", false));
        b.put("sla", null);
        b.put("retentionDays", 90);
        b.put("notifyOnAutoDelete", false);
        b.put("adminUserIds", List.of());
        b.put("allowAdminEdit", false);
        b.put("webhookUrl", null);
        return b;
    }

    // ---------- 3 workflow rules ----------

    public static Wf workflow(String module, String label) {
        return new Wf(module, label);
    }

    /** Workflow rule builder (POST /workflow/rules), guarded by the session prefix unless {@link #where} replaces the extra criteria. */
    public static final class Wf {
        private final Map<String, Object> body = new LinkedHashMap<>();
        private final List<Map<String, Object>> actions = new ArrayList<>();
        private final String module;
        private Map<String, Object> extra;
        private Map<String, Object> guardCrit;

        private Wf(String module, String label) {
            this.module = module;
            body.put("moduleId", module);
            body.put("appKey", "crm");
            body.put("layoutId", null);
            body.put("departmentIds", List.of());
            body.put("name", name(label));
            body.put("description", null);
            body.put("mode", "Recurring");
            body.put("isActive", false);
            trigger("RecordCreated", null);
            guardCrit = guard(module);
        }

        public Wf trigger(String kind, String fieldName) {
            Map<String, Object> t = new LinkedHashMap<>();
            t.put("kind", kind);
            t.put("fieldName", fieldName);
            t.put("fieldNames", null);
            t.put("fieldMatch", null);
            t.put("dateFieldName", null);
            t.put("offsetSeconds", null);
            t.put("offsetMode", null);
            body.put("trigger", t);
            return this;
        }

        public Wf onCreate() { return trigger("RecordCreated", null); }
        public Wf onEdit() { return trigger("RecordUpdated", null); }
        public Wf onCreateOrEdit() { return trigger("RecordCreatedOrUpdated", null); }
        public Wf onDelete() { return trigger("RecordDeleted", null); }
        public Wf onFieldChanged(String field) { return trigger("SpecificFieldChanged", field); }

        @SuppressWarnings("unchecked")
        public Wf onDate(String dateField, long offsetSeconds) {
            trigger("DateFieldRelative", null);
            Map<String, Object> t = (Map<String, Object>) body.get("trigger");
            t.put("dateFieldName", dateField);
            t.put("offsetSeconds", offsetSeconds);
            t.put("offsetMode", "wall_clock");
            return this;
        }

        public Wf oneTime() { body.put("mode", "OneTime"); return this; }
        /** Narrow the guard to one case (name starts with prefix()+caseTag). */
        public Wf guardCase(String caseTag) { guardCrit = guard(module, CrmOrderFeature.prefix() + caseTag); return this; }
        public Wf where(Map<String, Object> c) { extra = c; return this; }
        public Wf set(String k, Object v) { body.put(k, v); return this; }

        private Map<String, Object> action(String type) {
            Map<String, Object> a = new LinkedHashMap<>();
            a.put("type", type);
            a.put("order", actions.size());
            a.put("delaySeconds", 0);
            actions.add(a);
            return a;
        }

        public Wf delayed(long seconds) { actions.get(actions.size() - 1).put("delaySeconds", seconds); return this; }
        /**
         * Field update. A rule may hold only ONE FieldUpdate action (400 "A rule can have only one 'FieldUpdate' action",
         * seen 18 Oct 2026), so a second call adds the field to the existing action's fieldUpdates map.
         */
        @SuppressWarnings("unchecked")
        public Wf fieldUpdate(String field, String value) {
            for (Map<String, Object> a : actions)
                if ("FieldUpdate".equals(a.get("type"))) {
                    Map<String, Object> fu = new LinkedHashMap<>((Map<String, Object>) a.get("fieldUpdates"));
                    fu.put(field, Rules.s(value));
                    a.put("fieldUpdates", fu);
                    return this;
                }
            Map<String, Object> fu = new LinkedHashMap<>();
            fu.put(field, Rules.s(value));
            action("FieldUpdate").put("fieldUpdates", fu);
            return this;
        }
        /** kind SpecificUser | UserField | … */
        public Wf owner(String kind, String value) { Map<String, Object> a = action("OwnerAssignment"); a.put("ownerTargetKind", kind); a.put("ownerValue", value); return this; }
        public Wf task(String title) {
            Map<String, Object> a = action("Task");
            a.put("taskTitle", title);
            a.put("taskDueOffsetDays", 1);
            a.put("taskStatus", "Not Started");
            a.put("taskPriority", "normal");
            a.put("taskNotifyAssignee", false);
            return this;
        }
        public Wf createRecord(String targetModule, String layoutId, Map<String, Object> mappings) {
            Map<String, Object> a = action("CreateRecord");
            a.put("targetModuleId", targetModule);
            a.put("targetLayoutId", layoutId);
            a.put("fieldMappings", mappings);
            return this;
        }
        public Wf webhook(String url) {
            Map<String, Object> a = action("Webhook");
            a.put("method", "Post");
            a.put("url", url);
            a.put("bodyTemplate", "{\"id\":\"${id}\"}");
            a.put("headers", Map.of());
            a.put("timeoutSeconds", 10);
            return this;
        }
        public Wf rawAction(Map<String, Object> a) { actions.add(new LinkedHashMap<>(a)); return this; }

        public Map<String, Object> build() {
            Map<String, Object> out = new LinkedHashMap<>(body);
            out.put("criteria", extra == null ? guardCrit : and(guardCrit, extra));
            out.put("actions", actions);
            return out;
        }
    }

    // ---------- 4 approval process ----------

    /** One rule, one level per approver spec. approver: kinded("kind","users","values",[ids]) or null with submitterManager=true. */
    public static Map<String, Object> approvalProcess(String module, String label, boolean onCreate, boolean onEdit, Map<String, Object> criteria,
                                                      List<Map<String, Object>> levels, List<String> adminIds) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("moduleId", module);
        b.put("name", name(label));
        b.put("description", null);
        b.put("executeOnCreate", onCreate);
        b.put("executeOnEdit", onEdit);
        b.put("isActive", false);
        b.put("priority", 10);
        b.put("admins", kinded("adminUserIds", adminIds, "adminRoleIds", List.of(), "allowEdit", false, "editScope", "all_fields",
                "notifyOriginalApproversEmail", false, "notifyOriginalApproversInApp", false));
        Map<String, Object> rule = new LinkedHashMap<>();
        rule.put("criteria", criteria);
        rule.put("levels", levels);
        rule.put("finalActions", new ArrayList<>());
        rule.put("rejectionActions", new ArrayList<>());
        rule.put("rejectedFieldAccess", access("none"));
        rule.put("approvedFieldAccess", access("none"));
        b.put("rules", new ArrayList<>(List.of(rule)));
        return b;
    }

    public static Map<String, Object> levelUsers(String... userIds) {
        return level(kinded("kind", "users", "values", List.of(userIds)), false);
    }

    public static Map<String, Object> levelSubmitterManager() {
        return level(null, true);
    }

    public static Map<String, Object> level(Map<String, Object> approver, boolean submitterManager) {
        Map<String, Object> l = new LinkedHashMap<>();
        l.put("approver", approver);
        l.put("waitingFieldAccess", access("none"));
        l.put("afterStageUpdateFields", null);
        l.put("assignTask", null);
        l.put("assignToSubmitterManager", submitterManager);
        return l;
    }

    /** Final-approval field update action (shape as the Desk FieldUpdate action). */
    public static Map<String, Object> fieldUpdateAction(String field, String value) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", "FieldUpdate");
        a.put("order", 0);
        a.put("delaySeconds", 0);
        a.put("fieldUpdates", Map.of(field, Rules.s(value)));
        return a;
    }

    // ---------- 5 blueprint ----------

    /**
     * Two-or-more-state blueprint. states in order; one transition per consecutive pair named "QA <from> to <to>".
     * Deals Stage needs the pipeline (pipelineId); other picklists pass null.
     */
    public static Map<String, Object> blueprint(String moduleKey, String layoutId, String pipelineId, String targetField, String label,
                                                Map<String, Object> entryCriteria, List<String> states, List<Map<String, Object>> afterActions) {
        List<Map<String, Object>> st = new ArrayList<>();
        for (int i = 0; i < states.size(); i++)
            st.add(kinded("id", states.get(i), "name", states.get(i), "position", kinded("x", 80 + 260 * i, "y", 80), "isTerminal", i == states.size() - 1));
        List<Map<String, Object>> tr = new ArrayList<>();
        for (int i = 0; i + 1 < states.size(); i++) {
            Map<String, Object> t = new LinkedHashMap<>();
            t.put("id", "t_qa_" + i);
            t.put("name", "QA " + states.get(i) + " to " + states.get(i + 1));
            t.put("fromStateId", states.get(i));
            t.put("toStateId", states.get(i + 1));
            t.put("color", "#2563eb");
            t.put("before", Map.of());
            t.put("during", Map.of());
            t.put("after", Map.of("actions", i == 0 && afterActions != null ? afterActions : List.of()));
            tr.add(t);
        }
        Map<String, Object> def = new LinkedHashMap<>();
        def.put("name", name(label));
        def.put("description", "");
        def.put("moduleKey", moduleKey);
        def.put("layoutId", layoutId);
        if (pipelineId != null) def.put("pipelineId", pipelineId);
        def.put("targetField", targetField);
        def.put("continuous", false);
        def.put("entryCriteria", toBlueprintCriteria(entryCriteria));
        def.put("states", st);
        def.put("transitions", tr);
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("isActive", false);
        b.put("definition", def);
        return b;
    }

    /**
     * Blueprints read the designer criteria format ({op:"startsWith", field, value} / {op:"and", children}), not the workflow
     * format ({kind:"StringMatch", …}). The server stores the workflow format without complaint and treats it as match-all
     * (found by session SE, 18 Oct 2026), so workflow-style criteria are converted here. Already-converted maps pass through.
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> toBlueprintCriteria(Map<String, Object> c) {
        if (c == null || c.containsKey("op")) return c;
        Object kind = c.get("kind");
        if ("Logical".equals(kind)) {
            List<Map<String, Object>> ch = new ArrayList<>();
            for (Object o : (List<?>) c.get("operands")) ch.add(toBlueprintCriteria((Map<String, Object>) o));
            return kinded("op", "Or".equals(c.get("operator")) ? "or" : "and", "children", ch);
        }
        if ("StringMatch".equals(kind)) {
            String op = switch (String.valueOf(c.get("operator"))) {
                case "StartsWith" -> "startsWith";
                case "EndsWith" -> "endsWith";
                case "Contains" -> "contains";
                default -> "eq";
            };
            return kinded("op", op, "field", c.get("field"), "value", c.get("stringValue"));
        }
        if ("Comparison".equals(kind) && c.get("value") instanceof Map<?, ?> v)
            return kinded("op", "eq", "field", c.get("field"), "value", v.get("stringValue") != null ? v.get("stringValue") : v.get("value"));
        throw new IllegalArgumentException("No blueprint form for criteria " + c);
    }

    /** Blueprint after-action: set a field. */
    public static Map<String, Object> setField(String field, String value) {
        return kinded("kind", "setField", "field", field, "value", value);
    }
}
