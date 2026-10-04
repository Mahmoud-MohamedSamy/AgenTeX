# Defects — CRM Custom Views, Spec v3 Low/Medium run (2026-10-04)

20 defects from 75 cases. Every defect has a side-by-side TAVI vs Zoho comparison image (`*-vs-zoho.png`) unless noted.

## 1. List preferences changed in two browser tabs: the later write silently overwrites the earlier one (lost update)

- **Severity:** Medium
- **Case:** CVS-B15 — Preferences changed in two browser tabs are saved consistently

**Steps to reproduce**
1. Open Leads in browser tab 1 and select 'QA CV A'.
2. Open Leads in browser tab 2 and select 'QA CV B'.
3. In tab 1, close the view tab 'QA CV B'.
4. In tab 2, close the view tab 'QA CV A'.
5. Send GET /api/v1/modules/{m}/list-preferences.

**Expected:** Behaviour is consistent and documented: record the final lastListViewId, openListViewIds and recentlyClosedListViewIds. If one tab's change is lost (lost update), record it as a possible bug against the NDC-1869 note. Cleanup: delete 'QA CV A' and 'QA CV B' and purge them from the Recycle Bin.

**Actual:** Tab 1 selected 'QA CV A', tab 2 selected 'QA CV B'. Tab 1 closed 'QA CV B' (tab bar then had A, not B). Tab 2 (stale copy) closed 'QA CV A' (its tab bar had B, not A). Final list-preferences: lastListViewId = LeadsFromChats; openListViewIds contains 'QA CV B' again and not 'QA CV A'; recentlyClosedListViewIds = [QA CV A, close11 … close03] - 'QA CV B' is missing. After reloading tab 1 the 'QA CV B' tab is back. Lost update: tab 2's write replaced the whole preference object and undid tab 1's close. The preference has a 'version' field, but the stale write was accepted (no conflict).

**Evidence:** [cv-122938-874a-B15-tab1-final.png](./screenshots/cv-122938-874a-B15-tab1-final.png), [cv-122938-874a-B15-tab2-final.png](./screenshots/cv-122938-874a-B15-tab2-final.png), [cv-122938-874a-B15-vs-zoho.png](./screenshots/cv-122938-874a-B15-vs-zoho.png)

## 2. Arabic UI: the criteria pattern '(1 or 2) and (3 or 4)' is displayed as '( and (3 or 4) (or 2 1) )' - brackets and order reversed

- **Severity:** Medium
- **Case:** CVS-D24 — In the Arabic UI the pattern's row numbers, brackets and and/or read correctly

**Steps to reproduce**
1. Open Leads → New custom view 'QA CV rtl-pattern' with four rows: Lead Status equals S1, Lead Status equals S2, Comment is_not_empty, Name starts_with 'QA CV'.
2. Enter the pattern (1 or 2) and (3 or 4) and read it as displayed.
3. Save, reopen the editor and read the pattern again.
4. Switch to English, open the same view and compare the results.
5. Cross-check: apply the same pattern in the Leads Filter panel, or call GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?filters=<same condition>, and compare the total with the grid's record count.
6. Cleanup: delete 'QA CV rtl-pattern' and purge it from the Recycle Bin.

**Expected:** In Arabic, row numbers, brackets and the and/or connectors display in the correct order with brackets correctly paired (not reversed or misplaced). The results are identical in Arabic and English and equal the module filter count.

**Actual:** Rows: Lead Status = No Answer, Lead Status = Busy, Comment is not empty, Full Name starts with 'QA CV'. UI switched to Arabic (header language menu -> العربية; page dir=rtl). Pattern entered '(1 or 2) and (3 or 4)' and saved; stored pattern '(1 or 2) and (3 or 4)'. FAIL: in Arabic the pattern line is displayed as '( and (3 or 4) (or 2 1) )' - brackets and token order reversed (English text inside an RTL line without LTR isolation); same after reopening. Pattern keywords stay English ('or'/'and') while row connectors are Arabic 'و'. Results identical: Arabic grid and English grid both QA CV L01, QA CV L02, AEX-01; API total 3. Language switched back to English.

**Evidence:** [cv-122938-874a-D24-arabic-editor.png](./screenshots/cv-122938-874a-D24-arabic-editor.png), [cv-122938-874a-D24-arabic-editor-reopened.png](./screenshots/cv-122938-874a-D24-arabic-editor-reopened.png), [cv-122938-874a-D24-arabic-pattern-display.png](./screenshots/cv-122938-874a-D24-arabic-pattern-display.png), [cv-122938-874a-D24-english-editor.png](./screenshots/cv-122938-874a-D24-english-editor.png), [cv-122938-874a-D24-vs-zoho.png](./screenshots/cv-122938-874a-D24-vs-zoho.png)

