package qa.features.crmchannels;

import qa.features.crmautomationorder.CrmOrderFeature;

/**
 * Constants for the CRM go-live Wave 4 (email, channels and reminders) tests: email connections, drafts and templates,
 * web forms, customer portals, SMS, telephony and notifications. Shapes recorded from the screens on staging-crm,
 * 26 Oct 2026. Plan and results: executions/execu_2026-10-26_crm-golive-waves3-5/wave4/.
 */
public final class CrmChannelsFeature {
    /** Folder name under src/test/resources/features/. */
    public static final String NAME = "crmchannels";

    public static final String BASE = CrmOrderFeature.BASE;
    public static final String LEADS = CrmOrderFeature.LEADS;
    public static final String LEADS_LAYOUT = CrmOrderFeature.LEADS_STANDARD;

    public static final String OWNER = CrmOrderFeature.OWNER;
    public static final String USER_N = CrmOrderFeature.USER_N;            // test user 1, built-in User profile
    public static final String OWNER_ID = "97be04b6-0a08-4883-aa51-e1650b11cab7";

    /** The only addresses the user allowed for outbound mail and web-form submissions (Gate 1, 26 Oct 2026). */
    public static final String MAIL_TO = "mahmoud.mmohamedsamy@gmail.com";
    public static final String MAIL_TO_2 = "mmohamed@anyware.software";

    /** Test data prefix for this wave. */
    public static final String QA = "QA W4 ";

    private CrmChannelsFeature() {
    }
}
