package qa.features.deskworkflowrules.pages;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskworkflowrules.DeskWorkflowRulesFeature;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Workflow rule editor (canvas WHEN → CONDITION → ACTION) at /workflow-rules/new?moduleId=… or /workflow-rules/{id}.
 * Element keys live in src/test/resources/features/deskworkflowrules/locators.json under "RuleEditorPage".
 */
public class RuleEditorPage extends BasePage {

    public RuleEditorPage() {
        super(DeskWorkflowRulesFeature.NAME);
    }

    /** New rule for a module, without a restored draft (drafts survive "Discard" — see feature-map traps). */
    public RuleEditorPage openNew(String moduleId) {
        open(DeskWorkflowRulesFeature.LIST_PATH);
        clearDrafts();
        open(DeskWorkflowRulesFeature.NEW_RULE_PATH + moduleId);
        Waits.until(() -> isShown("whenCard", 1) || isShown("resumeDraftPrompt", 1), 60);
        if (isShown("startFreshButton", 1)) click("startFreshButton");
        el("whenCard");
        return this;
    }

    public void clearDrafts() {
        ((JavascriptExecutor) driver).executeScript(
                "for (const k of Object.keys(localStorage)) if (k.startsWith(arguments[0])) localStorage.removeItem(k);",
                DeskWorkflowRulesFeature.DRAFT_KEY_PREFIX);
    }

    public RuleEditorPage setLayout(String layout) {
        click("layoutButton");
        click("option", layout);
        return this;
    }

    public RuleEditorPage setName(String name) {
        click("editNameButton");
        typeAndEnter("nameInput", name);
        return this;
    }

    // ---------- WHEN ----------
    public RuleEditorPage openWhen() {
        click("whenCard");
        el("executeBasedOnGroup");
        return this;
    }

    /** Text of the "Execute based on" group: lists every record-action trigger the build offers. */
    public String triggerPanelText() {
        return text("executeBasedOnGroup");
    }

    public RuleEditorPage chooseTrigger(String trigger) {
        click("triggerButton", trigger);
        return this;
    }

    public RuleEditorPage chooseDateTimeTrigger() {
        click("dateTimeTrigger");
        return this;
    }

    /** Date-Time trigger: picks the record date field the offset is counted from (required). */
    public RuleEditorPage dateField(String field) {
        click("dateFieldButton");
        click("option", field);
        return this;
    }

    /** Field Changed › Watch field: true when the list lets you pick several fields. */
    public boolean watchFieldAllowsSeveral() {
        click("watchFieldButton");
        WebElement lb = el("openListbox");
        boolean multi = "true".equals(lb.getAttribute("aria-multiselectable"))
                || !lb.findElements(org.openqa.selenium.By.cssSelector("[role=checkbox], input[type=checkbox]")).isEmpty();
        press(Keys.ESCAPE);
        return multi;
    }

    public RuleEditorPage watchField(String field) {
        click("watchFieldButton");
        click("option", field);
        return this;
    }

    public RuleEditorPage done() {
        click("doneButton");
        return this;
    }

    // ---------- CONDITION ----------
    /** "<Module> matching certain conditions" with one condition: field + operator + pick-list values. */
    public RuleEditorPage addPickListCondition(String field, String operator, String... values) {
        if (isShown("editConditionsButton", 2)) click("editConditionsButton");
        click("matchingConditionsRadio");
        if (!isShown("selectFieldButton", 2)) click("addConditionButton");
        click("selectFieldButton");
        click("option", field);
        click("operatorButton");
        click("option", operator);
        for (String v : values) click("valueChip", v);
        if (isShown("doneButton", 1)) click("doneButton");
        return this;
    }

    // ---------- ACTION ----------
    public RuleEditorPage openActionPicker() {
        click("addActionButton");
        return this;
    }

    /** Titles of the action types offered by the open picker (first line of each card). */
    public List<String> actionTypesOffered() {
        Waits.sleep(500);
        return driver.findElements(org.openqa.selenium.By.tagName("button")).stream()
                .map(b -> {
                    try {
                        return b.getText();
                    } catch (Exception e) {
                        return "";
                    }
                })
                .filter(t -> t.contains("\n"))
                .map(t -> t.split("\n")[0].trim())
                .distinct()
                .collect(Collectors.toList());
    }

    public RuleEditorPage addAction(String type) {
        openActionPicker();
        click("actionType", type);
        return this;
    }

    public RuleEditorPage fieldUpdate(String field, String value) {
        click("addFieldButton");
        click("selectFieldButton");
        click("option", field);
        type("fieldUpdateValue", value, field);
        return this;
    }

    /** Task action: fills the required title. */
    public RuleEditorPage taskTitle(String title) {
        type("taskTitle", title);
        return this;
    }

    /** Owner Assignment › Roles: the roles offered in the picker. */
    public List<String> ownerAssignmentRoles() {
        click("ownerRolesTab");
        click("ownerRoleSelect");
        Waits.sleep(1000);
        List<String> roles = all("openOptions").stream().map(WebElement::getText).map(String::trim)
                .filter(s -> !s.isEmpty()).collect(Collectors.toList());
        press(Keys.ESCAPE);
        return roles;
    }

    /** Clicks Save & Activate and returns the toast texts that appear. */
    public String saveAndActivate() {
        click("saveAndActivateButton");
        Waits.until(() -> !all("toasts").isEmpty(), 15);
        Waits.sleep(1500);
        return all("toasts").stream().map(WebElement::getText).collect(Collectors.joining(" | "));
    }

    public String currentUrl() {
        return driver.getCurrentUrl();
    }

    /** Opens a saved rule in the editor. */
    public RuleEditorPage openRule(String ruleId) {
        open(DeskWorkflowRulesFeature.LIST_PATH);
        clearDrafts();
        open(DeskWorkflowRulesFeature.LIST_PATH + "/" + ruleId);
        el("whenCard");
        return this;
    }

    /** Visible text of the editor (validation lists, warnings, hints). */
    public String pageText() {
        return bodyText();
    }

    /** Clicks Save and returns the page text a moment later (validation list or toast). */
    public String clickSave() {
        click("saveButton");
        Waits.sleep(2500);
        String toasts = all("toasts").stream().map(WebElement::getText).collect(Collectors.joining(" | "));
        return bodyText() + "\n[toasts] " + toasts;
    }

    /** Field names offered by the condition field picker (opens it on a fresh condition, then Escape). */
    public List<String> conditionFieldsOffered() {
        if (isShown("editConditionsButton", 2)) click("editConditionsButton");
        click("matchingConditionsRadio");
        if (!isShown("selectFieldButton", 2)) click("addConditionButton");
        click("selectFieldButton");
        Waits.sleep(800);
        List<String> out = all("openOptions").stream().map(WebElement::getText).map(String::trim).filter(s -> !s.isEmpty()).toList();
        press(Keys.ESCAPE);
        return out;
    }

    /** Opens the scheduled-action picker. */
    public RuleEditorPage openScheduledPicker() {
        click("addScheduledActionButton");
        return this;
    }

    public RuleEditorPage closePicker() {
        if (isShown("closePickerButton", 2)) click("closePickerButton");
        return this;
    }
}
