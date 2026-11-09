# TAVI CRM — missing list for go-live (one file)

27 October 2026. Plane read again today (283 items in the CRM module, 1,214 in project NDC). Zoho reference: Zoho CRM Enterprise (org943261092) and Wonder Travel's live setup as copied in NDC-2536.

This file puts together:

1. The points in NDC-2536 (Zoho settings Wonder Travel uses that our CRM can't hold)
2. The missing items in NDC-2294 (automation execution order)
3. The open CRM bugs to fix
4. Mass email and Campaigns
5. Scoring rules
6. Share one record manually
7. Edit or delete a note
8. Export selected records from the selection menu
9. Every other missing item from the CRM gap tickets

## Totals

| Part | Items | In Plane |
|---|---|---|
| 1. NDC-2536 | 3 | NDC-2536 (In Progress) |
| 2. NDC-2294 | 13 | NDC-2294 (In Progress) |
| 3. Bugs to fix | 66 open + 12 waiting for retest | All in Plane |
| 4–8. Named features | 7 (mass email, campaigns, scoring rules, share one record, edit note, delete note, export selected) | 5 have a ticket. Share one record has none; export selected is under a ticket marked Done but isn't built |
| 9. Other missing items | 98 | 83 have a ticket; 15 are not in Plane |

## 1. NDC-2536 — Zoho settings Wonder Travel uses that our CRM can't hold

These are go-live blockers for Wonder Travel. Everything else from their Zoho setup (roles, profiles, modules, fields, layouts, pipeline, email templates, 23 workflow rules, company settings, Ordered Items / Purchase Items subforms) is already copied to staging and working.

| # | Missing | Zoho (Wonder Travel) | TAVI CRM today (checked 26 Oct) |
|---|---|---|---|
| 1.1 | More than one currency, with exchange rates | Home currency EGP, plus USD, AED, JOD, KWD, OMR, SAR. Each record can be in its own currency. | One company currency, no exchange-rate list; `/currencies` answers 404 |
| 1.2 | Validation rules on picklist fields | Two active rules: Deals "Stage" must be C/E/R/S/V; Calls "Outgoing Call Status" rule | On 26 Oct the rule could be created (201) but it is never applied (bug NDC-2646). Related: NDC-2535 |
| 1.3 | Formula that adds up subform rows | Sales Orders and Purchase Orders: Sub Total = sum of line Totals; Grand Total = Sub Total − Discount + Tax + Adjustment; line Amount and Total calculate | No SUM over a subform ("Unknown function 'sum'"); a subform sub-field can't be a formula |

Also hitting Wonder Travel's copied setup: bug NDC-2621 (a deal can't be moved to another pipeline) and multi-condition workflow rules (item 2.12 — the copied rules had to be split, e.g. "Agency Country (1/10…10/10)").

## 2. NDC-2294 — automation execution order: what Zoho has and TAVI CRM doesn't

Execution order checked: Assignment Rules → Review Process → Workflow Rules + Actions → Approval Process → Blueprint, on Leads, Deals and Tasks. The order holder is NDC-1255.

