eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';const U={'2a7c1bc4-f6d4-4bd3-805e-0496ece13987':'CES1','876ce871-2b02-4854-89a7-68050391c62b':'TestUser1','97be04b6-0a08-4883-aa51-e1650b11cab7':'owner'};
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';const dg=(await api('GET','/desk/departments/'+QAO)).j?.data;
const us=arr((await api('GET','/iam/users?take=200')).j?.data);o.qaoA=dg.agent_user_ids.map(id=>{const x=us.find(u=>u.userId===id);return x?[x.displayName,x.orgUnitId===CEO?'CEO':x.orgUnitId.slice(0,8),x.status]:id;});
const run=async(tag,act,dept)=>{const r=await mkRule(tag,{kind:'RecordCreated'},[act],{isActive:true,departmentIds:[dept]});if(!r.id)return r.res;const res=[];for(let i=1;i<=2;i++){const t=await mkTicket(tag,{department:dept},'t'+i);await sleep(1500);res.push(t.id);}await sleep(20000);const out=[];for(const id of res){const g=await getTicket(id);const ex=(await execsRaw(id)).filter(e=>e.ruleId===r.id);out.push({owner:U[g.owner]||g.owner,d:ex.flatMap(e=>e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')))});}await deact(r.id);return out;};
o.specificCES1=await run('2997 su',{type:'OwnerAssignment',ownerTargetKind:'SpecificUser',ownerValue:'2a7c1bc4-f6d4-4bd3-805e-0496ece13987'},D);
o.profileDeskAdmin=await run('2997 pr',{type:'OwnerAssignment',ownerTargetKind:'RoleRoundRobin',ownerValue:'44444444-4444-4444-4444-444444444401'},D);
o.orgUnitAgain=await run('2997 ou2',{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:CEO},D);
save('2997c',o);return o;
