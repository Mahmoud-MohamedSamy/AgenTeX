# Spec — CRM ⇄ Desk Integration

| | |
|---|---|
| Apps | TAVI CRM `https://staging-crm.taviportal.com` and TAVI Desk `https://staging-desk.taviportal.com` (tenant NDC-Staging, same accounts on both) |
| Feature | CRM → Settings → **CRM ⇄ Desk Integration** (`/settings/integrations/desk`) and Desk → Settings → **CRM ⇄ Desk Integration** (`/settings/integrations/crm`): Overview, Configuration Details, Permissions, Notifications (CRM only), Sync History, Failure Log. Also what the integration puts on records: the CRM pane on Desk tickets / contacts / accounts, badges and mapped views, Handshake Mode, and the Desk Tickets / Desk Contracts cards on CRM records |
| Focus | Functional · API (the important endpoints) · UI / UX. Security, i18n, accessibility and performance are covered by a short Group O |
| Plane | PRD **NDC-1669** "CRM Integration — Contacts, Accounts and Products Sync" (Backlog). Related: NDC-1981 (Light agents), NDC-1783 (Customers module). Gap item and bugs: **not filed yet** (the user decides when) |
| Missing list | `docs/crm-desk-integration/crm-desk-integration-missing-list.md` and `missing-report.html` (19 items = Z1–Z19) · full Zoho comparison: `zoho-parity-matrix.md` (all 153 Zoho items) |
| Gap evidence | `docs/crm-desk-integration/evidence/01…19-*-vs-zoho.png` (16, 17 have no image: out of NDC-1669 scope) |
| Expected behaviour | NDC-1669 + the user's description of the feature (19 Oct 2026, in the missing list). **User decision: TAVI must match how Zoho handles sync settings, delete preferences, related lists and permissions** — where TAVI differs, Zoho is the expected result |
| Reference | `reference/zoho-docs-inventory.md` (153 Zoho items) · `reference/tavi-api-routes.txt` · `reference/tavi-baseline-config-2026-10-18.json` (row_version 35570115) · live Zoho pair: Zoho Desk `taviportal` + Zoho CRM org943261092, integrated 18 Oct 2026 |
| Written | 18 Oct 2026, from the Desk and CRM bundles, the locale `crm-desk-integration` (same file in both apps), the live API (GET only) and the UI, as the owner |
| Status | **Executed 18–21 Oct 2026** (Run 1 read-only, Run 2 writes, Run 3 connection, parity pass, remaining rows). Results: `executions/execu_2026-10-20_crm-desk-integration/report.md` (verdict per row) and `bug-report.html` (18 bugs, CD-01 … CD-18). Rows still without a verdict need what staging lacks: B12, D13–D15, A11, O2, Firefox (O11); G17 inconclusive |

---

## Feature inventory

### Built (found 18 Oct 2026)
- **Connection** — Connect, Disconnect, Pause sync with an optional reason, Resume. The Overview shows status, connected since, last customer / contract import and the sync queue (Queued / Processing / Failed / Parked). Covered by B1–B14.
- **Contacts and Accounts sync** — Two-way or CRM → Desk per module; field mapping with its own direction per field; validation of duplicates, read-only fields, type and pick-list mismatches. Covered by C1–C18 and G1–G20.
- **Contracts from Closed-Won deals** — draft when support fields are missing, reopen / lost rules, lock CRM-owned fields, default owner and support level, "needs attention" list. Covered by D1–D12.
- **Calls copy** — calls logged by the phone system in CRM are copied to the Desk contact or account. Covered by D13–D15.
- **Delete preferences** for both directions, and **CRM Related Lists**. Covered by E1–E12.
- **Save and concurrency** — one settings object with `row_version`, plus the conflict message. Covered by F1–F8.
- **Sync History** (7 days, by direction and module, "Sync all customers" / "Sync all contracts") and **Failure Log** (Retry, Retry all, Discard). Covered by H1–H14.
- **Desk agent view** — CRM pane with Info / Potentials / Notes / Activities, Open in CRM, Update from CRM, Link / Unlink, "Linked to CRM" / "Not in CRM" badges, Mapped / Unmapped contact views. Covered by I1–I18.
- **Profile permissions for CRM data in Desk** — Full / Custom / No access, per profile, for Accounts and Contacts. Covered by J1–J12.
- **Handshake Mode** — ticket board columns Customers / Potentials / Contacts-Leads / New. Covered by K1–K10.
- **CRM side** — Desk Tickets card with statistics, filters, New ticket (Desk form), Link / Unlink deal, Close, Update field, Delete; Desk Contracts card; ticket workspace inside CRM; Ticket Visibility. Covered by L1–L22.
- **Notifications and mentions** — 7 CRM signals, "Notify the CRM contact owner", mentionable CRM users. Covered by M1–M10.

### Missing (Group Z)
- 19 items: sync settings Z1–Z4, agent view Z5, CRM side Z6–Z7, automation Z8, permissions Z9 (gap analysis, 18 Oct); Z10–Z19 (parity pass, 21 Oct).
- In NDC-1669: Z1 (§3, Phase 4), Z2 and Z3 (§2, Phase 1), Z4 (§5, Phase 2), Z5 (§7, Phase 3, field set not specified), Z9 (§6, Phase 3, default not stated), Z10 and Z18 (§4), Z11 (§2), Z12 and Z13 (§9), Z19 (§8).
- Not in NDC-1669: Z6, Z7, Z8, Z14, Z15; out of scope (separate Zoho products): Z16, Z17.

### Not a gap
- Zoho's per-profile "Full Access" dialog (TAVI has Custom Access).
- Creating CRM leads, deals or tasks from a Desk ticket (Zoho does not do it either).
- Lead sync, custom-module sync, ticket sync into CRM, attachment sync — NDC-1669 non-goals.
- CRM Related Lists for Products, Vendors and Cases: Zoho offers them, but TAVI CRM has no such modules (`GET /modules`, 19 Oct 2026). E10 checks the list follows the CRM's modules.

### Confirmed by the runs (were "not yet confirmed" when the spec was written)
- 12-month lookback (B12): still **not testable** — staging has no CRM records older than 12 months. TAVI does not state the window (Z18).
- First connect (B9–B11): checked twice (20 and 21 Oct). Imports run and finish in seconds; **no notice** to the admin (CD-07, Z10).
- Light Agents and mentions (M5–M9): an @mention of a CRM user reaches the CRM bell; CRM users are **not** added as Light Agents and cannot comment (Z12); no @CRM Contact Owner (Z13).
- Permissions enforced by the API (J7–J9): **enforced** (403 per section and module).
- Changes made while paused (B5, B6): held while paused and **delivered on resume**.

---

## 0 How to run

