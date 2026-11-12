---
name: desk-pending-approvals-page
description: "11 Nov 2026 — requirements + annotated sample page for the missing Desk \"Approvals\" page (manual, web form, blueprint sources); artifact 3gFCTw2oQicshUFxUCsTZK; not filed in Plane"
metadata:
  node_type: memory
  type: project
  originSessionId: 87ef88e2-fc01-4a64-b0e6-314e4d0c53ac
  modified: 2026-11-11T12:28:20.463Z
---

11 Nov 2026: user asked for a sample page with annotations plus full requirements for a Desk page listing items pending approval (manual ticket requests, web form submissions held before becoming tickets, blueprint "Submit for approval" steps).
- Files: `docs/desk-pending-approvals/requirements-desk-pending-approvals.md` (IDs PA-NAV/TAB/LIST/FLT/DTL/ACT/MAN/WF/BP/OVD/NTF/INT/API, AC-1..10, 6 open questions), `pending-approvals-sample.html` (16 pins → notes with IDs). Published artifact https://claude.ai/artifact/3gFCTw2oQicshUFxUCsTZK (private).
- Built on the existing API seen 2 Nov: `/desk/tickets/{id}/approvals` + `/approve|/reject|/cancel`, 403 APPROVAL_NOT_APPROVER; proposed new `GET /desk/approvals`.
- Superseded: web form hold confirmed and filed as NDC-2871 (see below).

**Why:** later Plane filing or a test spec for this page should reuse these IDs.
**How to apply:** ask before filing; related [[desk-blueprint-intake]], [[desk-go-live-retest]].

- 11 Nov (later): requirements doc (no UI) as Claude Doc https://claude.ai/artifact/DQQ4kscQyCMYeSQetALPNN (private). NDC-Staging check: web form hold EXISTS — form `definition.review.mode` none|approval|spam (+spam_threshold), per-form Pending tab `/settings/channels/web-forms/advanced/{id}?tab=pending`, API GET /web-forms/{id}/pending?status=pending|pending_confirmation|approved|rejected|confirmed, POST /web-forms/{id}/pending/{pid}/{approve|reject} (no reason body), permission webFormApprove; no per-form approver list. Tech Webform (ea8a3838…) Review=Approval, 2 pending since 10 Nov. Read-only; signed in with api.js LANE=pa (token store tok-ndc_staging_owner_pa.json).
- Filed **NDC-2871** (id 2c91c37d-de16-4b71-87ba-a0641e966edf) 11 Nov: Backlog, High, MahmoudMohamed+mfathy+Hegazy, module Desk, Sprint 15; description = docs/desk-pending-approvals/plane-description.md (API section removed per user), created via Plane API key script (description too big for MCP call).
- 11 Nov: test spec written for when NDC-2871 is Ready For Test: docs/desk-pending-approvals/spec-desk-approvals-page.md (groups A–N, E2E-1..4, Z; prefix "QA PA "; step 0.2 maps the real build first; never touch the 2 Tech Webform pending items).
