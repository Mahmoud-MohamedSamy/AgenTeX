package qa.features.deskassignmentrules;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/** Group I (API side): concurrency and speed of round robin. UI rows (Arabic, keyboard, markup) are in AssignmentRulesUiTest. */
public class NonFunctionalTest extends ArTestBase {

    @Test(groups = {"regression", "api", "slow"}, description = "20 tickets at once, pool A1 + A2 with 5 free slots each: 5 + 5 assigned, 10 backlog, no double assignment")
    @CaseId("I-03")
    public void twentyAtOnce() throws Exception {
        java.util.Map<String, String> p = o.presence(A1, A2);
        if (!p.get(A1).startsWith("on") || !p.get(A2).startsWith("on")) inconclusive("A1/A2 not online: " + p);
        o.setPrefs(DB, m("assign_to_offline_agents", false, "agent_threshold_enabled", true, "agent_thresholds", thresholds(DB, 5, 5)));
        String mk = mk("I03");
        o.rr(mk, DB, startsWith(mk), "sequential", A1, A2);
        ExecutorService ex = Executors.newFixedThreadPool(20);
        List<Future<String>> fs = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            final int k = i;
            fs.add(ex.submit(() -> o.ticket(mk + " burst " + k, DB)));
        }
        List<String> ids = new ArrayList<>();
        for (Future<String> f : fs) ids.add(f.get());
        ex.shutdown();
        wait(25);
        int a1 = 0, a2 = 0, none = 0, doubles = 0;
        for (String id : ids) {
            String w = o.owner(id);
            if (A1.equals(w)) a1++;
            else if (A2.equals(w)) a2++;
            else none++;
            if (o.autoAssigned(id).size() > 1) doubles++;
        }
        String msg = "A1 " + a1 + ", A2 " + a2 + ", unassigned " + none + ", double " + doubles;
        assertEquals(doubles, 0, msg);
        assertEquals(a1, 5, msg);
        assertEquals(a2, 5, msg);
        assertEquals(none, 10, msg);
    }

    @Test(groups = {"regression", "api"}, description = "Speed: create -> owner within 5 s for at least 9 of 10 tickets")
    @CaseId("I-04")
    public void speed() {
        String mk = mk("I04");
        o.rr(mk, DB, startsWith(mk), "sequential", A1, A2);
        List<Long> ms = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            long t0 = System.currentTimeMillis();
            String id = o.ticket(mk + " timing " + i, DB);
            Long took = null;
            for (int k = 0; k < 40; k++) {
                if (o.owner(id) != null) {
                    took = System.currentTimeMillis() - t0;
                    break;
                }
                sleep(250);
            }
            ms.add(took == null ? 99_999L : took);
        }
        long within = ms.stream().filter(x -> x <= 5000).count();
        Collections.sort(ms);
        ledger("I-04 create->owner ms: " + ms);
        assertTrue(within >= 9, "within 5 s: " + within + "/10, times " + ms);
    }
}
