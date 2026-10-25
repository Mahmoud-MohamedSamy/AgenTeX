# CRM go-live — Wave 1: access and security — full feature test list (plan v2)

25 Oct 2026. Replaces the bug-focused list in `plan.md` (user asked for a full feature retest). Results already gathered
under plan v1 (groups A–E) are kept and mapped to the case ids below; nothing is re-run unless the row says so.
Sources for the functions: TAVI locale files `iam.json` and `login-history.json` (every button, field and message of
these screens), the live API, and the Zoho CRM inventory (reference column).

How: **A** = API automation · **U** = screen automation (Selenium) · **M** = manual look, screenshot · **R** = existing suite rerun.
Status: ✅ done today · ❌ failed today · ⏳ to run · 🔒 needs your OK (see Gate 1 questions).

## 1. Users (`/settings/general/users`)
| ID | Function | How | Status |
|---|---|---|---|
| US-01 | List: Active Users / All Users views, columns, row count | U | ⏳ |
| US-02 | Search by name / email; filter by profile and by status; clear filters | U | ⏳ |
| US-03 | Invite one user: email, initial profile, org unit, invitation lifetime; token shown, copy token | U+A | 🔒 |
| US-04 | Bulk invite: add/remove rows, row limit, per-row result, retry failed rows, existing account "added" | U | 🔒 |
| US-05 | Resend invitation; cancel invitation (invitation disappears, token no longer works) | A+U | 🔒 |
| US-06 | Invite validation: bad email, duplicate email, no profile, lifetime 0 / too long | A | ⏳ |
| US-07 | Manage modal: change profile (and back), change org unit (and back) | U+A | ⏳ |
| US-08 | Assigning a profile to yourself asks "Change your own profile?" | U | ⏳ (cancel only) |
| US-09 | Reporting manager: set, clear, loop refused (covered by suite A) | R | ✅ |
| US-10 | Referral code shown read-only in the modal | U | ⏳ |
| US-11 | Suspend → can't sign in, open session cut → reactivate → can sign in | A | ✅ |
| US-12 | Suspended user is skipped by assignment (NDC-2411, also Wave 3) | R | ⏳ |
| US-13 | Remove from CRM / Delete user / Anonymise | — | 🔒 irreversible on real users |
| US-14 | Permission overrides: add GRANT / DENY with reason, remove, history names who (E-3) | A+U | ✅ API · ⏳ screen |
| US-15 | "A GRANT only sticks if you hold it": CRM Admin grants a permission they don't have → refused | A | ⏳ |
| US-16 | A user without Users permission cannot open the page or call the API | A+U | ⏳ |

## 2. Profiles (`/settings/security/profiles`)
| ID | Function | How | Status |
|---|---|---|---|
| PR-01 | List with System / Custom / Tenant-wide badges, search, hierarchy view | U | ⏳ |
| PR-02 | Create: name, parent, rank, clone-from, tenant-wide; clone copies all permissions | A+U | ✅ clone (29/29) · ⏳ screen |
| PR-03 | Rank rules: rank above your own refused ("rank exceeds actor"); rank conflict badge | A | ⏳ |
| PR-04 | Edit name / parent / rank; invalid or missing parent warnings | A+U | ✅ rename · ⏳ rest |
| PR-05 | Delete: empty profile deleted; profile with users assigned → refused or asks to move them | A | ✅ empty · ⏳ with users |
| PR-06 | System profiles (Owner, CRM Admin…) cannot be deleted or renamed | A | ⏳ |
| PR-07 | Desk Administrator gives no CRM view-all (NDC-2414) | R | ❌ still open |
| PR-08 | A non-admin cannot open Profiles (access denied page) | U | ⏳ |

## 3. Permissions (`/settings/security/permissions`)
| ID | Function | How | Status |
|---|---|---|---|
| PE-01 | Pick a profile; matrix Grant / Deny / Inherit; "granted via parent" shown | U | ⏳ |
| PE-02 | Change, pending-change counter, Discard, Save | U | ⏳ (QA profile only) |
| PE-03 | Owner-only and not-grantable permissions are locked | U | ⏳ |
| PE-04 | Create a custom permission; delete it | A+U | ⏳ |
| PE-05 | **Each permission really allows / blocks its action**: one probe per area (records view-all, export, mass delete, import, workflow manage, approvals, users view, profiles manage, login history, audit) with a QA profile | A | ⏳ ~12 probes |
| PE-06 | Read-only notice for users who may view but not edit | U | ⏳ |

## 4. Field permissions (Modules & Fields)
| ID | Function | How | Status |
|---|---|---|---|
| FP-01 | Set from the Field Permissions tab (per profile, per field, three levels) | U | ⏳ |
| FP-02 | Set from the layout builder "Set Permission" dialog; both screens show the same value | U | ⏳ |
| FP-03 | API refuses writing a hidden / read-only field; hidden value not returned (NDC-1337) | A | ✅ |
| FP-04 | Create form: hidden field absent, read-only field disabled | U | ⏳ |
| FP-05 | Edit form and record detail page: same | U | ⏳ |
| FP-06 | List view / custom view columns: hidden field not offered or shown | U+A | ⏳ |
| FP-07 | Import into a read-only field (NDC-1593, NDC-1599) | A | ⏳ |
| FP-08 | Another module (Transactions) and a custom module (Agency) behave the same | A | ⏳ |
| FP-09 | Effective permissions endpoint shows the result per user | A | ⏳ rerun (test fixed) |

