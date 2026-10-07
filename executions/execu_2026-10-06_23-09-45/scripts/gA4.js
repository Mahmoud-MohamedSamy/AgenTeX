// Group A3 (owner) — retries: create form (I24, I29, I37, I19/I23 UI), I38 uploads, I9, I7 fresh values, I21 options editor, I28 VALIDATION tab, I43 New Rule form.
const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey)); const L = (await defLayout(T.id)).id; const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc';
const openForm = async () => { await go(`/modules/${T.id}`, 9000); await page.mouse.click(678, 28); await sleep(1200); const it = page.getByText('QA MF Types1', { exact: true }).last(); await it.waitFor({ timeout: 15000 }); await it.click(); await sleep(4000); };
const formVals = async labels => await page.evaluate(labels => { const out = {};
  for (const lab of labels) { const el = [...document.querySelectorAll('label, span, div, p')].find(e => e.children.length === 0 && e.textContent.trim().replace(/\*$/, '').trim() === lab);
    if (!el) { out[lab] = 'NOT ON FORM'; continue; } let box = el; for (let i = 0; i < 6 && box; i++) { if (box.querySelector('input,select,textarea,[role=combobox],[role=radiogroup],[role=checkbox],[role=switch]')) break; box = box.parentElement; }
    if (!box) { out[lab] = '?'; continue; }
    const cb = box.querySelector('input[type=checkbox],[role=checkbox],[role=switch]'); const rad = [...box.querySelectorAll('input[type=radio],[role=radio]')]; const inp = box.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea'); const sel = box.querySelector('select'); const combo = box.querySelector('[role=combobox],[aria-haspopup]');
    out[lab] = cb ? 'checked=' + (cb.checked ?? cb.getAttribute('aria-checked')) : rad.length ? 'radios=' + rad.length + ' ' + rad.map(r => (r.value || r.getAttribute('aria-label') || '') + (r.checked || r.getAttribute('aria-checked') === 'true' ? '*' : '')).join(',') : sel ? 'select=' + sel.value + ' [' + [...sel.options].map(o => o.text).join('/') + ']' : combo ? 'combo=' + JSON.stringify((combo.innerText || combo.value || '').trim()) : inp ? 'value=' + JSON.stringify(inp.value) : box.innerText.slice(0, 60); }
  return out; }, labels);
