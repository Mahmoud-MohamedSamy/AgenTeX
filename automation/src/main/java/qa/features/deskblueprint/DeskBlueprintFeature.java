package qa.features.deskblueprint;

import qa.core.config.Config;

/** Constants shared by the Desk Blueprint (with SLA tie-in) pages, API helper and tests. */
public final class DeskBlueprintFeature {
    /** Folder name under src/test/resources/features/ and the locators.json owner. */
    public static final String NAME = "deskblueprint";

    /** Desk staging host and the org this feature runs in (org "Anyware", not NDC-Staging). */
    public static final String HOST = Config.get("bp.host", "https://staging-desk.taviportal.com");
    public static final String TENANT = Config.get("bp.tenant", "a7a7a7a7-0000-0000-0000-000000000002");
    public static final String OWNER = Config.get("bp.owner", "anyware-staging-owner@anyware.software");
    public static final String CREDENTIALS = Config.get("bp.credentials", ".auth/extra-credentials.csv");

    /** Tickets module of org Anyware and the QA department every QA blueprint / ticket lives in. */
    public static final String TICKETS = "e8e5e302-3873-4e32-b945-c9cd25c7659d";
    public static final String QA_DEPT = Config.get("bp.dept", "9a7e391c-be72-49e4-a1cf-763e5c88e23d"); // "QA WF Dept R"
    public static final String DEFAULT_DEPT = "369b76d3-eef4-4698-97db-be0c47e61ec5"; // techSupport (default department)
    /** "DAR Review": only its inactive Demo blueprint; used as the move target in L7. */
    public static final String OTHER_DEPT = "f6cf3a84-fc16-4e33-a671-3fcb26bc1422";
    /** Desk tasks module (createTask after-action target). */
    public static final String TASKS = "479a6b72-dffc-4dc9-9166-b5b176b09648";

    /** Every blueprint, ticket and subject this feature creates starts with this. */
    public static final String QA = "QA BP ";

    public static final String LIST_PATH = "/settings/automation/blueprints";

    private DeskBlueprintFeature() {
    }
}
