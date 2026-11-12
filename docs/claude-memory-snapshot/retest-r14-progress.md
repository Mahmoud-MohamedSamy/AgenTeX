---
name: retest-r14-progress
description: "Retest round 14 (8 Nov 2026): NDC-2754, 2811-2814 all PASS, waiting Gate 2; run folder, data, Plane via API key"
metadata:
  type: project
---
Round 14 of [[retest-ready-tickets-skill]], 8 Nov 2026. Folder executions/execu_2026-11-08_retest-mahmoudmohamed-r14 (notes.md, ledger.md, report.html via scripts/make-report.js, plane-draft.html via scripts/post-r14.js <csv> [--post]).
Gate 1: user approved all 5 + data writes + temporary setting changes. Results: all PASS (2754 owner completes required Share; 2811 RR skips Email-off; 2812 team refused everywhere incl. live SLA escalation, INFO: history shows team as "User 434140a3"; 2813 form owner; 2814 detached holiday list). POSTED 8 Nov: 5 comments, 5 → Done, 5 images attached (verified). Cleanup of QA RT14 data NOT done yet (not asked).
Plane MCP sign-in expired and claude.ai Plane failed: read/post via REST with Downloads/secret-key-1793537440144.csv.
Data: reuses QA AS6 Dept A/B, Team A, RR_SEQ, agents A1-A3 (execu_2026-11-06_desk-assignment-skills, creds ndc-creds.json idx 7 owner, 4/9/0 agents, 1 = fedelav803 Desk Agent); new QA RT14 objects in r14 ledger.md (team 2, holiday lists x3, rules, SLA policy, 2754 depts + blueprint 801b318b, tickets). Sessions in scratchpad r14-*.json.
**Why:** resume after compaction. **How to apply:** after approval run post-r14.js --post, then plane-attach.js with attach-map.json, then cleanup from ledger.
