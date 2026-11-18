eval(fs.readFileSync('cr/lib.js','utf8'));const o={leads:{}};const LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',CU='6f553963-01d6-4b68-9fb3-143d23044c41',CUL='92269f8a-040c-4b00-8d33-cc323391dc3b';
// API controls
const a1=await api('POST',`/modules/${CU}/records`,{data:[{field:'phone',value:enc('0100000000')}]});o.apiNoName=a1.s+' '+a1.t.slice(0,250);if(a1.j?.data?.id)led(`CRM customer ${a1.j.data.id} (API control, no name)`);
const a2=await api('POST',`/modules/${CU}/records`,{data:[{field:'name',value:enc('')}]});o.apiEmptyName=a2.s+' '+a2.t.slice(0,250);if(a2.j?.data?.id)led(`CRM customer ${a2.j.data.id} (API control, empty name)`);
// plain CreateRecord into Customers with empty placeholder + repeat of connected
const mk=async(tag,action)=>{const pfx=`QA RT20 CR ${tag} `;const b={moduleId:LEADS,departmentIds:[],name:'QA RT20 CR '+tag,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'first_name',operator:'StartsWith',stringValue:pfx,caseInsensitive:false},actions:[{order:0,delaySeconds:0,...action}]};const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;if(id)led(`CRM workflow rule "QA RT20 CR ${tag}" ${id} (active)`);return {id,res:short(r),pfx};};
const plain=await mk('3052 crm cust plain',{type:'CreateRecord',targetModuleId:CU,targetLayoutId:CUL,fieldMappings:{name:S('${company}')}});o.plainRule=plain.res+' '+plain.id;
// reactivate conn rule for repeat
const CONN='9ebf28d1-8ea7-4d7e-95d3-2f2c08a8f4be';o.actConn=await act(CONN);
const start=new Date().toISOString();
const lead=async(pfx,sfx,rule)=>{const q=await api('POST',`/modules/${LEADS}/records`,{data:Object.entries({first_name:pfx+sfx,single_line_3_9:'QA RT20 CR'}).map(([k,x])=>({field:k,value:enc(x)}))});const lid=q.j?.data?.id;if(lid)led(`CRM lead "${pfx+sfx}" ${lid}`);o.leads[pfx+sfx]={id:lid,rule};await sleep(1500);};
if(plain.id)await lead(plain.pfx,'no company',plain.id);
await lead('QA RT20 CR 3052 crm conn ','no company 2',CONN);
await sleep(20000);
for(const [k,l] of Object.entries(o.leads)){o.leads[k].ex=arr((await api('GET',`/workflow/executions?recordId=${l.id}`)).j?.data).filter(e=>e.ruleId===l.rule).map(e=>({id:e.id,out:e.outcome,d:(e.dispatches||[]).map(d=>({type:d.actionType,st:d.status,err:d.lastError}))}));}
const L=arr((await api('GET',`/modules/${CU}/records?take=30&sort=-created_at`)).j?.data);o.cust=[];for(const c of L){if((c.created_at||c.createdAt||'')<start)continue;const x={};for(const f of c.data||[])x[f.field]=val(f.value);o.cust.push({id:c.id,name:x.name,lookup:x.lookup});led(`CRM customer ${c.id} "${x.name}" (created by QA RT20 CR 3052 crm rule)`);}
if(plain.id)o.d1=await deact(plain.id);o.d2=await deact(CONN);o.plainId=plain.id;
save('c6',o);return o;
