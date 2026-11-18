const dialogs=[];page.on('dialog',d=>{dialogs.push(d.message());d.dismiss().catch(()=>{});});
await page.addInitScript(()=>{window.__xss=undefined;});
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(2500);
await page.getByPlaceholder('Search rules…').fill('QA RT18 WF 2963');await sleep(2500);
await page.getByRole('row').filter({hasText:'QA RT18 WF 2963'}).first().getByText('QA RT18 WF 2963').first().click();
await sleep(6000);log('url',page.url());
const m=(await text()).replace(/\s+/g,' ');const i=m.indexOf('Add Comment');log('text',m.slice(Math.max(0,i-300),i+800));
await shot('2963-1-editor.png');
// expand action
const ac=page.getByText(/Add (Ticket )?Comment/).first();if(await ac.count()){await ac.click().catch(()=>{});await sleep(3000);}
const imgs=await page.locator('img').evaluateAll(a=>a.map(x=>({src:x.getAttribute('src'),onerror:x.getAttribute('onerror'),outer:x.outerHTML.slice(0,160)})).filter(x=>x.src==='x'||/onerror/.test(x.outer)));
log('imgs',imgs);
const pm=await page.locator('.ProseMirror, [contenteditable="true"]').evaluateAll(a=>a.map(x=>x.innerHTML.slice(0,400)));log('editors',pm);
const flag=await page.evaluate(()=>window.__xss);log('xss',String(flag));
await shot('2963-2-comment-expanded.png');
log('dialogs',dialogs);
return {xss:String(flag)};
