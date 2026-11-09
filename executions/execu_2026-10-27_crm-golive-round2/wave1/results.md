# Round 2 · Wave 1 (access and security) — results

27 Oct 2026 · staging-crm.taviportal.com, build index-De3hTVb3.js · Lane A of Phase 1 (Lane B = Wave 2 in parallel).
Accounts: owner (unavailable 14:10–15:35: "Session Limit Reached" on the login page, then the coordinator cleared owner sessions at 15:13 and allowed one owner sign-in from 15:35), CRM Admin B (acting admin through the new opt-in `-Dcrm.adminAs`), Supervisor, test user 2. Test user 1 is reserved by Lane B until the coordinator's GO.
Snapshot: `baseline/snapshot.json` (16 users, 43 profiles, 124 org units; test user 2 = Manager @HR, manager Supervisor; test user 1 = User @Sales, no manager; hierarchy mode role v34).

## Ticket states at the start (Plane)
Done: NDC-1337, 2381, 2293, 1172, 1699, 1701, 2413, 2415, 2416, 2418, 2542, 2543, 2545, 2546, 2547, 1593, 1599 · Bug: NDC-2412, 2414, 2655–2658 · Backlog: NDC-613 · In Progress: NDC-1343 (skipped).

## Results so far
| Case | Ticket | Result | Facts |
|---|---|---|---|
| C-1 | NDC-2381 | Pass | create/update/delete of a QA lead logged within 8 s, actor and changes |
| C-2, C-2b | NDC-1343 (In Progress) | observed only | profile, field permission, override logged; 7 logout events all name the user |
| C-3 | NDC-2293 | Pass | 53 entity options (API, with the app keys the screen sends), 55 on screen, no duplicates. One call without app keys answered 500 once, 200 on rerun — not reproduced |
| D-1 | NDC-2418 | Pass | 21 Active sessions, 0 past expiry (25 Oct: 306 of 346) |
| D-2 | NDC-613 | Pass (test user 2 path) | denied view self/team/all → list 403, export 403. Test-user-1 screen recheck pending (change map: Setup links shown) |
| D-4 | — | Pass | revoked QA session token 401 at once |
| E-1/E-2/E-3 | — | Pass | suspend / reactivate test user 2; clone copies 30/30 permissions; override with history naming the actor |
| F-1a/b/c | NDC-1172, 1699, 1701 | Pass | not listed / can't open / member can't administer. Teamspace create now needs `module_ids` (new rule) — test updated |
| US-03/04/05 | NDC-2658 | Still fails / blocked | invite refused 409 SUBSCRIPTION_SEAT_LIMIT_REACHED, message is the raw key; blocks NDC-2542 and US-13/PS-06 |
| R2-PR06 | NDC-2543 | Pass | rename / delete built-in User → 409 SYSTEM_PROFILE_PROTECTED with clear messages |
| R2-AIP | new | **New candidate R2W1-B1** | built-in "AI Agent" profile (new in this build, isSystem=false) renamed → 204; set back to "AI Agent" at once (read back) |
| R2-PR04 | NDC-2546 | Pass | rank 600 above parent 500 → 400 with a clear message; rank unchanged |
| R2-PE07 | change map | Pass | catalogue has ai:agent:manage, ai:summary:view, metadata.modules.manage |
| R2-FP | NDC-1337 | Pass | test user 2 on a QA profile: hidden Company write 422, read-only Email edit 422, Company not returned |
| R2-IM | NDC-1593, 1599 | Pass | import with the hidden field: 0 created, 1 error |
| R2-HM | NDC-2416 | Pass | test user 2 (no iam.personal.reporting_hierarchy) PUT own manager → 403, unchanged |
| R2-DA | NDC-2414 | Pass (effect) | Supervisor (+ Desk Administrator) reading a lead outside its hierarchy → 403. Its permission list still shows metadata.records.view_all (from Desk Administrator, not the Supervisor profile) — no effect seen |
| R2-VIS | U07 | Pass + gap | Leads visibility hierarchy; invalid mode → 400 listing public / hierarchy; no sharing rules (Zoho has Data Sharing Settings + rules) |
| R2-HP-B5 | NDC-2415 | Pass | Hierarchy Preference change history shows "by <user> · date time" for every row |
| Screens (CRM Admin B) | NDC-2547 | Pass | AU-05/06, LH-01/05, OU-01 (after waiting for 124 units), PS pages, PR-01/PE-01/PE-03 ("Create profile" label), RC-01, SP-01, US-10, US-01/02 (test fixed: test user 1 found by search), PE-02/03, FP-01 |
| FP-control | — | known control finding | "Comment" field not on the Leads create form (same as 25 Oct) |
| HP-new | — | **ran by mistake (tenant-wide)** | switched mode role → reporting → role at 14:40 (≤1 min), back to Role; reported to the coordinator |
| R2-PE06 | NDC-2657 | pending | Supervisor and test user 2 both hold iam.profile.manage, so pages open legitimately; needs test user 1 |

| Test-user-1 batch (one owner sign-in, after GO) | — | 34 / 36 pass | AdminApiTest (12 incl. PR-06, PE-05, US-15/16, OU-02/03/04, AU-07/LH-06, PS-01/05), FieldPermissionTest (4, NDC-1337), LeftoversApiTest (PR-04, FP-06, FP-08 Transactions now works, LH-04), RestrictedUserUiTest (FP-04, FP-05, LH-07/US-16/PR-08/SP-05), R2W1Test org units (OU lifecycle + sweep), VisibilityTest role cases |
| LH-07 | NDC-613 | Pass | test user 1 with login history denied: no Login History link; no admin page opens by URL without permission |
| R2-PE06 | NDC-2657 | Still fails | test user 1 (no iam.profile.manage) on Settings › Permissions: the Profiles panel shows "Missing required permission 'iam.profile.manage'." (screenshot after 15 s; the automated check read too early at 4 s — wait fixed) |
| I1, I2, I2b, I3b, I4, I6, I7, I8 | — | Pass | role-mode visibility controls (no mode switch) |
| I3 | NDC-2412 | Still fails (twice) | Supervisor (300) @Sales does not see a User (100) @Sales lead, owner-set or self-created |
| I4b | new | **New candidate R2W1-B2** (twice) | Manager (500) @HR, no view-all, sees a Sales User's leads (owner-set and self-created) |
| R2-US01 | — | Pass | owner and CRM Admin B both see 16 users (the short Users screen list is paging) |

## Not run here (Phase 4 / blocked)
NDC-2413 (reporting mode), NDC-2545 (idle timeout), sessionPolicyValidation, session limits, security policy edits, record-visibility edits, Referral Code sync, US-13 / PS-06 and NDC-2542 (no free seat), NDC-2656 (owner self-profile, owner screen), NDC-1343 (In Progress).

## Clean-up
- Final snapshot `after/snapshot-final.json` vs `baseline/snapshot.json`: no differences (users incl. test users 1 and 2, 43 profiles and their permissions, overrides, 124 org units, Leads field permissions, record visibility, teamspaces, hierarchy mode role, session settings) — `after/diff.txt`.
- QA R2W1 org units: 2 left by the first org-unit run were swept (0 left). The "AI Agent" profile renamed by R2-AIP was set back at once (read back).
- 34 QA R2W1 / QA W1 recycle-bin items purged, 0 left.
- Incident: AccessScreensUiTest#personalPageAfterSwitchBack (tenant-wide) ran once as CRM Admin B at 14:40 and switched the mode role → reporting → role within a minute (history shows both rows); later runs named methods explicitly.
