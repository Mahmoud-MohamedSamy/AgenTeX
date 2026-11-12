---
name: retest-r16-progress
description: "Retest round 16 (11 Nov 2026) CLOSED: 6 tickets — 4 Done (2844, 2846, 2845, 2840), 2 Bug (2635, 2805); TAVI + Zoho cleaned"
metadata:
  node_type: memory
  type: project
  originSessionId: 7bdc8a4e-b909-47ac-8ab1-e5eb1984afb7
  modified: 2026-11-11T15:22:49.274Z
---

Round 16 of [[retest-ready-tickets-skill]], 11 Nov 2026, user excluded NDC-1988 and NDC-2030. Folder executions/execu_2026-11-11_retest-mahmoudmohamed-r16 (notes.md, ledger.md, scripts/r16.js draft/--post, apiw.js = API runner borrowing the browser session, login-zd.js Zoho Desk sign-in).
Results: 2844/2846/2845/2840 PASS → Done; 2635 PARTIAL (owner list by dept + bulk delete fixed; Delete on activity page, ticket activity count, activities API missing — Zoho checked live with one task, deleted+purged) → Bug; 2805 PARTIAL (same as 9 Nov) → Bug. 2845 observation: mass update runs in the browser; a cut-off run (16 of 51) is not logged.
Cleanup done: Desk 61 QA RT16 bin items purged; session files deleted. Owner session got revoked mid-round by other owner sign-ins (re-signed once).
No automation tests were saved this round.
