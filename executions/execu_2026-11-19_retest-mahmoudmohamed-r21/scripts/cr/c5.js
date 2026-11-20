eval(fs.readFileSync('cr/lib.js','utf8'));const o={leads:{}};const LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',CU='6f553963-01d6-4b68-9fb3-143d23044c41',CUL='92269f8a-040c-4b00-8d33-cc323391dc3b';
const tag='3052 crm conn',pfx=`QA RT20 CR ${tag} `;
const b={moduleId:LEADS,departmentIds:[],name:'QA RT20 CR '+tag,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'first_name',operator:'StartsWith',stringValue:pfx,caseInsensitive:false},actions:[{order:0,delaySeconds:0,type:'CreateConnectedRecord',targetModuleId:CU,targetLayoutId:CUL,connectedLookupField:'lookup',fieldMappings:{name:S('${company}')}}]};
const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;o.rule=short(r)+' '+(id||'');if(!id)return o;led(`CRM workflow rule "QA RT20 CR ${tag}" ${id} (active)`);
const start=new Date().toISOString();
for(const [sfx,v] of [['no company',{}],['with company',{company:'QA RT20 CR Cust 3052'}]]){const q=await api('POST',`/modules/${LEADS}/records`,{data:Object.entries({first_name:pfx+sfx,single_line_3_9:'QA RT20 CR',...v}).map(([k,x])=>({field:k,value:enc(x)}))});const lid=q.j?.data?.id;if(lid)led(`CRM lead "${pfx+sfx}" ${lid}`);o.leads[sfx]={s:q.s,id:lid};await sleep(1500);}
await sleep(20000);
for(const [k,l] of Object.entries(o.leads)){o.leads[k].ex=arr((await api('GET',`/workflow/executions?recordId=${l.id}`)).j?.data).filter(e=>e.ruleId===id).map(e=>({id:e.id,out:e.outcome,d:(e.dispatches||[]).map(d=>({type:d.actionType,st:d.status,err:d.lastError,target:d.target}))}));}
const L=arr((await api('GET',`/modules/${CU}/records?take=30&sort=-created_at`)).j?.data);o.cust=[];for(const c of L){if((c.created_at||c.createdAt||'')<start)continue;const x={};for(const f of c.data||[])x[f.field]=val(f.value);o.cust.push({id:c.id,name:x.name,lookup:x.lookup});led(`CRM customer ${c.id} "${x.name}" (created by rule QA RT20 CR 3052 crm conn)`);}
const c1=JSON.parse(fs.readFileSync(OUTD+'c1.json','utf8'));o.deactTask=await deact(c1.rid.task);o.deactConn=await deact(id);
const c3=JSON.parse(fs.readFileSync(OUTD+'c3.json','utf8'));for(const t of c3.tasks)led(`CRM task ${t.id} "${t.subject}" (created by rule QA RT20 CR 3052 crm task)`);
o.ruleId=id;save('c5',o);return o;
