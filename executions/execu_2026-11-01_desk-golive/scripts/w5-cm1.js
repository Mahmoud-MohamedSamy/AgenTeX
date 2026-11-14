await go('/settings/modules-and-fields', 12000);
await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(4000);
out.url = page.url().replace(H, ''); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.indexOf('Email Providers'); out.form = t.slice(i > 0 ? i + 15 : 0, (i > 0 ? i : 0) + 1200);
out.dlg = (await dtxt()).slice(0, 800);
out.inputs = await page.locator('input:visible, textarea:visible').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || '')).slice(0, 15));
await shot('w5/W5-51-create');
return fin({ out });
