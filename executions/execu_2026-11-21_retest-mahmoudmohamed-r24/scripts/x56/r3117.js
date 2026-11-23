const A='5c68004d-860c-4bcd-b6b8-77e0bce5c044',C='9ec8bdc5-2362-4386-a4cd-e5bee332d0c7';const o={};
for(const [k,id] of [['t5117',A],['t4869',C]]){const t=(await api('GET','/desk/tickets/'+id)).j?.data||{};const b=await bstate(id);o[k]={num:t.ticket_number,priority:t.priority,owner:t.owner_id===AG_A?'CES2':t.owner_id,bp:b&&(b.stateId||b.state_id||JSON.stringify(b).slice(0,120))};}
o.offered5117=JSON.stringify(await trans(A));
const r1=await runT(A,'end','Escalated');o.runEnd=E(r1);
const r2=await runT(C,'admin','Open');o.runAdmin=E(r2);
o.after5117=JSON.stringify(await bstate(A)).slice(0,160);
return o;
