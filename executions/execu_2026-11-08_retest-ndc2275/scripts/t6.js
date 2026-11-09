// NDC-2275 retest, part 6: backlog first; New Ticket form with owner cleared (the ticket's step) and untouched; web form URL.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t6.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
const p0=await getP();await page.setViewportSize({width:1600,height:1000});const shot=n=>page.screenshot({path:RAW+n+'.png'});
const field=lbl=>page.locator('main').locator('div').filter({has:page.locator('label',{hasText:new RegExp('^[*]?'+lbl+'$')})}).last();
const reqs=[];page.on('request',r=>{if(r.method()==='POST'&&/\/records$/.test(r.url()))reqs.push((r.postData()||'').slice(0,2500));});
const form=async(subject,clear,tag)=>{reqs.length=0;const x={subject};
 await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'commit',timeout:120000});await page.waitForFunction(()=>/Ticket Information/.test(document.body.innerText),null,{timeout:120000}).catch(()=>{});await page.waitForTimeout(3000);
 await field('Department').getByText('Customer Support').first().click({timeout:15000});await page.waitForTimeout(800);await page.getByRole('option',{name:'QA AS6 Dept A'}).first().click({timeout:15000});await page.waitForTimeout(1200);
 await field('Subject').locator('input').first().fill(subject);
 const st=field('Status');if(/Select/.test(await st.innerText())){await st.getByText('Select').first().click();await page.waitForTimeout(600);await page.getByRole('option',{name:/^Open$/}).first().click();await page.waitForTimeout(500);}
 x.ownerShown=(await field('Ticket Owner').innerText()).replace(/\s+/g,' ').slice(0,60);
 if(clear){const f=field('Ticket Owner');const c=f.locator('[aria-label="Clear selection"]');x.clearBtn=await c.count();if(x.clearBtn)await c.first().click({timeout:15000}).catch(async()=>{await c.first().dispatchEvent('click');});await page.waitForTimeout(800);x.ownerAfterClear=(await f.innerText()).replace(/\s+/g,' ').slice(0,60);}
 await shot(tag+'-form');await page.getByRole('button',{name:/^Save$/}).last().click({timeout:15000});await page.waitForTimeout(7000);
 const id=(page.url().match(/([0-9a-f]{8}-[0-9a-f-]{27})/)||[])[1];x.id=id;if(id)LED('ticket "'+subject+'" '+id+' form');
 x.postOwner=reqs.map(b=>/"field":"owner"/.test(b)?(b.match(/"field":"owner".{0,60}/)||[''])[0]:'no owner field in POST');
 if(id){await W(2500);x.own=await own(id);x.auto=(await act(id)).filter(a=>a.action==='ticket.auto_assigned').map(a=>({rule:a.summary.rule_name,type:a.summary.rule_type,method:a.summary.strategy,trigger:a.summary.trigger,owner:nm(a.summary.owner_id),skipped:(a.summary.skipped_user_ids||[]).map(nm)}));
  await page.reload({waitUntil:'commit',timeout:120000});await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);await shot(tag+'-saved');
  const h=page.getByRole('tab',{name:/History/i});x.histTab=await h.count();if(x.histTab){await h.first().click();await page.waitForTimeout(3500);await shot(tag+'-history');x.histText=(await page.innerText('main').catch(()=>'')).replace(/\s+/g,' ').slice(0,900);}}
 return x;};
try{R.cleared=await form(PX+' RT15SEQ form cleared',true,'2275-cleared');}catch(e){R.clearedErr=String(e.message).slice(0,200);await shot('2275-cleared-err');}save();
try{R.cleared2=await form(PX+' RT15TRI form cleared',true,'2275-skipped');}catch(e){R.cleared2Err=String(e.message).slice(0,200);}save();
try{R.untouched=await form(PX+' RT15SEQ form untouched',false,'2275-untouched');}catch(e){R.untouchedErr=String(e.message).slice(0,200);}save();
try{await page.goto(H+'/settings/automation/assignment-rules?view=round-robin',{waitUntil:'commit',timeout:120000});for(let i=0;i<30;i++){await page.waitForTimeout(2000);if(/Round Robin/.test(await page.innerText('body').catch(()=>''))&&!/Loading/.test(await page.innerText('body').catch(()=>'')))break;}await page.waitForTimeout(2000);await shot('2275-rules-page');R.rulesPage=(await page.innerText('main').catch(()=>'')).replace(/\s+/g,' ').slice(0,300);}catch(e){R.rulesErr=String(e.message).slice(0,200);}save();
const wf=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;R.wfState={en:wf.is_enabled||wf.enabled,status:wf.status,share:(wf.definition||{}).share_link_enabled,layout:wf.layout_id||(wf.definition||{}).layout_id,owner:JSON.stringify(wf.owner||(wf.definition||{}).owner||'').slice(0,100)};const SS=JSON.stringify(wf.snippets||'');const q=String.fromCharCode(34),bs=String.fromCharCode(92);const ix=SS.indexOf('index.html');if(ix>0){const U=SS.slice(SS.lastIndexOf('https://',ix),SS.indexOf(q,ix)).split(bs).join('').split('&amp;').join('&').split('u0026').join('&');fs.writeFileSync(OUT+'/wf-url.txt',U.replace(/&&/g,'&'));R.wfUrlLen=U.length;}save();
try{
 await setP(p0,{assign_to_offline_agents:true,incoming_mode:'backlog_first',assign_backlogs:true,backlog_limit:50});LED('Dept A incoming=backlog_first, limit 50, offline allowed temporarily');
 const t=await mk(PX+' RT15SEQ backlog first 2',null,{owner:null});await W(4000);const at4=(await own(t.id)).owner;const t0=Date.now();let o='-';while(Date.now()-t0<200000&&o==='-'){await W(5000);o=(await own(t.id)).owner;}
 R.backlogFirst={no:(await own(t.id)).no,at4s:at4,finally:o,sec:Math.round((Date.now()-t0)/1000),trigger:(await act(t.id)).filter(x=>x.action==='ticket.auto_assigned').map(x=>x.summary.trigger+' / '+x.summary.rule_name)};save();
}finally{const b=await api('PUT',prefsUrl,p0);R.prefsBack=b.s;LED('Dept A prefs restored '+b.s);R.same=JSON.stringify(await getP())===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'/prefs-before.json','utf8')));save();}
return 'ok';
