const mid = await modId(); const out = {}; const f = x => FP + x;
const body = { controllingFieldId: I.fields[f('type')], dependentFieldId: I.fields[f('tier')], valueMap: { Refund: ['Gold', 'Bronze'], Question: ['Gold', 'Silver', 'Bronze'], Partner: ['Gold', 'Silver', 'Bronze'] } };
const r = await api('POST', '/modules/' + mid + '/dependency-maps', body); out.post = SR(r).slice(0, 500);
if (r.j && r.j.data && r.j.data.id) { I.dm = r.j.data.id; SAVE(); LED('map dependency type->tier ' + r.j.data.id + ' (Leads)'); out.back = JSON.stringify(r.j.data).slice(0, 500); }
return out;
