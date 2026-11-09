# Round 10 tickets (2 Nov 2026)


---
## NDC-2412 · urgent · CRM
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

### Comments (3)
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
- 2026-10-29T16:25 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 29 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)
Method: API and screen (the steps of the existing automation, run against the Anyware tenant)
In role mode a higher-ranked user in the same org unit still cannot see a lower-ranked user's leads (Supervisor and Manager @ team1 → 403, not listed; also after 60 s and a fresh sign-in). Other org unit, same rank and lower → higher are correctly hidden; own lead and owner see it.
Checked:

- setting → role / hierarchy; U2 has no records.view_all in any step [INFO]

- C1 Supervisor @team1 → 403 Permission denied; not in the list [FAIL]

- C2 Manager @team1 → 403; not in the list — also after 60 s and after a fresh sign-in (/iam/me = Manager @team1) [FAIL]

- C3 Manager @team2 → 403; not in the list [PASS]

- C4 Supervisor @team2 → 403; not in the list [PASS]

- C5 User @team1 → 403; not in the list [PASS]

- C7 lower → higher → 403 [PASS]

- C8 / C9 controls → 200 / 200 [PASS]

- vs 27 Oct (NDC-Staging) → was visible on NDC-Staging; on Anyware it is not — now no superior sees a lower rank at all [INFO]
Still failing:

- C1 Supervisor @team1: expected Sees the lead (higher rank, same org unit), actual 403 Permission denied; not in the list

- C2 Manager @team1: expected Sees the lead, actual 403; not in the list — also after 60 s and after a fresh sign-in (/iam/me = Manager @team1)
Evidence: NDC-2412-retest-FAIL.png (attached)

---
## NDC-2420 · urgent · CRM
**Blueprint | Workflow rules run after some transitions but not after transitions with required fields**

Summary
On-edit workflow rules run after a blueprint transition that has no during-fields, but not after a transition that has required during-fields. The same rule shape (Status = X AND Status changed) gives a different result depending on the button. Zoho runs no workflow rules after blueprint transitions (docs), so TAVI is inconsistent either way.
Environment: crm.taviportal.com, Education First tenant (moaazdly89+edufirst@gmail.com), module Competition Applications ffb6202e-9ac2-49ba-a335-ef86c542450e, blueprint «إبهار مصر — مراحل الطلب» cda430d9-4c70-42fa-923f-a5a3d2f5fa5c on application_status.
Steps to reproduce
Create a Competition Applications record (category العلوم, status Pending Verification).

Press «قبول التسجيل» (no during-fields) → rule N02 12057f81… (Status = Registration Approved AND changed) runs: Settings → Execution History shows it as On Edit / Fired.

Save the video link → status moves to Assessment Assigned, owner = Science assessor.

As the assessor, press «اعتماد الفيديو — العلوم» and fill the required Assessment Score + Comments → Execute. Status becomes Assessment Complete.

Wait 1 minute and open Execution History filtered by the record.

Expected: rule «إبهار مصر — نقل الملكية للجنة بعد اعتماد الفيديو» 4e51785b-9efe-4174-97bd-eed125f5c5dd (On edit · Status = Assessment Complete AND Status changed · owner round robin to profile Ebhar — Assessment Lead/Committee) behaves like N02 does after «قبول التسجيل».
Actual: no execution of any rule after the transition; owner stays with the assessor.
Evidence
Reproduced in the UI on 22 Oct 2026 07:59:12 UTC, record EM-00094 (kept): owner still «Pool — العلوم» after 1 min; last rule run 07:58:37.

Also failed on 21 Oct: EM-00065 (pool-science), EM-00066 (pool-math), a probe as the Owner account.

The rule and its action work: with the changed condition removed and another field edited, it fired (21 Oct 15:22:03 UTC) and moved the owner to the Committee user.

Zoho: Troubleshooting Workflows — “Workflow rules do not trigger when the fields are transitioned from a blueprint … Solution: the actions … can be scheduled in the After part of the blueprint.” (docs only, not checked on a live org)

Annotated image: B-EM1-blueprint-transition-workflow-inconsistent.png (attached / dragged in).

Request
Pick one rule for whether workflow rules run after blueprint transitions, apply it to every transition (with or without fields), and document it.

Careful: client flows depend on the current behaviour (Ebhar's N02 portal access runs only because rules fire after «قبول التسجيل»). If transitions stop triggering rules, the blueprint After section needs owner assignment and portal access.

Also check «رفض التسجيل» and «طلب تصحيح الفيديو», which also save fields.

### Comments (3)
- 2026-10-24T12:48 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Root cause: it is the rule's action type, not the transition's fields. A Blueprint transition writes the record outside the normal save path, so the save stage (Field Update, Owner Assignment, tags) never runs for it. The async half then ran only background actions (email, portal access). N02 worked because its action is SendPortalAccess; the committee rule 4e51785b has only an owner round robin, so it was dropped with no run in Execution History.
Fix: after every Blueprint transition (with or without during-fields), matching rules now also carry out their save actions from the worker; criteria incl. "Status changed" are still checked and the run is recorded. Note: rules that set fields/owners after transitions, which silently did nothing before, will now act.
Status: merged to staging (workflow 8419587). Not yet deployed to crm.taviportal.com.
- 2026-10-25T16:25 9e70b1cd-0507-4ecc-8720-3159b01cb538: Retest 25 Oct 2026 on crm.taviportal.com (Education First tenant): PASS

- UI run, EM-00125: pool-science pressed «اعتماد الفيديو — العلوم» in the browser (score 77 + comments) → Assessment Complete. After 1 min the owner is Pool — التسجيل (Committee profile). Execution History shows «إبهار مصر — نقل الملكية للجنة بعد اعتماد الفيديو» Fired at 14:12 local, Actions run 1. Before the fix there was no entry at all.

- Second run, EM-00124: same transition through the assessor's session → owner pool-registration.

- No regression: N02 (portal access) still runs after «قبول التسجيل»; N04 → category owner → «إسناد التقييم» chain unchanged.
Evidence: NDC-2420-retest-2026-10-25.png (annotated; dialog, record owner, Execution History). Record EM-00125 kept.
- 2026-10-27T13:25 9e70b1cd-0507-4ecc-8720-3159b01cb538: Retest 27 Oct 2026 on crm.taviportal.com (Education First tenant): FAIL. Regression, and wider than the original bug.
After a blueprint transition, no workflow rule runs at all now. It is not only the owner assignment: the background actions are gone too, so the student never gets portal access. Nothing was granted or assigned by hand; we waited 2 min after each button.

- Portal access (N02 12057f81, SendPortalAccess) after «قبول التسجيل»: no run in Execution History and no portal access on EM-00184 and EM-00185. Morning run: 0 of 13 approvals (EM-00165…178). On 25 Oct this worked, and it also worked before the fix.

- Committee hand-over (4e51785b, OwnerAssignment RoleRoundRobin) after «اعتماد الفيديو»: no run. Owner stays the assessor: EM-00185 pool-math, EM-00184 pool-science. Morning run: 0 of 4. On 25 Oct: Fired, owner Pool — التسجيل.

- Still works: rules after a normal save. Saving the video link runs N04 → category owner round robin → «إسناد التقييم» (all Fired).

- Config unchanged: both rules are active, last edited 20 and 21 Oct. The blueprint (cda430d9) was last edited 21 Oct.
Steps: create a Competition Applications record (Pending Verification). The owner reviewer presses «قبول التسجيل», and we wait 2 min. Expected: N02 Fired and portal access created. Actual: nothing in Execution History and no access. Then save submission_link → Assessment Assigned. The assessor presses «اعتماد الفيديو» with a score, and we wait 2 min. Expected: owner → Committee. Actual: owner unchanged, with no run.
Likely area: the worker that runs rules after blueprint transitions (fix 8419587) is no longer running or receiving events. Please check whether a later deploy changed it.
Impact: go-live blocker. Students get no portal login, so they can't submit a video, and the Committee never receives approved applications.
Evidence: NDC-2420-regression-2026-10-27.png (attached, annotated). Records EM-00184 and EM-00185 are kept, plus EM-00165…178 from the morning run.

---
## NDC-2659 · urgent · CRM
**Blueprint | Portal access is not sent automatically after «قبول التسجيل» (N02 never runs after the transition)**

Summary
When a Registration Admin presses «قبول التسجيل», the record moves to Registration Approved. But the workflow rule N02 never runs, so the student gets no portal access and no access email. Access can only be given by pressing Send access by hand. It must be automatic: if it has to be sent by hand, that is a bug. This worked on 21 Oct and 25 Oct. Go-live blocker: without portal access, students can't submit their video.
Environment: crm.taviportal.com, Education First tenant (moaazdly89+edufirst@gmail.com), module Competition Applications ffb6202e-9ac2-49ba-a335-ef86c542450e, blueprint «إبهار مصر — مراحل الطلب» cda430d9-4c70-42fa-923f-a5a3d2f5fa5c, portal «بوابة المتقدمين» 9b21cf61-04cf-4201-8f3c-928247b97384.
Rule: N02 «إبهار مصر — دخول البوابة عند قبول التسجيل» 12057f81-9263-423a-a0dd-261ff5e6d1fa. It is active and unchanged since 20 Oct: On edit · Application Status = Registration Approved AND Application Status changed · action Send portal access.
Steps to reproduce
Create a Competition Applications record (status Pending Verification). The assignment rule gives it to reviewer1 or reviewer2.

As the owner reviewer, press «قبول التسجيل». The status becomes Registration Approved.

Wait 2–4 minutes. Open the record's Customer Portal section, then Settings → Execution History filtered by the record.

Expected: N02 is logged as On Edit · Fired. Portal access is created and the access email is sent automatically, with no manual action.
Actual: no N02 entry at all; the only entries are the On Create rules. Customer Portal shows Not sent with only the manual Send access button, and no email is sent.
Evidence (27 Oct 2026)
EM-00186 «QA N02 REPRO» (kept at Registration Approved, nothing sent by hand), approved 11:52:07 UTC: after 2.5 min the portal access API returns access: null, can_grant: true, and there is no N02 run.

EM-00184 and EM-00185 (11:05 UTC): no access after 2 min, no N02 run.

Morning full E2E: 0 of 13 approvals got portal access (EM-00165…178).

Rules after a normal save still run. Saving the video link triggers N04 → category owner → «إسناد التقييم», all Fired.

Annotated image: N02-portal-access-not-sent-2026-10-27.png (attached).

Likely cause
Same root cause as NDC-2420 (moved back to Bug today). No workflow rule runs after any blueprint transition, so the background worker from fix 8419587 runs nothing. Filed separately because before 27 Oct, N02 ran even without that fix, so this is a new regression with a different user impact: the student can't log in to the portal.
Please also check
The other transitions: «رفض التسجيل» and «طلب تصحيح الفيديو».

That every run is still recorded in Execution History.

### Comments (0)


---
## NDC-2714 · urgent · CRM
**Assignment Rule | Imported record gets no owner after the rule is saved again and shows the importer as owner**

Summary
A Students import that uses an assignment rule should give each new record to a user with the rule's chosen profile. After the rule is opened and saved again, the next import creates the record with no rule owner. The record shows the importer as its owner instead. An import made just before saving the rule assigned the owner correctly.
Steps to reproduce
Go to Settings › Automation › Assignment Rules and open the rule "test" on Students. It applies to Import; its one entry covers All Records and assigns to Category › Profiles › "Ebhar — Registration Admin"; its fallback is a Default user.

Import one student with this rule, then open that record. Its owner is a Registration Admin user (Reviewer 2).

Go back to the rule, open the rule entry, click Save Rule Entry, then click Save.

Go to CRM › Students & Fees › Students and click Import Students.

Upload an Excel file with one student and click Next through the steps.

On the Assign step, tick Assign owner based on assignment rules, choose "test", and click Save & next.

Tick the permission confirmation and click Submit.

Click View records and open the imported student.

Look at the Customer Owner at the top of the record.

Expected result
The record is owned by a user with the "Ebhar — Registration Admin" profile (Reviewer 1 or Reviewer 2).

If no such user can be chosen, the rule's fallback Default user owns the record.

Saving the rule again doesn't change how the next import assigns owners.

The person who ran the import never becomes the owner when a rule is selected.

Actual result
The import finishes with 1 valid row and no warning.

Customer Owner shows the importer (moaazdly89+edufirst), not a Registration Admin user and not the fallback user.

The same student imported just before saving the rule again was assigned to Reviewer 2.

Environment
crm.taviportal.com › Students › Import Students

Edge 156.0.8078.48; Windows 10; 1272×866

Reporter valafo4080; captured 28 Oct 2026, 10:09 AM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2729 · urgent · CRM
**Blueprint | Create Task, Meeting, Call and other create-record actions in After Transition Actions allow another module, duplicate owner settings, "Value" defaults and a text-only Related record**

Summary
In a blueprint, a transition's After Transition Actions can include a Create task action, which should always create a task with a single, clear way to set its owner, sensible default values and fields that behave like their real field types. Instead, the action has four problems:
It has a module dropdown that starts on "Tasks" but lists every module in the CRM, so the action can be pointed at a module that isn't Tasks.

It sets the task's owner in two places: an Assign to choice (Record owner, Person who performed the transition, Specific user) and a separate Task Owner field, so it's unclear which one decides who gets the task.

Its dropdown fields (Reminder, Status, Priority) show "Value" by default, which isn't one of their options, instead of defaulting to the first real option.

Its Related record field is a plain text box, instead of a lookup that lets the user search for and pick a record.

The same behavior happens in every after-transition action that creates a record, not just Create task: Create meeting, Create call and any other create-record action.
Steps to reproduce
Go to Settings › Blueprints and open blueprint "AEX-01_Deals" (Deals, Standard layout, Stage field).

Click a transition, for example "NeedsAnalysisToProposal", and open the Transition tab on the right.

Under the after-transition actions, add or open a Create task action.

Click the module dropdown at the top of the action (it shows "Tasks") and look at the options listed.

Look at the Assign to options, then at the Task Owner field below them.

Scroll down to the Reminder, Status and Priority dropdowns and look at what each one shows before anything is picked.

Click the Related record field and try to pick a record.

Repeat steps 3–7 with a Create meeting action, a Create call action and any other action that creates a record.

Expected result
The Create task action always creates a record in the Tasks module.

There is no module dropdown, or it shows Tasks and can't be changed.

The task's owner is set in one place only. Assign to (Record owner, Person who performed the transition, Specific user) decides the owner, and a user picker appears only when "Specific user" is chosen.

Each dropdown (Reminder, Status, Priority) defaults to its first available option.

Related record works as a lookup, like Contact Name and Related To: the user searches for and picks an existing record ("Choose a record…").

All of the above applies to every create-record action (tasks, meetings, calls and any other created record): each is locked to its own module, sets the owner in one place, defaults dropdowns to their first option and uses lookups for record fields.

Actual result
The module dropdown lists every module: Leads, Contacts, Deals, Accounts, Calls, Meetings, Subscriptions and custom modules (for example "qa1026_ts Mod B", "inventory", "QA Mod 1025"), and the user can switch the Create task action to any of them.

The action shows both Assign to, with "Record owner" selected, and a separate Task Owner field ("Choose a user…") underneath, so the owner can be set in two conflicting places.

The Reminder, Status and Priority dropdowns all show "Value", which isn't one of their options, instead of their first option.

Related record is a plain text box (placeholder "Value") where any text can be typed, with no way to search for or pick a record.

The same problems appear in the Create meeting, Create call and other create-record actions.

Environment
staging-crm.taviportal.com › Settings › Blueprints › AEX-01_Deals (Deals; Standard layout; Stage field) › Transition › Create task / meeting / call

Edge; Windows; 1280×984

Reporter Nada Ahmed; captured 29 Oct 2026, 1:38 PM and 1:46 PM (Cairo)

Attachment
Annotated screenshots are attached to this work item.

### Comments (0)


---
## NDC-2730 · urgent · CRM
**Blueprint | A workflow can change the blueprint-locked field and send the lead back to an earlier stage; blueprint doesn't show after approval until the page is refreshed**

Summary
Blueprint "AEX-01_Leads" uses Lead Source as its stages, and the lead page shows that field as "Governed by blueprint". Even so, workflow rule "AEX-01" changes Lead Source back to "Chat" a few seconds after each transition. The lead falls back to the "Chat" stage and the transition progress is lost. A field that a blueprint locks and uses as its stages should only change through that blueprint's transitions, never through workflows or any other route.
Workflow rule "AEX-01" is set to run only when a record is created, yet it ran again on a lead that already existed, once after each transition.
Also, after the lead is approved, the blueprint section does not appear until the page is refreshed. The "ChatToOther" transition also rejects a valid phone number.
Steps to Reproduce
Set up workflow rule "AEX-01" to run when a record is created, for leads whose name contains "AEX-01". Give it a field update that sets Lead Source to "Chat" and Lead Status to "No Answer".

Set up blueprint "AEX-01_Leads" on Lead Source with stages Chat → Web → Referral and Chat → Other.

Open Leads, click Import Leads, and import one lead named "AEX-01" from an Excel file with "Trigger automation and process management" turned on.

Open My Reviews, open the new lead's review, and click Approve record.

Open the lead, click Respond, and approve it.

Look at the lead page. It shows as approved with Lead Source "Chat", but there is no blueprint section.

Refresh the page. The blueprint section now appears with the stage "Chat".

Click "ChatToWeb", add a note and an attachment, and click Execute. The stage moves to "Web".

Click "WebToReferral" and click Execute. The stage moves to "Referral".

Wait at least 10 seconds, refresh the page, and open the Timeline tab.

Click "ChatToOther" and click Execute.

Expected Result
Lead Source, the field the blueprint locks and uses as its stages, changes only through the blueprint's own transitions. Workflow rules cannot change it while the lead is in the blueprint.

After a transition the lead stays in the new stage, also after a refresh.

The blueprint section appears on the lead page as soon as the approval is complete, without refreshing.

"ChatToOther" accepts the phone number 01099130163, because it starts with 010 as the transition rule requires.

Actual Result
A few seconds after each transition, workflow rule "AEX-01" changes Lead Source back to "Chat". The Timeline shows the field change by the workflow, followed by "AEX-01_Leads: changed by the system" (Referral → Chat, and later Web → Chat).

"AEX-01" runs again each time even though it is set to run only when a record is created. Each run creates another "Task Created by Workflow for Lead AEX-01", and three tasks were created for one lead during the recording.

The tags added by the transitions are removed at the same moment.

The lead falls back to the "Chat" stage and all transition progress is lost. This shows after a refresh.

Running "WebToReferral" right after "ChatToWeb" fails with "Unknown or invalid transition for the current blueprint state", because the workflow had already reset the stage to "Chat".

After approval the blueprint section is missing until the page is refreshed.

"ChatToOther" shows "Invalid Phone Number" and the Execute button is disabled, although the phone number is 01099130163.

Environment
App: TAVI CRM staging — https://staging-crm.taviportal.com (Leads module, records AEX-01)

Browser: Microsoft Edge 156.0.8078.48

OS: Windows 10

Viewport: 1272 × 866

Reporter: noles40331 (Jam)

Captured: 29 Oct 2026, 11:22–11:24 UTC (first recording) and 11:45–11:48 UTC (double check)

Attachment
Attachment — first recording

Attachment 2 — double check: the blueprint appears after a refresh; the rule is set to run on record creation

### Comments (0)


---
## NDC-2731 · urgent · CRM
**Workflow Rules list | A rule with several conditions, each with its own action, shows only 1 in the Actions column**

Summary
On the Workflow Rules list, the Actions column should show how many actions a rule has. For a rule with several conditions, where each condition has its own action, the column shows only 1. It counts only the first condition's actions and ignores the others, so admins can't tell from the list how much a rule does.
Steps to Reproduce
Go to Settings → Automation → Workflow Rules and create a rule on Leads, for example "MultipleConditions", triggered On Create or Edit.

Add Condition 1, Lead Status = "No Answer", with an action that adds the tag "No Answer".

Add more conditions, each with its own action. For example: Lead Status = "Busy" adds the tag "Busy", and so on up to Condition 10, Lead Status = "Subscribe", which adds the tag "Pending Payment".

Save the rule and go back to the Workflow Rules list.

Look at the Actions column for the rule.

Open the rule and scroll through its conditions.

Expected Result
The Actions column shows the total number of actions in the rule, across all conditions, including the "Records not meeting any of the above" branch if it has actions. For this rule that is at least 10.

The number in the list matches what the rule page shows.

Actual Result
The Actions column shows 1 for "MultipleConditions".

The rule page shows at least 10 conditions, and each one has its own Add Tags action.

Other rules with conditions also show 1. For example, "QA RT 2294 item12 with else (…)" shows 1.

Environment
App: TAVI CRM staging — https://staging-crm.taviportal.com/settings/automation/workflow-rules

Browser: Microsoft Edge 156.0.8078.48

OS: Windows 10

Viewport: 1272 × 866

Reporter: noles40331 (Jam)

Captured: 29 Oct 2026, 12:38 UTC

Attachment
Attachment

### Comments (0)


---
## NDC-1819 · urgent · CRM
**Workqueue Missings**

Missing Items
Filter panel design — The Filter panel should look and behave exactly like Zoho's.

Filter categories — The Filter panel should offer the same three filter categories as Zoho: System Defined Filters, Filter By Fields, and Filter By Related Modules.

Filter options per field type — Each type of field should have its own set of filter options (for example, a date field, a number field, a text field and a pick list should each offer the conditions that make sense for that type).

Search inside the Filter panel — The Filter panel should have a search bar; once something is typed in it, a clear (×) button should appear so the user can empty it in one click.

Alphabet filter on Leads and Contacts — The Leads and Contacts queues under My Work Queues don't offer the alphabet (character) filter on the Lead Name / Contact Name column. It should be added, and choosing All should clear the selected letter.

Alphabet filter + normal filters together — The alphabet filter and the normal filters should work together; applying one must not cancel or override the other.

Column header menu — Each column header should have a menu (≡) with Asc, Desc, Pin Column and Hide Column, like Zoho's. Today, sorting happens by clicking the column header itself, which is not Zoho's behaviour — sorting should move into this menu, and Pin Column and Hide Column need to be added.

Table settings menu and column resizing — The table settings menu (top right of the list) should offer the same options as Zoho: Manage Columns, Reset Column Size, Records Per Page, and View Mode (Wrap Text / Clip Text). Columns should be resizable by dragging the column border. Reset Column Size stays disabled until a column's width has been changed, and then restores the default widths.

Manage Columns — The Manage Columns window should look and behave like Zoho's. It is missing: a search bar to find columns by name, a clear (×) button that appears once the search is filled, and the ability to pin/unpin columns.

Row actions on the left of each record — Hovering over a record should show its actions on the left side of the row, like Zoho's: a "…" menu with Edit and Delete, and an Add Note icon to add a note without opening the record. Today the "…" menu sits at the far right of the row; it should move to the left side. Also, it contains a "Mark as Completed" option which is redundant because it already exists to the left side of the row.

Date filter in My Open Activities — The date filter options are limited compared with Zoho's. It should offer the same options as Zoho: Today & Overdue, Today, Tomorrow, Overdue, This Week, Next Week, This Month, Next Month, and On a Specific Date (opens a calendar to pick any date).

Manage Queue — Category View — Choosing Category View in Manage Queue does not change how the queues are shown inside the Manage Queue window, and it is applied to Work Queue straight away, before Save is clicked. Like Zoho's, Category View should regroup the queues inside the Manage Queue window by module (Leads, Contacts, Deals, Campaigns), and the change should only apply to Work Queue after clicking Save — Cancel should discard it.

Category View — Create Queue per module — When Category View is applied, the queues in Work Queue should be grouped by module (Leads, Contacts, Deals, Campaigns), like Zoho's. Each module title should have its own + (Create New Queue) button that opens queue creation directly for that module, skipping the first step (Module and Layout selection).

Environment
App: TAVI CRM — crm.taviportal.com (Work Queue)

### Comments (6)
- 2026-10-25T06:35 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; metadata-engine staging 12390a74 + CRM SPA c907b2e12). Ready for test — item-by-item list in my comment above. Note: the server was down from about 20:30 to 23:15 UTC on 24 Oct (its Docker disk was full); it is fully back now, so results from that window should be re-run.
- 2026-10-25T15:26 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 25 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge headless · account mahmoud.mahamed1515 (CRM Admin + Desk Administrator)
Method: manual browser + API (retest round 25 Oct 2026)
Developer's note checked: Mostly held; Pin Column, minimum width in Clip mode and rail counts for new periods not done.
Most items now work (locked Subject, utility columns, sort persists, max 800 px + reset, search clear, A–Z rail with filter, row menu without Mark as completed, 11 periods). Still open: no Pin Column anywhere; the 48 px minimum hides the header label and in Clip Text dates spill into the next column; the rail shows Tasks/Calls/Meetings counts only for All open, Due today and Overdue; items 1, 2, 13 declined by the developer.
Checked:

