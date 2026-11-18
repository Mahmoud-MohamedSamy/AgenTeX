await page.goto(H+'/settings/users-control/agents/876ce871-2b02-4854-89a7-68050391c62b',{waitUntil:'domcontentloaded'}); await sleep(9000);
const eb=page.getByRole('button',{name:/^edit/i}).first(); log('edit',await eb.count());
if(await eb.count()){await eb.click(); await sleep(4000); const d=await page.locator('[role=dialog]').last().innerText().catch(()=>text()); log('form',d.replace(/\s+/g,' ').slice(0,1500)); await shot('A4-1-agent-edit.png');}
await page.goto(H+'/settings/users-control/ticket-access',{waitUntil:'domcontentloaded'}); await sleep(8000);
const t=await text(); const i=t.indexOf('Ticket Access'); log('ta',t.slice(i,i+1500).replace(/\s+/g,' ')); await shot('A4-2-ticket-access.png');
