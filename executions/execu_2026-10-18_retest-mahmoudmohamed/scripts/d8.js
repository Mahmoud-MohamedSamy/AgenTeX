const out = {};
await page.getByText('1 selected').click(); await sleep(1200);
out.sel = (await page.locator('[role=menu], [role=dialog], [role=listbox]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1200);
out.mod = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
await page.keyboard.press('Escape');
return done(out);
