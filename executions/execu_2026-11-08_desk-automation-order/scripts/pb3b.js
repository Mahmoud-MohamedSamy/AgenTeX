// Part B batch 3: blueprint pairs OR-16/L1, OR-17/L2, OR-30, OR-31 and Group L3, L4, L6, L7 (L5 macro not run: macros skipped by the user).
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const orig=await notif();if(!fs.existsSync('../pb-switch-orig.json'))fs.writeFileSync('../pb-switch-orig.json',JSON.stringify(orig));
const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const bp=async(tag,entry,o={})=>{const d={name:'QA AO PB '+tag+' '+U,description:'QA - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:o.dept||DA,entryCriteria:entry,
 states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true}],
 transitions:[{id:'end',name:'QA end',fromStateId:'Open',toStateId:'Closed',before:o.before||{},during:{},after:{actions:[]}}]};
 const r=await api('POST','/modules/'+T+'/blueprints',{definition:d,isActive:true});const id=r.j?.data?.id;if(id){pbm.bp.push(id);pbSave();return id;}throw new Error('bp '+r.s+' '+r.t.slice(0,250));};
const bstate=async id=>{const s=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];return s?{bp:s.blueprintName,state:s.activeStates}:null;};
const waitBp=async(id,s=24)=>{for(let i=0;i<s/2;i++){const b=await bstate(id);if(b)return b;await sleep(2000);}return null;};
const dc=k=>({op:'contains',field:'description',value:k});const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
try{
await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
await cs(R,'OR-17/L2 round robin owner › blueprint entry on owner',async()=>{const k='PB17'+U;const bid=await bp('OR17',{op:'and',children:[dc(k),{op:'eq',field:'owner',value:A1}]},{before:{allowOwner:true}});
 const rr=await prule('round_robin','PB17 rr',[rrT(k,'sequential',[A1])],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);const b=await waitBp(id,16);
 const run=await api('POST','/desk/tickets/'+id+'/blueprint-transitions/end',{run_id:uuid(),expected_state_id:'Open',fields:{}});
 const out={owner:nm(o.owner),blueprint:b,adminRun:run.s+' '+(run.j?.error?.code||''),feed:await feedS(id)};await off(rr.id);fs.writeFileSync('../pb-or17.json',JSON.stringify({id}));return out;});
await cs(R,'L7 department move (Desk move) on a ticket in a blueprint',async()=>{const k='PBL7b'+U;await bp('L7b',dc(k));const id=await ptk(k);const b0=await waitBp(id);
 const p=await api('POST','/desk/tickets/'+id+'/move',{department_id:DB});await sleep(6000);const o=await rec(id);return {before:b0,move:E(p),dept:nm(o.department),status:o.status,after:await bstate(id),feed:await feedS(id)};});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchNow=(await notif()).direct_rules_enabled;}
fs.writeFileSync('../pb3b-result.json',JSON.stringify(R,null,1));return R;
