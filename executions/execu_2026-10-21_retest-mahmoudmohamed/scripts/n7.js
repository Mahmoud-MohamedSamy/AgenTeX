const sel = page.locator('select').filter({ hasText: 'Select field…' }).last();
await sel.selectOption({ label: 'Pick List Permission' }); await sleep(1500);
const panel = (await txt()).split('CONTROLLING FIELD')[1]?.split('Cancel')[0]?.replace(/Name\nSingle Line[\s\S]*?New Address\n/, '[field list]\n').slice(0, 600);
await shot('1230-05-rule-configurable');
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click(); await sleep(1500);
const left = await page.locator('text=Field Properties').count();
return done({ panel, panelClosed: !left });
