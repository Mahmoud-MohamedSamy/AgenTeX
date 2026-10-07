// Group B3 (admin B) — retries with fixes: I27 UI, I5 via GENERAL Required, I47–I49 via "Layout settings" gear, J4 by key, K10, Z12, E2E-2 setup with UUID ids.
const D = (await mods()).find(m => /qa_mf_deps$/.test(m.moduleKey)); const L = (await defLayout(D.id)).id;
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c', LAG = '2765f377-5030-4512-8c29-43b133395d11';
const uuid = () => crypto.randomUUID();
const createBtn = async (mid, sing) => { await go(`/modules/${mid}`, 9000); const b = page.getByRole('button', { name: new RegExp('Create ' + sing) }); await b.waitFor({ timeout: 20000 }); await b.click(); await sleep(3500); };
const visible = async lab => (await page.getByText(lab, { exact: true }).count()) > 0;
const pick = async (lab, value) => { const sel = page.locator('select').filter({ has: page.locator('option', { hasText: new RegExp('^' + value + '$') }) }).first();
  if (await sel.count()) { await sel.selectOption(value); return 'select'; }
  const l = page.getByText(lab, { exact: true }).first(); const box = l.locator('xpath=ancestor::*[.//button or .//input or .//*[@role="combobox"]][1]');
  await box.locator('[role=combobox], button, input').first().click().catch(() => { }); await sleep(800); const o = page.getByRole('option', { name: value, exact: true }); if (await o.count()) { await o.first().click(); return 'option'; } await page.getByText(value, { exact: true }).last().click().catch(() => { }); return 'text'; };
