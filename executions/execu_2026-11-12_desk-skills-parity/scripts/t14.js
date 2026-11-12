const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', TK='88e8ea44-1658-4df3-9930-d0902b91073d', A1='876ce871-2b02-4854-89a7-68050391c62b';
const o={};
const p=(await api('GET',`/desk/departments/${D}/round-robin-preferences`)).j.data;
o.prefs=(await api('PUT',`/desk/departments/${D}/round-robin-preferences`,{...p,assign_to_offline_agents:true})).s;
const rule=await api('POST','/desk/assignment-rules',{type:'round_robin',department_id:D,name:'QA SK12 RR skill',description:null,is_active:true,execute_on:['create','update'],
  targets:[{criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QASK12RR'}],pattern:null},method:'skill',pool:{kind:'agents',user_ids:[A1],team_id:null,excluded_user_ids:[]}}]});
o.rule=[rule.s,rule.j?.data?.id||rule.t.slice(0,400)]; if(rule.j?.data?.id) track('assignmentRule',rule.j.data.id,'QA SK12 RR skill');
const f=(k,v)=>({field:k,value:{kind:'string',value:v}}); const sk=n=>({field:'skills',value:{kind:'array',items:n.map(x=>({kind:'string',value:x}))}});
const mk=async(subj,skills)=>{const r=await api('POST',`/modules/${TK}/records`,{data:[f('subject',subj),f('department',D),f('status','Open'),{field:'owner',value:{kind:'null'}},sk(skills)]}); const id=r.j?.data?.id; if(id) track('ticket',id,subj); return id||('ERR '+r.s+' '+r.t.slice(0,200));};
const ids={B1:await mk('QA SK12 B1 QASK12RR',['QA SK12 S3']),B2:await mk('QA SK12 B2 QASK12RR',['QA SK12 S3','QA SK12 S1']),B3:await mk('QA SK12 B3 QASK12RR',[])};
await sleep(12000);
for(const k in ids){ if(String(ids[k]).startsWith('ERR')){o[k]=ids[k];continue;} const d=(await api('GET',`/modules/${TK}/records/${ids[k]}`)).j.data.data; const g=n=>(d.find(x=>x.field===n)||{}).value; o[k]=[ids[k],g('ticket_number')?.value,g('owner')?.value,g('skills')?.items?.map(i=>i.value)]; }
return o;
