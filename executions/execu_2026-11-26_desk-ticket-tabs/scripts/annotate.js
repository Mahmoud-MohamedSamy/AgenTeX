// Annotates screenshots: numbered red boxes on the image, a title bar, and a numbered notes table under it.
// node scripts/annotate.js <spec.json>   spec = [{ out, src?, title, verdict, boxes: [[x,y,w,h]], notes: [[n, text]], crop?: [x,y,w,h], card?: { lines: [...] } }]
// "card" renders a text evidence panel (API request/response) instead of a screenshot.
const fs = require('fs'), path = require('path');
const pw = require(path.resolve(__dirname, '../../../node_modules/playwright-core'));
const RUN = path.resolve(__dirname, '..');
const specs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
(async () => {
  const b = await pw.chromium.launch({ channel: 'msedge', headless: true });
  const page = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  for (const s of specs) {
    let body;
    const color = /PASS/i.test(s.verdict) ? '#1f7a4d' : /FAIL|BUG/i.test(s.verdict) ? '#b42323' : '#9a5b00';
    if (s.card) {
      body = `<div class="card">${s.card.lines.map(l => `<div class="${l.startsWith('#') ? 'h' : l.startsWith('>') ? 'bad' : ''}">${esc(l.replace(/^[#>]\s?/, ''))}</div>`).join('')}</div>`;
    } else {
      const src = path.isAbsolute(s.src) ? s.src : path.join(RUN, s.src);
      const data = 'data:image/png;base64,' + fs.readFileSync(src).toString('base64');
      const [cx, cy, cw, ch] = s.crop || [0, 0, 1600, 900];
      body = `<div class="shot" style="width:${cw}px;height:${ch}px"><img src="${data}" style="left:${-cx}px;top:${-cy}px">` +
        (s.boxes || []).map((bx, i) => `<div class="box" style="left:${bx[0] - cx}px;top:${bx[1] - cy}px;width:${bx[2]}px;height:${bx[3]}px"><span>${i + 1}</span></div>`).join('') + `</div>`;
    }
    const html = `<html><head><style>
      body{margin:0;font:15px/1.45 'Segoe UI',system-ui,sans-serif;background:#fff;color:#1b2330;display:inline-block}
      .top{display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:3px solid ${color}}
      .v{font-weight:700;color:#fff;background:${color};padding:3px 10px;border-radius:4px;font-size:13px}
      .t{font-weight:600;font-size:17px}
      .shot{position:relative;overflow:hidden;margin:12px 16px;border:1px solid #ccd}
      .shot img{position:absolute}
      .box{position:absolute;border:3px solid #e01b1b;border-radius:4px;box-sizing:border-box}
      .box span{position:absolute;top:-14px;left:-14px;background:#e01b1b;color:#fff;font-weight:700;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;font-size:14px}
      table{border-collapse:collapse;margin:4px 16px 16px;max-width:1500px}
      td{border-top:1px solid #dde;padding:6px 10px;vertical-align:top}
      td.n{font-weight:700;color:#e01b1b;width:26px}
      .card{margin:12px 16px;padding:14px 18px;background:#f4f6f9;border:1px solid #ccd;border-radius:6px;font:14px/1.6 Consolas,monospace;max-width:1500px;white-space:pre-wrap}
      .card .h{font-family:'Segoe UI',sans-serif;font-weight:600;margin-top:8px}.card .bad{color:#b42323;font-weight:600}
    </style></head><body><div class="top"><span class="v">${esc(s.verdict)}</span><span class="t">${esc(s.title)}</span></div>${body}
    <table>${(s.notes || []).map(n => `<tr><td class="n">${esc(n[0])}</td><td>${esc(n[1])}</td></tr>`).join('')}</table></body></html>`;
    await page.setContent(html); await page.waitForTimeout(300);
    const el = await page.$('body'); const out = path.join(RUN, 'evidence/annotated', s.out);
    fs.mkdirSync(path.dirname(out), { recursive: true }); await el.screenshot({ path: out });
    console.log('wrote', s.out, fs.statSync(out).size);
  }
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
