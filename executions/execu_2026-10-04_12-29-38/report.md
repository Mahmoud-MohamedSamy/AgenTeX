# Test report — CRM Custom Views, Spec v3 (Low and Medium cases)

**Run summary (JSON):** [run-summary.json](./run-summary.json) · **Defects:** [bugs/bug-list.md](./bugs/bug-list.md)

| | |
|---|---|
| Target | TAVI CRM — https://crm.taviportal.com, tenant NDC-Staging |
| Reference | Zoho CRM (live, read-only) for side-by-side comparisons |
| Scope | 75 cases of priority Low or Medium in `docs/custom-views/Custom Views - Spec v3 Test Cases.xlsx`; cases marked Missing were skipped |
| Users | Owner (Tenant Owner); ALT1 (Admin profile) for C04 and cleanup |
| Browsers | Bundled Chromium (main run); Chrome 131, Edge 154 and Playwright Firefox 153 for L07 |
| Started | 2026-10-04T09:29:38Z |
| Ended | 2026-10-04T15:46:11Z |

## Result

**52 passed, 20 failed, 3 inconclusive** (of 75). No flaky results.

Failed by severity: 9 Medium, 11 Low.

## Defects

| # | Severity | Case | Defect | Comparison |
|---|---|---|---|---|
| 1 | Medium | CVS-B15 | List preferences changed in two browser tabs: the later write silently overwrites the earlier one (lost update) | [image](./bugs/screenshots/cv-122938-874a-B15-vs-zoho.png) |
| 2 | Medium | CVS-D24 | Arabic UI: the criteria pattern '(1 or 2) and (3 or 4)' is displayed as '( and (3 or 4) (or 2 1) )' - brackets and order reversed | [image](./bugs/screenshots/cv-122938-874a-D24-vs-zoho.png) |
| 3 | Medium | CVS-D25 | 'Last Activity' in view criteria is the record's modified time; adding a note does not update it (NDC-1868 P1-5 expects activity time) | [image](./bugs/screenshots/cv-122938-874a-D25-vs-zoho.png) |
| 4 | Medium | CVS-G04 | Dropdown picker: "Clone" and "Delete view" in a view menu do nothing (no request, no dialog); they work from the tab menu | [image](./bugs/screenshots/cv-122938-874a-G04-vs-zoho.png) |
| 5 | Medium | CVS-G06 | 16th pin accepted (204) and stored; picker silently shows only 15 - pin limit not enforced | [image](./bugs/screenshots/cv-122938-874a-G06-vs-zoho.png) |
| 6 | Medium | CVS-H14 | Kanban column cap: records whose value is past the 75th are hidden (no 'Other values' column) and board-summary says truncated=false | [image](./bugs/screenshots/cv-122938-874a-H14-vs-zoho.png) |
| 7 | Medium | CVS-L06 | At 390 px the Leads list header breaks: empty tab column, view picker button covered by Filter (cannot be tapped), Create Lead cut off | [image](./bugs/screenshots/cv-122938-874a-L06-vs-zoho.png) |
| 8 | Medium | CVS-L08 | List first page p95 6.8 s (Leads) / 3.9 s (Deals) vs 1.5 s target | [image](./bugs/screenshots/cv-122938-874a-L08-vs-zoho.png) |
| 9 | Medium | CVS-L09 | Kanban headers + first cards p95 10.2 s vs 2 s target; '0 records' shown while loading | [image](./bugs/screenshots/cv-122938-874a-L09-vs-zoho.png) |
| 10 | Low | CVS-B03 | openListViewIds keeps IDs of deleted views; a view can be both open and recently closed | [image](./bugs/screenshots/cv-122938-874a-B03-vs-zoho.png) |
| 11 | Low | CVS-C12 | Page size 200 accepted by the server but not offered in the editor; with 200 stored, the grid's Rows per page shows 10 and the editor shows 'Select…' | [image](./bugs/screenshots/cv-122938-874a-C12-vs-zoho.png) |
| 12 | Low | CVS-D14 | A pick list value removed from the field is not shown in the view editor (blank 'Value' placeholder, no warning), although the view still filters on it | [image](./bugs/screenshots/cv-122938-874a-D14-vs-zoho.png) |
| 13 | Low | CVS-E07 | Module with no related modules: the editor still shows an empty related block and an enabled 'Add condition' (module list empty) | [image](./bugs/screenshots/cv-122938-874a-E07-vs-zoho.png) |
| 14 | Low | CVS-F04 | List preferences accept more than 50 column overrides (51 stored); no oldest-dropped or 4xx rule | — |
| 15 | Low | CVS-F06 | Toolbar sort label shows API names ('Sort: amount desc') instead of field label and direction | [image](./bugs/screenshots/cv-122938-874a-F06-vs-zoho.png) |
| 16 | Low | CVS-I04 | Kanban: a record holding a removed pick-list value is shown in a normal-looking column with no 'no longer an option' flag | [image](./bugs/screenshots/cv-122938-874a-I04-vs-zoho.png) |
| 17 | Low | CVS-L03 | Arabic UI: header layout picker accessible name and the 'records' count text are not translated | [image](./bugs/screenshots/cv-122938-874a-L03-vs-zoho.png) |
| 18 | Low | CVS-L04 | Keyboard: focus lost to page body after 'Add criteria row' and pattern Save; view picker menu has no arrow-key navigation | [image](./bugs/screenshots/cv-122938-874a-L04-vs-zoho.png) |
| 19 | Low | CVS-L05 | Kanban accessible names: card checkboxes reuse the column 'Select all loaded records in …' name, column buttons lack the column name, drag announcements read UUIDs | [image](./bugs/screenshots/cv-122938-874a-L05-vs-zoho.png) |
| 20 | Low | CVS-L07 | Firefox: React ErrorBoundary console error (lazy-loaded component) during the view/Kanban flow | [image](./bugs/screenshots/cv-122938-874a-L07-vs-zoho.png) |

