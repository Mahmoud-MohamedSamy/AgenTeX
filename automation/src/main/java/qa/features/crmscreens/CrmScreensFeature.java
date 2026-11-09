package qa.features.crmscreens;

import io.restassured.response.Response;
import qa.core.config.Config;
import qa.features.crmautomationorder.CrmOrderFeature;
import qa.features.crmautomationorder.CrmUser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * crmscreens — the go-live Round 2 "screen checks" lane (28 Oct 2026, build index-De3hTVb3.js): G05 Arabic / RTL,
 * G06 shortcuts, G09 performance, S07 flights / bookings, R16 attachments, R23 mass delete, S01 work queue.
 * API work runs as CRM Admin B by default (-Dcrm.apiUser), never as the owner. All data starts with "QA R2SC".
 * Facts found by hand first: executions/execu_2026-10-27_crm-golive-round2/screens/ (results.md, after/*.json).
 */
public final class CrmScreensFeature {
    public static final String NAME = "crmscreens";
    public static final String QA = "QA R2SC ";
    public static final String LEADS = CrmOrderFeature.LEADS;
    public static final String LEADS_LAYOUT = CrmOrderFeature.LEADS_STANDARD;
    public static final String DEALS = CrmOrderFeature.DEALS;
    public static final String BASE = CrmOrderFeature.BASE;
    /** Attachment limit the server reports for purpose 'attachment' (28 Oct 2026). Zoho: 20 MB per file (docs; not checked live). */
    public static final long ATTACHMENT_MAX = 16L * 1024 * 1024;

    private CrmScreensFeature() {
    }

    /** The API account of this lane: CRM Admin B unless -Dcrm.apiUser says otherwise. Never the owner. */
    public static CrmUser api() {
        return CrmUser.as(Config.get("crm.apiUser", CrmOrderFeature.ADMIN_B));
    }

    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    public static String tag() {
        return String.valueOf(System.currentTimeMillis() % 1_000_000);
    }

    public static void fact(String caseId, String text) {
        qa.features.crmhierarchy.CrmHierarchyApi.fact(caseId, text);
    }

    public static String body(Response r, int max) {
        String s = r.asString();
        return r.statusCode() + " " + (s == null ? "" : s.substring(0, Math.min(max, s.length())));
    }

    // ---------------- leads ----------------

    public static String createLead(CrmUser as, String name, List<String> ledger) {
        List<Map<String, Object>> d = new ArrayList<>();
        for (String[] kv : new String[][]{{"name", name}, {"first_name", name}, {"phone", "010" + String.format("%08d", Math.floorMod(name.hashCode(), 100_000_000))}, {"single_line_3_9", "QA R2SC"}})
            d.add(m("field", kv[0], "value", m("kind", "string", "value", kv[1])));
        String id = CrmUser.ok(as.post("/modules/" + LEADS + "/records", m("layout_id", LEADS_LAYOUT, "data", d)), "create lead").jsonPath().getString("data.id");
        ledger.add(id);
        return id;
    }

    /** Deletes the leads (404 is fine) and purges their bin items. */
    public static void removeLeads(CrmUser as, List<String> ids) {
        for (String id : ids) as.delete("/modules/" + LEADS + "/records/" + id);
        if (ids.isEmpty()) return;
        List<String> items = new ArrayList<>();
        for (Map<String, Object> i : qa.features.crmrecords.CrmRecordsApi.binItems(as))
            if (ids.contains(String.valueOf(i.get("record_id")))) items.add(String.valueOf(i.get("id")));
        for (int i = 0; i < items.size(); i += 50)
            fact("cleanup", "purged " + Math.min(50, items.size() - i) + " QA R2SC bin items -> "
                    + qa.features.crmrecords.CrmRecordsApi.purge(as, items.subList(i, Math.min(items.size(), i + 50))).statusCode());
    }

    // ---------------- files ----------------

    /** POST /files for an attachment: the response (201 with file_id + upload_url, or the refusal). */
    public static Response startUpload(CrmUser as, String name, String type, long size) {
        return as.post("/files", m("app_key", "crm", "purpose", "attachment", "ownership_class", "tenant_file", "original_filename", name,
                "declared_content_type", type, "declared_size_bytes", size));
    }

    /** PUT the bytes to the presigned URL (no app token); returns the HTTP status or -1 on a network error. */
    public static int putBytes(String uploadUrl, byte[] bytes, String type) {
        try {
            String u = uploadUrl.startsWith("http") ? uploadUrl : BASE + uploadUrl;
            HttpClient c = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();
            return c.send(HttpRequest.newBuilder(URI.create(u)).timeout(Duration.ofSeconds(240)).header("Content-Type", type)
                    .PUT(HttpRequest.BodyPublishers.ofByteArray(bytes)).build(), HttpResponse.BodyHandlers.discarding()).statusCode();
        } catch (Exception e) {
            return -1;
        }
    }

    /** Whole upload: start, PUT, confirm. Returns the file id (confirmed) or throws. */
    public static String upload(CrmUser as, String name, String type, byte[] bytes) {
        Response r = CrmUser.ok(startUpload(as, name, type, bytes.length), "start upload " + name);
        String fid = r.jsonPath().getString("data.file_id");
        int put = putBytes(r.jsonPath().getString("data.upload_url"), bytes, type);
        if (put / 100 != 2) throw new IllegalStateException("PUT to storage for " + name + " -> " + put);
        CrmUser.ok(as.post("/files/" + fid + "/confirm", m("file_id", fid, "size_bytes", bytes.length)), "confirm " + name);
        return fid;
    }

    public static Response attach(CrmUser as, String recordId, String fileId, String name, String type, long size) {
        return as.post("/modules/" + LEADS + "/records/" + recordId + "/attachments", m("file_id", fileId, "file_name", name, "content_type", type, "size", size));
    }

    /** Fetches a URL without the app token (presigned download links); returns status + selected headers + body start. */
    public static Map<String, String> fetch(String url) {
        Map<String, String> out = new LinkedHashMap<>();
        try {
            String u = url.startsWith("http") ? url : BASE + url;
            HttpResponse<String> r = HttpClient.newHttpClient().send(HttpRequest.newBuilder(URI.create(u)).timeout(Duration.ofSeconds(60)).GET().build(),
                    HttpResponse.BodyHandlers.ofString());
            out.put("status", String.valueOf(r.statusCode()));
            out.put("host", URI.create(u).getHost());
            out.put("content-type", r.headers().firstValue("content-type").orElse(""));
            out.put("content-disposition", r.headers().firstValue("content-disposition").orElse(""));
            out.put("content-security-policy", r.headers().firstValue("content-security-policy").orElse(""));
            out.put("body", r.body().substring(0, Math.min(200, r.body().length())));
        } catch (Exception e) {
            out.put("status", "-1 " + e.getClass().getSimpleName());
        }
        return out;
    }

    // ---------------- timing ----------------

    public static long median(List<Long> v) {
        List<Long> s = new ArrayList<>(v);
        Collections.sort(s);
        return s.get(s.size() / 2);
    }

    public static long worst(List<Long> v) {
        return Collections.max(v);
    }
}
