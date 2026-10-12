package qa.core.config;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

/**
 * Layered configuration. Later layers win:
 * classpath config.properties  <  config.local.properties (project root, gitignored)
 * <  environment variable (base.url -> BASE_URL)  <  -Dbase.url=... system property.
 */
public final class Config {
    private static final Properties PROPS = load();

    private Config() {
    }

    private static Properties load() {
        Properties p = new Properties();
        try (InputStream in = Config.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (in != null) p.load(new java.io.InputStreamReader(in, StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new IllegalStateException("Cannot read config.properties", e);
        }
        Path local = projectDir().resolve("config.local.properties");
        if (Files.exists(local)) {
            try (Reader r = Files.newBufferedReader(local, StandardCharsets.UTF_8)) {
                p.load(r);
            } catch (IOException e) {
                throw new IllegalStateException("Cannot read " + local, e);
            }
        }
        return p;
    }

    public static String get(String key) {
        String v = System.getProperty(key);
        if (v == null) v = System.getenv(key.toUpperCase().replace('.', '_'));
        if (v == null) v = PROPS.getProperty(key);
        return v == null ? null : v.trim();
    }

    public static String get(String key, String def) {
        String v = get(key);
        return v == null || v.isEmpty() ? def : v;
    }

    public static int getInt(String key, int def) {
        String v = get(key);
        return v == null || v.isEmpty() ? def : Integer.parseInt(v);
    }

    public static double getDouble(String key, double def) {
        String v = get(key);
        return v == null || v.isEmpty() ? def : Double.parseDouble(v);
    }

    public static boolean getBool(String key, boolean def) {
        String v = get(key);
        return v == null || v.isEmpty() ? def : Boolean.parseBoolean(v);
    }

    /** Maven runs tests from the project root, so user.dir is the automation project. */
    public static Path projectDir() {
        return Path.of(System.getProperty("user.dir")).toAbsolutePath();
    }

    public static String baseUrl() {
        String u = get("base.url");
        if (u == null || u.isEmpty()) throw new IllegalStateException("base.url is not set (config.properties or -Dbase.url)");
        return u.endsWith("/") ? u.substring(0, u.length() - 1) : u;
    }
}
