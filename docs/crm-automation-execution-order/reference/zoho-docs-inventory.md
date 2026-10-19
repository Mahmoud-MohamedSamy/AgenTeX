# Zoho CRM automation inventory and order of execution (reference for TAVI CRM QA)

Compiled 18 Oct 2026 from public Zoho docs: help.zoho.com KB (current `crm`, `crm-v2-1`, `crm-nextgen` and `crm-help-old` trees), Zoho CRM API v8 docs, the edition comparison page and official Zoho community posts. This was read-only web research. Nothing was logged into.

**How to read this**
- Every item has a source. **(inferred)** means the docs do not say it and it is reasoned from related statements. **(community)** means it comes from a Zoho community thread or support reply, not the KB.
- Modules in scope: **Leads, Deals, Tasks**.
- Where Zoho pages contradict each other, both versions are given and the conflict is marked **CONFLICT**.

Source key (used in tables):

| Key | URL |
|---|---|
| S-OPS | https://help.zoho.com/portal/en/kb/crm/getting-started/product-architecture-and-reliability/articles/how-zoho-crm-administration-and-configuration-works-for-sales-operations |
| S-WF | https://help.zoho.com/portal/en/kb/crm-v2-1/automate-business-processes/workflow-management/articles/crm-v2-configuring-workflow-rules |
| S-WF-FAQ | https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/automation/workflow-rules/articles/crm-v2-exist-faqs-workflow |
| S-OWNER | https://help.zoho.com/portal/en/kb/crm/automate-business-processes/actions/articles/assigning-record-owner |
| S-CONV-WF | https://help.zoho.com/portal/en/kb/crm/automate-business-processes/workflow-management/articles/convert-records-using-workflow-rule |
| S-AR | https://help.zoho.com/portal/en/kb/crm-nextgen/automate-business-processes/assignment-rules/articles/nextgen-set-assignment-rules |
| S-AR2 | https://help.zoho.com/portal/en/kb/crm/automate-business-processes/assignment-rules/articles/set-assignment-rules |
| S-RP | https://help.zoho.com/portal/en/kb/crm/process-management/review-process/articles/review-process |
| S-RP-FAQ | https://help.zoho.com/portal/en/kb/crm/faqs/review-process/articles/faqs-review-process |
| S-RP-CMP | https://help.zoho.com/portal/en/kb/crm-v2-1/process-management/review-process/articles/crm-v2-comparison-between-review-process-and-approval-process |
| S-AP | https://help.zoho.com/portal/en/kb/crm/process-management/approval-process/articles/add-approval-process |
| S-AP-21 | https://help.zoho.com/portal/en/kb/crm-v2-1/process-management/approval-process/articles/crm-v2-add-approval-process |
| S-AP-FAQ | https://help.zoho.com/portal/en/kb/crm/faqs/approval-process/articles/faqs-on-approval-process |
| S-AP-FAQ21 | https://help.zoho.com/portal/en/kb/crm-v2-1/faqs/approval-process/articles/crm-v2-exist-faqs-on-approval-process |
| S-AP-NEW | https://help.zoho.com/portal/ja/community/topic/manage-approvals-like-never-before-more-control-flexibility-and-transparency-in-your-approval-process (official announcement, about Feb 2025 (inferred)) |
| S-BP-DES | https://help.zoho.com/portal/en/kb/crm-v2-1/process-management/blueprint/articles/crm-v2-design-a-blueprint |
| S-BP-EXE | https://help.zoho.com/portal/en/kb/crm/process-management/blueprint/articles/execute-blueprint |
| S-BP-FAQ | https://help.zoho.com/portal/en/kb/crm/faqs/blueprint/articles/can-workflows-or-approvals-or-assignment-rules-overwrite-blueprint |
| S-BP-TS | https://help.zoho.com/portal/en/kb/crm/troubleshooting/articles/troubleshooting-blueprint |
| S-BP-COMM | https://help.zoho.com/portal/en/community/topic/zoho-crm-record-in-blueprint-unable-to-initiate-any-form-of-approval-process (community) |
| S-BP-API | https://www.zoho.com/crm/developer/docs/api/blueprint-details.html |
| S-API-INS | https://www.zoho.com/crm/developer/docs/api/v8/insert-records.html |
| S-API-UPD | https://www.zoho.com/crm/developer/docs/api/v8/update-records.html |
| S-API-UPS | https://www.zoho.com/crm/developer/docs/api/v8/upsert-records.html |
| S-API-CONV | https://www.zoho.com/crm/developer/docs/api/v8/convert-lead.html |
| S-API-MOD | https://www.zoho.com/crm/developer/docs/api/v8/modules-api.html |
| S-KZ33 | https://help.zoho.com/portal/en/community/topic/kaizen-33-triggering-workflow-rules-approvals-and-blueprints-via-zoho-crm-api (official Zoho developer series) |
| S-IMP | https://help.zoho.com/portal/en/kb/crm/data-administration/import-data/articles/import-data-into-a-crm-module |
| S-IMP-ANN | https://help.zoho.com/portal/en/community/topic/execute-automation-and-other-processes-during-import (official announcement) |
| S-IMP-TS | https://help.zoho.com/portal/en/kb/crm/troubleshooting/articles/troubleshooting-data-import-export |
| S-IMP-FAQ | https://help.zoho.com/portal/en/kb/crm/faqs/data-administration/import/articles/faqs-import |
| S-WEB | https://help.zoho.com/portal/en/kb/crm/connect-with-customers/webforms/articles/set-up-web-forms |
| S-WEB-FAQ | https://help.zoho.com/portal/en/kb/crm/faqs/channels/articles/faqs-webforms |
| S-LOCK | https://help.zoho.com/portal/en/kb/crm/customize-crm-account/record-level-customization/articles/record-locking-configuration-and-usage |
| S-ED | https://www.zoho.com/crm/comparison.html (edition comparison; the page says last updated June 2022) |

