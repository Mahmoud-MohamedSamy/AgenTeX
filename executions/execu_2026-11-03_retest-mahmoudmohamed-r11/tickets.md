# Round 11 tickets (3 Nov 2026)


---
## NDC-2753 · urgent · Desk
**Title: Blueprint | Running a transition with an attached file fails: “File … does not belong to you” (422)**

Summary
Some ticket blueprint transitions let the agent attach a file. When the agent uploads a file there and clicks Run, the transition fails with “File … does not belong to you.” and the ticket stays in its current state, even though the agent uploaded the file a moment earlier.
Steps to Reproduce
Go to Desk › Tickets and open a ticket that’s in a blueprint, at the Open state.

Click the transition Open To On Hold.

In the transition window, click Add attachment and choose an image, for example “images.png”.

Wait for the file to finish uploading, then click Run.

Expected Result
The transition runs, and the ticket moves to On Hold.

The uploaded file is saved with the transition and shows on the ticket.

Actual Result
An error appears: “File dace0562-650c-4327-b3c7-9ec44a858e39 does not belong to you.”

The ticket stays in Open, and the transition isn’t recorded.

The agent can’t complete any transition that needs an attachment.

Environment
staging-desk.taviportal.com › Tickets › ticket › Blueprint transition “Open To On Hold”

Edge 156.0.8078.48; Windows 10; 1590×591

Reporter Mahmoud Mohamed; captured 1 Nov 2026, 4:20 PM (Cairo)

Attachment — Attachment
Settings
Status Bug, priority urgent, start date 1 Nov 2026.

Assignees: Hegazy, Mahmoud, mfathy.

Label Blueprint; Desk module.

Sprint: the current one, once I can see it.

### Comments (2)
- 2026-11-02T10:50 e1364b0b-d3cd-4167-8261-6194577a480a: Re-check 2 Nov 2026 — still fails.

- staging-desk.taviportal.com, org Anyware, owner account, Edge. QA blueprint in QA WF Dept R with a transition that needs a comment, an attachment, a checklist item and a Priority field.

- On the ticket the file upload shows a green tick and Run becomes active once everything is filled in.

- Run answers 422 "File … does not belong to you." and the ticket stays in its state.

- The same transition without an attachment item runs fine, so only the attachment step fails.

- The QA blueprint and ticket were deleted after the test.
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The transition window uploaded the file as a CRM file, which Desk does not accept as the agent's own. It now uploads it as a Desk file, as the reply box does, so Run moves the ticket and the file is saved with it.
client-engine #763, deployed to staging-desk on 2 Nov. Covered by unit tests; the live re-check on staging is pending (the test account now asks for two-factor sign-in).

---
## NDC-2755 · high · Desk
**Blueprint | A state's automatic close after its time limit is not shown in the state panel ("No limit"), so it can't be seen or changed there**

Summary
In blueprint "Demo · Refund approval", the On Hold state is saved to move tickets on their own to Closed after 3 days ("Close after 3 days without an answer"). The canvas shows "3d" on the state. When you open the state, the panel says Time limit "No limit" and does not show the "When it runs out" setting, so the admin cannot see or change the automatic close there.
Steps to Reproduce
Go to Desk › Setup › Automation › Blueprints and open "Demo · Refund approval".

Look at the On Hold state on the canvas. It shows a 3-day timer ("3d").

Click the On Hold state to open its panel.

Look at Time limit and the settings under it.

Expected Result
The panel shows the state's automatic move: after 3 days, run "Close after 3 days without an answer".

The admin can see, change or remove it from the panel.

Saving the state without changes keeps the automatic close.

Actual Result
Time limit shows "No limit" and "Warn before" is empty.

The "When it runs out" setting is not shown at all.

The saved blueprint still has the automatic close (autoTransitionId: auto-close, autoTransitionAfterMinutes: 4320, no slaMinutes), so it can't be seen or changed in the screen. Not checked yet: whether pressing "Save state" on this panel removes the automatic close.

Environment
staging-desk.taviportal.com (org Anyware) › Setup › Automation › Blueprints › Demo · Refund approval

Edge, Windows 10, 1600×1000

Owner account, 1 Nov 2026. Found during the Blueprint gap analysis (NDC-2754).

Attachment — bug1-onhold-autoclose-hidden.png

### Comments (2)
- 2026-11-01T23:09 e1364b0b-d3cd-4167-8261-6194577a480a: Re-checked on 1 Nov 2026: still open, but narrower. I tested on a QA copy, not on the Demo blueprint. The copy has a state with a 3-day automatic close (autoTransitionAfterMinutes: 4320) and no time limit.

