package qa.core.healing;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import io.qameta.allure.Allure;
import qa.core.config.Config;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Every heal and every broken locator of the run, in target/healing/healing-report.json.
 * HEALED = a fallback candidate worked and was promoted; FINGERPRINT = no candidate worked but a
 * similar element was adopted; BROKEN = nothing matched (the page must be re-explored).
 */
public final class HealingReport {
    private static final ObjectMapper JSON = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    private static final List<Map<String, Object>> EVENTS = new ArrayList<>();
    private static final Path FILE = Config.projectDir().resolve("target/healing/healing-report.json");

    private HealingReport() {
    }

    public static synchronized void record(String status, String feature, String page, String key,
                                           String from, String to, String url, Double score) {
        Map<String, Object> e = new LinkedHashMap<>();
        e.put("time", OffsetDateTime.now().toString());
        e.put("status", status);
        e.put("feature", feature);
        e.put("element", page + "." + key);
        e.put("failed", from);
        e.put("used", to);
        if (score != null) e.put("score", Math.round(score * 100) / 100.0);
        e.put("url", url);
        e.put("test", qa.core.listeners.TestContext.currentTest());
        EVENTS.add(e);
        String line = "[self-healing] " + status + " " + feature + "/" + page + "." + key + " | failed: " + from + (to != null ? " | used: " + to : "");
        System.out.println(line);
        try {
            Allure.addAttachment("self-healing " + status + " " + page + "." + key, "text/plain", line);
        } catch (Exception ignored) {
        }
        try {
            Files.createDirectories(FILE.getParent());
            Files.writeString(FILE, JSON.writeValueAsString(EVENTS), StandardCharsets.UTF_8);
        } catch (Exception ex) {
            System.err.println("[self-healing] cannot write report: " + ex.getMessage());
        }
    }
}
