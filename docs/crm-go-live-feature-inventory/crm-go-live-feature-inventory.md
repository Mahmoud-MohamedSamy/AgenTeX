# TAVI CRM go-live feature inventory

Every feature Zoho CRM Enterprise offers, set against what TAVI CRM ships today, with the tests and open Plane items we already have for each one. Use it to plan the full retest before go-live and to agree which missing features are in go-live scope.

**Totals:** 121 features — Built 64 · Partly built 18 · Coming soon 7 · Missing 24 · Out of scope 1 · TAVI only 7. Retest priority: P0 42 · P1 35 · P2 12 · nothing to test 32.

## How to read it

- Built: the screen and the API both exist and the feature can be tested end to end.
- Partly built: some of it exists; the row says exactly what is missing.
- Coming soon: the build shows the menu item or option, but it only says "Coming soon" or is greyed out.
- Missing: no screen and no API (the probed route returns 404). Nothing to test until it is built.
- TAVI only: TAVI has it and Zoho CRM does not (travel-business modules, directory sync, flights).
- Out of scope: a separate product or Plane module (for example the mobile app).
- P0: retest before go-live, daily-use or blocking. P1: retest. P2: smoke check only. —: nothing to test yet.
- Open Plane items: unresolved items in the NDC project, CRM module, on 25 Oct 2026 (155 open). "RFT" means Ready For Test now.

## Retest plan

### Wave 1 — Access and security first

Every other result depends on the right user seeing the right records. Several urgent access bugs are still open, so retest these first.

- Sign-in, sessions and login history (U11): NDC-2418, NDC-613.
- Profiles, permissions, org units, hierarchy preference, reporting hierarchy (U04–U06): rerun the crmhierarchy suite, plus NDC-2412, 2413, 2414, 2416 (urgent).
- Field permissions are not enforced (C06): NDC-1337 (urgent), NDC-1593.
- Audit log records nothing after 20 Oct (U12): NDC-2381 (urgent).
- Users: invite, suspend, remove, plus the Referral Code directory sync (U01, U03): NDC-2492.

### Wave 2 — Daily record work

What sales and operations users do all day on Leads, Customers, Agency Code, Transactions and the travel modules.

- Create, edit and delete a record in all 15 modules, including the record page, notes, attachments and timeline (R01–R05, R12–R17).
- Views: list, custom views, kanban, split, and filters (R28–R33). 11 custom-view items are Ready For Test.
- Search, tags, lead conversion and pipelines (R18, R19, R34, C11): NDC-2382 and NDC-1302 are urgent.
- Mass delete, recycle bin and import with history (R23, R35, R38).
- Work Queue and My Approvals / My Reviews (S01): NDC-1819 and NDC-1837 are Ready For Test.

### Wave 3 — Automation chain

Already automated: rerun the crm-order suite instead of testing by hand, then check the open items.

- Workflow rules and actions, assignment, review, approval, blueprint (A01–A07): suite crm-order in automation/.
- Open: NDC-2419 (assignment sets no owner), 2421 and 2420 (Ready For Test), 2391, 2510, 2511, 2334.
- Google Sheets sync (A14): NDC-2314…2320.
- Gaps already filed: NDC-2294 (12 items).

### Wave 4 — Email, channels and reminders

These features reach customers. Each one needs a real inbox, phone or form to prove it works.

- Email: connections, compose, inbox and templates (M01, M02, C14). Gmail and Microsoft 365 cannot be connected (NDC-1141).
- Web forms (M06): NDC-1488 is Ready For Test. The public form returned 404 in earlier runs, so check that first.
- SMS and WhatsApp, telephony, notifications, activity reminders, calendar, portals (M04, M05, M07, M09–M11).

### Wave 5 — Setup and integrations

Admin screens. They change less often, but a broken layout save blocks every module.

- Modules & fields and layouts (C01, C02): urgent NDC-1693, 1863, 1864, 1335 and high 2383, 2384, 2423.
- Validation rules, layout rules, dependencies, formula, rollup, unique fields (C03–C09).
- CRM ⇄ Desk integration (I01): rerun the crmdeskintegration suite, NDC-2392…2410.
- Reports and dashboards (S02, S03): no reports are saved on staging, so build test reports first.
- Company settings, business hours, fiscal year, API clients, AI, billing, storage (G01–G03, I02, S05, S06, I05): smoke checks.

