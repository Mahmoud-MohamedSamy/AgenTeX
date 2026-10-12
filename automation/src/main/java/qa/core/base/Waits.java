package qa.core.base;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import qa.core.config.Config;

import java.time.Duration;
import java.util.function.BooleanSupplier;
import java.util.regex.Pattern;

public final class Waits {
    private Waits() {
    }

    /**
     * DOM parsed (required), then up to pageLoad.settleSeconds for every asset (best effort). A single
     * slow asset must not fail a test whose elements are already usable; element waits do the rest.
     */
    public static void pageReady(WebDriver d) {
        new WebDriverWait(d, Duration.ofSeconds(Config.getInt("pageLoad.timeout.seconds", 90)))
                .until(x -> !"loading".equals(((JavascriptExecutor) x).executeScript("return document.readyState")));
        until(() -> "complete".equals(((JavascriptExecutor) d).executeScript("return document.readyState")),
                Config.getInt("pageLoad.settleSeconds", 10));
    }

    public static boolean until(BooleanSupplier cond, int seconds) {
        long end = System.currentTimeMillis() + seconds * 1000L;
        while (System.currentTimeMillis() < end) {
            try {
                if (cond.getAsBoolean()) return true;
            } catch (Exception ignored) {
            }
            sleep(300);
        }
        return false;
    }

    public static boolean bodyContains(WebDriver d, String text, int seconds) {
        return until(() -> d.findElement(By.tagName("body")).getText().contains(text), seconds);
    }

    public static boolean bodyMatches(WebDriver d, Pattern p, int seconds) {
        return until(() -> p.matcher(d.findElement(By.tagName("body")).getText()).find(), seconds);
    }

    public static boolean urlContains(WebDriver d, String part, int seconds) {
        return until(() -> d.getCurrentUrl().contains(part), seconds);
    }

    public static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
