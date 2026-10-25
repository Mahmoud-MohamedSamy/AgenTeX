package qa.features.crmaccess;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmaccess.CrmAccessApi.*;
import static qa.features.crmaccess.CrmAccessFeature.*;

/**
 * Wave 1 US-03/04/05 — invitations to a real inbox chosen by the user (25 Oct 2026): hmohamed@anyware.software. Sends at
 * most three emails (invite, resend, bulk invite); every invitation is cancelled at once and again in @AfterClass.
 * The inbox owner confirms delivery by hand.
 */
public class InviteTest {
    static final String INBOX = "hmohamed@anyware.software";
    private final List<String> open = new ArrayList<>();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        for (String inv : open) fact("cleanup", "cancel invitation " + inv + " -> " + owner().post("/iam/users/invitations/" + inv + "/cancel", Map.of()).statusCode());
        Map<String, Object> u = invitee();
        fact("US-revert", "invitee row now: " + (u == null ? "none" : u.get("status") + "/" + u.get("invitationStatus")));
    }

    /** The Users row of the invitee (invited users are listed with an invitationId), or null. */
    private static Map<String, Object> invitee() {
        List<Map<String, Object>> all = CrmUser.ok(owner().get("/iam/users?app_key=crm&limit=200"), "GET users").jsonPath().getList("data");
        return all.stream().filter(x -> INBOX.equalsIgnoreCase(String.valueOf(x.get("email")))).findFirst().orElse(null);
    }

    private static String invitationId(Response r) {
        for (String k : List.of("data.invitationId", "data.invitation_id", "data.id", "data.invitation.id"))
            if (r.jsonPath().getString(k) != null) return r.jsonPath().getString(k);
        Map<String, Object> u = invitee();
        return u == null ? null : (String) u.get("invitationId");
    }

    @CaseId({"US-03", "US-05"})
    @Test(groups = {"crmaccess", "wave1", "api"}, description = "Invite one user (profile, org unit, lifetime), it is listed as invited, resend works, cancel removes it")
    public void inviteResendCancel() {
        Map<String, Object> before = invitee();
        if (before != null) throw new org.testng.SkipException("INCONCLUSIVE: " + INBOX + " is already listed (" + before.get("status") + ")");
        Response r = owner().post("/iam/users/invite", m("email", INBOX, "profile_id", P_USER, "lifetime_days", 1, "display_name", QA + "Invite", "org_unit_id", OU_SALES));
        CrmUser.ok(r, "invite");
        String inv = invitationId(r);
        if (inv != null) open.add(inv);
        boolean tokenReturned = r.asString().toLowerCase().contains("token");
        Map<String, Object> listed = invitee();
        Response resend = owner().post("/iam/users/invitations/" + inv + "/resend", Map.of());
        Response cancel = owner().post("/iam/users/invitations/" + inv + "/cancel", Map.of());
        if (cancel.statusCode() / 100 == 2) open.remove(inv);
        Map<String, Object> after = invitee();
        fact("US-03/05", "invite -> " + r.statusCode() + " (token in response=" + tokenReturned + "); listed as " + (listed == null ? "none" : listed.get("status") + "/" + listed.get("invitationStatus")
                + ", expires " + listed.get("invitationExpiresAt")) + "; resend -> " + err(resend) + "; cancel -> " + err(cancel) + "; afterwards " + (after == null ? "not listed" : after.get("status") + "/" + after.get("invitationStatus")));
        Assert.assertNotNull(listed, "the invited user is not listed");
        Assert.assertEquals(String.valueOf(listed.get("status")).toLowerCase(), "invited", "the new row is not marked invited");
        Assert.assertTrue(resend.statusCode() / 100 == 2, "resend failed: " + err(resend));
        Assert.assertTrue(cancel.statusCode() / 100 == 2, "cancel failed: " + err(cancel));
        Assert.assertTrue(after == null || !"invited".equalsIgnoreCase(String.valueOf(after.get("status"))), "the cancelled invitation is still pending");
    }

    @CaseId("US-04")
    @Test(groups = {"crmaccess", "wave1", "api"}, dependsOnMethods = "inviteResendCancel", alwaysRun = true,
            description = "Bulk invite: per-row result, the bad row fails, the good row is sent")
    public void bulkInvite() {
        Response r = owner().post("/iam/users/invite/bulk", m("invitations", List.of(
                m("email", INBOX, "profile_id", P_USER, "lifetime_days", 1, "display_name", QA + "Bulk"),
                m("email", "qa-w1-bad-email", "profile_id", P_USER))));
        Map<String, Object> u = invitee();
        String inv = u == null ? null : (String) u.get("invitationId");
        if (inv != null) open.add(inv);
        String body = r.asString();
        fact("US-04", "bulk (1 good, 1 bad) -> " + r.statusCode() + "; response " + body.replaceAll("\\s+", " ").substring(0, Math.min(400, body.length()))
                + "; invitee listed=" + (u != null));
        Assert.assertTrue(r.statusCode() / 100 == 2 || r.statusCode() == 207, "bulk invite failed as a whole: " + err(r));
        Assert.assertNotNull(u, "the good row was not invited");
        Assert.assertTrue(body.contains("qa-w1-bad-email"), "the response does not report the bad row");
    }
}