- Locked Subject / utility columns / sort persists / max 800 px / Reset Column Size → All work [PASS]

- Search "Clear" in filter and Manage Columns; A–Z rail; letter + filter; row menu Edit/Reschedule/Delete; 11 periods → All work (L = 1, All = 4; Full Name contains Lead → L 1, X 0) [PASS]

- Pin Column → Absent everywhere [FAIL]

- Minimum column width (Clip Text) → 48 px: label disappears; dates spill into the next column [FAIL]

- Rail counts for the 6 new periods → Only All open / Due today / Overdue show counts [FAIL]

- Items 1, 2, 13 → Not done (developer declined) [FAIL]
Still failing:

- Pin Column: absent from every column menu and Manage Columns.

- Min width (Clip Text): Due date at 48 px → header label gone, "Late by …" overlaps Status.

- Rail counts: missing for Today & Overdue, Tomorrow, Next 7 days, This week, This month, Next month (API today_and_overdue = 5).

- Items 1, 2, 13: not done.
Evidence: NDC-1819-retest-PARTIAL.png
- 2026-10-26T13:19 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails (partly done)
Done: date filter list, alphabet A–Z, table settings (Manage Columns, Reset Column Size, 10–200 per page, Wrap / Clip), Manage Columns search, row actions on the left, grouping by module.
Still missing compared with Zoho: the filter is an inline criteria row, not a panel with System Defined / Filter By Fields / Related Modules; the column menu has only Sort ascending / descending (no Pin or Hide); Manage Columns has no pin; there is no Add Note icon on the row.
Environment: staging-crm.taviportal.com, owner account; manual run 25 Oct 2026.
Annotated TAVI-vs-Zoho image attached: NDC-1819-retest.png

---
## NDC-2294 · high · CRM
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

### Comments (2)
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

