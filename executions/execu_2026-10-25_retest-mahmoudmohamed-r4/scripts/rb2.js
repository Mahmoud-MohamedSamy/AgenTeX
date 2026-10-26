await page.getByRole('button', { name: 'Filters' }).click(); await sleep(1500);
const panel = await page.evaluate(() => (document.querySelector('[role=dialog]') || document.querySelector('[data-radix-popper-content-wrapper]') || {}).innerText?.slice(0, 600) || null);
const ctrls = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] button, [role=dialog] [role=combobox], [data-radix-popper-content-wrapper] button, [data-radix-popper-content-wrapper] [role=combobox]')].map(e => (e.getAttribute('aria-label') || '') + ' | ' + e.innerText.trim().slice(0, 40)));
await shot('rb-01-filters');
return done({ panel, ctrls });
