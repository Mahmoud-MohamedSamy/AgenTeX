eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
for(const id of IDS.wf||[]){const r=await api('POST','/workflow/rules/'+id+'/deactivate',{});let s=r.s;if(s>=300){const g=await api('GET','/workflow/rules/'+id);const rr=await api('PATCH','/workflow/rules/'+id,{...g.j.data,isActive:false});s='patch '+rr.s;}o['wfoff_'+id.slice(0,8)]=s;LED('UPDATED workflow rule '+id+' deactivated: '+s);}
const lvl=(timing,min,actions)=>({timing,offset:min==null?null:{value:min,unit:'minutes'},recipients:[{kind:'ticket_owner'}],template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null,...(actions||{})}});
const trig={create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null};
const target={name:'QA FT 1865 target',criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QA FT 1865 SLA'}],pattern:null},response:{value:2,unit:'minutes'},resolution:{value:3,unit:'minutes'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[lvl('before',1)],resolution:[lvl('at',null,{set_priority:'urgent',assign_owner:IDS.A})]}};
if(!IDS.sla){const r=await api('POST','/desk/sla/policies',{department_id:IDS.D,name:'QA FT 1865 SLA',description:null,is_active:true,triggers:trig,execute_only_with_account:false,resolution_from_created:false,targets:[target]});o.policy=sh(r);const id=r.j&&r.j.data&&r.j.data.id;if(id){IDS.sla=id;LED('CREATED SLA policy "QA FT 1865 SLA" '+id);saveIds();}}
const g=await api('GET','/desk/sla/policies/'+IDS.sla);o.saved=g.s+' esc:'+JSON.stringify(g.j&&g.j.data&&g.j.data.targets&&g.j.data.targets[0]&&g.j.data.targets[0].escalations).slice(0,300);
const t=await mkTicket('QA FT 1865 SLA ticket',{owner:null,priority:'High'},'(F5)');IDS.slaTicket=t.id;saveIds();
await sleep(8000);
const rd=async()=>{const s=await api('GET','/desk/tickets/'+t.id+'/sla');const d=s.j&&s.j.data;return d?{state:d.state,ob:(d.obligations||[]).map(x=>[x.kind,x.status||x.state,x.due_at,'lvl '+x.escalation_level_reached])}:s.s+' '+s.t.slice(0,200);};
o.t0=await rd();
await sleep(200000);
o.t3m20=await rd();const x=await getT(t.id);o.afterBreach={priority:x.priority,owner:oid(x.owner)===IDS.A?'TestUser1 (escalation assign)':oid(x.owner)};
return o;
