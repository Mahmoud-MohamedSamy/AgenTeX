# NDC-2635 retest ledger (Lane C, 9 Nov 2026)
- Tenant NDC-Staging; sign-in index 8 once → scratchpad laneC-desk.json
- 2026-11-09T15:56:25.324Z CREATED task 3ae22630-3b08-4276-9c69-855c280c3639 (QA RT 2635 dept visibility, department QA AS6 Dept B where index 8 is not an agent)
- Results so far: department field required on Task/Call/Event (fields API + Add Task drawer); owner picker after Dept "QA AS6 Dept B" still lists me + Test User 2 (not agents there) and not ndc-staging-owner (agent there); task 3ae22630 in Dept B readable (200) by index 8 who is not a Dept B agent and sees only 2 tickets; activity list fetches linked tickets that return 403 → "Permission denied." toast; detail page has no Delete; list rows have Delete icon and bulk bar More → Delete; ticket counts = replies/comments/attachments/time_entries only; /desk/activities(+stats/reports/count), /desk/tickets/{id}/activities 404.
- 2026-11-09T16:20:54.958Z DELETE task 3ae22630-3b08-4276-9c69-855c280c3639 → 204
- 2026-11-09T16:20:58.942Z purge bin ids 047cfea8-cc5c-40bf-a59d-51b0b1d03e31,009695d0-90d9-425b-beb3-08cb30d407da → 200
- 2026-11-09T16:21:01.750Z verify task GET → 404; bin matches left 0
- 2026-11-09T16:22:10Z Lane C done: state file laneC-desk.json deleted

## Posted 10 Nov 2026
Comment f3d94515-da4a-4599-930f-54180577e8dc + 3 images (ev-01..03). State unchanged (Backlog).
