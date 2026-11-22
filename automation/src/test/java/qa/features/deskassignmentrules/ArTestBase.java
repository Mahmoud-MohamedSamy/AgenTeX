package qa.features.deskassignmentrules;

import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;

import java.util.Map;

import static qa.features.deskassignmentrules.ArApi.m;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Parent of the API-driven assignment-rules tests (no browser). Every class shares one run fixture ({@link ArFixture}):
 * baseline saved, A2 in both QA departments, Direct switch ON, clean RR preferences, agents kept online.
 * After each test: what it created is deleted (rules first) and both departments go back to clean RR preferences.
 * At the end of the suite (or JVM exit) the baseline is restored and the Recycle Bin purged.
 */
public abstract class ArTestBase {
    protected ArApi o;

    @BeforeClass(alwaysRun = true)
    public void fixtureUp() {
        o = ArFixture.up();
    }

    @AfterMethod(alwaysRun = true)
    public void cleanAfterTest() {
        try {
            ArApi.cleanupCreated();
            o.setPrefs(DA, null);
            o.setPrefs(DB, null);
            AgentPresence.a1(AgentPresence.Mode.ON);
            AgentPresence.a2(AgentPresence.Mode.ON);
        } catch (RuntimeException e) {
            ArApi.ledger("after-test cleanup error: " + e.getMessage());
        }
    }

    @AfterClass(alwaysRun = true)
    public void cleanAfterClass() {
        ArApi.cleanupCreated();
    }

    @AfterSuite(alwaysRun = true)
    public void fixtureDown() {
        ArFixture.down();
    }

    /** Unique marker "QA AR <case> <uid>" used in subjects and rule criteria. */
    protected static String mk(String c) {
        return PREFIX + c + " " + ArApi.uid();
    }

    /** Short agent name for messages. */
    protected static String n(String user) {
        if (user == null) return "none";
        if (user.equals(A1)) return "A1";
        if (user.equals(A2)) return "A2";
        if (user.equals(A3)) return "A3";
        return user.substring(0, 8);
    }

    protected static void wait(int seconds) {
        ArApi.sleep(seconds * 1000L);
    }

    /** Creates tickets already owned by the agent until its open count in dept is at least min. Returns the count. */
    protected int fill(String dept, String user, int min, String tag) {
        int w = o.workload(user, dept);
        for (int i = w; i < min; i++) o.ticket(PREFIX + tag + " fill " + n(user) + " " + i, dept, m("owner", user));
        if (w < min) wait(3);
        return o.workload(user, dept);
    }

    /** Agent thresholds that leave each agent exactly `free` slots (A1 freeA1, A2 freeA2) in dept. */
    protected java.util.List<Map<String, Object>> thresholds(String dept, int freeA1, int freeA2) {
        return ArApi.l(ArApi.threshold(A1, Math.max(1, o.workload(A1, dept) + freeA1)),
                ArApi.threshold(A2, Math.max(1, o.workload(A2, dept) + freeA2)));
    }

    /** Waits until the ticket has an owner (or the time is up) and returns "A1@12s" style text or null. */
    protected String watch(String ticket, int seconds) {
        long t0 = System.currentTimeMillis();
        String w = o.waitOwner(ticket, seconds);
        return w == null ? null : n(w) + "@" + (System.currentTimeMillis() - t0) / 1000 + "s";
    }

    protected static void inconclusive(String why) {
        throw new SkipException("INCONCLUSIVE: " + why);
    }
}
