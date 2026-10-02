# CRM Custom Views — specification and requirements (based on Zoho CRM)

| | |
|---|---|
| App | TAVI CRM — `https://crm.taviportal.com` (tenant NDC-Staging) |
| Reference product | Zoho CRM — checked live on 2 Oct 2026 (Leads module, admin account), plus Zoho's help and API docs |
| Product spec (PRD) | NDC-1868 "[SPEC] Custom Views — Saved, Shareable Record Views for List and Kanban (CRM)" |
| Gap ticket | NDC-1869 (22 items). The 11 new gaps from the live check are **not filed yet** |
| Missing list | `docs/custom-views/custom-views-missing-list.md` (Part A = NDC-1869, Part B = new) |
| Test spec | `docs/custom-views/spec-crm-custom-views-v3.md` — scenario ids in the "Tests" column point there |
| Test cases | `docs/custom-views/Custom Views - Spec v3 Test Cases.xlsx` (ids `CVS-<scenario id>`) |
| Version | v3 — draft for review, 2 Oct 2026 |

## 1 Purpose and scope

This document says what CRM Custom Views must do to match Zoho CRM. It joins three sources into one numbered list: the PRD (NDC-1868), what Zoho CRM really does today, and what the CRM build has today.

In scope: the view picker, standard views, creating and editing custom list views, criteria, columns, sharing, the Manage custom views page, the list view grid, the filter panel, record selection and bulk actions, Kanban views, permissions, and the views API.

Out of scope here (listed in §14): other view types (Chart, Timeline, Grid, Map, Canvas), Sheet and Print views, and rebuilding bulk operations. NDC-1868 names them as non-goals; they stay in the missing list for triage.

## 2 How to read the requirement tables

- **ID** — `CVR-<area>-<n>`. Stable; use it in tickets and reviews.
- **Zoho** — where the Zoho behaviour comes from: **Live** = seen on screen on 2 Oct 2026; **Docs** = Zoho help or API docs only; **—** = not a Zoho feature (a CRM or PRD requirement).
- **PRD** — the NDC-1868 item, or "not in PRD".
- **CRM today** — **Built**, **Partly** (what is missing is stated), **Missing**, or **Not confirmed** (could not be checked; see §15). CRM status comes from the build's code (bundle `index-DfcbYBNN.js`) and the 1 Oct 2026 screen check recorded in spec v2.
- **Gap** — the item in the missing list: `A<n>` = Part A (NDC-1869 item n), `B<n>` = Part B (new).
- **Tests** — scenario ids in `spec-crm-custom-views-v3.md`.

Roles used: Tenant Owner, CRM Admin, Manager, Supervisor, User (the five TAVI profiles in NDC-1868 §4).

---

## 3 View picker and standard views

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-PICK-1 | One view picker per module with a search box that filters by view name across all groups. | Live | P0-1 | Built | — | B1, B2 |
| CVR-PICK-2 | Views are grouped: Pinned views (only while a view is pinned), Created by me, Shared with me, Public views. Empty groups are not shown. | Live (Created By Me, Public Views) | P0-1 | Built | — | B1 |
| CVR-PICK-3 | Each group can be collapsed and expanded. | Live | not in PRD | Missing — group names are plain labels | A1 | Z26 |
| CVR-PICK-4 | "Show custom views as tabs / as a dropdown" switch; chosen tabs are kept per user. | Live | not in PRD | Built | — | B3, B6 |
| CVR-PICK-5 | Recently closed group (last 10 closed tabs). | — | not in PRD | Built (CRM extra) | — | B5 |
| CVR-PICK-6 | The picker footer has New custom view and Manage custom views. | Live | P0-1 | Built | — | A1, B16 |
| CVR-PICK-7 | The last used view per module is restored after opening a record and going back, and after signing out and in. | Docs (not stated) | P0-1 | Built | — | B11–B14 |
| CVR-STD-1 | Standard views exist in every module: All, My, Recently Created, Recently Modified, Today's. | Live (plus others, see §14) | P0-1, Q12 | Built | — | B7–B9 |
| CVR-STD-2 | Standard views cannot be renamed, cloned or deleted and their criteria cannot be changed; their columns can be changed. | Live | P0-1 | Built | — | B10, A7, A12, G3, G9 |
| CVR-STD-3 | System-defined views are marked with `*` and a legend. | Live | not in PRD | Built | — | B1, B16 |

