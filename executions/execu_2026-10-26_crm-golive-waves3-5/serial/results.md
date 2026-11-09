# Serial window + Wave 1 leftovers — results (27 Oct 2026)

Runner: automation-w3 (merged code), owner browser session "sw" for snapshots. Snapshot: `baseline/snapshot.json` (+ `baseline/fiscal.json`) taken 09:55.
At snapshot time: company time zone Africa/Cairo, business hours 24×7 (Africa/Cairo) — i.e. already back to the 26 Oct morning values; hierarchy mode role; max concurrent sessions 20.

## Part 1a — CRM ⇄ Desk integration (crmdeskintegration automation)
Runs: `after/cdi-api.log` (ReadApiTest, WriteRunTest, RemainingApiTest: 57 tests, 48 pass, 9 fail) → 6 deal-dependent failures were the pipeline bug
(NDC-2621: a pipeline id answers 422); WriteBase now sends "Standard (Standard)" (switch back with -Dcrm.pipelineById=true) → rerun
`after/cdi-api-rerun.log` (WriteRunTest + RemainingApiTest: 36 tests, 33 pass, 3 fail).

| Ticket | Case | State (Plane, 27 Oct) | Verdict | Facts |
|---|---|---|---|---|
| NDC-2393 | CD-01 I9/I8 | Done | Pass | unlink 204; a CRM edit after it does not re-link; manual link 201 |
| NDC-2395 | CD-03 H10/G19 | Done | Pass (new rows) | new failure reasons name the records; 6 of 21 rows stored before the fix keep raw ids |
| NDC-2396 | CD-04 C17 | Done | Pass | 7 invalid mapping bodies refused (422/400), none stored |
| NDC-2397 | CD-05 F5 | Done | Pass | no row_version → 400; stale → 409 |
| NDC-2398 | CD-06 H3 | Done | Pass | history rows carry "failed" (e.g. accounts added 4, failed 5) |
| NDC-2401 | CD-09 B4 | Done | Pass | 1,206-char pause reason → 400 "at most 500 characters" |
| NDC-2402 | CD-10 O3 | Done | Pass | random / deleted ids → 404 |
| NDC-2405 | CD-13 E8 | Done | Pass | preference changed after a queued delete → Desk contact kept |
| NDC-2409 | CD-17 F8 | **Bug** | **Pass** | audit events for the integration settings changes, actor = owner |
| NDC-2392 | gap item, J1a/Z9 | Backlog | Still open | every Desk profile has Full Access to CRM data by default |
| NDC-2406 | CD-14 E9 | In Progress | skipped (observed: still no recycle-bin item, no restore) | |
| NDC-2410 | CD-18 D6 | In Progress | skipped (observed: lock on → edit refused 422; lock off → edit also refused 422) | |
| NDC-2394, 2400, 2407, 2408 | CD-02 K10, CD-08 I16, CD-15 J4, CD-16 I18 (screens) | Done | not rerun | screen classes not run in this window |
| NDC-2399 | CD-07 B11 | Bug | not rerun | needs a disconnect + reconnect of the live integration |
| NDC-2403, 2404 | CD-11, CD-12 | Done | not rerun | no covering automated case in the API classes |
| — | M2 (CRM bell for the contact owner) | — | fails | notifications are down (NDC-2632) |

