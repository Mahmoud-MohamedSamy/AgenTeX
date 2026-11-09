eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};const led=fs.readFileSync('../ledger.md','utf8');const idOf=s=>{const m=led.match(new RegExp('ticket "'+s+'" ([0-9a-f-]{36})'));return m&&m[1];};
const HOLD=idOf('QA AS6 F14 hold');
const wl=async()=>{const r=(await api('GET','/desk/agents/'+IDS.A1+'/workload')).j.data;let all=0,da=0;for(const x of r.departments){all+=x.open_tickets;if(x.department_id===IDS.DA)da=x.open_tickets;}return {da,all};};
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
await setActive(IDS.RR_F14,true);LED('F-14 r2: rule QA AS6 F14 threshold active temporarily; Dept A prefs temporarily changed');
const setT=async T=>sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:true,agent_thresholds:[{user_id:IDS.A1,threshold:T}]})).s;
let n=0;const probe=async(label,T)=>{await setT(T);const t=await mkTicket('QA AS6 F14 probe r2 '+label,IDS.DA,{},'F-14 r2');await sleep(4000);const ow=nm((await own(t.id)).owner);if(ow==='-')await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:IDS.A2,team_id:null});return {T,owner:ow,id:t.id};};
const s=[];
let w=await wl();s.push({step:'control T=200',w,...await probe('ctl',200)});
w=await wl();s.push({step:'T = all depts',w,...await probe('all',w.all)});
w=await wl();s.push({step:'T = all depts +1',w,...await probe('all+1',w.all+1)});
// On Hold: with the hold ticket On Hold, T = all  → assigned only if On Hold is NOT counted
o.holdStatus=(await getT(HOLD)).status;
w=await wl();s.push({step:'T = all (one ticket On Hold)',w,...await probe('hold',w.all)});
// Closed: close one A1 ticket, then T = all-before-close → assigned only if Closed is NOT counted
const ctl=s[0].id;const w0=await wl();const c=await patchT(ctl,{status:'Closed'});o.close={s:c.s,e:E(c),st:(await getT(ctl)).status};await sleep(1500);const w1=await wl();
s.push({step:'T = count before closing one A1 ticket',wBefore:w0,wAfter:w1,...await probe('closed',w0.all)});
o.steps=s;
await setActive(IDS.RR_F14,false);o.prefBack=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;LED('F-14 r2: rule inactive, Dept A prefs restored');
o.prefSame=JSON.stringify((await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data)===JSON.stringify(pr0);
return o;