1. **Order:** §1 preconditions → A → C (read) → E (read) → I (read) → L (read) → K (read) → H (read) → **write window** (C-write, E-write, F, G, H-write, I-write, J, L-write, M, D) → B (connection) last → O → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **Ask before writing:** the staging integration was connected by a teammate on 18 Oct 2026 at 11:27. Every row that saves the settings, connects, disconnects, pauses or resumes changes the integration for **everyone on the tenant**. Agree a window with the user and the teammate first. Until then, run only the read rows.
3. **Serial only:** every row that writes the settings object (`PUT /config`), every connection row (B), every sync row (G, H-write) and every permission row (J). The settings object is one tenant-wide record with one `row_version`.
4. **Parallel allowed:** A reads, C/E/I/K/L read rows, every API GET row, Group Z checks.
5. **Exclusive:** `[perf]` rows run alone.
6. **`[data]` rows** record: field, value (exact bytes for odd input), what the UI showed, what the API stored (GET after save), and what arrived on the other side.
7. **Wait for async work:** sync is queued. Poll `GET /desk/integrations/crm/status` (queue counts) and `GET /runs` until the queue is empty or 3 minutes pass. Never sleep blindly. A row whose change never arrives within 3 minutes is **Fail** only if the queue is empty and nothing is in the Failure Log; otherwise record the queue state and mark it **Inconclusive**.
8. **Sessions:**
   - **Signing in to Desk revokes the CRM session of the same user, and the other way round.** Keep one browser profile per app, or sign in again on a 401.
   - Report token **lengths** only, never values.
9. **Tools on this machine:** Edge (`channel: 'msedge'`). In Git Bash, set `MSYS_NO_PATHCONV=1` before passing `/desk/...` paths. The context endpoints take a **singular** kind (`contact`, `account`); the plural gives 400 "not a link kind".
10. **Verdicts:** Pass, Fail, Blocked or Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.
11. **Evidence:** screenshots only for **failed** rows, annotated side by side against live Zoho where Zoho has the behaviour (TAVI left, Zoho right, numbered boxes, table Behaviour | Zoho | TAVI | Match). Passed rows get a verdict and one line of text.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account | Use |
|---|---|---|
| Tenant owner (admin, both apps) | `ndc-staging-owner` (user `97be04b6-…`), from `docs/Credentials/Microsoft Edge Passwords.csv` | All write rows. **Integrated user** of the integration. Shared with teammates — see §0.2 |
| Second admin | "Mahmoud TAVI" | Two-tab rows (F3–F5), long UI rows |
| Agent (Desk) | "Mahmoud Samy" | I, J, K rows as an agent |
| Lower-profile agent 🔒 | `mahmoud.mahamed1515` | A and J rows (no `desk:integration:*`, Custom CRM access). Confirm its profile first |
| CRM sales user | any CRM user who is not a Desk agent | M rows (mentions, Light Agents), L ticket visibility |
| User of another tenant | any throwaway tenant | A11 only |
| Zoho reference | Row 1 of `docs/Credentials/Zoho Desk Credentials.csv`, Edge, normal user agent, **read only** | Side-by-side evidence for failed rows. **Zoho Desk trial ends about 2 Nov 2026** |

