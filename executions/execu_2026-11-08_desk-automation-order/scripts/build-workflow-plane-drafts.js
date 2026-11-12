// Builds report-workflow-plane-drafts.html: the 14 Workflow Rules items proposed for Plane, written as they would be filed.
// DRAFT ONLY — nothing is filed. User reviews first (12 Nov 2026).
const fs = require('fs'), path = require('path');
const { css, esc, pill, SEV } = require('./build-workflow-bugs-report.js');
const D = path.join(__dirname, '..');
const A = 'evidence/a4-bugs/';
const ENV = 'NDC-Staging (staging-desk.taviportal.com), Edge, 11–12 Nov 2026, owner account. Zoho Desk compared live on techsolutionsegypt (nothing left behind).';

// [key, group, priority, title, summary, steps[], expected, actual, zoho (or null), images [[path, caption]], imageTodo, case ids]
const drafts = [
  // ---- differ from Zoho ----
  ['D-01', 'Differs from Zoho', 'Medium', 'Workflow Rules | Criteria pattern that leaves out a condition is accepted and the condition is ignored',
    'When the criteria pattern does not use every condition number, TAVI saves the rule and silently ignores the missing condition. Zoho refuses the pattern.',
    ['Settings › Workflow Rules › New Rule.', 'Add 3 conditions.', 'Click Edit Pattern, type 1 and 2, click Apply.', 'Click Save & Activate.'],
    'The pattern is refused with "Numbers in this pattern do not match with the numbers used in the Criteria Editor" (Zoho\'s message) and the rule cannot be saved until every condition number is used.',
    'The rule saves. Condition 3 stays on the screen but is not part of the criteria, so the rule fires when condition 3 is false. Other pattern errors work well ("Pattern ends unexpectedly.", "Missing closing parenthesis.", "Pattern refers to condition 4, which doesn\'t exist.").',
    'Zoho Desk (live): pattern "1" with 2 conditions shows "Numbers in this pattern do not match with the numbers used in the Criteria Editor" and OK does not apply it.',
    [[A + 'E9-unused-condition-accepted.png', 'TAVI: pattern 1 and 2 accepted with 3 conditions'], [A + 'E9-zoho-pattern-must-use-all-numbers.png', 'Zoho: same pattern refused']], 'Combine into one TAVI vs Zoho image.', 'E9 (WF-08)'],
  ['D-02', 'Differs from Zoho', 'Medium', 'Workflow Rules | A rule can have only one action of each type',
    'TAVI refuses a second action of the same type (for example two Field Updates). Zoho allows several.',
    ['Settings › Workflow Rules › New Rule.', 'Add a Field Update action, then add a second Field Update (or a second Email / Task).', 'Save.'],
    'A rule can hold several actions of the same type, as in Zoho: up to 10 alerts, 10 tasks and 10 field updates per rule, and one Field Update can set several fields.',
    'Error 400: "A rule can have only one \'FieldUpdate\' action with the same delay."',
    'Zoho Desk help "Creating Workflow Rule" and live editor: up to 10 alerts, 10 tasks, 10 field updates; the Field Update dialog has "+" to add more fields.',
    [[A + 'zoho-workflow-actions-menu.png', 'Zoho: actions menu (several of each type allowed)']], 'Need a TAVI screenshot of the error toast + Zoho side by side.', 'Z18 (WF-14)'],
  ['D-03', 'Differs from Zoho', 'Medium', 'Workflow Rules | Field Update can change "Created By"',
    'A Field Update action is allowed on the system field Created By. Zoho offers only editable ticket fields.',
    ['Settings › Workflow Rules › New Rule.', 'Add a Field Update action and pick Created By.', 'Save, then fire the rule on a ticket.'],
    'System fields such as Created By are not offered in Field Update, as in Zoho (Zoho offers only the 14 editable ticket fields, Contact Name … Language).',
    'The rule saves with a Field Update on Created By. (Ticket Number and Created Time are correctly refused.)',
    'Zoho Desk (live): the Field Update field list has 14 editable fields; Created By and other system fields are not in it.',
    [[A + 'B-2-zoho-field-update-only-editable-fields.png', 'Zoho: Field Update field list']], 'Need a TAVI screenshot of Created By in the field list + Zoho side by side.', 'F7 (old B-2)'],
  ['D-04', 'Differs from Zoho', 'Low', 'Workflow Rules | Rule name length is only checked when you save',
    'The rule name box accepts any length and the limit is shown only as an error at save. Zoho\'s box stops at its limit while typing.',
    ['Settings › Workflow Rules › New Rule.', 'Type a 1000-character name (and a 5000-character description).', 'Save.'],
    'The name box stops at the limit while typing (Zoho stops at 50 characters), so no error appears at save. If the description keeps a limit (2000), the box shows it while typing.',
    'No limit in the box. At save: "must be 200 characters or fewer" for the name; the description is refused above 2000 characters.',
    'Zoho Desk (live): Rule Name box has maxlength 50; Description has no limit.',
    [], 'Need TAVI screenshot of the save error + Zoho name box at 50.', 'C4, C7 (WF-11)'],
  ['D-05', 'Differs from Zoho', 'Medium', 'Workflow Rules | ${recordId} and ${moduleId} come out empty',
    'The editor help says ${recordId} and ${moduleId} are always available, but they are replaced with nothing.',
    ['Settings › Workflow Rules › New Rule, On Create.', 'Add a Field Update: Description = R[${recordId}] M[${moduleId}].', 'Create a ticket.'],
    'The placeholders are replaced with the ticket\'s ID and the module, as Zoho does with ${Cases.Request Id} (the ticket number). No listed placeholder comes out empty.',
    'Description becomes R[] M[]. ${subject} works correctly.',
    'Zoho Desk help "Creating and managing email templates": ${Cases.Request Id} gives the ticket number.',
    [], 'Need TAVI screenshot of the ticket Description "R[] M[]" next to the help text.', 'F18 (WF-06)'],
  ['D-06', 'Differs from Zoho', 'Low', 'Workflow Rules | Rules list shows internal field names in the Trigger column',
    'The Trigger column shows internal names (qa_ndc_related_branch, due_date) and "1 days". Zoho shows field labels.',
    ['Open Settings › Workflow Rules.', 'Look at the Trigger column for a "Field changed" rule and a "Date relative" rule.'],
    'Field labels, as in Zoho: "Field Changed: QA NDC Related Branch", "1 day before Due Date".',
    '"Field Changed: qa_ndc_related_branch", "Date-Field Relative: due_date (1 days before)". Same in Arabic.',
    'Zoho Desk (live): rules use field labels everywhere; internal names are never shown.',
    [[A + 'B2-trigger-column-internal-names.png', 'TAVI: internal names in the Trigger column']], 'Add Zoho list view beside it.', 'B2 (WF-13)'],
  ['D-07', 'Differs from Zoho', 'Low', 'Workflow Rules | Ticket history does not show the status change made by a workflow',
    'When a workflow Field Update closes a ticket, TAVI\'s history only says "Workflow rule ran". Zoho shows which rule changed which field.',
    ['Make a rule: On Create, Field Update Status = Closed.', 'Create a ticket that matches.', 'Open the ticket History.'],
    'History shows the change, as in Zoho: "Ticket was updated through a Workflow Rule", the rule name, the field update name and "Status changed from Open to Closed". (No closed mail is expected: Zoho sends none when a workflow closes a ticket.)',
    'History shows only "Workflow rule ran" with no status line (ticket #2952).',
    'Zoho Desk (live 12 Nov, #185/#186): "Ticket was updated through a Workflow Rule · Rule Name · Assignment Name · Status changed from Open to Closed"; no closed mail, same as TAVI.',
    [[A + 'C3-zoho-workflow-close-no-mail.png', 'Zoho: history of a ticket closed by workflow']], 'Need TAVI ticket #2952 History screenshot beside it.', 'C3 / P25'],
  // ---- real bugs, no Zoho equivalent ----
  ['D-08', 'Bug (no Zoho equivalent)', 'High', 'Workflow Rules | Webhook header value with a line break adds an extra header (header injection)',
    'A line break inside a webhook header value is sent as a second header. Anyone who can edit rules can add any header to outgoing requests.',
    ['Make a rule with a Webhook action to a request catcher (webhook.site).', 'Add header X-QA with the value a + line break + Injected: 1 (saved through the API).', 'Create a ticket that fires the rule.'],
    'Header names and values with line breaks are refused at save, and reserved headers such as Host are refused. Only the configured headers are sent.',
    'The receiver got two headers: x-qa: a and injected: 1. A Host header override is also accepted (the dispatch then stays Pending with "The SSL connection could not be established").',
    null, [], 'Need webhook.site screenshot of the two headers (from the 12 Nov run).', 'O4 (WF-01)'],
  ['D-09', 'Bug (no Zoho equivalent)', 'High', 'Workflow Rules | Script saved in an Add Comment action runs when an admin opens the rule',
    'An Add Comment body with HTML/script runs in the rule editor.',
    ['Save a rule (through the API) whose Add Comment body is <img src=x onerror="window.__xss=1">.', 'As an admin, open the rule in the editor.'],
    'The text is shown as plain text everywhere; no script runs.',
    'The script runs in the editor (window.__xss is set). The rules list, Execution History and the ticket comment are safe.',
    null, [[A + 'O1-editor-runs-script.png', 'TAVI: script ran in the editor']], '', 'O1 (WF-02)'],
  ['D-10', 'Bug (no Zoho equivalent)', 'High', 'Workflow Rules | Double-clicking Save & Activate creates two identical rules',
    'The Save button stays active while saving, so a double click makes two rules.',
    ['Settings › Workflow Rules › New Rule; fill a valid rule.', 'Double-click Save & Activate.'],
    'One rule is created; the button is disabled while the save is running.',
    'Two identical active rules were created (seen twice on 12 Nov).',
    null, [], 'Need screenshot of the list with the two identical rules (reproduce on staging, then delete).', 'G4 (WF-03)'],
  ['D-11', 'Bug (no Zoho equivalent)', 'Medium', 'Workflow Rules | Saving a rule silently overwrites a change made by someone else',
    'If the rule is changed in another tab while you edit it, your save overwrites that change with no warning.',
    ['Admin A opens a rule in the editor.', 'Meanwhile the rule is renamed in a second tab.', 'Admin A changes the description and clicks Save.'],
    'Admin A is told the rule changed and asked to reload; no change is lost.',
    'The save succeeds with no warning; the rename from the other tab is lost.',
    null, [[A + 'G5-save-no-conflict-warning.png', 'TAVI: rename lost after save']], '', 'G5 (WF-04)'],
  ['D-12', 'Bug (no Zoho equivalent)', 'Low', 'Workflow Rules | "Send happiness email" says Succeeded while ratings are off',
    'With Customer Happiness off, the action sends nothing but is logged as Succeeded with no reason.',
    ['Customer Happiness off.', 'Rule with action Send happiness email; create a matching ticket.', 'Open Execution History.'],
    'The run says it was skipped because ratings are off (the editor itself says "Nothing is sent while ratings … are switched off").',
    'SendHappinessEmail Succeeded, no reason, nothing in the ticket history.',
    null, [], 'Need Execution History screenshot.', 'I30 (WF-07)'],
  ['D-13', 'Bug (no Zoho equivalent)', 'High', 'Records API | 500 error when "kind" is not the first key of a field value',
    'Creating a record through the API fails with a server error when the JSON keys are in a different order.',
    ['POST /modules/{tickets}/records with a field value {"value":"x","kind":"string"}.', 'Repeat with {"kind":"string","value":"x"}.'],
    'Both are accepted (JSON key order must not matter).',
    'First call: 500. Second call: 201. Still 500 on 12 Nov.',
    null, [], 'API only: attach request/response text instead of an image.', 'API-T3 (old B-1)'],
  ['D-14', 'Bug (no Zoho equivalent)', 'Medium', 'Workflow Rules | Create Record action skips required fields and leaves the record without an owner',
    'A Create Record action makes records that break the module\'s own required-field rules.',
    ['Rule with action Create Record in Calls, leaving Name / Subject empty.', 'Fire the rule.'],
    'The rule cannot be saved without the required fields, or the run fails with a clear reason; the new record has a real owner.',
    'Calls are created with no Name / Subject and owner 00000000-…; the run says Succeeded. Still the same on 12 Nov.',
    null, [], 'Need screenshot of the created Call record.', 'I25 (old B-8)'],
];