### Decide scope — not built yet

31 features are missing or only say "Coming soon". They cannot be retested. The team needs to decide which of them must ship before go-live (NDC-2031 / NDC-2032, Week 3).

- Record tools that show "Coming soon": export, mass update menu, mass convert, mass email, deduplicate, drafts, approve records, sheet and print views.
- Missing features most likely needed for go-live: multiple currencies, export, recurring activities, undo import, data-sharing rules, groups.
- Missing Zoho modules: quotes, invoices, products, price books, vendors, campaigns, forecasts, solutions, documents.
- Missing automation: scoring rules (NDC-2030), cadences, macros, schedules.
- Not planned or a separate product: territories, sandbox, GDPR, canvas, wizards, web tabs, marketplace, feeds and chat (NDC-2028/2029).

## Feature matrix

### Records

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| R01 | Leads | Lead records, status, source, conversion | Built | Module "leads" (primary, hierarchy visibility); 10 layouts, 564 fields on staging | AEO, HP | NDC-2412, NDC-2413, NDC-1193 | P0 |
| R02 | Contacts (renamed "Customers") | Contacts linked to accounts, opt-out | Built | Module "contacts", label Customers | CDI | NDC-2295 | P0 |
| R03 | Accounts (renamed "Agency Code") | Companies with parent hierarchy | Built | Module "accounts", label Agency Code; no parent-account hierarchy seen | — | — | P0 |
| R04 | Deals (renamed "Transactions") + pipelines | Stages, amount, probability, multiple pipelines (20) | Built | Module "deals" (final module), pipelines + stage probability (17 stages). On 25 Oct the Transactions list was still "Loading records…" after 7 s and the page title showed the module id | AEO | NDC-2382, NDC-1302, NDC-1312, NDC-1316, NDC-1324, NDC-2386 | P0 |
| R05 | Tasks / Calls / Meetings | Activities with reminders, recurrence, participants | Built | 3 activity modules; Call Logs page; meetings "invited" related list | AEO (Tasks) | — | P0 |
| R06 | Recurring activities | Daily/weekly/monthly/yearly repeat | Missing | No recurrence strings or API found in the bundle | — | — | — |
| R07 | Cases | Support cases with escalation | Partly built | Module "cases" exists as a plain module; no case escalation rules | — | — | P1 |
| R08 | Sales Orders / Purchase Orders | Line items, totals, conversion, stock | Partly built | Modules exist with line-item subforms; no SUM over subform rows, so Sub Total / Grand Total cannot be built | — | NDC-2536 | P1 |
| R09 | Quotes, Invoices, Products, Price Books, Vendors | Full inventory suite with PDF templates | Missing | Not in the module list (15 modules); no inventory templates | — | NDC-2031 | — |
| R10 | Campaigns | Campaign module with members and ROI | Missing | No Campaigns module; "Add to Campaigns" is a Coming-soon menu item. SMS/WhatsApp campaigns exist under SMS (T) | — | NDC-2031 | — |
| R11 | Solutions, Documents, Forecasts, Visits, Projects, Services/Appointments | Built-in Zoho modules | Missing | None built as Zoho modules. A custom "Services" module and "Agency", "Subscriptions", "Daily Move", "NDCAgencies" exist | — | NDC-1484, NDC-2031 | — |
| R12 | Custom business modules (Agency, Services, Subscriptions, Daily Move, NDCAgencies) | — | TAVI only | Org-specific modules for the travel business | — | NDC-1484 | P0 |
| R13 | Create / edit / clone / delete record | Full form, quick create, clone, inline edit | Built | /modules/:id/records/new, record page, bulk API | — | NDC-1832, NDC-1834, NDC-1193 | P0 |
| R14 | Record detail page | Overview, timeline, related lists, business card | Built | Tabs, related lists API, notes, attachments, timeline feed, stage history, usage stats. Check: lead eec80974 is returned by the list API but its record page says "Record not found" (404) | — | NDC-1948 | P0 |
| R15 | Notes | Rich notes with mentions and replies | Built | /records/:id/notes and timeline notes | — | NDC-1948 | P0 |
| R16 | Attachments | Files on a record | Built | /records/:id/attachments | CDI | NDC-2295 | P0 |
| R17 | Timeline | Field changes, emails, automation runs | Built | Timeline feed + admin visibility policy page | AEO | NDC-2321 | P1 |
| R18 | Tags | Colour tags; 10 per record, 100 per module | Built | Record tags, bulk tag jobs, tag usage, Manage Tags action | — | — | P1 |
| R19 | Lead conversion + mapping | Contact/Account/Deal, field mapping, matching | Built | Convert page, conversion config with 11 targets | AEO | NDC-2296, NDC-2297, NDC-2388, NDC-1823 | P0 |
| R20 | Mass convert | Bulk conversion | Coming soon | Menu item shows "Coming soon" | — | NDC-1197 | — |
| R21 | Merge records | Find and merge, choose master | Partly built | Merge API (/records/:id/merge) exists; "Deduplicate" menu item is Coming soon; no find-duplicates route | — | NDC-1197 | P1 |
| R22 | Mass update | Bulk field update | Partly built | Mass-update API exists; menu item shows "Coming soon" — check whether another entry point is wired | — | NDC-1316, NDC-1197 | P1 |
| R23 | Mass delete | Delete by selection or criteria | Built | Delete Selected + Mass Delete by criteria page, background jobs | — | NDC-1216, NDC-1224, NDC-1795 | P0 |
| R24 | Mass transfer / change owner | Move records between owners | Partly built | Change owner picker on record; no mass transfer screen | — | — | P1 |
| R25 | Mass email from list | Template email to selection | Coming soon | Menu item shows "Coming soon" | — | NDC-1197 | — |
| R26 | Record locking | Lock rules by criteria | Partly built | Record-locks API; screen not found in Setup | AEO | — | P2 |
| R27 | Record sharing (manual) | Share one record with users/roles | Missing | No share-record UI or API found | HP | — | — |
| R28 | List view | Columns, sort, count, per page | Built | List preferences, manage columns, sort, pagination | CV | NDC-2136, NDC-2124 | P0 |
| R29 | Custom views | Saved criteria views, sharing, default | Built | Views new/edit/manage/clone/pin | CV | NDC-2098…2131 (RFT), NDC-2280 | P0 |
| R30 | Kanban view | Cards by picklist, drag to update | Built | Kanban kind, board summary, board position | CV | NDC-2137, NDC-2282 | P1 |
| R31 | Split view | — | TAVI only | Split view with per-split criteria | CV | — | P2 |
| R32 | Canvas / sheet / map / chart / print views | Alternative list views | Coming soon | Sheet View and Print View are Coming soon; a chart-style view shows "This view is coming soon" | — | NDC-1197 | — |
| R33 | Advanced filters | System filters, field filters, activity/email filters | Partly built | Field filters work; "System defined" filters (Activities, Campaigns, Locked, Touched…) are greyed with "coming in a future update" | CV | — | P1 |
| R34 | Global search | All modules, # for name/tags, 3-char minimum | Built | /search page and /search API (results grouped by module) | — | — | P0 |
| R35 | Import wizard + history | CSV/XLSX, mapping, duplicates, undo, history | Built | Import page, drafts, history; trigger-automation option | AEO | NDC-2385, NDC-1593, NDC-1599, NDC-1554, NDC-2302, NDC-2419 | P0 |
| R36 | Undo import | Undo added records within 30 days | Missing | Not found in the import strings or API | — | — | — |
| R37 | Export records | CSV export of a module or view | Coming soon | "Export" menu item is Coming soon; GET /records/export timed out (504) | — | NDC-1197 | — |
| R38 | Recycle bin | 60-day restore, purge | Built | Recycle bin page, items, jobs, restore | — | NDC-1597, NDC-1600, NDC-1601, NDC-1602, NDC-1603, NDC-1797 | P0 |
| R39 | Drafts | — | Coming soon | "Drafts" menu item is Coming soon (import drafts do exist) | — | — | — |
| R40 | Approve records (web form / import hold) | Records held for manual approval | Coming soon | "Approve <module>" menu item is Coming soon | — | — | — |