## 3. 'Last Activity' in view criteria is the record's modified time; adding a note does not update it (NDC-1868 P1-5 expects activity time)

- **Severity:** Medium
- **Case:** CVS-D25 — Last Activity Time can be used as a criteria field and follows record activity

**Steps to reproduce**
1. On Leads, open New custom view 'QA CV last-activity' and open the criteria field list.
2. Look for Last Activity Time.
3. If offered, set Last Activity Time, Age in Days = 7, add Lead Name starts with QA CV, and Save.
4. Read the results.
5. Add a note to 'QA CV L02' and reload the view.

**Expected:** Last Activity Time is in the criteria field list with the date-time operators. The view returns 'QA CV L01' and not 'QA CV L02'; after the note is added, 'QA CV L02' is returned too (NDC-1868 P1-5; Zoho offers the field — seen live 2 Oct 2026). If the field is not offered, mark Fail and note it.

**Actual:** 'Last Activity' is in the criteria field list with the date-time operators; view 'QA CV last-activity' (Age in days = 7) saved from the editor, stored field last_modified_at, returns 3 records all exactly 7 days since last modified. FAIL: the field is the record's modified time, not an activity time - a note added to QA CV L03 (POST notes 201, Timeline 'Note added' 3:37 PM) left last_modified_at at 09:34:30Z (12:34 PM) and a 'last 1 hour' filter on it does not return L03; editing a record (tagging L01/L02) does move it. Zoho offers 'Last Activity Time' (notes, tasks, calls, emails count). Precondition (a QA lead inactive >7 days) could not be set up - all seeds were created today.

**Evidence:** [cv-122938-874a-D25-timeline-note.png](./screenshots/cv-122938-874a-D25-timeline-note.png), [cv-122938-874a-D25-grid-last-activity-unchanged.png](./screenshots/cv-122938-874a-D25-grid-last-activity-unchanged.png), [cv-122938-874a-D25-record-note-added.png](./screenshots/cv-122938-874a-D25-record-note-added.png), [cv-122938-874a-D25-zoho-last-activity-field.png](./screenshots/cv-122938-874a-D25-zoho-last-activity-field.png), [cv-122938-874a-D25-vs-zoho.png](./screenshots/cv-122938-874a-D25-vs-zoho.png)

## 4. Dropdown picker: "Clone" and "Delete view" in a view menu do nothing (no request, no dialog); they work from the tab menu

- **Severity:** Medium
- **Case:** CVS-G04 — Cloning the same view twice never fails with a server error on the duplicate name

**Steps to reproduce**
1. Open Leads and clone 'QA CV clone-src', keeping the suggested name, and save.
2. Clone 'QA CV clone-src' again, keeping the suggested name.
3. Try to save and read the result.
4. Call POST /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views/{v}/clone twice in a row and read both responses.
5. Call GET /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views?kind=list and list every view whose name starts with 'QA CV clone-src'.
6. Cleanup: delete 'QA CV clone-src' and every clone of it and purge them from the Recycle Bin.

**Expected:** Each clone either gets a unique generated name or the user is prompted to rename it ("You already have a view with this name."). No request returns a 500 or an unhandled VIEW_NAME_TAKEN error, and no two of OWNER's Leads views share a name.

