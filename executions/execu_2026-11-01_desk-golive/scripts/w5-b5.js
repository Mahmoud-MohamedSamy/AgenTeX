await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
await page.getByLabel('Select QA GL W5 Imp T2').check(); await page.getByLabel('Select QA GL W5 Imp T1').check(); await sleep(1500);
await page.locator('main').getByRole('button', { name: 'Update', exact: true }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500);
out.ctl = await d.locator('button, select, input').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().slice(0, 30)));
await shot('w5/W5-44-update-dialog');
return fin({ out });