Full steps, expected and actual for each: [bugs/bug-list.md](./bugs/bug-list.md).

## Inconclusive

- **CVS-A13** — A workspace with custom views turned off shows a clear message. No workspace with custom views turned off exists, and none can be made: in CRM the customViewsEnabled flag comes from a build-time feature flag hard-coded to true (featureFlags-Bty4zi8j.js). Only the Desk workspace provider passes customViewsEnabled:false. The message key views.list.unavailable (title 'Custom views are not available', body 'Custom views are turned off for this workspace.') exists in crm-records.json and is rendered by the editor and Manage pages when the flag is false.
- **CVS-H04** — A module with no pick list, status or radio field cannot be used for a Kanban view. No module on NDC-Staging lacks a groupable field (Leads 63, Contacts 3, Deals 5, Accounts 5, Tasks 4, Calls 6, Meetings 4, Subscriptions 4, test 2). Created custom module 'QA CV No Picklist' (API, text fields only): it still gets a system 'Approval Status' pick list, which the Kanban form offers under Categorize by and allows saving with. So a module without a pick list/status/radio field cannot exist, and neither 'Add a pick list, status or radio-button field…' nor 'This module has no field a board can group by.' could be reached. Observation: Approval Status is offered as Categorize by on the new module but not on Leads. Module deleted afterwards (plain DELETE refused MODULE_HAS_DESCENDANTS; DELETE ?cascade=true used on the empty test module).
- **CVS-I10** — A drag made before the board finishes loading is refused with a message. Network throttled through the browser's DevTools protocol (2 s latency, 50 KB/s), board 'QA CV kb-status' reloaded. Cards first became visible after 46 s; QA CV L05 dragged to Follow Up at that moment: no PATCH, no toast, no 'The board is still loading — try again in a moment.' message; after removing throttling L05 is still Interested. A state where cards are draggable while the board is still loading could not be produced, so the refusal message could not be confirmed either way.

## All cases

### Group A — Access and permissions

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-A13 | A workspace with custom views turned off shows a clear message | Low | Inconclusive |

### Group B — Picker, tabs, standard views, persistence

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-B02 | Picker search filters across groups, ignores case and handles Arabic | Medium | Pass |
| CVS-B03 | Views ticked to show as tabs stay as tabs after reload | Medium | **Fail** (Low) |
| CVS-B04 | A pinned view cannot be unticked from the tabs | Medium | Pass |
| CVS-B05 | Closed views move to Recently closed, keeping at most 10 | Medium | Pass |
| CVS-B06 | Switching between dropdown and tabs layout works and persists | Medium | Pass |
| CVS-B12 | The last selected view is restored after signing out and in | Medium | Pass |
| CVS-B13 | Changing the view in Leads does not change Deals | Medium | Pass |
| CVS-B15 | Preferences changed in two browser tabs are saved consistently | Medium | **Fail** (Medium) |

