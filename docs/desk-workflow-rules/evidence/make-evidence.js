// Builds an annotated side-by-side evidence image (TAVI left, Zoho right) from a JSON config.
// Usage: node make-evidence.js <config.json>
// Config: { out, id, title, verdict, date, panels:[{side,caption,img,boxes:[{n,x,y,w,h}]}], rows:[{b,zoho,tavi,match}], notes:[...] }
// Box coordinates are in the original image's pixels; they are scaled with the image.
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../node_modules/playwright-core'));

const cfgPath = path.resolve(process.argv[2]);
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const base = path.dirname(cfgPath);
const PANEL_W = 780;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MATCH_COLOR = { 'Same as Zoho': '#1a7f37', 'Differs': '#b35900', 'Gap': '#c62828', 'TAVI extra': '#1f5fbf', 'Not comparable': '#666', 'Not checked': '#666' };

(async () => {
  const b = await chromium.launch({ headless: true });
  const page = await b.newPage({ viewport: { width: 1640, height: 900 }, deviceScaleFactor: 1 });
  // read natural sizes
  const panels = [];
  for (const p of cfg.panels) {
    if (p.text) { panels.push(p); continue; } // docs-only panel: quoted text instead of a screenshot
    const abs = path.resolve(base, p.img);
    const data = 'data:image/png;base64,' + fs.readFileSync(abs).toString('base64');
    await page.setContent(`<img id=i src="${data}">`);
    const { w, h } = await page.$eval('#i', i => ({ w: i.naturalWidth, h: i.naturalHeight }));
    panels.push({ ...p, data, w, h, k: PANEL_W / w });
  }
  const sideColor = s => (s === 'TAVI' ? '#c62828' : '#1f5fbf');
  const panelHtml = p => p.text ? `
    <div class="panel">
      <div class="cap" style="background:${sideColor(p.side)}">${esc(p.side)} — ${esc(p.caption)}</div>
      <div class="docs"><div class="docsflag">${esc(p.flag || "DOCS ONLY — not seen on screen")}</div>${p.text.map(t => `<p>${esc(t)}</p>`).join('')}${(p.sources || []).map(s => `<div class="src">Source: ${esc(s)}</div>`).join('')}</div>
    </div>` : `
    <div class="panel">
      <div class="cap" style="background:${sideColor(p.side)}">${esc(p.side)} — ${esc(p.caption)}</div>
      <div class="imgwrap" style="width:${PANEL_W}px;height:${Math.round(p.h * p.k)}px">
        <img src="${p.data}" style="width:${PANEL_W}px">
        ${(p.boxes || []).map(x => `<div class="box" style="left:${x.x * p.k}px;top:${x.y * p.k}px;width:${x.w * p.k}px;height:${x.h * p.k}px;border-color:${sideColor(p.side)}"><span style="background:${sideColor(p.side)}">${x.n}</span></div>`).join('')}
      </div>
    </div>`;
  // group panels: TAVI left column, Zoho right column
  const col = side => panels.filter(p => p.side === side).map(panelHtml).join('') ||
    `<div class="panel"><div class="cap" style="background:#666">${side} — no screenshot</div><div class="empty">${esc((cfg.noShot || {})[side] || 'Not captured')}</div></div>`;
  const vColor = { Gap: '#c62828', Differs: '#b35900', 'Same as Zoho': '#1a7f37' }[cfg.verdict] || '#333';
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;padding:24px;font:14px/1.45 "Segoe UI",Arial,sans-serif;color:#1d1d1f;background:#fff;width:1592px}
    h1{font-size:20px;margin:0 0 4px} .sub{color:#555;margin-bottom:16px}
    .verdict{display:inline-block;padding:2px 10px;border-radius:4px;color:#fff;font-weight:600;background:${vColor};margin-left:8px;font-size:14px;vertical-align:middle}
    .cols{display:flex;gap:24px;align-items:flex-start} .col{width:${PANEL_W}px;display:flex;flex-direction:column;gap:16px}
    .cap{color:#fff;font-weight:600;padding:6px 10px;border-radius:4px 4px 0 0}
    .imgwrap{position:relative;border:1px solid #ccc;overflow:hidden} .imgwrap img{display:block}
    .box{position:absolute;border:3px solid;border-radius:4px;box-sizing:border-box}
    .box span{position:absolute;top:-14px;left:-14px;width:26px;height:26px;border-radius:13px;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 0 0 2px #fff}
    .empty{border:1px dashed #999;padding:24px;color:#555;min-height:120px}
    .docs{border:1px solid #1f5fbf;border-top:none;padding:16px 18px;background:#f5f8ff;font-size:15px}
    .docs p{margin:0 0 10px} .docsflag{display:inline-block;background:#b35900;color:#fff;font-weight:700;font-size:12px;padding:2px 8px;border-radius:3px;margin-bottom:12px}
    .src{color:#555;font-size:12px;word-break:break-all;margin-top:4px}
    table{border-collapse:collapse;width:100%;margin-top:20px} th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}
    th{background:#f2f2f2} td.m{font-weight:600;white-space:nowrap}
    .notes{margin-top:12px;color:#444;font-size:13px} .notes li{margin:2px 0}
  </style></head><body>
    <h1>${esc(cfg.id)} — ${esc(cfg.title)}<span class="verdict">${esc(cfg.verdict)}</span></h1>
    <div class="sub">TAVI Desk (staging-desk.taviportal.com) vs live Zoho Desk (Enterprise trial) · ${esc(cfg.date)} · numbers on the images match the # column</div>
    <div class="cols"><div class="col">${col('TAVI')}</div><div class="col">${col('Zoho')}</div></div>
    <table><tr><th>#</th><th>Behaviour</th><th>Zoho Desk</th><th>TAVI Desk</th><th>Match</th></tr>
    ${cfg.rows.map(r => `<tr><td>${esc(r.n || '')}</td><td>${esc(r.b)}</td><td>${esc(r.zoho)}</td><td>${esc(r.tavi)}</td><td class="m" style="color:${MATCH_COLOR[r.match] || '#333'}">${esc(r.match)}</td></tr>`).join('')}
    </table>
    ${cfg.notes && cfg.notes.length ? `<ul class="notes">${cfg.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
  </body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  const out = path.resolve(base, cfg.out);
  await page.screenshot({ path: out, fullPage: true });
  await b.close();
  console.log('wrote', out);
})().catch(e => { console.error(e); process.exit(1); });
