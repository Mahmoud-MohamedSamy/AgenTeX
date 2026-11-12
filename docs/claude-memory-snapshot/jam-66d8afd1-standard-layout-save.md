---
name: jam-66d8afd1-standard-layout-save
description: "Jam 66d8afd1 (8 Nov 2026) Desk Standard ticket layout Save → 422 \"resolution\"; root cause confirmed (editor sends Create view as Detail); filed NDC-2815 + NDC-2816"
metadata:
  node_type: memory
  type: project
  originSessionId: 6cad98b2-9d2f-4e48-af44-1193bcd58c1a
  modified: 2026-11-08T09:59:17.159Z
---

Investigated 8 Nov 2026. Root cause: the Desk layout editor builds views.DETAIL from the Create view on Save, so Detail-only fields (resolution, Integration section crm_deal_id/contract_id) are dropped → server 422 non_removable. Stored layout is fine (DETAIL has resolution, rowVersion 1, never saved since 6 Sep). Also: label PATCH succeeds before the failing PUT (half-saved); all 10 QA NDC layouts already have DETAIL == CREATE.
Report: executions/execu_2026-11-08_jam-66d8afd1-standard-layout-save/report.html, artifact https://claude.ai/artifact/BGbGqt7SPiyz7G71ite6C9. Filed 8 Nov via Plane REST API (MCP gave 403 on NDC): NDC-2815 (F1, High; risk + side effect inside) and NDC-2816 (label half-save, Medium); label Modules & Fields, module Desk, Sprint 15, state Bug, annotated images + Jam link attached. Nothing posted on the Jam.

**Why:** may become a Plane bug; repro scripts are in data/.
**How to apply:**
- Desk accounts file is now `docs/Credentials/TAVI Desk Credentials.csv` (header name,username,password); the old login-desk.js expects the missing "Microsoft Edge Passwords.csv". Scratch login copied the flow: pick by the name column.
- To capture a builder save without writing: route PUT/PATCH/DELETE, fulfill the label PATCH with a fake 200 (the editor waits for it before the PUT), abort the PUT.
- Related: [[desk-modules-fields-intake]].
