const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + `/modules/${L}`, { waitUntil: 'commit' });
for (let k = 0; k < 90; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (/\d+ records/.test(t) && !/Loading Leads/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: /Custom views/ }).first().click().catch(async () => { await page.getByText('QA RT 2098 last').first().click(); }); await sleep(2000);
const menu = (await page.locator('[role=menu],[role=listbox],[role=dialog]').allInnerTexts()).join(' | ').slice(0, 600);
await shot('cv-00-picker');
return done({ menu });
