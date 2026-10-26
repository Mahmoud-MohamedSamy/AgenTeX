await page.getByRole('button', { name: 'Create Folder' }).click(); await sleep(1000);
await page.locator('input[value^="Untitled Folder"]').first().fill('QA RT Folder B'); await page.keyboard.press('Enter'); await sleep(800);
const addTo = async (mods, target) => {
  await page.getByRole('button', { name: 'Add Modules' }).click(); await sleep(1500);
  for (const m of mods) { await page.getByPlaceholder('Search Module').fill(m); await sleep(500); await page.locator('label').filter({ hasText: new RegExp('^\s*' + m + '\s*$') }).first().click().catch(async () => page.getByText(m, { exact: true }).last().click()); await sleep(300); }
  await page.getByPlaceholder('Search Module').fill(''); await sleep(300);
  if (target) { await page.getByRole('button', { name: /^Root/ }).click(); await sleep(700); await page.getByText(target, { exact: true }).last().click(); await sleep(500); }
  await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(1500);
};
await addTo(['meetings'], 'QA RT Folder B');
await addTo(['subscriptions'], null);
const card = await page.evaluate(() => { const m = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Associate Modules to your Teamspace'); let c = m; for (let k = 0; k < 4; k++) c = c.parentElement; return c.innerText.slice(0, 500); });
await shot('ts-06-before-save');
return done({ card });
