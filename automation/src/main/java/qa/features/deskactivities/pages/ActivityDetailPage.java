package qa.features.deskactivities.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskactivities.DeskActivitiesFeature;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

/**
 * Task / Call / Event detail page (/modules/{moduleId}/records/{id}): footer actions, the Reschedule dialog of a
 * call, and the Key Information values. Element keys: locators.json "ActivityDetailPage".
 */
public class ActivityDetailPage extends BasePage {

    public ActivityDetailPage() {
        super(DeskActivitiesFeature.NAME);
    }

    /** Opens the record and waits until its action buttons are drawn (staging can be slow). */
    public ActivityDetailPage open(String moduleId, String id) {
        super.open(DeskActivitiesFeature.DESK + "/modules/" + moduleId + "/records/" + id);
        long end = System.currentTimeMillis() + 60_000;
        while (System.currentTimeMillis() < end && !bodyText().contains("Key Information")) Waits.sleep(500);
        Waits.sleep(1500);
        return this;
    }

    public ActivityDetailPage press(String button) {
        click("button", button);
        Waits.sleep(2500);
        return this;
    }

    /**
     * Reschedule a call to {@code when}; {@code logMissed} ticks "The call went unanswered — log a missed call".
     * Returns the toast text shown after confirming (error or success).
     */
    public String rescheduleCall(LocalDateTime when, boolean logMissed) {
        click("button", "Reschedule");
        isShown("rescheduleDialog", 10);
        WebElement in = el("rescheduleDate");
        String v = when.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
        // React-controlled datetime-local: set through the native setter so the app sees the change
        ((JavascriptExecutor) driver).executeScript(
                "const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(arguments[0],arguments[1]);"
                        + "arguments[0].dispatchEvent(new Event('input',{bubbles:true}));arguments[0].dispatchEvent(new Event('change',{bubbles:true}));", in, v);
        WebElement cb = el("rescheduleLogMissed");
        if (cb.isSelected() != logMissed) ((JavascriptExecutor) driver).executeScript("arguments[0].click();", cb);
        click("rescheduleConfirm");

        return toasts();
    }

    /** Text of every visible toast, joined with " | ". Shared with TicketComposerPage. */
    public static final String TOAST_JS = "return [...document.querySelectorAll('[data-sonner-toast], [data-sonner-toaster] li')]"
            + ".map(e => e.textContent.replace(/\\s+/g, ' ').trim()).filter(Boolean).join(' | ');";

    public String toasts() {
        // toasts arrive a moment after the request; wait up to 20 s for one (staging is slow)
        long end = System.currentTimeMillis() + 20000;
        String t = "";
        while (t.isEmpty() && System.currentTimeMillis() < end) {
            // read the whole document: sonner renders toasts in a portal that the locator lookup does not reach
            t = String.valueOf(((JavascriptExecutor) driver).executeScript(TOAST_JS));
            if (t.isEmpty()) Waits.sleep(400);
        }
        return t;
    }

    /** Text of the Priority entry in Key Information, without the label (e.g. "Highest"). */
    public String priorityShown() {
        return text("priorityValue").replaceFirst("^Priority\\s*", "").trim();
    }

    public String text() {
        return bodyText();
    }
}