- The state panel still shows Time limit "No limit" and no "When it runs out" setting.

- I pressed "Save state" and then "Save and Publish". The automatic close is kept: the blueprint is published with autoTransitionId: autoclose and 4320 minutes.

So the setting is hidden and can't be changed in the panel, but saving does not remove it. I changed the title to match.
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. A state whose automatic move has its own wait (On Hold: close after 3 days) now shows a "Moves on by itself" section with the transition and the wait, which can be changed or removed. Save state keeps it (it did before too; it was only hidden).
client-engine #764, deployed to staging-desk on 3 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2764 · high · Desk
**Blueprint | A workflow rule can change Status on a ticket the blueprint controls, so the ticket closes and leaves the blueprint**

Summary
While a ticket is in a blueprint, its Status can only change through the blueprint's transitions. A direct change is refused. A workflow rule with a Field Update on Status is not stopped. After an agent runs a transition, the rule sets Status to Closed, and the ticket leaves the blueprint. This can happen through normal admin setup, with no API knowledge. CRM had the same kind of problem in NDC-2730.
Steps to Reproduce
In Setup → Workflow Rules, create an active rule on Tickets: trigger On Edit, criteria subject starts with "QA BP EV4 ", action Field Update Status = Closed.

Have an active blueprint in department QA WF Dept R with states Open → Escalated → Closed that catches tickets with "QA BP EV4 " in the subject.

Create ticket "QA BP EV4 ticket" in that department. It enters the blueprint at Open.

Try to change its Status to Closed directly (API PATCH).

Run the transition Open → Escalated on the ticket and wait a few seconds.

Open the ticket.

Expected Result
A workflow rule can't change a status the blueprint controls: the rule action is skipped (and noted in the rule's history), or the rule can't be saved with Status as a field update.

The ticket stays in the blueprint at Escalated.

Actual Result
The rule is saved with no warning.

The direct change is refused (422 "Governed picklist field can only change via blueprint transition execution."), which is correct.

After the transition the rule runs: ticket #1067 is Closed, has no Steps card and shows "Reopen ticket". It has left the blueprint. In Zoho Desk, Status is locked while a blueprint controls the ticket, and the ticket stays in the blueprint.

Environment
staging-desk.taviportal.com (org Anyware), department QA WF Dept R

Owner account, 2 Nov 2026. Found in the Blueprint functional run, Phase 2 (spec row L3; gap item NDC-2754). Same family as NDC-2730 (CRM).

The QA rule, blueprint and ticket were deleted after the test.

Attachment — BP-P2-4-vs-zoho.png

### Comments (1)
- 2026-11-03T10:40 9529016b-e67d-42b9-815c-263f673b8252: Fixed. A workflow rule can no longer change a Status the blueprint holds. The rule's Field Update of Status is skipped (its other fields still apply), the ticket stays in the blueprint, and the rule's history records the action as skipped because the blueprint holds the field. A rule with a Status Field Update can still be saved: it works on tickets no blueprint holds.
metadata-engine #198 and workflow #130, deployed to staging on 3 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2788 · high · Desk
**Blueprint | Actions set at a state's warning never run (webhook or custom action); actions when the time runs out do run**

Summary
A blueprint state can have a time limit with a warning before it. Actions set to run at the warning never run. This happens with a webhook and with a custom action. Actions set to run when the time runs out do run, so the timer itself works.
Steps to Reproduce
In department Customer Support, create an active blueprint whose state has a time limit of 2 minutes (calendar time) and a warning 1 minute before.

At the warning, add a Webhook action to a test receiver. When the time runs out, add a second Webhook action to the same receiver with a different query, so the two can be told apart.

Create a ticket that enters the blueprint and wait 3 minutes.

Check the receiver.

Expected Result
The warning action runs once at the warning time (1 minute after entry), and the time-out action runs once when the limit is reached.

Actual Result
The warning was due at 09:00:14 (the state shows warning_due_at, not provisional). The warning webhook never arrived; checked until 09:02.

The time-out webhook arrived at 09:01:48.

Same result with a Custom Action at the warning: due 08:15:16, never ran. A Custom Action on time-out ran at 08:20:46.

This is different from NDC-2761, which is about a warning saved at or after the limit. Here the warning is correctly 1 minute before the limit.

In Zoho Desk, state-level SLA escalation actions run at their configured time.

Environment
staging-desk.taviportal.com (org NDC-Staging), department Customer Support, owner account, 3 Nov 2026. Re-checked after the staging outage of 2 Nov had cleared (history and shares were working again).

Receiver: a temporary webhook.site test inbox. The custom action was a QA action that only posts to that inbox.

