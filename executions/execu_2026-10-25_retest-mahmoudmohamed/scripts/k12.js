await page.getByRole('option', { name: 'Customers', exact: true }).first().click().catch(async () => page.getByText('Customers', { exact: true }).last().click()); await sleep(800);
await page.getByRole('button', { name: 'Choose a record for Lookup Permission' }).click(); await sleep(1500);
await shot('2101-03-record-picker-open');
const dlg = await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? { label: d.getAttribute('aria-label'), inputs: [...d.querySelectorAll('input')].map(i => i.getAttribute('aria-label') || i.placeholder), text: d.innerText.slice(0, 600) } : null; });
return done({ dlg });
