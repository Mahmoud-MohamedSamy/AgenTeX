package qa.features.crmscreens;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmscreens.CrmScreensFeature.*;

/**
 * API checks of the screen lane (28 Oct 2026): S01 work queue calls, S07 flights / bookings, G09 key API timings
 * (3 runs each; target 1 s per call, median and worst reported), G05 per-user locale setting shape.
 */
public class ScreensApiTest {

    @CaseId("WQ-11")
    @Test(groups = {"crmscreens", "s01", "api"}, description = "Work queue calls answer 200: summary, queues, team")
    public void workQueueCalls() {
        Map<String, Integer> s = new LinkedHashMap<>();
        // the query goes in as a parameter: a pre-encoded %2C in the path is encoded again by REST Assured (400, run 1)
        s.put("/workqueue/summary", api().req().queryParam("sections", "activities,queues,jobs").get("/workqueue/summary").statusCode());
        for (String p : List.of("/workqueue/queues", "/workqueue/team"))
            s.put(p, api().get(p).statusCode());
        fact("WQ-11", s.toString());
        s.forEach((k, v) -> Assert.assertEquals((int) v, 200, k));
    }

    @CaseId("FL-01")
    @Test(groups = {"crmscreens", "s07", "api"}, description = "Flights search / bookings: is any API route live? (build only has them as demo custom-action data)")
    public void flightsAndBookings() {
        Map<String, String> s = new LinkedHashMap<>();
        for (String p : List.of("/v2/flights/search?origin=CAI&destination=DXB&departureDate=2026-11-12&adults=1", "/v2/bookings", "/flights/search", "/bookings")) {
            Response r = api().get(p);
            s.put("/api/v1" + p.split("\\?")[0], String.valueOf(r.statusCode()));
        }
        // the gateway answers /api/v2/* itself: "No gateway route is configured"
        Response v2 = api().req().baseUri(BASE).get("/api/v2/flights/search");
        s.put("/api/v2/flights/search", body(v2, 120));
        fact("FL-01", s.toString());
        boolean anyLive = s.values().stream().anyMatch(v -> v.startsWith("2"));
        if (!anyLive) throw new SkipException("NOT AVAILABLE: no flights / bookings route on staging (404 everywhere; UI routes redirect to Home) - " + s);
    }

    @CaseId("G9-API")
    @Test(groups = {"crmscreens", "g09", "api", "perf"}, description = "Key API calls: median of 3 runs within 1 s (worst reported)")
    public void apiTimings() {
        String rec = api().get("/modules/" + LEADS + "/records?page=1&per_page=1&sort_by=created_at&sort_dir=desc").jsonPath().getString("data[0].id");
        Map<String, String> calls = new LinkedHashMap<>();
        calls.put("GET /iam/me", "/iam/me");
        calls.put("GET /iam/me/permissions", "/iam/me/permissions");
        calls.put("GET /modules", "/modules");
        calls.put("GET leads fields", "/modules/" + LEADS + "/fields");
        calls.put("GET leads layouts", "/modules/" + LEADS + "/layouts");
        calls.put("GET leads list-preferences", "/modules/" + LEADS + "/list-preferences");
        calls.put("GET leads records p1", "/modules/" + LEADS + "/records?page=1&per_page=20&layout_id=" + LEADS_LAYOUT + "&sort_by=created_at&sort_dir=desc");
        calls.put("GET deals records p1", "/modules/" + DEALS + "/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc");
        calls.put("GET lead record", "/modules/" + LEADS + "/records/" + rec);
        calls.put("GET lead timeline", "/timeline/records/leads/" + rec + "/feed");
        calls.put("GET settings hub", "/settings/hub?app=crm");
        calls.put("GET reports", "/reporting/reports");
        calls.put("GET dashboards", "/reporting/dashboards");
        calls.put("GET workqueue queues", "/workqueue/queues");
        calls.put("GET search", "/search?q=QA%20R2SC");
        List<String> slow = new ArrayList<>();
        StringBuilder t = new StringBuilder();
        for (Map.Entry<String, String> c : calls.entrySet()) {
            List<Long> runs = new ArrayList<>();
            for (int i = 0; i < 3; i++) {
                long t0 = System.currentTimeMillis();
                api().get(c.getValue());
                runs.add(System.currentTimeMillis() - t0);
            }
            t.append(c.getKey()).append(" ").append(runs).append(" median ").append(median(runs)).append(" worst ").append(worst(runs)).append("; ");
            if (median(runs) > 1000) slow.add(c.getKey() + " " + median(runs) + " ms");
        }
        fact("G9-API", t.toString());
        Assert.assertTrue(slow.isEmpty(), "calls over 1 s (median of 3): " + slow);
    }

    @CaseId("G5-API")
    @Test(groups = {"crmscreens", "g05", "api"}, description = "Language is a per-user setting (general.user.locale.language, scope User)")
    public void languageIsPerUser() {
        Response r = api().post("/settings/resolved-batch", m("items", List.of(m("app_key", "general", "key", "general.user.locale.language", "scope_type", "User"))));
        fact("G5-API", body(r, 300));
        Assert.assertEquals(r.statusCode(), 200);
        Assert.assertTrue(r.asString().contains("general.user.locale.language"));
    }
}