## 4 Create and edit a custom list view

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-EDIT-1 | "New custom view" opens a form with name, criteria, columns and sharing. | Live | P0-2 | Built | — | C1 |
| CVR-EDIT-2 | Name is required and unique per owner per module. CRM limit 120 characters (Zoho API: 50). | Live / Docs | P0-2 | Built | — | C2–C5 |
| CVR-EDIT-3 | A view with no criteria is valid and returns every record the user can access. | Live | P0-2 | Built | — | C1 |
| CVR-EDIT-4 | A criteria row needs field, operator and (where the operator takes one) value; an incomplete row blocks Save. | Live | P0-2 | Built | — | C6, C7 |
| CVR-EDIT-5 | Up to 25 criteria rows. | Docs | P0-3, Q3 | Built | — | C8 |
| CVR-EDIT-6 | Edit changes name, criteria, columns and sharing; the result changes at once for everyone the view is shared with. | Live | P0-2 | Built | — | C15, E2E-4 |
| CVR-EDIT-7 | The whole definition is checked on the server on save (limits, types, unknown fields). | — | P0-2 | Built (client limits; server to be proven) | — | C8, C11, C12, C22, D19 |
| CVR-EDIT-8 | Two people editing the same view cannot silently overwrite each other. | — | not in PRD | Built (CRM extra) | — | C18 |
| CVR-EDIT-9 | Default sort and records per page can be set in the view editor. | — (Zoho sets sort in the toolbar and page size in the grid menu) | not in PRD | Built (CRM extra) | — | C12 |
| CVR-EDIT-10 | A view applies to one layout ("Applies to the … layout"). | — | not in PRD | Built (CRM extra) | — | C13 |
| CVR-EDIT-11 | Every create, edit, sharing change, clone and delete of a view is in the audit log. | Docs (Zoho does not list it) | NFR | Not confirmed | — | C24 |

## 5 Criteria — fields and operators

