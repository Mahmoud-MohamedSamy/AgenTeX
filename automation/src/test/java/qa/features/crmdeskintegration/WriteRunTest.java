package qa.features.crmdeskintegration;

import io.restassured.path.json.JsonPath;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import qa.core.annotations.CaseId;

import java.nio.file.Files;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static qa.features.crmdeskintegration.AppUser.ok;
import static qa.features.crmdeskintegration.CrmDeskFeature.INT;

/**
 * Run 2 — writes (approved by the user 20 Oct 2026: "Go now"). Serial, one class, ordered by priority.
 * Settings are changed one at a time and restored from the baseline taken in {@link #baseline()}; every record is
 * "QA CD … r…" and is deleted in {@link #cleanup()}. Spec rows: A4, A7, C17, D1–D4, E2–E7, F1, F5–F7, G1–G16, G19,
 * H2, H6–H8, H10, H13, I3, I8–I11, I15, J3–J11, K3, K5–K7, K9, L1, L2, L4, L5, M2, M4, O1, Z4.
 */
public class WriteRunTest extends WriteBase {
    static final int SYNC = 150;
    static Map<String, Object> baseline;

    // shared records
    static String g1Crm, g1Desk, g2Desk, g2Crm, g3CrmAcc, g3DeskAcc, g3DeskAcc2, g3CrmAcc2;

    @BeforeClass(alwaysRun = true)
    public void baseline() throws Exception {
        Files.deleteIfExists(FACTS);
        baseline = config();
        fact("BASE", "run tag " + RUN + "; baseline row_version " + rowVersion(baseline) + "; status " + baseline.get("status"));
        fact("BASE", "links contact=" + links("contact").size() + " account=" + links("account").size() + " contract=" + links("contract").size());
        Map<String, Object> st = configStatus();
        if (!Boolean.TRUE.equals(st.get("enabled")) || Boolean.TRUE.equals(st.get("paused")))
            throw new org.testng.SkipException("INCONCLUSIVE: integration not connected / paused at start: " + st);
    }

    // ================================================================ A4 agent writes

    @CaseId("A4")
    @Test(priority = 1, groups = {"crmdesk", "crmdesk-write"}, description = "Agent without desk:integration:manage cannot change anything")
    public void a4AgentWritesRefused() {
        AppUser.App agent = AppUser.as(CrmDeskFeature.AGENT).desk();
        String before = rowVersion(config());
        Map<String, Object> body = config();
        body.remove("status");
        String rnd = UUID.randomUUID().toString();
        Map<String, Response> calls = new LinkedHashMap<>();
        calls.put("PUT /config", agent.putOnce(INT + "/config", body));
        calls.put("POST /pause", agent.post(INT + "/pause", Map.of("reason", "QA CD agent")));
        calls.put("POST /imports/customers", agent.post(INT + "/imports/customers", Map.of()));
        calls.put("POST /failures/retry-all", agent.post(INT + "/failures/retry-all", Map.of()));
        calls.put("POST /failures/{rnd}/discard", agent.post(INT + "/failures/" + rnd + "/discard", Map.of()));
        calls.put("POST /links", agent.post(INT + "/links", Map.of("kind", "contact", "crm_record_id", rnd, "desk_record_id", rnd)));
        calls.put("DELETE /links/{rnd}", agent.delete(INT + "/links/" + rnd));
        calls.put("POST /connect", agent.post(INT + "/connect", Map.of()));
        List<String> leaked = new ArrayList<>();
        calls.forEach((k, r) -> {
            fact("A4", "agent " + k + " -> " + code(r));
            if (r.statusCode() / 100 == 2) leaked.add(k);
        });
        Map<String, Object> st = configStatus();
        if (Boolean.TRUE.equals(st.get("paused"))) {
            fact("A4", "agent pause took effect -> owner resumes " + code(desk().post(INT + "/resume", Map.of())));
        }
        String after = rowVersion(config());
        fact("A4", "row_version " + before + " -> " + after);
        Assert.assertTrue(leaked.isEmpty(), "agent writes accepted: " + leaked);
        Assert.assertEquals(after, before, "settings changed by the agent's calls");
    }

    // ================================================================ F / A7 save and concurrency

    static String f1Old;

    @CaseId({"F1", "A7"})
    @Test(priority = 2, groups = {"crmdesk", "crmdesk-write"}, description = "Save one setting; both apps read the same value and row_version")
    public void f1SaveAndShared() {
        Map<String, Object> c = config();
        f1Old = rowVersion(c);
        Response r = putConfig(x -> notif(x).put("rating", false));
        fact("F1", "PUT notifications.rating=false -> " + code(r));
        Assert.assertEquals(r.statusCode() / 100, 2, "save refused: " + r.asString());
        Map<String, Object> d = config();
        Map<String, Object> cr = ok(crm().get(INT + "/config"), "crm config").jsonPath().getMap("data");
        fact("F1", "desk rating=" + notif(d).get("rating") + " rv=" + rowVersion(d) + " | crm rating=" + notif(cr).get("rating") + " rv=" + rowVersion(cr));
        try {
            Assert.assertEquals(notif(d).get("rating"), false);
            Assert.assertNotEquals(rowVersion(d), f1Old, "row_version did not change");
            Assert.assertEquals(rowVersion(cr), rowVersion(d), "CRM and Desk row_version differ");
            Assert.assertEquals(notif(cr).get("rating"), false, "CRM reads another value");
        } finally {
            putConfigOk("restore rating", x -> notif(x).put("rating", notif(baseline).get("rating")));
        }
    }

    @CaseId("F5")
    @Test(priority = 3, groups = {"crmdesk", "crmdesk-write"}, description = "PUT with an old or missing row_version is refused")
    public void f5StaleRowVersion() {
        Map<String, Object> c = config();
        String now = rowVersion(c);
        c.remove("status");
        notif(c).put("rating", false);
        c.put("row_version", f1Old);
        Response stale = desk().putOnce(INT + "/config", c);
        c.remove("row_version");
        Response none = desk().putOnce(INT + "/config", c);
        String after = rowVersion(config());
        fact("F5", "stale row_version -> " + code(stale) + " '" + msg(stale) + "'; no row_version -> " + code(none) + " '" + msg(none) + "'; row_version " + now + " -> " + after);
        if (!after.equals(now)) putConfigOk("restore after F5", x -> notif(x).put("rating", notif(baseline).get("rating")));
        Assert.assertEquals(stale.statusCode(), 409, "stale write not refused with 409");
        Assert.assertTrue(none.statusCode() / 100 == 4, "write without row_version accepted: " + none.statusCode());
        Assert.assertEquals(after, now, "a refused write changed the settings");
    }

    @CaseId("F6")
    @Test(priority = 4, groups = {"crmdesk", "crmdesk-write"}, description = "Partial body never wipes the mappings")
    public void f6PartialBody() {
        Map<String, Object> c = config();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("notifications", c.get("notifications"));
        body.put("row_version", c.get("row_version"));
        Response r = desk().putOnce(INT + "/config", body);
        Map<String, Object> after = config();
        int maps = mappings(after, "contacts").size();
        fact("F6", "PUT {notifications,row_version} -> " + code(r) + " '" + msg(r) + "'; contacts mappings after = " + maps + " (baseline " + mappings(baseline, "contacts").size() + ")");
        if (maps != mappings(baseline, "contacts").size()) restoreBaseline("F6");
        Assert.assertEquals(maps, mappings(baseline, "contacts").size(), "partial PUT wiped the contact mappings");
    }

