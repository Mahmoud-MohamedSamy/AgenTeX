// NT-30 team redo: team member set through team sources [{kind:agent}] (the create call ignored member_user_ids). Active team ticket T9 -> mail expected; suspended team ticket T10 -> no mail.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const now=()=>new Date().toISOString().slice(11,19);const R={};
const mem=async()=>(await api('GET','/desk/teams/'+n.team)).j?.data?.member_user_ids||[];
R.reactivate=(await api('PATCH','/iam/users/'+U,{status:'Active'})).s;await sleep(5000);
const tm=(await api('GET','/desk/teams/'+n.team)).j.data.team;const p=await api('PUT','/desk/teams/'+n.team,{name:tm.name,description:tm.description,department_id:tm.department_id,sources:[{kind:'agent',ref_id:U}]});R.setMembers=p.s+(p.s>=300?' '+p.t.slice(0,200):'');R.membersActive=(await mem()).includes(U);if(!R.membersActive)return R;
const tk=async tag=>{const r=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+n.u+' '+tag),f('description','QA AO '+n.u+' '+tag),f('department',A),f('status','Open'),f('priority','high'),f('team',n.team),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;if(id){n.tickets.push(id);fs.writeFileSync('../nt30.json',JSON.stringify(n));}await sleep(4000);
 const x=id?((await api('GET','/modules/'+M+'/records/'+id)).j?.data?.data||[]):[];return {s:r.s,num:x.find(e=>e.field==='ticket_number')?.value?.value,team:x.find(e=>e.field==='team')?.value?.value===n.team,at:now()};};
R.t9_active=await tk('T9 team ticket, member ACTIVE');await sleep(60000);
R.suspend=(await api('PATCH','/iam/users/'+U,{status:'Suspended'})).s+' @'+now();await sleep(10000);R.membersAfterSuspend=(await mem()).includes(U);
R.t10_suspended=await tk('T10 team ticket, member SUSPENDED');
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30 team redo: member set, #'+R.t9_active.num+' active, #'+R.t10_suspended.num+' suspended.\n');return R;
