const box = page.locator('div').filter({ has: page.getByText('Add Modules', { exact: true }) }).filter({ has: page.getByPlaceholder('Search Module') }).last();
for (const m of ['tasks', 'calls']) { await box.locator('label, div').filter({ hasText: new RegExp('^' + m + '$') }).locator('input[type=checkbox]').first().check({ force: true }).catch(async () => { await page.getByText(m, { exact: true }).last().click(); }); await sleep(300); }
await page.getByRole('button', { name: /^Root/ }).click(); await sleep(800);
const targets = await page.evaluate(() => [...document.querySelectorAll('[role=option],[role=menuitem],[role=menuitemradio]')].map(e => e.innerText.trim()));
await page.locator('[role=option],[role=menuitem],[role=menuitemradio]').filter({ hasText: 'QA RT Folder A' }).first().click(); await sleep(600);
await shot('ts-04-add-to-folder');
await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(1500);
const card = await page.evaluate(() => { const m = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Associate Modules to your Teamspace'); let c = m; for (let k = 0; k < 4; k++) c = c.parentElement; return c.innerText.slice(0, 400); });
await shot('ts-05-folder-filled');
return done({ targets, card });
