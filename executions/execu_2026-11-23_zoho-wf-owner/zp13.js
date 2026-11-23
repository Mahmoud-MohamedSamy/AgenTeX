const urls = new Set(); page.context().on('response', r => { const u = r.url(); if (/\.js(\?|$)/.test(u)) urls.add(u); });
await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
const wf = page.getByText('Workflows', { exact: true }); await wf.first().waitFor({ timeout: 150000 }); await wf.first().click(); await sleep(20000);
const box = await page.getByText('Rules', { exact: true }).first().boundingBox(); await page.mouse.click(181, box.y + box.height / 2); await sleep(25000);
out.n = urls.size; out.hits = [];
for (const u of urls) { let t = ''; try { const r = await page.context().request.get(u); t = await r.text(); } catch { continue; }
  for (const k of ['FIELD_UPDATES', 'FIELDUPDATES', '"FIELDUPDATE"', 'CUSTOM_FUNCTION', '"ALERTS"', 'events:[', 'executeOn:{']) { const i = t.indexOf(k); if (i >= 0) out.hits.push(u.split('/').pop().slice(0, 50) + ' | ' + k + ' | ' + t.slice(Math.max(0, i - 300), i + 400).replace(/\s+/g, ' ')); } }
require('fs').writeFileSync('zp13.json', JSON.stringify(out, null, 1));
