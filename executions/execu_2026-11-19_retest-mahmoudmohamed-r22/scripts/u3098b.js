const R={reqs:[]};page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|iam)\/[^?]*(access|sharing|settings)/i.test(u)&&r.request().method()==='GET')R.reqs.push(u.replace(/^https:\/\/[^/]+/,'')+' → '+(await r.text().catch(()=>'')).slice(0,300));});
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings',{waitUntil:'commit'});await page.getByText('Ticket Access',{exact:true}).first().waitFor({timeout:120000});await page.getByText('Ticket Access',{exact:true}).first().click();await sleep(6000);
R.url=page.url().replace(H,'');R.text=(await bt()).slice(0,1200);await shot('3098-r1-b-ticket-access.png',{timeout:90000});return R;
