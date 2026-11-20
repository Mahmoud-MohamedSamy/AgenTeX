// ---- r20 lane SC scoring helpers (prepended by srun.sh). APP=crm
const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const LED = m => fs.appendFileSync(RUN + '/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + '  [SC] ' + m + '\n');
const E = r => r && r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + (r.j.error.details ? ' ' + JSON.stringify(r.j.error.details).slice(0, 400) : '')) : '';
const SR = r => r.s + (E(r) ? ' ' + E(r) : '');
const IDS = RUN + '/out/ids-sc.json'; const I = fs.existsSync(IDS) ? JSON.parse(fs.readFileSync(IDS, 'utf8')) : {}; const SAVE = () => fs.writeFileSync(IDS, JSON.stringify(I, null, 1));
const P = 'QA RT20 SC ';
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const enc = v => v === null ? { kind: 'null' } : typeof v === 'number' ? { kind: 'number', value: v } : typeof v === 'boolean' ? { kind: 'boolean', value: v } : Array.isArray(v) ? { kind: 'array', items: v.map(enc) } : { kind: 'string', value: String(v) };
const fieldsOf = async mid => arr((await api('GET', '/modules/' + mid + '/fields')).j.data);
const ent = (field_key, operator, value, points) => ({ field_key, operator, ...(value === undefined ? {} : { value }), points });
const mkRule = async (body, mid = L) => { const r = await api('POST', '/scoring-rules', { module_id: mid, is_active: true, ...body }); const id = r.j && r.j.data && r.j.data.id; if (id) { LED('scoring rule "' + body.name + '" ' + id + ' (' + (mid === L ? 'Leads' : mid) + ')'); (I.rules = I.rules || []).push(id); SAVE(); } return r; };
const getRule = async id => api('GET', '/scoring-rules/' + id);
const listRules = async (mid = L) => arr((await api('GET', '/scoring-rules?module_id=' + mid)).j.data);
const mkRec = async (vals, mid = L) => { const r = await api('POST', '/modules/' + mid + '/records', { data: Object.entries({ first_name: 'QA', last_name: P + 'rec', ...vals }).map(([k, v]) => ({ field: k, value: enc(v) })) }); const id = r.j && r.j.data && r.j.data.id; if (id) { LED('record "' + (vals.last_name || P + 'rec') + '" ' + id + ' (Leads)'); (I.recs = I.recs || []).push(id); SAVE(); } return { s: r.s, id, err: E(r) }; };
const updRec = async (id, vals, mid = L) => { const r = await api('PATCH', '/modules/' + mid + '/records/' + id, { data: Object.entries(vals).map(([k, v]) => ({ field: k, value: enc(v) })) }); return { s: r.s, err: E(r) }; };
const recVals = async (id, mid = L) => { const r = await api('GET', '/modules/' + mid + '/records/' + id); if (!r.j || !r.j.data) return { _s: r.s }; const o = {}; for (const d of r.j.data.data || []) o[d.field] = d.value && (d.value.value !== undefined ? d.value.value : d.value.items ? d.value.items.map(x => x.value) : d.value.kind === 'null' ? null : d.value); return o; };
const score = async (id, mid = L) => { const v = await recVals(id, mid); return v.score === undefined ? null : Number(v.score); };
const mkField = async (name, type, vals, mid = L) => { const r = await api('POST', '/modules/' + mid + '/fields', { fields: [{ fieldName: name, labels: { en: name.toUpperCase().replace(/_/g, ' ') }, datatypeKey: type, datatypeOptions: vals ? { allowed_values: vals } : {}, config: vals ? { allowed_values: vals } : {} }] }); const d = r.j && r.j.data; const id = d && (Array.isArray(d) ? d[0].id : (d.fields ? d.fields[0].id : d.id)); if (id) LED('field ' + name + ' ' + id + ' (Leads)'); return { s: r.s, id, err: E(r), r }; };
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
