const menuOf = async name => { const row = page.locator('tr').filter({ hasText: name }).first(); await row.hover(); await sleep(400); await row.locator('button').last().click(); await sleep(1000);
  const items = await page.locator('[role=menu] [role=menuitem]').evaluateAll(es => es.map(e => e.innerText.trim() + (e.getAttribute('aria-disabled') === 'true' || e.hasAttribute('data-disabled') || e.disabled ? ' (disabled)' : '') + (e.title ? ' [' + e.title + ']' : ''))); return items; };
const a = await menuOf('Test Layout 1'); await shot('1588-02-menu-nondefault'); await page.keyboard.press('Escape'); await sleep(500);
const b = await menuOf('Standard'); await shot('1588-03-menu-default'); await page.keyboard.press('Escape'); await sleep(500);
return done({ nonDefault: a, default: b });
