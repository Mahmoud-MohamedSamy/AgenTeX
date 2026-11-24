const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
const L = page.locator('[data-testid="tia-launcher"]');
const open = async () => { if (!(await page.locator(P).count())) { await L.click(); await page.waitForTimeout(1500); } };
const b = l => page.locator(`${P} button[aria-label="${l}"]`).first();
await open();
// H-13 ref click
const chip = page.locator('[data-testid="tia-refs"] a, [data-testid="tia-refs"] button').last();
if (await chip.count()) { await chip.click(); await page.waitForTimeout(4000); log('after ref click url', page.url()); await shot('H13-ref-opened'); log('page has T2', (await text()).includes('QA TIA T2')); }
await open();
// E-02 can see
await b('What Tia can see').click(); await page.waitForTimeout(2500); await shot('E02-can-see-rst');
const cs = page.locator('[data-testid="tia-capabilities"]'); log('can-see', (await cs.innerText().catch(() => (page.locator('[role=dialog]').last().innerText()))).replace(/\n+/g, ' / ').slice(0, 900));
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
// H-15 past chats
await open(); await b('Past chats').click(); await page.waitForTimeout(2000); await shot('H15-past-chats');
const rows = page.locator('[data-testid="tia-history-row"]'); log('history rows', await rows.count(), (await rows.first().innerText().catch(() => '')).slice(0, 80));
// H-18 rename first row
const r0 = rows.first(); const rowBtns = await r0.locator('button').evaluateAll(x => x.map(e => e.getAttribute('aria-label') || e.innerText));
log('row buttons', rowBtns.join(' | '));
const ren = r0.locator('button[aria-label^="Rename"]');
if (await ren.count()) { await ren.click(); await page.waitForTimeout(600); const inp = page.locator(`${P} input[aria-label="Chat name"]`); log('rename input maxlength', await inp.getAttribute('maxlength')); await inp.fill('QA TIA renamed chat'); await page.keyboard.press('Enter'); await page.waitForTimeout(1500); log('row0 after rename', (await rows.first().innerText()).slice(0, 60)); await shot('H18-renamed');
  await rows.first().locator('button[aria-label^="Rename"]').click(); await page.waitForTimeout(500); await inp.fill(''); await page.keyboard.press('Enter'); await page.waitForTimeout(1200); log('after empty rename', (await rows.first().innerText()).slice(0, 60), 'input still open', await inp.count()); await page.keyboard.press('Escape').catch(() => {}); }
// H-20 delete: Keep then Delete on the 2nd row
const del = rows.nth(1).locator('button[aria-label^="Delete"]');
if (await del.count()) { const t = (await rows.nth(1).innerText()).slice(0, 50); await del.click(); await page.waitForTimeout(800); await shot('H20-delete-confirm'); log('confirm text', (await page.locator('[data-testid="tia-delete-confirm"]').innerText().catch(() => '')).replace(/\n/g, ' / '));
  await page.locator('[data-testid="tia-delete-confirm"] button', { hasText: 'Keep' }).click(); await page.waitForTimeout(800); log('after keep rows', await rows.count());
  await rows.nth(1).locator('button[aria-label^="Delete"]').click(); await page.waitForTimeout(600); await page.locator('[data-testid="tia-delete-confirm"] button', { hasText: 'Delete' }).click(); await page.waitForTimeout(1500); log('deleted', t, 'rows now', await rows.count(), 'still listed', (await page.locator(P).innerText()).includes(t)); }
// H-02 minimise
await b('Minimise').click(); await page.waitForTimeout(1000); await shot('H02-minimised'); log('panel visible after minimise', await page.locator(P).isVisible().catch(() => false));
await L.click(); await page.waitForTimeout(1200);
// H-03/H-04 drag
const hd = page.locator('[data-testid="tia-panel-header"]'); const bb = await hd.boundingBox();
await page.mouse.move(bb.x + 60, bb.y + 15); await page.mouse.down(); await page.mouse.move(bb.x - 500, bb.y - 200, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(800);
const bb2 = await page.locator(P).boundingBox(); log('moved to', Math.round(bb2.x), Math.round(bb2.y));
await page.mouse.move(bb.x - 440, bb.y - 185); await page.mouse.down(); await page.mouse.move(-2000, -2000, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(600);
const bb3 = await page.locator(P).boundingBox(); log('pushed off-screen → at', Math.round(bb3.x), Math.round(bb3.y));
log('ls offset', await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('tia.panel')).map(k => [k, localStorage.getItem(k)]))));
await page.reload(); await page.waitForTimeout(4000); await open(); const bb4 = await page.locator(P).boundingBox(); log('after reload at', Math.round(bb4.x), Math.round(bb4.y)); await shot('H04-position-after-reload');
// H-01 Esc / close
await page.keyboard.press('Escape'); await page.waitForTimeout(800); log('panel after Esc', await page.locator(P).count(), 'focus', await page.evaluate(() => document.activeElement?.getAttribute('data-testid') || document.activeElement?.tagName));
// H-26 narrow
await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500); await open(); await page.waitForTimeout(1000); await shot('H26-narrow-390');
const nb = await page.locator(P).boundingBox(); log('narrow panel box', JSON.stringify(nb));
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('tia.panel')).forEach(k => localStorage.removeItem(k)));
return 'ok';
