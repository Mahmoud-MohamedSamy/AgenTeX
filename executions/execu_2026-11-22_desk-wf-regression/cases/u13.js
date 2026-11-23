// OB-02 evidence (explore): New Rule -> add an action -> Test rule (All departments) -> change department -> Test rule again. Nothing saved.
const out = {}; const clean = s => (s || '').replace(/\s+/g, ' ');
await go('/settings/automation/workflow-rules'); await sleep(6000);
if (await page.locator('input[type=password]').locator('visible=true').count()) return { stopped: 'session not valid' };
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
await page.getByRole('button', { name: /New Rule/i }).first().click(); await sleep(2500);
await page.locator('[role=dialog]').getByText('Select a module').click(); await sleep(1200); await page.locator('[role=option]').filter({ hasText: /^Tickets$/ }).first().click(); await sleep(800);
await page.locator('[role=dialog] input').last().fill('QA WF OB02 unsaved test'); await sleep(500);
for (let i = 0; i < 4; i++) { const b = page.locator('[role=dialog]').getByRole('button', { name: /^(Next|Continue|Create|Open editor|Done)/ }); if (!(await b.count())) break; await b.last().click(); await sleep(2000); }
await sleep(3000);
await page.getByRole('button', { name: /^Add action$/ }).first().click(); await sleep(1500); await shot('U13-a-picker');
out.picker = clean(await page.locator('[role=dialog], [role=menu]').last().innerText().catch(() => '')).slice(0, 700);
const pick = page.locator('button').filter({ hasText: /^Mark (ticket )?as spam/i }).first(); out.pickFound = await pick.count();
if (out.pickFound) { await pick.click(); await sleep(1800); }
await shot('U13-b-action');
const runTest = async tag => { const k = page.locator('main button[aria-haspopup="menu"]').first(); await k.click(); await sleep(1000); await page.getByRole('menuitem', { name: /Test rule/i }).first().click(); await sleep(2000);
  const ta = page.locator('aside textarea').first(); if (await ta.count()) await ta.fill('{ "priority": { "kind": "string", "stringValue": "high" } }');
  const resp = page.waitForResponse(r => /workflow\/rules\/evaluate/.test(r.url()), { timeout: 30000 }).catch(() => null);
  await page.locator('aside').getByRole('button', { name: /Run test/i }).first().click(); const rr = await resp; await sleep(2500); await shot('U13-' + tag);
  return { http: rr ? rr.status() + ' ' + (await rr.text().catch(() => '')).slice(0, 160) : 'none', panel: clean(await page.locator('aside').first().innerText().catch(() => '')).slice(0, 400), toast: clean((await page.locator('[data-sonner-toast], [role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ')).slice(0, 200) }; };
out.allDepts = await runTest('c-all-departments');
// change departments
await page.getByText('Change', { exact: true }).first().click(); await sleep(1500); await shot('U13-d-dept-dialog');
const dlg = page.locator('[role=dialog]').last();
await dlg.getByText('Selected departments', { exact: true }).click(); await sleep(1200); await shot('U13-e-selected');
out.deptList = clean(await dlg.innerText().catch(() => '')).slice(0, 700);
const opt = dlg.getByText('QA AO Dept B', { exact: true }); out.optFound = await opt.count(); if (!out.optFound) { const box = dlg.locator('input').last(); if (await box.count()) { await box.fill('QA AO Dept B'); await sleep(1200); } }
await dlg.getByText('QA AO Dept B', { exact: true }).first().click(); await sleep(800); await shot('U13-f-picked');
await dlg.getByRole('button', { name: /^Apply$/ }).click(); await sleep(1500); await shot('U13-g-applied');
out.header = clean(await page.locator('main').innerText().catch(() => '')).match(/Departments.{0,60}/)?.[0];
await page.locator('aside').getByRole('button', { name: /Close/i }).first().click().catch(() => {}); await sleep(800);
out.oneDept = await runTest('h-one-department');
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
return out;