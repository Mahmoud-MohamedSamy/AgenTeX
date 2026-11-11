// NT-30 (user OK 11 Nov): suspended agent / team with only a suspended member -> no mail, no error. Data in ../nt30.json; cleanup nt30-clean.js.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u='NT30'+Math.random().toString(36).slice(2,6);const R={u};n.u=u;n.tickets=[];
const save=()=>fs.writeFileSync('../nt30.json',JSON.stringify(n));const L1=s=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30 '+s+'\n');
const d=(await api('GET','/desk/departments/'+A)).j.data;n.deptOrig=d.agent_user_ids;save();
R.addDept=(await api('PUT','/desk/departments/'+A+'/agents',{agent_user_ids:[...new Set([...d.agent_user_ids,U])]})).s;L1('agent added to QA AO Dept A '+R.addDept);
const tm=await api('POST','/desk/teams',{name:'QA AO NT30 team '+u,department_id:A,member_user_ids:[U]});R.team=tm.s+(tm.s>=300?' '+tm.t.slice(0,200):'');n.team=tm.j?.data?.id;save();if(n.team)L1('team '+n.team);
const tk=async(tag,extra)=>{const r=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+u+' '+tag),f('description','QA AO '+u+' '+tag),f('department',A),f('status','Open'),f('priority','high'),...extra]});const id=r.j?.data?.id;if(id){n.tickets.push(id);save();}await sleep(6000);
 const x=id?((await api('GET','/modules/'+M+'/records/'+id)).j?.data?.data||[]):[];const g=k=>x.find(e=>e.field===k)?.value?.value;return {s:r.s,err:r.s>=300?r.t.slice(0,220):undefined,id,num:g('ticket_number'),owner:g('owner')===U?'NT30':(g('owner')||'none'),team:g('team')===n.team&&n.team?'NT30 team':(g('team')||'none'),at:new Date().toISOString().slice(11,19)};};
R.t1_control=await tk('T1 control owner active',[f('owner',U)]);L1('T1 #'+R.t1_control.num);
const sus=await api('PATCH','/iam/users/'+U,{status:'Suspended'});R.suspend=sus.s;R.suspendedAt=new Date().toISOString().slice(11,19);L1('agent suspended '+sus.s);await sleep(5000);
const q=(await api('GET','/desk/queues/agents')).j;const ql=q?.data?.agents||q?.data||[];R.inQueueList=ql.some(x=>(x.user_id||x.id)===U);
const c=await api('POST','/desk/tickets/'+R.t1_control.id+'/comments',{body_html:'<p>QA AO '+u+' comment after suspension</p>',is_public:false});R.t1_comment=c.s+(c.s>=300?' '+c.t.slice(0,200):'');
R.t2_assign_suspended=await tk('T2 owner suspended',[f('owner',U)]);
if(n.team)R.t3_team=await tk('T3 team with suspended member',[f('team',n.team),{field:'owner',value:{kind:'null'}}]);
await sleep(8000);
for(const k of ['t1_control','t2_assign_suspended','t3_team']){const t=R[k];if(!t?.id)continue;const j=(await api('GET','/desk/tickets/'+t.id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);t.feed=L.map(e=>(e.action||'')+'@'+(e.occurred_at||'').slice(11,19)).join(' ');}
return R;
