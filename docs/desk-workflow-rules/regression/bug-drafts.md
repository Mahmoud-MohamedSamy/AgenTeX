# Desk Workflow Rules — Plane drafts (not filed)

From the regression runs 1 + 2 (22–23 Nov 2026) and the fail retest (23 Nov), NDC-Staging. 18 drafts: 2 fails, 16 findings.

## Desk Workflow Rules | API accepts owner type "assignment rule" for Owner Assignment, but it never assigns

*AC-10 · FINDING · suggested priority Low · Decision / Zoho check first*

**Steps**
1. Through the API, save a Tickets workflow rule whose Owner Assignment action uses the owner type "assignment rule", pointing at an active direct rule that matches the ticket (assign Test User 1).
2. Create a matching ticket and open Execution History.

**Expected:** Either the API refuses this owner type (the editor does not offer it, and Zoho Desk has no such option), or the ticket is assigned by the chosen assignment rule.

**Actual:** The rule saves, and every ticket is Skipped with "Not assigned: the assignment rule picked nobody." A deleted assignment rule also stays in the action with no warning. The editor does not offer the option (matches Zoho: Assign Ticket = Agent / Team / Agent in a Team).

**Before filing:** Product decision: remove the owner type from the API, or finish it as a TAVI extra.

**Environment:** NDC-Staging, Desk → Tickets. API: 8/8 tickets skipped (run 2 22 Nov + retest 23 Nov). Editor and Zoho checks 23 Nov: evidence/AC10-ui-code-check.txt, AC10-zoho-assign-ticket-options.png.

## Desk Workflow Rules | "Field changed" condition matches when a ticket is created, so Create or Edit rules run on every new ticket

*TC-01 · FAIL · suggested priority High · Ready to file*

**Steps**
1. Create a workflow rule on Tickets with the trigger Create or Edit, the condition Priority changed, and any action (e.g. Field Update).
2. Create a ticket with Priority Low.
3. Open Execution History for the rule.
4. Edit the ticket: Priority Low to High.

**Expected:** Creating the ticket does not run the rule (nothing has changed yet). The rule runs once, on the edit that changes Priority.

**Actual:** The rule runs when the ticket is created (Fired, action Succeeded) and again on the edit. "Changed" matches every new ticket whatever the field or value: also with Subject changed, and through the API on On Create rules (3 of 3 tickets: High, default, Low). On Edit rules behave correctly.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3186 (23 Nov). Relates to NDC-2205. Retest 2 (23 Nov): 7 tickets, all results above. Teammate Jam https://jam.dev/c/40183b6e-c9ff-427e-861b-e50079cfe7b5: rule "test" (Customer Support, Create or Edit, Priority changed, Add Tags) fired on create for #7197, #7208, #7209, #7210 (default priority included). Editor (app code): "changed" is hidden for On Create but offered for Create or Edit (evidence/TC01-editor-code-check.txt).

## Desk Workflow Rules | Test rule on an unsaved rule fails with "An unexpected error occurred"

*OB-02 · FAIL · suggested priority Medium · Ready to file*

**Steps**
1. Open Workflow Rules → New Rule on Tickets, add a condition (Priority is High) and a Field Update action. Do not save.
2. Click Test rule and run it on a sample record.

**Expected:** The test shows whether the sample record matches and which actions would run.

**Actual:** The test fails with "An unexpected error occurred. Please try again." (server error 500), for both a matching and a non-matching sample. Test rule on a saved rule works.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3196 (23 Nov, annotated image attached). Fails only when the unsaved rule is limited to departments. Full draft in ob-02-ticket-draft.md (UI path confirmed in app code: evidence/OB02-ui-code-check.txt). Retest 23 Nov: 2/2 errors; runs 1 and 2: every try. Screenshot OB02-new-editor.png.

## Desk Workflow Rules | Editing a rule cancels its pending scheduled actions

*MR-07 · FINDING · suggested priority High · Ready to file*

**Steps**
1. Create a workflow rule on Tickets, On Create, with a Field Update action delayed by 90 seconds.
2. Create a ticket that matches.
3. Within the 90 seconds, edit the rule (e.g. change the Field Update value) and save.
4. Wait 2 minutes and open Execution History.

**Expected:** The pending action still runs (old or new version), or the editor warns that pending scheduled actions will be cancelled.

**Actual:** The pending action is Cancelled ("rule action … no longer exists") and nothing runs on the ticket. No warning when saving. Any edit of a rule silently drops every pending scheduled action.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3203 (23 Nov). Run 2, 22 Nov, NDC-Staging.

