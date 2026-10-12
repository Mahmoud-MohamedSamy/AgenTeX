package qa.core.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import qa.core.config.Config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Where the test account comes from, first hit wins:
 * 1. QA_EMAIL / QA_PASSWORD (env or -Dqa.email / -Dqa.password)
 * 2. credentials.file (gitignored), entry picked by credentials.account (label, email, or the email's part before @):
 *    - JSON array of {Account, Email, Password}
 *    - CSV with a header row, e.g. a browser password export: name,url,username,password,note
 * The password is never logged or attached to reports.
 */
public final class Credentials {
    public final String account;
    public final String email;
    private final String password;

    private Credentials(String account, String email, String password) {
        this.account = account;
        this.email = email;
        this.password = password;
    }

    public String password() {
        return password;
    }

    public static Credentials load() {
        String e = Config.get("qa.email"), p = Config.get("qa.password");
        if (e != null && p != null && !e.isEmpty()) return new Credentials(e, e, p);

        String file = Config.get("credentials.file");
        String want = Config.get("credentials.account", "");
        if (file == null) throw new IllegalStateException("No credentials: set QA_EMAIL/QA_PASSWORD or credentials.file");
        Path path = Config.projectDir().resolve(file).normalize();
        try {
            String raw = Files.readString(path);
            JsonNode arr = path.toString().toLowerCase().endsWith(".csv") ? fromCsv(raw) : new ObjectMapper().readTree(raw);
            for (JsonNode n : arr) {
                String acc = text(n, "Account", "account", "note");
                String em = text(n, "Email", "email", "username");
                if (em.isEmpty()) continue;
                String local = em.contains("@") ? em.substring(0, em.indexOf('@')) : em;
                if (want.isEmpty() || want.equalsIgnoreCase(acc) || want.equalsIgnoreCase(em) || want.equalsIgnoreCase(local))
                    return new Credentials(acc.isEmpty() ? local : acc, em, text(n, "Password", "password"));
            }
        } catch (Exception ex) {
            throw new IllegalStateException("Cannot read credentials file " + path + ": " + ex.getMessage());
        }
        throw new IllegalStateException("Account '" + want + "' not found in " + path);
    }

    /** CSV (header row, quoted fields allowed) to a JSON array of objects keyed by the header names. */
    static JsonNode fromCsv(String raw) {
        ObjectMapper m = new ObjectMapper();
        ArrayNode out = m.createArrayNode();
        List<List<String>> rows = new ArrayList<>();
        List<String> row = new ArrayList<>();
        StringBuilder cell = new StringBuilder();
        boolean quoted = false;
        String text = raw.startsWith("\uFEFF") ? raw.substring(1) : raw;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (quoted) {
                if (c == '"' && i + 1 < text.length() && text.charAt(i + 1) == '"') { cell.append('"'); i++; }
                else if (c == '"') quoted = false;
                else cell.append(c);
            } else if (c == '"') quoted = true;
            else if (c == ',') { row.add(cell.toString()); cell.setLength(0); }
            else if (c == '\n' || c == '\r') {
                if (c == '\r' && i + 1 < text.length() && text.charAt(i + 1) == '\n') i++;
                row.add(cell.toString()); cell.setLength(0);
                if (row.size() > 1 || !row.get(0).isEmpty()) rows.add(row);
                row = new ArrayList<>();
            } else cell.append(c);
        }
        row.add(cell.toString());
        if (row.size() > 1 || !row.get(0).isEmpty()) rows.add(row);
        if (rows.isEmpty()) return out;
        List<String> head = rows.get(0);
        for (List<String> r : rows.subList(1, rows.size())) {
            ObjectNode o = out.addObject();
            for (int i = 0; i < head.size() && i < r.size(); i++) o.put(head.get(i).trim(), r.get(i).trim());
        }
        return out;
    }

    private static String text(JsonNode n, String... keys) {
        for (String k : keys) if (n.hasNonNull(k)) return n.get(k).asText();
        return "";
    }

    @Override
    public String toString() {
        return account + " <" + email + ">";
    }
}
