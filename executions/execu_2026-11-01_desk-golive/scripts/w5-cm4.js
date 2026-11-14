await go('/settings/modules-and-fields', 12000);
await page.getByRole('button', { name: 'Open menu for QA GL W5 Module' }).click(); await sleep(2000);
out.items = await page.locator('[role=menuitem], [role=option], [data-radix-popper-content-wrapper] button, [data-radix-popper-content-wrapper] a').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(Boolean));
await shot('w5/W5-51-menu');
return fin({ out });
