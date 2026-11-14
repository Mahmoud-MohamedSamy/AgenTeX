await go('/settings/developer/custom-actions', 10000);
await page.locator('#main-content').getByText('API sources', { exact: true }).first().click(); await sleep(3000);
const row = page.locator('#main-content tr').filter({ hasText: 'QA GL W3 echo API' }).first(); out.row = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ');
const b = row.locator('button').last(); await b.click(); await sleep(1200); out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => 'no menu')).replace(/\s+/g, ' ');
const e = page.getByRole('menuitem', { name: /Edit/ }).first(); if (await e.count()) { await e.click(); await sleep(3000); }
const d = page.locator('[role=dialog]').last(); out.form = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900); await shot('w3/W3-12-source-edit');
const auth = d.getByRole('button', { name: /Authentication|None/ }).first(); if (await auth.count()) { await auth.click(); await sleep(1200); out.authOpts = (await page.locator('[role=listbox],[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.keyboard.press('Escape'); }
out.ctrls = await d.locator('input,select,button,[role=combobox]').evaluateAll(es => es.map(e => [e.tagName, e.type, e.placeholder, e.getAttribute('aria-label'), (e.innerText || '').trim().slice(0, 25)].join('|')));
return fin({ out });
