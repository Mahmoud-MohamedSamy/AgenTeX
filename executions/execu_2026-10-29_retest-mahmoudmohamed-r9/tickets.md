# Round 9 tickets (29 Oct 2026)


---
## NDC-2412 · urgent · Access Control
**Hierarchy Preference | Role mode: higher-ranked users can't see lower-ranked users' records**

Summary
With Hierarchy Preference set to Role-based and Leads set to Hierarchy visibility, a Supervisor or Manager cannot open the leads of a lower-ranked User, even in the same department. Each user only sees their own records, so the role hierarchy has no effect.
Steps to reproduce
Company Settings → Hierarchy Preference: Role-based is selected.

Modules → Leads → permissions: Record visibility = Hierarchy (the current setting).

Use two users without the "view all records" permission: user A with profile Supervisor (rank 300) in org unit Sales, user B with profile User (rank 100) in Sales. (CRM Admin, Owner, "test" and Desk Administrator have view-all and see everything, so they can't be used.)

User B creates a lead (or an admin creates one with Lead Owner = user B).

Sign in as user A and open user B's lead.

Repeat with user A on profile Manager (rank 500, the parent profile of User), and with user A in another department (HR).

Expected result
User A sees user B's leads. The tab says "Visibility follows the profile rank hierarchy", the Live preview says "A Manager sees every User in the tenant, regardless of who they report to", and the Hierarchy visibility hint says "Users see their own records and those of lower-ranked users in their department." In Zoho CRM, users in a superior role see the records of the roles below them.
Actual result
User A gets "Record not found / Permission denied." (403) on user B's leads in every case: Supervisor in the same department, Manager in the same department, Supervisor in another department. User A still opens their own lead (200), and user B still can't see user A's lead (correct).
Request
GET /api/v1/modules/{leads}/records/{userB-lead-id}   (as user A)Response
403  (owner-set lead and lead created by user B)
own lead → 200Evidence
Annotated image HP-01-role-superior-vs-zoho.png (TAVI results vs Zoho roles) is attached.
Environment
staging-crm.taviportal.com (tenant NDC-Staging), API + web app, 21 Oct 2026. Users valafo4080 (temporarily on Supervisor / Manager profiles, then set back to "test") and nameb56175 (User, Sales).
Additional notes
Reporting-based mode has the same problem (NDC-2413). Together they mean switching the mode changes nothing users can see. Gaps for this feature: NDC-2417.

Found by automated tests I3, I3b, I4 (feature crmhierarchy in the QA repository). Report: executions/execu_2026-10-21_crm-hierarchy-preference/report.md (HP-01).

### Comments (2)
- 2026-10-25T16:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retested 25 Oct 2026 (CRM go-live Wave 1) — still fails. Role mode: a Supervisor and a Manager in the same department, and a Manager in another department, still do not see a User's leads (tests I3, I3b, I4). Controls pass: users see their own leads and not their peers'. Automation: crmhierarchy VisibilityTest.
- 2026-10-27T13:10 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 26–27 Oct 2026
Environment: staging-crm.taviportal.com, NDC-Staging; account: CRM Admin (test users 1/2 where noted)
Method: Manual browser (Edge headless) + API
Against the expected rule given by the user on 27 Oct (same profile never; higher rank sees lower ranks in the SAME org unit only; other org units never; owner sees all): 7 cases follow it (I2, I2b, I1/I5, I3b, I7, I4, I8); 2 do not — I3 a Supervisor does not see a User's leads in the same org unit, and I4b a Manager in another org unit DOES see a User's leads. Visibility follows the profile parent tree tenant-wide, ignoring org unit and rank.
Checked:

- Manager (500) sees User (100) leads, same dept → Owner-set and self-created leads visible [PASS]

- Supervisor (300) sees User (100) leads, same dept → Not visible (owner-set false, N-created false) [FAIL]

- Superior in another department → Supervisor @HR does not see User @Sales lead [FAIL]

- Controls → All correct [PASS]

- Since 25 Oct (FAIL) → Manager same dept now works; Supervisor and other-dept cases still fail [INFO]

- Rerun 27 Oct (auto-run6) → Same result: Manager same dept PASS; Supervisor same dept and other dept FAIL; controls PASS [INFO]
Still failing:

- I3: Supervisor (300) does not see a lower-ranked User (100)'s leads in the same org unit.

- I4b: Manager (500) in another org unit (HR) sees a User's leads in Sales.
Evidence: NDC-2412-retest-PARTIAL.png (attached)

---
## NDC-2701 · high · Access Control
**Hierarchy | In role mode, a Manager in another department can see a user's leads**

Summary
Possible data leak. In the default "role" hierarchy mode, a user with the Manager profile in the HR department, without "view all records", can open leads owned by a user in the Sales department. Managers should only see records of their own part of the hierarchy, so staff can see customers of other departments.
Steps to Reproduce
Keep the hierarchy mode on Role.

As a Sales user with the built-in User profile, create a lead.

Sign in as a user with the Manager profile in the HR department (no records view-all permission, not above the Sales user in the role hierarchy).

Open the lead (by link or GET /api/v1/modules/{leads}/records/{id}) and look at the Leads list.

Expected Result
The HR Manager can't open the Sales user's lead (403 / "no access") and doesn't see it in lists, as Zoho's role hierarchy does: a role sees only its own and its subordinates' records unless sharing gives more.

Actual Result
The HR Manager can read the Sales user's lead.

Seen in two separate runs on the build of 27 Oct.

The opposite case is NDC-2412: a Supervisor in Sales can't see a Sales user's leads. Both point at the role-mode visibility logic.

Environment
Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

Accounts: test user 2 (Manager @ HR) reading a lead of a User @ Sales

Observed: 27 Oct 2026, CRM go-live round 2, Wave 1 (VisibilityTest I4b), re-verified from scratch.

Related: NDC-2412.

Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2294 · high · Automation Execution Order
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

### Comments (1)
- 2026-10-28T09:37 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
13 items checked by API, automation and the screen: 5 done (1, 2, 10, 11, 13), 2 partly (4, 5), 3 missing (3, 7, 12), 3 not runnable or blocked on staging (6, 8, 9).
Checked:

- Screen → Import wizard › Assign: renamed option and manual approval "Coming soon" (items 1–2). [PASS]

- Screen → Import wizard › Assign: renamed option and manual approval "Coming soon" (items 1–2). [PASS]

- 1 import option → "Trigger automation and process management" — runs workflow, review/approval, blueprint; off by default [PASS]

- 2 manual approval → "Enable manual approval — COMING SOON" (allowed by the ticket); API accepts the flag silently, lead goes live [PASS]

- 3 score / notes triggers → 400 "Unknown trigger kind" [FAIL]

- 4 meeting / call / connected → Call created, related to the record; connected record created (qa_parent = record); Meeting dispatch Cancelled — HTTP 422 [FAIL]

- 5 assign by rule → Rule ran, owner = rule user; online-only + email stored; "transfer related records" NOT stored [FAIL]

- 6 review functions → Field exists in API + editor; needs a custom action — none on staging (not runnable) [INFO]

- 7 Anyone / Everyone → 201 but read back mode null for every mode (users + everyone correctly refused) [FAIL]

- 8 approval Call Function → Needs a custom action — none on staging (not runnable) [INFO]

- 9 blueprint after-actions → API check blocked: POST layout on Leads 500 (staging outage) — not runnable [INFO]

- 10 rejection reasons → Stored on the process (EN/AR, order); org list separate [PASS]

- 11 scheduled actions → Created 15:26:23 → FieldChanged 15:28:32 (delay honoured) [PASS]

- 12 several conditions → Not available [FAIL]

- 13 "trigger": [] → With []: no rule run; without: Fired [PASS]
Still failing:

- Item 3: Record Score / Record Notes triggers — unknown trigger kind (400).

- Item 4: Create Meeting action — rule saves, but at run time the meeting creation fails (HTTP 422, dispatch Cancelled).

- Item 5: Assign Owner by assignment rule — "transfer related records" option is not stored.

- Item 7: "Everyone" (parallel / sequential) for role and group approvers — accepted on save but read back as mode null.

- Item 12: several conditions in one workflow rule — not available.
Evidence: NDC-2294-retest-PARTIAL.png (attached)

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

### Comments (1)
- 2026-10-28T09:37 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
Integration test E8/E9: deleting the linked CRM contact deletes the Desk contact (GET 404), but there is no Desk recycle-bin item and it cannot be restored.
Checked:

- setup → Desk contact removed [INFO]

- E9 Desk contact → 404 [INFO]

- E9 recycle bin → no item for the contact (null) — restore impossible [FAIL]

- restore → n/a — nothing to restore [FAIL]
Still failing:

- Desk contact deleted by the integration is not in the Desk recycle bin (item null) and cannot be restored.
Evidence: NDC-2406-retest-FAIL.png (attached)

---
## NDC-2630 · high · Email Channel
**Email | A failed email send is shown as sent**

Summary
When an email sent from a record fails, the app tells the user it was sent. The screen shows "Sent" and the timeline logs "EmailSent", but the email never left: its status in the API is "failed". The record's Mails tab shows "No emails yet" and no notification follows, so the user has no way to know.
Steps to Reproduce
Open a QA lead that has an email address.

Click Send Email, pick the taviportal.com Zoho Mail connection, write a subject and body, and send.

Look at the toast, the Timeline tab and the Mails tab.

Read the email's status through the API.

Expected Result
When sending fails, the screen says it failed and why, the timeline does not log a sent email, and the email shows as failed on the record so the user can retry. Zoho shows failed emails with a reason on the record.

Actual Result
Toast "Sent"; the timeline logs "EmailSent".

Mails tab: "No emails yet". No notification.

API status "failed": "No Zoho account found for sender 'ndc-staging-owner@taviportal.com' … set the 'zoid' org id on the connection".

The connection itself still reports health "ok" and can_send = true.

Environment
Tenant: NDC-Staging — staging-crm.taviportal.com

Account: ndc-staging-owner (Owner)

Observed: 26 Oct 2026, CRM go-live Wave 4 (case M02). The test email to mahmoud.mmohamedsamy@gmail.com was not received.

Related: NDC-2496, NDC-1479 (the connection's missing Zoho org id is the reason this send failed).

Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-28T09:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
Sent as the owner (taviportal.com sender, Zoho connection without zoid): the send now answers 422 MAIL_SEND_FAILED with the reason, and the Mails list shows the email as "failed" with the error.
Checked:

- pre-check → can_send true, provider zoho — the sender is let through [FAIL]

- send → 422 MAIL_SEND_FAILED "No Zoho account found for sender 'ndc-staging-owner@…'" — no longer "Sent" [PASS]

- record Mails → status "failed", last_error with the reason [PASS]

- timeline → EmailSent, RecordCreated — the failed email is logged as sent [FAIL]

- own account (Gmail) → Compose says "You can't send email yet: no provider is connected for gmail.com…" [INFO]
Still failing:

- The timeline still logs "EmailSent" for the failed email.

- GET /emails/sendability still answers can_send true for this sender, so the screen lets the user try.
Evidence: NDC-2630-retest-PARTIAL.png (attached)

---
## NDC-613 · high · Login History
**User denied both view login history permissions can still export his own login history**

Summary
Denying a user the permissions to view login history does not stop them exporting it. A user whose "View Own Login History" and "View All Login History" permissions have both been denied can still open the Login History screen and download his own login history as a CSV file.
The export is treated as a completely separate permission from viewing, so removing someone's ability to see the data on screen leaves their ability to download the very same data untouched.
The Login History link also still appears in the Settings menu and can be opened, even though the permission it requires has been denied.
Steps to Reproduce
Sign in as an administrator and go to Settings, then Users.

Open a user who is assigned to a profile with all permissions granted.

Deny that user the "View Own Login History" permission and the "View All Login History" permission. Leave everything else as it is.

Save and close.

Sign out, then sign in as that user.

Go to Settings and look at the Security Control section — note that the "Login History" link is still shown.

Click "Login History" to open the page.

Click the Export button and watch what happens.

Open the downloaded file.

Expected Result
A user who is not allowed to view login history should not be able to export it either.

The Export button should not be available to that user, and the export should be refused if attempted.

An export should never contain more than the user is permitted to see on screen.

The "Login History" link should not appear in Settings for a user who lacks permission to view the page.

Actual Result
The "Login History" link is still shown in Settings and the page opens normally.

The Export button works. A CSV file of the login history is downloaded successfully.

The export contains login history data that the user has been explicitly denied permission to view.

No error, warning, or refusal appears at any point.

Denying both view permissions has no effect at all on the user's ability to download the same information.

Suggested enhancement
The cleanest fix is to merge the view and export permissions into a single permission. Exporting login history is simply another way of reading it, so having two separate permissions creates a gap where one can be denied while the other silently remains granted. Combining them means denying access to login history denies it everywhere, with no way for the two settings to fall out of step.
If the two are kept separate instead, then exporting must at minimum require the matching view permission as well, and the exported rows must be limited to what the user is allowed to see on screen.
Environment
App: Anyware CRM — Settings › Security Control › Login History

URL: https://crm.taviportal.com/settings/security/login-history

Affected user: "Test Test" (c4a8e576-37d9-42f8-b138-ccbff54c084f), assigned to the "test" profile

Denied permissions: View Own Login History, View All Login History

Permission still granted: Export Login History

Browser: Microsoft Edge 150.0.7871.187

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: mmohamed (mmohamed@anyware.software)

Captured: 30 July 2026, 08:07 UTC

Attachment
Attachment

### Comments (2)
- 2026-08-21T16:11 e1364b0b-d3cd-4167-8261-6194577a480a: This ticket will be moved to Backlog for now as of 21 Aug
A user with no permission on a specific page in the settings page can't see it when he tries to access the settings page instead of viewing all settings to all users and deny permission on pages that he doesn't have access to
- 2026-10-25T16:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retested 25 Oct 2026 on staging-crm (CRM go-live Wave 1) — passes. A user denied View Own / View Team / View All Login History (user overrides): list → 403, export → 403, and the Login History link is no longer shown in Setup; a direct URL does not open the page. Control: before the denial the same user got 200 for both. State not changed.

---
## NDC-2707 · medium · Blueprint
**Blueprint | A record approved by an approval process doesn't enter its blueprint**

Summary
After an approval process approves a record, the record should continue into the blueprint that matches it. For Tasks, and for leads created by another blueprint's "Create record" after-action, it never enters the blueprint. A lead created on screen does enter its blueprint after approval, so the hand-off works only for some records.
Steps to Reproduce

- On Tasks, set up an approval process and a blueprint that both match a QA task (criteria on the subject).

- Create a matching task; approve it as the approver.

- Check whether the task is now in the blueprint (state / available transitions).

- Repeat with a lead created by a blueprint's "Create record" after-action that matches an approval process and a blueprint on Leads.

Expected Result

- Once approved, the record enters its blueprint, as in Zoho (approval → blueprint).

Actual Result

- The approved task is not in the blueprint (governed = false). Seen 3 of 3 times.

- The lead made by a blueprint after-action runs its workflow and its approval is approved, but it never enters its blueprint (case G-10).

- Control: a lead created on screen enters the blueprint after approval (case I-04).

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: CRM Admin A, Supervisor (approver)

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (cases E2E-5, G-10), re-verified from scratch.

- Automation: automation/…/crmautomationorder/GroupGChainTest (e2e5TaskApproval, g10LeadsMadeByBlueprint)

- Evidence: annotated images attached.

### Comments (0)


---
## NDC-2708 · medium · Approval Process
**Approval Process | The approver sometimes gets "Record not found" on a record waiting for their approval**

Summary
An approver who opens a record that is waiting for their own approval often gets 404 "Record not found." instead of the record and its approval actions. It doesn't happen every time (7 of 10 tries), so approvers sometimes can't act on what they must approve.
Steps to Reproduce

- Set up an approval process on Leads with the Supervisor as approver.

- As another user, create a lead that goes to the Supervisor for approval.

- As the Supervisor, open the record (or read its approval state through the API) right away and again a few times.

Expected Result

- The approver always sees the record and can approve or reject it.

Actual Result

- In 7 of 10 tries the approver got 404 "Record not found."; in the others the record and its approval state opened normally.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: Supervisor (approver), CRM Admin A (submitter)

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (cases WH-08, WH-09, WH-15, WH-16, WH-19), re-verified from scratch.

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2709 · medium · Review Process
**Review Process | Right after a review is approved, the first edit is refused (REVIEW_LOCKED)**

Summary
After a review is approved, the record is still locked for a short time: the first edit right after the approval is refused with 422 REVIEW_LOCKED. Later edits work. A user who edits straight after approving gets an error for no reason.
Steps to Reproduce

- Set up a review process on Leads that holds a QA lead.

- Approve the review.

- Immediately edit the lead (any field), then edit it again a little later.

Expected Result

- Once the review is approved, the record can be edited straight away.

Actual Result

- The first edit right after approval answers 422 REVIEW_LOCKED; later edits succeed. Seen 4 of 4 times.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: CRM Admin A, Supervisor (reviewer)

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (cases B-04, B-06, I-10), re-verified from scratch.

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2705 · medium · Review Process
**Review Process | Import (Excel channel ticked): imported lead is held**

Summary
A review process with the Import (Excel) channel ticked does not hold leads that come in through import. The imported lead goes live straight away and the review queue stays empty. The same process does hold a lead created on screen or through the API. This worked on 18 Oct.
Steps to Reproduce

- Create a review process on Leads with the Import / Excel channel ticked and a criteria that matches the test lead. Activate it.

- Import one lead that matches (Leads › Import, CSV).

- Open the review queue (My Reviews) and the imported lead.

Expected Result

- The imported lead is held for review: it appears in the review queue and its review status is pending until it is approved, as for leads created on screen.

Actual Result

- The imported lead is not held: review status empty, the review queue stays empty.

- Control: a lead created on screen or by API on the same process is held.

- Failed in 3 separate runs on the build of 27 Oct (runs 2, 3, 4); passed on 18 Oct.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: CRM Admin A (process, import)

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (case B-18).

- Automation: automation/…/crmautomationorder/GroupBReviewTest#importedLeadIsHeld

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2538 · medium · Review Process
**Review Process | webhookUrl only sends the reject event and is not signed**

Summary
A review process can have a webhookUrl (API only, no field on screen). It calls the URL only when a review is rejected; nothing is sent when a record is submitted or approved. The request has a timestamp header but no signature, so the receiver cannot prove it came from TAVI. Zoho's review process has no webhook, so this is judged against TAVI's own design: the payload carries an "event" field, which implies several events.
Steps to reproduce

- POST /api/v1/workflow/review-processes with webhookUrl = a request catcher, on Leads, Manual channel, reviewed field Email. Activate it.

- As a user, create a lead → it waits for review. Check the catcher.

- As the reviewer, approve it. Check the catcher.

- Create a second lead and reject it. Check the catcher.

Expected result

- One event each for submitted, approved and rejected (or whichever events are designed, documented).

- A signature header (for example an HMAC of the body with a per-process secret).

Actual result

- Submitted: nothing. Approved: nothing.

- Rejected: one POST with x-anyware-event: review.rejected and x-anyware-timestamp, and no signature.

Request
POST /api/v1/workflow/review-processes {"webhookUrl":"https://webhook.site/…", …} → 201.
Response
Request received (case WH-12): {"event":"review.rejected","processName":"QA AEO V7 WH-12 RP","recordId":"aa752eb8…","rejectedFields":[{"fieldKey":"email","reasonLabel":"Invalid Entry",…}]}.
Evidence
Image attached.
Environment
staging-crm.taviportal.com, API, 25 October 2026, CRM Admin account.
Additional notes

- The webhookUrl has no internal-address check either (see NDC-2537).

- Possibly unfinished: there is no field for it on the review process screen.

### Comments (0)


---
## NDC-2706 · medium · Workflow Rules
**Workflow Rules | After a review approval, the On Edit workflow doesn't run for a mass-updated lead**

Summary
When a lead changed by Mass Update is held by a review process, approving the review releases the lead but the On Edit workflow rule that should run on it does not run. The lead goes straight on into its blueprint. It happened in 3 of 4 runs from scratch, so it doesn't happen every time.
Steps to Reproduce

- Set up on Leads: a review process that holds edited leads matching a QA criteria, an On Edit workflow rule that writes a marker field, and a blueprint for the same leads.

- Mass-update a matching QA lead.

- Approve its review.

- Check the lead's marker field and the workflow execution log.

Expected Result

- After the review is approved, the On Edit workflow runs (marker set, execution logged), then the record continues to its blueprint — the order Zoho documents for review → workflow → blueprint.

Actual Result

- No workflow run is logged (wfFired = 0) and the marker is not set; the lead enters the blueprint directly.

- Seen in 3 of 4 runs from scratch on the build of 27 Oct. Other entry points (create on screen, API, import) ran the workflow after approval in the same runs.

- It also failed on 18 Oct and was never filed.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: CRM Admin A, Supervisor (reviewer)

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (case G-07).

- Automation: automation/…/crmautomationorder/GroupGChainTest#g07LeadsMassUpdate

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2703 · medium · Modules & Fields
**Record Locking | Lock rules are saved but records are not locked, and any text is accepted as a condition**

Summary
Record locking gives no protection. A lock rule can be saved and switched on, but records that match it can still be edited. The rule also accepts any free text as its condition.
Steps to Reproduce

- Create a record-lock rule on Leads whose condition matches a test lead, and switch it on (through the API the settings tab uses; the tab itself still says "In Development").

- As CRM Admin A (or the owner), edit the matching lead.

- Create another rule whose condition is random text.

Expected Result

- Editing a locked record is refused for users the lock applies to, as Zoho's record locking does.

- A rule with a condition that can't be understood is refused when saved.

Actual Result

- The matching lead was edited successfully (200) by CRM Admin A and by the owner.

- A rule with random text as its condition saves without error.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: owner, CRM Admin A

- Observed: 27 Oct 2026, CRM go-live round 2, Wave 2 (R26). Test rules and leads deleted afterwards.

- Automation: automation/…/crmrecords/Round2RecordsTest

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-492 · medium · Modules & Fields
**Tab Order options in the section settings menu do not work**

Summary
In the layout editor, each section's settings menu has a "Tab Order" group with two options, "Left to Right" and "Top to Bottom". Neither option works. Clicking either one does not change which option is marked as chosen, and the order of the fields in the section is unaffected. The options look like normal, active menu items — normal text with a normal hover highlight — so there is nothing to indicate they are unavailable or that the click was ignored. Both options were clicked repeatedly during the recording with no effect either time.
Steps to Reproduce
Go to Settings and open Modules and Fields.

Open a module, then open one of its layouts for editing.

Hover over a section and click the small gear icon on it — a menu opens showing a "Tab Order" group with "Left to Right" and "Top to Bottom".

Note which of the two is currently marked as chosen.

Click the other one.

Watch whether the marked option changes, and whether the order of the fields in the section changes.

Repeat a few times, clicking back and forth between the two options.

Expected Result
Clicking a Tab Order option should select it and mark it as the chosen one.

The order of the fields in the section should update to match the choice.

The choice should still be there when the menu is reopened, and should be kept when the layout is saved.

Actual Result
Clicking either option does nothing — the marked option never changes, no matter how many times either is clicked.

The order of the fields in the section is unaffected.

No message or feedback of any kind appears to explain why nothing happened.

The options look exactly like any other working menu item, with normal text and a normal hover highlight, so nothing signals that they are unavailable.

Environment
App: Anyware CRM — layout editor, section settings menu

URL: https://crm.taviportal.com

Browser: Microsoft Edge 150.0.7871.129

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 900

Reporter: mmohamed (mmohamed@anyware.software)

Captured: 26 July 2026, 09:23 UTC

Attachment
Attachment

### Comments (1)
- 2026-07-29T16:35 9529016b-e67d-42b9-815c-263f673b8252: Fixed — two layers: the menu buttons had no click handler at all (the checkmark was hardcoded on "Left to Right"), and even wired, the backend's typed layout parser silently dropped an unknown tab_order key on save. Now: the choice is a real, undoable layout-builder edit; the checkmark reflects the stored value; it persists round-trip (server DTO carries tab_order); and the record form applies it — "Top to Bottom" tabs down each column first, "Left to Right" tabs across rows — implemented via DOM order (accessibility-correct, no tabindex hacks), visual columns unchanged.
Default for sections that never chose = Left to Right (matches the checkmark the menu always displayed; owner-confirmed 2026-07-29).
Commits: metadata-engine e8d5473, client-engine 7f2acf6b. Needs ME + web rebuild.

---
## NDC-2712 · medium · Web Forms
**Web Forms | The spam trap field is ignored: a filled trap still creates a lead**

Summary
Web forms have a hidden "Leave this field empty" field meant to catch spam bots. When a submission arrives the way the embedded form sends it (page_origin: null), a filled-in trap is ignored and the submission still becomes a lead. With page_origin set, the trap works.
Steps to Reproduce

- Build a QA web form on Leads and embed it in a test page.

- Fill the hidden trap field (e.g. with the browser's developer tools) and the normal fields, then submit.

- Look for the new lead.

Expected Result

- A submission with the trap filled is dropped (no lead), as Zoho's web-form spam protection does.

Actual Result

- The lead is created. Seen 5 of 5 times: 3 browser submissions (leads "QA R2W4 Spam", "Spam 2", "Spam 3") and 2 API calls, all deleted afterwards.

- When the request carries page_origin, the trap works.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: owner (form set-up); public submissions

- Observed: 27 Oct 2026, CRM go-live round 2, Wave 4 (web forms).

- Automation: automation/…/crmchannels/R2W4ChannelsTest#webFormSpamTrapRefused

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2655 · medium · SLA & Business Hours
**Business Hours | The saved business hours can't be saved again (400), even unchanged**

Summary
The tenant's business hours are stored in a state the app's own check refuses. The record says "24×7" but also holds working hours 09:00–17:00. Saving it again, even without any change, answers 400, so nobody can save business hours until the stored record is fixed.
Steps to Reproduce

- Open Settings › Company › Business Hours (or read the business-hours setting through the API).

- Without changing anything, click Save (or send the same body back with PUT).

Expected Result

- An unchanged save succeeds. A 24×7 setting should not store working hours at all, so the stored record and the check agree.

Actual Result

- The stored record: preset 24_7, timing mode "same", hours 09:00–17:00, Africa/Cairo.

- Saving it unchanged answers 400 business_hours.invalid_timing_mode.

- The check itself works: switching Sunday off is refused with "24_7 requires all 7 days".

- Likely cause: on 26 Oct the tenant was switched to 09:00–17:00 and later back to 24×7; switching back kept the hours.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: ndc-staging-owner (Owner)

- Observed: 27 Oct 2026, CRM go-live tenant-wide window (step 1b). Nothing was changed.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-27T13:10 e1364b0b-d3cd-4167-8261-6194577a480a: Evidence 27 Oct 2026
Found in the CRM go-live tenant-wide window on the build of 27 Oct (staging-crm.taviportal.com). The annotated TAVI-vs-Zoho image BH-resave-candidate.png is attached: TAVI on the left, Zoho on the right, with the same box number on both sides for each behaviour. Zoho rows that could not be checked without saving in Zoho say "Not checked live".

---
## NDC-2656 · medium · Access Control
**Users | The owner can choose a lower profile for themselves with no warning**

Summary
On the owner's own user record, picking a lower profile such as "User" enables the Assign button without any warning. If the owner confirms, they would lose owner rights, and the Owner profile can't be given to any other account (409 OWNER_PROFILE_LOCKED), so nobody could give it back.
Steps to Reproduce

- Sign in as the owner. Open Settings › Users › your own user.

- In Profile, choose "User (rank 100)".

- Look at the Assign button and any message. (Do not click Assign.)

Expected Result

- The owner can't remove their own owner rights, or gets a clear warning that explains the result and asks to confirm. Zoho doesn't let the super admin change their own profile.

Actual Result

- Assign is enabled and no warning is shown.

- Giving the Owner profile to another account is refused (409 OWNER_PROFILE_LOCKED), so the change could not be undone.

- Assign was not clicked in the test.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: ndc-staging-owner (Owner)

- Observed: 27 Oct 2026, CRM go-live Wave 1 leftover US-08. Nothing was changed.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-27T13:10 e1364b0b-d3cd-4167-8261-6194577a480a: Evidence 27 Oct 2026
Found in the CRM go-live tenant-wide window on the build of 27 Oct (staging-crm.taviportal.com). The annotated TAVI-vs-Zoho image W1-US08-observation.png is attached: TAVI on the left, Zoho on the right, with the same box number on both sides for each behaviour. Zoho rows that could not be checked without saving in Zoho say "Not checked live".

---
## NDC-2414 · medium · Access Control
**Profiles | The Desk Administrator profile gives view-all on CRM records**

Summary
The Desk Administrator profile (a Desk app profile) includes the permission metadata.records.view_all. A CRM user who also holds Desk Administrator therefore sees every CRM record, and the CRM profile and hierarchy rules never apply to them.
Steps to reproduce

- Settings → Users: pick a user whose CRM profile is Supervisor and who also has Desk Administrator (e.g. mahmoud.mmohamedsamy).

- Sign in as that user and open Leads (record visibility = Hierarchy).

- Compare with a user who has only the CRM Supervisor profile.

Expected result
A Desk profile does not change CRM record access. The user sees CRM records according to their CRM profile and the hierarchy, like a Supervisor without Desk Administrator. In Zoho, profiles are per product; a Zoho Desk profile does not affect Zoho CRM data sharing.
Actual result
The user sees all 10,848 leads. The CRM Supervisor profile alone does not have view-all; it comes from Desk Administrator (app desk).
Request
GET /api/v1/iam/profiles/{desk-administrator-id}/permissions   (as owner)
GET /api/v1/iam/me/permissions                                 (as the Supervisor + Desk Administrator user)Response
Desk Administrator (appKey desk) → contains "metadata.records.view_all"
user permissions                 → contains "metadata.records.view_all"
CRM Supervisor profile           → does not contain itEvidence
Annotated image HP-03-05-permissions.png (API results, left panel) is attached.
Environment
staging-crm.taviportal.com (tenant NDC-Staging), API, 21 Oct 2026.
Additional notes

- Profiles that grant metadata.records.view_all today: CRM Admin, Owner, "test" and Desk Administrator.

- Found by automated test E7d (feature crmhierarchy). Report: executions/execu_2026-10-21_crm-hierarchy-preference/report.md (HP-03).

### Comments (2)
- 2026-10-25T16:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retested 25 Oct 2026 (CRM go-live Wave 1) — still fails. A Supervisor who also holds the Desk Administrator profile still gets CRM metadata.records.view_all, so the CRM hierarchy does not apply to them (test E7d).
- 2026-10-27T09:58 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 26–27 Oct 2026
Environment: staging-crm.taviportal.com, NDC-Staging; account: CRM Admin (test users 1/2 where noted)
Method: Automation (TestNG suites crmaccess / crmhierarchy / crmautomationorder / crmrecords) + API
HierarchyApiTest.deskProfileGrantsCrmViewAll: a CRM Supervisor who also has the Desk Administrator profile still gets view-all on CRM records.
Checked:

- Desk profile does not change CRM access → Desk Administrator (app desk) grants metadata.records.view_all; the CRM Supervisor holding it has view_all = true [FAIL]

- Profiles with view_all → CRM Admin, Desk Administrator, Owner, test [FAIL]

- Effect → Hierarchy does not apply to a Supervisor who also has a Desk profile [FAIL]

- Since 25 Oct → Unchanged (FAIL) [INFO]

- Rerun 27 Oct (auto-run6) → Same result: deskProfileGrantsCrmViewAll FAIL [FAIL]
Still failing:

- The Desk Administrator profile still grants CRM records.view_all.
Evidence: NDC-2414-retest-FAIL.png (attached)

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

### Comments (1)
- 2026-10-28T09:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest NOT RUNNABLE ON STAGING — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
Rollup set up on a QA module (record shows 12). The report query answers 503 "Permission service is temporarily unavailable" since ~19:00 UTC — retest when reporting recovers.
Checked:

- rollup → qa_rollup = 12 on the record [PASS]

- report query → 503 permission_service_degraded "Permission service is temporarily unavailable." (since ~19:00 UTC) — not runnable [FAIL]
Moved to Bug (QA decision): this part could not be run on staging (see above); please move it back to Ready For Test once staging storage / reporting is healthy.
Evidence: NDC-2647-retest-BLOCKED.png (attached)

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

### Comments (1)
- 2026-10-28T09:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest NOT RUNNABLE ON STAGING — 27–28 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, NDC-Staging, Edge (headless) + API; accounts: CRM Admin, test user 1, owner account through the automation
Deletion part PASS: timeline has RecordCreated, FieldChanged, NoteAdded, RecordDeleted, RecordRestored (TimelineTest). Attachment add / remove could not be tested: file uploads fail on staging (PUT /s3/… 500).
Checked:

- Screen → Files tab: every upload fails on staging (storage PUT 500). [FAIL]

- Screen → Files tab: every upload fails on staging (storage PUT 500). [INFO]

- deletion (automation) → RecordCreated, FieldChanged:company, NoteAdded, RecordDeleted, RecordRestored [PASS]

- attachments → POST /files 201 → PUT /s3/anyware-files/… 500 ("Couldn't upload … Please try again.") — not runnable on staging [FAIL]
Moved to Bug (QA decision): this part could not be run on staging (see above); please move it back to Ready For Test once staging storage / reporting is healthy.
Evidence: NDC-2624-retest-BLOCKED.png (attached)

---
## NDC-1950 · medium · Work Queue
**My Requests & Work Queue | Split approval and review items into separate tabs**

Summary
Approval and review items should be split into clear tabs on the My Requests page, which shows what the logged-in user submitted — records they own that are waiting for someone else. Three tabs: Pending Approval, Pending Review and History. Work Queue, which shows what is waiting on them, is already implemented and is included below for reference only.
Requirements
My Requests
Pending Approval tab: records owned by the logged-in user that are currently in an approval process and waiting for a decision.

Pending Review tab: records owned by the logged-in user that are currently in a review process and waiting for a reviewer.

Columns. Pending Approval: Record (link to the record), Module, Approval process, Stage / Level, Current approver(s), Submitted on, Status. Pending Review: Record, Module, Review process, Reviewer(s), Sent for review on, Status.

This page is read-only for the owner. Status is the last column — there is no Action column and no Approve, Reject, Delegate or Review control anywhere on My Requests.

History tab: every record visible to the logged-in user (see requirement 21) that has ever entered an approval or review process — in flight, finished or abandoned. A superset of the Pending Approval and Pending Review tabs, which show only what is currently open. Read-only, consistent with requirement 4.

One row per cycle, not per record. A record rejected and resubmitted twice appears as three rows, each with its own attempt number, outcome, dates and reason. This is required by NDC-1245 (US-D1), which keeps rejected records resubmittable until approved — without per-cycle rows the history of a resubmitted record cannot be read.

History columns: Record (link), Module, Type (Approval / Review), Process, Attempt, Status, Submitted on, Decided on, Decided by, Reason / comment, Time in process. When the viewer can see more than their own records, Submitted by (owner) is also a column.

History filters
Module — all modules the user has records in.

Type — All / Approval / Review.

Process — the specific approval or review process.

Status — see the status values below.

Date — carries a date-type selector, Submitted on or Decided on, then a range with presets (Today, Last 7 days, Last 30 days, Custom). Filtering by one gives very different results from the other, so the selector is not optional.

Submitted by — permission-scoped. A user with no subordinates does not get this filter. A user with subordinates can pick themselves or any of their subordinates, and nobody else. The Tenant Owner can pick any user.

Decided by — Tenant Owner only. No other user gets this filter.

Attempt — First attempt / Resubmission, to separate clean approvals from records that bounced.

SLA — Within SLA / Breached / Escalated. The review API already carries slaDueAt, slaRemainingSeconds and isEscalated.

Search on record name.

Export to CSV, respecting the active filters and the viewer's visibility scope. History exists for audit and reporting, which a paginated grid alone does not serve. Default sort is most recent first.

Status values
Approval: Pending approval, Approved, Rejected, Recalled, Cancelled, Delegated.

Review: Submitted, Pending for review, In review, Pending for re-review, Escalated, Approved, Rejected.

Each History row links to both the record and the decision detail, so the rejection reason is reachable from the row. This is precisely what NDC-1848 and NDC-1849 found missing for the submitter today.

Behaviour
Each tab shows a count of its records, and the count updates when an item is acted on. Each pending tab has Module and Process filters plus a search. Each tab shows an empty state when there is nothing in it, e.g. "No records pending approval", "No history yet".

A record leaves a pending tab as soon as it's approved, rejected, reviewed, recalled or delegated away. It does not leave History — the History row remains, now showing the outcome.

Visibility — three tiers.
Regular user: sees only the records they own. No Submitted by filter, no Decided by filter.

User with subordinates: sees their own records and their subordinates' records. Gets the Submitted by filter, listing themselves and their subordinates only. No Decided by filter.

Tenant Owner: sees the full history across all users. Can filter Submitted by to any user, and is the only user who gets the Decided by filter.

A filter a user does not qualify for is hidden entirely, not disabled. The Pending Approval and Pending Review tabs remain strictly own-records-only for every tier; the hierarchy applies to History.

Deleted records keep their history. When the underlying record is deleted, its History rows remain for audit. The record name is no longer a link — it cannot be navigated to — and carries a DELETED mark so the row is readable but clearly flagged. All other columns on the row keep their values.

Work Queue — already implemented, for reference
Awaiting My Approval tab: records where the logged-in user is a current approver, including approvals delegated to them. A delegated item shows "Delegated to you by [Name]".

Awaiting My Review tab: records where the logged-in user is the assigned reviewer.

Each row has a Respond action. On the approval tab it offers Approve, Reject and Delegate; on the review tab it offers the review actions.

Columns: Record, Module, Process, Stage / Level, Requested by (owner), Received on, Action.

Dependency — blocking
The subordinate hierarchy needs a working manager relationship, and there isn't one today. NDC-856 is still open in Bug state: an approval process with "Assign to the submitter's manager" ticked assigns no approvers, because the submitter's manager cannot be resolved. The comment on NDC-892 makes the same point from the other side — Reporting Manager cannot be set on a user at all.

Until a manager or org-unit relationship can be set and read, the middle tier of requirement 21 has no data source and will behave exactly like the regular-user tier. This

### Comments (0)


---
## NDC-1823 · medium · Lead Conversion
**Lead Conversion | "Create a new Deal for this Contacts": Probability and Expected Revenue offered as editable fields**

Summary
When converting a lead and choosing to create a new deal, the deal form lets the user type in Probability and Expected Revenue. These values are calculated by the system from the deal's Stage and Amount, so whatever the user types is thrown away and replaced when the deal is created. The fields should be read-only on this form.
Steps to Reproduce
Go to Leads and open a lead (e.g. lead02).

Click Convert.

Choose the records to create, and tick "Create a new Deals for this Contacts."

Fill in the deal form — for example Stage = Qualification, Amount = 10,000.

Notice that Probability and Expected Revenue can be edited; type 500 in Probability and 10,000 in Expected Revenue.

Click Convert, then open the new deal from the confirmation screen.

Look at Probability and Expected Revenue on the deal.

Expected Result
In the conversion form, Probability and Expected Revenue are read-only and filled in automatically from Stage and Amount, the same as on the Deal form.

The user cannot type values that won't be saved.

Actual Result
Both fields can be edited in the conversion form, and it even accepts a probability of 500%.

After converting, the deal shows Probability 10 and Expected Revenue 1,000 instead of the values typed, with no message telling the user their input was replaced.

Environment
App: TAVI CRM — crm.taviportal.com (Leads → lead record → Convert)

Browser: Edge 153.0.8010.53

OS: Windows 10

User: ndc-staging-owner

Captured: 24 Sep 2026, 15:59 (Cairo time)

Attachment
Attachment

### Comments (2)
- 2026-10-27T08:39 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PASS — 26–27 Oct 2026
Environment: staging-crm.taviportal.com, NDC-Staging; account: CRM Admin (test users 1/2 where noted)
Method: Manual browser (Edge headless) + API
Convert › Create a new Deal: Probability and Expected Revenue locked (read-only); Stage + Amount fill them in (10, 1000).
Checked:

- Create a new Deal in the conversion form → Deal (Transactions) section shown when ticked [INFO]

- Probability and Expected Revenue read-only → Both show a lock, greyed; typing ignored [PASS]

- Auto-filled from Stage and Amount → Qualification + 10000 → Probability 10, Expected Revenue 1000 [PASS]

- Conversion → Not converted (form check only); QA lead 2acfe5f8 left for cleanup [INFO]
Evidence: NDC-1823-retest-PASS.png (attached)
- 2026-10-27T21:03 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 27 Oct 2026 — still fails, reopened
On the Convert page, the deal fields that Zoho locks during conversion — Probability (%), Expected Revenue and the three duration fields (Lead Conversion Time, Sales Cycle Duration, Overall Sales Duration) — can still be edited. The deal form also took about 25 seconds to appear. Moved from Done back to Bug.
Environment: staging-crm.taviportal.com, build of 27 Oct (index-De3hTVb3.js), owner and CRM Admin A; CRM go-live round 2.
Annotated TAVI-vs-Zoho image attached: NDC-1823-retest.png

---
## NDC-1343 · medium · Audit Log
**Audit Log | Most entities are either not logged at all or log only some of their events**

Summary
Across the entities the Audit Log claims to cover, some record nothing at all and others record only certain events.
In the visible history every entry is a login or a logout — no record creation or modification, no configuration changes, no permission or field changes — despite substantial work in this tenant today. Even sessions are partly covered: several logout entries appear without the user who performed them.
The page describes itself as "A chronological record of actions taken across your workspace", which is not what it holds.
Steps to Reproduce
Perform a range of actions in the tenant — create or edit a record, change a layout, alter a field permission, create or delete an automation rule.

Go to Settings › Security Control › Audit Log.

Leave the filters at All Entities, All Users, All Actions, Any time.

Scroll the full history and look for any entry that is not a login or a logout.

Open the All Entities filter and note which entity types are offered.

Select each entity type in turn and check whether it returns any entries.

Look at the logout entries and note which of them name a user.

Expected Result
Every entity the log covers should record every event it should record. An entity should not be silently absent, and should not log some of its events while omitting others.

Every entry should name the user who performed the action.

Actual Result
Most entities record nothing. No record creation or modification, no configuration changes, no permission or field changes appear anywhere in the visible history.

Where an entity does log, its coverage is partial. Sessions are recorded, but several logout entries read "logged out a Session" with no user named — so even the one entity that does appear is logged inconsistently.

The visible history, from 2:09 PM back to 1:48 PM, contains logins and logouts only.

The log therefore does not reflect what has happened in the workspace.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Security Control › Audit Log

URL: https://crm.taviportal.com/settings/security/audit-log

Filters applied: All Entities · All Users · All Actions · Any time

Visible history: 2:09 PM back to 1:48 PM, logins and logouts only

Browser: Microsoft Edge 152.0.7977.65

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 2 September 2026, 13:10 UTC

Attachment
Attachment

### Comments (3)
- 2026-09-08T16:02 e1364b0b-d3cd-4167-8261-6194577a480a: Retest of NDC-1343 Failed
Audit Log has stopped logging events.
- 2026-10-21T11:38 00a20184-a95d-4ad8-a9d9-6273a8ba704f: Retest on staging-crm, 2026-10-21: STILL REPRODUCES → back to Bug. Between 08:22 and 08:37Z: created/updated a task, created a teamspace, changed its ACL 3×, deleted both, logged in/out. GET /audit/events since 2026-10-20 21:43Z returns only 3 Desk purge rows — no CRM, metadata, IAM or workflow events at all (not even logins). Newest non-Desk event is 2026-10-20 21:42.
Likely cause: audit ingestion for everything except Desk is stalled on staging (consumer / Kafka), not missing code — the fixes are on staging (metadata-engine 73b8a60, workflow 80596fc, audit fe98fdf, IAM 391eb10). Needs an infra check of the audit consumers, then a retest.
- 2026-10-25T16:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retested 25 Oct 2026 (CRM go-live Wave 1) — passes for everything tested. Logged: record create / update / delete, profile created, field permission changed, user permission override set, org unit created. In the newest 200 sign-in events, every sign-out names the user. Not checked one by one: every other entity type in the list. State not changed.

---
## NDC-2710 · low · Approval Process
**Approval Process | The approval view offers Approve to a user whose approve is then refused**

Summary
The approval view tells a user they can approve a record (canApprove = true), but when they press Approve it is refused with 403 because their profile lacks the approval permission (workflow:approval:act). The screen offers an action the user isn't allowed to take.
Steps to Reproduce

- Have a record waiting for approval where the user is named as approver but their profile has no approval permission.

- Open the record's approval view as that user, then press Approve.

Expected Result

- The view only offers Approve when the user is allowed to approve (canApprove = false otherwise), or the user gets a clear message why they can't.

Actual Result

- canApprove = true and the Approve action is offered; pressing it answers 403. Seen 3 of 3 times.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Accounts: CRM Admin A, test user 2

- Observed: 27–28 Oct 2026, CRM go-live round 2, Wave 3 (case D-06).

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2711 · low · API & Platform
**Records API | Creating a record on a deleted layout answers 403 "Permission denied" instead of "not found"**

Summary
Creating a record with a layout id that no longer exists answers 403 "Permission denied." That sends the caller looking for a permission problem when the real cause is a missing layout.
Steps to Reproduce

- Delete a layout on Leads (or use a random layout id).

- Send POST /api/v1/modules/{leads}/records with layout_id set to that id, as a user who can create leads.

Expected Result

- A clear "layout not found" (404) or a validation error naming the layout (422).

Actual Result

- 403 "Permission denied." The same user creates leads on an existing layout with 201.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: test user 1

- Observed: 27 Oct 2026, CRM go-live round 2, Wave 3 (layout probe).

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2704 · low · Home Page
**Home | "My Tasks" and "My Meetings Today" show raw column keys**

Summary
On the Home page, the "My Tasks" and "My Meetings Today" cards show column headers as raw field keys instead of field names.
Steps to Reproduce
Sign in and open Home.

Look at the column headers of the "My Tasks" and "My Meetings Today" cards.

Expected Result
Headers show the field names, e.g. "Subject", "Due Date", "Related To", "From", as in Zoho's home components.

Actual Result
Headers read subject, due_date, related_to and from_time.

Environment
Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

Account: CRM Admin A

Observed: 27 Oct 2026, CRM go-live round 2, Wave 2.

Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (0)


---
## NDC-2321 · low · Timeline
**Timeline | Workflow field update and blueprint entry are missing from the record Timeline; assignment shows as "System"**

Summary
A lead that runs an assignment rule, a workflow field update and enters a blueprint shows only part of that on its Timeline. The owner change is shown by "System" with no rule named, and there is no row for the workflow field update or for entering the blueprint. Review and approval events already appear on the Timeline. In Zoho, "The Timeline will display the order each process was executed."
Steps to reproduce
Settings → Assignment Rules: create a rule on Leads, channel Import, assign to user X.

Settings → Workflow Rules: create a rule on Leads, On Create, action Field Update Description = "WF G-16".

Settings → Blueprint: create and activate a blueprint on Leads on the Lead Source field that the imported lead will enter.

Leads → Import: import one lead, choose the rule from step 1 in the Assign step and switch on "Trigger workflow rules".

Open the lead: owner is X, Description is "WF G-16" and the blueprint bar is shown.

Open the lead's Timeline tab.

Expected result
The owner change names the assignment rule that set it.

A row for the workflow rule's field update (rule name, field, new value).

A row for the record entering the blueprint (blueprint name and state).

Rows are in the order the processes ran.

Actual result
Only three rows: RecordCreated, OwnerChanged and FieldChanged (owner).

The owner rows have actor "System" and reference only the user, not the assignment rule.

No row for the Description update and no row for the blueprint entry.

Request
GET /api/v1/timeline/records/leads/4115e483-…/feed
Response
RecordCreated (actor Mahmoud Mohamed); OwnerChanged / FieldChanged owner (actor "System", references: user only). No other rows, while the lead has owner X, description = "WF G-16" and a blueprint state.
Evidence
Side-by-side image (CRM vs Zoho) attached.
Environment
staging-crm.taviportal.com, API, 19 October 2026, CRM Admin account.
Additional notes
Lead 4115e483 (19 Oct); also seen on lead d31541d8 (18 Oct).

Review and approval events do appear on the Timeline, so only assignment, workflow and blueprint are missing.

Zoho source: Approval Process FAQ Q34, https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/approval-process/articles/crm-v2-exist-faqs-on-approval-process

### Comments (0)


---
## NDC-2658 · low · Access Control
**Users | Inviting with no free seat shows the raw key "iam.subscription.seat_limit_reached"**

Summary
When the tenant has no free user seat, inviting a user is refused, but the message is the raw key "iam.subscription.seat_limit_reached" instead of a sentence telling the admin to free or buy a seat.
Steps to Reproduce

- With all seats used, open Settings › Users › Invite and invite any email.

Expected Result

- A clear message, e.g. "All seats are in use. Remove a user or add seats in Billing to invite someone."

Actual Result

- The invite answers 409 SUBSCRIPTION_SEAT_LIMIT_REACHED and the screen shows "iam.subscription.seat_limit_reached".

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: ndc-staging-owner (Owner)

- Observed: 27 Oct 2026, CRM go-live Wave 1 leftover US-13. No invite was created.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-27T13:10 e1364b0b-d3cd-4167-8261-6194577a480a: Evidence 27 Oct 2026
Found in the CRM go-live tenant-wide window on the build of 27 Oct (staging-crm.taviportal.com). The annotated TAVI-vs-Zoho image W1-US13-PS06-blocked.png is attached: TAVI on the left, Zoho on the right, with the same box number on both sides for each behaviour. Zoho rows that could not be checked without saving in Zoho say "Not checked live".

---
## NDC-2657 · low · Access Control
**Permissions | Without access, the Permissions page shows the raw text "Missing required permission 'iam.profile.manage'"**

Summary
A user who may not manage profiles can still open Settings › Permissions by its address. The page shows the raw server text "Missing required permission 'iam.profile.manage'." instead of a normal "no access" page. There is also no view-only permission for profiles, so a read-only view can't be given to anyone.
Steps to Reproduce

- Sign in as a user whose profile doesn't include managing profiles (e.g. test user 1, built-in User profile).

- Open Settings › Permissions by its address (/settings/security/permissions).

Expected Result

- The page is hidden from the menu, and opening it by address shows the app's normal "You don't have access" page.

- Optionally, a view-only permission lets someone see profiles without changing them (Zoho shows profiles read-only to users who can view but not edit).

Actual Result

- The page opens and shows "Missing required permission 'iam.profile.manage'."

- /iam/profiles answers 403. The permission catalogue has only iam.profile.manage, no view-only key.

Environment

- Tenant: NDC-Staging — staging-crm.taviportal.com (build of 27 Oct)

- Account: test user 1 (nameb56175)

- Observed: 27 Oct 2026, CRM go-live Wave 1 leftover PE-06.

- Evidence: annotated TAVI-vs-Zoho image attached.

### Comments (1)
- 2026-10-27T13:10 e1364b0b-d3cd-4167-8261-6194577a480a: Evidence 27 Oct 2026
Found in the CRM go-live tenant-wide window on the build of 27 Oct (staging-crm.taviportal.com). The annotated TAVI-vs-Zoho image W1-PE06-finding.png is attached: TAVI on the left, Zoho on the right, with the same box number on both sides for each behaviour. Zoho rows that could not be checked without saving in Zoho say "Not checked live".