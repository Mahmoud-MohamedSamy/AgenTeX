# Spec — CRM Custom Views (List, Kanban, Split)

| | |
|---|---|
| App | TAVI CRM — `https://crm.taviportal.com` (tenant NDC-Staging) |
| Feature spec (PRD) | NDC-1868 — local copy `Test Cases/CRM/custom-views-spec.md` |
| Version | **v3 — draft for review** (2 Oct 2026). v2 = `spec-crm-custom-views-v2.md`; see "Changes in v3" below |
| Gap ticket | NDC-1869 — 22 missing functions (Z5–Z27); each of those Z rows names its NDC-1869 item number. Z28–Z55 are the 11 new gaps from the live Zoho check (missing list Part B) and are **not filed yet** |
| Requirements | `docs/custom-views/custom-views-requirements-v3.md` — every requirement (`CVR-…`) points to scenarios here |
| Missing list | `docs/custom-views/custom-views-missing-list.md` |
| Test cases (v3) | `docs/custom-views/Custom Views - Spec v3 Test Cases.xlsx` (ids `CVS-<scenario id>`) |
| Related | NDC-1836 (queues vs views), NDC-1317 (Kanban defects), NDC-1644 (Work Queue), NDC-1478 (Missing module views) |
| Existing test cases | `Test Cases/CRM/Custom Views.xlsx` (CV-001…CV-179), mapped in §Traceability |
| Reference product | Zoho CRM — List View, Kanban View, Module Views, Custom View API v8 |
| Written | 1 Oct 2026, from bundle `index-DfcbYBNN.js` + live API + UI (owner account); v2 re-checked against the Zoho list-view FAQ, list-view and NextGen list-view help pages, and the same build |

### Changes in v3
1. **Zoho CRM checked live** (2 Oct 2026, Leads module, admin account): view picker, Manage Custom View page, New Custom View form (operator lists per field type, sharing picker, lock), list view grid (header menu, column settings, row menu, selection bar, module menu), filter panel and Kanban settings dialog. Nothing was created in Zoho.
2. **New Group Z rows Z28–Z55** for the 11 new gaps (missing list Part B): saved filters, filter by related modules, Lock this View, owner criteria by role, Previous / Next N units, text operators on pick lists, Wrap Text, Reset Column Size, A–Z letter filter, bulk delete of views, more selection and module actions. They are not in NDC-1869 yet.
3. **Z7 corrected**: live Zoho has fiscal quarter and fiscal year operators only — no plain calendar-quarter operator. The build does have a tenant fiscal-year setting (Company settings → Fiscal year), so Z7 is no longer blocked by a missing setting.
4. **Z24 corrected**: "Set reminders" is not in live Zoho's selection menu and is removed from the expected result.
5. **J5 corrected**: Zoho's Sheet View article says 100 existing rows plus 200 new rows; the list-view FAQ says 999. Both are quoted.
6. **New D25**: Last Activity Time as a criteria field (NDC-1868 P1-5) — Zoho offers it (seen live); to be run on CRM.
7. Zoho details confirmed live and added to the expected results of existing gaps: sharing picker kinds (Z8), header menu items (Z12), row menu items (Z20), System Defined Filters list (Z25), Manage page grouping (Z27).
8. Traceability extended with the new requirements; a requirements document was added (see the table above).

