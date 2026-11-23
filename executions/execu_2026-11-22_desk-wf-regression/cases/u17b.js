const out = {}; const fs = require('fs'); const path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation'; const clean = s => (s || '').replace(/\s+/g, ' '); const RID = JSON.parse(require('fs').readFileSync('out/api01.json', 'utf8')).id;
const bodies = []; page.on('request', r => { if (r.method() === 'PATCH' && r.url().includes('/workflow/rules/' + RID)) bodies.push(r.postData()); });
const strip = b => { try { const j = JSON.parse(b); return { keys: Object.keys(j).join(','), hasCriteriaKey: 'criteria' in j, criteria: JSON.stringify(j.criteria === undefined ? '(key absent)' : j.criteria).replace(/"[a-zA-Z]+":null,?/g, '').slice(0, 220), actions: JSON.stringify(j.actions).slice(0, 160) }; } catch { return b && b.slice(0, 200); } };
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(4000);
if (await page.locator('input[type=password]').count()) {
  const rows = fs.readFileSync(path.join(P, 'docs/Credentials/TAVI Desk Credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(','));
  const r = rows.find(x => x[0] === 'ndc-staging-owner'); if (!r) return { stopped: 'no credential row' };
  const em = page.locator('input[type=email], input[name=email]').first(), pw = page.locator('input[type=password]').first();
  await em.click(); await em.pressSequentially(r[1].trim(), { delay: 30 }); await pw.click(); await pw.pressSequentially(r.slice(2).join(',').trim(), { delay: 30 }); await sleep(800);
  const btn = page.locator('button[type=submit]').first(); out.btnEnabled = await btn.isEnabled(); await btn.click();
  await page.waitForURL(u => !/login|sign-in|auth/.test(u.pathname), { timeout: 60000 }).catch(() => {}); await sleep(5000);
  out.afterLogin = page.url().replace(H, ''); const msg = clean(await page.locator('body').innerText().catch(() => '')).match(/(invalid|incorrect|too many|locked|try again)[^.]{0,80}/i); out.loginMsg = msg ? msg[0] : null;
  await sleep(8000); if (await page.locator('input[type=password]').locator('visible=true').count()) { await shot('U17-login-failed'); return { ...out, stopped: 'sign-in did not complete; not retrying' }; }
}

await page.goto(H + '/settings/automation/workflow-rules/' + RID, { waitUntil: 'domcontentloaded' }); 
await sleep(12000); await shot('U17-0-open');
// A: change only the Field Update value
const v = page.locator('main input').filter({ hasNot: page.locator('xx') }); const n = await v.count(); let changed = false;
for (let i = 0; i < n; i++) { const el = v.nth(i); if ((await el.inputValue().catch(() => '')) === 'v1') { await el.fill('v2'); changed = true; break; } }
out.A_changed = changed; await sleep(800);
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(5000); await shot('U17-A-saved'); out.A_body = strip(bodies[bodies.length - 1]);
// B: remove the conditions
await page.locator('main').getByText(/Priority/).first().click().catch(() => {}); await sleep(1500); await shot('U17-B-open');
let removed = 0; for (let k = 0; k < 4; k++) { const rm = page.locator('main').getByRole('button', { name: /Remove condition|Delete condition|Remove/i }).first(); if (!(await rm.count())) break; await rm.click(); removed++; await sleep(800); }
out.B_removed = removed; await shot('U17-B-removed');
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(5000); await shot('U17-B-saved'); out.B_body = strip(bodies[bodies.length - 1]); out.B_toast = clean((await page.locator('[data-sonner-toast], [role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ')).slice(0, 200);
out.bodies = bodies.length; return out;
