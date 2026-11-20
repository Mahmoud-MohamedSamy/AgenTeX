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
const fl = await fieldsOf(L); const pl = fl.find(x => x.fieldName === 'qa_rt18sr_pl'); o.pl = pl && JSON.stringify(pl.datatypeOptions || pl.config).slice(0, 200);
let f = fl.find(x => x.fieldName === 'qa_rt20sc_date');
if (!f) { const m = await mkField('qa_rt20sc_date', 'date'); o.mkField = m.s + ' ' + m.err; }
f = (await fieldsOf(L)).find(x => x.fieldName === 'qa_rt20sc_date'); o.dateField = f && f.datatypeKey; I.dateField = f && f.id; SAVE();
return o;
