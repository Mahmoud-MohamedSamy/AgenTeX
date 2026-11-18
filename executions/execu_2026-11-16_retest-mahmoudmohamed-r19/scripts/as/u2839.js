// NDC-2839 screens as the Desk Agent: Assignment Rules page blocked; ticket page owner picker still works (Teams tab from department list). Records 403s seen by the app.
const bad=[];page.on('response',r=>{const u=r.url();if(/\/api\/v1\/desk\/(departments\/[^/]+\/(round-robin-preferences|team-assignment)|assignment)/.test(u))bad.push(r.status()+' '+r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'{id}'));});
await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(9000);
const t1=(await text()).replace(/\s+/g,' ');log('setup page: '+(t1.match(/You can.{0,160}/)||[t1.slice(0,200)])[0]);
await shot('2839-1-agent-assignment-rules-blocked.png');
// ticket list -> open a QA RT19 AS ticket in Dept A
await page.goto(H+'/tickets',{waitUntil:'domcontentloaded'});await sleep(9000);
log('tickets page has QA RT19 AS: '+/QA RT19 AS/.test(await text()));
const row=page.locator('text=/QA RT19 AS/').first();
if(await row.count()){await row.click();await sleep(8000);const t2=(await text()).replace(/\s+/g,' ');log('ticket page len '+t2.length+' error? '+/something went wrong|forbidden|403/i.test(t2));await shot('2839-2-agent-ticket-page.png');}
log('assignment API calls seen: '+JSON.stringify(bad.slice(0,20)));
return {bad};
