eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const tag='F02 seq2';const tk=[];for(let i=1;i<=4;i++)tk.push(await mkTicket(tag,{department:QAO,priority:'low'},'t'+i));
await sleep(8000);o.start=now();
const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});o.rule=r.res+' '+r.id;
o.seq=[];
for(const t of tk){const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc('high')}]});const at=now();const snaps=[];for(const w of [2,6,12,20]){await sleep(w===2?2000:(w===6?4000:(w===12?6000:8000)));snaps.push(w+'s:'+U((await getTicket(t.id)).owner)+'/ex'+(await execsRaw(t.id)).filter(e=>e.ruleId===r.id).length);}o.seq.push(t.id.slice(0,8)+' #'+t.num+' patch'+p.s+' '+at+' '+snaps.join(' '));}
o.deact=await deact(r.id);for(let k=0;k<3&&!String(o.deact).startsWith('204');k++){await sleep(5000);o.deact=await deact(r.id);}o.end=now();
await sleep(15000);
o.final=[];for(const t of tk){const g=await getTicket(t.id);const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o.final.push({id:t.id,num:g._number||g.ticket_number,owner:U(g.owner),runs:ex.map(e=>({id:e.id,corr:e.correlationId||e.correlation_id,cause:e.causationId||e.triggerSource||e.origin,out:e.outcome,at:e.startedAt||e.createdAt,d:e.dispatches.map(d=>d.actionType+':'+d.status+' '+JSON.stringify(d.result||d.details||d.output||'').slice(0,160))}))});}
fs.writeFileSync(OUTD+'f02b-ids.json',JSON.stringify({rule:r.id,ts:tk.map(t=>t.id)}));
save('f02b',o);return o;
