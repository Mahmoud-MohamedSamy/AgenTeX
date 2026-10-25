// NDC-2122: open the criteria section of the new view editor and list its controls.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAYOUT = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
await go(`/modules/${L}/views/new?layout=${LAYOUT}`, 500);
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"]').count()) break; }
await page.getByLabel('Filter by criteria').check(); await sleep(1500);
const sec = page.locator('section, div').filter({ hasText: /^Specify criteria/ }).first();
await shot('2122-00-criteria');
const ctrls = await page.evaluate(() => [...document.querySelectorAll('#main-content button, #main-content input, #main-content [role=combobox]')].map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText || '').trim()).slice(0, 60)).filter(s => !/^(BUTTON|INPUT)\s*$/.test(s)));
return done({ ctrls: ctrls.slice(0, 60) });
