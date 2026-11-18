var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// NF-3 style burst via MOVE: 10 tickets moved into QA AO Dept B at once, pool A1+A3, dept threshold TH, room = TH - Open count from API.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const TH=6;const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('burst.json',R);};
const all=async()=>{const rows=[];for(let p=1;p<60;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){if(r.is_deleted)continue;const o={id:r.id};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records||!L.length)break;}return rows;};
const cnt=async()=>{const rows=await all();const c=u=>rows.filter(x=>x.owner===u&&x.department===AOB&&x.status!=='Closed'&&x.status!=='On Hold').length;return {A1:c(A1),A3:c(A3)};};
const PB=await prefs(AOB);save('burst-prefs-orig.json',PB);let rid;const ids=[];
try{
 S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:TH,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
 const K='BU'+U;const r=await rule('round_robin','burst A1 A3',[rrT(K,'sequential',[A1,A3])],{dept:AOB,on:['create','update']});rid=r.j?.data?.id;S('rule',E(r));
 const b=await cnt();const exp={A1:Math.max(0,TH-b.A1),A3:Math.max(0,TH-b.A3)};exp.waiting=10-exp.A1-exp.A3;S('before (API Open in AO-B)',JSON.stringify(b),'workload',(await wl(A1,AOB)).dept,(await wl(A3,AOB)).dept,'=> expected',JSON.stringify(exp));
 for(let i=1;i<=10;i++)ids.push(await tk(K+' #'+i,{},DA));for(const id of ids)await waitDesk(id);await sleep(3000);
 const mv=await Promise.all(ids.map(id=>api('POST','/desk/tickets/'+id+'/move',{department_id:AOB,team_id:null,owner_id:null}).then(x=>x.s)));S('moves',mv.join(','));
 await sleep(30000);const o=[];for(const id of ids)o.push(await own(id));let dbl=0;for(const id of ids)if((await feed(id)).filter(e=>e.action==='ticket.auto_assigned').length>1)dbl++;
 const c=x=>o.filter(y=>y===x).length;R.got={A1:c('A1'),A3:c('A3'),waiting:c('none')};R.exp=exp;R.ok=R.got.A1===exp.A1&&R.got.A3===exp.A3;S('got',JSON.stringify(R.got),'double entries',dbl,'owners',o.join(','),'ok',R.ok);
}finally{if(rid)await setA(rid,false);for(const id of ids)await patch(id,{status:'Closed'});R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('burst: QA AO Dept B RR prefs changed and restored '+R.same+'; 10 tickets closed (record)');}
save('burst.json',R);return R;
