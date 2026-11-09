const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(B + '/', { waitUntil: 'domcontentloaded' }); await sleep(6000);
await page.locator('header button:has-text("EN")').first().click(); await sleep(800); await page.locator('text=العربية').first().click(); await sleep(4000);
out.r = {};
for (const [n, id] of [['leads', L], ['deals', D]]) {
  await page.goto(B + '/modules/' + id, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 70; i++) { await sleep(1000); if (await page.locator('tbody tr td').count() > 3) break; }
  await sleep(2000);
  out.r[n] = await page.evaluate(() => { const t = document.querySelector('main').innerText; return { count: (t.match(/[\u0660-\u0669\d]+\s*سجل[^\s]*/) || [''])[0], sort: (t.match(/ترتيب[^\n]{0,40}/) || [''])[0], layoutAria: [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(a => /تخطيط|Layout/.test(a)).slice(0, 3), englishHeaders: [...document.querySelectorAll('main th')].map(e => e.innerText.trim()).filter(x => /[A-Za-z]{3}/.test(x)).slice(0, 12) }; });
  await page.screenshot({ path: RAW + 'ar-list-' + n + '.png' });
}
await page.locator('header button:has-text("AR")').first().click(); await sleep(800); await page.locator('text=English').first().click(); await sleep(3000);
out.restored = await page.evaluate(() => document.documentElement.lang);
