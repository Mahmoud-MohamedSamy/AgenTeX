// Renders an API exchange (request/response excerpts) as a PNG with red annotation boxes on the key lines.
// Usage: node make-api-shot.js <shot.json>   shot = { out, title, blocks:[{head, lines:[string | {t, box:"label"}]}] }
// Tokens are never part of the input (Authorization headers are not logged by the harness).
const path = require('path');
const fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../../node_modules/playwright-core'));
const cfgPath = path.resolve(process.argv[2]);
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
(async () => {
  const b = await chromium.launch({ headless: true });
  const page = await b.newPage({ viewport: { width: 980, height: 80 }, deviceScaleFactor: 1 });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;padding:18px;background:#fff;font:15px/1.5 Consolas,"Courier New",monospace;color:#1d1d1f;width:944px}
    h2{font:600 15px "Segoe UI",Arial,sans-serif;margin:0 0 10px;font-size:17px}
    .blk{border:1px solid #ccc;border-radius:6px;margin-bottom:12px;overflow:hidden}
    .hd{background:#f2f2f2;padding:5px 10px;font:600 12px "Segoe UI",Arial,sans-serif;color:#333}
    .ln{padding:1px 10px;white-space:pre-wrap;word-break:break-all;position:relative}
    .bx{outline:3px solid #c62828;outline-offset:-1px;margin:6px 4px;border-radius:3px;background:#fff5f5}
    .lab{display:inline-block;background:#c62828;color:#fff;font:600 11px "Segoe UI",Arial,sans-serif;padding:1px 6px;border-radius:3px;margin-left:8px;white-space:nowrap}
  </style></head><body><h2>${esc(cfg.title)}</h2>
  ${cfg.blocks.map(bl => `<div class="blk"><div class="hd">${esc(bl.head)}</div>${bl.lines.map(l => typeof l === 'string'
      ? `<div class="ln">${esc(l)}</div>` : `<div class="ln bx">${esc(l.t)}<span class="lab">${esc(l.box)}</span></div>`).join('')}</div>`).join('')}
  </body></html>`;
  await page.setContent(html);
  await page.screenshot({ path: path.resolve(path.dirname(cfgPath), cfg.out), fullPage: true });
  await b.close();
  console.log('wrote', cfg.out);
})().catch(e => { console.error(e); process.exit(1); });
