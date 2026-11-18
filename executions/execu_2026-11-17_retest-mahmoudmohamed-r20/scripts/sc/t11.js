const o = {};
const runSt = async () => { const r = await api('GET', '/scoring-rules/run?module_id=' + L); const d = r.j && r.j.data; return d ? [d.status, d.reason, d.processed_count + '/' + d.total_count, 'chg ' + d.changed_count, d.created_at.slice(11, 19)].join(' ') : SR(r); };
const put = async (pts, flag) => { const g = (await getRule(I.R1)).j.data; const e2 = g.entries.map(e => ({ field_key: e.field_key, operator: e.operator, value: e.value, points: e.field_key === 'company' ? pts : e.points })); return api('PUT', '/scoring-rules/' + I.R1, { name: g.name, description: g.description, module_id: L, is_active: true, entries: e2, row_version: g.row_version, ...(flag ? { update_existing_records: true } : {}) }); };
o.A0 = await score(I.A); o.run0 = await runSt();
let r = await put(25, false); o.put1 = SR(r); LED('scoring rule R1 ' + I.R1 + ' company points 30->25 (no update flag)');
for (let i = 0; i < 6; i++) { await sleep(10000); o['p1_' + i] = (await score(I.A)) + ' | ' + await runSt(); }
r = await put(26, true); o.put2 = SR(r); LED('scoring rule R1 ' + I.R1 + ' company points 25->26 (update_existing_records)');
for (let i = 0; i < 8; i++) { await sleep(10000); o['p2_' + i] = (await score(I.A)) + ' | ' + await runSt(); if (/completed/.test(o['p2_' + i]) && i > 0) break; }
o.manualRun = SR(await api('POST', '/scoring-rules/run', { module_id: L })).slice(0, 200) + ' (API manual run probe; not used further)';
return o;
