---
name: manual-sheet-run
description: "11 Nov 2026 — running the 711-case TAVI Desk manual test sheet on NDC-Staging; results go to my own artifact SUde9e6vD7FJnZFu4djZAp, republished after each feature"
metadata:
  node_type: memory
  type: project
  originSessionId: a17cf060-bd19-487d-b9db-8f4190183934
  modified: 2026-11-11T11:49:48.596Z
---

User asked (11 Nov 2026) to run the rest of the manual test sheet (original artifact 3wppE3JvACLPnGS4DSt63E, now shows as outside the org, so its db and republish are blocked) and update after each feature.

Decisions by the user (11 Nov):
- Results go to **my own copy**: https://claude.ai/artifact/SUde9e6vD7FJnZFu4djZAp (built by `scripts/make-sheet.js` from `sheet.json` + `results.json` + `progress.json`, republish same file path `sheet-results.html`).
- Order: **P0 first, feature by feature**, then P1, P2, P3.
- Hard cases: mark BLOCKED / Not built with the reason and move on; use mail.tm inboxes for customer mail; batch the user's Gmail send/reply steps once per feature.

Folder: `executions/execu_2026-11-11_manual-sheet-run/` (runner `scripts/ms.js <mode>` loads `ms-<mode>.js`, ledger.md prefix "MS"). 110 cases were seeded from the automation mapping (`automation-merged.json`; report `docs/desk-go-live-feature-inventory/manual-sheet-automation-coverage.html`).

Accounts (creds index): Owner = 7 ndc-staging-owner; Admin B = 5 QA Team 1 (Desk Administrator); Agent C = 1 Customer Experience Specialists 2 (Desk Agent); Supervisor S = 3 Mahmoud TAVIPortal (Desk Supervisor). Do not use 0, 4, 8 (the other Desk automation session's accounts). See [[one-owner-signin-per-run]], [[mask-credentials-by-column]].

Test data prefix `QA MAN `; clean up once per feature block and log in ledger.md.

Progress (11 Nov 19:05 UTC+2): T-04, T-05, T-06, T-07, T-12, T-13, T-01, T-02, T-03, T-14, T-15, T-16, T-10, T-21, T-24, T-25, T-31 done (artifact v18) = all P0 Ticket-area features; U-02/U-07/U-12 persistence + U-04 done (artifact v20). Workflow rules API: POST /workflow/rules (criteria StringMatch Contains/StartsWith/EndsWith, Logical And/Or), list API ignores paging (only 50) so delete by ids from ledger. Next U-05, U-06, U-09, N-01.... T-13-05 waits for the user (reply from real mailbox to a closed ticket); list in needs-user.json. Helpers: `scripts/run.sh <mode> [idx state]` re-signs on SIGNED_OUT; `scripts/set.js <tc> <status> "<note>" [bug]`; `ms.js clean` deletes+purges "QA MAN" tickets. Mailboxes M1/M2/M3 (mail.tm) in scratchpad ms-mailboxes.json. Admin B (QA Team 1) is NOT in Marketing; shared depts with Agent C = QA NDC Manual Invoice. Desk Agent sees only own + unassigned tickets. Teams: QA AS6 Team A in QA AS6 Dept A.
