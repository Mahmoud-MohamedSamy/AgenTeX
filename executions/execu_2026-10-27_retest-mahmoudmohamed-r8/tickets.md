# Round 8 tickets (27 Oct 2026)


---
## NDC-2650 · low · Modules & Fields
**Layouts | Layout access saved through the API is silently ignored (assignments endpoint 500 / 405)**

Summary
Changing who may use a layout through the API answers 200 but changes nothing, and the layout assignments endpoint fails (POST 500, GET 405). Setting layout access on the screen works, so this affects the API that integrations and scripts use.
Steps to Reproduce

- On a test module, create a layout.

- Send PUT /api/v1/modules/{id}/layouts/{layout} with a new accessMode (e.g. selected profiles) and read the layout back.

- Send POST /api/v1/modules/{id}/layouts/assignments, then GET on the same path.

Expected Result

- The PUT stores the new access mode, or is refused with a clear reason.

- The assignments endpoint accepts assignments and lists them.

Actual Result

- The PUT answers 200, but reading the layout back shows the old access mode.

- POST …/layouts/assignments answers 500; GET answers 405.

- The same change made on the screen is stored.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 5 (case C02), on "QA W5 Module" (deleted after the test). Reproduced a second time from scratch.

- Automation: automation/…/crmsetup/SetupApiTest

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2649 · low · Modules & Fields
**Map Dependency | An empty dependency map is saved, and dependencies aren't checked when a record is saved**

Summary
Pick-list dependencies are not enforced. An empty dependency map is accepted and stored with all-zero field ids. A real map (parent value Red allows only child values A and B) is stored, but a record with Red and C still saves.
Steps to Reproduce

- On a test module, create a dependency map with an empty body {}.

- Create a real map: parent pick list "Colour" value Red allows child values A and B only.

- Create a record with Colour = Red and child = C.

Expected Result

- The empty map is refused because the parent and child fields are missing.

- The record with Red and C is refused, or the screen only offers A and B, as Zoho does.

Actual Result

- The empty map answers 201 and is stored with all-zero field ids.

- The record with Red and C saves.

- The Map Dependency tab on the module page still says "In Development".

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 5 (case C05), on "QA W5 Module" (deleted after the test). Reproduced a second time from scratch.

- Automation: automation/…/crmsetup/SetupApiTest

- Evidence: annotated TAVI-vs-Zoho image attached. Zoho's API behaviour for the record save was not checked live.

### Comments (0)


---
## NDC-2648 · low · Teamspace
**Teamspaces | A folder name used twice answers 500 instead of a clear "name taken" message**

Summary
Creating a second folder with the same name in a teamspace fails with a server error (500) instead of a clear message that the name is already used. A duplicate teamspace name is handled correctly (409), so only folders are affected.
Steps to Reproduce

- Create a teamspace, then a folder "QA folder" in it.

- Create another folder named "QA folder" in the same teamspace.

Expected Result

- The second folder is refused with a clear message (409, name already in use), as for duplicate teamspace names.

Actual Result

- The request answers 500, in 3 of 3 attempts.

- A duplicate teamspace name answers 409, as expected.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 5 (case C12). QA teamspaces and folders deleted after the test.

- Automation: automation/…/crmsetup/SetupApiTest

- Evidence: annotated TAVI-vs-Zoho image attached. Zoho's duplicate folder message was not checked live (it would need saving in Zoho).

### Comments (0)


---
## NDC-2647 · medium · Reports
**Reports | Rollup summary fields are always empty in reports**

Summary
A rollup summary field shows its value on the record, but a report that includes the field always shows it empty. Other columns, and new rows, reach the report within seconds.
Steps to Reproduce

- On a test module, add a rollup summary field (SUM over a related child module). Add child records so the rollup is 12; open the parent record and see 12.

- Reports › New report: pick the module's dataset, add the child module, add the rollup column, Run, then Save.

- Run the report again after a few minutes.

Expected Result

- The report shows 12 for that record, the same as the record page. Zoho reports show rollup values.

Actual Result

- The rollup column is empty for the record, in 3 runs over about 40 minutes.

- The record page shows 12. Other columns and new rows appear in the report within seconds.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 5 (case S02), on the test module "QA W5 Module" (report and module deleted after the test).

- Related: NDC-1444 (rollup, In Progress).

- Evidence: annotated TAVI-vs-Zoho image attached. Zoho's rollup value inside a report was not checked live (it would need saving data in Zoho).

### Comments (0)


---
## NDC-2646 · medium · Modules & Fields
**Validation Rules | Rules are saved but never applied, and any text is accepted as a condition**

Summary
Validation rules don't validate. A rule can be created and switched on, but records that break it are still saved, both when created and when edited. The rule's condition is not checked either: any text, even nonsense, is accepted and saved as a condition.
Steps to Reproduce

- On a test module, create a validation rule on a number field: value must not be greater than 10. Make it active.

- Create a record with that field set to 50.

- Edit an existing record and set the field to 999.

- Create another rule whose condition is random text.

Expected Result

- Saving a record that breaks an active rule is refused with the rule's message, on create and on edit, as in Zoho.

- A rule whose condition can't be understood is refused when it is saved.

Actual Result

- 7 active rules on the test module; none was applied. The record with 50 saved, and the edit to 999 saved.

- A rule with random text as its condition saves without error.

- The Validation Rules tab on the module page still says "In Development"; the rules were made through the API it uses.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 5 (case C04), on the test module "QA W5 Module" (deleted after the test). Reproduced a second time from scratch.

- Related: NDC-2536 (a pick-list validation rule that is never applied).

- Automation: automation/…/crmsetup/SetupApiTest

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2645 · medium · Import & Export
**Export | "All fields" exports every field defined on the module, including other layouts' fields and fields not used on any layout**

Summary
Exporting records from a module's list view with All fields selected produces a file containing every field ever created on the module, including fields that belong only to other layouts and fields not placed on any layout. For Leads, 25 records exported to roughly 400 columns, most of them empty test fields that users never see on their layout.
Steps to reproduce

- Go to CRM › Sales › Leads (Standard layout).

- Select some records and choose Export Leads.

- Choose Current page only, Excel Workbook (.xlsx), All fields. The help text reads "Every field on this module, plus Record ID, Tags and the audit columns."

- Click Export and open the downloaded file.

- Scroll right through the column headers.
Expected result

- All fields exports the fields of the layout the user is working in (Standard here), plus Record ID, Tags and audit columns.

- Fields only in other layouts and fields not on any layout are left out.

- The help text describes exactly which fields are exported.
Actual result

- About 400 columns, running out to about column ON.

- Includes other layouts' and unused fields, e.g. "Auto Number 4", "Checkbox 4", "Currency 8", "Date 3", "Email 3", "File Upload 3"; nearly all empty.

- The help text "Every field on this module" matches this behaviour, so it needs changing too.
Environment

- staging-crm.taviportal.com › Leads › Export Leads

- Edge 156.0.8078.48; Windows 10; 1413×962

- Reporter valafo4080; captured 26 Oct 2026, 2:43 PM (Cairo)
Attachment
Attachment

### Comments (0)


---
## NDC-2634 · high · Customers
**Portals | The customer portal link opens an nginx 404 page**

Summary
A customer portal can be created and switched on, but its public link doesn't work. It opens an nginx 404 page whether the portal is on or off, so customers can't reach it.
Steps to Reproduce

- Settings › Portals › New portal (Leads, Standard layout). Save and switch it on.

- Open the portal link in a browser that is not signed in.

- Switch the portal off and open the link again.

Expected Result

- With the portal on, the link opens its sign-in page. With it off, a clear "portal not available" page.

Actual Result

- The link opens an nginx 404 page in both cases.

- Creating the portal and switching it on and off works (PATCH 200).

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 4 (case M07). The QA portal was deleted after the test.

- Automation: automation/…/crmchannels/ChannelsApiTest

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2633 · low · Notifications
**Notifications | My Notifications shows raw event keys instead of names**

Summary
The My Notifications preferences page lists many notification types by their internal key instead of a readable name, so users can't tell what they are switching on or off.
Steps to Reproduce

- Open Settings › My Notifications (while the notification service answers).

- Read the list of notification types.

Expected Result

- Every type has a plain name, such as "Email received" or "Activity reminder", in English and in Arabic.

Actual Result

- Types are shown as mail.email_received, salesiq.*, crm.activity.reminder.* and crm.mass_delete.*.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 4 (case M09), before the notification outage filed separately.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2632 · high · Notifications
**Notifications | Every notification call answers 500, so the bell and My Notifications are empty**

