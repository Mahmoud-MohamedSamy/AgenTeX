eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};const nm={[IDS.A]:'TestUser1',[IDS.B]:'QATeam1',[IDS.me]:'owner(creator)'};
const own=async id=>{const x=await getT(id);const v=oid(x.owner);return nm[v]||v;};
const R=(await api('GET','/desk/assignment-rules?type=direct')).j.data.rules;o.activeOthers=R.filter(x=>x.is_active&&x.id!==IDS.ruleDirect).length;
if(o.activeOthers===0){
 const ns=(await api('GET','/desk/assignment/notification-settings')).j.data;
 const on=await api('PUT','/desk/assignment/notification-settings',{...ns,direct_rules_enabled:true});o.on=sh(on);LED('UPDATED tenant direct-rules master switch ON (was OFF; only active direct rule = QA FT 1865 Direct) — restore OFF');
 try{
  const t=await mkTicket('QA FT 1865 DIR ticket 2',{owner:null},'(F3, owner:null, master ON)');await sleep(8000);o.dirOwner=await own(t.id);
  const t2=await mkTicket('QA FT 1865 other subject',{owner:null},'(F3 negative)');await sleep(6000);o.negOwner=await own(t2.id);
 } finally {
  const ns2=(await api('GET','/desk/assignment/notification-settings')).j.data;const off=await api('PUT','/desk/assignment/notification-settings',{...ns2,direct_rules_enabled:false});o.off=off.s;LED('RESTORED tenant direct-rules master switch OFF: '+off.s);
 }
 o.after=(await api('GET','/desk/assignment/notification-settings')).j.data;
}
return o;
