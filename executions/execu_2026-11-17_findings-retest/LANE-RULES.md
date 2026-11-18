# Findings retest, 17 Nov 2026 evening: lane rules

RUN = D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest
The list of findings with their ids, origin and lane is in RUN/FINDINGS.md. The original write-ups:
- Round 20 findings: RUN/new-findings-r20.html (text) and the r20 folder
  D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20
  (notes.md, ledger.md, tickets/NDC-<n>.txt, scripts/<lane>/ helpers, scripts/specs/NDC-<n>.json, bugs/*.md). Read them; never write into the r20 folder.
- Ticket access findings: D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/access/results.md (+ scripts/ac-*.js).
- CRM currency findings: D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho (scripts/make-specs.js, review.html, report.html).

## Owner session: shared, do not sign in the owner
- The owner session is scratchpad .../64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r18-o.json, refreshed ONLY by the keeper.js process that is already running. Never start another keeper, never run a login script for the owner, never save state onto r18-o.json.
- Use ONLY RUN/scripts/apiw.js (`APP=desk node apiw.js o x.js`, APP=crm for CRM) and RUN/scripts/ui.js (`node ui.js o x.js`) with who=o. Screenshots from ui.js land in RUN/screenshots/raw.
- "OWNER SESSION LOST" or "keeper not refreshing": stop and hand back at once.
- A second account (agent) may be signed in ONCE per lane with `node login-r12.js desk <username> <ABSOLUTE scratchpad path>` into your own state file (e.g. C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/f21-<lane>-<who>.json). Copy ui.js/apiw.js into RUN/scripts/<lane>/ and point the state path at your file if you need it. Delete your state file at the end.
- NDC-Staging only. Never print credential files or cells (lengths only), tokens, or /iam/auth traffic.

## Data and settings
- Prefix all data "QA RT21 <LANE>". Append every record/setting you create or change (id, what, end state) to RUN/ledger.md.
- Tenant or department-wide settings: create RUN/locks/<setting>.lock while you hold it, restore, verify, remove the lock.
- At the end of your lane: delete the tickets/records you created (then purge them from the Recycle Bin: GET /audit/recycle-bin/items?app_key=desk&q=QA%20RT21, POST /audit/recycle-bin/delete {ids}), delete or deactivate rules/blueprints you made (deactivate if delete is refused), restore every setting/agent/profile you changed, and verify.
- Never run or edit the real NDC booking custom actions. Never switch auto-archive on. Email: send only to the user's own inbox as in r20 LANE-RULES.md ("Round 19b additions"); never print the address.
- Zoho reference (only for findings whose write-up compares with Zoho): Zoho Desk = scratchpad .../64533306-.../scratchpad/r19-zd.json (load, never save back); Zoho CRM org946877290 = .../r18-z3.json (read-only copy). Edge only. Zoho data only with prefix QA RT21, delete after, log in RUN/ledger-zoho.md. Never claim a Zoho behaviour you did not see live today; say "not rechecked" otherwise.

## How to retest
- Read the original finding's steps, expected and actual. Re-run the steps; test behaviour, not presence. Repeat an ambiguous result once.
- Verdicts per finding: STILL FAILS (the defect is still there; say which step and value), FIXED (expected behaviour now seen), CHANGED (different from both; describe), NOT REPRODUCED (the original result could not be produced again; say what you tried), DECISION (works as designed, design differs from Zoho; give options), BLOCKED (why).
- TAVI doing the same as Zoho is not a bug; TAVI extras are not bugs.
- Evidence: one annotated image per finding. Raw in RUN/screenshots/raw/<id>-<k>-<slug>.png; spec RUN/scripts/specs/<id>.json in the format of D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/scripts/specs/NDC-3045.json with "date": "17 Nov 2026", "ticket": "<id> (NDC-xxxx if filed)", "verdict": your verdict, "out": "<id>-retest-<VERDICT-with-dashes>.png"; side-by-side with Zoho (annotate-vs-zoho.js) only when Zoho was seen live today. API-only checks: card RUN/scripts/cards/<id>-api-card.json rendered with scripts/apicard.js (format: r18 scripts/cards). Run `node annotate.js specs/<id>.json` from RUN/scripts and LOOK at the image.
- After each finding append ONE line to RUN/notes.md: `| <id> | VERDICT | details (what was done, values seen, times UTC) | evidence file |` and update RUN/progress-<lane>.md.

## Hand back
Table: Finding | Verdict | proof | evidence file. Then: data created and cleaned (with verification), settings/agents touched and restored, sign-ins used, anything new found (described, not filed). Nothing goes to Plane.
