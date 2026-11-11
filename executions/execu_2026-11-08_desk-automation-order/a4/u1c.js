const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const G='mahmoud.mmohamedsamy+wfp@gmail.com';
const s=await mkRule('U1 P5',{kind:'RecordCreated'},[{type:'SendHappinessEmail'}],{name:'QA AO WF U1 P5 send rating mail'});
const r=await api('POST',`/modules/${T}/records`,{data:Object.entries({subject:'QA AO WF U1 P5 rating test 2, please rate Good',status:'Open',department:D,contact_id:U.CID,email:G,channel:'email'}).map(([k,v])=>({field:k,value:enc(v)}))});
const id=r.j?.data?.id;if(id)track('ticket',id,'U1 P5 b');await sleep(15000);const x=(await api('GET',`/modules/${T}/records/${id}`)).j?.data?.data||[];
const num=val((x.find(e=>e.field==='ticket_number')||{}).value);U.tickets['U1 P5 b']={id,num};fs.writeFileSync('../a4/u1.json',JSON.stringify(U,null,1));
const ex=arr2((await api('GET','/workflow/executions?recordId='+id)).j?.data).filter(e=>e.outcome==='Fired').map(e=>e.triggerKind+' '+(e.dispatches||[]).map(d=>d.actionType+':'+d.status).join(','));
const rr=arr2((await api('GET','/desk/tickets/'+id+'/happiness-ratings')).j?.data).map(z=>z.status);
return {rule:s.s,ticket:r.s,num,ex,ratingIssued:rr};
