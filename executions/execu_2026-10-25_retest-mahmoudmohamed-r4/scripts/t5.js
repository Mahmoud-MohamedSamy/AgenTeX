await page.getByRole('button', { name: 'Add Modules' }).click(); await sleep(1500);
const d = page.locator('[role=dialog]').last();
const t = (await d.innerText()).slice(0, 900);
const ctrls = await d.locator('button, input, [role=combobox], select').evaluateAll(es => es.map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 60)).slice(0, 30));
await shot('ts-03-add-modules');
return done({ t, ctrls });
