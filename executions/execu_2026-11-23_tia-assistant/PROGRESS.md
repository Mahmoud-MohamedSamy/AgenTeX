# TIA Assistant run — progress (step 3)

Spec: docs/tia-assistant/spec-tia-assistant.md · Results: out/results.jsonl · Data: ledger.md

## Accounts used
- OWN ndc-staging-owner · ADM QA Team 1 · CRA Mahmoud Mohamed · RST Customer Experience Specialists 2 (Desk Agent, NO CRM app access) · RSC mahmoud.mahamed1515 (CRM Manager: sees deals, owner's leads 403) · NOP Test User 1

## Preflight (23 Nov)
- P-01/P-02 PASS: Tia v7 deployed, active, 28 tools, wallet ok (baseline-run-desk/crm.json)
- P-03 saved out/p03-profiles.json
- P-04 RST: no Desk departments at start; no CRM app (APP_KEY_NOT_ENTITLED); Tia caps for RST still list crm/all modules, 26 tools, 73 setup areas
- P-06 DONE: ai:tia:use GRANT on Desk Agent 44444444-4444-4444-4444-444444444402 (only CES 2 on it) → R-03 must DELETE it
- P-07 DONE: CRM ids out/p07-crm-ids.json; Desk ids out/p07-desk-ids.json; RST added to QA AO Dept A (restore in R-02)

## Cleanup owed
- see ledger.md; also Tia chats created by our accounts (not OWN's Arabic chat e282805d…)

## Step 3 DONE (23–24 Nov 2026)
- 290 result rows (out/results-final.json, last verdict per id): Pass 186, Fail 27, Finding 23, Blocked 13, Inconclusive 19; Z: Gap 13, Partly 4, Not a gap 3, out of scope 2
- 9 bug drafts + findings in bug-drafts.md — NOT filed
- CRM browser checks blocked: CRA sign-in loops at org picker (Wonder Travel / Ashtar), owner CRM session expired; CRM covered by API
- Cleanup R-01..R-05 PASS: data 0, chats 0 (owner Arabic chat kept), Desk Agent profile + Tia def + policy + runtime equal to baseline
- Next: step 4 full execution report (waiting for the user)