| # | Area | Missing | TAVI CRM today |
|---|---|---|---|
| 2.1 | Import | Rename the import option "Trigger workflow rules" to "Trigger automation and process management" (it controls workflow, approval and blueprint), then retest import with it on and off | Misleading name |
| 2.2 | Import | Manual approval of imported records | "Coming soon" (keep the message if it stays unbuilt) |
| 2.3 | Workflow rules | Triggers Record Score and Record Notes | Only Record Action and Date-Time |
| 2.4 | Workflow rules | Actions Add Meeting, Schedule a Call, Function, Create Connected Record | Not offered ("Custom Function" exists in code only) |
| 2.5 | Workflow rules | Assign Owner by an assignment rule, "only online users", "email the new owner", "transfer related records" | Users, Org Units, Profiles and User Fields only |
| 2.6 | Workflow rules | Scheduled actions Field Update, Assign Owner, Tags (and a Field Update delay must be honoured) | Webhook, Email, Task, Create Record, Send portal access only; the API runs a delayed Field Update at once |
| 2.7 | Review process | Functions on review events (submission, review, rejection, resubmission) | `webhookUrl` in the API, no screen (bug NDC-2538: only the reject event, not signed). Also NDC-2532 |
| 2.8 | Review process | Rejection reasons set inside each review process | One org-wide list (max 10 active) shared by every process |
| 2.9 | Approval process | "Anyone" / "Everyone" for Role and Group approvers; sequential or parallel for Everyone | Not offered |
| 2.10 | Approval process | Call Functions after approval or rejection actually running | Can be added but "runs as a no-op in this version" |
| 2.11 | Blueprint | After-transition Convert (Leads), Custom Actions (functions), Tags, Create record | Not offered |
| 2.12 | Workflow conditions | Up to 10 conditions in one rule, each with its own instant and scheduled actions; first match wins; "records not meeting any of the above"; duplicate criteria / duplicate action refused | One criteria and one action list per rule; workaround is separate rules, which all fire |
| 2.13 | API | "trigger" list on record create (workflow, approval, blueprint); `"trigger": []` creates without automation | `"trigger": []` is accepted but ignored (case G-18) |

## 3. Bugs to fix

Open bugs in the CRM module, plus CRM bugs filed outside it (NDC-1630, 1637, 1659, 1660 on crm.taviportal.com; NDC-2399, 2409 on the CRM–Desk integration; NDC-2616 on CRM settings pages). Gap and plan tickets are not counted here; they are in parts 4–9. Sorted by priority.

### 3.1 Open — not fixed yet (66: 2 urgent, 18 high, 24 medium, 22 low)

