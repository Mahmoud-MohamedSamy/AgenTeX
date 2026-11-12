const L=await modId('leads'); await delAllQA();
for(const w of arr((await api('GET','/workflow/rules?module_id='+L)).j.data)) if(String(w.name).startsWith('QA SR1112')) await api('DELETE','/workflow/rules/'+w.id);
// E9 save without change
let r=await mkRule(L,{name:P+'E9',entries:[ent('lead_source','eq','web',10)]}); keepRule(r);
const e9=await newRec(L,{lead_source:'web'}); const a1=await recScore(L,e9); const u=await upd(L,e9,{lead_source:'web'}); const a2=await recScore(L,e9);
RES('E9',(u.s<300&&a1===10&&a2===10)?'pass':'fail','save with the same value: '+u.s+'; score '+a1+' -> '+a2);
// X2 reaches 30 -> task
const items=arr((await api('GET','/workflow/rules?module_id='+L)).j.data); const taskTpl=items.map(w=>(w.actions||[]).find(a=>a.type==='CreateTask'||a.type==='Task')).find(Boolean);
log('task action sample', JSON.stringify(taskTpl).slice(0,400));
r=await mkRule(L,{name:P+'X2',entries:[ent('rating','eq','active',20)]}); keepRule(r);
const act=taskTpl?{...Object.fromEntries(Object.entries(taskTpl).filter(([k])=>!['id'].includes(k))),taskTitle:P+'call hot lead',order:0}:{type:'CreateTask',order:0,delaySeconds:0,taskTitle:P+'call hot lead',taskDueOffsetDays:1};
const b={moduleId:L,appKey:'crm',name:P+'X2 hot',description:'QA',trigger:{kind:'RecordScoreChanged',scoreChange:'increased',scoreThreshold:30},criteria:null,mode:'Recurring',actions:[act],conditions:[],isActive:true};
const x=await api('POST','/workflow/rules',b); const wid=x.j&&x.j.data&&x.j.data.id; if(wid){(I.wfs=I.wfs||[]).push(wid);SAVE();}
if(!wid){RES('X2','blocked','workflow with task action refused '+SR(x).slice(0,200));}
else{const lead=await newRec(L,{lead_source:'web'}); await sleep(12000); await upd(L,lead,{rating:'active'}); await sleep(25000); const s1=await recScore(L,lead);
 await upd(L,lead,{title:'again'}); await sleep(15000);
 const T=await modId('tasks'); const tl=await api('GET','/modules/'+T+'/records?per_page=50&sort=-created_at'); const tasks=arr(tl.j&&tl.j.data).filter(t=>JSON.stringify(t).includes(P+'call hot lead')); tasks.forEach(t=>{(I.recs=I.recs||[]).push([T,t.id]);}); SAVE();
 RES('X2',(s1===30&&tasks.length===1)?'pass':'fail','web lead (10) edited to Hot (score '+s1+'), workflow "reaches 30" creates task: tasks found='+tasks.length+' (expect 1; a later edit above 30 must not add another)');}
// L2 save time with 50 rules x 25 entries
await delAllQA(); const ents=Array.from({length:25},(_,i)=>ent('no_of_employees','gte',i,1)); let made=0; for(let i=0;i<50;i++){const y=await mkRule(L,{name:P+'perf '+i,entries:ents}); if(keepRule(y)) made++;}
const pr=await newRec(L,{no_of_employees:30}); const times=[]; for(let i=0;i<5;i++){const t0=Date.now(); await upd(L,pr,{no_of_employees:30+i}); times.push(Date.now()-t0);} const sc=await recScore(L,pr);
const t1=[]; await delAllQA(); for(let i=0;i<5;i++){const t0=Date.now(); await upd(L,pr,{no_of_employees:40+i}); t1.push(Date.now()-t0);}
const med=a=>a.slice().sort((x,y)=>x-y)[2];
RES('L2',(made===50&&sc===1250&&med(times)<2000)?'pass':'fail','50 rules x 25 entries: score '+sc+' (expect 1250); save ms '+times.join(',')+' (median '+med(times)+') vs no rules '+t1.join(',')+' (median '+med(t1)+')');
SAVE();
