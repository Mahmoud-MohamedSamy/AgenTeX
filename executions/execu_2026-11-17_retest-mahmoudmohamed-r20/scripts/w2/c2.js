const sv=v=>({kind:'string',stringValue:v});
const eq=(f,v)=>({kind:'Comparison',field:f,operator:'Equal',value:sv(v)});const mem=(f,vs)=>({kind:'Membership',field:f,negate:false,values:vs.map(sv)});
const g=f=>({kind:'StringMatch',field:f,operator:'StartsWith',stringValue:'QA RT20 W2 3057 ',caseInsensitive:false});
const o={};
const mk=async(tag,mid,gf,ops)=>{const b={moduleId:mid,name:'QA RT20 W2 '+tag,isActive:false,mode:'Recurring',trigger:{kind:'RecordUpdated'},criteria:{kind:'Logical',operator:'And',operands:[g(gf),...ops]},actions:[{order:0,delaySeconds:0,type:'FieldUpdate',fieldUpdates:{description:{kind:'string',value:'QA RT20 W2 3057'}}}]};
let r=await api('POST','/workflow/rules',b);if(r.s>=300){b.actions=[];r=await api('POST','/workflow/rules',b);}
const id=r.j?.data?.id;if(id)fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)}Z W2 lane: CRM workflow rule "QA RT20 W2 ${tag}" ${id} (inactive)\n`);return r.s+' '+(id||r.t.slice(0,400));};
o.leads=await mk('3057 crm leads','841043e1-c078-41f9-8d6e-dfd61bee45c3','last_name',[mem('lead_source',['web','referral']),eq('rating','market_failed'),eq('industry','technology'),eq('salutation','dr')]);
o.acc=await mk('3057 crm accounts','b2398920-2914-4836-be53-81bd960effea','name',[eq('account_type','customer'),eq('ownership','private'),eq('rating','active'),eq('industry','finance')]);
o.deals=await mk('3057 crm deals','f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430','name',[eq('stage','needs_analysis'),eq('type','new_business'),eq('reason_for_loss','no_budget'),mem('lead_source',['chat'])]);
return o;
