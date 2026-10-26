package qa.features.crmrecords;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group PL — Transactions pipelines through the API. The Standard layout has two pipelines, "Standard"
 * (default) and "1". A deal must be creatable with a pipeline id (NDC-2382), movable to the other pipeline by edit
 * (W2-B4 / NDC-1312) and by Mass Update (NDC-1316), and a stage change must keep the pipeline (NDC-1302).
 * QA deals are created with the literal "Standard (Standard)", the only value accepted today.
 */
public class PipelineTest {
    private final Cleanup cleanup = new Cleanup();
    private final CrmModule deals = mod("deals");
    private String firstStageOfOne;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        List<Map<String, Object>> pls = CrmUser.ok(owner().get("/modules/" + DEALS + "/pipelines?layout_id=" + DEALS_LAYOUT), "pipelines").jsonPath().getList("data");
        for (Map<String, Object> p : pls)
            if (PIPELINE_ONE.equals(p.get("id")) && p.get("stages") instanceof List<?> st && !st.isEmpty() && st.get(0) instanceof Map<?, ?> s0)
                {
                fact("PL", "first stage of 1: " + s0);
                for (String k : List.of("stageValue", "value", "key", "apiName", "api_name", "stageKey", "name")) if (firstStageOfOne == null && s0.get(k) != null) firstStageOfOne = String.valueOf(s0.get(k));
            }
        fact("PL", "pipelines of the Standard layout: " + pls.stream().map(p -> p.get("name") + "|" + p.get("id")).toList() + "; first stage of '1' = " + firstStageOfOne);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private String newDeal(String label) {
        return create(owner(), cleanup, deals, QA + "PL " + label + " " + tag(), null);
    }

    @CaseId("PL-04")
    @Test(groups = {"crmrecords", "wave2", "api", "NDC-2382"}, description = "A deal can be created with the pipeline's id (the default pipeline of its layout)")
    public void createWithPipelineId() {
        Map<String, Object> f = required("deals", QA + "PL id " + tag());
        f.put("pipeline", PIPELINE_STANDARD);
        Response r = post(owner(), deals, f);
        if (r.statusCode() / 100 == 2) cleanup.record(deals, r.jsonPath().getString("data.id"));
        fact("PL-04", "create with pipeline id " + PIPELINE_STANDARD + " -> " + err(r));
        Assert.assertEquals(r.statusCode(), 201, "a deal with its layout's default pipeline id was refused");
    }

    @CaseId({"PL-04", "PL-06"})
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B4", "NDC-1312", "NDC-2382"}, description = "Editing a deal to pipeline '1' with a stage of that pipeline moves it")
    public void moveDealByEdit() {
        if (firstStageOfOne == null) throw new SkipException("INCONCLUSIVE: pipeline '1' or its stages not found on the Standard layout");
        String id = newDeal("move");
        Response r = patch(owner(), deals, id, Map.of("pipeline", PIPELINE_ONE, "stage", firstStageOfOne));
        String now = str(CrmUser.ok(get(owner(), deals, id), "read deal"), "pipeline");
        fact("PL-06", "PATCH pipeline -> '1' (" + PIPELINE_ONE + "), stage " + firstStageOfOne + " -> " + err(r) + "; pipeline now " + now);
        Assert.assertEquals(r.statusCode(), 200, "moving the deal to pipeline '1' was refused");
        Assert.assertEquals(now, PIPELINE_ONE, "the deal is not in pipeline '1'");
    }

    @CaseId("PL-08")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B4", "NDC-1316"}, description = "Mass Update of Pipeline (with the new stage) moves the selected deals")
    public void moveDealByMassUpdate() {
        if (firstStageOfOne == null) throw new SkipException("INCONCLUSIVE: pipeline '1' or its stages not found on the Standard layout");
        String id = newDeal("mass");
        Response r = owner().post("/modules/" + DEALS + "/records/mass-update", m("record_ids", List.of(id),
                "data", CrmApi.data(new java.util.LinkedHashMap<>(Map.of("pipeline", PIPELINE_ONE, "stage", firstStageOfOne)))));
        boolean moved = CrmApi.waitFor(20, () -> PIPELINE_ONE.equals(str(get(owner(), deals, id), "pipeline")));
        fact("PL-08", "mass-update pipeline -> " + err(r) + "; moved=" + moved);
        Assert.assertEquals(r.statusCode() / 100, 2, "Mass Update of Pipeline was refused");
        Assert.assertTrue(moved, "the deal was not moved by Mass Update");
    }

    @CaseId("PL-05")
    @Test(groups = {"crmrecords", "wave2", "api", "regression", "NDC-1302"}, description = "Changing only the stage keeps the deal's pipeline")
    public void stageChangeKeepsPipeline() {
        String id = newDeal("stage");
        String before = str(CrmUser.ok(get(owner(), deals, id), "read"), "pipeline");
        CrmUser.ok(patch(owner(), deals, id, Map.of("stage", "needs_analysis")), "stage change");
        Response g = CrmUser.ok(get(owner(), deals, id), "read after");
        fact("PL-05", "pipeline " + before + " -> " + str(g, "pipeline") + ", stage " + str(g, "stage"));
        Assert.assertEquals(str(g, "stage"), "needs_analysis", "the stage was not stored");
        Assert.assertEquals(str(g, "pipeline"), before, "changing the stage changed the pipeline");
    }

    @CaseId("PL-07")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B4", "NDC-1324"}, description = "The Pipeline field offers every pipeline of the layout (Standard and 1), not only 'Standard (Standard)'")
    @SuppressWarnings("unchecked")
    public void pipelineFieldOffersAllPipelines() {
        Object data = CrmUser.ok(owner().get("/modules/" + DEALS + "/fields"), "fields").jsonPath().get("data");
        List<Map<String, Object>> fields = data instanceof List ? (List<Map<String, Object>>) data : (List<Map<String, Object>>) ((Map<String, Object>) data).get("fields");
        Map<String, Object> pf = fields.stream().filter(f -> "pipeline".equals(f.get("apiName"))).findFirst().orElseThrow();
        String opts = String.valueOf(pf.get("datatypeOptions"));
        fact("PL-07", "pipeline field options: " + (opts.length() > 300 ? opts.substring(0, 300) : opts));
        Assert.assertTrue(opts.contains(PIPELINE_ONE) || opts.matches("(?s).*[\\[,]\\s*\"?1( \\(Standard\\))?\"?\\s*[\\],].*"),
                "the Pipeline field does not offer pipeline '1': " + opts);
    }
}
