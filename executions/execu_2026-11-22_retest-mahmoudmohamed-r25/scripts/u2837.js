const R={};const calls=[];page.on('response',r=>{const u=r.url();if(/inbound-health|channels\//.test(u))calls.push(r.status()+' '+u.replace(H,''));});
await page.goto(H+'/settings/channels/email/overview',{waitUntil:'commit'});await page.getByText('4 of 4 done').first().waitFor({timeout:90000}).catch(()=>{});await sleep(8000);
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');R.hasLast=/last email received/i.test(t);R.head=t.slice(t.indexOf('Suppressions'),t.indexOf('Suppressions')+700);
await shot('2837-overview.png');R.calls=calls;
await page.goto(H+'/views/all/tickets/8bef574a-1faa-4a30-99e0-55dd53e4738c',{waitUntil:'commit'});await page.getByText('QA RT25 2837 mail round trip 2').first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);await shot('2837-ticket-6235.png');
await page.goto(H+'/views/all/tickets/105927e1-32ea-45a0-97b8-ba4f314d99ce',{waitUntil:'commit'});await page.getByText('Re: Check-in').first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);await shot('2837-ticket-5992.png');
await page.goto(H+'/views/all/tickets/33dfd714-5b9e-4c51-86f4-f33dd1fe9504',{waitUntil:'commit'});await page.getByText('Check-in').first().waitFor({timeout:90000}).catch(()=>{});await sleep(7000);await shot('2837-ticket-1.png');
return R;
