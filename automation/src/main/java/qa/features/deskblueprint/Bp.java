package qa.features.deskblueprint;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds blueprint definitions in the shape the Desk designer saves (read from the bundle and the tenant, 1 Nov 2026):
 * {name, description, moduleKey, targetField:"status", departmentId, entryCriteria:{op,field,value}, states[], transitions[]}.
 * Every QA blueprint gets the entry criterion subject contains "QA BP " so it never catches other tickets.
 */
public final class Bp {
    private final Map<String, Object> def = new LinkedHashMap<>();
    private final List<Map<String, Object>> states = new ArrayList<>();
    private final List<Map<String, Object>> transitions = new ArrayList<>();
    private int x;

    private Bp(String name) {
        def.put("name", name);
        def.put("description", "QA automation - safe to delete");
        def.put("moduleKey", "desk_tickets");
        def.put("targetField", "status");
        def.put("departmentId", DeskBlueprintFeature.QA_DEPT);
        def.put("entryCriteria", criteria("contains", "subject", DeskBlueprintFeature.QA));
        def.put("states", states);
        def.put("transitions", transitions);
    }

    public static Bp named(String name) {
        return new Bp(name.startsWith(DeskBlueprintFeature.QA) ? name : DeskBlueprintFeature.QA + name);
    }

    public static Map<String, Object> criteria(String op, String field, Object value) {
        Map<String, Object> c = new LinkedHashMap<>();
        c.put("op", op);
        c.put("field", field);
        c.put("value", value);
        return c;
    }

    public Bp set(String key, Object value) {
        def.put(key, value);
        return this;
    }

    /** Plain state on the business-hours clock. */
    public Bp state(String id) {
        return state(id, Map.of());
    }

    public Bp state(String id, Map<String, Object> extra) {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("id", id);
        s.put("name", id);
        s.put("position", Map.of("x", x, "y", 0));
        x += 300;
        s.put("slaClock", "business");
        s.putAll(extra);
        states.add(s);
        return this;
    }

    public Bp terminal(String id) {
        return state(id, Map.of("isTerminal", true));
    }

    public Bp transition(String id, String from, String to) {
        return transition(id, from, to, Map.of(), Map.of(), List.of());
    }

    public Bp transition(String id, String from, String to, Map<String, Object> before, Map<String, Object> during, List<Map<String, Object>> after) {
        Map<String, Object> t = new LinkedHashMap<>();
        t.put("id", id);
        t.put("name", "QA " + id);
        t.put("fromStateId", from);
        t.put("toStateId", to);
        t.put("before", new HashMap<>(before));
        t.put("during", new HashMap<>(during));
        t.put("after", Map.of("actions", after));
        transitions.add(t);
        return this;
    }

    /** Marks the last added transition as common (offered from any non-final state). */
    public Bp common() {
        transitions.get(transitions.size() - 1).put("isCommon", true);
        return this;
    }

    public Map<String, Object> build() {
        return def;
    }

    // ---- during / after helpers ----

    public static Map<String, Object> checkItem(String id, boolean mandatory) {
        return Map.of("id", id, "label", "QA check " + id, "mandatory", mandatory);
    }

    public static Map<String, Object> deskItem(String kind, boolean mandatory) {
        return Map.of("kind", kind, "mandatory", mandatory);
    }

    public static Map<String, Object> requiredField(String name, String datatype) {
        return Map.of("name", name, "datatype", Map.of("key", datatype), "required", true);
    }

    public static Map<String, Object> setField(String field, Object value) {
        return Map.of("kind", "setField", "field", field, "value", value);
    }
}
