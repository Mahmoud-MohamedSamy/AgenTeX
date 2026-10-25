# CRM go-live — Wave 1: access and security — test plan (Step 1)

25 Oct 2026 · staging-crm.taviportal.com (NDC-Staging) · reference Zoho CRM org943261092 (read-only)
Matrix: `docs/crm-go-live-feature-inventory/` rows U01, U03, U04, U05, U06, U10, U11, U12, U15, C06 (+ U07 partly).
Not testable in this wave (missing in TAVI): U02 import users, U08 groups, U09 territories, U13 GDPR, U14 sandbox.

## State checked today (read-only)
- Hierarchy preference = **role**, version 16 (was 14 after the 21 Oct run, so someone changed it twice since).
- All 9 CRM users are **active** (test user 1 is no longer suspended). 2 new users `zzs…@example.com` appeared — not ours, leave them alone.
- Audit log is **recording again**: crm, iam and metadata events from 25 Oct 11:46 UTC. NDC-2381 looks fixed; it still needs a proper probe.

## Test list

How each case runs: **R** = rerun existing automation · **N** = new automation (kept for next time) · **M** = manual in the browser.

### A. Hierarchy, profiles, reporting manager — R (suite `crmhierarchy`, 36 tests)
| Case | What | Tickets | How |
|---|---|---|---|
| A-1 | Role mode: higher-ranked user sees lower-ranked users' records (I3, I3b, I4) | NDC-2412 | R |
| A-2 | Reporting mode: manager sees direct report's records (J1/J3, J1s) | NDC-2413 | R |
| A-3 | Desk Administrator profile must not give CRM view-all (E7d) | NDC-2414 | R |
| A-4 | Hierarchy history shows who changed it (B5/D2) | NDC-2415 | R |
| A-5 | User cannot change own manager without permission (G9) | NDC-2416 | R |
| A-6 | The 31 regression tests that passed on 21 Oct (mode guard, loops, bad ids, UI switch, API errors) | — | R |
| A-7 | Indirect report in reporting mode (J4, skipped last time — needs a 3rd user without view-all) | — | R if the Supervisor user can be used |
| A-8 | Gap list still open (Z7, Z16–Z19) | NDC-2417 | R |

### B. Field permissions — N
| Case | What | Tickets | How |
|---|---|---|---|
| B-1 | Field set to "Don't show" for a profile: hidden on create/edit form and record page | NDC-1337 | N (UI) |
| B-2 | Field set to "Read only": visible, cannot be typed into | NDC-1337 | N (UI) |
| B-3 | Same restrictions enforced by the API (create/update with the restricted field is refused or ignored) | NDC-1337 | N (API) |
| B-4 | Same result whether set from the Field Permissions tab or the layout builder | NDC-1337 | N |
| B-5 | Import into a read-only field (also listed for Wave 2) | NDC-1593, NDC-1599 | N (API) — optional here |

### C. Audit log — N
| Case | What | Tickets | How |
|---|---|---|---|
| C-1 | Create + update + delete a QA record → 3 events within 2 minutes, with user and changes | NDC-2381 | N (API) |
| C-2 | Each entity type logs: record, layout/field change, field permission, workflow rule, profile change, sign-in/out; logout names the user | NDC-1343 | N (API + UI) |
| C-3 | Entities filter: no duplicate or internal names, related entities grouped | NDC-2293, NDC-1344 | M (read-only) |
| C-4 | Filters (user, action, time) and the page load as owner and as a user with "view own" only | — | N (UI) |

### D. Login history and sessions — N
| Case | What | Tickets | How |
|---|---|---|---|
| D-1 | Expired sessions are not shown as "Active" (count active rows whose expiry is past) | NDC-2418 | N (API, read-only) |
| D-2 | User denied "view own" + "view all" login history cannot open the page or export | NDC-613 | N (UI + API) |
| D-3 | Login history page loads, filters, export as owner (page timed out once on 25 Oct) | — | N (UI) |
| D-4 | Active sessions panel: revoke one of our own sessions → that token stops working | — | N (API) |

### E. Users, profiles, security policies, personal settings
| Case | What | Tickets | How |
|---|---|---|---|
| E-1 | Users list, user detail, suspend → can't sign in → reactivate → can sign in (test user 2) | NDC-2411 (side effect) | N |
| E-2 | Profiles: create QA profile, clone, permission tree save, delete | — | N |
| E-3 | Per-user permission override + history | — | N |
| E-4 | Security Policies page: read values only, compare with Zoho (no saving — tenant-wide) | — | M (read-only) |
| E-5 | Personal settings: change own locale / name format on a test user, then restore | — | N |
| E-6 | Org units: list and tree render (no edits) | — | M (read-only) |

### F. Optional — your call
| Case | What | Tickets | How |
|---|---|---|---|
| F-1 | Teamspace access control: CRM Admin / Manager profile opens a teamspace it is not on; any member acts as admin | NDC-1172, NDC-1699, NDC-1701 | N |
| F-2 | Referral Code Integration: page, settings, run history read-only. A real sync creates or suspends real users, so it is NOT run without dev guidance | NDC-2492 | M (read-only) |

## Accounts
Owner (ndc-staging-owner), CRM Admin (mmohamed), profile "test" (valafo4080), User (nameb56175), Supervisor (mahmoud.mmohamedsamy) — all from the Edge password export. One sign-in per user, shared in one JVM (avoid the 429 rate limit).

## What will change on the tenant (needs approval) — all restored, proven by a final GET diff
1. Hierarchy mode role → reporting → role (suite A, tenant-wide, a few minutes).
2. valafo4080 profile swapped to User/Supervisor/Manager and back to "test" @HR (suite A).
3. A new profile **"QA W1 FieldPerm"** with field permissions on 2 Leads fields; test user nameb56175 moved to it during B, then back to "User". Profile deleted after.
4. QA records `QA W1 …` in Leads / Transactions (C, B), deleted after.
5. Per-user permission override on valafo4080 (deny login-history view) for D-2 / E-3, removed after.
6. Suspend + reactivate test user 2 (E-1).
7. A QA profile created and deleted (E-2); a QA workflow rule created and deleted (C-2).

Never touched: Security Policies values, Referral Code sync, other people's records, the two new example.com users, Zoho (read-only).

## Order
A (serial, tenant-wide) → B → C → D → E → F. One test class at a time for anything tenant-wide.

## Gate 1 — approved 25 Oct 2026
User approved groups A–E with the 6 temporary changes as listed, plus both optional F cases (teamspace access bugs; Referral Code page read-only), and a read-only Zoho comparison for differences.
