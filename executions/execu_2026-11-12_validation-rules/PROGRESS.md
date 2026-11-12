# Validation Rules intake — 12 Nov 2026 (CRM + Desk vs Zoho)

Status: INTAKE DONE, waiting for the user's go. Nothing executed, nothing written to TAVI or Zoho, nothing in Plane (user: not until told).

Sheet: https://claude.ai/artifact/Dqx4bfePnFaL1DZUu5tS1u. The db holds `results/<caseId>` {status none|pass|fail|blocked|gap|info, notes, ref, at, by, byClaude} and `extra/U<n>` (cases the user adds). Write run results with ArtifactData (byClaude:true).
Source: docs/validation-rules/cases.js. Run `node build-sheet.js` to build validation-rules-test-sheet.html, then republish the same path.
Zoho inventory: docs/validation-rules/reference/zoho-validation-rules-inventory.md (CRM-1..75, DESK-1..56, 17 open questions).

## Build (bundle 12 Nov, read-only API)
- API: `/modules/{id}/validation-rules` GET/POST, `/{id}` GET/PUT (rowVersion)/DELETE, POST `/verify` {field,data,layoutId,recordId}, POST `/{id}/test-function` {data}. These return 404: /order, /stats, /usage, /export. Rule invalid → VALIDATION_RULE_INVALID.
- Rule: name, description, layoutId (CRM null = all layouts), departmentIds (Desk), primaryField, kind criteria|function, mode block|warn, fieldVerification, errorPlacement field|top, applyToHelpCenter, status active|disabled, branches[{when, check{op,field,value|children}, message{en,ar}, triggerOn match|noMatch}], function{url,timeoutMs 500–10000, secret}, conditionError, warnings.
- Record save: 400 RECORD_VALIDATION_FAILED details[{path,message,ruleId,placement}]. Warn mode returns RECORD_VALIDATION_WARNING, and the client resends with `confirmed_warnings:[ruleId]`.
- Desk: block only, no function, no field verification, needs one layout.
- Fields with `capabilities.canCreateValidationRule`:
  - Allowed: single_line, multi_line, email, phone, url, number, decimal, currency, percent, long_integer, date, date_time, some pick_list, multi_select, radio.
  - Not allowed: lookup, user, checkbox, status, auto_number, file/image, rich_text, subform, address.
- Baseline (out/baseline-*-1112.json): CRM Leads 1 rule "QA LR1112 VR" (the Layout Rules session owns it). Desk Tickets 1 rule "QA NDC Reject needs a reason" (3 Nov, no layout; the API gives conditionError "A Desk validation rule applies to one layout; choose it." → case J7). Leave both untouched.

## Helpers
scripts/run.sh <crm|desk> <step.js> (lib.js prepended, owner, lanes valid / validdesk, prefix QA VR1112).

## Old tickets
NDC-2646 (rules never applied), NDC-2536 (no rule on a pick list). Group R retests them first. NDC-1988 is the Desk phase-3 line. NDC-2535 is the work-plan row.

## Run 12 Nov (user: "start the execution, Zoho writes allowed in test orgs")
Result: 142/174 cases written to the sheet (103 pass, 22 info, 7 fail, 9 blocked, 1 gap); 32 not run. Merge: scripts/merge.js -> out/sheet-results.json -> ArtifactData batch (out/batch*.json). Nothing in Plane.
FAIL: B2 CRM list shows raw layout id on fresh load; E2 top message not scrolled into view; I1 editor stale save overwrites (no rowVersion use); J2 field used only in 'Applies when' deletable, rule left broken+Active; J6 layout delete leaves rule Active+orphan; J7 Desk old rule flagged "can't be applied (field changed)" but still enforced, wrong reason; K3 DELETE via other module 204 no-op.
Z1-Z4 are NOT gaps any more (editor + API allow lookup/checkbox/status). Only gap: Z8 (outside URL vs Deluge).
Differs from Zoho (info): D20 TAVI first-match vs Zoho all conditions; G3 Zoho blocks editing other fields of an old bad record, TAVI allows; G13 workflow update bypasses rule. TAVI stricter/safer: Z5, Z7, Z9, limits (25 conditions / 1000 chars vs 10 / 100).
Blocked: Help Center CAPTCHA (G15/G16/X4), no HTTPS receiver (F6/F7/F9/X5), Kanban fails to load (G6), no Desk Agent (A3). F10 possible SSRF (internal URLs accepted).
Cleanup: all QA VR1112 records (CRM 87, Desk 62 -> Recycle Bin, not purged), rules, fields, H4 layout rule, import (undone), Desk contact removed. LEFT: 2 empty layouts 'QA VR1112 Layout' (CRM 9f0069ec, Desk 40dced31) - delete refused while the deleted records sit in the bin (LAYOUT_HAS_RECORDS). Zoho: helper deleted all (ledger-zoho.md); a CRM custom field may sit in Zoho's deleted fields.

