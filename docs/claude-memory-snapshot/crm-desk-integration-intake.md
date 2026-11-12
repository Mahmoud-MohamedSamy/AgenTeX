---
name: crm-desk-integration-intake
description: "TAVI CRM ⇄ Desk Integration vs Zoho intake (18 Oct 2026): PRD NDC-1669, missing list path, API surface, Zoho orgs now integrated, phase gates"
metadata:
  node_type: memory
  type: project
  originSessionId: 3964bede-c16e-4428-87e8-0770dac89519
  modified: 2026-10-22T07:18:12.675Z
---

Started 18 Oct 2026 (skills new-feature-testing + selenium-test-automation). User's gates: Phase 1 missing list + annotated evidence → review → Phase 2 spec → review → Phase 3 execution. Plane ticket only AFTER the user approves the list (user chose "Plane later").
- PRD **NDC-1669** (Backlog). Related: NDC-1981 (light agents), NDC-1783. NDC-2069 and NDC-2195 are Omnichannel↔Desk, not this feature.
- Files: `docs/crm-desk-integration/crm-desk-integration-missing-list.md` (8 gaps), `evidence/` (make-configs.js → configs/*.json → make-evidence.js; originals/tavi t01–t10, originals/zoho 01–19), `reference/` (zoho-docs-inventory.md 153 items, tavi-baseline-config-2026-10-18.json row_version 35570115, tavi-api-routes.txt).
- TAVI: settings page CRM `/settings/integrations/desk`, Desk `/settings/integrations/crm`; perms `desk:integration:view|manage`; API base `/api/v1/desk/integrations/crm` (status, config GET/PUT, connect/disconnect/pause/resume, runs, history, failures retry/retry-all/discard, links, context/{contact|account}/{deskId}/info|potentials|activities|notes-target, tickets/for-record, customers/{kind}/{id}/stats, tickets/classify, mentionable-users). Context kind is singular (`contact`), plural gives 400. Locale `/locales/en/crm-desk-integration.json` = full UI map.
- Staging integration was connected by a teammate at 11:27 on 18 Oct. Stay read-only unless the user OKs it.
- **Zoho changed (user approved):** Zoho Desk `taviportal` integrated with Zoho CRM org943261092 using defaults; still active. Login row 1 of `Zoho Desk Credentials.csv`. Zoho Desk setup content lives in an iframe; CRM settings URL `/crm/org943261092/settings/extensions/zoho/desk`; snapshot refs fail on CRM pages, so click by coordinates there.
- Traps: Git Bash mangles `/desk/...` args → `MSYS_NO_PATHCONV=1`; a Desk login revokes the CRM session (re-login with the HOST env login.js in the scratchpad); TAVI tabs need getByRole('tab').

- 18 Oct: user approved the 8 evidence images and said move to Phase 2, **don't publish anything on Plane unless told**. Spec written: `docs/crm-desk-integration/spec-crm-desk-integration.md` (groups A–O, E2E-1..6, Z1–Z8, ~209 rows), awaiting review before Phase 3.

- 19 Oct: user described the feature (sync settings, products, delete prefs, related lists, permissions) and decided TAVI must match Zoho. Added gap 9 (permission defaults: Zoho = admin only, TAVI = all Full; "Restricted" vs "Custom"). TAVI CRM has no Products/Vendors/Cases modules, so related-list difference is a note, not a gap. HTML spec: tools/make-spec-html.js.

- 19 Oct Phase 3 Run 1 (read-only, user OK; writes need a new OK): automation feature `crmdeskintegration` (ReadApiTest 21, ReadUiTest 16). 26 pass, 8 fail (I16 raw labels, H10 ids in reasons, H3 no failed count, O3 stats 200 for missing id, Z4, Z9 x2), 3 not rerun: HTTP 429 on owner API sign-in (probe scripts signed in per call — avoid). Report `executions/execu_2026-10-19_crm-desk-integration/report.md`. Agent account fedelav803 in automation/.auth/extra-credentials.csv (gitignored).

**Why:** Phases 2 and 3 reuse these ids, paths and the live Zoho pair.
**How to apply:** wait for the user's review before writing the spec; ask before deleting the Zoho integration. Related: [[annotate-evidence-vs-zoho]], [[zoho-reference-capture]], [[selenium-automation-framework]].

**20 Oct 2026 — full spec executed (user: "Go now", "Full: include Disconnect").** Missing report HTML: docs/crm-desk-integration/missing-report.html. Run 2 writes + Run 3 disconnect/reconnect done; settings restored and diffed = baseline; connected_at now 2026-10-20 15:32:54 UTC. 10 bugs CD-01..CD-10 in executions/execu_2026-10-20_crm-desk-integration/bug-report.html (CD-01 High: Unlink doesn't stop sync, re-links by email). Nothing in Plane. Open: M2/M3/M6–M9 need a 2nd CRM user; B12 needs >12-month records; UI-only rows (C5–C16, F3/F4, L9–L16, O5–O8) not run.

**21 Oct 2026 — parity pass (user: every Zoho item must be missing or implemented).** docs/crm-desk-integration/zoho-parity-matrix.md classifies all 153 inventory items (77 impl / 25 missing / 4 bug / 42 N/A). Missing list now gaps 1–18 (+ images 10–15, 18); bugs CD-11 (mandatory Last name skipped), CD-12 (Handshake ignores phone) → 12 bugs. Pending user OK: 2nd Disconnect to see CRM side (Zoho 119/143) and switching owner's ticket mode to Handshake (Zoho 59) — auto-mode classifier blocked both as shared-state changes; ask, don't work around. CRM-only test user nameb56175 (CRM "User", no Desk profile).

**21 Oct 2026 (later):** user said "run both": 2nd disconnect done (CRM hides card + Desk menu = implemented; deal-ticket link kept = not a gap), Handshake empty columns shown = gap 19. Matrix complete, 0 pending. connected_at now 2026-10-21 11:18:11 UTC; owner view restored to Classic.

**21 Oct 2026 (evening):** remaining spec rows run (RemainingApiTest/RemainingUiTest/RoleUiTest/FinalApiTest). New bugs CD-13 (delete pref retroactive), CD-14 (integration-deleted Desk contact not in recycle bin), CD-15 (No access pane hangs Loading), CD-16 (pane error no Retry), CD-17 (no audit for settings) -> 17 bugs. Traps: generic text clicks hit the top nav (use DeskRecordPage.paneTab); language switch is stored only in .auth session localStorage (anyware_language); other sessions run mvn in the same automation/ folder (a broken file of theirs empties target/test-classes - wait, never edit it); low-memory reaper kills watchers but surefire JVM keeps running.

**21 Oct 2026 (late):** A5 done via per-user override POST /iam/users/{id}/overrides?app_key=desk {permission_key, effect:GRANT|DENY} (cleared after). Spec updated (status executed, Z10–Z19, HTML regenerated). Zoho Desk↔Zoho CRM integration DELETED on user request (Zoho Desk page is inside the ShowHomePage.do iframe; menu = .zd_v1-secondarybandright-moreIcon). Plane still not published (user will say when). Open by user choice: other blocked rows, git commit.

**22 Oct 2026:** combined report executions/execu_2026-10-20_crm-desk-integration/crm-desk-integration-report.html (generator evidence/src/make-full-report.js; verdict map per row inside). Verdict mapping found 12 rows never run (A2, A6, C8, C12, C14, C15, C16, H4, H5, H14, L15, M10) — earlier claim "all runnable rows done" was wrong; told the user.

**22 Oct 2026 — Plane filed (user said publish):** gap NDC-2392 (Backlog, High), bugs CD-01..CD-18 = NDC-2393..NDC-2410 (Bug, Hegazy + MahmoudMohamed, label Desk Integrations, module Desk, Sprint 13); comment on NDC-1669. Images attached on 22 Oct: 17 on NDC-2392, 1 on each bug. To attach, upload the file to uguu.se (`curl -F "files[]=@f" https://uguu.se/upload`; the link lasts about 3h), then call workitem_attachment upload_from_url. litterbox gave 502 and 0x0.st refuses uploads. Plane S3 sometimes returns 500; a retry works.

**9 Nov 2026 recheck on NDC-Staging (posted with images):** 4 built (2,3,4,14), 2 partly (1,5), 11 missing, 2 not checked (8 needs owner deactivated; 19 out of scope); comment 96366380; integration connected since 5 Nov, 410 parked failures. Files executions/execu_2026-11-09_retest-gaplists-high/ndc-2392.
