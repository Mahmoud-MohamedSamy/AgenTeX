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
## Sheet after session 2 (12 Nov ~16:30 UTC): 185 cases written (102 pass, 25 fail, 3 gap, 27 info, 12 blocked, 16 not run). sheet2/ = the 92 new docs.
New FAIL: D6 isNull never matches; D5 user primary field never fires; D9–D12 editor can't build text/number/date rows (form works via API, editor shows 'unknown field'); J3 one missing target switches off whole rule (also J6/J8 pattern); J7 layout delete leaves rules orphaned+active; A2 CRM User sees rule list; K9 hidden field value leaks in record timeline; M5 no aria-required; F27 = I8. GAP G21 no layout change on record.
NOT RUN (setup-heavy): G9, G10/Z5, G14, G15, H6, H9, A6 (needs OK to change User profile), F5, F14/Z11, F26, X4, Desk A7. BLOCKED: G8 Kanban fails to load, F22/F23 no buttons/links, K2.
Session-2 data to clean (in ledger.md): rules user/deep/I1 dbl/X3 (CRM), X1 (Desk), Tasks layout 70fc6ce7 + rule, records E7/G20/G6/F9/F4/F21x2/X3/wf G13/H7 low + 3 imported (import 24b0ee6b can be undone), task G23, Desk tickets X1 x2, field perms for profile User (order RO, date hidden) ids in ids-crm.json fps; basic rule has extra Partner branch + related list (restore I.c1orig), vip rule changed (restore I.r3orig), radio rule test branches (restore I.r4orig). api.js got a rawForm helper (multipart).
Browser sessions expire ~hourly; CRM 8895 currently signed OUT (I9 test). Restart before UI work.

## Findings so far
FAIL: J4 deleting a field used as one target switches the whole rule off (not blocked; Zoho Desk blocks), G7/Z6 mass update of primary field skips rule-mandatory (single API refuses; Zoho blocks), G4 inline edit (no way to fill rule-mandatory field; Zoho asks), E6/Z12 typed value in hidden field dropped on create (Zoho keeps), G16/C14 Desk department scope ignored on create form, F15/F16 conflicting actions accepted (Zoho refuses), I8 no cap on actions per condition (500 accepted), K3 DELETE via other module returns 204 without deleting.
GAP: Z1 CRM / Z2 Desk primary field types limited to choice fields.
INFO: D13 all matching conditions apply (Zoho: topmost wins — not checked live); G12 TAVI API always enforces rule-mandatory (Zoho only on request); Zoho CRM has a v9 layout-rules API (intake said none).