### Customization

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| C01 | Modules and fields | Custom modules (200), field types, limits | Built | Modules & Fields, 37 data types incl. formula, rollup, subform, lookup, multi-lookup, camera, location, map | — | NDC-1693, NDC-2384, NDC-1863, NDC-1864, NDC-1873, NDC-1444, NDC-1598 | P0 |
| C02 | Page layouts | Several layouts per module, per profile | Built | Layouts: clone, set default, assignments, reassign records, record usage | — | NDC-2383, NDC-2423, NDC-1335, NDC-492 | P0 |
| C03 | Layout rules | Show/hide, mandatory by field values | Built | Layout-rules API + builder (0 rules on Leads today) | — | — | P1 |
| C04 | Validation rules | Block save on criteria; on picklists too | Partly built | Validation-rules API + builder; refuses rules on picklist fields | — | NDC-2536 | P1 |
| C05 | Picklist dependency | Child values depend on parent | Built | Dependency maps API (0 on Leads) | — | — | P1 |
| C06 | Field permissions | Read/write/hidden per profile | Partly built | Field-permissions page + effective API; not enforced | — | NDC-1337, NDC-1593 | P0 |
| C07 | Formula fields | Number/string/date/boolean, 20 per module | Partly built | Formula type exists; no SUM over subform rows, no formula in subform | — | NDC-2536 | P1 |
| C08 | Rollup summary | SUM/AVG/COUNT over related records | Built | Rollup data type | — | NDC-1444 | P1 |
| C09 | Unique fields / duplicate check | Unique on text/email/phone, 2 per module | Built | Unique peers API; layout builder does not persist "Mark as unique" | AEO | NDC-2423, NDC-1603 | P0 |
| C10 | Custom buttons and links | Buttons/links on record and list | Built | Buttons + links APIs (0 on Leads) | — | — | P2 |
| C11 | Pipelines | Per-layout stage sets | Built | Settings › Pipelines, stages, clone, default | — | NDC-2386, NDC-2382 | P0 |
| C12 | Teamspaces and folders | Team modules, folders, access | Built | Teamspaces, folders, attach modules, access mode | — | NDC-1172, NDC-1689…1701 | P1 |
| C13 | Data types and capabilities | — | TAVI only | Custom data types and per-type capabilities admin | — | NDC-1232 | P2 |
| C14 | Email templates and signature | Template builder, merge fields, folders | Built | 33 email templates, signature page | — | — | P1 |
| C15 | Inventory / mail-merge templates | PDF templates for quotes/invoices, Word merge | Missing | Not found | — | — | — |
| C16 | Translations / rename modules | Translate labels, export language file | Partly built | Modules renamed (Customers, Agency Code, Transactions); Arabic UI shipped; no translation editor for org labels | — | NDC-2130, NDC-2131 | P1 |
| C17 | Home page customization | Role-based home with components | Partly built | Home with add-component dock; some component types Coming soon | — | NDC-1476, NDC-2027, NDC-163 | P1 |
| C18 | Canvas, wizards, kiosk, web tabs | Designed pages, multi-step forms, flows, embedded tabs | Missing | Not found; /web-tabs 404 | — | NDC-2032 | — |
| C19 | Multiple currencies | Home + other currencies with rates | Missing | One company currency, no rate list; /currencies 404 | — | NDC-2536 | — |
| C20 | Skills | — | TAVI only | Skills catalog, per-user skills, suggestions | — | — | P2 |

