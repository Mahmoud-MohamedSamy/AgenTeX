package qa.features.crmhierarchy;

import qa.features.crmautomationorder.CrmOrderFeature;

/**
 * Constants shared by the CRM Hierarchy Preference pages, API helper and tests (explored 21 Oct 2026, staging-crm).
 * Ids come from the baseline docs/crm-hierarchy-preference/reference/tavi-baseline-2026-10-21.json.
 */
public final class CrmHierarchyFeature {
    /** Folder name under src/test/resources/features/ and the locators.json owner. */
    public static final String NAME = "crmhierarchy";

    public static final String BASE = CrmOrderFeature.BASE;
    public static final String PAGE = "/settings/company/hierarchy-preference";
    public static final String PERSONAL = "/settings/personal/reporting-hierarchy";
    public static final String USERS = "/settings/general/users";

    /** The setting: app general, scope Org, value role | reporting (value_json is a JSON string). */
    public static final String KEY = "general.company.hierarchy.preference";
    public static final String RESOLVED = "/settings/resolved?app_key=general&key=" + KEY + "&scope_type=Org";
    public static final String HISTORY = "/settings/history?app_key=general&key=" + KEY + "&scope_type=Org&limit=10";

    public static final String LEADS = CrmOrderFeature.LEADS;              // record visibility: hierarchy
    public static final String LEADS_LAYOUT = CrmOrderFeature.LEADS_STANDARD;

    // Accounts (Edge CSV). V and N have no records.view_all only with the profiles set by the tests:
    // the "test" profile and the Desk Administrator profile both grant metadata.records.view_all (bypasses the hierarchy).
    public static final String OWNER = CrmOrderFeature.OWNER;
    public static final String USER_V = CrmOrderFeature.USER_V;            // valafo4080, "test user 2", baseline profile test @HR
    public static final String USER_N = CrmOrderFeature.USER_N;            // nameb56175, "test user 1", User @Sales
    public static final String V_ID = "51666421-12cb-426e-b91e-3003a2a1f923";
    public static final String N_ID = "45ffbc5b-7859-4c21-be9e-7b5f30747ca2";
    public static final String N_DISPLAY = "test user 1";

    // CRM profiles (rank) and org units
    public static final String P_TEST = "64d4aae0-9abd-486b-bc03-d04e22d87160";        // 100, has records.view_all
    public static final String P_USER = "11111111-1111-1111-1111-111111111103";        // 100, parent Manager
    public static final String P_SUPERVISOR = "11111111-1111-1111-1111-111111111104";  // 300, parent Manager
    public static final String P_MANAGER = "11111111-1111-1111-1111-111111111102";     // 500, parent CRM Admin
    public static final String OU_HR = "5533f730-cd59-4432-970b-86090192787d";
    public static final String OU_SALES = "60aeb9ce-e602-4e95-aaef-de3ceba25a3e";

    /** Test data prefix (spec §1.2). */
    public static final String QA = "QA HP ";

    private CrmHierarchyFeature() {
    }
}
