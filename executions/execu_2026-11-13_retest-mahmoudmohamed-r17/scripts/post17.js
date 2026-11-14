// node post17.js [--post]  builds plane-draft.json/html from specs; with --post re-checks state, comments, moves state, attaches image.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(','));
const ki = rows[0].findIndex(h => /secret key/i.test(h)); const KEY = rows[1][ki >= 0 ? ki : rows[0].length - 1].trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1', DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const ID = { 'NDC-2919': '901841b2-14b2-422d-aa7d-0a0652b9bc5c', 'NDC-2918': '2f718f7f-cd5c-4b97-9c12-c40b108e2cd1', 'NDC-2917': 'ee7c2c37-2310-45bc-a200-fc7f725bf613', 'NDC-2916': '9833e586-28d8-4112-85ce-73531ff7fb95', 'NDC-2869': '6679eb17-6009-401b-8730-c38f12acd61b', 'NDC-2868': '1e0b5e4d-7dc8-446f-ae07-abeeffdaf895', 'NDC-2867': '67302682-67cb-4b1a-a2eb-233ac86627c8', 'NDC-2866': '2b367921-700d-4f7d-abb6-5ed4c7a6fd87', 'NDC-2865': '2618ba6a-cdb5-4007-85cf-8887761818ab', 'NDC-2860': 'b790f9b1-999e-46c5-8d44-dcb3dc3d0978', 'NDC-2823': '9b91e6e7-c554-4f70-8a9a-46ab39f95915', 'NDC-2810': '42730648-7cc5-4998-85fc-0d3f33c94ad8', 'NDC-2807': '7e03a59d-626d-48e8-a41f-8f4468467b09', 'NDC-2806': 'c6ce285f-7a2e-4b84-bd67-0dc87447a5e0', 'NDC-2794': '96b66641-68cc-40bb-a6e7-f0222ed21143', 'NDC-2729': '4ead7a61-0fb1-4bf6-a102-bc218fc2703f', 'NDC-2635': 'a3451c13-dda3-4367-a220-721ae246741e', 'NDC-2630': 'cd74d3ad-134c-433f-b719-c02babeb981c', 'NDC-2174': '0112f4c9-85bb-43f8-8990-a0b07b546fbd', 'NDC-2137': '533f6806-b5a3-410d-8ec9-ea4f67c174e7', 'NDC-2136': '9f559025-4222-4823-933b-57eb3bff3635' };
const DESK = ['NDC-2174', 'NDC-2810', 'NDC-2794', 'NDC-2823', 'NDC-2635', 'NDC-2860'];
const METHOD = { 'NDC-2630': 'API + manual browser (automation NDC-2630 not run: it signs the owner in again)', 'NDC-2136': 'Manual browser, timed loads (automation NDC-2136 not run: it signs the owner in again)' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const draft = Object.keys(ID).map(k => {
  const s = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', k + '.json'), 'utf8'));
  const state = s.verdict === 'PASS' ? 'Done' : 'Bug';
  const env = (DESK.includes(k) ? 'staging-desk.taviportal.com' : 'staging-crm.taviportal.com') + ', tenant NDC-Staging, Edge (headless) + API; account: ndc-staging-owner (owner)';
  const ok = s.rows.filter(r => r[4] !== 'FAIL'), bad = s.rows.filter(r => r[4] === 'FAIL');
  let h = `<p><strong>Retest ${s.verdict} — 13 Nov 2026</strong> → moved to ${state}<br>Environment: ${esc(env)}<br>Method: ${esc(METHOD[k] || 'API + manual browser')}</p><p>${esc(s.title)}</p>`;
  h += `<p>Checked:</p><ul>${ok.map(r => `<li>${esc(r[1])} → ${esc(r[3])} [${r[4]}]</li>`).join('')}</ul>`;
  if (bad.length) h += `<p>Still failing:</p><ul>${bad.map(r => `<li><strong>${esc(r[1])}</strong>: expected ${esc(r[2])}; actual ${esc(r[3])}</li>`).join('')}</ul>`;
  h += `<p>Evidence: ${esc(s.out)} (attached)</p>`;
  return { ticket: k, id: ID[k], verdict: s.verdict, state, stateId: state === 'Done' ? DONE : BUG, image: s.out, comment_html: h };
});
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify(draft, null, 1));
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Plane draft r17</title><style>body{font:14px/1.5 "Segoe UI",system-ui;max-width:1100px;margin:auto;padding:16px;background:#f6f7f9;color:#111827}section{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:14px 0}.c{border-left:4px solid #2563eb;padding:2px 12px}</style></head><body><h1>Plane draft — round 17 (13 Nov 2026)</h1>${draft.map(d => `<section><h3>${d.ticket} — ${d.verdict} → ${d.state}</h3><div class="c">${d.comment_html}</div><p>Attach: ${d.image}</p></section>`).join('')}</body></html>`);
console.log('draft', draft.length, draft.filter(d => d.state === 'Done').length, 'Done', draft.filter(d => d.state === 'Bug').length, 'Bug');
if (process.argv[2] !== '--post') return;
(async () => {
  const log = []; const done = fs.existsSync(path.join(RUN, 'posted.json')) ? JSON.parse(fs.readFileSync(path.join(RUN, 'posted.json'), 'utf8')) : {};
  for (const d of draft) {
    if (done[d.ticket] && done[d.ticket].attach) { log.push(d.ticket + ' already posted'); continue; }
    const w = await (await fetch(`${B}/work-items/${d.id}/`, { headers: H })).json();
    if (w.state !== RFT && !done[d.ticket]) { log.push(d.ticket + ' SKIPPED: state is no longer Ready For Test'); continue; }
    const rec = done[d.ticket] || {};
    if (!rec.comment) { const c = await fetch(`${B}/work-items/${d.id}/comments/`, { method: 'POST', headers: H, body: JSON.stringify({ comment_html: d.comment_html }) }); rec.comment = c.status; }
    if (!rec.state) { const u = await fetch(`${B}/work-items/${d.id}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ state: d.stateId }) }); rec.state = u.status; }
    if (!rec.attach) { try { execFileSync('node', [path.join(__dirname, 'plane-attach.js'), d.id, path.join(RUN, 'screenshots', 'annotated', d.image)]); rec.attach = 'ok'; } catch (e) { rec.attachErr = String(e.stderr || e.message).slice(0, 200); } }
    done[d.ticket] = rec; fs.writeFileSync(path.join(RUN, 'posted.json'), JSON.stringify(done, null, 1));
    log.push(d.ticket + ' comment ' + rec.comment + ' state ' + rec.state + ' → ' + d.state + ' attach ' + (rec.attach || rec.attachErr));
  }
  console.log(log.join('\n'));
})().catch(e => console.error('ERR', e.message));
