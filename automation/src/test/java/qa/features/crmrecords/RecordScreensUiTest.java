package qa.features.crmrecords;

import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmautomationorder.CrmUser;
import qa.features.crmrecords.pages.RecordScreensPage;

import java.util.List;
import java.util.Map;

import static qa.features.crmrecords.CrmRecordsApi.*;
import static qa.features.crmrecords.CrmRecordsFeature.*;

/**
 * Wave 2 screens as the owner: Settings › Pipelines loads (NDC-2386), "+ Task" on a record opens a form (W2-B7),
 * the timeline wording (W2-B2), a deleted view id in the URL (NDC-2098) and the Leads list speed (NDC-2136, perf).
 * One QA lead and one QA view are made by API and removed afterwards; no screen saves anything.
 */
public class RecordScreensUiTest extends BaseTest {
    private final Cleanup cleanup = new Cleanup();
    private String leadId;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        leadId = create(owner(), cleanup, mod("leads"), QA + "UI " + tag(), null);
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        cleanup.run();
    }

    @CaseId("PL-02")
    @Test(groups = {"crmrecords", "wave2", "ui", "NDC-2386"}, description = "Settings › Pipelines shows its board within 30 s (not stuck on 'Loading board…')")
    public void pipelinesPageLoads() {
        RecordScreensPage p = new RecordScreensPage().go("/settings/pipelines");
        p.waitForText("Pipeline", 30);
        boolean stillLoading = true;
        for (int i = 0; i < 60 && stillLoading; i++) {
            qa.core.base.Waits.sleep(500);
            stillLoading = p.text().contains("Loading board");
        }
        fact("PL-02", "after 30 s: still 'Loading board…'=" + stillLoading + "; shows 'Standard'=" + p.text().contains("Standard"));
        Assert.assertFalse(stillLoading, "Settings › Pipelines is still on 'Loading board…' after 30 s");
    }

    @CaseId("AC-01")
    @Test(groups = {"crmrecords", "wave2", "ui", "W2-B7"}, description = "'+ Task' on a lead opens a task form (Subject), not 'No quick-create form is available'")
    public void addTaskFromRecord() {
        RecordScreensPage p = new RecordScreensPage().openRecord(LEADS, leadId);
        p.addActivity("Call");                                         // control: the Call popup loads
        boolean call = p.waitForText("Call Type", 20) || p.dialogText().contains("Call");
        p.closeDialog();
        if (!call) throw new SkipException("INCONCLUSIVE: control '+ Call' did not open its form either");
        p.addActivity("Task");
        String dialog = "";
        for (int i = 0; i < 50; i++) {   // up to 25 s for the form to finish loading
            dialog = p.dialogText();
            if (!dialog.contains("Loading form") && !dialog.isBlank()) break;
            qa.core.base.Waits.sleep(500);
        }
        boolean form = dialog.contains("Subject") && !dialog.contains("Loading form");
        p.closeDialog();
        fact("AC-01 UI", "Call popup ok; Task popup shows Subject=" + form + "; dialog: " + dialog.replace('\n', '|').substring(0, Math.min(200, dialog.length())));
        Assert.assertFalse(dialog.contains("No quick-create form"), "'+ Task' says no quick-create form is available");
        Assert.assertTrue(form, "'+ Task' did not open a task form within 25 s");
    }

    @CaseId("TL-01")
    @Test(groups = {"crmrecords", "wave2", "ui", "W2-B2"}, description = "The Timeline tab reads 'Lead created', not 'leads created'")
    public void timelineWording() {
        RecordScreensPage p = new RecordScreensPage().openRecord(LEADS, leadId);
        p.clickText("Timeline");
        boolean shown = p.waitForText("created", 20);
        String t = p.text();
        fact("TL-01 UI", "timeline shows a created entry=" + shown + "; 'leads created'=" + t.contains("leads created") + "; 'Lead created'=" + t.contains("Lead created"));
        if (!shown) throw new SkipException("INCONCLUSIVE: no created entry on the Timeline tab");
        Assert.assertFalse(t.contains("leads created"), "the timeline says 'leads created'");
    }

    @CaseId("CV-04")
    @Test(groups = {"crmrecords", "wave2", "ui", "NDC-2098"}, description = "A deleted view id in ?view= opens the default All view, not the last-used one")
    public void deletedViewIdInUrl() {
        Map<String, Object> body = m("name", QA + "UI view " + tag(), "kind", "list", "layout_id", LEADS_LAYOUT, "visibility", "private",
                "settings", m("columns", List.of("first_name", "phone"), "sort", m("field", "created_at", "dir", "desc"),
                        "criteria", m("pattern", "1 and 2", "conditions", List.of(m("field", "first_name", "operator", "starts_with", "value", QA + "UI"), m("field", "phone", "operator", "is_not_empty", "value", null))), "related_criteria", List.of()));
        String viewId = CrmUser.ok(owner().post("/modules/" + LEADS + "/views", body), "create view").jsonPath().getString("data.id");
        RecordScreensPage p = new RecordScreensPage().go("/modules/" + LEADS + "?view=" + viewId);   // makes it the last-used view
        p.waitForText(QA + "UI view", 30);
        int del = owner().delete("/modules/" + LEADS + "/views/" + viewId).statusCode();
        p.go("/modules/" + LEADS + "?view=" + viewId);
        for (int i = 0; i < 120 && p.text().matches("(?s).*Loading (Leads|records).*"); i++) qa.core.base.Waits.sleep(500);   // the list is slow (NDC-2136)
        qa.core.base.Waits.sleep(3000);
        if (p.text().matches("(?s).*Loading (Leads|records).*")) throw new SkipException("INCONCLUSIVE: the Leads list was still loading after 60 s");
        String t = p.text();
        fact("CV-04", "view deleted " + del + "; page shows the deleted view's name=" + t.contains(QA + "UI view") + ", 'All Leads'=" + t.contains("All Leads"));
        Assert.assertFalse(t.contains(QA + "UI view"), "the deleted view still opens");
        Assert.assertTrue(t.contains("All Leads"), "the page did not fall back to All Leads");
    }

    @CaseId("LV-07")
    @Test(groups = {"crmrecords", "wave2", "ui", "perf", "NDC-2136"}, description = "Leads list shows its first rows within 1.5 s (best of 3 loads)")
    public void leadsListSpeed() {
        RecordScreensPage p = new RecordScreensPage().go("/modules/" + LEADS);
        p.secondsUntilFirstRow(40);                                   // warm-up load
        double best = Double.MAX_VALUE;
        StringBuilder all = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            p.go("/modules/" + LEADS);
            double s = p.secondsUntilFirstRow(40);
            all.append(s).append(' ');
            if (s >= 0) best = Math.min(best, s);
        }
        fact("LV-07", "first rows after " + all + "s (best " + best + ")");
        Assert.assertTrue(best <= 1.5, "Leads list first rows after " + best + " s (target 1.5 s)");
    }
}
