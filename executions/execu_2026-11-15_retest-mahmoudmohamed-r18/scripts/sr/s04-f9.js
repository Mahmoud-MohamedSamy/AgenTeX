const out = {};
const rl = await listRules(); const ie = rl.find(x => x.name === P + 'I6 isEmpty company'); const g = await getRule(ie.id); out.isEmptyStored = JSON.stringify(g.j.data.entries);
const ld = await mkRec({ last_name: P + 'I6 empty co' }); out.emptyCoScore = await score(ld.id);
// F9
let r = await mkRule({ name: P + 'F9 audit', entries: [ent('lead_source', 'eq', 'web', 15)] }); const id = r.j.data.id; const v = r.j.data;
const p = await api('PUT', '/scoring-rules/' + id, { name: v.name, is_active: true, row_version: v.row_version, entries: v.entries.map(e => ({ id: e.id, field_key: e.field_key, operator: e.operator, value: e.value, points: 20 })) }); out.put = SR(p);
const a = await api('PATCH', '/scoring-rules/' + id + '/active', { is_active: false }); out.deact = SR(a);
await sleep(3000);
const ev = arr((await api('GET', '/audit/events?entity_type=scoring_rule&per_page=20')).j.data);
out.events = ev.filter(e => JSON.stringify(e).includes(id) || JSON.stringify(e).includes('F9 audit')).map(e => JSON.stringify(e).slice(0, 1500));
I.f9 = id; SAVE();
return out;
