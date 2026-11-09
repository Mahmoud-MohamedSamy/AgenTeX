// NDC-1950: options offered by U2's "Submitted by" filter (should be U2 + U1 only).
await page.goto(H + '/my-requests', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('[role=tab]', { timeout: 120000 }); await sleep(4000);
await page.locator('[role=tab]', { hasText: /History/ }).first().click(); await sleep(5000);
const info = await page.evaluate(() => { const el = [...document.querySelectorAll('select, button, [role=combobox]')].find(e => /Submitted by/.test(e.getAttribute('aria-label') || e.innerText || '') || /Submitted by/.test(e.closest('label, div')?.innerText?.split('\n')[0] || ''));
  return el ? { tag: el.tagName, options: el.tagName === 'SELECT' ? [...el.options].map(o => o.textContent.trim()) : null } : null; });
if (info && !info.options) { await page.locator('text=All submitters').first().click(); await sleep(2000); info.options = await page.$$eval('[role=option], [role=listbox] *, [role=menu] [role=menuitemcheckbox]', els => [...new Set(els.map(e => e.innerText.trim()).filter(t => t && t.length < 50))]).catch(() => []); await shot('1950-7-u2-submitted-by.png'); }
return info;
