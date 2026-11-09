const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
let html=fs.readFileSync(path.join(RUN,'plane-draft-2630.html'),'utf8').trim().replace(' → proposed: Done (QA lead\'s decision)','');
if(/proposed/.test(html)){console.log('STOP draft marker still present');process.exit(1);}
const KEY=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g,'').trim();
const W='https://api.plane.so/api/v1/workspaces/ahmed-hegazy';const P=W+'/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const h={'X-API-Key':KEY,'Content-Type':'application/json'};const DONE='11f2d31f-9d01-4463-a1de-ce99521b97aa';
const J=async(u,o)=>{const r=await fetch(u,o);const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status,ok:r.ok,j,t};};
(async()=>{const b=await J(W+'/work-items/NDC-2630/?expand=state',{headers:h});const st=b.j.state.name;console.log('state before:',st);if(!/^(Bug|Ready For Test)$/i.test(st)){console.log('STOP: unexpected state');return;}
 const I=P+'/work-items/'+b.j.id;const c=await J(I+'/comments/',{method:'POST',headers:h,body:JSON.stringify({comment_html:html})});console.log('comment',c.s);if(!c.ok){console.log(c.t.slice(0,300));return;}
 const s=await J(I+'/',{method:'PATCH',headers:h,body:JSON.stringify({state:DONE})});console.log('state update',s.s);
 const a=await J(W+'/work-items/NDC-2630/?expand=state',{headers:h});const cs=await J(I+'/comments/?per_page=100',{headers:h});const L=(cs.j.results||[]).sort((x,y)=>x.created_at<y.created_at?-1:1);
 console.log('READ BACK state:',a.j.state.name,'| comments:',L.length,'| last starts:',(L[L.length-1].comment_stripped||'').slice(0,50));})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