Zoho's operator lists below were read from the live editor on 2 Oct 2026.

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-CRIT-1 | Text fields: is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty. | Live | P0-3 | Built | — | D1–D3 |
| CVR-CRIT-2 | Number, currency, decimal, percent: =, !=, <, <=, >, >=, is empty, is not empty. | Live | P0-3 | Built | — | D4–D6 |
| CVR-CRIT-3 | Number, currency, decimal, percent: between, not between. | Live | P0-3 | Missing | A3 | Z5 |
| CVR-CRIT-4 | Date and date-time: is, is before, is after, between, not between, Today, Tomorrow, Yesterday, Previous/Current/Next Week, Month and Year, Age in Days, Due in Days, is empty. | Live | P0-3 | Built | — | D7–D10 |
| CVR-CRIT-5 | Date and date-time: Starting tomorrow, Till Yesterday. | Live | P0-3 | Missing | A4 | Z6 |
| CVR-CRIT-6 | Date and date-time: Current, Previous and Next Fiscal Year and Fiscal Quarter, using the tenant's fiscal-year setting. (Zoho has no plain calendar-quarter operator.) | Live | P1-4 | Missing. The tenant fiscal-year setting exists in Company settings | A5 | Z7 |
| CVR-CRIT-7 | Date and date-time: "Previous" and "Next" with a number and a unit — days, weeks, months or years. | Live | not in PRD | Partly — "last / next N days" and "N hours" only; no weeks, months, years | B5 | Z40–Z42 |
| CVR-CRIT-8 | Date and date-time: isn't, is not empty. | Live | P0-3 | Not confirmed — not in the build's date operator list in spec v2 §2.3 | — | D1, D7 |
| CVR-CRIT-9 | Checkbox: is (true / false). | Live | P0-3 | Built | — | D13 |
| CVR-CRIT-10 | Pick list: is, isn't, is empty, is not empty. CRM also has "any of" and "none of". | Live | P0-3 | Built | — | D14 |
| CVR-CRIT-11 | Pick list: contains, doesn't contain, starts with, ends with. | Live | not in PRD | Missing | B6 | Z43, Z44 |
| CVR-CRIT-12 | Multi-select: include any, include all, exclude. | Docs | P0-3 | Built | — | D15 |
| CVR-CRIT-13 | Lookup and owner fields: is, isn't, is empty, is not empty; owner = "me". | Live | P0-3 | Built | — | D16, D17 |
| CVR-CRIT-14 | Owner fields: belongs to Role, does not belong to Role. | Live | not in PRD | Missing | B4 | Z38, Z39 |
| CVR-CRIT-15 | Tags: is, isn't, is empty, is not empty. | Live | P0-3 | Built | — | D18 |
| CVR-CRIT-16 | Relative date operators use the tenant timezone (Cairo), not UTC. | — | P0-3 | Built (to be proven) | — | B9, D8, Z42 |
| CVR-CRIT-17 | Last Activity Time can be used as a criteria field. | Live | P1-5 | Not confirmed | — | D25 |
| CVR-CRIT-18 | "In the last / next N hours", "Before now", "After now" on date-time fields. | — | not in PRD | Built (CRM extra) | — | D11, D12 |

## 6 Criteria pattern

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-PAT-1 | Rows join with AND by default; the pattern shows as `( 1 and 2 )` with an "Edit Pattern" control. | Live | P0-4 | Built | — | D20 |
| CVR-PAT-2 | The pattern accepts row numbers, and / or, and round brackets. | Docs | P0-4 | Built | — | D22, D23 |
| CVR-PAT-3 | Without brackets the pattern is read left to right: `1 or 2 and 3` = `((1 or 2) and 3)`. | Docs | P0-4, Q1 | Built | — | D21 |
| CVR-PAT-4 | Invalid patterns block Save: unbalanced brackets, `()`, `(and)`, a missing or unknown row number, an unused row. | Docs | P0-4 | Built | — | D22 |
| CVR-PAT-5 | A saved pattern reopens with the same meaning, fully bracketed. | Docs | P0-4 | Built | — | D23 |
| CVR-PAT-6 | The pattern reads correctly in Arabic / RTL. | — | NFR | Built (to be proven) | — | D24 |

## 7 Related modules, lookups and subforms

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-REL-1 | "Related Modules Criteria" switch: filter by fields of a related module. | Live | P1-1 | Built | — | E1, E4 |
| CVR-REL-2 | "With" and "without" related records, with no field condition. | Docs | P1-1 | Built | — | E2, E3 |
| CVR-REL-3 | Up to 3 related modules per view, up to 3 rows each. | Docs | P1-1, Q3 | Built | — | E5, E6 |
| CVR-REL-4 | Fields of a lookup module can be used in criteria (Zoho: module dropdown on each row); up to 5 rows. | Live | P1-3 | Built | — | E8 |
| CVR-REL-5 | Subform fields can be used in criteria. | Docs | P1-2 | Not confirmed — no module with a subform on NDC-Staging | — | — (hole, §15) |
| CVR-REL-6 | A view whose criteria use a deleted or hidden field still runs and shows a warning; the hidden criteria are masked and read-only for that viewer. | Docs | P0-6, §8 | Built (warning); masking not confirmed | — | E9–E12 |

