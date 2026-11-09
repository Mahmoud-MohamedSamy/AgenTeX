// Delete NDC-2630 retest data from ledger: lead cac2e850 + 2 mail drafts, then purge their bin entries. Prints no secrets.
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const H='https://staging-crm.taviportal.com',C=H+'/api/v1';const OUT=path.join(__dirname,'..','out');
const LED=m=>fs.appendFileSync(path.join(OUT,'../ledger.md'),'- '+new Date().toISOString().slice(0,19)+' CLEANUP '+m+'\n');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:path.join(OUT,'owner.json')});const pg=await ctx.newPage();
 await pg.goto(H+'/',{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(7000);
 const tok=((await ctx.cookies()).find(x=>x.name==='aw_staging_access_token')||{}).value;if(!tok){console.log('SIGNED_OUT');await b.close();return;}
 const ca=async(m,p,body)=>{const r=await ctx.request.fetch(C+p,{method:m,headers:{authorization:'Bearer '+tok,...(body?{'content-type':'application/json'}:{})},data:body?JSON.stringify(body):undefined,failOnStatusCode:false,timeout:60000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status(),j,t:t.slice(0,200)};};
 const o={};const L=JSON.parse(fs.readFileSync(path.join(OUT,'lead.json'),'utf8'));
 const g=await ca('GET','/modules/'+L.module+'/records/'+L.id);const d=g.j&&g.j.data;const vals=JSON.stringify(d||{});o.leadGet=g.s;
 if(g.s===200){if(!/QA RT13 2630|qa\.rt13\.2630/.test(vals)){o.lead='STOP not ours';}else{const x=await ca('DELETE','/modules/'+L.module+'/records/'+L.id);o.leadDel=x.s;LED('lead '+L.id+' '+x.s);}}
 for(const id of ['92a9e4c0-e523-4cfd-8cbf-7102cee7ccfe','c888686e-409d-46ac-8d65-e56a0f0ed139']){const dg=await ca('GET','/mail/drafts/'+id);o['draft '+id.slice(0,8)]=dg.s+' '+((dg.j&&dg.j.data&&dg.j.data.status)||'');if(dg.s===200){const x=await ca('DELETE','/mail/drafts/'+id);o['draftDel '+id.slice(0,8)]=x.s+' '+x.t.slice(0,80);LED('mail draft '+id+' '+x.s);}}
 await pg.waitForTimeout(3000);const items=[];let cur='';for(let i=0;i<10;i++){const r=await ca('GET','/audit/recycle-bin/items?app_key=crm&app_key=mail&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){o.binErr=r.s;break;}const A=(r.j.data&&(r.j.data.items||r.j.data))||[];for(const x of (Array.isArray(A)?A:[]))if(x.record_id===L.id||/QA RT13 2630/.test(x.record_label||''))items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}
 o.binFound=items.length;if(items.length){const p=await ca('POST','/audit/recycle-bin/delete',{ids:items});o.binPurge=p.s;LED('recycle bin '+items.length+' '+p.s);}
 o.leadAfter=(await ca('GET','/modules/'+L.module+'/records/'+L.id)).s;
 await ctx.storageState({path:path.join(OUT,'owner.json')});await b.close();console.log(JSON.stringify(o));})().catch(e=>{console.error('ERR',String(e.message).split('Call log')[0]);process.exit(1);});
