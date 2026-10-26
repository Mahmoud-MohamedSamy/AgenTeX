package qa.features.deskticketreplies;

import qa.features.deskactivities.DeskActivitiesFeature;

/** Constants for Desk Ticket Replies (found 26 Oct 2026 on staging). Accounts and module ids are shared with deskactivities. */
public final class DeskTicketRepliesFeature {
    /** Folder name under src/test/resources/features/ and the locators.json owner. */
    public static final String NAME = "deskticketreplies";

    public static final String DESK = DeskActivitiesFeature.DESK;
    public static final String TICKETS = DeskActivitiesFeature.TICKETS;
    /** Customer address of QA tickets (user's mailbox): every real email of this feature goes only here. */
    public static final String QA_EMAIL = DeskActivitiesFeature.QA_EMAIL;
    /** Non-delivering CC / BCC / forward targets (RFC 2606 example.com). */
    public static final String CC_X = "qa.rpl.cc@example.com";
    public static final String BCC_X = "qa.rpl.bcc@example.com";
    /** An agent's address: refused as CC ("Agents follow tickets in Desk rather than by copy"). */
    public static final String AGENT_ADDRESS = "mahmoud.mmohamedsamy@gmail.com";
    public static final String QA = "QA RPL ";
    /** Department mailbox replies go out from (Customer Support). */
    public static final String FROM_MAILBOX = "customer-support@help-staging.anyware.software";

    private DeskTicketRepliesFeature() {
    }
}
