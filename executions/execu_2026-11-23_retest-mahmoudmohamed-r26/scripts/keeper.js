// node keeper.js — the ONLY process that refreshes the owner session (scratchpad r18-o.json). Proactive: when < 9 min left,
// opens /hq headless WITHOUT the access cookie so the app renews with the refresh cookie, then saves state. Logs to r19-keeper.log; flag after 3 misses.
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/939f5f7f-564a-4507-9f88-be30ab83dabc/scratchpad';
const ST=S+'/r18-o.json',LOG=S+'/r19-keeper.log',FLAG=S+'/r19-owner-lost.flag';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const tokExp=st=>{const c=st.cookies.find(c=>c.name==='aw_staging_access_token');try{return c?JSON.parse(Buffer.from(c.value.split('.')[1],'base64url')).exp*1000:0}catch(e){return 0}};
const log=m=>{const l=new Date().toISOString()+' '+m;fs.appendFileSync(LOG,l+'\n');console.log(l)};
let fails=0;
(async()=>{for(;;){let st;try{st=JSON.parse(fs.readFileSync(ST,'utf8'))}catch(e){st={cookies:[]}}
 const left=tokExp(st)-Date.now();
 if(left>9*60000){await new Promise(r=>setTimeout(r,Math.min(60000,left-9*60000)));continue;}
 try{const b=await chromium.launch({headless:true,channel:'msedge'});
  const st2={...st,cookies:st.cookies.filter(c=>c.name!=='aw_staging_access_token')};
  const ctx=await b.newContext({storageState:st2});const pg=await ctx.newPage();
  await pg.goto('https://staging-desk.taviportal.com/hq',{waitUntil:'domcontentloaded',timeout:120000}).catch(()=>{});
  let got=0;for(let i=0;i<30;i++){await pg.waitForTimeout(1000);const ck=await ctx.cookies();if(ck.find(c=>c.name==='aw_staging_access_token')){got=1;break;}}
  await pg.waitForTimeout(2000);const tmp=ST+'.tmp';await ctx.storageState({path:tmp});await b.close();
  const n=JSON.parse(fs.readFileSync(tmp,'utf8'));
  if(got&&tokExp(n)>Date.now()+60000){fs.renameSync(tmp,ST);fails=0;if(fs.existsSync(FLAG))fs.unlinkSync(FLAG);log('renewed exp '+new Date(tokExp(n)).toISOString());}
  else{fs.unlinkSync(tmp);fails++;if(fails>=3)fs.writeFileSync(FLAG,new Date().toISOString());log('no token (try '+fails+')');}
 }catch(e){log('error '+e.message.split('\n')[0]);}
 await new Promise(r=>setTimeout(r,fails?45000:5000));}})();
