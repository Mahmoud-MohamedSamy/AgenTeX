# Round 2 · Phase 0 · What changed in the new build

27 Oct 2026 · staging-crm.taviportal.com · old build `index-BWLZ8sns.js` (25 Oct copy, 346 files) → new build `index-De3hTVb3.js` (384 files).
Method: both bundles read as text (never run); every route, path-like string, permission key, "coming soon / in development" marker and English UI text compared.
Files: `old.json` / `new.json` (routes, API calls, permissions, markers, strings), `old-paths.json` / `new-paths.json`, `strings-diff.json`, `scripts/`.

## Summary
| Area | Change |
|---|---|
| Screens (routes) | 162 → 162, none added or removed |
| API paths | 6 new, 0 removed (an earlier "41 removed" was a crawler gap, fixed) |
| Permission keys | 3 new, 0 removed |
| "Coming soon / in development" markers | unchanged (16) |
| English UI texts | 116 new, 60 removed (half of the new ones are country / US-state names) |
| Chunks | Reports and dashboards page chunk shrank from 1.39 MB to 0.87 MB (see Reports and dashboards) |

## New in the build, by feature
| Change | Feature | Wave | In the inventory? |
|---|---|---|---|
| AI agents get access per custom view: `GET/PUT/DELETE /modules/{m}/views/{v}/agent-grants/{…}`, `GET /agents`, permissions `ai:agent:manage`, `ai:summary:view`; a new built-in profile "AI Agent" (rank 10) appears on Profiles | S05 AI (and R29 custom views, U04 profiles) | 5 (and 1, 2) | Partly: AI agents per view are new |
| Report time zone: `/reporting/report-time-zone`; "The report's end date must be after its start date." | S02 reports | 5 | Yes |
| Permission key `metadata.modules.manage` | C01 modules and fields / U04 permissions | 5, 1 | Yes |
| "Built-in profiles can't be renamed or deleted. Clone the profile to create one you can change." | U04 profiles (fix for NDC-2543) | 1 | Yes |
| "The approval duration must be between 1 and 168 hours." | A05 approval processes | 3 | Yes |
| Webhook rules: 50 per account, address must answer the check with HTTP 200, public http(s) only, 64 KB trial payload | I03 webhooks / A02 webhook action | 5, 3 | Yes |
| Country and US-state name lists (≈60 names) | G05 language and region / address fields | 5 | Yes |
| `/desk/kb/articles`, `/desk/tickets/{id}`, chat supervision, brands, canned replies, monitors, card images | Desk and Omnichannel, not CRM | — | Out of scope (Desk) |
| "File passwords are not available on this installation, so the schedule was not saved with one." | S02 scheduled reports | 5 | Yes |

## Removed from the build
| Change | Feature | Wave | Note |
|---|---|---|---|
| Dashboard share and public links, "Export dashboard", "Email this dashboard", report email schedules (list, run now, last run, delete schedule), workspace variables, "Web content is turned off" | S02 reports, S03 dashboards | 5 | The texts are gone from the CRM build; the dashboards chunk is 0.5 MB smaller. Check on screen in Wave 5 — if gone, these are now gaps vs Zoho (Zoho has dashboard share, export and scheduled reports) |
| Chunks `ConvertedLeadView`, `useMentionCandidates` | R19 lead conversion, R15 notes (mentions) | 2 | Merged into other chunks or removed; check the converted-lead view and @mentions in notes |

## Seen on screen during the locator pass
| Screen | Change | Feature | Wave |
|---|---|---|---|
| Settings › Profiles | Now a collapsed hierarchy tree with "Expand all" (CRM Admin and AI Agent at the top); subtitle "Permissions live on the Profiles page" | U04 | 1 |
| Settings › Permissions | The button that said "Create permission" (and opened Create profile, NDC-2547) now says "Create profile" | U04 (NDC-2547) | 1 |
| Setup menu | New "Signals" item under General: it opens the notification preferences page (`/settings/notifications/preferences`) | M09 notifications | 4 |
| Settings › Pipelines | The board now loads (was stuck on "Loading board…", NDC-2386 — In Progress) | C11 | 5 |
| Setup menu for test user 1 | Login History, Profiles and Security Policies links are shown to a user denied those permissions (passed on 25 Oct, NDC-613) | U11, U04 | 1 — possible regression |
| Module page tabs | Validation Rules and Map Dependency are no longer "In Development" (4 tabs left: Layout Rules, Record Locking Configuration, Links, Buttons) | C04, C05 | 5 |
| Workflow Rules list | During the smoke test the list showed "All 0 · No workflow rules yet" right after a rule was created; opened again it lists 42 | A01 | 3 — recheck |
| Blueprint designer | A webhook URL added as an After action was not saved from the screen | A07 / A02 | 3 — verify |
| CRM contact page from Desk | The CRM showed "Sign in CRM" instead of reusing the Desk session | I01 | 5 — check sign-in sharing |

## Not in the inventory
- AI agents with per-view access grants and the "AI Agent" profile (extends S05 AI) — add to the inventory and test in Wave 5.
- Nothing else new; Desk / Omnichannel changes are out of CRM scope.

Locator pass details: `locator-fixes.md`.
