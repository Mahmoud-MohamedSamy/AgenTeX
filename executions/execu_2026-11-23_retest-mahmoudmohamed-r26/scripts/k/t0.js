const V=JSON.parse(fs.readFileSync(RUN+'/scripts/k/vo.json','utf8'));const DD=V.DD;const o={};
const before=(await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[];fs.writeFileSync(RUN+'/out/statuses-before-3136.json',JSON.stringify(before,null,1));
const NEW={value:'QA RT26 ST',label:'QA RT26 ST',type:'open',configured:true,show_in_help_center:false,help_center_name:null,help_center_name_ar:null};
let r=await api('PUT','/desk/ticket-statuses',{statuses:[...before,NEW]});o.add=E(r);
const now=(await api('GET','/desk/ticket-statuses')).j?.data?.statuses||[];o.addedOk=!!now.find(s=>s.value==='QA RT26 ST');o.othersSame=JSON.stringify(now.filter(s=>s.value!=='QA RT26 ST'))===JSON.stringify(before);
if(o.addedOk)LED('ticket status QA RT26 ST added (type open) — remove at end; list backup out/statuses-before-3136.json');
const p=await api('POST','/desk/sla/policies',{department_id:DD,name:'QA RT26 SLA',description:'QA RT26 retest - safe to delete',is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,
 targets:[{name:'QA RT26 4h',criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QA RT26 sla'}],pattern:null},response:{value:1,unit:'hours'},resolution:{value:4,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[],resolution:[]}}]});
o.sla=E(p);const SLA=p.j?.data?.id;if(SLA){made.other.push({sla:SLA});keep();LED('SLA policy QA RT26 SLA '+SLA+' in QA RT26 VO Dept');}
const t={};t.C1=await mkT('sla','C1',{owner:OWNER},DD);t.M1=await mkT('tc','M1',{owner:OWNER},DD);t.M2=await mkT('tc','M2',{owner:OWNER},DD);
await sleep(12000);for(const id of Object.values(t))o['mv_'+id.slice(0,8)]=E(await api('PATCH','/modules/'+TK+'/records/'+id,{data:fields({status:'QA RT26 ST'})}));
fs.writeFileSync(RUN+'/out/3136.json',JSON.stringify({DD,SLA,t},null,1));return o;
