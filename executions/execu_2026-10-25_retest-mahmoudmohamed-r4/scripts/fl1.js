const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + `/settings/modules-and-fields/${L}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Create and Edit Fields|Field Listing/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const tab = page.getByRole('tab', { name: /Field Listing|Fields/ }).first(); if (await tab.count()) { await tab.click(); await sleep(2500); }
const toolbar = await page.evaluate(() => [...document.querySelectorAll('button, select, [role=combobox], input')].filter(e => e.offsetParent && e.getBoundingClientRect().top < 260).map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 60)));
const count = ((await txt()).match(/(\d+)\s+fields?/i) || [])[0];
await shot('1598-01-field-listing');
return done({ toolbar, count });