### Users & security

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| U01 | Users (invite, suspend, remove) | Add, import, deactivate, delete with transfer | Built | Users page; 9 CRM users; suspend / reactivate / remove | AEO | NDC-2411 | P0 |
| U02 | Import users | Bulk add, 1,000 rows | Missing | Not found (directory sync below covers part of it) | — | — | — |
| U03 | Referral Code Integration (directory sync) | — | TAVI only | Daily sync of ambassador/sales directory into CRM users, webhook, run log | — | NDC-2492 | P0 |
| U04 | Profiles and permissions | Module CRUD, tools, setup permissions | Built | 42 profiles, permission tree, user overrides with history | HP | NDC-2414 | P0 |
| U05 | Roles / org units and hierarchy | Role tree, superiors see subordinates | Built | Org units (62), hierarchy preference role/reporting | HP | NDC-2412, NDC-2413, NDC-2415, NDC-2417 | P0 |
| U06 | Reporting hierarchy | Manager-based hierarchy | Built | Personal reporting hierarchy page | HP | NDC-2416 | P0 |
| U07 | Data sharing rules | Default org sharing + rules per module | Partly built | Record visibility per module (public/hierarchy); no sharing rules | HP | NDC-2417 | P1 |
| U08 | Groups | User groups for sharing and approvals | Missing | No groups API (/iam/groups 404); teams exist via Desk | — | — | — |
| U09 | Territory management | Territory hierarchy and assignment | Missing | /territories 404 | — | — | — |
| U10 | Security policies | Password, session, IP rules | Built | Security Policies page | — | — | P1 |
| U11 | Login history and sessions | Who logged in, when, from where | Built | Login history page and API; active sessions panel. On 25 Oct the page timed out and fell back to Home once — recheck | — | NDC-2418, NDC-613 | P0 |
| U12 | Audit log | User + setup actions, 3 years, export | Built | Audit log page, events, facets | — | NDC-2381, NDC-2293, NDC-1343, NDC-1344 | P0 |
| U13 | GDPR / consent / data privacy | Consent, lawful basis, data subject rights | Missing | Not found | — | — | — |
| U14 | Sandbox / copy customization | Test copy of production, deploy | Missing | /sandboxes 404 | — | — | — |
| U15 | Personal settings | Account, locale, name format, photo, password | Built | 6 personal pages | — | — | P1 |

