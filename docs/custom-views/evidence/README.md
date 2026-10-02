# Custom Views — screenshot evidence (Zoho CRM vs TAVI CRM)

Captured 3 Oct 2026, headless Edge 1600×900. Zoho: org940103646, Leads module, admin account. TAVI: crm.taviportal.com (NDC-Staging), Leads module, owner account, List view. Nothing was saved on either side; a temporary Kanban view created in Zoho for A15–A17 was deleted afterwards.

Each item has `<id>-zoho.png` (feature present, green banner), `<id>-tavi.png` (feature missing, red banner) and `<id>-compare.png` (both side by side). Red boxes mark the control, or the place where it should be. Ids follow `custom-views-missing-list.md`: A = NDC-1869 items, B = new gaps.

| Id | Gap | Zoho (present) | TAVI (missing) | Note |
|---|---|---|---|---|
| A1 | Collapse / expand each group in the view picker | [A01-zoho](A1-zoho.png) | [A01-tavi](A1-tavi.png) | Group names are plain labels — no collapse/expand |
| A2 | Manage custom views page grouped by type | [A02-zoho](A2-zoho.png) | [A02-tavi](A2-tavi.png) | One flat table with "All custom views" / "Public views" tabs — not grouped by type |
| A3 | "Between" / "Not between" for number fields | [A03-zoho](A3-zoho.png) | [A03-tavi](A3-tavi.png) | Number operators (Deals › Amount): no between / not between. List: Equals Not equal to Greater than Less than ≥ ≤ Is empty Is not empty |
| A4 | "Starting tomorrow" / "Till yesterday" for date fields | [A04-zoho](A4-zoho.png) | [A04-tavi](A4-tavi.png) | Date operators: no Starting tomorrow / Till yesterday |
| A5 | Fiscal year / fiscal quarter date operators | [A05-zoho](A5-zoho.png) | [A04-tavi](A5-tavi.png) | Date operators: no fiscal year / fiscal quarter |
| A6 | Share a view with roles, roles and subordinates, groups | [A06-zoho](A6-zoho.png) | [A06-tavi](A6-tavi.png) | Share this view with: the kinds dropdown offers Users only — no Groups, Roles, Roles and Subordinates |
| A7 | Profile permission to create custom views | [A07-zoho](A7-zoho.png) | [A07-tavi](A7-tavi.png) | Permissions (CRM Admin): the only view permission is "Manage Shared Views" (metadata.views.manage) — no permission to create custom views |
| A8 | Separate permission to manage Kanban views | [A07-zoho](A8-zoho.png) | [A07-tavi](A8-tavi.png) | No separate permission to manage Kanban views — only "Manage Shared Views" |
| A9 | Pin (freeze) a column | [A09-zoho](A9-zoho.png) | [A09-tavi](A9-tavi.png) | Header hover: no menu, so no Pin Column |
| A10 | Column header menu: Filter by / Hide | [A09-zoho](A10-zoho.png) | [A09-tavi](A10-tavi.png) | No header menu (Filter by / Hide) — a click only sorts |
| A11 | Resize column widths | [A11-zoho](A11-zoho.png) | [A09-tavi](A11-tavi.png) | No resize handle on the header border |
| A12 | "Select all records in this view" across pages | [A12-zoho](A12-zoho.png) | [A12-tavi](A12-tavi.png) | Header checkbox selects the page only (10 of 38) — no "Select all 38 records in this view" |
| A13 | Row actions menu on each row | [A13-zoho](A13-zoho.png) | [A13-tavi](A13-tavi.png) | Row hover: no "…" row actions menu (only inline Edit field) |
| A14 | Activity badge and Notes badge on each row | [A14-zoho](A14-zoho.png) | [A13-tavi](A14-tavi.png) | Row hover: no Activity badge, no Notes badge |
| A15 | Sort the cards on the Kanban board | [A15-zoho](A15-zoho.png) | [A15-tavi](A15-tavi.png) | Kanban toolbar: Filter / Sort (same control as the list) — no card sort in the board or its settings |
| A16 | Reorder Kanban views; creator / modifier on hover | [A16-zoho](A16-zoho.png) | [A16-tavi](A16-tavi.png) | Manage Kanban views: no drag-to-reorder, no creator/modifier on hover. Skip to content Leads EN Search or jump to… Ctrl K 93 99+ ND CRM New Home Work Queue Dash |
| A17 | Kanban aggregate by a rollup summary field | [A17-zoho](A17-zoho.png) | [A17-tavi](A17-tavi.png) | Kanban settings: rollup summary fields cannot be aggregated ("Rollup summaries cannot be totalled."). Dialog: Edit Kanban view Name Applies to the "Standard" la |
| A18 | Warn before deleting a view a Work Queue queue uses | — No Zoho screen: Zoho blocks the delete through its API (NOT_ALLOWED with the list of associations); the UI dialog only asks for confirmation | [A18-tavi](A18-tavi.png) | Delete dialog: "It moves to the Recycle Bin; its records are not affected." — no list of Work Queue queues that use the view |
| A19 | Module actions that only show "Coming soon" | [A19-zoho](A19-zoho.png) | [A19-tavi](A19-tavi.png) | Items marked ✦ (Mass Convert, Drafts, Mass Email, Approve, Deduplicate, Add to Campaigns, Create Client Script, Sheet View, Print View) only show "Coming soon" |
| A20 | Bulk actions: Run Macro, Create Task, Change Owner, Mail Merge | [A20-zoho](A20-zoho.png) | [A19-tavi](A20-tavi.png) | No Run Macro, Create Task, Change Owner (many records) or Mail Merge anywhere in the menus |
| A21 | System Defined Filters / Website Activity | [A21-zoho](A21-zoho.png) | [A21-tavi](A21-tavi.png) | System Defined Filters: "These filters aren't available yet — coming in a future update."; Website Activity also unavailable |
| A22 | Chart, Timeline, Grid, Map and Canvas views | [A22-zoho](A22-zoho.png) | [A22-tavi](A22-tavi.png) | View switcher: List, Kanban, Split only. "More views" menu: (nothing else) |
| B1 | Save filter | [B01-zoho](B1-zoho.png) | [B01-tavi](B1-tavi.png) | Filter applied (Lead Status = Busy, "Filter 1"): toolbar has Filter / Sort only — no "Save filter" |
| B2 | "Filter By Related Modules" in the filter panel | [B02-zoho](B2-zoho.png) | [A21-tavi](B2-tavi.png) | Filter panel sections: System Defined Filters, Website Activity, Fields — no "Filter By Related Modules" |
| B3 | Lock this View | [B03-zoho](B3-zoho.png) | [B03-tavi](B3-tavi.png) | Sharing: Only me / Everyone / Selected users — no "Lock this View" |
| B4 | Owner criteria "belongs to Role" | [B04-zoho](B4-zoho.png) | [B04-tavi](B4-tavi.png) | Owner operators: Contains any of, Contains none of, Equals, Not equal to, Is empty, Is not empty — no "belongs to Role" |
| B5 | Date criteria "Previous / Next" N days, weeks, months, years | [B05-zoho](B5-zoho.png) | [A04-tavi](B5-tavi.png) | Date operators: only "last / next N days" and "N hours" — no Previous / Next N weeks, months, years |
| B6 | Text operators on pick list fields | [B06-zoho](B6-zoho.png) | [B06-tavi](B6-tavi.png) | Pick list operators: no contains / starts with / ends with. List: Contains any of Contains none of Equals Not equal to Is empty Is not empty |
| B7 | Wrap Text view mode | [B07-zoho](B7-zoho.png) | [B07-tavi](B7-tavi.png) | Manage Columns panel: no View Mode / Wrap Text |
| B8 | Reset Column Size | [B07-zoho](B8-zoho.png) | [B07-tavi](B8-tavi.png) | Manage Columns panel: no Reset Column Size |
| B9 | A–Z letter filter on the name column | [B09-zoho](B9-zoho.png) | [A09-tavi](B9-tavi.png) | No A–Z letter filter on the name column |
| B10 | Delete several views at once | [B10-zoho](B10-zoho.png) | [A02-tavi](B10-tavi.png) | Rows have no checkboxes — one view is deleted at a time |
| B11 | More selection / module actions | [A20-zoho](B11-zoho.png) | [A19-tavi](B11-tavi.png) | No Cadences, Print Mailing Labels, Print Using Canvas or Export Selected Records |

