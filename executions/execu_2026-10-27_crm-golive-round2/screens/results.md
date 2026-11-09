# Round 2 · Phase 3 · Screen-checks lane — results

28 Oct 2026 · staging-crm.taviportal.com, build index-De3hTVb3.js · reference Zoho CRM org943261092 (read-only, Edge).
Scope: G05 Arabic/RTL · G06 shortcuts · G09 performance · S07 flights/bookings · R16 attachments · R23 mass delete · S01 work queue.

**Sign-ins (one per account):** CRM Admin B (mahmoud.mahamed1515) for all API work, test user 2 (valafo4080) for the browser screens,
Zoho org943261092 row 1 (read-only). Owner and CRM Admin A untouched. No HTTP 429 all run. Each account signed in once
(long-lived `drv.js` daemon per account, token in memory only; Java suite: one JVM, `-Dauth.memoryOnly=true`).

Plane states at start: `baseline/plane-states.md`. Snapshot: `baseline/snapshot.json`.

## Automation (suite crm-screens-r2, 28 classes; feature `crmscreens`)
Run 1 all four classes in one JVM; UI defects fixed and ScreensApiTest#workQueueCalls + ScreensUiTest re-run (run 2/3). Final:
- **ScreensApiTest** 4/4 pass (workQueueCalls after the %2C-encoding fix; FL-01 SKIP = no flights route; apiTimings intentionally FAILS = perf gate, see below).
- **AttachmentsApiTest** AT-01/02/03/07/08 pass; **AT-04, AT-05, AT-06 fail = real bugs** (R2SC-B1, R2SC-B2); AT-02 fails as the MS-010 gate (txt/log/json/zip/eml refused).
- **MassDeleteApiTest** MD-11..15 all pass.
- **ScreensUiTest** SC-01/02/03, AR-01, AT-UI pass; SC-04 fact-only; **AR-02, AR-03, PF-UI, WQ-UI fail as gates** (real findings R2SC-B3, NDC-2136, NDC-1819).

The "failures" that are gates (apiTimings, PF-UI, AR-02/03, WQ-UI, AT-02) are assertions written to fail while the product gap/perf is open; they are findings, not test defects. Logs: `after/auto-run1.log` (full suite), `after/auto-run2.log`, `after/auto-run3.log`.

## G05 — Arabic and RTL (test user 2, per-user language)
| Case | Result | Ticket | Note |
|---|---|---|---|
| Switch language per user | Pass | — | Header EN/AR and Settings › Personal › Locale both switch; restored to English after. Page goes RTL, sidebar moves to the right, all main screens mirror (home, list, record, create, setup, reports, dashboards, work queue, calendar, locale). |
| List count / sort / layout name translated | Pass | NDC-2130, NDC-2131 | "٥٣ سجلاً", "ترتيب: تاريخ الإنشاء تنازلي", layout picker aria-label "التخطيط". |
| No untranslated text | **Fail** | R2SC-B3 (overlaps NDC-2704) | English left in the Arabic UI: "Meetings" (Work Queue count), "From"/"To" (Home meetings columns), "Loading"/"Not Found" toasts, country names on the Locale page, "Pipelines" in the Setup menu. One Home load showed raw keys subject/due_date/from_time (= NDC-2704, Bug). Field/column labels (Full Name, Deal Owner, Amount…) are user data, not translated — same as Zoho. |
| Number / date formats | Fail (minor) | R2SC-B3 | Dates and counts use Arabic-Indic digits, but row numbers, page-size pickers (10/20/50) and calendar day numbers stay Latin — mixed on the same screen (calendar month: 35 Latin vs 36 Arabic-Indic). |
| Language actually saved | **Fail** | R2SC-B4 | The header EN/AR switch only sets localStorage; no server write; the account value and the Locale page stay "English" while the UI is Arabic. The Locale page's Save does persist it per user. |
| Clipped / broken layout | Pass | — | No clipped labels seen on the mirrored screens. |

