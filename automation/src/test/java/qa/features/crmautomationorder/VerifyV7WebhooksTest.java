package qa.features.crmautomationorder;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.deskworkflowrules.WebhookSite;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmautomationorder.CrmOrderFeature.LEADS;
import static qa.features.deskworkflowrules.Rules.kinded;

/**
 * Every place a CRM webhook can be set (user request 25 Oct 2026; webhook.site allowed by the user the same day):
 * workflow instant / scheduled / failing / slow / secret header, Actions library, approval after-approve and
 * after-reject, blueprint After and SLA escalation, review process webhookUrl, and URL validation. Each case gets
 * a fresh webhook.site receiver and records what arrived (method, headers, body) next to what TAVI logged.
 * Session V7. Run: runcases.sh VerifyV7WebhooksTest "WH-01,…" (group crm-webhooks).
 */
public class VerifyV7WebhooksTest extends VerifyBase {
    @Override protected String session() { return "V7"; }
    @Override protected CrmUser processAdmin() { return adminB(); }

    private static final String SECRET = "Bearer qa-aeo-v7-secret-0001";
    private final List<WebhookSite> hooks = new ArrayList<>();
    private final List<String> actionIds = new ArrayList<>();

    @AfterMethod(alwaysRun = true)
    public void dropHooks() {
        for (String a : actionIds) out("[V cleanup] delete action " + a + " -> " + adminB().delete("/workflow/actions/" + a).statusCode());
        actionIds.clear();
        for (WebhookSite h : hooks) h.delete();
        hooks.clear();
    }

    private WebhookSite hook(String c, int status, int delay) {
        WebhookSite h = WebhookSite.create(status, delay);
        hooks.add(h);
        fact(c, "receiver " + h.url() + " answers " + status + (delay > 0 ? " after " + delay + "s" : ""));
        return h;
    }

    private static String template(String c) {
        return "{\"case\":\"" + c + "\",\"recordId\":\"${recordId}\",\"moduleId\":\"${moduleId}\",\"first_name\":\"${first_name}\",\"lead_source\":\"${lead_source}\",\"owner\":\"${owner}\"}";
    }

    /** Workflow / approval action (same shape in both builders). */
    private static Map<String, Object> wfHook(String c, String url, String method, int timeout, Map<String, String> headers) {
        Map<String, Object> a = new LinkedHashMap<>();
        a.put("type", "Webhook");
        a.put("order", 0);
        a.put("delaySeconds", 0);
        a.put("url", url);
        a.put("method", method);
        a.put("bodyTemplate", template(c));
        a.put("headers", headers == null ? Map.of("X-QA-Case", c) : headers);
        a.put("timeoutSeconds", timeout);
        return a;
    }

    private static Map<String, Object> bpHook(String c, String url) {
        // -Dwhminimal=true: exactly what the designer creates ({kind, url, verb}), to rule out the extra keys
        if (Boolean.getBoolean("whminimal")) return kinded("kind", "webhook", "url", url, "verb", "POST");
        return kinded("kind", "webhook", "url", url, "verb", "POST", "headers", Map.of("X-QA-Case", c), "bodyTemplate", template(c), "body", template(c));
    }

