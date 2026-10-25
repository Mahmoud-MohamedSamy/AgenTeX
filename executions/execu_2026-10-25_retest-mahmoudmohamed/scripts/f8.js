const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', F = '4d61be96-a89a-4567-adaa-8666ad25dbbe', V = 'e7e994ff-5cc6-4621-acf4-25860ef2a532', VC = 'bd7ca478-9fb5-4fa5-b038-e9ec89617cb6';
const v = (await api('GET', `/modules/${L}/views/${V}`)).j.data;
const body = { name: v.name, kind: v.kind, visibility: v.visibility, layout_id: v.layout_id, settings: { ...v.settings, criteria: { conditions: [{ field: 'first_name', operator: 'contains', value: 'QA RT' }] } } };
let up = await api('PUT', `/modules/${L}/views/${V}`, body); if (up.s >= 400) up = await api('PATCH', `/modules/${L}/views/${V}`, body);
const out = { update: up.s + ' ' + (up.s >= 300 ? up.t.slice(0, 200) : '') };
const del = await api('DELETE', `/modules/${L}/fields/${F}`); out.apiDelete = del.s + ' ' + del.t.slice(0, 200);
const vc = await api('GET', `/modules/${L}/views/${VC}`); out.colView = vc.s + ' cols=' + JSON.stringify(vc.j?.data?.settings?.columns) + ' unavailable=' + JSON.stringify(vc.j?.data?.settings?.unavailable_fields || null);
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_temp_num'); out.fieldAfter = f ? f.status || 'present' : 'gone';
return done(out);
