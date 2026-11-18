eval(fs.readFileSync('cr/lib.js','utf8'));const o={recs:{}};const CU='6f553963-01d6-4b68-9fb3-143d23044c41',CTASK='a9d87b62-b704-4c2e-b2d5-1b745d7c2065',CTL='40c084f2-f062-45d5-ac70-132a7597fac0';
o.activeCustRules=arr((await api('GET','/workflow/rules?take=300')).j?.data).filter(r=>r.isActive&&r.moduleId===CU).map(r=>[r.name,r.trigger?.kind,JSON.stringify(r.criteria).slice(0,150)]);
const tag='3052 crm cconn',pfx=`QA RT20 CR ${tag} `;
const b={moduleId:CU,departmentIds:[],name:'QA RT20 CR '+tag,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'name',operator:'StartsWith',stringValue:pfx,caseInsensitive:false},actions:[{order:0,delaySeconds:0,type:'CreateConnectedRecord',targetModuleId:CTASK,targetLayoutId:CTL,connectedLookupField:'contact_name',fieldMappings:{subject:S('${phone}')}}]};
const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;o.rule=short(r)+' '+(id||'');if(!id)return o;led(`CRM workflow rule "QA RT20 CR ${tag}" ${id} (active)`);
const start=new Date().toISOString();
for(const [sfx,v] of [['no phone 1',{}],['with phone',{phone:'01000003052'}],['no phone 2',{}]]){const q=await api('POST',`/modules/${CU}/records`,{data:Object.entries({name:pfx+sfx,...v}).map(([k,x])=>({field:k,value:enc(x)}))});const cid=q.j?.data?.id;if(cid)led(`CRM customer "${pfx+sfx}" ${cid}`);o.recs[sfx]={s:q.s,id:cid,err:q.s>=300?q.t.slice(0,200):undefined};await sleep(1500);}
await sleep(20000);
for(const [k,l] of Object.entries(o.recs)){o.recs[k].ex=arr((await api('GET',`/workflow/executions?recordId=${l.id}`)).j?.data).filter(e=>e.ruleId===id).map(e=>({id:e.id,out:e.outcome,d:(e.dispatches||[]).map(d=>({type:d.actionType,st:d.status,err:d.lastError,target:d.target}))}));}
const L=arr((await api('GET',`/modules/${CTASK}/records?take=30&sort=-created_at`)).j?.data);o.tasks=[];for(const c of L){if((c.created_at||c.createdAt||'')<start)continue;const x={};for(const f of c.data||[])x[f.field]=val(f.value);o.tasks.push({id:c.id,subject:x.subject,contact_name:x.contact_name});led(`CRM task ${c.id} "${x.subject}" (created after QA RT20 CR 3052 crm cconn run)`);}
o.deact=await deact(id);o.ruleId=id;save('c8',o);return o;
