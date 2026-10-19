# Brief for each test session (CRM Automation Execution Order)

Read this, then the cases of your groups in `docs/crm-automation-execution-order/spec-crm-automation-execution-order.md`.

## Goal
Automate and run your spec groups as Java TestNG tests on staging-crm, and report a verdict per case: **PASS / FAIL (app bug) / INCONCLUSIVE / NOT RUN** with record ids and a one-line observation. Expected behaviour = the spec's Expected column (Zoho CRM behaviour). The order is Assignment → Review → Workflow → Approval → Blueprint.

## Where to work (avoid build collisions with the other sessions)
1. Copy the framework to your own folder, without `target/`:
   `mkdir -p "<SCRATCH>/<SESSION>" && cd "D:/Software Testing/Automation/Agentex Installation/Agentex Installation" && tar --exclude=automation/target -cf - automation | tar -xf - -C "<SCRATCH>/<SESSION>"`
2. Work and run only in `<SCRATCH>/<SESSION>/automation`. Run your class only:
   `./mvnw -q test -Dtest=<YourClass> -Dcrm.credentials.file="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/Microsoft Edge Passwords.csv"`
   Results: `target/run-summary.json`, traces in `target/crm-order-traces.log`.
3. Never edit the shared harness files in the main repo. If the harness needs a change, make it in your copy and list it in your report (file + diff summary); the lead merges.
4. When done, your deliverable is ONE test class: `src/test/java/qa/features/crmautomationorder/<YourClass>.java` in your copy (path in the report).

## Harness (already written and proven, 18 Oct 2026)
- `OrderTestBase` (extend it): `session()` = your tag (e.g. "SB"), `processAdmin()` = account that creates processes. Gives each case a fresh `api` (CrmApi) and removes everything the case created in @AfterMethod. Creates your own restricted QA layouts for Leads/Deals/Tasks in @BeforeClass (`layout(module)`) and deletes them in @AfterClass. `nm(caseTag, suffix)` → record name "QA AEO <tag> <case> <suffix>". `traceOf(caseTag, module, id)` saves the order trace. `inconclusive("why")` → SKIP marked INCONCLUSIVE.
- Users: `owner()` (Owner), `adminA()` mmohamed (CRM Admin), `adminB()` mahmoud.mahamed1515 (CRM Admin), `supervisor()` mahmoud.mmohamedsamy (Supervisor, **manager of userV**), `userN()` nameb56175 (User profile, manager = Hegazy — not ours), `userV()` valafo4080 (profile "test"). `.id()` = user id. Several sessions may use the same accounts at once (verified).
- `CrmProcs` builders (all guarded: name field starts with your prefix): `assignmentRule(module,label,channels,condition,userIds,fallbackKind,fallbackUserId)` (channels "WebForm","Api","Import"; fallback "LeaveUnassigned"|"DefaultUser"), `reviewProcess(module,layoutId,label,criteria,channels,fields{apiName→datatype},reviewerIds,othersIds)` (channels manual, excel_import, workflow, web_form, api, portal, mobile_ingress), `workflow(module,label)…onCreate()/onEdit()/onCreateOrEdit()/onFieldChanged(f)/onDate(f,sec)/oneTime()/guardCase(tag)/where(crit)/fieldUpdate(f,v)/owner("SpecificUser",id)/task(title)/createRecord(module,layout,mappings)/webhook(url)/delayed(sec).build()`, `approvalProcess(module,label,onCreate,onEdit,criteria,levels,adminIds)` with `levelUsers(ids…)`, `levelSubmitterManager()`, `blueprint(moduleKey,layoutId,pipelineId|null,targetField,label,entryCriteria,states,afterActionsOfFirstTransition)` with `setField(f,v)`; criteria `guard(module)`, `guard(module, prefixPlusCase)`, `eq(field,value)`, `and(…)`.
- `CrmApi`: create processes (`assignmentRule/reviewProcess/workflowRule/approvalProcess/blueprint(module, body)`) — created **inactive**, switch on with `setAssignmentRuleActive/setReviewActive(id,on,pendingAction)/setWorkflowActive/setApprovalActive/setBlueprintActive(module,id,on)`. Records: `createRecord(user,module,name)` (required fields filled, your QA layout), `createRecord(user,module,layout,fields)`, `createRaw(...)` (negative), `update(user,module,id,fields)`, `field(user,module,id,key)`, `approvalStatus(module,id)`. Review: `reviewStatus` (pending_for_review | in_review | rejected | approved | null), `reviewRequestId`, `reviewField(reviewer,req,field,approve)`, `reviewReject`, `reviewResubmit`, `reviewHistory`. Approval: `approvalState` (pending_approval | approved | rejected | null), `approval(user,…)` (canApprove, canResubmit, viewerDecisionBlockedReason…), `approve/reject/resubmitApproval`. Blueprint: `governed(module,id)`, `blueprintState(user,…)` (data.transitions[].transitionId), `transition(user,module,id,transitionId, Map.of())` (empty body works). Log: `executions(recordId)` (workflow+assignment rows: ruleId, assignmentRuleId, outcome "Fired"), `firedCount(recordId, ruleId)`, `timeline(module,id)`, `trace(module,id)`. `CrmApi.waitFor(seconds, () -> cond)` for async engines.
- Ids: `CrmOrderFeature.LEADS/DEALS/TASKS`; Deals pipeline per layout: `CrmApi.pipelineOf(layout(DEALS))`. Fields: Leads `first_name` (Full Name, required), `phone` (^01[0125]\d{8}$, required), `single_line_3_9` (required), `email`, `lead_source` (chat/web/referral/other), `lead_status` (No Answer, Busy, Follow Up…), `description`, `owner`. Deals `name`+`deal_name` (required), `stage` (qualification, needs_analysis, proposal, negotiation, closed_won, closed_lost), `pipeline`, `amount`, `description`. Tasks `name`+`subject` (required), `status` (Not Started, In Progress, Deferred, Waiting on someone else), `priority` (low, normal, high, highest), `description`.

