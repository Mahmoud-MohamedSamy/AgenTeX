eval(fs.readFileSync('w2/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0',MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',DADM='44444444-4444-4444-4444-444444444401';
const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id):'none';
const L=x=>Array.isArray(x)?x:(x?.items||[]);
const cases=[['ouCS',{ownerTargetKind:'OrgUnitRoundRobin',ownerValue:CEO},CS,3],['ouQAO',{ownerTargetKind:'OrgUnitRoundRobin',ownerValue:CEO},QAO,2],['prEmpty',{ownerTargetKind:'RoleRoundRobin',ownerValue:DADM},D,1],['prQAO',{ownerTargetKind:'RoleRoundRobin',ownerValue:DADM},QAO,3],['mgrQAO',{ownerTargetKind:'OrgUnitRoundRobin',ownerValue:MGR},QAO,4]];
const only=process.env.ONLY;
for(const [tag0,a,dept,n] of cases){if(only&&!only.split(',').includes(tag0))continue;const tag='2997 '+tag0;
 const tk=[];for(let i=1;i<=n;i++){const t=await mkTicket(tag,{department:dept,priority:'low'},'t'+i);tk.push(t);}
 await sleep(8000);
 const r=await mkRule(tag,{kind:'RecordUpdated'},[{type:'OwnerAssignment',...a}],{isActive:true,departmentIds:[dept]});if(!r.id){o[tag0]=r.res;continue;}
 const before=[];for(const t of tk)before.push(U((await getTicket(t.id)).owner));
 for(const t of tk){const p=await api('PATCH',`/modules/${T}/records/${t.id}`,{data:[{field:'priority',value:enc('high')}]});t.p=p.s;await sleep(3000);}
 await sleep(20000);
 const res=[];for(const t of tk){const g=await getTicket(t.id);const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);const h=L((await api('GET',`/desk/tickets/${t.id}/history`)).j?.data).map(x=>x.action.replace('ticket.',''));res.push({num:t.num||g._number,patch:t.p,ownerAfter:U(g.owner),ex:ex.map(e=>e.outcome+' '+e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')).join(';')),hist:h.join(',')});}
 o[tag0]={rule:r.id,before,res};o[tag0].deact=await deact(r.id);save('r2997-'+tag0,o[tag0]);
}
return o;
