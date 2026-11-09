// Posts the approved plane-draft.json: one comment per ticket, then the state change (Done/Bug) when the draft has one.
// Usage: node scripts/plane-post.js <token.csv> [--one | --skip=NDC-1,NDC-2]. Token read by the "Secret key" column, never printed.
const fs = require('fs'); const path = require('path');
const [csv, ...flags] = process.argv.slice(2);
const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
const TOKEN = rows[1][rows[0].indexOf('Secret key')];
const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const STATE = { Done: '11f2d31f-9d01-4463-a1de-ce99521b97aa', Bug: '34a7f4b6-7207-4955-b927-0d8d1dd3c666' }, RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const H = { 'X-API-Key': TOKEN, 'Content-Type': 'application/json' };
const call = async (m, p, body) => { for (let i = 0; i < 4; i++) { const r = await fetch(API + p, { method: m, headers: H, body: body && JSON.stringify(body) }); if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'retry-exhausted' }; };
const skip = (flags.find(f => f.startsWith('--skip=')) || '').slice(7).split(',').filter(Boolean);
let L = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'plane-draft.json'), 'utf8')).filter(c => !skip.includes(c.id));
if (flags.includes('--one')) L = L.slice(0, 1);
(async () => {
  for (const c of L) {
    const w = await call('GET', `/work-items/${c.uuid}/`);
    if (w.j?.state !== RFT) { console.log(c.id, 'SKIPPED — no longer Ready For Test'); continue; }
    const cm = await call('POST', `/work-items/${c.uuid}/comments/`, { comment_html: c.html });
    let st = '-'; if (c.state) { const u = await call('PATCH', `/work-items/${c.uuid}/`, { state: STATE[c.state] }); st = c.state + ' ' + u.s; }
    console.log(c.id, 'comment', cm.s, '| state', st);
  }
})().catch(e => console.log('ERROR', String(e.message).replace(/plane_api_\w+/g, '<token>')));
