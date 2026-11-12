async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  for (const [k, id] of [['partner', '2ca6bc00-4cbd-4d73-9f0c-08805e783556'], ['question', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9']]) { await openRec(mid, id);
    const menus = []; for (const name of [/^Actions$/, /More/]) { const b = page.getByRole('button', { name }).first(); if (await b.count()) { await b.click(); await sleep(900); menus.push(...(await page.locator('[role=menuitem]').allInnerTexts()).filter(s => /QA LR1112/.test(s))); await page.keyboard.press('Escape'); await sleep(300); } }
    const kebab = page.locator('button:has(svg.lucide-ellipsis-vertical), button:has(svg.lucide-more-vertical)').first(); if (await kebab.count()) { await kebab.click(); await sleep(900); menus.push(...(await page.locator('[role=menuitem]').allInnerTexts()).filter(s => /QA LR1112/.test(s))); await page.keyboard.press('Escape'); }
    R[k] = menus; }
  return R; }
