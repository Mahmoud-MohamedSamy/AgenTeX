# Desk go-live retest — progress (updated 2 Nov 2026)

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
