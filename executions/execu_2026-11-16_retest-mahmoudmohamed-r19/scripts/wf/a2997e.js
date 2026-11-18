eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';const U={'5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4':'DevTeam2','876ce871-2b02-4854-89a7-68050391c62b':'TestUser1','97be04b6-0a08-4883-aa51-e1650b11cab7':'owner','2a7c1bc4-f6d4-4bd3-805e-0496ece13987':'CES1'};
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const run=async(tag,act,dept,n)=>{const r=await mkRule(tag,{kind:'RecordCreated'},[act],{isActive:true,departmentIds:[dept]});if(!r.id)return r.res;const res=[];for(let i=1;i<=n;i++){const t=await mkTicket(tag,{department:dept},'t'+i);await sleep(2000);res.push(t.id);}await sleep(20000);const out=[];for(const id of res){const g=await getTicket(id);const ex=(await execsRaw(id)).filter(e=>e.ruleId===r.id);out.push({owner:U[g.owner]||g.owner,d:ex.flatMap(e=>e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')))});}await deact(r.id);return out;};
o.orgUnitOnline=await run('2997 on',{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:CEO},D,3);
save('2997e',o);return o;
