// Builds report-workflow-bugs.html: every Desk Workflow Rules bug / finding from the automation-order run (A4, 11–12 Nov 2026)
// plus the 14 Oct bugs B-1..B-9 that still fail. Local report; nothing is filed in Plane yet.
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..');
const OLD = '../execu_2026-10-12_desk-workflow-rules/screenshots/annotated/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`([^`]+)`/g, '<code>$1</code>');
const SEV = { Critical: 'bad', High: 'bad', Medium: 'warn', Low: 'grey' };

// [id, case, severity, kind, title, steps[], expected, actual, evidence (image path or null), extra note]
const bugs = [
  ['WF-01', 'O4', 'High', 'Security', 'Webhook header value with a line break adds an extra header to the outgoing request',
    ['Make a rule with a Webhook action to a request catcher (webhook.site).', 'Add a header `X-QA` whose value is `a` + line break + `Injected: 1` (saved through the API).', 'Create a ticket that fires the rule.'],
    'The value is refused at save, or the line break is stripped, so only one header `X-QA` is sent.',
    'The receiver got two headers: `x-qa: a` AND `injected: 1`. A `Host` header override is also accepted (the dispatch then stays Pending with "The SSL connection could not be established").',
    null, 'Proved on webhook.site 12 Nov 10:03 UTC. Screen input not tried (the header box may block line breaks); the API accepts it.'],
  ['WF-02', 'O1', 'High', 'Security', 'Script saved in an Add Comment action body runs when an admin opens the rule',
    ['Save a rule (through the API) whose Add Comment body contains `<img src=x onerror="window.__xss=1">`.', 'As an admin, open the rule in the editor.'],
    'The body is shown as plain text everywhere; no script runs.',
    'The script runs in the editor (`window.__xss` is set). Name, description, list, Execution History and the ticket comment are all safe.',
    'evidence/a4-bugs/O1-editor-runs-script.png', 'API-only input, but the editor is the one rendering it unsafely.'],
  ['WF-03', 'G4', 'High', 'Bug', 'Double-clicking Save & Activate creates two identical rules',
    ['Settings › Workflow Rules › New Rule; fill a valid rule.', 'Double-click Save & Activate.'],
    'One rule is created; the button is disabled while saving (Zoho: one rule).',
    'Two identical active rules were created. Seen twice on 12 Nov ("QA AO WF C5 …" ×2 and "QA AO WF G4 dbl" ×2, confirmed by the API list).',
    null, 'Both pairs were deleted after the test.'],
  ['WF-04', 'G5', 'Medium', 'Bug', 'Saving a rule silently overwrites a change made meanwhile by someone else',
    ['Admin A opens a rule in the editor.', 'Meanwhile the rule is renamed by someone else (second tab / API PATCH, 200).', 'Admin A changes the description and clicks Save.'],
    'Admin A is told the rule changed ("Rule changed — Reload latest"), nothing is lost.',
    'The save succeeds with no warning; the other person\'s rename is lost (name back to the old one).',
    'evidence/a4-bugs/G5-save-no-conflict-warning.png', 'The save body carries no version, so the server cannot detect the conflict.'],
  ['WF-05', 'M6', 'Medium', 'Bug', 'Execution History shows rule and record as raw ids, and the record is not a link',
    ['Open Setup › Execution History (`/settings/workflow-executions`).'],
    'Rule column shows the rule name; Record shows the ticket (number / subject) and opens it on click.',
    'Both columns show UUIDs (e.g. `53c7ed55-…`, which is the existing rule "QA AO WF P12od"); the record is plain text, not a link. The API also returns `originName: null` on all 200 latest rows.',
    'evidence/a4-bugs/M6-execution-history-raw-ids.png', 'Together with B-6 (no menu link) this page is hard to use.'],
  ['WF-06', 'F18', 'Medium', 'Bug', '${recordId} and ${moduleId} render empty in a Field Update',
    ['Rule On Create, Field Update Description = `R[${recordId}]`.', 'Create a ticket.'],
    'Description = `R[<the ticket id>]` (the editor help says "${recordId} and ${moduleId} are always available").',
    'Description = `R[]`; same for `${moduleId}`. `${subject}` works, `$${x}` gives `${x}`, an unclosed `${subject` stays literal (all correct).',
    null, ''],
  ['WF-07', 'I30', 'Low', 'Finding', '"Send happiness email" says Succeeded while ratings are switched off',
    ['Customer Happiness off (original tenant setting).', 'Rule with action Send happiness email; create a ticket.'],
    'Nothing sent and the dispatch says why ("ratings are off") — the editor itself says "Nothing is sent while ratings … are switched off".',
    'Dispatch `SendHappinessEmail Succeeded`, no reason, nothing in the ticket history.',
    null, 'Same blind spot as P18 (skipped agents shown as Succeeded).'],
  ['WF-08', 'E9', 'Medium', 'Finding', 'A criteria pattern that leaves a condition out is accepted; the condition is silently ignored',
    ['Rule with 3 conditions.', 'Edit Pattern → `1 and 2` → Apply → Save.'],
    'Refused, or a warning that condition 3 is not used.',
    'Accepted: condition 3 stays on screen but is not part of the criteria. Other pattern errors are good ("Pattern ends unexpectedly.", "Missing closing parenthesis.", "Pattern refers to condition 4, which doesn\'t exist."). `1 and 2 or 3` is read as ((1 and 2) or 3) without asking.',
    'evidence/a4-bugs/E9-unused-condition-accepted.png', ''],
  ['WF-09', 'L1', 'Medium', 'Finding', 'Test rule ignores the sample record id',
    ['Open a saved rule › Test rule.', 'Enter the id of a ticket that matches, leave the field values JSON empty, run.'],
    'The rule is evaluated against that ticket\'s values → "Criteria matched".',
    '"Not matched" unless the values are typed in as JSON. The panel\'s example JSON is CRM-style (`revenue`, `intValue`). Nothing is saved (correct).',
    null, 'Seen through the same API the panel calls: POST /workflow/rules/{id}/execute {recordId, triggerKind, fields}.'],
  ['WF-10', 'F9 / F12', 'Low', 'Finding', 'Empty Webhook URL / Task title: raw server text instead of an on-screen check',
    ['Add a Webhook (no URL) or a Task (no title).', 'Save & Activate.'],
    'An on-screen message like the other actions ("Every Email action needs at least one recipient.").',
    'Red toast with server text: "Actions[0].Url: \'Url\' must not be empty.; … Actions[0].BodyTemplate: …" / "Actions[0].TaskTitle: \'Task Title\' must not be empty."',
    'evidence/a4-bugs/F12-task-raw-server-text.png', 'Webhook screen: evidence/a4-bugs/F9-webhook-raw-server-text.png.'],
  ['WF-11', 'C4 / C7', 'Low', 'Finding', 'Name and description limits are only enforced at save',
    ['Type a 1000-character rule name (or a 5000-character description).', 'Save.'],
    'The box stops at the limit or shows the limit while typing.',
    'No limit in the box; the server refuses at save: name 200 ("must be 200 characters or fewer"), description 2000.',
    null, ''],
  ['WF-12', 'B11', 'Low', 'Finding', 'Bulk delete where one rule is already gone: raw id toast, no summary',
    ['Select 2 rules › Delete (2).', 'Before confirming, one of them is deleted elsewhere.', 'Confirm.'],
    '"1 deleted, 1 failed" (or similar) with the rule name.',
    'Toast "Rule 19fe442f-f458-4154-8c5b-bb898acfe060 not found."; the other rule is deleted. Same raw-id toast on save after delete (G6).',
    'evidence/a4-bugs/B11-raw-id-toast.png', ''],
  ['WF-13', 'B2', 'Low', 'Finding', 'Trigger column shows internal field names and "1 days"',
    ['Open Settings › Workflow Rules.'],
    'Field labels ("QA NDC Related Branch", "Due Date"), "1 day before".',
    '"Field Changed: qa_ndc_related_branch", "Date-Field Relative: due_date (1 days before)". Same in Arabic.',
    'evidence/a4-bugs/B2-trigger-column-internal-names.png', ''],
  ['WF-14', 'Z18', 'Low', 'Gap', 'A rule can still have only one action of each type (per delay)',
    ['Save a rule with two Field Update actions (or two Owner Assignments).'],
    'Allowed, as in Zoho (several field updates / alerts per rule).',
    '400 "A rule can have only one \'FieldUpdate\' action with the same delay."',
    null, 'Gap kept from the 12 Oct missing list.'],
];
const old = [
  ['B-1', 'High', 'Record API answers 500 when `kind` is not the first key of a field value', 'POST /modules/{tickets}/records with `{"value":{"value":"x","kind":"string"}}` → 500; with kind first → 201. Still 500 on 12 Nov (API-T3).', null],
  ['B-2', 'Medium', 'Field Update on the read-only `created_by` field is accepted', 'Rule with Field Update on created_by saves; ticket_number / created_time are refused. Still accepted (F7).', null],
  ['B-4', 'Low', 'A webhook rejected with 404 is shown as Cancelled, not Failed; response status empty', 'One attempt, no retry (correct), but status Cancelled. Still the same (I14).', null],
  ['B-5', 'Low', 'The action picker offers types the rule already uses', 'Rule with Field Update, Add Tags and Task: picker still offers Task and Add Tags (one per type allowed). Still (F3).', OLD + 'WFR-F3-tavi-only.png'],
  ['B-6', 'Low', 'No menu link to Execution History', 'Setup › AUTOMATION has no Execution History entry; only the URL works. Still (M1).', OLD + 'WFR-M1-tavi-only.png'],
  ['B-7', 'Low', 'A cancelled scheduled action leaves no trace in Execution History', 'Ticket stops matching before the delay: nothing sent (correct) but no dispatch row at all. Still (J7).', null],
  ['B-8', 'Medium', 'Workflow Create Record skips required fields and leaves the record without an owner', 'Calls created with no Name / Subject, owner 0000…; dispatch Succeeded. Still (I25).', null],
  ['B-9', 'Medium', 'Owner Assignment by role (round robin) assigns nobody', 'Rule "Owner = role CEO, round robin" shows Fired, owner unchanged, no dispatch, no error. Still (I8).', null],
];
// ---- Zoho Desk comparison (12 Nov: live techsolutionsegypt, nothing saved; help.zoho.com) ----
// verdict: DIFFERS (confirmed vs Zoho) | BUG (no Zoho equivalent, still a defect) | NO ZOHO (TAVI-only feature, not a parity bug) | WITHDRAW
const HELP_WF = 'help.zoho.com/portal/en/kb/desk/automation/workflows/articles/workflow-automations';
const Z = {
  'WF-01': ['BUG', 'Zoho workflow rules have no Webhook action and Zoho webhooks have no custom headers (live: action menu has no Webhook; help "Setting up webhooks"). Not a parity bug — a security defect in a TAVI-only feature.', 'Header names and values containing a line break are refused at save ("Header values can\'t contain line breaks"), and reserved headers such as Host are refused; only the configured headers are sent.', 'evidence/a4-bugs/zoho-workflow-actions-menu.png'],
  'WF-02': ['BUG', 'Not documented in Zoho; no Zoho behaviour to copy. Security defect regardless.', 'Text entered in any action field is always shown as plain text in the rule editor; no script runs.', null],
  'WF-03': ['BUG', 'Zoho help is silent; not tried live (it would create Zoho rules). Standard behaviour, kept as a bug.', 'One rule is created; Save is disabled while the first save is in progress.', null],
  'WF-04': ['BUG', 'Zoho help is silent on concurrent edits. Kept as a data-loss bug, not a parity one.', 'The second save is refused with a "rule was changed, reload" message; no change is lost.', null],
  'WF-05': ['NO ZOHO', 'Zoho Desk has no execution-history page (help: runs show only in the ticket History with the rule name, actor "Workflow"). TAVI\'s page is an extra.', 'If kept: rule and record shown by name, record opens the ticket (as TAVI\'s ticket History already does).', null],
  'WF-06': ['DIFFERS', 'Zoho placeholders render the ticket\'s values, incl. ${Cases.Request Id} = the ticket ID/number (help "Creating and managing email templates"). TAVI\'s ${recordId}/${moduleId} render empty although its help lists them.', 'A placeholder for the ticket\'s ID renders the ID (Zoho: ${Cases.Request Id} → the ticket number); no listed placeholder renders empty.', null],
  'WF-07': ['BUG', 'Zoho: what happens while ratings are off is not documented (rating email sent by an Alert with ${Cases.Customer Happiness Rating}). Checked against TAVI\'s own help text.', 'Nothing is sent and the execution says it was skipped because ratings are off (not "Succeeded").', null],
  'WF-08': ['DIFFERS', 'Live Zoho: pattern "1" with 2 conditions → red "Numbers in this pattern do not match with the numbers used in the Criteria Editor"; OK does not apply it.', 'A pattern that does not use every condition number (or uses one that doesn\'t exist) is refused with "Numbers in this pattern do not match with the numbers used in the Criteria Editor", and the rule can\'t be saved with it.', 'evidence/a4-bugs/E9-zoho-pattern-must-use-all-numbers.png'],
  'WF-09': ['NO ZOHO', 'Zoho has no test/dry-run for workflow rules (help FAQ: test by creating a real ticket). TAVI extra.', 'If kept: the sample record\'s values are used when no values are typed.', null],
  'WF-10': ['NO ZOHO', 'Zoho workflows have no Webhook action; Zoho task validation texts are not documented. TAVI wording issue only.', 'If kept: a short on-screen message like the other actions ("Enter the webhook URL", "Enter a task title").', null],
  'WF-11': ['DIFFERS', 'Live Zoho: the Rule Name box has maxlength 50 and stops typing at 50 characters; the Description box has no limit.', 'The rule-name box stops at the limit while typing (Zoho: 50); no surprise error at save. Description: no limit is needed (Zoho has none), so the 2000 server limit should be shown on the box if kept.', null],
  'WF-12': ['NO ZOHO', 'Zoho has no bulk delete of rules (help: one rule at a time, delete icon + OK). TAVI extra.', 'If kept: a summary such as "1 deleted, 1 not found" with names.', null],
  'WF-13': ['DIFFERS', 'Zoho shows field labels everywhere in the rule (Execute on / criteria use labels, e.g. "Field Update" on "Status"); internal names are never shown (live editor).', 'Trigger shown with field labels ("Field Changed: QA NDC Related Branch", "1 day before Due Date").', null],
  'WF-14': ['DIFFERS', 'Zoho: up to 10 alerts, 10 tasks and 10 field updates per rule, and one field update sets several fields (help "Creating Workflow Rule"; live: the Field Update dialog has a "+" for more fields).', 'A rule can hold several actions of the same type (Zoho: up to 10 alerts, 10 tasks, 10 field updates; 5 custom actions).', null],
};
const ZO = {
  'B-1': ['BUG', 'API only; Zoho not comparable. A server error on valid JSON is a defect regardless.'],
  'B-2': ['DIFFERS', 'Live Zoho: a Field Update offers only the 14 editable ticket fields (Contact Name … Language); Created By and other system fields are not offered. Expected: read-only/system fields can\'t be set by a Field Update.', 'evidence/a4-bugs/B-2-zoho-field-update-only-editable-fields.png'],
  'B-4': ['NO ZOHO', 'Zoho workflows have no Webhook action. TAVI-only; keep as Low if wanted.'],
  'B-5': ['WITHDRAW', 'Zoho lets a rule add the same action type again (up to 10 field updates / alerts / tasks), so offering a used type again is Zoho behaviour. The real gap is WF-14.'],
  'B-6': ['NO ZOHO', 'Zoho Desk has no execution-history page to link to. Not a parity bug.'],
  'B-7': ['NO ZOHO', 'Zoho workflow rules have no delayed/scheduled actions (help FAQ). TAVI-only.'],
  'B-8': ['BUG', 'Zoho workflows have no Create Record action (only Tasks); required-field rules not documented. Kept: the record is created breaking TAVI\'s own required fields.'],
  'B-9': ['NO ZOHO', 'Zoho assigns from a workflow with "Assign Ticket" (agent / team); round robin is an Assignment Rules feature, not a workflow option. TAVI-only option, broken.'],
};
const VC = { DIFFERS: 'bad', BUG: 'warn', 'NO ZOHO': 'grey', WITHDRAW: 'ok' };
const fixed = ['B-3 Actions library can now create "Happiness Email" (fixed, 12 Nov).', 'NDC-2173, NDC-2204, NDC-2205, NDC-2206 still fixed.', 'NDC-2203 items fixed: private-thread direction, team on Create rules.', 'I4 (500 on an address value): not a bug, it was a staging outage.'];

