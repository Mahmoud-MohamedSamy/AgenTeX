# Round 2 · Wave 3 (automation chain) — results, 27–28 Oct 2026

Build: index-De3hTVb3.js on staging-crm (NDC-Staging). Lane accounts: CRM Admin A, CRM Admin B, the Supervisor, test user 2 (+ test user 1 as record creator, the owner once). Nothing was sent to Plane. Every run used `-DexcludedGroups=tenant-wide`; no hierarchy / session-limit / business-hours / company-settings test ran. HTTP 429: none in any run.

## Runs (logs and per-test tables in `after/`)

| Run | What | Tests | Pass | Fail/broken | Skip | Note |
|---|---|---|---|---|---|---|
| run 1 (27 Oct) | full crm-order + verify + webhooks | 254 | 64 | 181 | 9 | **invalid**: 166 failures = 403 on create — the QA layouts had no profiles (see below) |
| run 2 (27 Oct) | full rerun with the layout fix | 256 | 170 | 60 | 24 | wrapper reaped (low memory); the JVM finished on its own |
| run 3 (28 Oct) | re-verify candidates + fixed + skipped cases + NDC-2621 | 74 | 48 | 13 | 13 | as CRM Admin A for PipelineTest |
| run 4 (28 Oct) | 2nd re-verify (G-05/07/10, B-04, B-18, D-02, D-06, E2E-5, WH-09) | 13 | 7 | 6 | 0 | |
| run 5 (28 Oct) | A-17 alone | 1 | 1 | 0 | 0 | test user 2 reactivated, read back active |
| run 6 (28 Oct) | owner-only cases, ONE owner sign-in | 12 | 9 | 1 | 2 | |
| screen (28 Oct) | NDC-2621 record page + Mass Update | — | 2 | 0 | — | one saved CRM Admin A browser session |

Staging sign-in was down (POST /iam/auth/login and /refresh → 502 for any body) from ~22:20 to 23:43 on 27 Oct; nothing ran in that window.

## Root cause of run 1 (test side, not the app)
NDC-2650 is now fixed: a layout with access "selected" can only be used by the profiles it lists. `CrmApi.createQaLayout` saved the per-session QA layouts as "selected" with no profiles, and `placeFieldOnLayout` re-saved them with `assignedProfiles: []`, so test user 1 got 403 on create. The fixed `LEADS_QA_LAYOUT` f56991e7 had also been deleted (create on it → 403, not 404 — candidate C-LAYOUT403). Fix: every QA layout lists all profiles.

## Ticket verdicts (Plane states read 27 Oct ~16:50 and re-read 28 Oct ~01:40, unchanged)

| Ticket | State | Verdict | Facts |
|---|---|---|---|
| NDC-2621 | Ready For Test | **Fixed** | API: create with id 201, PATCH to "1" 200 moved, mass update 200 moved, stage-only keeps pipeline. Screen: record page "Change pipeline?" → "1" moved (stage kept); Mass Update › Pipeline → "1" moved (test-01). Images NDC-2621-api/ui |
| NDC-2419 | Ready For Test | **Inconclusive (1 fail, 1 pass)** | A-01: run 2 rule logged Fired but owner stayed the creator; run 3 owner = rule's user. A-02 import-choosing-rule passes. G-12 not run (an old baseline "QA AEO SG G-12 AR" holds its name) |
| NDC-2294 | Ready For Test | **Gaps still open** | see Gaps; item 9 (blueprint After "Create record") now works |
| NDC-2510 | Bug | Still fails | Task action "Task Closed" saved 201, run Fired, 0 tasks (runs 2, 3) |
| NDC-2511 | Bug | Still fails | date rule ran; no Audit Log entry (runs 2, 3) |
| NDC-2420 | Bug | **Passes** | W3-2420 pass (run 2) |
| NDC-2421, 2422, 2411, 2391, 2334, 2323, 2309, 2308, 2298, 2297, 2296, 2541, 2540 | Done | Pass (regression) | W3-2421, A-10 (2422), A-17 (2411), F-02, E-cases, H-05, F-01, F-03, A-04, H-02, H-03, WH-01…21 pass |
| NDC-2650 | — | Looks fixed | "selected" layouts are enforced (root cause above) |
| NDC-2321, 2316, 2319 | In Progress | Skipped | G-16 recorded only |
| NDC-2030, NDC-1486 | Backlog | Still missing | routes 404 |

## Coordinator items
- **A-14** — passes now (run 2 + run 3 from scratch): imported deal owned by the rule's user, rule Fired. Don't file. Image A-14-round2.png
- **B-18** — still fails (run 2, 3, 4): imported lead not held, review queue empty; manual/API create on the same process is held. File. Image B-18-round2.png
- **G-07** — still fails, intermittent (3 of 4 from-scratch runs): after review approval the On Edit workflow does not run (wfFired=0), the lead goes on into the blueprint. File. Image G-07-round2.png
- **G-10** — After "Create record" is fixed (lead made with all mapped fields; run 2's "inconclusive" was a test lookup fault). The made lead runs workflow + approval, then **does not enter its blueprint** (governed=false) — same as candidate C-E2E5. Image G-10-round2.png
- **G-07 / G-10 verdicts** — above.

## Candidates (re-verified once more from scratch)
| ID | Sev. | Seen | What |
|---|---|---|---|
| C-B04 | Medium | 4/4 | review approved, next edit right away → 422 REVIEW_LOCKED (later edits work) |
| C-E2E5 | Medium | E2E-5 3/3 + G-10 | record approved by an approval process doesn't enter its blueprint (Tasks; engine-made lead). Control I-04 (lead) passes |
| C-WH09 | Medium | 7/10 | approver (Supervisor) gets 404 "Record not found." on a record pending their approval; intermittent |
| C-D06 | Low | 3/3 | approval view canApprove=true for a user whose approve is 403 (missing workflow:approval:act) |
| C-LAYOUT403 | Low | probe | create on a deleted layout → 403 "Permission denied." |
| run-2 G cluster | — | not reproduced | run 2: workflow not run after review approval on every G entry point; run 3/4 from scratch: G-01, F-23, I-04, I-06, I-10, B-06, E2E-6, K-11, K-13 pass. Only G-07 stays |

## Skipped / blocked (retried on this build)
Public web form 404 (A-02 form, E2E-1, G-08) · records-API create is source "manual", no API channel (G-02, G-15, B-19) · Leads has no unique field (A-13) · conversion makes no Deal (H-01), no mass-convert endpoint (H-07) · SLA below 1 h refused (B-13) · After email not visible without an inbox (E-04) · E-16 runtime OK, label is UI-only · K-09 layout JSON has no approval_status (UI check) · I-09 a held record can't be deleted by anyone, owner included (REVIEW_LOCKED, consistent with NDC-2297) · J-04 would fire a teammate rule · B-22 N/A · E-09 one-off · G-16 In Progress · G-12 name held by a baseline rule.

## Cleanup (Java sweep, CRM Admin A, after the owner JVM)
85 pending QA approvals rejected over the sweeps (31 + 46 + 8; none left) (process-admin takeover or level approver); QA processes/rules/layouts/records of this run deleted; 325 QA bin items of 27–28 Oct purged; test user 2 active. Final diff vs baseline (`after/diff.txt`): approval 19→19, review 6→6, blueprints unchanged, Deals/Tasks layouts unchanged; remaining differences are not QA-named (other users: +2 rules, +1 assignment rule, +13 custom actions, +1 Leads layout 78288b9b). QA names still listed were all in the baseline (round-1 leftovers: SG G-12 set, QA AEO Layout SG/SH/V7).
