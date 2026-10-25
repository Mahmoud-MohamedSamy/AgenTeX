const out = {};
await page.getByRole('button', { name: /Operator/ }).last().click(); await sleep(700); out.ops2 = await page.locator('[role=option], [role=listbox] li').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(300);
await page.getByText('Choose a record', { exact: true }).last().click(); await sleep(2000);
const dlg = page.locator('[role=dialog]').last(); out.title = (await dlg.innerText()).split('\n')[0];
const rows = dlg.locator('tbody tr'); const n = await rows.count(); for (let i = 0; i < Math.min(2, n); i++) { await rows.nth(i).click(); await sleep(600); }
out.dlgButtons = await dlg.locator('button').evaluateAll(es => es.map(e => e.innerText.trim()).filter(Boolean).slice(-4));
const ok = dlg.getByRole('button', { name: /^(Done|Select|Apply|Add)/ }).last(); if (await ok.count()) { await ok.click(); await sleep(1200); }
out.row2 = (await txt()).match(/Multi-Sele[\s\S]{0,250}/)?.[0];
await shot('1837-09-multi-picked');
await page.getByRole('button', { name: 'Cancel', exact: true }).last().click(); await sleep(1200);
const conf = page.locator('[role=dialog],[role=alertdialog]').last(); if (await conf.count()) { const d = conf.getByRole('button', { name: /Discard|Leave|Yes/i }).first(); if (await d.count()) { await d.click(); await sleep(800); } }
out.closed = !(await page.getByText('Create Queue', { exact: true }).count());
return done(out);
