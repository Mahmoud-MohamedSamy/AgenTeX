# Retest round 25 Oct 2026 — ticket details

Source: Plane project efce4d84-5876-4015-b472-2efca7ad73f3 (read-only pull, 25 Oct 2026).

Author ids seen in comments:
- `e1364b0b-d3cd-4167-8261-6194577a480a` — QA account (our retest comments; note some 14 Oct developer "Fixed" notes were also posted under this id)
- `9c2ff309-bbdb-4be3-b819-3022d9cf3c3b` — developer (all newest 24–25 Oct fix notes and deploy pings)
- `83c4a765-8318-424c-b7a7-17758d9bbc4e` — developer (15 Oct "Moving to Ready For Test" / deploy notes)

Times are as stored in Plane (offset shown); "@QA" = mention of e1364b0b. Inline screenshots in comments are noted, not reproduced.

Latest deploy (per developer, 25 Oct 04:29 UTC): staging-crm.taviportal.com — metadata-engine staging `12390a74` + CRM SPA (client-engine staging) `c907b2e12`. Server was down ~20:30–23:15 UTC on 24 Oct (Docker disk full); results from that window should be re-run.

---

## NDC-1819 — Workqueue Missings

uuid: 2b58d6ec-e6e0-4eb1-9fd9-febc541c2d08

**Steps** (a missing-items checklist, no step list; each item is a check)
1. Filter panel design — should look and behave exactly like Zoho's.
2. Filter categories — System Defined Filters, Filter By Fields, Filter By Related Modules.
3. Filter options per field type — date / number / text / pick list each offer the conditions that make sense.
4. Search inside the Filter panel — search bar; × clear button appears once something is typed.
5. Alphabet filter on Leads and Contacts (My Work Queues) on Lead Name / Contact Name; choosing All clears the letter.
6. Alphabet filter + normal filters work together; one must not cancel the other.
7. Column header menu (≡) with Asc, Desc, Pin Column, Hide Column; sorting moves from header click into this menu.
8. Table settings menu: Manage Columns, Reset Column Size, Records Per Page, View Mode (Wrap Text / Clip Text); drag-resize columns; Reset Column Size disabled until a width changed, then restores defaults.
9. Manage Columns window like Zoho: search bar, × clear once filled, pin/unpin columns.
10. Row actions on hover on the LEFT: "…" menu with Edit and Delete + Add Note icon. Today "…" is at far right; it contains a redundant "Mark as Completed".
11. Date filter in My Open Activities: Today & Overdue, Today, Tomorrow, Overdue, This Week, Next Week, This Month, Next Month, On a Specific Date (calendar).
12. Manage Queue — Category View: regroup queues inside the Manage Queue window by module (Leads, Contacts, Deals, Campaigns); apply only on Save; Cancel discards.
13. Category View — each module title has its own "+ (Create New Queue)" that opens creation for that module, skipping step 1 (Module and Layout).

**Expected**
- Each item above behaves like Zoho as described.

**Actual (old)**
- Original report: all 13 items missing / different (sorting by header click, "…" at right with Mark as Completed, limited date options, Category View applied immediately before Save and not regrouping the dialog, no per-module Create Queue).

**Environment**
- App: TAVI CRM — crm.taviportal.com (Work Queue)

**Comments**

1. 2026-10-14 04:23 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Partly delivered")
   Partly delivered (2026-10-14) — please read, this ticket needs splitting. This is a 14-item Zoho-parity list, not one defect.
   Fixed — the one confirmed defect: the Arrange Queues dialog applied Category/List mode the moment you clicked it, so it took effect before Save and Cancel could not undo it, and the list never regrouped by module in Category mode. The mode is now staged in the dialog, written only on a successful Save (Cancel discards it), and the rows regroup by module while Category is staged. 7 specs.
   Fixed through the sibling tickets: the filter panel items — a filter control on saved queues (NDC-1787) and all layout fields with correct option labels (NDC-1788).
   Not done, with the reason each needs its own ticket:
   1. Grouped filter panel + in-panel search, System Defined filters (Locked / Record Action / Touched / Untouched), related-module criteria — the system filters have NO server operators and related criteria are saved-view-only; backend work first.
   2. Alphabet filter (Leads/Contacts) — needs an alphabet rail in the shared table plus a server letter mode.
   3. Column header menu (Asc/Desc/Pin/Hide) — a new shared-table capability; sorting is header-click by contract today.
   4. Drag-resize columns + Reset Column Size — the shared table has no resize or width persistence.
   5. Table-settings menu (Manage Columns / Reset size / Records per page / Wrap-Clip) — depends on 4.
   6. Manage Columns search / clear / pin — shared panel, and pinning depends on 3.
   7. Row actions moved to the left + Add Note — the shared table renders row actions as a trailing column by contract.
   8. Nine activity periods instead of four — the periods are SERVER-computed buckets; the client must not bucket activities itself, so metadata-engine has to serve the new ones.
   9. Category View "+ Create Queue" per module (skipping step 1) — a feature addition beyond the filed defect.
   Items 3–7 are really one piece of work: giving the shared data table per-column menus, pinning and resizing. That is the biggest single item here and affects CRM records, Desk tickets and analytics, so it deserves its own ticket and a design pass. Shall I file these as separate tickets under this one as the parent?

