eval(fs.readFileSync('w2/lib.js','utf8'));
const MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const tag='2997 seq';const tk=[];for(let i=1;i<=3;i++)tk.push(await mkTicket(tag,{department:QAO,priority:'low'},'t'+i));
await sleep(8000);
const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});
const P=['high','medium','low'];const seq=[];
// A: one at a time, 3 rounds
for(let k=0;k<3;k++)for(const t of tk){const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc(P[k])}]});await sleep(6000);const g=await getTicket(t.id);seq.push({round:'A'+(k+1),t:t.num||g._number||t.id.slice(0,8),patch:p.s,owner:U(g.owner)});}
await sleep(15000);
// B: all three together, 2 rounds
const par=[];for(let k=0;k<2;k++){await Promise.all(tk.map(t=>api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc(k?'urgent':'high')}]})));await sleep(20000);for(const t of tk){const g=await getTicket(t.id);par.push({round:'B'+(k+1),t:t.id.slice(0,8),owner:U(g.owner)});}}
await sleep(10000);
const per=[];for(const t of tk){const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);const h=arr((await api('GET',`/desk/tickets/${t.id}/history`)).j?.data);
 per.push({t:t.id.slice(0,8),runs:ex.length,corr:new Set(ex.map(e=>e.correlationId||e.id)).size,outcomes:ex.map(e=>e.outcome+':'+e.dispatches.map(d=>d.status).join(';')),ownerChanges:h.filter(x=>x.action==='ticket.owner_changed').length,ruleRan:h.filter(x=>x.action==='ticket.workflow_rule_ran').length,finalOwner:U((await getTicket(t.id)).owner)});}
const o={rule:r.id,tickets:tk.map(t=>t.id),seq,par,per};o.deact=await deact(r.id);save('seq2997',o);return o;
