package qa.features.crmautomationorder.pages;

import qa.core.base.Waits;

/**
 * Settings → Process Management → Blueprints: dialog (name, module, layout, field: native selects that load late) →
 * designer canvas. Clicking two "Available states" adds them and an unnamed edge; naming the transition clears the
 * "Resolve the issues" list. "Save as draft" keeps it inactive.
 */
public class BlueprintsPage extends CrmSetupPage<BlueprintsPage> {

    @Override protected String path() { return "/settings/blueprints"; }
    @Override protected String title() { return "Blueprint"; }

    public BlueprintsPage create(String name, String layout, String field, String from, String to, String transition) {
        button("New blueprint");
        fill("Blueprint name", name);
        selectWhenLoaded("Module", "Leads");
        selectWhenLoaded("Choose layout", layout);
        selectWhenLoaded("Choose field", field);
        dialogButton("Next");
        Waits.urlContains(driver, "/blueprints/", 30);
        el("button", from);
        button(from);
        button(to);
        click("button", "Create a transition");
        Waits.sleep(1000);
        fill("Transition name", transition);
        Waits.sleep(800);
        return this;
    }

    public boolean issuesShown() {
        return bodyText().contains("Resolve the issues before publishing.");
    }

    public BlueprintsPage saveDraft() {
        button("Save as draft");
        Waits.sleep(3000);
        return this;
    }

    /** Edges drawn on the canvas, by their accessible group name ("Edge from A to B"). */
    public boolean hasEdge(String from, String to) {
        return isShown("edge", 10, from, to);
    }

    /** The designer fills the Name box a moment after it opens: wait for a value. */
    public String openedName() {
        Waits.until(() -> !value("textbox", "Name").isEmpty(), 30);
        return value("textbox", "Name");
    }

    public BlueprintsPage openByName(String name) {
        click("rowCell", name);
        Waits.sleep(3000);
        return this;
    }

    public BlueprintsPage cancelEdit() {
        button("Cancel");
        leaveDraft();
        return this;
    }
}