| Ticket | State | Priority | Area | Bug |
|---|---|---|---|---|
| NDC-1335 | In Progress | urgent | Modules & Fields | Saving a layout fails with "Failed to update options for Subform" when the layout has no subform — a 404 on a non-existent field |
| NDC-2537 | In Progress | urgent | Review Process, Workflow Rules, Blueprint | Cloud metadata address is not blocked, and blueprint / review webhooks accept internal URLs |
| NDC-613 | Backlog | high | Login History | User denied both view login history permissions can still export his own login history |
| NDC-1141 | Bug | high | Email Channel | Google (Gmail) and Microsoft 365 cannot be connected, and Transactional (SendGrid / SES) has no configuration fields at all |
| NDC-1193 | Bug | high | API & Platform | Creating a record through the API skips required-field checks, so blank records are accepted and then cannot be edited |
| NDC-1344 | In Progress | high | Audit Log | The entity filter is incomplete and does not cover all system entities |
| NDC-1493 | Bug | high | Telephony | Telephony webhook rejects most calls in a burst and stays degraded for minutes afterwards |
| NDC-1494 | Bug | high | Telephony | Some telephony webhook deliveries hang for a minute and then return nothing at all |
| NDC-1630 | Bug | high | Modules & Fields | A new module's record form shows no fields until the layout is saved once, even the required Name field is not shown |
| NDC-1637 | Bug | high | Recycle Bin | Deleting a module leaves its records in the Recycle Bin |
| NDC-1659 | Bug | high | Recycle Bin | Configuration entities should not be listed — Users, Profiles, Org Units, Layouts, Modules, TeamSpace and Pipelines cannot be meaningfully restored |
| NDC-1797 | In Progress | high | Recycle Bin | Some records can't be deleted forever in a bulk delete and stay in the Recycle Bin. |
| NDC-1948 | Bug | high | Notes & Timeline | A user denied Timeline Visibility can't add notes: the note stays on "Posting…" forever with a success message |
| NDC-2295 | Backlog | high | CRM Integration, Desk Integrations | Attachments added to a linked contact in Desk or CRM don't appear on the same contact in the other app |
| NDC-2406 | In Progress | high | Desk Integrations | A Desk contact deleted by the integration is not in the recycle bin and cannot be restored |
| NDC-2616 | In Progress | high | UI/UX | Some settings pages go blank or spin forever when the server returns an error (CRM configuration, Chat Timeout, My Profile) |
| NDC-2621 | In Progress | high | Pipelines | A deal can't be moved to another pipeline: record page, Mass Update and API all fail with "Invalid value for: Pipeline" |
| NDC-2630 | In Progress | high | Email Channel | A failed email send is shown as sent |
| NDC-2632 | In Progress | high | Notifications | Every notification call answers 500, so the bell and My Notifications are empty |
| NDC-2634 | In Progress | high | Customers | The customer portal link opens an nginx 404 page |
| NDC-492 | Backlog | medium | Modules & Fields | Tab Order options in the section settings menu do not work |
| NDC-1224 | Bug | medium | Mass Delete | MD-8: Run large deletions in the background |
| NDC-1312 | In Progress | medium | Pipelines | Changing a deal's pipeline does not ask which stage the deal should move to |
| NDC-1316 | In Progress | medium | Pipelines | Pipeline is not offered as a field, so deals cannot be moved between pipelines in bulk |
| NDC-1324 | In Progress | medium | Pipelines | Editing the Pipeline field inline shows an empty pipeline list |
| NDC-1343 | In Progress | medium | Audit Log | Most entities are either not logged at all or log only some of their events |
| NDC-1495 | Bug | medium | Telephony | Telephony webhook returned an empty server error on the first two calls of the session |
| NDC-1496 | Bug | medium | Telephony | PUT, PATCH and DELETE on the telephony webhook report a missing login token instead of an unsupported method |
| NDC-1660 | Bug | medium | Recycle Bin | The Module filter offers Omnichannel modules alongside CRM ones |
| NDC-1944 | Bug | medium | Telephony | A missed event sent after ended turns an answered, completed call into Missed |
| NDC-1949 | Bug | medium | Telephony | On staging, telephony integrations give out webhook addresses on the old CRM host, so call events never arrive |
| NDC-2098 | Bug | medium | Custom Views | ?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads |
| NDC-2113 | Bug | medium | Custom Views | A record holding a removed pick-list value is shown in an unmarked extra column - no 'no longer an option' flag |
| NDC-2316 | In Progress | medium | Import & Export | A second connection on the same sheet tab imports every row again, creating duplicate records |
| NDC-2410 | In Progress | medium | Desk Integrations | "Lock CRM-owned fields on the contract" does not stop edits in Desk |
| NDC-2510 | Bug | medium | — | A Task action with an invalid status is logged as Fired but creates no task and shows no error |
| NDC-2538 | In Progress | medium | Review Process | webhookUrl only sends the reject event and is not signed |
| NDC-2620 | In Progress | medium | — | The Attachments section grows with every uploaded file instead of keeping a fixed height and scrolling |
| NDC-2622 | In Progress | medium | Search | Users on the built-in "User" profile can't use global search |
| NDC-2623 | In Progress | medium | Activities | A recurring task ("Weekly, 3 times") is saved but the next tasks are never created |
| NDC-2624 | In Progress | medium | Notes & Timeline | Deleting a record and adding or removing attachments are not logged on the timeline |
| NDC-2645 | In Progress | medium | Import & Export | "All fields" exports every field defined on the module, including other layouts' fields and fields not used on any layout |
| NDC-2646 | In Progress | medium | Modules & Fields | Rules are saved but never applied, and any text is accepted as a condition |
| NDC-2647 | In Progress | medium | Reports | Rollup summary fields are always empty in reports |
| NDC-1497 | Bug | low | Telephony | Telephony webhook error replies are inconsistent — some explain the problem, others are completely empty |
| NDC-1498 | Bug | low | Telephony | Telephony webhook quietly accepts fields of the wrong type instead of rejecting them |
| NDC-1694 | In Progress | low | Teamspace | A teamspace can be saved with zero modules. |
| NDC-2122 | Bug | low | Custom Views | Upper-case 'AND' pattern is accepted by the editor and the API |
| NDC-2135 | Bug | low | Kanban View, Custom Views | Firefox: React ErrorBoundary console error from a lazy-loaded component during the view/Kanban flow |
| NDC-2136 | Bug | low | Custom Views | List first page p95 far above 1.5 s (Leads 9.1 s, Deals 3.3 s) |
| NDC-2137 | Bug | low | Kanban View, Custom Views | Kanban headers + first cards p95 5.1 s (target 2 s) |
| NDC-2280 | Bug | low | Custom Views | Long custom view name is not truncated and pushes the Sharing column out of view |
| NDC-2319 | In Progress | low | Import & Export | A row's problems are reported one at a time, one sync per problem |
| NDC-2321 | In Progress | low | Workflow Rules, Blueprint, Assignment Rules | Workflow field update and blueprint entry are missing from the record Timeline; assignment shows as "System" |
| NDC-2399 | Bug | low | Desk Integrations | No notice to the admin when the initial sync finishes |
| NDC-2409 | Bug | low | Desk Integrations | Integration settings changes are not in the Audit Log |
| NDC-2511 | Bug | low | — | Rules that run on a date field leave no entry in the Audit Log when they run |
| NDC-2625 | In Progress | low | Tags | The record tag API lets a record hold more than 10 tags |
| NDC-2626 | In Progress | low | Pipelines | Pipeline is shown as a raw id and stages as raw keys |
| NDC-2627 | In Progress | low | Notes & Timeline | The created entry reads "leads created" instead of "Lead created" |
| NDC-2629 | In Progress | low | Activity Reminders | The Reminder card fields, Additional users and Additional profiles lists show every item at full length instead of in fixed-height scrollable boxes |
| NDC-2631 | In Progress | low | Templates & Workflow | A placeholder the template can't fill is saved and comes out blank |
| NDC-2633 | In Progress | low | Notifications | My Notifications shows raw event keys instead of names |
| NDC-2648 | In Progress | low | Teamspace | A folder name used twice answers 500 instead of a clear "name taken" message |
| NDC-2649 | In Progress | low | Modules & Fields | An empty dependency map is saved, and dependencies aren't checked when a record is saved |
| NDC-2650 | In Progress | low | Modules & Fields | Layout access saved through the API is silently ignored (assignments endpoint 500 / 405) |

