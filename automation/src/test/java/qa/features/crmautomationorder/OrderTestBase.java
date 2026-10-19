package qa.features.crmautomationorder;

import org.testng.ITestResult;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;

import java.lang.reflect.Method;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * API-level base for the execution-order tests (no browser: the runtime engines are checked through the API, as a
 * second user would see them). Each subclass is one parallel session with its own tag (QA AEO <tag> …), so classes
 * running side by side never fire each other's rules.
 * Every case gets a fresh CrmApi; everything it created is removed in @AfterMethod, and the order trace of the
 * records it names via {@link #traceOf} is written to target/crm-order-traces.log for the report.
 */
public abstract class OrderTestBase {
    protected CrmApi api;
    protected final CrmUser owner() { return CrmUser.as(CrmOrderFeature.OWNER); }
    protected final CrmUser adminA() { return CrmUser.as(CrmOrderFeature.ADMIN_A); }
    protected final CrmUser adminB() { return CrmUser.as(CrmOrderFeature.ADMIN_B); }
    protected final CrmUser supervisor() { return CrmUser.as(CrmOrderFeature.SUPERVISOR); }
    protected final CrmUser userN() { return CrmUser.as(CrmOrderFeature.USER_N); }
    protected final CrmUser userV() { return CrmUser.as(CrmOrderFeature.USER_V); }

    /** Session tag, e.g. "SA" → names "QA AEO SA …". */
    protected abstract String session();

    /** Account that creates the QA processes for this session. */
    protected abstract CrmUser processAdmin();

    private String caseName;
    private final StringBuilder traces = new StringBuilder();

    /** This session's own QA layouts (module → id). Leads/Deals/Tasks each allow only one review process per layout. */
    protected final Map<String, String> layouts = new LinkedHashMap<>();

    /** Override to false in sessions that never create review processes (they use the modules' Standard layouts). */
    protected boolean ownLayouts() {
        return true;
    }

    @BeforeClass(alwaysRun = true)
    public void tag() {
        CrmOrderFeature.session(session());
        if (!ownLayouts()) return;
        layouts.put(CrmOrderFeature.LEADS, CrmApi.createQaLayout(processAdmin(), CrmOrderFeature.LEADS, CrmOrderFeature.LEADS_STANDARD, session()));
        layouts.put(CrmOrderFeature.DEALS, CrmApi.createQaLayout(processAdmin(), CrmOrderFeature.DEALS, CrmOrderFeature.DEALS_STANDARD, session()));
        layouts.put(CrmOrderFeature.TASKS, CrmApi.createQaLayout(processAdmin(), CrmOrderFeature.TASKS, CrmOrderFeature.TASKS_STANDARD, session()));
    }

    /** This session's QA layout for a module (the Standard layout when the session has none). */
    protected String layout(String module) {
        return CrmApi.defaultLayout(module);
    }

    @AfterClass(alwaysRun = true)
    public void dropLayouts() {
        layouts.forEach((m, id) -> {
            try {
                io.restassured.response.Response d = CrmApi.deleteLayout(processAdmin(), m, id);
                System.out.println("[layout] delete " + m + " " + id + " -> " + d.statusCode() + (d.statusCode() / 100 == 2 ? "" : " " + d.asString()));
            } catch (Exception e) {
                System.out.println("[layout] delete " + m + " " + id + " failed: " + e + " (run the crm-teardown group)");
            }
        });
    }

    @BeforeMethod(alwaysRun = true)
    public void fresh(Method m) {
        CrmOrderFeature.session(session());
        layouts.forEach(CrmApi::useLayout);
        api = new CrmApi(processAdmin());
        caseName = m.getName();
        traces.setLength(0);
    }

    /** Record name for this case: "QA AEO <session> <caseTag> <suffix>". */
    protected String nm(String caseTag, String suffix) {
        return CrmOrderFeature.prefix() + caseTag + (suffix == null || suffix.isEmpty() ? "" : " " + suffix);
    }

    /** Remember a record's order trace for the report (read now, before cleanup deletes it). */
    protected void traceOf(String caseTag, String module, String recordId) {
        try {
            traces.append("## ").append(caseTag).append(" ").append(CrmApi.moduleKey(module)).append(' ').append(recordId).append('\n')
                    .append(api.trace(module, recordId));
        } catch (Exception e) {
            traces.append("## ").append(caseTag).append(" trace failed: ").append(e.getMessage()).append('\n');
        }
    }

    /** A result that could not be observed is inconclusive, never a pass. */
    protected static void inconclusive(String why) {
        throw new SkipException("INCONCLUSIVE: " + why);
    }

    @AfterMethod(alwaysRun = true)
    public void cleanupAndLog(ITestResult r) {
        try {
            if (traces.length() > 0) {
                Path p = Path.of("target", "crm-order-traces.log");
                Files.createDirectories(p.getParent());
                Files.writeString(p, "\n# " + Instant.now() + " " + getClass().getSimpleName() + "." + caseName + " → "
                        + (r.isSuccess() ? "PASS" : r.getStatus() == ITestResult.SKIP ? "SKIP" : "FAIL") + "\n" + traces,
                        StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            }
        } catch (Exception e) {
            System.out.println("[trace log] " + e.getMessage());
        }
        // a network error in cleanup must not fail the configuration method (TestNG would then skip the rest of the class)
        try {
            if (api != null) api.cleanup();
        } catch (Exception e) {
            System.out.println("[cleanup] " + getClass().getSimpleName() + "." + caseName + ": " + e);
        }
    }
}
