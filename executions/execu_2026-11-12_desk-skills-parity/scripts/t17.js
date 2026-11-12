const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d', S3='7ffffd47-cd50-44d8-999f-441e136e28c7', B2='526f34d2-4c35-448f-afb5-5e09080affd0';
const o={};
o.usage=await api('GET',`/desk/skills/${S3}/usage`); o.usage=[o.usage.s,o.usage.t.slice(0,500)];
const del=await api('DELETE',`/desk/skills/${S3}`); o.del=[del.s,del.t.slice(0,300)];
await sleep(5000); const d=(await api('GET',`/modules/${TK}/records/${B2}`)).j.data.data; o.b2=(d.find(x=>x.field==='skills')||{}).value?.items?.map(i=>i.value);
// bulk recalculation
const st=await api('POST','/desk/skills/recalculations',{}); o.recalcStart=[st.s,st.t.slice(0,300)];
await sleep(15000); const la=await api('GET','/desk/skills/recalculations/latest'); o.recalcLatest=[la.s,la.t.slice(0,400)];
return o;
