const rb = await page.getByText('Lookup Contacts', { exact: true }).first().boundingBox(); await page.mouse.move(rb.x + 100, rb.y + 5); await sleep(600); const rm = page.locator('button[aria-label="Remove from Layout"]:visible'); let k=-1; for (let i=0;i<await rm.count();i++){ const bb=await rm.nth(i).boundingBox(); if (bb && Math.abs(bb.y-rb.y)<30){k=i;break;} } await rm.nth(k).click({ force: true }); await sleep(1500);
const dlg = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => ''); 
const c = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /Remove|Confirm|Yes/i }).last(); if (dlg && await c.count()) { await c.click(); await sleep(1500); }
await page.getByText(/^Unused Fields/).first().click({ force: true }); await sleep(1500);
const uf = page.getByText('Lookup Contacts', { exact: true }); const n = await uf.count();
await uf.last().scrollIntoViewIfNeeded().catch(() => {}); await uf.last().hover().catch(() => {}); await sleep(800); await shot('1863-02-unused');
const ub = await uf.last().boundingBox(); const near = await page.locator('button:visible').evaluateAll((b, y) => b.map(x => ({ t: (x.innerText || x.getAttribute('aria-label') || x.title || '').trim(), y: Math.round(x.getBoundingClientRect().y), x: Math.round(x.getBoundingClientRect().x) })).filter(o => Math.abs(o.y - y) < 25), ub?.y || 0);
return done({ dlg: dlg.slice(0, 200), n, near });
