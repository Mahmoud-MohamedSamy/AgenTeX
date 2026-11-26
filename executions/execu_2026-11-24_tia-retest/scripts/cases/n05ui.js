const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/'); await sleep(4000); await page.locator(L).click(); await sleep(1500);
await page.locator(`${P} button[aria-label="Past chats"]`).click(); await sleep(2000);
const item = page.locator(`${P} *`, { hasText: /^QA TIA N05 message 1/ }).last(); R.found = await item.count();
const t0 = Date.now(); await item.click(); await page.waitForFunction(() => document.querySelectorAll('[data-testid="tia-reply"]').length > 0, null, { timeout: 30000 }).catch(() => {}); R.openMs = Date.now() - t0;
await sleep(2000);
R.replies = await page.locator('[data-testid="tia-reply"]').count();
const loadBtn = page.locator(`${P} button`, { hasText: /earlier/i }); R.loadEarlier = await loadBtn.count();
await shot('N-05-long-chat-open');
if (R.loadEarlier) { const t1 = Date.now(); await loadBtn.first().click(); await sleep(3000); R.afterLoad = await page.locator('[data-testid="tia-reply"]').count(); R.loadMs = Date.now() - t1; await shot('N-05-after-load-earlier'); }
const ta = page.locator(`${P} textarea`); await ta.fill('typing still works'); R.inputOk = (await ta.inputValue()) === 'typing still works'; await ta.fill('');
R.firstVisible = (await page.locator(P).innerText()).includes('message 1:');
return R;
