eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
let DB=CFG.DB;
if(!DB){const r=await api('POST','/desk/departments',{name:'QA RT19 WF Dept B',description:'QA retest round 19 workflow lane, no CEO-role agent',agent_user_ids:['5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1']});DB=r.j?.data?.id;o.deptB=r.s;if(DB){led(`department "QA RT19 WF Dept B" ${DB} created, agent ZZ Sweep Tavi Probe`);fs.writeFileSync(OUTD+'cfg.json',JSON.stringify({...CFG,DB}));}}
const r=await mkRule('2997',{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:'OrgUnitRoundRobin',ownerValue:CEO}],{isActive:true,departmentIds:[D,DB]});o.rule=r.res+' '+r.id;
if(!r.id){o.err=r.r.t.slice(0,400);return o;}
const ts=[];for(let i=1;i<=4;i++){ts.push(await mkTicket('2997',{},'A'+i));await sleep(1500);}
const tb=await mkTicket('2997',{department:DB},'B no CEO agent');
await sleep(25000);
const U={'2a7c1bc4-f6d4-4bd3-805e-0496ece13987':'CES1','876ce871-2b02-4854-89a7-68050391c62b':'TestUser1','97be04b6-0a08-4883-aa51-e1650b11cab7':'owner','5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1':'ZZProbe'};
o.keys=null;
for(const t of [...ts,tb]){const g=await getTicket(t.id);if(!o.keys)o.keys=Object.keys(g).join(',');const ow=g.owner??g.ticket_owner??g._owner;const ex=(await execsRaw(t.id));o[t.num||t.id]={owner:U[ow]||ow,ex:ex.map(e=>({rule:e.ruleId===r.id?'mine':e.ruleName||e.ruleId||e.origin,out:e.outcome,err:e.errorMessage,det:e.details,d:e.dispatches.map(d=>[d.actionType,d.status,d.lastError])}))};}
fs.writeFileSync(OUTD+'2997-ids.json',JSON.stringify({rule:r.id,ts:ts.map(t=>t.id),tb:tb.id}));
o.deact=await deact(r.id);
save('2997',o);return o;
