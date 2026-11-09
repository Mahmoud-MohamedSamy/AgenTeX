out.dialogs = await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 500)));
out.btns = await page.$$eval('[role=dialog] button', es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)));
await page.screenshot({ path: RAW + 'wq-addqueue.png' });