## 5. Org units (`/settings/security/org-units`)
| ID | Function | How | Status |
|---|---|---|---|
| OU-01 | Tree, search, hierarchy view | U | ⏳ |
| OU-02 | Create root and child unit; edit name | A+U | ⏳ (QA units) |
| OU-03 | Move under another parent; "cannot move under self or a descendant" | A+U | ⏳ |
| OU-04 | Delete empty unit; delete unit with users or children → refused or asks | A | ⏳ |
| OU-05 | Org unit used for hierarchy visibility (suite A, "same department") | R | ✅ partly (NDC-2412 open) |

## 6. Hierarchy preference + reporting hierarchy — suite `crmhierarchy` (36 tests)
| ID | Function | How | Status |
|---|---|---|---|
| HP-* | Mode switch, history, managers, visibility in both modes, API guards | R | ✅ run: 27 pass, 8 fail (NDC-2412, 2413, 2414, 2415, 2416 + 1 new candidate), 1 inconclusive |
| HP-new | Personal reporting page still opens after switching back to Role (same browser) — verify with a fresh browser | U | ⏳ verify |

## 7. Security policies (`/settings/security/policies`)
| ID | Function | How | Status |
|---|---|---|---|
| SP-01 | Page shows idle timeout, absolute timeout (minutes/hours), max concurrent sessions, help texts | U | ⏳ read-only |
| SP-02 | Validation: idle 1–1440, absolute 1–43200, max sessions 1–1000 (out-of-range values refused, nothing saved) | A+U | ⏳ (refused saves only) |
| SP-03 | Max concurrent sessions enforced: newest login evicts the oldest | A | 🔒 tenant-wide |
| SP-04 | Idle / absolute timeout enforced | A | 🔒 tenant-wide, slow |
| SP-05 | A non-admin cannot open the page | U | ⏳ |

## 8. Login history (`/settings/security/login-history`)
| ID | Function | How | Status |
|---|---|---|---|
| LH-01 | List columns, count, load more; filters user / status / from-to, apply, reset | U | ⏳ |
| LH-02 | Expired sessions not shown as Active (NDC-2418) | A | ❌ 306 of 346 past expiry |
| LH-03 | Clear one session → that token stops working | A | ✅ |
| LH-04 | Clear all sessions for a picked user (test user 1 only) | A+U | ⏳ |
| LH-05 | Export CSV: all / filtered; XLS/XLSX marked "soon" | U | ⏳ |
| LH-06 | View self / team / all: each level sees only its rows | A | ⏳ |
| LH-07 | Denied all view permissions → no list, no export (NDC-613) | A | ✅ · link in Setup ⏳ screen |

## 9. Audit log (`/settings/security/audit-log`)
| ID | Function | How | Status |
|---|---|---|---|
| AU-01 | Record create / update / delete logged in seconds, with who and what (NDC-2381) | A | ✅ |
| AU-02 | Setup changes logged: profile, field permission, override (NDC-1343) | A | ✅ |
| AU-03 | More entities: org unit, teamspace, workflow rule, user suspend, hierarchy mode | A | ⏳ (from the other cases' changes) |
| AU-04 | Sign-outs name the user | A | ✅ |
| AU-05 | Filters entity / user / action / time; paging; open an entry and its link | U | ⏳ |
| AU-06 | Entities filter has no duplicates on screen (NDC-2293, NDC-1344) | M | ⏳ (API list clean) |
| AU-07 | "View own" user sees only own events; "view all" sees everyone's | A | ⏳ |

## 10. Personal settings (as test user 1, every value put back)
| ID | Function | How | Status |
|---|---|---|---|
| PS-01 | Account information: edit name / alias / website, save, reload | U | ⏳ |
| PS-02 | Locale: language (English ⇄ Arabic RTL), country, date/time format, time zone | U | ⏳ |
| PS-03 | Name format | U | ⏳ |
| PS-04 | Profile photo upload / remove | U | ⏳ |
| PS-05 | Change password — validation only: mismatch, same as current, weak | A+U | ⏳ (no real change) |
| PS-06 | Change password for real, then back | — | 🔒 password history may block going back |
| PS-07 | Wallet number save; working shift shown | U | ⏳ |

## 11. Teamspace access (approved optional) and Referral Code (read-only)
| ID | Function | How | Status |
|---|---|---|---|
| TS-01 | CRM Admin not on the list cannot open (NDC-1172) | A | ⏳ |
| TS-02 | Other profile not on the list cannot open (NDC-1699) | A | ⏳ |
| TS-03 | Member without admin rights cannot change the teamspace (NDC-1701) | A | ⏳ |
| RC-01 | Referral Code page: connection, team mapping, schedule, run history, webhook — read only | M | ⏳ |

## 12. Zoho comparison (read-only, org943261092)
For every failure and every function TAVI lacks: same screen in Zoho (Users, Profiles, Roles, Security Policies, Login
History, Audit Log, Field-level security), side-by-side image. Missing functions go to the gap list, not the bug list.

## Size
~85 cases: 17 done today, 3 failed (open bugs), ~60 to run, 6 need your OK. Mostly new automation (classes are kept in
`automation/src/test/java/qa/features/crmaccess/`).

## Run rule from now on
One owner sign-in per JVM run, all classes in one suite, so the owner account is not rate-limited again (429 on 25 Oct).

## Gate 1 (v2) — answers, 25 Oct 2026
- Scope: full feature retest (this list), approved to run.
- Invitations (US-03..05): use a REAL inbox the user will name (not yet given) — run last, after the address arrives.
- Security policy enforcement (SP-03/04): change the tenant session limits briefly and restore; team has been told; run today as the last short block.
- Irreversible actions (US-13 remove/delete/anonymise, PS-06 real password change): skipped, listed as not tested (need a disposable user).
