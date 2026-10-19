package qa.features.crmautomationorder;

import io.restassured.response.Response;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;

/**
 * B-03 screen recording (19 Oct 2026): sets up a review process (Email) and an On Edit workflow, creates the leads, then
 * hands over to the UI recorder (target/b03-record.json) and waits for target/b03-record.done before reading the result
 * and cleaning up. mvnw test -Dsuite=crm-record ; the recorder is scratchpad b03-record.js.
 */
public class RecordB03Test extends VerifyBase {
    @Override protected String session() { return "R3"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private final List<String> rules = new ArrayList<>();

    @org.testng.annotations.AfterMethod(alwaysRun = true)
    public void dropRules() {
        for (String id : rules) {
            adminB().post("/workflow/rules/" + id + "/deactivate", null);
            out("[R3 cleanup] delete rule " + id + " -> " + adminB().delete("/workflow/rules/" + id).statusCode());
        }
        rules.clear();
    }

    private String lead(String c, String sfx, String email) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, sfx)));
        f.put("email", email);
        return createLogged(c, userN(), LEADS, f);
    }

    @CaseId("G-07")
    @Test(groups = {"crm-record"}, description = "B-03 recording: edit held by review, approved in the UI, On Edit workflow never runs; control without review")
    public void b03Recording() throws Exception {
        String c = "B-03";
        String target = lead(c, "held", "qa.aeo.r3.held@qa.test");
        String control = lead(c, "control", "qa.aeo.r3.control@qa.test");
        String practice = lead(c, "held practice", "qa.aeo.r3.practice@qa.test");
        // processes after the leads exist, so the creates are not held; criteria limited to this session's names
        String rp = api.reviewProcess(CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", CrmProcs.guard(LEADS, nm(c, "held")), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id())));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        Map<String, Object> wfBody = CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onEdit().where(CrmProcs.eq("lead_source", "referral"))
                .fieldUpdate("lead_status", "Pending Payment").build();
        Response wr = post(c, adminB(), "/workflow/rules", wfBody);
        CrmUser.ok(wr, "create rule");
        String w = wr.jsonPath().getString("data.id");
        rules.add(w);
        on(c, "workflow " + w, api.setWorkflowActive(w, true));

        Path hand = Path.of("target/b03-record.json");
        Path done = Path.of("target/b03-record.done");
        Files.deleteIfExists(done);
        Files.writeString(hand, json(Map.of("target", target, "control", control, "practice", practice, "reviewProcess", rp, "workflow", w,
                "layout", layout(LEADS), "targetName", nm(c, "held"), "controlName", nm(c, "control"), "practiceName", nm(c, "held practice"))));
        fact(c, "handed over to the UI recorder: " + hand.toAbsolutePath());
        long until = System.currentTimeMillis() + 40 * 60_000L;
        while (!Files.exists(done) && System.currentTimeMillis() < until) CrmUser.sleep(5000);
        fact(c, "recorder finished=" + Files.exists(done));
        for (String id : List.of(target, control, practice))
            fact(c, "lead " + id + " review=" + api.reviewStatus(LEADS, id) + " lead_source=" + val(LEADS, id, "lead_source") + " lead_status=" + val(LEADS, id, "lead_status")
                    + " description=" + val(LEADS, id, "description") + " wfFired=" + api.firedCount(id, w));
        Files.deleteIfExists(hand);
    }
}
