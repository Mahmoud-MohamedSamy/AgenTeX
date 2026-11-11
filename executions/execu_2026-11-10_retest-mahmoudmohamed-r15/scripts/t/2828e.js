const reqs=[]; page.on('request',r=>{const u=r.url(); if(/iam\/users/.test(u)) reqs.push(r.method()+' '+u.replace(/.*api\/v1/,''));});
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('input,textarea')).length > 4) break; }
await page.getByText('Ticket Owner',{exact:true}).first().locator('xpath=following::button[1]').click(); await sleep(2000); await shot('2828-owner-open.png');
const inp = page.locator('input[placeholder*="earch" i], [role=dialog] input, [role=listbox] input, [cmdk-input]').last();
await inp.fill('Zamzam'); await sleep(3000);
const opts = await page.$$eval('[role=option]', os => os.map(o=>o.innerText.replace(/\s+/g,' ').trim()).slice(0,10)); log('Zamzam options', opts);
await shot('2828-owner-picker-zamzam.png');
await inp.fill('Abdelrahman Ibrahim'); await sleep(3000);
log('Abdelrahman options', await page.$$eval('[role=option]', os => os.map(o=>o.innerText.replace(/\s+/g,' ').trim()).slice(0,10)));
log('requests', reqs.slice(0,8));