Summary
Notifications are down for every user. The notification list, the unread count and the notification preferences all answer 500. The bell shows nothing, My Notifications is blank, and activity reminders can't reach anyone. Other APIs answer normally.
Steps to Reproduce

- Sign in as any user (seen with the Owner and test user 1).

- Open the bell, then Settings › My Notifications.

- Or call GET /api/v1/notifications?limit=5, /notifications/unread-count and /notifications/preferences/me.

Expected Result

- The bell lists notifications with an unread count, and the preferences page loads.

Actual Result

- All three calls answer 500 for both users. First seen at about 09:50 UTC on 26 Oct; still 500 at 10:49 and again at 11:26 UTC.

- The bell is empty and My Notifications is blank. Two QA task reminders (5 minutes before) never arrived.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Accounts: ndc-staging-owner (Owner) and test user 1 (nameb56175, User profile)

- Observed: 26 Oct 2026, CRM go-live Wave 4 (case M09).

- Automation: automation/…/crmchannels/ChannelsApiTest#notificationsAnswer

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2631 · low · Templates & Workflow
**Email Templates | A placeholder the template can't fill is saved and comes out blank**

Summary
An email template accepts any placeholder, including ones the app can't fill. {{company_name}} is saved without a warning, and when the template is used in compose it comes out empty, so the customer gets a sentence like "…at ." Only 5 placeholders are supported.
Steps to Reproduce

- Settings › Email Templates › New template. In the body type Thanks for visiting us at {{company_name}}. and save.

- Open a QA lead, click Send Email and pick the template.

Expected Result

- Saving warns that {{company_name}} is not a known field, or the merge-field picker offers only fields that can be filled. Zoho's template editor inserts merge fields from a list of the module's fields.

Actual Result

- The template saves (201) with no warning.

- In compose the text reads "Thanks for visiting us at ." and the sender is not warned.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 4 (case C14). The QA template was deleted after the test.

- Automation: automation/…/crmchannels/ChannelsApiTest

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2630 · high · Email Channel
**Email | A failed email send is shown as sent**

Summary
When an email sent from a record fails, the app tells the user it was sent. The screen shows "Sent" and the timeline logs "EmailSent", but the email never left: its status in the API is "failed". The record's Mails tab shows "No emails yet" and no notification follows, so the user has no way to know.
Steps to Reproduce

- Open a QA lead that has an email address.

- Click Send Email, pick the taviportal.com Zoho Mail connection, write a subject and body, and send.

- Look at the toast, the Timeline tab and the Mails tab.

- Read the email's status through the API.

Expected Result

- When sending fails, the screen says it failed and why, the timeline does not log a sent email, and the email shows as failed on the record so the user can retry. Zoho shows failed emails with a reason on the record.

Actual Result

- Toast "Sent"; the timeline logs "EmailSent".

- Mails tab: "No emails yet". No notification.

- API status "failed": "No Zoho account found for sender 'ndc-staging-owner@taviportal.com' … set the 'zoid' org id on the connection".

- The connection itself still reports health "ok" and can_send = true.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 4 (case M02). The test email to mahmoud.mmohamedsamy@gmail.com was not received.

