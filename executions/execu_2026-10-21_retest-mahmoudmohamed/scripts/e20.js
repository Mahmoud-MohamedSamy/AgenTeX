await page.getByRole('menuitem', { name: 'Delete' }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last();
const t = await d.innerText();
const ctrls = await d.locator('select, button[aria-haspopup=listbox], input').evaluateAll(es => es.map(e => e.tagName + ' ' + (e.getAttribute('aria-label') || e.name || '') + ' = ' + (e.tagName === 'SELECT' ? [...e.options].map(o => o.text + (o.selected ? '*' : '')).join('|') : (e.innerText || e.value || ''))));
await shot('1325-06-delete-modal');
return done({ t, ctrls });
