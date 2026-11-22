package qa.features.deskassignmentrules;

import io.restassured.response.Response;
import org.testng.SkipException;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;
import qa.core.annotations.CaseId;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.testng.Assert.*;
import static qa.features.deskassignmentrules.ArApi.*;
import static qa.features.deskassignmentrules.DeskAssignmentRulesFeature.*;

/** Group B — rule criteria: matching at runtime, validation, field list, operators, holiday / business hours, contact / account. */
public class CriteriaTest extends ArTestBase {

    private Response tryDirect(Map<String, Object> criteria) {
        Map<String, Object> b = directBody(mk("Bv"), l("create"), l(directTarget(criteria, DA, null, agent(A1))));
        b.put("is_active", false);
        return o.createRule(b);
    }

    @Test(groups = {"regression", "api"}, description = "A direct rule with no criteria matches every ticket of its department")
    @CaseId("B-01")
    public void noCriteriaMatchesAll() {
        String id = o.direct(mk("B01 no criteria"), directTarget(allTickets(), DB, null, agent(A2)));
        try {
            String t = o.ticket(PREFIX + "zq any subject B01 " + uid(), DB);
            assertEquals(n(o.waitOwner(t, 20)), "A2");
        } finally {
            o.deleteRule(id); // catches every Dept B ticket: never leave it on
        }
    }

    @Test(groups = {"regression", "api"}, description = "Pattern 1 and (2 or 3): only matching tickets are assigned")
    @CaseId("B-02")
    public void patternTruthTable() {
        String mk = mk("B02");
        Map<String, Object> c = crit("1 and (2 or 3)", cond("subject", "contains", mk), cond("priority", "equals", "low"), cond("priority", "equals", "urgent"));
        o.direct(mk, directTarget(c, DB, null, agent(A1)));
        String a = o.ticket(mk + " a", DB, m("priority", "Low"));
        String b = o.ticket(mk + " b", DB, m("priority", "Urgent"));
        String cc = o.ticket(mk + " c", DB, m("priority", "Medium"));
        String d = o.ticket(PREFIX + "other B02 " + uid(), DB, m("priority", "Low"));
        wait(6);
        SoftAssert s = new SoftAssert();
        s.assertEquals(n(o.waitOwner(a, 15)), "A1", "subject + Low");
        s.assertEquals(n(o.waitOwner(b, 10)), "A1", "subject + Urgent");
        s.assertNull(o.owner(cc), "subject + Medium");
        s.assertNull(o.owner(d), "other subject + Low");
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "A condition without a field or without a value is refused")
    @CaseId("B-03")
    public void conditionWithoutFieldOrValue() {
        Response noValue = tryDirect(crit(null, cond("subject", "contains", "")));
        Response noField = tryDirect(crit(null, cond("", "contains", "x")));
        assertEquals(noValue.statusCode() / 100, 4, "no value: " + err(noValue));
        assertEquals(noField.statusCode() / 100, 4, "no field: " + err(noField));
    }

    @Test(groups = {"regression", "api"}, description = "Invalid patterns are refused")
    @CaseId("B-04")
    public void invalidPattern() {
        SoftAssert s = new SoftAssert();
        for (String p : List.of("1 and (2", "1 and 4", "1 xor 2", "(1 or 2))")) {
            Response r = tryDirect(crit(p, cond("subject", "contains", "x"), cond("priority", "equals", "high")));
            s.assertEquals(r.statusCode() / 100, 4, "pattern '" + p + "' -> " + err(r));
        }
        s.assertAll();
    }

    @Test(groups = {"regression", "api"}, description = "25 conditions are saved, 26 refused")
    @CaseId("B-05")
    public void conditionLimit() {
        java.util.function.IntFunction<Map<String, Object>> c = k -> {
            List<Object> conds = new java.util.ArrayList<>();
            for (int i = 0; i < k; i++) conds.add(cond("subject", "does_not_contain", "zz" + i));
            return m("conditions", conds, "pattern", null);
        };
        Response r25 = tryDirect(c.apply(25));
        Response r26 = tryDirect(c.apply(26));
        assertEquals(r25.statusCode() / 100, 2, "25 conditions: " + err(r25));
        assertEquals(r26.statusCode() / 100, 4, "26 conditions: " + err(r26));
    }

