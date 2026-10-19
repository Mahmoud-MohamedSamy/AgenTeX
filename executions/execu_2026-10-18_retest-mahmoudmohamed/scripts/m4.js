await go('/workqueue', 15000);
const out = {};
const dlgT = async () => (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 900);
const panel = async () => (await page.locator('aside, nav').filter({ hasText: 'My Work Queues' }).first().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 500);
out.panelBefore = (await page.locator('main').last().innerText().catch(()=>'')).slice(0,0);
await page.getByRole('button', { name: 'Arrange queues' }).click(); await sleep(2000);
out.dialog = await dlgT(); await shot('NDC-1819-12-arrange-dialog');
out.dlgButtons = []; for (const e of await page.locator('[role=dialog]').last().locator('button, [role=radio], [role=tab]').all()) { const l = (await e.getAttribute('aria-label')) || (await e.innerText()).trim(); if (l) out.dlgButtons.push(l + ((await e.getAttribute('aria-checked')) ? '[' + (await e.getAttribute('aria-checked')) + ']' : '') + ((await e.getAttribute('aria-selected')) ? '{' + (await e.getAttribute('aria-selected')) + '}' : '')); }
return done(out);
