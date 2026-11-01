# Zoho Desk Blueprint and SLA: reference inventory for QA gap analysis

Compiled 1 Nov 2026 from public Zoho pages only, without logging in to anything. Format: `- capability — options/defaults/limits — source`. Anything marked "(inferred)" is my reading of API request/response examples or nearby context, not stated in prose.

**Source key** (short names used below):
- **[BP-OV]** https://help.zoho.com/portal/en/kb/desk/automation/blueprint/articles/blueprint-overview
- **[BP-CR]** https://help.zoho.com/portal/en/kb/desk/automation/blueprint/articles/creating-a-blueprint-in-zoho-desk
- **[BP-FAQ]** https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/why-are-tickets-showing-transitions-when-blueprint-is-disabled
- **[BP-DASH]** https://help.zoho.com/portal/en/kb/desk/reports-and-dashboards/articles/understanding-the-blueprints-dashboard
- **[VIEWS]** https://help.zoho.com/portal/en/kb/desk/ticket-management/views-and-filters/articles/ticket-views-custom-list-archived-views
- **[NARR15]** https://help.zoho.com/portal/en/community/topic/narrative-15-blueprint-automate-guide-and-transform-your-support-processes (official Zoho community post)
- **[BPvsWF]** https://help.zoho.com/portal/en/community/topic/automation-series (official "Automation Series #6")
- **[IM]** https://help.zoho.com/portal/en/community/topic/blueprint-transitions-are-compatible-with-im-tickets
- **[EBOOK]** https://www.zoho.com/desk/ebooks/manage-support-processes-without-a-glitch.html
- **[PROD]** https://www.zoho.com/desk/blueprint.html
- **[PRICE]** https://www.zoho.com/desk/pricing-comparison.html (served in Arabic to this network; values and tick marks read from the HTML; columns are Free / Express / Standard / Professional / Enterprise)
- **[API]** https://desk.zoho.com/DeskAPIDocument (sections "Blueprints", "SLA", "Business Hours", "Holiday List", "Profiles", "Tickets", "Ticket History", "Audit/Changesets")
- **[EXT]** https://www.zoho.com/desk/extensions/guide/page-detail-methods.html
- **[SLA]** https://help.zoho.com/portal/en/kb/desk/automation/escalate-sla/articles/understanding-and-working-with-slas
- **[SLA-FAQ]** https://help.zoho.com/portal/en/kb/desk/faqs/automation/articles/faqs-sla-service-level-agreement
- **[ONHOLD]** https://help.zoho.com/portal/en/kb/desk/ticket-management/ticket-status/articles/on-hold-state-use-cases-and-behavior
- **[BH]** https://help.zoho.com/portal/en/kb/desk/organization-settings/articles/setting-business-hours-and-holidays

---

## 1. Blueprint basics

- **Module** — Tickets only. API `module` says "Currently supported value: tickets". No custom-module blueprints are documented for Desk — [API] (Draft Blueprint / Fields To be configured / Criteria Fields)
- **Department scope** — blueprints are department-specific and apply only to tickets in that department. `departmentId` is required — [BP-CR], [EBOOK], [API]
- **Layout scope** — you pick one layout created in the department, and the status field auto-populates from that layout. `layoutId` is required. "Configured for a specific layout and process" — [BP-CR], [API], [BPvsWF]
- **Mapped field** — `fieldId` (the field the states map to) is required. Every API example maps to `Status` (`fieldLabel: "Status"`). `GET /blueprints/fieldsToConfigure` lists the fields a layout can map to — [API]
- **States = ticket Status values** — "Blueprint states map to the ticket status field" — [EBOOK]; glossary/API examples use Open / On Hold / Escalated / Closed — [API]
- **Entry criteria** — record type is either "Specific records" (field + criteria) or "All records" — [BP-CR]
  - API: `criteria.fieldConditions[] {fieldName, condition, value, fieldModule}` plus `pattern` (e.g. "(1)", "(1or2)") — [API]
  - Pre-defined values: `${EMPTY}`, `${NOTEMPTY}`, `${OPEN}`, `${CLOSED}`, `${CURRENTTIME}`. Field types: Text, Date, DateTime, Boolean, Arithmetic — [API] (List Criteria Fields For Blueprints)
  - Tags allowed as a condition with is/isn't. Up to 20 comma-separated tags, each 3–50 characters, no special characters, case-insensitive, de-duplicated — [BP-FAQ]
