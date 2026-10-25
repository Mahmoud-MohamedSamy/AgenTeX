// NDC-2101: lookup value control in Leads view editor — fresh editor, keyboard-driven picker.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAYOUT = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
await page.goto(H + `/modules/${L}/views/new?layout=${LAYOUT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"]').count()) break; }
await page.getByLabel('Filter by criteria').check(); await sleep(1200);
const b = page.getByRole('button', { name: 'Criteria field' }).first(); await b.click(); await sleep(1200);
const id = await b.getAttribute('aria-controls');
const all = await page.evaluate(id => document.getElementById(id)?.innerText.split('\n').map(x => x.trim()).filter(Boolean) || [], id);
await shot('2101-00-picker');
return done({ focused: await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), cnt: all.length, look: all.filter(x => /look|related|owner|user|convert|connect/i.test(x)), first: all.slice(0, 20) });