## 8 Columns

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-COL-1 | Choose columns from an Available list into a Selected list and order them. | Live | P0-5 | Built | — | C9–C11 |
| CVR-COL-2 | The record-name column cannot be removed. | Live | P0-5 | Built | — | F1 |
| CVR-COL-3 | Manage Columns in the grid; a personal column change is seen only by that user and can be saved to the view or reset. | Live | P0-5 | Built | — | F1–F4 |
| CVR-COL-4 | A field hidden for the viewer's profile never shows as a column or in the API response. | — | P0-5 | Not confirmed | — | E11 |
| CVR-COL-5 | Column header menu: Asc, Desc, Pin Column, Filter by, Hide Column. | Live | P0-5 | Partly — a header click sorts; no menu | A10 | F16, Z12 |
| CVR-COL-6 | Pin (freeze) one column at the leading edge (right in RTL). | Live | P0-5 | Missing | A9 | Z11 |
| CVR-COL-7 | Resize column widths; kept per user per view. | Live | P0-5 | Missing | A11 | F17, Z19 |
| CVR-COL-8 | "Reset Column Size" puts all widths back to default. | Live | not in PRD | Missing | B8 | Z47 |
| CVR-COL-9 | View Mode: Wrap Text (long values wrap) or clipped. | Live | not in PRD | Missing in the list view (Split view has it) | B7 | Z45, Z46 |

## 9 Sharing, locking and access

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-SHARE-1 | Share with: Only me, Everyone, Selected users. | Live | P0-6 | Built | — | C14, A2–A6 |
| CVR-SHARE-2 | "Selected users" can also pick Groups, Roles, and Roles and Subordinates. | Live | Q15 | Missing — users only | A6 | Z8 |
| CVR-SHARE-3 | Sharing a view needs a permission ("Manage Shared Views"); without it only "Only me" is offered, in the UI and the API. | Docs | P0-6, Q2 | Built (to be proven with a lower profile) | — | A2, A3, K5 |
| CVR-SHARE-4 | A view never widens access: every viewer sees only the records and fields their own role allows. | — | P0-6, G3 | Not confirmed | — | A5, A6, E3, E10, E11, I17, K2, K7, K8 |
| CVR-SHARE-5 | People a view is shared with can use, pin and clone it; only the owner and administrators can edit or delete it. | Docs | P0-6 | Built (to be proven with a lower profile) | — | A4, G2, G12 |
| CVR-SHARE-6 | Removing a user from sharing removes the view from their picker; if it was their last view, the default opens. | — | P0-6 | Built (to be proven) | — | G13 |
| CVR-SHARE-7 | "Lock this View — Restrict any changes by users with whom the view is shared." Shown for shared views; only administrators and the creator can change or unlock a locked view. | Live | not in PRD | Missing | B3 | Z34–Z37 |

## 10 Manage, clone, pin and delete

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-MNG-1 | Manage custom views page: Name, Shared To, Created By, Last Modified By; search by name; a category filter. | Live | not in PRD | Built | — | B16 |
| CVR-MNG-2 | The page groups views by type (Created by me, Shared with me, Public views; Pinned views while one is pinned). | Live | not in PRD | Missing — one flat table with two tabs | A2 | Z27 |
| CVR-MNG-3 | Row actions on the page: Edit, Clone, Delete View. | Live | P0-7 | Built | — | B16, G1, G7 |
| CVR-MNG-4 | Tick several custom views and delete them together; system views cannot be ticked. | Live | not in PRD | Missing | B10 | Z50–Z52 |
| CVR-MNG-5 | View menu: Edit, Pin, Clone, Delete View. | Live | P0-7 | Built (plus Edit columns, Close view) | — | G1, G5, G7 |
| CVR-MNG-6 | Pin view keeps a view at the top and always shown as a tab; per user; up to 15. | Live (Pin) | P0-1 (as "favourite") | Built | — | G5, G6, B4 |
| CVR-MNG-7 | Clone makes a private copy owned by the cloner; standard views cannot be cloned. | Live | P0-7 | Built | — | G1–G4 |
| CVR-MNG-8 | Delete asks for confirmation naming the view; standard views cannot be deleted. | Live | P0-7 | Built | — | G7, G9, G11 |
| CVR-MNG-9 | Deleted views go to the Recycle Bin and can be restored. | — | not in PRD | Built (CRM extra) | — | G8 |
| CVR-MNG-10 | Before deleting a view that a Work Queue queue uses, the dialog lists those queues. | Docs (Zoho API blocks deletes with associations) | P0-7, Q11 | Missing — deleted silently; the queue then shows "source view unavailable" | A18 | G10, Z17 |