- **Multiple blueprints per department** — allowed, with an edition cap (see section 11). They run in the order shown on the Blueprint page, and the order can be changed. API: `POST /api/v1/blueprints/reorder` with `ids[]`; list responses include `orderNumber` — [BP-CR], [API]
- **One blueprint per record** — (inferred) the ticket carries a single `blueprint {id, state}` object and `GET /tickets/{id}/blueprint` returns one blueprint. The first matching blueprint in the order wins (inferred from "run in the order they appear") — [API], [BP-CR]
- **Evaluation point in the automation chain** — Direct Assignment, then Workflow Rules, SLA, Round Robin (sequential, load-balancing, skill-based), Blueprint, Notification Rules, Automation Studio. The other automations run first, then the blueprint is evaluated — [SLA-FAQ], [SLA], [BP-CR]
  - An older FAQ order: Skills-based, Direct assignment, Workflow, SLA, Round-robin, Blueprint, then Supervise and Macros — [BP-FAQ]
- **Activate / deactivate** — toggle in the list. Deactivating means no new tickets enter, and it can be reactivated. Tickets already inside keep the strip and transitions and must finish the process — [BP-CR], [BP-FAQ]
  - API: `active` true/false; list filter `status=ACTIVE|INACTIVE|DRAFT` — [API]
- **Delete** — More icon, then Delete, then confirm. Permanent. A blueprint with tickets in progress cannot be deleted — [BP-CR]
  - API: `DELETE /api/v1/blueprints/{id}`. `GET /blueprints/{id}/checkIfAppliedForEntity` is meant to be called before delete/deactivate — [API]
- **Revoke tickets** — admin action Setup > Automation > Blueprint > hover > More > "Revoke Tickets" > Continue. Removes every ticket from the blueprint so agents work outside the process — [BP-FAQ]
  - API, blueprint level: `POST /blueprints/{id}/revoke` (500 credits) — [API]
  - API, per ticket: `POST /tickets/{id}/revokeBlueprint` — [API]
  - API, bulk: `POST /blueprints/revokeMany`, max 50 IDs, failures returned in `failureIds` — [API]
- **Clone** — not documented for Desk (no UI or API clone) — (not found)
- **Name / description** — name required, max 60 characters (draft API); description optional — [API], [BP-CR]
- **Blueprint type** — `NON_CONTINUOUS` or `CONTINUOUS`. "Continuous Blueprint" automatically triggers the next transition once the current one is performed — [BP-CR], [API]
- **Limits** —
  - A state can have up to 16 transition connections (I/O points) — [BP-CR]
  - Per-edition counts are in section 11 — [PRICE]
  - "Permitted number of states and transitions has been increased", with no numbers given — [NARR15]
  - No documented limit on the number of states — (not found)
- **Manual apply of a blueprint to an existing ticket** — not documented. A community question asking for it has no answer — https://help.zoho.com/portal/en/community/topic/is-there-a-way-to-manually-apply-a-blueprint-to-a-ticket-which-isnt-controlled-by-a-blueprint
- **Path** — Setup > Automation > Blueprint > Create Blueprint — [BP-CR]

## 2. Builder (states, transitions, canvas, drafts)

- **Builder wizard** — step 1: name, description, layout, record type/criteria, toggles (Strict Mode, Dynamic Transition Owner Assignment, Continuous). Then Next to the canvas, then "Save & Complete Blueprint" — [BP-CR]
- **Canvas** — drag-and-drop states onto the canvas, with connectors linking states and transitions. API `chartData {canvasPosition{top,left}, connectionDetails[{fromUuid,toUuid,transName,isCommTrans,usedStates,isAuto}], stateDetails[{stateName,position,slaTime,stateId,displayName,lastModifiedStateName}]}` — [BP-OV], [BP-CR], [API]
- **State types** — `START`, `INTERMEDIATE`, `END` — [API] (states[].type; ticket `state.type`)
- **States come from the Status picklist** — (inferred) state names equal Status values. Admins can rename a state and change its Status Type after it is linked to a blueprint — [NARR15]
- **Transition** — name and description on the Transition tab, then Before / During / After — [BP-CR]
- **Connections** — `connections[{fromState,toState,transition[]}]` — [API]
- **Multiple / parallel transitions** — "Multiple transitions can run in parallel… several paths at once" — [NARR15]
  - Zoho moderator (Feb 2026): "parallel and multiple transitions" released Dec 2022 — https://help.zoho.com/portal/en/community/topic/blueprint-feature-request-1-let-layout-rules-hide-fields-2-be-able-to-have-two-transitions-with-same-start-and-end-state (product not explicit; may be CRM)
- **Common transition ("from any state")** — one transition available from multiple states, e.g. "Cancel Ticket" — [NARR15]
  - API: `isCommonTransition: true` with `commonStates[]`; chart `isCommTrans`, `usedStates` — [API]
  - Edition cap: "common transitions per blueprint" is 1 on Professional, 5 on Enterprise — [PRICE]