Found in the Blueprint functional run (spec row K13). All QA blueprints, tickets and the QA custom action were deleted.

Attachment — BP-K13-warning-actions-vs-zoho.png

### Comments (1)
- 2026-11-03T12:47 9529016b-e67d-42b9-815c-263f673b8252: Cause found, fixed and deployed to staging (3 Nov 2026). The warning timer works. The test blueprints were created through the API with the warning's actions under the key slaWarning. The engine reads them from slaPreExpiryEscalation, the key the designer writes. The save went through, so at the warning time there was nothing to run. The saved K13 blueprints held slaWarning, and this morning's events on NDC-Staging show only the time-out actions.

- A Desk blueprint save now refuses a state setting the engine does not read. The error names the setting and says where the warning and time-out actions go, so this mistake can no longer fail silently.

- A new test fires a warning and checks that it runs the warning's own action.
To re-test: set the warning actions in the designer (the state's "At the warning" actions), or in the API under slaPreExpiryEscalation.
PRs: metadata-engine #200, #201. Live re-check pending (two-factor sign-in on the test account).

---
## NDC-2774 · high · Desk
**Business Hours | With business hours set to Mon–Fri, blueprint state and SLA due times still count Saturday**

Summary
When the tenant's business hours are set to work only Monday to Friday, due times counted on business hours still count Saturday as a working day. This affects both blueprint state time limits on the "Business hours" clock and department SLA targets on business hours. The Business Hours page says "SLA policies, blueprints and supervise rules count time in them", so admins expect weekends to be skipped.
Steps to Reproduce

- Setup → Business Hours: set the Default business hours to 24 hours, Monday to Friday (Saturday and Sunday off).

- In department QA WF Dept R, have an active blueprint whose first state has a 5-day (120-hour) time limit on the "Business hours" clock.

- Have a department SLA policy for the same tickets on business hours with resolution 120 hours.

- On Monday 2 Nov 11:57, create a ticket that enters both.

- Wait about 30 seconds, then open the ticket and look at the Steps card and the SLA card.

Expected Result

- 120 working hours from Monday 11:57 with Saturday and Sunday off ends on the next Monday, 9 Nov 11:57, for both the blueprint state and the SLA resolution.

Actual Result

- Steps card: "Due Sat 11:57", "Warning Fri 11:57". That is exactly 5 calendar days. It is the final value: the API first returns a provisional time and recalculates it after about 25 seconds to the same Saturday.

- SLA card, resolution: "Due 07/11/2026 11:57" — also Saturday — while the same card says "4 days 11 hours of business time left". Only about 108 working hours exist before that time.

- A holiday on the default holiday list is skipped correctly. Only the non-working weekend days are counted.

- In Zoho Desk, business hours define the working days, and time outside them is not counted by SLAs or blueprint state SLAs.

Environment

- staging-desk.taviportal.com (org Anyware), department QA WF Dept R, ticket #1107

- Owner account, 2 Nov 2026. Found in the Blueprint functional run (spec rows G6, K8).

- Business hours were changed for a few minutes with approval and restored to 24×7, checked field by field. The QA blueprint, SLA policy and ticket were deleted.

Attachment — BP-BH-weekend-vs-zoho.png

### Comments (1)
- 2026-11-03T10:40 9529016b-e67d-42b9-815c-263f673b8252: Cause. The weekend counting itself is correct. The audit log shows the business hours were saved at 11:57:22 and the ticket was created under a second later. Desk kept the previous 24×7 hours in a one-minute cache, so the ticket was timed on them (holidays are read fresh, which is why they were skipped).
Fixed. Desk now drops its cached business hours the moment they change, so a ticket created right after a change counts on the new hours. Due times already worked out are not recalculated.
desk #207, deployed to staging on 3 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2757 · medium · Desk
**Blueprint | "Close ticket" button is still shown on a ticket that is inside a blueprint**

Summary
Ticket #805 is inside blueprint "Demo · Refund approval" at state Escalated. Its Status is locked ("Set by blueprint Demo · Refund approval"), and the reply box already refuses to close it ("The ticket stays open because it follows blueprint …"). Even so, the "Close ticket" button at the bottom of the ticket is still shown.
Steps to Reproduce

- Go to Desk › Tickets › All Tickets and open ticket #805 "[Demo Refund] Order #1002 arrived damaged".

- Check the header: it shows "Demo · Refund approval / Escalated", and Status shows "Escalated" with a lock and "Set by blueprint Demo · Refund approval".

- Look at the bottom right of the ticket.

Expected Result

- While a ticket is in a blueprint it can only be closed through the blueprint's transitions, so "Close ticket" is hidden or disabled, with a hint to use the transitions (as the Status field and the reply box already do).

Actual Result

- The "Close ticket" button is shown and looks active.

- Not checked yet: what happens when it is clicked (whether it closes the ticket outside the blueprint or shows an error).

Environment

- staging-desk.taviportal.com (org Anyware) › Tickets › #805

- Edge, Windows 10, 1600×1000

- Owner account, 1 Nov 2026. Found during the Blueprint gap analysis (NDC-2754).

Attachment — bug4-close-ticket-in-blueprint.png

### Comments (2)
- 2026-11-01T23:09 e1364b0b-d3cd-4167-8261-6194577a480a: Re-checked on 1 Nov 2026: still open. I clicked the button this time.

- On a QA ticket inside a QA copy of a blueprint, "Close ticket" is shown and active.

- Clicking it opens "Close this ticket? The requester can still reply, which reopens it."

- After pressing "Close ticket" in that dialog, the server refuses and the page shows: "The blueprint "QA BP NDC-2757 copy" controls this ticket's status. Use one of its transitions."

- The status stays Open and the ticket stays in the blueprint, so no data is harmed. The agent is offered an action and is only told at the last step that it is not allowed.

Expected result unchanged: hide or disable "Close ticket" while the ticket is in a blueprint, with a hint to use the transitions.
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. While a blueprint holds the ticket, "Close ticket" is disabled and a note beside it says "This ticket follows blueprint <name>. Use its transitions to close it." Reopen is unchanged. (Clicking it before showed an error: the server already refused the close.)
client-engine #763, deployed to staging-desk on 2 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2758 · medium · Desk
**Blueprint | A blueprint saved with entry criteria in an unknown format is accepted and then catches every ticket in the department**

Summary
When a blueprint is created through the API, the server does not check the format of its entry criteria. Criteria it cannot read are saved without an error. The blueprint then acts as if it had no criteria and catches every new ticket in its department, including tickets that do not match. The designer screen always sends the right format, so this affects API calls and integrations.
Steps to Reproduce

- Create a blueprint with POST /api/v1/modules/{tickets}/blueprints for department QA WF Dept R, active, with entryCriteria: {"kind":"StringMatch","field":"subject","operator":"StartsWith","stringValue":"QA BP N2-ONLY "}. This is the workflow-rule format; the designer saves {"op":"contains","field":"subject","value":"…"}.

- Check the response.

- Create a ticket in the same department with subject "QA BP N2 other subject", which does not start with "QA BP N2-ONLY ".

- Open the ticket and check whether it is in the blueprint.

- Open the blueprint in the designer and look at Criteria.

Expected Result

- The server refuses criteria it cannot read (400/422 with a clear message).

- A ticket that does not match the criteria never enters the blueprint.

Actual Result

- The blueprint is saved (201 Created).

- The ticket that does not match (#966 in the evidence run) enters the blueprint at Open, and its Status is locked by it.

- The designer still shows Criteria "Tickets that match", so the admin can't see that it catches every ticket. In Zoho Desk, applying a blueprint to every ticket is a separate, visible "All Records" choice.

Environment

- staging-desk.taviportal.com (org Anyware), API, department QA WF Dept R

- Owner account, 1 Nov 2026. Found in the Blueprint functional run (spec rows N2, C6; gap item NDC-2754).

- The QA blueprint and ticket were deleted after the test.

Attachment — NDC-2758-vs-zoho.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The server now refuses entry criteria (and transition criteria) it cannot read, with a message saying why. Criteria it cannot read also no longer catch every ticket: they match none. No stored blueprint on staging was affected.
metadata-engine #197, deployed to staging on 2 Nov. Covered by unit and integration tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2761 · medium · Desk
**Blueprint | The API saves a state warning that is not before the time limit, and live tickets then get no warning**

Summary
The designer refuses a state warning that is equal to or later than the state's time limit ("The warning must come before the time limit."). The server does not check this. Through the API, a warning equal to the limit, later than the limit, or a warning with no limit at all is saved. The blueprint can be made active, tickets enter it, and the warning is silently dropped, so the warning actions never run.
Steps to Reproduce

- Create a blueprint with POST /api/v1/modules/{tickets}/blueprints for department QA WF Dept R where state Open has slaMinutes: 60, slaPreExpiryMinutes: 120 (warning later than the limit). Repeat with 120 / 120 and with only slaPreExpiryMinutes: 60.

- Check the responses.

- Make one of them active and create a ticket in the department that matches its criteria.

- Read the ticket's blueprint state (GET …/records/{id}/blueprint-state) and look at the warning time.

- Open the blueprint in the designer.

Expected Result

- The server refuses the three bodies with a clear message, the same rule the designer uses.

Actual Result

- All three are saved as sent (201 Created).

- The active blueprint catches the ticket; it gets a due time but warning_due_at is null, so no warning action runs.

- The designer shows "1 issue to fix before publishing" only when someone opens the blueprint. In Zoho Desk the state SLA time and escalation come from fixed choices (Before / On Time / After), so this cannot be set.

Environment

- staging-desk.taviportal.com (org Anyware), API, department QA WF Dept R

- Owner account, 2 Nov 2026. Found in the Blueprint functional run, Phase 2 (spec row G3; gap item NDC-2754).

- The QA blueprints and tickets were deleted after the test.

Attachment — BP-P2-1-vs-zoho.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The server now refuses a warning that is equal to or later than the time limit, a warning with no limit, and a negative warning, with the designer's message "the warning must come before the time limit."
metadata-engine #197, deployed to staging on 2 Nov. Covered by unit and integration tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2762 · medium · Desk
**Blueprint | The API saves a negative state time limit; the designer shows "No limit" and tickets get no timer**

Summary
The server accepts a negative time limit on a blueprint state. A limit of -1 minute is saved through the API, the blueprint can be made active, and tickets in that state get no due time. The designer shows the state as "No limit" with no error, so the admin can't see what was saved. Decimals and text are already refused, so only the check for zero and negative numbers is missing.
Steps to Reproduce
Create a blueprint with POST /api/v1/modules/{tickets}/blueprints for department QA WF Dept R where state Open has slaMinutes: -1.

Check the response and the saved state.

Make it active and create a ticket in the department that matches its criteria.

Read the ticket's blueprint state and look at the due time.

Open the blueprint in the designer and click the Open state.

Expected Result
The server refuses a time limit of zero or less (400/422 with a clear message).

Actual Result
Saved with slaMinutes: -1 (201 Created). A limit of 0 is saved too.

The active blueprint catches the ticket, which gets no due time (slaDueAt null).

The designer shows Time limit "No limit" and no issue. In Zoho Desk the state SLA time is picked from a list of positive values.

Environment
staging-desk.taviportal.com (org Anyware), API, department QA WF Dept R

Owner account, 2 Nov 2026. Found in the Blueprint functional run, Phase 2 (spec row G4; gap item NDC-2754).

The QA blueprints and tickets were deleted after the test.

Attachment — BP-P2-2-vs-zoho.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The server now refuses a negative time limit ("the time limit cannot be negative") and a negative automatic wait. A limit of 0 still means "No limit", which is how the CRM designer saves it.
metadata-engine #197, deployed to staging on 2 Nov. Covered by unit and integration tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2763 · medium · Desk
**Blueprint | The API saves an automatic move that points at a transition from another state, and it never runs**

Summary
A state's automatic move can be set, through the API, to a transition that does not start from that state. The server saves it, the blueprint can be made active, and the move is never scheduled. The ticket stays in the state while the designer shows a timer on it as if it works. The same mistake in the customer-reply trigger is already refused with a clear message.
Steps to Reproduce
Create a blueprint with POST /api/v1/modules/{tickets}/blueprints for department QA WF Dept R with states Open, Escalated, Closed and transitions "go" (Open → Escalated) and "esc2" (Escalated → Closed). On state Open set autoTransitionId: "esc2", autoTransitionAfterMinutes: 1.

Check the response.

Make it active, create a matching ticket in the department and wait 2 minutes.

Read the ticket's blueprint state.

For comparison, save the same blueprint with onReplyTransitionId: "esc2" on Open instead.

Open the first blueprint in the designer.

Expected Result
The server refuses an automatic move to a transition that is not a way out of the state, as it does for the reply trigger.

Actual Result
Saved (201 Created) with autoTransitionId: "esc2".

The ticket enters at Open, auto_due_at stays null, and after 100 seconds it is still at Open.

The reply-trigger version is refused (422): "State 'Open': 'esc2' is not a transition out of this state, so it cannot run on the contact's reply."

The designer shows a "5m"-style timer badge on Open, no issue banner, and no automatic-move setting in the state panel. In Zoho Desk, Auto Transition is switched on inside the transition, so it always belongs to the state the transition starts from.

Environment
staging-desk.taviportal.com (org Anyware), API, department QA WF Dept R

Owner account, 2 Nov 2026. Found in the Blueprint functional run, Phase 2 (spec row G5; gap item NDC-2754).

The QA blueprints and tickets were deleted after the test.

Attachment — BP-P2-3-vs-zoho.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The server now refuses an automatic move that is not a way out of its state, as it does for the reply trigger: "State 'Open': 'esc2' is not a transition out of this state, so it cannot run automatically." The state panel also shows the automatic move now (see NDC-2755).
metadata-engine #197, deployed to staging on 2 Nov. Covered by unit and integration tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2775 · medium · Desk
**Blueprint | A status a live blueprint uses can be removed when no ticket is in it, and tickets then move into the removed status**

Summary
A ticket status that an active blueprint uses as a state can be removed when no ticket is currently in that state. The blueprint stays active and keeps running. The next ticket that runs the transition into that state gets a Status that no longer exists. Removal is correctly refused when a ticket is already in the state.
Steps to Reproduce

- Add a status "QA BP Verify" (type Open) with Add State in the blueprint designer.

- Have an active blueprint in department QA WF Dept R with states Open → QA BP Verify → Closed. Make sure no ticket is in "QA BP Verify".

- Remove "QA BP Verify" from the ticket Status values (the Status field's allowed values, PUT /api/v1/modules/{tickets}/fields/{status}).

- Create a ticket that enters the blueprint and run the transition Open → QA BP Verify.

- Open the ticket, then open the blueprint in the designer.

Expected Result

- The status can't be removed while an active blueprint uses it as a state, as when a ticket is in it ("… cannot be removed or merged"), or the blueprint stops offering that transition.

Actual Result

- The removal is accepted (200) and the blueprint stays Active.

- The transition runs (200). Ticket #1109 now has Status "QA BP Verify", locked and "Set by blueprint QA BP C20c", although it is no longer a ticket status.

- The designer shows "1 issue to fix before publishing · QA BP Verify is no longer a ticket status", but the published version keeps running.

- With a ticket already in the state, the same removal is refused: 422 FIELD_OPTION_IN_BLUEPRINT "… 1 record(s) are in it, so it cannot be removed or merged."

- In Zoho Desk, Status is locked inside a blueprint and changes only through its transitions. Zoho help does not describe deleting a used status, and it was not tried in Zoho.

Environment

- staging-desk.taviportal.com (org Anyware), department QA WF Dept R

- Owner account, 2 Nov 2026. Found in the Blueprint functional run (spec row C20).

- The QA status was added with approval and removed again. The Status field is back to its 5 original values. The QA blueprint and ticket were deleted.

Attachment — BP-C20-removed-status-vs-zoho.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. A status that an active blueprint uses as a state can no longer be removed or merged, even with no ticket in it: "… is a state of the active blueprint …, so it cannot be removed or merged." Once the blueprint is switched off, the status can be removed.
metadata-engine #197, deployed to staging on 2 Nov. Covered by an integration test; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2782 · medium · Desk
**Blueprint | Moving a ticket in a blueprint to another department keeps the blueprint status (Zoho resets it to Open)**

Summary
When a ticket that is in a blueprint is moved to another department, it correctly leaves the blueprint and becomes unassigned, but it keeps the status the blueprint set (for example "On Hold"). In Zoho Desk the moved ticket is treated as a new ticket in the receiving department and its status is reset to Open.
Steps to Reproduce
Have an active blueprint in department QA WF Dept R with states Open → On Hold → Closed.

Create a ticket that enters the blueprint and run the transition into "On Hold". The ticket shows Status "On Hold", locked, "Set by blueprint".

Move the ticket to another department (DAR Review). The API call is POST /api/v1/desk/tickets/{id}/move.

Open the ticket in the new department.

Expected Result
As in Zoho Desk, the ticket leaves the blueprint, becomes unassigned, and its Status is reset to Open in the new department.

Actual Result
The move is accepted (200). The ticket leaves the blueprint (no Steps card) and the owner becomes Unassigned, the same as Zoho.

Status stays "On Hold". The status the blueprint set in the old department is carried into the new department, where no blueprint or rule put it there.

Zoho Desk (ticket #102, moved from "Haytham Mohamed" to "Tech"): the ticket left the blueprint, the owner became Unassigned, and Status was reset to Open.

Environment
staging-desk.taviportal.com (org Anyware), QA WF Dept R → DAR Review, owner account, 2 Nov 2026 (ticket #1135).

Zoho Desk Enterprise trial (QA blueprint and ticket created with approval, deleted after).

Found in the Blueprint functional run (spec row L7). The QA blueprint and ticket were deleted.

Attachment — BP-L7-move-status-vs-zoho.png

### Comments (2)
- 2026-11-03T11:48 9529016b-e67d-42b9-815c-263f673b8252: Fixed and deployed to staging (3 Nov 2026). A moved ticket now arrives Open from any status, as in Zoho. On Hold, Escalated and custom statuses go back to Open, the same as closed ones. This applies to a person's move and to an assignment rule's move. Before this, only closed statuses were reset, so a ticket that left a blueprint by moving kept the status the blueprint set.
One case still keeps its status: an assignment rule that moves a ticket a blueprint still governs. A person's move takes the ticket out of the blueprint first, so it is reset.
PR: desk #208. Live re-check pending (two-factor sign-in on the test account).
- 2026-11-03T12:47 9529016b-e67d-42b9-815c-263f673b8252: Follow-up (3 Nov 2026), deployed to staging. The case my earlier comment left open is fixed: when an assignment rule moves a ticket out of a blueprint, the ticket now arrives Open too. If the receiving department's own blueprint takes the ticket in, that blueprint sets the status. PR: desk #209.

---
## NDC-2756 · low · Desk
**Blueprint | The time-limit example always says "Counted on a Monday to Friday, 9 to 5 week", not the tenant's real business hours**

Summary
When a blueprint state has a time limit counted in business hours, the panel shows an example of when a ticket gets the warning and is due. The example is always worked out on a Monday to Friday, 9 to 5 week. This tenant's business hours are 24×7, and the real ticket timers follow 24×7, so the example shows different times from what will really happen.
Steps to Reproduce

- Go to Desk › Setup › Business Hours and check the hours: Default, 24×7, Africa/Cairo.

- Go to Setup › Automation › Blueprints and open "Demo · Refund approval".

- Click the Escalated state (Time limit 8 hours, Warn before 1 hour, Clock "Business hours").

- Read the example under Clock.

Expected Result

- The example uses the tenant's business hours. With 24×7 hours, a ticket that enters on Monday 16:00 gets the warning on Monday 23:00 and is due on Tuesday 00:00, matching what the ticket timer does.

Actual Result

- The example says: "A ticket that enters on Monday 16:00 gets the warning on Tuesday 15:00 and is due on Tuesday 16:00. Counted on a Monday to Friday, 9 to 5 week."

- Real tickets in this state follow 24×7: ticket #805 entered Escalated on 30 Oct 16:51 UTC and its time limit ran out on 31 Oct 00:51 UTC, exactly 8 hours later.

Environment

- staging-desk.taviportal.com (org Anyware) › Setup › Automation › Blueprints › Demo · Refund approval › Escalated

- Edge, Windows 10, 1600×1000

- Owner account, 1 Nov 2026. Found during the Blueprint gap analysis (NDC-2754).

Attachment — bug2-example-fixed-week.png

### Comments (1)
- 2026-11-03T10:39 9529016b-e67d-42b9-815c-263f673b8252: Fixed. The example is now worked out on the tenant's default business hours and names them ("Counted on the default business hours, Default."). With 24×7 hours it matches the ticket timer. If the hours cannot be read, it says it uses a sample Monday to Friday, 9 to 5 week.
client-engine #764, deployed to staging-desk on 3 Nov. Covered by unit tests; the live re-check is pending (two-factor sign-in on the test account).

---
## NDC-2780 · low · Desk
**Blueprint | Blueprint name accepts special characters and has no length limit (Zoho refuses special characters and stops at 60)**

Summary
The blueprint name in TAVI Desk accepts special characters such as < > ( ) and any length. Zoho Desk refuses special characters in the blueprint name and stops the name at 60 characters (description at 1000).
Steps to Reproduce
Go to Setup → Automation → Blueprints → New blueprint.

In Name, type QA BP <script>alert(1)</script> and save the blueprint as a draft.

Create another blueprint with a name of 70 characters, then one with 309 characters, and save each.

Do the same in Zoho Desk: Setup → Blueprint → Create Blueprint, type the same names and press Next.

Expected Result
As in Zoho Desk, a name with special characters is refused with a clear message ("Special characters are not allowed.").

The name is limited to 60 characters and the description to 1000, in the designer and in the API.

Actual Result
The name QA BP <script>alert(1)</script> is saved as typed (201). It is shown as plain text, so the script does not run.

Names of 70 and 309 characters are saved in full (201). The designer's Name and Description boxes have no length limit.

Arabic, emoji and trailing spaces are accepted and kept as typed, the same as in Zoho. These are not part of this bug.

Environment
staging-desk.taviportal.com (org Anyware), department QA WF Dept R, owner account, 2 Nov 2026.

Zoho Desk Enterprise trial, checked read only (typed, Next, then Discard; nothing saved in Zoho).

Found in the Blueprint functional run (spec row C3). The QA blueprints were deleted.

Attachment — BP-C3-name-rules-vs-zoho.png

### Comments (1)
- 2026-11-03T11:48 9529016b-e67d-42b9-815c-263f673b8252: Fixed and deployed to staging (3 Nov 2026). The blueprint name now follows Zoho's rules, in the designer and on every save, drafts included:

- The name stops at 60 characters and the description at 1000.

- A name with < > ( ) [ ] { } " \ / ; = ` | ^ ~ $ % * # @ ! ? + shows "Special characters are not allowed" under the Name box. Save Draft and Publish stay disabled until the name is fixed, and the server refuses it too.

- Arabic, emoji, spaces and - _ . , ' & : are allowed. Zoho does not publish its exact list, so & and : are allowed because existing names use them.

- A blueprint already saved with a name outside these rules keeps saving while that name is unchanged.
PRs: metadata-engine #199, client-engine #765. Live re-check pending (two-factor sign-in on the test account).

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

### Comments (1)
- 2026-11-02T15:41 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 2 Nov 2026 (not fully testable today — state unchanged)
Environment: staging-desk.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test user 3 as Desk Agent
Method: API and screen
API: the agent's ticket save returns 201 and the ticket opens (200). The screen toast could not be checked (staging-desk down).
Checked:

- create → 201 [PASS]

- read back → 200 [PASS]

- screen → not checked (staging-desk down) [INFO]
Evidence: NDC-2661-retest-BLOCKED.png (attached)

---
## NDC-2701 · high · CRM
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

### Comments (6)
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
- 2026-11-02T15:35 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 2 Nov 2026 (not fully testable today — state unchanged)
Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)
Method: API and screen
Partly checked: on the Leads board a first drop onto Unaccounted is refused. Not verified: the "no longer an option" marker (couldn't create a removed pick-list value through the API) and the Deals-board case.
Checked:

- first drop → refused, no dialog, status stays Interested [PASS]

- removed value → not possible by API (PATCH 405, PUT 400) [INFO]

- Deals board → not reproduced (Anyware deals all have a stage) [INFO]

- drag out → drag not registered headless [INFO]
Evidence: NDC-2113-retest-BLOCKED.png (attached)

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

### Comments (3)
- 2026-10-14T03:08 e1364b0b-d3cd-4167-8261-6194577a480a: <p><b>Triage (code review, 2026-10-14): one demonstrable over-fetch, but the spread needs measuring.</b></p><p>Confirmed from the code: opening a board issues one summary request plus one request per column, each asking for 100 records — so a 12-column board makes 13 calls and fetches up to 1,200 rows to paint first cards. That is a fair thing to cut (a smaller first page per column, with the existing infinite scroll filling in).</p><p>What I cannot conclude from code is the reported spread: a 2.3 s median against a 26 s maximum looks like server or contention variance, not a fixed client cost.</p><p><b>Please attach:</b> (1) per-request timing for the summary and the column calls (HAR), (2) the same board with <code>per_page=25</code> versus <code>100</code> for server-side comparison, and (3) whether the 26 s case coincided with other load. I will then reduce the first-page size and, if the time is server-side, hand the query plan to metadata-engine.</p>
- 2026-10-26T13:20 e1364b0b-d3cd-4167-8261-6194577a480a: Retest 26 Oct 2026 — still fails
Transactions kanban, three reloads: column headers after 2.4, 2.4 and 3.4 seconds, first cards after 3.0, 4.5 and 4.2 seconds. The target is 2 seconds (it was 5.1), so it is better but not there yet.
Also seen on 26 Oct, not part of this ticket: every kanban column says "This value is no longer an option of the field", columns show keys such as Closed_won, and cards show "Resolving owner…".
Environment: staging-crm.taviportal.com, owner account; timings from the manual run on 25 Oct (case KB-04).
Annotated TAVI-vs-Zoho image attached: NDC-2137-retest.png
- 2026-11-02T15:36 e1364b0b-d3cd-4167-8261-6194577a480a: Retest BLOCKED — 2 Nov 2026 (not fully testable today — state unchanged)
Environment: staging-crm.taviportal.com, tenant Anyware, Edge (headless) + API; accounts: owner, test users (CRM User profile)
Method: API and screen
Could not time the board with real data: switching list → Kanban took 0.65–0.71 s, but the board was filtered to 0 cards; full reloads took 28–90 s on staging today.
Checked:

- switch to Kanban → 0.65 / 0.65 / 0.71 s (board filtered to 0 cards) [INFO]

- reload → 28–90 s per page [INFO]
Evidence: NDC-2137-retest-BLOCKED.png (attached)