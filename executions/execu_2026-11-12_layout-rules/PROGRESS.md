# Layout Rules run — 12 Nov 2026 (CRM + Desk vs Zoho)

Sheet: https://claude.ai/artifact/PUdj9axtAjCR8UQpegu5qC (db results/<caseId>; 79 cases written 12 Nov ~11:40 UTC via out/sheet/*.json from results.tsv → scripts/merge.js)
Plane: nothing filed (user: not until told). Zoho writes allowed in test orgs (user, 12 Nov).

## How to run
- API: `bash scripts/run.sh <crm|desk> <step.js>` (lib.js prepended; owner ndc-staging-owner; lanes layout / layoutdesk). ids in out/ids-<app>.json.
- UI: ui-server.js on 8895 (CRM) / 8896 (Desk), `bash scripts/t2.sh <port> <app> <step.js>` (ulib.js helpers). Form wrapper `[data-rule-field=<name>]`; create URL /modules/<mid>/records/new?layout=<lid>; settings ?tab=layout-rules.
- Zoho: zoho-server.js on 8897 (one Zoho account, CRM org944965048 + Desk techsolutionsegypt), `bash scripts/zrun2.sh <step.js>` (zlib.js zf/zFields; zdlib.js zd). Zoho CRM v9 layout_rules API works (create body: primary_field, conditions[{sequence_number, primary_condition, sub_conditions[{sequence_number, criteria, actions[{action_type, elements[{type:'fields', resource:{id,api_name}}]}]}]}]).
- Record a result: `node scripts/rec.js <app> <caseId> <PASS|FAIL|GAP|BLOCKED|INFO|NOTRUN> <fact>` then merge.js + ArtifactData batch.

## Status
- Done: API contract (C, I, K, H2), CRM form (D, E, F core + CRM-only actions, G1–G4, G12), Desk form (E1, D3/D7/D13, G16), lists/editor (A1, B2–B6, C2, C6), low-priv (A4/A5 CRM), Zoho live (Z1, Z7, Z8, E6, G4, H2).
- ~11:35 UTC staging went down: /modules 404 for CRM and Desk, browsers signed out, audit 503. QA layout/fields/rules not visible (likely outage, not deletion) — re-check when back.
- Not run yet: G5 quick create, G8/G9 kanban/pipeline, G10 blueprint, G11 import, G13 workflow, H1 order, H7 field permissions, J3, J5–J10, L1–L4, M, N, X1/X3/X4, F7, K8, K2 (no other-tenant account), K9.
- Blocked: Desk A3/A4 (no Desk Agent account), G17–G19/X2 (no HC form for a department with an HC rule), Z13 mobile.

## Sheet: 93 cases written (55 pass, 13 fail, 2 gap, 13 info, 8 blocked, 2 not run). Staging outage 11:35–12:30 UTC, data intact.

## Findings so far
FAIL: J4 deleting a field used as one target switches the whole rule off (not blocked; Zoho Desk blocks), G7/Z6 mass update of primary field skips rule-mandatory (single API refuses; Zoho blocks), G4 inline edit (no way to fill rule-mandatory field; Zoho asks), E6/Z12 typed value in hidden field dropped on create (Zoho keeps), G16/C14 Desk department scope ignored on create form, F15/F16 conflicting actions accepted (Zoho refuses), I8 no cap on actions per condition (500 accepted), K3 DELETE via other module returns 204 without deleting.
GAP: Z1 CRM / Z2 Desk primary field types limited to choice fields.
INFO: D13 all matching conditions apply (Zoho: topmost wins — not checked live); G12 TAVI API always enforces rule-mandatory (Zoho only on request); Zoho CRM has a v9 layout-rules API (intake said none).

## Cleanup ledger
See ledger.md. TAVI: QA LR1112 fields/layout/rules/records on CRM Leads + Desk Tickets; Desk vip rule set to department CS. Zoho CRM: rules 765004, 765012, 765020, 765041; leads 765035, 765047, 765050. 7 QA NDC Desk rules must stay untouched.
