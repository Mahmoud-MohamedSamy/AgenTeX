// NDC-2812 part 3 (dev follow-up 8 Nov 14:07, desk #239): SLA escalation that reassigns to a team, live breach, Team Assignment off vs on.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';NM[IDS.TA]='Team A';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};const g=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data;const M='QA RT14 2812 SLA';
const tgt=mode=>({name:'QA target',sort_order:0,criteria:{conditions:[{field_key:'subject',operator:'contains',value:M}],pattern:null},response:{value:1,unit:'minutes'},resolution:{value:120,unit:'hours'},calendar_mode:mode,business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,
 escalations:{response:[{level:1,timing:'at',offset:null,recipients:[],template_ref:null,actions:{assign_owner:null,assign_team:IDS.TA,set_priority:'high'}}],resolution:[]}});
const pol=mode=>({department_id:IDS.DA,name:M,description:'QA retest NDC-2812 8 Nov - safe to delete',is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:true,targets:[tgt(mode)],accounts:[],support_plans:[]});
let pr=await api('POST','/desk/sla/policies',pol('calendar'));if(pr.s>=400){o.calendarErr=E(pr);pr=await api('POST','/desk/sla/policies',pol('business'));}
const sla=pr.j?.data?.id;o.sla=pr.s+' '+(E(pr)||'');if(!sla)return o;LED('SLA policy "'+M+'" '+sla+' (QA AS6 Dept A) NDC-2812');NEW.SLA2812=sla;saveIds();
const watch=async(id,maxMin)=>{const t0=Date.now();let last=null;while(Date.now()-t0<maxMin*60000){await sleep(20000);const a=(await act(id));const L=Array.isArray(a)?a:[];const esc=L.filter(e=>/sla|escal|team_assignment|priority|assign|owner/i.test(e.action+JSON.stringify(e.summary||'')));last=esc.map(e=>e.action+' '+JSON.stringify(e.summary||'').slice(0,260));if(L.some(e=>/escalat/i.test(e.action)))break;}const tk=await getT(id);const w=await own(id);return {owner:nm(w.owner),team:nm(w.team),priority:tk.priority,no:tk.ticket_number,hist:last,waitedS:Math.round((Date.now()-t0)/1000)};};
try{
 o.off=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:false})).s;LED('NDC-2812 SLA: Dept A team assignment OFF temporarily');
 const t1=await mkTicket(M+' off',IDS.DA,{priority:'Low'},'NDC-2812 SLA');o.t1sla=(await api('GET','/desk/tickets/'+t1.id+'/sla')).t.slice(0,400);
 o['A Team Assignment off, response breach']=await watch(t1.id,9);
}finally{o.on=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:true})).s;LED('NDC-2812 SLA: Dept A team assignment restored ON');}
const t2=await mkTicket(M+' on',IDS.DA,{priority:'Low'},'NDC-2812 SLA');
o['B Team Assignment on, response breach (control)']=await watch(t2.id,9);
o.slaOff=sh(await api('PUT','/desk/sla/policies/'+sla,{...pol('calendar'),is_active:false})).s;if(o.slaOff>=400)o.slaOffAlt=sh(await api('PATCH','/desk/sla/policies/'+sla,{is_active:false})).s;LED('NDC-2812 SLA: policy deactivated');
fs.writeFileSync(RUN+'/out/t2812c.json',JSON.stringify(o,null,1));return o;
