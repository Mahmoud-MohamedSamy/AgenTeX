const P = '[data-testid="tia-panel"]';
await go('/'); await page.waitForTimeout(3000);
if (!(await page.locator(P).count())) { await page.locator('[data-testid="tia-launcher"]').click(); await page.waitForTimeout(1500); }
await page.locator(`${P} button[aria-label="New chat"]`).click(); await page.waitForTimeout(800);
const ta = page.locator(`${P} textarea`);
await ctx.setOffline(true); await ta.fill('Reply with OK'); await ta.press('Enter'); await page.waitForTimeout(6000);
await shot('L01-offline'); log('offline msg', (await page.locator(P).innerText()).split('\n').slice(-6).join(' / '));
await ctx.setOffline(false); await page.waitForTimeout(1500);
// L-02 session: make API return 401 for the turn
await page.route('**/agents/tia/turn/stream', r => r.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false, error: { code: 'UNAUTHORIZED', message: 'expired' } }) }));
await page.route('**/iam/auth/refresh', r => r.fulfill({ status: 401, contentType: 'application/json', body: '{"success":false}' }));
await ta.fill('Reply with OK again'); await ta.press('Enter'); await page.waitForTimeout(6000);
await shot('L02-session'); log('session msg', (await page.locator(P).innerText()).split('\n').slice(-6).join(' / '), 'url', page.url());
await page.unroute('**/agents/tia/turn/stream'); await page.unroute('**/iam/auth/refresh');
return 'ok';
