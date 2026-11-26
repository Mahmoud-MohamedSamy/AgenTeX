const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const R = {};
const btn = (pg, label) => pg.locator(`${P} button[aria-label="${label}"]`).first();
const open = async pg => { if (!(await pg.locator(P).count())) { await pg.locator(L).click(); await pg.waitForTimeout(1500); } };
// Tab A: start a chat
await go('/'); await sleep(4000); await open(page);
if (await btn(page, 'New chat').count()) { await btn(page, 'New chat').click(); await sleep(1200); }
const ta = page.locator(`${P} textarea`); await ta.fill('QA TIA H21 what can you help me with?'); await ta.press('Enter');
await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply"]').length >= 1 && !document.querySelector('[data-testid="tia-thinking"]'), null, { timeout: 120000 }).catch(() => {}); await sleep(2000);
// Tab B: delete that chat from Past chats
const pB = await ctx.newPage(); await pB.goto(H + '/', { waitUntil: 'domcontentloaded' }); await pB.waitForTimeout(5000); await open(pB);
await btn(pB, 'Past chats').click(); await pB.waitForTimeout(2000);
const item = pB.locator(`${P} *`, { hasText: /^QA TIA H21/ }).last(); R.itemFound = await item.count();
await item.hover().catch(() => {}); await pB.waitForTimeout(500);
const del = pB.locator(`${P} button[aria-label*="Delete" i], ${P} button[title*="Delete" i]`).first(); R.delBtn = await del.count();
if (R.delBtn) { await del.click(); await pB.waitForTimeout(800); const c = pB.locator('[role=dialog] button, [role=alertdialog] button, ' + P + ' button', { hasText: /^Delete$/ }); if (await c.count()) await c.last().click(); await pB.waitForTimeout(2000); }
R.deletedInB = !(await pB.locator(`${P} *`, { hasText: /^QA TIA H21/ }).count());
await pB.screenshot({ path: '../screenshots/raw/H-21-tabB-deleted.png' });
// Tab A: send again
await page.bringToFront(); await ta.fill('and one more question'); await ta.press('Enter'); await sleep(8000);
R.tabA = (await page.locator(P).innerText()).replace(/\n+/g, ' / ').slice(-400);
await shot('H-21-tabA-after-delete');
await pB.close();
// H-25: panel over a record dialog (New ticket)
await go('/views'); await sleep(5000); await open(page);
const plus = page.locator('header button', { hasText: /^\+?$/ }).first();
await page.keyboard.press('Escape');
const newBtn = page.locator('button[aria-label*="New" i], button[aria-label*="Create" i]').first(); R.newBtn = await newBtn.count();
if (R.newBtn) { await newBtn.click().catch(() => {}); await sleep(2500); }
await open(page); await sleep(1500);
const dlgBox = await page.locator('[role=dialog]').filter({ hasNot: page.locator(P) }).first().boundingBox().catch(() => null);
R.h25 = { dialog: !!dlgBox, panelVisible: await page.locator(P).isVisible().catch(() => false), zPanel: await page.locator(P).evaluate(e => getComputedStyle(e.closest('[style*="z-index"]') || e).zIndex).catch(() => ''), topAtPanelCentre: await page.evaluate(p => { const el = document.querySelector(p); if (!el) return 'no panel'; const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + 60); return t && el.contains(t) ? 'panel on top' : (t ? t.tagName + ' ' + (t.closest('[role=dialog]') ? 'dialog on top' : '') : 'none'); }, P) };
await shot('H-25-panel-over-dialog');
return R;
