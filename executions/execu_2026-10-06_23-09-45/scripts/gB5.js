// Group B4 (admin B): I5 (VALIDATION Required), I27/I47/I49 forms via "+" menu, I47/I48 dialog, J4 via catalogue key, K10 two tabs (restore order).
const D = (await mods()).find(m => /qa_mf_deps$/.test(m.moduleKey)); const L = (await defLayout(D.id)).id; const uuid = () => crypto.randomUUID();
const openForm = async () => { await go(`/modules/${D.id}`, 8000); await page.mouse.click(678, 28); await sleep(1200); const it = page.getByText(D.singularForm, { exact: true }).last(); await it.waitFor({ timeout: 15000 }); await it.click(); await sleep(4000); };
const visible = async lab => (await page.getByText(lab, { exact: true }).count()) > 0;
const pick = async (lab, value) => { const row = page.getByText(lab, { exact: true }).first().locator('xpath=ancestor::*[.//*[@role="combobox"] or .//button[contains(.,"Select")] or .//select][1]');
  const sel = row.locator('select'); if (await sel.count()) { await sel.first().selectOption(value); return 'select'; }
  await row.locator('[role=combobox], button').first().click().catch(() => { }); await sleep(700); const o = page.getByRole('option', { name: value, exact: true }); if (await o.count()) { await o.first().click(); return 'option'; } await page.getByText(value, { exact: true }).last().click().catch(() => { }); return 'text'; };
