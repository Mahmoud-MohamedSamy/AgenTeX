eval(require('fs').readFileSync('lib.js','utf8'));
const fs2=require('fs'); const CTL='../out/presence-ctl.json';
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||x.slice(0,8)):'-';
const pres=async(m)=>{fs2.writeFileSync(CTL,JSON.stringify(m));await W(9000);const r=await api('POST','/desk/agents/presence/query',{user_ids:[IDS.A1,IDS.A2,IDS.A3]});return (r.j.data.agents||[]).map(a=>nm(a.user_id)+':'+JSON.stringify(a.presence.online)+'/'+JSON.stringify(a.presence.channels.email)).join(' ');};
const aa=async id=>{const a=await act(id);return Array.isArray(a)?a.filter(x=>x.action==='ticket.auto_assigned').map(x=>nm(x.summary.owner_id)+' '+x.summary.trigger+' '+x.summary.strategy+' skipped='+JSON.stringify((x.summary.skipped_user_ids||[]).map(nm))):a;};
// update-only path: create with owner A1 explicitly? No: create, unassign, then patch. Rules are update-only so the create job never races.
const rrU=async(sub)=>{const t=await mkTicket(sub,IDS.DA);await unassign(t.id);await W(2500);const mid=await own(t.id);await patchT(t.id,{priority:'Low'});await W(3500);const o=await own(t.id);return {id:t.id,mid:nm(mid.owner),owner:nm(o.owner),aa:await aa(t.id)};};
RES.prefsDA=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
RES.ruleUpd=[(await putRule(IDS.RR_SEQ,{execute_on:['update']})).s,(await putRule(IDS.RR_TEAM,{execute_on:['update']})).s,(await putRule(IDS.RR_LOAD,{execute_on:['update']})).s];
await cs('E-09b seq update-only',async()=>{const p=await pres({a1:'on',a2:'on',a3:'on'});const L=[];for(let i=1;i<=3;i++)L.push(await rrU('QA AS6 SEQ u'+i));return {p,L};});
await cs('E-12b A2 offline',async()=>{const p=await pres({a1:'on',a2:'off',a3:'on'});const L=[];for(let i=1;i<=3;i++)L.push(await rrU('QA AS6 SEQ off-u'+i));return {p,L};});
await cs('E-16b all offline',async()=>{const p=await pres({a1:'off',a2:'off',a3:'off'});const t=await rrU('QA AS6 SEQ alloff-u');IDS.TK_BACKLOG2=t.id;return {p,t};});
await cs('E-10b team order',async()=>{const p=await pres({a1:'on',a2:'on',a3:'on'});const g=await getRule(IDS.RR_TEAM);const u=await putRule(IDS.RR_TEAM,{targets:[{...g.targets[0],pool:{...g.targets[0].pool,excluded_user_ids:[]}}]});const L=[];for(let i=1;i<=4;i++)L.push(await rrU('QA AS6 TEAMRR u'+i));return {p,u:u.s,L:L.map(x=>x.owner+' ['+x.aa+']')};});
await cs('E-11b pool reset',async()=>{const a=[];for(let i=1;i<=2;i++)a.push((await rrU('QA AS6 SEQ r'+i)).owner);const g=await getRule(IDS.RR_SEQ);const u1=await putRule(IDS.RR_SEQ,{targets:[{...g.targets[0],pool:{...g.targets[0].pool,user_ids:[IDS.A1,IDS.A2,IDS.A3,IDS.O]}}]});const b=[];for(let i=1;i<=3;i++)b.push((await rrU('QA AS6 SEQ r after'+i)).owner);const g2=await getRule(IDS.RR_SEQ);const u2=await putRule(IDS.RR_SEQ,{targets:[{...g2.targets[0],pool:{...g2.targets[0].pool,user_ids:[IDS.A1,IDS.A2,IDS.A3]}}]});return {before:a.join(','),addO:u1.s,addE:u1.e,after:b.join(','),restore:u2.s};});
saveIds(); return RES;
