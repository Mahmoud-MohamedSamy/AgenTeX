// Drafts (NOT filed) for the two findings from the NDC-2203 round-7 investigation (user, 27 Oct 2026: "draft the two findings").
// Renders the evidence images (apicard.js + annotate.js) and writes findings-draft.json + findings-draft.html. Nothing is sent to Plane.
// Usage: node scripts/draft-findings.js
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const run = (s, f) => execFileSync('node', [path.join(__dirname, s), f], { encoding: 'utf8' }).trim();
const P = (img, caption, crop, boxes, w = 1280, h = 720) => ({ img, caption, crop, w, h, boxes: boxes.map(([b, n, kind]) => ({ b, n, kind })) });
const card = (out, title, rows) => { const f = path.join(__dirname, 'cards', out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify({ out, host: 'staging-desk.taviportal.com', who: 'mahmoud.mahamed1515 (Desk Administrator); fedelav803 (Desk Agent) to read the tickets', date: '27 Oct 2026', title, rows }, null, 1)); return JSON.parse(run('apicard.js', f).replace(/^\S+\s+/, '')); };
const CB = (bx, r, n, kind) => [[272, bx[r[0]][1] - 4, 1570, bx[r[r.length - 1]][3] + 4], n, kind];
const ENV = 'staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · mahmoud.mahamed1515 (Desk Administrator), fedelav803 (Desk Agent)';

// ---------- Finding 1: false "Permission denied." ----------
const b1 = card('F1-permission-denied-api.png', 'Saving a ticket the saver cannot see afterwards: response vs what was stored', [
  ['form, owner = colleague', 'New Ticket form › Owner = Customer Experience Specialists 2 › Save', '403 PERMISSION_DENIED, toast "Permission denied.", form stays open — ticket #675 exists (owner = colleague)', 'bad'],
  ['same form saved twice', 'Save, toast, Save again', '403 + 403 → two tickets #676 and #677 (duplicates)', 'bad'],
  ['API, no rule', 'POST /modules/{Tickets}/records with owner = colleague / with team only', '403 both — tickets #671 and #672 exist', 'bad'],
  ['rule: assign to team', 'Create rule Owner Assignment › Team (runs inside the create)', '403 — tickets #605, #616, #617, #658 exist on the team', 'bad'],
  ['rule: assign to user', 'Create rule Owner Assignment › SpecificUser (runs 0.5 s after create)', '201 — #673; creator silently loses access, no message', 'info'],
  ['edit', 'PATCH on own ticket; Edit rule moves it to a team', '403 — edit saved, team set (#650)', 'bad'],
  ['control', 'Form without owner / team (unassigned)', '201 — #657 saved and opened', 'ok']]);