    /** One line per request that reached the receiver: when, method, the X-QA-Case / Authorization headers, body. */
    @SuppressWarnings("unchecked")
    private String seen(List<Map<String, Object>> reqs) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> r : reqs) {
            Map<String, Object> h = r.get("headers") instanceof Map ? (Map<String, Object>) r.get("headers") : Map.of();
            Map<String, Object> pick = new LinkedHashMap<>();
            for (String k : List.of("x-qa-case", "authorization", "content-type", "user-agent", "x-tavi-signature", "x-signature", "x-webhook-signature"))
                if (h.get(k) != null) pick.put(k, h.get(k));
            for (String k : h.keySet()) if (k.startsWith("x-") && !pick.containsKey(k) && !k.startsWith("x-forwarded") && !k.startsWith("x-real")) pick.put(k, h.get(k));
            out.add(r.get("created_at") + " " + r.get("method") + " headers=" + pick + " body=" + cut(String.valueOf(r.get("content")), 700));
        }
        return out.toString();
    }

    private String rule(String c, CrmProcs.Wf w) {
        String id = api.workflowRule(w.build());
        on(c, "rule " + id, api.setWorkflowActive(id, true));
        return id;
    }

    private String lead(String c, String sfx) {
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, sfx)));
        f.put("lead_source", "web");
        return createLogged(c, adminB(), LEADS, f);
    }

    /** TAVI's own record of the webhook calls for a record: execution outcome + dispatches (status, attempts, error). */
    @SuppressWarnings("unchecked")
    private String dispatches(String recordId) {
        List<String> out = new ArrayList<>();
        for (Map<String, Object> e : api.executions(recordId)) {
            Response d = adminB().get("/workflow/executions/" + e.get("id"));
            Object disp = d.statusCode() == 200 ? d.jsonPath().get("data.dispatches") : d.statusCode();
            out.add(e.get("triggerKind") + "/" + e.get("outcome") + " dispatches=" + cut(json(disp), 900));
        }
        return out.toString();
    }

    // ------------------------------------------------------------ workflow

    @CaseId("WH-01")
    @Test(groups = {"crm-webhooks"}, description = "Workflow instant webhook: POST with merge fields and a custom header reaches the receiver")
    public void wh01WorkflowInstant() {
        String c = "WH-01";
        WebhookSite h = hook(c, 200, 0);
        CrmProcs.Wf w = CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate();
        rule(c, w.rawAction(wfHook(c, h.url(), "Post", 10, null)));
        String id = lead(c, "lead");
        List<Map<String, Object>> got = h.await(1, 90);
        fact(c, "RESULT lead " + id + " requests=" + got.size() + " " + seen(got));
        fact(c, "TAVI dispatches " + dispatches(id));
    }

    @CaseId("WH-02")
    @Test(groups = {"crm-webhooks"}, description = "Workflow webhook methods PUT and PATCH")
    public void wh02Methods() {
        String c = "WH-02";
        for (String m : List.of("Put", "Patch")) {
            String cm = c + m.substring(0, 2);
            WebhookSite h = hook(cm, 200, 0);
            rule(cm, CrmProcs.workflow(LEADS, cm + " WF").guardCase(cm).onCreate().rawAction(wfHook(cm, h.url(), m, 10, null)));
            String id = lead(cm, "lead");
            List<Map<String, Object>> got = h.await(1, 90);
            fact(cm, "RESULT method " + m + " lead " + id + " requests=" + got.size() + " " + seen(got));
        }
    }

    @CaseId("WH-03")
    @Test(groups = {"crm-webhooks"}, description = "Workflow scheduled webhook (2 minutes): arrives after the delay, not before")
    public void wh03Scheduled() {
        String c = "WH-03";
        WebhookSite h = hook(c, 200, 0);
        Map<String, Object> a = wfHook(c, h.url(), "Post", 10, null);
        a.put("delaySeconds", 120);
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(a));
        long t0 = System.currentTimeMillis();
        String id = lead(c, "lead");
        CrmUser.sleep(60_000);
        fact(c, "+60s requests=" + h.requests().size() + " (expected 0)");
        List<Map<String, Object>> got = h.await(1, 240);
        fact(c, "RESULT lead " + id + " requests=" + got.size() + " first after ~" + (System.currentTimeMillis() - t0) / 1000 + "s " + seen(got));
        fact(c, "TAVI dispatches " + dispatches(id));
    }

    @CaseId("WH-04")
    @Test(groups = {"crm-webhooks"}, description = "Receiver answers 500: is it retried, and what does TAVI log")
    public void wh04Failure() {
        String c = "WH-04";
        WebhookSite h = hook(c, 500, 0);
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c, h.url(), "Post", 10, null)));
        long t0 = System.currentTimeMillis();
        String id = lead(c, "lead");
        for (int i = 0; i < 6; i++) {
            CrmUser.sleep(60_000);
            fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s requests=" + h.requests().size());
        }
        fact(c, "RESULT lead " + id + " " + seen(h.requests()));
        fact(c, "TAVI dispatches " + dispatches(id));
    }

    @CaseId("WH-05")
    @Test(groups = {"crm-webhooks"}, description = "Slow receiver (10 s) with a 3 s timeout: the call times out and is logged as failed")
    public void wh05Timeout() {
        String c = "WH-05";
        WebhookSite h = hook(c, 200, 10);
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c, h.url(), "Post", 3, null)));
        String id = lead(c, "lead");
        CrmUser.sleep(120_000);
        fact(c, "RESULT lead " + id + " requests=" + h.requests().size() + " " + seen(h.requests()));
        fact(c, "TAVI dispatches " + dispatches(id));
    }

    @CaseId("WH-06")
    @Test(groups = {"crm-webhooks"}, description = "Secret header: masked when the rule is read back, sent in full to the receiver")
    public void wh06SecretHeader() {
        String c = "WH-06";
        WebhookSite h = hook(c, 200, 0);
        Map<String, String> headers = new LinkedHashMap<>();
        headers.put("X-QA-Case", c);
        headers.put("Authorization", SECRET);
        String r = rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c, h.url(), "Post", 10, headers)));
        Object back = CrmUser.ok(adminB().get("/workflow/rules/" + r), "rule").jsonPath().get("data.actions[0].headers");
        String stored = String.valueOf(back).replace(SECRET, "<full secret>");
        String id = lead(c, "lead");
        List<Map<String, Object>> got = h.await(1, 90);
        String arrived = seen(got).replace(SECRET, "<full secret>");
        fact(c, "RESULT headers read back " + stored + "; receiver got " + got.size() + " " + arrived);
    }

    @CaseId("WH-07")
    @Test(groups = {"crm-webhooks"}, description = "Actions library: a saved Webhook action used by a rule fires")
    public void wh07SavedAction() {
        String c = "WH-07";
        WebhookSite h = hook(c, 200, 0);
        get(c, adminB(), "/workflow/actions?moduleId=" + LEADS + "&type=Webhook");
        Map<String, Object> a = wfHook(c, h.url(), "Post", 10, null);
        String aid = null;
        List<Map<String, Object>> shapes = new ArrayList<>();
        Map<String, Object> flat = new LinkedHashMap<>(a);
        flat.remove("order");
        flat.put("name", CrmProcs.name(c + " saved webhook"));
        flat.put("moduleId", LEADS);
        flat.put("appKey", "crm");
        shapes.add(flat);
        shapes.add(kinded("name", CrmProcs.name(c + " saved webhook"), "moduleId", LEADS, "appKey", "crm", "type", "Webhook", "config", a));
        shapes.add(kinded("name", CrmProcs.name(c + " saved webhook"), "moduleId", LEADS, "appKey", "crm", "type", "Webhook", "action", a));
        for (Map<String, Object> s : shapes) {
            Response cr = post(c, adminB(), "/workflow/actions", s);
            if (cr.statusCode() / 100 == 2) {
                aid = cr.jsonPath().getString("data.id");
                actionIds.add(aid);
                break;
            }
        }
        if (aid == null) {
            fact(c, "RESULT could not save a Webhook action (see responses above)");
            return;
        }
        get(c, adminB(), "/workflow/actions/" + aid);
        Map<String, Object> ref = new LinkedHashMap<>(a);
        ref.put("standaloneActionId", aid);
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(ref));
        get(c, adminB(), "/workflow/actions/" + aid + "/usage");
        String id = lead(c, "lead");
        List<Map<String, Object>> got = h.await(1, 90);
        fact(c, "RESULT saved action " + aid + " lead " + id + " requests=" + got.size() + " " + seen(got));
        fact(c, "TAVI dispatches " + dispatches(id));
    }

    // ------------------------------------------------------------ approval

    @SuppressWarnings("unchecked")
    private String approvalWith(String c, String listKey, Map<String, Object> action) {
        Map<String, Object> body = CrmProcs.approvalProcess(LEADS, c + " appr", true, false, caseGuard(LEADS, c),
                List.of(CrmProcs.levelUsers(supervisor().id())), List.of(adminB().id()));
        ((List<Map<String, Object>>) body.get("rules")).get(0).put(listKey, new ArrayList<>(List.of(action)));
        String p = api.approvalProcess(body);
        get(c, adminB(), "/workflow/approval-processes/" + p);
        on(c, "approval " + p, api.setApprovalActive(p, true));
        return p;
    }

    @CaseId("WH-08")
    @Test(groups = {"crm-webhooks"}, description = "Approval: Call Webhook after final approval fires on approve only")
    public void wh08ApprovalApprove() {
        String c = "WH-08";
        WebhookSite h = hook(c, 200, 0);
        approvalWith(c, "finalActions", wfHook(c, h.url(), "Post", 10, null));
        String id = lead(c, "lead");
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        CrmUser.sleep(20_000);
        fact(c, "while pending requests=" + h.requests().size() + " (expected 0)");
        Response a = api.approve(supervisor(), LEADS, id);
        fact(c, "approve -> " + a.statusCode() + "; state " + api.approvalState(LEADS, id));
        List<Map<String, Object>> got = h.await(1, 90);
        fact(c, "RESULT lead " + id + " requests=" + got.size() + " " + seen(got));
    }

    @CaseId("WH-09")
    @Test(groups = {"crm-webhooks"}, description = "Approval: Call Webhook after rejection fires on reject only")
    public void wh09ApprovalReject() {
        String c = "WH-09";
        WebhookSite h = hook(c, 200, 0);
        approvalWith(c, "rejectionActions", wfHook(c, h.url(), "Post", 10, null));
        String id = lead(c, "lead");
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        Response r = api.reject(supervisor(), LEADS, id);
        fact(c, "reject -> " + r.statusCode() + "; state " + api.approvalState(LEADS, id));
        List<Map<String, Object>> got = h.await(1, 90);
        fact(c, "RESULT lead " + id + " requests=" + got.size() + " " + seen(got));
    }

    // ------------------------------------------------------------ blueprint

    @CaseId("WH-10")
    @Test(groups = {"crm-webhooks"}, description = "Blueprint After-transition webhook fires once on the transition")
    @SuppressWarnings("unchecked")
    public void wh10BlueprintAfter() {
        String c = "WH-10";
        WebhookSite h = hook(c, 200, 0);
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), List.of(bpHook(c, h.url())));
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        get(c, adminB(), "/modules/" + LEADS + "/blueprints/" + bp);
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, adminB(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        CrmUser.sleep(10_000);
        fact(c, "before transition requests=" + h.requests().size() + " (expected 0)");
        String tid = null;
        for (Map<String, Object> t : (List<Map<String, Object>>) (List<?>) api.blueprintState(adminB(), LEADS, id).getList("data.transitions"))
            if (String.valueOf(t.get("transitionName")).contains("chat to web")) tid = String.valueOf(t.get("transitionId"));
        if (tid == null) throw new IllegalStateException("transition 'chat to web' not offered");
        Response r = api.transition(adminB(), LEADS, id, tid, Map.of());
        fact(c, "transition -> " + r.statusCode() + " " + cut(r.asString(), 200));
        List<Map<String, Object>> got = h.await(1, 90);
        CrmUser.sleep(15_000);
        got = h.requests();
        fact(c, "RESULT lead " + id + " state=" + val(LEADS, id, "lead_source") + " requests=" + got.size() + " " + seen(got));
    }

    @CaseId("WH-11")
    @Test(groups = {"crm-webhooks"}, description = "Blueprint state SLA (1 minute) escalation webhook")
    @SuppressWarnings("unchecked")
    public void wh11BlueprintSla() {
        String c = "WH-11";
        WebhookSite h = hook(c, 200, 0);
        Map<String, Object> body = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                List.of("chat", "web", "referral"), null);
        Map<String, Object> def = (Map<String, Object>) body.get("definition");
        Map<String, Object> s0 = new LinkedHashMap<>(((List<Map<String, Object>>) def.get("states")).get(0));
        s0.put("slaMinutes", 1);
        // -Dwh11last=true puts the webhook after the field update (rules out "the first escalation action is skipped")
        s0.put("slaEscalation", Boolean.getBoolean("wh11last")
                ? List.of(CrmProcs.setField("description", "QA WH-11 SLA escalated"), bpHook(c, h.url()))
                : List.of(bpHook(c, h.url()), CrmProcs.setField("description", "QA WH-11 SLA escalated")));
        ((List<Map<String, Object>>) def.get("states")).set(0, s0);
        String bp = api.blueprint(LEADS, body);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c, "lead")));
        f.put("lead_source", "chat");
        long t0 = System.currentTimeMillis();
        String id = createLogged(c, adminB(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        fact(c, "slaDueAt " + api.blueprintState(adminB(), LEADS, id).getList("data.states.slaDueAt"));
        boolean fu = false;
        int n = 0;
        for (int i = 0; i < 16 && (n == 0 || !fu); i++) {
            CrmUser.sleep(30_000);
            n = h.requests().size();
            fu = "QA WH-11 SLA escalated".equals(val(LEADS, id, "description"));
            fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s requests=" + n + " fieldUpdate=" + fu);
        }
        fact(c, "RESULT lead " + id + " fieldUpdate(control)=" + fu + " requests=" + n + " " + seen(h.requests()));
    }

    // ------------------------------------------------------------ review process

    @CaseId("WH-12")
    @Test(groups = {"crm-webhooks"}, description = "Review process webhookUrl (API only): which review events call it")
    public void wh12ReviewWebhook() {
        String c = "WH-12";
        WebhookSite h = hook(c, 200, 0);
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        body.put("webhookUrl", h.url());
        String rp = api.reviewProcess(body);
        fact(c, "stored webhookUrl=" + CrmUser.ok(adminB().get("/workflow/review-processes/" + rp), "rp").jsonPath().getString("data.webhookUrl"));
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        String a = createLogged(c, userN(), LEADS, leadFields(c, "approved"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, a)));
        CrmUser.sleep(20_000);
        fact(c, "after submit requests=" + h.requests().size());
        api.reviewApproveAll(adminA(), api.reviewRequestId(LEADS, a), "email");
        CrmUser.sleep(20_000);
        fact(c, "after approve requests=" + h.requests().size() + " status=" + api.reviewStatus(LEADS, a));
        String b = createLogged(c, userN(), LEADS, leadFields(c, "rejected"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, b)));
        api.reviewReject(adminA(), api.reviewRequestId(LEADS, b));
        CrmUser.sleep(30_000);
        fact(c, "RESULT leads approved " + a + " rejected " + b + " requests=" + h.requests().size() + " " + seen(h.requests()));
    }

    // ------------------------------------------------------------ URL validation (saved inactive, never fired)

    @CaseId("WH-13")
    @Test(groups = {"crm-webhooks"}, description = "Webhook URL validation: http, localhost, private and metadata addresses (rules saved inactive)")
    public void wh13UrlValidation() {
        String c = "WH-13";
        for (String url : List.of("ftp://example.com/x", "http://example.com/qa", "http://localhost:8080/qa", "http://127.0.0.1/qa",
                "http://10.0.0.5/qa", "http://169.254.169.254/latest/meta-data/", "https://example.com/" + "a".repeat(2100))) {
            Map<String, Object> b = CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c, url, "Post", 10, null)).build();
            Response r = adminB().post("/workflow/rules", b);
            String id = r.statusCode() / 100 == 2 ? r.jsonPath().getString("data.id") : null;
            if (id != null) adminB().delete("/workflow/rules/" + id);
            fact(c, "save rule with " + cut(url, 60) + " -> " + r.statusCode() + " " + cut(r.asString(), 250));
        }
        for (String url : List.of("http://127.0.0.1/qa", "http://169.254.169.254/latest/meta-data/")) {
            Map<String, Object> b = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c),
                    List.of("chat", "web"), List.of(kinded("kind", "webhook", "url", url, "verb", "POST")));
            Response r = adminB().post("/modules/" + LEADS + "/blueprints", b);
            String id = r.statusCode() / 100 == 2 ? r.jsonPath().getString("data.id") : null;
            if (id != null) adminB().delete("/modules/" + LEADS + "/blueprints/" + id);
            fact(c, "save blueprint After webhook " + url + " -> " + r.statusCode() + " " + cut(r.asString(), 250));
        }
        Map<String, Object> rp = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        rp.put("webhookUrl", "http://169.254.169.254/latest/meta-data/");
        Response r = adminB().post("/workflow/review-processes", rp);
        String id = r.statusCode() / 100 == 2 ? r.jsonPath().getString("data.id") : null;
        if (id != null) adminB().delete("/workflow/review-processes/" + id);
        fact(c, "save review process webhookUrl metadata address -> " + r.statusCode() + " " + cut(r.asString(), 250));
    }

    /**
     * WH-13 at run time (user OK 25 Oct): does the server actually call an internal address? (a) review webhookUrl and
     * blueprint After set to 127.0.0.1 / 169.254.169.254 and triggered; (b) workflow webhooks to host names that resolve
     * to internal addresses (nip.io, localtest.me), which a save-time IP check cannot see; the dispatch log shows what
     * happened. Response bodies are never printed (only status and length), in case they hold metadata.
     */
    @CaseId("WH-14")
    @Test(groups = {"crm-webhooks"}, description = "Internal addresses at run time: review / blueprint direct IPs, workflow via host names resolving to internal IPs")
    @SuppressWarnings("unchecked")
    public void wh14InternalAtRunTime() {
        String c = "WH-14";
        // (b) workflow: host names that resolve to internal addresses
        for (String url : List.of("http://169.254.169.254.nip.io/latest/meta-data/", "http://127.0.0.1.nip.io/", "http://localtest.me/")) {
            String cu = c + (url.contains("169") ? "m" : url.contains("nip") ? "l" : "t");
            Map<String, Object> b = CrmProcs.workflow(LEADS, cu + " WF").guardCase(cu).onCreate().rawAction(wfHook(cu, url, "Post", 5, null)).build();
            Response r = adminB().post("/workflow/rules", b);
            fact(cu, "save rule with " + url + " -> " + r.statusCode() + (r.statusCode() / 100 == 2 ? "" : " " + cut(r.asString(), 300)));
            if (r.statusCode() / 100 != 2) continue;
            String rid = r.jsonPath().getString("data.id");
            try {
                on(cu, "rule " + rid, api.setWorkflowActive(rid, true));
                String id = lead(cu, "lead");
                CrmUser.sleep(45_000);
                for (Map<String, Object> e : api.executions(id)) {
                    List<Map<String, Object>> ds = adminB().get("/workflow/executions/" + e.get("id")).jsonPath().getList("data.dispatches");
                    if (ds != null) for (Map<String, Object> d : ds) {
                        String body = d.get("responseBodyTruncated") == null ? null : String.valueOf(d.get("responseBodyTruncated"));
                        fact(cu, "RESULT " + url + " dispatch status=" + d.get("status") + " attempts=" + d.get("attempts") + " lastError=" + d.get("lastError")
                                + " responseStatus=" + d.get("responseStatus") + " responseBody length=" + (body == null ? "null" : body.length()));
                    }
                }
            } finally {
                api.setWorkflowActive(rid, false);
                adminB().delete("/workflow/rules/" + rid);
            }
        }
        // (a) review process webhookUrl straight to internal IPs, fired by a reject
        for (String url : List.of("http://169.254.169.254/latest/meta-data/", "http://127.0.0.1/qa")) {
            String cu = c + (url.contains("169") ? "R" : "Q");
            Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), cu + " RP", caseGuard(LEADS, cu), List.of("manual"),
                    Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
            body.put("webhookUrl", url);
            String rp = api.reviewProcess(body);
            on(cu, "review " + rp, api.setReviewActive(rp, true, null));
            String id = createLogged(cu, userN(), LEADS, leadFields(cu, "lead"));
            CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
            String req = api.reviewRequestId(LEADS, id);
            Response rj = api.reviewReject(adminA(), req);
            CrmUser.sleep(20_000);
            fact(cu, "reject with webhookUrl " + url + " -> " + rj.statusCode() + "; status " + api.reviewStatus(LEADS, id));
            get(cu, adminA(), "/workflow/reviews/" + req);
            get(cu, adminA(), "/workflow/reviews/records/" + LEADS + "/" + id + "/history");
            api.setReviewActive(rp, false, "reject_all");
        }
        // (a) blueprint After straight to an internal IP
        Map<String, Object> bpb = CrmProcs.blueprint("leads", layout(LEADS), null, "lead_source", c + " BP", caseGuard(LEADS, c + "B"),
                List.of("chat", "web", "referral"), List.of(kinded("kind", "webhook", "url", "http://169.254.169.254/latest/meta-data/", "verb", "POST")));
        String bp = api.blueprint(LEADS, bpb);
        on(c, "blueprint " + bp, api.setBlueprintActive(LEADS, bp, true));
        Map<String, Object> f = new LinkedHashMap<>(CrmApi.minimal(LEADS, nm(c + "B", "lead")));
        f.put("lead_source", "chat");
        String id = createLogged(c, adminB(), LEADS, f);
        CrmApi.waitFor(45, () -> api.governed(LEADS, id));
        String tid = null;
        for (Map<String, Object> t : (List<Map<String, Object>>) (List<?>) api.blueprintState(adminB(), LEADS, id).getList("data.transitions"))
            if (String.valueOf(t.get("transitionName")).contains("chat to web")) tid = String.valueOf(t.get("transitionId"));
        Response tr = tid == null ? null : api.transition(adminB(), LEADS, id, tid, Map.of());
        CrmUser.sleep(15_000);
        fact(c, "blueprint After to 169.254.169.254: transition -> " + (tr == null ? "not offered" : tr.statusCode()) + "; state " + val(LEADS, id, "lead_source"));
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }

    // ------------------------------------------------------------ follow-ups (25 Oct, after publishing NDC-2537..2540)

    @CaseId("WH-15")
    @Test(groups = {"crm-webhooks"}, description = "NDC-2539 re-check: lead owner read before approval vs ${owner} in the approval webhook (lead kept until the end)")
    public void wh15ApprovalOwnerRecheck() {
        String c = "WH-15";
        WebhookSite h = hook(c, 200, 0);
        approvalWith(c, "finalActions", wfHook(c, h.url(), "Post", 10, null));
        WebhookSite w = hook(c + "w", 200, 0);
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c + "w", w.url(), "Post", 10, null)));
        String id = lead(c, "lead");
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        String ownerBefore = owner(LEADS, id);
        Response a = api.approve(supervisor(), LEADS, id);
        List<Map<String, Object>> got = h.await(1, 90);
        fact(c, "RESULT lead " + id + " owner on the record=" + ownerBefore + " (after approve " + owner(LEADS, id) + "); approve -> " + a.statusCode()
                + "; approval webhook " + seen(got) + "; workflow webhook (same lead) " + seen(w.await(1, 30)));
    }

    @CaseId("WH-16")
    @Test(groups = {"crm-webhooks"}, description = "Approval Call Webhook to a receiver answering 500: retried like workflow webhooks?")
    public void wh16ApprovalWebhookFailure() {
        String c = "WH-16";
        WebhookSite h = hook(c, 500, 0);
        approvalWith(c, "finalActions", wfHook(c, h.url(), "Post", 10, null));
        String id = lead(c, "lead");
        approvalHeld.add(new String[]{LEADS, id});
        CrmApi.waitFor(45, () -> "pending_approval".equals(api.approvalState(LEADS, id)));
        fact(c, "approve -> " + api.approve(supervisor(), LEADS, id).statusCode());
        long t0 = System.currentTimeMillis();
        for (int i = 0; i < 4; i++) {
            CrmUser.sleep(60_000);
            fact(c, "+" + (System.currentTimeMillis() - t0) / 1000 + "s requests=" + h.requests().size());
        }
        fact(c, "RESULT lead " + id + " requests=" + h.requests().size() + "; executions " + dispatches(id));
        get(c, adminB(), "/timeline/records/leads/" + id + "/feed");
    }

    @CaseId("WH-17")
    @Test(groups = {"crm-webhooks"}, description = "Read-only: what happened to the pending retry to 169.254.169.254 (WH-14, lead 473dc083)")
    @SuppressWarnings("unchecked")
    public void wh17MetadataRetryStatus() {
        String c = "WH-17";
        String lead = "473dc083-9af1-4042-b659-9f9644071627";
        Response r = adminB().get("/workflow/executions?recordId=" + lead + "&take=50");
        fact(c, "executions for lead -> " + r.statusCode());
        List<Map<String, Object>> ex = r.statusCode() == 200 ? r.jsonPath().getList("data") : List.of();
        for (Map<String, Object> e : ex) {
            if (!lead.equals(e.get("recordId"))) continue;
            List<Map<String, Object>> ds = adminB().get("/workflow/executions/" + e.get("id")).jsonPath().getList("data.dispatches");
            if (ds != null) for (Map<String, Object> d : ds)
                fact(c, "RESULT dispatch target=" + d.get("target") + " status=" + d.get("status") + " attempts=" + d.get("attempts") + " lastError=" + d.get("lastError")
                        + " lastAttemptAt=" + d.get("lastAttemptAt") + " nextAttemptAt=" + d.get("nextAttemptAt") + " responseStatus=" + d.get("responseStatus")
                        + " responseBody length=" + (d.get("responseBodyTruncated") == null ? "null" : String.valueOf(d.get("responseBodyTruncated")).length()));
        }
    }

    /** I-09 follow-up: a lead whose review is COMPLETE is deleted and restored; which automations run again? */
    @CaseId("I-09b")
    @Test(groups = {"crm-webhooks"}, description = "Delete a lead after its review is approved, restore it, and record what runs again")
    public void i09bRestoreAfterReview() {
        String c = "I-09b";
        WebhookSite w = hook(c, 200, 0);
        Map<String, Object> body = CrmProcs.reviewProcess(LEADS, layout(LEADS), c + " RP", caseGuard(LEADS, c), List.of("manual"),
                Map.of("email", "email"), List.of(adminA().id()), List.of(adminA().id()));
        String rp = api.reviewProcess(body);
        on(c, "review " + rp, api.setReviewActive(rp, true, null));
        rule(c, CrmProcs.workflow(LEADS, c + " WF").guardCase(c).onCreate().rawAction(wfHook(c, w.url(), "Post", 10, null)));
        String id = createLogged(c, userN(), LEADS, leadFields(c, "lead"));
        CrmApi.waitFor(60, () -> CrmApi.reviewPending(api.reviewStatus(LEADS, id)));
        api.reviewApproveAll(adminA(), api.reviewRequestId(LEADS, id), "email");
        CrmApi.waitFor(60, () -> "approved".equals(api.reviewStatus(LEADS, id)));
        int before = w.await(1, 60).size();
        fact(c, "review " + api.reviewStatus(LEADS, id) + "; workflow webhook calls after review approval=" + before);
        Response d = del(c, adminA(), "/modules/" + LEADS + "/records/" + id);
        CrmUser.sleep(5000);
        Response rs = post(c, adminA(), "/modules/" + LEADS + "/records/" + id + "/restore", Map.of());
        CrmUser.sleep(45_000);
        Response g = adminA().get("/modules/" + LEADS + "/records/" + id);
        fact(c, "RESULT lead " + id + " delete -> " + d.statusCode() + "; restore -> " + rs.statusCode() + " " + cut(rs.asString(), 200)
                + "; readable -> " + g.statusCode() + "; review status " + api.reviewStatus(LEADS, id) + " cycles=" + api.reviewHistory(adminA(), LEADS, id).getList("data.cycles").size()
                + "; workflow webhook calls now=" + w.requests().size() + " (before delete " + before + "); executions " + dispatches(id));
        Response e = api.update(userN(), LEADS, id, Map.of("description", "QA I-09b edit after restore"));
        CrmUser.sleep(15_000);
        fact(c, "edit after restore -> " + e.statusCode() + "; review status " + api.reviewStatus(LEADS, id));
    }

    /** Read-only: other webhook settings in the tenant (SMS delivery webhook). */
    @Test(groups = {"crm-webhooks"}, description = "Read-only: SMS / messaging webhook configuration")
    public void whOtherSurfaces() {
        String c = "WH-x";
        Response r = adminB().get("/messaging/webhooks");
        fact(c, "GET /messaging/webhooks -> " + r.statusCode() + " " + cut(r.asString().replaceAll("\"secret\"\\s*:\\s*\"[^\"]*\"", "\"secret\":\"<hidden>\""), 500));
    }
}
