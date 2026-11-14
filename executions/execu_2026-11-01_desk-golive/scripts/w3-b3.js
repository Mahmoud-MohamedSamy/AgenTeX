const T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
await go('/views/all/tickets/' + T1, 12000);
out.btns = await page.locator('#main-content button:visible').evaluateAll(es => es.map(e => ((e.getAttribute('aria-label') || '') + '/' + (e.innerText || '').trim().slice(0, 25)).replace(/\s+/g, ' ')).filter(x => x !== '/'));
out.hasCA = out.btns.filter(b => /action|more|⋯|…/i.test(b));
await shot('w3/W3-14-ticket');
// try More / kebab in ticket header
for (const lab of ['More actions', 'More', 'Actions']) { const b = page.locator('#main-content').getByRole('button', { name: lab }).first(); if (await b.count()) { await b.click(); await sleep(1500); out['menu_' + lab] = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w3/W3-14-menu-' + lab.replace(' ', '')); await page.keyboard.press('Escape'); await sleep(500); } }
return fin({ out });