- Item 3: Record Score / Record Notes triggers — unkn
- 2026-10-29T16:25 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 29 Oct 2026 → moved to Bug
Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)
Method: API and screen (the steps of the existing automation, run against the Anyware tenant)
12 of the 13 items now work on Anyware and were run, not only saved. Still missing: the Record Score trigger (the editor's "Score value" category is switched off — "Scoring rules land in Phase 5"). Item 7 (Anyone / Everyone) is stored and read back correctly but was not run: every role / org unit on this tenant includes real users.
Checked:

- Screen: import option name → Shown with the help text; off by default [PASS]

- Screen: manual approval → Implemented: "Enable manual approval" [PASS]

- 2 manual approval run → "0 added · 1 waiting for approval"; no lead until approved; approve → lead 26c66d2e, pending 0 [PASS]

- 3 Record Notes trigger → NoteAdded Fired; Description set [PASS]

- 3 Record Score trigger → 400 "Unknown trigger kind"; editor category "Score value" switched off ("Scoring rules land in Phase 5") [FAIL]

- 4 Meeting / Call / Function → All three Succeeded (meeting, call created; custom action run) [PASS]

- 5 Assign Owner by rule → Owner = rule user; all three options stored [PASS]

- 6 review functions → Stored; custom action ran on submission and on approval (Succeeded) [PASS]

- 7 Anyone / Everyone → Stored and read back (users + everyone refused). Not run: approver groups hold real users [PASS]

- 8 approval Call Function → RunCustomAction Succeeded after approval (no longer a no-op) [PASS]

- 9 blueprint after-actions → Tag added, lead converted, custom action Succeeded, task created [PASS]

- 10 rejection reasons → Stored per process (EN/AR, order); org list unchanged [PASS]

- 11 scheduled Field Update → Applied after ~150 s [PASS]

- 12 several conditions → First match wins (A→cond1, B→cond2, other untouched); duplicate criteria and else-not-last refused [PASS]

- 13 "trigger": [

---
## NDC-2653 · high · CRM
**Deals | A custom field named "pipeline" overrides the real Pipeline — deals are refused on every pipeline but the default**

Summary. On Deals, a custom pick-list field was created with the api name pipeline — the same key as the built-in Pipeline. Since then every deal write that sends a pipeline is validated against the custom field's allowed values instead of the module's pipelines, on every layout. Only "Standard (Standard)" passes, so no deal can be created on, or moved to, any pipeline other than the default.

Steps to reproduce

- Settings › Modules and Fields › Transactions (Deals) › Fields › search "Pipeline": a field Pipeline / pipeline / Pick list / Custom Field ✓ / layout Wonder Travel exists (created 24 Oct 2026 15:54 UTC by ndc-staging-owner, allowed values ["Standard (Standard)"]).

- Transactions › Create, layout Standard, Pipeline = "1", fill the required fields › Save.

- API: POST /api/v1/modules/{Deals}/records on layout Standard with {"field":"pipeline","value":{"kind":"string","value":"640e03a4-9c24-4b06-8d7d-5c1db2711b9b"}}.

- Also: change a deal's pipeline (record page / Mass Update / PATCH).

Expected

- A custom field cannot be created with the api name of a built-in field (Zoho reserves system api names; custom fields get their own name).

- A deal's pipeline is validated against the module's pipelines; a field placed on one layout never changes validation on other layouts.

Actual

- Step 2: "Pipeline: '640e03a4-9c24-4b06-8d7d-5c1db2711b9b' is not one of the allowed values (Standard (Standard))."

- Step 3: 422 "Invalid value for: Pipeline."; without a pipeline (or with the text "Standard (Standard)") the deal lands on the default Standard pipeline.

- Control: with the custom field's list widened temporarily to include the real pipeline ids, a deal is created on "1", an edit moves a deal to "1", and a stage not in "1" is refused — the pipeline logic works; the custom field is the cause. The field was restored to ["Standard (Standard)"] right after.

Impact
All pipeline features are blocked on staging since 24 Oct. This is why NDC-1302, NDC-1312, NDC-1316 and NDC-1324 could not be verified in round 4 (moved to Bug). NDC-2382 passed on 26 Oct only with the list widened for the test.

Suggested fix

- Block custom api names that collide with system fields (validate on create/rename).

- Validate a record value against its own field definition, never a same-named field from another layout.

- Data: rename or remove the custom "pipeline" field on staging (owner: ndc-staging-owner) once the fix is in.

Environment: staging-crm.taviportal.com, tenant NDC-Staging, Edge + API, account mahmoud.mahamed1515 (CRM Admin), 25–27 Oct 2026. Deals module f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430, field 6b44c7c9-5c6b-4e7f-a33a-5fdbc43ec0ab, pipelines Standard 5170500c…, "1" 640e03a4….

Evidence: NDC-new-pipeline-field-BUG.png (attached).

### Comments (0)


---
## NDC-2722 · high · CRM
**Import | Resuming an import with error rows opens Review without the error counts and error details**

Summary
When an import has rows with errors, the Review step lists them: how many rows will import, how many have errors, and each error. If the user leaves the import and comes back with Resume, Review opens with only the summary. The error counts and the Validation errors section are missing, so the import looks ready to submit even though none of its rows can be imported.
Steps to reproduce

- Go to CRM › Sales › Leads and click Import Leads.

- Upload an Excel file whose rows clash with existing leads (same Phone or Email). For example, "AEX-01_4Rows.xlsx" with 4 rows.

- Click Next through Operation and Map fields, choose the Standard layout, then click Save & next on the Assign step.

- On Review, note "Rows that will import 0", "Rows with errors 4" and the Validation errors section listing 7 errors.

- Close the import wizard.

- Click Import Leads again. A banner says "You have an import in progress for this module". Click Resume.

- Look at the Review step.
Expected result

- The resumed Review step shows the same as before leaving: "Rows that will import", "Rows with errors", the error breakdown and the full error list.

- The user can't be led into submitting an import where no rows will import without seeing why.
Actual result

- The resumed Review shows only File, Rows, Operation, Target layout, Automation, Manual approval and Mapped columns.

- "Rows that will import", "Rows with errors" and the whole Validation errors section are missing.

- The "I confirm I have permission to import this data…" checkbox is shown instead, as if the import were ready to submit.

- The errors appear again only after going back to Assign and clicking Save & next, and they disappear on the next Resume.
Environment

- staging-crm.taviportal.com › Leads › Import Leads

- Edge 156.0.8078.48; Windows 10; 1272×866

- Reporter Mahmoud Mohamed; captured 29 Oct 2026, 10:02 AM (Cairo)
Attachment
Attachment

### Comments (0)


---
## NDC-2726 · high · CRM
**Actions - Workflow | Records created by Create Record / Create Connected Record actions don't take the owner of the record that triggered the workflow**

Summary
When a workflow rule runs on a record, for example a Lead, its Create Record or Create Connected Record action creates a new record, for example a Deal. The new record should belong to the owner of the record that triggered the rule unless the action names a different owner, as in Zoho CRM. Instead, it never takes the triggering record's owner: with no owner set in the action the new deal has no owner at all, and the action's owner field only offers fixed users, with no "owner of the triggering record" option.
Steps to reproduce
Go to Settings › Automation › Actions and open the Create Record action "AEX-01_Leads_CreateDeal" (Leads → Deals).

In Field values, open the Deal Owner dropdown and look at the options; then remove Deal Owner and click Save action.

Go to Settings › Automation › Workflow Rules and open rule "AEX-01" (Leads). Make sure it runs the Create Record action and a Create Connected Record action (Deals), and save.

Go to CRM › Sales › Leads, open a lead owned by another user (for example owned by "test user 2"), click Edit, set First Name to "AEX-01" so the rule runs, and click Save.

Go to CRM › Deals and open the deals the workflow created ("AEX-01_CreatedDeal", "DealCreatedByConnectedRecord").

Check each deal's owner.

Expected result
By default, the created record's owner is the owner of the record that triggered the workflow (here, the lead's owner).

The owner list in both actions includes an option such as "Record owner (triggering record)", alongside specific users.

A specific user only overrides the default when the admin chooses one.

Actual result
The Deal Owner dropdown lists only individual users, with no option for the triggering record's owner.

Deals created by the workflow ("AEX-01_CreatedDeal" from Create Record, "DealCreatedByConnectedRecord" from Create Connected Record) have no owner at all; the lead's owner is not carried over.

When the action sets a fixed Deal Owner, every created deal goes to that one user, whoever owns the lead.

Environment
staging-crm.taviportal.com › Settings › Automation › Actions / Workflow Rules; Leads; Deals

Edge 156.0.8078.48; Windows 10; 1272×866

Reporter Mahmoud Mohamed; captured 29 Oct 2026, 12:18 PM and 12:28 PM (Cairo)

Attachment
Attachment
Attachment 2

### Comments (0)


---
## NDC-2727 · high · CRM
**Records - Leads | Deals section on a lead shows only 10 of its connected deals with no scrolling, and "View all" opens the whole Deals module**

Summary
A lead's record page has a Deals section listing the deals connected to that lead. It should list all of them inside a fixed-height area the user can scroll, so they never have to leave the lead. Instead, the section header shows the right count (31), but only the first 10 deals appear and the rest can't be reached by scrolling. The "View all" button leaves the lead and opens the full Deals module with every deal in the system, not just this lead's deals.
Steps to reproduce

- Go to CRM › Sales › Leads and open a lead that has more than 10 connected deals (for example "AEX-01").

- Scroll down to the Deals section on the lead's page and look at the count in the header ("Deals (31)").

- Count the deals listed in the section, then try to scroll inside it.

- Click View all in the Deals section header.

- Look at the page that opens and how many deals it lists.

Expected result

- The Deals section lists every deal connected to the lead (all 31), in a fixed-height area that scrolls.

- The user can see all of the lead's deals without leaving the lead.

- If "View all" is kept, it only shows this lead's deals; otherwise it isn't needed.

- This applies to every connected-records section on a record page, not just Deals. Any section for a module linked to the record (for example Contacts, Accounts or Activities) lists all its connected records in the same scrolling area, and its "View all" only shows the records connected to this record.

Actual result

- Only 10 deals are listed (Deal-30 down to Deal-21), even though the header says there are 31.

- The section doesn't scroll, so the other 21 deals can't be reached from the lead.

- "View all" opens the full Deals module with all 43 deals in the system, not filtered to this lead.

Environment

- staging-crm.taviportal.com › CRM › Sales › Leads (lead record page, Deals section); Deals

- Edge 156.0.8078.48; Windows 10; 1272×866

- Reporter noles40331; captured 29 Oct 2026, 12:43 PM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2728 · high · CRM
**Actions - Workflow | Actions page doesn't offer all the action types available inside a workflow rule**

Summary
Settings › Automation › Actions is the library of reusable actions that workflow rules can share. Every action type a workflow rule can run should also be creatable there, so it can be saved once and reused. Instead, the New Action dialog offers only 8 types. Five types that a workflow rule's Add action picker offers are missing, so they can only be set up inline inside each rule and never saved as reusable actions.
Steps to reproduce

- Go to Settings › Automation › Workflow Rules and open rule "AEX-01" (Leads).

- Click Add action and note the action types listed: Field Update, Owner Assignment, Webhook, Email, Task, Create Record, Meeting, Schedule a Call, Create Connected Record, Add Tags, Remove Tags, Send portal access and Function (custom action).

- Click Cancel and go to Settings › Automation › Actions.

- Click New Action and look at the types listed.

Expected result

- The New Action dialog offers every action type available in a workflow rule's Add action picker.

- Any of these types can be created as a saved action and then picked under "Or use a saved action" in a workflow rule.

- The type tabs on the Actions page include every action type too.

Actual result

- The New Action dialog lists only 8 types: Email, Task, Field Update, Webhook, Owner Assignment, Create Record, Add Tags and Remove Tags.

- Meeting, Schedule a Call, Create Connected Record, Send portal access and Function (custom action) are missing, so they can't be saved as reusable actions.

Environment

- staging-crm.taviportal.com › Settings › Automation › Actions / Workflow Rules; Leads

- Edge 156.0.8078.48; Windows 10; 1272×866

- Reporter noles40331; captured 29 Oct 2026, 1:14 PM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2732 · high · CRM
**Web Forms | Embedded web form (iframe) doesn't load — form shows as not available**

Summary
An enabled web form can't be shown on a website through its iframe code. The iframe page opens, but the form inside never loads and the visitor sees it as not available. This happens even though the form is switched on and sharing is enabled.
Steps to Reproduce
Go to Settings and open Web Forms.

Next to the enabled form "Potential Leads", click Embed code.

In the "Hosted link and iframe" section, copy the iframe code (or open its address in a new browser tab).

Open that iframe in a browser, signed out.

Expected Result
The form shows its fields (Full Name, Phone, Email) and can be submitted.

Actual Result
The form does not load and is treated as not available.

It fails the same way every time and for any visitor.

Environment
App: TAVI CRM — staging-crm.taviportal.com, Settings › Web Forms

Browser: Edge 156.0.8078.48, Windows 10, 1272×866

Reporter: Jam by noles40331, 29 Oct 2026 13:02 UTC; reproduced by QA 29 Oct 2026 13:38 UTC

Dev note: session request for the form fails on the server — trace ids 6b7abdb2-fc5a-4366-a0d2-c42a1bd74783, 6fe679bb-a64d-4a8c-b1ed-5e622ded185b. The iframe page loaded in Wave 4 (26–27 Oct), so this looks like a regression.

Related: NDC-1488 (Web Form). The hosted link's nginx 404 is tracked there.

Attachment
Attachment

### Comments (0)


---
## NDC-1948 · high · CRM
**Notes | A user denied Timeline Visibility can't add notes: the note stays on "Posting…" forever with a success message**

Summary
When Timeline Visibility denies a user access, that user can no longer add notes properly. The note they add stays on "Posting…" and never appears, even though it's actually saved. A user who's allowed to see the timeline then sees the note normally. Notes should depend only on the user's permission to access the record and add notes, not on Timeline Visibility.
Steps to Reproduce
As an admin, go to Settings → Timeline Visibility.

Set When no rule matches to Deny, then add a rule that gives Can view only to certain departments (e.g. HR and Sales, rank Manager, CRM only), and click Save.

Sign in as a user who isn't covered by the rule (e.g. mahmoud.mahamed1515) and open a Lead record.

On the Overview tab, type a note (e.g. "test") and click Add note.

Sign in as a user who is allowed to see the timeline (e.g. the admin) and open the same record.

Expected Result
Timeline Visibility controls only who can see the Timeline tab.

Any user who can access the record can add a note, and it appears right away in the record's notes.

Actual Result
The note stays on "Posting…" forever for the user who added it, and never appears in their notes list but displays a success message.

The note is actually saved: a user with timeline access sees it on the record normally.

Environment
App: TAVI CRM (staging: staging-crm.taviportal.com), Settings → Timeline Visibility / Leads record → Notes

Browser: Edge 154 on Windows 10

### Comments (1)
- 2026-10-15T01:14 83c4a765-8318-424c-b7a7-17758d9bbc4e: Confirmed as a real defect, root cause found, and fixed. Keeping it in Bug until the frontend is deployed.
Root cause. The Notes card shows your new note optimistically and clears the "Posting…" spinner when the note's entry appears in the record's timeline feed. Timeline Visibility denies that feed by answering an empty 200 (deny is deliberately indistinguishable from "nothing to show", so no error is raised). For a user the policy denies, the feed can therefore never grow — so the spinner had nothing to clear it and spun forever, right beside the success toast the save had already earned. The note really was saved, which is why a user with timeline access sees it normally.
So the report is exactly right on both counts: notes should depend only on being able to access the record and add a note, and Timeline Visibility should control only who can see the Timeline tab.
The fix (NotesSection.tsx): "Posting…" now follows the note request, not the feed. Once the POST resolves, the note is saved by definition — so it renders as an ordinary note with its real timestamp and stays in the list; if the viewer can see the timeline, the real entry still swaps in as before and nothing duplicates. A failed save still removes it and surfaces the error. No server change, no change to Timeline Visibility itself, and no change at all for a user who can see the timeline.
What to retest once deployed (the ticket's own steps): as the denied user, add a note on a Lead — it should appear immediately in the Notes list with its timestamp and no spinner, and still be visible to the admin. Also confirm the Timeline tab remains correctly hidden for that user; notes and timeline visibility are now independent.
 I will ping you here when it is on staging.

---
## NDC-2098 · medium · CRM
**Custom Views | ?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads**

Summary
?view= with a deleted or foreign view ID falls back to the last-used view instead of All Leads.
Found by test case CVS-B14 - The ?view= URL opens permitted views and falls back safely for others.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

IDs are known for: own 'QA CV x'; 'QA CV shared-to-me' shared by the lower-profile user; deleted 'QA CV gone'; the lower-profile user's private 'QA CV user-private'.

Open /modules/{m}?view={id} with the ID of 'QA CV x'.

Repeat with the ID of 'QA CV shared-to-me'.

Repeat with the ID of 'QA CV gone'.

Repeat with the ID of 'QA CV user-private'.

Check the browser console after each.

Test data:
Own: 'QA CV x'

Shared: 'QA CV shared-to-me'

Deleted: 'QA CV gone'

Foreign: 'QA CV user-private'

Expected Results
The own and shared views open. The deleted and foreign IDs fall back to All Leads with no crash, and nothing of the foreign view (name, criteria, records) is shown.
Actual Results
?view= own QA CV x -> opens.

QA CV shared-to-me (shared by test user 1) -> opens.

Deleted QA CV gone and test user 1's private QA CV user-private -> toast 'That view is no longer available. Showing your default view.', ?view= removed, nothing of the foreign view shown, no console errors.

The fallback is not All Leads - both land on the last-used view (QA CV close11).

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-B14, run execu_2026-10-05_11-20-40.
Attachments
B14-vs-zoho.png: annotated screenshot (TAVI on the left, Zoho CRM reference on the right, with the comparison table).

B14-deleted-fallback.png: original TAVI screenshot (Deleted view id in ?view=).

zoho-B14-invalid-view-id.png: Zoho CRM reference screenshot (Invalid view id).

### Comments (7)
- 2026-10-25T06:34 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.
- 2026-10-25T15:26 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 25 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge headless · account mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test user 2 for the foreign view
Method: manual browser + API (retest round 25 Oct 2026)
Developer's note checked: Only when the last-used view is not applicable; otherwise the last-used view opens under a toast that says All Leads.
With the last-used view "QA RT 2098 last", ?view=<deleted id> and ?view=<test user 2 private view> show the toast "That view is no longer available. Showing All Leads." and remove ?view, but the page opens QA RT 2098 last (2 records), not All Leads. With a last-used view from another layout it lands on All Leads. Nothing of the foreign view leaks.
Checked:

- Deleted / foreign id, last-used = a normal view → Toast "That view is no longer available. Showing All Leads." but QA RT 2098 last (2 records) is shown [FAIL]

- Same, last-used = view of another layout → All Leads + toast, ?view removed [PASS]

- Own view by URL / foreign view leak → Own view opens; foreign name never shown [PASS]

- Leads page load → 35–73 s to load in this run [INFO]
Still failing:

- ?view=<deleted ff0a79b9…> with last-used QA RT 2098 last → shows QA RT 2098 last (2 records); expected All Leads.

- ?view=<foreign 1cb2da03…> → same.

- Toast text says "Showing All Leads." while another view is shown.
Evidence: NDC-2098-retest-FAIL.png
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
After deleting a view, opening /modules/{leads}?view=<that id> opened the last-used view again ("QA W2 CV main renamed", 2 records) instead of the default All Leads view.
This is the manual result from 25 Oct. The automated screen test (RecordScreensUiTest#deletedViewIdInUrl) could not run on 26 Oct: first a browser timeout, then the test machine ran out of memory.
Environment: staging-crm.taviportal.com, owner account.
Annotated TAVI-vs-Zoho image attached: NDC-2098-retest.png

---
## NDC-2113 · medium · CRM
**Custom Views | A record holding a removed pick-list value is shown in an unmarked extra column - no 'no longer an option' flag**

Summary
A record holding a removed pick-list value is shown in an unmarked extra column - no 'no longer an option' flag.
Found by test case CVS-I04 - A record holding a value removed from the pick list is flagged on the board.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Kanban view 'QA CV kb-status' exists on Leads (Categorize by: Lead Status).

The Owner adds an option (e.g. 'QA CV stale') to Lead Status, sets a lead to it, then removes the option.

Open 'QA CV kb-status'.

Find the lead on the board.

Read the column and message shown for it.

Open the lead and read Lead Status.

Test data:
Removed value: 'QA CV stale' (this run used 'QA CV Temp' on QA CV L12)

Expected Results
The lead is still shown on the board, marked with "This value is no longer an option of the field".
Actual Results
QA CV L12 holds 'QA CV Temp', a value added to Lead Status and then removed.

Board 'QA CV kb-status': L12 is still shown, in an extra column 'QA CV Temp' (count 1) placed before Unaccounted.

No 'This value is no longer an option of the field' marker anywhere - not in text, title, aria-label or a tooltip on the column header or the card; the stale column looks like any normal value column and offers 'Create Lead'.

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-I04, run execu_2026-10-05_11-20-40.
Attachments
I04-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

I04-stale-value.png: original TAVI screenshot (QA CV kb-status).

### Comments (5)
- 2026-10-25T00:35 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Fixed (merged to staging, ships with the next test-server deploy; staying in Bug until then). "Unaccounted" is now a source-only column on every board: cards can be dragged OUT of it onto a real value, never INTO it (the column dims while dragging, like a removed-value column). Clearing a value is done on the record itself.
How to retest: Deals Kanban → drag a card toward Unaccounted → refused; drag a card from Unaccounted to a stage → moves and the record's value is set.
- 2026-10-25T06:34 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.
- 2026-10-25T15:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 25 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge headless · account mahmoud.mahamed1515 (CRM Admin + Desk Administrator)
Method: manual browser + API (retest round 25 Oct 2026)
Developer's note checked: Drag out held; drag in refused except the first drop after load.
Dragging from Unaccounted to Proposal moves the deal and sets stage = proposal. Dragging into Unaccounted dims the column and is refused — but the first drop after the board loads (while Unaccounted holds a card) lands the card in the neighbouring Closed_lost column and opens "Verify details — before closing this deal" (3/3 runs). Cancel restores it.
Checked:

- Drag out of Unaccounted to a stage → Moved to Proposal; API stage = proposal [PASS]

- Drag into Unaccounted → Column dims (opacity 0.5); 2nd and later drops refused, stage unchanged [PASS]

- First drop after load while Unaccounted has a card → Card placed in Closed_lost + "Verify details — before closing this deal" dialog (3/3 runs); Cancel restores [FAIL]
Still failing:

- First drop on Unaccounted after load: card shown in Closed_lost + close-deal dialog; expected refused with no move.
Evidence: NDC-2113-retest-PARTIAL.png

---
## NDC-2725 · medium · CRM
**Records | Activities "View all" is redundant and opens the whole Calls module; the Calls tab repeats call activities instead of showing call logs**

Summary
A lead's Activities section already lists all of the lead's activities, yet it also has a View all link that opens the full Calls module, not this lead's items. The Calls tab repeats the lead's call activities, the same entries as Activities, while its Call Logs section, the record of actual calls made, stays empty. Its View all also opens the Calls module.
Steps to reproduce
Go to CRM › Sales › Leads and open a lead with call activities, for example "AEX-01".

On the Overview tab, look at the Activities section and click View all.

Go back to the lead and open the Calls tab.

Compare the Calls list with the Activities section, then scroll down to Call Logs.

Click View all in the Calls tab.

Expected result
The Activities section has no View all, since it already shows all of the record's activities in a scrollable list.

The Calls tab shows the record's call logs: time, direction, phone, agent, duration, disposition and recording. It doesn't repeat the call activities already shown in Activities.

Any "View all" on a record opens a list filtered to that record, not a whole module.

Actual result
Activities (28) shows all 28 activities. View all opens CRM › Calls with 35 records, which are all calls, not only this lead's.

The Calls tab shows "Calls (25)" with the same "Inbound call from +15551234567" entries as Activities.

The Call Logs table on the Calls tab is empty.

View all on the Calls tab also goes to the Calls module.

Environment
staging-crm.taviportal.com › Leads › record (AEX-01) › Overview / Calls tab

Edge 156.0.8078.48; Windows 10; 1272×866

Reporter Mahmoud Mohamed; captured 29 Oct 2026, 11:14 AM (Cairo)

Attachment
Attachment

### Comments (0)


---
## NDC-2122 · low · CRM
**Custom Views | Upper-case 'AND' pattern is accepted by the editor and the API**

Summary
Upper-case 'AND' pattern is accepted by the editor and the API.
Found by test case CVS-D22 - Every invalid criteria pattern is blocked in the editor and rejected by the API.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Open Leads → New custom view 'QA CV bad-pattern' and add three rows (Name starts_with 'QA CV', Lead Status is_not_empty, Comment is_empty).

Enter each 3-row pattern in Test Data; click Save; record the message.

Add rows to 5 for the depth-4 pattern and to 25 for the 201-character pattern; Save each and record the message.

POST /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views with each pattern and record the status code.

GET /api/v1/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/views?kind=list and confirm no 'QA CV bad-pattern' exists.

Click Cancel.

Test data:
Unbalanced: '(1 and 2 or 3'

Empty group: '()'

Bare operator: '(and)'

Trailing operator: '1 and'

Missing operator: '1 2'

Missing row: '1 and 5'

Unused row: '1 and 2' (row 3 unused)

Row used twice: '1 and 1 and 2 and 3'

Unknown word: '1 xor 2 and 3'

Upper case: '1 AND 2 AND 3'

201 chars (25 rows): '(1) and (2) and … (20) and 21 and 22 and 23 and 24 and 25'

Depth 4 (5 rows): '((((1 and 2) or 3) and 4) or 5)'

Expected Results
For every pattern the editor shows "Fix the criteria pattern: every row number must appear once, and brackets must match." (or a more specific message) and Save is blocked. The API rejects every pattern with 400/422. No view is created.
Actual Results
Editor: every other invalid pattern disables the pattern Save and shows a specific message (e.g. 'Brackets are not balanced.'); the view Save is paused while the pattern is edited.

API: every other invalid pattern -> 422 with a specific message (unbalanced, unexpected ')', two operators, ends unexpectedly, criteria 5 does not exist, criteria 3 missing, criteria 1 used twice, unknown word xor, nests deeper than 3 levels, at most 200 characters).

The upper-case pattern '1 AND 2 AND 3' is accepted by the editor and by the API (201), although the case lists it as invalid.

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-D22, run execu_2026-10-05_11-20-40.
Attachments
D22-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

D22-uppercase-accepted.png: original TAVI screenshot (Pattern editor).

### Comments (7)
- 2026-10-25T06:34 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.
- 2026-10-25T15:26 e1364b0b-d3cd-4167-8261-6194577a480a: Requested change (product decision, 25 Oct): please disable typing in the Criteria Pattern. The pattern should not be editable as text — clicking the AND/OR button between rows should switch it between "and" and "or".
Retest FAIL — 25 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge headless · account mahmoud.mahamed1515 (CRM Admin + Desk Administrator)
Method: manual browser + API (retest round 25 Oct 2026)
Developer's note checked: Editor part held. API still accepts and stores upper/mixed case; summary shows it as stored.
Editor: typing AND/OR becomes and/or and saves lower case. API: "1 And 2", "1 OR 2", "1 AND 2" → 201 and stored as sent; results identical to lower case. The ticket expected the API to reject upper case.
Checked:

- Editor → Lower-cased while typing; saved "(1 and 2)" [PASS]

- API (ticket expectation: reject) → 201 — "1 And 2", "1 OR 2", "1 AND 2" accepted and stored as sent [FAIL]

- Pattern editing (product decision 25 Oct) → Pattern is still a free-text box [FAIL]

- API view opened in editor (dev: opens lower-cased) → Summary "( 1 And 2 )"; Edit Pattern box "1 and 2" [INFO]

- Evaluation → OR 64 = 64; AND 1 = 1 [PASS]
Still failing:

- API accepts upper/mixed case (201) — ticket expected 400/422.

- Requested change: disable typing in the criteria pattern; switch and/or only by clicking the AND/OR button.
Evidence: NDC-2122-retest-FAIL.png
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
A Leads view with criteria pattern "1 AND 2" (upper case) is still accepted with 201. Other validation works: "1 and 3" (condition 3 doesn't exist) is refused with 422 INVALID_VIEW.
Environment: staging-crm.taviportal.com, owner account. Automation: CustomViewTest#upperCaseAndRefused.
Annotated TAVI-vs-Zoho image attached: NDC-2122-retest.png

---
## NDC-2135 · low · CRM
**Custom Views | Firefox: React ErrorBoundary console error from a lazy-loaded component during the view/Kanban flow**

Summary
Firefox: React ErrorBoundary console error from a lazy-loaded component during the view/Kanban flow.
Found by test case CVS-L07 - Core picker, create-view and Kanban flows behave the same in Edge, Chrome and Firefox.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Current Edge, Chrome and Firefox are installed.

Leads Kanban view 'QA CV browsers' by Lead Status exists.

In Chrome, open the Leads view picker, search and switch views.

Create 'QA CV chrome' with one criterion and Save.

On 'QA CV browsers', drag 'QA CV L01' to another Lead Status column, then drag it back.

Sign out via profile → Logout.

Repeat steps 1–4 in Edge ('QA CV edge') and in Firefox ('QA CV firefox').

Test data:
Browsers: Chrome, Edge, Firefox

Expected Results
Each flow gives the same result in all three browsers, with no console errors or layout breaks; 'QA CV L01' ends with its original Lead Status.
Actual Results
Same flow per browser (fresh sign-in each): picker search + switch to 'QA CV count'; create 'QA CV chrome/edge/firefox' (Full Name starts with 'QA CV L0') -> 201, 9 rows; Kanban 'QA CV kb-status' QA CV L01 No Answer -> Busy -> No Answer (PATCH 200 ×2, final No Answer).

Chrome 131.0.6778.205 and Edge 154.0.4258.53: identical, only the unrelated 403 on /telephony/status in the console.

Firefox 153.0 (Playwright build): identical results but a React '[ErrorBoundary] … Lazy@unknown' console error. Also reproduced on the 4 Oct build.

The sign-out step was not run (each new sign-in revokes the previous session anyway).

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chrome 131, Edge 154 and Firefox 153, 5 October 2026 (front-end bundle index-Bzy9m5yg.js). Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-L07, run execu_2026-10-05_11-20-40.
Attachments
L07-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

L07-console-errors.png: original TAVI screenshot (Console errors per browser).

### Comments (1)
- 2026-10-14T03:08 e1364b0b-d3cd-4167-8261-6194577a480a: <p><b>Triage (code review, 2026-10-14): not enough detail to act — please re-capture.</b></p><p>The report carries only the error boundary's log prefix and a <code>Lazy@unknown</code> stack frame, which does not identify the component or the cause. A lazily loaded chunk failing to load after a deploy looks exactly like this and is handled separately (the app detects a stale chunk and reloads), so I cannot tell a real defect from that case.</p><p><b>Please add, from a plain Firefox window (not Playwright) on the current build:</b> (1) the error <code>name</code> and <code>message</code> from the console, (2) the route you were on and the exact step, (3) whether the page auto-reloaded itself, and (4) whether it reproduces after a hard refresh. A screen recording of the console would be ideal.</p>

---
## NDC-2136 · low · CRM
**Custom Views | List first page p95 far above 1.5 s (Leads 9.1 s, Deals 3.3 s)**

Summary
List first page p95 far above 1.5 s (Leads 9.1 s, Deals 3.3 s).
Found by test case CVS-L08 - A list view's first page loads within 1.5 s at p95 on Leads and Deals.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Open All Leads and reload it 20 times.

For each load, record the time from navigation to the first page of rows shown.

Repeat steps 1–2 on All Deals.

Compute the p95 for each module and note the record counts.

Test data:
Loads: 20 per module

Target: p95 ≤ 1.5 s (PRD)

Expected Results
The 95th-percentile first-page time is within 1.5 seconds on both Leads and Deals.
Actual Results
20 reloads each, navigation -> first row with content (Chromium, cache on, another operator active on the tenant).

All Leads (128 records): p95 9125 ms, median 4122, min 2851, max 10116.

All Deals (50 records): p95 3300 ms, median 2585, min 1945, max 3696.

Target p95 <= 1.5 s missed on both (4 Oct: Leads p95 6826, Deals 3885).

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-L08, run execu_2026-10-05_11-20-40.
Attachments
L08-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

L08-L09-timings.png: original TAVI screenshot (20 reloads each).

### Comments (2)
- 2026-10-14T03:08 e1364b0b-d3cd-4167-8261-6194577a480a: <p><b>Triage (code review, 2026-10-14): a real smell found, but the numbers need measuring before I change anything.</b></p><p>What the code does show: the first <code>/records</code> request waits behind three sequential reads (layouts + fields → module views → records), and the records page fires a 1+N request fan-out for pipeline options (the layout list plus one call per layout) on every module page. Both are worth fixing. Neither explains 9 seconds on ~128 rows, so fixing them blind risks "optimising" the wrong layer.</p><p><b>Please attach:</b> (1) a HAR for three cold reloads of the Leads list with per-request timing, (2) the server-side duration of the <code>/records</code> call itself (so we can split client wait from server work), and (3) whether the tenant was otherwise idle. If the time is in the server, this belongs on metadata-engine with the SQL plan; if it is in the waterfall, I will collapse the gate and the fan-out.</p>
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
The automated screen test timed three loads of the Leads list (Standard layout, 171 records): first rows after 15.5, 11.8 and 16.2 seconds. The target is 1.5 seconds; the ticket said 9.1 seconds, and the manual run on 25 Oct saw 13.4–25.5 seconds.
Environment: staging-crm.taviportal.com, owner account. Automation: RecordScreensUiTest#leadsListSpeed.
Annotated TAVI-vs-Zoho image attached: NDC-2136-retest.png

---
## NDC-2137 · low · CRM
**Custom Views | Kanban headers + first cards p95 5.1 s (target 2 s)**

Summary
Kanban headers + first cards p95 5.1 s (target 2 s).
Found by test case CVS-L09 - Kanban column headers and first cards render within 2 s at p95.
Steps to Reproduce
Before you start:
Logged in as the Owner (Tenant Owner).

Deals Kanban view 'QA CV perf-board' by Stage with Amount aggregate exists.

Open 'QA CV perf-board' and reload it 20 times.

For each load, record the time until every column header (count and sum) and the first cards are shown.

Compute the p95.

Test data:
Loads: 20

Target: p95 ≤ 2 s

Expected Results
The 95th-percentile time to headers and first cards is within 2 seconds.
Actual Results
Deals Kanban 'QA CV deals-by-stage' (Stage, Amount; 12 columns), 20 reloads until all column headers with Amount totals and at least one card are shown: p95 5100 ms, median 2290, min 1261, max 26045.

Target 2 s p95 missed.

Environment
staging-crm.taviportal.com, tenant NDC-Staging (time zone Africa/Cairo), Chromium, 5 October 2026. Accounts: CRM Admin (in place of the Owner role), test user 1 (User profile, has Manage Shared Views), test user 2 (profile "test", no Manage Shared Views). Test case CVS-L09, run execu_2026-10-05_11-20-40.
Attachments
L09-vs-zoho.png: annotated screenshot (TAVI on the left, with the comparison table).

L08-L09-timings.png: original TAVI screenshot (20 reloads).

### Comments (2)
- 2026-10-14T03:08 e1364b0b-d3cd-4167-8261-6194577a480a: <p><b>Triage (code review, 2026-10-14): one demonstrable over-fetch, but the spread needs measuring.</b></p><p>Confirmed from the code: opening a board issues one summary request plus one request per column, each asking for 100 records — so a 12-column board makes 13 calls and fetches up to 1,200 rows to paint first cards. That is a fair thing to cut (a smaller first page per column, with the existing infinite scroll filling in).</p><p>What I cannot conclude from code is the reported spread: a 2.3 s median against a 26 s maximum looks like server or contention variance, not a fixed client cost.</p><p><b>Please attach:</b> (1) per-request timing for the summary and the column calls (HAR), (2) the same board with <code>per_page=25</code> versus <code>100</code> for server-side comparison, and (3) whether the 26 s case coincided with other load. I will then reduce the first-page size and, if the time is server-side, hand the query plan to metadata-engine.</p>
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
Transactions kanban, three reloads: column headers after 2.4, 2.4 and 3.4 seconds, first cards after 3.0, 4.5 and 4.2 seconds. The target is 2 seconds (it was 5.1), so it is better but not there yet.
Also seen on 26 Oct, not part of this ticket: every kanban column says "This value is no longer an option of the field", columns show keys such as Closed_won, and cards show "Resolving owner…".
Environment: staging-crm.taviportal.com, owner account; timings from the manual run on 25 Oct (case KB-04).
Annotated TAVI-vs-Zoho image attached: NDC-2137-retest.png

---
## NDC-2280 · low · CRM
**Custom Views | Long custom view name is not truncated and pushes the Sharing column out of view**

Description:
On the “Manage Leads custom views” page, a custom view with a very long name is shown in full on a single line instead of being truncated. The name stretches the View Name column and pushes the Sharing column off the visible area, so its header and values are cut off (“Sha”, “Onl”, “Eve”). A horizontal scrollbar also appears in the table.
Precondition:
Log in to CRM staging.

Create a Leads custom view with a very long name that has no spaces (e.g. “QA CV” followed by 100+ “x” characters).

Steps to reproduce:
Go to Sales > Leads.

Open the Manage custom views page.

Look at the “All custom views” table.

Expected result:
The long view name is truncated with an ellipsis (full name in a tooltip) or wrapped within its column.

The Sharing column stays fully visible.

The table fits the page width without a horizontal scrollbar.

Actual result:
The long view name is shown in full on one line and stretches the column.

The Sharing column is cut off at the right edge (header shows “Sha”, values show “Onl” / “Eve”).

A horizontal scrollbar appears at the bottom of the table.

Environment:
Staging ONLY (staging-crm.taviportal.com), Edge (Chromium), Windows, viewport about 1280×984.

### Comments (4)
- 2026-10-25T06:35 9c2ff309-bbdb-4be3-b819-3022d9cf3c3b: Deployed to staging-crm.taviportal.com (25 Oct, 04:29 UTC; CRM SPA from client-engine staging c907b2e12). Ready for test — steps in my comment above.
- 2026-10-25T15:27 e1364b0b-d3cd-4167-8261-6194577a480a: Retest FAIL — 25 Oct 2026
Environment: staging-crm.taviportal.com · tenant NDC-Staging (Africa/Cairo) · Edge headless · account mahmoud.mahamed1515 (CRM Admin + Desk Administrator)
Method: manual browser + API (retest round 25 Oct 2026)
Developer's note checked: Column capped and no scrollbar; name still not cut.
At 1280 px the column is capped and all headers fit, but a 116-character name is not cut: the text runs to x=1116 over Shared To, Created By and Last Modified By (overprinting "Only me"). Full name only in a title attribute.
Checked:

- Long name (116 chars, no spaces) → Not cut: text 815 px wide, ends at x=1116; full name only in title attribute [FAIL]

- Sharing column → Header visible, but its cell is overprinted by the name ("Only me") [FAIL]

- Table width → No scrollbar; all headers inside 1280 px [PASS]
Still failing:

- Name not truncated with "…"; overlaps the Shared To / Created By / Last Modified By cells.
Evidence: NDC-2280-retest-FAIL.png
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
In Leads › Manage custom views a long name is not cut off. "Custom View Shared with Tenant Owner => Email Not Empty" runs into its pin icon, and on 25 Oct a 120-character name ran over Shared To, Created By and Last Modified By.
Environment: staging-crm.taviportal.com, owner account.
Annotated TAVI-vs-Zoho image attached: NDC-2280-retest.png

---
## NDC-2174 · urgent · Desk
**Modules and Fields Missings**

Summary
We compared TAVI Desk's Modules and Fields (modules, tabs, layouts and fields) with Zoho Desk. This ticket lists what Zoho Desk has and TAVI Desk does not have yet. Time Entry was not checked. Six items are already filed in NDC-1879 and one in NDC-1866; they are listed at the end and not repeated. Each item has an attached image: TAVI on the left, Zoho Desk on the right, with numbered boxes and a short comparison table.
Missing — tabs and modules
Tab bar set by the admin for everyone. In Zoho a hidden module is hidden for every user, and at least one module must stay. Today TAVI's Organize Tabs changes only your own tab bar ("Changes apply to you only"). Image 01.

Rename any tab. Zoho has a Rename Tabs page with 19 names, including Knowledge Base, Customers, Activities, Analytics, Reports, Dashboards, Community, Social, Chat and IM. Today TAVI can rename only record modules. Image 02.

Missing — fields
Protect the standard fields. In Zoho, core fields are "Non-removable", system-mandatory fields cannot be made optional, other standard fields can only go to Unused Fields, and only custom fields are marked as custom. Today every seeded field is marked "Custom Field"; Subject on Calls, Events and Tasks, Product Name and Contract Name can be deleted; Ticket Subject and Status can be made optional and removed; Contact, Department, Email, Description, Due Date, Priority, Channel, Ticket Owner and Resolution can be removed from the ticket layout (API flags isCustomField, canMarkRequired, canRemoveFromLayout). Image 04.

Layouts per department and the Department field. In Zoho, Tickets, Tasks, Calls, Events and Contracts have one layout per department; Department cannot be removed there and is mandatory on Tasks, Calls, Events and Contracts; Products has a mandatory multi-select Department. Today TAVI layouts are assigned to profiles only, and Department is optional and not on the Tasks, Calls or Events layouts. Image 05.

Missing or different standard fields: Tickets Category and Sub Category (with a dependency); Accounts Annual Revenue and separate Street, City, State and Code; Products Department, and Manufacturer as a pick list; Tasks Remind At; Calls and Events Remind me; Contact Name mandatory on Calls and Events; Call Status mandatory on Calls; Contracts Account Name, Start Date and Support Plan mandatory, plus SLA Name. Image 06.

Picklist tools: Add Values in Bulk (predefined lists, typed values or a file), Sort A–Z, clear all values, and Replace Values at any time, which updates existing records. Today values are added, moved and removed one at a time, and replacement is offered only when removing a used option. Image 07.

Rounding for Decimal and Currency fields (Normal, Round off, Round down, Round up). Today only precision and scale. Zoho side from the help docs. Image 08.

Lookup options: filter which records can be picked (up to 5 criteria), search by up to 6 fields, show up to 6 fields in the pop-up, sort, and fill up to 5 fields from the chosen record. Today only target module, display field, related list title and multi-module. Zoho side from the help docs. Image 09.

Missing — layouts and setup pages
Help Center settings on a layout: Display in Help Center (a column on the Tickets layouts list), Display Name in Help Center, Description, and Allow non-department agents. Today a new layout has a name only. Image 10.

Ticket Status page, per department: add statuses and give each one a type (Open, On Hold, Closed), so that On Hold pauses the SLA clock. Today Status is a plain pick list. Image 11.

Agents as a customisable module. In Zoho, Agents has its own layout, 15 field types and 240 custom fields. TAVI has no Agents module in Modules and Fields (check NDC-1878 for overlap). Image 12.

Missing — found in functional testing (added 13 Oct 2026)
Default value for a field. In Zoho a text, pick list or checkbox field can have a default value, which is filled in on new records only (the Priority value list shows a "Default" tag). Today TAVI's Field Properties (General, Validation, Permissions, Advanced) have no default-value setting, and a defaultValue saved into the layout through the API is ignored: the create form opens empty and a record created through the API with no values is saved empty. Spec rows I19 and I24. Image 13.

Already filed (still missing, seen live in Zoho on 5 Oct 2026)
NDC-1879 item 1: Layout Rules page.

NDC-1879 item 2: Validation Rules page.

NDC-1879 item 3: picklist values per layout.

NDC-1879 item 4: Help Center access per field ("Hide from Help Center", "Editable for End Users").

NDC-1879 item 5: nested and colour-coded picklists.

NDC-1879 item 6: field encryption.

NDC-1866 item 16: ticket number format (Zoho Ticket Id is an Autonumber; TAVI Ticket Number is a read-only single line).

Could not be checked
No Light Agent or Reviewer test account is available. Please give us one account for each of these profiles so we can test field permissions and Light Agent 

### Comments (0)


---
## NDC-2219 · urgent · Desk
**Modules and Fields | A CRM Admin profile gives module and field administration inside Desk**

Summary
A user who has the Desk Agent profile in Desk and the CRM Admin profile in CRM gets CRM Admin's metadata permissions inside Desk, so an agent can open and change Setup → Modules and Fields.
Steps to reproduce
Give a user the Desk Agent profile (Desk) and the CRM Admin profile (CRM).

Sign in to Desk as that user.

Open Setup → Modules and Fields.

Call GET /api/v1/iam/me/permissions with header x-app-key: desk.

Expected result
Only Desk Agent permissions apply in Desk (metadata.records.access, metadata.records.manage). Modules and Fields says "You don't have permission to view this page".
Actual result
The page opens with the full module table and "Create New Module". The permissions response contains CRM Admin's metadata permissions.
Request
GET /api/v1/iam/me/permissions  (x-app-key: desk)Response
200 — includes metadata.modules.manage, metadata.fields.manage_permissions, metadata.capabilities.manage, metadata.views.manage, metadata.integrations.manage, metadata.records.convert. GET /api/v1/iam/profiles/{desk_agent_id}/effective lists only metadata.records.access and metadata.records.manage.Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; Gmail test user with Desk Agent + CRM Admin.
Additional notes
Severity: Critical. Spec row SEC-1 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

MF-11 (Access Control picker lists CRM users) is the same family: Desk reads CRM data.

Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-01).

### Comments (0)


---
## NDC-2662 · urgent · Desk
**Workflow Rules | Create rules whose condition uses Is Overdue, Execution Time, Recent Comment or thread/comment counts write no "Workflow rule ran" row in Ticket History**

Summary. A workflow rule on Tickets with trigger "On create" whose condition uses a computed rule fact — Is Overdue, Execution Time, Recent Comment (and its type), Number of Threads, Number of Comments — runs and its actions are done, but Ticket History gets no "Workflow rule ran" row. The same rule with a normal field in the condition writes the row, and the same fact in an "On edit" rule writes it too.

Steps to reproduce

- Setup › Automation › Workflow Rules › Tickets › new rule: On create, condition Is Overdue is true, action Add comment (private) › Save & Activate.

- Create a ticket with a due date of yesterday.

- Open the ticket › History.

- Repeat with the condition Status is Open instead (control).

Expected

- Every rule run writes "Workflow rule ran · Rule <name> · Triggered by A new ticket · Actions …" (as fixed in NDC-2203), whatever fields the condition uses.

Actual

- Is Overdue (#653), Execution Time (#654), Recent Comment (#661), Thread count (#666), Comment count (#667), and description AND Is Overdue (#662): Execution History shows Fired, the comment is in History "by workflow rule …", but there is no "Workflow rule ran" row (waited 45–60 s).

- Control: no condition (#651), description (#652), Due Date before now (#655), Status (#668), Priority (#669) → the row is written.

- Is Overdue in an On edit rule (#665) → the row is written. Execution records are identical with and without the row.

Impact
History does not explain why a ticket changed for rules that use these conditions; audits and support investigations miss the rule.

Suggested fix
Write the "Workflow rule ran" history entry from the same place for every Create-rule execution, including the path that evaluates rule facts.

Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge + API, 27 Oct 2026. Found while retesting NDC-2203 (F4).
Evidence: NDC-new-rule-ran-row-missing.png (attached).

### Comments (0)


---
## NDC-2222 · high · Desk
**Modules and Fields | A saved field's data type can be changed**

Summary
An existing field can be switched to another data type through the API; existing values are left unconverted.
Steps to reproduce

- Create a single-line field and save a record with text in it.

- Send the request below to change its type to number.

- Read the field and the record.

Expected result
Refused (Zoho: "the field type cannot be changed").
Actual result
200; the field is now a number field and the old text value stays as text.
Request
PUT /api/v1/modules/{module_id}/fields/{field_id}
{"fieldName":"qa_sl","labels":{"en":"QA MF sl"},"datatypeKey":"number","required":false,"unique":false,"uniquePeerModuleIds":[]}Response
200 OK — datatypeKey "number".Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).
Additional notes

- Severity: High. Spec row I13 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-04).

### Comments (0)


---
## NDC-2230 · high · Desk
**Modules and Fields | Field dependency rules (SHOW / REQUIRE) are saved but not applied**

Summary
Field Dependency rules are stored and listed, but neither the record form nor the record API applies them.
Steps to reproduce

- Layout QA MF L-Agent: add rules "When QA MF e2e_kind = Hardware → Show QA MF e2e_serial" and "→ Require QA MF e2e_serial".

- As a Desk Agent: "+" → QA MF Open1 → choose layout QA MF L-Agent.

- Look at QA MF e2e_serial before choosing a kind; choose Hardware; leave serial empty; Save.

Expected result
Serial hidden until Hardware is chosen; then required; Save blocked. The API refuses the same record.
Actual result
Serial is visible before Hardware; the record saves with serial empty ("Record saved successfully"); the API returns 201. Same on module QA MF Deps (SHOW qa_b / REQUIRE qa_c when ctrl = Z).
Request
PUT /api/v1/modules/{module_id}/layouts/{layout_id}  (…"dependencies":[{"id":"{uuid}","parentFieldId":"{kind_id}","parentValues":["Hardware"],"action":"SHOW","childFieldIds":["{serial_id}"]},{"id":"{uuid}","parentFieldId":"{kind_id}","parentValues":["Hardware"],"action":"REQUIRE","childFieldIds":["{serial_id}"]}])
then as the agent: POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF E2E hw no serial"}},{"field":"qa_e2e_kind","value":{"kind":"string","value":"Hardware"}}],"layout_id":"{layout_id}"}Response
Layout PUT → 200 (2 rules stored). Record → 201 Created.Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; tenant owner sets the rules; Desk Agent account (mahmoud.mohamed1, profile lowered for the test) creates the record.
Additional notes

- Severity: High. Spec row I47, E2E-2 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-33).

### Comments (0)


---
## NDC-2231 · high · Desk
**Modules and Fields | Conditional visibility is not applied on the record form**

Summary
A field set to show only when another field has a given value is always shown, and its Required flag applies even while it should be hidden.
Steps to reproduce

- Field "QA MF dep" (required) → Edit Properties → VALIDATION → Conditional visibility: show when QA MF ctrl equals "x" → Apply → Save.

- "+" → create a record, set QA MF ctrl = Z, fill Name and Save.

Expected result
QA MF dep hidden and not required while ctrl ≠ x.
Actual result
QA MF dep is shown and Save says "This field is required" with ctrl = Z.
Request
Layout field config stored: "visibilityRule":{"dependsOn":"qa_ctrl","anyNonEmpty":false,"equalsAny":["x"]}Response
—Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).
Additional notes

- Severity: High. Spec row I27 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Related: NDC-1230 (Controlling Field dropdown in Conditional Visibility).

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-34).

### Comments (0)


---
## NDC-2232 · high · Desk
**Modules and Fields | Department storage has no effect on records**

Summary
A module created with Module Data Storage = Department stores records without a department, and every user sees every record.
Steps to reproduce

- Create New Module "QA MF DeptMod" with Module Data Storage = Department.

- Create records: plain, with header x-department-id, and with department_id in the body.

- List the records as an agent who belongs only to "QA MF Dept", and as an admin.

Expected result
Each record belongs to a department; users see only their departments' records.
Actual result
All creates return 201; records carry no department field; the agent and the admin see the same 4 records; the list is the same with or without a department header.
Request
POST /api/v1/teamspaces/{teamspace_id}/modules {"moduleKey":"qa_mf_deptmod","labels":{"en":"QA MF DeptMod"},"pluralForm":"QA MF DeptMod","singularForm":"QA MF DeptMod1","storageScope":"department"}
POST /api/v1/modules/{module_id}/records {"data":[{"field":"name","value":{"kind":"string","value":"QA MF dept rec hdr"}}]}  (header x-department-id: {department_id})
POST /api/v1/modules/{module_id}/records {"data":[…],"department_id":"{department_id}"}Response
Module 201 (storageScope "department"). Records 201 ×3, no department in the stored record. GET records → same 3–4 records for every user and header.Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; second admin; Desk Agent account (mahmoud.mohamed1, profile lowered for the test).
Additional notes

- Severity: High. Spec row C4 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-35).

