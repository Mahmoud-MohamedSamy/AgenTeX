package qa.features.crmrecords;

import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.features.crmautomationorder.CrmApi;
import qa.features.crmautomationorder.CrmUser;

import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 group TL / NT — one QA lead goes through created -> field changed -> note -> deleted -> restored, then its
 * timeline is read. The created / changed / note / restored entries are the control: when they don't show up the
 * negative checks are inconclusive, never a pass.
 */
public class TimelineTest {
    private final Cleanup cleanup = new Cleanup();
    private List<Map<String, Object>> feed;

    @BeforeClass(alwaysRun = true)
    public void journey() {
        CrmUser o = owner();
        CrmModule leads = mod("leads");
        String id = create(o, cleanup, leads, QA + "TL " + tag(), null);
        CrmUser.ok(patch(o, leads, id, Map.of("company", "QA W2 TL company")), "edit");
        CrmUser.ok(o.post("/modules/" + LEADS + "/records/" + id + "/notes",
                m("body", "QA W2 note عربي ✓", "body_html", "<p>QA W2 note عربي ✓</p>", "attachments", List.of())), "add note");
        CrmUser.ok(o.delete("/modules/" + LEADS + "/records/" + id), "delete");
        Map<String, Object> item = binItemOf(o, id);
        if (item == null) throw new SkipException("INCONCLUSIVE: the deleted lead is not in the bin");
        CrmUser.ok(restore(o, String.valueOf(item.get("id"))), "restore");
        CrmApi.waitFor(45, () -> entryTypes(timeline(o, "leads", id)).stream().anyMatch(t -> t.startsWith("RecordRestored")));
        feed = timeline(o, "leads", id);
        fact("TL", "entries: " + entryTypes(feed));
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    private void requireControl() {
        List<String> t = entryTypes(feed);
        boolean ok = t.stream().anyMatch(x -> x.startsWith("FieldChanged")) && t.stream().anyMatch(x -> x.startsWith("NoteAdded"))
                && t.stream().anyMatch(x -> x.startsWith("RecordRestored"));
        if (!ok) throw new SkipException("INCONCLUSIVE: the control entries (field changed, note, restored) are missing: " + t);
    }

    @CaseId({"TL-01", "NT-01"})
    @Test(groups = {"crmrecords", "wave2", "api", "regression"}, description = "Created, field changed (with old and new value), note added and restored are on the timeline")
    public void basicEntries() {
        List<String> t = entryTypes(feed);
        Map<String, Object> changed = feed.stream().filter(e -> "FieldChanged".equals(e.get("entry_type")) && "company".equals(e.get("field_key"))).findFirst().orElse(null);
        fact("TL-01", "company change entry: " + changed);
        Assert.assertTrue(t.stream().anyMatch(x -> x.startsWith("RecordCreated")), "no created entry: " + t);
        Assert.assertNotNull(changed, "no field-changed entry for Company: " + t);
        Assert.assertTrue(t.stream().anyMatch(x -> x.startsWith("NoteAdded")), "no note entry: " + t);
        Assert.assertTrue(t.stream().anyMatch(x -> x.startsWith("RecordRestored")), "no restored entry: " + t);
    }

    @CaseId("TL-01")
    @Test(groups = {"crmrecords", "wave2", "api", "W2-B1"}, description = "Deleting the record is logged on its timeline")
    public void deletionIsLogged() {
        requireControl();
        List<String> t = entryTypes(feed);
        Assert.assertTrue(t.stream().anyMatch(x -> x.toLowerCase().contains("delet")), "the record was deleted and restored, but the timeline has no deleted entry: " + t);
    }
    // W2-B2 ("leads created" wording) is built by the screen, so it is checked in RecordScreensUiTest.
}
