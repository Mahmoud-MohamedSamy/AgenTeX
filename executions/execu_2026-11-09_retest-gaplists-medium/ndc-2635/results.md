# NDC-2635 Activity Life Cycle: recheck 9 Nov 2026

Tenant NDC-Staging, account mahmoud.mahamed1515 (Desk Administrator). Result: 1 built, 2 partly built, 2 still missing. Related bugs NDC-2637, 2638, 2639, 2640, 2641, 2642 and 2643 are all Done.

| # | Item | Verdict | TAVI now (9 Nov 2026) | Evidence |
|---|---|---|---|---|
| 1 | Department on every activity | Partly built | Department is now a required field on Task, Call and Event (Add Task shows "Department*"). But it does not limit the owner list: after choosing "QA AS6 Dept B" (agents Test User 1 and ndc-staging-owner) the owner list is still me, Test User 1 and Test User 2, and ndc-staging-owner is missing. A task in Dept B opens (200) for a user who is not a Dept B agent and who sees only 2 tickets; the Tasks list loads linked tickets that return 403 and shows "Permission denied." | ev-01 |
| 2 | Delete on the task, call or event page | Partly built | The activity page still has no Delete (only Start timer and Mark as Complete). Each list row now has a Delete icon. | ev-02 |
| 3 | Delete in the bulk bar | Built | Bulk bar: Assign To, Update, Close, More, Delete. | ev-02 |
| 4 | Activity count on the ticket | Still missing | Ticket counts are replies, comments, attachments and time entries only. | ev-03 |
| 5 | Ticket-activities endpoint and ready-made filters | Still missing | /desk/tickets/{id}/activities, /desk/activities, /stats, /reports, /count and /desk/tasks/count all return 404. | ev-03 |

## Notes
- Checked on NDC-Staging as mahmoud.mahamed1515 (Desk Administrator), with a throwaway task "QA RT 2635 dept visibility" in Dept B. It was deleted and purged from the Recycle Bin.
- Item 1 visibility was checked with an admin account only; an agent of another department was not used.