await step('I27', async () => {
  const hidden = await mkRec(D.id, { name: 'QA MF vis Y', qa_ctrl: 'Y', qa_req: 'r' }, L);
  const shown = await mkRec(D.id, { name: 'QA MF vis X', qa_ctrl: 'X', qa_req: 'r' }, L);
  const ok = await mkRec(D.id, { name: 'QA MF vis X ok', qa_ctrl: 'X', qa_dep: 'given', qa_req: 'r' }, L);
  await createBtn(D.id, D.singularForm || 'QA MF Deps1');
  const before = await visible('QA MF dep'); const how = await pick('QA MF ctrl', 'X'); await sleep(1200); const afterX = await visible('QA MF dep'); const sX = await shot('I27-after-X');
  await pick('QA MF ctrl', 'Y'); await sleep(1200); const afterY = await visible('QA MF dep');
  rec('I27', 'INFO', `rule: "QA MF dep" (required) shown when ctrl equals "x". API: ctrl=Y without dep → ${hidden.s} ${hidden.err}; ctrl=X without dep → ${shown.s} ${shown.err}; ctrl=X with dep → ${ok.s}. Form (${how}): dep visible at start=${before}, after X=${afterX}, after Y=${afterY}`, { shot: sX });
  await page.keyboard.press('Escape');
});
await step('I5', async () => {
  await builder(D.id, L); await fieldMenu('QA MF b'); await props('GENERAL');
  const req = page.locator('aside, [role=dialog]').last().getByText(/^Required$|^Mandatory$/).first(); let reqOn = false;
  if (await req.count()) { const box = req.locator('xpath=ancestor::*[.//input or .//*[@role="switch"] or .//*[@role="checkbox"]][1]'); const ctl = box.locator('input[type=checkbox], [role=switch], [role=checkbox]').first(); await ctl.click().catch(() => { }); reqOn = true; await sleep(500); }
  await page.getByText('PERMISSIONS', { exact: true }).first().click(); await sleep(800);
  const t = await txt(); const hint = (t.match(/[^.\n]*required[^.\n]*read-only[^.\n]*/i) || [''])[0];
  const sw = page.locator('aside, [role=dialog]').last().getByRole('switch').first(); const dis = (await sw.count()) ? await sw.isDisabled() : null;
  let apply = ''; if (!dis && await sw.count()) { await sw.click().catch(() => { }); await sleep(400); await page.locator('aside button, [role=dialog] button').filter({ hasText: /^Apply$/ }).last().click().catch(() => { }); await sleep(800); await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(2500); apply = ((await txt()).replace(/\s+/g, ' ').match(/(Cannot save[^.]*\.|[^.]{0,40}both Required and Read-only[^.]*\.|saved[^.]{0,30})/i) || ['no message'])[0]; }
  const s = await shot('I5-required-then-readonly');
  const lay = JSON.stringify(await getLayout(D.id, L)); const stored = (lay.match(/"fieldName":"qa_b"[^}]*?"config":\{[^}]*\}/) || [''])[0].slice(-160);
  rec('I5', 'INFO', `GENERAL Required ticked=${reqOn}; PERMISSIONS hint "${hint}"; Read-only switch disabled=${dis}; after turning Read-only on + Apply + Save: "${apply}"; stored ${stored}`, { shot: s });
  await page.keyboard.press('Escape');
});
const depDialog = async () => { await builder(D.id, L); await page.getByRole('button', { name: 'Layout settings' }).click(); await sleep(800); await page.getByText('Field Dependency', { exact: true }).click(); await sleep(1800); };
await step('I47', async () => {
  const stop = capOn(); await depDialog();
  const dlg = page.locator('[role=dialog]').last(); const t0 = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' '); const s0 = await shot('I47-dependency-dialog');
  const btns = (await dlg.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
  // add a rule: parent qa_ctrl = Z → SHOW qa_b
  const add = dlg.getByRole('button', { name: /Add|New rule|Create/i }).first(); if (await add.count()) { await add.click(); await sleep(1000); }
  const sels = dlg.locator('select'); const n = await sels.count(); const opts = await sels.evaluateAll(es => es.map(e => [...e.options].map(o => o.text).join('/')));
  rec('I47.dialog', 'INFO', `dialog "${t0.slice(0, 300)}"; buttons [${btns.join(' | ')}]; after Add: ${n} selects ${JSON.stringify(opts).slice(0, 400)}`, { shot: s0 });
  let filled = [];
  if (n) { for (let i = 0; i < n; i++) { const o = opts[i] || ''; const want = /QA MF ctrl/.test(o) ? 'QA MF ctrl' : /SHOW|Show/.test(o) ? (o.match(/Show|SHOW/)[0]) : null; if (want) { await sels.nth(i).selectOption({ label: want }).catch(() => { }); filled.push(i + ':' + want); await sleep(400); } } }
  const zc = dlg.getByText('Z', { exact: true }); if (await zc.count()) { await zc.first().click().catch(() => { }); filled.push('value Z'); }
  const bc = dlg.getByText('QA MF b', { exact: true }); if (await bc.count()) { await bc.last().click().catch(() => { }); filled.push('child QA MF b'); }
  const s1 = await shot('I47-rule-filled');
  const save = dlg.getByRole('button', { name: /Save Rules|Save rule|Save/ }).last(); if (await save.count()) { await save.click().catch(() => { }); await sleep(1500); }
  await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(3000); stop();
  const deps = (await getLayout(D.id, L)).dependencies;
  rec('I47', 'INFO', `filled ${filled.join(', ')}; stored dependencies ${JSON.stringify(deps).slice(0, 400)}; writes ${cap.join(' || ').slice(0, 300)}`, { shot: s1 });
});
await step('I47.api', async () => {
  const F = await fieldsOf(D.id); const id = n => F.find(f => f.fieldName === n).id;
  const lay = await getLayout(D.id, L); const b = JSON.parse(JSON.stringify(lay)); delete b.id;
  b.dependencies = [{ id: uuid(), parentFieldId: id('qa_ctrl'), parentValues: ['Z'], action: 'SHOW', childFieldIds: [id('qa_b')] }, { id: uuid(), parentFieldId: id('qa_ctrl'), parentValues: ['Z'], action: 'REQUIRE', childFieldIds: [id('qa_c')] }];
  const p = await api('PUT', `/modules/${D.id}/layouts/${L}`, b); const g = (await getLayout(D.id, L)).dependencies;
  const zNoC = await mkRec(D.id, { name: 'QA MF dep Z no c', qa_ctrl: 'Z', qa_req: 'r' }, L); const zC = await mkRec(D.id, { name: 'QA MF dep Z c', qa_ctrl: 'Z', qa_c: 'c', qa_req: 'r' }, L); const yNoC = await mkRec(D.id, { name: 'QA MF dep Y', qa_ctrl: 'Y', qa_req: 'r' }, L);
  await createBtn(D.id, D.singularForm || 'QA MF Deps1'); const bBefore = await visible('QA MF b'); await pick('QA MF ctrl', 'Z'); await sleep(1200); const bAfter = await visible('QA MF b'); const s = await shot('I47-form-Z');
  await page.keyboard.press('Escape');
  rec('I47.api', 'INFO', `rules SHOW qa_b + REQUIRE qa_c when ctrl=Z saved via layout → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 200) : ''}; stored ${g ? g.length : 0} rules; API: Z without qa_c → ${zNoC.s} ${zNoC.err}; Z with qa_c → ${zC.s}; Y without qa_c → ${yNoC.s}; form: qa_b visible before=${bBefore}, after Z=${bAfter}`, { shot: s });
});
await step('I48', async () => {
  await depDialog(); const dlg = page.locator('[role=dialog]').last(); const t0 = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ');
  const del = dlg.locator('button[aria-label*="elete" i], button[title*="elete" i], button[aria-label*="emove" i]'); const nd = await del.count();
  for (let i = 0; i < nd; i++) { await del.first().click().catch(() => { }); await sleep(600); const c = page.getByRole('button', { name: /^(Delete|Confirm|Yes)$/ }).last(); if (await c.count()) await c.click().catch(() => { }); await sleep(600); }
  const t1 = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' '); const s = await shot('I48-after-delete');
  const save = dlg.getByRole('button', { name: /Save Rules|Save/ }).last(); if (await save.count()) await save.click().catch(() => { }); await sleep(1200); await page.getByRole('button', { name: /^Save$/ }).first().click().catch(() => { }); await sleep(2500);
  const g = (await getLayout(D.id, L)).dependencies;
  rec('I48', 'INFO', `dialog listed: "${t0.slice(0, 250)}"; delete buttons ${nd}; after deleting: "${t1.slice(0, 250)}"; stored rules now ${g ? g.length : 'none'}`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('I49', async () => {
  const F = await fieldsOf(D.id); const id = n => F.find(f => f.fieldName === n).id;
  const lay = await getLayout(D.id, L); const b = JSON.parse(JSON.stringify(lay)); delete b.id;
  b.dependencies = [{ id: uuid(), parentFieldId: id('qa_a'), parentValues: ['On'], action: 'SHOW', childFieldIds: [id('qa_bb')] }, { id: uuid(), parentFieldId: id('qa_bb'), parentValues: ['On'], action: 'HIDE', childFieldIds: [id('qa_a')] }];
  const p = await api('PUT', `/modules/${D.id}/layouts/${L}`, b);
  const t0 = Date.now(); let note = '';
  try { await createBtn(D.id, D.singularForm || 'QA MF Deps1'); await pick('QA MF a', 'On'); await sleep(1500); await pick('QA MF bb', 'On'); await sleep(2000); note = `form still responsive=${await page.evaluate(() => 1 + 1) === 2}, a visible=${await visible('QA MF a')}, bb visible=${await visible('QA MF bb')}`; } catch (e) { note = 'error ' + e.message.slice(0, 80); }
  const s = await shot('I49-circular'); const r = await mkRec(D.id, { name: 'QA MF circular', qa_a: 'On', qa_bb: 'On', qa_req: 'r' }, L);
  const back = JSON.parse(JSON.stringify(lay)); delete back.id; back.dependencies = []; await api('PUT', `/modules/${D.id}/layouts/${L}`, back);
  rec('I49', 'INFO', `circular rules (a=On shows bb, bb=On hides a) saved → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 160) : '(accepted)'}; form: ${note} (${Date.now() - t0} ms); API record → ${r.s}; rules cleared after`, { shot: s });
  await page.keyboard.press('Escape');
});
await step('J4', async () => {
  const list0 = arr((await api('GET', '/custom-datatypes')).j.data); const dt = list0.find(x => /qa_mf_dt/.test(x.key)); const key = dt ? dt.key : 'qa_mf_dt';
  const f = await addFields(D.id, [{ fieldName: 'qa_cdt', datatypeKey: key }]);
  if (f.s < 300) await placeOnLayout(D.id, L, ['qa_cdt']);
  const r1 = await mkRec(D.id, { name: 'QA MF cdt before', qa_req: 'r', qa_cdt: 'v1' }, L);
  const del = await api('DELETE', `/custom-datatypes/${encodeURIComponent(key)}`);
  const still = arr((await api('GET', '/custom-datatypes')).j.data).some(x => x.key === key); const fl = (await fieldsOf(D.id)).find(x => x.fieldName === 'qa_cdt');
  const r2 = await mkRec(D.id, { name: 'QA MF cdt after', qa_req: 'r', qa_cdt: 'v2' }, L); const g = r1.id ? await getRec(D.id, r1.id) : {};
  await builder(D.id, L); const bt = (await txt()).replace(/\s+/g, ' '); const s = await shot('J4-builder-after-type-delete');
  rec('J4', 'INFO', `type key ${key} (exists ${!!dt}); field with it → ${f.s} ${f.s >= 300 ? (f.t || '').slice(0, 200) : ''}; record → ${r1.s} ${r1.err}; DELETE type in use → ${del.s} ${(del.t || '').slice(0, 160)}; type still listed=${still}; field now ${fl ? fl.datatypeKey + '/' + fl.status : 'gone'}; new record → ${r2.s} ${r2.err}; old value ${val(g.qa_cdt)}; builder shows error=${/something went wrong/i.test(bt)}`, { shot: s });
});
await step('Z12', async () => {
  const out = [];
  for (const [n, id] of Object.entries({ tasks: M.tasks, calls: M.calls, events: M.events, contracts: M.contracts, products: M.products, tickets: M.tickets })) { const f = (await fieldsOf(id)).find(x => /^department/.test(x.fieldName)); out.push(`${n}: ${f ? f.fieldName + ' required=' + f.required + ' onLayouts=' + (f.layouts || []).length : 'none'}`); }
  await go(`/settings/modules-and-fields/${M.tickets}`, 7000); const t = (await txt()).replace(/\s+/g, ' '); const s = await shot('Z12-ticket-layouts');
  rec('Z12', 'MISSING', `Tickets Layouts page mentions a department picker=${/Select department|All departments|Department:/i.test(t)}; Department field per module: ${out.join('; ')}. Layouts are per profile, not per department — still missing (retest when built)`, { shot: s });
});
await step('E2E-2.setup', async () => {
  const lay = await getLayout(OPEN, LAG); const F = (await fieldsOf(OPEN)).filter(f => ['qa_e2e_kind', 'qa_e2e_serial'].includes(f.fieldName)); const kind = F.find(f => f.fieldName === 'qa_e2e_kind'), ser = F.find(f => f.fieldName === 'qa_e2e_serial');
  const b = JSON.parse(JSON.stringify(lay)); delete b.id;
  for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = b.views[v] && b.views[v].layout && b.views[v].layout.sections; if (!ss) continue; if (!ss.some(s => s.label && s.label.en === 'QA MF E2E section')) { const sid = uuid(); ss.push({ id: sid, label: { en: 'QA MF E2E section' }, columns: [{ id: uuid(), fields: [kind, ser].map(f => JSON.parse(JSON.stringify(f))) }], tab_order: ss[0].tab_order }); } }
  b.dependencies = [{ id: uuid(), parentFieldId: kind.id, parentValues: ['Hardware'], action: 'SHOW', childFieldIds: [ser.id] }, { id: uuid(), parentFieldId: kind.id, parentValues: ['Hardware'], action: 'REQUIRE', childFieldIds: [ser.id] }];
  const p = await api('PUT', `/modules/${OPEN}/layouts/${LAG}`, b); const g = await getLayout(OPEN, LAG);
  rec('E2E-2.setup', 'INFO', `L-Agent: new section + SHOW/REQUIRE rules → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 300) : ''}; stored rules ${(g.dependencies || []).length}; sections ${g.views.CREATE.layout.sections.map(s => s.label && s.label.en).join(',')}`);
});
await step('K10', async () => {
  const key = 'general.user.desk.nav_tabs'; const g0 = await api('GET', `/settings/resolved?app_key=general&key=${key}&scope_type=User`);
  const p2 = await page.context().newPage(); const errs = [];
  for (const pg of [page, p2]) pg.on('response', r => { if (r.url().includes('/api/v1/') && r.status() >= 400) errs.push(r.status() + ' ' + r.url().replace(API, '').slice(0, 80)); });
  const notes = [];
  for (const [i, pg] of [[1, page], [2, p2]]) { await pg.goto(H + '/hq', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000); const more = pg.getByRole('button', { name: /More|Organize|Organise|tabs/i }); notes.push(`tab${i} buttons ${await more.count()}`); }
  const s = await shot('K10-two-tabs'); await p2.close();
  rec('K10', 'INFO', `${notes.join('; ')}; pref ${(g0.t || '').slice(0, 200)}; errors ${JSON.stringify(errs).slice(0, 160)}`, { shot: s });
});
return done();
