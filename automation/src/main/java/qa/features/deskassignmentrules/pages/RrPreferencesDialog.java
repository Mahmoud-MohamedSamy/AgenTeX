package qa.features.deskassignmentrules.pages;

import org.openqa.selenium.By;
import qa.core.base.BasePage;
import qa.core.base.Waits;
import qa.features.deskassignmentrules.DeskAssignmentRulesFeature;

import java.util.List;

/** Round Robin › More Round Robin actions › Preferences (one department). Nothing is saved by the UI tests (Cancel). */
public class RrPreferencesDialog extends BasePage {

    public RrPreferencesDialog() {
        super(DeskAssignmentRulesFeature.NAME);
    }

    RrPreferencesDialog waitLoaded() {
        el("agentLevelSwitch"); // "Loading assignment settings" first
        Waits.sleep(1000);
        return this;
    }

    public String text() {
        return text("dialog");
    }

    private boolean on(String key) {
        return "true".equals(el(key).getAttribute("aria-checked"));
    }

    public RrPreferencesDialog departmentThresholdOn() {
        if (!on("departmentThresholdSwitch")) click("departmentThresholdSwitch");
        el("departmentThresholdInput");
        return this;
    }

    public RrPreferencesDialog departmentThreshold(String v) {
        type("departmentThresholdInput", v);
        return this;
    }

    public RrPreferencesDialog agentLevelOn() {
        if (!on("agentLevelSwitch")) click("agentLevelSwitch");
        el("agentRowButton");
        return this;
    }

    public RrPreferencesDialog save() {
        click("saveButton");
        Waits.sleep(1500);
        return this;
    }

    public List<String> alerts() {
        return driver.findElements(By.xpath("//*[@role='dialog']//*[@role='alert']")).stream()
                .map(e -> e.getText().trim()).filter(s -> !s.isEmpty()).toList();
    }

    public void cancel() {
        click("cancelButton");
        Waits.sleep(1000);
    }
}