const F = await fieldsOf(D.id); const id = n => F.find(f => f.fieldName === n).id;
const setDeps = async deps => { const lay = await getLayout(D.id, L); const b = JSON.parse(JSON.stringify(lay)); delete b.id; b.dependencies = deps; return await api('PUT', `/modules/${D.id}/layouts/${L}`, b); };
await step('I48', async () => {
  await setDeps([{ id: uuid(), parentFieldId: id('qa_ctrl'), parentValues: ['Z'], action: 'SHOW', childFieldIds: [id('qa_b')] }, { id: uuid(), parentFieldId: id('qa_ctrl'), parentValues: ['Y'], action: 'REQUIRE', childFieldIds: [id('qa_c')] }]);
  await builder(D.id, L); await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(800); await page.getByText('Field Dependency', { exact: true }).click(); await sleep(2500);
  const s0 = await shot('I48-dependency-list'); const t0 = (await txt()).replace(/\s+/g, ' '); const i0 = t0.indexOf('Field Dependenc');
  const dels = page.locator('button[aria-label*="elete" i], button[title*="elete" i], button[aria-label*="emove" i]'); const nd = await dels.count();
  const edits = page.locator('button[aria-label*="dit" i], button[title*="dit" i]'); const ne = await edits.count();
  rec('I48.list', 'INFO', `dependency panel: "${t0.slice(i0, i0 + 400)}"; edit buttons ${ne}, delete buttons ${nd}`, { shot: s0 });
  for (let i = 0; i < nd; i++) { await dels.first().click().catch(() => { }); await sleep(700); const c = page.getByRole('button', { name: /^(Delete|Confirm|Yes|Remove)$/ }).last(); if (await c.count()) await c.click().catch(() => { }); await sleep(700); }
  const t1 = (await txt()).replace(/\s+/g, ' '); const empty = (t1.match(/No (field )?dependenc[^.]{0,80}/i) || [''])[0]; const s1 = await shot('I48-after-delete');
  const sv = page.getByRole('button', { name: /Save Rules/ }); if (await sv.count()) { await sv.click().catch(() => { }); await sleep(1500); }
  await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(3000);
  const g = (await getLayout(D.id, L)).dependencies;
  rec('I48', 'INFO', `after deleting ${nd} rules: empty-state text "${empty}"; stored rules now ${(g || []).length}`, { shot: s1 });
  await page.keyboard.press('Escape');
});
await step('I49', async () => {
  const p = await setDeps([{ id: uuid(), parentFieldId: id('qa_a'), parentValues: ['On'], action: 'SHOW', childFieldIds: [id('qa_bb')] }, { id: uuid(), parentFieldId: id('qa_bb'), parentValues: ['On'], action: 'HIDE', childFieldIds: [id('qa_a')] }]);
  const t0 = Date.now(); let note = '';
  try { await openForm(); await pick('QA MF a', 'On'); await sleep(1500); await pick('QA MF bb', 'On'); await sleep(2000); note = `responsive=${await page.evaluate(() => 1 + 1) === 2}, a visible=${await visible('QA MF a')}, bb visible=${await visible('QA MF bb')}`; } catch (e) { note = 'error ' + e.message.slice(0, 80); }
  const s = await shot('I49-circular'); const r = await mkRec(D.id, { name: 'QA MF circular', qa_a: 'On', qa_bb: 'On', qa_req: 'r' }, L);
  await setDeps([]);
  rec('I49', 'INFO', `circular rules saved → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 160) : '(accepted, no warning)'}; form: ${note} (${Date.now() - t0} ms); API record → ${r.s} ${r.err} ${JSON.stringify(r.j && r.j.error && r.j.error.details || '').slice(0, 160)}; rules cleared`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I5', async () => {
  await builder(D.id, L); await fieldMenu('QA MF b'); await props('VALIDATION');
  const rs = page.getByText('Required', { exact: true }).locator('xpath=ancestor::div[.//*[@role="switch"]][1]').getByRole('switch').first(); const was = await rs.getAttribute('aria-checked'); if (was !== 'true') await rs.click(); await sleep(500);
  await page.getByText('PERMISSIONS', { exact: true }).first().click(); await sleep(800);
  const t = (await txt()).replace(/\s+/g, ' '); const hint = (t.match(/[^.]{0,60}(required field can.t be read-only|both Required and Read-only)[^.]{0,60}/i) || [''])[0];
  const ro = page.getByText('Read-only', { exact: true }).locator('xpath=ancestor::div[.//*[@role="switch"]][1]').getByRole('switch').first(); const dis = await ro.isDisabled().catch(() => null);
  let after = ''; if (!dis) { await ro.click().catch(() => { }); await sleep(400); await page.getByRole('button', { name: /^Apply$/ }).last().click().catch(() => { }); await sleep(1000); await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(2500); after = ((await txt()).replace(/\s+/g, ' ').match(/(Cannot save[^.]*\.|[^.]{0,60}Required and Read-only[^.]*\.|saved[^.]{0,30})/i) || ['no message'])[0]; }
  const s = await shot('I5-required-readonly');
  const st = JSON.stringify(await getLayout(D.id, L)); const b = (st.match(/"fieldName":"qa_b"[\s\S]{0,1500}?"config":\{[^}]*\}/) || [''])[0]; const cfg = (b.match(/"config":\{[^}]*\}/) || [''])[0];
  rec('I5', 'INFO', `VALIDATION Required on (was ${was}); PERMISSIONS hint "${hint}"; Read-only switch disabled=${dis}; after Read-only on + Apply + Save: "${after}"; stored qa_b ${cfg}`, { shot: s });
  await page.keyboard.press('Escape'); await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(() => { });
});
await step('J4', async () => {
  const c = await api('POST', '/custom-datatypes', { key: 'qa_mf_dt2', label: 'QA MF dt2', description: 'QA MF run 2', base_datatype_key: 'single_line', icon: 'type' });
  const cat = arr((await api('GET', '/fields/datatypes')).j.data).map(t => t.key); const hit = cat.filter(k => /qa_mf_dt2|qa_mf_dt/.test(k)); const tdt = cat.filter(k => /test_?data/i.test(k));
  const key = hit[0] || 'qa_mf_dt2'; const f = await addFields(D.id, [{ fieldName: 'qa_cdt2', datatypeKey: key }]); if (f.s < 300) await placeOnLayout(D.id, L, ['qa_cdt2']);
  const r1 = await mkRec(D.id, { name: 'QA MF cdt2 before', qa_req: 'r', qa_cdt2: 'v1' }, L);
  const del = await api('DELETE', `/custom-datatypes/qa_mf_dt2`); const fl = (await fieldsOf(D.id)).find(x => x.fieldName === 'qa_cdt2'); const r2 = await mkRec(D.id, { name: 'QA MF cdt2 after', qa_req: 'r', qa_cdt2: 'v2' }, L);
  await builder(D.id, L); const bt = await txt(); const s = await shot('J4-after-delete');
  rec('J4', 'INFO', `create custom type → ${c.s}; field catalogue now has [${hit.join(',')}] (TestDataType key ${tdt.join(',')}); field with key ${key} → ${f.s} ${f.s >= 300 ? (f.t || '').slice(0, 160) : ''}; record → ${r1.s}; DELETE type → ${del.s} ${(del.t || '').slice(0, 120)}; field now ${fl ? fl.datatypeKey + '/' + fl.status : 'gone'}; new record → ${r2.s} ${r2.err}; builder error=${/something went wrong/i.test(bt)}`, { shot: s });
});
await step('K10', async () => {
  const key = 'general.user.desk.nav_tabs'; const pref = async () => ((await api('GET', `/settings/resolved?app_key=general&key=${key}&scope_type=User`)).j || {}).data; const p0 = await pref();
  const writes = []; const f = r => { if (['PUT', 'POST', 'PATCH'].includes(r.method()) && /settings/.test(r.url()) && !/resolved/.test(r.url())) writes.push({ m: r.method(), u: r.url().replace(API, ''), b: r.postData() }); };
  const ctx = page.context(); ctx.on('request', f);
  const p2 = await ctx.newPage(); const errs = []; for (const pg of [page, p2]) pg.on('response', r => { if (r.url().includes('/api/v1/') && r.status() >= 400) errs.push(r.status()); });
  await page.goto(H + '/settings/organize-tabs', { waitUntil: 'domcontentloaded' }); await p2.goto(H + '/settings/organize-tabs', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  const n1 = await page.locator('button[aria-label^="Move "]').evaluateAll(bs => bs.map(b => b.getAttribute('aria-label')).filter(a => / down$/.test(a)));
  await page.getByRole('button', { name: n1[0] }).click(); await sleep(2000); const afterTab1 = JSON.stringify((await pref()).value_json || '').slice(0, 140);
  await p2.getByRole('button', { name: n1[1] || n1[0] }).click(); await p2.waitForTimeout(2500); const afterTab2 = JSON.stringify((await pref()).value_json || '').slice(0, 140);
  const s = await shot('K10-two-tabs'); await p2.close(); ctx.off('request', f);
  // restore the original order with the same call the page used
  let restore = '-'; const w = writes[writes.length - 1]; if (w && p0) { try { const body = JSON.parse(w.b); const orig = p0.value_json; const nb = JSON.parse(JSON.stringify(body)); const set = o => { for (const k of Object.keys(o)) { if (/value_json|value/.test(k) && typeof o[k] === 'string') o[k] = orig; else if (o[k] && typeof o[k] === 'object') set(o[k]); } }; set(nb); const r = await api(w.m, w.u, nb); restore = r.s; } catch (e) { restore = 'err ' + e.message.slice(0, 60); } }
  const p3 = await pref();
  rec('K10', 'INFO', `tab 1 "${n1[0]}" → pref ${afterTab1}; tab 2 (stale page) "${n1[1] || n1[0]}" → pref ${afterTab2}; API errors ${JSON.stringify(errs)}; save call ${writes.length ? writes[0].m + ' ' + writes[0].u : 'none'}; restored original → ${restore}, same as before=${p3 && p0 && p3.value_json === p0.value_json}`, { shot: s });
});
return done();
