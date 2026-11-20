const out = { cases: [] }; const BP = '5392f456-66f9-4bc7-aa95-99bad990f4d5';
const open = async () => { await page.goto(H + '/settings/automation/blueprints/' + BP, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 60; i++) { await sleep(2000); const tt = await text(); if (/QA a3/.test(tt)) break; if (/502 Bad Gateway/.test(tt) && i % 5 == 4) await page.reload({ waitUntil: 'domcontentloaded' }); } await sleep(1500); };
const node = async () => { await page.mouse.click(385, 506); await sleep(2000); };
const due = () => page.getByText('Due after', { exact: true }).locator('xpath=following::input[1]');
const dueU = () => page.getByText('Due after', { exact: true }).locator('xpath=following::select[1]');
const warn = () => page.getByText('Warn before', { exact: true }).locator('xpath=following::input[1]');
const warnU = () => page.getByText('Warn before', { exact: true }).locator('xpath=following::select[1]');
const read = async () => [await due().inputValue(), await dueU().evaluate(s => s.options[s.selectedIndex].text), await warn().inputValue(), await warnU().evaluate(s => s.options[s.selectedIndex].text)];
await open(); await node(); out.before = await read();
out.dueAttrs = await due().evaluate(e => ({ type: e.type, min: e.min, max: e.max, step: e.step, inputmode: e.inputMode }));
const C = JSON.parse(process.env.CASES || '[]');
for (const [k, dv, du, wv, wu] of C) {
  await node();
  await dueU().selectOption({ label: du }); await due().fill(String(dv)); await warnU().selectOption({ label: wu }); await warn().fill(String(wv)); await sleep(800);
  const r = { k, entered: [dv, du, wv, wu], shown: await read() };
  const t0 = (await page.locator('aside, [class*=panel], [role=complementary]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  r.inlineMsg = (t0.match(/[^.]*(must|should|cannot|can't|less|greater|positive|between|invalid|at least|whole)[^.]*\./gi) || []).slice(0, 3);
  await shot('3063-2-' + k + '-entered.png');
  await page.getByRole('button', { name: 'Save state', exact: true }).click().catch(e => r.saveErr = 'no click'); await sleep(1500);
  const t1 = (await text()).replace(/\s+/g, ' '); r.after = (t1.match(/[^.]*(must|should|cannot|can't|less than|greater|positive|between|invalid|at least|whole|too)[^.]*\./gi) || []).slice(0, 4);
  r.panelOpen = await page.getByText('Due after', { exact: true }).count();
  await shot('3063-2-' + k + '-saved.png');
  if (r.panelOpen) { await page.getByRole('button', { name: 'Cancel', exact: true }).click().catch(() => {}); await sleep(800); }
  await node(); r.reopen = await read(); await page.getByRole('button', { name: 'Cancel', exact: true }).click().catch(() => {}); await sleep(500);
  out.cases.push(r);
}
if (process.env.SAVE) { const resp = page.waitForResponse(r => /blueprints/.test(r.url()) && ['PUT', 'PATCH', 'POST'].includes(r.request().method()), { timeout: 30000 }).catch(() => null); await page.getByRole('button', { name: 'Save Draft', exact: true }).click(); const rr = await resp; out.saveDraft = rr ? rr.status() + ' ' + (await rr.text()).slice(0, 300) : 'no request'; await sleep(2500); await shot('3063-3-savedraft.png'); }
return out;
