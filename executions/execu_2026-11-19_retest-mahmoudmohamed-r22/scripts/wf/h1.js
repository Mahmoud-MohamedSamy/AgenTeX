eval(fs.readFileSync('wf/lib.js','utf8'));const L=x=>Array.isArray(x)?x:(x?.items||[]);
const id='2d2bb448-b96e-44b5-9b7d-56137e07e887';const o={};
const h=async()=>L((await api('GET',`/desk/tickets/${id}/history`)).j?.data).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+(x.field_key||''));
o.before=await h();
const p=await api('PATCH',`/modules/${T}/records/${id}`,{data:[{field:'priority',value:enc('urgent')}]});o.patch=p.s;led('ticket H0 2d2bb448 priority high->urgent (history probe)');
await sleep(15000);o.afterPatch=await h();
const a=await api('POST',`/desk/tickets/${id}/assign`,{owner_id:'5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4'});o.assign=a.s;led('ticket H0 2d2bb448 owner -> Dev Team 2? no: dept QA RT19 WF Dept (history probe) '+a.s);
await sleep(15000);o.afterAssign=await h();o.num=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;
// one mgr seq ticket
const s=fs.readFileSync('../ledger.md','utf8').match(/2997 seq t2" ([0-9a-f-]{36})/)[1];o.seqT2=L((await api('GET',`/desk/tickets/${s}/history`)).j?.data).map(x=>x.occurred_at.slice(11,19)+' '+x.action);o.seqT2num=(await api('GET','/desk/tickets/'+s)).j?.data?.ticket_number;
return o;
