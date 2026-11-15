// OR-35 rerun (blueprint Open/Closed, after-action setField owner) + OR-21 blueprint transition changes owner + G-06 later edit; OR-21 SLA escalation result; OR-33 number.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};const NUM=JSON.parse(fs.readFileSync('../pb4-nums.json','utf8'));
const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
await cs(R,'OR-35 + OR-21(blueprint) + G-06',async()=>{const k='PB35b'+U;
 const b=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO PB OR35b '+U,description:'QA',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'contains',field:'description',value:k},states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true},{id:'On Hold',name:'On Hold',position:{x:300,y:200},slaClock:'calendar'}],transitions:[{id:'hold',name:'QA hold',fromStateId:'Open',toStateId:'On Hold',before:{},during:{},after:{actions:[{kind:'setField',field:'owner',value:A2}]}},{id:'end',name:'QA end',fromStateId:'On Hold',toStateId:'Closed',before:{},during:{},after:{actions:[]}}]},isActive:true});
 if(b.j?.data?.id){pbm.bp.push(b.j.data.id);pbSave();}else return 'bp '+E(b);
 const rr=await prule('round_robin','PB35b rr',[rrT(k,'sequential',[A1])],{on:['create','update']});
 const id=await ptk(k);const o=await waitRec(id,x=>x.owner);await sleep(6000);NUM['OR-35 RR → A1 + blueprint entry; then G-06 edit; then OR-21 transition → A2']=(await rec(id)).ticket_number;
 const bs=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];
 await patch(id,{priority:'medium'});await sleep(8000);await off(rr.id);
 const run=await api('POST','/desk/tickets/'+id+'/blueprint-transitions/hold',{run_id:uuid(),expected_state_id:'Open',fields:{}});await sleep(8000);
 return {owner:nm(o.owner),entered:bs?.activeStates,run:E(run),ownerAfterTransition:await own(id),feed:await feedS(id)};});
await cs(R,'OR-21 SLA escalation reassign result',async()=>{const x=JSON.parse(fs.readFileSync('../pb-or21.json','utf8'));const o=await rec(x.id);NUM['OR-21 SLA escalation → A3 (was A2)']=o.ticket_number;
 const s=(await api('GET','/desk/tickets/'+x.id+'/sla')).j?.data;return {owner:nm(o.owner),obl:(s?.obligations||[]).map(q=>q.kind+':'+q.state+' due '+(q.due_at||'').slice(11,19)),feed:await feedS(x.id)};});
const L=(await api('GET','/modules/'+T+'/records?limit=50&search=QA%20AO%20PB%20PB33')).j?.data;R.or33=JSON.stringify(L).slice(0,300);
fs.writeFileSync('../pb4-nums.json',JSON.stringify(NUM,null,1));R.nums=NUM;fs.writeFileSync('../pb4b-result.json',JSON.stringify(R,null,1));return R;
