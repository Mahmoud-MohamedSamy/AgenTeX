// Usage: node render-csv.js <csv> <out.png> <ncols> <title>  — renders the first columns of a CSV as a table image (1280x720)
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [csv, out, nc, title] = process.argv.slice(2);
const all = fs.readFileSync(csv, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).map(l => l.split(',')); const total = all[0].length; const rows = all.map(r => r.slice(0, +nc));
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<html><body style="margin:0;font:15px Segoe UI,Arial;background:#fff;color:#111"><div style="padding:24px"><div style="font-size:18px;font-weight:600;margin-bottom:6px">${esc(title)}</div><div style="color:#555;margin-bottom:14px">${esc(path.basename(csv))} (opened as text; first ${nc} of ${total} columns shown)</div>
<table style="border-collapse:collapse">${rows.map((r, i) => '<tr>' + r.map((c, j) => `<${i ? 'td' : 'th'} id="c${i}_${j}" style="border:1px solid #ccc;padding:8px 10px;text-align:left;${i ? '' : 'background:#f1f5f9'}">${esc(c || '')}</${i ? 'td' : 'th'}>`).join('') + '</tr>').join('')}</table></div></body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.setContent(html);
  const boxes = {}; for (const id of ['c0_1', 'c1_1', 'c4_1', 'c0_2', 'c0_3']) { const r = await p.locator('#' + id).boundingBox(); boxes[id] = r && [r.x, r.y, r.x + r.width, r.y + r.height].map(Math.round); }
  await p.screenshot({ path: out }); console.log(JSON.stringify(boxes)); await b.close(); })();
