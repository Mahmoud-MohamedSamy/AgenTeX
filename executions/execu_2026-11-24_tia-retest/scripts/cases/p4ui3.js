const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
const calls = []; page.on('response', r => { const u = r.url(); if (/\/api\/v1\/(reporting|iam\/me|auth)/.test(u) && r.request().method() !== 'OPTIONS') calls.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*\/api\/v1/, '').slice(0, 90)); });
await go('/'); await sleep(5000);
await page.locator('nav a, aside a', { hasText: /^Reports$/ }).first().click().catch(e => R.navErr = e.message.slice(0, 80)); await sleep(8000);
R.reportsList = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 25);
const link = page.getByText(/^test$/).first(); R.testLink = await link.count(); if (R.testLink) { await link.click(); await page.waitForFunction(() => !/Loading/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => {}); await sleep(5000); R.reportView = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 70); R.reportUrl = page.url().replace(/^https:\/\/[^/]+/, ''); await shot('P4-report-test3'); }
R.calls = calls.slice(0, 15);
// offline before send, then recover
await page.goto(H + '/', { waitUntil: 'domcontentloaded' }); await sleep(6000); await page.locator(L).first().click(); await sleep(2000);
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1200); }
await ctx.setOffline(true); const ta = page.locator(`${P} textarea`).first(); await ta.fill('How many accounts are there?'); await ta.press('Enter'); await sleep(8000);
R.offlineSend = (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(-260); await shot('P4-offline-send');
await ctx.setOffline(false); await sleep(3000); const retry = page.locator(`${P} button`, { hasText: /retry|try again/i }); R.retryBtn = await retry.count();
if (R.retryBtn) { await retry.first().click(); await sleep(12000); } else { await ta.fill('How many accounts are there?'); await ta.press('Enter'); await sleep(12000); }
R.recovered = (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(-260);
return R;
