// Group A2 (owner) — UI checks on "QA MF Types": create form (I19, I23, I24, I29, I37), uploads (I38), option replacement (I21),
// width (I9), no-controller message (I28, on QA MF DeptMod), unused counter (I46), field limit screen (I3), workflow tab discovery (I43).
const T = (await mods()).find(m => /qa_mf_types$/.test(m.moduleKey)); const L = (await defLayout(T.id)).id;
const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc';
const formVals = async labels => await page.evaluate(labels => { const out = {};
  for (const lab of labels) { const el = [...document.querySelectorAll('label, span, div, p')].find(e => e.children.length === 0 && e.textContent.trim().replace(/\*$/, '').trim() === lab);
    if (!el) { out[lab] = 'NOT ON FORM'; continue; } let box = el; for (let i = 0; i < 6 && box; i++) { if (box.querySelector('input,select,textarea,button[role=combobox],[role=radiogroup],[role=checkbox],[role=switch]')) break; box = box.parentElement; }
    if (!box) { out[lab] = '?'; continue; }
    const cb = box.querySelector('input[type=checkbox],[role=checkbox],[role=switch]'); const rad = [...box.querySelectorAll('input[type=radio],[role=radio]')]; const inp = box.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea'); const sel = box.querySelector('select'); const combo = box.querySelector('button[role=combobox],[aria-haspopup]');
    out[lab] = cb ? 'checked=' + (cb.checked ?? cb.getAttribute('aria-checked')) : rad.length ? 'radios=' + rad.length + ' ' + rad.map(r => (r.value || r.getAttribute('aria-label') || '') + (r.checked || r.getAttribute('aria-checked') === 'true' ? '*' : '')).join(',') : sel ? 'select=' + sel.value + ' [' + [...sel.options].map(o => o.text).join('/') + ']' : inp ? 'value=' + JSON.stringify(inp.value) : combo ? 'combo=' + JSON.stringify(combo.innerText.trim()) : box.innerText.slice(0, 60); }
  return out; }, labels);