2. 2026-10-19 11:08 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Retest — PARTIAL → moved to Bug. staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge · 18–19 Oct 2026.
   Developer's note checked first (14 Oct): Category View fixed; filter items through NDC-1787/1788; items 3–11 listed as not done. Several of those have shipped since (table settings, resize, column menu, date periods, row actions).
   Section 1 — 13-item checklist (retested twice, same result): 4 pass · 5 partial · 4 missing
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | 1 | Filter panel design like Zoho | Zoho side panel with checkboxes | Criteria-row bar (field / operator / value) | FAIL |
   | 2 | Categories System Defined / By Fields / Related Modules | Three Zoho categories | "Filter By Fields" + "System Fields"; no Locked / Touched / Untouched, no related modules | FAIL |
   | 3 | Options per field type | Conditions that fit each type | Date 27 operators; text, lookup and tags each type-specific | PASS |
   | 4 | Search in filter panel + clear (×) | Search bar with × once filled | Search present; no × after typing | PARTIAL |
   | 5 | Alphabet filter Leads / Contacts | A–Z rail; All clears | Not present | FAIL |
   | 6 | Alphabet + normal filters together | Both apply together | Not testable — item 5 missing | FAIL |
   | 7 | Column header menu | Asc, Desc, Pin Column, Hide Column | Asc, Desc, Hide — no Pin | PARTIAL |
   | 8 | Table settings + resize + Reset Column Size | Zoho's 4 options; drag-resize; reset disabled until resized | All present; Phone 142 → 257 px by drag; reset disabled before, enabled after, restores width | PASS |
   | 9 | Manage Columns search / clear / pin | Search, ×, pin / unpin | Search + "Clear search" present; no pin | PARTIAL |
   | 10 | Row actions on the left + Add Note; no redundant Mark as Completed | ⋮ (Edit, Delete) + Add Note on the left | ⋮ and Add Note on the left (Leads); Tasks menu still has "Mark as completed" | PARTIAL |
   | 11 | Date filter options | Zoho's 9 options incl. On a Specific Date | All present + "Next 7 days" | PASS |
   | 12 | Category View staged until Save | Regroup in dialog; apply only on Save; Cancel discards | As expected (restored to Grouped by module afterwards) | PASS |
   | 13 | Create Queue + per module, skipping step 1 | Opens creation for that module, step 1 skipped | Module preselected, but step 1 still shown (layout required) | PARTIAL |

   Section 2 — Functional test of newly delivered features (19 Oct). Works: sort from the column menu, Hide column (kept after reload), records per page (kept), drag-resize (kept) and Reset Column Size, Manage Columns search / Show / Hide, filter field search, row Edit / Delete / Add Note, and the periods Due today, Tomorrow, Next 7 days, This / Next week, This / Next month, On a specific date.
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | 1 | Sort from the column menu (item 7) | Asc / Desc order the rows | Full Name natural order 1, 2, 3 … 813 and back; Created At ascending — sort not kept after reload | PASS |
   | 2 | Hide column from the menu (item 7) | Column hidden, kept | Hidden and still hidden after reload | PASS |
   | 3 | Hide a locked column (Full Name / Phone) | Not offered, or Show brings it back | Header menu hides Phone; Manage Columns then shows Show disabled — only Reset to default restores it (Company is dropped by the reset) | FAIL |
   | 4 | Records per page, resize, Reset Column Size (item 8) | Applied and kept | 25 rows kept after reload; 183 → 278 px kept after reload; Reset restores | PASS |
   | 5 | Wrap Text / Clip Text (item 8) | Clip keeps one line per cell | Text cells change, but date cells still wrap mid-number in Clip mode | FAIL |
   | 6 | Manage Columns search / Show / Hide; filter field search (items 4, 9) | Narrow, apply, clear | "pho" → Phone; Show Email applied and kept; Clear search empties; "ph" → Phone in the filter (still no ×) | PASS |
   | 7 | Period Overdue (item 11) | Every open task past due | 2 tasks — only ISO-dated ones; 87 open imported tasks with text due dates are skipped | FAIL |
   | 8 | Today & Overdue / All open (item 11) | Open tasks only; = Today + Overdue | 110 / 112, incl. 20 Completed; Today (1) + Overdue (2) ≠ 110 | FAIL |
   | 9 | Due today, Tomorrow, Next 7 days, This/Next week, This/Next month, On a specific date | Match the data | 1, 0, 0, 1, 0, 2, 0; 17 Oct → 0 (its task is Completed), 19 Oct → 1. Side counts blank for some periods | PASS |
   | 10 | Row ⋮ actions + Add Note (item 10) | Work from the left | Edit opens the record; Delete asks to confirm (Cancel keeps it); Add Note saves (201) | PASS |

   Section 3 — Utility-column menus and column width limits (19 Oct)
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | 1 | Menu on the ⋮ row-options column and the Add Note column (My Leads) | No menu on utility columns, or a working option | ≡ menu with only "Hide column"; clicking it does nothing (also after reload); button has an empty name "Column options: " | FAIL |
   | 2 | Menu on the ⋮ row-options column and the Mark as completed column (Tasks) | Same | Same no-op "Hide column" on both | FAIL |
   | 3 | Minimum width, Clip Text | Value readable or ellipsis + full value on hover | Floor 105 px; values truncated with "…" ("QA RT …", "ndc-st…"); full value shown as a native hover tooltip | PARTIAL |
   | 4 | Header label at minimum width | Label and ≡ icon do not collide | ≡ icon overlaps "Full Name", "Lead Status", "Lead Owner", "Created At", "Company" | FAIL |
   | 5 | Minimum width, Wrap Text | Text wraps and stays readable | Names wrap to 2 lines, "ndc-staging-owner" to 3, phone numbers split over 2 lines | INFO |
   | 6 | Maximum width | A sensible maximum | No limit: 2708 px, then 5204 px; table 3707 px in a 1002 px viewport | FAIL |
   | — | Reset Column Size after the extremes | Default widths | Restored (212, 153, 183, 171, 130, 130, 112 px) | PASS |

   Section 4 — New defects found:
   1. Locked column can be hidden but not shown again. Full Name and Phone are locked in Manage Columns (Hide disabled), but their header menu still offers "Hide column". After hiding Phone that way, Show is disabled — only "Reset to default columns" brings it back, and the reset also hides Company.
   2. Clip Text does not clip date cells. In a narrowed Created At column the date breaks over 5 lines ("18/1 / 0/20 / 26 / 3:31 / PM") and the header overlaps the next one.
   3. Activity periods disagree. Overdue = 2, Today = 1, but Today & Overdue = 110 (20 of them Completed); All open = 112, also with Completed tasks. Cause seen in the data: 110 of 118 tasks came from an Excel import and store due_date as text ("09/21/2026 11:00 AM"); bucket=overdue only reads ISO dates, the other buckets count the text ones and do not exclude Completed. The side-panel counts are blank for some periods.
   4. Sort is not kept after a reload.
   5. Utility columns have a no-op "Hide column" menu. The ⋮ row-options column and Add Note (My Leads), and the ⋮ row-options column and Mark as completed (Tasks), each show a ≡ menu whose only option, Hide column, does nothing; the menu button has an empty name ("Column options: "). These columns should have no menu.
   6. Header label collides with the ≡ icon at minimum width. At the 105 px floor the icon overlaps "Full Name", "Lead Status", "Lead Owner", "Created At", "Company". Cell values are cut to "QA RT …" / "ndc-st…" (the full value is in the hover tooltip).
   7. No maximum column width. Full Name could be dragged to 2708 px and then 5204 px, pushing every other column off-screen (table 3707 px in a 1002 px viewport).
   Still open from the checklist: items 1, 2, 5, 6 (missing) and the Pin / × / "Mark as completed" / step-1 parts of items 4, 7, 9, 10, 13. Suggest splitting these and the 7 defects above into child tickets.
   Evidence (annotated): NDC-1819-retest-PARTIAL.png, NDC-1819-functional-PARTIAL.png, NDC-1819-columns-PARTIAL.png

3. 2026-10-25 00:36 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Your 7 new defects + the smaller open items — fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   1. Locked column hidden from the header menu. Full Name / Phone (required fields — locked in Manage Columns) no longer offer "Hide column" in their header menu.
   2. Clip Text did not clip dates. Date and number cells now stay on one line with "…" and the full value on hover, like text cells; Wrap Text still wraps them.
   3. Activity periods disagreed (server). Two causes, both seen in your data: (a) 110 imported tasks store the due date as text ("09/21/2026 11:00 AM"); the "Today & Overdue" check compared that text and matched every one of them, while Overdue ignored them. A due date that is not a real date now matches no period, consistently. (b) Tasks set to Completed by an import or by editing the status carry no Closed Time, so they counted as open; a task whose status is Completed is now treated as done in every period and in All open. Note: the 110 text-dated imported tasks will now appear only under "All open" until their due dates are corrected (new imports already store proper dates — NDC-1791); I can prepare a one-off repair for that tenant if you want them in the periods too.
   4. Sort not kept after reload. The chosen sort is now remembered per user per module and re-applied when you come back to the Work Queue (a sort in the URL still wins).
   5. Utility columns' no-op menu. The ⋮ row-options, Add Note and Mark as completed columns have no ≡ menu any more.
   6. Header label overlapping the ≡ icon. The label now cuts with "…" before the icon at narrow widths.
   7. No maximum column width. A column can be dragged to at most 800 px; widths already saved wider are shown at 800 px.
   Also from the checklist:
   - Item 4 — × in the filter field search: added (it clears the search and keeps focus).
   - Item 5/6 — A–Z filter on Leads: the rail exists on queues, but your Leads keep the whole name in "Full Name" (first_name) with Last Name off the layout, and the rail never indexed first names — so it did not appear. It now falls back to Full Name when the module has no other name field (Contacts still index by last name).
   - Item 10 — "Mark as completed" in the Tasks row menu: removed; the green tick column is the one control for it.
   - Item 7 / 9 — Pin: header-menu Pin is in place on the Work Queue tables; please re-check after the deploy.
   Not changed, with the reason:
   - Item 13 — skip step 1 for a module with several layouts: a queue's layout can never be changed after saving, and the app cannot tell which layout you mean, so it asks once (a module with one layout already skips straight to Categorization). If product wants a default-layout pick here, it needs a decision on which layout counts as the default.
   - Items 1–2 — Zoho's checkbox filter panel and the System Defined / Related Modules categories: Locked / Touched / Untouched have no server filter at all, and related-module filters are not supported on ad-hoc lists yet — this needs backend work and is best split into its own ticket, as you suggested.

4. 2026-10-25 06:35 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; metadata-engine staging 12390a74 + CRM SPA c907b2e12). Ready for test — item-by-item list in my comment above. Note: the server was down from about 20:30 to 23:15 UTC on 24 Oct (its Docker disk was full); it is fully back now, so results from that window should be re-run.

---

## NDC-1788 — Work Queue | Filter offers only Status and Priority — every other layout field is unavailable

uuid: a8fe8f52-bdfc-4948-9950-9e4f44020352

**Steps**
1. Log in to crm.taviportal.com (NDC-Staging tenant).
2. Open Work Queue → My Open Activities → Tasks.
3. Click the Filter (funnel) icon in the grid toolbar.
4. Observe the filter row that appears under the page title.
5. Open the Priority chip and observe the option list.
6. Compare the offered fields against the columns rendered in the grid, and against the Tasks layout field list.

**Expected**
- The filter panel offers every field on the module's layout, not a hard-coded pair — at minimum every column the grid is currently rendering.
- Each field renders the control its data type calls for:
  - Date / date-time (Due date, Created Time, Modified Time, Closed Time, Last Activity Time) → date and range pickers
  - Lookup (Contact Name, Related To, Task Owner, Created By, Modified By) → record/user picker
  - Picklist (Status, Priority) → option list
  - Text (Subject) → contains / equals text match
  - Tag → tag picker
- A search box at the top of the panel so a field can be found by name.
- System-defined filters that are not layout fields offered as their own group (Locked, Record Action, Related Records Action, Touched Records, Untouched Records).
- Filtering can reach related modules (e.g. Notes).
- Value lists show the display labels (Low, Normal, High, Highest) — never the internal stored tokens — and the field name is not rendered as a selectable option inside its own value list.
- Same field-type-driven behavior for every module reachable from Work Queue (Leads, Deals, Contacts), not Tasks alone.

**Actual (old)**
- Filter row renders only Status and Priority; "Filters" label with no control to add a field.
- Subject, Due date, Related To visible as grid columns but cannot be filtered.
- Task Owner, Created By, Created Time, Modified By, Modified Time, Closed Time, Last Activity Time, Contact Name, Tag absent.
- No field search; no system-defined group; no related-module filtering.
- Priority shows a search box, then "Priority" itself as a checked option, then low, normal, high, highest in lowercase (grid shows Title case).

**Environment**
- App: Anyware CRM — crm.taviportal.com; tenant NDC-Staging
- Account: ndc-staging-owner (ND), CRM Teamspace, Manager View → "My work queue"
- Browser: Microsoft Edge 152.0.7977.83, Windows 10 (x86), 1912×922; date 22/09/2026
- Jam: https://jam.dev/c/442619e0-b400-43e8-a906-cf6911f1c0d3
- Attachment: zoho-workqueue-filter-reference-annotated.png (reference behavior)

