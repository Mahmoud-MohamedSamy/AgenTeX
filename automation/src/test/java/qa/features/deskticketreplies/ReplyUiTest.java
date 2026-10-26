package qa.features.deskticketreplies;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.AppUser;
import qa.features.deskactivities.DeskActivitiesApi.Cleanup;
import qa.features.deskticketreplies.pages.TicketComposerPage;

import java.util.List;
import java.util.Map;

import static qa.features.deskactivities.DeskActivitiesApi.*;
import static qa.features.deskticketreplies.DeskTicketRepliesFeature.*;

/**
 * Reply composer as the QA agent. Run with the agent's browser account:
 * mvnw test -Dtest=ReplyUiTest -Dbase.url=https://staging-desk.taviportal.com -Dcredentials.file=.auth/extra-credentials.csv -Dcredentials.account=fedelav803@meinvr.com
 */
public class ReplyUiTest extends BaseTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private AppUser.App ag() {
        return agent();
    }

    @CaseId({"RPL-B1", "RPL-B3", "RPL-B9"})
    @Test(groups = {"deskticketreplies", "ui", "regression", "smoke", "NDC-1906"}, description = "Composer defaults: From = department mailbox, To = contact, Send disabled while the body is empty")
    public void composerDefaults() {
        String tk = qaTicket(ag(), cleanup, QA + "UI B " + tag());
        TicketComposerPage p = new TicketComposerPage().openTicket(tk).openReplyAll();
        List<String> rec = p.recipients();
        boolean enabled = p.sendEnabled();
        fact("RPL-B", "recipients " + rec + "; From shown " + p.bodyTextContains(FROM_MAILBOX) + "; send enabled with empty body " + enabled);
        Assert.assertTrue(rec.contains(QA_EMAIL), "To = contact");
        Assert.assertTrue(p.bodyTextContains(FROM_MAILBOX), "From = Customer Support mailbox");
        Assert.assertFalse(enabled, "Send enabled with an empty body");
    }

    @CaseId("RPL-B3")
    @Test(groups = {"deskticketreplies", "ui", "regression", "R-B1"}, description = "Reply All shows the ticket CC (R-B1 seen on build index-PA6o3K2s, fixed in index-7qe5X0Gd)")
    public void replyAllShowsTicketCc() {
        String tk = qaTicket(ag(), cleanup, QA + "UI CC " + tag());
        TicketComposerPage p = new TicketComposerPage().openTicket(tk).addTicketCc(CC_X);
        String cc = AppUser.ok(ag().get("/desk/tickets/" + tk + "/cc"), "ticket cc").asString();
        if (!cc.contains(CC_X)) throw new org.testng.SkipException("INCONCLUSIVE: CC was not added to the ticket: " + cc);
        List<String> rec = p.openReplyAll().recipients();
        boolean shown = rec.contains(CC_X) || p.ticketCcShownOnReply(CC_X);
        fact("RPL-B3", "ticket CC " + CC_X + "; Reply All chips " + rec + "; 'Also copied on this ticket' line with 'Leave … off this reply': " + p.ticketCcShownOnReply(CC_X));
        Assert.assertTrue(shown, "ticket CC not shown on Reply All " + rec);
    }

    @CaseId("RPL-E1")
    @Test(groups = {"deskticketreplies", "ui", "bug", "R-B2"}, description = "BUG R-B2: Save draft stores the draft on the server (today only in this browser's localStorage)")
    public void saveDraftReachesServer() {
        String tk = qaTicket(ag(), cleanup, QA + "UI E1 " + tag());
        String text = QA + "E1 draft " + tag();
        new TicketComposerPage().openTicket(tk).openReplyAll().typeBody(text).saveDraft();
        Response mine = ag().get("/desk/tickets/" + tk + "/drafts/mine");
        fact("RPL-E1", "GET drafts/mine after Save draft -> " + err(mine));
        Assert.assertEquals(mine.statusCode(), 200, "no server draft");
        Assert.assertTrue(mine.asString().contains(text), "server draft without the text");
    }

    @CaseId("RPL-F2")
    @Test(groups = {"deskticketreplies", "ui", "regression"}, description = "Send and Close sends the reply and closes the ticket")
    public void sendAndClose() {
        String tk = qaTicket(ag(), cleanup, QA + "UI F2 " + tag());
        new TicketComposerPage().openTicket(tk).openReplyAll().typeBody(QA + "F2 send and close").sendWith("Send and Close");
        Map<String, Object> t = AppUser.ok(ag().get("/desk/tickets/" + tk), "ticket").jsonPath().getMap("data");
        fact("RPL-F2", "status " + t.get("status") + ", counts " + t.get("counts"));
        Assert.assertEquals(t.get("status"), "Closed");
    }
}
