const rq = page.waitForResponse(r => /joined-reports/.test(r.url()) && ['POST', 'PUT'].includes(r.request().method()), { timeout: 30000 }).catch(() => null);
await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(1500);
if (await page.locator('[role=dialog]').count()) { const d = page.locator('[role=dialog]').first(); await d.locator('input').first().fill('QA R2W5 Joined'); await d.locator('button', { hasText: /^Save$/ }).first().click(); }
const r = await rq; await sleep(4000);
await shot('s02-joined-saved');
return { save: r ? r.status() + ' ' + (await r.text()).slice(0, 250) : 'none', url: page.url().replace(H, '') };
