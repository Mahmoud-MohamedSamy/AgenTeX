await go('/settings/data/retention', 12000);
await page.getByRole('button', { name: 'Add hold' }).click(); await sleep(2000);
const d = page.locator('[role=dialog]').last();
await d.getByRole('button', { name: 'Choose a ticket' }).click(); await sleep(2000);
out.pop = (await page.locator('[role=listbox], [role=dialog], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
out.inputs = await page.locator('input:visible').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || '')));
await shot('w5/W5-48-picker');
return fin({ out });
