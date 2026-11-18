eval(fs.readFileSync('w2/lib.js','utf8'));
const o={};const MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const tag='2997 refire';const tk=[];for(let i=1;i<=3;i++)tk.push(await mkTicket(tag,{department:QAO,priority:'low'},'t'+i));
await sleep(8000);
const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});
o.rule=r.id;o.tickets=tk.map(t=>t.id+' #'+t.num);o.steps=[];
const pr=['high','medium','urgent'];
for(let round=0;round<3;round++)for(const t of tk){const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc(pr[round])}]});await sleep(9000);const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o.steps.push(`${t.num} edit${round+1} patch${p.s} owner=${U((await getTicket(t.id)).owner)} runs=${ex.length}`);}
await sleep(20000);
o.final=[];for(const t of tk){const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);o.final.push({num:t.num,owner:U((await getTicket(t.id)).owner),runs:ex.length,ex:ex.map(e=>({id:e.id?.slice(0,8),at:e.startedAt||e.createdAt,outcome:e.outcome,corr:e.correlationId?.slice?.(0,8),keys:Object.keys(e).join(','),d:(e.dispatches||[]).map(d=>d.actionType+':'+d.status+' '+JSON.stringify(d.result||d.output||d.summary||'').slice(0,200))}))});}
o.deact=await deact(r.id);
save('a1',o);return o;