### Changes in v2
1. **Re-checked against Zoho docs** — [FAQs: List Views](https://help.zoho.com/portal/en/kb/crm/faqs/list-view/articles/faqs-list-views-in-zoho-crm), [Managing List Views](https://help.zoho.com/portal/en/kb/crm/customize-crm-account/managing-module-views/articles/list-view), [Managing List Views (NextGen)](https://help.zoho.com/portal/en/kb/crm-nextgen/customize-crm-account/managing-module-views/articles/nextgen-list-view), [Managing Profile Permissions](https://help.zoho.com/portal/en/kb/crm/security-control/profile-management/articles/manage-profile-permissions).
2. **New Group Z rows Z19–Z25** (column resize, row actions menu, activity/notes badges, Converted/Junk Leads views — later withdrawn, see item 12 — "Coming soon" actions, missing bulk actions, unavailable system-defined filters).
3. **F12 and J5 corrected**: Sheet View, Print View, Drafts, Mass Convert, Mass Email (and Approve, Deduplicate, Add to Campaigns, Create Client Script by code) show a "Coming soon" toast — confirmed on screen 1 Oct 2026. Only Delete Selected, Mass Delete, Mass Update, Export, Manage Tags, Import and Import History have handlers.
4. **New F16–F19** for what the re-check showed about the grid (header click sorts directly, no resize handle, rows have inline "Edit field" only, filter panel sections not available).
5. **D21 expected result fixed**: build and Zoho both read `1 or 2 and 3` left to right as `((1 or 2) and 3)` (build help text: "Conditions are read from left to right").
6. Table rows that had an extra "steps" cell under a 4-column header (F10–F14, D23, G4, G8–G13, I11, K2–K5, K7, K9–K11) fixed: the steps now follow the scenario after a colon.
7. Traceability updated for the new rows.
8. Correction for NDC-1869 (applied 1 Oct 2026): Zoho **does** support column width resize ("You can edit and change the order or size of columns, but you can not merge them"), and Sheet/Print views are **not** available in CRM (Coming soon).
9. **Favourites withdrawn as a gap (Z1)**: current Zoho CRM no longer has "Mark as favourite"; it was replaced by **Pin view** (the help pages above still describe the old favourites option). CRM has Pin view, so Z1 is not a gap; G5 now covers it and is the test for the PRD's favourite criteria (P0-1, P0-2; CV-001, CV-018, CV-019). NDC-1869 item 1 should be removed when the ticket is updated (source: user, 1 Oct 2026).
10. **Feature inventory added** (below): built / missing / not a gap / not yet confirmed, each pointing to its test ids.
11. **Picker groups and Manage custom views page** (user notes, 1 Oct 2026): each picker group should collapse/expand, and the Manage custom views page should group views by type (Created by me, Shared with me, Public views, Pinned views — Pinned only once a view is pinned). Checked on the live build the same day: group names are plain labels (no collapse), and the Manage page is one flat table with "All custom views" / "Public views" tabs. Added as expected behaviour in B1 and new B16, and as proposed gaps Z26 and Z27.
12. **Z2, Z3, Z4 and Z22 withdrawn** (user note, 1 Oct 2026): Other users' views for admins, setting a default view, the Recently Viewed standard view, and the Converted Leads / Junk Leads views are not gaps. Their Z rows are kept with strike-through so numbering stays stable, moved to "Not a gap" in the inventory, and removed from traceability. NDC-1869 items 2, 3 and 4 should be removed when the ticket is updated (Z22 was never filed).
13. **NDC-1869 updated to match v2** (1 Oct 2026): old items 1–4 removed, the new gaps added, the column-resize and Sheet/Print statements corrected, and the items renumbered 1–22. Each Z row now names its NDC-1869 item number. The NDC-1868 comment now says 22 missing functions.

---

## Feature inventory

What the CRM build has today compared with current Zoho CRM, as found on 1 Oct 2026 (bundle `index-DfcbYBNN.js`, live API, UI, owner account). Each line points to the scenarios that test it.

### Built in CRM
**View picker and standard views**
- View picker with search, tabs, "Show custom views as a dropdown/tabs", and the groups Recently closed, Pinned views, Created by me, Shared with me and Public views. The Pinned views group appears only once a view is pinned. **Expected but not built yet:** each group can be collapsed and expanded to hide or show its views — today the group names are plain labels (Z26) — B1–B6, Z26
- Manage custom views page: a single table (View Name, Shared To, Created By, Last Modified By, Layout, Actions) with search and two tabs, "All custom views" and "Public views". **Expected but not built yet:** views grouped by type — Created by me, Shared with me, Public views, and Pinned views (shown only once a view is pinned) (Z27) — B16, Z27
- Five standard views: All, My, Recently Created, Recently Modified, Today's. They cannot be renamed, cloned or deleted; their columns, sort and page size can be changed — B7–B10, A7, A12
- Last used view remembered per module, across opening a record and signing out — B11–B14
- Pin view (up to 15), current Zoho's replacement for favourites — G5, G6

**Create and edit a custom view**
- Name (required, up to 120 characters, unique per owner), criteria up to 25 rows, layout scope — C1–C8, C13
- AND/OR pattern with brackets, read left to right like Zoho — D20–D24
- Operators per field type: text, number, date (Today, Yesterday, Tomorrow, this/last/next week, month and year, Age in Days, Due in Days, last/next N days), checkbox, pick list, multi-select, lookup — D1–D16
- Owner = me, tags and review status as criteria — D17, D18, E12
- Lookup field criteria (up to 5 rows) — E8
- Related module criteria with "with" and "without" (up to 3 modules) — E1–E7
- Warning when a criteria field is deleted or hidden — E9–E11
- Columns (up to 30), sort, records per page — C9–C12
- Sharing: Only me, Everyone, Selected users (sharing needs "Manage Shared Views") — C14, C15, A2–A6
- Save-conflict check when two people edit the same view — C18

**List view grid**
- Manage Columns, plus a personal column change that only you see (Save to view / Use the view's columns) — F1–F4
- Click a header to sort, paging, record count, select the rows on a page — F5–F9, F16
- Inline "Edit field" in a row — F14
- Working actions: Delete Selected, Mass Delete, Mass Update, Export, Manage Tags, Import, Import History — F11–F13

**Clone, pin and delete**
- Clone (not for system views), delete with confirmation to the Recycle Bin, restore, Manage custom views page — G1–G4, G7–G13

**Kanban**
- Kanban settings: categorize by pick list, status or radio field, aggregate (number, currency, decimal, percent, formula), mono or multi colour header, up to 10 card fields, sharing, several boards per module, Manage Kanban views — H1–H13
- Board: Unaccounted column, counts and totals from the server, Load more (100 at a time), collapse and expand, create from a column, layout and pipeline pickers, stage probability, 75-column limit notice, refresh every 30 seconds — H14, I1–I5, I14–I20
- Drag-and-drop saves through the normal record update, follows Blueprint and required fields, and can be done with the keyboard — I6–I13

**Other**
- Arabic translations and RTL — L1–L3, D24
- Split view — J1–J4

**CRM extras that Zoho does not have**
- Full create / edit / delete / clone / pin API for views — §2.1, K2–K5
- Save-conflict check on views — C18
- Deleted views go to the Recycle Bin and can be restored — G7, G8
- "In the last / next N hours" and "Before now / After now" operators — D11, D12
- Keyboard way to move Kanban cards — I13

### Missing in CRM
Z1, Z2, Z3, Z4 and Z22 are withdrawn (see "Not a gap"). Z5–Z27 are in NDC-1869 (22 items); the Group Z table gives each one's item number. Z28–Z55 are new in v3 and not filed yet.
- **View picker:** Z26 collapse and expand each picker group · Z27 Manage custom views page grouped by type
- **Criteria:** Z5 number between / not between · Z6 Starting tomorrow / Till yesterday · Z7 quarter and fiscal-year operators
- **Sharing and permissions:** Z8 share with roles and groups · Z9 permission to create custom views · Z10 permission to manage Kanban views
- **List view grid:** Z11 pin (freeze) a column · Z12 header menu with Filter by / Hide · Z13 select all records in the view · Z19 resize column widths · Z20 row actions menu · Z21 activity and notes badges
- **Kanban:** Z14 sort cards · Z15 reorder Kanban views, creator on hover · Z16 aggregate by rollup field
- **Deleting a view:** Z17 warn before deleting a view a Work Queue queue uses (today the queue shows "source view unavailable" afterwards)
- **Actions and filters:** Z23 actions that only show "Coming soon" (Mass Convert, Mass Email, Drafts, Approve, Deduplicate, Add to Campaigns, Create Client Script, Sheet View, Print View) · Z24 Run macro, Create task, Set reminders, Change owner for many records, Bulk mail merge · Z25 System-defined and Website Activity filters
- **Other view types:** Z18 Chart, Timeline, Grid, Map, Canvas (PRD non-goal)

New in v3 — seen in live Zoho on 2 Oct 2026, **not in NDC-1869 yet** (missing list Part B):
- **Filters:** Z28–Z31 Save filter · Z32–Z33 Filter By Related Modules
- **Create / edit a view:** Z34–Z37 Lock this View · Z38–Z39 owner "belongs to Role" · Z40–Z42 date "Previous / Next" N days, weeks, months, years · Z43–Z44 text operators on pick lists
- **List view grid:** Z45–Z46 Wrap Text view mode · Z47 Reset Column Size · Z48–Z49 A–Z letter filter
- **Manage custom views:** Z50–Z52 delete several views at once
- **Actions:** Z53 Cadences, Print Mailing Labels, Print Using Canvas · Z54 Export Selected Records · Z55 Assignment Rules, Mass Transfer

### Not a gap
- Favourites: current Zoho replaced them with Pin view, which CRM has — Z1 (withdrawn), G5
- "Other users' views" group for admins — Z2 (withdrawn; confirmed not a gap by the user, 1 Oct 2026)
- Setting a default view per module — Z3 (withdrawn; confirmed not a gap by the user). CRM opens the last used view, or All — B11–B14
- "Recently Viewed" standard view — Z4 (withdrawn; confirmed not a gap by the user). CRM's standard views are All, My, Recently Created, Recently Modified, Today's — B7
- "Converted Leads" and "Junk Leads" standard views — Z22 (withdrawn; confirmed not a gap by the user)
- `1 or 2 and 3` without brackets: CRM reads it left to right like Zoho — D21
- Following records from the list view: Zoho cannot do it either
- Merging columns: Zoho cannot do it either
- Work Queue queues and module views kept apart: already filed as NDC-1836
- No API to create or delete views: Zoho has none either; CRM has one (extra)

### Not yet confirmed
- Everything marked 🔒 (who can share, edit standard view columns, edit or delete other users' views, drag cards): no working lower-profile account — §1.4
- Subform criteria (PRD P1-2): no module with a subform on NDC-Staging — §1.4
- Last Activity Time as a criteria field (PRD P1-5): the Leads grid has a "Last Activity" column, but it hasn't been checked as a criteria field yet — Traceability P1-5
- Last Activity Time as a criteria field: now has its own scenario, D25
- Date "isn't" and "is not empty" (Zoho has both): not in the build's date operator list in §2.3 — check in D1
- Zoho Kanban sort, reorder and rollup (Z14–Z16) and "Select all records in this view" (Z13): not seen live (needs a Kanban view created in Zoho, and more records than one page); they rest on Zoho's help pages

Tags used on every scenario: `[func]` functional · `[edge]` edge/boundary · `[neg]` negative · `[data]` data-class sweep ·
`[ui]` rendering/i18n/RTL · `[ux]` usability/a11y · `[perf]` performance · `[sec]` security/permissions/API ·
`[int]` cross-module · `[compat]` compatibility · `[e2e]` journey · 🔒 = must run as a second, lower-profile account.

---

## 0 How to run

1. **Order:** §1 preconditions → A → B → C → D → E → F → G → H → I → J → K → L → E2E → Z. A fresh baseline (§1.3) is taken before A and diffed after the last group.
2. **Serial only:** C, G, H, I and every scenario marked `[serial]` write views or records. Run them one at a time — views are shared tenant data and another operator works in this tenant (ZZBUG/ZZRVW fixtures).
3. **Parallel allowed:** A, B, D (read parts), K-read, L-ui, all API GET scenarios.
4. **Exclusive:** `[perf]` scenarios run alone, with nothing else signed in to the account.
5. **`[data]` rows** record: field, operator, input value (exact bytes for odd input), what was saved (GET the view), what the grid returned (count + 3 sample ids), and pass/fail per row.
6. **Sessions:** the account is capped at 5 concurrent sessions (`429 max_sessions_reached`). Every script signs in for itself and signs out through the UI (profile → **Logout**); reload the page before signing out, because open panels cover the profile button. The access token lives ~5 minutes — refresh with `POST /iam/auth/refresh`.
7. **Verdicts:** Pass / Fail / Blocked / Inconclusive. A scenario blocked by an environment precondition (§1.4) is **Inconclusive, not Fail**.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account | Status |
|---|---|---|
| Tenant Owner (admin) | `CRM_USER_EMAIL` in `Automation/CRM-TAVI-Automation/.env` (ndc-staging-owner) | Works |
| Second user, lower profile (Manager or User) 🔒 | needed | **Blocker** — `CRM_USER_ALT1` signs in but the SPA stays on "Signing in…" |
| User of another tenant | throwaway accounts in `Test Data/AnywareStagingTempAccounts.txt` | Works (different tenant) — used for K-isolation only |

Never print passwords or tokens in evidence. Report token **lengths** only.

### 1.2 Test data
- Prefix every created view, Kanban view, split view and record with `QA CV ` (e.g. `QA CV leads-contains`).
- Modules: Leads `841043e1-c078-41f9-8d6e-dfd61bee45c3`, Deals `f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430`, Contacts `6f553963-01d6-4b68-9fb3-143d23044c41`, Tasks `a9d87b62-…`, Subscriptions `6d053261-…`.
- Seed records (create via UI/API in C-setup, `[serial]`): 12 Leads named `QA CV L01…L12` covering every Lead Status value, one with empty status, one with Arabic name, one with whitespace-only Comment, one with 255-char Company; 8 Deals `QA CV D01…D08` across stages with Amount 0, 9999.99, 10000, 10000.01, empty, negative (if allowed), 15000, 1e9.
- Required fields: Leads require `single_line_3_9` on every PATCH (PATCH replaces the whole `data` array).

### 1.3 Baseline (restore point)
Before group A, save:
- `GET /modules/{m}/views?kind=list|kanban|queue` for Leads, Deals, Contacts, Tasks, Subscriptions → `baseline/views-<module>-<kind>.json` (ids, names, `row_version`, `settings`).
- `GET /modules/{m}/list-preferences` for Leads and Deals → `baseline/prefs-<module>.json`.
- `GET /workqueue/queues` → `baseline/queues.json`.
Revert = delete every `QA CV` object, restore preferences, and prove it with the final diff (§Reporting).

### 1.4 Environment blockers
| Blocker | Scenarios affected | Action |
|---|---|---|
| No working lower-profile account | every 🔒 scenario | Inconclusive until provided (requested in NDC-1869) |
| No module with a subform | Z-subform, E-subform | Inconclusive |
| Fiscal year | Z7 | Not a blocker any more: the build has Company settings → Fiscal year. Record its start month before running Z7 |
| Only Deals has a pipeline + blueprint-governed stage (`group_by_blueprint_governed:true`) | I-blueprint | Use Deals |

### 1.5 Things that cannot be undone cleanly
- Deleted views go to the **Recycle Bin**, not away — purge them from Settings → Recycle Bin at cleanup, or record their ids in the report.
- Kanban drags are **record edits**: they fire workflow rules, audit log entries and Blueprint transitions. Only drag `QA CV` records, and check there are no active workflow rules on the target field that send email (`GET /workflow/rules`).
- Pinning a view/queue is per user and capped at 15 — unpin everything you pinned.

---

## 2 Surface and contract

### 2.1 Admin API (all under `/api/v1`, headers `Authorization: Bearer`, `x-tenant-id`, `x-app-key: crm`)
| Method | Path | Notes |
|---|---|---|
| GET | `/modules/{m}/views?kind=list\|kanban\|queue[&layout_id=]` | `{views:[…]}`; default kind in the client is `kanban` |
| GET | `/modules/{m}/views/{v}` | one view; 404 `NOT_FOUND` for unknown id |
| POST | `/modules/{m}/views` | create |
| PATCH | `/modules/{m}/views/{v}` | update; `row_version` → `VERSION_CONFLICT` |
| DELETE | `/modules/{m}/views/{v}` | to Recycle Bin |
| POST | `/modules/{m}/views/{v}/clone` | |
| PUT / DELETE | `/modules/{m}/views/{v}/pin` | pin / unpin (limit 15) |
| GET | `/modules/{m}/related-modules` | modules with a lookup to {m} and their `link_fields` |
| GET | `/modules/{m}/records/board-summary?group_by=&aggregate=&filters=&q=&layout_id=&view_id=` | per-column `count`, `sum`, `unaccounted`, `truncated`, `group_by_blueprint_governed` |
| GET / PUT | `/modules/{m}/list-preferences` | per-user: `lastListViewId`, `openListViewIds`, `recentlyClosedListViewIds` (≤10), column overrides (≤50), `pageSize` (25), `lastView` list/kanban/split, `lastKanbanPipelineId` |
| GET | `/workqueue/queues` | Work Queue aggregation of `kind=queue` views |
| — | `/views`, `/custom_views`, `/settings/custom_views` | 404 (no Zoho-style endpoint) |

View object: `id, module_id, layout_id, kind, name, owner_user_id, visibility (private|everyone|selected), shared_user_ids[], settings, sort_order, row_version, created_*, last_modified_*, can_edit, can_delete, is_system, system_key, pinned, pin_order, category (created_by_me|shared_with_me|public_views)`.

`settings` for **list**: `{sort:{field,dir}|null, columns:[], criteria:{pattern, conditions:[{field,operator,value}]}|null, page_size|null, related_criteria:[{module_id, link_field, mode:with|without, criteria?}]}`.
`settings` for **kanban**: `{categorize_field, aggregate_field|null, header_style:mono|multi, card_fields:[]}`.
`settings` for **queue**: list settings + `source: criteria|view|date` (+ `view_id`).

### 2.2 Field register (limits found in the client bundle — server must enforce the same)
| Item | Kind | Limit |
|---|---|---|
| View name | text | required, ≤120 chars, unique per owner per module (`VIEW_NAME_TAKEN`) |
| Criteria rows | list | ≤25 |
| Lookup-path rows | list | ≤5 |
| Related modules | list | ≤3 blocks, ≤3 rows each |
| Pattern | text | ≤200 chars, digits/and/or/brackets, nesting ≤3 |
| Columns | list | 30 max, tip shown above 10 |
| Page size | int | 10–200 |
| `last_n_days`/`next_n_days`/`age_in_days`/`due_in_days` | int | 0/1–3650 |
| `last_n_hours`/`next_n_hours` | int | 1–720 |
| Pinned views | count | ≤15 |
| Kanban card fields | list | ≤10 (default 3), record name always first |
| Kanban columns | count | ≤75, notice "Only the first {{max}} values are shown as columns." |
| Kanban column page | int | 100 records per "Load more" |
| Board summary refresh | timer | 30 s |
| Shared users | list | users only (no roles/groups) |

### 2.3 Operators per field type (build)
- Text: equals, not_equal_to, contains, does_not_contain, starts_with, ends_with, is_empty, is_not_empty.
- Number/currency/decimal/percent: equals, not_equal_to, greater_than, less_than, ≥, ≤, is_empty, is_not_empty. *(no between — Z5)*
- Date: is, is_before, is_after, is_between, is_not_between, today, yesterday, tomorrow, this/last/next week, this/last/next month, this/last/next year, last_n_days, next_n_days, age_in_days, due_in_days, before_now, after_now, empty. *(no starting tomorrow / till yesterday — Z6; no fiscal — Z7; no previous / next N weeks, months, years — Z40; Zoho also has "isn't" and "is not empty")*
- Datetime: date set + last_n_hours, next_n_hours.
- Checkbox: is_true, is_false.
- Picklist/status/department/team: equals, not_equal_to, contains_any_of, contains_none_of, empty. *(no contains / starts with / ends with — Z43)*
- Multi-select: contains_any_of, contains_all_of, contains_none_of, empty.
- Lookup/pipeline: equals, not_equal_to, empty. *(no "belongs to Role" on owner fields — Z38)*
- Synthetic fields: owner (incl. `$me`), source, tags, review_status (permission-gated).

### 2.4 Page states and messages (en)
Picker: "Tick the views to show as tabs, or click a name to open it." · groups Recently closed / Pinned views / Created by me / Shared with me / Public views · footer "Show custom views as a dropdown|tabs", "New custom view", "Manage custom views", "* System-defined custom view" · empty "No views match." · group names are plain labels (not collapsible); Pinned views shown only when a view is pinned.
Manage custom views (`/modules/{m}/views/manage?layout=…`): "Manage {{module}} custom views", "Create custom view", search "Search by name", tabs "All custom views" / "Public views", columns View Name · Shared To · Created By · Last Modified By · Layout · Actions, legend "* System-defined custom view", empty "No custom views match.", error "The custom views could not be loaded."
Tab menu: Edit, Edit columns, Pin view / Unpin view, Clone ("You cannot clone a system-defined view."), Close view, Delete view.
Editor (`/modules/{m}/views/new?layout=…`, `/views/{v}/edit`): "New custom view for {{module}}", "Applies to the "{{layout}}" layout — its fields and its records.", "Enter a name for the view.", "A view name can be at most {{max}} characters.", "You already have a view with this name.", "Fix the criteria pattern: every row number must appear once, and brackets must match.", "At most {{max}} criteria rows can use fields of lookup modules.", "A view can use at most {{max}} related modules.", "No columns chosen: everyone sees their usual columns.", "Tip: more than {{max}} columns makes the table hard to read.", "You need the Manage Shared Views permission to share a view with other people.", "Choose at least one user, or share with everyone instead.", "System-defined views keep their name and criteria. You can change their columns, sort and page size.", "Some fields in this view's criteria are deleted or hidden from you: {{fields}}…", "Someone else saved this view after you opened it. Reload…", "View not found — This view was deleted, or it is not shared with you.", "You cannot edit this view — Only its owner, or someone who can manage shared views, can change it."
Delete: "Delete custom view? Are you sure you want to delete the "{{name}}" custom view? It moves to the Recycle Bin; its records are not affected."
Columns override: "You changed the columns for this view. Only you see this change." · "Save to view" · "Use the view's columns".
Kanban: "Add a pick list, status or radio-button field to this module to use the Kanban view", "Create a Kanban view to use this board", "No Kanban views yet", "Unaccounted", "This value is no longer an option of the field", "Probability {{value}}%", "Cannot update as the record is under the Blueprint", "Choose the transition to {{column}}", "{{field}} is required, so a record cannot be left without a value.", "Could not move the record.", "The board is still loading — try again in a moment.", "Only the first {{max}} values are shown as columns.", delete "\"{{name}}\" will move to the Recycle Bin. The records it shows are not affected."
Unavailable: "Custom views are not available — Custom views are turned off for this workspace."

### 2.5 Data classes (D1–D20; `_COMMON.md` is not on this machine, so they are listed here)
D1 empty · D2 whitespace only · D3 single char · D4 max length · D5 max+1 · D6 leading/trailing spaces · D7 case variants · D8 Arabic · D9 mixed Arabic/Latin + RTL marks · D10 emoji/astral · D11 HTML/script (`<img src=x onerror=alert(1)>`) · D12 SQL-ish (`' OR 1=1 --`) · D13 path/URL chars (`../`, `%2e`) · D14 zero-width/control chars · D15 numeric edge (0, negative, decimal, 1e9, `15,000`, Arabic-Indic `١٥٠٠٠`) · D16 date edge (29 Feb, DST, 23:59 Cairo vs UTC) · D17 type confusion (number as string, array for scalar, object, null) · D18 unknown field / operator id · D19 duplicate (same name / same row twice) · D20 very long list (limit+1 items).

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Owner sees full view UI | Open Leads as owner | Tabs, picker, New custom view, Manage custom views, Kanban/Split switchers present | `[func]` |
| A2 | Lower profile can create a private view | 🔒 user without Manage Shared Views → New custom view → save `QA CV private` | Saved; Everyone/Selected disabled with "You need the Manage Shared Views permission…" | `[sec]` 🔒 |
| A3 | Sharing gate in API | 🔒 same user: POST view with `visibility:"everyone"` | 403/422; no public view created | `[sec]` 🔒 |
| A4 | Recipient cannot edit/delete shared view | 🔒 owner shares `QA CV shared` with user → user opens Edit URL and calls PATCH/DELETE | UI shows "You cannot edit this view"; API refuses; `can_edit=false`, `can_delete=false` | `[sec]` 🔒 |
| A5 | Private view by id | 🔒 user GETs owner's private view id, opens `/modules/{m}/views/{id}/edit` | 404 / "View not found"; no settings leak | `[sec]` 🔒 |
| A6 | Selected-users outsider | 🔒 view shared with user X; user Y lists views and GETs id | Not listed; GET refused | `[sec]` 🔒 |
| A7 | Standard view columns by non-admin | 🔒 user opens All Leads → Edit columns → Save to view | Only a personal override ("Only you see this change"); system view `row_version` unchanged | `[sec]` 🔒 |
| A8 | Kanban drag without edit rights | 🔒 user without `metadata.records.manage` opens board | Cards not draggable; PATCH refused | `[sec]` 🔒 |
| A9 | Other tenant | Sign in as a throwaway tenant user; GET a NDC-Staging view id with own token | 404; nothing returned | `[sec]` |
| A10 | No token / expired token | Call GET views without bearer, then with a 6-min-old token | 401 `TOKEN_MISSING` / expired; no data | `[sec]` |
| A11 | Missing tenant headers | Call with bearer but no `x-tenant-id` | Same result as with header, or 400 — record which; never another tenant's data | `[sec]` |
| A12 | Direct URL to editor of system view | `/modules/{m}/views/{allLeadsId}/edit` | Opens with "System-defined views keep their name and criteria…"; name and criteria read-only | `[func]` |
| A13 | Feature turned off message | (if a workspace with custom views disabled exists) open module | "Custom views are not available"; else mark Inconclusive | `[func]` |

## Group B — Picker, tabs, standard views, persistence

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | Groups | Create one view of each category (mine, shared to me 🔒, public) → open picker | Headings in order: Recently closed, Pinned views, Created by me, Shared with me, Public views; system views marked `*`; Pinned views appears only once a view is pinned and disappears when the last one is unpinned; empty groups are not shown; each group can be collapsed and expanded to hide/show its views (today: plain labels, no collapse — Z26) | `[func]` |
| B2 | Search | Type part of a name, a name in another case, Arabic name, a string with no match | Filters across groups; case-insensitive; "No views match." | `[func]` `[data]` |
| B3 | Tabs | Tick/untick views to show as tabs; reload | Tabs persist (`openListViewIds`) | `[func]` |
| B4 | Pinned tab cannot be hidden | Pin a view, try to untick its tab | Blocked with "Pinned views always show as tabs…" | `[edge]` |
| B5 | Close view → Recently closed | Close a tab | Appears under Recently closed; max 10 kept (close 11) | `[edge]` |
| B6 | Dropdown mode | "Show custom views as a dropdown" then back to tabs | Layout switches and persists | `[ux]` |
| B7 | Standard views present | Each of Leads, Deals, Contacts, Tasks, Subscriptions | All, My, Recently Created, Recently Modified, Today's `{{module}}`; criteria behave as named | `[func]` |
| B8 | "My" view | Owner vs 🔒 user | Shows only records owned by the viewer | `[func]` |
| B9 | "Today's" view at day boundary | Record created 23:50 and 00:10 Cairo time | Uses tenant timezone (Cairo), not UTC | `[edge]` |
| B10 | Standard view actions | Open menu on All Leads | Edit columns, Pin, Close only; Clone disabled with tooltip; no Delete/Rename | `[func]` |
| B11 | Last view survives navigation | Select `QA CV x`, sort, page 2, open a record, Back | Same view, sort, page (NDC-1317) | `[func]` |
| B12 | Last view survives sign-out | Select view, sign out/in | Restored from `lastListViewId` | `[func]` |
| B13 | Per module | Change view on Leads; open Deals | Deals unchanged | `[func]` |
| B14 | `?view=` URL | Open `/modules/{m}?view={id}` for own, shared, deleted, foreign ids | Own/shared open; deleted/foreign fall back to All with no crash | `[edge]` `[sec]` |
| B15 | Two tabs preferences | Tab 1 opens view A, tab 2 view B, close tabs in each | Record final `list-preferences`; lost update = possible bug (NDC-1869 note) | `[edge]` |
| B16 | Manage custom views page | Picker → Manage custom views (`/modules/{m}/views/manage`); search; switch tabs; pin and unpin a view, reload | Lists every view the user can see with View Name, Shared To, Created By, Last Modified By, Layout, Actions; search filters by name; views grouped by type — Created by me, Shared with me, Public views, and Pinned views only while at least one view is pinned (today: one flat table with "All custom views" / "Public views" tabs — Z27) | `[func]` |

## Group C — Create and edit a list view `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | No criteria | Name only, Save | Created by me; returns every record the user can access; count equals All | `[func]` |
| C2 | Name D-sweep | Name = D1, D2, D3, D4(120), D5(121), D6, D7 (vs existing), D8, D9, D10, D11, D14 | D1/D2 → "Enter a name for the view."; D5 → "at most 120"; D6 trimmed (record); D7 → document rule; D11 rendered as text everywhere (picker, tab, manage page, delete dialog) | `[data]` `[sec]` |
| C3 | Duplicate name same owner | Save `QA CV dup` twice | "You already have a view with this name." (`VIEW_NAME_TAKEN`) | `[neg]` |
| C4 | Same name different owner | 🔒 user saves `QA CV dup` | Allowed | `[edge]` 🔒 |
| C5 | Same name across kinds | Create list `QA CV k` and queue `QA CV k` | Record whether allowed (kinds are separate rows) | `[edge]` |
| C6 | Incomplete row | Field + operator, no value → Save | Row flagged; save blocked | `[neg]` |
| C7 | Value-less operator | is_empty / today / is_true | Saves without a value | `[func]` |
| C8 | 25 rows | Add 25 rows; try 26th | Add disabled at 25; API POST with 26 rejected | `[edge]` `[sec]` |
| C9 | Columns | Choose 8 columns, reorder, Save | Grid shows exactly those, in order | `[func]` |
| C10 | No columns | Save with none chosen | "everyone sees their usual columns" behaviour | `[func]` |
| C11 | 11 and 30 columns; 31 via API | | Tip above 10; 30 allowed; 31 rejected server-side | `[edge]` |
| C12 | Sort and page size | Sort by Created desc, page 10 / 200 / "Each person's usual" | Applied; 9 and 201 via API rejected | `[edge]` |
| C13 | Layout scope | Create on Standard layout; switch layout | View applies only to that layout's fields/records ("Applies to the … layout") | `[func]` |
| C14 | Sharing — Selected with none | Selected users, no user chosen | "Choose at least one user, or share with everyone instead." | `[neg]` |
| C15 | Edit propagates | Owner edits criteria of a shared view | 🔒 recipient's results change on next load | `[func]` 🔒 |
| C16 | Prefilled from filters | Apply Smart Filter on list, then New custom view | "The criteria start with the filters applied on the records page." and rows prefilled | `[func]` |
| C17 | Cancel | Fill form, Cancel / Back to records | Nothing created (GET list unchanged) | `[func]` |
| C18 | Version conflict | Open edit in two tabs, save tab 1, save tab 2 | Tab 2 shows "Someone else saved this view…" + Reload; no silent overwrite | `[edge]` |
| C19 | Double submit | Double-click Save / two POSTs in parallel | One view only | `[edge]` |
| C20 | Partial PATCH | PATCH with only `{name}` | Other settings preserved (record) | `[edge]` |
| C21 | Read-only keys | PATCH `is_system:true`, `owner_user_id:<other>`, `category`, `can_edit`, `row_version:999` | Ignored or rejected; GET shows unchanged | `[sec]` |
| C22 | Type confusion | POST with D17 in name, columns, criteria, page_size | 400/422, no 500, no partial row | `[sec]` `[data]` |
| C23 | Session expiry | Leave editor open > 5 min, Save | Token refresh then save, or clear sign-in prompt; no data loss without warning | `[edge]` |
| C24 | Audit | After C1/C15/G-delete check Settings → Audit Log | Create/edit/share/clone/delete recorded with actor and time (PRD NFR) | `[int]` |

## Group D — Criteria operators and pattern

Run each `[data]` row via the editor and assert the grid count against an independent API filter (`GET /modules/{m}/records?filters=…`) with the same condition.

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| D1 | Operator list per field type (§2.3) | Exactly the listed operators; none extra/missing | `[func]` |
| D2 | Text: equals/not_equal/contains/does_not_contain/starts_with/ends_with with D3, D6, D7, D8, D10, D12, D14 | Correct split; case rule same as module filter; D12 treated as literal | `[data]` `[sec]` |
| D3 | Text is_empty / is_not_empty with null, "", whitespace-only | Rule documented and identical to module filter | `[edge]` |
| D4 | Number: =, ≠, >, <, ≥, ≤ at 9999.99 / 10000 / 10000.01 | Boundary exact | `[edge]` |
| D5 | Number value D15: `15,000`, `١٥٠٠٠`, `1e9`, `-1`, `abc` | Never stored as 15; normalised or rejected with message | `[data]` |
| D6 | Number empty vs 0 | Empty ≠ 0 | `[edge]` |
| D7 | Date is/before/after/between/not between incl. same-day bounds | Bounds rule stated and consistent | `[edge]` |
| D8 | today/yesterday/tomorrow at 23:50 and 00:10 Cairo | Tenant timezone | `[edge]` |
| D9 | this/last/next week, month, year | Calendar boundaries correct (week start documented) | `[func]` |
| D10 | last_n_days / next_n_days / age_in_days / due_in_days with 0, 1, 3650, 3651, -1, 1.5 | 0/1–3650 accepted, others rejected | `[data]` |
| D11 | Datetime last_n_hours / next_n_hours 1, 720, 721 | 721 rejected | `[edge]` |
| D12 | before_now / after_now | Correct split at now | `[func]` |
| D13 | Checkbox is_true / is_false (unset value?) | Unset treated as false or excluded — record | `[edge]` |
| D14 | Picklist equals / not_equal / contains_any_of / contains_none_of incl. a value later removed from the picklist | Stale value handled, no crash | `[edge]` |
| D15 | Multi-select any_of / all_of / none_of | Correct set logic | `[func]` |
| D16 | Lookup equals / empty | Correct | `[func]` |
| D17 | Owner = `$me` | Each user sees own records 🔒 | `[func]` 🔒 |
| D18 | Tags criteria | Records with tag only | `[func]` |
| D19 | Unknown field / operator via API (D18) | 400/422 | `[sec]` |
| D20 | Pattern: default AND for 3 rows | Results equal 1 and 2 and 3 | `[func]` |
| D21 | Pattern `1 or 2 and 3` (no brackets) | Read left to right as `((1 or 2) and 3)`, same as Zoho; the editor help says "Conditions are read from left to right"; results match that grouping, and the saved pattern reopens fully bracketed (PRD Q1) | `[edge]` |
| D22 | Pattern errors: unbalanced, `()`, `(and)`, `1 and`, `1 2`, `1 and 5` (row missing), unused row, row used twice, word `xor`, `AND` upper-case, 201 chars, depth 4 | "Fix the criteria pattern…" (or specific message); save blocked; API rejects too | `[neg]` `[data]` |
| D23 | Pattern round trip: save `(1 or 2) and 3`, reopen | Same meaning; record canonical form | `[func]` |
| D24 | Pattern in RTL | Arabic UI: row numbers, brackets and and/or read correctly | `[ui]` |
| D25 | Last Activity Time as a criteria field: Age in Days = 7 on a lead with a note today and a lead with no activity | Field offered with the date-time operators; only the lead with recent activity is returned; adding a note brings the other lead in (NDC-1868 P1-5; Zoho offers the field) | `[func]` |

## Group E — Related modules, lookup paths, hidden fields

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| E1 | Related: Contacts *with* Deals Stage = Negotiation | Contacts having ≥1 such deal | `[func]` |
| E2 | Related: *without* Deals | Contacts with no deals | `[func]` |
| E3 | Without + record the viewer cannot see 🔒 | Rule per PRD Q14 — record; leak of hidden existence = finding | `[sec]` 🔒 |
| E4 | "Any link field" vs a specific link field (Deals has many lookups: Connected To, Lookup 2…) | Specific link narrows correctly | `[func]` |
| E5 | 3 related blocks; 4th | "A view can use at most 3 related modules." ; API refuses 4 | `[edge]` |
| E6 | 3 rows in a block; 4th | Blocked | `[edge]` |
| E7 | Module with no lookup to it | "No module has a lookup to {{module}} yet." | `[func]` |
| E8 | Lookup path rows (e.g. Account Name › Industry) ≤5; 6th | "At most 5 criteria rows can use fields of lookup modules." | `[edge]` |
| E9 | Criteria field later deleted | Banner "Some fields in this view's criteria are deleted or hidden…"; view still runs | `[edge]` |
| E10 | Criteria field hidden for viewer 🔒 | Masked, read-only; view runs (PRD Q13 — record inference) | `[sec]` 🔒 |
| E11 | Column of a field hidden for viewer 🔒 | Column absent **and** value absent from API response | `[sec]` 🔒 |
| E12 | review_status synthetic field without review permission 🔒 | Not offered | `[sec]` 🔒 |

## Group F — Columns, sort, page size, selection in the grid

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| F1 | Manage Columns: show/hide, required locked, reset | Works; record-name column cannot be hidden | `[func]` |
| F2 | Personal override | Change columns on a shared view → "Only you see this change" → other user unchanged 🔒 | `[func]` |
| F3 | Save to view / Use the view's columns | Owner saves override into the view; reset restores | `[func]` |
| F4 | Override limit 50 views | Override 51 views (API) → oldest dropped or rejected — record | `[edge]` |
| F5 | Header sort asc/desc on text, number, date, empty values | Correct order; empties placement consistent | `[func]` |
| F6 | Toolbar sort control | Same results as header sort; label "Sort: field dir" | `[func]` |
| F7 | Page size 10/25/50/100/200 and paging | Counts and page indicator correct; last page partial | `[func]` |
| F8 | Count matches rows | Header "N records" = rows across pages = API total | `[func]` |
| F9 | Select page | Header checkbox selects visible page; bar shows count | `[func]` |
| F10 | Selection cleared on view change: select rows, then switch view | Selection cleared | `[edge]` |
| F11 | Bulk action uses selection only: Mass Update on 2 selected `QA CV` leads | Only those 2 change | `[int]` `[serial]` |
| F12 | Module actions menu: open every item (with and without a selection) | **Working:** Delete Selected, Mass Delete, Mass Update, Export, Manage Tags, Import, Import History open their screens. **"Coming soon" toast:** Mass Convert, Drafts, Mass Email, Approve Leads, Deduplicate Leads, Add to Campaigns, Create Client Script, Sheet View, Print View (see Z23). Items needing a selection are disabled with "Select at least one record" when nothing is selected | `[int]` |
| F13 | Export from a view: Export Leads while `QA CV` view active | Record whether export respects the view criteria/columns | `[int]` |
| F14 | Inline edit in grid: "Edit field" on a `QA CV` cell | Saves through record rules (validation, required) | `[int]` `[serial]` |
| F15 | Empty view: criteria matching nothing | Empty state reads as empty, not error | `[ux]` |
| F16 | Header click: click a column header (e.g. Lead Status) | Sorts directly (URL gets `?sort=lead_status:asc`), click again → desc; no header menu today (see Z12) | `[func]` |
| F17 | Column width: drag a header border | No resize today (see Z19); after build: width kept per user per view, shared definition unchanged | `[func]` |
| F18 | Row hover: hover a list row | Today only inline "Edit field" buttons; no row actions menu, no activity/notes badge (see Z20, Z21) | `[func]` |
| F19 | Filter panel sections: open Filter | Fields section works; "System Defined Filters" and "Website Activity" show "These filters aren't available yet — coming in a future update." (see Z25) | `[func]` |

## Group G — Clone, pin, delete, Work Queue dependency `[serial]`

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| G1 | Clone own view | New private copy, all settings equal, original untouched | `[func]` |
| G2 | Clone shared view 🔒 | Copy owned by cloner, private | `[func]` 🔒 |
| G3 | Clone system view | Disabled "You cannot clone a system-defined view."; API refuses | `[neg]` |
| G4 | Clone name collision: clone twice | Unique name generated or prompt — no `VIEW_NAME_TAKEN` 500 | `[edge]` |
| G5 | Pin / unpin (current Zoho's replacement for Favourites) | Pinned view appears first under "Pinned views", ordered by `pin_order`, tab always shown; unpin removes it from the group; works for own, shared 🔒 and system views; per user (another user's picker unchanged 🔒) | `[func]` |
| G6 | Pin 16th | Refused with limit message | `[edge]` |
| G7 | Delete confirmation | Names view; Cancel keeps it; Delete → Recycle Bin | `[func]` |
| G8 | Restore from Recycle Bin: restore deleted `QA CV` view | View back with same id/settings — record | `[int]` |
| G9 | Delete system view via API: DELETE All Leads id | Refused (`can_delete=false`) | `[sec]` |
| G10 | Delete view used by a queue: create queue with source = view `QA CV src`; delete the view | **Expected (PRD P0-7): warning listing the queue.** Actual today: deleted silently; queue shows "source view unavailable" (Z17) | `[int]` |
| G11 | Deleted last-used view: user had it selected → reopen module | Falls back to default with no error | `[edge]` |
| G12 | Admin deletes another user's view 🔒: owner deletes 🔒 user's public view | Allowed; user's picker updates | `[func]` 🔒 |
| G13 | Unshare: owner removes 🔒 user from Selected | View leaves user's picker; if selected, fallback | `[func]` 🔒 |

## Group H — Kanban view settings `[serial]`

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| H1 | No Kanban views yet | "No Kanban views yet" + Create view | `[func]` |
| H2 | Create on Leads by Lead Status | Board appears; columns in picklist order + Unaccounted | `[func]` |
| H3 | Categorize-by choices | Only single-value picklist, status, radio fields | `[func]` |
| H4 | Module without such field | "Add a pick list, status or radio-button field…" / "This module has no field a board can group by." | `[neg]` |
| H5 | Name D-sweep (D1, D4, D5, D11) | "Give the view a name." ; limits; text escaped | `[data]` `[sec]` |
| H6 | Aggregate choices | number, currency, decimal, percent, long int, formula; rollup excluded ("Rollup summaries cannot be totalled.") | `[func]` |
| H7 | Card fields max 10 | 11th disabled; order up/down; record name first | `[edge]` |
| H8 | Header mono / multi | Rendered | `[ui]` |
| H9 | Sharing like list views; no Manage Shared Views → only me 🔒 | Message "You can create views for yourself…" | `[sec]` 🔒 |
| H10 | Several Kanban views per module, different fields | Chooser switches; "Shared by {{name}}" shown for others' | `[func]` |
| H11 | Edit categorize field | Board rebuilds | `[func]` |
| H12 | Delete Kanban view | Confirmation → Recycle Bin; records unaffected | `[func]` |
| H13 | Manage Kanban views page | Lists views; Create Kanban View | `[func]` |
| H14 | 76+ picklist values | Notice "Only the first 75 values are shown as columns."; record where beyond-cap records go (PRD P1-7 wants "Other values") | `[edge]` |

## Group I — Kanban board and drag-and-drop

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| I1 | Counts and sums are server-side | Header count/sum = `board-summary` before scrolling | `[func]` |
| I2 | Load more | Column with >100 records: Load more until all; final count = header | `[func]` |
| I3 | Unaccounted column | Empty-value records appear there | `[func]` |
| I4 | Stale value | Record with a value removed from picklist → "This value is no longer an option of the field" | `[edge]` |
| I5 | Deals by Stage: pipeline picker + probability | Picker shown; "Probability N%" per stage | `[func]` |
| I6 | Drag `QA CV` lead between statuses `[serial]` | GET record shows new value; both column counts/sums update; audit + workflow as a normal edit | `[func]` `[int]` |
| I7 | Drag to Unaccounted when field required | "{{field}} is required…"; card returns | `[neg]` |
| I8 | Drag on blueprint-governed Deals stage | "Choose the transition to {{column}}" or "Cannot update as the record is under the Blueprint"; no bypass | `[sec]` `[int]` |
| I9 | Drag to Closed Won/Lost | Closing dialog; mandatory fields enforced | `[func]` |
| I10 | Drag while loading | "The board is still loading — try again in a moment." | `[edge]` |
| I11 | Concurrent move: two sessions move same card | Second gets conflict/refresh; no lost update | `[edge]` |
| I12 | Drop on same column | No PATCH | `[edge]` |
| I13 | Keyboard move | Move card via keyboard / menu, same rules | `[ux]` |
| I14 | Collapse/expand one and all; drop on collapsed | Works | `[func]` |
| I15 | Create from column footer | New record form pre-set to column value + layout/pipeline | `[func]` |
| I16 | Select all loaded in column; bulk bar | Count correct; "Select all loaded" | `[func]` |
| I17 | Board respects record access 🔒 | User sees only own-accessible deals; sums only over them | `[sec]` 🔒 |
| I18 | 30 s refresh | Change a record in another tab → header updates within 30 s | `[func]` |
| I19 | Back-navigation | Open card, Back → same Kanban view, layout, pipeline, scroll (NDC-1317) | `[func]` |
| I20 | Board with filter / search | `filters`/`q` applied to summary and cards consistently | `[func]` |

## Group J — Split view, Sheet and Print entry points

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| J1 | Split view empty state | "No split views yet" + Create view | `[func]` |
| J2 | Split by field / owner / criteria | Sections per value; counts; collapse; per-section columns | `[func]` |
| J3 | Split limits | "too many conditions" message; max values | `[edge]` |
| J4 | Records per split; create in section | Works | `[func]` |
| J5 | Sheet View / Print View from module actions | Today: "Coming soon" toast, no navigation (Z23). After build: open with the active view's records; Sheet View row limit stated (Zoho's Sheet View article: 100 existing rows plus 200 new rows; the list-view FAQ 17 says 999 — record which CRM adopts), edits saved back, record ID column kept | `[int]` |

## Group K — Security

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| K1 | Stored XSS in view name, split name, Kanban name, criteria text value | Rendered as text in picker, tabs, manage pages, dialogs, toasts, audit log, Work Queue | `[sec]` |
| K2 | IDOR on every verb: GET/PATCH/DELETE/clone/pin another user's private view id 🔒 | 404/403; no change | `[sec]` 🔒 |
| K3 | Move view to another module: PATCH `module_id` / use view id under another module path | Refused | `[sec]` |
| K4 | Enumeration: random UUIDs vs deleted vs private ids | Same 404 body for all | `[sec]` |
| K5 | Visibility escalation: PATCH own view `visibility:"everyone"` without permission 🔒 | Refused | `[sec]` 🔒 |
| K6 | `shared_user_ids` with users of another tenant / non-existent | Rejected | `[sec]` |
| K7 | Criteria that reads hidden data (D21 inference): public view on hidden field 🔒 | Per Q13 decision; record | `[sec]` 🔒 |
| K8 | board-summary `group_by`/`aggregate` on a hidden field 🔒 | Refused; no sums leak | `[sec]` 🔒 |
| K9 | Oversized payloads: 1 MB name, 10 000 columns | 413/422, no 500 | `[sec]` |
| K10 | CORS: `Origin: https://evil.example` preflight on PATCH | Not allowed | `[sec]` |
| K11 | Tenant isolation: A9 + K6 | No cross-tenant read or write | `[sec]` |

## Group L — i18n/RTL, accessibility, performance, compatibility

| ID | Scenario | Expected | Tags |
|---|---|---|---|
| L1 | Arabic UI on picker, editor, manage, Kanban, Split | All strings translated; plural strings "{{count}} users" correct in Arabic (two keys missing today — check) | `[ui]` |
| L2 | RTL layout | Picker, tabs, criteria rows, Kanban column order mirrored; icons rotated | `[ui]` |
| L3 | Hard-coded English | "Probability", "Layout", "Pipeline" fallbacks — confirm translated in ar | `[ui]` |
| L4 | Keyboard only | Open picker, create view, edit pattern, move card | `[ux]` |
| L5 | Screen reader names | Picker "Custom views", "More custom views", "Choose a Kanban view", column buttons | `[ux]` |
| L6 | Mobile width 390px | Picker and editor usable; no horizontal page scroll | `[compat]` |
| L7 | Edge + Chrome + Firefox | Core B/C/I flows | `[compat]` |
| L8 | `[perf]` list view first page on Leads/Deals | p95 ≤ 1.5 s (PRD target) over 20 loads | `[perf]` |
| L9 | `[perf]` Kanban headers + first cards | p95 ≤ 2 s | `[perf]` |
| L10 | `[perf]` 15 pinned + 50 views in picker | Picker opens < 500 ms, search responsive | `[perf]` |

---

## E2E journeys

| ID | Journey | Steps (chained) | Expected |
|---|---|---|---|
| E2E-1 | Sales rep daily list | Create `QA CV hot leads` (Lead Status any of Interested/Follow Up, created last 7 days, owner = me) → pin → open record → Back → sign out/in | Same view, same results, pinned tab present |
| E2E-2 | Manager shares a working set 🔒 | Owner creates view, shares with user → user opens, clones, edits clone → owner edits original | User sees changes in shared view only; clone independent |
| E2E-3 | Pipeline review | Create Deals Kanban by Stage, aggregate Amount → drag `QA CV D02` Qualification→Negotiation → open deal → Back | Sums updated, audit entry, same board state |
| E2E-4 | View feeds Work Queue | Create list view → create queue with source = that view → edit view criteria → open queue | Queue reflects edited criteria |
| E2E-5 | Negative recovery | Create view with invalid pattern → fix → save → second tab saves an old copy (conflict) → reload → delete view → restore from Recycle Bin | Each failure has a clear message; final state consistent; no duplicate views |
| E2E-6 | Arabic user | Arabic UI: create view with Arabic name and Arabic text criteria, Kanban in RTL | Works end to end; text and order correct |

---

## Group Z — Gaps, run to confirm they are still missing or now built

Z5–Z27 are in NDC-1869. **Z28–Z55 are new in v3** (live Zoho, 2 Oct 2026): each names its item in the missing list Part B and is not in NDC-1869 yet. Every active Z row is expected to fail until the function is built.

Rows Z5–Z27 are in NDC-1869 (22 items, updated 1 Oct 2026); each names its item number. NDC-1869 item order: 1 Z26 · 2 Z27 · 3 Z5 · 4 Z6 · 5 Z7 · 6 Z8 · 7 Z9 · 8 Z10 · 9 Z11 · 10 Z12 · 11 Z19 · 12 Z13 · 13 Z20 · 14 Z21 · 15 Z14 · 16 Z15 · 17 Z16 · 18 Z17 · 19 Z23 · 20 Z24 · 21 Z25 · 22 Z18. Withdrawn in v2 (not gaps, kept here so the numbering stays stable): Z1 (Favourites — current Zoho uses Pin view instead, which CRM has), and Z2, Z3, Z4, Z22 (confirmed not gaps by the user, 1 Oct 2026). Do not run withdrawn rows.

| ID | Gap (NDC-1869 item) | How to test | Expected (Zoho / PRD) |
|---|---|---|---|
| Z1 | ~~Favourites (removed from NDC-1869)~~ — **withdrawn, not a gap** | Covered by G5/G6: Pin view puts the view in "Pinned views" at the top of the picker and always shows it as a tab | Current Zoho CRM has removed "Mark as favourite" and replaced it with **Pin view** (older help pages still describe favourites). CRM has Pin view (up to 15), so CRM matches current Zoho. Removed from NDC-1869 on 1 Oct 2026 |
| Z2 | ~~Other users' views for admins (removed from NDC-1869)~~ — **withdrawn, not a gap** | — | Confirmed not a gap by the user (1 Oct 2026). Removed from NDC-1869 on 1 Oct 2026 |
| Z3 | ~~Default view per module (removed from NDC-1869)~~ — **withdrawn, not a gap** | — | Confirmed not a gap by the user (1 Oct 2026). Last-used view behaviour is tested in B11–B14. Removed from NDC-1869 on 1 Oct 2026 |
| Z4 | ~~Recently Viewed standard view (removed from NDC-1869)~~ — **withdrawn, not a gap** | — | Confirmed not a gap by the user (1 Oct 2026). Standard views are tested in B7. Removed from NDC-1869 on 1 Oct 2026 |
| Z5 | Number between / not between (NDC-1869 item 3) | Operator list on Amount | Both present, inclusive bounds documented |
| Z6 | Starting tomorrow / Till yesterday (NDC-1869 item 4) | Date operator list | Both present, open-ended ranges |
| Z7 | Fiscal operators (NDC-1869 item 5) | Date operator list; set Company settings → Fiscal year first | Current / Previous / Next FY and FQ by the tenant fiscal calendar (Zoho live). Live Zoho has **no** plain calendar-quarter operator, so Last/Current/Next Quarter is only needed if the product owner wants it (NDC-1869 item 5 lists both) |
| Z8 | Share with roles/groups (NDC-1869 item 6) | Share picker kinds | Users, Groups, Roles, Roles and Subordinates (Zoho live; territories only where the org uses them) |
| Z9 | Create-view permission (NDC-1869 item 7) | Profile settings for a "Manage custom views" permission; 🔒 user without it | New custom view hidden; API create refused |
| Z10 | Kanban manage permission (NDC-1869 item 8) | Profile setting; 🔒 user without it | Create/Edit/Delete Kanban absent; API refused |
| Z11 | Pin (freeze) a column (NDC-1869 item 9) | Column header menu | One column frozen at leading edge (right in RTL) |
| Z12 | Header menu Filter by / Hide (NDC-1869 item 10) | Column header menu | Filter by opens Smart Filters for that field; Hide removes column |
| Z13 | Select all in view (NDC-1869 item 12) | View with > page size records, tick header | "Select all N records in this view", capped, respected by bulk actions |
| Z14 | Sort Kanban cards (NDC-1869 item 15) | Kanban toolbar/settings | Sort cards by chosen field |
| Z15 | Reorder Kanban views + creator on hover (NDC-1869 item 16) | Manage Kanban views | Per-user order; creator/modifier/time on hover |
| Z16 | Rollup aggregate (NDC-1869 item 17) | Aggregate list on a module with a rollup field | Rollup selectable, totals correct |
| Z17 | Warn before deleting a queue's source view (NDC-1869 item 18) | G10 | Dialog lists dependent queues before delete |
| Z18 | Chart/Timeline/Grid/Map/Canvas views (NDC-1869 item 22) | View-type switcher / More views | Present (non-goal — expected still absent) |
| Z19 | Resize column widths (NDC-1869 item 11) | Drag a column header border in a list view; reload; open as another user 🔒 | Width changes and is kept per user per view; other users unchanged (Zoho FAQ 11; NDC-1868 P0-5) |
| Z20 | Row actions menu (NDC-1869 item 13) | Hover a row → "···" menu | Edit, Send Email, Create Task, Add Tags, Change Owner, Convert, Delete, Copy URL, More › Create Call/Meeting/Appointment; filtered by module and permission; Copy URL copies the record link without opening a tab (NDC-1868 P1-6) |
| Z21 | Activity and Notes badges (NDC-1869 item 14) | Lead with open tasks and notes; lead without | Activity badge lists open tasks/meetings/calls/appointments + Create Activity; Notes badge opens Notes panel (view/add/edit/delete/sort), shows on hover when empty; both can be toggled in Manage Columns (NDC-1868 P1-6) |
| Z22 | ~~Converted Leads and Junk Leads standard views (never filed)~~ — **withdrawn, not a gap** | — | Confirmed not a gap by the user (1 Oct 2026); not to be filed |
| Z23 | "Coming soon" module actions (NDC-1869 item 19) | F12 for Mass Convert, Mass Email, Drafts, Approve, Deduplicate, Add to Campaigns, Create Client Script, Sheet View, Print View | Each opens a working screen scoped to the selection/view (NDC-1868 N3/N4 — non-goals, listed for triage) |
| Z24 | Missing bulk actions (NDC-1869 item 20) | Select records → selection "…" menu | Run Macro, Create Task, Change Owner (many records), Mail Merge present (Zoho live; NDC-1868 N4). "Set reminders" is not in live Zoho and is no longer expected |
| Z25 | System-defined and Website Activity filters (NDC-1869 item 21) | Filter panel → Untouched Records (e.g. 4 weeks), Touched Records, Record Action, Related Records Action, Latest Email Status; Website Activity | Filters apply on top of the view and narrow results (Zoho FAQ 14; NDC-1868 N5). Today "aren't available yet" |
| Z26 | Collapse/expand picker groups (NDC-1869 item 1) | Open the view picker; click each group name (Pinned views, Created by me, Shared with me, Public views); reopen the picker | Each group collapses to hide its views and expands to show them again; state is kept while the picker is reopened (record whether it persists across reload). Today the group names are plain labels (user requirement, 1 Oct 2026) |
| Z27 | Manage custom views page grouped by type (NDC-1869 item 2) | Open Manage custom views with own, shared 🔒, public and pinned views; unpin all, reload | Views listed under Created by me, Shared with me, Public views, and Pinned views; the Pinned views group appears only while at least one view is pinned. Today one flat table with "All custom views" / "Public views" tabs (user requirement, 1 Oct 2026; Zoho live groups its Manage page by Created By Me / Public Views) |
| Z28 | Save filter — Save a Filter (missing list B1; not filed) | Apply a field filter on a view → Save filter → clear → click the saved filter → reload | A "Save filter" button appears after a filter is applied; the saved filter is listed, re-applies in one click with the same count, and survives reload (Zoho live, 2 Oct 2026) `[func]` |
| Z29 | Save filter — Saved Filters Are Personal (missing list B1; not filed) | Save a filter on All Leads as owner → open another view → open All Leads as another user 🔒 | Listed only for its creator and only on the view it was saved on (Zoho help: saved filters are user-specific and per view) `[func]` `[sec]` 🔒 |
| Z30 | Save filter — Manage Saved Filters (missing list B1; not filed) | Save three filters; compare counts; reorder; rename; delete; save until refused | Live count per saved filter equals the grid count; order kept per user; limit stated when reached (Zoho: 5 or 10 per view) `[func]` `[edge]` |
| Z31 | Save filter — Saved Filter Name Sweep (missing list B1; not filed) | Save filters named D1, D2, D3, over-long, D8, D11, D19 | Empty refused; limit stated; HTML shown as text; duplicate rule recorded `[data]` `[sec]` |
| Z32 | Filter By Related Modules — Filter by Related Modules (missing list B2; not filed) | Filter panel → Filter By Related Modules → Tasks with a condition → apply → clear | Section present; filters on top of the view by related records (Zoho live: third section of the filter panel) `[func]` `[int]` |
| Z33 | Filter By Related Modules — Related-Module Filter Limits (missing list B2; not filed) | Add related-module filters until refused; combine one with a field filter | Limit stated (Zoho: 3 modules, 5 fields each); combined filters are ANDed `[edge]` |
| Z34 | Lock this View — Lock Toggle (missing list B3; not filed) | New custom view → Only me vs Everyone → turn Lock this View on → Save → reopen → GET the view | Toggle shown only for shared views with "Restrict any changes by users with whom the view is shared."; state saved and returned by the API (Zoho live) `[func]` |
| Z35 | Lock this View — Locked View Blocks Changes (missing list B3; not filed) | As a second user with Manage Shared Views, try Edit, Save to view and Delete on a locked view; then edit as creator and as admin 🔒 | Others cannot change name, criteria, columns or sharing or delete; creator and administrators can (Zoho API: "only Admins and creators can modify it") `[sec]` 🔒 |
| Z36 | Lock this View — Locked View in the API (missing list B3; not filed) | As a non-creator: PATCH name, PATCH locked=false, DELETE on a locked view 🔒 | All refused; view unchanged (name, lock, row_version) `[sec]` 🔒 |
| Z37 | Lock this View — Unlock and Clone (missing list B3; not filed) | Clone a locked view as another user; unlock as creator; edit as the other user; set to Only me 🔒 | Clone is private and unlocked; unlock restores editing; lock is cleared when the view is no longer shared `[func]` `[edge]` 🔒 |
| Z38 | Owner criteria by role — Owner Belongs to Role (missing list B4; not filed) | Lead Owner operator list → belongs to Role → pick a role → Save 🔒 | Operators "belongs to Role" and "does not belong to Role" offered; results are the records owned by users in that role (Zoho live) `[func]` 🔒 |
| Z39 | Owner criteria by role — Owner Role Edge Cases (missing list B4; not filed) | does not belong to Role; role with no users; user moved to another role; unknown role id via API 🔒 | Complement set returned; empty role = empty view; results follow the current role; unknown id refused `[edge]` `[sec]` 🔒 |
| Z40 | Date criteria Previous / Next N units — Previous and Next N Units (missing list B5; not filed) | Date operator list → Previous / Next → number + unit (days, weeks, months, years) → Save each | Operators offered with the four units; each returns only records inside the range (Zoho live) `[func]` |
| Z41 | Date criteria Previous / Next N units — Previous and Next Boundaries (missing list B5; not filed) | Previous with D1, 0, 1, max, max+1, -1, 1.5, text, Arabic-Indic digits — UI and API | Invalid numbers refused in UI and API; limits stated; no 500 `[data]` `[sec]` |
| Z42 | Date criteria Previous / Next N units — Previous and Next at Period Edges (missing list B5; not filed) | Previous 1 day / week / month with records at 23:50 and 00:10 Cairo around each edge | Edges follow the tenant timezone; the rule for the current period is consistent and stated (Zoho API excludes it) `[edge]` |
| Z43 | Text operators on pick lists — Text Operators on Pick Lists (missing list B6; not filed) | Lead Status operator list → contains / doesn't contain / starts with / ends with | The four text operators are offered on pick lists and match on the option label (Zoho live) `[func]` |
| Z44 | Text operators on pick lists — Pick List Text Operator Sweep (missing list B6; not filed) | contains with D7, D6, D8, D12, D11; Arabic UI; removed option | Same matching rule as text fields; input treated as text; same results in Arabic; no crash `[data]` `[sec]` |
| Z45 | Wrap Text view mode — Wrap Text View Mode (missing list B7; not filed) | Column settings menu → View Mode → Wrap Text / clipped with a 255-character value → reload | View Mode offered; wrap shows the whole value, clip shows one line; choice kept (Zoho live: "View Mode — Wrap Text") `[func]` `[ui]` |
| Z46 | Wrap Text view mode — Wrap Text Is Personal (missing list B7; not filed) | Change wrap mode on a shared view as owner; open as another user; check row_version; Arabic text 🔒 | Per user; shared definition unchanged; correct in RTL `[func]` `[ui]` 🔒 |
| Z47 | Reset Column Size — Reset Column Size (missing list B8; not filed) | Resize two columns → column settings menu → Reset Column Size → reload | All widths back to default and kept; order, visibility and sort untouched (Zoho live) `[func]` |
| Z48 | A–Z letter filter — A–Z Letter Filter (missing list B9; not filed) | Name column "All" dropdown → pick a letter → pick a letter with no records → All | Options All, A–Z; only names starting with the letter; count updates; All resets (Zoho live) `[func]` |
| Z49 | A–Z letter filter — Letter Filter Combined (missing list B9; not filed) | Letter + view criteria + paging + sort + field filter; change view; Arabic UI; names starting with a digit | Narrows on top of the view; kept through paging and sort; cleared on view change; rule for Arabic and digits recorded `[edge]` `[ui]` |
| Z50 | Delete several views at once — Delete Several Views (missing list B10; not filed) | Manage custom views → tick two views → Delete → Cancel → Delete → confirm | Checkbox per custom view; Delete appears; confirmation counts the views; only the ticked views are deleted (Zoho live) `[func]` |
| Z51 | Delete several views at once — Bulk Delete Protections (missing list B10; not filed) | Try to tick a system view and a view shared by someone else; bulk delete a view that a queue uses 🔒 | System and non-deletable views cannot be selected; dependent queues are listed before deletion `[sec]` `[int]` 🔒 |
| Z52 | Delete several views at once — Bulk Delete in the API (missing list B10; not filed) | Bulk delete with a valid id, a system view id and an unknown id; send twice in parallel | Per-id result; system and unknown ids refused; no partial surprise; no 500 `[sec]` `[edge]` |
| Z53 | More selection and module actions — More Selection Actions (missing list B11; not filed) | Select two records → selection "…" menu → Cadences, Print Mailing Labels, Print Using Canvas | Each is offered and opens a screen scoped to the selection (Zoho live; NDC-1868 N4 non-goal) `[int]` |
| Z54 | More selection and module actions — Export Selected Records (missing list B11; not filed) | Tick three records → Export Selected Records → open the file → clear the selection | Only the selected records are exported; formula-like values are neutralised; needs a selection `[int]` `[sec]` |
| Z55 | More selection and module actions — Assignment Rules and Mass Transfer (missing list B11; not filed) | Module actions menu → Assignment Rules; Mass Transfer up to the preview | Both offered; Mass Transfer previews the records before changing owner (Zoho live; NDC-1868 N4 non-goal) `[int]` |

---

## Traceability

PRD = NDC-1868 (`custom-views-spec.md`). CV = existing xlsx ids.

| PRD requirement | Scenarios | Existing CV ids |
|---|---|---|
| P0-1 Picker, categories, standard views | B1–B16, A12, G5, G6, Z26, Z27 | CV-001–CV-009 |
| P0-2 Create/edit list view | C1–C23, A2, G5, Z9 | CV-010–CV-025 |
| P0-3 Operators | D1–D19, Z5–Z7 | CV-026–CV-054 |
| P0-4 Pattern | D20–D24 | CV-055–CV-067 |
| P0-5 Columns and in-view controls | C9–C12, F1–F8, F16, F17, E11, Z11, Z12, Z19 | CV-068–CV-078 |
| P0-6 Sharing and access | A2–A7, C14, C15, E10, G13, K2, K5–K7, Z8 | CV-079–CV-090 |
| P0-7 Clone and delete | G1–G13, Z17 | CV-091–CV-099 |
| P0-8 Selection and bulk scope | F9–F13, I16, Z13 | CV-100–CV-106 |
| P0-9 Kanban core | H2–H4, H6, H10, I1–I20, Z14 | CV-107–CV-130 |
| P0-10 Kanban management | H9, H12, H13, A8, Z10, Z15 | CV-131–CV-137 |
| P1-1 Related-module criteria | E1–E7 | CV-138–CV-142 |
| P1-2 Subform criteria | Inconclusive (§1.4) | CV-143–CV-145 |
| P1-3 Lookup criteria | E8 | CV-146–CV-147 |
| P1-4 Fiscal operators | Z7 | CV-148–CV-149 |
| P1-5 Last Activity Time | D25 | CV-150–CV-151 |
| P1-6 Row actions and badges | F14, F18, I15, Z20, Z21 | CV-152–CV-156 |
| N3 Sheet and Print views (non-goal) | F12, J5, Z23 | — (new) |
| N4 Bulk operations (non-goal, scoping only) | F11, F12, Z23, Z24 | — (new) |
| N5 Smart Filters coexist with views (non-goal) | F19, Z25 | — (new) |
| P1-7 Kanban refinements | H6, H8, H14, Z16 | CV-157–CV-160 |
| NFR i18n/RTL | L1–L3, D24, E2E-6 | CV-161–CV-163 |
| NFR a11y + keyboard drag | L4, L5, I13 | CV-164–CV-165 |
| NFR audit | C24 | CV-166 |
| NFR performance | L8–L10 | CV-167–CV-168 |
| Instrumentation (§10) | not testable from UI — needs analytics access; listed as a hole | CV-169–CV-174 |
| Field lifecycle (§8) | E9 | CV-175–CV-176 |
| Count = rows | F8, I1 | CV-177 |
| Request tampering | K2–K4 | CV-178 |
| Empty view | F15 | CV-179 |
| Beyond PRD (built): Split view, version conflict, Recycle Bin, last N hours | J1–J4, C18, G8, D11 | — (new) |
| Beyond PRD (new gaps, missing list Part B): saved filters and related-module filters | Z28–Z33 | — (new) |
| Beyond PRD (new gaps): Lock this View | Z34–Z37 | — (new) |
| Beyond PRD (new gaps): criteria — owner by role, Previous / Next N units, pick list text operators | Z38–Z44 | — (new) |
| Beyond PRD (new gaps): grid — Wrap Text, Reset Column Size, A–Z letter filter | Z45–Z49 | — (new) |
| Beyond PRD (new gaps): delete several views at once | Z50–Z52 | — (new) |
| Beyond PRD (new gaps): more selection and module actions (N4 non-goal) | Z53–Z55 | — (new) |

Holes: instrumentation events (no way to observe from QA) and P1-2 subform (no subform module) — both listed in NDC-1869 "Could not be checked" or here. Requirement-by-requirement coverage is in `custom-views-requirements-v3.md`.

---

## Reporting

- Folder: `Test Cases/CRM/Results/Custom Views - execution <date>/` with `report.md`, per-scenario screenshot, API request/response (redacted).
- Redaction: never write tokens, cookies or passwords; write `Bearer <len=1263>`. Mask emails of other users.
- Each Fail: steps, expected, actual, evidence, and whether it maps to an existing NDC item (NDC-1836, NDC-1317, NDC-1869 Zn) before filing anything new — run the false-positive checklist (feature flag, permission, layout scope, cached SPA, stale token).
- Coverage gaps restated at the end: 🔒 scenarios and subform scenarios Inconclusive while §1.4 blockers stand.
- Revert proof: after cleanup, repeat every §1.3 GET and diff against the baseline. Only expected differences allowed (Recycle Bin entries, if not purged, listed by id). Attach the diff.
