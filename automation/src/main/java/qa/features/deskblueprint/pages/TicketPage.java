package qa.features.deskblueprint.pages;

import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskblueprint.DeskBlueprintFeature;

import java.util.List;

/**
 * Ticket page (/modules/{tickets}/records/{id}, the app redirects to /views/all/tickets/{id}).
 * Element keys live in locators.json under "TicketPage".
 */
public class TicketPage extends BasePage {

    public TicketPage() {
        super(DeskBlueprintFeature.NAME);
    }

    public TicketPage openTicket(String id) {
        open("/modules/" + DeskBlueprintFeature.TICKETS + "/records/" + id);
        if (!isShown("stepsCard", 60)) { // staging: the ticket page sometimes stays on its loading skeleton; one reload fixes it
            driver.navigate().refresh();
            isShown("stepsCard", 90);
        }
        Waits.sleep(2500);
        return this;
    }

    public boolean showsSteps() {
        return isShown("stepsCard", 5);
    }

    /** True if "Close ticket" is on screen and enabled. */
    public boolean closeTicketActive() {
        if (!isShown("closeTicket", 5)) return false;
        WebElement b = el("closeTicket");
        return b.isEnabled() && !"true".equals(b.getAttribute("aria-disabled"));
    }

    public String pageText() {
        return bodyText();
    }

    /** Opens the transition form by clicking its button in the Steps card. */
    public TicketPage startTransition(String name) {
        isShown("transitionButton", 60, name); // the step button sits in the header strip and appears after the blueprint state loads
        click("transitionButton", name);
        Waits.sleep(2500);
        return this;
    }

    /** True if the transition form's Run button is enabled. */
    public boolean runEnabled() {
        List<WebElement> b = all("runButton");
        if (b.isEmpty()) return false;
        WebElement r = b.get(b.size() - 1);
        return r.isEnabled() && !"true".equals(r.getAttribute("aria-disabled"));
    }

    /** Clicks "Close ticket", confirms the "Close this ticket?" dialog if it appears, returns the page text a few seconds later. */
    public String clickCloseTicket() {
        click("closeTicket");
        Waits.sleep(2000);
        if (isShown("confirmCloseTicket", 5)) click("confirmCloseTicket");
        Waits.sleep(4000);
        return bodyText();
    }
}
