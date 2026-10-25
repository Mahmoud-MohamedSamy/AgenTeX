// NDC-2101: polymorphic lookup + multi-select lookup rows on Leads FieldPermissions layout.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAYOUT = '563411f4-6c8e-4b98-a91d-c618d88a5138';
await page.goto(H + `/modules/${L}/views/new?layout=${LAYOUT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if (await page.locator('input[maxlength="120"]').count()) break; }
await page.getByLabel('Filter by criteria').check(); await sleep(1200);
const pick = async (i, name) => { const b = page.getByRole('button', { name: 'Criteria field' }).nth(i); await b.click(); await sleep(1000); const id = await b.getAttribute('aria-controls'); await page.locator(`#${id}`).getByText(name, { exact: true }).first().click(); await sleep(1500); };
await pick(0, 'Lookup Permission');
await page.getByRole('button', { name: 'Add criteria row' }).first().click(); await sleep(1000);
await pick(1, 'Multi-Select Lookup Permission');
await shot('2101-01-lookup-rows');
const ctrls = await page.evaluate(() => [...document.querySelectorAll('#main-content button, #main-content input, #main-content [role=combobox]')].map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim().replace(/\n/g, ' / ')).slice(0, 90)).slice(2, 22));
return done({ ctrls });
