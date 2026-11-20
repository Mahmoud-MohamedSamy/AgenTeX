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
I.R3 = (await listRules()).find(x => x.name === P + 'R3 emp').id; SAVE();
const tmp = []; const tryRule = async (nm, entries, extra = {}) => { const r = await mkRule({ name: P + 'G ' + nm, is_active: false, entries, ...extra }); if (id(r)) tmp.push(id(r)); return r; };
o.R3stored = JSON.stringify((await getRule(I.R3)).j.data.entries.map(e => [e.operator, e.value, e.points]));
// boundaries of between
const sc = await score(I.C); for (const v of [1, 500, 501, 0]) { await updRec(I.C, { no_of_employees: v }); o['between_' + v] = (await score(I.C)); }
await updRec(I.C, { no_of_employees: 50 });
// gap probes (inactive rules, deleted after)
const dates = (await fieldsOf(L)).filter(x => /date/.test(x.datatypeKey)).map(x => x.fieldName + ':' + x.datatypeKey); const df = (dates.find(x => /date$/.test(x)) || dates[0]).split(':')[0]; o.dateField = df;
for (const [fk, op, v] of [['no_of_employees', 'notBetween', [1, 5]], [df, 'between', ['2026-01-01', '2026-12-31']], [df, 'today', undefined], [df, 'currentMonth', undefined], [df, 'inLastDays', 7], [df, 'eq', '${TODAY}'], ['lead_source', 'contains', 'we'], ['lead_source', 'startsWith', 'we'], ['lead_source', 'in', ['web', 'chat']], ['company', 'startsWith', 'QA'], ['company', 'endsWith', 'co'], ['company', 'notContains', 'x']]) { const x = await tryRule(op + ' ' + fk, [ent(fk, op, v, 1)]); o['op ' + fk + ' ' + op] = SR(x).slice(0, 170); }
let r = await tryRule('layout', [ent('company', 'eq', 'zz', 1)], { layout_id: '563411f4-6c8e-4b98-a91d-c618d88a5138' }); o.layout = SR(r) + ' keys ' + (id(r) ? Object.keys(r.j.data).filter(k => /layout|criteria/.test(k)).join(',') || 'none' : '');
r = await tryRule('criteria', [ent('company', 'eq', 'zz', 1)], { criteria: { field_key: 'lead_source', operator: 'eq', value: 'web' } }); o.criteria = SR(r) + ' keys ' + (id(r) ? Object.keys(r.j.data).filter(k => /criteria/.test(k)).join(',') || 'none' : '');
r = await tryRule('multi', [{ conditions: [{ field_key: 'company', operator: 'eq', value: 'a' }, { field_key: 'city', operator: 'isNotNull' }], pattern: '1 and 2', points: 2 }]); o.multi = SR(r).slice(0, 200);
r = await tryRule('touch', [{ kind: 'touch_point', channel: 'email', event: 'opened', points: 2 }]); o.touch = SR(r).slice(0, 200);
r = await tryRule('activity', [{ kind: 'activity', module: 'calls', event: 'completed', points: 2 }]); o.activity = SR(r).slice(0, 200);
// validation
for (const [nm, ents] of [['', [ent('company', 'eq', 'x', 1)]], ['x'.repeat(121), [ent('company', 'eq', 'x', 1)]], ['pts0', [ent('company', 'eq', 'x', 0)]], ['pts10001', [ent('company', 'eq', 'x', 10001)]], ['ptsm10000', [ent('company', 'eq', 'x', -10000)]], ['pts1.5', [ent('company', 'eq', 'x', 1.5)]], ['noent', []], ['badfield', [ent('nope_zz', 'eq', 'x', 1)]], ['badop', [ent('no_of_employees', 'contains', 'x', 1)]], ['badval', [ent('no_of_employees', 'gte', 'abc', 1)]], ['badpick', [ent('rating', 'eq', 'notavalue', 1)]], ['31', Array.from({ length: 31 }, (_, i) => ent('company', 'eq', 'c' + i, 1))], ['dup', [ent('company', 'eq', 'x', 1), ent('company', 'eq', 'x', 1)]]]) { const x = await api('POST', '/scoring-rules', { module_id: L, is_active: false, name: nm && nm.length < 30 ? P + 'V ' + nm : nm, entries: ents }); if (id(x)) { tmp.push(id(x)); LED('scoring rule (validation) ' + id(x)); } o['V ' + (nm.length > 30 ? 'name121' : nm || 'emptyname')] = SR(x).slice(0, 170); }
r = await api('POST', '/scoring-rules', { module_id: L, is_active: false, name: P + 'V desc', description: 'd'.repeat(501), entries: [ent('company', 'eq', 'x', 1)] }); if (id(r)) tmp.push(id(r)); o['V desc501'] = SR(r).slice(0, 170);
r = await api('POST', '/scoring-rules', { module_id: L, is_active: false, name: '<img src=x onerror=alert(1)> ' + P + 'xss', entries: [ent('company', 'eq', 'x', 1)] }); if (id(r)) { tmp.push(id(r)); } o['V xssname'] = SR(r).slice(0, 120) + (id(r) ? ' stored ' + r.j.data.name.slice(0, 40) : '');
const del = []; for (const t of tmp) del.push((await api('DELETE', '/scoring-rules/' + t)).s); o.tmpDeleted = del.join(','); LED('deleted ' + tmp.length + ' probe/validation scoring rules (G*/V*): ' + del.join(','));
return o;
