// Group 4b — layout rules, sections, saves (QA module + one Ticket clone, all deleted at the end).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async (mid) => arr((await api('GET', `/modules/${mid || QA.id}/layouts`)).j.data);
const L = async n => (await lays()).find(x => x.name === n);
const builder = async (lid) => { await go(`/settings/modules-and-fields/${QA.id}/layouts/${lid}`, 9000); await page.locator('button.mf-tab', { hasText: /^CREATE/ }).first().click().catch(() => { }); await sleep(800); };
const toastText = async () => (await txt()).replace(/\s+/g, ' ');
const rowMenu = async (name, item) => {
  await go(`/settings/modules-and-fields/${QA.id}`, 6000);
  const row = page.locator('tr', { hasText: name }).first(); await row.hover(); await sleep(300);
  await row.locator(`button[aria-label="Open menu for ${name}"]`).first().click(); await sleep(700);
  const items = (await page.locator('[role=menu]').last().innerText().catch(() => '')).split('\n').filter(Boolean);
  if (item) { await page.getByRole('menuitem', { name: item }).first().click().catch(async () => page.getByText(item, { exact: true }).last().click()); await sleep(1500); }
  return items;
};
const toggleRow = async name => { await go(`/settings/modules-and-fields/${QA.id}`, 6000); const b = page.locator(`button[aria-label="Toggle ${name} status"]`).first(); if (await b.isDisabled()) { const tt = await b.evaluate(e => e.title || (e.closest('[title]') || {}).title || ''); return 'SWITCH-DISABLED ' + tt; } await b.click(); await sleep(2000); return toastText(); };
const recIn = async (lid, n) => api('POST', `/modules/${QA.id}/records`, { data: [{ field: 'name', value: { kind: 'string', value: n } }], layout_id: lid });
let all0 = await lays(); let DEF = all0.find(x => x.isDefault) || all0[0]; if (!DEF.isDefault) { await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/set-default`); DEF = (await lays()).find(x => x.id === DEF.id); }
for (const x of all0) if (x.id !== DEF.id) await api('DELETE', `/modules/${QA.id}/layouts/${x.id}`);
let L1 = (await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/clone`, { name: 'QA MF L1x' })).j.data;
rec('G.setup', 'INFO', `default layout "${DEF.name}" (${DEF.id.slice(0, 8)}), test layout QA MF L1 ${L1 && L1.id.slice(0, 8)}`);

