const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const R={};
const rl=await api('GET','/workflow/rules?take=200'); R.rulesStatus=rl.s; const all=arr(rl.j?.data); R.count=all.length;
R.active=all.filter(r=>r.isActive).map(r=>[r.id.slice(0,8),r.name,JSON.stringify(r.departmentIds||[]).slice(0,60)]);
R.qa=all.filter(r=>/QA RT18|QA AO WF/.test(r.name)).map(r=>[r.id.slice(0,8),r.name,r.isActive]);
const one=all.find(r=>r.trigger&&r.trigger.kind==='FieldChanged')||all[0]; R.sampleKeys=Object.keys(one||{}); R.sampleTrigger=one&&one.trigger;
const g=(await api('GET','/workflow/rules/'+all[0].id)).j?.data; R.getKeys=Object.keys(g||{}); R.ver={rowVersion:g?.rowVersion,version:g?.version,etag:g?.etag,updatedAt:g?.updatedAt};
const d=await api('GET','/desk/departments'); R.depts=arr(d.j?.data).map(x=>[x.id,x.name]).slice(0,20);
return R;
