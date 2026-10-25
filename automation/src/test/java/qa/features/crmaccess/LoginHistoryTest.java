package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 group D — login history and sessions (NDC-2418, NDC-613). D-1 is read-only. D-2 denies test user 2 the three
 * "view login history" permissions with user overrides and removes them in @AfterClass. D-4 signs test user 1 in once
 * more and revokes only that new session.
 */
public class LoginHistoryTest {
    private final List<String> overridesSet = new ArrayList<>();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        overridesSet.forEach(k -> clearOverride(V_ID, k));
        String left = overrides(V_ID);
        boolean clean = overridesSet.stream().noneMatch(left::contains);
        fact("D-revert", "overrides on test user 2 removed=" + clean);
        Assert.assertTrue(clean, "overrides left on test user 2: " + left);
    }

    @CaseId("D-1")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-2418"}, description = "No session is listed as Active after its expiry time (read-only)")
    public void expiredSessionsNotActive() {
        List<Map<String, Object>> active = activeSessions(10);
        OffsetDateTime now = OffsetDateTime.now();
        long expired = active.stream().filter(s -> s.get("expires_at") != null && OffsetDateTime.parse(String.valueOf(s.get("expires_at"))).isBefore(now)).count();
        String oldest = active.stream().map(s -> String.valueOf(s.get("login_at"))).min(String::compareTo).orElse("-");
        fact("D-1", active.size() + " sessions listed Active (up to 1,000 read); past their expiry: " + expired + "; oldest login " + oldest);
        if (active.isEmpty()) throw new SkipException("INCONCLUSIVE: no active session listed at all (the owner's own session should be)");
        Assert.assertEquals(expired, 0, "sessions shown as Active after they expired");
    }

    @CaseId("D-2")
    @Test(groups = {"crmaccess", "wave1", "api", "NDC-613"}, description = "A user denied every 'view login history' permission can neither open nor export it")
    public void deniedUserCannotExport() {
        Session before = Session.signIn(USER_V);
        if (before.status != 200) throw new SkipException("INCONCLUSIVE: test user 2 cannot sign in (" + before.status + ")");
        int listBefore = before.get("/audit/login-history?limit=5").statusCode();
        int exportBefore = before.get("/audit/login-history/export").statusCode();
        fact("D-2", "control, before any override: list " + listBefore + ", export " + exportBefore);
        if (listBefore != 200) throw new SkipException("INCONCLUSIVE: test user 2 cannot read login history even before the denial (" + listBefore + ")");

        for (String k : List.of(LH_VIEW_SELF, LH_VIEW_TEAM, LH_VIEW_ALL)) {
            Response r = setOverride(V_ID, k, "deny");
            if (r.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: deny override " + k + " refused: " + err(r));
            overridesSet.add(k);
        }
        Session after = Session.signIn(USER_V);
        int list = after.get("/audit/login-history?limit=5").statusCode();
        Response export = after.get("/audit/login-history/export");
        fact("D-2", "after denying view self/team/all (fresh sign-in): list " + list + ", export " + export.statusCode()
                + " (" + export.asString().length() + " bytes). The Setup link is checked on screen (the hub API lists every link with its required permission).");
        Assert.assertTrue(list == 403 || list == 404, "the denied user can still read login history (" + list + ")");
        Assert.assertTrue(export.statusCode() == 403 || export.statusCode() == 404, "the denied user can still export login history (" + export.statusCode() + ")");
    }

    @CaseId("D-4")
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Revoking a session from Login History stops that token")
    public void revokedSessionStopsWorking() {
        String since = OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();   // login_at is UTC
        Session s = Session.signIn(USER_N);
        if (s.status != 200) throw new SkipException("INCONCLUSIVE: test user 1 cannot sign in (" + s.status + ")");
        int beforeRevoke = s.get("/iam/me").statusCode();
        List<Map<String, Object>> mine = CrmUser.ok(owner().get("/audit/login-history?user_id=" + N_ID + "&status=active&limit=20"), "GET N sessions")
                .jsonPath().getList("data");
        if (mine == null) mine = List.of();
        Map<String, Object> newest = mine.stream().filter(java.util.Objects::nonNull).filter(x -> String.valueOf(x.get("login_at")).compareTo(since.substring(0, 19)) >= 0)
                .max((a, b) -> String.valueOf(a.get("login_at")).compareTo(String.valueOf(b.get("login_at")))).orElse(null);
        if (beforeRevoke != 200 || newest == null)
            throw new SkipException("INCONCLUSIVE: control failed (token " + beforeRevoke + ", new session row found=" + (newest != null) + ")");
        Response clear = owner().post("/audit/login-history/" + newest.get("login_session_id") + "/clear", null);
        int afterRevoke = s.get("/iam/me").statusCode();
        fact("D-4", "new session of test user 1: token before revoke " + beforeRevoke + "; clear -> " + clear.statusCode() + "; token after revoke " + afterRevoke);
        CrmUser.ok(clear, "clear session");
        Assert.assertEquals(afterRevoke, 401, "the revoked session's token still works");
    }
}
