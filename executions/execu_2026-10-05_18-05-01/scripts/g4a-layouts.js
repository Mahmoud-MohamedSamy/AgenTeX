// Group 4a — layouts on QA MF Devices (QA objects only).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const lays = async () => arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data);
let cap = [];
const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && /\/layouts/.test(r.url())) cap.push({ m: r.method(), u: r.url().replace(API, ''), b: (r.postData() || '').slice(0, 3000) }); };
page.on('request', onW);
const builder = async (lid, w) => { await go(`/settings/modules-and-fields/${QA.id}/layouts/${lid}`, w || 9000); };
const dlgText = async () => (await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');

await step('G1', async () => {
  await go(`/settings/modules-and-fields/${QA.id}`, 6000);
  const badge = page.getByText('Default', { exact: true }).nth(1); const n = await page.getByText('Default', { exact: true }).count();
  const title = await page.locator('[title*="New records use this layout"]').count();
  rec('G1', n >= 2 && title > 0 ? 'PASS' : 'FAIL', `"Default" badge on the only layout: ${n >= 2}; tooltip "New records use this layout unless another one is chosen." present: ${title > 0}`);
});
await step('G2', async () => {
  await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(7000);
  await page.locator('[title="Click to rename layout"]').first().click(); await sleep(700);
  const ren = async v => { if (!(await page.locator('input[maxlength="40"]').count())) { await page.locator('[title="Click to rename layout"]').first().click(); await sleep(600); } const i = page.locator('input[maxlength="40"]').first(); await i.fill(v); const kept = (await i.inputValue()).length; await i.press('Enter'); await sleep(700); return { kept, t: await txt() }; };
  const out = [];
  let r = await ren(''); out.push('empty → ' + (r.t.includes('Name is required') ? '"Name is required"' : 'no message'));
  r = await ren('x'.repeat(45)); out.push('45 typed → kept ' + r.kept + ' chars');
  r = await ren('Default'); out.push('"Default" → ' + (r.t.includes('A layout with this name already exists') ? 'duplicate message' : 'no message'));
  r = await ren('QA MF L1'); out.push('title now: ' + ((await page.locator('[title="Click to rename layout"]').first().innerText().catch(() => '?'))));
  rec('G4', /Name is required/.test(out[0]) && /kept 40/.test(out[1]) && /duplicate message/.test(out[2]) ? 'PASS' : 'FAIL', out.join(' ; '));
  await page.getByRole('button', { name: 'Save and Close' }).click(); await sleep(5000);
  const l = await lays(); const l1 = l.find(x => x.name === 'QA MF L1');
  rec('G2', l1 && l1.status === 'active' && !l1.isDefault ? 'PASS' : 'FAIL', `layouts now: ${l.map(x => `${x.name}[${x.status}${x.isDefault ? ',default' : ''}]`).join(', ')}; save request: ${(cap.find(c => c.m === 'POST') || {}).u || 'none'}`, { createBody: (cap.find(c => c.m === 'POST') || {}).b });
});
await step('G13', async () => {
  const L = (await lays()).find(x => x.name === 'QA MF L1'); const v = L.views || {};
  const sec = k => v[k] && v[k].layout && v[k].layout.sections.length;
  rec('G13', v.CREATE && v.QUICK_CREATE && v.DETAIL ? 'PASS' : 'FAIL', `QA MF L1 views: CREATE ${sec('CREATE')} section(s), QUICK_CREATE ${sec('QUICK_CREATE')}, DETAIL ${sec('DETAIL')}`);
});
await step('G14', async () => {
  const L = (await lays()).find(x => x.name === 'QA MF L1'); await builder(L.id);
  await page.locator('button.mf-tab', { hasText: 'QUICK CREATE' }).first().click(); await sleep(1200);
  const ns = page.getByText('NEW SECTION', { exact: true }); const n = await ns.count(); let msg = '';
  if (n) { await ns.last().click().catch(() => { }); await sleep(800); }
  const t = await txt(); msg = t.includes('Quick Create supports only 1 section');
  const disabled = n ? await ns.first().evaluate(e => !!(e.closest('button') && e.closest('button').disabled)) : null;
  rec('G14', msg || disabled ? 'PASS' : 'FAIL', `Quick Create: "Quick Create supports only 1 section" shown=${msg}; NEW SECTION disabled=${disabled}`);
});
await step('G15', async () => {
  await page.getByRole('button', { name: /^Preview$/ }).first().click().catch(async () => page.getByText('Preview', { exact: true }).first().click()); await sleep(1500);
  const d = (await txt()).replace(/s+/g, ' '); const ok = /Preview as/.test(d) && /Quick Create/.test(d) && /Detail View/.test(d);
  rec('G15', ok ? 'PASS' : 'FAIL', `Preview opened with "Preview as" Create / Quick Create / Detail View: ${ok}`, ok ? {} : { shot: await shot('G15-preview') });
  await page.keyboard.press('Escape'); await sleep(500); const cl = page.locator('[role=dialog] button[aria-label*="lose"]'); if (await cl.count()) await cl.first().click().catch(() => { });
});
await step('G22', async () => {
  { const L = (await lays()).find(x => x.name === 'QA MF L1'); await builder(L.id); }
  const ns = page.getByText('NEW SECTION', { exact: true }); await ns.last().click(); await sleep(1000);
  await page.getByRole('button', { name: 'Back to module' }).click(); await sleep(1200);
  const d = await dlgText(); const ok = d.includes('You have not saved your changes.') && /Stay Here/.test(d);
  await page.getByRole('button', { name: 'Stay Here' }).click().catch(() => { }); await sleep(600);
  rec('G22', ok ? 'PASS' : 'FAIL', `Back with unsaved change → "${d.slice(0, 140)}"; Stay Here keeps the editor (url ${page.url().includes('/layouts/') ? 'still builder' : 'left builder'})`);
});
await step('G23', async () => {
  await page.getByRole('button', { name: 'Reset' }).click(); await sleep(1000);
  const d = await dlgText(); const ok = d.includes('Reset all changes?');
  await page.getByRole('button', { name: /Yes, Reset/ }).click().catch(() => { }); await sleep(1500);
  const secs = await page.getByRole('button', { name: 'Section settings' }).count();
  rec('G23', ok ? 'PASS' : 'FAIL', `Reset dialog "${d.slice(0, 120)}"; after Yes, Reset section count in canvas = ${secs}`);
});
await step('G30', async () => {
  { const L = (await lays()).find(x => x.name === 'QA MF L1'); await builder(L.id); }
  await page.getByRole('button', { name: 'Help' }).click(); await sleep(1000);
  const t1 = await txt(); const sb = page.getByPlaceholder('Search help…'); let msg = false;
  if (await sb.count()) { await sb.fill('zzqqxx'); await sleep(700); msg = (await txt()).includes('No articles match your search.'); }
  rec('G30', /Getting started with Layout Builder/.test(t1) && msg ? 'PASS' : 'FAIL', `Help drawer lists articles: ${/Getting started with Layout Builder/.test(t1)}; keyboard shortcuts listed: ${/Keyboard Shortcuts/.test(t1)}; no-match text: ${msg}`);
  await page.keyboard.press('Escape'); await sleep(500);
});
await step('G24', async () => {
  { const L = (await lays()).find(x => x.name === 'QA MF L1'); await builder(L.id); }
  const before = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.getByText('NEW SECTION', { exact: true }).last().click(); await sleep(800);
  const added = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.locator('body').click({ position: { x: 700, y: 140 } }).catch(() => { });
  await page.keyboard.press('Control+z'); await sleep(800); const undone = await page.getByRole('button', { name: 'Section settings' }).count();
  await page.keyboard.press('Control+y'); await sleep(800); const redone = await page.getByRole('button', { name: 'Section settings' }).count();
  rec('G24', added === before + 1 && undone === before && redone === before + 1 ? 'PASS' : 'FAIL', `sections: before ${before}, after NEW SECTION ${added}, after Ctrl+Z ${undone}, after Ctrl+Y ${redone}`);
  await page.getByRole('button', { name: 'Reset' }).click().catch(() => { }); await sleep(600); await page.getByRole('button', { name: /Yes, Reset/ }).click().catch(() => { }); await sleep(800);
});
await step('G28', async () => {
  await go(`/settings/modules-and-fields/${M.contacts}/layouts/${'00000000-0000-0000-0000-000000000000'}`, 3000);
  const cl = arr((await api('GET', `/modules/${M.contacts}/layouts`)).j.data)[0];
  await go(`/settings/modules-and-fields/${M.contacts}/layouts/${cl.id}`, 9000);
  const t = await txt(); const banner = (t.match(/This module is used by[^\n]*/) || [''])[0];
  rec('G28', banner ? 'PASS' : 'INFO', banner ? `Contacts builder banner: "${banner.slice(0, 200)}" (save-time dialog not triggered — that needs a field change on a standard module)` : 'no integration banner on the Contacts builder (CRM ⇄ Desk integration may be off)');
});
page.off('request', onW);
return done();
