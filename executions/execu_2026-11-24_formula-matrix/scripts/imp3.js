const M = made.mod, LID = made.layout; const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === 'accounts').id;
const accs = L((await api('GET', `/modules/${ACC}/records?limit=20&sort_by=created_at&sort_dir=asc`)).j?.data).map(x => ({ id: x.id, v: flat(x.data) })).filter(a => a.v.account_name && !/^QA/i.test(a.v.account_name) && !/[,"]/.test(a.v.account_name));
const a = accs[0]; const res = { account: a && a.v.account_name, accountId: a && a.id };
const NL = String.fromCharCode(10); const fd = new FormData(); fd.append('file', new Blob(['Name,In Lookup' + NL + 'QA FX Matrix - import lookup 2,' + a.v.account_name + NL], { type: 'text/csv' }), 'qa-fx-imp-lookup2.csv');
const up = await api('POST', `/modules/${M}/import`, fd, { form: true }); const sid = up.j?.data?.session_id;
const opts = { skip_empty: true, replace_empty: null, notify_email: false, assign_to_user_id: null, trigger_automation: false, assignment_rule_id: null, manual_approval: false, default_tag_ids: [], duplicate_check_module_ids: [] };
await api('PUT', `/modules/${M}/import/${sid}/mapping`, { mode: 'add', match_field_key: null, layout_id: LID, mapping: [{ header: 'Name', field: 'name' }, { header: 'In Lookup', field: 'in_lookup' }], options: opts });
await api('POST', `/modules/${M}/import/${sid}/validate`); await api('POST', `/modules/${M}/import/${sid}/execute`);
let s; for (let i = 0; i < 30; i++) { await sleep(3000); s = await api('GET', `/modules/${M}/import/${sid}`); if (/completed|failed/.test(s.j?.data?.status || '')) break; }
res.status = s.j?.data?.status; res.created = s.j?.data?.created_count; res.errors = s.j?.data?.errors; led('CRM QA FX Matrix import lookup2 ' + sid);
// does the lookup field search find the QA account by name?
const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(f => f.fieldName === 'in_lookup'); res.lookupOpts = fl?.datatypeOptions;
fs.writeFileSync(RUN + '/out/imp3.json', JSON.stringify(res, null, 1)); log(res);
