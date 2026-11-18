const d=await api('GET','/desk/departments?take=100');const L=arr(d.j?.data??d.j);log(d.s, L.map(x=>x.name+'|'+x.id).join('\n'));
const v=await api('GET','/desk/views?take=5');log('views',v.s,v.t.slice(0,1500));
