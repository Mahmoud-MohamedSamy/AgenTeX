# CRM go-live — Wave 5: setup and integrations (parallel part) — report

26 Oct 2026 · staging-crm.taviportal.com (NDC-Staging) · owner account · Zoho CRM org943261092 read-only · Lane C of ../plan.html.
Case facts: `results.md`. Evidence: `evidence/annotated/` (approved layout). Nothing went to Plane.

## Summary
13 tickets retested: 9 pass, 2 still fail, 2 partly. 8 skipped (In Progress). 6 new candidate bugs.

## Tickets
- Pass: NDC-1693 (module create 201 via API; the screen dialog is NDC-2384, In Progress), NDC-1598 (Field Listing layout filter), NDC-1335 (layout save without subform), NDC-1603 (restore with taken unique value refused), NDC-1232 (Data Types sticky header, compact columns), NDC-2130 and NDC-2131 (Arabic strings translated), NDC-492 (Tab Order stored after reload), NDC-1487 (Storage page exists).
- Still fail: NDC-1193 (Customers accepts a blank record although Name is required), NDC-2536 (no second currency; pick-list validation rule accepted but never applied; formulas have no SUM).
- Partly: NDC-163, NDC-2027 (home greets "Welcome ndc-staging-owner" with no time of day, first name or date; no My Company View; pipeline component "in an upcoming update").
- Skipped, In Progress: NDC-2423, 2384, 2383, 1873, 1864, 1863, 1444, 1476.

## New candidate bugs (not in Plane)
| ID | Sev. | What happens | Verified |
|---|---|---|---|
| W5-B1 | Medium | Validation rules are saved but never applied, and any text is accepted as a condition | re-run once |
| W5-B2 | Medium | Reports always show rollup summary fields empty (the record holds 12) | 3 checks over 40 min |
| W5-B5 | Low | Layout access saved through the API is silently ignored; `layouts/assignments` POST 500, GET 405 (the screen works) | re-run once |
| W5-B3 | Low | A teamspace folder name used twice answers 500 instead of 409 | re-run once |
| W5-B4 | Low | An empty dependency map `{}` is saved with all-zero field ids; the dependency isn't checked on record save | re-run once |
| W5-B6 | Low | Plain module delete says "retry with ?cascade=true", then cascade refuses a module that still has records (409) | seen once, not re-run, no image |

## Gaps vs Zoho
Six module tabs "In Development" (Layout Rules, Validation Rules, Record Locking, Map Dependency, Links, Buttons; the APIs exist) · layouts shared per user, not per profile · four dashboard components "Coming soon" (Comparator, Anomaly Detector, Target Meter, Funnel).

## Smaller notes
System-only data types (department, team, support_plan) can be added by API; pipeline listed but refused · a third unique field is accepted (Zoho limit not checked) · a link's label is stored empty · teamspace access mode on create is ignored · data type error names "BaseDatatypeKey" but the API wants `base_datatype_key` · an API-made module gets an empty Default layout and the ingest API drops `name` · Fiscal Year shows "Change history" twice · command palette says "New Leads" · `/billing/me/summary` answers 500 (not used by the page).

## Zoho side
Checked live, read-only: Modules list, Leads module tabs, layout editor, Home, Contacts create form, Currencies, Storage, Teamspace, Recycle Bin, Reports. Not checked (would mean saving in Zoho): Arabic UI, section Tab Order menu, duplicate restore, duplicate folder name, rollup values in a report.

## Left for the serial window
1. CRM ⇄ Desk integration suite (NDC-2392…2410, NDC-2295).
2. Company details, business hours, fiscal year edits.
3. Pipeline settings (blocked while NDC-2386 is open).
4. Schema changes on live modules and the Create Module dialog (mostly In Progress tickets).
5. Not done for lack of time: scheduled reports, report export by email, summary / matrix / joined reports, dashboard filters and drill-down, home component setup, field permissions on the QA module, buttons and links on the record page, ingest API duplicate modes and strict schema.

## Automation
New feature `crmsetup` (merged into automation/): SetupApiTest 10 tests (5 pass, 5 fail = W5-B1, B3, B4, B5, NDC-1193), SetupScreensUiTest 3 tests (2 pass, 1 fails on the module-tabs gap). Suite `crm-wave5.xml`.

## Clean-up
Deleted: QA W5 Module, QA W5 No plural, 8 modules from automation runs, 3 QA teamspaces and folders, the custom data type, QA skills (and test user 1's QA rating), report, dashboard, API client, all QA rules, maps, buttons and links; blank Customers records purged. `after/diff.txt`: module list matches the baseline, no QA W5 objects left.
Left: 24 bin items of the deleted QA modules answer "forbidden" (same as NDC-1797), expire 25 Dec 2026.
Not changed by this lane, found changed: tenant time zone UTC (was Africa/Cairo) and business hours 09:00–17:00 — cause being checked.
One short-lived owner access token was echoed to the console once by a session-load command; not written to disk, expires 15 minutes after issue.