## Desk Workflow Rules | Reassign based on skills gives the ticket to an offline agent, and shows Succeeded when no agent qualifies

*AT-12 · FINDING · suggested priority Medium · Ready to file*

**Steps**
1. In QA AO Dept B create a skill and give it to one agent only (Dev Team 2), who is offline.
2. Create a workflow rule On Create with Add skills → that skill, and a rule On Edit with Reassign based on skills.
3. Create a ticket (it gets the skill), then edit it.
4. Repeat with a ticket that has an owner and no skill any agent has.

**Expected:** Only online agents with the skill are picked (as other Desk assignment does); if none is online, or no agent has the skills, the owner is kept and the action shows Skipped with the reason. Zoho Desk routes by skills only to agents online in the email channel unless "Assign tickets to offline agents" is on.

**Actual:** The ticket is assigned to Dev Team 2 although Dev Team 2 is offline (presence: not online, last active 19 Nov). For the ticket with no qualified agent the owner is kept (changed since 22 Nov, when it was cleared), but the action still shows Succeeded with no reason.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3204 (23 Nov). Re-run 23 Nov (2 tickets) on NDC-Staging; run 2 on 22 Nov.

## Desk Workflow Rules | The ticket number cannot be put in a rule comment: not in Insert field, and ${ticket_number} comes out empty

*AT-03 · FINDING · suggested priority Medium · Ready to file*

**Steps**
1. Create a workflow rule with the action Add comment.
2. Open Insert field and look for the ticket number.
3. Type the comment "S=${subject} P=${priority} N=${ticket_number}" by hand and save.
4. Create a matching ticket and open its comments.

**Expected:** Insert field offers the ticket number, and it is filled in the comment like ${subject}. Zoho Desk offers the ticket number as the placeholder Request Id.

