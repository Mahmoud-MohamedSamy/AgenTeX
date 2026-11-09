package qa.features.crmscreens;

import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmUser;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmscreens.CrmScreensFeature.*;

/**
 * R16 attachments on a record and on notes, API side (28 Oct 2026). Upload = POST /files (purpose attachment) → PUT bytes to
 * the presigned URL → POST /files/{id}/confirm → POST /modules/{m}/records/{r}/attachments {file_id, file_name, content_type, size}.
 * Small files only: the lane's uplink is ~11–23 KB/s, so the size limit is checked through the declared size.
 * One QA lead holds everything; it is deleted and purged afterwards (attachment rows go with it).
 */
public class AttachmentsApiTest {
    private final List<String> leads = new ArrayList<>();
    private String lead;
    private String pdfFile;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        lead = createLead(api(), QA + "ATT " + tag(), leads);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        removeLeads(api(), leads);
    }

    @CaseId("AT-01")
    @Test(groups = {"crmscreens", "r16", "api"}, description = "A small PDF uploads, attaches, lists and downloads byte-for-byte")
    public void uploadAttachDownload() {
        byte[] b = ("%PDF-1.4 " + QA + "AT-01 " + tag()).getBytes(StandardCharsets.UTF_8);
        pdfFile = upload(api(), "qa-r2sc-at01.pdf", "application/pdf", b);
        Response a = attach(api(), lead, pdfFile, "qa-r2sc-at01.pdf", "application/pdf", b.length);
        Assert.assertEquals(a.statusCode(), 201, "attach: " + body(a, 300));
        List<Map<String, Object>> list = api().get("/modules/" + LEADS + "/records/" + lead + "/attachments").jsonPath().getList("data");
        Assert.assertTrue(list.stream().anyMatch(x -> "qa-r2sc-at01.pdf".equals(x.get("file_name"))), "attachment not listed");
        Response d = CrmUser.ok(api().post("/files/" + pdfFile + "/download", m("file_id", pdfFile, "vouching_app_key", "crm")), "download url");
        Map<String, String> got = fetch(d.jsonPath().getString("data.download_url"));
        fact("AT-01", "attach 201; listed; download " + got.get("status") + " " + got.get("content-type"));
        Assert.assertEquals(got.get("status"), "200");
        Assert.assertEquals(got.get("body"), new String(b, StandardCharsets.UTF_8), "downloaded bytes differ");
    }

    @CaseId("AT-02")
    @Test(groups = {"crmscreens", "r16", "api", "NDC-2628"}, description = "File types: images, audio, video, PDF, Office, CSV accepted; others refused (MS-010: Zoho accepts any type)")
    public void typeMatrix() {
        Map<String, String> types = new LinkedHashMap<>();
        types.put("qa-r2sc.png", "image/png");
        types.put("qa-r2sc.jpg", "image/jpeg");
        types.put("qa-r2sc.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        types.put("qa-r2sc.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        types.put("qa-r2sc.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
        types.put("qa-r2sc.csv", "text/csv");
        types.put("qa-r2sc.mp3", "audio/mpeg");
        types.put("qa-r2sc.mp4", "video/mp4");
        types.put("qa-r2sc.txt", "text/plain");
        types.put("qa-r2sc.log", "text/plain");
        types.put("qa-r2sc.json", "application/json");
        types.put("qa-r2sc.zip", "application/zip");
        types.put("qa-r2sc.eml", "message/rfc822");
        types.put("qa-r2sc.html", "text/html");
        types.put("qa-r2sc.exe", "application/x-msdownload");
        Map<String, String> res = new LinkedHashMap<>();
        List<String> refusedCommon = new ArrayList<>();
        for (Map.Entry<String, String> e : types.entrySet()) {
            byte[] b = ("QA R2SC " + e.getKey()).getBytes(StandardCharsets.UTF_8);
            Response s = startUpload(api(), e.getKey(), e.getValue(), b.length);
            if (s.statusCode() >= 300) {
                res.put(e.getKey(), "start " + s.statusCode());
                continue;
            }
            String fid = s.jsonPath().getString("data.file_id");
            putBytes(s.jsonPath().getString("data.upload_url"), b, e.getValue());
            api().post("/files/" + fid + "/confirm", m("file_id", fid, "size_bytes", b.length));
            Response a = attach(api(), lead, fid, e.getKey(), e.getValue(), b.length);
            res.put(e.getKey(), String.valueOf(a.statusCode()));
            if (a.statusCode() != 201 && e.getKey().matches(".*\\.(txt|log|json|zip|eml)")) refusedCommon.add(e.getKey());
        }
        fact("AT-02", res.toString());
        for (String k : List.of("qa-r2sc.png", "qa-r2sc.jpg", "qa-r2sc.docx", "qa-r2sc.xlsx", "qa-r2sc.pptx", "qa-r2sc.csv", "qa-r2sc.mp3", "qa-r2sc.mp4"))
            Assert.assertEquals(res.get(k), "201", k + " should be accepted");
        Assert.assertTrue(res.get("qa-r2sc.exe").startsWith("start 4"), "an .exe must be refused");
        // Zoho attaches any file type (MS-010 / NDC-2628 gap): common business files must not be refused
        Assert.assertTrue(refusedCommon.isEmpty(), "common file types refused (gap MS-010): " + refusedCommon);
    }

    @CaseId("AT-03")
    @Test(groups = {"crmscreens", "r16", "api"}, description = "Size limit: declared 16 MB accepted, 16 MB + 1 refused with a clear message; 0 and negative refused")
    public void sizeLimit() {
        Response ok = startUpload(api(), "qa-r2sc-16mb.pdf", "application/pdf", ATTACHMENT_MAX);
        Response over = startUpload(api(), "qa-r2sc-16mb1.pdf", "application/pdf", ATTACHMENT_MAX + 1);
        Response twenty = startUpload(api(), "qa-r2sc-20mb.pdf", "application/pdf", 20L * 1024 * 1024);
        Response zero = startUpload(api(), "qa-r2sc-0.pdf", "application/pdf", 0);
        Response neg = startUpload(api(), "qa-r2sc-neg.pdf", "application/pdf", -1);
        fact("AT-03", "16MB " + ok.statusCode() + "; 16MB+1 " + body(over, 200) + "; 20MB " + twenty.statusCode() + "; 0 " + zero.statusCode() + "; -1 " + neg.statusCode());
        Assert.assertEquals(ok.statusCode(), 201);
        Assert.assertEquals(over.statusCode(), 422);
        Assert.assertTrue(over.asString().contains("16777216"), "refusal names the limit");
        Assert.assertEquals(zero.statusCode(), 400);
        Assert.assertEquals(neg.statusCode(), 400);
    }

    @CaseId("AT-04")
    @Test(groups = {"crmscreens", "r16", "api", "R2SC-B2"}, description = "An attachment must point to an uploaded file: a pending (never uploaded) or unknown file id is refused")
    public void attachRequiresRealFile() {
        Response pending = CrmUser.ok(startUpload(api(), "qa-r2sc-ghost.pdf", "application/pdf", 2048), "start ghost");
        Response a1 = attach(api(), lead, pending.jsonPath().getString("data.file_id"), "qa-r2sc-ghost.pdf", "application/pdf", 2048);
        Response a2 = attach(api(), lead, "00000000-0000-4000-8000-000000000001", "qa-r2sc-random.pdf", "application/pdf", 1);
        fact("AT-04", "pending file -> " + body(a1, 120) + "; unknown file id -> " + body(a2, 120));
        Assert.assertTrue(a1.statusCode() >= 400, "attachment to a never-uploaded (pending) file was accepted: " + a1.statusCode());
        Assert.assertTrue(a2.statusCode() >= 400, "attachment to an unknown file id was accepted: " + a2.statusCode());
    }

    @CaseId("AT-05")
    @Test(groups = {"crmscreens", "r16", "api", "R2SC-B2"}, dependsOnMethods = "uploadAttachDownload",
            description = "The attachment row keeps the real file size, not the size the client claims")
    public void sizeComesFromFile() {
        Response a = attach(api(), lead, pdfFile, "qa-r2sc-claim.pdf", "application/pdf", 999_999_999L);
        long stored = a.statusCode() == 201 ? a.jsonPath().getLong("data.size") : -1;
        fact("AT-05", "claimed 999999999 -> " + a.statusCode() + " stored size " + stored);
        Assert.assertTrue(a.statusCode() >= 400 || stored < 1000, "the client-claimed size was stored: " + stored);
    }

    @CaseId("AT-06")
    @Test(groups = {"crmscreens", "r16", "api", "security", "R2SC-B1"}, description = "An attached SVG must not run script on the app origin (download link served inline as image/svg+xml)")
    public void svgNotActiveOnAppOrigin() {
        byte[] b = "<svg xmlns=\"http://www.w3.org/2000/svg\"><text x=\"5\" y=\"20\">QA R2SC</text><script>/*qa*/</script></svg>".getBytes(StandardCharsets.UTF_8);
        String fid = upload(api(), "qa-r2sc-at06.svg", "image/svg+xml", b);
        Response a = attach(api(), lead, fid, "qa-r2sc-at06.svg", "image/svg+xml", b.length);
        Response d = CrmUser.ok(api().post("/files/" + fid + "/download", m("file_id", fid, "vouching_app_key", "crm")), "download url");
        Map<String, String> got = fetch(d.jsonPath().getString("data.download_url"));
        fact("AT-06", "attach " + a.statusCode() + "; link host " + got.get("host") + " " + got.get("status") + " type " + got.get("content-type")
                + " disposition '" + got.get("content-disposition") + "' csp '" + got.get("content-security-policy") + "'");
        boolean inlineOnAppOrigin = a.statusCode() == 201 && got.get("host").equals(java.net.URI.create(BASE).getHost())
                && got.get("content-type").contains("svg") && !got.get("content-disposition").contains("attachment") && got.get("content-security-policy").isEmpty();
        Assert.assertFalse(inlineOnAppOrigin, "SVG attachment is served inline from the app origin with no CSP / no attachment disposition: its script runs with the user's cookies");
    }

    @CaseId("AT-07")
    @Test(groups = {"crmscreens", "r16", "api"}, dependsOnMethods = "uploadAttachDownload", description = "A note can carry attachments; a refused type or empty note is refused; timeline logs the note")
    public void noteAttachments() {
        Response n1 = api().post("/modules/" + LEADS + "/records/" + lead + "/notes", m("body", QA + "note with file", "attachments",
                List.of(m("file_id", pdfFile, "file_name", "qa-r2sc-at01.pdf", "content_type", "application/pdf", "size", 30))));
        Response n2 = api().post("/modules/" + LEADS + "/records/" + lead + "/notes", m("body", "", "attachments", List.of()));
        Response n3 = api().post("/modules/" + LEADS + "/records/" + lead + "/notes", m("body", QA + "note txt", "attachments",
                List.of(m("file_id", pdfFile, "file_name", "qa-r2sc.txt", "content_type", "text/plain", "size", 30))));
        qa.core.base.Waits.sleep(4000);
        List<Map<String, Object>> feed = api().get("/timeline/records/leads/" + lead + "/feed").jsonPath().getList("data.data");
        boolean logged = feed != null && feed.stream().anyMatch(e -> "NoteAdded".equals(e.get("entry_type")));
        fact("AT-07", "note+file " + n1.statusCode() + "; empty " + n2.statusCode() + "; txt " + n3.statusCode() + "; NoteAdded in timeline " + logged);
        Assert.assertEquals(n1.statusCode(), 201);
        Assert.assertEquals(n2.statusCode(), 400);
        Assert.assertEquals(n3.statusCode(), 400);
        Assert.assertTrue(logged, "note not in the timeline");
    }

    @CaseId("AT-08")
    @Test(groups = {"crmscreens", "r16", "api"}, dependsOnMethods = "uploadAttachDownload", description = "Removing an attachment: 204, gone from the list, second delete 404, timeline AttachmentRemoved")
    public void removeAttachment() {
        List<Map<String, Object>> list = api().get("/modules/" + LEADS + "/records/" + lead + "/attachments").jsonPath().getList("data");
        String id = String.valueOf(list.stream().filter(x -> "qa-r2sc-at01.pdf".equals(x.get("file_name"))).findFirst().orElseThrow().get("id"));
        int d1 = api().delete("/modules/" + LEADS + "/records/" + lead + "/attachments/" + id).statusCode();
        int d2 = api().delete("/modules/" + LEADS + "/records/" + lead + "/attachments/" + id).statusCode();
        List<Map<String, Object>> after = api().get("/modules/" + LEADS + "/records/" + lead + "/attachments").jsonPath().getList("data");
        qa.core.base.Waits.sleep(3000);
        List<Map<String, Object>> feed = api().get("/timeline/records/leads/" + lead + "/feed").jsonPath().getList("data.data");
        boolean logged = feed != null && feed.stream().anyMatch(e -> "AttachmentRemoved".equals(e.get("entry_type")));
        fact("AT-08", "delete " + d1 + " then " + d2 + "; still listed " + after.stream().anyMatch(x -> id.equals(String.valueOf(x.get("id")))) + "; AttachmentRemoved " + logged);
        Assert.assertEquals(d1, 204);
        Assert.assertEquals(d2, 404);
        Assert.assertTrue(logged, "removal not in the timeline");
    }
}
