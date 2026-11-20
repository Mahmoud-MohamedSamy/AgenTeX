# Draft (not filed): Assignment Rules | "Assign tickets on closure" skips offline agents even when "Assign tickets to offline agents" is on

Proposed fields: Bug · Priority Medium · Module Desk · Sprint 16 · Label "Assignment Rules" · Assignees: Mahmoud, Hegazy, mfathy · Jam link https://jam.dev/c/4ca9d5fe-e1d1-4007-a494-68fb0153f3f5 · Related: NDC-2275 (assignment rules requirements, RR-16)

## Summary
With "Assign tickets to offline agents" on, round robin treats offline agents as available, and "Assign backlogs" gives them backlog tickets. "Assign tickets on closure" does not follow this setting. When an offline agent's ticket is closed, the next backlog ticket is not given to that agent, even though they are now under the threshold. The backlog ticket stays unassigned until the agent comes back online and closes another ticket, or until "Assign backlogs" picks it up. With the agent online, closure assignment works.

## Steps to Reproduce
1. Go to Setup › Assignment Rules › Round Robin, choose a department, then ⋮ › Preferences.
2. Turn on "Assign tickets to offline agents".
3. Turn on "Agent level threshold" and set one agent to their current open tickets + 1.
4. Turn on "Assign tickets on closure", leave "Assign backlogs" off, and save.
5. Add an active round-robin rule in that department whose pool holds only that agent.
6. Create a matching ticket. It goes to the agent, who is now at the threshold.
7. Create one more matching ticket. It goes to the backlog (unassigned).
8. Let the agent go offline (signed out, or about 12 minutes with no activity).
9. As an administrator, close one of the agent's tickets.
10. Open the backlog ticket and its History, and watch it for 2 minutes.

## Expected Result
- "Assign tickets to offline agents" is on, so the agent counts as available, as it does for "Assign backlogs".
- The agent is now under the threshold, so the backlog ticket is assigned to them straight after the close.
- History shows the assignment.

## Actual Result
- The backlog ticket stays unassigned and in the backlog, and History has no assignment entry.
- Results on 19 Nov 2026 (QA AO Dept B, Test User 1, "Assign tickets to offline agents" on):

| # | Agent | Setting used | What happened | Backlog ticket |
|---|---|---|---|---|
| 1 | Online | Assign tickets on closure | The agent closes own ticket | Assigned in 11–24 s |
| 2 | Online | Assign tickets on closure | Administrator closes the agent's ticket | Assigned in 10–11 s |
| 3 | Offline | Assign tickets on closure | Administrator closes the agent's ticket (11:46 UTC) | Unassigned after 110 s |
| 4 | Offline | Assign backlogs | Threshold raised by 1 and "Assign backlogs" turned on (13:44 UTC) | **Assigned in 11 s**, while offline |
| 5 | Offline | Assign tickets on closure | Same agent; administrator closes their ticket, 6 → 5 open (13:45 UTC) | Unassigned after 2 min |

- Controls:
  - With "Assign tickets to offline agents" off, "Assign backlogs" left the backlog ticket unassigned while the agent was offline.
  - It assigned the ticket 11 s after the agent came online.
  - The same results were seen in a separate manual run in another department.
- Jam (19 Nov ~10:30 UTC, Customer Support, department threshold 1):
  - #5666 was owned by Customer Experience Specialists 1, who was offline (last active 07:31 UTC).
  - #5666 was closed at 10:30:32 UTC.
  - Backlog ticket #5668 was still unassigned an hour later.
- Also seen once: at 10:44 UTC the agent was online and closed their own ticket, and the backlog ticket was not assigned within 70 s. The same setup passed four times afterwards, so this may be intermittent; it is noted here in case it is related.

## Environment
- staging-desk.taviportal.com, NDC-Staging.
- Jam: Edge 152 on Windows, reporter's session 19 Nov 2026 10:29–10:31 UTC.
- Retests on 19 Nov 2026:
  - 11:00–11:48 and 13:40–13:51 UTC with the Desk Administrator and Test User 1 accounts; preferences saved through the Preferences screen and the API.
  - A manual run of the same steps in the UI, 13:15–13:38 UTC.
- The QA rules and tickets were deleted and the department preferences restored afterwards.

## Attachments
- `JAM-4ca9d5fe-closure-offline-agent.png`, in `executions/execu_2026-11-17_findings-retest/screenshots/annotated/`:
  - the Preferences screen;
  - the online, offline and Assign backlogs results, and the Jam agent's presence;
  - a Check | Expected | Now | Result table.
- The Jam link.