## Notes

- A12 (select all in view): Zoho has only 22 leads, which fit on one page, so the "Select all N records" prompt could not be shown; the Zoho screenshot is the page-selection state only.
- A15–A17 (Kanban): Zoho screenshots use a temporary Kanban view "QA CV temp (delete me)", deleted after capture. The Zoho org has no rollup field, so A17 shows the Aggregate By list (number fields) rather than a rollup entry.
- A18: Zoho has no screen for this; it refuses the delete through the API when a view is in use. Only the TAVI dialog is shown.
- A7/A8: Zoho screenshot is Setup → Profiles → Standard → Others ("Manage Views": Chart View, Custom View, Kanban View, Split View, Timeline View). TAVI screenshot is Settings → Permissions for CRM Admin ("Manage Shared Views" only).
- B1: the TAVI toolbar shows "Filter 1" with a Lead Status = Busy filter applied and no Save filter button; the filter was cleared afterwards.

## Test Cases Affected by Missings

Source: `Custom Views - Spec v3 Test Cases.xlsx` (238 cases). A case is listed when it tests a missing function directly (the 50 gap cases, status "Missing"), or when its expected result includes a missing function (10 cases also set to "Missing"), or when it checks a list that the missing operators belong to (CVS-D01, status blank — it passes on today's build). Ids: A = NDC-1869 item number, B = new gap in `custom-views-missing-list.md` Part B; the screenshots above use the same ids.

61 test cases are affected.

| Test case | Title | Affected by missing | Status in sheet |
|---|---|---|---|
| CVS-B01 | The view picker groups views under fixed headings in a fixed order | A1 | Missing |
| CVS-B16 | The Manage custom views page lists every visible view, searchable and grouped by type | A2 | Missing |
| CVS-D01 | Each field type offers exactly the operators listed in spec §2.3, with none missing and none extra | A3, A4, A5, B5, B6 | — |
| CVS-F12 | Each module action either opens its screen or shows the "Coming soon" toast, and selection-based items need a selection | A19 | Missing |
| CVS-F16 | Clicking a column header sorts directly and there is no header menu today | A9, A10 | Missing |
| CVS-F17 | Column widths cannot be resized today | A11 | Missing |
| CVS-F18 | Hovering a list row shows only inline "Edit field" buttons today | A13, A14 | Missing |
| CVS-F19 | The Fields section of the Filter panel works and the other sections are not available yet | A21 | Missing |
| CVS-G10 | Deleting a view used by a Work Queue queue warns and lists the queue first | A18 | Missing |
| CVS-H06 | Only numeric fields can be used as the aggregate, and rollup summaries are excluded | A17 | Missing |
| CVS-J05 | Sheet View and Print View from the module actions menu open on the active view's records once built | A19 | Missing |
| CVS-Z05 | Number fields offer between and not between with documented inclusive bounds | A3 | Missing |
| CVS-Z06 | Date fields offer the open-ended Starting tomorrow and Till yesterday operators | A4 | Missing |
| CVS-Z07 | Date fields offer Current, Previous and Next fiscal year and fiscal quarter operators based on the tenant fiscal calendar | A5 | Missing |
| CVS-Z08 | Views can be shared with roles, roles and subordinates, groups and territories | A6 | Missing |
| CVS-Z09 | A profile without the create-view permission cannot create custom views in the UI or through the API | A7 | Missing |
| CVS-Z10 | A profile without Kanban management cannot create, edit or delete Kanban views in the UI or through the API | A8 | Missing |
| CVS-Z11 | One list column can be frozen at the leading edge, on the right in RTL | A9 | Missing |
| CVS-Z12 | The column header menu offers Filter by and Hide | A10 | Missing |
| CVS-Z13 | A user can select every record in the view, not just the visible page, and bulk actions respect it | A12 | Missing |
| CVS-Z14 | Kanban cards can be sorted by a chosen field | A15 | Missing |
| CVS-Z15 | Kanban views can be reordered per user, and hovering one shows its creator, modifier and time | A16 | Missing |
| CVS-Z16 | A rollup summary field can be used as the Kanban aggregate with correct totals | A17 | Missing |
| CVS-Z17 | Deleting a view used by a Work Queue queue first lists the dependent queues | A18 | Missing |
| CVS-Z18 | Chart, Timeline, Grid, Map and Canvas views are offered (PRD non-goal) | A22 | Missing |
| CVS-Z19 | Column widths can be resized and are kept per user per view | A11 | Missing |
| CVS-Z20 | Hovering a row offers a "···" actions menu filtered by module and permission | A13 | Missing |
| CVS-Z21 | List rows show activity and notes badges that open their panels and can be switched off | A14 | Missing |
| CVS-Z23 | Each "Coming soon" module action opens a working screen scoped to the selection or view (PRD non-goal) | A19 | Missing |
| CVS-Z24 | Run macro, Create task, Change owner and Bulk mail merge are offered for selected records | A20 | Missing |
| CVS-Z25 | System-defined and Website Activity filters narrow a view's results | A21 | Missing |
| CVS-Z26 | Each view picker group can be collapsed and expanded | A1 | Missing |
| CVS-Z27 | Manage custom views groups views by type, with Pinned views shown only while a view is pinned | A2 | Missing |
| CVS-Z28 | A filter applied on a view can be saved and applied again in one click | B1 | Missing |
| CVS-Z29 | A saved filter belongs to one user and one view | B1 | Missing |
| CVS-Z30 | Saved filters can be renamed, reordered and deleted, show a live count, and stop at the limit | B1 | Missing |
| CVS-Z31 | A saved filter name is validated and always shown as text | B1 | Missing |
| CVS-Z32 | The filter panel can narrow a view by a related module | B2 | Missing |
| CVS-Z33 | Related-module filters stop at the limit and work together with field filters | B2 | Missing |
| CVS-Z34 | "Lock this View" is offered only for shared views | B3 | Missing |
| CVS-Z35 | Only the creator and administrators can change a locked view | B3 | Missing |
| CVS-Z36 | The API refuses changes to a locked view from anyone but its creator and administrators | B3 | Missing |
| CVS-Z37 | Unlocking restores normal editing, and a clone of a locked view is not locked | B3 | Missing |
| CVS-Z38 | Owner criteria can match every record owned by users of a role | B4 | Missing |
| CVS-Z39 | "Does not belong to Role" and unusual roles behave predictably | B4 | Missing |
| CVS-Z40 | Date criteria accept "Previous" and "Next" with days, weeks, months or years | B5 | Missing |
| CVS-Z41 | The number for Previous and Next is validated in the UI and the API | B5 | Missing |
| CVS-Z42 | Previous and Next ranges follow the tenant timezone and calendar | B5 | Missing |
| CVS-Z43 | Pick list criteria offer contains, starts with and ends with | B6 | Missing |
| CVS-Z44 | Text operators on pick lists handle case, Arabic and removed options | B6 | Missing |
| CVS-Z45 | The list view can wrap long values or clip them | B7 | Missing |
| CVS-Z46 | Wrap mode is a personal setting and works in Arabic | B7 | Missing |
| CVS-Z47 | "Reset Column Size" puts every column width back to default | B8 | Missing |
| CVS-Z48 | The name column has an A–Z filter | B9 | Missing |
| CVS-Z49 | The letter filter works with view criteria, filters, sort and paging | B9 | Missing |
| CVS-Z50 | Several custom views can be deleted together on the Manage page | B10 | Missing |
| CVS-Z51 | Bulk delete cannot remove system views, other users' views or a view a queue depends on without warning | B10 | Missing |
| CVS-Z52 | A bulk delete request is all-or-clearly-partial and never deletes views the caller may not delete | B10 | Missing |
| CVS-Z53 | Cadences, Print Mailing Labels and Print Using Canvas are offered for selected records | B11 | Missing |
| CVS-Z54 | Export can be limited to the ticked records | B11 | Missing |
| CVS-Z55 | The module menu offers Assignment Rules and Mass Transfer | B11 | Missing |

### By missing item

| Missing | Test cases |
|---|---|
| A1 | CVS-B01, CVS-Z26 |
| A2 | CVS-B16, CVS-Z27 |
| A3 | CVS-D01, CVS-Z05 |
| A4 | CVS-D01, CVS-Z06 |
| A5 | CVS-D01, CVS-Z07 |
| A6 | CVS-Z08 |
| A7 | CVS-Z09 |
| A8 | CVS-Z10 |
| A9 | CVS-F16, CVS-Z11 |
| A10 | CVS-F16, CVS-Z12 |
| A11 | CVS-F17, CVS-Z19 |
| A12 | CVS-Z13 |
| A13 | CVS-F18, CVS-Z20 |
| A14 | CVS-F18, CVS-Z21 |
| A15 | CVS-Z14 |
| A16 | CVS-Z15 |
| A17 | CVS-H06, CVS-Z16 |
| A18 | CVS-G10, CVS-Z17 |
| A19 | CVS-F12, CVS-J05, CVS-Z23 |
| A20 | CVS-Z24 |
| A21 | CVS-F19, CVS-Z25 |
| A22 | CVS-Z18 |
| B1 | CVS-Z28, CVS-Z29, CVS-Z30, CVS-Z31 |
| B2 | CVS-Z32, CVS-Z33 |
| B3 | CVS-Z34, CVS-Z35, CVS-Z36, CVS-Z37 |
| B4 | CVS-Z38, CVS-Z39 |
| B5 | CVS-D01, CVS-Z40, CVS-Z41, CVS-Z42 |
| B6 | CVS-D01, CVS-Z43, CVS-Z44 |
| B7 | CVS-Z45, CVS-Z46 |
| B8 | CVS-Z47 |
| B9 | CVS-Z48, CVS-Z49 |
| B10 | CVS-Z50, CVS-Z51, CVS-Z52 |
| B11 | CVS-Z53, CVS-Z54, CVS-Z55 |