await step('A3.form', async () => {
  const q = await placeOnLayout(T.id, L, [], { qa_trig: { quickCreateTriggers: [{ value: 'Escalate', moduleKey: 'tasks' }] } });
  await openForm();
  const v = await formVals(['QA MF cb', 'QA MF txt', 'QA MF pl', 'QA MF af', 'QA MF af2', 'QA MF rb', 'QA MF st', 'QA MF trig']);
  const s = await shot('A3-create-form-defaults');
  rec('A3.form', 'INFO', `trigger config → ${q.s}; create form values: ${JSON.stringify(v)}`, { shot: s, vals: v });
  // I29: type into qa_txt, see if af2 copies it
  const txtIn = page.getByText('QA MF txt', { exact: true }).first().locator('xpath=ancestor::*[.//input][1]').locator('input').first(); let af2 = '';
  if (await txtIn.count()) { await txtIn.fill('typed by QA'); await sleep(1200); af2 = JSON.stringify((await formVals(['QA MF af2']))['QA MF af2']); }
  // I37: Escalate
  const sel = page.locator('select').filter({ has: page.locator('option', { hasText: /^Escalate$/ }) }).first(); let how = '';
  if (await sel.count()) { how = 'select'; await sel.selectOption('Escalate'); }
  else { how = 'combo'; const box = page.getByText('QA MF trig', { exact: true }).first().locator('xpath=ancestor::*[.//*[@role="combobox"] or .//button][1]'); await box.locator('[role=combobox], button').first().click().catch(() => { }); await sleep(800); const o = page.getByRole('option', { name: 'Escalate' }); if (await o.count()) await o.first().click(); else await page.getByText('Escalate', { exact: true }).last().click().catch(() => { }); }
  await sleep(3000); const dl = (await page.locator('[role=dialog]').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').slice(0, 140)); const s2 = await shot('I37-after-escalate');
  rec('I29.ui', 'INFO', `after typing "typed by QA" in QA MF txt, QA MF af2 (auto-fill from qa_txt) = ${af2}`);
  rec('I37.ui', 'INFO', `chose Escalate via ${how}; dialogs open now: ${dl.length} ${JSON.stringify(dl).slice(0, 300)}`, { shot: s2 });
  await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape');
});
await step('I38', async () => {
  await openForm(); const TD = RUN + '/testdata/'; const out = [];
  const files = page.locator('input[type=file]'); const n = await files.count(); out.push(`file inputs: ${n}`);
  const toast = async () => ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,50}(not allowed|not supported|too large|exceeds|larger than|maximum|only [a-z ,.]*allowed|invalid|must be)[^.]{0,60}/i) || [''])[0];
  const up = async (i, f) => { await files.nth(i).setInputFiles(TD + f).catch(e => out.push('err ' + e.message.slice(0, 50))); await sleep(2500); out.push(`#${i} ← ${f}: "${await toast()}", shown=${(await page.getByText(f).count()) > 0}`); };
  let alerted = false; page.on('dialog', d => { alerted = true; d.dismiss().catch(() => { }); });
  if (n >= 1) { await up(0, 'qa-mf.txt'); await up(0, 'qa-mf-big.pdf'); await up(0, 'qa-mf.pdf'); }
  if (n >= 2) { await up(1, 'qa-mf-xss.svg'); await up(1, 'qa-mf.png'); }
  const s = await shot('I38-uploads');
  // save the record, then open it to see what was stored
  const nm = page.getByPlaceholder('Name').first(); if (await nm.count()) await nm.fill('QA MF upload rec'); await page.getByRole('button', { name: /^Save$/ }).last().click().catch(() => { }); await sleep(4000);
  const saved = ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,60}(saved|created|failed|error|not allowed)[^.]{0,60}/i) || [''])[0];
  const recs = arr((await api('GET', `/modules/${T.id}/records?page_size=100`)).j.data); const ur = recs.find(r => /upload rec/.test(JSON.stringify(r)));
  const g = ur ? await getRec(T.id, ur.id) : {};
  rec('I38', 'INFO', out.join(' ; ') + `; script alert fired=${alerted}; save → "${saved}"; stored file=${JSON.stringify(g.qa_file).slice(0, 160)} image=${JSON.stringify(g.qa_img).slice(0, 160)}`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I28', async () => {
  const DL = (await defLayout(DM)).id; await builder(DM, DL); await fieldMenu('Name'); await props('VALIDATION');
  const sw = page.getByText('Conditional visibility', { exact: true }).locator('xpath=ancestor::div[.//*[@role="switch"]][1]').getByRole('switch').first(); await sw.click().catch(() => { }); await sleep(1000);
  const t = (await txt()).replace(/s+/g, ' '); const m = t.match(/This layout has no other field[^.]*./); const s1 = await shot('I28-no-controllers');
  rec('I28', m ? 'PASS' : 'INFO', m ? 'layout with only Name, Conditional visibility on → "' + m[0] + '"' : 'after toggling Conditional visibility: ' + t.slice(t.indexOf('Conditional visibility'), t.indexOf('Conditional visibility') + 300), { shot: s1 });
  await page.keyboard.press('Escape');
});
await step('I43', async () => {
  const stop = capOn(); await go('/settings/modules-and-fields/' + T.id, 6000); await page.getByRole('tab', { name: 'Workflow Rules' }).first().click().catch(() => { }); await sleep(2500);
  await page.getByRole('button', { name: /New Rule/ }).first().click(); await sleep(2000);
  await page.getByPlaceholder('e.g. High-Value Lead Notification').fill('QA MF I43 rule'); await page.getByRole('button', { name: /^Next/ }).click(); await sleep(3000);
  const t2 = (await page.locator('[role=dialog]').last().innerText().catch(() => txt())).replace(/s+/g, ' '); const s2 = await shot('I43-step2');
  const ins = await page.locator('[role=dialog] input:visible, [role=dialog] select:visible').evaluateAll(es => es.map(e => e.tagName + ':' + (e.placeholder || e.getAttribute('aria-label') || '') + (e.tagName === 'SELECT' ? '[' + [...e.options].map(o => o.text).slice(0, 10).join('/') + ']' : '')));
  stop();
  rec('I43.step2', 'INFO', 'after Next: "' + t2.slice(0, 500) + '"; inputs ' + ins.join(', ').slice(0, 500) + '; writes ' + cap.join(' || ').slice(0, 200), { shot: s2 });
});
return done();
