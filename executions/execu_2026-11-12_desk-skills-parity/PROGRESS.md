# PROGRESS — Desk Skills parity (12 Nov 2026)

## Access
- TAVI: `node scripts/api.js mahmoud.mahamed1515 <file>` (one sign-in; token pair in scratchpad sk12-tok-*.json). NDC-Staging tenant …0004.
- Zoho: `node scripts/zd-server.js <scratchpad>/state-zd.json` (bg, port 8893) then `bash scripts/zapi.sh <body.js>` (Zoho API v1 from the page: z(method,path,body), DEPT = Tech 1475109000000426945) or `bash scripts/z.sh <page fn>`.
  Account = docs/Credentials/Zoho hmohamed@anyware.software.txt (user said use it). Org 944875504, portal techsolutionsegypt. **Enterprise trial ends ~16 Nov 2026** — do Zoho runtime first.
  Zoho Tech dept agents: Fathy Mehanna 1475109000000139001 (me), Mahmoud Mohamed 1475109000000486007. Pre-existing skill "test"/type "test" (not ours, keep).

## TAVI build found (bundle 12 Nov, SkillsPage chunk)
- Page settings/customization/skills, tabs Skills / Skill Types / Agent Skills, department picker; filters search/type/agent/status, "Showing x of y", drag order, Active toggle, row menu Edit/Delete, Active skills count of max, Preferences dialog (auto_add, placement top/bottom/settings_order), Recalculate skills (all open unowned tickets, progress).
- API: GET/PUT /desk/skills (dept), POST /desk/skills, PUT/DELETE /desk/skills/{id}, PUT /desk/skills/{id}/agents, PUT /desk/skills/order {skill_ids}, GET /desk/skills/{id}/usage, POST /desk/skills/recalculations, GET .../latest; skill-types GET(dept)/POST{department_id,name}/PUT/DELETE; skill-preferences PUT; /desk/agent-skills?department_id; PUT /desk/agents/{id}/skills {skills}; ticket: POST /desk/tickets/{id}/skills/recalculate, /skills/assign, GET /skills/options.
- Workflow actions Add/Remove skills now 1–10 (validation n>=1&&n<=10), Recalculate, Reassign by skills.
- Strings: skill-strings.txt in scratchpad/bundle (150 keys).

## Status (12 Nov, afternoon)
- [x] Gate 1 approved
- [x] Inventory (bundle + API) and Zoho live checks (RESULTS.md)
- [x] TAVI runtime pairs; UI checks (Skills page, Create Ticket, ticket page)
- [x] Java feature automation/.../deskskills (DeskSkillsParityTest, 16 tests; 12 pass, 4 parity-bug fail as expected)
- [x] Image 1 SK-H02 approved by user 12 Nov
- [x] Images SK-H03, SK-G02 (G02/G03/J04/J05 combined), SK-E01 built (evidence/spec-*.json) — WAITING user review
  New evidence data: TAVI #3144 (no skills → Mahmoud Samy, outside pool), #3145 (inactive + other-dept kept), dept QA SK12 Dept B; Zoho #170 subject renamed + skills set (dropped to S1)
- [x] HTML report built + published privately https://claude.ai/artifact/HG3raXZiXeEUZ1wYq8G4MP (report/index.html via scripts/build-report.js) — WAITING Gate 2 review
- [x] Cleanup done 12 Nov (TAVI + Zoho, see ledger.md CLEANUP)

