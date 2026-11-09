eval(require('fs').readFileSync('lib.js','utf8'));
const fs2=require('fs'); const OUT='../out/';
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||x.slice(0,8)):'-';
const pres=async(m)=>{fs2.writeFileSync(OUT+'presence-ctl.json',JSON.stringify(m));await W(12000);const r=await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]});return (r.j.data.agents||[]).map(a=>nm(a.user_id)+':'+JSON.stringify(a.presence.online)+'/'+JSON.stringify(a.presence.channels.email)).join(' ');};
const aa=async id=>{const a=await act(id);return Array.isArray(a)?a.filter(x=>/auto_assigned|backlog/.test(x.action)).map(x=>x.action.replace('ticket.','')+' '+nm(x.summary.owner_id)+' '+x.summary.trigger+' '+x.summary.strategy+' skipped='+JSON.stringify((x.summary.skipped_user_ids||[]).map(nm))):a;};
const rrU=async(sub)=>{const t=await mkTicket(sub,IDS.DA);await unassign(t.id);await W(2500);await patchT(t.id,{priority:'Low'});await W(4000);const o=await own(t.id);return {id:t.id,owner:nm(o.owner),aa:await aa(t.id)};};
const agentDo=async(who,m,p,b)=>{const id='d'+Date.now();fs2.writeFileSync(OUT+'agent-do.json',JSON.stringify([{id,who,m,p,body:b}]));for(let i=0;i<30;i++){await W(1000);const s=fs2.existsSync(OUT+'agent-do-result.json')?fs2.readFileSync(OUT+'agent-do-result.json','utf8'):'';const line=s.split('\n').find(l=>l.includes('"'+id+'"'));if(line)return JSON.parse(line);}return 'timeout';};
const P0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
const setP=async(patch)=>{const r=await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...P0,...patch});LED('Dept A RR prefs '+JSON.stringify(patch));return {s:r.s,e:E(r)};};
RES.P0=P0;
await cs('RR-10b email channel off (clean)',async()=>{const p=await pres({a1:'on',a2:'off',a3:'on'});const L=[];for(let i=1;i<=3;i++)L.push(await rrU('QA AS6 SEQ emailoff '+i));return {p,L};});
await cs('E-16d all signed out → backlog',async()=>{const p=await pres({a1:'out',a2:'out',a3:'out'});const t=await rrU('QA AS6 SEQ backlog D');IDS.TK_BL_D=t.id;return {p,t};});
await cs('F-01b assign to offline agents on',async()=>{const s=await setP({assign_to_offline_agents:true});const t=await rrU('QA AS6 SEQ offline-allowed');const s2=await setP({});return {s,t,restore:s2.s};});
await cs('F-08 assign on closure',async()=>{const s=await setP({assign_on_closure:true});const p=await pres({a1:'out',a2:'out',a3:'on'});
 // a ticket owned by A3 to close
 const c=await mkTicket('QA AS6 F08 to close',IDS.DA,{owner:IDS.A3});await W(1500);const before=await own(IDS.TK_BL_D);
 const cl=await agentDo('a3','PATCH','/modules/'+T+'/records/'+c.id,body({status:'Closed'}));const t0=Date.now();let after=null;for(let i=0;i<12;i++){await W(5000);after=await own(IDS.TK_BL_D);if(after.owner)break;}
 return {s,p,before,close:cl&&cl.s,closeT:cl&&cl.t&&cl.t.slice(0,150),after:nm(after.owner),secs:Math.round((Date.now()-t0)/1000),aa:await aa(IDS.TK_BL_D)};});
await cs('F-08b closure off → nothing',async()=>{const s=await setP({assign_on_closure:false});const p=await pres({a1:'out',a2:'out',a3:'on'});const t=await rrU('QA AS6 SEQ backlog E');IDS.TK_BL_E=t.id;const c=await mkTicket('QA AS6 F08b to close',IDS.DA,{owner:IDS.A3});const cl=await agentDo('a3','PATCH','/modules/'+T+'/records/'+c.id,body({status:'Closed'}));await W(30000);return {s,p,t,close:cl&&cl.s,after:await own(IDS.TK_BL_E)};});
await cs('E-17 RR master off: no RR, backlog not processed',async()=>{const p=await pres({a1:'on',a2:'on',a3:'on'});const ns=(await api('GET','/desk/assignment/notification-settings')).j.data;const m=sh(await api('PUT','/desk/assignment/notification-settings',{...ns,round_robin_rules_enabled:false}));LED('RR master OFF');
 const s=await setP({assign_backlogs:true,backlog_limit:5});const t=await rrU('QA AS6 SEQ rr master off');await W(75000);const bl=await own(IDS.TK_BL_E);
 const m2=sh(await api('PUT','/desk/assignment/notification-settings',{...ns,round_robin_rules_enabled:true}));LED('RR master restored ON');let bl2=null;for(let i=0;i<10;i++){await W(10000);bl2=await own(IDS.TK_BL_E);if(bl2.owner)break;}
 return {master:m.s,me:m.e,t,backlogWhileOff:nm(bl.owner),restore:m2.s,backlogAfterOn:nm(bl2.owner)};});
await setP({}); fs2.writeFileSync(OUT+'presence-ctl.json',JSON.stringify({a1:'on',a2:'on',a3:'on'})); saveIds(); return RES;
