await go('/settings/developer/custom-actions', 14000);
await page.getByRole('button', { name: /^New action$/ }).click(); await sleep(4000);
out.url = page.url().replace(H, ''); out.form = ((await dtxt()) || (await mtxt())).slice(0, 1500);
out.inputs = await page.locator('[role=dialog] input, [role=dialog] textarea, main input, main textarea').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || e.id)).slice(0, 25));
await shot('w5/W5-64-new-action');
return fin({ out });
