const o={};const ca=await api('GET','/workflow/custom-actions');o.ca=[ca.s,JSON.stringify(arr2(ca.j?.data).map(x=>[x.name,x.targetAppKey||x.appKey||x.target,x.status||x.isPublished]).slice(0,10))];
const L=await api('GET','/modules/'+T+'/layouts');o.layouts=arr2(L.j?.data).map(x=>[x.name,x.id.slice(0,8),JSON.stringify(x.departmentIds||x.department_ids||[]).slice(0,60)].join(' | '));
const R=JSON.parse(fs.readFileSync('../a4/p1.json','utf8'));const h=await api('GET','/desk/tickets/'+R.P14a.ticket.id+'/history');o.hist=[h.s,JSON.stringify(arr2(h.j?.data).slice(0,4)).slice(0,700)];
return o;
