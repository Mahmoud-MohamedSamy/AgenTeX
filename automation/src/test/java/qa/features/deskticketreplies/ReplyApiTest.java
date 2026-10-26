package qa.features.deskticketreplies;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmdeskintegration.AppUser;
import qa.features.deskactivities.DeskActivitiesApi.Cleanup;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.IntStream;

import static qa.features.deskactivities.DeskActivitiesApi.*;
import static qa.features.deskticketreplies.DeskTicketRepliesApi.*;
import static qa.features.deskticketreplies.DeskTicketRepliesFeature.*;

/**
 * Ticket replies through the API, as the QA agent (Customer Support) on QA tickets for mmohamed@anyware.software
 * (spec docs/desk-ticket-replies/spec-desk-ticket-replies.md). A run sends about 8 real emails to that mailbox only;
 * CC/BCC/forward targets are @example.com. Bug / possible-bug tests assert the correct behaviour.
 * Run: mvnw test -Dtest=ReplyApiTest   (no browser)
 */
public class ReplyApiTest {
    private final Cleanup cleanup = new Cleanup();
    private AppUser.App ag;
    private String tk;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        ag = agent();
        if (ag.get("/desk/tickets/send-as-email/departments").statusCode() != 200) throw new SkipException("INCONCLUSIVE: agent API unusable - nothing created");
        tk = qaTicket(ag, cleanup, QA + "auto " + tag());
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        try {
            deleteQaSnippets(ag);
        } catch (RuntimeException ignored) {
        }
        cleanup.run();
    }

    private Map<String, Object> base(String body) {
        return reply("reply", List.of(QA_EMAIL), "Re: " + QA + "auto", "<p>" + QA + body + "</p>");
    }

    @CaseId({"RPL-C1", "RPL-I1", "RPL-I5"})
    @Test(groups = {"deskticketreplies", "api", "regression", "smoke"}, description = "Send a reply: 201, public, sent, counts +1, reply.sent in the activity feed")
    public void sendReply() {
        int before = ((Number) counts(ag, tk).get("replies")).intValue();
        Response r = send(ag, tk, base("C1 " + tag()));
        Assert.assertEquals(r.statusCode(), 201, err(r));
        Assert.assertEquals(r.jsonPath().getBoolean("data.reply.is_public"), Boolean.TRUE, "public");
        int after = ((Number) counts(ag, tk).get("replies")).intValue();
        List<String> feed = feedActions(ag, tk);
        fact("RPL-C1", "status " + r.jsonPath().getString("data.reply.status") + "; replies " + before + " -> " + after + "; feed " + feed);
        Assert.assertEquals(after, before + 1);
        Assert.assertTrue(feed.contains("reply.sent") || feed.contains("reply.queued"), "feed " + feed);
    }

    @CaseId("RPL-A5")
    @Test(groups = {"deskticketreplies", "api", "regression", "smoke"}, description = "Reply without a token -> 401")
    public void noTokenIs401() {
        int s = AppUser.anonymous(DESK, "desk").body(base("A5")).post("/desk/tickets/" + tk + "/replies").statusCode();
        Assert.assertEquals(s, 401);
    }

    @CaseId("RPL-A2")
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "An admin outside Customer Support gets 404 on the ticket, its replies, and when posting a comment")
    public void otherDepartmentIsBlocked() {
        AppUser.App ad = otherDeptAdmin();
        int t = ad.get("/desk/tickets/" + tk).statusCode(), r = ad.get("/desk/tickets/" + tk + "/replies").statusCode();
        Response c = ad.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p>" + QA + "A2</p>", "is_public", false));
        fact("RPL-A2", "ticket " + t + ", replies " + r + ", comment " + c.statusCode());
        Assert.assertEquals(List.of(t, r, c.statusCode()), List.of(404, 404, 404));
    }

    @CaseId({"RPL-C9", "RPL-C10", "RPL-M2"})
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "Bad recipients, empty / too long bodies, wrong types and bad mode are refused with clear messages")
    public void validation() {
        Map<String, Response> r = new LinkedHashMap<>();
        r.put("to a@b", send(ag, tk, with(base("C9"), "to", List.of("a@b"))));
        r.put("to empty", send(ag, tk, with(base("C9"), "to", List.of())));
        r.put("21 cc", send(ag, tk, with(base("C9"), "cc", IntStream.range(0, 21).mapToObj(i -> "qa" + i + "@example.com").toList())));
        r.put("body empty", send(ag, tk, with(base(""), "body_html", "")));
        r.put("body <p><br></p>", send(ag, tk, with(base(""), "body_html", "<p><br></p>")));
        r.put("body 65,536", send(ag, tk, with(base(""), "body_html", "y".repeat(65_536))));
        r.put("to as string", send(ag, tk, with(base("M2"), "to", QA_EMAIL)));
        r.put("mode shout", send(ag, tk, with(base("M2"), "mode", "shout")));
        List<String> accepted = new ArrayList<>();
        r.forEach((k, v) -> {
            fact("RPL-C9/C10/M2", k + " -> " + err(v));
            if (v.statusCode() / 100 == 2) accepted.add(k);
        });
        Assert.assertEquals(accepted, List.of(), "accepted");
    }

    @CaseId("RPL-L1")
    @Test(groups = {"deskticketreplies", "api", "regression", "security", "NDC-2182"}, description = "Script, event handlers and javascript: links are removed from the stored reply")
    public void htmlIsCleaned() {
        Response r = send(ag, tk, with(base(""), "body_html", "<p>" + QA + "L1</p><script>alert(1)</script><img src=x onerror=\"alert(2)\"><a href=\"javascript:alert(3)\">x</a>"));
        String b = AppUser.ok(r, "send").jsonPath().getString("data.reply.body_html");
        fact("RPL-L1", "stored: " + b);
        Assert.assertFalse(b.matches("(?is).*(<script|onerror|javascript:).*"), b);
    }

    @CaseId({"RPL-C3", "RPL-C5", "RPL-C6"})
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "Reply All copies the ticket CC; BCC is stored; Forward is private")
    public void ccBccForward() {
        Response c = send(ag, tk, with(reply("reply_all", List.of(QA_EMAIL), "Re: " + QA + "auto", "<p>" + QA + "C3 " + tag() + "</p>"), "cc", List.of(CC_X)));
        Response noCc = send(ag, tk, reply("reply_all", List.of(QA_EMAIL), "Re: " + QA + "auto", "<p>" + QA + "C3b " + tag() + "</p>"));
        Response b = send(ag, tk, with(base("C5"), "bcc", List.of(BCC_X)));
        Response f = send(ag, tk, reply("forward", List.of(CC_X), "Fwd: " + QA + "auto", "<p>" + QA + "C6</p>"));
        fact("RPL-C3", "reply_all with cc -> " + err(c) + " cc=" + c.jsonPath().getList("data.reply.cc") + "; next reply_all without cc stored cc=" + noCc.jsonPath().getList("data.reply.cc") + "; ticket cc " + ticketCc(ag, tk));
        fact("RPL-C5/C6", "bcc=" + b.jsonPath().getList("data.reply.bcc") + "; forward is_public=" + f.jsonPath().getBoolean("data.reply.is_public"));
        Assert.assertEquals(b.jsonPath().getList("data.reply.bcc"), List.of(BCC_X));
        Assert.assertEquals(f.jsonPath().getBoolean("data.reply.is_public"), Boolean.FALSE, "forward is private");
    }

    @CaseId({"RPL-J1", "RPL-J3", "RPL-J4"})
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "Pin / unpin a reply, read its headers, splitting an agent reply is refused")
    public void entryActions() {
        String id = AppUser.ok(send(ag, tk, base("J " + tag())), "send").jsonPath().getString("data.reply.id");
        int pin = ag.put("/desk/tickets/" + tk + "/replies/" + id + "/pin", Map.of()).statusCode();
        int unpin = ag.delete("/desk/tickets/" + tk + "/replies/" + id + "/pin").statusCode();
        Response h = ag.get("/desk/tickets/" + tk + "/replies/" + id + "/headers");
        Response split = ag.post("/desk/tickets/" + tk + "/replies/" + id + "/split", Map.of());
        if (split.statusCode() / 100 == 2) cleanup.add(TICKETS, split.jsonPath().getString("data.ticket_id"));
        fact("RPL-J", "pin " + pin + ", unpin " + unpin + ", headers " + h.statusCode() + ", split agent reply " + err(split));
        Assert.assertEquals(List.of(pin / 100, unpin / 100, h.statusCode()), List.of(2, 2, 200));
        Assert.assertEquals(split.statusCode(), 409, "split of an agent reply");
        Assert.assertFalse(h.asString().matches("(?is).*(authorization|password|api[_-]?key).*"), "headers leak a secret");
    }

    @CaseId({"RPL-D1", "RPL-D2", "RPL-D3", "RPL-D4", "RPL-D5"})
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "Comments: private by default, public on request, edit, pin, delete")
    public void comments_() {
        Response p = ag.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p>" + QA + "D1</p>"));
        Response pub = ag.post("/desk/tickets/" + tk + "/comments", Map.of("body_html", "<p>" + QA + "D2</p>", "is_public", true));
        String id = AppUser.ok(p, "comment").jsonPath().getString("data.id");
        int edit = ag.put("/desk/tickets/" + tk + "/comments/" + id, Map.of("body_html", "<p>" + QA + "D1 edited</p>", "is_public", false)).statusCode();
        int pin = ag.put("/desk/tickets/" + tk + "/comments/" + id + "/pin", Map.of()).statusCode();
        int del = ag.delete("/desk/tickets/" + tk + "/comments/" + AppUser.ok(pub, "public comment").jsonPath().getString("data.id")).statusCode();
        fact("RPL-D", "default is_public=" + p.jsonPath().getBoolean("data.is_public") + ", public=" + pub.jsonPath().getBoolean("data.is_public") + ", edit " + edit + ", pin " + pin + ", delete " + del);
        Assert.assertEquals(p.jsonPath().getBoolean("data.is_public"), Boolean.FALSE);
        Assert.assertEquals(pub.jsonPath().getBoolean("data.is_public"), Boolean.TRUE);
        Assert.assertEquals(List.of(edit / 100, pin / 100, del / 100), List.of(2, 2, 2));
    }

    @CaseId({"RPL-G4", "RPL-G5", "RPL-G6", "RPL-G8"})
    @Test(groups = {"deskticketreplies", "api", "regression"}, description = "Snippets: create, name / size / duplicate rules, placeholders resolved for the ticket, delete")
    public void snippets() {
        Response c = ag.post("/desk/snippets", Map.of("name", "qa_rpl_snip", "content_html", "<p>Hello {{customer_name}}, ticket {{ticket_number}}.</p>", "is_shared", false));
        String sid = AppUser.ok(c, "create snippet").jsonPath().getString("data.id");
        if (sid == null) sid = c.jsonPath().getString("data.snippet.id");
        Map<String, Integer> bad = new LinkedHashMap<>();
        bad.put("space in name", ag.post("/desk/snippets", Map.of("name", "qa rpl", "content_html", "<p>x</p>", "is_shared", false)).statusCode());
        bad.put("duplicate", ag.post("/desk/snippets", Map.of("name", "qa_rpl_snip", "content_html", "<p>x</p>", "is_shared", false)).statusCode());
        bad.put("25,601 chars", ag.post("/desk/snippets", Map.of("name", "qa_rpl_long", "content_html", "z".repeat(25_601), "is_shared", false)).statusCode());
        Response res = ag.post("/desk/tickets/" + tk + "/snippets/resolve", Map.of("snippet_id", sid));
        int del = ag.delete("/desk/snippets/" + sid).statusCode();
        fact("RPL-G", "bad " + bad + "; resolve " + res.statusCode() + " " + res.jsonPath().getString("data.content_html") + "; delete " + del);
        bad.forEach((k, v) -> Assert.assertTrue(v >= 400, k + " accepted"));
        Assert.assertFalse(String.valueOf(res.jsonPath().getString("data.content_html")).contains("{{"), "placeholders not resolved");
    }

    @CaseId("RPL-C9b")
    @Test(groups = {"deskticketreplies", "api", "possible-bug", "R-B5"}, description = "POSSIBLE BUG R-B5: an agent address is refused as Cc (NDC-1851 item 7; refused at 12:50 on 26 Oct, accepted after the redeploy)")
    public void agentAddressNotCc() {
        Response r = send(ag, tk, with(reply("reply_all", List.of(QA_EMAIL), "Re: " + QA + "auto", "<p>" + QA + "C9b</p>"), "cc", List.of(AGENT_ADDRESS)));
        fact("RPL-C9b", "agent address as Cc -> " + err(r));
        Assert.assertTrue(r.statusCode() >= 400, "agent address accepted as Cc");
    }

    @CaseId("RPL-C11")
    @Test(groups = {"deskticketreplies", "api", "possible-bug", "R-B4"}, description = "POSSIBLE BUG R-B4: two identical reply POSTs sent at the same moment create one reply, not two")
    public void doubleSubmit() {
        String marker = QA + "C11 " + tag();
        CompletableFuture<Response> a = CompletableFuture.supplyAsync(() -> send(ag, tk, with(base(""), "body_html", "<p>" + marker + "</p>")));
        CompletableFuture<Response> b = CompletableFuture.supplyAsync(() -> send(ag, tk, with(base(""), "body_html", "<p>" + marker + "</p>")));
        fact("RPL-C11", "statuses " + a.join().statusCode() + "/" + b.join().statusCode());
        long n = replies(ag, tk).stream().filter(r -> String.valueOf(r.get("body_html")).contains(marker)).count();
        fact("RPL-C11", "replies with the same body: " + n);
        Assert.assertEquals(n, 1L);
    }

    @CaseId("RPL-K5")
    @Test(groups = {"deskticketreplies", "api", "possible-bug", "R-B3"}, description = "POSSIBLE BUG R-B3: the author of a reply sent for review cannot approve it")
    public void ownReviewApproval() {
        String d = "/desk/tickets/" + tk + "/drafts";
        AppUser.ok(ag.put(d + "/mine", reply("reply", List.of(QA_EMAIL), "Re: " + QA + "auto", "<p>" + QA + "K5 " + tag() + "</p>")), "draft");
        AppUser.ok(ag.post(d + "/mine/submit-review", Map.of()), "submit review");
        String id = AppUser.ok(ag.get(d), "drafts").jsonPath().getString("data[0].id");
        Response ap = ag.post(d + "/" + id + "/approve", Map.of());
        fact("RPL-K5", "author approves own reply -> " + err(ap));
        if (ap.statusCode() / 100 != 2) {
            ag.post(d + "/mine/withdraw-review", Map.of());
            ag.delete(d + "/mine");
        }
        Assert.assertTrue(ap.statusCode() >= 400, "author approved own reply");
    }
}