---

## A. Order of execution

### A.1 The official chain

| # | Statement | Source |
|---|---|---|
| A1 | **Current official order:** "Assignment rule, Review process, Scoring Rules, Workflow Rule, Approval Process, Blueprint, Scoring Rules, CommandCenter". | S-OPS, S-WF, S-WF-FAQ (Q27) |
| A2 | Scoring runs twice, "to ensure the score is updated upon execution of actions". In other words, it re-scores after workflow and approval field updates. | S-OPS |
| A3 | **Older order** (Blueprint troubleshooting page): "assignment rules > workflow rules > approval process > Blueprint > case escalation rules". This version has no Review or Scoring step and adds Case escalation, which applies only to Cases. | S-BP-TS |
| A4 | **Approval FAQ order:** "Assignment Rules: Any record entering CRM must have an owner, so the assignment rules are executed first", then the Review Process, then the Approval Process. "These three processes will take place in a sequential manner." "If any workflow rules are also configured, they will be triggered based on their execution criteria." "The Timeline will display the order each process was executed." | S-AP-FAQ21 (Q34), S-AP-FAQ (Q34) |
| A5 | **What runs before Review:** records pass through validation rules, web-form approval and layout rules first. Sync to other Zoho apps happens only after review completes. | S-RP |
| A6 | **CONFLICT on Review vs Approval:** the Review FAQ says "If approval and review are both configured… validations and approvals run first, then the record enters review" (Q16), and "Validations and approvals run before review" (Q26). That contradicts A1/A4, which put Review before Approval. The likely reading **(inferred)** is that "approval" in the Review FAQ means **web-form/import manual record approval** ("Request for Approval" / Approve Leads), not the Approval Process. This matches A5, which says "web form approval" runs before review. TAVI should follow A1. | S-RP-FAQ, S-RP |
| A7 | **Inside one workflow rule,** actions run in this order: field updates → tags → [parallel: email notifications, tasks, webhooks, functions, custom actions, create record, Cliq/Slack notifications, alerts] → convert. | S-WF, S-WF-FAQ (Q27) |
| A8 | Several workflow rules on the same module run "in chronological order" (by creation date). They can be reordered in the list view after selecting a module. | S-WF |
| A9 | Several approval processes default to creation order, oldest at the top. They can be reordered, and rules can be reordered only within the same module. | S-AP-FAQ (Q2, Q19) |
| A10 | Several review processes run in list order, newest first by default, and can be reordered by drag and drop. | S-RP |
| A11 | Several blueprints: "Whichever Blueprint appears foremost in the list gets executed." They can be reordered. | S-BP-FAQ (Q4) |
| A12 | **Validation rules:** not placed in the official chain. Through the API they run only if requested with `apply_feature_execution: [{name:"criteria_validation_rule"}]`. In the UI they run on save, before review (A5). Treat validation as a pre-save gate before Assignment **(inferred)**. | S-API-INS, S-API-UPD, S-RP |
| A13 | **Duplicate check:** "Duplicates are checked for every insert record API call based on unique fields". It returns DUPLICATE_DATA, so the record is never created and no automation runs **(inferred)**. Upsert uses `duplicate_check_fields` to decide between insert and update. | S-API-INS, S-API-UPS |
| A14 | **Case escalation** runs after Blueprint (old order) and is Cases-only, so it is not relevant to Leads, Deals or Tasks. | S-BP-TS |
| A15 | **Cadences** run automatically on API create and update unless `skip_feature_execution: [{name:"cadences"}]` is sent. They are not placed in the order. | S-API-INS, S-API-UPD |
| A16 | Data Enrichment: no Zoho doc found that places it in the chain. See Open questions. | — |

**Confirmed reference chain for TAVI (Leads, Deals, Tasks):**
pre-save gates (mandatory, validation rules, duplicate/unique check, web-form/import manual approval) → **1 Assignment Rules** → **2 Review Process** → (Scoring) → **3 Workflow Rules** (field update → tags → parallel actions → convert) → **4 Approval Process** → **5 Blueprint** → (Scoring again) → (CommandCenter).

### A.2 Create vs edit

| # | Statement | Source |
|---|---|---|
| A17 | **Assignment rules apply on create only, and only for records from import, web form or API:** "You cannot use Assignment Rules if you are creating the Records manually." No edit trigger is documented. To re-own a record on edit, use the workflow **Assign Owner** action. | S-AR, S-AR2, S-OWNER |
| A18 | **Review runs on create only:** "Can review be triggered on edit? No, only on creation. Use an approval process for edits." (Review FAQ Q25.) **CONFLICT:** the v8 Update Records API says "All records that are updated will enter the review process by default." | S-RP-FAQ, S-API-UPD |
| A19 | **Workflow triggers** are Create, Edit, Create or Edit, Delete, date/time, score, plus Notes, Recommendation and Competitor triggers. | S-WF, S-WF-FAQ (Q18) |
| A20 | **Approval triggers** are Create Record, Edit Record, or Create or Edit Record. | S-AP, S-AP-FAQ (Q8) |
| A21 | **Blueprint entry:** "Once records meet the entry criteria of a blueprint, they become active records." Without criteria, "all records created in the layout will enter the process." A Zoho staff reply says entry fires "post create, and in edit event". Existing records are not added automatically when a blueprint is created, but can enter when they are next updated (community). A record goes through a blueprint only once (community). | S-BP-EXE, S-BP-DES, community thread https://help.zoho.com/portal/en/community/topic/blueprint-entry-criteria-new-record |