**Actual:** Duplicate-name handling works: POST …/clone twice -> 201 'Copy of QA CV clone-src' and 201 'Copy of QA CV clone-src (2)'; Clone from the tab menu (tabs layout) -> POST clone, editor opens with 'Copy of QA CV clone-src (3)', save -> 'Custom view "Copy of QA CV clone-src (3)" saved.'. No 500, no unhandled VIEW_NAME_TAKEN, no duplicate names. FAIL: in dropdown layout (this account's Leads setting at the time), 'Clone' in a view's ⋮ menu inside the picker does nothing - no POST, no editor, no toast; tried 3 times, including with the view active. The same happens with "Delete view" in that menu (G08): no confirmation, no request, the view stays; Pin view from the same menu does work.

**Evidence:** [cv-122938-874a-G04-clone-menu.png](./screenshots/cv-122938-874a-G04-clone-menu.png), [cv-122938-874a-G04-after-clone-click.png](./screenshots/cv-122938-874a-G04-after-clone-click.png), [cv-122938-874a-zoho-deals-tab-menu.png](./screenshots/cv-122938-874a-zoho-deals-tab-menu.png), [cv-122938-874a-G04-vs-zoho.png](./screenshots/cv-122938-874a-G04-vs-zoho.png)

## 5. 16th pin accepted (204) and stored; picker silently shows only 15 - pin limit not enforced

- **Severity:** Medium
- **Case:** CVS-G06 — A 16th pin is refused because the limit is 15 pinned views

**Steps to reproduce**
1. Open Leads and open the tab menu on 'QA CV pin-16'.
2. Choose Pin view and read the message.
3. Open the picker and count the views under Pinned views.
4. Call PUT /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views/{QA CV pin-16 id}/pin and read the response.
5. Call GET /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views?kind=list and count views with pinned = true.
6. Cleanup: unpin the views pinned for this test; delete 'QA CV pin-01'…'QA CV pin-16' and purge them from the Recycle Bin.

**Expected:** The 16th pin is refused in the UI with a message stating the limit of 15, and the API returns a 4xx error (no 500). Pinned views still holds exactly 15 views and 'QA CV pin-16' is not pinned.

**Actual:** Pinned before: 1 (QA CV pinned; LeadsFromChats no longer pinned for the owner). Pinned QA CV pin-01…pin-14 via API -> 15 pinned. 'Pin view' on QA CV pin-15 from the picker row menu -> PUT …/pin 204, no message. Direct API PUT …/pin -> 204. GET views: 16 pinned (pin-15 pinned=true). Picker 'Pinned views' group shows only 15 (pin-15 hidden). Expected refusal with a 15-limit message and API 4xx. In tabs layout the tab bar does show QA CV pin-15 as a pinned tab (16 pinned tabs).

**Evidence:** [cv-122938-874a-G06-pinned-group.png](./screenshots/cv-122938-874a-G06-pinned-group.png), [cv-122938-874a-G06-16th-pin.png](./screenshots/cv-122938-874a-G06-16th-pin.png), [cv-122938-874a-zoho-deals-tab-menu.png](./screenshots/cv-122938-874a-zoho-deals-tab-menu.png), [cv-122938-874a-G06-vs-zoho.png](./screenshots/cv-122938-874a-G06-vs-zoho.png)

## 6. Kanban column cap: records whose value is past the 75th are hidden (no 'Other values' column) and board-summary says truncated=false

- **Severity:** Medium
- **Case:** CVS-H14 — A board on a pick list with more than 75 values shows the column cap notice

**Steps to reproduce**
1. Create Kanban view 'QA CV kb-80' on Leads with Categorize by: 'QA CV Picklist80'.
2. Open the board and read the notice.
3. Count the columns.
4. Search the board for QA CV L01 and QA CV L02.
5. Call GET /modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/board-summary?group_by=<QA CV Picklist80>&view_id=<v> and read truncated.
6. Cleanup: delete 'QA CV kb-80' and purge it from the Recycle Bin; clear the field on QA CV L01 and L02 and delete 'QA CV Picklist80'.

**Expected:** The notice "Only the first 75 values are shown as columns." is shown and the board has 75 value columns plus Unaccounted. Behaviour is consistent and documented: record where QA CV L01 and L02 appear (PRD P1-7 wants an "Other values" column) and the truncated flag from board-summary.

**Actual:** Field 'QA CV Picklist80' (pick list, values v01…v80) created on Leads; QA CV L01 = v76, QA CV L02 = v80. Kanban 'QA CV kb-80' (categorize by it, created via API since the field is not placed in a layout). Board: notice 'Only the first 75 values are shown as columns.'; 75 value columns v01–v75 + Unaccounted. FAIL: L01 and L02 appear nowhere on the board - no v76/v80 column, not in Unaccounted (which holds the 105 leads with an empty value), no 'Other values' column (PRD P1-7). board-summary (group_by=qa_cv_picklist80) returns columns v76 count 1 and v80 count 1 but truncated=false.

**Evidence:** [cv-122938-874a-H14-notice.png](./screenshots/cv-122938-874a-H14-notice.png), [cv-122938-874a-H14-unaccounted.png](./screenshots/cv-122938-874a-H14-unaccounted.png), [cv-122938-874a-H14-vs-zoho.png](./screenshots/cv-122938-874a-H14-vs-zoho.png)

## 7. At 390 px the Leads list header breaks: empty tab column, view picker button covered by Filter (cannot be tapped), Create Lead cut off

- **Severity:** Medium
- **Case:** CVS-L06 — At 390 px wide the picker and editor are usable with no horizontal page scroll

**Steps to reproduce**
1. Open Leads, open the view picker, search and open a view.
2. Open New custom view, name it 'QA CV mobile', add one criterion and Save.
3. Try to scroll each screen sideways.
4. Check that no control is cut off or overlaps another.

**Expected:** The picker and editor are fully usable, nothing is cut off, and the page never scrolls horizontally.

**Actual:** Viewport 390x844. No horizontal page scroll (document scrollWidth 390). View editor usable: 'QA CV mobile' with Full Name starts with 'QA CV L' saved (201), nothing cut off. FAIL on the Leads list: the view tab list renders 0 px wide x 1372 px tall, leaving an empty screen with the toolbar pushed to y=814; 'More custom views' (x40,y816) is covered by 'Open filter sidebar' (x48,y814) which intercepts the tap - mouse/tap click times out, picker opens only via keyboard or a scripted event; 'Create Lead' button cut off at the right (main content 447 px wide).

**Evidence:** [cv-122938-874a-L06-list-390.png](./screenshots/cv-122938-874a-L06-list-390.png), [cv-122938-874a-L06-picker-390.png](./screenshots/cv-122938-874a-L06-picker-390.png), [cv-122938-874a-L06-editor-390.png](./screenshots/cv-122938-874a-L06-editor-390.png), [cv-122938-874a-L06-vs-zoho.png](./screenshots/cv-122938-874a-L06-vs-zoho.png)

## 8. List first page p95 6.8 s (Leads) / 3.9 s (Deals) vs 1.5 s target

- **Severity:** Medium
- **Case:** CVS-L08 — A list view's first page loads within 1.5 s at p95 on Leads and Deals

**Steps to reproduce**
1. Open All Leads and reload it 20 times.
2. For each load, record the time from navigation to the first page of rows shown.
3. Repeat steps 1–2 on All Deals.
4. Compute the p95 for each module and note the record counts.

**Expected:** The 95th-percentile first-page time is within 1.5 seconds on both Leads and Deals.

**Actual:** 20 full reloads each, navigation -> first row with content. All Leads (108 records): p95 6826 ms, median 3098, min 1812, max 8142. All Deals (50 records): p95 3885 ms, median 2671, min 1955, max 3917. TTFB ~80 ms; ~25 setup API calls precede the records query (fields 809 ms, layouts 466 ms, views?kind=kanban 721 ms); records query alone 107-1158 ms. Target 1.5 s p95 missed on both.

**Evidence:** [cv-122938-874a-L08-leads-loading-1200ms.png](./screenshots/cv-122938-874a-L08-leads-loading-1200ms.png), [cv-122938-874a-L08-leads-loaded.png](./screenshots/cv-122938-874a-L08-leads-loaded.png), [cv-122938-874a-L08-list-load-times.json](./screenshots/cv-122938-874a-L08-list-load-times.json), [cv-122938-874a-L08-vs-zoho.png](./screenshots/cv-122938-874a-L08-vs-zoho.png)

## 9. Kanban headers + first cards p95 10.2 s vs 2 s target; '0 records' shown while loading

- **Severity:** Medium
- **Case:** CVS-L09 — Kanban column headers and first cards render within 2 s at p95

**Steps to reproduce**
1. Open 'QA CV perf-board' and reload it 20 times.
2. For each load, record the time until every column header (count and sum) and the first cards are shown.
3. Compute the p95.

**Expected:** The 95th-percentile time to headers and first cards is within 2 seconds.

**Actual:** Leads Kanban 'QA CV perf-board' (Lead Status, 17 columns, 108 cards), 20 reloads, until all 17 headers and >=1 card shown: p95 10230 ms, median 4376, min 2967, max 12284. At 2 s the board is empty and the header reads '0 records'. Target 2 s p95 missed.

**Evidence:** [cv-122938-874a-L09-board-2000ms.png](./screenshots/cv-122938-874a-L09-board-2000ms.png), [cv-122938-874a-L09-board-loaded.png](./screenshots/cv-122938-874a-L09-board-loaded.png), [cv-122938-874a-L09-kanban-load-times.json](./screenshots/cv-122938-874a-L09-kanban-load-times.json), [cv-122938-874a-L09-vs-zoho.png](./screenshots/cv-122938-874a-L09-vs-zoho.png)

## 10. openListViewIds keeps IDs of deleted views; a view can be both open and recently closed

- **Severity:** Low
- **Case:** CVS-B03 — Views ticked to show as tabs stay as tabs after reload

**Steps to reproduce**
1. Open the view picker.
2. Tick 'QA CV tab1' and 'QA CV tab2' to show as tabs.
3. Untick one existing tab.
4. Reload the page.
5. Send GET /api/v1/modules/{m}/list-preferences and read openListViewIds.

**Expected:** After reload the tab bar matches the ticked set exactly, and openListViewIds holds the same view IDs. Cleanup: delete 'QA CV tab1' and 'QA CV tab2' and purge them from the Recycle Bin.

**Actual:** UI part works: ticking 'QA CV tab1' and 'QA CV tab2' and unticking 'Today's Leads' gave tabs [LeadsFromChats, test, All Leads, Recently Created Leads, Recently Modified Leads, My Leads, QA CV tab1, QA CV tab2] before and after reload. API part fails: openListViewIds holds those 8 IDs plus 2 more (70191f9b-…, fb5d9c6d-…) that return 404 NOT_FOUND - deleted views never removed from the preference (already present in the baseline). Also 'My Leads' (8f163184-…) is in both openListViewIds and recentlyClosedListViewIds, and the picker shows it under Recently closed while it is an open tab.

**Evidence:** [cv-122938-874a-B03-tabs-after-reload.png](./screenshots/cv-122938-874a-B03-tabs-after-reload.png), [cv-122938-874a-B03-list-preferences.json](./screenshots/cv-122938-874a-B03-list-preferences.json), [cv-122938-874a-B03-vs-zoho.png](./screenshots/cv-122938-874a-B03-vs-zoho.png)

## 11. Page size 200 accepted by the server but not offered in the editor; with 200 stored, the grid's Rows per page shows 10 and the editor shows 'Select…'

- **Severity:** Low
- **Case:** CVS-C12 — Sort and page size are applied and out-of-range page sizes are refused

**Steps to reproduce**
1. Create a view sorted by Created Time descending with page size 10; open it.
2. Edit it to page size 200; open it.
3. Edit it to "Each person's usual"; open it.
4. Send PATCH /api/v1/modules/{m}/views/{v} with page_size 9.
5. Send PATCH with page_size 201.

**Expected:** The grid is sorted by Created Time descending and shows 10, then 200 rows per page, then the viewer's usual page size. The PATCHes with 9 and 201 are rejected and the stored page size is unchanged. Cleanup: delete 'QA CV sort-page' and purge it from the Recycle Bin.

**Actual:** Works: view 'QA CV sort-page' sorted Created At descending (header 'Created At↓'), page size 10 -> 10 rows; 'Each person's usual page size' -> 100 rows (owner's pageSize 100); PATCH page_size 9 and 201 -> 422 INVALID_VIEW 'Page size must be a whole number b…', stored value unchanged. Fails: the editor offers only Usual/10/25/50/100 - page size 200 cannot be chosen, although the server accepts it (spec §2.2: 10-200). With 200 stored via API, the grid shows 1-102 of 102 rows while its 'Rows per page' control reads 10, and the editor shows 'Select…' for the stored value. Zoho has no per-view page size in its custom view form (TAVI extra); the defect is TAVI's editor, grid and server disagreeing.

