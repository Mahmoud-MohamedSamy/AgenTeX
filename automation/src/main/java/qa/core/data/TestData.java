package qa.core.data;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import qa.core.config.Config;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Reads src/test/resources/features/{feature}/testdata.json. Paths use dots: TestData.of(f).text("ticket.email"). */
public final class TestData {
    private static final Map<String, TestData> CACHE = new ConcurrentHashMap<>();
    private final JsonNode root;

    private TestData(String feature) {
        Path p = Config.projectDir().resolve("src/test/resources/features").resolve(feature).resolve("testdata.json");
        try {
            root = new ObjectMapper().readTree(p.toFile());
        } catch (Exception e) {
            throw new IllegalStateException("Cannot read " + p + ": " + e.getMessage(), e);
        }
    }

    public static TestData of(String feature) {
        return CACHE.computeIfAbsent(feature, TestData::new);
    }

    public JsonNode node(String path) {
        JsonNode n = root;
        for (String part : path.split("\\.")) {
            n = n.path(part);
        }
        if (n.isMissingNode()) throw new IllegalArgumentException("No test data '" + path + "'");
        return n;
    }

    public String text(String path) {
        return node(path).asText();
    }

    public List<String> list(String path) {
        List<String> out = new ArrayList<>();
        node(path).forEach(x -> out.add(x.asText()));
        return out;
    }

    /** Unique, recognisable name for records the test creates: "QA <label> <time>". */
    public String uniqueName(String label) {
        return root.path("namePrefix").asText("QA ") + label + " " + System.currentTimeMillis() % 1_000_000;
    }
}
