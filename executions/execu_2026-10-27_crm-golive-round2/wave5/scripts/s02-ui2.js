const d = page.locator('[role=dialog]').first();
await d.locator('input').first().fill('QA R2W5 Report rollup');
await d.locator('button, [role=combobox]', { hasText: 'Select a dataset' }).first().click(); await sleep(1500);
const opts = await page.$$eval('[role=option], [cmdk-item], [role=listbox] li', os => os.map(o => o.innerText.trim()));
await shot('s02-datasets');
const target = page.locator('[role=option], [cmdk-item], [role=listbox] li', { hasText: /QA R2W5 Module/ }).first();
const has = await target.count();
if (has) { await target.click(); await sleep(800); await d.locator('button', { hasText: /^Create$/ }).click(); await sleep(6000); }
await shot('s02-builder');
const t = (await page.innerText('body')).replace(/\s+/g, ' ');
return { n: opts.length, opts: opts.slice(0, 40), has, url: page.url().replace(H, ''), text: t.slice(t.indexOf('Meetings') + 8, t.indexOf('Meetings') + 1800) };