**Evidence:** [cv-122938-874a-C12-editor-page-size-options.png](./screenshots/cv-122938-874a-C12-editor-page-size-options.png), [cv-122938-874a-C12-grid-page-size-200.png](./screenshots/cv-122938-874a-C12-grid-page-size-200.png), [cv-122938-874a-C12-editor-shows-select.png](./screenshots/cv-122938-874a-C12-editor-shows-select.png), [cv-122938-874a-C12-zoho-new-view-form.png](./screenshots/cv-122938-874a-C12-zoho-new-view-form.png), [cv-122938-874a-C12-zoho-records-per-page.png](./screenshots/cv-122938-874a-C12-zoho-records-per-page.png), [cv-122938-874a-C12-vs-zoho.png](./screenshots/cv-122938-874a-C12-vs-zoho.png)

## 12. A pick list value removed from the field is not shown in the view editor (blank 'Value' placeholder, no warning), although the view still filters on it

- **Severity:** Low
- **Case:** CVS-D14 — Picklist operators split records correctly and a value later removed from the picklist does not crash the view

**Steps to reproduce**
1. Open Leads → New custom view 'QA CV picklist' with Name starts_with 'QA CV' and Lead Status equals S1; Save; then edit to not_equal_to S1, contains_any_of S1,S2 and contains_none_of S1,S2; record each result.
2. In the Leads layout, add the pick list value 'QA CV Temp' to Lead Status and set L12 to it.
3. Edit the view to Lead Status equals 'QA CV Temp'; Save; confirm L12 is returned.
4. Remove 'QA CV Temp' from the Lead Status pick list.
5. Reopen the view and its editor; record the result and how the stale value is shown.
6. Cross-check: apply the same Lead Status condition in the Leads Filter panel, or call GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?filters=<same condition>, and compare the total with the grid's record count.
7. Cleanup: restore L12's status; delete 'QA CV picklist' and purge it from the Recycle Bin.