- **Automatic transition** — API `isAutoTransition` / chart `isAuto` ("transition is automatic"). `autoTransitionActions {feedback: SURVEY_ALL|SURVEY_GOOD|SURVEY_AVG|SURVEY_BAD, reply: REPLY_ALL|REPLY_PRIVATE|REPLY_PUBLIC}`. (inferred) The transition fires on a customer reply or feedback event — [API]
- **Transition order per state** — admins drag to reorder; this sets the button order agents see. API `states[].transitionsOrder[]` — [NARR15], [API]
- **Drafts / publish (blueprint level)** — draft for review before it is active — [API]
  - `POST /api/v1/blueprintDrafts`
  - `PATCH /api/v1/blueprintDrafts/{id}`
  - `POST /api/v1/blueprintDrafts/{id}/publish`
  - List with `status=DRAFT`; `isDraft` flag — [API]
  - The UI draft button is not described in KB — (not found)
- **Editing** — editable at any time: select the blueprint, change it, Save blueprint — [BP-CR]
  - Effect on tickets already inside is not documented — (not found)
- **Two transitions with the same from/to pair** — historically one per pair (community request). Possibly lifted by "multiple transitions" (Dec 2022) — (uncertain; link above)

## 3. Transition settings

### Before
- **Transition owners** — agents or teams. API `before.accessors.owners {agentIds[], teamIds[], otherRecpts["RECORD_OWNER"]}` — [BP-OV], [BP-CR], [API]
  - (inferred) "RECORD_OWNER" means the ticket owner
  - Only owners see and perform the transition. If no owner is selected, any agent in the department can perform it — [BP-OV], [BP-CR]
- **Owners from another department** — the ticket is auto-shared to that department with access Full Access / Read Only / Restricted. API `sharedDeptAccessors[{departmentId, accessors{agentIds,teamIds}, sharingType:"READ_ONLY"…}]` — [BP-OV], [BP-CR], [API]
- **Dynamic Transition Owner Assignment** — blueprint-level toggle. Admins or owners reassign transition owners inside a record, from the current department or by sharing with other departments. API `dynamicTransOwnerType ACTIVE|INACTIVE`. Professional and Enterprise — [BP-CR], [API], [PRICE]
- **Transition criteria** — conditions that must be met before the transition is available. API `before.criteriaDetails.criteria`. Ticket API returns `isCriteriaSatisfied` and `canUserPerformTransition` — [BP-OV], [API]
- **Roles / profiles as owners** — not documented. Only agents, teams, record owner and other departments — (not found)

### During
- **Actions** — reply all, comment, attach file, resolution, submit for approval, share request — [BP-OV]
  - API `otherActions: REPLY | BUG | COMMENT | RESOLUTION | APPROVAL | ATTACHMENT`, each with `isMandatory` — [API]
  - Perform-transition payload keys: APPROVAL, RESOLUTION, ATTACHMENT, REPLY, COMMENT, SHARING, FIELD_UPDATE — [API]
- **Fields** — required fields filled during the transition — [BP-OV]
  - API `fieldUpdates {fieldId, criteria (validation), errorMsg}` + `isMandatory` — [API]
  - (inferred) a per-field validation criteria with a custom error message
  - `POST /tickets/{id}/transitions/{tid}/validateFieldUpdates` validates the values before perform — [API]
- **Lookup fields in a transition** — supported (example "Subscription Renewed") — [BP-OV]
- **Message** — instruction text for owners. API `during[].message`; form `actionType: MESSAGE` — [BP-OV], [API]
- **Extensions / widgets** — Zoho, third-party or custom widget inside the transition. Uses: field update, external service update, step sequence, form data get/submit — [BP-OV]
  - Edition cap: 1 per transition on Professional, 3 on Enterprise — [PRICE]
  - Widget JS API: `ZOHODESK.get("transitionForm.field",[...])`, `ZOHODESK.get("transitionForm.transitionDetails")` → `{id,name,fromState,toState}`, `ZOHODESK.set('transitionForm.fieldChange',[{fieldApiName,value}])` — [EXT]
- **Fields + actions per transition cap** — 10 on Professional, 30 on Enterprise — [PRICE]
- **Configure Mandatory** — tailor which actions and fields are mandatory per agent group — [NARR15]
- **Reply mandatory on IM tickets** — if "Reply All" is mandatory, an IM transition can still complete without a reply. IM replies are logged — [IM]
- **Transition draft (partial transition)** — agents save partially filled during-actions — Professional and Enterprise — [PRICE], [API]
  - `POST .../transitions/{tid}/saveDraft`
  - `POST .../transitions/{tid}/discardDraft`
  - `GET/DELETE .../transitions/{tid}/attachments/{aid}`
  - Response `draftDetails {totalNoOfDraftActions, totalNoOfActions, draftBy, draftAt}`; `isTransDraftEnabledForPortal`