### Automation

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| A01 | Workflow rules | Create/edit/date triggers, conditions, actions, schedules | Built | 42 rules; triggers on create, update, field change, date-relative; executions log | AEO | NDC-2391, NDC-2421, NDC-2510, NDC-2511, NDC-2322, NDC-2323 | P0 |
| A02 | Workflow actions | Email, task, field update, webhook, function, tags, assign owner | Built | Email, Task, Field Update, Webhook, Create Record, Owner Assignment, Tags, Custom Function, Update Related, Slack/Teams/Google Chat | AEO | NDC-2294 | P0 |
| A03 | Workflow execution log | Usage reports per rule | Built | Settings › Workflow executions (list + detail) | AEO | — | P1 |
| A04 | Assignment rules | Round robin / criteria for import, form, API | Built | 12 rules | AEO | NDC-2419, NDC-2298, NDC-2411, NDC-2422 | P0 |
| A05 | Approval processes | Multi-level approvals | Built | 19 processes; My Approvals page | AEO | NDC-2296, NDC-2308, NDC-2334 | P0 |
| A06 | Review processes | Field-level review of new records | Built | 6 processes, 3 rejection reasons; My Reviews page | AEO | NDC-2297, NDC-2309 | P0 |
| A07 | Blueprints | State transitions with SLA | Built | Per-module blueprints with versions, draft, publish (1 on Deals) | AEO | NDC-2420, NDC-2334 | P0 |
| A08 | Custom actions (developer) | Deluge functions | Partly built | Custom actions with sources, variables, runs, bulk runs (0 defined) | — | — | P2 |
| A09 | Schedules | Run a function on a schedule | Missing | /workflow/schedules 404 | — | — | — |
| A10 | Scoring rules | Points from criteria and touch points | Missing | No route or API (404) | — | NDC-2030, NDC-1483 | — |
| A11 | Cadences | Multi-step follow-ups | Missing | 404; "Cadences" system filter greyed | — | — | — |
| A12 | Macros | User-run action bundles | Missing | 404 (Desk has macros, CRM does not) | — | — | — |
| A13 | Assignment threshold / case escalation / CommandCenter | Caps, escalation, journeys | Missing | Not found | — | NDC-1486 | — |
| A14 | Google Sheets sync | — | TAVI only | Google Sheet integration (connections, tabs, sync runs) | — | NDC-2314…2320 | P1 |

### Communication

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| M01 | Email connections | IMAP/POP, Gmail, M365, Zoho Mail | Partly built | Zoho Mail + SMTP connected; Gmail and Microsoft 365 cannot be connected | — | NDC-1141, NDC-1479 | P0 |
| M02 | Send and receive email from records | Compose, threads, tracking | Built | Compose, inbox, threads, drafts, tracking, engagement per record | AEO (E-04) | NDC-2496 | P0 |
| M03 | Mass email | Template email to a view | Coming soon | Coming soon | — | NDC-1197 | — |
| M04 | SMS and WhatsApp | Notification SMS, WhatsApp Business | Built | SMS page: templates, campaigns, sender IDs, suppressions, webhooks, credits (no sender IDs yet) | — | NDC-1482 | P1 |
| M05 | Telephony | Built-in + PhoneBridge providers, click-to-call | Partly built | Providers generic + Ziwo shipped, 3CX coming soon; no integration configured; call logs page | — | NDC-1949, NDC-1944, NDC-1493…1498 | P1 |
| M06 | Web forms | Web-to-lead/contact/case, captcha, rules | Built | 3 forms on staging; public form returned 404 in earlier runs | AEO (blocked) | NDC-1488 (RFT) | P0 |
| M07 | Portals | Customer / partner portals | Built | Record portals page (0 portals) | — | — | P1 |
| M08 | Social, chat, SalesSignals, SalesInbox | Social tab, live chat, signals | Missing | Not in CRM; /social, /chat, /community, /knowledge-base and /analytics routes redirect to Home; omnichannel chat planned | — | NDC-2028, NDC-2029, NDC-1480, NDC-1481 | — |
| M09 | Notifications | Bell, preferences per channel | Built | Bell with unread count and preferences (4 channels); the /notifications page itself redirects to Home | — | — | P1 |
| M10 | Activity reminders | Email / pop-up before activities | Built | Activity Reminders settings | — | NDC-1333 | P1 |
| M11 | Calendar | Day/week/month, shared, sync | Built | /calendar page (no calendar sync) | — | — | P1 |