### Comments (0)


---
## NDC-2235 · high · Desk
**Modules and Fields | Standard modules offer Delete, and five row-menu items do nothing**

Summary
The row menu on standard modules offers Delete (stopped only when the module has records), and five items only change the URL.
Steps to reproduce
Setup → Modules and Fields → row menu (⋯) on Tickets or Calls.

Click Set Validation Rules, Map Dependency Fields, Button, Links, Assignment Rules.

Click Delete (cancel at the confirmation).

Expected result
No Delete on standard modules; every item opens its page.
Actual result
The five items only add ?tab=… and stay on Layouts. Delete opens a real 'Delete "Tickets"? … Delete module' confirmation; an empty standard module could be deleted.
Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).
Additional notes
Severity: Medium. Spec row B8 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-12).

### Comments (0)


---
## NDC-2387 · high · Desk
**Modules and Fields | A required field can still be set to read-only for a profile, so its users cannot create records**

Summary
NDC-2228 now refuses "Don't Show" (hidden) on a required field, but "Read Only" on the same required field is still accepted. A profile with a read-only required field cannot fill it, so every record it creates fails — the same trap NDC-2228 closed for hidden.
Steps to Reproduce
Desk › QA module (here QA RT MF) with the required field Name.

POST /api/v1/modules/{module}/field-permissions {"fieldId":"{name}","profileId":"44444444-4444-4444-4444-444444444402","permission":"hidden"} (Desk Agent).

