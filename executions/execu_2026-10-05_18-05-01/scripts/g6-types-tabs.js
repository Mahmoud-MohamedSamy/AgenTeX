// Group 6 — J-write (custom data type, capability) and K-write (own tab arrangement, reset at the end).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets'); const MID = QA.id;
await step('J3', async () => {
  const ex = arr((await api('GET', '/custom-datatypes')).j.data)[0];
  const r = await api('POST', '/custom-datatypes', { key: 'qa_mf_code', label: 'QA MF Code', description: 'QA MF — safe to delete', base_datatype_key: 'single_line', icon: 'bug' });
  const list = arr((await api('GET', '/custom-datatypes')).j.data).map(x => x.key);
  const DEF = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).find(x => x.isDefault);
  await go(`/settings/modules-and-fields/${MID}/layouts/${DEF.id}`, 10000); const inPal = await page.locator('[title="Drag or click to add QA MF Code"], [aria-label="Drag or click to add QA MF Code"]').count();
  rec('J3', r.s < 300 && list.includes('qa_mf_code') && inPal > 0 ? 'PASS' : 'FAIL', `POST custom data type (shape of existing "${ex && ex.key}") → ${r.s} ${r.s >= 300 ? r.t.slice(0, 120) : ''}; listed=${list.includes('qa_mf_code')}; in the builder palette of QA MF Devices=${inPal > 0}`);
});
await step('J4', async () => {
  const f = await api('POST', `/modules/${MID}/fields`, { fields: [{ fieldName: 'qa_code', labels: { en: 'QA MF Code field' }, datatypeKey: 'qa_mf_code', required: false, unique: false, uniquePeerModuleIds: [] }] });
  const d = await api('DELETE', '/custom-datatypes/qa_mf_code');
  const still = arr((await api('GET', '/custom-datatypes')).j.data).some(x => x.key === 'qa_mf_code');
  const fld = arr((await api('GET', `/modules/${MID}/fields`)).j.data).find(x => x.fieldName === 'qa_code');
  rec('J4', (d.s >= 400 && still) || (!still && fld) ? 'PASS' : 'FAIL', `field of type qa_mf_code → ${f.s}; DELETE the data type while in use → ${d.s} ${((d.j && d.j.error && d.j.error.message) || '').slice(0, 100)}; type still listed=${still}; field still present=${!!fld} (type ${fld && fld.datatypeKey})`);
});
await step('J6', async () => {
  const caps = arr((await api('GET', '/capabilities')).j.data); const ex = caps[0] || {};
  const body = { key: 'qa_mf_cap', label: 'QA MF capability', description: 'QA MF — safe to delete', default_value: false, defaultValue: false };
  const r = await api('POST', '/capabilities', body); const has = arr((await api('GET', '/capabilities')).j.data).some(x => (x.key || x.capability_key) === 'qa_mf_cap');
  const sys = caps.find(x => x.is_system || x.isSystem); const ds = sys ? await api('DELETE', `/capabilities/${encodeURIComponent(sys.key || sys.capability_key)}`) : { s: '-' };
  const d = await api('DELETE', '/capabilities/qa_mf_cap'); const gone = !arr((await api('GET', '/capabilities')).j.data).some(x => (x.key || x.capability_key) === 'qa_mf_cap');
  rec('J6', r.s < 300 && has && gone && (ds.s === '-' || ds.s >= 400) ? 'PASS' : 'FAIL', `capabilities before: ${caps.length} (keys of first: ${Object.keys(ex).join(',')}); POST qa_mf_cap → ${r.s} ${r.s >= 300 ? r.t.slice(0, 100) : ''}; listed=${has}; DELETE a system capability "${sys && (sys.key || sys.capability_key)}" → ${ds.s}; DELETE qa_mf_cap → ${d.s}, gone=${gone}`);
});
await step('J8', async () => {
  const a = await api('POST', '/custom-datatypes', { key: 'qa_mf_html', label: 'QA MF <img src=x onerror=alert(1)>', description: '', base_datatype_key: 'single_line', icon: 'bug' });
  const b = await api('POST', '/custom-datatypes', { key: '', label: 'QA MF empty key', base_datatype_key: 'single_line' });
  const c = await api('POST', '/custom-datatypes', { key: 'qa_mf_html', label: 'dup', base_datatype_key: 'single_line' });
  await go('/settings/data-types', 6000); const imgs = await page.locator('img[src="x"]').count();
  await api('DELETE', '/custom-datatypes/qa_mf_html');
  rec('J8', imgs === 0 && b.s >= 400 && c.s >= 400 ? 'PASS' : 'FAIL', `html label → ${a.s}, rendered as element=${imgs > 0}; empty key → ${b.s}; duplicate key → ${c.s}`);
});
// ---- K: my own tab arrangement
const pref = async () => { const r = await api('GET', '/settings/resolved?app_key=general&key=general.user.desk.nav_tabs&scope_type=User'); return r.j && r.j.data && r.j.data.value_json; };
const ot = async () => { await go('/settings/organize-tabs', 6000); };
await step('K2', async () => {
  await ot(); await page.getByRole('button', { name: 'Hide Social' }).click(); await sleep(1500);
  const p = await pref(); await go('/hq', 5000); const bar = await page.locator('nav, header').first().innerText().catch(() => '');
  const unsel = (await (async () => { await ot(); return (await txt()).split('Unselected modules')[1] || ''; })());
  rec('K2', /"hidden": ?\["?[^\]]*social/i.test(p) && /Social/.test(unsel) ? 'PASS' : 'FAIL', `after Hide Social: saved setting ${p}; Social listed under Unselected=${/Social/.test(unsel)}`);
});
await step('K3', async () => {
  await ot(); await page.getByRole('button', { name: 'Move Contracts up' }).click(); await sleep(1500); const p = await pref();
  await page.reload(); await sleep(5000); const sel = (await txt()).split('Selected modules')[1] || ''; const order = ['Community', 'Contracts', 'Chat'].map(x => sel.indexOf(x));
  rec('K3', /order/.test(p) && order[1] > -1 ? 'PASS' : 'FAIL', `"Move Contracts up" saved ${p}; after reload Contracts position vs neighbours ${JSON.stringify(order)}`);
});
await step('K4', async () => {
  await ot(); const hideT = await page.getByRole('button', { name: 'Hide Tickets' }).count(); const lock = await page.locator('[title="Always shown"], [aria-label*="Always shown"]').count();
  rec('K4', hideT === 0 || lock > 0 ? 'PASS' : 'FAIL', `Tickets has a hide button=${hideT > 0}; "Always shown" lock marker=${lock > 0}`);
});
await step('K5', async () => {
  await ot(); let n = 0; for (let i = 0; i < 12; i++) { const b = page.locator('button[aria-label^="Hide "]').first(); if (!(await b.count())) break; await b.click(); await sleep(700); n++; }
  const sel = (await txt()).split('Selected modules')[1].split('Unselected modules')[0];
  await go('/hq', 5000); const t = await txt();
  rec('K5', /Tickets/.test(sel) ? 'PASS' : 'FAIL', `hid ${n} tabs; Selected now: [${sel.replace(/\s+/g, ' ').slice(0, 120)}]; Tickets still selected=${/Tickets/.test(sel)}`);
});
await step('K7', async () => rec('K7', 'PENDING', 'checked from the agent session'));
await step('K8', async () => {
  await ot(); await page.context().setOffline(true); await page.getByRole('button', { name: /^Show / }).first().click().catch(() => { }); await sleep(2500);
  const t = await txt(); await page.context().setOffline(false); await sleep(1500);
  rec('K8', t.includes('Your tab arrangement could not be saved') ? 'PASS' : 'FAIL', `offline save message shown=${t.includes('Your tab arrangement could not be saved')}`);
});
await step('K9', async () => {
  await ot(); const names = await page.locator('button[aria-label^="Move "]').evaluateAll(bs => bs.slice(0, 4).map(b => b.getAttribute('aria-label')));
  rec('K9', names.length > 0 ? 'PASS' : 'FAIL', `reorder buttons have accessible names: ${names.join(', ')}`);
});
await step('K6', async () => {
  await ot(); await page.getByRole('button', { name: 'Reset to default' }).click(); await sleep(2000); const p = await pref();
  const sel = (await txt()).split('Selected modules')[1] || '';
  rec('K6', /"order": ?\[\]/.test(p) && /"hidden": ?\[\]/.test(p) && /Social/.test(sel) ? 'PASS' : 'FAIL', `after Reset to default: setting ${p}; Social back in Selected=${/Social/.test(sel)}`);
});
return done();
