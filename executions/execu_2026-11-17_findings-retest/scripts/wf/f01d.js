eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const L=x=>Array.isArray(x)?x:(x?.items||x?.events||[]);
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id.slice(0,8)):'none';
const RR=(await api('GET','/desk/assignment-rules/2a700860-'+'x')).s; // placeholder
const rules=(await api('GET','/desk/assignment-rules?type=round_robin')).j?.data?.rules||[];const rr=rules.find(r=>r.id.startsWith('2a700860'));
o.rr=rr.name+' active='+rr.is_active+' dept='+rr.department_id+' pool='+rr.targets[0].pool.user_ids.map(U).join(',');
// 1 number + history + close
const t=await mkTicket('F01',{priority:'low'},'health probe');o.create=t.s+' at '+now();
for(let i=0;i<12;i++){await sleep(5000);const d=(await api('GET','/desk/tickets/'+t.id)).j?.data;if(d?.ticket_number){o.number='#'+d.ticket_number+' after ~'+(i+1)*5+'s ('+now()+')';break;}}
const p1=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'status',value:enc('On Hold')}]});o.onhold=p1.s+' '+now()+(p1.s>=300?' '+p1.t.slice(0,200):'');
await sleep(5000);
const p2=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'status',value:enc('Closed')}]});o.closed=p2.s+' '+now()+(p2.s>=300?' '+p2.t.slice(0,200):'');
await sleep(30000);
const d=(await api('GET','/desk/tickets/'+t.id)).j?.data||{};o.after={status:d.status,closed_time:d.closed_time,resolution_time:d.resolution_time,keys:Object.keys(d).filter(k=>/clos|resol/.test(k)).join(',')};
const h=L((await api('GET',`/desk/tickets/${t.id}/history`)).j?.data);o.hist=h.map(x=>x.action+' '+(x.created_at||x.at||'')+' '+JSON.stringify(x.changes||x.details||'').slice(0,120));
// 2 round robin (rule fires on update, subject contains QA AS6 SEQ)
const r2=await mkTicket('F01',{department:rr.department_id,priority:'low'},'QA AS6 SEQ rr probe');o.rrTicket=r2.s+' '+now();await sleep(6000);
const g0=await getTicket(r2.id);o.rrOwnerBefore=U(g0.owner);
const p3=await api('PATCH',`/modules/${T}/records/${r2.id}`,{data:[{field:'priority',value:enc('high')}]});o.rrPatch=p3.s+' '+now();
for(let i=0;i<8;i++){await sleep(5000);const g=await getTicket(r2.id);if(g.owner&&g.owner!==g0.owner){o.rrOwnerAfter=U(g.owner)+' after ~'+(i+1)*5+'s ('+now()+')';break;}o.rrOwnerAfter='unchanged '+U(g.owner)+' at '+now();}
const h2=L((await api('GET',`/desk/tickets/${r2.id}/history`)).j?.data);o.rrHist=h2.map(x=>x.action+' '+JSON.stringify(x.changes||x.details||x.description||'').slice(0,160));
o.ids={t:t.id,r2:r2.id,n2:(await api('GET','/desk/tickets/'+r2.id)).j?.data?.ticket_number};save('f01d',o);return o;