Same with "permission":"read_only".

Expected Result
Both refused (or read-only blocked in Field Permissions) for a required field, with a message like the hidden case.

Actual Result
hidden → 422 FIELD_REQUIRED_HIDDEN_CONFLICT "…the profile's users could never create a record."

read_only → 200 and stored; Desk Agents can then not write the required Name, so their creates fail.

Environment
Tenant: NDC-Staging — staging-desk.taviportal.com, module QA RT MF (c0394292-52a2-446d-a326-06733fe289ba)

Account: mahmoud.mahamed1515 (Desk Administrator), 21 Oct 2026

Related: NDC-2228

Evidence: NEW-required-readonly.png (attached)

### Comments (0)


---
## NDC-2637 · high · Desk
**Activities | Rescheduling a call with "log a missed call" fails: "One or more fields in the payload are read-only."**

Summary
On a scheduled call, Reschedule with "The call went unanswered — log a missed call" ticked does nothing except show the error "One or more fields in the payload are read-only." The missed-call record the dialog tries to create copies read-only fields of the call (approval_status, created_at), so the server refuses it, and the call is not moved. Without the tick the same reschedule works.
Steps to Reproduce

- Sign in as a Desk Agent (Customer Support).

- Add a Call with Call Status = scheduled and a start time later today.

