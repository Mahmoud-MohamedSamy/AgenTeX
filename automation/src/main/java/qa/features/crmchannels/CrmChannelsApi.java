package qa.features.crmchannels;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmhierarchy.CrmHierarchyApi;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.crmchannels.CrmChannelsFeature.*;

/**
 * API helpers for the Wave 4 tests. Request bodies are the ones the screens send (recorded 26 Oct 2026). Every object
 * a test makes is registered with {@link Cleanup} and removed afterwards (leads are deleted and purged from the bin).
 * Nothing here sends an email or an SMS.
 */
public final class CrmChannelsApi {
    private CrmChannelsApi() {
    }

    public static CrmUser owner() {
        return CrmUser.as(OWNER);
    }

    public static CrmUser user1() {
        return CrmUser.as(USER_N);
    }

    public static void fact(String caseId, String text) {
        CrmHierarchyApi.fact(caseId, text);
    }

    public static Map<String, Object> m(Object... kv) {
        Map<String, Object> r = new LinkedHashMap<>();
        for (int i = 0; i < kv.length; i += 2) r.put(String.valueOf(kv[i]), kv[i + 1]);
        return r;
    }

    public static String tag() {
        return String.valueOf(System.currentTimeMillis() % 1_000_000);
    }

    public static String err(Response r) {
        String b = r.asString();
        return r.statusCode() + " " + (b == null ? "" : b.length() > 200 ? b.substring(0, 200) : b);
    }

    /** Status of a public (not signed-in) GET, e.g. a web-form hosted link or a portal link. */
    public static int publicStatus(String url) {
        return RestAssured.given().relaxedHTTPSValidation().redirects().follow(true).get(url).statusCode();
    }

    /** A QA lead with the Standard layout's required fields; returns its id. */
    public static String createLead(Cleanup c, String name, String email) {
        Map<String, Object> f = new LinkedHashMap<>();
        f.put("first_name", name);
        f.put("phone", String.format("010%08d", Math.floorMod(name.hashCode(), 100_000_000)));
        f.put("single_line_3_9", "QA W4");
        if (email != null) f.put("email", email);
        String id = CrmUser.ok(owner().post("/modules/" + LEADS + "/records", m("layout_id", LEADS_LAYOUT, "data", CrmApi.data(f))), "create lead").jsonPath().getString("data.id");
        c.lead(id);
        return id;
    }

    /** The web-form body the builder sends (Leads, Standard layout, 4 fields, hosted link on, owner = the owner). */
    public static Map<String, Object> webForm(String name, boolean captcha) {
        List<Map<String, Object>> fields = new ArrayList<>();
        for (String k : List.of("first_name", "phone", "email", "company")) fields.add(m("key", k, "placeholder", null, "label", null, "help", null));
        Map<String, Object> def = m("version", 2, "language", "en", "success_message", "Thank you. Your request has been submitted.", "fields", fields,
                "attachments", m("enabled", false, "screenshot_enabled", false), "captcha_enabled", captcha, "launcher", null, "allowed_origins", List.of(),
                "style", m("font_family", "system", "font_size", 13, "font_color", "#1F2937", "background_color", "#FFFFFF", "label_alignment", "top", "width_px", 600,
                        "submit_label", null, "reset_label", null, "show_form_name", false),
                "redirect_url", null, "owner", m("mode", "user", "user_id", OWNER_ID, "assignment_rule_id", null, "notify_owner", false, "notify_email", false, "notify_user_ids", List.of()),
                "share_link_enabled", true, "capture", null, "duplicates", null, "live_chat", false);
        return m("kind", "advanced_form", "name", name, "department_id", null, "layout_id", LEADS_LAYOUT, "module_id", LEADS, "definition", def, "app_key", "crm");
    }

    /** The portal body the screen sends (Leads, Standard layout, Full Name view, Phone edit, off). */
    public static Map<String, Object> portal(String name) {
        return m("name", name, "module_id", LEADS, "layout_id", LEADS_LAYOUT, "is_enabled", false, "email_field_key", "email", "display_name_field_key", null,
                "fields", List.of(m("key", "first_name", "edit", false), m("key", "phone", "edit", true)),
                "settings", m("require_approval", false, "language", "en", "temp_password_days", 7, "idle_minutes", 30, "captcha_on_login", false,
                        "branding", m("logo_file_id", null, "primary_color", "#2563eb", "company_name", null, "welcome_title", m("en", null, "ar", null), "welcome_text", m("en", null, "ar", null)),
                        "access_condition", null, "login_identifier", "username", "avatar_field_key", null, "access_email", null, "first_sign_in_update", null));
    }

    /** Everything one test class made: web forms, portals, templates, drafts, SMS templates, leads. */
    public static final class Cleanup {
        private final List<String> leads = new ArrayList<>();
        private final List<Runnable> other = new ArrayList<>();

        public void lead(String id) {
            if (id != null) leads.add(id);
        }

        public void then(Runnable r) {
            other.add(0, r);
        }

        public void run() {
            CrmUser o = owner();
            for (Runnable r : other) {
                try {
                    r.run();
                } catch (RuntimeException e) {
                    fact("cleanup", "step failed: " + e.getMessage());
                }
            }
            for (String id : leads) o.delete("/modules/" + LEADS + "/records/" + id);
            if (leads.isEmpty()) return;
            List<String> items = new ArrayList<>();
            String cursor = null;
            for (int p = 0; p < 40; p++) {
                Response r = cursor == null ? o.get("/audit/recycle-bin/items?limit=200")
                        : o.req().queryParam("limit", 200).queryParam("cursor", cursor).get("/audit/recycle-bin/items");
                List<Map<String, Object>> d = r.jsonPath().get("data") instanceof List ? r.jsonPath().getList("data") : r.jsonPath().getList("data.items");
                if (d == null || d.isEmpty()) break;
                for (Map<String, Object> i : d) if (leads.contains(String.valueOf(i.get("record_id")))) items.add(String.valueOf(i.get("id")));
                cursor = r.jsonPath().getString("meta.next_cursor");
                if (cursor == null || items.size() == leads.size()) break;
            }
            if (!items.isEmpty()) fact("cleanup", "purged " + items.size() + " QA W4 bin items -> " + o.post("/audit/recycle-bin/delete", m("ids", items)).statusCode());
        }
    }
}
