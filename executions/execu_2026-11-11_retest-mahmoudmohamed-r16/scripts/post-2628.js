const fs = require('fs'), path = require('path'); const { execFileSync } = require('child_process');
const ID = '4a48ac25-88a4-4a38-8349-7212fe4eda16', DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const IMG = path.join(__dirname, '..', 'screenshots/annotated/NDC-2628-retest-PASS.png');
const html = `<p><strong>Retest PASS — 11 Nov 2026</strong></p><p>Environment: staging-crm.taviportal.com, tenant NDC-Staging, Edge; account: ndc-staging-owner (Tenant Owner)<br>Method: Manual browser (Ctrl K global search) + API (/search), read-only with existing tags</p>
<p><strong>Checked (item 8, "#tag" search — the only open item):</strong></p><ul>
<li>Typing "#Rule" shows a TAGS group: "#Rule A Done · 4 records", above the record hits.</li>
<li>Choosing the tag runs #"Rule A Done" → 4 records, exactly the 4 leads with that tag (tag count 4). Before: "No results".</li>
<li>Other tags: #"Completed" (a Tasks tag) → 5 tasks = tag count 5; #"test" (one-word tag) → only the 2 tagged leads, not other records named "test"; #"Excel Imported" → 1; #"New" → 1.</li>
<li>Typing "#Rule A Done" or "#Workflow Completed" without picking the suggestion returns records (13 and 44), tagged ones first, plus name matches — in line with "# searches by record name or tag" as described in this ticket (Zoho not re-checked live).</li></ul>
<p>Evidence: NDC-2628-retest-PASS.png</p>`;
(async () => {
  const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(',').map(x => x.replace(/"/g, '').trim()));
  const H = { 'X-API-Key': rows[1][rows[0].indexOf('Secret key')], 'Content-Type': 'application/json' };
  const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3/work-items/';
  const w = await (await fetch(API + ID + '/', { headers: H })).json(); if (w.state !== RFT) { console.log('SKIPPED — not in Ready For Test'); return; }
  const c = await fetch(API + ID + '/comments/', { method: 'POST', headers: H, body: JSON.stringify({ comment_html: html }) });
  const s = await fetch(API + ID + '/', { method: 'PATCH', headers: H, body: JSON.stringify({ state: DONE }) });
  console.log('comment', c.status, 'state→Done', s.status);
  console.log(execFileSync('node', [path.join(__dirname, 'plane-attach.js'), ID, IMG]).toString().trim());
  const r = await (await fetch(API + ID + '/', { headers: H })).json(); const a = await (await fetch(API + ID + '/attachments/', { headers: H })).json();
  console.log('read back: state', r.state === DONE ? 'Done' : r.state, '| attachments', (Array.isArray(a) ? a : a.results || []).map(x => (x.attributes && x.attributes.name) || x.name).join(', '));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
