package qa.core.driver;

import org.openqa.selenium.PageLoadStrategy;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.chromium.ChromiumOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import qa.core.config.Config;

import java.time.Duration;

/**
 * Creates browsers. Drivers are resolved by Selenium Manager (bundled with Selenium 4),
 * so no driver binaries or WebDriverManager are needed.
 */
public final class DriverFactory {
    private DriverFactory() {
    }

    // Tests drive the browser over W3C WebDriver only; silence CDP version-mismatch warnings.
    // Held in fields: java.util.logging keeps loggers weakly, so a level set on a temporary is lost after GC.
    private static final java.util.logging.Logger[] QUIET = {
            java.util.logging.Logger.getLogger("org.openqa.selenium.devtools"),
            java.util.logging.Logger.getLogger("org.openqa.selenium.chromium")};

    static {
        for (java.util.logging.Logger l : QUIET) l.setLevel(java.util.logging.Level.SEVERE);
    }

    public static WebDriver create() {
        String browser = Config.get("browser", "edge").toLowerCase();
        boolean headless = Config.getBool("headless", false);
        String size = Config.get("window.size", "1600,900");
        String ua = Config.get("browser.userAgent", "");
        // eager = return once the DOM is parsed. Single-page apps keep loading assets/fonts long after the
        // form is usable, and one slow asset would otherwise stall get() until pageLoad.timeout.
        PageLoadStrategy strategy = PageLoadStrategy.fromString(Config.get("pageLoad.strategy", "eager"));

        WebDriver driver = switch (browser) {
            case "chrome" -> new ChromeDriver(chromium(new ChromeOptions(), headless, size, ua, strategy));
            case "firefox" -> {
                FirefoxOptions o = new FirefoxOptions();
                if (headless) o.addArguments("-headless");
                o.setPageLoadStrategy(strategy);
                yield new FirefoxDriver(o);
            }
            default -> new EdgeDriver(chromium(new EdgeOptions(), headless, size, ua, strategy));
        };
        driver.manage().timeouts().implicitlyWait(Duration.ZERO); // waits are explicit, in the healer
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(Config.getInt("pageLoad.timeout.seconds", 90)));
        if ("firefox".equals(browser)) {
            String[] wh = size.split(",");
            driver.manage().window().setSize(new org.openqa.selenium.Dimension(Integer.parseInt(wh[0].trim()), Integer.parseInt(wh[1].trim())));
        }
        return driver;
    }

    private static <T extends ChromiumOptions<T>> T chromium(T o, boolean headless, String size, String ua, PageLoadStrategy strategy) {
        o.setPageLoadStrategy(strategy);
        if (headless) o.addArguments("--headless=new");
        o.addArguments("--window-size=" + size, "--disable-notifications", "--lang=en-US");
        // Some sites (Zoho) reject the headless user agent; set browser.userAgent to a normal one if needed.
        if (!ua.isEmpty()) o.addArguments("--user-agent=" + ua);
        o.setExperimentalOption("excludeSwitches", java.util.List.of("enable-automation"));
        return o;
    }
}
