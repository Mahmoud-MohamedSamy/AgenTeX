# CRM Scoring Rules run — 12 Nov 2026 (NDC-Staging + Zoho test org org944965048)

Sheet (live results): https://claude.ai/artifact/7GqWGp2wASRHhnqzMxjyet  ·  Explainer: https://claude.ai/artifact/NAw6NvSKnqeCcbowgKAR8h
Raw results: results.tsv (API) + results-ui-zoho.tsv (UI/Zoho); per-case JSON in out/db; images in evidence/.

## Update — second run 12 Nov (remaining 14): all 149 cases now have a result in the sheet
- Pass: B11, B12, K3, K7, K9, A7, F5, F6, L1 (1000 imported, all correct, 305 s), L3 (500 mass-updated in 3×200; scoring adds no time). Info: F8 (kanban cards don't show Score).
- New fail: G9 (threshold box accepts abc/12.5 with no message; Create keeps the last valid value silently). Low.
- Blocked: F4, H9, X1 — staging went down mid-run (new deploy index-C_wkzBy1; every signed-in call 404, owner has no app profiles, CRM screen shows no modules).
- CLEANUP DONE 12 Nov 12:10 UTC (staging back after ~30 min): 823 + 1003 QA leads deleted, imports undone (IMPA 409 never ran, L1R undo 504 but its leads were swept), 2 fields + field permission removed; final check: 0 QA SR1112 records in leads/contacts/accounts/deals/tasks/services/agency, 0 scoring rules, 0 QA workflows, 0 QA fields. Deleted records sit in the Recycle Bin; the Services system Score field stays.

## FILED in Plane 12 Nov (user said file, Zoho writes allowed)
- Gap ticket NDC-2934 (Backlog, Medium, 16 items, images G1-G3). Bugs NDC-2935 (Medium, K1) and NDC-2936..2945 (Low): K2, A2, G9, H2, H4, C19, I6+D15, I3+B10, J6, F9 — state Bug, each with an annotated image.
- All: assignees Mahmoud Mohamed, Hegazy, Eslam Ahmed; label Lead Scoring; module CRM; Sprint 16; start 12 Nov. Comment on NDC-2030 lists them. Sheet refs updated.
- Images: evidence/annotated (build-evidence.js + K1.json; API cards via apicard.js at 780px). Filing script scripts/file-plane.js, ids in out/plane-filed.json.
- X1 web form: created Leads form, submitted via iframe, lead scored 10 (pass); hosted link /embed/feedback/f/<key> is nginx 404 (not filed; NDC-2732 says tracked in NDC-1488, which is Done). Form, lead, rule deleted.

## Rerun F4, H9, X1 (12 Nov, after staging came back): all pass
- F4: report with Score column + filter Score >= 15 returns exactly the 3 expected leads (filter shape {operator:gte, value:15}).
- H9: expired session on Create -> /login?reason=expired "Your session expired"; nothing saved.
- X1: 6 imported + 2 manual leads scored as expected; list filter and report show the same 3 hot leads. Web form step not covered (no Leads web form).
- Cleanup: X1 rules, import (undone) and 8 leads deleted; 0 QA data, 0 rules left. Gap draft updated (reports now checked).

## Status (first run): 135 / 149 cases run
Not run yet: B11, B12, F4 (reports), F5 (export), F6 (import with Score column), F8 (kanban/mobile), G9 (threshold input),
H9 (session expiry), K3 (field rename), K7 (merge), K9 (hidden field), L1 (import 1000), L3 (mass update 500), X1 (web form + import journey).

## Bugs found (not filed — waiting for the QA lead)
- K1 Medium: field used by a scoring rule can be deleted; rule silently breaks (Zoho refuses the delete).
- K2 Low: pick list value used by a rule can be removed; records lose points silently (Zoho keeps it as unused).
- A2 Low: user without permission sees menu, New button and drawer (route guard metadata.modules.manage ≠ API permission).
- B10 Low: unknown module id shows "No scoring rules for  yet" with New enabled; API 200.
- C19 Low: identical entries accepted and counted twice (Zoho ALREADY_USED).
- D15 Low: API accepts "eq x" on a User field.
- F1 (gap-like): Score not in any layout by default; record page shows no score.
- H2 Low: PUT without row_version overwrites (like NDC-2868).
- H4 Low: parallel creates make duplicate names.
- I3 Low: DELETE unknown id answers 204.
- I6 Low: API stores operators the screen cannot show (regexMatches, lengthEq, isEmpty).
- J6 Low: focus does not move to the first error.
- F9 note: audit edit shows "EntriesJson: value: 1 item → value: 1 item".

## Gaps confirmed live in Zoho (Z1–Z16) + new: relative date conditions (Today, Current Month, Age in Days…), pick list contains/starts/ends.

## Cleanup (done 12 Nov)
- TAVI: 0 scoring rules (baseline 0); QA workflows, 69 records and QA fields deleted (records in Recycle Bin).
  Left behind: system Score field on Services (added by the K5 rule, cannot be removed).
- Zoho: all QA SR1112 rules, 2 fields and 1 lead deleted. "Update old records" was used once on the Web rule (rescored existing leads; scores removed when the rule was deleted).