### Group C — Create and edit a list view

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-C03 | A user cannot save two views with the same name in a module | Medium | Pass |
| CVS-C04 | Two users may each own a view with the same name | Medium | Pass |
| CVS-C05 | A list view and a queue with the same name follow one documented rule | Low | Pass |
| CVS-C06 | A criteria row with no value blocks save | Medium | Pass |
| CVS-C07 | Operators that take no value save without one | Medium | Pass |
| CVS-C08 | A view holds at most 25 criteria rows in the UI and the API | Medium | Pass |
| CVS-C10 | A view with no columns uses each person's usual columns | Medium | Pass |
| CVS-C11 | More than 10 columns shows a tip, 30 are allowed and 31 are refused | Medium | Pass |
| CVS-C12 | Sort and page size are applied and out-of-range page sizes are refused | Medium | **Fail** (Low) |
| CVS-C14 | Sharing with selected users requires at least one user | Medium | Pass |
| CVS-C16 | A new view starts with the filters applied on the list | Medium | Pass |
| CVS-C17 | Cancelling the editor creates nothing | Medium | Pass |
| CVS-C19 | Saving twice in quick succession creates one view only | Medium | Pass |
| CVS-C23 | Saving after the token expires never loses work silently | Medium | Pass |

### Group D — Criteria operators and pattern

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-D10 | last_n_days, next_n_days, age_in_days and due_in_days accept 0/1–3650 and reject other values | Medium | Pass |
| CVS-D11 | last_n_hours and next_n_hours accept 1 and 720 and reject 721 | Medium | Pass |
| CVS-D12 | before_now and after_now split records exactly at the current time | Medium | Pass |
| CVS-D13 | is_false treats a never-set checkbox by one recorded rule, identical to the module filter | Medium | Pass |
| CVS-D14 | Picklist operators split records correctly and a value later removed from the picklist does not crash the view | Medium | **Fail** (Low) |
| CVS-D18 | A Tags criterion returns only the records carrying that tag | Medium | Pass |
| CVS-D23 | A saved pattern (1 or 2) and 3 reopens with the same meaning and returns the same records | Medium | Pass |
| CVS-D24 | In the Arabic UI the pattern's row numbers, brackets and and/or read correctly | Medium | **Fail** (Medium) |
| CVS-D25 | Last Activity Time can be used as a criteria field and follows record activity | Medium | **Fail** (Medium) |

### Group E — Related modules, lookup paths, hidden fields

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-E04 | Choosing a specific link field narrows related criteria to deals linked through that field only | Medium | Pass |
| CVS-E05 | A view can use at most 3 related modules in the editor and the API | Medium | Pass |
| CVS-E06 | A related module block accepts at most 3 criteria rows | Medium | Pass |
| CVS-E07 | A module that no other module looks up shows "No module has a lookup to {{module}} yet." | Low | **Fail** (Low) |
| CVS-E08 | At most 5 criteria rows can use fields of lookup modules | Medium | Pass |

### Group F — Columns, sort, page size, selection in the grid

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-F04 | A 51st column override is handled by one recorded rule (oldest dropped or rejected) | Low | **Fail** (Low) |
| CVS-F06 | The toolbar sort control gives the same result as header sort and shows "Sort: field dir" | Medium | **Fail** (Low) |
| CVS-F09 | The header checkbox selects the visible page only and the bar shows the count | Medium | Pass |
| CVS-F10 | Switching view clears the row selection | Medium | Pass |
| CVS-F13 | Export Leads while a QA CV view is active follows a recorded rule for the view's criteria and columns | Medium | Pass |
| CVS-F15 | A view whose criteria match nothing shows an empty state, not an error | Medium | Pass |

