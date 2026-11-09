# NDC-2754 retest — 7 Nov 2026 (dev note 7 Nov: desk #233, #234, metadata-engine #212)
Env: staging-desk, NDC-Staging, admin ndc-staging-owner + Desk Agent fedelav803. Data: depts "QA RT13 2754 Dept A/B", blueprint "QA RT13 2754 full", team, tickets "QA RT13 2754F *" (ledger.md).
- Item 6 PASS: own-dept share 422 "A ticket cannot be shared with its own department." (also mixed with Dept B), state Open, no share; picker omits own dept; Dept B 200; plain share same 422.
- Item 2 PASS: admin-owned ticket 403 for agent → Assign owners (user/team) → 200, in list + My Transitions (2) / My Team Transitions (1); edit/reply/other step 403; own step 200 (incl. approval); after state change (agent's or admin's run) 403 "This ticket is not available".
- Item 2 DECISION: owner step with required Share → 403 "You are not allowed to add a share to this transition." (Desk Agent lacks desk:ticket:share; UI: "ask an admin for access"). Dev note said share included.
- Regression 1, 3, 4, 5, 15 PASS. Item 10 INFO: happiness rating is_enabled false.
- First pass with unowned tickets (t0–t10) invalid for item 2: Desk Agent sees unassigned tickets anyway.
