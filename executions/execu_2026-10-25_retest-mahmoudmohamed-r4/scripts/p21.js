await page.getByRole('menuitem', { name: 'Mass Update' }).click(); await sleep(2000);
const d = page.locator('[role=dialog]').last();
const txt0 = (await d.innerText()).slice(0, 600);
await shot('1316-03-mass-update');
const ctrls = await d.locator('button, select, input, [role=combobox]').evaluateAll(es => es.map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 70)));
return done({ txt0, ctrls });
