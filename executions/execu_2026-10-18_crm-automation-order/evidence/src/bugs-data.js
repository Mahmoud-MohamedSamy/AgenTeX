// Bug evidence data (excerpts copied from automation/target/crm-verify.log, 19 Oct 2026). M = Leads module id.
const M = '841043e1-…';
module.exports = SRC => [
  {
    id: 'B-01', case: 'D-21 / H-03', slug: 'convert-pending-approval', title: 'A lead waiting for approval can be converted',
    blocks: [
      { head: 'Setup: approval process "QA AEO V3 H-03 appr" (on create, approver mahmoud.mmohamedsamy); lead fe605f05 created by nameb56175', lines: [
        'GET /workflow/approvals/records/' + M + '/fe605f05-…  ->  200  "state":"pending_approval"'] },
      { head: 'Delete (control) — blocked as expected', lines: [
        { t: 'DELETE /modules/' + M + '/records/fe605f05-…  ->  422 APPROVAL_LOCKED', box: 'locked' }] },
      { head: 'Convert by the record owner (User profile) — accepted', lines: [
        { t: 'POST /modules/' + M + '/records/fe605f05-…/convert  {}  ->  200', box: 'should be refused' },
        '"targets":[ accounts: skipped, contacts: created 719ccc77-…, subscriptions: created … ]',
        'approval state after convert: pending_approval'] },
    ],
    taviCaption: 'Convert answers 200 while Delete answers 422 APPROVAL_LOCKED',
    zohoCaption: 'Approval FAQ: Convert disabled while waiting',
    zohoText: ['"When a record is waiting for approval, a lock icon will be displayed … The Convert, Delete, and Edit options will be disabled."',
      'Newer page: "Convert and Delete options are disabled" for records pending approval.'],
    zohoSources: [SRC.AP, SRC.APADD],
    rows: [
      { n: '1', b: 'Delete a lead pending approval', zoho: 'Disabled', tavi: '422 APPROVAL_LOCKED', match: 'Same as Zoho' },
      { n: '2', b: 'Convert a lead pending approval', zoho: 'Disabled', tavi: '200, Contact + Subscription created; approval still pending', match: 'Differs' },
    ],
    notes: ['Run 2 (18 Oct): same result for valafo4080 and mmohamed (lead 96850232). Re-run 19 Oct: lead fe605f05, userN.'],
  },
  {
    id: 'B-02', case: 'H-02', slug: 'convert-held-review', title: 'A lead held for review can be converted',
    blocks: [
      { head: 'Setup: review process "QA AEO V3 H-02 RP" (manual channel, field Email); lead da6f6b7c created by nameb56175', lines: [
        'review status: pending_for_review'] },
      { head: 'Edit while held (control) — blocked as expected', lines: [
        { t: 'PATCH /modules/' + M + '/records/da6f6b7c-…  description  ->  422 REVIEW_LOCKED', box: 'locked' }] },
      { head: 'Convert by the record owner — accepted', lines: [
        { t: 'POST /modules/' + M + '/records/da6f6b7c-…/convert  {}  ->  200', box: 'should be refused' },
        '"targets":[ accounts: skipped, contacts: created 488a39dd-…, subscriptions: created … ]',
        'review status after convert: pending_for_review'] },
    ],
    taviCaption: 'Convert answers 200 while the record is REVIEW_LOCKED',
    zohoCaption: 'Review process: records under review are locked',
    zohoText: ['"The records under review process are not displayed in a module\'s list view and are considered locked, therefore preventing any automation processes on them such as workflows, approvals, or blueprints."',
      '"Blueprints and workflows run only after approval [of the review]."'],
    zohoSources: [SRC.RP, SRC.RPFAQ],
    rows: [
      { n: '1', b: 'Edit a lead held for review', zoho: 'Locked', tavi: '422 REVIEW_LOCKED', match: 'Same as Zoho' },
      { n: '2', b: 'Convert a lead held for review', zoho: 'Not possible (locked, hidden from the list)', tavi: '200, records created; review still pending', match: 'Differs' },
    ],
  },
  {
    id: 'B-03', case: 'G-07', slug: 'edit-review-skips-workflow', title: 'An edit held by review never runs the On Edit workflow after the review is approved',
    blocks: [
      { head: 'Setup: review "QA AEO V2 G-07 RP" (manual, Email); workflow "QA AEO V2 G-07 WF" On Edit, Lead Status = Follow Up -> Description = "WF G-07"', lines: [
        'leads created BEFORE the processes were switched on (no hold on create)'] },
      { head: 'Lead 621270ac: mass update / Lead 30ce81a7: single edit (both by nameb56175)', lines: [
        'POST /modules/' + M + '/records/mass-update {record_ids:[621270ac], lead_status:"Follow Up"} -> 200',
        'PATCH /modules/' + M + '/records/30ce81a7-… {lead_status:"Follow Up"} -> 200',
        'review after edit: pending_for_review (both)  ->  reviewer approves Email  ->  review: approved (both)',
        { t: 'after approval (+60 s): description=null, workflow fired 0 times (both leads)', box: 'workflow never ran' }] },
      { head: 'Control lead c59f5605 (not covered by the review process): same edit', lines: [
        'PATCH {lead_status:"Follow Up"} -> 200  review=null',
        { t: 'description="WF G-07", workflow fired 1 time', box: 'works without review' }] },
    ],
    taviCaption: 'Edit -> review hold -> approval: the On Edit rule is dropped',
    zohoCaption: 'Review FAQ: workflows run after the review',
    zohoText: ['"Blueprints and workflows run only after approval [of the review]."',
      'Workflow rules are "triggered when records are modified using Mass Update, Macros".'],
    zohoSources: [SRC.RPFAQ, SRC.WF],
    rows: [
      { n: '1', b: 'On Edit workflow, record not under review', zoho: 'Runs', tavi: 'Runs', match: 'Same as Zoho' },
      { n: '2', b: 'On Edit workflow, edit held by review, review approved', zoho: 'Runs after the review', tavi: 'Never runs (mass update and single edit)', match: 'Differs' },
    ],
    notes: ['Review on edit is a TAVI behaviour (Zoho reviews on create only); whatever holds the edit, the edit\'s workflow must not be lost. The create path (F-06) works.'],
  },
  {
    id: 'B-04', case: 'F-03', slug: 'approval-record-owner-import', title: 'Approver "Record Owner" ignores the owner set by the assignment rule on import',
    blocks: [
      { head: 'Setup: assignment rule "QA AEO V1 F-03 AR" (Import) -> mahmoud.mahamed1515; approval "QA AEO V1 F-03 appr" on create, level approver kind record_owner, process admin mahmoud.mmohamedsamy', lines: [
        'import by mmohamed with the rule  ->  lead def2dce5, owner = mahmoud.mahamed1515 (assignment row Fired)'] },
      { head: 'GET /workflow/approvals/records/' + M + '/def2dce5-…  (as the assigned owner)', lines: [
        { t: '"currentApprovers":["d23fb4e0-…"]  = mahmoud.mmohamedsamy (the process admin)', box: 'not the record owner' },
        '"history":[{"eventKind":"submitted","actorUserId":"7e5e7c27-…" (mmohamed, importer)}]',
        { t: '"isCurrentApprover":false, "canApprove":false', box: 'owner cannot approve' }] },
      { head: 'Control: lead 47de0f97 created by mmohamed with Owner = mahmoud.mahamed1515 (no assignment rule)', lines: [
        { t: '"currentApprovers":["3445ec4a-…"] = mahmoud.mahamed1515', box: 'record owner works here' }] },
    ],
    taviCaption: 'Imported + assigned lead: approver falls back to the process admin',
    zohoCaption: 'Order: assignment first, then approval',
    zohoText: ['"Assignment Rules: Any record entering CRM must have an owner, so the assignment rules are executed first", then the Review Process, then the Approval Process. "These three processes will take place in a sequential manner."',
      'Approver types include "Record Owner".'],
    zohoSources: [SRC.APFAQ34, SRC.APADD],
    rows: [
      { n: '1', b: 'Record Owner approver, owner set at create', zoho: 'Owner approves', tavi: 'Owner approves', match: 'Same as Zoho' },
      { n: '2', b: 'Record Owner approver, owner set by the assignment rule on import', zoho: 'Assigned owner approves', tavi: 'Process admin (run 2: the importer)', match: 'Differs' },
    ],
    notes: ['Run 2/3 (18 Oct, lead 7b58cefa): process admin was the importer, so the importer became the approver. Re-run 19 Oct with a different process admin shows the fallback.'],
  },
  {
    id: 'B-05', case: 'F-01', slug: 'review-record-owner-import', title: 'Reviewer "Record owner" resolves to nobody on an imported, assigned lead',
    blocks: [
      { head: 'Setup: assignment rule (Import) -> mahmoud.mahamed1515; review "QA AEO V1 F-01 RP" (excel_import + manual), Rule 1 reviewers = [record_owner], Others = mahmoud.mmohamedsamy', lines: [
        'import by mmohamed  ->  lead 50ae5e2d, owner = mahmoud.mahamed1515'] },
      { head: 'GET /workflow/reviews/18dc17b6-…', lines: [
        '"entryChannel":"excel_import", "status":"submitted"',
        { t: '"reviewerUserIds":[]', box: 'no reviewer' },
        'GET /workflow/reviews/me (as the assigned owner): lead not in the queue'] },
      { head: 'Control: lead bc726dc7 created by mmohamed with Owner = mahmoud.mahamed1515 (manual)', lines: [
        { t: '"reviewerUserIds":["3445ec4a-…"] = mahmoud.mahamed1515', box: 'works on manual create' }] },
    ],
    taviCaption: 'Imported lead: record-owner reviewer list is empty',
    zohoCaption: 'Reviewers can be the record owner; assignment runs first',
    zohoText: ['Reviewers: users, roles, groups or record owner.', '"Assignment Rules … are executed first", then the Review Process.'],
    zohoSources: [SRC.RP, SRC.APFAQ34],
    rows: [
      { n: '1', b: 'Record-owner reviewer, manual create', zoho: 'Owner reviews', tavi: 'Owner listed', match: 'Same as Zoho' },
      { n: '2', b: 'Record-owner reviewer, owner set by assignment on import', zoho: 'Assigned owner reviews', tavi: 'Nobody listed; not in the owner\'s queue', match: 'Differs' },
    ],
    notes: ['The assigned owner could still approve the field (200) only because that account is a CRM Admin.'],
  },
  {
    id: 'B-06', case: 'G-04', slug: 'import-trigger-off-review', title: 'Import with "Trigger automation" off still runs the workflow once the review is approved',
    blocks: [
      { head: 'Setup: review "QA AEO V1 G-04r RP" (Excel import channel); workflow On Create -> Description = "WF G-04r"', lines: [
        { t: 'PUT /modules/' + M + '/import/{session}/mapping  options.trigger_automation=false', box: 'automation off' },
        'import completed -> lead 3dbedc30',
        'review status: pending_for_review  ->  reviewer approves Email  ->  approved'] },
      { head: 'Lead 3dbedc30 after the review approval', lines: [
        { t: 'description="WF G-04r"; execution RecordCreated outcome=Fired', box: 'workflow ran' }] },
      { head: 'Control (no review): import with trigger_automation=false, lead a3221c31', lines: [
        'description=null, workflow fired 0, approval none  (correct)'] },
    ],
    taviCaption: 'trigger_automation=false is lost when the record passes through review',
    zohoCaption: 'Import: automation only with the checkbox',
    zohoText: ['Imported records run workflow rules only when "Trigger automation and process management for imported records" is selected; that option covers "Workflow rules, Approval process, Review process, Blueprint, and CommandCenter".',
      'Review FAQ: "Can imported records be reviewed? No."'],
    zohoSources: [SRC.IMP, SRC.RPFAQ],
    rows: [
      { n: '1', b: 'Import, automation off, no review', zoho: 'Nothing runs', tavi: 'Nothing runs', match: 'Same as Zoho' },
      { n: '2', b: 'Import, automation off, review on the Excel-import channel', zoho: 'No review, no workflow', tavi: 'Review holds it, then the workflow runs after approval', match: 'Differs' },
    ],
    notes: ['Run 2 (lead 224a4501): the approval was also started after the review.'],
  },
  {
    id: 'B-07', case: 'A-04', slug: 'assignment-channel-ignored', title: 'An assignment rule limited to the API channel still assigns imported leads',
    blocks: [
      { head: 'GET /workflow/assignment-rules/e2b05650-…  ("QA AEO V1 A-04a AR")', lines: [
        { t: '"allowedChannels":["Api"]', box: 'Api only' }] },
      { head: 'Import by mmohamed naming that rule (assignment_rule_id = e2b05650)', lines: [
        'lead c1501594 created',
        { t: 'execution: assignmentRuleId=e2b05650 outcome=Fired; owner = valafo4080', box: 'assigned anyway' }] },
      { head: 'Control: rule with "allowedChannels":["Import"] -> lead 65b71474 owner = valafo4080', lines: [] },
    ],
    taviCaption: 'Channel restriction "Api" is not applied to imports',
    zohoCaption: 'Zoho: the caller picks one rule',
    zohoText: ['Zoho has no per-rule channel list: assignment rules run for import, web form and API, and the import/web form/API call picks the rule.',
      'The channel list is a TAVI addition, so TAVI\'s own setting is the expected behaviour here.'],
    zohoSources: [SRC.AR],
    rows: [
      { n: '1', b: 'Rule channels', zoho: 'Not configurable', tavi: 'Api / Import / WebForm', match: 'TAVI extra' },
      { n: '2', b: 'Api-only rule named on an import', zoho: 'n/a', tavi: 'Applied (owner set)', match: 'Differs' },
    ],
  },
  {
    id: 'B-08', case: 'C-12', slug: 'field-update-no-chain', title: 'A workflow field update does not trigger On Edit workflow rules',
    blocks: [
      { head: 'Rules: A "QA AEO V2 C-12 A" On Create -> Lead Source = referral; B "C-12 B on edit" On Edit, Lead Source = referral -> Description = "WF C-12 B"', lines: [
        'lead 23c906c8 created with Lead Source = chat'] },
      { head: 'After 60 s', lines: [
        'lead_source = referral (rule A fired)',
        { t: 'rule B fired 0 times; description = null', box: 'no chaining' }] },
      { head: 'Control: lead dec908d9 — a user edit of another field', lines: [
        { t: 'rule B: RecordUpdated, Fired; description = "WF C-12 B"', box: 'B works on a user edit' }] },
    ],
    taviCaption: 'Rule A\'s field update never reaches On Edit rule B',
    zohoCaption: 'Zoho: one workflow can trigger another',
    zohoText: ['FAQ: "Yes, you can trigger one workflow with another workflow" — "the modules should be the same with interconnected criteria."',
      'Loop guard: "After executing workflows thrice (Workflow A → Workflow B → Workflow A), the loop is stopped."'],
    zohoSources: [SRC.WFFAQ, SRC.WF],
    rows: [
      { n: '1', b: 'On Edit rule after a user edit', zoho: 'Runs', tavi: 'Runs', match: 'Same as Zoho' },
      { n: '2', b: 'On Edit rule after another rule\'s field update', zoho: 'Runs (loop stops after 3)', tavi: 'Never runs', match: 'Differs' },
    ],
    notes: ['Consistent with C-13 (18 Oct): a self-updating On Edit rule and an A↔B pair each ran once only.'],
  },
  {
    id: 'B-09', case: 'E-13', slug: 'excluded-record-still-locked', title: 'A record excluded from a blueprint keeps its blueprint field locked',
    blocks: [
      { head: 'Blueprint "QA AEO V3 E-13 BP" on Lead Source; leads bb67fa6e and f12f4ba0 governed', lines: [
        { t: 'POST /modules/' + M + '/blueprints/368a0ad4-…/mass-exclude {"record_ids":["bb67fa6e-…"]} -> 200 {"affected":1}', box: 'excluded' },
        'GET …/records/bb67fa6e-…/blueprint-state -> {"states":[],"transitions":[]}'] },
      { head: 'Edit the excluded lead', lines: [
        { t: 'PATCH …/records/bb67fa6e-… {lead_source:"referral"} (owner and CRM Admin) -> 422 BLUEPRINT_GOVERNED_FIELD', box: 'still locked' },
        '"This field is controlled by a blueprint."  — PATCH description -> 200'] },
    ],
    taviCaption: 'Out of the blueprint, but Lead Source still refused',
    zohoCaption: 'Zoho: the field is locked only while in the process',
    zohoText: ['"the field using which you configured the Blueprint will be locked for editing once the record has entered the process."',
      'Admins can mass include or exclude records from the blueprint\'s Filters tab.'],
    zohoSources: [SRC.BP],
    rows: [
      { n: '1', b: 'Edit the field of a governed record', zoho: 'Locked', tavi: '422', match: 'Same as Zoho' },
      { n: '2', b: 'Edit the field after the record was excluded', zoho: 'Editable (no longer in the process)', tavi: '422 BLUEPRINT_GOVERNED_FIELD', match: 'Differs' },
    ],
    notes: ['Zoho text says "locked … once the record has entered the process"; after exclusion the record is no longer in it (blueprint-state is empty). Run 2 lead: 66c008ba.'],
  },
  {
    id: 'B-10', case: 'G-16', slug: 'timeline-missing-processes', title: 'The record Timeline does not show the workflow update or blueprint entry, and assignment is "System"',
    blocks: [
      { head: 'Lead 4115e483 imported with assignment rule, workflow (Description) and blueprint (Lead Source) all run', lines: [
        'owner = nameb56175, description = "WF G-16", governed = true'] },
      { head: 'GET /timeline/records/leads/4115e483-…/feed  (all rows)', lines: [
        'RecordCreated  actor "Mahmoud Mohamed"',
        { t: 'OwnerChanged / FieldChanged owner  actor "System"  references: user only', box: 'rule not named' },
        { t: '(no row for the workflow Description update, none for the blueprint entry)', box: 'missing' }] },
    ],
    taviCaption: 'Timeline: only owner change (as System) and create',
    zohoCaption: 'Zoho: the Timeline shows each process',
    zohoText: ['"The Timeline will display the order each process was executed."', 'The record Timeline shows rule executions.'],
    zohoSources: [SRC.APFAQ34, SRC.WF],
    rows: [
      { n: '1', b: 'Assignment on the Timeline', zoho: 'Shown with the process', tavi: 'Owner change by "System", rule not named', match: 'Differs' },
      { n: '2', b: 'Workflow field update on the Timeline', zoho: 'Shown', tavi: 'Missing', match: 'Differs' },
      { n: '3', b: 'Blueprint entry on the Timeline', zoho: 'Shown', tavi: 'Missing', match: 'Differs' },
    ],
    notes: ['Review and approval events are on the Timeline (K-05, K-13 pass). Run 2 lead: d31541d8.'],
  },
  {
    id: 'B-11', case: 'C-14', slug: 'condition-limit-off-by-one', title: 'A workflow rule with exactly 25 conditions is refused ("this one has 26")',
    blocks: [
      { head: 'POST /workflow/rules — criteria = one And group of 24 leaf conditions', lines: ['-> 201 (rule deleted again)'] },
      { head: 'POST /workflow/rules — criteria = one And group of 25 leaf conditions', lines: [
        { t: '-> 400 "A rule\'s criteria may have at most 25 conditions (this one has 26)."', box: 'the And group is counted' }] },
    ],
    taviCaption: '25 conditions refused; the group node is counted as a condition',
    zohoCaption: 'Zoho: 25 criteria per pattern',
    zohoText: ['Workflow conditions: "25 criteria per pattern".'],
    zohoSources: [SRC.WF],
    rows: [
      { n: '1', b: '25 conditions in one rule', zoho: 'Allowed', tavi: '400, counted as 26', match: 'Differs' },
    ],
  },
  {
    id: 'B-12', case: 'C-11 / H-05 / C-15', slug: 'scheduled-field-update-runs-at-once', title: 'A scheduled (delayed) Field Update runs immediately',
    blocks: [
      { head: 'POST /workflow/rules  "QA AEO V5 C-11d WF"  On Create', lines: [
        { t: '"actions":[{"type":"FieldUpdate","delaySeconds":300,"fieldUpdates":{"description":"WF C-11d"}}]  -> 201 (stored delaySeconds=300)', box: '5-minute delay' }] },
      { head: 'Lead created 07:25:47 by nameb56175, then read', lines: [
        { t: '+3 s   description = "WF C-11d"', box: 'ran at once' },
        '+20 s  description = "WF C-11d"',
        '+60 s  description = "WF C-11d"'] },
      { head: 'Control: the same kind of rule with a delayed Webhook (C-11w, 120 s)', lines: [
        'dispatch ran ~2 min after create; a lead edited out of the criteria got no dispatch (cancelled correctly)'] },
    ],
    taviCaption: 'delaySeconds=300 is stored but the update is applied within 3 s',
    zohoCaption: 'Zoho: scheduled actions run at the set time',
    zohoText: ['Scheduled actions (incl. Field Update) run at the configured time and appear under Timeline > Upcoming Actions.',
      'For Edit / Create-or-Edit rules "the scheduled actions scheduled earlier will be deleted" if an edit makes the record stop meeting the criteria; "When a lead is converted, all the scheduled actions scheduled for the record will not be executed."'],
    zohoSources: [SRC.WF],
    rows: [
      { n: '1', b: 'Scheduled Webhook', zoho: 'Runs after the delay', tavi: 'Runs after the delay', match: 'Same as Zoho' },
      { n: '2', b: 'Scheduled Field Update', zoho: 'Runs after the delay', tavi: 'Runs immediately', match: 'Differs' },
      { n: '3', b: 'Cancel / convert / deactivate before the time', zoho: 'Not run', tavi: 'Already applied', match: 'Differs' },
    ],
    notes: ['This is why C-11 (lead 3e3fcd8a), H-05 (ba12d70d) and C-15 ("pending action RAN") failed on 18 Oct: the update had already happened before the edit, convert or deactivation.'],
  },
  {
    id: 'B-13', case: 'H-05', slug: 'scheduled-action-after-convert', title: 'Pending scheduled workflow actions still run on a converted lead',
    blocks: [
      { head: 'Rule "QA AEO V5 H-05w WF" On Create -> Webhook, delay 120 s; leads 64684edc (to convert) and 8165e04f (control)', lines: [
        'lead 64684edc created 07:30:41'] },
      { head: 'Convert at 07:30:47', lines: [
        'POST /modules/' + M + '/records/64684edc-…/convert  ->  200'] },
      { head: 'Dispatches', lines: [
        'control 8165e04f: Webhook Succeeded 07:32:55 (expected)',
        { t: 'converted 64684edc: Webhook "status":"Succeeded", lastAttemptAt 07:32:55, responseStatus 200', box: 'ran after conversion' }] },
    ],
    taviCaption: 'The delayed webhook fires 2 minutes after the lead was converted',
    zohoCaption: 'Zoho: converted leads drop scheduled actions',
    zohoText: ['"When a lead is converted, all the scheduled actions scheduled for the record will not be executed."'],
    zohoSources: [SRC.WF],
    rows: [
      { n: '1', b: 'Scheduled action on a lead converted before the time', zoho: 'Not executed', tavi: 'Executed', match: 'Differs' },
    ],
  },
  {
    id: 'B-14', case: 'F-20', slug: 'approval-on-blueprint-record', title: 'Editing a deal in a blueprint starts an approval and drops the deal out of the blueprint',
    blocks: [
      { head: 'Blueprint "QA AEO V5 F-20 BP" (Deals, Stage); approval "F-20 appr" On Edit, Next Step = edit', lines: [
        'deal 3e2736e6: blueprint-state -> "activeStates":["qualification"] (governed)'] },
      { head: 'PATCH /modules/{deals}/records/3e2736e6-… {next_step:"edit"} -> 200', lines: [
        { t: 'approval state: pending_approval', box: 'approval started' },
        { t: 'GET …/blueprint-state -> {"states":[],"transitions":[]}', box: 'blueprint dropped' }] },
      { head: 'Control: deal 0066a926 in the same blueprint, same edit, before the approval process existed', lines: [
        'still governed after the edit'] },
    ],
    taviCaption: 'Approval wins; the blueprint state is lost',
    zohoCaption: 'Zoho: no approval while a record is in a blueprint',
    zohoText: ['Zoho support: "Approvals are not supported while a record is in a blueprint."', '"Other than Workflow, no other automation tool can override any action of Blueprint."'],
    zohoSources: ['https://help.zoho.com/portal/en/community/topic/zoho-crm-record-in-blueprint-unable-to-initiate-any-form-of-approval-process (community, Zoho staff reply)', 'https://help.zoho.com/portal/en/kb/crm/faqs/blueprint/articles/can-workflows-or-approvals-or-assignment-rules-overwrite-blueprint (Q7)'],
    rows: [
      { n: '1', b: 'Edit of a non-blueprint field, no approval', zoho: 'Stays in the blueprint', tavi: 'Stays', match: 'Same as Zoho' },
      { n: '2', b: 'Edit matching an On Edit approval', zoho: 'No approval; stays in the blueprint', tavi: 'Approval starts; blueprint state removed', match: 'Differs' },
    ],
    notes: ['Run 2 (18 Oct): deal 0f39949c. The Zoho statement comes from a Zoho staff reply in the community, not the KB.'],
  },
  {
    id: 'B-15', case: 'E-09', slug: 'blueprint-sla-never-escalates', title: 'A blueprint state SLA never escalates',
    blocks: [
      { head: 'Blueprint "QA AEO V4 E-09 BP" (Lead Source); state "chat": slaMinutes 1, slaEscalation [setField description = "QA E-09 SLA escalated"]', lines: [
        'lead 76d0f582 created 06:59:09, governed, blueprint-state "slaDueAt":"2026-10-19T07:00:09"'] },
      { head: 'Watched for 25 minutes (1507 s)', lines: [
        { t: 'description = null; no escalation on the record', box: 'never escalated' },
        'final blueprint-state: "slaDueAt":null, still in state "chat"'] },
    ],
    taviCaption: 'SLA due 07:00:09; nothing happened by 07:24',
    zohoCaption: 'Zoho: SLA per state with escalation',
    zohoText: ['Blueprint SLA: maximum time per state, escalation to users, and alerts before or after; custom SLA actions in Enterprise.'],
    zohoSources: ['https://help.zoho.com/portal/en/kb/crm-v2-1/process-management/blueprint/articles/crm-v2-design-a-blueprint'],
    rows: [
      { n: '1', b: 'State SLA breached', zoho: 'Escalation actions run', tavi: 'Nothing runs; slaDueAt cleared', match: 'Differs' },
    ],
    notes: ['Same on 18 Oct (leads eb276a1a and c38ff8fb, 10 min each).'],
  },
];
