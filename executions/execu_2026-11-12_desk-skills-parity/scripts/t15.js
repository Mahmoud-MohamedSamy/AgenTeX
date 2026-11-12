const TK='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const ids={B1:'b22c347e-c10e-45f7-a2cf-e710ffa374a2',B2:'526f34d2-4c35-448f-afb5-5e09080affd0',B3:'8712c5aa-f5fb-410f-aa7a-e9dec233fb14'};
for(const k in ids){ const r=await api('GET',`/modules/${TK}/records/${ids[k]}`); if(!r.j?.data){o[k]=[r.s,r.t.slice(0,200)];continue;} const d=r.j.data.data; const g=n=>(d.find(x=>x.field===n)||{}).value; o[k]=[g('ticket_number')?.value,g('owner')?.value,g('skills')?.items?.map(i=>i.value)]; }
const h=await api('GET',`/desk/tickets/${ids.B2}/history`); o.h=[h.s,h.t.slice(0,600)];
return o;
