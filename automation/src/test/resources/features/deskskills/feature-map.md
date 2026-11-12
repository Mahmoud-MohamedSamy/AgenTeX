# Feature map — Desk Skills (parity vs Zoho Desk)

App: TAVI Desk, NDC-Staging (`https://staging-desk.taviportal.com`, tenant `a7a7a7a7-0000-0000-0000-000000000004`).
Reference: Zoho Desk test portal `techsolutionsegypt` (Enterprise trial), dept Tech `1475109000000426945`.
First mapped 12 Nov 2026 — run folder `executions/execu_2026-11-12_desk-skills-parity/` (PLAN.md, RESULTS.md, ledger.md).

## Screens
| Screen | Path | Notes |
|---|---|---|
| Skills settings | `/settings/customization/skills` | Tabs Skills / Skill Types / Agent Skills; Department picker (button, not `<select>`); filters search / All types / All agents / All statuses; "Active skills: n of 30"; Preferences; Add Skill; drag handle per row; status toggle; row ⋮ Edit/Delete; Recalculate skills block with last run |
| Create Ticket | `/modules/88e8ea44-…/records/new` | Skills field = chip multi-select listing every department's skills (bug, SK-J04) |
| Ticket page | `/modules/88e8ea44-…/records/{id}` | Ticket Properties › Ticket Information › Skills (inline "Edit Skills" button: unfiltered list, SK-J05); side rail **Skills** tab with "Associate Skills" (filtered: active + ticket's department) |

## API (prefix `/api/v1`, headers `x-tenant-id`, `x-app-key: desk`)
- `GET /desk/skills?department_id=` → `{skills, types, preferences}`; `POST /desk/skills?department_id=` `{name,type_id,is_active,description,criteria}`; `PUT /desk/skills/{id}` (full object); `DELETE /desk/skills/{id}`; single GET → 405.
- `PUT /desk/skills/{id}/agents` `{user_ids}` (agent outside dept → 400 not_in_department).
- `PUT /desk/skills/order?department_id=` `{skill_ids}` — must be the whole list, else 409 SKILL_ORDER_STALE.
- `GET /desk/skills/{id}/usage` → assignment_rules, workflow rules/actions, other skills' criteria, agent_ids, open_tickets.
- `POST /desk/skills/recalculations` (202, **whole tenant**: every open unowned ticket in all departments) · `GET /desk/skills/recalculations/latest`.
- Skill types: `GET /desk/skill-types?department_id=`, `POST /desk/skill-types {department_id,name}`, `PUT/DELETE /desk/skill-types/{id}` (delete in use → 409 SKILL_TYPE_IN_USE).
- Preferences: `GET/PUT /desk/skill-preferences?department_id=` `{auto_add, placement: top|bottom|settings_order}` — new department default auto_add **false**, bottom (Zoho default ON, AT_THE_END).
- Agent skills: `GET /desk/agent-skills?department_id=` · `PUT /desk/agents/{id}/skills?department_id=` `{skills:[names]}`.
- Ticket: record field `skills` = array of skill **names** (renaming a skill updates tickets). `POST /desk/tickets/{id}/skills/recalculate`, `POST /desk/tickets/{id}/skills/assign` (→ `{assigned, owner_id, reason}`), `GET /desk/tickets/{id}/skills/options`.
- Limits: name ≤100 (Zoho 50), 30 active per department, 10 skills per ticket (422), workflow Add/Remove skills 1–10.
- Permission: `desk:assignment:manage` (Desk Agent → 403 on all of it).

## Traps
- Department create: `POST /desk/departments {name}`; agents via `PATCH /desk/departments/{id} {name, agent_user_ids}` (PATCH needs `name`; PUT → 405).
- Ticket create without `owner` defaults owner = creator → set `owner: {kind:null}` so rules can route.
- An admin (mahmoud.mahamed1515) gets 403 reading a ticket once it is assigned to someone else in a private department — read results as `ndc-staging-owner`.
- Round robin skips offline agents; QA departments set `assign_to_offline_agents` true (`/desk/departments/{id}/round-robin-preferences`).
- Skill-based RR needs the agent to hold **every** skill on the ticket (Zoho: any one) and assigns tickets with **no** skills (Zoho: doesn't).
- Audit search: `GET /audit/events?limit=&cursor=` (cursor paging only).

## Zoho reference (live 12 Nov 2026)
- API from the signed-in page: `/api/v1/...` with header `X-ZCSRF-TOKEN: crmcsrfparam=<crmcsr cookie>` and `orgId: 944875504` (helper `executions/execu_2026-11-12_desk-skills-parity/scripts/zapi.sh`).
- Skills: `POST /skills {name, skillTypeId, status, criteria}` (no departmentId — comes from the type); criteria required; name ≤50, HTML refused; 30 active per dept (403 LICENSE_ACCESS_LIMITED).
- Ticket `entitySkills` (ids, 0–10); inactive / other-department skills set by hand are dropped silently; recalculateSkills removes non-matching skills.
- Layout: **Skills is a standard removable Lookup field** in Ticket Information (layout editor, Fields List) but NOT on the Add Ticket form; ticket detail shows it in Ticket Properties.
- Round robin threshold (Tech dept 3) blocks skill RR — raise it for tests and restore.

## Tests
| Class | Case ids | Groups |
|---|---|---|
| `DeskSkillsParityTest` | SK-B01..B04, SK-C01, SK-D02, SK-A01, SK-F01, SK-G01/G02/G03/G05/G09, SK-H02/H03, SK-K01 | smoke, regression, parity-bug |

Run: `./mvnw test -Dtest=DeskSkillsParityTest` (or `-Dtags=parity-bug`). Tests create a "QA SKA <id>" department and delete everything after; ledger `executions/execu_2026-11-12_desk-skills-parity/ledger-automation.md`.

## Not automated yet
UI layer (Skills page visuals, Create Ticket / inline Edit Skills option lists — checked by hand 12 Nov), workflow skill actions, bulk recalculation (tenant-wide, would touch other people's tickets).

## Run history
| Date | Scope | Result |
|---|---|---|
| 2026-11-12 | DeskSkillsParityTest run 1 + rerun of 2 (network) | 12 pass, 4 parity-bug fail as expected (G02, G03, H02, H03); department cleanup fixed (transfer) |
