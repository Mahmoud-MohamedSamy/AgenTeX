const L='841043e1-c078-41f9-8d6e-dfd61bee45c3',LAY='6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const r=await api('GET','/modules/'+L+'/layouts/'+LAY);const s=JSON.stringify(r.j?.data||{});log(r.s,r.j?.data?.name,[...new Set((s.match(/"(?:field_key|fieldKey|key)":"([a-z0-9_]+)"/g)||[]).map(x=>x.split(':')[1]))].join(' '));
