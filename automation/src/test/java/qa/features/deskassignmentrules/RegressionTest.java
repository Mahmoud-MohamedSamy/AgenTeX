package qa.features.deskassignmentrules;

import org.testng.SkipException;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/**
 * Group R (bug regressions) that have no home in another group, plus group J. The other R rows are tagged on the
 * test that covers them: NDC-2811 F-07d, NDC-2812 F-12, NDC-2813 UI, NDC-2814 B-08a, NDC-2821 H-01, NDC-2824 F-14/F-15,
 * NDC-2931 E-14c, NDC-2932 E-14b, NDC-3137 F-08d. Run one bug with -Dtags=NDC-3137.
 */
public class RegressionTest extends ArTestBase {

    @Test(groups = {"regression", "api", "NDC-3046"}, description = "Round-robin rule with an SLA name condition assigns on create")
    @CaseId("R-3046")
    public void rrWithSlaCondition() {
        String mk = mk("SLA");
        String policy = mk + " policy";
        o.slaPolicy(DB, policy, mk, 60, false);
        o.rule(rrBody(mk + " sla name", DB, l("create"), l(rrTarget(crit("1 and 2", cond("subject", "starts_with", mk + " N"),
                cond("sla_name", "equals", policy)), "sequential", agentsPool(A1, A2)))));
        wait(3);
        String t = o.ticket(mk + " N 1", DB);
        assertNotNull(o.waitOwner(t, 30), "RR rule with SLA name = policy did not assign on create (NDC-3046)");
    }

    @Test(groups = {"regression", "api", "NDC-2814"}, description = "Holiday criteria: 'on holiday' matches on a day that is in a detached holiday list")
    @CaseId("R-2814b")
    public void holidayPositive() {
        throw new SkipException("BLOCKED: needs a holiday list that contains today; creating / editing holiday lists needs "
                + "iam.company.business_hours.manage, which the test accounts do not have. The negative half runs in B-08a.");
    }

    @Test(groups = {"regression"}, description = "Pre-existing NDC rules keep their order and state after the release migration")
    @CaseId("J-01")
    public void migration() {
        throw new SkipException("NOT AUTOMATED: release-time migration check, not repeatable on a migrated tenant.");
    }
}