## Facts already established (don't re-discover)
- Only ONE review process per module+layout (inactive ones count) — that's why each session has its own QA layouts. Blueprints are per layout too; a new Deals layout gets its own Standard pipeline.
- Records created through the API with a user token have `source: manual` and enter review via the **manual** channel. A true "api" channel was not found (no API-key integration) → cases needing the API channel are INCONCLUSIVE unless you find a real way; say what you tried.
- Review: rejecting one field when it's the only field → status "rejected"; with several fields, record-level `reviewReject` rejects all. Resubmit only from "rejected". Approve-all needs every field approved.
- Approval: rejected → `resubmitApproval` creates a new instance; approved → approval_status "approved". The approver cannot be the submitter.
- Blueprint: a governed Stage/picklist can't be edited directly (422 BLUEPRINT_GOVERNED_FIELD).
- Assignment rules only run for Import / WebForm / Api channels (not manual create) — same as Zoho.

## Rules (hard)
- Create only QA items through the harness (prefix "QA AEO <tag>"). **Never** edit, deactivate or delete anything not created by your session (teammates' rules, users, layouts, settings). If a case needs that (e.g. deactivating a user, business hours, changing a profile), mark it **NOT RUN – needs user OK** and move on.
- Avoid values that fire teammates' active rules: Leads `lead_status = Interested`, Tasks `status = Completed`, names containing `AP` (case-sensitive) or `AEX-01`. (Spec J-04 is the only case allowed to touch Tasks Completed — leave it NOT RUN unless your group is J and say so.)
- A verdict that could not be observed is INCONCLUSIVE, never PASS. For "did NOT happen" checks add a control that must happen to the same record first.
- Don't sign in through the browser; the harness signs in through the API. On 429 stop and report.
- Never print or log tokens or passwords.
- Staging is slow and drops connections: the harness retries; use `waitFor` (30–90 s) for async results, not fixed sleeps.

## Test code conventions
- One class, e.g. `GroupBReviewTest`, `@CaseId("B-05")`, groups `{"crm-order", "group-b"}` (+ a bug id like `"NDC-1697"` where the spec names one). Each test method name describes the case. A bug test asserts the **correct** (Zoho/spec) behaviour, so it fails while the bug exists.
- Keep each case independent (its own processes and records). Narrow guards per case with `CrmProcs.guard(module, nm(caseTag, ""))` / `Wf.guardCase(caseTag)` when several QA processes in the same case could collide.

## Report back (final message, ≤ 60 lines)
1. Class path in your copy + harness changes (if any).
2. Table: Case | Verdict | Evidence (record id / API status / key field values) | Note.
3. Suspected app bugs: one line each — what, expected (Zoho/spec), actual, record id, API response excerpt.
4. Anything NOT RUN and why.
