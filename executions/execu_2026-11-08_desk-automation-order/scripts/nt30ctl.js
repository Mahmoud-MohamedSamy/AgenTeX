// NT-30 positive control: reactivate, repeat comment on T1 and a team ticket -> mails expected.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const R={};
R.reactivate=(await api('PATCH','/iam/users/'+U,{status:'Active'})).s;R.at=new Date().toISOString().slice(11,19);await sleep(60000);
const q=(await api('GET','/desk/queues/agents')).j;R.listStatus=(q?.data?.agents||q?.data||[]).find(x=>(x.user_id||x.id)===U)?.status;
R.comment=(await api('POST','/desk/tickets/'+n.tickets[0]+'/comments',{body_html:'<p>QA AO '+n.u+' comment while active (control)</p>',is_public:false})).s;R.commentAt=new Date().toISOString().slice(11,19);
const r=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+n.u+' T4 team control active'),f('description','QA AO '+n.u+' T4'),f('department',A),f('status','Open'),f('priority','high'),f('team',n.team),{field:'owner',value:{kind:'null'}}]});
if(r.j?.data?.id){n.tickets.push(r.j.data.id);fs.writeFileSync('../nt30.json',JSON.stringify(n));}await sleep(5000);
const x=(await api('GET','/modules/'+M+'/records/'+r.j?.data?.id)).j?.data?.data||[];R.t4={s:r.s,num:x.find(e=>e.field==='ticket_number')?.value?.value,at:new Date().toISOString().slice(11,19)};
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30 control: agent reactivated, comment on T1, team ticket T4 #'+R.t4.num+'.\n');return R;