const f1 = { out: 'NDC-new-false-permission-denied-DRAFT.png', ticket: 'NEW BUG', label: 'DRAFT — NEW BUG', verdict: 'FAIL', date: '27 Oct 2026', env: ENV,
  title: 'Tickets | Save shows "Permission denied." although the ticket is created — users save again and create duplicates',
  panels: [
    P('i1-y7-filled.png', 'New Ticket form (admin, not an agent of Customer Support): Ticket Owner = a colleague (Customer Experience Specialists 2).', [284, 100, 996, 380], [[[944, 416, 1224, 462], 1, 'INFO'], [[1203, 106, 1258, 143], 2, 'INFO']]),
    P('i1-y7-after-2.png', 'After Save (twice): "Permission denied." and the form is still open, as if nothing was saved.', [284, 100, 996, 610], [[[975, 636, 1258, 698], 3, 'FAIL'], [[282, 110, 400, 140], 4, 'FAIL']]),
    P('i1-agent-duplicates.png', 'The same tickets seen by the colleague (Desk Agent): both saves were stored — #676 and #677 — plus #675, #673, #672, #671.', [260, 56, 1020, 500], [[[270, 115, 1275, 255], 5, 'FAIL'], [[270, 258, 1275, 543], 6, 'INFO']]),
    P('F1-permission-denied-api.png', 'Every save that leaves the ticket out of the saver\'s view answers 403, yet the write is committed.', [0, 0, 1600, Math.min(900, b1[b1.length - 1][3] + 16)], [CB(b1, [0, 1], 7, 'FAIL'), CB(b1, [2, 3], 8, 'FAIL'), CB(b1, [4], 9, 'INFO'), CB(b1, [5], 10, 'FAIL'), CB(b1, [6], 11, 'PASS')], 1600, 900)],
  rows: [
    ['1–2', 'Create a ticket for a colleague (form)', 'Saved; a success message, then e.g. "You don\'t have access to this ticket" or stay on the list', 'Toast "Permission denied.", form stays open', 'FAIL'],
    ['3–5', 'Click Save again', 'No second ticket', 'Second ticket created (#676, #677)', 'FAIL'],
    ['7–8', 'API create with another owner / team; team rule', '201 (or a clear "created, not visible" response)', '403 PERMISSION_DENIED, record created', 'FAIL'],
    ['9', 'Rule assigns to a user after create', 'Creator told the ticket moved', '201, silent loss of access', 'INFO'],
    ['10', 'Edit that moves the ticket away', 'Saved message', '403, edit saved', 'FAIL'],
    ['11', 'Control: unassigned ticket', 'Saved', 'Saved and opened (#657)', 'PASS']] };

// ---------- Finding 2: missing "Workflow rule ran" row ----------
const b2 = card('F2-rule-ran-row-api.png', 'Create rules, same action (private comment), only the condition differs — "Workflow rule ran" row in Ticket History', [
  ['normal fields', 'No condition (#651) · description contains (#652) · Due Date before now (#655) · Status = Open (#668) · not Priority High (#669)', 'Rule Fired, comment "by workflow rule …", "Workflow rule ran" row written', 'ok'],
  ['rule facts', 'Is Overdue (#653) · Execution Time (#654) · Recent Comment (#661) · Thread count (#666) · Comment count (#667)', 'Rule Fired (Execution History), comment "by workflow rule …", NO "Workflow rule ran" row', 'bad'],
  ['mixed', 'description contains AND Is Overdue (#662)', 'Fired, NO row — one fact in the condition is enough', 'bad'],
  ['Edit rule', 'Is Overdue = true on an Edit rule (#665)', 'Fired, row written — only Create rules are affected', 'ok'],
  ['timing', 'Waited 45–60 s; execution records compared', 'Row never appears; execution records identical with and without the row', 'info']]);
const f2 = { out: 'NDC-new-rule-ran-row-missing-DRAFT.png', ticket: 'NEW BUG', label: 'DRAFT — NEW BUG', verdict: 'FAIL', date: '27 Oct 2026', env: ENV,
  title: 'Workflow Rules | Create rules whose condition uses Is Overdue, Execution Time, Recent Comment or thread/comment counts write no "Workflow rule ran" row in Ticket History',
  panels: [
    P('i2-history-od653.png', '#653 — Create rule "Is Overdue = true" ran: its comment is in History "by workflow rule QA WF V2od"…', [664, 230, 616, 230], [[[708, 300, 1100, 398], 1, 'INFO']]),
    P('i2-history-bottom-od653.png', '…but the end of the History has no "Workflow rule ran" row (last row = "Ticket was created").', [664, 270, 616, 380], [[[708, 520, 1110, 640], 2, 'FAIL']]),
    P('i2-history-bottom-status668.png', 'Control #668 — same action, condition "Status = Open": "Workflow rule ran · Rule QA WF X3status · A new ticket · Add comment".', [664, 370, 616, 280], [[[708, 503, 960, 627], 3, 'PASS']]),
    P('F2-rule-ran-row-api.png', 'Which conditions lose the row (11 rules, 1 action each).', [0, 0, 1600, Math.min(900, b2[b2.length - 1][3] + 16)], [CB(b2, [0], 4, 'PASS'), CB(b2, [1, 2], 5, 'FAIL'), CB(b2, [3], 6, 'PASS'), CB(b2, [4], 7, 'INFO')], 1600, 900)],
  rows: [
    ['1–2', 'Create rule with Is Overdue ran', 'History has "Workflow rule ran · Rule · Triggered by · Actions"', 'Only the comment "by workflow rule …"; no rule-ran row', 'FAIL'],
    ['3–4', 'Same rule with a normal field', 'Row written', 'Row written', 'PASS'],
    ['5', 'Execution Time, Recent Comment, Thread / Comment count, mixed', 'Row written', 'No row', 'FAIL'],
    ['6', 'Is Overdue on an Edit rule', 'Row written', 'Row written', 'PASS'],
    ['7', 'Wait / execution record', 'Row appears later', 'Never appears; records identical', 'INFO']] };