**Comments**

1. 2026-10-14 04:23 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14). The four fields were hard-coded (status, priority, outgoing_call_status, call_type) in a Work Queue-only filter bar.
   Change: the Work Queue now offers the module's full filterable catalogue through the same composition the records page uses — every filterable layout field, each with its datatype's operators, plus the synthetic Owner / Source / Tags filters. It also fixes the labels you flagged: options render their display labels ("Low") instead of the raw stored tokens ("low"), because the old bar read the unhydrated catalogue.
   Also verified: the "Priority appears pre-selected inside its own list" part was already fixed — under multi-select the placeholder row is an action, never a ticked option.
   Not included: Zoho's grouped filter panel (System Defined / Fields / Related modules) and in-panel field search. System-defined filters such as Locked / Touched / Untouched have no server operators at all, and related-module criteria are a saved-view-only dialect the records endpoint refuses ad hoc — both need backend work first. I have left those as explicit follow-ups on NDC-1819.

2. 2026-10-19 10:02 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Retest 18 Oct 2026 — PARTIAL → moved to Bug. staging-crm.taviportal.com · tenant NDC-Staging · Edge · ndc-staging-owner (CRM Admin). Evidence: NDC-1788-retest-PARTIAL.png.
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | 1 | Field search | Search box at the top of the panel | "Search fields" present | PASS |
   | 2 | Every layout field offered | All Tasks layout fields | 12 layout + 7 system fields; still missing Created By, Modified Time, Modified By | PARTIAL |
   | — | Type-driven operators | Operators fit the field type | Due date 27 date operators; Subject contains/starts with; Related To equals/empty; Tags any/all/none | PASS |
   | 3–4 | Display labels, not stored tokens | Low, Normal, High, Highest | Priority value list still shows low, normal, high, highest (field metadata has no labels; the grid title-cases them). Comment said fixed. | FAIL |
   | 5 | Other pick lists | Display labels | Status shows Not Started / In Progress / Completed / Deferred / Waiting on someone else | PASS |
   | — | Field name not inside its own value list | No "Priority" option | No longer shown | PASS |
   Open: (1) Priority value labels; (2) Created By, Modified Time, Modified By missing from the field list. System-defined filters / related modules are tracked under NDC-1819.

3. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Both open points fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   1. Priority value labels. The Tasks Priority field is seeded with the stored tokens low / normal / high / highest and no separate labels, while the imported tasks hold "Normal" / "High" — that is why the grid and the filter disagreed. The stored values are unchanged; the display now maps these seeded tokens to Low / Normal / High / Highest in the filter value list, the records sidebar, the grid cells and the record view (Arabic too).
   2. Created By and Modified By are now in the filter field list (the record's real creator / last editor, a user list like Owner). Modified Time: the existing "Last Activity" filter is that column (the record's modified time — see also NDC-2109), so no second field was added for it.
   How to retest: Work Queue → Tasks → filter → Priority: values read Low / Normal / High / Highest; "Priority equals High" still returns the same rows. The field search finds Created By and Modified By; filtering Created By = you narrows to tasks you created.

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-1837 — Workqueue | Lookup and Multi-Select Lookup fields offer a plain text field for input instead of its correct behavior in Create Queue - Categorization step.

uuid: a38cffdb-4bb9-4879-8d06-0056efc98fe0

**Steps**
1. Open Work Queue and click Create Queue.
2. Choose the module (Leads) and a layout, then click Next.
3. In the Categorization step, choose Criteria.
4. Click Select a field and choose a Lookup field (e.g. Lookup Permission).
5. Look at the value box — it is a plain text input.
6. Change the field to a Multi-Select Lookup field (e.g. Multi-Select Lookup Permission).
7. The value box is again a plain text input.

**Expected**
- For a Lookup field, the value box lets the user choose records from the linked module. If the field can link to more than one module, the user first picks the module, then the record; if one module only, straight to that module's records.
- The criteria still offers operators: is, isn't, contains, doesn't contain, starts with, ends with, is empty, is not empty.
- A Multi-Select Lookup field works the same way and allows several records to be selected.

**Actual (old)**
- For both Lookup and Multi-Select Lookup fields, the value box is a plain text input with no way to choose records.

**Environment**
- App: TAVI CRM — crm.taviportal.com (Work Queue → Create Queue → Categorization)
- Browser: Edge 152.0.7977.83; OS Windows 10; screen 1912×922
- Captured: 26 Sep 2026, 14:55 (Cairo)
- Jam: https://jam.dev/c/b82bb10e-ce99-4b18-80e5-5eff7bdf6b5b

**Comments**

1. 2026-10-14 04:25 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14) — together with NDC-2101, the same missing branch. In the shared criteria editor a lookup / multi_select_lookup field had no value control, so it fell through to a plain text box — a typed record name was stored literally and matched nothing.
   Change: the row now opens the record picker — single-select for a lookup, multi-select for a multi-select lookup or a multi-value operator — and stores record IDS, the shape the server's lookup operators expect. A polymorphic lookup asks for the target module first. The stored value shape is unchanged, so Mass Delete, split criteria, the custom-view editor and the queue wizard all keep working.
   Backwards compatible: a criterion previously saved as free text still loads — it renders as an unresolved chip showing the raw text, and is never silently dropped (dropping a row would renumber the criteria pattern).
   Tests: 12 specs, including polymorphic module-then-record, the free-text chip surviving, and multi-pick keeping existing values.
   Known remaining gap: the records page's Filter sidebar has the same lookup gap. It was outside this change's scope — worth its own ticket, and I can do it next.

2. 2026-10-15 17:14 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Partially Fixed, but the UI needs adjustment because the new picklists and lookup overlaps with the add/remove criteria button. (Screenshot attached inline.)

3. 2026-10-25 00:36 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Overlap fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). In the Create Queue categorization step the value column is narrow (five columns per row). The lookup value put the module picker (fixed width) and the "Pick records" button side by side, and neither could shrink, so they spilled over the row's remove (−) and add (+) buttons. The module picker now takes its own line, and the pick button shortens with "…" when space is tight, so both always stay inside their column.
   How to retest: Work Queue → Create Queue → Categorization → criteria → a lookup field (e.g. Related To / Contact Name) → the module picker and "Pick records" sit inside the value column; − and + stay clickable; also with a multi-select lookup, and at a narrow window width.

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2098 — Custom Views | ?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads

uuid: d1ef2976-b984-4e8e-b2a2-376c480c8d32

Found by test case CVS-B14 — The ?view= URL opens permitted views and falls back safely for others.

**Steps**
Before you start: logged in as the Owner (Tenant Owner). IDs known for: own 'QA CV x'; 'QA CV shared-to-me' shared by the lower-profile user; deleted 'QA CV gone'; the lower-profile user's private 'QA CV user-private'.
1. Open /modules/{m}?view={id} with the ID of 'QA CV x'.
2. Repeat with the ID of 'QA CV shared-to-me'.
3. Repeat with the ID of 'QA CV gone'.
4. Repeat with the ID of 'QA CV user-private'.
5. Check the browser console after each.
Test data: Own 'QA CV x'; Shared 'QA CV shared-to-me'; Deleted 'QA CV gone'; Foreign 'QA CV user-private'.

**Expected**
- The own and shared views open.
- The deleted and foreign IDs fall back to All Leads with no crash, and nothing of the foreign view (name, criteria, records) is shown.

**Actual (old)**
- Own QA CV x → opens; QA CV shared-to-me (shared by test user 1) → opens.
- Deleted QA CV gone and test user 1's private QA CV user-private → toast 'That view is no longer available. Showing your default view.', ?view= removed, nothing of the foreign view shown, no console errors.
- The fallback is not All Leads — both land on the last-used view (QA CV close11).

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Test case CVS-B14, run execu_2026-10-05_11-20-40.
- Attachments: B14-vs-zoho.png, B14-deleted-fallback.png, zoho-B14-invalid-view-id.png.

**Comments**

1. 2026-10-14 03:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): not a bug — this is the specified precedence. View resolution is: ?view= → the user's last view → the system "All" view. A deleted or foreign id is dropped from the URL with a toast and the next rule applies, which is the last-used view — not "All". That order is in listView.helpers.ts and in the custom-views spec, and the toast says the default view is being shown.
   If product prefers falling back to All Leads whenever the URL names a view that no longer exists, it is a one-line change — but it is a behaviour decision, so please confirm and I will treat it as a change request rather than a defect.

2. 2026-10-15 01:19 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Moving to Ready For Test — this is the specified precedence. View resolution is: ?view= → the user's last view → the system "All" view. A deleted or foreign id is dropped from the URL with a toast and the next rule applies, which is the last-used view, not "All". That order is in listView.helpers.ts and in the custom-views spec, and the toast tells the user the default view is being shown.
   If product prefers falling back to All Leads whenever the URL names a view that no longer exists, it is a one-line change — but it is a behaviour decision, so it should be a change request rather than a defect. Confirm and I will make it. @QA please verify and route the choice.

