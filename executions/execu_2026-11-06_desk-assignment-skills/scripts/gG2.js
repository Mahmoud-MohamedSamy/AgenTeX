eval(require('fs').readFileSync('lib.js','utf8'));
const fs2=require('fs'); const OUT='../out/';
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||x.slice(0,8)):'-';
const agentDo=async(who,m,p,b)=>{const id='d'+Date.now()+who;fs2.writeFileSync(OUT+'agent-do.json',JSON.stringify([{id,who,m,p,body:b}]));for(let i=0;i<45;i++){await W(1000);if(fs2.existsSync(OUT+'do-'+id+'.json')){let j=null;try{j=JSON.parse(fs2.readFileSync(OUT+'do-'+id+'.json','utf8'));}catch(e){}return {j};}}return {s:'timeout'};};
const r=await agentDo('a1','GET','/notifications?limit=200');const L=(r.j&&r.j.data&&(r.j.data.data||r.j.data))||[];
const mine=L.filter(n=>/QA AS6/.test(n.title||''));const by={};for(const n of mine){const k=n.title;by[k]=by[k]||[];by[k].push(n.event_type+'@'+(n.created_at||n.createdAt||'').slice(11,19));}
RES.A1notifs=Object.entries(by).map(([k,v])=>k.slice(0,70)+' => '+v.join(', '));
RES.sampleKeys=mine[0]&&Object.keys(mine[0]);
// duplicated? show the two D01 a records fully (no tokens inside)
RES.d01=mine.filter(n=>/D01 a/.test(n.title)).map(n=>JSON.stringify({id:n.id,ev:n.event_type,at:n.created_at,data:n.data&&n.data.variables&&Object.keys(n.data.variables)}));
// team on ticket after manual team assign while off
const tk=fs2.readFileSync('../ledger.md','utf8').split('\n').filter(l=>l.includes('"QA AS6 F12 manual"')).map(l=>l.trim().split(' ').pop());RES.f12ticket=tk[0]&&await own(tk[0]);
// audit
const a=await api('GET','/audit/events?app_key=desk&limit=200');const E2=arr(a.j&&a.j.data);const tt={};for(const e of E2){const k=e.target_type+'|'+e.action;tt[k]=(tt[k]||0)+1;}RES.auditTypes=tt;RES.auditMeta=a.j&&a.j.meta;
for(const f of ['target_type=assignment_rule','target_type=round_robin_preferences','q=QA%20AS6','search=QA%20AS6']){const x=await api('GET','/audit/events?app_key=desk&limit=50&'+f);RES['audit '+f]=x.s+' n='+arr(x.j&&x.j.data).length+' '+arr(x.j&&x.j.data).slice(0,4).map(e=>e.target_type+'/'+e.action+'/'+(e.target_label||'').slice(0,30)+'/'+(e.actor_label||'')).join(' ; ');}
const fac=await api('GET','/audit/events/facets?app_key=desk');RES.facets=fac.s+' '+fac.t.slice(0,1500);
return RES;