### 3.2 Fixed by the developers — waiting for retest (12, Ready For Test)

| Ticket | State | Priority | Area | Bug |
|---|---|---|---|---|
| NDC-1701 | Ready For Test | urgent | Teamspace | Any user with access to a teamspace can act as on admin on it; the user can make any changes on the teamspace at will. |
| NDC-2298 | Ready For Test | urgent | Assignment Rules | An assignment rule limited to the API channel still assigns owners to imported leads |
| NDC-2381 | Ready For Test | urgent | Audit Log | No audit events are recorded after 20 Oct 21:41 UTC — record changes, metadata changes and sign-ins are missing |
| NDC-2412 | Ready For Test | urgent | Access Control, Leads | Role mode: higher-ranked users can't see lower-ranked users' records |
| NDC-1172 | Ready For Test | high | Teamspace | A CRM Admin can open any teamspace they are not on the access list of, whatever accessibility option is set |
| NDC-1699 | Ready For Test | high | Teamspace | A user with Manager profile can access a teamspace even though neither the user nor the Manager profile is not listed on the accessible users list. |
| NDC-2293 | Ready For Test | high | Audit Log | Entities filter lists the same entity several times and doesn't group related entities |
| NDC-2418 | Ready For Test | high | Login & Sessions, Login History, Assignment Rules | Sessions stay "Active" after they expire (255 "active" sessions, back to 30 Aug) |
| NDC-2419 | Ready For Test | high | Assignment Rules, Import & Export | Rules fire on import and API but no longer set the owner |
| NDC-2302 | Ready For Test | medium | Review Process, Import & Export | Import with "Trigger automation" off still runs the workflow once the review is approved |
| NDC-2385 | Ready For Test | medium | Import & Export | The "All errors" table on the Review step is always empty ("No errors match your filters") although errors are counted |
| NDC-2414 | Ready For Test | medium | Access Control | The Desk Administrator profile gives view-all on CRM records |

