package qa.features.crmrecords;

import qa.features.crmautomationorder.CrmOrderFeature;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Constants for the CRM go-live Wave 2 (daily record work) tests: records in the 15 modules, timeline, custom views,
 * tags, recycle bin, pipelines, import, global search and activities. Ids taken from the Wave 2 manual run on
 * staging-crm, 25-26 Oct 2026. Plan and results: executions/execu_2026-10-25_crm-golive-wave2/.
 */
public final class CrmRecordsFeature {
    /** Folder name under src/test/resources/features/. */
    public static final String NAME = "crmrecords";

    /** One CRM module: key (as used by the timeline and the bin), module id, Standard layout id, label. */
    public record CrmModule(String key, String id, String layout, String label) {
    }

    /** The 15 modules of NDC-1484 in the order of the manual run. */
    public static final Map<String, CrmModule> MODULES = new LinkedHashMap<>();

    static {
        add("leads", "841043e1-c078-41f9-8d6e-dfd61bee45c3", "bf971461-2edc-45f2-b6e4-6e180aa64288", "Leads");
        add("contacts", "6f553963-01d6-4b68-9fb3-143d23044c41", "92269f8a-040c-4b00-8d33-cc323391dc3b", "Customers");
        add("deals", "f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430", "fcba0068-d67f-44f5-8412-cdef9c09e16e", "Transactions");
        add("accounts", "b2398920-2914-4836-be53-81bd960effea", "d817ff75-2107-4114-9141-71f5efbc04cf", "Agency Code");
        add("tasks", "a9d87b62-b704-4c2e-b2d5-1b745d7c2065", "40c084f2-f062-45d5-ac70-132a7597fac0", "Tasks");
        add("calls", "e72e608a-a5d3-45cf-888a-dfadc6e8b456", "58707442-1395-4eed-a015-be8280c9b4e6", "Calls");
        add("meetings", "f13e02be-03d3-46c3-a74e-22c7770823ca", "07224366-ebdc-4b6e-97c3-7a221d197d10", "Meetings");
        add("subscriptions", "6d053261-6a93-4042-8496-19eeac878e32", "f7156bdb-3581-4ec1-ad66-68af3236793b", "Subscriptions");
        add("agency", "30aba3c3-967a-4b47-962e-b4c0771c1250", "c50b3765-4493-48d8-bd76-26ba7a97987f", "Agency");
        add("services", "eae451c0-aca2-40e9-87c5-8640e9a47325", "6412c81d-70b7-4a12-a585-baac18c13b61", "Services");
        add("dailymove", "ad7879e0-69b0-4e73-a2a7-3be6ca155285", "15e0723f-afef-47e5-95cf-38f0c8e8d7f1", "Daily Move");
        add("cases", "64d25249-e282-49a6-ad9d-c840004ede0d", "85e2cd1c-3139-436c-b06e-fbb91db46df3", "Cases");
        add("po", "8fcdd3c2-5f97-4da6-a0bb-cc566285d14c", "0f39965b-5894-4f92-9e90-c61092ddefe9", "Purchase Orders");
        add("so", "91bb42eb-2f8e-4738-b3be-ffd465aee569", "43d321df-262d-4183-ad42-13114366b464", "Sales Orders");
        add("ndcagencies", "6e0e9833-4e32-4940-ab21-683cb7bc17d2", "02c2efc5-6c56-4945-abf5-d9cb232cd066", "NDC Agencies");
    }

    private static void add(String key, String id, String layout, String label) {
        MODULES.put(key, new CrmModule(key, id, layout, label));
    }

    public static CrmModule mod(String key) {
        return MODULES.get(key);
    }

    public static final String LEADS = CrmOrderFeature.LEADS;
    public static final String LEADS_LAYOUT = CrmOrderFeature.LEADS_STANDARD;
    public static final String DEALS = CrmOrderFeature.DEALS;
    public static final String DEALS_LAYOUT = CrmOrderFeature.DEALS_STANDARD;
    public static final String TASKS = CrmOrderFeature.TASKS;
    public static final String ACCOUNTS = "b2398920-2914-4836-be53-81bd960effea";
    public static final String ACCOUNTS_LAYOUT = "d817ff75-2107-4114-9141-71f5efbc04cf";

    /** Pipelines of the Transactions Standard layout: "Standard" (default) and "1". */
    public static final String PIPELINE_STANDARD = CrmOrderFeature.DEALS_PIPELINE;
    public static final String PIPELINE_ONE = "640e03a4-9c24-4b06-8d7d-5c1db2711b9b";

    // Leads fields used by the import field-permission case (Standard layout)
    public static final String F_COMPANY = "5f6106d1-fef8-49b1-b7fe-6bb600da12cc";   // company -> read only
    public static final String F_EMAIL = "47d783ad-f9be-4e36-8c5e-e148db8801e7";     // email -> hidden

    // Accounts and profiles
    public static final String OWNER = CrmOrderFeature.OWNER;
    public static final String USER_N = CrmOrderFeature.USER_N;                      // test user 1, built-in User profile @Sales
    public static final String OWNER_ID = "97be04b6-0a08-4883-aa51-e1650b11cab7";
    public static final String N_ID = "45ffbc5b-7859-4c21-be9e-7b5f30747ca2";
    public static final String P_USER = "11111111-1111-1111-1111-111111111103";      // built-in "User"
    public static final String P_MANAGER = "11111111-1111-1111-1111-111111111102";
    public static final String OU_SALES = "60aeb9ce-e602-4e95-aaef-de3ceba25a3e";

    /** Test data prefix for this wave (names, views, tags, rules, profiles). */
    public static final String QA = "QA W2 ";

    private CrmRecordsFeature() {
    }
}
