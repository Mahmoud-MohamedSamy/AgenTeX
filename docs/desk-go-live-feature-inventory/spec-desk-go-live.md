# TAVI Desk — go-live retest spec (all of Desk vs Zoho Desk Enterprise)

Started 1 Nov 2026 (skill `new-feature-testing`, scope "all of Desk in waves"). This spec is the entry point for every
go-live wave. It does not repeat the cases; each wave keeps its own case file (linked below). Progress and every Plane
item filed so far: `executions/execu_2026-11-01_desk-golive/PROGRESS.md`.

## 0 How to run

- **Tenant: NDC-Staging only** (company "Wonder Travel", staging-desk.taviportal.com). Anyware-Staging is **paused**
  (user, 2 Nov 2026: "test everything on NDC-Staging, leave Anyware-Staging completely for now"). Never sign in to it.
- **Order:** Wave 1 → 2 → 3 → 4 → 5, one wave at a time. Each wave: write `waveN/cases.md` (full-feature, from the screen's
  locale strings + live API + Zoho inventory — memory `retest-means-full-feature`) → **Gate 1** (user OK) → run →
  Zoho check for failures → report → **Gate 2** (user reviews the report and images) → Plane only after approval.
- **Serial rules:** tenant-wide settings (ticket statuses, numbering, business hours, notification rules, SLA, archiving)
  are changed only in a short serial window and set back at once with a GET diff. Never run two lanes on the same account.
  Never run the TAVI browser and the Zoho browser at the same time.
- **Test-data prefix:** `QA GL N ` (NDC Wave 1 reruns) and `QA GL W<n> ` per wave (e.g. `QA GL W2 `). Test tickets go in a
  QA department or Tech, never on other people's tickets. Emails/replies only to mmohamed@anyware.software and
  mahmoud.mmohamedsamy@gmail.com.
- **Scripts** (`executions/execu_2026-11-01_desk-golive/scripts/`, Git Bash with `export MSYS_NO_PATHCONV=1`, D:/ paths):
  `login-org.js` (sign in any account: `CREDS=<scratchpad>/creds.json WHO=<email> ORG=x node login-org.js <state.json>`),
  `open.sh` (`STATE=<short> bash open.sh <session>` loads a saved state into a playwright-cli session), `run.sh`
  (`SESSION=<s> bash run.sh <snippet.js> [out.json]` — runs prelude.js + snippet, strips cookies/tokens), `get.sh`
  (`SESSION=<s> bash get.sh <out.json> <path>…` GET snapshot), `login-zoho.js` + `zserver.js` + `z.sh` (Zoho Desk, headed
  Edge, read-only), `annotate-vs-zoho.js` (spec JSON in `evidence/specs/` → `evidence/annotated/*.png`),
  `make-wave-report.js` (`node make-wave-report.js waveN waveN/report-data.js waveN/report.html`), `plane-attach.js`
  (`node plane-attach.js <workItemUUID> <png>`; key from Downloads, never printed).
- **Sign-in:** one sign-in per account per run (memory `one-owner-signin-per-run`); on SIGNED_OUT re-login once; stop on
  429. Credentials live only in the session scratchpad `creds.json` (copied from `docs/Credentials/TAVI Desk Credentials.csv`);
  never print them. Run outputs that echo cookies are filtered by run.sh.
- **Evidence:** screenshots only for failed cases, annotated TAVI (left) vs Zoho (right) with matching box numbers
  (memory `annotate-evidence-vs-zoho`); every retest of a Ready For Test ticket gets an annotated image, pass or fail.
  Never write a Zoho behaviour that was not seen — say "not checked". Check each raw screenshot really shows the defect.
- **Plane fields agreed with the user:** assignees MahmoudMohamed + mfathy + Hegazy + eahmed; bugs state **Bug**; priority
  as rated; module **Desk**; current open sprint; start date = filing day; a matching existing label. **Nothing is filed,
  commented or moved without the user's review first.**

## 1 Preconditions

- **Accounts (NDC-Staging):** owner `ndc-staging-owner@anyware.software`; admins `mahmoud.mahamed1515@gmail.com`,
  `mahmoud.mmohamedsamy@gmail.com`; Desk Agent `fedelav803@meinvr.com` (Customer Support); Desk Supervisor
  `pacox68754@meinvr.com` (Tech); Desk Administrators `kinase5517`, `pobit51574`, `belopoy720@meinvr.com`. No seat limit.
- **Ids:** tickets module `88e8ea44-1658-4df3-9930-d0902b91073d`, contacts `43004ce2…`, accounts `784400e1…`; departments
  Customer Support (default), HR, Marketing, Sales, Tech; teams Customer Experience Specialists, Dev, QA.
- **Baselines:** `executions/…/ndc/baseline/core.json` (company, departments, teams, users, BH, holidays, statuses, modules).
  Each wave takes its own baseline first and ends with an `after/diff.txt`.
- **Blockers / known noise:** other people change this tenant (CRM roles/profiles of test users, org units). The
  company time zone sometimes reads back as UTC (NDC-2779) — compare stored values twice before calling a diff.
  `/iam/users` stops at 200 rows. Zoho trial org cannot save departments.
- **Cannot be deleted once created:** Recycle Bin "delete forever" was broken for Desk items (NDC-2248; worked once on
  2 Nov) — deleted QA tickets may stay in the bin.