### Group G — Clone, pin, delete, Work Queue dependency

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-G04 | Cloning the same view twice never fails with a server error on the duplicate name | Medium | **Fail** (Medium) |
| CVS-G06 | A 16th pin is refused because the limit is 15 pinned views | Medium | **Fail** (Medium) |
| CVS-G08 | A deleted QA CV view restored from the Recycle Bin comes back with the same id and settings | Medium | Pass |
| CVS-G11 | When the last-used view is deleted, the module falls back to the default view without an error | Medium | Pass |

### Group H — Kanban view settings

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-H01 | A module with no Kanban views shows the empty state and a way to create one | Medium | Pass |
| CVS-H03 | Only single-value pick list, status and radio fields can be used to categorize a board | Medium | Pass |
| CVS-H04 | A module with no pick list, status or radio field cannot be used for a Kanban view | Medium | Inconclusive |
| CVS-H07 | A Kanban card holds at most 10 fields, can be reordered, and always starts with the record name | Medium | Pass |
| CVS-H08 | The board header renders in a single colour or in varied colours as chosen | Low | Pass |
| CVS-H11 | Changing the categorize-by field rebuilds the board on the new field | Medium | Pass |
| CVS-H13 | The Manage Kanban views page lists every Kanban view the user can see and offers Create Kanban View | Medium | Pass |
| CVS-H14 | A board on a pick list with more than 75 values shows the column cap notice | Medium | **Fail** (Medium) |

### Group I — Kanban board and drag-and-drop

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-I04 | A record holding a value removed from the pick list is flagged on the board | Medium | **Fail** (Low) |
| CVS-I10 | A drag made before the board finishes loading is refused with a message | Medium | Inconclusive |
| CVS-I12 | Dropping a card back on its own column sends no update | Low | Pass |
| CVS-I13 | A card can be moved with the keyboard under the same rules as dragging | Medium | Pass |
| CVS-I14 | Columns collapse and expand singly and all at once, and accept drops while collapsed | Medium | Pass |
| CVS-I15 | Creating a record from a column footer pre-sets the column value, layout and pipeline | Medium | Pass |
| CVS-I16 | Select all loaded selects exactly the cards loaded in that column | Medium | Pass |
| CVS-I18 | A change made elsewhere shows in the board headers within 30 seconds without a reload | Medium | Pass |

### Group J — Split view, Sheet and Print entry points

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-J01 | A module with no split views shows the empty state and a way to create one | Medium | Pass |
| CVS-J03 | A split view refuses too many conditions and values with a message | Medium | Pass |
| CVS-J04 | The records-per-section setting is applied, and a record created in a section gets that section's value | Medium | Pass |

### Group L — i18n/RTL, accessibility, performance, compatibility

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-L03 | Probability, Layout and Pipeline labels are translated in Arabic | Medium | **Fail** (Low) |
| CVS-L04 | The picker, view editor, pattern editor and Kanban card move work with the keyboard alone | Medium | **Fail** (Low) |
| CVS-L05 | View and Kanban controls expose meaningful accessible names | Medium | **Fail** (Low) |
| CVS-L06 | At 390 px wide the picker and editor are usable with no horizontal page scroll | Medium | **Fail** (Medium) |
| CVS-L07 | Core picker, create-view and Kanban flows behave the same in Edge, Chrome and Firefox | Medium | **Fail** (Low) |
| CVS-L08 | A list view's first page loads within 1.5 s at p95 on Leads and Deals | Low | **Fail** (Medium) |
| CVS-L09 | Kanban column headers and first cards render within 2 s at p95 | Low | **Fail** (Medium) |
| CVS-L10 | With 15 pinned and 50 other views, the picker opens in under 500 ms and search stays responsive | Low | Pass |

### Group E2E — End-to-end journeys

| Case | Title | Priority | Result |
|---|---|---|---|
| CVS-E2E-6 | An Arabic user can create an Arabic-named view with Arabic criteria and use a Kanban board in RTL | Medium | Pass |

## Observations (not counted as defects)

