eval(fs.readFileSync('wf/lib.js','utf8'));
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const sv=v=>({kind:'string',stringValue:v});
const eq=(f,v)=>({kind:'Comparison',field:f,operator:'Equal',value:sv(v)});const mem=(f,vs)=>({kind:'Membership',field:f,negate:false,values:vs.map(sv)});
const crit=(extra)=>({kind:'Logical',operator:'And',operands:[guard('QA RT20 WF 3057 '),...extra]});
const o={};
const mk=async(tag,c)=>{const r=await api('POST','/workflow/rules',{moduleId:T,departmentIds:[QAO],name:'QA RT20 WF '+tag,isActive:false,mode:'Recurring',trigger:{kind:'RecordUpdated'},criteria:c,actions:[{order:0,delaySeconds:0,type:'AddTags',tagIds:['dd7dd3f4-7b78-4b08-a6b5-aee8942f1d1d'],mode:'append'}]});const id=r.j?.data?.id;if(id)led(`workflow rule "QA RT20 WF ${tag}" ${id} (inactive)`);return r.s+' '+(id||r.t.slice(0,300));};
o.a=await mk('3057 lists',crit([eq('approval_status','pending_approval'),mem('status',['On Hold']),mem('priority',['high','urgent']),eq('qa_ndc_transaction_type','Time Limit/BDF'),eq('language','arabic'),mem('classification',['feature']),eq('happiness_rating','okay'),eq('ticket_approval_status','pending')]));
o.b=await mk('3057 related',crit([eq('contact_id.type','customer')]));
return o;