- Open the call and click Reschedule.

- Pick tomorrow 10:00, tick The call went unanswered — log a missed call, click Reschedule.

Expected Result

- A missed-call entry is logged for this attempt and the call moves to the new time, as the dialog itself says (and as Zoho Desk does for unanswered calls).

Actual Result

- Error toast "One or more fields in the payload are read-only."

- POST /api/v1/modules/{Calls}/records answers 422 FIELD_PERMISSION_DENIED, detail data.approval_status "Field 'approval_status' is read-only and cannot be changed." The body also carries created_at.

- The call keeps its old start time; no missed call is created.

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js (both fail)

- Account: Desk Agent fedelav803 (Customer Support)

- Observed: 26 Oct 2026, Activity Life Cycle run (case ACT-E6)

- Reference: Zoho Desk Calls help article (reschedule an unanswered call, missed call logged). Our Zoho org has no calls, so it was not tried live.

- Automation: automation/…/deskactivities/ActivityUiTest#rescheduleWithMissedLog

- Gap list: NDC-2635

- Evidence: annotated image attached (dialog, captured request, Zoho Add Call).

### Comments (0)


---
## NDC-2638 · high · Desk
**Activities | A task saved without a status has no status and never shows in Open, My Open or Overdue**

Summary
The Add Task form has no default status, and saving without picking one stores a task with no status at all. Such a task is missing from every working view (Open, My Open, Overdue, Today + Overdue …), even when it is overdue; it can only be found in All Tasks. The same happens for tasks created through the API without a status.
Steps to Reproduce

- Sign in as a Desk Agent. Open Activities › Add Activity › Task.

- Type a subject, set a due date in the past, leave Status as "Select", click Save.

- Open Tasks › Open (and Overdue), search for the subject.

- Open Tasks › All Tasks, same search.

Expected Result

- A new task starts as "Not Started" (Zoho Desk's Add Task form defaults Status to Not Started).

- An open task with a past due date is listed in Open and Overdue.

Actual Result

- The task is saved with no status (API read: status = null).

- Open and Overdue do not list it (Open shows only other tasks); All Tasks does.

- Agents who do not pick a status lose track of their tasks.

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803 (Customer Support)

- Observed: 26 Oct 2026, cases ACT-C1 and ACT-B4

- Reference: Zoho Desk portal taviportal, Tasks › Add Task (live, read-only): Status "Not Started" by default

- Automation: automation/…/deskactivities/ActivityApiTest#newTaskGetsDefaultStatus

- Gap list: NDC-2635

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2661 · high · Desk
**Tickets | Save shows "Permission denied." although the ticket is created — users save again and create duplicates**

Summary. When a user saves a ticket that, after the save, they are no longer allowed to see (owner = a colleague, a team they are not in, or a workflow rule moves it there), Desk answers 403 PERMISSION_DENIED and shows "Permission denied." — but the ticket is created / the edit is saved. On the New Ticket form the form stays open, so users click Save again and create duplicates.

Steps to reproduce

- Sign in as a user who is not an agent of Customer Support but can create tickets (here: Desk Administrator mahmoud.mahamed1515; sees own + unassigned tickets).

- Tickets › New Ticket (Standard) › Department Customer Support, Email, Subject, Status Open, Ticket Owner = a colleague (Customer Experience Specialists 2) › Save.

- Click Save again.

- Sign in as the colleague and open All Tickets.

Expected

- The ticket is saved once with a success message; if the saver can't open it afterwards, say so ("Ticket created. You don't have access to it.") and leave the form (go back to the list). Never report an error for a write that succeeded.

- API: 201 with the id (or a documented response for "created but not visible"), not 403.

Actual

- Step 2: toast "Permission denied." (POST /api/v1/modules/{Tickets}/records → 403), form stays open. Ticket #675 exists.

- Step 3: same 403 again → a second ticket. #676 and #677 both exist with the same subject.

- Same 403 with the record created: API create with another owner (#671) or with a team and no owner (#672); a Create rule "Assign to team" (#605, #616, #617, #658); an Edit rule that moves the ticket to a team (#650, edit saved).

- A Create rule "Assign to specific user" returns 201 (#673) because it runs after the create; the creator silently loses access.

- Control: the same form with no owner/team (unassigned) → 201, the ticket opens (#657).

Impact
Duplicate tickets (customers may get two acknowledgements), users believe the save failed, API clients retry. Any admin or agent creating a ticket for a colleague or a team hits it.

Suggested fix

- Check visibility of the response separately from the write: return 201/200 with the id and a flag (e.g. accessible:false) instead of 403 after committing.

- UI: on that flag show "Ticket created and assigned to …" and close the form.

Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge + API, 27 Oct 2026. Found while retesting NDC-2203 (D1 Assign to team).
Evidence: NDC-new-false-permission-denied.png (attached).

### Comments (0)


---
## NDC-2238 · medium · Desk
**Modules and Fields | Module save has no lost-update protection**

Summary
Two saves of a module with the same rowVersion both succeed; the stale one silently overwrites the other.
Steps to reproduce
GET /api/v1/modules/{module_id} and note rowVersion.

Send PUT with description "tab one" and that rowVersion.

Send PUT with description "tab two (stale)" and the same rowVersion.

Expected result
Second PUT → 409 Conflict.
Actual result
Both 200; description is "tab two (stale)".
Request
PUT /api/v1/modules/{module_id}
{"pluralForm":"QA MF Devices","singularForm":"QA MF Device","description":"tab two (stale)","rowVersion":{same_n}}Response
200 OK (twice).Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).
Additional notes
Severity: Medium. Spec row D7 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-16).

### Comments (0)


---
## NDC-2241 · medium · Desk
**Modules and Fields | Layout save has no lost-update protection**

Summary
Two layout saves with the same rowVersion both succeed and rowVersion never increases.
Steps to reproduce

- GET a layout and note rowVersion.

- Send two PUTs with different names and the same rowVersion.

Expected result
Second PUT → 409.
Actual result
Both 200; the second overwrites the first; rowVersion stays the same.
Request
PUT /api/v1/modules/{module_id}/layouts/{layout_id}
{…full layout…,"name":"QA MF L2 stale","rowVersion":{same_n}}Response
200 OK (twice).Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).
Additional notes

- Severity: Medium. Spec row G26 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-19).

