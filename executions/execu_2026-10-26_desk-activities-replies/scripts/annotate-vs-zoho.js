// Builds one annotated retest evidence image from a spec file.
// Usage: node annotate.js <spec.json>
// spec: { out, ticket, title, verdict: PASS|FAIL|PARTIAL|BLOCKED, date, env,
//         panels: [{ img, caption, crop?: [x,y,w,h], boxes: [{ b: [x1,y1,x2,y2], n, color? }] }],
//         rows: [[n, check, expected, now, result]] }   // result: PASS | FAIL | PARTIAL | INFO
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RUN = path.join(P, 'executions/execu_2026-10-26_desk-activities-replies');
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const W = 1600;
const VC = { DIFFERS: '#dc2626', SAME: '#16a34a', GAP: '#d97706', BUG: '#dc2626',  PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb', DECISION: '#7c3aed' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const panelHtml = spec.panels.map(p => {
  const src = 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'evidence/raw', p.img)).toString('base64');
  const [cx, cy, cw, ch] = p.crop || [0, 0, p.w || 1600, p.h || 900];
  const per = spec.panels.length > 1 ? 2 : 1; const pw = (W - 48 - 16 * (per - 1)) / per;
  const k = pw / cw;
  const boxes = (p.boxes || []).map(bx => {
    const [x1, y1, x2, y2] = bx.b; const c = bx.color || VC[bx.kind] || '#ff2d55';
    const l = (x1 - cx) * k, t = (y1 - cy) * k, w = (x2 - x1) * k, h = (y2 - y1) * k;
    return `<div class="box" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;border-color:${c}"></div>` +
      `<div class="tag" style="left:${Math.max(0, l - 14)}px;top:${Math.max(0, t - 14)}px;background:${c}">${bx.n}</div>`;
  }).join('');
  return `<figure style="width:${pw}px"><div class="shot" style="width:${pw}px;height:${ch * k}px">` +
    `<img src="${src}" style="width:${(p.w || 1600) * k}px;left:${-cx * k}px;top:${-cy * k}px">${boxes}</div>` +
    `<figcaption>${esc(p.caption || '')}</figcaption></figure>`;
}).join('');

// Each behaviour: a title line (number = the box number on BOTH screenshots, then the verdict), then the TAVI text under
// the left (TAVI) screenshot and the Zoho text under the right (Zoho) screenshot, in columns as wide as the screenshots.
const half = (W - 48 - 16) / 2;
const rows = spec.rows.map(r => `<div class="row"><div class="rt"><span class="num">${r[0]}</span><span class="beh">${esc(r[1])}</span>` +
  `<span class="pill" style="background:${VC[r[4]] || '#6b7280'}">${r[4]}</span></div>` +
  `<div class="cells"><div class="cell" style="flex:1"><b>TAVI:</b> ${esc(r[3])}</div><div class="cell" style="flex:1"><b>Zoho:</b> ${esc(r[2])}</div></div></div>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:${W}px;background:#f4f5f7;font:14px/1.45 "Segoe UI",system-ui,sans-serif;color:#111827}
header{display:flex;align-items:center;gap:16px;padding:18px 24px;background:#111827;color:#fff}
header .id{font-weight:700;font-size:20px}header .t{flex:1;font-size:16px;opacity:.92}
header .v{font-weight:700;font-size:18px;padding:6px 16px;border-radius:6px;background:${VC[spec.verdict]}}
.meta{padding:8px 24px;color:#4b5563;font-size:13px;background:#e5e7eb}
.panels{display:flex;flex-wrap:wrap;gap:16px;padding:16px 24px}
figure{margin:0}.shot{position:relative;overflow:hidden;border:1px solid #d1d5db;border-radius:6px;background:#fff}
.shot img{position:absolute}.box{position:absolute;border:3px solid;border-radius:4px}
.tag{position:absolute;width:28px;height:28px;border-radius:50%;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 1px 3px rgba(0,0,0,.4)}
figcaption{margin-top:6px;color:#374151;font-size:13px}
.cmp{margin:0 24px 24px;display:flex;flex-direction:column;gap:10px}
.colhead{display:flex;gap:16px}.colhead div{width:${half}px;font-weight:700;font-size:14px;padding:6px 10px;background:#111827;color:#fff;border-radius:6px}
.row{background:#fff;border:1px solid #d1d5db;border-radius:6px;padding:10px 12px}
.rt{display:flex;align-items:center;gap:10px;margin-bottom:6px}.num{width:26px;height:26px;border-radius:50%;background:#ff2d55;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:13px;flex:none}
.beh{flex:1;font-weight:600}.cells{display:flex;gap:16px}.cell{color:#1f2937}
.pill{color:#fff;font-weight:700;font-size:12px;padding:2px 8px;border-radius:10px}
</style></head><body>
<header><span class="id">${esc(spec.ticket)}</span><span class="t">${esc(spec.title)}</span><span class="v">${esc(spec.label || "RETEST " + spec.verdict)}</span></header>
<div class="meta">${esc(spec.env)} · ${esc(spec.date)}</div>
<div class="panels">${panelHtml}</div>
<div class="cmp"><div class="colhead"><div>TAVI Desk (left screenshot)</div><div>Zoho Desk (right screenshot)</div></div>${rows}</div>
</body></html>`;

(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const pg = await b.newPage({ viewport: { width: W, height: 900 } });
  await pg.setContent(html, { waitUntil: 'load' });
  const out = path.join(RUN, 'evidence/annotated', spec.out);
  const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: W, height: h }); await pg.screenshot({ path: out }); await b.close(); console.log('wrote', out);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
