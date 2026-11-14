// Usage: node render-table.js <in.json> <out.png>   in: {title, sub, head:[..], rows:[[..]], mark:[rowIndex..]} -> 1280x720 PNG; prints row boxes as JSON
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [inf, out] = process.argv.slice(2); const d = JSON.parse(fs.readFileSync(inf, 'utf8')); const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = `<html><body style="margin:0;font:14px Segoe UI,Arial;background:#fff;color:#111"><div style="padding:22px 26px"><div style="font-size:18px;font-weight:600;margin-bottom:4px">${esc(d.title)}</div><div style="color:#555;margin-bottom:12px">${esc(d.sub)}</div>
<table style="border-collapse:collapse;width:100%"><tr>${d.head.map(h => `<th style="border:1px solid #ccc;padding:6px 9px;text-align:left;background:#f1f5f9">${esc(h)}</th>`).join('')}</tr>${d.rows.map((r, i) => `<tr id="r${i}">` + r.map(c => `<td style="border:1px solid #ccc;padding:6px 9px;font-family:${d.mono ? 'Consolas,monospace' : 'inherit'};${/^(false|no)\b/i.test(c) ? 'color:#b91c1c;font-weight:600' : /^(true|yes)\b/i.test(c) ? 'color:#15803d;font-weight:600' : ''}">${esc(c)}</td>`).join('') + '</tr>').join('')}</table></div></body></html>`;
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.setContent(html);
  const boxes = []; for (let i = 0; i < d.rows.length; i++) { const r = await p.locator('#r' + i).boundingBox(); boxes.push(r && [r.x, r.y, r.x + r.width, r.y + r.height].map(Math.round)); }
  await p.screenshot({ path: out }); console.log(JSON.stringify(boxes)); await b.close(); })();
