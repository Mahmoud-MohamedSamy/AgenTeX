# Custom Views — what Zoho CRM has that CRM is missing

| | |
|---|---|
| App | TAVI CRM — `https://crm.taviportal.com` (tenant NDC-Staging) |
| Reference | Zoho CRM, checked live on 2 Oct 2026 (Leads module, admin account) plus Zoho's help and API docs |
| Feature spec (PRD) | NDC-1868 |
| Gap ticket | NDC-1869 — 22 items (not changed by this check) |
| Test spec | `docs/custom-views/spec-crm-custom-views-v3.md` (Group Z = the gaps: Z5–Z27 for Part A, Z28–Z55 for Part B) |
| Requirements | `docs/custom-views/custom-views-requirements-v3.md` |
| Build checked | bundle `index-DfcbYBNN.js` — same build the spec was written from (1 Oct 2026) |
| Status | **Draft for review.** Part B is new and is not in NDC-1869 or the spec yet |

How each side was checked:
- **Zoho:** opened in a browser and looked at the view picker, the Manage Custom View page, the New Custom View form, the list view grid, the filter panel and the Kanban settings dialog. Nothing was created or saved in Zoho.
- **CRM:** read from the build's code (bundle). The CRM tenant was not opened in this check, so "today" statements for CRM in Part B come from the code, not from the screen.

---

## Part A — the 22 gaps already in NDC-1869 (all still missing)

"Seen live" means the Zoho behaviour was seen on screen on 2 Oct 2026. "Docs" means it rests on Zoho's help pages only.

**View picker and Manage custom views**
1. Collapse and expand each group in the view picker. Today the group names are plain labels. — Seen live. (Z26)
2. Group the views on the Manage custom views page by type. Today it is one table with two tabs. — Seen live (Zoho groups by Created By Me / Public Views). (Z27)

**Criteria**
3. "Between" and "Not between" for number, currency and decimal fields. NDC-1868 P0-3. — Seen live. (Z5)
4. "Starting tomorrow" and "Till yesterday" for date fields. NDC-1868 P0-3. — Seen live. (Z6)
5. Quarter and fiscal operators. NDC-1868 P1-4. — Seen live, with a correction: Zoho has only fiscal ones (Current / Previous / Next FY and FQ); there is no plain calendar-quarter operator. (Z7)

**Sharing and permissions**
6. Share a view with roles, roles and subordinates, and groups. Today only selected users. NDC-1868 Q15. — Seen live (Users, Groups, Roles, Roles and Subordinates). (Z8)
7. A profile permission for creating custom views. NDC-1868 P0-2 and Q2. — Docs. (Z9)
8. A separate permission to manage Kanban views. NDC-1868 P0-10 and Q2. — Docs. (Z10)

**List view columns and rows**
9. Pin (freeze) one column. NDC-1868 P0-5. — Seen live ("Pin Column" in the header menu). (Z11)
10. Column header menu with "Filter by" and "Hide". NDC-1868 P0-5. — Seen live (Asc, Desc, Pin Column, Filter by, Hide Column). (Z12)
11. Resize column widths. NDC-1868 P0-5. — Seen live (resize handle on each header). (Z19)
12. "Select all records in this view" across pages. NDC-1868 P0-8. — Docs (the Zoho org has only 22 leads, so the option does not show). (Z13)
13. Row actions menu. NDC-1868 P1-6. — Seen live (Edit, Send Email, Create Task, Add Tags, Change Owner, Convert, Delete, Copy URL, More). (Z20)
14. Activity badge and Notes badge on each row. NDC-1868 P1-6. — Seen live (two icons on row hover). (Z21)

**Kanban**
15. Sort the cards on the board. NDC-1868 P0-9. — Docs. (Z14)
16. Reorder Kanban views; show creator and last modifier on hover. NDC-1868 P0-10. — Docs. (Z15)
17. Aggregate by a rollup summary field. NDC-1868 P1-7. — Docs. (Z16)

**Deleting a view**
18. Warn before deleting a view that a Work Queue queue uses. NDC-1868 P0-7. — CRM's own requirement, not a Zoho feature. (Z17)

