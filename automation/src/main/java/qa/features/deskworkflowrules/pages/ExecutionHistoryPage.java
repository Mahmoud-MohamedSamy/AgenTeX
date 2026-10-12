package qa.features.deskworkflowrules.pages;

import org.openqa.selenium.WebElement;
import qa.core.base.BasePage;
import qa.features.deskworkflowrules.DeskWorkflowRulesFeature;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Execution History (/settings/workflow-executions) — no menu entry links to it, open it by URL.
 * Element keys live in src/test/resources/features/deskworkflowrules/locators.json under "ExecutionHistoryPage".
 */
public class ExecutionHistoryPage extends BasePage {

    public ExecutionHistoryPage() {
        super(DeskWorkflowRulesFeature.NAME);
    }

    public ExecutionHistoryPage open() {
        open(DeskWorkflowRulesFeature.EXECUTIONS_PATH);
        return this;
    }

    public List<String> rowTexts() {
        return all("rows").stream().map(WebElement::getText).collect(Collectors.toList());
    }
}
