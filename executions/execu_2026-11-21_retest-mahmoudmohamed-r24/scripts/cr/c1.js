eval(fs.readFileSync('cr/lib.js','utf8'));const o={rules:{},leads:{}};const LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',CTASK='a9d87b62-b704-4c2e-b2d5-1b745d7c2065',CTL='40c084f2-f062-45d5-ac70-132a7597fac0',CCALL='e72e608a-a5d3-45cf-888a-dfadc6e8b456',CCL='58707442-1395-4eed-a015-be8280c9b4e6';
const ts={kind:'timestamp',timestampValue:new Date(Date.now()+86400000).toISOString()};
const pfx=t=>`QA RT20 CR ${t} `;
const mk=async(tag,actions)=>{const b={moduleId:LEADS,departmentIds:[],name:'QA RT20 CR '+tag,isActive:true,mode:'Recurring',trigger:{kind:'RecordCreated'},criteria:{kind:'StringMatch',field:'first_name',operator:'StartsWith',stringValue:pfx(tag),caseInsensitive:false},actions:actions.map((a,i)=>({order:i,delaySeconds:0,...a}))};const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;if(id)led(`CRM workflow rule "QA RT20 CR ${tag}" ${id} (active)`);o.rules[tag]=short(r)+' '+(id||'');return id;};
const rid={};
rid.task=await mk('3052 crm task',[{type:'CreateRecord',targetModuleId:CTASK,targetLayoutId:CTL,fieldMappings:{subject:S('${company}')}}]);
rid.conn=await mk('3052 crm conn',[{type:'CreateConnectedRecord',targetModuleId:CCALL,targetLayoutId:CCL,connectedLookupField:'related_to',fieldMappings:{call_type:S('outbound'),call_start_time:ts,call_duration:S('${company}')}}]);
o.rid=rid;if(!rid.task&&!rid.conn)return o;
const start=new Date().toISOString();o.start=start;
const mkLead=async(tag,sfx,v)=>{const r=await api('POST',`/modules/${LEADS}/records`,{data:Object.entries({first_name:pfx(tag)+sfx,single_line_3_9:'QA RT20 CR',...v}).map(([k,x])=>({field:k,value:enc(x)}))});const id=r.j?.data?.id;if(id)led(`CRM lead "${pfx(tag)+sfx}" ${id}`);o.leads[tag+' | '+sfx]={s:r.s,id,rule:rid[tag.includes('task')?'task':'conn'],err:r.s>=300?r.t.slice(0,300):undefined};await sleep(1500);};
if(rid.task){await mkLead('3052 crm task','no company',{});await mkLead('3052 crm task','with company',{company:'QA RT20 CR Co 3052'});}
if(rid.conn){await mkLead('3052 crm conn','no company',{});await mkLead('3052 crm conn','with company',{company:'QA RT20 CR 15 min'});}
fs.writeFileSync(OUTD+'c1.json',JSON.stringify(o));return o;