3. 2026-10-19 10:03 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Retest 18 Oct 2026 + product decision 19 Oct — moved to Bug. staging-crm.taviportal.com · tenant NDC-Staging · Edge · ndc-staging-owner. Evidence: NDC-2098-retest-DECISION.png.
   | Check | Expected | Now | Result |
   |---|---|---|---|
   | Own view via ?view= | Opens | Opens | PASS |
   | Deleted id / another user's private id | Safe fallback; nothing of the foreign view shown | Toast "That view is no longer available. Showing your default view.", ?view= removed, foreign name/criteria never shown (GET → 404) | PASS |
   | Which view it falls back to | All Records of the selected module (All Leads, All Deals, …) | Lands on the last-used view (QA RT k7) | FAIL |
   Decision: an invalid or foreign ?view= must fall back to the module's All Records view (e.g. All Leads), not to the last-used view. The precedence "?view= → last view → All" stays for a plain URL without ?view=. Please also update the toast text to match (e.g. "Showing All Leads").

4. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Implemented per the product decision (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   A ?view= naming a deleted, foreign or other-layout view now opens the module's All view (All Leads, All Deals, …), never the last-used one, and the toast names it: "That view is no longer available. Showing All Leads." (Arabic too). A plain URL without ?view= keeps the old order: last view → All.
   How to retest: with QA RT k7 as your last view, open /modules/<leads>/records?view=<deleted id> → All Leads + the new toast + ?view= removed; repeat with another user's private view id; then open Leads normally → QA RT k7.

5. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2101 — Custom Views | Lookup criteria in the view editor take free text only (no record picker); a typed record name is saved literally and matches nothing

uuid: 88fbaf01-b5b7-4769-ac82-c84744340e32

Found by test case CVS-D16 — Lookup equals, not_equal_to and empty return the correctly linked records.

**Steps**
Before you start: logged in as the Owner (Tenant Owner); seed leads QA CV L01…L12 exist (spec §1.2); X and Y are two records of the Lookup Permission target module; Lookup Permission set on the seed leads as in Test data.
1. Open Leads → New custom view 'QA CV lookup' with Name starts_with 'QA CV' and Lookup Permission equals X; Save and record the result.
2. Edit row 2 to not_equal_to X, then empty; record each.
3. Cross-check: apply the same Lookup Permission condition in the Leads Filter panel, or call GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?filters=<same condition>, and compare the total with the grid's record count.
Test data: L01 → X; L02 → X; L03 → Y; L04 empty.

**Expected**
- Equals X → L01, L02.
- Not_equal_to X → L03 (L04 handled as the module filter does).
- Empty → L04 only.
- Counts equal the module filter.

**Actual (old)**
- Seeds Q01 → contact X (QA CV C01), Q02 → X, Q03 → Y (QA CV C02), Q04 empty.
- API with stored form '<module id>:<record id>': equals X → Q01, Q02; not_equal_to X → Q03, Q04 (empty included); is_empty → Q04; is_not_empty → Q01, Q02, Q03 — grid equals the module filter.
- Value for Lookup Permission is a plain text box ('Value for Lookup Permission') with no record search/picker/suggestions; typing 'QA CV C01' saves the literal text and the view returns 0 records.
- A bare record id also matches nothing. A user cannot build a working lookup criterion in the editor.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Leads module id 841043e1-c078-41f9-8d6e-dfd61bee45c3. Test case CVS-D16, run execu_2026-10-05_11-20-40.
- Attachments: D16-vs-zoho.png, D16-lookup-value-control.png, zoho-D16-lookup-picker.png.

**Comments**

1. 2026-10-14 04:25 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14) — same change as NDC-1837. Lookup criteria in the view editor now use the record picker instead of free text, storing record ids (and the module-qualified reference for a polymorphic lookup), so a criterion matches the records you picked rather than nothing.
   An existing criterion saved as typed text still loads, shown as an unresolved chip with its raw value, so no saved view loses a row or has its criteria pattern renumbered.
   Tests: 12 specs across the new value control and its pure rules. Full records-ui suite green (840 tests).

2. 2026-10-15 16:48 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Fixed but produced another bug: the new picklists overlap with the add/remove criteria buttons. (Screenshot attached inline.)

3. 2026-10-25 00:36 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Overlap fixed — same change as NDC-1837 (merged to staging, ships with the next test-server deploy; staying in Bug until then). The lookup value control in the view editor's criteria rows could not shrink (fixed-width module picker + a button that never wraps), so in a narrow row it covered the add / remove buttons. The module picker is now on its own line and the pick button truncates, so the control always fits its column.
   How to retest: Leads → New custom view → criteria on a lookup field (Related To, a polymorphic lookup, and a multi-select lookup) → nothing overlaps − / +, including with several records picked and at a narrow window.

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2106 — Custom Views | Deleted criteria field: no banner on the view's list page (only in the editor, by API name) while the view keeps filtering on the deleted field

uuid: 25fec70c-812b-40a4-93fe-32328ae5aadc

Found by test case CVS-E09 — A view whose criteria field is deleted shows the deleted-field banner and still runs.

**Steps**
Before you start: logged in as the Owner; seed leads QA CV L01…L12 exist (spec §1.2); Owner has created number field 'QA CV Temp Number' on Leads; L01 = 5, L02 = 0.
1. Open Leads → New custom view 'QA CV temp-field' with Name starts_with 'QA CV' and 'QA CV Temp Number' greater_than 1; Save; confirm L01 is returned.
2. Delete the field 'QA CV Temp Number' from the Leads layout.
3. Open 'QA CV temp-field' from the picker; record the banner and the result.
4. Open its editor and record how the row is shown.
5. Cross-check: apply Name starts with 'QA CV' in the Leads Filter panel, or GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?filters=<same condition>, and compare with the grid count.
Test data: field 'QA CV Temp Number'; L01 = 5; L02 = 0.

**Expected**
- Banner "Some fields in this view's criteria are deleted or hidden from you: QA CV Temp Number…" is shown, the view still runs with no error, and the result is recorded and consistent with the cross-check.

**Actual (old)**
- Field 'QA CV Temp Number' (qa_cv_temp_number) created; L01 = 5, L02 = 0. View → L01.
- Field deleted (204). View still runs, still returns only L01 (name-only filter gives 19 QA CV rows).
- List page shows no banner; only the editor shows 'Some fields in this view's criteria are deleted or hidden from you: qa_cv_temp_number.' (API name), row reads 'Select a field'. 2 console errors (403).

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin, test user 1, test user 2 (as above). Leads module id 841043e1-c078-41f9-8d6e-dfd61bee45c3.
- Test case CVS-E09, run execu_2026-10-05_11-20-40. Attachments: E09-vs-zoho.png, E09-deleted-field-view.png, E09-deleted-field-editor.png.

**Comments**

1. 2026-10-14 03:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): working as specified, with one fair enhancement. Two parts of the report are intended behaviour: the view KEEPS filtering on a deleted field (Phase 1 of the spec deliberately preserves the criterion rather than silently changing what the view matches), and the flag is specified as an EDITOR notice only. The API name is also all a hard-deleted field leaves behind — there is no label left to show.
   The reasonable ask inside this ticket is a banner on the view's LIST page, so a user who never opens the editor learns why the view looks odd. That is an enhancement rather than a defect.
   Suggested action: keep this ticket as the enhancement (list-page banner) or re-file it as one — happy to implement it; it is small. Please confirm which you prefer.

2. 2026-10-15 01:01 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Re-checked against the attachments and the spec. This one splits three ways: two parts are working as designed, and the third is a real gap — which I have now fixed. Keeping it in Bug until the fix is deployed.
   1. "The view keeps filtering on the deleted field" — by design. docs/custom-views.md §10 (Phase 1): a field delete is a hard FieldDrafts.Remove that cleans layouts but not views, and the view keeps evaluating (a missing data key simply matches nothing). Silently dropping the criterion would change what the view returns without telling anyone, and it would renumber the criteria pattern. Returning only QA CV L01 is therefore correct.
   2. "The banner names qa_cv_temp_number, not 'QA CV Temp Number'" — not fixable. The delete is a hard delete; the row and its label map are gone, so the API name is literally all that survives. (This is also why the editor row shows "Select a field".)
   3. "No banner on the view's list page" — real gap, fixed. The server already flags it on every read of the view: settings.unavailable_fields plus unavailable_reason = "criteria_field_unavailable" (§2.4). The frontend was only rendering it in the editor. Added the banner to the records list page, above the grid, same sentence as the editor: "Some fields in this view's criteria are deleted or hidden from you: qa_cv_temp_number. The view still filters on them." New component libs/records-ui/src/views/list/ListViewCriteriaNotice.tsx, next to ListViewColumnsNotice; EN + AR strings. Type-check and lint clean. Also covers a criteria field hidden from the viewer by field permissions.
   Also noted: E09-vs-zoho.png records Zoho as "Not checked live", Match "Not comparable" — so the expected banner wording came from the test case, not observed Zoho behaviour. The 2 console 403s are separate; if they reproduce, raise them with the failing request.
   Next: stays in Bug until the frontend is deployed, then Ready For Test. Retest should confirm only item 3 — the banner on the list page. Items 1 and 2 are expected behaviour; suggest amending CVS-E09. @QA heads-up — I will ping you once it is on staging.

