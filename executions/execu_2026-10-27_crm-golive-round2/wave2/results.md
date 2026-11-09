# Round 2 · Wave 2 (daily record work) — results

27 Oct 2026 · staging-crm.taviportal.com, build index-De3hTVb3.js. Restart after the 429 at ~14:31: ONE owner sign-in for the
whole run (one JVM, suite `crm-wave2-r2`, started 15:17, before Lane A's 15:35), no 429. Deal / pipeline rerun and all screen
checks ran as CRM Admin A (no owner sign-in). Logs: `after/r2-run1.log` (+summary), `after/r2-run2-deals.log`, `after/ui*.json`.
Plane states at start: `baseline/plane-states.txt` — In Progress (skipped, observed only): NDC-2621…2627, 1797, 1324, 1316, 1312.

## Automation
Suite crm-wave2-r2 (67): 54 pass, 10 fail, 3 skipped. After switching deals to the pipeline id (test fix) and rerunning the
deal / pipeline classes as CRM Admin A (20 tests): all pass. Final: 5 app failures (NDC-1193, NDC-2122, R26 lock, R13 clone gap,
R33 number-range gap); skipped: RB-05 (permanent delete, opt-in), AC-01 UI (+Call control didn't open as CRM Admin A),
CV-04 UI (list still loading; checked by hand instead).

## Ticket verdicts (not In Progress / RFD)
| Ticket | State | Verdict | Facts |
|---|---|---|---|
| NDC-1484 | Done | Pass | 15/15 modules create / read / edit (owner kept) / delete / bin / restore |
| NDC-1832 | Done | Pass | owner unchanged after edit in all 15 modules |
| NDC-1193 | Bug | **Still fails** | blank record → 422 in 14 modules, **201 in Customers** |
| NDC-2122 | Bug | **Still fails** | pattern "1 AND 2" → 201 |
| NDC-2098 | Bug | **Passes now** | deleted view id in the URL → page falls back to "All Leads" (by hand; automated test inconclusive: list too slow) |
| NDC-2280 | Bug | **Still fails** | 118-char name: cell content 831 px in a 438 px cell, drawn over "Only me" and Created |
| NDC-2136 | Bug | **Still fails (worse)** | Leads list first rows 22.5 s / 34.7 s / >40 s (target 1.5 s; round 1 13–25 s) |
| NDC-2137 | Bug | **Still fails (close)** | kanban first cards 2.7 s (target 2 s; round 1 3.0–4.5 s) |
| NDC-1819 | Bug | Not judged | Work Queue page stayed on "Loading your work queue…" during the check |
| NDC-2382 | Done | Pass | deal with pipeline id → 201; field no longer limited to "Standard (Standard)" (the literal is now refused) |
| NDC-2388 | Done | Pass | conversion targets accounts (gate company), contacts, deals, subscriptions; no module switched on by itself |
| NDC-2386 | Done | Pass | Settings › Pipelines loads (no "Loading board…" after 30 s) |
| NDC-1302 | Done | Pass | stage change keeps the pipeline |
| NDC-1823 | Done | **Fails again** | with "Create a new Transactions" ticked the deal form loads after ~25 s; Probability, Expected Revenue, Lead Conversion Time, Sales Cycle and Overall Sales Duration are editable |
| NDC-1603 | Done | Pass | restore with taken unique name refused (name_conflict) |
| NDC-1597 / 1600 / 1601 | Done | Pass | bin facets: 44 modules incl. system ones, 5 users in Deleted by, options kept after choosing Leads |
| NDC-1593 / 1599 | Done | Pass | import into read-only / hidden fields: 0 created, 1 error |
| NDC-2302 | Done | Pass | import with trigger off: rule ran 0 of 2 (control got it) |
| NDC-1197 | Done | Pass (menu) | actions menu now: Delete Selected, Mass Delete, Mass Update, Mass Convert, Manage Tags, Drafts, Mass Email, Approve Leads, Deduplicate Leads, Add to Campaigns, Create Client Script, Import / Import History / Export, Sheet View, Print View (each entry not clicked this round) |
| NDC-2282 | Done | Pass | kanban toolbar: Layout + Pipeline picker, Categorize by, Aggregate by |
| NDC-1554, 2385, 1795, 1216, 1602 | Done | Not re-run | import review filter, bin refill, mass delete by criteria and Empty Bin not repeated (the last two are not allowed by the brief) |
| NDC-2628 (gap list) | Backlog | — | see gaps below |

Observed on In Progress tickets (not judged): pipeline move by edit and Mass Update now work (NDC-2621, 1312, 1316, 1324);
timeline logs RecordDeleted (NDC-2624); 11th tag refused 422 (NDC-2625); recurring "Weekly ×3" creates 3 tasks (NDC-2623);
test user 1 can search 200 (NDC-2622); "Lead created" wording (NDC-2627); Transactions list shows pipeline name "Standard" (NDC-2626).
NDC-1797: the bin now has 53 items of modules that no longer exist (incl. Lane C's QA W5 modules and "blueprint").

## Features (29)
R01–R05, R12 pass (15-module lifecycle) · R07 Cases pass (all field types incl. multi-select / Arabic; edit, mass update) — no related lists configured ·
R08 Sales / Purchase Orders pass (dates, currency, pick lists, number, mass update, delete / restore) · R13 clone **gap** (no endpoint, no action) ·
R14 record page pass · R15 notes pass · R16 attachments not re-run · R17 timeline pass (deleted entry now logged) · R18 tags pass (limit 10 enforced) ·
R19 conversion **fails NDC-1823** · R21 merge: API pass (duplicates 1–4 merged, duplicate removed, master keeps values) but **no screen and no timeline entry** (gap) ·
R22 mass update pass (5 field types + owner, Cases, PO) · R23 mass delete (selected) — not re-run this round · R24 mass transfer pass (API) ·
R26 record locking **candidate bug R2W2-C1** · R28 list view **slow (NDC-2136)** · R29 custom views pass except NDC-2122 / 2280 · R30 kanban pass (speed 2.7 s) ·
R31 split view pass (create with owner splits, renders a section per split; per-split counts not confirmed) · R33 advanced filters pass for every supported
operator; **gap**: numbers have no ≥ / ≤ / between · R34 search pass · R35 import pass · R38 recycle bin pass · S01 work queue not judged (page loading).

## New candidates
| ID | Sev. | What happens | Evidence |
|---|---|---|---|
| R2W2-C1 | Medium | Record lock rules accept any free-text condition and are not enforced (CRM Admin A edited a matching lead, 200) | evidence/annotated/R2W2-C1-record-lock-vs-zoho.png |
| R2W2-C2 | Low | Home "My Tasks" / "My Meetings Today" columns show raw keys (subject, due_date, related_to, from_time) | evidence/annotated/R2W2-C2-home-raw-keys-vs-zoho.png |
| NDC-1823 regression | — | Done ticket fails again (see above); also the deal form takes ~25 s to load | evidence/annotated/NDC-1823-retest.png |

## Gaps vs Zoho
Clone · merge has no screen and is not logged · number filters without ≥ / ≤ / between · Record Locking Configuration still "In Development".

## Evidence
evidence/annotated: NDC-1193, 1823, 2122, 2136, 2280 (-retest.png), R2W2-C1, R2W2-C2. Raw: evidence/raw (screens, cards, Zoho captures from round 1).
Zoho "Not checked live" where it would need saving in Zoho (lock rules, conversion, typed patterns, timings, Home).

## Clean-up
Round2CleanupTest removed the stopped run's lock rule (0 left) and 18 records (all purged). Suite classes cleaned their own data;
Wave2SweepTest ran last. Screen checks: QA R2W2 KB / SV views deleted, conversion lead deleted, 46 QA items purged; "QA R2W2" bin items left: 0.
ImportTest moved test user 1 to a QA profile and back to User / Sales (its manager was already empty before the run).

## Automation changes (automation-r2w2, to merge)
- NEW src/test/java/qa/features/crmrecords/Round2RecordsTest.java (merge, lock, mass update + transfer, Cases / PO / SO, clone gap, filters, number-range gap)
- NEW src/test/java/qa/features/crmrecords/Round2CleanupTest.java (one-off leftovers cleanup; keep or drop)
- NEW src/test/resources/suites/crm-wave2-r2.xml (one JVM = one owner sign-in; screens as CRM Admin A)
- CHANGED src/main/java/qa/features/crmrecords/CrmRecordsApi.java (deals use the pipeline id; -Dcrm.pipelineLiteral switches back; -Dcrm.apiUser runs the owner-side API as another admin)
- CHANGED src/test/java/qa/features/crmrecords/PipelineTest.java (pipeline field without allowed_values passes)
- CHANGED src/test/resources/features/crmrecords/locators.json (listRow: rows have no record links on the new build)
