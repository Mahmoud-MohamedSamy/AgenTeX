# Ticket History | Owner change made by a workflow rule through the background worker is logged twice and not attributed to the rule

**Summary**
When a workflow rule's Owner Assignment is finished by the background worker (the owner is set a few seconds after the rule runs, which happens when several tickets are edited at the same moment), Ticket History shows the same owner change twice: "Ticket owner was changed" and "Ticket Owner was updated", with the same old and new owner. Neither line says "by workflow rule …". When the rule sets the owner directly, the change is logged once and attributed correctly ("Owner changed … by workflow rule <name>"). Found while retesting NDC-2997.

**Steps to Reproduce**
1. Create 3 tickets in department QA AO Dept A (e.g. "QA RT20 W2 2997 rapid t1/t2/t3"; t1 = #5027).
2. Create an active Desk workflow rule: Tickets, On Edit, department QA AO Dept A, no conditions, action Owner Assignment > Org unit (round robin) > Manager (Dev Team 2, Test User 1).
3. Change the priority of all 3 tickets at the same moment (3 tabs or bulk edit). Wait about 12 seconds.
4. Repeat step 3 three more times (4 rounds, 12 edits). In one or more rounds the owner changes a few seconds after the edit (the background worker finished it); on #5027 this was round 3 (owner Test User 1 at ~1 s, Dev Team 2 at 12 s).
5. Open that ticket > History.

**Expected Result**
- One entry per owner change: "Owner changed … Old / New … by workflow rule <rule name>", the same as when the rule sets the owner directly.

**Actual Result**
- Two entries for the same change at the same time: "Ticket owner was changed" (Test User 1 → Dev Team 2) and "Ticket Owner was updated" (Test User 1 → Dev Team 2).
- Neither entry names the workflow rule (API event source: engine).
- Direct changes on the same ticket are correct: one "Owner changed Dev Team 2 → Test User 1, by workflow rule QA RT20 W2 2997 rapid".

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Edge + API, 17 Nov 2026. Ticket #5027; rule "QA RT20 W2 2997 rapid" (inactive).

**Suggested priority**: Low

**Related**: NDC-2997

**Evidence**: BUG-history-owner-change-twice-bg-FAIL.png
