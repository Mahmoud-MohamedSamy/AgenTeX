const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/';
const ART='6d2442dc-41b0-4990-9317-18e850f1a476'; const out={}; const net=[];
page.on('response',async r=>{ const u=r.url(); if(/\/api\/v1\/(files|desk\/kb\/articles)/.test(u) && r.request().method()!=='GET'){ net.push(r.request().method()+' '+u.split('/api/v1')[1].slice(0,90)+' '+r.status()+' '+(r.request().postData()||'').slice(0,200)); }});
await page.goto(H+'/knowledge-base/articles/'+ART,{waitUntil:'domcontentloaded'}); await sleep(12000);
await page.locator('.ql-editor, [contenteditable=true]').first().click(); await page.keyboard.press('End');
const fcBefore=await page.locator('input[type=file]').count();
const chooser=page.waitForEvent('filechooser',{timeout:8000}).catch(()=>null);
await page.mouse.click(806,245); await sleep(1500);
const fc=await chooser; out.chooser=!!fc;
if(fc){ await fc.setFiles(S+'qa-rt18-article-img.png'); }
else { out.dlg=(await page.locator('[role=dialog]').last().innerText().catch(()=>'')).slice(0,300); const fi=page.locator('[role=dialog] input[type=file]'); if(await fi.count()) await fi.first().setInputFiles(S+'qa-rt18-article-img.png'); }
await sleep(8000);
out.imgs=await page.locator('.ql-editor img, [contenteditable=true] img').count();
await shot('3006-2-article-image-inserted.png');
await page.getByRole('button',{name:/^Save$/}).first().click(); await sleep(5000);
const d=page.locator('[role=dialog]').last(); if(await d.count()){ out.saveDlg=(await d.innerText()).replace(/\s+/g,' ').slice(0,200); await d.getByRole('button',{name:/^(Publish|Save|Confirm)/}).last().click().catch(()=>{}); await sleep(4000);}
await page.goto(H+'/knowledge-base/gallery',{waitUntil:'domcontentloaded'}); await sleep(12000);
const g=(await page.locator('main').last().innerText()).replace(/\s+/g,' '); out.gallery=g.slice(g.indexOf('Upload images'),g.indexOf('Upload images')+400);
await shot('3006-3-gallery-after-insert.png');
out.net=net; return out;