### A.3 Re-triggering by a workflow field update

| # | Statement | Source |
|---|---|---|
| A22 | "Can one workflow trigger another? Yes, if both are on the same module and their criteria are interrelated." | S-WF-FAQ (Q10) |
| A23 | **Loop guard:** "A rule that updates its own record runs twice before stopping". A multi-rule loop (A → B → A) stops after three executions. The same applies to date-based triggers. | S-WF |
| A24 | A Field Update trigger needs "both the rule criteria and the execution criteria [to] be true". | S-WF |
| A25 | **Approval after a workflow field update:** approval runs after workflow in the chain (A1), so it is evaluated on the record as updated by workflow **(inferred)**. The Approval page says automations triggered by its own field-update actions "run as usual". | S-AP-21 |
| A26 | **Review after a workflow field update: no.** Review runs on create only (A18), and it runs before workflow, so a later workflow field update cannot send the record to review **(inferred)**. | S-RP-FAQ |
| A27 | **Blueprint primary field** (for example Stage) can be changed only through the Transition API, Workflow API, workflow custom functions, workflow field updates and CommandCenter field updates. "Only Workflow can [overwrite a blueprint]. Other than Workflow, no other automation tool can override any action of Blueprint." | S-BP-DES, S-BP-FAQ (Q7) |

### A.4 Hold and lock interplay

| # | Statement | Source |
|---|---|---|
| A28 | **Under review the record is blocked from everything else:** "The records under review process are not displayed in a module's list view and are considered locked, therefore preventing any automation processes on them such as workflows, approvals, or blueprints." The FAQ adds: "Blueprints and workflows run only after approval [of the review]." | S-RP, S-RP-FAQ (Q26) |
| A29 | **Under review the submitter cannot edit:** "a submitted record is locked". After rejection the submitter can edit any field and resubmit. | S-RP-FAQ (Q5) |
| A30 | **Under approval:** a lock icon appears and "The Convert, Delete, and Edit options will be disabled" (FAQ). **CONFLICT/UPDATE:** the newer page says only "Convert and Delete options are disabled", and adds "Allow approvers to edit pending approval records" (up to 25 specific fields). A 2025 announcement says "Now, you can make necessary changes while it's still in the approval queue". The record stays visible in the list view. | S-AP-FAQ21 (Q9), S-AP, S-AP-NEW |
| A31 | **A record under approval cannot enter a blueprint:** blueprints "will also not trigger for unapproved or rejected records". Records finish approval before they reach the Blueprint. | S-BP-TS |
| A32 | **A record in a blueprint cannot enter approval** (community, Zoho support reply): "Approvals are not supported while a record is in a blueprint". Also: "Other than Workflow, no other automation tool can override any action of Blueprint." | S-BP-COMM, S-BP-FAQ |
| A33 | **Rejected (approval):** the record stays locked in the Rejected state and is not eligible for a blueprint (A31). It can be resubmitted within 180 days. On resubmit, the system first checks the original rule, then all rules, and unlocks the record if none match. | S-AP-FAQ (Q13, Q15), S-BP-TS |
| A34 | **Rejected (review):** the record stays out of the list view and still counts as "in review". The submitter edits and resubmits, and the "Resubmission" function hook fires. On final review approval the record moves to the list view and the downstream chain (workflow, approval, blueprint) runs **(inferred from A28)**. | S-RP, S-RP-FAQ |
| A35 | **Approved:** the record is unlocked. It can be locked again if a later edit matches a rule set to Edit or Create-or-Edit. | S-AP-FAQ (Q16) |
| A36 | **Record Locking (separate feature):** lock rules hide blueprint transitions on locked records. Locked records can still run workflow, assignment, approval and scoring when a user with edit-locked permission triggers them. | S-LOCK |

---

## B1. Assignment Rules

| Topic | Zoho behaviour | Source |
|---|---|---|
| Modules | Leads, Contacts, Accounts, Deals, **Tasks**, Cases, custom modules and team modules. **Leads Y, Deals Y, Tasks Y.** The API `lar_id` "is supported for all modules where assignment rules are applicable", for example Leads, Contacts, Deals, Accounts, Tasks, Cases and Custom. | S-AR, S-API-INS |
| Edition | Professional and above. Not available in Free or Standard. | S-ED |
| Entry points | "You can use Assignment rules for the records generated through import, Webform, and API only." Manual UI creation is **not** supported. | S-AR |
| Import | An "Assign owner based on Assignment rules" checkbox selects one rule. It is **not available for update-existing imports** ("the option to trigger assignment rules and assign follow-up tasks will [not] be available"). | S-IMP, S-IMP-TS |
| API | Assignment runs only when `lar_id` (the rule ID) is passed alongside `data`. It is not part of the `trigger` array. | S-API-INS |
| Web form | The web form's "Assign Owner" step chooses either a single user or an assignment rule (round robin). Without a rule, "all incoming records are assigned to the administrator" by default. | S-WEB, S-WEB-FAQ |
| Edit trigger | None documented. For edits, use the workflow Assign Owner action (B3). | S-AR, S-OWNER |
| Criteria | All records, or records matching criteria. Conditions can compare a field to a value or to another field. Up to 25 criteria per rule entry. Encrypted fields are not supported. | S-AR |
| Rule ordering | "you can reorder rule entries to change the sequence in which the rule entries need to be executed". The docs do not literally say first match wins, but entry ordering implies it **(inferred)**. | S-AR |
| One rule per operation | One rule is applied per import, API call or web form, because the caller picks the rule. | S-AR, S-API-INS, S-WEB |
| Assign to | By category (users, roles, groups, or team-module users or profiles), where "When multiple users are selected, the records will be assigned based on the round-robin pattern". By condition (for example, by country). Zia owner suggestion is available with 6 months of data. | S-AR |
| Availability | Optional check of online status and/or shift hours. If both are checked, both must hold. "maximum of 5 mins delay in fetching online users status". Unconfirmed users are never assigned. | S-AR |
| Default owner | Used when the target user is unavailable, deactivated or deleted. "Logged-in user" means the importer for imports, the token owner for the API, and the web-form rule creator for web forms (the super admin if that user is deactivated). | S-AR |
| Follow-up task | Optional task (call, email, etc.) after assignment. | S-AR |
| Limits | 25 criteria per entry. One snippet of the feature table gives 20 rules with 20 or 50 entries depending on edition, but this was not verified. | S-AR, search snippet only |
| Permission | Profile permission "Assignment Rules & Threshold". | S-AR |
| Order | Step 1 of the chain. | A1 |

