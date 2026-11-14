await go('/analytics/dashboards/builder', 15000);
const disc = page.getByRole('button', { name: 'Discard them' }); out.hasDisc = await disc.count(); if (out.hasDisc) { await disc.click(); await sleep(3000); }
out.btns = await page.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 40)).filter(Boolean));
await shot('w5/W5-30-after-discard'); return fin({ out });
