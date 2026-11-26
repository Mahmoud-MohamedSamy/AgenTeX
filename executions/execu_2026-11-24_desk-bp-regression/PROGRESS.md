# Desk Blueprint go-live regression — progress

Plan + cases: `docs/desk-blueprint/regression/` (cases.json 330 cases, exec-plan.js), artifact https://claude.ai/artifact/S214dEfyWD2d8fTL1tPwFD (v2 = execution plan).
User 24 Nov 2026: cases approved, new QA dept, plan approved, **yes to all decisions**:
- Zoho writes allowed in techegysolutions (delete + purge after)
- Business hours Mon–Fri + holiday (~15 min) and Customer Happiness ON for QA BP Reg Dept: allowed, restore after
- Anyware-Staging owner token allowed for read-only cross-tenant calls (AC-09, API-02)
- Mobile / SMS / AI / CRM-only bugs stay out of scope
- Save the new checks as reusable automation (extend deskblueprint suite)

Runner: `scripts/api.js <label> <script.js>` (copy of the automation-order runner; signs in once per label, tokens in %TEMP%/qa-tavi-tokens, never prints credentials). Test data ids: `made.json`.

## Phase 0 — DONE 24 Nov 2026 ~13:50 Cairo
- Build unchanged: bundle index-DQd-6a2G.js (same as the case inventory).
- Baselines: `baseline/baseline-start.json`, `baseline/baseline-after-setup.json`, `baseline/discover.json`. Only differences = our setup items (2 statuses, 1 dept, 1 team, 1 custom action) + computed business-hours timestamps (evaluated_at / next_opens_at — ignore in final diff).
- Tenant state at start: 41 blueprints (30 leftovers "QA BP RT19 …" / "QA RT20 …" from retest rounds in Customer Support etc. — NOT ours, leave alone). 56 workflow rules, only 2 active: "test" (1 dept) and "Test Date-Triggered Workflow" (ALL depts, DateFieldRelative — watch date fields on QA tickets). "test workflow" (subject rewrite) inactive; teammate "AC-07" rule gone → Priority High safe. Rules list: use `take=100&skip=N` (plain list caps at 50, `search` ignored). Happiness, direct switch unchanged.
- Created (made.json):
  - Dept **QA BP Reg Dept** `f3be4a9a-aeb3-4450-a6ef-ed5d50ce00f7` — agents owner, Agent A (CES 2, Desk Agent, 9d182dfa), Agent B (CES 1, Desk Administrator, 2a7c1bc4), Mahmoud Samy (d23fb4e0) as **view-only** member (stands in for Light Agent: no Light Agent account with a sign-in). Routing round_robin (default). No support email address yet (EN-03 needs one → Phase 4).
  - Team **QA BP Reg Team** `b6b0ba24-…` — members via `sources:[{kind:'agent',ref_id}]` (member_user_ids on create is ignored): Agent B + Agent A.
  - Contact **QA BP Reg Customer** (+qae1 Gmail) `03892e36-…` — Help Center invite not sent yet (Phase 4).
  - Statuses via Add State: **QA BP Verify** (open), **QA BP Done** (closed).
  - webhook.site inbox (uuid in made.json; URL https://webhook.site/<uuid>).
  - Custom action **QA BP echo** (+ source "QA BP Reg echo API") → POSTs to the webhook.site inbox; published.
  - Email template **QA BP Reg template** (no use_case; contact). Valid use_cases list is event-bound — never bind a QA template to an event.
- Agent C for cross-department = Test User 1 (876ce871, Desk Supervisor, 14 depts, not in QA BP Reg Dept).
- Guard: subject prefix `QA BP R ` + department QA BP Reg Dept on every QA blueprint.

## Next — Phase 1 (fast regression sweep, 53 RG cases)
Retarget Java `automation/…/deskblueprint` (61 tests) + `execu_2026-11-08_desk-automation-order/a6/lib-bp.js` helpers from Customer Support to QA BP Reg Dept, run class by class; RG verdicts to `out/results.jsonl`. Gate A note to user after.

## Phase 1 + Phase 2 (in progress) — 24 Nov 2026 afternoon
Automation saved in `automation/desk-blueprint-regression/` (rr.js multi-account runner, lib.js, checks/NN-*.js). Results append to `out/results.jsonl` (latest line per case wins). Java deskblueprint suite NOT used (hard-wired to Anyware tenant/modules, would sign the owner in again) — RG cases are checked inside the feature scripts instead.
Accounts: A = CES 2 (Desk Agent), B = CES 1 (Desk Admin), **C = Mahmoud TAVIPortal (Supervisor, Tech)** — Test User 1 is NOT a Tech agent (C1, used only for AC-05 revoke-only). VO = Mahmoud Samy (view-only member). Anyware owner token (extra-credentials.csv) for AC-09/API-02 only.
Traps learned: priority values lowercase; department edit = PATCH full body; team members = sources[{kind:'agent',ref_id}]; task assigneeMode owner|performer|user|team; object values {kind:'object',properties}; reply needs to:[email]; requiredFor keys 'desk:<kind>' / 'field:<name>' / 'checklist:<id>'; field checks rule = {op,field,value}; sort body {department_id, items:[{id,sort_order}]}; include body {state_id,ticket_ids}; merge {master_ticket_id, source_ticket_ids}; bin restore POST /audit/recycle-bin/restore {ids}. **Teammate's active "test blueprint" in Tech catches every subject containing "QA"** — check blueprint id, not just "in a blueprint".
Bug candidates so far: TU-06/TU-12/TU-18 transition field values skip the field's own validation (length, pick-list option, lookup exists) while a normal edit refuses them. API-07 wrong-shape body returns .NET type names. Findings: CV-06, ST-05, ST-07, TB-12, TF-12, EN-13, TF-07 note (custom-action input tokens literal), TF-09 (custom action async order).

## RUN DONE — 24 Nov 2026 ~16:45 Cairo (all phases)
Results on every case: artifact S214dEfyWD2d8fTL1tPwFD v3 (docs/desk-blueprint/regression/results-card.js reads out/results.jsonl; latest line per case wins).
Tally: PASS 240, FAIL 4 (TU-06, TU-12, TU-18 validation bypass in transition form; API-07 .NET type names), FINDING ~10, BLOCKED 13, INCONCLUSIVE/PARTIAL ~20, NOT RUN ~37 (customer reply / mailbox / chat / import / keyboard / browsers / 500-ticket perf).
Blocked by environment: department SLA never starts (NDC-3202 open) → TM-14/15; no chat → E2E-06/RG-37; no formula field → TF-12/RG-02; no Light Agent / suspend = shared accounts.
Owner browser sign-in fails (form stays empty) → screens done as Agent B (CES 1, Desk Admin; saved session automation/.auth/…_Customer Experience Specialists 1.json).
Shared settings: Customer Happiness (QA dept) and default business hours (PUT /iam/tenant/business-hours) changed and restored; final diff clean (baseline/final-diff.json). Everything QA deleted: dept, team, contact, template, custom action + source, 5 statuses, all QA BP R blueprints/tickets; 723 QA items purged from the Recycle Bin.
Nothing filed in Plane. Bug drafts + findings on the artifact. Next: user review → filing.

## Filed in Plane 24 Nov 2026 (user: File all 5)
NDC-3277 (High, TU-06/12/18 field checks skipped in transition form, relates NDC-3012 + NDC-3060), NDC-3278 (Low, API-07 .NET names, relates NDC-3069), NDC-3279 (Low, E2E-01 owner without edit access told 'not an owner', relates NDC-3117), NDC-3280 (Low, IN-01 WF log 'Fired' when skipped, labels Blueprint + Workflow Rules, relates NDC-2764), NDC-3281 (Low, TB-12 other-dept owner not an agent saved). Bug, Desk, Sprint 17, MahmoudMohamed + mfathy + Hegazy, one annotated image each (evidence/annotated/BP-R1..R5, specs evidence/specs, scripts/build-plane-images.js, file-plane.js). Repro data deleted.

## Second filing 25 Nov 2026 (user: file all other findings with annotated evidence)
NDC-3311 (Medium, EN-13 middle-status entry vs Zoho), NDC-3312 (Low, UX-01 Arabic status names), NDC-3313 (Low, ST-05/07), NDC-3314 (Low, CV-06/API-01), NDC-3315 (Low, TF-X1), NDC-3316 (Low, RS-01 duplicate owner History line — not blueprint-specific, label UI/UX). Bug, Desk, Sprint 17, trio, images BP-R6..R11 (build-plane-images2.js, bugs2.js, file-plane2.js). ZP-01 skipped by user (no comparable Zoho extension). TF-09 not reproduced on 25 Nov → PASS, not filed. Repro data deleted.
