package qa.features.deskactivities;

import qa.features.crmdeskintegration.CrmDeskFeature;

/** Constants shared by the Desk Activity Life Cycle pages, API helper and tests (found 26 Oct 2026 on staging). */
public final class DeskActivitiesFeature {
    /** Folder name under src/test/resources/features/ and the locators.json owner. */
    public static final String NAME = "deskactivities";

    public static final String DESK = CrmDeskFeature.DESK;
    /** QA runner: Desk Agent in Customer Support (has a mailbox). */
    public static final String AGENT = CrmDeskFeature.AGENT;
    /** Desk Admin in HR / Marketing / Sales only (no Customer Support access). */
    public static final String OTHER_DEPT_ADMIN = "mahmoud.mmohamedsamy@gmail.com";

    public static final String TICKETS = "88e8ea44-1658-4df3-9930-d0902b91073d";
    public static final String TASKS = "d120a6c2-2596-4254-968b-a1bcd3a000bf";
    public static final String CALLS = "f7e488b5-0232-42fd-811c-1f24356af653";
    public static final String EVENTS = "6fb19115-9356-40f0-b064-840d8f1fad93";
    public static final String CUSTOMER_SUPPORT = "7e1ac409-58b0-41ab-97e1-0e7d5c8c5158";

    /** The only customer address QA tickets may use (user's mailbox, approved 26 Oct 2026). */
    public static final String QA_EMAIL = "mmohamed@anyware.software";
    /** Prefix of every activity subject this feature creates. */
    public static final String QA = "QA ACT ";

    private DeskActivitiesFeature() {
    }
}
