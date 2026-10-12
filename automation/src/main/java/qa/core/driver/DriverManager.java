package qa.core.driver;

import org.openqa.selenium.WebDriver;

/** One browser per test thread, so parallel="methods|classes" suites are safe. */
public final class DriverManager {
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverManager() {
    }

    public static WebDriver get() {
        WebDriver d = DRIVER.get();
        if (d == null) throw new IllegalStateException("No browser for this thread — does the test extend BaseTest?");
        return d;
    }

    public static boolean has() {
        return DRIVER.get() != null;
    }

    public static WebDriver start() {
        quit();
        WebDriver d = DriverFactory.create();
        DRIVER.set(d);
        return d;
    }

    public static void quit() {
        WebDriver d = DRIVER.get();
        if (d != null) {
            try {
                d.quit();
            } catch (Exception ignored) {
            }
            DRIVER.remove();
        }
    }
}
