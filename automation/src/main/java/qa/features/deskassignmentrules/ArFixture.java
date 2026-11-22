package qa.features.deskassignmentrules;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Run-wide set-up and restore for the assignment-rules tests (shared by every test class of the feature).
 * up(): saves a baseline of everything the tests change (to RUN_DIR/baseline.json, so a crashed run is restored next time),
 * adds A2 to both QA departments, turns the Direct master switch ON, sets clean RR preferences and starts agent presence.
 * down(): deletes what the run created, purges the Recycle Bin, puts the baseline back and verifies it.
 */
public final class ArFixture {
    private static final Path BASELINE = ArApi.RUN_DIR.resolve("baseline.json");
    private static final ObjectMapper JSON = new ObjectMapper();
    private static boolean up;
    private static boolean down;

    private ArFixture() {
    }

    public static synchronized ArApi up() {
        ArApi o = ArApi.owner();
        if (up) return o;
        restoreLeftover(o);
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("switches", o.switches());
        b.put("prefsA", o.prefs(DA));
        b.put("prefsB", o.prefs(DB));
        b.put("teamA", o.teamAssignment(DA).get("enabled"));
        b.put("membersA", o.members(DA));
        b.put("membersB", o.members(DB));
        b.put("skillPrefsA", o.skillPrefs(DA));
        b.put("skillOrderA", o.skills(DA).stream().map(s -> s.get("id")).toList());
        b.put("restored", false);
        write(b);
        ArApi.ledger("BASELINE saved: switches " + b.get("switches") + ", members A " + ((List<?>) b.get("membersA")).size()
                + ", B " + ((List<?>) b.get("membersB")).size());
        o.addMember(DA, A2);
        o.addMember(DB, A2);
        o.setSwitches(Map.of("direct_rules_enabled", true, "round_robin_rules_enabled", true));
        o.setPrefs(DA, null);
        o.setPrefs(DB, null);
        ArApi.ledger("SETUP: A2 added to Dept A + B, Direct switch ON, clean RR prefs on A + B (restore at the end)");
        AgentPresence.start();
        up = true;
        Runtime.getRuntime().addShutdownHook(new Thread(ArFixture::down, "ar-restore"));
        return o;
    }

    /** Restores and cleans (idempotent). Returns what is left over (empty = clean). */
    public static synchronized List<String> down() {
        if (!up || down) return List.of();
        down = true;
        AgentPresence.stop();
        ArApi o = ArApi.owner();
        List<String> left = new java.util.ArrayList<>(ArApi.cleanupCreated());
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                List<String> diff = restore(o, read());
                if (diff.isEmpty()) break;
                if (attempt == 3) left.addAll(diff);
            } catch (RuntimeException e) {
                if (attempt == 3) left.add("restore error: " + e.getMessage());
                ArApi.sleep(10_000);
            }
        }
        try {
            ArApi.ledger("Recycle Bin purge: " + o.purgeRecycleBin() + " QA AR items");
        } catch (RuntimeException e) {
            left.add("recycle bin purge error: " + e.getMessage() + " (next run purges again)");
        }
        ArApi.ledger("RESTORE done, left: " + (left.isEmpty() ? "nothing" : left));
        ArApi.signOutAll();
        return left;
    }

    /** A baseline.json that was never marked restored (crashed run) is put back before anything else. */
    private static void restoreLeftover(ArApi o) {
        if (!Files.exists(BASELINE)) return;
        Map<String, Object> b = read();
        if (Boolean.TRUE.equals(b.get("restored"))) return;
        ArApi.ledger("Found an unrestored baseline from an earlier run: restoring it first");
        restore(o, b);
    }

    @SuppressWarnings("unchecked")
    private static List<String> restore(ArApi o, Map<String, Object> b) {
        List<String> diff = new java.util.ArrayList<>();
        o.setSwitches((Map<String, Object>) b.get("switches"));
        o.putPrefs(DA, (Map<String, Object>) b.get("prefsA"));
        o.putPrefs(DB, (Map<String, Object>) b.get("prefsB"));
        o.setTeamAssignment(DA, Boolean.TRUE.equals(b.get("teamA")));
        o.setMembers(DA, (List<String>) b.get("membersA"));
        o.setMembers(DB, (List<String>) b.get("membersB"));
        o.setSkillPrefs(DA, (Map<String, Object>) b.get("skillPrefsA"));
        List<String> order = (List<String>) b.get("skillOrderA");
        List<Object> now = o.skills(DA).stream().map(s -> s.get("id")).toList();
        if (!now.equals(order) && now.containsAll(order)) o.skillOrder(DA, order);
        // verify
        if (!o.switches().equals(b.get("switches"))) diff.add("switches " + o.switches());
        if (!o.prefs(DA).equals(b.get("prefsA"))) diff.add("prefs A " + o.prefs(DA));
        if (!o.prefs(DB).equals(b.get("prefsB"))) diff.add("prefs B " + o.prefs(DB));
        if (!new java.util.HashSet<>(o.members(DA)).equals(new java.util.HashSet<>((List<String>) b.get("membersA")))) diff.add("members A");
        if (!new java.util.HashSet<>(o.members(DB)).equals(new java.util.HashSet<>((List<String>) b.get("membersB")))) diff.add("members B");
        b.put("restored", diff.isEmpty());
        write(b);
        return diff;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> read() {
        try {
            return JSON.readValue(Files.readString(BASELINE), LinkedHashMap.class);
        } catch (Exception e) {
            throw new IllegalStateException("cannot read " + BASELINE + ": " + e.getMessage());
        }
    }

    private static void write(Map<String, Object> b) {
        try {
            Files.createDirectories(BASELINE.getParent());
            Files.writeString(BASELINE, JSON.writerWithDefaultPrettyPrinter().writeValueAsString(b));
        } catch (Exception e) {
            throw new IllegalStateException("cannot write " + BASELINE + ": " + e.getMessage());
        }
    }
}
