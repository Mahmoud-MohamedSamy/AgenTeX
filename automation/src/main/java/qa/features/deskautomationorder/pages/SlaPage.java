package qa.features.deskautomationorder.pages;

import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskautomationorder.DeskAutomationOrderFeature;

/**
 * SLA Policies screens. Keys in features/deskautomationorder/locators.json under "SlaPage".
 */
public class SlaPage extends BasePage {
    public static final String PATH = "/settings/automation/sla";

    public SlaPage() {
        super(DeskAutomationOrderFeature.NAME);
    }

    public SlaPage openList(String department) {
        open(PATH + "?department=" + department);
        isShown("newSla", 60);
        Waits.sleep(1500);
        return this;
    }

    public SlaPage openPath(String path) {
        open(path);
        Waits.sleep(4000);
        return this;
    }

    public boolean bodyHas(String text) {
        return bodyText().toLowerCase().contains(text.toLowerCase());
    }

    public SlaPage activeTab() {
        click("activeTab");
        Waits.sleep(800);
        return this;
    }

    public SlaPage inactiveTab() {
        click("inactiveTab");
        Waits.sleep(800);
        return this;
    }

    public SlaPage newSla() {
        click("newSla");
        isShown("nameInput", 30);
        return this;
    }

    public SlaPage typeName(String name) {
        type("nameInput", name);
        return this;
    }

    public SlaPage chooseCreate() {
        click("triggerCreate");
        return this;
    }

    public SlaPage next() {
        click("nextStep");
        Waits.sleep(1000);
        return this;
    }

    public SlaPage addTarget() {
        click("addTarget");
        Waits.sleep(1000);
        return this;
    }

    public SlaPage rowMenu(String policyName) {
        click("rowMenu", policyName);
        Waits.sleep(600);
        return this;
    }

    public SlaPage menuItem(String label) {
        click("menuItem", label);
        Waits.sleep(1200);
        return this;
    }
}