**Expected:** equals S1 → only S1 leads; not_equal_to S1 → the rest (empty status handled as the module filter does); contains_any_of → S1 and S2 leads; contains_none_of → the rest. After the value is removed the view opens with no crash or error, the stale value is shown in the editor, and the results are consistent with the module filter (record them).

**Actual:** S1 = No Answer (L01), S2 = Busy (L02), view 'QA CV picklist' (Full Name starts with 'QA CV L' + Lead Status) saved from the editor. equals S1 -> L01 (grid 1 record); not_equal_to S1 -> L02…L14 incl. empty-status L12-L14; contains_any_of S1,S2 -> L01,L02; contains_none_of -> the rest incl. empty status. Added 'QA CV Temp' to Lead Status (PUT field, row_version 3->4), set L12 to it, edited the view to equals 'QA CV Temp' -> L12. Removed the value (value-usage reported 1 record; PUT allowed, row_version 5). Reopened: grid works, no console error, returns L12 showing 'QA CV Temp'. FAIL: the editor does not show the stale value - the value box shows the placeholder 'Value' with no warning; saving keeps the stored value 'QA CV Temp' (no data loss). Zoho shows a view's saved pick list value in its criteria row. Cleanup: L12 status cleared; pick list back to its original 16 values.

**Evidence:** [cv-122938-874a-D14-editor-stale-value-missing.png](./screenshots/cv-122938-874a-D14-editor-stale-value-missing.png), [cv-122938-874a-D14-grid-after-value-removed.png](./screenshots/cv-122938-874a-D14-grid-after-value-removed.png), [cv-122938-874a-D14-editor-save-keeps-stored-value.png](./screenshots/cv-122938-874a-D14-editor-save-keeps-stored-value.png), [cv-122938-874a-D14-zoho-picklist-criteria.png](./screenshots/cv-122938-874a-D14-zoho-picklist-criteria.png), [cv-122938-874a-D14-vs-zoho.png](./screenshots/cv-122938-874a-D14-vs-zoho.png)

