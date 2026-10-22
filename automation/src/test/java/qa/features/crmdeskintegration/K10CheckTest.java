package qa.features.crmdeskintegration;

import org.testng.annotations.Test;
import qa.core.annotations.CaseId;
import qa.core.base.BaseTest;
import qa.features.crmdeskintegration.pages.DeskRecordPage;

import java.nio.file.Path;
import java.util.Map;

import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertTrue;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;
import static qa.features.crmdeskintegration.WriteBase.fact;

/**
 * K10 confirmation (20 Oct 2026): the Layout picker with the integration connected (control) and paused (about one
 * minute, resumed in finally). Screenshots of the open picker go to target/evidence/K10/.
 */
public class K10CheckTest extends BaseTest {
    @CaseId("K10")
    @Test(groups = {"crmdesk", "crmdesk-write", "crmdesk-ui"}, description = "Handshake Mode is removed from the picker while sync is paused (NDC-1669 §8)")
    public void handshakeHiddenWhilePaused() {
        AppUser.App owner = AppUser.as(CrmDeskFeature.OWNER).desk();
        String connected = new DeskRecordPage().openTicketList().layoutOptionsShot(Path.of("target/evidence/K10/connected-picker.png"));
        fact("K10", "connected: Handshake offered=" + connected.contains("Handshake Mode"));
        String paused;
        try {
            fact("K10", "pause -> " + AppUser.ok(owner.post(INT + "/pause", Map.of("reason", "QA CD K10 check")), "pause").statusCode());
            paused = new DeskRecordPage().openTicketList().layoutOptionsShot(Path.of("target/evidence/K10/paused-picker.png"));
            fact("K10", "paused: Handshake offered=" + paused.contains("Handshake Mode"));
        } finally {
            fact("K10", "resume -> " + owner.post(INT + "/resume", Map.of()).statusCode());
        }
        assertTrue(connected.contains("Handshake Mode"), "control: Handshake Mode not offered while connected");
        assertFalse(paused.contains("Handshake Mode"), "Handshake Mode still offered while sync is paused");
    }
}
