eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const tag='2997 seq';const tk=[];for(let i=1;i<=4;i++)tk.push(await mkTicket(tag,{department:QAO,priority:'low'},'t'+i));
await sleep(8000);
const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});
o.seq=[];
for(const t of tk){const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc('high')}]});const snaps=[];for(const w of [2,6,12,20]){await sleep(w===2?2000:(w===6?4000:(w===12?6000:8000)));snaps.push(w+'s:'+U((await getTicket(t.id)).owner)+'/ex'+(await execsRaw(t.id)).filter(e=>e.ruleId===r.id).length);}o.seq.push(t.id.slice(0,8)+' patch'+p.s+' '+snaps.join(' '));}
o.deact=await deact(r.id);
// on-create control: person-created ticket keeps creator
const r2=await mkRule('2997 oncreate',{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR}],{isActive:true,departmentIds:[QAO]});
const c=await mkTicket('2997 oncreate',{department:QAO},'t1');await sleep(20000);const g=await getTicket(c.id);
o.onCreate={owner:U(g.owner),ex:(await execsRaw(c.id)).filter(e=>e.ruleId===r2.id).map(e=>e.outcome+' '+e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')).join(';'))};
o.deact2=await deact(r2.id);
save('r2997b',o);return o;