- Related: NDC-2496, NDC-1479 (the connection's missing Zoho org id is the reason this send failed).

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2629 · low · Activity Reminders
**Activity Reminders | The Reminder card fields, Additional users and Additional profiles lists show every item at full length instead of in fixed-height scrollable boxes**

Summary
On the Activity Reminders settings page, three lists show all their items at once: Reminder card fields (every activity field), Additional users and Additional profiles. None of them has a fixed height or its own scroll bar, so the page becomes very long, and reaching Additional users or Additional profiles means scrolling past the whole field list.
Steps to Reproduce

- Go to Settings › Activity Reminders.

- Scroll to Reminder card fields — every activity field is listed one after another, with no scroll bar inside the section.

- Keep scrolling — it takes several screens to get past the field list, from "Related To" to "Zip Code".

- Look at Additional users and Additional profiles — both also list every user and every profile at full length.
Expected Result

- Each of the three lists sits in a box of fixed height, with its own scroll bar when there are more items than fit.

- The page stays a manageable length, and Additional users and Additional profiles can be reached without scrolling past every field.

- Clicking an item in a list always selects the item shown at that spot (as required by NDC-1333).
Actual Result

- All three lists show every item at full length, with no scroll bar of their own.

- The field list alone takes several screens, and Additional profiles stretches to the end of the page.

- The page is much longer than it needs to be, and moving between the sections takes a lot of scrolling.
Environment

- App: TAVI CRM (staging) — staging-crm.taviportal.com › Settings › Activity Reminders

- Browser: Microsoft Edge 156.0.8078.48

- OS: Windows 10

- Viewport: 1413 × 962

- Reporter: valafo4080

- Captured: 26 Oct 2026, 2:02 PM (Cairo)
Related
NDC-1333 — Activity Reminders | The settings page has two scroll bars, causing unpredictable scrolling (Done)
Attachment
Attachment

### Comments (0)


---
## NDC-2627 · low · Notes & Timeline
**Timeline | The created entry reads "leads created" instead of "Lead created"**

Summary
On a record's Timeline tab, the first entry uses the module's internal key instead of the record type's name: a new lead shows "leads created". It should read "Lead created", and in renamed modules it should use their display names (Customer, Transaction, Agency Code).
Steps to Reproduce

- Create a lead.

- Open the lead and the Timeline tab.

Expected Result

- The entry reads "Lead created" (singular display name), as Zoho's timeline does.

Actual Result

- The entry reads "leads created".

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 25 Oct 2026 (CRM go-live Wave 2, case TL-01), confirmed by the automated screen test on 26 Oct.

- Automation: automation/…/crmrecords/RecordScreensUiTest#timelineWording

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2626 · low · Pipelines
**Transactions | Pipeline is shown as a raw id and stages as raw keys**

Summary
Transactions show the pipeline as its database id instead of its name, and stages as their keys instead of their labels. Users see 5170500c-b335-479c-96d1-ed138965c345 where they should see "Standard", and "needs_analysis" or "closed_won" where they should see "Needs Analysis" or "Closed Won".
Steps to Reproduce

- Open Transactions, list view, with the Pipeline column visible.

- Open any deal and look at Additional Information › Pipeline, the stage bar and the Stage field.

- Click the Pipeline cell in the list to edit it inline.

Expected Result

- The pipeline's name ("Standard") everywhere, and stage labels ("Needs Analysis", "Closed Won"), as in Zoho.

Actual Result

- List column, record page and inline editor show the pipeline id 5170500c-….

- The stage bar and the Stage field show raw keys such as needs_analysis and closed_won.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 25 Oct 2026, CRM go-live Wave 2 (cases PL display, PL-07).

- Related: the pipeline move bug filed today (same field), NDC-1324.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2625 · low · Tags
**Tags | The record tag API lets a record hold more than 10 tags**

Summary
A record may carry at most 10 tags (Zoho's limit, and the screen's text file has a "limit reached" message), but the API accepts more. Sending 11 tag ids to a lead answers 200 and the lead then holds 11 tags.
Steps to Reproduce

- Create 11 tags on Leads.

- Send POST /api/v1/modules/{leads}/records/{id}/tags with 10 of the tag ids, then again with all 11.

- Read the lead back.

Expected Result

- The 11th tag is refused with a clear message that a record can hold 10 tags.

Actual Result

- The 10-tag call answers 200 (record holds 10).

- The 11-tag call also answers 200, and the record now holds 11 tags.

- Not checked on the screen yet (the tag picker may stop at 10); this report is about the API, which imports and integrations use.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 25 Oct 2026 (CRM go-live Wave 2, case TG-02), confirmed by the automated rerun on 26 Oct.

- Automation: automation/…/crmrecords/TagsTest#tenTagLimit

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2624 · medium · Notes & Timeline
**Timeline | Deleting a record and adding or removing attachments are not logged on the timeline**

Summary
A record's timeline misses two kinds of events. When a lead is deleted and restored, the timeline shows "restored" but never "deleted". When attachments are added or removed, nothing appears at all. Created, field changed, note added and restored are logged correctly. The screen's own text file already has wording for "deleted" and "attachment added / removed", so the entries are expected.
Steps to Reproduce

- Create a QA lead. Change its Company. Add a note.

- Add two attachments, then remove one.

- Delete the lead, then restore it from the Recycle Bin.

- Open the lead's Timeline tab (or GET /api/v1/timeline/records/leads/{id}/feed).

Expected Result

- The timeline lists every step: created, field changed, note added, attachment added (×2), attachment removed, deleted, restored. Zoho's timeline shows attachment and delete/restore events.

Actual Result

- Only four kinds of entry: RecordCreated, FieldChanged (company), NoteAdded, RecordRestored.

- No deleted entry, no attachment added and no attachment removed entry, on the screen or in the API.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 25 Oct 2026 (CRM go-live Wave 2, case TL-01). The missing deleted entry was confirmed by the automated rerun on 26 Oct.

- Automation: automation/…/crmrecords/TimelineTest#deletionIsLogged

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2623 · medium · Activities
**Activities | A recurring task ("Weekly, 3 times") is saved but the next tasks are never created**

Summary
Recurring tasks don't recur. A task saved with Repeat "Weekly, ends after 3 times" stores the repeat setting, but only the first task ever exists. No further tasks are created up front, and none is created after the first one is marked Completed.
Steps to Reproduce

- Open Tasks › Create (full form). Fill Subject and Due date.

- Click Repeat, choose Weekly, Ends: After 3 times, and save the task.

- Open the Tasks list and look for tasks with the same subject.

- Mark the task Completed, wait a few seconds, and look again.

Expected Result

- The recurring tasks exist, 3 in total, each due one week after the other (Zoho creates the recurring tasks for you).

Actual Result

- The task stores repeat = {"type":"weekly","ends":"after","afterCount":3}.

- Only one task with that subject exists, before and after it is marked Completed.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 26 Oct 2026, CRM go-live Wave 2 (case AC-01), by hand and by the automated rerun.

- Automation: automation/…/crmrecords/SearchActivitiesTest#recurringTaskCreatesNext

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2622 · medium · Search
**Search | Users on the built-in "User" profile can't use global search**

Summary
A user on the built-in "User" profile can't search. The search box shows "You don't have access to search." and the search API answers 403 "Missing required permission 'search.global.access'". The built-in User profile doesn't include that permission, so every normal user on the default profile has no global search.
Steps to Reproduce

- Sign in as a user whose profile is the built-in "User" profile (no overrides).

- Type a record name in the top search box ("Search or jump to…").

- Or call GET /api/v1/search?q=QA&limit=20 with that user's token.

Expected Result

- The user can search the records they are allowed to see, as Zoho's built-in Standard profile allows.

- If search is meant to be off for this profile, that should be a deliberate setting an admin can see and change.

Actual Result

- The screen shows "You don't have access to search."

- The API answers 403 forbidden, "Missing required permission 'search.global.access'."

- The same user can open and edit their own leads, so this is not a general access problem.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: test user 1 (nameb56175, built-in User profile, org unit Sales)

- Observed: 25 Oct 2026 (CRM go-live Wave 2, case GS-03), confirmed by the automated rerun on 26 Oct.

- Automation: automation/…/crmrecords/SearchActivitiesTest#userProfileCanSearch

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2621 · high · Pipelines
**Pipelines | A deal can't be moved to another pipeline: record page, Mass Update and API all fail with "Invalid value for: Pipeline"**

Summary
Nobody can move a Transaction (deal) to another pipeline. The Transactions Standard layout has two pipelines, "Standard" and "1", but the Pipeline field only accepts the text "Standard (Standard)". Moving a deal from the record page, from Mass Update or through the API fails with 422 "Invalid value for: Pipeline", and the screen shows no error: the dialog just stays open.
Steps to Reproduce

- Open Transactions and any deal on the Standard layout (pipeline "Standard").

- Use "Change pipeline", pick pipeline "1" and a stage of that pipeline, and confirm.

- Select the same deal in the list, choose Mass Update › Pipeline, pick "1" and a stage, and click Update records.

- Through the API, send PATCH /api/v1/modules/{transactions}/records/{id} with pipeline = the id of pipeline "1" (640e03a4-9c24-4b06-8d7d-5c1db2711b9b) and its stage test-01.

Expected Result

- The deal moves to pipeline "1" with the chosen stage, in all three ways.

- If a move is refused, the screen says why.

Actual Result

- Record page: the "Change pipeline?" dialog asks for the stage correctly, but Confirm sends a PATCH that answers 422 "Invalid value for: Pipeline". No message is shown, the dialog stays open, and the deal is not moved.

- Mass Update: POST /records/mass-update answers 422 "'640e03a4…' is not one of the allowed values (Standard (Standard))". The dialog stays open with no message.

- API: 422 "Invalid value for: Pipeline". Creating a deal with its own default pipeline id (5170500c…) is also refused; only the literal text "Standard (Standard)" is accepted.

- Cause seen in the field definition: the Pipeline field's allowed_values list holds only "Standard (Standard)". It is not kept in step with the pipelines of the layout.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com

- Account: ndc-staging-owner (Owner)

- Observed: 25–26 Oct 2026, CRM go-live Wave 2 retest (cases PL-04, PL-06, PL-08), confirmed by the automated rerun on 26 Oct.

- Related: NDC-2382, NDC-1312, NDC-1316, NDC-1324 (same root cause).

- Automation: automation/…/crmrecords/PipelineTest (moveDealByEdit, moveDealByMassUpdate, pipelineFieldOffersAllPipelines)

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2620 · medium · 
**Records | The Attachments section grows with every uploaded file instead of keeping a fixed height and scrolling**

Summary
On a record's Overview tab, each file uploaded to the Attachments section adds a row and makes the section taller. With a dozen or more files it fills the screen, pushes the sections below it out of view, and stretches the Survey section next to it into a large empty box.
Steps to Reproduce

- Open any Lead (CRM › Sales › Leads) and stay on the Overview tab.

- Scroll to the Attachments section and note its height with no files ("No attachments found").

- Click + Upload and add one file — the section gets taller by one row.

- Keep uploading until the record has about 15 files.

- Look at the Attachments section and the sections around it.
Expected Result

- The Attachments section keeps a fixed height, the same as the other sections in its row.

- When the files don't fit, a scroll bar appears inside the section to move through them.

- The sections below it (Invited Meetings, Projects, Emails) stay where they are.
Actual Result

- The section grows by one row for every file; with 15 files it takes up the whole visible page.

- Invited Meetings, Projects and Emails are pushed further down with each upload.

- The Survey section beside it stretches to the same height and is mostly empty.

- There is no scroll bar inside the section; the only way through the list is to scroll the whole page.
Environment

- App: TAVI CRM (staging) — staging-crm.taviportal.com › Leads › record › Overview

- Browser: Microsoft Edge 154.0.8037.98

- OS: Windows 10

- Viewport: 1272 × 866

- Reporter: valafo4080

- Captured: 26 Oct 2026, 11:39 AM (Cairo)
Attachment
Attachment

### Comments (0)


---
## NDC-2419 · high · Import & Export, Assignment Rules
**Assignment Rules | Rules fire on import and API but no longer set the owner**

Summary
Since 22 Oct, assignment rules run (execution outcome "Fired") but the record does not get the rule's user as owner. A lead imported with a rule has no owner at all, and a lead created through the API keeps its creator as owner. The same automated tests assigned the owner correctly on 21 Oct, so this is a regression. In Zoho, assignment rules assign the owner of records created through import, web forms and the API.
Steps to reproduce
Settings → Assignment Rules → a rule on Leads, channels Import and API, one entry: All Records → user A (an active user). Active.

Leads → Import Leads → one row (Name, Phone) → Standard layout → Assign step: tick Assign owner based on assignment rules and choose the rule → Submit.

Open the imported lead and check Lead Owner.

Expected result
Lead Owner = user A (import and API).

Actual result
Import: Lead Owner is empty (the record has no owner field).

API create: Lead Owner stays the user who created it.

The rule's execution shows outcome "Fired" in both cases.

Request
Import: PUT /api/v1/modules/{leads}/import/{session}/mapping with options.assignment_rule_id = rule id → validate → execute (202).
API: POST /api/v1/modules/{leads}/records (record source = api).
Response
Import (case A-02): lead a6e8cf76-d039-46cb-9f79-c8b34dc1bd7a, owner null; GET /workflow/executions?recordId=a6e8cf76… → assignmentRuleId 92fe5d76…, outcome Fired, trigger RecordCreated. Also import leads d9934be8 and de16faae: owner none.
API (case A-01): lead 227c598d-5845-4a8f-aaaf-7e7756154548, execution outcome Fired (rule c0d9801c…), owner = the creator, not the rule's user.
On screen: Jams https://jam.dev/c/d0b413bd-a31a-4c0a-8b05-99a9e1aefe08 and https://jam.dev/c/275e7847-2e0b-4278-83e7-2df44c7a4226 — leads 4ec5a331 and df497579 imported with rule "test": Lead Owner empty.
Evidence
Side-by-side image (CRM vs Zoho) attached.
Environment
staging-crm.taviportal.com, API and Edge, 22 October 2026, Owner and CRM Admin accounts.
Additional notes
Regression: the same tests (A-01, A-02) passed on 21 Oct 2026.

Also new since 21 Oct: records created with a user token now have source "api" (was "manual").

This also hides NDC-2411 (suspended member not skipped): retest NDC-2411 after this is fixed.

Zoho source: https://help.zoho.com/portal/en/kb/crm/automate-business-processes/assignment-rules/articles/set-assignment-rules

### Comments (2)
- 2026-10-27T09:58 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 26–27 Oct 2026
Environment: staging-crm.taviportal.com, NDC-Staging; account: CRM Admin (test users 1/2 where noted)
Method: Automation (TestNG suites crmaccess / crmhierarchy / crmautomationorder / crmrecords) + API
Import choosing the rule → owner = rule user (A-02 PASS). API-channel create → owner stays the creator (test user 1) instead of the rule user (test user 2) (A-01 FAIL).
Checked:

- Import choosing the rule → Owner = valafo4080 (rule user) [PASS]

- API-channel create → Owner stays the creator test user 1 (45ffbc5b…) instead of rule user 51666421… [FAIL]

- Execution log → Rule outcome Fired, owner not changed (same as 22 Oct for API) [FAIL]

- Rerun 27 Oct (auto-run6) → Same result: API create → owner nameb56175 (creator), rule 1be065d1 Fired, expected valafo4080 [FAIL]
Still failing:

- API-channel create: the rule fires but the owner is not set to the rule's user.
Evidence: NDC-2419-retest-PARTIAL.png (attached)
- 2026-10-27T12:13 551ac2bc-0cd1-4d42-9ac7-f037dd708e00: Root cause of the API failure (found live on 102.206, 27 Oct): the import path now writes the rule's owner inside the save, but an API create relies on the metadata-engine owner write-back consumer (Kafka topic RecordOwnerAssigned). On 102.206 the whole metadata-engine consumer group was Empty (0 members) since 26 Oct while the process still held its broker connections, so every rule read Fired and no owner was written. A consumer whose handler stops returning stops polling, and after max.poll.interval.ms (5 min) Kafka drops it for good.
Fix: metadata-engine 105acd4a (staging) / 0dda395f (deployed): each message's handler gets a 2-minute budget, so a hung handler can no longer stop the loop polling, plus a "still polling" log every 10 minutes. Two new tests; the hang test fails without the fix.
Deployed: 102.206 (crm.taviportal.com), 27 Oct ~10:12 UTC. The consumers rejoined and the waiting owner events were applied.
Please retest A-01 on crm.taviportal.com. staging-crm (41.128) is not deployed yet: its consumers are very likely stuck the same way, and a restart of metadata-engine there will unblock it.
Note: metadata-engine staging currently cannot be built on the servers. It pins unpublished packages (Shared.Audit 2.4.0, Shared.EventBus 2.2.1, Timeline.Application 1.2.2), so this fix was deployed from deploy/102206-ndc2419 (the commit deployed on 26 Oct + the fix).

---
## NDC-2410 · medium · Desk Integrations
**CRM - Desk Integration | "Lock CRM-owned fields on the contract" does not stop edits in Desk**

Summary
With "Lock CRM-owned fields on the contract" on (the default), the contract name, which comes from the CRM deal name, can still be changed in Desk and is saved. The next deal update then overwrites or conflicts with it.
Steps to reproduce
Configuration Details → Contracts: "Lock CRM-owned fields on the contract" = on (default).

Win a deal in CRM so a Desk contract is created; give the contract a support plan, account and dates so it is valid.

Change the contract name in Desk.

Request
PATCH /api/v1/modules/{desk contracts}/records/{id} {support_plan, account_id, start_date, end_date} -> 200
PATCH /api/v1/modules/{desk contracts}/records/{id} {contract_name: "QA CD edited in Desk"}        -> 200, saved
(lock switched off) PATCH … {contract_name}                                                          -> 200 (same result)Expected result
CRM-owned contract fields (contract name, value, owner, description, start date) are read-only in Desk while the lock is on; an edit is refused with a clear message.
Actual result
200; the contract name is changed in Desk. The result is the same with the lock off.
Evidence
Annotated image CD-18 (executions/execu_2026-10-20_crm-desk-integration/evidence/CD-18-contract-lock-not-enforced-vs-zoho.png) is attached or will be attached to this ticket.
Environment
staging-crm and staging-desk.taviportal.com (tenant NDC-Staging), API, 21 October 2026, owner account. Settings restored and QA records deleted after the run.
Additional notes
Spec row D6. Contracts from deals is a TAVI feature Zoho does not have, so the expected behaviour comes from the setting itself. PRD NDC-1669; missing features are in NDC-2392.

Full bug report: executions/execu_2026-10-20_crm-desk-integration/bug-report.html (CD-18) in the QA repository.

### Comments (0)


---
## NDC-2406 · high · Desk Integrations
**CRM - Desk Integration | A Desk contact deleted by the integration is not in the recycle bin and cannot be restored**

Summary
With "Delete the corresponding Desk contact", deleting the CRM contact removes the Desk contact, but the Desk contact is not in the Desk recycle bin. TAVI's own setting note says "The Desk contact goes to the Desk recycle bin together with … its tickets … and can be restored from there." Data deleted this way cannot be restored.
Steps to reproduce

- Configuration Details → Preferences: "On deleting a CRM contact" = Delete the corresponding Desk contact.

- Delete a linked CRM contact.

- Desk → Settings → Recycle Bin: look for the Desk contact (API GET /api/v1/audit/recycle-bin/items?app_key=desk).

Expected result
The Desk contact (and its tickets) is in the Desk recycle bin and can be restored, as the setting promises. Zoho: "the record and its associates go to the Desk recycle bin".
Actual result
GET of the Desk contact answers 404 and there is no recycle-bin entry for it (200 newest Desk items checked); a restore is impossible.
Evidence
Annotated image CD-14 (executions/execu_2026-10-20_crm-desk-integration/evidence/CD-14-cross-delete-not-in-recycle-bin-vs-zoho.png) is attached or will be attached to this ticket.
Environment
staging-crm and staging-desk.taviportal.com (tenant NDC-Staging), API, 21 October 2026, owner account. Desk contacts 94ce79a7 and 9fc88446 (QA test records).
Additional notes

- Spec rows E9, E4; missing features are in NDC-2392; PRD NDC-1669.

- Full bug report: executions/execu_2026-10-20_crm-desk-integration/bug-report.html (CD-14) in the QA repository.

### Comments (0)


---
## NDC-2294 · high · 
**Automation Execution Order: features missing from TAVI CRM**

Summary
We compared CRM's automation processes and their execution order (Assignment Rules → Review Process → Workflow Rules + Actions → Approval Process → Blueprint) with Zoho CRM on Leads, Deals and Tasks. This ticket lists what Zoho has and CRM does not have yet. The execution-order holder is NDC-1255. Each item has an annotated image (CRM left, Zoho right) attached to this ticket.
Missing — execution order and entry points
The import option "Trigger workflow rules" has a misleading name. It actually controls whether workflow rules, the approval process and the blueprint run on imported records, not only workflow rules. Please rename it to "Trigger automation and process management", as in Zoho. After the rename we will retest import with the option on and off, to make sure workflow rules, approval and blueprint run only when it is on. Image 01.

Manual approval of imported records. Today the import wizard shows "Coming soon". Image 01. ⇒ if it's still not implemented, leave it as it is with "Coming soon" message.

Missing — workflow rules
Record Score and Record Notes triggers. Today only Record Action and Date-Time are offered. Image 02.

Add Meeting, Schedule a Call, Function and Create Connected Record actions. A "Custom Function" action type exists in the code but is never offered. Image 03.

Assign Owner by an assignment rule, plus "only online users", "email the new owner" and "transfer related records". Today only Users, Org Units, Profiles and User Fields. Image 04.

Missing — review process
Functions on review events (submission, review, rejection, resubmission). The API object has a webhookUrl field with no screen. Image 05.

Missing — approval process
"Anyone" or "Everyone" for Role and Group approvers, and sequential or parallel for Everyone. Image 06.

Call Functions after approval or rejection really running. Today it can be added but "runs as a no-op in this version". Image 07.

Missing — blueprint
Convert (Leads), Custom Actions (functions) and Tags after a transition. "Create record" is also not in the After list of the blueprint checked. Image 08.

Missing — review process (added 19 Oct 2026)
Rejection reasons for each review process. Today there is one list for all review processes ("Configure Rejection Reasons" on the Review Process list page, at most 10 active for the whole org), so changing a reason changes every process. In Zoho the reasons are set inside each process (Actions → "Configure Reasons For Record Rejection") and saved with it. Image 09.

Missing — workflow scheduled actions (added 20 Oct 2026)
Field Update, Assign Owner and Tags as scheduled actions. Today a scheduled action can only be Webhook, Email, Task, Create Record or Send portal access. Zoho also offers Field Update, Assign Owner, Tags, Activities (Task, Meeting, Call), Create Connected Record and Function. Meeting, Call, Function and Create Connected Record are already in item 4. Note: the API accepts a Field Update with a delay (delaySeconds) but runs it at once; once scheduled Field Update is added on the screen, the delay must be honoured. Image 10.

Missing — workflow conditions (added 22 Oct 2026)
Several conditions in one workflow rule, each with its own instant and scheduled actions. In Zoho a rule can hold up to 10 conditions, checked in order: the first condition the record matches runs its actions and the rest are skipped, and from the second condition on "records not meeting any of the above" can be used. Zoho also refuses two conditions with the same criteria in one rule ("the criteria is part of another condition") and the same action twice inside one condition. Today a CRM rule has one criteria and one action list, and "+ Add another condition" is not offered. The only workaround is separate rules, but they all fire when their criteria match, so there is no "first match wins" and no "else". Image 12.

Missing — API (added 25 Oct 2026)
Choosing which automations run when a record is created through the API. In Zoho the create request has a "trigger" list (workflow, approval, blueprint): without it all related automation runs, and "trigger": [] creates the record without running workflows. This is used for bulk loads and data migrations, so imported records do not send emails, tasks and webhooks. Today CRM accepts "trigger": [] but ignores it: workflow and approval still ran on the lead (case G-18, lead c480174c). Image 13.

Environment
staging-crm.taviportal.com, 
Edge, 18 October 2026,
 Owner and CRM Admin accounts.
 Zoho CRM full edition, read-only.

### Comments (0)


---
## NDC-1797 · high · Recycle Bin
**Recycle Bin | Some records can't be deleted forever in a bulk delete and stay in the Recycle Bin.**

Summary
When a user selects a page of records in the Recycle Bin and chooses Delete forever, only some of them are permanently deleted. The rest stay in the Recycle Bin and are still listed after the page is refreshed.
Steps to Reproduce
Go to Settings → Data → Recycle Bin (no filter applied).

Tick the checkbox at the top of the list to select all records on the page (50).

Click Delete (50), then choose Delete forever.

Refresh the browser page.

Look at the top of the list — some of the records you just deleted are still there (e.g. "test delete", "test", "test@test.com").

Expected Result
All selected records are permanently deleted.

If a record can't be deleted, the user is told which one and why.

Actual Result
Only some of the selected records are deleted — in testing, 12 of 50 stayed in the Recycle Bin.

The remaining records are still listed after a page refresh.

Environment
App: TAVI CRM — crm.taviportal.com (Settings → Data → Recycle Bin)

Browser: Edge 153.0.8010.53

OS: Windows 10

Screen: 1272×473

User: ndc-staging-owner

Captured: 23 Sep 2026, 16:52 (Cairo time)

Attachment
Attachment

### Comments (2)
- 2026-10-26T09:17 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PASS — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: —
All 50 selected items deleted forever (API 60 → 10); none left behind.
Checked:

- Bulk Delete forever (50 ids) → POST /recycle-bin/delete 200 — all 50 succeeded [PASS]

- Bin after the delete → 60 → 10 items; the 10 left are the unselected bulk 01–10 [PASS]
Evidence: NDC-1797-retest-PASS.png
- 2026-10-26T13:19 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
16 Recycle Bin items belong to modules that no longer exist (23c1a6s8d46a, test, partners, testmodule). As the Owner, both Delete forever and Restore answer recyclebin.error.forbidden, and Empty Bin leaves them. They can only expire after 60 days.
Environment: staging-crm.taviportal.com, owner account; automated test RecycleBinTest#orphanItemCanBeDeleted found the 16 items on 26 Oct; delete and restore were refused in the manual run on 25 Oct.
Annotated TAVI-vs-Zoho image attached: NDC-1797-retest.png

---
## NDC-1694 · low · Teamspace
**Teamspace | A teamspace can be saved with zero modules.**

Summary
A teamspace can be created and saved without any modules in it. The Modules section is empty, its own placeholder invites the user to add modules or folders, and the Save button is still enabled. Saving succeeds and the teamspace appears in the list showing "0 modules". A teamspace with no modules has nothing a user can open, so it serves no purpose while still occupying a place in the teamspace switcher.
Steps to Reproduce
Go to Settings > Customization > Teamspace.

Click "+ Create New Teamspace".

Enter a name, for example "New Teamspace".

Do not add any modules and do not create any folders — leave the Modules section showing its placeholder text.

Leave Permissions at their defaults.

Click Save.

Look at the teamspace list.

Expected Result
A teamspace should not be saveable without at least one module.

The Save button should stay disabled until a module is added, with the reason stated next to it.

If saving an empty teamspace is intentionally allowed, it should not be offered to users in the teamspace switcher until it contains something to open.

Actual Result
The Save button is enabled even though the Modules section is empty.

Saving succeeds and shows "Teamspace saved successfully".

The new teamspace appears in the list with "0 modules".

No warning or confirmation appears at any point.

The teamspace is created with nothing in it and nothing for a user to open.

Environment
App: Anyware CRM — https://crm.taviportal.com/settings/teamspace (Customization > Teamspace > Create New Teamspace)

Teamspace created: "New Teamspace", Accessible To: All Users, Admin: ndc-staging-owner, 0 modules

Browser: Edge 152.0.7977.83

OS: Windows 10 (x86)

Viewport: 1272 x 866

Reporter: Mahmoud Mohamed

Captured: 16 Sept 2026, 10:52 UTC

Attachment
Attachment

### Comments (1)
- 2026-10-26T09:15 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: UI fixed; API still allows it.
UI: Save disabled with "Add at least one module to save this teamspace." API: POST /teamspaces with no modules → 201, and the empty teamspace is offered in the sidebar switcher.
Checked:

- Save with no modules (UI) → Save disabled; hint "Add at least one module to save this teamspace." [PASS]

- Server rule → POST /teamspaces {modules: []} → 201; listed with 0 modules [FAIL]

- If allowed, not offered in the switcher → "QA RT TS empty" (0 modules) offered in the sidebar switcher [FAIL]

- Cleanup → Teamspace a1a9bba3 deleted; sidebar back to CRM Teamspace [INFO]
Still failing:

- API creates an empty teamspace (201) and it is offered in the teamspace switcher.
Evidence: NDC-1694-retest-PARTIAL.png

---
## NDC-1344 · high · Audit Log
**Audit Log | The entity filter is incomplete and does not cover all system entities**

Summary
The All Entities filter on the Audit Log offers 27 options, covering only a fraction of the entities the system holds. Many features that can be created, changed or deleted have no entity type in the list, so their activity cannot be filtered for.
Several entries also use raw internal names rather than user-facing labels, and some closely related features appear individually while their siblings are absent entirely.
Steps to Reproduce
Go to Settings › Security Control › Audit Log.

Click the All Entities filter.

Scroll the full list of entity types offered.

Compare it against the features available in Settings — Modules and Fields, Automation, Process Management, Data, Integrations, Security Control.

Note which features have no corresponding entity type, and which entries are labelled with internal names.

Expected Result
Every entity a user can create, change or delete should have a corresponding type in the filter.

The list should be complete and consistent — related features should not appear individually while their siblings are missing.

Every entry should carry a user-facing label, not an internal or table name.

The filter should follow the grouping set out below: automation features and import/export listed individually, and module configuration, email, security and system, and company each as a single grouped filter.

Actual Result
The filter currently offers these 27 options:
All Entities · Contact · Lead · Account · Deal · User · Profile · Permission · Org Unit · Business Hours · Shift · Company · Global Set · Dashboard · Teamspace · Workflow Rule · Approval Process · Email Template · audit log entry · Setting · Import · Mass Delete · Mail connection row · Mail message row · Mail outbox row · Mail system connection row · Session
Modules are incomplete. Only Contact, Lead, Account and Deal appear, though the tenant holds several other modules.

Automation is only partly covered. Workflow Rule and Approval Process appear; the other automation features do not.

Module configuration is absent entirely — no layouts, fields, pipelines, rules or related settings.

Export and Recycle Bin are absent, although Import and Mass Delete are present.

Six entries use internal names — audit log entry (lowercase), Setting, and four Mail … row entries — which read as database table names rather than something a user would recognize.

Grouping is inconsistent. Email Template appears while Email Signature and Email Provider do not; Business Hours and Shift appear as separate top-level entries.

Missing entities that need to be added
Modules — only Contact, Lead, Account and Deal appear. Missing:
Task · Call · Meeting · Subscription · and any custom module

Automation — Workflow Rule and Approval Process appear. Missing:
Review Process · Assignment Rule · Action (saved actions) · Blueprint

Module configuration — none present. Missing:
Module · Layout · Layout Rule · Validation Rule · Field · Field Permission · Pipeline · Stage · Record Locking Configuration · Lead Conversion Mapping · Tag · Button · Link · Map Dependency Field

Data operations — Import and Mass Delete are present. Missing:
Export · Recycle Bin

Email — Email Template is present, alongside four internally-named Mail rows. Missing:
Email Signature · Email Provider

Security and system — missing:
Security Policy · Capability · Data Type · Timeline Visibility · Activity Reminder · Web Tab

Entries needing a proper name — present but labelled with internal names:
audit log entry → Audit Log Entry

Setting → too vague; should name the setting area it covers

Mail connection row, Mail message row, Mail outbox row, Mail system connection row → should carry user-facing names, or be folded into the Email group

Required grouping
The filter should be organized as follows. Some areas warrant a single grouped filter; others need each feature listed separately.
Area
Treatment

 | Automation
 | Not grouped. Each automation feature has its own filter — Workflow Rule, Review Process, Approval Process, Assignment Rule, Action, Blueprint.

 | Module Configuration
 | One filter, covering every feature within it — layouts, layout rules, validation rules, fields, field permissions, pipelines, stages, record locking configuration, lead conversion mapping, tags, buttons, links, map dependency fields.

 | Import / Export
 | Not grouped. Import and Export each have their own filter, separate from one another.

 | Email
 | One filter, covering everything email-related — Email Templates, Email Signature, Email Providers, and the four Mail entries currently listed under internal names.

 | Security and System
 | One filter, covering every feature within it — Security Policies, Capabilities, Data Types, Timeline Visibility, Activity Reminders, Web Tabs.

 | Company
 | One filter, covering Business Hours and Shift.

The principle is that features a user thinks of as distinct — each automation type, import versus export — should be filterable individually, while configuration areas a user thinks of as one thing should be a single filter rather than a dozen entries.
Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Security Control › Audit Log

URL: https://crm.taviportal.com/settings/security/audit-log

Entity options offered (27): All Entities, Contact, Lead, Account, Deal, User, Profile, Permission, Org Unit, Business Hours, Shift, Company, Global Set, Dashboard, Teamspace, Workflow Rule, Approval Process, Email Template, audit log entry, Setting, Import, Mass Delete, Mail connection row, Mail message row, Mail outbox row, Mail system connection row, Session

Browser: Microsoft Edge 152.0.7977.65

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 3 September 2026, 07:33 UTC

Attachment
Attachment

### Comments (5)
- 2026-09-08T15:24 e1364b0b-d3cd-4167-8261-6194577a480a: Retest of NDC-1344 Failed
Audit Log | Assignment rule, Review process, Actions, and Pipeline entities are missing in entity filter
https://jam.dev/c/3d6b2b5b-3214-47c5-97b2-0fbbe0fd52e0
- 2026-10-21T11:38 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle + locale). The Audit Log entity filter now includes grouped options for Module Configuration, Email (incl. signatures), Security and System, plus review process, assignment rule, saved action, blueprint, record export and recycle bin; raw names are replaced by labels ("Module Configuration", "Security and System", "Workspace Setting", …). Please confirm in the UI.
- 2026-10-21T15:53 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 21 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless, playwright) · main account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); helpers: ndc-staging-owner, test user 1 (nameb56175), mahmoud.mmohamedsamy
Method: manual browser + API (retest round 21 Oct)
Developer's note checked: Missing entities and groups: held. Duplicates/raw names: not fixed.
All missing entities are now in the filter and grouped as asked, and "Audit Log Entry" is labelled. But the list repeats entries (Workflow rule / Workflow Rule, Approval process / Approval Process, Blueprint ×3, Profile ×2), shows raw types (Mail template, Module view) among modules, and repeats the module block at the end. The feed prints "restored a audit.entity.leads". Separately, the Audit Log recorded no events between 20 Oct 21:33 UTC and 21 Oct 11:14 UTC.
Checked:

