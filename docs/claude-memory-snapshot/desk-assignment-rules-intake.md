---
name: desk-assignment-rules-intake
description: "TAVI Desk Assignment Rules vs Zoho Desk intake (6 Oct 2026): spec/missing-list paths, NDC-1978 overlap, 5 departments created, API surface, blockers"
metadata:
  node_type: memory
  type: project
  originSessionId: 5d7a1bf4-a897-4346-a492-ff7494c50086
  modified: 2026-10-14T11:44:16.346Z
---

Intake 6 Oct 2026 (user: spec + missing list **local only, nothing on Plane**; scope = the 3 Zoho articles: manual assign, rules/round robin, triaging).
- Files: `docs/desk-assignment-rules/spec-desk-assignment-rules.md` (A–L, E2E-1..5, Z1–Z15), `desk-assignment-rules-missing-list.md` (15 items), `evidence/evidence-report.md` (15 annotated images, `configs/items-02-15.js` + `make-evidence.js` now supports a `flag` on text panels), `reference/` (zoho-docs-inventory, zoho-live-notes, tavi-build-map, tavi-baseline-2026-10-06.json).
- Plane: **NDC-1978** "Assignment rules and skills" (child of NDC-1953) already holds 6 gaps = Z1, Z2, Z3, Z4, Z7, Z11. Related NDC-1976 (online status), NDC-1975/NDC-1910 (teams), NDC-1980, NDC-1585 (CRM import rule). NDC-1254 is an empty holder; no PRD.
- **Tenant change (user asked):** created departments Customer Support (default, cannot be deleted) `7e1ac409…`, Sales `ef8dc91f…`, Marketing `2a73bbc0…`, HR `08fd8684…`, Tech `19510fdc…`, each with all 4 agents. Before that the tenant had 0 departments.
- TAVI page `/settings/automation/assignment-rules` (perm `desk:assignment:manage`); API `/desk/assignment-rules`, `/desk/departments/{id}/team-assignment`, `/desk/agent-skills`, `/desk/assignment-backlog`, `/desk/assignment/notification-settings`; tickets `/desk/tickets/{id}/assign|pick-up`, `/bulk/assign`.
- Blockers: no tickets, no email channel, no teams (NDC-1910); TAVI sessions end every 20–30 min (refresh 401). `mahmoud.mahamed1515` gets 403 on rules → lower-profile candidate. Zoho setup pages live in an iframe (`ShowHomePage.do`) with a stuck `#FreezeLayer` — hide it via JS; reset `scrollLeft` before screenshots.
- Zoho: user allowed one QA rule (deleted after) — not used; nothing saved in Zoho.

- Requirements draft `requirements-desk-assignment-rules.md` → HTML via `node tools/make-requirements-html.js`. v2 (14 Oct 2026) applies the user's review: **match Zoho for everything**, Zoho's exact execution order, direct rules ignore availability and never reassign owned tickets, thresholds only in per-department Round Robin Preferences (per-rule capacity removed), existing rules refactored (section 12 MIG-1..7), **API contract left to devs**. Later answers (14 Oct): EO-5 notify latest assignee; phases agreed; thresholds 1–200, only in department Round Robin Preferences for all RR rules (agent level = one agent pick list + number per row); per-rule and Team Assignment capacities removed, not converted (MIG-4, MIG-8); Team Assignment = Zoho on/off switch only (no modes). Backlog: only Zoho's behaviour; TAVI per-rule backlog option + Backlog tab removed (RR-14, MIG-5). User confirmed v2 correct 14 Oct; no open decisions; next = publish on Plane (Plane MCP was down).
- **Published 14 Oct 2026 as NDC-2275** (Backlog, Urgent, Mahmoud Mohamed + mfathy, label "Assignment Rules", module Desk, Sprint 11). Screenshot not attached (local file; upload needs a public URL). NDC-1211 is a CRM order bug, not Desk. Plane MCP now = user-scope `plane` server at https://mcp.plane.so/http/mcp (old claude.ai connector URL 404s). Next: spec from NDC-2275, then testing.
- Plane draft: `node tools/make-plane-draft.js` → `plane-draft/description.html` (raw description_html, API section removed for Plane only) + `preview.html`. Title "Assignment Rules: Direct Assignment and Round Robin (requirements)". User's filing fields (14 Oct): module DESK, state Backlog, priority Urgent, assignees Mahmoud + mfathy, label "assignment rule", current cycle, start date = publish day; attach the Round Robin Preferences screenshot (`docs/WhatsApp Image 2026-10-14 at 12.20.30 PM.jpeg`). Read NDC-1211 + NDC-1978 first. Plan: user reviews → publish on Plane → spec → test.

**Why:** the functional run of this spec should reuse these ids, scripts and workarounds.
**How to apply:** ask before filing Z5–Z15 in Plane (check NDC-1978 first); create test tickets in Tech for D/E rows. Related: [[zoho-reference-capture]], [[annotate-evidence-vs-zoho]], [[desk-modules-fields-intake]].