- **Raw stage keys on Deals boards** (I15): column titles show `needs_analysis`, `closed_won` and so on, not the stage labels. Stages outside the selected pipeline (`value_proposition`, `identify_decision_makers`, `test-01/02`) are shown as columns, but dropping a card there is refused with "Stage '…' is not part of the 'Standard' pipeline" (seen in L04).
- **List-view criteria apply to the Kanban board** (E2E-6, L07): with a criteria list view tab active, the Kanban board shows only that view's records ("1 record" with 'QA CV عملاء' active).
- **Split view with no columns** (J04): a split view saved with an empty column list shows only #, Tags and Source, with no name column.
- **"0 records" while loading** (L09, also seen in B06): the header shows "0 records" until the data arrives.
- **Pinned-view hint is a tooltip only** (B04): the "pinned" message is only a `title` tooltip on the checkbox.
- **Header "Open profile" button** has no visible focus indicator (found in L04; outside this feature).
- **Arabic plural count** stays English: "١٠٨ records" (L03, E2E-6).
- **Phone format on create** (J04): the Leads phone field rejects `+20…` ("This value does not match the required format") and accepts `010…`.

## Deviations from the written steps

- **Setup through the API:** some views were created through the API, then checked in the UI. This applies to the Arabic-named views in E2E-6 (the list view reused this run's own 'QA CV عملاء' from group B, with the Arabic criterion added), the Kanban boards for I15, L03, L07 and L09, the split view for J04, and the 50 'QA CV perf-NN' views for L10. Case-specific UI steps (picker, editor, board, drag, keyboard) were driven in the browser.
- **J03:** the 10-value limit in the split-view value chooser was confirmed from the on-screen text and the API (422 "A split view may have at most 10 splits"). Automation could not drive the chooser itself.
- **L06:** the view picker could only be opened by keyboard or a scripted event, because the Filter button sits on top of it at 390 px. That is the defect.
- **L07:** each browser signed in fresh. Step 4 (Sign out) was skipped: a new sign-in revokes the account's previous session (the main session got 401 after the L07 sign-ins), and the owner account is shared with another operator in this tenant. Firefox is not installed on this machine, so Playwright's Firefox 153 build was used.
- **L08–L10:** timings come from headless Chromium on this machine and network: navigation to first rows (L08), headers plus first card (L09), and in-page press to stable list (L10). The case asks for 20 reloads (L08, L09) and 10 opens (L10); that is what ran.
- **I10:** the board loading state could not be held long enough to drag during it, even with network throttling (cards appeared after 46 s, when loading had finished), so the case is Inconclusive.

## Environment notes

- Another operator works in this tenant with the same owner account. Their QA CV views ("QA CV amount-api 1–8", "amount-bounds", "wrong-type", "d19-control", "gone", created 15:04–15:31 UTC) were not touched.
- The owner's session was revoked several times during the run (sign-ins elsewhere). Each time it was re-established by signing in again.
- Zoho CRM was used read-only: nothing was created or changed there.

## Timing

Per-case start and end times come from evidence file times (converted from local UTC+3 to UTC), from server `created_at` of views made by the case, or from timestamps recorded at the time. Times that were estimated during the run did not match the evidence, so they were removed: 32 cases have no recorded time. `run.durationMs` is the wall-clock span, because user-wait time was not tracked.

## Test data and cleanup

All data created by this run was prefixed `QA CV` and recorded in `baseline/created-objects.txt` and `baseline/seed-records.txt`. Cleanup:

| Item | Result |
|---|---|
| 130 views of this run (list, Kanban, split; owner) + 3 clones | Deleted (204) |
| 3 views owned by ALT1 (incl. 1 queue view) | Deleted as ALT1 (204) |
| 39 records (Leads, Deals, Contacts) | Deleted (204), each after a name check |
| Tag 'QA CV VIP' | Deleted (204) |
| Field 'QA CV Picklist80' (`qa_cv_picklist80`) | Deleted (204) |
| Module 'QA CV No Picklist' (H04) | Deleted during H04 (cascade) |
| Lead Status allowed values | Same as before the run (16 values) |
| Recycle Bin | 172 entries of this run purged; 0 left. 2 QA CV entries of the other operator left in place |
| LeadsFromChats pin | Restored |
| Leads and Deals list preferences | Restored to the baseline (identical) |
| UI language | English (dir=ltr, lang=en) |
| Final diff against the baseline | No differences in the 50 baseline views or the preferences (`logs/cleanup-final-diff.txt`) |

Browser sessions opened by this run were closed. A session not created by this run (`run-174737-d749`) was left open.
