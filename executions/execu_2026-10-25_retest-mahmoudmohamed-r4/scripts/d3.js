await page.getByRole('button', { name: /Create New Module/ }).first().click(); await sleep(1500);
const d = page.locator('[role=dialog]').last();
const t = (await d.innerText()).slice(0, 900);
const ctrls = await d.locator('input, button, [role=combobox], [role=checkbox]').evaluateAll(es => es.map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || e.id || '') + ' | ' + (e.value || e.innerText || '').trim()).slice(0, 70)).slice(0, 30));
await shot('2220-01-create-dialog');
return done({ t, ctrls });