## Key findings
- Bugs vs Zoho: SK-H02 (needs every skill; Zoho any one), SK-H03 (no-skill ticket assigned, even to an agent outside the pool), SK-G02/G03 (inactive / other-dept skill kept on ticket), SK-J04/J05 (Create Ticket + inline Edit Skills list every department's skills incl. inactive).
- Differs: SK-E01 new dept default auto-add OFF (Zoho ON, AT_THE_END).
- 11 Nov "skills out of layout" draft premise is WRONG: Zoho HAS Skills as a standard removable Lookup layout field (Ticket Information); only hidden on Add Ticket form. Do not file as written.
- Most NDC-2752 gaps now built (per-dept skills/types, Active/Inactive, filters, reorder, agents, usage, limits, recalc).
- TAVI extras: name 100 chars, criteria optional, tenant-wide Recalculate, richer usage.
- Not run: workflow skill actions vs Zoho (TAVI 1-10).
- Zoho state CHANGED (restore at cleanup): RR threshold Tech 3->10; skill order ("test" moved to 4th); QA RR rule active.

## Filed 12 Nov (user: "file the 3 bugs") via Plane MCP
- NDC-2931 (High) skill RR needs every skill — SK-H02/H05 · id 030abb15-f26b-4e9b-9913-1c5982eeb39f
- NDC-2932 (High) no-skill ticket assigned, outside pool — SK-H03 · id 68c40b68-1993-4de1-ac27-b81424035a91
- NDC-2933 (Medium) Skills field offers/keeps inactive + other-dept skills — SK-G02/G03/J02/J04/J05 · id 85e9bc3f-d8bb-42e6-9073-f2ee3e6ede9d
- All: state Bug, label Assignment Rules, module Desk, Sprint 15, assignees MahmoudMohamed + mfathy + Hegazy, relate to NDC-2752 + NDC-2275.
- Images ATTACHED 12 Nov via scripts/plane-attach.js (key file D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv): 2931<-SK-H02, 2932<-SK-H03, 2933<-SK-G02; verified is_uploaded true.
- SK-E01 (auto-add default) not filed (user asked for 3 bugs only).

## Remaining comparisons — 12 Nov afternoon (user: "run the remaining Zoho comparisons before the trial ends")
- SK-I01..I05 workflow skill actions: same 4 actions, same 1–10 limit, same run-time result (cap 10, extras/inactive skipped). DIFFERS: TAVI picker lists 87 skills (all depts, inactive, 31 DELETED QA SK12) — Zoho only the rule dept's active skills (SK-I03).
- SK-J07: Create Ticket also lists 32 deleted skills; ticket #3176 saved with deleted "QA SK12 S1" keeps it (extends NDC-2933). Cause: skills field datatypeOptions.allowed_values never cleaned.
- SK-H06: TAVI dept threshold counts agent's open tickets in ALL depts (Test User 1: 2 in Dept A, ~92 total; thr 1/40 → unassigned, 100 → assigned). Zoho counts only that dept (Fathy 5 Tech + 1 other; thr 6 → assigned #189). Bug.
- Zoho threshold 3 -> 6 -> 3 (verified). Report v2 published (5 findings, 4–5 not filed). Evidence raw: evidence/remaining/.
- QA SK13 data LEFT IN PLACE (ledger "Remaining comparisons"): TAVI 2 depts, 14 skills, 2 types, WF rule, RR rule, tickets #3174–#3182; Zoho 14 skills, 2 types, WF rule, contact, tickets #187–#189, Fathy mapped to QA SK13 S1. Cleanup after user decides on filing.
- Rows now: 48 — 31 Same, 11 Bug, 1 Differs, 5 TAVI extra, 0 not compared.

## Filed 12 Nov evening (user: "yes, build the images and file both bugs")
- Fresh evidence (evidence/remaining/): TAVI #3204 QA SK13 H7 created at threshold 40 → Unassigned (Test User 1: 3 open in Dept A, ~90 elsewhere); TAVI prefs/rule/picker/create-ticket/#3176 shots; Zoho #189, clean Add Skills picker (unsaved new rule, nothing saved).
- Images: screenshots/annotated/SK-H06-dept-threshold-counts-all-departments-vs-zoho.png, SK-I03-J07-skill-pickers-deleted-inactive-other-dept-vs-zoho.png (specs evidence/spec-H06.json, spec-I03.json).
- NDC-2970 (High) dept threshold counts all departments — SK-H06 · id 34d99e36-05fd-47ae-92fc-349c69b22e86
- NDC-2971 (Medium) pickers offer deleted/inactive/other-dept skills; deleted skill kept on ticket — SK-I03/I05/J07 · id c2293b5f-636b-4b48-a7b2-a7340040452f
- Both: Bug, Assignment Rules, Desk module, Sprint 15, 3 assignees, relate to NDC-2752 + NDC-2275 (2971 also NDC-2933); images attached (204). Report republished (all 5 filed).
- QA SK13 data still in place (ledger) + #3204; Dept A threshold now 40. Cleanup pending user go.
- 12 Nov evening: Zoho QA SK13 cleanup DONE (user: "clean up the Zoho data, keep TAVI for now") — rule, 3 tickets + contact (purged), 14 skills, 2 types; Tech back to skill/type "test" only. TAVI QA SK13 data kept for devs (#3176, #3204 repro) — clean later by ledger.
