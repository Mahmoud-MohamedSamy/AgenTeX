const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
for (let k = 0; k < 40; k++) { await sleep(1000); if (/System Information|Lead Information/.test(await txt().catch(() => ''))) break; }
const secs = (await txt()).split('\n').filter(l => /Information|Section/.test(l)).slice(0, 5);
await page.locator('header button, button').filter({ has: page.locator('svg.lucide-settings, svg.lucide-cog') }).first().click().catch(() => {}); await sleep(1200);
const dlg = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 400) || null);
const inputs = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] input')].map(i => (i.getAttribute('aria-label') || i.placeholder || i.name) + '=' + i.value));
await shot('1335-04-layout-settings');
return done({ secs, dlg, inputs });
