# Retest r27 — 25 Nov 2026 — Mahmoud Mohamed (Desk, NDC-Staging)
User approved all 7, real restore OK, writing data OK.
Results: 2863 PASS, 3207 PASS, 3230 PASS, 3231 PASS, 3232 PASS, 3136 BLOCKED (NDC-3202 still no SLA), 3051 BLOCKED (no expired backup until 27 Nov 09:14 UTC).
Draft: plane-draft.html / plane-draft.json (scripts/make-draft.js). Report: report.html. Images: screenshots/annotated.
State: out/state.json (BK backup 01a2121b, SB sandbox a8b4da7e, WF 166 list rules, SLA policy, TSLA, T3230 tickets). Rule 3230 already deleted.
Waiting for Gate 2. Cleanup after posting (keep backup 01a1f83b for 3051).

## Posted 25 Nov (user: "move what passes to done with comment and annotated evidence")
- 2863, 3207, 3230, 3231, 3232 → Done, comment from plane-draft.json, images attached (verified read-back).
- 3136, 3051 BLOCKED: nothing posted (user asked for passes only).
- Cleanup verified zero: 166 rules, 3 tickets, SLA policy, sandbox (deleted after ~110 s), backup 01a2121b, 170 bin items purged. Kept backup 01a1f83b for 3051 (expires 27 Nov 09:14 UTC). Rules back to 56.
