const o = {}; const MID = 'b9f87f12-8fd8-499d-a8e6-b50b092e31b3';
await page.goto(H + '/settings/modules-and-fields/' + MID + '?tab=fields', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 25; i++) { await sleep(1000); if (/QA GL N Required/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const tab = page.getByRole('tab', { name: 'Fields' }); if (!/QA GL N Required/.test(await txt()) && await tab.count()) { await tab.click(); await sleep(4000); }
const row = page.locator('tr', { hasText: 'QA GL N Required' }).first(); o.row = await row.count();
if (o.row) { await row.hover().catch(() => {}); const mb = row.locator('button').last(); await mb.click().catch(e => o.mbErr = e.message.slice(0, 80)); await sleep(1500);
  o.menu = await page.$$eval('[role=menuitem], [role=menu] *', ms => [...new Set(ms.filter(m => m.offsetParent).map(m => (m.innerText || '').trim()).filter(Boolean))].slice(0, 20)); }
const sp = page.getByRole('menuitem', { name: /permission/i }); o.sp = await sp.count();
if (o.sp) { await sp.first().click(); await sleep(3500); o.dialog = (await txt()).replace(/\s+/g, ' ').match(/(Set|Field) [Pp]ermission.{0,900}/)?.[0]; await page.screenshot({ path: SHOT + '/ndc/NDC-2387-3-perm-dialog.png' }); }
return done(o);
