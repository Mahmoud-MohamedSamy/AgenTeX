package qa.features.deskworkflowrules.pages;

import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskworkflowrules.DeskWorkflowRulesFeature;

/**
 * Setup › Automation › Actions (saved-action library) at /settings/automation/actions.
 * Element keys live in locators.json under "ActionsLibraryPage".
 */
public class ActionsLibraryPage extends BasePage {

    public ActionsLibraryPage() {
        super(DeskWorkflowRulesFeature.NAME);
    }

    public ActionsLibraryPage open() {
        open(DeskWorkflowRulesFeature.SETTINGS_ACTIONS_PATH);
        el("newActionButton");
        return this;
    }

    public String pageText() {
        return bodyText();
    }

    /** Opens New Action and returns the text of the type-picker dialog (closed again with Escape). */
    public String newActionDialogText() {
        click("newActionButton");
        String t = el("dialog").getText();
        press(org.openqa.selenium.Keys.ESCAPE);
        Waits.sleep(500);
        return t;
    }
}
