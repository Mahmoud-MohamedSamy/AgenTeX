const out = {}; const clean = s => (s || '').replace(/s+/g, ' '); const fs = require('fs'); const path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(4000);
if (await page.locator('input[type=password]').count()) {
  const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
  const r = rows.find(x => x[0] === 'ndc-staging-owner'); if (!r) return { stopped: 'no credential row' };
  const em = page.locator('input[type=email], input[name=email]').first(), pw = page.locator('input[type=password]').first();
  await em.click(); await em.pressSequentially(r[1].trim(), { delay: 30 }); await pw.click(); await pw.pressSequentially(r.slice(2).join(',').trim(), { delay: 30 }); await sleep(800);
  const btn = page.locator('button[type=submit]').first(); out.btnEnabled = await btn.isEnabled(); await btn.click();
  await page.waitForURL(u => !/login|sign-in|auth/.test(u.pathname), { timeout: 60000 }).catch(() => {}); await sleep(5000);
  out.afterLogin = page.url().replace(H, ''); const msg = clean(await page.locator('body').innerText().catch(() => '')).match(/(invalid|incorrect|too many|locked|try again)[^.]{0,80}/i); out.loginMsg = msg ? msg[0] : null;
  await sleep(8000); if (await page.locator('input[type=password]').locator('visible=true').count()) { await shot('U19-login-failed'); return { ...out, stopped: 'sign-in did not complete; not retrying' }; }
}
 const clean = s => (s || '').replace(/\s+/g, ' ');
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000);

await page.locator('main tbody tr').first().waitFor({ timeout: 180000 }); await sleep(3000);
await shot('U19-list-top');
out.headerButtons = (await page.locator('main').getByRole('button').allInnerTexts()).map(t => t.trim()).filter(Boolean).slice(0, 15);
out.headerLinks = (await page.locator('main a').allInnerTexts()).map(t => t.trim()).filter(Boolean).slice(0, 15);
out.rows = await page.locator('main tbody tr').count(); out.tabs = clean(await page.locator('main .mf-tabbar').first().innerText().catch(() => ''));
await page.mouse.wheel(0, 30000); await sleep(2000); await shot('U19-list-bottom');
out.pager = clean(await page.locator('main').innerText()).match(/(Page \d+|\d+\s*[-–]\s*\d+ of \d+|Rows per page[^.]{0,40}|Next|Previous|Load more)/gi) || [];
// row menu
await page.mouse.wheel(0, -30000); await sleep(1000);
const kebab = page.locator('main tbody tr').first().locator('button').last(); await kebab.click(); await sleep(1200); await shot('U19-row-menu');
out.rowMenu = (await page.locator('[role=menu] [role=menuitem], [role=menu] button').allInnerTexts()).map(t => t.trim()).filter(Boolean);
await page.keyboard.press('Escape');
// setup menu
out.setupMenuHasExec = (await page.locator('nav, aside').getByText(/Execution History/i).count());
out.automationMenu = clean(await page.locator('aside, nav').filter({ hasText: /AUTOMATION/i }).first().innerText().catch(() => '')).match(/AUTOMATION.{0,300}/i)?.[0];
return out;
