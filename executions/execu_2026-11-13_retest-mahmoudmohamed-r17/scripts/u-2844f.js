await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Subject/.test(await text()) && /Department/.test(await text())) break; } await sleep(3000);
// department first (may reset other fields)
await page.getByText('Sales', { exact: true }).first().click(); await sleep(1200);
await page.getByRole('option', { name: /^Tech$/ }).first().click().catch(async () => { await page.getByText('Tech', { exact: true }).last().click(); }); await sleep(2500);
// contact
await page.getByText('Choose a record…').first().click(); await sleep(1000); await page.keyboard.type('mmohamed@anyware'); await sleep(4000);
const dlg = page.locator('[role=dialog]').last(); log('contact rows:', (await dlg.innerText()).slice(0, 300));
await dlg.locator('tr', { hasText: 'mmohamed@anyware.software' }).first().click(); await sleep(800);
await dlg.getByRole('button', { name: 'Select', exact: true }).click(); await sleep(2500);
await page.getByPlaceholder('Type or pick a subject').fill('QA RT16 2844 form ticket'); await page.keyboard.press('Tab'); await sleep(500);
const st = page.getByText('Select', { exact: true }).first(); await st.click(); await sleep(1000); await page.getByRole('option', { name: /^Open$/ }).first().click().catch(() => page.getByText('Open', { exact: true }).last().click()); await sleep(1000);
const t = await text(); log('form:', t.slice(t.indexOf('Ticket Information'), t.indexOf('Ticket Information') + 260));
await shot('2844-form-filled.png');
await page.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(8000);
log('url after save:', page.url()); await shot('2844-form-saved.png');