const img = p => p && fs.existsSync(path.join(D, p)) ? `<details><summary>Screenshot</summary><a href="${p}"><img loading="lazy" src="${p}" alt="evidence"></a></details>` : '';
const pill = (t, c) => `<span class="pill ${c}">${esc(t)}</span>`;
const card = b => `<article class="bug" id="${b[0]}"><header><b>${b[0]}</b> ${pill(b[2], SEV[b[2]])} ${pill(b[3], b[3] === 'Security' ? 'bad' : b[3] === 'Bug' ? 'warn' : 'grey')} <span class="muted">case ${esc(b[1])}</span><h3>${esc(b[4])}</h3></header>
<div class="zoho">${pill('vs Zoho: ' + Z[b[0]][0], VC[Z[b[0]][0]])} ${esc(Z[b[0]][1])}${Z[b[0]][3] ? img(Z[b[0]][3]).replace('Screenshot', 'Zoho screenshot') : ''}</div>
<div class="grid2"><div><h4>Steps</h4><ol>${b[5].map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><div><h4>${Z[b[0]][0] === 'DIFFERS' ? 'Expected (Zoho Desk)' : Z[b[0]][0] === 'NO ZOHO' ? 'Expected (no Zoho equivalent)' : 'Expected'}</h4><p>${esc(Z[b[0]][2])}</p><h4>Actual (TAVI)</h4><p>${esc(b[7])}</p>${b[9] ? `<p class="muted">${esc(b[9])}</p>` : ''}</div></div>${img(b[8]).replace('Screenshot', 'TAVI screenshot')}</article>`;
const zc = k => bugs.filter(b => Z[b[0]][0] === k).length + old.filter(o => ZO[o[0]][0] === k).length;
const cnt = k => bugs.filter(b => b[3] === k).length;
const css = `:root{--bg:#f6f7f9;--card:#fff;--text:#1c2230;--muted:#5d6678;--line:#e2e5eb;--bad:#b42318;--bad-bg:#fdecea;--warn:#a15c00;--warn-bg:#fff3df;--grey:#4b5563;--grey-bg:#eceff3;--ok:#1f8a4c;--ok-bg:#e6f5ec;--info:#2457d6}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--bad:#ff8a7e;--bad-bg:#3d1c1a;--warn:#f0b252;--warn-bg:#3a2c12;--grey:#b6bdc9;--grey-bg:#262b35;--ok:#5fd08f;--ok-bg:#173525;--info:#7aa2ff}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--bad:#ff8a7e;--bad-bg:#3d1c1a;--warn:#f0b252;--warn-bg:#3a2c12;--grey:#b6bdc9;--grey-bg:#262b35;--ok:#5fd08f;--ok-bg:#173525;--info:#7aa2ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}main{max-width:1100px;margin:0 auto;padding:28px 16px 60px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:34px 0 12px}h3{font-size:17px;margin:6px 0 0}h4{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:10px 0 4px}
.sub,.muted{color:var(--muted)}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0}.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.tile b{display:block;font-size:24px}.tile span{color:var(--muted);font-size:13px}
.zoho{background:var(--grey-bg);border-radius:8px;padding:8px 12px;margin:10px 0 4px;font-size:14px}.bug{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:12px 0}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:18px}@media(max-width:700px){.grid2{grid-template-columns:1fr}}
ol{margin:0;padding-left:20px}p{margin:4px 0}.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;margin-right:4px}.bad{color:var(--bad);background:var(--bad-bg)}.warn{color:var(--warn);background:var(--warn-bg)}.grey{color:var(--grey);background:var(--grey-bg)}.ok{color:var(--ok);background:var(--ok-bg)}
code{font-size:13px;background:var(--grey-bg);padding:1px 5px;border-radius:4px;word-break:break-all}img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:8px}details{margin-top:8px}summary{cursor:pointer;color:var(--info)}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;color:var(--muted)}tr:last-child td{border-bottom:0}
nav{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:14px}nav a{color:var(--info);text-decoration:none;margin-right:10px;display:inline-block}`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Workflow Rules Bugs</title><style>${css}</style></head><body><main>
<h1>Desk Workflow Rules: bugs</h1>
<p class="sub">TAVI Desk on NDC-Staging, Desk automation-order run part A4, 11–12 Nov 2026. Each item compared with Zoho Desk on 12 Nov (live account techsolutionsegypt, nothing saved there, plus help.zoho.com). <b>Nothing is filed in Plane yet.</b></p>
<div class="tiles"><div class="tile"><b>${bugs.length + old.length}</b><span>items checked</span></div><div class="tile"><b>${zc('DIFFERS')}</b><span>differ from Zoho (confirmed)</span></div><div class="tile"><b>${zc('BUG')}</b><span>bugs with no Zoho equivalent (security, data loss)</span></div><div class="tile"><b>${zc('NO ZOHO')}</b><span>TAVI-only features (not parity bugs)</span></div><div class="tile"><b>${zc('WITHDRAW')}</b><span>withdrawn (Zoho does the same)</span></div></div>
<div class="tw" style="padding:10px 14px"><b>How to read "vs Zoho":</b> ${pill('DIFFERS', 'bad')} Zoho behaves differently — the expected result is Zoho's. ${pill('BUG', 'warn')} Zoho has nothing comparable, but it is still a defect (security / data loss). ${pill('NO ZOHO', 'grey')} the feature exists only in TAVI, so it is not a Zoho-parity bug — file only if you want TAVI's extra fixed. ${pill('WITHDRAW', 'ok')} Zoho does the same, not a bug.</div>
<nav>${bugs.map(b => `<a href="#${b[0]}">${b[0]} ${esc(b[1])}</a>`).join('')}<a href="#old">B-1…B-9</a><a href="#fixed">Fixed</a></nav>
<h2>Summary</h2>
<div class="tw"><table><tr><th>Id</th><th>Case</th><th>Severity</th><th>Type</th><th>vs Zoho</th><th>Title</th></tr>${bugs.map(b => `<tr><td><a href="#${b[0]}">${b[0]}</a></td><td>${esc(b[1])}</td><td>${pill(b[2], SEV[b[2]])}</td><td>${esc(b[3])}</td><td>${pill(Z[b[0]][0], VC[Z[b[0]][0]])}</td><td>${esc(b[4])}</td></tr>`).join('')}</table></div>
<h2>Security and new bugs, then findings</h2>
${bugs.map(card).join('')}
<h2 id="old">Old bugs from 14 Oct, still failing on 11–12 Nov (never filed)</h2>
<div class="tw"><table><tr><th>Id</th><th>Severity</th><th>Bug</th><th>Recheck</th><th>vs Zoho</th></tr>${old.map(o => `<tr><td><b>${o[0]}</b></td><td>${pill(o[1], SEV[o[1]])}</td><td>${esc(o[2])}${img(o[4])}</td><td>${esc(o[3])}</td><td>${pill(ZO[o[0]][0], VC[ZO[o[0]][0]])} ${esc(ZO[o[0]][1])}${ZO[o[0]][2] ? img(ZO[o[0]][2]).replace('Screenshot', 'Zoho screenshot') : ''}</td></tr>`).join('')}</table></div>
<h2 id="fixed">Fixed or not a bug</h2><ul>${fixed.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
<p class="muted">Sources: PROGRESS.md, a4/b1–b8 results, screen steps s1–s28 (12 Nov), execu_2026-10-12_desk-workflow-rules/report.md. Test data was deleted after each test. When filing, each item gets an annotated image (TAVI vs Zoho where Zoho has the feature).</p>
</main></body></html>`;
module.exports = { bugs, Z, old, ZO, css, esc, pill, img, SEV, VC };
if (require.main === module) { fs.writeFileSync(path.join(D, 'report-workflow-bugs.html'), html); console.log('bugs', bugs.length, 'old', old.length); }