const specs = [f1, f2]; for (const s of specs) { const f = path.join(__dirname, 'specs', s.out.replace('.png', '.json')); fs.writeFileSync(f, JSON.stringify(s, null, 1)); console.log(run('annotate.js', f)); }

// ---------- Descriptions (Plane HTML) ----------
const d1 = `<p><strong>Summary.</strong> When a user saves a ticket that, after the save, they are no longer allowed to see (owner = a colleague, a team they are not in, or a workflow rule moves it there), Desk answers <code>403 PERMISSION_DENIED</code> and shows "Permission denied." — but the ticket is created / the edit is saved. On the New Ticket form the form stays open, so users click Save again and create duplicates.</p>
<h3>Steps to reproduce</h3><ol>
<li>Sign in as a user who is not an agent of Customer Support but can create tickets (here: Desk Administrator mahmoud.mahamed1515; sees own + unassigned tickets).</li>
<li>Tickets › New Ticket (Standard) › Department Customer Support, Email, Subject, Status Open, <strong>Ticket Owner = a colleague</strong> (Customer Experience Specialists 2) › Save.</li>
<li>Click Save again.</li>
<li>Sign in as the colleague and open All Tickets.</li></ol>
<h3>Expected</h3><ul><li>The ticket is saved once with a success message; if the saver can't open it afterwards, say so ("Ticket created. You don't have access to it.") and leave the form (go back to the list). Never report an error for a write that succeeded.</li><li>API: 201 with the id (or a documented response for "created but not visible"), not 403.</li></ul>
<h3>Actual</h3><ul>
<li>Step 2: toast "Permission denied." (POST /api/v1/modules/{Tickets}/records → 403), form stays open. Ticket #675 exists.</li>
<li>Step 3: same 403 again → a second ticket. #676 and #677 both exist with the same subject.</li>
<li>Same 403 with the record created: API create with another owner (#671) or with a team and no owner (#672); a Create rule "Assign to team" (#605, #616, #617, #658); an Edit rule that moves the ticket to a team (#650, edit saved).</li>
<li>A Create rule "Assign to specific user" returns 201 (#673) because it runs after the create; the creator silently loses access.</li>
<li>Control: the same form with no owner/team (unassigned) → 201, the ticket opens (#657).</li></ul>
<h3>Impact</h3><p>Duplicate tickets (customers may get two acknowledgements), users believe the save failed, API clients retry. Any admin or agent creating a ticket for a colleague or a team hits it.</p>
<h3>Suggested fix</h3><ol><li>Check visibility of the response separately from the write: return 201/200 with the id and a flag (e.g. <code>accessible:false</code>) instead of 403 after committing.</li><li>UI: on that flag show "Ticket created and assigned to …" and close the form.</li></ol>
<p><strong>Environment:</strong> staging-desk.taviportal.com, tenant NDC-Staging, Edge + API, 27 Oct 2026. Found while retesting NDC-2203 (D1 Assign to team).</p><p><strong>Evidence:</strong> ${f1.out} (attached).</p>`;
const d2 = `<p><strong>Summary.</strong> A workflow rule on Tickets with trigger "On create" whose condition uses a computed rule fact — Is Overdue, Execution Time, Recent Comment (and its type), Number of Threads, Number of Comments — runs and its actions are done, but Ticket History gets no "Workflow rule ran" row. The same rule with a normal field in the condition writes the row, and the same fact in an "On edit" rule writes it too.</p>
<h3>Steps to reproduce</h3><ol>
<li>Setup › Automation › Workflow Rules › Tickets › new rule: On create, condition <strong>Is Overdue is true</strong>, action Add comment (private) › Save & Activate.</li>
<li>Create a ticket with a due date of yesterday.</li>
<li>Open the ticket › History.</li>
<li>Repeat with the condition <strong>Status is Open</strong> instead (control).</li></ol>
<h3>Expected</h3><ul><li>Every rule run writes "Workflow rule ran · Rule &lt;name&gt; · Triggered by A new ticket · Actions …" (as fixed in NDC-2203), whatever fields the condition uses.</li></ul>
<h3>Actual</h3><ul>
<li>Is Overdue (#653), Execution Time (#654), Recent Comment (#661), Thread count (#666), Comment count (#667), and description AND Is Overdue (#662): Execution History shows Fired, the comment is in History "by workflow rule …", but there is no "Workflow rule ran" row (waited 45–60 s).</li>
<li>Control: no condition (#651), description (#652), Due Date before now (#655), Status (#668), Priority (#669) → the row is written.</li>
<li>Is Overdue in an On edit rule (#665) → the row is written. Execution records are identical with and without the row.</li></ul>
<h3>Impact</h3><p>History does not explain why a ticket changed for rules that use these conditions; audits and support investigations miss the rule.</p>
<h3>Suggested fix</h3><p>Write the "Workflow rule ran" history entry from the same place for every Create-rule execution, including the path that evaluates rule facts.</p>
<p><strong>Environment:</strong> staging-desk.taviportal.com, tenant NDC-Staging, Edge + API, 27 Oct 2026. Found while retesting NDC-2203 (F4).</p><p><strong>Evidence:</strong> ${f2.out} (attached).</p>`;
const drafts = [
  { name: f1.title, priority: 'high', labels: ['Tickets'], module: 'Desk', assignees: ['MahmoudMohamed', 'Hegazy'], state: 'Bug', html: d1, img: f1.out },
  { name: f2.title, priority: 'medium', labels: ['Workflow Rules'], module: 'Desk', assignees: ['MahmoudMohamed', 'Hegazy'], state: 'Bug', html: d2, img: f2.out }];