**Actual:** Insert field (168 entries) has no ticket number. Typed by hand, the comment reads "S=<subject> P=medium N=" — the number is empty (ticket #7216). ${subject} and ${priority} are filled. The Insert field list also shows raw field keys (subject, contact_id) instead of field labels.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3205 (23 Nov). Re-checked 23 Nov (UI + 1 ticket); 22 Nov run 2. Related: NDC-2958 (Done, ${recordId} empty).

## Desk Workflow Rules | "SLA violated is false" does not match tickets without an SLA

*CF-11 · FINDING · suggested priority Medium · Ready to file*

**Steps**
1. Create a workflow rule on Tickets with the condition SLA violated is false (or SLA escalated is false).
2. Create a ticket in a department with no SLA.

**Expected:** The rule runs: the ticket is not violated / not escalated. Zoho Desk (checked live 23 Nov): a ticket with no SLA has Is Escalated = false and Is Overdue = false, so "is false" matches.

**Actual:** The rule does not run. The checkboxes are empty rather than unticked on tickets without an SLA, so "is false" never matches.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3206 (23 Nov). Run 2, 22 Nov.

## Desk Workflow Rules | Rules list takes about a minute to load with ~200 rules

*PF-03 · FINDING · suggested priority Medium · Ready to file*

**Steps**
1. Have about 220 workflow rules on Tickets (the limit is 200 per department).
2. Open Settings → Automation → Workflow Rules.

**Expected:** The list shows within a few seconds (paged or virtualised).

**Actual:** With 227 rules the first row appeared after 49 s (74 s on 22 Nov with 217); all rows render at once. A second load in the same session took over 3 minutes.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3207 (23 Nov). Re-run 23 Nov with 165 temporary inactive rules (deleted after); 22 Nov run 2.

## Desk Workflow Rules | Update related record shows Succeeded when the ticket has no contact

*AC-25 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Create a workflow rule with Update related record → Contact → set a field.
2. Create a matching ticket with no contact.
3. Open Execution History.

**Expected:** The action shows Skipped with a reason such as "no related contact".

**Actual:** The action shows Succeeded although nothing was updated.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3208 (23 Nov). Run 2, 22 Nov.

## Desk Workflow Rules | Saving a rule with only its actions changed removes its conditions

*API-01 · FINDING · suggested priority Low · Decision / Zoho check first*

**Steps**
1. Take a rule with conditions (e.g. Subject starts with "QA").
2. Save a change that sends only the actions (API PATCH with only actions).
3. Create any ticket.

**Expected:** The conditions are kept, or the save is refused.

**Actual:** The conditions are cleared, the rule becomes "All tickets" and runs on every new ticket (6 unrelated tickets in the test).

**Before filing:** What the UI does (captured 23 Nov): when you change only an action, the editor sends the whole rule with the conditions (criteria key present), so conditions are kept. When you remove all conditions, the editor sends the rule with NO criteria key, and the API stores criteria = null; the editor then shows "No conditions — actions run on every event of this trigger". So the API already matches the UI: a missing criteria means no conditions. Only an outside API client that leaves criteria out by mistake turns a rule into "all tickets". Options: keep as is (document it), or require an explicit criteria: null to clear (needs a matching editor change).

**Environment:** NDC-Staging, Desk → Tickets. Run 1, 22 Nov.

## Desk Workflow Rules | Field Update saves a picklist value that is not one of the field's options

*AC-03 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Create a workflow rule with Field Update → Classification = "Problem" (capital P, not the option key) via API.
2. Create a matching ticket.

**Expected:** The value is refused or mapped to the option "problem".

**Actual:** The ticket stores "Problem", which is not one of the field's options.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3209 (23 Nov). Run 1, 22 Nov.

## Desk Workflow Rules | Text condition "is" is case-sensitive

*CO-86 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Create a rule with Subject is "abc".
2. Create a ticket with subject "ABC".

**Expected:** Matches (Zoho text comparisons ignore case). Zoho Desk (checked live 23 Nov): "contains" and "is" ignore letter case.

**Actual:** Does not match. The editor saves "equals", "contains", "starts with" and "ends with" as case-sensitive; only pattern matching has an Ignore case option, so users cannot make text conditions ignore case.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3210 (23 Nov). Run 2, 22 Nov.

## Desk Workflow Rules | Date "between" condition accepts From later than To

*CO-90 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. In the rule editor add a condition Due date between, with From = 10 Dec and To = 1 Dec (From after To).
2. Save the rule.

**Expected:** The save is refused with a message.

**Actual:** Saved; the rule never matches.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3211 (23 Nov). Run 2, 22 Nov.

## Desk Workflow Rules | Deleted tag stays in rule conditions with no warning

*CO-92 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Create a rule with Tags is "zz tag".
2. Delete the tag in Desk settings.
3. Open the rule.

**Expected:** The rule shows the tag as deleted (or is deactivated with a notice).

**Actual:** The rule stays active with the deleted tag in its condition, no marker or warning.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3212 (23 Nov). Run 2, 22 Nov.

## Desk Workflow Rules | API accepts Send happiness email on an On Delete rule

*MX-04 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Save an On Delete rule with Send happiness email through the API.

**Expected:** Refused, as the editor does (it offers only Webhook, Email, Task, Create Record, Function).

**Actual:** Saved.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3213 (23 Nov). Run 1, 22 Nov.

## Desk Workflow Rules | Test rule sample data uses a CRM field ("revenue")

*UX-09 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Open a Tickets rule → Test rule.

**Expected:** The sample record uses ticket fields (subject, priority …).

**Actual:** The default sample JSON is {"revenue": …}, a CRM field.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3214 (23 Nov). Run 1, 22 Nov.

## Desk Workflow Rules | API saves a CRM role as the owner role or email recipient of a Desk rule

*RG-02 · FINDING · suggested priority Low · Ready to file*

**Steps**
1. Through the API, save a Tickets workflow rule with Owner Assignment → Round robin among a role, using a CRM role id (e.g. the CRM "CEO" role) instead of a Desk role.
2. Save another rule with an Email action whose recipient is that CRM role.
3. Activate the owner rule and create a matching ticket.

**Expected:** Both saves are refused: Desk rules only take Desk roles (the editor lists Desk roles only).

**Actual:** Both rules save (201). At run time the owner action is Skipped: "Not assigned: nobody in the org unit is an active Desk user." The email rule was not run, to avoid mailing CRM staff.

**Environment:** NDC-Staging, Desk → Tickets. FILED as NDC-3215 (23 Nov). Re-run with Desk roles 23 Nov (2 tickets). Desk roles and profiles themselves work correctly (AC-07, AC-08).

## Desk Workflow Rules | Date-Time rule never runs for a date already in the past

*TD-11 · FINDING · suggested priority Low · Decision / Zoho check first*

**Steps**
1. Create a rule "1 min after Due date".
2. Create a ticket with Due date 30 min ago.

**Expected:** To confirm in Zoho (Zoho skips past times; if so, show it in Execution History).

**Actual:** Nothing runs and nothing is logged.

**Environment:** NDC-Staging, Desk → Tickets. Run 1, 22 Nov.

