# Desk Assignment Rules — feature map

Desk › Setup › Automation › Assignment Rules (Direct Assignment + Round Robin + Round Robin Preferences + Team Assignment +
Notifications) and Setup › Customization › Skills, on **NDC-Staging** (`https://staging-desk.taviportal.com`, tenant `…0004`).
Reference: Zoho Desk assignment rules. Case ids are the 137 cases of the 19 Nov 2026 full run
(`executions/execu_2026-11-19_assignment-rules-full/scripts/cases.js`, checklist artifact Mp84SdkXY3FuKMzvzoDJYp).

## How to run
```
cd automation
./mvnw test -Dfeature=deskassignmentrules "-Dcredentials.file=../docs/Credentials/TAVI Desk Credentials.csv" -Dheadless=true
./mvnw test -Dfeature=deskassignmentrules -Dtags=smoke  ...          # ~15 P0 checks
./mvnw test -Dfeature=deskassignmentrules -Dtags=NDC-3137 ...        # one bug
./mvnw test -Dfeature=deskassignmentrules -Dcases=F-08d,E-12 ...     # spec cases
./mvnw test -Dtest=RrPreferencesTest ...                             # one group
```
Both the API helper and the UI session (NdcUiSession) read `docs/Credentials/TAVI Desk Credentials.csv` by its name column
themselves; no credentials flags are needed. A full run takes about 1 h 50 min (backlog / closure waits).

## Test classes → groups
| Class | Cases | Kind |
|---|---|---|
| AssignmentRulesUiTest | A-01, A-02, A-03/A-07 (UI), A-04 (UI), A-08, A-12, C-01, C-02/C-03, C-06, C-08 (UI), D-13b, E-01, E-02/E-04 (UI), E-03, E-06/E-07, F-02/F-04 (UI), G-04/G-05, H-05, H-14/I-05, I-01, I-02, R-2813 | Selenium (owner) |
| RuleFormApiTest | A-03..A-07, A-09, A-11, A-13, A-14, A-15, C-04, C-05, C-07 | API |
| CriteriaTest | B-01..B-09, B-06b (SLA Escalated runtime, slow), R-2814 (B-08a) | API |
| DirectRuntimeTest | D-01..D-17, A-08 (D-11), A-10 (D-12), F-13 (D-05) | API |
| RoundRobinTest | E-02, E-04, E-05, E-08..E-21, A-10 (E-17) | API |
| RrPreferencesTest | F-01..F-16, C-08/R-2812 (F-12), R-2811 (F-07d), R-2824 (F-14/F-15), R-3137 (F-08d), F-07f (Jam 602e782c: dept threshold, fully offline agent comes online; PASS 22 Nov, Jam not reproduced) | API |
| NotificationsTest | G-01, G-02, G-03, G-06, G-07 | API, read as A1/A2 |
| SkillsTest | H-01..H-13, E-14a/b/c, R-2821, R-2931, R-2932 | API |
| NonFunctionalTest | I-03 (20 at once), I-04 (speed) | API |
| RegressionTest | R-3046, R-2814b (blocked stub), J-01 (stub) | API |

Not automated (SkipException with the reason): **E-18** (needs 30-day-old customer reply), **J-01** (release-time migration),
**R-2814b** (positive holiday needs `iam.company.business_hours.manage`). D-14 covers the API/form source only (web form, import,
email were checked 18 Nov in `execu_2026-11-18_direct-assign-sources`).

## Run fixture (ArFixture)
- **up()** (first class): writes `executions/execu_<date>_assignment-rules-regression/baseline.json` (switches, RR prefs A/B,
  Team Assignment A, members A/B, skill prefs + skill order A), adds **A2** to both departments, turns the **Direct switch ON**
  (tenant default is OFF), sets clean RR prefs, starts **AgentPresence** (A1/A2 heartbeat every 20 s).
- After **each test**: everything tracked is deleted (rules first), RR prefs of A and B back to the clean profile, A1/A2 back ON.
- **down()** (@AfterSuite + JVM shutdown hook): deletes leftovers, restores the baseline and verifies it, purges Recycle Bin
  items labelled `QA AR …` / `#NNNN QA AR …`, signs the API sessions out. A baseline not marked `restored` is put back at the
  start of the next run (crash safety). Ledger: `ledger.md` in the same folder.
- Clean RR profile: offline agents ON, no thresholds, no backlog runs, incoming immediate (tests set what they need on top).

## Accounts and ids (DeskAssignmentRulesFeature)
- Owner `ndc-staging-owner` (admin, API + UI), A1 `Test User 1`, A2 `Mahmoud Samy` (both sign in, API only),
  A3 `Dev Team 2` (cannot sign in → always offline: the offline-agent cases rely on this),
  `Customer Experience Specialists 2` = agent without `desk:assignment:manage` (A-15). One API sign-in per account per JVM.