**List actions and filters**
19. Actions that only show "Coming soon": Mass Convert, Mass Email, Drafts, Approve Leads, Deduplicate Leads, Add to Campaigns, Create Client Script, Sheet View, Print View. NDC-1868 N3/N4. — Seen live (all are in Zoho's module menu). (Z23)
20. Bulk actions not in the menu: run macro, create task, set reminders, change owner for many records, bulk mail merge. NDC-1868 N4. — Seen live, with a correction: Run Macro, Create Task, Change Owner and Mail Merge are there; **"Set reminders" is not in live Zoho** and should come out of this item. (Z24)
21. "System Defined Filters" and "Website Activity" in the filter panel. NDC-1868 N5. — Seen live for System Defined Filters (Activities, Campaigns, Latest Email Status, Locked, Record Action, Related Records Action, Touched Records, Untouched Records, Cadences). Website Activity was not shown in this org. (Z25)

**Other view types**
22. Chart, Timeline, Grid, Map and Canvas views. NDC-1868 N1/N2. — Seen live (Kanban, Grid, Chart, Timeline, Split; plus Custom List View, Tile View, Table View). Map was not shown in this org. (Z18)

---

## Part B — new gaps seen in live Zoho (not in NDC-1869 yet)

Each one needs your decision: accept as a gap, or mark "not a gap".

**Filters**
1. **Save filter.** After a filter is applied, Zoho shows a "Save filter" button next to Filter. CRM has no way to save a filter. NDC-1868 N5 (non-goal).
2. **"Filter By Related Modules".** A third section in Zoho's filter panel, after System Defined Filters and Filter By Fields. CRM's filter panel has fields only. NDC-1868 N5 (non-goal).

**Create / edit a view**
3. **Lock this View.** A toggle shown for shared views: "Restrict any changes by users with whom the view is shared." CRM has no lock. Not in NDC-1868.
4. **Owner criteria by role.** "belongs to Role" and "does not belong to Role" on owner fields. CRM has is / is not / empty only. Not in NDC-1868.
5. **Date criteria "Previous" and "Next".** A number plus a unit: days, weeks, months or years. CRM has "last / next N days" and "N hours" only. Not in NDC-1868.
6. **Text operators on pick list fields.** Zoho offers is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty. CRM offers is, is not, any of, none of, empty. Not in NDC-1868.

**List view grid**
7. **Wrap Text view mode.** In the column settings menu ("View Mode — Wrap Text"). CRM has wrap text only in Split view. Not in NDC-1868.
8. **Reset Column Size.** In the same menu. Belongs with item 11 (resize column widths).
9. **A–Z letter filter.** An "All / A…Z" dropdown on the name column that keeps only records starting with that letter. CRM has it only in Desk, not in CRM modules. Not in NDC-1868.

**Manage custom views**
10. **Delete several views at once.** Tick views on the Manage Custom View page and a Delete button appears. CRM deletes one view at a time. Not in NDC-1868.

**Actions on selected records**
11. **More actions.** Cadences, Print Mailing Labels, Print Using Canvas, Export Selected Records in the selection menu; Assignment Rules and Mass Transfer in the module menu. CRM's code has none of the first four; assignment rules exist in the code but were not checked on screen. NDC-1868 N4 (non-goal).

---

## Part C — not gaps

- **Favourites:** live Zoho's view menu is only Edit, Pin, Clone, Delete View. CRM has Pin view.
- **Setting a default view:** no such control in live Zoho.
- **"Other users' views" group:** not shown in the live picker (the account is the only creator of views in that org, so the group may simply be empty). Already withdrawn by you on 1 Oct 2026.
- **"Recently Viewed" standard view:** not in the live Leads view list.
- **Extra standard views:** Zoho also has All Locked Leads, Converted Leads, My Converted Leads, Leads in Review, Mailing Labels, Unread Leads and Unsubscribed Leads. Treated like Converted / Junk Leads, which you ruled "not a gap" — say if you want any of them.
- **Sort and records-per-page inside the view editor:** Zoho's editor has neither (sort is in the toolbar, records per page in the column settings menu). CRM's editor has both.
- **Following records from the list, merging columns, an API to create or delete views:** Zoho does not have them either (CRM has the API).
- **Work Queue queues and module views kept apart:** already filed as NDC-1836.

---

## Part D — could not be checked

- **Kanban board behaviour** (items 15–17): needs a Kanban view to be created in Zoho; only the settings dialog was opened and cancelled. Those items rest on Zoho's help pages.
- **"Select all records in this view"** (item 12): the Zoho org has too few records for the option to appear.
- **Permissions** (items 7–8 and every 🔒 scenario in the spec): still no working lower-profile account on NDC-Staging.
- **Subform criteria** (NDC-1868 P1-2): no module with a subform on NDC-Staging.
- **Last Activity Time as a criteria field** (NDC-1868 P1-5): Zoho has it (seen live); not yet checked on the CRM screen.
- **Home page "Custom View" component** and **fetching records by view id through the API**: Zoho documents both; not checked on either side.

---

## Corrections to make in the spec and NDC-1869

- Item 5 / Z7: Zoho has fiscal quarter and fiscal year only, no calendar quarter.
- Item 20 / Z24: remove "Set reminders".
- Spec "Not yet confirmed — no tenant fiscal-year setting found": the build does have one (Company settings → Fiscal year), so Z7 is no longer blocked by it.
- Spec J5: Zoho's Sheet View article says 100 existing rows plus 200 new rows; the FAQ the spec quotes says 999.
- NDC-1869 names the spec as `CRM Specs/spec-crm-custom-views-v2.md`; in this repository it is `docs/custom-views/spec-crm-custom-views-v2.md`.
