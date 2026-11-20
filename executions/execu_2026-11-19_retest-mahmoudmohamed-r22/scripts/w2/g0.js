const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const r=await api('GET','/desk/tags?take=500');const tags=r.j?.data?.tags||[];
const k=Object.keys(tags[0]||{});
return {s:r.s,n:tags.length,keys:k,qao:tags.filter(t=>t.department_id===QAO).map(t=>t.id+' '+t.name),all:tags.filter(t=>!t.department_id).map(t=>t.id+' '+t.name),cs:tags.filter(t=>t.department_id===CS).slice(0,8).map(t=>t.id+' '+t.name),w2:tags.filter(t=>/RT20/.test(t.name)).map(t=>t.name+'@'+t.department_id)};
