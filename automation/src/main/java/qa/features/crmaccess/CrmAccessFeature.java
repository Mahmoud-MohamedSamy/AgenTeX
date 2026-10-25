package qa.features.crmaccess;

import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmhierarchy.CrmHierarchyFeature;

/**
 * Constants for the CRM go-live Wave 1 (access and security) tests: field permissions, audit log, login history and
 * sessions, users and profiles, teamspace access. Explored 25 Oct 2026 on staging-crm (bundle + read-only API).
 * Plan and results: executions/execu_2026-10-25_crm-golive-wave1/.
 */
public final class CrmAccessFeature {
    /** Folder name under src/test/resources/features/. */
    public static final String NAME = "crmaccess";

    public static final String LEADS = CrmOrderFeature.LEADS;
    public static final String LEADS_LAYOUT = CrmOrderFeature.LEADS_STANDARD;

    // Leads fields on the Standard layout used by the field-permission rows (optional, not unique)
    public static final String F_COMPANY = "5f6106d1-fef8-49b1-b7fe-6bb600da12cc";   // company, single_line -> hidden
    public static final String F_COMMENT = "714da2fe-530b-4c35-bda1-fbf68d80e81c";   // lead_status_comment, multi_line -> read only
    public static final String K_COMPANY = "company";
    public static final String K_COMMENT = "lead_status_comment";
    public static final String K_EMAIL = "email";                                    // read and write: the control field

    // Accounts (Edge password export)
    public static final String OWNER = CrmOrderFeature.OWNER;
    public static final String ADMIN_A = CrmOrderFeature.ADMIN_A;        // CRM Admin
    public static final String SUPERVISOR = CrmOrderFeature.SUPERVISOR;  // Supervisor (+ Desk Administrator)
    public static final String USER_N = CrmOrderFeature.USER_N;          // test user 1, User @Sales
    public static final String USER_V = CrmOrderFeature.USER_V;          // test user 2, "test" @HR
    public static final String N_ID = CrmHierarchyFeature.N_ID;
    public static final String V_ID = CrmHierarchyFeature.V_ID;
    public static final String OWNER_ID = "97be04b6-0a08-4883-aa51-e1650b11cab7";

    public static final String P_USER = CrmHierarchyFeature.P_USER;
    public static final String P_MANAGER = CrmHierarchyFeature.P_MANAGER;
    public static final String OU_SALES = CrmHierarchyFeature.OU_SALES;

    // Login history permissions (bundle, login-history page)
    public static final String LH_VIEW_SELF = "iam.security.loginhistory.view_self";
    public static final String LH_VIEW_TEAM = "iam.security.loginhistory.view_team";
    public static final String LH_VIEW_ALL = "iam.security.loginhistory.view_all";

    /** Test data prefix for this wave. */
    public static final String QA = "QA W1 ";

    private CrmAccessFeature() {
    }
}
