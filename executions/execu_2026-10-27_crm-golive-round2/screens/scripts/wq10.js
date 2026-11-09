const D = async () => (await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 1500))))[0];
await page.click('main button[aria-label="Create a queue on Leads"]'); await sleep(3000);
out.step1 = await D(); await page.screenshot({ path: RAW + 'wq-create-1.png' });
out.buttons1 = await page.$$eval('[role=dialog] button', es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)).filter(Boolean));
