# CRM ⇄ Desk Integration: spec execution, 19–20 Oct 2026

- **Spec:** `docs/crm-desk-integration/spec-crm-desk-integration.md`
- **Missing features:** `docs/crm-desk-integration/missing-report.html` (Z1–Z9)
- **PRD:** NDC-1669
- **Bugs:** `bug-report.html` in this folder (10 bugs, CD-01 … CD-10). Images are in `evidence/`.
- **Apps:** staging-crm and staging-desk.taviportal.com (tenant NDC-Staging), Edge headless.
- **Accounts:** owner (the integrated user) and the Desk agent `fedelav803` (profile Desk Agent).
- **Approval:**
  - 19 Oct — Run 1, read-only.
  - 20 Oct — the user said "Go now" for writes and "Full: include Disconnect" for the connection run.
- **Plane:** nothing filed.

## Runs

| Run | When (UTC) | Automation | Result |
|---|---|---|---|
| 1 Read-only | 19 Oct | `ReadApiTest` (21), `ReadUiTest` (16) | 29 pass, 8 fail (the 3 checks blocked by HTTP 429 were re-run on 20 Oct and pass) |
| 2 Writes | 20 Oct 15:05–15:30 | `WriteRunTest` (27), `RecheckTest` (2) | 23 pass, 4 fail, 1 inconclusive (see below) |
| 3 Connection | 20 Oct 15:30–15:36 | `ConnectionRunTest` (4), `K10CheckTest` (1) | 1 pass, 4 fail (K10 twice, B11, J1a / Z9) |

**Run 2 stopped once, but finished.** Claude Code stopped the Maven shell because the machine was low on memory. The test JVM kept running, finished every test, restored the settings and deleted its records. Nothing was re-run because of it.

## Bugs (details in bug-report.html)

| Bug | Case | Severity (suggested) | Summary |
|---|---|---|---|
| CD-01 | I9 / I8 | High | Unlink does not stop the sync. The next CRM change re-links the pair by email and syncs, against TAVI's own dialog: "Syncing stops for this record until it is linked again." |
| CD-02 | K10 | Medium | Handshake Mode is still offered while the sync is paused (it is hidden when disconnected) |
| CD-03 | H10 / G19 | Medium | Failure Log reasons show raw record ids |
| CD-04 | C17 | Medium | The settings API saves invalid mappings: unknown CRM field, unknown Desk field, a lookup field, an empty row |
| CD-05 | F5 | Medium | A settings PUT without `row_version` is accepted (a stale one gets 409), so the lost-update check can be skipped |
| CD-06 | H3 | Medium | Sync History has no failed count |
| CD-07 | B11 | Low | No notice to the admin when the initial sync finishes |
| CD-08 | I16 | Low | The Desk contact list shows the raw values `synced` / `needs_attention` |
| CD-09 | B4 | Low | A pause reason of 1,206 characters gives HTTP 500 |
| CD-10 | O3 | Low | Customer stats answer 200 with zeros for a contact that does not exist |

**Gaps confirmed again** (in the missing report, not bugs):
- **Z4:** `on_crm_delete = delete_if_no_associates` is refused with 422 `value_invalid`.
- **Z9:**
  - `panel.profile_access` is empty right after a fresh Connect, so every profile has Full Access.
  - The middle access level is named "Custom Access".

## Verdict per executed row

### A Access
- **A1** Pass: both settings pages, subtitles and tabs.
- **A3** Pass: the agent gets 403 on config, runs, history, failures and links.
- **A4** Pass: as the agent, PUT config, pause, connect, imports, retry-all, discard and links POST/DELETE all get 403; row_version unchanged.
- **A7** Pass: same value and same row_version in CRM and Desk after a save.
- **A10** Pass: 401 without a token or with a bad token.

### B Connection
- **B1 / B2** Pass: Overview, connection dates, queue counts, "Needs attention: 2" pill (re-run 20 Oct).
- **B3** Pass:
  - The dialog text matches.
  - "Paused: QA CD UI pause …" is shown.
  - The API stores the reason as text, including `<b>`.
- **B4** **Fail (CD-09):** the 1,206-character reason gives 500.
- **B5** Pass: an edit made while paused did not move for 45 s; the queue held 8.
- **B6** Pass: after Resume the edit arrived and the queue drained.
- **B7** Recorded: after Pause, then Disconnect, the status is enabled = false, paused = true. Reconnecting cleared paused.
- **B8** Pass:
  - The dialog text matches.
  - "Not connected" is shown.
  - Links unchanged (53).
  - A CRM contact created while disconnected was not synced.
