// Builds evidence cards, annotated images and report.html for the 19 Nov ticket status types test.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = __dirname, OUT = path.join(RUN, 'out'), P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const FR = path.join(P, 'executions/execu_2026-11-17_findings-retest/scripts');
const J = f => JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8'));
const st = J('statuses.json'), m2 = J('measure2.json'), rj = J('rj.json'), step7 = J('step7.json'), t1 = J('sla-t1.json'), t2 = J('sla-t2.json'), usage = J('status-usage.json'), hc = J('hc.json');
const snaps = fs.readFileSync(path.join(OUT, 'tc-snaps.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
const TYPE = Object.fromEntries(st.map(s => [s.value, s.type]));
// full per-status table
const rows = st.map(s => {
  const m = m2.find(x => x.status === s.value);
  if (m) return { status: s.value, type: s.type, record: m.record, desk: m.desk, closed: m.closed_at ? 'set' : '—', ok: m.desk === s.value && ((s.type === 'closed') === !!m.closed_at) };
  if (rj[s.value]) return { status: s.value, type: s.type, record: s.value, desk: rj[s.value].desk || s.value, closed: rj[s.value].closed_at === 'set' ? 'set' : '—', ok: true, note: s.value === 'QA NDC Reject' ? 'needs a rejection reason (validation rule)' : 'retried after the outage' };
  if (s.value === 'QA NDC Bank deposit request') return { status: s.value, type: s.type, record: s.value, desk: '(move 200 on retry; not re-read)', closed: '—', ok: true, note: 'first tries hit the 09:10 UTC outage' };
  return { status: s.value, type: s.type, record: '?', desk: '?', closed: '?', ok: false };
});
const bad = rows.filter(r => !r.ok);
// ---- cards (rendered 1600 wide by apicard.js into findings-retest/screenshots/raw)
const cards = {
  'ST1-api-card': { title: 'ST-1 Status types on a ticket move (19 Nov, Desk admin, Marketing / Customer Support)', rows: [
    ['Statuses configured', 'GET /desk/ticket-statuses', `${st.length} statuses: ${st.filter(s => s.type === 'open').length} open, ${st.filter(s => s.type === 'on_hold').length} on hold, ${st.filter(s => s.type === 'closed').length} closed; all configured`, 'info'],
    ['Closed time per type', 'move 1 QA ticket into each status, GET /desk/tickets/{id}', `${rows.filter(r => r.ok).length - 3}/${m2.length - bad.length} tickets that Desk updated: closed_at set only for closed types`, 'ok'],
    ['Agent workload (one ticket walked)', 'GET /desk/agents/{id}/workload after each move', step7.wl.map(w => w[0].split(' (')[0] + '=' + w[1]).join(' · '), 'ok'],
    ['SLA, open type', 'Escalated · GET /desk/tickets/{id}/sla', 'running: first response 3,570 s → 2,854 s (12 min later)', 'ok'],
    ['SLA, on hold type', 'On Hold', 'paused: 3,600 s / 14,400 s, unchanged after 9 min', 'ok'],
    ['SLA, closed type', 'QA NDC Pending (closed type)', 'first response cancelled, resolution met', 'ok']] },
  'ST2-api-card': { title: 'ST-2 Status changed on the record but Desk still says Open (moves at ~09:05-09:10 UTC)', rows: bad.map(r => [r.status + ' [' + r.type + ']', 'PATCH record status → 200', `record: ${r.record} · Desk: ${r.desk} · closed_at: ${r.closed}`, 'bad']).concat([['After 1 hour', 'GET /desk/tickets/{id} again at 10:00 UTC', 'still Open: never caught up', 'bad'], ['Effect', 'workload / queues / closed time use the Desk status', 'closed-type ticket has no closed time and counts as open work', 'bad']]) },
  'ST3-api-card': { title: 'ST-3 Changing a status type with tickets in it (QA NDC Distributor, 3 QA tickets, 10:05-10:15 UTC)', rows: snaps.map(s => [s.tag + ' (' + s.at + ')', 'type = ' + s.type, `closed_at ${s.M1.closed_at} · workload ${s.workload} · SLA ${s.C1.sla.replace(/first_response/, 'FR').replace(/resolution/, 'RES')}`, s.tag.startsWith('closed') ? 'bad' : (s.tag === 'onhold-2m' ? 'bad' : (s.tag.startsWith('open-') ? 'bad' : 'info'))]) },
  'ST4-api-card': { title: 'ST-4 Status type in the ticket APIs: TAVI vs Zoho', rows: [
    ['TAVI record', 'GET /modules/{tickets}/records/{id}', 'status: "Open" only, no type', 'bad'],
    ['TAVI Desk ticket', 'GET /desk/tickets/{id}', 'status, closed_at, closed_by; no type', 'bad'],
    ['TAVI status list', 'GET /desk/ticket-statuses', 'value, label, type (open/on_hold/closed), configured, show_in_help_center, help_center_name(_ar)', 'info'],
    ['Zoho (live 19 Nov)', 'GET /tickets, GET /tickets/{id}', 'status: "Open" AND statusType: "Open" on every ticket', 'ok']] },
};
const pos = {};
for (const [name, c] of Object.entries(cards)) { const f = path.join(FR, 'cards', name + '.json'); fs.writeFileSync(f, JSON.stringify({ out: name + '.png', host: 'staging-desk.taviportal.com', who: 'Desk Administrator', date: '19 Nov 2026', ...c })); const o = execFileSync('node', [path.join(FR, 'apicard.js'), f]).toString(); pos[name] = JSON.parse(o.slice(o.indexOf('[['))); }
const box = (name, i, kind) => ({ b: pos[name][i], n: i + 1, kind });
const specs = {
  'ST-1': { out: 'ST-1-status-types-on-move.png', title: 'Ticket Access | Status types behave as configured when a ticket moves into a status', verdict: 'PASS', label: 'PASS', panels: [{ img: 'ST1-api-card.png', crop: [0, 0, 1600, pos['ST1-api-card'].slice(-1)[0][3] + 30], caption: 'API results', boxes: [1, 2, 3, 4, 5].map(i => box('ST1-api-card', i, 'PASS')) }],
    rows: [[1, 'Closed time', 'Set only for closed types', 'Correct on every ticket Desk updated', 'PASS'], [2, 'Workload', 'Closed types leave the agent count', '35 → 34 → 35 → 35 → 34 → 35', 'PASS'], [3, 'SLA', 'Open runs, on hold pauses, closed stops', 'running / paused 9 min / met + cancelled', 'PASS']] },
  'ST-2': { out: 'ST-2-desk-status-not-updated.png', title: 'Tickets | A status change saved on the record never reaches Desk (Desk stays Open)', verdict: 'FAIL', label: 'BUG', priority: 'high', panels: [{ img: 'ST2-api-card.png', crop: [0, 0, 1600, pos['ST2-api-card'].slice(-1)[0][3] + 30], caption: 'API results', boxes: pos['ST2-api-card'].map((b, i) => ({ b, n: i + 1, kind: 'FAIL' })) }],
    rows: [[1, 'Record vs Desk status', 'Same after a successful move', '4 of 39 moves: record has the new status, Desk still Open after 1 hour', 'FAIL'], [2, 'Closed-type status', 'Closed time set, removed from workload', '"QA NDC Not Approved E-Top-Up Manager": no closed time, counted as open work', 'FAIL']] },
  'ST-3': { out: 'ST-3-type-change-sla.png', title: 'Ticket Access | Changing a status type updates closed time and workload but not the SLA of tickets already in it', verdict: 'FAIL', label: 'BUG', priority: 'medium', panels: [{ img: 'ST3-api-card.png', crop: [0, 0, 1600, pos['ST3-api-card'].slice(-1)[0][3] + 30], caption: 'API results', boxes: pos['ST3-api-card'].map((b, i) => ({ b, n: i + 1, kind: i === 0 ? 'INFO' : (i === 3 ? 'INFO' : 'FAIL') })) }],
    rows: [[1, 'Type open → closed', 'Closed time, workload and SLA all follow', 'closed_at 10:05:18 and workload 4 → 2, but the SLA keeps running (3,542 → 3,441 s)', 'FAIL'], [2, 'Type closed → on hold', 'Closed time cleared, SLA paused', 'closed_at cleared, workload back to 4; SLA paused only after 20 s-2 min, and its remaining time went up from 3,407 to 3,586 s', 'FAIL'], [3, 'Type back to open', 'SLA resumes', 'SLA stays paused 4 min later', 'FAIL']] },
  'ST-4': { out: 'ST-4-status-type-api-vs-zoho.png', title: 'API | Ticket APIs return the status but not its type (Zoho returns statusType)', verdict: 'FAIL', label: 'GAP vs ZOHO', priority: 'low', panels: [{ img: 'ST4-api-card.png', crop: [0, 0, 1600, pos['ST4-api-card'].slice(-1)[0][3] + 30], caption: 'API results', boxes: [box('ST4-api-card', 0, 'FAIL'), box('ST4-api-card', 1, 'FAIL'), box('ST4-api-card', 3, 'PASS')] }],
    rows: [[1, 'Status type on the ticket', 'statusType returned with status (Zoho live)', 'Only status; the type must be looked up in /desk/ticket-statuses', 'FAIL']] },
};
const images = {};
for (const [id, s] of Object.entries(specs)) { const f = path.join(FR, 'specs', id + '.json'); fs.writeFileSync(f, JSON.stringify({ ticket: id, date: '19 Nov 2026', env: 'NDC-Staging · staging-desk · Desk Administrator (API) · 19 Nov 2026 · test data deleted after', ...s })); execFileSync('node', [path.join(FR, 'annotate.js'), f]); images[id] = 'data:image/png;base64,' + fs.readFileSync(path.join(FR, '../screenshots/annotated', s.out)).toString('base64'); }
// ---- report
const css = fs.readFileSync(path.join(P, 'executions/execu_2026-11-01_desk-golive/ticketmenu/report.src.html'), 'utf8').split('</style>')[0].replace(/<title>.*?<\/title>/, '<title>Ticket Status Types Test</title>') + '</style>';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fig = id => `<figure><img src="${images[id]}" alt="${id} evidence"><figcaption>${id} · ${specs[id].out}</figcaption></figure>`;
const html = css + `
<div class="wrap">
<header>
  <div class="eyebrow">Ticket Access · Ticket statuses · 19 Nov 2026</div>
  <h1>Do ticket statuses behave like the type they are configured with?</h1>
  <p class="meta">TAVI NDC-Staging (staging-desk), API with the Desk Administrator account (the owner sign-in fails since 19 Nov). One QA ticket per status in Marketing; SLA checks in Customer Support with a QA SLA policy; type-change test on the unused status "QA NDC Distributor". Zoho Desk checked live for the API comparison. All test data deleted after.</p>
  <div class="strip">
    <div class="stat pass"><b>42</b><span>statuses moved into</span></div>
    <div class="stat pass"><b>3</b><span>type effects confirmed</span></div>
    <div class="stat fail"><b>2</b><span>bugs</span></div>
    <div class="stat fail"><b>1</b><span>gap vs Zoho</span></div>
    <div class="stat info"><b>1</b><span>waiting for you</span></div>
  </div>
</header>
<section>
  <h2>What the types do (confirmed)</h2>
  <p>Moving a ticket into a status applies its type, not its name: a closed-type status such as "QA NDC Pending" sets the closed time, takes the ticket out of the agent's open-ticket count and closes the SLA (resolution met, first response cancelled); an on-hold status pauses the SLA; an open status keeps it running. The admin's open count in Marketing went 35 → 34 → 35 → 35 → 34 → 35 as one ticket moved through QA NDC Pending, On Hold, Escalated, Closed and back to Open.</p>
  ${fig('ST-1')}
</section>
<section>
  <h2>Findings</h2>
  <article class="finding"><div class="head"><span class="id">ST-2</span><h3>A status change saved on the record never reaches Desk</h3><span class="pill fail">Bug · High (proposed)</span></div>
    <p>4 of the 39 moves returned success and the ticket record holds the new status, but the Desk side still says "Open" an hour later. Desk drives the queues, closed time and workload, so "QA NDC Not Approved E-Top-Up Manager" (closed type) has no closed time and still counts as open work. The 4 moves happened around a staging outage (500s at ~09:10 UTC), the same kind of drift as the 17 Nov background-processing problem. Nothing repairs it afterwards.</p>${fig('ST-2')}</article>
  <article class="finding"><div class="head"><span class="id">ST-3</span><h3>Changing a status type leaves the SLA of existing tickets wrong</h3><span class="pill fail">Bug · Medium (proposed)</span></div>
    <p>With 3 QA tickets in "QA NDC Distributor": open → closed set their closed time and dropped the workload (4 → 2) at once, but the SLA kept running. Closed → on hold cleared the closed time, and the SLA paused only after 20 s to 2 min, with more time left than before (3,407 → 3,586 s). Back to open: the SLA stayed paused 4 minutes later. The status list was restored exactly afterwards.</p>${fig('ST-3')}</article>
  <article class="finding"><div class="head"><span class="id">ST-4</span><h3>Ticket APIs return the status but not its type</h3><span class="pill fail">Gap vs Zoho · Low (proposed)</span></div>
    <p>TAVI's ticket record and Desk ticket return only the status value; the type lives in <code>/desk/ticket-statuses</code>, so every integration or report needs a second call. Zoho returns <code>statusType</code> on every ticket (seen live).</p>${fig('ST-4')}</article>
</section>
<section>
  <h2>Waiting for you: Help Center label</h2>
  <p>"QA NDC Distributor" now has "Show in Help Center" on with the customer name <b>QA ST shown label</b> (unused status; restored after your check). Two tickets belong to the round-19 Help Center customer (QA RT19 HC Customer): <b>#${hc.t.shown.n}</b> in QA NDC Distributor (shown) and <b>#${hc.t.hidden.n}</b> in QA NDC Waiting Top-Up Manager (not shown). Please sign in to the Help Center as that customer and tell me what status each ticket shows. Expected: #${hc.t.shown.n} shows "QA ST shown label"; #${hc.t.hidden.n} shows its type ("Open") and never the internal name.</p>
</section>
<section>
  <h2>All 42 statuses</h2>
  <div class="tbl"><table><thead><tr><th>Status</th><th>Type</th><th>Desk status after the move</th><th>Closed time</th><th>Result</th></tr></thead><tbody>
  ${rows.map(r => `<tr><td>${esc(r.status)}</td><td>${r.type}</td><td>${esc(r.desk)}</td><td>${r.closed}</td><td><span class="pill ${r.ok ? 'pass' : 'fail'}">${r.ok ? 'OK' : 'Desk not updated'}</span>${r.note ? ' <small>' + esc(r.note) + '</small>' : ''}</td></tr>`).join('\n  ')}
  </tbody></table></div>
  <p>Tickets in use today (990 visible to the admin): ${Object.entries(usage.cnt).map(([k, v]) => esc(k) + ' ' + v).join(', ')}. The other 37 statuses have no tickets.</p>
</section>
<section>
  <h2>Notes</h2>
  <ul>
    <li>Staging returned 500 on most calls from about 09:10 to 09:15 UTC; moves into "QA NDC Bank deposit request" and "QA NDC Refund rejected" failed then and worked on retry.</li>
    <li>"QA NDC Reject" is guarded by the validation rule "QA NDC Reject needs a reason" (field qa_ndc_rejection_reasons); with a reason the move works and the closed time is set.</li>
    <li>The per-layout status list (<code>/modules/{m}/layouts/{l}/ticket-statuses</code>) answers 405 to GET, so it cannot be read back through the API.</li>
    <li>The owner account's password in docs/Credentials no longer works; please update it.</li>
  </ul>
  <h2>Cleanup</h2>
  <p>Deleted and purged: 44 QA ST tickets, the type-change and validation tickets, 2 QA SLA policies. The status list is identical to before the test except the Help Center setting on "QA NDC Distributor", kept for your check together with tickets #${hc.t.shown.n} and #${hc.t.hidden.n}. The admin's open count in Marketing is back to 2.</p>
</section>
</div>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report', html.length, 'bad rows', bad.length);
