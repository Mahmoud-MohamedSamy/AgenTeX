const r = await api('GET','/iam/org-units'); const u = arr(r.j.data).find(x=>x.orgUnitId==='60aeb9ce-e602-4e95-aaef-de3ceba25a3e'); log(JSON.stringify(u));
const ul = await api('GET','/iam/users?per_page=500'); const us = arr(ul.j.data);
const ceo = us.filter(x=>x.orgUnitId==='7972984b-b5cc-034a-bd96-6de61e3937d0'&&x.status==='active'); log('CEO members (iam orgUnitId)', ceo.length, ceo.map(x=>x.displayName).join(', ').slice(0,600));
for (const p of ['/iam/users/7e5e7c27-46e4-4bf6-b021-7bd219d34472/org-units','/iam/users/7e5e7c27-46e4-4bf6-b021-7bd219d34472/roles','/iam/users/7e5e7c27-46e4-4bf6-b021-7bd219d34472/app-roles']) { const x = await api('GET',p); log(p.slice(-12), x.s, x.t.slice(0,300)); }
