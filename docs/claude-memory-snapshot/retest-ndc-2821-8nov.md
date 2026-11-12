---
name: retest-ndc-2821-8nov
description: NDC-2821 per-department skill types retested PASS and moved to Done 8 Nov; QA cleanup still awaits user approval
metadata:
  type: project
---

8 Nov 2026: NDC-2821 PASS, posted (comment + NDC-2821-retest-PASS.png) and moved to Done with user approval. Folder executions/execu_2026-11-08_retest-ndc2821 (ledger.md, plane-draft.html, report.html).

Cleanup DONE 8 Nov (user approved): QA RT14 types, skill, department, 5 tickets, 80 unused types incl. QA AS6 Type/Type3 across departments; verified. Kept: QA AS6 Type in QA AS6 Dept A (31 skills). Another session uses the same QA RT14 prefix (2754, 2811, 2812, 2813): delete by ledger id only, never by prefix.

**How to apply:** Skill-type API: POST /desk/skill-types takes department_id in the body; PUT/DELETE act on the id and ignore a department param. API tickets need source api/web_form or owner:null to route (NDC-2813). Zoho skill-type write was refused by the permission check; Zoho left unchanged. Related: [[desk-assignment-skills-run]].
