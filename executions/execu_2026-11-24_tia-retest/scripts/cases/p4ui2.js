const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
const calls = []; page.on('response', r => { const u = r.url(); if (/\/api\/v1\/reporting\//.test(u) && r.request().method() !== 'OPTIONS') calls.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*\/api\/v1/, '')); });
await page.goto(H + '/reports/view/03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211', { waitUntil: 'domcontentloaded' }); await sleep(3000);
if (await page.locator('input[type=password]').count()) { await go('/reports/view/03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211'); }
await page.waitForFunction(() => !/Loading…|Loading\.\.\./.test(document.body.innerText), null, { timeout: 60000 }).catch(() => {}); await sleep(4000);
R.reportLines = (await text()).split('\n').map(s => s.trim()).filter(Boolean).slice(0, 60); R.calls = calls.slice(0, 12); await shot('P4-report-test2');
await page.goto(H + '/', { waitUntil: 'domcontentloaded' }); await sleep(6000); await page.locator(L).first().click(); await sleep(2000);
const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1200); }
const ta = page.locator(`${P} textarea`).first(); await ta.fill('Explain in detail how lead scoring works in this CRM, with examples.'); await ta.press('Enter'); await sleep(300); await ctx.setOffline(true);
await sleep(10000); R.offlineText = (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(-300); await shot('P4-offline2');
await ctx.setOffline(false); await sleep(20000); R.backOnline = (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ').slice(-300);
return R;