3. 2026-10-15 03:21 (+03, edited 03:22) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Fixed, built and deployed to the test server (41.128.143.171, CRM SPA rebuilt from staging cd7383658, 2026-10-15 00:19 UTC). @QA ready for test.
   What changed — the view's own list page now carries the notice, not only the editor: "Some fields in this view's criteria are deleted or hidden from you: {fields}. The view still filters on them." It reads the same server flag the editor reads (settings.unavailable_fields, sent on every read of the view), sits above the grid, never blocks anything. EN + AR both shipped.
   How to test (CVS-E09):
   1. Leads → new custom view with Name starts_with 'QA CV' and a temporary number field greater_than 1; save and confirm it returns L01.
   2. Delete that number field from Leads.
   3. Open the view from the picker: the notice now appears above the list naming the field, and the view still runs and still returns L01 (unchanged).
   4. The editor still flags the row as before.
   5. Same notice for the other case: instead of deleting the field, have an admin set it to "Don't Show" for your profile — the list says the same thing.
   6. Arabic: switch language, re-open the view, the notice is translated.
   Two things NOT changed on purpose: the field is still named by its API name (qa_cv_temp_number) — hard delete leaves no label; the two console 403s are not part of this change, file separately with the request URL if they still appear.
   Also by design: nothing is auto-removed from a saved view's criteria — dropping a row would renumber the criteria pattern, so repairing the view stays the author's explicit edit.

4. 2026-10-15 16:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Still Reproducible — the field used as criteria should not be deleted. (Screenshot attached inline.)

5. 2026-10-25 00:40 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Done as you asked: a field used in a Custom View's criteria can no longer be deleted (merged to staging — server + frontend; ships with the next test-server deploy; staying in Bug until then).
   Deleting such a field is now refused, as in Zoho, with a message that names the views, e.g. "qa_cv_temp_number" is used by custom view(s): QA CV view. Remove the field from those before deleting it. The layout builder's "Delete Permanently" dialog also lists them up front under a new Custom views group, with the hint to change or remove the condition first.
   It covers every way a view can use a field: a criterion on the field itself, a "lookup → field" criterion, a queue's date rule, and another module's view that filters through a related-module block. Columns and sort do not block (a deleted column is simply dropped from the view on its next save).
   How to retest (CVS-E09): create the QA CV view with the temporary number field → try to delete the field → refused, naming the view; remove the condition from the view → the delete now succeeds. The list-page banner from the earlier fix stays for views saved before this guard existed.

6. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; metadata-engine staging 12390a74 + CRM SPA c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2113 — Custom Views | A record holding a removed pick-list value is shown in an unmarked extra column - no 'no longer an option' flag

uuid: ea78170c-40c3-420f-96b8-1bcfa7b17bfe

Found by test case CVS-I04 — A record holding a value removed from the pick list is flagged on the board.

**Steps**
Before you start: logged in as the Owner; Kanban view 'QA CV kb-status' exists on Leads (Categorize by: Lead Status); the Owner adds an option (e.g. 'QA CV stale') to Lead Status, sets a lead to it, then removes the option.
1. Open 'QA CV kb-status'.
2. Find the lead on the board.
3. Read the column and message shown for it.
4. Open the lead and read Lead Status.
Test data: removed value 'QA CV stale' (this run used 'QA CV Temp' on QA CV L12).

**Expected**
- The lead is still shown on the board, marked with "This value is no longer an option of the field".

**Actual (old)**
- QA CV L12 holds 'QA CV Temp' (added to Lead Status then removed).
- Board 'QA CV kb-status': L12 still shown, in an extra column 'QA CV Temp' (count 1) placed before Unaccounted.
- No 'This value is no longer an option of the field' marker anywhere (text, title, aria-label, tooltip on header or card); the stale column looks normal and offers 'Create Lead'.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Test case CVS-I04, run execu_2026-10-05_11-20-40. Attachments: I04-vs-zoho.png, I04-stale-value.png.

**Comments**

1. 2026-10-14 04:25 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14). The column for a value that is no longer an option was already computed and already refused drops, but it was unlabelled: its hover hint borrowed the empty-column copy, and the board still offered "Create <record>" on it — which would have created a record on a dead value.
   Change: the column is now visibly marked as a value that is no longer offered, with its own copy (en + ar), and its Create footer is gone. Its records stay visible on purpose — hiding them would make the board disagree with the list.
   Tests: 3 header specs plus a board-level spec ("marks it and offers no Create on it").

2. 2026-10-15 14:46 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   A record holding a removed pick-list value is now moved to a new stage named "Unaccounted", but there is a new bug found ⇒ cards can be moved to "Unaccounted" which is not relevant. (Screenshot attached inline.)

3. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). "Unaccounted" is now a source-only column on every board: cards can be dragged OUT of it onto a real value, never INTO it (the column dims while dragging, like a removed-value column). Clearing a value is done on the record itself.
   How to retest: Deals Kanban → drag a card toward Unaccounted → refused; drag a card from Unaccounted to a stage → moves and the record's value is set.

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-1789 — Workqueue | Applied filters don't persist on refresh/next session (new login)

uuid: 18b5bfd4-763f-40de-8e6a-9d7e606fc26b

**Steps**
1. Log in to crm.taviportal.com (NDC-Staging tenant).
2. Open Work Queue → My Open Activities → Tasks.
3. Click the Filter (funnel) icon, open the Status chip and select In Progress.
4. Confirm the grid narrows (Total Records 2) and the funnel shows an active-count badge of 1.
5. Refresh the page (F5).
6. Observe the grid once it finishes loading.
7. Re-apply a filter — Status = Completed — and confirm the grid narrows again.
8. Open the account menu (ND) → Logout, sign back in, and return to Work Queue → Tasks.
9. Observe the grid.

**Expected**
- An applied filter survives a page refresh: chips, funnel active-count badge, "Clear filters" button and the narrowed result set are all restored.
- The filter persists into a new session for the same user, restored from that user's saved list preferences for the module.
- "Clear filters" remains the only way to drop a filter — never dropped silently.
- Same persistence across every Work Queue view, not Tasks alone.

**Actual (old)**
- After refresh (step 6): filter row gone, funnel plain with no badge, Total Records back to 10.
- After logout/login (step 9): identical — no chips, no badge, Total Records 10.
- URL https://crm.taviportal.com/workqueue/activities/tasks throughout, no query string.
- No error; the filter is simply dropped.

**Environment**
- App: Anyware CRM — crm.taviportal.com; tenant NDC-Staging
- Account: ndc-staging-owner (ND), CRM Teamspace, Manager View → "My work queue"
- Browser: Microsoft Edge 152.0.7977.83, Windows 10 (x86), 1912×922; date 22/09/2026
- Jam: https://jam.dev/c/97db0194-41aa-447a-afb6-6d84d7236a43

**Comments**

1. 2026-10-14 03:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): not a defect — filters are deliberately session state, but worth building. Work Queue filter picks are section state by design: not in the page URL (the Work Queue has one URL writer and filters are deliberately not part of it) and not in the persisted Work Queue preferences (rail mode, last section, per-module columns). So losing them on refresh is current intended behaviour, not a regression.
   Zoho-style persistence is a reasonable ask. The right seam is the existing per-user, per-module preferences blob (alongside the Work Queue column prefs), hydrated once the prefs have loaded — NOT the URL.
   Note: I am currently rebuilding the Work Queue filter control (NDC-1787 / NDC-1788 — it only existed for My Open Activities and offered four fields). Persistence is a natural follow-up once that lands; say the word and I will add it to the same preferences blob.

2. 2026-10-15 01:19 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Moving to Ready For Test — filters are deliberately session state today, but the ask is reasonable. (Same reasoning as the triage note: not in the URL, not in the persisted Work Queue preferences; losing them on refresh is current intended behaviour, not a regression.)
   Zoho-style persistence is worth building. The right seam is the existing per-user, per-module preferences blob, alongside the Work Queue column prefs, hydrated once the prefs have loaded — not the URL. The Work Queue filter control was rebuilt in the meantime (NDC-1787 / NDC-1788); persistence is a natural follow-up on top of it.
   Please confirm whether you want it, and I will add it to that preferences blob. @QA please verify the current behaviour and route the request.