## B2. Review Process

| Topic | Zoho behaviour | Source |
|---|---|---|
| Modules | "all standard and custom modules except … Campaigns, Activities, Zoho Finance". **Leads Y, Deals Y, Tasks N** (Tasks belong to Activities). | S-RP-FAQ (Q3) |
| Edition | Enterprise and above. Needs the "Manage Automation" permission. | S-RP-FAQ (Q11), S-ED |
| Trigger | **On creation only** (FAQ Q25). **CONFLICT:** the v8 Update API says updated records enter review by default (A18). | S-RP-FAQ, S-API-UPD |
| Entry points | Web forms, API, portal and integrations: yes. Import: **"Can imported records be reviewed? No."** (Q23). **CONFLICT:** the import announcement says "Trigger automation and process management" applies "Workflow rules, Approval process, Review process, Blueprint, and CommandCenter" to imported records. The API needs v2.1 or later ("Review process will not execute if the v1 API is being used"), and on v2 the review-process parameter must be passed. | S-RP, S-RP-FAQ, S-IMP-ANN |
| Initiation | An initiating condition (for example, Lead Source = Web Form). Up to 5 rules, each with sub-criteria and reviewers. A catch-all **"Others"** rule covers records matching no rule. | S-RP |
| Layout | A review process is layout-specific, and a module can have several. | S-RP, S-RP-CMP |
| Reviewers | Users, roles, groups or record owner. Up to 5 per rule. All reviewers are notified, and any one reviewer can act. Admins can act even if they are not reviewers. | S-RP, S-RP-FAQ (Q4, Q22, Q38), S-RP-CMP |
| Field-level | The reviewer approves or rejects each marked field. Supported types include text, email, phone, date, number, currency, percent, picklist, multiselect, checkbox, URL, file upload and subform fields. **Lookup fields cannot be reviewed.** | S-RP, S-RP-FAQ (Q13, Q15) |
| Submitter view | The record is locked and hidden from the module list view. It appears in "[Module] in Review" (not shown to reviewers) and in My Jobs → Review Process. "Submit for Review" appears only once all required review fields are filled. | S-RP, S-RP-FAQ (Q8, Q14, Q19) |
| Lock | Locked, hidden from the list view, and no workflow, approval or blueprint runs (A28). Submitters cannot edit (A29). A function fetching the record needs `approved = "both"`. | S-RP, S-RP-FAQ |
| Outcomes | Approve or reject per field. One rejected field rejects the record. Rejection reasons: Invalid Entry, Data Insufficient, Data does not match, plus custom (up to 10 per field), and a reason is mandatory. Approved records go to the list view. Rejected records can be edited and resubmitted. | S-RP, S-RP-FAQ (Q32) |
| No delegation | Delegation is not allowed. | S-RP-CMP |
| SLA | Optional SLA escalation to another reviewer or user after a set time, with an email. A completion timeline in days can be set. | S-RP, S-RP-FAQ (Q36), S-RP-CMP |
| Notifications | On submission: reviewers and submitters. On completion or rejection: submitters, reviewers and admins. The rejection email includes the reason. | S-RP-FAQ (Q21, Q33) |
| Function hooks | Functions can run on submission, reviewed, rejected and resubmission. | S-RP |
| Audit | My Jobs Review Log shows entered, re-entered, rejected, reviewed and unreviewed. Timeline entries are kept. 4 analytics reports are available. | S-RP, S-RP-FAQ (Q6) |
| Auto-expiry | Records awaiting review for more than 3 months are deleted automatically. | S-RP |
| Delete in review | Needs the module Delete permission. Only admins can mass delete. | S-RP-FAQ (Q7) |
| Deactivate with pending records | The admin chooses to reject them, move them into the CRM, or push them to other active processes. Records may show as "Unreviewed". | S-RP, S-RP-CMP |
| Delete process | **Blocked** while records are pending or resubmitted. | S-RP-FAQ (Q9), S-RP-CMP |
| Layout deleted | The admin must choose another layout. If that layout has no review, the records go to the list view. | S-RP-FAQ (Q10) |
| Limits | 5 rules per process, 5 reviewers per rule, 10 rejection reasons per field. | S-RP |

## B3. Workflow Rules and actions

