// rename impact + edit re-adds?
const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d', id='79975bb2-56bc-4bc3-8f95-b6134e6411af', S1='07eb6b9e-229c-4970-846c-45d56d47d16a';
const o={}; const read=async(t=id)=>((await api('GET',`/modules/${TK}/records/${t}`)).j.data.data.find(x=>x.field==='skills')||{}).value?.items?.map(i=>i.value);
const arrv=names=>({field:'skills',value:{kind:'array',items:names.map(n=>({kind:'string',value:n}))}});
await api('PATCH',`/modules/${TK}/records/${id}`,{data:[arrv(['QA SK12 S1'])]}); await sleep(3000);
const sk=(await api('GET',`/desk/skills?department_id=${D}`)).j.data.skills.find(s=>s.id===S1);
const ren=await api('PUT',`/desk/skills/${S1}`,{...sk,name:'QA SK12 S1 renamed'}); o.rename=[ren.s,ren.t.slice(0,150)];
await sleep(4000); o.afterRename=await read();
const back=await api('PUT',`/desk/skills/${S1}`,{...sk,name:'QA SK12 S1'}); o.back=back.s; await sleep(3000); o.afterBack=await read();
// edit another field → auto-add re-adds?
await api('PATCH',`/modules/${TK}/records/${id}`,{data:[arrv([])]}); await sleep(3000);
await api('PATCH',`/modules/${TK}/records/${id}`,{data:[{field:'priority',value:{kind:'string',value:'High'}}]}); await sleep(6000); o.afterOtherEdit=await read();
return o;
