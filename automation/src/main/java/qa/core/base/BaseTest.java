package qa.core.base;

import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import qa.core.annotations.CaseId;
import qa.core.annotations.NoAuth;
import qa.core.annotations.ZohoRef;
import qa.core.auth.AuthManager;
import qa.core.config.Config;
import qa.core.driver.DriverManager;
import qa.core.evidence.Evidence;

import java.lang.reflect.Method;

/**
 * Parent of every test class: fresh browser per test, signed in from the saved session
 * (unless @NoAuth), failure-only evidence, browser closed afterwards.
 */
public abstract class BaseTest {

    @BeforeMethod(alwaysRun = true)
    public void startBrowser(Method m) {
        WebDriver d = DriverManager.start();
        boolean noAuth = m.isAnnotationPresent(NoAuth.class) || getClass().isAnnotationPresent(NoAuth.class);
        if (!noAuth) AuthManager.signIn(d);
    }

    @AfterMethod(alwaysRun = true)
    public void stopBrowser(ITestResult r) {
        try {
            Method tm = r.getMethod().getConstructorOrMethod().getMethod();
            boolean noAuth = tm.isAnnotationPresent(NoAuth.class) || getClass().isAnnotationPresent(NoAuth.class);
            if (!noAuth && DriverManager.has()) AuthManager.persist(DriverManager.get()); // keep rotated tokens

            if (r.getStatus() == ITestResult.FAILURE && DriverManager.has()) {
                Method m = r.getMethod().getConstructorOrMethod().getMethod();
                CaseId c = m.getAnnotation(CaseId.class);
                String name = c != null ? String.join("+", c.value()) : r.getMethod().getMethodName();
                byte[] png = Evidence.screenshot(DriverManager.get(), name);
                ZohoRef z = m.getAnnotation(ZohoRef.class);
                if (z != null) {
                    String feature = featureOf(getClass());
                    Evidence.sideBySide(png, Config.projectDir().resolve("src/test/resources/features").resolve(feature).resolve(z.value()),
                            name, "FAILED", z.note());
                }
            }
        } finally {
            if (!Config.getBool("keepBrowserOpen", false)) DriverManager.quit();
        }
    }

    /** qa.features.<feature>... → <feature>. */
    protected static String featureOf(Class<?> c) {
        String p = c.getPackageName();
        int i = p.indexOf(".features.");
        if (i < 0) return "";
        String rest = p.substring(i + ".features.".length());
        int dot = rest.indexOf('.');
        return dot < 0 ? rest : rest.substring(0, dot);
    }

    protected WebDriver driver() {
        return DriverManager.get();
    }
}