- **Layout rules inside the transition form** — not applied; fields stay mandatory and unconditional. Zoho says this is in the pipeline — community link in section 2 (product ambiguous)
- **File-upload field as mandatory in a transition** — reported as not possible — [WebSearch summary of the community; unverified]
- **Checklist** — named in [NARR15] ("completing checklists"). No configuration documented — (uncertain)

### After
- **Alerts** — existing or new email alert. API `after.alert.ids` — [BP-OV], [API]
- **Field updates** — API `after.fieldUpdate.ids` — [BP-OV], [API]
- **Tasks** — API `after.task.ids` — [BP-OV], [API]
- **Custom functions** — Enterprise only. API `after.customFunction.ids` — [BP-OV], [PRICE]
- **Webhooks / assignment as after-actions** — not listed for Desk blueprint — (not found)
- **Changing department as a transition action** — not available. An API department PATCH during a blueprint state returned FORBIDDEN (community) — https://help.zoho.com/portal/en/community/topic/update-department-on-ticket-with-applied-blueprint

## 4. Advanced

- **Strict Mode** — agents can act and update fields only through transitions. Modes: all actions / selected actions only / all except selected — [BP-CR]
  - API `strictModeType: full restricted | selective restricted | selective exclusion`; exclusion lists `actions[]` and `fieldIds[]` (API currently accepts only empty arrays) — [API]
  - Enterprise only — [PRICE]
- **Continuous blueprint** — next transition triggers automatically after the current one. Ticket API: `isContinuousBlueprint`, `isContinuousTransition`, `continuousTransitions[{transitionId,transtionName}]` — [BP-CR], [API]
- **Parallel transitions** — see section 2 — [NARR15]
- **Conditional transitions** — via transition criteria — [BP-OV]
- **Automatic transitions** — `isAutoTransition` with reply/feedback triggers (section 2) — [API]
- **Approvals** — "submit for approval" as a during-action (approvers, subject, description) — [BP-OV], [API]
  - The Approvals feature itself is Professional and Enterprise — [PRICE]
- **State SLA / time limit per state** — "time limits and SLAs can be set for stages; delays trigger escalation" — [BP-OV]; "cap how long a ticket may stay in a given state" — [EBOOK]
  - API `states[] {timeInMins, businessHrId, escalations[{escalationLevel, whenToEscalate, escalationRecipients{agentIds, otherRecpts["RECORD_OWNER"]}, templateId}]}`; `stateDetails[].slaTime` — [API]
  - Ticket `blueprint.state.dueDate` — [API]
  - Edition: "SLA and escalations at state level" on Professional and Enterprise — [PRICE]
- **Escalation levels per state** — `escalationLevel` (example: 1). `whenToEscalate` in minutes (example 15; (inferred) relative to the state due time). Recipients are agents and record owner, plus an email template — [API]
  - Maximum number of levels is not documented — (not found)
- **Business hours for the state SLA** — `businessHrId` per state. Holidays are excluded from blueprint escalations — [API], [SLA-FAQ], [BH]
- **"Stay in state" alerts** — handled by state SLA escalations (above). No separate feature — (inferred)
- **Widgets** — section 3 — [BP-OV], [PRICE]

## 5. SLA tie-in

- **Two independent SLA layers** — (inferred) department SLA policies set the ticket response/resolution due. The blueprint state SLA sets the state due (`blueprint.state.dueDate`) with its own escalations — [SLA], [API]
- **Order** — SLA runs before Blueprint in the automation chain. The SLA sets due dates from the current state and business hours before blueprint evaluation — [SLA-FAQ]
- **Holiday list** — holidays are excluded from SLA due dates, escalations, Blueprints and time-based rules — [SLA-FAQ], [BH]
- **On Hold status type pauses department SLA timers** — moving to an On Hold-type status freezes response/resolution timers and hides due times — [ONHOLD]
  - No escalations fire while on hold. Back to Open: due times are recalculated (old due + held time + SLA business hours) and escalations rescheduled
  - Closing from On Hold restores the old due times
  - An overdue ticket put on hold stops being overdue
  - (inferred) a blueprint state mapped to an On Hold-type status pauses the department SLA. Whether the blueprint state SLA also pauses is not documented
- **SLA pause on hold** — on every edition, default for the on-hold state, not customisable — [PRICE]
- **Overdue indicators** — Overdue Tickets, My Overdue Tickets, Response Overdue views; "Is overdue" / "Is Response Overdue" criteria — [ONHOLD]
  - Blueprint SLA-violated counts are on the Blueprint dashboard — [BP-DASH]
