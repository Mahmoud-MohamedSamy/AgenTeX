const R = {}; const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const box = async loc => { const b = await loc.boundingBox().catch(() => null); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
await go('/settings/security/profiles'); await sleep(4000);
await page.mouse.click(1209, 204); await sleep(5000);
R.url = page.url();
const srch = page.locator('input[type=search], input[placeholder*="earch"]').last(); if (await srch.count()) { await srch.fill('Tia'); await sleep(2000); }
const row = page.getByText('Chat with Tia', { exact: false }).first(); R.rowCount = await row.count();
if (R.rowCount) { await row.scrollIntoViewIfNeeded(); await sleep(800); R.rowBox = await box(row);
  R.rowText = (await row.locator('xpath=ancestor::*[self::tr or self::li or contains(@class,"row")][1]').innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 200);
  const rr = row.locator('xpath=ancestor::*[self::tr or self::li or contains(@class,"row")][1]'); R.rrBox = await box(rr);
  R.controls = await rr.locator('input[type=checkbox], [role=switch], [role=checkbox], button').evaluateAll(es => es.map(e => ({ t: e.tagName, aria: e.getAttribute('aria-checked') ?? e.getAttribute('aria-pressed') ?? String(e.checked), lab: (e.getAttribute('aria-label') || e.innerText || '').slice(0, 30), r: (() => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; })() })));
}
await shot('A13-crm-admin-permissions');
R.pageText = (await text()).split('\n').filter(l => /tia|AI|Chat/i.test(l)).slice(0, 20);
// 15
await go('/'); await sleep(3500); await page.locator(L).click(); await sleep(1500);
await page.locator(`${P} textarea`).focus();
const steps = []; let shotDone = false;
for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); await sleep(250); const s = await page.evaluate(p => { const a = document.activeElement; const r = a?.getBoundingClientRect(); return { inside: !!a?.closest(p), d: a ? a.tagName + ' ' + (a.getAttribute('aria-label') || a.getAttribute('data-testid') || a.innerText || '').trim().slice(0, 30) : '', r: r && [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }; }, P); steps.push(s);
  if (!s.inside && !shotDone) { shotDone = true; R.outsideAt = i + 1; R.outside = s; R.panelBox = await box(page.locator(P)); await shot('A15-focus-outside-panel'); await page.keyboard.press('Escape'); await sleep(800); R.escClosed = !(await page.locator(P).isVisible().catch(() => false)); break; } }
R.steps = steps;
return R;
