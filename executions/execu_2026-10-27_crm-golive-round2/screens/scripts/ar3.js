await page.goto(B + '/settings/personal/locale', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); if ((await page.$$('main select, main [role=combobox]')).length) break; }
await sleep(1500);
out.controls = await page.$$eval('main select, main [role=combobox], main button', es => es.map(e => (e.tagName + ':' + (e.getAttribute('aria-label') || e.name || e.id || '') + '=' + (e.value || e.innerText || '')).replace(/\s+/g, ' ').slice(0, 80)));
out.text = (await page.innerText('main')).replace(/\s+/g, ' ').match(/(اللغة|Language).{0,500}/)?.[0];
await page.screenshot({ path: RAW + 'ar-locale-page.png' });
