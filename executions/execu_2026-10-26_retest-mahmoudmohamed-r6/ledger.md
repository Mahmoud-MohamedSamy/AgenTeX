# Round 6 — test data ledger and cleanup (27 Oct 2026)

Every row was deleted or restored once, after the Plane updates. Verification inventory: 0 QA items left (`cleanup-verify.json`).

| Ticket | Kind | Id | Name / change | Cleanup |
|---|---|---|---|---|
| 2323 | Workflow rule | 1448ac2e | QA RT 2323 scheduled webhook | Deleted (204) |
| 2298 | Assignment rule | — | QA RT 2298 api-only | Deleted (204) |
| 2298 | Assignment rule | — | QA RT 2298 import | Deleted (204) |
| 2302 | Blueprint (Leads) | 38abad3b | QA RT 2302 TAVI BP | Deleted (204) |
| 2302 / 2385 / 2298 / 1823 / 2423 | Leads | f814b24e, e512668a, 96061733, 2acfe5f8, af215ad6, 5898eb60, 3a22e4a4 | QA RT … | Deleted (204 each) |
| 2382 / 2323 | Deals | bfd949ed, d13c0de2, bffaa096, 0e718071 | QA RT 2382 …, QA RT 2323 … | Deleted (204 each) |
| 2323 | Contact | 5fe035ed | QA RT 2323 converted | Deleted (204) |
| 1172 | Subscription | 01182b6d | QA RT record | Deleted (204) |
| 2282 | Kanban view (Deals) | 840943d7 | QA RT 2282 kb | Deleted (204) |
| 2282 | List prefs (Deals, my user) | — | lastView kanban + lastKanbanViewId | Restored to list view, no view reference (200, version 7) |
| 2384 | Layout | 212d0ec2 | QA RT r6 layout | Deleted (204) |
| 2384 / 2423 | Fields | — | qa_rt_rollup_r6, qa_rt_phone_r6, qa_rt_email_r6 | Deleted (204 each) |
| 1678 | Custom module | — | qa_rt_partners (cascade) | Deleted (204) |
| 1172 / 2322 | Teamspaces | — | QA RT TS r6, QA RT 1172 | Deleted as test user 1 |
| 2382 | Deals field "pipeline" (6b44c7c9) | — | allowed_values widened for the test | Restored to ["Standard (Standard)"] (baseline in pipeline-field-baseline.json) |
| 2412 | Profile of test user 2 | — | Manager (changed by the user) | NOT restored — user to switch back to "test" |
| — | Recycle bin | 20 items (bin-qa-items.json) | QA RT … deleted by mahmoud.mahamed1515 | NOT purged — permanent-delete refused by the safety check; awaiting user |
| 2385 / 2298 | Leads import sessions | — | Two wizard sessions not submitted | Left (no records created) |
| — | Browser sessions / sign-in state | rt, u1, u2, a2, wf, dk, agent | — | Closed; state-rt/u1/u2.json deleted |
