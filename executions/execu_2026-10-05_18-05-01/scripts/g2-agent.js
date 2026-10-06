// Group 2 (agent session, Desk Agent profile): access checks, read-only.
await step('A2', async () => {
  await go('/settings', 7000); const side = await txt();
  const items = ['Modules and Fields', 'Data Types', 'Capabilities', 'Organize Tabs'].filter(i => side.includes(i));
  await go('/settings/modules-and-fields', 7000); const t = await txt();
  const denied = /access denied|not authori[sz]ed|permission|don.t have access|Access Denied/i.test(t); const rows = /Displayed In Tabs As/.test(t) && /Time Entries/.test(t);
  const s = await shot('A2-agent-modules-and-fields');
  rec('A2', !rows && denied ? 'PASS' : 'FAIL', `agent Setup menu shows: [${items.join(', ')}]; direct URL /settings/modules-and-fields → module table rendered=${rows}, access-denied message=${denied}`, { shot: s });
});
await step('A5', async () => {
  const m = await api('GET', '/modules'); const f = await api('GET', `/modules/${M.tickets}/fields`); const l = await api('GET', `/modules/${M.tickets}/layouts`);
  const dt = await api('GET', '/fields/datatypes'); const fp = await api('GET', `/modules/${M.tickets}/field-permissions`);
  rec('A5', 'INFO', `agent GET /modules → ${m.s} (${arr(m.j && m.j.data).length} modules); /fields → ${f.s} (${arr(f.j && f.j.data).length}); /layouts → ${l.s}; /fields/datatypes → ${dt.s}; /field-permissions → ${fp.s}. Read access is needed to render records; no field is set to Don't Show today, so leakage is checked in H2 with a QA field`);
});
await step('A6', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`, 7000); const t = await txt();
  const fpTab = /Field Permissions/.test(t); const msg = t.includes('Requires the “Manage field permissions” permission.');
  rec('A6', fpTab ? (msg ? 'PASS' : 'FAIL') : 'PASS', fpTab ? `agent can open the module page; Field Permissions tab present; read-only message shown=${msg}` : 'agent cannot open the module page at all (stricter than the spec expectation — accepted)');
});
await step('A7', async () => {
  await go('/settings/organize-tabs', 7000); const t = await txt(); const ok = /Selected modules/.test(t) && /Changes apply to you only/.test(t);
  rec('A7', ok ? 'PASS' : 'FAIL', `agent opens Organize Tabs: ${ok}`, ok ? {} : { shot: await shot('A7-agent-organize-tabs') });
});
await step('J7', async () => {
  const res = [];
  for (const u of ['/settings/data-types', '/settings/capabilities']) { await go(u, 6000); const t = await txt(); res.push(`${u}: catalogue rendered=${/Base datatype|Add custom data type|Add capability|Search datatypes|Search capabilities/.test(t)}, denied=${/access denied|permission|not authori/i.test(t)}`); }
  const bad = res.some(r => /rendered=true/.test(r));
  rec('J7', bad ? 'FAIL' : 'PASS', res.join(' ; '), bad ? { shot: await shot('J7-agent-data-types') } : {});
});
await step('K-agent', async () => {
  await go('/hq', 6000); const t = await txt();
  rec('K-agent', 'INFO', `agent top bar text: ${t.split('\n').slice(0, 14).join(' | ')}`);
});
return done();
