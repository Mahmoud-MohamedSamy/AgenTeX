await page.keyboard.press('Escape');
const t = page.getByText('Phone 6', { exact: true }).first(); await t.scrollIntoViewIfNeeded(); const rb = await t.boundingBox();
await page.mouse.move(rb.x + 100, rb.y + 5); await sleep(500);
const near = await page.locator('button:visible').evaluateAll((b, y) => b.map(x => ({ t: (x.innerText || x.getAttribute('aria-label') || x.title || '').trim(), y: Math.round(x.getBoundingClientRect().y) })).filter(o => Math.abs(o.y - y) < 25), rb.y);
await t.click(); await sleep(1500); const p = await panelText();
await shot('2423-dbg2');
return done({ near, panel: (p || 'none').slice(0, 300) });
