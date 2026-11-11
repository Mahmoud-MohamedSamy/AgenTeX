const U=JSON.parse(fs.readFileSync('../a4/u1.json','utf8'));const C=JSON.parse(fs.readFileSync('../a4/close.json','utf8'));const G='mahmoud.mmohamedsamy+wfp@gmail.com';const R={};
const L=JSON.parse(fs.readFileSync('../a4/ledger.json','utf8'));const bId=L.filter(x=>x.tag==='close desk-api').pop().id;
R.b={close:(await api('POST','/desk/tickets/'+bId+'/close',{})).s};
const ru=await mkRule('C3',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{status:{kind:'string',stringValue:'Closed'}}}]);R.rule=ru.s+(ru.err||'');
const r=await api('POST',`/modules/${T}/records`,{data:Object.entries({subject:'QA AO WF C3 closed by a workflow rule',status:'Open',department:D,contact_id:U.CID,email:G,channel:'email'}).map(([k,v])=>({field:k,value:enc(v)}))});const cid=r.j?.data?.id;if(cid)track('ticket',cid,'C3');
await sleep(25000);
for(const [k,id] of [['b',bId],['c3',cid]]){R[k]=R[k]||{};const x=(await api('GET',`/modules/${T}/records/${id}`)).j?.data?.data||[];R[k].num=val((x.find(e=>e.field==='ticket_number')||{}).value);R[k].status=val((x.find(e=>e.field==='status')||{}).value);
 R[k].rating=arr2((await api('GET','/desk/tickets/'+id+'/happiness-ratings')).j?.data).map(z=>z.status+' '+z.trigger);
 R[k].history=arr2((await api('GET','/desk/tickets/'+id+'/history')).j?.data).slice(0,6).map(z=>z.action+' src='+(z.source||''));}
R.c3exec=(await execs(cid)).filter(e=>e.rule===ru.id).map(e=>e.outcome+' '+e.actions.join(','));
fs.writeFileSync('../a4/close2.json',JSON.stringify(R,null,1));return R;
