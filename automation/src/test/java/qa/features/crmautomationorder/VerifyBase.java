package qa.features.crmautomationorder;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Independent re-verification of the candidate bugs of the 18 Oct 2026 run (19 Oct 2026). Each case builds its own minimal
 * setup (one process per type, a fresh restricted QA layout per class, a control record where the assertion is negative),
 * reads results through the API with explicit 2xx checks, and writes every request/response to target/crm-verify.log.
 * Cases never assert a verdict: they record the facts ("FACT" lines) and the verdict is decided against Zoho in the report.
 * Names: "QA AEO V<n> <case> …". Run: mvnw test -Dsuite=crm-verify
 */
public abstract class VerifyBase extends OrderTestBase {
    private static final ObjectMapper JSON = new ObjectMapper();
    private static final Path LOG = Path.of("target", "crm-verify.log");

    /** Records whose approval may still be pending at the end of a case: Owner status-reset before the base cleanup. */
    protected final List<String[]> approvalHeld = new ArrayList<>();
    /** Records the engines created (converted contacts etc.): deleted before the base cleanup. */
    protected final List<String[]> extra = new ArrayList<>();
    /** Tags to delete after the case. */
    protected final List<String> tags = new ArrayList<>();

    protected static synchronized void out(String line) {
        System.out.println(line);
        try {
            Files.createDirectories(LOG.getParent());
            Files.writeString(LOG, Instant.now() + " " + line + "\n", StandardCharsets.UTF_8, StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (Exception ignored) {
            // best effort
        }
    }

    protected static String json(Object o) {
        try {
            return o == null ? "" : JSON.writeValueAsString(o);
        } catch (Exception e) {
            return String.valueOf(o);
        }
    }

    protected static String cut(String s, int n) {
        return s == null ? "null" : s.length() > n ? s.substring(0, n) + "…" : s;
    }

    /** Logs one call: who, method, path, request body, status, response body. Tokens never appear (they are headers). */
    protected static Response logged(String c, CrmUser who, String method, String path, Object body, Response r) {
        out("[V " + c + "] " + who.email.substring(0, who.email.indexOf('@')) + " " + method + " " + path
                + (body == null ? "" : " body=" + cut(json(body), 1500)) + " -> " + r.statusCode() + " " + cut(r.asString(), 2500));
        return r;
    }

    protected Response get(String c, CrmUser u, String path) {
        return logged(c, u, "GET", path, null, u.get(path));
    }

    protected Response post(String c, CrmUser u, String path, Object body) {
        return logged(c, u, "POST", path, body, u.post(path, body));
    }

    protected Response patch(String c, CrmUser u, String path, Object body) {
        return logged(c, u, "PATCH", path, body, u.patch(path, body));
    }

    protected Response del(String c, CrmUser u, String path) {
        return logged(c, u, "DELETE", path, null, u.delete(path));
    }

    protected static void fact(String c, String msg) {
        out("[V " + c + "] FACT " + msg);
    }

    protected static void on(String c, String what, Response r) {
        out("[V " + c + "] switch on " + what + " -> " + r.statusCode() + (r.statusCode() / 100 == 2 ? "" : " " + cut(r.asString(), 600)));
        if (r.statusCode() / 100 != 2) throw new IllegalStateException(what + " could not be switched on: " + r.statusCode());
    }

    protected Map<String, Object> caseGuard(String module, String c) {
        return CrmProcs.guard(module, nm(c, ""));
    }

    protected String who(String id) {
        if (id == null) return "null";
        for (CrmUser u : List.of(adminA(), adminB(), supervisor(), userN(), userV()))
            if (id.equals(u.id())) return u.email.substring(0, u.email.indexOf('@'));
        return id;
    }

    protected String owner(String module, String id) {
        return api.field(adminA(), module, id, "owner");
    }

    protected String val(String module, String id, String f) {
        return api.field(adminA(), module, id, f);
    }

    /** Lead fields: required + email (reviewed field) + lead_source chat. */
    protected Map<String, Object> leadFields(String c, String suffix) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, suffix)));
        f.put("email", "qa.aeo.v." + Integer.toHexString(nm(c, suffix).hashCode()) + "@qa.test");
        f.put("lead_source", "chat");
        return f;
    }

    protected String createLogged(String c, CrmUser as, String module, Map<String, Object> fields) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("layout_id", layout(module));
        body.put("data", CrmApi.data(fields));
        Response r = post(c, as, "/modules/" + module + "/records", body);
        CrmUser.ok(r, "create record");
        String id = r.jsonPath().getString("data.id");
        api.track(module, id);
        return id;
    }

    // ---------------- import ----------------

    /** One import (CSV header = field key) as {@code as}. Returns the final import status JSON. */
    protected JsonPath importRows(String c, CrmUser as, String module, List<Map<String, Object>> rows, String ruleId, boolean trigger, boolean manualApproval) {
        List<String> headers = new ArrayList<>(rows.get(0).keySet());
        StringBuilder csv = new StringBuilder(String.join(",", headers)).append('\n');
        for (Map<String, Object> r : rows) {
            List<String> cells = new ArrayList<>();
            for (String h : headers) cells.add("\"" + String.valueOf(r.get(h)).replace("\"", "\"\"") + "\"");
            csv.append(String.join(",", cells)).append('\n');
        }
        Response up = as.req().contentType("multipart/form-data")
                .multiPart("file", "qa-aeo-v.csv", csv.toString().getBytes(StandardCharsets.UTF_8), "text/csv")
                .post("/modules/" + module + "/import");
        logged(c, as, "POST(multipart)", "/modules/" + module + "/import", "csv=" + csv.toString().replace("\n", "\\n"), up);
        CrmUser.ok(up, "import upload");
        String sid = up.jsonPath().getString("data.session_id");
        String base = "/modules/" + module + "/import/" + sid;
        Map<String, Object> opts = new LinkedHashMap<>();
        opts.put("skip_empty", true);
        opts.put("replace_empty", null);
        opts.put("notify_email", false);
        opts.put("assign_to_user_id", null);
        opts.put("trigger_automation", trigger);
        opts.put("assignment_rule_id", ruleId);
        opts.put("manual_approval", manualApproval);
        opts.put("default_tag_ids", List.of());
        opts.put("duplicate_check_module_ids", List.of());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("mode", "add");
        body.put("match_field_key", null);
        body.put("layout_id", layout(module));
        List<Map<String, Object>> mapping = new ArrayList<>();
        for (String h : headers) mapping.add(kinded("header", h, "field", h));
        body.put("mapping", mapping);
        body.put("options", opts);
        CrmUser.ok(logged(c, as, "PUT", base + "/mapping", body, as.put(base + "/mapping", body)), "mapping");
        CrmUser.ok(post(c, as, base + "/validate", null), "validate");
        CrmUser.ok(post(c, as, base + "/execute", null), "execute");
        CrmApi.waitFor(150, () -> {
            String st = as.get(base).jsonPath().getString("data.status");
            return st != null && (st.startsWith("completed") || st.equals("partially_completed") || st.equals("failed"));
        });
        return CrmUser.ok(get(c, as, base), "import status").jsonPath();
    }

    /** Imports one row and returns the new record id (registered for cleanup). */
    protected String importOne(String c, CrmUser as, String module, Map<String, Object> row, String ruleId, boolean trigger) {
        String name = String.valueOf(row.get(CrmProcs.nameField(module)));
        JsonPath st = importRows(c, as, module, List.of(row), ruleId, trigger, false);
        if (st.getInt("data.created_count") < 1) throw new IllegalStateException("import created nothing: " + st.prettify());
        String id = api.importedRecordId(st.getString("data.session_id"), module, name, 90);
        fact(c, "imported '" + name + "' -> record " + id + " (import session " + st.getString("data.session_id") + ")");
        if (id == null) throw new IllegalStateException("imported record not found: " + name);
        api.track(module, id);
        return id;
    }

    // ---------------- conversion ----------------

    protected Response convert(String c, CrmUser as, String leadId) {
        Response r = post(c, as, "/modules/" + LEADS + "/records/" + leadId + "/convert", Map.of());
        if (r.statusCode() / 100 == 2) {
            List<Map<String, Object>> t = r.jsonPath().getList("data.targets");
            if (t != null) for (Map<String, Object> x : t)
                if (x.get("recordId") != null && x.get("moduleId") != null && !"skipped".equals(x.get("outcome")))
                    extra.add(new String[]{String.valueOf(x.get("moduleId")), String.valueOf(x.get("recordId"))});
        }
        return r;
    }

    // ---------------- cleanup ----------------

    @AfterMethod(alwaysRun = true)
    public void releaseBeforeCleanup() {
        for (String[] e : extra) {
            try {
                out("[V cleanup] delete engine-created " + e[0] + "/" + e[1] + " -> " + adminA().delete("/modules/" + e[0] + "/records/" + e[1]).statusCode());
            } catch (Exception ex) {
                out("[V cleanup] " + ex.getMessage());
            }
        }
        extra.clear();
        for (String[] h : approvalHeld) {
            try {
                String st = api.approvalState(h[0], h[1]);
                if ("pending_approval".equals(st) || "rejected".equals(st))
                    out("[V cleanup] Owner status-reset " + h[1] + " (" + st + ") -> " + owner().post("/workflow/approvals/records/" + h[0] + "/" + h[1] + "/status-reset",
                            Map.of("reason", "QA AEO V cleanup")).statusCode());
            } catch (Exception ex) {
                out("[V cleanup] reset " + h[1] + ": " + ex.getMessage());
            }
        }
        approvalHeld.clear();
        for (String t : tags) {
            try {
                out("[V cleanup] delete tag " + t + " -> " + adminB().delete("/modules/" + LEADS + "/tags/" + t).statusCode());
            } catch (Exception ex) {
                out("[V cleanup] tag " + ex.getMessage());
            }
        }
        tags.clear();
    }
}
