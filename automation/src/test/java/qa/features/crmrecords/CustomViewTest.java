package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group CV — Leads custom views through the API: criteria, rename, clone, pin, validation of the pattern,
 * duplicate and over-long names, and the view shared with test user 1. Two QA leads match the views; every view
 * made here is private (or shared with test user 1 only) and deleted afterwards.
 */
public class CustomViewTest {
    private final Cleanup cleanup = new Cleanup();
    private final List<String> views = new ArrayList<>();
    private final String t = tag();
    private final String prefix = QA + "CV " + t;
    private final List<String> leads = new ArrayList<>();

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        cleanup.then(() -> views.forEach(v -> fact("cleanup", "delete view " + v + " -> " + owner().delete("/modules/" + LEADS + "/views/" + v).statusCode())));
        for (int i = 1; i <= 2; i++) leads.add(create(owner(), cleanup, mod("leads"), prefix + " lead " + i, null));
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private Map<String, Object> criteria(String pattern) {
        return m("pattern", pattern, "conditions", List.of(
                m("field", "first_name", "operator", "starts_with", "value", prefix),
                m("field", "phone", "operator", "is_not_empty", "value", null)));
    }

    private Response makeView(CrmUser as, String name, Map<String, Object> criteria, String visibility, List<String> sharedWith) {
        Map<String, Object> body = m("name", name, "kind", "list", "layout_id", LEADS_LAYOUT, "visibility", visibility,
                "settings", m("columns", List.of("first_name", "phone", "owner"), "sort", m("field", "created_at", "dir", "desc"), "criteria", criteria, "related_criteria", List.of()));
        if (sharedWith != null) body.put("shared_user_ids", sharedWith);
        Response r = as.post("/modules/" + LEADS + "/views", body);
        if (r.statusCode() / 100 == 2) views.add(r.jsonPath().getString("data.id"));
        return r;
    }

    private List<String> recordIdsOf(String viewId) {
        return CrmUser.ok(owner().get("/modules/" + LEADS + "/records?page=1&per_page=100&layout_id=" + LEADS_LAYOUT + "&view_id=" + viewId), "view records")
                .jsonPath().getList("data.id");
    }

    @CaseId({"CV-01", "CV-02"})
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Create with criteria '1 and 2' shows exactly the matching records; rename, clone, pin and unpin work")
    public void createRenameClonePin() {
        Response c = CrmUser.ok(makeView(owner(), prefix + " main", criteria("1 and 2"), "private", null), "create view");
        String id = c.jsonPath().getString("data.id");
        List<String> ids = recordIdsOf(id);
        int rename = owner().patch("/modules/" + LEADS + "/views/" + id, m("name", prefix + " renamed", "row_version", c.jsonPath().get("data.row_version"))).statusCode();
        Response clone = owner().post("/modules/" + LEADS + "/views/" + id + "/clone", m("name", prefix + " clone"));
        if (clone.statusCode() / 100 == 2) views.add(clone.jsonPath().getString("data.id"));
        int pin = owner().put("/modules/" + LEADS + "/views/" + id + "/pin", Map.of()).statusCode();
        int unpin = owner().delete("/modules/" + LEADS + "/views/" + id + "/pin").statusCode();
        fact("CV-01", "view records " + ids + " (expected " + leads + "); rename " + rename + ", clone " + err(clone) + ", pin " + pin + ", unpin " + unpin);
        Assert.assertEqualsNoOrder(ids.toArray(), leads.toArray(), "the view does not show exactly the two matching QA leads");
        Assert.assertEquals(rename, 200, "rename");
        Assert.assertEquals(clone.statusCode(), 201, "clone");
        Assert.assertEquals(pin / 100, 2, "pin");
        Assert.assertEquals(unpin / 100, 2, "unpin");
    }

    @CaseId("CV-02")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Pattern naming a missing condition (422), a taken name (409) and a 206-character name (422) are refused")
    public void validation() {
        makeView(owner(), prefix + " taken", null, "private", null);
        Response bad = makeView(owner(), prefix + " bad pattern", criteria("1 and 3"), "private", null);
        Response dup = makeView(owner(), prefix + " taken", null, "private", null);
        Response longName = makeView(owner(), QA + "L".repeat(200), null, "private", null);
        fact("CV-02", "pattern '1 and 3' -> " + err(bad) + "; same name -> " + err(dup) + "; 206 chars -> " + err(longName));
        Assert.assertEquals(bad.statusCode(), 422, "a pattern naming condition 3 of 2 was accepted");
        Assert.assertEquals(dup.statusCode(), 409, "a second view with the same name was accepted");
        Assert.assertEquals(longName.statusCode(), 422, "a 206-character view name was accepted");
    }

    @CaseId("CV-03")
    @Test(groups = {"crmrecords", "wave2", "api", "NDC-2122"}, description = "Upper-case 'AND' in the criteria pattern is refused like any other invalid pattern")
    public void upperCaseAndRefused() {
        Response r = makeView(owner(), prefix + " upper AND", criteria("1 AND 2"), "private", null);
        fact("CV-03", "pattern '1 AND 2' -> " + err(r));
        Assert.assertEquals(r.statusCode() / 100, 4, "pattern '1 AND 2' was accepted (NDC-2122)");
    }

    @CaseId("CV-07")
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "A view shared with test user 1 is listed for them; the owner's private view is not")
    public void sharedViewVisibility() {
        String shared = CrmUser.ok(makeView(owner(), prefix + " shared", criteria("1 and 2"), "selected", List.of(N_ID)), "shared view").jsonPath().getString("data.id");
        String priv = CrmUser.ok(makeView(owner(), prefix + " private", criteria("1 and 2"), "private", null), "private view").jsonPath().getString("data.id");
        String list = CrmUser.ok(user1().get("/modules/" + LEADS + "/views?kind=list&layout_id=" + LEADS_LAYOUT), "user 1 views").asString();
        fact("CV-07", "user 1 sees shared=" + list.contains(shared) + ", private=" + list.contains(priv));
        Assert.assertTrue(list.contains(shared), "the view shared with test user 1 is not listed for them");
        Assert.assertFalse(list.contains(priv), "test user 1 sees the owner's private view");
    }
}
