const d = page.locator('[role=dialog]').last();
await d.getByText('GET /qa-gl-w5').click().catch(async () => await d.locator('input[type=checkbox]').last().check()); await sleep(800);
await d.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3000); out.s3 = (await dtxt()).slice(0, 1500); await shot('w5/W5-64-configure');
out.ctl = await d.locator('button, input, select, textarea').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.placeholder || e.innerText || e.value || '').trim().slice(0, 30)).slice(0, 40));
return fin({ out });
