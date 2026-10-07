// Group B1 (admin B) — module "QA MF Deps": I5, I27, I47, I48, I49 (dependency rules), J4 (custom data type in use), K10 (two tabs).
const D = await mkModule('qa_mf_deps', 'QA MF Deps');
const L = await initLayout(D.id);
await step('B1.setup', async () => {
  const f = await addFields(D.id, [
    { fieldName: 'qa_ctrl', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['X', 'Y', 'Z'] } },
    { fieldName: 'qa_dep', datatypeKey: 'single_line', required: true },
    { fieldName: 'qa_b', datatypeKey: 'single_line' },
    { fieldName: 'qa_c', datatypeKey: 'single_line' },
    { fieldName: 'qa_req', datatypeKey: 'single_line', required: true },
    { fieldName: 'qa_a', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['On', 'Off'] } },
    { fieldName: 'qa_bb', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['On', 'Off'] } },
  ]);
  const p = await placeOnLayout(D.id, L, ['qa_ctrl', 'qa_dep', 'qa_b', 'qa_c', 'qa_req', 'qa_a', 'qa_bb'], { qa_dep: { visibilityRule: { dependsOn: 'qa_ctrl', anyNonEmpty: false, equalsAny: ['x'] } } });
  const lay = JSON.stringify(await getLayout(D.id, L)); const vr = (lay.match(/"visibilityRule":\{[^}]*\}/) || ['none'])[0];
  rec('B1.setup', 'INFO', `module ${D.id}; fields → ${f.s} ${f.s >= 300 ? f.t : ''}; layout → ${p.s} ${p.s >= 300 ? p.t : ''}; stored ${vr}`, { mod: D.id, lay: L });
});
await step('I27', async () => {
  const base = { qa_req: 'r' };
  const hidden = await mkRec(D.id, { name: 'QA MF vis Y', qa_ctrl: 'Y', ...base }, L);
  const shown = await mkRec(D.id, { name: 'QA MF vis X', qa_ctrl: 'X', ...base }, L);
  const shownOk = await mkRec(D.id, { name: 'QA MF vis X ok', qa_ctrl: 'X', qa_dep: 'given', ...base }, L);
  // UI: record form
  await go(`/modules/${D.id}`, 7000); await page.getByRole('button', { name: /Create QA MF Deps1/ }).click(); await sleep(3000);
  const has = async () => (await page.getByText('QA MF dep', { exact: true }).count()) > 0;
  const before = await has(); let afterX = null, afterY = null, how = '';
  const sel = page.locator('select').filter({ has: page.locator('option', { hasText: /^X$/ }) }).first();
  if (await sel.count()) { how = 'native select'; await sel.selectOption('X'); await sleep(800); afterX = await has(); await sel.selectOption('Y'); await sleep(800); afterY = await has(); }
  else { how = 'custom dropdown'; const lab = page.getByText('QA MF ctrl', { exact: true }).first(); const box = lab.locator('xpath=ancestor::*[.//button or .//input][1]'); await box.locator('button, input').first().click().catch(() => { }); await sleep(800); const ox = page.getByRole('option', { name: 'X' }).or(page.getByText('X', { exact: true })).last(); if (await ox.count()) { await ox.click(); await sleep(800); afterX = await has(); } }
  const s = await shot('I27-visibility-form'); await page.keyboard.press('Escape');
  rec('I27', 'INFO', `rule: show "QA MF dep" (required) when ctrl equals "x"; API: ctrl=Y without dep → ${hidden.s} ${hidden.err}; ctrl=X (case differs) without dep → ${shown.s} ${shown.err}; ctrl=X with dep → ${shownOk.s}. Form (${how}): dep visible at start=${before}, after X=${afterX}, after Y=${afterY}`, { shot: s });
});
await step('I5', async () => {
  await builder(D.id, L); await fieldMenu('QA MF req'); await props('PERMISSIONS');
  const t = await txt(); const hint = /required field can.t be read-only/i.test(t);
  const sw = page.locator('aside, [role=dialog]').last().getByRole('switch').first(); const dis = (await sw.count()) ? await sw.isDisabled() : null;
  const s = await shot('I5-required-readonly');
  // API: both at once
  const lay = await getLayout(D.id, L); const b = JSON.parse(JSON.stringify(lay)); delete b.id;
  for (const v of Object.values(b.views)) for (const sec of (v.layout && v.layout.sections) || []) for (const c of sec.columns) for (const e of c.fields) if (e.fieldName === 'qa_req') e.config = { ...(e.config || {}), required: true, read_only: true };
  const pu = await api('PUT', `/modules/${D.id}/layouts/${L}`, b);
  const back = JSON.parse(JSON.stringify(lay)); delete back.id; await api('PUT', `/modules/${D.id}/layouts/${L}`, back);
  rec('I5', (hint || dis) && pu.s >= 400 ? 'PASS' : 'INFO', `builder PERMISSIONS tab of a required field: hint shown=${hint}, Read-only switch disabled=${dis}; API layout save with required + read_only on the same field → ${pu.s} ${pu.s >= 300 ? (pu.t || '').slice(0, 160) : '(accepted)'}`, { shot: s });
  await page.keyboard.press('Escape');
});
// I47–I49: Field Dependency dialog (gear menu)
const depDialog = async () => { await builder(D.id, L); const lname = (await getLayout(D.id, L)).name; await page.getByText(lname, { exact: true }).first().locator('xpath=following::button[1]').click(); await sleep(800); await page.getByText('Field Dependency', { exact: true }).click(); await sleep(1800); };
await step('I47', async () => {
  const stop = capOn();
  await depDialog(); const t0 = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const s0 = await shot('I47-dependency-dialog');
  const btns = (await page.locator('[role=dialog] button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
  const sels = await page.locator('[role=dialog] select').evaluateAll(es => es.map(e => [...e.options].map(o => o.text).join('/')));
  stop();
  rec('I47.ui', 'INFO', `dialog: "${t0.slice(0, 400)}"; buttons [${btns.join(' | ')}]; selects ${JSON.stringify(sels).slice(0, 400)}`, { shot: s0 });
  await page.keyboard.press('Escape');
});
await step('J4', async () => {
  const c = await api('POST', '/custom-datatypes', { key: 'qa_mf_dt', label: 'QA MF dt', description: 'QA MF run 2', base_datatype_key: 'single_line', icon: 'type' });
  const f = await addFields(D.id, [{ fieldName: 'qa_cdt', datatypeKey: 'qa_mf_dt' }]); await placeOnLayout(D.id, L, ['qa_cdt']);
  const r1 = await mkRec(D.id, { name: 'QA MF cdt before', qa_req: 'r', qa_cdt: 'v1' }, L);
  const list = arr((await api('GET', '/custom-datatypes')).j.data); const dt = list.find(x => x.key === 'qa_mf_dt');
  const del = dt ? await api('DELETE', `/custom-datatypes/${dt.id}`) : { s: '-', t: 'not found' };
  const after = arr((await api('GET', '/custom-datatypes')).j.data).some(x => x.key === 'qa_mf_dt');
  const fl = (await fieldsOf(D.id)).find(x => x.fieldName === 'qa_cdt');
  const r2 = await mkRec(D.id, { name: 'QA MF cdt after', qa_req: 'r', qa_cdt: 'v2' }, L); const g = r1.id ? await getRec(D.id, r1.id) : {};
  await builder(D.id, L); const bt = await txt(); const s = await shot('J4-builder-after-type-delete');
  rec('J4', 'INFO', `custom type create → ${c.s}; field using it → ${f.s}; record → ${r1.s}; DELETE type in use → ${del.s} ${(del.t || '').slice(0, 200)}; type still listed=${after}; field now ${fl ? fl.datatypeKey + ' status ' + fl.status : 'gone'}; new record → ${r2.s} ${r2.err}; old value ${val(g.qa_cdt)}; builder error text=${/something went wrong|error/i.test(bt)}`, { shot: s });
});
await step('K10', async () => {
  const key = 'general.user.desk.nav_tabs'; const g0 = await api('GET', `/settings/resolved?app_key=general&key=${key}&scope_type=User`);
  const p2 = await page.context().newPage(); const errs = [];
  for (const pg of [page, p2]) pg.on('response', r => { if (r.url().includes('/api/v1/') && r.status() >= 400) errs.push(r.status() + ' ' + r.url().replace(API, '').slice(0, 80)); });
  const open = async pg => { await pg.goto(H + '/hq', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(5000); };
  await open(page); await open(p2);
  const orgBtn = pg => pg.getByRole('button', { name: /Organize Tabs|Organise Tabs/ }).or(pg.getByText('Organize Tabs', { exact: true })).first();
  const moveFirstDown = async pg => { const m = pg.locator('[aria-label^="Move"][aria-label*="down"]').first(); if (await m.count()) { await m.click(); await pg.waitForTimeout(400); return true; } return false; };
  let notes = [];
  for (const [i, pg] of [[1, page], [2, p2]]) {
    await pg.locator('button[aria-label*="menu" i], button[title*="tabs" i]').first().click().catch(() => { });
    await pg.waitForTimeout(500);
    const ob = orgBtn(pg); if (await ob.count()) { await ob.click(); await pg.waitForTimeout(1500); } else { await pg.goto(H + '/settings/organize-tabs', { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(4000); }
    notes.push(`tab${i}: url ${pg.url().replace(H, '')}, moved=${await moveFirstDown(pg)}`);
  }
  for (const [i, pg] of [[1, page], [2, p2]]) { const sv = pg.getByRole('button', { name: /^Save$/ }).last(); if (await sv.count()) { await sv.click().catch(e => notes.push('save' + i + ' ' + e.message.slice(0, 60))); await pg.waitForTimeout(2500); notes.push(`tab${i} saved: "${((await pg.innerText('body')).match(/(saved|updated|conflict|changed elsewhere|error)[^\n]{0,60}/i) || [''])[0]}"`); } }
  const g1 = await api('GET', `/settings/resolved?app_key=general&key=${key}&scope_type=User`);
  const s = await shot('K10-two-tabs'); await p2.close();
  rec('K10', 'INFO', `${notes.join(' ; ')}; API errors ${JSON.stringify(errs).slice(0, 200)}; pref before ${(g0.t || '').slice(0, 160)}; after ${(g1.t || '').slice(0, 160)}`, { shot: s, prefBefore: g0.j && g0.j.data });
});
return done();