### Sales & analytics

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| S01 | Work Queue / My Requests | Workqueue, My Jobs | Built | Work queue sections; My Requests redirects home; My Approvals / My Reviews pages | — | NDC-1819, NDC-1837, NDC-1788, NDC-1789, NDC-1950 | P0 |
| S02 | Reports | Tabular/summary/matrix/joined, schedules, export | Built | Report builder, joined reports, scheduled reports (0 reports saved on staging) | — | — | P0 |
| S03 | Dashboards | Components, filters, drill-down, export | Built | Dashboard builder + view, templates; some component types Coming soon | — | — | P0 |
| S04 | Forecasts / quotas | Targets by hierarchy | Missing | /forecasts 404 | — | — | — |
| S05 | Zia / AI | Ask Zia, predictions, enrichment | Partly built | AI Features, AI Health, AI Credits pages; AI policy is off; agents usage | — | — | P2 |
| S06 | Billing and credits | Licences, add-ons | Built | Billing: wallets (AI, SMS, WhatsApp), packs, invoices; buy flow says Coming soon in places | — | — | P1 |
| S07 | Flights / bookings | — | TAVI only | Routes /v2/flights/search and /v2/bookings are in the build, but both redirect the owner to Home — not reachable in CRM today | — | — | P2 |

### Integrations

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| I01 | CRM ⇄ Desk integration | Desk tickets on CRM records, contact sync | Built | Settings › CRM ⇄ Desk Integration, Desk page in CRM | CDI | NDC-2392…2410, NDC-2295 | P0 |
| I02 | API integration (clients) | OAuth clients, REST API | Built | Settings › API Integration, records ingest clients (0 clients) | AEO | NDC-1193 | P1 |
| I03 | Webhooks (inbound / notification API) | Watch API, webhook actions | Partly built | Workflow Webhook action; no notification/watch API (/webhooks 404) | — | — | P2 |
| I04 | Marketplace / Google / Microsoft / QuickBooks / LinkedIn | Extensions and app integrations | Missing | Only Facebook, LinkedIn, TikTok lead-ads integration paths found; no marketplace | — | — | — |
| I05 | Storage | File storage limits | Built | Usage overview, buckets & S3, storage requests | — | NDC-1487 | P2 |

### General

| ID | Feature | Zoho CRM (Enterprise) | TAVI status | What TAVI has today | Existing spec / automation | Open Plane items | Retest |
|---|---|---|---|---|---|---|---|
| G01 | Company details | Name, logo, address, currency, time zone | Built | Company Settings › Details | — | — | P1 |
| G02 | Business hours | 24×7 / custom | Built | Business hours page (7 active days) | AEO | — | P1 |
| G03 | Fiscal year | Standard or custom | Built | Fiscal year page | — | — | P2 |
| G04 | Holidays | Org holiday list | Missing | /iam/tenant/holidays 404 | — | — | — |
| G05 | Language, region, RTL | Arabic, RTL, formats | Built | Arabic strings in the bundle, locale page | CV | NDC-2130, NDC-2131 | P1 |
| G06 | Keyboard shortcuts / command menu | Global shortcuts | Built | Command palette, shortcut help | — | — | P2 |
| G07 | Feeds / internal chat | Collaboration stream | Missing | Not in CRM | — | NDC-2028, NDC-1481, NDC-322 | — |
| G08 | Mobile app | iOS / Android | Out of scope | Separate "Mobile APP" Plane module — out of this list | — | — | — |
| G09 | Performance | — | Built | Load tests planned | — | NDC-880, NDC-879, NDC-872 | P1 |