const FILED = fs.existsSync(path.join(D, 'plane-filed-workflow.json')) ? JSON.parse(fs.readFileSync(path.join(D, 'plane-filed-workflow.json'), 'utf8')) : {};
const exists = p => fs.existsSync(path.join(D, p));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Workflow Plane Drafts</title><style>${css}
.draft{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:14px 0}.draft h3{font-size:17px}.fields{font-size:13px;color:var(--muted);margin:4px 0 8px}.todo{background:var(--warn-bg);color:var(--warn);border-radius:6px;padding:4px 8px;font-size:13px;display:inline-block;margin-top:6px}
.check{display:flex;gap:6px;align-items:center;font-size:13px;margin-top:8px;color:var(--muted)}</style></head><body><main>
<h1>Workflow Rules: Plane drafts for review</h1>
<p class="sub"><b>FILED 12 Nov 2026: ${Object.keys(FILED).length} items (NDC ids below). D-07 dropped after a recheck (TAVI history now shows the status change and the rule).</b> Original draft text kept below; the filed text was adjusted where the 12 Nov recheck narrowed an item (D-02 Field Update only, D-03 API only).</p><p class="sub"> 14 items proposed for Plane from the Desk automation-order run (A4, 11–12 Nov 2026), each checked against Zoho Desk. Read each one, tell me what to change, drop or merge; I file only after your OK.</p>
<div class="tw" style="padding:10px 14px"><b>Planned Plane fields for every item:</b> project NDC · type Bug · state Bug · module Desk · Sprint 15 · label Workflow · assignees as NDC-2811 · priority as shown. One annotated image per item (TAVI vs Zoho where Zoho has the feature), attached after creation. <br><b>Environment line:</b> ${esc(ENV)}</div>
<div class="tiles"><div class="tile"><b>${drafts.length}</b><span>drafts</span></div><div class="tile"><b>${drafts.filter(d => d[1].startsWith('Differs')).length}</b><span>differ from Zoho</span></div><div class="tile"><b>${drafts.filter(d => d[1].startsWith('Bug')).length}</b><span>real bugs, no Zoho equivalent</span></div><div class="tile"><b>${drafts.filter(d => d[2] === 'High').length}</b><span>High priority</span></div><div class="tile"><b>${drafts.filter(d => d[10]).length}</b><span>still need an image made</span></div></div>
<h2>List</h2>
<div class="tw"><table><tr><th>Draft</th><th>Priority</th><th>Group</th><th>Title</th><th>Case</th></tr>${drafts.map(d => `<tr><td><a href="#${d[0]}">${d[0]}</a><br><b>${FILED[d[0]] ? FILED[d[0]].seq : d[0] === 'D-07' ? 'dropped' : ''}</b></td><td>${pill(d[2], SEV[d[2]])}</td><td>${esc(d[1])}</td><td>${esc(d[3])}</td><td>${esc(d[11])}</td></tr>`).join('')}</table></div>
<h2>Drafts</h2>
${drafts.map(d => `<article class="draft" id="${d[0]}"><header><b>${d[0]}</b> ${pill(d[2], SEV[d[2]])} ${pill(d[1], d[1].startsWith('Differs') ? 'bad' : 'warn')} <span class="muted">case ${esc(d[11])}</span><h3>${esc(d[3])}</h3></header>
<p class="fields">Bug · ${d[2]} · Desk · Sprint 15 · label Workflow</p>
<h4>Summary</h4><p>${esc(d[4])}</p>
<h4>Steps to reproduce</h4><ol>${d[5].map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<div class="grid2"><div><h4>${d[8] ? 'Expected result (as in Zoho Desk)' : 'Expected result'}</h4><p>${esc(d[6])}</p></div><div><h4>Actual result</h4><p>${esc(d[7])}</p></div></div>
${d[8] ? `<h4>Zoho Desk</h4><p>${esc(d[8])}</p>` : ''}
<h4>Environment</h4><p class="muted">${esc(ENV)}</p>
${d[9].filter(i => exists(i[0])).map(i => `<details><summary>Evidence: ${esc(i[1])}</summary><a href="${i[0]}"><img loading="lazy" src="${i[0]}" alt="${esc(i[1])}"></a></details>`).join('')}
${d[10] ? `<span class="todo">Before filing: ${esc(d[10])}</span>` : ''}
</article>`).join('')}
<h2>Not in this batch</h2><ul>
<li>TAVI-only features (not Zoho parity bugs): M6 Execution History raw ids, L1 Test rule ignores the sample record, F9/F12 raw server text, B11 bulk-delete toast, B-4 webhook status, B-6 no menu link, B-7 scheduled actions, B-9 round robin by role. File only if you want TAVI's extras fixed.</li>
<li>P18 Add Ticket Followers skips agents silently: not compared with Zoho yet.</li>
<li>B-5 withdrawn (Zoho does the same). B-3 fixed. I4 was a staging outage.</li></ul>
<p class="muted">Source: report-workflow-bugs.html, report-workflow-findings.html, PROGRESS.md. Built 12 Nov 2026.</p>
</main></body></html>`;
fs.writeFileSync(path.join(D, 'report-workflow-plane-drafts.html'), html);
console.log('drafts', drafts.length, 'missing images', drafts.flatMap(d => d[9]).filter(i => !exists(i[0])).map(i => i[0]));
