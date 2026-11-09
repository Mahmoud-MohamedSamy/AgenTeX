// NDC-2275 cleanup. node clean.js inv | del | bin | verify. Owner session only (no agent presence). Deletes only names starting "QA RT15 2275".
const fs=require('fs'),path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const H='https://staging-desk.taviportal.com',API=H+'/api/v1';
const OUT=path.join(__dirname,'..','out');const MODE=process.argv[2]||'inv';const PX='QA RT15 2275';
const T='88e8ea44-1658-4df3-9930-d0902b91073d';const IDS=JSON.parse(fs.readFileSync(path.join(P,'executions/execu_2026-11-06_desk-assignment-skills/out/ids.json'),'utf8'));
const LED=m=>fs.appendFileSync(path.join(OUT,'../ledger.md'),'- '+new Date().toISOString().slice(0,19)+' CLEANUP '+m+'\n');
const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:path.join(OUT,'owner.json')});const pg=await ctx.newPage();
 await pg.goto(H+'/',{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(7000);
 const tok=async()=>((await ctx.cookies()).find(x=>x.name==='aw_staging_access_token')||{}).value;
 const api=async(m,p,body)=>{const t=await tok();if(!t)throw new Error('SIGNED_OUT');const r=await ctx.request.fetch(API+p,{method:m,headers:{authorization:'Bearer '+t,'x-app-key':'desk',...(body!==undefined?{'content-type':'application/json'}:{})},data:body!==undefined?JSON.stringify(body):undefined,failOnStatusCode:false,timeout:120000});if(r.status()===429)throw new Error('STOP 429 '+p);const x=await r.text();let j=null;try{j=JSON.parse(x)}catch(e){}return{s:r.status(),j,t:x.slice(0,300)};};
 const arr=x=>Array.isArray(x)?x:(x&&(x.items||x.data||x.results||x.records))||[];
 const val=(r,f)=>{const x=(r.data||[]).find(y=>y.field===f);return x&&x.value&&x.value.value;};
 const R={};
 try{
  if(MODE==='delcontact'){const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4',CID='617eead5-a4da-41ba-927f-a8bbdd638be0';const g=await api('GET','/modules/'+CMID+'/records/'+CID);const em=g.j&&g.j.data&&val(g.j.data,'email');if(em!=='qa.rt15.wf@example.com'){console.log('STOP not ours',g.s,em);return;}const d=await api('DELETE','/modules/'+CMID+'/records/'+CID);LED('contact '+CID+' '+d.s);console.log('del',d.s);await W(3000);let found=[];let cur='';for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if(x.record_id===CID)found.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||found.length)break;}if(found.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:found});LED('recycle bin contact '+p.s);console.log('bin',found.length,p.s);}else console.log('bin entry not found');const v=await api('GET','/modules/'+CMID+'/records/'+CID);console.log('after',v.s);return;}
  if(MODE==='contacts'){const ml=await api('GET','/modules');const MS=arr(ml.j&&ml.j.data).filter(m=>/contact/i.test((m.key||'')+(m.name||'')+(m.api_name||'')));console.log('ALL',arr(ml.j&&ml.j.data).map(m=>(m.key||m.api_name||'')+':'+(m.name||m.label||m.plural_label||'')+':'+m.id.slice(0,8)).join(' | '),ml.t.slice(0,120));console.log('MODS',ml.s,MS.map(m=>m.id+' '+(m.key||m.api_name)+' '+m.name).join(' | '));console.log('NAME',JSON.stringify(arr(ml.j.data).find(m=>m.id.startsWith('43004ce2'))).slice(0,200));for(const cm of ['43004ce2-577f-4eda-b00a-0750fe40c3d4']){const hits=[];let st;for(let p=1;p<6;p++){const r=await api('GET','/modules/'+cm+'/records?page='+p+'&per_page=100&limit=100&sort=-created_at'+'&page='+p);st=r.s+(r.s!==200?' '+r.t.slice(0,80):'');if(r.s!==200)break;const L=arr(r.j.data);if(!L.length)break;let old=false;for(const x of L){const c=String(x.created_at||'');if(c<'2026-11-08T12:00'){old=true;continue;}const v=JSON.stringify(x.data||[]);if(/qa.rt15|Retest|RT15/i.test(v))hits.push({id:x.id,c:c.slice(0,16),v:(x.data||[]).filter(y=>/name|email/i.test(y.field)).map(y=>y.field+'='+(y.value&&y.value.value)).join(' ')});}if(old)break;}console.log('CM',cm.slice(0,8),st,JSON.stringify(hits));}return;}
  if(MODE==='peek2'){const ns=await api('GET','/desk/assignment/notification-settings');console.log('NS',ns.s,ns.t.slice(0,150));for(const q of ['app_key=desk&limit=200','app=desk&limit=50','q=QA%20RT15%202275&limit=50']){const r=await api('GET','/audit/recycle-bin/items?'+q);const L=arr(r.j&&r.j.data);console.log('BIN',q,r.s,L.length,'match',L.filter(x=>String(x.record_label||'').startsWith(PX)).length,'next',!!(r.j&&r.j.meta&&r.j.meta.next_cursor),L.slice(0,3).map(x=>x.record_label+'/'+x.app_key+'/'+String(x.deleted_at).slice(0,16)).join(' ; '));}return;}
  if(MODE==='peek'){for(const q of ['?type=round_robin&department_id='+IDS.DA,'?type=direct']){const pk=await api('GET','/desk/assignment-rules'+q);console.log('PEEK',q.slice(0,20),pk.s,pk.t.slice(0,400));}return;}
  // tickets: page newest first until older than the run
  const tickets=[];let oldest='';for(let p=1;p<40;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&sort_by=created_at&sort_dir=desc');if(r.s!==200){R.ticketErr=r.s+' '+r.t;break;}const L=arr(r.j.data);if(!L.length)break;for(const x of L){const s=String(val(x,'subject')||'');const c=String(x.created_at||val(x,'created_at')||'');oldest=c;if(s.startsWith(PX))tickets.push({id:x.id,no:val(x,'ticket_number'),s:s.slice(13,50)});}if(oldest&&oldest<'2026-11-08T12:00')break;await W(150);}
  const led=fs.readFileSync(path.join(OUT,'../ledger.md'),'utf8').split('\n');
  const extraT=led.filter(l=>l.includes('ticket "')&&!l.includes('CLEANUP')).map(l=>l.trim().split(' ').pop()).filter(id=>!tickets.find(t=>t.id===id));R.ledgerOnly={};
  for(const id of extraT){const r=await api('GET','/modules/'+T+'/records/'+id);R.ledgerOnly[r.s]=(R.ledgerOnly[r.s]||0)+1;const d=r.j&&r.j.data;if(r.s===200&&d&&String(val(d,'subject')||'').startsWith(PX))tickets.push({id,no:val(d,'ticket_number'),s:String(val(d,'subject')).slice(13,50)});}
  R.tickets=tickets.length;R.oldestSeen=oldest;
  // rules
  const rules=[];const lr=led.filter(l=>/ rule (direct|round_robin) "/.test(l)).map(l=>l.trim().split(' ').pop());R.ruleGet={};
  for(const id of lr){const r=await api('GET','/desk/assignment-rules/'+id);R.ruleGet[r.s]=(R.ruleGet[r.s]||0)+1;const d=r.j&&r.j.data;const x=d&&(d.rule||d);if(r.s===200&&x&&String(x.name).startsWith(PX))rules.push({id,name:x.name,type:x.type,active:x.is_active});}for(const ty of ['direct','round_robin'])for(const d of [IDS.DA,IDS.DB,'']){const r=await api('GET','/desk/assignment-rules?type='+ty+(d?'&department_id='+d:''));for(const x of ((r.j&&r.j.data&&r.j.data.rules)||[]))if(String(x.name).startsWith(PX)&&!rules.find(y=>y.id===x.id))rules.push({id:x.id,name:x.name,type:ty,active:x.is_active});}
  R.rules=rules.length;
  // workflows
  const wr=await api('GET','/workflow/rules?moduleId='+T+'&limit=200');const wfs=arr(wr.j&&wr.j.data).filter(x=>String(x.name).startsWith(PX)).map(x=>({id:x.id,name:x.name,active:x.isActive}));R.workflows=wfs;R.wfListStatus=wr.s;
  if(MODE==='inv'){R.sampleTickets=tickets.slice(0,3);R.ruleNames=rules.map(x=>x.name);fs.writeFileSync(OUT+'/clean-inv.json',JSON.stringify({tickets,rules,wfs},null,1));}
  if(MODE==='del'){
   const del={rec:{},rule:{},wf:{}};
   for(const w of wfs){const s=(await api('DELETE','/workflow/rules/'+w.id)).s;del.wf[s]=(del.wf[s]||0)+1;LED('workflow '+w.id+' '+s);}
   for(const x of rules){const s=(await api('DELETE','/desk/assignment-rules/'+x.id)).s;del.rule[s]=(del.rule[s]||0)+1;LED('rule '+x.id+' '+s);await W(100);}
   for(const t of tickets){const s=(await api('DELETE','/modules/'+T+'/records/'+t.id)).s;del.rec[s]=(del.rec[s]||0)+1;LED('ticket #'+t.no+' '+t.id+' '+s);await W(120);}
   R.deleted=del;
  }
  const INV=JSON.parse(fs.readFileSync(OUT+'/clean-inv.json','utf8'));const IDSET=new Set([...INV.tickets,...INV.rules,...INV.wfs].map(x=>x.id));
  if(MODE==='bin'||MODE==='verify'){
   const items=[];let cur='';for(let i=0;i<30;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){R.binErr=r.s+' '+r.t;break;}for(const x of arr(r.j.data)){if(!R.binKeys)R.binKeys=Object.keys(x).join(',');const rid=x.record_id||x.entity_id||x.target_id||x.resource_id;if(String(x.record_label||'').startsWith(PX)||IDSET.has(rid))items.push(x.id);}cur=r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}
   R.binFound=items.length;
   if(MODE==='bin'){const st={};for(let i=0;i<items.length;i+=25){const s=(await api('POST','/audit/recycle-bin/delete',{ids:items.slice(i,i+25)})).s;st[s]=(st[s]||0)+1;await W(300);}R.binPurge=st;LED('recycle bin purged '+items.length+' '+JSON.stringify(st));}
  }
  {const ns=await api('GET','/desk/assignment/notification-settings');R.directMaster=ns.j&&ns.j.data?ns.j.data.direct_rules_enabled:'read '+ns.s;}
 }finally{await ctx.storageState({path:path.join(OUT,'owner.json')}).catch(()=>{});await b.close();}
 console.log(JSON.stringify(R,null,1).replace(/eyJ[A-Za-z0-9._-]{20,}/g,'<jwt>'));
})().catch(e=>{console.error('ERR',String(e.message).split('Call log:')[0]);process.exit(1)});
