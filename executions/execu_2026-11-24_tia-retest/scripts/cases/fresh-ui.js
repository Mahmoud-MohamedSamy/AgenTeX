const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(6000); if (!(await page.locator(P).count())) { await page.locator(L).first().click(); await sleep(2000); } R.panelOpen = await page.locator(P).count(); R.buttons = await page.locator(P + ' button').evaluateAll(b => b.map(x => x.getAttribute('aria-label') || x.innerText).slice(0, 8));
await page.locator(`${P} button[aria-label="Past chats"]`).first().click(); await sleep(2500);
const item = page.locator(P + ' button, ' + P + ' [role=button], ' + P + ' [role=option], ' + P + ' li').filter({ hasText: 'QA TIA FRESH' }).filter({ visible: true }).first(); R.found = await item.count();
if (R.found) { await item.click({ force: true }); await sleep(4000); R.cardBefore = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-320); await shot('FRESH-before');
  const conf = page.locator(`${P} button`, { hasText: /^Confirm$/ }); R.confirmVisible = await conf.count(); R.confirmEnabled = R.confirmVisible ? await conf.last().isEnabled() : null;
  const cancel = page.locator(P + ' button', { hasText: /^Cancel$/ }); R.cancelVisible = await cancel.count(); if (R.cancelVisible) { await cancel.last().click(); await sleep(3000); }
  R.after = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-320); await shot('FRESH-after'); }
return R;