## 13. Module with no related modules: the editor still shows an empty related block and an enabled 'Add condition' (module list empty)

- **Severity:** Low
- **Case:** CVS-E07 — A module that no other module looks up shows "No module has a lookup to {{module}} yet."

**Steps to reproduce**
1. Call GET /api/v1/modules/{m}/related-modules for Tasks and Subscriptions; pick one that returns no modules.
2. Open that module → New custom view.
3. Open the related modules section.
4. Click Cancel.

**Expected:** The related modules section shows "No module has a lookup to {{module}} yet." with the module's name, and no related block can be added.

**Actual:** Tasks and Subscriptions both have related modules on NDC-Staging (Leads has lookups to every module), so module 'test' (no related modules) was used. New custom view -> Related modules criteria shows 'No module has a lookup to test yet.' (module name filled in). FAIL: an empty related block is still rendered, its 'Select a related module' list is empty, and 'Add condition' stays enabled and adds more empty blocks (2 after one click). Expected: no related block can be added. Cancel returned to the module.

**Evidence:** [cv-122938-874a-E07-no-lookup-module.png](./screenshots/cv-122938-874a-E07-no-lookup-module.png), [cv-122938-874a-E07-vs-zoho.png](./screenshots/cv-122938-874a-E07-vs-zoho.png)

## 14. List preferences accept more than 50 column overrides (51 stored); no oldest-dropped or 4xx rule

- **Severity:** Low
- **Case:** CVS-F04 — A 51st column override is handled by one recorded rule (oldest dropped or rejected)

**Steps to reproduce**
1. GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/list-preferences and save a copy.
2. Make sure 51 Leads list views exist; create 'QA CV ov-01'…'QA CV ov-NN' via POST /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views to make up the number.
3. Apply a column override to each of the 51 views in order (Manage Columns or PUT list-preferences).
4. GET list-preferences; count the overrides and note which view lost or never got one.
5. Cleanup: PUT the saved list-preferences back; delete every 'QA CV ov-' view and purge it from the Recycle Bin.

**Expected:** Behaviour is consistent and documented: either the oldest override (view 1) is dropped and 50 remain, or the 51st is rejected with 4xx. No 500, and the other 50 overrides are intact.

**Actual:** PUT list-preferences with column overrides for 51 Leads list views -> 200; GET shows all 51 stored (none dropped, no 4xx) - the 50-override limit (spec §2.2) is not enforced server-side. Expected either the oldest dropped (50 kept) or the 51st rejected. Side finding: the next time a view was opened, the app saved its cached older preferences and the stored overrides fell from 51 to 2 (same lost-update behaviour as B15). The UI route (51 x Manage Columns) could not be completed: only 37 views share the Standard layout and the 'Hide' buttons in the Manage columns dialog did not respond to automated clicks.

**Evidence:** [cv-122938-874a-F04-51-overrides.json](./screenshots/cv-122938-874a-F04-51-overrides.json)

## 15. Toolbar sort label shows API names ('Sort: amount desc') instead of field label and direction

- **Severity:** Low
- **Case:** CVS-F06 — The toolbar sort control gives the same result as header sort and shows "Sort: field dir"

**Steps to reproduce**
1. Open 'QA CV sort-deals'; sort Amount descending from the column header; record the order.
2. Reset the sort; choose Amount descending in the toolbar sort control.
3. Record the order and the toolbar label.
4. Cleanup: delete 'QA CV sort-deals' and purge it from the Recycle Bin.

**Expected:** Both methods give the identical order, and the toolbar label reads in the form "Sort: field dir" (Amount, descending).

