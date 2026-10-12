package qa.core.base;

import io.qameta.allure.Allure;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import qa.core.config.Config;
import qa.core.driver.DriverManager;
import qa.core.healing.SelfHealingLocator;

import java.util.List;
import java.util.function.Supplier;

/**
 * Parent of every page object. Elements are referred to by their key in the feature's locators.json
 * (section = the page class's simple name); every lookup goes through the self-healing locator.
 * Keys with {0} placeholders take arguments: click("ruleRow", "My rule").
 */
public abstract class BasePage {
    protected final WebDriver driver;
    protected final String feature;
    protected final String page;

    protected BasePage(String feature) {
        this.driver = DriverManager.get();
        this.feature = feature;
        this.page = getClass().getSimpleName();
    }

    // ---------- lookup ----------
    protected WebElement el(String key, Object... args) {
        return SelfHealingLocator.find(driver, feature, page, key, args);
    }

    protected List<WebElement> all(String key, Object... args) {
        return SelfHealingLocator.findAll(driver, feature, page, key, args);
    }

    protected boolean isShown(String key, int timeoutSeconds, Object... args) {
        return SelfHealingLocator.exists(driver, feature, page, key, timeoutSeconds, args);
    }

    // ---------- actions ----------
    protected void open(String path) {
        step("Open " + path, () -> driver.get(path.startsWith("http") ? path : Config.baseUrl() + path));
        Waits.pageReady(driver);
    }

    protected void click(String key, Object... args) {
        step("Click " + label(key, args), () -> retry(() -> {
            WebElement e = el(key, args);
            scrollTo(e);
            try {
                e.click();
            } catch (ElementClickInterceptedException ex) {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", e);
            }
            return null;
        }));
    }

    protected void type(String key, String text, Object... args) {
        step("Type into " + label(key, args), () -> retry(() -> {
            WebElement e = el(key, args);
            scrollTo(e);
            e.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.DELETE);
            e.sendKeys(text);
            return null;
        }));
    }

    protected void typeAndEnter(String key, String text, Object... args) {
        type(key, text, args);
        el(key, args).sendKeys(Keys.ENTER);
    }

    /** Native <select>: picks the option by visible text. */
    protected void selectNative(String key, String optionText, Object... args) {
        step("Select '" + optionText + "' in " + label(key, args), () -> new Select(el(key, args)).selectByVisibleText(optionText));
    }

    /** Custom dropdowns: open with the trigger, then click an element by its text/role in the open list. */
    protected void choose(String triggerKey, String optionKey, Object... optionArgs) {
        click(triggerKey);
        click(optionKey, optionArgs);
    }

    protected String text(String key, Object... args) {
        return retry(() -> el(key, args).getText().trim());
    }

    protected String value(String key, Object... args) {
        return retry(() -> el(key, args).getAttribute("value"));
    }

    protected void press(Keys key) {
        new org.openqa.selenium.interactions.Actions(driver).sendKeys(key).perform();
    }

    protected String bodyText() {
        return driver.findElement(org.openqa.selenium.By.tagName("body")).getText();
    }

    protected void scrollTo(WebElement e) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView({block:'center'});", e);
    }

    // ---------- helpers ----------
    protected <T> T retry(Supplier<T> action) {
        StaleElementReferenceException last = null;
        for (int i = 0; i < 3; i++) {
            try {
                return action.get();
            } catch (StaleElementReferenceException e) {
                last = e;
            }
        }
        throw last;
    }

    protected <T> T step(String name, Supplier<T> body) {
        return Allure.step(page + ": " + name, (Allure.ThrowableRunnable<T>) body::get);
    }

    protected void step(String name, Runnable body) {
        Allure.step(page + ": " + name, (Allure.ThrowableRunnableVoid) body::run);
    }

    private static String label(String key, Object... args) {
        return args == null || args.length == 0 ? key : key + " " + java.util.Arrays.toString(args);
    }
}