## G06 — Keyboard shortcuts (vs Zoho)
| Shortcut | TAVI | Zoho (live 28 Oct) | Result |
|---|---|---|---|
| `?` help | Shows the full list (Ctrl K, Ctrl \\, ?); Esc closes; ignored while typing in a field | No shortcut help opens | Pass |
| `Ctrl+K` command menu | Go to / Create / Modules / Records / Notes / Attachments search, ↑↓ ↵ esc; toggles closed; Enter on "Reports" navigates; "New Tasks" opens the task form | `Ctrl+K` does nothing | Pass |
| `Ctrl+\` sidebar | Collapses (256→56 px) and expands | — | Pass |
| `/` focus search | Focuses `<main>`, not the search box | `/` on a Zoho list also does nothing; on some pages focuses nothing | Info — TAVI has the richer, documented set; Zoho exposes no global shortcut list here. |

TAVI's shortcut surface is ahead of this Zoho org (which shows no global shortcut help). No gap filed.

## G09 — Performance (page load to first content, API calls; 3 runs, median / worst)
Targets: 2 s per screen, 1 s per API call, Leads list 1.5 s (NDC-2136). See the table below. Zoho (same org, read-only) measured for context — this Enterprise trial is itself slow (5–10 s on heavy screens), so TAVI beats it on Home/Setup/Dashboards/Record but is **worse on the Leads list and Create form**.

Root cause of the slow screens: the Leads module carries **564 fields and 13 layouts** on staging, so `GET /modules/{leads}/fields` is 3–55 s and `/layouts` 5–40 s; every Leads screen waits on them. Other modules (deals 87 fields) load in 1–2 s.

**Candidate bugs (re-verified from scratch):** R2SC-B1, R2SC-B2 (attachments). **Still-failing tickets:** NDC-2136 (Leads list), NDC-2137 (kanban). NDC-1819 partly fixed. NDC-2704 reproduced (Home raw keys, already Bug).

## S07 — Flights / bookings
Not reachable. `/v2/flights/search` and `/v2/bookings` (and `/flights`, `/bookings`) redirect to Home; the API answers 404 under `/api/v1` and "No gateway route is configured" under `/api/v2`. They exist only as **demo custom-action data** ("SkyRoutes Travel" Search flights / Book offer) in the register-mocks bundle, not as live CRM features. Nothing testable. (Inventory row S07 = "TAVI only", confirmed still not built.)

## R16 — Attachments (API + record page UI)
| Case | Result | Note |
|---|---|---|
| Upload → attach → list → download (PDF) | Pass | Byte-for-byte download; presigned link on the same host. |
| Types accepted | Pass | images, audio, video, PDF, Word, Excel, CSV, PowerPoint, SVG → 201. |
| Types refused | **Gap** NDC-2628 / MS-010 | txt, log, json, zip, eml, msg, html, no-extension → 400 ATTACHMENT_TYPE_REJECTED; .exe refused at `POST /files`. Zoho attaches any file type. The screen's own `<input>` lets .txt/.log through, uploads the bytes, then shows the server refusal — wasted round-trip. |
| Size limit | Pass | 16 MB (16777216) accepted, 16 MB+1 / 20 MB → 422 naming the limit, 0 / negative → 400. (Zoho limit 20 MB per file by docs; not checked live.) |
| Download / delete on record + notes | Pass | Delete 204, gone from the list, 2nd delete 404, file kept and still downloadable (unlink, not purge); timeline logs AttachmentAdded / AttachmentRemoved / NoteAdded; note with attachments 201, empty note 400. |
| On notes | Pass | Note attachments honour the same type filter. |
| **Attach a file that was never uploaded / does not exist** | **Fail R2SC-B2** | `POST …/attachments` with a pending (never-PUT) file id or an unknown id → 201 and a row is listed (download of the pending file 409). Size is taken from the request body: 999,999,999 stored for a 64 B PDF, shown as "954 MB". Same on notes. |
| **SVG runs script on the app origin** | **Fail R2SC-B1 (security)** | An attached SVG's download link is served `image/svg+xml`, same host, **no Content-Disposition, no CSP**; opening it runs the embedded script on staging-crm.taviportal.com with the `aw_staging_access_token` cookie readable → session-theft vector. In-app preview uses `<img>` (safe); the risk is the direct/download link. Re-verified from scratch with a visible marker (`svg-recheck-opened.png`). |

## R23 — Mass delete (QA records only)
| Case | Result | Ticket | Note |
|---|---|---|---|
| Delete Selected (list) | Pass | NDC-1216 | `DELETE …/records/bulk?ids=` 204, only the chosen rows, to the recycle bin. |
| Mass Delete by selection | Pass | NDC-1216 | Mass Delete page: tick rows → confirm (counts activities too) → `{record_ids}` 200 matched/deleted. Header-checkbox select-all + untick-one (exclusion) works. |
| Mass Delete by criteria | Pass | NDC-1216 | Criteria builder (field / operator / value, Search preview before delete) → `{criteria:[…]}` 200. Zoho parity (Zoho's own mass-delete opens from the list Actions menu, not a URL). |
| Guards | Pass | — | >500 ids → 422 TOO_MANY_RECORDS; criteria over 500 runs as a background job (cap 50,000, NDC-1224 still open — not exercised, needs 500+ leads on shared staging); empty body 400; unknown id reported as failed. |

## S01 — Work queue
| Case | Result | Ticket | Note |
|---|---|---|---|
| Date filter in My Open Activities | Pass | NDC-1819 | All of Zoho's: Today & Overdue, Due today, Tomorrow, Overdue, Next 7 days, This week, Next week, This month, Next month, On a specific date. |
| Table settings | Pass | NDC-1819 | Manage Columns (with search + clear ×), Reset Column Size, Records per page, Wrap/Clip Text. |
| Alphabet filter | Pass | NDC-1819 | A–Z + All on the Leads queue's name column. |
| Row actions on the left | Pass | NDC-1819 | Row-actions "…" (Edit, Send email, Create task, Log call, Schedule meeting, Convert, Change owner, Delete) + Add Note on the left of each row. |
| Category view / + per module | Pass | NDC-1819 | Arrange queues "Grouped by module / As one list" applies only after Save (Cancel discards); "+ Create a queue on Leads" per module. |
| Create Queue — lookup value | Pass | NDC-1837 | Account (lookup) shows a record picker, Owner shows a user checklist — not a plain text box. |
| Column header menu | **Fail** | NDC-1819 | Only Sort ascending / Sort descending. Zoho's menu also has **Pin Column** and **Hide Column**. (Hide exists in Manage Columns; pin is missing everywhere.) |
| Filter panel | **Fail (partly)** | NDC-1819 | One inline criteria row (field + operator). Zoho has a side panel with search and three categories (System Defined Filters, Filter By Fields, Filter By Related Modules). TAVI's field list is grouped "Filter By Fields" + "System Fields" only; no System-Defined filters, no Related Modules. |
| Filter persists | Pass | NDC-1788, NDC-1789 | All layout fields offered; the applied filter survives a reload (stored server side). |
| Work queue API | Pass | — | `/workqueue/summary` (sections as a query param), `/workqueue/queues`, `/workqueue/team` all 200. |

## Performance table (ms; median / worst of 3)
| Screen / call | TAVI median | TAVI worst | Zoho median | Target | Verdict |
|---|---|---|---|---|---|
| Home | 1077 | 2581 | 7386 | 2000 | Pass (faster than Zoho) |
| Leads list | 28684 | 31507 | 7217 | 1500 | **Fail (NDC-2136, worse than Zoho)** |
| Transactions list | 6280 | 10052 | 8269 | 2000 | Fail (≈ Zoho) |
| Record page (lead) | 2981 | 18312 | — | 2000 | Fail (first load cold; warm ≈ 2.5–3 s) |
| Create form (lead) | 21802 | 26016 | 10075 | 2000 | **Fail (worse than Zoho)** |
| Setup | 2680 | 3014 | 3669 | 2000 | Fail (faster than Zoho) |
| Reports | 838 | 1237 | 5617 | 2000 | Pass |
| Dashboards | 1903 | 36231 | — | 2000 | Pass median (cold worst 36 s) |
| Work Queue | 6357 | 10402 | 8818 | 2000 | Fail (≈ Zoho) |
| Calendar | 2819 | 4213 | — | 2000 | Fail (borderline) |
| Kanban first cards (Transactions) | 14273 | 16230 | — | 2000 | **Fail (NDC-2137)** |
| API GET /iam/me | 197 | 503 | — | 1000 | Pass |
| API GET /modules | 789 | 1123 | — | 1000 | Pass (median) |
| API GET leads fields | 4090 | 5898 | — | 1000 | **Fail (564 fields)** |
| API GET leads layouts | 5941 | 40620 | — | 1000 | **Fail (13 layouts)** |
| API GET leads records p1 | 1674 | 19711 | — | 1000 | Fail |
| API GET deals records p1 | 1215 | 2521 | — | 1000 | Fail (borderline) |
| API GET settings hub | 2241 | 4800 | — | 1000 | Fail |
| API GET lead record | 887 | 2254 | — | 1000 | Pass (median) |
| API GET lead timeline | 579 | 2336 | — | 1000 | Pass (median) |
| API GET reporting/reports | 301 | 609 | — | 1000 | Pass |
| API GET reporting/dashboards | 205 | 401 | — | 1000 | Pass |
| API GET workqueue summary | 709 | 2140 | — | 1000 | Pass (median) |
| API GET search | 211 | 1841 | — | 1000 | Pass (median) |

## Candidate bugs (not in Plane; re-verified from scratch)
| ID | Sev. | What happens | Evidence |
|---|---|---|---|
| R2SC-B1 | **High (security)** | An attached SVG runs its embedded script when its download link is opened: same origin (staging-crm.taviportal.com), `image/svg+xml`, no Content-Disposition, no CSP; the `aw_staging_access_token` cookie is readable → account-takeover vector. Any user who opens or is sent the link is affected. | evidence/annotated/R2SC-B1-svg-attachment-vs-zoho.png; card-b1-svg.png; raw svg-recheck-opened.png |
| R2SC-B2 | Medium | `POST …/attachments` (and notes) accepts a file id that was never uploaded (status "pending") or does not exist at all → 201, row listed; the attachment's size is whatever the caller claims (999,999,999 B shown as "954 MB" for a 64 B file). No check that the file exists, is confirmed or belongs to the tenant. | evidence/annotated/R2SC-B2-attachment-without-file-vs-zoho.png; card-b2-ghost.png |
| R2SC-B3 | Low | Arabic UI leftovers: "Meetings" / "From" / "To" / toasts / country names / "Pipelines" not translated, and Latin vs Arabic-Indic digits mixed on one screen. (Home raw keys part = NDC-2704, already Bug.) | evidence/annotated/R2SC-B3-arabic-leftovers-vs-zoho.png |
| R2SC-B4 | Low | The header EN/AR language switch is browser-only (localStorage); the account's language setting and the Locale page stay "English" while the whole UI is Arabic. The Locale page's own Save persists it; the header switch does not. | evidence/annotated/R2SC-B4-language-not-saved-vs-zoho.png |

Repro (R2SC-B1): attach any `.svg` with a `<script>` to a record → `POST /files/{id}/download` → open the `download_url` → the script runs on the app origin.
Repro (R2SC-B2): `POST /files {purpose:attachment,…}` (do not PUT the bytes) → `POST /modules/{m}/records/{r}/attachments {file_id:<that id>, size:999999999}` → 201.

## Still-passing / still-failing tickets (current Plane state)
| Ticket | Feature | State | This run |
|---|---|---|---|
| NDC-2130, NDC-2131 | G05 Arabic list | Done | **Still pass** |
| NDC-1216 | R23 mass delete | Done | **Still pass** (selected, criteria, guards) |
| NDC-1795, NDC-1837, NDC-1788, NDC-1789 | R23 / S01 | Done | **Still pass** (filter fields, persistence, lookup picker) |
| NDC-2136 | G09 Leads list | Bug | **Still fails, worse** (median 28.7 s, target 1.5 s; round 1 13–25 s) |
| NDC-2137 | G09 kanban | Bug | **Still fails** (first cards median 14 s, target 2 s) |
| NDC-1819 | S01 work queue | Bug | **Partly fixed**: date filter, table settings, alphabet, row actions, category view, lookup picker all now pass; **still missing Pin/Hide in the column menu and the full filter panel (categories / related modules)** |
| NDC-1224 | R23 background job | Bug | Not exercised (needs 500+ leads; criteria mode confirmed to switch to a job path) |
| NDC-2628 | R16 file types (MS-010) | Backlog | **Gap still open**: non-Office/media types refused; Zoho accepts any type |
| NDC-2704 | Home raw column keys | Bug | **Reproduced** (one Home load showed subject/due_date/from_time) |

## Gaps vs Zoho
1. Attachments reject txt/log/json/zip/eml/html/no-extension (Zoho attaches any type) — NDC-2628 / MS-010.
2. Work queue column menu has no Pin/Hide; no Zoho-style filter panel with System-Defined filters and Related-module filters — NDC-1819.
3. Attach sources: TAVI = upload only; Zoho = Upload / WorkDrive / Other Cloud Drives / Link (URL).
4. Flights / bookings: Zoho N/A (TAVI-only feature, still not built — demo mock data only).
5. Language change from the header isn't saved to the account (R2SC-B4); Zoho's language is an account setting.

## Clean-up and diff (`screens/after/diff.json`, `clean.json`, `clean2.json`)
All QA R2SC data removed: the 3 attachment leads, the MD leads, the kanban view "QA R2SC KB", 12 + 1 bin items purged.
After: 0 QA R2SC records in leads/contacts/deals/accounts/tasks/cases, 0 QA R2SC bin items, 0 QA R2SC kanban views.
Created-data ledger: `after/created.txt`. No tenant-wide change made by this lane; test user 2's language restored to English.

**Changed outside our lane (staging, during this run):** company time zone was **Africa/Cairo at the baseline snapshot (07:17) and UTC at the final diff** — changed by someone other than this lane (the serial-window lane touches tenant settings). Business hours unchanged (24×7, 09:00–17:00). Test user 2's manager/profile were already set before the run.

## Changed automation files (copy automation-r2sc/, for a later merge into automation/)
- NEW `src/main/java/qa/features/crmscreens/CrmScreensFeature.java` (lane helpers: Admin-B API user, upload/attach/download, timings, lead create/cleanup).
- NEW `src/test/java/qa/features/crmscreens/AttachmentsApiTest.java` (AT-01..08; AT-04/05/06 encode R2SC-B1/B2, AT-02 the MS-010 gap).
- NEW `src/test/java/qa/features/crmscreens/MassDeleteApiTest.java` (MD-11..15).
- NEW `src/test/java/qa/features/crmscreens/ScreensApiTest.java` (WQ-11, FL-01, G9-API, G5-API).
- NEW `src/test/java/qa/features/crmscreens/ScreensUiTest.java` (SC-01..04, AR-01..03, PF-UI, WQ-UI, AT-UI).
- NEW `src/test/resources/suites/crm-screens-r2.xml`, `src/test/resources/features/crmscreens/feature-map.md`, `.../locators.json`.
- CHANGED `src/main/java/qa/core/auth/AuthManager.java` — added `-Dauth.memoryOnly=true` (session kept in the JVM, never written to `.auth/`; no token on disk) **(review this change on merge: it touches the shared AuthManager)**.
- CHANGED `src/test/java/qa/features/crmrecords/MassActionTest.java` — mass-delete body `mode/recordIds` → `record_ids` (new build's shape).
