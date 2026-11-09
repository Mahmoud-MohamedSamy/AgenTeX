package qa.features.crmchannels;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmautomationorder.CrmOrderFeature;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static qa.features.crmchannels.CrmChannelsApi.*;
import static qa.features.crmchannels.CrmChannelsFeature.*;

/**
 * Round 2 (27 Oct 2026) additions to Wave 4: the public web-form spam trap (the hidden "Leave this field empty" field),
 * the "5 minutes before" activity reminder, and the template placeholder check (NDC-2631). The public form is driven
 * through the same calls the embedded form makes: POST /web-forms/public/{key}/session, then POST …/submissions with the
 * X-Web-Form-Session header; both public calls need an Origin header (without it the session answers 404). Every form, lead and task made here is removed afterwards.
 */
public class R2W4ChannelsTest {
    private final Cleanup cleanup = new Cleanup();

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    /** Submits the public form as a visitor (no sign-in); returns the submissions response. */
    private static Response publicSubmit(String key, Map<String, Object> values, String honeypot) {
        Response s = RestAssured.given().baseUri(CrmOrderFeature.API).relaxedHTTPSValidation().header("Origin", CrmOrderFeature.BASE).header("Referer", CrmOrderFeature.BASE + "/embed/feedback/index.html")
                .post("/web-forms/public/" + key + "/session");
        String token = s.jsonPath().getString("data.session_token");
        if (token == null) throw new SkipException("INCONCLUSIVE: no public form session (" + s.statusCode() + ")");
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("submission_id", UUID.randomUUID().toString());
        body.put("values", values);
        body.put("file_ids", List.of());
        body.put("captcha_token", null);
        // exactly what the embedded form sends (captured 27 Oct 2026): page_origin null, elapsed_ms, visitor_id.
        // With page_origin set the trap was honoured; the real form sends null and the trap is ignored (R2W4-C1).
        body.put("page_origin", null);
        body.put("elapsed_ms", 4500);
        body.put("visitor_id", UUID.randomUUID().toString());
        body.put("honeypot", honeypot);
        return RestAssured.given().baseUri(CrmOrderFeature.API).relaxedHTTPSValidation().contentType(ContentType.JSON).header("Origin", CrmOrderFeature.BASE).header("Referer", CrmOrderFeature.BASE + "/embed/feedback/index.html")
                .header("X-Web-Form-Session", token).body(body).post("/web-forms/public/" + key + "/submissions");
    }

    /** Id of the newest Standard-layout lead whose Full Name is {@code name}, waiting up to {@code seconds}; null if none. */
    @SuppressWarnings("unchecked")
    private static String findLead(String name, int seconds) {
        String[] id = {null};
        CrmApi.waitFor(seconds, () -> {
            List<Map<String, Object>> rows = owner().get("/modules/" + LEADS + "/records?page=1&per_page=50&layout_id=" + LEADS_LAYOUT + "&sort_by=created_at&sort_dir=desc").jsonPath().getList("data");
            for (Map<String, Object> r : rows) if (String.valueOf(r.get("data")).contains(name)) id[0] = String.valueOf(r.get("id"));
            return id[0] != null;
        });
        return id[0];
    }

    private static Map<String, Object> values(String name, String phone) {
        Map<String, Object> v = new LinkedHashMap<>();
        v.put("first_name", name);
        v.put("phone", phone);
        v.put("email", MAIL_TO_2);
        v.put("company", "QA R2W4 Co");
        return v;
    }

    @CaseId("M06")
    @Test(groups = {"crmchannels", "wave4", "api", "R2W4-C1"}, description = "A public form submission with the hidden spam-trap field filled is not turned into a lead (a normal submission is the control)")
    public void webFormSpamTrapRefused() {
        String t = tag();
        Response f = CrmUser.ok(owner().post("/web-forms", webForm("QA R2W4 Form HP " + t, false)), "create form");
        String formId = f.jsonPath().getString("data.id"), key = f.jsonPath().getString("data.embed_key");
        cleanup.then(() -> owner().delete("/web-forms/" + formId));
        String ok = "QA R2W4 HP ok " + t, spam = "QA R2W4 HP spam " + t;
        Response control = publicSubmit(key, values(ok, "0101555" + t.substring(Math.max(0, t.length() - 4))), "");
        Response trapped = publicSubmit(key, values(spam, "0101666" + t.substring(Math.max(0, t.length() - 4))), "http://spam.example");
        String okId = findLead(ok, 30), spamId = findLead(spam, 15);
        cleanup.lead(okId);
        cleanup.lead(spamId);
        fact("R2W4-C1", "control submit -> " + control.statusCode() + ", lead=" + (okId != null) + "; spam-trap submit -> " + trapped.statusCode() + " " + err(trapped) + ", lead=" + (spamId != null));
        if (okId == null) throw new SkipException("INCONCLUSIVE: the normal submission created no lead either");
        Assert.assertNull(spamId, "a submission with the spam-trap field filled was turned into a lead");
    }

    @CaseId("M10")
    @Test(groups = {"crmchannels", "wave4", "api", "regression", "slow"}, description = "A task with a 5-minute reminder sends the 'before' reminder notification")
    @SuppressWarnings("unchecked")
    public void reminderBeforeDelivered() {
        String name = "QA R2W4 Reminder " + tag();
        Instant due = Instant.now().plus(8, ChronoUnit.MINUTES).truncatedTo(ChronoUnit.MINUTES);
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("name", name);
        f.put("subject", name);
        f.put("status", "Not Started");
        f.put("due_date", due.toString());
        f.put("reminder_offset_minutes", "5");
        String id = CrmUser.ok(owner().post("/modules/" + CrmOrderFeature.TASKS + "/records", m("layout_id", CrmOrderFeature.TASKS_STANDARD, "data", CrmApi.data(f))), "create task").jsonPath().getString("data.id");
        cleanup.then(() -> owner().delete("/modules/" + CrmOrderFeature.TASKS + "/records/" + id));
        boolean[] seen = {false};
        CrmApi.waitFor(330, () -> {
            List<Map<String, Object>> items = owner().get("/notifications?limit=50").jsonPath().getList("data.data");
            if (items == null) items = owner().get("/notifications?limit=50").jsonPath().getList("data");
            for (Map<String, Object> n : items) if (String.valueOf(n.get("event_type")).equals("crm.activity.reminder.before") && String.valueOf(n).contains(name)) seen[0] = true;
            return seen[0];
        });
        fact("M10", "task due " + due + " with a 5-minute reminder; 'before' notification seen=" + seen[0]);
        Assert.assertTrue(seen[0], "no 'before' reminder notification arrived");
    }

    @CaseId("C14")
    @Test(groups = {"crmchannels", "wave4", "api", "NDC-2631"}, description = "A template using a placeholder that can't be filled is refused with a message naming it")
    public void unknownPlaceholderRefused() {
        Response r = owner().post("/mail/templates", m("name", "QA R2W4 Template bad " + tag(), "subject", "Hi", "body_html", "<p>at {{company_name}}.</p>", "access", "everyone"));
        if (r.statusCode() / 100 == 2) cleanup.then(() -> owner().delete("/mail/templates/" + r.jsonPath().getString("data.id")));
        fact("NDC-2631", "template with {{company_name}} -> " + err(r));
        Assert.assertEquals(r.statusCode(), 422, "a template with an unfillable placeholder was saved");
        Assert.assertTrue(r.asString().contains("company_name"), "the message doesn't name the placeholder");
    }
}
