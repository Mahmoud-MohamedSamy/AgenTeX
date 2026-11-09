// B-1 evidence: RR rule with Ticket Create, ticket created without owner -> owner = creator, no RR entry.
eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const g=await getRule(IDS.RR_SEQ); o.before={exec:g.execute_on,active:g.is_active,crit:JSON.stringify(g.targets).slice(0,200)};
const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
// offline agents allowed, so presence cannot be the reason
o.prefOn=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true}));
o.ruleCreate=await putRule(IDS.RR_SEQ,{execute_on:['create','update']});
const g2=await getRule(IDS.RR_SEQ); o.after={exec:g2.execute_on,active:g2.is_active};
o.tA=await mkTicket('QA AS6 SEQ B1 create no owner',IDS.DA,{},'B-1 evidence');
o.tB=await mkTicket('QA AS6 SEQ B1 create owner null',IDS.DA,{owner:null},'B-1 evidence');
await sleep(10000);
for(const k of ['tA','tB']){const id=o[k].id;o[k].owner=await own(id);o[k].hist=(await hist(id)).slice(0,8);}
// restore
o.ruleBack=await putRule(IDS.RR_SEQ,{execute_on:g.execute_on});
o.prefBack=sh(await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0));
LED('B-1 evidence 7 Nov: RR_SEQ execute_on create+update and Dept A offline agents ON temporarily, both restored');
// screenshot ticket A history
await page.setViewportSize({width:1600,height:1000});
await page.goto(H+'/views/all/tickets/'+o.tA.id,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 SEQ B1 create no owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3500);}
await page.screenshot({path:'../screenshots/ev-B1-tavi-history.png'});
return o;
