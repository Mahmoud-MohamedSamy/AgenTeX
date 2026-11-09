const rq = page.waitForResponse(r => /reporting\/reports/.test(r.url()) && ['POST', 'PUT', 'PATCH'].includes(r.request().method()), { timeout: 30000 }).catch(() => null);
await page.locator('button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
let t = (await page.innerText('body')).replace(/\s+/g, ' ');
const dlg = await page.locator('[role=dialog]').count();
let dtext = dlg ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ') : '';
await shot('s02-save-dialog');
if (dlg) { await page.locator('[role=dialog] button', { hasText: /^Save$/ }).first().click().catch(() => {}); }
const r = await rq; await sleep(4000);
await shot('s02-saved');
return { dtext: dtext.slice(0, 800), save: r ? r.status() + ' ' + (await r.text()).slice(0, 300) : 'none', url: page.url().replace(H, '') };
