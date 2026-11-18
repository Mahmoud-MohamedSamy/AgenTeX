eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',RID='47752153-cc19-4572-90e2-bb487f25f45e';
const tags=(await api('GET','/desk/tags?take=500')).j?.data?.tags||[];const TN=id=>{const t=tags.find(x=>x.id===id);return t?t.name+'@'+(t.department_id===QAO?'QAO':t.department_id.slice(0,8)):id;};
o.act=await act(RID)+' '+now();
const t=await mkTicket('F03',{department:QAO,priority:'low'},'tag pick');await sleep(5000);
const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc('high')}]});o.patch=p.s+' '+now();
await sleep(20000);
o.ex=(await execsRaw(t.id)).filter(e=>e.ruleId===RID).map(e=>({id:e.id,out:e.outcome,det:e.details,d:e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:''))}));
const tt=(await api('GET',`/desk/tickets/${t.id}/tags`)).j?.data;o.ticketTags=(tt?.tags||[]).map(x=>x.name+'@'+(x.department_id===QAO?'QAO':x.department_id.slice(0,8)));
o.deact=await deact(RID);o.tid=t.id;o.num=(await api('GET','/desk/tickets/'+t.id)).j?.data?.ticket_number;save('f03c',o);return o;
