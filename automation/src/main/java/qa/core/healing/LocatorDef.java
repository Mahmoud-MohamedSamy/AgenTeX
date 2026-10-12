package qa.core.healing;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

/** An element in locators.json: a description plus ranked candidates and the last known fingerprint. */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LocatorDef {
    public String description;
    public List<Candidate> candidates = new ArrayList<>();
    /** Allow a match that is in the DOM but not displayed (hidden inputs, off-screen menus). */
    public Boolean allowHidden;
    public Fingerprint fingerprint;
    /** ISO time + summary of the last heal, so a git diff explains itself. */
    public String lastHeal;

    public boolean parameterized() {
        return candidates.stream().anyMatch(c -> (c.value != null && c.value.contains("{0}")) || (c.name != null && c.name.contains("{0}")));
    }
}