- Dept A `b3cd7c28…` (members A1, A3, owner + A2 during the run), Dept B `ce1d8a43…` (A1, owner + A2 during the run).
- Team A `434140a3…` (A2, A3). Outsider agent `9d182dfa…`. Detached holiday list `3bf42474…` (only 7 Nov). Business hours `a0302234…`.
- Dept A also holds older **QA AS6** RR rules (On Ticket Update) and skills from the 6–7 Nov run; they did not interfere on 19 Nov.

## API (all under /api/v1, headers x-tenant-id + x-app-key: desk)
| What | Call |
|---|---|
| rules | `GET /desk/assignment-rules?type=direct` · `?type=round_robin&department_id=` → `data.rules`; `POST`; `PUT /{id}` (full body + version, stale version → 409); `PUT /{id}/active {is_active, version}`; `DELETE /{id}?version=`; `PUT /desk/assignment-rules/order {type, department_id, rules:[{id,version}]}` |
| criteria fields | `GET /desk/assignment-rules/criteria-fields` → `data.fields[{key, group, type, operators[{key}]}]` ("Is Escalated" is `sla_escalated`) |
| switches | `GET/PUT /desk/assignment/notification-settings` (`direct_rules_enabled`, `round_robin_rules_enabled`, notify_*) |
| RR prefs | `GET/PUT /desk/departments/{d}/round-robin-preferences` |
| team assignment | `GET/PUT /desk/departments/{d}/team-assignment {enabled}` |
| members | `GET /desk/departments/{d}` → `agent_user_ids`; **PATCH with the full body** (PUT = 405) |
| ticket | records API `POST/PATCH /modules/{tickets}/records` `{data:[{field, value:{kind,value}}]}`; `GET /desk/tickets/{id}` → `in_backlog`; `/activity` (`ticket.auto_assigned` with rule_id, rule_name, strategy, owner_id, skipped_user_ids, trigger); `POST /move {department_id}` (department change); `POST /assign {owner_id, team_id}`; `POST /pick-up`; `POST /skills/recalculate`; `POST /skills/assign` (Assign by Skills) |
| workload | `GET /desk/agents/{u}/workload` → `data.departments[{department_id, open_tickets}]` (Open only, On Hold not counted) |
| presence | as the agent: `PUT /desk/agents/me/presence {channels:{email,chat,phone}}`, `POST /desk/agents/me/presence/heartbeat {active:true}`; query `POST /desk/agents/presence/query {user_ids}` |
| notifications | as the agent: `GET /notifications?limit=100` (match by ticket id in the JSON) |
| skills | `GET/POST /desk/skills?department_id=`; `PUT /desk/skills/{id}/agents {user_ids}`; `PUT /desk/skills/order?department_id= {skill_ids}`; `GET /desk/skills/{id}/usage`; `GET /desk/agent-skills?department_id=`; `GET/PUT /desk/skill-preferences?department_id=` |
| skill types | `GET /desk/skill-types?department_id=`; **POST with department_id in the body**; `PUT/DELETE /desk/skill-types/{id}?department_id=` |
| workflow | `POST /workflow/rules` (owner action `ownerTargetKind: 'SpecificUser'`); `DELETE /workflow/rules/{id}` |
| SLA | `POST /desk/sla/policies`, `DELETE /desk/sla/policies/{id}`; `GET /desk/tickets/{id}/sla` |
| audit | `GET /audit/events?limit=200&cursor=` (target_type `audit.entity.assignment_rule`, action `audit.action.created`) |
| recycle bin | `GET /audit/recycle-bin/items?app_key=desk&…&cursor=`; `POST /audit/recycle-bin/delete {ids}` (labels "#NNNN subject") |

## UI (locators.json)
- Page `/settings/automation/assignment-rules`; tablists "Assignment settings" (Rules / Team Assignment / Notifications) and
  "Rule type" (Direct Assignment / Round Robin); regions "Direct Assignment", "Round Robin"; switches "Direct Assignment Rules",
  "Round Robin Rules", "Rule <name> active"; drag handles "Drag <name> to reorder"; RR "Department" picker and
  "More Round Robin actions" › Preferences.
- Rule dialog: textbox placeholder "e.g. Urgent tickets to the lead" (fill the name BEFORE Add Target — the form validates it
  first); target group "Target 1"; buttons "Ticket coming to", "Move Ticket to", "Agent", "Mark as Unassigned"; radiogroups
  "Assign Ticket to" (Agents / Teams / Team linked to a ticket field) and "Round robin type *". Pick lists are `[role=option]`.
- Preferences dialog: switches "Assign tickets to offline agents", "Department wise threshold", "Agent level threshold",
  "Assign backlogs", "Assign tickets on closure"; spinbutton "Open tickets per agent"; row "Agent" + "Threshold of row 1".
