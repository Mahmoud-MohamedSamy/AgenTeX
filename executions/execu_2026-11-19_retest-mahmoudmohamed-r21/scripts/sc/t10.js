const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
const runSt = async () => { const r = await api('GET', '/scoring-rules/run?module_id=' + L); const d = r.j && r.j.data; return d ? [d.status, d.reason, d.processed_count + '/' + d.total_count, 'chg ' + d.changed_count, d.created_at.slice(11, 19)].join(' ') : SR(r); };
o.run0 = await runSt();
let r = await mkRule({ name: P + 'R7 off-del', entries: [ent('company', 'eq', 'QA RT20 SC old2', 3)] }); I.R7 = id(r); SAVE(); await sleep(3000);
o.run_afterCreate = await runSt(); o.F_noSave = await score(I.F);
await updRec(I.F, { title: 'QA RT20 SC t7' }); o.F_saved = await score(I.F) + ' (exp 8)';
r = await api('PATCH', '/scoring-rules/' + I.R7 + '/active', { is_active: false }); o.off = SR(r); LED('scoring rule R7 ' + I.R7 + ' deactivated');
for (let i = 0; i < 8; i++) { await sleep(10000); o['off_' + i] = (await score(I.F)) + ' | ' + await runSt(); if (o['off_' + i].startsWith('5') && /completed/.test(o['off_' + i])) break; }
r = await api('PATCH', '/scoring-rules/' + I.R7 + '/active', { is_active: true }); await sleep(2000);
for (let i = 0; i < 8; i++) { await sleep(10000); o['on_' + i] = (await score(I.F)) + ' | ' + await runSt(); if (o['on_' + i].startsWith('8') && /completed/.test(o['on_' + i])) break; }
await updRec(I.F, { title: 'QA RT20 SC t8' }); o.F_on_saved = await score(I.F);
r = await api('DELETE', '/scoring-rules/' + I.R7); o.del = SR(r); LED('scoring rule R7 ' + I.R7 + ' deleted (delete-effect test)');
for (let i = 0; i < 8; i++) { await sleep(10000); o['del_' + i] = (await score(I.F)) + ' | ' + await runSt(); if (o['del_' + i].startsWith('5') && /completed/.test(o['del_' + i])) break; }
return o;
