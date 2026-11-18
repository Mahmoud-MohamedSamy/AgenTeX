const o = { t0: new Date().toISOString() }; const id = r => r.j && r.j.data && r.j.data.id;
const runSt = async () => { const r = await api('GET', '/scoring-rules/run?module_id=' + L); const d = r.j && r.j.data; return d ? [d.status, d.reason, d.processed_count + '/' + d.total_count, 'chg ' + d.changed_count, d.created_at].join(' ') : SR(r); };
const crit = { kind: 'Comparison', field: 'company', operator: 'Equal', value: { kind: 'string', stringValue: 'QA RT21 SC wf' } };
const b = { moduleId: L, appKey: 'crm', name: P + 'WF score reaches 40', description: 'QA RT21 lane SC F14', trigger: { kind: 'RecordScoreChanged', scoreChange: 'increased', scoreThreshold: 40 }, criteria: crit, mode: 'Recurring', actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { title: { kind: 'string', stringValue: 'QA RT21 SC WF hit' } } }], conditions: [], isActive: true };
let r = await api('POST', '/workflow/rules', b); o.wf = SR(r).slice(0, 200); const wid = id(r); if (!wid) return o; I.wf = wid; SAVE(); LED('workflow rule "' + b.name + '" ' + wid + ' (Leads, active during test)');
const G = await mkRec({ last_name: P + 'G wf', company: 'QA RT21 SC wf' }); I.G = G.id; SAVE(); await sleep(5000);
let v = await recVals(G.id); o.G0 = [v.score, v.title];
r = await mkRule({ name: P + 'R2 wf run', entries: [ent('company', 'eq', 'QA RT21 SC wf', 50)], update_existing_records: true }); I.R2 = id(r); SAVE(); o.R2 = SR(r); o.R2at = new Date().toISOString();
for (let i = 0; i < 12; i++) { await sleep(10000); const s = await runSt(); o['p' + i] = (await score(G.id)) + ' | ' + s; if (/completed/.test(s) && /rule_saved/.test(s) && s.includes(o.R2at.slice(0, 13)) && i > 0) break; }
await sleep(30000); v = await recVals(G.id); o.G_afterRun = [v.score, v.title] + ' (title "QA RT21 SC WF hit" = workflow ran on background rescore)'; o.tAfter = new Date().toISOString();
// control: does the workflow fire on a normal save crossing 40? drop below then save back
return o;
