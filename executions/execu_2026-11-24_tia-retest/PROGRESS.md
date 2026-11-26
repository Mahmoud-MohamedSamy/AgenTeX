# TIA retest (part 2), 24 Nov 2026 — progress
Spec: docs/tia-assistant/retest-spec-24nov.md · Results: out/results.jsonl · Data: ledger.md · Scripts: scripts/run.sh <label> <crm|desk> cases/x.js (API), APP=crm node scripts/ui.js <label> cases/x.js (browser)
- P-01..P-05 PASS. CRM browser works as OWN (form sign-in).
- Cleanup owed: see ledger.md (Desk Agent ai:tia:use, RST in Dept A, QA TIA RT records, chats in out/convs.txt)
- NOTE: out/baseline-desk.json was overwritten by a re-run of p01 after P-03, so it includes the temporary ai:tia:use. Original Desk Agent state = 52 permissions WITHOUT ai:tia:use (P-02 result). R-02: just DELETE the grant.
- Changes since 23 Nov seen: Tia v37; write modules now include Desk modules incl. Tickets; new tool 'Several counts at once'; custom actions exist; Leads require single_line_3_9.
## DONE 24 Nov 2026 ~12:05 UTC
- All 37 rows recorded (Pass 23, Finding 7, Fail 6, Inconclusive 1) (out/results-final.json). Cleanup R-01..R-03 PASS. R-04: Tia v38 deployed at 11:54:14 by someone on the owner account (guardrail Don't "create record in leads") — not this run, left in place.
- Key: NDC-3246 changed (card at once but placeholder text saved as the comment); NDC-3244/3254 changed (now "0 assigned to you" vs true 5/7); NDC-3245 still fails in CRM; N1-12 create card left out required First Name → RECORD_VALIDATION_FAILED; CRM Admin profile lacks Chat with Tia.
