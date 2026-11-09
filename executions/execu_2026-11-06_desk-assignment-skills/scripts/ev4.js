// 7 Nov: re-run cases blocked by B-1 (D-07, H-12, F-10) now that RR on create works. Offline agents allowed (presence is not under test here).
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const sk=async id=>(await getT(id)).skills;
const o={};
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
const seq0=(await getRule(IDS.RR_SEQ)).execute_on, skr0=(await getRule(IDS.RR_SKILL)).execute_on;
const d07=await getRule(IDS.DA_D07); o.d07rule={active:d07&&d07.is_active,exec:d07&&d07.execute_on};
o.pref=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true})).s;
o.seq=(await putRule(IDS.RR_SEQ,{execute_on:['create','update']})).s;
o.skr=(await putRule(IDS.RR_SKILL,{execute_on:['create','update']})).s;
if(d07&&!d07.is_active)o.d07on=(await setActive(IDS.DA_D07,true)).s;
// D-07: created in Dept B, direct rule moves to Dept A unassigned, Dept A RR should assign in the same event
await cs('D-07',async()=>{const t=await mkTicket('QA AS6 SEQ D07 r2',IDS.DB,{},'D-07 rerun');await sleep(8000);const w=await own(t.id);return {owner:nm(w.owner),dept:w.dept===IDS.DA?'DA':w.dept===IDS.DB?'DB':w.dept,h:await hist(t.id)};});
// H-12: skill auto-added on create, skill RR assigns in the same event (SK2 holder = A2)
await cs('H-12',async()=>{const t=await mkTicket('QA AS6 SKR QA AS6 SK2 r2',IDS.DA,{},'H-12 rerun');await sleep(8000);const w=await own(t.id);return {skills:await sk(t.id),owner:nm(w.owner),h:await hist(t.id)};});
// F-10: backlog first
await cs('F-10',async()=>{
  const p=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true,incoming_mode:'backlog_first',assign_backlogs:true}));
  const t=await mkTicket('QA AS6 SEQ F10 backlog first',IDS.DA,{},'F-10 rerun');await sleep(6000);const first=nm((await own(t.id)).owner);
  let after='-',secs=0;for(let i=0;i<20;i++){await sleep(10000);secs+=10;const w=await own(t.id);if(w.owner){after=nm(w.owner);break;}}
  return {prefPut:p.s,prefE:p.e,ownerAfter6s:first,ownerLater:after,secs,h:await hist(t.id)};});
// restore
if(d07&&!d07.is_active)o.d07off=(await setActive(IDS.DA_D07,false)).s;
o.back=[(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s,(await putRule(IDS.RR_SKILL,{execute_on:skr0})).s,sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s];
LED('7 Nov rerun D-07/H-12/F-10: RR_SEQ+RR_SKILL execute_on create+update, Dept A prefs offline ON / backlog_first / assign backlogs ON temporarily; all restored');
o.RES=RES;return o;
