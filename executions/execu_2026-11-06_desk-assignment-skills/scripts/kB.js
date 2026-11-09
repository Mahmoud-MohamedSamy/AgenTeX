// 7 Nov E-05 (team pool + exclude) and F-14 (what the threshold counts)
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
o.prefOff=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true})).s;LED('E-05/F-14: Dept A assign_to_offline_agents ON temporarily');
// ---- E-05
await cs('E-05',async()=>{const g=await getRule(IDS.RR_TEAM);const t0=g.targets[0];
  const tg={criteria:t0.criteria,method:'sequential',pool:{kind:'team',user_ids:[],team_id:IDS.TA,excluded_user_ids:[IDS.A2]}};
  const p=await putRule(IDS.RR_TEAM,{execute_on:['create','update'],targets:[tg]});LED('E-05: RR_TEAM create+update, exclude A2 temporarily');
  const rb=(await getRule(IDS.RR_TEAM)).targets[0].pool;
  const L=[];for(let i=1;i<=4;i++){const t=await mkTicket('QA AS6 TEAMRR E05 '+i,IDS.DA,{},'E-05');await sleep(3500);L.push(i+':'+nm((await own(t.id)).owner));}
  const back=await putRule(IDS.RR_TEAM,{execute_on:g.execute_on,targets:[{criteria:t0.criteria,method:t0.method,pool:t0.pool}]});LED('E-05: RR_TEAM restored (update only, no exclusions)');
  return {put:p.s,e:p.e,poolSaved:{kind:rb.kind,excluded:(rb.excluded_user_ids||[]).map(nm)},owners:L,restored:back.s};});
// ---- F-14
const search=async(uid)=>{let all=[];for(let pg=1;pg<=20;pg++){const r=await api('POST','/modules/'+T+'/records/search?page='+pg+'&page_size=100',{filters:[{field:'owner',operator:'Equals',value:{kind:'string',value:uid}}]});const L=arr(r.j&&r.j.data);all=all.concat(L.map(fl));if(L.length<100)break;}return all;};
const counts=async()=>{const L=await search(IDS.A1);const c={n:L.length,byStatus:{},oDA:0,hDA:0,oOth:0,clDA:0};for(const t of L){const st=t.status;c.byStatus[st]=(c.byStatus[st]||0)+1;const da=t.department===IDS.DA;const closed=/closed/i.test(st);const hold=/hold/i.test(st);if(da){if(closed)c.clDA++;else if(hold)c.hDA++;else c.oDA++;}else if(!closed)c.oOth++;}return c;};
await cs('F-14',async()=>{const r={};r.c0=await counts();
  // make sure A1 has one On Hold ticket in Dept A and one open ticket in another dept
  const h=await mkTicket('QA AS6 F14 hold',IDS.DA,{},'F-14');await api('POST','/desk/tickets/'+h.id+'/assign',{owner_id:IDS.A1,team_id:null});r.hold=sh(await patchT(h.id,{status:'On Hold'})).s;
  const ob=await mkTicket('QA AS6 F14 other dept',IDS.DB,{},'F-14');r.otherAssign=sh(await api('POST','/desk/tickets/'+ob.id+'/assign',{owner_id:IDS.A1,team_id:null})).s;
  await sleep(2000);r.c1=await counts();
  const rule=await mkRule({type:'round_robin',department_id:IDS.DA,name:'QA AS6 F14 threshold',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:C('QA AS6 F14 probe'),method:'sequential',pool:{kind:'agents',user_ids:[IDS.A1],team_id:null,excluded_user_ids:[]}}]},'F-14');r.rule={s:rule.s,e:rule.e};IDS.RR_F14=rule.id;saveIds();
  if(!rule.id)return r;
  const probe=async(label,T)=>{const p=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:true,agent_thresholds:[{user_id:IDS.A1,threshold:T}]}));
    const t=await mkTicket('QA AS6 F14 probe '+label,IDS.DA,{},'F-14');await sleep(4000);return {T,pref:p.s,pe:p.e,owner:nm((await own(t.id)).owner)};};
  let c=await counts();r.p1=await probe('p1 open+hold DA',c.oDA+c.hDA);r.p1.c={oDA:c.oDA,hDA:c.hDA,oOth:c.oOth};
  c=await counts();r.p2=await probe('p2 open+hold DA +1',c.oDA+c.hDA+1);r.p2.c={oDA:c.oDA,hDA:c.hDA,oOth:c.oOth};
  c=await counts();r.p3=await probe('p3 all depts +1',c.oDA+c.hDA+c.oOth+1);r.p3.c={oDA:c.oDA,hDA:c.hDA,oOth:c.oOth,clDA:c.clDA};
  r.ruleOff=(await setActive(rule.id,false)).s;LED('F-14: rule QA AS6 F14 threshold deactivated');
  return r;});
o.prefBack=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;LED('E-05/F-14: Dept A preferences restored');
o.prefNow=JSON.stringify((await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data)===JSON.stringify(pr0);
o.RES=RES;return o;
