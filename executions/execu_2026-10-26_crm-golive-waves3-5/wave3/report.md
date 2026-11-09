# CRM go-live — Wave 3: automation chain — report

26 Oct 2026 · staging-crm.taviportal.com · CRM Admin A, CRM Admin B, Supervisor, test user 2 (no owner) · Lane A of ../plan.html.
Case facts: `results.md`. Evidence: `evidence/annotated/` (approved layout). Nothing went to Plane.

## Summary
crm-order suite + new W3RetestTest, 192 cases: 131 pass, 35 fail, 26 skipped.
Failures: 2 tickets still failing (NDC-2510, 2511) · 12 gaps still open (NDC-2294 items) · 4 tied to In Progress tickets (not judged: F-01, H-05, G-16, G-12) · 12 known test-side defects listed on 25 Oct · 1 blocked by W2-B4 (C-10) · 2 new candidates (A-14, B-18) · 2 old unfiled failures (G-07, G-10).
Group D (submitter's manager) after the manager restore: D-01, D-02, D-03, D-12, D-13, D-16, D-19, D-20 pass; D-18 skipped (needs the owner).
About 20 deal cases that failed with "Invalid value for: Pipeline" were rerun with the literal "Standard (Standard)": 16 pass.

## Tickets
| Ticket | Verdict | Facts |
|---|---|---|
| NDC-2510 | Still fails | Task action with status "Task Closed" saves (201); run logged Fired; no task created |
| NDC-2511 | Still fails | Date rule ran on time, but no audit entry for the run |
| NDC-2421 | Passes | 12 of 12 parallel creates got the Field Update |
| NDC-2420 | Passes | Workflow runs after a transition with a required field |
| NDC-2294 | Gaps still open | Items 1, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13 unchanged |
| NDC-2030, NDC-1486 | Still missing | 404, no screen; Zoho has both |
| NDC-2314, 2315, 2317, 2318, 2320 | Blocked | No Google service account or test sheet |
| NDC-2422, 2419, 2411, 2391, 2334, 2323, 2322, 2321, 2309, 2308, 2298, 2297, 2296, 2316, 2319 | Skipped (In Progress) | Observations only: H-02 now refuses converting a lead held for review (NDC-2297); H-03, F-03, A-04, F-02 pass through the API; A-17 lead went to the fallback user |
| A08 custom actions (no ticket) | Passes | OpenAPI import, publish, run from the screen; deleted after |

## New candidate bugs (not in Plane)
| ID | Sev. | What happens |
|---|---|---|
| W3-C1 | High | Transactions can't be imported: "Standard (Standard)" → "No pipeline named …", "Standard" → "not one of the allowed picklist values"; 0 rows created. Same root cause as W2-B4 / NDC-2382 (NDC-2621). Passed on 18 Oct |
| W3-C2 | Medium | A lead imported through the Import channel is no longer held by its review process. Passed on 18 Oct, failed in 3 runs today |
| G-07 (triage) | — | On Create workflow doesn't run after a review approval (also failed on 18 Oct) |
| G-10 (triage) | — | A deal created by a blueprint doesn't enter the next blueprint after approval (NDC-2334 area) |

## Environment problems found (not caused by this lane)
- Test user 2 had no reporting manager (was the Supervisor) — restored by the coordinator on the user's request; group D rerun passed.
- Profile "test" has Phone read-only, so test user 2 can't create leads; the new class submits as the Supervisor.
- Tenant time zone UTC and business hours 09:00–17:00 (were Africa/Cairo, 24×7) — not restored, user's choice.

## Incident
UiSmokeTest as CRM Admin A included A-17 (NDC-2411, In Progress); it suspended test user 2 and hung before reactivating it. Test user 2 was suspended for about 15–20 minutes until it was reactivated through the API (204, read back active). A-17 excluded from the reruns.

## Evidence
NDC-2510, 2511, 2421, 2420, 2294, 2030, 1486 (`-retest.png`); W3-C1, W3-C2 (`-candidate.png`). Zoho not checked live for the Task status form (NDC-2510), deal import with a Pipeline column (W3-C1) and holding imported records for review (W3-C2).

## Not done
Owner-only cases (D-10, D-18, I-08, I-09, K-09, K-13) · A-10, A-17 (shared accounts) · J-04 (would fire a teammate's rule) · environment: public web form 404, no API channel, no unique field, deal conversion has no mappings · UiSmokeTest hung, so screen coverage comes from manual captures · known test-side defects not fixed this round.

## Automation (merged into automation/)
New `W3RetestTest`; `CrmUser` (`-Dcrm.noOwner`), `CrmApi` (`trackRule`, owner-free late delete, Deals "Standard (Standard)" with `-Dcrm.pipelineById` to switch back), `GroupAJTest` (imports use the pipeline name), Group C / E / VerifyV4 (real mail only to CRM Admin A), `AuthManager` (organisation picker, `auth.org`, default "Wonder Travel" = NDC-Staging), feature-map notes.

## Clean-up
All QA AEO / QA W3 objects removed (approval-locked records released by rejecting with the approver or process admin); bin purged, 0 lane items left. `after/diff.txt` identical to the baseline (rules 41, assignment 12, review 6, approval 19, blueprints 0/1/0, custom actions 0, layouts 11/4/3). All five accounts active. No tenant-wide changes by this lane.