## Not built yet (input for NDC-2031 / NDC-2032)

- R06 Recurring activities — Missing. No recurrence strings or API found in the bundle
- R09 Quotes, Invoices, Products, Price Books, Vendors — Missing. Not in the module list (15 modules); no inventory templates
- R10 Campaigns — Missing. No Campaigns module; "Add to Campaigns" is a Coming-soon menu item. SMS/WhatsApp campaigns exist under SMS (T)
- R11 Solutions, Documents, Forecasts, Visits, Projects, Services/Appointments — Missing. None built as Zoho modules. A custom "Services" module and "Agency", "Subscriptions", "Daily Move", "NDCAgencies" exist
- R20 Mass convert — Coming soon. Menu item shows "Coming soon"
- R25 Mass email from list — Coming soon. Menu item shows "Coming soon"
- R27 Record sharing (manual) — Missing. No share-record UI or API found
- R32 Canvas / sheet / map / chart / print views — Coming soon. Sheet View and Print View are Coming soon; a chart-style view shows "This view is coming soon"
- R36 Undo import — Missing. Not found in the import strings or API
- R37 Export records — Coming soon. "Export" menu item is Coming soon; GET /records/export timed out (504)
- R39 Drafts — Coming soon. "Drafts" menu item is Coming soon (import drafts do exist)
- R40 Approve records (web form / import hold) — Coming soon. "Approve <module>" menu item is Coming soon
- C15 Inventory / mail-merge templates — Missing. Not found
- C18 Canvas, wizards, kiosk, web tabs — Missing. Not found; /web-tabs 404
- C19 Multiple currencies — Missing. One company currency, no rate list; /currencies 404
- U02 Import users — Missing. Not found (directory sync below covers part of it)
- U08 Groups — Missing. No groups API (/iam/groups 404); teams exist via Desk
- U09 Territory management — Missing. /territories 404
- U13 GDPR / consent / data privacy — Missing. Not found
- U14 Sandbox / copy customization — Missing. /sandboxes 404
- A09 Schedules — Missing. /workflow/schedules 404
- A10 Scoring rules — Missing. No route or API (404)
- A11 Cadences — Missing. 404; "Cadences" system filter greyed
- A12 Macros — Missing. 404 (Desk has macros, CRM does not)
- A13 Assignment threshold / case escalation / CommandCenter — Missing. Not found
- M03 Mass email — Coming soon. Coming soon
- M08 Social, chat, SalesSignals, SalesInbox — Missing. Not in CRM; /social, /chat, /community, /knowledge-base and /analytics routes redirect to Home; omnichannel chat planned
- S04 Forecasts / quotas — Missing. /forecasts 404
- I04 Marketplace / Google / Microsoft / QuickBooks / LinkedIn — Missing. Only Facebook, LinkedIn, TikTok lead-ads integration paths found; no marketplace
- G04 Holidays — Missing. /iam/tenant/holidays 404
- G07 Feeds / internal chat — Missing. Not in CRM

## Sources and method

- TAVI build: the full JS bundle of staging-crm.taviportal.com (346 chunks): 160+ screen routes, 656 API calls, 28 English locale files, the "Coming soon" and "under construction" markers.
- TAVI live API, read-only GETs as the owner: Setup menu, 15 modules, profiles, users, org units, rules, processes, forms and settings, plus 40 probes for Zoho features (404 = no server support).
- TAVI screens: each of the 90 pages opened once in a headless browser on 25 Oct. 80 loaded; 9 routes (notifications page, analytics, social, chat, community, knowledge base, bookings, flights, one reporting-hierarchy link) redirect to Home or Setup; staging returned some 503s during the run, so slow pages were noted for recheck, not as gaps.
- Zoho CRM: 429 features from Zoho help, API docs and edition pages; Setup menu and tabs of org943261092 (Enterprise trial, ends 2 Nov 2026) read in Edge.
- Plane: all 155 open CRM-module items, plus the gap lists NDC-2294, NDC-2417, NDC-2536, NDC-2019/2031/2032.
- Existing coverage: specs in docs/ (automation execution order, CRM ⇄ Desk, hierarchy preference, custom views) and the automation features crmautomationorder, crmdeskintegration, crmhierarchy.