- Missing entities added → All present: Review Process, Assignment Rule, Action, Custom Action, Blueprint, Web Form, Customer Portal, Import, Export, Mass Delete, Recycle Bin, SMS, Skill… [PASS]

- Grouping → Present as single options; selecting Module Configuration sends the grouped entity types [PASS]

- User-facing labels → "Audit Log Entry" labelled [PASS]

- Consistent list → Duplicates: Workflow rule / Workflow Rule, Approval process / Approval Process, Blueprint ×3, Profile ×2; raw types Mail template, Module view among the modules [FAIL]

- No repeated module block → Modules block repeated at the end of the list [FAIL]

- Feed labels → "restored a audit.entity.leads" — raw i18n key [FAIL]

- New finding → Audit Log recorded nothing between 20 Oct 21:33 UTC and 21 Oct 11:14 UTC (pipelines, imports, records, settings changed today) — see observations [INFO]
Still failing:

- Entity list: duplicates and raw types (see image).

- Feed: raw key audit.entity.leads instead of Lead.
Evidence: NDC-1344-retest-PARTIAL.png
- 2026-10-26T09:14 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: Duplicates and the feed key fixed; labels for new modules not.
Entity filter: no duplicates, no repeated module block; feed reads "restored a Lead named …". Still: new modules listed by key (qa_rt_module_1693) although they have labels; "23c1a6s8d46a" and "Test" listed but not CRM modules; internal names "Mail agent signature row", "Module view pin".
Checked:

