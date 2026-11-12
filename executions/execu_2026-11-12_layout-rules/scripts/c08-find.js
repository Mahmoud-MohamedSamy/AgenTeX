const L = I.mod_leads; const out = {};
for (const id of ['ba43fedc-53bd-4478-bf8b-ad37460955ce', '963f561c-0bb1-4703-a7b2-605d3381f38f', '2de7582f-b1ef-4070-958c-388903ffad15', '2ca6bc00-4cbd-4d73-9f0c-08805e783556', 'b0820d1f-bf72-4699-b121-0c2dbf0458a9', 'c10b2d37-1d12-406a-b7bc-8f9f3480f721']) { const r = await api('GET', '/modules/' + L + '/records/' + id); out[id.slice(0, 8)] = r.s; if (r.s === 200) out[id.slice(0, 8)] += ' ' + SR(await api('DELETE', '/modules/' + L + '/records/' + id)); }
// list newest leads and look at layout fields
const r = await api('GET', '/modules/' + L + '/records?per_page=100&sort=-created_at'); const a = arr(r.j && r.j.data); out.n = a.length; out.keys = a[0] ? Object.keys(a[0]).join(',') : r.t.slice(0, 200);
out.hit = a.filter(x => JSON.stringify(x).includes('3847cbd4')).map(x => x.id);
return out;