3. 2026-10-15 03:21 (+03, edited 03:21) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Built and deployed to the test server (41.128.143.171, CRM SPA rebuilt from staging cd7383658, 2026-10-15 00:19 UTC). @QA ready for test.
   What changed — the applied filters are now kept per user, per list, in the module's own preferences (the same place the Work Queue's columns and page size already live), so they are restored on a refresh and on a new login from any browser. They are not in the URL, so a link does not carry them.
   How to test:
   1. Work Queue → My Open Activities → Tasks. Open the funnel and apply a filter (e.g. Priority is High). Rows narrow, the funnel shows the count.
   2. Hard-refresh the page: the filter is still applied, the funnel still shows its count, and the panel is open on the same rows.
   3. Sign out, sign in again, reopen Work Queue: still applied. Try the same user in a different browser — also applied (stored server-side).
   4. Clear filters → the rows come back and stay back after a refresh. That is the only way to drop them.
   5. Switch the period (Overdue / Due today / Next 7 days): the filter stays applied.
   6. Scope check: a filter set on Tasks does not appear on Calls or Meetings, and a filter set on one queue does not appear on another queue of the same module (My Work Queues → two queues on Leads).
   By design (not a bug): the A–Z letter on a queue is not remembered (Zoho's rail resets to All); a half-filled filter row is never stored; if the field a stored filter uses is later deleted or its type changed so its operator no longer applies, that row is dropped on the next load; filters are per user.
   Covered by 17 new automated tests; 273 Work Queue tests green.

4. 2026-10-19 10:02 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Retest 18 Oct 2026 — FAIL → moved to Bug. staging-crm.taviportal.com · tenant NDC-Staging · Edge · ndc-staging-owner (two browsers). Evidence: NDC-1789-retest-FAIL.png.
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | — | Filter saved per user, per list | Stored in module preferences | GET list-preferences → workqueueFilters.activities = [priority equals high] after every step | PASS |
   | 1–2 | Hard refresh keeps the filter | Chips, badge and narrowed rows restored | Restored once, then lost on 4 of 4 reloads (badge "Filter", 112 records instead of 44) | FAIL |
   | — | New login / other browser | Still applied | Fresh sign-in in a second browser: unfiltered (112) although the preference holds the filter | FAIL |
   | 3 | Section switch | — | Calls → Tasks restores it (44): the data is saved; the page does not read it on first load | INFO |
   | — | Clear filters | Drops it and stays dropped | workqueueFilters {} after Clear; still unfiltered after reload | PASS |
   | — | Scope | Tasks filter not on other lists | Not shown on Calls, Meetings, My Leads, EveryLeadWithNoAnswerStatus | PASS |
   | — | Period switch (Overdue) | Filter stays applied | Lost (same first-load problem) | FAIL |
   Steps: Work Queue → My Open Activities → Tasks → filter Priority equals high (44) → reload /workqueue/activities/tasks → 112, no filter chip. Likely cause: the saved workqueueFilters are applied only on section change, not on first mount.

5. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Root cause found and fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   Your diagnosis was right: the saved filter was read on first load but restored against an incomplete field list. The filter field list always contains Owner / Source / Created By / Modified By immediately, before the layout's own fields arrive. The restore ran as soon as the list was non-empty, could not find priority in it, and dropped the row — then marked the list as "restored", so it stayed unfiltered. A section switch worked because by then the fields were already cached.
   Change: the restore now waits until the module's field list (and its tag list) has fully loaded, then applies the saved rows.
   How to retest (same steps as your sheet): Tasks → Priority equals high → hard reload 4 times → still 44 with the chip each time; fresh sign-in in another browser → still applied; Overdue period → still applied; Clear filters → stays cleared.

6. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2117 — Custom Views | View name validation messages are never shown: empty/space-only names just disable Save, and a 121-character name is silently cut to 120

uuid: 6822e8d1-2c35-41cb-a022-045644b5f390

Found by test case CVS-C02 — The view name is validated and every accepted name is shown as plain text.

**Steps**
Before you start: logged in as the Owner; Leads holds 'QA CV name' (for D7).
1. Click New custom view.
2. Enter the first name from Test data and click Save.
3. Record the message or the saved name (GET the view).
4. Repeat for every name in Test data.
5. Open the picker, the tab, the Manage custom views page and the delete dialog for the D11 view.
Test data:
- D1: '' (empty)
- D2: '   ' (spaces only)
- D3: 'Q'
- D4: 'QA CV ' + 114 × 'x' (120 chars)
- D5: 'QA CV ' + 115 × 'x' (121 chars)
- D6: '  QA CV trim  '
- D7: 'qa cv NAME' (vs existing 'QA CV name')
- D8: 'QA CV عملاء القاهرة'
- D9: 'QA CV عملاء Cairo' + U+200F
- D10: 'QA CV 🚀😀𝒳'
- D11: 'QA CV <img src=x onerror=alert(1)>'
- D14: 'QA CV zero' + U+200B + 'width' + U+0007

**Expected**
- D1 and D2 blocked with "Enter a name for the view."
- D5 blocked with "A view name can be at most 120 characters."
- D3, D4, D8, D9, D10 save and display exactly as typed.
- D11 shown as literal text in picker, tab, Manage page and delete dialog; no script runs.
- Behaviour consistent and documented: D6 stored trimmed?, D7 accepted or refused as duplicate?, D14 zero-width/control chars stripped, rejected or kept?

**Actual (old)**
- D1 '' and D2 '   ': Save disabled; 'Enter a name for the view.' never shown.
- D5 (121): input stops at 120, so 'A view name can be at most 120 characters.' never appears (truncated name then hit 409 VIEW_NAME_TAKEN against the D4 view).
- D3, D4 (120), D8 Arabic, D9 (RLM kept), D10 emoji saved exactly as typed.
- D6 stored trimmed ('QA CV trim'). D7 refused as duplicate (409, case-insensitive). D14 ZWSP and U+0007 kept.
- D11 literal text everywhere; no <img>, no script.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Test case CVS-C02, run execu_2026-10-05_11-20-40. Attachments: C02-vs-zoho.png, C02-empty-name-no-message.png, zoho-C02-empty-name-save.png.

**Comments**

1. 2026-10-14 03:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): not a bug — prevention by design. The custom-view editor prevents both invalid states instead of scolding after the fact: Save stays disabled until the name has content (the spec states this), and the field carries a 120-character maxLength, so a 121st character cannot be typed or pasted — nothing is "silently cut", because the value never exceeds the cap.
   Related and genuinely wrong: the shared saved-view dialog used by Kanban and Split (NDC-2127) had NO cap and collapsed the server's name error into a generic message. That one is being fixed, which also makes the convention consistent across all three dialogs.

2. 2026-10-15 01:18 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Moving to Ready For Test — not a defect; the editor prevents both invalid states rather than scolding after the fact. Save stays disabled until the name has content (this is what the spec asks for), and the field carries a 120-character maxLength, so a 121st character cannot be typed or pasted — nothing is "silently cut", because the value never exceeds the cap.
   Related and genuinely wrong, already fixed separately: the shared saved-view dialog used by Kanban and Split (NDC-2127) had no cap and collapsed the server's name error into a generic message. That fix also makes the convention consistent across all three dialogs. @QA please verify and close if it holds.

3. 2026-10-15 13:20 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Still Reproducible, no error messages are shown when view name is empty, contains spaces only, or user tries to enter more than 120 characters.

4. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). The messages existed but only ran on Save — and Save is disabled while the name is blank, so they could never appear. The name field now says what is wrong as you type:
   - empty or spaces-only name, once you edit or leave the field → "Enter a name for the view."
   - reaching 120 characters → "A view name can be at most 120 characters." (a 121st character still cannot be typed)
   - a duplicate name → "You already have a view with this name." (on Save, as before)
   How to retest: new custom view → click into Name and leave it → message; type spaces → message; paste 121 characters → the cap message; Arabic shows the Arabic copy.

5. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2120 — Custom Views | A pick list value removed from the field is not shown in the view editor (blank 'Value', no warning), although the view still filters on it

uuid: 1aa74ef3-cf9b-4bce-97c2-42cba6a577c2

Found by test case CVS-D14 — Picklist operators split records correctly and a value later removed from the picklist does not crash the view.

**Steps**
Before you start: logged in as the Owner; seed leads QA CV L01…L12 exist (spec §1.2); S1 and S2 are two Lead Status values; one seed lead has an empty status.
1. Open Leads → New custom view 'QA CV picklist' with Name starts_with 'QA CV' and Lead Status equals S1; Save; then edit to not_equal_to S1, contains_any_of S1,S2 and contains_none_of S1,S2; record each result.
2. In the Leads layout, add the pick list value 'QA CV Temp' to Lead Status and set L12 to it.
3. Edit the view to Lead Status equals 'QA CV Temp'; Save; confirm L12 is returned.
4. Remove 'QA CV Temp' from the Lead Status pick list.
5. Reopen the view and its editor; record the result and how the stale value is shown.
6. Cross-check: same Lead Status condition in the Leads Filter panel, or GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?filters=<same condition>, compare with grid count.
Test data: S1 = status of L01; S2 = status of L02; temporary value 'QA CV Temp' (on L12); lead with empty status from the seed set.

**Expected**
- Equals S1 → only S1 leads; not_equal_to S1 → the rest (empty status handled as the module filter does); contains_any_of → S1 and S2 leads; contains_none_of → the rest.
- After the value is removed the view opens with no crash or error, the stale value is shown in the editor, and results are consistent with the module filter.

**Actual (old)**
- S1 = No Answer, S2 = Busy. Equals S1 → L01, L15; not_equal_to S1 → rest incl. empty-status L12; contains_any_of S1,S2 → L01, L02, L13, L14, L15; contains_none_of → rest (all equal module filter).
- 'QA CV Temp' added and set on L12; view → L12. Value then removed (back to 16 values).
- Reopened: grid still returns L12 showing 'QA CV Temp', no crash.
- Editor shows the row as 'Lead Status | Equals | Value' — stored value not shown, no "no longer an option" notice.
- 2 console errors (403) when the CRM Admin opens the editor.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Test case CVS-D14, run execu_2026-10-05_11-20-40. Attachments: D14-vs-zoho.png, D14-editor-stale-value.png, D14-zoho-picklist-criteria.png.

