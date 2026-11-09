# Round 2 · Phase 0 · Screen tests on the new build (locator pass)

27 Oct 2026 · run from automation-w3/ (synced with automation/), one JVM at a time, no other java process running. Logs: `runs/<name>/run.log`, `run-summary.json`, `healing-report.json`.

| Suite (account) | Run | Locators | Failures and what they are |
|---|---|---|---|
| crmaccess AccessScreensUiTest (owner) | 11 tests: 9 pass, 2 fail → after the fix 10 pass, 1 fail | no heals | **Test fixed:** Profiles is now a collapsed hierarchy tree ("Expand all"); Permissions shows "Create profile" instead of "Create permission" (NDC-2547 change). Remaining: FP-control (Comment not on the Leads form — known since 25 Oct) |
| crmaccess RestrictedUserUiTest (test user 1) | 3 tests: 2 pass, 1 fail | no heals | **App change, not a locator:** Login History, Profiles and Security Policies links are shown to a user denied those permissions (passed 25 Oct, NDC-613) → Wave 1 to verify (test user 1's profile/managers were also changed by someone on 27 Oct) |
| crmrecords RecordScreensUiTest (owner, no perf) | 4 tests: 2 pass, 1 fail, 1 inconclusive | no heals | Pipelines page now loads (NDC-2386, In Progress) · "+ Task" form OK · "leads created" still (NDC-2627) · deleted-view test inconclusive (Leads list still loading after 60 s, NDC-2136) |
| crmautomationorder UiSmokeTest (owner; A-17, A-10 excluded) | 15 tests: 12 pass, 2 fail, 1 skipped (sweep, by design) | **5 heals, kept** — Rule Name, Name, Blueprint name, Transition name inputs: the self-healer swapped between the role and label candidates (both still match) | F-02: the rule was created but the Workflow Rules list showed "All 0 · No workflow rules yet" during the run; opened by hand afterwards it lists all 42 → recheck in Wave 3 (empty list while loading?). WH-22: the blueprint After-action webhook URL was not saved from the screen (`after={actions=[]}`) → Wave 3 to verify |
| crmsetup SetupScreensUiTest (owner) | 3 tests: 2 pass, 1 fail | no heals | **App change:** only 4 module tabs still "In Development" (Layout Rules, Record Locking Configuration, Links, Buttons) — Validation Rules and Map Dependency are now built (were 6 on 26 Oct) |
| crmdeskintegration ReadUiTest (owner, Desk host) | 16 tests: 11 pass, 5 fail | 1 BROKEN (`CrmRecordPage.filterGroup`) — not a locator problem | 3 known Zoho differences (delete options, "Custom Access" naming, old Failure Log rows with raw ids — NDC-2395). 2 on the CRM contact page: the CRM showed **"Sign in CRM"** instead of the contact — the Desk session is no longer picked up by the CRM; the filter-group "BROKEN" is the same sign-in page → Wave 5 (I01) to check whether sign-in sharing between Desk and CRM changed. First run with the CRM host as base URL gave 401s — wrong launch, ignored |

## Files changed in automation/
- `src/test/java/qa/features/crmaccess/AccessScreensUiTest.java` — expand the Profiles tree first; accept the "Create profile" label on Permissions and record which label is shown (CRLF kept; 6 lines added, 2 changed).
- `src/test/resources/features/crmautomationorder/locators.json` — the 5 heals (candidate order / lastHeal only).
No BROKEN locator needed a fix: every break traced to an app change or a sign-in problem, not to a moved element.
