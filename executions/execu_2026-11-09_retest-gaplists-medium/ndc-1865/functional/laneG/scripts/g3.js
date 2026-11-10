eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
const p0=(await api('GET','/desk/departments/'+IDS.D+'/round-robin-preferences')).j.data;
const pp=await api('PUT','/desk/departments/'+IDS.D+'/round-robin-preferences',{...p0,assign_to_offline_agents:true});o.prefs=pp.s;if(pp.s<300)LED('UPDATED QA FT dept RR prefs assign_to_offline_agents=true');
// F3 direct
o.dr=await mkRule({type:'direct',name:'QA FT 1865 Direct',description:'QA NDC-1865 - safe to delete',is_active:true,execute_on:['create'],targets:[{criteria:C('QA FT 1865 DIR'),coming_to_department_id:IDS.D,move_to_department_id:null,assign:{kind:'agent',user_id:IDS.A,team_id:null}}]});
IDS.ruleDirect=o.dr.id;
// F6 RR
o.rr=await mkRule({type:'round_robin',department_id:IDS.D,name:'QA FT 1865 RR',description:'QA NDC-1865 - safe to delete',is_active:true,execute_on:['create'],targets:[{criteria:C('QA FT 1865 RR'),method:'sequential',pool:{kind:'agents',user_ids:[IDS.A,IDS.B],team_id:null,excluded_user_ids:[]}}]});
IDS.ruleRR=o.rr.id;saveIds();
await sleep(2000);
const d=await mkTicket('QA FT 1865 DIR ticket',{},'(F3)');
const rr=[];for(let i=1;i<=4;i++){rr.push(await mkTicket('QA FT 1865 RR ticket '+i,{},'(F6)'));await sleep(1500);}
await sleep(8000);
const own=async id=>{const x=await getT(id);return oid(x.owner);};
o.dirOwner=await own(d.id);
o.rrOwners=[];for(const t of rr)o.rrOwners.push(await own(t.id));
const nm={[IDS.A]:'TestUser1',[IDS.B]:'QATeam1',[IDS.me]:'owner(creator)'};
o.dirOwnerName=nm[o.dirOwner]||o.dirOwner;o.rrNames=o.rrOwners.map(x=>nm[x]||x);
return o;
