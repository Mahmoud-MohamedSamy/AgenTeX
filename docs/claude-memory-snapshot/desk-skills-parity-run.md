---
name: desk-skills-parity-run
description: "12 Nov 2026 full TAVI vs Zoho Desk Skills parity run; results, bugs, Zoho state changed, image 1 awaiting approval; read PROGRESS.md"
metadata:
  node_type: memory
  type: project
  originSessionId: fff57c37-234b-467e-81bd-7fd70c127144
  modified: 2026-11-12T10:37:18.793Z
---

12 Nov 2026: user asked "would the layout draft make Skills identical to Zoho?" → no; approved a full parity run. Folder `executions/execu_2026-11-12_desk-skills-parity/` (PLAN.md, PROGRESS.md = state, RESULTS.md = matrix, ledger.md + ledger-automation.md, evidence/, screenshots/annotated/). Automation: `automation/.../deskskills` DeskSkillsParityTest (16 tests, group parity-bug = TAVI differs).

Gate 1 decisions: QA writes ALLOWED in Zoho Desk techsolutionsegypt (prefix QA SK12, delete after, never header switches); FULL scope; reusable automation. TAVI = NDC-Staging.

Findings: bugs SK-H02 (skill RR needs every skill, Zoho any one), SK-H03 (no-skill ticket assigned, even outside pool), SK-G02/G03 (inactive/other-dept skill kept on ticket), SK-J04/J05 (Create Ticket + inline Edit Skills list all departments' skills incl. inactive); SK-E01 default auto-add off. **The 11 Nov "skills out of layout" draft is wrong** — Zoho has Skills as a removable layout field (hidden only on Add Ticket form). All 4 images approved; report https://claude.ai/artifact/HG3raXZiXeEUZ1wYq8G4MP; filed 12 Nov NDC-2931 (High), NDC-2932 (High), NDC-2933 (Medium) — images attached 12 Nov; SK-E01 not filed.

Cleanup DONE 12 Nov: TAVI QA SK12 data deleted; Zoho QA data deleted + purged, QA rule deleted, Tech threshold back to 3. Rechecks of NDC-2931..2933 vs Zoho need new QA data; Zoho trial ends ~16 Nov.

**How to apply:** no Plane writes until Gate 2; cleanup with approval. Related: [[desk-skills-out-of-layout]], [[desk-skills-draft]], [[desk-assignment-skills-run]], [[zoho-reference-capture]].

12 Nov afternoon: remaining comparisons run (SK-I workflow actions, SK-H06). New bugs filed 12 Nov evening as NDC-2970 (SK-H06 TAVI threshold counts all departments (Zoho per dept); SK-I03/J07 pickers list deleted + all-dept + inactive skills (deleted saved on ticket #3176) = NDC-2971, images attached. Zoho QA SK13 cleaned + purged 12 Nov evening; TAVI QA SK13 data KEPT on user request (devs repro #3176, #3204, Dept A threshold 40), clean later by ledger; Zoho threshold back to 3.
