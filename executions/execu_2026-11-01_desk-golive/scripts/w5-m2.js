const wiz = async () => (await page.locator('body').innerText()).replace(/\s+/g, ' ').replace(/.*Email Providers/, '').slice(0, 1400);
await go('/settings/data/import', 12000);
out.pre = (await wiz()).slice(0, 300);
if (!/1 Upload 2 Operation/.test(await wiz())) { const cm = page.getByRole('button', { name: /Choose a module|Module/ }); out.cm = await cm.allInnerTexts(); await page.getByText('Choose a module', { exact: true }).last().click(); await sleep(1500);
await page.getByRole('option', { name: /^Contacts/ }).first().click(); await sleep(1000);
await page.getByRole('button', { name: /Start import/ }).click(); await sleep(4000); }
const fis = page.locator('input[type=file]'); out.nfi = await fis.count();
await fis.last().setInputFiles(RUN + '/wave5/files/w5-contacts.csv'); await sleep(3000);
out.s1 = (await wiz()).slice(-500);
for (let s = 2; s <= 5; s++) { await page.getByRole('button', { name: /^Next$/ }).last().click().catch(e => out['n' + s] = e.message.slice(0, 60)); await sleep(5000); out['s' + s] = (await wiz()).replace(/.*1 Upload 2 Operation 3 Map fields 4 Assign 5 Review 6 Result/, '').slice(0, 900); await shot('w5/W5-35-step' + s); }
return fin({ out });
