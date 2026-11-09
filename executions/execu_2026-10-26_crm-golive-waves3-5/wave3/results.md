# Wave 3 (automation chain) — results, lane A, 26 Oct 2026

Accounts: CRM Admin A, CRM Admin B, Supervisor, test user 2 (no owner: `-Dcrm.noOwner=true`). Prefix "QA AEO " / "QA W3 ".
Runs (logs in `after/`): crm-order run 3 (192 tests, one JVM, 88 min) → deals rerun (21) → group D + A-14/B-18/G-10 rerun (12);
W3RetestTest runs 1–3; UiSmokeTest as CRM Admin A (hung, see Not done). Runs 1–2 of crm-order were stopped (email recipients fixed; session restart).

## Final per-case status (crm-order suite + W3RetestTest, after reruns)
| | Count |
|---|---|
| Pass | 131 |
| Fail | 35 |
| Skipped (not run / inconclusive) | 26 |
| Total | 192 |

### The 35 failures, classified
| Class | Cases | Meaning |
|---|---|---|
| Ticket still failing | W3-2510 (NDC-2510), W3-2511 (NDC-2511) | see report |
| Gaps still open (NDC-2294, NDC-2030, NDC-1486) | Z2–Z9, W3-GAPS, W3-2294-13, G-04 (item 1), B-19 (API opt-in undocumented, known 22 Oct) | features missing, not bugs |
| Linked to an In Progress ticket (not judged) | F-01 (NDC-2309), H-05 (NDC-2323), G-16 (NDC-2321), G-12 (waits NDC-2419; also an old "QA AEO SG G-12 AR" rule in the baseline blocks its name) | skipped: In Progress |
| Known test-side defects (listed 25 Oct, not fixed yet) | J-01, E-15, E2E-5, E-18, C-11, C-09, A-08, D-17, C-12, H-04, D-05, D-06 | test expectations out of date, not app bugs |
| Blocked by the pipeline bug (W2-B4 / NDC-2382) | C-10 (Create Record action maps a pipeline id into Deals) | |
| New candidates | A-14 → W3-C1, B-18 → W3-C2 | see report |
| Still failing, unfiled (same as 18 Oct) | G-07 (On Create workflow not run after a review approval), G-10 (deal made by a blueprint does not enter the next blueprint after approval; 18 Oct inconclusive, likely NDC-2334 area) | need triage |

### Skipped (26)
Owner reserved: D-10, D-18, I-08, I-09, K-09, K-13 · Needs user OK / shared accounts: A-10, A-17 · Teammate rule conflict: J-04 ·
Environment: A-02, E2E-1, G-08 (public web form 404), G-02, G-15 (no API channel), A-13 (no unique field), H-01, H-07 (deal conversion / mass convert), B-13 (SLA below 1 h refused), B-22 (N/A by user), E-04 (inbox), E-16, F-04, G-13, Z1, G-18, K-09 (layout JSON).

### Passing now that failed or were inconclusive on 18 Oct
A-04, F-02, F-03, E-09, D-21, H-02, H-03, G-05. F-02 = NDC-2391, F-03 = NDC-2308, H-02 = NDC-2297 (convert while held for review now refused REVIEW_LOCKED),
H-03 = NDC-2296, A-04 = NDC-2298 — all In Progress, so recorded only, not judged.

## Ticket checks (W3RetestTest)
| Case | Facts |
|---|---|
| W3-2510 | rule with Task action taskStatus "Task Closed" → 201; lead created → execution Fired, errorMessage null, 0 tasks |
| W3-2511 | Tasks date rule (due_date + 0) ran on time (reminder created); `/audit/events` (workflow, crm) has no entry naming the rule after the due time |
| W3-2421 | 12 leads created in parallel → 12/12 Field Update applied |
| W3-2420 | blueprint chat→web with required Email; transition 200; Lead Source rule Fired, field set |
| W3-2294-13 | control lead got the rule; lead created with `"trigger": []` also got it |
| W3-GAPS | triggers RecordScoreChanged / NoteAdded → 400; actions Meeting / Call / CustomFunction / CreateConnectedRecord → 400; schedules, scoring-rules, cadences, macros, connected-flows → 404 |

## Screen checks (CRM Admin A, playwright-cli, nothing saved except A08)
- Settings screens open: Workflow Rules, Assignment Rules, Blueprints, Approval Processes, Review Process, Custom Actions, Google Sheet, Audit Log (`evidence/raw/t-*.png`).
- Workflow designer (new rule, discarded): triggers Record Action (Create / Edit / Create or Edit / Delete / Field Changed) and Date-Time only; 9 instant actions; scheduled actions Webhook, Email, Task, Create Record, portal access; one condition.
- A08 Custom Actions: pasted OpenAPI spec (httpbin) → parsed "1 operation" → configured → "Save & publish 1 action" → Active → Run → "QA W3 echo ran successfully" (httpbin echoed lead=QA-W3-run). Deleted after (action + API source 204).
- A14 Google Sheet: "No Google spreadsheets connected yet"; no service account / test sheet → NDC-2314/2315/2317/2318/2320 blocked.
- UiSmokeTest as CRM Admin A: A-17 suspended test user 2 and hung before reactivating (A-17 = NDC-2411, In Progress, should have been excluded). Test user 2 reactivated by API (204, read back active). Observed: the A-17 lead went to the Supervisor (fallback) — NDC-2411 behaviour looks fixed (In Progress, not judged). F-02 Lead Owner condition still did not fire on screen-built rule.

## Environment notes
- Test user 2 had no reporting manager (restored by the coordinator) and its profile has Phone read-only — test user 2 can't create leads; W3RetestTest submits as the Supervisor. Group D passed after the manager was restored.
- Tenant time zone / business hours were changed by someone outside lane A (UTC, 09:00–17:00); no lane A test reads them except SLA/date cases; NDC-2511 ran fine.
- Owner-free cleanup: approval-locked records released by rejecting with the approver / process admin (`scripts/reject-pending.js`), then `scripts/sweep.js`.
