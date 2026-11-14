await go('/settings/organization/products', 12000);
await page.getByRole('button', { name: 'New Product' }).click(); await sleep(3000);
out.form = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500) || (await mtxt()).slice(0, 500); out.url = page.url().replace(H, '');
out.inputs = await page.locator('[role=dialog] input, main input').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.name || e.placeholder || e.id)).slice(0, 20));
await shot('w5/W5-60-new-product');
return fin({ out });
