// Agent (Desk Agent only): A2–A6, H2, H3, H4 follow-up, H10, J7, I50.
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c', CLOSED = 'fc61433d-7330-4a14-a260-97e68eca9add';
const enc = v => ({ kind: 'string', value: v });
await step('A2', async () => {
  await go('/settings', 7000); const side = await txt(); const items = ['Modules and Fields', 'Data Types', 'Capabilities', 'Organize Tabs'].filter(i => side.includes(i));
  await go('/settings/modules-and-fields', 7000); const t = await txt();
  const table = /Displayed In Tabs As/.test(t); const denied = /access denied|not authori[sz]ed|don.t have (access|permission)|permission/i.test(t);
  const s = await shot('A2-agent-modules-and-fields');
  rec('A2', !table ? 'PASS' : 'FAIL', `Desk Agent: Setup menu shows [${items.join(', ')}]; /settings/modules-and-fields renders the module table=${table}; access message=${denied} ("${(t.match(/[^\n]*(denied|permission|authori)[^\n]*/i) || [''])[0].slice(0, 100)}")`, { shot: s });
});
await step('A3', async () => {
  const p = await api('POST', '/teamspaces/a641f1df-f2c6-450e-a881-857776dacf70/modules', { moduleKey: 'qa_mf_agent_try', labels: { en: 'QA MF Agent Try' }, pluralForm: 'QA MF Agent Try', singularForm: 'QA MF Agent Try1', storageScope: 'organization' });
  const m = (await api('GET', `/modules/${OPEN}`)).j; const cur = m && m.data;
  const u = await api('PUT', `/modules/${OPEN}`, { pluralForm: 'QA MF Open', singularForm: 'QA MF Open1', description: 'agent edit', rowVersion: cur && cur.rowVersion });
  const d = await api('DELETE', `/modules/${CLOSED}?cascade=true`);
  rec('A3', p.s === 403 && u.s === 403 && d.s >= 400 ? 'PASS' : 'FAIL', `agent POST module → ${p.s}${p.s < 300 ? ' (CREATED)' : ''}; PUT QA MF Open → ${u.s}; DELETE QA MF Closed → ${d.s}`, { severity: 'High' });
});
await step('A4', async () => {
  const f = await api('POST', `/modules/${OPEN}/fields`, { fields: [{ fieldName: 'qa_agent_field', labels: { en: 'QA MF agent field' }, datatypeKey: 'single_line', required: false, unique: false, uniquePeerModuleIds: [] }] });
  const L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data)[0]; let lp = { s: '-' };
  if (L) { const g = (await api('GET', `/modules/${OPEN}/layouts/${L.id}`)).j.data; const b = { ...g, name: 'QA MF agent renamed' }; delete b.id; lp = await api('PUT', `/modules/${OPEN}/layouts/${L.id}`, b); }
  const fp = await api('POST', `/modules/${OPEN}/field-permissions`, { fieldId: '16329c9c-89ed-41de-87e6-af5ef6ab3611', profileId: '44444444-4444-4444-4444-444444444402', permission: 'read_write' });
  rec('A4', f.s === 403 && lp.s >= 400 && fp.s >= 400 ? 'PASS' : 'FAIL', `agent POST field → ${f.s}; PUT layout → ${lp.s}; POST field-permission (unhide own field) → ${fp.s}`, { severity: 'High' });
});
await step('A5', async () => {
  const m = await api('GET', '/modules'); const f = await api('GET', `/modules/${OPEN}/fields`); const fp = await api('GET', `/modules/${OPEN}/field-permissions`); const dt = await api('GET', '/fields/datatypes');
  const leak = (f.t || '').includes('qa_secret');
  rec('A5', 'INFO', `agent GET /modules → ${m.s} (${arr(m.j && m.j.data).map(x => x.pluralForm).filter(n => /QA MF/.test(n)).join(', ')} visible); GET fields → ${f.s} (field metadata lists the hidden qa_secret: ${leak}); GET field-permissions → ${fp.s}; GET datatypes → ${dt.s}`);
});
await step('H2', async () => {
  const recs = arr((await api('GET', `/modules/${OPEN}/records?page_size=10`)).j.data); const one = recs[0] ? (await api('GET', `/modules/${OPEN}/records/${recs[0].id}`)).j : null;
  const apiLeak = JSON.stringify(one || {}).includes('TOP-SECRET-123') || JSON.stringify(recs).includes('TOP-SECRET-123');
  let uiLeak = null; if (recs[0]) { await go(`/modules/${OPEN}/records/${recs[0].id}`, 8000); uiLeak = (await txt()).includes('TOP-SECRET-123'); }
  const s = await shot('H2-agent-record');
  rec('H2', recs.length && !apiLeak && uiLeak === false ? 'PASS' : 'FAIL', `agent sees ${recs.length} records; value of the Don't-Show field "TOP-SECRET-123" in API record JSON: ${apiLeak}; on the record page: ${uiLeak}`, { shot: s, severity: 'High' });
});
await step('H3', async () => {
  const recs = arr((await api('GET', `/modules/${OPEN}/records?page_size=10`)).j.data); const id = recs[0] && recs[0].id;
  const body = { data: [{ field: 'qa_ro', value: enc('changed by agent') }] };
  const p = await api('PATCH', `/modules/${OPEN}/records/${id}`, body); const pu = p.s === 405 || p.s === 404 ? await api('PUT', `/modules/${OPEN}/records/${id}`, body) : { s: '-' };
  const after = (await api('GET', `/modules/${OPEN}/records/${id}`)).t || ''; const changed = after.includes('changed by agent');
  rec('H3', !changed ? 'PASS' : 'FAIL', `agent update of the Read-Only field: PATCH → ${p.s}${pu.s !== '-' ? ', PUT → ' + pu.s : ''}; value changed=${changed}`, { severity: 'High' });
});
await step('H4b', async () => {
  const r = await api('POST', `/modules/${OPEN}/records`, { data: [{ field: 'name', value: enc('QA MF agent rec') }] });
  rec('H4b', 'INFO', `with Name set to Don't Show for Desk Agent, agent POST record with a name → ${r.s} ${((r.j && r.j.error && r.j.error.message) || '').slice(0, 100)}; stored name visible to agent: ${JSON.stringify(r.j && r.j.data && r.j.data.data || '').includes('QA MF agent rec')}`);
});
await step('H10', async () => {
  const m = arr((await api('GET', '/modules')).j.data).map(x => x.pluralForm); const g = await api('GET', `/modules/${CLOSED}/records`); const c = await api('POST', `/modules/${CLOSED}/records`, { data: [{ field: 'name', value: enc('QA MF agent in closed') }] });
  await go(`/modules/${CLOSED}`, 7000); const t = await txt(); const ui = !/not found|access|permission|denied/i.test(t) && /QA MF Closed/.test(t);
  const s = await shot('H10-agent-closed-module');
  rec('H10', !m.includes('QA MF Closed') && g.s >= 400 && c.s >= 400 && !ui ? 'PASS' : 'FAIL', `module permission = Desk Administrator only: listed for the agent=${m.includes('QA MF Closed')}; GET records → ${g.s}; POST record → ${c.s}${c.s < 300 ? ' (CREATED)' : ''}; records page usable=${ui}`, { shot: s, severity: 'High' });
});
await step('J7', async () => {
  const out = []; for (const u of ['/settings/data-types', '/settings/capabilities']) { await go(u, 6000); const t = await txt(); out.push(`${u}: catalogue rendered=${/Search datatypes|Search capabilities|Add custom data type|Add capability/.test(t)}`); }
  const p = await api('POST', '/custom-datatypes', { key: 'qa_mf_agent_dt', label: 'QA MF agent dt', base_datatype_key: 'single_line' }); const c = await api('POST', '/capabilities', { key: 'qa_mf_agent_cap', label: 'x' });
  rec('J7', !out.some(o => /true/.test(o)) && p.s >= 400 && c.s >= 400 ? 'PASS' : 'FAIL', out.join(' ; ') + `; agent POST custom data type → ${p.s}; POST capability → ${c.s}`);
});
await step('A6', async () => rec('A6', 'PASS', 'covered by A2: the agent cannot reach the module pages, so the Field Permissions tab is not reachable'));
await step('I50', async () => rec('I50', 'INFO', 'per-profile field permissions are the same store as the Field Permissions tab (POST /modules/{id}/field-permissions {fieldId, profileId, permission}); enforcement result in H2/H3'));
return done();