### 1.2 Test data
- Prefix every record the run creates with **`QA CD `**: CRM contact `QA CD G1 Contact`, account `QA CD G3 Account`, deal `QA CD D1 Deal`, ticket subject `QA CD L5 001`. Emails `qa.cd.<row>@example.com`.
- Existing linked pair for read rows: Desk contact `30ff06b1-a2c9-4332-a29a-ff06dd77e794` ↔ CRM contact `ed5116a8-48cc-4470-b4b6-82720f9ca70d` ("Mahmoud MohamedSamy"; tickets #298, #299). Do not edit it; create QA records for write rows.
- Deals for contracts and Handshake: one QA account with a **Closed-Won** deal (with account, start and end dates and support plan), one with an **open** deal, one with **no** deal, one requester not in CRM.
- Phone match: one QA CRM contact with a phone and no email (K4).
- Calls: only if CRM telephony logs calls as Call activities (§1.4).
- Records older than 12 months: needed for B12 only (§1.4).

### 1.3 Baseline (restore point)
Saved 18 Oct 2026 in `reference/tavi-baseline-config-2026-10-18.json`. Refresh it into the run's `baseline/` before group A:
- `GET /desk/integrations/crm/config` — the whole settings object: contacts / accounts direction and mappings, contracts block, the four delete preferences (all `keep`), `panel.profile_access` (empty) and `panel.info_fields`, notifications (all off), `ticket_related_lists` (contacts, accounts, deals), `ticket_visibility: integrated_user`, `calls_enabled: false`, `row_version`.
- `GET /status` (enabled, not paused, connected_at 2026-10-18T08:27:09Z, queue, health — `deal_support_fields_present: false`).
- `GET /links` (count per kind), `GET /runs` (newest id), `GET /contracts/needs-attention` (2 deals), failures list (count).

**Revert:**
- Put the settings back with one `PUT /config` built from the baseline (fresh `row_version`).
- Delete every `QA CD` record in both apps (contacts, accounts, deals, tickets, contracts) and purge them from both Recycle Bins.
- Leave the integration **Connected and not paused**, with the teammate's `connected_at` unchanged unless B rows were approved.
- Prove it with the final diff (see Reporting).

### 1.4 Environment blockers
| Blocker | Rows affected | Action |
|---|---|---|
| **The integration is live and was set up by a teammate.** Writes change sync for everyone | every write row | Ask the user for a window. Until then, run read rows only |
| Disconnect / reconnect needed for first-connect behaviour | B8–B14 | Ask the user before any Disconnect. Reconnecting starts a full import |
| No CRM records older than 12 months | B12 | Ask whether staging has such records (or can get them by import with a back-dated modified time). Otherwise Inconclusive |
| `deal_support_fields_present: false` — CRM deals lack the support fields | D1–D6 | Contracts will be drafts / needs attention. Record it; check with the teammate whether the CRM deal layout should get the fields |
| CRM telephony does not log calls as Call activities | D13–D15 | Inconclusive (the help text says it must be on first) |
| Only one CRM user who is also a Desk agent | M5–M9, L19 | Need a CRM user who is not a Desk agent |
| No lower-profile agent with Custom CRM access | J5–J10 | Configure one (ask first — profile changes are tenant-wide) |
| No tenant to test cross-tenant | A11 | Inconclusive until one exists |

### 1.5 Things that cannot be undone cleanly
- Records created by sync in the other app stay after Disconnect ("Existing links between CRM and Desk records are kept").
- Deleted records go to the Recycle Bins; with "Delete" preferences the delete also crosses to the other app — restore from **both** bins.
- Sync History rows, run records and failure records stay.
- Desk ticket numbers do not go back.
- CRM notifications already sent cannot be recalled.
- A Disconnect + Connect resets `connected_at` and starts a full customer and contract import.

---

## 2 Surface and contract

### 2.1 API (all under `/api/v1/desk/integrations/crm`, header `Authorization: Bearer …`, `x-app-key: desk` or `crm`). Envelope `{success, data, error:{code,message,details}, meta}`
| Method | Path | Body / notes | Priority |
|---|---|---|---|
| GET | `/status` | enabled, paused, app URLs, mapped modules, health | **High** |
| GET / PUT | `/config` | the whole settings object; PUT carries `row_version`; stale → conflict | **High** |
| POST | `/connect` · `/disconnect` · `/pause` (`{reason}`) · `/resume` | toasts "Integration connected." / "disconnected." / "Sync paused." / "Sync resumed." | **High** |
| GET | `/related-list-modules` | CRM modules with `supported` | Medium |
| GET | `/schema/{side}/{module}` | fields offered in mapping | Medium |
| POST | `/imports/{customers\|contracts}` | "Sync all …"; "A full sync is already running." | **High** |
| GET / POST | `/runs` · `/runs/{id}` · `/runs/{id}/items` · `/runs/{id}/cancel` | run kinds `initial_customers`, `initial_contracts`, `manual_refresh`, `status_scan` | **High** |
| GET | `/history?days=&tz=` | Sync History | **High** |
| GET / POST | `/failures` · `/failures/{id}/retry` · `/failures/retry-all` · `/failures/{id}/discard` | Failure Log | **High** |
| GET / POST / DELETE | `/links` · `/links/{id}` · `/links/{id}/refresh` · `/refresh` | manual link / unlink / update from CRM | **High** |
| GET | `/context/{contact\|account}/{deskId}/info\|potentials\|activities\|notes-target\|candidates` · POST `…/refresh` | CRM pane data; must respect profile permissions | **High** |
| GET / POST | `/contracts/needs-attention` · `/contracts/{id}/cancel` · `/contracts/{id}/recreate` · `/contracts/for-record` | contracts from deals | Medium |
| GET | `/tickets/for-record?module_key=&record_id=` · `/stats?module_key=&record_id=` · `/customers/{kind}/{id}/stats` | Desk Tickets card on CRM records | **High** |
| GET / PUT / DELETE | `/tickets/{id}/deal` · GET `/tickets/{id}/contract` | ticket ↔ deal link | Medium |
| POST | `/tickets/prefill` · `/tickets` | New ticket from CRM | **High** |
| POST | `/tickets/classify` | Handshake Mode buckets `won_customer`, `open_prospect`, `crm_contact_or_lead`, `not_in_crm` | **High** |
| GET | `/mentionable-users` | kinds `agent`, `crm_user` | Medium |
| — | `/products`, `/list-views`, `/audit`, `/logs`, `/handshake`, `/light-agents`, `/invite` | **404 on 18 Oct 2026** (Z1, Z2, Z7) | — |

Permissions: `desk:integration:view`, `desk:integration:manage`.

Config enums: direction `two_way` / `crm_to_desk` (field also `desk_to_crm`); `on_crm_delete` / `on_crm_account_delete` `keep` / `unlink` / `delete`; `on_desk_contact_delete` / `on_desk_account_delete` `keep` / `delete`; contracts `on_deal_reopen` / `on_deal_lost` `keep` / `terminate`; `ticket_visibility` `integrated_user` / `user_departments`.

### 2.2 Field register
| Field | Kind | Rules |
|---|---|---|
| Contacts / Accounts direction | radio | CRM → Desk / Two-way. In one-way, field direction can only be CRM → Desk ("Only CRM → Desk is allowed while this pair syncs one way.") |
| Field mapping row | Desk field + CRM field + direction | errors: duplicate, duplicate_crm, incomplete, crm_field_unknown, desk_field_unknown, desk_field_read_only, datatype_incompatible, lookup_not_mappable, pick_list_options_mismatch, duplicate_target, direction_invalid, direction_not_allowed, protected_target (§2.3) |
| Contracts | toggle + mappings + draft / reopen / lost / lock / default owner / default support level / allow any deal link | — |
| Calls | toggle | "Copy phone calls into Desk" |
| Delete preferences | 4 selects | see §2.1 enums; delete options show a Recycle Bin note |
| CRM Related Lists | checkboxes | Contacts, Accounts, Deals, Leads, …; unsupported modules show "No ticket link" |
| Profile access | per profile × Accounts / Contacts: Full / Custom / No access | Custom: Information, Potentials, Notes, Activities (Calls / Meetings / Tasks) |
| Ticket Visibility | radio | integrated user's departments / the user's own departments |
| Notifications (CRM) | 7 toggles + contact-owner list | Desk shows "Notification preferences are managed from the CRM integration settings." |
| Pause reason | text, optional | max length not stated — find it (B4) |

### 2.3 Page states and messages (en, verbatim)
- No view permission: "Integration settings are restricted" / "You need the integration view permission to open this page."
- View only: "You can view these settings but not change them."
- Conflict: "Another administrator saved these settings while you were editing. Reload to get their version — your unsaved changes will be discarded." [Reload]
- Unsaved: "You have unsaved integration changes."
- Connect: "Connect CRM and Desk?" / "Connecting seeds the default field mappings and starts the initial customer import, followed by the contract import."
- Disconnect: "Disconnect the integration?" / "Syncing stops. Existing links between CRM and Desk records are kept and can be resumed by reconnecting."
- Pause: "Pause syncing?" / "Events keep queuing while paused and drain when you resume." Reason placeholder "e.g. CRM data cleanup in progress".
- Queue pills: "All caught up", "Idle", "In progress: {{count}}", "Retrying: {{count}}", "Needs attention: {{count}}".
- Mapping: "Some mappings are invalid — fix the highlighted rows." · "{{mapped}} of {{total}} fields mapped" · "This Desk field no longer exists — clear the mapping to save."
- Sync: "Sync started." · "A full sync is already running." · "Syncing all customers… {{percent}}%".
- Failures: "No logs to display" · "{{n}} records could not sync" · "Discard this failure?" / "The queued change is dropped. The record can be re-synced later from its page."
- Pane: "Not linked to a CRM record" / "Search CRM to link this customer, or wait for the next sync to match it by email." · "Your profile cannot open this tab." · "No deals for this customer." · "No open activities." · "No fields to show."
- CRM card: "No tickets for this record." · "Desk has no way to find tickets for this module yet." · "Not in Desk yet — this record's tickets will show here once the sync brings it over."
- Workspace: "Desk is not available" / "Ask an administrator to connect the CRM ⇄ Desk integration, or to give you access to Desk."

### 2.4 Data classes
Use D1–D20 (empty, whitespace, 1 char, max, max+1, padded, case variants, Arabic, mixed RTL, emoji, HTML/script, SQL-ish, URL chars, zero-width, numeric edge, date edge, type confusion, unknown key, duplicate, limit+1). Extra for this feature: **D21 email edge** (upper-case email, email with `+tag`, same email on two CRM contacts, no email) · **D22 sync race** (same field edited on both sides within 5 s).

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Admin sees the pages | Owner → CRM Settings → Integrations; Desk Settings → Integrations | "CRM ⇄ Desk Integration" in both; CRM subtitle "Keep CRM customers, deals and Desk tickets in sync."; Desk subtitle "Keep Desk customers, contracts and CRM records in sync."; 6 tabs in CRM, 5 in Desk (no Notifications) | `[func]` `[ui]` |
| A2 | No view permission — UI | 🔒 user opens both settings pages from the menu and by URL | Menu hidden; "Integration settings are restricted" page; no config in the network | `[sec]` `[ui]` 🔒 |
| A3 | No permission — API reads | 🔒 GET status, config, runs, history, failures, links | 403 each, no data (status may be readable by agents — record) | `[api]` `[sec]` 🔒 |
| A4 | No permission — API writes | 🔒 PUT config, connect, disconnect, pause, resume, imports, retry-all, discard, links POST / DELETE | 403 each; baseline unchanged (GET diff) | `[api]` `[sec]` 🔒 |
| A5 | View but not manage | User with `desk:integration:view` only | "You can view these settings but not change them."; every control disabled; PUT → 403 | `[sec]` `[ui]` 🔒 |
| A6 | Non-admin setup by URL (NDC-1669 §1 AC) | Agent opens the settings URL directly in both apps | No setup reachable | `[sec]` 🔒 |
| A7 | Same settings in both apps | Change a harmless setting in CRM (in the write window), read it in Desk | Same value, same `row_version` in both | `[func]` `[api]` `[serial]` |
| A8 | Agent without Desk access in CRM | CRM-only user opens the Desk Tickets card / workspace | "Desk is not available" or the card hides; no ticket data | `[sec]` 🔒 |
| A9 | Pane respects the acting agent (§7 AC) | Ticket owned by an admin, opened by a No-access agent | Pane follows the agent's profile, not the owner's | `[sec]` 🔒 |
| A10 | No / expired / revoked token | Same calls without a bearer, with an old one, with one revoked by signing in to the other app | 401; no data | `[api]` `[sec]` |
| A11 | Other tenant | Another tenant's token: GET links, context of a Desk id from this tenant, tickets/for-record | 404 / 403; nothing returned | `[api]` `[sec]` |

## Group B — Connection lifecycle `[serial]` (ask first — §0.2)

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | Overview renders | Open Overview | Intro bullets; Status "Connected" with hint; Connected since, Last customer import, Last contract import match `/status`; queue numbers match `status.queue` | `[func]` `[ui]` |
| B2 | Queue pill states | Read the pill with queue empty / busy / failed / parked | "All caught up" / "In progress: n" / "Retrying: n" / "Needs attention: n" + View failures link (today parked = 2) | `[func]` `[ui]` |
| B3 | Pause with reason | Pause sync, reason "QA CD pause" | Dialog texts (§2.3); toast "Sync paused."; Status "Paused: QA CD pause"; `paused_at` set | `[func]` `[api]` |
| B4 | Pause reason data | Reason D1, D4, D5, D8, D11 | Empty allowed; max length enforced in UI and API; script shown as text | `[data]` |
| B5 | Nothing moves while paused (§10) | While paused, edit a QA CRM contact and a QA Desk contact | Neither change reaches the other side; queue "Queued" grows | `[func]` |
| B6 | Changes made while paused sync on resume (§10 AC) | Resume | "Sync resumed."; both B5 changes arrive; queue drains to "All caught up" | `[func]` |
| B7 | Pause then Disconnect | Pause → Disconnect | Record what happens to queued changes | `[func]` |
| B8 | Disconnect | Disconnect (approval needed) | Dialog texts; "Integration disconnected."; Status "Not connected"; CRM pane, Handshake Mode and Desk Tickets card show their "not available" states; existing links kept (`GET /links` count unchanged) | `[func]` `[api]` |
| B9 | Connect | Connect | Dialog "Connecting seeds the default field mappings…"; "Integration connected."; initial customer import then contract import start | `[func]` |
| B10 | Progress (§4) | Watch Sync History during B9 | Live "Syncing all customers… n%" that changes, not a static state | `[func]` `[ui]` |
| B11 | Completion notice (§4) | Wait for the import to finish | Admin is notified that the initial sync finished (record where — bell / email / none) | `[func]` |
| B12 | 12-month lookback (§4 AC) | With CRM records modified 13 and 11 months ago, run B9 | 13-month record excluded, 11-month included; TAVI says so before the import (Zoho states it on the screen) | `[func]` `[data]` |
| B13 | Leaving does not stop the import (§4 AC) | Close the browser during B10, sign in later | Import finished or still running; run status correct | `[func]` |
| B14 | Reconnect keeps links | After B8 + B9 | No duplicate Desk / CRM records; links reused | `[func]` `[data]` |

## Group C — Contacts and Accounts sync settings

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | Sync table renders | Configuration Details | Rows Contacts ⇄ Contacts, Accounts ⇄ Accounts, Contracts ⇄ Deals (On/Off), Calls (On/Off), each with Edit / Configure; matches config | `[func]` `[ui]` |
| C2 | Edit Contacts | Edit → Direction + Field mappings | Direction radio, "{{mapped}} of {{total}} fields mapped", baseline 8 mappings | `[func]` |
| C3 | Desk fields list | Compare the Desk field column with `GET /schema/desk/contacts` | Every Desk contact field listed, custom fields included (§2) | `[func]` `[api]` |
| C4 | CRM fields list | Compare the CRM picker with `GET /schema/crm/contacts` | Every CRM field, custom included; lookups refused ("Lookup fields sync through the record links, not as values.") | `[func]` `[api]` |
| C5 | Duplicate Desk field | Map the same Desk field twice | "This Desk field is mapped twice."; Save blocked | `[func]` |
| C6 | Two rows write one CRM field | Two Desk fields → one CRM field, both two-way | "Two Desk fields write back into this CRM field." | `[func]` |
| C7 | Type mismatch (§2 AC) | Map a text CRM field to a number Desk field | "The two fields hold different kinds of data."; blocked at configuration | `[func]` `[data]` |
| C8 | Pick-list mismatch | Map pick lists with different options | "Some options have no match in the other pick list." (warning or block — record) | `[func]` |
| C9 | Read-only Desk field | Map into a read-only Desk field | "This Desk field is read-only." | `[func]` |
| C10 | Incomplete row | Leave a CRM field empty | "Pick a CRM field or clear this mapping." | `[func]` |
| C11 | One-way restricts directions | Direction CRM → Desk | Field directions limited to CRM → Desk; existing two-way rows flagged "Only CRM → Desk is allowed while this pair syncs one way." | `[func]` |
| C12 | Protected field | Map onto a field the integration keeps | "This field is kept by the integration itself." | `[func]` |
| C13 | Invalid banner | Several bad rows → Save | "Some mappings are invalid — fix the highlighted rows."; nothing sent | `[func]` `[ui]` |
| C14 | Schema load failure | Block `/schema/desk/*` in DevTools | "The Desk fields could not be loaded, so the list cannot be shown. The saved mappings are unchanged." | `[func]` |
| C15 | Stray mapping | Delete a mapped Desk custom field in Desk, reopen | "This Desk field no longer exists — clear the mapping to save." | `[func]` `[serial]` |
| C16 | Accounts | Repeat C2–C13 on Accounts | Same behaviour; baseline 4 mappings | `[func]` |
| C17 | API validation | PUT config with each error case from §2.2 | 400 with the matching code; nothing stored | `[api]` `[data]` |
| C18 | Unsaved changes | Edit and leave the tab / page | "You have unsaved integration changes." | `[ui]` |

## Group D — Contracts from deals and Calls `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | Won deal → contract | Mark QA deal Closed-Won with all support fields | Desk contract created on the account, mapped fields filled (name, value, owner, description, start) | `[func]` |
| D2 | Missing fields → draft | Won deal without end date / account | Draft contract; listed in needs-attention with "Missing: {{fields}}"; "{{count}} contract(s) need attention…" banner on the CRM card | `[func]` |
| D3 | Draft switched off | `create_draft_when_incomplete: false`, repeat D2 | No draft; needs-attention entry only (record) | `[func]` |
| D4 | Reopen — keep / terminate | Reopen a won deal under each setting | Keep: contract unchanged; Terminate: status Terminated | `[func]` |
| D5 | Lost — keep / terminate | Mark won deal lost under each setting | As D4 | `[func]` |
| D6 | Lock CRM-owned fields | Try editing a mapped contract field in Desk | Locked when on; editable when off | `[func]` |
| D7 | Default owner / support level | Set both, create D1 again | Contract owner and support level from the defaults when the deal has none | `[func]` |
| D8 | Cancel / recreate | `POST /contracts/{id}/cancel`, then `/recreate` | Link cancelled; recreated contract matches the deal | `[api]` |
| D9 | Sync all contracts | Sync History → Sync all contracts | "Sync started."; run `initial_contracts` / manual; no duplicates | `[func]` |
| D10 | Contracts off | Turn contracts off, win a deal | No contract | `[func]` |
| D11 | Allow any deal link | Off: ticket deal picker shows only the customer's deals; On: any deal by search | As described | `[func]` |
| D12 | Existing needs-attention items | Read the 2 baseline deals | Reason shown is human-readable (possible bug, missing-list note) | `[func]` |
| D13 | Calls on | Turn on "Copy phone calls into Desk"; log a call by telephony to a QA contact | Call copied to the Desk contact; to the ticket when exactly one is open | `[func]` |
| D14 | Calls not copied | Call with a lead, unknown number, logged by hand, before switching on | Not copied (help text) | `[func]` |
| D15 | Calls off | Turn off, log a call | Not copied | `[func]` |

## Group E — Delete preferences and CRM Related Lists `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | Preferences render | Configuration → Preferences | 4 selects with baseline values (keep / never delete); subtitle "Nothing is deleted unless you choose so below." | `[func]` `[ui]` |
| E2 | CRM contact deleted — keep and flag | Default; delete QA CRM contact | Desk contact stays, link flagged for review (`needs_attention`), visible on the record | `[func]` |
| E3 | CRM contact deleted — keep and unlink | Set unlink; delete | Desk contact stays, unlinked ("Not in CRM" badge) | `[func]` |
| E4 | CRM contact deleted — delete | Set delete; delete a contact with a ticket | Desk contact and its tickets in the Desk Recycle Bin, restorable (note text) | `[func]` |
| E5 | CRM account deleted — 3 options | Repeat E2–E4 on accounts | As described; contacts and tickets go with the account on delete | `[func]` |
| E6 | Desk contact deleted — never / delete | Both options | Never: CRM contact stays, link removed; Delete: CRM contact in CRM Recycle Bin | `[func]` |
| E7 | Desk account deleted — never / delete | Both options | As E6 | `[func]` |
| E8 | Not retroactive (§5 AC) | Change the preference after a delete was queued | Earlier deletes not re-applied | `[func]` |
| E9 | Restore after cross-delete | Restore from the Recycle Bin | Record back; link state recorded | `[func]` |
| E10 | Related lists render | CRM Related Lists; compare with `GET /related-list-modules` and the CRM's `GET /modules` | Every non-activity CRM module is offered (today Contacts, Accounts, Deals, Leads, Subscriptions); Contacts, Accounts, Deals ticked (baseline); unsupported modules "No ticket link" with the hint. Zoho also offers Products, Vendors, Cases — expected here once CRM has those modules | `[func]` `[ui]` |
| E11 | Untick / tick a module | Untick Deals → open a deal | Desk Tickets card hidden on deals; back when ticked | `[func]` |
| E12 | None selected | Untick all | "No CRM record page will show a Tickets related list." | `[func]` |

## Group F — Save, concurrency, audit `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Save | Change one setting → Save | "Integration settings saved."; GET returns exactly what was entered; `row_version` changes | `[func]` `[api]` |
| F2 | Double submit | Click Save twice fast | One save; no conflict shown to the same user | `[conc]` |
| F3 | Stale edit, two tabs | Admin A and B open settings; B saves; A saves | A gets the conflict message (§2.3) with Reload; no silent overwrite | `[conc]` `[api]` |
| F4 | Stale edit, CRM vs Desk | Same as F3, one tab in each app | Same | `[conc]` |
| F5 | PUT without / with old row_version | API | 409 / conflict code; nothing stored | `[api]` |
| F6 | Partial body | PUT with only `{notifications:{…}}` | Record: 400, or only that part changes; mappings never wiped | `[api]` |
| F7 | Type confusion D17 / D18 | `contacts.direction: 5`, unknown enum, unknown key, mapping array as object | 400 each; nothing stored | `[api]` `[sec]` `[data]` |
| F8 | Audit trail | After F1–F3 | Record whether an audit entry exists (`/audit` is 404; check the tenant Audit Log) | `[func]` |

## Group G — Sync behaviour `[serial]`

Each row: make the change, poll per §0.7, then check the other side (UI and API).

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | CRM contact created → Desk | Create `QA CD G1 Contact` in CRM | Desk contact with mapped fields; "Linked to CRM" + "Synced" badges; Sync History CRM to Desk Contacts +1 Added | `[func]` |
| G2 | Desk contact created → CRM (two-way) | Create in Desk | CRM contact created | `[func]` |
| G3 | Accounts both ways | Repeat G1 / G2 for accounts | Same | `[func]` |
| G4 | Update both ways | Edit a two-way field on each side | Change arrives; Updated +1 | `[func]` |
| G5 | Per-field direction | Edit a CRM → Desk field (owner) in Desk | Not written to CRM | `[func]` |
| G6 | One-way (§2 AC) | Contacts CRM → Desk; create / edit in Desk | Nothing written to CRM | `[func]` |
| G7 | Match on email (§2 AC) | Desk contact and CRM contact with the same email | Linked, not duplicated | `[func]` `[data]` |
| G8 | Email case and `+tag` (D21) | `QA.CD@Example.com` vs `qa.cd@example.com` | Record whether they match | `[data]` |
| G9 | Same email on two CRM contacts | D21 | No silent wrong link; failure entry or a defined rule (record) | `[data]` |
| G10 | Accounts match on name (§2) | Same account name on both sides | Linked, not duplicated | `[func]` |
| G11 | No email (§2 AC) | CRM contact without an email | Still synced | `[func]` |
| G12 | Mass update (§2) | Mass-update 5 QA CRM contacts | All 5 changes arrive | `[func]` |
| G13 | Custom field (§2) | Map a custom field and edit it | Value arrives | `[func]` |
| G14 | Last write wins (non-goal: no merge UI) | D22: edit the same field on both sides within 5 s | Final value = last write on both sides; no ping-pong loop | `[func]` `[conc]` |
| G15 | Account link of a contact | Change a CRM contact's account | Desk contact's account follows through the record links | `[func]` |
| G16 | Data classes | Names / phones with D8–D14 | Same bytes on both sides | `[data]` |
| G17 | Failure path — type | Force a type mismatch (value that fails validation on the other side) | Failure Log entry naming the field (§2 AC) | `[func]` |
| G18 | Failure path — mandatory field | Desk mandatory field missing in CRM data | Failure "mandatory field missing" (§10) | `[func]` |
| G19 | Duplicate link failure | Link a CRM record already paired | Failure "already paired" with readable names (today shows UUIDs — possible bug) | `[func]` |
| G20 | Timing | Note how long G1, G2, G4 take | Record the latency (PRD open question) | `[perf]` |

## Group H — Sync History, runs and Failure Log

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | History renders | Sync History | "Sync History for last 7 days"; per day, per direction (CRM to Desk / Desk to CRM), per module; "{{n}} Added, {{n}} Updated"; matches `GET /history?days=7` | `[func]` `[api]` |
| H2 | Counts match reality (§10 AC) | After G1–G4 | Counts equal what changed, within minutes | `[func]` |
| H3 | Failed count (§10) | After G17 | History shows failed counts too (PRD lists failed; record if missing) | `[func]` |
| H4 | Time zone | `tz` param vs browser time zone | Records land on the right day | `[func]` |
| H5 | Empty | Day with no activity | "No sync activity to display" | `[ui]` |
| H6 | Sync all customers | Click | "Sync started."; progress "Syncing all customers… n%"; no duplicates (help text) | `[func]` `[serial]` |
| H7 | Already running | Click again during H6 | "A full sync is already running."; API 409 | `[func]` `[api]` |
| H8 | Run detail and cancel | `GET /runs/{id}`, `/items`, `POST /cancel` on a manual run | Counts requested / created / updated / skipped / failed / needs_attention; cancel stops it | `[api]` `[serial]` |
| H9 | Failure Log renders | Failure Log | Chronological, grouped by record type; record, time, reason, attempts, "Next retry {{when}}" or "Retries stopped"; "{{n}} records could not sync" | `[func]` `[ui]` |
| H10 | Reasons are readable (§10) | Read each reason | Names the record and the field; no raw ids | `[func]` |
| H11 | Retry fixed record (§10 AC) | Fix the G17 record, Retry | "Retry queued."; succeeds; cleared from the log | `[func]` `[serial]` |
| H12 | Retry all | Retry all | "All failures queued for retry." | `[func]` `[serial]` |
| H13 | Discard | Discard one | Dialog texts; "Failure discarded."; gone from the log | `[func]` `[serial]` |
| H14 | Empty log | No failures | "No logs to display" | `[ui]` |

## Group I — Desk agent view

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Pane on a ticket of a linked contact (§7 AC) | Open ticket #298 | "CRM Contact Info" opens without an extra load action; tabs Info, Potentials, Notes, Activities | `[func]` `[ui]` |
| I2 | Info fields | Info tab | The fields in `panel.info_fields.contacts`, values equal to CRM | `[func]` `[api]` |
| I3 | Potentials | Potentials tab for a contact with deals | Deal, Stage, Amount, Closing date, Tickets; "Link to this ticket" | `[func]` |
| I4 | Notes | Notes tab | CRM notes listed; add note goes to the right CRM record (`notes-target`) | `[func]` |
| I5 | Activities | Activities tab | Open tasks, calls, meetings with Subject, Type, Status, When, Owner | `[func]` |
| I6 | Empty states | Contact with no deals / activities / fields | "No deals for this customer." / "No open activities." / "No fields to show." | `[ui]` |
| I7 | Not in CRM (§7 AC) | Ticket from an unlinked requester | "Not linked to a CRM record" with the search hint; not a broken empty panel | `[func]` `[ui]` |
| I8 | Link manually | Search CRM by name or email → Link | "Customer linked to CRM."; badge; `POST /links` | `[func]` `[serial]` |
| I9 | Unlink | Unlink → confirm | "Unlink this customer?" texts; "Customer unlinked."; sync stops for that record | `[func]` `[serial]` |
| I10 | Search no result | Nonsense search | "No matching CRM records." | `[ui]` |
| I11 | Update from CRM | Change in CRM, click Update from CRM | "Updated from CRM." or "Update queued — the record refreshes shortly."; pane shows the new value | `[func]` |
| I12 | Open in CRM (§7 P1) | Click | Opens the right CRM record in a new tab | `[func]` |
| I13 | Account pane | Ticket of a linked account / account record | "CRM Account Info" with account fields | `[func]` |
| I14 | Pane on contact and account records (§7) | Open the Desk contact and account records | Same CRM pane | `[func]` |
| I15 | Link deal to ticket | Potentials → Link to this ticket / Unlink | "Deal linked to the ticket." / "Deal unlinked from the ticket."; `GET /tickets/{id}/deal` | `[func]` `[serial]` |
| I16 | Badges | Contacts list and record | "Linked to CRM" / "Not in CRM" / "Synced {{at}}" labels (today raw `synced` / `needs_attention` — possible bug) | `[ui]` |
| I17 | Mapped / Unmapped views | Desk contact views | Each view lists only matching contacts; counts match `GET /links` | `[func]` |
| I18 | Pane load failure | Block `/context/*` | "Could not load this section." with Retry | `[ui]` |

## Group J — Profile permissions for CRM data in Desk `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | Page renders | Desk → integration → Permissions | Every Desk profile × Accounts / Contacts with No / Restricted / Full Access (TAVI says "Custom Access" — Z9) | `[func]` `[ui]` |
| J1a | Default access matches Zoho | Right after a Connect (B9), or on the baseline before any change | Only the Administrator profile has CRM access; other profiles start with no access (Zoho). TAVI today: every profile Full Access — Z9 | `[func]` `[sec]` |
| J2 | Custom dialog | Configure → Custom | "Configure Access Permissions": Information, Potentials, Notes, Activities with Calls / Meetings / Tasks; Apply; summary "Can access: …" | `[func]` |
| J3 | Save | Set the QA profile and Save | Stored in `panel.profile_access`; summary text matches | `[func]` `[api]` |
| J4 | No access hides the pane (§6 AC) | QA agent with Contacts No access opens a ticket | No CRM pane anywhere (ticket, contact, account) | `[func]` 🔒 |
| J5 | Potentials off | Custom without Potentials | Potentials tab hidden or "Your profile cannot open this tab." | `[func]` 🔒 |
| J6 | Calls off only (§6 AC) | Activities with Meetings + Tasks | Calls hidden; meetings and tasks shown | `[func]` 🔒 |
| J7 | API enforces Potentials (§6 AC) | QA agent token: GET `/context/contact/{id}/potentials` | 403, no deal data | `[api]` `[sec]` 🔒 |
| J8 | API enforces Info / Notes / Activities | Same for info, notes-target, activities | 403 where off | `[api]` `[sec]` 🔒 |
| J9 | Account vs contact access | Accounts No access, Contacts Full | Account pane hidden, contact pane shown | `[func]` 🔒 |
| J10 | No re-login needed (§6 AC) | Change permission while the agent is signed in, refresh the ticket | New permission applies | `[func]` |
| J11 | Owner keeps access | Tenant owner (holds no profile in the list) | Full access (note text) | `[func]` |
| J12 | Ticket Visibility (CRM) | Switch to "departments which a user is a part of"; CRM user in one department | Desk Tickets card shows only that department's tickets; back to "integrated user" shows all of the integrated user's departments | `[func]` `[sec]` |

## Group K — Handshake Mode

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | Mode available | Desk tickets → work mode picker | Handshake Mode listed while connected | `[func]` |
| K2 | Columns | Open Handshake Mode | Customers / Potentials / Contacts-Leads / New; counts match `POST /tickets/classify` buckets | `[func]` `[api]` |
| K3 | Won deal → Customers (§8 AC) | QA contact with a won deal | Customers | `[func]` |
| K4 | Phone only (§8 AC) | Requester matched by phone, not email | Classified correctly | `[func]` |
| K5 | Won + open → Customers (§8 AC) | Both deals | Customers | `[func]` |
| K6 | Open deal → Potentials | Open deal only | Potentials | `[func]` |
| K7 | Contact or lead, no deal | CRM contact; CRM lead | Contacts-Leads | `[func]` |
| K8 | Not in CRM | Unknown requester | New | `[func]` |
| K9 | Deal state change (§8 AC) | Win the open deal from K6 | Ticket moves to Customers | `[func]` `[serial]` |
| K10 | Paused / disconnected (§8 AC) | During B3 / B8 | Handshake Mode removed from the picker with an explanation; switch back to the user's mode | `[func]` `[serial]` |

## Group L — CRM side: Desk Tickets, Contracts and workspace

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | Card on a contact | CRM contact "Mahmoud MohamedSamy" | "Desk Tickets" with #, Subject, Status, Priority, Department, Owner, Due date, Created; matches `tickets/for-record` | `[func]` `[api]` |
| L2 | Statistics | Show statistics | All tickets, Open, Overdue, Avg. first response, Avg. resolution, Customer happiness; "Last {{months}} months"; values match `customers/contact/{id}/stats` (window 6 months — record vs Zoho) | `[func]` `[api]` |
| L3 | Filters | All / Open / On hold / Closed | Lists match the filter | `[func]` |
| L4 | Card on account and deal | Account and deal records | Tickets of that record | `[func]` |
| L5 | New ticket | New ticket → Desk form | "Preparing the ticket form…"; contact / account prefilled; "Ticket #{{number}} created."; ticket in Desk with the right requester | `[func]` `[serial]` |
| L6 | New ticket validation | Empty subject, bad values | "A subject is required." / "Please fix the field highlighted below." | `[func]` |
| L7 | New ticket for a record not in Desk | CRM contact not yet synced | Synced on the fly or "This customer isn't in Desk yet…" | `[func]` |
| L8 | No ticket permission | CRM user without Desk create permission | "You don't have permission to create Desk tickets." | `[sec]` 🔒 |
| L9 | Link to deal | Select ticket → Link to deal → picker | Picker "Deals of this customer first…"; "Ticket linked to the deal." | `[func]` `[serial]` |
| L10 | Unlink from deal | Select → Unlink | "Ticket unlinked from the deal." | `[func]` `[serial]` |
| L11 | Close | Select 2 → Close | "Close 2 ticket(s)?"; "Ticket closed."; closed in Desk | `[func]` `[serial]` |
| L12 | Update field | Status / Priority / Owner / Due date | "Ticket updated."; value in Desk | `[func]` `[serial]` |
| L13 | Delete | Select → Delete | "Delete 1 ticket(s)?" / "Deleted tickets move to the Desk recycle bin."; in the Desk Recycle Bin | `[func]` `[serial]` |
| L14 | Empty states | Record with no tickets; record not in Desk; unsupported module | "No tickets for this record." / "Not in Desk yet…" / "Desk has no way to find tickets for this module yet." | `[ui]` |
| L15 | Contracts card | CRM account with contracts | "Desk Contracts": Contract, Coverage, Plan, Status, CRM deal, Sync | `[func]` |
| L16 | Workspace | Open a ticket from the card | Ticket workspace inside CRM: reply, comment, forward work and show up in Desk | `[func]` `[serial]` |
| L17 | Workspace unavailable | During B8 | "Desk is not available" texts | `[func]` |
| L18 | Hide statistics | Toggle | Remembered (record) | `[ui]` |
| L19 | Visibility rule applies to the card | J12 settings | Card respects Ticket Visibility | `[sec]` |
| L20 | Deal picker with any-deal off | D11 | Only the customer's deals | `[func]` |
| L21 | Bulk selection | Select many → "{{count}} selected" → Clear selection | Counts right | `[ui]` |
| L22 | Ticket ↔ contract | `GET /tickets/{id}/contract` | Contract of the ticket's account shown | `[api]` |

## Group M — Notifications, mentions, Light Agents `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| M1 | Notifications page (CRM) | Notifications tab | 7 signals all off (baseline); "Notify the CRM contact owner"; Desk shows "Notification preferences are managed from the CRM integration settings." | `[func]` `[ui]` |
| M2 | Ticket created signal | On; create a ticket for a QA contact | CRM bell entry for the contact owner | `[func]` |
| M3 | Other signals | Comment, reply, overdue, escalated, rating | One bell entry each, only when on | `[func]` |
| M4 | Signal off | Off; repeat M2 | No entry | `[func]` |
| M5 | Mentionable users | `GET /mentionable-users`; @ in a Desk comment | Agents and `crm_user` entries; CRM users offered | `[func]` `[api]` |
| M6 | Mention reaches CRM (§9 AC) | @ a CRM user in a ticket comment | CRM bell entry with a link to the ticket | `[func]` |
| M7 | @CRM Contact Owner (§9 AC) | Mention the contact owner | Resolves to that contact's owner | `[func]` |
| M8 | Light Agents (§9 AC) | After connect, check Desk agents | CRM users added as Light Agents without using a paid seat (NDC-1981) | `[func]` |
| M9 | Light Agent limits (§9 AC) | Sign in as a Light Agent | Can comment; cannot reply to the customer or change the owner | `[func]` `[sec]` |
| M10 | Data classes in comments | D11 in a mention comment | Shown as text in the CRM bell | `[sec]` |

## Group O — Security, i18n / RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| O1 | Stored XSS through sync | `<img src=x onerror=alert(1)>` in a CRM contact name, note, deal name, pause reason | Shown as text in the pane, badges, Failure Log, History, CRM card, bell | `[sec]` |
| O2 | Cross-tenant link | `POST /links` with a CRM record id of another tenant | Refused | `[sec]` |
| O3 | Enumeration | GET context / stats for random Desk ids | 404 without detail | `[sec]` 🔒 |
| O4 | Token leakage | Network and DOM of the settings pages | No CRM OAuth token or secret in responses | `[sec]` |
| O5 | Arabic UI | Switch both apps to AR | Labels translated; RTL; arrows (⇄, →) flipped correctly | `[i18n]` `[ui]` |
| O6 | Keyboard | Tabs, mapping table, permission dialog, pane tabs | Reachable; focus visible; Escape closes dialogs; tabs have "Integration settings sections" / "CRM context sections" names | `[a11y]` |
| O7 | Screen-reader names | Mapping selects | "CRM field for {{field}}", "Sync direction for {{field}}", "Configure {{module}} access for {{profile}}" | `[a11y]` |
| O8 | Narrow screens | 1280, 1024, 768 px | Settings, pane and card usable; no cut-off Save | `[ui]` |
| O9 | Bulk sync | 500 QA CRM contacts by import | Queue drains; History counts right; record time | `[perf]` |
| O10 | Pane speed | Open 10 tickets in a row | Pane < 2 s each | `[perf]` |
| O11 | Browsers | Chrome, Edge, Firefox (latest) — settings + pane + card | Same behaviour | `[compat]` |

---

## E2E journeys `[serial]`

| ID | Journey | Steps | Expected |
|---|---|---|---|
| E2E-1 | New customer from sales to support | Create QA account + contact in CRM, win a deal → customer emails support → agent opens the ticket | Contact and account in Desk; contract on the account; ticket in Handshake "Customers"; pane shows the won deal; CRM card on the contact shows the ticket |
| E2E-2 | Support adds a customer | Agent creates a Desk contact with a new email → edits phone → sales edits title in CRM | Contact in CRM; both edits on both sides; History counts match |
| E2E-3 | Sales pulled in | Agent @mentions the CRM owner on the ticket → sales replies from the CRM workspace | Bell entry in CRM; reply sent from Desk's mailbox and logged on the ticket |
| E2E-4 | Restricted agent | Profile Custom (Info + Notes only) → agent works a ticket of a customer with deals | Sees Info and Notes; no deal values in UI or API |
| E2E-5 | Negative recovery | Map a field that fails → record fails → fix the data → Retry | Readable failure; retry succeeds; cleared from the log; History updated |
| E2E-6 | Clean-up | Delete all QA records with "keep" preferences, purge, restore settings from the baseline | Baseline diff clean (§1.3) |

---

## Group Z — Gaps (run to confirm they are still missing or now built)

Each row: look for the capability in the UI and the API. **Still missing** = the item stays open. **Built** = run the expected behaviour, then tell the user so the item can be closed. Evidence images: `evidence/0N-…-vs-zoho.png`.

| ID | Item | How to check | Expected (Zoho / NDC-1669) | Evidence |
|---|---|---|---|---|
| Z1 | Products sync | Configuration Details rows; `GET /products` | Products row with department scope, "Also sync the product's customer associations" (disabled with a reason unless both are two-way), product field mapping, match on product name (§3) | 01 |
| Z2 | CRM list-view scoping | Contacts / Accounts Edit; `GET /list-views` | Pick CRM views for Accounts and Contacts; only records in those views sync (§2) | 02 |
| Z3 | Secondary-email matching | Contacts Edit | Email (Primary) / Secondary Email choice; overwrite warning needing confirmation (§2 AC) | 03 |
| Z4 | Delete only if no associates | Preferences select | Third option; contact with open tickets is kept and unlinked (§5 AC) | 04 |
| Z5 | All CRM fields in the pane | Info tab; any field picker for `panel.info_fields` | Every CRM field incl. custom, or an admin screen to choose them | 05 |
| Z6 | Escalated / Overdue / High Priority filters | CRM Desk Tickets filters | 7 filters | 06 |
| Z7 | Mutual Users + Invite to Desk | CRM integration Permissions; `GET /invite` | Mutual users list; invite as Agent / Light Agent / Admin | 07 |
| Z8 | CRM Contact Type in SLA / assignment rules | SLA, Direct Assignment, Round Robin criteria pickers | "CRM Contact Type" is / is not Customer, Potential, Contact, Lead | 08 |
| Z9 | Permission defaults and level names | Desk Permissions tab after connecting; `panel.profile_access` | Only the Administrator profile has access by default; others no access until ticked; levels named No / Restricted / Full Access | 09 |
| Z10 | Report when the initial sync finishes | Connect; watch the admin's email / bell | Email or notice with added / updated / ignored counts and skip reasons | 10 |
| Z11 | CRM Leads considered when a Desk contact is created | CRM Lead with email E; create a Desk contact with E | No new CRM contact for a person who is a CRM Lead (Zoho community) | 11 |
| Z12 | CRM users as Light Agents; CRM-only users comment | `/iam/me` of a CRM-only user; comment on a ticket as that user | Added to Desk as Light Agents; comment allowed | 12 |
| Z13 | @CRM Contact Owner mention | Mentionable users; comment with the mention | Mention offered; the contact's owner is notified | 13 |
| Z14 | Act from the CRM notification | Desk event in the CRM bell | Reply / comment / update from the notification | 14 |
| Z15 | Integrated user becomes inactive | (not testable without deactivating the owner) | Prompt to re-point the integration | 15 |
| Z16 | CRM Voice of the Customer from Desk tickets | — (Zia, Enterprise) | Out of NDC-1669 scope | — |
| Z17 | Cross-app analytics joining CRM and Desk | — (Zoho Analytics) | Out of NDC-1669 scope | — |
| Z18 | 12-month window stated before the first sync | Connect dialog / configuration | "Only records created or modified in the last year are synced" shown | 18 |
| Z19 | Empty Handshake columns hidden | Handshake Mode with an empty bucket | Empty columns are not shown | 19 |

---

## Traceability

| Source | Requirement | Scenarios |
|---|---|---|
| NDC-1669 §1 | Admin-only setup, non-admin by URL blocked | A1–A6 |
| NDC-1669 §1 | Path A / Path B authorisation, awaiting approval state, paid-plan gate | **Not testable**: TAVI connects its own CRM with one Connect button (first-party). Recorded as built differently, not a gap |
| NDC-1669 §1 P1 | Org name and health on the page | B1 (health from `/status`) |
| NDC-1669 §1 AC | Expired / revoked authorisation shows a specific error | A10, B1 (health) |
| NDC-1669 §2 | Two-way / one-way, field mapping incl. custom, matching, no email, create/update/delete/mass update, editable after setup | C1–C18, G1–G16, E2–E7 |
| NDC-1669 §2 | List-view scoping, secondary email | Z2, Z3 |
| NDC-1669 §2 P1 | Preview record count before first sync | B9 (record whether shown) |
| NDC-1669 §2 AC | Type mismatch blocked or named in the log | C7, G17 |
| NDC-1669 §3 | Products sync | Z1 |
| NDC-1669 §4 | Bulk first sync, progress, 12-month lookback, completion notice, survives logout | B9–B13 |
| NDC-1669 §5 | Delete preferences, recycle bin, unlink visible, not retroactive | E1–E9; third option Z4 |
| NDC-1669 §6 | Per-profile visibility, Accounts / Contacts, Full / Restricted, activity types, API enforcement, no re-login | J1–J11, J1a, A9; defaults and names Z9 |
| NDC-1669 §7 | Pane on ticket / contact / account, not-in-CRM state, acting agent's permissions, deep link | I1–I18, A9; field set Z5 |
| NDC-1669 §8 | Handshake Mode classes, phone match, precedence, hidden when paused, live reclassification | K1–K10 |
| NDC-1669 §9 | Light Agents, mentions, CRM Contact Owner, Light Agent limits | M5–M9 |
| NDC-1669 §10 | History 7 days with failed counts, Failure Log reasons + Try Again, Pause / Resume, delete integration consequences | H1–H14, B3–B8 |
| NDC-1669 §10 P1 | Retry all; longer / filterable history | H12; history filters not built (note) |
| Build extras | Contracts from deals, Calls, Ticket Visibility, CRM notifications, CRM Desk Tickets card and workspace | D1–D15, J12, M1–M4, L1–L22 |
| Missing list | 19 gaps | Z1–Z19 |
| User description, 19 Oct 2026 | sync settings, sync type, products, preferences, related lists, permissions — match Zoho | C, E, G, J, Z1–Z4, Z9 |
| Possible bugs (missing-list notes) | raw sync-status labels, UUIDs in failure reasons, deals stuck in needs attention | I16, G19 / H10, D12 |

Every NDC-1669 requirement has a scenario or is marked not testable with the reason.

---

## Reporting

- **Report:** `executions/<date>_crm-desk-integration/report.md` with:
  - one line per row: ID, verdict, one-sentence result;
  - the Allure / extent report from the automation run;
  - a list of new bugs (house style, one Plane item per bug, **only after the user agrees**).
- **Evidence:**
  - Screenshots for **failed rows only**, annotated side by side against live Zoho, in `screenshots/annotated/<id>-vs-zoho.png`. Where Zoho has no such behaviour (contracts, calls, keep-and-flag), use a TAVI-only image and say "Not comparable".
  - Redact tokens and cookies; report token **lengths** only.
  - Never paste teammates' customer data.
- **API evidence:** method, path, status code, error code and the shape of the body. Leave out ids of other people's records.
- **Coverage gaps:** restate the §1.4 blockers that left rows Inconclusive, and the "Not yet confirmed" list with what the run learned.
- **Revert proof:** a final GET of `/config`, `/status` (enabled, paused, `connected_at`), `/links` counts and the QA record searches in both apps, diffed against the §1.3 baseline. Any difference is listed and explained.
- **Group Z:** a short table "still missing / now built" per item, so the gap ticket can be updated in one go.
