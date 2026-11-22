# DRAFT — not filed (needs user approval and a confirming slow rerun)

**Title:** Desk Assignment Rules | Round Robin backlog in due-date order assigns a later-due ticket before earlier-due ones when tickets are closed close together

**Environment:** NDC-Staging (Wonder Travel), Desk › Setup › Automation › Assignment Rules › Round Robin, department Customer Support, 22 Nov 2026 ~09:37–09:41 UTC.

**Setup**
- Active Round Robin rule: "All Tickets => Sequential Round Robin - Customer Experience Specialists 1 & 2" (Sequential, 2 agents).
- Round Robin Preferences: Department-wise threshold ON = 2, Agent-level threshold OFF, Assign tickets to offline agents ON,
  Assign backlogs ON, backlog limit 2, backlog order **Due date**, Assign on closure OFF.
- Both agents hold 2 open tickets (at the threshold).

**Steps**
1. Create 16 tickets in Customer Support with due dates from 2 months overdue to 2 months ahead (created latest-due first,
   so creation order is the opposite of due order). All 16 go to the backlog.
2. Close the agents' tickets one by one so a slot frees up each time (here: several closes within a few seconds).
3. Watch which backlog ticket each agent gets.

**Expected:** every backlog pick takes the waiting ticket with the earliest due date.

**Actual:** 14 of 16 picks were in due-date order, but at 09:38:38 ticket **#6268 (due in 2 days)** was assigned while
#6273 (2 days overdue), #6272 (1 hour overdue), #6271 (due in 1 hour), #6270 (12 h) and #6269 (1 day) were still waiting.
#6273 was assigned 9th instead of 6th (after #6272 and #6271).

| # | Time (UTC) | Ticket | Due | Expected next |
|---|---|---|---|---|
| 5 | 09:38:30 | #6274 | 3 days overdue | ok |
| 6 | 09:38:38 | **#6268** | **+2 days** | #6273 (−2 days) |
| 7 | 09:38:39 | #6272 | −1 hour | ok after #6273 |
| 8 | 09:38:42 | #6271 | +1 hour | ok after #6273 |
| 9 | 09:38:56 | **#6273** | **−2 days** | should have been #6 |

All assignments are `ticket.auto_assigned` with trigger `backlog`, same rule, strategy `sequence`.
Pick #6 came ~1 s after a close (09:38:36.9) and just before another close (09:38:38.6) — two backlog runs may overlap.

**Evidence:** `executions/execu_2026-11-22_cs-rr-backlog/activity-raw.json` (activity of all 16 tickets), `watch.log`, `ledger.md`.

**Before filing:** repeat with one close every ~30 s. If the order is then correct, the defect is limited to closes in quick
succession (concurrent backlog runs); say so in the ticket.