## Cleanup ledger
See ledger.md. TAVI: QA LR1112 fields/layout/rules/records on CRM Leads + Desk Tickets; Desk vip rule set to department CS. Zoho CRM: rules 765004, 765012, 765020, 765041; leads 765035, 765047, 765050. 7 QA NDC Desk rules must stay untouched.
## Session 3 (12 Nov, fixtures): sheet 185 cases = 110 pass, 28 fail, 5 gap, 29 info, 10 blocked, 3 not run
Fixtures created (all in ledger.md, clean up): CRM button 'QA LR1112 btn' + link 'QA LR1112 link' (Leads), dependency map type->tier (0054aecf), validation rule 'QA LR1112 VR' (ac297c1a, all Leads layouts), blueprint 'QA LR1112 BP' (5ef8a445, QA layout), Deals field qa_lr_appnote + layout 'QA LR1112 Deals' (ca63559f) + rule 'QA LR1112 deals X4' + deals 'QA LR1112 deal G9'/'X4', profile 'QA LR1112 prof' (deleted), Desk web form 'QA LR1112 G14 form' + ticket 14c7e304, conversion of lead e4e1c588 (Customer, Subscription, Deal 'QA LR1112 deal G15'). Temp Deals Standard rule deleted. Layout dependency removed.
New: FAIL G9 (stage bar refuses with no way to fill, kanban 500), G10 (blueprint ignores rule mandatory), F5 (filter overrides map dependency); GAP Z5, Z11; INFO F14, F26; PASS G14, G15, H6, H9, X4, A7, F22, F23.
A6 not run: auto-mode classifier blocked granting metadata.modules.manage to profile User - needs user OK / permission rule.
ulib.js: auto re-login (Forgot password? text) because each api.js sign-in revokes the browser session.
## Cleanup DONE (12 Nov, after session 3)
TAVI CRM: 11 rules, blueprint, VR, map dependency, button, link, 2 field perms, import undo, 32 records (Leads/Contacts/Deals/Tasks/Subscriptions), 3 layouts, 14 fields deleted; 32 bin items purged by exact id (out/cleanup-crm-gone.json). The converted lead e4e1c588 did not appear in list/search (converted leads are hidden), which blocked the layout delete with LAYOUT_HAS_RECORDS until it was deleted by id.
TAVI Desk: 5 QA rules, web form, 4 tickets + 1 contact, layout, 12 fields deleted; 7 bin items purged. Only the 7 QA NDC rules remain.
Final check: CRM 0 layout rules, nothing named QA LR1112/qa_lr in any module, User profile permissions = out/perm-user-before.json.
Zoho CRM org944965048: 4 QA rules + 3 QA leads deleted (leads sit in Zoho's Recycle Bin). Zoho Desk had no QA rules.
Report: https://claude.ai/artifact/NGD9T517Hke2qTyFGLLFsm (report/build.js). Plane: nothing filed.
## Session 4 (12 Nov evening): remaining cases + Plane
User OKs: change profiles and revert (A3/A4/A6), K2 account given in chat (Anyware tenant a7a7...0002, not stored in files), dummy layout for K8, B4 myself, Z13 ignore.
Results: A3 PASS (agent sees "You don't have permission"), A4 Desk PASS (403 on all writes), A6 GAP (metadata.modules.manage not enough; only metadata.acl.manage = global admin works; both reverted, perms = backup), B4 PASS CRM+Desk, K8 PASS, K2 FAIL (isolation OK, DELETE 204 no-op = B-18 with K3), G8/Z4 BLOCKED (Kanban 500 rechecked, filed as bug).
Help Center G17/G18/G19/X2/Z9 still BLOCKED: HC access mode sign_in_to_submit, sign-up needs email link + captcha; switching mode to open was refused by auto mode. Needs a HC customer account or user OK for the mode change.
Desk user Mahmoud Mohamed: Desk Agent during A3/A4, restored to Desk Administrator (same scope). Fixtures (layouts, fields, rules on CRM + Desk) deleted after; final check clean.
Sheet: 186 = 114 pass, 29 fail, 6 gap, 29 info, 8 blocked (sheet4/ docs written). Reports republished.

## Plane filed (12 Nov, evening)
Bugs B-01..B-19 = NDC-2974..NDC-2992; gap ticket NDC-2996 (6 gaps); side bugs: Kanban 500 NDC-2993 (High), convert page silent on 422 NDC-2994 (Medium), related-lists picker duplicates NDC-2995 (Low); web-form hosted link already NDC-2959. All Todo, Sprint 16, CRM and/or Desk module by app, label Modules & Fields (+Kanban View / Lead Conversion / Access Control / Accessibility), assignees Mahmoud Mohamed, Eslam, Hegazy; 19 bugs + gap relate to NDC-1988; comment posted on NDC-1988. Evidence attached where it existed (out/plane-filed.json). Scripts plane/file.js, plane/gap.js.
## Session 5 (12 Nov late): Help Center cases (user approved the mode switch)
HC access.mode sign_in_to_submit -> open -> restored (access object = backup, out/hc-access-before.json). HC forms are web forms kind help_center_form (department + layout_id + field list); built 'QA LR1112 HC form' for Customer Support on a QA layout, then deleted + bin purged; QA layout/fields/rules deleted.
G17 PASS (show/require on HC, switch-off rule ignored; captcha stops final submit), G18 INFO (primary missing -> rule silently off, no warning), G19 INFO (hidden field not in DOM; options in form definition only), X2 INFO, Z9 GAP. Comment on NDC-2996 adds Z9. Sheet: 115 pass, 29 fail, 7 gap, 32 info, 3 blocked (G8, Z4 Kanban NDC-2993; Z13 mobile).
api.js: api(m, p, body, extraHeaders) now (If-Match for web forms).
