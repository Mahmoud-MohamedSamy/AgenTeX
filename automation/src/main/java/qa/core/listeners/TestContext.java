package qa.core.listeners;

/** Name of the test running on this thread, so healing events can say which test hit them. */
public final class TestContext {
    private static final ThreadLocal<String> CURRENT = new ThreadLocal<>();

    private TestContext() {
    }

    public static void set(String name) {
        CURRENT.set(name);
    }

    public static String currentTest() {
        String s = CURRENT.get();
        return s == null ? "" : s;
    }

    public static void clear() {
        CURRENT.remove();
    }
}