const openForm = async () => { await go(`/modules/${T.id}`, 7000); await page.getByRole('button', { name: /Create QA MF Types1/ }).click(); await sleep(3500); };
await step('A2.form', async () => {
  await placeOnLayout(T.id, L, [], { qa_trig: { quickCreateTriggers: [{ value: 'Escalate', moduleKey: 'tasks' }] } });
  await openForm();
  const v = await formVals(['QA MF cb', 'QA MF txt', 'QA MF pl', 'QA MF af', 'QA MF af2', 'QA MF rb', 'QA MF st', 'QA MF trig']);
  const s = await shot('A2-create-form-defaults');
  rec('A2.form', 'INFO', 'create form values: ' + JSON.stringify(v), { shot: s, vals: v });
  // I37: choose Escalate on qa_trig
  let how = '', popup = '';
  const sel = page.locator('select').filter({ has: page.locator('option', { hasText: /^Escalate$/ }) }).first();
  if (await sel.count()) { how = 'select'; await sel.selectOption('Escalate'); }
  else { how = 'combo'; const lab = page.getByText('QA MF trig', { exact: true }).first(); await lab.locator('xpath=ancestor::*[.//button or .//input][1]').locator('button, input').first().click().catch(() => { }); await sleep(800); await page.getByText('Escalate', { exact: true }).last().click().catch(() => { }); }
  await sleep(2500); const dl = await page.locator('[role=dialog]').allInnerTexts(); popup = dl.map(x => x.replace(/\s+/g, ' ').slice(0, 120)).join(' || ');
  const s2 = await shot('I37-after-escalate');
  rec('I37.ui', 'INFO', `qa_trig quick-create trigger Escalate → tasks; picked via ${how}; dialogs now: ${popup}`, { shot: s2 });
  await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape');
});
await step('I38', async () => {
  await openForm(); const TD = RUN + '/testdata/'; const out = [];
  const files = page.locator('input[type=file]'); const n = await files.count(); out.push(`file inputs on form: ${n}`);
  const msg = async () => ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,40}(not allowed|not supported|too large|exceeds|maximum|Only [^.]{0,40}|invalid file|type)[^.]{0,60}/i) || [''])[0];
  const tryUp = async (i, f) => { const before = (await page.getByText(f, { exact: false }).count()); await files.nth(i).setInputFiles(TD + f).catch(e => out.push('err ' + e.message.slice(0, 60))); await sleep(2500); out.push(`input ${i} ← ${f}: message "${await msg()}"; file name shown=${(await page.getByText(f, { exact: false }).count()) > before}`); };
  if (n >= 1) { await tryUp(0, 'qa-mf.txt'); await tryUp(0, 'qa-mf-big.pdf'); await tryUp(0, 'qa-mf.pdf'); }
  if (n >= 2) { await tryUp(1, 'qa-mf-xss.svg'); await tryUp(1, 'qa-mf.png'); }
  let alerted = false; page.once('dialog', d => { alerted = true; d.dismiss().catch(() => { }); });
  const s = await shot('I38-uploads'); await sleep(1000);
  rec('I38', 'INFO', out.join(' ; ') + `; svg script alert fired=${alerted}`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I21', async () => {
  const r1 = await mkRec(T.id, { name: 'QA MF opt 1', qa_pl: 'Beta' }, L), r2 = await mkRec(T.id, { name: 'QA MF opt 2', qa_pl: 'Beta' }, L);
  const stop = capOn(); await builder(T.id, L); await fieldMenu('QA MF pl'); await props();
  const panel = page.locator('aside, [role=dialog]').last();
  const bInput = panel.locator('input').filter({ hasNotText: 'x' }); let removed = false;
  const idx = await panel.locator('input').evaluateAll(es => es.findIndex(e => e.value === 'Beta'));
  if (idx >= 0) { const row = panel.locator('input').nth(idx).locator('xpath=ancestor::*[.//button][1]'); const rb = row.locator('button[aria-label*="emove" i], button[title*="emove" i], button[aria-label*="elete" i]').first(); if (await rb.count()) { await rb.click(); removed = true; } else { await row.locator('button').last().click(); removed = true; } await sleep(500); }
  await panel.getByRole('button', { name: /^(Apply|Done|Save)$/ }).last().click().catch(() => { }); await sleep(800);
  await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(2500);
  const dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const s1 = await shot('I21-replace-dialog');
  let applied = '';
  if (/Replace/i.test(dlg)) { const d = page.locator('[role=dialog]').last(); const sel = d.locator('select').first(); if (await sel.count()) await sel.selectOption({ label: 'Alpha' }).catch(() => { }); else { await d.locator('button[role=combobox], [aria-haspopup]').first().click().catch(() => { }); await sleep(500); await page.getByText('Alpha', { exact: true }).last().click().catch(() => { }); } await sleep(500); const ap = d.getByRole('button', { name: /Replace and apply|Apply|Replace/ }).last(); if (await ap.count()) { await ap.click(); await sleep(3500); applied = 'clicked'; } }
  stop();
  const v1 = r1.id ? val((await getRec(T.id, r1.id)).qa_pl) : null, v2 = r2.id ? val((await getRec(T.id, r2.id)).qa_pl) : null;
  const f = (await fieldsOf(T.id)).find(x => x.fieldName === 'qa_pl');
  rec('I21', 'INFO', `2 records with Beta (${r1.s}/${r2.s}); removed Beta in editor=${removed}; dialog after Save: "${dlg.slice(0, 300)}"; replace ${applied}; records now ${v1}/${v2}; options now ${JSON.stringify(f && f.datatypeOptions && f.datatypeOptions.allowed_values)}; writes ${cap.join(' || ').slice(0, 400)}`, { shot: s1 });
  await page.keyboard.press('Escape');
});
await step('I9', async () => {
  await builder(T.id, L); await fieldMenu('QA MF txt'); const items = (await page.locator('[role=menu], [role=menuitem], [data-radix-popper-content-wrapper]').last().innerText().catch(() => '')).replace(/\s+/g, ' | ');
  const s = await shot('I9-field-menu'); await page.keyboard.press('Escape');
  await props(); const tabs = (await page.locator('[role=tab]:visible').allInnerTexts()).join('|'); const w = /full width|half width|width/i.test(await txt());
  rec('I9', 'INFO', `field options menu: ${items}; properties tabs ${tabs}; any width control=${w}`, { shot: s }); await page.keyboard.press('Escape');
});
await step('I28', async () => {
  const DL = (await defLayout(DM)).id; await builder(DM, DL); await fieldMenu('Name'); await props();
  const tabs = await page.locator('[role=tab]:visible').allInnerTexts(); let found = '';
  for (const t of ['VALIDATION', 'ADVANCED', 'GENERAL', ...tabs]) { const tb = page.getByText(t, { exact: true }).first(); if (await tb.count()) { await tb.click().catch(() => { }); await sleep(700); const m = (await txt()).match(/This layout has no other field[^.]*\./); if (m) { found = t + ': ' + m[0]; break; } } }
  const s = await shot('I28-no-controllers');
  rec('I28', found ? 'PASS' : 'INFO', `layout with only Name: ${found || 'message not found; tabs ' + tabs.join('|')}`, { shot: s }); await page.keyboard.press('Escape');
});
await step('I46', async () => {
  const cnt = async () => { await builder(T.id, L); return ((await txt()).replace(/\s+/g, ' ').match(/Unused Fields ?(\d+)|All fields are in use/) || ['none'])[0]; };
  const before = await cnt();
  const lay = await getLayout(T.id, L); const b = JSON.parse(JSON.stringify(lay)); delete b.id; const rm = ['qa_af2', 'qa_img', 'qa_file'];
  for (const v of Object.values(b.views)) for (const s of (v.layout && v.layout.sections) || []) for (const c of s.columns) c.fields = c.fields.filter(f => !rm.includes(f.fieldName));
  const p = await api('PUT', `/modules/${T.id}/layouts/${L}`, b); const after = await cnt(); const s = await shot('I46-unused-counter');
  const back = JSON.parse(JSON.stringify(lay)); delete back.id; const pb = await api('PUT', `/modules/${T.id}/layouts/${L}`, back); const restored = await cnt();
  const DL = (await defLayout(DM)).id; await builder(DM, DL); const dmText = ((await txt()).replace(/\s+/g, ' ').match(/Unused Fields ?(\d+)|All fields are in use/) || ['none'])[0];
  rec('I46', 'INFO', `Types: before "${before}"; removed 3 fields (${p.s}) → "${after}"; restored (${pb.s}) → "${restored}"; QA MF DeptMod shows "${dmText}"`, { shot: s });
});
await step('I3.ui', async () => {
  const LM = (await mods()).find(m => /qa_mf_limit$/.test(m.moduleKey)); if (!LM) { rec('I3.ui', 'INFO', 'no QA MF Limit module'); return; }
  const LL = (await defLayout(LM.id)).id; await builder(LM.id, LL);
  const t = (await txt()).replace(/\s+/g, ' '); const counter = (t.match(/[^.]{0,40}(left|remaining|limit|maximum)[^.]{0,60}/i) || [''])[0];
  const pal = page.getByText('Single Line', { exact: true }).first(); let msg = '';
  if (await pal.count()) { await pal.click().catch(() => { }); await sleep(1500); msg = ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,60}(limit|maximum|cannot add|can't add|no more)[^.]{0,80}/i) || [''])[0]; }
  const s = await shot('I3-limit-builder');
  rec('I3.ui', 'INFO', `builder with ~550 custom fields: counter text "${counter}"; clicking Single Line in the palette → "${msg}"`, { shot: s });
});
await step('I43', async () => {
  await go(`/settings/modules-and-fields/${T.id}`, 6000); await page.getByRole('tab', { name: 'Workflow Rules' }).first().click().catch(() => { }); await sleep(3000);
  const t = (await txt()).replace(/\s+/g, ' '); const i = t.indexOf('Workflow Rules'); const btns = (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
  const s = await shot('I43-workflow-tab');
  rec('I43.discover', 'INFO', `Workflow Rules tab: "${t.slice(i, i + 400)}"; buttons [${btns.join(' | ').slice(0, 300)}]; url ${page.url().replace(H, '')}`, { shot: s });
});
return done();
