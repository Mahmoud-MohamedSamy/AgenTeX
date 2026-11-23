await page.goto(H + `/modules/${made.mod}/records`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX I2 sort/.test(await text('main'))) break; } await sleep(2000);
const col = async () => page.evaluate(() => { const hs = [...document.querySelectorAll('[role=columnheader], th')].map(h => h.innerText.trim()); const idx = hs.findIndex(h => /^QA FX UI Double/.test(h));
  return [...document.querySelectorAll('[role=row], tr')].map(r => [...r.querySelectorAll('[role=cell], [role=gridcell], td')].map(c => c.innerText.trim())).filter(r => r.length > idx).map(r => r[0] && r[idx]).slice(0, 25); });
log('before', await col());
const hdr = page.locator('[role=columnheader], th').filter({ hasText: 'QA FX UI Double' }).first();
await hdr.hover(); await sleep(500); await shot('I2-hdr-hover');
await hdr.click({ timeout: 5000 }).catch(e => log('click', e.message.split('\n')[0])); await sleep(2500); await shot('I2-hdr-click');
log('menus', (await page.locator('[role=menu], [role=listbox]').allInnerTexts()).join(' || ').slice(0, 400));
log('after click', await col());
