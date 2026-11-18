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