## 11 List view grid, filters, selection and bulk actions

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-GRID-1 | Sort by one field, ascending or descending, from the header and from a Sort control. | Live | P0-5 | Built | — | F5, F6, F16 |
| CVR-GRID-2 | "Total Records N" and paging; records per page can be chosen. | Live | P0-1 | Built | — | F7, F8 |
| CVR-GRID-3 | A–Z letter filter ("All / A…Z") on the name column. | Live | not in PRD | Missing in CRM modules (Desk has one) | B9 | Z48, Z49 |
| CVR-GRID-4 | Row actions menu on hover: Edit, Send Email, Create Task, Add Tags, Change Owner, Convert, Delete, Copy URL, More (create call, meeting, appointment). | Live | P1-6 | Missing — only inline "Edit field" | A13 | F14, F18, Z20 |
| CVR-GRID-5 | Activity badge and Notes badge on each row; can be switched off in Manage Columns. | Live (icons) / Docs | P1-6 | Missing | A14 | Z21 |
| CVR-GRID-6 | An empty view reads as "no records", not as an error. | Live ("No Leads found.") | §5 | Built | — | F15 |
| CVR-FLT-1 | Filter panel with a search box and "Filter By Fields"; filters apply on top of the view. | Live | N5 | Built | — | C16, F19 |
| CVR-FLT-2 | "System Defined Filters": Activities, Campaigns, Latest Email Status, Locked, Record Action, Related Records Action, Touched Records, Untouched Records, Cadences. Website Activity where SalesIQ is connected. | Live (Website Activity: Docs) | N5 | Missing — "These filters aren't available yet" | A21 | F19, Z25 |
| CVR-FLT-3 | "Filter By Related Modules" section. | Live | N5 | Missing | B2 | Z32, Z33 |
| CVR-FLT-4 | "Save filter" after a filter is applied; saved filters are per user and per view, can be reordered, and show a record count (Zoho limit 5 or 10 per view by edition). | Live (button) / Docs (rest) | N5 | Missing | B1 | Z28–Z31 |
| CVR-SEL-1 | Tick rows or the whole page; a bar shows "N Record(s) Selected", Clear, and the actions. Selection is cleared when the view changes. | Live | P0-8 | Built | — | F9, F10 |
| CVR-SEL-2 | "Select all records in this view" across pages, with a cap, respecting criteria and permissions. | Docs | P0-8 | Missing — exists only inside Mass Delete | A12 | Z13 |
| CVR-BULK-1 | Bulk actions act only on the selected records. | Live | P0-8 | Built | — | F11 |
| CVR-BULK-2 | Working actions: Delete, Mass Delete, Mass Update, Export, Manage Tags, Import, Import History. | Live | N4 | Built | — | F12, F13 |
| CVR-BULK-3 | Module menu actions: Mass Convert, Mass Email, Drafts, Approve Leads, Deduplicate Leads, Add to Campaigns, Create Client Script, Zoho Sheet View, Print View. | Live | N3, N4 | Partly — present but only show "Coming soon" | A19 | F12, J5, Z23 |
| CVR-BULK-4 | Selection actions: Run Macro, Create Task, Change Owner, Mail Merge. ("Set reminders" is not in live Zoho.) | Live | N4 | Missing | A20 | Z24 |
| CVR-BULK-5 | Selection actions: Cadences, Print Mailing Labels, Print Using Canvas, Export Selected Records. Module menu: Assignment Rules, Mass Transfer. | Live | N4 | Missing (assignment rules exist in the code; not checked on screen) | B11 | Z53–Z55 |

