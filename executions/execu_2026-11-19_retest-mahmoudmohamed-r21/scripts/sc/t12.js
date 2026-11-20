const o = {}; const id = r => r.j && r.j.data && r.j.data.id;
const crit = { kind: 'Comparison', field: 'company', operator: 'Equal', value: { kind: 'string', stringValue: 'QA RT20 SC wf' } };
const b = { moduleId: L, appKey: 'crm', name: P + 'WF score reaches 40', description: 'QA RT20 lane SC', trigger: { kind: 'RecordScoreChanged', scoreChange: 'increased', scoreThreshold: 40 }, criteria: crit, mode: 'Recurring', actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { title: { kind: 'string', stringValue: 'QA RT20 SC WF hit' } } }], conditions: [], isActive: true };
let r = await api('POST', '/workflow/rules', b); o.wf = SR(r).slice(0, 300); const wid = id(r); if (wid) { I.wf = wid; SAVE(); LED('workflow rule "' + b.name + '" ' + wid + ' (Leads, active during test)'); }
// workflow condition on score field (criteria Score >= 60) second wf
const b2 = { ...b, name: P + 'WF crit score>=60', trigger: { kind: 'RecordUpdated' }, criteria: { kind: 'Logical', operator: 'And', operands: [crit, { kind: 'Comparison', field: 'score', operator: 'GreaterThanOrEqual', value: { kind: 'int', intValue: 60 } }] }, actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { city: { kind: 'string', stringValue: 'QA RT20 SC hot' } } }] };
r = await api('POST', '/workflow/rules', b2); o.wf2 = SR(r).slice(0, 300); const wid2 = id(r); if (wid2) { I.wf2 = wid2; SAVE(); LED('workflow rule "' + b2.name + '" ' + wid2 + ' (Leads, active during test)'); }
if (!wid) return o;
const G = await mkRec({ last_name: P + 'G wf', company: 'QA RT20 SC wf', no_of_employees: 50 }); I.G = G.id; SAVE(); await sleep(8000);
let v = await recVals(G.id); o.G0 = [v.score, v.title, v.city];
await updRec(G.id, { qa_rt18sr_pl: 'Beta' }); await sleep(20000);
v = await recVals(G.id); o.G1 = [v.score, v.title, v.city] + ' (exp 69, WF hit, QA RT20 SC hot)';
await updRec(G.id, { title: 'manual', city: 'x' }); await sleep(15000); v = await recVals(G.id); o.G2_noNewIncrease = [v.score, v.title, v.city] + ' (title stays manual: no score change)';
await updRec(G.id, { qa_rt18sr_pl: null }); await sleep(12000); await updRec(G.id, { qa_rt18sr_pl: 'Beta' }); await sleep(20000); v = await recVals(G.id); o.G3_again = [v.score, v.title] + ' (WF hit again on second crossing)';
for (const w of [wid, wid2].filter(Boolean)) { const d = await api('PATCH', '/workflow/rules/' + w, { isActive: false }); let s = d.s; if (s >= 300) { const d2 = await api('POST', '/workflow/rules/' + w + '/deactivate'); s += '/' + d2.s; } o['deact_' + w.slice(0, 8)] = s; LED('workflow rule ' + w + ' deactivated (' + s + ')'); }
o.wfState = (await Promise.all([wid, wid2].filter(Boolean).map(async w => { const g = await api('GET', '/workflow/rules/' + w); return g.j && g.j.data && g.j.data.isActive; }))).join(',');
return o;