- **B9** Pass:
  - The dialog text matches.
  - "Integration connected."
  - The initial customer and contract imports ran.
  - `connected_at` changed to 2026-10-20 15:32:54 UTC.
- **B10** Inconclusive: the imports finished in about 3 s, so no progress text could be seen.
- **B11** **Fail (CD-07)**
- **B12** Not run: no CRM records older than 12 months.
- **B13** Not run.
- **B14** Pass:
  - No duplicates; links 53 → 54.
  - The +1 is the contact created while disconnected, picked up by the import. It was then deleted.

### C Mapping settings
- **C1 / C2** Pass (Run 1).
- **C3 / C4** Pass: schemas match the saved mappings.
- **C17** **Fail (CD-04):** 4 invalid bodies are accepted. Duplicate field, read-only target, one-way with two-way rows, bad direction and bad enum are refused correctly (422 `CRM_SYNC_MAPPING_INVALID`).
- **C5–C16, C18** Not run. These are the UI messages in the mapping editor; the API codes behind them are covered by C17.

### D Contracts and Calls
- **D1** Pass: a Closed-Won QA deal created a Desk contract.
- **D2** Pass: draft and needs-attention, with `missing_fields: [end_date]` (no support fields on staging deals).
- **D4** Pass: reopening with "keep" left the draft contract unchanged.
- **D3, D5–D15** Not run:
  - The terminate settings, lock and defaults were not exercised.
  - Calls: staging telephony does not log calls (spec §1.4).

### E Delete preferences and related lists
- **E1** Fail (Z4, gap).
- **E2** Pass: keep → the Desk contact stays and the link is `needs_attention`.
- **E3** Pass: unlink → the Desk contact stays, link and badge "Unlinked".
- **E4** Pass: delete → the Desk contact and its ticket are deleted.
- **E5** Pass: account delete → the Desk account is deleted.
- **E6** Pass:
  - keep → the CRM contact stays.
  - delete → the CRM contact is deleted.
- **E7** Pass: the Desk account deleted → the CRM account is deleted.
- **E10** Pass (Run 1).
- **E8, E9, E11, E12** Not run.

### F Save and concurrency
- **F1** Pass.
- **F5** **Fail (CD-05)**
- **F6** Pass: a body with only notifications kept the 8 contact mappings.
- **F7** Pass: bad types and enums are refused.
- **F2–F4, F8** Not run (two-tab UI, audit log).

### G Sync
- **G1** Pass, about 5 s.
- **G2** Pass, about 4 s.
- **G3** Pass, accounts both ways.
- **G4** Pass.
- **G5** Pass: the Desk owner change was not written to CRM.
- **G7** Pass: matched on email, no duplicate.
- **G8** Pass: email case ignored.
- **G9** Pass: one link plus a failure entry.
- **G11** Pass.
- **G12** Pass: mass update of 3.
- **G15** Pass: the account link followed.
- **G16** Pass: Arabic, emoji, quotes and markup are byte-identical.
- **G19** **Fail (CD-03).**
- **G20** about 5 s.
- **G6, G10, G13, G14, G17, G18** Not run.

### H History and Failure Log
- **H1** Pass.
- **H2** Pass: counts rose with the run (crm→desk contacts added 9, updated 10 on 20 Oct).
- **H3** **Fail (CD-06).**
- **H6** Pass: 202 and run created.
- **H7** Pass: 409. The message shows the raw kind "A initial_customers run …".
- **H8** Pass: run details and items. No duplicates; links 53 → 53.
- **H9** Pass.
- **H10** **Fail (CD-03).**
- **H13** Pass: our failure was discarded and left the log.
- **H11, H12** Not run: Retry all would re-queue a teammate's 2 parked failures.
- **H4, H5, H14** Not run.

### I Desk agent view
- **I1 / I2** Pass (re-run 20 Oct).
- **I3** Pass: the QA deal is in Potentials with stage and amount.
- **I7** Pass:
  - "Not linked to a CRM record".
  - While disconnected, the pane is not shown.
