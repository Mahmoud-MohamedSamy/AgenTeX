package qa.core.listeners;

import io.qameta.allure.listener.TestLifecycleListener;
import io.qameta.allure.model.Label;
import io.qameta.allure.model.TestResult;
import io.qameta.allure.util.ResultsUtils;

import java.util.List;

/**
 * Adds case ids and groups as Allure tags, and bug-id groups (NDC-2205) as issue links.
 * Runs as an Allure lifecycle hook (registered in META-INF/services) because TestNG's onTestStart
 * fires before Allure has opened the test case ("Could not update test case: no test case running").
 */
public class AllureTags implements TestLifecycleListener {
    private static final ThreadLocal<List<List<String>>> PENDING = new ThreadLocal<>();

    static void set(List<String> caseIds, List<String> groups) {
        PENDING.set(List.of(caseIds, groups));
    }

    @Override
    public void beforeTestStop(TestResult result) {
        List<List<String>> p = PENDING.get();
        if (p == null) return;
        PENDING.remove();
        for (String id : p.get(0)) result.getLabels().add(new Label().setName("tag").setValue(id));
        for (String g : p.get(1)) {
            result.getLabels().add(new Label().setName("tag").setValue(g));
            if (g.matches("[A-Z]+-\\d+")) result.getLinks().add(ResultsUtils.createIssueLink(g));
        }
    }
}