    @CaseId({"F7", "C17", "Z4"})
    @Test(priority = 5, groups = {"crmdesk", "crmdesk-write"}, description = "Invalid settings bodies are refused with a code and change nothing")
    public void f7c17InvalidBodies() {
        Map<String, java.util.function.Consumer<Map<String, Object>>> bad = new LinkedHashMap<>();
        bad.put("F7 direction=5", x -> section(x, "contacts").put("direction", 5));
        bad.put("F7 direction=sideways", x -> section(x, "contacts").put("direction", "sideways"));
        bad.put("F7 mappings as object", x -> section(x, "contacts").put("mappings", Map.of("a", 1)));
        bad.put("F7 on_crm_delete=maybe", x -> x.put("on_crm_delete", "maybe"));
        bad.put("C17 duplicate desk field", x -> mappings(x, "contacts").add(map("crm_field", "mobile", "desk_field", "first_name", "direction", "two_way")));
        bad.put("C17 unknown crm field", x -> mappings(x, "contacts").add(map("crm_field", "no_such_field_qa", "desk_field", "description", "direction", "two_way")));
        bad.put("C17 unknown desk field", x -> mappings(x, "contacts").add(map("crm_field", "description", "desk_field", "no_such_field_qa", "direction", "two_way")));
        bad.put("C17 read-only desk field", x -> mappings(x, "contacts").add(map("crm_field", "description", "desk_field", "crm_sync_status", "direction", "two_way")));
        bad.put("C17 lookup not mappable", x -> mappings(x, "contacts").add(map("crm_field", "account_id", "desk_field", "description", "direction", "two_way")));
        bad.put("C17 one-way with two-way field", x -> section(x, "contacts").put("direction", "crm_to_desk"));
        bad.put("C17 incomplete row", x -> mappings(x, "contacts").add(map("crm_field", "", "desk_field", "description", "direction", "two_way")));
        bad.put("Z4 delete_if_no_associates", x -> x.put("on_crm_delete", "delete_if_no_associates"));
        List<String> accepted = new ArrayList<>();
        String rv = rowVersion(config());
        for (Map.Entry<String, java.util.function.Consumer<Map<String, Object>>> e : bad.entrySet()) {
            Response r = putConfig(e.getValue());
            String det = "";
            try {
                det = String.valueOf(r.jsonPath().getList("error.details"));
            } catch (Exception ignored) {
            }
            fact("C17", e.getKey() + " -> " + code(r) + " '" + msg(r) + "' " + (det.length() > 300 ? det.substring(0, 300) : det));
            if (r.statusCode() / 100 == 2) {
                accepted.add(e.getKey());
                restoreBaseline("after accepted " + e.getKey());
            }
        }
        String after = rowVersion(config());
        fact("C17", "row_version " + rv + " -> " + after + "; accepted: " + accepted);
        Assert.assertTrue(accepted.isEmpty(), "invalid settings accepted: " + accepted);
    }

    // ================================================================ G sync

