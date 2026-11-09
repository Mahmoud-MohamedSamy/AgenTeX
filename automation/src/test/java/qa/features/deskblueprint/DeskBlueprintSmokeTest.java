package qa.features.deskblueprint;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;

/**
 * Desk Blueprint (with SLA tie-in) — tests. Groups: "smoke", "regression", and the bug id (e.g. "NDC-1234") for bug retests,
 * so "-Dtags=NDC-1234" reruns exactly that bug. @CaseId links the spec case.
 */
public class DeskBlueprintSmokeTest extends BaseTest {

    // @Test(groups = {"smoke", "regression"}, description = "...")
    // @CaseId("BP-001")
    // public void listPageLoads() { ... }
}
