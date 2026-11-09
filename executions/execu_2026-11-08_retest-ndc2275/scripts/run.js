// Runner: node run.js <script.js>. Holds owner + A2 + A3 contexts (each signed in once), keeps A2/A3 presence, script gets api (owner), as(name,...), pres(obj), page, ...
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const H='https://staging-desk.taviportal.com',API=H+'/api/v1';
const OUT=path.join(__dirname,'..','out');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const C={};
 for(const n of ['owner','a2','a3']){const ctx=await b.newContext({storageState:path.join(OUT,n+'.json'),viewport:{width:1600,height:1000}});const pg=await ctx.newPage();await pg.goto(H+'/',{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(6000);if(n!=='owner')await pg.goto('about:blank');C[n]={ctx,pg};}
 const tok=async n=>((await C[n].ctx.cookies()).find(x=>x.name==='aw_staging_access_token')||{}).value;
 const as=async(n,m,p,body)=>{const ctx=C[n].ctx;let t=await tok(n);if(!t){const pg=n==='owner'?await ctx.newPage():C[n].pg;await pg.goto(H+'/',{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(6000);if(n==='owner')await pg.close();else await pg.goto('about:blank');t=await tok(n);}if(!t)throw new Error('SIGNED_OUT '+n);
  const r=await ctx.request.fetch(API+p,{method:m,headers:{authorization:'Bearer '+t,'x-app-key':'desk',...(body!==undefined?{'content-type':'application/json'}:{})},data:body!==undefined?JSON.stringify(body):undefined,failOnStatusCode:false,timeout:120000});
  if(r.status()===429){throw new Error('STOP 429 '+p);}const x=await r.text();let j=null;try{j=JSON.parse(x)}catch(e){}return{s:r.status(),j,t:x.slice(0,3000)};};
 const api=(m,p,body)=>as('owner',m,p,body);
 const want={a2:'on',a3:'on'};let stop=false;const last={};
 const tick=async()=>{for(const n of ['a2','a3']){try{const w=want[n];
   if(w==='on'){if(last[n]!=='on')await as(n,'PUT','/desk/agents/me/presence',{channels:{email:true,chat:true,phone:true}});await as(n,'POST','/desk/agents/me/presence/heartbeat');}
   else if(w==='emailoff'){if(last[n]!=='emailoff')await as(n,'PUT','/desk/agents/me/presence',{channels:{email:false,chat:true,phone:true}});await as(n,'POST','/desk/agents/me/presence/heartbeat');}
   else if(w==='out'&&last[n]!=='out')await as(n,'POST','/desk/agents/me/presence/sign-out');
   last[n]=w;}catch(e){console.error('presence',n,String(e.message).slice(0,100));}}};
 await tick();const loop=(async()=>{let i=0;while(!stop){await new Promise(r=>setTimeout(r,1000));if(++i%20===0)await tick();}})();
 const pres=async o=>{Object.assign(want,o);await tick();await new Promise(r=>setTimeout(r,3000));};
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));const arr=x=>Array.isArray(x)?x:(x&&(x.items||x.data||x.results||x.records))||[];
 let out;try{const fn=new Function('api','as','pres','sleep','arr','page','H','require','C','OUT',`return (async()=>{${fs.readFileSync(process.argv[2],'utf8')}})();`);
  out=await fn(api,as,pres,sleep,arr,C.owner.pg,H,require,C,OUT);}finally{stop=true;await loop.catch(()=>{});for(const n in C)await C[n].ctx.storageState({path:path.join(OUT,n+'.json')}).catch(()=>{});await b.close();}
 console.log(JSON.stringify(out,null,1).replace(/eyJ[A-Za-z0-9._-]{20,}/g,'<jwt>'));
})().catch(e=>{console.error('ERR',String(e.message).split('Call log:')[0].replace(/eyJ[A-Za-z0-9._-]{20,}/g,'<jwt>'));process.exit(1)});