| Topic | Zoho behaviour | Source |
|---|---|---|
| Modules | "All standard and custom modules". Calls, Meetings and Tasks are listed among the modules where rules can be created. **Leads Y, Deals Y, Tasks Y.** Section-based Edit triggers only on Leads, Contacts, Accounts, Deals and custom modules (**not Tasks**). Events also has a Cancel trigger. Visits supports Create only. | S-WF, S-WF-FAQ (Q20) |
| Edition | Free and above, with action limits growing by edition (below). | S-WF-FAQ (Q21), S-ED |
| Triggers | **Record action:** Create, Create or Edit, Edit (any field, specific fields with up to 5 criteria, or any field in a section), Delete. **Date/Time:** offset in days, weeks or months, Once/Monthly/Yearly, at most 5,000 records processed per 10 minutes. **Score:** increase, decrease or updated. Also Notes, Recommendation (Zia) and Competitors. The trigger cannot be changed after creation. | S-WF |
| Repeat | "Repeat this workflow every time a record is edited" for Edit and Create-or-Edit. Without it, the rule fires only the first time the criteria become true. A change from true to false does not fire. | S-WF, S-WF-FAQ |
| Delete trigger | Only Email, Webhook and Function actions are allowed. Recycle Bin purge does not fire it. API delete fires workflows only with `wf_trigger=true` (default false). | S-WF, S-KZ33 |
| Conditions | Up to 10 conditions (Enterprise/Ultimate) or 5 (Standard/Professional). Each condition is "records matching criteria", "all records", or (from the 2nd onward) "records not meeting any of the above". **First match wins:** once a record matches a condition, "the other conditions that follow will be ignored". 25 criteria per pattern, 5 lookup fields. No precedence without brackets, so "1 or 2 and 3" = ((1 or 2) and 3). Tags can be used as criteria. | S-WF, S-WF-FAQ (Q5) |
| Instant actions | Email notification, task, meeting, call (Leads and Contacts only), field update, tags (add/remove), webhook, function, create record (Professional and above; Leads, Contacts, Accounts, Deals, Cases and custom), Assign Owner, Cliq/Slack/Webex, convert (Leads, Quotes, Sales Orders). | S-WF, S-OWNER, S-WF-FAQ (Q7) |
| Per-set limits | Per instant set: 5 emails, 5 tasks, 5 field updates, 1 function, 1 webhook, 1 create record, 1 assign owner. | S-WF, S-OWNER |
| Edition action limits | Free: 5 alerts and 5 tasks, instant only. Standard: plus 3 field updates (instant). Professional: plus 1 webhook (instant). Enterprise and above: plus 1 function and 5 scheduled actions. Downgrading to Free deletes all scheduled actions. | S-WF-FAQ (Q21, Q22) |
| Scheduled actions | Email, task, field update, webhook, function, create record, Cliq/Slack/Webex. Up to 5 schedules per rule, each with up to 5 of each action type. Convert and create record are instant only (FAQ Q14). They appear in Timeline > Upcoming Actions. A past execution time runs immediately. | S-WF, S-WF-FAQ (Q14) |
| Scheduled actions re-evaluated | For Edit and Create-or-Edit rules, scheduled actions are deleted if a later edit no longer meets the criteria, and rescheduled if it meets them again. If the driving date field changes, they are rescheduled. Deleting the record deletes its schedules, and restoring it does not reschedule. **Converted leads and cancelled events do not run pending scheduled actions.** | S-WF |
| Assign Owner action | By category (round robin), by user criteria, or by an assignment rule of the **same module**. Options: online users only (skipped if nobody is online), email notification, transfer of open activities. "the owner assignment will be triggered ONLY from the first workflow rule that it matches." Not available on Delete or meeting Cancel. | S-OWNER |
| Convert action | Leads, Quotes and Sales Orders. Requires a Create, Edit, Create-or-Edit or Field Update trigger, a criteria, and **"repeat" left off**. Creates a Contact, an Account and an optional Deal (Deal checkbox, mapped fields). The owner defaults to the lead owner. | S-CONV-WF |
| Entry points | Mass update, macros and owner change fire workflows. Merge: edit and delete triggers fire on manual merge, not on auto-merge. API insert, update and upsert fire workflows by default (trigger array). Import fires them only with the "Trigger automation…" checkbox. Updates made from Deluge in the same record's workflow do not re-run the workflow. | S-WF, S-API-INS, S-API-UPD, S-IMP |
| Edit or deactivate while records are in flight | Instant-action changes apply immediately. Records already waiting on scheduled actions keep the old version. On deactivation the admin chooses to delete or keep pending schedules. The usage report resets on edit. | S-WF-FAQ (Q2) |
| Locking rules | Admins can lock a rule, which also locks its actions. | S-WF |
| Daily limits | Email per edition (for example Free/Starter: users × 50 or 5,000), functions (20,000/day or 200 per user), webhooks (Professional 50k/100 per user, Enterprise 500k/500, Ultimate 1M/1,000). | S-WF, S-ED |
| Audit | The record Timeline shows rule executions. The audit log keeps every rule change. View Usage is Enterprise and above. | S-WF, S-WF-FAQ |

## B4. Approval Process

