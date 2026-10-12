package qa.core.healing;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

/**
 * What an element looked like the last time it was found. When every candidate fails, the healer
 * scores elements on the page against this and, above a threshold, adopts the best match.
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Fingerprint {
    public String tag;
    public String id;
    public String name;
    public String role;
    public String type;
    public String text;
    public String ariaLabel;
    public String placeholder;
    public String testId;
    public String classes;
    public String parentText;

    static final String JS = """
            const e = arguments[0];
            const t = s => (s || '').replace(/\\s+/g, ' ').trim().slice(0, 120);
            return {
              tag: e.tagName.toLowerCase(), id: e.id || '', name: e.getAttribute('name') || '',
              role: e.getAttribute('role') || '', type: e.getAttribute('type') || '',
              text: t(e.innerText || e.value), ariaLabel: e.getAttribute('aria-label') || '',
              placeholder: e.getAttribute('placeholder') || '', testId: e.getAttribute('data-testid') || '',
              classes: (typeof e.className === 'string' ? e.className : '').split(/\\s+/).filter(c => c && !/\\d{3,}|^css-|^sc-/.test(c)).slice(0, 8).join(' '),
              parentText: t(e.parentElement && e.parentElement.innerText).slice(0, 60)
            };""";

    @SuppressWarnings("unchecked")
    public static Fingerprint of(WebDriver driver, WebElement el) {
        Map<String, Object> m = (Map<String, Object>) ((JavascriptExecutor) driver).executeScript(JS, el);
        Fingerprint f = new Fingerprint();
        f.tag = str(m.get("tag"));
        f.id = str(m.get("id"));
        f.name = str(m.get("name"));
        f.role = str(m.get("role"));
        f.type = str(m.get("type"));
        f.text = str(m.get("text"));
        f.ariaLabel = str(m.get("ariaLabel"));
        f.placeholder = str(m.get("placeholder"));
        f.testId = str(m.get("testId"));
        f.classes = str(m.get("classes"));
        f.parentText = str(m.get("parentText"));
        return f;
    }

    private static String str(Object o) {
        return o == null ? "" : o.toString();
    }

    /** 0..1 similarity. Stable identifiers weigh more than text and classes. */
    public double score(Fingerprint o) {
        double got = 0, max = 0;
        double[] w = {3, 3, 2, 2.5, 2.5, 2, 2, 1, 0.5};
        String[][] pairs = {
                {id, o.id}, {testId, o.testId}, {name, o.name}, {ariaLabel, o.ariaLabel}, {text, o.text},
                {placeholder, o.placeholder}, {role, o.role}, {type, o.type}, {parentText, o.parentText}};
        for (int i = 0; i < pairs.length; i++) {
            String a = pairs[i][0];
            if (a == null || a.isEmpty()) continue;
            max += w[i];
            String b = pairs[i][1];
            if (a.equals(b)) got += w[i];
            else if (b != null && !b.isEmpty() && (a.contains(b) || b.contains(a))) got += w[i] * 0.5;
        }
        if (classes != null && !classes.isEmpty()) {
            max += 1.5;
            Set<String> x = new HashSet<>(Arrays.asList(classes.split(" ")));
            Set<String> y = new HashSet<>(Arrays.asList((o.classes == null ? "" : o.classes).split(" ")));
            Set<String> inter = new HashSet<>(x);
            inter.retainAll(y);
            got += 1.5 * inter.size() / Math.max(1, x.size());
        }
        if (!Objects.equals(tag, o.tag)) return 0;
        return max == 0 ? 0 : got / max;
    }

    /** Best new candidate for a healed element, most stable attribute first. */
    public Candidate bestCandidate() {
        if (has(testId)) return new Candidate("testId", testId);
        if (has(id) && !id.matches(".*\\d{3,}.*") && !id.startsWith(":r")) return new Candidate("id", id);
        if (has(role) && (has(ariaLabel) || has(text)))
            return new Candidate("role", role, has(ariaLabel) ? ariaLabel : text);
        if (has(ariaLabel)) return new Candidate("ariaLabel", ariaLabel);
        if (has(name)) return new Candidate("name", name);
        if (has(placeholder)) return new Candidate("placeholder", placeholder);
        if (has(text) && text.length() <= 60)
            return new Candidate("xpath", "//" + tag + "[normalize-space(.)=" + Candidate.literal(text) + "]");
        return null;
    }

    private static boolean has(String s) {
        return s != null && !s.isEmpty();
    }
}
