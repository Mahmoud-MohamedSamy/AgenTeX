const dialogs=[];page.on('dialog',d=>{dialogs.push(d.message());d.dismiss().catch(()=>{});});
const R={};
for(const [n,id] of [['a','1d826a63-54d4-4205-ab0e-a07f7214d8e6'],['b','4c60908e-c317-43ff-8004-61ddec92cb5f']]){
 await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'domcontentloaded'});await page.getByText('Instant actions').first().waitFor({timeout:90000}).catch(()=>{});await sleep(5000);
 const ed=page.locator('.ProseMirror, [contenteditable="true"]').first();await ed.scrollIntoViewIfNeeded().catch(()=>{});await page.mouse.wheel(0,250);await sleep(1500);
 // hover the p to trigger onmouseover if present
 const p=page.getByText('QA hover').first();if(await p.count())await p.hover().catch(()=>{});
 await sleep(1000);
 R[n]={url:page.url(),editor:await page.locator('.ProseMirror, [contenteditable="true"]').evaluateAll(a=>a.map(x=>x.innerHTML.slice(0,600))),
  dangerous:await page.evaluate(()=>[...document.querySelectorAll('[onerror],[onload],[onmouseover],a[href^="javascript"],iframe,script:not([src])')].filter(e=>e.closest('[contenteditable]')).map(e=>e.outerHTML.slice(0,120))),
  xss:String(await page.evaluate(()=>window.__xss))};
 await shot('2963-'+(n==='a'?'3':'4')+'-editor-body-'+n+'.png');
}
R.dialogs=dialogs;return R;
