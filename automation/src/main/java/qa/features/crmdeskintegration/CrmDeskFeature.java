package qa.features.crmdeskintegration;

import qa.core.config.Config;

/**
 * TAVI CRM ⇄ Desk Integration (both apps share one settings object under /desk/integrations/crm).
 * Spec: docs/crm-desk-integration/spec-crm-desk-integration.md · gaps: docs/crm-desk-integration/crm-desk-integration-missing-list.md (Z1–Z9).
 * Ids verified on staging 18–19 Oct 2026 (tenant NDC-Staging).
 */
public final class CrmDeskFeature {
    private CrmDeskFeature() {
    }

    public static final String NAME = "crmdeskintegration";

    public static final String CRM = Config.get("crm.baseUrl", "https://staging-crm.taviportal.com");
    public static final String DESK = Config.get("desk.baseUrl", "https://staging-desk.taviportal.com");
    /** NDC-Staging tenant (not a secret; sent as x-tenant-id on sign-in). */
    public static final String TENANT = Config.get("crm.tenantId", "a7a7a7a7-0000-0000-0000-000000000004");

    /** API base of the integration, relative to /api/v1 of either app. */
    public static final String INT = "/desk/integrations/crm";

    // settings pages
    public static final String CRM_SETTINGS = "/settings/integrations/desk";
    public static final String DESK_SETTINGS = "/settings/integrations/crm";

    // modules
    public static final String DESK_TICKETS = "88e8ea44-1658-4df3-9930-d0902b91073d";
    public static final String DESK_CONTACTS = "43004ce2-577f-4eda-b00a-0750fe40c3d4";
    public static final String CRM_CONTACTS = "6f553963-01d6-4b68-9fb3-143d23044c41";

    /** Linked pair used by read rows (do not edit): Desk contact ↔ CRM contact "Mahmoud MohamedSamy", tickets #298 / #299. */
    public static final String DESK_CONTACT = "30ff06b1-a2c9-4332-a29a-ff06dd77e794";
    public static final String CRM_CONTACT = "ed5116a8-48cc-4470-b4b6-82720f9ca70d";
    public static final String TICKET_298 = "871b4b07-10d6-42cf-ab51-7e9876aff370";

    // accounts: owner from docs/Credentials/Microsoft Edge Passwords.csv, the agent from automation/.auth/extra-credentials.csv (gitignored)
    public static final String OWNER = "ndc-staging-owner@taviportal.com";
    /** Desk agent without desk:integration:* (given by the user 19 Oct 2026). */
    public static final String AGENT = "fedelav803@meinvr.com";

    /** Prefix for every record a write run creates. */
    public static final String QA = "QA CD ";
}