await step('G4b', async () => {
  const before = L1.name; const body = { ...L1, name: DEF.name }; delete body.id;
  const r = await api('PUT', `/modules/${QA.id}/layouts/${L1.id}`, body);
  const now = (await api('GET', `/modules/${QA.id}/layouts/${L1.id}`)).j.data;
  const dup = now && now.name === DEF.name;
  if (dup) { const b2 = { ...now, name: 'QA MF L1x' }; delete b2.id; await api('PUT', `/modules/${QA.id}/layouts/${L1.id}`, b2); }
  rec('G4b', dup ? 'FAIL' : 'PASS', `server: PUT layout name "${DEF.name}" (already used) → ${r.s} ${r.s >= 400 ? ((r.j && r.j.error && r.j.error.message) || '').slice(0, 80) : ''}; stored name ${now && now.name}${dup ? ' (renamed back)' : ''}`);
  L1 = await L('QA MF L1x');
});
await step('G5', async () => {
  const sd = await api('POST', `/modules/${QA.id}/layouts/${L1.id}/set-default`); const a = await L('QA MF L1x');
  const t = await toggleRow('QA MF L1x'); const msg = t.includes('This is the default layout and cannot be switched off') || t.startsWith('SWITCH-DISABLED');
  const b = await L('QA MF L1x');
  rec('G5', a.isDefault && msg && b.status === 'active' ? 'PASS' : 'FAIL', `set-default L1 → ${sd.s}, isDefault=${a.isDefault}; switching the default off is blocked=${msg} (${t.startsWith('SWITCH-DISABLED') ? t : 'message'}); L1 still ${b.status}`);
  await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/set-default`);
});
await step('G6', async () => {
  await toggleRow('QA MF L1x'); const off = await L('QA MF L1x');
  const sd = await api('POST', `/modules/${QA.id}/layouts/${L1.id}/set-default`); const after = await L('QA MF L1x');
  let ui = '';
  try { await rowMenu('QA MF L1x', 'Set as default'); ui = (await toastText()).includes('Only an active layout can be the default') ? 'UI message shown' : 'UI message not shown'; } catch (e) { ui = 'Set as default not in menu'; }
  rec('G6', off.status !== 'active' && sd.s >= 400 && !after.isDefault ? 'PASS' : 'FAIL', `L1 switched off → status ${off.status}; set-default on inactive → ${sd.s} ${((sd.j && sd.j.error && sd.j.error.message) || '').slice(0, 90)}; isDefault ${after.isDefault}; ${ui}`);
  await toggleRow('QA MF L1x'); L1 = await L('QA MF L1x');
});
await step('G7', async () => {
  const items = await rowMenu(DEF.name, 'Delete'); const t = await toastText(); const dlg = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const msg = /cannot be deleted\. Set another layout as the default first/.test(t + dlg);
  await page.keyboard.press('Escape'); await sleep(500);
  const isDef = ((await lays()).find(x => x.id === DEF.id) || {}).isDefault; const api1 = await api('DELETE', `/modules/${QA.id}/layouts/${DEF.id}`); const still = (await lays()).some(x => x.id === DEF.id);
  rec('G7', msg && still ? 'PASS' : 'FAIL', `(target is the default: ${isDef}) row menu: [${items.join(' | ')}]; UI delete → message shown=${msg}; API DELETE default → ${api1.s} ${api1.s >= 400 ? ((api1.j && api1.j.error && api1.j.error.message) || '').slice(0, 90) : ''}; default still exists=${still}`);
});
await step('G8', async () => {
  const r1 = await recIn(L1.id, 'QA MF on L1 a'), r2 = await recIn(L1.id, 'QA MF on L1 b');
  const ids = [r1, r2].map(r => r.j && r.j.data && r.j.data.id);
  const use = await api('GET', `/modules/${QA.id}/layouts/${L1.id}/record-usage`);
  await rowMenu('QA MF L1x', 'Delete'); const dlg = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const s = await shot('G8-delete-layout-with-records');
  const hasMove = /Move records/.test(dlg);
  let res = '';
  if (hasMove) {
    const sel = page.locator('[role=dialog] select').first(); if (await sel.count()) await sel.selectOption({ label: DEF.name }).catch(() => { });
    else { const c = page.locator('[role=dialog]').getByText(DEF.name, { exact: true }); if (await c.count()) await c.first().click(); }
    await page.locator('[role=dialog] button').filter({ hasText: /Move records|Delete|Move/ }).last().click({ force: true }); await sleep(3000);
    const gone = !(await L('QA MF L1x'));
    const lay = []; for (const id of ids) { const g = await api('GET', `/modules/${QA.id}/records/${id}`); lay.push((g.j && g.j.data && (g.j.data.layout_id || g.j.data.layoutId)) === DEF.id ? 'moved' : 'not moved'); }
    res = `layout deleted=${gone}; records: ${lay.join(', ')}`;
  } else { await page.keyboard.press('Escape'); }
  rec('G8', hasMove && /deleted=true/.test(res) && !/not moved/.test(res) ? 'PASS' : 'FAIL', `record-usage → ${use.s} ${use.t.slice(0, 80)}; delete dialog: "${dlg.slice(0, 200)}"; ${res}`, { shot: s, recordIds: ids });
});
await step('G9', async () => rec('G9', 'INFO', 'Not reachable: the only active layout is always the default (the default cannot be switched off), so the default-layout rule (G7) answers first. The message exists in the code.'));
await step('G3', async () => {
  const tl = (await lays(M.tickets)).find(x => x.id === TL);
  const c = await api('POST', `/modules/${M.tickets}/layouts/${TL}/clone`, { name: 'QA MF Ticket clone' }); const cid = c.j && c.j.data && c.j.data.id;
  let same = '';
  if (cid) { const g = (await api('GET', `/modules/${M.tickets}/layouts/${cid}`)).j.data; const cnt = x => ['CREATE', 'QUICK_CREATE', 'DETAIL'].map(k => x.views[k].layout.sections.reduce((a, s) => a + s.columns.reduce((b, col) => b + col.fields.length, 0), 0)).join('/'); same = `fields per view original ${cnt(tl)} vs clone ${cnt(g)}; clone isDefault=${g.isDefault}, status=${g.status}`; }
  const del = cid ? await api('DELETE', `/modules/${M.tickets}/layouts/${cid}`) : { s: '-' };
  rec('G3', cid && /original (\S+) vs clone \1/.test(same) ? 'PASS' : 'FAIL', `clone Ticket "Standard" → ${c.s}; ${same}; clone deleted again → ${del.s}`);
});
await step('G12', async () => {
  const made = []; let stop = '';
  for (let i = 1; i <= 25; i++) { const c = await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/clone`, { name: 'QA MF lim ' + i }); const id = c.j && c.j.data && c.j.data.id; if (!id) { stop = `refused at #${i}: ${c.s} ${((c.j && c.j.error && c.j.error.message) || '').slice(0, 90)}`; break; } made.push(id); }
  for (const id of made) await api('DELETE', `/modules/${QA.id}/layouts/${id}`);
  rec('G12', 'INFO', `${made.length} extra layouts created${stop ? '; ' + stop : ' with no limit reached (Zoho: 20 per department)'}; all deleted again`);
});
// sections on a fresh L2
let L2 = null;
await step('G16', async () => {
  const c = await api('POST', `/modules/${QA.id}/layouts/${DEF.id}/clone`, { name: 'QA MF L2' }); L2 = c.j.data;
  await builder(L2.id);
  const before = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(1000);
  const after = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.getByRole('button', { name: 'Section settings' }).nth(after - 1).click(); await sleep(700);
  const menu = (await page.locator('[role=menu]').last().innerText().catch(() => (txt()))).replace(/\n/g, ' | ');
  await page.getByText('Edit Name (English / Arabic)', { exact: true }).first().click().catch(() => { }); await sleep(1000);
  const en = page.getByPlaceholder('Section name in English'), ar = page.getByPlaceholder('Section name in Arabic');
  let filled = false;
  if (await en.count()) { await en.fill('QA MF Section'); if (await ar.count()) await ar.fill('قسم QA MF'); filled = true; await page.getByRole('button', { name: /Apply|Save|Done/ }).last().click().catch(() => page.keyboard.press('Escape')); await sleep(800); }
  await page.keyboard.press('Control+s'); await sleep(3500);
  const g = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data; const secs = g.views.CREATE.layout.sections;
  const ns = secs.find(s => /QA MF Section/.test(JSON.stringify(s.label)));
  rec('G16', after === before + 1 && ns && /قسم/.test(JSON.stringify(ns.label)) ? 'PASS' : 'FAIL', `sections ${before}→${after}; section menu: [${menu.slice(0, 220)}]; name drawer filled=${filled}; saved labels: ${secs.map(s => JSON.stringify(s.label)).join(', ')}`);
});
await step('G17-G21', async () => {
  await builder(L2.id);
  const open = async i => { await page.getByRole('button', { name: 'Section settings' }).nth(i).click(); await sleep(700); return (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n/g, ' | '); };
  const n = await page.getByRole('button', { name: 'Section settings' }).count(); const out = [];
  let m = await open(n - 1); const dbl = /Double Column/.test(m) ? 'Double Column' : 'Single Column';
  await page.getByText(dbl, { exact: true }).first().click().catch(() => { }); await sleep(800);
  m = await open(n - 1); await page.getByText('Top to Bottom', { exact: true }).first().click().catch(() => { }); await sleep(600);
  m = await open(n - 1); await page.getByText('Move Up', { exact: true }).first().click().catch(() => { }); await sleep(800);
  await page.keyboard.press('Control+s'); await sleep(3500);
  const g = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data.views.CREATE.layout.sections;
  const idx = g.findIndex(s => /QA MF Section/.test(JSON.stringify(s.label)));
  const sec = g[idx] || {};
  out.push(`G17 columns after "${dbl}": ${(sec.columns || []).length}`);
  out.push(`G18 tab order saved: ${JSON.stringify(sec.tab_order || sec.tabOrder || sec.settings || 'no tab-order key in the saved section')}`);
  out.push(`G19 Move Up: QA MF Section now at index ${idx} of ${g.length}`);
  rec('G17', (sec.columns || []).length >= 1 ? 'PASS' : 'FAIL', out[0]);
  rec('G18', /no tab-order key/.test(out[1]) ? 'FAIL' : 'PASS', out[1] + ' (known: NDC-492)');
  rec('G19', idx === 0 ? 'PASS' : 'FAIL', out[2]);
  // G21: section with the required Name field
  await builder(L2.id);
  const nn = await page.getByRole('button', { name: 'Section settings' }).count(); let found = '';
  for (let i = 0; i < nn; i++) { const mm = await open(i); const del = page.locator('[role=menu] [title="Cannot delete: section contains required fields"], [role=menuitem][aria-disabled=true]:has-text("Delete Section")'); if (await del.count()) { found = `section #${i}: Delete Section disabled ("Cannot delete: section contains required fields")`; await page.keyboard.press('Escape'); break; } await page.keyboard.press('Escape'); await sleep(300); }
  rec('G21', found ? 'PASS' : 'FAIL', found || 'no section showed a disabled Delete Section for required fields');
  // G20: delete the QA MF Section (no required fields)
  await builder(L2.id);
  const n3 = await page.getByRole('button', { name: 'Section settings' }).count(); let dmsg = '';
  for (let i = 0; i < n3; i++) { await page.getByRole('button', { name: 'Section settings' }).nth(i).click(); await sleep(500); const mt = await page.locator('[role=menu]').last().innerText().catch(() => ''); const delItem = page.getByRole('menuitem', { name: 'Delete Section' }); if ((await delItem.count()) && !(await delItem.first().isDisabled().catch(() => true))) { await delItem.first().click(); await sleep(800); dmsg = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.getByRole('button', { name: /Yes, Delete/ }).click().catch(() => { }); await sleep(800); break; } await page.keyboard.press('Escape'); await sleep(300); }
  await page.keyboard.press('Control+s'); await sleep(3500);
  const g2 = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data.views.CREATE.layout.sections;
  rec('G20', /All fields inside will be moved to Unused Fields/.test(dmsg) && !g2.some(s => /QA MF Section/.test(JSON.stringify(s.label))) ? 'PASS' : 'FAIL', `delete dialog: "${dmsg.slice(0, 140)}"; QA MF Section gone after save: ${!g2.some(s => /QA MF Section/.test(JSON.stringify(s.label)))}`);
});
await step('G22', async () => {
  await builder(L2.id);
  await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(900);
  await page.getByRole('button', { name: 'Back to module' }).click(); await sleep(1200);
  const d = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const ok = d.includes('You have not saved your changes.'); await page.getByRole('button', { name: 'Stay Here' }).click().catch(() => { }); await sleep(600);
  rec('G22', ok && page.url().includes('/layouts/') ? 'PASS' : 'FAIL', `Back with an unsaved section → "${d.slice(0, 120)}"; Stay Here keeps the builder: ${page.url().includes('/layouts/')}`);
  // G23 Reset
  await page.getByRole('button', { name: 'Reset' }).click(); await sleep(900);
  const d2 = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  const before = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.getByRole('button', { name: /Yes, Reset/ }).click().catch(() => { }); await sleep(1200);
  const after = await page.getByRole('button', { name: 'Section settings' }).count();
  rec('G23', d2.includes('Reset all changes?') && after === before - 1 ? 'PASS' : 'FAIL', `Reset dialog "${d2.slice(0, 100)}"; sections ${before} → ${after} after Yes, Reset`);
});
await step('G24', async () => {
  await builder(L2.id);
  const b = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(800);
  const a = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.locator('main').click({ position: { x: 10, y: 10 } }).catch(() => { });
  await page.keyboard.press('Control+z'); await sleep(800); const u = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.keyboard.press('Control+y'); await sleep(800); const r = await page.getByRole('button', { name: 'Section settings' }).count();
  rec('G24', a === b + 1 && u === b && r === b + 1 ? 'PASS' : 'FAIL', `sections ${b} → +NEW ${a} → Ctrl+Z ${u} → Ctrl+Y ${r}`);
  await page.getByRole('button', { name: 'Reset' }).click().catch(() => { }); await sleep(500); await page.getByRole('button', { name: /Yes, Reset/ }).click().catch(() => { }); await sleep(800);
});
await step('G25', async () => {
  const v0 = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data.rowVersion;
  await builder(L2.id); await page.locator('button', { hasText: 'NEW SECTION' }).last().click(); await sleep(800);
  await page.keyboard.press('Control+s'); await page.keyboard.press('Control+s'); await sleep(4000);
  const g = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data;
  rec('G25', g.rowVersion - v0 <= 1 ? 'PASS' : 'FAIL', `rowVersion ${v0} → ${g.rowVersion} after Ctrl+S twice; CREATE sections now ${g.views.CREATE.layout.sections.length}`);
});
await step('G26', async () => {
  const g = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data; const b = { ...g }; delete b.id;
  const r1 = await api('PUT', `/modules/${QA.id}/layouts/${L2.id}`, { ...b, name: 'QA MF L2 a' });
  const r2 = await api('PUT', `/modules/${QA.id}/layouts/${L2.id}`, { ...b, name: 'QA MF L2 b (stale)' });
  const now = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data.name;
  rec('G26', r1.s < 300 && r2.s === 409 ? 'PASS' : 'FAIL', `two PUTs with rowVersion ${g.rowVersion}: first → ${r1.s}, second (stale) → ${r2.s}; stored name "${now}"`);
});
await step('G27', async () => rec('G27', 'INCONCLUSIVE', 'session expiry mid-edit cannot be forced from the test side'));
await step('G29', async () => {
  await builder(L2.id);
  const sw = page.getByRole('switch').first(); const n = await sw.count();
  const st = n ? await sw.getAttribute('aria-checked') : null;
  if (n) { await sw.click(); await sleep(500); await page.keyboard.press('Control+s'); await sleep(3500); }
  const g = (await api('GET', `/modules/${QA.id}/layouts/${L2.id}`)).j.data; const flag = JSON.stringify(g).match(/"(module_?[iI]mage[a-zA-Z_]*|show_?[iI]mage)":\s*(true|false)/);
  rec('G29', flag ? 'PASS' : 'INFO', `module image switch present=${n > 0} (was aria-checked=${st}); saved flag: ${flag ? flag[0] : 'no image flag found in the layout JSON'}`);
});
await step('G11', async () => {
  await go(`/modules/${QA.id}/records/new`, 7000); const t = await txt();
  rec('G11', /Select Layout|Select a layout|Choose a layout/.test(t) || (await page.locator('select').filter({ hasText: /QA MF L|Default/ }).count()) > 0 ? 'PASS' : 'FAIL', `new-record page with 2 active layouts shows a layout chooser: ${/Select Layout|Select a layout/.test(t)}`, { shot: await shot('G11-new-record-layout-choice') });
});
// cleanup group 4 objects (keep Default)
for (const x of await lays()) if (x.id !== DEF.id) { await api('POST', `/modules/${QA.id}/layouts/${x.id}/reassign-records`, { target_layout_id: DEF.id }); await api('DELETE', `/modules/${QA.id}/layouts/${x.id}`); }
for (const x of await lays(M.tickets)) if (/^QA MF/.test(x.name)) await api('DELETE', `/modules/${M.tickets}/layouts/${x.id}`);
rec('G.cleanup', 'INFO', `QA layouts left: ${(await lays()).map(x => x.name).join(', ')}; Ticket QA layouts left: ${(await lays(M.tickets)).filter(x => /^QA MF/.test(x.name)).length}`);
return done();
