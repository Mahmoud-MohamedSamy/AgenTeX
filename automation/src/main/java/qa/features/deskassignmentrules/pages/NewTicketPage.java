package qa.features.deskassignmentrules.pages;

import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.DeskAssignmentRulesFeature;

/** Header › New Ticket form (nothing is saved). */
public class NewTicketPage extends BasePage {

    public NewTicketPage() {
        super(DeskAssignmentRulesFeature.NAME);
    }

    public NewTicketPage open() {
        open(DeskAssignmentRulesFeature.NEW_TICKET_PATH);
        el("ownerField");
        Waits.sleep(2000);
        return this;
    }

    /** Text of the Ticket Owner field area (label + current value). */
    public String ownerText() {
        return text("ownerField");
    }
}