- **I8** Fail via CD-01: the pair was already re-linked, so a manual link gave 409.
- **I9** **Fail (CD-01).**
- **I10** Pass: a nonsense search gives 0 rows.
- **I11** Pass: Update from CRM returns `outcome: updated`.
- **I15** Pass: link and unlink a deal on the ticket.
- **I16** **Fail (CD-08).**
- **I17** Pass.
- **I4–I6, I12–I14, I18** Not run.

### J Permissions (Desk Agent profile changed for about 1 min, then restored)
- **J1 / J1a** Fail (Z9 gap):
  - The middle level is named "Custom Access".
  - All profiles have Full Access by default and after Connect.
- **J3** Pass: the custom access is stored per profile.
- **J4** Pass: Contacts set to No access → info, notes and activities give 403.
- **J5 / J7** Pass: with Potentials off → 403 "Your profile may not open the potentials tab".
- **J8** Pass: allowed sections answer 200.
- **J9** Pass: Accounts set to No access → account info and potentials give 403.
- **J10** Pass: applied without signing in again.
- **J11** Pass: the owner is unaffected.
- **J6** Partial: activities answered 200. No QA calls existed to prove calls are hidden.
- **J2, J12** Not run.

### K Handshake Mode
- **K1** Pass.
- **K2** Pass.
- **K3 / K9** Pass: the deal was won live → `won_customer`.
- **K5** Pass: won plus open → Customers.
- **K6** Pass: open deal → `open_prospect`.
- **K7** Pass.
- **K8** Pass (Run 1).
- **K10** **Fail (CD-02)** while paused; correct while disconnected.
- **K4** Not run (phone-only match).

