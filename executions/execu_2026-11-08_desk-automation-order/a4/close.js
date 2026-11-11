// #2944 follow-up: which close path issues the closed mail / rating request? (no rules involved; tickets in QA AO Dept A for the portal contact)
const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const G='mahmoud.mmohamedsamy+wfp@gmail.com';const R={};
const nr=(await api('GET','/desk/notification-rules/departments/'+D)).j?.data?.rules||[];R.closedRule=nr.filter(x=>/closed/.test(x.key)).map(x=>x.key+' on='+x.is_enabled);
const mk=async t=>{const r=await api('POST',`/modules/${T}/records`,{data:Object.entries({subject:'QA AO WF close test '+t,status:'Open',department:D,contact_id:U.CID,email:G,channel:'email'}).map(([k,v])=>({field:k,value:enc(v)}))});const id=r.j?.data?.id;if(id)track('ticket',id,'close '+t);await sleep(3000);const x=(await api('GET',`/modules/${T}/records/${id}`)).j?.data?.data||[];return {id,num:val((x.find(e=>e.field==='ticket_number')||{}).value)};};
const a=await mk('records-api');const b=await mk('desk-api');
R.a={num:a.num,close:await patchTicket(a.id,{status:'Closed'})};
let c=await api('PATCH','/desk/tickets/'+b.id,{status:'Closed'});if(c.s>=400)c=await api('POST','/desk/tickets/'+b.id+'/close',{});R.b={num:b.num,close:c.s+' '+(c.s>=300?c.t.slice(0,150):'')};
await sleep(20000);
for(const [k,x] of [['a',a],['b',b]]){R[k].rating=arr2((await api('GET','/desk/tickets/'+x.id+'/happiness-ratings')).j?.data).map(z=>z.status+' '+z.trigger);
 const h=arr2((await api('GET','/desk/tickets/'+x.id+'/history')).j?.data).map(z=>z.action+(z.field_key?':'+z.field_key:'')+' src='+(z.source||''));R[k].history=h.slice(0,8);
 const tk=(await api('GET','/desk/tickets/'+x.id)).j?.data||{};R[k].status=tk.status;}
fs.writeFileSync('../a4/close.json',JSON.stringify(R,null,1));return R;
