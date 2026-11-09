const res = {};
// dashboard More actions
await page.goto(H + '/dashboards/view/dcb5e49b-683c-4bb3-a5c4-a535f0e71cb6', { waitUntil: 'domcontentloaded' }); await sleep(7000);
res.btns = [...new Set(await page.$$eval('main button', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(Boolean)))];
const more = page.locator('main button[aria-label="More actions"]');
res.moreCount = await more.count();
if (res.moreCount) { await more.first().click({ force: true }).catch(e => res.moreErr = e.message.slice(0, 80)); await sleep(1200); res.more = await page.evaluate(() => [...document.querySelectorAll('[role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ')); await shot('s03-more-actions'); await page.keyboard.press('Escape'); }
await page.locator('main button[aria-label="Share dashboard"]').first().click({ force: true }).catch(() => {}); await sleep(1200);
res.share = await page.evaluate(() => [...document.querySelectorAll('[role=dialog]')].map(e => e.innerText.replace(/\s+/g, ' ')).join(' || ').slice(0, 500));
await shot('s03-share'); await page.keyboard.press('Escape');
// home raw keys at ~1.5 s
for (let i = 0; i < 3 && !res.rawShot; i++) {
  await page.goto(H + '/home', { waitUntil: 'domcontentloaded' });
  for (let k = 0; k < 8; k++) { await sleep(400); const t = (await page.innerText('main').catch(() => '')); if (/due_date/.test(t)) { await shot('c17-home-rawkeys'); res.rawShot = 'attempt ' + i + ' at ' + (k * 0.4 + 0.4) + 's'; break; } }
}
return res;
