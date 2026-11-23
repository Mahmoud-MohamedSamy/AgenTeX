await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'commit'});await page.getByText('Round Robin',{exact:true}).first().waitFor({timeout:120000});
await page.getByText('Round Robin',{exact:true}).first().click();await sleep(4000);
await page.getByText('Customer Support',{exact:true}).last().click();await sleep(1500);
await page.getByText('QA AO Dept B',{exact:true}).last().click().catch(e=>log('nodept'));await sleep(4000);
const dots=page.locator('button:right-of(:text("Department"))').first(); 
const btns=page.locator('button[aria-label]');log(await btns.evaluateAll(b=>b.map(x=>x.getAttribute('aria-label')).filter(Boolean).slice(0,40)));
await page.locator('button[aria-label*="ore" i], button[aria-haspopup]').filter({hasNot:page.locator('svg.lucide-chevron-down')}).last().click().catch(e=>log('nodots'));await sleep(1500);
await page.getByText('Preferences').first().click().catch(e=>log('nopref'));await sleep(4000);
await shot('3137-d-preferences.png');log((await text()).replace(/\s+/g,' ').match(/Preferences.{0,900}/)?.[0]);
