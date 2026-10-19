// NDC-1819: why is "Show" disabled in Manage Columns?
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); await sleep(7000);
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: 'Manage Columns' }).first().click(); await sleep(1500);
const dlg = page.locator('[role=dialog]').last();
out.text = (await dlg.innerText()).replace(/\n+/g, ' | ');
out.buttons = await dlg.locator('button').evaluateAll(bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText.trim()) + (b.disabled ? ' [disabled]' : '') + (b.title ? ' title=' + b.title : '')));
await shot('NDC-1819-f-mc-show-disabled');
const hide = dlg.getByRole('button', { name: 'Hide Company column' }); out.hideCo = await hide.count();
if (out.hideCo) { await hide.click(); await sleep(600); out.phoneShowAfterHidingCompany = await dlg.getByRole('button', { name: 'Show Phone column' }).isDisabled(); }
await dlg.getByRole('button', { name: 'Cancel' }).click(); await sleep(800);
return done(out);