- No duplicate entries, no repeated module block → 58 options, no duplicates (Workflow rule/Rule, Approval process/Process, Blueprint ×3, Profile ×2 gone); module block once [PASS]

- User-facing labels only → New modules listed by key "qa_rt_module_1693", "qa_rt_module_1693_b"; "23c1a6s8d46a" and "Test" listed but not modules of this CRM; "Mail agent signature row", "Module view pin" [FAIL]

- Feed label for restore → "restored a Lead named QA RT 1337 u2 plain" — audit.entity.leads gone [PASS]

- Automation → Tag NDC-1344 exists only in an AuditLogTest javadoc — nothing ran; checked by hand [INFO]
Still failing:

- New modules shown by API key instead of label.

- Unknown entries "23c1a6s8d46a", "Test"; internal names "Mail agent signature row", "Module view pin".
Evidence: NDC-1344-retest-PARTIAL.png

---
## NDC-1335 · urgent · Modules & Fields
**Modules and Fields | Saving a layout fails with "Failed to update options for Subform" when the layout has no subform — a 404 on a non-existent field**

Summary
Saving a layout fails with the error "Failed to update options for Subform", even when the layout contains no Subform field. The message appears repeatedly and the save does not complete.
The underlying failure is a 404: the save attempts to update a field that does not exist on the module. The client reports that as a subform problem, which is misleading — the layout has no subform, and the field being updated is not one either.
The same error occurs when creating a new layout using only the system predefined fields, so it does not depend on any field the user has added.
Steps to Reproduce
Go to Settings › Modules and Fields and open the Leads module.

