const pick = async (btn, opt) => { await page.getByRole('button', { name: btn, exact: true }).click(); await sleep(1000); await page.locator('[role=option], [role=listbox] li').filter({ hasText: new RegExp('^' + opt + '$') }).first().click(); await sleep(1200); };
await pick('Module', 'Leads'); await pick('Layout', 'FieldPermissions');
await shot('1837-03-module-layout');
await page.getByRole('button', { name: /^Next/ }).click(); await sleep(2500);
const t = (await page.locator('[role=dialog]').last().innerText().catch(async () => (await txt()).slice(-1500))).slice(0, 1200);
await shot('1837-04-step2');
return done({ t });
