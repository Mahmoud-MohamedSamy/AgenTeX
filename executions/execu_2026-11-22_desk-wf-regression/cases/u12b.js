// OB-02 evidence: one careful sign-in, then New Rule -> condition + action -> ⋯ Test rule -> run sample -> screenshot error. Nothing saved.
const fs = require('fs'), path = require('path'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const out = {}; const clean = s => (s || '').replace(/\s+/g, ' ');
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(4000);
await sleep(6000); if (await page.locator('input[type=password]').locator('visible=true').count()) { await shot('U12-no-session'); return { stopped: 'saved session not valid; no sign-in this run' }; }
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
