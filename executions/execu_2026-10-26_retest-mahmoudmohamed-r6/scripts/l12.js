const row = page.locator('div').filter({ hasText: /^Lookup Contacts$/ }).last();
const rb = await page.getByText('Lookup Contacts', { exact: true }).first().boundingBox(); await page.mouse.move(rb.x + 100, rb.y + 5); await sleep(800);
await shot('1863-00-hover');
const btns = await page.locator('button:visible').evaluateAll(b => b.map(x => ({ t: (x.innerText || x.getAttribute('aria-label') || '').trim(), y: Math.round(x.getBoundingClientRect().y) })).filter(x => x.t));
return done({ rowY: rb.y, near: btns.filter(b => Math.abs(b.y - rb.y) < 30) });
