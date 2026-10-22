const sels = page.locator('select'); const n = await sels.count(); let done1 = null;
for (let i = 0; i < n; i++) { const o = await sels.nth(i).evaluate(s => [...s.options].map(x => x.text)); if (o.includes('Profiles')) { await sels.nth(i).selectOption({ label: 'Profiles' }); done1 = o; break; } }
if (!done1) { const b = page.locator('button[aria-haspopup=listbox]').filter({ hasText: 'Users' }).last(); if (await b.count()) { await b.click(); await sleep(800); await page.getByRole('option', { name: 'Profiles' }).click(); done1 = 'listbox'; } }
await sleep(2000);
const prof = (await txt()).match(/Select principals for[\s\S]{0,600}/)?.[0];
await shot('2229-04-picker-profiles');
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click().catch(() => {});
return done({ done1, prof });