- **Blueprint SLA violation reporting** — dashboard "SLA violated tickets", "SLA violated states", "SLA violated vs adherence records" — [BP-DASH]
  - No custom report on blueprint SLA violations (open community question) — https://help.zoho.com/portal/en/community/topic/custom-report-for-zoho-desk-blueprint-transition-and-slas
- **"Escalated" status** — a standard Status. Used as a blueprint state in examples — [API]; FAQ: https://help.zoho.com/portal/en/kb/desk/faqs/tickets/articles/faqs-working-on-tickets

## 6. Agent-facing UX

- **Strip and transition buttons** — tickets in a blueprint show a current-state strip with transition buttons — [BP-FAQ]
  - Users see only the transitions they can perform — [PROD]
  - Transition bar wording — [NARR15]
- **Transition dialog** — opens the "during" form (fields, message, reply, comment, attachment, resolution, approval, widget). API `GET /tickets/{id}/transitions/{tid}/form` returns `formActions[]` with `actionType`, `isMandatory`, `fieldDetails` (allowedValues, isSystemMandatory…) and `draftContent` — [API]
- **Cannot advance until mandatory items are done** — [PROD], [BP-OV]
- **What agents can edit** — with Strict Mode, other ticket actions and fields are disabled (full or selective). Without Strict Mode, normal ticket actions remain (inferred) — [BP-CR], [NARR15]
- **Status field locked?** — not stated outright. (inferred) In strict mode, status changes happen only through transitions
  - Community evidence: a department PATCH via API during a blueprint state returned FORBIDDEN — community link in section 3
- **Exit blueprint** — admin revoke only (per ticket via API, all tickets via UI "Revoke Tickets", bulk via API). Profile permission `revokeBlueprint` ("Permission to revoke a Blueprint"). Reaching an END state completes the blueprint (inferred from START/END types and dashboard "completed/exited") — [BP-FAQ], [API], [BP-DASH]
- **Admin override / skip a transition** — not documented — (not found)
- **Transition owner change in-record** — via Dynamic Transition Owner Assignment — [BP-CR], [PRICE]
- **IM tickets** — transitions are supported. The IM composer opens during a transition, with attachments and canned responses. Professional and Enterprise ("Blueprint in IM") — [IM], [PRICE]
- **Mobile** — Android 2.6.35 adds an IM Reply option in the blueprint transition screen (implies transitions can be performed on Android) — https://help.zoho.com/portal/en/community/topic/im-reply-option-via-blueprint-transition-zoho-desk-android-app-update
  - iOS is not documented — (not found)
- **Customer portal** — `isTransDraftEnabledForPortal` flag only (inferred: some portal relation). Not documented — [API]

## 7. Where results appear

- **Ticket history** — the Ticket History API `eventFilter` includes `BlueprintHistory` (and `SLAHistory`, `ApprovalHistory`) — [API] (Ticket History)
  - The history tab lists automated actions including SLA alerts — FAQ working on tickets
- **Audit / changesets** — `entityType` includes `Blueprint`, `SLA`, `Workflow` (setup audit) — [API]
- **Blueprint dashboard** — Enterprise only, per [PRICE]. Needs the Reports and Dashboards permission. Department-specific — [BP-DASH]
  - Summary metrics:
    - Active blueprint tickets
    - SLA violated tickets
    - All transitions
  - Components:
    - Active and completed records
    - SLA violated states (time in each state)
    - SLA violated vs adherence (count and %)
    - Average time per blueprint
    - Average time per state
    - Transition occurrence (filter by agent)
  - Filters:
    - Blueprint name
    - Duration: Last 24 Hours (default), Today, Yesterday, Last 7/30 days, Current/Last week, Current/Last month, Custom
    - Agent ("All agents")
- **Ebook dashboard metrics** — tickets over the allowed state time; average time to fully execute; most frequent transitions — [EBOOK]
- **Blueprint views (list)** — group "Blueprint views", only when one department is selected — [VIEWS]
  - Views: Active Blueprint Tickets, All Transitions, My Transitions, My Team Transitions, Unassigned Transitions
  - Blueprint views cannot be exported
- **Filtering custom views by blueprint state** — not documented — (not found)
- **Criteria references** — `BluePrint` is a feature that criteria references can be fetched for (field-usage check) — [API]
- **Business hours related rules** — `GET /businessHours/{id}/relatedRules` returns ruleType `BLUEPRINT` (plus SLA, SUPERVISE). A business hour is used by blueprints — [API]
- **Automation counts** — the count API feature list includes `blueprints` — [API]