**Actual:** View 'QA CV sort-deals' (Deals, Deal name starts with QA CV). Header Amount descending and toolbar Sort (Amount, Descending, Apply) give the identical order: D08, D07, D04, D03, D02, D01, D06, D05 (empty last). FAIL: the toolbar label reads 'Sort: amount desc' - internal field and direction keys, not the labels the sort dialog shows ('Amount', 'Descending'); other views show 'Sort: created_at desc', 'Sort: first_name asc'. After reload the label resets to 'Sort'. Observation: large amounts wrap onto two lines in the Amount column.

**Evidence:** [cv-122938-874a-F06-toolbar-sort-label.png](./screenshots/cv-122938-874a-F06-toolbar-sort-label.png), [cv-122938-874a-F06-sort-dialog-labels.png](./screenshots/cv-122938-874a-F06-sort-dialog-labels.png), [cv-122938-874a-F06-zoho-sort.png](./screenshots/cv-122938-874a-F06-zoho-sort.png), [cv-122938-874a-F06-vs-zoho.png](./screenshots/cv-122938-874a-F06-vs-zoho.png)

## 16. Kanban: a record holding a removed pick-list value is shown in a normal-looking column with no 'no longer an option' flag

- **Severity:** Low
- **Case:** CVS-I04 — A record holding a value removed from the pick list is flagged on the board

**Steps to reproduce**
1. Open 'QA CV kb-status'.
2. Find QA CV L05 on the board.
3. Read the column and message shown for it.
4. Open QA CV L05 and read Lead Status.
5. Cleanup: move the record back to its original value.

**Expected:** QA CV L05 is still shown on the board, marked with "This value is no longer an option of the field".

**Actual:** 'QA CV stale' added to Lead Status (PUT field 200), QA CV L05 set to it, value removed (pick list back to 16 values). Board 'QA CV kb-status': L05 still shown, in an extra column 'QA CV stale' (board-summary column 'QA CV stale' count 1). FAIL: no 'This value is no longer an option of the field' marker anywhere (text, title, aria). The stale column looks like a normal value column and offers 'Create Lead'. L05 set back to Interested afterwards.

**Evidence:** [cv-122938-874a-I04-board.png](./screenshots/cv-122938-874a-I04-board.png), [cv-122938-874a-I04-vs-zoho.png](./screenshots/cv-122938-874a-I04-vs-zoho.png)

## 17. Arabic UI: header layout picker accessible name and the 'records' count text are not translated

- **Severity:** Low
- **Case:** CVS-L03 — Probability, Layout and Pipeline labels are translated in Arabic

**Steps to reproduce**
1. Open 'QA CV ar-stage' on Deals.
2. Read the layout picker label and the pipeline picker label.
3. Read the "Probability {{value}}%" text in each stage header.
4. Switch to English and compare the same three labels.

**Expected:** "Probability", "Layout" and "Pipeline" appear in Arabic; none falls back to English.

**Actual:** Deals Kanban 'QA CV ar-stage' (Stage, Amount). English: both layout pickers named 'Layout'. Arabic (dir=rtl): board layout picker 'التخطيط' (translated), but the header layout picker keeps the accessible name 'Layout', and the count reads '٥٠ records' ('records' untranslated). The board has no pipeline picker, and stage headers show no 'Probability …%' text in either language, so Pipeline and Probability could not be checked. Switched back to English (ltr/en).

**Evidence:** [cv-122938-874a-L03-en.png](./screenshots/cv-122938-874a-L03-en.png), [cv-122938-874a-L03-ar.png](./screenshots/cv-122938-874a-L03-ar.png), [cv-122938-874a-L03-vs-zoho.png](./screenshots/cv-122938-874a-L03-vs-zoho.png)

## 18. Keyboard: focus lost to page body after 'Add criteria row' and pattern Save; view picker menu has no arrow-key navigation

- **Severity:** Low
- **Case:** CVS-L04 — The picker, view editor, pattern editor and Kanban card move work with the keyboard alone

**Steps to reproduce**
1. Without the mouse, open the Leads view picker and open a view with Enter.
2. Open New custom view, name it 'QA CV keyboard', add two criteria rows and Save.
3. Reopen Edit, open the pattern editor, change '1 and 2' to '1 or 2' and Save.
4. On 'QA CV kb-board', move 'QA CV D02' to the next stage with the keyboard.
5. Note any control that cannot be reached or has no visible focus.

**Expected:** Every step completes by keyboard; focus is always visible and never trapped; the card move follows the same rules as a drag.