Open a layout for editing — here New Layout 2.

Make any change and click Save.

Note the red error banner reading "Failed to update options for Subform", appearing several times.

Confirm the layout contains no Subform field.

Click Cancel — an unsaved-changes prompt appears, confirming the save did not complete.

Separately, create a new layout using only the system predefined fields, without adding any fields, and click Save.

Note that the same error appears.

Expected Result
Saving a layout should succeed and confirm that it saved.

No error should mention a Subform when the layout contains none, and no error should mention any field when the layout doesn't contain it.

If a field cannot be updated, the message should name the field that failed and why.

A newly created layout using only predefined fields should save without error.

Actual Result
Saving the layout fails with "Failed to update options for Subform", shown repeatedly — eight times across the recording.

The layout contains no Subform field, so the message does not describe the actual problem.

Behind the error, the save issues PUT /api/v1/modules/841043e1…/fields/05f054f7-c3fc-4454-9a87-6543a2b90b8d and receives 404 Not Found, twice.

The save never completes. Attempting to leave produces an unsaved-changes prompt.

The same error occurs when creating a new layout from the system predefined fields alone.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Modules and Fields › Leads › layout editor

Module: Leads (841043e1-c078-41f9-8d6e-dfd61bee45c3)

Layout: New Layout 2

Failing request: PUT /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields/05f054f7-c3fc-4454-9a87-6543a2b90b8d → 404 Not Found, at 4.6s and 24.1s

Error shown: "Failed to update options for Subform" (8 times)

Browser: Microsoft Edge 151.0.7922.170

