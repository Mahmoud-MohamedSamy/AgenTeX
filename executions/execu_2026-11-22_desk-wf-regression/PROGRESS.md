# Desk Workflow Rules go-live regression — run 1 (22 Nov 2026, NDC-Staging)

Plan + results page: docs/desk-workflow-rules/regression/plan-workflow-rules-regression.html (artifact Kj2AKEZSCw1LpH8LTjbC98, v2).
Results: out/results.jsonl (one line per case id; later line wins). Ledger of created data: ledger.md. Cleanup verified zero.

## How to run
- `bash scripts/run.sh cases/<x>.js` = lib.js + case, owner API with ONE saved sign-in (scripts/api.js token store). Never run two at once.
- `node scripts/ui.js ndc-staging-owner cases/<ui>.js` = browser (saved session automation/.auth).
- QA departments: QA RT19 WF Dept (no agents) and QA AO Dept B (agents Dev Team 2, Test User 1, owner). Guard: subject starts with "QA WF <tag> ".
- `node scripts/rec.js ID VERDICT "note"` appends a result. Then `node docs/desk-workflow-rules/regression/make-plan-html.js` and republish.

## API facts learned (22 Nov)
- Record values: kind first; picklists lowercase keys (priority low/medium/high/urgent); subject is trimmed.
- PATCH /workflow/rules with a partial body wipes criteria (send the full body).
- GET /workflow/rules: take max 200, page with skip; no total_count. Reorder needs ALL ids.
- GET /workflow/executions?recordId= returns []; use ?ruleId= and filter recordId.
- Owner can't be PATCHed on a ticket (422); use POST /desk/tickets/{id}/assign {owner_id}; department via POST /move {department_id}.
- Comment API body_html; replies mode reply|forward; history GET /desk/tickets/{id}/history.
- Owner kinds: SpecificUser, UserField, RoleRoundRobin (= profile), OrgUnitRoundRobin (= role), Team, TeamWithAgent, AssignmentRule. AddTags mode append|overwrite.
- Test rule: POST /rules/{id}/execute {recordId, triggerKind, fields}; draft POST /rules/evaluate {rule, sampleRecord} → 500.
- Tag delete needs ?confirm=true. Recycle bin: GET /audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200 (100 per page), POST /audit/recycle-bin/delete {ids}.
- Dept B auto-tags new tickets whose subject matches a tag name (engine, ~10 s) → fires On Edit.
- Date rule values compared in tenant time (UTC+2).

## Bug candidates (not filed)
AC-07 role round robin assigns nobody (Oct B-9) · AT-06 Add followers skipped on create · OB-02 evaluate 500.
Findings: API-01, OB-01, OB-03, OB-05, OB-06, TR-06, TR-12, TD-11, TD-13/MX-06 (message), MX-04, AC-03, AC-24, L-09, UX-09.

## Next (142 not run)
Gmail/portal cases, happiness/business-hours (need OK), chat connections, skills/team/profile set-up, UI-level cases, PF/IN/RG/E2E.

## Run 2 — 22–23 Nov 2026 (all remaining cases; user: "continue all the remaining cases without stop")
All 339 cases now have a verdict: 274 PASS, 5 FAIL, 20 FINDING, 23 PARTIAL, 1 INCONCLUSIVE, 14 BLOCKED, 2 N/A. Artifact v3.
- Batches: cases/b1..b10 (+b2b/b2c/b3b/b4c/b5v/b7v/b8b/b8c), UI u3..u11, permissions ps1..ps3 + u10 (Desk Agent "Customer Experience Specialists 2" and Desk Supervisor "Test User 1", one sign-in each).
- New FAILs: AC-10 (Owner → assignment rule always "picked nobody"), TC-01 ("changed" matches on create), TC-04 (Date-Time conditions only read at create, not at fire time / on edit). Still FAIL from run 1: AC-07 (= Oct B-9), OB-02.
- New FINDINGS: CO-86, CO-90, CO-92, CF-11, AC-25, AT-03 (${ticket_number} empty), AT-12, MR-07 (rule edit cancels pending scheduled actions), L-10, PF-03 (217-rule list ~74 s).
- Fixed since run 1: AT-06, OB-03, OB-05, OB-06; Oct B-1..B-8 fixed, B-9 still fails.
- Shared settings changed and restored: tenant business hours (3 min), holiday list linked to default profile (3 min), Customer Happiness on Dept B (2 min, diff []), direct assignment switch (25 s), owner UI language (Arabic → English).
- Tricks: ratings by POST /desk/tickets/{id}/happiness-link → public POST /desk/public/happiness/{token} {rating good|okay|bad}; date trigger key is dateFieldName; rule toggle POST /rules/{id}/activate|deactivate; rule edit = PATCH full body (PUT 405); merge {master_ticket_id, source_ticket_ids}; macro actions [{kind:'set_field', field_key, value lowercase}]; skills POST /desk/skills?department_id= {name,type_id,status,criteria}; /workflow/rules/limits gives used counts; webhook.site rate-limits token creation (retry 12×10 s).
- BLOCKED: customer reply by email/portal (TE-01/02, TC-05, E2E-01), chat/IM (AX-01..05, RC-06), TF-10/CL-13 (module field changes), PS-01/PS-05 (no such accounts).
- Cleanup run 2 verified zero (cleanup2/3/4): 184 rules, 250 tickets, 8 contacts, team, 3 skills + type, 8 assignment rules, macro, blueprint, tags, 475 bin items. Tasks list does not page past 100 (no QA tasks in the first 100). Only active rule: teammate "test".
- Nothing filed in Plane.

## Fail retest + drafts — 23 Nov 2026 (user: "retest the failed cases / draft all the findings")
- cases/rt1.js (all 5 fails) + rt2.js (TC-04 confirm, 5 more tickets). Cleanup cleanup5.js verified zero (5 rules, 14 tickets, 2 assignment rules, 19 bin items; only "test" active; direct switch OFF).
- TC-04 FIXED (8/8: High→Low no run, Low→High runs). Still FAIL: AC-10, AC-07, TC-01, OB-02.
- Tally now 276 PASS, 4 FAIL, 19 FINDING (+ UX-09 side finding, not a plan case), 24 partial/inconclusive, 14 BLOCKED, 2 N/A. (RM-10 moved FINDING→PASS late in run 2; earlier 274/20 report was off by one.)
- Plane drafts: docs/desk-workflow-rules/regression/bug-drafts.js (source) → bug-drafts.md (make-drafts-md.js) + "Plane drafts" section on the page. 23 drafts (4 fails + 19 findings; MX-06 merged into TD-13). Artifact v4. NOT filed.
