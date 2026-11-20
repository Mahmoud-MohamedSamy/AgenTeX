const d=await api('GET','/desk/departments?take=200'); const L=arr(d.j?.data);
log('depts',d.s,L.length, JSON.stringify(L.map(x=>[x.id,x.name,x.is_enabled??x.status]).slice(0,40)));
log('keys', L[0]?Object.keys(L[0]).join(','):d.t.slice(0,300));
const r=await api('GET','/workflow/rules?take=200'); const R=arr(r.j?.data); log('rules',r.s,R.length, JSON.stringify(R.filter(x=>x.isActive).map(x=>[x.id.slice(0,8),x.name,x.departmentIds])));