    @Test(groups = {"regression", "api"}, description = "Criteria field list has the key ticket fields (Is Escalated = SLA Escalated) and contact / account fields")
    @CaseId("B-06")
    public void criteriaFieldList() {
        List<Map<String, Object>> f = o.criteriaFields();
        SoftAssert s = new SoftAssert();
        for (String k : List.of("owner", "team", "tags", "skills", "contact", "account", "product", "due_date", "created_time",
                "modified_time", "closed_time", "is_overdue", "sla_escalated"))
            s.assertTrue(f.stream().anyMatch(x -> String.valueOf(x.get("key")).startsWith(k)), "criteria field missing: " + k);
        long contact = f.stream().filter(x -> "contact".equals(x.get("group"))).count();
        long account = f.stream().filter(x -> "account".equals(x.get("group"))).count();
        s.assertTrue(contact >= 10, "contact fields: " + contact);
        s.assertTrue(account >= 5, "account fields: " + account);
        s.assertAll();
    }

    @Test(groups = {"regression", "api", "slow"}, description = "Rule on SLA Escalated = true assigns an escalated ticket once it is edited; a non-escalated control stays unassigned")
    @CaseId("B-06b")
    public void slaEscalatedAssigns() {
        String mk = mk("ESC");
        o.slaPolicy(DA, mk + " SLA", mk + " Y", 1, true);
        o.rule(rrBody(mk + " rule", DA, l("create", "update"), l(rrTarget(crit("1 and 2", cond("subject", "starts_with", mk),
                cond("sla_escalated", "equals", true)), "sequential", agentsPool(A1)))));
        String y = o.ticket(mk + " Y 1", DA), nn = o.ticket(mk + " N 1", DA);
        wait(8);
        assertNull(o.owner(y), "assigned before escalation");
        boolean esc = false;
        for (int i = 0; i < 40 && !esc; i++) {
            wait(10);
            esc = Boolean.TRUE.equals(o.fields(y).get("sla_escalated"));
        }
        if (!esc) inconclusive("the SLA did not escalate the ticket within ~7 min (control)");
        o.patchTicket(y, m("priority", "Low"));
        o.patchTicket(nn, m("priority", "Low"));
        assertEquals(n(o.waitOwner(y, 60)), "A1", "escalated ticket after edit");
        assertNull(o.waitOwner(nn, 10), "non-escalated control was assigned");
    }

    @Test(groups = {"regression", "api"}, description = "A date field and a number field offer comparison and range operators")
    @CaseId("B-07")
    @SuppressWarnings("unchecked")
    public void dateAndNumberOperators() {
        List<Map<String, Object>> f = o.criteriaFields();
        Map<String, Object> date = f.stream().filter(x -> List.of("date", "datetime").contains(x.get("type"))).findFirst().orElse(null);
        Map<String, Object> num = f.stream().filter(x -> List.of("number", "integer", "decimal").contains(x.get("type"))).findFirst().orElse(null);
        assertNotNull(date, "no date field");
        assertNotNull(num, "no number field");
        List<String> dOps = ((List<Map<String, Object>>) date.get("operators")).stream().map(x -> String.valueOf(x.get("key"))).toList();
        List<String> nOps = ((List<Map<String, Object>>) num.get("operators")).stream().map(x -> String.valueOf(x.get("key"))).toList();
        ledger("B-07 date " + date.get("key") + " " + dOps + " | number " + num.get("key") + " " + nOps);
        assertTrue(dOps.size() >= 6 && dOps.stream().anyMatch(x -> x.contains("between")), "date operators " + dOps);
        assertTrue(nOps.size() >= 5 && nOps.stream().anyMatch(x -> x.contains("between")), "number operators " + nOps);
    }

