// One-off: add the NDC-Staging rerun to wave1/results.md and wave1/report-data.js (2 Nov 2026).
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const resF = path.join(RUN, 'wave1/results.md');
let res = fs.readFileSync(resF, 'utf8');
if (!res.includes('## NDC-Staging rerun')) {
  res += `
## NDC-Staging rerun (2 Nov 2026)

The user moved all remaining Wave 1 work to NDC-Staging; Anyware-Staging is paused. Full table: \`ndc/results.md\` (cases \`ndc/cases.md\`).

- W1-12 PASS · W1-20 PASS · W1-22 PASS · W1-29 PASS · W1-30 PASS (note: an active CRM-only user can get a second, pending Desk invitation row) · W1-32 PASS · W1-33 PASS · W1-36 PASS · W1-41 PASS · W1-51 PASS · W1-58 PASS.
- W1-52 NDC-2303 PASS (fixed) · W1-53 NDC-2387 PASS (fixed).
- W1-B1 reproduced on screen on NDC (300-digit phone → "An unexpected error occurred"); the website is checked on screen, not by the API. Zoho: phone max 20 characters, website max 50, no URL check.
- W1-B2 reproduced on screen on NDC (two tabs, CC back on). Zoho: not checked (department edit does not save in the trial org).
- Annotated images: \`evidence/annotated/W1-B1-vs-zoho.png\`, \`evidence/annotated/W1-B2-vs-zoho.png\`.
`;
  fs.writeFileSync(resF, res);
}

