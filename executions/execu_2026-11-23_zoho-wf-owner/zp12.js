const urls = new Set(); page.on('response', r => { const u = r.url(); if (/\.js(\?|$)/.test(u) && /zoho|zdesk|desk/.test(u)) urls.add(u); });
await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
const wf = page.getByText('Workflows', { exact: true }); await wf.first().waitFor({ timeout: 150000 }); await wf.first().click(); await sleep(20000);
const rr = page.getByText('Rules', { exact: true }).first(); const box = await rr.boundingBox(); await page.mouse.click(181, box.y + box.height / 2); await sleep(20000);
out.nScripts = urls.size; out.hits = [];
for (const u of urls) { let t = ''; try { t = await page.evaluate(async u => (await fetch(u)).text(), u); } catch { continue; }
  for (const k of ['executeOn', 'FIELD_UPDATE', '"ALERT"', 'automationFieldUpdates']) { let i = t.indexOf(k); let c = 0; while (i >= 0 && c < 2) { out.hits.push(u.split('/').pop().slice(0, 40) + ' | ' + k + ' | ' + t.slice(Math.max(0, i - 200), i + 300).replace(/\s+/g, ' ')); i = t.indexOf(k, i + 1); c++; } } }
require('fs').writeFileSync('zp12.json', JSON.stringify(out, null, 1));
