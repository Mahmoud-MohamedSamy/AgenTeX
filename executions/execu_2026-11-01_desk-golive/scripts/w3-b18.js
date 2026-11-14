await go('/settings/developer/custom-actions', 10000);
await page.getByRole('button', { name: 'Actions for QA GL W3 echo', exact: true }).click(); await sleep(1200); await page.getByRole('menuitem', { name: /^Access/ }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); out.form = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 800); await shot('w3/W3-18-access-dialog');
await d.getByText(/Only selected/).first().click(); await sleep(1500); out.form2 = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 900);
out.ctrls = await d.locator('input,button,[role=combobox],[role=tab]').evaluateAll(es => es.filter(e => e.offsetParent).map(e => [e.tagName, e.type, e.placeholder, e.getAttribute('aria-label'), (e.innerText || '').trim().slice(0, 30)].join('|')));
await shot('w3/W3-18-access-selected');
return fin({ out });