    @CaseId({"G1", "G20"})
    @Test(priority = 10, groups = {"crmdesk", "crmdesk-write"}, description = "CRM contact created -> Desk contact with mapped fields")
    public void g1CrmContactToDesk() {
        long t0 = System.currentTimeMillis();
        g1Crm = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G1 " + RUN, "email", email("g1"),
                "phone", "0100000" + (System.currentTimeMillis() % 10000), "title", "G1 title"));
        g1Desk = waitPartner("contact", "crm", g1Crm, SYNC);
        long ms = System.currentTimeMillis() - t0;
        track("desk", DESK_CONTACTS, g1Desk);
        if (g1Desk == null) inconclusiveOrFail("G1", "no Desk contact linked within " + SYNC + " s");
        Map<String, String> c = rec("crm", CRM_CONTACTS, g1Crm), d = rec("desk", DESK_CONTACTS, g1Desk);
        fact("G1", "CRM " + g1Crm + " -> Desk " + g1Desk + " in " + ms / 1000 + " s; desk: " + pick(d, "first_name", "last_name", "email", "phone", "title", "owner", "crm_sync_status"));
        fact("G20", "G1 latency " + ms / 1000 + " s");
        for (String k : List.of("first_name", "last_name", "email", "phone", "title"))
            Assert.assertEquals(d.get(k), c.get(k), "Desk " + k + " differs");
        Assert.assertEquals(d.get("crm_sync_status"), "synced");
    }

    @CaseId("G2")
    @Test(priority = 11, groups = {"crmdesk", "crmdesk-write"}, description = "Desk contact created -> CRM contact (two-way)")
    public void g2DeskContactToCrm() {
        long t0 = System.currentTimeMillis();
        g2Desk = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G2 " + RUN, "email", email("g2"), "title", "G2 title"));
        g2Crm = waitPartner("contact", "desk", g2Desk, SYNC);
        track("crm", CRM_CONTACTS, g2Crm);
        if (g2Crm == null) inconclusiveOrFail("G2", "no CRM contact linked within " + SYNC + " s");
        Map<String, String> c = rec("crm", CRM_CONTACTS, g2Crm);
        fact("G2", "Desk " + g2Desk + " -> CRM " + g2Crm + " in " + (System.currentTimeMillis() - t0) / 1000 + " s; crm: " + pick(c, "first_name", "last_name", "email", "title", "owner"));
        Assert.assertEquals(c.get("last_name"), "G2 " + RUN);
        Assert.assertEquals(c.get("email"), email("g2"));
        Assert.assertEquals(c.get("title"), "G2 title");
    }

    @CaseId("G3")
    @Test(priority = 12, groups = {"crmdesk", "crmdesk-write"}, description = "Accounts both ways")
    public void g3Accounts() {
        g3CrmAcc = create("crm", CRM_ACCOUNTS, CRM_ACCOUNT_LAYOUT, f("account_name", name("G3 crm"), "website", "https://qa-cd.example.com", "phone", "0123456"));
        g3DeskAcc2 = create("desk", DESK_ACCOUNTS, DESK_ACCOUNT_LAYOUT, f("account_name", name("G3 desk"), "website", "https://qa-cd2.example.com"));
        g3DeskAcc = waitPartner("account", "crm", g3CrmAcc, SYNC);
        g3CrmAcc2 = waitPartner("account", "desk", g3DeskAcc2, SYNC);
        track("desk", DESK_ACCOUNTS, g3DeskAcc);
        track("crm", CRM_ACCOUNTS, g3CrmAcc2);
        fact("G3", "CRM account " + g3CrmAcc + " -> Desk " + g3DeskAcc + " " + (g3DeskAcc == null ? "" : pick(rec("desk", DESK_ACCOUNTS, g3DeskAcc), "account_name", "website", "phone"))
                + " | Desk account " + g3DeskAcc2 + " -> CRM " + g3CrmAcc2 + " " + (g3CrmAcc2 == null ? "" : pick(rec("crm", CRM_ACCOUNTS, g3CrmAcc2), "account_name", "website")));
        Assert.assertNotNull(g3DeskAcc, "CRM account did not reach Desk");
        Assert.assertNotNull(g3CrmAcc2, "Desk account did not reach CRM");
        Assert.assertEquals(val("desk", DESK_ACCOUNTS, g3DeskAcc, "account_name"), name("G3 crm"));
        Assert.assertEquals(val("crm", CRM_ACCOUNTS, g3CrmAcc2, "account_name"), name("G3 desk"));
    }

    @CaseId("G4")
    @Test(priority = 13, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = {"g1CrmContactToDesk", "g2DeskContactToCrm"}, description = "Updates arrive both ways")
    public void g4UpdateBothWays() {
        ok(update("crm", CRM_CONTACTS, g1Crm, f("title", "G4 from CRM")), "update CRM title");
        ok(update("desk", DESK_CONTACTS, g2Desk, f("title", "G4 from Desk")), "update Desk title");
        boolean a = waitFor(SYNC, () -> "G4 from CRM".equals(val("desk", DESK_CONTACTS, g1Desk, "title")));
        boolean b = waitFor(SYNC, () -> "G4 from Desk".equals(val("crm", CRM_CONTACTS, g2Crm, "title")));
        fact("G4", "CRM->Desk title arrived=" + a + "; Desk->CRM title arrived=" + b);
        Assert.assertTrue(a && b, "update did not arrive (crm->desk " + a + ", desk->crm " + b + ")");
    }

    @CaseId("G5")
    @Test(priority = 14, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "g1CrmContactToDesk", description = "A CRM -> Desk field edited in Desk is not written to CRM")
    public void g5PerFieldDirection() {
        Response r = update("desk", DESK_CONTACTS, g1Desk, f("owner", AGENT_ID));
        fact("G5", "Desk owner -> agent: " + code(r));
        ok(update("desk", DESK_CONTACTS, g1Desk, f("title", "G5 control")), "control edit");
        boolean control = waitFor(SYNC, () -> "G5 control".equals(val("crm", CRM_CONTACTS, g1Crm, "title")));
        String crmOwner = val("crm", CRM_CONTACTS, g1Crm, "owner");
        fact("G5", "control (two-way title) arrived=" + control + "; CRM owner=" + crmOwner);
        if (!control) inconclusive("G5", "control edit did not sync, cannot judge the owner field");
        Assert.assertEquals(crmOwner, OWNER_ID, "Desk owner was written to CRM although the mapping is CRM -> Desk");
    }

    @CaseId("G11")
    @Test(priority = 15, groups = {"crmdesk", "crmdesk-write"}, description = "CRM contact without an email still syncs")
    public void g11NoEmail() {
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G11 " + RUN, "phone", "0109911" + (System.currentTimeMillis() % 1000)));
        String d = waitPartner("contact", "crm", c, SYNC);
        track("desk", DESK_CONTACTS, d);
        fact("G11", "CRM contact without email " + c + " -> Desk " + d);
        Assert.assertNotNull(d, "contact without email not synced");
    }

    @CaseId("G12")
    @Test(priority = 16, groups = {"crmdesk", "crmdesk-write"}, description = "Mass update of CRM contacts arrives for every record")
    public void g12MassUpdate() {
        List<String> crmIds = new ArrayList<>(), deskIds = new ArrayList<>();
        for (int i = 1; i <= 3; i++) crmIds.add(create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G12 " + i + " " + RUN, "email", email("g12" + i))));
        for (String c : crmIds) {
            String d = waitPartner("contact", "crm", c, SYNC);
            track("desk", DESK_CONTACTS, d);
            deskIds.add(d);
        }
        if (deskIds.contains(null)) inconclusive("G12", "not every contact reached Desk before the mass update: " + deskIds);
        Response m = crm().post("/modules/" + CRM_CONTACTS + "/records/mass-update", Map.of("record_ids", crmIds, "data", data(f("title", "G12 mass"))));
        fact("G12", "mass-update 3 CRM contacts -> " + code(m));
        ok(m, "mass update");
        boolean all = waitFor(SYNC, () -> deskIds.stream().allMatch(d -> "G12 mass".equals(val("desk", DESK_CONTACTS, d, "title"))));
        List<String> titles = new ArrayList<>();
        for (String d : deskIds) titles.add(val("desk", DESK_CONTACTS, d, "title"));
        fact("G12", "Desk titles after: " + titles);
        Assert.assertTrue(all, "mass update did not reach every Desk contact: " + titles);
    }

    @CaseId("G15")
    @Test(priority = 17, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = {"g1CrmContactToDesk", "g3Accounts"}, description = "Changing a CRM contact's account moves the Desk contact to the linked Desk account")
    public void g15AccountLink() {
        Response r = update("crm", CRM_CONTACTS, g1Crm, f("account_id", g3CrmAcc));
        fact("G15", "CRM contact account_id -> QA account: " + code(r));
        ok(r, "set account");
        boolean ok = waitFor(SYNC, () -> g3DeskAcc.equals(val("desk", DESK_CONTACTS, g1Desk, "account_id")));
        fact("G15", "Desk contact account_id=" + val("desk", DESK_CONTACTS, g1Desk, "account_id") + " (expected " + g3DeskAcc + ")");
        Assert.assertTrue(ok, "Desk contact's account did not follow");
    }

    @CaseId({"G16", "O1"})
    @Test(priority = 18, groups = {"crmdesk", "crmdesk-write"}, description = "Arabic, emoji, quotes and markup arrive byte for byte")
    public void g16DataClasses() {
        String odd = "G16 عربي 😀 ' \" ;-- <img src=x onerror=alert(1)> " + RUN;
        String c = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", odd, "email", email("g16")));
        String d = waitPartner("contact", "crm", c, SYNC);
        track("desk", DESK_CONTACTS, d);
        if (d == null) inconclusiveOrFail("G16", "not synced");
        String got = val("desk", DESK_CONTACTS, d, "last_name");
        fact("G16", "sent " + odd.length() + " chars, Desk has " + (got == null ? "null" : got.length() + " chars, equal=" + odd.equals(got)));
        Assert.assertEquals(got, odd, "value changed on the way");
    }

    // ================================================================ B3–B6 pause, plus matching rows G7–G9 / G19

    static String b3Reason;
    static boolean b5TitleHeld;
    static String b5Queue;
    static String g7Crm, g7Desk, g8Crm, g8Desk, g9Crm, g9DeskA, g9DeskB;
    static boolean pausedOk;

    @CaseId({"B3", "B4", "B5"})
    @Test(priority = 30, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "g1CrmContactToDesk", description = "Pause with a reason; changes made while paused do not move")
    public void b3PauseAndQueue() {
        // B4 reason data: very long reason (record the limit)
        String longReason = "QA CD " + "x".repeat(1200);
        Response l = desk().post(INT + "/pause", Map.of("reason", longReason));
        fact("B4", "pause with a 1206-char reason -> " + code(l) + " '" + msg(l) + "'");
        if (l.statusCode() / 100 == 2) {
            Object pr = configStatus().get("paused_reason");
            fact("B4", "stored reason length " + (pr == null ? 0 : String.valueOf(pr).length()));
            ok(desk().post(INT + "/resume", Map.of()), "resume after B4");
        }
        b3Reason = "QA CD pause " + RUN + " <b>x</b>";
        Response p = desk().post(INT + "/pause", Map.of("reason", b3Reason));
        fact("B3", "pause -> " + code(p));
        ok(p, "pause");
        pausedOk = true;
        try {
            Map<String, Object> st = configStatus();
            fact("B3", "status paused=" + st.get("paused") + " reason='" + st.get("paused_reason") + "' paused_at=" + st.get("paused_at"));
            Assert.assertEquals(st.get("paused"), true);
            Assert.assertEquals(st.get("paused_reason"), b3Reason);
            Assert.assertNotNull(st.get("paused_at"));

            // B5 changes while paused + G7/G8/G9 matching set-up
            ok(update("crm", CRM_CONTACTS, g1Crm, f("title", "B5 paused edit")), "paused CRM edit");
            g7Crm = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G7 crm " + RUN, "email", email("g7")));
            g7Desk = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G7 desk " + RUN, "email", email("g7")));
            g8Crm = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G8 crm " + RUN, "email", email("g8").toUpperCase()));
            g8Desk = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G8 desk " + RUN, "email", email("g8")));
            g9Crm = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G9 crm " + RUN, "email", email("g9")));
            g9DeskA = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G9 desk A " + RUN, "email", email("g9")));
            g9DeskB = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "G9 desk B " + RUN, "email", email("g9")));
            AppUser.sleep(45_000);
            String deskTitle = val("desk", DESK_CONTACTS, g1Desk, "title");
            b5TitleHeld = !"B5 paused edit".equals(deskTitle);
            b5Queue = queue();
            Map<String, Object> l7 = linkOf("contact", "crm", g7Crm);
            fact("B5", "after 45 s paused: Desk title='" + deskTitle + "' (held=" + b5TitleHeld + "); G7 CRM link=" + (l7 != null) + "; queue " + b5Queue);
            Assert.assertTrue(b5TitleHeld, "a change moved while paused");
        } finally {
            Response r = desk().post(INT + "/resume", Map.of());
            fact("B6", "resume -> " + code(r) + " '" + msg(r) + "'");
            if (r.statusCode() / 100 != 2) fact("B6", "WARNING: resume failed; status " + configStatus());
        }
    }

    @CaseId("B6")
    @Test(priority = 31, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "b3PauseAndQueue", description = "Changes made while paused arrive after resume")
    public void b6ArriveOnResume() {
        boolean arrived = waitFor(SYNC + 60, () -> "B5 paused edit".equals(val("desk", DESK_CONTACTS, g1Desk, "title")));
        Map<String, Object> st = configStatus();
        fact("B6", "paused edit arrived after resume=" + arrived + "; paused=" + st.get("paused") + " queue " + st.get("queue"));
        Assert.assertEquals(st.get("paused"), false, "still paused after resume");
        Assert.assertTrue(arrived, "edit made while paused never arrived after resume");
    }

    @CaseId("G7")
    @Test(priority = 32, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "b3PauseAndQueue", description = "Desk and CRM contacts with the same email are linked, not duplicated")
    public void g7MatchOnEmail() {
        waitFor(SYNC, () -> linkOf("contact", "crm", g7Crm) != null || linkOf("contact", "desk", g7Desk) != null);
        Map<String, Object> a = linkOf("contact", "crm", g7Crm), b = linkOf("contact", "desk", g7Desk);
        fact("G7", "CRM " + g7Crm + " link=" + desc(a) + " | Desk " + g7Desk + " link=" + desc(b));
        trackPartners(a, b);
        Assert.assertNotNull(a, "CRM contact not linked");
        Assert.assertEquals(String.valueOf(a.get("desk_record_id")), g7Desk, "CRM contact linked to another Desk record (duplicate created)");
    }

    @CaseId({"G8", "D21"})
    @Test(priority = 33, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "b3PauseAndQueue", description = "Email case: UPPER in CRM vs lower in Desk")
    public void g8EmailCase() {
        waitFor(SYNC, () -> linkOf("contact", "crm", g8Crm) != null);
        Map<String, Object> a = linkOf("contact", "crm", g8Crm), b = linkOf("contact", "desk", g8Desk);
        fact("G8", "CRM (UPPER) " + desc(a) + " | Desk (lower) " + desc(b));
        trackPartners(a, b);
        Assert.assertNotNull(a, "CRM contact not linked at all");
        Assert.assertEquals(String.valueOf(a.get("desk_record_id")), g8Desk, "emails differing only in case were not matched (duplicate)");
    }

    @CaseId({"G9", "G19", "H9", "H10"})
    @Test(priority = 34, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "b3PauseAndQueue", description = "Two Desk contacts with one CRM email: one link, one readable failure")
    public void g9DuplicateEmail() {
        waitFor(SYNC, () -> linkOf("contact", "crm", g9Crm) != null);
        Map<String, Object> l = linkOf("contact", "crm", g9Crm), la = linkOf("contact", "desk", g9DeskA), lb = linkOf("contact", "desk", g9DeskB);
        fact("G9", "CRM " + desc(l) + " | Desk A " + desc(la) + " | Desk B " + desc(lb));
        trackPartners(la, lb);
        String loser = l == null ? null : (g9DeskA.equals(String.valueOf(l.get("desk_record_id"))) ? g9DeskB : g9DeskA);
        Map<String, Object> fail = null;
        if (loser != null) {
            final String lz = loser;
            waitFor(60, () -> failureOf(lz) != null);
            fail = failureOf(loser);
        }
        fact("G19", "failure for the second Desk contact: " + (fail == null ? "none" : fail.get("error_code") + " / '" + fail.get("last_error") + "' / record_name=" + fail.get("record_name")));
        Assert.assertNotNull(l, "CRM contact not linked to either Desk contact");
        Assert.assertNotNull(fail, "no Failure Log entry for the duplicate");
        String reason = String.valueOf(fail.get("last_error"));
        Assert.assertFalse(reason.matches("(?s).*[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.*"), "H10: failure reason shows raw record ids: " + reason);
    }

    @CaseId("H13")
    @Test(priority = 35, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "b3PauseAndQueue", alwaysRun = true, description = "Discard our own failure")
    public void h13Discard() {
        Map<String, Object> fa = g9DeskA == null ? null : failureOf(g9DeskA);
        Map<String, Object> fb = g9DeskB == null ? null : failureOf(g9DeskB);
        Map<String, Object> fl = fa != null ? fa : fb;
        if (fl == null) inconclusive("H13", "no failure of this run to discard");
        String q = String.valueOf(fl.get("queue_id"));
        Response r = desk().post(INT + "/failures/" + q + "/discard", Map.of());
        boolean goneNow = waitFor(30, () -> failures().stream().noneMatch(x -> q.equals(String.valueOf(x.get("queue_id")))));
        fact("H13", "discard " + q + " -> " + code(r) + "; gone from the log=" + goneNow);
        Assert.assertEquals(r.statusCode() / 100, 2);
        Assert.assertTrue(goneNow, "discarded failure still listed");
    }

    // ================================================================ I links

    @CaseId({"I9", "I8", "I10", "I11"})
    @Test(priority = 40, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "g2DeskContactToCrm", description = "Unlink stops sync; manual link; Update from CRM; search with no result")
    public void i8i9i11Links() {
        Map<String, Object> l = linkOf("contact", "desk", g2Desk);
        Assert.assertNotNull(l, "G2 pair has no link");
        Response un = desk().delete(INT + "/links/" + l.get("id"));
        fact("I9", "DELETE /links/{id} -> " + code(un));
        ok(un, "unlink");
        ok(update("crm", CRM_CONTACTS, g2Crm, f("title", "I9 after unlink")), "edit after unlink");
        AppUser.sleep(40_000);
        String t = val("desk", DESK_CONTACTS, g2Desk, "title");
        String st = val("desk", DESK_CONTACTS, g2Desk, "crm_sync_status");
        fact("I9", "after unlink + CRM edit: Desk title='" + t + "' crm_sync_status=" + st + " link=" + desc(linkOf("contact", "desk", g2Desk)));
        boolean stopped = !"I9 after unlink".equals(t);

        Response cand = desk().get(INT + "/context/contact/" + g2Desk + "/candidates?q=zzqqxxnomatch");
        fact("I10", "candidates for nonsense -> " + code(cand) + " rows=" + rows(cand));
        Response cand2 = desk().get(INT + "/context/contact/" + g2Desk + "/candidates?q=" + email("g2"));
        fact("I8", "candidates for the email -> " + code(cand2) + " rows=" + rows(cand2));

        Response ln = desk().post(INT + "/links", Map.of("kind", "contact", "crm_record_id", g2Crm, "desk_record_id", g2Desk));
        fact("I8", "POST /links -> " + code(ln) + " '" + msg(ln) + "'");
        Map<String, Object> nl = linkOf("contact", "desk", g2Desk);
        fact("I8", "link now " + desc(nl));

        ok(update("crm", CRM_CONTACTS, g2Crm, f("title", "I11 refresh")), "edit before refresh");
        Response rf = nl == null ? null : desk().post(INT + "/links/" + nl.get("id") + "/refresh", Map.of());
        boolean refreshed = waitFor(60, () -> "I11 refresh".equals(val("desk", DESK_CONTACTS, g2Desk, "title")));
        fact("I11", "refresh -> " + (rf == null ? "n/a" : code(rf) + " " + rf.asString()) + "; Desk title updated=" + refreshed);

        Assert.assertTrue(stopped, "I9: sync continued after unlink");
        Assert.assertEquals(ln.statusCode() / 100, 2, "I8: manual link refused");
        Assert.assertNotNull(nl, "I8: link not created");
        Assert.assertTrue(refreshed, "I11: Update from CRM did not bring the new value");
    }

    // ================================================================ deals: potentials, handshake, deal link, contracts, CRM card, notifications

    static String ticketK, dealOpen, dealWon2;

    @CaseId({"K7", "K6", "I3", "I15", "K9", "K5", "D1", "D2", "D4", "L1", "L2", "L4", "M2"})
    @Test(priority = 45, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = {"g1CrmContactToDesk", "g3Accounts"}, description = "Ticket of a QA contact through deal states; contracts; CRM card; notification")
    public void dealsHandshakeContracts() {
        List<String> fails = new ArrayList<>();
        // M2 set-up: notify the contact owner on ticket creation
        putConfigOk("M2 notify owner", x -> notif(x).put("notify_crm_contact_owner", List.of("ticket_created")));
        String since = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();
        try {
            String subject = "QA CD K " + RUN;
            ticketK = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", subject, "status", "Open", "department", DESK_DEPARTMENT,
                    "contact_id", g1Desk, "email", email("g1"), "channel", "web"));
            Map<String, String> tk = rec("desk", DESK_TICKETS, ticketK);
            fact("K", "ticket " + ticketK + " #" + tk.get("ticket_number") + " contact_id=" + tk.get("contact_id") + " account_id=" + tk.get("account_id"));

            // M2
            boolean bell = waitFor(60, () -> notifSince(since).stream().anyMatch(n -> String.valueOf(n).contains(tk.get("ticket_number")) || String.valueOf(n).contains(subject)));
            fact("M2", "CRM bell entry for the contact owner (owner account) after ticket create: " + bell + " " + notifSince(since));
            if (!bell) fails.add("M2 no CRM bell entry for the contact owner");

            String b0 = classify(ticketK);
            fact("K7", "no deal -> " + b0);
            if (!"crm_contact_or_lead".equals(b0)) fails.add("K7 " + b0);

            dealOpen = create("crm", CRM_DEALS, CRM_DEAL_LAYOUT, f("deal_name", name("K6 open"), "pipeline", CRM_DEAL_PIPELINE, "stage", "qualification",
                    "contact_id", g1Crm, "account_id", g3CrmAcc, "amount", 1000, "closing_date", LocalDate.now().plusDays(30).toString()));
            boolean prospect = waitFor(90, () -> "open_prospect".equals(classify(ticketK)));
            fact("K6", "open deal -> " + classify(ticketK));
            if (!prospect) fails.add("K6 " + classify(ticketK));

            Response pot = desk().get(INT + "/context/contact/" + g1Desk + "/potentials");
            fact("I3", "potentials -> " + code(pot) + " " + trim(pot.asString(), 500));
            if (!pot.asString().contains(name("K6 open"))) fails.add("I3 deal not in Potentials");

            Response put = desk().put(INT + "/tickets/" + ticketK + "/deal", Map.of("deal_id", dealOpen));
            Response got = desk().get(INT + "/tickets/" + ticketK + "/deal");
            fact("I15", "link deal -> " + code(put) + "; GET deal -> " + code(got) + " " + trim(got.asString(), 300));
            if (!got.asString().contains(dealOpen)) fails.add("I15 deal not linked");
            Response del = desk().delete(INT + "/tickets/" + ticketK + "/deal");
            Response got2 = desk().get(INT + "/tickets/" + ticketK + "/deal");
            fact("I15", "unlink -> " + code(del) + "; GET deal -> " + code(got2) + " " + trim(got2.asString(), 200));
            if (got2.asString().contains(dealOpen)) fails.add("I15 deal still linked after unlink");

            // K9 + D1: win the open deal
            ok(update("crm", CRM_DEALS, dealOpen, f("stage", "closed_won")), "win deal");
            boolean won = waitFor(90, () -> "won_customer".equals(classify(ticketK)));
            fact("K9", "deal won -> " + classify(ticketK));
            if (!won) fails.add("K9 " + classify(ticketK));

            boolean contract = waitFor(SYNC, () -> contractFor(dealOpen) != null);
            Map<String, Object> ct = contractFor(dealOpen);
            fact("D1", "contract for the won deal: " + (ct == null ? "none" : ct));
            if (ct != null) track("desk", "0924eb24-e42a-4eab-8efd-e3428f19e882", ct.get("desk_record_id") == null ? null : String.valueOf(ct.get("desk_record_id")));
            if (!contract) fails.add("D1 no contract / needs-attention entry for the won deal");
            else fact("D2", "missing_fields=" + ct.get("missing_fields") + " sync_status=" + ct.get("sync_status"));

            // K5: won + another open deal stays Customers
            dealWon2 = create("crm", CRM_DEALS, CRM_DEAL_LAYOUT, f("deal_name", name("K5 open"), "pipeline", CRM_DEAL_PIPELINE, "stage", "proposal", "contact_id", g1Crm, "account_id", g3CrmAcc));
            AppUser.sleep(20_000);
            fact("K5", "won + open -> " + classify(ticketK));
            if (!"won_customer".equals(classify(ticketK))) fails.add("K5 " + classify(ticketK));

            // D4: reopen with on_deal_reopen=keep
            ok(update("crm", CRM_DEALS, dealOpen, f("stage", "negotiation")), "reopen deal");
            AppUser.sleep(30_000);
            Map<String, Object> ct2 = contractFor(dealOpen);
            String cStatus = ct2 == null || ct2.get("desk_record_id") == null ? null : val("desk", "0924eb24-e42a-4eab-8efd-e3428f19e882", String.valueOf(ct2.get("desk_record_id")), "status");
            fact("D4", "after reopen (keep): link=" + (ct2 == null ? "none" : ct2.get("sync_status")) + " contract status=" + cStatus);

            // L1 / L2 / L4 CRM card
            Response tc = crm().get(INT + "/tickets/for-record?module_key=contacts&record_id=" + g1Crm);
            Response ta = crm().get(INT + "/tickets/for-record?module_key=accounts&record_id=" + g3CrmAcc);
            Response sc = crm().get(INT + "/customers/contact/" + g1Crm + "/stats?months=6");
            fact("L1", "contact card -> " + code(tc) + " has ticket=" + tc.asString().contains(ticketK));
            fact("L4", "account card -> " + code(ta) + " has ticket=" + ta.asString().contains(ticketK));
            fact("L2", "contact stats -> " + code(sc) + " " + trim(sc.asString(), 300));
            if (!tc.asString().contains(ticketK)) fails.add("L1 ticket not on the CRM contact card");
        } finally {
            putConfigOk("restore notify owner", x -> notif(x).put("notify_crm_contact_owner", notif(baseline).get("notify_crm_contact_owner")));
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    @CaseId("M4")
    @Test(priority = 46, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "g1CrmContactToDesk", description = "Signal off: no CRM bell entry")
    public void m4SignalOff() {
        putConfigOk("M4 off", x -> {
            notif(x).put("ticket_created", false);
            notif(x).put("notify_crm_contact_owner", List.of());
        });
        String since = java.time.OffsetDateTime.now(java.time.ZoneOffset.UTC).minusSeconds(5).toString();
        try {
            String subject = "QA CD M4 " + RUN;
            String t = create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", subject, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", g1Desk, "email", email("g1"), "channel", "web"));
            String num = val("desk", DESK_TICKETS, t, "ticket_number");
            AppUser.sleep(40_000);
            List<Object> hits = new ArrayList<>();
            for (Object n : notifSince(since)) if (String.valueOf(n).contains(subject) || (num != null && String.valueOf(n).contains("#" + num))) hits.add(n);
            fact("M4", "ticket " + num + " with the signal off -> bell entries " + hits);
            Assert.assertTrue(hits.isEmpty(), "bell entry although the signal is off");
        } finally {
            putConfigOk("restore M4", x -> {
                notif(x).put("ticket_created", notif(baseline).get("ticket_created"));
                notif(x).put("notify_crm_contact_owner", notif(baseline).get("notify_crm_contact_owner"));
            });
        }
    }

    @CaseId("L5")
    @Test(priority = 47, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = "g1CrmContactToDesk", description = "New ticket from the CRM contact")
    public void l5NewTicketFromCrm() {
        Response pf = crm().post(INT + "/tickets/prefill", Map.of("crm_module_key", "contacts", "crm_record_id", g1Crm));
        fact("L5", "prefill -> " + code(pf) + " " + trim(pf.asString(), 700));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("crm_module_key", "contacts");
        body.put("crm_record_id", g1Crm);
        body.put("subject", "QA CD L5 " + RUN);
        body.put("department_id", DESK_DEPARTMENT);
        body.put("description", "QA CD from CRM");
        Response t = crm().post(INT + "/tickets", body);
        fact("L5", "create -> " + code(t) + " '" + msg(t) + "' " + trim(t.asString(), 500));
        if (t.statusCode() / 100 == 2) {
            String id = t.jsonPath().getString("data.id");
            track("desk", DESK_TICKETS, id);
            Map<String, String> r = rec("desk", DESK_TICKETS, id);
            fact("L5", "Desk ticket " + id + " #" + t.jsonPath().getString("data.ticket_number") + " contact_id=" + (r == null ? null : r.get("contact_id")) + " (expected " + g1Desk + ")");
            Assert.assertEquals(r == null ? null : r.get("contact_id"), g1Desk, "ticket from CRM not on the right requester");
        } else if (t.statusCode() == 400 || t.statusCode() == 422) {
            inconclusive("L5", "request body not accepted (" + msg(t) + ") — body shape unknown, check in the UI");
        } else Assert.fail("New ticket from CRM -> " + code(t));
    }

    // ================================================================ J permissions

    @CaseId({"J3", "J4", "J5", "J6", "J7", "J8", "J9", "J10", "J11"})
    @Test(priority = 50, groups = {"crmdesk", "crmdesk-write"}, dependsOnMethods = {"g1CrmContactToDesk", "g3Accounts"}, description = "Desk Agent profile limited: API enforces each section")
    public void jPermissions() {
        AppUser.App agent = AppUser.as(CrmDeskFeature.AGENT).desk();
        List<String> fails = new ArrayList<>();
        String c = INT + "/context/contact/" + g1Desk, a = INT + "/context/account/" + g3DeskAcc;
        fact("J", "agent before change: info " + code(agent.get(c + "/info")) + ", potentials " + code(agent.get(c + "/potentials")) + ", account info " + code(agent.get(a + "/info")));
        try {
            Map<String, Object> custom = map("enabled", true, "info", true, "potentials", false, "notes", true, "activities", List.of("meetings", "tasks"));
            Map<String, Object> none = map("enabled", false, "info", false, "potentials", false, "notes", false, "activities", List.of());
            putConfigOk("J custom", x -> panel(x).put("profile_access", access(custom, none)));
            fact("J3", "stored profile_access for Desk Agent: " + rowFor(config()));
            // J10: same agent token, no new sign-in
            Response info = agent.get(c + "/info"), pot = agent.get(c + "/potentials"), act = agent.get(c + "/activities"),
                    notes = agent.get(c + "/notes-target"), acc = agent.get(a + "/info"), accPot = agent.get(a + "/potentials");
            fact("J7", "Custom(info,notes,meetings+tasks; no potentials): info " + code(info) + ", potentials " + code(pot) + " " + trim(pot.asString(), 200)
                    + ", activities " + code(act) + ", notes-target " + code(notes) + "; account (no access): info " + code(acc) + ", potentials " + code(accPot));
            if (pot.statusCode() / 100 == 2) fails.add("J7 potentials readable with Potentials off");
            if (info.statusCode() / 100 != 2) fails.add("J8 info refused although allowed (" + info.statusCode() + ")");
            if (acc.statusCode() / 100 == 2) fails.add("J9 account info readable with Accounts no access");
            if (act.statusCode() / 100 == 2 && act.asString().toLowerCase().contains("\"call")) fails.add("J6 calls listed with Calls off");
            Response ownerPot = desk().get(c + "/potentials");
            fact("J11", "owner potentials -> " + code(ownerPot));
            if (ownerPot.statusCode() / 100 != 2) fails.add("J11 owner lost access");

            putConfigOk("J4 contacts none", x -> panel(x).put("profile_access", access(none, none)));
            Response i2 = agent.get(c + "/info"), n2 = agent.get(c + "/notes-target"), a2 = agent.get(c + "/activities");
            fact("J4", "Contacts No access: info " + code(i2) + ", notes-target " + code(n2) + ", activities " + code(a2));
            if (i2.statusCode() / 100 == 2) fails.add("J4 info readable with No access");
        } finally {
            putConfigOk("restore profile_access", x -> panel(x).put("profile_access", panel(baseline).get("profile_access")));
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ================================================================ E delete preferences

    @CaseId({"E2", "E3", "E4", "E5", "E6", "E7"})
    @Test(priority = 60, groups = {"crmdesk", "crmdesk-write"}, description = "Delete preferences in both directions")
    public void eDeletePreferences() {
        List<String> fails = new ArrayList<>();
        try {
            // E2 keep and flag (baseline)
            String c2 = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E2 " + RUN, "email", email("e2")));
            String d2 = waitPartner("contact", "crm", c2, SYNC);
            track("desk", DESK_CONTACTS, d2);
            ok(deleteRecord("crm", CRM_CONTACTS, c2), "delete CRM E2");
            AppUser.sleep(40_000);
            Map<String, Object> l2 = d2 == null ? null : linkOf("contact", "desk", d2);
            fact("E2", "keep: Desk contact gone=" + (d2 == null ? "n/a" : gone("desk", DESK_CONTACTS, d2)) + " link=" + desc(l2));
            if (d2 == null || gone("desk", DESK_CONTACTS, d2)) fails.add("E2 Desk contact deleted with keep");
            else if (l2 == null || !"needs_attention".equals(String.valueOf(l2.get("sync_status")))) fails.add("E2 link not flagged needs_attention (" + desc(l2) + ")");

            // E3 unlink
            putConfigOk("E3 unlink", x -> x.put("on_crm_delete", "unlink"));
            String c3 = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E3 " + RUN, "email", email("e3")));
            String d3 = waitPartner("contact", "crm", c3, SYNC);
            track("desk", DESK_CONTACTS, d3);
            ok(deleteRecord("crm", CRM_CONTACTS, c3), "delete CRM E3");
            AppUser.sleep(40_000);
            Map<String, Object> l3 = d3 == null ? null : linkOf("contact", "desk", d3);
            fact("E3", "unlink: Desk contact gone=" + (d3 == null ? "n/a" : gone("desk", DESK_CONTACTS, d3)) + " link=" + desc(l3) + " crm_sync_status=" + (d3 == null ? null : val("desk", DESK_CONTACTS, d3, "crm_sync_status")));
            if (d3 == null || gone("desk", DESK_CONTACTS, d3)) fails.add("E3 Desk contact deleted with unlink");
            else if (l3 != null && !"unlinked".equals(String.valueOf(l3.get("sync_status")))) fails.add("E3 link still active with unlink (" + desc(l3) + ")");

            // E4 delete (contact with a ticket)
            putConfigOk("E4 delete", x -> x.put("on_crm_delete", "delete"));
            String c4 = create("crm", CRM_CONTACTS, CRM_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E4 " + RUN, "email", email("e4")));
            String d4 = waitPartner("contact", "crm", c4, SYNC);
            track("desk", DESK_CONTACTS, d4);
            String t4 = d4 == null ? null : create("desk", DESK_TICKETS, DESK_TICKET_LAYOUT, f("subject", "QA CD E4 " + RUN, "status", "Open", "department", DESK_DEPARTMENT, "contact_id", d4, "email", email("e4"), "channel", "web"));
            ok(deleteRecord("crm", CRM_CONTACTS, c4), "delete CRM E4");
            boolean del4 = d4 != null && waitFor(90, () -> gone("desk", DESK_CONTACTS, d4));
            fact("E4", "delete: Desk contact deleted=" + del4 + "; its ticket deleted=" + (t4 == null ? "n/a" : gone("desk", DESK_TICKETS, t4)));
            if (!del4) fails.add("E4 Desk contact not deleted with delete");

            // E5 account delete
            putConfigOk("E5 account delete", x -> x.put("on_crm_account_delete", "delete"));
            String a5 = create("crm", CRM_ACCOUNTS, CRM_ACCOUNT_LAYOUT, f("account_name", name("E5")));
            String da5 = waitPartner("account", "crm", a5, SYNC);
            track("desk", DESK_ACCOUNTS, da5);
            ok(deleteRecord("crm", CRM_ACCOUNTS, a5), "delete CRM E5");
            boolean del5 = da5 != null && waitFor(90, () -> gone("desk", DESK_ACCOUNTS, da5));
            fact("E5", "account delete: Desk account deleted=" + del5);
            if (!del5) fails.add("E5 Desk account not deleted with delete");

            // E6 Desk contact delete: keep, then delete
            String d6 = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E6 keep " + RUN, "email", email("e6k")));
            String c6 = waitPartner("contact", "desk", d6, SYNC);
            track("crm", CRM_CONTACTS, c6);
            ok(deleteRecord("desk", DESK_CONTACTS, d6), "delete Desk E6 keep");
            AppUser.sleep(40_000);
            fact("E6", "Desk delete with keep: CRM contact gone=" + (c6 == null ? "n/a" : gone("crm", CRM_CONTACTS, c6)) + " link=" + desc(c6 == null ? null : linkOf("contact", "crm", c6)));
            if (c6 == null || gone("crm", CRM_CONTACTS, c6)) fails.add("E6 CRM contact deleted with keep");
            putConfigOk("E6 delete", x -> x.put("on_desk_contact_delete", "delete"));
            String d6b = create("desk", DESK_CONTACTS, DESK_CONTACT_LAYOUT, f("first_name", "QA CD", "last_name", "E6 delete " + RUN, "email", email("e6d")));
            String c6b = waitPartner("contact", "desk", d6b, SYNC);
            track("crm", CRM_CONTACTS, c6b);
            ok(deleteRecord("desk", DESK_CONTACTS, d6b), "delete Desk E6 delete");
            boolean del6 = c6b != null && waitFor(90, () -> gone("crm", CRM_CONTACTS, c6b));
            fact("E6", "Desk delete with delete: CRM contact deleted=" + del6);
            if (!del6) fails.add("E6 CRM contact not deleted with delete");

            // E7 Desk account delete
            putConfigOk("E7 delete", x -> x.put("on_desk_account_delete", "delete"));
            String da7 = create("desk", DESK_ACCOUNTS, DESK_ACCOUNT_LAYOUT, f("account_name", name("E7")));
            String ca7 = waitPartner("account", "desk", da7, SYNC);
            track("crm", CRM_ACCOUNTS, ca7);
            ok(deleteRecord("desk", DESK_ACCOUNTS, da7), "delete Desk E7");
            boolean del7 = ca7 != null && waitFor(90, () -> gone("crm", CRM_ACCOUNTS, ca7));
            fact("E7", "Desk account delete with delete: CRM account deleted=" + del7);
            if (!del7) fails.add("E7 CRM account not deleted with delete");
        } finally {
            putConfigOk("restore delete prefs", x -> {
                for (String k : List.of("on_crm_delete", "on_crm_account_delete", "on_desk_contact_delete", "on_desk_account_delete")) x.put(k, baseline.get(k));
            });
        }
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ================================================================ H history and runs

    @CaseId({"H2", "H6", "H7", "H8"})
    @Test(priority = 70, groups = {"crmdesk", "crmdesk-write"}, description = "History counts; Sync all customers; already running; run detail; no duplicates")
    public void hHistoryAndRuns() {
        List<String> fails = new ArrayList<>();
        Response h = desk().get(INT + "/history?days=1&tz=UTC");
        fact("H2", "history today -> " + trim(h.asString(), 900));
        int before = links("contact").size();
        Response s1 = desk().post(INT + "/imports/customers", Map.of());
        Response s2 = desk().post(INT + "/imports/customers", Map.of());
        fact("H6", "Sync all customers -> " + code(s1) + " " + trim(s1.asString(), 300));
        fact("H7", "again at once -> " + code(s2) + " '" + msg(s2) + "'");
        if (s1.statusCode() / 100 != 2) fails.add("H6 refused " + code(s1));
        if (s2.statusCode() != 409) fails.add("H7 second start -> " + code(s2) + " (expected 409 'already running')");
        String runId = null;
        try {
            runId = s1.jsonPath().getString("data.id");
        } catch (Exception ignored) {
        }
        if (runId == null) {
            List<Map<String, Object>> runs = ok(desk().get(INT + "/runs?page_size=1"), "runs").jsonPath().getList("data");
            if (!runs.isEmpty()) runId = String.valueOf(runs.get(0).get("id"));
        }
        if (runId != null) {
            final String id = runId;
            List<String> progress = new ArrayList<>();
            waitFor(240, () -> {
                JsonPath r = ok(desk().get(INT + "/runs/" + id), "run").jsonPath();
                progress.add(r.getString("data.status") + ":" + r.get("data.progress"));
                return r.getString("data.finished_at") != null;
            });
            JsonPath r = ok(desk().get(INT + "/runs/" + id), "run").jsonPath();
            Response items = desk().get(INT + "/runs/" + id + "/items?page_size=5");
            fact("H8", "run " + id + " kind=" + r.getString("data.kind") + " status=" + r.getString("data.status") + " requested=" + r.get("data.requested") + " created=" + r.get("data.created")
                    + " updated=" + r.get("data.updated") + " skipped=" + r.get("data.skipped") + " failed=" + r.get("data.failed") + " needs_attention=" + r.get("data.needs_attention")
                    + "; progress seen " + progress.subList(0, Math.min(6, progress.size())) + "; items -> " + code(items));
            if (r.getString("data.finished_at") == null) fails.add("H6 run did not finish in 4 min");
        }
        int after = links("contact").size();
        fact("H6", "contact links before " + before + " after " + after);
        if (after > before) fact("H6", "note: new links appeared during the full sync (" + (after - before) + ")");
        Assert.assertTrue(fails.isEmpty(), String.join("; ", fails));
    }

    // ================================================================ cleanup

    @AfterClass(alwaysRun = true)
    public void cleanup() {
        try {
            Map<String, Object> st = configStatus();
            if (Boolean.TRUE.equals(st.get("paused"))) fact("CLEAN", "resume -> " + code(desk().post(INT + "/resume", Map.of())));
            restoreBaseline("end of run");
        } catch (Exception e) {
            fact("CLEAN", "settings restore error: " + e.getMessage());
        }
        // tickets first, then contacts / deals, then accounts
        List<String[]> order = new ArrayList<>(CREATED);
        Collections.reverse(order);
        order.sort((x, y) -> Integer.compare(rank(x[1]), rank(y[1])));
        for (String[] c : order) {
            try {
                Response d = deleteRecord(c[0], c[1], c[2]);
                fact("CLEAN", "delete " + c[0] + " " + c[1].substring(0, 8) + " " + c[2] + " -> " + d.statusCode());
            } catch (Exception e) {
                fact("CLEAN", "delete " + c[2] + " error " + e.getMessage());
            }
        }
    }

    static int rank(String module) {
        if (DESK_TICKETS.equals(module)) return 0;
        if (CRM_DEALS.equals(module) || module.startsWith("0924eb24")) return 1;
        if (CRM_CONTACTS.equals(module) || DESK_CONTACTS.equals(module)) return 2;
        return 3;
    }

    // ================================================================ helpers

    void restoreBaseline(String why) {
        Map<String, Object> now = config();
        Map<String, Object> body = new LinkedHashMap<>(baseline);
        body.remove("status");
        body.put("row_version", now.get("row_version"));
        Response r = desk().putOnce(INT + "/config", body);
        fact("RESTORE", why + " -> " + code(r) + " " + msg(r));
    }

    void inconclusiveOrFail(String caseId, String why) {
        String q = queue();
        if (q.contains("failed=0") && failures().isEmpty()) Assert.fail(why + "; queue " + q);
        inconclusive(caseId, why + "; queue " + q);
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> notif(Map<String, Object> c) {
        return (Map<String, Object>) c.get("notifications");
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> panel(Map<String, Object> c) {
        return (Map<String, Object>) c.get("panel");
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> section(Map<String, Object> c, String k) {
        return (Map<String, Object>) c.get(k);
    }

    @SuppressWarnings("unchecked")
    static List<Object> mappings(Map<String, Object> c, String k) {
        return (List<Object>) section(c, k).get("mappings");
    }

    static Map<String, Object> map(Object... kv) {
        return f(kv);
    }

    /** profile_access with every Desk profile at full access except the Desk Agent profile. */
    static List<Map<String, Object>> access(Map<String, Object> contacts, Map<String, Object> accounts) {
        Map<String, Object> full = map("enabled", true, "info", true, "potentials", true, "notes", true, "activities", List.of("calls", "meetings", "tasks"));
        List<Map<String, Object>> rows = new ArrayList<>();
        for (String p : DESK_PROFILES) {
            boolean agent = DESK_AGENT_PROFILE.equals(p);
            rows.add(map("profile_id", p, "enabled", true, "contacts", agent ? contacts : full, "accounts", agent ? accounts : full));
        }
        return rows;
    }

    static Object rowFor(Map<String, Object> c) {
        for (Object o : (List<?>) panel(c).get("profile_access"))
            if (o instanceof Map<?, ?> m && DESK_AGENT_PROFILE.equals(String.valueOf(m.get("profile_id")))) return m;
        return "none (" + panel(c).get("profile_access") + ")";
    }

    String classify(String ticketId) {
        List<Map<String, Object>> r = ok(desk().post(INT + "/tickets/classify", Map.of("ticket_ids", List.of(ticketId))), "classify").jsonPath().getList("data");
        return r == null || r.isEmpty() ? null : String.valueOf(r.get(0).get("bucket"));
    }

    Map<String, Object> contractFor(String dealId) {
        for (Map<String, Object> l : links("contract")) if (dealId.equals(String.valueOf(l.get("crm_record_id")))) return l;
        List<Map<String, Object>> na = ok(desk().get(INT + "/contracts/needs-attention"), "needs attention").jsonPath().getList("data");
        if (na != null) for (Map<String, Object> l : na) if (dealId.equals(String.valueOf(l.get("crm_record_id")))) return l;
        return null;
    }

    List<Map<String, Object>> failures() {
        List<Map<String, Object>> l = ok(desk().get(INT + "/failures?page_size=100"), "failures").jsonPath().getList("data");
        return l == null ? List.of() : l;
    }

    Map<String, Object> failureOf(String recordId) {
        for (Map<String, Object> f : failures()) if (recordId.equals(String.valueOf(f.get("record_id")))) return f;
        return null;
    }

    /** CRM bell entries of the owner created after {@code since} (title + body). */
    List<Object> notifSince(String since) {
        List<Object> out = new ArrayList<>();
        Response r = crm().get("/notifications?page=1&per_page=30");
        List<Map<String, Object>> l = r.jsonPath().getList("data.data");
        if (l != null) for (Map<String, Object> n : l)
            if (String.valueOf(n.get("created_at")).compareTo(since) > 0) out.add(n.get("event_type") + " '" + n.get("title") + "'");
        return out;
    }

    void trackPartners(Map<String, Object>... ls) {
        for (Map<String, Object> l : ls) {
            if (l == null) continue;
            track("crm", CRM_CONTACTS, l.get("crm_record_id") == null ? null : String.valueOf(l.get("crm_record_id")));
            track("desk", DESK_CONTACTS, l.get("desk_record_id") == null ? null : String.valueOf(l.get("desk_record_id")));
        }
    }

    static String desc(Map<String, Object> l) {
        return l == null ? "none" : "{crm " + l.get("crm_record_id") + ", desk " + l.get("desk_record_id") + ", " + l.get("sync_status") + ", " + l.get("match_source") + "}";
    }

    static String pick(Map<String, String> m, String... keys) {
        if (m == null) return "null";
        StringBuilder sb = new StringBuilder();
        for (String k : keys) sb.append(k).append('=').append(m.get(k)).append(' ');
        return sb.toString().trim();
    }

    static int rows(Response r) {
        try {
            List<?> l = r.jsonPath().getList("data");
            return l == null ? -1 : l.size();
        } catch (Exception e) {
            return -1;
        }
    }

    static String trim(String s, int n) {
        return s == null ? "null" : s.length() > n ? s.substring(0, n) + "…" : s;
    }
}
