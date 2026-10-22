package qa.features.crmdeskintegration;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Last remaining rows (21 Oct 2026): J6 activity types (calls hidden) and O9 bulk sync of 500 QA CRM contacts by import
 * (import with "trigger automation" off so teammates' CRM rules do not fire 500 times; if events do not sync, the
 * documented bulk path "Sync all customers" is used and timed). Everything created is deleted at the end.
 */
public class FinalApiTest extends WriteBase {
    static final String CRM_CALLS = "e72e608a-a5d3-45cf-888a-dfadc6e8b456";
    static final String CALL_LAYOUT = "58707442-1395-4eed-a015-be8280c9b4e6";

    @CaseId({"J6", "J8"})
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-remaining"}, description = "Agent allowed Meetings + Tasks only does not see a CRM call in Activities")
    public void j6CallsHidden() {
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "J6 " + RUN, "email", email("j6")));
        String d = waitPartner("contact", "crm", c, 150);
        track("desk", DESK_CONTACTS, d);
        String start = OffsetDateTime.now(ZoneOffset.UTC).plusDays(1).withNano(0).toString();
        Response call = null;
        for (String type : List.of("outbound", "Outbound", "inbound")) {
            call = createRaw("crm", CRM_CALLS, CALL_LAYOUT, f("name", "QA CD J6 call " + RUN, "subject", "QA CD J6 call " + RUN, "call_type", type, "call_start_time", start, "call_duration", "00:05", "contact_name", c));
            fact("J6", "create CRM call (type " + type + ") -> " + code(call) + " " + msg(call));
            if (call.statusCode() / 100 == 2) break;
        }
        if (call == null || call.statusCode() / 100 != 2) inconclusive("J6", "could not create a CRM call: " + (call == null ? "" : call.asString()));
        String callId = call.jsonPath().getString("data.id");
        track("crm", CRM_CALLS, callId);
        AppUser.sleep(5000);
        Response full = desk().get(INT + "/context/contact/" + d + "/activities");
        boolean visible = full.asString().contains("QA CD J6 call");
        fact("J6", "owner (full access): call in the pane's Activities=" + visible + " " + WriteRunTest.trim(full.asString(), 200));
        AppUser.App agent = AppUser.as(CrmDeskFeature.AGENT).desk();
        Map<String, Object> custom = WriteRunTest.map("enabled", true, "info", true, "potentials", true, "notes", true, "activities", List.of("meetings", "tasks"));
        Map<String, Object> cfg = config();
        cfg.remove("status");
        WriteRunTest.panel(cfg).put("profile_access", WriteRunTest.access(custom, custom));
        fact("J6", "Desk Agent: activities = meetings + tasks -> " + desk().putOnce(INT + "/config", cfg).statusCode());
        Response limited;
        try {
            limited = agent.get(INT + "/context/contact/" + d + "/activities");
            fact("J6", "agent (no Calls): " + code(limited) + " call listed=" + limited.asString().contains("QA CD J6 call") + " " + WriteRunTest.trim(limited.asString(), 200));
        } finally {
            Map<String, Object> r = config();
            r.remove("status");
            WriteRunTest.panel(r).put("profile_access", List.of());
            fact("J6", "restore profile_access -> " + desk().putOnce(INT + "/config", r).statusCode());
        }
        if (!visible) inconclusive("J6", "the call does not show even with full access (open activities only?)");
        Assert.assertFalse(limited.asString().contains("QA CD J6 call"), "Calls shown to a profile without the Calls activity type");
    }

    @CaseId({"O9", "B13"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-remaining"}, description = "500 QA CRM contacts by import: queue drains, links and History counts, time")
    public void o9Bulk() {
        int n = 500;
        String tag = "QA CD O9 " + RUN;
        StringBuilder csv = new StringBuilder("first_name,last_name,email\n");
        for (int i = 1; i <= n; i++) csv.append("QA CD,O9 ").append(RUN).append(' ').append(i).append(',').append("qa.cd.o9.").append(RUN).append('.').append(i).append("@example.com\n");
        long t0 = System.currentTimeMillis();
        int linksBefore = links("contact").size();
        Response up = owner().crm().req().contentType("multipart/form-data").multiPart("file", "qa-cd-o9.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + CRM_CONTACTS + "/import");
        fact("O9", "upload -> " + code(up));
        ok(up, "upload");
        String sid = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + CRM_CONTACTS + "/import/" + sid;
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", false);
        opts.put("assignment_rule_id", null);
        opts.put("manual_approval", false);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : List.of("first_name", "last_name", "email")) mapping.add(WriteRunTest.map("header", h, "field", h));
        Map<String, Object> body = WriteRunTest.map("mode", "add", "match_field_key", null, "layout_id", CRM_CONTACT_LAYOUT, "mapping", mapping, "options", opts);
        ok(crm().put(base + "/mapping", body), "mapping");
        ok(crm().post(base + "/validate", null), "validate");
        ok(crm().post(base + "/execute", null), "execute");
        waitFor(600, () -> {
            String st = crm().get(base).jsonPath().getString("data.status");
            return st != null && (st.startsWith("completed") || st.equals("partially_completed") || st.equals("failed"));
        });
        Response st = crm().get(base);
        long imported = System.currentTimeMillis();
        fact("O9", "import " + st.jsonPath().getString("data.status") + " created=" + st.jsonPath().get("data.created_count") + " in " + (imported - t0) / 1000 + " s");
        // event sync (automation off) — watch the links grow
        int[] last = {0};
        boolean viaEvents = waitFor(240, () -> (last[0] = countO9()) >= n);
        fact("O9", "event sync after an import with automation off: " + last[0] + "/" + n + " linked after " + (System.currentTimeMillis() - imported) / 1000 + " s; queue " + queue());
        if (!viaEvents) {
            long s0 = System.currentTimeMillis();
            Response all = desk().post(INT + "/imports/customers", Map.of());
            fact("O9", "Sync all customers -> " + code(all));
            boolean done = waitFor(900, () -> (last[0] = countO9()) >= n);
            fact("B13", "the full sync runs on the server (no browser open in this run): " + last[0] + "/" + n + " linked after " + (System.currentTimeMillis() - s0) / 1000 + " s; finished=" + done);
        }
        Response h = desk().get(INT + "/history?days=1&tz=UTC");
        fact("O9", "history today: " + WriteRunTest.trim(h.asString(), 500) + "; queue " + queue() + "; contact links " + linksBefore + " -> " + links("contact").size());
        // register every O9 record for cleanup
        for (Map<String, Object> l : links("contact"))
            if (String.valueOf(l.get("crm_display")).startsWith(tag)) {
                track("crm", CRM_CONTACTS, String.valueOf(l.get("crm_record_id")));
                track("desk", DESK_CONTACTS, String.valueOf(l.get("desk_record_id")));
            }
        for (int p = 1; p <= 10; p++) {
            List<Map<String, Object>> rows = crm().get("/modules/" + CRM_CONTACTS + "/records?page=" + p + "&per_page=100").jsonPath().getList("data");
            if (rows == null || rows.isEmpty()) break;
            for (Map<String, Object> r : rows) if (String.valueOf(r).contains("O9 " + RUN)) track("crm", CRM_CONTACTS, String.valueOf(r.get("id")));
        }
        Assert.assertTrue(last[0] >= n, "not every imported contact reached Desk: " + last[0] + "/" + n);
    }

    int countO9() {
        int c = 0;
        for (Map<String, Object> l : links("contact")) if (String.valueOf(l.get("crm_display")).contains("O9 " + RUN)) c++;
        return c;
    }

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        List<String[]> order = new ArrayList<>(CREATED);
        Collections.reverse(order);
        order.sort((x, y) -> Integer.compare(x[0].equals("desk") ? 0 : 1, y[0].equals("desk") ? 0 : 1));
        int ok = 0, bad = 0;
        for (String[] c : order) {
            try {
                int s = deleteRecord(c[0], c[1], c[2]).statusCode();
                if (s / 100 == 2 || s == 404) ok++;
                else {
                    bad++;
                    fact("CLEAN", "delete " + c[0] + " " + c[2] + " -> " + s);
                }
            } catch (Exception e) {
                bad++;
            }
        }
        fact("CLEAN", "deleted " + ok + " records, " + bad + " failed");
    }
}
