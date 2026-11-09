const o = {};
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/CUSTOMIZATION/.test(t)) break; }
const t = (await txt()).replace(/\s+/g, ' '); o.custom = t.match(/CUSTOMIZATION.{0,300}/)?.[0];
const link = page.locator('a, button', { hasText: /Ticket Status/i }).first(); o.link = await link.count();
if (o.link) { await link.click(); await sleep(6000); o.url = page.url().replace(H, ''); o.page = (await txt()).replace(/\s+/g, ' ').replace(/^.*?Email Providers/, '').slice(0, 900); o.shot = await shot('rt/2797-status-page'); }
return JSON.stringify(o);
