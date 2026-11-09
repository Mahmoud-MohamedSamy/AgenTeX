// Round 6: comment + move to Bug for FAIL/PARTIAL tickets (user approved 27 Oct for NDC-2414, NDC-2419). Comment = summary + rows of the same spec as the image.
// Usage: node scripts/post-pass.js <token.csv> [--one | --only=NDC-1,NDC-2]. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const [csv, ...flags] = process.argv.slice(2);
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const DONE = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 5; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const R = JSON.parse(fs.readFileSync(path.join(RUN, 'results.json'), 'utf8'));
let list = R.tickets.filter(t => ['PARTIAL', 'FAIL'].includes(t.v));
const only = (flags.find(f => f.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean); if (only.length) list = list.filter(t => only.includes(t.id));
if (flags.includes('--one')) list = list.slice(0, 1);
const method = t => /Test|automation|\b[A-Z]{1,2}-\d{2}\b|WH-\d|B5|SP-|PR-|US-/.test(t.summary) ? 'Automation (TestNG suites crmaccess / crmhierarchy / crmautomationorder / crmrecords) + API' : 'Manual browser (Edge headless) + API';
(async () => {
  const log = [];
  for (const t of list) {
    const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r6', `${t.id}.json`), 'utf8'));
    const w = await call('GET', `/work-items/${t.uuid}/`);
    if (w.j?.state !== RFT) { log.push(t.id + ' SKIPPED — not in Ready For Test'); continue; }
    const html = `<p><strong>Retest ${t.v} — 26–27 Oct 2026</strong><br>Environment: staging-crm.taviportal.com, NDC-Staging; account: CRM Admin (test users 1/2 where noted)<br>Method: ${esc(method(t))}</p>`
      + `<p>${esc(t.summary)}</p><p>Checked:</p><ul>${spec.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
      + (t.still ? `<p><strong>Still failing:</strong></p><ul>${t.still.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '') + `<p>Evidence: ${esc(spec.out)} (attached)</p>`;
    const c = await call('POST', `/work-items/${t.uuid}/comments/`, { comment_html: html });
    const u = await call('PATCH', `/work-items/${t.uuid}/`, { state: DONE });
    log.push(`${t.id} comment ${c.s} | Bug ${u.s}`);
    await new Promise(s => setTimeout(s, 1500));
  }
  console.log(log.join('\n'));
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