- Skills page `/settings/customization/skills`: tabs Skills / Skill Types / Agent Skills, "Department" picker,
  "Search skills", "Status" filter, rows "Drag <name> to change its place"; Agent Skills "Search agents".
- New Ticket form `/modules/{tickets}/records/new`.

## Traps
- **UI organization.** `ndc-staging-owner` is in several organizations and this machine sets `QA_EMAIL` to another account, so
  AuthManager would sign the UI in elsewhere (21 Nov: Anyware tenant `…0002`, Arabic). The UI class is `@NoAuth` and uses
  `NdcUiSession`: one form login with the CSV row, "Choose an organization" → **Wonder Travel**, checks `aw_auth_tenant_id = …0004`,
  then reuses cookies + localStorage in memory. No `-Dcredentials.file` needed for it.
- **Arabic sticks.** The language choice is saved (`anyware_language` in localStorage). I-01 runs last (priority 100) and
  `AssignmentRulesPage.open()` forces English back, otherwise every later English locator breaks.
- **Dept A workload vs threshold.** In Dept A the agents hold ~70 old QA tickets; the workload API said A1 had 74 open and a
  threshold of 74 still let a ticket through (21 Nov). Likely the workload count includes On Hold / other open-type tickets
  that the threshold ignores (NDC-2824). Threshold tests therefore run in Dept B, where agents only hold this run's tickets.
- **Staging stalls.** A TLS handshake once hung for 20+ min: every call has 30 s connect / 90 s read timeouts and is retried;
  the presence thread never holds a lock the tests wait on. "Timed out receiving message from renderer" = slow page, rerun.
- SLA escalation (B-06b) needs a recipient in the escalation level, and the 1-minute SLA sometimes takes > 7 min to escalate
  (then the test is skipped as INCONCLUSIVE, never passed).
- Audit `cursor` must be sent as returned (no extra URL-encoding) or the API answers 400 "cursor malformed".
- Agent Skills lists skill **names** per agent, not ids. A department needs ≥ 11 skills for the H-11 ticket limit (the test pads).
- Backlog job runs about once a minute: backlog cases wait up to 2 min; closure assignment is immediate.
- "Full" agent = agent threshold equal to its open tickets in that department (Open only). Tests create owned tickets first
  so every agent has at least one.
- An RR rule with "All tickets" criteria catches every ticket of the department — tests use unique "QA AR <case> <uid>" markers
  and B-01's no-criteria direct rule is deleted in `finally`.
- A2's sessions: the heartbeat thread and the tests share one API sign-in per account (no second context).
- Requirements doc is out of date on NDC-2824 (On Hold not counted) and NDC-2931/2932 (skill RR follows Zoho).

## Open bugs covered
| Bug | Test | Expect |
|---|---|---|
| NDC-3137 | RrPreferencesTest#closureOfflineAgent (F-08d) | Done 21 Nov (r24) — should pass |

## Run history
| Date | Scope | Passed | Failed | Skipped | Notes |
|---|---|---|---|---|---|
| 21 Nov 2026 | smoke (12) | 11 | 1 | 0 | E-16 in Dept A (workload trap); first attempt hung on a TLS handshake → timeouts added |
| 21 Nov 2026 | full regression (123 tests / 137 cases) | 86 | 34 | 3 | 22 UI failed: signed in to the wrong organization + Arabic left on; 12 API test defects (cursor, notification shape, SLA recipient, skill names, padding, E-16, err parsing); I-04 6/10 ≤ 5 s |
| 21–22 Nov 2026 | rerun of the 41 non-passing cases after fixes | 41 | 0 | 1 | B-06b INCONCLUSIVE (SLA did not escalate in 7 min); I-04 passed on rerun; 3 UI tests rerun after a renderer timeout |
| | **final state** | **119** | **0** | **4** | skipped: B-06b (inconclusive), E-18, J-01, R-2814b (not automatable); restore "left: nothing" every run |
| 22 Nov 2026 | full regression (124 tests, + F-07f) | 95 | 4 | 25 | 21 UI skipped + C-02 failed: NdcUiSession restore on /favicon.ico → Edge 158 "localStorage access denied" (now /login); D-01 history written late; D-17 timing; I-04 4/10 (slow staging) |
| 22 Nov 2026 | RrComboTest G-01..G-09 (new) + reruns | 7+22+1+3 | 1 | 1 | combo first in Dept B failed (A3 not a Dept B member) → moved to Dept A; G-06 compared id vs name, G-02 load tie → fixed; UI 22/22, D-17 pass, D-01 pass after 30 s history poll |
| | **final state 22 Nov** | **128** | **1** | **4** | open: I-04 speed (8/10 ≤ 5 s on rerun, one ticket 76 s); skipped as before: B-06b, E-18, J-01, R-2814b |