## 4–8. The features you named

| # | Feature | Zoho has | TAVI CRM today | Plane | Next step |
|---|---|---|---|---|---|
| 4.1 | Mass email from a list | Select records → send a template email to all of them | Menu item "Mass Email" is Coming soon | NDC-1197 (Done — the dead menu entries were fixed, not the feature); NDC-1869 A19 (Done) | No open ticket builds it. Needs a ticket, or add it to the NDC-2031 / NDC-2032 scope |
| 4.2 | Campaigns module and "Add to Campaigns" | Campaigns module with members, status, ROI; add leads/contacts to a campaign from the list | No Campaigns module; "Add to Campaigns" is Coming soon. SMS / WhatsApp campaigns exist in Omnichannel only | NDC-2031 CRM missing modules (Backlog) | Agree the module list in NDC-2031 |
| 5.1 | Scoring rules (leads, contacts) | Points from field criteria and touch points (email, calls, web); score usable in workflow ("Record Score" trigger) and views | No scoring rules; API 404 | NDC-2030 (Backlog, planned 25–31 Oct, owner Moaz), NDC-1483 (Backlog). Omnichannel side: NDC-2571 (full lead-scoring conditions and decay), NDC-2580 (company scoring) — Wonder Travel has 20 SalesIQ rules | Build NDC-2030; the "Record Score" trigger (2.3) depends on it |
| 6.1 | Share one record manually | Share a single record with users / roles, read-only or read-write | No screen and no API | **Not in Plane** (NDC-2417 covers org-wide sharing rules, not single-record sharing) | Needs a new ticket |
| 7.1 | Edit a note | Edit your note on the record | Notes can only be added | NDC-2628 (Backlog) | Build in NDC-2628 |
| 7.2 | Delete a note | Delete your note on the record | Not possible; GET …/notes answers 405 | NDC-2628 (Backlog). Related bug NDC-1948 (note stuck on "Posting…") | Build in NDC-2628 |
| 8.1 | Export selected records from the selection menu | Tick records → Export Selected | Not offered; only export of the whole view | NDC-1869 Part B item 11 — ticket is Done but the option is not there | Reopen NDC-1869 for this item or file a new ticket |

## 9. Every other missing item from the CRM gap tickets

From the 26 Oct list (`crm-missing-features.md`), with the items already in parts 1–8 taken out. Plane states are today's. Items under a Done ticket (NDC-1869, NDC-1484, NDC-1197) were not checked on screen again.

