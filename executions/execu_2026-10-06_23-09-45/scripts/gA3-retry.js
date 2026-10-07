// Group A3 (owner) — retries: create form (I24, I29, I37, I19/I23 UI), I38 uploads, I9, I7 fresh values, I21 options editor, I28 VALIDATION tab, I43 New Rule form.
const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey)); const L = (await defLayout(T.id)).id; const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc';
const openForm = async () => { await go(`/modules/${T.id}`, 9000); const b = page.getByRole('button', { name: /Create QA MF Types1/ }); await b.waitFor({ timeout: 25000 }); await b.click(); await sleep(4000); };
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
await step('I9', async () => {
  await builder(T.id, L); await fieldMenu('QA MF txt'); await sleep(500);
  const items = (await page.locator('[role=menu]').last().innerText().catch(async () => (await page.locator('[role=menuitem]').allInnerTexts()).join('|'))).replace(/\s+/g, ' | ');
  const s = await shot('I9-field-menu'); await page.keyboard.press('Escape');
  const secG = page.locator('[aria-label*="Section settings" i], [title*="Section settings" i]').first(); let secItems = '';
  if (await secG.count()) { await secG.click().catch(() => { }); await sleep(700); secItems = (await txt()).replace(/\s+/g, ' ').match(/(1 column|2 columns|One column|Two columns|column)[^.]{0,80}/i)?.[0] || ''; await page.keyboard.press('Escape'); }
  rec('I9', 'INFO', `field menu: ${items.slice(0, 200)}; section menu mentions columns: "${secItems}"`, { shot: s });
});
await step('I7', async () => {
  const k = 'QA-UQ-' + Date.now().toString(36);
  const a = await mkRec(T.id, { name: 'QA MF uq a', qa_uq: k + '-1' }, L); const same = await mkRec(T.id, { name: 'QA MF uq b', qa_uq: k + '-1' }, L);
  const other = await mkRec(OPEN, { name: 'QA MF uq open', qa_uq: k + '-1' }); const free = await mkRec(OPEN, { name: 'QA MF uq open2', qa_uq: k + '-2' }); const back = await mkRec(T.id, { name: 'QA MF uq c', qa_uq: k + '-2' }, L);
  const det = j => JSON.stringify(j && j.j && j.j.error && j.j.error.details || '').slice(0, 120);
  rec('I7', a.s < 300 && same.s >= 400 && other.s >= 400 && free.s < 300 && back.s >= 400 ? 'PASS' : 'FAIL', `unique qa_uq shared between QA MF Types and QA MF Open: new value → ${a.s}; duplicate in same module → ${same.s} ${det(same)}; same value in the other module → ${other.s} ${det(other)}; new value in Open → ${free.s}; Open's value back in Types → ${back.s} ${det(back)}`);
});
await step('I21', async () => {
  await builder(T.id, L); await fieldMenu('QA MF pl'); await props(); const tabs = {};
  for (const t of ['GENERAL', 'VALIDATION', 'ADVANCED']) { await page.getByText(t, { exact: true }).first().click().catch(() => { }); await sleep(800); const vals = await page.locator('aside input, [role=dialog] input').evaluateAll(es => es.map(e => e.value).filter(Boolean)); tabs[t] = vals.join('/'); }
  const where = Object.keys(tabs).find(t => /Beta/.test(tabs[t]));
  let removed = false, dlg = '', applied = '';
  if (where) { await page.getByText(where, { exact: true }).first().click(); await sleep(800);
    const idx = await page.locator('aside input, [role=dialog] input').evaluateAll(es => es.findIndex(e => e.value === 'Beta'));
    const inp = page.locator('aside input, [role=dialog] input').nth(idx); await inp.hover().catch(() => { });
    const row = inp.locator('xpath=ancestor::*[.//button][1]'); const btn = row.locator('button').last(); await btn.click().catch(() => { }); await sleep(600); removed = !(await page.locator('aside input, [role=dialog] input').evaluateAll(es => es.some(e => e.value === 'Beta')));
    await page.locator('aside button, [role=dialog] button').filter({ hasText: /^Apply$/ }).last().click().catch(() => { }); await sleep(1500);
    dlg = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
    if (!/Replace/i.test(dlg)) { await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(2500); dlg = (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); }
  }
  const s = await shot('I21-replace-dialog');
  if (/Replace/i.test(dlg)) { const d = page.locator('[role=dialog], [role=alertdialog]').last(); const sel = d.locator('select').first(); if (await sel.count()) await sel.selectOption({ label: 'Alpha' }).catch(() => { }); const ap = d.getByRole('button', { name: /Replace and apply/i }); if (await ap.count()) { await ap.click(); applied = 'Replace and apply'; await sleep(3000); } await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(3000); }
  const recs = arr((await api('GET', `/modules/${T.id}/records?page_size=100`)).j.data).filter(r => /QA MF opt/.test(JSON.stringify(r)));
  const vals = []; for (const r of recs) vals.push(val((await getRec(T.id, r.id)).qa_pl)); const f = (await fieldsOf(T.id)).find(x => x.fieldName === 'qa_pl');
  rec('I21', 'INFO', `option inputs per tab ${JSON.stringify(tabs)}; Beta removed=${removed}; dialog "${dlg.slice(0, 300)}"; ${applied}; records with Beta now ${JSON.stringify(vals)}; options ${JSON.stringify(f.datatypeOptions && f.datatypeOptions.allowed_values)}`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I28', async () => {
  const DL = (await defLayout(DM)).id; await builder(DM, DL); await fieldMenu('Name'); await props('VALIDATION');
  const t0 = (await page.locator('aside, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const tg = page.locator('aside, [role=dialog]').last().getByText(/Conditional visibility|Show this field only/i).first(); let t1 = '';
  if (await tg.count()) { const box = tg.locator('xpath=ancestor::*[.//*[@role="switch"] or .//input[@type="checkbox"]][1]'); await box.locator('[role=switch], input[type=checkbox]').first().click().catch(() => { }); await sleep(800); t1 = (await page.locator('aside, [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); }
  const m = (t0 + ' ' + t1).match(/This layout has no other field[^.]*\./); const s = await shot('I28-no-controllers');
  rec('I28', m ? 'PASS' : 'INFO', m ? `layout with only Name → "${m[0]}"` : `VALIDATION tab: "${t0.slice(0, 300)}" | after toggle: "${t1.slice(0, 300)}"`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I43', async () => {
  await go(`/settings/modules-and-fields/${T.id}`, 6000); await page.getByRole('tab', { name: 'Workflow Rules' }).first().click().catch(() => { }); await sleep(2500);
  await page.getByRole('button', { name: /New Rule/ }).first().click(); await sleep(3000);
  const t = (await txt()).replace(/\s+/g, ' '); const ins = await page.locator('input:visible, select:visible, textarea:visible').evaluateAll(es => es.map(e => e.tagName + ':' + (e.placeholder || e.name || e.getAttribute('aria-label') || '') + (e.tagName === 'SELECT' ? '[' + [...e.options].map(o => o.text).slice(0, 8).join('/') + ']' : '')));
  const s = await shot('I43-new-rule');
  rec('I43.discover', 'INFO', `url ${page.url().replace(H, '')}; form text "${t.slice(t.indexOf('Rule'), t.indexOf('Rule') + 400)}"; inputs ${ins.join(', ').slice(0, 500)}`, { shot: s });
  await page.keyboard.press('Escape');
});
return done();
