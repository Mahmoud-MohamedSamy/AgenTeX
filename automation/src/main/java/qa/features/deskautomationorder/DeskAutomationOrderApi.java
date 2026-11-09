package qa.features.deskautomationorder;

import io.restassured.response.Response;
import qa.core.api.ApiClient;

/** API calls for Desk automation order: seed and clean up test data, and check what the UI saved. */
public class DeskAutomationOrderApi extends ApiClient {
    // public Response list() { return get("/..."); }
    // Tests that read results or clean up through this class: call requireAuth("/<cheap GET>") first,
    // and read results with ok(response, "what") so a 401/empty read can never look like a pass.
}
