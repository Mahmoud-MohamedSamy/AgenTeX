// Screen-reader view of the Tia panel via the accessibility tree (Edge). Card is always rejected.
const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(6000);
R.launcherA11y = await page.locator(L).first().evaluate(e => ({ tag: e.tagName, role: e.getAttribute('role'), name: e.getAttribute('aria-label') || e.innerText, expanded: e.getAttribute('aria-expanded') }));
await page.locator(L).first().click(); await sleep(2500);
R.focusAfterOpen = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName);
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1500); }
R.liveRegionsPage = await page.evaluate(() => [...document.querySelectorAll('[aria-live],[role=status],[role=alert],[role=log]')].map(e => (e.getAttribute('role') || '') + '/' + (e.getAttribute('aria-live') || '') + ':' + (e.closest('[data-testid="tia-panel"]') ? 'panel' : 'page')).slice(0, 10));
const send = async m => { const n = await page.locator('[data-testid="tia-reply"]').count(); const ta = page.locator(`${P} textarea`).first(); await ta.fill(m); await ta.press('Enter');
  await sleep(800); R.duringThinking = R.duringThinking || await page.evaluate(() => { const t = document.querySelector('[data-testid="tia-thinking"]'); return t ? { role: t.getAttribute('role'), live: t.getAttribute('aria-live'), label: t.getAttribute('aria-label'), text: t.innerText.slice(0, 60) } : null; });
  await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 120000 }).catch(() => {}); await sleep(2500); };
await send('How many deals are there?');
R.focusAfterAnswer = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName);
await send('Create a lead with first name "QA TIA A11Y card" and last name "Reader". Prepare the card for me to confirm.');
R.aria = (await page.locator(P).first().ariaSnapshot().catch(e => 'ERR ' + e.message)).slice(0, 3500);
const conf = page.locator(`${P} button`, { hasText: /^Confirm$/ }); const rej = page.locator(`${P} button`, { hasText: /^(Reject|Cancel|Dismiss)$/ });
R.cardButtons = { confirm: await conf.count(), reject: await rej.count(), rejectNames: await rej.allInnerTexts().catch(() => []) };
await shot('SR-card');
if (await rej.count()) { await rej.last().click(); await sleep(2500); R.afterReject = (await page.locator(P).innerText()).slice(-200).replace(/\n+/g, ' / '); }
return R;
