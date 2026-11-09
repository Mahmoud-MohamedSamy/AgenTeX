# TAVI CRM — missing features (one list)

| | |
|---|---|
| App | TAVI CRM — staging-crm.taviportal.com (tenant NDC-Staging) |
| Reference | Zoho CRM Enterprise (org943261092) |
| Built | 26 Oct 2026 |
| Sources | Go-live feature inventory (25 Oct, [artifact](https://claude.ai/artifact/MJEGa81taaTzj6GUzK5iVz), `crm-go-live-feature-inventory.md`) + every Plane item in project NDC that lists CRM gaps (CRM module: 271 items read, all states; whole project: 1,190 items searched for CRM / Zoho / missing / gap / coming soon) + the local missing lists in `docs/` |
| Scope | Features Zoho CRM has (or the team plan asks for) that TAVI CRM does not have yet. Bugs in features that exist are **not** in this list; they stay in their own tickets |

How to read the tables:

- **Inv.** = row id in the go-live inventory (R = records, C = customization, U = users & security, A = automation, M = communication, S = sales & analytics, I = integrations, G = general). "—" = not in the inventory; found only in Plane.
- **Plane** = the ticket(s) that already ask for it, with the state on 26 Oct 2026. **Not in Plane** = no ticket covers it yet.
- **Type**: Missing = no screen and no API. Coming soon = the menu item exists but only shows "Coming soon". Partly = part of it exists; the row says what is missing.

## Totals

| | Count |
|---|---|
| Missing items in this list | 118 |
| Covered by a Plane ticket | 102 |
| **Not in any Plane ticket** | **16** (marked **Not in Plane** below; summary in [section 9](#9-not-in-any-plane-ticket-yet)) |
| Inventory rows that are out of date (now built) | 5 ([section 10](#10-inventory-rows-that-are-out-of-date)) |

---

## Wonder Travel go-live blockers

Which missing features Wonder Travel (NDC) actually uses in Zoho CRM. Evidence: their Zoho setup copied onto staging on 24–25 Oct (NDC-2536), the 23 copied workflow rules, the Jam of their Agency and Services modules, and the SalesIQ copy (NDC-2544). Their live Zoho CRM (org745682607) was not opened; a read-only audit of it would make this list final.

| Verdict | # | Missing | Evidence | Plane |
|---|---|---|---|---|
| **Blocker** | MS-055 | More than one currency | EGP home + USD, AED, JOD, KWD, OMR, SAR with rates; per-record currency. TAVI has one currency | NDC-2536 (Bug) |
| **Blocker** | MS-057 | Sub Total / Grand Total on Sales and Purchase Orders | SO / PO copied with line-item subforms; no sum → no totals ("Unknown function 'sum'", 26 Oct) | NDC-2536 (Bug) |
| **Blocker** | MS-056 | Validation rules on picklists | Deals "Stage" in C/E/R/S/V; Calls "Outgoing Call Status". 26 Oct: rule created but never applied (W5-B1) | NDC-2536 (Bug), NDC-2535 |
| Workaround | MS-088 | Several conditions in one workflow rule | "Agency Country" (10), "Agency Country 2" (5), "Agency Approval Update" (2) split into 17 rules; works because conditions don't overlap. All copied rules say "Copied from Zoho (inactive)" — check | NDC-2294 |
| Bug, blocks the copy | — | Deal can't move to another pipeline | Their Transactions pipeline | NDC-2621 (Bug) |
| Bug, blocks the copy | — | Picklist validation rule never applied | Same rules as MS-056 | W5-B1 |
| Ask | MS-094 | Gmail / Microsoft 365 connection | Only if they don't send from Zoho Mail / SMTP | NDC-1141, NDC-1479 |
| Ask | MS-014, MS-002 | Mass email, Campaigns | Not visible in the copy | NDC-1197, NDC-2031 |
| Ask | MS-008, MS-009 | Clone record; edit / delete note | Daily-use tools | NDC-2628 |
| Ask | MS-078 | Lead scoring | 20 SalesIQ score rules (NDC-2544); CRM scoring unknown | NDC-2030, NDC-1483 |
| Ask | MS-001 | Quotes, Invoices, Products | Not in the copy; orders use subforms → probably not needed | NDC-2031 |
| After go-live | — | Everything else | Not in the copied setup | — |

---

## 1. Records and list tools

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-001 | Quotes, Invoices, Products, Price Books, Vendors modules | Full inventory suite with PDF templates | Not in the 15 modules | Missing | R09 | NDC-2031 (Backlog) — module list still to be agreed |
| MS-002 | Campaigns module and "Add to Campaigns" | Campaign members and ROI | No module; menu item is Coming soon (SMS/WhatsApp campaigns exist) | Missing | R10 | NDC-2031 (Backlog), NDC-1197 (Backlog) |
| MS-003 | Solutions, Documents, Forecasts, Visits, Projects, Services/Appointments modules | Built-in modules | None as Zoho modules (custom Services, Agency… exist) | Missing | R11 | NDC-2031 (Backlog), NDC-1484 (Bug) |
| MS-004 | My Jobs module | Zoho module | Not built | Missing | — | NDC-1484 (Bug) |
| MS-005 | Case escalation rules | Escalate cases by criteria and time | Cases is a plain module | Partly | R07, A13 | **Not in Plane** |
| MS-006 | Parent account hierarchy | Parent/child accounts | Not seen on Agency Code | Missing | R03 | **Not in Plane** |
| MS-007 | Sub Total / Grand Total on Sales and Purchase Orders | Sum of line items | Line-item subforms exist, no total | Partly | R08 | NDC-2536 (Bug) |
| MS-008 | Clone a record | Clone from record and list | Record menu has only Delete | Missing | — | NDC-2628 (Backlog) |
| MS-009 | Edit or delete a note | Edit / delete notes | Notes can only be added (GET notes → 405) | Missing | R15 | NDC-2628 (Backlog) |
| MS-010 | Attach any file type | Any file | .txt and other types refused | Partly | R16 | NDC-2628 (Backlog) |
| MS-011 | Mass convert | Bulk lead conversion | Coming soon | Coming soon | R20 | NDC-1869 A19 (Done), NDC-1197 (Backlog) |
| MS-012 | Deduplicate / find and merge duplicates | Find duplicates, choose master | Merge API only; menu item Coming soon | Coming soon | R21 | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-013 | Mass transfer of records between owners | Mass Transfer screen | Change owner on one record only | Partly | R24 | NDC-1869 Part B item 11 (Done) — not built as of 25 Oct |
| MS-014 | Mass email from a list | Template email to selection | Coming soon | Coming soon | R25, M03 | NDC-1197 (Backlog), NDC-1869 A19 (Done) |
| MS-015 | Record locking screen | Lock rules by criteria in Setup | API only, no screen | Partly | R26 | NDC-1489 (Backlog) |
| MS-016 | Share one record manually | Share with users / roles | No UI, no API | Missing | R27 | **Not in Plane** |
| MS-017 | Sheet view | Spreadsheet editing | Coming soon | Coming soon | R32 | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-018 | Print view | Print list | Coming soon | Coming soon | R32 | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-019 | Canvas / map / chart list views, print mailing labels, print using canvas | Alternative views | "This view is coming soon" | Coming soon | R32 | NDC-1869 Part B item 11 (Done) |
| MS-020 | Drafts | Saved draft records | Coming soon | Coming soon | R39 | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-021 | Approve records held from web form / import | Manual approval queue | "Approve Leads" Coming soon; import shows Coming soon | Coming soon | R40 | NDC-2628 (Backlog), NDC-2294 (Backlog) |
| MS-022 | Create Client Script | Client scripts | Coming soon | Coming soon | — | NDC-2628 (Backlog), NDC-1197 (Backlog) |
| MS-023 | System-defined filters (Activities, Campaigns, Latest Email Status, Locked, Record Action, Related Records Action, Touched / Untouched, Cadences) | System Defined Filters | Greyed "coming in a future update" | Coming soon | R33 | NDC-2628 (Backlog), NDC-1819 (Bug) |
| MS-024 | Filter By Related Modules | Third filter section | Fields only | Missing | R33 | NDC-1869 B2 (Done), NDC-1819 (Bug) |
| MS-025 | Save the current filter (as a view) | "Save filter" button | Text in the build, no button | Missing | — | NDC-2628 (Backlog), NDC-1869 B1 (Done) |
| MS-026 | Global search on notes and tags (#tag) | Searches notes and tags | Notes and tags not searched | Partly | R34 | NDC-2628 (Backlog) |
| MS-027 | Repeat on the meeting quick-create popup | Repeat on quick create | Only the full form has it | Partly | R05 | NDC-2628 (Backlog) |
| MS-028 | Export selected records from the selection menu | Export Selected Records | Not offered | Missing | — | NDC-1869 Part B item 11 (Done) |

### Custom views and list grid (NDC-1869, state Done — not re-verified on screen)

NDC-1869 is closed in Plane. Wave 2 (26 Oct) still saw MS-025 and MS-023 missing, so the items below should be re-checked before they are treated as done.

| # | Missing | Inv. | Plane |
|---|---|---|---|
| MS-029 | Collapse / expand groups in the view picker | R29 | NDC-1869 A1 |
| MS-030 | Manage custom views grouped by type | R29 | NDC-1869 A2 |
| MS-031 | "Between" / "Not between" for number fields | R29 | NDC-1869 A3 |
| MS-032 | "Starting tomorrow" / "Till yesterday" for dates | R29 | NDC-1869 A4 |
| MS-033 | Fiscal year / fiscal quarter date operators | R29 | NDC-1869 A5 |
| MS-034 | Share a view with roles, roles and subordinates, groups | R29 | NDC-1869 A6 |
| MS-035 | Profile permission to create custom views | R29 | NDC-1869 A7 |
| MS-036 | Separate permission to manage Kanban views | R30 | NDC-1869 A8 |
| MS-037 | Pin (freeze) a column; column header menu (Filter by / Hide / Asc / Desc) | R28 | NDC-1869 A9–A10, NDC-1819 (Bug) |
| MS-038 | Resize column widths + Reset Column Size in module lists (Work Queue has them since 26 Oct) | R28 | NDC-1869 A11, B8 |
| MS-039 | Row actions menu on the left; Add Note from the row; Activity and Notes badges | R28 | NDC-1869 A13–A14, NDC-1819 (Bug) |
| MS-040 | Reorder Kanban views; creator / modifier on hover | R30 | NDC-1869 A16 |
| MS-041 | Kanban total by a rollup summary field | R30 | NDC-1869 A17 |
| MS-042 | Lock this View | R29 | NDC-1869 B3 |
| MS-043 | Owner criteria "belongs to Role" | R29 | NDC-1869 B4 |
| MS-044 | Date criteria Previous / Next N weeks, months, years | R29 | NDC-1869 B5 |
| MS-045 | Text operators on pick list fields | R29 | NDC-1869 B6 |
| MS-046 | Wrap Text / Clip Text view mode in module lists (Work Queue has it since 26 Oct) | R28 | NDC-1869 B7 |
| MS-047 | A–Z letter filter on the name column in module lists (Work Queue Leads queue has it since 26 Oct) | R28 | NDC-1869 B9 |
| MS-048 | Delete several views at once | R29 | NDC-1869 B10 |

### Work Queue and My Requests

| # | Missing | Inv. | Plane |
|---|---|---|---|
| MS-049 | Zoho-style filter panel: 3 categories, per-field-type options, search with clear (×) | S01 | NDC-1819 (Bug) |
| MS-050 | Alphabet filter on the Contacts queue, and working together with normal filters (Leads queue has A–Z; these two parts not checked yet) | S01 | NDC-1819 (Bug) |
| MS-051 | Pin / unpin columns in Manage Columns (search, records per page, view mode and reset size are done) | S01 | NDC-1819 (Bug) |
| MS-054 | My Requests page with Pending Approval, Pending Review and History tabs (filters, export, 3 visibility tiers) | S01 | NDC-1950 (Backlog) |

---

## 2. Customization

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-055 | Multiple currencies with exchange rates | Home + other currencies, per-record currency | One company currency; /currencies 404 | Missing | C19 | NDC-2536 (Bug) |
| MS-056 | Validation rules on picklist fields | Allowed | Refused | Partly | C04 | NDC-2536 (Bug), NDC-2535 (Backlog) |
| MS-057 | Formula SUM over subform rows; formula as a subform sub-field | Allowed | Not offered | Partly | C07 | NDC-2536 (Bug) |
| MS-058 | Inventory PDF templates and mail-merge templates | Quote / invoice templates, Word merge | Not found | Missing | C15 | **Not in Plane** |
| MS-059 | Translation editor for org labels | Translate labels, export language file | Modules renamed and Arabic UI only | Partly | C16 | **Not in Plane** |
| MS-060 | Role-based home page with components; Company / Personal / Classic view toggle; greeting | Role-based home | Home with add-component dock; some components Coming soon | Partly | C17 | NDC-163 (Backlog), NDC-1476 (In Progress), NDC-2027 (Backlog) |
| MS-061 | Canvas, wizards, kiosk, web tabs | Designed pages, multi-step forms, flows | Not found; /web-tabs 404 | Missing | C18 | NDC-2032 (Backlog) — page list still to be agreed |
| MS-062 | More module settings: properties and filtering | Module settings | Not detailed in the ticket | Partly | — | NDC-1485 (Backlog) |
| MS-063 | Teamspace icon / logo; change the teamspace admin | Allowed | Initials tile only; admin picker greyed | Missing | C12 | NDC-1678 (In Progress) |

---

## 3. Users and security

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-064 | Import users in bulk | 1,000 rows | Not found (directory sync covers part) | Missing | U02 | **Not in Plane** |
| MS-065 | Groups | User groups for sharing and approvals | /iam/groups 404 | Missing | U08 | Partly: NDC-2417 (sharing to groups), NDC-2294 (group approvers) — no ticket for Groups itself |
| MS-066 | Territory management | Territory hierarchy and assignment | /territories 404 | Missing | U09 | **Not in Plane** |
| MS-067 | GDPR / consent / data privacy | Consent, lawful basis, data subject rights | Not found | Missing | U13 | **Not in Plane** |
| MS-068 | Sandbox | Test copy, deploy | /sandboxes 404 | Missing | U14 | NDC-2533 (Backlog) |
| MS-069 | Default access per module: Private, Public Read Only, Read/Write, Read/Write/Delete | Org sharing defaults | Public or Hierarchy only | Partly | U07 | NDC-2417 (Backlog) |
| MS-070 | Data sharing rules (owner- or criteria-based, Superiors Allowed) | Sharing rules | /iam/sharing-rules 404 | Missing | U07 | NDC-2417 (Backlog) |
| MS-071 | Roles tree separate from profiles; superior sees only own branch | Role hierarchy | Profile rank decides visibility | Missing | U05 | NDC-2417 (Backlog) |
| MS-072 | Share Data with Peers per role; Transfer & Delete a role | Allowed | Not built | Missing | U05 | NDC-2417 (Backlog) |
| MS-073 | Who manages records of users with no manager; warning when switching back to Role mode | Settings options | Generic dialog | Missing | U05 | NDC-2417 (Backlog) |
| MS-074 | Manager must be in a higher role; user picker on Personal Settings; Reports To on user details and Users list | Allowed | Any user; free-text user ID | Missing | U06 | NDC-2417 (Backlog) |
| MS-075 | Move reports when a manager is deleted / deactivated / changes role | Prompt | Nothing | Missing | U06 | NDC-2417 (Backlog) |
| MS-076 | "Reporting To" in reports, view criteria, filters, merge fields; email alert to manager / subordinates; Reporting Manager as blueprint owner; approval levels up the hierarchy | Allowed | Only in assignment-rule criteria | Missing | U05, U06 | NDC-2417 (Backlog) |
| MS-077 | Roles API; read any user's subordinates | API | /iam/roles, /iam/users/{id}/subordinates 404 | Missing | U05 | NDC-2417 (Backlog) |

---

## 4. Automation

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-078 | Scoring rules | Points from criteria and touch points | 404 | Missing | A10 | NDC-2030 (Backlog), NDC-1483 (Backlog) |
| MS-079 | Schedules (run a function on a schedule) | Schedules | /workflow/schedules 404 | Missing | A09 | **Not in Plane** |
| MS-080 | Cadences | Multi-step follow-ups | 404 | Missing | A11 | **Not in Plane** (only named in NDC-1869 Part B item 11) |
| MS-081 | Macros | User-run action bundles | 404 (Desk has macros) | Missing | A12 | **Not in Plane** |
| MS-082 | Assignment threshold / CommandCenter journeys | Caps and journeys | Not found | Missing | A13 | NDC-1486 Connected Flow (Backlog) — covers CommandCenter only; threshold **not in Plane** |
| MS-083 | Rename import option to "Trigger automation and process management" | Name | "Trigger workflow rules" | Partly | R35 | NDC-2294 (Backlog) |
| MS-084 | Workflow triggers Record Score and Record Notes | Triggers | Record Action and Date-Time only | Missing | A01 | NDC-2294 (Backlog) |
| MS-085 | Workflow actions Meeting, Schedule a Call, Function, Create Connected Record | Actions | Not offered | Missing | A02 | NDC-2294 (Backlog) |
| MS-086 | Assign Owner by assignment rule, only online users, email new owner, transfer related records | Options | Users, org units, profiles, user fields only | Partly | A02 | NDC-2294 (Backlog) |
| MS-087 | Scheduled Field Update, Assign Owner, Tags (and delay honoured) | Scheduled actions | Webhook, Email, Task, Create Record, portal access | Partly | A01 | NDC-2294 (Backlog) |
| MS-088 | Several conditions in one rule, first match wins, "records not meeting any of the above" | Up to 10 conditions | One criteria per rule | Missing | A01 | NDC-2294 (Backlog) |
| MS-089 | Functions on review events; per-process rejection reasons | Allowed | webhookUrl without screen; one org-wide list | Missing | A06 | NDC-2294 (Backlog), NDC-2532 (Backlog) |
| MS-090 | Approval: Anyone / Everyone for role and group approvers, sequential or parallel; functions after approval that really run | Allowed | Function action is a no-op | Missing | A05 | NDC-2294 (Backlog) |
| MS-091 | Blueprint after-transition Convert, Custom Actions, Tags, Create Record | Allowed | Not offered | Missing | A07 | NDC-2294 (Backlog) |
| MS-092 | API "trigger" list to choose which automations run on create | Allowed | Accepted but ignored | Missing | I02 | NDC-2294 (Backlog) |
| MS-093 | Webhook notification / watch API | Watch API | /webhooks 404 | Missing | I03 | **Not in Plane** |

---

## 5. Email, channels and reminders

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-094 | Gmail, Microsoft 365, SendGrid / SES and custom email providers | Allowed | Zoho Mail + SMTP only | Partly | M01 | NDC-1141 (Backlog), NDC-1479 (Backlog) |
| MS-095 | Internal chat / feeds in CRM | Feeds, Cliq | Not in CRM | Missing | G07, M08 | NDC-2028 (Backlog), NDC-1481 (Backlog), NDC-322 (Backlog) |
| MS-096 | Omnichannel chat inside the CRM | SalesIQ in CRM | Not in CRM | Missing | M08 | NDC-2029 (Backlog), NDC-1480 (Backlog) |
| MS-097 | Social tab, SalesSignals, SalesInbox | Allowed | Routes redirect to Home | Missing | M08 | Partly: NDC-2028 / NDC-2029 cover chat only; social / signals **not in Plane** |
| MS-098 | SMS notifications | Notification SMS | SMS page exists; notification SMS still "needs studying" | Partly | M04 | NDC-1482 (Backlog) |
| MS-099 | 3CX telephony provider | PhoneBridge providers | Coming soon | Coming soon | M05 | **Not in Plane** |
| MS-100 | Calendar sync (Google / Outlook) | Calendar sync | /calendar only, no sync | Partly | M11 | **Not in Plane** |
| MS-101 | Email feature (go-live item) | — | Ticket has no description | — | M02 | NDC-2496 (Backlog) — needs a description |

---

## 6. Sales and analytics

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-102 | Forecasts and quotas | Targets by hierarchy | /forecasts 404 | Missing | S04 | NDC-2031 (Backlog) — only if Forecasts is in the agreed module list |

---

## 7. Integrations

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-103 | Marketplace and Google / Microsoft / QuickBooks / LinkedIn extensions | Extensions | Only Facebook, LinkedIn, TikTok lead-ads paths | Missing | I04 | **Not in Plane** |
| MS-104 | Import from Zoho CRM | Migration | Not built | Missing | — | NDC-2534 (Backlog, no description) |
| MS-105 | Desk: Products sync (departments, associations, field mapping) | Allowed | /desk/integrations/crm/products 404 | Missing | I01 | NDC-2392 (Backlog), NDC-1669 |
| MS-106 | Desk: limit sync to chosen CRM list views | Allowed | Every record syncs | Missing | I01 | NDC-2392 |
| MS-107 | Desk: match on Secondary Email | Allowed | Primary email only | Missing | I01 | NDC-2392 |
| MS-108 | Desk: "Delete only if there are no associates" | Allowed | Not offered | Missing | I01 | NDC-2392 |
| MS-109 | Desk: initial sync finished report; 12-month window stated on screen | Email with counts | No notice | Missing | I01 | NDC-2392, NDC-2399 (Bug) |
| MS-110 | Desk: CRM Leads considered when matching Desk contacts | Not duplicated | New CRM contact created | Missing | I01 | NDC-2392 |
| MS-111 | Desk: handle the integrated user becoming inactive | Re-point prompt | Nothing | Missing | I01 | NDC-2392 |
| MS-112 | Desk: all CRM fields (custom too) in the CRM pane; hide empty Handshake columns | Allowed | 8 fixed fields, no screen | Missing | I01 | NDC-2392 |
| MS-113 | Desk: ticket filters Escalated, Overdue, High Priority on the CRM card | Allowed | All / Open / On hold / Closed | Missing | I01 | NDC-2392 |
| MS-114 | Desk: Mutual Users list, invite CRM users to Desk, Light Agents, comment by CRM-only users, @CRM Contact Owner | Allowed | Comment gets 403 | Missing | I01 | NDC-2392 |
| MS-115 | Desk: reply / comment from the CRM notification | Signals | Bell only opens the record | Missing | I01 | NDC-2392 |
| MS-116 | Desk: "CRM Contact Type" condition in SLA and assignment rules | Allowed | Not offered | Missing | I01 | NDC-2392 |
| MS-117 | Desk: default CRM data access only for Administrator; "Restricted Access" naming | Allowed | Every profile starts with Full Access | Partly | I01 | NDC-2392 |
| MS-118 | Desk: Voice of the Customer; cross-app CRM + Desk analytics | Zia, Zoho Analytics | Not built (out of NDC-1669 scope) | Missing | I01 | NDC-2392 |

---

## 8. General

| # | Missing | Zoho has | TAVI today | Type | Inv. | Plane |
|---|---|---|---|---|---|---|
| MS-119 | Holidays list | Org holidays | /iam/tenant/holidays 404 | Missing | G04 | **Not in Plane** |
| MS-120 | UI/UX enhancements across the CRM | — | Reference still to be added | — | — | NDC-1491 (Backlog) |

---

## 9. Not in any Plane ticket yet

| # | Missing | Inv. |
|---|---|---|
| MS-005 | Case escalation rules | R07, A13 |
| MS-006 | Parent account hierarchy | R03 |
| MS-016 | Share one record manually | R27 |
| MS-058 | Inventory PDF and mail-merge templates | C15 |
| MS-059 | Translation editor for org labels | C16 |
| MS-064 | Import users | U02 |
| MS-066 | Territory management | U09 |
| MS-067 | GDPR / consent | U13 |
| MS-079 | Schedules | A09 |
| MS-080 | Cadences | A11 |
| MS-081 | Macros | A12 |
| MS-093 | Webhook notification / watch API | I03 |
| MS-099 | 3CX telephony provider | M05 |
| MS-100 | Calendar sync | M11 |
| MS-103 | Marketplace and app extensions | I04 |
| MS-119 | Holidays | G04 |

Partly covered (a ticket touches it, but nothing asks for the feature itself): MS-065 Groups, MS-082 assignment threshold, MS-097 Social / SalesSignals / SalesInbox.

The inventory rows marked "Not planned or a separate product" (territories, sandbox, GDPR, canvas, wizards, web tabs, marketplace, feeds and chat) still need the go-live scope decision in NDC-2031 / NDC-2032 before tickets are filed.

---

## 10. Inventory rows that are out of date

Later runs found these are built. They are left out of the list above.

| Inv. | Inventory said (25 Oct) | Now | Source |
|---|---|---|---|
| R37 | Export is Coming soon; GET /records/export timed out | Export to .xlsx, .xls and .csv works | NDC-2628 "Already done" (Wave 2, 26 Oct) |
| R36 | Undo import missing | Import history has Undo | NDC-2628 "Already done"; NDC-1587 (Done) |
| R06 | Recurring activities missing | Repeat exists on the task form, but the next tasks are never created — a bug, not a gap | NDC-2623 (Bug); meeting quick-create gap kept as MS-027 |
| R22 | Mass update menu item is Coming soon | Mass Update works (it fails only for Pipeline) | NDC-1197 description; NDC-2621 (Bug), NDC-1316 (Bug) |
| M06 | Web forms (NDC-1488 Ready For Test) | Built by NDC-2176 (Done); NDC-1488 is now in Bug | Plane, 26 Oct |
| S01 | Work Queue: full date filter in My Open Activities; Category View with Save / Cancel and + Create Queue per module (were MS-052, MS-053) | Built | Wave 2 results WQ-01, WQ-02, WQ-03 (26 Oct) |

---

## 11. Plane gap tickets checked

Every Plane item that lists CRM missing features or asks for a new CRM feature. Pure bug tickets are not listed.

| Ticket | State | Title | Items in this file |
|---|---|---|---|
| NDC-2019 | Backlog | CRM: missing functions (parent: 2027–2032, 2176) | — |
| NDC-2027 | Backlog | CRM home page | MS-060 |
| NDC-2028 | Backlog | Internal chat in CRM | MS-095 |
| NDC-2029 | Backlog | Omnichannel chat in CRM | MS-096 |
| NDC-2030 | Backlog | CRM scoring rules | MS-078 |
| NDC-2031 | Backlog | CRM missing modules | MS-001–003, MS-102 |
| NDC-2032 | Backlog | CRM missing Settings module | MS-061 |
| NDC-2176 | Done | CRM web forms (Zoho parity) | — (built) |
| NDC-1454 | In Progress | CRM — Work Plan (parent: 1476–1491, 2532–2535) | — |
| NDC-1476 | In Progress | Home Page | MS-060 |
| NDC-1477 | Done | Work Queue | — (built) |
| NDC-1478 | Done | Missing Module Views (Kanban, split) | — (built) |
| NDC-1479 | Backlog | Email Channel | MS-094 |
| NDC-1480 | Backlog | Omni Channel Chat | MS-096 |
| NDC-1481 | Backlog | Internal Chatting in the Organization (CRM) | MS-095 |
| NDC-1482 | Backlog | Notifications SMS | MS-098 |
| NDC-1483 | Backlog | Scoring Rule | MS-078 |
| NDC-1484 | Bug | Modules (Agency Code, My Jobs) | MS-003, MS-004 |
| NDC-1485 | Backlog | Missing settings on the module | MS-062 |
| NDC-1486 | Backlog | Connected Flow | MS-082 |
| NDC-1487 | Backlog | Storage Used | — (inventory I05: built) |
| NDC-1488 | Bug | Web Form | — (built via NDC-2176) |
| NDC-1489 | Backlog | Modules and Fields Rules | MS-015 (rest built: layout, validation, dependency, links, buttons) |
| NDC-1491 | Backlog | UI/UX Enhancements for CRM | MS-120 |
| NDC-2532 | Backlog | Review Process - Triggered Functions | MS-089 |
| NDC-2533 | Backlog | Sandbox | MS-068 |
| NDC-2534 | Backlog | Import from Zoho CRM | MS-104 |
| NDC-2535 | Backlog | Layout Rules and Validation Rules | MS-056 |
| NDC-163 | Backlog | Home Page Views & Navigation | MS-060 |
| NDC-322 | Backlog | Internal chat widget across all platforms | MS-095 |
| NDC-1197 | Backlog | Nine Leads actions menu entries do nothing | MS-002, 011, 014, 022 |
| NDC-1678 | In Progress | Teamspace icon / admin / description | MS-063 |
| NDC-1819 | Bug | Workqueue Missings | MS-023, 024, 037, 039, 049–051 |
| NDC-1869 | Done | Custom Views Missing | MS-011–014, 017–020, 024, 025, 028–048 (not re-verified) |
| NDC-1950 | Backlog | My Requests: split approval and review tabs | MS-054 |
| NDC-2294 | Backlog | Automation Execution Order: features missing | MS-021, 065, 083–092 |
| NDC-2417 | Backlog | Hierarchy Preference Missing List | MS-065, 069–077 |
| NDC-2536 | Bug | Zoho settings Wonder Travel uses that CRM can't hold | MS-007, 055–057 |
| NDC-2628 | Backlog | Daily record work: features Zoho CRM has that TAVI CRM is missing | MS-008–010, 012, 017, 018, 020–023, 025–027 |
| NDC-2392 | Backlog | CRM + Desk Integration: features missing | MS-105–118 |
| NDC-1669 | Backlog | CRM Integration — Contacts, Accounts and Products Sync (spec) | MS-105 |
| NDC-1141 | Backlog | Gmail / Microsoft 365 / SendGrid / SES cannot be connected | MS-094 |
| NDC-2496 | Backlog | Email Feature (no description) | MS-101 |
| NDC-2492 | Backlog | Referral code integration system | — (TAVI only; inventory U03: built) |
| NDC-2498 | Backlog | Enhance and complete CRM ("prepare CRM to go live") | — (umbrella, no items) |
| NDC-2202 | Todo | hospitality (online ordering app integration) | — (not a Zoho parity item) |

Checked and not relevant here: NDC-157 (CRM ⇄ Omnichannel spec, Done), NDC-1644 (Workqueue spec, Done), NDC-1868 (Custom Views spec, Cancelled), NDC-771 (Vault duplicate), NDC-2018 and other Omnichannel / Desk / Vault gap lists.