### Comments (0)


---
## NDC-2247 · medium · Desk
**Modules and Fields | Record API stores values for fields that do not exist**

Summary
The record API accepts and keeps values for field names that do not exist on the module; they later collide with real fields.
Steps to reproduce

- On a module without field qa_uq, send the request below.

- Later create qa_uq as a unique field.

- Create a new record with qa_uq = "QA-UQ-1".

Expected result
Unknown field refused (400).
Actual result
First record 201 and the value is kept; after qa_uq is created, the new record is refused as a duplicate (422 "already in use").
Request
POST /api/v1/modules/{module_id}/records
{"data":[{"field":"name","value":{"kind":"string","value":"QA MF uq 1"}},{"field":"qa_uq","value":{"kind":"string","value":"QA-UQ-1"}}],"layout_id":"{default_layout_id}"}Response
201 Created; later 422 RECORD_FIELD_INVALID "QA MF uq is already in use by another record."Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; tenant owner.
Additional notes

- Severity: Medium. Spec row I7 (setup) in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-40).

### Comments (0)


---
## NDC-2248 · medium · Desk
**Modules and Fields | Recycle Bin "Delete forever" fails for every Desk item with no message**

Summary
Permanently deleting a Desk item from the Recycle Bin fails, but the page shows no error.
Steps to reproduce
Setup → Data → Recycle Bin.

Row ⋮ → Delete forever on any Desk item (e.g. a deleted department or record).

Expected result
Item permanently deleted, or an error message.
Actual result
No message; the item stays. Desk items can only expire after 60 days.
Request
POST /api/v1/audit/recycle-bin/delete
{"ids":["607b8057-8e25-4ba8-bfcc-86a320facd4f"]}Response
200 {"success":true,"data":{"succeeded":[],"failed":[{"id":"607b8057-…","reason_key":"recyclebin.error.unsupported_app","detail":null}],"skipped":[]}}Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).
Additional notes
Severity: Medium. Spec row cleanup in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

Related: NDC-1797 (some records cannot be deleted forever in a bulk delete).

Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-46).

### Comments (0)


---
## NDC-2640 · medium · Desk
**Activities | A completed call is read-only on its page but can still be edited through the API**

Summary
The page of a completed call says "Completed calls cannot be edited. Reopen the call to change it." and locks its fields, but the records API accepts edits to the same call. The rule only exists in the screen.
Steps to Reproduce

- Create a call with call_status = completed (or end a call with End Call).

- Open its page: fields are locked with the message above.

- PATCH /api/v1/modules/{Calls}/records/{id} with subject = "QA ACT E8 edited".

Expected Result

- The server refuses changes to a completed call until it is reopened (Zoho Desk: a completed call can no longer be edited).

Actual Result

- PATCH → 200 and the subject changes.

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803

- Observed: 26 Oct 2026, case ACT-E8

- Reference: Zoho Desk Calls help article

- Automation: automation/…/deskactivities/ActivityApiTest#completedCallReadOnlyInApi

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2641 · medium · Desk
**Activities | Completed Time is set by the browser: the API leaves it empty and lets clients backdate it**

Summary
A task's Completed Time (completed_time) is only filled when the screen's "Mark as Complete" sends it. Completing a task through the API (and so through imports, integrations or rules) leaves it empty, and any client can write any date into it.
Steps to Reproduce

- Create a task with status Not Started.

- PATCH /api/v1/modules/{Tasks}/records/{id} with status = "Completed"; read the record.

- On another open task, PATCH completed_time = "2001-01-01T00:00:00Z"; read the record.

Expected Result

- The server sets Completed Time when the status becomes Completed (and clears it on reopen); clients cannot write it. In Zoho Desk completedTime is a read-only attribute.

Actual Result

- After step 2: completed_time = null.

- After step 3: 200 and completed_time = 2001-01-01T00:00:00Z on an open task.

- "Mark as Complete" in the screen does fill it (sent by the browser).

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803

- Observed: 26 Oct 2026, cases ACT-D8 and ACT-M2

- Reference: Zoho Desk API (Task completedTime read-only)

- Automation: automation/…/deskactivities/ActivityApiTest#completedTimeSetByServer, #completedTimeIsReadOnly

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2644 · medium · Desk
**Ticket Replies | "Save draft" keeps the draft only in this browser; nothing is saved on the server**

Summary
"Save draft" in the reply composer closes the composer and puts a DRAFT badge on Reply All, but the draft is only kept in the browser's localStorage (key desk.composer.draft:<user>:<ticket>). No request reaches the server, so the draft is lost on another browser or device, and other agents cannot see that someone is drafting. The server already has a drafts API (PUT /desk/tickets/{id}/drafts/mine works and is used by Send for review). Related: NDC-2179 (scheduled-reply draft not shown in the reply box, Done).
Steps to Reproduce
Sign in as a Desk Agent; open an email ticket; click Reply All and type some text.

Click Save draft.

Call GET /api/v1/desk/tickets/{id}/drafts/mine (or open the ticket in another browser as the same agent and click Reply All).

Expected Result
The draft is stored on the ticket on the server and comes back for the same agent anywhere (Zoho Desk also auto-saves every 2 minutes and shows "Edit Draft").

Actual Result
No request to /drafts when Save draft is clicked.

GET drafts/mine → 404 "You have no draft on this ticket."

The text exists only in localStorage of this browser; another browser shows no draft.

Environment
Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

Account: Desk Agent fedelav803 (Customer Support), ticket #518

Observed: 26 Oct 2026, case RPL-E1

Reference: Zoho Desk help docs (drafts) and live Reply All composer (read-only)

Automation: automation/…/deskticketreplies/ReplyUiTest#saveDraftReachesServer

Gap list: NDC-2636

Evidence: annotated image attached.

### Comments (0)


---
## NDC-2251 · low · Desk
**Modules and Fields | Web Tabs placeholder says "inside the CRM"**

Summary
Desk shows CRM wording on the Web Tabs placeholder.
Steps to reproduce

- Setup → Modules and Fields → Web Tabs.

Expected result
Desk wording.
Actual result
Text says "inside the CRM".
Evidence
Attached: the annotated image (TAVI vs Zoho, numbered boxes and an expected-vs-actual table) and the original screenshot.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 5–6 Oct 2026; admin account (Desk Administrator).
Additional notes

- Severity: Low. Spec row B7 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 1.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-25).

### Comments (0)


---
## NDC-2260 · low · Desk
**Modules and Fields | Rollup summary accepts a relation that does not point at the module**

Summary
A rollup can be created over a lookup that does not point at the module (or does not exist yet).
Steps to reproduce
Send the request below on QA MF DeptMod (qa_lk on QA MF Types points at QA MF Open, not DeptMod).

Expected result
Refused ("The selected module has no lookup field pointing at this module").
Actual result
201. Rollups were also accepted while the lookup field did not exist.
Request
POST /api/v1/modules/{deptmod_id}/fields
{"fields":[{"fieldName":"qa_bad_rollup","labels":{"en":"QA MF bad_rollup"},"datatypeKey":"rollup_summary","datatypeOptions":{"target_module_id":"{types_id}","relation_field":"qa_lk","target_field":"qa_num","aggregation":"count"}}]}Response
201 Created.Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; tenant owner.
Additional notes
Severity: Low. Spec row I36 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

Related: NDC-1444 (rollup says there is no lookup when there is one).

Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-42).

### Comments (0)


---
## NDC-2261 · low · Desk
**Modules and Fields | Layout API accepts Required + Read-only on the same field**

Summary
The builder blocks Required + Read-only together, but the layout API accepts it.
Steps to reproduce

- Send a layout PUT where one field entry has config required:true and read_only:true.

Expected result
400 — cannot be both.
Actual result
200.
Request
PUT /api/v1/modules/{module_id}/layouts/{layout_id} {…{"fieldName":"qa_req","config":{"required":true,"read_only":true}}…}Response
200 OK.Evidence
API only — see the request and response above.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).
Additional notes

- Severity: Low. Spec row I5 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-43).

### Comments (0)


---
## NDC-2262 · low · Desk
**Modules and Fields | Quick-create trigger dialog shows a raw "{{module}}" placeholder**

Summary
The quick-create pop-up shows an untranslated placeholder.
Steps to reproduce

- Pick list with quick-create trigger "Escalate → Tasks".

- On the create form choose Escalate.

Expected result
"This Task is created only after you save the record…"
Actual result
"This {{module}} is created only after you save the record…"
Evidence
No screenshot — the dialog text was read during the run; follow the steps above to see it.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), TAVI Desk web app, headless Chromium, 6–7 Oct 2026; second admin (Desk Administrator).
Additional notes

- Severity: Low. Spec row I37 in docs/desk-modules-fields/spec-desk-modules-fields.md (QA repository), functional run 2.

- Full bug report: docs/desk-modules-fields/desk-modules-fields-bug-report.md (MF-45).

### Comments (0)


---
## NDC-2399 · low · Desk
**CRM - Desk Integration | No notice to the admin when the initial sync finishes**

Summary
After Connect, the initial customer and contract imports run and finish, but the admin gets no bell entry or email saying the sync is complete.
Steps to reproduce
Desk → Settings → CRM ⇄ Desk Integration → Disconnect, then Connect.

Wait for the initial imports to finish (Sync History or GET /api/v1/desk/integrations/crm/runs).

Check the admin's notifications.

Expected result
The admin is told when the initial sync is done (NDC-1669 §4). Zoho sends an email with added / updated / ignored counts and the skip reasons.
Actual result
Runs initial_customers and initial_contracts finished within seconds; no notification since the connect.
Evidence
Annotated image CD-07 (executions/execu_2026-10-20_crm-desk-integration/evidence/CD-07-no-initial-sync-notice-vs-zoho.png) is attached or will be attached to this ticket.
Environment
staging-desk.taviportal.com (tenant NDC-Staging), Edge + API, 20 and 21 October 2026 (two approved reconnects), owner account.
Additional notes
Spec row B11; the Zoho report is also listed as a missing feature in NDC-2392; PRD NDC-1669.

Full bug report: executions/execu_2026-10-20_crm-desk-integration/bug-report.html (CD-07) in the QA repository.

### Comments (2)
- 2026-10-26T09:16 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 25–26 Oct 2026
Environment: staging-crm.taviportal.com + staging-desk.taviportal.com · tenant NDC-Staging · Edge headless · mahmoud.mahamed1515 (CRM Admin + Desk Administrator); test users 1/2, mahmoud.mmohamedsamy, Desk Agent fedelav803
Method: manual browser + API (retest round 25–26 Oct 2026)
Developer's note checked: —
Needs Disconnect + Connect of the shared staging integration to see the initial-sync notice; not run without explicit OK.
Checked:

- Disconnect + Connect, wait for the initial imports → Not run — needs approval to reconnect the shared integration (approval covered pause/resume/settings only) [BLOCKED]

- Next step → Ask at Gate 2; run once approved [INFO]
Still failing:

- Not run — needs approval to disconnect/reconnect the integration.
Not run: needs Disconnect + Connect of the shared staging CRM ⇄ Desk integration; the test agent safety check refused it. State left in Ready For Test.
Evidence: NDC-2399-retest-BLOCKED.png
- 2026-10-26T10:14 e1364b0b-d3cd-4167-8261-6194577a480a: Retest PARTIAL — 26 Oct 2026 (second retest; the first was not run)
Environment: staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) · account mahmoud.mahamed1515 (Desk Administrator)
Method: Manual browser (Desk › Settings › CRM ⇄ Desk Integration › Disconnect, then Connect) + API
Checked:

- Admin told when initial sync is done → 2 bell notices ("CRM customer/contract sync finished: …") within seconds of the runs [PASS]

- Counts → "0 added, 0 updated, 5 could not sync" — 14 skipped (ignored) customers missing [FAIL]

- Skip / failure reasons → Notice says "The Failure Log lists the records that could not sync" — none of the 7 are there; no reasons anywhere [FAIL]

- Bell title → Truncated to "…finished: 0 added, …" in the list [INFO]

- Email → Not checked — no access to the admin mailbox [INFO]

- Settings after reconnect → Config identical to the backup except import timestamps [PASS]
Still failing:

- Step 3: expected added / updated / ignored counts, actual "0 added, 0 updated, 5 could not sync" — the 14 skipped customers of the run (requested 19, skipped 14, needs_attention 5) are not mentioned.

- Step 3: expected skip reasons, actual the notice says "The Failure Log lists the records that could not sync", but the Failure Log has none of the 7 records from this run (still 19 entries, newest 07:30 UTC, before the reconnect at 08:05 UTC).
Evidence: NDC-2399-retest-PARTIAL.png (attached)

---
## NDC-2639 · low · Desk
**Activities | Priority, call status and direction show raw keys ("highest", "scheduled", "outbound")**

Summary
Activity pages, lists and the ticket ACTIVITY tab show the stored keys of picklists instead of their labels: Priority "highest", Call Status "scheduled" / "missed" / "completed", Direction "outbound". The same issue was fixed for ticket Priority and Channel in NDC-2378.
Steps to Reproduce

- Open a task whose priority is Highest.

- Open a scheduled outbound call.

- Open the ACTIVITY tab of a ticket that has calls.

Expected Result

- Labels: Highest / High / Normal / Low / Lowest; Scheduled, Missed, Completed; Inbound / Outbound (as in Zoho Desk).

Actual Result

- Task page: Priority "highest".

- Call page: Call Status "scheduled", Direction "outbound".

- Ticket ACTIVITY tab rows: "scheduled", "missed".

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803

- Observed: 26 Oct 2026, case ACT-D10

- Reference: Zoho Desk Add Task / Add Call forms (live, read-only)

- Automation: automation/…/deskactivities/ActivityUiTest#priorityLabel

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2642 · low · Desk
**Activities | Call duration accepts any text ("abc", "-1", "99:99")**

Summary
Call Duration (call_duration) is a free text field: the records API stores "abc", "-1" and "99:99". End Call writes "00:00:10" (HH:MM:SS) while the page label says "Duration (HH:MM)", so the format is not even consistent.
Steps to Reproduce

- POST /api/v1/modules/{Calls}/records with call_status = completed, a start time, and call_duration = "abc"; then "-1"; then "99:99".

Expected Result

