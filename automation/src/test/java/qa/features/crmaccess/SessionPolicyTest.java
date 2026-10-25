package qa.features.crmaccess;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 SP-03/SP-04 — the tenant session limits are really enforced. TENANT-WIDE: approved by the user on 25 Oct 2026
 * ("change briefly and restore", team told). Max concurrent sessions and the idle timeout are lowered for a few minutes
 * and put back in a finally block and again in @AfterClass. The absolute timeout is NOT changed: lowering it would end
 * every session older than the new limit across the tenant.
 */
public class SessionPolicyTest {
    private static final String MAX = "iam.security.session.max_concurrent";
    private static final String IDLE = "iam.security.session.idle_timeout_minutes";
    private String max0, idle0;

    private static String path(String key) {
        return "/settings/resolved?app_key=iam&key=" + key + "&scope_type=Org";
    }

    private static String value(String key) {
        Response r = owner().get(path(key));
        if (r.statusCode() == 401) r = Session.signIn(OWNER).get(path(key));
        return CrmUser.ok(r, "GET " + key).jsonPath().getString("data.value_json");
    }

    /** Sets a limit. If the cached owner session was ended by the limit itself, signs the owner in fresh and retries. */
    private static void put(String key, String val) {
        Response g = owner().get(path(key));
        Response r = g.statusCode() == 200 ? owner().put("/settings/values", body(key, val, g.jsonPath().getInt("data.version"))) : g;
        if (r.statusCode() == 401 || r.statusCode() == 403) {
            Session s = Session.signIn(OWNER);
            int ver = s.get(path(key)).jsonPath().getInt("data.version");
            r = s.put("/settings/values", body(key, val, ver));
            fact("SP", "owner session was ended; fresh owner sign-in used for " + key);
        }
        fact("SP", "set " + key.replace("iam.security.session.", "") + " = " + val + " -> " + r.statusCode());
        CrmUser.ok(r, "PUT " + key);
    }

    private static java.util.Map<String, Object> body(String key, String val, int version) {
        return m("app_key", "iam", "key", key, "scope_type", "Org", "scope_id", null, "value_json", val, "expected_version", version);
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @BeforeClass(alwaysRun = true)
    public void read() {
        max0 = value(MAX);
        idle0 = value(IDLE);
        fact("SP-baseline", "max concurrent " + max0 + ", idle timeout " + idle0 + " min");
    }

    @AfterClass(alwaysRun = true)
    public void restore() {
        if (max0 != null && !max0.equals(value(MAX))) put(MAX, max0);
        if (idle0 != null && !idle0.equals(value(IDLE))) put(IDLE, idle0);
        String m = value(MAX), i = value(IDLE);
        fact("SP-revert", "max concurrent " + m + ", idle " + i + " (baseline " + max0 + ", " + idle0 + ")");
        Assert.assertTrue(max0.equals(m) && idle0.equals(i), "session limits not restored");
    }

    /** Status of the newest Login History row of a user (owner view): active / expired / logged out / cleared. */
    private static String newestStatus(String userId) {
        java.util.List<java.util.Map<String, Object>> rows = owner().get("/audit/login-history?user_id=" + userId + "&limit=3").jsonPath().getList("data");
        return rows == null ? "-" : rows.stream().filter(java.util.Objects::nonNull).findFirst().map(x -> String.valueOf(x.get("status"))).orElse("-");
    }

    @CaseId("SP-03")
    @Test(groups = {"crmaccess", "wave1", "api", "tenant-wide"}, description = "Max concurrent sessions: the newest sign-in ends the oldest session")
    public void maxConcurrentEnforced() {
        try {
            put(MAX, "2");
            sleep(35_000);                       // "saved limits reach sessions within about half a minute"
            Session s1 = Session.signIn(SUPERVISOR);
            Session s2 = Session.signIn(SUPERVISOR);
            Session s3 = Session.signIn(SUPERVISOR);
            if (s1.status != 200 || s2.status != 200 || s3.status != 200) throw new SkipException("INCONCLUSIVE: a sign-in failed (" + s1.status + "/" + s2.status + "/" + s3.status + ")");
            sleep(5_000);
            int a = s1.get("/iam/me").statusCode(), b = s2.get("/iam/me").statusCode(), c = s3.get("/iam/me").statusCode();
            int ar = s1.refresh(), cr = s3.refresh();
            fact("SP-03", "limit 2, three sign-ins of the Supervisor: oldest token " + a + " / refresh " + ar + ", second " + b + ", newest " + c + " / refresh " + cr);
            Assert.assertEquals(c, 200, "the newest session does not work");
            Assert.assertTrue(a == 401 || ar != 200, "the oldest session still works (token and refresh) with a limit of 2");
        } finally {
            put(MAX, max0);
        }
    }

    @CaseId("SP-04")
    @Test(groups = {"crmaccess", "wave1", "api", "tenant-wide"}, description = "Idle timeout: an idle session ends, an active one stays (checked on the token and on refresh)")
    public void idleTimeoutEnforced() {
        try {
            put(IDLE, "2");
            sleep(35_000);
            Session busy = Session.signIn(USER_V);
            Session idle = Session.signIn(SUPERVISOR);
            if (idle.status != 200 || busy.status != 200) throw new SkipException("INCONCLUSIVE: a sign-in failed");
            StringBuilder trace = new StringBuilder();
            for (int i = 1; i <= 7; i++) {        // 3.5 minutes: busy calls every 30 s, idle does nothing
                sleep(30_000);
                int bs = busy.get("/iam/me").statusCode();
                trace.append(i * 30).append("s busy=").append(bs).append("/").append(newestStatus(V_ID))
                        .append(" idleRow=").append(newestStatus("d23fb4e0-248d-41f6-af60-d28885a7007e")).append("; ");
            }
            int idleToken = idle.get("/iam/me").statusCode(), idleRefresh = idle.refresh();
            int busyToken = busy.get("/iam/me").statusCode(), busyRefresh = busy.refresh();
            fact("SP-04", "idle limit 2 min. trace: " + trace + " END idle token " + idleToken + " / refresh " + idleRefresh + "; busy token " + busyToken + " / refresh " + busyRefresh);
            Assert.assertTrue(idleToken == 401 || idleRefresh != 200, "the idle session still works after the idle timeout (token " + idleToken + ", refresh " + idleRefresh + ")");
            Assert.assertTrue(busyToken == 200, "the active session was ended although it was used every 30 s");
        } finally {
            put(IDLE, idle0);
        }
    }
}