fs.writeFileSync(path.join(RUN, 'findings-draft.json'), JSON.stringify(drafts, null, 1));
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', n)).toString('base64');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bug Drafts NDC-2203 Findings</title><style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#111827;--mute:#6b7280;--line:#e5e7eb}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1200px;margin:0 auto;padding:24px 16px 64px}section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}
h2{font-size:18px;margin:0 0 6px}.meta{color:var(--mute);font-size:13px;margin-bottom:10px}.cm{border-left:3px solid var(--line);padding-left:12px}img{width:100%;border:1px solid var(--line);border-radius:8px;margin-top:10px}code{background:rgba(127,127,127,.15);padding:0 4px;border-radius:4px}</style></head><body><main>
<h1>Bug drafts — findings from the NDC-2203 retest (27 Oct 2026)</h1><p>Not filed. On approval each is created in Plane as below, added to module Desk, and the image attached.</p>
${drafts.map((d, i) => `<section><h2>Draft ${i + 1}: ${esc(d.name)}</h2><div class="meta">State ${d.state} · priority ${d.priority} · label ${d.labels.join(', ')} · module ${d.module} · assignees ${d.assignees.join(', ')}</div><div class="cm">${d.html}</div><img src="${img(d.img)}" alt="${esc(d.img)}"></section>`).join('')}</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'findings-draft.html'), html); console.log('findings-draft.html', Math.round(html.length / 1024), 'KB');
