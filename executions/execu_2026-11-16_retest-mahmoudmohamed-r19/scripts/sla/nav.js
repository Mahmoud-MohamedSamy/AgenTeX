const D=JSON.parse(require('fs').readFileSync('sla/out/cfg.json','utf8')).D;
const mc=async l=>{const b=await l.first().boundingBox();if(!b)throw new Error('no box');await page.mouse.click(b.x+b.width/2,b.y+b.height/2);await sleep(900);};
const openNew=async(name)=>{await page.goto(H+'/settings/automation/sla?department='+D,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'New SLA'}).waitFor({timeout:90000});await sleep(1500);
await page.getByRole('button',{name:'New SLA'}).click();await sleep(2500);
await page.getByPlaceholder('e.g. Chat Tickets').fill(name);
const cb=page.locator('label').filter({hasText:'Ticket Create'}).locator('input').first();await cb.evaluate(e=>{if(!e.checked)e.click();});await sleep(500);log('createChecked',await cb.isChecked());
await page.getByRole('button',{name:'Next'}).click();await sleep(2000);
await page.getByRole('button',{name:/Add Target/}).click();await sleep(2500);};