## 8. Automation interplay

- **Workflow vs blueprint** — workflows are event-driven background actions and "cannot block ticket movement". Blueprints enforce stages. Use both together — [BPvsWF]
- **Order** — assignment and workflow rules plus SLA plus round robin run before blueprint evaluation — [BP-CR], [SLA-FAQ]
  - (inferred) a workflow that sets Status on create can decide which blueprint and start state applies
- **Status changes via API/workflow while in a blueprint** — not documented. Community: a department change via API is FORBIDDEN during a blueprint state — (uncertain)
- **Record stops meeting entry criteria** — not documented. (inferred) Criteria are checked at entry only; the per-transition criteria gate each transition
- **Editing a published blueprint with records inside** — editing is allowed any time. Deleting is blocked while tickets are inside. Deactivating keeps existing tickets in the flow. Revoke removes them — [BP-CR], [BP-FAQ]
- **Macros / supervise** — run after blueprint in one documented order — [BP-FAQ]
- **Supervisor rules (time-based)** — hourly. Conditions: hours since status updated, to/since due, since assigned, response pending. Tickets module only. Pause outside business hours — [SLA-FAQ]
- **Sandbox** — Zoho recommends testing workflows and blueprints in Sandbox — [BPvsWF]

## 9. API (base `https://desk.zoho.com/api/v1`, header `orgId`) — all from [API]

| Method | Path | Purpose | Scope | Credits |
|---|---|---|---|---|
| GET | /blueprints?module=tickets&departmentId=&status=ACTIVE\|INACTIVE\|DRAFT | List blueprints | Desk.automations.READ | 3 |
| GET | /blueprints/{id} | Blueprint details (states, transitions, connections, chart) | Desk.automations.READ | 1 |
| POST | /blueprints | Create | Desk.automations.CREATE | 1 |
| PATCH | /blueprints/{id} | Update (incl. `active`) | Desk.automations.UPDATE | 1 |
| DELETE | /blueprints/{id} | Delete | Desk.automations.DELETE | 1 |
| POST | /blueprints/reorder?departmentId=&module= | Reorder (`ids[]`) | Desk.automations.UPDATE | 1/2 records |
| POST | /blueprintDrafts | Create draft | Desk.automations.CREATE | 1 |
| PATCH | /blueprintDrafts/{id} | Update draft | Desk.automations.UPDATE | 1 |
| POST | /blueprintDrafts/{id}/publish | Publish draft | Desk.automations.UPDATE | 1 |
| GET | /blueprints/{id}/checkIfAppliedForEntity | In-use check before delete/deactivate | Desk.automations.READ | 1 |
| GET | /blueprints/fieldsToConfigure?layoutId=&module=tickets | Mappable fields | Desk.automations.READ | 3 |
| GET | /blueprints/criteriaFields?module=tickets&layoutId= | Criteria fields | Desk.automations.READ | 3 |
| POST | /blueprints/{id}/revoke | Revoke from all records | Desk.automations.UPDATE | 500 |
| POST | /blueprints/revokeMany | Revoke for ≤50 tickets (`ids[]`, returns `failureIds`) | Desk.tickets.UPDATE | 1/2 records |
| POST | /tickets/{id}/revokeBlueprint | Revoke from one ticket | Desk.tickets.UPDATE | 1 |
| GET | /tickets/{id}/blueprint?include=transitionOwnerAgents,transitionOwnerTeams,transitionOwnerDept | Applied blueprint, current state (id, type, dueDate), available transitions (owners, criteria, canUserPerformTransition, isCriteriaSatisfied, draftDetails) | Desk.tickets.READ | 3 |
| GET | /tickets/{id}/transitions/{tid}/form | During-form (formActions, fieldDetails, drafts, continuous info) | Desk.tickets.READ | 1 |
| POST | /tickets/{id}/transitions/{tid}/validateFieldUpdates | Validate field values (`customFields`, `cleartextpattern`) | Desk.tickets.UPDATE | 1 |
| POST | /tickets/{id}/transitions/{tid}/perform | Perform (APPROVAL, RESOLUTION, ATTACHMENT, REPLY, COMMENT, SHARING, FIELD_UPDATE) | Desk.tickets.UPDATE | 1 |
| POST | /tickets/{id}/transitions/{tid}/saveDraft | Save during-actions draft | Desk.tickets.UPDATE | 1 |
| POST | /tickets/{id}/transitions/{tid}/discardDraft | Discard draft | Desk.tickets.UPDATE | 1 |
| GET | /tickets/{id}/transitions/{tid}/attachments/{aid}/content?inline= | Draft attachment content | Desk.tickets.READ | 1 |
| DELETE | /tickets/{id}/transitions/{tid}/attachments/{aid} | Delete draft attachment | Desk.tickets.UPDATE | 1 |

