const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(6000); await page.locator(L).first().click(); await sleep(2000);
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1200); }
const cdp = await ctx.newCDPSession(page); await cdp.send('Network.enable');
let firstDelta = false; page.on('response', r => { if (/turn\/stream/.test(r.url())) R.streamStatus = r.status(); });
const ta = page.locator(`${P} textarea`).first(); await ta.fill('Explain step by step how to set up an assignment rule, a workflow rule and a blueprint in this CRM, with examples for each.'); await ta.press('Enter');
// wait until Tia starts writing (thinking indicator gone or reply text growing), then cut the network
await page.waitForFunction(() => document.querySelector('[data-testid="tia-thinking"]'), null, { timeout: 15000 }).catch(() => {}); await sleep(2500);
R.beforeCut = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-160);
await cdp.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 }); await sleep(20000);
R.whileOffline = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-300); await shot('MIDNET-offline');
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }); await sleep(20000);
R.afterBack = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-300);
const retry = page.locator(`${P} button`, { hasText: /retry|try again/i }); R.retryBtn = await retry.count(); if (R.retryBtn) { await retry.first().click(); await sleep(25000); R.afterRetry = (await page.locator(P).first().innerText()).replace(/\n+/g, ' / ').slice(-300); }
await shot('MIDNET-after'); return R;
