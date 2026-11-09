# Wave 2 retest comments — drafts (26 Oct 2026)

Not posted. One section per ticket: the heading is for review only; post the HTML block under it. Each comment names the
image file to attach from `executions/execu_2026-10-25_crm-golive-wave2/evidence/annotated/`.

## NDC-1597 — PASS — Recycle Bin: the Module filter lists every module

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Settings › Recycle Bin › Filters › Module now lists every module with its item count, including system modules (Approval Process, Blueprint, Profile, Workflow Rule…) and items of deleted modules. The facet API returned 34 modules in the automated run.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecycleBinTest#filters.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1597-retest.png</p>

## NDC-1600 — PASS — Recycle Bin: Deleted by lists the users

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>The Deleted by filter lists the users with how many items each deleted (for example "Mahmoud Mohamed (8)"). The facet API returns the same list.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecycleBinTest#filters.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1600-retest.png</p>

## NDC-1601 — PASS — Recycle Bin: other options stay after choosing a module

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>After choosing Leads in the Module filter, every other module is still offered. The facet API returned 34 modules before and after the choice; on 25 Oct all other options stayed on the screen too.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecycleBinTest#filters.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1601-retest.png</p>

## NDC-1795 — PASS — Recycle Bin: the list refills after deleting forever

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>120 QA items were deleted forever, 50 at a time. After each "50 items permanently deleted" the list filled with the next items by itself, with no Load More. 50 + 50 + 20 left 0 QA items.</p><p>Environment: staging-crm.taviportal.com, owner account; manual run 25 Oct 2026 (case RB-05).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1795-retest.png</p>

## NDC-1603 — PASS — Restore refused when the unique name is taken

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>An account was deleted, a second account with the same name was created, and the first one was restored. The restore is refused with "Account name is already in use by another record." (recyclebin.error.name_conflict), and the first account stays deleted.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecycleBinTest#restoreWithTakenUniqueValue.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1603-retest.png</p>

## NDC-1602 — PASS — Empty Bin no longer times out

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Empty Bin, run once on 25 Oct with the QA lead's approval, finished in about 248 seconds with no 504. The bin went from 3,080 to 1,217 items; Desk items are outside the CRM screen by design. 16 items of deleted modules stayed (see NDC-1797). It was not repeated on 26 Oct because it empties the whole tenant's bin.</p><p>Environment: staging-crm.taviportal.com, owner account; case RB-06.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1602-retest.png</p>

## NDC-1797 — STILL FAILS — Bin items of deleted modules can't be removed

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>16 Recycle Bin items belong to modules that no longer exist (23c1a6s8d46a, test, partners, testmodule). As the Owner, both Delete forever and Restore answer recyclebin.error.forbidden, and Empty Bin leaves them. They can only expire after 60 days.</p><p>Environment: staging-crm.taviportal.com, owner account; automated test RecycleBinTest#orphanItemCanBeDeleted found the 16 items on 26 Oct; delete and restore were refused in the manual run on 25 Oct.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1797-retest.png</p>

## NDC-1484 — PASS — The 15 modules: create, read, edit, delete, restore

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>One QA record in each of the 15 modules went through the whole cycle: create 201, edit 200, delete 204, read 404, found in the bin, restore 200, read 200. All 15 modules pass every step.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecordLifecycleTest#lifecycle.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1484-retest.png</p>

## NDC-1832 — PASS — Editing a record keeps its owner

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>A QA record in each of the 15 modules was renamed and read back: the owner is the same before and after in all 15 (Calls use call_owner). Editing Company on the Leads edit form on 25 Oct also kept the owner.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecordLifecycleTest#lifecycle.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1832-retest.png</p>

## NDC-1193 — STILL FAILS — Blank record still accepted in Customers

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>A record with no fields at all (<code>POST /records</code> with <code>data: []</code>) is refused with 422 RECORD_VALIDATION_FAILED in 14 modules. Customers (module key contacts) still answers 201 and creates an empty record; the test deleted it again.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecordLifecycleTest#blankRecordRefused.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1193-retest.png</p>

