// Builds report/index.html from cases.js + out/sheet-results.json + report/template.html.  node report/build.js
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../../..');
const C = require(ROOT + '/docs/layout-rules/cases.js');
const R = require(ROOT + '/executions/execu_2026-11-12_layout-rules/out/sheet-results.json');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const scrub = s => String(s ?? '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g, '<email>');
const G = Object.fromEntries(C.groups.map(g => [g[0], g[1]]));
const ST = { pass: 'Pass', fail: 'Fail', gap: 'Missing', info: 'Info', blocked: 'Blocked', none: 'Not run' };
const cases = C.cases.map(c => { const r = R[c[0]] || { status: 'none', notes: 'Not run: no result recorded.' }; return { id: c[0], grp: c[1], app: c[2], title: c[3], steps: c[4], exp: c[5], pri: c[6], via: c[7], st: r.status, notes: scrub(r.notes) }; });
// per-app verdicts from the notes ("CRM PASS: ..." / "DESK FAIL: ...")
const per = { CRM: {}, Desk: {} }; const V = { PASS: 'pass', FAIL: 'fail', GAP: 'gap', INFO: 'info', BLOCKED: 'blocked', NOTRUN: 'none' };
for (const c of cases) {
  let hit = false;
  for (const [k, a] of [['CRM', 'CRM'], ['DESK', 'Desk']]) { const m = c.notes.match(new RegExp('(^|\\n)' + k + ' (PASS|FAIL|GAP|INFO|BLOCKED|NOTRUN)')); if (m) { hit = true; const v = V[m[2]]; per[a][v] = (per[a][v] || 0) + 1; } }
  if (!hit) { const a = c.app === 'Desk' ? 'Desk' : 'CRM'; per[a][c.st] = (per[a][c.st] || 0) + 1; }
}
const tot = {}; for (const c of cases) tot[c.st] = (tot[c.st] || 0) + 1;

// [id, severity, app, case ids, title, steps, expected (Zoho), actual (TAVI), evidence]
const bugs = [
 ['B-01', 'High', 'CRM, Desk API', ['G7', 'Z6'], 'Mass update of the primary field skips rule-mandatory fields', 'Set up a rule: type = Refund makes "order" mandatory. In the list, select 2 records and mass-update type to Refund, leaving order empty.', 'Zoho blocks mass update of a field that is the primary field of a layout rule.', 'Both records are saved as Refund with order empty (200). The single-record API refuses the same change (422).', ''],
 ['B-02', 'High', 'CRM', ['G4'], 'Inline edit gives no way to fill a field the rule makes mandatory', 'Open a record. Inline-edit type to Refund and confirm.', 'Zoho opens a "Review Details" pop-up asking for the mandatory field, with Cancel and Save.', 'TAVI shows "QA LR1112 order is required." and offers no way to fill it. The change cannot be saved from the record page.', 'crm-G4-inline-after.png · zoho-G4-picked.png'],
 ['B-03', 'High', 'CRM Deals', ['G9'], 'Deal stage bar refuses a stage change with no way to fill the mandatory field', 'Rule on a Deals layout: Stage = Negotiation and discount > 20 makes the approval note mandatory. On the deal page click the Negotiation stage.', 'Zoho asks for the mandatory field in a pop-up before moving the stage.', 'TAVI refuses with "approval note is required" and opens no form. The deal stays in Qualification. Same pattern as B-02.', 'crm-G9.png'],
 ['B-04', 'High', 'CRM', ['G10'], 'Blueprint transition ignores the layout rule\'s mandatory field', 'Blueprint on the QA layout moves type Question to Refund. Rule: Refund makes order mandatory. Run the transition with order empty.', 'Zoho shows the layout rule\'s mandatory fields inside the transition form.', 'The transition form asks only for message, attachment and note. The record moves to Refund with order empty.', 'crm-G10-dialog.png'],
 ['B-05', 'High', 'Desk', ['G16', 'C14'], 'Desk rule limited to a department still runs in every department', 'Rule "vip" limited to Customer Support. Open the ticket create form for Sales or HR and tick vip.', 'The rule runs only for tickets of the chosen department.', 'departmentIds is saved, but the rule runs for Sales and HR too (date shows when vip is ticked).', 'desk-G16-dept.png'],
 ['B-06', 'High', 'CRM, Desk', ['D5'], 'A rule on a user field (Lead Owner) never fires', 'Rule: Lead Owner is ndc-staging-owner, then show order. Open the create form with that owner, then pick another user and pick the owner back.', 'Zoho applies rules on user lookup fields.', 'The rule saves and reads back correctly, but order never shows on the form.', 'crm-D5.png'],
 ['B-07', 'High', 'CRM, Desk', ['D6'], '"Is empty" condition rows never match', 'Rule row: email2 is empty (with radio = No), then show reason. Open the form with email2 empty; type something and clear it.', 'Zoho\'s "is empty" and "is not empty" rows apply on the form.', 'reason stays hidden in every state. The API also saves op "isEmpty" as "isNull" without saying so.', 'crm-D6.png'],
 ['B-08', 'High', 'CRM, Desk', ['D9', 'D10', 'D11', 'D12'], 'The rule editor cannot build text, number, date, regex or length rows', 'Open the rule editor, add a condition row and open its field list.', 'Zoho lets condition rows use any field type.', 'The row field list offers only choice and user fields. Rows built through the API work on the form, but the editor shows them as "qa_lr_text (unknown field)".', 'crm-C20-fields.png'],
 ['B-09', 'High', 'CRM, Desk', ['J3'], 'Removing one target field from the layout switches off the whole rule', 'Remove "date" (a target of the vip rule) from the layout. Tick vip.', 'Only the missing target is flagged. The rest of the rule keeps working.', 'The whole rule stops: note is no longer mandatory. Other rules that mention date in one row stop too. The same happens when a section is deleted (J6) or an option is deleted (J8).', 'crm-J3.png · crm-J3-editor.png · crm-J6.png · crm-J8.png'],
 ['B-10', 'Medium', 'CRM, Desk', ['J4'], 'Deleting a field used by a rule is allowed, and the whole rule stops', 'Delete a field that is one target of the "basic" rule.', 'Zoho Desk blocks deleting a field a rule uses.', 'DELETE returns 204. The whole rule stops: order is always visible and no longer mandatory for Refund. Same root as B-09.', ''],
 ['B-11', 'Medium', 'CRM, Desk', ['J7'], 'Deleting a layout leaves its rules behind, still active', 'Delete a layout that has a rule.', 'Zoho removes a layout\'s rules with the layout.', 'The rule stays "active" in the list and API with definitionError "Layout ... is not a layout of this module."', ''],
 ['B-12', 'High', 'CRM', ['K9'], 'A field hidden by field permission leaks its value in the record timeline', 'Hide the date field for profile User. Sign in as a CRM User and open a record where the owner set date.', 'The hidden field\'s value is not shown anywhere to that profile.', 'The record API and field panel hide it, but Recent activity shows "QA LR1112 date was updated from blank value to 2026-05-01". This is a field-permission bug, found while testing layout rules.', 'crm-K9-timeline.png'],
 ['B-13', 'Medium', 'CRM', ['A2'], 'A CRM User without customize permission can see the rule list', 'Sign in as a CRM User (profile User). Open Settings > Modules and Fields > Leads > Layout Rules by URL.', 'Zoho lets only users with Customize permission reach Layout Rules.', 'The full list shows: names, layouts, primary fields, condition counts. Writes are refused (403).', 'crm-A2-low.png'],
 ['B-14', 'High', 'CRM', ['E6', 'Z12'], 'A value typed into a field that the rule then hides is dropped on create', 'On the create form type "QA keep me" in order, change type so order becomes hidden, then Save.', 'Zoho keeps the typed value (checked live with Fax).', 'The record saves with order empty. On edit TAVI keeps the old value, which matches Zoho.', 'zoho-E6-before-save.png'],
 ['B-15', 'Medium', 'CRM', ['F5'], 'Filter options replace the map dependency instead of narrowing it', 'Map dependency type to tier (Refund allows Gold, Bronze). Rule: filter X limits tier to Gold, Silver. Pick Refund, then X.', 'Zoho applies the map dependency first, then the rule, so only Gold shows.', 'tier offers Gold and Silver. Silver is not allowed by the map dependency and Bronze is dropped.', 'crm-F5.png'],
 ['B-16', 'Low', 'CRM, Desk', ['F15', 'F16', 'Z8'], 'Conflicting actions on one field are accepted', 'In one condition add set value + suggest value on the same field. In another, add mandatory + read-only on the same field.', 'Zoho refuses both setups (checked live: INVALID_DATA for read-only on a field already mandatory).', 'Both are saved (201).', ''],
 ['B-17', 'Low', 'CRM, Desk', ['I8', 'F27'], 'No limit on actions per condition', 'Create a condition with 500 actions through the API.', 'Zoho stops at 40 actions per condition (CRM) and 25 (Desk), with a message.', 'All 500 are accepted (201).', ''],
 ['B-18', 'Low', 'CRM, Desk API', ['K3', 'K2'], 'Deleting a rule the caller cannot reach returns 204 but deletes nothing', 'DELETE /modules/<other module>/layout-rules/<rule id>. Also: sign in as another tenant\'s owner and DELETE this tenant\'s rule id.', '404, the same as GET and PUT in both cases.', '204 No Content. The rule is not deleted (data is safe), but the caller is told it worked when it did not.', ''],
 ['B-19', 'Low', 'CRM', ['M5'], 'Screen readers are not told a rule-mandatory field is required', 'Pick Refund so order becomes mandatory. Inspect the order input.', 'The input carries aria-required or required.', 'Only a visual asterisk is shown. The input has no aria-required.', '']
];
const failIds = new Set(cases.filter(c => c.st === 'fail').map(c => c.id)); const covered = new Set(bugs.flatMap(b => b[3]));
const missingCover = [...failIds].filter(x => !covered.has(x)); if (missingCover.length) console.error('FAIL not covered:', missingCover);

const gaps = [
 ['Z1', 'CRM', 'The primary field can only be a choice field (pick list, radio, checkbox, status, user). Zoho CRM also allows single line, currency, email and others. Confirmed live with Designation, Annual Revenue and Email.'],
 ['Z2', 'Desk', 'The Desk primary field can only be a pick list, checkbox, status, user, department or team. Zoho Desk also allows text, number, date and email fields.'],
 ['G21', 'CRM', 'A record cannot be moved to another layout. The edit page has no layout picker and PATCH with layout_id is ignored. Zoho has a Layout dropdown on edit, and the new layout\'s rules apply.'],
 ['Z5', 'CRM', 'Blueprint transitions do not run layout-rule "mandatory" (see B-04). Zoho shows those fields in the transition form.'],
 ['A6', 'CRM', 'No permission lets a non-admin manage layout rules. Giving profile User metadata.modules.manage still gives 403; only metadata.acl.manage (global Admin) works. Zoho has a profile permission (Customize / Manage Layouts and Fields) for this.'],
 ['Z9', 'Desk', 'Apply to Help Center does not require the primary field on the Help Center form. A form without it saves with no warning, and the rule silently does nothing there. Zoho Desk requires the primary field to be visible in the Help Center.'],
 ['Z11', 'CRM', 'Suggest and verify pop-ups are not remembered. TAVI shows them again to every user after someone pressed Ignore. Zoho shows them only until one user acts.'],
 ['Z6', 'Both', 'Mass update of a rule\'s primary field is not blocked (see B-01).'],
 ['Z8', 'Both', 'Some setup checks Zoho has are missing: set and suggest on one field, and mandatory and read-only on one field (see B-16). The "one active rule per primary field" check matches Zoho.'],
 ['Z12', 'Both', 'A typed value in a field that becomes hidden is not kept on create (see B-14).']
];
const unblock = { A3: 'A Desk Agent account (all staging Desk users are Administrators), or OK to lower one user\'s profile.', A4: 'Same as A3, for the Desk half. The CRM half passed.', G17: 'The Help Center accepts tickets only from signed-in customers (access mode sign_in_to_submit), and sign-up needs an emailed link plus a captcha. Needs a Help Center customer account (email and password), or an OK to switch the access mode to open during the test (auto mode refused that change).', G18: 'Same as G17.', G19: 'Same as G17.', X2: 'Same as G17.', Z9: 'Same as G17.', Z13: 'A TAVI mobile app (none exists). Skipped on request.', K2: 'An account in another tenant on NDC-Staging.', G8: 'A fix for the Kanban view: on 12 Nov (rechecked) every column still fails with 500 on Leads and Deals. Filed as a bug.', Z4: 'Same as G8 (Kanban view bug). The stage-bar half was covered in G9.', K8: 'A second Leads layout with its own rule, to borrow ids from.', A6: 'Your OK to temporarily grant metadata.modules.manage to profile User and revert it. Auto mode refused the grant.', B4: 'Manual UI check of the layout, status and department filters (no result recorded).' };
const blocked = [...cases.filter(c => c.st === 'blocked'), ...cases.filter(c => c.st === 'none')];
const info = cases.filter(c => c.st === 'info');
const side = [
 ['Kanban view fails on Leads and Deals', 'GET /modules/{id}/records?filters=[pipeline eq ...] returns 500 INTERNAL_ERROR, and every column shows "Could not load these records".', 'crm-G8.png · crm-G9-kanban.png'],
 ['Lead conversion page says nothing on a 422', 'Converting with stage Closed Lost: the server refuses (422: amount, closing date and reason required), but the page shows no message.', 'crm-G15-convert.png'],
 ['Hosted web-form link returns nginx 404', 'Already known as NDC-1488. The iframe embed URL works.', ''],
 ['Related-lists picker shows duplicate entries', 'The "Show related lists" picker in the rule editor lists module relations many times, for example "Leads (Lookup)" repeated.', 'crm-F21-pick.png']
];
const DATA = { cases: cases.map(c => ({ id: c.id, grp: c.grp, grpName: G[c.grp], app: c.app, title: c.title, steps: c.steps, exp: c.exp, st: c.st, notes: c.notes })), st: ST };

const stChip = s => `<span class="st st-${s}">${ST[s]}</span>`;
const n = (o, k) => o[k] || 0;
const firstReason = c => { const m = c.notes.match(/(?:BLOCKED|NOTRUN): ([^\n]*)/); return (m ? m[1] : c.notes).slice(0, 280); };
const bugRows = bugs.map(b => `<article class="bug" id="${b[0]}"><header><span class="bid">${b[0]}</span><span class="sev sev-${b[1].toLowerCase()}">${b[1]}</span><span class="tag">${esc(b[2])}</span><span class="cids">Cases ${b[3].join(', ')}</span></header><h3>${esc(b[4])}</h3><dl><dt>Steps</dt><dd>${esc(b[5])}</dd><dt>Expected (Zoho)</dt><dd>${esc(b[6])}</dd><dt>Actual (TAVI)</dt><dd>${esc(b[7])}</dd>${b[8] ? `<dt>Evidence</dt><dd class="ev">${esc(b[8])}</dd>` : ''}</dl></article>`).join('\n');
const gapRows = gaps.map(g => `<li><span class="cid">${g[0]}</span><span class="tag">${g[1]}</span><span class="txt">${esc(g[2])}</span></li>`).join('');
const blRows = blocked.map(c => `<tr><td class="cid">${c.id}</td><td>${c.app}</td><td>${esc(c.title)}</td><td>${stChip(c.st)}</td><td>${esc(firstReason(c))}</td><td>${esc(unblock[c.id] || '')}</td></tr>`).join('');
const noteTxt = c => [...new Set(c.notes.split('\n').map(s => s.trim()).filter(Boolean))].map(s => s.replace(/^(CRM|DESK) (INFO|PASS|FAIL|GAP|BLOCKED|NOTRUN): /, (m, a) => a === 'DESK' ? 'Desk: ' : (/DESK /.test(c.notes) ? 'CRM: ' : ''))).join(' ').slice(0, 700);
const infoRows = info.map(c => `<li><span class="cid">${c.id}</span><span class="txt"><b>${esc(c.title)}</b> <span class="tag">${esc(c.app)}</span><br>${esc(noteTxt(c))}</span></li>`).join('');
const sideRows = side.map(s => `<li><b>${esc(s[0])}.</b> ${esc(s[1])}${s[2] ? ` <span class="ev">${esc(s[2])}</span>` : ''}</li>`).join('');
const sumRow = (lbl, o) => `<tr><th scope="row">${lbl}</th>${['pass', 'fail', 'gap', 'info', 'blocked', 'none'].map(k => `<td>${n(o, k)}</td>`).join('')}</tr>`;

let html = fs.readFileSync(__dirname + '/template.html', 'utf8');
const rep = { TOTAL: cases.length, PASS: n(tot, 'pass'), FAIL: n(tot, 'fail'), GAP: n(tot, 'gap'), INFO: n(tot, 'info'), BLOCKED: n(tot, 'blocked'), NONE: n(tot, 'none'), NBUGS: bugs.length, HIGH: bugs.filter(b => b[1] === 'High').length, MED: bugs.filter(b => b[1] === 'Medium').length, LOW: bugs.filter(b => b[1] === 'Low').length, NGAPS: gaps.length, NBL: blocked.length, NB: n(tot, 'blocked'), NNR: n(tot, 'none'), SUMROWS: sumRow('CRM', per.CRM) + sumRow('Desk', per.Desk), BUGS: bugRows, GAPS: gapRows, BLOCKED_ROWS: blRows, INFO_ROWS: infoRows, SIDE: sideRows, NOTGAPS: C.gaps_not.map(x => `<li>${esc(x)}</li>`).join(''), DATA: JSON.stringify(DATA).replace(/</g, '\\u003c') };
html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in rep ? String(rep[k]) : m));
fs.writeFileSync(__dirname + '/index.html', html);
let f = html.replace('<title>Layout Rules Run Report</title>', '<title>Layout Rules Findings</title>');
for (const s of ['what', 'notgaps', 'all']) f = f.replace(new RegExp('<section aria-labelledby="' + s + '">[\\s\\S]*?</section>\\s*'), '');
f = f.replace(/<script>[\s\S]*?#cases tbody[\s\S]*?<\/script>/, '');
fs.writeFileSync(__dirname + '/findings.html', f);
console.log('ok', html.length, 'bytes', JSON.stringify(tot), JSON.stringify(per));
