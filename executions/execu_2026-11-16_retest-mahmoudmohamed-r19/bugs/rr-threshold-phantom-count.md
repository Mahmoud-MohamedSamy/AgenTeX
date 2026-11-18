# Round Robin Assignment | Department threshold counts Open tickets the agent does not have, so tickets wait while the agent is under the limit

**Summary**
For some agents, the round robin department threshold counts one or two more Open tickets than the agent really has in that department. New tickets then stay unassigned (backlog) although the agent is under the threshold. The extra tickets appear in no ticket list and not in the agent's workload. Found while retesting NDC-2824 and NDC-2970 (both pass on the threshold logic itself).

**Steps to Reproduce**
1. Open Desk > Tickets, filter QA AO Dept B by owner Test User 1 and status Open: 4 tickets (#4281, #4282, #4283, #4285). The agent's workload shows the same 4.
2. Go to Setup > Assignment Rules > Round Robin, QA AO Dept B. Create a rule whose only agent is Test User 1 (Sequential), matching a test subject.
3. In the department's round robin settings, turn on "Department threshold", set it to 5, allow offline agents, and save.
4. Create a ticket in QA AO Dept B that matches the rule. It stays unassigned.
5. Set the threshold to 6 and create another matching ticket. It stays unassigned.
6. Set the threshold to 7 and create another matching ticket. It is assigned to Test User 1.
7. Repeat steps 2–6 for Dev Team 2 (1 Open ticket, #4284): threshold 2 waits (tried 3 times), threshold 3 assigns.

**Expected Result**
- The threshold counts only the agent's real Open (and Escalated) tickets in that department, the same tickets the list and the workload show.
- With 4 Open tickets, a threshold of 5 lets the next ticket go to Test User 1; with 1 Open ticket, a threshold of 2 lets the next ticket go to Dev Team 2.

**Actual Result**
- Test User 1: real Open 4, rule counts 6 (+2). #4588 (thr 5) and #4589 (thr 6) wait; #4590 (thr 7) is assigned. Same at 12:01Z (#4584/#4585) and in every run earlier in the day.
- Dev Team 2: real Open 1, rule counts 2 (+1). #4586, #4606, #4610 (thr 2) wait; #4587, #4608, #4611 (thr 3) are assigned. This extra count started around 11:25Z on 16 Nov.
- Control: Test User 1 in QA AS6 Dept A (74 Open) is assigned at threshold 75, so the count is right in that department.
- Ruled out in clean probes (none raised the count): On Hold tickets, tickets moved to another department, tickets reassigned away, tickets closed, an auto-assigned ticket deleted later, a ticket deleted right after create.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, API + Setup, 16 Nov 2026, 12:00–12:14Z.

**Suggested priority**: Medium (agents get fewer tickets than their limit; tickets go to backlog with no visible reason)

**Related**: NDC-2824, NDC-2970, NDC-2275 (the first NF-3 burst at dept threshold 5 was skewed by this); possibly linked to the ticket-without-number defect (ticket-no-number-no-history.md), which appeared at the same time as Dev Team 2's extra count.

**Evidence**: BUG-rr-threshold-phantom-count-FAIL.png

**Zoho Desk comparison**
Zoho counts only the agent's own Open tickets in the rule's department (Setup text "Maximum number of open tickets an agent in the department can handle at any given time"; live test 9 Nov: assigned at Open+1, other departments and On Hold not counted). It never counts tickets the agent does not have. Side-by-side: BUG-rr-threshold-phantom-count-vs-zoho.png
