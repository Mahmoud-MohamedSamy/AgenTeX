// Read-only: screenshot each feature page, record final URL and heading. No clicks that change anything.
const pages = JSON.parse(require('fs').readFileSync(require('path').resolve('pages.json'), 'utf8'));
const out = {};
const head = async () => page.evaluate(() => { const m = document.querySelector('main') || document.body; const h = m.querySelector('h1,h2'); return (h ? h.innerText + ' | ' : '') + (m.innerText || '').replace(/\s+/g, ' ').slice(0, 200); });
const skip = ['01-modules-fields', '10c-import', '11c-team-feeds', '09-automation-studio'];
for (const [label, url] of pages) {
  if (skip.includes(label)) continue;
  await page.goto(H + url, { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
  await page.screenshot({ path: '../evidence/raw/' + label + '.png' });
  out[label] = { url: page.url().replace(H, ''), head: await head() };
}
for (const [label, txt] of [['01-modules-fields', 'Modules and Fields'], ['10c-import', 'Import']]) {
  await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
  await page.locator('main').getByText(txt, { exact: true }).first().click({ timeout: 20000 }).catch(e => { out[label + '-err'] = String(e.message).slice(0, 80); });
  await sleep(10000); await page.screenshot({ path: '../evidence/raw/' + label + '.png' });
  out[label] = { url: page.url().replace(H, ''), head: await head() };
}
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
await page.getByPlaceholder('Search Setup').fill('automation').catch(() => {}); await sleep(3000);
await page.screenshot({ path: '../evidence/raw/09-automation-studio-search.png' });
out['09-search'] = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
const hrefs = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
out.links = [...new Set(hrefs)].filter(h => h && h.startsWith('/') && !h.startsWith('/settings')).slice(0, 40);
return out;
