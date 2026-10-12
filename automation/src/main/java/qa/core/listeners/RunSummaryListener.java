package qa.core.listeners;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.testng.ISuite;
import org.testng.ISuiteListener;
import org.testng.ITestListener;
import org.testng.ITestResult;
import qa.core.annotations.CaseId;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Writes target/run-summary.json (one row per test: case ids, groups, status, first line of the
 * failure) — the file Claude reads after a run to write the report and update feature-map.md.
 * Also hands case ids and groups to {@link AllureTags} for the Allure report.
 */
public class RunSummaryListener implements ITestListener, ISuiteListener {
    private static final List<Map<String, Object>> ROWS = new ArrayList<>();

    @Override
    public void onTestStart(ITestResult r) {
        TestContext.set(r.getTestClass().getRealClass().getSimpleName() + "." + r.getMethod().getMethodName());
        CaseId c = caseId(r);
        AllureTags.set(c == null ? List.of() : Arrays.asList(c.value()), Arrays.asList(r.getMethod().getGroups()));
    }

    @Override
    public void onTestSuccess(ITestResult r) {
        add(r, "PASSED");
    }

    @Override
    public void onTestFailure(ITestResult r) {
        add(r, "FAILED");
    }

    @Override
    public void onTestSkipped(ITestResult r) {
        add(r, "SKIPPED");
    }

    @Override
    public void onFinish(ISuite suite) {
        try {
            Path f = Config.projectDir().resolve("target/run-summary.json");
            Files.createDirectories(f.getParent());
            Files.writeString(f, new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT).writeValueAsString(ROWS));
            Path env = Config.projectDir().resolve("target/allure-results/environment.properties");
            Files.createDirectories(env.getParent());
            Files.writeString(env, "base.url=" + Config.get("base.url", "") + "\nbrowser=" + Config.get("browser", "edge") + "\n");
        } catch (Exception e) {
            System.err.println("[summary] " + e.getMessage());
        }
    }

    private static synchronized void add(ITestResult r, String status) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("test", r.getTestClass().getRealClass().getSimpleName() + "." + r.getMethod().getMethodName());
        CaseId c = caseId(r);
        m.put("cases", c == null ? List.of() : Arrays.asList(c.value()));
        m.put("groups", Arrays.asList(r.getMethod().getGroups()));
        m.put("description", r.getMethod().getDescription());
        m.put("status", status);
        m.put("seconds", (r.getEndMillis() - r.getStartMillis()) / 1000.0);
        if (r.getThrowable() != null) {
            String msg = String.valueOf(r.getThrowable().getMessage());
            m.put("error", msg.length() > 600 ? msg.substring(0, 600) : msg);
        }
        ROWS.add(m);
    }

    private static CaseId caseId(ITestResult r) {
        return r.getMethod().getConstructorOrMethod().getMethod().getAnnotation(CaseId.class);
    }
}
