---
name: retest-ndc-2275-8nov
description: "NDC-2275 retest 8 Nov 2026 PARTIAL; RR on create fixed, NF-3 threshold race, import has no rules; posted and moved to Bug 9 Nov; cleaned 9 Nov"
metadata:
  node_type: memory
  type: project
  originSessionId: a17cf060-bd19-487d-b9db-8f4190183934
  modified: 2026-11-08T20:56:56.547Z
---

8 Nov 2026: NDC-2275 retest PARTIAL (25 pass, 1 fail, 1 decision). Folder `executions/execu_2026-11-08_retest-ndc2275/` (plane-draft.html/json, report.html, notes.md, ledger.md). 9 Nov: posted comment + image, moved to Bug (user approved). Cleaned 9 Nov (verified zero). 9 Nov Zoho import test (user approved, techsolutionsegypt): wizard has no rule option; imported tickets stay Unassigned, round robin not applied (control ticket assigned by same rule); TAVI gives them to the importer. Zoho data cleaned; 2 import history rows remain (no delete). User chose B (keep importer as owner) 9 Nov. Not yet in Plane.
- Fixed: round robin on create from form, API and real web form.
- FAIL NF-3: 20 simultaneous creates, one agent one over the threshold in 2 of 5 runs.
- DECISION GEN-13: Desk import has no rule picker; no-owner rows go to the importer even with automation ticked. Zoho import not compared (needs a file upload into Zoho, so ask first).
- Direct master switch was OFF as found (14:42 UTC, Mahmoud Mohamed, around the [[desk-automation-order]] baseline) and left OFF.

**Why:** the user approves all Plane writes and cleanup first. **How to apply:** clean by ledger id only after the user says so. Related: [[desk-assignment-skills-run]].

9 Nov: GEN-13 follow-up comment + image drafted (plane-draft-gen13.html/json, image NDC-2275-GEN13-import-vs-zoho.png), NOT posted, state stays Bug. I-12: Zoho docs/UI wording does not state cross-department scope; runtime check needs Zoho writes (ask). E-18 workaround proposed (naturally aged tickets: FormData.xlsx import 11 Oct).

9 Nov I-12 Zoho live test (user approved): Zoho threshold counts only Open tickets in the rule department (other-dept and On Hold ignored); TAVI counts all depts + On Hold -> differs. Zoho cleaned. Help-text-only comment for 2275 drafted (plane-draft-helptext.html), not posted.
9 Nov E-18: import cannot age tickets (no date fields mappable); aged ticket #1 test PASS (old ticket left in backlog, control assigned); #1 restored except Desk closed_at now 9 Nov. All E18 data cleaned.
9 Nov later: help-text comment POSTED on NDC-2275 (stays Bug). I-12 bug drafted (plane-draft-I12.html/json + image I12-threshold-counts-all-departments-vs-zoho.png), TAVI rerun #1758/#1759 confirms; not posted.
I-12 filed 9 Nov as NDC-2824 (file-i12.js; ids in out/plane-filed-I12.json).
9 Nov: E-18 Part B route 1 blocked: Desk outbound mail works, customer reply to customer-support@help-staging.anyware.software never arrived (Setup still says Mail is arriving). #1 restored. Email bug drafted (plane-draft-mail.html), not posted.
9 Nov: manual checklist manual-checklist-email-e18.html (EM-01..09, E18-01..04, cleanup) given to user; user will run it and send results (export JSON + screenshots); then investigate and report bugs. Email bug draft waits on EM-01/02/04.

10 Nov: ran manual-checklist-email-e18.html myself -> report-checklist-2026-11-10.html (5 PASS... S0/EM-03/EM-07/E18 PASS, EM-08 FAIL, mailbox cases BLOCKED). Ticket #2382 (c8590aab) kept open for user EM-05 reply; delete after. Owner headless session dies after ~45 min -> scripts must survive SIGNED_OUT in cleanup (e18-cl4.js recovery pattern). #1 closed_time drifted to 9 Nov once; recheck.
Update 10 Nov 11:11 UTC: EM-05 PASS, user reply reached #2382 (inbound works now, marked Unverified sender dkim_not_aligned). 9 Nov mail bug draft should NOT be filed as written. Report now 10 PASS/6 BLOCKED. E18-04 now runnable on request.

10 Nov 15:10 UTC checklist follow-up: TAVI-to-TAVI mail (tech@ -> customer-support@, both via SendGrid) is never received (silent drop, likely loop protection), so EM-04 cannot be run without a real outside mailbox; free temp mail can't send (mail.tm receive-only, Guerrilla needs captcha). EM-09 outbound PASS via mail.tm (arrives in 3 s, DKIM d=help-staging s1). #1 closed_time drift explained (close fills closed_time after a moment; restore must wait before PATCH). API-created tickets with `email` create no contact. Contacts module id 43004ce2-577f-4eda-b00a-0750fe40c3d4.