| Topic | Zoho behaviour | Source |
|---|---|---|
| Modules | "Select the module to which you want to apply the approval process". Standard, custom and team modules. **Leads Y, Deals Y** (the Kaizen #33 example is a Deals discount approval). **Tasks: not confirmed.** No page lists Activities or Tasks as included or excluded. See Open questions. | S-AP, S-RP-CMP, S-KZ33 |
| Edition | Enterprise and above. | S-ED |
| Trigger | Create Record, Edit Record, Create or Edit Record. Submission is automatic: "any record meeting the rules' criteria will be submitted for approval automatically". No manual "Submit for approval" button is documented. Records created before the process existed are not submitted (Q30). | S-AP, S-AP-FAQ |
| Edit by another user | If someone other than the owner edits a record so it meets the criteria, "the record will be locked for the record owner's approval". | S-AP |
| Criteria | Mandatory. Up to 25 criteria per rule entry, and the AND/OR pattern can be edited. Several rule entries are allowed. "The first rule entry that matches the record will be applied." | S-AP-21, S-AP-FAQ (Q10, Q28) |
| Approvers | Users, Roles, Groups, Levels (role or reporting hierarchy), Manager, Record Owner, User Lookup field (early access). Up to 10 entries, and levels can expand to more people. Role or group can be **Anyone** or **Everyone**. Everyone runs **Sequential** or **Parallel**. Users with no manager go to anyone or everyone higher up, or to the CEO or Admins. Up to 10 stages per rule. | S-AP, S-AP-21, S-AP-NEW, S-AP-FAQ (Q7, Q27) |
| Access | An approver without record access can still approve. Admins can act from My Jobs. Process admins (up to 15) can approve, reject or **take over** a stage. If none are set, Administrator-profile users can take over. | S-AP-FAQ (Q4), S-AP-21 |
| Submitter or approver view | The approver gets an email, and the record shows a lock icon plus Approve/Delegate/Reject ("Respond"). My Jobs → Approval tab lists only your pending items. The detail page shows whose approval it is waiting for. Approval History is filterable. Comments are emailed to the record owner. | S-AP-FAQ (Q5, Q6, Q9, Q18, Q33) |
| Lock or freeze | Convert and Delete are disabled. Edit is disabled per the older FAQ, but the newer page lets approvers edit, and record modification allows All, Specific (up to 25) or No fields (A30). Process admins with edit rights must respond before editing again. The record stays in the list view. | S-AP, S-AP-21, S-AP-FAQ21 |
| Outcomes | **Approve:** a field update can run on each stage approval. On final approval: email, field update, task, webhook, function (up to 5 actions). **Reject:** reject all stages, only the current stage, or let the approver choose. Then notify previous approvers, field update, email owner, webhook, function, task (up to 4 actions). Rejection email goes to the submitter's manager, all approvers, or both. **Delegate:** yes. **Recall or withdraw by submitter:** not documented. **Resubmit:** from the detail page within 180 days, re-matched against the original rule, then all rules, and unlocked if none match. Actions run simultaneously, in no set order. | S-AP, S-AP-21, S-AP-FAQ (Q11–15, Q24, Q26) |
| Rejection reasons | The approver can enter a reason. Predefined and custom reasons can be configured. | S-RP-CMP |
| Auto-approve | When a role or group has no users, the approver is deactivated, there are no users at level 1 or 2, or the owner is inactive or deleted. **Auto-reject:** not documented. **Timeout or escalation:** "SLA escalation: Not available" for approval. | S-AP, S-AP-FAQ (Q29), S-RP-CMP |
| Assign Task to approver | Creates a reminder task for each approver. In sequential mode, the next approver gets a task after the previous action. | S-AP-FAQ (Q32) |
| Re-entry | An approved record can re-enter if edited to match an Edit or Create-or-Edit rule. | S-AP-FAQ (Q16) |
| Change rule while pending | "Changes made to an approval process rule do not affect records that were already waiting". They stay with their original approvers. | S-AP, S-AP-FAQ (Q23) |
| Deactivate | Pending records stay pending and approvable. New matches are not submitted. | S-AP-FAQ (Q31), S-RP-CMP |
| Delete process | Pending records are **unlocked**. **CONFLICT:** the comparison page says pending records "are locked and must be approved by the approver". | S-AP, S-AP-FAQ (Q17) vs S-RP-CMP |
| API | `trigger` includes `"approval"` (default on). `"$approved": false` creates the record in "approval mode", meaning web-form style record approval, which is a separate feature. `$approval_state` is returned. | S-API-INS, S-KZ33 |
| With Blueprint | A record in approval cannot enter a blueprint (A31). A record in a blueprint cannot start an approval (A32, community). | S-BP-TS, S-BP-COMM |
| Not the same as record approval | Web-form or import "Request for Approval" / "Enable Manual Lead Approval" puts records into Approve Leads. That needs the "Approve Web-to-Leads/Contacts/Cases" permission and covers Leads, Contacts, Cases and custom modules. It runs before any automation (A5). | S-WEB, S-IMP, S-IMP-FAQ |

## B5. Blueprint

| Topic | Zoho behaviour | Source |
|---|---|---|
| Modules | Built per module, layout and picklist field. The help pages do not give a module list. The API docs list "Leads, Accounts, Contacts, Deals, Campaigns, **Tasks**, Cases, Events, Meetings, Solutions, Products, Vendors, Pricebooks, Quotes, Salesorders, Purchaseorders, Invoices, Notes, and Custom". That list looks like the generic API module list, so treat Tasks as **unconfirmed in the UI**. The Modules API exposes `isBlueprintSupported` per module, which is the authoritative check. **Leads Y, Deals Y** (pipeline-aware), **Tasks unconfirmed.** | S-BP-DES, S-BP-API, S-API-MOD |
| Edition | Professional (3 active), Enterprise (50), Ultimate (100). | S-BP-FAQ (Q8), S-ED |
| Entry | Records matching the entry criteria, or all records in the layout if there are none. Disabled by default. The layout must match. Criteria must not reference a state outside the blueprint. Unapproved or rejected records do not enter. A record enters only once (community). Admins can mass include or exclude records from the Filters tab. | S-BP-DES, S-BP-FAQ (Q3, Q16), S-BP-TS |
| API | The `trigger` array needs `"blueprint"` (default on when trigger is omitted). | S-BP-TS, S-KZ33 |
| Locked field | The state field "will be locked for editing once the record has entered the process". To roll back, use a common "Roll Back" transition that exits the blueprint. Picklist values cannot be edited while a blueprint uses the field. | S-BP-EXE, S-BP-FAQ (Q2, Q9) |
| Override | "Other than Workflow, no other automation tool can override any action of Blueprint." Workflow field updates, workflow API, functions, the Transition API and CommandCenter can move the state field. | S-BP-FAQ (Q7), S-BP-DES |
| Transitions | **Before:** owners (users, permissions, user fields, portal users), where any one owner can perform it, plus visibility criteria. **During:** mandatory or optional fields (from the primary and related modules), checklist, notes, attachments, associated items (Tasks, Meetings, Calls, Quotes, Sales Orders, Cases), tags, widget, kiosk (Enterprise), validation on save, Save as Draft (with exceptions). **After:** email, task, meeting, call, field update, create record, webhook, function, tags, convert (Leads, Quotes). Also common transitions, same-state loops, automatic transitions after a wait time, and continuous blueprints with a single owner. During the transition, the owner can edit even without field access. Transitions show in creation order (the troubleshooting page says they cannot be reordered, but the design page says they can be reordered on the detail page). | S-BP-DES, S-BP-EXE, S-BP-FAQ (Q13, Q14), S-BP-TS |
| SLA | Maximum time per state, escalation to users, and alerts before or after. Custom SLA actions need Enterprise. | S-BP-DES |
| UI | Blueprint strip on the detail page (current state plus transition buttons). Pending transitions also show in My Jobs. Supported on mobile. | S-BP-EXE |
| Limits | 25 criteria. Transition names up to 50 characters. Message fields up to 300 characters. File and image fields are not supported in During or in criteria. | S-BP-TS, S-BP-DES |
| API errors | `RECORD_NOT_IN_PROCESS`, `RECORD_LOCKED`. | S-BP-API |
| Edit or deactivate while records are in flight | Not documented in the pages read. Picklist edits stay blocked until the blueprint is deleted and its records exit or are deleted. | S-BP-FAQ (Q9) |
| Record locking | A record lock rule hides blueprint transitions. | S-LOCK |

---

## C. Entry-point matrix (Leads, Deals, Tasks)

Legend: **Y** = fires, **N** = does not fire, **Opt** = fires only if the user or caller opts in, **?** = not confirmed. "AR" = Assignment Rules, "RP" = Review Process, "WF" = Workflow, "AP" = Approval Process, "BP" = Blueprint.

| Entry point | AR | RP | WF | AP | BP |
|---|---|---|---|---|---|
| UI create (full form or quick create) | **N** "cannot use Assignment Rules if you are creating the Records manually" [S-AR] | Y on create [S-RP-FAQ] | Y (Create, Create-or-Edit) [S-WF] | Y (Create, Create-or-Edit) [S-AP] | Y if entry criteria match [S-BP-DES] |
| UI edit: detail page | N (use WF Assign Owner) [S-AR, S-OWNER] | **N**, create only [S-RP-FAQ Q25] | Y (Edit, Create-or-Edit, field triggers) [S-WF] | Y (Edit, Create-or-Edit) [S-AP] | Y, entry on edit event (community) [A21] |
| UI inline edit (detail or list) | N (inferred) | N (inferred) | Y (inferred: it is an edit) | Y (inferred) | Y (inferred) |
| List mass update | N (inferred) | N (inferred) | **Y** "triggered when records are modified using Mass Update, Macros" [S-WF] | Y (inferred: same edit path) | Y (inferred) |
| Owner change | N | N | Y [S-WF] | Y if criteria match (inferred) | ? |
| Clone | N (it is a manual create) (inferred) | Y (inferred: create) | Y (inferred: create) | Y (inferred) | Y (inferred) |
| Import: add new | **Opt** "Assign owner based on Assignment rules" [S-IMP] | **CONFLICT:** FAQ says N [S-RP-FAQ Q23], announcement says Opt [S-IMP-ANN] | **Opt** "Trigger automation and process management for imported records" (under 10,000 rows) [S-IMP, S-IMP-ANN] | Opt (same checkbox) [S-IMP-ANN] | Opt (same checkbox) [S-IMP-ANN] |
| Import: update existing | **N**, option not available [S-IMP-TS] | N (create only) (inferred) | Opt, "created or updated through import" [S-IMP-ANN] | Opt [S-IMP-ANN] | Opt [S-IMP-ANN] |
| Import with "Manual Lead Approval" | Runs after the record is approved [S-IMP-FAQ] | ? | Runs after approval (inferred) | ? | ? |
| API insert (v8) | **Opt** only with `lar_id` [S-API-INS] | Y by default on v2.1 and later [S-RP] | Y unless `trigger` omits `"workflow"` [S-API-INS] | Y unless omitted [S-API-INS] | Y unless omitted [S-API-INS] |
| API update (v8) | ? (`lar_id` documented for insert only) | **CONFLICT:** API doc says Y by default [S-API-UPD], FAQ says create-only | Y default (trigger array) [S-KZ33]. Deluge updates from the same record's workflow do not re-run WF [S-API-UPD] | Y default [S-KZ33] | Y default [S-KZ33] |
| API upsert | `lar_id` not documented | ? | Y default; `[]` suppresses [S-API-UPS] | Y default [S-API-UPS] | Y default [S-API-UPS] |
| API delete | — | — | Only with `wf_trigger=true` (default false) [S-KZ33] | — | — |
| Deluge (`zoho.crm.createRecord` / `updateRecord`) | Needs the parameter | ? | **Off unless specified** (reverse of REST API), third-party [https://github.com/TheWorkflowAcademy/Zoho-CRM-Trigger-Workflow-Assignment-Rule-Deluge] | Off unless specified (third-party) | Off unless specified (third-party) |
| Web form (Leads only in scope; Deals and Tasks have no web forms) | **Y** if the form picks a rule, otherwise the single owner or admin [S-WEB, S-WEB-FAQ] | Y (after web-form approval if enabled) [S-RP] | ? (not documented; likely Y as a create) (inferred) | ? (likely Y, as a create) (inferred) | ? (likely Y) (inferred) |
| Lead conversion → new Deal | N. Owner comes from the convert dialog or API `assign_to`, defaulting to the lead owner [S-API-CONV, S-CONV-WF] | N (inferred: system create, not documented) | **?** Not documented whether Deal "Create" rules fire on the converted deal. Community threads ask for a "convert" trigger and have no answer. | ? | ? |
| Lead conversion: source lead | — | — | Pending scheduled actions on the converted lead are dropped [S-WF] | Lead under approval cannot be converted (Convert disabled) [S-AP] | — |
| Record created by a WF "Create Record" action | ? | ? | Y if same-module chaining criteria apply (inferred from Q10) | ? | ? |
| Record created by Blueprint after-transition | ? | ? | ? | ? | ? |
| Tasks module overall | **Y** supported [S-AR] | **N**, Activities excluded [S-RP-FAQ] | **Y** supported [S-WF-FAQ] | **?** not confirmed | **?** (API list says yes, UI not confirmed) |

### C.1 API `trigger` array semantics (v8)
- Allowed values are `workflow`, `approval`, `blueprint`, `pathfinder` and `orchestration` (Journey Builder) [S-API-INS]. Upsert lists only workflow, approval and blueprint [S-API-UPS].
- **Omitted:** all related automations run. "If trigger is not mentioned, the automation actions related to the API will get executed." [S-API-INS]
- **`[]`:** none run. The API page says "to not execute the workflows", and Kaizen #33 says it "prevents the execution of all automation rules (workflow rules, approvals, and blueprints)" [S-KZ33].
- **Subset:** only the listed types run. For example, `["workflow","approval"]` skips blueprint [S-KZ33].
- **Not controlled by `trigger`:** assignment (`lar_id`), review (always on v2.1 and later), cadences (`skip_feature_execution`), validation and layout rules (`apply_feature_execution`) and duplicate check (always on) [S-API-INS, S-API-UPD, S-RP].
- Function (DRE) updates: "workflow alone will not get executed, irrespective of the trigger param configuration" for the same record [S-API-UPD].

### C.2 Import options (UI)
- "Assign owner based on Assignment rules" picks one rule. It is new records only, and not offered for "Update existing … only" [S-IMP, S-IMP-TS].
- "Trigger automation and process management for imported records" covers workflow, approval, review, blueprint and CommandCenter for created **or updated** records. It shows only for files under 10,000 rows and may finish after the import completes [S-IMP, S-IMP-ANN].
- "Assign follow-up tasks" is available only if the trigger-automation checkbox is **not** selected [S-IMP].
- "Enable Manual Lead Approval" means records wait in Approve Leads, and owner assignment and rules apply after approval [S-IMP, S-IMP-FAQ].

---

## Open questions / could not confirm

1. **Approval Process on Tasks**: no Zoho page lists Activities or Tasks as included or excluded. Check in a live Zoho org (Setup → Process Management → Approval Processes → module dropdown).
2. **Blueprint on Tasks**: only the generic API module list includes Tasks. Check the `isBlueprintSupported` flag (GET /crm/v8/settings/modules) or the Blueprint module dropdown in Zoho.
3. **Lead conversion**: do Deal (and Contact/Account) Create workflows, approvals and blueprints fire on records created by conversion? Not documented.
4. **Review on edit**: the FAQ says create only, while the v8 Update API says updated records enter review by default.
5. **Review on import**: the FAQ says no, while the import announcement says the trigger-automation checkbox includes Review.
6. **Review vs Approval order**: the Review FAQ says approvals run before review. This is most likely web-form record approval (A6), but it is not certain.
7. **Edit lock during approval**: the older FAQ says Edit is disabled, while the newer docs and the 2025 announcement allow edits (approver edit setting, 25 fields). The exact current submitter edit rights are unclear.
8. **Deleting an approval process with pending records**: unlocked (Add/FAQ pages) or still locked (comparison page)?
9. **Recall or withdraw** of a pending approval by the submitter: not documented. It looks unsupported, but not confirmed.
10. **Auto-reject or approval timeout/escalation**: not available per the comparison page. No auto-reject is documented.
11. **Approval inside a blueprint**: known only from a community support reply. No KB statement found.
12. **Blueprint edit, deactivate or delete with records in flight**: not documented beyond picklist-edit blocking.
13. **Assignment rules on API update / upsert** (`lar_id`): documented only for insert.
14. **Web form submissions firing workflow, approval or blueprint**: not stated in the KB. Presumed to behave as a create.
15. **Workflow "Create Record" or Blueprint-created records**: whether they run AR, RP, AP or BP on the new record is not documented.
16. **Data Enrichment, Scoring and CommandCenter**: only Scoring and CommandCenter are placed in the order. Data Enrichment was not found.
17. **Exact edition limits** for workflow rules per module, assignment rules and approval processes per module: the current feature-availability page was not reachable (404). The comparison page dates from 2022. Third-party figures (approval: 10 per module on Enterprise, 50 on Ultimate; assignment: 20 rules with 20/50 entries) are unverified.
18. **Review "Others" rule vs initiating condition**: whether records that fail the initiating condition skip review entirely (inferred yes).
