---
name: ndc-zoho-usage-gap
description: "NDC's own production Zoho Desk (portal wondertravel) read-only capture 2 Nov 2026: what NDC uses vs TAVI, report + manual spec in docs/ndc-zoho-desk-gap"
metadata:
  node_type: memory
  type: project
  originSessionId: 26a0d551-16a6-421d-90b5-d1ea695c4641
  modified: 2026-11-04T09:55:14.329Z
---

2 Nov 2026: user asked to compare **NDC's real Zoho Desk** (not our trial org) with TAVI and write a missing report + test spec. Login **ahegazy@ndceg.com** (no password stored; Zoho OneAuth push — tell the user the number to tap). Account hits "Maximum concurrent sessions (2)" — never click Manage Sessions (would sign Hegazy out); the user clicked "Do it later". Portal `wondertravel`, org 745942342, Zoho One.

**Rule from user: read-only in NDC Zoho**, and "continue without generating any automation scripts" (no Selenium/Java output; deliver docs only).
How it was done: `scripts/zserver-ndc.js` (port 8892) blocks every non-GET to *.zoho.com, allows only DWR calls whose method names are reads; internal API `https://desk.zoho.com/supportapi/zd/wondertravel/api/v1/...` with headers captured from the page (orgId + csrf). Working paths: /workflows?departmentId, /workflows/{id}, /actionMappings/{id}, /blueprints?departmentId&module=tickets, /blueprints/{id}, /sla?departmentId, /directAssignmentRules, /roundRobinRules?departmentId, /layoutRules|/validationRules?module=tickets&departmentId, /notificationRules?departmentId, /ticketsCountByFieldValues?field=channel|status|priority, /templates?departmentId, /organizationFields?module=tickets, /agents/allCounts.
Raw capture is git-ignored: executions/execu_2026-11-01_desk-golive/ndc-zoho/ (staff names inside).

Key NDC facts: 2.52 M tickets (phone 54 %, chat 33 %), 74 depts, 478 active agents, 183 ticket fields, 41 statuses, 92 workflows (75 "Share Ticket"), 5 active blueprints (approval chains on Status), 30 direct + 24 round-robin rules, Zia GenAI on; no macros/supervisor rules/webhooks/functions.
Deliverables: docs/ndc-zoho-desk-gap/ndc-zoho-vs-tavi-missing.md (M-01..M-16 gaps, V-01..V-12 verify) and spec-ndc-usage-on-tavi.md (groups A–J). Top gaps: live chat, WhatsApp/Telegram, telephony, AI (404 on NDC-Staging), /iam/users 200-row cap vs 478 agents, reporting.

**Why:** NDC is the client; build what they actually use. Related: [[desk-go-live-retest]].
**How to apply:** use the spec for the next NDC test run; confirm phone/chat/IM/report questions (report §3) with NDC first.

**Pass 2 (2 Nov 14:10-14:25):** needed a new push; account hit "limit exceeded" (no Do-it-later) until someone freed a session. Guard now also blocks action-like GETs (mode=generate…, e.g. CtiApiConfig PhoneBridge token). Findings: phone tickets typed by agents (telephony not needed, M-03 → V-13); only 3 IM channels active; live chat real (ONLINE_CHAT); Desk dashboards used (Overview/Request/SLA/TOPUP); tags/approvals/time entries unused; notifications mostly off; CRM syncs accounts/contacts/products + related lists Transactions/Agency Services/Customers/Leads/Agency Code. Report md/html/doc updated (HTML artifact MomAMfoRYUPEoUhDiTurZW, doc 7ofDeX6Caq9eAi8MNcarWH).

**Filed NDC-2787** (id 7a7fe7d7-704d-4b66-a91f-225fff930d7a, 2 Nov 2026) "NDC Zoho Desk usage — features TAVI Desk is missing": NDC flow + M-01..M-16 each with what/how/why/TAVI today; Backlog, High, MahmoudMohamed+mfathy+Hegazy+eahmed, Desk, Sprint 14, start 2 Nov, relates to NDC-2760; no HTML attachment (user said not to). Agent-list 200-row bug still NOT filed.

**3 Nov 2026 — NDC mimic on NDC-Staging** (user: core flows, prefix "QA NDC ", keep it): 31 depts, 32 teams, 41 statuses, 94 fields, 10 layouts, 7 layout rules, 1 validation, 6 blueprints, 42/80 workflows, 7 assignment, 9 SLA, 240 notification switches. Built via scripts/tavi-api.js (API, no browser; web assets were failing on this network). New gaps M-17..M-21 (one layout per dept; 50 workflow rules per module; etc.) + adjustments A-1..A-8 in docs/ndc-zoho-desk-gap/ndc-on-tavi-mimic-report.md. Read executions/execu_2026-11-01_desk-golive/ndc-mimic/PROGRESS.md first.

**3 Nov filed (each with TAVI vs NDC-Zoho image, Backlog, Desk, Sprint 14, relates to NDC-2787):** NDC-2791 Bug (Mark as Required on one layout → required on every layout; first A-6 premise "flags not enforced" was wrong, API-written flags), NDC-2792 M-18 Urgent (user: remove workflow limit per module+department or make it configurable per tenant via control plane; NDC 92 rules all Tickets, 15 depts, QA 24/FA 22/Acc 13), 2793 A-3, 2794 A-2, 2795 A-1, 2796 M-17, 2797 A-9 (statuses per dept + layout), 2798 M-21. **M-20 dropped** — Owner Assignment→Teams clears owner (re-tested). NDC-2787 update not posted (draft says only link these). **Retest 4 Nov (executions/execu_2026-11-04_retest-ndc-gaps, plane-draft.md):** Done = 2792 (fixed 200 rules/department, tenantSpecific false; user accepted), 2793, 2795, 2797, 2798; Bug = 2791 (now module-wide required BLOCKS saving in every dept — cleared Agent id/TKT flags via PUT /modules/{M}/fields/{id}), 2794 (TeamWithAgent clears team), 2796 (create form ignores dept default/lists all layouts; Change Layout allows other depts' layouts). Comments + images posted, cleanup done incl. Recycle Bin. NDC-2791 had been filed straight into Ready For Test by mistake (state id copied from NDC-2788 = RFT, not Bug: Bug = 34a7f4b6…, RFT = f5299bf6…). Lesson: re-verify every gap live right before filing; two of mine were stale/wrong. Zoho setup pages: use URL all/setup#setup/automation/<deptId>/workflows/rules (dept-slug URLs hang); Add Ticket forms /agent/wondertravel/<slug>/tickets/new are safe to view.

**9 Nov 2026 retest of NDC-2787 (NDC-Staging, read-only):** 3 built (M-06, M-07, M-09), 2 partly (M-08, M-12), 10 missing; comment 06c4bb8b + 6 images posted. M-05 agent-list bug finally filed as **NDC-2828** (Bug, High, Sprint 15); tenant has exactly 200 users, so a hidden 201st user is not yet proven (needs a throwaway invite, user OK). Files: executions/execu_2026-11-09_retest-gaplists-high/ndc-2787.