## 2 Surface and contract

- Feature inventory (131 rows, status, evidence, open Plane items, wave): `desk-go-live-feature-inventory.md` / `.html`
  (source `matrix-data.js`, `node build.js`).
- Missing + partly list (36): `desk-missing-and-partly.md` / `.html` (`node build-gaps.js`).
- Reference: `reference/zoho-desk-inventory.md` (2,491 Zoho items, ids ZT/ZR/ZC/ZA/ZK/ZH/ZN/ZU/ZY/ZD/ZO/ZG/ZL/ZX/ZE/ZB/ZI/ZV/ZW/ZZ/ZM),
  `reference/plane-desk-items.md` (353 Desk module items), `reference/tavi-desk-settings-menu-2026-11-01.txt`,
  `reference/zoho-desk-setup-menu-2026-11-01.txt`. Screen strings: bundle locales `desk.json`, `desk-tickets.json`,
  `settings.json`, `iam.json`, `audit.json`, `community-*.json`, `reporting*.json`.

## Groups (= waves)

### Wave 1 — Organisation & access (rows O-01..O-05, A-01..A-09, Q-04) — **DONE 2 Nov 2026**
- Cases: `executions/…/wave1/cases.md` (W1-01..W1-62, Anyware run 1–2 Nov) + `executions/…/ndc/cases.md` (rerun of the open
  cases on NDC-Staging). Results: `wave1/results.md`, `ndc/results.md`. Report: `wave1/report.html`.
- Final: Anyware 47 pass / 5 fail / 5 inconclusive / 5 not run; every inconclusive / not-run case rerun on NDC and passed.
- Bugs: **NDC-2776** (W1-B1), **NDC-2777** (W1-B2), **NDC-2778** (W1-B3), **NDC-2779** (W1-B4). Retests to Done:
  **NDC-2303**, **NDC-2387**. NDC-2305 passes (was In Progress, not moved).

### Wave 2 — Ticket daily work (rows T-01..T-40 in wave 2, Q-03) — **paused, draft only**
- Draft cases: `executions/…/wave2/cases.md` (83 W2 cases, written for Anyware ids). Partial raw output in `wave2/raw/`
  (Anyware, 2 Nov; no verdicts). Rewrite for NDC ids before running; agent-only cases now run (agents exist).
- Reuse: `docs/desk-ticket-replies/spec-desk-ticket-replies.md` (replies), memory `desk-activities-replies-intake`.
- Must settle: T-18 Clone ticket, T-11 KB suggestions, T-38 AI panel (Not confirmed / Partly).

### Wave 3 — Automation (U-01..U-10, U-12, U-13, U-15, U-16) — not started
- Reuse specs: `docs/desk-assignment-rules/spec-desk-assignment-rules.md`, `docs/desk-workflow-rules/spec-desk-workflow-rules.md`,
  `docs/desk-blueprint/spec-desk-blueprint.md`. SLA gaps already in NDC-2266.

### Wave 4 — Channels & self service (O-08, T-37, N-01..N-10) — not started
- Email channel, providers, templates, web forms (NDC-2751/2732), Help Center (NDC-1990), Community, KB (confirm N-09),
  Customer Happiness.

### Wave 5 — Customers, activities, insight, data, customization, integrations (O-06, A-11, A-12, U-14, C-01..C-06, I-01..I-04, D-01..D-08, X-01..X-06, G-01..G-03, G-06, Q-01, Q-02, Q-05) — not started
- Reuse: `docs/desk-activity-lifecycle/spec-desk-activity-lifecycle.md`, `docs/desk-modules-fields/spec-desk-modules-fields.md`.
- Must settle: I-02 Reports, I-03 Dashboards (Analytics stuck "Loading your departments…"), G-03 API Integration link,
  Q-05 performance (run exclusively).

## E2E journeys (run at the end of Wave 4/5)
1. Customer emails → ticket in the right department → assignment rule → SLA clock → agent replies → customer replies →
   workflow → close → happiness rating → shows on contact and in reports.
2. Web form / Help Center submission → ticket → blueprint transitions → closed.
3. Agent permission journey: department-scoped agent sees only its tickets; shared ticket at Read-only cannot be edited.
4. Negative recovery: failed reply (rejected address) → error shown, nothing marked sent → corrected → sent.

## Group Z — gaps (not tested for function; checked only to confirm still missing)
- Missing (14) filed as **NDC-2760**: Gamescope, agent sign-in security, privacy settings, ticket translation, read receipts,
  supervisor rules, schedules, phone channel, IM channels, guided conversations, ASAP, help center SSO, custom buttons,
  developer space. Left out on purpose: I-05 mobile apps, G-04 marketplace.
- Partly (20): see `desk-missing-and-partly.md`; covered by their own tickets; not filed as one list.

## Traceability
Inventory row → wave → case ids: the `Row` column of each `waveN/cases.md` names the inventory row (e.g. W1-27 → O-05).
Every row with wave 1 has at least one W1 case. Waves 2–5 must keep the same rule: no row in the wave without a case.

## Reporting
- Per wave: `waveN/results.md` (Id | Verdict | Note), `waveN/report-data.js` → `waveN/report.html` → published artifact.
- Report token *lengths*, never values. Restate coverage gaps (inconclusive / not run + why + what unblocks it).
- Prove the revert with the final GET diff against the wave baseline; list changes made by others separately.
