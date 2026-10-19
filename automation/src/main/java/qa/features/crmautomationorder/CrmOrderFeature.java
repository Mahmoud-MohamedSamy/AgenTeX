package qa.features.crmautomationorder;

import qa.core.config.Config;

/**
 * TAVI CRM — Automation Execution Order (Assignment → Review → Workflow → Approval → Blueprint).
 * Spec: docs/crm-automation-execution-order/spec-crm-automation-execution-order.md. Gaps: NDC-2294.
 * Ids verified on staging-crm 18 Oct 2026 (tenant NDC-Staging).
 */
public final class CrmOrderFeature {
    private CrmOrderFeature() {
    }

    public static final String BASE = Config.get("crm.baseUrl", "https://staging-crm.taviportal.com");
    public static final String API = BASE + "/api/v1";
    /** NDC-Staging tenant (not a secret; sent as x-tenant-id on sign-in). */
    public static final String TENANT = Config.get("crm.tenantId", "a7a7a7a7-0000-0000-0000-000000000004");

    // modules
    public static final String LEADS = "841043e1-c078-41f9-8d6e-dfd61bee45c3";
    public static final String DEALS = "f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430";
    public static final String TASKS = "a9d87b62-b704-4c2e-b2d5-1b745d7c2065";

    // layouts. Every Leads layout already has a teammate's review process (one per layout), so Leads review tests use
    // the restricted QA layout created for this feature on 18 Oct 2026 (delete it at the very end of the run).
    public static final String LEADS_STANDARD = "bf971461-2edc-45f2-b6e4-6e180aa64288";
    public static final String LEADS_QA_LAYOUT = "f56991e7-692b-4c22-8a54-c5adb8a988fe";
    public static final String DEALS_STANDARD = "fcba0068-d67f-44f5-8412-cdef9c09e16e";
    public static final String DEALS_PIPELINE = "5170500c-b335-479c-96d1-ed138965c345";
    public static final String TASKS_STANDARD = "40c084f2-f062-45d5-ac70-132a7597fac0";

    // accounts (credentials.file, row picked by email)
    public static final String OWNER = "ndc-staging-owner@taviportal.com";       // Owner profile
    public static final String ADMIN_A = "mmohamed@anyware.software";           // CRM Admin
    public static final String ADMIN_B = "mahmoud.mahamed1515@gmail.com";       // CRM Admin + Desk Administrator
    public static final String SUPERVISOR = "mahmoud.mmohamedsamy@gmail.com";   // Supervisor; manager of VALAFO
    public static final String USER_N = "nameb56175@airhemp.com";               // User profile (manager: Hegazy, not ours)
    public static final String USER_V = "valafo4080@94an.com";                  // profile "test"; manager: SUPERVISOR

    /** Root of every QA name. Each parallel session adds its own tag (-Dsession=S3 → "QA AEO S3 ") so sessions never trigger each other's rules. */
    public static final String QA = "QA AEO ";

    private static final ThreadLocal<String> SESSION = ThreadLocal.withInitial(() -> Config.get("session", "S0"));

    /** "QA AEO <session> ": the session tag is set per test class (TestNG parallel="classes" keeps a class on one thread). */
    public static String prefix() {
        return QA + SESSION.get() + " ";
    }

    public static void session(String tag) {
        SESSION.set(tag);
    }

    /**
     * Field values that fire teammates' active rules and must not be used: Leads lead_status "Interested"
     * ("test last activity"), Tasks status "Completed" (ActionsOnTaskCompletionFromWorkqueue), and names containing
     * "AP" (approval "AP", case-sensitive) or "AEX-01".
     */
    public static final String AVOID_NOTE = "see CrmOrderFeature";
}
