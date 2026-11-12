---
name: layout-rules-intake
description: "CRM + Desk Layout Rules vs Zoho, 12 Nov 2026: 186-case updatable sheet PUdj9axtAjCR8UQpegu5qC (db results/extra), gaps Z1–Z13; waiting for user's go; nothing in Plane"
metadata:
  node_type: memory
  type: project
  originSessionId: 475a6ffc-8477-4038-8e22-fc2c2fe0fef0
  modified: 2026-11-12T21:46:55.040Z
---

12 Nov 2026, New-Feature-Testing skill. Plane: NDC-1988 (Desk Phase 3 "Layout rules, validation rules, nested picklists"), NDC-2535 (empty work-plan row). No PRD. User: **no Plane until told; no execution until told.**

**Build (NDC-Staging, read-only intake):** one shared editor with flavor crm|desk; i18n ns `crm-layout-rules`. API `/modules/{id}/layout-rules` (?layoutId&status) GET/POST, `/{id}` GET/PUT (rowVersion)/DELETE, PUT `/order {layoutId,ruleIds}`, GET `/modules/{id}/rule-usage?field|layoutId`. Error LAYOUT_RULE_INVALID / LAYOUT_RULE_NOT_FOUND. Rule: layoutId, primaryField, departmentIds, applyToHelpCenter, status, sortOrder, branches[{condition tree op eq/neq/in/and/or…, actions[{type, fields|sections…}]}]. 13 CRM actions; Desk only show_fields/show_sections/require_fields. Primary field = field.capabilities.canCreateLayoutRule: only pick_list, radio, checkbox, status, user (+department, team on Desk) → gaps Z1/Z2.
- Baseline 12 Nov: CRM 0 rules (15 modules); Desk Tickets 7 "QA NDC …" rules from 3 Nov — never touch (out/baseline-*-1112.json).

**Files:** docs/layout-rules/ (cases.js single source → build-sheet.js → layout-rules-test-sheet.html; reference/zoho-layout-rules-inventory.md); executions/execu_2026-11-12_layout-rules/ (scripts/api.js, use LANE=layout for CRM, LANE=layoutdesk + APP=desk for Desk; bundle/ chunks).

**Sheet:** https://claude.ai/artifact/PUdj9axtAjCR8UQpegu5qC — db `results/<caseId>` {status none|pass|fail|blocked|gap|info, notes, ref, at, by, byClaude}; `extra/U<n>`. Write run results with ArtifactData (byClaude:true). Prefix QA LR1112.

Zoho CRM test org org944965048 ends 17 Nov. User allowed Zoho writes in test orgs (12 Nov).

**Run 12 Nov (read executions/execu_2026-11-12_layout-rules/PROGRESS.md):** 93/186 written to sheet: 55 pass, 13 fail, 2 gap. Fails: G4 inline edit, E6 typed value dropped on create (Zoho keeps), G16 Desk dept scope ignored, F15/F16, I8 no action cap, K3 DELETE 204 no-op, J4 field delete kills whole rule, G7 mass update skips mandatory. Zoho CRM HAS v9 layout_rules API (intake was wrong). Staging outage 11:35–12:30. Blocked: Desk agent account, Help Center form. TAVI + Zoho QA data NOT cleaned yet (ledger.md). Not filed in Plane. **Session 2 (12 Nov pm):** 185/186 in sheet (102 pass, 25 fail, 3 gap, 12 blocked, 16 not run); new fails D5, D6, D9–D12 (editor rows choice-only), J3/J7, A2, K9 (timeline leak), M5; cleanup + Plane still pending. Session 3: fixtures built, 185 = 110 pass, 28 fail (G9, G10, F5 new), A6 blocked by permission-grant denial. Report artifact NGD9T517Hke2qTyFGLLFsm (report/build.js): 19 distinct bugs B-01..B-19. **FILED 12 Nov:** bugs NDC-2974..2992 (B-01..B-19), side bugs NDC-2993 Kanban 500 / 2994 convert silent 422 / 2995 related-lists dupes, gap NDC-2996 (+ comment adding Z9), all relate to NDC-1988, Sprint 16, Todo. Findings page 9u6DQiHiARBNFkZNauf5qv. Final sheet: 115 pass, 29 fail, 7 gap, 32 info, 3 blocked (G8/Z4 Kanban, Z13 mobile ignored). HC forms = web forms kind help_center_form; HC mode switch needs user OK (auto mode blocks). Other tenant for K2: Anyware owner, tenant a7a7...0002 (creds from user in chat, not stored). **Cleanup DONE 12 Nov** (TAVI CRM/Desk + Zoho test org; bin purged by exact id). Trap: converted leads are hidden from list/search but still block layout delete (LAYOUT_HAS_RECORDS) — delete by id. Related: [[crm-scoring-rules-intake]], [[tavi-extras-not-bugs]], [[one-owner-signin-per-run]], [[zoho-reference-capture]].