## NDC-1197 — PASS — Leads list actions menu

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>The Leads actions menu has 16 entries. On 25 Oct each one either opened its page or dialog (Mass Delete, Manage Tags, Import Leads, Import History, Export Leads) or showed "Coming soon" (Drafts, Approve Leads, Deduplicate Leads, Create Client Script, Sheet View, Print View). Export no longer goes to Home. Entries that need selected records are greyed with "Select at least one record".</p><p>Environment: staging-crm.taviportal.com, owner account.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1197-retest.png</p>

## NDC-1216 — PASS — Mass delete by criteria

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Criteria Full Name starts with "QA W2 MD" previewed "Total Records: 120". After selecting all 120 and typing DELETE, the page said "120 Leads deleted": matched 120, deleted 120, failed 0. No other lead was deleted, and all 120 were in the Recycle Bin (purged afterwards).</p><p>Environment: staging-crm.taviportal.com, owner account; manual run 25 Oct 2026 (case MD-02).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1216-retest.png</p>

## NDC-1302 — PASS — Changing the stage keeps the pipeline

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Changing only a deal's stage to needs_analysis answers 200 and the pipeline stays "Standard" (5170500c…). On 25 Oct the stage bar did the same and Stage History showed "qualification → needs_analysis".</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#stageChangeKeepsPipeline.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1302-retest.png</p>

## NDC-1593 — PASS — Import respects read-only fields

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Test user 1 was put on a QA profile with Company read-only. The mapping screen shows "Company (read-only for your profile)" and it can't be picked. Sending a Company value through the import API is refused at validate ("This field is read-only / hidden for your profile, so you cannot import values into it") and no record is created. Test user 1 was moved back to User / Sales afterwards.</p><p>Environment: staging-crm.taviportal.com, owner and test user 1. Automation: ImportTest#importRespectsFieldPermissions.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1593-retest.png</p>

## NDC-1599 — PASS — Import respects hidden fields

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>Test user 1 was put on a QA profile with Email hidden. Email is not offered in the import mapping, and sending an Email value through the import API is refused at validate; no record is created and no email lands. Test user 1 was moved back to User / Sales afterwards.</p><p>Environment: staging-crm.taviportal.com, owner and test user 1. Automation: ImportTest#importRespectsFieldPermissions.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1599-retest.png</p>

## NDC-1554 — PASS — Import tag delimiter is helper text

<p><strong>Retest 26 Oct 2026 — passes</strong></p><p>On the import mapping step the tag delimiter is shown as static helper text ", ;" with no picklist. Tags in the file were imported into the records.</p><p>Environment: staging-crm.taviportal.com, owner account; manual run 25 Oct 2026 (case IM-03).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1554-retest.png</p>

