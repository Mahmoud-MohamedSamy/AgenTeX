package qa.features.deskassignmentrules.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.DeskAssignmentRulesFeature;

import java.util.List;

/** New / edit Direct Assignment or Round Robin rule dialog (one target is enough for the UI checks). */
public class RuleFormDialog extends BasePage {

    public RuleFormDialog() {
        super(DeskAssignmentRulesFeature.NAME);
    }

    RuleFormDialog waitOpen() {
        el("dialog");
        el("nameInput");
        Waits.sleep(800);
        return this;
    }

    public String text() {
        return text("dialog");
    }

    public RuleFormDialog name(String name) {
        type("nameInput", name);
        return this;
    }

    public String nameValue() {
        return value("nameInput");
    }

    public RuleFormDialog description(String d) {
        type("descriptionInput", d);
        return this;
    }

    public boolean activeOn() {
        return "true".equals(el("activeSwitch").getAttribute("aria-checked"));
    }

    public RuleFormDialog toggleActive() {
        click("activeSwitch");
        return this;
    }

    public boolean createChecked() {
        return checked("executeCheckbox", "Ticket Create");
    }

    public boolean updateChecked() {
        return checked("executeCheckbox", "Ticket Update");
    }

    private boolean checked(String key, String arg) {
        WebElement e = el(key, arg);
        String a = e.getAttribute("aria-checked");
        return a != null ? "true".equals(a) : e.isSelected();
    }

    public RuleFormDialog save() {
        click("saveButton");
        Waits.sleep(1500);
        return this;
    }

    public void cancel() {
        click("cancelButton");
        Waits.sleep(1000);
    }

    /** Alert texts shown in the dialog (validation messages). */
    public List<String> alerts() {
        return driver.findElements(By.xpath("//*[@role='dialog']//*[@role='alert']")).stream()
                .map(e -> e.getText().trim()).filter(s -> !s.isEmpty()).toList();
    }

    /** Add Target (the rule name must be filled first, the form validates it). */
    public RuleFormDialog addTarget() {
        if (nameValue() == null || nameValue().isEmpty()) name(DeskAssignmentRulesFeature.PREFIX + "UI probe");
        click("addTargetButton");
        el("targetGroup", "1");
        Waits.sleep(800);
        return this;
    }

    public String targetText() {
        return text("targetGroup", "1");
    }

    /** Opens a pick list button, returns the visible options and closes it again. */
    private List<String> options(String key) {
        click(key);
        Waits.sleep(1000);
        List<String> o = driver.findElements(By.cssSelector("[role=option]")).stream().filter(WebElement::isDisplayed)
                .map(e -> e.getText().trim()).filter(s -> !s.isEmpty()).toList();
        press(Keys.ESCAPE);
        Waits.sleep(600);
        return o;
    }

    private void pick(String key, String option) {
        click(key);
        Waits.sleep(800);
        click("option", option);
        Waits.sleep(1200);
    }

    public List<String> comingToOptions() {
        return options("comingToButton");
    }

    public List<String> moveToOptions() {
        return options("moveToButton");
    }

    public RuleFormDialog comingTo(String dept) {
        pick("comingToButton", dept);
        return this;
    }

    public RuleFormDialog moveTo(String dept) {
        pick("moveToButton", dept);
        return this;
    }

    public List<String> agentOptions() {
        return options("agentButton");
    }

    public RuleFormDialog agent(String name) {
        pick("agentButton", name);
        return this;
    }

    public String agentButtonText() {
        return text("agentButton");
    }

    public boolean assignKindOffered(String kind) {
        return isShown("assignRadio", 3, kind);
    }

    public RuleFormDialog assignKind(String kind) {
        click("assignRadio", kind);
        Waits.sleep(1000);
        return this;
    }

    /** Options of the team picker (Teams chosen). */
    public List<String> teamOptions() {
        return options("teamButton");
    }

    public RuleFormDialog markUnassigned() {
        click("markUnassignedButton");
        Waits.sleep(800);
        return this;
    }

    public boolean markUnassignedEnabled() {
        return el("markUnassignedButton").isEnabled();
    }

    public RuleFormDialog method(String label) {
        click("methodRadio", label);
        return this;
    }

    /** Helper texts of the three round robin types, as shown under "Round robin type". */
    public String methodGroupText() {
        return text("methodGroup");
    }

    public int numberInputs() {
        return driver.findElements(By.xpath("//*[@role='dialog']//input[@type='number'] | //*[@role='dialog']//*[@role='spinbutton']")).size();
    }
}
