// node mk18.js [--post]   Round 20 (17 Nov 2026): builds plane-draft.json/html + report.html from specs/*.json, out/rft.json, notes.md, ledger.md.
// --post: re-checks state is still Ready For Test, posts comment, moves state (PASS→Done, FAIL/PARTIAL→Bug, BLOCKED/DECISION→none), attaches images. Resumable via posted.json.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..');
const RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1', DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666';
const DATE = '17 Nov 2026';
const rft = JSON.parse(fs.readFileSync(path.join(RUN, 'out/rft.json'), 'utf8'));
const cfg = fs.existsSync(path.join(__dirname, 'mk20-cfg.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'mk20-cfg.json'), 'utf8')) : {};
// cfg: { decision: {"NDC-x": "text"}, extraNote: {"NDC-x": "html"}, method: {"NDC-x": "..."}, account: {"NDC-x": "..."}, override: {"NDC-x": "Done|Bug|none"} }
const P = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const items = rft.map(t => {
  const k = 'NDC-' + t.seq; const f = path.join(__dirname, 'specs', k + '.json');
  const s = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
  const feat = (t.name.split(' | ')[0] !== t.name ? t.name.split(' | ')[0] : (t.labels[0] || '—'));
  return { k, t, s, feat };
}).sort((a, b) => (P[a.t.pri] ?? 4) - (P[b.t.pri] ?? 4) || (a.t.mod || '').localeCompare(b.t.mod || '') || a.feat.localeCompare(b.feat) || a.t.seq - b.t.seq);
const missing = items.filter(i => !i.s).map(i => i.k);
const zimg = k => fs.readdirSync(path.join(RUN, 'screenshots/annotated')).filter(f => f.startsWith(k + '-') && /vs-zoho/.test(f));
const target = i => {
  if (cfg.override && cfg.override[i.k]) return cfg.override[i.k];
  if (cfg.decision && cfg.decision[i.k]) return 'none';
  const v = i.s.verdict; return v === 'PASS' || v === 'NOT A BUG' ? 'Done' : (v === 'FAIL' || v === 'PARTIAL') ? 'Bug' : 'none';
};
const draft = items.filter(i => i.s).map(i => {
  const s = i.s, st = target(i), desk = /desk/i.test(i.t.mod || '');
  const env = (desk ? 'staging-desk.taviportal.com' : 'staging-crm.taviportal.com') + ', tenant NDC-Staging, Edge + API; account: ' + ((cfg.account || {})[i.k] || 'ndc-staging-owner (owner)');
  const ok = s.rows.filter(r => !['FAIL','PARTIAL'].includes(r[4])), bad = s.rows.filter(r => ['FAIL','PARTIAL'].includes(r[4]));
  const imgs = [s.out, ...zimg(i.k)];
  let h = `<p><strong>Retest ${esc(s.verdict)} — ${DATE}</strong>${st !== 'none' ? ' → moved to ' + st : ' → state not changed'}<br>Environment: ${esc(env)}<br>Method: ${esc((cfg.method || {})[i.k] || 'Manual browser + API')}</p>`;
  h += `<p>Checked:</p><ul>${ok.map(r => `<li>${esc(r[1])} → ${esc(r[3])} [${r[4]}]</li>`).join('')}</ul>`;
  if (bad.length) h += `<p>Still failing:</p><ul>${bad.map(r => `<li><strong>${esc(r[1])}</strong>: expected ${esc(r[2])}; actual ${esc(r[3])}</li>`).join('')}</ul>`;
  if (cfg.extraNote && cfg.extraNote[i.k]) h += cfg.extraNote[i.k];
  h += `<p>Evidence: ${imgs.map(esc).join(', ')} (attached)</p>`;
  return { ticket: i.k, id: i.t.id, pri: i.t.pri, mod: i.t.mod, feat: i.feat, title: i.t.name, verdict: s.verdict, decision: (cfg.decision || {})[i.k] || '', state: st, stateId: st === 'Done' ? DONE : st === 'Bug' ? BUG : null, images: imgs, comment_html: h };
});
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify(draft, null, 1));
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb', DECISION: '#7c3aed' };
const badge = v => `<span class="v" style="background:${VC[v] || '#6b7280'}">${esc(v)}</span>`;
const css = `:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb;--hl:#eff6ff}@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151;--hl:#172554}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h1{font-size:22px}h2{margin-top:28px;font-size:18px}
.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:100px}.kpi b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}section{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:16px 0}
section img{max-width:100%;border:1px solid var(--bd);margin-top:8px}.meta,.n{color:var(--mut);font-size:13px}.c{border-left:4px solid #2563eb;padding:2px 12px}.d{background:#f5f3ff;color:#4c1d95;border-radius:6px;padding:6px 10px}
pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px}.wrap{overflow-x:auto}a{color:inherit}`;
const cnt = v => draft.filter(d => d.verdict === v).length, cs = s => draft.filter(d => d.state === s).length;
const kpi = `<div class="kpi"><div><b>${draft.length}</b>retested</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass</div><div><b style="color:#d97706">${cnt('PARTIAL')}</b>partial</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail</div><div><b>${cnt('BLOCKED')}</b>blocked</div><div><b style="color:#7c3aed">${draft.filter(d => d.decision).length}</b>decisions</div><div><b>${cs('Done')}</b>→ Done</div><div><b>${cs('Bug')}</b>→ Bug</div></div>`;
const act = d => d.decision ? 'Decision: ' + d.decision : d.state === 'none' ? 'comment only' : `→ ${d.state} + comment + ${d.images.length} image${d.images.length > 1 ? 's' : ''}`;
const table = `<div class="wrap"><table><tr><th>Priority</th><th>Module</th><th>Feature</th><th>Ticket</th><th>Title</th><th>Verdict</th><th>Plane action</th></tr>${draft.map(d => `<tr><td>${d.pri}</td><td>${esc(d.mod)}</td><td>${esc(d.feat)}</td><td><a href="#${d.ticket}"><b>${d.ticket}</b></a></td><td>${esc(d.title)}</td><td>${badge(d.verdict)}</td><td>${esc(act(d))}</td></tr>`).join('')}</table></div>`;
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane draft r18</title><style>${css}</style></head><body><main><h1>Plane draft — retest round 19 (${DATE})</h1><p class="meta">Exactly what will be posted. Nothing is posted until approved. Images attached through the Plane API (no public host).${missing.length ? ' Not yet retested: ' + missing.join(', ') : ''}</p>${kpi}${table}
${draft.map(d => `<section id="${d.ticket}"><h3>${d.ticket} — ${badge(d.verdict)} ${d.state !== 'none' ? '→ ' + d.state : '(state unchanged)'}</h3>${d.decision ? `<p class="d">Decision needed: ${esc(d.decision)}</p>` : ''}<div class="c">${d.comment_html}</div><p class="n">Attach: ${d.images.map(esc).join(', ')}</p></section>`).join('')}
<h2>Cleanup plan (after posting)</h2><pre>${esc(fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8'))}</pre></main></body></html>`);
// report.html with embedded images
const notes = fs.readFileSync(path.join(RUN, 'notes.md'), 'utf8');
const b64 = f => { const p = path.join(RUN, 'screenshots/annotated', f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : ''; };
const cards = draft.map(d => { const s = items.find(i => i.k === d.ticket).s; const note = (notes.split('\n').find(l => l.startsWith('| ' + d.ticket + ' |')) || '').split('|').slice(3).join('|').trim();
  return `<section id="${d.ticket}"><h3>${d.ticket} · ${esc(s.title)} ${badge(d.verdict)}</h3><p class="meta">${esc(s.env)} · ${esc(s.date)}</p>${d.decision ? `<p class="d">Decision needed: ${esc(d.decision)}</p>` : ''}
<div class="wrap"><table><tr><th>#</th><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${s.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${badge(r[4])}</td></tr>`).join('')}</table></div>
${note ? `<details><summary>Run notes</summary><p class="n">${esc(note)}</p></details>` : ''}${d.images.map(f => `<img loading="lazy" src="${b64(f)}" alt="${esc(f)}"><p class="n">${esc(f)}</p>`).join('')}</section>`; });
const obs = cfg.observations || [];
fs.writeFileSync(path.join(RUN, 'report.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest round 20</title><style>${css}</style></head><body><main>
<h1>Retest round 20 — MahmoudMohamed · NDC · ${DATE}</h1><p class="meta">staging-crm / staging-desk.taviportal.com · NDC-Staging · Edge + API · owner session shared by lanes run one at a time. ${rft.length} tickets in Ready For Test (NDC-1483 and NDC-1988 left out). Zoho reference: Zoho CRM org946877290 / Zoho Desk techegysolutions (test accounts from the 14 Nov credentials file).</p>
${kpi}<h2>Results</h2>${table}<h2>New defects seen (not filed)</h2><ul>${obs.map(o => `<li>${o}</li>`).join('')}</ul><h2>Tickets</h2>${cards.join('')}
<h2>Test data and cleanup ledger</h2><pre>${esc(fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8'))}</pre>
<h2>Security notes</h2><ul><li>No password or token printed; API calls borrowed the browser session token (redacted in logs); /iam/auth not logged.</li><li>No public request bin or file host used (NDC-3041 checked through the app's run record instead of webhook.site).</li></ul></main></body></html>`);
console.log('draft', draft.length, 'Done', cs('Done'), 'Bug', cs('Bug'), 'none', cs('none'), missing.length ? 'missing ' + missing.join(',') : '');
if (process.argv[2] !== '--post') return;
const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(','));
const ki = rows[0].findIndex(h => /secret key/i.test(h)); const KEY = rows[1][ki >= 0 ? ki : rows[0].length - 1].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3', H = { 'X-API-Key': KEY, 'Content-Type': 'application/json' };
const only = process.argv[3] ? process.argv[3].split(',') : null;
(async () => {
  const pf = path.join(RUN, 'posted.json'); const done = fs.existsSync(pf) ? JSON.parse(fs.readFileSync(pf, 'utf8')) : {}; const log = [];
  for (const d of draft) {
    if (only && !only.includes(d.ticket)) continue;
    const rec = done[d.ticket] || {};
    if (rec.comment && (rec.state || !d.stateId) && rec.attach && rec.attach.length === d.images.length) { log.push(d.ticket + ' already posted'); continue; }
    const w = await (await fetch(`${B}/work-items/${d.id}/`, { headers: H })).json();
    if (w.state !== RFT && !done[d.ticket]) { log.push(d.ticket + ' SKIPPED: no longer Ready For Test'); continue; }
    if (!rec.comment) { const c = await fetch(`${B}/work-items/${d.id}/comments/`, { method: 'POST', headers: H, body: JSON.stringify({ comment_html: d.comment_html }) }); rec.comment = c.status; }
    if (d.stateId && !rec.state) { const u = await fetch(`${B}/work-items/${d.id}/`, { method: 'PATCH', headers: H, body: JSON.stringify({ state: d.stateId }) }); rec.state = u.status; }
    rec.attach = rec.attach || [];
    for (const f of d.images) { if (rec.attach.includes(f)) continue; try { execFileSync('node', [path.join(__dirname, 'plane-attach.js'), d.id, path.join(RUN, 'screenshots/annotated', f)]); rec.attach.push(f); } catch (e) { rec.attachErr = String(e.stderr || e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>').slice(0, 200); } }
    done[d.ticket] = rec; fs.writeFileSync(pf, JSON.stringify(done, null, 1));
    log.push(`${d.ticket} comment ${rec.comment} state ${rec.state || '-'} → ${d.state} attach ${rec.attach.length}/${d.images.length}${rec.attachErr ? ' ERR ' + rec.attachErr : ''}`);
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log(log.join('\n'));
})().catch(e => console.error('ERR', String(e.message).replace(/plane_[A-Za-z0-9_-]+/g, '<key>')));
