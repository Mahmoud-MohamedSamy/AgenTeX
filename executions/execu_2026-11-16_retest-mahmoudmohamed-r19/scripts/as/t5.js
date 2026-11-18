var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Which auto-assigned tickets keep counting? A3 in QA AO Dept B; measure the count the rule uses (smallest dept threshold that still assigns) after each change.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const num=async id=>(await rec(id)).ticket_number;
const all=async()=>{const rows=[];for(let p=1;p<20;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={};for(const x of r.data||[]){o[x.field]=x.value?.value;}rows.push(o);}if(!g.j?.meta?.more_records)break;}return rows;};
const openA3=async()=>(await all()).filter(r=>r.owner===A3&&r.department===AOB&&r.status==='Open').length;
const K='R19AS5'+U;const PB=await prefs(AOB);save('t5-prefs-orig.json',PB);let rid;
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
// measure: thresholds open+1..open+4; return the extra count = (first threshold that assigns) - open - 1
const measure=async(tag)=>{const o=await openA3();for(let k=1;k<=4;k++){await P({department_threshold:o+k});await sleep(2500);const t=await tk(K+' m '+tag+' +'+k,{},AOB);if(t&&t.err){S('create err',t.err);return 'err';}const w=await waitOwn(t,18);const n=await num(t);await patch(t,{status:'Closed'});await sleep(2500);if(w==='A3'){S(tag+': Open in dept',o,'| thr',o+k,'#'+n,'assigned -> rule counts',o+k-1,'(hidden extra',k-1+')');return k-1;}S(tag+': thr',o+k,'#'+n,'not assigned');}S(tag+': not assigned up to +4');return '>=4';};
const autoA3=async(tag)=>{await P({department_threshold:200});await sleep(2500);const t=await tk(K+' '+tag,{},AOB);const w=await waitOwn(t,18);S(tag,'#'+(await num(t)),'auto-assigned ->',w);return t;};
try{
 const r=await rule('round_robin','t5 A3 AOB',[rrT(K,'sequential',[A3])],{dept:AOB});rid=r.j?.data?.id;S('rule',E(r));
 R.m0=await measure('start');
 const x=await autoA3('X reassign');S('X owner -> owner account',E(await patch(x,{owner:O})));await sleep(4000);R.m1=await measure('after X reassigned away');
 const y=await autoA3('Y move dept');S('Y moved to QA AS6 Dept A',E(await patch(y,{department:DA,owner:A3})));await sleep(4000);R.m2=await measure('after Y moved out');
 const z=await autoA3('Z close');S('Z closed',E(await patch(z,{status:'Closed'})));await sleep(4000);R.m3=await measure('after Z closed (control)');
 const w=await autoA3('W delete');const d=await api('DELETE','/modules/'+T+'/records/'+w);LED('ticket '+w+' deleted (Recycle Bin) for t5 -> '+d.s);S('W deleted',d.s);await sleep(4000);R.m4=await measure('after W deleted');
 for(const id of [x,y])await patch(id,{status:'Closed'});
}finally{if(rid)await setA(rid,false);R.restore=E(await setPrefs(PB,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);LED('t5: QA AO Dept B prefs changed and restored '+R.same+'; X,Y closed');}
save('t5.json',R);return R;