## 12 Kanban views

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-KAN-1 | Kanban View Settings: name, Categorize By (required), Aggregate By (optional), Header Style (mono / multi colour), Share this with, Select Fields. | Live | P0-9 | Built | — | H1–H8 |
| CVR-KAN-2 | Several Kanban views per module, each with its own categorize field. | Docs | P0-9 | Built | — | H10, H11 |
| CVR-KAN-3 | Manage Kanban views page; delete with confirmation. | Docs | P0-10 | Built | — | H12, H13 |
| CVR-KAN-4 | Columns follow the pick list order; records with no value appear in an extra column; counts and totals come from the server; columns load more on demand. | Docs | P0-9 | Built | — | I1–I4, H14 |
| CVR-KAN-5 | Dragging a card is a normal record edit: required fields, Blueprint, workflow and audit all apply. | Docs | P0-9 | Built | — | I6–I12 |
| CVR-KAN-6 | Collapse and expand columns, create from a column, layout and pipeline pickers, stage probability on Deals. | Docs | P0-9 | Built | — | I5, I14, I15, I19 |
| CVR-KAN-7 | Cards can be moved with the keyboard. | — | NFR | Built (CRM extra) | — | I13 |
| CVR-KAN-8 | Sort the cards by a chosen field. | Docs | P0-9 | Missing | A15 | Z14 |
| CVR-KAN-9 | Reorder your Kanban views; hover shows creator, last modifier and time. | Docs | P0-10 | Missing | A16 | Z15 |
| CVR-KAN-10 | Aggregate by a rollup summary field. | Docs | P1-7 | Missing — "Rollup summaries cannot be totalled." | A17 | Z16 |
| CVR-KAN-11 | A separate permission to create, edit and delete Kanban views. | Docs | P0-10, Q2 | Missing | A8 | Z10 |
| CVR-KAN-12 | The board shows only records the viewer can access, and totals only over them. | — | P0-6 | Not confirmed | — | I17, K8 |

## 13 Permissions, API and non-functional

| ID | Requirement | Zoho | PRD | CRM today | Gap | Tests |
|---|---|---|---|---|---|---|
| CVR-PERM-1 | A profile permission controls who can create custom views. | Docs ("Manage Custom Views") | P0-2, Q2 | Missing — every user can create private views | A7 | Z9 |
| CVR-PERM-2 | Only administrators change the columns of standard views; other users get a personal override. | Docs | P0-1 | Not confirmed | — | A7 |
| CVR-PERM-3 | Another tenant can never read or change a view. | — | G3 | Built (to be proven) | — | A9, K6, K11 |
| CVR-PERM-4 | No token, an expired token or missing tenant headers return no data. | — | — | Built (to be proven) | — | A10, A11 |
| CVR-API-1 | Views API: list, get, create, update, delete, clone, pin under `/api/v1/modules/{m}/views`. | Docs (Zoho documents read and change-sort; create/update/delete are in its OpenAPI file only) | P2-3 | Built | — | C19–C22, K2–K4, K9 |
| CVR-API-2 | Read-only keys cannot be set through the API (`is_system`, owner, `can_edit`, version). | — | — | Built (to be proven) | — | C21 |
| CVR-API-3 | The API never returns 500 for bad input and never leaks whether a private view exists. | — | — | Built (to be proven) | — | C22, K4, K9 |
| CVR-NFR-1 | Arabic and RTL across the picker, editor, manage page, Kanban and Split. | — | NFR | Built (two Arabic plural texts may be missing) | — | L1–L3, E2E-6 |
| CVR-NFR-2 | Keyboard and screen-reader use of the picker, editor and board. | — | NFR | Built (to be proven) | — | L4, L5 |
| CVR-NFR-3 | First page of a view within 1.5 s (p95); Kanban headers and first cards within 2 s (p95). | — | NFR | Not confirmed | — | L8–L10 |
| CVR-NFR-4 | Works on Chrome, Edge and Firefox, and at phone width. | — | — | Not confirmed | — | L6, L7 |
| CVR-NFR-5 | View names and criteria text are shown as text everywhere (no script runs). | — | — | Built (to be proven) | — | C2, K1 |

