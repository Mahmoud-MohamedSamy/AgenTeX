package qa.features.crmchannels;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;
import java.util.Map;

import static qa.features.crmchannels.CrmChannelsApi.*;
import static qa.features.crmchannels.CrmChannelsFeature.*;

/**
 * Wave 4 API checks: drafts and scheduled email (NDC-2496), email templates (C14, W4-B6), web-form hosted link
 * (NDC-1488), customer portal link (W4-B2), notifications service (W4-B3), SMS templates (NDC-1482) and telephony
 * status. Nothing is sent: drafts are deleted before their send time, the SMS template stays a draft and is archived.
 */
public class ChannelsApiTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @CaseId("M02")
    @Test(groups = {"crmchannels", "wave4", "api", "regression", "NDC-2496"}, description = "Draft on a lead: save, edit, read back, delete; a scheduled draft keeps its send time")
    public void draftsAndScheduled() {
        String lead = createLead(cleanup, QA + "Draft " + tag(), MAIL_TO);
        Map<String, Object> body = m("to", List.of(MAIL_TO), "subject", QA + "draft", "body", "QA W4 draft", "body_html", "<p>QA W4 draft</p>",
                "record_type", "leads", "record_id", lead, "attachments", List.of());
        String draft = CrmUser.ok(owner().post("/mail/drafts", body), "save draft").jsonPath().getString("data.id");
        cleanup.then(() -> owner().delete("/mail/drafts/" + draft));
        body.put("subject", QA + "draft edited");
        int edit = owner().put("/mail/drafts/" + draft, body).statusCode();
        String subject = CrmUser.ok(owner().get("/mail/drafts/" + draft), "read draft").jsonPath().getString("data.subject");
        String sendAt = java.time.Instant.now().plusSeconds(3 * 86_400).truncatedTo(java.time.temporal.ChronoUnit.SECONDS).toString();
        Map<String, Object> sched = new java.util.LinkedHashMap<>(body);
        sched.put("subject", QA + "scheduled");
        sched.put("send_at", sendAt);
        String scheduled = CrmUser.ok(owner().post("/mail/drafts", sched), "schedule").jsonPath().getString("data.id");
        String sendAtStored = CrmUser.ok(owner().get("/mail/drafts/" + scheduled), "read scheduled").jsonPath().getString("data.send_at");
        int del1 = owner().delete("/mail/drafts/" + scheduled).statusCode();
        int del2 = owner().delete("/mail/drafts/" + draft).statusCode();
        int after = owner().get("/mail/drafts/" + draft).statusCode();
        fact("M02", "edit " + edit + ", subject now '" + subject + "', scheduled send_at " + sendAtStored + ", delete " + del1 + "/" + del2 + ", read after delete " + after);
        Assert.assertEquals(subject, QA + "draft edited", "the draft edit was not stored");
        Assert.assertNotNull(sendAtStored, "the scheduled draft has no send time");
        Assert.assertEquals(after, 404, "a deleted draft can still be read");
    }

    @CaseId("C14")
    @Test(groups = {"crmchannels", "wave4", "api", "regression"}, description = "Email template: create, favourite, edit, delete")
    public void templateLifecycle() {
        Response c = CrmUser.ok(owner().post("/mail/templates", m("name", QA + "Template " + tag(), "description", null, "subject", QA + "hello {{recipient_name}}",
                "body_html", "Dear {{recipient_name}}, from {{sender_name}}.", "access_level", "personal", "department_id", null)), "create template");
        String id = c.jsonPath().getString("data.id");
        cleanup.then(() -> owner().delete("/mail/templates/" + id));
        int fav = owner().put("/mail/templates/" + id + "/favorite", m("is_favorite", true)).statusCode();
        int edit = owner().put("/mail/templates/" + id, m("name", QA + "Template edited", "description", null, "subject", QA + "hi {{recipient_name}}",
                "body_html", "Hi {{recipient_name}}.", "access_level", "personal", "department_id", null)).statusCode();
        boolean listed = CrmUser.ok(owner().get("/mail/templates"), "templates").asString().contains(QA + "Template edited");
        int del = owner().delete("/mail/templates/" + id).statusCode();
        fact("C14", "create 201, favourite " + fav + ", edit " + edit + ", listed after edit " + listed + ", delete " + del);
        Assert.assertEquals(edit / 100, 2, "template edit");
        Assert.assertTrue(listed, "the edited template is not listed");
        Assert.assertEquals(del / 100, 2, "template delete");
    }

    @CaseId("C14")
    @Test(groups = {"crmchannels", "wave4", "api", "W4-B6", "NDC-2631"}, description = "A template with a placeholder the template can't fill ({{company_name}}) is refused or warned about, not saved silently")
    public void unknownPlaceholderNotSilent() {
        Response c = owner().post("/mail/templates", m("name", QA + "Placeholder " + tag(), "description", null, "subject", QA + "placeholder",
                "body_html", "From {{sender_name}} at {{company_name}}.", "access_level", "personal", "department_id", null));
        if (c.statusCode() / 100 == 2) {
            String id = c.jsonPath().getString("data.id");
            cleanup.then(() -> owner().delete("/mail/templates/" + id));
        }
        boolean warned = c.statusCode() / 100 == 4 || c.asString().matches("(?is).*(warning|unknown placeholder|not supported).*");
        fact("W4-B6", "template with {{company_name}} -> " + err(c));
        Assert.assertTrue(warned, "{{company_name}} was saved without any warning; it renders blank in compose");
    }

    @CaseId("M06")
    @Test(groups = {"crmchannels", "wave4", "api", "NDC-1488"}, description = "A web form's hosted link opens (not 404); the iframe address is the control")
    public void webFormHostedLink() {
        Response c = CrmUser.ok(owner().post("/web-forms", webForm(QA + "Form " + tag(), true)), "create web form");
        String id = c.jsonPath().getString("data.id"), key = c.jsonPath().getString("data.embed_key");
        cleanup.then(() -> fact("cleanup", "delete web form -> " + owner().delete("/web-forms/" + id).statusCode()));
        int iframe = publicStatus(BASE + "/embed/feedback/index.html?key=" + key + "&mode=frame");
        int hosted = publicStatus(BASE + "/embed/feedback/f/" + key);
        fact("M06", "form created; iframe address " + iframe + ", hosted link " + hosted);
        if (iframe != 200) throw new SkipException("INCONCLUSIVE: even the iframe address answered " + iframe);
        Assert.assertEquals(hosted, 200, "the hosted link (also used by the QR code and Test your form) is " + hosted);
    }

    @CaseId("M07")
    @Test(groups = {"crmchannels", "wave4", "api", "W4-B2", "NDC-2634"}, description = "A portal that is switched on opens its link (not 404)")
    public void portalLinkOpens() {
        Response c = CrmUser.ok(owner().post("/record-portals", portal(QA + "Portal " + tag())), "create portal");
        String id = c.jsonPath().getString("data.id"), url = c.jsonPath().getString("data.portal_url");
        cleanup.then(() -> fact("cleanup", "delete portal -> " + owner().delete("/record-portals/" + id).statusCode()));
        Response on = owner().patch("/record-portals/" + id, m("is_enabled", true, "row_version", c.jsonPath().get("data.row_version")));
        if (on.statusCode() / 100 != 2) throw new SkipException("INCONCLUSIVE: switching the QA portal on was refused: " + err(on));
        int link = publicStatus(url);
        owner().patch("/record-portals/" + id, m("is_enabled", false, "row_version", on.jsonPath().get("data.row_version")));
        fact("M07", "portal on (" + on.statusCode() + "), link " + link);
        Assert.assertNotEquals(link, 404, "the portal link answers 404 while the portal is on");
    }

    @CaseId("M09")
    @Test(groups = {"crmchannels", "wave4", "api", "W4-B3", "NDC-2632"}, description = "Notifications answer for the owner and for a User-profile user: list, unread count, preferences")
    public void notificationsAnswer() {
        CrmUser.ok(owner().get("/iam/me/profile"), "control: owner token works");
        StringBuilder s = new StringBuilder();
        boolean ok = true;
        for (CrmUser u : List.of(owner(), user1()))
            for (String p : List.of("/notifications?limit=5", "/notifications/unread-count", "/notifications/preferences/me")) {
                int st = u.get(p).statusCode();
                s.append(u.email.split("@")[0]).append(' ').append(p).append('=').append(st).append("; ");
                ok &= st == 200;
            }
        fact("M09", s.toString());
        Assert.assertTrue(ok, "a notification call failed: " + s);
    }

    @CaseId("M04")
    @Test(groups = {"crmchannels", "wave4", "api", "regression"}, description = "SMS template with a placeholder: create as draft, read back, archive (nothing is sent)")
    public void smsTemplate() {
        Response c = CrmUser.ok(owner().post("/messaging/templates", m("name", QA + "SMS " + tag(), "purpose", "transactional", "language", "en",
                "body", "Hi {{first_name}}, QA W4 test", "status", "draft")), "create SMS template");
        String id = c.jsonPath().getString("data.template_id");
        List<String> vars = c.jsonPath().getList("data.variables");
        int archive = owner().post("/messaging/templates/" + id + "/archive", Map.of()).statusCode();
        fact("M04", "template " + id + " variables " + vars + ", archive " + archive);
        Assert.assertEquals(vars, List.of("first_name"), "the placeholder was not detected");
        Assert.assertEquals(archive / 100, 2, "archive the SMS template");
    }

    @CaseId("M05")
    @Test(groups = {"crmchannels", "wave4", "api", "regression"}, description = "Telephony: providers generic and ziwo are available; status answers")
    public void telephonyStatus() {
        String providers = CrmUser.ok(owner().get("/telephony/providers"), "providers").asString();
        String status = CrmUser.ok(owner().get("/telephony/status"), "status").asString();
        fact("M05", "providers " + providers.replaceAll("\\s+", " ") + " status " + status);
        Assert.assertTrue(providers.contains("generic") && providers.contains("ziwo"), "generic and ZIWO providers are not offered");
    }

    @Test(groups = {"crmchannels", "wave4", "api", "NDC-2630"}, description = "A sent email's result is reported honestly: a failed send shows as failed on the record, never as sent")
    public void sendResultIsHonest() {
        String sendability = owner().get("/emails/sendability").asString();
        String lead = createLead(cleanup, QA + "Send " + tag(), MAIL_TO);
        Map<String, Object> body = m("to", List.of(MAIL_TO), "subject", QA + "send result", "body", "QA NDC-2630 send result check", "body_html", "<p>QA NDC-2630 send result check</p>",
                "record_type", "leads", "record_id", lead, "attachments", List.of());
        String draft = CrmUser.ok(owner().post("/mail/drafts", body), "save draft").jsonPath().getString("data.id");
        io.restassured.response.Response send = owner().post("/mail/drafts/" + draft + "/send", Map.of());
        String mails = "", sent = "", timeline = "";
        for (int i = 0; i < 12; i++) {
            try { Thread.sleep(5000); } catch (InterruptedException e) { break; }
            mails = owner().get("/mail/records/leads/" + lead + "/emails?box=mails&limit=10").asString();
            sent = owner().get("/mail/records/leads/" + lead + "/emails?box=sent&limit=10").asString();
            timeline = owner().get("/timeline/records/leads/" + lead + "/feed").asString();
            if (mails.contains("\"status\"") || sent.contains("\"status\"")) break;
        }
        String all = (mails + sent).replaceAll("[\\w.+-]+@[\\w.-]+", "<email>");
        fact("M02-send", "sendability " + cut(sendability) + "; send -> " + err(send) + "; mails " + cut(all) + "; timeline entries " + entryTypes(timeline));
        boolean failed = all.contains("\"failed\"") || send.statusCode() / 100 != 2;
        if (!failed) throw new SkipException("INCONCLUSIVE: the send succeeded, so a failure could not be observed (" + cut(all) + ")");
        Assert.assertFalse(timeline.contains("EmailSent"), "a failed email is logged as sent on the timeline");
        Assert.assertTrue(all.contains("failed"), "the failed email is not shown as failed on the record");
    }

    private static String entryTypes(String feed) {
        java.util.regex.Matcher m = java.util.regex.Pattern.compile("\"entry_type\":\"(\\w+)\"").matcher(feed);
        StringBuilder b = new StringBuilder();
        while (m.find()) b.append(m.group(1)).append(' ');
        return b.toString().trim();
    }

    private static String cut(String s) { return s == null ? "" : s.length() > 400 ? s.substring(0, 400) : s; }
}
