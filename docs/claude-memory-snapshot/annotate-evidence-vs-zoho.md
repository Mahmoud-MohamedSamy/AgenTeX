---
name: annotate-evidence-vs-zoho
description: "Screenshot evidence only for FAILED test cases, each annotated side by side against Zoho CRM's behaviour"
metadata:
  node_type: memory
  type: feedback
  originSessionId: d33c9114-f581-4680-8ca0-3e003df6adb4
  modified: 2026-10-18T10:56:11.149Z
---

Evidence rules for TAVI CRM test runs (user, 4 Oct 2026):
1. **Only failed cases get screenshots.** "just take screenshots of the failed ones don't take evidence of the passed test cases." Passed cases get a verdict plus a short text note only — no screenshots, no annotated images.
2. Each failed case's screenshot is annotated **against Zoho**: TAVI panel(s) left, live Zoho panel(s) right, numbered boxes, a header with case id + verdict, and a table "Behaviour | Zoho | TAVI | Match" (Same as Zoho / Differs / Gap / TAVI extra / Not comparable). A TAVI-only annotation was rejected with "annotate it against zoho behavior".

**Why:** the feature is a Zoho clone, so evidence only matters for defects and relative to Zoho; screenshots of passes are noise.

**Exception for retests (user, 18 Oct 2026):** when retesting Ready For Test tickets, annotate EVERY retest, pass or fail ("take annotated screenshot evidence for every retest (whether if passes or fails)"); clean up created data once at the end of the round. See [[retest-ready-tickets-skill]].

**How to apply:** this overrides the browser-testing skill's "screenshot every passed and failed scenario". Capture Zoho live and read-only (see [[zoho-reference-capture]]); keep originals unannotated, write to `screenshots/annotated/<id>-vs-zoho.png`; never claim a Zoho behaviour that was inferred rather than seen — mark it "not checked". For a multi-image job, show the first image for approval before doing the rest.

**Layout rule (user, 26 Oct 2026):** the comparison text must line up with the screenshots — TAVI text under the TAVI (left) screenshot, Zoho text under the Zoho (right) screenshot, and each behaviour's box number is the same on both screenshots. Builder: executions/execu_2026-10-25_crm-golive-wave2/scripts/annotate-vs-zoho.js (rows stay [n, behaviour, zoho, tavi, match]). Approved sample: NDC-2386-retest.png.

**Retests too (user, 11 Nov 2026, r15):** "did you compare the failed and partial cases with zoho behavior and retested the expected behavior according to zoho desk behavior?" — every FAIL/PARTIAL retest must be checked live in Zoho (Desk or CRM) and its image made side by side vs Zoho BEFORE the Gate 2 draft. Never write "matches Zoho" in a comment unless seen live in this round.
