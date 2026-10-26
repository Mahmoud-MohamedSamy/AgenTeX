package qa.features.deskticketreplies.pages;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskticketreplies.DeskTicketRepliesFeature;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Ticket page reply composer (/modules/{tickets}/records/{id}) and the side panel's "Copied addresses".
 * Element keys: locators.json "TicketComposerPage". The composer keeps its draft in localStorage
 * ("desk.composer.draft:&lt;user&gt;:&lt;ticket&gt;"); {@link #openTicket} clears it so a run starts clean.
 */
public class TicketComposerPage extends BasePage {

    public TicketComposerPage() {
        super(DeskTicketRepliesFeature.NAME);
    }

    public TicketComposerPage openTicket(String ticketId) {
        String url = DeskTicketRepliesFeature.DESK + "/modules/" + DeskTicketRepliesFeature.TICKETS + "/records/" + ticketId;
        super.open(url);
        waitFor("CONVERSATION", 60);
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
                "for (const k of Object.keys(localStorage)) if (k.startsWith('desk.composer.draft:') && k.endsWith(arguments[0])) localStorage.removeItem(k);", ticketId);
        driver.navigate().refresh();
        waitFor("CONVERSATION", 60);
        Waits.sleep(1500);
        return this;
    }

    private void waitFor(String text, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end && !bodyText().contains(text)) Waits.sleep(500);
    }

    public TicketComposerPage addTicketCc(String email) {
        type("ticketCcInput", email);
        click("button", "Add");
        Waits.sleep(2500);
        return this;
    }

    public TicketComposerPage openReplyAll() {
        click("replyAll");
        isShown("body", 20);
        Waits.sleep(1500);
        return this;
    }

    /** Addresses on the recipient chips (To + Cc + Bcc). */
    public List<String> recipients() {
        return all("chip").stream().map(e -> e.getAttribute("aria-label").replaceFirst("^Remove ", ""))
                .filter(s -> s.contains("@")).collect(Collectors.toList());
    }

    public TicketComposerPage typeBody(String text) {
        WebElement b = el("body");
        b.click();
        b.sendKeys(Keys.chord(Keys.CONTROL, Keys.HOME));
        b.sendKeys(text);
        Waits.sleep(800);
        return this;
    }

    public boolean sendEnabled() {
        return el("button", "Send").isEnabled() && el("moreSendOptions").isEnabled();
    }

    public TicketComposerPage saveDraft() {
        click("button", "Save draft");
        Waits.sleep(3000);
        return this;
    }

    public TicketComposerPage sendWith(String option) {
        click("moreSendOptions");
        Waits.sleep(1000);
        click("menuItem", option);
        Waits.sleep(5000);
        return this;
    }

    public String toasts() {
        // toasts arrive a moment after the request; wait up to 20 s for one (staging is slow)
        long end = System.currentTimeMillis() + 20000;
        String t = "";
        while (t.isEmpty() && System.currentTimeMillis() < end) {
            t = String.valueOf(((org.openqa.selenium.JavascriptExecutor) driver).executeScript(qa.features.deskactivities.pages.ActivityDetailPage.TOAST_JS));
            if (t.isEmpty()) Waits.sleep(400);
        }
        return t;
    }

    /** Since build index-7qe5X0Gd (26 Oct 2026) the ticket CC shows as "Also copied on this ticket: x" with a "Leave x off this reply" button. */
    public boolean ticketCcShownOnReply(String email) {
        return bodyText().contains("Also copied on this ticket") && !driver.findElements(
                org.openqa.selenium.By.cssSelector("button[aria-label='Leave " + email + " off this reply']")).isEmpty();
    }

    public boolean bodyTextContains(String text) {
        return bodyText().contains(text);
    }
}
