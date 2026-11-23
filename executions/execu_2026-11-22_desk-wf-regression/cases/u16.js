const out = {}; const clean = s => (s || '').replace(/\s+/g, ' '); const W = '/settings/automation/workflow-rules', MOD = '88e8ea44-1658-4df3-9930-d0902b91073d';
const tryDo = async (k, fn) => { try { out[k] = await fn(); } catch (e) { out[k] = 'ERR ' + String(e.message || e).split('\n')[0].slice(0, 200); await shot('U16-ERR-' + k).catch(() => {}); } };
await page.goto(H + W, { waitUntil: 'domcontentloaded' }); if (await page.locator('input[type=password]').locator('visible=true').count()) return { stopped: 'session not valid' };
await page.locator('main tbody tr').first().waitFor({ timeout: 180000 }); await sleep(2500);
await tryDo('L10', async () => {
  const combos = await page.locator('main [role=combobox], main select, main button[aria-haspopup]').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)));
  const mod = page.locator('main [role=combobox], main button[aria-haspopup]').filter({ hasText: /All modules|Module/i }).first();
  if (await mod.count()) { await mod.click(); await sleep(1000); await page.getByRole('option', { name: /^Tickets$/ }).first().click(); await sleep(4000); }
  await shot('U16-L10-module'); let t = clean(await page.locator('main').innerText()); const c1 = (t.match(/[^.]{0,30}\d+\s*(of|\/)\s*\d+[^.]{0,60}/) || [null])[0];
  const dep = page.locator('main [role=combobox], main button[aria-haspopup]').filter({ hasText: /All departments|Department/i }).first();
  let c2 = null; if (await dep.count()) { await dep.click(); await sleep(1000); await page.getByRole('option', { name: 'QA AO Dept B' }).first().click(); await sleep(4000); await shot('U16-L10-dept'); t = clean(await page.locator('main').innerText()); c2 = (t.match(/[^.]{0,30}\d+\s*(of|\/)\s*\d+[^.]{0,60}/) || [null])[0]; }
  return { controls: combos, moduleCounter: c1, deptCounter: c2 }; });
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
await page.goto(H + W + '/new?moduleId=' + MOD, { waitUntil: 'domcontentloaded' }); await sleep(12000);
await tryDo('AT03', async () => { await page.getByRole('button', { name: /^Add action$/ }).first().click(); await sleep(1500); await page.locator('button').filter({ hasText: /^Add comment/i }).first().click(); await sleep(2000);
  const ins = page.locator('main').getByText('Insert field', { exact: true }).last(); await ins.scrollIntoViewIfNeeded(); await ins.click(); await sleep(1500); await shot('U16-AT03-insert');
  const opts = await page.locator('[role=option], [role=menuitem], [role=listbox] li').allInnerTexts(); const all = opts.map(x => x.trim()).filter(Boolean);
  const tn = all.filter(x => /ticket.?(number|#|no)/i.test(x)); if (tn.length) { await page.getByRole('option', { name: tn[0] }).first().click().catch(() => {}); await sleep(1200); }
  await shot('U16-AT03-picked'); const ed = clean(await page.locator('main .ql-editor, main [contenteditable=true]').first().innerText().catch(() => ''));
  return { count: all.length, ticketNumberOptions: tn, sample: all.slice(0, 25), inserted: ed.slice(0, 120) }; });
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); }).catch(() => {});
return out;
