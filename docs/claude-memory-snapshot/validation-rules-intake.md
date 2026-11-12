---
name: validation-rules-intake
description: "CRM + Desk Validation Rules vs Zoho, 12 Nov 2026: 174-case updatable sheet Dqx4bfePnFaL1DZUu5tS1u (db results/extra), gaps Z1–Z16; run 12 Nov done 142/174, 7 fail; nothing in Plane"
metadata:
  node_type: memory
  type: project
  originSessionId: 361ca2a9-d28a-437b-829c-83d205a906e9
  modified: 2026-11-12T14:38:36.989Z
---

12 Nov 2026, New-Feature-Testing skill. User: **no Plane until told; no execution until told**; wanted a simple business + technical explainer (in the sheet's "About the feature" tab).

The intake is read-only. Read executions/execu_2026-11-12_validation-rules/PROGRESS.md for the API, rule shape, field types and baseline.
- Case source: docs/validation-rules/cases.js. Run build-sheet.js, then republish the same file.
- Zoho inventory: docs/validation-rules/reference/zoho-validation-rules-inventory.md.
- Gaps confirmed in the build:
  - Z1: CRM lookup fields cannot be checked.
  - Z2: Desk checkbox fields cannot be checked.
  - Z3: Desk Status field cannot be checked, but NDC's real Zoho rule uses Status = Reject.
  - Z4: Desk lookup fields cannot be checked.
- Possible bug: the old Desk rule with no layout gets conditionError (case J7).
- Group R retests NDC-2646 and NDC-2536 first.
- Baseline rules to leave alone: CRM "QA LR1112 VR" (Layout Rules session) and Desk "QA NDC Reject needs a reason".

Function rules need a public HTTPS test receiver. The Zoho CRM test org ends 17 Nov. Related: [[layout-rules-intake]], [[crm-scoring-rules-intake]], [[tavi-extras-not-bugs]], [[one-owner-signin-per-run]].

**Run 12 Nov (done):** 142/174 written to the sheet (103 pass, 22 info, 7 fail, 9 blocked, 1 gap). Not filed in Plane (user: only when told).
- Fails: B2, E2, I1, J2, J6, J7, K3.
- Z1–Z4 are NOT gaps any more; the only gap is Z8.
- Leftover: 2 empty 'QA VR1112 Layout' layouts. They can't be deleted while the deleted records sit in the Recycle Bin, and I did not purge.
- Details: PROGRESS.md "Run 12 Nov".

13 Nov 2026: bin purged + both QA layouts deleted; the 32 not-run cases run → 174/174 (115 pass, 32 info, 11 fail, 15 blocked, 1 gap). New fails C7, H6, H7, M4. Review report https://claude.ai/artifact/AyvxnYYYDUTgjMspKZi2aR. Left: lead 39145329 "QA VR1112 G14" REVIEW_LOCKED. A7 needs user OK to touch the shared User profile. Cleanup tip: find leftovers with `records?layout_id=<QA layout>`; the sort params in `records?` are ignored. Still nothing in Plane.

13 Nov blocked rerun: G14/G18 FAIL (blueprint transition form skips rules). Waiting on user for A7 (permission grant refused by auto-mode classifier), F6/F7/F9/X5 (HTTPS receiver), G15/G16/X4 (Help Center CAPTCHA), A3/Desk H6 (Desk agent), G17 (user sends "QA VR1112 BADMAIL G17" to customer-support@help-staging.anyware.software; rule "QA VR1112 G17 subject" ACTIVE on Desk Standard layout — delete after). Staging bugs found: public web form session 404 for all forms; Leads Kanban 500.

13 Nov FILED in Plane (user asked): bugs NDC-3009..NDC-3020 (High: 3009 I1, 3010 H6+H7, 3011 G14, 3012 G18), gap NDC-3021 (Backlog). Sprint 16, assignees Mahmoud Mohamed/Hegazy/Eslam, label Modules & Fields, CRM/Desk modules, images attached. Final sheet 121 pass/31 info/13 fail/8 blocked/1 gap. G17 rule removed; Mahmoud Samy profile reverted to Desk Administrator. Still open: A7 (permission change refused by auto-mode classifier), G15/G16/X4 CAPTCHA, G12/Z6 web forms 404, G6 Kanban (NDC-2993), Z15.
