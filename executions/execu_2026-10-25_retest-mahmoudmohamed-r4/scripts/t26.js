const open = async () => { await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT TS/.test(await txt().catch(() => ''))) break; } await sleep(800); await page.getByText('QA RT TS', { exact: true }).first().click(); await sleep(3000); };
const rail = () => page.evaluate(() => [...document.querySelectorAll('aside a, nav a')].map(a => a.getAttribute('aria-label') || a.title || a.innerText.trim()).filter(Boolean).slice(7, 30));
await open(); const before = await rail();
await page.getByRole('button', { name: 'Add Modules' }).click(); await sleep(1500);
await page.getByPlaceholder('Search Module').fill('leads'); await sleep(500); await page.getByText('leads', { exact: true }).last().click(); await sleep(300);
await page.getByRole('button', { name: /^Root/ }).click(); await sleep(700); await page.getByText('QA RT Folder B', { exact: true }).last().click(); await sleep(500);
await page.getByRole('button', { name: 'Add', exact: true }).click(); await sleep(2000);
const unsaved = await rail(); await shot('1692-01-unsaved-rail');
return done({ before, unsaved });
