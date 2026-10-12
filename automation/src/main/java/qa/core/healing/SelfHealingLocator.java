package qa.core.healing;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import qa.core.config.Config;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Finds an element from its ranked candidates and heals the locator file when the first one stops working.
 *
 * 1. Poll every candidate until one matches (timeout = timeout.seconds).
 * 2. A fallback is only trusted after the primary has failed for healing.graceMs, so a slow page
 *    does not "heal" a locator that was fine. The winner is moved to the top of locators.json.
 * 3. If every candidate fails, score same-tag elements against the stored fingerprint; above
 *    healing.fingerprintThreshold the best one is adopted and a new candidate is added.
 * 4. Otherwise throw, and log BROKEN so the next session knows to re-explore that element.
 */
public final class SelfHealingLocator {
    private SelfHealingLocator() {
    }

    public static WebElement find(WebDriver driver, String feature, String page, String key, Object... args) {
        return findWithin(driver, feature, page, key, Config.getInt("timeout.seconds", 20), args);
    }

    public static WebElement findWithin(WebDriver driver, String feature, String page, String key, int timeoutSeconds, Object... args) {
        LocatorRepository repo = LocatorRepository.of(feature);
        LocatorDef def = repo.get(page, key);
        boolean allowHidden = Boolean.TRUE.equals(def.allowHidden);
        long graceMs = Config.getInt("healing.graceMs", 2500);
        long start = System.currentTimeMillis();
        long deadline = start + timeoutSeconds * 1000L;

        do {
            List<Candidate> cands = List.copyOf(def.candidates);
            for (int i = 0; i < cands.size(); i++) {
                Candidate c = cands.get(i).fill(args);
                WebElement el = first(driver, c.toBy(), allowHidden);
                if (el == null) continue;
                if (i > 0) {
                    if (System.currentTimeMillis() - start < graceMs) break; // give the primary a fair chance
                    WebElement primary = first(driver, cands.get(0).fill(args).toBy(), allowHidden);
                    if (primary != null) return remember(driver, repo, def, primary, false);
                    promote(repo, def, cands.get(i), page, key, cands.get(0).fill(args).toString(), c.toString(), driver);
                }
                return remember(driver, repo, def, el, i > 0);
            }
            sleep(250);
        } while (System.currentTimeMillis() < deadline);

        WebElement healed = fingerprintHeal(driver, repo, def, page, key, allowHidden, args);
        if (healed != null) return healed;

        String tried = def.candidates.stream().map(c -> c.fill(args).toString()).collect(Collectors.joining(" | "));
        HealingReport.record("BROKEN", feature, page, key, tried, null, safeUrl(driver), null);
        throw new NoSuchElementException("[self-healing] BROKEN locator " + feature + "/" + page + "." + key
                + " (" + def.description + ") after " + timeoutSeconds + "s. Tried: " + tried
                + ". Re-explore the page and update src/test/resources/features/" + feature + "/locators.json");
    }

    /** Non-throwing presence check (no healing, no report) for assertions like "is X shown". */
    public static boolean exists(WebDriver driver, String feature, String page, String key, int timeoutSeconds, Object... args) {
        LocatorDef def = LocatorRepository.of(feature).get(page, key);
        long deadline = System.currentTimeMillis() + timeoutSeconds * 1000L;
        do {
            for (Candidate c : def.candidates) {
                if (first(driver, c.fill(args).toBy(), Boolean.TRUE.equals(def.allowHidden)) != null) return true;
            }
            sleep(250);
        } while (System.currentTimeMillis() < deadline);
        return false;
    }

    /** All matches of the first candidate that matches anything (for lists/rows). */
    public static List<WebElement> findAll(WebDriver driver, String feature, String page, String key, Object... args) {
        LocatorDef def = LocatorRepository.of(feature).get(page, key);
        for (Candidate c : def.candidates) {
            List<WebElement> els = driver.findElements(c.fill(args).toBy());
            if (!els.isEmpty()) return els;
        }
        return new ArrayList<>();
    }

    private static WebElement first(WebDriver driver, By by, boolean allowHidden) {
        try {
            for (WebElement e : driver.findElements(by)) {
                if (allowHidden || e.isDisplayed()) return e;
            }
        } catch (Exception ignored) {
            // stale element or invalid selector for this DOM state — treat as no match
        }
        return null;
    }

    private static synchronized void promote(LocatorRepository repo, LocatorDef def, Candidate winner,
                                             String page, String key, String failed, String used, WebDriver driver) {
        def.candidates.remove(winner);
        def.candidates.add(0, winner);
        def.lastHeal = OffsetDateTime.now() + " promoted '" + winner + "' over '" + failed + "'";
        HealingReport.record("HEALED", repo.feature(), page, key, failed, used, safeUrl(driver), null);
        repo.save();
    }

    private static WebElement remember(WebDriver driver, LocatorRepository repo, LocatorDef def, WebElement el, boolean healed) {
        if (!def.parameterized() && (def.fingerprint == null || healed)) {
            try {
                def.fingerprint = Fingerprint.of(driver, el);
                repo.save();
            } catch (Exception ignored) {
            }
        }
        return el;
    }

    private static WebElement fingerprintHeal(WebDriver driver, LocatorRepository repo, LocatorDef def, String page,
                                              String key, boolean allowHidden, Object... args) {
        if (def.fingerprint == null || def.parameterized() || def.fingerprint.tag == null) return null;
        double threshold = Config.getDouble("healing.fingerprintThreshold", 0.6);
        WebElement best = null;
        Fingerprint bestFp = null;
        double bestScore = 0;
        List<WebElement> pool = driver.findElements(By.tagName(def.fingerprint.tag));
        for (WebElement e : pool.subList(0, Math.min(pool.size(), 400))) {
            try {
                if (!allowHidden && !e.isDisplayed()) continue;
                Fingerprint fp = Fingerprint.of(driver, e);
                double s = def.fingerprint.score(fp);
                if (s > bestScore) {
                    bestScore = s;
                    best = e;
                    bestFp = fp;
                }
            } catch (Exception ignored) {
            }
        }
        if (best == null || bestScore < threshold) return null;
        Candidate fresh = bestFp.bestCandidate();
        String tried = def.candidates.stream().map(c -> c.fill(args).toString()).collect(Collectors.joining(" | "));
        if (fresh != null) {
            synchronized (SelfHealingLocator.class) {
                def.candidates.remove(fresh);
                def.candidates.add(0, fresh);
                def.fingerprint = bestFp;
                def.lastHeal = OffsetDateTime.now() + " fingerprint match " + Math.round(bestScore * 100) + "% -> '" + fresh + "'";
                repo.save();
            }
        }
        HealingReport.record("FINGERPRINT", repo.feature(), page, key, tried, fresh == null ? "(no stable attribute)" : fresh.toString(), safeUrl(driver), bestScore);
        return best;
    }

    private static String safeUrl(WebDriver d) {
        try {
            return d.getCurrentUrl();
        } catch (Exception e) {
            return "";
        }
    }

    private static void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
