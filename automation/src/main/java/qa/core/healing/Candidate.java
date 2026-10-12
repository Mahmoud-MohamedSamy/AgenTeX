package qa.core.healing;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.openqa.selenium.By;

import java.util.Locale;

/**
 * One way of finding an element. A locator definition holds several, best first.
 *
 * by = role | testId | id | name | ariaLabel | placeholder | text | partialText | css | xpath
 * For "role", value is the ARIA role (button, link, textbox, option, radio, checkbox, combobox, tab,
 * menuitem, dialog, heading, row, cell, listbox, switch) and name is the accessible name.
 * Values may contain {0}, {1}… placeholders filled from page-object arguments.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Candidate {
    public String by;
    public String value;
    public String name;
    /** role/text: exact match (default) or contains. */
    public Boolean exact;

    public Candidate() {
    }

    public Candidate(String by, String value) {
        this.by = by;
        this.value = value;
    }

    public Candidate(String by, String value, String name) {
        this(by, value);
        this.name = name;
    }

    public Candidate fill(Object... args) {
        Candidate c = new Candidate(by, format(value, args), format(name, args));
        c.exact = exact;
        return c;
    }

    private static String format(String s, Object... args) {
        if (s == null || args == null) return s;
        for (int i = 0; i < args.length; i++) s = s.replace("{" + i + "}", String.valueOf(args[i]));
        return s;
    }

    public By toBy() {
        boolean ex = exact == null || exact;
        return switch (by) {
            case "id" -> By.id(value);
            case "name" -> By.name(value);
            case "css" -> By.cssSelector(value);
            case "xpath" -> By.xpath(value);
            case "testId" -> By.cssSelector("[data-testid=" + cssString(value) + "]");
            case "ariaLabel" -> By.cssSelector("[aria-label=" + cssString(value) + "]");
            case "placeholder" -> By.cssSelector("[placeholder=" + cssString(value) + "]");
            case "text" -> By.xpath("//*[text()[" + match("normalize-space(.)", value, ex) + "]]");
            case "partialText" -> By.xpath("//*[text()[" + match("normalize-space(.)", value, false) + "]]");
            case "role" -> By.xpath(roleXpath(value, name, ex));
            default -> throw new IllegalArgumentException("Unknown locator strategy '" + by + "'");
        };
    }

    static String roleXpath(String role, String name, boolean exact) {
        String r = role.toLowerCase(Locale.ROOT);
        String tag = switch (r) {
            case "button" -> "self::button or (self::input and (@type='button' or @type='submit' or @type='reset'))";
            case "link" -> "self::a[@href]";
            case "textbox" -> "self::textarea or (self::input and (not(@type) or @type='text' or @type='email' or @type='password' or @type='search' or @type='tel' or @type='url' or @type='number')) or @contenteditable='true'";
            case "checkbox" -> "self::input[@type='checkbox']";
            case "radio" -> "self::input[@type='radio']";
            case "combobox" -> "self::select";
            case "heading" -> "self::h1 or self::h2 or self::h3 or self::h4 or self::h5 or self::h6";
            case "row" -> "self::tr";
            case "cell" -> "self::td";
            case "dialog" -> "self::dialog";
            case "option" -> "self::option";
            case "group" -> "self::fieldset";
            default -> "false()";
        };
        StringBuilder x = new StringBuilder("//*[(@role='").append(r).append("' or ").append(tag).append(")");
        if (name != null && !name.isEmpty()) {
            String lit = literal(name);
            String fn = exact ? "=" : null;
            x.append(" and (");
            if (exact) {
                x.append("normalize-space(.)").append(fn).append(lit)
                        .append(" or @aria-label=").append(lit)
                        .append(" or @title=").append(lit)
                        .append(" or @value=").append(lit)
                        .append(" or @placeholder=").append(lit)
                        .append(" or @id=//label[normalize-space(.)=").append(lit).append("]/@for")
                        .append(" or @aria-labelledby=//*[normalize-space(.)=").append(lit).append("]/@id")
                        .append(" or legend[normalize-space(.)=").append(lit).append("]");
            } else {
                x.append("contains(normalize-space(.),").append(lit).append(")")
                        .append(" or contains(@aria-label,").append(lit).append(")")
                        .append(" or contains(@title,").append(lit).append(")")
                        .append(" or contains(@placeholder,").append(lit).append(")")
                        .append(" or legend[contains(normalize-space(.),").append(lit).append(")]");
            }
            x.append(")");
        }
        return x.append("]").toString();
    }

    private static String match(String expr, String v, boolean exact) {
        return exact ? expr + "=" + literal(v) : "contains(" + expr + "," + literal(v) + ")";
    }

    /** XPath string literal that survives both quote kinds. */
    static String literal(String s) {
        if (!s.contains("'")) return "'" + s + "'";
        if (!s.contains("\"")) return "\"" + s + "\"";
        return "concat('" + s.replace("'", "',\"'\",'") + "')";
    }

    private static String cssString(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    @Override
    public String toString() {
        return by + "=" + value + (name != null ? " [" + name + "]" : "") + (Boolean.FALSE.equals(exact) ? " (contains)" : "");
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Candidate c && toString().equals(c.toString());
    }

    @Override
    public int hashCode() {
        return toString().hashCode();
    }
}
