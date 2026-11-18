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
// old record rescore: N exists, new rule on its company not yet saved
const nBefore = await score(I.N);
let r = await mkRule({ name: P + 'R5 old', entries: [ent('lead_status', 'eq', 'Not Interested', 3)] }); I.R5 = id(r); SAVE(); await sleep(6000);
o.oldRecord_noSave = (await score(I.N)) - nBefore + ' (0 = existing records not rescored)';
// delete effect
const aBefore = await score(I.A);
r = await api('DELETE', '/scoring-rules/' + I.R5); o.delR5 = r.s; LED('deleted scoring rule R5 ' + I.R5); await sleep(5000);
o.afterDelete_noSave_N = (await score(I.N)) - nBefore + ' (still 0, N never got R5)';
r = await api('DELETE', '/scoring-rules/' + I.R2); o.delR2 = r.s; LED('deleted scoring rule R2 ' + I.R2); await sleep(5000);
o.afterDeleteR2_noSave_A = (await score(I.A)) - aBefore + ' (0 = deleted points kept until save; -20 = removed)';
await updRec(I.A, { title: 'QA RT20 SC t6' }); o.afterDeleteR2_save_A = (await score(I.A)) - aBefore + ' (exp -20)';
// records query filter + sort
const q = await api('POST', '/modules/' + L + '/records/query', { filter: { kind: 'And', children: [{ kind: 'StartsWith', field: 'last_name', value: 'QA RT20 SC' }, { kind: 'GreaterThanOrEqual', field: 'score', value: 10 }] }, sort: [{ field: 'score', direction: 'desc' }], limit: 50 });
o.query = q.s + ' ' + (q.s < 300 ? JSON.stringify(arr(q.j.data).map(x => { const d = x.data || []; const g = k => { const e = d.find(y => y.field === k); return e && e.value && e.value.value; }; return [g('last_name'), g('score')]; })) : q.t.slice(0, 300));
const q2 = await api('POST', '/modules/' + L + '/records/query', { filter: { kind: 'StartsWith', field: 'last_name', value: 'QA RT20 SC' }, sort: [{ field: 'score', direction: 'asc' }], limit: 50 });
o.queryAsc = q2.s + ' ' + (q2.s < 300 ? JSON.stringify(arr(q2.j.data).map(x => { const d = x.data || []; const e = d.find(y => y.field === 'score'); return e && e.value && e.value.value; })) : q2.t.slice(0, 300));
// all leads scores now
for (const k of ['A', 'C', 'N', 'D']) o['score_' + k] = await score(I[k]);
// contacts / deals have score field
for (const [nm, mid] of [['contacts', '6f553963-01d6-4b68-9fb3-143d23044c41'], ['deals', 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'], ['accounts', 'b2398920-2914-4836-be53-81bd960effea']]) { const fl = await fieldsOf(mid); const s = fl.find(x => x.fieldName === 'score'); const rl = await api('GET', '/scoring-rules?module_id=' + mid); o['mod_' + nm] = (s ? 'score field ' + s.datatypeKey : 'no score field') + '; rules list ' + rl.s + ' n=' + arr(rl.j && rl.j.data).length; }
return o;
