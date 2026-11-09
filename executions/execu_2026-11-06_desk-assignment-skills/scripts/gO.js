// 7 Nov E2E-1..3 with agents held online by the keeper
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const CTL='../out/presence-ctl.json';const ctl=o=>fs.writeFileSync(CTL,JSON.stringify(o));
const DO='../out/agent-do.json';
const agent=async(who,m,p,b)=>{const id='e2e'+Date.now()+who;fs.writeFileSync(DO,JSON.stringify([{id,who,m,p,body:b}]));for(let i=0;i<40;i++){await sleep(1000);const f='../out/do-'+id+'.json';if(fs.existsSync(f)){const t=fs.readFileSync(f,'utf8');try{return JSON.parse(t);}catch(e){return t.slice(0,200);}}}return null;};
const pres=async()=>(await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]})).j.data.agents.map(a=>nm(a.user_id)+':'+(a.presence.online?'on':'off'));
const waitFor=async(re,max=120)=>{for(let i=0;i<max/5;i++){const p=(await pres()).join(' ');if(re.test(p))return p;await sleep(5000);}return (await pres()).join(' ');};
const rrEntry=async id=>{const a=await act(id);const x=(Array.isArray(a)?a:[]).filter(e=>e.action==='ticket.auto_assigned').map(e=>`${e.summary.rule_type}/${e.summary.trigger}/${nm(e.summary.owner_id)}${(e.summary.skipped_user_ids||[]).length?' skipped '+e.summary.skipped_user_ids.map(nm):''}`);return x.join(' > ');};
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
const seq0=(await getRule(IDS.RR_SEQ)).execute_on,skr0=(await getRule(IDS.RR_SKILL)).execute_on;
await putRule(IDS.RR_SEQ,{execute_on:['create','update']});await putRule(IDS.RR_SKILL,{execute_on:['create','update']});
LED('E2E 7 Nov: RR_SEQ + RR_SKILL create+update temporarily');
const o={};
// E2E-1: Dept B ticket -> direct rule moves to Dept A unassigned -> Dept A sequential RR, 6 tickets
await cs('E2E-1',async()=>{ctl({a1:'on',a2:'on',a3:'on'});o.p1=await waitFor(/A1:on A2:on A3:on/);
  const L=[];for(let i=1;i<=6;i++){const t=await mkTicket('QA AS6 SEQ D07 e2e '+i,IDS.DB,{},'E2E-1');await sleep(3500);const w=await own(t.id);L.push({i,owner:nm(w.owner),dept:w.dept===IDS.DA?'DA':'DB',h:await rrEntry(t.id),id:t.id});}
  await sleep(4000);const nt={};for(const w of ['a1','a2','a3']){const n=await agent(w,'GET','/notifications?limit=30');const X=(n&&n.data&&(n.data.data||n.data))||[];nt[w]=(Array.isArray(X)?X:[]).filter(x=>/D07 e2e/.test(x.title||'')).map(x=>(x.title||'').replace(/.*D07 e2e /,'#'));}
  return {tickets:L.map(x=>`${x.i}:${x.owner}/${x.dept} [${x.h}]`),notif:nt};});
// E2E-3: agent goes out -> skipped -> all out -> backlog -> A1 back -> Assign backlogs picks it up
await cs('E2E-3',async()=>{const p=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_backlogs:true}));
  ctl({a1:'out',a2:'on',a3:'on'});await waitFor(/A1:off A2:on A3:on/);
  const s1=[];for(let i=1;i<=2;i++){const t=await mkTicket('QA AS6 SEQ e2e3 a1out '+i,IDS.DA,{},'E2E-3');await sleep(3500);s1.push(nm((await own(t.id)).owner)+' ['+(await rrEntry(t.id))+']');}
  ctl({a1:'out',a2:'out',a3:'out'});await waitFor(/A1:off A2:off A3:off/);
  const b=await mkTicket('QA AS6 SEQ e2e3 backlog',IDS.DA,{},'E2E-3');await sleep(4000);const bOwner=nm((await own(b.id)).owner);
  ctl({a1:'on',a2:'out',a3:'out'});await waitFor(/A1:on A2:off A3:off/);
  let got='-',secs=0;for(let i=0;i<24;i++){await sleep(10000);secs+=10;const w=await own(b.id);if(w.owner){got=nm(w.owner);break;}}
  return {pref:p.s,whileA1out:s1,backlogOwnerAtCreate:bOwner,afterA1back:got,secs,h:await rrEntry(b.id)};});
// E2E-2: skill RR on create -> A2; backlog ticket waits; A2 closes the skill ticket -> backlog ticket goes to A2 (assign on closure)
await cs('E2E-2',async()=>{const p=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_on_closure:true,assign_backlogs:false}));
  ctl({a1:'on',a2:'on',a3:'on'});await waitFor(/A1:on A2:on A3:on/);
  const s=await mkTicket('QA AS6 SKR QA AS6 SK2 e2e2',IDS.DA,{},'E2E-2');await sleep(5000);const sOwner=nm((await own(s.id)).owner);const sSk=(await getT(s.id)).skills;
  ctl({a1:'out',a2:'out',a3:'out'});await waitFor(/A1:off A2:off A3:off/);
  const b=await mkTicket('QA AS6 SEQ e2e2 backlog',IDS.DA,{},'E2E-2');await sleep(4000);const bOwner=nm((await own(b.id)).owner);
  ctl({a1:'out',a2:'on',a3:'out'});await waitFor(/A1:off A2:on A3:off/);
  const close=await agent('a2','PATCH','/modules/'+T+'/records/'+s.id,body({status:'Closed'}));
  let got='-',secs=0;for(let i=0;i<9;i++){await sleep(5000);secs+=5;const w=await own(b.id);if(w.owner){got=nm(w.owner);break;}}
  return {pref:p.s,skillTicket:{owner:sOwner,skills:sSk,h:await rrEntry(s.id)},closeOk:JSON.stringify(close).slice(0,80),backlogAtCreate:bOwner,backlogAfterClose:got,secs,h:await rrEntry(b.id)};});
// restore
ctl({a1:'on',a2:'on',a3:'on'});
o.back=[(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s,(await putRule(IDS.RR_SKILL,{execute_on:skr0})).s,sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s];
LED('E2E 7 Nov: RR_SEQ/RR_SKILL execute_on and Dept A prefs restored; keeper back to all on');
o.RES=RES;return o;
