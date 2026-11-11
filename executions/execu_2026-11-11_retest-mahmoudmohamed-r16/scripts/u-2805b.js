await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Create New Layout/.test(await text())) break; } await sleep(2000); let t;
await page.getByText('Fields', { exact: true }).first().click(); await sleep(6000);
const tr = page.locator('tr', { hasText: 'Multi select' }).filter({ hasText: 'skills' }).first(); await tr.scrollIntoViewIfNeeded(); await tr.hover(); await sleep(1000); log('row btns:', await tr.locator('button, a').evaluateAll(bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || b.title || '').trim()))); const btn = tr.locator('button').last(); await btn.click(); await sleep(1500); log('menu:', await page.locator('[role=menuitem]').allInnerTexts()); const mi = page.locator('[role=menuitem]').filter({ hasText: /Edit|Properties/ }).first(); if (await mi.count()) { await mi.click(); await sleep(4000); }
const dlg = page.locator('[role=dialog]').last(); log('dialog:', (await dlg.innerText().catch(() => 'none')).slice(0, 900));
await shot('2805-skills-field.png');
const adv = page.locator('[role=dialog]').last().getByText(/^ADVANCED$|^Advanced$/i).first(); if (await adv.count()) { await adv.click(); await sleep(2500); }
t = await page.locator('[role=dialog]').last().innerText().catch(() => ''); const k = t.search(/Desk manages|locked|API name/i); log('advanced:', t.slice(Math.max(0, k - 400), k + 700));
await shot('2805-skills-advanced.png');
