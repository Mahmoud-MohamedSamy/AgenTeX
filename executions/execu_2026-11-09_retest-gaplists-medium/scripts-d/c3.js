const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';
const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const I=JSON.parse(fs.readFileSync('../ndc-2628/ids.json','utf8'));const {L,R}=I;const o={};
const g=await api('GET','/modules/'+L+'/records/'+R+'/notes');o.notes=JSON.stringify(g.j.data).slice(0,600);
const list=arr(g.j)||[];const n=(Array.isArray(g.j.data)?g.j.data:(g.j.data.notes||g.j.data.items||[]))[0];
const N=n&&(n.id||n.note_id||n.event_id);o.N=N;
if(N){LED('note id '+N+' on '+R);for(const [m,b] of [['PATCH',{body:'QA RT 2628 note edited'}],['PUT',{body:'QA RT 2628 note edited'}]]){const r=await api(m,'/modules/'+L+'/records/'+R+'/notes/'+N,b);o['note'+m]=r.s+' '+r.t.slice(0,140);}
 const d=await api('DELETE','/modules/'+L+'/records/'+R+'/notes/'+N);o.noteDELETE=d.s+' '+d.t.slice(0,140);if(d.s<300)LED('DELETE note '+N+' → '+d.s);}
// tag-only token search
const t2=await api('POST','/modules/'+L+'/tags',{name:'QA RT 2628 quokkatag',color:'#22C55E'});const TG2=t2.j&&t2.j.data&&t2.j.data.id;if(TG2){LED('CREATE tag QA RT 2628 quokkatag '+TG2);await api('POST','/modules/'+L+'/records/'+R+'/tags',{tag_ids:[I.TG,TG2]});}
const n2=await api('POST','/modules/'+L+'/records/'+R+'/notes',{body:'QA RT 2628 second note platypusnote'});o.note2=n2.s;if(n2.s<300)LED('CREATE note 2 (platypusnote) on '+R);
fs.writeFileSync('../ndc-2628/ids.json',JSON.stringify({...I,TG2},null,1));
await sleep(15000);
for(const q of ['quokkatag','#quokkatag','platypusnote','zebracornflake']){const r=await api('GET','/search?q='+encodeURIComponent(q)+'&limit=20');const gs=r.j&&r.j.data&&r.j.data.groups||[];o['search '+q]=r.s+' hits='+gs.reduce((a,x)=>a+(x.hits||[]).length,0);}
return o;
