const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = { runs: [] };
const ctl = async p => (await (await fetch('http://127.0.0.1:8898' + p)).text()); const panel = async () => (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ');
await go('/'); await sleep(6000); await page.locator(L).first().click(); await sleep(2000);
for (let i = 0; i < 2; i++) {
  const run = {}; const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1500); }
  const n = await page.locator('[data-testid="tia-reply"]').count(); const ta = page.locator(`${P} textarea`).first();
  await ta.fill('Write a long, detailed explanation (at least 400 words) of how lead scoring, assignment rules and workflow rules work together in this CRM.'); await ta.press('Enter');
  const t0 = Date.now(); await page.waitForFunction(k => { const r = document.querySelectorAll('[data-testid="tia-reply"]'); return r.length > k && (r[r.length - 1].innerText || '').trim().length > 0; }, n, { timeout: 60000, polling: 50 }).catch(() => { run.noReply = true; });
  run.msToFirstText = Date.now() - t0; const lenAtCut = (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).length; run.kill = await ctl('/kill'); await ctl('/block?on=1');
  await sleep(1500); const lenAfter = (await page.locator('[data-testid="tia-reply"]').last().innerText().catch(() => '')).length; run.lenAtCut = lenAtCut; run.lenAfter1500 = lenAfter;
  await sleep(12000); run.whileDown = (await panel()).slice(-240); await shot('NETCUT2-' + i);
  await ctl('/block?on=0'); await sleep(10000); run.afterUp = (await panel()).slice(-240);
  const retry = page.locator(`${P} button`, { hasText: /retry|try again/i }); run.retryBtn = await retry.count();
  if (run.retryBtn) { await retry.last().click(); await page.waitForFunction(() => !document.querySelector('[data-testid="tia-thinking"]'), null, { timeout: 90000 }).catch(() => {}); await sleep(5000); run.afterRetry = (await panel()).slice(-200); }
  R.runs.push(run);
}
return R;
