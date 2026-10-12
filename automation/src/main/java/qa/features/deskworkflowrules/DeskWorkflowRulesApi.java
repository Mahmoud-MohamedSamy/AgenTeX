package qa.features.deskworkflowrules;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import qa.core.api.ApiClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Workflow API (/api/v1, x-app-key: desk): check what the UI saved and clean up QA rules.
 * Bugs are reproduced through the UI; the API is only for reading results and cleanup.
 * Needs api.headers + api.tokenScript in config.properties (see feature-map "API").
 */
public class DeskWorkflowRulesApi extends ApiClient {

    /**
     * Call before creating anything. If the API can't be reached with the browser's token, the test
     * could neither read its result (false pass) nor clean up (QA rules left active), so it is skipped.
     */
    public DeskWorkflowRulesApi requireAuth() {
        requireAuth("/workflow/rules?take=1");
        return this;
    }

    public Response rules() {
        return get("/workflow/rules?take=100");
    }

    /** Ids of rules whose name starts with the prefix (e.g. "QA "). */
    public List<String> ruleIdsNamed(String prefix) {
        List<Map<String, Object>> data = ok(rules(), "GET /workflow/rules").jsonPath().getList("data");
        return data.stream().filter(r -> String.valueOf(r.get("name")).startsWith(prefix))
                .map(r -> String.valueOf(r.get("id"))).toList();
    }

    public Response deactivate(String ruleId) {
        return post("/workflow/rules/" + ruleId + "/deactivate", null);
    }

    /** Field values of a record, flattened {field: value}. Fails on any non-200 so an empty map never reads as "not set". */
    public Map<String, String> record(String moduleId, String recordId) {
        Response r = ok(get("/modules/" + moduleId + "/records/" + recordId), "GET record " + recordId);
        JsonPath j = r.jsonPath();
        List<Map<String, Object>> fields = j.getList("data.data");
        if (fields == null || fields.isEmpty())
            throw new IllegalStateException("GET record " + recordId + " had no data.data fields: " + r.asString());
        Map<String, String> out = new LinkedHashMap<>();
        for (Map<String, Object> f : fields) {
            Object v = f.get("value");
            if (v instanceof Map<?, ?> m && m.containsKey("value")) v = m.get("value");
            out.put(String.valueOf(f.get("field")), v == null ? null : String.valueOf(v));
        }
        return out;
    }

    public Response executionsForRecord(String recordId) {
        return get("/workflow/executions?recordId=" + recordId);
    }

    /** Raw Execution History body for a record (shape not pinned yet; used in failure messages and id lookups). */
    public String executionsText(String recordId) {
        Response r = executionsForRecord(recordId);
        return r.statusCode() + " " + r.asString();
    }
}