**Comments**

1. 2026-10-14 04:25 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14). A pick-list value that an admin has since removed was simply absent from the options list, so the row's Value box fell back to its placeholder and looked empty — while the view went on filtering by it.
   Change: the row now shows the stored value, labelled as no longer an option (en + ar), so the author can see what the view filters on and decide. The value itself is never silently changed or dropped, and a multi-select entry stays ticked and survives the next toggle. Text, date and lookup rows are unaffected.
   Tests: 6 specs (stale label on the trigger, a known value untouched, stale multi entry preserved, plus the pure rules).

2. 2026-10-15 12:55 (+03, edited 12:56) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Still Reproducible. Modules and Fields - Custom Views | No dependency check when deleting a pick list option used in a custom view's filter (used by any other feature). When a user tries to delete a field or an option within it ⇒ The user sees a message that names the dependent features, and the deletion is blocked until they are changed or removed. (Screenshot attached inline.)

3. 2026-10-25 00:40 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Done as you asked: the dependency check now exists (merged to staging — server; ships with the next test-server deploy; staying in Bug until then).
   Saving a pick-list field that removes an option a Custom View filters on is refused, naming the views, e.g. "No Answer" cannot be removed from "lead_status": it is used by custom view(s): Unreached leads. Change or remove it in those views first. This holds even when the removal maps the old value to a replacement, because the view's condition would still name the old value. Values match case-insensitively, whether the condition holds one value or a list ("is any of").
   Deleting the whole field is covered by NDC-2106 (same message style).
   How to retest: a view with Lead Status is "No Answer" → Modules & Fields → Lead Status → remove "No Answer" → save is refused with the view named; change the view's condition → the removal saves.

4. 2026-10-25 06:35 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; metadata-engine staging 12390a74). Ready for test — steps in my comment above.

---

## NDC-2122 — Custom Views | Upper-case 'AND' pattern is accepted by the editor and the API

uuid: 5d893ed7-7e5a-49c0-8810-94471cb82d12

Found by test case CVS-D22 — Every invalid criteria pattern is blocked in the editor and rejected by the API.

**Steps**
Before you start: logged in as the Owner.
1. Open Leads → New custom view 'QA CV bad-pattern' and add three rows (Name starts_with 'QA CV', Lead Status is_not_empty, Comment is_empty).
2. Enter each 3-row pattern in Test data; click Save; record the message.
3. Add rows to 5 for the depth-4 pattern and to 25 for the 201-character pattern; Save each and record the message.
4. POST /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views with each pattern and record the status code.
5. GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views?kind=list and confirm no 'QA CV bad-pattern' exists.
6. Click Cancel.
Test data:
- Unbalanced: '(1 and 2 or 3'
- Empty group: '()'
- Bare operator: '(and)'
- Trailing operator: '1 and'
- Missing operator: '1 2'
- Missing row: '1 and 5'
- Unused row: '1 and 2' (row 3 unused)
- Row used twice: '1 and 1 and 2 and 3'
- Unknown word: '1 xor 2 and 3'
- Upper case: '1 AND 2 AND 3'
- 201 chars (25 rows): '(1) and (2) and … (20) and 21 and 22 and 23 and 24 and 25'
- Depth 4 (5 rows): '((((1 and 2) or 3) and 4) or 5)'

**Expected**
- For every pattern the editor shows "Fix the criteria pattern: every row number must appear once, and brackets must match." (or a more specific message) and Save is blocked.
- The API rejects every pattern with 400/422. No view is created.

**Actual (old)**
- Editor: every other invalid pattern disables pattern Save with a specific message (e.g. 'Brackets are not balanced.'); view Save paused while editing the pattern.
- API: every other invalid pattern → 422 with specific message (unbalanced, unexpected ')', two operators, ends unexpectedly, criteria 5 does not exist, criteria 3 missing, criteria 1 used twice, unknown word xor, nests deeper than 3 levels, at most 200 characters).
- Upper-case '1 AND 2 AND 3' accepted by the editor and by the API (201).

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1, test user 2 (as above). Leads module id 841043e1-c078-41f9-8d6e-dfd61bee45c3.
- Test case CVS-D22, run execu_2026-10-05_11-20-40. Attachments: D22-vs-zoho.png, D22-uppercase-accepted.png.

**Comments**

1. 2026-10-14 03:06 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): not a bug — case-insensitivity is specified. and / or are accepted in any case on BOTH sides: the server tokenizer lower-cases them and the frontend pattern checker does the same (pinned by criteriaPattern.spec.ts). Accepting AND is therefore correct, not a validation gap, and typing it changes nothing about how the pattern evaluates.
   Suggested action: update test case CVS-D22 (the expectation that upper case must be rejected) and close.

2. 2026-10-15 01:18 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Moving to Ready For Test — not a defect. Case-insensitivity is specified: and / or are accepted in any case on BOTH sides — the server tokenizer lower-cases them and the frontend pattern checker does the same (pinned by criteriaPattern.spec.ts). Typing AND changes nothing about how the pattern evaluates, so accepting it is correct rather than a validation gap.
   Suggested action: update test case CVS-D22 (which expects upper case to be rejected) and close. @QA please verify and close if it holds.

3. 2026-10-15 12:43 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Still Reproducible. Better fix is to disable editing the Criteria Pattern manually and make it switchable between "and", "or" by clicking on it. (Screenshot attached inline.)

4. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). The Edit Pattern box now converts to lower case as you type: typing 1 AND 2 shows and saves 1 and 2, and a pattern that was saved in upper case through the API opens lower-cased. So upper-case AND / OR can no longer be entered or saved from the editor; how a pattern evaluates is unchanged.
   On the suggested "click to toggle and/or" design: kept the editable pattern, because Zoho's pattern supports brackets — (1 or 2) and 3 — which a per-row toggle cannot express. If product still wants the toggle, it would be a separate change request.
   How to retest: edit a view's criteria → Edit Pattern → type 1 AND 2 → it reads 1 and 2; Save; reopen → ( 1 and 2 ).

5. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2124 — Custom Views | List preferences accept more than 50 column overrides (51 stored); no oldest-dropped or 4xx rule

uuid: b19d5e73-e018-4129-8f4e-b19160b9f7ed

Found by test case CVS-F04 — A 51st column override is handled by one recorded rule (oldest dropped or rejected).

**Steps**
Before you start: logged in as the Owner.
1. GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/list-preferences and save a copy.
2. Make sure 51 Leads list views exist; create 'QA CV ov-01'…'QA CV ov-NN' via POST /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views to make up the number.
3. Apply a column override to each of the 51 views in order (Manage Columns or PUT list-preferences).
4. GET list-preferences; count the overrides and note which view lost or never got one.
Test data: overrides 51 (limit 50); override = hide one column per view.

**Expected**
- Behaviour consistent and documented: either the oldest override (view 1) is dropped and 50 remain, or the 51st is rejected with 4xx.
- No 500, and the other 50 overrides are intact.

**Actual (old)**
- 51 Leads list views (incl. 'QA CV ov-NN').
- PUT list-preferences with an override for each of the 51 → 200.
- GET shows all 51 stored (first and last kept) — 50-override limit not enforced.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1, test user 2 (as above). Leads module id 841043e1-c078-41f9-8d6e-dfd61bee45c3.
- Test case CVS-F04, run execu_2026-10-05_11-20-40. Attachments: F04-vs-zoho.png, F04-api-51-overrides.png.

**Comments**

1. 2026-10-14 03:05 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer triage note)
   Triage (code review, 2026-10-14): not a bug — the rule exists, in the component that owns the data. The 50-override cap with oldest-dropped eviction is implemented in the frontend that owns this blob (listView.helpers.ts: VIEW_OVERRIDES_CAP = 50 + withViewOverride). The list-preferences endpoint is deliberately an opaque round-trip — the server stores the blob without interpreting it, which is why a direct PUT of 51 entries is accepted.
   Suggested action: test this through the UI (Manage Columns on 51 different views), not the API. If we want the API to enforce it too, that means giving the server a schema for the blob — a design change, not a fix.

2. 2026-10-15 01:18 (+03) — author 83c4a765-8318-424c-b7a7-17758d9bbc4e (developer)
   Moving to Ready For Test — not a code defect. The 50-override cap with oldest-dropped eviction is implemented in the frontend that owns this blob (listView.helpers.ts, VIEW_OVERRIDES_CAP = 50). The list-preferences endpoint is deliberately an opaque round-trip: the server stores the blob without interpreting it, which is why a direct PUT of 51 entries is accepted.
   Retest through the UI — Manage Columns on 51 different views — rather than against the API. Enforcing it server-side would mean giving the server a schema for the blob, which is a design change, not a fix. @QA please verify and close if it holds.

