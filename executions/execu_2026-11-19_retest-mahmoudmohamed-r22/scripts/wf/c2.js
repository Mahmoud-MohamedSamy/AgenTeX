const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const sv=v=>({kind:'string',stringValue:v});
const eq=(f,v)=>({kind:'Comparison',field:f,operator:'Equal',value:sv(v)});const mem=(f,vs)=>({kind:'Membership',field:f,negate:false,values:vs.map(sv)});
const crit={kind:'Logical',operator:'And',operands:[{kind:'StringMatch',field:'last_name',operator:'StartsWith',stringValue:'QA RT20 WF 3057 ',caseInsensitive:false},eq('approval_status','pending_approval'),mem('lead_source',['web','referral']),eq('rating','market_failed'),eq('industry','technology')]};
const b={moduleId:L,name:'QA RT20 WF 3057 crm',isActive:false,mode:'Recurring',trigger:{kind:'RecordUpdated'},criteria:crit,actions:[{order:0,delaySeconds:0,type:'FieldUpdate',fieldUpdates:{description:{kind:'string',value:'QA RT20 WF 3057'}}}]};
let r=await api('POST','/workflow/rules',b);
if(r.s>=300){b.actions=[];r=await api('POST','/workflow/rules',b);}
const id=r.j?.data?.id;if(id)fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)}Z WF lane: CRM workflow rule "QA RT20 WF 3057 crm" ${id} (inactive, Leads)\n`);
return r.s+' '+(id||r.t.slice(0,400));
