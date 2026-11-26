// Phase 4 browser checks. PART=main (length, offline, reload, report) | rtl | expiry
const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = { part: process.env.PART };
const open = async () => { if (!(await page.locator(P).count())) { await page.locator(L).first().click(); await sleep(2000); } };
const newChat = async () => { await open(); const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1200); } };
const panelText = async () => (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ');
const waitDone = async n => { await page.waitForFunction(k => document.querySelectorAll('[data-testid="tia-reply"]').length > k && !document.querySelector('[data-testid="tia-thinking"]'), n, { timeout: 90000 }).catch(() => {}); await sleep(2000); };
const nRep = () => page.locator('[data-testid="tia-reply"]').count();
const step = async (k, f) => { try { await f(); } catch (e) { R['ERR_' + k] = String(e.message).split(String.fromCharCode(10))[0].slice(0, 160); await shot('P4-err-' + k).catch(() => {}); } };
const send = async m => { const ta = page.locator(`${P} textarea`).first(); await ta.fill(m); await ta.press('Enter'); };
if (process.env.PART === 'main') {
  await go('/'); await sleep(5000); await newChat();
  await step('length', async () => {
  const ta = page.locator(`${P} textarea`).first(); R.maxlength = await ta.getAttribute('maxlength');
  await ta.fill('a'.repeat(5000)); R.lenAccepted = (await ta.inputValue()).length; R.sendDisabled = await page.locator(`${P} button[aria-label="Send"]`).first().isDisabled().catch(() => null);
  R.lenHint = (await panelText()).slice(-260); const n0 = await nRep(); await ta.press('Enter'); await sleep(6000); R.lenAfterSend = (await panelText()).slice(-260); await shot('P4-length');
  });
  await step('offline', async () => {
  await newChat(); const n1 = await nRep(); await send('Explain in detail how lead scoring works in this CRM.'); await sleep(1500); await ctx.setOffline(true); await sleep(8000); R.offlineText = (await panelText()).slice(-260); await shot('P4-offline');
  await ctx.setOffline(false); await sleep(15000); R.backOnlineText = (await panelText()).slice(-260);
  });
  await step('reload', async () => {
  await newChat(); await send('How many contacts are there in CRM?'); await sleep(1500); await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000); await open(); await sleep(1500);
  R.afterReloadPanel = (await panelText()).slice(0, 300);
  const pc = page.locator(`${P} button[aria-label="Past chats"]`); if (await pc.count()) { await pc.first().click(); await sleep(2500); R.pastChats = (await panelText()).slice(0, 300); const item = page.locator(P).getByText('How many contacts are there in CRM?').first(); if (await item.count()) { await item.click(); await sleep(3000); R.reloadedChat = (await panelText()).slice(0, 300); } }
  await shot('P4-reload');
  });
  await step('report', async () => {
  await page.goto(H + '/reports/view/03d7cdc2-2dda-4d7e-aa38-a1b9fdd65211', { waitUntil: 'domcontentloaded' }); await sleep(10000);
  const body = (await text()); R.reportUi = body.split('\n').filter(l => /total|rows|records|record count|sum|closed_|stage/i.test(l)).slice(0, 15); await shot('P4-report-test');
  });
}
if (process.env.PART === 'rtl') {
  await go('/'); await sleep(5000);
  const lang = page.locator('button', { hasText: /^EN$/ }).first(); R.langBtn = await lang.count();
  if (R.langBtn) { await lang.click(); await sleep(1200); const ar = page.getByText(/العربية|Arabic/).first(); R.arOpt = await ar.count(); if (R.arOpt) { await ar.click(); await sleep(6000); } }
  R.dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction); await open(); await sleep(1500);
  const pb = await page.locator(P).first().boundingBox().catch(() => null); R.panelBox = pb && { x: Math.round(pb.x), w: Math.round(pb.width) }; R.panelDir = await page.locator(P).first().evaluate(e => getComputedStyle(e).direction).catch(() => null);
  const n = await nRep(); await send('كم عدد العملاء المحتملين؟'); await waitDone(n); R.arAnswer = (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).slice(0, 160);
  R.replyDir = await page.locator('[data-testid="tia-reply"]').last().evaluate(e => getComputedStyle(e).direction + '/' + getComputedStyle(e).textAlign).catch(() => null);
  R.panelTextAr = (await panelText()).slice(0, 300); await shot('P4-rtl');
  // switch back to English
  const back = page.locator('button', { hasText: /^(AR|ع)$/ }).first(); R.backBtn = await back.count(); if (R.backBtn) { await back.click(); await sleep(1200); const en = page.getByText(/^English$|^EN$/).first(); if (await en.count()) { await en.click(); await sleep(5000); } }
  R.dirAfter = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction);
}
if (process.env.PART === 'expiry') {
  await go('/'); await sleep(5000); await newChat();
  R.storageKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => /tok|auth|sess/i.test(k)));
  await ctx.clearCookies(); await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/tok|auth|sess/i.test(k)) localStorage.removeItem(k); sessionStorage.clear(); });
  const n = await nRep(); await send('hi'); await sleep(10000); R.afterExpiry = (await panelText()).slice(-300); R.url = page.url().replace(/[?#].*/, ''); R.loginShown = await page.locator('input[type=password]').count(); await shot('P4-expiry');
}
return R;
