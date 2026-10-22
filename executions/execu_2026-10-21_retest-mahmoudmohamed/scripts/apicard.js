// Renders API evidence (requests + responses) as a 1600x900 PNG in screenshots/raw, so annotate.js can box it.
// Usage: node apicard.js <spec.json>   spec: { out, title, rows: [[label, request, response, tone]] }  tone: ok | bad | info
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(P, 'executions/execu_2026-10-21_retest-mahmoudmohamed/screenshots/raw');
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const C = { ok: '#16a34a', bad: '#dc2626', info: '#2563eb' };
const rows = spec.rows.map((r, i) => `<div class="row" id="r${i + 1}"><div class="lab">${esc(r[0])}</div><div class="req">${esc(r[1])}</div><div class="res" style="border-color:${C[r[3]] || '#6b7280'}">${esc(r[2])}</div></div>`).join('');
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1600px;height:900px;background:#0f172a;color:#e2e8f0;font:15px/1.4 Consolas,"JetBrains Mono",monospace;box-sizing:border-box;padding:28px 36px}
h1{font:600 20px "Segoe UI",sans-serif;margin:0 0 6px}p{margin:0 0 18px;color:#94a3b8;font-family:"Segoe UI",sans-serif;font-size:14px}
.row{display:grid;grid-template-columns:230px 1fr 1fr;gap:12px;margin-bottom:10px;align-items:stretch}
.lab{font-family:"Segoe UI",sans-serif;font-weight:600;color:#f8fafc;padding:8px 0}
.req,.res{background:#1e293b;border-radius:6px;padding:8px 10px;word-break:break-all;white-space:pre-wrap}
.res{border-left:5px solid}
</style></head><body><h1>${esc(spec.title)}</h1><p>API evidence captured during the retest — ${esc(spec.host || 'staging-crm.taviportal.com')}, ${esc(spec.who || 'mahmoud.mahamed1515')}, ${esc(spec.date || '21 Oct 2026')}. Tokens omitted.</p>${rows}</body></html>`;
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const pg = await b.newPage({ viewport: { width: 1600, height: 900 } }); await pg.setContent(html);
  const boxes = await pg.$$eval('.row', els => els.map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)]; }));
  await pg.screenshot({ path: path.join(RAW, spec.out) }); await b.close();
  console.log(spec.out, JSON.stringify(boxes));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
