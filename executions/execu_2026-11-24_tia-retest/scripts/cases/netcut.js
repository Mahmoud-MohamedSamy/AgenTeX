// Cut the connection while Tia is answering, through the local proxy (127.0.0.1:8898 kill switch).
const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = { runs: [] };
const ctl = async p => (await (await fetch('http://127.0.0.1:8898' + p)).text());
await go('/'); await sleep(6000); await page.locator(L).first().click(); await sleep(2000);
const panel = async () => (await page.locator(P).first().innerText().catch(() => '')).replace(/\n+/g, ' / ');
for (const [when, q] of [['thinking', 'How many leads, contacts, deals and accounts are there? Give each number.'], ['streaming', 'Explain step by step how to set up an assignment rule, a workflow rule and a blueprint in this CRM, with examples for each.']]) {
  const run = { when };
  const nb = page.locator(`${P} button[aria-label="New chat"]`); if (await nb.count()) { await nb.first().click(); await sleep(1500); }
  const n = await page.locator('[data-testid="tia-reply"]').count(); const ta = page.locator(`${P} textarea`).first(); await ta.fill(q); await ta.press('Enter');
  if (when === 'thinking') { await page.waitForSelector('[data-testid="tia-thinking"]', { timeout: 15000 }).catch(() => {}); await sleep(800); }
  else { await page.waitForFunction(k => { const r = document.querySelectorAll('[data-testid="tia-reply"]'); return r.length > k && (r[r.length - 1].innerText || '').length > 30 && document.querySelector('[data-testid="tia-thinking"]'); }, n, { timeout: 60000, polling: 100 }).catch(() => { run.noStreamSeen = true; }); }
  run.before = (await panel()).slice(-140); run.stats = await ctl('/stats'); run.kill = await ctl('/kill'); await ctl('/block?on=1');
  await sleep(15000); run.whileDown = (await panel()).slice(-260); await shot('NETCUT-' + when);
  await ctl('/block?on=0'); await sleep(8000); run.afterUp = (await panel()).slice(-260);
  const retry = page.locator(`${P} button`, { hasText: /retry|try again/i }); run.retryBtn = await retry.count();
  if (run.retryBtn) { await retry.last().click(); await page.waitForFunction(() => !document.querySelector('[data-testid="tia-thinking"]'), null, { timeout: 90000 }).catch(() => {}); await sleep(4000); run.afterRetry = (await panel()).slice(-260); }
  R.runs.push(run);
}
return R;
