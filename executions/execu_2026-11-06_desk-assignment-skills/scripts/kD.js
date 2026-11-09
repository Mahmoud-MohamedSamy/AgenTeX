// 7 Nov F-14: what the agent threshold counts (A1, rule QA AS6 F14 threshold, pool A1 only)
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};const ledgerHits=fs.readFileSync('../ledger.md','utf8');
const idOf=s=>{const m=ledgerHits.match(new RegExp('ticket "'+s+'" ([0-9a-f-]{36})'));return m&&m[1];};
const HOLD=idOf('QA AS6 F14 hold');o.holdId=!!HOLD;
const wl=async()=>{const r=(await api('GET','/desk/agents/'+IDS.A1+'/workload')).j.data;const d={};for(const x of r.departments)d[x.department_name]=x.open_tickets;return d;};
const wDA=async()=>(await wl())['QA AS6 Dept A'];
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
o.w0=await wl();o.holdStatus=(await getT(HOLD)).status;
o.on=(await setActive(IDS.RR_F14,true)).s;LED('F-14: rule QA AS6 F14 threshold active temporarily');
const setT=async T=>sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:true,agent_thresholds:[{user_id:IDS.A1,threshold:T}]})).s;
LED('F-14: Dept A prefs temporarily: offline allowed, agent threshold A1');
const probe=async(label,T)=>{const p=await setT(T);const t=await mkTicket('QA AS6 F14 probe '+label,IDS.DA,{},'F-14');await sleep(4000);const ow=nm((await own(t.id)).owner);if(ow==='-')await api('POST','/desk/tickets/'+t.id+'/assign',{owner_id:IDS.A2,team_id:null});return {T,pref:p,owner:ow};};
// unassigned probe tickets are given to A2 right away so they do not stay in Dept A backlog
const s=[];
// 1) same count as workload (hold ticket currently On Hold)
let w=await wDA();s.push({step:'T = workload',w,...await probe('a',w)});
w=await wDA();s.push({step:'T = workload+1',w,...await probe('b',w+1)});
// 2) On Hold: switch the hold ticket to Open and back, read workload each time
await patchT(HOLD,{status:'Open'});await sleep(1500);const wOpen=await wDA();await patchT(HOLD,{status:'On Hold'});await sleep(1500);const wHold=await wDA();
s.push({step:'workload with F14 ticket Open vs On Hold',wOpen,wHold});
// 3) Closed: close one A1 QA ticket in Dept A (the probe 'b' ticket if assigned to A1)
const pb=idOf('QA AS6 F14 probe b');let wc0=await wDA();const cl=sh(await patchT(pb,{status:'Closed'})).s;await sleep(1500);let wc1=await wDA();
s.push({step:'close probe b',closeStatus:cl,before:wc0,after:wc1});
s.push({step:'after close, T = workload+1',w:wc1,...await probe('c',wc1+1)});
o.steps=s;o.wEnd=await wl();
o.off=(await setActive(IDS.RR_F14,false)).s;LED('F-14: rule QA AS6 F14 threshold inactive');
o.prefBack=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s;LED('F-14: Dept A prefs restored');
o.prefSame=JSON.stringify((await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data)===JSON.stringify(pr0);
return o;