Integration settings after both runs: equal to the snapshot except the import timestamps and health check time (the tests' own syncs).
Evidence: `evidence/annotated/NDC-2393, 2395, 2396, 2397, 2398, 2401, 2402, 2405, 2409, 2392-retest.png` (TAVI = API facts card from the logs;
Zoho = reference screens captured live 18–21 Oct; the Zoho integration has since been deleted, so Zoho rows say "not checked live" where the
capture does not show the behaviour).

## Outside changes seen (not made by this runner)
Between 09:55 and ~11:05: test user 2 profile "test" → "Manager"; test user 1 reporting manager 155208be (Hegazy) → none. Reported; user chose (a): continue on
the current state. Fresh snapshot baseline/snapshot2.json (11:39) is the restore target for everything after that point.

## Part 1b — company / business hours / fiscal year (after/step-b.json)
- Company fax → "QA W5 fax 0101" (200), shown, restored to empty (200); name and time zone unchanged.
- Fiscal year start month 1 → 7 (200), restored to 1 (200). Now stored at Org level (was Default) — same value.
- Business hours: NOT changed. The stored record (preset 24_7 + timing_mode "same" + hours 09:00–17:00, Africa/Cairo) fails the API's own rule:
  saving it back unchanged → 400 business_hours.invalid_timing_mode. Sunday off → 400 "24_7 requires all 7 days" (correct). **New candidate.**
## Part 1c — pipeline settings: skipped (NDC-2386 In Progress).

## Part 2 — Wave 1 leftovers
| Case | Result | Facts | Restored |
|---|---|---|---|
| J4 | **Pass** | Reporting mode; chain test user 1 → zzsweep-tavi-probe → zzsweep-tavi-probe2; test user 1 reads the bottom- and middle-owned QA leads (200, both in its list); a lead owned by the Supervisor → 403. (NDC-2413 direct-report case also visible — In Progress, observation only) | managers cleared, mode role, 3 leads deleted + purged |
| SP-03 | **Pass** | max concurrent 20 → 25 (200), shown as 25 on Security Policies; owner and test user 1 sessions still 200. Enforcement above the limit not exercised (26 sign-ins) | 20 (read back) |
| US-08 | Observation | Owner profile can't be given to another account: 409 OWNER_PROFILE_LOCKED. On the owner's own user record, picking "User (rank 100)" enables Assign with **no warning**; Assign NOT clicked (Owner can't be given back) | nothing changed |
| PE-06 | **Finding** | Catalog has only iam.profile.manage (no view-only profile permission), so a read-only state can't exist. Without it, Settings › Permissions still opens by URL and shows the raw text "Missing required permission 'iam.profile.manage'."; /iam/profiles 403 | nothing changed |
| FP-02 | **Pass** | Leads › Standard layout › Company › Set Permission › Permissions tab: unticking Edit for a QA profile stores company=read_only at once ("Per-profile permissions save as soon as you change them"); ticked again → read_write | permission row + QA profile deleted; layout never saved |
| US-13 / PS-06 | **Blocked** | invite → 409 SUBSCRIPTION_SEAT_LIMIT_REACHED (message shown as the raw key "iam.subscription.seat_limit_reached"); login Register creates a separate account | no invite created |
| NDC-2098 | **Pass (retest)** | automated test inconclusive twice (Leads list still loading at 60 s, NDC-2136); by hand: deleted view id in ?view= → URL drops ?view, "All Leads" 172 records | QA view deleted |
| Referral Code sync | **Blocked** | directory sync not configured (no base URL / API key, off, no runs); the "Sync now" attempt was blocked by the session permission check — not run | nothing changed |

Also removed: leftover profile "QA W2 Import FP 696737" (from a 26 Oct Wave 2 import run).

## Final check (after/diff.txt, against snapshot2)
All same (integration, company, business hours, hierarchy, session limits, users, field permissions) except: profiles — "QA W2 Import FP 696737" removed (intended);
fiscal start month 1 now stored at Org level (same value).

## Evidence (evidence/annotated/)
CRM ⇄ Desk: NDC-2393, 2395, 2396, 2397, 2398, 2401, 2402, 2405, 2409, 2392 (-retest). Leftovers: NDC-2098-retest, W1-J4-retest, W1-SP03-retest, W1-FP02-retest,
W1-US08-observation, W1-PE06-finding, BH-resave-candidate, W1-US13-PS06-blocked, Referral-sync-blocked. Zoho panels are earlier read-only captures (dates in captions);
rows say "Not checked live" where the capture does not show the behaviour.