const dataF = path.join(RUN, 'wave1/report-data.js');
delete require.cache[dataF];
const D = require(dataF);
D.meta = 'First run 1–2 Nov 2026 on Anyware-Staging (owner, UI + API). The open cases were rerun on 2 Nov on NDC-Staging (Wonder Travel tenant) with an owner, a Desk Agent and a Desk Supervisor; Anyware-Staging is now paused. Compared with Zoho Desk Enterprise (help centre + live trial org techsolutionsegypt). Covers inventory rows O-01..O-05, A-01..A-09 and Q-04. Nothing has been filed in Plane.';
D.decisions = [
  '**File W1-B1 and W1-B2?** Both reproduce on NDC-Staging on screen. The annotated TAVI-vs-Zoho images are in the bug cards below. Fields: MahmoudMohamed + mfathy + Hegazy + eahmed, state Bug, W1-B1 Low, W1-B2 Medium, module Desk, Sprint 14, start date today.',
  '**NDC-2303 and NDC-2387 now pass** (both Ready For Test). Comment with the result and move them to Done?',
  '**NDC-2305 passes** (Anyware run). It was In Progress then; comment when it reaches Ready For Test.',
  '**Possible bugs to decide on (not drafted):** (1) inviting an email that already has an active user adds a second, pending row (W1-30 note); (2) the audit log records the company time zone as "null → UTC" although it stayed Africa/Cairo, and the agent sees "Time zone UTC" on the Company page.',
];
const b1 = D.bugs[0], b2 = D.bugs[1];
b1.title = 'Company profile | A long phone number gives "An unexpected error occurred", and the API saves any phone or website';
b1.steps = ['Open Setup › Company and press Edit.', 'Type a 300-digit number in Phone and press Save.', 'Edit again, type a 40-digit number in Phone and press Save.', 'By API, PUT /iam/tenant/company-profile with website "not a url".'];
b1.expected = 'Phone is limited to a sensible length (Zoho Desk: 20 characters) and checked on the server too; the website is checked by the server as it is on screen. No server error.';
b1.actual = '300 digits: toast **"An unexpected error occurred."** (HTTP 500 INTERNAL_ERROR), nothing saved. 40 digits: saved. Website: the screen refuses "not a url" ("Enter a valid website URL", Save disabled), but the API saves it (200). Reproduced on Anyware (API) and NDC-Staging (screen + API); values set back each time.';
b1.zoho = 'Checked on the Zoho trial org: the Phone field stops at **20 characters** (maxlength 20) and saves with no error; the Website field has no format check (saved "http://not a url", 50 characters max). Both were set back right away.';
b1.evidence = 'Annotated image below (TAVI left, Zoho right). Raw: `evidence/raw/bugs/W1-B1-*.png`, `zoho-B1-*.png`; API output `wave1/raw/w1-a.json`, `w1-l.json`, `ndc/raw/n-e3.json`.';
b1.images = ['evidence/annotated/W1-B1-vs-zoho.png'];
delete b1.note;
b2.steps = ['Open the same department (Setup › Departments) in two tabs, A and B.', 'In tab A untick "Allow copied addresses (CC) on tickets" and press Save.', 'In tab B (still showing CC ticked) type a "Display Name in Help Center" and press Save.', 'Reload the department.'];
b2.actual = "Tab B saves without any message and **CC is back on**; tab A's change is lost. The department has no version check (GET has no version field, PATCH takes no If-Match). Reproduced 3 times: twice by API on Anyware, once on screen on NDC-Staging.";
b2.zoho = 'Not checked: in the Zoho trial org the department edit form does not save ("Unable to process your request"), so the two-tab test could not run. Nothing was changed in Zoho.';
b2.evidence = 'Annotated image below. Raw screens `evidence/raw/bugs/W1-B2-1..5-*.png`, API output `wave1/raw/w1-c2.json`, `w1-k.json`, `ndc/raw/n-b2.json`.';
b2.images = ['evidence/annotated/W1-B2-vs-zoho.png'];
D.tickets = [
  '**NDC-2303 now passes** on NDC-Staging: a Tech-only Desk Supervisor is refused (403) at Read only and Restricted, priority unchanged; Full access allows it. Ready For Test, not moved, no comment yet.',
  '**NDC-2387 now passes**: a required field cannot be set to Read only for a profile (422 with a clear message). Ready For Test, not moved, no comment yet.',
  '**NDC-2305 now passes** (Anyware run). Not moved, no comment.',
  'Still In Progress, not retested: NDC-2736, NDC-2733.',
  'Seen in passing: the Anyware invite refusal returns the raw key `iam.subscription.seat_limit_reached` (like CRM NDC-2658).',
];
D.inconclusive = [
  'None left open. Every case that was inconclusive or not run on Anyware was rerun on NDC-Staging (table above), and all passed.',
];
const cases = Object.fromEntries(fs.readFileSync(path.join(RUN, 'ndc/cases.md'), 'utf8').split(/\r?\n/).filter(l => /^\| W1-/.test(l)).map(l => l.split('|').slice(1, -1).map(x => x.trim())).map(r => [r[0], r]));
D.rerun = { file: '../ndc/results.md', title: 'Rerun on NDC-Staging (2 Nov)', meta: 'Open Wave 1 cases rerun on NDC-Staging with owner ndc-staging-owner@, agent fedelav803@ (Desk Agent) and supervisor pacox68754@ (Desk Supervisor). Anyware-Staging was not touched.', cases };
D.shots = (D.shots || []).filter(x => !/W1-29/.test(x.file));
if (!D.cleanup.some(x => x.startsWith('NDC-Staging:'))) D.cleanup = D.cleanup.concat([
  'NDC-Staging: created and deleted QA GL N department, QA GL N role, QA GL N RT module (with its field), one QA ticket (shared, then unshared and deleted), the QA ticket status, the owner signature, and two invitations (both cancelled). Ledger `ndc/after/created.jsonl`; final diff `ndc/after/diff.txt`: company, departments, teams, business hours, holidays, statuses, modules, profiles and signatures unchanged.',
  'NDC-Staging differences not made by this run: CRM roles/profiles of six users and CRM org units "Team 1/2/3" changed around 09:45 by "test user 1" and "test user 2" (another session). Not touched.',
  'Zoho trial org: company website and phone were changed for the W1-B1 check and set back at once (phone 1099130163, website empty). Department "Marketing" unchanged.',
]);
fs.writeFileSync(dataF, 'module.exports = ' + JSON.stringify(D, null, 1) + ';\n');
console.log('updated');
