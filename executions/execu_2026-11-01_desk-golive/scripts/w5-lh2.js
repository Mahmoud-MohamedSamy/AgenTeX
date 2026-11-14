await go('/settings/data/retention', 12000); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); out.lh = t.slice(t.indexOf('Legal holds'), t.indexOf('Legal holds') + 600);
await page.getByRole('button', { name: 'Add hold' }).click(); await sleep(2000);
const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 700);
out.ctl = await d.locator('button, input, textarea, select').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.name || e.innerText || '').trim().slice(0, 30)));
await shot('w5/W5-48-add-hold');
return fin({ out });
