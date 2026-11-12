const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d', id='79975bb2-56bc-4bc3-8f95-b6134e6411af', S2='029d39be-5e12-4055-80ff-4cb44bf8ed7d';
const o={}; const read=async()=>((await api('GET',`/modules/${TK}/records/${id}`)).j.data.data.find(x=>x.field==='skills')||{}).value?.items?.map(i=>i.value);
const arrv=names=>({field:'skills',value:{kind:'array',items:names.map(n=>({kind:'string',value:n}))}});
// ticket: S1 only + manual NoCrit (no criteria) ; S2 criteria changed to not match
await api('PATCH',`/modules/${TK}/records/${id}`,{data:[arrv(['QA SK12 S2','QA SK12 NoCrit'])]}); await sleep(3000); o.before=await read();
const sk=(await api('GET',`/desk/skills?department_id=${D}`)).j.data.skills.find(s=>s.id===S2);
o.chg=(await api('PUT',`/desk/skills/${S2}`,{...sk,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'NOMATCHQASK12'}],pattern:null}})).s;
const r=await api('POST',`/desk/tickets/${id}/skills/recalculate`,{}); o.recalc=[r.s,r.t.slice(0,300)];
await sleep(6000); o.after=await read();
return o;
