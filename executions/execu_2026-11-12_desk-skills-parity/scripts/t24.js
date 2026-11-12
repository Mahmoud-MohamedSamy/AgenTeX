const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}}); const sk=n=>({field:'skills',value:{kind:'array',items:n.map(x=>({kind:'string',value:x}))}});
const mk=async(subj,skills)=>{const r=await api('POST',`/modules/${TK}/records`,{data:[f('subject',subj),f('department',D),f('status','Open'),{field:'owner',value:{kind:'null'}},sk(skills)]}); const id=r.j?.data?.id; track('ticket',id,subj); return id;};
const o={};
o.e2=await mk('QA SK12 E2 QASK12RR',[]);                                  // no skills, rule pool = Test User 1
o.e3=await mk('QA SK12 E3 field',['QA SK12 Inact','QA AS6 sk1']);         // inactive + other dept
const d2=await api('POST','/desk/departments',{name:'QA SK12 Dept B'}); o.deptB=d2.j?.data?.id; track('department',o.deptB,'QA SK12 Dept B');
o.prefsB=(await api('GET',`/desk/skill-preferences?department_id=${o.deptB}`)).j?.data;
await sleep(12000);
for(const k of ['e2','e3']){const d=(await api('GET',`/modules/${TK}/records/${o[k]}`)).j.data.data; const g=n=>(d.find(x=>x.field===n)||{}).value; o[k+'r']=[g('ticket_number')?.value,g('owner')?.value,g('skills')?.items?.map(i=>i.value)];}
return o;
