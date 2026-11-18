await page.goto(H+'/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/new',{waitUntil:'domcontentloaded'});
await page.getByText(/Support Plan/i).first().waitFor({timeout:200000}).catch(()=>log('no SP label'));await sleep(3000);
log(page.url());
const t=await page.locator('#main-content').innerText();log(t.slice(0,800).replace(/\s+/g,' '));
const lab=page.locator('label').filter({hasText:/^Support Plan/}).first();log('lab',await lab.count());
const ctl=page.locator('[aria-label*="Support Plan" i], [aria-label*="Support plan" i]').first();log('ctl',await ctl.count(),await ctl.evaluate(e=>e.tagName+' '+e.getAttribute('aria-label')).catch(()=>''));
await shot('2841-x4.png');
