const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(B + `/modules/${L}/mass-delete`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(1000); const t = await page.innerText('main').catch(() => ''); if (t.length > 100 && !/Loading/.test(t)) break; }
await sleep(2000);
out.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 1200);
out.controls = await page.$$eval('main button, main select, main input', es => es.map(e => (e.tagName + ':' + (e.getAttribute('aria-label') || e.getAttribute('placeholder') || e.innerText || e.value || '')).trim().slice(0, 50)));
await page.screenshot({ path: RAW + 'md-page.png' });
