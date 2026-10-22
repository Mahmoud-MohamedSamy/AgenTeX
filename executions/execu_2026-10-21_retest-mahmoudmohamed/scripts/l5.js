const menuOf = async name => { await page.getByRole('button', { name: 'Open menu for ' + name, exact: true }).click(); await sleep(1000);
  return await page.locator('[role=menu] [role=menuitem]').evaluateAll(es => es.map(e => e.innerText.trim() + (e.getAttribute('aria-disabled') === 'true' || e.hasAttribute('data-disabled') ? ' (disabled)' : '') + (e.title ? ' [' + e.title + ']' : ''))); };
const a = await menuOf('Test Layout 1'); await shot('1588-02-menu-nondefault'); await page.keyboard.press('Escape'); await sleep(600);
const b = await menuOf('Standard'); await shot('1588-03-menu-default'); await page.keyboard.press('Escape'); await sleep(600);
const tog = await page.getByRole('switch', { name: 'Toggle Standard status' }).evaluate(e => ({ disabled: e.getAttribute('aria-disabled'), title: e.closest('[title]')?.title || e.title }));
return done({ nonDefault: a, default: b, defaultToggle: tog });
