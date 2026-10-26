package qa.features.deskticketreplies;

import io.restassured.response.Response;
import qa.features.crmdeskintegration.AppUser;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static qa.features.deskticketreplies.DeskTicketRepliesFeature.*;

/**
 * Reply / comment / draft / snippet calls on /desk/tickets/{id}/… with the body shapes the composer sends
 * (captured 26 Oct 2026): reply {mode, to, cc?, bcc?, subject, body_html, attachments?}; comment {content_html, is_public};
 * draft PUT drafts/mine {mode, to, subject, body_html}; snippet {name, content_html, is_shared}.
 */
public final class DeskTicketRepliesApi {
    private DeskTicketRepliesApi() {
    }

    public static Map<String, Object> reply(String mode, List<String> to, String subject, String bodyHtml) {
        Map<String, Object> b = new LinkedHashMap<>();
        b.put("mode", mode);
        b.put("to", to);
        b.put("subject", subject);
        b.put("body_html", bodyHtml);
        return b;
    }

    public static Map<String, Object> with(Map<String, Object> b, Object... kv) {
        Map<String, Object> c = new LinkedHashMap<>(b);
        for (int i = 0; i < kv.length; i += 2) c.put(String.valueOf(kv[i]), kv[i + 1]);
        return c;
    }

    public static Response send(AppUser.App u, String ticket, Map<String, Object> body) {
        return u.post("/desk/tickets/" + ticket + "/replies", body);
    }

    /** All replies of a ticket (throws on non-2xx). */
    public static List<Map<String, Object>> replies(AppUser.App u, String ticket) {
        List<Map<String, Object>> l = AppUser.ok(u.get("/desk/tickets/" + ticket + "/replies"), "replies").jsonPath().getList("data");
        return l == null ? List.of() : l;
    }

    public static Map<String, Object> replyWith(AppUser.App u, String ticket, String bodyPart) {
        return replies(u, ticket).stream().filter(r -> String.valueOf(r.get("body_html")).contains(bodyPart)).findFirst().orElse(null);
    }

    public static List<Map<String, Object>> comments(AppUser.App u, String ticket) {
        List<Map<String, Object>> l = AppUser.ok(u.get("/desk/tickets/" + ticket + "/comments"), "comments").jsonPath().getList("data");
        return l == null ? List.of() : l;
    }

    public static Map<String, Object> counts(AppUser.App u, String ticket) {
        return AppUser.ok(u.get("/desk/tickets/" + ticket), "ticket").jsonPath().getMap("data.counts");
    }

    public static List<String> feedActions(AppUser.App u, String ticket) {
        List<String> l = AppUser.ok(u.get("/desk/tickets/" + ticket + "/activity"), "activity feed").jsonPath().getList("data.action");
        return l == null ? List.of() : l;
    }

    public static String ticketCc(AppUser.App u, String ticket) {
        return AppUser.ok(u.get("/desk/tickets/" + ticket + "/cc"), "ticket cc").asString();
    }

    /** Removes the QA snippets of this feature (names start with qa_rpl). */
    public static void deleteQaSnippets(AppUser.App u) {
        List<Map<String, Object>> s = AppUser.ok(u.get("/desk/snippets"), "snippets").jsonPath().getList("data.snippets");
        if (s != null) for (Map<String, Object> x : s) if (String.valueOf(x.get("name")).startsWith("qa_rpl")) u.delete("/desk/snippets/" + x.get("id"));
    }
}
