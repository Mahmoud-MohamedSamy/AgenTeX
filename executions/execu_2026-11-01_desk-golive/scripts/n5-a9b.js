const o = {};
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC/.test(t)) break; }
await page.locator('text=/^Fields$/').first().click().catch(() => {}); await sleep(5000);
const row = page.locator('tr', { hasText: /^\s*Status\b/ }).first(); o.r = await row.count();
o.rows = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()).filter(t => /^Status/.test(t)).slice(0, 3));
await page.locator('tr').filter({ hasText: /^Status\s/ }).locator('a, button, span').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(3000);
o.t = (await txt()).replace(/\s+/g, ' ').match(/(Edit field|Status).{0,600}/)?.[0];
o.u = page.url().replace(H, ''); o.shot = await shot('a9/tavi-status-field');
return JSON.stringify(o);
