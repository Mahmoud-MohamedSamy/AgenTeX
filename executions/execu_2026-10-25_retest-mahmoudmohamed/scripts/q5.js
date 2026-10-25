await page.getByText('Criteria', { exact: true }).first().click(); await sleep(2000);
const fieldBtn = page.getByRole('button', { name: /Criteria field|Select a field/i }).first();
await fieldBtn.click(); await sleep(1000);
const s = page.locator('input[placeholder*="earch"]').last(); if (await s.count()) { await s.fill('Lookup Permission'); await sleep(700); }
await page.locator('[role=option], [role=listbox] li').filter({ hasText: /^Lookup Permission$/ }).first().click(); await sleep(2000);
const row = (await txt()).match(/Lookup Permission[\s\S]{0,300}/)?.[0];
await shot('1837-05-lookup-row');
const geo = await page.evaluate(() => { const rect = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]; };
  const btns = [...document.querySelectorAll('button')].filter(b => /add criteria row|remove criteria row|delete criteria/i.test(b.getAttribute('aria-label') || '') || /^[−+-]$/.test(b.innerText.trim()));
  const pickBtn = [...document.querySelectorAll('button')].find(b => /pick record/i.test(b.innerText + (b.getAttribute('aria-label') || '')));
  const modSel = [...document.querySelectorAll('button[aria-haspopup], select')].find(b => /module/i.test(b.getAttribute('aria-label') || b.innerText));
  return { addRemove: btns.map(b => (b.getAttribute('aria-label') || b.innerText) + ' ' + rect(b)), pick: pickBtn ? pickBtn.innerText.trim() + ' ' + rect(pickBtn) : 'none', module: modSel ? (modSel.getAttribute('aria-label') || modSel.innerText).trim().slice(0, 30) + ' ' + rect(modSel) : 'none' }; });
return done({ row, geo });
