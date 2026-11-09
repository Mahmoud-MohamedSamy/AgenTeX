package qa.features.crmsetup;

import qa.features.crmautomationorder.CrmOrderFeature;

/**
 * Constants for the CRM go-live Wave 5 (setup and integrations) tests: modules and fields, layouts, rules, teamspaces,
 * data types, skills, reports, API integrations. Explored 26 Oct 2026 on staging-crm (lane C of the Waves 3-5 run).
 * Plan and results: executions/execu_2026-10-26_crm-golive-waves3-5/wave5/.
 * Every schema change is made on a module the test creates itself ("QA W5 Auto ..."), never on a live module.
 */
public final class CrmSetupFeature {
    /** Folder name under src/test/resources/features/. */
    public static final String NAME = "crmsetup";

    /** The CRM Teamspace: modules are created inside it. */
    public static final String CRM_TEAMSPACE = "5ea90671-4df5-4642-939d-49494f8e4d6e";

    public static final String LEADS = CrmOrderFeature.LEADS;
    public static final String CUSTOMERS = "6f553963-01d6-4b68-9fb3-143d23044c41";
    public static final String CUSTOMERS_LAYOUT = "92269f8a-040c-4b00-8d33-cc323391dc3b";

    public static final String OWNER = CrmOrderFeature.OWNER;
    public static final String USER_N_ID = "45ffbc5b-7859-4c21-be9e-7b5f30747ca2";    // test user 1 (skills are rated on this user)
    public static final String P_USER = "11111111-1111-1111-1111-111111111103";

    /** Test data prefix for this wave. */
    public static final String QA = System.getProperty("crm.qaPrefix", "QA W5 ");

    private CrmSetupFeature() {
    }
}
