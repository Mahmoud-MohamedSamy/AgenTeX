eval(fs.readFileSync('w2/lib.js','utf8'));
const o={};const MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const tag='2997 rapid';const tk=[];for(let i=1;i<=3;i++)tk.push(await mkTicket(tag,{department:QAO,priority:'low'},'t'+i));
await sleep(8000);
const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});
o.rule=r.id;o.tickets=tk.map(t=>t.id);o.steps=[];
const pr=['high','medium','urgent','low'];let edits=0;
for(let round=0;round<4;round++){
 // fire all 3 tickets' edits at once (parallel) to load Desk
 const ps=await Promise.all(tk.map(t=>api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc(pr[round])}]})));edits+=3;
 const s1=[];for(const t of tk)s1.push(U((await getTicket(t.id)).owner));
 await sleep(12000);
 const s2=[];for(const t of tk){const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);s2.push(U((await getTicket(t.id)).owner)+'/runs'+ex.length);}
 o.steps.push(`round${round+1} patch ${ps.map(p=>p.s).join(',')} ~1s: ${s1.join(' | ')}  12s: ${s2.join(' | ')}`);
}
await sleep(25000);
o.final=[];const all=[];
for(const t of tk){const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);const corr=ex.map(e=>e.correlationId);const ids=ex.map(e=>e.id);
 ex.forEach(e=>all.push([e.evaluatedAt,t.id.slice(0,8)]));
 o.final.push({t:t.id.slice(0,8),owner:U((await getTicket(t.id)).owner),runs:ex.length,corrIsOtherRun:corr.filter(c=>ids.includes(c)).length,uniqueCorr:new Set(corr).size});}
o.edits=edits;
o.deact=await deact(r.id);
save('a3',o);return o;
