const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
const runSt = async () => { const r = await api('GET', '/scoring-rules/run?module_id=' + L); const d = r.j && r.j.data; return d ? [d.status, d.reason, d.processed_count + '/' + d.total_count, 'chg ' + d.changed_count].join(' ') : SR(r); };
const G2 = await mkRec({ last_name: P + 'G2 wf run', company: 'QA RT20 SC wf', no_of_employees: 50 }); I.G2 = G2.id; SAVE(); await sleep(3000);
o.act = (await api('POST', '/workflow/rules/' + I.wf + '/activate')).s; LED('workflow ' + I.wf + ' re-activated for background-run test');
let v = await recVals(G2.id); o.G2_0 = [v.score, v.title];
let r = await mkRule({ name: P + 'R8 wf run', entries: [ent('company', 'eq', 'QA RT20 SC wf', 50)], update_existing_records: true }); I.R8 = id(r); SAVE(); o.R8 = SR(r);
for (let i = 0; i < 10; i++) { await sleep(10000); const s = await runSt(); o['p' + i] = (await score(G2.id)) + ' | ' + s; if (/completed/.test(s) && i > 0) break; }
await sleep(20000); v = await recVals(G2.id); o.G2_after = [v.score, v.title] + ' (title WF hit = workflow ran on background rescore)';
o.R8off = (await api('PATCH', '/scoring-rules/' + I.R8 + '/active', { is_active: false })).s; LED('scoring rule R8 ' + I.R8 + ' deactivated');
o.deact = (await api('POST', '/workflow/rules/' + I.wf + '/deactivate')).s; LED('workflow ' + I.wf + ' deactivated again');
return o;
