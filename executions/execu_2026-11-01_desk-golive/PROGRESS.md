# Desk go-live retest — progress (updated 2 Nov 2026)

- 13 Nov ~01:15: PAUSED by user during Wave 5 (other session paused too; owner re-signed once). Last step running: create report "QA GL W5 report" (w5-r1.js -> wave5/raw/r1.json; if it created a report, add its id to wave5/after/created.jsonl). Resume at W5-26 (report builder), then W5-27.. . Results so far wave5/results-data.js.

- 13 Nov 01:00: Wave 5 RUNNING, PAUSED at W5-24: owner session revoked (3rd time tonight) and B saved session also signed out — another session signs in on the same accounts. Results so far wave5/results-data.js (W5-01..23 + 33). Created: wave5/after/created.jsonl (contacts, accounts, contracts, ticket #3403, task/call/event, view). Candidate: contract end<start accepted (W5-17). Asked user how to proceed.

- 13 Nov 00:45: Wave 5 STARTED. Owner re-signed once. Probe wave5/raw/probe*.json, links*.json (read only). 78 cases in wave5/cases.md -> waiting Gate 1. Runner scripts/w5run.sh (outputs wave5/raw, created -> wave5/after/created.jsonl). Analytics now loads (I-02/I-03 improved); hub lacks Languages, Privacy, Buttons, Developer space, Marketplace.

- 13 Nov 00:20: Wave 4 FILED NDC-3000..3008 (D8,D5,D1,D9,D3,D4,D6,D7,D2) by a parallel session at 00:07-00:11 with scripts/file-w4-bugs.js + evidence/annotated/W4-D*.png; verified in Plane (Bug, Desk, Sprint 15, 4 assignees, image each). Not refiled. Wave 4 CLOSED. Next: Wave 5, then Wave 3, then C10 reminder.

- 13 Nov ~00:45: USER APPROVED Gate 2 in the automation-order session ("file the wave 4 bugs"). That session files all nine D1–D9 (D7 confirmed in Zoho) → wave4/plane-filed.json. DO NOT FILE AGAIN; read that file.
- 13 Nov 00:55: FILED Wave 4 (user approval): D8 NDC-3000 (High), D5 NDC-3001 (High), D1 NDC-3002, D9 NDC-3003, D3 NDC-3004, D4 NDC-3005, D6 NDC-3006, D7 NDC-3007 (Medium), D2 NDC-3008 (Low). Bug, Desk, Sprint 15, Wave-2 assignees, labels by area, one annotated image each (evidence/annotated/W4-D*.png, specs evidence/specs/w4). Filed by the automation-order session (scripts/file-w4-bugs.js). Next: Wave 5.
- 13 Nov 00:15: D7 Zoho check done (user OK for write): Zoho Question topic auto-creates linked ticket #190; topic + ticket deleted and purged (Zoho bin: only #190; community bin: only our topic). W4-58 FAIL, D7 bug Medium. Counts 64/10/3/6. Report republished.

- 13 Nov 00:00: Wave 4 DONE, at Gate 2. Report wave4/report.html -> https://claude.ai/artifact/U7tsE7qvvFYMVHzp69JUHP (built by make-wave-report.js from wave4/results.md + report-data.js). 64/9/4/6. Candidates D1-D9 (D7 question). Cleanup done (w4-clean*.js), left: reply-ack template 0f472a78 (D9, undeletable), community cat c857d003 (disabled), 2 retired domains. Help Center access mode changed by another owner session (not ours). Owner session got revoked again (another session signs in as owner) - did not re-sign. Next after Gate 2: Plane filing on approval, then Wave 5, then Wave 3, then C10 reminder.

- 12 Nov 23:20: W4-04/05 pass (threads OK). User got NO auto mails (new-ticket ack + Marketing reply ack) -> D8 candidate (Plane search: none). Happiness found OFF; turned on for Marketing <1 min, #3280 reopened+closed, restored OFF (verified, needs row_version). Waiting: rating mail?

- 12 Nov 23:00: user mails in: #3278 (CS), #3279 Arabic (only images.png of 3 attachments - asked user), #3280 (Marketing via qa-gl-w4@). Template replies sent on #3280 (Arabic + English, placeholders OK). Plain reply on #3278 for From check. Arabic topic posted by user. 61 pass/7 fail/5 check/10 todo. Next: user From + replies, then close #3280 for rating.

- 12 Nov 22:20: Wave 4 portal cases done with the customer account (creds key "portal" in scratchpad; customer lane = scripts/portal.js <step.js> <out>, state-portal.json). #3277 portal ticket (Marketing) + agent reply + private note + customer reply; W4-43..46, 54, 55, 57, 60 pass; W4-59 needs user (topic post has CAPTCHA). Owner re-signed (WHO=ndc-staging-owner@anyware.software, HEADED=1 in login-org.js). Counts 57 pass / 7 fail / 5 check / 14 todo. Emails still not arrived. Progress page v18.

**Live progress page (user's view, 12 Nov):** https://claude.ai/artifact/MyFo9qgEFyP9rVeZAUvi2o — source `progress.html`
(data lists WAVES / CASES / CANDS at the bottom). Update it and republish the same file after every step.
Wave 2 resumed 12 Nov with fresh tickets #3105–#3120 (wave2/raw-ndc/r-*.json, scripts/r-*.js): 70 pass, 13 candidates, 1 open (W2-19), 1 blocked (W2-40).
Zoho checked 12 Nov (screens read-only + docs, evidence/zoho-w2/): Zoho differs C4 C6 C7 C13(=W2-19); broken alone C1 C5; C2 confirmed by live Zoho write (ticket 183 deleted, left in Zoho bin); C10 untestable (one admin account); C11 waits on user checking mmohamed@ inbox for "Re: QA GL W2 r email signature"; withdrawn C3 C12 C8 C9. W2-40 blocked: user to email customer-support@help-staging.anyware.software from mmohamed@ subject "QA GL W2 split test". Zoho server: node scripts/zserver.js state-zoho.json (port 8891).
C11 resend 12 Nov 15:16 Cairo: staging back after ~13:30-15:00 outage; reply "Re: QA GL W2 r mkt owner A" on #3119 sent to mmohamed@ (review draft eabd8e2d approved by owner; script clicked "Send for review" by mistake — /^Send/ matches it). Stored body has no signature (regex hit my own text). Signature deleted after. Waiting on user inbox check.
C11 15:16 email (user paste): ends with company block (Wonder Travel, phone, address, website, owner name+email, "Organization") but NOT "QA GL W2 signature line" -> personal signature not used; asked user to check 12:05 email. W2-40: user sent split email ~15:25; not in TAVI after polling 15:30-15:34 (no new ticket, Spam Tickets only #2894, not threaded into #3105-#3120); asked about bounce.
W2-40 12 Nov: user email arrived as #3159 (47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5, Customer Support, inbound 5a81c313) at 15:39 Cairo. Split = POST /desk/tickets/{id}/replies/{rid}/split. Opening msg -> 409 REPLY_IS_OPENING_MESSAGE; outbound -> 409 REPLY_NOT_SPLITTABLE (both like Zoho). Message menu has no Split item for the opening message. Sent reply 909bacc1 at 15:41 asking user to answer; then split that inbound. #3159 must be cleaned up.
W2-40 PASS 12 Nov 15:49: user reply 26bffe17 split on screen ("Conversation entry actions" menu -> "Split as New Ticket" -> dialog Subject optional -> Split) into #3166 (0b337d8e-0f37-4170-bfb9-1ea70281d6c7), same dept/contact; menu offers Split only on later inbound. #3159 + #3166 soft-deleted (204, in Recycle Bin; purge by exact id+label in final cleanup). Owner session revoked once more by another sign-in (re-login). Reply showed "Unverified sender" label (2nd email from same address) - note only. Wave 2 now 85/85: 72 pass, 13 fail.
Filed 12 Nov (user: all except C10): NDC-2947 C5 High, 2949 C2, 2950 C4, 2952 C6, 2954 C11, 2956 C13 (Medium), 2957 C1, 2960 C7 (Low); Bug, 4 assignees, Desk module, Sprint 15, labels AI Features/Tickets/Email Channel/Templates & Workflow. Ids wave2/plane-filed.json. Images to attach when the image helper finishes (scripts/plane-attach.js). C10: user wants live Zoho check.
12 Nov ~16:05: images attached to 7 tickets (not NDC-2954). C11 likely by design: GET /mail/signature -> company signature enabled+required (updated 7 Sep by owner); asked user cancel vs retest with required off. Cleanup DONE: all W2 tickets incl #3167 deleted+purged (email tickets have bin label = contact email, purge by exact record_id), macro f723e149, view 7bc907e3, template, snippets 4e152318+f642b176 deleted; final check zero QA GL W2. Not ours: ticket-access public_scope now "departments" (baseline organization). Waiting: C10 Zoho live (2 agent emails + OK for Private sharing).
**REMINDER (user, 12 Nov): C10 skipped for now — remind the user about the C10 live Zoho check right after Wave 3 is finished.** (needs 2 Zoho agent emails + OK for Private ticket sharing ~30 min)
Wave 2 CLOSED 12 Nov. NDC-2954: user said "ignore" — leave it as filed, no action, no image. Next: Wave 3 (automation) cases -> Gate 1.
Wave 3 DEFERRED 12 Nov (user agreed): another session runs the Desk automation order on NDC; do Wave 3 last (after Wave 5), reuse that session's results, test only uncovered U rows; C10 reminder still after Wave 3. Wave 4 STARTED 12 Nov: read-only probe wave4/raw/probe*.json (owner re-signed in once); 83 cases in wave4/cases.md (W4-01..W4-83) -> waiting Gate 1. Live: KB empty, Happiness OFF, Help widgets page exists (N-16 listed Missing), web forms 3/5 (one is another tester's QA AS6). Scripts scripts/w4-*.js; run with run.sh + absolute out path.
W4 RUN 12 Nov ~16:40-18:15 Cairo: 50 pass, 7 fail, 7 check, 19 not run (wave4/results-data.js -> node scripts/make-progress-w4.js -> publish progress.html). Candidates D1 domains, D2 wildcard block, D3 disabled form blank, D4 Arabic form LTR, D5 KB translation typing reversed, D6 KB gallery empty, D7 no topic->ticket (Zoho check). Waiting user: 3 emails (none arrived), portal sign-up/ticket/topic (CAPTCHA). Happiness was turned ON (all depts) by another session after our baseline - do NOT restore to off; spam policy untouched. Cleanup list wave4/after/created.jsonl + reply-ack template active for Marketing (deactivate), address qa-gl-w4@, form uses 5th slot, retired junk domains stay. Runner scripts/w4run.sh (prelude+w4-lib+w4-lib2, try/catch, scrub); leave-page prompts abort run-code -> avoid navigating away from dirty pages.

Spec: `docs/desk-go-live-feature-inventory/spec-desk-go-live.md` · Inventory: https://claude.ai/artifact/WhGLBEnM96aMy7NBf98yF4 ·
Missing + partly: https://claude.ai/artifact/Ek3WG4cnizUKRHgHkR4VrM · Wave 1 report: https://claude.ai/artifact/TqBi5o3ZRsWA52qAFdDj1f
(source `wave1/report.html` — rebuilt 2 Nov with the filed ids; republish the same file to update the link).

## Status per wave
| Wave | Scope | Status |
|---|---|---|
| 1 Organisation & access | O-01..O-05, A-01..A-09, Q-04 | **Done.** Anyware 1–2 Nov: 62 cases, 47 pass / 5 fail / 5 inconclusive / 5 not run. Every open case rerun on NDC-Staging 2 Nov: all pass. 4 bugs filed, 2 retests moved to Done. |
| 2 Ticket daily work | T-01..T-40 (wave 2), Q-03 | **Running — paused by the user 2 Nov ~14:20.** Gate 1 approved (all 85 in `wave2/cases-ndc.md`; dept Marketing, agents B mahmoud.mahamed1515@ + C fedelav803@). Raw output `wave2/raw-ndc/` (a, b, c, d, e, e2, f, nu1–nu5, b1); scripts `scripts/nd-*.js`, `nu-*.js`, `nb-1.js` run through `scripts/ndrun.sh` (SESSION=ndc owner / agb / agc); ids `wave2/raw-ndc/ids.json`; created objects `wave2/after/created-ndc.jsonl`; baseline `wave2/ndc-baseline/before.json`. **Still to do:** B rejects approval "QA GL W2 approval reject 2"; B rejects the email-ticket review draft (B could not see it — check); mention notification through the screen (W2-74); agent C cases (W2-37, 76, 77, 85); delete forever (W2-45); Zoho checks; results.md; cleanup + diff. **Candidates so far:** History "Followers was updated" shows a raw user-id array; an existing reply draft pre-fills the comment editor (Shift+C / comment icon); an approval can name an approver outside the department (agent C); an Open ticket can be archived and then drops out of All Tickets; AI summary/triage/translate return 404 ("Something went wrong"); moving to Sales cleared the owner. **Test data still live:** QA GL W2 tickets #781–#793 (Marketing) + #794 (Customer Support, screen create), macro, template, snippet, tag, view, 2 pending approvals, 2 pending review drafts. |
| 3 Automation | U-* | Not started |
| 4 Channels & self service | N-*, O-08, T-37 | Not started |
| 5 Customers, data, insight, customization, integrations | C-*, I-*, D-*, X-*, G-*, Q-* | Not started |

## Filed in Plane during this run
- **NDC-2760** — Desk go-live: features Zoho Desk has that Desk is missing (14 Missing items; Backlog, High; 2 Nov).
- **NDC-2776** — W1-B1 Company profile | long phone → "An unexpected error occurred", no length limit (Bug, Low).
- **NDC-2777** — W1-B2 Departments | stale save undoes another admin's change (Bug, Medium).
- **NDC-2778** — W1-B3 Agents | inviting an active user's email creates a second pending user (Bug, Medium).
- **NDC-2779** — W1-B4 Audit Log | company save logs "time zone blank → UTC" though unchanged (Bug, Low).
- All four bugs: MahmoudMohamed + mfathy + Hegazy + eahmed, module Desk, Sprint 14, annotated TAVI-vs-Zoho image attached.
- **NDC-2303** and **NDC-2387** → Done (retest comment + annotated image, 2 Nov).

## Open decisions / waiting
- NDC-2305 passes (Anyware, 1 Nov) — comment + move when it reaches Ready For Test.
- Wave 2 restarts on NDC-Staging once the user says go (Gate 1 on the rewritten case list).

## Tenant notes (NDC-Staging = "Wonder Travel")
- Owner `ndc-staging-owner@anyware.software` (no org picker). Agents/admins listed in the spec §1. Credentials: session
  scratchpad `creds.json` (from `docs/Credentials/TAVI Desk Credentials.csv`) — never print.
- Ids: tickets module `88e8ea44-1658-4df3-9930-d0902b91073d`; departments Customer Support*, HR, Marketing, Sales, Tech
  (Tech `19510fdc-91f3-4a7a-8888-153f1318b765`); Desk Agent profile `44444444-4444-4444-4444-444444444402`;
  teamspace `a641f1df-f2c6-450e-a881-857776dacf70`.
- Traps: company profile PUT replaces the whole record (send the full object); role calls need `?app_key=desk`
  (without it a user move returns 204 and does nothing); `/iam/users` stops at 200 rows and ignores paging; company
  time zone sometimes reads UTC/v0 (NDC-2779); other people change CRM roles/profiles on NDC (e.g. 09:45 on 2 Nov);
  owner session is shared and gets signed out — re-login once; staging pages need 10–25 s.
- Zoho Desk reference: login **hmohammed@anyware.software** (double m), org techsolutionsegypt (Enterprise trial), headed
  Edge only; department saves fail in the trial; Company phone maxlength 20; company edits are not in Zoho's Audit Log;
  dismiss the "Desktop Notification" popup (Not Now) before clicking header buttons.
- Anyware-Staging (paused): another tester's "QA BP" run left ~30 "QA BP …" ticket statuses there (not ours).

## How to run (scripts/)
- `CREDS=<scratchpad>/creds.json WHO=<email> ORG=x node scripts/login-org.js <scratchpad>/state-<short>.json` — sign in.
- `STATE=<short> bash scripts/open.sh <session>` — open Edge session with that state (owner: `STATE=ndcowner … ndc`).
- `SESSION=ndc bash scripts/run.sh <snippet.js> [out.json]` — run prelude.js + snippet (helpers api(), go(), txt(), shot()).
- `SESSION=ndc bash scripts/get.sh <out.json> <path>…` — GET snapshot.
- `node scripts/zserver.js <scratchpad>/state-zoho.json` (background) + `bash scripts/z.sh <file.js>` — Zoho read-only.
- `node scripts/annotate-vs-zoho.js evidence/specs/<id>.json` — annotated image.
- `node scripts/make-wave-report.js waveN waveN/report-data.js waveN/report.html` — wave report.
- `node scripts/plane-attach.js <workItemUUID> <png>` — attach to Plane.

## Next
Start Wave 2 on NDC-Staging: rewrite `wave2/cases.md` for NDC ids (tickets module 88e8ea44…, departments Customer
Support/HR/Marketing/Sales/Tech, prefix `QA GL W2 `); agents are available, so the agent-only cases (collision,
notifications to another agent, department-scoped visibility, permission-hidden buttons, approvals/review by a second
user) run too. Settle T-18 Clone, T-11 KB suggestions, T-38 AI panel. Gate 1 with the user before running.

## After /clear or a new session
- The session scratchpad (creds.json, saved browser states) is gone in a new session. Rebuild creds.json in the NEW scratchpad without printing anything: TAVI accounts from `docs/Credentials/TAVI Desk Credentials.csv` (columns name,username,password; key each entry by username, plus `tavi` = the Anyware owner only if Anyware is resumed). Zoho Desk entry `zoho` = user **hmohammed@anyware.software** with the password from row 1 of `docs/Credentials/Zoho Desk Credentials.csv` (same password, different email). Then `node scripts/login-org.js` (WHO=ndc-staging-owner@anyware.software, see above) and `STATE=ndcowner bash scripts/open.sh ndc`.
- Update the scratchpad path inside scripts/open.sh, scripts/login-*.js callers and scripts/run.sh if they hard-code the old one.