OS: Windows 10 (x86, 64-bit)

Viewport: 1912 × 922

Reporter: Mahmoud Mohamed

Captured: 1 September 2026, 09:19 UTC

Attachment
Attachment

### Comments (1)
- 2026-10-26T09:14 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: Existing layout fixed; new layout still fails on an unrelated Subform field.
Saving a change to an existing layout works ("Layout updated successfully", no Subform error). Saving a NEW layout with only predefined fields fails: the builder also PUTs the module's "Subform" field (no subfields, only on layout فاتورة) → 422 "A subform needs at least one subfield before it can be saved"; layout not created.
Checked:

- Edit an existing layout and Save → PUT /fields ×5 200 + PUT /layouts/6261fa51 200, "Layout updated successfully"; no Subform error (save took 46 s) [PASS]

- Cancel after the save → No prompt; moduleImageEnabled false stored [PASS]

- New layout with predefined fields only → Save → PUT /fields/5dd25be0 ("Subform", 0 subfields, only on layout "فاتورة") → 422 DATATYPE_SUBFORM_NO_SUBFIELDS; layout not created (was 404, same failure class) [FAIL]

- Failing field named with the reason → "Couldn't save the settings for "Subform": A subform needs at least one subfield…" [PASS]

- Save before the builder finished loading → Created a new layout "Standard Layout" (dff47b4e) instead of updating "test" — deleted in cleanup [INFO]

- Ticket layout "New Layout 2" → No longer exists; Leads layout "test" used [INFO]
Still failing:

- Step 4: new predefined-only layout → PUT /fields/5dd25be0 (Subform) 422 DATATYPE_SUBFORM_NO_SUBFIELDS; layout not created.

- Observation: saving before the builder finished loading created a duplicate "Standard Layout" instead of updating "test".
Evidence: NDC-1335-retest-PARTIAL.png

---
## NDC-1324 · medium · Pipelines
**Deals Listing Page | Editing the Pipeline field inline shows an empty pipeline list**

Summary
Editing the Pipeline field directly from the Deals listing page offers no pipelines to choose from. Clicking the field opens a "Select pipeline…" control, but the list is empty, so the pipeline cannot be changed from the list.
The pipelines exist and are correct on the record itself — opening the same deal shows its pipeline as Standard (Default) with its stages available. Only the inline picker on the listing page fails to populate.
Steps to Reproduce
Go to the Deals module listing page.

Locate a deal in the list — here test-01, amount 1,500.

Click the Pipeline cell for that deal to edit it inline.

A "Select pipeline…" control opens. Look at the options offered.

Click it again to confirm the list stays empty.

Open the same deal's record page and check the Pipeline field there for comparison.

Expected Result
Clicking the Pipeline field on the listing page should list the pipelines available for the module.

The pipelines offered should match those available on the record page.

Selecting a pipeline should apply it to the deal.

Since each pipeline has its own stages, changing pipeline here should also establish the deal's stage.

Actual Result
The "Select pipeline…" control opens but the list is empty — no pipelines are offered.

Clicking a second time produces the same empty list.

The pipeline cannot be changed from the listing page at all.

Opening the same deal's record page shows the pipeline correctly as Standard (Default), with stages including qualification — so the data is present and only the listing-page picker is affected.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Deals module, listing page (inline edit)

URL: https://crm.taviportal.com/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/list/deals

Module: Deals (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430)

Deal: test-01 (8ba8bdd0-33a1-4cbc-9607-5669487ce170), amount 1,500

Pipeline on the record: Standard (Default), stage qualification

Browser: Microsoft Edge 152.0.7977.65

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 31 August 2026, 10:54 UTC

Attachment
Attachment

### Comments (4)
- 2026-10-21T11:40 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). Inline-editing Pipeline on the Deals list now opens the change-pipeline modal (with layout and current pipeline) instead of the empty combobox. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging.
- 2026-10-21T15:55 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 21 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless, playwright) · main account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); helpers: ndc-staging-owner, test user 1 (nameb56175), mahmoud.mmohamedsamy
Method: manual browser + API (retest round 21 Oct)
Developer's note checked: UI part held; the change does not apply.
Inline edit opens the change-pipeline modal listing pipelines and the stage. Change pipeline → PATCH 200 but the deal stays on Standard (same root cause as NDC-1302).
Checked:

- Inline Pipeline field lists the module's pipelines → Modal lists the other pipeline ("1"); the empty combobox is gone [PASS]

- Changing pipeline here also sets the stage → "Stage in the new pipeline" shown (qualification kept, exists in both) [PASS]

- Selecting a pipeline applies it → PATCH 200 but stored pipeline is still Standard; list and record show Standard (same root cause as NDC-1302) [FAIL]
Still failing:

- Expected "Selecting a pipeline applies it to the deal" — actual pipeline unchanged.
Evidence: NDC-1324-retest-FAIL.png
- 2026-10-26T09:15 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: Regressed on staging: inline editor is a plain picker.
Deals list Pipeline column shows the raw id "5170500c-…" for every deal; inline edit opens a plain picker (raw-id chip) offering only "Standard (Standard)" — the change-pipeline modal of 21 Oct is gone. Likely a consequence of the Pipeline field now being a plain pick list.
Checked:

- Pipeline column value → Raw id "5170500c-b335-479c-96d1-ed138965c345" on every deal (probably a side effect of the corrupted field) [FAIL]

- Inline edit lists the module's pipelines → Plain picker: chip shows the raw id; only "Standard (Standard)"; no change-pipeline dialog (seen on 21 Oct) [FAIL]

- Selecting a pipeline applies it → Cannot be tried — "1" not offered and every pipeline write is refused (422) [BLOCKED]

- Cause → Staging Pipeline field allows only "Standard (Standard)"; recheck after the field is repaired [INFO]
Still failing:

- Blocked/regressed by staging Pipeline field config: raw ids in the list, no pipeline choice inline.
Moved to Bug (QA lead decision, 26 Oct): the fix cannot be confirmed on staging. The Deals "pipeline" field is a pick list that allows only "Standard (Standard)" (changed 24 Oct 15:54 UTC by ndc-staging-owner), so no deal can be created or moved with any pipeline in the UI or the API. Please restore the field (pipeline lookup with all pipelines of the layout) and move this ticket back to Ready For Test.
Evidence: NDC-1324-retest-BLOCKED.png
- 2026-10-26T13:18 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
The inline Pipeline editor in the Transactions list is no longer empty, but it offers only "Standard (Standard)"; pipeline "1" of the same layout is missing. The cells show the raw id 5170500c-…. The Pipeline field's allowed values are ["Standard (Standard)"] only. Same root cause as NDC-2621.
Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#pipelineFieldOffersAllPipelines.
Annotated TAVI-vs-Zoho image attached: NDC-1324-retest.png

---
## NDC-1316 · medium · Pipelines
**Deals - Mass Update | Pipeline is not offered as a field, so deals cannot be moved between pipelines in bulk**

Summary
The Mass Update field list does not include Pipeline, so deals cannot be moved from one pipeline to another in bulk. Searching for "pipeline" in the field picker returns "No results found".
Where Pipeline is added, it should not be offered alone. Because each pipeline has its own stages, selecting a destination pipeline must also establish which stage the deals land on — otherwise the deals arrive in a pipeline holding stages that do not belong to it.
The expectation, demonstrated against Zoho CRM in the recording, is that mass update should present both a destination pipeline and a stage, with the stage defaulting to the first stage of the destination pipeline.
Steps to Reproduce
Go to the Deals module.

Tick the checkboxes for two or more deals.

Open the actions menu and choose Mass Update.

Click Choose a field.

Type pipeline into the field search.

Note the result.

Scroll the full field list and confirm Pipeline is not present under any other name.

Expected Result
Pipeline should be available as a field in Mass Update, so deals can be moved between pipelines in bulk.

Selecting a destination pipeline should also prompt for the stage the deals should move to.

The stage list offered should be the stages of the destination pipeline.

The stage should default to the first stage of the destination pipeline.

Actual Result
Searching for "pipeline" in the Mass Update field picker returns "No results found".

Pipeline is not offered anywhere in the field list.

Deals cannot be moved between pipelines in bulk; each must be changed individually on its own record.

Because the field is absent, there is also no stage prompt — the question of which stage deals land on does not arise at all.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Deals module, Mass Update

Module: Deals (f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430)

Search term used: "pipeline" → "No results found"

Reference implementation shown: Zoho CRM — mass update offering Pipeline and Stage together

Browser: Microsoft Edge 152.0.7977.65

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 31 August 2026, 09:06 UTC

Attachment
Attachment

