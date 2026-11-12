---
name: desk-skills-draft
description: "Desk Skills vs Zoho (1 Nov 2026): what TAVI built since 6 Oct, 9 gaps, filed as NDC-2752 on 1 Nov with 5 images"
metadata:
  node_type: memory
  type: project
  originSessionId: fdfff7bc-3587-435e-8867-5ab09c26bf29
  modified: 2026-11-01T13:54:58.918Z
---

1 Nov 2026: user asked to fetch NDC-2275, compare TAVI Desk skills with Zoho Desk Skills, and draft a Plane ticket. Draft at `docs/desk-skills/plane-draft-desk-skills.md` + 3 TAVI screenshots in `docs/desk-skills/evidence/`. **Filed 1 Nov 2026 as NDC-2752** (Backlog, Medium, Mahmoud + mfathy, label Assignment Rules, module Desk, relates to NDC-2275 + NDC-1978, 5 images attached).
- New since 6 Oct: Assignment Rules → **Skills** tab (preferences auto_add/placement, skill types, per-skill type/description/criteria, Clear), API `GET/PUT/DELETE /desk/skills`, `/desk/skill-types` (POST/PUT/DELETE; GET 405), `/desk/skill-preferences`; workflow actions AddTicketSkills/RemoveTicketSkills (1–25)/RecalculateTicketSkills/ReassignTicketBySkills.
- 9 gaps: per-department skills, Active/Inactive, Add Skill on page with required type, agents on skill form, list filters, reorder, per-ticket recalc/execute, related rules, limits (10 per ticket).
- Old desk creds (ndc-staging-owner) fail now; use owner from `docs/Credentials/Tavi Desk Credentials - Anyware-Staging.xlsx` (org picker → "Anyware"). Help article automatic-triaging URL 404s; Zoho API doc page is too big to fetch.

- Report (draft ticket + 5 attachments) published privately: https://claude.ai/artifact/Hsn8SLjE4Q3DoJRXATR57d (`docs/desk-skills/desk-skills-report.html`, built from `report-template.html`). Annotated images `evidence/annotated/01-skills-list-vs-zoho.png`, `02-skill-form-vs-zoho.png` via `tools/annotate-vs-zoho.js spec-0N.json` (Zoho panels = live captures 6 Oct in `docs/desk-assignment-rules/evidence/originals/zoho/`). Plane body: `plane-draft/description.html`.

**Why:** filing and the later test run reuse this. **How to apply:** update NDC-2752 when gaps get built; test at runtime once tickets can be created. Related: [[desk-assignment-rules-intake]].