- **Ticket object** — has `blueprint {id, state {id, type, dueDate}, transitions [{id, name}]}` ("upcoming transitions and its owners") — [API] (Tickets)
- **Known API issue (community)** — `perform` returned INTERNAL_SERVER_ERROR for a non-primary owner — https://help.zoho.com/portal/en/community/topic/issue-with-a-blueprint-transition-using-api-request
- **Related SLA endpoints** —
  - `GET/POST /sla`, `GET/PATCH/DELETE /sla/{id}`, `POST /sla/reorder`
  - `POST /sla/{id}/targets`, `PATCH/DELETE /sla/{id}/targets/{tid}`
  - `GET/POST /sla/escalationStatus` (department-level escalations ACTIVE/INACTIVE)
  - `GET /sla/criteriaFields`
  - Scopes Desk.automations.* — [API]
- **Business hours / holiday endpoints** — `/businessHours` (CRUD, `/{id}/relatedRules`), `/holidayList` (CRUD) — [API]

## 10. Permissions

- **Manage blueprints** — Support Administrator permission in the profile — [BP-CR]
- **Revoke a blueprint (ticket level)** — profile permission `revokeBlueprint` — [API] (Profiles)
- **Blueprint dashboard** — Reports and Dashboards permission — [BP-DASH]
- **Who can perform a transition** — transition owners only. Everyone in the department if no owner is set — [BP-OV], [BP-CR]
- **Who sees the blueprint views** — the "My" variants are scoped to the user and their team; department-level views need department access (inferred) — [VIEWS]
- **SLA management** — Support Administrator — [SLA]

## 11. Edition availability and limits (from [PRICE], Free / Express / Standard / Professional / Enterprise)

- **Active blueprints** — - / - / - / 1 per department / 20 per department
  - An older GBP PDF says "per module" with 50/10 transitions; treat it as stale — https://www.zoho.com/desk/images/desk-pricing-pounds.pdf
- **Transitions per blueprint** — - / - / - / 20 / 100
- **Common transitions per blueprint** — - / - / - / 1 / 5
- **Fields and actions per transition** — - / - / - / 10 / 30
- **SLA and escalations at state level** — - / - / - / yes / yes
- **Dynamic transition owner** — - / - / - / yes / yes
- **Transition drafts (partial transitions)** — - / - / - / yes / yes
- **Blueprint widget** — - / - / - / 1 per transition / 3 per transition
- **Strict mode controls** — Enterprise only
- **Custom functions in blueprint** — Enterprise only (also [BP-OV])
- **Blueprint dashboard** — Enterprise only
- **Blueprint in IM** — Professional and Enterprise
- **Approvals** — Professional and Enterprise
- **Number of SLAs** — default / default / 4 / 10 per department / 20 per department
- **Maximum SLA targets per SLA** — 10 on Standard, Professional and Enterprise. Free and Express have no multiple targets — [SLA]
- **SLA pause (on hold)** — all editions, default for the on-hold state, not customisable
- **Multi-level escalations** — Express, Standard, Professional, Enterprise
- **Customer-based SLA** — Professional and Enterprise (also [SLA])
- **SLA contract management** — Enterprise only (also [SLA])
- **Business hours** — - / 1 / 1 / 1 / 100
- **Holiday lists** — - / 1 / 1 / 1 / 100
- **Time-based supervise rules** — - / - / 5 / 15 per department / 30 per department
- **Workflow rules** — - / 1 per module (tickets only) / 5 per module / 15 per department per module / 30 per department per module
- **Number of states per blueprint** — not published

## 12. Zoho Desk SLA feature (general)

- **Scope** — department-specific, Tickets module only, Support Administrator — [SLA]
- **Path** — Setup > Automation > SLA (Escalate) > New SLA — [SLA]
- **Execution triggers** — ticket creation, ticket update, field update (any of the selected fields), customer reply (incoming/outgoing), agent response, private thread, comment (agent private/public, customer)
  - API `executeOn.events` (CREATE, EDIT, REPLY…), `triggerFieldInfo {type: ANY, fieldIds}`
  - Choosing many triggers resets the SLA often — [SLA], [API]