### L CRM side
- **L1** Pass, contact card.
- **L2** Pass: `/stats` counts the tickets. `/customers/contact/{CRM id}/stats` answers 0 because it expects the Desk id; not a bug.
- **L3** Pass.
- **L4** Pass, account card.
- **L5** Pass: a ticket created from CRM lands on the linked Desk contact (#317).
- **L17** Recorded: the CRM contact page opens normally while disconnected.
- **L6–L16, L18–L22** Not run (card actions in the UI, workspace, contracts card).

### M Notifications
- **M1** Pass.
- **M4** Pass: with the signal off there is no bell entry.
- **M5** Pass.
- **M2** Inconclusive: no bell entry, but the contact owner was the same account that created the ticket.
- **M3, M6–M10** Not run: they need a second CRM user to receive notices, and Light Agents.

### O Security and other
- **O1** Pass at the API level: markup is stored as text. Rendering was not checked on every screen.
- **O3** **Fail (CD-10).**
- **O4** Pass.
- **O2, O5–O11** Not run: cross-tenant, Arabic, keyboard, narrow screens, performance, other browsers.

### E2E
The journeys were covered in pieces by the chained Run 2 tests:
- **E2E-1:** account, contact, deal won → contract → ticket in Customers → CRM card.
- **E2E-2:** a Desk contact created and edited, both ways.
- **E2E-4:** restricted agent.
- **E2E-5:** failure → discard.
- **E2E-6:** cleanup and restore.

E2E-3 (mentions and the reply from CRM) was not run.

### Z Gaps
- Still missing: Z1, Z2, Z3, Z5, Z6, Z7.
- Confirmed by behaviour: Z4, Z9.
- Not automated: Z8.

## Restore proof (20 Oct, after the last run)
- Every section of the settings matches the 20 Oct baseline: contacts, accounts, contracts, the 4 delete preferences, panel, notifications, related lists, ticket visibility and calls (`RecheckTest`, "same as baseline").
- Status: enabled, not paused, queue `{queued 2, processing 0, failed 0, parked 2}`, health unchanged. `connected_at` is new because of the approved reconnect.
- Every `QA CD` record was deleted in both apps (HTTP 204 each): 45 from Run 2, 4 from the re-check, and the Run 3 pair.
- These deleted records are in the Recycle Bins, and their link and history rows remain.
- The Desk Agent profile access was restored to the baseline (empty = Full Access).

## Coverage gaps to close later
- A second CRM user who is not the ticket creator, for M2, M3 and M6–M9 (mentions, Light Agents).
- CRM records older than 12 months, for B12.
- Telephony that logs calls, for D13–D15.
- A second tenant, for A11 and O2.
- UI-only rows: the mapping editor messages (C5–C16), two-tab conflict (F3/F4), CRM card actions (L9–L13), workspace (L16), Arabic, keyboard and narrow-screen rows (O5–O8).

## Files
- `run2-facts.txt`, `run2-summary.json`, `crmdesk-run3.log`, `crmdesk-recheck.log`, `crmdesk-k10.log`
- `baseline/config.json`, `baseline/status.json`
- Automation:
  - `automation/src/test/java/qa/features/crmdeskintegration/`: `WriteBase`, `WriteRunTest`, `ConnectionRunTest`, `RecheckTest`, `K10CheckTest`, `ProbeTest`.
  - The page objects gained the connection actions and the Layout-picker screenshot.

## Zoho parity pass (21 Oct 2026)

The user asked to make sure every Zoho behaviour is classified as either missing or implemented. All 153 items of `reference/zoho-docs-inventory.md` now have a verdict in `docs/crm-desk-integration/zoho-parity-matrix.md`:

| Verdict | Items |
|---|---|
| Implemented | 77 |
| Missing | 25 |
| Bug | 4 |
| N/A | 42 |
| Repeats | 2 |
| Not testable | 1 |
| Pending | 2 |

New checks:
- `ParityApiTest`: 12 checks.
- `ParityUiTest`: 5 screen checks, with screenshots in `automation/target/evidence/parity/`.

Passed (implemented):
- CRM-only user:
  - Can view tickets.
  - Gets 403 on the settings and on create, close or edit.
- Ticket visibility by the user's departments is enforced.
- The contact owner is notified on a new ticket.
- An @mention of a CRM user reaches the CRM bell.
- The CRM card's update / close / delete calls work.
- One-way sync. Switching back doesn't push old edits.
- Accounts are matched by name.
- Incompatible field types are blocked.
- New mappings are not retroactive.
- Fix and Retry clears a failure.
- CRM pane on the Desk account page.
- Mapped / Unmapped views (in the code).
- Desk menu and ticket workspace in CRM: reply, reply all, forward, comment.
- Pause and Disconnect are also on the CRM page.

New bugs:
- **CD-11:** sync creates a Desk contact without the mandatory Last name.
- **CD-12:** Handshake does not match by phone.

New gaps (10–18):
- 10: no initial-sync report.
- 11: CRM Leads are not considered.
- 12: CRM users are not Light Agents and can't comment.
- 13: no @CRM Contact Owner.
- 14: can't act from the CRM notification.
- 15: no handling for an inactive integrated user.
- 16: Zia Voice of the Customer.
- 17: cross-app analytics.
- 18: the 12-month window isn't stated.

Pending the user's OK (blocked by the safety rule, because they change shared state):
- Zoho 119 / 143: what CRM shows after a Disconnect, and whether deal–ticket links survive.
- Zoho 59: empty Handshake columns (needs the shared owner's ticket view switched).

Cleanup: every parity record was deleted (204), and the settings were restored from the baseline after each change.

### Shared-state checks (21 Oct, user: "run both")
- **Zoho 119 — Implemented.** While disconnected:
  - CRM hides the Desk Tickets card and removes "Desk" from the menu.
  - The workspace says "Desk is not available".
- **Zoho 143 — Implemented differently.** The ticket–deal link survives a disconnect and reconnect. Zoho deletes it; TAVI keeps it, as its Disconnect dialog promises. Not a gap.
- **Zoho 59 — new gap 19.** The empty Customers column is shown; Zoho hides empty columns.
- **State after the checks:**
  - Reconnected, not paused. `connected_at` is now 2026-10-21 11:18:11 UTC.
  - The owner's ticket view is back on Classic View.
  - The QA records were deleted.
- **Result:** all 153 Zoho items are classified; none is pending.

## Remaining rows (21 Oct, user: "run the remaining 45 rows")

Classes: `RemainingApiTest`, `RemainingUiTest`, `RoleUiTest` (as the agent and as the CRM-only user), and `FinalApiTest`. Screenshots are in `automation/target/evidence/remaining/`.

**Pass:**

| Group | Rows |
|---|---|
| Contracts | D3, D4, D5, D7, D8, D9, D10, D11 |
| Delete / related lists | E11, E12 |
| Save and conflict | F2, F3, F4 |
| Sync | G14 |
| Mapping editor | C6, C11, C13, C18 (number and lookup fields are not offered at all) |
| Pane | I4, I5, I6, I12 |
| CRM card | L6, L9, L13, L14, L18, L20, L21, L22 |
| Permissions and roles | A8, A9, J2, J5, J6 |
| Journey | E2E-3 |
| Accessibility, language, layout | O5 (Arabic: 450/450 strings, RTL), O6, O7, O8 |
| Performance and browsers | O9 (500 contacts: imported in 78 s, all synced 62 s later, queue drained, History counted; 1,000 records deleted), O11 (Chrome 5/5) |
| Connection | B13 (runs are server-side) |

**Partial:**
- I18: the error is shown, but there is no Retry (CD-16).
- O10: typical pane calls take 0.6–1.6 s. Three of 15 were over 2 s, including a cold first call of 5.1 s.

**New bugs:**
- **CD-13 (E8):** a preference change is applied to an earlier delete.
- **CD-14 (E9):** a Desk contact deleted by the integration is not in the recycle bin.
- **CD-15 (J4):** with "No access" the pane is still offered and hangs on "Loading…".
- **CD-16 (I18):** the pane error has no Retry.
- **CD-17 (F8):** integration settings changes are not in the Audit Log.

**Inconclusive or blocked:**
- D6: draft contracts can't be edited because required fields are missing.
- G17: Desk rejects the bad value up front.
- L10: needs a ticket already linked to a deal.
- O11 Firefox: not installed.
- A5: no view-only admin profile.
- B12, D13–D15, A11, O2: blocked by staging, as before.

**State afterwards:**
- Every settings section matches the baseline. The integration is connected and not paused.
- The automation session's language is English.
- Every QA record was deleted, including the 1,000 from O9.
- Parked failures went from 2 to 5. The 3 new ones are a teammate's, created on 21 Oct at 09:15–09:39 UTC, before this run started.

**Totals now:** 17 bugs (CD-01–CD-17) and 19 gaps. All 153 Zoho items are classified.

## Last closable rows (21 Oct, user: "continue")
- **L10 — Pass.** On the CRM card, a ticket linked to a deal can be selected and unlinked with "Unlink from deal" (toast "Ticket unlinked from the deal."). The link is removed.
- **D6 — Fail (CD-18).** The draft contract was completed with a support plan, account and dates. With "Lock CRM-owned fields" on, editing the CRM-owned contract name in Desk was still accepted and saved.
- **G17 — Inconclusive.** Desk and CRM accept the same phone formats (+44 …), so a value can't be valid on one side and invalid on the other.
- **Final count:**
  - 18 bugs (CD-01–CD-18).
  - Only rows that need things staging doesn't have, plus G17, remain without a verdict: B12, D13–D15, A11, O2, A5, Firefox.
- **A5 — Pass (21 Oct, user OK "go ahead with 2d").** The QA agent got a per-user override `desk:integration:view = GRANT`; no tenant profile was changed. Results:
  - Settings readable (200); PUT config and pause refused (403).
  - The page shows "You can view these settings but not change them.".
  - No Pause / Disconnect / Save buttons. Edit and Configure only expand the rows; the preference dropdowns are disabled.
  - The override was cleared afterwards; the agent is back to 403 and has no overrides left.
- Remaining rows without a verdict: B12, D13–D15, A11, O2, Firefox (staging lacks them), and G17 (inconclusive).

## Plane (22 Oct 2026, user: "publish plane tickets")
- **Missing list:** NDC-2392 (Backlog, High). It holds the 19 gaps, grouped by area, so its numbering differs from the missing list document.
- **Bugs:**

  | Bugs | Tickets |
  |---|---|
  | CD-01 … CD-10 | NDC-2393 … NDC-2402 |
  | CD-11 … CD-18 | NDC-2403 … NDC-2410 |

- **Settings for every ticket:**
  - State: Bug.
  - Priority: suggested severity (CD-01 and CD-14 High).
  - Assignees: Hegazy + MahmoudMohamed.
  - Label: Desk Integrations; module: Desk; Sprint 13. Module and sprint were read back and confirmed.
  - Comment added on NDC-1669.
- **Images:** attached on 22 Oct through a temporary host (uguu.se, because litterbox answered 502 and 0x0.st refuses uploads). Plane keeps its own copy.
  - NDC-2392 has 17 images, `01…19-*-vs-zoho.png`. Gaps 16 and 17 have no image.
  - NDC-2393 … NDC-2410 have one image each, `CD-NN-vs-zoho.png`.
