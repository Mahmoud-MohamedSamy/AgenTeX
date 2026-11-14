await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
await page.getByLabel('Select QA GL W5 Imp T2').check(); await page.getByLabel('Select QA GL W5 Imp T1').check(); await sleep(1500);
out.bar = await page.locator('main button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean).slice(0, 25)); await shot('w5/W5-44-selected');
return fin({ out });
