const o = {}; await page.keyboard.press('Escape'); await sleep(800); await page.locator('button', { hasText: /^Cancel$/ }).last().click().catch(() => {}); await sleep(2000);
const d = await api('GET', '/desk/tickets/e4c207d8-cda7-43a1-946d-4d2626759b7e/drafts/mine'); o.draft = d.s + ' ' + d.t.slice(0, 160);
return done(o);