## NDC-2122 — STILL FAILS — Upper-case "AND" still accepted

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>A Leads view with criteria pattern "1 AND 2" (upper case) is still accepted with 201. Other validation works: "1 and 3" (condition 3 doesn't exist) is refused with 422 INVALID_VIEW.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: CustomViewTest#upperCaseAndRefused.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2122-retest.png</p>

## NDC-2098 — STILL FAILS — Deleted view id in the URL opens the last-used view [2098 pending rerun]

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>After deleting a view, opening <code>/modules/{leads}?view=&lt;that id&gt;</code> opened the last-used view again ("QA W2 CV main renamed", 2 records) instead of the default All Leads view.</p><p>This is the manual result from 25 Oct. The automated screen test (RecordScreensUiTest#deletedViewIdInUrl) could not run on 26 Oct: first a browser timeout, then the test machine ran out of memory.</p><p>Environment: staging-crm.taviportal.com, owner account.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2098-retest.png</p>

## NDC-2280 — STILL FAILS — Long view name overlaps other columns

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>In Leads › Manage custom views a long name is not cut off. "Custom View Shared with Tenant Owner => Email Not Empty" runs into its pin icon, and on 25 Oct a 120-character name ran over Shared To, Created By and Last Modified By.</p><p>Environment: staging-crm.taviportal.com, owner account.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2280-retest.png</p>

## NDC-2136 — STILL FAILS — Leads list is slow

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>The automated screen test timed three loads of the Leads list (Standard layout, 171 records): first rows after 15.5, 11.8 and 16.2 seconds. The target is 1.5 seconds; the ticket said 9.1 seconds, and the manual run on 25 Oct saw 13.4–25.5 seconds.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: RecordScreensUiTest#leadsListSpeed.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2136-retest.png</p>

## NDC-2137 — STILL FAILS — Kanban is slow

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>Transactions kanban, three reloads: column headers after 2.4, 2.4 and 3.4 seconds, first cards after 3.0, 4.5 and 4.2 seconds. The target is 2 seconds (it was 5.1), so it is better but not there yet.</p><p>Also seen on 26 Oct, not part of this ticket: every kanban column says "This value is no longer an option of the field", columns show keys such as Closed_won, and cards show "Resolving owner…".</p><p>Environment: staging-crm.taviportal.com, owner account; timings from the manual run on 25 Oct (case KB-04).</p><p>Annotated TAVI-vs-Zoho image attached: NDC-2137-retest.png</p>

## NDC-1819 — STILL FAILS — Work Queue filter panel, column Pin / Hide, row Add Note

<p><strong>Retest 26 Oct 2026 — still fails (partly done)</strong></p><p>Done: date filter list, alphabet A–Z, table settings (Manage Columns, Reset Column Size, 10–200 per page, Wrap / Clip), Manage Columns search, row actions on the left, grouping by module.</p><p>Still missing compared with Zoho: the filter is an inline criteria row, not a panel with System Defined / Filter By Fields / Related Modules; the column menu has only Sort ascending / descending (no Pin or Hide); Manage Columns has no pin; there is no Add Note icon on the row.</p><p>Environment: staging-crm.taviportal.com, owner account; manual run 25 Oct 2026.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1819-retest.png</p>

## NDC-1324 — STILL FAILS — Inline Pipeline editor offers only "Standard (Standard)"

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>The inline Pipeline editor in the Transactions list is no longer empty, but it offers only "Standard (Standard)"; pipeline "1" of the same layout is missing. The cells show the raw id 5170500c-…. The Pipeline field's allowed values are ["Standard (Standard)"] only. Same root cause as NDC-2621.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#pipelineFieldOffersAllPipelines.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1324-retest.png</p>

## NDC-1316 — STILL FAILS — Mass Update of Pipeline fails

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>Pipeline is now offered in Mass Update, with "New pipeline" and "Stage in the new pipeline". Applying it fails: the screen request answered 422 "'640e03a4…' is not one of the allowed values (Standard (Standard))" on 25 Oct, and the API answered 422 "Invalid value for: Pipeline." on 26 Oct. The dialog stays open with no message. Same root cause as NDC-2621.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#moveDealByMassUpdate.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1316-retest.png</p>

## NDC-1312 — STILL FAILS — Change pipeline asks for the stage, but saving fails

<p><strong>Retest 26 Oct 2026 — still fails</strong></p><p>The "Change pipeline?" dialog now asks for the stage in the new pipeline and keeps the current stage when the new pipeline has it. Saving fails: Change pipeline sends a PATCH that answers 422 "Invalid value for: Pipeline", no message is shown, and the deal stays in "Standard". The API gives the same 422 (26 Oct). Same root cause as NDC-2621.</p><p>Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#moveDealByEdit.</p><p>Annotated TAVI-vs-Zoho image attached: NDC-1312-retest.png</p>