**Actual:** Keyboard only: Leads 'More custom views' reached in 7 Tabs from the page heading, Enter focuses 'Search views', typing + Tab + Enter opened QA CV tab2. New custom view (reached via search + Tab), name typed, 'Filter by criteria' toggled with Space, row 1 Full Name / Starts with / 'QA CV L', 'Add criteria row', row 2 Phone / Is not empty, pattern '( 1 and 2 )', Save -> 201 'QA CV keyboard'. Edit: Tab to 'Edit Pattern', Enter, typed '1 or 2', pattern Save, then form Save -> 200 pattern '1 or 2'. Deals card QA CV D02: focusable (role=button, visible focus ring), Space/ArrowRight x3/Space -> negotiation (PATCH 200), back with ArrowLeft (200); to value_proposition refused with the pipeline message (same as drag). FAIL: focus drops to <body> after 'Add criteria row' and after the pattern box Save (no visible focus, Tab restarts at 'Skip to content'); picker items use menu roles but arrow keys don't move between them and each view costs 3 Tab stops (~150 to reach 'New custom view' unfiltered). Also: header 'Open profile' has no focus indicator.

**Evidence:** [cv-122938-874a-L04-pattern.png](./screenshots/cv-122938-874a-L04-pattern.png), [cv-122938-874a-L04-card-focus.png](./screenshots/cv-122938-874a-L04-card-focus.png), [cv-122938-874a-L04-vs-zoho.png](./screenshots/cv-122938-874a-L04-vs-zoho.png)

## 19. Kanban accessible names: card checkboxes reuse the column 'Select all loaded records in …' name, column buttons lack the column name, drag announcements read UUIDs

- **Severity:** Low
- **Case:** CVS-L05 — View and Kanban controls expose meaningful accessible names

**Steps to reproduce**
1. On Leads, inspect the view picker button and the overflow tab button.
2. On the Deals Kanban board, inspect the Kanban view chooser.
3. Inspect each column's collapse/expand and Load more buttons.
4. Record every accessible name.

**Expected:** The picker reads "Custom views", the overflow button "More custom views" and the chooser "Choose a Kanban view"; every column button has a non-empty name.

**Actual:** Names present as expected: Leads picker tab list 'Custom views' (dropdown button 'Custom views' in dropdown layout), overflow 'More custom views', Deals Kanban chooser 'Choose a Kanban view', 'Edit this Kanban view', 'Collapse all columns'; 0 unnamed buttons. No 'Load more' (no column over 100 cards). FAIL: (1) every card checkbox carries its column's select-all name ('Select all loaded records in negotiation' etc. - 55 on Deals, 116 on Leads); (2) the 12 column buttons are all 'Collapse column' with no column name; (3) drag announcements read the record UUID ('56faac8c-… is over Follow Up') instead of the record name (seen in I13).

**Evidence:** [cv-122938-874a-L05-deals-kanban.png](./screenshots/cv-122938-874a-L05-deals-kanban.png), [cv-122938-874a-L05-accessible-names.json](./screenshots/cv-122938-874a-L05-accessible-names.json), [cv-122938-874a-L05-vs-zoho.png](./screenshots/cv-122938-874a-L05-vs-zoho.png)

## 20. Firefox: React ErrorBoundary console error (lazy-loaded component) during the view/Kanban flow

- **Severity:** Low
- **Case:** CVS-L07 — Core picker, create-view and Kanban flows behave the same in Edge, Chrome and Firefox

**Steps to reproduce**
1. In Chrome, open the Leads view picker, search and switch views.
2. Create 'QA CV chrome' with one criterion and Save.
3. On 'QA CV browsers', drag 'QA CV L01' to another Lead Status column, then drag it back.
4. Sign out via profile → Logout.
5. Repeat steps 1–4 in Edge ('QA CV edge') and in Firefox ('QA CV firefox').

**Expected:** Each flow gives the same result in all three browsers, with no console errors or layout breaks; 'QA CV L01' ends with its original Lead Status.

**Actual:** Same flow per browser (fresh sign-in each): picker search 'QA CV tab1' + switch; create 'QA CV chrome/edge/firefox' (Full Name starts with 'QA CV L0') -> 201, 9 rows; Kanban 'QA CV browsers' drag QA CV L01 No Answer -> Busy -> No Answer (PATCH 200 x2). Chrome 131.0.6778.205 (installed) and Edge 154.0.4258.48 (installed): identical, no console errors. Firefox 153.0 (Playwright build; Firefox not installed): identical results but a React '[ErrorBoundary] … Lazy@unknown' console error was logged. L01 ends on No Answer. Step 4 (Sign out) skipped - a new sign-in revokes the account's previous session (the main session got 401 after these sign-ins), and the owner account is shared with another operator.

**Evidence:** [cv-l07firefox-122938-874a-L07-firefox-kanban.png](./screenshots/cv-l07firefox-122938-874a-L07-firefox-kanban.png), [cv-l07chrome-122938-874a-L07-chrome-kanban.png](./screenshots/cv-l07chrome-122938-874a-L07-chrome-kanban.png), [cv-l07firefox-122938-874a-L07-results.json](./screenshots/cv-l07firefox-122938-874a-L07-results.json), [cv-122938-874a-L07-vs-zoho.png](./screenshots/cv-122938-874a-L07-vs-zoho.png)

