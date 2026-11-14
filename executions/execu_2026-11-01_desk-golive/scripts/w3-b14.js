await go('/settings/developer/custom-actions', 10000);
await page.locator('#main-content').getByText('Variables', { exact: true }).first().click(); await sleep(3000);
await page.getByRole('button', { name: /New variable/ }).first().click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); out.form = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700);
out.ctrls = await d.locator('input,textarea,button,[role=switch],[role=checkbox]').evaluateAll(es => es.map(e => [e.tagName, e.type, e.placeholder, e.getAttribute('aria-label'), (e.innerText || '').trim().slice(0, 25)].join('|')));
await shot('w3/W3-16-new-variable');
return fin({ out });