### Comments (4)
- 2026-10-21T11:40 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle). Mass Update now offers Pipeline, and requires both the destination pipeline and stage. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging.
- 2026-10-21T15:54 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 21 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless, playwright) · main account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); helpers: ndc-staging-owner, test user 1 (nameb56175), mahmoud.mmohamedsamy
Method: manual browser + API (retest round 21 Oct)
Developer's note checked: UI part held; the update fails.
Mass Update offers Pipeline with the destination stage (first stage default). Update records → "Updated 0. 2 could not be updated" — stage validated against Standard. Failures listed by record UUID.
Checked:

- Pipeline available in Mass Update → Pipeline listed (search "pipe" finds it) [PASS]

- Stage prompted from the destination pipeline → "Stage in the new pipeline": test-01 (default) … identify_decision_makers [PASS]

- Deals moved in bulk → "Updated 0. 2 could not be updated": Stage 'test-02' is not part of the 'Standard' pipeline [FAIL]

- Failure list readable → Rows identified by record UUID only [INFO]
Still failing:

- Step 3: expected 2 deals moved to pipeline "1" / test-02; actual Updated 0, 2 failed.
Evidence: NDC-1316-retest-FAIL.png
- 2026-10-26T09:15 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: Mass Update UI held; the update cannot be verified.
Mass Update offers Pipeline + "Stage in the new pipeline" (7 stages of "1", default first). Update records → POST mass-update 422 (same Pipeline message); the dialog stays open with no message — caused by the staging Pipeline field config.
Checked:

- Pipeline offered in Mass Update → "Pipeline" field with New pipeline (Standard (Default), 1) [PASS]

- Stage of the destination pipeline, first by default → "Stage in the new pipeline": 7 stages of "1", hint "Defaults to the first stage of the new pipeline…" [PASS]

- Update records moves both deals → POST 422 "Pipeline: '640e03a4-…' is not one of the allowed values…"; dialog stays open with no message; both still Standard / qualification [BLOCKED]

- Failure shown to the user → Nothing shown (no toast, no inline message) [INFO]

- Cause → Staging Pipeline field allows only "Standard (Standard)" — not judgeable on staging now [INFO]
Still failing:

- Blocked by staging Pipeline field config.

- Also: the refused Mass Update shows no message to the user.
Moved to Bug (QA lead decision, 26 Oct): the fix cannot be confirmed on staging. The Deals "pipeline" field is a pick list that allows only "Standard (Standard)" (changed 24 Oct 15:54 UTC by ndc-staging-owner), so no deal can be created or moved with any pipeline in the UI or the API. Please restore the field (pipeline lookup with all pipelines of the layout) and move this ticket back to Ready For Test.
Evidence: NDC-1316-retest-BLOCKED.png
- 2026-10-26T13:17 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
Pipeline is now offered in Mass Update, with "New pipeline" and "Stage in the new pipeline". Applying it fails: the screen request answered 422 "'640e03a4…' is not one of the allowed values (Standard (Standard))" on 25 Oct, and the API answered 422 "Invalid value for: Pipeline." on 26 Oct. The dialog stays open with no message. Same root cause as NDC-2621.
Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#moveDealByMassUpdate.
Annotated TAVI-vs-Zoho image attached: NDC-1316-retest.png

---
## NDC-1312 · medium · Pipelines
**Pipelines | Changing a deal's pipeline does not ask which stage the deal should move to**

Summary
Moving a deal from one pipeline to another does not prompt for the stage it should land on in the new pipeline. A confirmation modal appears asking only whether to proceed, and clicking Change pipeline completes the move without any stage being chosen.
Since each pipeline has its own stages, and the deal's current stage belongs to the pipeline it is leaving, the deal has no valid stage in the pipeline it arrives at. The user is given no opportunity to say where it should sit.
Steps to Reproduce
Go to the Deals module and open a deal — here test-01.

Confirm the deal's current pipeline and stage. Here the pipeline is Standard (Default).

Click the pipeline selector at the top of the record.

Choose a different pipeline from the list — here test.

A confirmation modal appears. Note that it offers no stage selection.

Click Change pipeline.

Repeat with another pipeline — here Test-Pipeline — and note the same modal.

After the change, check which stage the deal is on in its new pipeline.

Expected Result
Changing a deal's pipeline should ask which stage in the new pipeline the deal should move to.

The stage list offered should be the stages of the destination pipeline.

The deal should end up on a stage that genuinely belongs to its new pipeline.

If a stage is not chosen, the change should either be blocked or default to the new pipeline's first stage, and say so clearly.

Actual Result
The confirmation modal asks only whether to change pipeline — no stage selection is offered.

Clicking Change pipeline completes the move immediately, and "Record updated successfully" is shown.

The deal is moved to the new pipeline without any stage having been chosen for it.

This happened on both changes — Standard → test, and test → Test-Pipeline — so the modal never offers a stage regardless of the destination.

The deal is therefore left in a pipeline whose stages it was never mapped onto.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Deals module, deal record, pipeline selector

Deal: test-01

Pipelines used: Standard (Default) → test → Test-Pipeline

Browser: Microsoft Edge 152.0.7977.65

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 31 August 2026, 07:22 UTC

Attachment
Attachment

### Comments (4)
- 2026-10-21T11:40 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Retest on staging-crm, 2026-10-21: FIXED (verified in deployed bundle + server code). The change-pipeline modal asks for "Stage in the new pipeline" (defaults to the first stage); the server moves a cross-pipeline change to the destination's first stage. Not exercised end-to-end: the Deals module on the test tenant has no pipeline field. Please confirm on NDC-Staging.
- 2026-10-21T15:54 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 21 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging · Edge (headless, playwright) · main account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); helpers: ndc-staging-owner, test user 1 (nameb56175), mahmoud.mmohamedsamy
Method: manual browser + API (retest round 21 Oct)
Developer's note checked: UI part held; the change itself fails.
The modal now asks for "Stage in the new pipeline" (destination stages, first stage by default). Confirming fails: the server validates the stage against the old/default pipeline (422 "not part of the 'Standard Pipeline' pipeline") or returns 200 without moving the deal.
Checked:

- Modal asks for the stage in the new pipeline → "Stage in the new pipeline" — test-01, test-02 for "Test-Pipeline copy"; defaults to first stage with a hint [PASS]

- Deal ends on a stage of its new pipeline → PATCH pipeline=Test-Pipeline copy + stage=test-02 → 422 "Stage 'test-02' is not part of the 'Standard Pipeline' pipeline"; deal stays on Standard Pipeline / value_proposition [FAIL]

- Same on the Standard layout → PATCH → 200 but stored pipeline stays Standard (see NDC-1302) [FAIL]
Still failing:

- Step 2–4: expected deal moved to the new pipeline at the chosen stage; actual 422 / pipeline unchanged.
Evidence: NDC-1312-retest-FAIL.png
- 2026-10-26T09:15 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: Dialog part held; the move cannot be verified (Pipeline field blocker).
Change pipeline dialog asks "Stage in the new pipeline" (keeps current stage when it exists). Confirm → 422 "Pipeline … is not one of the allowed values (Standard (Standard))" toast with raw id; deal unchanged — caused by the staging Pipeline field config.
Checked:

- Dialog asks for the stage in the new pipeline → "Stage in the new pipeline: qualification — The deal keeps its current stage — the new pipeline has it too." [PASS]

- Change pipeline → deal moves at the chosen stage → PATCH 422 "Pipeline: '640e03a4-…' is not one of the allowed values (Standard (Standard))."; deal stays Standard / qualification [BLOCKED]

- Cause → Staging Pipeline field allows only "Standard (Standard)" — not judgeable on staging now [INFO]
Still failing:

- Blocked by staging Pipeline field config (see NDC-1302).
Moved to Bug (QA lead decision, 26 Oct): the fix cannot be confirmed on staging. The Deals "pipeline" field is a pick list that allows only "Standard (Standard)" (changed 24 Oct 15:54 UTC by ndc-staging-owner), so no deal can be created or moved with any pipeline in the UI or the API. Please restore the field (pipeline lookup with all pipelines of the layout) and move this ticket back to Ready For Test.
Evidence: NDC-1312-retest-BLOCKED.png
- 2026-10-26T13:17 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
The "Change pipeline?" dialog now asks for the stage in the new pipeline and keeps the current stage when the new pipeline has it. Saving fails: Change pipeline sends a PATCH that answers 422 "Invalid value for: Pipeline", no message is shown, and the deal stays in "Standard". The API gives the same 422 (26 Oct). Same root cause as NDC-2621.
Environment: staging-crm.taviportal.com, owner account. Automation: PipelineTest#moveDealByEdit.
Annotated TAVI-vs-Zoho image attached: NDC-1312-retest.png