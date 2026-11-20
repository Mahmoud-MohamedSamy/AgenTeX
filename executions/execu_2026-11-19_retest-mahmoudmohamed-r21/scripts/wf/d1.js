const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
const r=await api('GET','/iam/org-units?app_key=desk');const L=arr(r.j?.data);o.s=r.s;o.n=L.length;
const c=L.find(x=>x.id===CEO);o.ceoKeys=c&&Object.keys(c);o.ceo=c&&JSON.stringify(c).slice(0,800);
o.k0=Object.keys(L[0]||{});o.units=L.map(x=>[x.name,String(x.id).slice(0,8),x.parentId?.slice(0,8)||x.parent_id?.slice(0,8)]);
const us=arr((await api('GET','/iam/users?take=300')).j?.data);const mm=us.filter(u=>/Mahmoud Mohamed|Customer Experience Specialists 2|Test User 1/.test(u.displayName));o.uKeys=Object.keys(mm[0]||{});o.mm=mm.map(u=>JSON.stringify({n:u.displayName,ou:u.orgUnitId,ous:u.orgUnitIds,app:u.appOrgUnits||u.orgUnits}).slice(0,400));
return o;
