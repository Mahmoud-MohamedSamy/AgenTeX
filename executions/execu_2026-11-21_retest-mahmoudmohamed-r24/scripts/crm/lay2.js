const L='841043e1-c078-41f9-8d6e-dfd61bee45c3',LAY='6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const r=await api('GET','/modules/'+L+'/layouts/'+LAY);const s=JSON.stringify(r.j?.data||{});log(s.slice(0,200));log([...new Set(s.match(/"[a-z_]*(?:field|key)[a-z_]*":"[^"]{1,40}"/gi)||[])].slice(0,80).join(' '));