- Only a real duration is accepted (Zoho Desk: HH : MM number boxes in the form, seconds as an integer in the API); bad values are refused with a field message.

Actual Result

- All three are saved (201).

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803

- Observed: 26 Oct 2026, case ACT-C8

- Reference: Zoho Desk Add Call form (live, read-only)

- Automation: automation/…/deskactivities/ActivityApiTest#callDurationValidated

- Evidence: annotated image attached.

### Comments (0)


---
## NDC-2643 · low · Desk
**Activities | Add Task / Call / Event drawer fields and reminder options have no accessible names**

Summary
In the Add Task / Add Call / Add Event drawer the visible labels are not linked to their controls, so a screen reader announces nothing useful: Subject, Due Date and Description have no name, Ticket and Contact are both "Choose a record…", and Priority and Status are both "Select". The reminder options (on the due date / before / at a time) are unlabelled radio buttons.
Steps to Reproduce

- Open Activities › Add Activity › Task.

- Inspect the controls (or Tab through them with a screen reader).

- Open a task and click Set Reminder; inspect the timing radios.

Expected Result

- Every control is named after its label (Subject, Ticket, Due Date, Task Owner, Contact Name, Team, Priority, Status, Description; reminder timing options).

Actual Result

- input "Subject": no name, placeholder only; Due Date and Description: no name.

- Ticket and Contact Name: both "Choose a record…"; Priority and Status: both "Select".

- Reminder radios: values at / before / custom, no label.

Environment

- Tenant: NDC-Staging — staging-desk.taviportal.com, builds index-PA6o3K2s.js and index-7qe5X0Gd.js

- Account: Desk Agent fedelav803

- Observed: 26 Oct 2026, case ACT-O3

- Reference: Zoho Desk Add Task form (live): every field has a visible label; its screen-reader names were not checked

- Evidence: annotated image attached (drawer + DOM dump).

### Comments (0)


---
## NDC-2660 · low · Desk
**Ticket History | Creation row shows "department_id" and the raw department id instead of the department name**

Summary. When a ticket is created, Ticket History writes a "Department changed" row that shows the internal field key department_id and the department's raw id (e.g. 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158) instead of the department name, attributed to "System". Same in Arabic. A later move between departments is shown correctly with names.

Steps to reproduce

- Desk › Tickets › New Ticket (layout Standard), Department = Customer Support, fill Email, Subject, Status = Open › Save.

- Open the ticket › History tab › scroll to the rows at creation time.

- Switch the language to العربية and look at the same row.

- Control: on another ticket use the department chip › Move ticket › HR › Move, then open History.

Expected

- The creation entry names the department: e.g. "Department: Customer Support" (or the department listed in "Ticket was created by …"), never a field key or an id. Zoho Desk (live, portal taviportal, ticket #101): the creation entry "… submitted a new ticket via email" lists "Department  Anyware Software" — the name, no id, no separate "changed" row.

- The same in Arabic (قسم: Customer Support).

Actual

- #657 (27 Oct 15:52): "Department changed · Field department_id · Old blank · New 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158 · by System"; the "Ticket was created by mahmoud.mahamed1515" row lists Subject and Status but no department.

- Arabic: "تغيّر القسم · الحقل department_id · القديم فارغ · الجديد 7e1ac409-… · بواسطة النظام".

- Same on every ticket created by form or API in this round (#598, #651, …).

- Control #656: a real move shows "Ticket moved to another department · From Customer Support · To HR" and "Department was updated · Old Customer Support · New HR" — names are resolved there.

Impact
Agents and admins see an unreadable id and an internal field key in every ticket's history; it looks like a system change rather than the creator's choice.

Suggested fix

- Resolve the department id to its name (as the Move rows already do) and show the field label "Department", not department_id.

- Prefer recording the department inside the "Ticket was created" entry instead of a separate "changed from blank" row by System.

Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge, account mahmoud.mahamed1515 (Desk Administrator), 27 Oct 2026. Found while retesting NDC-2203.

Evidence: NDC-new-dept-history-BUG.png (attached).

### Comments (0)


---
## NDC-1630 · high · None
**Modules and Fields | A new module's record form shows no fields until the layout is saved once, even the required Name field is not shown**

Summary
After creating a new module, the record creation form shows no fields at all. The Name field — which is not a system field and is required by default — does not appear, leaving an empty panel between the image upload and Notes.
The field is present in the layout. Opening the layout builder, adding any other field and saving makes Name appear alongside it. In the recording, adding a Phone field and saving produced a form showing both * Name and Phone.
Until that first save, the module cannot be used: a record cannot be created without the required Name, and the field is not on screen to fill in.
Steps to Reproduce
Go to Settings › Modules and Fields and click Create New Module.

Enter a module name — here test — and click Create. The module saves successfully.

Open the module and then its Default layout, confirming the Name field is present. Close without changing anything.

Go to the new module in the sidebar and click Create test.

Look at the record form — note the empty panel between the image upload and Notes, with no Name field.

Return to Settings › Modules and Fields › the module › Default layout.

Drag any field into the layout — here Phone — and click Save. The layout saves successfully.

Go back to the module and click Create test again.

Note that Basic Information now appears, containing both Name (marked required) and Phone.

Expected Result
A newly created module's record form should show the fields on its default layout immediately.

The Name field should be present and marked required, without the layout needing to be saved first.

Creating a module should produce a usable layout straight away.

Actual Result
Immediately after creating the module, the record form shows only the image upload and Notes, with an empty panel between them.

The Name field does not appear, even though it is required by default.

A record cannot be created, since the required field is not on the form.

After adding any field to the layout and saving, Basic Information appears containing both Name and the newly added field.

The Name field therefore existed all along and was simply not rendered until the layout had been saved once.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Modules and Fields; new module record form

URLs: https://crm.taviportal.com/settings/modules-and-fields/2962ba0b-8fb0-44de-bcbb-fc4f087652a7 · https://crm.taviportal.com/modules/2962ba0b-8fb0-44de-bcbb-fc4f087652a7/records/new?layout=5a4c7bee-01eb-46c7-b1ea-61505eb98ff5

Module created: "test" (2962ba0b-8fb0-44de-bcbb-fc4f087652a7)

Layout: Default (5a4c7bee-01eb-46c7-b1ea-61505eb98ff5)

Field added to trigger the fix: Phone

Browser: Microsoft Edge 152.0.7977.83

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 14 September 2026, 08:59 UTC

Attachment
Attachment

### Comments (0)


---
## NDC-1637 · high · None
**Recycle Bin | Deleting a module leaves its records in the Recycle Bin**

Summary
When a module is deleted, records belonging to it that were already in the Recycle Bin are left behind. They remain listed after the module no longer exists.
Those entries can no longer be meaningful: their module is gone, so they cannot be restored to anything, and the module they name cannot be opened. They simply accumulate in the Recycle Bin.
Steps to Reproduce
Go to a module and select one or more records using the row checkboxes.

Open the actions menu and choose Delete Selected, then confirm with Delete.

Go to Settings › Data › Recycle Bin and confirm the deleted records are listed.

Go to Settings › Modules and Fields and open that module's options menu.

Click Delete module and confirm.

Return to Settings › Data › Recycle Bin and refresh the page.

Look for the records belonging to the deleted module.

Expected Result
Deleting a module should also remove its records from the Recycle Bin, since they can no longer be restored.

The Recycle Bin should contain only items that could still be recovered.

Actual Result
Records belonging to the deleted module remain listed in the Recycle Bin after the module has been deleted.

They reference a module that no longer exists, so they cannot be restored.

Nothing indicates that their module has been removed.

The Recycle Bin accumulates entries that serve no purpose.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Data › Recycle Bin; Settings › Modules and Fields

URLs: https://crm.taviportal.com/settings/data/recycle-bin · https://crm.taviportal.com/settings/modules-and-fields

Browser: Microsoft Edge 152.0.7977.83

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 14 September 2026, 09:07 UTC

Attachment
Attachment

### Comments (0)


---
## NDC-1643 · high · None
**Audit Log | Some entries show the raw stored data instead of a readable description of the change**

Summary
Audit entries for fields whose value is a stored document print that document in full, before and after, rather than describing what changed.
Entries for ordinary fields read well — "Updated Blueprint's IsActive from no to yes", "Updated Blueprint's UpdatedAt from 08/30/2026 09:28:00 to 09/14/2026 09:41:00". But an entry for DefinitionJson or LayoutJson dumps the whole structure, running for dozens of lines and burying every other entry around it.
The dumped content includes blueprint states, canvas positions, transitions, field validations, layout sections, field definitions with API names and permission flags — and in one case the HTML body of an email template. None of it tells the reader what actually changed.
Steps to Reproduce
Open a blueprint, make a change — for example activate it or alter a transition — and save.

Open a module layout, add or move a field, and save.

Go to Settings › Security Control › Audit Log.

Find the entries recorded for those two changes.

Compare an entry for a simple field such as IsActive with one for DefinitionJson or LayoutJson.

Expected Result
An audit entry should describe what changed, not reproduce the stored value.

For a document-valued field, the entry should summarise the difference — for example "Updated Blueprint: added transition 'QualificationToNeedsAnalysis'" or "Updated Layout: added field 'Phone' to Basic Information".

The changelog should be readable directly on the Audit Log page. Every change the activity contained should be listed there in plain terms, and the raw document should not be shown at all.

Entries should be a consistent size, so no single change overwhelms the log.

Actual Result
Entries for DefinitionJson and LayoutJson print the complete document both before and after the change.

A single entry runs for dozens of lines, pushing surrounding entries out of view.

The content includes internal identifiers, canvas coordinates, datatype keys, permission flags, row versions and timestamps.

One entry contains the full HTML body of an email template, including its greeting and sign-off.

The reader cannot tell what changed without comparing two large documents by eye.

Simple fields in the same log render correctly, so the behavior is inconsistent within the feature.

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Security Control › Audit Log

URL: https://crm.taviportal.com/settings/security/audit-log

Fields affected: Blueprint DefinitionJson, Layout View LayoutJson

Fields rendering correctly: IsActive, UpdatedAt, and record added/deleted entries

Browser: Microsoft Edge 152.0.7977.83

OS: Windows 10 (x86, 64-bit)

Viewport: 1272 × 866

Reporter: Mahmoud Mohamed

Captured: 14 September 2026, 10:41 UTC

Attachment
Attachment

### Comments (0)


---
## NDC-1659 · high · None
**Recycle Bin | Configuration entities should not be listed — Users, Profiles, Org Units, Layouts, Modules, TeamSpace and Pipelines cannot be meaningfully restored**

Summary
Deleting a configuration entity places it in the Recycle Bin, alongside deleted records. These entity types should not appear there:
Users

Profiles

Org Units

Layouts

Modules

TeamSpace

Pipelines

The Recycle Bin exists so a deleted item can be recovered. These cannot be recovered meaningfully: each is referenced by other configuration and by records, so restoring one in isolation does not restore the state that existed before it was deleted. Listing them offers a recovery that the system cannot deliver.
Steps to Reproduce
Delete one of each: a Profile, an Org Unit, a Layout, a Module, a Team space and a Pipeline.

Go to Settings › Data › Recycle Bin.

Note that each deleted entity appears in the list, with an expiry countdown.

Attempt to restore one.

Expected Result
Users, Profiles, Org Units, Layouts, Modules, TeamSpace and Pipelines should not appear in the Recycle Bin.

The Recycle Bin should list only records — items a restore can genuinely return to their previous state.

Deleting a configuration entity should warn about its consequences at the point of deletion, since it cannot be undone afterwards.

Actual Result
The Recycle Bin offers Users, Profiles, Org-Units are offered as Module filter options

Environment
Tenant: NDC-Staging tenant

App: Anyware CRM — Settings › Data › Recycle Bin

URL: https://crm.taviportal.com/settings/data/recycle-bin

Entity types involved: Profiles, Org Units, Layouts, Modules, Teamspaces, Pipelines

Reported: 15 September 2026

### Comments (0)


---
## NDC-1660 · medium · None
**Recycle Bin | The Module filter offers Omnichannel modules alongside CRM ones**

Summary
The Module filter in the Recycle Bin lists modules belonging to the Omnichannel application, mixed in with the CRM modules the page is scoped to.
The Recycle Bin sits under CRM settings and shows deleted CRM records. Offering Omnichannel modules in its filter is confusing — a user scanning the list cannot tell which application each option belongs to, and selecting one either returns nothing or returns records from a different application than they expected.
Steps to Reproduce

- Go to Settings › Data › Recycle Bin.

- Click Filters and open the Module filter.

- Review the full list of modules offered.

- Compare it against the modules present in the CRM application under Settings › Modules and Fields.

- Note the options belonging to Omnichannel rather than CRM.

- Select one and check what the list returns.
Expected Result

- The Module filter should offer only the modules of the application the Recycle Bin belongs to.

- Omnichannel modules should not appear in a CRM-scoped filter.

- If deleted items from more than one application are genuinely held in one Recycle Bin, each option should be labelled with its application, and the list grouped accordingly.
Actual Result

- The Module filter lists Omnichannel modules alongside CRM modules.

- Nothing distinguishes them, so a user cannot tell which application an option belongs to.

- The filter therefore offers options that do not correspond to the records the page is showing.
Root cause
The Module filter appears to be populated from the full set of modules across the tenant rather than from those belonging to the current application. The Recycle Bin listing itself is CRM-scoped, so the filter and the list are drawn from different sources.
Suggested fix

- Populate the Module filter from the modules of the current application only.

- If the Recycle Bin is intended to span applications, label each option with its application and group the list, and make sure the records shown match that scope.
Question for the team
Is Omnichannel a separate application within the same tenant, or a different product?
If the same tenant, this is a filter-scoping problem. If a different product, it is a data-scoping leak of the same class as NDC-1342, where an account from another tenant appeared in the Audit Log — and would warrant a higher priority.
Related

- NDC-1344 — the Audit Log entity filter is incomplete and does not cover all system entities. Same class of problem on a neighbouring screen: a filter list that does not match what the page holds.

- NDC-1342 — an account from another tenant appears in this tenant's audit log.

- NDC-1637 and NDC-1659 — other open Recycle Bin tickets.
Notes for verification

- The specific Omnichannel options are not recorded. No screenshot of the open Module filter is available, so this ticket does not name which modules appear. Worth capturing on retest, since naming them is what allows the fix to be confirmed.

- The Recycle Bin currently holds 1000+ items, so the filter list may be long; the Omnichannel options may not be adjacent to one another.
Environment

- Tenant: NDC-Staging tenant

- App: Anyware CRM — Settings › Data › Recycle Bin › Filters › Module

- URL: https://crm.taviportal.com/settings/data/recycle-bin

- Reported: 15 September 2026

### Comments (0)