    @Test(groups = {"regression", "api", "NDC-2814"}, description = "Holiday criteria with a detached holiday list: not on holiday matches, on holiday does not (today is not in the list)")
    @CaseId({"B-08a", "R-2814"})
    public void holidayDetachedList() {
        if (!o.holidayListExists(HOLIDAY_LIST)) throw new SkipException("BLOCKED: detached holiday list QA AS6 HOL today is gone");
        String mk = mk("HOL");
        Map<String, Object> on = directTarget(crit("1 and 2", cond("subject", "contains", mk + " t1"), cond("execution_time", "on_holiday", HOLIDAY_LIST)), DB, null, agent(A1));
        Map<String, Object> off = directTarget(crit("1 and 2", cond("subject", "contains", mk + " t2"), cond("execution_time", "not_on_holiday", HOLIDAY_LIST)), DB, null, agent(A2));
        o.rule(directBody(mk, l("create"), l(on, off)));
        String t1 = o.ticket(mk + " t1", DB), t2 = o.ticket(mk + " t2", DB);
        assertEquals(n(o.waitOwner(t2, 20)), "A2", "not_on_holiday");
        assertNull(o.owner(t1), "on_holiday matched on a day that is not a holiday");
    }

    @Test(groups = {"regression", "api"}, description = "Business hours criteria: only the branch matching the current time acts")
    @CaseId("B-08b")
    public void businessHours() {
        boolean open = Boolean.TRUE.equals(ok(o.get("/desk/business-hours"), "business hours").jsonPath().get("data.is_open_now"));
        String mk = mk("BH");
        Map<String, Object> during = directTarget(crit("1 and 2", cond("subject", "contains", mk), cond("execution_time", "during_business_hours", BUSINESS_HOURS)), DB, null, agent(A1));
        Map<String, Object> outside = directTarget(crit("1 and 2", cond("subject", "contains", mk), cond("execution_time", "outside_business_hours", BUSINESS_HOURS)), DB, null, agent(A2));
        o.rule(directBody(mk, l("create"), l(during, outside)));
        String t = o.ticket(mk + " x", DB);
        assertEquals(n(o.waitOwner(t, 20)), open ? "A1" : "A2", "business hours " + (open ? "open" : "closed") + " now");
    }

    @Test(groups = {"regression", "api"}, description = "Rules on contact last name and account name assign tickets with that contact / account")
    @CaseId("B-09")
    public void contactAndAccountCriteria() {
        String mk = mk("B09");
        String acc = o.record(ACCOUNTS, "account", mk + " Acct", m("account_name", mk + " Acct"));
        String last = mk.replace(PREFIX, "QA AR L");
        Map<String, Object> cv = new LinkedHashMap<>(m("first_name", "Qa", "last_name", last, "email", "qa.ar.b09." + uid() + "@example.com", "account_id", acc));
        String ct = o.record(CONTACTS, "contact", last, cv);
        o.direct(mk + " contact", directTarget(crit(null, cond("contact.last_name", "equals", last)), DB, null, agent(A2)));
        o.direct(mk + " account", directTarget(crit(null, cond("account.account_name", "contains", mk + " Acct")), DB, null, agent(A1)));
        String t1 = o.ticket(mk + " with contact", DB, m("contact_id", ct));
        String t2 = o.ticket(mk + " account only", DB, m("account_id", acc));
        String t3 = o.ticket(mk + " none", DB);
        SoftAssert s = new SoftAssert();
        s.assertEquals(n(o.waitOwner(t1, 20)), "A2", "contact last name rule");
        s.assertEquals(n(o.waitOwner(t2, 15)), "A1", "account name rule");
        s.assertNull(o.owner(t3), "ticket with neither");
        s.assertAll();
    }
}
