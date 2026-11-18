eval(fs.readFileSync('wf/lib.js','utf8'));
const LOCK='../locks/agent-ZZ-Sweep-Tavi-Probe.lock';
if(fs.existsSync(LOCK))return {err:'lock exists'};
const ZZ='5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1',DB=CFG.DB;const o={};const U={[ZZ]:'ZZProbe','97be04b6-0a08-4883-aa51-e1650b11cab7':'owner'};
const st=async()=>arr((await api('GET','/iam/users?take=200')).j?.data).find(x=>x.userId===ZZ)?.status;
o.start=await st();if(o.start!=='active')return o;
const r=await mkRule('2973',{kind:'RecordCreated'},[{type:'OwnerAssignment',ownerTargetKind:'SpecificUser',ownerValue:ZZ}],{isActive:true,departmentIds:[D,DB]});o.rule=r.res+' '+r.id;if(!r.id)return o;
const chk=async(t)=>{await sleep(15000);const g=await getTicket(t.id);const ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id);return {num:t.num,owner:U[g.owner]||g.owner,out:ex.map(e=>e.outcome),d:ex.flatMap(e=>e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')))};};
const man=async(tid)=>{const a=await api('POST',`/desk/tickets/${tid}/assign`,{owner_id:ZZ});return a.s+' '+(a.s>=300?(a.j?.error?.message||a.t.slice(0,160)):'assigned');};
const TK={};
TK.a1=await mkTicket('2973',{},'A active not in dept');o.activeNotInDept=await chk(TK.a1);o.activeNotInDeptManual=await man(TK.a1.id);
TK.b1=await mkTicket('2973',{department:DB},'B active in dept control');o.activeInDept=await chk(TK.b1);
fs.writeFileSync(LOCK,'WF lane suspends ZZ Sweep Tavi Probe for NDC-2973 '+new Date().toISOString());
try{
 const s=await api('PATCH','/iam/users/'+ZZ,{status:'suspended'});o.suspend=s.s;led(`agent "ZZ Sweep Tavi Probe" (5b3f7466, QA probe) SUSPENDED for NDC-2973: ${s.s}`);await sleep(3000);o.statusNow=await st();
 TK.a2=await mkTicket('2973',{},'A suspended not in dept');TK.b2=await mkTicket('2973',{department:DB},'B suspended in dept');
 o.suspNotInDept=await chk(TK.a2);o.suspInDept=await chk(TK.b2);
 const t3=await mkTicket('2973',{department:DB},'B manual target');await sleep(2000);
 const g=await getTicket(t3.id);
 o.suspInDeptManual=await man(t3.id);o.suspNotInDeptManual=await man(TK.a2.id);
}finally{
 const a=await api('PATCH','/iam/users/'+ZZ,{status:'active'});await sleep(3000);o.reactivate=a.s;o.statusAfter=await st();led(`agent "ZZ Sweep Tavi Probe" REACTIVATED: ${a.s}, status ${o.statusAfter}`);
 if(o.statusAfter==='active')fs.unlinkSync(LOCK);
}
o.deact=await deact(r.id);
fs.writeFileSync(OUTD+'2973-ids.json',JSON.stringify({rule:r.id,T:Object.fromEntries(Object.entries(TK).map(([k,v])=>[k,v.id]))}));
save('2973',o);return o;
