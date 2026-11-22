package qa.features.deskassignmentrules;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Keeps A1 (Test User 1) and A2 (Mahmoud Samy) present as wanted while tests run — the Java form of the 19 Nov keepalive.js.
 * ON = every channel on + heartbeat every 20 s; EMAIL_OFF = email channel off (still heartbeating, NDC-2811);
 * OFF = every channel off, no heartbeat. A3 (Dev Team 2) cannot sign in, so it is always offline.
 * Network calls are never made while holding a lock the tests wait on (a stalled call once hung a whole run).
 */
public final class AgentPresence {
    public enum Mode { ON, OFF, EMAIL_OFF }

    private static final Map<String, Mode> WANT = new ConcurrentHashMap<>();
    private static final Map<String, Mode> APPLIED = new ConcurrentHashMap<>();
    private static final Object CALLS = new Object();
    private static Thread loop;
    private static volatile boolean stop;

    private AgentPresence() {
    }

    /** Starts the loop (idempotent) with both agents ON. */
    public static synchronized void start() {
        if (loop != null) return;
        WANT.put(DeskAssignmentRulesFeature.A1_LABEL, Mode.ON);
        WANT.put(DeskAssignmentRulesFeature.A2_LABEL, Mode.ON);
        stop = false;
        tick();
        loop = new Thread(() -> {
            while (!stop) {
                for (int i = 0; i < 20 && !stop; i++) ArApi.sleep(1000);
                if (!stop) tick();
            }
        }, "ar-presence");
        loop.setDaemon(true);
        loop.start();
    }

    public static synchronized void stop() {
        stop = true;
        if (loop != null) loop.interrupt();
        loop = null;
    }

    /** Sets the wanted mode and applies it now; waits a few seconds for presence to settle. No-op when already applied. */
    public static void set(String label, Mode mode) {
        if (mode == WANT.get(label) && mode == APPLIED.get(label)) return;
        WANT.put(label, mode);
        tick();
        ArApi.sleep(6000);
    }

    public static void a1(Mode m) {
        set(DeskAssignmentRulesFeature.A1_LABEL, m);
    }

    public static void a2(Mode m) {
        set(DeskAssignmentRulesFeature.A2_LABEL, m);
    }

    private static void tick() {
        synchronized (CALLS) { // serialises the loop and set(); each HTTP call has a 30/90 s timeout
            for (Map.Entry<String, Mode> e : new LinkedHashMap<>(WANT).entrySet()) {
                try {
                    ArApi a = ArApi.as(e.getKey());
                    Mode want = e.getValue();
                    if (APPLIED.get(e.getKey()) != want) {
                        switch (want) {
                            case ON -> a.setChannels(true, true, true);
                            case EMAIL_OFF -> a.setChannels(false, true, true);
                            case OFF -> a.setChannels(false, false, false);
                        }
                        APPLIED.put(e.getKey(), want);
                    }
                    if (want != Mode.OFF) a.heartbeat();
                } catch (RuntimeException ex) {
                    ArApi.ledger("presence " + e.getKey() + " error: " + ArApi.cut(ex.getMessage(), 120));
                }
            }
        }
    }
}