---

## 14 Not gaps and out of scope

Not gaps (CRM matches Zoho, or you decided so):
- **Favourites** — live Zoho's view menu is Edit, Pin, Clone, Delete View. CRM has Pin view (CVR-MNG-6).
- **Setting a default view** — no such control in live Zoho. CRM opens the last used view (CVR-PICK-7).
- **"Other users' views" group** — withdrawn by you on 1 Oct 2026; not shown in the live picker.
- **"Recently Viewed" standard view** — not in the live Leads view list.
- **More standard views** — Zoho also has All Locked, Converted, My Converted, Leads in Review, Mailing Labels, Unread and Unsubscribed Leads. Treated like Converted / Junk Leads, which you ruled "not a gap".
- **Following records from the list, merging columns, a create/delete API for views** — Zoho does not offer them (CRM has the API).
- **Work Queue queues and module views kept apart** — already filed as NDC-1836.

Out of scope in NDC-1868, kept in the missing list for triage:
- Chart, Timeline, Grid, Map and Canvas views (N1, N2) — gap A22, test Z18.
- Sheet View and Print View (N3) — part of gap A19, tests J5, Z23.
- Rebuilding bulk operations (N4) and Smart Filters (N5) — gaps A19–A21, B1, B2, B11.

## 15 Not confirmed — what blocks it

| What | Why | Needed |
|---|---|---|
| Everything a lower profile is needed for (CVR-SHARE-3 to -6, CVR-PERM-2, CVR-COL-4, CVR-KAN-12, and Zoho's lock rules) | The second account signs in but the app stays on "Signing in…" | A working Manager or User account on NDC-Staging |
| CVR-REL-5 subform criteria | No module with a subform on NDC-Staging | A module with a subform |
| CVR-CRIT-17 Last Activity Time | Not yet checked on the CRM screen | Run D25 |
| CVR-CRIT-8 date "isn't" and "is not empty" | Not in the operator list recorded in spec v2 | Run D1 on a date field |
| CVR-EDIT-11 audit log | Not yet checked | Run C24 |
| Zoho Kanban sort, reorder and rollup (CVR-KAN-8 to -10); "Select all records in this view" (CVR-SEL-2) | Not seen live: needs a Kanban view to be created in Zoho, and more records than one page | Rest on Zoho's help pages |
| Analytics events in NDC-1868 §10 | Cannot be seen from the UI | Analytics access |

## 16 Open questions for the product owner

1. Do you accept the 11 new gaps (missing list Part B) as requirements? Until you say so they are marked "not in PRD" here and "not filed" in the test spec.
2. CVR-CRIT-6: Zoho has fiscal quarter and fiscal year only. Should CRM also offer plain calendar quarters (NDC-1869 item 5 lists both)?
3. CVR-BULK-4: "Set reminders" is not in live Zoho. Remove it from NDC-1869 item 20?
4. CVR-SHARE-7: if "Lock this View" is built, who may unlock — the creator and administrators only (Zoho's rule)?
5. CVR-FLT-4: how many saved filters per view (Zoho: 5 or 10 by edition)?
6. NDC-1868 questions still open: Q2 (which profiles may create, share and manage Kanban), Q4 (workflow rules on large bulk actions), Q11 (block, warn or cascade when deleting a view in use), Q13, Q14 (what a view may reveal about hidden fields and records).