## Run 13 Nov (user: "purge the bin items and delete the layouts; run the 32 not run cases")
- Bin purged by exact id/label: run-1 items (CRM 88, Desk 69) + 8 live leftovers the first cleanup missed (s99 sort ignored; use `records?layout_id=` filter, s43-clean2.js). Both run-1 layouts deleted.
- 32 cases run on fresh setup. Sheet now 174/174: 115 pass, 32 info, 11 fail, 15 blocked, 1 gap (batch3.json written).
- New FAIL: H6/H7 (CRM User blocked by rule on a field read-only/hidden for its profile; Zoho skips), C7 (deleted Desk department shows raw id, no warning), M4 (no aria-invalid/describedby/alert on refused save; Desk focus goes to Subject).
- Info: G22 merge bypasses rules (both apps), B9 server never returns warnings, N3 CRM rule create ~2 s each, X2 audit doesn't log confirmed warnings, D26/Z13 no relative dates, Z10 no prompt on Desk field removal.
- Blocked: A7 (shared profile permission change refused by safety check; needs user OK), G12/Z6 (no CRM web form + CAPTCHA), G14 (Leads blueprint belongs to another team, didn't attach), G17 (email-to-ticket), Z15 (no mobile app), Desk H6 (no low Desk user).
- Cleanup 13 Nov: everything removed and purged by exact id (incl. C7 dept, run-1 Desk contact, G13 workflow rule, convert-created account/contact/subscription). LEFT: lead "QA VR1112 G14" 39145329-a6e2-44c6-bd18-ded1ea892781 on default layout, REVIEW_LOCKED (under review) - cannot delete until the review is closed.
- Report republished: https://claude.ai/artifact/AyvxnYYYDUTgjMspKZi2aR (scripts/build-report.js). Nothing in Plane.

## Blocked rerun 13 Nov (user: "run the blocked cases and tell me if you need my help")
- Now 174/174: 115 pass, 31 info, 13 fail, 14 blocked, 1 gap. New FAIL: G14 (CRM) + G18 (Desk) - value typed in a blueprint transition form skips validation rules (QA blueprint built on QA layout; Desk payload {expected_state_id, fields:{...}}).
- Still blocked, need user: A7 (permission change refused by safety check twice), F6/F7/F9/X5 (HTTPS receiver; could use a public receiver only with user OK), G15/G16/X4 (Help Center CAPTCHA), A3 + Desk H6 (Desk agent account), G17 (TAVI can't send mail as owner: "No Zoho account found for sender"; user to send email "QA VR1112 BADMAIL G17" to the Customer Support hosted address; rule "QA VR1112 G17 subject" kept ACTIVE on Desk Standard layout, Customer Support).
- Still blocked by staging bugs (file?): G12/Z6 public web form session POST 404 for every form (incl. Customer Support Webform) - NDC-2732 regression?; G6 Leads Kanban records?filters=lead_status 500.
- Cleanup done: web form, both QA blueprints, rules (except G17), records purged by exact id, layouts, fields, Desk contact. Lead 39145329 (G14 first attempt) still REVIEW_LOCKED.

## Function rules via webhook.site (13 Nov, user: "use webhook.site for the function rules")
- F6, F7, F9, X5 PASS (F8 rechecked live). Now 119 pass, 31 info, 13 fail, 10 blocked, 1 gap.
- Contract: function must answer {status:'error'|'success', message}; anything else -> VALIDATION_FUNCTION_UNAVAILABLE "We couldn't verify … right now".
- Request: {ruleId, moduleKey, field, value, record, recordId, operation}; header x-anyware-signature = sha256=HMAC(body, secret) (verified). No layout id; no timestamp (replay risk) -> info.
- webhook.site token deleted after X5 (offline test). CRM test data cleaned and purged. Only G17 rule left active (Desk).

## User help round (13 Nov)
- G17 PASS: user's email -> ticket #3390 created (channel email) despite active subject rule; rule + ticket removed and purged.
- A7: still refused by the auto-mode safety check even after user said "go ahead" -> stays BLOCKED; user must add a Bash allow rule or test by hand.
- A3 PASS + Desk H6/H7 FAIL: test user Mahmoud Samy (d23fb4e0…) switched Desk Administrator -> Desk Agent (POST /iam/users/{id}/profiles {profile_id, replace:true, scope_id: orgUnitId}), tested, REVERTED (now "User, Desk Administrator").
- Now 121 pass, 31 info, 13 fail, 8 blocked, 1 gap. Desk data cleaned; bin purged.

## Plane filing 13 Nov (user: "file the bugs in plane")
- Bugs NDC-3009 (I1 High), 3010 (H6+H7 High), 3011 (G14 High, CRM), 3012 (G18 High, Desk), 3013 (J7), 3014 (J2), 3015 (J6), 3016 (C7), 3017 (E2), 3018 (M4, + Accessibility label), 3019 (B2 Low), 3020 (K3 Low). Gap ticket NDC-3021 (Backlog, Z8/Z13/D20/Z10 + could-not-check + possible bugs F10/G22/F9).
- State Bug, Sprint 16, assignees Mahmoud Mohamed/Hegazy/Eslam, label Modules & Fields (+Blueprint on 3011/3012), modules CRM/Desk per app; images attached. Script scripts/file-plane.js + plane-items.js; ids in out/plane-filed.json.
- Not filed (exist): Kanban NDC-2993; web form public session 404 belongs to NDC-2732 area (user chose no comment).
