// 7 Nov B-5 evidence rerun: list detached again, rule on briefly, 2 tickets, UI screens, rule off
eval(require('fs').readFileSync('lib.js','utf8'));
await page.setViewportSize({width:1600,height:1000});
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const shot=n=>page.screenshot({path:'../screenshots/'+n+'.png'});const nav=u=>page.goto(H+u,{waitUntil:'commit',timeout:120000});
const o={};
o.detach=sh(await api('PUT','/desk/holiday-lists/'+IDS.HOL1,{name:'QA AS6 HOL today',description:null,category:'year_specific',business_hour_profile_id:null,clear_business_hour_profile:true,detach_business_hours:true}));LED('B-5 evidence: QA AS6 HOL today detached again');
const l=await api('GET','/desk/holiday-lists/'+IDS.HOL1);o.listBH=l.j.data.business_hour_profile_id;
o.on=(await setActive(IDS.DA_B08H,true)).s;LED('B-5 evidence: rule QA AS6 B08 holiday active temporarily');
o.t={};for(const k of ['t1','t2']){const t=await mkTicket('QA AS6 HOL '+k+' detached r2',IDS.DA,{},'B-5 evidence');await sleep(4000);const g=await getT(t.id);o.t[k]={id:t.id,no:g.ticket_number,owner:nm((await own(t.id)).owner)};}
o.off=(await setActive(IDS.DA_B08H,false)).s;LED('B-5 evidence: rule QA AS6 B08 holiday inactive again');
// UI
await nav('/settings/organization/holidays');await page.waitForFunction(()=>/QA AS6 HOL/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);await shot('ev-B5-holiday-lists');
o.holText=(await page.innerText('body')).replace(/\s+/g,' ').match(/Name Category.{0,250}/)?.[0];
await nav('/views/all/tickets/'+o.t.t1.id);await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);await shot('ev-B5-ticket-t1');
await nav('/views/all/tickets/'+o.t.t2.id);await page.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
const hb=page.getByText('HISTORY',{exact:true}).first();if(await hb.count()){await hb.click();await page.waitForTimeout(3500);}await shot('ev-B5-ticket-t2-history');
return o;