3. 2026-10-19 10:02 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Retest 18 Oct 2026 (through the UI, as asked) — FAIL → moved to Bug. staging-crm.taviportal.com · tenant NDC-Staging · Edge · ndc-staging-owner. Evidence: NDC-2124-retest-FAIL.png.
   Steps: created 51 private Leads views QA RT ov-01…ov-51 in order; on each, Manage Columns → Hide a column → Apply; read prefs.viewColumns after each batch.
   | # | Check | Expected | Now | Result |
   |---|---|---|---|---|
   | 1 | Cap of 50 overrides (UI) | 50 remain after the 51st | 50 remain | PASS |
   | 2 | The oldest override is dropped | ov-01 dropped; ov-02…ov-51 kept | ov-38 dropped; ov-01 and ov-02 still kept | FAIL |
   | 3 | Why (observation) | — | The stored key order is not creation order (first keys ov-29, ov-46, ov-36…, looks sorted by view id), so "oldest" is taken from a reordered object. ov-38's id (01431e95…) sorts first. | INFO |
   Suggestion: store a timestamp (or an ordered array) with each override and evict by that, not by object key order.

4. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Your observation was exactly the cause — fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   The preferences are stored in Postgres jsonb, which does not keep object keys in the order they were written (it sorts them by length, then by bytes), so "the first key" after a reload was whichever view id sorted first — ov-38. Each override now carries the time it was last written, and above 50 the least recently written is dropped — the order no longer depends on key order. Overrides saved before this change count as the oldest.
   How to retest (your steps): 51 views ov-01…ov-51, hide a column on each in order → after the 51st, ov-01 is the one dropped, ov-02…ov-51 kept. Re-saving ov-02 before the 52nd moves it to "newest", so ov-03 goes next.

5. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2130 — Custom Views | Arabic UI: 'records' in the record count and the sort label's field/direction are not translated

uuid: 70d9fdf5-db85-48c6-a7d1-26450bde9486

Found by test case CVS-L01 — The picker, editor, manage pages, Kanban and Split are fully translated in Arabic, including user-count plurals.

**Steps**
Before you start: logged in as the Owner; session language Arabic; 'QA CV ar-1', 'QA CV ar-2' and 'QA CV ar-3' on Leads shared with 1, 2 and 3 selected users.
1. Open the Leads view picker and read every heading, hint and footer.
2. Open New custom view and go through name, criteria, pattern, columns and sharing.
3. Open Manage custom views and read Shared To for 'QA CV ar-1', 'QA CV ar-2' and 'QA CV ar-3'.
4. Open the Deals Kanban board and Manage Kanban views.
5. Open Split view on Leads.
6. Note every English string or raw translation key.
Test data: language ar; plural string "{{count}} users" with count 1, 2, 3.

**Expected**
- Every string is in Arabic, with no English fallback or raw key.
- "{{count}} users" uses the correct Arabic plural form for 1, 2 and 3.

**Actual (old)**
- UI switched to Arabic (dir=rtl, lang=ar). Translated: picker button 'طرق العرض المخصصة', picker items ('كل Leads*', 'Leads الخاصة بي*' …), editor ('طريقة عرض مخصصة جديدة لـ Leads', 'تحديد المعايير'), Manage page ('إدارة طرق العرض المخصصة لـ Leads'), Kanban/Split controls.
- Plurals in Shared To: 1 'مستخدم واحد', 2 'مستخدمان', 3 '3 مستخدمين' — correct (the '3' uses a Latin digit while dates use Arabic-Indic digits).
- Record count reads '٥٠ records' ('records' untranslated); toolbar sort label reads 'ترتيب: created_at desc' (raw field key and direction).
- Module/field names (Leads, Deals, Full Name) are tenant data, not counted.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views).
- Test case CVS-L01, run execu_2026-10-05_11-20-40. Attachments: L01-vs-zoho.png, L03-deals-arabic.png.

**Comments**

1. 2026-10-14 04:26 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14) — both halves.
   "records" untranslated: the Arabic file only had the singular and the generic plural, and Arabic has six plural categories — 50 falls in a category that had no entry, so i18next fell back to English. All six forms are now provided, grammatically: "لا سجلات" / "سجل واحد" / "سجلان" / "{{n}} سجلات" / "{{n}} سجلاً" / "{{n}} سجل".
   Sort label: it interpolated the raw field key and direction. It now shows the field's label and the translated direction (filed separately as NDC-2125).
   The desk and salesiq copies of the shared file were regenerated, and the locale sync check passes.

2. 2026-10-15 11:43 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Partially Fixed.
   - Records count is not translated
   - sort by asc/desc is fixed
   (Screenshot attached inline.)

3. 2026-10-25 00:35 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Records count — root cause found and fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). The earlier note claimed the six Arabic plural forms were added, but the Arabic file still had only two. Arabic picks a different form for 3–10 and 11–99; with those missing, the app fell back to the English "records". All six forms are now in place for the record count, plus the same gap on four Kanban strings (selected-count, hidden-values notices, shared-users count).
   How to retest in Arabic: lists with 0, 1, 2, 5, 50 and 150 records → "لا توجد سجلات" / "سجل واحد" / "سجلان" / "5 سجلات" / "50 سجلاً" / "150 سجل" — no English word.

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2131 — Custom Views | Arabic: header layout picker accessible name stays 'Layout'; 'records' untranslated

uuid: 9c14289d-752d-4553-b67a-2399e2aa94d2

Found by test case CVS-L03 — Probability, Layout and Pipeline labels are translated in Arabic.

**Steps**
Before you start: logged in as the Owner; session language Arabic; Deals Kanban view 'QA CV ar-stage' by Stage exists.
1. Open 'QA CV ar-stage' on Deals.
2. Read the layout picker label and the pipeline picker label.
3. Read the "Probability {{value}}%" text in each stage header.
4. Switch to English and compare the same three labels.
Test data: language ar; labels Probability, Layout, Pipeline.

**Expected**
- "Probability", "Layout" and "Pipeline" appear in Arabic; none falls back to English.

**Actual (old)**
- Deals board in Arabic: board layout picker 'التخطيط' (translated) but the header layout picker keeps the accessible name 'Layout'; the count reads '٥٠ records'.
- No pipeline picker and no 'Probability …%' in stage headers in either language (see CVS-I05 ticket NDC-2114), so those two labels cannot be checked.
- Also reproduced on the 4 Oct build.

**Environment**
- staging-crm.taviportal.com, tenant NDC-Staging (Africa/Cairo), Chromium, 5 Oct 2026.
- Accounts: CRM Admin (in place of Owner), test user 1, test user 2 (as above).
- Test case CVS-L03, run execu_2026-10-05_11-20-40. Attachments: L03-vs-zoho.png, L03-deals-arabic.png.

**Comments**

1. 2026-10-14 04:26 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (developer note, "Fixed")
   Fixed (2026-10-14).
   Layout picker: the records page passed a hard-coded English string as the control's label, which is what screen readers announce — so it stayed "Layout" in every language. It now uses the existing translation key (the Arabic copy was already there, just unread).
   "records" untranslated: fixed as part of NDC-2130 — the Arabic file was missing four of Arabic's six plural categories, so counts like 50 fell back to English. All six are now in place.

2. 2026-10-15 11:40 (+03) — author e1364b0b-d3cd-4167-8261-6194577a480a (QA retest)
   Still reproducible. (Screenshot attached inline.)

3. 2026-10-25 00:36 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then).
   - "records" untranslated: same root cause as NDC-2130 — the Arabic file had only two of Arabic's six plural forms, so counts like 50 fell back to English. All six are in now.
   - Layout picker accessible name: the list page's picker was already translated; the remaining "Layout" was the Create record page header's layout picker, which had the English word hard-coded. It now reads "التخطيط" in Arabic.
   How to retest in Arabic: the record count on Leads, and the layout picker's accessible name on both the Leads list and the Create Lead page (screen reader or devtools → Accessibility).

4. 2026-10-25 06:34 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.

---

## NDC-2280 — Custom Views | Long custom view name is not truncated and pushes the Sharing column out of view

uuid: cae95c37-bdf5-4d58-ac0f-adbac851d0fa

**Steps**
Precondition: log in to CRM staging; create a Leads custom view with a very long name that has no spaces (e.g. "QA CV" followed by 100+ "x" characters).
1. Go to Sales > Leads.
2. Open the Manage custom views page.
3. Look at the "All custom views" table.

**Expected**
- The long view name is truncated with an ellipsis (full name in a tooltip) or wrapped within its column.
- The Sharing column stays fully visible.
- The table fits the page width without a horizontal scrollbar.

**Actual (old)**
- Long name shown in full on one line and stretches the column.
- Sharing column cut off at the right edge (header "Sha", values "Onl" / "Eve").
- Horizontal scrollbar at the bottom of the table.

**Environment**
- Staging ONLY (staging-crm.taviportal.com), Edge (Chromium), Windows, viewport about 1280×984.
- Page: "Manage Leads custom views".

**Comments**

1. 2026-10-25 00:36 (+03) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   Fixed (merged to staging, ships with the next test-server deploy). The View Name column had no maximum width, so a long name without spaces stretched it. It is now capped: a long name is cut with "…" and the full name shows on hover; the Sharing column stays visible with no horizontal scrollbar at 1280 px.
   How to retest: your steps — "QA CV" + 100 × "x" → Manage custom views → name truncated with tooltip, Sharing fully visible.

2. 2026-10-25 06:35 (+02) — author 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b (developer)
   @QA Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.
