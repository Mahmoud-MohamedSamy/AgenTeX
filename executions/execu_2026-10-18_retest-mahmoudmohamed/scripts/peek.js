await page.keyboard.press('Escape'); await sleep(500); await shot('_peek');
const b = []; for (const e of await page.locator('main button').all()) { const l = (await e.getAttribute('aria-label')) || (await e.innerText()).trim(); if (l && !/Edit field|Select record/.test(l)) b.push(l); }
return done(b.slice(0, 40));
