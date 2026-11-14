await go('/analytics/dashboards', 9000);
await page.getByRole('button', { name: 'Add Dashboard', exact: true }).click(); await sleep(3000);
out.dlg = (await dtxt()).slice(0, 600); out.url1 = page.url().replace(H, '');
out.ctl = await page.locator('[role=dialog]').last().locator('button, input, textarea').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().slice(0, 40)));
await shot('w5/W5-30-add');
return fin({ out });
