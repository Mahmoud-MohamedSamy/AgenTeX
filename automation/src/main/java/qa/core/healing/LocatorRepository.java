package qa.core.healing;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import qa.core.config.Config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Locators for one feature: src/test/resources/features/{feature}/locators.json,
 * shaped { "PageClass": { "elementKey": LocatorDef } }.
 * Reads the source file (so heals made earlier in the same run are visible) and, with
 * healing.autoUpdate=true, writes promotions and new candidates straight back to it.
 */
public final class LocatorRepository {
    private static final ObjectMapper JSON = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    private static final Map<String, LocatorRepository> CACHE = new ConcurrentHashMap<>();

    private final String feature;
    private final Path source;
    private final Map<String, Map<String, LocatorDef>> pages;

    private LocatorRepository(String feature) {
        this.feature = feature;
        this.source = Config.projectDir().resolve("src/test/resources/features").resolve(feature).resolve("locators.json");
        this.pages = read();
    }

    public static LocatorRepository of(String feature) {
        return CACHE.computeIfAbsent(feature, LocatorRepository::new);
    }

    private Map<String, Map<String, LocatorDef>> read() {
        TypeReference<LinkedHashMap<String, LinkedHashMap<String, LocatorDef>>> t = new TypeReference<>() {
        };
        try {
            if (Files.exists(source)) {
                return new LinkedHashMap<>(JSON.readValue(source.toFile(), t));
            }
            try (InputStream in = getClass().getClassLoader().getResourceAsStream("features/" + feature + "/locators.json")) {
                if (in == null) throw new IllegalStateException("No locators.json for feature '" + feature + "' at " + source);
                return new LinkedHashMap<>(JSON.readValue(in, t));
            }
        } catch (IOException e) {
            throw new IllegalStateException("Cannot parse locators for " + feature + ": " + e.getMessage(), e);
        }
    }

    public LocatorDef get(String page, String key) {
        Map<String, LocatorDef> p = pages.get(page);
        LocatorDef d = p == null ? null : p.get(key);
        if (d == null || d.candidates.isEmpty())
            throw new IllegalArgumentException("No locator '" + page + "." + key + "' in features/" + feature + "/locators.json");
        return d;
    }

    public String feature() {
        return feature;
    }

    public synchronized void save() {
        if (!Config.getBool("healing.autoUpdate", true)) return;
        try {
            Files.createDirectories(source.getParent());
            Files.writeString(source, JSON.writeValueAsString(pages) + System.lineSeparator(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.err.println("[self-healing] could not write " + source + ": " + e.getMessage());
        }
    }
}
