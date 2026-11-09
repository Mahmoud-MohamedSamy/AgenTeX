for (let i = 0; i < 60; i++) { await sleep(1000); if (/Total Records [1-9]/.test(await page.innerText('main'))) break; }
await sleep(2000);
out.t = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Based on criteria.{0,400}/)?.[0];
out.funnel = await page.$$eval('main button[aria-label*="ilter"]', es => es.map(e => e.getAttribute('aria-label') + ' pressed=' + e.getAttribute('aria-pressed') + ' ' + e.className.slice(0, 80)));
out.ls = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('aw:crm:workqueue')).map(k => k + '=' + localStorage.getItem(k).slice(0, 200)));
await page.screenshot({ path: RAW + 'wq-filter-after-reload2.png' });
