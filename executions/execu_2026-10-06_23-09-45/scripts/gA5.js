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
await step('I24.ui', async () => {
  const stop = capOn(); await builder(T.id, L); const out = [];
  await fieldMenu('QA MF txt'); await props(); const tabsT = {};
  for (const t of ['GENERAL', 'VALIDATION', 'ADVANCED']) { await page.getByText(t, { exact: true }).first().click(); await sleep(700); tabsT[t] = /Default value|Default Value/i.test(await txt()); }
  const tab = Object.keys(tabsT).find(k => tabsT[k]); if (tab) { await page.getByText(tab, { exact: true }).first().click(); await sleep(700); const lab = page.getByText(/^Default value$/i).first(); const inp = lab.locator('xpath=following::input[1]'); await inp.fill('QA UI default').catch(e => out.push('fill ' + e.message.slice(0, 40))); }
  await page.getByRole('button', { name: /^Apply$/ }).last().click().catch(() => { }); await sleep(800);
  await fieldMenu('QA MF af'); await props('ADVANCED'); const fs1 = page.getByText('FILL FROM', { exact: true }).locator('xpath=following::select[1]'); let opts = ''; if (await fs1.count()) { opts = (await fs1.evaluate(e => [...e.options].map(o => o.value + '=' + o.text).join('/'))); const v = await fs1.evaluate(e => [...e.options].find(o => /user/i.test(o.text) && !/setting/i.test(o.text))?.value); if (v) await fs1.selectOption(v); await sleep(500); }
  await page.getByRole('button', { name: /^Apply$/ }).last().click().catch(() => { }); await sleep(800);
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(4000); stop();
  const f = (await fieldsOf(T.id)).filter(x => ['qa_txt', 'qa_af'].includes(x.fieldName)).map(x => x.fieldName + ' config ' + JSON.stringify(x.config));
  rec('I24.ui.set', 'INFO', 'Default value found on tab ' + tab + ' (' + JSON.stringify(tabsT) + '); auto-fill options ' + opts.slice(0, 200) + '; ' + out.join(';') + '; field configs ' + f.join(' | ') + '; writes ' + cap.join(' || ').slice(0, 600));
  await openForm(); const s1 = await shot('I24-form-after-builder-defaults');
  const txtV = await page.getByPlaceholder('QA MF txt').inputValue().catch(() => '?'); const afV = await page.getByPlaceholder('QA MF af', { exact: true }).inputValue().catch(() => '?');
  rec('I24.ui', 'INFO', 'create form after setting via builder: QA MF txt = ' + JSON.stringify(txtV) + ', QA MF af (auto-fill logged-in user) = ' + JSON.stringify(afV), { shot: s1 });
  await page.keyboard.press('Escape');
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
  rec('I38', 'INFO', out.join(' ; ') + `; script alert fired=${alerted}; save → "${saved}"; stored file=${String(JSON.stringify(g.qa_file)).slice(0, 160)} image=${String(JSON.stringify(g.qa_img)).slice(0, 160)}`, { shot: s });
  await page.keyboard.press('Escape');
});
return done();
