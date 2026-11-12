---
name: crm-scoring-rules-intake
description: "CRM Scoring Rules vs Zoho CRM, 12 Nov 2026: NDC-2030, 16 gaps, 149-case updatable sheet artifact 7GqWGp2wASRHhnqzMxjyet (db results/extra); waiting for user's go; nothing in Plane"
metadata:
  node_type: memory
  type: project
  originSessionId: 84bc2af6-c00d-4b87-a320-c30559a38a3b
  modified: 2026-11-12T11:38:00.020Z
---

12 Nov 2026, New-Feature-Testing skill. Plane ticket NDC-2030 "CRM scoring rules" (one line, no PRD); NDC-1483 = work-plan row. NDC-2571/2580 are Omnichannel, not CRM. User: **no Plane until told; no execution until told.**

**Build (bundle ScoringRulesPage + live API, NDC-Staging):**
- API `/scoring-rules` (?module_id), `/{id}` GET/PUT (row_version), PATCH `/{id}/active`, DELETE. Errors SCORING_RULE_LIMIT / VERSION_CONFLICT / INVALID / NOT_FOUND.
- Limits: name 120, desc 500, 25 entries, 50 rules/module, points whole ≠0 within ±10000. Entry = field_key + operator + value + points; field rules only.
- One system `score` number field on leads/contacts/deals/accounts; scored on each record save only (no backfill; /recalculate etc. 404).
- Workflow trigger RecordScoreChanged (increased/decreased/any + optional scoreThreshold).
- Baseline 12 Nov: 0 rules in all 15 modules (out/baseline-tavi-1112.json).

**Files:** docs/crm-scoring-rules/ (cases.js = single source, sheet-template.html → scoring-test-sheet.html, reference/zoho-scoring-inventory.md); executions/execu_2026-11-12_crm-scoring-rules/ (scripts/api.js CRM helper, use LANE=crmscore; evidence/zoho-intake).

**Sheet artifact:** https://claude.ai/artifact/7GqWGp2wASRHhnqzMxjyet — db `results/<caseId>` {status none|pass|fail|blocked|gap|info, notes, ref, at, by, byClaude}; `extra/U<n>` user-added cases. Write run results there with ArtifactData (set byClaude:true).

**Zoho:** test org org944965048 signed in with `docs/Credentials/Zoho hmohamed@anyware.software.txt` (user fixed the file 12 Nov; line 1 email, line 2 password). Intake was read-only; nothing saved. Modules offered: Leads, Contacts, Accounts, Deals. Ask before Zoho writes at execution.

**Run 12 Nov 2026 (user: "start the execution, Zoho writes allowed"):** 135/149 run, results in the sheet db; 12 low/medium findings (K1 Medium) + Z1–Z16 confirmed live; not filed in Plane. Read executions/execu_2026-11-12_crm-scoring-rules/PROGRESS.md for the list, not-run cases and cleanup. Helpers: scripts/ui-server.js (own sign-in, port 8889/8887; 8893/8891 used by other sessions), scratchpad zoho/zc.sh (Zoho API from page needs X-CRM-ORG 944965048 header). Workflow mode must be 'Recurring'; workflow actions land ~7 s after save.

**Second run 12 Nov:** all 149 have results; G9 new fail; F4/H9/X1 blocked by a staging outage, then rerun and passed the same day. Cleanup done 12 Nov (0 QA data left). FILED 12 Nov: gap NDC-2934, bugs NDC-2935 (Medium) + NDC-2936..2945 (Low), annotated images attached, CRM module, Sprint 16, label Lead Scoring, assignees Mahmoud Mohamed/Hegazy/Eslam; comment on NDC-2030; NDC-2030 moved to Bug and the 11 bugs linked to it (relates to). User purges the Recycle Bin; no git push for now (user, 12 Nov). Web-form hosted link 404 (CRM and Desk; was only in NDC-1488 comments) filed as NDC-2959 (Medium, Web Forms label, CRM, Sprint 16, relates to NDC-1488) 12 Nov; Plane auto-added Mohamed Fathy as assignee.

Related: [[crm-global-sets-intake]], [[tavi-extras-not-bugs]], [[one-owner-signin-per-run]].

**12 Nov late:** X2 passed (workflow at score 30 creates one task). Zoho live checks done: G9 (Zoho number condition refuses abc/12.5), I3/B10 (Zoho 400 INVALID_DATA), J6 (Zoho keeps Next disabled, cursor in Name), F9 (Zoho audit also has no change detail → NDC-2945 weaker), G13 (Zoho score trigger: Increased/Decreased/Updated + All/Selective scoring rules = new gap, not yet on NDC-2934). A2 Zoho not checkable (no second Zoho user). Desk bug draft B13 (no permissions page in TAVI Desk; /settings/security/permissions redirects to /hq; 83 desk perms in API) in plane-draft/bugs + image DESK-no-permissions-page-vs-zoho.png — published 12 Nov as NDC-2972 (High, Bug, Desk module, label Desk Settings, Sprint 16, same 3 assignees). Filed tickets NDC-2938/2943/2944/2945 got Zoho-live comments + images; NDC-2934 got item 17 (selective scoring rules). Desk owner session got revoked once (other session); used mahmoud.mahamed1515 for Desk UI.
