await drag('Lookup', 800, 600);
await page.getByText('GENERAL', { exact: true }).last().click({ force: true }); await sleep(1000);
await page.getByPlaceholder('Label in English').fill('Lookup Contacts'); await sleep(1200);
const api = await page.locator('input:visible').evaluateAll(a => a.map(x => x.value).filter(v => /^lookup/i.test(v)));
await shot('1873-05-duplicate-label');
return done({ apiNameShown: api });