### Records and list tools

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-001 | Quotes, Invoices, Products, Price Books, Vendors modules | Not in the 15 modules | NDC-2031 (Backlog) — module list still to be agreed |
| MS-003 | Solutions, Documents, Forecasts, Visits, Projects, Services/Appointments modules | None as Zoho modules (custom Services, Agency… exist) | NDC-2031 (Backlog), NDC-1484 (Done) |
| MS-004 | My Jobs module | Not built | NDC-1484 (Done) |
| MS-005 | Case escalation rules | Cases is a plain module | Not in Plane |
| MS-006 | Parent account hierarchy | Not seen on Agency Code | Not in Plane |
| MS-008 | Clone a record | Record menu has only Delete | NDC-2628 (Backlog) |
| MS-010 | Attach any file type | .txt and other types refused | NDC-2628 (Backlog) |
| MS-011 | Mass convert | Coming soon | NDC-1869 A19 (Done), NDC-1197 (Done) |
| MS-012 | Deduplicate / find and merge duplicates | Merge API only; menu item Coming soon | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-013 | Mass transfer of records between owners | Change owner on one record only | NDC-1869 Part B item 11 (Done) — not built as of 25 Oct |
| MS-015 | Record locking screen | API only, no screen | NDC-1489 (Backlog) |
| MS-017 | Sheet view | Coming soon | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-018 | Print view | Coming soon | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-019 | Canvas / map / chart list views, print mailing labels, print using canvas | "This view is coming soon" | NDC-1869 Part B item 11 (Done) |
| MS-020 | Drafts | Coming soon | NDC-2628 (Backlog), NDC-1869 A19 (Done) |
| MS-021 | Approve records held from web form / import | "Approve Leads" Coming soon; import shows Coming soon | NDC-2628 (Backlog), NDC-2294 (In Progress) |
| MS-022 | Create Client Script | Coming soon | NDC-2628 (Backlog), NDC-1197 (Done) |
| MS-023 | System-defined filters (Activities, Campaigns, Latest Email Status, Locked, Record Action, Related Records Action, Touched / Untouched, Cadences) | Greyed "coming in a future update" | NDC-2628 (Backlog), NDC-1819 (Bug) |
| MS-024 | Filter By Related Modules | Fields only | NDC-1869 B2 (Done), NDC-1819 (Bug) |
| MS-025 | Save the current filter (as a view) | Text in the build, no button | NDC-2628 (Backlog), NDC-1869 B1 (Done) |
| MS-026 | Global search on notes and tags (#tag) | Notes and tags not searched | NDC-2628 (Backlog) |
| MS-027 | Repeat on the meeting quick-create popup | Only the full form has it | NDC-2628 (Backlog) |

### Custom views and list grid

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-029 | Collapse / expand groups in the view picker | — | NDC-1869 A1 |
| MS-030 | Manage custom views grouped by type | — | NDC-1869 A2 |
| MS-031 | "Between" / "Not between" for number fields | — | NDC-1869 A3 |
| MS-032 | "Starting tomorrow" / "Till yesterday" for dates | — | NDC-1869 A4 |
| MS-033 | Fiscal year / fiscal quarter date operators | — | NDC-1869 A5 |
| MS-034 | Share a view with roles, roles and subordinates, groups | — | NDC-1869 A6 |
| MS-035 | Profile permission to create custom views | — | NDC-1869 A7 |
| MS-036 | Separate permission to manage Kanban views | — | NDC-1869 A8 |
| MS-037 | Pin (freeze) a column; column header menu (Filter by / Hide / Asc / Desc) | — | NDC-1869 A9–A10, NDC-1819 (Bug) |
| MS-038 | Resize column widths + Reset Column Size in module lists (Work Queue has them since 26 Oct) | — | NDC-1869 A11, B8 |
| MS-039 | Row actions menu on the left; Add Note from the row; Activity and Notes badges | — | NDC-1869 A13–A14, NDC-1819 (Bug) |
| MS-040 | Reorder Kanban views; creator / modifier on hover | — | NDC-1869 A16 |
| MS-041 | Kanban total by a rollup summary field | — | NDC-1869 A17 |
| MS-042 | Lock this View | — | NDC-1869 B3 |
| MS-043 | Owner criteria "belongs to Role" | — | NDC-1869 B4 |
| MS-044 | Date criteria Previous / Next N weeks, months, years | — | NDC-1869 B5 |
| MS-045 | Text operators on pick list fields | — | NDC-1869 B6 |
| MS-046 | Wrap Text / Clip Text view mode in module lists (Work Queue has it since 26 Oct) | — | NDC-1869 B7 |
| MS-047 | A–Z letter filter on the name column in module lists (Work Queue Leads queue has it since 26 Oct) | — | NDC-1869 B9 |
| MS-048 | Delete several views at once | — | NDC-1869 B10 |

### Work Queue and My Requests

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-049 | Zoho-style filter panel: 3 categories, per-field-type options, search with clear (×) | — | NDC-1819 (Bug) |
| MS-050 | Alphabet filter on the Contacts queue, and working together with normal filters (Leads queue has A–Z; these two parts not checked yet) | — | NDC-1819 (Bug) |
| MS-051 | Pin / unpin columns in Manage Columns (search, records per page, view mode and reset size are done) | — | NDC-1819 (Bug) |
| MS-054 | My Requests page with Pending Approval, Pending Review and History tabs (filters, export, 3 visibility tiers) | — | NDC-1950 (Backlog) |

### Customization

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-058 | Inventory PDF templates and mail-merge templates | Not found | Not in Plane |
| MS-059 | Translation editor for org labels | Modules renamed and Arabic UI only | Not in Plane |
| MS-060 | Role-based home page with components; Company / Personal / Classic view toggle; greeting | Home with add-component dock; some components Coming soon | NDC-163 (Backlog), NDC-1476 (In Progress), NDC-2027 (Backlog) |
| MS-061 | Canvas, wizards, kiosk, web tabs | Not found; /web-tabs 404 | NDC-2032 (Backlog) — page list still to be agreed |
| MS-062 | More module settings: properties and filtering | Not detailed in the ticket | NDC-1485 (Backlog) |
| MS-063 | Teamspace icon / logo; change the teamspace admin | Initials tile only; admin picker greyed | NDC-1678 (Ready For Test) |

### Users and security

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-064 | Import users in bulk | Not found (directory sync covers part) | Not in Plane |
| MS-065 | Groups | /iam/groups 404 | Partly: NDC-2417 (sharing to groups), NDC-2294 (group approvers) — no ticket for Groups itself |
| MS-066 | Territory management | /territories 404 | Not in Plane |
| MS-067 | GDPR / consent / data privacy | Not found | Not in Plane |
| MS-068 | Sandbox | /sandboxes 404 | NDC-2533 (Backlog) |
| MS-069 | Default access per module: Private, Public Read Only, Read/Write, Read/Write/Delete | Public or Hierarchy only | NDC-2417 (Backlog) |
| MS-070 | Data sharing rules (owner- or criteria-based, Superiors Allowed) | /iam/sharing-rules 404 | NDC-2417 (Backlog) |
| MS-071 | Roles tree separate from profiles; superior sees only own branch | Profile rank decides visibility | NDC-2417 (Backlog) |
| MS-072 | Share Data with Peers per role; Transfer & Delete a role | Not built | NDC-2417 (Backlog) |
| MS-073 | Who manages records of users with no manager; warning when switching back to Role mode | Generic dialog | NDC-2417 (Backlog) |
| MS-074 | Manager must be in a higher role; user picker on Personal Settings; Reports To on user details and Users list | Any user; free-text user ID | NDC-2417 (Backlog) |
| MS-075 | Move reports when a manager is deleted / deactivated / changes role | Nothing | NDC-2417 (Backlog) |
| MS-076 | "Reporting To" in reports, view criteria, filters, merge fields; email alert to manager / subordinates; Reporting Manager as blueprint owner; approval levels up the hierarchy | Only in assignment-rule criteria | NDC-2417 (Backlog) |
| MS-077 | Roles API; read any user's subordinates | /iam/roles, /iam/users/{id}/subordinates 404 | NDC-2417 (Backlog) |

### Automation

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-079 | Schedules (run a function on a schedule) | /workflow/schedules 404 | Not in Plane |
| MS-080 | Cadences | 404 | Not in Plane (only named in NDC-1869 Part B item 11) |
| MS-081 | Macros | 404 (Desk has macros) | Not in Plane |
| MS-082 | Assignment threshold / CommandCenter journeys | Not found | NDC-1486 Connected Flow (Backlog) — covers CommandCenter only; threshold not in Plane |
| MS-093 | Webhook notification / watch API | /webhooks 404 | Not in Plane |

### Email, channels and reminders

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-094 | Gmail, Microsoft 365, SendGrid / SES and custom email providers | Zoho Mail + SMTP only | NDC-1141 (Bug), NDC-1479 (Backlog) |
| MS-095 | Internal chat / feeds in CRM | Not in CRM | NDC-2028 (Backlog), NDC-1481 (Backlog), NDC-322 (Backlog) |
| MS-096 | Omnichannel chat inside the CRM | Not in CRM | NDC-2029 (Backlog), NDC-1480 (Backlog) |
| MS-097 | Social tab, SalesSignals, SalesInbox | Routes redirect to Home | Partly: NDC-2028 / NDC-2029 cover chat only; social / signals not in Plane |
| MS-098 | SMS notifications | SMS page exists; notification SMS still "needs studying" | NDC-1482 (Backlog) |
| MS-099 | 3CX telephony provider | Coming soon | Not in Plane |
| MS-100 | Calendar sync (Google / Outlook) | /calendar only, no sync | Not in Plane |
| MS-101 | Email feature (go-live item) | Ticket has no description | NDC-2496 (Backlog) — needs a description |

### Sales and analytics

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-102 | Forecasts and quotas | /forecasts 404 | NDC-2031 (Backlog) — only if Forecasts is in the agreed module list |

### Integrations

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-103 | Marketplace and Google / Microsoft / QuickBooks / LinkedIn extensions | Only Facebook, LinkedIn, TikTok lead-ads paths | Not in Plane |
| MS-104 | Import from Zoho CRM | Not built | NDC-2534 (Backlog, no description) |
| MS-105 | Desk: Products sync (departments, associations, field mapping) | /desk/integrations/crm/products 404 | NDC-2392 (Backlog), NDC-1669 |
| MS-106 | Desk: limit sync to chosen CRM list views | Every record syncs | NDC-2392 |
| MS-107 | Desk: match on Secondary Email | Primary email only | NDC-2392 |
| MS-108 | Desk: "Delete only if there are no associates" | Not offered | NDC-2392 |
| MS-109 | Desk: initial sync finished report; 12-month window stated on screen | No notice | NDC-2392, NDC-2399 (Bug) |
| MS-110 | Desk: CRM Leads considered when matching Desk contacts | New CRM contact created | NDC-2392 |
| MS-111 | Desk: handle the integrated user becoming inactive | Nothing | NDC-2392 |
| MS-112 | Desk: all CRM fields (custom too) in the CRM pane; hide empty Handshake columns | 8 fixed fields, no screen | NDC-2392 |
| MS-113 | Desk: ticket filters Escalated, Overdue, High Priority on the CRM card | All / Open / On hold / Closed | NDC-2392 |
| MS-114 | Desk: Mutual Users list, invite CRM users to Desk, Light Agents, comment by CRM-only users, @CRM Contact Owner | Comment gets 403 | NDC-2392 |
| MS-115 | Desk: reply / comment from the CRM notification | Bell only opens the record | NDC-2392 |
| MS-116 | Desk: "CRM Contact Type" condition in SLA and assignment rules | Not offered | NDC-2392 |
| MS-117 | Desk: default CRM data access only for Administrator; "Restricted Access" naming | Every profile starts with Full Access | NDC-2392 |
| MS-118 | Desk: Voice of the Customer; cross-app CRM + Desk analytics | Not built (out of NDC-1669 scope) | NDC-2392 |

### General

| # | Missing | TAVI today | Plane |
|---|---|---|---|
| MS-119 | Holidays list | /iam/tenant/holidays 404 | Not in Plane |
| MS-120 | UI/UX enhancements across the CRM | Reference still to be added | NDC-1491 (Backlog) |

### Not in any Plane ticket (15)

MS-005 case escalation rules, MS-006 parent account hierarchy, MS-058 inventory PDF / mail-merge templates, MS-059 translation editor, MS-064 bulk user import, MS-066 territories, MS-067 GDPR / consent, MS-079 schedules, MS-080 cadences, MS-081 macros, MS-093 webhook watch API, MS-099 3CX, MS-100 calendar sync, MS-103 marketplace extensions, MS-119 holidays list. Plus share one record (6.1).

## Sources

- Plane: NDC-2536, NDC-2294, NDC-2628, NDC-2030, NDC-1483, NDC-2031, NDC-1197, NDC-1869, NDC-2417, NDC-2392, the NDC-2019 and NDC-1454 trees, and every open item in the CRM module (read 27 Oct 2026).
- `crm-missing-features.md` (26 Oct) and the Wave 1, 2 and 5 results under `executions/`.
