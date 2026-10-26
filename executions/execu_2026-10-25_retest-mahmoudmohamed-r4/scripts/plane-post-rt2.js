// Posts the second retest of NDC-1602 (PASS → Done) and NDC-2399 (PARTIAL → Bug), 26 Oct 2026: comment + state.
// Comments are built from the same specs as the images. Usage: node scripts/plane-post-rt2.js <token.csv>. Token never printed.
const fs = require('fs'); const path = require('path');
const rows = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const STATE = { Done: '11f2d31f-9d01-4463-a1de-ce99521b97aa', Bug: '34a7f4b6-7207-4955-b927-0d8d1dd3c666' }, RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 4; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const T = {
  1602: { uuid: '7f0cd60b-84ae-488e-9fd0-6a1447121c33', state: 'Done', method: 'Manual browser (Settings › Data Administration › Recycle Bin › Empty Bin) + network capture',
    still: [] },
  2399: { uuid: 'ba8e7ade-fce1-47b5-8a0d-bfffde52ad95', state: 'Bug', method: 'Manual browser (Desk › Settings › CRM ⇄ Desk Integration › Disconnect, then Connect) + API',
    still: ['Step 3: expected added / updated / ignored counts, actual "0 added, 0 updated, 5 could not sync" — the 14 skipped customers of the run (requested 19, skipped 14, needs_attention 5) are not mentioned.',
      'Step 3: expected skip reasons, actual the notice says "The Failure Log lists the records that could not sync", but the Failure Log has none of the 7 records from this run (still 19 entries, newest 07:30 UTC, before the reconnect at 08:05 UTC).'] },
};
(async () => {
  for (const [n, t] of Object.entries(T)) {
    const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', `NDC-${n}.json`), 'utf8'));
    const w = await call('GET', `/work-items/${t.uuid}/`);
    if (w.j?.state !== RFT) { console.log('NDC-' + n, 'SKIPPED — no longer Ready For Test'); continue; }
    const html = `<p><strong>Retest ${spec.verdict} — 26 Oct 2026</strong> (second retest; the first was not run)<br>Environment: ${esc(spec.env)}<br>Method: ${esc(t.method)}</p>`
      + `<p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${r[4]}]</strong></li>`).join('')}</ul>`
      + (t.still.length ? `<p>Still failing:</p><ul>${t.still.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : '')
      + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    const cm = await call('POST', `/work-items/${t.uuid}/comments/`, { comment_html: html });
    const u = await call('PATCH', `/work-items/${t.uuid}/`, { state: STATE[t.state] });
    console.log('NDC-' + n, 'comment', cm.s, '| state', t.state, u.s);
  }
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
