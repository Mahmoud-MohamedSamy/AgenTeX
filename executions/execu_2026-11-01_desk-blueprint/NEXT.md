# Desk Blueprint — remaining work (handoff, updated 2 Nov 2026 after Phase 4)

Rules that still apply: QA records only ("QA BP " prefix, QA WF Dept R on Anyware / Customer Support on NDC-Staging), one sign-in per account per run (never two browser contexts from one saved session — it revokes every session), stop on 429, never print credential files, evidence images only for failed/differing rows (TAVI left, Zoho right), file to Plane only when the user asks (Bug state 34a7f4b6…, Desk module 274a73de-564a-4b8c-8b51-74fe8304e7c2, Sprint 14 98da7f80-718d-4209-b0f8-c7040640e0c0, label Blueprint abdc5684…, assignees MahmoudMohamed e1364b0b…, mfathy 82cf7a79…, Hegazy 9c2ff309…; attach with scripts/plane-attach.js).

## Done in Phase 4 (see report.md "Phase 4")
- C3 vs live Zoho: **differs** — Zoho refuses special characters ("Special characters are not allowed.") and caps the name at 60 chars (description 1000); TAVI accepts both. Image `evidence/annotated/BP-C3-name-rules-vs-zoho.png`. Not filed (ask the user).
- K14 same as Zoho docs (SLA freezes in On Hold, resumes recalculated).
- Agent rows on NDC-Staging: Pass A2, A3, A4, A5, A7, A8, D1, D2, D3, D4, D6, D7, E12, F3, J9; A6 record (`desk:ticket:blueprint_revoke` permission exists); F6 inconclusive; D5 not run; D8 blocked.

## 1. Zoho checks — DONE 2 Nov with the user's OK (C4 same, K15 same, K17 TAVI extra, L7 differs: Zoho resets Status to Open on move; C3 filed NDC-2780). Table kept for reference:
| Row | TAVI | Zoho check |
|---|---|---|
| C4 | duplicate name allowed | Save a QA draft named like "Default Blueprint" — refused? (Zoho does not check on the first step) |
| K15 / K17 | state timer keeps running in On Hold; reapply keeps the state | QA blueprint with a state SLA + one QA ticket; put it On Hold; look for reapply |
| L7 | move leaves the blueprint, status kept | Move the QA ticket to another department — refused, or leaves the blueprint (Zoho docs: moved ticket treated as new, automations erased) |
Zoho browser: scratchpad desk/bp-scripts/zserver2.js (Edge headed, port 8890; actions goto/click/text/type/fill/eval) + scratchpad zc.js (UTF-8 client). Clean up: delete the ticket and blueprint (ticket goes to the Recycle Bin; #101 is still there from 1 Nov).

## 2. Automation
- BlueprintScreenTest fixes applied 2 Nov (designer reload fallback, Tidy = "Tidy layout", time-limit = placeholder "No limit", step-button wait, SLA card poll) — see feature-map run history for the result.
- Port the NDC-Staging agent checks (scripts/ndc-agents-run.js, ndc-agents-run2.js, ndc-ui-agentA.js) to Java if the user wants them repeatable.

## 3. Re-measure / blocked
- N8 designer load time with 30 states (scripts/states.js + status-clean.js). Designer first load often hangs on staging; reload helps.
- F6: needs a readable mailbox or an outbound-email log.
- D5: needs OK to deactivate/remove a test agent. D8: needs 11 departments.
- Blocked until provided: customer mailbox (K3–K5), webhook receiver (F5/K12), safe custom action (F7/K13), IM channel (N10).

## Useful scripts (executions/execu_2026-11-01_desk-blueprint/scripts)
tv.js (Anyware API), ndc.js (NDC-Staging API, one cached sign-in per account), c3c4.js / c3-ui.js / evid-c3.js (C3/C4), ndc-agents-run.js / ndc-agents-run2.js / ndc-ui-agentA.js (agent rows), screen-probe.js (designer + Steps DOM), bh3.js, states.js / status-clean.js / c20c.js, make-run-report.js.