- **Execute only with account** — `executeOnlyWithAccount` — [SLA], [API]
- **Due-date origin** — `dueDateCalculatedFrom: CREATED_TIME | SLA_APPLIED_TIME`. Option hidden when the trigger is creation — [SLA], [API]
- **Status** — ACTIVE / INACTIVE. Deactivate or delete from the list — [API], [SLA]
- **Targets** — up to 10 per SLA. Each target has:
  - criteria (field conditions + pattern)
  - `responseDueIn`/`responseTimeUnit` and `resolutionDueIn`/`resolutionTimeUnit` (minutes/hours/days)
  - `isResponseDueInOnlyForFirstResponse` (default first response only)
  - `businessHourId` (calendar hours if null)
  - `isEscalatedOnlyDuringBusinessHours`
  - Source — [SLA], [API]
- **No separate "first response" vs "next response" target** — one response target, applied to the first response after SLA execution or to every reply — [SLA]
- **Resolution** — measured until the status is Closed — [SLA]
- **Escalations** — response: up to 2 levels; resolution: up to 4 levels — [SLA]
  - Timing: before / on / after due. API `whenToEscalate` in minutes (negative = before), `escalationTimeUnit` — [SLA], [API]
  - Recipients: agents, light agents, roles, roles and subordinates, teams, ticket owner, contacts (PRIMARY_CONTACT) — [SLA], [API]
  - Templates: agent and contact notification templates — [API]
  - Actions: reassign to an agent or team, set priority — [SLA], [API]
  - Department-level escalation on/off: `/sla/escalationStatus` — [API]
- **Precedence** — contract SLA, then account SLA, then global (department) SLA, first matching criteria. Multiple SLAs are ordered (`/sla/reorder`) — [SLA], [API]
- **Business hours** — 24x7 / specific hours / custom (split and overnight shifts), with a time zone. Day-based SLAs use the same time on the next business day — [BH], [SLA-FAQ]
- **Holiday lists** — maximum 2 per business hour; a list links to up to 2 business hours; recurring or year-specific (current + 2 years); dates locked after linking; excluded from due dates and escalations — [BH], [SLA-FAQ]
- **Pause** — the On Hold status type freezes timers; recalculation on resume — section 5, [ONHOLD]
  - Overall response time includes on-hold time; agent response time excludes it — [SLA-FAQ]
- **Overdue / escalated flags** — overdue views and the "Is overdue" / "Is Response Overdue" criteria — [ONHOLD]; Escalated status — tickets FAQ
- **Timer start** — on ticket creation and department assignment. Applying an SLA resets response and resolution — [SLA-FAQ]
- **Department transfer** — resolution runs from original creation; agent resolution from assignment in the new department — [SLA-FAQ]
- **SLA dashboard** — filters: SLA, violation type, agent, period. Charts: violated tickets, achieved vs violated, violations by SLA, agent, hour, status, channel — [SLA-FAQ]
- **SLA static report API** — exists ("Get SLA Static Report") — [API]
- **IM channels** — SLA not attached directly; uses the department SLA plus channel business hours — [SLA-FAQ]
- **Support plans and contracts** — plans link to an SLA; contracts set validity — [SLA], [SLA-FAQ]

---

## Uncertain / could not find

1. The official KB section "Defining SLA Policies for States" (a community reply cites it) was not found. State SLA details come from API JSON only (`timeInMins`, `businessHrId`, `escalations[] {escalationLevel, whenToEscalate, recipients, templateId}`). Unknown:
   - maximum escalation levels per state
   - whether `whenToEscalate` is before or after the due time
   - escalation actions beyond the email notification (no reassign or priority seen)
2. Whether the blueprint state SLA pauses on On Hold-type statuses or uses business hours by default.
3. Whether the Status field is locked outside Strict Mode; what happens when a workflow or API changes Status to a value with no transition; whether the record leaves the blueprint when it no longer meets the entry criteria.
4. Effect of editing a published blueprint (removing a state or transition) on tickets currently inside it.
5. Clone blueprint (not documented for Desk); admin "skip" or force-transition; roles or profiles as transition owners.
6. Webhooks or assignment as after-transition actions (only alerts, field updates, tasks, custom functions are documented).
7. Checklist as a during-action (mentioned only in a community narrative).
8. Exact automatic-transition semantics (`isAutoTransition` with feedback/reply triggers) and continuous-blueprint constraints. CRM docs say continuous means a single owner and no drafts; not confirmed for Desk.
9. Maximum number of states per blueprint. The 16 I/O connections per state is the only structural limit found.
10. iOS app and web-portal support for transitions. Only Android IM reply in transitions is confirmed.
11. Custom views or report filters on blueprint state. Only the 5 predefined blueprint views are documented.
12. The parallel / multiple transitions release (Dec 2022) comes from a community thread that may refer to CRM. Same for the "10 items in During" thread; the pricing table gives Desk 10 (Pro) / 30 (Ent).
13. Edition data comes from the Arabic-served comparison page (tick marks read from HTML classes). Confirm on the English page in a normal browser.
