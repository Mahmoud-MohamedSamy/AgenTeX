const out = {};
// operators
await page.getByRole('button', { name: /Operator/ }).first().click(); await sleep(800); out.ops = await page.locator('[role=option], [role=listbox] li').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(300);
// pick a record
await page.getByText('Choose a record', { exact: true }).first().click(); await sleep(2000);
const dlg = page.locator('[role=dialog]').last(); out.picker = (await dlg.innerText()).slice(0, 300);
const firstOpt = dlg.locator('[role=option], li, tbody tr, label').first(); if (await firstOpt.count()) { out.picked = (await firstOpt.innerText()).trim().slice(0, 40); await firstOpt.click(); await sleep(1200); }
const done1 = dlg.getByRole('button', { name: /Done|Select|Apply|Add/ }).first(); if (await done1.count() && await done1.isVisible().catch(() => false)) { await done1.click(); await sleep(1000); }
out.rowAfterPick = (await txt()).match(/Lookup Per[\s\S]{0,200}/)?.[0];
await shot('1837-06-record-picked');
// second row: multi-select lookup
await page.getByRole('button', { name: 'Add criteria row' }).last().click(); await sleep(1200);
const fb = page.getByRole('button', { name: /Criteria field|Select a field/i }).last(); await fb.click(); await sleep(900);
const s = page.locator('input[placeholder*="earch"]').last(); if (await s.count()) { await s.fill('Multi-Select Lookup'); await sleep(700); }
await page.locator('[role=option], [role=listbox] li').filter({ hasText: /^Multi-Select Lookup Permission$/ }).first().click(); await sleep(1800);
await shot('1837-07-two-rows');
await page.setViewportSize({ width: 1024, height: 720 }); await sleep(1500); await shot('1837-08-narrow');
out.geo = await page.evaluate(() => { const R = e => e.getBoundingClientRect(); const ov = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
  const rm = [...document.querySelectorAll('button')].filter(b => /criteria row/i.test(b.getAttribute('aria-label') || ''));
  const vals = [...document.querySelectorAll('[role=dialog] button')].filter(b => /Choose a record|Pick record|record/i.test(b.innerText) || /module/i.test(b.getAttribute('aria-label') || ''));
  const hits = []; for (const r of rm) for (const v of vals) if (ov(R(r), R(v))) hits.push((r.getAttribute('aria-label')) + ' overlaps ' + (v.innerText || v.getAttribute('aria-label')).trim().slice(0, 25));
  return { addRemove: rm.map(b => b.getAttribute('aria-label')), valueCtrls: vals.length, overlaps: hits }; });
await page.setViewportSize({ width: 1280, height: 720 }); await sleep(800);
return done(out);
