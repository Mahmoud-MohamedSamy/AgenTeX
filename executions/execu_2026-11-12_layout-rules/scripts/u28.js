async (page) => { const R = {};
  R.sel = await page.evaluate(() => [...document.querySelectorAll('select')].map(s => ({ id: s.id, name: s.name, opts: [...s.options].map(o => o.text).slice(0, 8), val: s.value })));
  const prevSel = page.locator('select').filter({ hasText: 'When condition 1 matches' }).first();
  if (await prevSel.count()) { const opts = await prevSel.locator('option').allInnerTexts(); R.prevOpts = opts; await prevSel.selectOption({ index: 1 }); await sleep(1200); const t = await bodyText(); const i = t.indexOf('QA LR1112 Sec B'); R.c2 = t.slice(i, i + 120); await prevSel.selectOption({ index: opts.length - 1 }); await sleep(1000); const t2 = await bodyText(); const j = t2.indexOf('QA LR1112 Sec A'); R.cLast = t2.slice(j, j + 200); }
  return R; }
