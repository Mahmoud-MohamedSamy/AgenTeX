// NDC-1335 step 4: Leads → Layouts → Create New Layout (predefined fields only) → Save.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + `/settings/modules-and-fields/${L}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Layouts/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const tab = page.getByRole('tab', { name: /Layouts/ }).first(); if (await tab.count()) { await tab.click(); await sleep(1500); }
const btn = page.getByRole('button', { name: /Create New Layout|New Layout|Create Layout/ }).first();
const has = await btn.count(); if (has) { await btn.click(); await sleep(2500); }
const dlg = await page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.slice(0, 500) || null);
await shot('1335-03-new-layout');
return done({ has, dlg, url: page.url().replace(H, '') });
