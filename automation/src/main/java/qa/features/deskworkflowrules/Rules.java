package qa.features.deskworkflowrules;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds workflow-rule request bodies in the shape the editor sends (POST/PATCH /workflow/rules).
 * Every rule built here carries the QA guard condition (subject starts with "QA WF ") unless {@link #unguarded()} is used,
 * so QA rules never act on other people's tickets.
 */
public final class Rules {
    private final Map<String, Object> body = new LinkedHashMap<>();
    private final List<Map<String, Object>> actions = new ArrayList<>();
    private Map<String, Object> criteria;
    private boolean guard = true;

    private Rules(String name) {
        body.put("moduleId", DeskWorkflowRulesFeature.TICKETS_MODULE_ID);
        body.put("layoutId", "");
        body.put("name", name);
        body.put("description", "");
        body.put("mode", "Recurring");
        body.put("isActive", true);
        trigger("RecordCreated");
    }

    /** New rule named "QA WF <label>". */
    public static Rules named(String label) {
        return new Rules(label.startsWith(DeskWorkflowRulesFeature.QA) ? label : DeskWorkflowRulesFeature.QA + label);
    }

    // ---------- trigger / mode ----------

    public Rules trigger(String kind) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("kind", kind);
        t.put("fieldName", null);
        t.put("dateFieldName", null);
        t.put("offsetSeconds", null);
        t.put("offsetMode", null);
        body.put("trigger", t);
        return this;
    }

    public Rules onCreate() { return trigger("RecordCreated"); }
    public Rules onEdit() { return trigger("RecordUpdated"); }
    public Rules onCreateOrEdit() { return trigger("RecordCreatedOrUpdated"); }
    public Rules onDelete() { return trigger("RecordDeleted"); }

    @SuppressWarnings("unchecked")
    public Rules onFieldChanged(String field) {
        trigger("SpecificFieldChanged");
        ((Map<String, Object>) body.get("trigger")).put("fieldName", field);
        return this;
    }

    /** offsetSeconds &lt; 0 = before the date, &gt; 0 = after; mode wall_clock | business_hours. */
    @SuppressWarnings("unchecked")
    public Rules onDate(String dateField, long offsetSeconds, String mode) {
        trigger("DateFieldRelative");
        Map<String, Object> t = (Map<String, Object>) body.get("trigger");
        t.put("dateFieldName", dateField);
        t.put("offsetSeconds", offsetSeconds);
        t.put("offsetMode", mode);
        return this;
    }

    public Rules oneTime() { body.put("mode", "OneTime"); return this; }
    public Rules inactive() { body.put("isActive", false); return this; }
    public Rules layout(String id) { body.put("layoutId", id); return this; }
    public Rules description(String d) { body.put("description", d); return this; }
    public Rules set(String key, Object value) { body.put(key, value); return this; }

    /** Drop the QA guard (only for rules whose own criteria already exclude other people's tickets). */
    public Rules unguarded() { guard = false; return this; }

    // ---------- criteria ----------

    /** Additional criterion ANDed with the guard. */
    public Rules where(Map<String, Object> c) { criteria = c; return this; }

    /**
     * Key/value pairs in this order. The server reads "kind" as a type tag and answers 500 when it is not the first
     * key (12 Oct 2026); Map.of has a random order per JVM, so every "kind" object is built here.
     */
    public static Map<String, Object> kinded(Object... kv) {
        Map<String, Object> m = new java.util.LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) m.put(String.valueOf(kv[i]), kv[i + 1]);
        return m;
    }

    public static Map<String, Object> s(String v) { return kinded("kind", "string", "stringValue", v); }
    public static Map<String, Object> n(long v) { return kinded("kind", "int", "intValue", v); }
    public static Map<String, Object> b(boolean v) { return kinded("kind", "bool", "boolValue", v); }
    public static Map<String, Object> ts(String iso) { return kinded("kind", "timestamp", "timestampValue", iso); }

    public static Map<String, Object> startsWith(String field, String v) {
        return stringMatch(field, "StartsWith", v);
    }

    public static Map<String, Object> contains(String field, String v) {
        return stringMatch(field, "Contains", v);
    }

    public static Map<String, Object> stringMatch(String field, String op, String v) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("kind", "StringMatch");
        m.put("field", field);
        m.put("operator", op);
        m.put("stringValue", v);
        m.put("caseInsensitive", false);
        return m;
    }

    public static Map<String, Object> oneOf(String field, String... values) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("kind", "Membership");
        m.put("field", field);
        m.put("negate", false);
        m.put("values", Arrays.stream(values).map(Rules::s).toList());
        return m;
    }

    public static Map<String, Object> equalsTo(String field, Map<String, Object> value) {
        return kinded("kind", "Comparison", "field", field, "operator", "Equal", "value", value);
    }

    public static Map<String, Object> changed(String field) {
        return kinded("kind", "Changed", "field", field);
    }

    @SafeVarargs
    public static Map<String, Object> and(Map<String, Object>... ops) {
        return kinded("kind", "Logical", "operator", "And", "operands", List.of(ops));
    }

    @SafeVarargs
    public static Map<String, Object> or(Map<String, Object>... ops) {
        return kinded("kind", "Logical", "operator", "Or", "operands", List.of(ops));
    }

    // ---------- actions ----------

    private Map<String, Object> action(String type) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", type);
        a.put("order", actions.size());
        a.put("delaySeconds", 0);
        actions.add(a);
        return a;
    }

    /** Delay (seconds) of the last action added - makes it a scheduled action. */
    public Rules delayed(long seconds) {
        actions.get(actions.size() - 1).put("delaySeconds", seconds);
        return this;
    }

    public Rules addTags(String mode, String... tagIds) {
        Map<String, Object> a = action("AddTags");
        a.remove("delaySeconds");
        a.put("tagIds", List.of(tagIds));
        a.put("mode", mode);
        return this;
    }

    public Rules removeTags(String... tagIds) {
        Map<String, Object> a = action("RemoveTags");
        a.remove("delaySeconds");
        a.put("tagIds", List.of(tagIds));
        return this;
    }

    /** fieldUpdates: {field: workflow value e.g. Rules.s("x")}. */
    public Rules fieldUpdate(Map<String, Object> updates) {
        action("FieldUpdate").put("fieldUpdates", updates);
        return this;
    }

    public Rules fieldUpdate(String field, String value) {
        return fieldUpdate(Map.of(field, s(value)));
    }

    /** kind SpecificUser | RoleRoundRobin | UserField. */
    public Rules owner(String kind, String value) {
        Map<String, Object> a = action("OwnerAssignment");
        a.put("ownerTargetKind", kind);
        a.put("ownerValue", value);
        return this;
    }

    public Rules webhook(String method, String url, String bodyTemplate, Map<String, String> headers, Integer timeoutSeconds) {
        Map<String, Object> a = action("Webhook");
        a.put("method", method);
        a.put("url", url);
        a.put("bodyTemplate", bodyTemplate);
        a.put("headers", headers == null ? Map.of() : headers);
        a.put("timeoutSeconds", timeoutSeconds);
        return this;
    }

    public Rules task(String title, Integer dueOffsetDays, String status, String priority) {
        Map<String, Object> a = action("Task");
        a.put("taskTitle", title);
        a.put("taskDueOffsetDays", dueOffsetDays);
        a.put("taskStatus", status);
        a.put("taskPriority", priority);
        a.put("taskNotifyAssignee", false);
        return this;
    }

    /** recipients: [{kind: user|role|userfield, value: id}] */
    public Rules email(List<Map<String, Object>> recipients, String templateId, String subject, String bodyHtml) {
        Map<String, Object> a = action("Email");
        a.put("emailRecipients", recipients);
        a.put("emailTemplateId", templateId);
        a.put("emailSubject", subject);
        a.put("emailBody", bodyHtml);
        return this;
    }

    public Rules createRecord(String moduleId, String layoutId, Map<String, Object> mappings) {
        Map<String, Object> a = action("CreateRecord");
        a.put("targetModuleId", moduleId);
        a.put("targetLayoutId", layoutId);
        a.put("fieldMappings", mappings);
        return this;
    }

    public Rules sendHappinessEmail() {
        action("SendHappinessEmail");
        return this;
    }

    /** A library (saved) action slot. */
    public Rules saved(String type, String standaloneActionId) {
        action(type).put("standaloneActionId", standaloneActionId);
        return this;
    }

    /** Raw action map (for negative API tests). */
    public Rules rawAction(Map<String, Object> a) {
        actions.add(new LinkedHashMap<>(a));
        return this;
    }

    // ---------- build ----------

    public Map<String, Object> build() {
        Map<String, Object> out = new LinkedHashMap<>(body);
        Map<String, Object> g = startsWith("subject", DeskWorkflowRulesFeature.QA);
        out.put("criteria", guard ? (criteria == null ? g : and(g, criteria)) : criteria);
        out.put("actions", actions);
        return out;
    }

    public String name() {
        return String.valueOf(body.get("name"));
    }
}
