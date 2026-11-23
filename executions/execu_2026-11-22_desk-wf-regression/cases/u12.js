// OB-02 evidence: one careful sign-in, then New Rule -> condition + action -> ⋯ Test rule -> run sample -> screenshot error. Nothing saved.
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const out = {}; const clean = s => (s || '').replace(/\s+/g, ' ');
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(4000);
if (await page.locator('input[type=password]').count()) {
  const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
  const r = rows.find(x => x[0] === 'ndc-staging-owner'); if (!r) return { stopped: 'no credential row' };
  const em = page.locator('input[type=email], input[name=email]').first(), pw = page.locator('input[type=password]').first();
  await em.click(); await em.pressSequentially(r[1].trim(), { delay: 30 }); await pw.click(); await pw.pressSequentially(r.slice(2).join(',').trim(), { delay: 30 }); await sleep(800);
  const btn = page.locator('button[type=submit]').first(); out.btnEnabled = await btn.isEnabled(); await btn.click();
  await page.waitForURL(u => !/login|sign-in|auth/.test(u.pathname), { timeout: 60000 }).catch(() => {}); await sleep(5000);
  out.afterLogin = page.url().replace(H, ''); const msg = clean(await page.locator('body').innerText().catch(() => '')).match(/(invalid|incorrect|too many|locked|try again)[^.]{0,80}/i); out.loginMsg = msg ? msg[0] : null;
  if (await page.locator('input[type=password]').count()) { await shot('U12-login-failed'); return { ...out, stopped: 'sign-in did not complete; not retrying' }; }
}
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
await go('/settings/automation/workflow-rules'); await sleep(6000);
await page.getByRole('button', { name: /New Rule/i }).first().click(); await sleep(2500);
await page.locator('[role=dialog]').getByText('Select a module').click(); await sleep(1200); await page.locator('[role=option]').filter({ hasText: /^Tickets$/ }).first().click(); await sleep(800);
await page.locator('[role=dialog] input').last().fill('QA WF OB02 unsaved test'); await sleep(500);
for (let i = 0; i < 4; i++) { const b = page.locator('[role=dialog]').getByRole('button', { name: /^(Next|Continue|Create|Open editor|Done)/ }); if (!(await b.count())) break; await b.last().click(); await sleep(2000); }
await sleep(3000); out.url = page.url().replace(H, ''); await shot('U12-OB02-1-editor');
out.menu = []; const kebab = page.locator('main button').filter({ has: page.locator('svg') }).locator('visible=true');
// open the top-right ⋯ menu: try aria labels first
let opened = false; for (const sel of ['button[aria-label*="More" i]', 'button[aria-label*="actions" i]', 'button[aria-haspopup="menu"]']) { const b = page.locator('main ' + sel).first(); if (await b.count()) { await b.click().catch(() => {}); await sleep(1200); if (await page.getByRole('menuitem', { name: /Test rule/i }).count()) { opened = true; break; } await page.keyboard.press('Escape'); } }
out.menuOpened = opened; await shot('U12-OB02-2-menu');
if (!opened) return out;
await page.getByRole('menuitem', { name: /Test rule/i }).first().click(); await sleep(2500); await shot('U12-OB02-3-panel');
const ta = page.locator('aside textarea').first(); if (await ta.count()) { await ta.fill('{ "priority": { "kind": "string", "stringValue": "high" } }'); }
const resp = page.waitForResponse(r => /workflow\/rules\/evaluate/.test(r.url()), { timeout: 30000 }).catch(() => null);
await page.locator('aside').getByRole('button', { name: /Run|Test/i }).last().click(); const rr = await resp; out.evaluate = rr ? rr.status() + ' ' + (await rr.text().catch(() => '')).slice(0, 200) : 'no request seen';
await sleep(2500); await shot('U12-OB02-4-error'); out.panel = clean(await page.locator('aside').first().innerText().catch(() => '')).slice(0, 500); out.toast = clean(await page.locator('[role=status], [role=alert], [data-sonner-toast]').allInnerTexts().then(a => a.join(' | ')).catch(() => '')).slice(0, 300);
// leave without saving
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
return out;
