// 8 Nov D-14 web form: owner "unassigned" form in Dept A -> do assignment rules route the ticket?
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={};const wf=(await api('GET','/web-forms/'+IDS.WF_D14)).j.data;const SS=JSON.stringify(wf.snippets);const q=String.fromCharCode(34),bs=String.fromCharCode(92);const ix=SS.indexOf('index.html');const URL=SS.slice(SS.lastIndexOf('https://',ix),SS.indexOf(q,ix)).split(bs).join('').split('&amp;').join('&');
// setup
const seq0=(await getRule(IDS.RR_SEQ)).execute_on;const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
await putRule(IDS.RR_SEQ,{execute_on:['create','update']});await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});
LED('D-14 8 Nov: RR_SEQ create+update and Dept A assign_to_offline_agents ON temporarily');
const drId=IDS.DA_D14;o.direct=(await setActive(drId,true)).s;LED('D-14 8 Nov: direct rule D14 active temporarily');
// submit signed out
const ctx2=await page.context().browser().newContext({viewport:{width:900,height:1000}});const p=await ctx2.newPage();const net=[];
p.on('response',async r=>{if(/web-forms\/public/.test(r.url())&&r.request().method()==='POST'){let t='';try{t=(await r.text()).slice(0,300)}catch(e){}net.push(r.status()+' '+r.url().split('/').slice(-1)[0]+' '+t.replace(/fw1\.[\w.-]+/g,'<key>'));}});
const subs=['QA AS6 D14 direct wf r3','QA AS6 SEQ D14 rr wf r3a','QA AS6 SEQ D14 rr wf r3b','QA AS6 D14 nomatch wf r3'];o.form=[];
for(const s of subs){await p.goto(URL,{waitUntil:'commit',timeout:180000});for(let i=0;i<40;i++){await p.waitForTimeout(2000);if(await p.locator('[id="fw-subject"]').count())break;}
 const labels='';await p.locator('[id="fw-contact.last_name"]').fill('QA AS6 D14');await p.locator('[id="fw-email"]').fill('qa.as6.d14@example.com');await p.locator('[id="fw-subject"]').fill(s);
 await p.getByRole('button',{name:'Send'}).click();await p.waitForTimeout(6000);
 o.form.push({s,after:(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,120)});
 if(s===subs[0])await p.screenshot({path:'../screenshots/ev-D14-webform-submitted.png'});}
o.net=net;await ctx2.close();
const ctl=await mkTicket('QA AS6 SEQ D14 api control',IDS.DA,{},'D-14 8 Nov control');
await sleep(15000);
// find web form tickets
const found={};for(let pg=1;pg<=40&&Object.keys(found).length<subs.length;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100&sort_by=created_at&sort_order=desc');const L=arr(r.j&&r.j.data&&(r.j.data.records||r.j.data));if(!L.length)break;for(const x of L){const f=x.data||x;const sub=f.subject||x.subject;if(subs.includes(sub))found[sub]=x.id;}}
o.tickets=[];for(const s of [...subs,'ctl']){const id=s==='ctl'?ctl.id:found[s];if(!id){o.tickets.push(s+': not found');continue;}LED('ticket "'+s+'" '+id+' D-14 8 Nov web form');
 const w=await own(id);const a=arr(await act(id));const h=a.filter(e=>/assign|owner/.test(e.action||'')).map(e=>(e.action||'')+'/'+(e.summary&&(e.summary.rule_type||'')+'/'+(e.summary.trigger||'')+'/'+nm(e.summary.owner_id))).slice(0,4);
 const t=await getT(id);o.tickets.push({s,id:id.slice(0,8),num:t.ticket_number,owner:nm(w.owner),dept:w.dept===IDS.DA?'DA':w.dept,channel:t.channel,h});}
// restore
o.back=[(await putRule(IDS.RR_SEQ,{execute_on:seq0})).s,sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0)).s];
if(drId)o.drOff=(await setActive(drId,false)).s;LED('D-14 8 Nov: RR_SEQ exec + Dept A prefs restored; direct rule D14 inactive');
return o;
