await page.getByPlaceholder('Search Fields or Data Types').fill('Pipeline'); await sleep(2500);
await shot('pipe-01-field-list');
const rows = await page.locator('table tbody tr, [role=row]').allInnerTexts();
return done({ rows: rows.map(r => r.replace(/\s+/g, ' ').trim()).filter(r => /pipeline/i.test(r)).slice(0, 6) });
