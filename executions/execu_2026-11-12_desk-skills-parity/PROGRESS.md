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
