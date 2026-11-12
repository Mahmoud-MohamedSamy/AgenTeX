// execute assign-by-skills on B2 and B1 (as owner), and check admin 403 reason later
const TK='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const ids={B1:'b22c347e-c10e-45f7-a2cf-e710ffa374a2',B2:'526f34d2-4c35-448f-afb5-5e09080affd0'};
for(const k in ids){ const r=await api('POST',`/desk/tickets/${ids[k]}/skills/assign`,{}); o[k]=[r.s,r.t.slice(0,400)]; }
await sleep(6000);
for(const k in ids){ const d=(await api('GET',`/modules/${TK}/records/${ids[k]}`)).j.data.data; o[k+'owner']=(d.find(x=>x.field==='owner')||{}).value?.value; }
return o;
