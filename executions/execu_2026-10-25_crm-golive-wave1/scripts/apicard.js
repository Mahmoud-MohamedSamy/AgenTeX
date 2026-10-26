// Renders an API trace card PNG into evidence/raw. Usage: node apicard.js <card.json>  {out, title, lines:[[text, kind]]} kind: ok|bad|info|''
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const c = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const K = { ok: '#16a34a', bad: '#dc2626', info: '#2563eb', '': '#111827' };
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;width:1600px;background:#fff;font:22px/1.55 Consolas,monospace;color:#111827}
h1{margin:0;padding:22px 32px;font:600 26px "Segoe UI",sans-serif;background:#f3f4f6;border-bottom:1px solid #d1d5db}.l{padding:6px 32px;white-space:pre-wrap}</style></head><body>
<h1>${esc(c.title)}</h1><div style="padding:14px 0">${c.lines.map(([t, k]) => `<div class="l" style="color:${K[k || '']};${k === 'bad' ? 'font-weight:700' : ''}">${esc(t)}</div>`).join('')}</div></body></html>`;
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] }); const pg = await b.newPage({ viewport: { width: 1600, height: 400 } });
  await pg.setContent(html); const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 1600, height: h });
  await pg.screenshot({ path: path.join(P, 'executions/execu_2026-10-25_crm-golive-wave1/evidence/raw', c.out) }); await b.close(); console.log('card', c.out, h); })();
